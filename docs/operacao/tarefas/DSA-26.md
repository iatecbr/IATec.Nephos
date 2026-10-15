```json
{
  "id": "DSA-26",
  "goal": "Implement the nph-skeleton, the still shape that holds the place of content while it loads, with the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 240,
  "owner": "elvys",
  "state": "ready",
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
      "question": "Does the skeleton line take only its own skeleton/line-height (16) of height, or the whole line box of the text it replaces (20 for text/body-md), so the swap does not move the layout?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D2",
      "question": "May the use of color/muted, radius/control, radius/inner and avatar/radius-* in design.md be widened to cite nph-skeleton? Today avatar/radius-* says only on nph-avatar.",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-26/documentacao-figma-aceita-2026-10-08.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens"
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
    "branch": null,
    "commit": null,
    "pr": null
  },
  "context": null,
  "updated_at": "2026-10-14"
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
The evidence gives shapes, radii, measures, accessibility and no motion, so the code can start: the task stays `ready`. Two points remain for Indiane; the code follows the literal reading of the evidence meanwhile, and each answer only adjusts a value or a line of `design.md` later.

| ID | What the evidence gives | What is missing | What the code does with the answer |
|---|---|---|---|
| D1 | Line height `skeleton/line-height`; the swap must not move the layout; between shapes, the space is that of the content that will come in. | Whether the line takes only its own height or the line box of the text it replaces, which is taller for `text/body-md`. | Either the consumer gives the space between lines, or the line takes the text's line box. |
| D2 | The shapes use `color/muted`, `radius/control`, `radius/inner` and `avatar/radius-*`. | The `use` of these tokens in `design.md` does not cite `nph-skeleton`, and `avatar/radius-*` says only on `nph-avatar`. | Nothing in the code: it consumes the tokens the evidence names. The answer widens the `use` in `design.md`, through Claude in Figma. |

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
