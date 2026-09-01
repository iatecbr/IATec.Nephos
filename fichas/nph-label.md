---
peca: nph-label
nivel: componente
status: vigente
titulo: "nph-label"
tipo: ficha de componente
criado: 2026-08-31
atualizado: 2026-08-31
resolve: >-
  Nomeia um controle de formulário de forma visível e acessível. O rótulo é só
  um texto: não carrega layout, estado, ajuda nem mensagem de erro.
use_quando:
  - "Um controle de formulário precisa de nome visível, sozinho ou dentro de um nph-field."
nao_use_quando:
  - "É frase com verbo e ponto final — isso é `text/body-md`."
  - "Abre uma seção ou grupo — isso é `text/heading-sm`."
  - "É ênfase dentro de um parágrafo — isso é `<strong>`."

api:
  text:
    tipo: string
    obrigatoria: true
    padrao: "vazio"
    reflete: false
    restricao: >-
      Carrega o conteúdo do rótulo, já localizado pela aplicação consumidora.
      Existe como propriedade porque, sem Shadow DOM, não há `slot`.
  required:
    tipo: boolean
    obrigatoria: false
    padrao: false
    reflete: true
    restricao: >-
      Acrescenta o asterisco ao fim do texto. O asterisco é decorativo
      (`aria-hidden`): a obrigatoriedade precisa ser comunicada pelo controle.
  for:
    tipo: string
    obrigatoria: false
    padrao: nulo
    reflete: true
    restricao: >-
      `id` do controle que este rótulo nomeia. Espelha o atributo nativo e é o
      mecanismo da associação — a razão de o componente não usar Shadow DOM.
  slots: nenhum
  eventos: nenhum
  cor: >-
    Não é propriedade. O texto é `color/foreground` e o asterisco é
    `status/error`, sempre — inclusive quando o campo está em erro.

variantes:
  required:
    eixo: aparencia
    escolha_quando: "true quando o preenchimento do campo for obrigatório"
    nao_combine_com: ["layout", "weight", "state"]

estados:
  nenhum:
    token: nao_se_aplica
    muda_para_a_pessoa: "Nada muda no rótulo. Erro e desabilitado são mostrados pelo campo e pela composição"

regras_de_negocio:
  - "Campo obrigatório é sinalizado pelo asterisco — e a obrigatoriedade real é do controle"
erros_de_dominio: []

tokens:
  texto: [text/label-md]
  cor_do_texto: color/foreground
  cor_do_asterisco: status/error
  espaco_antes_do_asterisco: space/inline-tight

dicas_para_ia:
  - "Rótulo de campo é `nph-label`; frase com verbo e ponto final não é."
  - "O rótulo não muda no erro. Quem muda é o campo e a mensagem."
  - "Não procure propriedade de layout: a posição é do `nph-field`."
  - "`required=true` sozinho não comunica obrigatoriedade a leitor de tela."

acessibilidade:
  semantica: "Elemento nativo `<label>`"
  nome_acessivel: "O rótulo é a origem do nome acessível do controle"
  teclado: []
  foco: "Não recebe foco e não tem tecla própria"
  contraste: "Medido em 27-08-2026 nos dois modos; as quatro combinações passam em 4,5:1"
  alternativa_a_cor: "O asterisco é sinal de forma, não de cor — e é decorativo"

combinacoes_invalidas:
  - "`required=true` sem legenda visível explicando a convenção no formulário"
  - "Criar propriedade de layout, peso ou estado — as três foram recusadas por decisão"

relacoes:
  combina_com: [nph-input, nph-field, nph-checkbox]
  pai: [nph-field]
  filho: []
  complementa_bloco: [pendente]
  aparece_em: [pendente]

anti_padroes:
  - "Mudar a cor do rótulo quando o campo entra em erro"
  - "Usar `nph-label` para abrir seção ou dar ênfase"
  - "Tratar o asterisco como o sinal de obrigatoriedade para tecnologia assistiva"

fontes:
  design_md: "design.md, no repositório"
  decisao: "P62.1, P62.2 e P62.3, aprovadas pelo Elvys em 28-08-2026"
  testes: "src/components/nph-label/nph-label.test.ts"
  evidencia_de_uso: "branch v/3.0.0, PR #10, merge e231eba"
  storybook: "src/components/nph-label/nph-label.stories.ts"
  figma: "página NPH — Label, conjunto mestre 374:6"
tags: [nephos, ds-agentico, ficha, componente, nph-label]
---

> **Referências marcadas `(vault)`** estão em `02 PROJETOS/DS-Agentico/`, no WORK BRAIN —
> fora deste repositório. Elas eram wikilinks do Obsidian e foram convertidas em
> referência explícita na migração de 31-08-2026.

# nph-label

> **O princípio que rege esta peça, aprovado por Indiane em 27-08-2026: o rótulo é só um
> texto.** Ele não carrega layout, estado, ajuda nem mensagem de erro.
>
> A API está no bloco YAML acima. Volta para `Índice — DS-Agentico` (vault).

## Função

**O problema que resolve:** nomeia um controle de formulário de forma visível e
acessível.

