```json
{
  "id": "DSA-14",
  "objetivo": "Publish the Metadata of each piece in English, while it remains derived from the spec, so that AI agents and consumers read a contract in a single language.",
  "fase": "F0",
  "ordem_aprovada": 140,
  "responsavel": "claude-codigo",
  "estado": "aguardando-decisao",
  "peca": null,
  "dependencias": [],
  "gates": [
    {
      "id": "metadata-em-ingles",
      "descricao": "All Metadata in src/shared/metadata/ has keys and text in English, and the verifier confirms that it remains derived from the current spec (V32).",
      "comando": "node scripts/verificar-operacao.mjs",
      "evidencia": null,
      "resultado": "pendente",
      "verificado_em": null,
      "verificado_por": null
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
  "decisoes_pendentes": [
    {
      "pergunta": "Which path takes the Metadata to English: (a) the YAML of the specs is written in English and the Metadata remains an exact copy (P63 intact); (b) the spec gains the English text beside the Portuguese and the generator publishes only the English; or (c) the Metadata is published in the three languages, as the review of PR #56 suggests?",
      "quem_decide": "indiane"
    }
  ],
  "evidencias": [],
  "referencias_de_decisao": [
    "docs/decisoes-tecnicas.md#p63",
    "docs/decisoes-tecnicas.md#p64",
    "PR #56, review by maurocsjr on 2026-10-06: Metadata for AI in English, if there are not three languages",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-06.md, Metadata in English becomes a task of its own"
  ],
  "origem_externa": null,
  "revisao_git": { "branch": null, "commit": null, "pr": null },
  "contexto": null,
  "atualizado_em": "2026-10-06"
}
```

# DSA-14 — Metadata in English

## Goal
The Metadata of every current piece, in `src/shared/metadata/<peca>.json`, comes out
in English, in the keys and in the text, and remains generated from the spec by
`node scripts/verificar-operacao.mjs --gerar-metadata`. Whoever reads the Metadata
finds no Portuguese.

## Why it awaits a decision
Under P63, the Metadata is an exact copy of the spec's YAML, and the YAML is in
Portuguese. Moving the Metadata to English changes the spec, the generator or P63
itself. The path is the pending decision; order 140 only puts the task in the queue
and does not set priority.

## How it is proved
**`metadata-em-ingles`** — `node scripts/verificar-operacao.mjs` exits 0, with
`V32` checking that each Metadata matches the current spec, and no Metadata
carries a key or text in Portuguese.

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
