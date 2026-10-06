---
peca: nph-button
nivel: componente
status: vigente
resolve: >-
  Dá à pessoa um alvo claro para iniciar uma ação na tela em que ela está, e
  comunica pelo tipo e pela ênfase o peso dessa ação.
use_quando:
  - "Iniciar uma ação identificada por texto, como salvar ou enviar."
  - "Destacar a ação principal de um bloco diante das alternativas, pela ênfase."
  - "Ação universal sem texto, como fechar ou buscar, com nome acessível."
nao_use_quando:
  - "A pessoa vai para outro destino — isso é navegação, e não ação."
  - "Mostrar erro de campo — a validação é do campo, no nph-field."
  - "Ação com consequência, como excluir ou publicar, só com ícone — escreva o texto."
  - "Rotular um estado — use nph-badge."
api:
  severity:
    tipo: enum
    valores: [primary, secondary, info, warn, help, danger, success]
    obrigatoria: false
    padrao: primary
    reflete: true
    restricao: >-
      O tipo do Figma. Escolha pelo significado da ação, nunca pela cor.
      Reflete porque o CSS interno seleciona a cor por ele. Valor fora da lista
      não desenha nada e emite console.error em desenvolvimento.
  emphasis:
    tipo: enum
    valores: [solid, outline, light, ghost]
    obrigatoria: false
    padrao: solid
    reflete: true
    restricao: >-
      A ênfase do Figma: quanto a ação se destaca. outline, light e ghost só
      existem em primary, secondary e danger; nos outros tipos, só solid.
      Combinação fora disso não desenha nada e emite console.error em
      desenvolvimento.
  size:
    tipo: enum
    valores: [compact, default, large]
    obrigatoria: false
    padrao: default
    reflete: true
    restricao: >-
      O padrão default é decisão de Indiane em 05-10-2026, pela T4: compact fica
      preso ao contexto denso. large atende o alvo
      de toque de 44 px; compact nunca é alvo principal em tela de toque. Campo e
      botão lado a lado usam o mesmo tamanho. Valor fora da lista não desenha
      nada e emite console.error em desenvolvimento.
  text:
    tipo: string
    obrigatoria: false
    padrao: "vazio"
    reflete: false
    restricao: >-
      O que acontece ao clicar, já localizado pela aplicação consumidora. É o
      nome acessível. Fica numa linha. Sem texto, o botão é o só ícone.
  icon-start:
    tipo: string
    obrigatoria: false
    padrao: "vazio"
    reflete: false
    restricao: >-
      Um nome do núcleo do nph-icon antes do texto, em icon/size-sm. Pode
      conviver com icon-end. A propriedade é iconStart. Nome fora do núcleo não
      desenha nada e emite console.error em desenvolvimento.
  icon-end:
    tipo: string
    obrigatoria: false
    padrao: "vazio"
    reflete: false
    restricao: >-
      Um nome do núcleo do nph-icon depois do texto, em icon/size-sm. A
      propriedade é iconEnd. Nome fora do núcleo não desenha nada e emite
      console.error em desenvolvimento.
  label:
    tipo: string
    obrigatoria: false
    padrao: "vazio"
    reflete: false
    restricao: >-
      Nome acessível do só ícone, obrigatório nele: sem label, o só ícone não
      desenha nada e emite console.error em desenvolvimento. Com texto, não é
      usado. O nome label é decisão de Indiane em 05-10-2026 e supera o
      aria-label de 02-09-2026.
  disabled:
    tipo: boolean
    obrigatoria: false
    padrao: false
    reflete: true
    restricao: >-
      Desliga o botão: sai da ordem do Tab, não dispara clique e fica em
      state/disabled-opacity. Não é o único sinal: diga o motivo em texto
      quando houver.
  loading:
    tipo: boolean
    obrigatoria: false
    padrao: false
    reflete: true
    restricao: >-
      O carregando do Figma. O girador do nph-spinner entra no lugar do ícone de
      início, o de fim some e o texto fica. O botão continua focável e o clique
      não chega a quem usa.
