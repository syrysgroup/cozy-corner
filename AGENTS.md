# Project conventions

- Keep reusable design-system primitives and showcase patterns in `src/components/ds/`, with the showcase page composing those shared pieces; this makes the OAG visual language reusable across future public and internal experiences.
- Public site pages render inside `SiteLayout` (shared header, footer, search, transitions); nav/search content lives in `src/lib/site.ts` so sections are config-driven. The design-system reference stays standalone at `/design-system`.
