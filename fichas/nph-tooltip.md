---
peca: nph-tooltip
nivel: componente
status: vigente
resolve: >-
  Mostra uma explicação curta para o gatilho de informação de um nph-label sem
  transferir o foco para o balão.
use_quando:
  - "O gatilho info de um nph-label precisar revelar uma explicação curta."
nao_use_quando:
  - "A informação for texto de apoio ou mensagem de erro do campo — isso é responsabilidade do nph-field."
  - "O conteúdo precisar de ação, foco ou contexto persistente — use nph-popover."
api:
  text:
    tipo: string
    obrigatoria: true
    padrao: "vazio"
    reflete: false
    restricao: >-
      Carrega o texto do balão, já localizado pela aplicação consumidora. Vazio
      ou só espaços não mostra o balão.
  open:
    tipo: boolean
    obrigatoria: false
    padrao: false
    reflete: true
    restricao: >-
      Mostra ou oculta o balão. Abrir, fechar e posicionar são responsabilidade
      do consumidor.
variantes: nao_se_aplica
estados:
  fechado:
    token: nao_se_aplica
    muda_para_a_pessoa: "O balão e seu texto não são mostrados."
  aberto:
    token: color/tooltip
    muda_para_a_pessoa: "A explicação é mostrada pelo balão."
regras_de_negocio:
  - "O balão abre somente pela ativação do gatilho; não abre no hover."
  - "O texto cabe inteiro em até duas linhas, sem reticências, hifenização automática ou palavra partida."
erros_de_dominio: []
tokens:
  fundo: color/tooltip
  texto: [text/body-sm, color/tooltip-foreground]
  raio: radius/inner
  padding_vertical: space/inline-tight
  padding_horizontal: space/inline
  elevacao: elevation/dropdown
  largura_maxima: layout/max-tooltip-width
  altura_maxima: layout/max-tooltip-height
dicas_para_ia:
  - "Use nph-tooltip somente para a explicação curta aberta pelo gatilho info de nph-label."
  - "Não acrescente título, ícone, ação, seta ou borda."
  - "Não crie propriedade de posicionamento: quem abre e posiciona é o consumidor."
  - "Para conteúdo que pede foco ou ação, escolha nph-popover."
acessibilidade:
  semantica: "O host é uma região viva `role=status` desde a montagem, aberto ou fechado."
  nome_acessivel: "O texto recebido em text é o conteúdo anunciado pela região viva."
  teclado: []
  foco: "O balão não recebe foco; o foco permanece no gatilho."
  contraste: "O texto usa color/tooltip-foreground sobre color/tooltip nos dois esquemas."
  alternativa_a_cor: "A explicação é transmitida pelo texto; a cor não é o único sinal."
combinacoes_invalidas:
  - "Abrir no hover — o balão abre somente pela ativação do gatilho."
  - "Adicionar título, ícone, ação, seta ou borda — o escopo é só texto."
  - "Transferir foco para o balão — o foco permanece no gatilho."
  - "Usar nph-tooltip para conteúdo com ação ou foco — use nph-popover."
relacoes:
  combina_com: [nph-label]
  pai: [nph-label]
  filho: []
  complementa_bloco: []
  aparece_em: []
anti_padroes:
  - "Usar o balão como texto de apoio ou mensagem de erro do campo."
  - "Abrir o balão no hover."
  - "Cortar, truncar ou partir uma palavra para caber no balão."
  - "Aplicar elevation/dropdown numa subárvore com data-nph-color-scheme diferente da raiz: a sombra pode usar a cor do esquema da raiz."
fontes:
  design_md: "design.md, seção de color/tooltip, color/tooltip-foreground, layout/max-tooltip-width, layout/max-tooltip-height, radius/inner e tooltip"
  decisao: "P65 — API e semântica do nph-tooltip, 05-10-2026"
  testes: "src/components/nph-tooltip/nph-tooltip.test.ts"
  evidencia_de_uso: "nph-label, pelo gatilho info"
  storybook: "src/components/nph-tooltip/nph-tooltip.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, quadro nph-tooltip 1237:5 e componente 1237:3"
---

# nph-tooltip

## Função

**O problema que resolve:** mostra uma explicação curta para o gatilho de informação
de um `nph-label`, sem transferir o foco para o balão.

**Quando usar:** quando o gatilho `info` de um `nph-label` precisar revelar uma
explicação curta.

**Quando NÃO usar:**

- **Texto de apoio ou mensagem de erro do campo** — isso é responsabilidade do
  `nph-field`.
