import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
Deno.test('contact submit source blocks every non-preflight request without persistence',async()=>{
 const code=await Deno.readTextFile(new URL('./index.ts',import.meta.url));
 assertEquals(code.includes('status:503'),true);
 assertEquals(code.includes("code:'SUBMISSIONS_CLOSED'"),true);
 assertEquals(code.includes('.insert('),false);
});
