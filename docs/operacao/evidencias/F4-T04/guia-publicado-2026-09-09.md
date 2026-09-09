```json
{
  "tarefa": "F4-T04",
  "gate": "guia-publicado",
  "data": "2026-09-09",
  "responsavel": "claude-codigo",
  "comando": "test -f docs/stories.md",
  "codigo_de_saida": 0,
  "sha": "cd5668e6ebe682cb62169a2a451755c6bd562e4c",
  "origem_externa": null
}
```

# guia-publicado — F4-T04

Saída colada, sem edição:

```text
$ test -f docs/stories.md
$ echo $?
0
```

`docs/stories.md` existe na branch `docs/f4-t04-guia-stories`, publicado pelo commit
`cd5668e`. Na baseline de onde a branch saiu ele não existia:

```text
$ git cat-file -e 20882bf:docs/stories.md
fatal: path 'docs/stories.md' exists on disk, but not in '20882bf'
$ echo $?
128
```

## O que o guia entrega

Seis grupos de regra — a ordem, o componente, o CSS, as stories, os testes, e
Storybook e repositório —, mais a §7 com as lacunas e a §8 com as divergências
abertas.

**Cada regra fecha com `Fonte:` e `Limite:`.** A Fonte aponta arquivo e trecho deste
repositório; o Limite diz até onde a regra vale e quantos componentes a sustentam.
Onde há um caso só, está escrito.

O guia foi extraído da prática de `nph-icon` e `nph-label`, os dois componentes com
código na baseline. **O piloto M5 não foi usado como fonte.**

Os nove links relativos do guia foram conferidos por comando, sobre a mesma revisão:

```text
$ cd docs && for p in i18n.md decisoes-tecnicas.md operacao/README.md ../fichas/_modelo.md ../design.md ../README.md ../GOVERNANCA.md ../AGENTS.md ../contributing.md; do test -f "$p" && echo "OK        $p" || echo "QUEBRADO  $p"; done
OK        i18n.md
OK        decisoes-tecnicas.md
OK        operacao/README.md
OK        ../fichas/_modelo.md
OK        ../design.md
OK        ../README.md
OK        ../GOVERNANCA.md
OK        ../AGENTS.md
OK        ../contributing.md
```

## O que este gate não prova

Ele prova que o guia existe, é rastreável e não inventa regra. **Não prova que a
F4-T04 terminou.** A tarefa fica `em-revisao` até o merge do PR #28, pelo mesmo
critério aplicado à F5-T01.

Também não prova a comparação Figma × Storybook: ela continua sem artefato neste
repositório, e por isso está registrada no guia como lacuna, não como regra.