- **Conteúdo que precisa de ação, foco ou contexto persistente** — use `nph-popover`.

## Variantes

**Por aparência, tamanho e densidade:** `nao_se_aplica`. O componente não tem variante
visual; o conteúdo chega pela propriedade `text`.

**Não combine com:** propriedades de título, ícone, ação, seta, borda ou
posicionamento. O componente é só o balão de texto; posicionar é responsabilidade do
consumidor.

## Estados

| Estado | Token | O que muda para a pessoa |
|---|---|---|
| Fechado | `nao_se_aplica` | O balão e seu texto não são mostrados |
| Aberto | `color/tooltip` | A explicação é mostrada pelo balão |

**Feedback e foco:** o balão abre somente pela ativação do gatilho, nunca no hover. O
foco permanece no gatilho; o balão não recebe foco.

**Regra de negócio que a peça carrega:** o texto acompanha a largura até
`layout/max-tooltip-width` e depois quebra somente entre palavras. Ele cabe inteiro em
até duas linhas, sem reticências, hifenização automática ou palavra partida. Texto
mais longo é erro de conteúdo.

**Estados de erro do domínio:** nenhum.

## Acessibilidade

| Critério | Regra |
|---|---|
| Semântica | O host é uma região viva `role="status"` desde a montagem, aberto ou fechado |
| Conteúdo anunciado | O texto recebido em `text` é o conteúdo anunciado pela região viva |
| Teclado e foco | O balão não recebe foco; o foco permanece no gatilho |
| Contraste | O texto usa `color/tooltip-foreground` sobre `color/tooltip` nos dois esquemas |
| Alternativa à cor | A explicação é transmitida pelo texto; a cor não é o único sinal |

## Relações

**Combina com:** `nph-label`.

**O que é pai:** `nph-label`, pelo gatilho `info`.

**O que é filho:** nada. O `nph-tooltip` contém só texto.

**Qual bloco esta peça complementa:** nenhum.

**Aparece nos layouts:** nenhum.

**Fronteira de responsabilidade:** quem abre, fecha e posiciona é o consumidor. O
`nph-tooltip` só mostra o texto quando `open` está ativo.

## Tokens, intenção e Dicas para IA

| Parte | Token |
|---|---|
| Fundo | `color/tooltip` |
| Texto | `text/body-sm` e `color/tooltip-foreground` |
| Raio | `radius/inner` |
| Padding vertical | `space/inline-tight` |
| Padding horizontal | `space/inline` |
| Elevação | `elevation/dropdown` |
| Largura máxima | `layout/max-tooltip-width` |
| Altura máxima | `layout/max-tooltip-height` |

**Restrições de uso:** não use borda nem seta. O padding aceito é
`space/inline-tight` na vertical e `space/inline` na horizontal.

**Dicas para IA:**

- Use `nph-tooltip` somente para a explicação curta aberta pelo gatilho `info` de
  `nph-label`.
- Não acrescente título, ícone, ação, seta ou borda.
- Não crie propriedade de posicionamento: quem abre e posiciona é o consumidor.
- Para conteúdo que pede foco ou ação, escolha `nph-popover`.

## Exemplos

**Caso recomendado:** o gatilho `info` de um `nph-label` abre uma explicação curta
sobre o preenchimento do campo.

**Caso alternativo:** uma explicação em duas linhas é mostrada inteira, sem truncamento
e sem partir palavras.

## Anti-padrões

- **Não usar para texto de apoio ou mensagem de erro do campo** — use `nph-field`.
- **Não abrir no hover** — abra somente pela ativação do gatilho.
- **Não cortar, truncar ou partir uma palavra para caber no balão** — corrija o
  conteúdo que exceder o limite.
- **Não aplicar `elevation/dropdown` numa subárvore com
  `data-nph-color-scheme` diferente da raiz** — a sombra pode usar a cor do esquema da
  raiz; esta é uma limitação conhecida do gerador de tokens.

## Fontes e decisões

- **`design.md` do repositório:** tokens semânticos, intenção e limites de uso do
  tooltip.
- **A decisão que originou:** P65, de 05-10-2026.
- **Testes:** `src/components/nph-tooltip/nph-tooltip.test.ts`.
- **Evidência de uso:** `nph-label`, pelo gatilho `info`.
- **Storybook:** `src/components/nph-tooltip/nph-tooltip.stories.ts`.
- **Figma:** quadro `nph-tooltip` (`1237:5`) e componente `1237:3` no
  `DS-IA-NEPHOS 5.0`.
