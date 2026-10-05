---
peca: nph-spinner
nivel: componente
status: vigente
resolve: >-
  Mostra que o sistema está trabalhando quando a espera não tem hora para
  acabar, sem ser o único sinal de que algo está acontecendo.
use_quando:
  - "Salvar um formulário, buscar dados ou esperar a resposta de um botão, com texto de estado ao lado."
  - "A espera é curta e a pessoa precisa ver que o clique funcionou."
nao_use_quando:
  - "O progresso é conhecido — mostre o progresso em texto ou percentual; o girador não serve."
  - "O girador seria o único sinal de espera — escreva ao lado o que está acontecendo ou dê um label."
  - "A peça precisaria receber clique ou foco — o alvo é o controle em volta."
api:
  size:
    tipo: enum
    valores: [sm, md]
    obrigatoria: false
    padrao: sm
    reflete: true
    restricao: >-
      Reflete porque o CSS interno seleciona o desenho por ele. sm dentro de
      botão ou campo; md em área de conteúdo, cartão ou bloco em destaque. Não
      existe lg. Valor fora da lista não desenha nada e emite console.error em
      desenvolvimento.
  label:
    tipo: string
    obrigatoria: false
    padrao: "vazio"
    reflete: false
    restricao: >-
      Nome acessível do girador quando não há texto de estado ao lado. Vazio ou
      só espaços deixa o girador decorativo, fora da árvore de acessibilidade.
variantes:
  size:
    eixo: tamanho
    escolha_quando: "sm dentro de botão ou campo; md em área de conteúdo, cartão ou bloco em destaque."
    nao_combine_com: [lg, type]
estados:
  girando:
    token: motion/loop-duration
    muda_para_a_pessoa: "O circle-notch gira continuamente enquanto a espera dura."
  movimento-reduzido:
    token: nao_se_aplica
    muda_para_a_pessoa: "Com movimento reduzido pedido pelo sistema, o giro para e o aviso continua pelo texto ou pelo label."
regras_de_negocio:
  - "O girador nunca é o único sinal de espera: há texto de estado ao lado ou label."
  - "A cor herda do contexto; o girador não tem propriedade de cor."
erros_de_dominio: []
tokens:
  tamanho: [icon/size-sm, icon/size-md]
  duracao: motion/loop-duration
  curva: motion/loop-easing
  cor_solto: color/foreground
dicas_para_ia:
  - "Use nph-spinner quando a espera não tem hora para acabar; com progresso conhecido, mostre o progresso."
  - "Ponha sempre um texto de estado ao lado, como Salvando…; sem texto, preencha label."
  - "Use size sm dentro de botão ou campo e md em área de conteúdo."
  - "A arte é o circle-notch do nph-icon; não use o spinner clássico, que gira em passos."
acessibilidade:
  semantica: "Com label, o host é `role=img` com `aria-label`. Sem label, o host fica `aria-hidden` e o texto ao lado dá o aviso."
  nome_acessivel: "O label, quando não há texto de estado ao lado."
  teclado: []
  foco: "O girador não recebe foco; quem recebe é o controle em volta."
  contraste: "Solto, usa color/foreground, acima de 3:1 nos dois esquemas; dentro de um controle, vale o par do texto do controle."
  alternativa_a_cor: "O aviso vem do texto de estado ou do label; a cor não carrega significado."
combinacoes_invalidas:
  - "size lg — não existe; o maior tamanho é md."
  - "Propriedade type, inclusive a antiga Type=Mirrored do kit — foi removida."
  - "Girador sem texto ao lado e sem label — vira o único sinal de espera."
  - "Girador para progresso conhecido — mostre o progresso."
relacoes:
  combina_com: [nph-icon, nph-button]
  pai: [nph-button]
  filho: [nph-icon]
  complementa_bloco: []
  aparece_em: []
anti_padroes:
  - "Usar o girador como único sinal de espera."
  - "Esticar, girar à mão ou recolorir o girador."
  - "Trocar a arte do circle-notch por outro ícone, inclusive o spinner clássico."
  - "Manter o giro quando o sistema pede movimento reduzido."
fontes:
  design_md: "design.md, motion/loop-duration, motion/loop-easing, icon/size-sm, icon/size-md e o circle-notch em icones_nucleo"
  decisao: "P66 — API e semântica de nph-spinner, nph-separator e nph-kbd, 05-10-2026"
  testes: "src/components/nph-spinner/nph-spinner.test.ts"
  evidencia_de_uso: "nph-button, no state carregando, previsto no Lote B"
  storybook: "src/components/nph-spinner/nph-spinner.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, quadro nph-spinner 1195:22210 e conjunto 281:11"
---

# nph-spinner

## Função

**O problema que resolve:** mostra que o sistema está trabalhando quando a espera
não tem hora para acabar, sem ser o único sinal de que algo está acontecendo.

**Quando usar:**

- Ao salvar um formulário, buscar dados ou esperar a resposta de um botão, com um
  texto de estado ao lado, como "Salvando…".
