```json
{
  "tarefa": "DSA-08",
  "gate": "revisao-e-merge",
  "data": "2026-10-06",
  "responsavel": "claude-codigo",
  "comando": "git merge-base --is-ancestor 06af12539de95416ee816ca65f63298063e1bf6b origin/v/5.0.0",
  "codigo_de_saida": 0,
  "sha": "7dd370d403adc49aaad7b391e34cc5aa50730784",
  "origem_externa": null
}
```

# DSA-08 — `revisao-e-merge`

O PR #51 (`feat/dsa08-nph-tooltip`) trouxe o componente, o CSS, os testes, as
stories, a ficha canônica `fichas/nph-tooltip.md` com a Metadata, a decisão
técnica P65 e as regras do `design.md` que citam o balão. `maurocsjr` aprovou e
fez o merge em 05-10-2026, no commit `d4ff326`. O commit da entrega, `06af125`,
é ancestral da ponta da branch padrão.

## Comando

```text
git merge-base --is-ancestor 06af12539de95416ee816ca65f63298063e1bf6b origin/v/5.0.0
```

## Saída

Sem saída. Código de saída `0`: o commit `06af125` é ancestral da ponta
`7dd370d` da `v/5.0.0`.

## Testes aplicáveis

Em `C:\dev\nephos-wt-dsa04`, no SHA `7dd370d`:

```text
npm test -- src/components/nph-tooltip
```

```text
 Test Files  1 passed (1)
      Tests  15 passed (15)
```

## PR mergeado

| PR | Merge | Commit da entrega | Revisor |
|---|---|---|---|
| [#51](https://github.com/iatecbr/IATec.Nephos/pull/51) | `d4ff326` (2026-10-05T16:58:28Z) | `06af125` | `maurocsjr` APPROVED (2026-10-05T16:58:19Z) |
