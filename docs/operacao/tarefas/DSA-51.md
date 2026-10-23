```json
{
  "id": "DSA-51",
  "goal": "Implement the nph-image, the image of a product, file or content in a fixed area with loading, empty and error states, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 500,
  "owner": "elvys",
  "state": "in-review",
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
      "question": "The empty and error illustrations of nph-image are image assets that are not in the repository, and the evidence says the code must ask the design owner for them. Which files go in, for light and dark, for the square sizes and for media at 1:1, 4:3 and 16:9, and in which format (assets/illustrations/, as nph-empty)? Until they arrive, empty and error draw the frame only and look alike (P90, Known limits). It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-23"
    },
    {
      "id": "D2",
      "question": "design.md has no usage entry for the image/* tokens, nor for overlay/on-media-strong and overlay/on-media-foreground (it has overlay/on-media only). May the entries be added, as the other component tokens have? The code consumes them as the evidence binds them. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-23"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-51/documentacao-figma-aceita-2026-10-23.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-23.md, nph-image visual acceptance, Figma UX QA and textual audit approved; the 33 tokens on v/5.0.0"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=2573-66090",
    "date": "2026-10-23",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-image board (2573:66090), with its `Documentação` frame (2677:465), was accepted as the API and behavior specification of the nph-image. COMPONENT_SET 2573:66089. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": "claude/dsa-51-nph-image-bd4e5f", "commit": "87c1d3244d855a70a9e06e12f7280e1bc65d5633", "pr": 106 },
  "context": "docs/operacao/contextos/DSA-51.md",
  "updated_at": "2026-10-23"
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
The gray line illustrations of loading, empty and error are image assets that are
not in the repository; ask the design owner before choosing how to ship them.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, board `2573:66090`, `Documentação` frame `2677:465`
  and set `2573:66089`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
