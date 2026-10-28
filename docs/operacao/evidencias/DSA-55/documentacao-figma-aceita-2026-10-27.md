```json
{
  "task": "DSA-55",
  "gate": "figma-docs-accepted",
  "date": "2026-10-27",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=2944-6528",
    "date": "2026-10-27",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-toolbar board, with its Documentação frame (2944:6528), was accepted as the API and behavior specification of nph-toolbar. COMPONENT_SET: nph-toolbar (2105:426), 12 variants (tipo × tamanho). The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  }
}
```

# DSA-55 — `figma-docs-accepted`

The documentation of the `nph-toolbar` (frame `2944:6528`) was accepted in Figma, in the file `DS-IA-NEPHOS 5.0`, with the Figma UX QA and the textual audit approved. The component needed 14 `toolbar/*` tokens, all put on `v/5.0.0` together with this task. Each one is an alias of an existing semantic token; no core primitive was added. Every other token it uses was already there.

There is no command output. The acceptance is a human observation, recorded in the json block above with the board URL and the component set.

The rest of this file is the Figma documentation converted to text, so that whoever codes does not need to open Figma. Figma property names stay as they are in Figma (Portuguese); the code API is in English.

## Purpose

A bar that gathers, in a single line, the actions that apply to one area of the screen: the checked items, the page or the content being edited.

Selection: choose the type by the situation (em massa, página, ferramentas or flutuante). Choose the size by the density of the screen (compacto, padrão or grande). The booleans turn on the checkbox, the center and the way to clear the selection.

## Description

Use it when several actions apply to the same set, such as a table, a list or an editor. The bar splits the actions into three zones: start, center and end, and each zone takes Nephos pieces. It does not replace nph-dropdown-menu, which holds the actions that do not fit, nor the pagination, which is a sibling piece and stays outside the bar.

## Anatomy

Examples in the frame: tipo em massa, tamanho padrão ("2 de 6 selecionados", Limpar seleção, Exportar, Excluir); tipo página, tamanho padrão (Buscar pessoas, Filtrar, Nova pessoa).

| Part | Rule |
|---|---|
| 1. Bar | Container. Background toolbar/background, border toolbar/border in toolbar/border-width, radius toolbar/radius, inner space toolbar/padding. Em massa: background toolbar/bulk-background, no border, sides in toolbar/bulk-padding-x. Flutuante: background toolbar/floating-background, border toolbar/floating-border, radius toolbar/floating-radius and shadow elevation/dropdown. |
| 2. Start | Em massa: nph-checkbox indeterminate (optional) and the count in text/label-md, color toolbar/bulk-count-foreground. Página: search with nph-input and filter. Ferramentas: groups of nph-icon-button. Flutuante: count in toolbar/floating-count-foreground. |
| 3. Center (optional) | nph-toggle-group to choose the view or turn on a mode. Shown by the centro boolean. |
| 4. End | Actions on the right, in nph-button and nph-icon-button ghost. The main action is primary solid. The destructive action is danger ghost, in a group of its own. Mais (more) and Fechar (close) come last. |
| 5. Divider | Vertical nph-separator between groups of actions. Never opens or closes the bar. |
| Space | toolbar/gap between the items and between the zones. |

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | Text and icon over the bar background pass 4.5:1 (text) and 3:1 (icon), in light and dark. In the em massa bar, the hover of the actions uses toolbar/bulk-action-background-hover so it stays visible over the highlighted background. |
| Visible focus | Each piece shows its own focus, with border and halo. The bar draws no focus of its own. |
| Color is not the only signal | The destructive action has a label or a trash icon besides the red. The checked item in the center changes its background and its icon becomes solid. |
| Touch target | The actions are 28 px in compacto, 36 px in padrão and 44 px in grande; the checkbox is 24 px. The center (nph-toggle-group) follows the bar: 28, 36 and 44 px. The search (nph-input) also follows the bar: 28, 36 and 44 px. On a touch screen, use grande. |
| Accessible name | The bar carries role "toolbar" and an aria-label with the name of the area, such as "Ações da tabela". An icon-only button carries an aria-label with the action and a tooltip with the same name. The divider carries aria-hidden. |

Demonstrations in the frame, in light and dark: Exportar under the pointer, with the em massa bar's own hover background and a solid icon; focus on the download button, with the border and halo of the piece itself; tamanho grande, actions of 44 px for touch screens.

## Properties, variants and states

