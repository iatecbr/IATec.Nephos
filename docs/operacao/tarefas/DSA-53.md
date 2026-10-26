```json
{
  "id": "DSA-53",
  "goal": "Implement the nph-sidebar-item, nph-sidebar-subitem and nph-sidebar-rail-button to navigate between areas in the lateral menu, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 520,
  "owner": "elvys",
  "state": "ready",
  "piece": "nph-sidebar-item",
  "dependencies": [
    "DSA-03",
    "DSA-13",
    "DSA-43",
    "DSA-47",
    "DSA-48"
  ],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-sidebar-item documentation in Figma was accepted by the design owner, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-53/figma-docs-accepted-2026-10-26.md",
      "result": "passed",
      "verified_at": "2026-10-26",
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
    "docs/operacao/evidencias/DSA-53/figma-docs-accepted-2026-10-26.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-20.md, nph-sidebar-item visual acceptance and 21 sidebar tokens delivered in Figma; focus radius tokens depend on primitives not yet available",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-26.md, textual audit approved after 5 rounds; visual acceptance confirmed; approved_order 520"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1366-2",
    "date": "2026-10-26",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-sidebar-item board, with its Documentação frame (2723:460), was accepted as the API and behavior specification of nph-sidebar-item, nph-sidebar-subitem and nph-sidebar-rail-button. Components: nph-sidebar-item (2251:51271), nph-sidebar-subitem (2251:51312), nph-sidebar-rail-button (2251:51328). The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-10-26"
}
```

# DSA-53 — nph-sidebar-item, item to navigate in the lateral menu

## Goal
The `nph-sidebar-item`, `nph-sidebar-subitem` and `nph-sidebar-rail-button` exist in `src/components/nph-sidebar-item/`, with a spec, tests and stories, in the contract accepted in Figma.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-53/figma-docs-accepted-2026-10-26.md`. It carries the Figma documentation converted to text, with the tokens of each part. There is no need to open Figma.

## Why it is ready
Every piece it composes is done, and every token it uses is on `v/5.0.0`: the `sidebar/*` tokens (30 semantic tokens alias to color, theme or space; see note below) and required dependencies are available. The components depend on nph-icon (DSA-03), nph-button (DSA-13), nph-icon-button (DSA-43), nph-dropdown-menu  (DSA-47) and nph-tooltip (DSA-48), all delivered.

Note: focus/border-radius-sidebar-item, focus/radius-sidebar-item, focus/border-radius-container, focus/radius-container (4 tokens) and sidebar/panel-width, sidebar/logo-max-height, sidebar/logo-mark-size, sidebar/rail-padding (4 tokens) depend on core primitives not yet available in v/5.0.0 and are not included. These tokens will be added in a follow-up task when the primitives are in place.

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
It does not create a token or change a token value (except for the 30 tokens already in place). It does not build dependent components. It does not change Figma.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, page `⏳NPH — Sidebar Item`, Documentação frame `2723:460`
- Components: nph-sidebar-item `2251:51271`, nph-sidebar-subitem `2251:51312`, nph-sidebar-rail-button `2251:51328`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