**Quando usar:** sempre que um controle de formulário precisar de nome visível —
sozinho ou dentro de um `nph-field`.

**Quando NÃO usar:**

- **Frase com verbo e ponto final** — isso é `text/body-md`.
- **Abrir uma seção ou grupo** — isso é `text/heading-sm`.
- **Dar ênfase dentro de um parágrafo** — isso é `<strong>`, não um rótulo.

## Variantes

**Por aparência — `required`:** `false` e `true`. **São duas combinações, e esta é a
única propriedade de variante do componente.**

**Por tamanho e por densidade:** `nao_se_aplica`. O rótulo tem um papel de texto só.

**Não combine com:** `layout`, `weight` e `state`. **As três foram recusadas por decisão
registrada** em 27-08-2026 — layout é do `nph-field`, peso é da fundação de tipografia, e
estado o rótulo não tem.

## Estados

**Estados suportados: nenhum.** O rótulo **não tem estado próprio**, e isso é decisão,
não omissão.

| A situação | Onde ela aparece |
|---|---|
| **Erro** | **O rótulo não muda.** Continua em `color/foreground`. O erro fica no campo e na mensagem |
| **Desabilitado** | Não é do rótulo. O `nph-field` aplica `state/disabled-opacity` ao controle inteiro |
| **Ajuda e mensagem de erro** | São do `nph-field`. O rótulo carrega só o texto e o asterisco |

**O que muda para a pessoa:** nada, no rótulo.

**Feedback e foco:** o rótulo **não é focável**. Ativar o rótulo move o foco para o
controle associado — comportamento nativo do `<label>`, que só funciona por causa da
decisão de não usar Shadow DOM.

**Regra de negócio que a peça carrega:** o asterisco sinaliza campo obrigatório. **Mas o
asterisco é decorativo** — ver Acessibilidade.

## Acessibilidade

| Critério | Regra |
|---|---|
| Semântica | Elemento nativo `<label>` |
| Associação | Pelo atributo `for`, apontando o `id` do controle |
| Nome acessível | **O rótulo é a origem do nome acessível do controle.** Havendo rótulo visível associado, o controle **não** recebe nome duplicado por `aria-label` |
| Teclado e foco | Não recebe foco e não tem tecla própria |
| Contraste | Medido em 27-08-2026, nos dois modos: as quatro combinações passam no mínimo de 4,5:1 |
| Alternativa à cor | O asterisco é **sinal de forma, não de cor** |

> ⚠️ **O asterisco não comunica obrigatoriedade para leitor de tela.** No código ele sai
> com `aria-hidden` — é decorativo. Duas consequências, e as duas são obrigatórias:
>
> 1. **A obrigatoriedade precisa ser comunicada por código** ao controle, por tecnologia
>    assistiva. `required=true` no rótulo **não faz isso**.
> 2. **Todo formulário que usar `required=true` precisa de legenda visível** explicando
>    a convenção do asterisco. O símbolo é sinal visual, não substituto.

## Relações

**Combina com:** `nph-input`, `nph-field` e `nph-checkbox`.

**O que é pai:** o `nph-field`, que compõe rótulo, controle e mensagem — e é ele quem
decide a **posição** do rótulo em relação ao controle.

**O que é filho:** nada. O `nph-label` é folha.

**Qual bloco complementa:** `pendente` — a Fase 5 não começou.

**Aparece nos layouts:** `pendente`, pelo mesmo motivo.

**A fronteira, escrita:** ajuda e mensagem de erro **não são do rótulo**. Se você está
pensando em acrescentar uma das duas aqui, o lugar é o `nph-field`.

## Tokens, intenção e Dicas para IA

**Tokens semânticos usados** — conferidos no CSS do componente em 31-08-2026:

| Parte | Token |
|---|---|
| O texto | `text/label-md`, nas cinco propriedades do papel |
| A cor do texto | `color/foreground` |
| A cor do asterisco | `status/error` |
| O espaço antes do asterisco | `space/inline-tight` |

**Esta peça é a primeira prova em código da P62.2** — os catorze papéis de texto com
cinco propriedades cada. Sem eles, o rótulo só existiria com valor literal.

**Restrições de uso:** o `use` de `status/error` foi **ampliado no `design.md` antes do
código**, para cobrir o asterisco. A cor do rótulo **não muda** em nenhuma situação.

**Dicas para IA:**

- **Rótulo de campo é `nph-label`.** Frase com verbo e ponto final não é — é `body-md`.
- **O rótulo não muda no erro.** Quem muda é o campo e a mensagem. Se você está
  procurando como deixar o rótulo vermelho, a resposta é: não deixa.
- **Não procure propriedade de layout.** A posição do rótulo é do `nph-field`.
- **`required=true` sozinho não comunica obrigatoriedade** a leitor de tela. O controle
  precisa dizer isso em código, e o formulário precisa de legenda visível.
- **`text` é propriedade, não conteúdo entre as tags.** Sem Shadow DOM não há `slot`.

## Exemplos

**Caso recomendado:** `nph-label` com `text` e `for` apontando o `id` do `nph-input`,
dentro de um `nph-field` — o rótulo nomeia, o campo compõe.

