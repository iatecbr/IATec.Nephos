---
peca: nph-kbd
nivel: componente
status: vigente
resolve: >-
  Shows a keyboard shortcut key beside what it triggers, as a static
  piece.
use_quando:
  - "Showing the keyboard shortcut beside the action it triggers."
  - "Showing the shortcut in an option of nph-rich-option."
nao_use_quando:
  - "The piece would need to be clickable or receive focus — use nph-button."
  - "The combination would come in a single piece, such as Ctrl+K — use one piece per key, side by side."
api:
  text:
    tipo: string
    obrigatoria: true
    padrao: "vazio"
    reflete: false
    restricao: >-
      The text of one key, already localized by the consuming application. Empty or
      whitespace-only shows nothing and is not an error.
variantes: nao_se_aplica
estados:
  padrao:
    token: color/muted
    muda_para_a_pessoa: "The key appears in a box; it does not change with interaction."
regras_de_negocio:
  - "One piece per key: the combination puts the pieces side by side."
erros_de_dominio: []
tokens:
  fundo: color/muted
  texto: [text/label-sm, color/muted-foreground]
  borda: [border/width, color/border]
  raio: radius/inner
  padding: space/inline-tight
dicas_para_ia:
  - "Use nph-kbd to show a shortcut beside what it triggers; for the action itself, use nph-button."
  - "In a combination, put one nph-kbd per key, side by side."
  - "Write the key through the text property; do not paint the box or the text."
acessibilidade:
  semantica: "The text sits inside `<kbd>`; the host has no extra role."
  nome_acessivel: "The screen reader announces the key by its text."
  teclado: []
  foco: "The piece does not receive focus: it has no interaction."
  contraste: "color/muted-foreground on color/muted passes 4.5:1 in both schemes and in every brand."
  alternativa_a_cor: "The key is written in the text; color carries no meaning."
combinacoes_invalidas:
  - "The whole combination in a single piece — use one piece per key."
  - "Style variant — there is no declared use."
relacoes:
  combina_com: [nph-rich-option]
  pai: [nph-rich-option]
  filho: []
  complementa_bloco: []
  aparece_em: []
anti_padroes:
  - "Using it as a button or control."
  - "Creating a style variant."
  - "Painting the box or the text by hand."
fontes:
  design_md: "design.md, text/label-sm, color/muted, color/muted-foreground, color/border, border/width, radius/inner and space/inline-tight"
  decisao: "P66 — API and semantics of nph-spinner, nph-separator and nph-kbd, 05-10-2026"
  testes: "src/components/nph-kbd/nph-kbd.test.ts"
  evidencia_de_uso: "nph-rich-option, through the option of showing a shortcut"
  storybook: "src/components/nph-kbd/nph-kbd.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-kbd frame 1193:20 and component 772:3"
---

# nph-kbd

## Function

**The problem it solves:** shows a keyboard shortcut key beside what it
triggers. The piece is static.

**When to use:**

- Beside the action the shortcut triggers.
- In an option of `nph-rich-option`, through the option of showing a shortcut.

**When NOT to use:**

- **As a button or control** — the piece has no interaction; use `nph-button`.
- **For the whole combination in a single piece** — use one piece per key, side by side.

## Variants

**By appearance, size and density:** `nao_se_aplica`. The content arrives through the
`text` property.

**Do not combine with:** a style variant, which has no declared use.

## States

| State | Token | What changes for the person |
|---|---|---|
| Default | `color/muted` | The key appears in a box; it does not change with interaction |

**Feedback and focus:** the piece does not receive focus nor react to interaction.

**Business rule the piece carries:** one piece per key. The combination puts the
pieces side by side.

**Domain error states:** none.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | The text sits inside `<kbd>`; the host has no extra role |
| Accessible name | The screen reader announces the key by its text |
| Keyboard and focus | The piece does not receive focus |
| Contrast | `color/muted-foreground` on `color/muted` passes 4.5:1 in both schemes and in every brand |
| Alternative to color | The key is written in the text; color carries no meaning |

## Relations

**Combines with:** `nph-rich-option`.

**What is the parent:** `nph-rich-option`, through the option of showing a shortcut; and the row of an
action that has a shortcut.

**What is the child:** nothing. `nph-kbd` contains only the text of the key.

**Which block this piece complements:** none.

**Appears in layouts:** none.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Background | `color/muted` |
| Text | `text/label-sm` and `color/muted-foreground` |
| Border | `border/width` and `color/border`, as an inside stroke |
| Radius | `radius/inner` |
| Padding | `space/inline-tight` on all four sides |

**Usage restrictions:** the color comes from the tokens in both schemes. The border is an inside
stroke and does not add to the height of the piece.

**AI hints:**

- Use `nph-kbd` to show a shortcut beside what it triggers; for the action itself,
  use `nph-button`.
- In a combination, put one `nph-kbd` per key, side by side.
- Write the key through the `text` property; do not paint the box or the text.

## Examples

**Recommended case:** beside the label "Search", the pieces `⌘` and `K`, side by side.

**Alternative case:** in an option of `nph-rich-option`, the piece `K` shows the shortcut of the
option.

## Anti-patterns

- **Do not use as a button or control** — use `nph-button`.
- **Do not create a style variant** — there is no declared use.
- **Do not paint the box or the text by hand** — the color comes from the tokens.
- **Do not join the combination in a single piece** — use one piece per key.

## Sources and decisions

- **The repository `design.md`:** `text/label-sm`, `color/muted`,
  `color/muted-foreground`, `color/border`, `border/width`, `radius/inner` and
  `space/inline-tight`.
- **The decision that originated it:** P66, of 05-10-2026.
- **Tests:** `src/components/nph-kbd/nph-kbd.test.ts`.
- **Usage evidence:** `nph-rich-option`, through the option of showing a shortcut.
- **Storybook:** `src/components/nph-kbd/nph-kbd.stories.ts`.
- **Figma:** `nph-kbd` frame (`1193:20`) and component `772:3` in
  `DS-IA-NEPHOS 5.0`.
