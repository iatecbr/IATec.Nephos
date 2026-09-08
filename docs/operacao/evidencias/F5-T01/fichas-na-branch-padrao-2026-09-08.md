```json
{
  "tarefa": "F5-T01",
  "gate": "fichas-na-branch-padrao",
  "data": "2026-09-08",
  "responsavel": "claude-codigo",
  "comando": "test -d fichas",
  "codigo_de_saida": 0,
  "sha": "8b09118a662a00ee974abf982172896612d4c1b7",
  "origem_externa": null
}
```

# fichas-na-branch-padrao — F5-T01

Saída colada, sem edição:

```text
$ test -d fichas
$ echo $?
0
```

`fichas/` está na baseline: o PR #13 foi mergeado por Elvys em 01-09-2026, merge commit
`348e68e`, ancestral de `2b992fc`, que é o `origin/v/3.0.0` desta execução. O diretório
contém `_modelo.md`, `nph-icon.md`, `nph-label.md` e `nph-spinner.md`.

O gate era o único que já podia ter passado antes desta sessão. Estava `pendente` porque
faltava exatamente este arquivo: o comando e o código de saída colados.
