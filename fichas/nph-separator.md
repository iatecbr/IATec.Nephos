---
peca: nph-separator
nivel: componente
status: vigente
resolve: >-
  Separa itens irmãos ou regiões de um contêiner com uma linha decorativa, sem
  carregar estado nem criar espaço.
use_quando:
  - "Separar grupos de itens num menu."
  - "Separar ações lado a lado numa barra de ações."
  - "Separar o cabeçalho do conteúdo num cartão."
nao_use_quando:
  - "Contornar um campo — a borda de campo é color/input, que cumpre 3:1."
  - "Afastar dois blocos — o espaço vem de space/stack ou space/section."
  - "Separar com texto no meio, como ou e e — não existe variante com texto."
api:
  orientation:
    tipo: enum
    valores: [horizontal, vertical]
    obrigatoria: false
    padrao: horizontal
    reflete: true
    restricao: >-
      Reflete porque o CSS interno seleciona a linha por ele. horizontal entre
      itens empilhados; vertical entre itens lado a lado. Valor fora da lista não
      desenha nada e emite console.error em desenvolvimento.
variantes:
  orientation:
    eixo: aparencia
    escolha_quando: "horizontal entre itens empilhados; vertical entre itens lado a lado."
    nao_combine_com: [texto]
estados:
  padrao:
    token: color/border
    muda_para_a_pessoa: "Uma linha separa os itens; ela não muda com interação."
regras_de_negocio:
  - "A espessura é sempre border/width e a cor é sempre color/border: mudar uma ou outra faria do divisor um sinal de estado."
  - "A horizontal preenche a largura em pai de bloco ou flex em coluna; a vertical preenche a altura em pai flex em linha ou grid. Fora disso, quem usa dá o comprimento."
erros_de_dominio: []
tokens:
  cor: color/border
  espessura: border/width
dicas_para_ia:
  - "Use nph-separator para separar itens irmãos ou regiões; para afastar blocos, use space/stack ou space/section."
  - "Use orientation vertical entre itens lado a lado, dentro de um pai flex em linha."
  - "Não use nph-separator como borda de campo: o campo usa color/input."
acessibilidade:
  semantica: "O host fica `aria-hidden`: o divisor é decorativo e não entra na árvore de acessibilidade."
  nome_acessivel: nao_se_aplica
  teclado: []
  foco: "O divisor não recebe foco."
  contraste: "É decorativo: color/border não precisa cumprir 3:1."
  alternativa_a_cor: "O divisor não carrega estado; a separação é estrutural."
combinacoes_invalidas:
  - "Texto no meio do divisor — não existe variante com texto."
  - "Espessura ou cor diferentes — o divisor viraria sinal de estado."
relacoes:
  combina_com: [nph-dropdown-menu, nph-button]
  pai: [nph-dropdown-menu]
  filho: []
  complementa_bloco: []
  aparece_em: []
anti_padroes:
  - "Usar o divisor como borda de campo."
  - "Usar o divisor como espaçador."
  - "Pôr texto no meio do divisor."
  - "Mudar a espessura ou a cor do divisor."
fontes:
  design_md: "design.md, color/border, border/width e layout/separator-width e layout/separator-height, que são o comprimento do mestre no Figma"
  decisao: "P66 — API e semântica de nph-spinner, nph-separator e nph-kbd, 05-10-2026"
  testes: "src/components/nph-separator/nph-separator.test.ts"
  evidencia_de_uso: "nph-dropdown-menu, entre grupos de itens, desenhado no Figma"
  storybook: "src/components/nph-separator/nph-separator.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, quadro nph-separator 1196:674 e conjunto 762:6"
---

# nph-separator

## Função

**O problema que resolve:** separa itens irmãos ou regiões de um contêiner com uma
linha decorativa. Separa, não afasta.

**Quando usar:**

- Entre grupos de itens num menu.
- Entre ações lado a lado numa barra de ações.
- Entre o cabeçalho e o conteúdo de um cartão.

**Quando NÃO usar:**

- **Como borda de campo** — o campo usa `color/input`, que cumpre 3:1.
- **Como espaçador** — o espaço entre blocos vem de `space/stack` ou
  `space/section`.
- **Com texto no meio** ("ou", "e") — não existe variante com texto.

## Variantes

| Variante | Valores | Escolha quando |
|---|---|---|
| `orientation` | `horizontal` (padrão), `vertical` | `horizontal` entre itens empilhados; `vertical` entre itens lado a lado |

**Por tamanho e densidade:** `nao_se_aplica`.

**Não combine com:** texto, espessura ou cor diferentes.

## Estados

| Estado | Token | O que muda para a pessoa |
|---|---|---|
| Padrão | `color/border` | Uma linha separa os itens; ela não muda com interação |

**Feedback e foco:** o divisor não recebe foco nem reage a interação.

**Regra de negócio que a peça carrega:** a espessura é sempre `border/width` e a cor
é sempre `color/border`. A horizontal preenche a largura em pai de bloco ou flex em
coluna; a vertical preenche a altura em pai flex em linha ou grid. Fora disso, quem
usa dá o comprimento.

**Estados de erro do domínio:** nenhum.

## Acessibilidade

| Critério | Regra |
|---|---|
| Semântica | O host fica `aria-hidden`: o divisor é decorativo |
| Nome acessível | `nao_se_aplica` |
| Teclado e foco | O divisor não recebe foco |
| Contraste | É decorativo: `color/border` não precisa cumprir 3:1 |
| Alternativa à cor | O divisor não carrega estado |

## Relações

**Combina com:** `nph-dropdown-menu` e `nph-button`, numa barra de ações.

**O que é pai:** `nph-dropdown-menu`, entre grupos de itens; barra de ações e cartão.

**O que é filho:** nada.

**Qual bloco esta peça complementa:** nenhum.

**Aparece nos layouts:** nenhum.

## Tokens, intenção e Dicas para IA

| Parte | Token |
|---|---|
| Cor | `color/border` |
| Espessura | `border/width` |

**Restrições de uso:** o comprimento vem do contêiner. `layout/separator-width` e
`layout/separator-height` são o comprimento do mestre no Figma e não são usados em
código.

**Dicas para IA:**

- Use `nph-separator` para separar itens irmãos ou regiões; para afastar blocos, use
  `space/stack` ou `space/section`.
- Use `orientation="vertical"` entre itens lado a lado, dentro de um pai flex em
  linha.
- Não use `nph-separator` como borda de campo: o campo usa `color/input`.

## Exemplos

**Caso recomendado:** num menu, `nph-separator` horizontal entre o grupo de perfil e
a ação de sair.

**Caso alternativo:** numa barra de ações, `nph-separator` vertical entre "Editar" e
"Excluir", num pai flex em linha.

## Anti-padrões

- **Não usar como borda de campo** — use `color/input`.
- **Não usar como espaçador** — use `space/stack` ou `space/section`.
- **Não pôr texto no meio** — não existe variante com texto.
- **Não mudar espessura ou cor** — o divisor viraria sinal de estado.

## Fontes e decisões

- **`design.md` do repositório:** `color/border`, `border/width`,
  `layout/separator-width` e `layout/separator-height`.
- **A decisão que originou:** P66, de 05-10-2026.
- **Testes:** `src/components/nph-separator/nph-separator.test.ts`.
- **Evidência de uso:** `nph-dropdown-menu`, entre grupos de itens, desenhado no
  Figma.
- **Storybook:** `src/components/nph-separator/nph-separator.stories.ts`.
- **Figma:** quadro `nph-separator` (`1196:674`) e conjunto `762:6` no
  `DS-IA-NEPHOS 5.0`.
