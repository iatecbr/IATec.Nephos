# Operação — tarefas, contextos e evidências

Esta nota é o contrato da estrutura operacional do Nephos. Ela existe só em
`pt-BR`: é instrução interna para quem mantém o repositório, não documentação de
uso. Ver [`../i18n.md`](../i18n.md).

> **Estrutura vazia, de propósito.** `tarefas/`, `contextos/` e `evidencias/`
> nascem sem nenhum conteúdo real. A migração do trabalho vivo é o marco
> seguinte, com tabela de reconciliação. Enquanto isso não acontece, a consulta
> responde uma fila vazia — e esse é o resultado correto.

## Para que serve

Um agente que abre o repositório precisa responder três perguntas sem depender da
memória de uma sessão: **o que está aberto, o que é seguro fazer agora, e o que
prova que algo terminou.** Estes três diretórios respondem as três, e o
verificador impede que a resposta seja plausível e falsa.

```bash
npm run test:operacao                            # valida a árvore
node scripts/verificar-operacao.mjs --proxima    # valida e mostra a fila
node scripts/verificar-operacao.mjs --exemplos   # autoteste sobre os fixtures
```

A consulta é uma bandeira do mesmo binário, e não um comando novo: um comando por
etapa é a esteira paralela que o plano proíbe.

## As duas metades de cada arquivo

Tarefa, contexto e evidência têm a mesma forma: um **bloco JSON cercado**, o
primeiro do arquivo, seguido de prosa em Markdown. O JSON dá os valores, que a
máquina lê sem interpretar texto; o Markdown dá o critério, que a pessoa lê.

O formato é JSON e não YAML porque nenhum script deste repositório lê YAML, e
adotar YAML custaria uma dependência nova. O `JSON.parse` já vem no Node.

## 1. Tarefa

`tarefas/<ID>.md`. **O nome do arquivo é o `id`** — assim duplicata é impossível
por construção.

O identificador casa `^[A-Z][A-Z0-9]{1,3}-[A-Z0-9]{1,6}$`, que aceita os IDs já
usados no projeto (`DSA-01`, `F4-T01`, `PE-01`, `PI-05`, `PF-15`, `PO-001`).
Preservar o ID de origem é o que mantém o elo com o registro anterior sem copiar
conteúdo.

```json
{
  "id": "F4-T01",
  "objetivo": "Uma frase: o que a tarefa entrega.",
  "fase": "F4",
  "ordem_aprovada": 30,
  "responsavel": "claude-codigo",
  "estado": "bloqueada",
  "peca": "nph-button",
  "dependencias": ["DSA-01"],
  "gates": [
    {
      "id": "figma-aprovado",
      "descricao": "Aprovacao visual no frame do componente.",
      "comando": null,
      "evidencia": null,
      "resultado": "pendente",
      "verificado_em": null,
      "verificado_por": null
    }
  ],
  "bloqueios": [
    {
      "id": "B1",
      "o_que_trava": "O que impede seguir.",
      "dono": "indiane",
      "o_que_resolve": "O que fecha o bloqueio.",
      "aberto_em": "2026-09-02"
    }
  ],
  "decisoes_pendentes": [],
  "evidencias": [],
  "referencias_de_decisao": ["docs/decisoes-tecnicas.md#p62"],
  "origem_externa": null,
  "revisao_git": { "branch": null, "commit": null, "pr": null },
  "contexto": null,
  "atualizado_em": "2026-09-02"
}
```

**O schema é fechado:** chave de topo fora desta lista é erro, não uma chave
ignorada.

| Campo | Tipo | Regra |
|---|---|---|
| `id` | string | casa o padrão e o nome do arquivo |
| `objetivo` | string | uma frase; o que a tarefa entrega |
| `fase` | `F0` a `F7` | a fase do plano de fases |
| `ordem_aprovada` | inteiro ≥ 1 | único entre as tarefas não `concluida` |
| `responsavel` | enum | `indiane`, `claude-codigo`, `claude-figma`, `copilot`, `elvys` |
| `estado` | enum | os seis abaixo |
| `peca` | string ou `null` | quando preenchido, exige `fichas/<peca>.md` |
| `dependencias` | lista de IDs | pode ser vazia |
| `gates` | lista de objetos | ao menos um, cada um com `id`, `descricao` e `resultado` |
| `bloqueios` | lista de objetos | pode ser vazia |
| `decisoes_pendentes` | lista de objetos | pode ser vazia |
| `evidencias` | lista de caminhos | a partir da raiz do repositório |
| `referencias_de_decisao` | lista de strings | pode ser vazia |
| `origem_externa` | objeto ou `null` | ver §4 |
| `revisao_git` | objeto | `branch`, `commit`, `pr`; cada um string ou `null` |
| `contexto` | caminho ou `null` | `docs/operacao/contextos/<ID>.md` |
| `atualizado_em` | `AAAA-MM-DD` | — |

