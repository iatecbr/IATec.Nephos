```json
{
  "task": "DSA-90",
  "gate": "figma-docs-accepted",
  "date": "2026-11-17",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=6673-62837",
    "date": "2026-11-17",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The design owner gave the visual acceptance of the nph-date-picker (green page 1364:2, root 6662:55010), its documentation frame (6673:62837) was accepted, and on the approval page of 17-11 she approved the 10 items as recommended: (1) documentation 6673:62837 accepted; (2) calendar/day-radius straight to core/radius/450; (3) calendar/day-focus-radius straight to core/radius/600; (4) date-picker/panel-radius straight to core/radius/600; (5) date-picker/panel-offset straight to core/space/100; (6) the radius semantic for floating layers is a separate foundation task, after the date picker; (7) the day of the nph-scheduler goes from 6 to 10 px in an adjustment task of the scheduler, after this acceptance; (8) the number and the outline of today and of the current month on color/primary-text, in the owner grid; (9) a date unavailable by rule takes focus and cannot be chosen, with a new day variant; (10) on field hover the calendar button stays without background and with the light icon. COMPONENT_SET nph-date-picker (6666:32), COMPONENT_SET of the nph-date-picker panel (6662:56378), the inner control row piece (6618:52542) and the owner grid nph-calendar (4015:28204, day 4015:28020)."
  }
}
```

# DSA-90 — `figma-docs-accepted`

The documentation of the nph-date-picker (frame `6673:62837`, page `1364:2`) was accepted in Figma in the file `DS-IA-NEPHOS 5.0`, with the visual acceptance of the root `6662:55010`. The date picker is a date field with a calendar: the person types the date or picks it in a panel. It has two modes, a single date and a range; the range has shortcuts and two months side by side. Its tokens came with this task and are on `v/5.0.0`.

What changed in the tokens with this task:

- Two new component groups in the semantic collection, 9 tokens: `calendar/*` (2, the day of the date grid `nph-calendar`) and `date-picker/*` (7, the field and the panel). Five alias semantics (rule 2 of T9). Four point straight to the core by decision (rule 3 of T9), each with the semantics of the same value that do not serve:
  - `calendar/day-radius` → `core/radius/450` (10): `radius/overlay` (10) is a large floating layer and `focus/radius-control` (10) is the focus halo of a control; neither is the radius of the day cell. The semantic with the function, `radius/control`, is 6, and the design owner asked for 10 (approval item 2).
  - `calendar/day-focus-radius` → `core/radius/600` (14): the cell radius (10) plus the ring `focus/ring-width` (4). `radius/surface` (14) is card, panel and sheet, not a halo, and there is no `focus/radius-*` for a base of 10 (item 3).
  - `date-picker/panel-radius` → `core/radius/600` (14), as `popover/radius` and `hover-card/radius`: `radius/surface` says DO NOT USE on a floating layer, and `radius/overlay` is a large layer (item 4).
  - `date-picker/panel-offset` → `core/space/100` (4), as `popover/offset`: `space/inline-tight` (4) is the space inside one unit and `space/stack-tight` (4) joins a label to what it describes; field and panel are two layers (item 5).
- No new semantic and no new primitive. No token has a new value or a new color.
- Descriptions with additions only, in Figma and in `design.md`: `core/radius/450`, `core/radius/600`, `core/space/100` (in `design.md`, the notes `direto_por_decisao` of `tokens_core_radius` and `tokens_core_space`), `color/border-subtle` (the panel outline and the footer divider), `space/inline-loose` (the range footer) and `color/primary-text` (today and the current month in the grid). In `design.md` also: the `nao_use` of `color/dropdown-border` now says the date picker panel has its own outline, and the radius table of section 2d names `calendar/day-radius` and `date-picker/panel-radius`.
- Left out of this task: the radius semantic for small floating layers (item 6) is a foundation task after this one; until then `popover/radius`, `hover-card/radius` and `date-picker/panel-radius` stay on `core/radius/600`.

There is no command output. The acceptance is a human observation, recorded in the json block above with the frame URL and the component sets.

The rest of this file is the contract converted to text, so that whoever codes does not need to open Figma. Figma property and value names stay as they are in Figma, between backticks. The Portuguese strings of Figma are examples and stay between backticks; the prose gives them in English. Where a point is not one of the 10 approval items, it follows the recommendation of the appendix, approved with the approval page with no veto (the appendix marks each such point "decided on 17-11, by the recommendation, with no veto").

## Purpose

Let the person enter a date or a period in a form: they type it as `dd/mm/aaaa` (day, month, year) or pick it in the calendar. A single date is for a due date, a schedule date or the date of a document. A range is for a report period, a validity period or a vacation.

## Component sets

- `nph-date-picker` (`6666:32`), 78 variants: `modo` (`data única`, default; `intervalo`) × `tamanho` (`compact` 28, `default` 36, default of the set; `large` 44) × `estado` (`padrão`, `hover`, `foco`, `erro`, `desabilitado`, `aberto`, `foco no ×`) × `conteúdo` (`vazio`, default; `preenchido`). `foco no ×` exists only filled, because the clear button only shows with a value. The default variant is single date, default size, rest, empty.
- `nph-date-picker / painel` (`6662:56378`), 6 variants: `modo` (`data única`, `intervalo`, `intervalo estreito`) × `tamanho` (`default`, `large`). Inner piece.
- `date-picker / controle` (`6618:52542`), 3 variants by `size`: the control row of the field (text and calendar button). Inner piece, it fills the control slot of the nph-field.
- The date grid `nph-calendar` (`4015:28204`, 4 variants: `modo` single or range × `tamanho` default or large), its day (`4015:28020`, 38 variants), its month and year cell (`4015:28139`), its month view (`4015:28166`), year view (`4015:28185`) and header (`3093:2225`). The grid is the owner piece, shared with the nph-scheduler mini month (section "Shared grid").