variantes:
  severity:
    eixo: aparencia
    escolha_quando: "Pelo significado da ação: danger para o que apaga ou não tem volta; primary para a ação principal."
    nao_combine_com: ["outra ação primary solid no mesmo bloco"]
  emphasis:
    eixo: aparencia
    escolha_quando: "solid para a ação com peso; outline quando acompanha a principal e precisa se delimitar; light quando o contorno pesaria; ghost para ação terciária."
    nao_combine_com: ["outline, light ou ghost em info, warn, help ou success"]
  size:
    eixo: tamanho
    escolha_quando: "large em tela de toque e formulário principal; compact dentro de tabela, barra de ferramentas ou filtro; default no resto."
    nao_combine_com: ["compact como alvo principal em tela de toque", "tamanho diferente do campo ao lado"]
estados:
  default:
    token: "o fundo e o texto do tipo e da ênfase, no bloco tokens"
    muda_para_a_pessoa: "Repouso. A cor comunica o tipo da ação."
  hover-active:
    token: "o token de hover do par: color/*-hover e status/*-hover no solid; *-surface-hover e *-on-surface-hover no outline e no light; a superfície do tipo no ghost"
    muda_para_a_pessoa: "A superfície muda e confirma que o alvo responde."
  focus:
    token: "borda border/width na cor do tipo (focus/border no secondary) e halo focus/ring-width em focus/halo ou focus/halo-<matiz>"
    muda_para_a_pessoa: "Para quem usa o teclado, uma borda na cor da ação e um halo por fora marcam o foco, sem mudar o tamanho."
  disabled:
    token: state/disabled-opacity
    muda_para_a_pessoa: "O botão inteiro perde opacidade, sai do Tab e para de responder."
  loading:
    token: "o girador herda a cor do texto do par; nenhum token próprio"
    muda_para_a_pessoa: "O girador ocupa o lugar do ícone de início, o texto continua e o clique deixa de valer."
regras_de_negocio: []
erros_de_dominio: []
tokens:
  altura: [control/height-compact, control/height-default, control/height-large]
  espaco_interno: space/control-padding
  espaco_icone_texto: space/inline-tight
  raio: radius/control
  texto: text/label-md
  icone: [icon/size-sm, icon/size-md, icon/size-lg]
  desabilitado: state/disabled-opacity
  foco: [border/width, focus/border-radius-control, focus/ring-width, focus/radius-control-with-border, focus/border, focus/halo, focus/halo-info, focus/halo-warn, focus/halo-help, focus/halo-danger, focus/halo-success]
  solido_primary: [color/primary, color/primary-hover, color/primary-foreground]
  solido_secondary: [color/secondary, color/secondary-hover, color/secondary-foreground]
  solido_status: [status/info, status/info-hover, status/warning, status/warning-hover, status/help, status/help-hover, status/success, status/success-hover, status/on-solid]
  solido_danger: [color/destructive, color/destructive-hover, color/destructive-foreground]
  leve_primary: [color/primary-surface, color/primary-surface-hover, color/primary-on-surface, color/primary-on-surface-hover]
  leve_secondary: [color/muted, color/secondary-surface-hover, color/secondary-light, color/secondary-light-hover, color/secondary-foreground]
  leve_danger: [color/destructive-surface, color/destructive-surface-hover, color/destructive-on-surface, color/destructive-on-surface-hover]
dicas_para_ia:
  - "Ação que acontece na tela é nph-button. Ir para outro destino é navegação, e não botão."
  - "Escolha severity pelo significado da ação, nunca pela cor."
  - "Uma ação principal por bloco; as outras vão em outline, light ou ghost."
  - "Ponha size large em tela de toque e o mesmo tamanho do campo ao lado."
  - "Sem texto, preencha label; ação com consequência sempre tem texto."
  - "Enquanto a ação demora, use loading em vez de desligar o botão sem explicação."
  - "Não escolha a cor do ícone: ele herda a cor do texto."