| Field | Rule |
|---|---|
| tipo | em massa: there are checked items. página: top of a list or table, with search, filter and create. ferramentas: actions of content being edited. flutuante: selection over the content, near it. Default: em massa. |
| tamanho | compacto, padrão and grande. Changes the height of the pieces. Default: padrão. |
| contagem | Text "N de M selecionados", in the em massa and flutuante types. |
| caixa de seleção | Turns on the indeterminate checkbox at the start of the em massa bar. Turn it off when the table already has the checkbox in its header. |
| centro | Turns on the nph-toggle-group in the middle of the bar. |
| limpar em texto · limpar em ícone | One or the other, never both on. Text is the default; icon only in a narrow bar, with a tooltip and an accessible name. |
| states | The bar has no state of its own: hover, focus, disabled and loading belong to the pieces. The icon of the ghost buttons becomes solid on hover and when checked. |
| what is not a property | An action that does not fit goes to Mais, which opens nph-dropdown-menu. On a narrow screen, first the text of the buttons goes away; then the actions at the back go to Mais. The order does not change. There is no vertical bar. |

Figma component properties of the set `2105:426`: `tipo` (em massa, página, ferramentas, flutuante), `tamanho` (compacto, padrão, grande), text `contagem` ("2 de 6 selecionados"), booleans `centro` (off), `caixa de seleção` (on), `limpar em texto` (on) and `limpar em ícone` (off). The set's default variant is tipo=em massa, tamanho=padrão.

Demonstrations in the frame, in light and dark: caixa de seleção off, because the table already has the checkbox in its header; limpar em ícone, only the X, for a narrow bar; centro on, nph-toggle-group in the middle; tipo flutuante, tamanho compacto; and four página bars, one per state: hover on Filtrar, focus on download, Nova pessoa disabled (no action available) and Nova pessoa loading (while the action runs).

## Usage

The component has no code yet; the attributes come with the spec. The frame shows only the tag, `<nph-toolbar></nph-toolbar>`, and the import, `import '@iatec/nephos/nph-toolbar';`.

## Relations and context

- Sits at the top of the area it controls: above the table, the list or the editor. The flutuante one sits over the content, near the selection, or pinned to the foot of the area.
- Pieces inside it: nph-checkbox, nph-input, nph-button, nph-icon-button, nph-toggle-group and nph-separator. Each piece controls its own color, state and focus; the bar controls background, border, radius and space.
- Mais opens nph-dropdown-menu, where the text of the action always shows.
- Pagination is a sibling piece: it stays outside the bar.
- Space between items and between zones: toolbar/gap. Inner space: toolbar/padding.

Demonstrations in the frame, in light and dark: top of the list, with search and filter at the start and download, settings and create at the end; near the selection, with count, actions and Fechar last.

## When to use

- Em massa: the person checked items and will act on all of them at once.
- Página: top of a list or table, to search, filter and create.
- Ferramentas: content being edited, with actions that apply to it.
- Flutuante: the selection is in a large area and the top bar goes out of view.
- Size: compacto on a dense screen used with a mouse; padrão in general; grande on a touch screen.

Demonstrations in the frame, in light and dark: one per type (em massa, página, ferramentas, flutuante).

## Mandatory examples

Light mode: table with checked items, where the checkbox is in the table header so the bar's checkbox is off ("3 de 12 selecionados"); top of a list, with the view switch in the center; editor with actions in groups, the trash apart and Mais at the end.

Dark mode: the same three examples.

## Do

- Use only one main action, at the end, in primary solid — it needs to stand out from the others.
- Separate the destructive action with the divider and use danger ghost — it avoids a click by mistake.
- Show the count in the em massa bar — the person confirms how many items they will act on.
- Send what does not fit to Mais — the bar does not wrap.

Demonstrations in the frame, in light and dark: one main action, at the end; trash in a group of its own, after the divider, and Mais last.

## Do not

- Do not put two main actions — use one primary solid and the others in ghost.
- Do not use an outline on the secondary actions — use ghost.
- Do not turn on limpar em texto and limpar em ícone together — choose one.
- Do not leave the destructive action next to the others — use the divider before it.

Demonstrations in the frame, in light and dark: two main actions; secondary action with an outline; limpar em texto and em ícone on together; destructive action next to the others, without a divider.

## Tokens used

- toolbar/background (color/background)
- toolbar/border (color/border)
- toolbar/border-width (border/width)
- toolbar/radius (radius/control)
- toolbar/padding (space/inline)
- toolbar/gap (space/inline)
- toolbar/bulk-background (color/primary-surface)
- toolbar/bulk-count-foreground (color/primary-on-surface)
- toolbar/bulk-padding-x (space/control-padding)
- toolbar/bulk-action-background-hover (color/primary-surface-hover)
- toolbar/floating-background (color/popover)
- toolbar/floating-border (color/input)
- toolbar/floating-count-foreground (color/popover-foreground)
- toolbar/floating-radius (radius/container)

Also used, already on `v/5.0.0`: elevation/dropdown (shadow of the flutuante bar) and text/label-md (count). The height of each size comes from the pieces, not from a toolbar token.
