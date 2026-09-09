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

A revisão da P62.5 está registrada em `docs/decisoes-tecnicas.md`, com data e
responsável, no mesmo rito das demais decisões técnicas.

## Quem revisou, e o que é cada evidência

São duas coisas distintas, e o gate exige a segunda:

1. **Revisão documental pelo Copilot**, em 09/09/2026, que conferiu a compatibilidade
   com `raio_regras` do `design.md`, a separação dos 8 tokens de raio dos 92
   `dimension` convertidos e o custo de uma mudança futura. Ela entrou no repositório
   pelo commit `5fa4821`.
2. **Revisão humana por `maurocsjr`**, que aprovou o PR #25 em 09/09/2026 e o mergeou
   em `ed7c009`. É esta que cumpre o rito — a P62.1, a P62.2 e a P62.3 foram aprovadas
   por Elvys em 28/08/2026, e a P62.5 era a única sem revisão registrada.

A Governança do projeto registra que Elvys e Mauro têm o mesmo poder de revisão e
aprovação, por decisão de Indiane em 08/09/2026; o `contributing.md` desta baseline
escreve a mesma regra: "Elvys ou Mauro revisam e fazem o merge".

## Onde o registro está

`docs/decisoes-tecnicas.md`, em três lugares, todos nesta branch:

- **linha 24** — a tabela-resumo: "Adotada por Indiane em 28/08/2026. **Revisada e
  aprovada por Mauro em 09/09/2026, no PR #25, mergeado em `ed7c009`.**"
- **linha 357** — o `Status` da P62: "a **P62.5** ... **foi revisada e aprovada por
  Mauro em 09/09/2026**, no PR #25."
- **linhas 525 a 529** — o `Status` da seção `### P62.5`, que separa a revisão
  documental do Copilot da aprovação de Mauro e cita o commit revisado e o merge.

## Comando

```
grep -n "Revisada e aprovada por Mauro" docs/decisoes-tecnicas.md
```

## Saída

```
24:| **P62.5** | O raio continua em `px` | 28/08/2026 | Baixo. Converter depois é uma linha no gerador, mas exige alterar `raio_regras` no `design.md` | Adotada por Indiane em 28/08/2026. **Revisada e aprovada por Mauro em 09/09/2026, no PR #25, mergeado em `ed7c009`.** Resolve a contradição de escopo da P62.4 |
525:**Revisada e aprovada por Mauro em 09/09/2026**, no PR #25, sobre o commit `5fa4821`,
```

Nenhuma ocorrência de "aguardando revisão de Elvys" resta no arquivo:

```
$ grep -rn "aguarda.*revis.*Elvys\|aguardando revis.*Elvys" docs/decisoes-tecnicas.md
$ echo $?
1
```

## Contexto verificável

```
$ git log -1 --format='%h %an %ad %s' 5fa4821
5fa4821 IndianeSouza Wed Sep 9 10:44:56 2026 -0300 docs(governanca): registra contribuicao e revisao da P62.5

$ git log -1 --format='%h %an %ad %s' ed7c009
ed7c009 Mauro Jr. Wed Sep 9 11:28:45 2026 -0300 Merge pull request #25 from iatecbr/docs/pe01-pe03-contrib-p625

$ git merge-base --is-ancestor 5fa4821 origin/v/3.0.0; echo $?
0
```

A aprovação foi conferida na página do PR #25 no GitHub, com a conta autenticada:
"maurocsjr approved these changes" e "maurocsjr merged commit ed7c009 into v/3.0.0".
