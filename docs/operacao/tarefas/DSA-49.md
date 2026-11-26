```json
{
  "id": "DSA-49",
  "goal": "Implement the nph-table, the table to read and compare data in rows and columns, with caption, header, cells, footer, expanding row and tree, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 490,
  "owner": "elvys",
  "state": "done",
  "piece": "nph-table",
  "dependencies": [
    "DSA-03",
    "DSA-12",
    "DSA-13",
    "DSA-24",
    "DSA-26",
    "DSA-40",
    "DSA-43",
    "DSA-48",
    "DSA-51"
  ],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-table documentation in Figma was accepted by the design owner, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-49/documentacao-figma-aceita-2026-10-23.md",
      "result": "passed",
      "verified_at": "2026-10-23",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, CSS, tests, stories and spec pass the proof commands and are merged into v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-49/review-and-merge-2026-10-26.md",
      "result": "passed",
      "verified_at": "2026-10-26",
      "verified_by": "claude-code"
    }
  ],
  "blockers": [],
  "pending_decisions": [
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-49/documentacao-figma-aceita-2026-10-23.md",
    "docs/operacao/evidencias/DSA-49/review-and-merge-2026-10-26.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-26.md, approval round 4 of the pending items (2026-11-26 08:19): the component token contract in design.md, A0 to A6 (Carbon, Primer, Salesforce)",
    "docs/decisoes-tecnicas.md#p97",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-22.md, nph-table visual acceptance, focus ring at 2 px, rating star kept with the WCAG 1.4.11 exception, link in dark on theme/brand-200, header in dark on color/muted, thumbnail on image/size-sm, selection left to the nph-data-table, Figma UX QA approved and documentation accepted",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-23.md, textual audit approved; underlined cell link, actions with Edit and ⋮ as icons, generic photo in thumbnail and expanded item; approved_order 490",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-25.md, fixed-header line on color/border in both modes (Figma and tokens); the table ships the ⋮ as the nph-icon-button and wires the nph-dropdown-menu when DSA-45 is done",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-26.md, approval round 3 of the pending items (2026-11-26 08:18): the design owner accepted the recommended option of D1 to D7, after market research with sources"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1370-113",
    "date": "2026-10-23",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-table board, with its `Documentação` frame (2584:66651), was accepted as the API and behavior specification of the nph-table. COMPONENT_SET 1370:113; parts 1370:19, 1370:20, 2425:1032, 2425:1033, 2425:1046, 2571:66334, 2571:66335 and 2571:66336. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": "claude/dsa-49-nph-table-8d2ed2", "commit": "72fb0c28c7b37c70ef3bdfcdc9a31817a5c22f27", "pr": "119" },
  "context": null,
  "updated_at": "2026-11-26"
}
```

# DSA-49 — nph-table, the table to read and compare data

## Goal
The `nph-table` exists in `src/components/nph-table/`, with a spec, tests and
stories, in the contract accepted in Figma.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate:
`docs/operacao/evidencias/DSA-49/documentacao-figma-aceita-2026-10-23.md`. It
carries the Figma documentation converted to text, with the tokens of each part.
There is no need to open Figma.

## Why it is ready
Every piece it composes is done, and every token it uses is on `v/5.0.0`: the
`table/*` tokens and the core primitives `core/surface/25`, `core/space/800` and
`core/focus-width/sm` were taken to the token sources together with this task.

The pieces it composes:
- `nph-icon` (DSA-03) — icons in the cell and the `image` icon of the thumbnail
  without a photo.
- `nph-badge` (DSA-12) — the `selo` content and the total of the caption.
- `nph-button` (DSA-13) — the `botão` content and the written Edit of the mixed
  actions.
