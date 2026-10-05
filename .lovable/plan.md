# ECOWAS Commission Profile Redesign

## Outcome
Redesign `/institutions/commission` as an institutional profile led by the Commission’s mandate, structure, and collective leadership. The President’s portrait will support the leadership story rather than dominate the page.

## Page structure
1. **Institution introduction** — retain the breadcrumb and Commission identity, but replace the oversized emblem panel with a balanced title area, concise official description, restrained logo lockup, and links to the official Commission site.
2. **At a glance** — present verified facts such as headquarters, transformation from Secretariat to Commission in 2007, legal basis, and working languages in a compact information band.
3. **Mandate and priorities** — elevate the Commission’s responsibilities and “ECOWAS of the People: Peace and Prosperity to All” vision ahead of individual profiles.
4. **How the Commission is led** — explain the President, Vice-President, Commissioners, departments, and directorates as one leadership system.
5. **Executive leadership** — show the President and Vice-President in a restrained two-profile composition. Use `Leadership/commission-president.jpeg` for H.E. General Birame Diop, with the photo secondary to name, office, role, and verified tenure information.
6. **Commissioners** — add a scannable grid of the five current departmental Commissioners and portfolios confirmed by the official ECOWAS handover announcement. Show portraits or biographies only when officially available; otherwise use a professional branded placeholder.
7. **OAG relationship** — keep the Auditor-General distinct from Commission executive leadership in a separate independent-assurance section, preserving OAG’s institutional independence.
8. **Milestones and official sources** — retain key history, add source links and an “information verified” date, and avoid repeating stale structural counts.

## Current information to publish
- Replace the outdated President record for H.E. Dr Omar Alieu Touray with **H.E. General Birame Diop**, President of the ECOWAS Commission, in office from 1 September 2026.
- Add **H.E. Anthony Oluwatosin Ogunjimi**, Vice-President of the ECOWAS Commission.
- Add the officially named current departmental Commissioners and portfolios from the ECOWAS handover announcement:
  - Dr Kalilou Sylla — Internal Services
  - Ms Francess Piagie Alghali — Political Affairs, Peace and Security
  - Mr Dehpue Yenpea Zuo — Economic Affairs and Agriculture
  - Mr Amin Amidu Sulemani — Infrastructure, Energy and Digitalisation
  - Prof Nassirou Bako-Arifari — Human Development and Social Affairs
- Present the Auditor-General in the separate OAG assurance section, not as a sixth Commission executive card.
- Do not invent biographies, dates, nationalities, or portraits. Where official information is unavailable, display: “Leadership information will be published when officially available.”

## Brand and presentation
- Apply the uploaded November 2020 ECOWAS Corporate Design Manual: Source Sans Pro, ECOWAS green, yellow, and brown through the existing semantic design tokens.
- Keep the complete Commission logo lockup proportional, with clear space, no visual effects, and only on white or the permitted pale-yellow field.
- Use flat colour fields, strong editorial spacing, clear rules, and restrained motion; no gradients or decorative portrait treatment.
- Keep the page visually consistent with the OAG site shell while making the Commission identity unmistakable.

## Content and administration
- Create one typed, centralized Commission profile source for verified facts and leadership records; remove the Commission’s hardcoded single-leader object from the generic institution page.
- Read the President portrait from the existing public `institution-assets` storage path, with accessible alternative text and a deliberate missing-image state.
- Structure leadership records so President, Vice-President, Commissioners, terms, sources, publication status, and archives can be updated without editing the page.
- Restrict publishing changes to server-validated administrators; the existing demonstration role selector will not grant write access.
- Keep Parliament and Court pages on the current shared profile until separately redesigned.

## Verification
- Cross-check every published name, title, portfolio, and date against current official ECOWAS pages and the 31 August 2026 handover announcement.
- Treat older ECOWAS pages claiming five or thirteen Commissioners as stale where they conflict with the named 2026 roster; do not display a numeric commissioner count.
- Verify the portrait, official links, keyboard navigation, focus states, text wrapping, image fallbacks, and layout at phone and desktop widths.
- Confirm that OAG remains presented as independent assurance rather than a fourth governance arm or a Commission department.
