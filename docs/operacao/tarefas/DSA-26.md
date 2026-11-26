```json
{
  "id": "DSA-26",
  "goal": "Implement the nph-skeleton, the still shape that holds the place of content while it loads, with the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 240,
  "owner": "elvys",
  "state": "done",
  "piece": "nph-skeleton",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-skeleton documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-26/documentacao-figma-aceita-2026-10-08.md",
      "result": "passed",
      "verified_at": "2026-10-08",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, CSS, tests, stories and spec pass the proof commands and are merged into v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-26/review-and-merge-2026-10-15.md",
      "result": "passed",
      "verified_at": "2026-10-15",
      "verified_by": "claude-code"
    }
  ],
  "blockers": [],
  "pending_decisions": [
    {
      "id": "D2",
      "question": "May the use of color/muted, radius/control, radius/inner and avatar/radius-* in design.md be widened to cite nph-skeleton? Today avatar/radius-* says only on nph-avatar.",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-26/documentacao-figma-aceita-2026-10-08.md",
    "docs/operacao/evidencias/DSA-26/review-and-merge-2026-10-15.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-26.md, approval round 3 of the pending items (2026-11-26 08:18): the design owner accepted the recommended option of D1, after market research with sources"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1578-38",
    "date": "2026-10-08",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-skeleton frame (1578:38) was accepted as the API and behavior specification of the nph-skeleton. COMPONENT_SET 1578:37. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": {
    "branch": "claude/dsa-26-nph-skeleton-e574d7",
    "commit": "c4e7ff0d8bfd02208d624a5f3d649f3872642bf3",
    "pr": "85"
  },
  "context": null,
  "updated_at": "2026-11-26"
}
```

# DSA-26 — nph-skeleton, the loading placeholder

## Goal
The `nph-skeleton` exists in `src/components/nph-skeleton/`, with a spec,
tests and stories, in the contract accepted in Figma.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate:
`docs/operacao/evidencias/DSA-26/documentacao-figma-aceita-2026-10-08.md`. It
carries the Figma documentation converted to text. There is no need to open Figma.

## Pending decisions
The evidence gives shapes, radii, measures, accessibility and no motion, so the code can start: the task stays `ready`. One point remains for Indiane (D1: answered on 2026-11-26: see the section below); the code follows the literal reading of the evidence meanwhile, and each answer only adjusts a value or a line of `design.md` later.

| ID | What the evidence gives | What is missing | What the code does with the answer |
|---|---|---|---|
| D2 | The shapes use `color/muted`, `radius/control`, `radius/inner` and `avatar/radius-*`. | The `use` of these tokens in `design.md` does not cite `nph-skeleton`, and `avatar/radius-*` says only on `nph-avatar`. | Nothing in the code: it consumes the tokens the evidence names. The answer widens the `use` in `design.md`, through Claude in Figma. |

## Decision answered on 2026-11-26
Indiane answered D1 on 2026-11-26, in the approval round of the pending items, as recommended, after market research with sources.

| ID | Answer | What the code does |
|---|---|---|
| D1 | Option 2: the 16 px bar is centered in a box as tall as the line of the text (20 for `text/body-md`, 16 for `text/body-sm`), with no new token. MUI ties the text skeleton height to the typography (https://mui.com/material-ui/react-skeleton/ ). | The line skeleton gets a box with the line height of the text, with the bar centered. Figma follows in a later change (node 1578:31). |

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS,
tests, stories and spec pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
It does not create a token or change a token value.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, frame `1578:38` and set `1578:37`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
