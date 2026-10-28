```json
{
  "id": "DSA-57",
  "goal": "Implement the nph-chip, the small rounded piece for an applied filter, a chosen value or a quick filter, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 560,
  "owner": "elvys",
  "state": "ready",
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
      "evidence": null,
      "result": "pending",
      "verified_at": null,
      "verified_by": null
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "docs/operacao/evidencias/DSA-57/documentacao-figma-aceita-2026-10-28.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-28.md, nph-chip visual acceptance, Figma UX QA and textual audit approved, documentation accepted; X ring in the status color; smaller counter; counter background on hover; border on every chip with a status border in the status colors; approved_order 560"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=3077-2240",
    "date": "2026-10-28",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-chip board, with its Documentação frame (3077:2240), was accepted as the API and behavior specification of nph-chip. Component set: nph-chip (3076:1439), tipo × cor × conteúdo × tamanho × estado, 152 variants. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-10-28"
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

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
It does not create a token or change a token value. It does not change nph-icon, nph-badge, nph-avatar, nph-tooltip, nph-button or nph-toolbar. It does not build the field that holds chips. It does not add a horizontal scroll to a line of chips. It does not change Figma.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, page `⏳NPH — Chip` (`1626:40`), Documentação frame `3077:2240`
- Component set: nph-chip `3076:1439`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
