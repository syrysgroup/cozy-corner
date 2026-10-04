# Chart motion, page polish, and accessibility pass

## Goal
Finish the existing refinement work without changing the OAG visual direction or placeholder-data boundaries. The result will feel more deliberate page by page, animate data only when useful, and support keyboard and assistive-technology use more reliably.

## 1. Chart animation system
- Make chart entrances begin when the chart reaches the viewport rather than immediately on page load.
- Animate trend lines, ranked bars, donut segments, stacked rows, risk bars, and progress indicators with short, coordinated timing.
- Keep labels and final values stable while shapes animate, so no information shifts or becomes temporarily unreadable.
- Respect reduced-motion preferences by showing every chart immediately in its final state.
- Retain direct labels, patterns, accessible summaries, and table alternatives.

## 2. Shared visual polish
- Strengthen the two known weak-contrast treatments: small copy on green Insights/Integrity surfaces and brown publication labels.
- Standardize interactive states, minimum touch targets, panel spacing, table density, sticky navigation offsets, and empty states through shared design-system pieces.
- Remove the current image-priority console warning.
- Refine transitions so links, cards, filters, drawers, and selected states feel consistent without adding decorative motion.

## 3. Public pages
- **Home:** improve card contrast and legibility, publication metadata, horizontal publication browsing, map controls, and section rhythm.
- **About OAG:** refine the image header, section directory, structure and audit-journey controls, and narrow-screen layouts.
- **Publications:** improve search/filter control sizing, list/grid states, featured publication balance, metadata legibility, and mobile filter flow.
- **Document detail:** strengthen action hierarchy, metadata scanning, related-content spacing, and small-screen stacking.
- **Transparency:** coordinate chart motion, improve data-control tap targets and keyboard behavior, and polish dense chart/table layouts.
- **IntegrityLine:** refine the landing options, privacy comparison, report steps, file states, validation messaging, and protected-message layout without changing reporting logic.
- **Generic section, contact, states, and not-found pages:** align spacing, navigation states, and action hierarchy with the finished primary pages.

## 4. Portal pages
- Polish the portal shell, mobile navigation, toolbar, role selector, notices, and consistent page spacing.
- Improve dashboard chart balance and dense information scanning.
- Make row-based selection usable from the keyboard across risk, recommendations, investigations, and IntegrityLine case views.
- Refine audit tabs, recommendation details, risk matrix descriptions, case pipeline, documents, knowledge, tasks, notifications, administration, and assistant layouts.
- Preserve all current access, scope, clearance, and placeholder-data rules.

## 5. Accessibility fixes and checks
- Replace or supplement mouse-only selectable rows with real buttons/links and visible focus states.
- Add correct keyboard behavior to tabs, segmented controls, and selectable data views.
- Ensure icon-only controls have names and primary controls meet a 44×44px target where practical.
- Connect hints and validation errors to their fields; announce changing search, upload, message, and wizard states appropriately.
- Improve mobile menu focus containment and dismissal using the existing accessible dialog primitives.
- Verify heading order, one main landmark per page, image alternatives, table headings/captions, non-colour status cues, and reduced-motion behavior.
- Run automated semantic checks, a keyboard-only route walkthrough, focus-order checks, and rendered desktop/mobile checks. Screen-reader semantics will be checked through the accessibility tree; a human listening test in VoiceOver/NVDA remains a final editorial QA step.

## Technical details
- Extend `src/components/ds/charts.tsx` and `src/hooks/use-motion.ts` for one-shot viewport-triggered chart motion; keep shared motion and contrast rules in semantic tokens/CSS.
- Reuse the existing `Button`, Radix dialog components, shared portal parts, and design-system primitives rather than introducing parallel controls.
- Update page files only where page-specific spacing, hierarchy, or semantics cannot be expressed through shared pieces.
- Keep all chart data and application behavior unchanged.

## Verification
- Check current build/runtime logs after each implementation group.
- Exercise every registered public and portal route at desktop and mobile sizes.
- Test Tab/Shift+Tab, Enter, Space, Escape, arrow-key tabs/segments, dialogs, filters, selectable rows, and the IntegrityLine wizard.
- Confirm charts animate once in normal motion and render instantly with reduced motion.
- Re-run contrast and accessibility checks, then record the completed pass in the roadmap.
