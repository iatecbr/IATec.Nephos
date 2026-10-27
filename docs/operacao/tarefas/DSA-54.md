```json
{
  "id": "DSA-54",
  "goal": "Implement the nph-pagination to move between the pages of a long list, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 530,
  "owner": "elvys",
  "state": "ready",
  "piece": "nph-pagination",
  "dependencies": [
    "DSA-03",
    "DSA-13",
    "DSA-16",
    "DSA-29",
    "DSA-43",
    "DSA-48"
  ],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-pagination documentation in Figma was accepted by the design owner, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-54/documentacao-figma-aceita-2026-10-27.md",
      "result": "passed",
      "verified_at": "2026-10-27",
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
    "docs/operacao/evidencias/DSA-54/documentacao-figma-aceita-2026-10-27.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-27.md, nph-pagination v3 approved, Figma UX QA and textual audit approved, documentation accepted; approved_order 530",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-27.md, decision 9 (closes D-1): the first and last arrows use arrow-left-to-line from Font Awesome Pro 6, an arrow with a bar; the last arrow is the same icon rotated"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1640-196",
    "date": "2026-10-27",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-pagination board, with its Documentação frame (1640:196), was accepted as the API and behavior specification of nph-pagination. Components: nph-pagination (1640:194), nph-pagination/página (2888:87682), nph-pagination/reticências (2888:87798), nph-pagination/ir para a página (2888:87805). The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-10-27"
}
```

# DSA-54 — nph-pagination, bar to move between the pages of a list

## Goal
The `nph-pagination` exists in `src/components/nph-pagination/`, with a spec, tests and stories, in the contract accepted in Figma. The Font Awesome icon `arrow-left-to-line` (light and solid) is added to `icones_nucleo` › `direcao_e_revelacao` in `design.md`, to `src/components/nph-icon/nph-icon.icons.ts` and to the icon list in `docs/operacao/evidencias/DSA-09/conferir-nph-icon-figma.cjs`.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-54/documentacao-figma-aceita-2026-10-27.md`. It carries the Figma documentation converted to text, with the tokens of each part. There is no need to open Figma.

## Why it is ready
Every piece it composes is done, and every token it uses is on `v/5.0.0`: the 19 `pagination/*` tokens, the primitives `core/space/1000` and `core/layout-width/page-size-select`, and the text role `text/label-md-strong` came with this task. Each `pagination/*` token is an alias of a semantic token or, where there is none with the same function, of a core primitive. The component depends on nph-icon (DSA-03), nph-button (DSA-13), nph-input (DSA-16), nph-select (DSA-29), nph-icon-button (DSA-43) and nph-tooltip (DSA-48), all delivered. nph-icon gains one Font Awesome icon in this task, `arrow-left-to-line` (light and solid); the evidence names its packages, under "First and last arrow icon".

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
It does not create a token or change a token value. It does not build nph-data-table, which places the bar below the table. It does not add load more or infinite scroll. It does not change Figma.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, page `🎨NPH — Pagination`, Documentação frame `1640:196`
- Components: nph-pagination `1640:194`, nph-pagination/página `2888:87682`, nph-pagination/reticências `2888:87798`, nph-pagination/ir para a página `2888:87805`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
