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
      "id": "D1",
      "question": "The two illustration files are 2048 px wide (about 385 KB each) for a drawing of 120 × 87, and the piece downloads both, because the scheme switches them by opacity. Can the illustrations be exported at 2× (240 × 174) or 3× (360 × 261)? The code uses the current files; a new file does not change the code. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-22"
    },
    {
      "id": "D2",
      "question": "The light illustration is 2048 × 1487 and fits the 120 × 87 box; the dark one is 2048 × 1538, another proportion. In Figma, is the dark one cut (fill) or fitted (fit) in the box, or should it be exported again with the same frame as the light one? The code fits it whole, with object-fit: contain, so it is about 116 px wide. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-22"
    },
    {
      "id": "D3",
      "question": "The evidence gives the box the width layout/input-width. In a narrower container, does the box shrink to it, or keep its width? The code shrinks it (max-inline-size: 100%), so the text wraps instead of overflowing. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-22"
    },
    {
      "id": "D4",
      "question": "Follows D1. An Angular application published in a subdirectory, such as /my-app/, resolves the illustrations to /assets/ at the root of the site, outside the application, so the consumer copies the two PNG files there (known limit of P84, decided by Elvys on 23/10/2026). A new task is needed for (b) or (c) once D1 settles the weight of the illustrations: (b) the consumer gives the base of the assets, or (c) the illustrations are embedded in the package. Indiane opens that task, because the DSA IDs come from Jira. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-23"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-40/documentacao-figma-aceita-2026-10-16.md",
    "docs/operacao/evidencias/DSA-40/review-and-merge-2026-10-23.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-16.md, nph-empty visual acceptance, Figma UX QA approved, documentation accepted, textual audit approved and the scheme/is-light and scheme/is-dark names"
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
  "updated_at": "2026-10-23"
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

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS,
tests, stories and spec pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## Relations with other tasks
- The option list of `nph-combobox` (DSA-46), in `state=vazio`, shows an
  `nph-empty` when the search finds no option. In `state=carregando` it does not
  use the `nph-empty`.

## Pending decisions
The evidence gives the whole contract, so the code can start. Four points remain for Indiane; the code follows the stated default meanwhile, and the answer only adjusts one file or one rule each.

| ID | What the evidence gives | What is missing | What the code does with the answer |
|---|---|---|---|
| D1 | The two illustration files, drawn at 120 × 87. | Files the size of the drawing: the current ones are 2048 px wide. | Uses the current files. A lighter export only replaces the two files. |
| D2 | The box of 120 × 87, which fits the light file. | Whether the dark file, of another proportion, is cut or fitted. | Fits it whole. If the answer is to cut, one CSS declaration changes; if it is a new export, nothing changes. |
| D3 | The width `layout/input-width`. | What the box does in a narrower container. | Shrinks to the container. If the answer is to keep the width, one CSS declaration goes. |
| D4 | The delivery of P84: the images resolve next to the bundle, in `../assets/`. | Whether a new task brings (b) a base of the assets given by the consumer, or (c) the illustrations embedded in the package, once D1 settles their weight. | Nothing changes meanwhile: an Angular application in a subdirectory copies the two PNG files to `/assets/` at the root of the site (known limit of P84 and of `docs/consuming.md`). |

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
