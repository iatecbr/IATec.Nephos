```json
{
  "id": "DSA-89",
  "goal": "Implement the nph-timeline, a vertical list of events in order linked by a connector line, in the contract accepted in Figma, and write the spec.",
  "phase": "F4",
  "approved_order": 880,
  "owner": "elvys",
  "state": "done",
  "piece": "nph-timeline",
  "dependencies": [
    "DSA-03",
    "DSA-10",
    "DSA-13",
    "DSA-24",
    "DSA-26",
    "DSA-40",
    "DSA-60"
  ],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-timeline documentation in Figma was accepted by the design owner, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-89/figma-docs-accepted-2026-11-17.md",
      "result": "passed",
      "verified_at": "2026-11-17",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, CSS, tests, stories and spec pass the proof commands and are merged into v/5.0.0.",
      "command": "git merge-base --is-ancestor 3be61aeabf422ffbf545eef659d4f0a904b81330 origin/v/5.0.0",
      "evidence": "docs/operacao/evidencias/DSA-89/review-and-merge-2026-11-18.md",
      "result": "passed",
      "verified_at": "2026-11-18",
      "verified_by": "claude-code"
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "docs/operacao/evidencias/DSA-89/figma-docs-accepted-2026-11-17.md",
    "docs/operacao/evidencias/DSA-89/review-and-merge-2026-11-18.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-14.md and 2026-11-16.md, nph-timeline: adjustment rounds with the corrections of the design owner (brand palette on the details: history dot, connector line and neutral circle; lighter pending outline)",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-17.md, nph-timeline: green light (visual acceptance) and a test round with the 16 approval items taken as recommended: documentation accepted, 27 timeline tokens with four straight to the core by decision, connector line on color/primary-border, pending outline on color/input, tonal marker, descriptions with additions only, connector line on a whole pixel, history in columns in the nph-table, rich content in the nph-card base or section, default behavior",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-23.md (15:1x), lot B of the pending decisions of the v1 closing: Indiane answered D-3 in the chat, as recommended, after market research with sources",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-26.md, approval round 3 of the pending items (2026-11-26 08:18): the design owner accepted the recommended option of D-1, D-2, after market research with sources"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=5237-3423",
    "date": "2026-11-17",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-timeline documentation frame (5237:3423, page 1626:37) was accepted as the API and behavior specification of nph-timeline, with the visual acceptance of the root (5226:2261). COMPONENT_SET nph-timeline item (5216:304), 8 variants; COMPONENT_SET nph-timeline (5216:701), 6 variants. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": {
    "branch": "feat/dsa-89-timeline",
    "commit": "3be61aeabf422ffbf545eef659d4f0a904b81330",
    "pr": 185
  },
  "context": null,
  "updated_at": "2026-11-26"
}
```

# DSA-89 — nph-timeline, events in order linked by a line

