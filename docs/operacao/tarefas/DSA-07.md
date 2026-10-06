```json
{
  "id": "DSA-07",
  "objetivo": "Record the code language convention and migrate the versioned code to it, without changing behavior.",
  "fase": "F0",
  "ordem_aprovada": 100,
  "responsavel": "claude-codigo",
  "estado": "concluida",
  "peca": null,
  "dependencias": [],
  "gates": [
    {
      "id": "convencao-registrada",
      "descricao": "P64 exists in docs/decisoes-tecnicas.md with the decided scope, the rule is in AGENTS.md and the technical review was recorded.",
      "comando": null,
      "evidencia": "docs/operacao/evidencias/DSA-07/convencao-registrada-2026-10-06.md",
      "resultado": "passou",
      "verificado_em": "2026-10-06",
      "verificado_por": "claude-codigo"
    },
    {
      "id": "migracao-sem-mudanca-de-comportamento",
      "descricao": "In each migration PR, the output (stdout, stderr and exit code) of the scripts is identical before and after, the generated artifacts do not change content, no new file appears and the test suite exits 0. Covers scripts, src, stories and .storybook.",
      "comando": "npm run build:tokens && node scripts/verificar-operacao.mjs --gerar-metadata && git diff --quiet && node -e \"process.exit(require('child_process').execSync('git ls-files --others --exclude-standard').length?1:0)\" && npm run typecheck && npm test && npm run test:tokens && npm run test:i18n && npm run test:operacao && node scripts/verificar-operacao.mjs --exemplos && npm run build-storybook",
      "evidencia": "docs/operacao/evidencias/DSA-07/migracao-sem-mudanca-de-comportamento-2026-10-06.md",
      "resultado": "passou",
      "verificado_em": "2026-10-06",
      "verificado_por": "claude-codigo"
    }
  ],
  "bloqueios": [],
  "decisoes_pendentes": [],
  "evidencias": [
    "docs/operacao/evidencias/DSA-07/convencao-registrada-2026-10-06.md",
    "docs/operacao/evidencias/DSA-07/migracao-sem-mudanca-de-comportamento-2026-10-06.md"
  ],
  "referencias_de_decisao": [
    "docs/decisoes-tecnicas.md#p64"
  ],
  "origem_externa": {
    "classificacao": "interna-permitida",
    "url_ou_id": "https://github.com/iatecbr/IATec.Nephos/pull/41",
    "data": "2026-09-28",
    "autoria": "maurocsjr",
    "trecho": null,
    "decisao_convertida": "In the approved review of PR #41, maurocsjr noted that code should follow the English standard; on 28-09-2026 Indiane decided to handle the convention in a task of its own and adopt: code names in English, comments and messages in PT-BR, across all versioned code; phase F0 and order 100. The blocker on the merge of PR #41 was lifted in a30be89."
  },
  "revisao_git": {
    "branch": "chore/p64-nomes-codigo",
    "commit": "5c719c8",
    "pr": "49"
  },
  "contexto": null,
  "atualizado_em": "2026-10-06"
}
```

# DSA-07 — code language convention

## Goal

The repository has a written rule about the code language, and the versioned code
follows it. You can tell because P64 exists, `AGENTS.md` cites the rule and the
test suite passes the same before and after the migration.

## How it is proved

**`convencao-registrada`** — P64 is in `docs/decisoes-tecnicas.md` and the technical
review is recorded in it, as in the others. `AGENTS.md` carries the rule.

**`migracao-sem-mudanca-de-comportamento`** — in each PR, the output of the scripts
is compared before and after and must be identical, and the gate command exits 0.
The file judge is an empty `git diff` and no untracked file: with `core.autocrlf`,
`git status` flags `tokens.css` after the build without a content change.

## What this task does not do

- It does not change a data key, a command-line flag, an already cited file name or
  a public name.
- It does not change behavior or message text.
- It does not rewrite historical records.

## Sources

- `docs/decisoes-tecnicas.md` — P64
- `AGENTS.md` — Mandatory rules
- PR #41 — comment by `maurocsjr`
- PR #42 — first migration PR (`scripts/`)
- PR #49 — migration of `src/`, `stories/` and `.storybook/`, amendment of P64 and
  `npm run test:naming`; merged on 05-10-2026 (`183ff01`)
