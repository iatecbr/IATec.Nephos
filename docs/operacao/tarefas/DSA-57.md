```json
{
  "id": "DSA-57",
  "goal": "Implement the nph-chip, the small rounded piece for an applied filter, a chosen value or a quick filter, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 560,
  "owner": "elvys",
  "state": "done",
  "piece": "nph-chip",
  "dependencies": [
    "DSA-03",
    "DSA-12",
    "DSA-24",
    "DSA-48"
  ],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-chip documentation in Figma was accepted by the design owner, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-57/documentacao-figma-aceita-2026-10-28.md",
      "result": "passed",
      "verified_at": "2026-10-28",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, CSS, tests, stories and spec pass the proof commands and are merged into v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-57/review-and-merge-2026-10-28.md",
      "result": "passed",
      "verified_at": "2026-10-28",
      "verified_by": "claude-code"
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "docs/operacao/evidencias/DSA-57/documentacao-figma-aceita-2026-10-28.md",
    "docs/operacao/evidencias/DSA-57/review-and-merge-2026-10-28.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-28.md, nph-chip visual acceptance, Figma UX QA and textual audit approved, documentation accepted; X ring in the status color; smaller counter; counter background on hover; border on every chip with a status border in the status colors; approved_order 560",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-23.md (15:0x), lot A of the pending decisions of the v1 closing: Indiane answered D-1 and D-3 in the chat, all as recommended, after market research with sources",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-26.md, approval round 3 of the pending items (2026-11-26 08:18): the design owner accepted the recommended option of D-2, D-4, D-5, after market research with sources"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=3077-2240",
    "date": "2026-10-28",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-chip board, with its Documentação frame (3077:2240), was accepted as the API and behavior specification of nph-chip. Component set: nph-chip (3076:1439), tipo × cor × conteúdo × tamanho × estado, 152 variants. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": "claude/dsa-57-nph-chip", "commit": "53b18ed3753b06474530eb6993413d0283a3c7d2", "pr": "134" },
  "context": null,
  "updated_at": "2026-11-26"
}
```

# DSA-57 — nph-chip, applied filter, chosen value or quick filter

## Goal
The `nph-chip` exists in `src/components/nph-chip/`, with a spec, tests and stories, in the contract accepted in Figma.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-57/documentacao-figma-aceita-2026-10-28.md`. It carries the Figma documentation converted to text, with the tokens of each part and of each state. There is no need to open Figma.

## Why it is ready
The 62 `chip/*` tokens came with this task and are on `v/5.0.0`, with the four core primitives they need. The pieces inside the chip are done: nph-icon (DSA-03), nph-badge (DSA-12), nph-avatar (DSA-24) and nph-tooltip (DSA-48), which shows the whole label when it is cut.

The accepted documentation places the applied filters of nph-toolbar in a line below the bar, with "Limpar filtros" after the last chip. That closes the D-1 that DSA-55 had about where the chip goes in the bar; the nph-toolbar documentation was accepted again on 2026-10-28 with that strip, and DSA-55 now depends on this task. This task does not change DSA-55.

## Decisions answered on 2026-11-23
Indiane answered D-1 and D-3 in the chat on 2026-11-23, in lot A of the pending decisions of the v1 closing, all as recommended, after market research with sources.

| ID | Answer | What the code does |
|---|---|---|
| D-1 | Accepted: the counter is a pill of the chip itself, painted by the `chip/counter-*` tokens with the `text/label-sm` role, not an nph-badge, as nph-pagination (P99) and nph-sidebar-item (P98). MUI also builds such an inner part on its own, as the item of its pagination (https://mui.com/material-ui/api/pagination-item/ ). | Nothing changes. |
| D-3 | Accepted: in the removable chip, a cut label takes the focus (tabindex 0) and shows the whole text in the tooltip; a label that is not cut takes no focus. The APG asks the tooltip to open on keyboard focus too, not only on hover (https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/ ). | Nothing changes. |

## Decision answered on 2026-11-26
Indiane answered D-2, D-4, D-5 on 2026-11-26, in the approval round of the pending items, as recommended, after market research with sources.

| ID | Answer | What the code does |
|---|---|---|
| D-2 | Option 1: `nph-avatar` sm (24 px) in both chip sizes. Fluent warns that a small avatar loses detail (https://fluent2.microsoft.design/components/web/react/core/avatar/usage ). | Nothing changes. Figma already draws it (node 3076:574). |
| D-4 | Option 1: the error pair for hover and focus of the X of an invalid chip, with no new token. WCAG 1.4.11 asks 3:1 for the focus indicator (https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html ). | Nothing changes. Figma already draws it (nodes 3076:698 and 3076:704). |
| D-5 | Option 1: icon, text, counter and X, in this order. Material ends the chip with the remove icon (https://m3.material.io/components/chips/guidelines ). | Nothing changes. Figma already draws it (selection with counter variant). |

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
It does not create a token or change a token value. It does not change nph-icon, nph-badge, nph-avatar, nph-tooltip, nph-button or nph-toolbar. It does not build the field that holds chips. It does not add a horizontal scroll to a line of chips. It does not change Figma.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, page `⏳NPH — Chip` (`1626:40`), Documentação frame `3077:2240`
- Component set: nph-chip `3076:1439`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
