```json
{
  "tarefa": "DSA-02",
  "gate": "revisao-e-merge",
  "data": "2026-09-14",
  "responsavel": "copilot",
  "comando": "git merge-base --is-ancestor 89038735f968a1abbcc629cdde02097d3041454a origin/v/5.0.0",
  "codigo_de_saida": 0,
  "sha": "8e11751e0e3fcf57f32eee4a044e8a000ba7fa15",
  "origem_externa": null
}
```

# DSA-02 — `revisao-e-merge`

O PR #33 foi revisado por Mauro (`maurocsjr`) e mergeado na `v/5.0.0` em
14-09-2026. O merge commit `8e11751` contém o commit `8903873` que registrou
os usos de `status/error` e `space/inline-tight`.

## Comando

```text
git merge-base --is-ancestor 89038735f968a1abbcc629cdde02097d3041454a origin/v/5.0.0
```

## Saída

Sem saída. Código de saída `0`, que confirma que o commit da DSA-02 é
ancestral da ponta `8e11751` da branch padrão.

## Contexto verificável

```text
PS> git fetch origin --prune

PS> git rev-parse origin/v/5.0.0
8e11751e0e3fcf57f32eee4a044e8a000ba7fa15

PS> git log -1 --format='%h %s' origin/v/5.0.0
8e11751 Merge pull request #33 from iatecbr/docs/dsa02-status-error-inline-tight

PS> git merge-base --is-ancestor 89038735f968a1abbcc629cdde02097d3041454a origin/v/5.0.0

PS> $LASTEXITCODE
0
```
