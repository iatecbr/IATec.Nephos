```json
{
  "task": "DSA-101",
  "gate": "figma-docs-accepted",
  "date": "2026-11-22",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=7817-4454",
    "date": "2026-11-22",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The design owner gave the visual acceptance of the nph-chart (page 1626:31, root 7649:2) and accepted its documentation frame (7817:4454), with COMPONENT_SET nph-chart (7653:286) and the pieces legend item (7650:79), marker (7649:20), highlight (7651:77), tooltip (7651:147) and the error component (7651:151). On the approval page of 2026-11-22 she approved the 12 items, all as recommended: (1) visual acceptance of the root; (2) documentation accepted; (3) new primitive core/layout-height/chart (320) for chart/plot-height; (4) new primitive core/border-width/thick (2) for chart/line-width, an exception: the other 2 px strokes stay on core/focus-width/sm; (5) new primitives core/border-dash/length (8) and core/border-dash/gap (4) for the goal dash; (6) chart/label-foreground and chart/foreground, and the foundation sentence about chart text changes in a foundation task; (7) chart/1 and chart/5 keep the 500 tones in light, with the marker shape and the legend from the fifth series; (8) a generic series carries no meaning, and a chart that compares the verticals uses brand/* as the fixed color of each; (9) chart/2 keeps the 500 tone in light, with color never alone; (10) chart/1 to chart/3 of light change in the repository now, with the other tokens; (11) the donut slice label 4 px from the box of the ring; (12) six technical points (Pend. 10, 12, 18, 19, 22, 23)."
  }
}
```

# DSA-101 — `figma-docs-accepted`

The documentation of the nph-chart (frame `7817:4454`, page `1626:31`) was accepted in Figma in the file `DS-IA-NEPHOS 5.0`, with the visual acceptance of the root `7649:2` (light `7662:7`, dark `7663:765`). The nph-chart is a data chart for dashboards and reports, inside an `nph-card`: it shows a comparison, a trend or the parts of a whole of one measure, with an optional highlight, the plot area, a direct label or a legend, and the switch to a table.

Its tokens came with this task and are on `v/5.0.0`.

What changed in the tokens with this task:

- **New primitives, value first in the core (rule 4 of T9):** `core/layout-height/chart` (320, item 3), `core/border-width/thick` (2, item 4), `core/border-dash/length` (8) and `core/border-dash/gap` (4) (item 5). In CSS the dimensions come out in `rem`, like the other borders and heights.
- **New group `chart/*` for the component, 65 tokens**, next to the 30 color tokens of the chart foundation (`chart/1` to `chart/6`, `-soft`, `seq-*`, `div-*`, `grid`, `axis`, `reference`, `empty`, `muted`, `track`), which did not change name or role. 47 alias semantics (rule 2 of T9); 2 point, mode by mode, to the same core as a foundation token, with no chain between chart tokens (`chart/crosshair` as `chart/axis`, `chart/legend-marker-hidden` as `chart/muted`); 16 point straight to the core by decision (rule 3 of T9). Every semantic of the same value is refused by its function, read by value in the whole `semantic` collection of the code (component tokens of other pieces with the same value, such as `switch/track-padding-sm` 2, `avatar/radius-md` 8 and `avatar/size-sm` 24, are not candidates: they belong to their piece, rule 1 of T9):
  - 320: `layout/field-width`, `layout/rich-option-width`, `layout/dialog-min-width` are widths → `chart/plot-height` on `core/layout-height/chart`.
  - 2: `radius/subtle`, the only general semantic of 2, is the radius of a small marker → `chart/line-width` on `core/border-width/thick` (it keeps the series width apart from the focus ring), `chart/segment-gap` and `chart/focus-offset` on `core/space/50`.
  - 8: `space/inline` and `space/stack-snug` are gaps between pieces; `radius/container`, `radius/inset` and `focus/radius-inner` are radii → `chart/marker-size`, `chart/legend-item-padding`, `chart/legend-row-gap`, `chart/tooltip-padding`, `chart/error-stack-gap` on `core/space/200`; `chart/legend-item-radius` on `core/radius/400`; `chart/reference-dash` on `core/border-dash/length`.
  - 4: `space/inline-tight`, `space/stack-tight`, `radius/inner`, `focus/ring-width` have other functions → `chart/reference-dash-gap` on `core/border-dash/gap`.
  - 24: `icon/size-lg`, `layout/gutter`, `layout/margin-default`, `space/overlay-padding`, `space/surface-padding` have other functions (and the `text/*` sizes are type) → `chart/sparkline-height` on `core/space/600`, `chart/legend-item-height` on `core/target-size/minimum`.
  - 9 and 13: `focus/border-radius-container`, `focus/radius-inner-with-border`, `focus/border-radius-sidebar-item` and `focus/radius-container` are the focus of other bases → `chart/legend-item-focus-border-radius` on `core/radius/off-scale/9` and `chart/legend-item-focus-halo-radius` on `core/radius/off-scale/13`, as `dropdown/item-focus-*`.
