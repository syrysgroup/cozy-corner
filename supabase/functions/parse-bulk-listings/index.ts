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

interface DuplicateCheckResult {
  isDuplicate: boolean;
  matchType?: 'exact_address' | 'similar_title';
  existingListingId?: string;
}

const REQUIRED_FIELDS = ['title_en', 'title_fr', 'listing_type', 'price', 'address_text', 'city', 'province'];
const VALID_LISTING_TYPES = ['sale', 'rent', 'shared', 'student', 'co_ownership', 'auction', 'ppp'];
const VALID_PROVINCES = ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'];

// Sanitize string input to prevent XSS/injection
function sanitizeString(value: any): string {
  if (value === null || value === undefined) return '';
  return String(value)
    .trim()
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+\s*=/gi, ''); // Remove inline event handlers
}

// Normalize string for comparison
function normalizeForComparison(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

// Calculate similarity between two strings (simple Jaccard similarity)
function calculateSimilarity(str1: string, str2: string): number {
  const set1 = new Set(str1.toLowerCase().split(/\s+/));
  const set2 = new Set(str2.toLowerCase().split(/\s+/));
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return intersection.size / union.size;
}

// Check if URL is accessible (with timeout)
async function validateImageUrl(url: string, timeoutMs: number = 5000): Promise<{ valid: boolean; error?: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      return { valid: false, error: `HTTP ${response.status}` };
    }
    
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) {
      return { valid: false, error: 'Not an image' };
    }
    
    return { valid: true };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return { valid: false, error: 'Timeout' };
    }
    return { valid: false, error: error.message || 'Connection failed' };
  }
}

