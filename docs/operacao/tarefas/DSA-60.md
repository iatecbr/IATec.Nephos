```json
{
  "id": "DSA-60",
  "goal": "Make the hover of the secondary ghost nph-button, with text and icon-only (the nph-icon-button of Figma), use the new component tokens, color/accent instead of color/muted, as decided in Figma, and update the spec.",
  "phase": "F4",
  "approved_order": 590,
  "owner": "elvys",
  "state": "ready",
  "piece": "nph-button",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "Indiane decided the secondary ghost hover of nph-button and nph-icon-button in Figma, and its two tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-60/figma-docs-accepted-2026-10-29.md",
      "result": "passed",
      "verified_at": "2026-10-29",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "CSS, tests, stories and spec of nph-button pass the proof commands and are merged into v/5.0.0.",
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
    "docs/operacao/evidencias/DSA-60/figma-docs-accepted-2026-10-29.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-27.md, take the states of the nph-toolbar preview to the masters of nph-button, nph-icon-button and nph-togglebutton; component tokens by T9"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=461-13009",
    "date": "2026-10-27",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-button board (1197:5449) and the nph-icon-button board (2122:1591) keep their text; the secondary ghost hover of nph-button (461:13009) and nph-icon-button (498:15671) moves from color/muted to color/accent, through button/secondary-ghost-background-hover and icon-button/secondary-ghost-background-hover. Converted to text in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-10-29"
}
```

# DSA-60 — nph-button and nph-icon-button, secondary ghost hover

## Goal
In `src/components/nph-button/`, the secondary ghost hover reads `--nph-button-secondary-ghost-background-hover` for the button with text and `--nph-icon-button-secondary-ghost-background-hover` for the icon-only button, which is the nph-icon-button of Figma (DSA-43). Tests, stories and the spec are updated.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-60/figma-docs-accepted-2026-10-29.md`. There is no need to open Figma.

## Why it is ready
The 2 tokens came with this task and are on `v/5.0.0`. Both are aliases of `color/accent`; no core primitive was added. Today the CSS of the secondary ghost hover reads `--nph-color-muted`, and the test of nph-button expects it.

With this task on `v/5.0.0`, B3 of DSA-55 is closed, and DSA-55 depends on this task.

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
It does not create a token or change a token value. It does not change the primary or danger ghost hover, the rest state, the text and icon colors, the focus ring or the solid icon on hover (DSA-52). It does not change nph-togglebutton, nph-toggle-group or nph-toolbar. It does not change Figma.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, page `🟢NPH — Button` (`312:98`), component set nph-button `461:13009`
- Page `🎨NPH — Icon Button` (`2109:51809`), component set nph-icon-button `498:15671`
- `fichas/nph-button.md`