## Goal
The `nph-timeline` in `src/components/nph-timeline/`, with CSS, tests, stories and the spec `fichas/nph-timeline.md`, in the contract accepted in Figma: an ordered list of items, each with a marker (dot, circle or avatar), a title, an optional description, a meta line (who and when) and an optional action, linked by a connector line, in two types (process, history). It records and does not navigate.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-89/figma-docs-accepted-2026-11-17.md`. It carries the Figma documentation converted to text, with the 27 tokens, the anatomy part by part (with the token of each layer), the measured contrast, the default behavior, the combined states, the inherited decisions, the icon and image rules, the limits and the 16 decisions answered. There is no need to open Figma.

## Specification to follow closely
- **Parts and tokens**: as the anatomy of the evidence. Item: marker column `timeline/marker-size` (24) wide, then the content, gap `timeline/content-gap`. Content: text (title, description, meta line, gap `timeline/text-gap`), then the action (gap `timeline/action-gap`), bottom space `timeline/item-gap`. Title row minimum height `timeline/marker-size`, the title centered on the marker; with two lines it grows.
- **Markers**: dot (`timeline/dot-size`, `timeline/dot-background`, corner `timeline/marker-radius`) inside a 24 px box; circle (`timeline/marker-size`, `timeline/marker-radius`) with the state tokens of the evidence: neutral `timeline/marker-background` with the event icon in `timeline/marker-foreground`; completed `timeline/marker-background-primary` with the check in `timeline/marker-foreground-primary`; current the same background with a center dot (`timeline/dot-size`) in `timeline/marker-foreground-primary`; pending no fill, outline `timeline/marker-border-width` in `timeline/marker-border-pending`, no glyph; error and warning `timeline/marker-*-error` and `timeline/marker-*-warning` (background, icon, outline). Avatar: the nph-avatar `sm`, no circle around it.
- **Text**: title `text/label-md` in `timeline/title-foreground` (current `text/label-md-strong`; pending `timeline/title-foreground-pending`); description `text/body-md` in `timeline/description-foreground`; meta line `text/caption` in `timeline/meta-foreground`, who and when separated by a middle dot with a space on each side; on the pending item the waiting word comes first, `text/caption` in `timeline/description-foreground`, then the middle dot and who. No gap between the parts: the spaces are in the text. The date part goes in `time datetime`.
- **Connector line**: a 1 px vertical line (`border/width`, drawn in Figma by the vertical nph-separator), color `timeline/connector-border`; on the pending item `color/border`. `timeline/connector-gap` above and below; it runs from the marker to the item bottom and is off on the last item. It leaves the flex centering of the marker column and is positioned at `left: 12px` inside it, with no `transform`, so the 1 px line stays sharp (item 12). How the item paints the color is an open point below.
- **Icons**: nph-icon `light`, `icon/size-sm` box (`timeline/marker-icon-size`); the weight never swaps. Decorative.
- **Action**: nph-button secondary ghost default, below the text, off by default ("See details"). A long list ends in a ghost nph-button "Show more", outside the list, aligned to the marker column.
- **Types**: process (circle items with the state of each step; one current item) and history (dot items, neutral; avatar or circle with an icon by choice). On both types a sequence has 2 items or more, with no ceiling; a single event is one item with the connector line off, in the same named `ol` with one `li`.
- **States**: the item has no interaction state (no hover, pressed, focus, selected or disabled); its states are status values, one per item. A disabled action keeps the item as it is; only the button goes under `state/disabled-opacity` (T11).
- **Keyboard and roles**: the default behavior table of the evidence. `ol`/`li` with a name (`aria-labelledby` or `aria-label`); only the actions take Tab; arrows do nothing; marker and connector line `aria-hidden`; the state in the item text or in a hidden text at its start; date in `time datetime`; `aria-current="step"` on the current item of the process type only; a short `aria-live="polite"` announcement outside the list for live events and for "Show more"; when the last batch arrives the button goes away and focus moves to the first new item. Loading: `aria-busy="true"`, skeleton `aria-hidden="true"`, a hidden "Loading" text outside the hidden node. Empty: nph-empty in place of the list.
- **Motion**: none. If the code animates the arrival of events, it is instant under `prefers-reduced-motion` (DSA-62 D-3).
- **Images**: the avatar photo is exported at 48 × 48 (2x), cover crop centered on the face; with no photo, while it loads or if it fails, the `user` icon (DSA-24 D3).

## Open points for the code
- Event, aria, slot, property and console warning, following the APG and the Custom Elements Manifest.
- How the list gets its items and each item its parts (child elements, slots by part name, or properties for title, description, meta and state) and how the type, the marker and the state are set. The spec names them.
- The hidden state and event type texts, the waiting word, "Loading", "See details" and "Show more": their translation strings and where they sit. The spec names them.
- The live region text for new events and for "Show more" (for example "2 new events"). The spec names it.
- How "Show more" asks for the earlier events (an event to the product) and how the timeline knows it was the last batch. The spec names it.
- The relative date next to the absolute one ("2 h ago") is optional and comes from the product; the spec says who formats it.
- The connector line color against the nph-separator spec: the color accepted in Figma (item 6) is `timeline/connector-border`, with `color/border` on the pending item, and the thickness is `border/width`; `fichas/nph-separator.md` fixes the separator color at `color/border` and its CSS has no color hook. How the item paints the line stays with the code, and the spec names the path: the item sets the color of the separator it holds, or the item draws its own 1 px line with `border/width`. The color and the thickness do not change.
- The middle dot separator of the meta line and the order of who and when: whether they come from translation strings. The spec names it.
- Rich content below the item text is a free slot for an nph-card base or section; the timeline does not style it.
- The width: Figma widths (360) are examples; the timeline takes the container width.

## Why it is ready
The 27 `timeline/*` tokens came with this task and are on `v/5.0.0`: 23 aliases of semantics and 4 straight to the core by decision (`timeline/marker-size` `core/icon-size/300`, `timeline/dot-size` `core/space/200`, `timeline/connector-gap` `core/space/100`, `timeline/content-gap` `core/space/300`: no semantic of the same value has the function; the evidence says why for each). No new semantic or primitive. Every piece it uses is done: `nph-icon` (DSA-03), `nph-separator` (DSA-10), `nph-button` (DSA-13, ghost hover DSA-60), `nph-avatar` (DSA-24), `nph-skeleton` (DSA-26), `nph-empty` (DSA-40).

## Decision answered on 2026-11-23
Indiane answered D-3 in the chat on 2026-11-23, in lot B of the pending decisions of the v1 closing, as recommended, after market research with sources.

| ID | Answer | What the code does |
|---|---|---|
| D-3 | Confirmed: in the history type, an item with the current status takes the current look (strong title and center dot) with no `aria-current`. `aria-current` marks where the person is in a navigation or a process, and a history is neither (https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-current ). | Nothing changes. |

## Decision answered on 2026-11-26
Indiane answered D-1, D-2 on 2026-11-26, in the approval round of the pending items, as recommended, after market research with sources.

| ID | Answer | What the code does |
|---|---|---|
| D-1 | Option 2: three loading rows with bars that imitate real text, title at 60% and meta at 35%, as the skeleton of `nph-card`. Fluent keeps the skeleton simple, reflecting title and subtitle (https://fluent2.microsoft.design/components/web/react/core/skeleton/usage ). | The loading rows draw two bars of 60% and 35%. Figma updated on 2026-11-26: examples 5238:570 and 5238:601, light and dark. |
| D-2 | Option 2: the new item that receives focus after the last Show more shows the standard focus mark: 1 px `focus/border` and 4 px `focus/halo`, corner `radius/control`, with no new token. WCAG 1.4.11 asks 3:1 for a focus mark (https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html ). | The new item draws that mark while it has focus. Figma updated on 2026-11-26: boolean `foco` on the set `nph-timeline / item` 5216:304, the focus border and halo, hidden by default. |

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
The code does not create a token or change a token value. It does not change Figma. It does not change the nph-stepper, the nph-separator or the nph-card. It does not build a history in columns (that is the nph-table, item 13). It does not change the description of `status/error-border` and `status/warning-border`: that is a foundation task (item 11).

## Sources
- Figma `DS-IA-NEPHOS 5.0`, page `1626:37`, documentation frame `5237:3423`, root `5226:2261`, appendix `5240:5360` and the evidence of the `figma-docs-accepted` gate
- Component sets: nph-timeline item set `5216:304`; nph-timeline `5216:701`
- WAI-ARIA APG, patterns: https://www.w3.org/WAI/ARIA/apg/patterns/
- WAI-ARIA APG, Feed: https://www.w3.org/WAI/ARIA/apg/patterns/feed/
- WAI-ARIA 1.2, aria-current: https://www.w3.org/TR/wai-aria-1.2/#aria-current
- HTML, the time element: https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-time-element
- Primer, Timeline accessibility: https://primer.style/product/components/timeline/accessibility/
- WCAG 2.2, non-text contrast: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- Custom Elements Manifest: https://github.com/webcomponents/custom-elements-manifest
- `design.md` — the tokens named in the evidence
- `fichas/nph-separator.md`, `fichas/nph-icon.md`, `fichas/nph-avatar.md`, `fichas/nph-button.md`, `fichas/nph-skeleton.md`, `fichas/nph-empty.md`, `fichas/nph-stepper.md`
