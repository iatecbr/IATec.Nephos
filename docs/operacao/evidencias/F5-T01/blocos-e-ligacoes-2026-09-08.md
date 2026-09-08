```json
{
  "tarefa": "F5-T01",
  "gate": "blocos-e-ligacoes",
  "data": "2026-09-08",
  "responsavel": "claude-codigo",
  "comando": "test -d fichas/blocos",
  "codigo_de_saida": 0,
  "sha": "8b09118a662a00ee974abf982172896612d4c1b7",
  "origem_externa": null
}
```

# blocos-e-ligacoes — F5-T01

Saída colada, sem edição:

```text
$ test -d fichas/blocos
$ echo $?
0
```

O diretório existe e carrega a convenção em `fichas/blocos/README.md`, criada no commit
`8b09118`. A convenção cobre as quatro exigências do gate: o gabarito único
(`fichas/_modelo.md`), os quatro acréscimos em `relacoes`, a direção do ponteiro entre
contrato, ficha e Storybook, e a restrição de origem.

Os quatro links relativos do arquivo foram conferidos por comando:

```text
$ cd fichas/blocos && for p in ../../design.md ../_modelo.md ../../docs/operacao/README.md ../../README.md; do test -f "$p" && echo "OK   $p" || echo "QUEBRADO $p"; done
OK   ../../design.md
OK   ../_modelo.md
OK   ../../docs/operacao/README.md
OK   ../../README.md
```

**Nenhum bloco foi documentado.** A restrição de origem — bloco só se documenta depois de
extraído de padrão real ou de mock aprovado — segue cumprida.
