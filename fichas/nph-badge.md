---
peca: nph-badge
nivel: componente
status: vigente
resolve: >-
  Rotula o estado ou a categoria de um item com uma ou duas palavras, para a
  pessoa reconhecer o item sem ler o detalhe.
use_quando:
  - "Rotular o estado de um item, como o de um documento ou de uma solicitação."
  - "Rotular a categoria de um item."
  - "Reforçar a palavra com um ícone do núcleo, quando o ícone ajuda a reconhecer o estado."
nao_use_quando:
  - "A peça precisaria receber clique ou foco — use nph-button."
  - "A palavra não existe e só sobraria o ícone — sem texto não há selo."
  - "O texto é uma frase — o texto de apoio fica fora da peça, ao lado do selo."
  - "O item já tem um selo de status — um estado por item."
api:
  severity:
    tipo: enum
    valores: [primary, secondary, info, warn, help, danger, success]
    obrigatoria: false
    padrao: primary
    reflete: true
    restricao: >-
      O tipo do Figma. Escolha pelo significado: estado permanente usa
      secondary ou primary; success confirma um evento que acabou de
      acontecer. Reflete porque o CSS interno seleciona a cor por ele. Valor
      fora da lista não desenha nada e emite console.error em desenvolvimento.
  emphasis:
    tipo: enum
    valores: [solid, light]
    obrigatoria: false
    padrao: solid
    reflete: true
    restricao: >-
      A ênfase do Figma. Reflete porque o CSS interno seleciona a cor por ela.
      Valor fora da lista não desenha nada e emite console.error em
      desenvolvimento.
  text:
    tipo: string
    obrigatoria: true
    padrao: "vazio"
    reflete: false
    restricao: >-
      Uma ou duas palavras, já localizadas pela aplicação consumidora. É o nome
      acessível. Vazio ou só espaços não mostra nada e não é erro: sem palavra,
      sem selo.
  icon:
    tipo: string
    obrigatoria: false
    padrao: "vazio"
    reflete: false
    restricao: >-
      Um nome do núcleo do nph-icon, desenhado antes do texto em icon/size-sm e
      na cor do texto. Vazio deixa o selo sem ícone. Nome fora do núcleo não
      desenha nada e emite console.error em desenvolvimento.
variantes:
  severity:
    eixo: aparencia
    escolha_quando: "Pelo significado do estado ou da categoria, nunca pela cor."
    nao_combine_com: ["success em estado permanente"]
  emphasis:
    eixo: aparencia
    escolha_quando: "solid quando o selo precisa de peso; light quando ele acompanha o item sem disputar atenção."
    nao_combine_com: []
estados:
  padrao:
    token: "o par de fundo e texto do tipo e da ênfase, no bloco tokens"
    muda_para_a_pessoa: "O selo mostra a palavra; ele não muda com interação, porque não recebe clique, foco nem hover."
regras_de_negocio:
  - "Um estado por item."
  - "Sem texto não há selo."
erros_de_dominio: []
tokens:
  conteiner: [radius/full, space/inline-tight, space/control-padding]
  espaco_icone_texto: space/inline-tight
  texto: text/label-sm
  icone: icon/size-sm
  solido_primary: [color/primary, color/primary-foreground]
  solido_secondary: [color/secondary, color/secondary-foreground]
  solido_status: [status/info, status/warning, status/help, status/success, status/on-solid]
  solido_danger: [color/destructive, color/destructive-foreground]
  leve_primary: [color/primary-surface, color/primary-on-surface]
  leve_secondary: [color/secondary-light, color/secondary-foreground]
  leve_status: [status/info-surface, status/info-foreground, status/warning-surface, status/warning-foreground, status/help-surface, status/help-foreground, status/success-surface, status/success-foreground]
  leve_danger: [color/destructive-surface, color/destructive-on-surface]
dicas_para_ia:
  - "Use nph-badge para rotular o estado ou a categoria de um item; para uma ação, use nph-button."
  - "Escolha severity pelo significado. Estado permanente é secondary ou primary; success é o evento que acabou de acontecer."
  - "Escreva uma ou duas palavras em text. Frase de apoio fica fora do selo."
  - "Ligue icon só para reforçar a palavra; o ícone herda a cor do texto."
  - "Não pinte o fundo nem o texto: a cor vem de severity e emphasis."
