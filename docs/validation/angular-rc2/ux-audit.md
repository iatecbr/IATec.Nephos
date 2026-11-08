# Layout and usability audit of the `nph-*` components (Phase C)

This note has no translations: it is an internal validation record, not usage
documentation. See [`../../i18n.md`](../../i18n.md) and the [index](README.md).
It is an English rendering of a Portuguese report (`AUDITORIA-UX.md`); nothing was
dropped or re-ranked. Findings are **proposals awaiting triage**, not decisions.
Screenshot paths (`shots/auditoria/<slug>/…`) point into the validation app and
are **not** in this repository: see [Evidence](README.md#evidence).

> Target: `@iatec/nephos@5.0.0-rc.2` (installed from the `IATec.Community` feed) used in 41 component routes and 4 composed screens of an Angular 22 app. **The focus is the component**; each finding says whether the cause is `component`, `composition` (CSS/markup of our validation app) or `both`. Complements [`validation.md`](validation.md) (originally `VALIDACAO.md`; DX/packaging/API).
> Method: `impeccable` skill (modes **audit**, **critique**, **adapt**, **harden**, **clarify**; evaluation only, nothing was fixed). Assessment A (design + usability review, 6 isolated subagents, one batch per component group) and Assessment B (`impeccable detect` per URL, 45 routes × 1440 and 375 px) ran separately and were synthesized here. Screenshots in `shots/auditoria/<slug>/` (`1440`, `1024`, `768`, `375`, `1024-dark`, `1024-educacao` + `detalhe-*.jpg` as evidence for each finding). The pages were captured with `?bare=1` (without the app menu).
> Coverage: **45 targets (41 components + 4 screens) × 4 widths (1440/1024/768/375)**, light + dark + `educacao` brand at 1024; states, keyboard, focus and touch (375 emulation with `hasTouch`) measured with headless Chrome/`puppeteer-core`, `getBoundingClientRect`, contrast computed from the computed colors, and tests of the component isolated outside our page.

## 1. Summary

**The components are, in general, well built: heights (28/36/44), radii and typography are consistent across button/togglebutton/toggle-group/toolbar/input/chip; text contrast passes AA in the tested themes (badge: 196 combinations, minimum 4.64:1); keyboard, popover flip, dialog initial focus and ARIA are at the level of the sheet; `nph-dialog`, `nph-navigation-menu`, `nph-toolbar` (roving), `nph-field` and `nph-select` stand out.** The problems are concentrated in four families, none of them visible at 1440 px:

1. **Fixed width that does not yield to narrow screens** (input/select/combobox/textarea 280 px, multi-combobox 420 px, slider 280 px, OTP 256/304 px, toast 360 px, toolbar/toggle-group/breadcrumb/pagination `nowrap`): at 375 px they overflow the container or the page, and the decision to adapt is left to the consumer with no tool for it.
2. **Brand tokens in dark mode**: 4 of the 7 brands (`gerencial`, `educacao`, `igrejas`, `rh`) fail the contrast of the "active/selected/focus" state in `dark` (`educacao`: `primary-hover` = `primary-surface-hover` = `#664412`, ratio 1.00:1), affecting sidebar-item/subitem/rail-button, navigation-menu and dropdown-menu.
3. **Touch**: the tooltip and the label's "i" icon never open on touch; the sidebar-item "⋮" menu only appears on hover; several targets measure 24–36 px (checkbox/radio/switch 24, clear 24, chip X, pagination 36, list options 36); the slider steals focus/scroll and changes the value when scrolling the page with a finger.
4. **States and focus**: `image` in error = empty (same gray square); `solid` button with a focus ring of 1.26–2.3:1; focus that falls on `BODY` when removing a chip/deleting a row; `nph-field` error without a live region; `dialog actions="stacked"` with a Tab order opposite to the visual one.

### Findings count

| Severity | Entries | Notes |
|---|---|---|
| **P0** | **0** | nothing prevents completing a task on desktop; on touch there are partial blockers (see P1) |
| **P1** | **29** (26 distinct) | the brand token defect appears 4× (one per affected component) |
| **P2** | **80** | many repeat 3–4 root causes (fixed width, 24 px target, light focus) |
| **Total** | **109 entries** | |

By cause (107 entries with a classified cause): **component 74 (69%) · both 28 (26%) · our composition (the validation app's own markup/CSS) 5 (5%)**. By batch: U1 actions (P1 4 / P2 15) · U2 forms (1 / 16) · U3 selection/identity (4 / 8) · U4 display (2 / 11) · U5 data/overlays (7 / 13) · U6 navigation+screens (11 / 17).

**Assessment B (`impeccable detect` detector, 90 runs):** 85 findings, **all originating in the CSS of our demonstration pages** (52 `line-length` from the intro paragraphs, 28 `tiny-text` from the 11 px captions, 2 `low-contrast` and 2 `ai-color-palette` from the app's own purple/green demo image, 1 `body-text-viewport-edge` on `/skeleton` at 375). **None was attributable to an `nph-*` component** (the detector does not enter shadow roots; the components' problems were measured by A).

## 2. The 10 most important findings

| # | Sev. | Cause | Finding | Where |
|---|---|---|---|---|
| 1 | P1 | component (tokens) | In `dark`, 4/7 brands fail the contrast of the active/selected/focus item: `gerencial` 1.47:1, `educacao` 1.00:1, `igrejas` 1.86:1, `rh` 1.56:1 (`sistemas`/`comercial`/`financeiro` 5.8–5.9:1). In `educacao` dark the active item, the counter pill, the rail icon, the focus (1.76:1) and the dropdown `single` item (1.46:1; focus 2.57:1) disappear. Verified: `--nph-color-primary-hover` = `--nph-color-primary-surface-hover` = `#664412`. | sidebar-item, sidebar-subitem, sidebar-rail-button, navigation-menu, dropdown-menu |
| 2 | P1 | component | Fixed widths without `max-inline-size:100%`/shrinking: form controls 280 px, multi-combobox 420 px (cause of the 816/1510 px overflow at 768/1440 on our page), slider 280 px (numeric field with 9 usable px shows "7" for 75), OTP 256/304 px. | multi-combobox, slider, input, select, combobox, input-otp |
| 3 | P1 | both | `nph-toolbar` (page/bulk) and the data-table bar neither shrink nor wrap at 375 px: children reach x=622 in a 343 px bar; swapping text for an icon does not solve it (input keeps 280 px, the `start` zone has no `min-inline-size:0`). | toolbar, data-table, `tela-listagem` |
| 4 | P1 | component/both | `nph-pagination` `numbered`/`edges`/`table` measure 541/502/502 px in a 343 px container (nowrap, `overflow:visible`): `Próxima/Última` end up off the screen. The `wide` footer of the data-table leaks 159 px off the left and is unreachable. | pagination, data-table |
| 5 | P1 | component | Tables only scroll horizontally, with no overflow indication, no fixed column, no cell wrapping; the `switch` and "⋮" fall below the fold at 375 and at 768 in the listing; `size="large"` does not enlarge the inner controls (checkbox 24, ⋮ 36). | table, data-table, `tela-listagem` |
| 6 | P1 | component | Touch: tooltip and the "i" icon of `nph-label`/`nph-field` do not open (0/4 cases); the "⋮" button of `nph-sidebar-item` is `display:none` under `hover:none` (no alternative); 24–36 px targets (checkbox/radio/switch, clear, chip X, pagination, list options). | tooltip, label, field, sidebar-item, checkbox, chip |
| 7 | P1 | component | `nph-slider`: the first thumb uses `autofocus`, stealing focus/scrolling the page on load (confirmed: `activeElement=NPH-SLIDER` after load) and a vertical gesture that starts on the track changes the value (`input:85`/`change:85`) before the page scrolls. | slider |
| 8 | P1 | both | `nph-breadcrumb` is `nowrap`/`flex:none` without truncating the label or `min-width:0`: it overflows at 768 and 375; `collapsed` does not guarantee that it fits. | breadcrumb |
| 9 | P1 | both/component | The 22.5 rem (360 px) toast does not fit in 375 px in the `fixed` region that the sheet recommends (x=-1 at 375, -56 at 320); `nph-image` error = empty (same gray square, no icon/text), even when clickable. | notification, image |
| 10 | P1/P2 | component | Focus and feedback: focus ring of the `solid` button 1.26–2.3:1 (border = fill color); focus falls on `BODY` when removing a chip/clearing a filter/deleting; `nph-field` error message without `role=alert`/`aria-live`; `dialog actions="stacked"` with Tab opposite to the visual order; `toggle-group` does not wrap (557 px in 343). | button, chip, field, dialog, toggle-group |

## 3. Cross-cutting patterns and how to fix them at the root
- **Width policy**: adopt `inline-size: min(var(--nph-layout-input-width), 100%)` (or `width:100%` with `max-inline-size`) on all controls; `min-inline-size:0` on the flex zones/slots of toolbar/toggle-group/pagination; allow `flex-wrap`/`overflow-x:auto` with a scroll indication on those bars; breadcrumb with `min-width:0` + `text-overflow:ellipsis` per level.
- **Brand/dark tokens**: separate `primary-hover` from `primary-surface-hover` and test, in `test:tokens`, a contrast ratio ≥ 3:1 (focus/active) and 4.5:1 (text) for the 7 brands × light/dark.
- **Touch**: minimum target of 44 px via a clickable area (`::before`) as the slider thumb already does; `pointer: coarse` opening the tooltip/help on touch (or text in `help`); an alternative to the sidebar-item "⋮"; `nph-option` 44 px in `large`/touch.
- **Focus**: 3:1 ring against the background on `solid` (darker halo/inverse border); return focus to the next logical target when the focused element is removed.
- **Feedback**: `role=alert`/`aria-live=polite` on the field's message line; icon/text in the empty/error states of `nph-image`.

## 4. Composed screens

### `tela-cadastro` (route `/tela/cadastro`) — 10-field form

**Summary**: what is component works very well: `nph-field` shrinks without overflowing (`max-inline-size:100%`), passes `invalid` and `aria-invalid` to the control, the Tab order is logical, and errors appear as text. What breaks is our composition (the validation app's own markup/CSS: grid and feedback). Overall grade C (components B+, composition D).
**Heuristics (0–4)**: Error prevention 3 (clear messages, `required`); Recognition 4; Visibility of state 2 (success/error outside the viewport); Help recovering from errors 2 (focus does not go to the first error).

**Composition findings (ours)**
#### [P1] Fixed `1fr 1fr` grid overflows at 375 and even at 1024
- Problem: `.two { grid-template-columns: 1fr 1fr }` becomes `320px 320px` (the natural width of `nph-field`, 320 px) and the document measures 672 px at 375 (horizontal scroll; the 375 capture looks like 672 px). At 1024 the grid (656 px) overflows the 640 container by 16 px.
- Where: `/tela/cadastro` at 375, `shots/auditoria/tela-cadastro/375.jpg`; test of the fix in `shots/auditoria/tela-cadastro/detalhe-2col-minmax375.jpg`.
- Cause: composition (verified: with `repeat(2,minmax(0,1fr))` the document stays at 375 and the fields shrink to 164 px without overflowing; `nph-field` obeys `max-inline-size:100%`). The component is right.
- Suggestion: `minmax(0,1fr)` and a single column below ~480 px (at 164 px the placeholder `(11) 99999-0000` already gets tight).

#### [P1] Success and errors fall outside the viewport; focus does not go to the first error
- Problem: when submitting with empty fields, focus stays on the `Cadastrar` (Register) button (verified: `activeElement` = button) and the errors are above, off screen (scroll of 340 px). On a valid submit, the success notification is inserted at the top: it sits at y=-93 with 13 px visible, and the page still scrolls by itself.
- Where: `shots/auditoria/tela-cadastro/detalhe-erros768.jpg` (all the errors, but already scrolled to the end) and `shots/auditoria/tela-cadastro/detalhe-sucesso375.jpg` (only the green edge of the notification shows at the top).
- Cause: composition (the screen decides where to show the message and does not move focus). Component (DOM only, no screen reader): the `nph-field` message is a `<span id="message">` without `role="alert"`/`aria-live`, so the appearance of the error is not announced by itself (under "Not verified" below).
- Suggestion: `focus()` on the first invalid control (or an error summary with focus) and `scrollIntoView` on the success notification (or a fixed `role=status` near the button).

#### [P2] Our details
- The phone field uses the `alarm-clock` icon (misleading); the debug `<pre>` stays visible at the end.

**Component findings (for the library team)**
#### [P2] `nph-field` has a fixed width of 320 px (does not fill the column)
- Problem: `--nph-layout-field-width` = 320 px; in a 640 px column all the fields take up half (`tela-cadastro` at 1024), and the consumer has to override the token.
- Cause: component (by design; the shrinking works).
- Suggestion: document the token and/or offer `fluid` (100%).

#### [P2] Field without a label (the `termos` checkbox)
- Problem: `nph-field` without `label` renders an empty `<label class="nph-label__text"></label>` and a `role="group"` without a name.
- Cause: both (the composition omits the label; the component should hide the empty `nph-label`).

#### [P2] 24 px targets on radio, checkbox and switch
- Measured: rows 24 px tall (step of 28). Passes AA at the limit; falls below 44 px on touch. Cause: component.

**Positives**: Tab goes through `Nome` → `E-mail` → `Telefone` → `Departamento` → `Cargo` → `Habilidades` → `Tipo de contrato` (a single stop) → `Sobre` → `Preferências` → `Termos` → `Cadastrar` → `Limpar` (measured, visual order = DOM order). Errors: red text + border + `aria-invalid` on the control.
**Not verified**: screen reader (including whether the `nph-field` error is announced: the simple controls have `aria-describedby="description"`, but it was not confirmed that the id resolves to the message); `counter` error messages (>280 characters); the button's `loading` state was only confirmed as an attribute (`loading=true`), not visually.

---

### `tela-listagem` (route `/tela/listagem`)

**Summary**: at 1024+ the data-table + toolbar + dialog + notification composition works well. At 375 and 768 the components do not understand each other: the toolbar overflows the page, the per-row actions end up below the fold and `sticky-header` pins the scroll at 296 px. Overall grade: C+.
**Heuristics (0–4)**: Visibility 2 (actions below the fold, toast off screen); Error prevention 3 (dialog before deleting); Consistency 3.

**Findings**

#### [P1] 375: the page ends up 478 px wide and the toast leaves the visible screen
- Problem: the search field has our `min-width: 260px`, and the `Novo colaborador` (New employee) button (164 px) goes from x=313 to 477; `scrollWidth` 478. The fixed toast (`right: 24px`) then ends up relative to the 478 viewport: x=94–454, y=947 (outside the 812 visible px).
- Where: `/tela/listagem` 375, `shots/auditoria/tela-listagem/375.jpg`.
- Cause: both. Without the app's `min-width` the field already measures 280 px inside the toolbar (which does not shrink), so the component alone also overflows (see data-table).
- User impact: sideways page scroll; the delete confirmation appears outside the visible area.
- Suggestion: composition: remove the `min-width`, icon-only button below 480 px and toast with `inset-inline-start`; component: see data-table.

#### [P1] 768: the ⋮ column (row actions) is cut off
- Problem: the region measures 736 and the table 760 px; the ⋮ sits at x=736–760, invisible, with no scroll hint (at 375, `Cargo`, `Situação`, `Admissão` and ⋮ are also out).
- Where: `/tela/listagem` 768, `shots/auditoria/tela-listagem/detalhe-768-acoes-cortadas.jpg`.
- Cause: both. Component: nowrap columns and no fixed actions column; composition: 5 columns + person on two lines (name + email).
- User impact: no visible `Editar/Excluir` (Edit/Delete) on a portrait tablet.
- Suggestion: composition: remove one column (`Cargo`) or reduce the width of the person column; component: fixed actions column (sticky end).

#### [P2] `sticky-header` limits the table to 5 of 10 rows, even with free space
- Problem: fixed `table/body-max-height` at 18.5rem (296 px): at 1024×768 about 250 px remain free and the table shows 5 rows with internal scroll (`scrollHeight` 570). On touch it is a nested scroll (`overscroll-behavior: auto`). Test: `--nph-table-body-max-height: 60vh` on the host leads to 461 px, that is, the composition can solve it.
- Where: `/tela/listagem` 1024 and 375, `shots/auditoria/tela-listagem/375.jpg`.
- Cause: both (fixed default value in the component; the composition turned on `sticky-header` without adjusting it).
- User impact: little information per screen and a scroll trap on phones.
- Suggestion: default in a viewport unit (`min(60vh, 18.5rem)`) or a documented token; composition: set the token or drop `sticky-header` below 768.

#### [P2] Batch bar: `Excluir` (Delete) overshoots the bar by 13 px
- Problem: with 2 rows selected the bulk bar measures x=16–359, `Excluir` ends at 372 and is cut off (`Exclui…`).
- Where: `/tela/listagem` 375, `shots/auditoria/tela-listagem/detalhe-375-bulk.jpg`.
- Cause: both (the bar does not shrink/wrap; the composition does not shorten labels).
- User impact: the destructive action ends up with a cut-off label.
- Suggestion: bulk bar buttons icon-only on narrow screens.

#### [P2, composition] Focus goes to `body` after deleting
- Problem: on confirm, the selection is cleared and the bulk bar (and the button that opened the dialog) disappears; focus goes to `body`.
- Cause: composition. Suggestion: move focus to the table or to the title after deleting.

**Positives**: the select → `Excluir` → `sm` dialog (initial focus on `Cancelar` (Cancel), 335 px wide at 375) → toast flow is coherent and easy to understand; the bulk bar replaces the toolbar with a count; striped + sticky works at 1024.
**Not verified**: keyboard use of the full flow; dark/`educacao` of the open flow (dialog and toast); search `loading` state at 375.

---

### `tela-painel` (route `/tela/painel`) — shell with side menu + breadcrumb

**Summary**: at 1024 it is good (side menu, breadcrumb and notices align). At 768 the content is cut off and at 375 the screen is unusable, and both are our composition: the library has no `nph-sidebar` (nor responsive menu behavior). Overall grade C.
**Heuristics (0–4)**: Visibility of state 3; Consistency 3; Flexibility 1 (no responsive collapsing).

**Composition findings (ours)**
#### [P1] At 375 the 280 px side panel leaves 61 px for the content
- Problem: `.app` fixes the height at 560 and the expanded menu takes 280 px: the content has 61 px, the text breaks letter by letter (natural height 3770 px) and is cut off by `overflow:hidden`. Collapsed (64 px rail), 277 px remain, but the top bar overflows (155 px toggle + 109 px breadcrumb + paddings > 277; `Início` (Home) comes out cut off).
- Where: `/tela/painel` at 375, `shots/auditoria/tela-painel/detalhe-expandido-375.jpg` and `detalhe-recolhido-375.jpg`.
- Cause: composition (no automatic collapsing; the toggle has text). Component: the breadcrumb neither shrinks nor truncates (see breadcrumb [P1]) and there is no `nph-sidebar`.
- Suggestion: below ~768 px start collapsed (rail) or use a drawer; on the toggle, icon only with `label`.

#### [P1] At 768 the content is cut off
- Problem: `.app` has `height:560px; overflow:hidden`, but `.content` has no `min-height:0` and `.body` has no `flex:1`, so `.body` (with `overflow:auto`) never scrolls: the content measures 594 px and the `Nada para mostrar` (Nothing to show) text and the menu footer (avatar) come out cut off.
- Where: `shots/auditoria/tela-painel/768.jpg` (the `nph-empty` text and the avatar cut off); measured: `.content` scrollHeight 594 vs 560.
- Cause: composition.
- Impact: part of the content (and the logged-in user in the menu footer) is unreachable on a portrait tablet; there is no scrollbar.
- Suggestion: `.content { min-height: 0 }` and `.body { flex: 1; min-height: 0 }`, or a `min-height` instead of a fixed height.

#### [P2] Sub-items without indentation, and the group disappears in the rail
- Problem: the sub-items (`Colaboradores`, `Departamentos`, `Cargos`) are at the same indentation as the group (no `.sub` with indentation and line), so the hierarchy disappears; in the rail the group has no representation (only a `Pessoas` (People) button; `Departamentos` becomes unreachable).
- Cause: both: our composition (the indentation is missing) and the component (absence of `nph-sidebar` and of a group flyout in the rail; the sheet admits "not built yet").

**Component findings (already listed above)**: counter over the icon in the rail (`Mensagens` (Messages), [P1] of rail-button) and dark/`educacao` (2.29:1 on the screen's active item).
**Positives**: group and active contrast 7.18:1 (light) and 9.5:1 (dark); the `Home > Início` breadcrumb fits at 768 and 1024; the collapsed 64 px rail with 40 px buttons is aligned.
**Not verified**: real navigation through the Router (the screen uses state); keyboard use of the side menu (batch F already covers it).

---

### `tela-navegacao-superior` (route `/tela/navegacao-superior`)

**Summary**: the best of the three screens: bar at ≥ 701 px, `Menu` button at ≤ 700 px via `matchMedia`, no overflow at 375 (docW 375), touch opens and navigates, the list closes on selection. The defects are only the positioning of the narrow menu. Overall grade B+.
**Heuristics (0–4)**: Visibility of state 4; Consistency 4; Flexibility 4.

**Findings**
#### [P2] Open narrow menu sits flush against the edge and far from the button
- Evidence: at 375 the hamburger is at x=165 (in the middle of the header), the list (280 px) opens at x=95..375, with no margin, covering part of the breadcrumb; `shots/auditoria/tela-navegacao-superior/detalhe-menu375.jpg`.
- Cause: both (see navigation-menu [P2]): the composition puts the button in the middle (`.grow` right after the brand); the component clamps with no margin.
- Suggestion: hamburger to the left of the brand (or at the end) and an 8–16 px margin in the clamp.

**Positives**: `narrow` turned on by `matchMedia(max-width:700px)` with no jump; 36 px targets (hamburger and avatar); `aria-expanded` and `aria-label` present; 2-level breadcrumb fits; the list covers all the content and scrolls if height falls short.
**Not verified**: window size between 700 and 701 px at the transition; the user menu (dropdown-menu) on touch; full keyboard use on the narrow list (the navigation-menu batch covers Tab/Esc).

---


## 5. Components

### button (route `/button`)

**Summary**: Good. Heights 28/36/44, radius 6, text of every severity x emphasis combination passes 4.6:1 in the 4 themes (measured: minimum 4.64 on primary outline/light, light). The focus ring is solid on the ghost/outline/secondary types; it is weak on `solid`. Long text neither wraps nor truncates. Overall grade: B+.
**Heuristics (0-4)**: Visibility of system status 4 (loading keeps focus, spinner in place of the icon); Error prevention 3 (invalid combinations disappear silently); Consistency 4; Recognition 3 (secondary ghost looks like text until hover).

**Findings**

#### [P2] Focus on the `solid` button is only a light 4 px halo (focus border = background color)
- Problem: on `solid` the 1 px focus border has the same color as the fill, so it does not show. What remains as the indicator is the 4 px halo. In the light theme that halo measures 1.26:1 against the page (primary), 1.93 (danger), 1.49 (primary `educacao`). In dark: 2.33 (`sistemas`) and 2.16 (`educacao`). On ghost/outline/secondary the border is worth 3.7 to 12.7:1 and the focus is clear.
- Where: `/button`, 1024; `shots/auditoria/button/detalhe-foco-temas.jpg` (6 types x 4 themes, keyboard focus).
- Cause: component. Computed on `nph-button`: `::before` border 1px = `--nph-color-primary` (same as `background-color`), `::after` 4px = `--nph-focus-halo`. Does not depend on composition.
- User impact: a keyboard user sees the ring, but with little contrast on primary buttons with a light background. It is visible, not absent; the sheet admits the limit in dark for other brands.
- Suggested fix: for `solid`, use the focus border with the contrast color (e.g. `focus/border`, like secondary) or a halo with >=3:1 against the background. Alternative: `outline-offset` with the type's text color.

#### [P2] Long text never wraps or truncates; it overflows the column and causes horizontal page scroll
- Problem: `nph-button` with `Confirmar e enviar solicitação de reembolso de despesas` (Confirm and submit expense reimbursement request) measures 405 px inside a 343 px container (x from 16 to 421); the page grows to 422 px wide.
- Where: isolated on `/button` at 375 px; `shots/auditoria/button/detalhe-375-texto-longo.jpg` (the image also shows togglebutton and toggle-group; see the P1 of toggle-group).
- Cause: component (documented: `white-space: nowrap`, "stays on one line"). No label in the validation app's pages triggers this, only the isolated test.
- User impact: at 375 px any long label becomes horizontal scroll; the button leaves the screen.
- Suggested fix: keep `nowrap` by default, but offer `max-inline-size: 100%` + `overflow: hidden; text-overflow: ellipsis` with `title`/tooltip, or allow wrapping onto 2 lines with `min-height` instead of a fixed `block-size`, at least at `size=large`.

#### [P2] No adaptive size for touch: the icon-only target is 28/36 px unless the page writes `size=large`
- Problem: at 375 px (touch, `isMobile`+`hasTouch`) icon-only buttons measure 28x28 (compact) and 36x36 (default); only `large` reaches 44. It passes WCAG 2.5.8 (>=24 px), but does not pass the sheet's own 44 px recommendation.
- Where: `/button` and toolbar `tools` at 375 px; `shots/auditoria/toolbar/375.jpg` (8 icon-only buttons of 36 px).
- Cause: both. The sheet asks for `large` on touch (component decision: no `@media (pointer: coarse)`), and the validation app's pages use default.
- User impact: harder touch accuracy on icon bars; `shape=circular` does not change the target.
- Suggested fix: component: accept `size="auto"` (28/36 on `pointer: fine`, 44 on `pointer: coarse`) or a token that the consumer turns on via media query; composition: the validation app's validation bar should use `large` when `(pointer: coarse)`.

### Composition (short)
- `Enviar (ngSubmit)` measures 480 px wide and `Ler FormData` (togglebutton page) 480 px: the `.stack-wide` column + the button's `flex: 1` stretches the `nph-button`. The component documents that it fills the host that the parent widens; the parent just needs not to stretch it.

**Positives**: heights and radius exact in the 3 sizes (28/36/44, 6 px; table in the Overview). Text >=4.6:1 in all combinations and themes (measured across the 15 types x 4 themes). Focus of ghost/outline/secondary with border >=3.7:1 and halo (`detalhe-foco-temas.jpg`).
**Not verified**: hover/active state with measured contrast; `prefers-reduced-motion`; forced high contrast; spinner in the dark theme (only seen at 1024 light).

---

### togglebutton (route `/togglebutton`)

**Summary**: Functional and legible (text >=6.69:1 in all states and themes), but the "off" state looks like loose text with an "x", and the icon-only has a different proportion from `nph-button`. Overall grade: B-.
**Heuristics (0-4)**: Visibility of status 3 (pressed only by a 1.26:1 background + icon/text color); Match with the real world 2 (the "x" in the off state reads as "close/remove"); Consistency 2 (icon-only 54x36 versus the button's 36x36); Error prevention 3 (invalid with a 6.88:1 border).

**Findings**

#### [P2] Off state without outline and with an "x" icon: looks like a label, and the "x" reads as remove
- Problem: without `icon-start`, the `auto` default shows `xmark` when off and `check` when on. Off has no background or border (bg vs page = 1.00), so `x Desligado` (x Off) looks like a dismissible or disabled item, and it is hard to tell that it is clickable.
- Where: `/togglebutton` 1024 (`shots/auditoria/togglebutton/1024.jpg`, `Estados` (States) and `Tamanhos` (Sizes)), `/toggle-group` 1024 (`Esquerda / x Centro / x Direita`).
- Cause: component (`icon-start="auto"` default and the CSS `.control{background:transparent;border:transparent}`); the validation app's page only uses the default.
- User impact: in a single group, unselected options appear with an "x" (looks "invalid" or "close"); lacks button affordance before hover.
- Suggested fix: in off use a 1 px outline (`border/subtle`) or a neutral icon (empty circle) instead of `xmark`; or make `icon-start="none"` the default in a group context.

#### [P2] Icon-only is not square: 50x28 / 54x36 / 58x44
- Problem: `nph-button` icon-only measures 28/36/44 square; `nph-togglebutton` icon-only measures 54x36 (default), 50x28 (compact), 58x44 (large) and the width grows 4 px per size.
- Where: `/togglebutton` and `/toggle-group` (`Alinhar texto` (Align text): 54x36 each).
- Cause: component. CSS: `.control` with `padding: 4px` (inline-tight) + `.surface` with `padding-inline: 12px` (control-padding) even without text: 16 (icon) + 24 + 8 + 2 (border) = 54.
- User impact: side by side with icon-only `nph-button` (36x36), the two icon families look visibly different; the icon group becomes wider than necessary.
- Suggested fix: `:host([data-nph-icon-only]) .surface{padding-inline:0; inline-size: calc(var(--control-height) - 2*(var(--border-width)+var(--space-inline-tight)))}` to match the button.

#### [P2] On state distinguished by a 1.26:1 (light) / 1.54:1 (dark) background when there is no icon
- Problem: with `icon-start="none"`, the only "on" signal is a background almost equal to the page (light 1.14 to 1.26:1, dark 1.54 / 2.16 in `educacao`) plus a text color change (muted to foreground).
- Where: toolbar `Visualização` (View) (center slot, `icon-start="none"`), `shots/auditoria/toolbar/detalhe-center-pressed-temas.jpg`.
- Cause: both. Component: accepted and documented limit in the sheet ("in dark without an icon the label barely changes"); composition: the validation app's toolbar turns the icon off.
- User impact: visible, but weak; in dark `Lista` (List) and `Grade` (Grid) differ little beyond the background.
- Suggested fix: component: underline or 2 px bar (or font weight) when `icon-start=none`; composition: keep the icon (check) in the toolbar toggle.

**Positives**: text 6.69:1 (off) and 16.7:1 (on) in light; 9.8 / 9.6 in dark; `invalid` border 6.88:1 light and 5.01 dark. `disabled` stays at 0.5 opacity (effective text 2.23:1 light, exempt from WCAG).
**Not verified**: togglebutton hover; `invalid` with focus; Space/Enter (covered by phase A).

---

### toggle-group (route `/toggle-group`)

**Summary**: Writes `size` on the children (28/36/44 correct, even when the child asks for another), 8 px gap, focus not clipped by the neighbor. But it has no line wrapping and overflows at 375 px with real labels. Overall grade: B-.
**Heuristics (0-4)**: Consistency 4; Visibility of status 3; Flexibility/efficiency 2 (no stacked or scroll mode); Recognition 2 (no container, no visible label: `label` is aria only).

**Findings**

#### [P1] The group neither wraps nor scrolls: three ordinary-label options overflow the 375 px screen
- Problem: isolated group with `Últimos sete dias / Últimos trinta dias / Últimos noventa dias` (Last seven days / Last thirty days / Last ninety days) inside 343 px: the buttons run from x=16 to x=573 (total width 557 px); the page grows to 573 px wide and the last button is off screen.
- Where: isolated on `/toggle-group` at 375 px; `shots/auditoria/toggle-group/detalhe-375-texto-longo.jpg` (bottom row of the image). On the real pages at 375 it does not overflow only because the labels are short (`Um/Dois/Três`, `Esquerda/Centro/Direita`).
- Cause: component. `.control{white-space:nowrap}` on each child + host without `flex-wrap` or `overflow-x:auto`; the sheet does not foresee narrow behavior.
- User impact: on a phone, period/view filters become unreachable without horizontal pan of the whole page.
- Suggested fix: `flex-wrap: wrap` with gap (or `overflow-x:auto` with scroll-snap) on the host; document the "stack" alternative for <480 px.

#### [P2] No container or visible label: reads as loose buttons
- Problem: the group "adds no color, border or outline" (sheet); `label` only becomes `aria-label`. On `/toggle-group` three options appear as `v Esquerda / x Centro / x Direita` without a frame indicating that they are mutually exclusive.
- Where: `/toggle-group` 1024 (`shots/auditoria/toggle-group/1024.jpg`, first block).
- Cause: component (documented decision), aggravated by the "x" on off options (see togglebutton).
- User impact: single selection and grouping are not obvious; the question (`Alinhamento` (Alignment)) does not appear if the consumer does not write it.
- Suggested fix: `appearance="segmented"` variant (outline and dividers) and an optional visible label property.

**Positives**: the group overrides the child's `size` (28/36/44 measured, including "large, child with size=compact"); keyboard focus of the 2nd button visible in the 4 themes with the border at 5.37:1 (light) and 4.59:1 (dark), without being covered by the neighbor (gap 8 > 6 px ring): `shots/auditoria/toggle-group/detalhe-foco-temas.jpg`.
**Not verified**: roving/arrows of the group outside the toolbar (only measured Tab in the toolbar); group without `label` (renders 0x0, seen in a table but not investigated); RTL.

---

### toolbar (route `/toolbar`)

**Summary**: Sizes and focus very consistent and the roving works exactly as the sheet describes, but at 375 px the `page` and `bulk` bars overflow their own border, even after swapping text for icons. Overall grade: C+ (B on desktop).
**Heuristics (0-4)**: Consistency 4 (input, button and chip follow `size`); User control and freedom 4 (arrow/Home/End, wrap, disabled skipped); Flexibility 1 on narrow screens (no strategy); Recognition 3 (ghost actions without outline until hover).

**Findings**

#### [P1] At 375 px the `page`/`bulk` bars spill outside their own border and the page gains horizontal scroll; swapping text for icons does not fix it
- Problem: the `page` bar (search + `Filtrar` (Filter) + 3 actions) is 343 px wide and the children run to x=622 (`scrollWidth` 606); `bulk` to 538; `Compact` 464; `Large` 589. The actions are drawn outside the bar's outline (no clipping, no scrolling). Even in the version that follows D-5 (icons only: search + 4 icon-only) the last icon reaches x=481, against 359 for the bar's border. The `tools` bar (7 icons, 36 px) fits by 9 px; `floating` fits.
- Where: `/toolbar` 375 px; `shots/auditoria/toolbar/detalhe-375-overflow.jpg` (`Pessoas` (People) bar isolated in a 343 px container: the text `Nova pessoa` (New person) exits to the right of the border) and `shots/auditoria/toolbar/detalhe-375-so-icones.jpg` (bar with icons only, still overflows).
- Cause: both, with weight on the component. Isolated: `nph-toolbar` alone in `<div style="width:343px">` reproduces it (sum of children 424 px; input width 280 px). The sheet says "does not wrap or collapse, the consumer reduces" (D-5, pending decision), but `nph-input` keeps `inline-size: var(--nph-layout-input-width)` (280 px) inside the `start` zone, which is `flex:1 1 0` without `min-inline-size:0`, so the field does not shrink and there is no way out on the consumer's side, other than swapping the input. The validation app's page uses 5 items with text and does not adapt.
- User impact: on a phone the list's action bar is cut off or the whole page scrolls; primary buttons (`Nova pessoa`) end up off screen.
- Suggested fix: component: `.start,.end{min-inline-size:0}` and `::slotted(nph-input){flex:1 1 0; min-inline-size:0}` so the field shrinks; `overflow-x:auto` as a safety net on `.bar`; document the "more" pattern (D-5). Composition: the validation app's page should show the narrow variant (icons + More) at 375.

#### [P2] Icon without a visible name on touch: the `tools` bar at 375 px has 8 icon-only actions and no hint appears
- Problem: the tooltip does not open on touch (verified: tap on a button with text, native icon-only button, icon with `tabindex=0` and icon-only `nph-button`: no balloon opens, 4/4). In `tools` (`Negrito`, `Itálico`, `Sublinhado`, `Link`, `Imprimir`, `Excluir`, `Mais` (Bold, Italic, Underline, Link, Print, Delete, More)) the phone user does not see the name.
- Where: `/toolbar` and `/tooltip` at 375 px.
- Cause: component, accepted by the sheet ("On touch the tooltip does not open, an accepted exception"). The consequence is one of use: consequential actions (`Excluir` (Delete)) only as an icon.
- User impact: depends on recognizing the icon; `Excluir` and `Mais` become ambiguous.
- Suggested fix: composition: icon + text on `Excluir` and on destructive actions in touch bars; component: optional visible `label` (`label-visible="touch"`) or long-press.

**Positives**: roving verified by keyboard: Tab enters once (checkbox, then the 1st button, `tools`, `floating`), arrows move with wrap, Home/End work, disabled button (`Sublinhado` (Underline)) is skipped, re-entry through the last action (Shift+Tab/Tab went back to `Imprimir` (Print)), the search is its own stop and the chips have their own stop, all as in the sheet. Heights (compact 28, default 36, large 44) equal for input, button and chip; the separator takes the children's height. Contrasts: text of the actions in `bulk` >=11.2:1 in dark and 16.8 / 6.1 (`Excluir`) in light; count 4.64 to 4.78:1 in light (borderline, passes).
**Not verified**: bulk hover (`toolbar/bulk-action-background-hover`); RTL toolbar; behavior of `applied-filters` when removing a chip (focus) beyond what phase A covers.

---

### dropdown-menu (route `/dropdown-menu`)

**Summary**: Very good mechanics (APG menu button, flip, internal scrolling, top layer), fits at 375 px without problem. But in dark/`educacao` the checked item becomes illegible and the item's focus ring is weak. Overall grade: B- (A- outside dark/`educacao`).
**Heuristics (0-4)**: Visibility of status 3 (checked, switch, loading) with a dark/`educacao` caveat; User control and freedom 4 (Esc returns focus, Tab closes, flip); Consistency 3; Error prevention 3.

**Findings**

#### [P1] Checked single-choice item becomes illegible in dark + `educacao` brand (1.46:1)
- Problem: the text, icon and check of the checked `single` item (`Lista` (List)) use a dark brown color on the dark panel: 1.46:1 against the item's own background (the item has no background of its own). In dark/`sistemas` the same item measures 6.05:1; in light/`educacao` 8.75:1; unchecked items 9.93:1. The sheet states that the text passes AA on `color/popover` and `color/primary-surface`.
- Where: `/dropdown-menu` 1024, `Todos os tipos de item` (All item types) (opened with Enter), themes dark + `educacao`; `shots/auditoria/dropdown-menu/detalhe-item-marcado-foco.jpg` (3 panels: the checked one almost disappears in dark/`educacao`).
- Cause: component. The checked item's color comes from a `primary-on-surface` token designed for a light primary-surface background, applied without that background in the menu; only `selection: single` is affected (checked `multiple` measures 9.93).
- User impact: the currently selected option (`Lista`) almost disappears, which inverts the reading of "which one is active" and violates WCAG 1.4.3.
- Suggested fix: apply `color/popover-foreground` to the checked text and leave the highlight only on the check/icon with a light dark-theme `primary`, or give the checked item the `primary-surface` background.

#### [P1] Item focus ring in dark/`educacao` measures 2.57:1 against the panel
- Problem: the item's focus is a 1 px border in `color/primary`, which in dark/`educacao` is `rgb(153,101,27)` on the panel: 2.57:1; the halo (`rgb(102,68,18)`) is practically invisible. The sheet declares "5.37:1 in light and 4.59 in dark" (holds only for `sistemas`: 5.37 / 4.59 measured). In light/`educacao` it measures 4.96.
- Where: `/dropdown-menu` 1024, dark + `educacao`; `shots/auditoria/dropdown-menu/detalhe-menu-temas.jpg` (focus on `Caixa de entrada` (Inbox)) and `detalhe-item-marcado-foco.jpg`.
- Cause: component (focus token = `color/primary`, which the sheet only validates in two combinations).
- User impact: with a keyboard the focused item is hard to find in dark/`educacao` (WCAG 1.4.11, 3:1).
- Suggested fix: use `focus/border` (neutral, 4.5+ in all) as in secondary, or a ring with the light-theme `primary` for dark.

#### [P2] The panel touches the screen edges at 0 px
- Problem: when opened from a row's `...` at 375 px, the panel runs from x=95 to x=375 (exact screen edge, no slack); the full menu goes to the bottom of the viewport (b=520 of 520) and scrolls inside (669 of content against 326 visible).
- Where: `/dropdown-menu` 375 px; `shots/auditoria/dropdown-menu/detalhe-375-borda-direita.jpg`, `detalhe-375-menu-completo.jpg`.
- Cause: component: clamp in `[0, viewport]` without margin.
- User impact: feeling of being cut off; on screens with rounded corners the corner may be clipped.
- Suggested fix: clamp with 8 px (token `space/inline`) of slack in the viewport.

#### [P2] 36 px rows (28 px in `compact`) on touch, with no `large` size
- Problem: the menu's `size` only has default (36) and compact (28). At 375 px the rows measure 36 (menu) and 28 (table-row menu `size=compact`, which is the recommended use for per-row actions).
- Where: `/dropdown-menu` 375 px, `um menu por linha` (one menu per row): rows of 28 px; `Conta` (Account) menu: 36 to 52 px.
- Cause: component (the sheet cites only >=24 px; buttons and toolbar have `large`).
- User impact: on touch, neighboring 28 px items with a destructive action (`Excluir` (Delete)) next to `Editar` (Edit) make mis-taps easier.
- Suggested fix: `size="large"` (44 px) and, at minimum, `compact` with 32 px+ when `pointer: coarse`.

#### [P2] `aria-expanded`/`aria-haspopup` stay on the host, not on the trigger's native button
- Problem: measured: the `nph-button` host receives `aria-expanded="true|false"`, but the inner `<button>` does not (`null`). The sheet lists the limit.
- Where: `/dropdown-menu`, trigger `dm-basic`.
- Cause: component (`nph-button` does not forward).
- User impact: a screen reader does not announce "expanded/collapsed" on the trigger.
- Suggested fix: `nph-button` with `aria-expanded`/`aria-haspopup` as attributes reflected to the native one.

### Composition (short)
- The `<pre>` `elemento: (clique em ...)` (element: (click on ...)) on the validation app's page overflows the width: the document is at 412 px at 375 (233 px of `<pre>` without `white-space: pre-wrap`). It is not the component's.

**Positives**: the `Conta` menu (13 items) at 375 x 700: fits (280 px wide, x=16), scrolls internally (669/326), flips upward when there is not enough space (tested with the trigger at the foot of the viewport; flip + scrolling). Keyboard verified: Enter opens on the 1st item, ↓/End move, Esc closes and returns focus to the trigger, Tab closes and moves on. Panel in the top layer is not clipped by the `overflow:hidden` container (`dm-clip` opened fully).
**Not verified**: item hover/active by contrast; `switch`/`multiple` with mouse; nested menu (out of scope); search by typing.

---

### field (route `/field`)

**Summary**: Label/control/help/error composition well solved: 4 px between the parts, 12 px help at 6.69:1, error always with text, disabled hides the error, clicking the label focuses the control (tested on input, select, combobox, textarea). Problems: a useless info icon on touch, a balloon that leaks text, and height jumps between help, error and counter. Grade B.
**Heuristics (0–4)**: Visibility of status 3 · Error prevention/recovery 3 · Consistency 3 · Recognition (affordance of the "i" icon) 1 on touch, 4 on mouse/keyboard.
**Findings**
#### [P1] The label's info icon does nothing on touch
- Problem: the "i" button (24x24, with `info-label` as its name) is a visible, focusable control, but on touch the balloon never opens. Tap does nothing.
- Where: `/field` at 375, `Com info` (With info) field (`shots/auditoria/field/detalhe-partes-375.jpg`). Test: `touchscreen.tap` on the button, `data-open` of `.bubble` stays absent and height 0 after 1 s.
- Cause: component. The nph-label sheet says "It never opens on touch ... essential information never lives only in the balloon". It is a documented decision, but it leaves a control without effect for people on phones.
- User impact: people on phones see a help button that looks clickable and does not respond; if the explanation is only in `info`, it becomes inaccessible.
- Suggested fix: open/close the balloon on touch (toggle with close on touch outside) or, on `pointer: coarse`, do not draw the button and append the `info` text to the help line. If the decision is to keep it, warn in the sheet that `info` can never be the only place for the text and document that consumers on touch screens should use `help`.
#### [P2] The info balloon cuts text above ~2 lines
- Problem: the balloon has `max-block-size: 44px` with `overflow: visible`. Texts that go beyond 2 lines (about 70 characters at the maximum width of 235 px) leave the dark box and the white text falls on the light background, illegible.
- Where: `/field`, 129-character text at 375 and at 1024 (`shots/auditoria/field/detalhe-info-tooltip-375.jpg`, `detalhe-info-tooltip-1024.jpg`). Measured: `.bubble` height 44, `scrollHeight` 68, `maxBlockSize` 44px, `overflow: visible`; CSS in `dist/shared/nph-tooltip-*.js` (`max-block-size: var(--nph-layout-max-tooltip-height)`).
- Cause: component (nph-tooltip, inherited by the field's label). Not composition: reproduced with the bare field. It also affects the isolated nph-tooltip (its CSS), which is the target of another batch: do not count twice.
- User impact: part of the explanation disappears or lands on the content below.
- Suggested fix: switch to `overflow: auto`/remove the height limit, or `max-block-size: none` and let the width limit it. If the limit is intentional, validate `info` by size and warn in dev.
#### [P2] Help turns into error with a height jump, and the counter drops to another line
- Problem: help is 12/16 px, error is 14/20 px. When the error appears, the field grows 4 px (`Nome` (Name): 84 to 88 px on leaving the field with an invalid value, Reactive Forms flow tested). With a counter, the error and the counter stop sharing the line: the counter moves to a second line on the right, +20 px (84 to 104 px, `Erro + contador` (Error + counter)).
- Where: `/field`, 1024 and 375 (`shots/auditoria/field/detalhe-partes-1024.jpg`, `Com erro` (With error) and `Erro + contador`).
- Cause: component (`.message--error` with `flex-direction: column`, gap 4 px; different typography between help and error).
- User impact: the form shifts on validation; someone clicking Submit may see the target move. The counter loose below the error reads as another message.
- Suggested fix: reserve the error's height (min-height of 20 px on the message line) or use 12/16 on the error too with weight 500; keep error and counter on the same line with `justify-content: space-between` (error wraps to the left).
#### [P2] Label line grows 4 px when there is info and is misaligned side-by-side fields
- Problem: the info button is 24 px tall and the label line goes from 20 to 24 px.
- Where: `/field` at 1024 (`shots/auditoria/field/detalhe-partes-1024.jpg`): the `Com info` control sits 4 px below the `Com ajuda` (With help) control on the same grid row. Measured: label 20 px without info, 24 px with.
- Cause: component (`nph-label__info` enters the flow at 24 px).
- User impact: in a form with columns, controls on the same row end up uneven (only because of the info icon).
- Suggested fix: give `min-height: 24px` to every label line in the field, or compensate the button with a negative margin of 2 px above and below.
#### [P2] Error message is not in a live region
- Problem: `.message` has no `role="alert"` or `aria-live`; the error reaches the screen reader only through `aria-invalid` and `aria-describedby` on the control, that is, when focus returns to the field.
- Where: `/field`, markup of `.message--error` (no role/aria-live).
- Cause: component.
- User impact: with errors that appear on validation at submit or on leaving the field, screen reader users do not hear the message while focus is elsewhere.
- Suggested fix: `role="alert"` (or `aria-live="polite"`) on the error span. Not verified with a real screen reader.
**Composition (short)**: `.col { align-items: flex-start }` and `.stack-wide` (max 480) mix widths on the same screen at 375: loose input 280, field 320, button `Enviar nativo` (Submit native) 343. Use `align-items: stretch` and `width: 100%` on the stacks' controls.
**Positives**: blue focus ring 3.68:1 on white in light (light blue in dark); long texts (label, help, error, word without spaces) wrap without overflow at 375 (`detalhe-textos-longos-375.jpg`, document `scrollWidth` 375); help/counter/error 6.69:1 in light and 9.81/5.01:1 in dark.
**Not verified**: screen reader; `required` on a radio group; tab order in long forms; disabled fieldset with dynamic switching.

### label (route `/label`)

**Summary**: Text 14/20 at 21:1, red asterisk at 6.88:1, clicking the text focuses nph-input, nph-textarea and nph-select via `for` (also tested inside the field). Correct line wrapping in a narrow column. The only relevant problem is the same as the field's (info on touch). Grade A-.
**Heuristics (0–4)**: Consistency 4 · Recognition 3 (info on touch: 1).
**Findings**
#### [P2] "i" icon next to a multiline label is centered on the block's height
- Problem: in a 3-line label the "i" sits in the middle of the block, not on the first line; the asterisk sits at the end of the text.
- Where: `/label` at 375 (`shots/auditoria/label/375.jpg`, `Texto bem longo...` (Very long text...)).
- Cause: component (probably `align-items: center` on the label line; the CSS was not inspected).
- User impact: slight; the icon moves away from the start of the label and sits far from the beginning of the sentence it explains.
- Suggested fix: `align-items: flex-start` with an adjusting `margin-block` for the 24 px button.
**Positives**: `for` association works with nph-input, nph-textarea, nph-select (clicking the text focuses the control).
**Not verified**: dynamic `for` in a real flow; screen reader.

### input (route `/input`)

**Summary**: Visually clean and consistent field (28/36/44), clear states (invalid with 6.88:1 border, disabled legible at 50 % opacity with `muted` background), strong focus. Touch problems (24 px clear target, 14 px font) and a fixed width that does not shrink. Grade B+.
**Heuristics (0–4)**: Visibility of status 4 · Control and freedom (clear with focus back to the field) 4 · Error prevention 3 · Consistency 4.
**Findings**
#### [P2] Fixed width of 280 px with no `max-width`: does not shrink outside the field
- Problem: nph-input, nph-textarea, nph-select, nph-combobox have `width: 280px; max-width: none` on the host and nph-input-otp 256 px (default) or 304 px (large). In a narrower container the control overflows. Inside nph-field the control takes 100 % of the field's width (320 px, `max-width: 100%`) and shrinks.
- Where: isolated test in a 240 px div: input right 289 > container 249 (`shots/auditoria/input/detalhe-estreito.jpg`). OTP large in a 320 viewport with 16 px gutter: 304 > 288 (`shots/auditoria/input-otp/detalhe-large-320.jpg`). At 375 with a 16 px gutter nothing overflows (document 375, no horizontal overflow in `metrics.json`).
- Cause: component (token `layout/input-width`, no relative ceiling). Effect aggravated by the `.col` composition (flex-start).
- User impact: form on a 320 px phone, in modals or narrow columns, leaves the screen. Also, the same control measures 280 loose and 320 in the field.
- Suggested fix: `max-width: 100%` on the host and `width: min(var(--nph-layout-input-width), 100%)`; equalize field-width and input-width; in the OTP let the cells shrink (`flex: 1; max-width: 44px`).
#### [P2] Clear button target is 24x24 px at any size
- Problem: the clear X measures 24x24 px (passes WCAG 2.5.8, below 44 px) including on 36 and 44 fields; on large it stays 24 (input and combobox).
- Where: `/input` 375, `Busca` (Search); keyboard focus correct (ring around the 24 px target, `shots/auditoria/input/detalhe-foco-limpar.jpg`). Enter clears and returns focus to the field (tested).
- Cause: component (token `clear_target`: icon/size-sm + space/inline-tight).
- User impact: on touch it is a small target hugging the field's border.
- Suggested fix: at `size="large"`, a 44 px touch area (padding on `button.clear` itself, 16 px icon kept).
#### [P2] 14 px font on the native input, including at `size="large"` (iOS zoom)
- Problem: the inner `<input>` uses 14/20 px at all sizes (input, textarea, combobox and OTP). Safari iOS automatically zooms on a field with less than 16 px on focus.
- Where: measured at 375 on `/input`, `/textarea`, `/combobox`, `/input-otp`: `fontSize 14px` on all; the app's `<meta viewport>` without `maximum-scale`.
- Cause: component.
- User impact: on iPhone the page is magnified on focus and does not return by itself. Not verified on a real device (known WebKit rule).
- Suggested fix: 16 px at `size="large"` (size indicated by the sheet for touch) or `font-size: max(16px, ...)` on `pointer: coarse`.
**Composition (short)**: demos use `.col` (flex-start) and `.stack-wide`; at 375 the fields end up 280/320/343 wide in the same column.
**Positives**: placeholder 6.69:1 over value 21:1, distinguishable; disabled with muted background and border kept; focus ring visible in light and dark.
**Not verified**: hover with mouse; large with start icon; numeric keyboard/autofill.

### textarea (route `/textarea`)

**Summary**: Grows from 76 px (2 lines) to 216 px (about 10 lines) and scrolls inside; no resize handle; footer with counter and actions aligned and legible at 375. readonly has no footer. No problems of its own. Grade A-.
**Heuristics (0–4)**: Visibility of status 4 · Control 3 · Consistency 4.
**Findings**
#### [P2] Fixed width of 280 px as in the input
- Problem and cause: same as the input (`width: 280px`, no `max-width`). Confirmed in a 240 px div: 280 px, overflows.
- Where: `/textarea` isolated test; no overflow at 375.
- Suggested fix: see input.
**Positives**: automatic growth with `field-sizing: content` (216 px max; `scrollHeight 416`, scrolls inside, demo `Cresce` (Grows)); disabled/readonly/invalid states distinct; counter at 12 px/6.69:1.
**Not verified**: Firefox/Safari without `field-sizing`; caret and scrolling with the virtual keyboard open.

### input-otp (route `/input-otp`)

**Summary**: One cell per character, clear per-cell focus (active cell with blue ring, `detalhe-foco-digitado-1024-light.jpg`), `autocomplete="one-time-code"`. At 375 it fits (256/304 px). What is missing is a numeric keyboard on phones. Grade B+.
**Heuristics (0–4)**: Visibility of status 4 · Error prevention 2 · Efficiency 2 (keyboard).
**Findings**
#### [P2] Phone keyboard always alphabetic (`inputmode="text"`)
- Problem: the inner native input has a fixed `inputmode="text"` and the sheet lists "a digits-only mode" as not created. The declared use case is typing the SMS code on a phone.
- Where: `.native` markup on `/input-otp`; nph-input-otp sheet ("a way to restrict the field to digits" under "Do not create without a decision").
- Cause: component.
- User impact: on a phone the letter keyboard opens for a numeric code; more taps and more errors.
- Suggested fix: a `numeric` (or `inputmode`) property forwarded to the inner `<input>`, with `pattern="[0-9]*"`.
#### [P2] Cell width does not shrink (large = 304 px)
- Problem and cause: see input (fixed width). In a 320 viewport with 16 px gutter the large OTP (304) overflows by 16 px.
- Suggested fix: flexible cells with a 44 px ceiling.
**Positives**: clear and visible focus in light and dark; empty, filled and active cell distinguishable; `metrics.json` without overflow at 375.
**Not verified**: pasting a code; screen reader; SMS autofill on iOS.

### select (route `/select`)

**Summary**: 36/44 px trigger, list at the same size as the trigger, flips upward when it does not fit (tested with the trigger at y=100, 600 and 720 in an 812 viewport: side `bottom`, `top`, `top`), touch scrolling works inside the list, selected option with mark and tint, gray hover. Grade B+.
**Heuristics (0–4)**: Visibility of status 4 · Recognition 3 · Consistency 3 · Error prevention 3.
**Findings**
#### [P2] `size="large"` guarantees 44 px only on the trigger; the options stay at 36 px
- Problem: the list rows measure 36 px on the large select too.
- Where: `/select` at 375, `large`: trigger 44, options 36,36 (measured); long list `shots/auditoria/select/detalhe-lista-375-Pas.jpg`.
- Cause: component (sheet: "large guarantees 44 px", but only the trigger).
- User impact: on touch, choosing an option is a smaller target than the trigger; passes 2.5.8 (24 px), not 44.
- Suggested fix: option height of 44 px when the list owner has `size="large"`.
#### [P2] A list of 30 items shows exactly 8 whole options, with no scroll hint
- Problem: the `max-list-height` limit ends at the eighth option; there is no half row in view to show that there are more items (the `Mistura` (Mixed) combobox shows the cut and it is clear).
- Where: `/select` at 375, `Lista longa` (Long list) (`detalhe-lista-375-Pas.jpg`); scroller `overflow-y: auto`, `scrollHeight 1088 > clientHeight 296`.
- Cause: component (decision D9, 8 whole options). On phones the scrollbar is overlaid and disappears.
- User impact: may think the list only has 8 countries.
- Suggested fix: a height of 7.5 options, or a shadow/gradient at the list's foot while there is more content.
**Positives**: correct flip and positioning at 375 (`detalhe-flip-600.jpg`); selection and hover distinct and with contrast (`detalhe-lista-estados-light.jpg`); invalid/disabled consistent with input.
**Not verified**: virtual keyboard open over the list; select inside a modal; page scrolling closes the list on reaching the end of the list's scroll (observed once, not investigated).

### option (route `/option`)

**Summary**: Label and secondary text on a single line with ellipsis; 36 px area; clear states. Problem: long text truncated with no way to read it. Grade B.
**Heuristics (0–4)**: Consistency 4 · Recognition 3.
**Findings**
#### [P2] Long option text is cut with an ellipsis, with no title or wrapping
- Problem: at 375 the option `Um texto de opção bem longo para ver como...` (A very long option text to see how...) is cut off (`para ...`) and the chosen value is also truncated on the trigger; no `title`/tooltip and no second line.
- Where: `/option` at 375 (`shots/auditoria/option/detalhe-texto-longo-375.jpg`, `detalhe-valor-truncado-375.jpg`); chosen value on the trigger: `.value` scrollWidth 738 against clientWidth 221, `text-overflow: ellipsis`, no `title`; ellipsis visible in the capture; sheet D3 defines a single line with ellipsis.
- Cause: component (design decision D3). The page puts the long option in a 280 px select, but the cut comes from the component.
- User impact: options that differ only at the end of the text become indistinguishable.
- Suggested fix: `title` with the full text, or allow 2 lines in the option (min-height 36 px, `line-clamp: 2`) when the text does not fit.
**Positives**: selected option with tint and mark; disabled option clearly dimmed; start of the text always legible.
**Not verified**: `start=avatar` with a broken photo; contrast of the status dot.

### combobox (route `/combobox`)

**Summary**: Filter by typing, list with groups, separators, avatar and an empty state with an illustration. At 375 the list has the same width as the field (280), opens below the field and shows half a line at the end (`Segurança...`, a scroll hint). Grade B+.
**Heuristics (0–4)**: Visibility of status 4 · Prevention/recovery 3 (empty state with title and description) · Consistency 3.
**Findings**
#### [P2] 24 px clear button and fixed 280 px width
- Problem and cause: same as input (24x24 clear measured on the large combobox; `width 280`, no max-width).
- Suggested fix: see input.
#### [P2] Option with 36 px height on touch
- Problem: same situation as select (rows of 36 px; the large size does not enlarge the list).
- Where: `/combobox` 375, `Mistura` (`shots/auditoria/combobox/detalhe-mistura-375.jpg`). Measured on `nph-option` in the combobox's shadow root: 36, 36, 36, 36, 36 and 40 px (the latter with secondary text).
- Cause: component (reuses nph-option).
- Suggested fix: see select.
**Positives**: clear empty state with title and description (`detalhe-vazio-375.jpg`); groups and separators legible; focus returns to the input, error/placeholder at 6.69:1.
**Not verified**: list with the virtual keyboard open; server search with loading (page read only); `creatable`.

### multi-combobox (route `/multi-combobox`)

**Summary**: good in states, focus, keyboard and long text; the weak point is the fixed width of 420px, which causes horizontal page overflow at 375, 768 and 1440. Overall grade B.
**Heuristics (0–4)**: Visibility of status 4 (chips, counter, focus of the remove button with its own ring); Error prevention 3; Consistency/standards 3 (fixed width stands out from the other fields, which stretch); Recognition 3 (truncated chip without a tooltip).

**Findings**
#### [P1] Fixed width of 420px, no 100% cap: overflows any smaller container
- Problem: the field has a fixed `inline-size` at `layout/multi-combobox-width` (26.25rem = 420px) and nothing limits it to the container. In a 300px container the field stays at 420px and sticks out on the right. At 375, Chrome in mobile mode widens the layout viewport to 436px to fit the field and shrinks the page (`metrics.json`: `vw` 436, `overflowX` false), so there is no sideways scroll, but the page ends up ~14% smaller and the field exceeds the 343px container by 77px (reflow failure); real horizontal scroll shows up at 768 and 1440.
- Where: `/multi-combobox`; `shots/auditoria/multi-combobox/375.jpg`, `768.jpg`, `1440.jpg`; isolated in `shots/auditoria/multi-combobox/detalhe-largura-fixa.jpg`. `metrics.json`: docScrollW 436 (375), 816 (768), 1510 (1440). Measured hosts outside `nph-field` that exceed their parent: 15 of 17 at 375, 4 at 768, 1 at 1024, 2 at 1440.
- Cause: both. Component: internal CSS `:host([data-nph-rendered]){display:inline-flex;inline-size:var(--nph-layout-multi-combobox-width);min-inline-size:0}`, without `max-inline-size:100%`. Isolated test: a 200/300px container gives a 420px host (overflow), a 420/600 container gives 420 (does not stretch); with `width:100%` on the host the field becomes 300px; inside `nph-field` the field stretches on its own (host = 300px). The sheet says "the consumer stretches it", but the unstyled default breaks on narrow screens. Composition (the validation app's own markup/CSS): `.grid2` uses `minmax(320px,1fr)` with 4 bare fields (334px cell, 420px field) and `.stack-wide` is 343px at 375; none of them sets `width:100%`.
- User impact: on a phone, the page is shrunk or the field appears cut off; at 768 and 1440 the page scrolls sideways and the fourth column goes past the window. Reflow violation (WCAG 1.4.10).
- Suggested fix: component: `:host{max-inline-size:100%}` (or `inline-size:min(var(--nph-layout-multi-combobox-width),100%)`), keeping 420px as the preferred width. Composition: `nph-multi-combobox{width:100%}` in the `.grid2`/`.stack-wide` containers, or always use it inside `nph-field`.

#### [P2] Truncated chip in the field does not show the full text
- Problem: with long text the chip cuts off with an ellipsis (correct), but the label has no `title` or tooltip. The standalone `nph-chip` shows a tooltip on hover and on focus; the multi-combobox's internal chip does not.
- Where: `shots/auditoria/multi-combobox/detalhe-chip-longo.jpg` (isolated in a 340px container, 80-character option: 266px chip, `Universidade Federal de Pernamb…`). Chip markup: `<span class="chip-label">` with no attributes.
- Cause: component (inconsistency with `nph-chip`, which also differs visually: the field's chip has a background (235,242,254), blue label and 24px; `nph-chip` has a background (216,230,253), black label and 28px).
- Impact: people with a mouse or normal vision only see the full name by opening the list; the screen reader reads the full name in the `aria-label` of the remove button, so the harm is visual.
- Suggested fix: `title` on `.chip-label` when truncated, or the same `nph-tooltip` as `nph-chip`.

#### [P2] One Tab per remove button before reaching the text
- Problem: with 7 chips there are 7 Tab stops just to get across the field (the sheet documents it: "Tab reaches each remove button, before the text field").
- Where: `/multi-combobox`, demo `Muitos chips`. Measured: each `.remove` has `tabindex=0`, and the `input` comes after.
- Cause: component (documented design decision, real cost for keyboard users).
- Impact: keyboard users in a field with many choices spend many Tabs; the target of each X is 24x24 (passes WCAG 2.5.8, below 44).
- Suggested fix: roving tabindex between the remove buttons (a single Tab stop, arrows move), or initial focus on the text.

**Positives**: keyboard focus on the X with a ring only on the button (24x24; `shots/auditoria/multi-combobox/detalhe-foco-remover.jpg`), open list with correct focus border and halo in light/dark (`ArrowDown` opens, focus on the text); chip text with contrast 4.78 (light), 13.79 (dark), 4.64 (`educacao`); field border 3.23:1 (light) and 6.58:1 (dark); `large` and `counter` keep a single line, `counter` with a long subject truncates with an ellipsis; focus after removing an X lands on the button that takes its place (doc).
**Not verified**: invalid state with focus, open list at 375 (popup width), Home/End/PageDown inside the field, removal by keyboard and where focus goes.

---

### checkbox (route `/checkbox`)

**Summary**: good. Whole row clickable, clear focus in dark and `educacao`, distinct states. Weak points: long text without word breaking and pale focus in light. Grade B+.
**Heuristics (0–4)**: Visibility of status 3; Error prevention 3; Consistency 3 (radio and switch break a long word, checkbox does not); User control 4.

**Findings**
#### [P2] Long word without a space overflows the row and the page (radio and switch do not)
- Problem: text with no break point (URL, code, long email) does not wrap and goes past the container.
- Where: `shots/auditoria/checkbox/detalhe-texto-longo.jpg` (the second item leaves the dashed box) and `shots/auditoria/radio/detalhe-texto-longo.jpg` (same text, wrapped). At 375 with a 200px container: `.text` with `clientWidth` 168 and `scrollWidth` 442; `documentElement.scrollWidth` 474 (viewport 375).
- Cause: component. `getComputedStyle(.text)`: checkbox `overflow-wrap: normal`; radio and switch `overflow-wrap: anywhere`. Isolated test, with none of the validation app's CSS.
- User impact: horizontal page scroll when the label has a long token; ordinary text (sentences) wraps well and keeps the box at the top.
- Suggested fix: `overflow-wrap:anywhere` on the checkbox's `.text`, as in the other two.

#### [P2] 24px targets and a group with 4px between options
- Problem: the whole row (box, space and text) is clickable, but it is 24px tall; in `nph-field` the options sit on a 28px pitch (24px + 4px). On a phone, a tap between two neighboring options misses easily.
- Where: `/checkbox`, demo `Grupo de opções`; 375 and 1024. Measured: host 24px tall; pitch 28px; a click on the text, on the box and on the space between them checks; a click 3px above or below does not check.
- Cause: component (24px target and `nph-field` gap by design; passes WCAG 2.5.8 AA, far from 44px). The page uses `.col` with `gap:12px` in the other demos, with no problem.
- User impact: acceptable on desktop; tight on touch.
- Suggested fix: larger gap between group options in `nph-field` (e.g., `space/stack-tight` instead of 4px) or a touch variant with a 44px row. It also applies to radio and switch.

#### [P2] Weak focus ring in light
- Problem: in the light theme the focus is a 1px `#3b82f6` border (contrast 3.68:1 on white) and a `#d8e6fd` halo of 1.26:1. The halo, which is what draws attention, nearly disappears; in dark (border `#89b4fa`, 8.98:1) and `educacao` (border `#99651b`, 4.96:1, halo `#ffcb81`) it is much more visible.
- Where: `shots/auditoria/checkbox/detalhe-foco.jpg` (light, dark, `educacao` side by side); same token in radio, switch and slider.
- Cause: component (tokens `focus/border` and `focus/halo` of the light theme).
- Impact: passes 2.4.7 and 1.4.11 through the 1px stroke, but it is the worst case among the themes for people with low vision.
- Suggested fix: light halo with more contrast (around `#9cc0fb`), or a 2px focus border.

**Positives**: clear states in light/dark/`educacao` (`shots/auditoria/checkbox/detalhe-estados.jpg`); `disabled` loses the opacity and drops out of the Tab order; indeterminate dash distinct from the check; switching the box to invalid keeps the red outline (6.88:1 on white) in light and `educacao`.
**Not verified**: hover; animation with `prefers-reduced-motion`; screen reader.

---

### radio (route `/radio`)

**Summary**: very good. Exemplary group keyboard behavior and correct long-text wrapping. Grade A-.
**Heuristics (0–4)**: Visibility of status 3; Error prevention 4 (does not uncheck on a second click); User control 4; Consistency 4.

**Findings**: none of its own. The two checkbox findings apply here: the 24px target with a 28px pitch in the `nph-field` group (measured: `Plano`, pitch 28) and the pale focus halo in light (`shots/auditoria/radio/detalhe-foco.jpg`).

**Positives**: Tab enters the group once, arrows move and check, skip the disabled option and wrap around (A, B, C, E, A, measured); long text and a long word wrap inside the container and the circle stays aligned to the top (`detalhe-texto-longo.jpg`); the whole row is clickable.
**Not verified**: radio with a missing `name`; group inside a `fieldset disabled` on touch.

---

### switch (route `/switch`)

**Summary**: good and simple. Clear states, 40x24 track, Space and Enter toggle it on. Grade A-.
**Heuristics (0–4)**: Visibility of status 3 (on/off by color and button position); Control 4; Consistency 3.

**Findings**: none of its own. Same two points as checkbox: 24px target with a 4px gap in a group (`nph-field`, pitch 28) and pale halo in light (`shots/auditoria/switch/detalhe-foco.jpg`).

**Positives**: whole row clickable (text, space and track); off track 3.23:1 on white; invalid visible (red border) and `disabled` more faded; long text wraps (`overflow-wrap:anywhere`).
**Not verified**: `disabled + checked` in `educacao` with a screen reader; transition.

---

### slider (route `/slider`)

**Summary**: visual and keyboard behavior are good, but there are three real usability problems (focus stolen on load, value changed when scrolling the page on a phone, numeric field squeezed at the default width). Grade C.
**Heuristics (0–4)**: Visibility 3 (bubble with the value on focus); User control and freedom 1 (value changes unintentionally); Error prevention 1; Consistency 2 (fixed width of 280px).

**Findings**
#### [P1] The first `nph-slider` on the page steals focus and scrolls the page to it on load
- Problem: when opening any page with a slider, the first thumb is already focused, the value bubble appears open and, if the slider is below the fold, the browser scrolls to it.
- Where: `/slider` (`Brilho` opens focused, visible in `shots/auditoria/slider/375.jpg`); test with the slider pushed 2500px down: `scrollY` goes to 2350 on its own. It also happens on the SPA navigation from `/checkbox` to `/slider`. Checkbox, chip and multi-combobox: `document.activeElement` is `BODY`.
- Cause: component. `nph-slider.js` renders the first thumb with `?autofocus=${index === 0}` (a comment says it serves click-on-label via `delegatesFocus`). Chrome treats the attribute as a document autofocus. No `.focus()` call in the validation app (grep in `src/app`).
- User impact: keyboard and screen reader start reading at the slider; the page jumps; the initial focus of a form goes to the wrong place.
- Suggested fix: remove `autofocus` from the thumb and handle the click on the label with a programmatic `focus()` in the label handler.

#### [P1] Scrolling the page with a finger over the track changes the value
- Problem: a vertical scroll gesture that starts on the track fires `input` and `change` with the value of the finger position, and then the page scrolls. The value changes without the person wanting it.
- Where: `/slider` at 375 with touch (CDP). Vertical swipe starting at 85% of the track: page scrolled 81px, value 40 went to 85, events `input:85`, `change:85`. A simple tap at 20% gives 20, correct.
- Cause: component. The track has `touch-action: pan-y` (correct, allows scrolling), but `pointerdown` already commits the value right away, without waiting to know whether it turns into a scroll.
- User impact: on a phone, when scrolling a form with sliders, the value changes and fires `change` (which in Angular writes to the FormControl).
- Suggested fix: with `pointerType==='touch'` on the track (outside the thumb), commit the value only on `pointerup` without `pointercancel`; the thumb (`touch-action:none`) stays as it is.

#### [P1] With `inputs` + `steppers` + `limits` at the default width (280px) the numeric field becomes unreadable
- Problem: the numeric field has 9px of usable width and shows `7` for 75 and `1` for 100; the track drops to 104px.
- Where: demo `Tudo junto` on `/slider`, any width (the slider does not stretch: `.col` uses `align-items:flex-start`); `shots/auditoria/slider/detalhe-inputs-280.jpg`. Measured: `nph-input` 35px host, `inputClient` 9px, `inputScroll` 16/24px.
- Cause: both. Component: the combination is offered in the API, but the default width (`layout/input-width` = 280px) does not accommodate it and the field has no minimum width. The sheet says the width can stretch with no minimum. Composition: the validation app's page does not stretch the slider. Isolated with `inline-size:100%` in a 460px container: track 239px, field 54px, value `75` legible.
- User impact: the person cannot read or check the typed value.
- Suggested fix: component: `min-inline-size` on the numeric field (3 to 4 digits) and let the track shrink, or a larger default width when `inputs`+`steppers` are present. Composition: `nph-slider{width:100%}` in the demos with a 460px container.

#### [P2] `invalid` shows up only as a 1px border on the thumb
- Problem: in invalid the track and the fill stay in the primary color; only the thumb border turns red. In `educacao` (brown primary) it looks almost the same as normal.
- Where: `shots/auditoria/slider/detalhe-invalid-edu.jpg` (`educacao`) and 1024-dark.
- Cause: component (CSS rule `:host([invalid]) .thumb`).
- User impact: without the `nph-field` message nobody notices the error (the sheet already warns about it).
- Suggested fix: also paint the track fill with `status/error`.

**Positives**: the thumb's touch target is larger than the 16px visible: `::before` of 44px (`control/height-large`); dragging starting 14px above the center works and horizontal dragging moves the value (40 to 69) without scrolling the page (`touch-action:none` on the thumb, `pan-y` on the track). Vertical works with `pan-x`. Focus opens a bubble with the value.
**Not verified**: Home/End/PageUp/PageDown, range mode with touch, `prefers-reduced-motion`.

---

### avatar (route `/avatar`)

**Summary**: good and quiet. Sizes 24/32/40, photo or icon, a broken image becomes an icon with no error text. Grade A-.
**Heuristics (0–4)**: Visibility 3; Consistency 4; Error recovery 4 (broken photo becomes an icon).

**Findings**: none from the component. Known design limit: without a photo there is only a person icon, so several avatars without photos look identical (the names next to them solve it). Short composition note: `/avatar` uses `label="Ana Souza"` next to the name in text (the screen reader reads it twice); in the people list the avatar should be decorative.

**Positives**: icon with contrast 5.76:1 in light/`educacao` and 6.6 in dark (icon over the avatar's `muted` background); `role=img` with `aria-label` only when there is a label.
**Not verified**: photo loading slowly (network), non-square photo.

---

### avatar-stack (route `/avatar-stack`)

**Summary**: good. "+N" legible and the counter grows with the number. Grade A-.
**Heuristics (0–4)**: Visibility 3; Consistency 4; Recognition 2 (the names of those left over do not appear).

**Findings**: none from the component. Measured the counter with +9, +99, +100, +1234 in the three sizes: 12px (sm, md) and 14px (lg), `#5c5c5c` on `#ededef` = 5.76:1; the box grows from 25px to 46px without cutting the text; in the dark and `educacao` themes it keeps the contrast (`shots/auditoria/avatar-stack/detalhe-contador.jpg`). No overflow at 375.

**Positives**: host `role=img` with the group's `aria-label`, children `aria-hidden`; counter aligned in all sizes.
**Not verified**: stack without `count` with more than 5 children at 375; overlap in RTL.

---

### badge (route `/badge`)

**Summary**: very good. Contrast verified in 196 combinations (7 severities x 2 emphasis x 2 schemes x 7 brands): none below 4.5:1, minimum 4.64:1 (primary light, light/`educacao`), which confirms the sheet. Fixed height of 24 px, 12 px text, on a single line. Weakness only with long text. Grade A.
**Heuristics (0–4)**: Visibility of status 4; Consistency 4 (same height/radius in all combinations); Error prevention 2 (long text is not contained).

**Findings**
#### [P2] Long text neither truncates nor wraps: the badge spills out of the container
- Problem: `text` with more than one or two words (the sheet asks for 1–2) stays in `white-space: nowrap`, with no `max-width` or ellipsis. `Aguardando aprovação do gestor responsável` (Awaiting approval from the responsible manager) takes 305 px (325 px with an icon) in a 142 px container; a 60-character text takes 429 px. Inside a flex row, the badge does not shrink (it ended up at 83 px next to a truncated text), so it pushes the rest.
- Where: `/badge`, isolated test created by `page.evaluate` at 375 px; `shots/auditoria/badge/detalhe-longo.jpg`.
- Cause: component. Isolated test in a 140 px div, without app CSS: `nowrap`, width 305 px, `overflow: true`.
- User impact: with status coming from the backend in Portuguese (long labels), the badge goes past the edge on narrow screens and causes horizontal page scroll.
- Suggested fix: `:host { max-width: 100%; }` with `.text { overflow: hidden; text-overflow: ellipsis; }` and `title`/accessible name with the full text.

**Positives**: contrast 4.64–16.3:1 in all brands and schemes (`badge-contrast.json` in the batch's scratchpad); icon in the text color, no broken gap (`/badge` 1024.jpg); empty text takes no space.
**Not verified**: in `educacao`, primary solid (#99651B, hue ~35°) and warn solid (#BB460A, ~20°) are both warm and close; not tested with color-blindness simulation (the severity text still distinguishes them). In dark, `emphasis=light` has a background of 1.02–1.24:1 against the page (measured across the 7 severities in `sistemas` and `educacao`): it becomes practically only text, the "pill" disappears (legible, but only the text signals). Visual reference: `badge/detalhe-educacao-light.jpg` (primary x warn in `educacao`).

---

### chip (route `/chip`)

**Summary**: good. High contrast in all themes, long text with ellipsis and a tooltip on hover and on focus. Weaknesses: selectable affordance and focus lost after removing. Grade B.
**Heuristics (0–4)**: Visibility of status 3; Consistency 2 (X means remove on one chip and "checked" on another); User control and freedom 3; Recognition 3.

**Findings**
#### [P2] Selectable, removable and readonly chips look the same at rest; the "selected" X looks like it removes
- Problem: with no selection, the selectable chip is a light-blue pill with an outline, the same as the default removable chip (without the X) and the `readonly` one; nothing indicates it is clickable. When selected, it shows an "X" (`xmark`) as the mark, but clicking toggles it on and off, it does not remove.
- Where: `/chip`, demos `Selectable` and `Estados`; `shots/auditoria/chip/detalhe-estados.jpg`. Measured: `readonly`, default removable and unselected selectable have the same background (216,230,253) and the same black label; the selected mark is `<nph-icon name="xmark">`.
- Cause: component (sheet decision: "the X is a mark"; reliance on color and cursor).
- User impact: selectable filters are discovered only by trial; the selected X misleads anyone who expects to remove the chip.
- Suggested fix: use `check` as the selected mark, or a stronger outline on the unselected selectable; keep `xmark` only on the removable.

#### [P2] After removing a chip by keyboard the focus goes to the `body`
- Problem: Enter on the X removes the chip (the validation app's list) and the focus falls on `BODY`.
- Where: `/chip`, demo `Removable`. Measured: `document.activeElement` is `BODY` and the list has 2 chips.
- Cause: both. The chip does not remove itself (documented decision), so it has no way to move the focus; the validation app's page does not move it either. The multi-combobox already solves this internally.
- User impact: keyboard users lose their place and return to the top of the page.
- Suggested fix: component: document or offer the event with what to focus; composition: focus the next chip or the list after `remover()`.

**Positives**: label contrast between 4.96 and 18.4:1 in light, dark, `educacao` and dark `educacao`, including severities; long text cuts at 224px with an ellipsis and the full text appears on hover and on focus (`shots/auditoria/chip/detalhe-texto-longo.jpg`); 24x24 X with a visible ring; disabled and readonly distinct.
**Not verified**: chip with avatar in `educacao`, touch on the X at 375 (24px inside 28px; passes 2.5.8, below 44px).

---

### icon (route `/icon`)

**Summary**: good. Sizes sm/md/lg measured at 16/20/24 px, legible; at `sm` the light variant has a stroke of about 1 px, still recognizable. Color really inherited (crimson, token, muted, fixed dark background). Grade A-.
**Heuristics (0–4)**: Consistency 3 (host box x glyph width); Recognition 4.

**Findings**
#### [P2] The host box is square, but the glyph has its own width and spills out
- Problem: the host measures 16/20/24 px square, but the inner `<svg>` has a width derived from the viewBox: 5, 12.5, 15, 17.5, 20, 22.5 and 25 px at `md` (across the 101 names x 2 variants). `overflow` is `visible`. The star, for example, is 22.5 px in a 20 px host: 1.25 px left over on each side; wide icons reach 25 px.
- Where: `/icon`, grid `Todos os nomes` (1024); `shots/auditoria/icon/detalhe-tamanhos.jpg`.
- Cause: component (`inline-flex` host with a fixed side; svg centered without `width: 100%`/`object-fit`). Measured in the shadow root of each `nph-icon`.
- User impact: irregular optical alignment when wide and narrow icons sit side by side (toolbar, menu) and a 1–2 px collision with the neighboring text.
- Suggested fix: fix the svg at `width: 100%; height: 100%` with `preserveAspectRatio="xMidYMid meet"`, so the glyph fits in the box of the `icon/size-*` token.

**Positives**: color through `currentColor` correct in dark and light (`detalhe-cor-dark.jpg`; muted-foreground 6.69:1 light and 9.81:1 dark); light and solid legible in all sizes.
**Not verified**: brand icon in dark/`educacao` (`token primary` gives 3.81:1 as an icon, passes 3:1 but not 4.5:1 if used as text; it is the consumer's choice).
**Composition (short)**: in the demo `Cor por currentColor` the icon touches the text (gap 0, `detalhe-cor-dark.jpg`, `fundo escuro fixo`); the sheet delegates the spacing to the container, so it belongs to the page.

---

### image (route `/image`)

**Summary**: loading is good (centered spinner, fixed frame in the four states) and `interactive` has hover with a veil and a clear focus ring. The problem is the error and empty state: they are identical and carry no information. Grade C+.
**Heuristics (0–4)**: Visibility of status 2 (loading ok, error invisible); Error recovery 1; Error prevention 3; Consistency 3.

**Findings**
#### [P1] Error and empty are the same gray square, with no icon, text or action
- Problem: with a broken `src` (404), empty, only spaces or missing, the user sees exactly the same gray frame with a border. In `interactive` + error, the gray frame remains clickable (internal button, tabindex 0) with no hint that it failed or that it can be clicked. The sheet admits it ("illustrations pending", "the text is left to the parent"), so today the `error` state is not distinguishable from "no image yet".
- Where: `/image` `Estados`, 1024; test with a delayed request (loading) x 404 x empty in `shots/auditoria/image/detalhe-estados-light.jpg` and `detalhe-estados-dark.jpg` (in dark the frame becomes dark gray, also without an icon); error shadow root: `<img hidden> + <span class="border">` and nothing else.
- Cause: component. Shadow root inspected: in the `error` state only `img[hidden]` and `.border` exist; in `empty`, only `.border`.
- User impact: a product photo/avatar from a file that fails looks like "no photo" (empty) and there is no way to try again; on an upload/gallery screen this hides a network failure. Anyone relying on the `error` event to explain has to write the text by hand on each screen.
- Suggested fix: draw an icon on error (e.g., `image-slash`/`triangle-exclamation` from the core, `muted-foreground`) and another neutral icon on empty; expose `status` with an `aria-label` (`Imagem não carregou`, "Image did not load") on the host until the illustrations arrive.

#### [P2] `size="media"` is fixed at 256 px: it does not follow the container and overflows smaller containers
- Problem: in the three ratios the host measures 256 px (1:1 = 256x256, 4:3 = 256x192, 16:9 = 256x144) at 1440, 1024 and 375, even with a 360 px container (or 343 at 375). In a 200 px container the host stays at 256 px and spills out (isolated test). The introduction of the validation page (`image.page.ts`) says "fills the container width", but the sheet already fixes 256 px and the measurement matches it. `style="width:100%"` on the host works and keeps the ratio (300x169 in a 300 px container), but this is not documented.
- Where: `/image` `Tamanhos`, 1440/1024/375; `shots/auditoria/image/detalhe-media-estreito.jpg`.
- Cause: component (token `image/media-width` fixed at 256 px, host without `max-width: 100%`).
- User impact: cover/gallery/card (uses cited in the sheet) have a fixed size on a phone and do not fill the card on desktop; in a column narrower than 256 px the image spills out.
- Suggested fix: `:host([size=media]) { width: 100%; max-width: image/media-width-max; }` (or document `width:100%` as the way to use it) and `max-width: 100%` so it never spills out.

**Positives**: loading with a spinner and no border, constant area (`detalhe-estados-light.jpg`); `interactive`: Tab focuses, 4 px blue ring (rgb 59,130,246, ~3.7:1 on white) outside the photo and hover with a veil and an eye (`detalhe-foco.jpg`, `detalhe-hover.jpg`); `disabled` fades with no focus.
**Not verified**: reading of `status` by a screen reader; transition when swapping `src` at runtime (gray frame before the new image).
**Composition / nph-button (short)**: at 375 the `/image` page scrolls horizontally (397 px of scroll) because of the button with long text (`SÓ B: recarregar (válida, sem nenhum listener ligado)`, "ONLY B: reload (valid, with no listener attached)"). Isolated, the `nph-button` is 381 px in a 300 px parent, `white-space: nowrap`: it is a problem of the button component (button batch), made worse by the page's long text.

---

### kbd (route `/kbd`)

**Summary**: No layout or usability problems. Compact (24 px tall, 12 px font), legible in all themes, not focusable. Overall grade: A.
**Heuristics (0-4)**: Consistency 4; Minimalist aesthetics 4; Recognition 4.

**Findings**: none material. Measured: text 5.76:1 (light) and 6.61:1 (dark), identical in `educacao`; height 24 px (8 keys per row at 1024 and 375 without overflow: `metrics.json` shows `overflowX: false`); arrows and symbols (⌘ ⇧ ↵ ← ↑) legible. `Tecla muito longa para um atalho` ("Key too long for a shortcut") does not truncate (it widened the kbd): incorrect use anticipated in the sheet. `Alt F4` stuck together and `Ctrl+K` spaced apart depend on the container, by design.
**Positives**: `shots/auditoria/kbd/1024.jpg`, `1024-dark.jpg`: shortcut list aligned to the right, correct baseline inside a paragraph (`Pressione Ctrl + S`, "Press Ctrl + S"), the kbd does not steal focus on Tab (`Único foco`, "Single focus").
**Not verified**: reading by a screen reader (semantic `kbd`), high contrast.

---

### separator (route `/separator`)

**Summary**: Decorative and correct (1 px, `aria-hidden`), with the limitation of the vertical one's height. Overall grade: B.
**Heuristics (0-4)**: Consistency 4; Error prevention 2 (vertical disappears in `align-items:center` without a height); Aesthetics 4.

**Findings**

#### [P2] Vertical separator with a fixed height sticks to the top of the container (the host's `align-self: stretch` beats the parent's `align-items:center`)
- Problem: in the composed `barra de ações` (action bar) (flex row, `align-items:center`, 100 px container), the separator with `style="height:24px"` stays at `top:0` while the buttons stay at `top:32` (center): the line appears misaligned above the buttons. Without a height, it collapses to 0 and disappears ("flex row, `align-items:center`, no height").
- Where: `/separator` 1024, `Composições da ficha`; `shots/auditoria/separator/detalhe-vertical-altura-topo.jpg`.
- Cause: both. Component: the host declares `align-self: stretch` (measured `alignSelf: stretch`); with an explicit height the stretch does not center. Composition: the validation app's row has a 100 px container (stretched to match the card beside it); the misalignment does not appear in compact bars.
- User impact: the divider looks broken when the container is taller than the items.
- Suggested fix: component: accept `align-self: center` when there is an explicit `block-size` (e.g., `:host([style*=height]){align-self:center}`) or expose the `size`/`length` property; composition: give the separator `align-self:center`.

**Positives**: inside `nph-toolbar` the vertical separator takes the height of the children (36 px in the 36 bars, 44 in the large ones); horizontal fills the width in a block parent or flex column.
**Not verified**: line contrast per theme (decorative, exempt); invalid orientation (already covered by phase A).

---

### skeleton (route `/skeleton`)

**Summary**: works well as a shape placeholder: 16 px line, avatars at 24/32/40 px, identical to the corresponding `nph-avatar` (no layout jump when swapping), `@if` swap without flicker. The two weak points are the lack of a default height on `block` and the contrast/absence of motion. Grade B.
**Heuristics (0–4)**: Visibility of status 2 (weak); Error prevention 2 (block without a height disappears); Consistency 4 (parity with avatar).

**Findings**
#### [P2] `shape="block"` without a consumer height is 0 px and disappears without warning
- Problem: `<nph-skeleton shape="block">` inside a 200 px div measures 200x0. No error, no warning.
- Where: `/skeleton` `Formas`, 1024 (the empty space to the right of the 96 px block); measured: `bloco-sem-altura 200x0`.
- Cause: component (the sheet tells the consumer to provide the height, but the host has no default `min-height`/`aspect-ratio`). Test in the demo itself, with none of the validation app's CSS besides the parent's width.
- User impact: a screen that is loading shows a hole where the content goes, with no placeholder; this is only discovered by looking at the screen on a slow network.
- Suggested fix: `:host([shape=block]) { min-height: var(--nph-skeleton-block-min-height, 96px) }` or a dev warning when the computed height is 0.

#### [P2] Low contrast and no motion: the "loading" depends on the container
- Problem: the rectangle is #EDEEEF on white (1.16:1) in light and #2D333B on #0F1114 (1.48:1) in dark, the same in `educacao`; it is static (no pulse, `animation-name: none`). Nothing in the shape indicates activity; the announcement is only `aria-busy` on the parent (which the consumer has to remember to set).
- Where: `/skeleton` card in loading, light/dark; `shots/auditoria/skeleton/detalhe-card-light.jpg`, `detalhe-card-dark.jpg`.
- Cause: component (by design: "low contrast on purpose", sheet). The effect is the same on a white card: the placeholder almost disappears.
- User impact: on monitors with low contrast/in sunlight, the loading card looks like a frozen empty area; the user does not know whether it is loading or broken.
- Suggested fix: raise the tone of `color/muted` in the skeleton (>= 1.3:1) or offer an optional pulse respecting `prefers-reduced-motion`.

**Positives**: size parity with `nph-avatar` in the three sizes (24x24, 32x32, 40x40 measured) and the swap from skeleton to content keeps the card without a jump (`detalhe-card-light.jpg` x 1024.jpg).
**Not verified**: what screen readers announce with `aria-busy` + `aria-live=polite` (the page uses both).
**Composition (short)**: `.card` with a fixed `width: 340px` overflows 375 px (391 px scroll); replace with `max-width: 100%`.

---

### spinner (route `/spinner`)

**Summary**: good. `sm` = 16 px and `md` = 20 px (0.8 s animation), visible inside `nph-button loading` (replaces the leading icon, button gets `aria-busy` + `aria-disabled`). Inherited color works in crimson, muted and dark background. Weak point: thin stroke. Grade B+.
**Heuristics (0–4)**: Visibility of status 3; Consistency 4 (same icon height as the button); Error prevention 3.

**Findings**
#### [P2] Thin, almost closed ring: under "reduce motion" it becomes a static circle that looks like an empty field
- Problem: the drawing is the `circle-notch` in the light variant (stroke of ~1 px at `sm`) with an opening of ~30°. With `prefers-reduced-motion: reduce` the animation is `none` (verified), and what is left is an almost complete circle, similar to an empty radio. Without text beside it, the viewer gets no notice (the `label` is only for assistive technology).
- Where: `/spinner`, 1024; `shots/auditoria/spinner/detalhe-anel-zoom.jpg`, `detalhe-botoes.jpg`.
- Cause: component (uses the light glyph of `nph-icon`; sheet: "the notice continues through the text or label").
- User impact: in a button with `loading` the text stays the same (`Excluir`, "Delete") and, for someone who asked for less motion, the only signal is this ring.
- Suggested fix: use the solid variant (stroke of ~2 px) at `sm`, or pulse the opacity instead of stopping completely under `reduced-motion`.

**Positives**: 16 px spinner inside the button visible and aligned to the text (`detalhe-botoes.jpg`); `size="lg"`/invalid renders nothing, with no leftover space.
**Not verified**: perception of the rotation in motion (only static frames were evaluated); announcement of the `label` by a screen reader.

---

### progress (route `/progress`)

**Summary**: good. Bars of 8 px (md) and 4 px (sm), 14 px label, 12 px help; success/error show icon + text, steps has "N of M". Indicator contrast against the background >= 4.9:1 and against the track >= 3.31:1 in all brands and schemes; text >= 5.01:1. Grade B+.
**Heuristics (0–4)**: Visibility of status 4; Recognition 3 (steps depends on `value-text`); Error prevention 3.

**Findings**
#### [P2 / both] "100% of the container" width is not declared: in a shrink-to-fit parent the bar shrinks to the label
- Problem: the host is `display: block` without `width`. In `width: max-content`/`align-items: flex-start` it measures 111 px (with label) or 48 px (only aria-label), against 420 px in a normal block.
- Where: `/progress` `Largura`, 1024; `shots/auditoria/progress/detalhe-encolhe.jpg`.
- Cause: both. Measured in the three cases of the demo (111x32, 48x8, 420x32); the trigger is the parent's `flex-start`/`max-content`, but the sheet promises "fluid width 100%" and the host does not guarantee that. Documented as a gotcha in the demo itself.
- User impact: in a flex row (bar beside a button, card with `align-items: flex-start`) the bar becomes a tiny line that does not communicate progress.
- Suggested fix: `:host { display: block; width: 100%; min-width: 48px; }` (the `min-width` already exists).

#### [P2] Pending segments of steps have 1.16:1 (light) and 1.48:1 (dark): without `value-text` the steps cannot be counted
- Problem: the track and the pending segments are decorative per the sheet, but in steps they are the only signal of how many steps remain; if the consumer does not write `value-text` (`2 de 4`, "2 of 4"), the information is almost invisible in light.
- Where: `/progress` steps; `shots/auditoria/progress/detalhe-steps-dark.jpg` (dark/`educacao`: pending weak, completed strong); contrast measured directly on the `.segment[data-state=pending]` of the steps bar (light/dark, `sistemas` and `educacao`): 1.16:1 and 1.48:1, the same as the track; the completed ones give 4.96–12.71:1.
- Cause: component (`value-text` is optional in steps).
- User impact: people with low vision cannot count the remaining steps without the text.
- Suggested fix: make N of M mandatory in `steps` (dev warning as in error without help) or raise the pending segment's contrast to >= 1.5:1.

**Positives**: success and error carry icon + help (`detalhe-steps-dark.jpg`); indicator contrast >= 4.9:1 against the background, minimum 3.31:1 against the track (dark/`gerencial`); at 375 the bar fills the parent's width without breaking.
**Not verified**: indeterminate in motion and `prefers-reduced-motion` (the sheet says it stops; not measured). Screen reader.
**Composition (short)**: `div style="width:420px"` in the demo `Em bloco com largura 420px` overflows 375 px (436 px scroll).

---


### tooltip (route `/tooltip`)

**Summary**: Correct and accessible behavior: focus opens it immediately, hover at ~340 ms (token 300 ms), hover-capable bubble, Esc closes it even with the pointer over it, flip and clamp work, text contrast 6.69:1. Failures only at the edges and with text longer than two lines. Overall grade: B+.
**Heuristics (0-4)**: Visibility 3; Control and freedom 4 (Esc, hover-capable, persistent: WCAG 1.4.13 met); Match 3; Error prevention 2 (long text overflows).

**Findings**

#### [P2] Text longer than two lines overflows the bubble (white on a light page)
- Problem: the bubble has a `max-block-size` of two lines (44 px) with `overflow: visible`; a 92-character text (`Esta explicação ocupa duas linhas completas...`, an example from the validation app's page) wraps into 3 lines and the 3rd line falls outside the bubble, white on the light background (practically unreadable). It happens at 235 px maximum width, in any viewport.
- Where: `/tooltip` 375 px, `Texto longo` (Long text) button; `shots/auditoria/tooltip/detalhe-375-balao-borda.jpg` (`quebrar palavras no meio` (break words in the middle) cut off below the bubble).
- Cause: both. Component: silent failure when the limit is violated ("Longer text is a content error", sheet) without growing or clipping with a warning; composition: the demo text has 3 lines, not 2.
- User impact: part of the hint disappears when the content goes over the limit.
- Suggestion: component: `max-block-size` only as a dev-time alert, letting the bubble grow (or `overflow:hidden` + `title`); composition: shorten to <=2 lines (or move the explanation to the `nph-field`).

#### [P2] Bubble flush at 0 px from the edge and without an arrow when the clamp shifts it
- Problem: the clamp uses `[0, viewport-width]`: at 375 px the `Texto longo` bubble goes from x=0 to x=235 while the button is at x=24 to 127; without an arrow, the visual link is just proximity. Same bubble on `Salvar rascunho` and `side-top`.
- Where: `/tooltip` 375 px; `detalhe-375-balao-borda.jpg`.
- Cause: component (clamp without margin and without an indicator).
- User impact: the bubble looks cut off at the edge; it is less obvious which element it belongs to.
- Suggestion: 8 px margin in the clamp; optionally an arrow aligned to the center of the target.

#### [P2] The help hint on the info icon is not reachable on touch (and the trigger is 20x20)
- Problem: `ico-info` (CPF `só números...`) is a `span tabindex=0` of 20x20 px (automatic "small" metric) and the tooltip does not open on touch, so the help text disappears on the phone.
- Where: `/tooltip` `Ícone isolado e campo` (Isolated icon and field), 375 px.
- Cause: both. Component: does not open on touch (sheet, "essential information never lives only in the balloon"); composition: the validation app's 20 px wrapper and use of a hint as help.
- User impact: on the phone the field's help does not exist.
- Suggestion: composition: help in `nph-field` (the sheet itself says so) and a wrapper of >=24 px; component: nothing (documented decision).

**Positives**: bubble at 12 px, 6.69:1 (light and dark); the side flips when there is no room (`side=right` at 375 became `left`), no bubble outside the viewport across 12 targets x 2 widths; hover-capable (staying over the bubble keeps it open), Esc closes with the pointer still, click does not close/open. `shots/auditoria/tooltip/detalhe-375-balao-borda.jpg`.
**Not verified**: `dark/educacao` (identical contrast 6.69 measured by token, no screenshot of the bubble); `relation=name` with a screen reader.

---

### empty (route `/empty`)

**Summary**: good. The 14 px heading and 12 px description wrap well with long text (4 lines at 248 px), the illustration follows the subtree's scheme (light and dark, tested in isolation with the correct background) and at 375 it fits (280 px). Two annoyances: it does not center itself and it carries a heavy illustration. Grade: B.
**Heuristics (0–4)**: State visibility 3; Label clarity 4; Consistency 3.

**Findings**
#### [P2 / both] Host fixed at 280 px and left-aligned: in a larger container the empty state ends up off-center
- Problem: `nph-empty` measures 280 px (token `layout/input-width`) and sits flush left in its parent; only the inner content is centered. In a 600 px container the illustration and title end up ~160 px left of center; in a 420 px `.box`, 58 px.
- Where: `/empty` 1024 (first demo), `shots/auditoria/empty/detalhe-descentrada.jpg` (isolated: host `left:1`, width 280, `margin: 0`, in a 602 px div).
- Cause: both. The component does not center itself (`margin-inline` 0); the sheet delegates the position to the parent (`quem recebe dá o fundo e a posição` (whoever receives it provides the background and the position)), and the page did not center it.
- User impact: the empty state of a large table/list appears crooked in the upper-left corner.
- Suggestion: `:host { margin-inline: auto; }` (`max-width: 100%` already exists, measured); or document it with a `display:grid; place-items:center` example on the parent.

#### [P2] Two 2048 px PNGs (~390 KB each) for a 120x87 illustration
- Problem: `empty-no-option-found.png` (2048x1487, 392 KB) and `...-dark.png` (2048x1538, 394 KB) are always downloaded (both `<img>` stay in the DOM, swapping `opacity`), ~786 KB per empty screen. In headless Chrome, 700 ms after `networkidle0`, the dark illustration was still not painted (`img.complete` true) and only appeared after 3 s; the 1024 screenshot shows the dark frame without the illustration because of this.
- Where: `/empty` `Tema` (Theme), `1024.jpg` (dark box without illustration) x measurement with a 3 s delay (`img.dark` opacity 1, naturalWidth 2048); `shots/auditoria/empty/detalhe-subarvore-raiz-light.jpg` shows the correct result, with both schemes, once the image has decoded.
- Cause: component (assets in `dist/assets/` at 2048 px and two simultaneous `<img>`).
- User impact: the empty state appears without the drawing for a moment (pop-in) and consumes ~0.8 MB even in a simple list; heavy on mobile.
- Suggestion: export at 240 px (2x), or `<picture>` with `media="(prefers-color-scheme)"`/a single `<img>` with `src` swapped according to the scheme.

**Positives**: the illustration switches correctly per subtree (`data-nph-color-scheme="dark"` inside a light root and the inverse), checked by the `--nph-scheme-is-*` opacity and in `detalhe-subarvore-raiz-light.jpg`; long texts wrap well; an empty heading renders nothing.
**Not verified**: heading/description contrast (the sheet claims 4.5:1; it was only checked visually in light and dark); screen reader.
**Composition (short)**: the `Tema` demo puts `data-nph-color-scheme="light"` on a `.box` without `background`: with the root in dark the dark text sits on a dark background and disappears (visible in `empty/1024-dark.jpg`). The list `.box` (`width:420px`) overflows 375 px (385).

---

### table (route `/table`)

**Summary**: good visual (cell types, group, tree, detail, empty, fixed header work; AA contrast in the 4 themes). On narrow screens the columns that do not fit vanish behind a horizontal scroll with no cue at all, cells never wrap, and `size="large"` does not enlarge the targets. Overall grade: B.
**Heuristics (0–4)**: Visibility of system status 3 (content cut off without warning); Consistency and standards 3; Recognition rather than recall 2 (actions below the fold); Aesthetic and minimalist design 4.

**Findings**

#### [P1] At 375 columns and actions fall beyond the fold, with no scroll cue
- Problem: `t-cells1` has scrollWidth 848 for 341 visible; `t-cells2` 646; `t-wide` 1390. The "actions" column and the `mais` (more) button (28×28) leave the visible area. There is no fixed column (`position: static` on all th/td) nor edge shadow/gradient. The only hint is the word cut off at the limit (e.g., `Pendente` (Pending) cut off).
- Where: `/table` 375, `shots/auditoria/table/detalhe-375-cells2.jpg`, `shots/auditoria/table/375.jpg`.
- Cause: component. The sheet documents `rolagem horizontal quando as colunas não cabem` (horizontal scrolling when the columns do not fit), but does not offer a fixed column or an overflow indication. The region is focusable and named (`role=region`, `tabindex=0`, `aria-label` = label/caption), so the keyboard reaches it; the problem is discovery (the touch user does not know there is more).
- User impact: on a phone the row's main action (edit/more) and data columns are invisible; whoever does not scroll horizontally does not know they exist.
- Suggestion: shadow/gradient (or an indicator) on the edge that still has content; `sticky-start`/`sticky-end` option for the first column and for the actions column (the `table/sticky-*` tokens already exist only for the header divider).

#### [P2] Cell text never wraps; `width` only applies to `truncated`
- Problem: `white-space: nowrap` on all cells. In a test with long text (`/table`, 375): text column 491 px, `person` column 386 px, table 958 px for 341 visible. Columns with `width: '140px'`/`'180px'` changed nothing (491/386 unchanged).
- Where: `/table` 375, `shots/auditoria/table/detalhe-375-nowrap.jpg`.
- Cause: component (internal `nowrap` CSS; `width` only respected in the `truncated` type, as the sheet says).
- User impact: long real names, emails and descriptions push the table into horizontal scrolling, even at 768, and the cell content can only be read by scrolling.
- Suggestion: column with `wrap: true` (or `white-space: normal` with `max-width`/`width` respected in the `text` and `person` types), keeping `truncated` for the case with a tooltip.

#### [P2] `size="large"` does not enlarge touch targets
- Problem: the sheet says to use `large` on a touch screen. Measured default vs large (data-table and table): chevron 28×28 in both, more 28×28, Edit/more of the `actions` 36×36, cell button 63×28. Only the header height changes (40→44) and that of text-only rows (40→44). Cell links measure 44×19 (height <24; they pass through line spacing, low risk).
- Where: `/table` and `/data-table` 1024 (measured with `getBoundingClientRect` on the controls in row 1).
- Cause: component.
- User impact: on a phone the target remains 28–36 px (above the AA minimum of 24, below 44); `large` gives a false sense of a "touch mode".
- Suggestion: in `large`, row controls at 44 px (or a touch area with invisible padding).

#### [P2] 1 px seam in the horizontal borders between columns
- Problem: the line between rows has a 1 px gap at each column junction (`border-collapse: separate`, border on each `td`/`th`). Visible in all tables, more evident at high DPR.
- Where: `shots/auditoria/table/detalhe-emenda-borda.jpg` (DPR 3).
- Cause: component.
- User impact: polish only, no functional effect.
- Suggestion: `border-collapse: collapse` or a border drawn on the `tr`.

**Positives**: AA contrast calculated in the 4 themes (lowest ratio 4.96:1 in `educacao` light; links 5.37:1); the fixed header works with body scrolling (`detalhe` in `/table` demo 4, 296 px); truncated text gets a blue focus ring and a tooltip at 375 (tested by focusing via code); the expandable detail at 375 fits without overflow.
**Not verified**: screen reader; tooltip of the truncated text by touch; row hover; keyboard navigation of the treegrid (another batch); `striped`/`grid` in dark.

---

### data-table (route `/data-table`)

**Summary**: at 768, 1024 and 1440 it is excellent (search, sorting, selection with bar + checkbox, bulk bar with count, empty state by search, pagination). At 375 the toolbar, the bulk action bar and the `wide` footer do not fit, and the switch and ⋮ columns end up outside the visible area. Overall grade: B-.
**Heuristics (0–4)**: State visibility 3 (bulk count, aria-busy per cell, no overflow warning); User control 3; Consistency 3 (different focus rings in the same table); Error prevention 3; Recognition 2 at 375.

**Findings**

#### [P1] Toolbar and bulk action bar do not fit at 375; the page gets horizontal scrolling
- Problem: `nph-toolbar` with `nph-input` (280 px fixed) + `Filtrar` (Filter) button + `Nova pessoa` (New person) measures 518 px in a 343 px container; `document.scrollWidth` goes to 534. `Nova pessoa` ends up outside the bar and the screen. In the bulk bar `Excluir` (Delete, a destructive action) goes from x=410 to 498, well beyond the blue background (the bar ends at 359). Nothing collapses, shrinks or wraps.
- Where: `/data-table` 375, `shots/auditoria/data-table/detalhe-375-main.jpg`, `shots/auditoria/data-table/detalhe-375-bulk.jpg`.
- Cause: both. Isolated test (`nph-toolbar` in a 343 px `div`, same children): 518 px and `scrollWidth` 518, i.e. the component reproduces it. The toolbar's sheet assumes this (`não quebra e não colapsa sozinha, o consumidor tira o texto e manda para More` (does not wrap and does not collapse on its own, the consumer removes the text and sends it to More), decision D-5 pending); the composition did nothing at 375.
- User impact: the whole page scrolls sideways and the `Excluir` action ends up partly off screen.
- Suggestion: component: `min-width: 0` on the search field with `flex: 1 1 160px` and controlled `overflow` (or a `collapse` mode that reduces buttons to an icon below ~480 px); composition: icon-only buttons (`aria-label`) or short text below 480 px.

#### [P1] `pagination-layout="wide"` footer at 343 px overflows on the left and loses controls
- Problem: `nph-pagination` measures 502 px in a 343 px footer, aligned to the end (`justify-content: flex-end`), so 159 px spill out on the left: the `Itens por página` (Items per page) selector, `Primeira` (First), `Anterior` (Previous) and page 1 sit at negative x. Overflow on the left does not scroll: the controls are unreachable by touch and invisible.
- Where: `/data-table` 375, demo 2 `Servidor simulado` (Simulated server), `shots/auditoria/data-table/detalhe-375-srv.jpg`.
- Cause: both. The composition chose `wide` (the sheet says the layout does not change on its own, D-1); the component fails irrecoverably when the choice is wrong (no `max-width: 100%`, no wrapping, no scrolling). `middle` and `narrow` fit at 375 (demo 3, verified).
- User impact: no way to go to page 1/previous or to change items per page.
- Suggestion: component: `max-width: 100%` + `flex-wrap`/`overflow-x: auto` on the `nav`, or automatic choice by container query; composition: `pagination-layout` by width (matchMedia).

#### [P1] At 375 the `Valor` (Value), `Ativo` (Active) (switch) and ⋮ columns fall outside the visible area
- Problem: region with scrollWidth 505 for 341; switch at x=422–486 and ⋮ at x=486–522, visible area 17–358. No fixed column or scroll cue (same cause as the `table` finding). The `Valor` column appears only as a cut-off `1`.
- Where: `/data-table` 375, `shots/auditoria/data-table/detalhe-375-main.jpg`.
- Cause: component (pure horizontal scrolling; selection/action columns not fixed). The composition uses 6 columns, which is reasonable for the component.
- User impact: the ⋮ (edit/delete) and the switch are discoverable only if the person tries to scroll sideways.
- Suggestion: fixed (sticky) selection and action columns and an overflow shadow; or stacked cards on narrow screens.

#### [P2] Column widths oscillate between loaded, loading and another page
- Problem: with `table-layout: auto`, the three columns of the server demo measure 427/235/328 px, become 326/278/387 with skeleton (700 ms) and 450/226/314 on the next page (1024). When empty, the header reflows (`Unidade` (Unit) shifts ~95 px relative to the full table).
- Where: `/data-table` 1024, measurement of `th` in demo 2; `shots/auditoria/data-table/detalhe-375-loading.jpg` (skeleton with columns different from the loaded ones).
- Cause: component (`width` is only accepted in `truncated`; there is no minimum or fixed column width).
- User impact: the content "jumps" at every page change, and the click target moves.
- Suggestion: accept `width`/`min-width` on any column (or an optional `table-layout: fixed`).

#### [P2] Different focus rings in the same table; weak focus on the switch when on
- Problem: the sortable header uses `outline: 2px solid rgb(59,130,246)` (3.7:1 on white; dark rgb(137,180,250)); checkbox, switch and ⋮ use a light-blue halo. On the switch when on, the focus is just the light-blue halo around the track (contrast ratio not calculated; visually weak, see `detalhe-foco-switch.jpg`).
- Where: `/data-table` 1024, `shots/auditoria/data-table/detalhe-foco-sort.jpg`, `detalhe-foco-switch.jpg`, `detalhe-foco-mais.jpg`.
- Cause: component (each piece uses its own focus; the sheet foresees this).
- User impact: focus is easy to lose when moving from the header to the row controls.
- Suggestion: unify with the same 2 px `focus/border` on the pieces inside the table, or strengthen the halo of the switch when on.

#### [P2] Small targets and many Tab stops
- Problem: checkbox 24×24 (real click area ~36×36: a touch at ±6 px toggles it; tested), switch 40×24, ⋮ 36×36; `large` does not change them (see the `table` finding). There are 3 Tab stops per row (checkbox, switch, ⋮): 30 stops in 10 rows before reaching pagination; the row does not receive focus.
- Where: `/data-table` 375/1024 (Tab sequence measured).
- Cause: component (sheet semantics: `Tab alcança, em ordem` (Tab reaches, in order)).
- User impact: slow keyboard use in long lists; touch is acceptable (≥24) but below 44.
- Suggestion: roving tabindex per row or a skip to the pagination.

**Composition (short)**: demo 2 uses `pagination-layout="wide"` in a 343 px space (see P1); demo 4 passes `rows=[]` when `loading`, showing a single skeleton row instead of keeping N rows.

**Positives**: 768 with no overflow at all (`shots/auditoria/data-table/768.jpg`); selection marks the row with a left bar + checkbox + bulk bar with the count `1 de 60 selecionadas` (1 of 60 selected) (`detalhe-375-bulk.jpg`); empty state by search with a `Limpar filtro` (Clear filter) action and visible header; `middle` and `narrow` layouts fit at 375; AA contrast calculated in the 4 themes (lowest ratio 6.69:1 in light, 7.24:1 in dark).
**Not verified**: screen reader (cells in loading have `aria-busy`, the table does not); sorting by keyboard at 375; drag to scroll; `large` density with `striped/grid` in dark.

---

### pagination (route `/pagination`)

**Summary**: good from 768 px: nav with landmark and correct names, clear focus ring, disabled arrows, `compact`/`simple`/`range` compact and legible. At 375 px, three of the six types overflow the width and the page scrolls horizontally. Grade: C (B+ on desktop).
**Heuristics (0–4)**: State visibility 3; Control and freedom 3; Flexibility 2 (no narrow version of edges/table); Error prevention 2 (go-to-page); Consistency 3.

**Findings**
#### [P1] numbered, edges and table do not fit at 375 px: `Próxima` (Next), `Última` (Last) and the last pages end up off screen
- Problem: the bar is `display: flex; flex-wrap: nowrap`, with a natural width of 541 px (numbered), 502 px (edges) and 502 px (table). At 375 px (343 container) it extends past the edge by 198, 159 and 159 px, with no internal scroll or clip (`overflow: visible`): the document ends up 557 px wide. Visible: only `Anterior, 1 2 3 4 5` (Previous, 1 2 3 4 5) and the cut-off edge. simple (211), range (193) and compact (162) fit. At 768 px all fit; `table` wraps `Itens por página` onto a line above the group (106 px tall), which is correct.
- Where: `/pagination` 375 (`375.jpg` is 557 px wide because of this); `shots/auditoria/pagination/detalhe-375-numbered.jpg`, `detalhe-375-table.jpg`; measurements of `.bar` by type at 1440/1024/768/375.
- Cause: component (the bar neither shrinks nor collapses slots; the sheet says to use `compact` on phones, but `edges` and `table`, the typical table footer, have no narrow version). The composition only chose wide types at 375.
- User impact: on a phone you cannot go forward/back past the 5th page, nor reach the last, without dragging the page (WCAG 1.4.10 reflow).
- Suggestion: `.bar { max-width: 100%; overflow-x: auto }` at a minimum; better, below ~480 px reduce the 7 slots to 5, hide first/last and replace the `Anterior/Próxima` text with an icon, or fall back automatically to `compact` via container query.

#### [P2] 36 x 36 px touch targets
- Problem: all arrows and numbers are 36x36 px with an 8 px gap; they pass 24 px (2.5.8) but not 44 px, at any width.
- Where: measured on `/pagination` (1440 to 375): `36x36` buttons in all types (the arrows written `Anterior`/`Próxima` are 100x36 and 99x36).
- Cause: component (token `pagination/item-size`).
- User impact: touch accuracy is harder on phones, where this component appears most.
- Suggestion: on a coarse pointer (`@media (pointer: coarse)`) use 44 px or enlarge the clickable area with transparent padding.

#### [P2] `Ir para a página` (go to page): 64x36 field with no button, no numeric keyboard and silent discard
- Problem: the only way to go is to type and press Enter; there is no button or hint. The `<input>` is `type="text"`, without `inputmode`/`enterkeyhint`, so the phone keyboard is alphabetic. Invalid input disappears without warning: `abc` clears the field and does nothing; `99` goes to the last (42); `0` goes to 1; the field always empties.
- Where: `/pagination` edges, 1024; real keyboard tests: 5 → page 5, 99 → 42, abc → ignored, 0 → 1, 7 → 7.
- Cause: component (shadow root of the inner `nph-input`: `class=field type=text aria-labelledby=""`).
- User impact: whoever does not know about Enter does not know how to confirm; on a phone, typing a number requires switching keyboards.
- Suggestion: `inputmode="numeric"`, `enterkeyhint="go"` and `pattern="[0-9]*"` on the input; a short message/`aria-live` when the value is ignored.

#### [P2] Changing page is not announced: no live region and focus stays on the button
- Problem: none of the six shadow roots has `[aria-live]`; after Enter on `Próxima` the focus stays on the arrow itself (keyboard test: page 1 to 2, `activeElement` = the `Próxima` arrow). In `simple`/`compact`/`range` the position text (`Página 1 de 10` (Page 1 of 10), `1–25 de 250` (1–25 of 250)) changes without a live region; in `numbered` only `aria-current` changes on the number, which is not focused.
- Where: `/pagination`, 1024; verification via `page.evaluate` and real keyboard.
- Cause: component (shadow root without `aria-live`; the sheet delegates the announcement of the result to the screen, but the position belongs to the component).
- User impact: whoever uses a screen reader activates `Próxima` and does not hear which page or range they are on. Actual screen reader behavior was not tested.
- Suggestion: `aria-live="polite"` (or `role="status"`) on the position text element and, in `numbered`, announce `Página N` (Page N) on change.

**Positives**: keyboard focus with blue border + light halo on number and arrow (`detalhe-foco-numero.jpg`, `detalhe-foco-proxima.jpg`); accessibility tree with a named `navigation` and buttons `Página N`, `Primeira/Última página` (First/Last page), combobox `Itens por página` and textbox `Ir para a página`; the current page with `aria-current` and bold (text of the current page >= 6.8:1 in the 6 brand/scheme combinations tested: `sistemas`, `educacao`, `financeiro`, `igrejas`); `compact` (162 px), `simple` (211 px) and `range` (193 px) fit at 375 px.
**Not verified**: actual announcement behavior in a screen reader; Tab traversing all the bar's buttons (only one number and the `Próxima` arrow were tested); tooltips of the arrows with the label; `disabled-opacity` of the arrows; RTL (ar-EG visual only, not mirrored).

---

### dialog (route `/dialog`)

**Summary**: the best piece of the batch in layout and usability. It fits in 343 px (16 margin), only the content scrolls (landscape 812×375 tested), initial focus and return are coherent, scrim, sizes and contrast are correct. Small caveats: focus order in `stacked` and 28/36 px targets. Overall grade: A-.
**Heuristics (0–4)**: Visibility 4; User control 4 (Esc/X, cancelable nph-close); Consistency 4; Error prevention 3 (depends on the consumer, see composition).

**Findings**

#### [P2] `actions="stacked"`: visual order is the reverse of Tab order
- Problem: in the stacked layout, the primary button is on top and the secondary at the bottom (y 458 and 506), but the DOM and Tab follow `Cancelar` → `Confirmar` (Cancel → Confirm) (initial focus on the Cancel button at the bottom, then it goes up to Confirm).
- Where: `/dialog` 375, `stacked` preset, `shots/auditoria/dialog/detalhe-375-stacked.jpg`; measured Tab sequence: `Cancelar → Confirmar → (sai do dialog)` (Cancel → Confirm → (leaves the dialog)).
- Cause: component (visual inversion by CSS: `.footer` with `flex-direction: column-reverse`, computed value with `stacked` open).
- User impact: screen reader and keyboard traverse from bottom to top (WCAG 1.3.2/2.4.3, low risk).
- Suggestion: invert the order in the DOM of the footer (slot) or document it; the focus order should follow the visual order.

#### [P2] Close at 28×28 and footer buttons at 36 px
- Problem: the X measures 28×28; action buttons are 36 px tall (stacked 295×36).
- Where: `/dialog` 375 (`close` 28×28 in `getBoundingClientRect`).
- Cause: component.
- User impact: above the AA minimum (24), below 44 on phones.
- Suggestion: at the compact breakpoint, a 44 X and the footer with `large`.

#### [P2] `inline` with 3 actions or long labels wraps irregularly
- Problem: three buttons in 343 px: `Continuar editando` (Keep editing) alone on the first line, on the right, and the other two below (flex-wrap). `stacked` only exists by the consumer's choice (the sheet says `abaixo de 768 px` (below 768 px)).
- Where: `/dialog` 375, isolated test, `shots/auditoria/dialog/detalhe-375-3acoes.jpg`.
- Cause: both (the component does not switch on its own; the composition chooses `inline`).
- User impact: the set of actions reads as ragged; the primary is not in the expected position.
- Suggestion: automatic `actions="stacked"` below `md` when there are more than 2 actions, or right-aligned wrapping.

**Composition**: [P2, composition] the closing guard of demo 4 uses `form.dirty`, which only becomes true on the `change` event (the `NephosValueAccessor` in `src/app/shared/nephos-value-accessor.ts` binds `nph-input` to `change`, which fires on blur). Test: typing `xyz` and pressing Esc closes the dialog without blocking (log: `form nph-close escape`, without `fechar bloqueado` (close blocked)). The value is not lost (when the dialog is reopened the field still has `xyz`; the FormGroup is not reset), so the impact is only that the unsaved-changes warning does not appear. Fix in the composition: listen to `input` (or `markAsDirty` on `input`).

**Positives**: fits at 375 (343×272 to 343×640 px) and in landscape 812×375, where only the content scrolls and header/footer stay (`detalhe-375-lg.jpg`); the scrollable region is focusable and named by the title (`role=region`, `aria-labelledby`); initial focus on the first field, or on the first footer button; scrim 0.45 (light) and 0.65 (dark); page scrolling locked; AA contrast in the 4 themes (description ≥5.11:1; primary button ≥4.96:1; secondary ≥11.7:1, calculated).
**Not verified**: Safari iOS (`dvh`, virtual keyboard); screen reader; dialog over dialog; focus return when the opener disappears.

---

### notification (route `/notification`)

**Summary**: inline is excellent at 375 (text wraps well, single-line→stacked reflow, 44 px actions, AA contrast in 12 combinations x 4 themes). The toast, following the sheet's region recipe to the letter, is too wide on narrow screens and the time bar is just a static gray block. Overall grade: B+.
**Heuristics (0–4)**: Visibility 3 (time-bar does not convey the time); Consistency 4; Aesthetics and minimalism 4; Recognition 4 (icon + title + text).

**Findings**

#### [P1] 360 px toast does not fit with the region recommended by the sheet: it is cut off on the left
- Problem: with the sheet's region (`position: fixed; inset-inline-end: 16px`), the toast measures 360 px and sits at x=-1 (viewport 375), x=-16 (360) and x=-56 (320): icon and text cut off at 320. Also with `placement="toast"` and the default `duration`.
- Where: `/notification` 375, `shots/auditoria/notification/detalhe-375-toasts.jpg`.
- Cause: both. The component has `width: 22.5rem` and `max-width: min(100%, 440px)`; in a `fixed` region with no defined width the `100%` does not resolve (shrink-to-fit), so 360 applies. Test: `inset-inline-start: 16px` on the region brings the toast to 343 px (fits). The sheet's recipe (only `inset-inline-end`) reproduces the problem.
- User impact: at 360 px (a common Android width) the toast's border and radius go off screen; at 320 px part of the content disappears.
- Suggestion: component: `width: min(var(--nph-notification-toast-width), calc(100vw - 2 * var(--nph-layout-margin-compact)))`; sheet: add `inset-inline-start` / `max-width: calc(100vw - 32px)` to the region recipe.

#### [P2] The time-bar is a static gray block
- Problem: a 16 px strip with gray background `rgb(237,238,239)` over the green surface; width 358 px at 0.3 s, 2.8 s and 5.3 s (it does not progress). It looks like a toast footer, not a counter.
- Where: `/notification` 375, `shots/auditoria/notification/detalhe-timebar.jpg`.
- Cause: component (the sheet acknowledges it: `a barra é um nph-skeleton parado até o nph-progress` (the bar is a stalled `nph-skeleton` until `nph-progress`)).
- User impact: whoever turns on `time-bar` expects to see the remaining time; they see a visual element with no function.
- Suggestion: do not render it until progress exists, or animate the width (linear `transition` over `duration`).

#### [P2] A stack of 3 toasts takes ~34% of a phone's height
- Problem: 3 toasts of 86 px + gaps = 274 px of 812 (region y 522–796) over the content; error/loading/action toasts never close on their own, so the stack can stay like this indefinitely (`duration: 0` in the `Disparar 5` (Fire 5) demo: queue of 2).
- Where: `/notification` 375, `shots/auditoria/notification/detalhe-375-toasts.jpg`.
- Cause: both (the sheet says `no máximo 3` (at most 3); the composition applies the same limit at 375).
- User impact: it covers buttons and content at the bottom.
- Suggestion: one (or two) toasts at most below 480 px; queue the rest.

**Positives**: contrast calculated in 12 combinations (6 severities × subtle/solid) × 4 themes (light, dark, `educacao` light/dark): 0 failures, lowest text/action/icon/close ratio 4.75:1; X button 44×44 and actions 44 px tall at 375 (`detalhe-375-layout.jpg`); `single-line` reflows to `stacked` when the text does not fit (`data-nph-reflowed` present); a toast with the default duration closed between 2.8 s and 8 s (6 s configured).
**Not verified**: pause on hover/focus; `loading` toast→visual result at 375; stacking in dark.

---


### breadcrumb (route `/breadcrumb`)

**Summary**: excellent visuals and focus in all themes (contrast 6.7:1 to 21:1 in light, 9.8:1 to 14.7:1 in dark). The weak point is width: the trail never wraps or shrinks, and `collapsed` does not guarantee that it fits. Overall grade B.
**Heuristics (0–4)**: Consistency and standards 4; Visibility of system status (current page, hover with underline, focus) 4; Flexibility/responsiveness 2 (does not adapt on its own); Error prevention (invalid input disappears silently, with no warning in production) 3.

**Findings**
#### [P1] Trail overflows the width at 375 and at 768, even with `collapsed`
- Problem: the 4-level trail without icons (500 px with `Entrada de dados`/`Breadcrumb (esta página)`) and the collapsed 5-level trail with short labels (401 px: `Início > … > Combobox > Breadcrumb (esta página)`) do not fit in the 343 usable px of 375. The collapsed trail with normal-length proper names (`Maria da Silva Albuquerque Santos`, `Contratos e aditivos vigentes`) comes to 579 px. The text spills out of the container and, on the page, turns into horizontal scrolling.
- Where: `/breadcrumb`, 768 and 375, `shots/auditoria/breadcrumb/768.jpg`, `375.jpg`, `shots/auditoria/breadcrumb/detalhe-overflow375.jpg` (isolated in a 343 px container with a dashed border). `metrics.json`: docW 782 at 768 and at 375.
- Cause of the 768 metric (docW 782): it is a single demo, `Trilha recolhida, 6 níveis` (`breadcrumb.page.ts`, `l6`), whose 5th level has 66 characters (`Região Sudeste com um nome bem comprido para testar o corte do menu`). Natural width of the list = 766 px; the container is 736 (768 - 2x16), so the right side reaches 782. At 375 the layout viewport of mobile Chrome expands to 782 because of the same demo (which is why the 375 capture looks like a shrunken desktop). Other trails on the same page also overflow at 375 (measured): `Navegação sem listener` and `com listener` (500), `recolhida 5 níveis com ícones` (342, ties) and `ícones, 4 níveis` (401).
- Cause: **both**. Component: `.part { flex:none; white-space:nowrap }` and `.list { flex-wrap:nowrap }` in `nph-breadcrumb.css`, with no `min-width:0`, `overflow` or label truncation; the `:host` is `display:block` and the list spills out. The collapse draws "first + … + last two" but does not limit the width of the last two, so `collapsed` does not keep the promise of the sheet ("keeps one line... on a narrow screen") when the labels are long. Isolated (343 px div): `collapsed` with 4 short levels fits (279 px); with 5 levels or long labels it does not. Composition: the validation app used a 66-character label on purpose and did not turn `collapsed` on by width (the sheet, a business rule, says that "the consumer chooses"; it would need `ResizeObserver`/`matchMedia`).
- User impact: on mobile the page gets horizontal scrolling, the current level (the most important one) ends up off screen, and it is possible to lose the sense of where one is.
- Suggested fix: (component) truncate the label with an ellipsis (`max-inline-size` + `text-overflow:ellipsis` on `.label`, plus `title`/tooltip) and `min-inline-size:0; overflow:hidden` on the host, so the trail never spills out; or, even better, a `collapsed="auto"` mode with `ResizeObserver` (decision P109 rejects auto-collapse, but truncation solves it without breaking the one-line rule). (composition) turn `[collapsed]` on when the usable width is smaller than the trail (measure the natural width and compare), and never show the 6-level trail without `collapsed`.

#### [P2] Touch target of the links is 20 px tall
- Problem: links of 36x20, 66x20, 48x20 etc. (`metrics.json`); the `…` button is 24x24.
- Where: `/breadcrumb` at 375.
- Cause: component (height = `line-height`; the sheet invokes the 2.5.8 spacing exception because of the separator between links; `--nph-breadcrumb-gap` was not measured).
- User impact: imprecise touch, below the recommended 44 px (passes AA by spacing).
- Suggested fix: vertical padding on `.link` (32–44 px touch area without changing the design) or `min-block-size` with `display:inline-flex`.

**Positives**: keyboard focus with a 3.68:1 border in light and 8.98:1 in dark, without changing the size (measured via the computed style of `::before`/`::after`); the `…` menu opens on click and shows the hidden levels in order; the current page is text in medium weight, with no link; contrast: links 6.69:1 (light), 9.81:1 (dark), current page 21:1 and 14.73:1.
**Not verified**: `…` menu with a very long hidden label (only the example with short labels was seen, 128 px wide); screen reader; RTL.

---

### sidebar-item (route `/sidebar-item`)

**Summary**: the row is well finished: 40 px tall, icon/label/counter aligned, contrasts of 5.8:1 to 11.2:1 in the normal brands, disabled outside the Tab order, tooltip in ~300 ms. Weaknesses: the open group and the active item are indistinguishable, the actions button does not exist on touch, and the `educacao` brand in dark breaks everything. Overall grade B (C in `educacao`/dark).
**Heuristics (0–4)**: Visibility of status 3 (active = open); Control and freedom 3 (actions only on hover/focus); Recognition 3 (truncated label without automatic tooltip); Consistency 4.

**Findings**
#### [P1] dark + `educacao`: active item, open group and counter pill disappear; focus ring 1.76:1
- Problem: label and icon of the active item (`rgb(102,68,18)`) on a `rgb(102,68,18)` background: contrast 1:1, invisible. The counter pill (same brown) disappears; only the white number remains. The focus ring (border `rgb(153,101,27)` over the panel) gives 1.76:1.
- Where: `/sidebar-item` with `dataset.nphBrand='educacao'` and `nphColorScheme='dark'`, `shots/auditoria/sidebar-item/detalhe-dark-educacao.jpg`. It also reproduces in the realistic panel of the `tela-painel` screen (background `--nph-sidebar-background`), where the active one gives 2.29:1.
- Cause: **component** (tokens, see "Cross-cutting finding" at the top). Measured: in light/`educacao` the same item gives 7.68:1.
- User impact: in the dark theme of the `educacao` brand the user cannot see which page is the current one or what has a notification, and the keyboard focus almost disappears (fails WCAG 1.4.3, 1.4.11 and 2.4.7/2.4.11).
- Suggested fix: in dark+`educacao` point `sidebar/item-foreground-active/-open`, `sidebar/item-badge-background` and `sidebar/rail-background-active` to a light brand tone (for example `educacao-300`) instead of `brand-400-hover`; separate `primary-hover` from `primary-surface-hover` in that theme. Review `focus/border` in dark+`educacao` (today it resolves to `rgb(153,101,27)`, the same value as light; use a light tone; the lib must track which core step it is).

#### [P1] "More actions" button (⋮) does not exist on touch
- Problem: the button is `opacity:0` at rest, appears with `:hover`/`:focus-within`, and `@media (hover: none) { .actions { display:none } }`. In mobile emulation (`isMobile`+`hasTouch`) the button is `display:none` (0x0), and there is no other path (not even long press) to the item's actions.
- Where: `/sidebar-item`, section "[actions]"; test at 375 with `hasTouch`.
- Cause: **component** (sheet decision: "on touch it does not appear: the same actions are on the destination page"). The composition can work around it, but the lib offers no alternative.
- User impact: whoever uses touch (tablet with fingers, phone) loses `Renomear/Fixar/Remover` (Rename/Pin/Remove) in the side menu; any action that exists only in the ⋮ becomes unreachable.
- Suggested fix: keep the button visible when `hover:none` (or when tapping the row, with a second tap opening the actions) and, at the very least, document that the consumer needs to offer the equivalent path. The target is already 28 px (below the 44 for touch).

#### [P2] Open group and active item have exactly the same color
- Problem: `Relatórios` (open group) and `Vendas` (active subitem) come out with `rgb(35,78,148)`, weight 500; the group also gets a solid icon. They look like two active items; only the arrow and `aria-current` differentiate them.
- Where: `/sidebar-item`, realistic composition after clicking `Vendas`: `shots/auditoria/sidebar-item/detalhe-grupo-vs-ativo.jpg` (where the hover on `Calendário` is also visible).
- Cause: component: `sidebar/item-foreground-open` = `sidebar/item-foreground-active` (both `primary-hover`); the sheet says the group is never active.
- User impact: the user does not quickly find the current page in the menu.
- Suggested fix: give the open group its own tone/weight (e.g. normal foreground + weight 500 + arrow, without the active color) or mark the active one with a background/side indicator.

#### [P2] Hover almost invisible and the counter jumps when the mouse passes over
- Problem: the hover background is `rgb(235,242,254)` over a `rgb(216,230,253)` panel (1.12:1; in light `educacao` 1.06:1). When there are `actions`, on mouse over the counter pill shifts 40 px to the left (x from 251 to 211) and the label gets less room (padding-inline-end grows).
- Where: `/sidebar-item`, "[actions]"; `shots/auditoria/sidebar-item/detalhe-acoes-hover.jpg` (hover state, with the counter already shifted).
- Cause: component (`:host(:hover) .control:has(~ .actions)`).
- User impact: a visual jump on every hover and labels that only start truncating when the mouse is over them.
- Suggested fix: always reserve the space of the ⋮ (or overlay without shifting) and raise the contrast of the hover background.

#### [P2] Truncated label without automatic tooltip
- Problem: `Relatório consolidado de ven…` has no way to be read by someone who can see; the tooltip only exists if the consumer passes `tooltip`. The accessible name is complete (screen reader ok), without `title`.
- Where: `/sidebar-item`, matrix (item without `tooltip`).
- Cause: both (the component does not offer a tooltip on truncation; the composition forgets to pass `tooltip`).
- Suggested fix: if the text is truncated, show the label itself in the tooltip without requiring the prop.

**Positives**: contrast of label/icon/counter ≥ 5.84:1 in light, dark and light `educacao` (measured); 40 px row fully clickable; focus with a 4.26:1 border in light (4.43 in dark/`sistemas`); disabled stays outside the Tab order (opacity 0.5, no hover); tooltip opens in ~300 ms (measured).
**Not verified**: screen reader; Safari/Firefox; tooltip on a truncated item with keyboard; brands other than `sistemas`/`educacao`.

---

### sidebar-rail-button (route `/sidebar-rail-button`)

**Summary**: clean 40x40 button, with a solid active state and clear focus, but the counter over the corner covers half of the icon, and in dark+`educacao` the active one disappears. Overall grade C.
**Heuristics (0–4)**: Visibility of status 2 (icon + counter illegible together); Recognition 3 (icon only; the balloon helps with mouse/keyboard); Consistency 3.

**Findings**
#### [P1] The counter covers about half of the icon
- Problem: 20 px tall pill at the top of the button (`top:0`), 23 px wide (`0`, `2`) to 38 px (`128`). The icon is 20x20 at (10,10). Measured overlap: 33% of the icon area with `0`, 50% with `12` and with `128` (with `128` the pill takes up almost the whole top, from x=2 to x=40). With the active item the 1 px outline in the background color worsens the cut-off.
- Where: `/sidebar-rail-button`, matrix; `shots/auditoria/sidebar-rail-button/detalhe-counter-light.jpg`; also in the collapsed `tela-painel` screen (`Mensagens` with counter 3), `shots/auditoria/tela-painel/detalhe-recolhido-375.jpg`.
- Cause: component (geometry of the counter in `sidebar-rail-button`: the corner is inside the 40 px of the button, it does not "stick out" of the corner).
- User impact: the icon of the item with a notification (exactly the one that matters) becomes illegible; `Caixa de entrada` (Inbox) becomes just the base of the icon.
- Suggested fix: move the pill outside the corner (negative offset, e.g. `inset-block-start:-4px; inset-inline-end:-4px`) and limit the width (`99+`), or use a dot without a number.

#### [P1] dark + `educacao`: the icon of the active button disappears (1:1)
- Problem: icon `rgb(102,68,18)` over button `rgb(102,68,18)`; the counter pill also disappears.
- Where: `shots/auditoria/sidebar-rail-button/detalhe-dark-educacao.jpg`. Focus 1.76:1 (same token).
- User impact: in the collapsed rail (icons only) there is no way to know which page is the current one or what has a notification; the focus almost disappears.
- Cause: component (tokens, see "Cross-cutting finding"; here the active one uses `rail-background-active` = `primary-hover` and `rail-foreground-active` = `primary-surface-hover`).
- Suggested fix: same as for sidebar-item.

#### [P2] The balloon opens above and covers the neighboring button
- Problem: the balloon sits at x=0, y=240 (111x24), on top of the previous button and its `12` pill; it opens only after ~342 ms with the mouse (immediate on focus, measured 80 ms).
- Where: `shots/auditoria/sidebar-rail-button/detalhe-balao.jpg`.
- Cause: component (default tooltip positioning; in a rail the natural thing is to open to the side, to the right).
- User impact: during hover the user loses the neighbor above, and the balloon repeats the name over the column.
- Suggested fix: `placement` to the right of the rail, without overlapping the column of buttons.

**Positives**: 40x40 target in all states; icon contrast 5.84 to 11.19:1 outside the case above; accessible name with the number (`aria-labelledby`); immediate focus with balloon; disabled outside the Tab order.
**Not verified**: balloon on touch (the sheet accepts that it does not open); groups in the rail (the lib has no flyout).

---

### sidebar-subitem (route `/sidebar-subitem`)

**Summary**: simple and correct row, 36 px tall, good contrast in all brands except dark+`educacao`. The active state is too discreet. Overall grade B.
**Heuristics (0–4)**: Visibility of status 2; Consistency 3; Recognition 3.

**Findings**
#### [P1] dark + `educacao`: the active subitem disappears (1:1)
- Problem: active label `rgb(102,68,18)` (1.00:1) over panel `rgb(102,68,18)`; focus 1.76:1.
- Where: `/sidebar-subitem` dark+`educacao` (measured in the matrix; same cause as `shots/auditoria/sidebar-item/detalhe-dark-educacao.jpg`).
- Cause: component (tokens, see "Cross-cutting finding").
- User impact: the user cannot see which subpage they are on.
- Suggested fix: same as for sidebar-item.

#### [P2] Active only changes color and weight
- Problem: the active one swaps `rgb(45,51,59)` (rest, 10.11:1) for `rgb(35,78,148)` (6.43:1) and weight 400 to 500, without background, marker or icon. For people with low color vision the difference is minimal; in the dark theme likewise (9.04 vs 5.84).
- Where: `/sidebar-subitem`, matrix (print in `shots/auditoria/sidebar-subitem/375.jpg`, `"Ativo (aria-current)"`).
- Cause: component (the sheet uses weight as an alternative to color, but 400 vs 500 hardly shows).
- Suggested fix: side indicator/soft background on the active one, like the rail's.

#### [P2] The group's vertical line is almost invisible, and the indentation does not exist in the component
- Problem: `--nph-sidebar-group-line` gives 1.12:1 (light), 1.41:1 (dark) and 1.06:1 (light `educacao`) against the panel; in the `tela-painel` screen the subitems are at the same indentation as the group (without `.sub`), so the hierarchy disappears.
- Cause: both: the token is too weak (component) and the indentation/line are drawn by the consumer because `nph-sidebar` does not exist (sheet). In the `tela-painel` screen the missing indentation is our composition (the validation app's own markup/CSS).
- Suggested fix: indentation + line inside `nph-sidebar`/the subitem; token with at least 3:1.

**Positives**: 36 px target, ellipsis with optional tooltip, disabled at 0.5 without Tab, focus 4.26:1.
**Not verified**: `options` (chevron) on touch; screen reader.

---

### navigation-menu (route `/navigation-menu`)

**Summary**: the best-resolved piece of the batch. Hover with a 300 ms delay (measured: opens in 322 ms and closes in 324 ms), Tab, Enter/Space, Esc return focus to the trigger, top-layer panel adjusts to the window, narrow list scrolls. The failures are at the edges: no fallback when the bar does not fit, wide panel squeezed on a small screen, and the `educacao` brand in dark. Overall grade B+.
**Heuristics (0–4)**: Visibility of status 4 (current with underline, focus, aria-expanded); Control/freedom 4 (Esc, tolerant hover); Flexibility 3 (width belongs to the consumer); Error prevention 3 (invalid input disappears in dev with an error; not checked in prod).

**Findings**
#### [P1] dark + `educacao`: the current item gives 2.16:1
- Problem: `Início` (`current-foreground` = `primary-hover` = `rgb(102,68,18)`) over the dark background `rgb(15,17,20)`.
- Where: `/navigation-menu` dark+`educacao`, `shots/auditoria/navigation-menu/detalhe-dark-educacao.jpg`. In light/`educacao`: 8.75:1.
- Cause: component (tokens, see "Cross-cutting finding").
- User impact: in the dark theme of those brands, the current page's item in the bar becomes illegible (2.16:1, fails 1.4.3); only the underline shows where one is.
- Suggested fix: light brand tone for `navigation-menu/current-foreground` in dark.

#### [P2] Wide bar without fallback: overflows at 375 if the consumer does not turn on `narrow`
- Problem: in the `Largo` demo, at 375 the bar has a 343 px host but the items go up to 466 px (last item `Em breve` cut off and the page gets horizontal scrolling; `metrics.json` shows vw 466 at 375).
- Where: `/navigation-menu` at 375, demos 1 and 4 (without `narrow`).
- Cause: both. Component: the bar is `display:flex` with no overflow/scroll or auto-`narrow` (the sheet says the consumer decides). Composition: demos 1 and 4 do not turn on `narrow`; the `Estreito` demo and the `tela-navegacao-superior` screen, on the other hand, use `matchMedia(max-width:700px)` and work.
- Suggested fix: (component) `overflow-x:auto` or a `ResizeObserver` that forces `narrow` when the width is not enough; (composition) turn on `narrow` through `matchMedia`, as the validation app already did on the screen.

#### [P2] Wide panel on a narrow screen: squeezed columns and cut-off titles
- Problem: with 3 groups and `description`, the panel is limited to the window (375 px) and each column becomes ~125 px: `Docume…`, `Guias, tuto…`.
- Where: isolated test at 375, `shots/auditoria/navigation-menu/detalhe-painel-3grupos-375.jpg`. With the demo's 2 groups it fits well (columns of 178 px, `detalhe-painel-375.jpg`).
- Cause: component (the panel never leaves the window, but does not reflow into a single column or wrap the text).
- Suggested fix: stack the groups when the panel width is smaller than the sum of the groups, or make the wide panel `narrow` automatically.

#### [P2] Narrow list: panel stuck to the edge and trigger title equal to the group's
- Problem: at 375 the 280 px panel sits at x=95..375 (no margin), offset from the button (x=165) because of the clamp. In the list, `Comercial` (trigger) and `Vendas` (group) have the same style; nothing says which one is the parent.
- Where: `shots/auditoria/navigation-menu/detalhe-narrow-375.jpg` and `shots/auditoria/tela-navegacao-superior/detalhe-menu375.jpg`.
- Cause: both. Component: clamp without margin and flat hierarchy; composition: the hamburger is in the middle of the header (`.grow` right after the brand), far from the edge.
- Suggested fix: safety margin in the clamp and a different weight/size for the trigger label.

#### [P2] 36 px touch targets
- Problem: bar items, hamburger button and panel links are 36 px tall (narrow-list items 36 px; with description 56 px).
- Cause: component. Passes AA (24 px); stays below the recommended 44 px on touch.
- Suggested fix: 44 px in `narrow`.

**Positives**: hover/delay, Tab (trigger, then the panel links), Esc returns focus to the trigger (measured); focus with a 3.68:1 border; the current one has an underline in addition to color; narrow list with `max-height` and scrolling (`overflow:auto`, 380 px in a 420 window); touch opens by click and the list closes when the link is chosen (tested in `tela-navegacao-superior`).
**Not verified**: screen reader (aria-current/expanded only read in the DOM); wide panel in RTL; `prefers-reduced-motion`.

---

## 6. Cross-cutting notes from the batches

### Panorama (consistency across the four action components)


| Measure | button | togglebutton | toggle-group | toolbar (children) |
|---|---|---|---|---|
| Height compact / default / large | 28 / 36 / 44 | 28 / 36 / 44 | 28 / 36 / 44 (the group writes `size`) | 28 / 36 / 44 (includes input and chip) |
| Radius | 6 px | 6 px | 6 px | 6 px (bar); floating 8 px |
| Font | 14 px | 14 px | 14 px | 14 px |
| Icon-only width | square (28/36/44) | **50x28 / 54x36 / 58x44** (not square) | same as togglebutton | button square |

Heights, radii and typography are consistent and match the sheet. The only break in consistency is the icon-only togglebutton (see P2 in togglebutton).

---

### Cross-cutting finding (one single token defect, several manifestations): 4 of the 7 brands in dark

Sweep (label of the active sidebar-item over the panel, `/sidebar-item`, calculated contrast): in light all brands stay between 6.43:1 and 11.29:1; **in dark**: `sistemas` 5.84, `comercial` 5.92, `financeiro` 5.78 (ok) and **`gerencial` 1.47, `educacao` 1.00, `igrejas` 1.86, `rh` 1.56 (fail)**. It is not only `educacao`: it is any brand whose `brand-400-hover` falls on the dark step. Count in this report: **one token defect (component) = 1 root cause**; it appears in each component below as its own manifestation so it stays traceable, but in total it counts as 1 cross-cutting P1 (the 4 endpoints are marked with "see cross-cutting finding" and are not counted again in the per-component counts).

In `educacao`: `--nph-color-primary-hover` = `--nph-theme-brand-400-hover` = `educacao-800` (rgb 102,68,18), and `--nph-color-primary-surface-hover` in dark = `brand-800` = the same brown (`dist/tokens.css`, lines ~1325 and ~1329; `educacao` at ~328). The tokens `sidebar/item-foreground-active`, `-open`, `item-badge-background`, `rail-background-active`, `navigation-menu/current-foreground` point to `primary-hover` and `sidebar/panel-background` and `rail-foreground-active` point to `primary-surface-hover`: in dark+`educacao`, "foreground" and "background" become the same color. This shows up in sidebar-item, sidebar-subitem, sidebar-rail-button and navigation-menu (sections below). Cause: component (tokens). The sweep above shows the same defect in `gerencial`, `igrejas` and `rh`.

---

### Composition-only problems (short)

- `.grid2` (`minmax(320px,1fr)`) and `.stack-wide` place bare fields (multi-combobox, slider) without `width:100%`: they cause the overflow above and leave the slider at 280px.
- The `Muitos chips` demo asks for `max-width:320px` "on purpose", but the host is 420px: the test does not test the stated condition.
- `/chip` and `/avatar`: removal without moving focus; named avatar next to the name in text.

## 7. Not verified in this audit
Real screen reader; Safari/iOS and Firefox (14 px font zoom, `field-sizing`, virtual keyboard); RTL; `forced-colors`; `prefers-reduced-motion` (spinner only); physical touch (viewport/touch emulation in Chrome); color blindness in the `educacao` brand; hover/active by contrast in some components. Each section lists its own "Not verified".
