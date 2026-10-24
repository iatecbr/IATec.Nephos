```json
{
  "id": "DSA-38",
  "goal": "Implement the nph-textarea, the multi-line text field with an optional footer for counter and actions, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 390,
  "owner": "elvys",
  "state": "done",
  "piece": "nph-textarea",
  "dependencies": ["DSA-13", "DSA-28"],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-textarea documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-38/documentacao-figma-aceita-2026-10-16.md",
      "result": "passed",
      "verified_at": "2026-10-16",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, CSS, tests, stories and spec pass the proof commands and are merged into v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-38/review-and-merge-2026-10-24.md",
      "result": "passed",
      "verified_at": "2026-10-24",
      "verified_by": "claude-code"
    }
  ],
  "blockers": [],
  "pending_decisions": [
    {
      "id": "D-1",
      "question": "The evidence does not name the inner padding of the box. The code uses `space/control-padding` on the sides, as `nph-input`, and `space/inline` at the top and bottom: 76 = 3 lines of `text/body-md` (20) + 2 x 8, which is what the `use` of `layout/textarea-min-height` describes. The footer keeps the same `space/inline` to the bottom border. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-23"
    },
    {
      "id": "D-2",
      "question": "The frame has no `leitura` state with focus. The code keeps the focus border and halo in `readonly`, because the field stays focusable (WCAG 2.4.7). It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-23"
    },
    {
      "id": "D-3",
      "question": "The evidence places the footer `space/stack` below the text and the actions `space/inline` apart, but not their alignment. The code puts the footer inside the box, the counter at the start and the actions at the end; a counter alone stays at the start. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-23"
    },
    {
      "id": "D-4",
      "question": "There is no width token for the textarea. Outside `nph-field`, the code uses `layout/input-width` by default, as `nph-input`, with no minimum; the parent may stretch it. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-23"
    },
    {
      "id": "D-5",
      "question": "With the piece disabled, the evidence says the footer actions are disabled too and the whole piece takes `state/disabled-opacity`. It does not say whether the actions keep their own disabled opacity inside the faded piece. The code keeps both, so a disabled action reads fainter than the field; `nph-field` avoided that sum for its control (P83). It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-23"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-38/documentacao-figma-aceita-2026-10-16.md",
    "docs/operacao/evidencias/DSA-38/review-and-merge-2026-10-24.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-15.md, nph-textarea modernized, height tokens created, counter decided and documentation accepted",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-16.md, gap between the footer actions decided and textual audit approved"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1632-24",
    "date": "2026-10-16",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-textarea frame (1632:24), documentation 1922:642, was accepted as the API and behavior specification of the nph-textarea. COMPONENT_SET 1632:22. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": {
    "branch": "claude/dsa-38-nph-textarea-4ada6c",
    "commit": "f4e98c64f06e7cfd274c8a55ce6db37b729c6aa9",
    "pr": "https://github.com/iatecbr/IATec.Nephos/pull/111"
  },
  "context": null,
  "updated_at": "2026-10-24"
}
```

# DSA-38 — nph-textarea, the multi-line text field

## Goal
The `nph-textarea` exists in `src/components/nph-textarea/`, with a spec, tests
and stories, in the contract accepted in Figma.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate:
`docs/operacao/evidencias/DSA-38/documentacao-figma-aceita-2026-10-16.md`. It
carries the Figma documentation converted to text. There is no need to open Figma.

## Pending decisions
Value, form participation, events, keyboard and the way the counter reads the text
are technical proposals for the PR (P93). The two height tokens are already on
`v/5.0.0`. Five points remain for Indiane; the code follows the stated default
meanwhile, and the answer only adjusts one rule each.

| ID | What the evidence gives | What is missing | What the code does meanwhile |
|---|---|---|---|
| D-1 | The heights include the padding of the field. | The inner padding of the box. | `space/control-padding` on the sides, `space/inline` at the top and bottom. |
| D-2 | `leitura` has no hover change and no error. | Focus in `leitura`. | The focus border and halo stay. |
| D-3 | The footer is `space/stack` below the text; actions `space/inline` apart. | The alignment inside the footer. | Footer inside the box; counter at the start, actions at the end. |
| D-4 | No width. | The default width outside `nph-field`. | `layout/input-width`, as `nph-input`. |
| D-5 | `disabled`: the actions are disabled; the piece at `state/disabled-opacity`. | Whether the actions keep their own disabled opacity inside the faded piece. | Both apply, so a disabled action reads fainter than the field. |

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS,
tests, stories and spec pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## Relations with other tasks
- The footer actions are `nph-button` instances (DSA-13), `ghost` and `solid`, in
  `size=default`.
- The field sits inside `nph-field` (DSA-28), which gives the label, the help
  text, the error message and the support-line counter (property `contador`).
  The required example "Description in a form" needs it; DSA-28 is `done`, so B1
  is closed and the task is `ready`.

## What this task does not do
It does not create a token or change a token value. It does not bring a handle to
resize by dragging: the field grows with the text and scrolls above
`layout/textarea-max-height`. It does not paint the counter in the error color:
the error stays on the border and on the `nph-field` message. It does not turn the
footer on in `state=leitura`.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, board `1632:24`, documentation `1922:642`, set
  `1632:22`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