acessibilidade:
  semantica: "Só texto, sem role. O ícone é decorativo."
  nome_acessivel: "O texto do selo."
  teclado: []
  foco: "O selo não recebe foco nem clique."
  contraste: "O texto passa 4,5:1 em todos os tipos e ênfases, nos dois esquemas e em todas as marcas; o menor valor é 4,64:1, no primary light do esquema claro."
  alternativa_a_cor: "Todo selo tem texto; a cor nunca é o único sinal, e o ícone só reforça a palavra."
combinacoes_invalidas:
  - "Selo sem texto, só com ícone — sem palavra não há selo."
  - "Dois selos de status no mesmo item — um estado por item."
  - "Selo clicável, com hover ou com foco — use nph-button."
  - "Selo com contagem — o selo rotula estado ou categoria."
  - "emphasis fora de solid e light — não existe."
relacoes:
  combina_com: [nph-icon]
  pai: ["linha de lista ou de tabela", "cabeçalho de um item"]
  filho: [nph-icon]
  complementa_bloco: []
  aparece_em: []
anti_padroes:
  - "Usar como botão."
  - "Usar success como selo permanente."
  - "Pôr uma frase dentro do selo."
  - "Pintar o fundo ou o texto à mão."
  - "Criar tipo ou ênfase fora da lista."
fontes:
  design_md: "design.md, text/label-sm, radius/full, space/inline-tight, space/control-padding, icon/size-sm e as cores color/* e status/* do bloco tokens"
  decisao: "P68 — API e semântica de nph-badge e nph-button, 05-10-2026"
  testes: "src/components/nph-badge/nph-badge.test.ts e nph-badge.docs.test.ts"
  evidencia_de_uso: "pendente — nenhuma tela aprovada consome o selo ainda"
  storybook: "src/components/nph-badge/nph-badge.stories.ts e nph-badge.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, quadro nph-badge 1196:1100 e conjunto 878:30"
---

# nph-badge

## Função

**O problema que resolve:** rotula o estado ou a categoria de um item com uma ou duas
palavras, para a pessoa reconhecer o item sem ler o detalhe.

**Quando usar:**

- Para rotular o estado de um item, como o de um documento ou de uma solicitação.
- Para rotular a categoria de um item.
- Com ícone, só para reforçar a palavra.

**Quando NÃO usar:**

- **Como botão** — o selo não recebe clique nem foco; use `nph-button`.
- **Sem texto** — se não há o que escrever, não há selo.
- **Para uma frase** — o texto de apoio fica fora da peça, ao lado do selo.
- **Para um segundo estado no mesmo item** — um estado por item.

## Variantes

**Por aparência:** `severity` (o tipo do Figma) e `emphasis` (a ênfase).

- `severity` é escolhido **estritamente** pelo significado. Estado permanente usa
  `secondary` ou `primary`; `success` confirma um evento que acabou de acontecer.
- `emphasis` `solid` dá peso ao selo; `light` acompanha o item sem disputar atenção.

**Por tamanho e densidade:** `nao_se_aplica`. O selo tem um tamanho só.

**Não combine com:** `success` em estado permanente.

## Estados

| Estado | Token | O que muda para a pessoa |
|---|---|---|
| Padrão | o par de fundo e texto do tipo e da ênfase | O selo mostra a palavra; ele não muda com interação |

**Feedback e foco:** o selo não recebe clique, foco nem hover. O hover saiu do Figma em
02-10-2026, porque o selo não é clicável.

**Regra de negócio que a peça carrega:** um estado por item, e sem texto não há selo.

**Estados de erro do domínio:** nenhum.

## Acessibilidade

| Critério | Regra |
|---|---|
| Semântica | Só texto, sem role. O ícone é decorativo |
| Nome acessível | O texto do selo |
| Teclado e foco | O selo não recebe foco nem clique |
| Contraste | O texto passa 4,5:1 em todos os tipos e ênfases, nos dois esquemas e em todas as marcas; o menor valor é 4,64:1, no `primary` `light` do esquema claro |
| Alternativa à cor | Todo selo tem texto; a cor nunca é o único sinal, e o ícone só reforça a palavra |

