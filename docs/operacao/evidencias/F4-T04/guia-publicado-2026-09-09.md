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

# `guia-publicado` — F4-T04

Output pasted, unedited:

```text
$ test -f docs/stories.md
$ echo $?
0
```

`docs/stories.md` exists on the branch `docs/f4-t04-guia-stories`, published by commit
`cd5668e`. In the baseline the branch came from it did not exist:

```text
$ git cat-file -e 20882bf:docs/stories.md
fatal: path 'docs/stories.md' exists on disk, but not in '20882bf'
$ echo $?
128
```

## What the guide delivers

Six groups of rules — the order, the component, the CSS, the stories, the tests, and
Storybook and repository —, plus §7 with the gaps and §8 with the open divergences.

**Every rule closes with `Fonte:` and `Limite:`** (Source and Limit). The Source points to a file and excerpt of this
repository; the Limit says how far the rule holds and how many components support it.
Where there is only one case, it says so.

The guide was extracted from the practice of `nph-icon` and `nph-label`, the two components with
code in the baseline. **The pilot M5 was not used as a source.**

The guide's nine relative links were checked by command, over the same revision:

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

## What this gate does not prove

It proves that the guide exists, is traceable and does not invent rules. **It does not prove that
F4-T04 is finished.** The task stays `em-revisao` until PR #28 is merged, by the same
criterion applied to F5-T01.

It also does not prove the Figma × Storybook comparison: it still has no artifact in this repository, and
for that reason it is recorded in the guide as a gap, not as a rule.
