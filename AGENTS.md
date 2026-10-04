# Project conventions

- Keep reusable design-system primitives and showcase patterns in `src/components/ds/`, with the showcase page composing those shared pieces; this makes the OAG visual language reusable across future public and internal experiences.
- Public site pages render inside `SiteLayout` (shared header, footer, search, transitions); nav/search content lives in `src/lib/site.ts` so sections are config-driven. The design-system reference stays standalone at `/design-system`.
- Homepage figures live in `src/lib/home-data.ts` as clearly labelled placeholders; replace with authorised data sources keeping the same shapes, so no fabricated OAG stats ship.
- Keep About OAG content in a dedicated route-aware page while sharing navigation labels from `src/lib/site.ts`; this supports progressive disclosure without changing the site shell.
- Library records live in `src/lib/library-data.ts`; only `publicDocuments`/`getPublicDoc` may be consumed so restricted documents can never render.