**Caso alternativo:** `required=true` num formulário que já traz a legenda visível
explicando o asterisco, com a obrigatoriedade também declarada no controle.

## Anti-padrões

- **Não usar para:** abrir seção, dar ênfase, ou escrever frase corrida.
- **Não combinar com:** propriedade de layout, peso ou estado — as três foram recusadas
  por decisão.
- **Combinações inválidas, e por quê:** `required=true` sem legenda visível no formulário
  — o asterisco sozinho não explica a convenção · mudar a cor do rótulo no erro — a
  decisão é que ele não muda · esperar que o asterisco anuncie obrigatoriedade a leitor
  de tela — ele é `aria-hidden`.
- **Não criar nem adaptar sem decisão:** variante nova, token de cor próprio, ou
  qualquer propriedade além das três.

## Fontes e decisões

### Estado da implementação — evidência verificada em 31-08-2026

| O quê | Evidência |
|---|---|
| Implementado e integrado | Está na branch padrão `v/3.0.0`, pelo **PR #10**, merge `e231eba`, em 28-08-2026. **É o segundo componente disponível na branch padrão** |
| A API do código | `text`, `required` e `for` — **é a P62.3**, conferida propriedade por propriedade em `src/components/nph-label/nph-label.ts` |
| `required` e `for` refletem no DOM | Confirmado no código |
| Sem Shadow DOM | Confirmado, com o motivo escrito no próprio arquivo |
| Tokens consumidos | Conferidos em `nph-label.css`: `text/label-md` (cinco propriedades), `color/foreground`, `status/error`, `space/inline-tight` |
| Stories e testes | 4 stories e 17 casos de teste |
| Aprovação visual | Indiane, em **27-08-2026**, conjunto mestre `374:6` na página `NPH — Label`, nos modos claro e escuro |

> **Duas divergências que encontrei na ficha antiga, e como resolvi.**
>
> A ficha em `TRABALHO/DESIGN SYSTEM/02 — Componentes/fichas/nph-label.md` diz que **"a
> forma de associação é pendente"** e que **"o componente não está na `v/3.0.0`"**. As
> duas ficaram para trás: a associação é o `for`, fechada pela **P62.3**, e o componente
> foi mergeado em 28-08-2026. Ela também registra as duas decisões técnicas como
> "pendentes de confirmação de Elvys" — **a P62.1 e a P62.3 foram aprovadas por ele em
> 28-08-2026**. A fonte de estado é o `Estado vigente — Nephos` (vault), confirmado no
> repositório; a ficha antiga é memória.

### A exceção que esta peça carrega

**`nph-label` é o único componente do Nephos sem Shadow DOM.** É a **P62.1**, exceção
declarada à P01, **de uma peça só, sem abrir precedente**.

**O motivo, e ele importa:** a associação nativa entre rótulo e controle **não atravessa
a fronteira do Shadow DOM**. Sem isso, o `for` não alcançaria o `id` do controle, o
clique no rótulo não moveria o foco, e **o rótulo perderia a função**. A exceção existe
para preservar comportamento nativo do navegador, não por conveniência de implementação.

E ela obrigou duas propriedades a mais que o previsto: **`for`**, o mecanismo da
associação, e **`text`**, que carrega o conteúdo — porque sem Shadow DOM não existe
`slot`.

**Não imite esta exceção em outro componente.** Ela vale para esta peça, por este motivo.

### As decisões de 27-08-2026

| # | Assunto | A decisão |
|---|---|---|
| — | Escopo | Entra na v1 como **2º item do recorte P0** (21-08-2026) |
| 1 | Erro | **O rótulo não muda** |
| 2 | Layout | **Não é do rótulo** — pertence ao `nph-field` |
| 3 | Obrigatório | **Asterisco**, no formato `Nome completo *` |
| 4 | Desabilitado | **Não tem estado próprio** |
| 5 | Fronteira com `nph-field` | **Ajuda e mensagem de erro são do `nph-field`** |

| O quê | Onde |
|---|---|
| Contrato técnico | `design.md`, no repositório |
| As decisões técnicas | `docs/decisoes-tecnicas.md` — P62.1, P62.2 e P62.3 |
| Regras de papel de texto | `Fundação — tipografia` (vault) |
| Regras de cor do texto e do estado | `Fundação — cor` (vault) |
| A ficha de origem, agora memória | `TRABALHO/DESIGN SYSTEM/02 — Componentes/fichas/nph-label.md` |
| O que está aberto | `Pendências do Nephos` (vault) |

---

*Procedência: função, variantes, estados, acessibilidade, relações, exemplos,
anti-padrões e as decisões de 27-08-2026 são **evidência** — vêm da ficha de origem,
reescritas no modelo de nove seções, sem alteração de regra. O bloco `api`, os tokens
consumidos, a ausência de Shadow DOM e o estado da implementação são **evidência
verificada no repositório** em 31-08-2026. As Dicas para IA são **novas**. A P62.1, a
P62.2 e a P62.3 são **decisão humana** da Indiane, aprovadas pelo Elvys em 28-08-2026.
Nenhuma alteração foi feita em código, tokens, testes, Figma ou repositório.*
