```json
{
  "tarefa": "PE-03",
  "gate": "revisao-registrada",
  "data": "2026-09-09",
  "responsavel": "claude-codigo",
  "comando": "grep -n \"Revisada e aprovada por Mauro\" docs/decisoes-tecnicas.md",
  "codigo_de_saida": 0,
  "sha": "ed7c009adf09599104bc9868fee79b1092ad63cb",
  "origem_externa": null
}
```

# PE-03 — `revisao-registrada`

The review of P62.5 is recorded in `docs/decisoes-tecnicas.md`, with date and
owner, in the same ritual as the other technical decisions.

## Who reviewed, and what each piece of evidence is

There are two distinct things, and the gate requires the second:

1. **Documentary review by Copilot**, on 09/09/2026, which checked the compatibility
   with `raio_regras` of `design.md`, the separation of the 8 radius tokens from the 92
   converted `dimension` tokens and the cost of a future change. It entered the repository
   through commit `5fa4821`.
2. **Human review by `maurocsjr`**, who approved PR #25 on 09/09/2026 and merged it
   at `ed7c009`. This is the one that fulfills the ritual — P62.1, P62.2 and P62.3 were approved
   by Elvys on 28/08/2026, and P62.5 was the only one without a recorded review.

The project Governance records that Elvys and Mauro have the same review and
approval power, by decision of Indiane on 08/09/2026; the `contributing.md` of this baseline
writes the same rule: `Elvys ou Mauro revisam e fazem o merge` (Elvys or Mauro review and merge).

## Where the record is

`docs/decisoes-tecnicas.md`, in three places, all on this branch:

- **line 24** — the summary table: `Adotada por Indiane em 28/08/2026. **Revisada e
  aprovada por Mauro em 09/09/2026, no PR #25, mergeado em ed7c009.**` (Adopted by Indiane on 28/08/2026. Reviewed and approved by Mauro on 09/09/2026, in PR #25, merged at `ed7c009`.)
- **line 357** — the `Status` of P62: `a **P62.5** ... **foi revisada e aprovada por
  Mauro em 09/09/2026**, no PR #25.` (P62.5 ... was reviewed and approved by Mauro on 09/09/2026, in PR #25.)
- **lines 525 to 529** — the `Status` of the section `### P62.5`, which separates the documentary
  review by Copilot from Mauro's approval and cites the reviewed commit and the merge.

## Command

```
grep -n "Revisada e aprovada por Mauro" docs/decisoes-tecnicas.md
```

## Output

```
24:| **P62.5** | O raio continua em `px` | 28/08/2026 | Baixo. Converter depois é uma linha no gerador, mas exige alterar `raio_regras` no `design.md` | Adotada por Indiane em 28/08/2026. **Revisada e aprovada por Mauro em 09/09/2026, no PR #25, mergeado em `ed7c009`.** Resolve a contradição de escopo da P62.4 |
525:**Revisada e aprovada por Mauro em 09/09/2026**, no PR #25, sobre o commit `5fa4821`,
```

No occurrence of `aguardando revisão de Elvys` (awaiting Elvys's review) remains in the file:

```
$ grep -rn "aguarda.*revis.*Elvys\|aguardando revis.*Elvys" docs/decisoes-tecnicas.md
$ echo $?
1
```

## Verifiable context

```
$ git log -1 --format='%h %an %ad %s' 5fa4821
5fa4821 IndianeSouza Wed Sep 9 10:44:56 2026 -0300 docs(governanca): registra contribuicao e revisao da P62.5

$ git log -1 --format='%h %an %ad %s' ed7c009
ed7c009 Mauro Jr. Wed Sep 9 11:28:45 2026 -0300 Merge pull request #25 from iatecbr/docs/pe01-pe03-contrib-p625

$ git merge-base --is-ancestor 5fa4821 origin/v/3.0.0; echo $?
0
```

The approval was checked on the PR #25 page on GitHub, with the authenticated account:
`maurocsjr approved these changes` and `maurocsjr merged commit ed7c009 into v/3.0.0`.
