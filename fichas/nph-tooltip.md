---
peca: nph-tooltip
nivel: componente
status: vigente
resolve: >-
  Shows a short explanation for the information trigger of an nph-label without
  moving focus to the bubble.
use_quando:
  - "The info trigger of an nph-label needs to reveal a short explanation."
nao_use_quando:
  - "The information is helper text or a field error message — that is the responsibility of nph-field."
  - "The content needs an action, focus or persistent context — use nph-popover."
api:
  text:
    tipo: string
    obrigatoria: true
    padrao: "vazio"
    reflete: false
    restricao: >-
      Carries the bubble text, already localized by the consuming application. Empty
      or whitespace-only does not show the bubble.
  open:
    tipo: boolean
    obrigatoria: false
    padrao: false
    reflete: true
    restricao: >-
      Shows or hides the bubble. Opening, closing and positioning are the
      responsibility of the consumer.
variantes: nao_se_aplica
estados:
  fechado:
    token: nao_se_aplica
    muda_para_a_pessoa: "The bubble and its text are not shown."
  aberto:
    token: color/tooltip
    muda_para_a_pessoa: "The explanation is shown by the bubble."
regras_de_negocio:
  - "The bubble opens only on trigger activation; it does not open on hover."
  - "The text fits entirely in up to two lines, without ellipsis, automatic hyphenation or broken words."
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
  - "Use nph-tooltip only for the short explanation opened by the info trigger of nph-label."
  - "Do not add a title, icon, action, arrow or border."
  - "Do not create a positioning property: the consumer opens and positions it."
  - "For content that asks for focus or action, choose nph-popover."
acessibilidade:
  semantica: "The host is a `role=status` live region from mount, open or closed."
  nome_acessivel: "The text received in text is the content announced by the live region."
  teclado: []
  foco: "The bubble does not receive focus; focus stays on the trigger."
  contraste: "The text uses color/tooltip-foreground on color/tooltip in both schemes."
  alternativa_a_cor: "The explanation is conveyed by the text; color is not the only signal."
combinacoes_invalidas:
  - "Opening on hover — the bubble opens only on trigger activation."
  - "Adding a title, icon, action, arrow or border — the scope is text only."
  - "Moving focus to the bubble — focus stays on the trigger."
  - "Using nph-tooltip for content with action or focus — use nph-popover."
relacoes:
  combina_com: [nph-label]
  pai: [nph-label]
  filho: []
  complementa_bloco: []
  aparece_em: []
anti_padroes:
  - "Using the bubble as helper text or a field error message."
  - "Opening the bubble on hover."
  - "Cutting, truncating or breaking a word to fit in the bubble."
  - "Applying elevation/dropdown in a subtree with a data-nph-color-scheme different from the root: the shadow may use the color of the root scheme."
fontes:
  design_md: "design.md, section on color/tooltip, color/tooltip-foreground, layout/max-tooltip-width, layout/max-tooltip-height, radius/inner and tooltip"
  decisao: "P65 — API and semantics of nph-tooltip, 05-10-2026"
  testes: "src/components/nph-tooltip/nph-tooltip.test.ts"
  evidencia_de_uso: "nph-label, through the info trigger"
  storybook: "src/components/nph-tooltip/nph-tooltip.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-tooltip frame 1237:5 and component 1237:3"
---

# nph-tooltip

## Function

**The problem it solves:** shows a short explanation for the information trigger of
an `nph-label`, without moving focus to the bubble.

**When to use:** when the `info` trigger of an `nph-label` needs to reveal a short
explanation.

**When NOT to use:**

- **Helper text or a field error message** — that is the responsibility of
  `nph-field`.
- **Content that needs an action, focus or persistent context** — use `nph-popover`.

## Variants

**By appearance, size and density:** `nao_se_aplica`. The component has no visual
variant; the content arrives through the `text` property.

**Do not combine with:** title, icon, action, arrow, border or positioning
properties. The component is only the text bubble; positioning is the responsibility
of the consumer.

## States

| State | Token | What changes for the person |
|---|---|---|
| Closed | `nao_se_aplica` | The bubble and its text are not shown |
| Open | `color/tooltip` | The explanation is shown by the bubble |

**Feedback and focus:** the bubble opens only on trigger activation, never on hover.
Focus stays on the trigger; the bubble does not receive focus.

**Business rule the piece carries:** the text follows the width up to
`layout/max-tooltip-width` and then breaks only between words. It fits entirely in
up to two lines, without ellipsis, automatic hyphenation or broken words. Longer text
is a content error.

**Domain error states:** none.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | The host is a `role="status"` live region from mount, open or closed |
| Announced content | The text received in `text` is the content announced by the live region |
| Keyboard and focus | The bubble does not receive focus; focus stays on the trigger |
| Contrast | The text uses `color/tooltip-foreground` on `color/tooltip` in both schemes |
| Alternative to color | The explanation is conveyed by the text; color is not the only signal |

## Relations

**Combines with:** `nph-label`.

**What is the parent:** `nph-label`, through the `info` trigger.

**What is the child:** nothing. `nph-tooltip` contains only text.

**Which block this piece complements:** none.

**Appears in layouts:** none.

**Responsibility boundary:** the consumer opens, closes and positions it.
`nph-tooltip` only shows the text when `open` is active.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Background | `color/tooltip` |
| Text | `text/body-sm` and `color/tooltip-foreground` |
| Radius | `radius/inner` |
| Vertical padding | `space/inline-tight` |
| Horizontal padding | `space/inline` |
| Elevation | `elevation/dropdown` |
| Maximum width | `layout/max-tooltip-width` |
| Maximum height | `layout/max-tooltip-height` |

**Usage restrictions:** do not use a border or an arrow. The accepted padding is
`space/inline-tight` vertically and `space/inline` horizontally.

**AI hints:**

- Use `nph-tooltip` only for the short explanation opened by the `info` trigger of
  `nph-label`.
- Do not add a title, icon, action, arrow or border.
- Do not create a positioning property: the consumer opens and positions it.
- For content that asks for focus or action, choose `nph-popover`.

## Examples

**Recommended case:** the `info` trigger of an `nph-label` opens a short explanation
about filling in the field.

**Alternative case:** a two-line explanation is shown in full, without truncation
and without breaking words.

## Anti-patterns

- **Do not use for helper text or a field error message** — use `nph-field`.
- **Do not open on hover** — open only on trigger activation.
- **Do not cut, truncate or break a word to fit in the bubble** — fix the content
  that exceeds the limit.
- **Do not apply `elevation/dropdown` in a subtree with a
  `data-nph-color-scheme` different from the root** — the shadow may use the color of
  the root scheme; this is a known limitation of the token generator.

## Sources and decisions

- **The repository `design.md`:** semantic tokens, intent and usage limits of the
  tooltip.
- **The decision that originated it:** P65, of 05-10-2026.
- **Tests:** `src/components/nph-tooltip/nph-tooltip.test.ts`.
- **Usage evidence:** `nph-label`, through the `info` trigger.
- **Storybook:** `src/components/nph-tooltip/nph-tooltip.stories.ts`.
- **Figma:** `nph-tooltip` frame (`1237:5`) and component `1237:3` in
  `DS-IA-NEPHOS 5.0`.
