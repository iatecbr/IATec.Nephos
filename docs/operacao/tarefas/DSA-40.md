```json
{
  "id": "DSA-40",
  "goal": "Implement the nph-empty, the empty state of an area with no content, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 410,
  "owner": "elvys",
  "state": "done",
  "piece": "nph-empty",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-empty documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-40/documentacao-figma-aceita-2026-10-16.md",
      "result": "passed",
      "verified_at": "2026-10-16",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, CSS, tests, stories and spec pass the proof commands and are merged into v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-40/review-and-merge-2026-10-23.md",
      "result": "passed",
      "verified_at": "2026-10-23",
      "verified_by": "claude-code"
    }
  ],
  "blockers": [],
  "pending_decisions": [
    {
      "id": "D2",
      "question": "The light illustration is 240 × 174 and fits the 120 × 87 box; the dark one is 240 × 180, another proportion (until 2026-11-23 they were 2048 × 1487 and 2048 × 1538; D1, DSA-115). In Figma, is the dark one cut (fill) or fitted (fit) in the box, or should it be exported again with the same frame as the light one? The code fits it whole, with object-fit: contain, so it is about 116 px wide. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-22"
    },
    {
      "id": "D3",
      "question": "The evidence gives the box the width layout/input-width. In a narrower container, does the box shrink to it, or keep its width? The code shrinks it (max-inline-size: 100%), so the text wraps instead of overflowing. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-22"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-40/documentacao-figma-aceita-2026-10-16.md",
    "docs/operacao/evidencias/DSA-40/review-and-merge-2026-10-23.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-16.md, nph-empty visual acceptance, Figma UX QA approved, documentation accepted, textual audit approved and the scheme/is-light and scheme/is-dark names",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-23.md (15:0x), lot A of the pending decisions of the v1 closing: Indiane answered D1 and D4 in the chat, all as recommended, after market research with sources; both change in DSA-115"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1463-25260",
    "date": "2026-10-16",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-empty board (1463:25260), with its `Documentação` frame (2003:688), was accepted as the API and behavior specification of the nph-empty. COMPONENT_SET: none, the piece is a single COMPONENT (1463:25238). The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": {
    "branch": "claude/dsa-40-nph-empty-6944c2",
    "commit": "fc054802dff078c1351ac0b055e398fe6d527003",
    "pr": "https://github.com/iatecbr/IATec.Nephos/pull/100"
  },
  "context": null,
  "updated_at": "2026-11-23"
}
```

# DSA-40 — nph-empty, the empty state of an area with no content

## Goal
The `nph-empty` exists in `src/components/nph-empty/`, with a spec, tests and
stories, in the contract accepted in Figma.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate:
`docs/operacao/evidencias/DSA-40/documentacao-figma-aceita-2026-10-16.md`. It
carries the Figma documentation converted to text, with the tokens of each part.
There is no need to open Figma.

## Why it is ready
It depends on no other task: the piece has no child component, and every token
it uses is on `v/5.0.0`. The two illustration files are on `v/5.0.0` too, in
`assets/illustrations/`; they are not tokens.

## Decisions answered on 2026-11-23
Indiane answered D1 and D4 in the chat on 2026-11-23, in lot A of the pending decisions of the v1 closing, all as recommended, after market research with sources.

| ID | Answer | What the code does |
|---|---|---|
| D1 | Export at 2× the drawing: 240 × 174 for the box of 120 × 87. An image much larger than the space it fills costs two to four times more data (https://web.dev/articles/serve-responsive-images ). | Changes in DSA-115: the two files are replaced. |
| D4 | Option (c): the illustrations are embedded in the package, so the product sets nothing up. Carbon ships its pictograms inside its package (https://carbondesignsystem.com/elements/pictograms/code/ ). | Changes in DSA-115; the known limit of P84 goes with it. |

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS,
tests, stories and spec pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## Relations with other tasks
- The option list of `nph-combobox` (DSA-46), in `state=vazio`, shows an
  `nph-empty` when the search finds no option. In `state=carregando` it does not
  use the `nph-empty`.

## Pending decisions
The evidence gives the whole contract, so the code could start. D1 and D4 were answered on 2026-11-23 (section "Decisions answered on 2026-11-23"); D2 and D3 remain for Indiane. The code follows the stated default meanwhile, and the answer only adjusts one file or one rule each.

| ID | What the evidence gives | What is missing | What the code does with the answer |
|---|---|---|---|
| D2 | The box of 120 × 87, which fits the light file. | Whether the dark file, of another proportion, is cut or fitted. | Fits it whole. If the answer is to cut, one CSS declaration changes; if it is a new export, nothing changes. |
| D3 | The width `layout/input-width`. | What the box does in a narrower container. | Shrinks to the container. If the answer is to keep the width, one CSS declaration goes. |

## What this task does not do
It does not create a token or change a token value: `scheme/is-light` and
`scheme/is-dark` are already on `v/5.0.0`. It does not add an action: the piece
has no button and no link. It does not show loading: that is the state of the
piece that receives the `nph-empty`.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, board `1463:25260`, frame `2003:688`, component `1463:25238`
- `design.md` — the tokens named in the evidence, `tokens_scheme` included
- `assets/illustrations/` — `empty-no-option-found.png` and `empty-no-option-found-dark.png`
- `fichas/_modelo.md`
