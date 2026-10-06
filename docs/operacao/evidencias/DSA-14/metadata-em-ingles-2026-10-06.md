```json
{
  "tarefa": "DSA-14",
  "gate": "metadata-em-ingles",
  "data": "2026-10-06",
  "responsavel": "claude-codigo",
  "comando": "node scripts/verificar-operacao.mjs",
  "codigo_de_saida": 0,
  "sha": "63300ad927db04dc2587c8347668e39db84f4b22",
  "origem_externa": null
}
```

# DSA-14 — `metadata-em-ingles`

Path (a), decided by Indiane on 06-10-2026: the spec YAML is written in English
and the Metadata stays an exact copy of it (P63). At `63300ad` the current specs
(`nph-icon`, `nph-label`, `nph-tooltip`) carry their running text in English, and
`node scripts/verificar-operacao.mjs --gerar-metadata` regenerated their Metadata.

The keys of the YAML and of the Metadata, and the single-word contract values,
did not change: they follow `DSA-15`, as the amendment of 06/10/2026 to P64 says.
A comparison of the Metadata before and after (`63300ad~1` and `63300ad`) gives
the same list of key paths and the same single-word values for the three pieces.

## Reading

```text
$ node scripts/verificar-operacao.mjs
17 task(s) checked.
OK: schema, states, dependencies, gates, evidence, context and spec check out.
$ echo $?
0
```

From `093127a` on, `npm run test:naming` exits 0 with the `specs` group in `enforce`: no running
text in Portuguese is left in `fichas/`.
