---
peca: nph-badge
nivel: componente
status: vigente
resolve: >-
  Labels the state or category of an item with one or two words, so the
  person recognizes the item without reading the detail.
use_quando:
  - "Labeling the state of an item, such as that of a document or a request."
  - "Labeling the category of an item."
  - "Reinforcing the word with a core icon, when the icon helps recognize the state."
nao_use_quando:
  - "The piece would need to receive click or focus — use nph-button."
  - "The word does not exist and only the icon would be left — without text there is no badge."
  - "The text is a sentence — the supporting text stays outside the piece, next to the badge."
  - "The item already has a status badge — one state per item."
api:
  severity:
    tipo: enum
    valores: [primary, secondary, info, warn, help, danger, success]
    obrigatoria: false
    padrao: primary
    reflete: true
    restricao: >-
      The Figma type. Choose by meaning: a permanent state uses
      secondary or primary; success confirms an event that has just
      happened. It reflects because the internal CSS selects the color by it. A value
      outside the list draws nothing and emits console.error in development.
  emphasis:
    tipo: enum
    valores: [solid, light]
    obrigatoria: false
    padrao: solid
    reflete: true
    restricao: >-
      The Figma emphasis. It reflects because the internal CSS selects the color by it.
      A value outside the list draws nothing and emits console.error in
      development.
  text:
    tipo: string
    obrigatoria: true
    padrao: "vazio"
    reflete: false
    restricao: >-
      One or two words, already localized by the consuming application. It is the
      accessible name. Empty or whitespace-only shows nothing and is not an error: no word,
      no badge.
  icon:
    tipo: string
    obrigatoria: false
    padrao: "vazio"
    reflete: false
    restricao: >-
      A name from the nph-icon core, drawn before the text in icon/size-sm and
      in the text color. Empty leaves the badge without an icon. A name outside the core
      draws nothing and emits console.error in development.
variantes:
  severity:
    eixo: aparencia
    escolha_quando: "By the meaning of the state or category, never by the color."
    nao_combine_com: ["success in a permanent state"]
  emphasis:
    eixo: aparencia
    escolha_quando: "solid when the badge needs weight; light when it accompanies the item without competing for attention."
    nao_combine_com: []
estados:
  padrao:
    token: "the background and text pair of the type and emphasis, in the tokens block"
    muda_para_a_pessoa: "The badge shows the word; it does not change with interaction, because it receives neither click, focus nor hover."
regras_de_negocio:
  - "One state per item."
  - "Without text there is no badge."
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
  - "Use nph-badge to label the state or category of an item; for an action, use nph-button."
  - "Choose severity by meaning. A permanent state is secondary or primary; success is the event that has just happened."
  - "Write one or two words in text. A supporting sentence stays outside the badge."
  - "Turn on icon only to reinforce the word; the icon inherits the text color."
  - "Do not paint the background or the text: the color comes from severity and emphasis."
acessibilidade:
  semantica: "Text only, without a role. The icon is decorative."
  nome_acessivel: "The badge text."
  teclado: []
  foco: "The badge receives neither focus nor click."
  contraste: "The text passes 4.5:1 in every type and emphasis, in both schemes and in every brand; the lowest value is 4.64:1, in the primary light of the light scheme."
  alternativa_a_cor: "Every badge has text; color is never the only signal, and the icon only reinforces the word."
combinacoes_invalidas:
  - "A badge without text, with only an icon — without a word there is no badge."
  - "Two status badges on the same item — one state per item."
  - "A clickable badge, with hover or with focus — use nph-button."
  - "A badge with a count — the badge labels state or category."
  - "emphasis other than solid and light — it does not exist."
relacoes:
  combina_com: [nph-icon]
  pai: ["list or table row", "item header"]
  filho: [nph-icon]
  complementa_bloco: []
  aparece_em: []
anti_padroes:
  - "Using it as a button."
  - "Using success as a permanent badge."
  - "Putting a sentence inside the badge."
  - "Painting the background or the text by hand."
  - "Creating a type or emphasis outside the list."
fontes:
  design_md: "design.md, text/label-sm, radius/full, space/inline-tight, space/control-padding, icon/size-sm and the color/* and status/* colors of the tokens block"
  decisao: "P68 — API and semantics of nph-badge and nph-button, 05-10-2026"
  testes: "src/components/nph-badge/nph-badge.test.ts and nph-badge.docs.test.ts"
  evidencia_de_uso: "`pendente` — no approved screen consumes the badge yet"
  storybook: "src/components/nph-badge/nph-badge.stories.ts and nph-badge.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-badge frame 1196:1100 and set 878:30"
---

# nph-badge

## Function

**The problem it solves:** labels the state or category of an item with one or two
words, so the person recognizes the item without reading the detail.

**When to use:**

- To label the state of an item, such as that of a document or a request.
- To label the category of an item.
- With an icon, only to reinforce the word.

**When NOT to use:**

