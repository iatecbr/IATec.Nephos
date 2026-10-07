```json
{
  "id": "DSA-08",
  "goal": "Implement the nph-tooltip, the help balloon opened by the info trigger of nph-label, with the contract accepted in Figma.",
  "phase": "F4",
  "approved_order": 105,
  "owner": "claude-code",
  "state": "done",
  "piece": "nph-tooltip",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-tooltip documentation in Figma was accepted by Indiane and recorded as evidence.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-08/documentacao-figma-aceita-2026-10-01.md",
      "result": "passed",
      "verified_at": "2026-10-01",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, CSS, tests, stories, spec, P65 and the design.md rules reviewed by maurocsjr and merged into v/5.0.0.",
      "command": "git merge-base --is-ancestor 06af12539de95416ee816ca65f63298063e1bf6b origin/v/5.0.0",
      "evidence": "docs/operacao/evidencias/DSA-08/revisao-e-merge-2026-10-06.md",
      "result": "passed",
      "verified_at": "2026-10-06",
      "verified_by": "claude-code"
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "docs/operacao/evidencias/DSA-08/documentacao-figma-aceita-2026-10-01.md",
    "docs/operacao/evidencias/DSA-08/revisao-e-merge-2026-10-06.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 02 PROJETOS/DS-Agentico/Registro de decisões — Nephos.md, L11.5 a L11.7",
    "WORK BRAIN — 02 PROJETOS/DS-Agentico/Mapa de decisão — Nephos.md, item 48"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1237-5",
    "date": "2026-10-01",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-tooltip frame (1237:5) was accepted as the API and behavior specification of the nph-tooltip. COMPONENT_SET: none; single COMPONENT 1237:3, with no variants. On 05-10-2026 Indiane decided that the nph-tooltip goes into code before the DSA-04 code delivery."
  },
  "git_review": { "branch": "feat/dsa08-nph-tooltip", "commit": "06af125", "pr": "51" },
  "context": null,
  "updated_at": "2026-10-06"
}
```

# DSA-08 — nph-tooltip, the help balloon

## Goal
The `nph-tooltip` exists in `src/components/nph-tooltip/`, with a spec, tests and
stories, in the contract accepted in Figma: text only, up to two lines, opened only
by activating the `info` trigger of the `nph-label`.

## How it is proved
**`figma-docs-accepted`** — the `nph-tooltip` frame (`1237:5`) of the Figma
file `DS-IA-NEPHOS 5.0` was accepted by Indiane on 01-10-2026, with the Figma UX QA
and the text audit approved. The evidence names the frame and declares that there
is no COMPONENT_SET: the component is single (`1237:3`).

**`review-and-merge`** — component, CSS, tests, stories, spec, the technical
decision P65 and the `design.md` rules that cite the tooltip pass the proof
commands, are reviewed by `maurocsjr` and merged into `v/5.0.0`. The
evidence records branch, commit, PR, command and result.

## What this task does not do
It does not change the `nph-label`: the trigger, the focus and the opening of the
balloon belong to DSA-04. It does not create other uses of the balloon, does not
open on hover and does not truncate text longer than two lines. It does not change
Figma.

## Sources
- `design.md`
- `docs/decisoes-tecnicas.md`
- `fichas/_modelo.md`
- `src/tokens/generated/tokens.css`
- `docs/operacao/README.md`
- `GOVERNANCA.md`, `AGENTS.md`, `CLAUDE.md`
- Figma `DS-IA-NEPHOS 5.0`, frame `1237:5` and component `1237:3`
- WORK BRAIN — `02 PROJETOS/DS-Agentico/Registro de decisões — Nephos.md`, L11

## Why it is `done`
PR #51 brought the component, the tests, the stories, the canonical spec
`fichas/nph-tooltip.md` with the Metadata, the technical decision P65 and the
`design.md` rules. `maurocsjr` approved and merged it on 05-10-2026 (`d4ff326`). The
evidence for the `review-and-merge` gate was recorded on 06-10-2026.
