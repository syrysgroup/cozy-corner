# Premium OAG Leadership Homepage Section

## What changes
- Redesign only the OAG leadership section directly beneath the Chairman of the Authority feature; keep the chairman section and the rest of the homepage structure unchanged.
- Treat the section as a major institutional moment rather than a carousel or collection of small cards: generous composition, strong hierarchy, and a large official portrait area for the Auditor General.
- Use the content order **Leadership → Office of the Auditor General → official portrait → name → Auditor General → short approved institutional statement or quotation → Meet the Auditor General**.
- Make the Auditor General unmistakably the primary leader through scale, space, typography, and restrained ECOWAS/OAG brand accents. Avoid the standard side-by-side “photo, name, title” card appearance.
- Until the official name, portrait, and statement are approved, preserve the same premium layout with an honest, polished unavailable-content state—no invented identity, quotation, or biography.
- Add a subordinate senior leadership row beneath the main feature only when approved senior-leader records are available. Do not render empty or fabricated team cards on the live homepage.
- Keep the call to action linked to the existing OAG leadership page and make it read **Meet the Auditor General**.

## Chairman portrait correction
- Connect the current published Authority Chairman record to the already accessible Storage image by setting its portrait bucket to `institution-assets` and portrait path to `Leadership/chairman-authority-2026-2027.png`, with suitable descriptive alternative text.
- Continue resolving the image through the existing database-backed Authority-chair data flow; do not hardcode the public Storage URL in the page.
- Do not otherwise alter the Chairman of the Authority section.

## Technical details
- Refactor the homepage `LeadershipFeature` as a full-width editorial section using existing design tokens, shared controls, typography, focus states, and reveal motion.
- Keep OAG leadership content separate from Authority-chair data. The current OAG leader remains approval-gated; this change does not create fictional records or a new publishing workflow.
- Structure the feature so approved Auditor General and senior-team data can replace the unavailable state without another visual redesign.
- Preserve semantic heading order, readable portrait crops, descriptive image text, keyboard-visible links, and reduced-motion behavior.

## Verification
- Confirm the Authority Chairman portrait loads from the published database record on the homepage and Authority profile page.
- Check the OAG leadership section at desktop, tablet, and phone widths for portrait prominence, text fitting, restrained spacing, and a clear transition into “03 · The Office & what we do.”
- Confirm the unavailable OAG leadership state is honest and polished, and that no unapproved person details appear.
