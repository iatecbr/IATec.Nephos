# Triage of the Angular validation of `@iatec/nephos@5.0.0-rc.2`

This note has no translations: it is an internal triage record, not usage
documentation. See [`../../i18n.md`](../../i18n.md) and the [index](README.md).

Triage of the raw findings in [`validation.md`](validation.md) and [`ux-audit.md`](ux-audit.md).
**Nothing here is a decision.** It sorts each finding by who can act on it, and
it fixes nothing: no component, token, `design.md` or sheet changed in this pull
request. Tokens and the visual contract come from Figma `DS-IA-NEPHOS 5.0`,
through Indiane and Claude in Figma; component code is Elvys's and his agent's;
task IDs come from Jira, through Indiane. This note carries **no DSA ID**: the
batches below are named `B-nn` so they can become Jira tasks later.

Checked against `origin/v/5.0.0` at `43537e0` by reading code; the test suite was not run.

## 1. Summary

| Group | Meaning | Rows |
|---|---|---|
| **A** | Needs a design decision, a token, a contract or a documentation change in Figma, or is an open D item | **122** |
| **B** | Code here, no change to token or visual contract | **33** (in 19 batches) |
| **C** | Documentation here: sheets, `docs/`, the Angular guide, Storybook | **44** |
| **D** | Outside the library, already documented, not reproduced or not tested | **75** |
| **Resolved in rc.2 itself** | Marked resolved by the source (`bfd9207`, before `caaece9`); **0 rows** are resolved by commits after `caaece9` | **2** |
| **Composition** | Defect of the validation app, excluded | **5** |
| **Total rows** | | **281** |

How the rows were counted:

- A row is one source finding. The base is **281 rows = 35 + 133 + 113**: the 35
  priority rows of `validation.md` (P0 #1-#5, P1 #6-#12, the 10 P2 bullets, E1-E13);
  133 findings of its §4 component sections that are not already P0, P1, P2 or E;
  and 113 rows of `ux-audit.md` (the **112 `####` headings** plus the one untitled
  `[P2, composition]` paragraph in the dialog section). This follows the 112-versus-109
  note in the [index](README.md#where-the-sources-and-the-brief-disagree).
- 150 further bullets of §4 repeat a P0, P1, P2 or E row. They are **not** counted
  twice: they follow the row they repeat.
- Several rows share one root cause, so the work is smaller than the row count.
  Group A has 16 themes, and group B has 19 batches.
- Each row has one primary group. A row can also hold a secondary part, noted in its
  theme or batch (for example P0 #1 is B with a group C recipe).
- `UX-` and `VAL4-` IDs are assigned here, because the sources have none (see §7).

### Rule for A versus B

B is behavior, API, accessibility, DOM, integration or build that does **not** change
what Figma documents visually. A is anything that changes a size, color, spacing,
minimum target, wrap policy, token, contract or scope, even when the fix is only
CSS. When a row could be either, it is listed in A with a question, not in B with
a guess.

### Resolved in rc.2 itself; nothing resolved since

Only 20 commits separate rc.2 (`caaece9`) from the base, and the only code change is
`nph-popover` (DSA-67, `f0a1c46`), which also moved `nph-button` (an open popover
trigger draws `hover-active`) and `nph-field` (the error text token is now
`status/error-text`). None of those changes closes a finding, so no B or C row is
resolved by later work. Both rows below were already marked resolved by the source,
and `bfd9207` is an ancestor of `caaece9` (checked with `git merge-base --is-ancestor`).

| Row | State | Where |
|---|---|---|
| `E1` | `docs/consuming.md` no longer lists 10 components: it says "every `nph-*` entry point the package exports" and points to the manifest. The source called it partially resolved because the root `README.md` has no component list; it still has none and links to `consuming.md`, so nothing needs writing unless Indiane wants a list there | `bfd9207` (`chore(release): 5.0.0-rc.2`) |
| `E12` | The published rc.2 carries `5.0.0-rc.2` in `package.json` | `bfd9207` |

Two rows are already covered without a commit: `P0 #5` is documented in the sheet
(`fichas/nph-sidebar-item.md:60`: a link without `href` draws nothing and logs in
development), so only the dead log (B-01) remains; and `UX-progress-1` is already
the CSS the audit asks for (`nph-progress.css:24-28`, DSA-65).

### Work in progress to avoid colliding with

| In progress | State | Batches and rows that touch it |
|---|---|---|
| `nph-dropdown-menu`, DSA-69 | session working | B-01 (per file), B-02, B-03, B-04 (indirect), B-18 (JSDoc); A-01, A-05, A-07 |
| `nph-icon` | in progress | B-01 (per file), B-17 |
| `nph-hover-card`, DSA-68, PR #157 | not in `src/components` yet; only tokens exist | none of the findings covers it; B-01 and B-03 must include it when it merges |
| `nph-navigation-menu`, DSA-62, PR #158 (tests only) | session working | B-01 (per file), B-03, B-18 (JSDoc); A-01, A-05, A-07 |

## 2. Group A: Figma and Indiane

122 rows in 16 themes. Each theme says what to decide or adjust in Figma, and why. Rows with an existing D item name it, so the question is not raised twice.

### A-01. Brand tokens in dark mode (4 of 7 brands)

**What the audit found.** In `dark`, `gerencial`, `educacao`, `igrejas` and `rh` lose the active, selected and focus states: in `educacao`, `--nph-color-primary-hover` and `--nph-color-primary-surface-hover` are the same value (`#664412`), so the active item, the counter pill, the rail icon and the checked dropdown item disappear (1.00:1 to 2.16:1; focus ring 1.76:1 and 2.57:1). The semantic tokens `sidebar/item-foreground-active`, `sidebar/item-foreground-open`, `sidebar/item-badge-background`, `sidebar/rail-background-active`, `sidebar/rail-foreground-active` and `navigation-menu/current-foreground`, and the checked `single` item of the dropdown, all point at those two tokens. This is one root cause behind several rows. `nph-navigation-menu` already records it as D-5 of DSA-62.

**To decide or adjust in Figma.** Which tokens carry "active text on a neutral surface" in dark for the four failing brands, and which value does the focus border take in dark? Please confirm in Figma `DS-IA-NEPHOS 5.0` and send the token change through Claude in Figma. Is a brand-by-mode contrast gate (3:1 for focus and active, 4.5:1 for text) acceptable as a `test:tokens` rule?

**Touches work in progress:** sidebar-*, navigation-menu, dropdown-menu (tokens only).

| Source row | Piece | Finding |
|---|---|---|
| `P2#1` | sidebar-rail-button, sidebar-item | Rail counter covers the icon; open group and active item share one color token. |
| `UX-sidebar-item-1` | nph-sidebar-item | dark + `educacao` (and gerencial/igrejas/rh): active item, open group and counter pill disappear (1:1); focus ring 1.76:1 |
| `UX-sidebar-rail-button-2` | nph-sidebar-rail-button | dark + `educacao`: active icon disappears (1:1); focus 1.76:1 |
| `UX-sidebar-subitem-1` | nph-sidebar-subitem | dark + `educacao`: active subitem disappears (1:1); focus 1.76:1 |
| `UX-navigation-menu-1` | nph-navigation-menu | dark + `educacao`/gerencial/igrejas/rh: current item gives 1.49-2.16:1 (`current-foreground` = `primary-hover`) |
| `UX-dropdown-menu-1` | nph-dropdown-menu | Checked single-choice item illegible in dark + educacao (1.46:1) |
| `UX-dropdown-menu-2` | nph-dropdown-menu | Item focus ring 2.57:1 in dark + educacao |
| `UX-sidebar-item-3` | nph-sidebar-item | Open group and active subitem share the same color/weight |

### A-02. Width policy for controls with a fixed width

**What the audit found.** `input`, `textarea`, `select` and `combobox` use `layout/input-width` (280 px), `nph-field` uses `layout/field-width` (320 px), `multi-combobox` 420 px, `slider` 280 px, `input-otp` 256 or 304 px, `image size="media"` 256 px and `empty` 280 px. `nph-field` and `nph-empty` already cap at `max-inline-size: 100%` (`nph-field.css:22`, `nph-empty.css:32`), so they shrink without overflowing and their rows are about filling or centering in a larger container. The other controls have no cap, so each overflows a narrow container, and the sheets say the consumer decides. The `nph-field` sheet records that the field may stretch to its container (D6).

**To decide or adjust in Figma.** Should every fixed width become `min(token, 100%)` as one library rule? Does `nph-field` get a fluid mode or only a documented token override? For `slider` with `inputs`, `steppers` and `limits`, what minimum width keeps a four-digit value readable? Should `badge` and `button` truncate with an ellipsis or wrap when the text is longer than the container, and should `checkbox` break long words as `radio` and `switch` already do?

| Source row | Piece | Finding |
|---|---|---|
| `P2#2` | slider, image, progress, separator, table, notification | Fixed widths and heights (slider 280 px, image media 256 px, sticky header 296 px) and a weak time bar. |
| `UX-tela-cadastro-4` | nph-field | Field has fixed width 320 px, does not fill the column |
| `UX-input-1` | nph-input / textarea / select / combobox / input-otp | Fixed width 280 px, no `max-width`: does not shrink outside field |
| `UX-textarea-1` | nph-textarea | Fixed width 280 px as in the input |
| `UX-combobox-1` | nph-combobox | 24 px clear button and fixed 280 px width |
| `UX-multi-combobox-1` | nph-multi-combobox | Fixed width 420 px, no 100% cap: overflows containers |
| `UX-slider-3` | nph-slider | `inputs`+`steppers`+`limits` at default 280 px: numeric field 9 px wide |
| `UX-input-otp-2` | nph-input-otp | Cell width does not shrink (large = 304 px) |
| `UX-image-2` | nph-image | `size=media` fixed at 256 px: ignores container, overflows narrow ones |
| `UX-empty-1` | nph-empty | Host fixed at 280 px and left-aligned: off-center in a larger container |
| `UX-badge-1` | nph-badge | Long text neither truncates nor wraps; spills out of container |
| `UX-button-2` | nph-button | Long text never wraps or truncates, overflows 375 |
| `UX-checkbox-1` | nph-checkbox | Long word without space overflows row and page (radio/switch do not) |
| `VAL4-empty-vis-1` | empty | Fixed host width of 280 px (layout/input-width) |
| `VAL4-slider-vis-3` | slider | Vertical sliders with/without text/limits have misaligned tops |

### A-03. Bars that neither wrap nor collapse on narrow screens

**What the audit found.** `nph-toolbar` (`page` and `bulk`), `nph-toggle-group`, `nph-pagination` (`numbered`, `edges`, `table`), the `wide` footer of `nph-data-table`, `nph-breadcrumb` and `nph-dialog` with three actions are `nowrap` and overflow at 343 px. `D-5` of DSA-55 (toolbar) and `D-1` of DSA-58 (data-table footer) are already open for Indiane; the audit adds the other pieces.

**To decide or adjust in Figma.** What is the narrow-screen pattern: wrap, overflow to a "More" menu, icon-only actions, or horizontal scroll with a cue? Please answer once for the family (D-5 and D-1 are the same question). For `breadcrumb`, may the last two levels truncate with an ellipsis and a tooltip? For `dialog`, may three or more actions stack automatically below `md`? Which breakpoints?

| Source row | Piece | Finding |
|---|---|---|
| `UX-tela-listagem-1` | nph-toolbar / nph-input | 375: page overflows (toolbar does not shrink; 280 px search) and toast leaves screen |
| `UX-tela-listagem-4` | nph-toolbar (bulk bar) / nph-button | Batch bar `Excluir` overshoots bar by 13 px at 375 |
| `UX-toolbar-1` | nph-toolbar (+ nph-input) | 375: `page`/`bulk` bars spill outside own border |
| `UX-toggle-group-1` | nph-toggle-group | Group neither wraps nor scrolls: 3 labels overflow 375 |
| `UX-pagination-1` | nph-pagination | `numbered`, `edges` and `table` bars (541/502/502 px) overflow 343 px at 375 and cut Next/Last |
| `UX-data-table-1` | nph-data-table | At 375 the toolbar (280 px search + buttons) and the bulk bar do not fit; page scrolls sideways |
| `UX-data-table-2` | nph-data-table | `pagination-layout="wide"` footer is 502 px in a 343 px space and spills left, losing controls |
| `UX-breadcrumb-1` | nph-breadcrumb | Trail overflows at 375 and 768 even with `collapsed` (`flex:none; nowrap`, no label truncation) |
| `UX-dialog-3` | nph-dialog | `inline` with 3 actions or long labels wraps raggedly |
| `VAL4-toolbar-gap-3` | toolbar | Pending D-5 (narrow bar) still open: bar does not wrap or collapse |
| `VAL4-data-table-vis-2` | data-table | `pagination-layout` does not adapt by itself at 850/420 px (pending D-1) |

### A-04. Tables on narrow screens and cell policy

**What the audit found.** At 375 px the actions column and trailing columns fall past the fold with no scroll cue, no sticky column and no wrapping. `size="large"` does not enlarge row controls. `sticky-header` fixes the body at 18.5 rem. Column widths change between loaded, loading and next page. A 1 px seam remains in the horizontal border (DSA-49 fixed only the cell background seam). The category row is still `D1` of DSA-49.

**To decide or adjust in Figma.** For narrow screens: a scroll cue and sticky actions column, or stacked cards? May a column opt in to wrapping, and may `width` apply to any column type? Should `table/body-max-height` default to a viewport unit? Is a 1 px seam at high pixel density acceptable, or should the header divider be redrawn?

| Source row | Piece | Finding |
|---|---|---|
| `UX-tela-listagem-2` | nph-data-table | 768: row-actions column cut off, no fixed actions column |
| `UX-tela-listagem-3` | nph-table | `sticky-header` fixes body at 296 px even with free space |
| `UX-table-1` | nph-table | At 375 the actions column and trailing columns fall past the fold with no scroll cue or sticky column |
| `UX-table-2` | nph-table | Cell text never wraps (`white-space:nowrap`); `width` only applies to `truncated` |
| `UX-table-3` | nph-table | `size="large"` does not enlarge touch targets of row controls (still 28/36 px) |
| `UX-table-4` | nph-table | 1 px seam in the horizontal border line at each column junction (`border-collapse:separate`, border per cell) |
| `UX-data-table-3` | nph-data-table | At 375 the Value, switch and ⋮ columns fall outside the visible area |
| `UX-data-table-4` | nph-data-table | Column widths oscillate between loaded, loading and next page (`table-layout:auto`; `width` only for `truncated`) |
| `UX-data-table-5` | nph-data-table | Different focus rings in the same table; weak halo on the switch when on |
| `UX-data-table-6` | nph-data-table | Small targets (checkbox 24, switch 40x24, ⋮ 36; `large` unchanged) and 3 Tab stops per row |
| `VAL4-table-gap-4` | table | Category (grouping) is still a pending decision (D1) |

### A-05. Narrow top navigation and the clamp margin

**What the audit found.** `nph-navigation-menu` leaves `narrow` to the consumer, so a wide bar overflows; a wide panel squeezes its groups; the narrow panel and the dropdown panel sit flush at 0 px from the screen edge (the tooltip clamp does the same). Related open items: `D-1` of DSA-62 (how the trigger shows in the narrow list).

**To decide or adjust in Figma.** Does the piece measure itself (auto `narrow`) or does the consumer keep the choice? Should panels stack groups when the combined width does not fit? What safety margin does every floating panel keep from the viewport edge (one token for tooltip, dropdown and navigation panels)?

**Touches work in progress:** dropdown-menu, navigation-menu.

| Source row | Piece | Finding |
|---|---|---|
| `UX-tela-navegacao-superior-1` | nph-navigation-menu | Open narrow menu flush to screen edge, far from trigger |
| `UX-navigation-menu-2` | nph-navigation-menu | Wide bar without fallback: items reach 466 px in 343 px and the page scrolls (`narrow` is the consumer's choice) |
| `UX-navigation-menu-3` | nph-navigation-menu | Wide panel on a narrow screen: 3 groups squeezed to ~125 px columns with cut titles |
| `UX-navigation-menu-4` | nph-navigation-menu | Narrow panel flush to the edge (clamp without margin) and trigger label styled like the group's |
| `UX-dropdown-menu-3` | nph-dropdown-menu | Panel touches screen edges at 0 px |
| `UX-tooltip-2` | nph-tooltip | Clamp pins the bubble flush at x=0 (no margin) and without an arrow |

### A-06. Toast width and stack on phones

**What the audit found.** The 360 px toast does not fit 375 px in the `fixed` region the sheet recommends; a stack of three takes about 34% of the phone height; three toasts that never close block a fourth forever; the region is still `D-1` of DSA-63; the time bar is a static block; warning and error surfaces are almost equal in light.

**To decide or adjust in Figma.** Should the toast be `viewport - 2 margins` on narrow screens? What is the maximum stack in compact? What happens when three persistent toasts fill the queue? Does the region become a piece (D-1)? Is the static time bar acceptable until `nph-progress` is wired in? Do `warning` and `error` need a stronger difference in light?

| Source row | Piece | Finding |
|---|---|---|
| `UX-notification-1` | nph-notification | 360 px toast in the recipe region (`inset-inline-end` only) is cut off at 375/360/320 |
| `UX-notification-2` | nph-notification | Time-bar is a static gray `nph-skeleton` block, not a countdown |
| `UX-notification-3` | nph-notification | A stack of 3 toasts takes ~34% of a phone's height |
| `VAL4-notification-dx-3` | notification | All toast logic (queue, limit of 3, removal, timers) becomes an app service; nothing in the package helps |
| `VAL4-notification-vis-1` | notification | Stuck queue: 3 toasts that never self-close (error/action/duration=0) block a 4th forever; no guidance |
| `VAL4-notification-vis-3` | notification | Warning and error surfaces are almost equal in light (rgb(253,238,231) × rgb(252,233,233)); only icon/title differ |
| `VAL4-notification-gap-1` | notification | Toast region becoming its own piece is a pending decision (D-1) |
| `VAL4-notification-gap-2` | notification | No guide for the stuck-queue case, nor for repeating/grouping identical toasts |

### A-07. Touch targets and the `large` size

**What the audit found.** Many targets are 24 to 36 px: checkbox, radio and switch rows (24 px, 28 px pitch), clear buttons (24 px), icon-only buttons (28 or 36 px), select and combobox options (36 px), table and data-table row controls, pagination items (36 px), dialog close (28 px), breadcrumb links (20 px), navigation-menu items (36 px) and the dropdown rows (36 or 28 px, no `large`). The sheets say "use `large` on touch" and cite the 24 px minimum (WCAG 2.5.8).

**To decide or adjust in Figma.** Is the rule "`large` is the touch size, documented per piece", or should `pointer: coarse` raise every target to 44 px (or add an invisible hit area) without changing the drawing? Does the dropdown get a `large` size? Should the checkbox group gap in `nph-field` grow on touch? The sidebar item "more actions" button is `display: none` on `hover: none`: show it on touch?

**Touches work in progress:** dropdown-menu, navigation-menu.

| Source row | Piece | Finding |
|---|---|---|
| `UX-tela-cadastro-6` | nph-checkbox / nph-radio / nph-switch | 24 px targets on radio, checkbox and switch (28 px pitch) |
| `UX-checkbox-2` | nph-checkbox / nph-radio / nph-switch | 24 px targets and group with 4 px gap between options |
| `UX-button-3` | nph-button | No adaptive size for touch: icon-only 28/36 px unless `size=large` |
| `UX-input-2` | nph-input / nph-combobox | Clear button target 24x24 at any size |
| `UX-select-1` | nph-select / nph-option | `size=large` guarantees 44 px only on trigger; options stay 36 px |
| `UX-combobox-2` | nph-combobox / nph-option | Options 36 px on touch; `large` does not enlarge the list |
| `UX-pagination-2` | nph-pagination | 36x36 px touch targets (token `pagination/item-size`) |
| `UX-dialog-2` | nph-dialog | Close button 28x28 and footer buttons 36 px tall |
| `UX-breadcrumb-2` | nph-breadcrumb | Links are 20 px tall (line-height); `…` is 24x24 |
| `UX-navigation-menu-5` | nph-navigation-menu | 36 px touch targets for bar items, hamburger and panel links |
| `UX-dropdown-menu-4` | nph-dropdown-menu | 36/28 px rows on touch, no `large` size |
| `UX-sidebar-item-2` | nph-sidebar-item | "More actions" (⋮) is `display:none` on `hover:none`: no touch path to item actions |
| `VAL4-sidebar-item-gap-3` | sidebar-item | More-actions button does not appear on touch; no way to get the same shortcut on touch |

### A-08. Help that never opens on touch

**What the audit found.** The `info` icon of `nph-label` and `nph-field` opens a tooltip on hover and keyboard focus, never on touch. The sheets record this as the decision (`nph-label` and `nph-tooltip`).

**To decide or adjust in Figma.** Does a tap open the balloon, or does the icon disappear on `pointer: coarse` and `info` becomes `help` text? (The sheets already say `info` must never be the only place for the information.)

| Source row | Piece | Finding |
|---|---|---|
| `UX-field-1` | nph-field / nph-label / nph-tooltip | Info "i" icon in label does nothing on touch |

### A-09. Focus ring contrast

**What the audit found.** The `solid` button focus is a 4 px halo in the fill color (1.26 to 2.3:1); the light-mode halo on checkbox, radio, switch and slider is 1.26:1; the data-table mixes two focus rings and a weak one on the switch. `fichas/nph-button.md` already records the dark-mode limit as an open item.

**To decide or adjust in Figma.** What is the minimum ring contrast and which token carries it (`focus/border`, `focus/halo`) for `solid` actions and for the light-mode halo? Should the data-table unify the ring across its pieces?

| Source row | Piece | Finding |
|---|---|---|
| `UX-button-1` | nph-button | Focus on `solid` is a weak 4 px halo (focus border = fill) |
| `UX-checkbox-3` | nph-checkbox / nph-radio / nph-switch / nph-slider | Weak focus ring in light (halo 1.26:1) |

### A-10. Off state, on state and containers of the toggle family

**What the audit found.** `nph-togglebutton` off has no border or background and an `xmark` icon that reads as "remove"; icon-only is 50 by 28 px (documented as never square); the on state without an icon is distinguished by 1.26:1; `nph-toggle-group` draws no container or visible label.

**To decide or adjust in Figma.** Does the off state need a minimum outline or a neutral icon? Should the icon-only toggle be square like the button? Is a segmented container (appearance) wanted for the group? What contrast is accepted for the on state without an icon, and for the pressed toggle on the rail in dark?

| Source row | Piece | Finding |
|---|---|---|
| `UX-togglebutton-1` | nph-togglebutton | Off state has no outline and `xmark` icon: looks like a label / remove |
| `UX-togglebutton-2` | nph-togglebutton | Icon-only is not square (50x28 / 54x36 / 58x44) |
| `UX-togglebutton-3` | nph-togglebutton | On state with `icon-start=none` shown only by 1.26:1 background |
| `UX-toggle-group-2` | nph-toggle-group | No container or visible label: reads as loose buttons |
| `VAL4-togglebutton-vis-2` | togglebutton | Off state has no border/background (looks like text); B/I icon-only off icons near the contrast limit in dark (not measured) |
| `VAL4-sidebar-rail-button-vis-3` | sidebar-rail-button | nph-togglebutton `Menu recolhido` (pressed) in dark has low contrast (gray text on grayish blue) |

### A-11. Contrast and motion of passive states

**What the audit found.** Skeleton is 1.16:1 (light) and 1.48:1 (dark) and still; pending `progress` steps have the same contrast; the dark tooltip has no visible shadow; the `radio` invalid border is subtle in dark; the slider `invalid` shows only on the thumb border; the spinner glyph under reduced motion looks like an empty circle; the selected chip "X" looks like remove.

**To decide or adjust in Figma.** For each passive state, what contrast and motion are accepted? Which token changes (`skeleton` color, pending segment, tooltip elevation in dark, invalid fill for the slider)? Does reduced motion get a different glyph or an opacity pulse for the spinner? What marks a selected chip (a check instead of the X)?

| Source row | Piece | Finding |
|---|---|---|
| `UX-skeleton-2` | nph-skeleton | Placeholder is 1.16:1 (light) / 1.48:1 (dark) and still, so loading depends on the container |
| `UX-progress-2` | nph-progress | Pending `steps` segments have 1.16:1 / 1.48:1; without `value-text` the remaining steps cannot be counted |
| `UX-spinner-1` | nph-spinner | Thin `circle-notch` ring becomes a static near-empty circle under reduced motion |
| `UX-slider-4` | nph-slider | `invalid` shows only as 1 px red border on thumb |
| `UX-chip-1` | nph-chip | Selectable/removable/readonly chips look alike; selected "X" looks like remove |
| `VAL4-tooltip-vis-2` | tooltip | Dark: bubble rgb(69,69,69), shadow transparent, bubble stands out little from the background |
| `VAL4-radio-vis-1` | radio | `invalid` state of an option is quite subtle in dark |

### A-12. Sidebar family: scope, details and open decisions

**What the audit found.** `nph-sidebar` does not exist, so the panel, the sub-item indent and line, the item to rail swap, the collapsed group flyout and the arrow-key model belong to the consumer; `--nph-sidebar-panel-spacing` (24 px) does not fit a 40 px rail in 64 px. The counter on the rail covers the icon (`D-1` of DSA-53, already open), a zero counter shows `0`, the hover is almost invisible, the group line is 1.12:1, the active sub-item differs only by color and weight, and what the sub-item `options` list opens is `D-4` of DSA-53.

**To decide or adjust in Figma.** Is `nph-sidebar` in the 5.0 scope? If not, who owns the composition recipe? Please answer the already open D-1 and D-4 of DSA-53, and: does a zero counter hide the pill? Does an active sub-item get an indicator or a soft background? Should an automatic tooltip appear when a sidebar label is cut (today the tooltip is opt-in)? Which minimum contrast for the group line?

| Source row | Piece | Finding |
|---|---|---|
| `P1#11` | sidebar-* | Cost of the missing `nph-sidebar`; `--nph-sidebar-panel-spacing` does not fit the 40 px rail. |
| `UX-tela-painel-1` | (app) / nph-sidebar / nph-breadcrumb | 375: 280 px side panel leaves 61 px; breadcrumb does not shrink; no nph-sidebar |
| `UX-tela-painel-3` | nph-sidebar-item / nph-sidebar-subitem | Sub-items without indentation; group has no flyout in rail |
| `UX-sidebar-item-4` | nph-sidebar-item | Hover almost invisible (1.12:1) and the counter jumps 40 px when actions appear |
| `UX-sidebar-item-5` | nph-sidebar-item | Truncated label has no automatic tooltip (only when the consumer passes `tooltip`) |
| `UX-sidebar-rail-button-1` | nph-sidebar-rail-button | Counter pill covers 33-50% of the 20 px icon (placed inside the corner) |
| `UX-sidebar-subitem-2` | nph-sidebar-subitem | Active subitem differs from rest only by color and 400-vs-500 weight |
| `UX-sidebar-subitem-3` | nph-sidebar-subitem | Group vertical line is 1.12:1 and indentation does not exist in the component (`nph-sidebar` does not exist) |
| `VAL4-sidebar-item-gap-4` | sidebar-item | `counter` 0 shows `0`; sheet does not say whether zero should hide the pill |
| `VAL4-sidebar-rail-button-gap-2` | sidebar-rail-button | `counter` 0 shows `0` (does not hide) |
| `VAL4-sidebar-rail-button-vis-2` | sidebar-rail-button | Rail balloon opens above and covers the neighboring button's counter |
| `VAL4-sidebar-subitem-gap-2` | sidebar-subitem | Does not say what happens with `options` (no associated list) nor how the consumer opens that list |

### A-13. Pieces that sheets recommend but do not exist

**What the audit found.** `nph-alert-dialog` (the dialog sheet sends destructive confirmation to it) and `nph-panel-menu` (the sidebar-item sheet) are not in the package.

**To decide or adjust in Figma.** Are both in scope? If not, may the sheets drop the recommendation (a text change that becomes a documentation task once you decide)?

| Source row | Piece | Finding |
|---|---|---|
| `P2#6` | dialog, sidebar-item | `nph-alert-dialog` and `nph-panel-menu` are recommended by sheets but do not exist. |

### A-14. Contract questions on single pieces

**What the audit found.** These behaviors are recorded in the sheets as decisions or as "do not create without a decision", so changing them is a contract change: `nph-switch` as a form-associated control (`name`, reset, `FormData`); `required` and `aria-required` on checkbox and radio; `disabled` on `nph-toggle-group`; an `error` event or initials on `nph-avatar`; a `max` on `nph-avatar-stack`; the spinner role (`img` versus `status`); a digits-only mode (`inputmode`) on `nph-input-otp`; the Tab order of `nph-multi-combobox` (one stop per remove button); and the order of `nph-dialog actions="stacked"` (primary on top, reverse Tab order).

**To decide or adjust in Figma.** For each: keep as documented, or change? If changed, please register the decision so the sheet and the code move together.

| Source row | Piece | Finding |
|---|---|---|
| `P1#12` | switch | `nph-switch` does not take part in `<form>` (no `name`, no reset). |
| `VAL4-checkbox-gap-3` | checkbox | `required` does not exist on the checkbox; Validators.requiredTrue gives no aria-required on the control |
| `VAL4-avatar-dx-1` | avatar | No event when the photo fails (no (error)); no initials |
| `VAL4-avatar-gap-1` | avatar | No recipe for reacting to a broken photo; app cannot tell 'loading' from 'failed' |
| `VAL4-avatar-stack-gap-1` | avatar-stack | No limit of 5 enforced (6 renders the same) nor a `max` prop; count is the consumer's |
| `VAL4-spinner-vis-2` | spinner | `label` becomes role=img, semantically weak for 'loading' (status/progressbar) |
| `VAL4-spinner-gap-1` | spinner | Does not say whether the spinner with label should have role=status / live region |
| `UX-input-otp-1` | nph-input-otp | Phone keyboard always alphabetic (`inputmode="text"`) |
| `UX-multi-combobox-3` | nph-multi-combobox | One Tab per remove button before reaching the text |
| `UX-dialog-1` | nph-dialog | `actions="stacked"`: visual order (primary on top) is the reverse of DOM/Tab order |

### A-15. Illustrations and assets

**What the audit found.** `nph-image` in error and empty is the same gray frame while the illustrations are pending; the two `nph-empty` PNGs are 2048 px (about 390 KB each) for a 120 by 87 px drawing, and the sheet says 120 by 87.

**To decide or adjust in Figma.** When do the image states get their illustration or provisional icon? Can the empty assets be re-exported at 2x or 3x of the real size?

| Source row | Piece | Finding |
|---|---|---|
| `UX-image-1` | nph-image | Error and empty are the same gray frame, no icon/text/action |
| `VAL4-image-vis-3` | image | Empty and error states are an identical gray frame (illustration pending) |
| `UX-empty-2` | nph-empty | Two 2048 px PNGs (~390 KB each) for a 120x87 illustration, both always loaded |

### A-16. Spacing, alignment and text policy of single pieces

**What the audit found.** The `nph-field` message line grows by 4 px from help to error and the counter drops a line; the label row grows by 4 px when `info` is present and throws side-by-side fields out of line; the `info` icon centers on the whole multiline label; the tooltip text over two lines overflows the bubble; the select list shows exactly 8 whole options (no scroll cue); a long option is cut with an ellipsis and no title; the native input text is 14 px in every size (iOS zooms on focus); two adjacent `nph-kbd` sit glued together.

**To decide or adjust in Figma.** For each: reserve height or accept the jump? Align the `info` icon to the first line? What is the tooltip limit (grow, scroll or only warn)? Seven and a half options as a scroll cue? A `title` or tooltip on a cut option? A 16 px input font in `large` or on touch? Does a key combination get a standard gap?

| Source row | Piece | Finding |
|---|---|---|
| `UX-field-2` | nph-tooltip (via nph-field) | Info balloon cuts text above ~2 lines (`max-block-size:44px`, overflow visible) |
| `UX-field-3` | nph-field | Help to error height jump (+4 px) and counter drops to another line |
| `UX-field-4` | nph-field / nph-label | Label line grows 4 px when info button present: throws side-by-side fields out of line |
| `UX-label-1` | nph-label | "i" icon centered on multiline label height instead of first line |
| `UX-select-2` | nph-select | List of 30 items shows exactly 8 whole options, no scroll hint |
| `UX-option-1` | nph-option / nph-select | Long option text cut with ellipsis, no title or wrapping |
| `UX-input-3` | nph-input / textarea / combobox / input-otp | 14 px font on native input, also at `size=large` (iOS zoom) |
| `VAL4-kbd-vis-2` | kbd | Two adjacent nph-kbd without a gap sit glued together |

## 3. Group B: code here, no Figma dependency

33 rows in 19 batches, grouped by piece so each can become one Jira task. For every batch: the piece, the probable file, the proposed fix, the acceptance criterion and the risk. Every proposal is the validator's or this triage's, awaiting Elvys; none of the new events or properties exists yet, and each needs its sheet and metadata in the same change.

Batches that touch `nph-dropdown-menu`, `nph-icon` or `nph-hover-card` (in progress): **B-01 (if done per file), B-02, B-03, B-04 (indirect), B-17, B-18 (JSDoc)**. `nph-navigation-menu` (DSA-62) is touched by B-01, B-03 and B-18.

| Batch | Piece | Rows | Touches work in progress |
|---|---|---|---|
| B-01 | Dev diagnostics survive the library build (cross-cutting) | `P0#2`, `E5`, `P0#5` | If done per file, it touches `nph-dropdown-menu`, `nph-icon` and `nph-navigation-menu` (in progress). Prefer the build-level change, or wait for DSA-69, DSA-68 and DSA-62. Include `nph-hover-card` when PR #157 merges. |
| B-02 | `for` and `htmlFor` on `nph-tooltip`, `nph-dropdown-menu` and `nph-label` | `P0#3` | `nph-dropdown-menu` is in progress (DSA-69): coordinate or wait. |
| B-03 | Open-state events and `open` set from code | `P1#6`, `P2#5` | Touches `nph-dropdown-menu` (DSA-69) and `nph-navigation-menu` (DSA-62, plus PR #158). Do after both merge. |
| B-04 | `nph-button`: form participation and ARIA forwarding | `P1#8`, `UX-dropdown-menu-5` | Indirect: `nph-dropdown-menu` writes the ARIA state on its `nph-button` trigger. |
| B-05 | `nph-toggle-group`: coerce `value` | `P1#10` | no |
| B-06 | `nph-chip`: `readOnly` alias | `P1#7` | no |
| B-07 | `nph-image`: status change event | `P1#9` | no |
| B-08 | `nph-table` and `nph-data-table`: the Lit change-in-update warning (and one open decision on `rows`) | `P1#9`, `VAL4-table-vis-1`, `VAL4-data-table-vis-3` | Indirect: the row actions open `nph-dropdown-menu`. |
| B-09 | `nph-slider`: initial focus and touch scrolling | `UX-slider-1`, `UX-slider-2` | no |
| B-10 | `nph-field` and `nph-label`: error live region and empty label | `UX-field-5`, `UX-tela-cadastro-2`, `UX-tela-cadastro-5` | no |
| B-11 | `nph-pagination` and `nph-input`: announce the page and a numeric go-to-page field | `UX-pagination-4`, `UX-pagination-3` | no |
| B-12 | `nph-input-otp`: block `insertText` with separators | `P2#3` | no |
| B-13 | `nph-multi-combobox`: full text of a cut chip | `UX-multi-combobox-2` | no |
| B-14 | New dev warnings: `nph-tooltip` and `nph-skeleton` | `UX-tooltip-1`, `UX-skeleton-1` | Depends on B-01: without it the warning is dead code in the build. |
| B-15 | `nph-sidebar-rail-button`: tooltip side | `UX-sidebar-rail-button-3` | no |
| B-16 | `nph-notification`: event typing | `VAL4-notification-dx-1` | no |
| B-17 | `nph-icon`: exported names and ESM icon imports | `VAL4-icon-dx-1`, `VAL4-icon-gap-2`, `E3` | Touches `nph-icon` (in progress). Wait for DSA-69, or restrict this batch to the type export. |
| B-18 | Package metadata and types | `E4`, `E6`, `P2#9` | The JSDoc edits touch component files, including `nph-dropdown-menu` and `nph-navigation-menu`: batch them last. |
| B-19 | Angular Forms integration: a value accessor | `P0#1` | no |

### B-01. Dev diagnostics survive the library build (cross-cutting)

- **Rows:** `P0#2`, `E5`, `P0#5`
- **Probable file:** `vite.config.lib.ts`, plus the `devError` helper that each component defines (41 files use `import.meta.env?.DEV`)
- **Proposed fix:** Vite replaces `import.meta.env.DEV` with `false` in the library build, so every dev `console.error` and `console.warn` becomes dead code and invalid input fails silently (`dist/nph-button/nph-button.js` has no log call). Replace the guard with one that survives the build and that a consumer can switch off, ideally as a build-level change and not 41 edits; keep the logs out of production by default only if the sheets say so. For P0 #5, keep `type="link"` without `href` as an error (the sheet already says "draws nothing and emits `console.error` in development"); an optional `href` with a click event is a new API and needs a decision.
- **Acceptance:** `npm run test:package` fails when the log strings disappear from `dist/`; a test mounts an invalid value in a built component and expects exactly one `console.error`; production behavior is stated in the sheets.
- **Risk:** High: touches every component if done per file, and changes console output for every consumer. Whether a published package logs by default is a decision for Elvys, not a Figma one. The `define` route was not tried in this triage.
- **Overlap:** If done per file, it touches `nph-dropdown-menu`, `nph-icon` and `nph-navigation-menu` (in progress). Prefer the build-level change, or wait for DSA-69, DSA-68 and DSA-62. Include `nph-hover-card` when PR #157 merges.

| Source row | Piece | Finding |
|---|---|---|
| `P0#2` | all pieces | The dev `console.error`/`console.warn` calls are gone from the published build; invalid input fails silently. |
| `E5` | all pieces | Dev `console.error`/`console.warn` removed from the build (same cause as P0 #2). |
| `P0#5` | sidebar-item, -subitem, -rail-button | A link without `href` does not render (height 0, silent). |

### B-02. `for` and `htmlFor` on `nph-tooltip`, `nph-dropdown-menu` and `nph-label`

- **Rows:** `P0#3`
- **Probable file:** `src/components/nph-tooltip/nph-tooltip.ts:161`, `nph-dropdown-menu.ts:223`, `nph-label.ts:90`
- **Proposed fix:** Each component declares `for` as a property. Add an `htmlFor` accessor that delegates to `for` (the name Angular binds), so `[for]` and `[htmlFor]` both work; keep the `for` attribute.
- **Acceptance:** In an Angular template, `[for]="id"` makes the tooltip, menu or label work; unit test sets `el.htmlFor`; the `for` attribute still reflects.
- **Risk:** Low. A public alias is new API: the three sheets and metadata change with it.
- **Overlap:** `nph-dropdown-menu` is in progress (DSA-69): coordinate or wait.

| Source row | Piece | Finding |
|---|---|---|
| `P0#3` | tooltip, dropdown-menu, label | `[for]="expr"` never reaches the component: Angular maps it to `htmlFor`. |

### B-03. Open-state events and `open` set from code

- **Rows:** `P1#6`, `P2#5`
- **Probable file:** `nph-dialog.ts`, `nph-dropdown-menu.ts`, `nph-tooltip.ts`, `nph-navigation-menu.ts`
- **Proposed fix:** Emit a state-reflecting event (proposed `nph-open-change` with `detail: { open }`) when the piece changes `open` by itself (Esc, outside click, focus, blur); `grep` finds no such event in `src/`. For the tooltip, the sheet and code already say an invalid `side` draws no balloon and reports an error (`nph-tooltip.ts:322-323`), so a fallback to `top` would break that contract and is a decision for Elvys; with the event, the invisible-but-open state at least stays in sync. The "second Esc arrives with `cancelable=false`" part belongs to the browser (`nph-dialog.ts:633`), so it needs a decision, not a fix.
- **Acceptance:** `[open]="s()" (nph-open-change)="s.set($event.detail.open)"` stays in sync through Esc and outside click on each of the four pieces, including a tooltip with an invalid `side`; unit tests per piece.
- **Risk:** Medium. New public event on four pieces: name and detail are Elvys's decision, then four sheets.
- **Overlap:** Touches `nph-dropdown-menu` (DSA-69) and `nph-navigation-menu` (DSA-62, plus PR #158). Do after both merge.

| Source row | Piece | Finding |
|---|---|---|
| `P1#6` | dialog, dropdown-menu, tooltip, navigation-menu | Controlled `open` drifts from Angular: the piece resets `open` and emits no change event. |
| `P2#5` | tooltip | `open=true` set from code closes by itself; an invalid `side` leaves it open and invisible. |

### B-04. `nph-button`: form participation and ARIA forwarding

- **Rows:** `P1#8`, `UX-dropdown-menu-5`
- **Probable file:** `src/components/nph-button/nph-button.ts` (the native button is `type="button"` at line 318)
- **Proposed fix:** Expose `type="submit" | "reset" | "button"` and make the button form-associated (`requestSubmit()` on click when `submit`). Forward `aria-expanded` and `aria-haspopup="menu"` from the host to the native button, as DSA-67 (commit `f0a1c46`) already does for `aria-haspopup="dialog"`.
- **Acceptance:** A click on `type="submit"` fires `submit` and `(ngSubmit)`; the native button exposes `aria-expanded` when the host has it, for both `dialog` and `menu`.
- **Risk:** Medium. `nph-button` just changed in DSA-67; the popover and dropdown tests share the ARIA path.
- **Overlap:** Indirect: `nph-dropdown-menu` writes the ARIA state on its `nph-button` trigger.

| Source row | Piece | Finding |
|---|---|---|
| `P1#8` | button | `nph-button` never submits a native `<form>`. |
| `UX-dropdown-menu-5` | nph-button (trigger do menu) | `aria-expanded`/`aria-haspopup=menu` stay on host, not on inner native button |

### B-05. `nph-toggle-group`: coerce `value`

- **Rows:** `P1#10`
- **Probable file:** `src/components/nph-toggle-group/nph-toggle-group.ts` (the `value` property has only an attribute converter; `this.value.filter` runs at line 307)
- **Proposed fix:** Coerce `null`, `undefined` and strings to `[]` or a token list in the property setter, and never throw in `updated()`.
- **Acceptance:** `el.value = null` and `el.value = ''` leave the group usable and unpressed; unit test for each input type.
- **Risk:** Low.

| Source row | Piece | Finding |
|---|---|---|
| `P1#10` | toggle-group | `value` with `null` or `''` throws `this.value.filter is not a function` in `updated()`. |

### B-06. `nph-chip`: `readOnly` alias

- **Rows:** `P1#7`
- **Probable file:** `src/components/nph-chip/nph-chip.ts:145` (`readonly` is the property; Angular `[readonly]` sets `readOnly`)
- **Proposed fix:** Expose a `readOnly` accessor that delegates to `readonly`. The editorial note in `validation.md` says only `nph-chip` has the proven failure, so do not add the alias elsewhere without a reproduction.
- **Acceptance:** `[readonly]="true"` on `nph-chip` in Angular renders the readonly chip; unit test.
- **Risk:** Low.

| Source row | Piece | Finding |
|---|---|---|
| `P1#7` | chip, toggle-group, checkbox, slider, radio | Property versus attribute binding: `[readonly]` breaks `nph-chip`; child `value`; `form.reset()` defaults. |

### B-07. `nph-image`: status change event

- **Rows:** `P1#9`
- **Probable file:** `src/components/nph-image/nph-image.ts:170`
- **Proposed fix:** Emit an event when `status` changes (proposed `nph-status-change`), so OnPush and zoneless consumers can read it. The `nph-combobox` part of P1 #9 is already documented in the sheet, and the table part is B-08.
- **Acceptance:** Setting `src` to empty or to a broken URL emits the event once with the new `status`.
- **Risk:** Medium: a new event, with a sheet update.

| Source row | Piece | Finding |
|---|---|---|
| `P1#9` | image, table, combobox | Internal state changes without telling Angular (`status`, `rows`, `options`). |

### B-08. `nph-table` and `nph-data-table`: the Lit change-in-update warning (and one open decision on `rows`)

- **Rows:** `P1#9`, `VAL4-table-vis-1`, `VAL4-data-table-vis-3`
- **Probable file:** `src/components/nph-table/nph-table.ts:579-622`
- **Proposed fix:** `updated()` calls `measure()`, which calls `requestUpdate()`: Lit warns in development ("scheduled an update after an update completed"). Move the measurement out of `updated()` or settle it without a second update. The `rows` part of P1 #9 already has the API the report asked for: the table emits `nph-row-toggle` with `{ row, open }` (`nph-table.ts:622-629`) and the sheet tells the consumer to reassign `rows` after it (`fichas/nph-table.md:354-356, 440-441`), so that recipe is group C. What stays open here is only a decision, with no code until it is made: whether the table should stop replacing `rows` itself when a row opens.
- **Acceptance:** No Lit dev warning when `/table` and `/data-table` load; the `rows` question is recorded as a decision first.
- **Risk:** Medium. Measuring after layout is easy to break.
- **Overlap:** Indirect: the row actions open `nph-dropdown-menu`.

| Source row | Piece | Finding |
|---|---|---|
| `P1#9` | image, table, combobox | Internal state changes without telling Angular (`status`, `rows`, `options`). |
| `VAL4-table-vis-1` | table | Lit dev warning on load: 'nph-table scheduled an update after an update completed' (measure() calls requestUpdate() in updated()) |
| `VAL4-data-table-vis-3` | data-table | The Lit dev warning from nph-table also appears here (inherited) |

### B-09. `nph-slider`: initial focus and touch scrolling

- **Rows:** `UX-slider-1`, `UX-slider-2`
- **Probable file:** `src/components/nph-slider/nph-slider.ts:873` (`?autofocus` on thumb 0) and `:633-650` (`onPointerDown`)
- **Proposed fix:** Remove `?autofocus` and focus the thumb from code when the label is clicked. On touch, apply the value on `pointerup` when the pointer did not move vertically, instead of at `pointerdown`. Both changes alter established behavior (a press on the track moves the value at `pointerdown`, and a label click reaches the thumb through `autofocus` and `delegatesFocus`), and the slider sheet is silent on them, so record a decision first and keep the mouse path as it is.
- **Acceptance:** After load `document.activeElement` is `BODY`; a vertical swipe over the track scrolls the page and fires no `input` or `change`; clicking the label still focuses the thumb.
- **Risk:** High for touch: pointer capture and `delegatesFocus` depend on the current behavior (commit `673ec17`).

| Source row | Piece | Finding |
|---|---|---|
| `UX-slider-1` | nph-slider | First slider on page steals focus and scrolls to it on load (`?autofocus` on thumb 0) |
| `UX-slider-2` | nph-slider | Scrolling the page with a finger over the track changes the value |

### B-10. `nph-field` and `nph-label`: error live region and empty label

- **Rows:** `UX-field-5`, `UX-tela-cadastro-2`, `UX-tela-cadastro-5`
- **Probable file:** `src/components/nph-field/nph-field.ts:468-479`, `src/components/nph-label/nph-label.ts:164`
- **Proposed fix:** Put `role="alert"` or `aria-live="polite"` on the error message span (it is announced today only through `aria-describedby`); do not render `<nph-label>` or an empty `<label>` when `text` is empty. Focus on the first invalid control and scrolling to the success notification stay with the consumer (group D).
- **Acceptance:** An error that appears while focus is elsewhere is announced once; a field without `label` emits no empty `<label>`; the development error stays.
- **Risk:** Medium: a duplicated announcement is possible next to `aria-describedby`; field tests and the gap spacing may move.

| Source row | Piece | Finding |
|---|---|---|
| `UX-field-5` | nph-field | Error message is not in a live region |
| `UX-tela-cadastro-2` | nph-field | Errors off screen, focus stays on submit; field error message has no live region |
| `UX-tela-cadastro-5` | nph-field / nph-label | Field without `label` renders empty `<label>` and nameless `role=group` |

### B-11. `nph-pagination` and `nph-input`: announce the page and a numeric go-to-page field

- **Rows:** `UX-pagination-4`, `UX-pagination-3`
- **Probable file:** `src/components/nph-pagination/nph-pagination.ts:365-383, 420-428`, `src/components/nph-input/nph-input.ts:512-520`
- **Proposed fix:** Add a live region on the position text, and a visually hidden "Page N" in `numbered`. For the go-to-page field, let `nph-input` pass `inputmode` and `enterkeyhint` to the native input; `nph-input.test.ts:1283` asserts today that `inputmode` is not a property, so that is a decision first. A confirm button and an invalid-input message would be group A.
- **Acceptance:** Changing page updates a live region once; on a phone the go-to-page field opens the numeric keyboard.
- **Risk:** Medium: a duplicated announcement if the consumer also announces; `nph-input` API change.

| Source row | Piece | Finding |
|---|---|---|
| `UX-pagination-4` | nph-pagination | Page change not announced: no live region and focus stays on the arrow; position text changes silently |
| `UX-pagination-3` | nph-pagination | "Go to page" field: text keyboard on phone (no `inputmode`/`enterkeyhint`), no confirm hint, invalid input silently discarded |

### B-12. `nph-input-otp`: block `insertText` with separators

- **Rows:** `P2#3`
- **Probable file:** `src/components/nph-input-otp/nph-input-otp.ts:409`
- **Proposed fix:** Clean the inserted text and keep what remains (cut at `length`), as the paste path already does, instead of cancelling the whole insertion. The sheet covers paste only (`fichas/nph-input-otp.md:159`).
- **Acceptance:** A block insertion through `beforeinput` with `inputType=insertText` of `"123 456"` fills six cells; unit test beside the paste tests.
- **Risk:** Low to medium.

| Source row | Piece | Finding |
|---|---|---|
| `P2#3` | input-otp | A block inserted through `beforeinput` `insertText` with a separator is rejected whole. |

### B-13. `nph-multi-combobox`: full text of a cut chip

- **Rows:** `UX-multi-combobox-2`
- **Probable file:** `src/components/nph-multi-combobox/nph-multi-combobox.ts:1175`
- **Proposed fix:** Give the cut chip label the full text through `title`, or reuse the `nph-tooltip` that `nph-chip` already uses. If a tooltip counts as a new visual, this becomes group A.
- **Acceptance:** A cut label shows its full text on hover and focus.
- **Risk:** Medium: detecting the cut.

| Source row | Piece | Finding |
|---|---|---|
| `UX-multi-combobox-2` | nph-multi-combobox | Truncated chip in field has no title or tooltip (nph-chip does) |

### B-14. New dev warnings: `nph-tooltip` and `nph-skeleton`

- **Rows:** `UX-tooltip-1`, `UX-skeleton-1`
- **Probable file:** `src/components/nph-tooltip/nph-tooltip.ts:957`, `src/components/nph-skeleton/nph-skeleton.ts:36-40`
- **Proposed fix:** Warn in development when the tooltip text is taller than `layout/max-tooltip-height`, and when `shape="block"` renders with zero height. Letting the balloon grow, or giving the skeleton a default height, is group A (`UX-field-2` in A-16 is the same tooltip root cause, split by what each row proposes).
- **Acceptance:** A three-line tooltip and a zero-height block each warn once in development; nothing in production.
- **Risk:** Medium for the skeleton (a late height gives a false positive: warn once).
- **Overlap:** Depends on B-01: without it the warning is dead code in the build.

| Source row | Piece | Finding |
|---|---|---|
| `UX-tooltip-1` | nph-tooltip | Text over two lines overflows the bubble (`overflow:visible`, fixed max-block-size), white on a light page |
| `UX-skeleton-1` | nph-skeleton | `shape="block"` without a consumer height measures 0 px and vanishes silently |

### B-15. `nph-sidebar-rail-button`: tooltip side

- **Rows:** `UX-sidebar-rail-button-3`
- **Probable file:** `src/components/nph-sidebar-rail-button/nph-sidebar-rail-button.ts:189`
- **Proposed fix:** Pass `side="right"` to the inner `nph-tooltip`; the sheet does not define a side and `nph-tooltip` calls the side behavior. The tooltip flip covers lack of space.
- **Acceptance:** The balloon opens to the right and covers no neighbor; position test.
- **Risk:** Low (right-to-left and a rail on the right edge rely on the flip).

| Source row | Piece | Finding |
|---|---|---|
| `UX-sidebar-rail-button-3` | nph-sidebar-rail-button | Tooltip opens above and covers the neighbor button (default `side=top`) |

### B-16. `nph-notification`: event typing

- **Rows:** `VAL4-notification-dx-1`
- **Probable file:** `src/components/nph-notification/nph-notification.ts:659-663`
- **Proposed fix:** Add `HTMLElementEventMap` entries so `$event` is typed for `nph-action`. `nph-close` is already declared by `nph-dialog.ts:712` with another `detail`, and `nph-popover.ts:59` uses the same name, so a plain redeclaration collides: use a union, type only `nph-action`, or document a cast.
- **Acceptance:** `(nph-action)="x = $event.detail..."` compiles under `strictTemplates` without a cast.
- **Risk:** Medium: a union type can break consumers that already type the dialog event.

| Source row | Piece | Finding |
|---|---|---|
| `VAL4-notification-dx-1` | notification | $event of nph-action/nph-close is a plain Event (cast needed): the component declares no HTMLElementEventMap entries |

### B-17. `nph-icon`: exported names and ESM icon imports

- **Rows:** `VAL4-icon-dx-1`, `VAL4-icon-gap-2`, `E3`
- **Probable file:** `src/components/nph-icon/nph-icon.ts` (exports only `NphIcon`), `nph-icon.icons.ts`, `package.json` `exports`
- **Proposed fix:** Expose `NphIconName`, `NphIconSize` and `NPH_ICON_NAMES` through an entry point so consumers can type `name`. For E3, import the Font Awesome icons from their ESM files, or publish the used paths as the package's own ESM module; the second option removes the Font Awesome runtime dependency and is an architecture decision (the peers are fixed by P21 and P75).
- **Acceptance:** An app can `import type { NphIconName } from '@iatec/nephos/nph-icon'`; `ng build` of the validation app shows none of the 202 CommonJS warnings.
- **Risk:** Medium to high for the ESM part (changes the peer contract).
- **Overlap:** Touches `nph-icon` (in progress). Wait for DSA-69, or restrict this batch to the type export.

| Source row | Piece | Finding |
|---|---|---|
| `VAL4-icon-dx-1` | icon | NphIconName/NphIconSize/NPH_ICON_NAMES live in nph-icon.icons.d.ts, which the package `exports` do not expose: consumers cannot import them to type a list of names |
| `VAL4-icon-gap-2` | icon | Sheet does not tell how the consumer gets the list of valid names (only the unexported d.ts) |
| `E3` | nph-icon | 202 build warnings: Font Awesome icon modules are CommonJS; no icon tree shaking. |

### B-18. Package metadata and types

- **Rows:** `E4`, `E6`, `P2#9`
- **Probable file:** `custom-elements-manifest.config.mjs`, component classes, `scripts/`
- **Proposed fix:** E4: resolve event constants to their literal names (`dist/custom-elements.json` still lists `NPH_*` constants and an event named `undefined`), declare `@slot` and `@csspart` in the JSDoc, filter `has*` members, and add `items` for `nph-navigation-menu`. E6: type the enum props with the exported unions where invalid input is not a supported runtime case. P2 #9: optionally generate editor metadata (web-types or custom data) from the manifest. Scripts change only by recorded decision.
- **Acceptance:** `npm run test:package` checks that every own event matches `/^nph-[a-z-]+$/` (native events such as `change` allowed) and that slots and parts are present.
- **Risk:** Low to medium. E6 conflicts with components that accept and warn on invalid strings.
- **Overlap:** The JSDoc edits touch component files, including `nph-dropdown-menu` and `nph-navigation-menu`: batch them last.

| Source row | Piece | Finding |
|---|---|---|
| `E4` | package manifest | `custom-elements.json`: 0 slots, 0 CSS parts, 8 events named by constant, `nph-image` event named `undefined`. |
| `E6` | all pieces | Several enum props are `string` in the class although the union types are exported. |
| `P2#9` | all pieces | `CUSTOM_ELEMENTS_SCHEMA` lets any property through; only `$event` is typed. |

### B-19. Angular Forms integration: a value accessor

- **Rows:** `P0#1`
- **Probable file:** new entry point or package (not decided); `docs/consuming.md` says today "no Vue, Angular or Blazor wrapper"
- **Proposed fix:** The validation app needed about 70 lines of tag-to-property mapping. The shape is a decision for Elvys: a `ControlValueAccessor` package or entry point, or a documented generic accessor (the recipe can be written now, see group C). Known gaps even with an accessor: `nph-toggle-group` has no `disabled` (group A, A-14) and the range slider has no natural form value.
- **Acceptance:** Decision recorded; then `formControlName` and `[(ngModel)]` work on every form control with `setDisabledState` and `null` coercion.
- **Risk:** High: new public surface and a promise the current docs deny.

| Source row | Piece | Finding |
|---|---|---|
| `P0#1` | Angular Forms | No `ControlValueAccessor` on the form controls: `NG01203` in dev, a `TypeError` in a production build. |

## 4. Group C: documentation that can be written now

44 rows. They need no Figma decision. Two targets: the Angular section of `docs/consuming.md` (the consumer side: value accessor recipe, router, attribute versus property) and the sheet of each piece. Sheets are English only (`fichas/`). `README.md`, `docs/tokens.md` and `docs/consuming.md` have `pt-BR` and `es` translations beside the English source (`docs/i18n.md`), so a change to the Angular guide also updates those two pairs (`npm run i18n:update`, `npm run test:i18n`).

### 4.1 Angular guide (`docs/consuming.md`, Angular section)

These recipes close many rows at once. The consuming doc has no text today on any of them (checked with `grep`).

- A generic `ControlValueAccessor` recipe (tag to property and event map, `null` to `[]` for the toggle group and multi-combobox, `{ start, end }` for the range slider, `setDisabledState`) and the limits that remain: toggle group `disabled` and the range slider value. The accessor must call its registered callback on `input` for `nph-input`, `nph-textarea` and `nph-input-otp`, which already hold the new value when `input` fires; calling it only on `change` made validation and `dirty` wait for blur or Enter in the validation app (`validation.md`, P0 #1), and that was the app accessor's choice, not a library limit. Until B-19 is decided, this is the only path (`P0#1`).
- `[attr.for]` for `nph-tooltip`, `nph-dropdown-menu` and `nph-label`, until B-02 lands (`P0#3`).
- The `href` interceptor and `current` or `active` from `router.url`, with the router link directive written on the consumer side (`P0#4`). The source also proposes a cancelable `nph-navigate` event on the pieces with `href`; that is a new API and a decision for Elvys, so `P0#4` stays in group C.
- `[attr.value]` on the children of `nph-toggle-group`, and the rule that a literal attribute sets the `form.reset()` default and a property binding does not (`P1#7`).
- The `(click)` plus `requestSubmit()` pattern for `nph-button` in a form, until B-04 lands (`P1#8`).
- The controlled `open` workaround and why `[open]` drifts (`P1#6`), and reassigning `items` and `options` immutably.
- The controlled rows pattern the table already supports: keep the key-to-open map in the app, derive `rows` with `computed()` and reassign it after `nph-row-toggle` (`{ row, open }`); `fichas/nph-table.md:354-356` says so (`P1#9`, table part).
- The attribute-to-property map: boolean attributes such as `required="false"` are true, `counter` and `chipIcon` need property bindings, `value-text` needs `[attr.value-text]`; typing `$event` needs `strictTemplates`.
- Fonts, the "Multiple versions of Lit" dev warning, the install token variable, and `angular.json` styles with the package specifier (`E2`, `P2#10`, `E7`, `E8`).

### 4.2 The rows

| Source row | Piece | Finding | Where to write it |
|---|---|---|---|
| `P0#4` | breadcrumb, sidebar-*, navigation-menu | `href` does not talk to the Angular Router: a full page reload without consumer code. | consuming.md, Angular: router interceptor for `href` (`composedPath()` plus `router.navigateByUrl`) and deriving `active` from `router.url` |
| `P2#4` | select, option | `<nph-option value="">` is born selected and hides the placeholder. | select and option sheets: an option with an empty `value` is a real choice (the sheet only says it leaves the piece `valueMissing`), so with `value` `''` it is selected and hides the placeholder; show "no choice" with no such option. Changing the behavior instead would be a decision for Elvys |
| `P2#7` | chip, data-table | Focus falls to `BODY` after removing a chip and after clearing the data-table filter. | consuming.md, Angular: move focus after `nph-remove` and after clearing a filter; chip sheet |
| `P2#10` | all pieces | "Multiple versions of Lit loaded" warning in `ng serve`. | consuming.md, Angular: the "Multiple versions of Lit" warning is a dev server artifact |
| `E2` | docs | Fonts do not ship in the package and the root `README.md` does not mention them. | root `README.md` and `consuming.md`: Fonts section (Noto Sans 400, 500, 600; IBM Plex Mono 400); today one sentence at `consuming.md:87` |
| `E7` | docs | First install needs an exported Font Awesome token variable; the failure message is cryptic. | consuming.md, install: show the exported token variable that `~/.npmrc` reads, and the `@undefined` resolution error |
| `E8` | docs | CSS specifiers work in `angular.json`; `consuming.md` shows the `node_modules` path (row is OK). | consuming.md:156-157 shows `node_modules/@iatec/nephos/dist/...`; the package specifier also works in `angular.json` |
| `UX-chip-2` | nph-chip | After removing chip by keyboard, focus goes to `body` | chip sheet and Angular guide: pattern to focus the next chip after `nph-remove` |
| `UX-separator-1` | nph-separator | Vertical separator with explicit height sticks to the top of an `align-items:center` row because the host forces `align-self: stretch` | separator sheet: with an explicit height inside an `align-items: center` row, give the host `align-self: center` (the stretch is the documented contract) |
| `UX-progress-1` | nph-progress | In a shrink-to-fit parent (`max-content`, `align-items:flex-start`) the bar collapses to its label width | progress sheet: in a shrink-to-fit parent give the parent a width (the CSS already has `inline-size: 100%` and `min-inline-size: 3rem`) |
| `VAL4-togglebutton-gap-1` | togglebutton | Sheet does not say how to compose with nph-field in Angular (error message stays outside the piece) | togglebutton sheet: the error text is written by the consumer outside the piece and `invalid` is set on the button. State the limit: `aria-describedby` on the host does not describe the native button in the shadow root (`nph-togglebutton.ts:239-247`), so the error is not tied to the control the keyboard and screen reader use. An association API would be a separate decision for Elvys, not part of this documentation task |
| `VAL4-toolbar-dx-3` | toolbar | (nph-remove) per chip in @for needs closure or detail.text; repeated texts make the bar-level handler ambiguous; sheet gives no guidance | sheet: listen to `nph-remove` on each chip with the item in a closure; the bar-level handler is only safe when the texts are unique |
| `VAL4-toolbar-gap-1` | toolbar | Sheet does not say how the bar reacts when children are added/removed later via @if/@for | sheet: one line saying that direct children added or removed later are observed (size and roving tabindex are applied again) |
| `VAL4-dropdown-menu-dx-4` | dropdown-menu | Menu swaps its own items after activation; consumer must reassign a new list to mirror `checked` (OnPush/signals) | Angular guide (optional): the `signal.update` recipe for reassigning `items` |
| `VAL4-field-dx-2` | field | `required`/`disabled` must be [prop] or a bare attribute; required="false" would be true | Angular guide and field sheet: a boolean attribute counts by presence (`required="false"` turns it on); use `[required]="false"` |
| `VAL4-field-dx-3` | field | Inside <fieldset disabled> the control's `.disabled` stays false (only invalid/description change) | field sheet: the host `disabled` property does not reflect `<fieldset disabled>`. Explain the fieldset rule on its own, including the exception for controls inside the first `<legend>`. `matches(':disabled')` answers it only for form-associated controls: `nph-field` and `nph-switch` are not, and the switch detects the fieldset itself and disables its inner button (`nph-switch.ts:93-113`) while its host still does not match `:disabled`. Do not recommend one selector for every piece |
| `VAL4-field-gap-3` | field | Sheet does not document the <fieldset disabled> interaction beyond 'disables the control' | same note as `VAL4-field-dx-3` |
| `VAL4-label-dx-2` | label | A child written by the consumer is NOT replaced by `text` (the consumer child stays before the rendered text) | label sheet: a child written between the tags is not supported and stays in the DOM before the rendered `<label>`; fix the code comment that says it is replaced |
| `VAL4-label-gap-2` | label | Sheet says the consumer's child would be replaced; in practice it stays in the DOM | same note as `VAL4-label-dx-2` |
| `VAL4-textarea-gap-1` | textarea | `readOnly` property vs `readonly` attribute not shown in an Angular example (both work) | Angular guide: short example with `[readOnly]="true"` and the `readonly` attribute |
| `VAL4-option-gap-2` | option | Sheet does not say what happens with marker=checkbox outside multi-combobox (works as single choice) | option sheet: say what the report saw, `marker=checkbox` inside `nph-select` is a single choice that draws a box (the inner checkbox is `inert`), and that an option never chooses itself: the list that owns it writes `selected`. Do not document a lone option as a choice control |
| `VAL4-multi-combobox-dx-1` | multi-combobox | `value` getter returns a new array on every read (m.value === m.value is false); reference comparisons never match | sheet: `value` returns a copy on every read, so compare by content |
| `VAL4-multi-combobox-dx-3` | multi-combobox | [counter]/[chipIcon] must be property bindings; counter="true" would be a string (boolean attrs) | Angular guide: short attribute-to-property table and the boolean-by-presence note (with `VAL4-field-dx-2`) |
| `VAL4-checkbox-gap-2` | checkbox | Nothing says how to obtain a group's value (no group API; FormArray/nph-field only give ARIA) | Angular guide: `FormArray` plus `nph-field` recipe (with the accessor recipe of `P0#1`) |
| `VAL4-radio-gap-1` | radio | No way to read the group value (no group element/event): listen to each radio or use a CVA | Angular guide: read the group through a shared `formControlName`, or `change` on each radio |
| `VAL4-slider-dx-2` | slider | No typed range event: read target.start/end with $any (a local SliderEl type was used) | Angular guide: range recipe that types the target with `import type { NphSlider }` (the class is exported) |
| `VAL4-slider-dx-4` | slider | `[start]="form.value"`: if the user drags and Angular reapplies the same value nothing changes; source of truth must be updated in (change) | Angular guide, range recipe: update the control on `(change)` before Angular reapplies the same value |
| `VAL4-slider-dx-5` | slider | Generic $event; no types for input/change nor for start/end | same note as `VAL4-slider-dx-2` |
| `VAL4-image-gap-4` | image | No Angular example for nph-image | Angular guide: `(load)` and `(error)` into a signal, and derive `empty` from `src` |
| `VAL4-kbd-gap-1` | kbd | Sheet does not define expected size/alignment next to text nor how to represent the '+' separator | kbd sheet: how to align next to text, and that a "+" separator is the consumer's convention |
| `VAL4-skeleton-gap-1` | skeleton | No recipe for a list/table skeleton (several `line` with different widths) | skeleton sheet: list example with lines of different widths |
| `VAL4-spinner-gap-2` | spinner | Does not guide the aria-busy pair on the container | spinner sheet: the container that waits carries `aria-busy`, as the skeleton sheet says |
| `VAL4-progress-dx-1` | progress | Hyphenated attribute needs [attr.value-text] (or valueText by property); numeric/array props untyped | Angular guide: attribute-to-property table (`value-text` to `valueText`, `total-items` to `totalItems`, `chip-icon` to `chipIcon`) |
| `VAL4-progress-gap-2` | progress | Does not say what to do with `value-text` when the type changes from indeterminate to determinate | progress sheet: when the type changes from indeterminate to determinate, rewrite `value-text` |
| `VAL4-empty-gap-1` | empty | Sheet cites the angular.json glob only indirectly; does not document base-href/subpath | empty sheet: point to the Angular guide (assets glob and the subpath limit of P84) |
| `VAL4-empty-gap-2` | empty | No example of use as a list's empty state | empty sheet or Angular guide: list empty-state example |
| `VAL4-table-dx-5` | table | On-demand loading: row needs `loading:true` but also a placeholder `detail` (with name and toggleLabel) for the chevron to exist | table sheet: document that a row which opens needs `detail.name` inside the `detail` object and `toggleLabel` on the row itself, next to `loading`; without either the whole row is left out |
| `VAL4-data-table-dx-4` | data-table | Dozens of text attributes (selected-text, page-label, …) must be passed on every use: no defaults, no one-place configuration | Angular guide: one shared labels object spread over the many text attributes (sheets keep P99 item 5: texts arrive localized) |
| `VAL4-data-table-gap-2` | data-table | Does not explain how the consumer handles selection when the filter changes (prune/keep) | data-table sheet: what the selection does when the filter changes and how `{count} of {total}` shows it |
| `VAL4-data-table-gap-3` | data-table | No Angular integration example (computed/trackBy) nor one for server pagination | Angular guide: `computed()` example for search, sort and page, and server pagination |
| `VAL4-pagination-dx-2` | pagination | Numeric props/arrays need [prop] ([totalItems], [pageSizes]); attribute also works via converter; mixing styles is confusing | same attribute-to-property table as `VAL4-progress-dx-1` |
| `VAL4-pagination-vis-1` | pagination | `page` above the count draws the last page but the consumer signal stays at 99; no correction event | pagination sheet and Angular guide: the element keeps the assigned `page` and clamps only the page it draws, so reading `el.page` back does not help; clamp the consumer state to the effective count, derived from `totalItems` and `pageSize` when given and from `pageCount` otherwise |
| `VAL4-pagination-gap-1` | pagination | Sheet does not say how to react when `page` is out of range | same note as `VAL4-pagination-vis-1` |
| `VAL4-navigation-menu-dx-4` | navigation-menu | `items` is attribute:false; reassigning the list in a computed() is mandatory (mutating does not update) | navigation-menu sheet: reassign `items` with a new list; mutating does not update |

## 5. Group D: outside the library, already documented, or to verify

75 rows. Nothing to write or fix here, except the rows marked "verify again", which need a fresh run in the validation app before anyone acts on them.

| Source row | Piece | Finding | Reason |
|---|---|---|---|
| `P2#8` | sidebar-* | Sheets and tokens diverge in token names. | Not reproduced: `--nph-sidebar-background` and `--nph-sidebar-panel-background` both exist; the sheets use the Figma path notation |
| `E9` | package | Peers and `exports` resolve with `moduleResolution: bundler` (row is OK). | Row is OK, no action |
| `E10` | package | Production build of 40 lazy routes is within the default budget (row is OK). | Row is OK, no action |
| `E11` | feed | The feed `latest` dist-tag points to `5.0.0-rc.1`. | Registry operation for Elvys (`npm dist-tag rm`), not code; `docs/release.md` already explains it and `consuming.md` already says to install with the exact version or `@rc` |
| `E13` | package | `tokens.css` and `scrollbar.css` are byte-identical to Phase A (row is OK). | Row is OK, no action |
| `UX-toolbar-2` | nph-toolbar / nph-tooltip | Icon-only actions have no visible name on touch (tooltip never opens) | Already documented in the sheet or by design |
| `UX-icon-1` | nph-icon | Host box is square but glyph has its own width and spills out | Already documented in the sheet or by design |
| `UX-tooltip-3` | nph-tooltip | Help hint on a 20x20 info icon is unreachable on touch | Consumer side, native behavior or validation app |
| `VAL4-button-dx-2` | button | `loading` bound from a signal only blocks clicks after the next zoneless CD; same-tick programmatic clicks reach the handler | Verify again (not tested or not reproduced in the report) |
| `VAL4-button-gap-2` | button | Sheet does not say async `loading` does not protect same-tick clicks | Consumer side, native behavior or validation app |
| `VAL4-togglebutton-dx-3` | togglebutton | Validation project does not enable strictTemplates, so $event typing only shows in consumers that enable it | Verify again (not tested or not reproduced in the report) |
| `VAL4-toggle-group-dx-4` | toggle-group | Value is string[] in ngModel/FormControl even in single selection | Already documented in the sheet or by design |
| `VAL4-toolbar-gap-4` | toolbar | Not tested: compact applied-filters bar, trigger focus when disabled, SSR | Verify again (not tested or not reproduced in the report) |
| `VAL4-dropdown-menu-dx-3` | dropdown-menu | Trigger id must live in the same root; inside a ShadowDom Angular component not tested | Already documented in the sheet or by design |
| `VAL4-dropdown-menu-gap-3` | dropdown-menu | Avatar with real URL and nested submenu not exercised | Verify again (not tested or not reproduced in the report) |
| `VAL4-dropdown-menu-gap-4` | dropdown-menu | Flip upward and window resize with menu open not tested | Verify again (not tested or not reproduced in the report) |
| `VAL4-field-gap-2` | field | Sheet does not say the second control of a field with two gets nothing | Already documented in the sheet or by design |
| `VAL4-label-gap-3` | label | Hover (motion/hover-delay) on the info tooltip not tested | Verify again (not tested or not reproduced in the report) |
| `VAL4-textarea-dx-2` | textarea | $event of (input) is InputEvent (detail===0): the app's shared EventLog printed detail=0 | Consumer side, native behavior or validation app |
| `VAL4-textarea-vis-2` | textarea | No visible label in grid examples makes each hard to identify in screenshots | Consumer side, native behavior or validation app |
| `VAL4-select-dx-1` | select | FormsModule puts novalidate on the form, so requestSubmit() passes with a required select empty | Consumer side, native behavior or validation app |
| `VAL4-select-gap-1` | select | Nothing about `required` + Angular's novalidate | Consumer side, native behavior or validation app |
| `VAL4-combobox-dx-3` | combobox | `query` read from the host stays "" after the choice; to mirror typing you must listen to nph-search | Already documented in the sheet or by design |
| `VAL4-combobox-vis-1` | combobox | nph-kbd is display:block: two kbd + text in the `shortcuts` slot stack until wrapped in inline-flex | Verify again (not tested or not reproduced in the report) |
| `VAL4-combobox-gap-3` | combobox | Without empty-heading nothing appears when there is no result (list does not open) | Already documented in the sheet or by design |
| `VAL4-multi-combobox-dx-2` | multi-combobox | Consumer accessor does `v ?? ''` in writeValue: not faithful to the string[] type (component tolerates it) | Consumer side, native behavior or validation app |
| `VAL4-multi-combobox-vis-1` | multi-combobox | Open list with size=large not measured | Verify again (not tested or not reproduced in the report) |
| `VAL4-multi-combobox-gap-1` | multi-combobox | Sheet does not say typed text is cleared on each check, nor where focus goes after removing a chip | Already documented in the sheet or by design |
| `VAL4-checkbox-dx-3` | checkbox | $event is a generic Event (needs $any($event.target).checked); the app's EventLog prints value="on" | Consumer side, native behavior or validation app |
| `VAL4-checkbox-dx-4` | checkbox | CVA updates via addEventListener outside the template: risk of stale view in zoneless/OnPush (not reproduced) | Consumer side, native behavior or validation app |
| `VAL4-checkbox-dx-5` | checkbox | form.disable() on a focused field fires a blur event and marks the control touched (recording only) | Consumer side, native behavior or validation app |
| `VAL4-radio-dx-2` | radio | Demo accessor adds an addEventListener('change') on every registerOnChange without removing it (potential leak) | Consumer side, native behavior or validation app |
| `VAL4-radio-dx-4` | radio | `$event.target.value` needs $any | Consumer side, native behavior or validation app |
| `VAL4-switch-dx-3` | switch | Generic $event ($any($event.target).checked) | Consumer side, native behavior or validation app |
| `VAL4-switch-vis-1` | switch | Color transition after switching theme/brand lasts >2.5 s (screenshot caught intermediate blue track) | Verify again (not tested or not reproduced in the report) |
| `VAL4-avatar-stack-dx-1` | avatar-stack | `label` is mandatory and localized; the consumer assembles the phrase; component neither computes it nor uses `count` | Already documented in the sheet or by design |
| `VAL4-badge-gap-1` | badge | Host has no role/aria-label; accessible name is only the text; no hint to tell states apart | Already documented in the sheet or by design |
| `VAL4-badge-gap-2` | badge | Empty badge disappears (intentional) but with async [text] the layout 'flickers'; no warning | Already documented in the sheet or by design |
| `VAL4-chip-vis-1` | chip | Theme transition is slow (~1–2 s); immediate screenshot shows intermediate colors | Consumer side, native behavior or validation app |
| `VAL4-image-dx-3` | image | load/error are plain Event (no detail); host `error` name collides with native <img>; worth documenting | Already documented in the sheet or by design |
| `VAL4-skeleton-dx-1` | skeleton | [attr.aria-busy]="bool" writes aria-busy="false" instead of removing it; lib gives no aria-busy help | Already documented in the sheet or by design |
| `VAL4-skeleton-gap-2` | skeleton | Sheet does not say whether the skeleton should announce 'loading' to the screen reader (aria-busy on parent only) | Already documented in the sheet or by design |
| `VAL4-spinner-dx-1` | spinner | nph-button's click block only holds after `loading` reaches the DOM; two fast real clicks both reached (click) | Verify again (not tested or not reproduced in the report) |
| `VAL4-spinner-vis-1` | spinner | No label and no text beside it: host aria-hidden, no warning; screen reader unaware of the wait | Already documented in the sheet or by design |
| `VAL4-spinner-vis-4` | spinner | Spin not tested with prefers-reduced-motion | Verify again (not tested or not reproduced in the report) |
| `VAL4-progress-dx-3` | progress | status/value updated in the wrong order (success before value=100) would render nothing for a frame | Verify again (not tested or not reproduced in the report) |
| `VAL4-progress-gap-3` | progress | No update-order rule for `status` and `value` | Verify again (not tested or not reproduced in the report) |
| `VAL4-tooltip-dx-4` | tooltip | `for` pointing at an nph-button host: aria-describedby stays on the host and the inner button gets none | Already documented in the sheet or by design |
| `VAL4-empty-dx-3` | empty | Nothing announces the state to the screen reader (sheet delegates to consumer; role=status wrapper used) | Already documented in the sheet or by design |
| `VAL4-table-dx-4` | table | `cells` is Record<string, NphTableCell>: nothing prevents a key not in `columns` (not tested) | Verify again (not tested or not reproduced in the report) |
| `VAL4-table-vis-4` | table | Dark/brands not verified on the standalone nph-table | Verify again (not tested or not reproduced in the report) |
| `VAL4-data-table-dx-3` | data-table | Component does not validate `selected` against `rows`: bulk bar can show `1 of 58` with no row checked | Already documented in the sheet or by design |
| `VAL4-data-table-dx-5` | data-table | The click right after closing the row ⋮ menu was swallowed (menu layer still covered the row) | Verify again (not tested or not reproduced in the report) |
| `VAL4-data-table-gap-1` | data-table | Does not explain that `total` in selected-text is total-items | Already documented in the sheet or by design |
| `VAL4-pagination-dx-3` | pagination | `{page}` placeholders in Angular template TEXT break the parser (NG5002); in attributes they pass | Verify again (not tested or not reproduced in the report) |
| `VAL4-pagination-dx-4` | pagination | SSR not tested | Verify again (not tested or not reproduced in the report) |
| `VAL4-pagination-vis-2` | pagination | RTL not tested | Verify again (not tested or not reproduced in the report) |
| `VAL4-pagination-gap-2` | pagination | No ready-made pt-BR guide of the position-text strings per type (only in Storybook dictionary) | Already documented in the sheet or by design |
| `VAL4-pagination-gap-3` | pagination | Behavior 'keeps the first item on screen' when changing page size was not tested | Verify again (not tested or not reproduced in the report) |
| `VAL4-dialog-vis-1` | dialog | Once, on first open of the lg preset, focus went to the content scroll region, not the first footer button | Verify again (not tested or not reproduced in the report) |
| `VAL4-dialog-vis-2` | dialog | Test screen not responsive: dialog at 375 px not validated | Consumer side, native behavior or validation app |
| `VAL4-notification-dx-2` | notification | `[action]` passing undefined was not tested (risk of an invalid value) | Verify again (not tested or not reproduced in the report) |
| `VAL4-breadcrumb-dx-4` | breadcrumb | $event of (click) handlers is a generic Event; needs a cast to MouseEvent | Consumer side, native behavior or validation app |
| `VAL4-breadcrumb-vis-2` | breadcrumb | Brand educacao was not photographed on the breadcrumb | Verify again (not tested or not reproduced in the report) |
| `VAL4-breadcrumb-gap-4` | breadcrumb | Does not say how the consumer knows the trail does not fit (decision to collapse is the consumer's) | Already documented in the sheet or by design |
| `VAL4-sidebar-item-dx-3` | sidebar-item | (nph-item-select) does not say which item emitted it (only value/checked) | Consumer side, native behavior or validation app |
| `VAL4-sidebar-item-vis-3` | sidebar-item | educacao was only photographed on the rail-button, not on expanded items | Verify again (not tested or not reproduced in the report) |
| `VAL4-sidebar-item-vis-4` | sidebar-item | After an SPA navigation the page scroll seemed to jump to the top (not confirmed; maybe HMR reload) | Verify again (not tested or not reproduced in the report) |
| `VAL4-sidebar-rail-button-dx-3` | sidebar-rail-button | Disabled+counter names the link via aria-label (label+number); enabled uses aria-labelledby='name counter': two ways to compose the name | Already documented in the sheet or by design |
| `VAL4-sidebar-rail-button-gap-4` | sidebar-rail-button | Does not say how the balloon behaves on touch (no hover) | Already documented in the sheet or by design |
| `VAL4-sidebar-subitem-vis-1` | sidebar-subitem | Long labels are cut early when `options` is on (the chevron takes space) | Consumer side, native behavior or validation app |
| `VAL4-sidebar-subitem-vis-3` | sidebar-subitem | Brand educacao not photographed for the subitem | Verify again (not tested or not reproduced in the report) |
| `VAL4-sidebar-subitem-gap-3` | sidebar-subitem | Does not say that a subitem outside a group renders (it only recommends not using it) | Already documented in the sheet or by design |
| `VAL4-navigation-menu-vis-2` | navigation-menu | Wide panel renders all panels in the DOM (links of every trigger in the shadow), only one visible | Consumer side, native behavior or validation app |
| `VAL4-navigation-menu-gap-2` | navigation-menu | Whether `active` accepts a nonexistent value / what `current` on disabled links does: not tested | Verify again (not tested or not reproduced in the report) |

Composition rows excluded from every group (defects of the validation app's own markup and CSS):

| Source row | Finding |
|---|---|
| `UX-tela-cadastro-1` | Fixed `1fr 1fr` grid overflows at 375 and 1024 |
| `UX-tela-cadastro-3` | Phone field uses misleading `alarm-clock` icon; debug `<pre>` visible |
| `UX-tela-listagem-5` | Focus goes to `body` after delete |
| `UX-tela-painel-2` | 768: content cut off (`.app` fixed height, missing `min-height:0`) |
| `UX-dialog-4` | Closing guard uses `form.dirty`, which only becomes true on `change` (blur); Esc closes without warning |

## 6. Questions

### For Indiane

Ordered by how many rows each unblocks. Each ties to a theme in section 2; the existing D items are marked.

1. **Dark brand tokens (A-01).** Which tokens carry the active and focus colors in dark for `gerencial`, `educacao`, `igrejas` and `rh`? (D-5 of DSA-62 is the same question.)
2. **Width policy (A-02).** Is `min(token, 100%)` the rule for every fixed width? Fluid `nph-field`?
3. **Narrow-screen pattern for bars (A-03).** Wrap, "More" menu, icon-only or scroll? (D-5 of DSA-55 and D-1 of DSA-58 are the same question.)
4. **Touch targets (A-07).** Is `large` the touch size, or does `pointer: coarse` raise targets to 44 px? Does the sidebar item "more actions" show on touch?
5. **Focus ring contrast (A-09).** Minimum ratio and token for `solid` actions and for the light-mode halo.
6. **Tables on narrow screens (A-04).** Scroll cue and sticky actions column, or stacked cards? (D1 of DSA-49 for the category row is still open.)
7. **Sidebar scope (A-12).** Is `nph-sidebar` in 5.0? Answer D-1 and D-4 of DSA-53.
8. **Missing pieces (A-13).** Are `nph-alert-dialog` and `nph-panel-menu` in scope? (D-1 of DSA-63 asks if the toast region becomes a piece, A-06.)
9. **Help on touch (A-08).** Tap opens the balloon, or the icon becomes help text?
10. **Toggle family and passive states (A-10, A-11).** Off state outline, square icon-only, segmented container, skeleton and pending-segment contrast, spinner under reduced motion.
11. **Contract questions (A-14).** Keep or change: switch as a form control, `required` on checkbox and radio, toggle group `disabled`, avatar failure event, avatar-stack `max`, spinner role, digits-only OTP, multi-combobox Tab order, dialog stacked order.
12. **Assets (A-15).** Image state illustrations and a lighter set of empty PNGs.
13. **Spacing and text policy (A-16, A-05).** Message line height, label row height, clamp margin for floating panels.

### For Elvys (not Figma)

These are code or architecture decisions that the batches wait on:

- **B-19.** A value accessor package or entry point, or the recipe only? The current docs promise no wrapper.
- **B-01.** Should the published package log invalid input by default, and how does a consumer switch it off?
- **B-03, B-07, B-08.** Names and `detail` of the new events (`nph-open-change`, `nph-status-change`) and whether `nph-table` stops replacing `rows`.
- **P0#4.** A cancelable `nph-navigate` event on the pieces with `href`, or the consumer recipe only?
- **B-04.** `type="submit"` and form association on `nph-button` (a new API on top of P68).
- **B-17.** Keep the Font Awesome peers (P21, P75) or ship the icon paths in the package.
- **E11.** Run `npm dist-tag rm` on the feed `latest` tag, or leave it as `docs/release.md` describes. Not run here.

## 7. How the IDs map to the sources

- `P0#n`, `P1#n` use the numbers in `validation.md` §2; `P2#n` is the n-th top-level bullet of its P2 list; `E1`-`E13` are the rows of §3.
- `UX-<section>-<n>`: the n-th `####` heading, in file order, of the `###` section named `<section>` in `ux-audit.md` §4 (screens, `tela-*`) or §5 (components). `UX-dialog-4` is the untitled `[P2, composition]` paragraph.
- `VAL4-<piece>-<dx|vis|gap>-<n>`: a bullet of the "DX problems in Angular", "Visual / behavior problems" or "Gaps in the sheet/documentation" subsection of the `nph-<piece>` section in `validation.md` §4. Bullets that only describe what worked are not findings and are skipped, and a bullet with several claims is split, so `n` is a stable label, not a strict position.

## 8. Limits of this triage

- Read from code and sheets only: no test run, no browser, no screen reader.
- Findings kept as the validator reported them. Where a code check disagrees with the report, the row says so (for example, the checked dropdown item color uses `--nph-color-primary-hover`, while the audit names `primary-on-surface`).
- `nph-table` and `nph-data-table` rows in A were checked against the sheets and CSS only, and the `UX-table-4` seam needs a browser at high pixel density.
- The evidence images stay in the validation app (see the [index](README.md#evidence)).
