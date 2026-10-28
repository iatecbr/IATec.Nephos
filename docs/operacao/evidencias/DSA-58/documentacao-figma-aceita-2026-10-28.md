```json
{
  "task": "DSA-58",
  "gate": "figma-docs-accepted",
  "date": "2026-10-28",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=2875-17577",
    "date": "2026-10-28",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-data-table board (1371:282), with its Documentação frame (2875:17577), was accepted as the API and behavior specification of nph-data-table. COMPONENT_SET: nph-data-table (2633:69628), 20 variants (estado × size × moldura × cabeçalho fixo × foco × grade × expande), with the inner pieces cabeçalho (1371:37), seleção (1371:68), linha (1371:138), ações (1371:69) and ajuste (2633:5120). The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  }
}
```

# DSA-58 — `figma-docs-accepted`

The documentation of the `nph-data-table` (frame `2875:17577`, inside the board `1371:282`) was accepted in Figma, in the file `DS-IA-NEPHOS 5.0`, with the Figma UX QA and the textual audit approved. The component needed 13 `data-table/*` tokens, all put on `v/5.0.0` together with this task. Each one is an alias: of a semantic token or, when no semantic token has the same function, of a core primitive. No core primitive was added. The `table/*` tokens it uses come from nph-table and were already there.

There is no command output. The acceptance is a human observation, recorded in the json block above with the frame URL and the component set.

The rest of this file is the Figma documentation converted to text, so that whoever codes does not need to open Figma. Figma property names stay as they are in Figma (Portuguese); the code API is in English.

## Purpose

A table to search, sort, select and act on records, with a toolbar, row actions and pagination.

Selection: choose the table by estado and size; it inherits from nph-table moldura, cabeçalho fixo, foco, grade and expande. Optional: legenda, with descrição and total; paginação, with itens por página. The inner pieces: linha, cabeçalho, seleção, ações and ajuste.

## Description

Use it for lists of records in which the person searches, sorts, selects several rows or acts on one row, such as the people of a unit. It does not replace nph-table, which is for reading and comparing data without these actions. It is not for building the page layout.

## Anatomy

Examples in the frame: nph-data-table with caption, toolbar, sorting, selection, actions and pagination; and the bulk selection state, with the bulk action bar in place of the toolbar.

| Part | Rule |
|---|---|
| 1. Caption | Optional. Title above the table, with a description and a total in nph-badge secondary, as in nph-table. |
| 2. Toolbar | nph-toolbar, tipo página: search, filter and table actions. It stays outside the scrolling area. |
| 3. Sortable header | Column title and an icon that shows the sort direction. |
| 4. Selection | Column with the nph-checkbox, in the header and in each row. |
| 5. Row | nph-table cells. The background changes on hover and when the row is selected. |
| 6. Actions | The ⋮ at the end of the row, which opens its actions. |
| 7. Pagination | Label and nph-select for items per page, plus the nph-pagination. It stays outside the scrolling area. |
| 8. Bulk action bar | nph-toolbar, tipo em massa. It takes the place of the toolbar when rows are selected, with the total and the actions. |
| 9. Toggle | Optional. Column with an nph-switch to turn a value of the row on or off. |

Measures read from the component set and the pieces:

- The default master (estado padrão, size default) is 644 px wide: caption, nph-toolbar (52 px tall), table and pagination (36 px tall), with data-table/stack-gap (8 px) between them.
- Row height: table/row-height in size default, table/row-height-large in size large.
- Header cell (cabeçalho): 140 × 40 px in default, 44 px tall in large.
- Selection column (seleção): data-table/selection-column-width (48 px), 48 × 40 px in default and 56 × 44 px in large. The nph-checkbox box is 24 × 24 px.
- Actions column (ações): data-table/action-column-width (48 px), 48 × 40 px, with the ⋮ in an nph-icon-button ghost (36 × 36 px).
- Toggle column (ajuste): 96 × 40 px, with an nph-switch.
- Selected row: background data-table/row-selected-background and a mark on the left edge, data-table/row-selected-indicator, in data-table/row-selected-indicator-width (2 px).
- Sort icon: data-table/sort-icon-foreground; in the sorted column, data-table/sort-icon-active-foreground.
- Unchecked selection box border: data-table/checkbox-border.
- Pagination: label in data-table/page-size-label-foreground, text style text/body-md; nph-select data-table/page-size-width (88 px); data-table/pagination-gap between label, select and nph-pagination.
- Empty by search: nph-empty in the body, with the searched term and "Limpar filtro", data-table/empty-gap between them.
- Inherited from nph-table: table/border, table/border-width, table/radius, table/header-background, table/row-hover-background, table/row-striped-background, table/foreground, table/caption-foreground, table/cell-padding-inline, table/cell-gap, table/cell-gap-tight, table/container-padding, table/empty-padding, table/body-max-height, table/caption-max-width, table/focus-ring-width and the sticky divider (table/sticky-divider-color, -width, -spread, -blur).

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | Text and link pass level AA (WCAG 1.4.3) over the background, the stripe, hover, the selected row and the bulk action bar, in light and dark. The sort icon and the selected row mark pass 3:1 (WCAG 1.4.11). The unchecked box border uses data-table/checkbox-border and passes 3:1 (WCAG 1.4.11) over the background, the header, the stripe and hover. |
| Visible focus | The scrolling area gets the focus/border ring, in table/focus-ring-width, as in nph-table. The sortable header is a button the size of the cell; on focus, it gets the same ring inside the cell, around the label and the arrow. A header that does not sort takes no focus. Search field, buttons, selection box and ⋮ use the focus of their own piece. The row takes no focus. |
| Color is not the only signal | The selected row has the box checked and the side mark, besides the background. Sorting shows the arrow in the direction, not only the color. The bulk action bar says how many rows are selected. Empty by search explains in text. |
| Touch target | Selection box, ⋮, search field and buttons are the targets and keep the target of their own piece, above 24 × 24 (WCAG 2.5.8). The row is not a target. On a touch screen, use size large. |
| Accessible name | The caption is the title of the table (caption). The header box is named "Selecionar todas"; the row box, "Selecionar Ana Souza". The ⋮ has an aria-label per row, such as "Mais ações de Ana Souza". The sortable header states the direction (aria-sort). The search field has a label, such as "Filtrar por pessoa". |

Demonstrations in the frame, in light and dark: focus ring on the scrolling area (the row takes no focus); selected row with box checked, side mark and written total; empty by search explained in text, with "Limpar filtro"; focus on the sortable header, ring inside the cell around label and arrow.

## Properties, variants and states

| Field | Rule |
|---|---|
| estado | padrão, seleção em massa, vazio pela busca or carregando. Seleção em massa swaps the toolbar for the nph-toolbar tipo em massa. Vazio pela busca puts the nph-empty in the body, with the searched term and "Limpar filtro", data-table/empty-gap between them. Carregando puts the nph-skeleton in the cells. |
| size | default or large. Default uses the row in table/row-height; large uses table/row-height-large, for touch or reading with more air. |
| moldura, cabeçalho fixo, foco, grade, expande | Inherited from nph-table, with the same rule: border and radius of the standalone table, header fixed while the body scrolls, ring of the scrolling area, vertical line between columns, and a row that opens by the chevron. |
| legenda | Turns the title above the table on or off. Descrição and total are its options. The texts change in texto da legenda and texto da descrição. |
| linha (piece) | estado default, hover, selecionada or faixa; expansão não, fechada or aberta. Selecionada paints data-table/row-selected-background and the mark data-table/row-selected-indicator, in data-table/row-selected-indicator-width. |
| cabeçalho (piece) | ordenação nenhuma, ordenável, crescente or decrescente; alinhamento esquerda or direita. The icon uses data-table/sort-icon-foreground and, in the sorted column, data-table/sort-icon-active-foreground. foco turns on the focus/border ring inside the cell, in table/focus-ring-width; only in columns that sort. |
| seleção (piece) | lugar cabeçalho or linha; marcado false, indeterminado or true. In the header, indeterminado when only part of the rows is checked. The column measures data-table/selection-column-width. |
| ações and ajuste (pieces) | Ações: the ⋮ in nph-icon-button ghost, in the column data-table/action-column-width. Ajuste: column with an nph-switch to turn a value of the row on or off without opening another screen. |
| paginação, itens por página and tipo | The footer changes with the width of the table's space; the master shows the middle case. paginação turns the footer on or off; itens por página turns the label and the nph-select on or off; tipo swaps the nested nph-pagination without taking it apart. The label uses data-table/page-size-label-foreground and the nph-select measures data-table/page-size-width. From 850 px: tipo tabela, with itens por página off, because tabela already has its own. From 420 to 849 px: itens por página and tipo intervalo. Below 420 px or on a phone: only tipo intervalo. With a single page: paginação off and total on in the caption. |
| What is not a property | The column width is set in use. The column order, the searched term and the selected total come from the data. The toolbar belongs to nph-toolbar and the pagination to nph-pagination. |

