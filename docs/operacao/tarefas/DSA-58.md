```json
{
  "id": "DSA-58",
  "goal": "Implement the nph-data-table, the table to search, sort, select and act on records, with toolbar, row actions and pagination, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 570,
  "owner": "elvys",
  "state": "done",
  "piece": "nph-data-table",
  "dependencies": [
    "DSA-03",
    "DSA-12",
    "DSA-17",
    "DSA-26",
    "DSA-27",
    "DSA-29",
    "DSA-40",
    "DSA-43",
    "DSA-45",
    "DSA-49",
    "DSA-54",
    "DSA-55",
    "DSA-56",
    "DSA-57",
    "DSA-60"
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
      "command": "git merge-base --is-ancestor 0dc524b1555bb7768c7072025ec38cef7bdcbe0b origin/v/5.0.0",
      "evidence": "docs/operacao/evidencias/DSA-58/review-and-merge-2026-10-29.md",
      "result": "passed",
      "verified_at": "2026-10-29",
      "verified_by": "claude-code"
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "docs/operacao/evidencias/DSA-58/documentacao-figma-aceita-2026-10-28.md",
    "docs/operacao/evidencias/DSA-58/review-and-merge-2026-10-29.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-28.md, nph-data-table: toolbar as nph-toolbar, footer by width with nph-pagination, focus ring inside the sortable header cell, unchecked box border on color/input-hover; Figma UX QA and textual audit approved, documentation accepted",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-23.md (15:1x), lot B of the pending decisions of the v1 closing: Indiane answered D-1, D-3 and D-4 in the chat, all as recommended, after market research with sources; D-3 changes the code in DSA-115",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-26.md, approval round 3 of the pending items (2026-11-26 08:18): the design owner accepted the recommended option of D-2, D-5, D-6, after market research with sources"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=2875-17577",
    "date": "2026-10-28",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-data-table board (1371:282), with its Documentação frame (2875:17577), was accepted as the API and behavior specification of nph-data-table. Component set: nph-data-table (2633:69628), estado × size × moldura × cabeçalho fixo × foco × grade × expande, with the inner pieces cabeçalho (1371:37), seleção (1371:68), linha (1371:138), ações (1371:69) and ajuste (2633:5120). The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": "feat/dsa-58-data-table", "commit": "0dc524b", "pr": 147 },
  "context": null,
  "updated_at": "2026-11-26"
}
```

# DSA-58 — nph-data-table, table to search, sort, select and act on records

## Goal
The `nph-data-table` exists in `src/components/nph-data-table/`, with a spec, tests and stories, in the contract accepted in Figma.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-58/documentacao-figma-aceita-2026-10-28.md`. It carries the Figma documentation converted to text, with the tokens of each part and of each state. There is no need to open Figma.

## Why it is ready
The 13 `data-table/*` tokens came with this task and are on `v/5.0.0`; no core primitive was needed. The table itself builds on nph-table (DSA-49, DSA-56), and the pieces inside are done: nph-icon, nph-badge, nph-checkbox, nph-skeleton, nph-switch, nph-select, nph-empty, nph-dropdown-menu, nph-icon-button and nph-pagination. The search field, an nph-input, comes inside the nph-toolbar.

The toolbar above the table and the bulk action bar are the nph-toolbar (DSA-55), which is `done` on `v/5.0.0` (PR #146). The hover of the ghost ⋮ in each row uses the secondary ghost hover of DSA-60, which is `done` (PR #143). The nph-chip (DSA-57), used by the applied filters, is done. B1 is closed: DSA-55 and DSA-60 are `done`, so every dependency is `done` and the task is `ready`.

## Decisions answered on 2026-11-23
Indiane answered D-1, D-3 and D-4 in the chat on 2026-11-23, in lot B of the pending decisions of the v1 closing, all as recommended, after market research with sources.

| ID | Answer | What the code does |
|---|---|---|
| D-1 | Kept for v1: the product chooses the footer with `pagination-layout`; the footer does not switch by itself. There is no breakpoint token for 850 or 420 px, and a literal width is forbidden in the component; Carbon defines no responsive footer either (https://carbondesignsystem.com/components/data-table/usage/ ). | Nothing changes. |
| D-3 | Changed: a click on a sortable header goes ascending, descending and back to unsorted. MUI and AG Grid cycle this way, and Carbon has the unsorted state (https://mui.com/x/react-data-grid/sorting/ , https://www.ag-grid.com/javascript-data-grid/row-sorting/ , https://carbondesignsystem.com/components/data-table/usage/ ). | Changes in DSA-115. |
| D-4 | Confirmed: Selecionar todas checks and unchecks only the rows drawn on the current page; rows selected on other pages stay selected. MUI and AG Grid offer this mode, and checking rows the person does not see is a risk in a bulk action (https://mui.com/x/react-data-grid/row-selection/ , https://www.ag-grid.com/javascript-data-grid/row-selection-multi-row/ ). | Nothing changes. If a product asks for every row, a "select all" notice comes in a task of its own. |

## Decision answered on 2026-11-26
Indiane answered D-2, D-5, D-6 on 2026-11-26, in the approval round of the pending items, as recommended, after market research with sources.

| ID | Answer | What the code does |
|---|---|---|
| D-2 | Option 1: ascending `arrow-up`, descending `arrow-up` turned half a turn, with no new icon. The APG uses arrows for direction and a different shape for not sorted (https://www.w3.org/WAI/ARIA/apg/patterns/table/examples/sortable-table/ ). | Nothing changes. Figma updated on 2026-11-26: header 1371:37, 8 icons (`arrow-up` and `arrow-up` turned 180 degrees). |
| D-5 | Option 1: as many skeleton rows as the rows already on screen, or the page size on the first load. Contentful matches the number of rows to what arrives (https://f36.contentful.com/components/skeleton ). | Nothing changes. Figma updated on 2026-11-26: node 2633:69471, one row added (4 rows in the loading variants). |
| D-6 | Option 1: the adjustment column stays before the actions column. shadcn keeps the actions as the last column (https://ui.shadcn.com/docs/components/data-table ). | Nothing changes. Figma draws only the adjustment cell alone (node 2633:69761); nothing to update. |

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
It does not create a token or change a token value. It does not change nph-table, nph-toolbar, nph-pagination, nph-chip, nph-checkbox or any other piece it uses. It does not add load more or infinite scroll. It does not change Figma.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, page `NPH — Data Table` (`1371:2`), board `1371:282`, Documentação frame `2875:17577`
- Component set: nph-data-table `2633:69628`; pieces `1371:37`, `1371:68`, `1371:138`, `1371:69`, `2633:5120`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
