```json
{
  "id": "DSA-49",
  "goal": "Implement the nph-table, the table to read and compare data in rows and columns, with caption, header, cells, footer, expanding row and tree, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 490,
  "owner": "elvys",
  "state": "ready",
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
      "evidence": null,
      "result": "pending",
      "verified_at": null,
      "verified_by": null
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "docs/operacao/evidencias/DSA-49/documentacao-figma-aceita-2026-10-23.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-22.md, nph-table visual acceptance, focus ring at 2 px, rating star kept with the WCAG 1.4.11 exception, link in dark on theme/brand-200, header in dark on color/muted, thumbnail on image/size-sm, selection left to the nph-data-table, Figma UX QA approved and documentation accepted",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-23.md, textual audit approved; underlined cell link, actions with Edit and ⋮ as icons, generic photo in thumbnail and expanded item; approved_order 490",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-25.md, fixed-header line on color/border in both modes (Figma and tokens); the table ships the ⋮ as the nph-icon-button and wires the nph-dropdown-menu when DSA-45 is done"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1370-113",
    "date": "2026-10-23",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-table board, with its `Documentação` frame (2584:66651), was accepted as the API and behavior specification of the nph-table. COMPONENT_SET 1370:113; parts 1370:19, 1370:20, 2425:1032, 2425:1033, 2425:1046, 2571:66334, 2571:66335 and 2571:66336. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-10-25"
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