acessibilidade:
  semantica: "Um botão nativo dentro do componente, com type=button. Nunca uma div com clique. No loading, o botão nativo leva aria-disabled e aria-busy."
  nome_acessivel: "O texto visível. Sem texto, o label, obrigatório."
  teclado:
    - "Tab entra e sai do botão."
    - "Enter aciona."
    - "Espaço aciona."
  foco: "Só para o teclado: borda na cor do tipo, encostada, e halo por fora, sem mudar o tamanho. A borda é o indicador. Limite conhecido: no escuro, color/primary fica abaixo de 3:1 contra o fundo em Gerencial, Recursos Humanos e Igrejas; a pendência é da Indiane desde 02-10-2026."
  contraste: "Texto e ícone passam 4,5:1 em todos os tipos e ênfases, nos dois esquemas e em todas as marcas; o menor valor é 4,64:1, no primary outline e light do esquema claro. A borda do outline passa 3:1. A borda de foco do primary tem o limite descrito em foco."
  alternativa_a_cor: "O texto diz o que acontece ao clicar; a cor nunca é o único sinal de intenção, foco ou estado."
combinacoes_invalidas:
  - "outline, light ou ghost em info, warn, help ou success — a matriz não os tem."
  - "Só ícone sem label — o leitor de tela anunciaria só botão."
  - "Dois ícones sem texto — não dizem a ação."
  - "Só ícone em ação com consequência, como excluir ou publicar — escreva o texto."
  - "compact como alvo principal em tela de toque — 28 px contra os 44 px recomendados."
relacoes:
  combina_com: [nph-icon, nph-spinner, nph-input, nph-field]
  pai: ["formulário", "barra de ações", "rodapé de diálogo"]
  filho: [nph-icon, nph-spinner]
  complementa_bloco: []
  aparece_em: []
anti_padroes:
  - "Mostrar erro de campo no botão."
  - "Usar o botão para navegar a outro destino."
  - "Aumentar o ícone para dar destaque."
  - "Usar a cor como único sinal de intenção, foco ou estado."
  - "Remover ou redesenhar o foco."
  - "Misturar tamanhos entre botão e campo lado a lado."
  - "Pintar o botão à mão ou criar tipo, ênfase ou tamanho fora da matriz."
fontes:
  design_md: "design.md, control/height-*, space/control-padding, space/inline-tight, radius/control, text/label-md, icon/size-*, state/disabled-opacity, focus/* e as cores color/* e status/* do bloco tokens"
  decisao: "P68 — API e semântica de nph-badge e nph-button, 05-10-2026; B1, B5 e B6 do Registro de decisões; hover sólido nos tokens de hover, 02-10-2026; size padrão default e o nome label, decisões de Indiane em 05-10-2026"
  testes: "src/components/nph-button/nph-button.test.ts e nph-button.docs.test.ts"
  evidencia_de_uso: "pendente — nenhuma tela aprovada consome o botão ainda"
  storybook: "src/components/nph-button/nph-button.stories.ts e nph-button.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, quadro nph-button 1197:5449 e conjuntos 461:13009 e 498:15671"
---

# nph-button

## Função

**O problema que resolve:** dá à pessoa um alvo claro para iniciar uma ação na tela em
que ela está, e comunica pelo tipo e pela ênfase o peso dessa ação.

**Quando usar:**

- Para iniciar uma ação identificada por texto, como salvar ou enviar.
- Para destacar a ação principal de um bloco diante das alternativas, pela ênfase.
- Sem texto, para uma ação universal, como fechar ou buscar, com nome acessível.

**Quando NÃO usar:**

- **Para ir a outro destino** — isso é navegação, e não ação.
- **Para mostrar erro de campo** — a validação é do campo, no `nph-field`.
- **Só com ícone em ação com consequência**, como excluir ou publicar — escreva o texto.
- **Para rotular um estado** — use `nph-badge`.

## Variantes

**Por aparência:** `severity` (o tipo do Figma) e `emphasis` (a ênfase).

- `severity` é escolhido **estritamente** pelo significado da ação, nunca pela cor.
- `emphasis`: `solid` para a ação com peso; `outline` quando ela acompanha a principal e
  precisa se delimitar; `light` quando o contorno pesaria; `ghost` para ação terciária.
  `outline`, `light` e `ghost` existem **só** em `primary`, `secondary` e `danger`.

