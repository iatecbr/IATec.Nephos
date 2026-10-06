```json
{
  "id": "DSA-03",
  "objetivo": "Align the nph-icon contracts and artwork with decision I7 about circle-info in the solid style.",
  "fase": "F4",
  "ordem_aprovada": 80,
  "responsavel": "claude-codigo",
  "estado": "concluida",
  "peca": "nph-icon",
  "dependencias": [],
  "gates": [
    {
      "id": "documentacao-figma-aceita",
      "descricao": "The nph-icon documentation in Figma was accepted by Indiane and recorded as evidence.",
      "comando": null,
      "evidencia": "docs/operacao/evidencias/DSA-03/documentacao-figma-aceita-2026-09-14.md",
      "resultado": "passou",
      "verificado_em": "2026-09-14",
      "verificado_por": "indiane"
    },
    {
      "id": "revisao-e-merge",
      "descricao": "PRs #34 and #35, approved by maurocsjr, already delivered I7 into v/5.0.0; commit fff0624 is an ancestor of merge 4c33737.",
      "comando": "git merge-base --is-ancestor fff0624e44d7679877f36a28bb03225226f4eaec origin/v/5.0.0",
      "evidencia": "docs/operacao/evidencias/DSA-03/revisao-e-merge-2026-09-14.md",
      "resultado": "passou",
      "verificado_em": "2026-09-14",
      "verificado_por": "copilot"
    }
  ],
  "bloqueios": [],
  "decisoes_pendentes": [],
  "evidencias": [
    "docs/operacao/evidencias/DSA-03/documentacao-figma-aceita-2026-09-14.md",
    "docs/operacao/evidencias/DSA-03/revisao-e-merge-2026-09-14.md"
  ],
  "referencias_de_decisao": [],
  "origem_externa": {
    "classificacao": "interna-permitida",
    "url_ou_id": "WORK BRAIN — 02 PROJETOS/DS-Agentico/Registro de decisões — Nephos.md, I7",
    "data": "2026-09-08",
    "autoria": "indiane",
    "trecho": null,
    "decisao_convertida": "Decision I7 allows circle-info in the solid style; on 09-09-2026 Indiane authorized migrating DSA-03 to docs/operacao/tarefas/ as a comparable M6 cycle."
  },
  "revisao_git": {
    "branch": "feat/nph-icon-acervo-completo",
    "commit": "fff0624e44d7679877f36a28bb03225226f4eaec",
    "pr": "34"
  },
  "contexto": null,
  "atualizado_em": "2026-09-14"
}
```

# DSA-03 — align nph-icon contracts with I7

## Goal
The `nph-icon` spec, technical contracts, versioned artwork, tests and Storybook
record decision I7: `regular` remains the default, and `circle-info` may use
`solid` for the approved reason.

## How it is proved
**`documentacao-figma-aceita`** — the `nph-icon` documentation in the Figma file
`DS-IA-NEPHOS 5.0` is accepted by Indiane, and the acceptance goes into
`docs/operacao/evidencias/DSA-03/`, with the frame URL or ID, the date, the
authorship and the converted decision, naming the frame and the COMPONENT_SET.
While this gate has not passed, the task stays `bloqueada` and no component code
starts.

**`revisao-e-merge`** — spec, `design.md`, `docs/decisoes-tecnicas.md`, artwork,
tests, Storybook and their dictionaries pass the applicable tests, are reviewed and
merged into the default branch. The evidence must record branch, commit, PR, the
command run and the result.

## What this task does not do
It does not release `solid` for other names, does not change the `nph-label` API
and does not start `nph-field`. Updating the icon Foundation in the WORK BRAIN is
left to Copilot after the verifiable delivery. Any new name or state requires a
coherent reason and a recorded decision.

## Sources
- `fichas/nph-icon.md`
- `src/components/nph-icon/`
- `.storybook/i18n/pt-BR.js`, `.storybook/i18n/en.js`, `.storybook/i18n/es.js`
- `design.md`
- `docs/decisoes-tecnicas.md`
- `docs/operacao/README.md`
- `GOVERNANCA.md`, `AGENTS.md`, `CLAUDE.md`
- WORK BRAIN — `02 PROJETOS/DS-Agentico/Registro de decisões — Nephos.md`, I7

## Why it is `concluida`
PRs #34 (code, tests and Storybook, merge `0e93f0a`) and #35 (spec and
contracts, merge `9ed82e5`) were reviewed by Mauro (`maurocsjr`) and
merged into `v/5.0.0` on 14-09-2026. Commit `fff0624` is an ancestor of the tip
`4c33737`. The `nph-icon` tests passed (38/38). Both gates are
`passou`, with local evidence, date and owner, and there is no active context.
