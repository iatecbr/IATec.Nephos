```json
{
  "id": "DSA-55",
  "goal": "Implement the nph-toolbar, the bar that gathers in one line the actions for an area of the screen, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 540,
  "owner": "elvys",
  "state": "in-progress",
  "piece": "nph-toolbar",
  "dependencies": [
    "DSA-03",
    "DSA-10",
    "DSA-13",
    "DSA-16",
    "DSA-17",
    "DSA-22",
    "DSA-23",
    "DSA-43",
    "DSA-45",
    "DSA-48",
    "DSA-52",
    "DSA-57",
    "DSA-59",
    "DSA-60",
    "DSA-61"
  ],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-toolbar documentation in Figma was accepted by the design owner, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-55/documentacao-figma-aceita-2026-10-28.md",
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
  "blockers": [],
  "pending_decisions": [
    {
      "id": "D-1",
      "question": "The evidence says that in the em massa bar the hover of the actions uses toolbar/bulk-action-background-hover, without saying which actions. The code points the hover of the secondary ghost actions, with text and icon only, at that token inside the bulk bar; the danger ghost action keeps its own destructive hover, which stays visible over the highlighted background. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-29"
    },
    {
      "id": "D-2",
      "question": "The evidence sends the keyboard to the W3C ARIA Authoring Practices toolbar pattern, which leaves two choices open. The code wraps the arrow keys from the last action to the first and back, as nph-dropdown-menu does, and keeps the search field (nph-input) out of the arrow keys, as its own Tab stop before the actions, because the arrow keys edit its text. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-29"
    },
    {
      "id": "D-3",
      "question": "The evidence gives the bar the role toolbar but says the applied filters are not actions. The code gives the applied filters strip the role group, named by its label, with no arrow keys: the X of each chip and Limpar filtros are Tab stops of their own, which is what the focus rule after a removal assumes. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-29"
    },
    {
      "id": "D-4",
      "question": "The evidence asks for the removal of a chip by its X to be announced in a status region, and says nothing about Limpar filtros. The code also announces, in the same region, the text the consumer gives when Limpar filtros takes every filter away, and then sends the focus to the button that opens the filters. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-29"
    },
    {
      "id": "D-5",
      "question": "The evidence says that on a narrow screen the text of the buttons goes away first and then the actions at the back go to the More menu. The code does not do this by itself in this version: the bar does not wrap, and the sheet tells the consumer to compose the narrow bar with icon-only buttons and the More menu. Whether the bar must collapse by itself is open. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-29"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-55/documentacao-figma-aceita-2026-10-28.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-27.md, nph-toolbar visual acceptance, Figma UX QA and textual audit approved, documentation accepted; keyboard rule moved from Figma to this task; nph-chip enters the toolbar as an applied filter; approved_order 540",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-28.md, nph-toolbar documentation accepted again with the tipo filtros aplicados: the applied filters go in a strip below the page bar, option A of the preview, with one nph-chip per filter and Limpar filtros after the last one, shown from the first chip; after a chip is removed the focus goes to the next chip, else the previous, else the button that opens the filters; no new token",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-28.md, nph-input documentation with the compact size accepted; its tokens and DSA-59 are on v/5.0.0, which closes B1",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-29.md, nph-togglebutton and nph-toggle-group documentation with the size and the new states accepted; their tokens and DSA-61 are on v/5.0.0, which closes B2"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=2944-6528",
    "date": "2026-10-28",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-toolbar board, with its Documentação frame (2944:6528), was accepted as the API and behavior specification of nph-toolbar, and accepted again on 2026-10-28 with the tipo filtros aplicados. Component set: nph-toolbar (2105:426), tipo × tamanho, 15 variants. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": "feat/dsa-55-toolbar", "commit": null, "pr": null },
  "context": "docs/operacao/contextos/DSA-55.md",
  "updated_at": "2026-10-29"
}
```

# DSA-55 — nph-toolbar, bar of actions for an area of the screen

## Goal
The `nph-toolbar` exists in `src/components/nph-toolbar/`, with a spec, tests and stories, in the contract accepted in Figma.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-55/documentacao-figma-aceita-2026-10-28.md`. It carries the Figma documentation converted to text, with the tokens of each part. There is no need to open Figma.

**Keyboard.** By decision of Indiane, the keyboard rule left the Figma accessibility table and comes in this task: follow the W3C ARIA Authoring Practices toolbar pattern (https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/). This is the future toolbar that the D5 of DSA-23 points to.

## Why it is ready
The applied filters decided on 2026-10-28 go in a strip below the page bar (tipo `filtros aplicados`, with one nph-chip per filter and "Limpar filtros" after the last one); that closes the earlier question about where the chip goes, and it makes nph-chip (DSA-57) a dependency. The 14 `toolbar/*` tokens came with this task and are on `v/5.0.0`; the strip needs no new token. Each one is an alias of a semantic token; no core primitive was added. Three pieces the bar holds changed in Figma on 2026-10-27. B1 is closed: the nph-input compact documentation was accepted on 2026-10-28, and its tokens and its task, DSA-59, are on `v/5.0.0`; DSA-59 is now a dependency. B3 is closed: the secondary ghost hover tokens of nph-button and nph-icon-button and their task, DSA-60, are on `v/5.0.0`; DSA-60 is now a dependency. B2 is closed: the nph-togglebutton and nph-toggle-group documentation with the size and the new states was accepted on 2026-10-29, and their tokens and their task, DSA-61, are on `v/5.0.0`; DSA-61 is now a dependency. DSA-52, the solid icon on hover, is `done`. nph-chip (DSA-57), used by the applied filters strip, and nph-input compact (DSA-59), used by the compact search, are `done`. B4 is closed: DSA-60 (the secondary ghost hover the actions of the bar use, PR #143) and DSA-61 (nph-togglebutton and nph-toggle-group at 28, 36 and 44 px with the new states, PR #145) are `done` on `v/5.0.0`, so every dependency is `done` and the task is `ready`.

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
It does not create a token or change a token value. It does not change nph-input, nph-togglebutton, nph-toggle-group, nph-button or nph-icon-button. It does not build nph-chip, which is DSA-57, nor nph-pagination, which is a sibling piece, nor nph-data-table, which places the bar above the table. It does not add a vertical bar. It does not change Figma.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, page `⏳NPH — Toolbar` (`1626:44`), Documentação frame `2944:6528`
- Component set: nph-toolbar `2105:426`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
- W3C ARIA Authoring Practices, toolbar pattern
