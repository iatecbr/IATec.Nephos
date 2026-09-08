# Blocos — onde ficam e como se ligam

Este diretório guarda as fichas de **bloco**: `fichas/blocos/<nome>.md`, um arquivo por
bloco, como o [`design.md`](../../design.md) declara na §9.

> **Vazio de propósito.** Nenhum bloco está documentado aqui, e isso é o resultado
> correto. O que existe hoje é a convenção; o primeiro bloco entra quando a restrição de
> origem, abaixo, for cumprida.

## 1. O gabarito é o mesmo das fichas de componente

Copie de [`fichas/_modelo.md`](../_modelo.md). **Bloco não tem gabarito próprio** — a §5
do modelo é explícita: *"Mesmo gabarito — eles não ganham estrutura própria"*. São as
mesmas duas metades, as mesmas nove seções e as mesmas seis regras de escrita.

Muda o campo `nivel`, que passa a `bloco`, e o campo `peca`, que recebe o **nome do
bloco** — sem o prefixo `nph-`, que é dos componentes.

Campo que não se aplica recebe `nao_se_aplica`; campo ainda não decidido recebe
`pendente`. Branco o agente lê como "não existe" e inventa.

## 2. Os quatro acréscimos

Em `relacoes`, e na seção **Relações** em Markdown, a ficha de bloco acrescenta:

| Acréscimo | O que responde |
|---|---|
| `exige` | Que peças a composição **obriga**. Sem elas, não é aquela composição |
| `variacoes_aceitaveis` | O que pode mudar sem virar outra coisa |
| `contexto_de_layout` | Em que layout ela costuma aparecer |
| Objetivo da composição | Que objetivo de interface ela resolve — não a aparência |

O critério que separa componente de bloco: **componente é reutilizável em qualquer
contexto; bloco resolve uma situação específica.** Um botão é componente. "Barra de ações
de uma listagem — filtrar, exportar, criar novo" é bloco.

## 3. A convenção de ligação — e a direção dela

Contrato, ficha e Storybook se ligam **por ponteiro declarado na ficha, sempre para
fora**. É a direção que impede o ponteiro de quebrar quando um bloco novo nasce.

| Ponteiro | Onde mora | Para onde aponta |
|---|---|---|
| contrato | `fontes.design_md` | a seção do `design.md` que decide o que o bloco usa |
| decisão | `fontes.decisao` | a decisão que originou o bloco, com data e responsável |
| Storybook | `fontes.storybook` | a história que renderiza o bloco |
| evidência | `fontes.evidencia_de_uso` | onde o bloco já é usado de verdade |

**A volta não existe, e é de propósito.** O `design.md` não lista bloco por bloco: a §9
aponta para `fichas/blocos/<nome>.md` como classe. Documentar um bloco novo, por isso,
**não altera o contrato** — e um contrato que não muda a cada bloco é um contrato que não
acumula ponteiro morto.

**Entre níveis, o elo é declarado dos dois lados, e só em `relacoes`.** A ficha do
componente declara `complementa_bloco` e `aparece_em`; a ficha do bloco declara `exige` e
`contexto_de_layout`. Nenhum dos dois lados descreve o outro: cada um nomeia o outro.

**O Storybook deriva, não substitui.** A ficha é canônica; a superfície de Metadata do
Storybook é derivada dela — ver [`docs/operacao/README.md`](../../docs/operacao/README.md),
§7. A história cobre **cada variante e cada estado**, uma por variante e por estado, como
manda a §7 do `_modelo.md`.

## 4. Quando um bloco pode ser escrito aqui

**Restrição de origem, e ela não se contorna:** bloco, layout e template só são
documentados depois de **extraídos** de padrão real ou de mock aprovado. Nenhum dos três
nasce porque apareceu numa referência. A regra está no `_modelo.md`, §5, e no
[`README.md`](../../README.md), na Taxonomia.

Na prática: um bloco que ainda não existe numa tela ou num mock aprovado **não tem ficha
aqui** — nem em rascunho. Escrever antes é inventar composição.

## 5. O que esta convenção não faz

- **Não documenta bloco nenhum.** Só diz onde e como.
- **Não cria um segundo gabarito.** O `_modelo.md` continua sendo o único.
- **Não altera o `design.md`.** Ela cumpre a §9 dele.
- **Não decide como a Metadata lê a ficha** — build ou execução. Essa decisão está aberta
  e não pertence a esta etapa.
- **Não vale para layout e template.** Eles seguem a mesma regra do `_modelo.md`, e o
  diretório de cada um nasce quando o primeiro for extraído.
