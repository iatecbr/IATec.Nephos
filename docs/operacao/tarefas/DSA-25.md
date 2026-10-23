```json
{
  "id": "DSA-25",
  "goal": "Implement the nph-avatar-stack, the group of overlapping avatars with the count of who does not show, with the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 230,
  "owner": "elvys",
  "state": "in-review",
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
      "id": "D4",
      "question": "The use text in design.md is narrower than the accepted evidence for the tokens of the +N count: text/label-sm (chip and badge), text/label-md (button, field label, menu item), color/muted (table header, disabled area), color/border (divider, card outline), space/inline-tight (inside a unit), avatar/size-* and avatar/radius-* (the avatar). May that text be widened to name the count of nph-avatar-stack? Same class as D5 of DSA-24. The code consumes them as the evidence binds them. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-22"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-25/documentacao-figma-aceita-2026-10-08.md"
  ],
  "decision_refs": [
    "docs/decisoes-tecnicas.md#p78",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-19.md, Indiane answered D1 to D3 of the nph-avatar-stack"
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
    "branch": "claude/dsa-25-nph-avatar-stack-8e424e",
    "commit": "38d4e533a6e923bf3a253891074edfcf0ada8062",
    "pr": "https://github.com/iatecbr/IATec.Nephos/pull/96"
  },
  "context": "docs/operacao/contextos/DSA-25.md",
  "updated_at": "2026-10-22"
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

## Decisions answered
D1 to D3 are answered; the answers and the measures read from Figma are in the
evidence of the `figma-docs-accepted` gate, sections "Measures and tokens" and
"Decisions answered". The stack is made of `nph-avatar` instances; DSA-24 is
`done`, so B1 is closed and the task is `ready`.

| ID | Answer | What the code does |
|---|---|---|
| D1 | The "+N" uses `text/label-sm` in `sm` and `md`, and `text/label-md` in `lg`, in `color/muted-foreground`. | Sets the typography of the count per size. |
| D2 | The count overlaps the last avatar by `avatar/overlap`, like any neighbor. | Gives the count the same start margin as the avatars. |
| D3 | Only the avatar's own border, `border/width` in `color/border`, inside. No wider ring. Same answer as DSA-24 D4. | The stack adds no ring; the separation comes from `nph-avatar`. |

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
