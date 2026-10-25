```json
{
  "id": "DSA-18",
  "goal": "Implement the nph-radio, the circle the person checks to choose one option in a group, with the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 280,
  "owner": "elvys",
  "state": "done",
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
      "evidence": "docs/operacao/evidencias/DSA-18/review-and-merge-2026-10-24.md",
      "result": "passed",
      "verified_at": "2026-10-24",
      "verified_by": "claude-code"
    }
  ],
  "blockers": [],
  "pending_decisions": [
    {
      "id": "D6",
      "question": "D4 says the circle sits at the top, aligned with the first line of a wrapping text, but not whether the top edges align or the centers do. The code centers the circle on the first line: the 24 x 24 target is 4 px taller than the line of text/label-md, so the text moves down by half of that, computed from tokens. Does Indiane confirm, or want the top edges aligned? It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-22"
    },
    {
      "id": "D7",
      "question": "The evidence says error and disabled do not combine, but not what the piece does when both are set. The code lets disabled win: the error border is suppressed, the piece takes state/disabled-opacity, and it is not a console error. Does Indiane confirm? It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-22"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-18/documentacao-figma-aceita-2026-10-01.md",
    "docs/operacao/evidencias/DSA-18/review-and-merge-2026-10-24.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-19.md, D1 to D3 read from the accepted Figma set; D4 and D5 answered by Indiane"
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
    "branch": "claude/dsa-18-nph-radio-266b51",
    "commit": "8ec3211afff35c94179d7690d067cbdbb7e5cd95",
    "pr": "https://github.com/iatecbr/IATec.Nephos/pull/109"
  },
  "context": null,
  "updated_at": "2026-10-24"
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

## Decisions answered
D1 to D5 are answered; the answers are in the evidence of the
`figma-docs-accepted` gate, section "Decisions answered". D1 to D3 and the
first half of D4 come from the accepted Figma set, read variant by variant;
the second half of D4 and D5 were answered by the design decision of the piece.
The group model (exclusivity, arrow keys, form value, `change` event) is not a
visual decision: it is a technical proposal for the PR, and the evidence says the
group is not a component.

| ID | Answer | What the code does |
|---|---|---|
| D1 | Unchecked: fill `color/background`, border `color/input`. Checked: fill `color/primary`, border `color/input`, dot `color/primary-foreground`. Hover: border `color/input-hover`; checked on hover also takes `state/hover-opacity` on the circle. Error: border `status/error`, checked or not; checked keeps the `color/primary` fill. Disabled: `state/disabled-opacity` on the whole piece, text included. Text `color/foreground` in every state. | Writes the color table per state. |
| D2 | Border plus halo: the circle border turns `focus/border` and a 24 × 24 halo in `focus/halo` covers the touch area, with `radius/full` and `focus/ring-width`. With error and focus, the border stays `status/error` and the halo is `focus/halo-error`. | Picks the focus tokens and radii. |
| D3 | Circle `icon/size-sm` (16), `radius/full`, border `border/width`. The 24 × 24 touch area is the circle plus `space/inline-tight` padding on each side. The dot is 8 × 8: the space left inside the circle after the `space/inline-tight` padding, with no token of its own. | Sets circle, target and dot sizes from tokens. |
| D4 | `space/inline` is measured from the 24 × 24 area. The text wraps to the available width; with two lines, the circle sits at the top, aligned with the first line. | Sets gap, top alignment and wrapping. |
| D5 | The change from unchecked to checked, and back, animates fill and border over `motion/state-duration` with `motion/state-easing`; the dot fades in and out by opacity, on the same pair. Under `prefers-reduced-motion`, it uses `core/duration/100`, and the color still changes. | Adds the transition on `motion/state`, with reduced motion. |

## Pending decisions
The evidence gives the whole contract, so the code can start. Two points remain for Indiane; the code follows the stated default meanwhile, and the answer only adjusts one rule each. The reduced-motion duration is not a new item: it is the open D7 of DSA-22, which this piece follows as `nph-togglebutton` does.

| ID | What the evidence gives | What is missing | What the code does with the answer |
|---|---|---|---|
| D6 | D4: with two lines, the circle sits at the top, aligned with the first line. | Whether the top edges or the centers align. | Centers the circle on the first line. If the answer is the top edges, the text loses its top offset. |
| D7 | Error and disabled do not combine. | What the piece does when both are set. | Disabled wins: no error border, and no console error. If the answer differs, only that CSS rule changes. |

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
