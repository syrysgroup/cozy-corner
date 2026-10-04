# ECOWAS Leadership & Institutions

## What changes
- Put a dedicated ECOWAS Authority chairperson feature immediately after OAG leadership, then an ECOWAS institutions overview; preserve the requested homepage order and separate OAG as independent assurance.
- Establish one shared institution profile catalogue for the governance arms, other institutions and specialized agencies. Reuse it across the homepage, hub, profile pages, directory search/filters and institutional coverage; retain only authoritative records and professional unavailable-information states.
- Expand the Institutions Hub with consistent profiles, the supplied official arm logos, leadership and related-publication/audit/news sections, directory filters, and clear separation of the three governance arms from OAG.
- Add a secure, role-restricted administration editor for chairperson and institution content, including leadership terms/archive and publication dates. Protect changes with Supabase roles and row-level security; never rely on the demo role switcher for write authorization.
- Verify desktop/mobile layouts, navigation, search/filter behavior, published/empty states and protected editing. Remove any remaining “How assurance flows” presentation.

## Technical details
- Centralize typed institution and Authority-chair data access in a shared library, backed by published/unpublished Supabase content records; frontend screens must not carry separate institutional copies.
- Use official ECOWAS/institution sources only. Do not fabricate names, portraits, biographies, descriptions or dates; show clear empty states until official content is available.
- Add an `admin` role in a separate `user_roles` table with security-definer role checks and narrowly scoped grants/policies. Public users may read published records; only assigned administrators may edit or publish.