**Por tamanho:** `compact` (28), `default` (36, o padrão) e `large` (44). `large`
atende o alvo de toque de 44 px. `compact` fica preso a tabela, barra de
ferramentas ou filtro e nunca é alvo principal em tela de toque (T4).

**Por densidade:** `nao_se_aplica`.

**Sem texto:** o botão é o só ícone — quadrado, na altura do controle, com o ícone
acompanhando a caixa: `sm` no `compact`, `md` no `default` e `lg` no `large`.

**Não combine com:** outra ação `primary` `solid` no mesmo bloco; `compact` como alvo
principal em tela de toque; tamanho diferente do campo ao lado.

## Estados

| Estado | Token | O que muda para a pessoa |
|---|---|---|
| `default` | o fundo e o texto do tipo e da ênfase | Repouso. A cor comunica o tipo da ação |
| `hover-active` | `color/*-hover` e `status/*-hover` no `solid`; `*-surface-hover` e `*-on-surface-hover` no `outline` e no `light`; a superfície do tipo no `ghost` | A superfície muda e confirma que o alvo responde |
| `focus` | borda `border/width` na cor do tipo (`focus/border` no `secondary`) e halo `focus/ring-width` em `focus/halo` ou `focus/halo-<matiz>` | Uma borda na cor da ação e um halo por fora marcam o foco, sem mudar o tamanho |
| `disabled` | `state/disabled-opacity` | O botão inteiro perde opacidade, sai do Tab e para de responder |
| `loading` | o girador herda a cor do texto | O girador ocupa o lugar do ícone de início, o texto continua e o clique deixa de valer |

**Feedback e foco:** o foco aparece só para quem usa o teclado e **não se remove**. A
borda é o indicador; o halo é a segunda camada. Limite conhecido: no escuro,
`color/primary` fica abaixo de 3:1 contra o fundo em Gerencial, Recursos Humanos e
Igrejas, pendência da Indiane desde 02-10-2026.

**Regra de negócio que a peça carrega:** `nao_se_aplica`. O botão dispara a ação que a
tela define.

**Estados de erro do domínio:** `nao_se_aplica`. Erro é do campo, nunca do botão.

## Acessibilidade

| Critério | Regra |
|---|---|
| Semântica | Um botão nativo dentro do componente, com `type=button`. Nunca uma `div` com clique. No `loading`, o botão nativo leva `aria-disabled` e `aria-busy` |
| Nome acessível | O texto visível. Sem texto, o `label`, obrigatório |
| Teclado | Tab entra e sai; Enter e Espaço acionam |
| Foco | Só para o teclado: borda na cor do tipo e halo por fora, sem mudar o tamanho. No escuro, a borda do `primary` fica abaixo de 3:1 contra o fundo em Gerencial, Recursos Humanos e Igrejas (pendência de 02-10-2026) |
| Contraste | Texto e ícone passam 4,5:1 em todos os tipos e ênfases, nos dois esquemas e em todas as marcas; o menor valor é 4,64:1, no `primary` `outline` e `light` do esquema claro. A borda do `outline` passa 3:1 |
| Alternativa à cor | O texto diz o que acontece ao clicar; a cor nunca é o único sinal |

## Relações

**Combina com:** `nph-icon`, `nph-spinner`, `nph-input` e `nph-field`.

**O que é pai:** formulário, barra de ações e rodapé de diálogo.

**O que é filho:** `nph-icon`, por `icon-start` e `icon-end`, e `nph-spinner`, no
`loading`. O botão não tem slot.

**Qual bloco esta peça complementa:** nenhum ainda.

**Aparece nos layouts:** nenhum ainda.

## Tokens, intenção e Dicas para IA

