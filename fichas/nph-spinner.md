---
peca: nph-spinner
nivel: componente
status: "incompleta — aguarda implementação"
titulo: "nph-spinner"
tipo: ficha de componente
criado: 2026-08-31
atualizado: 2026-08-31
resolve: >-
  Torna o carregamento perceptível enquanto uma ação ou área de conteúdo ainda
  não terminou — sem ser o único sinal de que algo está acontecendo.
use_quando:
  - "Uma área de conteúdo está carregando."
  - "Um botão ou campo precisa indicar processamento em andamento."
nao_use_quando:
  - "O girador seria o único sinal de que algo está acontecendo."
  - "O contexto exige uma ação de toque — o girador não é um controle."

api:
  origem: >-
    PROPOSTA — não há código para conferir. As duas fichas implementadas
    (`nph-icon` e `nph-label`) têm a API conferida propriedade por propriedade
    no repositório; esta NÃO tem. Leia como intenção aprovada, não como
    contrato verificado.
  size:
    tipo: enum
    valores: [sm, md]
    obrigatoria: true
    padrao: nenhum
    reflete: "a definir na implementação"
    restricao: >-
      `sm` dentro de botão e campo; `md` em área de conteúdo. `lg` não existe e
      não se cria. A antiga `type=Mirrored`, herdada do kit, foi removida.
  label:
    tipo: string
    obrigatoria: false
    padrao: "a definir na implementação"
    reflete: "a definir na implementação"
    restricao: >-
      Sem texto de carregamento adjacente, o girador precisa de nome acessível.
      Com texto ao lado, é decorativo. A forma exata é do plano técnico.
  slots: "a definir na implementação"
  eventos: "a definir na implementação"
  cor: >-
    Não é propriedade. Herda `currentColor` do contexto, como todo ícone.

variantes:
  size:
    eixo: tamanho
    escolha_quando: "pelo contexto de uso, nunca por preferência visual"
    nao_combine_com: ["lg", "type", "Type=Mirrored"]

estados:
  carregando:
    token: "pendente — PF-05 e PF-16"
    muda_para_a_pessoa: "O `circle-notch` gira continuamente enquanto a operação está em andamento"

regras_de_negocio: []
erros_de_dominio: []

tokens:
  tamanho: [icon/size-sm, icon/size-md]
  arte: circle-notch
  cor: currentColor
  movimento: "pendente — ver PF-05 e PF-16"

dicas_para_ia:
  - "Girador nunca é o único sinal: precisa de texto ou contexto que diga o que está acontecendo."
  - "Dentro de botão ou campo é `sm`; área de conteúdo é `md`. Não existe `lg`."
  - "Não invente duração, repetição ou curva: as duas decisões de movimento estão abertas."
  - "A arte é `circle-notch`. Não use o `spinner` clássico."

acessibilidade:
  semantica: "Indicador de progresso; decorativo quando houver texto de carregamento adjacente"
  nome_acessivel: "Sem texto adjacente, nome acessível obrigatório; com texto, ocultar de tecnologias assistivas"
  teclado: []
  foco: "Não recebe foco e não é alvo de toque"
  contraste: "pendente — depende do nível de WCAG da organização (PI-05)"
  alternativa_a_cor: "O contexto textual informa o carregamento; o girador não basta sozinho"

combinacoes_invalidas:
  - "Girador como único sinal de processamento"
  - "Criar duração, repetição ou token de movimento sem decisão técnica"
  - "`size=lg` ou qualquer `type`"

relacoes:
  combina_com: [nph-icon, nph-button]
  pai: [nph-button, "a área de conteúdo em carregamento"]
  filho: []
  complementa_bloco: [pendente]
  aparece_em: [pendente]

anti_padroes:
  - "Usar o `spinner` clássico em vez do `circle-notch`"
  - "Expor `Type=Mirrored` ou variante `lg`"
  - "Implementar movimento por inferência"

fontes:
  design_md: "design.md — regras de ícone e tamanhos; movimento pendente"
  decisao: "Registro de decisões e status — Componentes Nephos"
  testes: "não existe — sem implementação"
  evidencia_de_uso: "não existe — sem implementação"
  storybook: "não existe — sem implementação"
  figma: "página NPH — Spinner, aprovado visualmente"
tags: [nephos, ds-agentico, ficha, componente, nph-spinner, incompleta]
---