- **Foundation values (item 10):** `chart/1`, `chart/2` and `chart/3` move in light to the 500 tones of the adjustment of 2026-11-20 in Figma: `core/sistemas/500` (#3B82F6, was `core/sistemas/700` #234E94), `core/educacao/500` (#FFA92D, was `core/educacao/700` #99651B), `core/financeiro/500` (#4D7549, was `core/financeiro/400` #71916D). Dark does not change. `design.md` follows: the values in `tokens_chart`, and in `chart_regras` the check numbers and the brand rule as the foundation page says today (worst pair 7,3 in light, chart/1 and chart/5 under tritanopia; chart/2 at 1,92:1 on the background in light, by design choice, with color never alone; dark keeps 14,2 and 4,62:1; in light chart/1 to chart/4 share the 500 tone of four brands, and a generic series carries no meaning, items 7, 8 and 9).
- **`design.md`:** the four primitives in `tokens_core_borda` and `tokens_core_layout`; the chart in `direto_por_decisao` of space (50, 200, 600) and radius (400, `off-scale/9`, `off-scale/13`, which was missing from the list), and in `meio_passo_use` as a declared exception (the 2 px stroke between colors and the 2 px focus gap are drawn lines, not a gap between boxes); the `use` of the 24 semantics the `chart/*` alias names the nph-chart (`space/inline`, `space/stack-tight`, `space/inline-tight`, `space/stack`, `color/muted-foreground`, `color/foreground`, `border/width`, `radius/subtle`, `focus/border`, `focus/halo`, `focus/ring-width`, `focus/border-radius-inner`, `focus/radius-inner-with-border`, `radius/full`, `color/card`, `color/popover`, `color/popover-foreground`, `color/border-subtle`, `radius/container`, `icon/size-sm`, `status/success`, `status/error`, `motion/enter-duration`, `motion/exit-duration`). `status/success` and `status/error` take the change icon of the highlight as a declared extension: the screen declares the sense, and the arrow and the text carry the reading. No semantic changed value or description; no new DO NOT USE.
- **Not changed here (item 6):** the foundation sentence "There is no chart-specific text token" (`chart_regras.texto_do_grafico` in `design.md`, and the foundation page in Figma) changes in a foundation task of its own, by the design owner's decision. Until then, the component uses `chart/label-foreground` and `chart/foreground`, which point to the two semantics that sentence names; the color is the same.

## Purpose

It shows one measure across categories, over time or in parts of a whole, for the person to compare, see the trend and find the point out of pattern without reading number by number.

Choice: the type by what is to be shown — column or horizontal bar to compare categories; grouped to compare series inside each category; stacked for the total and the parts; line and area for the trend over time; donut for the part of a whole; sparkline for the trend inside a card or a table cell. The area state by the data: default, loading, empty, no result or error. In the pieces: the legend item by state (default, hover, focus, hidden) and by value; the marker by series; the highlight by direction and sense; the tooltip by the number of series of the data.

Use it in dashboards and reports, inside an `nph-card` with title, period and unit, when the shape of the data matters more than the exact value. Up to 6 series; from the seventh on, group the smaller ones into "Others" (`Outros` in the Portuguese interface), in `chart/muted`. It does not replace the `nph-table`, when the person needs exact values; the `nph-progress`, for one value against a goal; nor the highlight alone in the card, for a number with no series.

## Component sets

| Set | Figma id | What it is |
|---|---|---|
| `nph-chart` | `7653:286` | The plot area, 46 variants: type (`coluna` column, default; `barra horizontal` horizontal bar; `agrupada vertical` grouped vertical; `agrupada horizontal` grouped horizontal; `empilhada vertical` stacked vertical; `empilhada horizontal` stacked horizontal; `linha` line; `área` area; `rosca` donut; `sparkline`) × state (`padrão` default, default; `carregando` loading; `vazio` empty; `sem resultado` no result; `erro` error). The sparkline has only the default (9 × 5 + 1). |
| `nph-chart / item da legenda` (legend item) | `7650:79` | 12 variants: state (`padrão` default, `hover`, `foco` focus, `oculta` hidden, `oculta + hover`, `oculta + foco`) × value (`não` no, default; `sim` yes, in the donut). |
| `nph-chart / marcador` (marker) | `7649:20` | 6 variants: shape (`círculo` circle, default; `losango` diamond; `quadrado` square; `triângulo` triangle; `triângulo invertido` inverted triangle; `cruz` cross), from `chart/1` to `chart/6`, 8 px. |
| `nph-chart / destaque` (highlight) | `7651:77` | 9 variants: direction (`sobe` up, default; `desce` down; `estável` steady) × sense (`neutro` neutral, default; `positivo` positive; `negativo` negative). |
| `nph-chart / tooltip` | `7651:147` | 3 variants: series (1, default; 3; 6), one line per series of the data. |
| `nph-chart / erro` (error) | `7651:151` | A component, not a set: icon, sentence and the "Try again" button. |

Root `7649:2`, documentation `7817:4454`, appendix `7821:19431`. Pieces by instance: `nph-card` `6478:6673`, `nph-toggle-group` `1580:60`, `nph-select` `1357:115`, `nph-button` `461:13009`, `nph-table` `1370:113`, `nph-skeleton` `1578:37`, `nph-empty` `1463:25238`, `nph-icon` `248:143`.

The descriptions of the six sets, written in Figma on 2026-11-22, say the same as this evidence: the purpose, the choice of type, Do (direct label from 2 to 4 series and the legend above that; colors in order from `chart/1`; axis at zero and a dashed, labeled goal; the unit in the card description; "View as table" below the area) and Do not (paint the series by the situation; use the `nph-togglebutton` as a legend item; a loose chart with no card).

## Tokens

Light and dark values are read in the code (`src/tokens/source/`), in the `Sistemas` brand; `focus/border` and `focus/halo` follow the active brand. "Code only" means the token has no layer in the Figma set; the code uses it (the root shows the data focus and the crosshair is described in the documentation).

### `chart/*` of the component

| Token | Points to | Light · dark | Where the piece uses it |
|---|---|---|---|
| `chart/plot-height` | `core/layout-height/chart`, by decision | 320 · 320 | Reference height of the plot area (320); the height follows the container. The donut ring has this diameter (item 3). |
| `chart/y-label-gap` | `space/inline` | 8 · 8 | Between the Y-axis labels and the plot, and between the category labels and the bar in the horizontal types (position, no auto layout in Figma). |
| `chart/x-label-gap` | `space/stack-tight` | 4 · 4 | Between the plot and the X-axis labels below it (position). |
| `chart/label-foreground` | `color/muted-foreground` | #5C5C5C · #B7BBC1 | Labels: axes, goal, category, direct series label, slice name, donut total label and the comparison text of the highlight (item 6). |
| `chart/foreground` | `color/foreground` | #000000 · #E3E3E3 | Main text: highlight value and number, value label, slice percentage, donut total, legend value and the error sentence (item 6). |
| `chart/grid-width` | `border/width` | 1 · 1 | Grid line, horizontal only, in the vertical types. |
| `chart/axis-width` | `border/width` | 1 · 1 | X axis at zero, and the zero axis at the start of the horizontal types. |
| `chart/bar-radius` | `radius/subtle` | 2 · 2 | Corner of the end of the column, the bar and the outer segment of a stack. |
| `chart/segment-gap` | `core/space/50`, by decision | 2 · 2 | Width of the stroke between neighbor colors (grouped and stacked bars, donut slices), in chart/separator. |
| `chart/line-width` | `core/border-width/thick`, by decision | 2 · 2 | Series stroke in line, area and sparkline (item 4). |
| `chart/marker-size` | `core/space/200`, by decision | 8 · 8 | Series marker (circle, diamond, square, triangle, inverted triangle, cross), in the line, the legend item and the tooltip. |
| `chart/crosshair` | `core/neutral/400` (light) · `core/surface/400` (dark), by decision | #8F8F8F · #6F7782 | Crosshair color in line and area, on hover and focus; the same core as chart/axis in each mode (item 12, Pend. 18). Code only: not drawn in the set. |
| `chart/crosshair-width` | `border/width` | 1 · 1 | Crosshair width. Code only. |
| `chart/reference-width` | `border/width` | 1 · 1 | Goal line width. |
| `chart/reference-dash` | `core/border-dash/length`, by decision | 8 · 8 | Dash of the goal line; first number of stroke-dasharray (item 5). Figma writes the dash on the line; it cannot bind a variable. |
| `chart/reference-dash-gap` | `core/border-dash/gap`, by decision | 4 · 4 | Gap of the goal line dashes; second number of stroke-dasharray (item 5). |
| `chart/data-label-gap` | `space/stack-tight` | 4 · 4 | Value label 4 px from the bar end (position). |
| `chart/sparkline-height` | `core/space/600`, by decision | 24 · 24 | Sparkline height in the nph-table cell (row of 40). |
| `chart/section-gap` | `space/stack` | 16 · 16 | Between the plot and the bottom line (legend or "View as table"); in the grouped vertical variant, between the plot and the legend. |
| `chart/legend-gap` | `space/inline` | 8 · 8 | Between legend items side by side. |
| `chart/legend-item-height` | `core/target-size/minimum`, by decision | 24 · 24 | Legend item height, the 24 px target (WCAG 2.5.8). |
| `chart/legend-item-padding` | `core/space/200`, by decision | 8 · 8 | Left and right padding of the legend item. |
| `chart/legend-item-gap` | `space/inline-tight` | 4 · 4 | Between the marker and the name in the legend item. |
| `chart/legend-item-radius` | `core/radius/400`, by decision | 8 · 8 | Corner of the legend item (no background; shapes the focus). |
| `chart/legend-item-focus-border-radius` | `core/radius/off-scale/9`, by decision | 9 · 9 | Corner of the focus border around the legend item (as dropdown/item-focus-border-radius). |
| `chart/legend-item-focus-halo-radius` | `core/radius/off-scale/13`, by decision | 13 · 13 | Corner of the focus halo around that border (as dropdown/item-focus-halo-radius). |
| `chart/legend-item-foreground` | `color/muted-foreground` | #5C5C5C · #B7BBC1 | Legend item name: default, focus, hidden and hidden + focus (struck through when hidden). |
| `chart/legend-item-foreground-hover` | `color/foreground` | #000000 · #E3E3E3 | Legend item name on hover and hidden + hover; no background. |
| `chart/legend-value-gap` | `space/inline` | 8 · 8 | Between the name and the value of the legend item with a value (donut). |
| `chart/legend-row-gap` | `core/space/200`, by decision | 8 · 8 | Between the rows of a wrapped legend (item 12, Pend. 19). |
| `chart/legend-marker-hidden` | `core/neutral/500` (light) · `core/neutral/400` (dark), by decision | #737373 · #8F8F8F | Outline of the hollow marker of a hidden series; the same core as chart/muted in each mode. |
| `chart/legend-marker-hidden-width` | `border/width` | 1 · 1 | Width of that outline. |
| `chart/focus-border` | `focus/border` | #3B82F6 · #B1CDFB | Focus border of the legend item and of the focused data; it meets 3:1. |
| `chart/focus-border-width` | `border/width` | 1 · 1 | Width of that border, outside the piece. |
| `chart/focus-border-radius` | `focus/border-radius-inner` | 5 · 5 | Corner of the focus border around a focused bar or slice, with the 2 px gap. Code only. |
| `chart/focus-halo` | `focus/halo` | #D8E6FD · #234E94 | Focus halo, outside the border. |
| `chart/focus-halo-width` | `focus/ring-width` | 4 · 4 | Width of the halo. |
| `chart/focus-halo-radius` | `focus/radius-inner-with-border` | 9 · 9 | Corner of the halo around the data focus border. Code only. |
| `chart/focus-point-radius` | `radius/full` | 9999 · 9999 | Round focus ring around a line marker. Code only. |
| `chart/focus-offset` | `core/space/50`, by decision | 2 · 2 | Gap between the focused mark and its focus border, in chart/separator. Code only. |
| `chart/separator` | `color/card` | #FFFFFF · #1E2228 | Color of the stroke between neighbor colors and of the data focus gap: the card surface. |
| `chart/series-label-gap` | `space/inline-tight` | 4 · 4 | Series name 4 px from the last marker or bar; the donut slice label 4 px from the box of the ring (item 11). Position. |
| `chart/tooltip-background` | `color/popover` | #FFFFFF · #2D333B | Tooltip background (light tooltip on the popover surface, Pend. 2). |
| `chart/tooltip-foreground` | `color/popover-foreground` | #0C0C0C · #E3E3E3 | Tooltip title and values. |
| `chart/tooltip-label-foreground` | `color/muted-foreground` | #5C5C5C · #B7BBC1 | Series name in the tooltip. |
| `chart/tooltip-border` | `color/border-subtle` | #F1F1F1 · rgba(255, 255, 255, 0.1) | Tooltip outline. |
| `chart/tooltip-border-width` | `border/width` | 1 · 1 | Width of the tooltip outline. |
| `chart/tooltip-radius` | `radius/container` | 8 · 8 | Tooltip corner. |
| `chart/tooltip-padding` | `core/space/200`, by decision | 8 · 8 | Tooltip padding on the four sides. |
| `chart/tooltip-gap` | `space/stack-tight` | 4 · 4 | Between the title and the lines of the tooltip. |
| `chart/tooltip-item-gap` | `space/inline-tight` | 4 · 4 | Between the marker and the name in a tooltip line. |
| `chart/tooltip-value-gap` | `space/inline` | 8 · 8 | Between the name and the value in a tooltip line. |
| `chart/tooltip-offset` | `space/inline` | 8 · 8 | Distance from the tooltip to the data. Code only. |
| `chart/highlight-gap` | `space/stack-tight` | 4 · 4 | Between the highlight value and its change; between the donut total and its label. |
| `chart/delta-gap` | `space/inline-tight` | 4 · 4 | Between the icon, the number and the text of the change. |
| `chart/delta-icon-size` | `icon/size-sm` | 16 · 16 | Change icon (arrow-up, arrow-up turned half a turn, minus). |
| `chart/delta-icon-positive` | `status/success` | #12823B · #45B56E | Change icon in the positive sense declared by the screen. |
| `chart/delta-icon-negative` | `status/error` | #B01E1E · #EA7D7D | Change icon in the negative sense. |
| `chart/delta-icon-neutral` | `color/muted-foreground` | #5C5C5C · #B7BBC1 | Change icon in the neutral sense, the default. |
| `chart/error-icon-foreground` | `status/error` | #B01E1E · #EA7D7D | Icon of the error state (triangle-exclamation). |
| `chart/error-icon-size` | `icon/size-sm` | 16 · 16 | Size of that icon. |
| `chart/error-gap` | `space/inline-tight` | 4 · 4 | Between the error icon and the sentence. |
| `chart/error-stack-gap` | `core/space/200`, by decision | 8 · 8 | Between the error sentence and the "Try again" button (item 12, Pend. 19). |
| `chart/tooltip-enter-duration` | `motion/enter-duration` | 250ms · 250ms | Tooltip entry, opacity only. Code only. |
| `chart/tooltip-exit-duration` | `motion/exit-duration` | 150ms · 150ms | Tooltip exit, opacity only. Code only. |

### Used directly or by instance, with no new `chart/*` token

- **Series and support colors of the foundation (Pend. 10, item 12):** the component binds straight `chart/1` to `chart/6` (bars, segments, slices, lines, markers by series), `chart/1-soft` (the wash under the area line; `chart/N-soft` for the area of series N), `chart/grid`, `chart/axis`, `chart/reference` (goal line), `chart/muted` (the other series on legend hover; "Others") and `chart/empty` (a column with no data, below). They already carry the piece name and "DO NOT USE outside a chart"; a `chart/series-N` layer would repeat them.
- **Text styles:** axis, category, goal, slice, comparison and series labels `text/caption`; value label, slice percentage, legend value, change number, tooltip title and value `text/label-sm`; legend item name and tooltip series name `text/caption`; highlight value `text/heading-lg`; donut total `text/heading-md`; error sentence `text/body-md`.
- **Tooltip shadow:** the effect style `elevation/dropdown` straight (`shadow/color` and `core/shadow-*`), as the floating layers.
- **Pieces by instance:** `nph-card` (`card/*`), `nph-toggle-group` and `nph-select` (period), `nph-button` (secondary ghost compact: "View as table", "View as chart", "Try again"), `nph-table` (the alternative), `nph-skeleton` (block in the area, line in the highlight and the legend), `nph-empty` and `nph-icon`, each with its own tokens.
- **Width:** the variants are 560 wide (`layout/max-reading`, an example width in Figma). In use the chart follows its container; it has no width token.

## Anatomy, read part by part in Figma

Read by script, variant by variant, with the token, the auto layout direction and gap and the text style of each layer. `c/` = `chart/`. The card frame, the header, the period selector and "View as table" live in the composition of the root and the documentation, not in the set.

### Plot area (`7653:286`)

- **Sizes read:** column, stacked vertical, line and area 560 × 340; horizontal bar, grouped horizontal and stacked horizontal 560 × 320; grouped vertical 560 × 380 (with the legend); donut 560 × 400; sparkline 120 × 24. The 340 of the vertical types is the 320 area plus the X axis and its labels.
- **Variant root:** vertical, no gap, except the grouped vertical: vertical, gap `c/section-gap` (16) between the area and the legend. The child `área do gráfico` (plot area) is a frame with no auto layout: the label gaps (`c/y-label-gap`, `c/x-label-gap`, `c/data-label-gap`, `c/series-label-gap`) are positions, with no binding in Figma.
- **Column:** Y-axis label ×5 (`text/caption`, `c/label-foreground`, right aligned, left of the area); grid line ×4 (line, `c/grid-width`, `chart/grid`, horizontal only); X axis (line, `c/axis-width`, `chart/axis`, at zero); X-axis label ×6 (`text/caption`, `c/label-foreground`, centered under the category); bar ×6 (rectangle, top corners `c/bar-radius`, `chart/1`, from the X axis up); goal (line, `c/reference-width`, `chart/reference`, dash 8 and gap 4 written on the line: `c/reference-dash` and `c/reference-dash-gap`, Figma cannot bind a variable to a dash); goal label (`text/caption`, `c/label-foreground`, at the end of the line, on the right, centered on its height).
- **Horizontal bar:** zero axis (vertical line at the start, `c/axis-width`, `chart/axis`); category label ×5 (`text/caption`, `c/label-foreground`, right aligned); bar ×5 (end corners `c/bar-radius`, `chart/1`, from the start); value label ×5 (`text/label-sm`, `c/foreground`, 4 px after the bar end). No grid, no scale labels.
- **Grouped vertical:** as the column, with 3 series of 4 bars (`c/bar-radius`; stroke `c/segment-gap` in `c/separator`, a 2 px line in the card color between neighbors; `chart/1`, `chart/2`, `chart/3`); legend below (frame horizontal, gap `c/legend-gap` (8), wrap with `c/legend-row-gap` (8) between rows) with 3 legend items (state default, value no).
- **Grouped horizontal:** zero axis; category label ×3; 3 series of 3 bars (`c/bar-radius`, `c/segment-gap`, `c/separator`, `chart/1` to `chart/3`); direct series label ×3 (`text/caption`, `c/label-foreground`), to the right of the end of each bar of the first group.
- **Stacked vertical:** Y labels ×5, grid ×4, X axis, X labels ×4; 3 series of 4 segments (`c/segment-gap`, `c/separator`; `c/bar-radius` only on the top segment, `chart/3`); direct series label ×3, to the right of the last stack, at the height of the segment.
- **Stacked horizontal:** zero axis; category label ×4; direct series label ×3 above the first bar, at the start of the segment; 3 series of 4 segments (`c/bar-radius` only on the end segment).
- **Line:** Y labels ×5, grid ×4, X axis, X labels ×6; series 1, 2 and 3 (vector, `c/line-width` (2), `chart/1`, `chart/2`, `chart/3`); marker ×6 per series (circle, diamond, square; `c/marker-size`); direct series label ×3 at the end of each line, 4 px after the last marker.
- **Area:** as the line with one series, plus the area under the line (vector, `chart/1-soft`) under series 1; marker ×6, circle.
- **Donut:** slice ×4 (arc, stroke `c/segment-gap` in `c/separator`, `chart/1` to `chart/4`; ring of 320, inner radius 75% of the outer); direct slice label ×4 (frame vertical: name `text/caption` `c/label-foreground`; percentage `text/label-sm` `c/foreground`), 4 px from the box of the ring (`c/series-label-gap`, item 11; position); center (frame vertical, gap `c/highlight-gap` (4)): total `text/heading-md` `c/foreground`, total label `text/caption` `c/label-foreground`.
- **Sparkline:** series 1 only (vector, `c/line-width`, `chart/1`); no axis, grid, marker or tooltip.
- **Other states** (every type but the sparkline), the size of the default of the type: loading = `nph-skeleton` block in the area; empty = `nph-empty` with the heading "No data for the period" (`Sem dados no período`) and the description "Choose another period to see the data." (`Escolha outro período para ver os dados.`); no result = `nph-empty` with the heading "No data for this filter" (`Nenhum dado para este filtro`) and the description "Change or clear the filter to see the data." (`Mude ou limpe o filtro para ver os dados.`), the same in the 9 types; error = the `nph-chart / erro` component (override `c/error-stack-gap`, equal to the master).

### Legend item (`7650:79`)

- Root horizontal; left and right padding `c/legend-item-padding` (8); height `c/legend-item-height` (24); corner `c/legend-item-radius` (8). Value no: 69 × 24, one child (label). Value yes: 240 × 24, gap `c/legend-value-gap` (8) between label and value. No background in any state; hover changes only the text color.
- Label: frame horizontal, gap `c/legend-item-gap` (4), marker then name.
- Marker: the `nph-chart / marcador` circle, `c/marker-size`. Hidden (6 variants): the inner mark becomes hollow by override: outline `c/legend-marker-hidden`, width `c/legend-marker-hidden-width` (1).
- Name: `text/caption` "Series 1" (`Série 1`); default and focus `c/legend-item-foreground`; hover `c/legend-item-foreground-hover`; hidden and hidden + focus `c/legend-item-foreground` struck through; hidden + hover `c/legend-item-foreground-hover` struck through.
- Value (value yes): `text/label-sm` "42%", `c/foreground`, struck through in the 3 hidden states.
- Focus (focus and hidden + focus, both values, 4 variants): `borda de foco` (focus border) frame, `c/focus-border-width` (1) in `c/focus-border`, corner `c/legend-item-focus-border-radius` (9); `halo de foco` (focus halo) frame, `c/focus-halo-width` (4) in `c/focus-halo`, corner `c/legend-item-focus-halo-radius` (13). Outside the item.

### Marker (`7649:20`)

8 × 8, width and height `c/marker-size`. The mark: circle (ellipse) `chart/1`; diamond (vector) `chart/2`; square (rectangle) `chart/3`; triangle (vector) `chart/4`; inverted triangle (vector) `chart/5`; cross (vector) `chart/6`. The color follows the series by override where the piece is used.

### Highlight (`7651:77`)

- Root vertical, gap `c/highlight-gap` (4); up 142 × 52, down and steady 135 × 52.
- Value: `text/heading-lg` "R$ 48.200", `c/foreground`.
- Change: frame horizontal, gap `c/delta-gap` (4): icon `nph-icon` light, `c/delta-icon-size` (16) — up `arrow-up`, down `arrow-up` turned half a turn, steady `minus`; the icon vector by override: neutral `c/delta-icon-neutral`, positive `c/delta-icon-positive`, negative `c/delta-icon-negative`; number `text/label-sm` `c/foreground` ("12%", "8%", "0%"); comparison `text/caption` "vs last month" (`vs mês anterior`), `c/label-foreground`.

### Tooltip (`7651:147`)

- 180 × 54, 180 × 94, 180 × 154 (1, 3, 6 series). Root vertical, gap `c/tooltip-gap` (4); padding `c/tooltip-padding` (8) on the four sides; corner `c/tooltip-radius`; outline `c/tooltip-border-width` (1) in `c/tooltip-border`; background `c/tooltip-background`; shadow `elevation/dropdown`.
- Title: `text/label-sm` "Mar 2026", `c/tooltip-foreground`.
- Line N: frame horizontal, gap `c/tooltip-value-gap` (8) between label and value; label: frame horizontal, gap `c/tooltip-item-gap` (4); marker with the series shape (circle, diamond, square, triangle, inverted triangle, cross in lines 1 to 6), `c/marker-size`; name `text/caption` `c/tooltip-label-foreground` ("Revenue", "Expense", "Margin", "Taxes", "Freight", "Reserve"); value `text/label-sm` `c/tooltip-foreground` ("12.4 k" to "7.4 k", aligned to the end).

### Error (`7651:151`)

249 × 56, vertical, gap `c/error-stack-gap` (8). Message: frame horizontal, gap `c/error-gap` (4): icon `nph-icon` `triangle-exclamation` light, `c/error-icon-size` (16), vector `c/error-icon-foreground` by override; sentence `text/body-md` "Could not load the chart." (`Não foi possível carregar o gráfico.`), `c/foreground`. Below: `nph-button` secondary ghost compact "Try again" (`Tentar de novo`).

### Example texts in Figma (translated in the prose)

In the set variants: Y-axis scale 0, 25, 50, 75, 100; months Jan to Jun (`Jan`, `Fev`, `Mar`, `Abr`, `Mai`, `Jun`); quarters Q1 to Q4 (`T1` to `T4`); regions North, Northeast, Southeast, South, Center-West (`Norte`, `Nordeste`, `Sudeste`, `Sul`, `Centro-Oeste`) with the horizontal bar values 48, 62, 90, 74, 36; direct series labels "Revenue", "Expense", "Margin" (`Receita`, `Despesa`, `Margem`); goal label "Goal" (`Meta`); donut slices "Card 40%", "Pix 30%", "Bank slip 20%", "Others 10%" (`Cartão`, `Pix`, `Boleto`, `Outros`) and the center "1,240" · "orders" (`1.240` · `pedidos`). Card titles and descriptions: "Revenue per month" · "R$ thousand · goal of 75"; "By quarter" · "R$ thousand"; "Payment methods" · "Orders"; "Revenue and costs" · "R$ thousand per month"; "Composition by region" · "R$ thousand"; "Payments of October by unit" · "Values by unit, in reais.". The Portuguese texts are in Figma; the interface strings are the code owner's, with translation keys.

## Documentation, converted to text (frame `7817:4454`)

### Anatomy (section 3)

Order of the parts, top to bottom: frame, header, highlight, plot area (with the marks, the goal and the direct label) and bottom line. The tooltip, the focus and the crosshair appear over the data, on hover and with the keyboard; the donut has its own anatomy (part 11).

1. **Frame** — `nph-card` base type, elevated or outlined surface, by instance, with the 24 px breathing room of the card (`card/padding` → `space/surface-padding`). The chart enters the content zone and takes the width of the card, aligned to the start.
2. **Header** — title in `text/heading-md` and description with the unit (and the period, when there is no selector) in `text/body-sm`, stacked and aligned to the start, at the top of the card; the period at the end of the title line, aligned to the top (`nph-toggle-group` compact; in a narrow card, `nph-select`).
3. **Highlight (optional)** — below the header, aligned to the start: the value in `text/heading-lg` and, 4 px below (`chart/highlight-gap` → `space/stack-tight`), the change: 16 px icon (`chart/delta-icon-size` → `icon/size-sm`), number in `text/label-sm` and comparison text in `text/caption`, centered on the line, 4 px apart (`chart/delta-gap` → `space/inline-tight`).
4. **Plot area** — 320 px reference height (`chart/plot-height` → `core/layout-height/chart`) and the width of the container. In the vertical types (column, grouped and stacked vertical, line and area): Y-axis labels on the left, right aligned, 8 px from the area (`chart/y-label-gap` → `space/inline`); horizontal grid only, 1 px (`chart/grid-width` → `border/width`) in `chart/grid`; X axis at zero, 1 px (`chart/axis-width` → `border/width`) in `chart/axis`; X-axis labels below, centered on the category, 4 px away (`chart/x-label-gap` → `space/stack-tight`), in `text/caption` and `chart/label-foreground` (`color/muted-foreground`). In the horizontal types (horizontal bar, grouped and stacked horizontal): no grid and no scale labels; the zero axis is the vertical line at the start, 1 px (`chart/axis-width` → `border/width`) in `chart/axis`, with the categories on the left, right aligned, 8 px from the bar (`chart/y-label-gap` → `space/inline`), in `text/caption`. The donut and the sparkline have no axis or grid.
5. **Data marks** — column and bar with a 2 px corner at the end (`chart/bar-radius` → `radius/subtle`); between neighbor colors, a 2 px stroke in the card color (`chart/segment-gap` → `core/space/50`, color `chart/separator` → `color/card`). Line with a 2 px stroke (`chart/line-width` → `core/border-width/thick`) and an 8 px marker (`chart/marker-size` → `core/space/200`) with the series shape; the area paints `chart/N-soft` under the line. The colors follow the order from `chart/1` to `chart/6`; the column grows from the base, at the X axis, and the horizontal bar from the start, next to the labels. Value label (optional, up to 4 series; in the set, in the horizontal bar): the number 4 px from the end of the bar (`chart/data-label-gap` → `space/stack-tight`), in `text/label-sm` and `chart/foreground` (`color/foreground`).
6. **Goal (optional)** — a 1 px line (`chart/reference-width` → `border/width`) in `chart/reference`, dashed with an 8 px dash and a 4 px gap (`chart/reference-dash` → `core/border-dash/length` and `chart/reference-dash-gap` → `core/border-dash/gap`), with the label "Goal" (`Meta`) at the end of the line, on the right, centered on its height, in `text/caption`.
7. **Direct label or legend** — with 1 series, neither a series label nor a legend: the card title says what it is. From 2 to 4 series, the series name at the end of the line, on the right, 4 px from the last marker (`chart/series-label-gap` → `space/inline-tight`), in `text/caption`; in the stacked vertical, to the right of the last stack, at the height of the segment; in the stacked horizontal, above the first bar, at the start of the segment; in the grouped horizontal, to the right of the end of each bar of the first group; in the donut, next to the slice, with the percentage. Above 4 series, and in the grouped vertical, the legend sits below the area, aligned to the start, 16 px from it (`chart/section-gap` → `space/stack`), with the items 8 px apart (`chart/legend-gap` → `space/inline`).
8. **Bottom line** — "View as table" (`nph-button` secondary ghost compact) aligned to the end, on the right, 16 px from the area (`chart/section-gap` → `space/stack`); when there is a legend, it shares the line, aligned to the start.
9. **Data tooltip (hover and focus)** — 8 px from the data (`chart/tooltip-offset` → `space/inline`), above by default, turning to the side or below when it does not fit: the title at the top, aligned to the start, in `text/label-sm`; each line with the marker and the name aligned to the start and the value aligned to the end, on the right.
10. **Focus on the data** — a ring centered on the focused mark, apart from it by a 2 px gap in the card color (`chart/focus-offset` → `core/space/50`), with a 1 px border (`chart/focus-border` → `focus/border`) and a 4 px halo (`chart/focus-halo` → `focus/halo`).
11. **Donut** — a ring of 320 px diameter (the reference height), with the inner radius at 75% of the outer, no axis or grid; the slices are separated by the 2 px stroke in the card color (`chart/segment-gap`, `chart/separator`). In the center, the total in `text/heading-md` and the label in `text/caption`, stacked and centered, 4 px apart (`chart/highlight-gap` → `space/stack-tight`). Up to 4 slices, name in `text/caption` and percentage in `text/label-sm`, stacked, outside each slice, next to its outer edge (example c, section 8); with 5 or 6 slices, the legend below the ring, one slice per line, in the order of the slices from the top, clockwise, with the value aligned to the end.
12. **Crosshair (line and area, hover and focus)** — a continuous 1 px vertical line (`chart/crosshair-width` → `border/width`) in `chart/crosshair`, from the data to the X axis, centered on the data; continuous so it is not confused with the dashed goal. The set does not draw it: it comes from the code, with the tooltip.

### Accessibility (section 4)

- **Contrast:** labels of the axes, the goal and the donut center in `chart/label-foreground` (`color/muted-foreground`), and the legend in `chart/legend-item-foreground` (`color/muted-foreground`); values in `chart/foreground` (`color/foreground`); both pass 4.5:1 on the card in both themes. The series never depends on color alone to be read.
- **Color is not the only signal:** from 2 to 4 series, a direct label on the data (line, area, stacked, grouped horizontal and donut); above that, and in the grouped vertical, the legend in the order of the series; with 1 series, the card title says what it is. In line and area, each series has its marker shape (circle, diamond, square, triangle, inverted triangle and cross, from `chart/1` to `chart/6`). The goal is dashed and labeled; the change of the highlight carries an arrow and text; the hidden series has a hollow marker and its name (and value, when there is one) struck through.
- **Visible focus:** Tab enters the chart and the arrows move between the data. The focused data gets the ring 2 px apart from the mark, with a 1 px border in `chart/focus-border` (`focus/border`) and a 4 px halo in `chart/focus-halo` (`focus/halo`): the border touches the gap and the halo, never the series color, and passes 3:1 on the card for every mark. The legend item has a 1 px border (`chart/focus-border-width`) and a 4 px halo (`chart/focus-halo-width`) outside, with the corners `chart/legend-item-focus-border-radius` and `chart/legend-item-focus-halo-radius`. The period and "View as table" use the focus of their pieces (the focus state of the `nph-toggle-group`, the `nph-select` and the `nph-button`).
- **Touch target:** the legend item is 24 px high (`chart/legend-item-height` → `core/target-size/minimum`), the minimum of WCAG 2.5.8. The data is also reached by the keyboard, and the table gives every value.
- **Accessible name:** the area has a text summary tied to it (WCAG 1.1.1), besides the card title and description. The legend item is a button with `aria-pressed` and the series name; marker and decorative icons stay `aria-hidden`. While loading, `aria-busy` on the area and the skeleton `aria-hidden`; the state change is announced in a live region (`aria-live`).
- **Table alternative:** "View as table" swaps the area for the `nph-table` with the same data and becomes "View as chart". The sparkline has no button: its values are in the table where it lives. In the root (`7682:2158` light, `7682:2212` dark, 560 × 280), the table of "Revenue per month" has the columns Month · Revenue (R$ thousand) · Goal (R$ thousand) · Difference (`Mês`, `Receita (R$ mil)`, `Meta (R$ mil)`, `Diferença`), six rows Jan to Jun, the difference signed (−13, +3, −21, +15, −5, +9); whether the difference is a rule is the task's D-3.
- **Motion:** no entry animation of the data; the tooltip appears and leaves by opacity, in `chart/tooltip-enter-duration` (`motion/enter-duration`) and `chart/tooltip-exit-duration` (`motion/exit-duration`).

### Properties, variants and states (section 5)

- **type:** column (default), horizontal bar, grouped vertical, grouped horizontal, stacked vertical, stacked horizontal, line, area, donut and sparkline.
- **state:** default (default); loading, with the `nph-skeleton` block in the area and a line in the highlight and the legend; empty, with the `nph-empty` "No data for the period" and "Choose another period to see the data."; no result, with the `nph-empty` "No data for this filter" and "Change or clear the filter to see the data."; error, with the `nph-chart / erro` piece and "Try again". The card header stays in all these states. The sparkline has only the default.
- **legend item · state:** default (default); hover, with no background: the text moves to `chart/legend-item-foreground-hover` (`color/foreground`) and the other series go to `chart/muted` in the chart; focus; hidden, with the hollow marker (1 px outline, `chart/legend-marker-hidden-width`, in `chart/legend-marker-hidden`) and the name and the value struck through; hidden + hover; hidden + focus.
- **legend item · value:** no (default); yes, in the donut: the name at the start and the value at the end, at least 8 px apart (`chart/legend-value-gap` → `space/inline`), in `text/label-sm` and `chart/foreground` (`color/foreground`).
- **marker · shape:** circle (default), diamond, square, triangle, inverted triangle and cross, in that order from `chart/1` to `chart/6`, at 8 px.
- **highlight · direction and sense:** direction up (default), down or steady: the arrow shows the direction. Sense neutral (default), positive or negative, declared by the screen: the icon color shows the sense; the number and the text stay neutral.
- **tooltip · series:** 1 (default), 3 or 6 lines, one per series of the data.
- **What is not a property:** series and values come from the data. Direct label or legend follows the number of series and the type. The goal is optional and comes from the data. The period is a piece of the card header; "View as table" is of the bottom line. The height follows the container, with 320 px as the reference.
- **Combined states:** hidden + focus exists: the hidden item takes focus to turn the series back on. Hidden + hover swaps the struck-through text to the hover pair, with no background.

### Relations and context (section 6)

- **`nph-card`:** the frame, by instance, base type, elevated or outlined surface. The chart card is not clickable: the legend, the period and the table are interactive inside it.
- **`nph-toggle-group` and `nph-select`:** the period takes the place of the card header action: `nph-toggle-group` compact, with up to 3 periods; in a narrow card, `nph-select`. Changing the period changes the chart data.
- **`nph-button`:** secondary ghost compact in "View as table", "View as chart" and "Try again".
- **`nph-table`:** the alternative in place of the area, with the same data. The sparkline lives in the table cell, 24 px high (`chart/sparkline-height` → `core/space/600`), inside the 40 px row.
- **`nph-skeleton` and `nph-empty`:** `nph-skeleton` block in the area while loading; `nph-empty` in empty and no result, with the text of each case.
- **`nph-icon`:** the arrows and the dash of the change and the alert of the error, light style, 16 px.
- **Who controls what:** the color of each series comes from the order (`chart/1` on) and does not follow the active brand. The chart controls the focus and the tooltip of the data; the card controls title, description and frame.
- **Space between the pieces:** 16 px between the area and the bottom line (`chart/section-gap` → `space/stack`); 8 px between legend items (`chart/legend-gap` → `space/inline`) and between the rows of a wrapped legend (`chart/legend-row-gap` → `core/space/200`); the tooltip 8 px from the data (`chart/tooltip-offset` → `space/inline`).

### When to use (section 7)

- Compare categories: column; with a long label or in a ranking, horizontal bar.
- Compare series inside each category: grouped, with up to 4 bars per group; horizontal when the label is long or in a ranking.
- Show the total and the parts: stacked, with up to 4 parts and no negative value.
- Show the trend over time: line, with up to 4 lines labeled directly and up to 6 with a legend; area, the line with the `chart/N-soft` wash under the curve.
- Show the part of a whole: donut, with the total in the center; from the seventh slice on, "Others".
- Show the trend in a small space: sparkline, in the card or in the table cell: one series, up to 12 values, no axis, grid or tooltip.
- One value against a goal, or exact values: not a chart: `nph-progress` for the goal; `nph-table` to look up values.

### Required examples (section 8, light and dark)

a. Revenue per month: column with a highlight, a dashed goal and a 6-month period; one series, no legend or series label. b. By quarter: grouped vertical with three series and the legend below, aligned to the start, because the grouped vertical has no place for the name on the bar. c. Payment methods: a four-slice donut with the total in the center and the name and percentage next to each slice, no legend; "Others" is here one of the four methods, in the fourth color, not the group of the seventh series on.

### Do (section 9)

- Label 2 to 4 series directly (line, area, stacked, grouped horizontal and donut) and use the legend below above that and in the grouped vertical — so the person does not have to match the color with the legend.
- Start the colors at `chart/1`, in order, and group the seventh series on into "Others", in `chart/muted` — the fixed order keeps the same series with the same color from one chart to another.
- Start the X axis at zero and, when there is a goal, draw it dashed and labeled — a bar that does not start at zero exaggerates the difference; the dash sets the goal apart from the grid and the crosshair.
- Say the unit in the card description and the period in the header selector (with no selector, in the description) — the axis has no title, and the two say what the number measures.
- Offer "View as table" below the area — whoever does not read the chart reaches the same values in the `nph-table`.
- Keep the card header in loading, empty, no result and error — the person still knows which chart it is and can change the period.

### Do not (section 10)

1. Do not paint the series by the situation, with green for good and red for bad: a series is not a state, and the same color changes meaning from one chart to another. Use `chart/1` on, in order; the sense goes in the icon color of the highlight, with an arrow and text.
2. Do not use the `nph-togglebutton` as a legend item: pressed, it paints the background with the brand color and has no series marker. Use `nph-chart / item da legenda`, with no background, with the marker and the name.
3. Do not put the chart loose on the page, with no card: with no title, unit and period, nobody knows what the number measures. Use it inside the base `nph-card`, with the unit in the description and the period in the header selector (with no selector, in the description).

## Default behavior (appendix B, accepted with the documentation)

The WAI-ARIA APG has no chart pattern: the base is the APG button (legend item) and the keyboard on the data of the systems of the research of 2026-11-19 (MUI X, Highcharts); the tooltip follows WCAG 1.4.13. No deviation from the APG.

| Row | Rule | Source |
|---|---|---|
| Keyboard on the data | Tab enters the chart and focuses the data; the arrows move between the data; Tab again goes on to the legend and to "View as table". The focused data shows the ring and opens the tooltip. | https://mui.com/x/react-charts/accessibility/ ; https://www.highcharts.com/docs/accessibility/accessibility-module |
| Keyboard on the legend | Each item is a button with `aria-pressed`; Tab goes from item to item; Enter and Space turn the series on and off. | https://www.w3.org/WAI/ARIA/apg/patterns/button/ |
| Focus on open and on close | The tooltip opens on the focused data and closes when the focus leaves it. After "View as table" the focus stays on the button, which becomes "View as chart" (item 12, Pend. 22). After "Try again" and after a period change, the area goes through loading, with `aria-busy`, while the data comes (item 12, Pend. 23). | https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html ; https://raw.githubusercontent.com/cloudscape-design/components/main/src/internal/components/chart-status-container/index.tsx |
| Esc | Closes the tooltip without moving the focus (WCAG 1.4.13, dismissible). The chart has no submenu or open list. | https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html |
| Outside click | Closes the tooltip. The chart has no layer that traps the focus. | WCAG 1.4.13 |
| Pointer and focus | Hover shows the tooltip of the data under the pointer (and, in line and area, the crosshair) and does not move the keyboard focus; the pointer can move onto the tooltip without it going away (WCAG 1.4.13). On hover of a legend item, the other series go to `chart/muted`. | WCAG 1.4.13 |
| Near the window edge | The tooltip sits above the data by default and turns, to the side or below, when it does not fit, without cutting (Floating UI flip; DSA-42 D1). | https://floating-ui.com/docs/flip |
| Period | The keyboard of the piece (`nph-toggle-group` or `nph-select`). While the new data comes, the area shows loading (Pend. 23). | the pieces' specs |
| Announcement | Loading, empty, no result and error are announced in a live region (`aria-live`), as the Cloudscape does. | Cloudscape chart status container, above |
| Code | Event, aria, slot, property and console warning stay with the code (the code owner), following the APG and the Custom Elements Manifest. | https://github.com/webcomponents/custom-elements-manifest |

## Combined states (T11)

T11 of the decision register, repeated here because the task is the source of the code: selected or pressed + disabled keeps the background and the selected mark under `state/disabled-opacity`; error + disabled: disabled wins, the error border goes away and only the opacity stays.

In the chart there is no disabled data or item (DSA-42 D7 and DSA-48 D7 do not apply), so T11 does not apply to the new pieces; it applies in the pieces by instance that have disabled (`nph-button`, `nph-toggle-group`, `nph-select`).

The combinations of the legend item, drawn in the set: hidden + hover swaps the struck-through text to the hover pair (`chart/legend-item-foreground-hover` → `color/foreground`), with no background; hidden + focus exists, because the hidden item takes focus to turn the series back on. Legend item hover + chart: the series of the item keeps its color and the others go to `chart/muted` ("highlight dimming the rest", foundation `Cor de gráfico`).

## Icon and image

- All through the `nph-icon`, light style, 16 px (`icon/size-sm`; in the highlight `chart/delta-icon-size`; in the error `chart/error-icon-size`), read by script in the pieces: `arrow-up` light (direction up); `arrow-up` light turned half a turn (direction down, until `arrow-down` light enters the `nph-icon` in a task of its own, Pend. 3, accepted; https://fontawesome.com/icons/arrow-down?s=light); `minus` light (steady); `triangle-exclamation` light (error, in `chart/error-icon-foreground`). They do not change weight by state.
- The period uses the icons of the `nph-toggle-group` by instance: check on the pressed item and xmark on the others, light, the pattern of the approved piece (`1580:60`).
- The series marker is not an icon: a drawn 8 px shape (`chart/marker-size`), in the series color.
- Image: only the `nph-empty` illustration, by instance, in the 120 × 87 box of the piece; export and crop inherited (DSA-40 D1 to D4). The chart has no image of its own.

## Limits (the "Limites" row of the Figma matrix, `7656:52` light and `7656:305` dark)

| Case | Rule |
|---|---|
| Minimum | The sparkline: one series, no axis. |
| Maximum | 6 series; from the seventh on, "Others" in `chart/muted` (foundation). |
| Long text | The category label cuts on one line with an ellipsis; the whole text in the tooltip (example in Figma: `Centro-Oeste e Distrito Federal`). |
| Empty | `nph-empty`, "No data for the period" and "Choose another period to see the data.". |
| Many items | 12 categories: the X axis shows one label every 2; the tooltip gives the whole category (a code rule, Pend. 12). |
| Short window | The width follows the container; in a narrow card, the period becomes an `nph-select` (Pend. 6). |

## Rules the set does not draw (appendix H)

- **No data in the middle of a series:** a column in `chart/empty` with the label "No data" (`Sem dado`) below, as the demonstration `169:3` of the foundation; in the line, a gap. The set does not draw the case; it goes to the task as a rule.
- **Crosshair:** a continuous 1 px vertical line in `chart/crosshair`, only in line and area (part 12 of the anatomy). The set and the root do not draw it.
- **Tooltip motion:** opacity only, in `motion/enter-duration` and `motion/exit-duration` through `chart/tooltip-enter-duration` and `chart/tooltip-exit-duration`, as the tooltip balloon (DSA-42 D5).
- **Card copies in the documentation:** the content text of the card is hidden on purpose (the chart fills the zone); in "Do not" the three errors have "error, on purpose" in the name.

## What the chart asks of other pieces

Read in the specs on `v/5.0.0`.

- **`nph-card` (`fichas/nph-card.md`):** base type, elevated or outlined surface, title, description (unit) and the default slot for the chart — it already does. The period goes in `slot-action`, the header action. The spec describes that slot, in the base type, as the menu action (an icon-only `nph-button` ghost compact with `ellipsis-vertical`), and in the section type as a secondary solid compact button with text; it does not name a period selector. It is a named slot and the card does not police its content. Open point below; the look in Figma is the selector at the end of the title line, aligned to the top.
- **`nph-toggle-group` (`fichas/nph-toggle-group.md`):** size compact (28 px) — it already does; up to 3 periods.
- **`nph-select` (`fichas/nph-select.md`):** sizes default and large only; no compact. In a narrow card it sits at 36 px next to the 28 px of the header action. A task of the select (appendix I), not of this one.
- **`nph-button` (`fichas/nph-button.md`):** secondary with emphasis ghost and size compact exists (ghost is the "third-level action such as Show all") — it already does.
- **`nph-table` (`fichas/nph-table.md`):** the alternative with the same data, through `columns` and `rows` — it already does. The sparkline in a cell: the composite cell types are a closed list (`text`, `person`, `badge`, `icon-text`, `thumbnail`, `link`, `truncated`, `status`, `button`, `actions`, `mixed-actions`, `rating`, `loading`), and a type outside the list draws a blank cell. There is no chart cell: open point below.
- **`nph-skeleton` (`fichas/nph-skeleton.md`):** shape block "for an image, chart or area", stretching to the container width, with the height given by whoever uses it; the host is `aria-hidden` and the container takes `aria-busy` — it already does.
- **`nph-empty` (`fichas/nph-empty.md`):** heading (what is missing) and optional description (what to do) — it already does.
- **`nph-icon`:** `arrow-up`, `minus` and `triangle-exclamation` are in the core list; `arrow-down` is not (it enters in a task of its own; until then, `arrow-up` turned half a turn).
- **`nph-tooltip` and `nph-togglebutton`:** not used. The `nph-tooltip` is a single dark line, and its background gives less than 3:1 with the series swatch; the `nph-togglebutton` paints the background with the brand and has no marker (Do not, 2).

## Inherited decisions (appendix D, read on `v/5.0.0`)

- No D-N: DSA-03 (`nph-icon`) and DSA-08 (`nph-tooltip`). DSA-30 D5 (a reading width of 560 accepted for the chart) does not apply to the plot area, which follows the container.
- Still open: DSA-26 D1 (the skeleton line height, in the highlight and the legend while loading) and D2 (the skeleton shape tokens in `design.md`); DSA-40 D1 to D4 (weight, the dark illustration in the 120 × 87 box, the box shrinking in a narrow container, and the delivery of the `nph-empty` images).
- Follows DSA-42: D1 partly (the data tooltip sits above by default and turns when it does not fit; it points to the data); D2 (distance `space/inline`, in the chart `chart/tooltip-offset`); D3 partly (the data tooltip centers on the category or the point); D4 (with scroll, it follows the data or closes with Esc and with the loss of focus); D5 (opacity only, in `motion/enter-duration` and `motion/exit-duration`). D6 and D7 do not apply.
- DSA-48: D1 and D2 do not apply (the data tooltip is the reading of the value and opens at once, also on keyboard focus); D7 does not apply.
- DSA-88 (`nph-card`): D-1 to D-4 stay open and are inherited by the card by instance (D-4, the limit of the `Sistemas` brand in light, also applies to the focus of the legend item and of the data); decisions 1, 2, 7, 11, 14, 16, 17, 18 and 21 follow, and 19 partly (c: `aria-busy` and the skeleton `aria-hidden` in the area); 4 and 9 only if the card uses the start; 3, 5, 6, 8, 10, 12, 13, 15 and 20 do not apply to the base card with no footer or media.
- Register: T9 (token layers), T11 (combined states).

## Decisions answered (approval page of 2026-11-22, the 12 items, all as recommended)

| Item | Decision |
|---|---|
| 1 | Visual acceptance of the root `7649:2`. |
| 2 | Documentation `7817:4454` accepted; the descriptions of the six sets hold its summary. |
| 3 | New primitive `core/layout-height/chart` (320), bound by `chart/plot-height`, by decision (rules 3 and 4 of T9): the semantics of 320 are widths. Source: https://m3.material.io/foundations/design-tokens |
| 4 | New primitive `core/border-width/thick` (2) for `chart/line-width`, leaving `core/focus-width/sm`: the series width stays apart from the focus ring. An exception: the other 2 px strokes and indicators (`tabs/indicator-width`, `tree/indicator-width`, `data-table/row-selected-indicator-width`, `navigation-menu/current-indicator-width`, `stepper/marker-border-width-current`, the `nph-scheduler` indicators) stay on `core/focus-width/sm`, unchanged. Sources: https://raw.githubusercontent.com/cloudscape-design/components/main/style-dictionary/visual-refresh/borders.ts ; https://raw.githubusercontent.com/Shopify/polaris-viz/main/packages/polaris-viz-core/src/constants.ts |
| 5 | New primitives `core/border-dash/length` (8) and `core/border-dash/gap` (4), next to `core/border-style/dashed` (which stays out of the build until it handles `strokeStyle`), bound by `chart/reference-dash` and `chart/reference-dash-gap`. Figma cannot bind a variable to a dash: the goal line `7652:29` has the dash written (`dashPattern` [8, 4]); in code, `stroke-dasharray` with the two tokens. Sources: Cloudscape borders above; https://raw.githubusercontent.com/carbon-design-system/carbon-charts/main/packages/core/scss/components/_threshold.scss |
| 6 | `chart/label-foreground` → `color/muted-foreground` and `chart/foreground` → `color/foreground` (rule 1 of T9; precedents `progress/value-foreground`, `card/description-foreground`). The foundation sentence "There is no chart-specific text token" changes in a foundation task of its own. |
| 7 | `chart/1` and `chart/5` keep the 500 tones in light (1,11:1 between them): the marker shape in line and area and the legend from the fifth series separate them. Source: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html |
| 8 | Both rules: a generic series carries no meaning, and the label, the marker shape or the position with the legend names it; a chart that compares the verticals themselves uses `brand/*` as the fixed color of each, as the foundation asks. Sources: https://carbondesignsystem.com/data-visualization/color-palettes/ ; https://www.datawrapper.de/blog/colors-for-data-vis-style-guides/ |
| 9 | `chart/2` keeps the 500 tone in light (1,92:1 on the card), with color never alone: marker shape, direct label or legend, and "View as table". Source: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html |
| 10 | `chart/1` to `chart/3` of light change in the repository now, with the other tokens (this task). |
| 11 | The donut slice label 4 px from the box of the ring (`chart/series-label-gap` → `space/inline-tight`), measured by the box, as in the piece. |
| 12 | Six technical points: Pend. 10 (the component binds the foundation color tokens straight); Pend. 12 (the code owner chooses the chart library and gives the estimate the decision map asks for, checking SVG or canvas drawing with an accessible alternative, keyboard on the data, the data table, a tooltip styled with the tokens and the license; sources: https://primeng.dev/chart ; https://www.telerik.com/kendo-angular-ui/components/charts/accessibility ; https://raw.githubusercontent.com/swimlane/ngx-charts/master/README.md ; https://echarts.apache.org/handbook/en/best-practices/aria/ ; https://www.highcharts.com/docs/accessibility/accessibility-module); Pend. 18 (`chart/crosshair` to the same core as `chart/axis` in each mode; source: https://raw.githubusercontent.com/cloudscape-design/components/main/src/internal/components/cartesian-chart/styles.scss); Pend. 19 (`chart/legend-row-gap` and `chart/error-stack-gap` on `core/space/200`); Pend. 22 (after "View as table" the focus stays on the button); Pend. 23 (after "Try again" and a period change, the area goes through loading). |

**Where the other points come from.** The proposals accepted on 2026-11-21 (Pend. 1 to 9 and 13: the 320 reference height, the light tooltip on the popover surface, the arrow for the direction and the icon color for the sense, the hollow marker and struck-through name of a hidden series, the six marker shapes, the period selector in the header, "View as table" below the area, the error with "Try again", the 2 px focus gap with border and halo, the direct label up to 4 series) were confirmed with the visual acceptance of item 1. The tokens that only alias an existing semantic or core with no new value, and `chart/legend-marker-hidden` pointing to the same core as `chart/muted` (the way out of Pend. 18 applied to it, as the text of that point says), follow the recommendation, approved with the approval page of 2026-11-22 ("goes on with no decision"). The appendix rows B to I are the documentation accepted with item 2.

## Hidden on purpose in Figma

- In the hidden legend states, the inner mark of the marker is hollow by override (stroke, no fill).
- The tables detached in the root (`7682:2158`, `7682:2212`) keep the default caption of the `nph-table` hidden (`7682:2159`, `7682:2213`), with the title and the example tag of the piece.
- In the root copies used in the documentation, the content text of the card is hidden on purpose; the dark border layers follow the theme variable.
- The bars "error, on purpose" in "Do not" are painted in `status/success` and `status/error` on purpose (the wrong example).
- Known limits of Figma: the goal dash is written on the line (no variable); the plot area height does not bind `chart/plot-height`; the label gaps are absolute positions.

## Outside this task (appendix I)

- The foundation sentence about chart text changes in a foundation task (item 6).
- The two foundation sentences about direct labels (up to 4 series in `design.md`; the bar left to choose in the foundation page) stay as they are until a foundation task, after Pend. 13.
- The goal dash of the foundation demonstration `169:3` uses 6 px; the component uses 8 px. Aligning the demonstration is a foundation task.
- `arrow-down` light in the `nph-icon` (Pend. 3).
- `nph-select` with no compact size (36 px against the 28 px of the card header action): a task of the select.
- The guide tables of `design.md` (the nested radius rows and the radius by piece) say that the tooltip uses `radius/inner`: that is the `nph-tooltip`. The data tooltip of the chart uses `radius/container` (`chart/tooltip-radius`), and its `use` says so; naming it in those tables is a foundation task.
- The series contrast is measured by the foundation on `color/background`; on `color/card` and `color/popover` the numbers change in dark. Source: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
