```json
{
  "id": "DSA-27",
  "goal": "Implement the nph-switch, the switch that turns a setting on or off with an immediate effect, with the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 250,
  "owner": "elvys",
  "state": "awaiting-decision",
  "piece": "nph-switch",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-switch documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-27/documentacao-figma-aceita-2026-10-08.md",
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
      "question": "On which side of the track does the label sit, after or before it? When the label wraps to more than one line, is the track centered or aligned to the first line?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D2",
      "question": "Which radii do the focus border and the focus halo use around the radius/full track? (proposal: radius/full for both)",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D3",
      "question": "Does the knob slide and the track color change with motion/state, or does the state switch at once? Does it stop under prefers-reduced-motion?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D4",
      "question": "Is the track outline (color/primary-border on, status/error with an error) border/width thick and drawn inside the track box? Does it exist on the off track too, and does it change on hover?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-27/documentacao-figma-aceita-2026-10-08.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1549-2",
    "date": "2026-10-08",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-switch frame (1549:2) was accepted as the API and behavior specification of the nph-switch. COMPONENT_SET 1548:56. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
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

# DSA-27 — nph-switch, the on/off switch

## Goal
The `nph-switch` exists in `src/components/nph-switch/`, with a spec,
tests and stories, in the contract accepted in Figma.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate:
`docs/operacao/evidencias/DSA-27/documentacao-figma-aceita-2026-10-08.md`. It
carries the Figma documentation converted to text. There is no need to open Figma.

## Pending decisions
The evidence gives the track, knob, label, colors, sizes and focus colors, but not the label side, the focus radii around a round track, the motion and the outline width. Code does not fill these gaps; each answer goes into the evidence of the `figma-docs-accepted` gate, and the task goes back to `ready` when all four are answered.

| ID | What the evidence gives | What is missing | What the code does with the answer |
|---|---|---|---|
| D1 | The label sits next to the track, `space/inline` from it. | The side of the label and the track alignment when the label wraps. | Sets the order and the vertical alignment of track and label. |
| D2 | Focus border `focus/border` on the track and halo `focus/halo` outside; the track is `radius/full`. | The radius of the focus border and halo. The focus radius tokens in use fit `radius/control`, not a round track. | Sets the radius of the focus border and halo. |
| D3 | The knob position shows the state. | Whether the knob slides and the track color changes over time, and the reduced-motion rule. | Adds a transition on `motion/state` with reduced motion, or none. |
| D4 | Outline `color/primary-border` on the on track and `status/error` with an error. | The outline width, whether it is drawn inside the track box, whether the off track has one, and its hover color. | Sets the outline of the track in each state. |

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS,
tests, stories and spec pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
It does not create a token or change a token value.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, frame `1549:2` and set `1548:56`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
