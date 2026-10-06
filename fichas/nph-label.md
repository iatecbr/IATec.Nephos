---
peca: nph-label
nivel: componente
status: vigente
titulo: "nph-label"
tipo: ficha de componente
criado: 2026-08-31
atualizado: 2026-10-06
resolve: >-
  Nomeia um controle de formulário de forma visível e acessível. O rótulo é só
  um texto: não carrega layout, estado nem mensagem de erro. Carrega o gatilho
  da ajuda, não a ajuda: o ícone de informação abre o nph-tooltip.
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
  info:
    tipo: string
    obrigatoria: false
    padrao: "vazio"
    reflete: false
    restricao: >-
      O texto da explicação, já localizado pela aplicação consumidora. Com
      info-label, mostra o ícone de informação depois do texto, que abre o
      nph-tooltip com este texto. Sem info-label, o ícone não aparece e sai
      console.error em desenvolvimento; o rótulo continua.
  info-label:
    tipo: string
    obrigatoria: false
    padrao: "vazio"
    reflete: false
    restricao: >-
      O nome acessível do ícone de informação. A propriedade é infoLabel. Sem
      info, não aparece nada e não há erro.
  slots: nenhum
  eventos: nenhum
  cor: >-
    Não é propriedade. O texto é `color/foreground` e o asterisco é
    `status/error`, sempre — inclusive quando o campo está em erro.

variantes:
  required:
    eixo: aparencia
    escolha_quando: "true quando o preenchimento do campo for obrigatório"
    nao_combine_com: ["layout", "weight"]
  info:
    eixo: aparencia
    escolha_quando: "Quando o campo precisa de uma explicação curta que não cabe no rótulo; no código, é o texto de info com info-label."
    nao_combine_com: ["layout", "weight"]

estados:
  default:
    token: nao_se_aplica
    muda_para_a_pessoa: "O texto não tem estado. Erro e desabilitado são mostrados pelo campo e pela composição"
  focus:
    token: "borda border/width em focus/border e halo focus/ring-width em focus/halo, em volta do alvo de 24 por 24"
    muda_para_a_pessoa: "Só no ícone de informação e só pelo teclado: a borda e o halo marcam o foco, sem mudar o tamanho."
  aberto:
    token: "o nph-tooltip, abaixo do rótulo, a space/inline"
    muda_para_a_pessoa: "O balão mostra a explicação; fecha com Esc, clique fora ou Tab para fora. Passar o mouse não abre."

regras_de_negocio:
  - "Campo obrigatório é sinalizado pelo asterisco — e a obrigatoriedade real é do controle"
erros_de_dominio: []

tokens:
  texto: [text/label-md]
  cor_do_texto: color/foreground
  cor_do_asterisco: status/error
  espaco_antes_do_asterisco: space/inline-tight
  espaco_ate_o_gatilho: space/inline-tight
  gatilho: [icon/size-sm, space/inline-tight, color/muted-foreground]
  foco_do_gatilho: [border/width, focus/border-radius-control, focus/ring-width, focus/radius-control-with-border, focus/border, focus/halo]
  espaco_ate_o_balao: space/inline

dicas_para_ia:
  - "Rótulo de campo é `nph-label`; frase com verbo e ponto final não é."
  - "O rótulo não muda no erro. Quem muda é o campo e a mensagem."
  - "Não procure propriedade de layout: a posição é do `nph-field`."
  - "`required=true` sozinho não comunica obrigatoriedade a leitor de tela."
  - "O ícone de informação aparece com info e info-label juntos; info-label é o nome que o leitor de tela anuncia."

