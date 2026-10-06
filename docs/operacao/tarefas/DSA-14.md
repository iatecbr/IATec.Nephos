```json
{
  "id": "DSA-14",
  "objetivo": "Publish the Metadata of each piece in English, while it remains derived from the spec, so that AI agents and consumers read a contract in a single language.",
  "fase": "F0",
  "ordem_aprovada": 140,
  "responsavel": "claude-codigo",
  "estado": "em-revisao",
  "peca": null,
  "dependencias": [],
  "gates": [
    {
      "id": "metadata-em-ingles",
      "descricao": "The running text of all Metadata in src/shared/metadata/ is in English, and the verifier confirms that it remains derived from the current spec (V32). Keys and single-word contract values follow DSA-15.",
      "comando": "node scripts/verificar-operacao.mjs",
      "evidencia": "docs/operacao/evidencias/DSA-14/metadata-em-ingles-2026-10-06.md",
      "resultado": "passou",
      "verificado_em": "2026-10-06",
      "verificado_por": "claude-codigo"
    },
    {
      "id": "revisao-e-merge",
      "descricao": "Generator, specs or technical decision that change reviewed by maurocsjr and merged into v/5.0.0.",
      "comando": null,
      "evidencia": null,
      "resultado": "pendente",
      "verificado_em": null,
      "verificado_por": null
    }
  ],
  "bloqueios": [],
  "decisoes_pendentes": [],
  "evidencias": ["docs/operacao/evidencias/DSA-14/metadata-em-ingles-2026-10-06.md"],
  "referencias_de_decisao": [
    "docs/decisoes-tecnicas.md#p63",
    "docs/decisoes-tecnicas.md#p64",
    "PR #56, review by maurocsjr on 2026-10-06: Metadata for AI in English, if there are not three languages",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-06.md, Metadata in English becomes a task of its own",
    "Decision by Indiane on 2026-10-06: path (a), the spec YAML is written in English and the Metadata remains an exact copy (P63 intact)"
  ],
  "origem_externa": null,
  "revisao_git": { "branch": "docs/fichas-ingles-dsa14", "commit": "f496e4e96ec37c2cce8d9e1dfc8e96851e61686f", "pr": "62" },
  "contexto": null,
  "atualizado_em": "2026-10-06"
}
```

# DSA-14 — Metadata in English

## Goal
The Metadata of every current piece, in `src/shared/metadata/<peca>.json`, comes out
with its running text in English, and remains generated from the spec by
`node scripts/verificar-operacao.mjs --gerar-metadata`. The keys and the
single-word contract values follow `DSA-15`.

## Path decided
Under P63, the Metadata is an exact copy of the spec's YAML. On 06-10-2026
Indiane chose path (a): the spec YAML is written in English and the Metadata
remains an exact copy (P63 intact). The language amendment of the same day to
P64 leaves the YAML keys, and the single-word contract values, in Portuguese
until `DSA-15`, which migrates them last. Order 140 does not set priority.

## How it is proved
**`metadata-em-ingles`** — `node scripts/verificar-operacao.mjs` exits 0, with
`V32` checking that each Metadata matches the current spec, and no Metadata
carries running text in Portuguese.

**`revisao-e-merge`** — whatever changes (generator, specs, technical decision)
passes the proof commands, is reviewed by `maurocsjr` and merged into `v/5.0.0`.

## What this task does not do
It does not change the content of the specs, only the language. It does not create
the Metadata tab in Storybook or the query server, which are out of scope of P63.
It does not change the stories, which follow the 06/10/2026 amendment to P64.

## Sources
- `docs/decisoes-tecnicas.md` — P63 and P64
- `scripts/verificar-operacao.mjs` and `scripts/spec-lib.mjs`
- `src/shared/metadata/`
- `fichas/` and `fichas/_modelo.md`
