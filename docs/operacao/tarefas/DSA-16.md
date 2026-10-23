```json
{
  "id": "DSA-16",
  "goal": "Implement the nph-input, the one-line field to type or edit a value, with the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 260,
  "owner": "elvys",
  "state": "done",
  "piece": "nph-input",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-input documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-16/documentacao-figma-aceita-2026-10-01.md",
      "result": "passed",
      "verified_at": "2026-10-02",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, CSS, tests, stories and spec pass the proof commands and are merged into v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-16/review-and-merge-2026-10-23.md",
      "result": "passed",
      "verified_at": "2026-10-23",
      "verified_by": "claude-code"
    }
  ],
  "blockers": [],
  "pending_decisions": [
    {
      "id": "D1",
      "question": "The required Search example has no visible label. Is `label`, an accessible name in text that becomes the `aria-label` of the inner field, acceptable as the name of an nph-input outside nph-field? The code takes it and warns in development when the field has no name at all. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-22"
    },
    {
      "id": "D2",
      "question": "The evidence draws the `foco-limpar` state, so the clear button takes focus: one more Tab stop in a field with a value. Does Indiane confirm? The code keeps the clear button in the Tab order. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-22"
    },
    {
      "id": "D3",
      "question": "In `large` (44 px), does the clear target stay 24 by 24? The evidence says the measures are the same in both sizes except the height, and the code keeps 24 by 24. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-22"
    },
    {
      "id": "D4",
      "question": "The evidence says nothing about motion. Does the color change of the border on hover and on focus use the pair `motion/hover-duration` and `motion/hover-easing`, like the other form controls? The code has no transition. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-22"
    },
    {
      "id": "D5",
      "question": "Is `readonly` out of v1, or does it get a drawing of its own? The code leaves it out. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-22"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-16/documentacao-figma-aceita-2026-10-01.md",
    "docs/operacao/evidencias/DSA-16/review-and-merge-2026-10-23.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-16.md, Indiane answered D1 to D7 of the nph-input",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-16.md, DSA-33 D2: the nph-icon example inside nph-input comes with this task"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1195-532",
    "date": "2026-10-01",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-input frame (1195:532) was accepted as the API and behavior specification of the nph-input. COMPONENT_SET 622:18359. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": {
    "branch": "claude/dsa-16-nph-input-20ff0b",
    "commit": "29ff54f4439e945fd5668e0ed2d6f05d1c72a043",
    "pr": "99"
  },
  "context": null,
  "updated_at": "2026-10-23"
}
```

# DSA-16 — nph-input, the one-line text field

## Goal
The `nph-input` exists in `src/components/nph-input/`, with a spec,
tests and stories, in the contract accepted in Figma.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate:
`docs/operacao/evidencias/DSA-16/documentacao-figma-aceita-2026-10-01.md`. It
carries the Figma documentation converted to text. There is no need to open Figma.

## Decisions answered
D1 to D7 are answered; the answers and the measures read from Figma are in the
evidence of the `figma-docs-accepted` gate, sections "Measures and tokens" and
"Decisions answered".

| ID | Answer | What the code does |
|---|---|---|
| D1 | v1 accepts `text`, `email`, `tel`, `url` and `search`. Password, number and mask are out of v1. | Accepts only these five types, with no extra parts. |
| D2 | The end icon always clears the value; swapping changes only the art. It shows only with a value. | Renders the end icon as a clear button, hidden when the value is empty. |
| D3 | `icon/size-sm`, `space/inline`, `space/control-padding`, `text/body-md` in both sizes, icons in `color/muted-foreground`. | Sets padding, gap, typography and icon size and color. |
| D4 | `focus/border` + `focus/halo`; in `foco-limpar`, `focus/border-radius-control` and `focus/radius-control-with-border` around the end target; the container keeps `color/input`. | Sets the focus border, halo and radii of the container and of the end target. |
| D5 | Error border `status/error`. `erro` + `hover` keeps `status/error`. `erro` + `foco-limpar`: container `status/error`, end target with the usual focus. `disabled` + `erro`: disabled wins. | Sets the precedence of the states in the CSS. |
| D6 | Default `layout/input-width`; it may stretch to its container; no minimum. | Sets the inline size of the host. |
| D7 | Icons in style `light`. | Uses the `light` variant of the inner icons. |

## The nph-icon example that waits for this task
DSA-33, D2 (Indiane, 2026-10-16): the `nph-icon` Docs page goes out without its
first example, because it needs `nph-input`. This task adds it to the Examples
section of `nph-icon.docs.stories.ts`, from the frame `1130:956`: an `nph-input`
(`size=default`) with the start icon `magnifying-glass` and the placeholder
"Search". Caption: "magnifying-glass in a search field, inside the control, at
`icon/size-sm`." The text goes into the three dictionaries.

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS,
tests, stories and spec pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## Pending decisions
The evidence gives the whole contract, so the code can start. Five points remain for Indiane; the code follows the stated default meanwhile, and none blocks the pull request.

| ID | What the evidence gives | What is missing | What the code does meanwhile |
|---|---|---|---|
| D1 | The name comes from the `nph-field` label; the placeholder is not a label. | The name of the Search example, which has no visible label. | `label` becomes the `aria-label` of the inner field; with no name at all, a warning in development. |
| D2 | The `foco-limpar` state: the clear button takes focus. | Whether one more Tab stop per field with a value is wanted. | The clear button stays in the Tab order. |
| D3 | The measures are the same in both sizes, except the height. | Whether the clear target grows in `large`. | 24 by 24 in both sizes. |
| D4 | Nothing about motion. | Whether hover and focus animate the border color. | No transition. |
| D5 | Seven states, none read-only. | Whether `readonly` enters v1. | Out of v1. |

## What this task does not do
It does not create a token or change a token value.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, frame `1195:532` and set `622:18359`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
