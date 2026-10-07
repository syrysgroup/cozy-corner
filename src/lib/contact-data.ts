import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { contactContentSchema, type ContactContent } from './contact-schema';
import type { Lang } from './i18n';
let request: Promise<ContactContent[]> | undefined;
export function useContactContent(lang: Lang) {
 const [records,setRecords]=useState<ContactContent[]>([]); const [failed,setFailed]=useState(false);
 useEffect(()=>{let active=true; request ??= Promise.resolve(supabase.from('site_content').select('content').eq('section','contact').eq('is_published',true).eq('is_placeholder',false).then(({data,error})=>{if(error)throw error; return (data??[]).flatMap(row=>{const parsed=contactContentSchema.safeParse(row.content);return parsed.success?[parsed.data]:[];});})); request.then(data=>{if(active)setRecords(data);}).catch(()=>{if(active)setFailed(true);request=undefined;});return()=>{active=false;};},[]);
 return {content:records.find(r=>r.language===lang),failed};
}
