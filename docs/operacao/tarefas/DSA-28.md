```json
{
  "id": "DSA-28",
  "goal": "Implement the nph-field, which composes label, control, help text and error message of a form field, with the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 290,
  "owner": "elvys",
  "state": "in-review",
  "piece": "nph-field",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-field documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-28/documentacao-figma-aceita-2026-10-01.md",
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
      "id": "D-1",
      "question": "In the `erro` state, the counter sits 'on a line below the message', but the evidence does not say how that line aligns or the vertical space between the message and the counter. The code puts the counter at the end of its own line, `space/stack-tight` below the message. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-22"
    },
    {
      "id": "D-2",
      "question": "With help text and counter on the same line, the evidence does not give the minimum space between them or what happens when the help text does not fit. The code keeps `space/inline` between them, wraps the help text to more lines and keeps the counter at the top of the end side. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-22"
    },
    {
      "id": "D-3",
      "question": "D8 says `disabled` hides the error. It does not say whether the help text comes back to the message line then. The code shows the help text again, as in the default state. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-22"
    },
    {
      "id": "D-4",
      "question": "The evidence calls the help text 'one line of explanation'. It does not say what the field does with a help text or an error longer than the field width. The code wraps both to more lines, with no ellipsis. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-22"
    },
    {
      "id": "D-5",
      "question": "`layout/field-width` and `layout/input-width` have no `use:` line in `design.md`, unlike their neighbors. The code consumes `layout/field-width` as D6 says and does not change `design.md`. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-22"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-28/documentacao-figma-aceita-2026-10-01.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-16.md, Indiane answered D1 to D8 of the nph-field"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1194-21863",
    "date": "2026-10-01",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-field frame (1194:21863) was accepted as the API and behavior specification of the nph-field. COMPONENT_SET 657:50. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": {
    "branch": "claude/dsa-28-nph-field-66625a",
    "commit": "cc0a73102fe4c7e6c03098d491e88ea49fc7473a",
    "pr": "https://github.com/iatecbr/IATec.Nephos/pull/105"
  },
  "context": "docs/operacao/contextos/DSA-28.md",
  "updated_at": "2026-10-23"
}
```

# DSA-28 — nph-field, the form field

## Goal
The `nph-field` exists in `src/components/nph-field/`, with a spec,
tests and stories, in the contract accepted in Figma.

Its default control is `nph-input` (DSA-16).

## Where the contract is
In the evidence of the `figma-docs-accepted` gate:
`docs/operacao/evidencias/DSA-28/documentacao-figma-aceita-2026-10-01.md`. It
carries the Figma documentation converted to text. There is no need to open Figma.

## Decisions answered
D1 to D8 are answered; the answers and the measures read from Figma are in the
evidence of the `figma-docs-accepted` gate, sections "Measures and tokens" and
"Decisions answered". How the field names and describes a control inside another
shadow root is not a visual decision: it is a technical proposal for the PR, and it
sets a contract for the controls of DSA-16, DSA-17, DSA-18 and DSA-29.

| ID | Answer | What the code does |
|---|---|---|
| D1 | Own text `info`, opened in `nph-tooltip`; accessible name `infoLabel`. | Passes `info` and `infoLabel` to `nph-label`. |
| D2 | No icon on the error line. | Renders only the error text. |
| D3 | Help `text/caption`; error `text/body-md`. | Sets the typography of both lines. |
| D4 | Help `color/muted-foreground`; error `status/error`. | Sets the color of both lines. |
| D5 | `space/stack-tight` in the stack, `space/inline-tight` label to icon; the empty line keeps no height. | Sets the gaps and does not render an empty message line. |
| D6 | Default `layout/field-width`; may stretch to its container; the control fills the field. | Sets the inline size of the field and lets the control fill it. |
| D7 | Stacked, `space/stack-tight` between options. | Sets the layout of the control area in group mode. |
| D8 | The field has `disabled`; opacity only on the control; disabled wins over error. | Adds a `disabled` property passed to the control. |

The field also has the counter decided on 15-10-2026; see the evidence.

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS,
tests, stories and spec pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## Pending decisions
The evidence gives the contract, so the code can start. Five points remain for Indiane; the code follows the stated default meanwhile, and the answer only adjusts one rule each.

| ID | What the evidence gives | What is missing | What the code does meanwhile |
|---|---|---|---|
| D-1 | In `erro`, the counter goes on a line below the message. | The alignment of that line and the space above it. | Counter at the end of its own line, `space/stack-tight` below the message. |
| D-2 | The counter sits on the right of the help line. | The minimum space between help text and counter, and what happens when the help text does not fit. | `space/inline` between them; the help text wraps and the counter stays at the top. |
| D-3 | `disabled` hides the error (D8). | Whether the help text comes back. | The help text comes back, as in the default state. |
| D-4 | The help text is one line of explanation. | What happens with a longer help text or error. | Both wrap, with no ellipsis. |
| D-5 | D6 names `layout/field-width`. | A `use:` line for `layout/field-width` and `layout/input-width` in `design.md`. | Nothing: `design.md` is not changed. |

## What this task does not do
It does not create a token or change a token value.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, frame `1194:21863` and set `657:50`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
