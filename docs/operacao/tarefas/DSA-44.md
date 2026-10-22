```json
{
  "id": "DSA-44",
  "goal": "Implement the nph-dialog, the modal window that blocks the page for a short task, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 450,
  "owner": "elvys",
  "state": "in-progress",
  "piece": "nph-dialog",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-dialog documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-44/documentacao-figma-aceita-2026-10-21.md",
      "result": "passed",
      "verified_at": "2026-10-21",
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
      "id": "D1",
      "question": "The evidence says the stacked value of the actions property puts the buttons at full width, the primary on top, below core/breakpoint/md, and to use stacked actions on a narrow screen. Is stacked a choice of the consumer that applies only below md, or does every dialog stack by itself below md? The code reads it as the consumer's choice: actions=stacked stacks only below md, and actions=inline never stacks. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-22"
    },
    {
      "id": "D2",
      "question": "The evidence gives the minimum width and the width ceilings, but not the space between the dialog and the edge of a small window. The code keeps layout/margin-compact (16) on each side, a token whose documented use is the page margin. Does Indiane confirm, or name the token? It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-22"
    },
    {
      "id": "D3",
      "question": "The highlight icon (.nph-dialog/destaque) is a solid icon in the status color over the status background, for warning, info, success and error. The evidence does not give which icon each status uses, the icon size, the size, shape and radius of its box, or its place (before the title on the same line, or above it). The code does not draw the highlight icon until the answer: the status property stays out of the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-22"
    },
    {
      "id": "D4",
      "question": "The evidence puts the line at space/stack from the content and the actions at space/stack plus space/stack-snug from what comes before. It does not say whether the line runs edge to edge or inside the padding, the space between the header and its line, or the space between the title and the close button. The code keeps the line inside the padding, space/stack between the header and its line, and space/inline between the title and the close button. Does Indiane confirm? It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-22"
    },
    {
      "id": "D5",
      "question": "The evidence does not say whether a click on the overlay/scrim veil closes the dialog. The code does not close it, so a half-filled form is not lost; Esc and the close button close it. Does Indiane confirm? It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-22"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-44/documentacao-figma-aceita-2026-10-21.md"
  ],
  "decision_refs": [
    "docs/decisoes-tecnicas.md#p87",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-21.md, nph-dialog visual acceptance, width that hugs the content, Figma UX QA approved, documentation accepted, textual audit approved and the 20 tokens; the hover token color/secondary-on-dialog-hover was added afterwards"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1368-27",
    "date": "2026-10-21",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-dialog board (1368:27), with its `Documentação` frame (2277:2), was accepted as the API and behavior specification of the nph-dialog. COMPONENT_SET 2268:52262; parts .nph-dialog/destaque 2268:52091 and .nph-dialog/conteúdo 2311:5339. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": "docs/operacao/contextos/DSA-44.md",
  "updated_at": "2026-10-22"
}
```

# DSA-44 — nph-dialog, the modal window for a short task

## Goal
The `nph-dialog` exists in `src/components/nph-dialog/`, with a spec, tests and
stories, in the contract accepted in Figma.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate:
`docs/operacao/evidencias/DSA-44/documentacao-figma-aceita-2026-10-21.md`. It
carries the Figma documentation converted to text, with the tokens of each part.
There is no need to open Figma.

## Why it is ready
It depends on no other task to be built. Every token it uses is on `v/5.0.0`:
the 21 new tokens (14 semantic and 7 primitives) were taken to the token sources,
to `tokens.css` and to `design.md` together with this task. The footer uses the
`nph-button` (DSA-13, done) and the lines use the `nph-separator` (DSA-10, done).

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS,
tests, stories and spec pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## Relations with other tasks
- The close button is the icon-only `nph-button` in the `nph-icon-button`
  contract (DSA-43, ready). The dialog uses the icon-only button as it is on
  `v/5.0.0`; the circular shape and the tooltip of DSA-43 do not block it.
- The `nph-alert-dialog` builds on the `nph-dialog` without the close button.
  It has no task yet: its Figma acceptance is still open.

## What this task does not do
It does not create a token or change a token value. It does not build the
`nph-alert-dialog`. It does not change Figma.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, board `1368:27`, set `2268:52262` and parts
  `2268:52091` and `2311:5339`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
