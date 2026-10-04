# OAG roadmap

- [x] Replace header Careers/Procurement with database-backed Opportunities alongside ECOWAS Institutions (desktop and mobile verified).
- [ ] Restore official logo files: public database records are connected, but their storage bucket returns "Bucket not found" and existing CDN fallbacks return 404; requires accessible official image files.

- [x] IA refinement: main nav de-duplicated, ECOWAS Institutions → /institutions hub, homepage restructured (How assurance flows removed, leadership, news, newsletter).
- [ ] Publish Auditor General name/photo/bio, news items and newsletter service (awaiting approved content and mailing service).
- [x] Design-system showcase (now at /design-system).
- [x] Global website shell: header, mobile menu, footer, search, breadcrumbs, states, 404.
- [x] Homepage: hero, audit intelligence, regional map, transparency, publications, insights, IntegrityLine, opportunities, news, final CTA (placeholder data in src/lib/home-data.ts).
- [x] About OAG experience: mandate, responsibilities, leadership template, interactive structure and audit journey, governance, and contact placeholders.
- [x] Publications & Digital Audit Library: search with match reasons, 8 filters, grid/list, document detail, knowledge connections (sample data in src/lib/library-data.ts).
- [x] Transparency & data intelligence: dashboard, activity, recommendations, institutions, ECOWAS map (placeholder data via fetchTransparencyData in src/lib/transparency-data.ts).
- [x] IntegrityLine: landing, 9-step protected report wizard, evidence upload states, tracking + protected messages (placeholder service in src/lib/integrity-service.ts).
- [x] Internal OAG Intelligence Portal at /portal: shell, executive dashboard, audit workspace, recommendations, risk, investigations, IntegrityLine cases, documents, knowledge, tasks, notifications, admin (placeholder data + demo role switcher).
- [x] OAG Knowledge and AI Assistant at /portal/assistant/:threadId with private persisted threads, source-aware keyword search, and explicit demo/source readiness states.
- [x] Premium refinement pass (round 1): phone header fixes (360–390px), portal header + view switcher, on-demand page loading, image priority, error cleanup.
- [x] French/Portuguese layout check (360–1440px): no breakage.
- [ ] Translate page body content into French/Portuguese (only menus/labels are translated today; needs approved translations).
- [ ] Further refinement rounds: chart transitions, deeper per-page polish, accessibility pass.
- [ ] Connect the assistant to an approved identity provider and authorized OAG retrieval sources (pending provider and source endpoints).
- [ ] Connect real identity provider and SAP/enterprise integrations (needs credentials/endpoints).
