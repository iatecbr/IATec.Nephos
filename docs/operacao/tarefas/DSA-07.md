```json
{
  "id": "DSA-07",
  "goal": "Record the code language convention and migrate the versioned code to it, without changing behavior.",
  "phase": "F0",
  "approved_order": 100,
  "owner": "claude-code",
  "state": "done",
  "piece": null,
  "dependencies": [],
  "gates": [
    {
      "id": "convention-recorded",
      "description": "P64 exists in docs/decisoes-tecnicas.md with the decided scope, the rule is in AGENTS.md and the technical review was recorded.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-07/convencao-registrada-2026-10-06.md",
      "result": "passed",
      "verified_at": "2026-10-06",
      "verified_by": "claude-code"
    },
    {
      "id": "migration-without-behavior-change",
      "description": "In each migration PR, the output (stdout, stderr and exit code) of the scripts is identical before and after, the generated artifacts do not change content, no new file appears and the test suite exits 0. Covers scripts, src, stories and .storybook.",
      "command": "npm run build:tokens && node scripts/verificar-operacao.mjs --gerar-metadata && git diff --quiet && node -e \"process.exit(require('child_process').execSync('git ls-files --others --exclude-standard').length?1:0)\" && npm run typecheck && npm test && npm run test:tokens && npm run test:i18n && npm run test:operacao && node scripts/verificar-operacao.mjs --exemplos && npm run build-storybook",
      "evidence": "docs/operacao/evidencias/DSA-07/migracao-sem-mudanca-de-comportamento-2026-10-06.md",
      "result": "passed",
      "verified_at": "2026-10-06",
      "verified_by": "claude-code"
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "docs/operacao/evidencias/DSA-07/convencao-registrada-2026-10-06.md",
    "docs/operacao/evidencias/DSA-07/migracao-sem-mudanca-de-comportamento-2026-10-06.md"
  ],
  "decision_refs": [
    "docs/decisoes-tecnicas.md#p64"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://github.com/iatecbr/IATec.Nephos/pull/41",
    "date": "2026-09-28",
    "author": "maurocsjr",
    "excerpt": null,
    "converted_decision": "In the approved review of PR #41, maurocsjr noted that code should follow the English standard; on 28-09-2026 Indiane decided to handle the convention in a task of its own and adopt: code names in English, comments and messages in PT-BR, across all versioned code; phase F0 and order 100. The blocker on the merge of PR #41 was lifted in a30be89."
  },
  "git_review": {
    "branch": "chore/p64-nomes-codigo",
    "commit": "5c719c8",
    "pr": "49"
  },
  "context": null,
  "updated_at": "2026-10-06"
}
```

# DSA-07 — code language convention

## Goal

The repository has a written rule about the code language, and the versioned code
follows it. You can tell because P64 exists, `AGENTS.md` cites the rule and the
test suite passes the same before and after the migration.

## How it is proved

**`convention-recorded`** — P64 is in `docs/decisoes-tecnicas.md` and the technical
review is recorded in it, as in the others. `AGENTS.md` carries the rule.

**`migration-without-behavior-change`** — in each PR, the output of the scripts
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
