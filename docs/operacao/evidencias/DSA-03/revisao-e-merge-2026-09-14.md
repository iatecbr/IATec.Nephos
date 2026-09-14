```json
{
  "tarefa": "DSA-03",
  "gate": "revisao-e-merge",
  "data": "2026-09-14",
  "responsavel": "copilot",
  "comando": "git merge-base --is-ancestor fff0624e44d7679877f36a28bb03225226f4eaec origin/v/5.0.0",
  "codigo_de_saida": 0,
  "sha": "4c33737cedda4171d2f3596f6c58c2d8e00d4a77",
  "origem_externa": null
}
```

# DSA-03 — `revisao-e-merge`

A decisão I7 (`circle-info` em `solid`, `regular` como padrão) já está na
`v/5.0.0`. Não houve reimplementação nesta passagem: o código, os testes e o
Storybook vieram no PR #34; a ficha e os contratos vieram no PR #35. Os dois
foram revisados por Mauro (`maurocsjr`, `APPROVED`) e mergeados em 14-09-2026.

O PR #37 só registrou o gate `documentacao-figma-aceita`. Esta evidência fecha
o gate `revisao-e-merge` sobre o que já é ancestral da branch padrão.

## Comando

```text
git merge-base --is-ancestor fff0624e44d7679877f36a28bb03225226f4eaec origin/v/5.0.0
```

## Saída

Sem saída. Código de saída `0`, que confirma que o commit `fff0624` da I7 no
código é ancestral da ponta `4c33737` da branch padrão.

O mesmo vale para o commit de contratos `05fd0fa78bb85f84f86c90a76eb747d94aad1875`
(`codigo_de_saida` 0).

## Testes aplicáveis

Em `C:\dev\nephos-v5` no SHA `4c33737`:

```text
npm test -- src/components/nph-icon/nph-icon.test.ts src/components/nph-icon/nph-icon.demo.test.ts
```

```text
Test Files  2 passed (2)
     Tests  38 passed (38)
```

Os testes cobrem o núcleo de 93 nomes, `regular` como padrão, `solid` em cada
nome (incluindo `circle-info`) e a story `Variantes` com `circle-info` regular
versus solid.

## Contexto verificável

```text
PS> git fetch origin --prune

PS> git rev-parse origin/v/5.0.0
4c33737cedda4171d2f3596f6c58c2d8e00d4a77

PS> git log -1 --format='%h %s' origin/v/5.0.0
4c33737 Merge pull request #37 from iatecbr/docs/dsa03-documentacao-figma-aceita

PS> git merge-base --is-ancestor fff0624e44d7679877f36a28bb03225226f4eaec origin/v/5.0.0

PS> $LASTEXITCODE
0

PS> git merge-base --is-ancestor 05fd0fa78bb85f84f86c90a76eb747d94aad1875 origin/v/5.0.0

PS> $LASTEXITCODE
0
```

## PRs mergeados

| PR | Merge | Commit da entrega | Revisor |
|---|---|---|---|
| [#34](https://github.com/iatecbr/IATec.Nephos/pull/34) | `0e93f0a` (2026-09-14T14:33:01Z) | `fff0624` | `maurocsjr` APPROVED |
| [#35](https://github.com/iatecbr/IATec.Nephos/pull/35) | `9ed82e5` (2026-09-14T14:33:35Z) | `05fd0fa` | `maurocsjr` APPROVED |
