```json
{
  "task": "DSA-54",
  "gate": "figma-docs-accepted",
  "date": "2026-10-27",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1640-196",
    "date": "2026-10-27",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-pagination board, with its Documentação frame (1640:196), was accepted as the API and behavior specification of nph-pagination. COMPONENT_SET: nph-pagination (1640:194), nph-pagination/página (2888:87682). COMPONENT: nph-pagination/reticências (2888:87798), nph-pagination/ir para a página (2888:87805). The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  }
}
```

# DSA-54 — `figma-docs-accepted`

The documentation of the `nph-pagination` (frame `1640:196`) was accepted in Figma, in the file `DS-IA-NEPHOS 5.0`, with the Figma UX QA and the textual audit approved. The component needed 19 `pagination/*` tokens, 2 core primitives and the text role `text/label-md-strong`, all put on `v/5.0.0` together with this task. Every other token it uses was already there.

There is no command output. The acceptance is a human observation, recorded in the json block above with the board URL and the components.

The rest of this file is the Figma documentation converted to text, so that whoever codes does not need to open Figma. Figma property names stay as they are in Figma (Portuguese); the code API is in English.

## Purpose

Takes the person from one page to another in a long list and shows where in the list they are.

Selection: choose by type (numerada, simples, com extremos, intervalo, compacta or tabela) and by position in the list (início, meio or fim).

## Description

Use below a list or table that does not fit on one screen. Pagination splits the result; it does not replace the filter or the search. Load more and infinite scroll are not part of this piece.

## Anatomy

Example in the frame: type tabela, position meio.

| Part | Rule |
|---|---|
| 1. Bar | Outline of the bar: pagination/border, pagination/border-width, pagination/radius; padding in pagination/padding-x and pagination/padding-y. |
| 2. Arrows | nph-icon-button. Previous and next; first and last in the com extremos and tabela types. Background pagination/arrow-background, border pagination/arrow-border in pagination/arrow-border-width, radius pagination/item-radius. |
| 3. Page | Number in pagination/item-size, radius pagination/item-radius, text in pagination/text-foreground. The current one has background pagination/item-background-active. |
| 4. Ellipsis | Marks the pages that are not shown. Does not take a click. |
| 5. Position text (optional) | "Página 5 de 10", "5 de 10" or "101–125 de 250", in the simples, compacta, intervalo and tabela types. |
| 6. Items per page (optional) | Label and nph-select in pagination/page-size-width, only in the tabela type. |

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | Number, text and icon in pagination/text-foreground pass 4.5:1 in both modes, also over pagination/item-background-active and pagination/item-background-hover. The border of the arrows, in pagination/arrow-border, passes 3:1. |
| Visible focus | Page and arrow take keyboard focus with focus/border and focus/halo, which come from nph-button and nph-icon-button. The focus border passes 3:1 against the halo and against the background of the current page, in both modes. |
| Color is not the only signal | The current page also has the number in bold (text/label-md-strong). The arrow without a destination is disabled, with pagination/disabled-opacity, and shows no tooltip. |
| Touch target | Page and arrow are pagination/item-size wide and high. The ellipsis takes no click. On a narrow screen, use compacta instead of shrinking the buttons. |
| Accessible name | The bar is a navigation with aria-label "Paginação". Each number has aria-label "Página N", and the current one carries aria-current="page". The arrows use the tooltip text as name: Primeira página, Página anterior, Próxima página and Última página. The ellipsis carries aria-hidden. |

Demonstrations in the frame, in light and dark: current page with highlighted background and bold number; keyboard focus on the current page; keyboard focus on the arrow; arrow without destination, disabled and without tooltip; hover on the arrow, where the tooltip shows the action name ("Próxima página"); keyboard focus on the arrow, where the tooltip also appears ("Página anterior"); in the bar, the tooltip centered above the next arrow.

## Properties, variants and states