Abaixo do bloco, quatro seções fixas — as mesmas em toda tarefa:

```markdown
# <ID> — <título curto>

## Objetivo
O que existe no fim, em uma frase, e como se percebe que existe.

## Como se prova
Um parágrafo por gate: o comando ou a observação, e o que conta como passar.

## O que esta tarefa não faz
O limite. É a seção que impede o escopo crescer no meio da execução.

## Fontes
Os caminhos que a execução abre — e só eles.
```

## 2. Os seis estados, e o que cada um exige

| Estado | Só é válido quando |
|---|---|
| `pronta` | **todas** as dependências estão `concluida` |
| `em-andamento` | existe `contextos/<ID>.md`, com `worktree` e `sha_inicial` |
| `aguardando-decisao` | há ao menos uma decisão pendente, com `pergunta` e `quem_decide` |
| `bloqueada` | há ao menos um bloqueio, com `dono` e `o_que_resolve` |
| `em-revisao` | `revisao_git.pr` está preenchido |
| `concluida` | **todo** gate `passou`, com evidência que existe em disco, `verificado_em` e `verificado_por` — e **sem** arquivo de contexto |

Estado que mente é erro, não descuido. O verificador não aceita a palavra
`concluida`: ele abre o arquivo de evidência.

## 3. A ordem da próxima atividade

**Elegível é só tarefa em `pronta`.** Como `pronta` já exige todas as
dependências `concluida`, elegibilidade e dependência são o mesmo teste.

Entre as elegíveis, nesta ordem exata:

1. `ordem_aprovada` crescente — a ordem aprovada vem primeiro, sempre;
2. `fase` crescente — `F0` antes de `F7`;
3. número de tarefas que dependem dela, decrescente — desempata pela que destrava mais;
4. `id` em ordem alfabética — o desempate final, que garante ordem total.

O critério 4 existe para que **nunca** haja empate: duas execuções sobre a mesma
árvore devolvem a mesma saída, byte a byte.

A resposta não é só o nome da tarefa. É a fila ordenada mais a tabela de
exclusão, com o motivo de cada uma que ficou fora.

**Se a validação falhar, `--proxima` não responde.** Devolve os erros e sai com
1. Fila calculada sobre árvore inválida é pior que fila nenhuma.

## 4. Origem externa e sanitização

Figma, Slack, Fireflies, Jira, Linear, Notion e afins podem originar informação.
Nenhum deles vira fonte vigente sozinho. `origem_externa` é `null` ou:

```json
{
  "classificacao": "interna-permitida",
  "url_ou_id": "<URL ou ID do sistema de origem>",
  "data": "2026-08-17",
  "autoria": "<quem registrou>",
  "trecho": "<o registro tecnico minimo, ja sanitizado>",
  "decisao_convertida": "<o requisito ou a decisao que saiu dali>"
}
```

| Classificação | O que o verificador cobra |
|---|---|
| `publica` | exige `url_ou_id` e `data` |
| `interna-permitida` | exige `url_ou_id`, `data`, `autoria` e `decisao_convertida` |
| `interna-restrita` | **reprova se houver `trecho`**; a tarefa tem de estar `bloqueada` ou `aguardando-decisao` |
| `desconhecida` | idem |

Origem restrita ou desconhecida **não é copiada**: vira pendência para quem
decide indicar a política ou a pessoa responsável.

**Varredura de segredo.** Em `tarefas/`, `contextos/` e `evidencias/`, o
verificador reprova diante de padrão de token pessoal do GitHub, credencial de
registro npm, token do Font Awesome com valor, e delimitador de chave privada.
A regra que isso automatiza já estava escrita: a configuração local de credencial
fica fora do Git, e não se lê, expõe, adiciona ou versiona.

## 5. Evidência

`evidencias/<ID-da-tarefa>/<gate>-<AAAA-MM-DD>.md`, com o mesmo bloco de máquina
no topo e a saída colada abaixo, sem edição:

```json
{
  "tarefa": "<ID>",
  "gate": "<id do gate>",
  "data": "2026-09-02",
  "responsavel": "claude-codigo",
  "comando": "npm run test:operacao",
  "codigo_de_saida": 0,
  "sha": "<SHA da revisao>",
  "origem_externa": null
}
```

O caminho declarado em `evidencias[]` e em `gates[].evidencia` é **a partir da
raiz do repositório** e tem de existir em disco; o campo `tarefa` do arquivo tem
de bater com o ID que o referencia. Ponteiro que aponta para o vazio não dá erro
sozinho — só deixa de funcionar. Por isso o verificador abre o arquivo.

