```json
{
  "id": "DSA-58",
  "goal": "Implement the nph-data-table, the table to search, sort, select and act on records, with toolbar, row actions and pagination, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 570,
  "owner": "elvys",
  "state": "blocked",
  "piece": "nph-data-table",
  "dependencies": [
    "DSA-03",
    "DSA-12",
    "DSA-17",
    "DSA-26",
    "DSA-27",
    "DSA-29",
    "DSA-40",
    "DSA-45",
    "DSA-49",
    "DSA-54",
    "DSA-55",
    "DSA-56",
    "DSA-57"
  ],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-data-table documentation in Figma was accepted by the design owner, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-58/documentacao-figma-aceita-2026-10-28.md",
      "result": "passed",
      "verified_at": "2026-10-28",
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
  "blockers": [
    {
      "id": "B1",
      "what_blocks": "The toolbar and the bulk action bar of the nph-data-table are the nph-toolbar (DSA-55), which is blocked; its applied filters use the nph-chip (DSA-57), which is not done yet.",
      "owner": "elvys",
      "what_resolves": "DSA-55 (nph-toolbar) and DSA-57 (nph-chip) are done on v/5.0.0.",
      "opened_at": "2026-10-28"
    }
  ],
  "pending_decisions": [],
  "evidence": [
    "docs/operacao/evidencias/DSA-58/documentacao-figma-aceita-2026-10-28.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-28.md, nph-data-table: toolbar as nph-toolbar, footer by width with nph-pagination, focus ring inside the sortable header cell, unchecked box border on color/input-hover; Figma UX QA and textual audit approved, documentation accepted"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=2875-17577",
    "date": "2026-10-28",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-data-table board (1371:282), with its Documentação frame (2875:17577), was accepted as the API and behavior specification of nph-data-table. Component set: nph-data-table (2633:69628), estado × size × moldura × cabeçalho fixo × foco × grade × expande, with the inner pieces cabeçalho (1371:37), seleção (1371:68), linha (1371:138), ações (1371:69) and ajuste (2633:5120). The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-10-28"
}
```

# DSA-58 — nph-data-table, table to search, sort, select and act on records

## Goal
The `nph-data-table` exists in `src/components/nph-data-table/`, with a spec, tests and stories, in the contract accepted in Figma.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-58/documentacao-figma-aceita-2026-10-28.md`. It carries the Figma documentation converted to text, with the tokens of each part and of each state. There is no need to open Figma.

## Why it is blocked
The 13 `data-table/*` tokens came with this task and are on `v/5.0.0`; no core primitive was needed. The table itself builds on nph-table (DSA-49, DSA-56), and the pieces inside are done: nph-icon, nph-badge, nph-checkbox, nph-skeleton, nph-switch, nph-select, nph-empty, nph-dropdown-menu, nph-icon-button and nph-pagination. The search field, an nph-input, comes inside the nph-toolbar.

The toolbar above the table and the bulk action bar are the nph-toolbar (DSA-55), which is blocked, and its applied filters use the nph-chip (DSA-57), which is not done. When both are done, this task goes to `ready`.

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
It does not create a token or change a token value. It does not change nph-table, nph-toolbar, nph-pagination, nph-chip, nph-checkbox or any other piece it uses. It does not add load more or infinite scroll. It does not change Figma.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, page `NPH — Data Table` (`1371:2`), board `1371:282`, Documentação frame `2875:17577`
- Component set: nph-data-table `2633:69628`; pieces `1371:37`, `1371:68`, `1371:138`, `1371:69`, `2633:5120`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