acessibilidade:
  semantica: "Elemento nativo `<label>`; o ícone de informação é um `<button>` nativo depois dele, fora do `<label>`, com aria-expanded e aria-controls apontando o nph-tooltip"
  nome_acessivel: "O rótulo é a origem do nome acessível do controle. O ícone de informação é nomeado por info-label"
  teclado:
    - "Tab entra e sai do ícone de informação; o texto não recebe foco."
    - "Enter e Espaço abrem e fecham o balão."
    - "Esc fecha o balão aberto, e o foco fica no ícone."
  foco: "O texto não recebe foco. O ícone de informação recebe, com borda focus/border e halo focus/halo por fora, só pelo teclado"
  contraste: "Medido nos dois modos: o texto e o asterisco passam em 4,5:1; o ícone, em color/muted-foreground, 6,69:1 e 9,81:1; a borda de foco, em focus/border, 3,68:1 e 8,98:1"
  alternativa_a_cor: "O asterisco é sinal de forma, não de cor — e é decorativo"

combinacoes_invalidas:
  - "`required=true` sem legenda visível explicando a convenção no formulário"
  - "Criar propriedade de layout ou de peso — as duas foram recusadas por decisão; o texto também não tem estado"
  - "info sem info-label — o ícone não aparece, porque não teria nome acessível"

relacoes:
  combina_com: [nph-input, nph-field, nph-checkbox]
  pai: [nph-field]
  filho: [nph-icon, nph-tooltip]
  complementa_bloco: [pendente]
  aparece_em: [pendente]

anti_padroes:
  - "Mudar a cor do rótulo quando o campo entra em erro"
  - "Usar `nph-label` para abrir seção ou dar ênfase"
  - "Tratar o asterisco como o sinal de obrigatoriedade para tecnologia assistiva"

fontes:
  design_md: "design.md, no repositório"
  decisao: "P62.1, P62.2 e P62.3, aprovadas pelo Elvys em 28-08-2026; P62.6, o gatilho de informação, em revisão no PR por maurocsjr"
  testes: "src/components/nph-label/nph-label.test.ts"
  evidencia_de_uso: "branch v/3.0.0, PR #10, merge e231eba"
  storybook: "src/components/nph-label/nph-label.stories.ts"
  figma: "página NPH — Label, quadro nph-label 1194:1482 e conjunto mestre 374:6"
tags: [nephos, ds-agentico, ficha, componente, nph-label]
---

> **Referências marcadas `(vault)`** estão em `02 PROJETOS/DS-Agentico/`, no WORK BRAIN —
> fora deste repositório. Elas eram wikilinks do Obsidian e foram convertidas em
> referência explícita na migração de 31-08-2026.

# nph-label

> **O princípio que rege esta peça, aprovado por Indiane em 27-08-2026: o rótulo é só um
> texto.** Ele não carrega layout, estado nem mensagem de erro. Desde 08-09-2026 (L8),
> ele carrega o **gatilho** da ajuda, não a ajuda: o ícone de informação abre o
> `nph-tooltip`.
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

**Por aparência — `required` e `info`:** cada uma `false` ou `true`, sozinhas ou juntas
(conjunto `374:6`). `required` acrescenta o asterisco; `info` acrescenta o ícone de
informação depois do texto. No código, `info` é o texto da explicação e só desenha o
ícone com `info-label`.

**Por tamanho e por densidade:** `nao_se_aplica`. O rótulo tem um papel de texto só.

**Não combine com:** `layout` e `weight`. **As duas foram recusadas por decisão
registrada** em 27-08-2026 — layout é do `nph-field` e peso é da fundação de tipografia.
O texto também não tem estado; o eixo `state` do Figma (`default` e `focus`) existe só
com `info` e é o foco do ícone (L9).

## Estados

**O texto não tem estado próprio**, e isso é decisão, não omissão. Os únicos estados
são do ícone de informação: o **foco**, pelo teclado, e o **aberto**, com o balão.

| A situação | Onde ela aparece |
|---|---|
| **Erro** | **O rótulo não muda.** Continua em `color/foreground`. O erro fica no campo e na mensagem |
| **Desabilitado** | Não é do rótulo. O `nph-field` aplica `state/disabled-opacity` ao controle inteiro |
| **Ajuda e mensagem de erro** | São do `nph-field`. O rótulo carrega o texto, o asterisco e o gatilho da ajuda, não a ajuda (L8) |

**O que muda para a pessoa:** nada, no texto. No ícone de informação, o foco e o balão
aberto.

