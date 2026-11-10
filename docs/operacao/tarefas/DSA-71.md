```json
{
  "id": "DSA-71",
  "goal": "Implement the nph-tabs, the list of tabs that switches the content of a section of the same page, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 700,
  "owner": "elvys",
  "state": "in-review",
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
  "pending_decisions": [
    {
      "id": "D-1",
      "question": "The accepted Figma documentation asks for the whole text of a cut label in nph-tooltip on hover and on focus, but nph-tooltip only opens on an element with tabIndex 0 or more, and an inactive tab has -1. The code gives tabindex 0 to the cut tab under the pointer while the pointer rests on it, and takes it back when the pointer leaves. She confirms that this serves, or asks for a change in nph-tooltip, which is another task. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-11-09"
    },
    {
      "id": "D-2",
      "question": "The icon-only nph-button of the scroll arrows requires a label, and the accepted documentation gives no text for it. The code adds two properties, scroll-previous-label and scroll-next-label, and draws no arrow without them. She confirms the two properties and the text the product uses. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-11-09"
    },
    {
      "id": "D-3",
      "question": "The accepted documentation only cites 99+ as an example of a large counter. The code shows 99+ above 99 and keeps the full number in the hidden context text. She confirms the limit of 99. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-11-09"
    },
    {
      "id": "D-4",
      "question": "In the segmented and the tab button styles with many tabs, the code cuts the label with an ellipsis and a balloon instead of scrolling. The documentation asks for few tabs there and leaves the overflow to the code. She confirms this or asks for scrolling in those styles too. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-11-09"
    }
  ],
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
  "git_review": { "branch": "feat/dsa-71-tabs", "commit": null, "pr": null },
  "context": "docs/operacao/contextos/DSA-71.md",
  "updated_at": "2026-11-09"
}
```

# DSA-71 — nph-tabs, tabs that switch the content of a section

## Goal
The `nph-tabs` exists in `src/components/nph-tabs/`, with a spec, tests and stories, in the contract accepted in Figma: a list of tabs that switches the panel of a section of the same page, in five styles (segmented, underline, solid, light and outline tab button), with an optional start icon, counter and tag on each tab.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-71/figma-docs-accepted-2026-11-09.md`. It carries the Figma documentation converted to text, with the tokens of each part, the default behavior and the answers to the appendix points. There is no need to open Figma.

## Specification to follow closely
- **Styles**: segmented (default), underline, and tab button solid, light and outline. One size, horizontal only. The list fills its container and the tabs share the width; in the underline style with scrolling, each tab keeps its content width.
- **Keyboard** (APG Tabs): the list is a single Tab stop, on the active tab; left and right arrows move the focus with wrap, skipping a disabled tab; Home and End go to the first and the last enabled tab.
- **Activation**: automatic on focus by default; manual (Enter or Space) as an option for a slow panel. A click on the active tab does nothing; hover only paints.
- **Roles**: `tablist`, `tab` with `aria-selected` and `aria-controls`, `tabpanel` with `aria-labelledby`; the icon is `aria-hidden`; the counter number enters the accessible name with hidden context text and the visible number is `aria-hidden`.
- **Scrolling**: underline only, with nph-icon-button arrows at both ends, out of the Tab order and out of the screen reader; the focused tab scrolls into view.
- **Counter**: a piece of nph-tabs itself, with three tones (inactive outside the rail, inactive inside the rail, active).
- **Combined states** (rule T11): active + disabled keeps the active look under `tabs/item-disabled-opacity`; active + hover keeps the active look.
- **Inherited decisions**: the cut label follows DSA-48 D1 and D2 and DSA-57 D-3 (nph-tooltip on hover and on focus, a click cancels the wait); the order icon, label, counter, tag follows DSA-57 D-5; reduced motion follows DSA-62 D-3.
- **Icon and image**: nph-icon at `icon/size-sm`, light at rest and in focus, solid in hover and when active, in the label color of each state; no exported file. No image.

## Open points for the code
- Whether the scroll arrow hides or is disabled at an end of the list.
- Overflow in the segmented and tab button styles, which the usage rule limits to few tabs.
- What moves on a tab change (the underline slides or only the color changes), within `tabs/indicator-duration`.
- A whole list disabled at once, if the API offers it.
- Where the Tab stop goes when the active tab is disabled (the active tab itself or the first enabled tab).
- A large counter (for example "99+") and its maximum.
- Who provides and translates the hidden context text of the counter ("12 items"): a property of the code.
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
