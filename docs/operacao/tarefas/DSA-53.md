```json
{
  "id": "DSA-53",
  "goal": "Implement the nph-sidebar-item, nph-sidebar-subitem and nph-sidebar-rail-button to navigate between areas in the lateral menu, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 520,
  "owner": "elvys",
  "state": "in-review",
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
      "evidence": "docs/operacao/evidencias/DSA-53/documentacao-figma-aceita-2026-10-26.md",
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
  "pending_decisions": [
    {
      "id": "D-1",
      "question": "The evidence gives the rail button a counter, but not where it sits on the button. The code puts it on the top end corner, over the button. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-26"
    },
    {
      "id": "D-2",
      "question": "The evidence says the counter of the active rail button gains an outline in sidebar/panel-background, but not its width. The code uses border/width. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-26"
    },
    {
      "id": "D-3",
      "question": "The evidence makes more actions an nph-icon-button ghost and compact, but does not name its severity. The code keeps the default of nph-button, primary. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-26"
    },
    {
      "id": "D-4",
      "question": "The evidence says a subitem with options=yes shows the arrow to the right and leads to a list of options, but not what opens that list. The code keeps it a link, like the subitem without options, and the arrow is visual only. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-26"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-53/documentacao-figma-aceita-2026-10-26.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-20.md, nph-sidebar-item visual acceptance and sidebar tokens delivered in Figma",
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
  "git_review": {
    "branch": "claude/dsa-53-nph-sidebar-item",
    "commit": "61e36ecdc30d74a83d854a48f456a85c4f180bea",
    "pr": "https://github.com/iatecbr/IATec.Nephos/pull/128"
  },
  "context": "docs/operacao/contextos/DSA-53.md",
  "updated_at": "2026-10-26"
}
```

# DSA-53 — nph-sidebar-item, item to navigate in the lateral menu

## Goal
The `nph-sidebar-item`, `nph-sidebar-subitem` and `nph-sidebar-rail-button` exist in `src/components/nph-sidebar-item/`, with a spec, tests and stories, in the contract accepted in Figma.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-53/documentacao-figma-aceita-2026-10-26.md`. It carries the Figma documentation converted to text, with the tokens of each part. There is no need to open Figma.

## Why it is ready
Every piece it composes is done, and every token it uses is on `v/5.0.0`: the `sidebar/*` tokens of the pieces and the focus radii `focus/border-radius-sidebar-item`, `focus/radius-sidebar-item`, `focus/border-radius-container` and `focus/radius-container` came with this task, each one an alias of a semantic token or, where there is none with the same function, of a core primitive. The components depend on nph-icon (DSA-03), nph-button (DSA-13), nph-icon-button (DSA-43), nph-dropdown-menu (DSA-47) and nph-tooltip (DSA-48), all delivered.

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
It does not create a token or change a token value. It does not build dependent components. It does not change Figma.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, page `⏳NPH — Sidebar Item`, Documentação frame `2723:460`
- Components: nph-sidebar-item `2251:51271`, nph-sidebar-subitem `2251:51312`, nph-sidebar-rail-button `2251:51328`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
