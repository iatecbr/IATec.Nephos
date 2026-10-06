```json
{
  "id": "DSA-15",
  "objetivo": "Move the Portuguese contract keys (task, context and evidence JSON, spec YAML, Metadata and token JSON) to English, last in the language migration, without breaking anyone who reads them.",
  "fase": "F0",
  "ordem_aprovada": 150,
  "responsavel": "claude-codigo",
  "estado": "aguardando-decisao",
  "peca": null,
  "dependencias": ["DSA-14"],
  "gates": [
    {
      "id": "chaves-em-ingles",
      "descricao": "Every contract key covered by the decision is in English in the schema, in the files that use it and in the scripts that read it, and the verifier, the token build and the tests pass.",
      "comando": "node scripts/verificar-operacao.mjs",
      "evidencia": null,
      "resultado": "pendente",
      "verificado_em": null,
      "verificado_por": null
    },
    {
      "id": "revisao-e-merge",
      "descricao": "Schema, scripts, specs, tokens and documentation that change are reviewed by maurocsjr and merged into v/5.0.0.",
      "comando": null,
      "evidencia": null,
      "resultado": "pendente",
      "verificado_em": null,
      "verificado_por": null
    }
  ],
  "bloqueios": [],
  "decisoes_pendentes": [
    {
      "pergunta": "Which contract keys move to English, with which name map (for example `objetivo`, `use_quando`, `modos`, `claro` and `escuro`), and in which order, given that the change touches the docs/operacao schema, the spec YAML, the generated Metadata and the token JSON at once? Does it also include the single-word values of the specs and of the Metadata (`vazio`, `nenhum`, `nulo`, `pendente`, `nao_se_aplica`, `aparencia`)?",
      "quem_decide": "indiane"
    }
  ],
  "evidencias": [],
  "referencias_de_decisao": [
    "docs/decisoes-tecnicas.md#p64",
    "docs/decisoes-tecnicas.md#p63",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-06.md, contract keys migrate last, in a separate task"
  ],
  "origem_externa": null,
  "revisao_git": { "branch": null, "commit": null, "pr": null },
  "contexto": null,
  "atualizado_em": "2026-10-06"
}
```

# DSA-15 — Contract keys in English

## Goal
The contract keys that are still in Portuguese move to English: the keys of the
task, context and evidence JSON in `docs/operacao/`, the keys of the spec YAML in
`fichas/` (and so of the Metadata in `src/shared/metadata/`), and the keys,
modes and brands of the token JSON. Whoever reads a contract finds a single
language.

## Why it awaits a decision
The language decision of 06/10/2026 moves code, specs and documentation to
English, and leaves the contract keys for last, in a task of their own. Renaming
a key breaks every reader of that contract at once, so the name map and the
order are the pending decision. Order 150 only puts the task in the queue and
does not set priority.

## How it is proved
**`chaves-em-ingles`** — `node scripts/verificar-operacao.mjs` exits 0, with the
renamed keys in the schema and in every file that uses them; `npm run
build:tokens`, `npm run test:tokens`, `npm test` and `npm run test:naming` pass.

**`revisao-e-merge`** — what changes passes the proof commands, is reviewed by
`maurocsjr` and is merged into `v/5.0.0`.

## What this task does not do
It changes only key names and, as the amendment of 06/10/2026 to P64 says, the
enum values of the task, context and evidence JSON (such as `aguardando-decisao`);
it changes no rule or behaviour. It does not
translate text, which the language migration already covers. It does not change
public names (`nph-*` tags, properties, custom properties and `data-nph-*`
attributes) unless the decision says so.

## Sources
- `docs/decisoes-tecnicas.md` — P63 and P64
- `docs/operacao/README.md`
- `scripts/verificar-operacao.mjs`, `scripts/spec-lib.mjs` and `scripts/build-tokens.mjs`
- `docs/operacao/tarefas/DSA-14.md`