## 6. Contexto curto

`contextos/<ID>.md`. Um por tarefa, ligado a um worktree, **reescrito a cada
passagem**. Ele não acumula diário de conversa.

```json
{
  "tarefa": "<ID>",
  "worktree": "<caminho do worktree>",
  "sha_inicial": "<SHA>",
  "sha_final": null
}
```

Abaixo do bloco, oito seções fixas: objetivo desta passagem, fontes abertas,
alterações, comandos executados, resultado, evidência, bloqueio e próximo
comando.

**O contexto não decide.** As chaves `estado`, `fase`, `ordem_aprovada`,
`prioridade`, `escopo` e `decisao` são proibidas nele — a única forma de cobrar a
regra é proibir a chave, porque confiar em quem escreve não é verificação. O
conjunto de chaves é fechado nas quatro acima.

**Teto de 60 linhas.** Contexto que cresce virou diário, e diário é o handoff
outra vez. O número é alarme, não medida exata.

Ao concluir a tarefa, o contexto sai da área ativa. O Git preserva o histórico.

## 7. A ficha é a fonte; a Metadata deriva dela

A ficha do componente é canônica em `fichas/<nome>.md`, com o gabarito em
`fichas/_modelo.md`. O Storybook apresenta essa ficha numa superfície de
Metadata **derivada dela** — a Metadata não substitui a ficha nem o código.

Por isso o verificador reprova `meta.ts` e `metadata.ts` dentro de
`src/components/`: um segundo contrato ao lado do componente é exatamente o
ponteiro que quebra em silêncio. A regra vale para esses dois nomes de arquivo, e
não proíbe stories nem variáveis chamadas `meta`.

**Como a Metadata lê a ficha ainda não está decidido** — build ou execução — e
essa decisão não pertence a esta etapa.

## 8. As 29 regras do verificador

Cada erro sai com o código, o caminho e a mensagem.

**Estrutura** · `V01` nome do arquivo igual ao `id` · `V02` `id` casa o padrão e é
único · `V03` o primeiro bloco JSON existe, faz parse, e nenhuma chave de topo
está fora do schema · `V04` campo obrigatório presente e não vazio

**Estado** · `V05` `estado` é um dos seis · `V06` `concluida` com todo gate
`passou` e evidência existente · `V07` `bloqueada` com bloqueio aberto, `dono` e
`o_que_resolve` · `V08` `aguardando-decisao` com `pergunta` e `quem_decide` ·
`V09` `pronta` com todas as dependências `concluida` · `V10` `em-revisao` com
`revisao_git.pr`

**Dependências** · `V11` todo ID citado existe · `V12` sem ciclo ·
`V13` sem autodependência

**Gates e evidências** · `V14` gate com `id`, `descricao` e `resultado` ·
`V15` gate `passou` com `evidencia`, `verificado_em` e `verificado_por` ·
`V16` o caminho da evidência existe em disco · `V17` o campo `tarefa` da
evidência bate com o ID

**Origem externa** · `V18` classificação é uma das quatro · `V19` restrita ou
desconhecida sem `trecho`, e a tarefa em `bloqueada` ou `aguardando-decisao` ·
`V20` permitida com os quatro campos · `V21` varredura de segredo

**Contexto** · `V22` o contexto aponta para tarefa existente · `V23` conjunto de
chaves fechado, sem as seis proibidas · `V24` no máximo 60 linhas ·
`V25` `concluida` sem contexto · `V26` `em-andamento` com contexto, `worktree` e
`sha_inicial`

**Contrato de metadados** · `V27` nenhum `meta.ts` ou `metadata.ts` em
`src/components/` · `V28` `peca` preenchida exige `fichas/<peca>.md`

**Fila** · `V29` `ordem_aprovada` inteiro ≥ 1, único entre as não `concluida`

## 9. Os exemplos

Os fixtures do verificador vivem em `scripts/fixtures/operacao/`, **fora desta
árvore**. Eles são entradas de teste, inclusive inválidas de propósito, e ficar
fora daqui é o que impede um exemplo inválido de entrar na fila real.

`node scripts/verificar-operacao.mjs --exemplos` roda a árvore de fixtures
inteira e exige que cada caso inválido falhe **pelo código previsto**. Não basta
falhar: falhar pelo motivo errado é validação que não valida.

## 10. O que esta estrutura não faz

- **Não guarda estado migrado.** Isso é o marco seguinte.
- **Não implementa a superfície de Metadata.** Fixa o contrato e a proibição.
- **Não substitui o registro de decisões.** Decisão técnica vive em
  `docs/decisoes-tecnicas.md`; a tarefa só aponta para ela.
- **Não acumula histórico.** O contexto é reescrito; o Git guarda o passado.
