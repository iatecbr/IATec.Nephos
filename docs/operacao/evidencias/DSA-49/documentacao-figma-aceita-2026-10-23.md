```json
{
  "task": "DSA-49",
  "gate": "figma-docs-accepted",
  "date": "2026-10-23",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1370-113",
    "date": "2026-10-23",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-table board, with its `Documentação` frame (2584:66651), was accepted as the API and behavior specification of the nph-table. COMPONENT_SET: nph-table (1370:113), variants `size` (`default`, `large`), `moldura` (`sem`, `com`), `cabeçalho fixo` (`não`, `sim`) and `foco` (`não`, `sim`); parts `nph-table / cabeçalho` (1370:19), `nph-table / célula` (1370:20), `nph-table / célula composta` (2425:1032), `nph-table / rodapé` (2425:1033), `nph-table / corpo vazio` (2425:1046), `nph-table / chevron` (2571:66334), `nph-table / célula da árvore` (2571:66335) and `nph-table / item expandido` (2571:66336)."
  }
}
```

# DSA-49 — `figma-docs-accepted`

The documentation of the `nph-table` (frame `2584:66651`) was accepted in Figma,
in the file `DS-IA-NEPHOS 5.0`, with the Figma UX QA and the textual audit
approved. The component needed 36 semantic tokens and 3 core primitives that
were not on `v/5.0.0`; they were taken to `v/5.0.0` with the same aliases as in
Figma, together with this task. Every other token it uses was already there.

There is no command output. The acceptance is a human observation, recorded in
the json block above with the board URL and the component.

The rest of this file is the Figma documentation converted to text, so that
whoever codes does not need to open Figma. Figma property names stay as they are
in Figma (Portuguese); the code API is in English (P64).

## Purpose
Table to read and compare data in rows and columns, with caption, header, cells
and footer. A row can open a detail or sub-levels.

Selection: the table is chosen by `size`, `moldura`, `cabeçalho fixo` and `foco`;
the cell by `conteúdo`, `estado`, `grade` and `alinhamento`. Optional: caption,
with description and total; footer; expanding row; tree.

## Description
Use it to show data that the person reads and compares, such as payments by
unit, a statement or the items of an order. It does not replace the
`nph-data-table`, which sorts, selects, filters and paginates. It is not a tool
to lay out the page.

## Anatomy

| Part | Rule |
|---|---|
| 1. Caption | Optional. Title above the table, with description and total in `nph-badge` secondary. In code, it is the `caption`. Text in `table/caption-foreground`, up to `table/caption-max-width`, at `table/stack-gap` from the table. |
| 2. Header | Column title in `text/heading-xs`, over `table/header-background`. |
| 3. Cell | Data as text, in `table/foreground`. Text aligned left; numbers aligned right. |
| 4. Composite cell | Content built from other pieces: person, badge, icon, thumbnail, link, button, actions and rating. |
| 5. Footer | Total or subtotal of the column, with the background and typography of the header. |
| 6. Frame and scroll area | Optional. Border `table/border` in `table/border-width` and radius `table/radius`, over `table/background`; the body scrolls up to `table/body-max-height`. |
| 7. Chevron | `nph-icon-button` ghost compact that opens the row or the level. |
| 8. Expanded item | Photo in `table/thumbnail-size-large`, name, description, values with a label on top, and badge. |
| 9. Empty body | `nph-empty` in place of the rows, with the header visible, at `table/empty-padding` above and below. |

Demonstrations in the frame: the `nph-table` with caption, description, total
and frame; an expanding row with chevron and expanded item.

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | Text and link pass AA (WCAG 1.4.3) over background, stripe, header and hover, in light and dark. The status icon passes 3:1 (WCAG 1.4.11). Exception: the rating star uses `table/rating-foreground`, below 3:1 in light; the score stays as a number beside it. |
| Visible focus | The scroll area and the truncated-text cell receive the `focus/border` ring, in `table/focus-ring-width`. The ring is the same in every combination of `size`, `moldura` and `cabeçalho fixo`. Chevron, buttons and ⋮ use the focus of their own piece. |
| Color is not the only signal | Status has shape and name besides color. The badge always has text. The link is underlined. The destructive action is written in the menu. |
| Touch target | The chevron and the ⋮ of the mixed actions are 28 by 28; Edit and ⋮ of the actions are 36 by 36. The compact button is 28 high. All pass 24 by 24 (WCAG 2.5.8). On a touch screen, use `size` large. |
| Accessible name | The caption is the title of the table (`caption`). Status icon, icon-only Edit, ⋮ and chevron carry an `aria-label` per row, such as `Editar Ana Souza` and `Mais ações de Ana Souza`. The dash is read as `sem valor`. The chevron reports open or closed (`aria-expanded`), and the tree reports the level (`aria-level`). |

