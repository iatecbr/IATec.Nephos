```json
{
  "id": "DSA-04",
  "goal": "Add the information trigger (info and infoLabel) to nph-label, with a visible focus and opening of the nph-tooltip, in the contract accepted in Figma.",
  "phase": "F4",
  "approved_order": 110,
  "owner": "claude-code",
  "state": "in-review",
  "piece": "nph-label",
  "dependencies": ["DSA-07", "DSA-08"],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-label documentation in Figma, with info, focus and the open row, was accepted by Indiane and recorded as evidence.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-04/documentacao-figma-aceita-2026-10-01.md",
      "result": "passed",
      "verified_at": "2026-10-01",
      "verified_by": "indiane"
    },
    {
      "id": "tokens-checked-against-figma",
      "description": "The theme and semantic tokens from Figma, and the primitives that resolve them, are in the generated tokens.css with the same alias and value.",
      "command": "node docs/operacao/evidencias/DSA-04/conferir-tokens-figma.cjs",
      "evidence": "docs/operacao/evidencias/DSA-04/tokens-conferidos-com-figma-2026-10-05.md",
      "result": "passed",
      "verified_at": "2026-10-05",
      "verified_by": "claude-code"
    },
    {
      "id": "review-and-merge",
      "description": "Component, CSS, tests, stories, spec and P62.6 reviewed by maurocsjr and merged into v/5.0.0; rule 6 of design.md goes in through PR #57.",
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
    "docs/operacao/evidencias/DSA-04/documentacao-figma-aceita-2026-10-01.md",
    "docs/operacao/evidencias/DSA-04/tokens-conferidos-com-figma-2026-10-05.md",
    "docs/operacao/evidencias/DSA-04/storybook-validacao-2026-10-06.md"
  ],
  "decision_refs": [
    "docs/decisoes-tecnicas.md#p62",
    "WORK BRAIN — 02 PROJETOS/DS-Agentico/Registro de decisões — Nephos.md, L8 a L11"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1194-1482",
    "date": "2026-10-01",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-label frame (1194:1482) and the COMPONENT_SET 374:6 were accepted with info, infoLabel, the trigger focus and the open row. An empty infoLabel omits the trigger (decision of 01-10-2026). On 05-10-2026 Indiane decided that the nph-tooltip (DSA-08) goes into code before this delivery."
  },
  "git_review": { "branch": "feat/dsa04-nph-label-info", "commit": "3417a76", "pr": "58" },
  "context": null,
  "updated_at": "2026-10-06"
}
```

# DSA-04 — nph-label information trigger

## Goal
The `nph-label` accepts `info` and `infoLabel` (`info-label`). With both filled in,
it shows the information trigger, with a visible focus, which opens the
`nph-tooltip` with the text of `info`. Without `info`, the label is the one it is
today.

## How it is proved
**`figma-docs-accepted`** — the `nph-label` frame (`1194:1482`) and the
COMPONENT_SET `374:6` were accepted by Indiane on 01-10-2026, with the Figma UX QA
and the text audit approved.

**`tokens-checked-against-figma`** — `node
docs/operacao/evidencias/DSA-04/conferir-tokens-figma.cjs` exits 0: the focus
tokens, the tooltip tokens and the others that Figma had and the code did not are
in the generated `tokens.css` with the same alias and value.

**`review-and-merge`** — component, CSS, tests, stories, spec and the technical
decision P62.6 pass the proof commands, are reviewed by `maurocsjr` and
merged into `v/5.0.0`. Rule 6 of `design.md` (focus border and halo) goes in
through PR #57.

## What this task does not do
It does not implement the `nph-tooltip` (DSA-08). It does not rename or deprecate
`focus/ring` and `focus/ring-error`. It does not change `nph-field` or `nph-input`.
It does not change Figma.

## Sources
- `fichas/nph-label.md`
- `src/components/nph-label/`
- `design.md`
- `docs/decisoes-tecnicas.md`
- `docs/operacao/README.md`
- `GOVERNANCA.md`, `AGENTS.md`, `CLAUDE.md`
- Figma `DS-IA-NEPHOS 5.0`, frame `1194:1482` and COMPONENT_SET `374:6`
- WORK BRAIN — `02 PROJETOS/DS-Agentico/Registro de decisões — Nephos.md`, L8 a L11