> **Referências marcadas `(vault)`** estão em `02 PROJETOS/DS-Agentico/`, no WORK BRAIN —
> fora deste repositório. Elas eram wikilinks do Obsidian e foram convertidas em
> referência explícita na migração de 31-08-2026.

# nph-spinner

> ⚠️ **Esta ficha está incompleta, de propósito.** O componente **não foi
> implementado**: não há código, Storybook nem testes. O que existe é a aprovação
> visual, a arte definida e as decisões de escopo — e é isso que está aqui.
>
> **O bloco `api` é proposta, não contrato verificado.** Nas fichas do `nph-icon` e do
> `nph-label` eu conferi a API no repositório, propriedade por propriedade. Aqui não há
> o que conferir. Não leia esta API com a mesma confiança.
>
> **Ela se completa quando o componente for implementado** — decisão de Indiane em
> 31-08-2026. Volta para `Índice — DS-Agentico` (vault).

## Função

**O problema que resolve:** torna o carregamento **perceptível** enquanto uma ação ou
área de conteúdo ainda não terminou.

**Quando usar:** `sm` dentro de botão ou campo; `md` em área de conteúdo carregando.

**Quando NÃO usar:**

- **Como única mensagem de andamento.** Girador sozinho não diz o que está acontecendo,
  nem quanto falta.
- **Como controle.** Ele não recebe toque nem clique — não é um botão.

## Variantes

**Por tamanho — `size`:** `sm` e `md`. **A escolha é pelo contexto de uso, nunca por
preferência visual:** dentro de botão e campo é `sm`; área de conteúdo é `md`.

**Por aparência e por densidade:** `nao_se_aplica`.

**Não combine com:** `lg` — **não existe e não se cria** — e `type`, incluindo a antiga
`Type=Mirrored`, herdada do kit Obra e **removida por decisão**.

## Estados

**Estado suportado: carregando.** É o único.

**O que muda para a pessoa:** o `circle-notch` **gira continuamente** enquanto a operação
está em andamento.

**Qual token este estado usa: `pendente`.** E esta é a lacuna que impede a ficha de
fechar:

| O que falta | Onde está registrado |
|---|---|
| **A duração do laço** — fica acima da escala e não tem valor definido | **PF-05** |
| **A curva `linear`** — o `design.md` declara `core/easing/linear`, e ela **não existe** na fonte de tokens nem no CSS gerado | **PF-16** |

**Sem as duas, o girador não gira.** Ver `Pendências do Nephos` (vault).

**Feedback e foco:** não recebe foco e não é alvo de toque.

> **Não implemente o movimento por inferência.** Duração, repetição e curva são decisão
> técnica em aberto. Escolher um valor plausível aqui é exatamente o modo de falha que
> esta documentação existe para evitar.

## Acessibilidade

| Critério | Regra |
|---|---|
| Semântica | Indicador de progresso. **Decorativo quando houver texto de carregamento adjacente** |
| Sem texto adjacente | **Nome acessível obrigatório** |
| Com texto ao lado | Ocultar o girador de tecnologias assistivas — senão a informação é anunciada duas vezes |
| Teclado e foco | Não recebe foco, não é alvo de toque |
| Contraste | `pendente` — depende do nível de WCAG da organização (**PI-05**) |
| Alternativa à cor | **O contexto textual informa o carregamento.** O girador não é sinal suficiente isoladamente |

**Movimento reduzido.** A fundação de movimento é explícita: com movimento reduzido, o
giro **para** — vira indicador estático ou progresso determinado. Isso **não é remover o
feedback**: quem pediu redução continua precisando saber que algo está acontecendo, e é
o texto que carrega essa informação. Ver `Fundação — movimento` (vault).

## Relações

**Combina com:** `nph-icon` — de quem herda a arte — e `nph-button`.

**O que é pai:** o `nph-button` em processamento, e a área de conteúdo em carregamento.

**O que é filho:** nada. O girador é folha.

**Qual bloco complementa:** `pendente` — a Fase 5 não começou.

**Aparece nos layouts:** `pendente`, pelo mesmo motivo.

**A dependência que ordena a fila:** o `nph-spinner` vem **depois** do `nph-icon`, porque
a arte dele é o `circle-notch` do núcleo. E ele é **preparação antes do P0**: o estado de
carregamento do botão depende dele.

