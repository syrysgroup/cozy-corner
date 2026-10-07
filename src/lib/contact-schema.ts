import { z } from 'zod';
export const ENQUIRY_TYPES = ['general','institutional','publications','website','accessibility','media','other'] as const;
export const SUBMISSIONS_OPEN = false;
export const enquirySchema = z.object({
  first_name: z.string().trim().min(1).max(100), last_name: z.string().trim().min(1).max(100),
  email: z.email().max(255), organization: z.string().trim().max(200), country: z.string().trim().max(100),
  enquiry_type: z.enum(ENQUIRY_TYPES), subject: z.string().trim().min(1).max(200), message: z.string().trim().min(1).max(5000),
  preferred_language: z.enum(['en','fr','pt']), consent_recorded: z.literal(true),
}).strict();
export const publicContactSchema = z.object({office_name:z.string().max(250).optional(),email:z.email().optional(),phone:z.string().regex(/^[+\d ()-]{5,40}$/).optional(),address:z.string().max(500).optional(),city:z.string().max(100).optional(),country:z.string().max(100).optional(),hours:z.string().max(200).optional(),visitor_information:z.string().max(1000).optional(),map_url:z.url().refine(v=>{const u=new URL(v);return u.protocol==='https:' && ['www.google.com','maps.google.com','www.openstreetmap.org'].includes(u.hostname);}).optional()}).strict();
export const contactContentSchema = z.object({language:z.enum(['en','fr','pt']),general:publicContactSchema.optional(),media:publicContactSchema.optional(),accessibility:publicContactSchema.optional(),privacy_notice:z.string().max(5000).optional(),faqs:z.array(z.object({question:z.string().min(1).max(250),answer:z.string().min(1).max(2000)})).max(30).optional(),categories:z.array(z.object({value:z.enum(ENQUIRY_TYPES),label:z.string().min(1).max(100)})).max(7).optional()}).strict();
export type ContactContent = z.infer<typeof contactContentSchema>;
