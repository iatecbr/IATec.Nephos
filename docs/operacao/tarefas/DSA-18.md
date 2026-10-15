```json
{
  "id": "DSA-18",
  "goal": "Implement the nph-radio, the circle the person checks to choose one option in a group, with the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 280,
  "owner": "elvys",
  "state": "awaiting-decision",
  "piece": "nph-radio",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-radio documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-18/documentacao-figma-aceita-2026-10-01.md",
      "result": "passed",
      "verified_at": "2026-10-02",
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
      "question": "Which background and border does the circle take in each state: unchecked, checked (color/primary? border color/input, color/primary or color/primary-border?), hover (color/input-hover?) and checked with an error?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D2",
      "question": "Is the focus a ring (focus/ring-default) or border plus halo, as in nph-button? If border plus halo, which radii around a circle (radius/full for both?), and is the error halo focus/halo-error?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D3",
      "question": "Which tokens give the 16 x 16 circle and the 24 x 24 touch area (icon/size-sm and icon/size-lg, or new tokens)? Is the dot 6 or 8 px?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D4",
      "question": "Is the space/inline gap to the text measured from the circle or from the 24 x 24 area? With text on two lines, is the circle on the first line or centered? May the text wrap?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D5",
      "question": "Does the change from unchecked to checked animate with motion/state, or is it instant?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-18/documentacao-figma-aceita-2026-10-01.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1196-311",
    "date": "2026-10-01",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-radio frame (1196:311) was accepted as the API and behavior specification of the nph-radio. COMPONENT_SET 848:66. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
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

# DSA-18 — nph-radio, the radio button

## Goal
The `nph-radio` exists in `src/components/nph-radio/`, with a spec,
tests and stories, in the contract accepted in Figma.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate:
`docs/operacao/evidencias/DSA-18/documentacao-figma-aceita-2026-10-01.md`. It
carries the Figma documentation converted to text. There is no need to open Figma.

## Pending decisions
The evidence gives the anatomy and the token names, but not how the circle is painted in each state, the dot size, the focus shape around a circle, the source of the measures or the motion. Code does not fill these gaps; each answer goes into the evidence of the `figma-docs-accepted` gate, and the task goes back to `ready` when all five are answered. The group model (exclusivity, arrow keys, form value, `change` event) is not a visual decision: it is a technical proposal for the PR, and the evidence says the group is not a component.

| ID | What the evidence gives | What is missing | What the code does with the answer |
|---|---|---|---|
| D1 | Border `color/input`; dot `color/primary-foreground`; the border tells the state and the fill tells the choice. | Background and border unchecked, checked, on hover and checked with an error. | Writes the color table per state. |
| D2 | The focus ring shows around the circle; in `erro-foco`, the error ring goes outside. | Ring or border plus halo, the radii around a circle and the error halo. | Picks the focus tokens and radii. |
| D3 | Circle 16 × 16; touch area 24 × 24; dot inside the circle. | Tokens for the measures and the dot diameter. | Sets circle, target and dot sizes. |
| D4 | `space/inline` to the text; the text also selects the option. | Where the gap is measured from, the alignment with two-line text, and wrapping. | Sets gap, vertical alignment and wrapping. |
| D5 | Nothing about motion. `design.md` cites `motion/state` for selection. | Whether the change animates. | Adds a transition on `motion/state` with reduced motion, or none. |

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS,
tests, stories and spec pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
It does not create a token or change a token value.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, frame `1196:311` and set `848:66`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
