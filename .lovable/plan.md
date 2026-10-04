# Homepage fixes

## 1. Restore the Auditor General section
The rebuilt homepage dropped the Auditor General leadership section, so no OAG image appears. Re-add it (after the Chairman of the Authority section) using the existing `LeadershipFeature` block, which shows the Office of the Auditor General emblem with the striped accent treatment, plus the "Meet the OAG leadership" link. Portrait stays as an approved-placeholder note until an official photo is supplied.

## 2. ECOWAS membership: 15 → 12
Mali, Burkina Faso and Niger left ECOWAS in January 2025.
- Remove those three countries from the map data in `src/components/home/map-section.tsx`.
- Change the map heading from "Fifteen member states. One audit mandate." to "Twelve member states. One audit mandate."
- Keep the existing note that institution locations should be checked against official sources.

## 3. Opening banner becomes a slider
Convert the full-height hero photo into an auto-advancing image slider:
- Cycles through the existing photos (hero auditors, editorial building, editorial meeting, news conference) with a smooth crossfade.
- Previous/next arrows and position dots, pauses on hover, respects reduced-motion settings.
- Keeps the word-by-word headline, the green/yellow/brown stripe, and the scrolling keywords.

## 4. Logos for the three arms of governance
In the "Three arms of governance" section, show each institution's official logo (Commission, Parliament, Court — the logo files already exist in the project) next to its name in the clickable rows, instead of the generic icons.

## 5. Tone down the mission statement
The "Who we are" mission text currently renders at an oversized display size with heavy bold words. Reduce it to a calmer, readable size with normal weight, keeping the scroll-highlight of key phrases in ECOWAS yellow.

## 6. Verify
Check the homepage loads cleanly and click through it at desktop and mobile sizes, fixing anything broken.

## Technical notes
- Files touched: `src/pages/Home.tsx`, `src/components/home/hero.tsx`, `map-section.tsx`, `mission.tsx`, `closing.tsx`, `sections.tsx`.
- Logos/emblem load via the existing `useOfficialAsset` hook with the bundled asset files as fallback.
- No new dependencies; slider built with existing motion hooks.
