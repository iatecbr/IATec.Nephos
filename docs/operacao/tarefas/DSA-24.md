```json
{
  "id": "DSA-24",
  "goal": "Implement the nph-avatar, which shows who the person is by photo or, without a photo, by the person icon, with the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 220,
  "owner": "elvys",
  "state": "awaiting-decision",
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
      "question": "Which nph-icon core name and variant is the person icon of the no-photo avatar? (user or circle-user; light or solid)",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D2",
      "question": "Which icon size goes in each avatar size? (sm 24, md 32, lg 40 against icon/size-sm 16, icon/size-md 20, icon/size-lg 24)",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D3",
      "question": "While the photo is loading, does the avatar show the person icon or only the color/muted background?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D4",
      "question": "Is the frame border border/width thick, and does it stay visible over the photo, as DSA-25 implies for the stack?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-24/documentacao-figma-aceita-2026-10-06.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens"
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
    "branch": null,
    "commit": null,
    "pr": null
  },
  "context": null,
  "updated_at": "2026-10-14"
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

## Pending decisions
The evidence gives the frame, the sizes, the radii and the colors, but not the icon rules and the border the CSS needs. Code does not fill these gaps; each answer goes into the evidence of the `figma-docs-accepted` gate, and the task goes back to `ready` when all four are answered.

| ID | What the evidence gives | What is missing | What the code does with the answer |
|---|---|---|---|
| D1 | A person icon in `color/muted-foreground` when there is no photo. | The `nph-icon` core name (`user` or `circle-user`) and the variant (`light` or `solid`). | Fixes the name and variant of the inner `nph-icon`. |
| D2 | Avatar sizes `avatar/size-sm`, `-md` and `-lg`. | The icon size in each avatar size. | Sets the size of the inner `nph-icon` per avatar size. |
| D3 | The `sem foto` type shows when the image does not exist or does not load; the frame is never empty. | What shows while the photo is still loading. | Decides what the loading state renders. |
| D4 | Frame border in `color/border`; the photo fills the frame. DSA-25 uses this border to separate overlapping avatars. | The border width, and whether it stays visible over the photo. | Sets the border and whether the photo sits inside it. |

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
