# Project conventions

- Read active official logos and published header navigation through `src/lib/public-site.ts`; a shared read-only request keeps public branding consistent without exposing unpublished content.

- Reuse design primitives in `src/components/ds/` across the showcase and all experiences for consistent OAG styling.
- Public site pages render inside `SiteLayout` (shared header, footer, search, transitions); nav/search content lives in `src/lib/site.ts` so sections are config-driven. The design-system reference stays standalone at `/design-system`.
- Homepage figures live in `src/lib/home-data.ts` as clearly labelled placeholders; replace with authorised data sources keeping the same shapes, so no fabricated OAG stats ship.
- Keep About OAG content in a dedicated route-aware page while sharing navigation labels from `src/lib/site.ts`; this supports progressive disclosure without changing the site shell.
- Library records live in `src/lib/library-data.ts`; only `publicDocuments`/`getPublicDoc` may be consumed so restricted documents can never render.
- Transparency figures come only from `fetchTransparencyData` in `src/lib/transparency-data.ts` (placeholder today); swap its body for an authorised API returning the same shape so pages need no changes. Charts in `src/components/ds/charts.tsx` always pair colour with patterns/labels and a table view.
- IntegrityLine calls go only through `src/lib/integrity-service.ts` (placeholder); swap bodies for the secure vault/evidence backend keeping shapes. Identity data never enters case views.
- The internal portal lives under `/portal` with its own `PortalLayout`; access checks go only through `useAccess` in `src/lib/portal/access.tsx` (RBAC permissions + ABAC scope/clearance) so a real IdP/policy engine can replace it, and the backend must still enforce every check.
- Portal data comes only from `src/lib/portal/portal-data.ts` (placeholder); the portal is an intelligence layer and never writes to SAP/enterprise systems of record.
- OAG assistant threads are URL-keyed and user-scoped by Supabase RLS; conversations must not cross accounts.
- Only present assistant evidence from permission-filtered OAG sources; keep placeholder records visibly illustrative and leave AI answers unavailable until an authorized retrieval service exists, so the UI cannot imply verified institutional findings.
- Route pages are lazy-loaded in `src/App.tsx` behind one Suspense fallback; keeps the first load small as sections grow.
- ECOWAS institutional model (three governance arms; OAG separate as independent assurance) lives only in `src/components/ds/institutional.tsx`; reuse it so OAG is never shown as a fourth arm.
- Primary navigation renders `MAIN_NAV` from `src/lib/site.ts`, which excludes destinations already in the utility bar; avoids duplicate header destinations.
- The homepage ECOWAS News section reads published Community posts only through `src/lib/ecowas-news-data.ts`; keep it distinct from OAG news, which remains approval-gated in `src/lib/news-data.ts`.
- ECOWAS news uses shared primitives, safe text and publisher attribution; URL-keyed index paging and a scroll-snapping homepage carousel share the newest-first official feed.
- Authority chair data comes only from `useAuthorityChairs` in `src/lib/authority-data.ts` (public read of published rows, current + archive); chairs rotate yearly so nothing is hardcoded and history is never deleted.
- Homepage narrative order is Authority Chair, OAG leadership, combined Office/mandate, then ECOWAS Institutions; this preserves the approved institutional hierarchy before supporting content.
- Keep Commission-specific profile and leadership data in the shared institution profile source and render its distinct institution-first presentation there; this prevents duplicate data while preserving Parliament and Court profiles.
- Keep governance-arm building imagery as optional metadata in the shared institution profile source and resolve it from the public institution asset store; this keeps full-width institutional photography page-specific and replaceable without changing layouts.
- Keep supporting-institution cards and profiles sourced from `src/lib/institution-data.ts`; one record drives each logo, link, summary and mandate to prevent hub/profile drift.
- OAG newsroom (`/news`, `/news/:sub`) reads only through `src/lib/news-data.ts` (published, approved-language records; empty today) and stays separate from attributed ECOWAS stories; one detail template serves every category.
- Opportunities shares careers/procurement guidance and tested `opportunity-filters.ts`; search stays URL-keyed. Vacancy/notice feeds stay empty until approved; never fabricate records.
- All institution profiles reuse `InstitutionProfilePage` for compact leadership and consistent uncropped portrait sizing; charts render only on organogram subroutes with the shared viewer/navigation, never inline on profiles.

- Institution profiles declare organogram availability in shared records; hide unavailable entries and redirect obsolete chart links to the profile. Authority chairs still use `useAuthorityChairs`.