Demonstrations in the frame, in light and dark: status with shape and name,
truncated text with focus and dash read as `sem valor`; caption as the title of
the table and the ring on the scroll area.

## Properties, variants and states

| Figma property | Rule |
|---|---|
| `size` | `default` or `large`. Default uses the row in `table/row-height` and the cell sides in `table/cell-padding-inline`; large uses `table/row-height-large` and `table/container-padding`, for touch or more relaxed reading. |
| `moldura` | `sem` or `com`. `com` draws the border `table/border`, in `table/border-width`, and the radius `table/radius`, for a table standing alone on the page. |
| `cabeçalho fixo` | `não` or `sim`. `sim` when the body scrolls up to `table/body-max-height`: the header stays in place, with the line `table/sticky-divider-color` in `table/sticky-divider-width`, spread `table/sticky-divider-spread` and blur `table/sticky-divider-blur`. |
| `foco` | `não` or `sim`. Shows the ring of the scroll area. The ring is the same in every combination of `size`, `moldura` and `cabeçalho fixo`. |
| `legenda` | Turns the title above the table on and off. Description (`descrição`) and total (`total`) are its options; the total uses the `nph-badge` secondary. The texts are set in `texto da legenda` and `texto da descrição`. |
| `conteúdo` (composite cell) | `duas linhas`, `pessoa`, `selo`, `ações`, `categoria`, `carregando`, `ícone e texto`, `miniatura`, `link`, `texto cortado`, `sem valor`, `status`, `botão`, `ações mistas` and `avaliação`. The texts are set in `texto`, `apoio` and `texto do link`; in the link, only `texto do link` applies, underlined, in `table/link-foreground`. |
| `estado` (cell and composite cell) | `default`, `hover` and `faixa`. Hover paints the whole row in `table/row-hover-background`; `faixa` alternates in `table/row-striped-background`. Focus exists only in the composite cell, on truncated text (`estado` `foco`). Button, icon and chevron inside the cell have their own states. |
| `grade` | `não` or `sim`. `sim` turns on the vertical line between columns, in `table/border`. |
| `alinhamento` (header, cell, footer) | `esquerda` for text, `direita` for numbers. Header and footer follow the column. |
| Expanding row | The chevron has `parte` (`corpo`, `cabeçalho`, `recuo`) and `aberto` (`não`, `sim`). Closed points right; open points down. The expanded item has `parte` `item`, `valor` and `selo`. |
| Tree | `nível` 1, 2 or 3 and `aberto` (`não`, `sim`, `sem filhos`). Each level indents `table/expand-indent` plus `table/cell-gap`; without children it keeps the space of the chevron, so the text aligns. |
| Two-level header | The group title uses the same header piece, above the columns it groups. Use it when several columns measure the same subject. |
| Not a property | The column width is set in use. The color of the status icon comes from the cell, and the icon inherits it. Sorting, selection, filtering and pagination belong to the `nph-data-table`. |

Defaults of the set: `size=default`, `moldura=sem`, `cabeçalho fixo=não`,
`foco=não`, `legenda` off, with `descrição` and `total` on when the caption is on.
Composite cell: `conteúdo=duas linhas`, `estado=default`, `grade=não`.

Composite cell contents, as in the part's description: `pessoa` uses `nph-avatar`
md; `selo` uses `nph-badge` light; `ações` shows Edit and ⋮ in `nph-icon-button`
ghost, and Delete is written in the menu; `carregando` uses `nph-skeleton`;
`miniatura` shows the photo in `table/thumbnail-size`, radius
`table/thumbnail-radius`, over `table/muted-background` (without a photo, hide the
photo layer and show the `image` icon); `texto cortado` carries a tooltip and focus;
`sem valor` is a dash; `status` takes the color from the cell, in
`table/status-success-icon`; `botão` is `nph-button` secondary light compact; `ações mistas` is a written
Edit in `nph-button` secondary light compact and ⋮ in
`nph-icon-button` light compact; `avaliação` shows stars in `table/rating-foreground`
and the score as a number. Icons inside the cell measure `table/icon-size`.

