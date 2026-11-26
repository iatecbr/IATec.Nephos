```json
{
  "id": "DSA-53",
  "goal": "Implement the nph-sidebar-item, nph-sidebar-subitem and nph-sidebar-rail-button to navigate between areas in the lateral menu, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 520,
  "owner": "elvys",
  "state": "done",
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
      "evidence": "docs/operacao/evidencias/DSA-53/review-and-merge-2026-10-26.md",
      "result": "passed",
      "verified_at": "2026-10-26",
      "verified_by": "claude-code"
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "docs/operacao/evidencias/DSA-53/documentacao-figma-aceita-2026-10-26.md",
    "docs/operacao/evidencias/DSA-53/review-and-merge-2026-10-26.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-20.md, nph-sidebar-item visual acceptance and sidebar tokens delivered in Figma",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-26.md, textual audit approved after 5 rounds; visual acceptance confirmed; approved_order 520",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-23.md (15:0x), lot A of the pending decisions of the v1 closing: Indiane answered D-4 in the chat, as recommended, after market research with sources; the code already does it (P116)",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-26.md, approval round 3 of the pending items (2026-11-26 08:18): the design owner accepted the recommended option of D-1 to D-3, after market research with sources"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1366-2",
    "date": "2026-10-26",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-sidebar-item board, with its Documentação frame (2723:460), was accepted as the API and behavior specification of nph-sidebar-item, nph-sidebar-subitem and nph-sidebar-rail-button. Components: nph-sidebar-item (2251:51271), nph-sidebar-subitem (2251:51312), nph-sidebar-rail-button (2251:51328). The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": "claude/dsa-53-nph-sidebar-item", "commit": "41cdc12ab8e877352cd08d96dab47b08058a59a2", "pr": "128" },
  "context": null,
  "updated_at": "2026-11-26"
}
```

# DSA-53 — nph-sidebar-item, item to navigate in the lateral menu

## Goal
The `nph-sidebar-item`, `nph-sidebar-subitem` and `nph-sidebar-rail-button` exist in `src/components/nph-sidebar-item/`, with a spec, tests and stories, in the contract accepted in Figma.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-53/documentacao-figma-aceita-2026-10-26.md`. It carries the Figma documentation converted to text, with the tokens of each part. There is no need to open Figma.

## Why it is ready
Every piece it composes is done, and every token it uses is on `v/5.0.0`: the `sidebar/*` tokens of the pieces and the focus radii `focus/border-radius-sidebar-item`, `focus/radius-sidebar-item`, `focus/border-radius-container` and `focus/radius-container` came with this task, each one an alias of a semantic token or, where there is none with the same function, of a core primitive. The components depend on nph-icon (DSA-03), nph-button (DSA-13), nph-icon-button (DSA-43), nph-dropdown-menu (DSA-47) and nph-tooltip (DSA-48), all delivered.

## Decision answered on 2026-11-23
Indiane answered D-4 in the chat on 2026-11-23, in lot A of the pending decisions of the v1 closing, as recommended, after market research with sources.

| ID | Answer | What the code does |
|---|---|---|
| D-4 | Confirmed: a subitem with options is a button that opens and closes its list, with `aria-expanded`, as the disclosure navigation pattern of the APG (https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/ ). The code already does it since P116: the `nph-sidebar-subitem` with `options` is a native button with `aria-expanded`, `expanded` and `nph-toggle`, with no `href` (`fichas/nph-sidebar-subitem.md`). | Nothing changes. |

## Decision answered on 2026-11-26
Indiane answered D-1 to D-3 on 2026-11-26, in the approval round of the pending items, as recommended, after market research with sources.

| ID | Answer | What the code does |
|---|---|---|
| D-1 | Option 1: the counter sits on the top end corner of the collapsed button, over it. Material puts the badge on the top right corner of the icon (https://developer.android.com/develop/ui/compose/components/badges ). | Nothing changes. Figma already draws it (node 2251:51328). |
| D-2 | Option 1: the outline of the active counter is 4 px (`space/inline-tight`). No market source; the basis is P116 item 7 and the accepted Figma. | Nothing changes. Figma already draws it (node 2278:54770). The older text of the task, `border/width`, is superseded. |
| D-3 | Option 1: the More action is a secondary ghost compact `nph-button`. Carbon shows the row action as a discreet button (https://carbondesignsystem.com/components/data-table/usage/ ). | Nothing changes. Figma already draws it (node 2251:51271). The older text of the task, primary, is superseded. |

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
It does not create a token or change a token value. It does not build dependent components. It does not change Figma.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, page `⏳NPH — Sidebar Item`, Documentação frame `2723:460`
- Components: nph-sidebar-item `2251:51271`, nph-sidebar-subitem `2251:51312`, nph-sidebar-rail-button `2251:51328`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