**Feedback e foco:** o texto do rótulo **não é focável**. Ativar o rótulo move o foco
para o controle associado — comportamento nativo do `<label>`, que só funciona por causa
da decisão de não usar Shadow DOM. O ícone de informação é focável: com foco, mostra a
borda `focus/border` e o halo `focus/halo` em volta do alvo de 24 × 24. Ativado por
clique, Enter ou Espaço, abre o `nph-tooltip` abaixo do rótulo, a `space/inline`; fecha
com Esc, clique fora ou Tab para fora. O fechamento por Tab é a leitura, para o
teclado, do "clique fora" da L11 (P62.6). Passar o mouse não abre.

**Regra de negócio que a peça carrega:** o asterisco sinaliza campo obrigatório. **Mas o
asterisco é decorativo** — ver Acessibilidade.

## Acessibilidade

| Critério | Regra |
|---|---|
| Semântica | Elemento nativo `<label>`. O ícone de informação é um `<button>` nativo depois dele, fora do `<label>`, com `aria-expanded` e `aria-controls` |
| Associação | Pelo atributo `for`, apontando o `id` do controle |
| Nome acessível | **O rótulo é a origem do nome acessível do controle.** Havendo rótulo visível associado, o controle **não** recebe nome duplicado por `aria-label` |
| Teclado e foco | O texto não recebe foco. O ícone de informação entra no Tab; Enter e Espaço abrem e fecham o balão; Esc fecha. O balão é região viva `role="status"` e não recebe foco |
| Nome do ícone | `info-label`. Sem ele, o ícone não aparece |
| Alvo de toque | O ícone de informação tem alvo de 24 × 24, com a arte de 16 px no centro (WCAG 2.5.8) |
| Contraste | Medido em 27-08-2026, nos dois modos: o texto e o asterisco passam no mínimo de 4,5:1. O ícone, em `color/muted-foreground`, tem 6,69:1 e 9,81:1, e a borda de foco, em `focus/border`, 3,68:1 e 8,98:1 (quadro `1194:1482`) |
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

**O que é filho:** com o gatilho, o `nph-icon` (`circle-info`) e o `nph-tooltip`, que
mostra a explicação. Sem o gatilho, o `nph-label` é folha.

**Qual bloco complementa:** `pendente` — a Fase 5 não começou.

**Aparece nos layouts:** `pendente`, pelo mesmo motivo.

**A fronteira, escrita:** ajuda e mensagem de erro **não são do rótulo**. Se você está
pensando em acrescentar uma das duas aqui, o lugar é o `nph-field`.

## Tokens, intenção e Dicas para IA

**Tokens semânticos usados** — conferidos no CSS do componente em 31-08-2026; o
gatilho, em 06-10-2026:

| Parte | Token |
|---|---|
| O texto | `text/label-md`, em todas as propriedades do papel |
| A cor do texto | `color/foreground` |
| A cor do asterisco | `status/error` |
| O espaço antes do asterisco | `space/inline-tight` |
| O espaço até o ícone de informação | `space/inline-tight` |
| O ícone de informação | `circle-info` `solid` em `icon/size-sm`, com `space/inline-tight` em volta (alvo de 24 × 24), em `color/muted-foreground` |
| O foco do ícone | `border/width` em `focus/border`, raio `focus/border-radius-control`; halo `focus/ring-width` em `focus/halo`, raio `focus/radius-control-with-border` |
| O espaço até o balão | `space/inline` |

**Esta peça é a primeira prova em código da P62.2** — os papéis de texto, cada um com
as suas propriedades. Sem eles, o rótulo só existiria com valor literal.

**Restrições de uso:** o `use` de `status/error` foi **ampliado no `design.md` antes do
código**, para cobrir o asterisco. A cor do rótulo **não muda** em nenhuma situação. Os
limites do gatilho estão na P62.6: o `use` de `color/muted-foreground` ainda não cita o
ícone (L-a); a regra 6 do `design.md` passa a admitir borda e halo pelo PR #57 (L-b); e o
balão não tem `z-index`, porque não há token de camada (L-c).