function validateRow(row: any, rowNumber: number): ParsedRow {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Sanitize all string fields
  const sanitizedRow: any = {};
  for (const key of Object.keys(row)) {
    sanitizedRow[key] = sanitizeString(row[key]);
  }

  // Check required fields
  for (const field of REQUIRED_FIELDS) {
    if (!sanitizedRow[field] || sanitizedRow[field] === '') {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate title lengths
  if (sanitizedRow.title_en && sanitizedRow.title_en.length > 200) {
    errors.push('Title (English) must be less than 200 characters');
  }
  if (sanitizedRow.title_fr && sanitizedRow.title_fr.length > 200) {
    errors.push('Title (French) must be less than 200 characters');
  }

  // Validate listing type
  if (sanitizedRow.listing_type && !VALID_LISTING_TYPES.includes(sanitizedRow.listing_type.toLowerCase())) {
    errors.push(`Invalid listing_type. Must be one of: ${VALID_LISTING_TYPES.join(', ')}`);
  }

  // Validate price
  const price = parseFloat(sanitizedRow.price);
  if (isNaN(price)) {
    errors.push('Price must be a valid number');
  } else if (price <= 0) {
    errors.push('Price must be greater than 0');
  } else if (price > 999999999) {
    errors.push('Price exceeds maximum allowed value');
  }

  // Validate province
  if (sanitizedRow.province && !VALID_PROVINCES.includes(sanitizedRow.province.toUpperCase())) {
    errors.push(`Invalid province code. Must be one of: ${VALID_PROVINCES.join(', ')}`);
  }

  // Validate address length
  if (sanitizedRow.address_text && sanitizedRow.address_text.length > 500) {
    errors.push('Address must be less than 500 characters');
  }

  // Validate city length
  if (sanitizedRow.city && sanitizedRow.city.length > 100) {
    errors.push('City name must be less than 100 characters');
  }

  // Validate optional numeric fields
  if (sanitizedRow.bedrooms) {
    const bedrooms = parseInt(sanitizedRow.bedrooms);
    if (isNaN(bedrooms) || bedrooms < 0) {
      warnings.push('Bedrooms must be a positive number');
    } else if (bedrooms > 50) {
      warnings.push('Bedrooms value seems unusually high');
    }
  }
  if (sanitizedRow.bathrooms) {
    const bathrooms = parseFloat(sanitizedRow.bathrooms);
    if (isNaN(bathrooms) || bathrooms < 0) {
      warnings.push('Bathrooms must be a positive number');
    } else if (bathrooms > 50) {
      warnings.push('Bathrooms value seems unusually high');
    }
  }

  // Validate image URLs format (detailed validation done separately)
  if (sanitizedRow.image_urls) {
    const urls = sanitizedRow.image_urls.split(',').map((u: string) => u.trim());
    if (urls.length > 20) {
      warnings.push('Maximum 20 images allowed per listing');
    }
    const invalidUrls = urls.slice(0, 20).filter((url: string) => {
      if (!url) return false;
      try {
        const parsed = new URL(url);
        if (!['http:', 'https:'].includes(parsed.protocol)) return true;
        return !url.match(/\.(jpg|jpeg|png|gif|webp)$/i);
      } catch {
        return true;
      }
    });
    if (invalidUrls.length > 0) {
      warnings.push(`Invalid image URL format (will be skipped): ${invalidUrls.slice(0, 3).join(', ')}${invalidUrls.length > 3 ? '...' : ''}`);
    }
  }

  // Check text field lengths
  if (sanitizedRow.description_en && sanitizedRow.description_en.length > 5000) {
    warnings.push('Description (English) is very long (>5000 chars), will be truncated');
    sanitizedRow.description_en = sanitizedRow.description_en.substring(0, 5000);
  }
  if (sanitizedRow.description_fr && sanitizedRow.description_fr.length > 5000) {
    warnings.push('Description (French) is very long (>5000 chars), will be truncated');
    sanitizedRow.description_fr = sanitizedRow.description_fr.substring(0, 5000);
  }

  const status = errors.length > 0 ? 'error' : warnings.length > 0 ? 'warning' : 'valid';

  return {
    row_number: rowNumber,
    data: sanitizedRow,
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

      const { count, error: countError } = await supabase
        .from('bulk_import_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', oneDayAgo.toISOString());

      console.log(`Rate limit check: user ${user.id} has ${count} imports in last 24h`);

      if (!countError && count !== null && count >= 10) {
        return new Response(
          JSON.stringify({ 
            error: 'Rate limit exceeded. Maximum 10 imports per day.',
            code: 'RATE_LIMIT_EXCEEDED',
            details: { current_count: count, limit: 10 }
          }),
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

    // ==================== DUPLICATE DETECTION ====================
    console.log('Starting duplicate detection...');
    
    // Fetch existing listings for the user to check for duplicates
    const { data: existingListings, error: listingsError } = await supabase
      .from('listings')
      .select('id, title_en, title_fr, address_text, city, province')
      .eq('user_id', user.id);

    if (listingsError) {
      console.error('Error fetching existing listings for duplicate check:', listingsError);
    }

    const duplicatesFound: Array<{ row_number: number; match_type: string; existing_id: string }> = [];

    if (existingListings && existingListings.length > 0) {
      for (const parsedRow of parsedRows) {
        if (parsedRow.status === 'error') continue; // Skip rows with errors
        
        const rowData = parsedRow.data;
        
        // Check for exact address match (normalized)
        const rowAddressKey = normalizeForComparison(
          `${rowData.address_text || ''}${rowData.city || ''}${rowData.province || ''}`
        );
        
        for (const existing of existingListings) {
          const existingAddressKey = normalizeForComparison(
            `${existing.address_text || ''}${existing.city || ''}${existing.province || ''}`
          );
          
          if (rowAddressKey && existingAddressKey && rowAddressKey === existingAddressKey) {
            parsedRow.warnings.push(`Potential duplicate: Exact address match with existing listing`);
            if (parsedRow.status === 'valid') {
              parsedRow.status = 'warning';
            }
            duplicatesFound.push({
              row_number: parsedRow.row_number,
              match_type: 'exact_address',
              existing_id: existing.id
            });
            break;
          }
          
          // Check for similar titles (>80% similarity)
          const titleSimilarity = Math.max(
            calculateSimilarity(rowData.title_en || '', existing.title_en || ''),
            calculateSimilarity(rowData.title_fr || '', existing.title_fr || '')
          );
          
          if (titleSimilarity > 0.8) {
            parsedRow.warnings.push(`Potential duplicate: Similar title found (${Math.round(titleSimilarity * 100)}% match)`);
            if (parsedRow.status === 'valid') {
              parsedRow.status = 'warning';
            }
            duplicatesFound.push({
              row_number: parsedRow.row_number,
              match_type: 'similar_title',
              existing_id: existing.id
            });
            break;
          }
        }
      }
    }

    console.log(`Duplicate detection complete. Found ${duplicatesFound.length} potential duplicates.`);

    // ==================== IMAGE URL VALIDATION ====================
    console.log('Starting image URL validation...');
    
    const imageValidationResults: Array<{ row_number: number; url: string; error: string }> = [];
    
    // Limit validation to avoid timeout (max 3 images per row, max 30 total)
    let totalImagesValidated = 0;
    const MAX_TOTAL_VALIDATIONS = 30;
    const MAX_PER_ROW = 3;

    for (const parsedRow of parsedRows) {
      if (parsedRow.status === 'error') continue;
      if (totalImagesValidated >= MAX_TOTAL_VALIDATIONS) break;
      
      const imageUrls = parsedRow.data.image_urls;
      if (!imageUrls) continue;
      
      const urls = imageUrls.split(',').map((u: string) => u.trim()).filter((u: string) => u);
      const urlsToValidate = urls.slice(0, MAX_PER_ROW);
      
      for (const url of urlsToValidate) {
        if (totalImagesValidated >= MAX_TOTAL_VALIDATIONS) break;
        
        try {
          new URL(url); // Basic URL validation
          const result = await validateImageUrl(url);
          
          if (!result.valid) {
            parsedRow.warnings.push(`Image URL not accessible: ${url.substring(0, 50)}... (${result.error})`);
            if (parsedRow.status === 'valid') {
              parsedRow.status = 'warning';
            }
            imageValidationResults.push({
              row_number: parsedRow.row_number,
              url: url,
              error: result.error || 'Unknown error'
            });
          }
          
          totalImagesValidated++;
        } catch {
          // URL parsing failed - already handled by format validation
        }
      }
    }

    console.log(`Image URL validation complete. Validated ${totalImagesValidated} images, found ${imageValidationResults.length} issues.`);

    // Recalculate counts after duplicate and image validation
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
        warning_count: warningRows.length,
        status: 'pending',
        details: { 
          parsed_rows: parsedRows,
          duplicates_found: duplicatesFound,
          image_validation_results: imageValidationResults
        }
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
          duplicates_found: duplicatesFound.length,
          images_validated: totalImagesValidated,
          image_issues: imageValidationResults.length,
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
