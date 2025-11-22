import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.1";
import Papa from "https://esm.sh/papaparse@5.4.1";
import * as XLSX from "https://esm.sh/xlsx@0.18.5";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ParsedRow {
  row_number: number;
  data: any;
  status: 'valid' | 'error' | 'warning';
  errors: string[];
  warnings: string[];
}

const REQUIRED_FIELDS = ['title_en', 'title_fr', 'listing_type', 'price', 'address_text', 'city', 'province'];
const VALID_LISTING_TYPES = ['sale', 'rent', 'shared', 'student', 'co_ownership', 'auction', 'ppp'];
const VALID_PROVINCES = ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'];

function validateRow(row: any, rowNumber: number): ParsedRow {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required fields
  for (const field of REQUIRED_FIELDS) {
    if (!row[field] || String(row[field]).trim() === '') {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate listing type
  if (row.listing_type && !VALID_LISTING_TYPES.includes(row.listing_type.toLowerCase())) {
    errors.push(`Invalid listing_type. Must be one of: ${VALID_LISTING_TYPES.join(', ')}`);
  }

  // Validate price
  const price = parseFloat(row.price);
  if (isNaN(price)) {
    errors.push('Price must be a valid number');
  } else if (price <= 0) {
    errors.push('Price must be greater than 0');
  }

  // Validate province
  if (row.province && !VALID_PROVINCES.includes(row.province.toUpperCase())) {
    errors.push(`Invalid province code. Must be one of: ${VALID_PROVINCES.join(', ')}`);
  }

  // Validate optional numeric fields
  if (row.bedrooms && (isNaN(parseInt(row.bedrooms)) || parseInt(row.bedrooms) < 0)) {
    warnings.push('Bedrooms must be a positive number');
  }
  if (row.bathrooms && (isNaN(parseFloat(row.bathrooms)) || parseFloat(row.bathrooms) < 0)) {
    warnings.push('Bathrooms must be a positive number');
  }

  // Validate image URLs
  if (row.image_urls) {
    const urls = String(row.image_urls).split(',').map(u => u.trim());
    const invalidUrls = urls.filter(url => {
      try {
        new URL(url);
        return !url.match(/\.(jpg|jpeg|png|gif|webp)$/i);
      } catch {
        return true;
      }
    });
    if (invalidUrls.length > 0) {
      warnings.push(`Invalid image URLs (will be skipped): ${invalidUrls.join(', ')}`);
    }
  }

  // Check text field lengths
  if (row.description_en && row.description_en.length > 5000) {
    warnings.push('Description (English) is very long (>5000 chars)');
  }
  if (row.description_fr && row.description_fr.length > 5000) {
    warnings.push('Description (French) is very long (>5000 chars)');
  }

  const status = errors.length > 0 ? 'error' : warnings.length > 0 ? 'warning' : 'valid';

  return {
    row_number: rowNumber,
    data: row,
    status,
    errors,
    warnings,
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Check rate limiting: max 10 imports per day per user (admins exempt)
    const { data: isAdmin } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin' as any
    });

    if (!isAdmin) {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const { data: recentImports, error: countError } = await supabase
        .from('bulk_import_logs')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', oneDayAgo.toISOString());

      if (!countError && recentImports && (recentImports as any).count >= 10) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Maximum 10 imports per day.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Check if user has required role
    const allowedRoles = ['agent', 'landlord', 'business_manager', 'admin'];
    let hasPermission = false;
    for (const role of allowedRoles) {
      const { data } = await supabase.rpc('has_role', { _user_id: user.id, _role: role });
      if (data) {
        hasPermission = true;
        break;
      }
    }

    if (!hasPermission) {
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions. This feature requires agent, landlord, business_manager, or admin role.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      throw new Error('No file provided');
    }

    const fileName = file.name;
    const fileSize = file.size;

    // Check file size (10MB max)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (fileSize > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ error: `File size exceeds 10MB limit. Your file is ${(fileSize / 1024 / 1024).toFixed(2)}MB.` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse file based on type
    let rows: any[] = [];
    
    if (fileName.endsWith('.csv') || file.type.includes('csv')) {
      const text = await file.text();
      
      // Use PapaParse for robust CSV parsing
      const parseResult = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
        transform: (value) => value.trim()
      });

      if (parseResult.errors.length > 0) {
        console.error('CSV parsing errors:', parseResult.errors);
        return new Response(
          JSON.stringify({ 
            error: `CSV parsing failed: ${parseResult.errors[0].message}`,
            details: parseResult.errors.slice(0, 5) // First 5 errors
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      rows = parseResult.data;
    } else if (fileName.endsWith('.xlsx') || file.type.includes('spreadsheet')) {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      // Use first sheet
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Convert to JSON with headers
      rows = XLSX.utils.sheet_to_json(worksheet, {
        raw: false, // Get formatted strings
        defval: '' // Default value for empty cells
      });
    } else {
      throw new Error('Unsupported file type. Please upload CSV (.csv) or Excel (.xlsx) file.');
    }

    // Check row count limits
    if (rows.length === 0) {
      throw new Error('File is empty or contains no valid data rows.');
    }

    if (rows.length > 1000) {
      return new Response(
        JSON.stringify({ error: `Too many rows. Maximum 1000 rows allowed. Your file has ${rows.length} rows.` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (rows.length > 500) {
      console.warn(`Large import: ${rows.length} rows. This may take several minutes.`);
    }

    // Validate each row
    const parsedRows = rows.map((row, index) => validateRow(row, index + 2)); // +2 because row 1 is headers

    const validRows = parsedRows.filter(r => r.status === 'valid');
    const errorRows = parsedRows.filter(r => r.status === 'error');
    const warningRows = parsedRows.filter(r => r.status === 'warning');

    // Store parsed data temporarily
    const parsedDataId = crypto.randomUUID();
    const { error: storageError } = await supabase
      .from('bulk_import_logs')
      .insert({
        id: parsedDataId,
        user_id: user.id,
        file_name: file.name,
        row_count: rows.length,
        status: 'pending',
        details: { parsed_rows: parsedRows }
      });

    if (storageError) {
      console.error('Error storing parsed data:', storageError);
      throw storageError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        preview: {
          valid_rows: validRows,
          error_rows: errorRows,
          warning_rows: warningRows,
          total: rows.length,
          valid_count: validRows.length,
          error_count: errorRows.length,
          warning_count: warningRows.length,
        },
        parsed_data_id: parsedDataId,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in parse-bulk-listings:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});