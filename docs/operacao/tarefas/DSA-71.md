```json
{
  "id": "DSA-71",
  "goal": "Implement the nph-tabs, the list of tabs that switches the content of a section of the same page, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 700,
  "owner": "elvys",
  "state": "ready",
  "piece": "nph-tabs",
  "dependencies": [
    "DSA-03",
    "DSA-12",
    "DSA-43",
    "DSA-48"
  ],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-tabs documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-71/figma-docs-accepted-2026-11-09.md",
      "result": "passed",
      "verified_at": "2026-11-09",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, CSS, tests, stories and spec pass the proof commands and are merged into v/5.0.0.",
      "command": null,
      "evidence": null,
      "result": "pending",
      "verified_at": null,
      "verified_by": null
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "docs/operacao/evidencias/DSA-71/figma-docs-accepted-2026-11-09.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-09.md, nph-tabs: visual acceptance, Figma UX QA and textual audit approved, documentation accepted, the 9 points of the approval page approved (color/primary-text on the active label and line, active counter on theme/brand-200 and theme/brand-700, indicator width on core/focus-width/sm, soft border on the active outline tab button, the solid tab button limit in dark, the label on text/label-md, the accessible name of the counter, the swap of the old instances); a finished component enters the first version"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=3483-11200",
    "date": "2026-11-09",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-tabs documentation frame (3483:11200, page 1626:14) was accepted as the API and behavior specification of nph-tabs. COMPONENT_SET nph-tabs (3472:9192), the list, 16 variants; the tab set (3472:8748), 30 variants; the counter set (3472:8747), 3 variants. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-11-09"
}
```

# DSA-71 — nph-tabs, tabs that switch the content of a section

## Goal
The `nph-tabs` exists in `src/components/nph-tabs/`, with a spec, tests and stories, in the contract accepted in Figma: a list of tabs that switches the panel of a section of the same page, in five styles (segmented, underline, solid, light and outline tab button), with an optional start icon, counter and tag on each tab.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-71/figma-docs-accepted-2026-11-09.md`. It carries the Figma documentation converted to text, with the tokens of each part, the default behavior and the answers to the appendix points. There is no need to open Figma.

## Specification to follow closely
- **Styles**: segmented (default), underline, and tab button solid, light and outline. One size. The instance fills its container.
- **Keyboard** (APG Tabs): the list is a single Tab stop, on the active tab; left and right arrows move the focus with wrap, skipping a disabled tab; Home and End go to the first and the last enabled tab.
- **Activation**: automatic on focus by default; manual (Enter or Space) as an option for a slow panel. A click on the active tab does nothing; hover only paints.
- **Roles**: `tablist`, `tab` with `aria-selected` and `aria-controls`, `tabpanel` with `aria-labelledby`; the icon is `aria-hidden`; the counter number enters the accessible name with hidden context text and the visible number is `aria-hidden`.
- **Scrolling**: underline only, with nph-icon-button arrows at both ends, out of the Tab order and out of the screen reader; the focused tab scrolls into view.
- **Counter**: a piece of nph-tabs itself, with three tones (inactive outside the rail, inactive inside the rail, active).
- **Combined states** (rule T11): active + disabled keeps the active look under `tabs/item-disabled-opacity`; active + hover keeps the active look.
- **Inherited decisions**: the cut label follows DSA-48 D1 and D2 and DSA-57 D-3 (nph-tooltip on hover and on focus, a click cancels the wait); the order icon, label, counter, tag follows DSA-57 D-5; reduced motion follows DSA-62 D-3.
- **Icon and image**: nph-icon at `icon/size-sm`, light at rest and in focus, solid in hover and when active; no exported file. No image.

## Open points for the code
- Whether the scroll arrow hides or is disabled at an end of the list.
- Overflow in the segmented and tab button styles, which the usage rule limits to few tabs.
- Event, aria, slot, property and console warning, following the APG and the Custom Elements Manifest.

## Why it is ready
The fifty `tabs/*` tokens came with this task and are on `v/5.0.0`, with `core/alpha/white-15`, which Figma had and the code did not. No new semantic token: the active label and line use `color/primary-text`, already on `v/5.0.0`. The pieces inside are done: nph-icon (DSA-03), nph-badge (DSA-12), nph-icon-button (DSA-43) and nph-tooltip (DSA-48).

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
It does not create a token or change a token value. It does not change Figma. It does not change nph-badge, nph-icon, nph-icon-button or nph-tooltip.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, page `NPH — Tabs` (`1626:14`), documentation frame `3483:11200`
- Component sets: `nph-tabs` `3472:9192`, `nph-tabs / aba` `3472:8748`, `nph-tabs / contador` `3472:8747`
- WAI-ARIA APG, Tabs pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
