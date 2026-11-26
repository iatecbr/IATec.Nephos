```json
{
  "id": "DSA-51",
  "goal": "Implement the nph-image, the image of a product, file or content in a fixed area with loading, empty and error states, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 500,
  "owner": "elvys",
  "state": "done",
  "piece": "nph-image",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-image documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-51/documentacao-figma-aceita-2026-10-23.md",
      "result": "passed",
      "verified_at": "2026-10-23",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, CSS, tests, stories and spec pass the proof commands and are merged into v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-51/review-and-merge-2026-10-23.md",
      "result": "passed",
      "verified_at": "2026-10-23",
      "verified_by": "claude-code"
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "docs/operacao/evidencias/DSA-51/documentacao-figma-aceita-2026-10-23.md",
    "docs/operacao/evidencias/DSA-51/review-and-merge-2026-10-23.md"
  ],
  "decision_refs": [
    "docs/decisoes-tecnicas.md#p90",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-23.md, nph-image visual acceptance, Figma UX QA and textual audit approved; the 33 tokens on v/5.0.0",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-25.md, 14:06: the design owner chose option 3 of the Figma preview 8407:173493 for D1, the vector icon the component already has, on the image/illustration-background token, one art for both modes",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-26.md, approval round 4 of the pending items (2026-11-26 08:19): the component token contract in design.md, A6 answers D2 (tokens_image and the two overlay/on-media entries)"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=2573-66090",
    "date": "2026-10-23",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-image board (2573:66090), with its `Documentação` frame (2677:465), was accepted as the API and behavior specification of the nph-image. COMPONENT_SET 2573:66089. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": "claude/dsa-51-nph-image-bd4e5f", "commit": "ba4e23dcb2b02fd4bf1996e127c2abc3567ad459", "pr": "106" },
  "context": null,
  "updated_at": "2026-11-26"
}
```

# DSA-51 — nph-image, the image of a product, file or content in a fixed area

## Goal
The `nph-image` exists in `src/components/nph-image/`, with a spec, tests and
stories, in the contract accepted in Figma.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate:
`docs/operacao/evidencias/DSA-51/documentacao-figma-aceita-2026-10-23.md`. It
carries the Figma documentation converted to text, with the tokens of each part.
There is no need to open Figma.

## Why it is ready
It depends on no other task to be built. Every token it uses is on `v/5.0.0`:
the 23 `image/*` tokens, `overlay/on-media-strong`, `overlay/on-media-foreground`
and the core primitives `core/image-size/100` to `600`, `core/layout-width/media`
and `core/alpha/black-60` were taken to the token sources together with this task.
The hover eye uses the `nph-icon`.

## Decisions answered on 2026-11-25 and 2026-11-26
| ID | Answer | What the code does |
|---|---|---|
| D1 | Answered on 2026-11-25: no image asset. The empty and error states use the vector icon the component already has, on the `image/illustration-background` token (light `core/slate/100`, dark `core/slate/800`), one art for both modes (Figma preview 8407:173493, option 3). | Draw the empty and error states with the `nph-icon` on `image/illustration-background`; no bitmap file enters the repository. Figma updated on 2026-11-25 (set 2573:66089). |
| D2 | Answered on 2026-11-26: `design.md` gets a `tokens_image` block with every `image/*` token, and `overlay/on-media-strong` and `overlay/on-media-foreground` next to `overlay/on-media` (component token contract, A6). | Nothing changes in the code; the entries are in `design.md` on v/5.0.0. |

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS,
tests, stories and spec pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## Relations with other tasks
- The thumbnail and the expanded item of the `nph-table` will use the
  `nph-image`.
- The hover eye is an `nph-icon`.
- For a person, the `nph-avatar` is the right piece, not the `nph-image`.

## What this task does not do
It does not create a token or change a token value. It does not build the
`nph-table`, `nph-avatar` or any dependent component. It does not change Figma.
The empty and error states need no image asset: they use the vector icon on
`image/illustration-background` (D1, answered on 2026-11-25).

## Sources
- Figma `DS-IA-NEPHOS 5.0`, board `2573:66090`, `Documentação` frame `2677:465`
  and set `2573:66089`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
