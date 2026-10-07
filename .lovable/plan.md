# Contact page

Upgrade the existing `/contact` experience using the more complete Contact page already in the project. Keep the single Contact item in the top bar.

## What changes
1. **Connect the real page.** `/contact` currently shows a placeholder. Point it at the full Contact page (office details, help channels, enquiry form, location, media, IntegrityLine, accessibility, FAQs). No new menu item.
2. **Enquiry routes.** Keep the existing destinations:
   - Media: the media section and the media centre
   - Careers: `/opportunities/careers`
   - Procurement: `/opportunities/procurement`
   - IntegrityLine: `/integrityline`
   - Accessibility: the accessibility assistance section
   Add clear notes beside the form saying that integrity reports, job applications and procurement bids must not be sent through it, with a link to the right channel for each.
3. **Verified information only.** Office details, FAQs, privacy text and enquiry categories come only from the existing staff-managed contact content, using published records in the visitor's language. Anything missing stays hidden or shows the current "to be published" note. Nothing is invented.
4. **Safe, honest form.**
   - Every field gets a visible label, a required/optional marker, help text where useful, and an error message linked to its field.
   - When the form has errors, a summary of them appears at the top and receives keyboard focus.
   - Message length is limited, with a live count of remaining characters.
   - The consent checkbox is required.
   - Sending stays disabled, with a clear notice, until approved spam protection and a secure submission process are ready. The submission service stays closed and saves nothing.
   - Success, and any reference number, appear only after the service confirms receipt. No fake confirmation.
5. **Design and language.** Keep the OAG design system and ECOWAS colours, with ECOWAS Green as the main action colour. Keep English, French and Portuguese. Use left-aligned text throughout, and remove decorative dashes from page copy, headings and labels.
6. **Check.** Review the page at desktop (1280px) and phone (390px) widths: layout, keyboard focus, error summary, links to each route, and language switching.

## Technical details
- In `src/App.tsx`, change the lazy `/contact` import from the AboutOAG placeholder to `src/pages/Contact.tsx`.
- `src/lib/contact-data.ts` continues to read only published, non-placeholder `site_content` rows for the contact section.
- `SUBMISSIONS_OPEN` stays `false`, and the `contact-submit` service still returns 503. The form shows success only on a confirmed response containing a reference.
- Accessibility fixes in `EnquiryForm.tsx`:
  - link each error to its field through `aria-describedby`
  - give the consent checkbox its own error
  - add `aria-describedby` to the select fields
  - use a `fieldset` and `legend` for the consent group
- Remove dashes from text in `src/lib/contact-copy.ts`, in all three languages.
- No database changes and no new form or contact system.