Demonstrations in the frame, in light and dark: large with frame and caption;
default with fixed header; `size` `default` and `large`; `estado` `hover` and `faixa`;
states of the cell pieces (button, mixed actions and chevron in default,
hover-active, focus and disabled, and the chevron also loading), each piece
changing alone with the ring of its own piece; grid on in the body; loading
content with `nph-skeleton`; empty body with the header visible.

## Usage
The component has no code yet; the attributes come with the spec. The frame
shows only the tag, `<nph-table></nph-table>`, and the import,
`import '@iatec/nephos/nph-table';`.

## Relations and context
- The composite cell receives other pieces: `nph-avatar` md, `nph-badge` light,
  `nph-icon`, `nph-icon-button` ghost in the actions and light compact in the ⋮
  of the mixed actions, `nph-button` secondary light compact, `nph-skeleton` and
  `nph-tooltip`. Each keeps its own rules.
- The cell controls the row background on hover and on stripe, and the focus ring
  on truncated text. The status icon inherits the color the cell sets.
- The ⋮ opens the `nph-dropdown-menu` with the other actions; Delete goes last,
  in destructive.
- With no result, the empty body carries the `nph-empty` in place of the rows,
  with the header visible.
- Sorting, selection, filtering and pagination belong to the `nph-data-table`.
- Space: the cell uses `table/cell-padding-inline` on the sides, or
  `table/container-padding` at `size` large. Above and below, the composite cell
  uses `table/cell-padding-block`; with a button, `table/action-cell-padding-block`.
  Between pieces of the cell, `table/cell-gap`, mixed actions included; between
  the icons of the actions, `table/cell-gap-tight`. The caption sits at
  `table/stack-gap` from the table.

Demonstration in the frame, in light and dark: `nph-avatar`, `nph-badge` and
`nph-icon-button` inside the cell.

## When to use
- To read and compare data in rows and columns, such as a statement, a report or
  a list of items.
- Use `moldura` `com` for a table standing alone on the page. Use `moldura` `sem`
  inside a card or panel, which already have a border.
- Fixed header when the list is long inside a panel; horizontal scroll when the
  columns do not fit.
- Two-level header to group columns of the same subject, such as accesses by
  channel.
- Expanding row for the detail that does not fit in the row, such as an order and
  its items. It opens only through the chevron.
- Tree, up to three levels, for hierarchy, such as unit and sub-unit.
- `size` large on a touch screen or for more relaxed reading; default otherwise.
- To sort, select, filter or paginate, use the `nph-data-table`.

Demonstrations in the frame, in light and dark: a detail that does not fit in the
row, opened by the chevron; a hierarchy up to three levels; columns grouped under
a title.

## Required examples
Each in light and dark mode:

| Example | What it shows |
|---|---|
| Items grouped by category | Group rows and the total in the footer. |
| Open order | The expanding row with the item and its photo. |
| Table with caption | Caption, total and focus on the scroll area. |

## Do
- Align text left and numbers right, with header and footer in the same
  direction, because the column compares at a glance.
- Use the dash when data is missing, because the person understands there is no
  value, and the screen reader reads `sem valor`.
- Truncate long text only with the tooltip and focus on the cell, because without
  focus the tooltip does not open from the keyboard.
- With two actions or more, keep the frequent one visible and the rest in the ⋮,
  with Delete last, because the destructive action stays written.
- Use the caption with description and total on a table standing alone, because
  it says what it is and how much it holds before reading.
- Use the fixed header when the body scrolls, because the column titles do not
  disappear.

Demonstrations in the frame, in light and dark: dash when data is missing,
truncated text with focus and mixed actions; rows grouped by category with the
total in the footer.

## Do not
- Do not leave the cell empty when data is missing; use the `sem valor` content,
  because an empty cell looks like a loading error.
- Do not align numbers left; use `alinhamento` `direita`, because on the left the
  digits do not line up for comparison.
- Do not write an action as a link; use the `nph-button` in the cell, because a
  link goes to another place and a button executes.

Each line has a wrong-use demonstration in the frame, in light and dark.