- **As a button** — the badge receives neither click nor focus; use `nph-button`.
- **Without text** — if there is nothing to write, there is no badge.
- **For a sentence** — the supporting text stays outside the piece, next to the badge.
- **For a second state on the same item** — one state per item.

## Variants

**By appearance:** `severity` (the Figma type) and `emphasis` (the emphasis).

- `severity` is chosen **strictly** by meaning. A permanent state uses
  `secondary` or `primary`; `success` confirms an event that has just happened.
- `emphasis` `solid` gives the badge weight; `light` accompanies the item without competing for attention.

**By size and density:** `nao_se_aplica`. The badge has a single size.

**Do not combine with:** `success` in a permanent state.

## States

| State | Token | What changes for the person |
|---|---|---|
| Default | the background and text pair of the type and emphasis | The badge shows the word; it does not change with interaction |

**Feedback and focus:** the badge receives neither click, focus nor hover. The hover left Figma on
02-10-2026, because the badge is not clickable.

**Business rule the piece carries:** one state per item, and without text there is no badge.

**Domain error states:** none.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | Text only, without a role. The icon is decorative |
| Accessible name | The badge text |
| Keyboard and focus | The badge receives neither focus nor click |
| Contrast | The text passes 4.5:1 in every type and emphasis, in both schemes and in every brand; the lowest value is 4.64:1, in the `primary` `light` of the light scheme |
| Alternative to color | Every badge has text; color is never the only signal, and the icon only reinforces the word |

## Relations

**Combines with:** `nph-icon`, which draws the optional icon.

**What is the parent:** a list or table row and the header of an item.

**What is the child:** `nph-icon`, through the `icon` property. The badge has no slot.

**Which block this piece complements:** none.

**Appears in layouts:** none.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Container | `radius/full`; `space/inline-tight` at the top and bottom and `space/control-padding` on the sides |
| Space between icon and text | `space/inline-tight` |
| Text | `text/label-sm`, on a single line |
| Icon | `icon/size-sm`, in the text color |
| `solid` | `primary`: `color/primary` and `color/primary-foreground`; `secondary`: `color/secondary` and `color/secondary-foreground`; `info`, `warn`, `help` and `success`: `status/<hue>` and `status/on-solid`; `danger`: `color/destructive` and `color/destructive-foreground` |
| `light` | `primary`: `color/primary-surface` and `color/primary-on-surface`; `secondary`: `color/secondary-light` and `color/secondary-foreground`; `info`, `warn`, `help` and `success`: `status/<hue>-surface` and `status/<hue>-foreground`; `danger`: `color/destructive-surface` and `color/destructive-on-surface` |

**Usage restrictions:** the color comes from `severity` and `emphasis`, in both schemes. In a
part of the screen with another brand, `data-nph-brand` and `data-nph-color-scheme` go on the same
element (P67). The L-b limit is in P68: the `use` of some tokens in `design.md` does not
cite the badge yet.

**AI hints:**

- Use `nph-badge` to label the state or category of an item; for an action, use
  `nph-button`.
- Choose `severity` by meaning. A permanent state is `secondary` or `primary`;
  `success` is the event that has just happened.
- Write one or two words in `text`. The supporting sentence stays outside the badge.
- Turn on `icon` only to reinforce the word; the icon inherits the text color.
- Do not paint the background or the text: the color comes from `severity` and `emphasis`.

## Examples

**Recommended case:** next to "Annual report", the `secondary` `solid` badge
"Draft", which is a permanent state of the document.

**Alternative case:** next to "Request 218", the `danger` `light` badge "Rejected",
with the `circle-xmark` icon reinforcing the word.

## Anti-patterns

- **Do not use as a button** — the badge receives neither click nor focus; use `nph-button`.
- **Do not use `success` as a permanent badge** — use `secondary` or `primary`.
- **Do not put a sentence inside the badge** — the supporting text stays outside the piece.
- **Do not paint the background or the text by hand** — the color comes from the type and the emphasis.
- **Invalid combinations:** a badge with only an icon; two status badges on the same item;
  a clickable badge, with hover or with focus; a badge with a count; emphasis other than `solid` and
  `light`.
- **Do not create without a decision:** a new type, emphasis, size or state.

## Sources and decisions

- **The repository `design.md`:** `text/label-sm`, `radius/full`, `space/inline-tight`,
  `space/control-padding`, `icon/size-sm` and the `color/*` and `status/*` colors of the tokens
  table.
- **The originating decision:** P68, of 05-10-2026. The frame was accepted by Indiane on
  01-10-2026 and completed on 02-10-2026, when the hover left.
- **Tests:** `src/components/nph-badge/nph-badge.test.ts` and `nph-badge.docs.test.ts`.
- **Usage evidence:** `pendente` — no approved screen consumes the badge yet.
- **Storybook:** `src/components/nph-badge/nph-badge.stories.ts` (Validation) and
  `nph-badge.docs.stories.ts` (Docs).
- **Figma:** `nph-badge` frame (`1196:1100`) and set `878:30` in `DS-IA-NEPHOS 5.0`.
