---
peca: nph-kbd
nivel: componente
status: vigente
resolve: >-
  Mostra uma tecla de atalho de teclado ao lado do que ela aciona, como peça
  estática.
use_quando:
  - "Mostrar o atalho de teclado ao lado da ação que ele aciona."
  - "Mostrar o atalho numa opção do nph-rich-option."
nao_use_quando:
  - "A peça precisaria ser clicável ou receber foco — use nph-button."
  - "A combinação viria numa peça só, como Ctrl+K — use uma peça por tecla, lado a lado."
api:
  text:
    tipo: string
    obrigatoria: true
    padrao: "vazio"
    reflete: false
    restricao: >-
      O texto de uma tecla, já localizado pela aplicação consumidora. Vazio ou
      só espaços não mostra nada e não é erro.
variantes: nao_se_aplica
estados:
  padrao:
    token: color/muted
    muda_para_a_pessoa: "A tecla aparece numa caixa; ela não muda com interação."
regras_de_negocio:
  - "Uma peça por tecla: a combinação junta as peças lado a lado."
erros_de_dominio: []
tokens:
  fundo: color/muted
  texto: [text/label-sm, color/muted-foreground]
  borda: [border/width, color/border]
  raio: radius/inner
  padding: space/inline-tight
dicas_para_ia:
  - "Use nph-kbd para mostrar um atalho ao lado do que ele aciona; para a ação em si, use nph-button."
  - "Numa combinação, ponha uma nph-kbd por tecla, lado a lado."
  - "Escreva a tecla pela propriedade text; não pinte a caixa nem o texto."
acessibilidade:
  semantica: "O texto fica dentro de `<kbd>`; o host não tem role extra."
  nome_acessivel: "O leitor de tela anuncia a tecla pelo texto dela."
  teclado: []
  foco: "A peça não recebe foco: ela não tem interação."
  contraste: "color/muted-foreground sobre color/muted passa 4,5:1 nos dois esquemas e em todas as marcas."
  alternativa_a_cor: "A tecla é escrita no texto; a cor não carrega significado."
combinacoes_invalidas:
  - "A combinação inteira numa peça só — use uma peça por tecla."
  - "Variante de estilo — não há uso declarado."
relacoes:
  combina_com: [nph-rich-option]
  pai: [nph-rich-option]
  filho: []
  complementa_bloco: []
  aparece_em: []
anti_padroes:
  - "Usar como botão ou controle."
  - "Criar variante de estilo."
  - "Pintar a caixa ou o texto à mão."
fontes:
  design_md: "design.md, text/label-sm, color/muted, color/muted-foreground, color/border, border/width, radius/inner e space/inline-tight"
  decisao: "P66 — API e semântica de nph-spinner, nph-separator e nph-kbd, 05-10-2026"
  testes: "src/components/nph-kbd/nph-kbd.test.ts"
  evidencia_de_uso: "nph-rich-option, pela opção de mostrar atalho"
  storybook: "src/components/nph-kbd/nph-kbd.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, quadro nph-kbd 1193:20 e componente 772:3"
---

# nph-kbd

## Função

**O problema que resolve:** mostra uma tecla de atalho de teclado ao lado do que ela
aciona. A peça é estática.

**Quando usar:**

- Ao lado da ação que o atalho aciona.
- Numa opção do `nph-rich-option`, pela opção de mostrar atalho.

**Quando NÃO usar:**

- **Como botão ou controle** — a peça não tem interação; use `nph-button`.
- **Para a combinação inteira numa peça só** — use uma peça por tecla, lado a lado.

## Variantes

**Por aparência, tamanho e densidade:** `nao_se_aplica`. O conteúdo chega pela
propriedade `text`.

**Não combine com:** variante de estilo, que não tem uso declarado.

## Estados

| Estado | Token | O que muda para a pessoa |
|---|---|---|
| Padrão | `color/muted` | A tecla aparece numa caixa; ela não muda com interação |

**Feedback e foco:** a peça não recebe foco nem reage a interação.

**Regra de negócio que a peça carrega:** uma peça por tecla. A combinação junta as
peças lado a lado.

**Estados de erro do domínio:** nenhum.

## Acessibilidade

| Critério | Regra |
|---|---|
| Semântica | O texto fica dentro de `<kbd>`; o host não tem role extra |
| Nome acessível | O leitor de tela anuncia a tecla pelo texto dela |
| Teclado e foco | A peça não recebe foco |
| Contraste | `color/muted-foreground` sobre `color/muted` passa 4,5:1 nos dois esquemas e em todas as marcas |
| Alternativa à cor | A tecla é escrita no texto; a cor não carrega significado |

## Relações

**Combina com:** `nph-rich-option`.

**O que é pai:** `nph-rich-option`, pela opção de mostrar atalho; e a linha de uma
ação que tem atalho.

**O que é filho:** nada. A `nph-kbd` contém só o texto da tecla.

**Qual bloco esta peça complementa:** nenhum.

**Aparece nos layouts:** nenhum.

## Tokens, intenção e Dicas para IA

| Parte | Token |
|---|---|
| Fundo | `color/muted` |
| Texto | `text/label-sm` e `color/muted-foreground` |
| Borda | `border/width` e `color/border`, como traço por dentro |
| Raio | `radius/inner` |
| Respiro | `space/inline-tight` nos quatro lados |

**Restrições de uso:** a cor vem dos tokens nos dois esquemas. A borda é traço por
dentro e não soma à altura da peça.

**Dicas para IA:**

- Use `nph-kbd` para mostrar um atalho ao lado do que ele aciona; para a ação em si,
  use `nph-button`.
- Numa combinação, ponha uma `nph-kbd` por tecla, lado a lado.
- Escreva a tecla pela propriedade `text`; não pinte a caixa nem o texto.

## Exemplos

**Caso recomendado:** ao lado do rótulo "Buscar", as peças `⌘` e `K`, lado a lado.

**Caso alternativo:** numa opção do `nph-rich-option`, a peça `K` mostra o atalho da
opção.

## Anti-padrões

- **Não usar como botão ou controle** — use `nph-button`.
- **Não criar variante de estilo** — não há uso declarado.
- **Não pintar a caixa ou o texto à mão** — a cor vem dos tokens.
- **Não juntar a combinação numa peça só** — use uma peça por tecla.

## Fontes e decisões

- **`design.md` do repositório:** `text/label-sm`, `color/muted`,
  `color/muted-foreground`, `color/border`, `border/width`, `radius/inner` e
  `space/inline-tight`.
- **A decisão que originou:** P66, de 05-10-2026.
- **Testes:** `src/components/nph-kbd/nph-kbd.test.ts`.
- **Evidência de uso:** `nph-rich-option`, pela opção de mostrar atalho.
- **Storybook:** `src/components/nph-kbd/nph-kbd.stories.ts`.
- **Figma:** quadro `nph-kbd` (`1193:20`) e componente `772:3` no
  `DS-IA-NEPHOS 5.0`.