| Parte | Token |
|---|---|
| Altura | `control/height-compact`, `-default` ou `-large` |
| Respiro lateral | `space/control-padding` |
| Espaço entre ícone e texto | `space/inline-tight` |
| Raio | `radius/control` |
| Texto | `text/label-md`, igual em todos os tamanhos |
| Ícone | `icon/size-sm` com texto; `sm`, `md` ou `lg` no só ícone |
| `solid` | `color/primary`, `color/secondary`, `status/<matiz>` ou `color/destructive`, com o hover e o texto do par |
| `outline` | a superfície clara do tipo, com a borda e o texto na mesma cor, por dentro |
| `light` | a superfície clara do tipo, sem borda |
| `ghost` | sem fundo em repouso; a superfície do tipo no hover |
| Foco | `border/width`, `focus/border-radius-control`, `focus/ring-width`, `focus/radius-control-with-border`, `focus/border`, `focus/halo` e `focus/halo-<matiz>` |

**Restrições de uso:** o componente não escolhe altura, cor, raio nem tipografia: tudo
vem de token. Os limites L-a e L-b estão na P68: `status/on-solid` e `focus/halo` saem só na raiz
até o gerador de tokens os redeclarar por esquema e por marca (L-a), e o `use` de alguns
tokens no `design.md` ainda não cita este uso (L-b).

**Dicas para IA:**

- Ação que acontece na tela é `nph-button`. Ir para outro destino é navegação, e não
  botão.
- Escolha `severity` pelo significado da ação, nunca pela cor.
- Uma ação principal por bloco; as outras vão em `outline`, `light` ou `ghost`.
- Ponha `size` `large` em tela de toque e o mesmo tamanho do campo ao lado.
- Sem texto, preencha `label`; ação com consequência sempre tem texto.
- Enquanto a ação demora, use `loading` em vez de desligar o botão sem explicação.
- Não escolha a cor do ícone: ele herda a cor do texto.

## Exemplos

**Caso recomendado:** no rodapé de um formulário, "Salvar" em `primary` `solid` ao lado
de "Cancelar" em `secondary` `outline`, os dois em `size` `default`.

**Caso alternativo:** "Excluir conta" em `danger` `solid`, sempre com texto; e, para a
ação universal de fechar, o só ícone `xmark` em `secondary` `ghost`, com `label` "Fechar".

## Anti-padrões

- **Não mostrar erro de campo no botão** — a validação é do `nph-field`.
- **Não usar o botão para navegar** a outro destino.
- **Não aumentar o ícone** para dar destaque.
- **Não usar a cor como único sinal** de intenção, foco ou estado.
- **Não remover nem redesenhar o foco.**
- **Não misturar tamanhos** entre botão e campo lado a lado.
- **Combinações inválidas:** `outline`, `light` ou `ghost` em `info`, `warn`, `help` ou
  `success`; só ícone sem `label`; dois ícones sem texto; só ícone em ação com
  consequência; `compact` como alvo principal em tela de toque.
- **Não criar sem decisão:** tipo, ênfase, tamanho ou cor fora da matriz.

## Fontes e decisões

- **`design.md` do repositório:** `control/height-*`, `space/control-padding`,
  `space/inline-tight`, `radius/control`, `text/label-md`, `icon/size-*`,
  `state/disabled-opacity`, `focus/*` e as cores `color/*` e `status/*`.
- **A decisão que originou:** P68, de 05-10-2026; B1, B5 e B6 do Registro de decisões;
  o `size` padrão `default` e o nome `label`, decididos por Indiane em 05-10-2026;
  o hover sólido nos tokens de hover, decidido por Indiane em 02-10-2026, que supera a
  B4. O quadro foi aceito em 01-10-2026 e completado em 02-10-2026.
- **Testes:** `src/components/nph-button/nph-button.test.ts` e `nph-button.docs.test.ts`.
- **Evidência de uso:** pendente — nenhuma tela aprovada consome o botão ainda.
- **Storybook:** `src/components/nph-button/nph-button.stories.ts` (Validação) e
  `nph-button.docs.stories.ts` (Docs).
- **Figma:** quadro `nph-button` (`1197:5449`) e conjuntos `461:13009` e `498:15671` no
  `DS-IA-NEPHOS 5.0`.