Set description in Figma (`6666:32`), translated from Portuguese: "Date field with calendar. Mode: single date (picking the day applies and closes) or range (Start and End fields, shortcuts, two months and Apply). Size: compact (28 px), default (36 px) and large (44 px). The panel is the inner panel piece. Tokens: date-picker/* and calendar/*."

## Tokens

| Token | Points to | Light | Dark | Where |
|---|---|---|---|---|
| `calendar/day-radius` | `core/radius/450` | 10 | 10 | Corner of the day cell in every state and of the month and year cell; the range middle and the preview are square (`radius/none`). Straight to core by decision |
| `calendar/day-focus-radius` | `core/radius/600` | 14 | 14 | Corner of the focus halo of the day cell and of the month and year cell. Straight to core by decision |
| `date-picker/panel-radius` | `core/radius/600` | 14 | 14 | Corner of the panel, in the 6 modes and sizes. Straight to core by decision |
| `date-picker/panel-border` | `color/border-subtle` | `core/neutral/50` (#F1F1F1) | `core/alpha/white-10` (white 10%) | 1 px panel outline (thickness `border/width`) |
| `date-picker/divider` | `color/border-subtle` | `core/neutral/50` | `core/alpha/white-10` | Divider above the range footer (an nph-separator instance) |
| `date-picker/panel-padding` | `space/container-padding` | 16 | 16 | Padding of the shortcut column and of the footer. DO NOT USE around the month: that padding is the grid's |
| `date-picker/panel-offset` | `core/space/100` | 4 | 4 | Distance between the field and the open panel, below or above. Straight to core by decision |
| `date-picker/trigger-gap` | `space/inline` | 8 | 8 | Between the date text and the calendar button, and between the Start and End fields |
| `date-picker/footer-gap` | `space/inline-loose` | 12 | 12 | Between Cancel and Apply in the range footer |

Values resolved on the `Sistemas` brand. The panel shell has no padding of its own: around the month, the 16 px come from the grid (`space/container-padding`), so the code must not add 16 px twice.

### Used directly or by instance

- Panel background `color/popover`, bound straight to the semantic, as in the nph-popover; shadow by the style `elevation/dropdown` in light and none in dark; outline thickness `border/width`. No component token for these.
- The grid binds semantics directly, with no component color token: `color/foreground`, `color/muted-foreground`, `color/accent`, `color/accent-foreground`, `color/primary`, `color/primary-foreground`, `color/primary-surface`, `color/primary-on-surface`, `color/primary-text`, `focus/border`, `focus/halo`, `focus/ring-width`, `border/width`, `state/disabled-opacity`, `control/height-default`, `control/height-large`, `space/container-padding` and `space/inline`.
- The day number, the month and year label and the weekday names have no text style in Figma: the font is bound to core variables (read by script on 17-11). The number and the month and year label: `core/font/sans`, `core/size/200` (14), `core/line-height/200` (20), `core/tracking/normal` (0), `core/weight/regular` (400) or `core/weight/medium` (500): the exact values of `text/body-md` (regular) and `text/label-md` (medium). The weekday names: `core/font/sans`, `core/size/100` (12), `core/weight/medium`, `core/tracking/normal`, no line height bound; no role has these exact values, and the closest is `text/label-sm` (12, line height 16, weight 500, tracking 0.4). `design.md` asks every text to use one of the 14 roles; `core/size/100` is not in `core.tokens.json`. In code, the number and the month and year label use `text/body-md` and, where the table says medium, `text/label-md`: the same values. Which role the weekday names use is decision D-3 of the task.
- By instance, with their own tokens: nph-field (`color/foreground`, `space/stack-tight`, `layout/field-width`, `status/error-text`, `color/muted-foreground`); nph-input (`radius/control`, `color/input`, `color/input-hover`, `color/background`, `color/muted-foreground`, `color/muted`, `input/clear-padding-end`, `status/error`, `state/disabled-opacity`, `focus/border`, `focus/halo`, `focus/border-radius-control`, `focus/radius-control-with-border`, `input/height-compact`, `control/height-*`, `space/control-padding`, `space/inline`); nph-button icon only (`icon/size-sm`, `icon/size-md`, `icon/size-lg`, `icon-button/secondary-ghost-background-hover`; the calendar icon in `color/muted-foreground` by override, as the icons of the nph-input); nph-button (`button/secondary-solid-background`, `color/primary`, `control/height-compact`, `control/height-default`, `radius/control`, `space/inline-tight`, `space/control-padding`); nph-option (`radius/inner`, `space/inline`, `color/primary-surface`, `color/popover-foreground`); nph-separator (`border/width`); nph-tooltip.

## Anatomy, read part by part in Figma

Read by script, variant by variant, after the token bindings (17-11). Order of the parts from top to bottom: the field and, below it, the panel, with the body (shortcuts and months), the divider and the footer.

1. **Field** (nph-field): label on top, control in the middle, help or error below; stacked, start aligned, 4 px between them (`space/stack-tight`); 320 px wide (`layout/field-width`). In the range, Start and End side by side, 8 px apart (`date-picker/trigger-gap`), aligned at the top. Each date has its own nph-field.
2. **Date text** (nph-input): it stretches in what is left of the control row; text and clear button centered vertically. The `dd/mm/aaaa` hint is in the help text, not in place of the label.
3. **Clear button** (the end icon of the nph-input, `xmark`): only with a value, at the end, centered vertically.
4. **Calendar button** (icon-only nph-button, secondary, ghost, icon `calendar` in `color/muted-foreground`, light at rest, solid on its own hover and when open): as tall as the field (side `control/height-compact`, `control/height-default` or `control/height-large`), 8 px after the text (`date-picker/trigger-gap`), centered vertically, at the end of the row. In the range, only in the End field. Corner `radius/control`.
5. **Panel**: it opens 4 px below the field (`date-picker/panel-offset`), aligned to the start of the trigger; background `color/popover`, 1 px outline in `date-picker/panel-border`, corner of 14 px (`date-picker/panel-radius`) and the `elevation/dropdown` shadow in light; no shadow in dark. Vertical, start aligned, edge to edge. The shell has no padding. The compact field opens the default panel.
6. **Shortcuts** (range only): a column on the left (on the narrow range, on top), top aligned, 192 px wide, padding 16 px (`date-picker/panel-padding`); seven nph-option of 36 px, stacked with no space between them: Today, Yesterday, Last 7 days, Last 30 days, This month, Last month, Custom (`Hoje`, `Ontem`, `Últimos 7 dias`, `Últimos 30 dias`, `Este mês`, `Mês passado`, `Personalizado`). The chosen shortcut is the selected option (`color/primary-surface` with the check marker). They are set apart from the months by space only, with no divider.
7. **Months**: to the right of the shortcuts, top aligned (on the narrow range, below them); one month in the single date and in the narrow range, two side by side in the range (in Figma, October and November 2026). Each month is the grid: header with the Previous month and Next month arrows (in the range, which arrows each month keeps: decision D-5 of the task) and the month title, which opens the month and year view; below, the weekday row and five week rows (a six-week month: decision D-1).
8. **Divider** (range only): a horizontal nph-separator, edge to edge, above the footer, start aligned, in `date-picker/divider`.
9. **Footer** (range only): Clear (`Limpar`, secondary ghost) at the start; Cancel (`Cancelar`, secondary solid) and Apply (`Aplicar`, primary solid) at the end, 12 px apart (`date-picker/footer-gap`); centered vertically, padding 16 px (`date-picker/panel-padding`), space between the two ends. Buttons compact (28) in the default panel; default (36) in the large panel, for touch screens.

Panel by mode (sizes read in Figma, default and large):

- Single date: the grid alone, 286 × 298 and 342 × 346.
- Range: body (shortcuts and two months, horizontal, top aligned), divider, footer; 762 × 359 and 874 × 415. A vertical divider between shortcuts and months exists in the piece, hidden on purpose.
- Narrow range: vertical: shortcuts on top (full width), one month, divider, footer; 286 × 643 and 342 × 699. A horizontal divider between shortcuts and month exists, hidden on purpose.

Grid `nph-calendar` (`4015:28204`): vertical, padding `space/container-padding` (16), gap `space/inline` (8); 284 × 296 (default) and 340 × 344 (large).

- Header: horizontal, centered vertically, gap `space/inline`: previous arrow (icon-only button, `chevron-left`, tooltip Previous month, `Mês anterior`), the title (an nph-button with the month and year, for example `outubro de 2026`, `text/label-md` in `color/secondary-foreground`, end icon `chevron-down` in `icon/size-sm`, gap `space/inline-tight`, side padding `space/control-padding`), next arrow (`chevron-right`, tooltip Next month, `Próximo mês`). Arrow icons `icon/size-md` (default) or `icon/size-lg` (large), in `color/secondary-foreground`. The header is 40 high in both sizes (`3093:2225`); on large the 44 px arrows go 4 px past it. The title sits in a frame between the arrows (164 wide on default, 204 on large), its content centered. Arrows: icon-only nph-button, secondary, ghost, square, size default or large as the panel. Title: nph-button, secondary, ghost, size default or large.
- Weekday row: seven cells of 36 × 36 (44 × 44 on large), Sunday first: `dom`, `seg`, `ter`, `qua`, `qui`, `sex`, `sáb`, in `color/muted-foreground`, Medium 12.
- Five week rows of seven days, as drawn in the four grid variants (284 × 296 = padding 16, header 40, gap 8, the weekday row and five weeks of 36, padding 16; 340 × 344 on large with rows of 44). Days outside the month are shown (for example 27 to 30 of the previous month). A month that spans six weeks has no drawing: decision D-1 of the task.

Day `4015:28020` (36 × 36 default, 44 × 44 large; the cell fills the variant, corner `calendar/day-radius`; the number in regular unless noted):

| Day | Cell | Number |
|---|---|---|
| default, current month | no background | `color/foreground` |
| hover | `color/accent` | `color/accent-foreground` |
| focus | 1 px `focus/border` (`border/width`) and a halo at −4 px (44 × 44 on default, 52 × 52 on large), corner `calendar/day-focus-radius`, ring `focus/ring-width` (4) in `focus/halo` | `color/foreground` |
| disabled (outside min or max) | under `state/disabled-opacity` | `color/muted-foreground` |
| disabled with focus (unavailable by rule; new, `7168:71852` default and `7168:71856` large; current month only) | no opacity; `focus/border` and the halo, as focus | `color/muted-foreground` |
| outside the month (default, hover, disabled) | as the state | `color/muted-foreground` |
| today | 1 px outline `color/primary-text` | `color/primary-text`, medium |
| today + focus | `focus/border` and the halo | `color/primary-text`, medium |
| selected | `color/primary` | `color/primary-foreground`, medium |
| selected + focus | `color/primary`, ring `focus/ring-width` in `color/primary-foreground`, and the halo | `color/primary-foreground` |
| selected + today | as selected (the fill wins over the outline) | `color/primary-foreground`, medium |
| range start and end | `color/primary`; behind the cell, a band in `color/primary-surface` that joins the middle | `color/primary-foreground`, medium |
| range middle | `radius/none`, `color/primary-surface` | `color/primary-on-surface` |
| range middle + today | `radius/none`, `color/primary-surface`, 1 px outline `color/primary-text` | `color/primary-on-surface`, medium |
| range middle, outside the month | `radius/none`, `color/primary-surface` | `color/muted-foreground` |
| preview (pointer or arrows after the start) | `radius/none`, `color/accent` | `color/foreground` |

The band runs straight across the end of a week (no rounding at the turn) and a day outside the month has no band.

Month and year cell `4015:28139` (84 × 36, height `control/height-default`, corner `calendar/day-radius`, the same radius as the day): default no background, `color/foreground`; hover `color/accent` with `color/accent-foreground`; focus `focus/border` and the halo with `calendar/day-focus-radius`; disabled under `state/disabled-opacity`, label `color/muted-foreground`; current month or year: outline and label in `color/primary-text`, medium; selected (with or without current): `color/primary` with `color/primary-foreground`; selected + focus: ring `focus/ring-width` in `color/primary-foreground` and the halo. Month view: header with the arrows and the year (`2026`) as the title, an nph-button secondary ghost with the end icon `chevron-up`, and a grid of 4 rows × 3 columns (`jan` to `dez`). Year view: header with the arrows and the twelve-year span (`2020 – 2031`) as plain text, not a button, and a grid of 4 rows × 3 columns. What the arrows and the titles do in these two views, their names and the keyboard inside them are decision D-9 of the task. Padding `space/container-padding`, gap `space/inline`. The two views are drawn on default only: 284 × 224 (header 40 and four rows of 36), lower than the day view (296). The views on the large panel, the panel height when the view changes and what picking a month or a year does are decision D-2 of the task.

Example strings in Figma (all Portuguese examples, translated by the code): labels `Data`, `Início`, `Fim` (Date, Start, End); hint `dd/mm/aaaa`; values `14/10/2026`, `26/10/2026` and `06/11/2026`, `31/02/2026` for an impossible date; error messages `Informe a data.` (Enter the date.), `Informe a data de início.` (Enter the start date.), `Data inválida: confira o dia e o mês.` (Invalid date: check the day and the month.). No separator or prefix in the field texts.

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | Day number in `color/foreground` over `color/popover`: 21:1 in light and 9.93:1 in dark. Day outside the month and weekday names in `color/muted-foreground`: 6.69:1 and 6.61:1. Chosen day, start and end in `color/primary-foreground` over `color/primary`: 5.37:1 and 7.05:1. Range middle in `color/primary-on-surface` over `color/primary-surface`: 4.78:1 and 13.79:1. Number and outline of today and of the current month in `color/primary-text`: 8.11:1 and 6.05:1 on the default brand; in dark, at least 5.98:1 in every brand. Error message in `status/error-text`: 6.88:1 and 6.96:1. Calendar button icon in `color/muted-foreground`: 6.69:1 and 9.81:1 over the field; 5.76:1 and 5.11:1 over the hover background of the button. |
| Visible focus | By keyboard, field, clear button, calendar button, arrows, month title, days, Clear and Cancel show the `focus/border` border and the halo. The border measures 5.37:1 in light and 7.88:1 in dark over the panel, and 5.37:1 and 11.70:1 over the page background; the border carries the 3:1. On Apply, the focus border has the button color (`color/primary`) and the halo marks the focus, as on the primary nph-button. In the shortcut list, the shortcut active by keyboard takes the hover look of the nph-option. |
| Color is not the only signal | Today has an outline; the chosen day, the start and the end have a fill; the range middle has a band; the error has a text message; disabled fades and does not accept a choice. |
| Touch target | Field and calendar button: 28, 36 and 44 px high (compact, default, large). Day and month arrows: 36 px in the default panel and 44 px in the large. Shortcuts: 36 px. Footer buttons: 28 px and, on large, 36 px. All pass the 24 × 24 px of WCAG 2.5.8. On a touch screen, use large. |
| Accessible name | The field has a visible label in the nph-field; the `dd/mm/aaaa` hint is in the help text, never in place of the label. The calendar button and the arrows are icon-only buttons, with a tooltip that is also the name: Open calendar, Previous month and Next month (`Abrir calendário`, `Mês anterior`, `Próximo mês`). |
| Keyboard | Tab goes through the field, the clear button (with a value) and the calendar button. Enter or Space on the button opens the panel, with focus on the chosen date or on today. In the grid, the arrows change the day; Page Up and Page Down change the month; Home and End go to the start and the end of the week. A date unavailable by rule takes focus, but Enter does not choose it; a day outside the min and max is skipped. If today is outside the limit, the panel opens with focus on the nearest allowed day. Esc closes with no change and returns focus to the button. In the panel, Tab goes through the shortcuts, the month headers (Previous month, the title of each month, which opens the month and year view, and Next month), the grid and the footer. |
| Error | The message comes from the nph-field, in `status/error-text`, below the field and with no icon; the field border goes to `status/error`. |
| Disabled | The field and the calendar button fade under `state/disabled-opacity` and do not open the panel. A day before the min or after the max fades, does not accept a choice and focus skips it. A date unavailable by rule, such as a holiday, also fades the number and does not accept a choice, but it takes keyboard focus, with the focus border and halo. With error and disabled at the same time, disabled wins. |

## Properties, variants and states

| Property | Values and use |
|---|---|
| `modo` | `data única` (default of the set): one field and one month; picking the day applies and closes. `intervalo`: Start and End fields, shortcuts, two months and a footer with Apply. |
| `tamanho` | `compact` (28 px), `default` (36 px) and `large` (44 px), the height of the field and of the calendar button. Default on a common form, compact on a dense screen with a pointer, large on a touch screen. The compact opens the default panel; default and large open the panel of their size. |
| `estado` | `padrão`, `hover`, `foco`, `erro`, `desabilitado`, `aberto` and `foco no ×`. Focus on the clear button only exists filled. When open, the calendar button keeps the hover look, with the solid icon, and the panel shows right below. On field hover only the field border changes: the calendar button stays without background and with the light icon (item 10). |
| `conteúdo` | `vazio`: the field shows `dd/mm/aaaa` in `color/muted-foreground` and has no clear button. `preenchido`: the date in the field and the clear button at the end. |
| panel | Inner piece `nph-date-picker / painel`: mode single date, range and narrow range (narrow screen: one month, shortcuts on top) × size default and large. |
| Outside the properties | Label, help text, error message, the Start and End labels, min and max date and the shortcut list: text and data of each screen. |

## Relations and context

Pieces by instance: nph-field, nph-input, icon-only nph-button, nph-tooltip on the arrows and on the calendar button, the `nph-calendar` grid, nph-option in the shortcuts, nph-button in the footer and nph-separator. The panel follows the nph-popover shell (radius, outline, shadow, divider and footer), but it is its own frame, because the range measures 762 px and the widest popover measures 400 px. The nph-scheduler uses the same `nph-calendar` grid.

| Space | Measure and token |
|---|---|
| Panel and field | 4 px (`date-picker/panel-offset`); near the end of the window, the panel opens above, also at 4 px |
| Panel padding | 16 px on the shortcut column and on the footer (`date-picker/panel-padding`) and around the month (`space/container-padding`, the padding of the grid); the panel shell has no padding of its own |
| Text and calendar button | 8 px (`date-picker/trigger-gap`) |
| Start and End | 8 px (`date-picker/trigger-gap`) |
| Cancel and Apply | 12 px (`date-picker/footer-gap`) |
| Label, control and message | 4 px (`space/stack-tight`), from the nph-field |

The appendix section "order and alignment" names the semantic each component token points to (`space/inline`, `space/inline-loose`, `space/container-padding`, `core/space/100`); the measures are the same, and the code binds the component token of the table above.

## When to use

- A form date that the person types or checks in the calendar: due date, schedule, issue date of a document.
- A period whose start and end go together and need confirmation: report, validity, vacation. Use the range mode, with Apply.
- A date the person knows by heart and that is far from today, such as a birth date: the field accepts typing, and the calendar is only on the button.
- Not for choosing only a month, only a year, a week, a quarter or a time: those types are outside the component.

## Required examples (in Figma, light and dark)

1. Due date: single date, filled.
2. Report period: range open, Custom chosen, Apply in the footer.
3. Invalid date: `31/02/2026` and the message saying what to fix.

## Do

- Keep the label visible and the `dd/mm/aaaa` hint in the help text.
- In the range, use the two fields, Start and End, and a single calendar button, in End.
- Write the error message saying what to fix, such as "Enter the date." or "Invalid date: check the day and the month."
- On a touch screen, use large; on a narrow screen, the range panel shows one month, with the shortcuts on top.

## Do not

- Two single date fields for the start and the end of a period: use the range mode, which applies both dates together.
- Compact on a touch screen: 28 px is small for a finger; use large.
- The calendar as the only way to a date the person knows by heart, such as a birth date: let them type.
- A date picker to choose only a month, only a year or a time: those types are outside the component.

## Default behavior (appendix, accepted with the documentation)

Base: WAI-ARIA APG, Date Picker Dialog example; for the range, React Aria and MUI X. "APG: no" marks an addition, decided in the plan or on the approval page of 17-11. "Diverges" is what Nephos does differently from the APG.

| Situation | What happens · APG? · source |
|---|---|
| Tab and Shift+Tab on the trigger | Field → clear button (only with a value) → calendar button; each one a Tab stop. APG: yes (field and button); the clear button comes from the nph-input by instance (its Tab stop is DSA-16 D2, open). |
| Enter or Space on the button | Opens the panel and puts focus on a day. APG: yes. |
| Focus on opening | On the date of the field; with an empty or invalid field, on today. In the range, which months open and how the two months move: decision D-5 of the task. With today outside the min or max: on the nearest allowed day (item 9). APG: yes (date or today); the limit is an addition. |
| Arrows in the grid | ← and → change the day; ↑ and ↓ go to the same weekday in the previous or next week; the grid is a single Tab stop. APG: yes. |
| Page Up and Page Down | Previous or next month, on the same day (or on the last day of the month). Shift + Page Up or Page Down: same month in the previous or next year. APG: yes. |
| Home and End | First and last day of the week. APG: yes. |
| Enter or Space on a day, single date | Applies, closes, writes the date in the field and returns focus to the button. APG: yes. |
| Enter or Space on a day, range | The first one marks the start; the second marks the end; the panel does not close and the period only counts on Apply. A third pick, a one-day period and Apply with nothing or only the start: decision D-10 of the task. APG: no (decided in the plan, footer with Apply). |
| End before start | Reorders: the earlier date becomes the start. APG: no (by the recommendation). |
| Esc | Closes without changing the value; in the range, discards what was not applied; focus returns to the button. APG: yes. |
| Esc with the month or year view open | The first Esc goes back to the day grid and the second closes (by the recommendation). APG: no. |
| Click outside | Closes without applying, as Cancel. Diverges (the APG dialog is modal). |
| Tab inside the panel | Order: shortcuts → Previous month, the title of each month (opens the month and year view) and Next month, in the order they appear → grid → Clear, Cancel, Apply. Focus is not trapped (non-modal panel, as the nph-popover). After the last item: close the panel and return focus to the button (by the recommendation). Diverges (the APG traps Tab; the month and year view is an addition decided in the plan). |
| Focus on closing | Back to the calendar button; in the range, to the button of the End field. APG: yes. |
| Pointer and focus | Hover paints the day and does not move focus. With the start marked, hover and the arrows move the band preview. On touch there is no preview. Diverges (in the APG hover only adds a border). |
| Shortcuts by keyboard | With the nph-option: the list is one Tab stop; ↑ and ↓ move between options; Enter or Space chooses; the shortcut fills the band and waits for Apply. The period of each shortcut and what Custom does: decision D-6 of the task. APG: no (it follows the listbox pattern). |
| Unavailable day | Outside the min or max: disabled and skipped by focus. Unavailable by rule: takes focus with `aria-disabled` and cannot be chosen (item 9). APG: no. |
| Typing in the field | The `dd/mm/aaaa` hint is in the help text, linked to the field by `aria-describedby`, and the value is validated when the person leaves the field; the error comes through the nph-field; in the range, the error stays only on the field with the problem. No input mask (DSA-16 D1). APG: yes (the hint); validation is not in the APG. A typed date outside the limits, unavailable, or an End before the Start: decision D-4 of the task. |
| Near the window edge | Opens below; with no room, it flips above, 4 px from the field (DSA-29 D-2). When not even above fits: shrink with an inner scroll (by the recommendation). APG: no. |
| Announcement | The month name is announced by a live region apart from the title button (`aria-live="polite"`); the day label says its state (today, chosen, unavailable). Chosen period: announce it, as "9 to 20 May 2026" (by the recommendation). APG: yes (month); the period is an addition. |
| Narrow screen | One month, shortcuts on top; hover does not apply on touch. When it switches: decision D-7 of the task. APG: no. |
| Range footer | Clear empties the period (when the fields empty and whether the panel stays open: decision D-8 of the task); Cancel closes without applying; Apply saves and closes. APG: no (the APG has OK and Cancel only for the single date). |
| Code | Event, aria, slot, property and console warning belong to the code, following the APG and the Custom Elements Manifest. |

## Combined states (T11)

Rule T11 of the decision log, the same in every component: (1) selected or checked + disabled: the piece keeps the fill and the mark under `state/disabled-opacity`. It applies to a chosen and disabled shortcut (nph-option, DSA-29 D-3). (2) Error + disabled: disabled wins; the error border and the message go away and only the opacity stays. It applies to the field (DSA-16 D5 and DSA-28 D8). Chosen day + disabled does not apply: an unavailable day cannot be chosen.

## Icon and image

| Icon | Weight and size (read in the piece) |
|---|---|
| `calendar` (calendar button) | light at rest and on field hover; solid on the hover of the button itself and when open (the button in hover-active); 16 px on compact (`icon/size-sm`), 20 px on default (`icon/size-md`) and 24 px on large (`icon/size-lg`), from the icon-only nph-button. Color `color/muted-foreground`, as the nph-input icons. Fixed in each variant, with no weight property. |
| `xmark` (clear button) | light, 16 px (`icon/size-sm`) on the three sizes, from the nph-input. |
| `chevron-left` and `chevron-right` (Previous month and Next month) | light; 20 px (`icon/size-md`) in the default panel, on a 36 px button, and 24 px (`icon/size-lg`) in the large, on a 44 px button; solid on hover, as every icon-only nph-button (DSA-47 D1). In Figma it is an override on the instance. |
| `chevron-down` (month title, opens the month and year view) | light, 16 px (`icon/size-sm`), inside the nph-button. |
| `chevron-up` (year title of the month view) | light, 16 px (`icon/size-sm`), inside the nph-button. What it does: decision D-9 of the task. |
| `check` (chosen shortcut) | light, 16 px (`icon/size-sm`), the marker of the nph-option. |
| Image | None in the component. |

## Limits

- Measures read, with five week rows (with six, decision D-1, the day view adds 36 on default and 44 on large): field 320 px (`layout/field-width`); single date panel 286 × 298 (default) and 342 × 346 (large); range 762 × 359 and 874 × 415; narrow range 286 × 643 and 342 × 699; grid 284 × 296 and 340 × 344 (day of 36 and 44 px).
- Narrow screen: the range panel switches to one month with the shortcuts on top (the `intervalo estreito` mode).
- Near the window edge: it opens above; when neither fits, the panel shrinks with an inner scroll.
- Shortcuts: seven, 36 px each (252 px), with no space between them; a long shortcut label stays on one line with an ellipsis (DSA-29 D3).
- Long help text and long error messages wrap, with no ellipsis (DSA-28 D-4, open, inherited).
- Types outside the component: only month, only year, week, quarter and time.

## What the date picker asks of the pieces it uses

Read on `v/5.0.0` (17-11), spec by spec:

| Piece | What the date picker asks | Does it do it today? |
|---|---|---|
| nph-field | Label, help (the hint) and error around the control, the error state on the control | Yes. Its slot takes "one control, such as nph-input" (`fichas/nph-field.md:105`) and the field writes the name and the description on that control. Here the control row holds an nph-input and a calendar button: open point below. |
| nph-input | The text, the clear button only with a value, focus on the clear button, compact size | Yes (`fichas/nph-input.md`, `clear-label` and focus-clear; DSA-59 for compact). |
| icon-only nph-button | Secondary ghost button with a tooltip as its name, solid icon on its own hover, the open look while the panel is open | Yes: the open trigger look needs `aria-haspopup` and `aria-expanded="true"` on the host (`fichas/nph-button.md:187` and `:348`). |
| nph-option | The shortcut list: one option per shortcut, the chosen one selected with the check marker | In part: the spec says to write nph-option only as a child of the list that owns it, such as nph-select (`fichas/nph-option.md:156`). Here the owner is the shortcut list of the date picker: open point below. |
| nph-separator | The footer divider in `date-picker/divider` (`color/border-subtle`) | The spec fixes the color at `color/border` (`fichas/nph-separator.md:37`), and the nph-popover already does the same: it redefines `--nph-color-border` in the scope of its divider with `--nph-popover-divider` (`src/components/nph-popover/nph-popover.css:164-166`). The date picker does the same with `--nph-date-picker-divider`. |
| nph-popover | The panel shell (radius, outline, shadow, divider and footer) | The panel is a surface of its own, not an nph-popover: the popover widths stop at 400 (`fichas/nph-popover.md:96`) and the range panel measures 762. Same behavior: Esc, click outside, focus back to the trigger, not trapped (DSA-67). |
| nph-button | Clear (secondary ghost), Cancel (secondary solid), Apply (primary solid), compact in the default panel and default in the large | Yes (DSA-13, DSA-60, DSA-64). |
| nph-tooltip | The name of the icon-only buttons; not on a disabled arrow | Yes (DSA-42, DSA-48). |

## Shared grid with the nph-scheduler

The `nph-calendar` grid (`4015:28204`) and its day (`4015:28020`) are the owner piece; the nph-scheduler mini month and compact month use it by instance in Figma (DSA-77, decision 9). In code, DSA-77 keeps the scheduler date grid of its own until the date-picker grid has a task (DSA-77 D-1); this task builds that grid.

What this acceptance changed in the owner piece, in Figma:

- Item 8: today and the current month on `color/primary-text`, number and outline, on the day and on the month and year cell. `color/primary` stayed below 4.5:1 in dark on six of the seven brands (1.83:1 on `Gerencial`); `color/primary-text` gives 6.05:1 in dark on the default brand and at least 5.98:1 in every brand.
- Item 9: the day gained the `estado` value `desabilitado foco` (`7168:71852` default and `7168:71856` large).
- Item 7: the scheduler keeps its day at 6 px (`scheduler/day-radius` → `radius/control`) for now; aligning it with `calendar/day-radius` (10) is an adjustment task of the scheduler, after this acceptance, with a preview. The day focus also differs today: the scheduler draws a border plus a halo "with border" (`scheduler/focus-border-radius`, `scheduler/focus-halo-radius`); the grid draws an inner border plus a halo of 14 px (`calendar/day-focus-radius`). The same adjustment task covers it.
- Text styles: the owner grid binds core type variables instead of a text style (section "Used directly or by instance"); the weekday role is decision D-3 of the task.

## Inherited decisions

- follows DSA-16 D1: no input mask in v1; the date picker does not use a mask (the hint and the validation on leaving the field).
- follows DSA-16 D2: the end icon of the nph-input always clears and only shows with a value; the calendar gets a button of its own.
- follows DSA-16 D3 and D4: `icon/size-sm`, `space/inline`, `space/control-padding` and `text/body-md` of the field, and the focus of the field and of the clear target, come from the instance.
- follows DSA-16 D5 and DSA-28 D8: error border `status/error`; disabled wins over error; the disabled field fades only the control (the field and the calendar button).
- follows DSA-16 D7: field icons light at rest; the calendar button goes solid when open, as the month arrows (DSA-47 D1).
- follows DSA-16 D6 in part, with DSA-28 D6: each field sits inside the nph-field; the control fills the field, which measures `layout/field-width` (320), and the nph-input stretches.
- follows DSA-28 D1 to D5: the field label can carry the info open in the nph-tooltip; no icon on the error line; help in `text/caption` (the `dd/mm/aaaa` hint uses it); help in `color/muted-foreground` and error in `status/error-text` (DSA-67, "Changes outside"); `space/stack-tight` between label, control and message.
- follows DSA-29 D1 in part and D-2: the panel opens 4 px below the field, as the select list, with its own token (`date-picker/panel-offset`); near the end of the window it opens above, 4 px from the field, when it fits.
- follows DSA-29 D2: the panel enters with opacity and a 4 px slide (`motion/enter-*`) and leaves with `motion/exit-*`; with reduced motion, opacity only.
- follows DSA-29 D3, D5, D8, D9 in part and D-3 (shortcuts as nph-option): label on one line with an ellipsis; the shortcut active by keyboard has the hover look; the chosen one keeps `color/primary-surface` and the marker in `color/primary`; 0 px between options; the 296 px maximum height of the list does not apply (seven shortcuts of 36 = 252 px); chosen and disabled keeps the fill and the marker under `state/disabled-opacity`.
- follows DSA-47 D1 and DSA-52: the month arrows swap the icon from light to solid on hover.
- follows DSA-64 D-1: Cancel secondary solid has the same background inside and outside the nph-dialog.
- follows DSA-67 D-2: the open calendar button keeps the hover-active look and carries `aria-expanded="true"`, as the open trigger of the popover and of the dropdown.
- follows DSA-67 (spec) in part: closes with Esc, click outside and the footer action; focus returns to the trigger; the surface does not clip the content; one divider edge to edge before the footer; footer with secondary solid and primary solid compact 12 apart; shadow `elevation/dropdown` in light and none in dark. Diverges: width (a panel of its own) and the extra Clear at the start of the footer.
- follows DSA-77 D-1 (answered on 16-11): provisional; the scheduler keeps its own date grid until this grid exists, and then it is replaced; the compact month keeps the arrow keys.
- follows DSA-77 D-3 (answered on 16-11): `scheduler/mini-month-cell-size` → `control/height-default` (36), the size of the grid day.
- follows DSA-29 D9 (answered): `layout/max-list-height` holds 8 options of 36; it does not apply to the shortcut column (seven of 36 = 252).
- follows DSA-77 decisions 2 and 8: the name `nph-calendar` belongs to the date-picker grid; the week starts on Sunday, with Monday available.
- uses the same semantic as DSA-77 decisions 3 and 4: `color/border-subtle`, extended there to the scheduler outline and grid lines, is also the panel outline and divider here; `space/container-padding`, the scheduler padding, is also the 16 px of `date-picker/panel-padding`.
- follows DSA-77 decision 10: the focus of the primary nph-button in dark is fixed in the owner piece, apart; Apply inherits the fix by instance.
- follows DSA-42 D1 to D5 and D7, DSA-48 D1 and its rules 4 and 5, and DSA-43 ("No tooltip"): the tooltip has no side in Figma, opens above and flips when it does not fit; `space/inline` (8) between tooltip and button; centered on the button; it follows a scroll; Esc or loss of focus closes; opacity only; on hover it waits `motion/hover-delay` (300 ms), on focus it opens at once; it does not open on a disabled element (the month arrow at the min or max has no tooltip); an icon-only button always has a tooltip, which is its name, announced once.
- follows DSA-59: the compact field (28) opens the default grid.
- follows DSA-60: Clear (secondary ghost) by instance, with the `color/accent` hover.
- inherits whatever answer comes for the open decisions: DSA-16 D1 to D5 of the JSON (the name of an nph-input outside the nph-field, the clear button as a Tab stop, its 24 × 24 target on large, the hover transition of the border, readonly outside v1), DSA-28 D-3 (the hint comes back when disabled hides the error, as the code already does) and D-4 (long help and error wrap), DSA-48 D2 (a click during the 300 ms wait), DSA-43 D2 (Esc closes the tooltip first), DSA-59 D1 (5 px end inset on compact without the clear button), and DSA-67 D-3 (`aria-controls` on the host). None of them changes this contract.
- does not apply: DSA-28 D7, D-1, D-2 and D-5 (option group mode, counter and the `use` of the field widths), DSA-29 D4, D6, D7 and D-1 (start icon, dot and arrow area of the select), DSA-67 D-1 and D-4 (arrow and title of the popover), DSA-42 D6 (the info of the nph-label), DSA-77 decisions 1, 5, 6, 7, 11 and 12 and D-2, D-4 to D-7 (events, scheduler focus, Tab order of the scheduler, side panel, icons, color swatch, day click).

## Decisions answered (approval page of 17-11, all as recommended)

1. Documentation `6673:62837` accepted.
2. `calendar/day-radius` → `core/radius/450` (10), straight to core by decision.
3. `calendar/day-focus-radius` → `core/radius/600` (14), straight to core by decision: the cell 10 plus the ring 4, as the focus radius in Atlassian.
4. `date-picker/panel-radius` → `core/radius/600` (14), straight to core by decision, as `popover/radius` and `hover-card/radius`.
5. `date-picker/panel-offset` → `core/space/100` (4), straight to core by decision, as the five offsets of the floating layers.
6. The radius semantic for floating layers is a foundation task after the date picker: it lists the floating layers (14 on popover, hover card and the date picker panel; 12 on dropdown and the sidebar flyout panel; 10 on toast and command; 8 on navigation menu), decides in Figma whether they unify and only then creates the semantic by role. Nothing changes now.
7. The scheduler day goes from 6 to 10 px in an adjustment task of the scheduler, after this acceptance, with a preview (section "Shared grid").
8. Today and the current month on `color/primary-text`, number and outline, in the owner grid; the scheduler inherits in Figma.
9. A date unavailable by rule takes focus and cannot be chosen, with the new day variant; outside the min and max the day stays disabled and skipped; with today outside the limit, focus opens on the nearest allowed day.
10. On field hover the calendar button stays without background and with the light icon; the hover background and the solid icon come only with the pointer on the button and when open.

## Followed without a question (approved with the approval page, no veto)

These points of the appendix were not approval items. Their recommendation was already on the accepted root or set, or they are behavior that changes no approved piece, semantic or scope; the approval page listed them for a veto and none came:

- Tokens that only alias an existing semantic: `date-picker/panel-border`, `date-picker/divider`, `date-picker/panel-padding`, `date-picker/trigger-gap`, `date-picker/footer-gap`.
- On the root or the set: the day hover and the month and year cell with 10 px; the panel at 14 px; the preview as a continuous band in `color/accent` (the `prévia` selection value); shortcuts as nph-option with the seven labels; Start and End as two fields in the trigger; Clear, Cancel, Apply; one month with the shortcuts on top on a narrow screen; new grid pieces, with no override on the instance; a straight band at the turn of the week; no band on a day outside the month; the 4 px radius of the option kept on the shortcuts; a panel of its own; the `dd/mm/aaaa` hint in the help text with validation on leaving; the calendar button beside the text, inside the nph-field; no vertical divider; default size as the default variant; 10 px as the day radius.
- Behavior: reorder when the end comes before the start; Tab after the last item closes and returns focus to the button; the first Esc closes the month or year view and the second closes the panel; shrink with an inner scroll when the panel fits neither below nor above; announce the chosen period.
- From 29-10: the clear button takes focus; the panel opens over the content; the clear target is 24 × 24; the example error text says what to fix; `<nph-date-picker>` has no attributes in Figma until the spec of the code.

No decision is open in the appendix.

## Decisions opened by the review (17-11)

The reviews of the repository found ten questions with no drawing or rule in Figma: a six-week month (D-1), the month and year views on large and the panel height (D-2), the text role of the weekday names (D-3), typed dates outside the limits (D-4), how the two months of the range move (D-5), the period of each shortcut (D-6), when the range switches to one month (D-7) and what Clear does (D-8), what the arrows, titles and keys do in the month and year views (D-9) and the selection cycle of the range (D-10). They are open with the design owner in the task (`pending_decisions` and the section "Decisions open with the design owner"), each with a recommendation from market research with sources and what the code does until she answers; none blocks the pull request. D-1, D-2, D-5 and D-9 need a Figma preview before she decides.

## Hidden on purpose in Figma

- The vertical divider between the shortcuts and the months (range panel, default and large) and the divider between the shortcuts and the month on the narrow range: no divider there.
- The value text when empty: only the `dd/mm/aaaa` hint shows.
- In the documentation, the "wrong, on purpose" examples of the Do not section.

## Sources

- Figma `DS-IA-NEPHOS 5.0`, page `1364:2`, documentation frame `6673:62837`, root `6662:55010`, appendix `6680:32`
- Component sets: nph-date-picker `6666:32`; nph-date-picker panel `6662:56378`; control row `6618:52542`; grid `4015:28204`, day `4015:28020`, month and year cell `4015:28139`
- WAI-ARIA APG, Date Picker Dialog example: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/
- WAI-ARIA APG, Listbox: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
- WAI-ARIA APG, keyboard interface, focusability of disabled controls: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#focusabilityofdisabledcontrols
- React Aria, RangeCalendar: https://react-aria.adobe.com/RangeCalendar
- React Aria, DateRangePicker: https://react-aria.adobe.com/DateRangePicker
- React Aria, Popover: https://react-aria.adobe.com/Popover
- React Aria, date and time pickers: https://react-aria.adobe.com/blog/date-and-time-pickers-for-all
- MUI X, Date Range Picker: https://mui.com/x/react-date-pickers/date-range-picker/
- MUI X, shortcuts: https://mui.com/x/react-date-pickers/shortcuts/
- Carbon, date picker usage: https://carbondesignsystem.com/components/date-picker/usage/
- Floating UI, size: https://floating-ui.com/docs/size
- WCAG 2.2, contrast minimum: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- WCAG 2.2, non-text contrast: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- WCAG 2.2, target size minimum: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- Atlassian, radius: https://atlassian.design/foundations/radius
- Custom Elements Manifest: https://github.com/webcomponents/custom-elements-manifest
- `design.md` — the tokens named in this evidence
- `fichas/nph-field.md`, `fichas/nph-input.md`, `fichas/nph-button.md`, `fichas/nph-option.md`, `fichas/nph-select.md`, `fichas/nph-separator.md`, `fichas/nph-popover.md`, `fichas/nph-tooltip.md`, `fichas/nph-icon.md`, `fichas/nph-scheduler.md`
