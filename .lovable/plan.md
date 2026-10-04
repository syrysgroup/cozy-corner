# Homepage Redesign — Interactive ECOWAS Brand Experience

## Goal
Rebuild the homepage as a modern, highly interactive, aesthetically striking experience driven by the ECOWAS Corporate Design Manual (Nov 2020). The top header (utility bar + main navigation) stays exactly as it is. All content sections below the header are redesigned.

## Brand foundations (from the manual, already in our tokens)
- Primary: ECOWAS Green #008244, Yellow #E4CA00, Brown #AD4F2E
- Secondary: Lime #AEBD39, Orange #F07E26, Deep Red #8E1D36, Sky #5EA3B3, Ocean #004C71, Blue-grey #335D68
- Typeface: Source Sans Pro (manual-mandated); keep existing fluid display scale
- Signature motif: the green/yellow/brown tri-band (`--band`) used as a recurring design device
- All motion respects `prefers-reduced-motion` (existing `usePrefersReducedMotion` hook)

## New homepage structure (top to bottom)

1. **Cinematic hero** — full-viewport, layered parallax imagery over Ocean blue, oversized display headline with a staggered word-by-word reveal, animated tri-band underline, and a live ticker strip of the six mandate keywords scrolling horizontally. Scroll indicator that fades on scroll.

2. **Mission statement** — large editorial typography where key phrases highlight in ECOWAS yellow as they scroll into view (scroll-linked text reveal), replacing the current static intro.

3. **What the OAG does** — interactive card grid: each of the mandate areas gets a hover/tap card that flips or expands to show detail, colour-coded with the secondary palette (lime, orange, sky, ocean). Cards animate in with stagger on scroll.

4. **Interactive West Africa map** — new signature section: an SVG map of the 15 ECOWAS member states. Hovering/tapping a country highlights it in ECOWAS green and shows its name; selecting a country shows which institutions fall under the audit mandate there. Pure SVG + CSS, no map library.

5. **Chairman of the Authority** — keep the existing data-driven `AuthorityChairFeature` (Supabase-backed), restyled: portrait in a duotone Ocean-blue treatment with a yellow tri-band accent frame, smoother entrance animation.

6. **Transparency in numbers** — the four stat cards become a scroll-triggered count-up dashboard with animated progress arcs/rings, images cross-fading on hover. Placeholder-data notice retained.

7. **Publications shelf** — keep the horizontal snap rail but upgrade it: cover cards tilt in 3D on pointer move, with a drag-to-scroll interaction and progress bar showing position in the rail.

8. **Institutions teaser** — three-arms-of-governance diagram becomes an interactive explainer: clicking each arm (Commission, Parliament, Court) expands its description while OAG stays visually separate as independent assurance (per our institutional model rule).

9. **IntegrityLine** — keep the green band but add animated concentric rings that respond subtly to pointer position, and cards that lift with a coloured edge on hover.

10. **Newsletter + final CTA** — merged into one closing band on ink background with the tri-band divider, oversized link list with sliding arrow hover states (existing pattern, refined).

## What stays untouched
- Top header / utility bar / navigation — no changes
- Footer, SiteLayout, routing, all other pages
- Data sources: `home-data.ts`, `authority-data.ts`, `news-data.ts` shapes unchanged — no fabricated stats
- Design tokens in `index.css` — only additive changes (new keyframes/utilities), no token removals

## Technical notes
- New components in `src/components/home/` (e.g. `hero.tsx`, `map-section.tsx`, `stats.tsx`); `Home.tsx` recomposes the page
- Map: hand-built simplified SVG paths of the 15 member states, keyboard-accessible (focusable, arrow-key navigation, aria-labels)
- Animations: CSS keyframes + existing `useReveal`/`useCountUp` hooks; pointer parallax via rAF like the current hero; no new heavy dependencies
- Accessibility: every interactive element keyboard-operable, reduced-motion fallbacks, colour never the only signal
- Performance: hero image stays `fetchPriority="high"`, below-fold images lazy; map SVG inlined and small

## Verification
- Build check, then Playwright pass over the homepage at desktop and mobile widths: hero reveal, map hover/keyboard, count-up trigger, rail drag, reduced-motion emulation.
