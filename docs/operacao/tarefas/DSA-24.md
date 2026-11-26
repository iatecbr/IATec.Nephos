```json
{
  "id": "DSA-24",
  "goal": "Implement the nph-avatar, which shows who the person is by photo or, without a photo, by the person icon, with the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 220,
  "owner": "elvys",
  "state": "done",
  "piece": "nph-avatar",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-avatar documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-24/documentacao-figma-aceita-2026-10-06.md",
      "result": "passed",
      "verified_at": "2026-10-06",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, CSS, tests, stories and spec pass the proof commands and are merged into v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-24/review-and-merge-2026-10-20.md",
      "result": "passed",
      "verified_at": "2026-10-20",
      "verified_by": "claude-code"
    }
  ],
  "blockers": [],
  "pending_decisions": [
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-24/documentacao-figma-aceita-2026-10-06.md",
    "docs/operacao/evidencias/DSA-24/review-and-merge-2026-10-20.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-26.md, approval round 4 of the pending items (2026-11-26 08:19): the component token contract in design.md, A0 to A6 (Carbon, Primer, Salesforce)",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-19.md, Indiane answered D1 to D4 of the nph-avatar"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1434-30",
    "date": "2026-10-06",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-avatar frame (1434:30) was accepted as the API and behavior specification of the nph-avatar. COMPONENT_SET 1434:29. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": {
    "branch": "claude/dsa-24-nph-avatar-9feadc",
    "commit": "d4bbf089bcb081eb452485c66fbd4c515727c47c",
    "pr": "90"
  },
  "context": null,
  "updated_at": "2026-11-26"
}
```

# DSA-24 — nph-avatar, the picture of a person

## Goal
The `nph-avatar` exists in `src/components/nph-avatar/`, with a spec,
tests and stories, in the contract accepted in Figma.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate:
`docs/operacao/evidencias/DSA-24/documentacao-figma-aceita-2026-10-06.md`. It
carries the Figma documentation converted to text. There is no need to open Figma.

## Decisions answered
D1 to D4 are answered; the answers and the measures read from Figma are in the
evidence of the `figma-docs-accepted` gate, sections "Measures and tokens" and
"Decisions answered".

| ID | Answer | What the code does |
|---|---|---|
| D1 | `nph-icon` `user`, style `light`. | Fixes the name and variant of the inner `nph-icon`. |
| D2 | `sm` takes `icon/size-sm`, `md` takes `icon/size-md`, `lg` takes `icon/size-lg`. | Sets the size of the inner `nph-icon` per avatar size. |
| D3 | While the photo loads, the person icon shows, as in `sem foto`. If the photo fails, the icon stays. | Renders the icon until the image loads, and keeps it on error. |
| D4 | `border/width` in `color/border`, inside the frame and drawn over the photo. | Draws the border above the image, so it stays visible. |

## Pending decisions
Answered on 2026-11-26: see the section below.

## Decision answered on 2026-11-26
Indiane answered D5 on 2026-11-26, in the approval round of the pending items, as recommended, after market research with sources.

| ID | Answer | What the code does |
|---|---|---|
| D5 | Answered by the component token contract (A1): `tokens_avatar` in design.md has `avatar/background`, `avatar/border` and `avatar/icon`; the use of `icon/size-md` and `icon/size-lg` names the icon inside the nph-avatar. | Nothing changes; DSA-120 moves the CSS to the avatar tokens. |

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS,
tests, stories and spec pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
It does not create a token or change a token value.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, frame `1434:30` and set `1434:29`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
