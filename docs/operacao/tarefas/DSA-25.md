```json
{
  "id": "DSA-25",
  "goal": "Implement the nph-avatar-stack, the group of overlapping avatars with the count of who does not show, with the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 230,
  "owner": "elvys",
  "state": "awaiting-decision",
  "piece": "nph-avatar-stack",
  "dependencies": ["DSA-24"],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-avatar-stack documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-25/documentacao-figma-aceita-2026-10-08.md",
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
      "question": "Which text role does the +N count use, and does it change with the group size? (text/caption, text/label-sm or text/label-md)",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D2",
      "question": "Does the +N count overlap the last avatar by avatar/overlap, or sit next to it with a space, and with which token?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D3",
      "question": "Is the separation between overlapping avatars only the avatar's own border (border/width in color/border), or a wider ring? This is the same answer as DSA-24 D4.",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-25/documentacao-figma-aceita-2026-10-08.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1579-46",
    "date": "2026-10-08",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-avatar-stack frame (1579:46) was accepted as the API and behavior specification of the nph-avatar-stack. COMPONENT_SET 1579:45. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
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

# DSA-25 — nph-avatar-stack, overlapping avatars

## Goal
The `nph-avatar-stack` exists in `src/components/nph-avatar-stack/`, with a spec,
tests and stories, in the contract accepted in Figma.

It uses `nph-avatar` (DSA-24) for each avatar.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate:
`docs/operacao/evidencias/DSA-25/documentacao-figma-aceita-2026-10-08.md`. It
carries the Figma documentation converted to text. There is no need to open Figma.

## Pending decisions
The stack is made of `nph-avatar` instances, so it depends on DSA-24 and waits for its pending decisions D1–D4. The three decisions below are the stack's own. Each answer goes into the evidence of the `figma-docs-accepted` gate; the task goes back to `ready` when all three are answered and DSA-24 is `done`.

| ID | What the evidence gives | What is missing | What the code does with the answer |
|---|---|---|---|
| D1 | The count: background, border, radius, height, minimum width, side padding and text color. | The text role of the "+N" and whether it changes with the size. | Sets the typography of the count. |
| D2 | `avatar/overlap` between neighbors; the count sits at the end of the group. | Whether the count overlaps the last avatar or sits beside it with a space. | Sets the start margin of the count. |
| D3 | The `color/border` border separates overlapping avatars; the count uses `border/width`. | Whether the separation is only the avatar's own border or a wider ring. | Either the stack adds nothing, or it draws a ring around each avatar. |

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS,
tests, stories and spec pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
It does not create a token or change a token value.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, frame `1579:46` and set `1579:45`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
