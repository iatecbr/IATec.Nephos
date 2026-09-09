```json
{
  "tarefa": "F5-T01",
  "gate": "revisao-e-merge",
  "data": "2026-09-08",
  "responsavel": "claude-codigo",
  "comando": "git merge-base --is-ancestor 7c11fc3 origin/v/3.0.0",
  "codigo_de_saida": 0,
  "sha": "b166b238f93d7b239513f9411af37af91475b538",
  "origem_externa": null
}
```

# F5-T01 — `revisao-e-merge`

O PR #23 foi mergeado na `v/3.0.0`. O merge commit é `b166b23`, ponta da branch padrão
nesta verificação, e o commit `7c11fc3`, que encerrou a sessão de execução da F5-T01, é
ancestral dele.

## Comando

```
git merge-base --is-ancestor 7c11fc3 origin/v/3.0.0
```

## Saída

Sem saída. Código de saída `0`, que é o que este comando devolve quando o primeiro
commit é ancestral do segundo.

## Contexto verificável

```
$ git fetch --prune
$ git rev-parse origin/v/3.0.0
b166b238f93d7b239513f9411af37af91475b538

$ git log -1 --format='%h %an %ad %s' b166b23
b166b23 Mauro Jr. Tue Sep 8 16:48:58 2026 -0300 Merge pull request #23 from iatecbr/docs/m5-f5-t01-blocos

$ git log --oneline --merges origin/v/3.0.0 | head -3
b166b23 Merge pull request #23 from iatecbr/docs/m5-f5-t01-blocos
03884da Merge pull request #22 from iatecbr/docs/lote-manutencao-operacional
2b992fc Merge pull request #21 from iatecbr/docs/m5-ativacao-f5-t01
```

Os dois gates anteriores, repetidos sobre `b166b23`:

```
$ test -d fichas; echo $?
0
$ test -d fichas/blocos; echo $?
0
```