- `nph-avatar` (DSA-24) — the `pessoa` content, at md.
- `nph-skeleton` (DSA-26) — the `carregando` content.
- `nph-empty` (DSA-40) — the empty body.
- `nph-icon-button` (DSA-43) — the chevron, the icon-only Edit and the ⋮.
- `nph-tooltip` (DSA-48) — the truncated text.
- `nph-image` (DSA-51) — the photo of the thumbnail and of the expanded item.

## Decision answered on 2026-11-26
Indiane answered D1 to D8 on 2026-11-26, in the approval round of the pending items, as recommended, after market research with sources.

| ID | Answer | What the code does |
|---|---|---|
| D1 | Option 2: a full-width group row with chevron, name in `text/heading-xs` and the count in an `nph-badge` secondary light, on `table/header-background`. AG Grid draws a full-width group row with name, count and chevron (https://www.ag-grid.com/javascript-data-grid/grouping-group-rows/ ). | The code draws the category group as that full-width row, with no new token. Figma updated on 2026-11-26: the set `nph-table / linha de grupo` 8478:47901 (open and closed), in the nph-table root (example 2428:1280 and the category 2425:984). |
| D2 | Option 1: keep the roles of today: caption title `text/heading-sm`, description and cell `text/body-md`, second line `text/body-sm`. No market source; the basis is `design.md`. | Nothing changes. Figma updated on 2026-11-26: caption in node 1370:21 and its 9 variants (title `text/heading-sm`, description `text/body-md`). |
| D3 | Option 2: `image` (Font Awesome light and solid) enters the core and shows centered, 16 px, in `table/muted-foreground`, on a thumbnail without a photo (https://fontawesome.com/icons/image?s=light ). | Adds `image` to the `nph-icon` core and the empty thumbnail shows it. Figma already draws it (node 2571:65008). |
| D4 | Option 1: `pen-to-square` for every Edit in Nephos. In Font Awesome it has the official alias edit (https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/js-packages/@fortawesome/free-regular-svg-icons/faPenToSquare.js ). | Every Edit action uses `pen-to-square`. Figma updated on 2026-11-26: `nph-context-menu` 4819:15828, 12 instances from `pen` to `pen-to-square`. |
| D5 | Option 1: only success and error, with `circle-check` and `circle-xmark`. Carbon asks for shape and text, not only color (https://carbondesignsystem.com/patterns/status-indicator-pattern/ ). | Nothing changes. Figma already draws it (node 2571:65296). |
| D6 | Option 1: one solid `star` and the number beside it. WCAG 1.4.11 spares the graphic when the text beside it carries the same information (https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html ). | Nothing changes. Figma updated on 2026-11-26: rating in node 2571:65620, 12 variants, with one solid star and the number. |
| D7 | Option 2: the total in the caption is an `nph-badge` secondary light, as the `selo` of the cell. Atlassian keeps the bold badge for very important items (https://atlassian.design/components/badge/usage ). | The total badge of the caption changes from solid to light. Figma already draws it (node 2571:66346). |
| D8 | Answered by the contract (A5): a `tokens_table` block in design.md with every `table/*` token, its alias and its use. | Nothing changes. |

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS,
tests, stories and spec pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## Relations with other tasks
- The ⋮ opens the `nph-dropdown-menu` (DSA-45, blocked). The table ships the ⋮ as
  the `nph-icon-button` and wires the menu when DSA-45 is done.
- Sorting, selection, filtering and pagination belong to the `nph-data-table`,
  which has no task yet. The checkbox, the radio and the switch are not part of
  the `nph-table`.
- The `image` glyph of the thumbnail without a photo still points to a preview in
  Figma; when it enters the `nph-icon`, the contract does not change.

## What this task does not do
It does not create a token or change a token value. It does not build the
`nph-data-table`, the `nph-dropdown-menu` or any dependent component. It does
not change Figma.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, set `1370:113`, `Documentação` frame `2584:66651` and
  parts `1370:19`, `1370:20`, `2425:1032`, `2425:1033`, `2425:1046`,
  `2571:66334`, `2571:66335` and `2571:66336`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
