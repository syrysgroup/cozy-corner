# Opportunities design upgrade

## Goal
Make **Opportunities** the useful information hub for applicants and suppliers, while **Careers** and **Procurement** focus on what is currently available. Preserve the existing OAG identity throughout.

## 1. Opportunities: guidance and two clear destinations
Replace the bare two-link page with a complete, editorial information hub in this order:

1. **Compact introduction:** “Opportunities”, a short explanation of careers and procurement, and the existing institutional branding. Avoid a large promotional banner that pushes the useful content down.
2. **Two equal entry panels:** Careers and Procurement, each with a familiar icon, a concise audience description and a clear action: “View current vacancies” / “View procurement notices”. Display these side by side on desktop and stacked on phones. These are navigation choices, not duplicate vacancy lists.
3. **Shared safety notice:** a prominent, restrained “Do not pay” band using the existing pale ECOWAS yellow treatment. Include authenticity guidance, use only the channel named in the official notice, and link to IntegrityLine for suspicious approaches. Retain existing statements subject to content approval; do not invent additional institutional policies.
4. **Careers guidance:** consolidate the existing career areas, recruitment steps, eligibility and application guidance here. Keep any unverified benefits or policy claims out of newly published copy.
5. **Procurement guidance:** consolidate participation steps, notice types, donor-funded eligibility guidance and links to plans, awards, projects and published resources here. Detailed procurement records stay in their current destinations.
6. **Frequently asked questions:** separate Careers and Procurement groups with expandable answers, reusing existing content rather than adding speculative rules.
7. **Closing links:** direct visitors back to vacancies and procurement notices, without a newsletter or new submission form.

Use a small in-page navigation row for Careers guidance, Procurement guidance and FAQs so the longer hub remains easy to scan.

## 2. Careers: availability first
- Use a compact “Careers” title and short introduction instead of the current large promotional opening.
- Put current vacancies and the existing career-area/contract filters immediately beneath the heading, visible in the first screen where possible.
- Preserve vacancy information: role, grade when supplied, contract, location, closing date and official application link.
- Move lengthy benefits, career areas, recruitment steps and FAQs to Opportunities; provide a concise “Recruitment guidance” link back to the relevant section.
- Keep only a short safety reminder beside the application area; avoid repeating the full warning band.
- Distinguish “No vacancies are currently published” from “No vacancies match your filters”, with a reset action for the latter.

## 3. Procurement: availability first
- Use a compact “Procurement” title followed directly by open notices, search and filters.
- Make title, reference, notice type, institution, status and deadline easy to scan; retain notice detail pages and documents.
- Keep plans, awards, projects and resources accessible as secondary navigation below the primary notice controls, not a competing six-card introduction.
- Move full participation guidance, authenticity copy and FAQs to Opportunities, preserving existing FAQ links through a redirect or a concise link to the new section.
- Retain a short safety reminder near notices and submission instructions.
- Clearly separate loading, unavailable-source, no-published-notices and no-filter-matches states. Do not suggest that an empty local source proves there are no ECOWAS-wide opportunities.

## Established visual treatment
- **Primary actions and links:** existing OAG/ECOWAS green.
- **Warnings:** existing pale ECOWAS yellow surface, dark readable text and a warning icon.
- **Supporting structure:** existing ocean/sky accents, neutral surfaces and border treatments; use sparingly.
- **Brand signature:** existing green–yellow–brown tri-band only where already appropriate.
- Preserve the current heading/body fonts, spacing scale, buttons, focus states and compact corner treatment. No new palette, typography, gradients or decorative imagery.
- Use unframed page sections, thin dividers and generous but purposeful spacing. Reserve panels for the two destination choices and individual published records.
- Keep motion subtle and respect reduced-motion preferences; status must always have a text label, not colour alone.

## Technical implementation
- Add a dedicated Opportunities page inside the existing shared site layout, without changing other generic section pages.
- Reuse the established design primitives and semantic colour tokens; no replacement design system.
- Reuse the existing careers/procurement content sources and approved notice shapes. Consolidate guidance so it has one shared source rather than duplicated copy.
- Preserve existing URLs and detail routes; wire procurement search so its query survives navigation and actually filters the notice view.
- Keep existing language-aware navigation. Newly moved body content must not be presented as approved French/Portuguese translation unless approved text is supplied.
- No new backend, vacancy feed, CMS workflow or application/submission service is included.

## Checks before completion
- Verify Opportunities → Careers/Procurement → guidance → Opportunities journeys and all existing procurement detail links.
- Check phone and desktop layouts, keyboard access, FAQ controls, readable contrast and no text overflow.
- Test search/filter/reset behaviour using clearly isolated test fixtures; never publish invented vacancies or tenders.
- Confirm empty, loading and failure states with the current sources, which contain no approved records today.

## Outcome and scope
A fuller Opportunities information hub and two focused availability pages, all recognisably part of the existing OAG website. This plan reorganizes and refines the existing content; it does not fabricate opportunities or certify existing policy wording.