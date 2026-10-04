# OAG design-system showcase

Restore the missing first-screen showcase and continue the uploaded brief as a polished, usable design-system reference—not the full OAG website.

## Build
- Create the `/` showcase with editorial OAG framing, live navigation, and the existing ECOWAS identity, image assets, and responsive grid.
- Demonstrate foundations, palette and type, button and status variants, editorial/publication/audit/statistic cards, reusable form controls, audit-table patterns, accessible chart examples, alerts, and navigation/footer patterns.
- Make representative controls work: section navigation, language selection, form validation/toggles, table sorting/filtering/pagination/row selection, and dismissible alerts or dialogs.
- Preserve reduced-motion behavior, keyboard access, semantic labels, and mobile-first layouts; use existing design tokens and component conventions.

## Technical details
- Replace the broken `src/pages/DesignSystem` import target with a focused showcase page and small reusable design-system components.
- Keep the existing Vite + React setup and Tailwind design tokens; do not introduce a new application framework or backend.
- Verify the preview at desktop and mobile sizes and resolve any new build/runtime errors.
