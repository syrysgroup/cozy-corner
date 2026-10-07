import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
Deno.serve(req => {
 if(req.method==='OPTIONS') return new Response('ok',{headers:corsHeaders});
 // Fail closed regardless of browser state, payload, CMS configuration or caller role.
 return new Response(JSON.stringify({code:'SUBMISSIONS_CLOSED',error:'Online enquiries are currently unavailable. No enquiry has been saved.'}),{status:503,headers:{...corsHeaders,'Content-Type':'application/json','Cache-Control':'no-store'}});
});
