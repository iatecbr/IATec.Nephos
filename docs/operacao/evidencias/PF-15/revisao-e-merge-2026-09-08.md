```json
{
  "tarefa": "PF-15",
  "gate": "revisao-e-merge",
  "data": "2026-09-08",
  "responsavel": "claude-codigo",
  "comando": "git merge-base --is-ancestor ec09459 origin/v/3.0.0",
  "codigo_de_saida": 0,
  "sha": "a850265445bf32d350e93b775d0c44b98a1d196b",
  "origem_externa": null
}
```

# PF-15 — `revisao-e-merge`

O PR #19 foi mergeado na `v/3.0.0`. O merge commit é `ec09459`, e ele é ancestral da
ponta atual da branch padrão.

## Comando

```
git merge-base --is-ancestor ec09459 origin/v/3.0.0
```

## Saída

Sem saída. Código de saída `0`, que é o que este comando devolve quando o primeiro
commit é ancestral do segundo.

## Contexto verificável

```
git log --oneline --merges origin/v/3.0.0 | head -3
a850265 Merge pull request #20 from iatecbr/docs/m4-migracao-operacao
ec09459 Merge pull request #19 from iatecbr/feat/pf15-pf16-pf05-tokens
f6906d6 Merge pull request #18 from iatecbr/docs/m2-lote-unificado
```
