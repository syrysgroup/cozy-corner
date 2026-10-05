# Homepage OAG Leadership Carousel

## What changes
- Redesign only the OAG leadership section directly beneath the Chairman of the Authority feature; leave the chairman feature and all other homepage sections structurally unchanged.
- Use the supplied reference as inspiration: a strong editorial introduction on the left and a horizontally scrollable row of tall leadership cards on the right, adapted to the existing ECOWAS/OAG design system rather than copied literally.
- Present four role-based cards: **Auditor General** plus **Leadership role 02**, **Leadership role 03**, and **Leadership role 04**. Do not invent names, biographies, portraits, or unconfirmed job titles.
- Give every unavailable profile a deliberate placeholder treatment using the official OAG emblem or a neutral person symbol, with clear “details awaiting approval” language rather than fake content.
- Add accessible previous/next controls, position indicators, keyboard operation, touch scrolling, disabled end states, and reduced-motion support. Desktop will show multiple cards; smaller screens will show one prominent card at a time without clipped text.
- Keep the existing link to the full OAG leadership page, but visually subordinate it to the carousel.
- Confirm that the current chairman record resolves its stored `chairman-authority-2026-2027.png` portrait through the existing database-backed image flow. The redesign will not hardcode the supplied public URL or alter the chairman section’s layout.

## Technical details
- Refactor `LeadershipFeature` in the homepage section module into a self-contained carousel using existing Button, Container, motion, typography, colour, border, and focus tokens.
- Keep placeholder role data local to this homepage presentation and clearly marked as illustrative role slots; no database schema or About OAG page changes.
- Preserve semantic heading order and announce carousel position changes without overwhelming screen-reader users.
- Verify the homepage at desktop and mobile widths, including arrow controls, keyboard navigation, swipe/scroll behavior, text fitting, chairman portrait loading, and the transition between the chairman and OAG leadership sections.
