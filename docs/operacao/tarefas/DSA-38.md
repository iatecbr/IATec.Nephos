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
      "id": "D-2",
      "question": "The frame has no `leitura` state with focus. The code keeps the focus border and halo in `readonly`, because the field stays focusable (WCAG 2.4.7). It does not block the pull request.",
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
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-16.md, gap between the footer actions decided and textual audit approved",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-26.md, approval round 3 of the pending items (2026-11-26 08:18): the design owner accepted the recommended option of D-1, D-3, D-4, D-5, after market research with sources"
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
  "updated_at": "2026-11-26"
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
`v/5.0.0`. One point remains for Indiane (D-2); D-1, D-3, D-4 and D-5 were answered on 2026-11-26, see the section below. The code follows the stated default meanwhile.

| ID | What the evidence gives | What is missing | What the code does meanwhile |
|---|---|---|---|
| D-2 | `leitura` has no hover change and no error. | Focus in `leitura`. | The focus border and halo stay. |

## Decision answered on 2026-11-26
Indiane answered D-1, D-3, D-4, D-5 on 2026-11-26, in the approval round of the pending items, as recommended, after market research with sources.

| ID | Answer | What the code does |
|---|---|---|
| D-1 | Option 1: `space/control-padding` (12) on the sides, `space/inline` (8) at the top and bottom; minimum height 76. shadcn uses the same 12 and 8 (https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/registry/new-york-v4/ui/textarea.tsx ). | Nothing changes. Figma already draws it (node 1632:2). |
| D-3 | Option 1: counter at the start, actions at the end of the footer. No direct market source; it separates reading (counter) from action (buttons). | Nothing changes. Figma already draws it (footer 1890:582). |
| D-4 | Option 1: the default width outside `nph-field` is `layout/input-width` (280), as `nph-input`. Same shadcn source as D-1. | Nothing changes. Figma already draws it (node 1632:2). |
| D-5 | Option 2: one opacity only; the disabled textarea is at 0.5 and its actions do not fade again. Opacity multiplies from parent to child (https://developer.mozilla.org/en-US/docs/Web/CSS/opacity ). | The actions inside a disabled textarea stop applying their own disabled opacity. Figma updated on 2026-11-26: nodes 1890:660 and 1890:666 lose their own opacity. |

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
