```json
{
  "id": "DSA-63",
  "goal": "Implement the nph-notification, the system message shown inline or as a toast, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 620,
  "owner": "elvys",
  "state": "done",
  "piece": "nph-notification",
  "dependencies": [
    "DSA-03",
    "DSA-09",
    "DSA-13",
    "DSA-26",
    "DSA-43"
  ],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-notification documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-63/figma-docs-accepted-2026-11-04.md",
      "result": "passed",
      "verified_at": "2026-11-04",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, CSS, tests, stories and spec pass the proof commands and are merged into v/5.0.0.",
      "command": "git merge-base --is-ancestor 28ffd51fc91a445ffa0532ceda8bd70eefd47b19 origin/v/5.0.0",
      "evidence": "docs/operacao/evidencias/DSA-63/review-and-merge-2026-11-07.md",
      "result": "passed",
      "verified_at": "2026-11-07",
      "verified_by": "claude-code"
    }
  ],
  "blockers": [],
  "pending_decisions": [
    {
      "id": "D-1",
      "question": "The accepted documentation describes a toast region at the bottom-right corner, with up to three toasts, but it is not a component set in Figma and the task builds no new piece. The code leaves the region to the consuming application: the sheet teaches how to build it and the Storybook shows it as a frame. Should the region become a piece of its own? It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-11-06"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-63/figma-docs-accepted-2026-11-04.md",
    "docs/operacao/evidencias/DSA-63/review-and-merge-2026-11-07.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-04.md, nph-notification: visual acceptance, Figma UX QA and textual audit approved, documentation accepted, style proposals 2 and 3 approved and 1 and 4 rejected, the other appendix points answered as recommended"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=3442-10163",
    "date": "2026-11-04",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-notification documentation frame (3442:10163, page 1369:2) was accepted as the API and behavior specification of nph-notification. Component set: nph-notification (3434:9035), 50 variants; the focus of the close button on solid is specified in frame 4207:1146. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": "feat/dsa-63-notification", "commit": "28ffd51", "pr": 150 },
  "context": null,
  "updated_at": "2026-11-07"
}
```

# DSA-63 — nph-notification, system message inline or as a toast

## Goal
The `nph-notification` exists in `src/components/nph-notification/`, with a spec, tests and stories, in the contract accepted in Figma: inline and toast placement, the seven severities, subtle and solid emphasis, stacked and single-line layout, the optional title, actions, close button and time bar, and the toast region.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-63/figma-docs-accepted-2026-11-04.md`. It carries the Figma documentation converted to text, with the tokens of each part and of each state, and the answers to the appendix points. There is no need to open Figma.

## Specification to follow closely
- **Close on solid**: hover with `notification/close-background-hover` at `notification/close-background-hover-opacity` (16%), and focus as a 2 px border in `notification/close-focus-border`, **without the halo** of nph-icon-button. This replaces the default hover and focus of the inner piece only on the solid emphasis. The focus is the specification of frame `4207:1146`; the hover is the appendix decision P-v2-D (no frame), described in the evidence. Neutral solid uses the `neutral-close-*` tokens.
- **Toast**: radius `notification/toast-radius`, width `notification/toast-width` (stacked) or `notification/toast-width-max` (single-line and maximum), and the effect `elevation/modal`, which has no shadow in dark mode.
- **Action and time bar** never together: block it in code.
- **Single-line**: once the text goes beyond one line, reflow to stacked with the actions below.

## Why it is ready
The 59 `notification/*` tokens came with this task and are on `v/5.0.0`, with `color/inverse`, `color/inverse-foreground`, `color/background-subtle` and three core primitives (`core/layout-width/toast`, `core/layout-width/toast-max`, `core/opacity/16`). The pieces inside are done: nph-icon (DSA-03), nph-spinner (DSA-09), nph-button (DSA-13), nph-skeleton (DSA-26) and nph-icon-button (DSA-43).

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
It does not create a token or change a token value. It does not change nph-button, nph-icon-button, nph-spinner, nph-skeleton, nph-icon or any other piece it uses. It does not build nph-alert-dialog, nph-progress or nph-link. It does not change Figma.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, page `NPH — Notification` (`1369:2`), documentation frame `3442:10163`
- Component set: nph-notification `3434:9035`; focus of the close on solid `4207:1146`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
