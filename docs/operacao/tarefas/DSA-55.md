```json
{
  "id": "DSA-55",
  "goal": "Implement the nph-toolbar, the bar that gathers in one line the actions for an area of the screen, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 540,
  "owner": "elvys",
  "state": "blocked",
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
    "DSA-52"
  ],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-toolbar documentation in Figma was accepted by the design owner, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-55/documentacao-figma-aceita-2026-10-27.md",
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
  "blockers": [
    {
      "id": "B1",
      "what_blocks": "The search in the compacto bar is an nph-input of 28 px. In Figma, nph-input has size compact (2026-10-27), with the tokens input/height-compact and input/clear-padding-end; in the code it has only default and large, and those tokens are not on v/5.0.0.",
      "owner": "claude-figma",
      "what_resolves": "The nph-input documentation with the compact size is accepted in Figma, and its tokens and task are on v/5.0.0.",
      "opened_at": "2026-10-27"
    },
    {
      "id": "B2",
      "what_blocks": "The center follows the bar at 28, 36 and 44 px. In Figma, nph-togglebutton and nph-toggle-group have the tamanho property and the togglebutton/* tokens (checked, checked hover and hover backgrounds) since 2026-10-27; in the code they have one height and the earlier states.",
      "owner": "claude-figma",
      "what_resolves": "The nph-togglebutton and nph-toggle-group documentation with the size and the new states is accepted in Figma, and their tokens and task are on v/5.0.0.",
      "opened_at": "2026-10-27"
    },
    {
      "id": "B3",
      "what_blocks": "The hover of the secondary ghost actions in the bar uses, in Figma, button/secondary-ghost-background-hover and icon-button/secondary-ghost-background-hover, both color/accent, since 2026-10-27; in the code that hover is color/muted, and those tokens are not on v/5.0.0.",
      "owner": "claude-figma",
      "what_resolves": "The nph-button and nph-icon-button hover tokens are on v/5.0.0, with their task.",
      "opened_at": "2026-10-27"
    }
  ],
  "pending_decisions": [
    {
      "id": "D-1",
      "question": "Indiane decided that nph-chip enters the toolbar as an applied filter. The accepted documentation has no place for it yet, and nph-chip is still in Figma. Where in the bar do the applied filters go? Until it is decided, build what the accepted documentation shows.",
      "decider": "indiane",
      "opened_at": "2026-10-27"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-55/documentacao-figma-aceita-2026-10-27.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-27.md, nph-toolbar visual acceptance, Figma UX QA and textual audit approved, documentation accepted; keyboard rule moved from Figma to this task; nph-chip enters the toolbar as an applied filter; approved_order 540"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=2944-6528",
    "date": "2026-10-27",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-toolbar board, with its Documentação frame (2944:6528), was accepted as the API and behavior specification of nph-toolbar. Component set: nph-toolbar (2105:426), tipo × tamanho, 12 variants. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-10-27"
}
```

# DSA-55 — nph-toolbar, bar of actions for an area of the screen

## Goal
The `nph-toolbar` exists in `src/components/nph-toolbar/`, with a spec, tests and stories, in the contract accepted in Figma.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-55/documentacao-figma-aceita-2026-10-27.md`. It carries the Figma documentation converted to text, with the tokens of each part. There is no need to open Figma.

**Keyboard.** By decision of Indiane, the keyboard rule left the Figma accessibility table and comes in this task: follow the W3C ARIA Authoring Practices toolbar pattern (https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/). This is the future toolbar that the D5 of DSA-23 points to.

## Why it is blocked
The 14 `toolbar/*` tokens came with this task and are on `v/5.0.0`. Each one is an alias of a semantic token; no core primitive was added. Three pieces the bar holds changed in Figma on 2026-10-27 and are not in the code yet: nph-input compact (B1), the size and states of nph-togglebutton and nph-toggle-group (B2), and the ghost hover of nph-button and nph-icon-button (B3). DSA-52, the solid icon on hover, is still in review. The task becomes `ready` when the three blockers close and DSA-52 is `done`.

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
It does not create a token or change a token value. It does not change nph-input, nph-togglebutton, nph-toggle-group, nph-button or nph-icon-button. It does not build nph-pagination, which is a sibling piece, nor nph-data-table, which places the bar above the table. It does not add a vertical bar. It does not change Figma.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, page `⏳NPH — Toolbar` (`1626:44`), Documentação frame `2944:6528`
- Component set: nph-toolbar `2105:426`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
- W3C ARIA Authoring Practices, toolbar pattern