**Dicas para IA:**

- **Rótulo de campo é `nph-label`.** Frase com verbo e ponto final não é — é `body-md`.
- **O rótulo não muda no erro.** Quem muda é o campo e a mensagem. Se você está
  procurando como deixar o rótulo vermelho, a resposta é: não deixa.
- **Não procure propriedade de layout.** A posição do rótulo é do `nph-field`.
- **`required=true` sozinho não comunica obrigatoriedade** a leitor de tela. O controle
  precisa dizer isso em código, e o formulário precisa de legenda visível.
- **`text` é propriedade, não conteúdo entre as tags.** Sem Shadow DOM não há `slot`.
- **Ícone de informação é `info` mais `info-label`.** Sem o nome, o ícone não aparece. O
  texto da explicação vai no balão, não no rótulo.

## Exemplos

**Caso recomendado:** `nph-label` com `text` e `for` apontando o `id` do `nph-input`,
dentro de um `nph-field` — o rótulo nomeia, o campo compõe.

**Caso alternativo:** `required=true` num formulário que já traz a legenda visível
explicando o asterisco, com a obrigatoriedade também declarada no controle.

**Com explicação:** `info` com o texto curto do que o campo pede e `info-label` com o
nome do ícone, como "Sobre CPF".

## Anti-padrões

- **Não usar para:** abrir seção, dar ênfase, ou escrever frase corrida.
- **Não combinar com:** propriedade de layout ou de peso — as duas foram recusadas por
  decisão.
- **Combinações inválidas, e por quê:** `required=true` sem legenda visível no formulário
  — o asterisco sozinho não explica a convenção · mudar a cor do rótulo no erro — a
  decisão é que ele não muda · esperar que o asterisco anuncie obrigatoriedade a leitor
  de tela — ele é `aria-hidden` · `info` sem `info-label` — o ícone não teria nome.
- **Não criar nem adaptar sem decisão:** variante nova, token de cor próprio, ou
  qualquer propriedade além das que estão no bloco `api`.

## Fontes e decisões

### Estado da implementação — evidência verificada em 31-08-2026; o gatilho, em 06-10-2026

| O quê | Evidência |
|---|---|
| Implementado e integrado | Está na branch padrão `v/3.0.0`, pelo **PR #10**, merge `e231eba`, em 28-08-2026. **É o segundo componente disponível na branch padrão** |
| A API do código | `text`, `required` e `for` — **é a P62.3**, conferida propriedade por propriedade em `src/components/nph-label/nph-label.ts`. `info` e `info-label` entram pela **P62.6** (DSA-04), em revisão |
| `required` e `for` refletem no DOM | Confirmado no código |
| Sem Shadow DOM | Confirmado, com o motivo escrito no próprio arquivo |
| Tokens consumidos | Conferidos em `nph-label.css`: `text/label-md` (as propriedades do papel), `color/foreground`, `status/error`, `space/inline-tight`; com o gatilho, os do bloco `tokens` |
| Stories e testes | Em `nph-label.stories.ts` e `nph-label.test.ts` |
| Aprovação visual | Indiane, em **27-08-2026**, conjunto mestre `374:6` na página `NPH — Label`, nos modos claro e escuro; em **08-09-2026**, a matriz `required` × `info` (L8); em **01-10-2026**, o foco do ícone e o quadro `1194:1482` (L9 e L10) |

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
| 5 | Fronteira com `nph-field` | **Ajuda e mensagem de erro são do `nph-field`** — superada em parte pela L8: o rótulo carrega o gatilho da ajuda |

| O quê | Onde |
|---|---|
| Contrato técnico | `design.md`, no repositório |
| As decisões técnicas | `docs/decisoes-tecnicas.md` — P62.1, P62.2, P62.3 e P62.6 |
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
Em 06-10-2026, a ficha ganhou o gatilho de informação (DSA-04): a anatomia e o
comportamento vêm da L8 à L11 e do quadro `1194:1482`, aceitos por Indiane; a API e a
semântica são a **P62.6**, em revisão no PR por `maurocsjr`.*
