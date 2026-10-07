# Compact, non-repeating header

## Menu arrangement
- **Top bar:** ECOWAS Institutions · Opportunities · Contact · IntegrityLine · language selector.
- **Main bar:** About OAG · Audit & Assurance · Transparency · Publications · Knowledge · News & Media, followed by Search.
- Remove IntegrityLine from the main bar because it already has a highlighted top-bar link. Keep its pages and reporting options available.
- Prevent repeated destinations even when published top-bar links change; compare destinations, not translated labels.
- Keep Careers and Procurement under Opportunities rather than as separate header links.

## Fixed, compact presentation
- Keep the header pinned to the top when scrolling in either direction; remove its current hide-on-scroll behaviour.
- Reduce the main bar’s top and bottom spacing and the extra spacing around the home/logo link, without reducing the prominent OAG logo.
- Keep the top bar slim, with comfortable link targets; let the menu drawer take over before links become crowded.
- Preserve the existing colours, branding, search and language controls.

## Phone menu and languages
- Show every destination once in the menu drawer. Include the highlighted IntegrityLine link there so it stays accessible when the desktop top bar is hidden.
- Preserve access to child pages, including IntegrityLine reporting, tracking and protection, without repeating the main IntegrityLine destination.
- Apply the same arrangement in English, French and Portuguese.

## Technical details
- Keep published utility navigation flowing through `src/lib/public-site.ts` and main navigation through `src/lib/site.ts`; add a shared, tested destination-deduplication selector.
- Update `SiteHeader` to use fixed positioning with a layout spacer matching its actual rendered height. Remove directional scroll hiding, retaining only the scroll shadow state.
- Share the measured header height with page/anchor offsets so content, skip links and section targets cannot sit underneath it; keep search and menu overlays above it.
- Use existing design primitives for changed controls. No publishing-data or permission changes.

## Verification
- Test non-repetition with both fallback and published utility destinations, including trailing slashes and query strings.
- Check desktop and phone layouts in all three languages, scrolling down/up, search, menu opening/closing, child links and skip-to-content.
- Confirm the header never disappears, logo remains legible, content clears the header and there is no horizontal overflow.

## Scope
The compact newsletter and four-publication homepage limit are already implemented. This plan changes only the shared header and its necessary page offsets. Approved publication content and a mailing service remain separate dependencies.