## Tokens and values
Every `table/*` token is an alias, the same as the Figma variable. Values below
are the resolved values with the default brand (`Sistemas`).

| Token | Light | Dark | Used in |
|---|---|---|---|
| `table/background` | `color/background` (`#ffffff`) | `color/background` (`#0f1114`) | table and frame background |
| `table/foreground` | `color/foreground` (`#000000`) | `color/foreground` (`#e3e3e3`) | cell and header text |
| `table/muted-foreground` | `color/muted-foreground` (`#5c5c5c`) | `color/muted-foreground` (`#b7bbc1`) | second line of the cell |
| `table/caption-foreground` | `color/muted-foreground` (`#5c5c5c`) | `color/muted-foreground` (`#b7bbc1`) | caption text |
| `table/muted-background` | `color/muted` (`#edeeef`) | `color/muted` (`#2d333b`) | neutral background behind thumbnail and expanded photo |
| `table/header-background` | `core/surface/25` (`#fafafa`) | `color/muted` (`#2d333b`) | header and footer background |
| `table/row-striped-background` | `core/surface/25` (`#fafafa`) | `core/surface/800` (`#1e2228`) | stripe (even row) |
| `table/row-hover-background` | `color/primary-surface` (`#ebf2fe`) | `color/primary-surface` (`#0c1a31`) | row under the pointer |
| `table/border` | `color/border` (`#c7c7c7`) | `color/border` (`#6f7782`) | frame, row divider and grid |
| `table/border-width` | `border/width` (1) | same | frame, row divider and grid |
| `table/radius` | `radius/container` (8) | same | frame corner |
| `table/link-foreground` | `color/link` (`#2f68c5`) | `theme/brand-200` (`#b1cdfb`) | link in the cell |
| `table/status-success-icon` | `status/success` (`#12823b`) | `status/success` (`#45b56e`) | positive status icon |
| `table/rating-foreground` | `brand/educacao` (`#ffa92d`) | `brand/educacao` (`#ffba57`) | rating star; accepted exception to WCAG 1.4.11 in light |
| `table/row-height` | `core/space/800` (40) | same | row at `size` default |
| `table/row-height-large` | `control/height-large` (44) | same | row at `size` large |
| `table/cell-padding-block` | `space/inline` (8) | same | above and below the composite cell |
| `table/cell-padding-inline` | `space/control-padding` (12) | same | cell sides at `size` default |
| `table/action-cell-padding-block` | `space/control-padding` (12) | same | above and below a cell with a button |
| `table/container-padding` | `space/container-padding` (16) | same | cell sides at `size` large |
| `table/cell-gap` | `space/inline` (8) | same | between pieces of the cell; added to the tree indent |
| `table/cell-gap-tight` | `space/inline-tight` (4) | same | between the icons of the actions |
| `table/stack-gap` | `space/stack-tight` (4) | same | between caption and table |
| `table/empty-padding` | `space/section` (32) | same | above and below the empty body |
| `table/caption-max-width` | `layout/max-reading` (560) | same | caption text width |
| `table/body-max-height` | `layout/max-list-height` (296) | same | body height before it scrolls |
| `table/expand-indent` | `control/height-compact` (28) | same | indent of each tree level |
| `table/icon-size` | `icon/size-sm` (16) | same | icon inside the cell |
| `table/thumbnail-size` | `image/size-sm` (32) | same | thumbnail in the cell |
| `table/thumbnail-size-large` | `image/size-lg` (64) | same | photo of the expanded item |
| `table/thumbnail-radius` | `radius/inner` (4) | same | thumbnail corner |
| `table/focus-ring-width` | `core/focus-width/sm` (2) | same | focus ring of the scroll area and the truncated-text cell |
| `table/sticky-divider-color` | `shadow/color-light` (black at 5%) | `shadow/color-light` (black at 0%) | line under the fixed header |
| `table/sticky-divider-width` | `core/shadow-y/100` (1) | same | line under the fixed header |
| `table/sticky-divider-spread` | `core/shadow-spread/0` (0) | same | line under the fixed header |
| `table/sticky-divider-blur` | `core/shadow-blur/0` (0) | same | line under the fixed header |

New core primitives taken with this task: `core/surface/25` (`#fafafa`),
`core/space/800` (40) and `core/focus-width/sm` (2). `focus/ring-width` (4) stays
as it is in every other component; only the table uses the thinner ring.