- Quando a espera é curta e a pessoa precisa ver que o clique funcionou.

**Quando NÃO usar:**

- **Progresso conhecido** — mostre o progresso em texto ou percentual.
- **Como único sinal de espera** — escreva ao lado o que está acontecendo ou dê um
  `label`.
- **Como alvo de clique ou foco** — o alvo é o controle em volta.

## Variantes

| Variante | Valores | Escolha quando |
|---|---|---|
| `size` | `sm` (padrão), `md` | `sm` dentro de botão ou campo; `md` em área de conteúdo, cartão ou bloco em destaque |

**Por aparência e densidade:** `nao_se_aplica`.

**Não combine com:** `lg`, que não existe, nem `type`, inclusive a antiga
`Type=Mirrored` do kit, que foi removida. Não crie tamanho novo.

## Estados

| Estado | Token | O que muda para a pessoa |
|---|---|---|
| Girando | `motion/loop-duration` e `motion/loop-easing` | O `circle-notch` gira continuamente enquanto a espera dura |
| Movimento reduzido | `nao_se_aplica` | O giro para, e o aviso continua pelo texto ou pelo `label` |

**Feedback e foco:** o girador não recebe clique nem foco. O foco é do controle em
volta.

**Regra de negócio que a peça carrega:** o girador nunca é o único sinal de espera.
A cor herda do contexto: solto, resolve em `color/foreground`; dentro de um controle,
segue a cor do texto do controle.

**Estados de erro do domínio:** nenhum.

## Acessibilidade

| Critério | Regra |
|---|---|
| Semântica | Com `label`, o host é `role="img"` com `aria-label`. Sem `label`, o host fica `aria-hidden` |
| Nome acessível | O `label`, quando não há texto de estado ao lado. Com texto ao lado, o girador é decorativo, para o leitor de tela não ler duas vezes |
| Teclado e foco | O girador não recebe foco |
| Movimento | Com `prefers-reduced-motion: reduce`, o giro para (WCAG 2.3.3). Reduzir movimento não é remover o aviso |
| Contraste | Solto, `color/foreground` fica acima de 3:1 nos dois esquemas; dentro de um controle, vale o par do texto do controle |
| Alternativa à cor | O aviso vem do texto ou do `label` |

## Relações

**Combina com:** `nph-icon` e `nph-button`.

**O que é pai:** `nph-button`, no estado de carregamento.

**O que é filho:** `nph-icon`, com o `circle-notch` no mesmo `size`.

**Qual bloco esta peça complementa:** nenhum.

**Aparece nos layouts:** nenhum.

## Tokens, intenção e Dicas para IA

| Parte | Token |
|---|---|
| Tamanho | `icon/size-sm` e `icon/size-md`, pelo `nph-icon` |
| Duração da volta | `motion/loop-duration` |
| Curva | `motion/loop-easing` |
| Cor, solto | `color/foreground`, por herança |

**Restrições de uso:** a cor vem sempre do contexto. A arte é sempre o
`circle-notch` do `nph-icon`, feito para rotação contínua.

**Dicas para IA:**

- Use `nph-spinner` quando a espera não tem hora para acabar; com progresso
  conhecido, mostre o progresso.
- Ponha sempre um texto de estado ao lado, como "Salvando…"; sem texto, preencha
  `label`.
- Use `size="sm"` dentro de botão ou campo e `size="md"` em área de conteúdo.
- A arte é o `circle-notch`; não use o `spinner` clássico, que gira em passos.

## Exemplos

**Caso recomendado:** ao salvar um formulário, `nph-spinner` em `sm` ao lado do
texto "Salvando…", decorativo.

**Caso alternativo:** ao carregar uma área de conteúdo sem texto visível,
`nph-spinner` em `md` com `label` "Carregando resultados".

## Anti-padrões

- **Não usar como único sinal de espera** — dê texto ao lado ou `label`.
- **Não esticar, girar à mão ou recolorir** — tamanho e cor vêm dos tokens e do
  contexto.
- **Não trocar a arte** — o desenho é o `circle-notch` do `nph-icon`.
- **Não manter o giro com movimento reduzido** — o giro para e o aviso continua.
- **Não usar com progresso conhecido** — mostre o progresso.

## Fontes e decisões

- **`design.md` do repositório:** `motion/loop-duration`, `motion/loop-easing`,
  `icon/size-sm`, `icon/size-md` e o `circle-notch` no núcleo de ícones.
- **A decisão que originou:** P66, de 05-10-2026.
- **Testes:** `src/components/nph-spinner/nph-spinner.test.ts`.
- **Evidência de uso:** `nph-button`, no estado de carregamento, previsto no Lote B.
- **Storybook:** `src/components/nph-spinner/nph-spinner.stories.ts`.
- **Figma:** quadro `nph-spinner` (`1195:22210`) e conjunto `281:11` no
  `DS-IA-NEPHOS 5.0`.
