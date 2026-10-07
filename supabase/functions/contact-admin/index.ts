import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@4';
const schema=z.discriminatedUnion('action',[
 z.object({action:z.literal('list'),query:z.string().max(100).default(''),status:z.enum(['','Received','Assigned','In Review','Responded','Closed']).default(''),type:z.enum(['','general','institutional','publications','website','accessibility','media','other']).default(''),language:z.enum(['','en','fr','pt']).default(''),country:z.string().max(100).default(''),unit:z.string().max(200).default(''),date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/).or(z.literal('')).default('')}),
 z.object({action:z.literal('detail'),id:z.uuid()}),
 z.object({action:z.literal('update'),id:z.uuid(),status:z.enum(['Received','Assigned','In Review','Responded','Closed']),unit:z.string().trim().max(200)}),
 z.object({action:z.literal('note'),id:z.uuid(),note:z.string().trim().min(1).max(2000)}),
 z.object({action:z.literal('configuration')}),
 z.object({action:z.literal('content'),language:z.enum(['en','fr','pt']),content:z.record(z.string(),z.unknown()),published:z.boolean()}),
 z.object({action:z.literal('route'),type:z.enum(['general','institutional','publications','website','accessibility','media','other']),unit:z.string().trim().min(1).max(200),email:z.email().max(255).or(z.literal('')),enabled:z.boolean()}),
 z.object({action:z.literal('export')})
]);
const contact=z.object({office_name:z.string().max(250).optional(),email:z.email().optional(),phone:z.string().regex(/^[+\d ()-]{5,40}$/).optional(),address:z.string().max(500).optional(),city:z.string().max(100).optional(),country:z.string().max(100).optional(),hours:z.string().max(200).optional(),visitor_information:z.string().max(1000).optional(),map_url:z.url().refine(v=>{const u=new URL(v);return u.protocol==='https:'&&['www.google.com','maps.google.com','www.openstreetmap.org'].includes(u.hostname);}).optional()}).strict();
const contentSchema=z.object({language:z.enum(['en','fr','pt']),general:contact.optional(),media:contact.optional(),accessibility:contact.optional(),privacy_notice:z.string().max(5000).optional(),faqs:z.array(z.object({question:z.string().min(1).max(250),answer:z.string().min(1).max(2000)})).max(30).optional(),categories:z.array(z.object({value:z.enum(['general','institutional','publications','website','accessibility','media','other']),label:z.string().min(1).max(100)})).max(7).optional()}).strict();
Deno.serve(async req=>{
 const respond=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...corsHeaders,'Content-Type':'application/json','Cache-Control':'no-store'}});
 if(req.method==='OPTIONS')return new Response('ok',{headers:corsHeaders});
 if(req.method!=='POST')return respond({error:'Method not allowed'},405);
 try{
 const url=Deno.env.get('SUPABASE_URL'),key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'); if(!url||!key)return respond({error:'Service unavailable'},503);
 const db=createClient(url,key); const token=req.headers.get('Authorization')?.replace(/^Bearer /,'');if(!token)return respond({error:'Sign in required'},401);
 const {data:auth,error:authError}=await db.auth.getUser(token);if(authError||!auth.user)return respond({error:'Sign in required'},401);
 const {data:staff,error:staffError}=await db.from('contact_staff').select('can_export').eq('user_id',auth.user.id).maybeSingle();if(staffError||!staff)return respond({error:'Contact administration access required'},403);
 const raw=await req.text();if(raw.length>24000)return respond({error:'Request too large'},413);
 const parsed=schema.safeParse(JSON.parse(raw));if(!parsed.success)return respond({error:'Invalid request'},400);const p=parsed.data;
 const log=async(action:string,id?:string)=>{const {error}=await db.from('contact_audit').insert({actor_id:auth.user.id,action,record_id:id});if(error)throw error;};
 if(p.action==='list'){
 await log('enquiries_searched');let q=db.from('contact_enquiries').select('id,reference_number,enquiry_type,status,assigned_unit,preferred_language,country,created_at').order('created_at',{ascending:false}).limit(100);
 if(p.query)q=q.ilike('reference_number',`%${p.query.replace(/[%_]/g,'')}%`);if(p.status)q=q.eq('status',p.status);if(p.type)q=q.eq('enquiry_type',p.type);if(p.language)q=q.eq('preferred_language',p.language);if(p.country)q=q.eq('country',p.country);if(p.unit)q=q.eq('assigned_unit',p.unit);if(p.date)q=q.gte('created_at',`${p.date}T00:00:00Z`);
 const {data,error}=await q;if(error)throw error;return respond({data});}
 if(p.action==='detail'){await log('enquiry_accessed',p.id);const [record,notes]=await Promise.all([db.from('contact_enquiries').select('*').eq('id',p.id).single(),db.from('contact_notes').select('id,note,created_at').eq('enquiry_id',p.id).order('created_at')]);if(record.error||notes.error)throw record.error||notes.error;return respond({data:record.data,notes:notes.data});}
 if(p.action==='update'){await log('status_or_assignment_changed',p.id);const {error}=await db.from('contact_enquiries').update({status:p.status,assigned_unit:p.unit||null,resolved_at:p.status==='Closed'?new Date().toISOString():null}).eq('id',p.id);if(error)throw error;return respond({ok:true});}
 if(p.action==='note'){await log('internal_note_added',p.id);const {error}=await db.from('contact_notes').insert({enquiry_id:p.id,actor_id:auth.user.id,note:p.note});if(error)throw error;return respond({ok:true});}
 if(p.action==='configuration'){await log('configuration_accessed');const [content,routes]=await Promise.all([db.from('site_content').select('id,content_key,content,is_published').eq('section','contact'),db.from('contact_routes').select('*')]);if(content.error||routes.error)throw content.error||routes.error;return respond({content:content.data,routes:routes.data});}
 if(p.action==='content'){const checked=contentSchema.safeParse({...p.content,language:p.language});if(!checked.success)return respond({error:'Invalid contact information or unsafe map URL'},400);await log('public_contact_information_changed',p.language);const key=`public_${p.language}`;const {data:existing,error:lookupError}=await db.from('site_content').select('id').eq('section','contact').eq('content_key',key).maybeSingle();if(lookupError)throw lookupError;const value={section:'contact',content_key:key,content:checked.data,is_published:p.published,is_placeholder:false};const result=existing?await db.from('site_content').update(value).eq('id',existing.id):await db.from('site_content').insert(value);if(result.error)throw result.error;return respond({ok:true});}
 if(p.action==='route'){await log('routing_configuration_changed',p.type);const {error}=await db.from('contact_routes').upsert({enquiry_type:p.type,assigned_unit:p.unit,destination_email:p.email||null,enabled:p.enabled});if(error)throw error;return respond({ok:true});}
 if(!staff.can_export)return respond({error:'Export permission required'},403);await log('records_exported');const {data,error}=await db.from('contact_enquiries').select('*').order('created_at',{ascending:false}).limit(1000);if(error)throw error;return respond({data,limit:1000});
 }catch(error){return respond({error:error instanceof SyntaxError?'Invalid JSON':'The request could not be completed'},error instanceof SyntaxError?400:500);}
});
