# OAG roadmap

- [ ] Check homepage completeness against approved removals and latest Careers brief; verify every section renders.
- [ ] Implement the uploaded Careers campaign: source verification, published vacancy data, discovery, individual roles, guidance, archive and multilingual-ready records; disclose unavailable source verification or services.

- [x] Compact the homepage closing section into a newsletter-only row, removing its four navigation links; verified at 125px tall instead of 461px.
- [x] Limit homepage publications to the latest four, retaining card sizes and the full-library link; three selection tests passed, four 272px cards and library destination verified.
- [x] Prepare the non-repeating, fixed, compact header menu plan for approval; header implementation awaits approval.

- [ ] Remove homepage section numbering and all public page breadcrumb trails.
- [ ] Redesign homepage ECOWAS news as a newest-first sliding grid in Community colours with institution and date labels.
- [ ] Match IntegrityLine and Transparency in numbers to the compact Office layout: heading above full-width cards, minimal row spacing; verify both sections.
- [x] Display the four IntegrityLine choices together in one desktop row.
- [x] Display the four Transparency in numbers figures together in one desktop row, with a swipe track and arrows below on phone.
- [x] Display the six Office & what we do functions in one full-width row below the heading, with a swipe track and arrows below on phone.
- [ ] Remove Authority organogram and official-website destinations, since neither exists.

- [ ] Finish the partly written Opportunities guidance hub and availability-first Careers/Procurement pages; verify navigation, search/filter/reset, source states and layouts against the supplied brief.

- [x] Update `/knowledge/ecowas-news` to a five-column desktop grid with selectable page size, next/previous pagination and actual publisher/date on every card; verified live paging, size selection and source-wide search. Current feed: ECOWAS Commission only.

- [ ] Upgrade the existing Contact & Institutional Enquiries hub: verified CMS contacts/FAQs, multilingual routing and form, secure submission and administration, shared footer contact information, phone/accessibility/security checks.
- [ ] Refine the menu and homepage, especially a creative ECOWAS News presentation; select a visual direction, then finish phone layouts and final checks.
- [x] Restore compact leadership groups across all institution templates, preserving every deputy’s role; remove inline charts and interlink dedicated organogram pages; verify hierarchy and table views against the supplied PDF. All 22 profiles/pages checked; original assets restored. Hierarchy/table remain labelled transcribed overviews, with full detailed establishment available in original source pages.
- [ ] Complete diplomatic editorial homepage ECOWAS News, news index and fuller official article views; verify source content and unavailable states without invented reporting.
- [ ] Apply equal-sized, uncropped leadership portraits across all institution profiles.
- [ ] Add an interactive organogram subpage and entry button for every institution; integrate the supplied 71-page approved English document with accurate hierarchy, table views and source pages, retaining summary labels for institutions absent from the document.
- [ ] Add an Authority of Heads of State and Government page and connect its homepage/hub links.

- [x] Place Commission and Parliament building photos behind their introductory titles with a readable overlay.
- [x] Automatically retrieve official ECOWAS news on page opening and generate brief local article pages linking to the original article (no unattended scraping or stored archive).

- [x] Homepage refinement: place Authority Chairman and OAG leadership directly after the slider, merge The Office with What OAG Does, follow with ECOWAS Institutions, simplify newsletter to email only, and apply the ECOWAS brand manual.
- [x] Replace header Careers/Procurement with database-backed Opportunities alongside ECOWAS Institutions (desktop and mobile verified).
- [x] Restore official logo display through active public storage records; the Auditor General logo path now points to the supplied logo image.
- [ ] ECOWAS leadership & institution profiles: centralized authoritative content, homepage feature, institution hub and directory, secure publishing workflow, and mobile verification. EBID, WAHO, GIABA, OAG profiles and Parliament portraits implemented.
- [ ] Give OAG leadership a premium, portrait-led homepage feature; connect the published Authority Chairman portrait through its database record.
- [x] Show all five Commission commissioners in one compact row; wider institution redesign and sitemap changes cancelled by request.
- [x] Redesign the Commission profile around its emblem, verified 2026–2030 leadership and portfolios, mandate, structure, official links, and ECOWAS brand guide; preserve Parliament and Court profiles.
- [x] Add the official Commission headquarters and Parliament building photographs as full-width imagery on their individual institution pages.
- [x] Remove “03 · Across the region” from the homepage.
- [x] Add an ECOWAS News section on the homepage, sourced from the official ECOWAS public news feed.

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