## Relações

**Combina com:** `nph-icon`, que desenha o ícone opcional.

**O que é pai:** a linha de uma lista ou de uma tabela e o cabeçalho de um item.

**O que é filho:** `nph-icon`, pela propriedade `icon`. O selo não tem slot.

**Qual bloco esta peça complementa:** nenhum.

**Aparece nos layouts:** nenhum.

## Tokens, intenção e Dicas para IA

| Parte | Token |
|---|---|
| Contêiner | `radius/full`; `space/inline-tight` em cima e embaixo e `space/control-padding` nas laterais |
| Espaço entre ícone e texto | `space/inline-tight` |
| Texto | `text/label-sm`, numa linha só |
| Ícone | `icon/size-sm`, na cor do texto |
| `solid` | `primary`: `color/primary` e `color/primary-foreground`; `secondary`: `color/secondary` e `color/secondary-foreground`; `info`, `warn`, `help` e `success`: `status/<matiz>` e `status/on-solid`; `danger`: `color/destructive` e `color/destructive-foreground` |
| `light` | `primary`: `color/primary-surface` e `color/primary-on-surface`; `secondary`: `color/secondary-light` e `color/secondary-foreground`; `info`, `warn`, `help` e `success`: `status/<matiz>-surface` e `status/<matiz>-foreground`; `danger`: `color/destructive-surface` e `color/destructive-on-surface` |

**Restrições de uso:** a cor vem de `severity` e `emphasis`, nos dois esquemas. Dois
limites estão na P68: `status/on-solid` sai só na raiz até o gerador de tokens o
redeclarar por esquema (L-a), e o `use` de alguns tokens no `design.md` ainda não cita o
selo (L-b).

**Dicas para IA:**

- Use `nph-badge` para rotular o estado ou a categoria de um item; para uma ação, use
  `nph-button`.
- Escolha `severity` pelo significado. Estado permanente é `secondary` ou `primary`;
  `success` é o evento que acabou de acontecer.
- Escreva uma ou duas palavras em `text`. A frase de apoio fica fora do selo.
- Ligue `icon` só para reforçar a palavra; o ícone herda a cor do texto.
- Não pinte o fundo nem o texto: a cor vem de `severity` e `emphasis`.

## Exemplos

**Caso recomendado:** ao lado de "Relatório anual", o selo `secondary` `solid`
"Rascunho", que é um estado permanente do documento.

**Caso alternativo:** ao lado de "Solicitação 218", o selo `danger` `light` "Recusado",
com o ícone `circle-info` reforçando a palavra.

## Anti-padrões

- **Não usar como botão** — o selo não recebe clique nem foco; use `nph-button`.
- **Não usar `success` como selo permanente** — use `secondary` ou `primary`.
- **Não pôr frase dentro do selo** — o texto de apoio fica fora da peça.
- **Não pintar o fundo ou o texto à mão** — a cor vem do tipo e da ênfase.
- **Combinações inválidas:** selo só com ícone; dois selos de status no mesmo item;
  selo clicável, com hover ou com foco; selo com contagem; ênfase fora de `solid` e
  `light`.
- **Não criar sem decisão:** tipo, ênfase, tamanho ou estado novos.

## Fontes e decisões

- **`design.md` do repositório:** `text/label-sm`, `radius/full`, `space/inline-tight`,
  `space/control-padding`, `icon/size-sm` e as cores `color/*` e `status/*` da tabela
  de tokens.
- **A decisão que originou:** P68, de 05-10-2026. O quadro foi aceito por Indiane em
  01-10-2026 e completado em 02-10-2026, quando o hover saiu.
- **Testes:** `src/components/nph-badge/nph-badge.test.ts` e `nph-badge.docs.test.ts`.
- **Evidência de uso:** pendente — nenhuma tela aprovada consome o selo ainda.
- **Storybook:** `src/components/nph-badge/nph-badge.stories.ts` (Validação) e
  `nph-badge.docs.stories.ts` (Docs).
- **Figma:** quadro `nph-badge` (`1196:1100`) e conjunto `878:30` no `DS-IA-NEPHOS 5.0`.
