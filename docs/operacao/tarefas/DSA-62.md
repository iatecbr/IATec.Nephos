```json
{
  "id": "DSA-62",
  "goal": "Implement the nph-navigation-menu, the main navigation bar with triggers that open grouped links, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 610,
  "owner": "elvys",
  "state": "in-progress",
  "piece": "nph-navigation-menu",
  "dependencies": [
    "DSA-03",
    "DSA-10",
    "DSA-43",
    "DSA-45"
  ],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-navigation-menu documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-62/figma-docs-accepted-2026-11-03.md",
      "result": "passed",
      "verified_at": "2026-11-03",
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
    "docs/operacao/evidencias/DSA-62/figma-docs-accepted-2026-11-03.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-03.md, nph-navigation-menu: visual acceptance, Figma UX QA and textual audit approved, documentation accepted, the twelve appendix points answered as recommended, atual-foco state created before the tokens"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=3977-7913",
    "date": "2026-11-03",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-navigation-menu documentation frame (3977:7913, page 1626:16) was accepted as the API and behavior specification of nph-navigation-menu. Component sets: nph-navigation-menu (3969:7897), with the inner pieces top item (3957:6662) and panel link (3957:6722). The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": "docs/operacao/contextos/DSA-62.md",
  "updated_at": "2026-11-03"
}
```

# DSA-62 — nph-navigation-menu, main navigation bar with grouped links

## Goal
The `nph-navigation-menu` exists in `src/components/nph-navigation-menu/`, with a spec, tests and stories, in the contract accepted in Figma: the bar, the top item (trigger or link), the panel with grouped links, the narrow width with the Menu button, and the current state marked by more than color.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-62/figma-docs-accepted-2026-11-03.md`. It carries the Figma documentation converted to text, with the tokens of each part and of each state, and the answers to the appendix points. There is no need to open Figma.

## Why it is ready
The 31 `navigation-menu/*` tokens came with this task and are on `v/5.0.0`; no core primitive was needed. The pieces inside are done: nph-icon (DSA-03), nph-separator (DSA-10), nph-icon-button (DSA-43) and the group label of nph-dropdown-menu (DSA-45).

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
It does not create a token or change a token value. It does not change nph-dropdown-menu, nph-icon-button, nph-separator, nph-icon or any other piece it uses. It does not add a featured card inside the panel, a menubar pattern or more than one level of panels. It does not change Figma.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, page `NPH — Navigation Menu` (`1626:16`), documentation frame `3977:7913`
- Component sets: nph-navigation-menu `3969:7897`; pieces `3957:6662` and `3957:6722`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
