```json
{
  "id": "DSA-22",
  "goal": "Implement the nph-togglebutton, the button that holds a boolean value, with the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 200,
  "owner": "elvys",
  "state": "awaiting-decision",
  "piece": "nph-togglebutton",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-togglebutton documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-22/documentacao-figma-aceita-2026-10-07.md",
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
      "question": "Which radius tokens do the track and the inner area use? (radius/control, radius/control-inner or another)",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D2",
      "question": "Which space/* tokens set the gap between track and inner area, the inner area's side padding and the icon-to-label gap?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D3",
      "question": "Is the icon-only piece square, at control/height-default wide?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D4",
      "question": "Which radii do the focus border and the focus halo use? (as in nph-button: focus/border-radius-control and focus/radius-control-with-border?)",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D5",
      "question": "Are xmark (off) and check (on) fixed icons, or does the consumer choose the icon? In the icon-only piece, which icon is shown?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D6",
      "question": "Does the change between off and on animate? If it does, with motion/state, which design.md cites for toggle?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-22/documentacao-figma-aceita-2026-10-07.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1512-27498",
    "date": "2026-10-07",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-togglebutton board (1512:27498) was accepted as the API and behavior specification of the nph-togglebutton. COMPONENT_SET 1512:719. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-10-14"
}
```

# DSA-22 — nph-togglebutton, the button that holds a boolean value

## Goal
The `nph-togglebutton` exists in `src/components/nph-togglebutton/`, with a spec,
tests and stories, in the contract accepted in Figma.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate:
`docs/operacao/evidencias/DSA-22/documentacao-figma-aceita-2026-10-07.md`. It
carries the Figma documentation converted to text. There is no need to open Figma.

## Pending decisions
The evidence gives colors, states, focus colors and height, but not the
measures and icon rules the CSS needs. Code does not fill these gaps; each
answer goes into the evidence of the `figma-docs-accepted` gate, and the task
goes back to `ready` when all six are answered.

| ID | What the evidence gives | What is missing | What the code does with the answer |
|---|---|---|---|
| D1 | Track: background and border. Inner area: background, shadow and outline. | The radius of the track and of the inner area. | Sets `border-radius` of each box. |
| D2 | Height `control/height-default`; `space/inline` only between neighboring pieces. | The gap between track and inner area, the inner area's side padding and the icon-to-label gap. | Sets the inset of the inner area, its padding and the gap of the content. |
| D3 | Icon only, the piece is 36 px high and takes `aria-label`. | The width of the icon-only piece. | Sets the inline size of the icon-only piece. |
| D4 | Focus border `color/primary` and halo `focus/halo` outside the piece; invalid, `status/error` and `focus/halo-error`. | The radius of the focus border and of the halo. | Sets the radius of the focus border and halo, as in `nph-button`. |
| D5 | Start and end icons: off shows `xmark`, on shows `check`; the icon changes in the instance. | Whether the swap is fixed or the consumer gives the icon, and which icon the icon-only piece shows. | Decides whether the API takes icon names or only turns the icons on and off. |
| D6 | No mention of motion. `design.md` cites `motion/state` for a toggle. | Whether the off-to-on change animates. | Adds a transition on `motion/state`, with reduced motion, or none. |

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS,
tests, stories and spec pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
It does not create a token or change a token value. It does not create a size
property.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, board `1512:27498` and set `1512:719`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
