import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const { parsed_data_id, publish_as_draft = true, skip_warnings = false } = await req.json();

    if (!parsed_data_id) {
      throw new Error('No parsed_data_id provided');
    }

    // Get the parsed data
    const { data: importLog, error: fetchError } = await supabase
      .from('bulk_import_logs')
      .select('*')
      .eq('id', parsed_data_id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !importLog) {
      throw new Error('Import log not found or unauthorized');
    }

    // Update status to processing
    await supabase
      .from('bulk_import_logs')
      .update({ status: 'processing' })
      .eq('id', parsed_data_id);

    const parsedRows = importLog.details.parsed_rows;
    const rowsToImport = skip_warnings 
      ? parsedRows.filter((r: any) => r.status === 'valid')
      : parsedRows.filter((r: any) => r.status === 'valid' || r.status === 'warning');

    let successCount = 0;
    let errorCount = 0;
    let geocodedCount = 0;
    const importErrors: any[] = [];
    const createdListingIds: string[] = [];

    // Update progress every N rows
    const progressUpdateInterval = 10;

    // Process each row
    for (let i = 0; i < rowsToImport.length; i++) {
      const parsedRow = rowsToImport[i];
      
      try {
        const row = parsedRow.data;

        // Prepare image URLs
        let imageUrls: string[] = [];
        if (row.image_urls) {
          imageUrls = String(row.image_urls)
            .split(',')
            .map((u: string) => u.trim())
            .filter((url: string) => {
              try {
                new URL(url);
                return url.match(/\.(jpg|jpeg|png|gif|webp)$/i);
              } catch {
                return false;
              }
            });
        }

        // Prepare amenities
        let amenities: string[] = [];
        if (row.amenities) {
          amenities = String(row.amenities)
            .split(',')
            .map((a: string) => a.trim())
            .filter((a: string) => a.length > 0);
        }

        // Create listing
        const listingData: any = {
          user_id: user.id,
          title_en: row.title_en,
          title_fr: row.title_fr,
          listing_type: row.listing_type.toLowerCase(),
          price: parseFloat(row.price),
          address_text: row.address_text,
          city: row.city,
          province: row.province.toUpperCase(),
          status: publish_as_draft ? 'draft' : 'published',
          image_urls: imageUrls,
          amenities: amenities,
        };

        // Add optional fields
        if (row.description_en) listingData.description_en = row.description_en;
        if (row.description_fr) listingData.description_fr = row.description_fr;
        if (row.bedrooms) listingData.bedrooms = parseInt(row.bedrooms);
        if (row.bathrooms) listingData.bathrooms = parseFloat(row.bathrooms);
        if (row.property_size) listingData.property_size = parseFloat(row.property_size);
        if (row.lot_size) listingData.lot_size = parseFloat(row.lot_size);
        if (row.unit_count) listingData.unit_count = parseInt(row.unit_count);
        if (row.rent_frequency) listingData.rent_frequency = row.rent_frequency;

        const { data: listing, error: insertError } = await supabase
          .from('listings')
          .insert(listingData)
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        createdListingIds.push(listing.id);

        // Geocode if coordinates missing
        if (listing && (!row.latitude || !row.longitude)) {
          try {
            const geocodeQuery = `${row.address_text}, ${row.city}, ${row.province}, Canada`;
            
            const { data: geocodeData, error: geocodeError } = await supabase.functions.invoke('geocode', {
              body: { 
                address: geocodeQuery,
                action: 'forward'
              }
            });

            if (!geocodeError && geocodeData?.latitude && geocodeData?.longitude) {
              // Update listing with geocoded coordinates
              await supabase
                .from('listings')
                .update({
                  formatted_address: geocodeData.formatted_address,
                })
                .eq('id', listing.id);
              
              geocodedCount++;
              console.log(`Geocoded listing ${listing.id}: ${geocodeData.formatted_address}`);
            } else {
              console.warn(`Failed to geocode row ${parsedRow.row_number}:`, geocodeError);
            }
          } catch (geocodeErr: any) {
            console.error(`Geocoding error for row ${parsedRow.row_number}:`, geocodeErr);
            // Don't fail the import for geocoding errors
          }
        }

        successCount++;
      } catch (error: any) {
        console.error(`Error importing row ${parsedRow.row_number}:`, error);
        errorCount++;
        importErrors.push({
          row_number: parsedRow.row_number,
          error: error.message,
          data: parsedRow.data,
        });
      }

      // Update progress periodically
      if ((i + 1) % progressUpdateInterval === 0 || i === rowsToImport.length - 1) {
        await supabase
          .from('bulk_import_logs')
          .update({
            success_count: successCount,
            error_count: errorCount,
            details: {
              ...importLog.details,
              current_row: i + 1,
              geocoded_count: geocodedCount,
              import_errors: importErrors,
              created_listing_ids: createdListingIds,
            }
          })
          .eq('id', parsed_data_id);
      }
    }

    // Update import log with final status
    await supabase
      .from('bulk_import_logs')
      .update({
        status: 'completed',
        success_count: successCount,
        error_count: errorCount,
        completed_at: new Date().toISOString(),
        details: {
          ...importLog.details,
          import_errors: importErrors,
          geocoded_count: geocodedCount,
          created_listing_ids: createdListingIds,
        }
      })
      .eq('id', parsed_data_id);

    return new Response(
      JSON.stringify({
        success: true,
        results: {
          total_processed: rowsToImport.length,
          success_count: successCount,
          error_count: errorCount,
          geocoded_count: geocodedCount,
          errors: importErrors,
          created_listing_ids: createdListingIds,
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in process-bulk-import:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