| Field | Rule |
|---|---|
| tipo | numerada: numbers with Anterior and Próxima written. simples: arrows and "Página 5 de 10". com extremos: numbers with first, previous, next and last. intervalo: arrows and "101–125 de 250". compacta: arrows and "5 de 10". tabela: items per page, range and bar with first and last. |
| posição | início: first page is current, first and previous disabled. meio: arrows active and ellipsis on both sides of the current page. fim: last page is current, next and last disabled. |
| nph-pagination/página | Number piece. atual: não or sim. estado: padrão, hover or foco. The current one uses pagination/item-background-active; hover uses pagination/item-background-hover. |
| arrows | Not a piece of their own: they are nph-icon-button, type secondary and emphasis outline. state: default, focus or disabled; hover uses pagination/item-background-hover. The last one uses the icon of the first, rotated. |
| nph-pagination/reticências | Piece without properties. Marks the pages that are not shown and takes no click. |
| nph-pagination/ir para a página | Optional piece with the nph-input field, in pagination/page-input-width, to type the page. Sits beside the bar with first and last. |
| number and text | Not properties: change the page number and the position text in the instance, from the list total. |
| tooltip and open selector | Not properties: the arrow tooltip is nph-tooltip, only on an active arrow; the open selector is nph-select in focus with its list below. |

Defaults of the set: tipo=numerada, posição=início.

Demonstrations in the frame, in light and dark: nph-pagination/página in padrão, hover, foco and atual; arrows (nph-icon-button) in default, hover, focus and disabled; tipo compacta, posição meio.

## Usage

The component has no code yet; the attributes come with the spec. The frame shows only the tag, `<nph-pagination></nph-pagination>`, and the import, `import '@iatec/nephos/nph-pagination';`.

## Relations and context

- Sits right below the nph-data-table or the list it paginates. The table controls the data; pagination only changes the page.
- Uses nph-button and nph-icon-button for the numbers and the arrows, nph-select for items per page, nph-input for go to page and nph-tooltip for the tooltips. Color, state and focus come from those pieces, with the pagination/* tokens.
- Space between the numbers and between the arrows: pagination/item-gap. Between groups: pagination/group-gap. Between the label and the control: pagination/control-gap.

Demonstrations in the frame, in light and dark: table footer with items per page, range and bar with first and last; go to page beside the bar with first and last.

## When to use

- numerada: common list or search result, when the person jumps between nearby pages.
- simples and compacta: narrow space. Compacta fits a card header, a side panel and a phone.
- com extremos, with go to page: long list, when the person needs to reach the start, the end or a given page.
- intervalo: when the total of items matters more than the page number.
- tabela: footer of a data table with many records.

Demonstrations in the frame, in light and dark: card header or narrow panel, compacta; total of items matters more, intervalo; narrow space with the word page, simples.

## Mandatory examples

Light mode: data table footer, in the middle of the list; search result, on the first page; card header, on the last page.

Dark mode: the same three examples.

## Do

- Show the first and the last page in numerada — the person understands the size of the list.
- Disable the arrow without a destination instead of hiding it — the bar keeps its width and a repeated click lands in the same place.
- Use in items per page the same value the table uses — the range matches the rows on screen.

Demonstration in the frame, in light and dark: end of the list, next disabled, without leaving the bar.

## Do not

- Do not hide the arrow without a destination — the bar jumps. Use the arrow in the disabled state.
- Do not mark the current page only with the color of the number — color alone is not a signal. Use the page with atual=sim, which has background and bold.

Demonstrations in the frame, in light and dark: arrow hidden, the bar jumps; current page marked only by the color of the number.

## Tokens used

- pagination/border (color/border)
- pagination/border-width (border/width)
- pagination/radius (radius/container)
- pagination/padding-x (space/control-padding)
- pagination/padding-y (space/inline)
- pagination/item-gap (space/inline)
- pagination/group-gap (space/inline-loose)
- pagination/control-gap (space/inline)
- pagination/item-size (control/height-default)
- pagination/item-radius (radius/control)
- pagination/item-background-hover (color/accent)
- pagination/item-background-active (color/primary-surface-hover)
- pagination/text-foreground (color/foreground)
- pagination/arrow-background (color/background)
- pagination/arrow-border (color/input)
- pagination/arrow-border-width (border/width)
- pagination/page-size-width (core/layout-width/page-size-select, 88)
- pagination/page-input-width (core/space/1000, 64)
- pagination/disabled-opacity (state/disabled-opacity)
- text/label-md-strong (label-md with weight 600)
- focus/border, focus/halo (from nph-button and nph-icon-button)
