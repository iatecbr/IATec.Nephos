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

# `blocos-e-ligacoes` — F5-T01

Output pasted, unedited:

```text
$ test -d fichas/blocos
$ echo $?
0
```

The directory exists and carries the convention in `fichas/blocos/README.md`, created in commit
`8b09118`. The convention covers the gate's four requirements: the single template
(`fichas/_modelo.md`), the four additions to `relacoes`, the direction of the pointer between
contract, spec sheet and Storybook, and the origin restriction.

The file's four relative links were checked by command:

```text
$ cd fichas/blocos && for p in ../../design.md ../_modelo.md ../../docs/operacao/README.md ../../README.md; do test -f "$p" && echo "OK   $p" || echo "QUEBRADO $p"; done
OK   ../../design.md
OK   ../_modelo.md
OK   ../../docs/operacao/README.md
OK   ../../README.md
```

**No block was documented.** The origin restriction — a block is only documented after being
extracted from a real pattern or an approved mock — is still met.