## Tokens, intenção e Dicas para IA

**Tokens semânticos usados:** `icon/size-sm` e `icon/size-md`.

**A arte:** `circle-notch` — anel com um corte, feito para **rotação contínua**. O
`spinner` clássico foi descartado porque é desenhado para girar em **oito passos
discretos**, e não para girar liso.

**A cor:** herda `currentColor`. Não existe token de cor de girador.

**O movimento:** `pendente`. Ver Estados.

**Restrições de uso:** não usar valor literal, não consumir `core/*` diretamente, não
usar arte alternativa.

**Dicas para IA:**

- **Girador nunca é o único sinal.** Precisa de texto ou contexto que diga o que está
  acontecendo.
- **Dentro de botão ou campo é `sm`; área de conteúdo é `md`.** Não existe `lg`.
- **Não invente duração, repetição ou curva.** As duas decisões de movimento estão
  abertas — PF-05 e PF-16.
- **A arte é `circle-notch`**, não o `spinner` clássico.
- **Com movimento reduzido, o giro para.** O feedback passa a ser o texto.

## Exemplos

**Caso recomendado:** girador `sm` dentro de uma ação em processamento, com nome
acessível e com o texto do botão dizendo o que está acontecendo.

**Caso alternativo:** girador `md` em uma área de conteúdo, acompanhado de mensagem de
carregamento — e aí o girador é decorativo.

## Anti-padrões

- **Não usar para:** sinalizar sozinho que uma operação está em curso.
- **Não combinar com:** tamanho não aprovado, tipo herdado do kit Obra, ou arte diferente
  de `circle-notch`.
- **Combinações inválidas, e por quê:** `size=lg` — não existe · qualquer `type` — a
  propriedade foi removida · girador sem texto de contexto — o carregamento fica mudo
  para quem não vê a animação.
- **Não criar nem adaptar sem decisão:** duração, repetição, token de movimento ou a API
  técnica.

## Fontes e decisões

### O que existe hoje — 31-08-2026

| O quê | Situação |
|---|---|
| Aprovação visual | **Aprovado**, na página `NPH — Spinner`, com `size=sm\|md` |
| Implementação | **Não existe.** Sem código, sem stories, sem testes |
| Arte | `circle-notch`, do núcleo de 34 ícones |
| Escopo | **Entra na v1**, como **preparação antes do P0** — não entra no recorte P0 e não o reordena |
| Movimento | **Aberto** — PF-05 e PF-16 |

### O que falta para esta ficha fechar

1. **A decisão de movimento** — duração do laço e a curva. Sem ela o componente não pode
   ser implementado sem inventar valor.
2. **A implementação**, e com ela: a API conferida no código, o Storybook e os testes.
3. **O nível de WCAG** (PI-05), para o critério de contraste ter aceite.

**Quando o componente for implementado, esta ficha é reaberta** e o bloco `api` deixa de
ser proposta: passa a ser conferido propriedade por propriedade, como nas duas fichas
implementadas.

| O quê | Onde |
|---|---|
| Contrato técnico | `design.md` — regras de ícone e tamanhos; movimento pendente |
| A decisão de escopo e a evidência visual | `TRABALHO/DESIGN SYSTEM/02 — Componentes/Registro de decisões e status — Componentes Nephos.md` |
| A arte e as regras de ícone | `Fundação — ícones` (vault) |
| As regras de movimento | `Fundação — movimento` (vault) |
| A ficha de origem, agora memória | `TRABALHO/DESIGN SYSTEM/02 — Componentes/fichas/nph-spinner.md` |
| O que está aberto | `Pendências do Nephos` (vault) — **PF-05**, **PF-16** e **PI-05** |

---

*Procedência: função, variantes, estado, acessibilidade, relações, exemplos e
anti-padrões são **evidência** — vêm da ficha de origem, em rascunho, reescritas no
modelo de nove seções sem alteração de regra. A aprovação visual e a decisão de escopo
são **decisão humana** da Indiane. **O bloco `api` é proposta**, e está marcado como tal:
não há código para conferir. As Dicas para IA são **novas**. PF-05, PF-16 e PI-05 são
**pendências** já registradas. A ficha nasce incompleta por decisão de Indiane em
31-08-2026, e nada foi inventado para preencher o que falta.*
