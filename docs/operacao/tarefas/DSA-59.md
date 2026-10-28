```json
{
  "id": "DSA-59",
  "goal": "Add the compact size to nph-input, the 28 px field for the compact toolbar and the compact table, in the contract accepted in Figma, and update its spec.",
  "phase": "F4",
  "approved_order": 580,
  "owner": "elvys",
  "state": "in-review",
  "piece": "nph-input",
  "dependencies": [
    "DSA-16"
  ],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-input documentation with the compact size in Figma was accepted by the design owner, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-59/documentacao-figma-aceita-2026-10-28.md",
      "result": "passed",
      "verified_at": "2026-10-28",
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
      "question": "The evidence sets the end padding of the compact size to `input/clear-padding-end` (5 px) in every state. The code follows it literally, so a compact field with no clear button, or with the button hidden because there is no value, has its value and placeholder 5 px from the end border, while default and large keep 12 px. Is that intended, or should a compact field without the clear button keep `space/control-padding`? It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-28"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-59/documentacao-figma-aceita-2026-10-28.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-27.md, nph-input compact size visual acceptance",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-28.md, Figma UX QA and textual audit approved; the clear button focus ring in the compact size stays as it is and goes past the field only on focus (option 1 of the preview); documentation accepted; approved_order 580"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1211-690",
    "date": "2026-10-28",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-input board (1195:532), with its Documentação frame (1211:690), was accepted with the size compact as the API and behavior specification of that size. Component set: nph-input (622:18359), size × state, 21 variants. The compact size, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": "claude/strange-goldberg-ae2bb1", "commit": null, "pr": "https://github.com/iatecbr/IATec.Nephos/pull/139" },
  "context": "docs/operacao/contextos/DSA-59.md",
  "updated_at": "2026-10-28"
}
```

# DSA-59 — nph-input, compact size

## Goal
The `nph-input` in `src/components/nph-input/` accepts the size `compact`, with tests, stories and the spec updated, in the contract accepted in Figma.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-59/documentacao-figma-aceita-2026-10-28.md`. It carries the compact size converted to text, with the tokens of each part. There is no need to open Figma.

## Why it is ready
The 2 `input/*` tokens came with this task and are on `v/5.0.0`: `input/height-compact`, an alias of `control/height-compact`, and `input/clear-padding-end`, an alias of the new core primitive `core/space/off-scale/5` (5 px). The nph-input itself is done (DSA-16); this task only adds a size.

The search in the compact nph-toolbar is an nph-input of 28 px. With this task on `v/5.0.0`, B1 of DSA-55 is closed. This task does not change DSA-55.

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
It does not create a token or change a token value. It does not change the sizes `default` and `large`. It does not change nph-field, nph-icon, nph-toolbar or nph-data-table. It does not change Figma.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, page `🎨NPH — Input` (`420:2`), board `1195:532`, Documentação frame `1211:690`, variant matrix `1195:552`
- Component set: nph-input `622:18359`; compact variants `2978:9` to `2978:47`
- `design.md` — the tokens named in the evidence
- `fichas/nph-input.md`
