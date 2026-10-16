```json
{
  "id": "DSA-40",
  "goal": "Implement the nph-empty, the empty state of an area with no content, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 410,
  "owner": "elvys",
  "state": "ready",
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
      "evidence": null,
      "result": "pending",
      "verified_at": null,
      "verified_by": null
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "docs/operacao/evidencias/DSA-40/documentacao-figma-aceita-2026-10-16.md"
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
    "converted_decision": "The nph-empty board (1463:25260), with its Documentação frame (2003:688), was accepted as the API and behavior specification of the nph-empty. COMPONENT_SET: none, the piece is a single COMPONENT (1463:25238). The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-10-16"
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
it uses is on `v/5.0.0`. The two illustration files come with the message that
sends this task; they are not tokens.

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS,
tests, stories and spec pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## Relations with other tasks
- The option list of `nph-combobox` (its task is not open yet), in `state=vazio`, shows an
  `nph-empty` when the search finds no option. In `state=carregando` it does not
  use the `nph-empty`.

## What this task does not do
It does not create a token or change a token value: `scheme/is-light` and
`scheme/is-dark` are already on `v/5.0.0`. It does not add an action: the piece
has no button and no link. It does not show loading: that is the state of the
piece that receives the `nph-empty`.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, board `1463:25260`, frame `2003:688`, component `1463:25238`
- `design.md` — the tokens named in the evidence, `tokens_scheme` included
- `fichas/_modelo.md`