Component set properties, as in Figma: legenda (boolean, off), texto da legenda (text, "Pessoas por unidade"), descrição (boolean, off), texto da descrição (text, "Valores por unidade, em reais."), total (boolean, off), itens por página (boolean, on), paginação (boolean, on), estado, size, moldura (sem, com), cabeçalho fixo (não, sim), foco (não, sim), grade (não, sim), expande (não, sim).

Demonstrations in the frame, in light and dark: estado padrão; seleção em massa; vazio pela busca; carregando, with nph-skeleton; size large with moldura; grade on in the body; row default, hover, selecionada and faixa; header nenhuma, ordenável, crescente and decrescente; wide footer, from 850 px, tipo tabela; middle footer, from 420 to 849 px, itens por página and tipo intervalo; narrow footer, below 420 px or on a phone, only tipo intervalo; a single page, no footer and total in the caption.

## Usage

```html
<nph-data-table></nph-data-table>
```

```js
import '@iatec/nephos/nph-data-table';
```

## Relations and context

- It uses the nph-table pieces: cell, composite cell, chevron and expanded item. Each one keeps its own rules.
- The toolbar is the nph-toolbar tipo página: search with nph-input, filter and actions. Applied filters go in the nph-toolbar's own strip, with nph-chip.
- Selection uses the nph-checkbox. The row controls the background and the mark of the selected row; the box only shows the checked state.
- The bulk action bar is the nph-toolbar tipo em massa, with the total and the actions. The select-all box stays in the table header, not in the bar.
- The ⋮ opens the nph-dropdown-menu with the row actions.
- Empty by search uses nph-empty; loading, nph-skeleton. The header stays visible in both.
- Pagination stays outside the scrolling area: label and nph-select for items per page, and the nph-pagination with tipo exposed, data-table/pagination-gap between them.
- Spacing: caption, bar, table and pagination are data-table/stack-gap apart.

Demonstrations in the frame, in light and dark: nph-toolbar, nph-checkbox and ⋮ inside the table; chevron and expanded item of nph-table in the row.

## When to use

- For lists of records that the person searches, sorts or filters, such as people by unit.
- Bulk selection when there is an action on several rows at once, such as download or delete.
- Row actions in the ⋮ when the row has more than one action.
- Ajuste when the person turns a value of the row on or off without opening another screen.
- Size large on a touch screen or for reading with more air; default in the other cases.
- To only read and compare data, without searching, sorting or selecting, use nph-table.

Demonstrations in the frame, in light and dark: action on several rows at once; long list, with the header fixed; size large, for a touch screen.

## Mandatory examples

- People by unit, with search, sorting and actions.
- Selected rows, ready to download or delete.
- Search with no result, with the way to clear the filter.

Light and dark mode: the same three examples.

## Do

- Show the selected total in the bulk action bar — the person confirms the reach before acting.
- Keep the header visible in empty and loading — the person does not lose sight of the columns.
- Align numbers to the right, in the header too — it makes values easier to compare.
- Name the search by what it filters, such as "Filtrar por pessoa" — the person knows what can be searched.

Demonstrations in the frame, in light and dark: selected total written in the bulk action bar; header visible while loading.

## Do not

- Do not leave a search with no result with a blank body — use estado vazio pela busca.
- Do not mark the row by the background alone — use the selection, with the box checked too.
- Do not align numbers to the left — use alinhamento direita, in the cell and in the header.

Demonstrations in the frame, in light and dark: wrong, a search with no result and a blank body; wrong, a row marked only by the background, with an empty box; wrong, a number aligned to the left.

## Tokens used

- data-table/sort-icon-foreground (color/muted-foreground)
- data-table/sort-icon-active-foreground (color/foreground)
- data-table/row-selected-background (color/primary-surface)
- data-table/row-selected-indicator (color/primary)
- data-table/row-selected-indicator-width (core/focus-width/sm)
- data-table/stack-gap (space/stack-snug)
- data-table/pagination-gap (space/inline)
- data-table/selection-column-width (core/space/900)
- data-table/action-column-width (core/space/900)
- data-table/checkbox-border (color/input-hover)
- data-table/empty-gap (space/stack)
- data-table/page-size-label-foreground (color/foreground)
- data-table/page-size-width (core/layout-width/page-size-select)
- From nph-table, already on `v/5.0.0`: the `table/*` tokens listed under Anatomy, and focus/border for the focus ring.
