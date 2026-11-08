# Angular validation of `@iatec/nephos@5.0.0-rc.2`: DX, integration and packaging

This note has no translations: it is an internal validation record, not usage
documentation. See [`../../i18n.md`](../../i18n.md) and the [index](README.md).
It is an English rendering of a Portuguese report (`VALIDACAO.md`); nothing was
dropped or re-ranked. Findings are **proposals awaiting triage**, not decisions.
Screenshot and note paths (`shots/`, `notes/`) point into the validation app and
are **not** in this repository: see [Evidence](README.md#evidence).

> **Validated package: `@iatec/nephos@5.0.0-rc.2` installed from the `IATec.Community` feed** (`resolved` from the feed, integrity `sha512-WFBsUJTvc7Lmw4SOv7r7urmU4x3Eyf06NqsfNqJ715KsG/NqIYj4H40CISF8Z78eDQjH0gigkcsB7I5PrRqC6w==`, checked in `package-lock.json`). **Phase A** used a tarball generated from `origin/v/5.0.0` at `a3414a1` (`5.0.0-rc.1` in `package.json`); rc.2 was published from `caaece9` and adds the `nph-navigation-menu` component. Every finding below was **re-verified against rc.2** (see §3 for what changed between the two).
> Project: Angular **22.2.6** (standalone, lazy routes, SCSS, `--ssr=false`, zoneless + OnPush + signals by `ng new` default), TypeScript 6, `strict` + `strictTemplates`, `lit 3.3.3`, Font Awesome Pro 6.7.2 (light/solid), `@fontsource/noto-sans` and `@fontsource/ibm-plex-mono`.

## 1. Summary

**The 41 components exported by rc.2 (the 40 in `src/components` from Phase A + `nph-navigation-menu`) were used in an Angular app, one per route (`/button` … `/navigation-menu`), plus 4 composed screens and 3 findings routes (48 routes in total).** The app compiles in production installing only from the feed (`ng build`, exit 0) and all 48 routes render without console errors in headless Chrome against `ng serve` (the only error messages are 404s for images deliberately broken in `/avatar` and `/image`). Each route has an event log on the page; the batches exercised keyboard, focus, dark mode, and the `educacao` brand.

**Global verdict: Nephos makes sense in an Angular product.** No component ended up "does not make sense" or "blocked": the visual and behavioral contract of each piece (APG keyboard, a11y, states, tokens, dark/brands, top layer for popovers) matches the sheet and is of above-average quality. The cost is at the **boundary with Angular**, which the package does not yet handle:

| Verdict | Components |
|---|---|
| **Makes sense** (19) | togglebutton, toolbar, field, textarea, select, option, multi-combobox, radio, switch, avatar, avatar-stack, badge, icon, kbd, skeleton, progress, empty, pagination, notification |
| **Makes sense with adjustments** (22) | button, toggle-group, dropdown-menu, label, input-otp, combobox, checkbox, slider, chip, image, separator, spinner, tooltip, dialog, table, data-table, breadcrumb, sidebar-item, sidebar-subitem, sidebar-rail-button, navigation-menu (new in rc.2), + input (see below) |
| Does not make sense / blocked | none |

(Total: 19 + 22 = 41.)

(`nph-input` was the orchestrator's model page: **makes sense with adjustments** for the same CVA and silent-invalid-input reasons; no batch section of its own — see `src/app/components/input.page.ts`.)

### Composed screens (screenshots in `shots/`, re-recorded against rc.2)
- **Registration** (`/tela/cadastro`): Reactive Forms + `nph-field` + input/select/combobox/multi-combobox/radio/textarea/switch/checkbox/button/notification. Validation by `touched`, submit with `loading`, 10 fields, everything functional — **with the consumer's `NephosValueAccessor`**. Screenshots (in `shots/`; a sample of component captures (button, dropdown, dark/`educacao`) in `shots/componentes/`; the remaining dark/brand verifications are described in the per-component sections, without an image): `cadastro-1-vazio`, `-2-erros`, `-3-preenchido`, `-4-enviado`, `-5-dark-educacao`.
- **Listing** (`/tela/listagem`): `nph-data-table` with search, sorting, selection, row actions, batch bar, pagination and a delete `nph-dialog` + toasts, with 47 records controlled by `computed()`. It works end to end (selection → `{count} de {total}` → dialog → `47 → 45`). Screenshots: `listagem-1`, `-2-selecao-bulk`, `-3-dialog`, `-4-apos-excluir`, `-5-busca-vazia`.
- **Shell with top navigation** (`/tela/navegacao-superior`, new in rc.2): `nph-navigation-menu` (links + triggers with grouped panels) + Angular Router (the consumer's `appNephosLinks` directive; `current` item derived from `router.url`, SPA navigation confirmed: the `window.__m` marker survives) + breadcrumb + user `nph-dropdown-menu` + notification. `narrow` via `matchMedia(max-width:700px)`: at 600px the bar turns into the Menu button. Screenshots: `navsup-1-inicio`, `-2-painel-aberto`, `-3-faturas`, `-4-dark-financeiro`, `-5-estreito-aberto`; of the isolated component: `navmenu-1-aberto`, `navmenu-2-narrow-aberto`.
- **App shell** (`/tela/painel`): side menu (sidebar-item/subitem/rail-button) + breadcrumb + notifications + empty, expanded and collapsed, light/dark. Screenshots: `painel-1-expandido`, `-1b-subitem-ativo`, `-2-recolhido`, `-3-recolhido-dark`, `-4-expandido-dark`. **Note:** the first version of this screen had invisible link items because `href` was missing (see P0 #5 below).

> **Layout and usability audit (Phase C):** see [`ux-audit.md`](ux-audit.md) (originally `AUDITORIA-UX.md`) — findings on layout, responsiveness, states and consistency per component and per screen, with cause (component × the validation app's own composition) and screenshots in `shots/auditoria/`.

## 2. Prioritized findings for the Nephos team

### P0 — block adoption or cause a silent bug in production
1. **There is no integration with Angular Forms (no `ControlValueAccessor`).** Any `formControlName`/`[(ngModel)]` on `nph-input`, `-textarea`, `-select`, `-combobox`, `-multi-combobox`, `-input-otp`, `-slider`, `-checkbox`, `-switch`, `-radio`, `-togglebutton`, `-toggle-group` throws `NG01203: No value accessor…` (dev) — and, in a **production build, it becomes the cryptic `TypeError: Cannot read properties of null (reading 'writeValue')`** (verified). Every product has to copy a CVA (`src/app/shared/nephos-value-accessor.ts`, ~70 lines, mapping tag→(prop,event)). Limits even with the CVA: `nph-slider mode="range"` (start/end) has no natural form; `form.disable()` does not disable `nph-toggle-group` (it has no `disabled`); the `FormControl` only sees the value on `change` (blur/Enter) in input/textarea/otp, not on every keystroke (a button bound to `form.valid` stays disabled with the complete OTP on screen until Tab). **Reconfirmed in rc.2** (the new `nph-navigation-menu` also has no CVA, but it is not a form control). Suggestion: publish `@iatec/nephos-angular` (CVA directives) or a documented generic `ControlValueAccessor`.
   - **Suggested fix:** publish `@iatec/nephos-angular` (or `@iatec/nephos/angular`) with `ControlValueAccessor` directives per tag (the tag→prop/event mapping that is already in `src/app/shared/nephos-value-accessor.ts`), `NG_VALUE_ACCESSOR` with `setDisabledState`, `null` coercion (`[]` in toggle-group/multi-combobox), and `{start,end}` for the range slider; in the meantime, document the CVA in `docs/consuming.md` (Angular section) with ready-to-copy code.
2. **The invalid-input contract is silent in the published package.** The sheet and `.d.ts` promise `console.error`/`console.warn` in dev; `build:lib` removed the calls (loose template literals were left in the emitted JS). Result measured in dozens of cases: value outside the list (`severity`, `size`, `type`, `status`, `side`…), nonexistent icon `name`, link without `href`, `chip` without `remove-label`, wrong composition (`<div>` in the middle of a toolbar/toggle-group/field) → the component **disappears (0×0, empty shadow) or degrades without any message**. A typo in the icon (`icon-start="search"` instead of `magnifying-glass`) hides the whole button. It is the package's biggest DX trap. Evidence route: `/achados/invalido-silencioso`. **Reconfirmed in rc.2** and extended to the new `nph-navigation-menu` (4 invalid causes → 0×0 with no message).
   - **Suggested fix:** keep the log calls in the build: in `vite.config.lib.ts` do not use `esbuild.drop: ['console']` or `pure_funcs`; guard them with an explicit flag (`globalThis.__NPH_DEV__`/`customElements` + `process.env.NODE_ENV`) instead of eliminating them as dead code; add a test in `test:package` that fails if `console.error` disappears from `dist/` and a test that mounts an invalid value and expects exactly 1 `console.error`.
3. **`[for]="expr"` does not work on `nph-tooltip`, `nph-dropdown-menu` and `nph-label`.** Angular maps the `for` attribute to the DOM property `htmlFor`; the components have their own `for`, end up with `for=null`, and the bubble/menu/label **never turns on**, with no error. Only a literal `for="id"` or `[attr.for]` works. It hits the typical case (a per-row menu in `@for`). The sheet/doc do not warn about it.
   - **Suggested fix:** in the components that have `for`, declare the property with `attribute: 'for'` and `noAccessor`/an alias for `htmlFor` (`get htmlFor()`/`set htmlFor()` delegating to `for`), so that `[for]="id"` and `[htmlFor]` both work; or rename the public property (`target`/`anchor`) keeping `for` as the attribute. Document in `consuming.md` (Angular): use `[attr.for]`.
4. **The `href` of the navigation components does not talk to the Angular Router.** Without extra code, `nph-breadcrumb`/`nph-sidebar-*` with `href="/rota"` cause a **full page reload** (state is lost). The validator reports that the sheet says a router listening to the click on the document treats it as a link; the Angular Router does not do that (only `routerLink`). *(Editorial note: this is the validator's paraphrase. The current `fichas/nph-breadcrumb.md` has no such sentence; it says the piece clicks a hidden anchor of its own shadow root so the native click bubbles, is composed and cancelable, and that it fires no event of its own.)* Consumer workaround (~8 lines, `composedPath()` + `router.navigateByUrl`; now extracted into `src/app/shared/nephos-router-links.ts`) in `/achados/router-href`. **It also applies to `nph-navigation-menu` (rc.2)**: with the directive, the click is SPA, and `current` has to be derived from `router.url`. In addition, `RouterLinkActive` does not reach the inner `<a>`: `active` has to be derived from `router.url`.
   - **Suggested fix:** document the interceptor in `consuming.md` and publish the directive (`NphRouterLinks`) in the Angular package; and/or emit a cancelable `nph-navigate` event (`detail: { href }`) before the default navigation in the components with `href` (breadcrumb, sidebar-*, navigation-menu, table link) so the app can call `router.navigateByUrl` without `composedPath()`. Fix the breadcrumb sheet's sentence about a router handling the click (see the editorial note above) or make it true.
5. **`nph-sidebar-item`/`-subitem`/`-rail-button` of the link type without `href` do not render** (height 0, silent). Anyone navigating by click/state has to pass any `href` and cancel the click. The validation run itself hit this on the panel screen.
   - **Suggested fix:** accept a link without `href` as a button (`<button role=link>` + `nph-select` event) or, at the very least, render with a visible error; today, emit `console.error` (see #2) and document that `type=link` requires `href`. Preferable: optional `href` with a click event `nph-item-select` for use with a router.

### P1 — high DX friction
6. **Controlled `open` (`nph-dialog`, `nph-dropdown-menu`, `nph-tooltip` and, in rc.2, `nph-navigation-menu`) gets out of sync with Angular**: the component resets `open` by itself (Esc, click outside, focus/blur) and does not emit a "changed" event. `[open]="sig()"` stays `true` and the next opening does not happen. `nph-dialog` has `nph-close`, but the 2nd consecutive Esc arrives with `cancelable=false`; dropdown/tooltip have no event at all. Suggestion: an `nph-open-change`/`openchange` event.
   - **Suggested fix:** add state-reflecting events: `nph-open-change` (`detail: { open }`) in dialog, dropdown-menu, tooltip and navigation-menu, fired when the PIECE changes `open` (Esc, click outside, focus/blur); document the pattern `[open]="s()" (nph-open-change)="s.set($event.detail.open)"`. In `nph-dialog`, ensure `cancelable=true` on `nph-close` on the 2nd Esc as well.
7. **Property × attribute binding × form reset**: `[readonly]="true"` goes to `el.readOnly` (not `readonly`) → `nph-chip` breaks and disappears; `[value]` on a `nph-togglebutton` child of `nph-toggle-group` does nothing (the group reads `getAttribute('value')`; use `[attr.value]`); `[checked]`/`[start]`/`[end]` (property binding) **do not set the `form.reset()` default**, only the literal attribute does.
   - **Suggested fix:** *(editorial note, after review: only `nph-chip` has the proven failure; see the note under the chip finding in §4)* in `readonly` (chip/input/textarea), also expose the `readonly` property (`@property({attribute:'readonly'}) readonly` + alias `readOnly`) so that Angular's `[readonly]` works; in `nph-toggle-group`, start reading the child's `value` as a property (`child.value ?? getAttribute('value')`) and declare `value` in `nph-togglebutton`; document the rule "a literal attribute sets the `form.reset()` default, property binding does not" in the checkbox/slider/radio sheets.
8. **`nph-button` does not submit a native `<form>`** (internal `<button type=button>`, no `type="submit"`). `(ngSubmit)` does not fire from the button; only from Enter inside `nph-input`. The most common case on screens requires `requestSubmit()` on click.
   - **Suggested fix:** expose `type="submit"|"reset"|"button"` on `nph-button` and make it form-associated (`ElementInternals.form.requestSubmit()` on click when `type=submit`); in the meantime, document the `(click)` + `requestSubmit()` pattern in `consuming.md`.
9. **Internal state that changes without notifying Angular**: `nph-image.status` (read-only; stale in OnPush/zoneless, and changing `src` to empty does not fire `load`/`error`); `nph-table` replaces `rows` internally when opening a row (the pattern that works: keep the key→open map in the app and derive `rows` with `computed()`); `nph-combobox` fires `nph-search` with `query:""` right after the choice and requires **reassigning** `options` (mutating in place does not update).
   - **Suggested fix:** emit observable events/`requestUpdate`: `nph-image` with an `nph-status-change` event; `nph-table` should not mutate `rows` (emit `nph-row-toggle` and let the app reassign — or accept an app-controlled `open` per row); `nph-combobox` should not fire `nph-search` with `query=""` after the choice and should observe internal changes to `options` (copy the list on receipt, comparing by content, not by reference).
10. **`nph-toggle-group.value` with `null`/`''` throws `TypeError: this.value.filter is not a function`** inside `updated()`; the public setter neither coerces nor warns. (The consumer's CVA was fixed to coerce `[]`.)
   - **Suggested fix:** in the public `value` setter (toggle-group, multi-combobox) coerce `null`/`undefined`/string to `[]` (`Array.isArray(v) ? v : v ? String(v).split(/\s+/) : []`) and do not break in `updated()`; cover it with a unit test.
11. **Cost of the missing `nph-sidebar`**: the sheet says "nph-sidebar is not built yet"; the panel (background/width), subitem indentation, group line, item→rail-button swap, group in the collapsed menu and arrow-key navigation are the consumer's. Tokens exist (`--nph-sidebar-*`, `--nph-layout-sidebar-*`), but `--nph-sidebar-panel-spacing` (24px) does not fit a 40px rail in 64px.
   - **Suggested fix:** build `nph-sidebar` (container with `expanded|collapsed`, width/background/border via tokens, subitem indentation and line, automatic item→rail-button swap, collapsed group with flyout, ↑/↓ arrows between items) or document the complete composition recipe in the sheet; align `--nph-sidebar-panel-spacing` (24px) to the 40px rail in 64px (12px per side).
12. **`nph-switch` does not participate in `<form>`** (not even a `name` in the `.d.ts`); `FormData` comes out empty and `form.reset()` does not restore it — correct per the sheet, but different from checkbox and surprising. The `$event` of `nph-switch` is `Event`.
   - **Suggested fix:** if the intent is to be a form control, make `nph-switch` form-associated (`name`/`value`, reset); if not, say so explicitly in the sheet and the `.d.ts` and expose the missing `name`; type the event (`input`/`change` with `target.checked`) in `HTMLElementEventMap`.

### P2 — visual / small / documentation
- `nph-rail-button`: `counter` on the corner covers a large part of the 40px icon (light/dark/educacao). `nph-sidebar-item`: an open group and the active item use the same color token → two items look active (worse in dark).
  - **Suggested fix:** move the counter out of the icon area (40px rail → 44px with the badge overlapping only the corner and `max 2 digits` + `99+`), or use a dot without a number on the rail; fix the pill's maximum size.
- `nph-slider`: fixed width of 280px; with `inputs`+`steppers`+`limits` the numeric field becomes tiny; vertical has a fixed length. `nph-image size="media"` measures a fixed 256px, not the container. `nph-progress` has no width of its own. Vertical `nph-separator` sticks to the top with `align-self:stretch`. `nph-table sticky-header` fixes the area at 296px of scrolling (focusable) and leaves a 1px seam. `nph-table` "more" action does not open a menu. The toast's `time-bar` is almost invisible.
  - **Suggested fix:** replace `280px` with `width: 100%` with `min/max-width` (`--nph-slider-width`), reserve a minimum width for the numeric field (`ch` according to `max`), and allow vertical length via `--nph-slider-length`/`height`.
- `nph-input-otp` rejects an entire block paste containing any character outside `A-Za-z0-9` (e.g., `"123 456"`). *(Editorial note, after review: the proven case is block insertion through `beforeinput` with `inputType=insertText` (autofill, or a keyboard that pastes via `insertText`), as the `nph-input-otp` section of §4 states. A real paste (`insertFromPaste`) is already cleaned and is covered by `src/components/nph-input-otp/nph-input-otp.test.ts`. Triage this as an `insertText` finding, not as a paste fix.)*
  - **Suggested fix:** normalize the paste (remove separators/spaces and accept what remains instead of discarding the whole insertion), keeping the `length` limit.
- `<nph-option value="">` is born already selected in a select with value `''` and hides the placeholder.
  - **Suggested fix:** in the select, only treat `''` as "no selection" when there is no `nph-option` with an explicit `value=""`; document that the placeholder needs a non-empty `value`, or offer `nph-option placeholder`.
- `nph-tooltip`: `open=true` set in code closes by itself on focus/blur (the signal stays `true`); an invalid `side` leaves `open=true` with the bubble at `display:none`.
  - **Suggested fix:** see #6 (`nph-open-change` event); for an invalid `side`, fall back to `top` (and, with #2, warn) instead of staying open and invisible.
- `nph-alert-dialog` is recommended by the dialog sheet (destructive confirmation) but does not exist in the package. `nph-panel-menu` likewise (sidebar-item sheet).
  - **Suggested fix:** create `nph-alert-dialog` (or remove the recommendation from the sheets) and write a sheet for `nph-panel-menu`/remove the reference.
- Focus lost (BODY) after removing a focused chip and when clearing the filter in the data-table.
  - **Suggested fix:** when removing the chip/clearing the filter, move focus to the next logical target (next chip, search field) — in the data-table, return focus to the search input after `nph-filter-clear`.
- Sheets and tokens diverge in names (`sidebar/panel-background` × `--nph-sidebar-background`/`--nph-sidebar-panel-background`).
  - **Suggested fix:** rename in the sheet to the real tokens (`--nph-sidebar-background`, `--nph-sidebar-panel-background`) and run a test that checks that every token cited in `fichas/*.md` exists in `tokens.css`.
- `CUSTOM_ELEMENTS_SCHEMA` lets any property through (`[bogus]`, `[pressed]="'x'"`); only `$event` is typed (and only with `strictTemplates`: `CustomEvent<…Detail>`; without it, `any`). The package has rich types and `HTMLElementEventMap`, which helps; what is missing is a type/directive that checks `[prop]`.
  - **Suggested fix:** publish template `*.d.ts` (Volar/Angular Language Service: `@iatec/nephos/angular` with `NphXProps` + "typed element" directives) or generate `web-types.json`/`vscode-html-custom-data.json` from the manifest for the IDE; document `strictTemplates` to type `$event`.
- In `ng serve`, a "Multiple versions of Lit loaded" warning (does not appear in the production build — an artifact of the dev server's pre-bundle).
  - **Suggested fix:** no action on the package; document in `consuming.md` that it is a dev server warning (pre-bundle) and that `optimizeDeps`/`preserveSymlinks` are not needed.

## 3. Packaging findings (exports, types, peers, CSS, fonts)

Source: tarball of `origin/v/5.0.0`. Outside Angular, the repo's own checks pass: `npm run test:package` (41 tests) and `npm run pack:check` (publint + attw "All good!"; `node10` ignored by design).

| # | Finding | Severity |
|---|---|---|
| E1 | **`docs/consuming.md` out of date**: it says "Available in 5.0.0-rc.1: badge, button, icon, kbd, label, separator, skeleton, spinner, togglebutton, tooltip" (10), but the package generated from `v/5.0.0` exports **40** components. The branch's `package.json` is still `5.0.0-rc.1`, so the tarball is named "rc.1" with later content; Phase B will say whether the feed's `rc.2` is equivalent. | medium  **rc.2 status:** **Partially resolved in rc.2.** `docs/consuming.md` (rc.2) now says "Available in `5.0.0-rc.2`: every `nph-*` entry point the package exports" and points to `custom-elements.json`, with no outdated list; the root README still has no list. rc.2 package = 41 `nph-*` entries (40 + `nph-navigation-menu`); `exports` identical to Phase A's.  **Suggested fix:** keep `consuming.md` pointing to the manifest (already done in rc.2) and generate the component list automatically in the package build (a script that writes the `nph-*` table into the README/`consuming.md`). |
| E2 | **Fonts do not come in the package and the root `README.md` does not mention them.** Only `docs/consuming.md` says "load Noto Sans (400, 500, 600) and IBM Plex Mono (400) in your application". Here: `@fontsource/noto-sans` and `@fontsource/ibm-plex-mono` in `angular.json > styles` (works). Without that, the app falls back to the system font without warning. | medium  **rc.2 status:** **Still open.** The root README and `docs/consuming.md` (rc.2) remain unchanged regarding fonts; the package does not ship the fonts.  **Suggested fix:** include a "Fonts" section in the root `README.md` and in `consuming.md` with the `@fontsource/noto-sans` (400/500/600) + `@fontsource/ibm-plex-mono` (400) snippet and the `font-display`; optional: publish `@iatec/nephos/fonts.css`. |
| E3 | **202 build warnings** `Module '@fortawesome/pro-{light,solid}-svg-icons/faX' used by '@iatec/nephos/dist/shared/nph-icon-*.js' is not ESM` (CommonJS bailout) on every `ng build`. `consuming.md` only mentions the problem in the Blazor excerpt. The build passes, but the consumer has permanent noise and loses icon tree-shaking (there is a shared lazy chunk of ~190 kB, probably `nph-icon` + Font Awesome). | medium  **rc.2 status:** **Still open**: `ng build` against the feed emits the same **202** CommonJS icon warnings.  **Suggested fix:** publish the used icons as their own ESM modules (import from `@fortawesome/pro-*-svg-icons/index.mjs` or generate an `icons.js` with the 101 paths inside the package, without importing from Font Awesome at runtime) — eliminates the 202 warnings and the FA Pro peer; minimal alternative: import `{ faX } from '@fortawesome/pro-light-svg-icons'` (ESM barrel) with `sideEffects:false`. |
| E4 | **`custom-elements.json`**: 0 slots and 0 `cssParts` in all 40 components (sheets/`.d.ts` describe slots: avatar-stack, toolbar `center/end/checkbox`, dialog `footer`, textarea `actions`, combobox `shortcuts`, table `action`, data-table `toolbar/bulk`, field). 8 events appear with the **constant's name** instead of the real name: `NPH_CHIP_SELECTED_CHANGE_EVENT` (=`nph-selected-change`), `NPH_CHIP_REMOVE_EVENT` (`nph-remove`), `NPH_DIALOG_CLOSE_EVENT` (`nph-close`), `NPH_NOTIFICATION_ACTION_EVENT` (`nph-action`), `NPH_PAGINATION_CHANGE_EVENT` (`nph-page-change`), `NPH_SIDEBAR_ITEM_TOGGLE_EVENT` (`nph-toggle`), `NPH_TOGGLE_GROUP_VALUE_CHANGE_EVENT` (`nph-value-change`), `NPH_TOGGLEBUTTON_CHANGE_EVENT` (`nph-change`); `nph-image` has an event named `undefined`; `hasToolbar/hasBulk/hasCenter/hasChips` leak as attributes. Anyone reading the manifest (IDE, docs) gets the wrong API. | medium  **rc.2 status:** **Still open.** The rc.2 manifest has the same 8 constants in place of event names, 0 slots and 0 `cssParts`; for the new `nph-navigation-menu`, `items` is missing (only `narrow/open/active/label/menu-label/aria-label` appear).  **Suggested fix:** in `custom-elements-manifest.config.mjs`, resolve the event constants with a plugin that reads the literal value (or switch to literal strings in the `@fires`/`dispatchEvent`), declare `@slot`/`@csspart` (JSDoc) per component, and filter out `has*`/private members; validate the manifest in a `test:package` test (every event matches `/^nph-[a-z-]+$/`). |
| E5 | **Dev `console.error`/`console.warn` removed from the build** (see P0 #2): `dist/shared/nph-icon-*.js` contains `if (!validName) \`${quote(name)}${NPH_ICON_NAMES.length}\`;` — the remainder of a log call eliminated by the minifier. | **high**  **rc.2 status:** **Still open.** The `console.error`/`warn` remain removed from the rc.2 JS (same loose template literals in `dist/shared/nph-icon-*.js`); measured on navigation-menu: 4 invalid entries → 0×0, empty console.  **Suggested fix:** see #2 (keep dev logs in the build and test them). |
| E6 | **Types**: the `.d.ts` files export rich interfaces (`NphTableRow`, `NphDropdownMenuItem`, `NphBreadcrumbLevel`, …) and augment `HTMLElementTagNameMap`/`HTMLElementEventMap` — great. But several enum props are `string` in the class (e.g., `NphInput.size: string`, `type: string`) even though the union type is exported (`NphInputSize`). Props of custom elements are not checked by Angular under `CUSTOM_ELEMENTS_SCHEMA`. | low  **Suggested fix:** type the props with the exported unions (`size: NphInputSize`, `type: NphInputType`) in the classes; optional: publish a props `ElementTagNameMap` (`NphInputProps`) for the IDE. |
| E7 | **First install**: `~/.npmrc` references `${FONTAWESOME_NPM_AUTH_TOKEN}`. In a shell where the variable is not exported (non-interactive session, CI), `npm install` fails to resolve `@fortawesome/pro-light-svg-icons` (appears as `@undefined` in the `ERESOLVE` error and `npm view` asks for login). Not a Nephos defect, but it is the 1st obstacle and the README only says "needs a Font Awesome Pro npm token". | informational  **Suggested fix:** in the installation section of `consuming.md`, show `export FONTAWESOME_NPM_AUTH_TOKEN=…` and the warning that `~/.npmrc` uses `${VAR}`; in CI, an example of an `.npmrc` generated at runtime; a troubleshooting message for the `@undefined` `ERESOLVE` error. |
| E8 | **CSS**: `angular.json > styles` accepts the package specifier (`"@iatec/nephos/tokens.css"`, `"@iatec/nephos/scrollbar.css"`) — it worked; `consuming.md` shows the `node_modules/.../dist/…` path. **`nph-empty` assets**: the glob `empty-no-option-found*.png` → `/assets/` works (200 in dev and production); outside the root (`--base-href /app/`) the `new URL('../assets/…')` would point outside the app (P84 limit already documented; not tested). | OK  **Suggested fix:** update `consuming.md` to show `"@iatec/nephos/tokens.css"` (package specifier) in `angular.json > styles`, and keep the `nph-empty` assets glob (and the `--base-href` warning). |
| E9 | **Peers/`exports`**: `lit ^3.3.3`, `pro-light/solid ^6.7.2` resolve; `exports` with wildcard `./nph-*` + `types` works with `moduleResolution: bundler` (TS 6) and `ng build`. No nested `node_modules` in the package. | OK  **Suggested fix:** none — keep (already correct). |
| E10 | Production build of the complete app (40 lazy routes): initial **333 kB** (80 kB gz) including tokens (74 kB) and fonts; each page is a lazy chunk; within the default `ng new` budget (1 MB error / 500 kB warning). | OK  **Suggested fix:** none — keep; optional: publish per-component size (like a bundle-size service) in the README. |
| E11 | **The feed's `latest` dist-tag points to `5.0.0-rc.1`** (`npm view @iatec/nephos dist-tags` → `{ rc: 5.0.0-rc.2, latest: 5.0.0-rc.1 }`), even though `README.md` and `docs/consuming.md` (rc.2) say the pipeline "never publishes to `latest`". An `npm install @iatec/nephos` without a tag installs rc.1 (without `nph-navigation-menu`). New in the rc.2 verification. | medium  **Suggested fix:** move the `latest` dist-tag to the future stable version or remove it (`npm dist-tag rm @iatec/nephos latest`) and ensure the pipeline always publishes with `--tag rc`; today `latest` points to rc.1, contradicting `consuming.md`. |
| E12 | **Phase A tarball version ≠ content**: the `package.json` of `v/5.0.0` at `a3414a1` still said `rc.1`. Resolved: the published rc.2 carries `5.0.0-rc.2`. | resolved  **Suggested fix:** already resolved in rc.2; keep the pipeline that stamps the version into `package.json` before `npm pack`. |
| E13 | **`tokens.css` and `scrollbar.css` byte-for-byte identical** between the Phase A tarball and rc.2 (no new navigation-menu token was needed beyond the existing ones). | OK  **Suggested fix:** none — keep. |

## 4. Findings by component (summary of verdicts)

Each section below comes from the batch notes (`notes/lote-*.md`, which stay in the repository with additional details, pending items and cross-cutting findings). Routes: `/<name-without-nph->`; code in `src/app/components/<name>.page.ts`.

### nph-button
- Proposed verdict: makes sense with adjustments — the contract works as the sheet describes it (matrix, sizes, loading, disabled, icon-only); the caveat is that the button never submits the native `<form>` and silently disappears on invalid input (including a wrong icon name).
- Route: `/button`   File: `src/app/components/button.page.ts`
- What worked:
  - All 21 valid severity×emphasis combinations render (primary/danger: solid, outline, light, ghost; secondary: solid, outline, ghost; info/warn/help/success: solid), in light, dark and `educacao`.
  - Sizes compact/default/large (28/36/44 px), icon-start, icon-end, both together with text.
  - Icon-only: `label` becomes the accessible name and the inner `nph-tooltip` opens on keyboard focus (`tooltip.text="Adicionar" open=true relation="name"` read in the shadow); `shape="circular"` ok.
  - `disabled`: a click (real mouse) does not reach `(click)` (counter 0) and Tab skips the button. `loading`: a real click and `host.click()` do not reach the consumer (counter 0), the button is still focusable by Tab (`nph-button[loading] > button` receives focus), `aria-busy=true aria-disabled=true`.
  - Enter and Space activate (`normal=2` after Enter+Space).
  - Props via Angular binding (`[text]`, `[severity]`, `[disabled]`, `[loading]`) react under OnPush/zoneless.
- DX problems in Angular:
  - Native `<form>`: the inner `<button>` is `type=button` (sheet). Clicking an `nph-button` inside a `<form>` does NOT fire `submit` (submit events = 0 after the click). There is no `type="submit"` attribute. The consumer needs `(click)="$any($event.target).closest('form').requestSubmit()"` (the `$any` comes from the validation app's code; without it `closest` does not exist on `EventTarget`). Same behavior with Angular's `(ngSubmit)`. Enter inside an `nph-input` in the same form does fire the submit (1 event, `FormData={"nome":"Joana"}`), so the "Enter submits, the button does not" flow is inconsistent for anyone who expects `<button type=submit>`.
  - `loading` applied via signal only takes effect from the next CD cycle (zoneless): only in the SAME tick (three synchronous `inner.click()` calls) do clicks reach the handler (clicks that arrived 2→5). With real clicks there is no problem: a double click (`clickCount: 2`), 2 clicks 20 ms apart and 3 clicks 60 ms apart always produced exactly 1 call (`cliques que chegaram: 1`, then 2, then 3 accumulated, one per round). Low-weight finding: it only affects code that fires programmatic `click()` calls in sequence.
  - Typing: `(click)` is `PointerEvent` (HTMLElementEventMap), ok.
- Visual / behavior problems:
  - Invalid input vanishes without a trace: `info outline`, `warn ghost`, `success light`, `secondary light`, `circular` with text, icon-only without `label`, two icons without text, `severity="foo"` → all with width 0 and an empty shadow root, with no error or warning in the console. (No text and no icon also vanishes, but that is the legitimate empty mount of the sheet, "nothing, no error", not a defect.) In Angular, a `[severity]="x"` coming from data (e.g., a status type) that falls outside the list makes the button disappear with no clue.
  - An icon name outside the core (`icon-start="search"`, a common icon name that does NOT exist in the core, the right one is `magnifying-glass`) also makes the whole button vanish (`w=0 icons=0 hasButton=false`), even with a valid `text`: a typo in the icon hides the whole action, with no warning.
- Gaps in the sheet/documentation:
  - The sheet says "native button with type=button" but does not say how the button should take part in a form (submit/reset) nor recommend a pattern; for Angular this is the most common case in screens.
  - It does not say that `loading` applied asynchronously does not protect clicks in the same tick.
  - It does not make clear that an invalid icon name hides the whole button.
- Evidence: `info outline => shadow vazio w=0`; form: `eventos submit=0 FormData=` after clicking `Enviar (sem tratamento)`; `cliques que chegaram: 2 => 5` with three synchronous `inner.click()` calls; `cliques: normal=2 · disabled=0 · loading=0`.

### nph-togglebutton
- Proposed verdict: makes sense — behavior faithful to the sheet and `$event` typed without `$any` under strictTemplates; only small discoverability rough edges.
- Route: `/togglebutton`   File: `src/app/components/togglebutton.page.ts`
- What worked:
  - Boolean `[pressed]`, `text`, icon-only with `label` (`icon-start="auto"` shows xmark/check), `icon-start="none"`, fixed icon, `icon-end="check"`, `invalid`, `disabled` (and `disabled` wins over `invalid`), sizes compact/default/large.
  - `(nph-change)`: real click → `detail={"pressed":true}`; Space and Enter toggle (2 events, `pressed` true then false). `[pressed]` set from code (`notif.set(true/false)`) does NOT fire an event (`eventos recebidos` stayed at 1) and `aria-pressed` follows.
  - `[(ngModel)]` and `formControlName`/`[formControl]` via `NephosValueAccessor`: a click updates the control (`news:true`), `patchValue` checks it (`true/true`), `reset({false,false})` unchecks it and clears dirty/touched, `form.disable()` sets `disabled=true` on the element.
  - Native `<form>`: `FormData=` empty (no form association, as the sheet says).
  - Typing under `strictTemplates: true` (via a temporary ngc): `(nph-change)="x = $event.detail.pressed"` compiles WITHOUT `$any` and without a cast; `$event` is `CustomEvent<NphTogglebuttonChangeDetail>`. `[pressed]="'texto'"` and `[bogus]="1"` also compile (CUSTOM_ELEMENTS_SCHEMA does not check properties).
- DX problems in Angular:
  - No CVA of its own: it needs the consumer's `NephosValueAccessor` (already known).
  - `CUSTOM_ELEMENTS_SCHEMA` lets wrong properties through (`[pressed]="'texto'"`, `[size]="42"`, `[bogus]`) with no error even under strict compilation; only `$event` is typed, through the global `HTMLElementEventMap` augment. The comment in `shared/event-log.ts` (`sob CUSTOM_ELEMENTS_SCHEMA $event não é tipado pelo HTMLElementEventMap`, i.e. "under CUSTOM_ELEMENTS_SCHEMA `$event` is not typed by HTMLElementEventMap") is outdated: under strictTemplates it is typed.
  - The current project does not turn on `strictTemplates`, so the typing above only shows up if the consuming app turns the option on.
- Visual / behavior problems:
  - Invalid inputs with no render: two icons with text, icon-only with `icon-start="none"`, `icon-only` without `label` and without `text` (only `icon-start="star"`), all vanished with no warning in the console.
  - At rest, when off, the button has no border and no background (it looks like text); the off state is hard to discover. On is ok in light/dark/`educacao`. The B/I icons (icon-only, off) are light, close to the contrast limit in dark (not measured).
- Gaps in the sheet/documentation:
  - It does not say how to compose with `nph-field` (error message outside the piece) in Angular, only that the error stays outside.
- Evidence: `notif() = false · último detail.pressed = true · eventos recebidos = 1 | el.pressed=false aria-pressed=false`; log `1. notif nph-change detail={"pressed":true}`; strict ngc: `error TS2322: Type 'CustomEvent<NphTogglebuttonChangeDetail>' is not assignable to type 'number'` (proof that `$event` is a typed CustomEvent).

### nph-toggle-group
> ATTENTION (known and reproducible error on this route): the console shows `TypeError: this.value.filter is not a function` on every load of `/toggle-group` (initial ngModel) and again on `reset (null)`. It is not a page bug: the `writeValue(null)` of `NephosValueAccessor` (`shared/`, outside the batch scope) writes `''` into `value`, which in the group is `string[]`. One-line fix for whoever edits `shared/`: in `writeValue`, for `nph-toggle-group` coerce `null`/`undefined` to `[]` (and not `''`). Library side: the public setter of `value` accepts any type and breaks inside `updated()` instead of coercing/warning.

- Proposed verdict: makes sense with adjustments — faithful to the sheet, but two Angular traps (the child's `value` is an attribute, a form `null` breaks the group) and no composition warning in dev.
- Route: `/toggle-group`   File: `src/app/components/toggle-group.page.ts`
- What worked:
  - single: checking one unchecks the others; clicking the checked one does nothing (only 1 event, in 2 clicks). multiple with `value="bold italic"` (attribute, space-separated tokens) checks several; events `detail={"value":["bold","underline"]}`.
  - `[value]` as `string[]` (signal): `view.set(['grid'])` checks `Grade` (Grid), `[]` clears everything, `['xyz']` (no such button) leaves `group.value=["xyz"]` and no `pressed`. Code never fires `nph-value-change` (events = 1 after 1 real click).
  - Sizes: the group writes `size` on the children; a child with `size="compact"` inside the `large` group became `large` (44 px).
  - Children generated by `@for` work (transparent in the light DOM), with icon-only + `label`.
  - `formControlName`: `patchValue({period:['semana']})` checks; `reset({period:[]})` clears; multiple `[(ngModel)]`: clicking `Negrito` (Bold) gives `["bold","italic"]`.
  - Keyboard on a standalone group: each button is a Tab stop (`Esquerda` → `Centro` → `Direita` → `Negrito`, i.e. Left, Center, Right, Bold), Space toggles; arrows do NOT move (only the toolbar does roving).
  - Typing under strictTemplates: `(nph-value-change)="s = $event.detail.value[0]"` compiles without `$any` (`CustomEvent<NphToggleGroupValueChangeDetail>`).
- DX problems in Angular:
  - `[value]` on the CHILD is a trap: the group reads `getAttribute('value')` and `nph-togglebutton` has no `value` property. `<nph-togglebutton [value]="o">` only creates an expando property; measured result: `attrs=,` and `pressed=false,false` with group `value="a"`. The right way is `value="a"` or `[attr.value]="o"` (measured: `pressed=true,false`). No warning. In `@for` this is very easy to get wrong.
  - Form control with `null`: `reset()` with no argument or the initial `writeValue(null)` of ngModel goes through `NephosValueAccessor`, which writes `''` (string) into `group.value`. The group does not coerce and blows up in the Lit update: `TypeError: this.value.filter is not a function at NphToggleGroup.checkComposition` — the error shows up in the console already on route load (initial ngModel) and again on `reset(null)`. The immediate cause is in `shared/nephos-value-accessor.ts` (it maps `null` → `''` for every `value` property, but in the group the type is `string[]`), but the library is not defensive either: the public setter accepts anything and breaks inside `updated()`. After the error the group is still usable (`pressed=false,false,false`).
  - `FormControl.disable()` disables nothing: the group has no `disabled` (sheet) and the accessor's `setDisabledState` ignores it; after `form.disable()` the children keep `disabled=false` and stay clickable. For Angular forms this is a real gap (a disabled control remains editable).
  - Value typed as `string[]` in ngModel/FormControl: the consumer has to remember arrays even in `single`.
- Visual / behavior problems:
  - `<div>` wrapper between group and buttons: group `value="a"` ended up with no button checked (the children are not seen) and the buttons work in isolation. No warning in the console.
  - Repeated `value`, single button, group without `label`: they render normally and no `console.warn` appeared (the sheet promises a warning in dev).
  - Dark and `educacao` ok; single group with buttons separated by space (no continuous "pill").
- Gaps in the sheet/documentation:
  - It does not warn about attribute × property on the child (the main trap in Angular/Vue/React); it should be listed under "anti-patterns".
  - It does not specify the coercion of `value` (string/null) nor what happens with a non-array value.
  - It does not say how to disable the whole group (it forces marking each child).
- Evidence: `tg-prop: value=["a"] pressed=false,false attrs=, props=a,b` × `tg-attr: value=["a"] pressed=true,false attrs=a,b props=,`; `TypeError: this.value.filter is not a function at NphToggleGroup.checkComposition`; `reset(null): el.value="" pressed=false,false,false ctrl={"period":null}`.

### nph-toolbar
- Proposed verdict: makes sense — for the first time the roving tabindex, `size` on the children and the applied-filters strip (focus + announcement) work as described; the cost is requiring direct children, with no warnings when this is done wrong.
- Route: `/toolbar`   File: `src/app/components/toolbar.page.ts`
- What worked:
  - Five types (bulk, page, tools, floating, applied-filters) in light, dark and `educacao`; slots `checkbox`, `center` (toggle-group), `end`; `count-text` by attribute and by dynamic `[countText]` (signal) in bulk; indeterminate checkbox in the slot.
  - `size` written on the direct children: a button with `size="compact"` in the `large` bar became 44 px; the buttons of the `large` bar measure 44 px.
  - Roving tabindex (real keyboard): first button with `tabindex` null and the others `-1`; `Negrito` (Bold) → `Itálico` (Italic) → (skips disabled `Sublinhado` (Underline) and the separator) → `Link`; End → `Mais` (More); → at the end wraps back to `Negrito`; ← at the start goes to `Mais`; Home → `Negrito`. Only one Tab stop: Tab from outside enters `Negrito` and the next Tab leaves the bar. In the `page` bar, ← inside the `nph-input` edits the text (focus stays on the input) and Tab → `Filtrar` (Filter), → goes to the button in the `end` slot (`Baixar`, Download).
  - applied-filters (`role="group"`, status region in the shadow): removing the 2nd chip with Enter on the X → focus on the next chip, announcement `Filtro removido: Equipe: Produto` (`{text}` replaced); removing the last → focus on the previous; `Limpar filtros` (Clear filters, Enter) → focus goes to the `trigger` (button `Filtrar`, `id="tb-filter-trigger"`) and announces `Todos os filtros foram limpos`; with an empty list the strip has height 0 and the `Limpar` button disappears, the `page` bar keeps its height. `(nph-remove)` per chip and a single `(nph-remove)` on the bar (it bubbles, `detail.text`) work; `@for` with `track f` removes the right chip.
  - Strict typing: `(nph-remove)` on the bar and on the chip is `CustomEvent<NphChipRemoveDetail>` (`$event.detail.text` without `$any`).
- DX problems in Angular:
  - `<div>` wrapper between bar and buttons (sheet anti-pattern) confirmed: with `size="large"` the buttons stay at `size=default` (36 px) and each button becomes a Tab stop (`Negrito`, `Itálico`, `Sublinhado`) without roving; no warning. In Angular the wrapper shows up by accident (an application component wrapping the button; `<ng-container>` ok, `<div>`/`<app-x>` not).
  - The `type="bogus"` bar and the bar without `label` do not render (width 0) with no message; `count-text` on `page` renders the bar but the text vanishes (and with no warning).
  - `(nph-remove)` per chip in `@for` requires identifying the item by closure or by `detail.text`; repeated texts make the handler on the bar ambiguous (the sheet gives no guidance).
  - Focus after removal depends on the consumer taking the chip out right in the handler: it worked with a signal in zoneless; focus reached the next chip after Angular's render, with no extra scripts.
- Visual / behavior problems:
  - Dark and `educacao` with no visible defects; the primary button in the `large` bar (`Novo (forçado compact)`, i.e. "New (forced compact)") is 44 px as expected.
  - `trigger` absent (single-handler demo): no warning in dev (the sheet promises a `console.warn`).
- Gaps in the sheet/documentation:
  - It does not say how the bar behaves when the consumer inserts/removes children via `@if`/`@for` later (tested: ok with `@for`).
  - The sheet asks for `<nph-chip>` with `remove-label`; it does not say what happens without it (not tested).
  - Pending item D-5 (narrow bar) is still open: the bar does not wrap.
  - `chip size` in the default bars matches (`default`); not tested: the `compact` applied-filters bar (sheet: compact chip), focus of the `trigger` when the button is disabled, nor SSR.
- Evidence: `tb-wrapper: Negrito size=default tabindex=null h=36 | ... tb-nowrapper: Negrito size=large tabindex=null h=44 | Itálico size=large tabindex=-1`; keyboard `ArrowRight => Itálico; ArrowRight => Link; End => Mais; ArrowRight => Negrito`; `after remove #2: focus=nph-chip[Período: Últimos 30 dias] ... status=Filtro removido: Equipe: Produto`; `after CLEAR: focus=nph-button[Filtrar] ... status=Todos os filtros foram limpos | bar h=0`.

### nph-dropdown-menu
- Proposed verdict: makes sense with adjustments — the menu itself (top layer, keyboard, events, items) is solid, but Angular's `[for]` breaks silently and an open/close event is missing.
- Route: `/dropdown-menu`   File: `src/app/components/dropdown-menu.page.ts`
- What worked:
  - Static `for="id"` + `[items]` + `(nph-item-select)`; header (`name`/`status`), group `label`, `separator`, `description`, `shortcut`, `count`, `tag`, icons, `severity="destructive"`, single, multiple, switch, disabled, loading, submenu; `size="compact"`; in light, dark and `educacao`.
  - Keyboard (real): Enter/Space/↓ on the trigger open on the first item; ↑ opens on the last; ↓/↑ with wrap, Home/End, typed letter (`m` → `Mover para...`; letters typed in sequence form a prefix, `md` matches nothing, standard behavior), Enter/Space activate, Esc closes and returns focus to the trigger (`aria-expanded=false`), Tab closes and focus moves on to the next tabbable element after the trigger (`nph-button#dm-full`). Clicking the trigger toggles (true → false); clicking outside closes and focus falls on `body` (it does not return to the trigger; the sheet only promises the return on Esc and selection). With the page scrolled while the menu is open the panel follows the trigger (`panelTop=155`, `triggerBottom=151`). The trigger receives `aria-haspopup=menu` and `aria-expanded=true` when opening.
  - Regular item/submenu → `{value, checked:null}` and closes; single → `{grid,true}` and closes; multiple (`E-mail`/`Nome`) and switch (`Sincronizar`) stay open with a new `checked`; disabled and loading receive focus and do not activate (log without an event).
  - `items` reassigned immutably in the consumer (`signal.update` with a new array and a new object only for the changed item): the consumer's state (`list:false, grid:true`) follows the element. Without reassigning, the menu swaps its internal list and the consumer's one gets outdated (`consumidor: list:true, grid:false` × `elemento: list:false, grid:true`), exactly as the sheet says.
  - Container with `overflow:hidden` + 78 px `transform`: the panel is `:popover-open` in the top layer (height 650 px, outside the container, no clipping). Menu inside `nph-toolbar` (trigger as a direct child) aligns to the trigger. A `disabled` or `loading` trigger does not open; a nonexistent `for` and `[items]="[]"` draw nothing.
  - Strict typing: `(nph-item-select)="s = $event.detail.value"` compiles without `$any` (`CustomEvent<NphDropdownMenuItemSelectDetail>`); the `NphDropdownMenuEntry`/`Header` types are exported and useful for the items array.
- DX problems in Angular:
  - `[for]="expr"` does NOT work: Angular maps the `for` attribute to the `htmlFor` property (as in `<label>`), so `el.for` stays `null` and the menu has no trigger (measured: `for=null htmlFor=row-btn-broken attr=null`, `menu.open=false` when the trigger is activated). Only static `for="id"` or `[attr.for]="expr"` work (measured with `@for` of rows: `for=row-btn-2`, `menu.open=true`). No error or warning. It is the most dangerous finding of the batch, since a `for` coming from `@for` is the typical case (a menu per table row).
  - No open/close event: the sheet only documents `nph-item-select`. With `[open]="flag()"`, Esc closes the menu but the signal stays `true` (`openFlag()=true · menu.open=false`); setting it again with `flag.set(true)` does not reopen (no value change). The `open` state cannot be kept in two-way. Read-only via `el.open`.
  - The trigger ID has to exist in the same root: it works with Angular (emulated View Encapsulation); not tested inside a component with `ShadowDom`.
  - The `items` object is read by the menu (copied on activation), but the consumer has to create the new list itself if it wants to reflect `checked` (mandatory pattern under OnPush/signals).
- Visual / behavior problems:
  - A tall menu (header + 20 items) opens inside the 930 px window with internal scrolling, visible focus (blue border) on each item; in dark and in `educacao` no defects.
  - The opening animation makes captures taken in <300 ms show the panel semi-transparent (normal).
- Gaps in the sheet/documentation:
  - It does not mention Angular's `for`→`htmlFor` mapping nor the use of `[attr.for]`.
  - It does not document an open/close event nor how to synchronize `open`.
  - `avatar` with a real URL and nested `submenu` (out of scope) were not exercised.
  - Flip upward when there is no space below and window resize with the menu open were not tested.
- Evidence: `for=row-btn-2 htmlFor=undefined attr=row-btn-2` (with `[attr.for]`) × `for=null htmlFor=row-btn-broken attr=null` (with `[for]`); `clip geo: panel {y:280, h:650, top:true}, box {y:231, h:78}`; `open=true: openFlag()=true · menu.open=true` → `after Esc closes: openFlag()=true · menu.open=false`; log `full nph-item-select detail={"value":"sync","checked":false}`.

### nph-field
- Proposed verdict: makes sense — the field→control contract (label/description/invalid/required/disabled written on the control) worked end to end with Reactive Forms, with no glue code beyond the consumer's CVA.
- Route: `/field`   File: `src/app/components/field.page.ts`
- What worked:
  - All the parts (label, required, info+info-label, help, error, counter, disabled). Error replaces help; the counter does not take the error color; disabled hides the error and brings the help back (also confirmed in `<fieldset disabled>`).
  - Composition with nph-input, nph-textarea, nph-select, nph-combobox, a group of nph-checkbox, a group of nph-radio and a group of nph-switch. Groups get `role=group`/`radiogroup` in the field's shadow.
  - Inspected contract: `[required]`, `[disabled]`, `[error]`, `[label]` changed by signal reach the control (`required`, `disabled`, `invalid`, `description`, `label`) immediately. A label that arrives 1.5 s later (setTimeout) also propagates.
  - Reactive Forms with 9 controls (input, textarea, select, combobox, 2 checkboxes, 2 radios, switch): `[error]="err(...)"` conditioned on `touched` works; the form's `patchValue`, `reset`, `disable()/enable()` are reflected in all the controls; the keyboard flowed `Nome` (Name) → select (arrows+Enter) → combobox (type+Enter) → checkbox (Space) → radio (arrow).
- DX problems in Angular:
  - The composition warning (two controls, no control, control + option, radio + checkbox) does not appear anywhere: the dev `console.warn` was removed from the library build. Angular does not help (CUSTOM_ELEMENTS_SCHEMA accepts anything), so the assembly error is silent. What is seen: with two controls only the first receives `label`/`description`; `Controle + opção` (control + option) becomes `role=group` and the input is left without a name; `Radio + checkbox` becomes a `radiogroup` with the checkbox inside. None of them breaks visually.
  - `required`/`disabled` on the field must be `[required]`/`[disabled]` or a bare attribute; `required="false"` would be true (already anticipated in the brief).
  - Inside `<fieldset disabled>` the control's `.disabled` property stays `false` (the control is inert inside); only `invalid`/`description` show the change. Consumer code that reads the host's `.disabled` does not see the fieldset.
  - It needs the consumer's CVA for `formControlName`; `touched` depends on the host's `focusout` (it worked).
- Visual / behavior problems: none in light, dark and `educacao` (asterisk, info icon, error, counter, groups). No layout difference between the field's `[disabled]` and the control's.
- Gaps in the sheet/documentation:
  - It does not say where the composition warning appears after the dev console was removed (today: nowhere).
  - It does not say what happens to the second control of a field with two (it receives nothing, silently).
  - It does not document the interaction with `<fieldset disabled>` beyond "disables the control" (the host's `disabled` property does not change).
- Evidence: `nph-field [required]=true` → control `{label:"Nome", description:"Mensagem de erro", invalid:true, required:true, disabled:false}`; with `disabled` → `{description:"Ajuda visível", invalid:false, disabled:true}`; invalid composition: `["nph-input:Dois controles","nph-input:-"]` (second input without a label).

### nph-label
- Proposed verdict: makes sense with adjustments — the association by `for` and the info tooltip work, but `[for]` (property binding) does NOT work in Angular, and `[attr.for]` is mandatory.
- Route: `/label`   File: `src/app/components/label.page.ts`
- What worked:
  - Static `for="id"` for a native input, nph-input, nph-textarea and nph-select: clicking the text takes focus to the control (`document.activeElement` checked). A dynamic `[attr.for]` swaps the target after a click on another button.
  - No Shadow DOM (`shadowRoot === null`), a stylesheet adopted by the document (`document.adoptedStyleSheets.length === 1`); inside the nph-field the field's shadow adopts the same sheet (2 sheets).
  - info + info-label: trigger `<button aria-label>` + `nph-tooltip`; the balloon opens on keyboard focus (Tab/Shift+Tab, not on `focus()` via script) with a focus ring. `info` without `info-label`: the trigger vanishes, the label stays. `info-label` without `info`: nothing.
  - `required` draws an `aria-hidden` asterisk; dynamic text via signal swaps the content.
- DX problems in Angular:
  - **`[for]="id"` does not work**: Angular maps the `for` property to `htmlFor` (DOM schema) and sets `el.htmlFor`, which does not exist on nph-label; `el.for` stays `null` and the attribute is not written. Evidence: `[a.for, a.getAttribute('for'), a.htmlFor] = [null, null, "lbl-din-1"]`. It works with a static attribute `for="x"` or `[attr.for]="x"`. No error, no warning: the click simply does not focus. It is the most likely trap for the Angular team.
  - The text is a property (`text`), not content; a child written by the consumer is NOT replaced as the sheet says: `<nph-label text="A">filho</nph-label>` ended up with `textContent = "filho do consumidortexto da propriedade"` (the child stays before the rendered `<label>`).
- Visual / behavior problems: the host is `display:block` (label + control on one line only if the consumer wants it). The balloon covers the label above it (expected, "above the label").
- Gaps in the sheet/documentation:
  - Nothing about `[for]` in Angular (mapping to `htmlFor`); it must be in the Angular consumption guide.
  - The sheet says the consumer's child would be replaced; in practice it stays in the DOM.
  - Hover (delay `motion/hover-delay`) was not tested.
- Evidence: `lab.querySelector('label')` → `<label class="nph-label__text">…`; `lab.shadowRoot === null`; `info-label` becomes `aria-label="Sobre este campo"` with `aria-describedby="nph-tooltip-1"`.

### nph-input
- Proposed verdict: makes sense with adjustments — control and field work; it needs a consumer CVA and vanishes silently with an invalid icon/type.
- Route: `/input`   File: `src/app/components/input.page.ts`
- What worked: types text/email/search, sizes compact/default/large, `icon-start`/`icon-end`+`clear-label`, `invalid`/`disabled`; `nph-field` with an error driven by Reactive Forms; `[(ngModel)]`; native `<form>` + `FormData` (ElementInternals works outside Angular Forms); `form.reset()`/`patchValue`/`disable` via the consumer's CVA.
- DX problems in Angular: no CVA (P0 #1); `FormControl` only updates on `change` (blur/Enter), not on every keystroke (the page shows `(input)` with a signal to see the value live); `icon-start="search"` (nonexistent name; the right one is `magnifying-glass`) makes the whole field vanish with no error (seen on the sample page itself before it was fixed).
- Visual / behavior problems: no visible defects in light; dark/`educacao` in batches B (field) and in the registration screen (`shots/cadastro-5-dark-educacao.png`).
- Gaps in the sheet/documentation: it does not say that invalid input vanishes silently.
- Evidence: route `/input`; `shots/cadastro-*.png`.

### nph-textarea
- Proposed verdict: makes sense — it behaves like a native `<textarea>` with footer, counter and actions, and the consumer's CVA is enough.
- Route: `/textarea`   File: `src/app/components/textarea.page.ts`
- What worked:
  - value (attribute = initial), placeholder, readonly (attribute and `[readOnly]`), invalid, disabled; disabled wins over readonly+invalid.
  - Counter built in Angular (signal + `(input)`), with `[counter]` and `[invalid]="excedeu()"`; going over the limit only marks it, it does not block.
  - `actions` slot with nph-button `size="compact"`: the footer appears with a counter or with just an action; buttons become `disabled` when the textarea is disabled (checked on the inner `<button>`); in readonly the footer does not appear (height 78 vs 122).
  - Growth: with 20 lines the textarea stopped at 218 px and scrolls inside (`overflow-y:auto`, `resize:none`).
  - Enter breaks the line (does not submit). `input` per keystroke; `change` on leaving (typing `Olá mundo⏎linha 2` + Tab → `change value="Olá mundo\nlinha 2"`). Setting from code does not generate an event.
  - Reactive Forms inside nph-field (error for required/minlength/maxlength only when touched), `patchValue`, `reset`, `[(ngModel)]` (including setting from code), native `<form>`: FormData `{"nativo":"valor inicial"}` → `"editado"`, `form.reset()` goes back to `valor inicial` (the initial value).
- DX problems in Angular:
  - The consumer's accessor ties the FormControl to `change` (blur): measured on the Reactive Forms textarea, after typing "abcdef" `form.value.descricao` was still `""`, `dirty:false` and the nph-field counter (computed from `valueChanges`) stayed at `0/100` until blur. For a live counter/validation the `(input)` must be wired by hand (which is what the counter demo does). Same for nph-input-otp.
  - The `$event` of `(input)` is an `InputEvent` (`detail === 0`): the shared `EventLog.push` would print `detail=0`; a helper `lv()` was needed to log the `value`.
  - The same `EventLog.push('change', $event)` works (shows `value=`).
- Visual / behavior problems: none in light, dark and `educacao`. No visible label (`label` was used only as an accessible name; the grid examples have no visible caption, which makes it hard to identify each one in a screenshot).
- Gaps in the sheet/documentation: the type of `readOnly` (property) vs the `readonly` attribute does not appear in an Angular example; resolved by trial (both work).
- Evidence: log `4. change value="Olá mundo\nlinha 2"`; readonly footer absent; buttons `true:true` (host and inner `<button>`) with `[disabled]`.

### nph-input-otp
- Proposed verdict: makes sense with adjustments — the component is solid, but block `input` with an invalid character is refused entirely and Angular's model only updates on commit.
- Route: `/input-otp`   File: `src/app/components/input-otp.page.ts`
- What worked:
  - `[length]="4"`, `size="large"`, `masked` (dots), invalid, disabled; initial value `ab-12 xyz!9` becomes `ab12xy` (ASCII alphanumeric only, cut at length).
  - Keystroke-by-keystroke typing: `12-345a67` → `12345a` (the `-` is dropped, cut at the 6th). `input` on every keystroke (6 events), `change` only with Enter (`change value="12345a"`). Setting from code (`value = "987654"`) logs nothing.
  - Inner input: `type=text`, `autocomplete="one-time-code"`, `maxLength=6`, `aria-label` = label. In nph-field the state-driven error appears on the cells (`invalid`) and on the `description`.
  - Enter inside a native `<form>` submits (`submit nativo` logged; FormData `{"nativo":"9876"}`); `[(ngModel)]` with `[length]="4"` updates on leaving the field; Reactive Forms (patch, reset, disable, error by touched).
- DX problems in Angular:
  - **FormControl only updates on commit**: after typing the 6 characters, `form.value.codigo` was still `""` and `valid:false` until Tab/Enter (`touched:false, dirty:false` until then). A "Submit" button tied to `form.valid` would stay disabled with the complete code on screen. To auto-validate on completion one has to listen to `(input)` (done this way in the `confirmar código` (confirm code) flow).
  - `[length]` is `number` in the type: `[length]="5"` compiles and the component simply does not render (0×0, no error in the production console). Same for `size="xl"` (free string). Nothing in TS helps.
  - `<nph-input-otp>` has `name` on the host; the inner `<input>` stays with `name=""` (only the host goes into the FormData, as the sheet says).
- Visual / behavior problems:
  - Block insertion (`beforeinput` with `inputType=insertText` and several characters, like autofill/a keyboard that pastes via insertText) with ANY character outside A-Za-z0-9 is refused entirely: `insertText "123 456"` → `beforeinput` with `defaultPrevented`, value stays empty. The source code confirms it (`nph-input-otp.ts`: `insertText` with `clean(data) !== data` → `preventDefault`). A real paste (`insertFromPaste`) is handled separately and cleaned. Risk for SMS/autofill that delivers "123-456" or "123 456" via insertText; real autofill was not tested.
  - Dark and `educacao` ok.
- Gaps in the sheet/documentation: the sheet says "any other typed character is discarded" and "the pasted code is cleaned", but it does not cover block insertion by insertText (autofill) with a separator; and it does not warn that Angular's `form.valid` only sees the code after the commit.
- Evidence: `ev: ["beforeinput:insertText:123 456:PREVENTED"], v: ""`; Reactive: `beforeCommit {"codigo":"","valid":false,"touched":false}` → after Tab `{"codigo":"246810","valid":true,"touched":true}`; invalid: `h:0,w:0,cells:0` for `length=5` and `size=xl`.

### nph-select
- Proposed verdict: makes sense — options via `@for`, `value` before the options and `formControlName` worked without surprises.
- Route: `/select`   File: `src/app/components/select.page.ts`
- What worked:
  - start none/icon/avatar (avatar with a data-URI SVG), own `icon`, secondary, dot by status (the dot does not go to the trigger), disabled, `size="large"`, `invalid`, no options (does not open).
  - **`value` before the options**: `value="sp"` + options arriving via signal/@for after 1.5 s → the trigger shows `São Paulo`; emptying and repopulating keeps the value (`n:0 → "Carregando..."`, then back to `São Paulo`). Same for `[value]` by property.
  - Value from code (`[value]="sel()"`) logs no event; a nonexistent value `zzz` is retained (`value:"zzz"`, the trigger shows the placeholder). User choice: `input` then `change` (`2. change… 1. input…`).
  - Keyboard: arrows open and move, Enter chooses and closes, Esc closes without choosing, End goes to the last, type-ahead (`b` opens on `Bélgica`), arrows skip the disabled option (`Aviso` → `Sucesso` → `Ajuda`, skipping `Erro (disabled)`).
  - A list in `overflow:hidden` is not clipped (top layer) and in a scrollable container it follows the trigger (`listTop` follows `trigBottom` +4 px at 0/30/60/90/120 px of scroll).
  - Reactive Forms (error by touched, patch, reset, disable), `[(ngModel)]`, native `<form>`: FormData with `cor`/`tam`, `reset()` goes back to the attribute's `value`.
- DX problems in Angular:
  - `required` on the native `<form>`: Angular (FormsModule) puts `novalidate` on the form, so `requestSubmit()` passes with the required select empty (`checkValidity()===false`, `validationMessage="Please select an item in the list."`, in English in the browser used). It is not Nephos's, but whoever tests native validation will be confused.
  - `size`, `start` and `icon` are `string` in the type: `start="foo"` and `size="xl"` compile and the component vanishes (0×0), with no warning. `start="icon" icon="magnifying-glass"` renders (the sheet says it warns; with no console, it does not warn).
- Visual / behavior problems: none in light, dark and `educacao` (list in the orange brand ok). The list appears with a fade (captures right after opening catch the middle of the animation).
- Gaps in the sheet/documentation: nothing about `required` + Angular's `novalidate`; the sheet does not say that `option value=""` matches the initial value `''` (see nph-option).
- Evidence: `{v:"sp", t:"São Paulo"}` with 0 options→4 options; keyboard `help` chosen after 5× ArrowDown; `nat1 FormData={"tam":"m"} valid=false`.

### nph-option
- Proposed verdict: makes sense — it only exists inside a list (select/combobox) and under that condition it fulfills the sheet; properties changing at runtime are noticed by the list.
- Route: `/option`   File: `src/app/components/option.page.ts`
- What worked:
  - start none/icon (default globe, own `icon`)/avatar (`src` and empty)/dot (6 statuses + no status = text color), secondary, disabled (not selectable).
  - Runtime mutation on an option inside `nph-select` with `value="b"`: changing the text (`{{ }}` by signal) updates the trigger (`Opção B (renomeada)`); disabled toggles on/off; changing `[value]` from b to b2 makes the trigger fall to the placeholder and come back when it returns to b (`selected` true/false matches).
  - Without `value` the value is the text with collapsed whitespace (`"Sem value explícito"`). `marker="checkbox"` inside nph-select shows a checkbox and behaves as a single choice (value "a" chosen).
  - A loose option outside a list renders as one row (240×36) with no error at all.
  - Invalid input (`start="foo"`, `status="bad"`, `icon="nope"`, `marker="x"`): all 4 end up with height 0, vanish from the list and cannot be chosen, with no error.
- DX problems in Angular: `start`, `status`, `icon`, `marker` are free strings (no literal union in the template with CUSTOM_ELEMENTS_SCHEMA); a wrong value = a silently invisible option. It is the most treacherous case when the list is generated from data (`@for`): an option with a `status` outside the list vanishes from the menu without a trace.
- Visual / behavior problems: **`<nph-option value="">` in a select with the default `value` `''` is born already selected** (the trigger showed `Valor vazio` (Empty value) in place of the placeholder). It is consistent with a native `<option value="">`, but it contradicts the expectation of whoever uses a placeholder; the sheet does not warn about it.
- Gaps in the sheet/documentation: it does not mention the collision of option `value=""` × placeholder; it does not say what happens with `marker="checkbox"` outside the multi-combobox (it works as single).
- Evidence: `invalidOpts [["Válida (controle)",0],["start=foo",0],…]` before opening and `listed` shows only the valid one at 36 px; `emptyVal {v:"", t:"Valor vazio"}`.

### nph-combobox
- Proposed verdict: makes sense with adjustments — filter, create, shortcuts, server search and APG keyboard work; adjustments: the consumer must reassign `options` and handle `nph-search` with empty text after a choice is made.
- Route: `/combobox`   File: `src/app/components/combobox.page.ts`
- What worked:
  - `[options]` with option, group label, separator, secondary, dot, icon, avatar and disabled; invalid entry is discarded. `contains` filter without case/accent difference (`sao` → `São Paulo`, typed fragment in bold).
  - "Server" search: `filter="none"` + `(nph-search)` + `setTimeout(700ms)` + `[loading]` + `loading-label` → spinner in the list, then reassigned results; the chosen text remains after choosing.
  - `creatable` + `create-label`: row `Criar "docs"` (Create "docs"); Enter fires `nph-create detail={"text":"docs"}` and then `change value="docs"`; the consumer added the option by reassigning the array (tags 2→3). `creatable` without `create-label` does not draw the row. `empty-heading/description` show the `nph-empty`; without those texts, typing `zzz` opens no list at all (no feedback).
  - `shortcuts` slot with nph-kbd; `clearable`+`clear-label`; `start` search/icon/avatar; Esc with the list closed clears the typed text; arrows skip disabled and pass through group labels/separator.
  - `value` set from code fires no event; `query` set from code writes and filters (`{v:"ce", q:"ba", t:"ba"}`); nonexistent value `xx` is retained with an empty field. `value="pe"` before the options: the field shows `Pernambuco` when they arrive.
  - Reactive Forms inside nph-field (touched error, patch, reset, disable), `[(ngModel)]`, native `<form>` with FormData and reset.
- DX problems in Angular:
  - **`options` mutated in place is not noticed**: `array.push(...)` on an already bound array leaves the list with 10 items (the signal shows 11); only reassigning (`[...a, x]`) updates it (12). Two barriers (this second one inferred; the Lit code was not read): Angular's binding does not rewrite the property when the reference is the same, and Lit would not re-render on internal mutation either; reassigning is mandatory in any case, which clashes with the Angular pattern of mutable arrays, with no warning.
  - **`nph-search` fires with `query: ""` right after the choice** (log: `nph-search {"query":"sa"}` → choose → `nph-search {"query":""}` → `change`). With `filter="none"`, a consumer that clears the options when the search is short (the validation app's case, `< 2` letters) ends up with `options=[]` and the saved `value` without an option (the field keeps showing `Salvador`). Whoever reloads from the server with the empty query makes an extra request.
  - `query` read from the host stays `""` after the choice; to reflect the typing in a signal you have to listen to `nph-search`.
  - Needs the consumer's CVA; `size`/`start`/`filter` are free strings: `filter="foo"`, `size="xl"` and `start="foo"` disappear (0×0); `clearable` without `clear-label` has no button; `loading` without `loading-label` draws a nameless spinner (`aria` null). All without any warning.
  - `$event` of `nph-search`/`nph-create` is `Event` (needs a cast to `CustomEvent<NphComboboxSearchDetail>`); the detail types are exported (`NphComboboxSearchDetail`, `NphComboboxCreateDetail`, `NphComboboxEntry`), which helps.
- Visual / behavior problems: `nph-kbd` is `display:block`: two kbd elements and the text in the `shortcuts` slot stack until the consumer wraps them in `inline-flex` (adjusted in the validation app). Dark + `educacao` checked with the list open (groups, avatar, dot).
- Gaps in the sheet/documentation: does not say that `nph-search` fires with empty text after the choice; does not say that mutating `options` does not update; without `empty-heading`, nothing appears when there is no result; the sheet shows `creatable` but not the pattern of reassigning the list.
- Evidence: `rowsAfterMutate:10, rowsAfterReassign:12`; log `3. change servidor value="salvador" / 2. nph-search detail={"query":""} / 1. nph-search detail={"query":"sa"}`.

### nph-multi-combobox
- Proposed verdict: makes sense — chips, counter, keyboard removal and the `value` string[] behave and the consumer's CVA covers the forms.
- Route: `/multi-combobox`   File: `src/app/components/multi-combobox.page.ts`
- What worked:
  - Chips with `remove-label` (`Remover Argentina` in the `aria-label`); without `remove-label` there is no button. `counter` + `subject` (badge with the count, one line); `counter` without `subject` shows only the counter; `chip-icon` shows the option's icon or `tag`. Size large 44 px, invalid, disabled.
  - Keyboard: typing `ar` filters (`Argentina`, `Paraguai`, fragment in bold), Enter checks and keeps the list open (the typed text is cleared after each check), ArrowDown+Enter checks the next one, Esc closes, Shift+Tab reaches the remove button of the last chip, Enter removes and focus returns to the input (`change value=["ar"]`).
  - Events: `input` then `change`, with an array `value`. `[value]` set from code fires no event; a value without an option (`["br","xx"]`) is retained, without a chip. Non-array values (`''`, `null`, `'br'`) become `[]` without throwing.
  - `value` before the options: `["pe","pb"]` + options after 1.5 s → chips and buttons `Remover Pernambuco`/`Remover Paraíba`. Many chips: the field grows in rows and the list opens below.
  - Reactive Forms (required = at least one, touched error, patch with array, reset, disable), `[(ngModel)]`, native `<form>`: `FormData.getAll("paises_n")` → `["br","ar"]` (defaultValue), change from code → `["cl","mx"]`, `reset()` goes back to the `defaultValue`.
  - A list in `overflow:hidden` is not clipped.
- DX problems in Angular:
  - `value` is a property only and the getter returns a new copy on every read (`m.value === m.value` is `false`; assigning `arr` and reading again gives another reference). It works with `[value]="signal()"`, but reference comparisons in the consumer never match.
  - The consumer's accessor does `v ?? ''` in `writeValue`: for `null` it would write `''` into the multi-combobox; the component tolerates it (becomes `[]`), so it does not break, but the generic accessor (`value` string) is not faithful to the `string[]` type.
  - `$event.target.value` in `(change)` is `string[]` (the `EventLog.push` prints it as JSON, good). `[counter]`/`[chipIcon]` must be property bindings (`[counter]="true"`); `counter="true"` would be a string.
- Visual / behavior problems: none in light and dark+`educacao` (chips and badge in the brand color). `size=large` checks out: empty = 44 px against 36 px for the default (the first 44 px measurement of the default was an artifact of the `grid` stretching the row). The list with `size=large` open was not measured.
- Gaps in the sheet/documentation: does not explain that the typed text is cleared on every check; focus after removing a chip goes to the input, not to the neighboring chip (the sheet does not say so); behavior of `value` returning a copy is not documented.
- Evidence: `change value=["ar"]` after removing; `FormData.getAll → ["br","ar"]`; `m.value=''/null/'br'` → `[]`.

### nph-checkbox
- Proposed verdict: makes sense with adjustments — the component meets the sheet (events, FormData, reset, fieldset, nph-field), but depends 100% on a CVA that the consumer must write and on binding conventions that are easy to get wrong.
- Route: `/checkbox`   File: `src/app/components/checkbox.page.ts`
- What worked:
  - `checked`/`indeterminate` (attribute and property), box-only with `label`, `invalid`, `disabled`, `disabled`+`invalid` (disabled wins): visual matches the sheet, light/dark and brands (`educacao` tested).
  - Native `(input)` and `(change)` reach Angular; `$event.target.checked` reads the right value; setting `[checked]` from code fires no event (checked: log with 2 entries after a real click, 0 after `Marcar/Desmarcar por código` (check/uncheck from code)).
  - Reactive Forms `formControlName` (boolean) via NephosValueAccessor: value, `valid` (requiredTrue), `patchValue`, `reset`, `disable()/enable()` are reflected on the host; `[(ngModel)]` likewise in both directions.
  - FormArray of checkboxes inside `nph-field`: `[formControl]="c"` in `@for` (direct children) works; the field creates `role="group"` with the `aria-label` from `label` and `aria-describedby`, writes `invalid` on all options (checked: `invalid=true,true,true` and the message `Escolha ao menos um canal.` (Choose at least one channel.) after `markAllAsTouched`).
  - Native `<form>` + FormData: a checked box sends `name=value` (default `value` `on`), two boxes with the same name send two entries, a disabled one does not send. Native reset goes back to the `checked` attribute (B goes back checked; A/C unchecked).
  - `fieldset disabled` disables the inner input; re-enabling goes back to normal.
  - Keyboard: focus via `focus()`/Tab on the host, Space toggles and fires input+change; focus ring visible.
  - Indeterminate parent (`Todos os arquivos` (All files)) synchronized by the page works; the user's click clears `indeterminate` on the host and the page's signal reapplies `[indeterminate]`.
- Angular DX problems (typing, binding, form/CVA, events, change detection, SSR):
  - No CVA of its own: `formControlName`/`ngModel` only work with the consumer's directive (see the `Achado: sem CVA` route (Finding: no CVA)). The accessor wires `checked`+`change`; the `(input)` (which also fires) is ignored, ok.
  - `[checked]` × `checked` trap: `[checked]="true"` is a property (marks the component as "dirty") and does NOT change the default state of the reset; only the literal `checked` attribute defines the default. Effect observed on the native reset: a box with `[checked]="true"` goes back to unchecked (`d` in the demo), one with the `checked` attribute goes back checked. In Angular the natural thing is to use `[checked]`, so the reset of a `<form>` whose state comes from a binding "loses" the default. The sheet describes the mechanism, but does not warn about the impact on frameworks that only bind properties.
  - `$event` under `CUSTOM_ELEMENTS_SCHEMA` is a generic `Event`: needs `$any($event.target).checked` or a typed helper; there are no event types (`HTMLElementEventMap`) nor an injected `NphCheckbox` in the JSX/template. The shell's `EventLog` prints `value="on"` (because the host has `value`) instead of `checked`: therefore, for a checkbox `checked` has to be formatted manually (adjusted in the demo).
  - The form state update by the CVA happens via `addEventListener` outside the template: with zoneless+OnPush the `<pre>` with `form.value` updated normally here because the host's `(focusout)` marks the view; a consumer that depends only on `change` may need `markForCheck`/a signal. A stale screen could not be reproduced on this page (the parent page re-rendered), so it stays as a risk, not a proven defect.
  - `disable()` on a focused field fires `focusout` and marks the control as `touched` (observed: `touched:true` right after `form.disable()`); similar to native behavior, only recording it.
- Visual / behavior problems (include dark/brands): none. Dark and the `educacao` brand legible (orange/amber brand on the checks). Without `size`, the box is fixed at 24 px (per the sheet).
- Gaps in the sheet/documentation: lacks guidance for Angular (`[checked]` binding × attribute and reset); nothing says how to obtain the group of options (the group's value) — the sheet mentions "group" but there is no group API: FormArray/`nph-field` only provide the ARIA semantics, the collection is up to the consumer (the sheet mentions "group logic" as a non-goal, ok). `required` does not exist on the checkbox (Angular's Validators.requiredTrue covers the validation, but without `aria-required` on the control; `aria-required` was only observed on the radiogroup of `nph-field required`; on the checkbox group it was not checked).
- Evidence: `FormData → [["a","on"],["c","c1"],["c","c2"]]` (b unchecked); `form-state: {"terms":true,...,"valid":true,"dirty":true}` after a real click; reset: `checked=false,true,false,false,false` for `[A, B(checked attr), C1, C2, D([checked]=true)]`.

### nph-radio
- Proposed verdict: makes sense — the group by `name`, the APG keyboard and the integration with `nph-field`/forms work very well; only the consumer's CVA and `[checked]` + reset call for attention.
- Route: `/radio`   File: `src/app/components/radio.page.ts`
- What worked:
  - Group by `name` in the same root: real exclusivity, from click, keyboard and code (checking C from code unchecks A; `Ler grupo` (Read group) reads `["c"]`). Two independent groups on the same page do not interfere.
  - Keyboard checked with real events: one Tab stop per group (the checked radio has `tabindex=0`, the others `-1`); Down arrows move and check, skip the `disabled` radio (D) and wrap (B→C→E→A), each step fires `input` and `change`; Tab leaves the group to the next element (button), not to another radio. With no radio checked, `tabindex=0` goes on the first.
  - `NephosRadioAccessor` with 3 radios sharing `formControlName="plano"` in `@for` inside `nph-field`: value, `valid`, `touched`, `dirty`, `patchValue('pro')` checks the right radio, `reset` unchecks all, `disable()` disables the 3, the field's error propagates `invalid=true,true,true`. `nph-field` creates `role="radiogroup"` with `aria-label`, `aria-required="true"` and `aria-describedby`.
  - `[value]="p.value"` binding inside `@for` works (the property→`writeValue` order did not break).
  - `[(ngModel)]` with a shared `name`: initial 'm' checked the right radio; click and code sync in both directions.
  - Native `<form>` + FormData: only the checked one gets in, under `name`; with none checked, nothing gets in.
  - role/aria-checked/aria-disabled come via ElementInternals (they do not appear as attributes on the host; the accessibility tree exposes them).
- Angular DX problems (typing, binding, form/CVA, events, change detection, SSR):
  - Needs the consumer's `NephosRadioAccessor` (one per radio over the same FormControl). The demo's accessor adds an `addEventListener('change')` on every `registerOnChange`, without removing it (potential leak if the control is swapped).
  - Native reset goes out of sync the signal: with `[checked]="cor() === c"`, `form.reset()` unchecks all radios (default = `checked` attribute, which does not exist) but `cor()` stays `vermelho` (red), because the reset does not fire `change`. Side effect of `[checked]` being a property; in Angular the right approach is to use the attribute/`formControlName` or listen to the form's `reset` and zero the signal.
  - `$event.target.value` needs `$any`.
  - A radio without `name` and a group of one: renders normally (the sheet promises a `console.warn` only in dev, removed from the build, so the consumer is not warned).
- Visual / behavior problems (include dark/brands): no problems in light/dark/`igrejas`; the `invalid` state of option E (error border) is quite subtle in dark.
- Gaps in the sheet/documentation: there is no way to read the "group" value (no group element, no group event); the consumer must listen to each radio or use a CVA. The sheet does not talk about Angular nor about `ngModel`/shared `name`.
- Evidence: keyboard log `focus b → focus c, input c, change c → focus e, input e, change e → focus a, input a, change a → Tab → focus NPH-BUTTON`; `radiogroup: <div role="radiogroup" aria-label="Plano" aria-describedby="message" aria-required="true">`; native reset: `FormData=[]` with `cor()=vermelho`.

### nph-switch
- Proposed verdict: makes sense — simple and correct behavior; just be careful not to expect participation in forms.
- Route: `/switch`   File: `src/app/components/switch.page.ts`
- What worked:
  - `checked` reflects, `invalid`, `disabled`, `disabled`+`invalid` (disabled wins), track-only with `label`.
  - Inner `<button role="switch" aria-checked>` (checked); `(input)` and `(change)` with `$event.target.checked`; Space and Enter toggle (events `input:true,change:true,input:false,change:false`); code fires no event.
  - `formControlName` and `[(ngModel)]` via NephosValueAccessor: value, `dirty`, `setValue`, `reset`, `disable()` (disables the inner button) ok in both directions.
  - Inside `nph-field` it becomes `role="group"`; the field's error propagates `invalid` to the options.
  - `fieldset disabled` disables the inner button; re-enabling restores it.
  - No form association, confirmed: `customElements.get('nph-switch').formAssociated === undefined`, `form.elements.length === 0`, empty FormData even with `name`/`value` and `checked`.
- Angular DX problems (typing, binding, form/CVA, events, change detection, SSR):
  - The consumer's CVA is mandatory (same as the other controls).
  - No form association: `form.reset()` does NOT restore the switch (a switch with the `checked` attribute turned off by the user stays off after a native reset; checked `[true,false] → [true,false]`), and the `name` on the host is ignored. Whoever migrates from checkbox to switch loses submission and reset; needs CVA/Forms to participate.
  - Generic `$event` (`$any($event.target).checked`).
- Visual / behavior problems (include dark/brands): none. Photographed in light and in dark+`educacao` (amber brand track, disabled with opacity). The color transition after switching theme/brand lasts more than 2.5 s on the switch: a screenshot right after the switch showed the blue track (intermediate color) instead of the final amber one (`rgb(153,101,27)` = `--nph-color-primary`).
- Gaps in the sheet/documentation: the sheet says "no form association" but does not warn about `name`/`value`: the d.ts has no `name`, and `name` attributes on the host are silently ignored; it also does not say that the form reset does not affect it.
- Evidence: `FormData = []` with `<nph-switch name="sw" value="1" checked>`; native reset keeps `[true,false]`.

### nph-slider
- Proposed verdict: makes sense with adjustments — single works well with the consumer's CVA; range has no integration with Angular Forms and the size (fixed 280 px width, fixed vertical length) calls for care.
- Route: `/slider`   File: `src/app/components/slider.page.ts`
- What worked:
  - single/range, `min/max/step`, `text`, `limits`, `marks` (0..50 step 10), `inputs`, `steppers` (with `decrease-label`/`increase-label`), `invalid`, `disabled` (wins), vertical: everything renders as the sheet says; `aria-valuenow/min/max`, the thumb's `aria-label` and `role="slider"` per thumb checked; range: `role="group"` with the `text` and thumbs named by `start-label`/`end-label`.
  - Real thumb drag: `input` (while dragging) and `change` (on release, ~one entry in the log) with a numeric `$event.target.value`; arrows ±step; Home/End = min/max; PageUp/PageDown = one tenth of the scale (50→60 with PageUp); in vertical ArrowUp/ArrowRight add; Home/End in range go to the other thumb (start=End→700, limited by the end).
  - single with `formControlName` (number) inside `nph-field`: the field writes `label`, `description` (support) and `invalid` (checked `label=Volume`, `description=De 0 a 100.` (From 0 to 100.)); numeric value (`typeof` = number); `patchValue`, `reset`, `disable()`, and `ngModel` sync.
  - FormData: single `vol=25`; range two entries `preco=50`, `preco=400`; keyboard changes to `51`/`399`. Reset goes back to the attributes (single with attribute `value="25"` goes back to 25).
  - Range wired by hand to a FormGroup `{start,end}`: `[start]`/`[end]` come from the group and `(change)` writes back with `setValue(...)` + `markAsDirty/Touched`; keyboard/code/reset/custom validation (`faixa estreita demais` (range too narrow) in `nph-field`) work.
- Angular DX problems (typing, binding, form/CVA, events, change detection, SSR):
  - Range and Angular Forms: the `NephosValueAccessor` only covers `value` (single). For range there is NO CVA; what is possible: two controls (start/end) in a FormGroup wired by hand (`[start]`, `[end]`, `(change)`), or writing your own CVA with a `{start,end}` value. What is not possible: `formControlName` directly on `nph-slider mode="range"` (the accessor would read `value`, which in range is not the pair). In addition, the sheet has no typed range event: you read `target.start`/`target.end` with `$any`.
  - Range reset pattern in Angular: `start`/`end` as a literal attribute (`start="50" end="400"`) become the default of `form.reset()` (tested: reset goes back to 50/400), whereas `[start]="50" [end]="400"` (property binding) do NOT define the default: the reset goes back to the extremes 0/500 and the FormData comes out `preco2=0, preco2=500`. The single behaves the same (literal `value="25"` goes back to 25). For a dynamic default, `[attr.start]`/`[attr.end]` would be needed (not tested). The sheet describes the mechanism (attribute = default, property = current state), but does not warn that Angular's `[prop]` falls into the second case.
  - `[start]="faixa.controls.start.value"`: if the user drags and Angular reapplies the same value it already had, nothing changes (equal binding), so the source of truth has to be updated in `(change)`; without that the slider and the form diverge.
  - Generic `$event`; no types for `input`/`change` nor for `start`/`end` (a local type `SliderEl` was used).
- Visual / behavior problems (include dark/brands):
  - The host's default width is 280 px (computed `width: 280px` in `display:block`), even with a 460 px parent. Combining `inputs + steppers + limits` at that width the numeric field is left with ~9 px of text and shows `7` for the value 75 (visible in the screenshot; the field only shows correctly with `style="width:100%"`: 80 px field). The sheet says "the width can stretch to the parent", but the default is fixed and does not stretch on its own.
  - Vertical: the track has a fixed length of 280 px (`layout/input-width`, provisional D3 in the sheet); `height` on the host changes the host but not the track (host 150 px, track 280 px, overflows). The consumer cannot size a vertical slider; in a 220 px wrapper the content overlapped the next demo (the demo was fixed so as not to limit the height). Heights with `text`/`limits` differ from a vertical slider without text (tops misaligned).
  - Light, dark and `educacao` brand legible; invalid in red and disabled with opacity correct.
- Gaps in the sheet/documentation: no recipe for range in forms; no minimum-width hint for `inputs`+`steppers`+`limits`; vertical has no way to set the length; `marks` with `limits` (do not combine) and `text` inside `nph-field` (do not wire) are only anti-patterns, with no error.
- Evidence: `inputW 34.7px, inner 8.7px, val "75"` (slider 280 px, `inputs+steppers+limits`); vertical `host 352×…, track 280` after `style.height='150px'`; `FormData=[["vol","25"],["preco","50"],["preco","400"]]`; PageUp via real event: `kd:["PageUp/PageUp"]`, value 50→60.

### nph-avatar
- Proposed verdict: makes sense — simple, predictable and with good a11y; only a load-error signal is missing.
- Route: `/avatar`   File: `src/app/components/avatar.page.ts`
- What worked:
  - Sizes sm/md/lg = 24/32/40 px, square with radius; photo via `[src]` (a data URI SVG was used) and person icon without a photo.
  - Empty or whitespace-only `src`: icon; broken `src` (nonexistent host, 404): the icon stays and the `<img>` is `hidden`; switching `src` by binding (A, B, broken, empty) correctly restarts the wait.
  - a11y: with `label` → host `role="img"` + `aria-label`; without `label` or whitespace-only → `aria-hidden="true"` (checked); `<img alt="">` always.
  - List with `@for` (avatar + name) ok.
- Angular DX problems (typing, binding, form/CVA, events, change detection, SSR): none proven. No event: there is no way for the app to know the photo failed (no `(error)`), and the 404/ERR shows up only in the browser console. No initials.
- Visual / behavior problems (include dark/brands): no problems in light and in dark+`educacao` (photographed); avatar without a photo legible in both.
- Gaps in the sheet/documentation: no recipe for reacting to a broken photo (e.g., swapping in another image); the sheet states that "the icon appears while the photo loads and stays if it fails" (confirmed), but this means the app cannot distinguish "loading" from "failed".
- Evidence: `src="https://localhost:1/nao-existe.png"` → `<img alt="" hidden src=...>` and `nph-icon` present; `label=" "` → `aria-hidden="true"`, `role=null`.

### nph-avatar-stack
- Proposed verdict: makes sense — cohesive group with correct a11y; the composition rules (2–5, no label on the children) are only a dev warning, not enforced.
- Route: `/avatar-stack`   File: `src/app/components/avatar-stack.page.ts`
- What worked:
  - Direct `nph-avatar` children (via `@for`) with `[src]`; 2 to 5 avatars, the group's `size` sm/md/lg (the group writes `size` on each child and wins if the child changes later: `childSize=['md']` after `size='lg'` on the child), `[count]` draws "+N" (`count=0` draws nothing).
  - `label` → host `role="img"` + `aria-label`; avatars and count sit in an `aria-hidden` wrapper.
  - Dynamic: adding/removing children through Angular (`@for`) updates the group; reactive `[count]`.
- Angular DX problems (typing, binding, form/CVA, events, change detection, SSR):
  - `label` is mandatory and localized: the consumer must assemble the phrase (`Ana, Bruno e mais 2` (Ana, Bruno and 2 more)); the component neither computes it nor uses `count`.
  - Outside the promised composition (1 avatar, 6 avatars, avatars with their own `label`) it renders normally with no error or warning at runtime (only a `console.warn` in dev, removed from the build); with its own `label`, the wrapper's aria-hidden hides the avatars (confirmed `aria-label="Ana"` present but inside the hidden wrapper).
- Visual / behavior problems (include dark/brands): no problems in light/dark/`igrejas`; the "+N" overlaps the last avatar as described.
- Gaps in the sheet/documentation: no limit of 5 enforced (6 renders the same) nor a way to limit via a prop (`max`); the sheet says the count is "the consumer's".
- Evidence: `shadow: <span class="group" aria-hidden="true"><slot></slot><span class="count">+2</span></span>` and host `role="img" aria-label="Ana, Bruno, Carla e mais 2"`.

### nph-badge
- Proposed verdict: makes sense — static and predictable component; beware of invalid values that disappear without a warning.
- Route: `/badge`   File: `src/app/components/badge.page.ts`
- What worked:
  - Matrix of 7 severities × 2 emphases (solid/light) with `[severity]`/`emphasis`; core icons (circle-check, triangle-exclamation, circle-xmark, circle-info, circle-question, star, tag) before the text; `@for` with domain statuses.
  - Empty, whitespace-only or absent text: width 0 and empty shadow, no error; dynamic text (`[text]` alternating `""` ↔ `Ativo` (Active)) appears/disappears.
  - Light, dark and `educacao` legible (light emphasis in dark becomes a dark background with colored text).
- Angular DX problems (typing, binding, form/CVA, events, change detection, SSR): `[severity]` accepts a loose `string` (no type union in the template under CUSTOM_ELEMENTS_SCHEMA): a typo (`severity="perigo"`) compiles and disappears at runtime. Confirmed in the `Inválidos` (Invalid) demo.
- Visual / behavior problems (include dark/brands): none.
- Gaps in the sheet/documentation: the host has no `role` nor `aria-label`; the "accessible name" is only the text; no hint for screen readers to tell states apart. No warning that an empty badge disappears (it is intentional) but with an async `[text]` the layout "flickers".
- Evidence: `badge-bad-sev/emph/icon`: width 0, shadow `"<!---->"` and no console error; `badge-empty/blank/notext` likewise.

### nph-chip
- Proposed verdict: makes sense with adjustments — the removable/selectable model and the custom events are correct; there is a serious trap with Angular's `[readonly]` and a chip without `remove-label` vanishes silently.
- Route: `/chip`   File: `src/app/components/chip.page.ts`
- What worked:
  - Removable: `(nph-remove)` brings `detail:{text}`; the chip does not remove itself (the list only shrinks when the signal is updated; clicking on the body fires nothing); the X has `aria-label="Remover filtro <texto>"` (Remove filter <text>) (remove-label + text). Keyboard: focus on the X, Enter removes (log `nph-remove detail={"text":"Status: Aguardando"}`).
  - Selectable: `(nph-selected-change)` with `detail:{selected}`; `aria-pressed` reflects; `[selected]` controlled by the signal; `Selecionar todos por código` (Select all from code) fires no event (per the sheet).
  - Severities (6) × sizes (compact/default), `icon`, `avatar`+`avatar-src` (photo and person-icon fallback), `counter`, `marked`, `invalid`, `disabled` (inner `disabled` button, out of Tab), `disabled+invalid`: everything renders per the sheet, also in dark and in the `financeiro` brand.
  - Long text: cut with an ellipsis (label with `scrollWidth>clientWidth`) and an `nph-tooltip` with the full text appears on hover (confirmed in a screenshot).
- Angular DX problems (typing, binding, form/CVA, events, change detection, SSR):
  - *(Editorial note, after review: the proven failure is `nph-chip` only. `nph-textarea` declares `readOnly` with the attribute `readonly` (`src/components/nph-textarea/nph-textarea.ts`) and the textarea section of §4 records that both forms work; `nph-input` has no read-only state (`fichas/nph-input.md`). Read the next sentence's "any nph-* with a `readonly` property" as "any component that declares a `readonly` property of its own", which today is the chip.)*
  - TRAP `[readonly]="true"`: Angular remaps the `[readonly]` binding to the DOM property `readOnly` (native input name), not to `chip.readonly`. Result: the chip is left without `readonly`, gets an X without `remove-label` and does NOT render (width 0, empty shadow root, no console message). Observed: `readonly:false, readOnly:true, w:0`. Alternatives that work: literal attribute `readonly` or `[attr.readonly]="''"`. Applies to any nph-* with a `readonly` property (input/textarea/chip).
  - Silent invalid input (no `console.error`): the symptom is the component vanishing; it took effort to investigate here. The dev message was removed from the build.
  - Focus: when the focused chip is removed (Enter on the X) focus goes to `BODY`; there is no focus management, whoever removes must move the focus.
  - Generic `$event`; `detail` needs a cast `CustomEvent<{ text: string }>`; there are no exported event types in the template.
  - Boolean attributes (`marked`, `invalid`, `disabled`, `avatar`) work well with `[prop]="true"`.
- Visual / behavior problems (include dark/brands): no problems. The long-text tooltip overlaps the note above the demo (expected). The theme transition is slow (~1–2 s); an immediate screenshot shows intermediate colors (pale chips with light text), not a defect.
- Gaps in the sheet/documentation: the sheet lists the "removable chip with an X and no remove-label" as invalid input, but nothing warns that `readonly` via Angular binding breaks; it also does not say what to do with the focus after `nph-remove`.
- Evidence: `<nph-chip [readonly]="true">` → `{"readonly":false,"readOnly":true,"w":0}` and `shadowRoot.innerHTML="<!---->"`; `aria-label="Remover filtro Equipe: Design"`.

### nph-icon
- Proposed verdict: makes sense — minimal API, all 101 names render in light and solid; the only cost is that invalid input vanishes without a clue.
- Route: `/icon`   File: `src/app/components/icon.page.ts`
- What worked: grid with the 101 names from icons.txt x light/solid = 202 icons, all with `<svg>` in the shadow (0 missing). sm/md/lg = 16/20/24 px. Absent `variant` = light. `[name]`, `[variant]`, `[size]` by property change at runtime and redraw. `currentColor` inherited from the parent's `color` (crimson, token, dark background). Absent `label`, `""` and `"   "` => `aria-hidden="true"`; `label="Informação"` => `role="img"` + `aria-label`. Composition with `nph-button icon-start`.
- Angular DX problems (typing, binding, form/CVA, events, change detection, SSR): under CUSTOM_ELEMENTS_SCHEMA nothing is typed: `size="xl"`, `name="search"`, `variant="duotone"` compile without error. The types `NphIconName`/`NphIconSize` exist in `nph-icon.icons.d.ts` but the package's `exports` (`./nph-*`) does not expose that file: they cannot be imported (`@iatec/nephos/nph-icon.icons` does not resolve), so the consumer cannot type a list of names. `NPH_ICON_NAMES` likewise.
- Visual / behavior problems (include dark/brands): absent `size`, `size="xl"`, nonexistent name, `variant="duotone"`, no `name` and `name="Star"` (wrong case): host measured 0x0, no `<svg>`, no console error/warning. Dark and the `educacao` brand ok (they only change the inherited color).
- Gaps in the sheet/documentation: the sheet says `size` is required but does not state the symptom (vanishes silently; no fallback). It does not tell how the consumer gets the list of valid names (only the unexported d.ts).
- Evidence: `Medir` (Measure) => `{"caso":"i2","w":0,"h":0,"svg":false}` for no size; `{"caso":"i1","w":20,"h":20,"svg":true}` control. Grid: `{total:202, miss:[]}`.

### nph-image
- Proposed verdict: makes sense with adjustments — the component meets the sheet, but `status` outside Angular and an empty `src` require care from the consumer, and `media` does not follow the container.
- Route: `/image`   File: `src/app/components/image.page.ts`
- What worked: sizes xs/sm/md/lg/xl/2xl = 24/32/48/64/96/128 px square; `media` with ratio 1:1/4:3/16:9 (256x256, 256x192, 256x144); `xs` ignores `ratio`. Valid src => `loaded`; 404 => `error`; `""`, `"   "` and absent => `empty`. `(load)`/`(error)` on the host reach Angular and `$event.target.status` is already updated at the time of the event. `alt` with text => `role=img`+`aria-label`; empty/whitespace/absent `alt` => `aria-hidden="true"`. `interactive`: real click, Enter and Space fire `click` (detail=0 on the keyboard); Tab enters the inner button (shadow `BUTTON` active); `disabled` stays out of the Tab order, the mouse click and `host.click()` do not reach the consumer. Hover shows the veil with the eye; keyboard focus draws the ring. `interactive` without alt renders and is focusable.
- Angular DX problems (typing, binding, form/CVA, events, change detection, SSR): (1) `status` is a getter, not a reactive property: a direct `{{ img.status }}` in the template (template variable, OnPush, no listener) goes STALE. Measured: after `src` -> 404, `real="error"` and the screen kept showing `loaded`; after reloading, the screen showed `error` (previous value) while the real one was already `loaded`. It only shows correctly by chance when another listener of the same view forces CD. Solution: `(load)`/`(error)` => `signal.set($event.target.status)`. (2) Switching `src` to empty (`""`) fires NO event: the real `status` becomes `empty` but the signal fed by `(load)/(error)` stays `error`/`loaded`. The consumer must derive `empty` from its own `src`. (3) `load`/`error` events are plain `Event` (no detail); the host's `error` does not bubble (ok, like the native one) but the name collides with the `(error)` of a native `<img>`: no problem, just worth documenting. (4) No warning: `interactive` without `alt` did not print a `console.warn` (the sheet promises one in dev; the warn was removed from the build).
- Visual / behavior problems (include dark/brands): `size="media"` measures a fixed 256 px (token `image/media-width` = `core-layout-width-media`), NOT the container's width, even in a 360 px container; the sheet says "content width", which suggests filling. `size="huge"` and `media` + `ratio="3:2"` vanish (0x0) without error. Empty/error states are only a gray frame (illustration pending, as the sheet warns) and are identical to each other. Dark and `educacao` ok.
- Gaps in the sheet/documentation: does not say that `src=""` emits no event; does not say that `status` is not reactive for frameworks; "media" is ambiguous (fixed token width vs. fluid). No Angular example.
- Evidence: `b404_depois: {tela:"loaded", real:"error"}`; `avazio: {a:"error", real:"empty"}` (no event in the log); `media: ["1:1 media:256x256", ...]` inside a 360 px container.

### nph-kbd
- Proposed verdict: makes sense — one key per component, simple and static; the combination gap is the consumer's, as the sheet says.
- Route: `/kbd`   File: `src/app/components/kbd.page.ts`
- What worked: single key, combinations (Ctrl+K, Ctrl+Shift+P, symbols, arrows), shortcut list with `@for`, `[text]` by binding, text with a space ("Page Down") and long text (213 px) without breaking. Inline in the paragraph (`inline-block`) aligns on the baseline. `<kbd>` in the shadow with the text. Not focusable (`tabIndex -1`, `focus()` does not enter).
- Angular DX problems (typing, binding, form/CVA, events, change detection, SSR): none relevant. For a combination the consumer repeats `<nph-kbd>` in an `@for` and puts the "+" separator on their own; there is no API shortcut for `text="Ctrl+K"` (by contract, a single key).
- Visual / behavior problems (include dark/brands): `text=""`, `"   "` and absent: host 0x0 (nothing). Two adjacent `nph-kbd` without a gap sit glued together (bounding rectangles 292–316.9 and 316.9–338.9). Dark and `educacao` ok.
- Gaps in the sheet/documentation: does not define the expected size/alignment next to text (here it came out baseline ok) nor how to represent the "+" separator between keys (consumer convention).
- Evidence: `vaz: ["0x0 text=\"\" kbd=null", ..., "41x24 text=null kbd=Enter"]`; `colado: [[292,316.9],[316.9,338.9]]`.

### nph-separator
- Proposed verdict: makes sense with adjustments — works in the contexts of the sheet, but the host's `align-self: stretch` makes the vertical one with an explicit `height` stick to the top of a centered row.
- Route: `/separator`   File: `src/app/components/separator.page.ts`
- What worked: horizontal in block, flex column, menu and card: width = the container's (320, 240, 300). Vertical in flex row `align-items: stretch` with height 48 => 48; in grid => 48; in a row `align-items:center` without height => 19 (the row's height, via `align-self: stretch`); inside `nph-toolbar` (direct child) => 36, fitting in the group. `aria-hidden="true"` on the host; the drawing is the host's own (empty shadow).
- Angular DX problems (typing, binding, form/CVA, events, change detection, SSR): none from binding. `orientation` untyped (free string).
- Visual / behavior problems (include dark/brands): (1) Horizontal in flex column with `align-items:center` collapses to 0x1 (no width); horizontal in flex row => 0x1; vertical in a block parent or in flex column => 1x0: all as the sheet predicts ("otherwise the consumer gives the length"). (2) Gotcha: vertical with `style="height:24px"` in an `align-items:center` row next to 36 px buttons stayed at `top:0` of the container (the button is at `top:32`), because the host has `align-self: stretch` (computed) and an explicit `height` disables the stretch; the consumer's `align-self:center` is missing. (3) `orientation="diagonal"` => 0x0 without error. Dark/`educacao`: line color ok.
- Gaps in the sheet/documentation: does not mention the host's `align-self: stretch` nor the effect of giving `height` in a centered row.
- Evidence: `acoes: alignSelf:"stretch", top:0, h:24, parentH:100, btnTop:32`; `h-flexcol-center: "0x1"`, `invalido: ["0x0","320x1"]`.

### nph-skeleton
- Proposed verdict: makes sense — static shapes that match `nph-avatar`; swapping `@if` loading/real is trivial in Angular.
- Route: `/skeleton`   File: `src/app/components/skeleton.page.ts`
- What worked: `line` (16 px, 280 wide, `style="width:60%"` => 168), `block` with `height:96px`, `avatar-sm/md/lg` = 24/32/40, identical to the `nph-avatar` of the same size. Card in loading with `[attr.aria-busy]="carregando()"` + `@if` swapping in real content (avatar, text, badge) after `setTimeout`+signal (OnPush/zoneless updates). List with `@for` of skeletons swapped for a real list. Skeleton `aria-hidden="true"`, no role.
- Angular DX problems (typing, binding, form/CVA, events, change detection, SSR): `[attr.aria-busy]="bool"` writes `aria-busy="false"` instead of removing the attribute (Angular behavior, harmless). No help from the lib for `aria-busy`/`aria-live`: it belongs to the container.
- Visual / behavior problems (include dark/brands): `block` without height = 0 height (invisible), as the sheet warns. `shape="circle"`/`"avatar-xl"` => 0x0 without error. The gray `color/muted` is discreet in the light theme on a white card, but legible; in dark/`educacao` ok.
- Gaps in the sheet/documentation: no recipe for a list/table skeleton (several `line` elements with different widths are the consumer's); does not say whether the skeleton should announce "loading" to the screen reader (only `aria-busy` on the parent, which many readers ignore).
- Evidence: `paridade: ["skeleton:24x24","avatar:24x24","skeleton:32x32","avatar:32x32","skeleton:40x40","avatar:40x40"]`; `bloco-sem-altura: "skeleton:200x0"`.

### nph-spinner
- Proposed verdict: makes sense with adjustments — the spinner works, but "no label and no text" becomes aria-hidden without a warning and the button's click guard depends on Angular's CD.
- Route: `/spinner`   File: `src/app/components/spinner.page.ts`
- What worked: `sm` (default) 16 px, `md` 20 px; `circle-notch` from `nph-icon` with the `nph-spinner-turn` animation; inherited color (crimson, muted, dark background). `label` with text => `role="img"` + `aria-label`. In `nph-button [loading]="signal"`: the button swaps the start icon for the spinner, removes the end icon and the click does not reach the consumer's `(click)` while `loading` is applied (tested with repeated programmatic `click()` and a real click on an always-`loading` button). Content area with `@if` and `md` spinner ok.
- Angular DX problems (typing, binding, form/CVA, events, change detection, SSR): the `nph-button` click block only holds after the `loading` property reaches the DOM (asynchronous CD of zoneless): two fast real clicks (<~1 frame) both went through the `(click)` and the second landed in the log `(!)`. The consumer still needs their own guard (`if (enviando()) return`).
- Visual / behavior problems (include dark/brands): without `label` and without text beside it (the `SEM label e SEM texto` (NO label and NO text) case): host `aria-hidden="true"`, no name and no warning: the screen reader does not notice the wait. `label` becomes `role="img"`, not `status`/`progressbar` (semantically weak for "loading"). `size="lg"`/`"xl"` => 0x0 without error. Spin not tested with reduced motion.
- Gaps in the sheet/documentation: does not say whether the spinner with `label` should have `role=status`/a live region; does not guide the `aria-busy` pair on the container.
- Evidence: `a11y: [{"label":"Carregando pedidos","role":"img","ariaLabel":"Carregando pedidos"}, {"ariaHidden":"true"}, ...]`; log `click durante loading chegou ao consumidor (!)` after a fast double click.

### nph-progress
- Proposed verdict: makes sense — well-resolved bar (role on the track, valuetext, steps), moves with a signal in zoneless; the width "shrinks" outside a container with a width.
- Route: `/progress`   File: `src/app/components/progress.page.ts`
- What worked: determinate 0/25/50/75/100, `sm`/`md`, `label`, `value-text`, `help`. `[value]="signal()"` + `setInterval` in an OnPush component: `value`, `aria-valuenow` and the indicator (59 px -> 122 px -> 420 px) follow; at 100 it switches to `status="success"` (green, `circle-check` icon). Switching `indeterminate` -> `determinate` when the 1st value arrives (the looping segment leaves, `aria-valuenow` appears). `steps` 3, 4 and 5: `aria-valuenow` = 33/50/75 (`round(100*step/steps)`), `error` paints the current step red, `success` paints all green; `steps-vivo` with `Voltar`/`Avançar` (Back/Forward) updates. a11y: `role="progressbar"` on the shadow's track with `aria-labelledby="label"`, `aria-describedby="help"`, `aria-valuetext`; the host's `aria-label` (without `label`) is passed on to the track. Invalid combinations (value 150, -5, "abc", success without value, error at 40, indeterminate+success, steps=7, step>steps, type=circular, size=lg, status=warning): all vanish (0x0) without error.
- Angular DX problems (typing, binding, form/CVA, events, change detection, SSR): attributes need `[attr.value-text]` for a string binding with a hyphen (or `valueText` by property); `[value]`/`[steps]`/`[step]` by numeric property without typing (string "abc" compiles). `status` and `value` change in sequence: `[attr.status]="valor>=100 ? 'success':'active'"` together with `[value]` worked, but inverting the order (success before value=100) would render nothing for a frame; nothing in the lib protects against this.
- Visual / behavior problems (include dark/brands): without a width on the container, the bar shrinks to the size of the label text (min-width 48 px on the host): 111 px in a `width:max-content` parent, 48 px with only `aria-label`; with a 420 px parent => 420. (A CSS mistake in the validation app revealed this: `.col` with `align-items:flex-start` left all the bars with different widths.) Error without `help` draws (red) and should warn, but there is no console warning. Dark and `educacao`: active/success/error colors ok.
- Gaps in the sheet/documentation: does not document that the bar has no width of its own (depends on the container); does not say what to do with `value-text` when the type changes from indeterminate to determinate (it is the consumer's); update-order rule for `status` and `value`.
- Evidence: `medidas: p1..p11 w:0,h:0,progressbar:false; p12 290x8; p13 99x32`; `a: host 15, ind 59`, `b: host 30, ind 122`, `c: host 100, ind 420, status success`.

### nph-tooltip
- Proposed verdict: makes sense with adjustments — behavior is faithful to the sheet, but Angular's `[for]` never reaches the component (it becomes `htmlFor`) and `open` has no event back.
- Route: `/tooltip`   File: `src/app/components/tooltip.page.ts`
- What worked: literal `for="id"` wires the bubble and writes `aria-describedby` on the target (or `aria-labelledby` with `relation="name"`). Keyboard focus (Tab) opens right away; hover opens after the delay; Esc closes and keeps the focus; clicking the button runs the action (`cliques=1`) without closing the bubble while the pointer is over it. `side` top/bottom/left/right positions on the right side (gap ~8 px). Two-line text (235x40/44) without cutting. Icon-only button: `relation="name"` -> `aria-labelledby`. An icon-only `nph-button` already brings an internal tooltip (`for="control"`, `relation="name"`, in its shadow). `disabled` targets, `div` without `tabindex` and nonexistent `for`: no bubble (nor error). `div tabindex=0` opens on focus and on hover. Child Angular component with emulated encapsulation: works (`describedby` ok). Child with `ViewEncapsulation.ShadowDom`: tooltip in the same shadow root works (confirmed with real Tab); a tooltip in the page's light DOM pointing to an id inside the shadow does not wire (`aria-describedby` null). Bubble in the top layer overlaps the sidebar.
- Angular DX problems (typing, binding, form/CVA, events, change detection, SSR): (1) TRAP: `[for]="'id-' + i"` does NOT work. Angular's compiler maps the `for` property to `htmlFor` on any element (same rule as `<label>`); the `nph-tooltip` ends up with `for=null` and `htmlFor="id-1"`. You must use `[attr.for]` (or `for="literal"`). Applies to every nph-* with a `for` property: `nph-dropdown-menu`, `nph-label`. (2) `open` is one-way: after `[open]="true"`, a focus+blur made the tooltip close on its own (`prop:false`) while the consumer's signal stayed `true`; there is no close event, so the app state goes out of sync, and the next `true` does not reopen without going through `false`. (3) No type error for `side="diagonal"`. (4) On an external `nph-button` (`for` pointing to the `nph-button` host): opens on focus/hover, but `aria-describedby` stays on the host and the inner button does not receive it (a limit the sheet already cites); the description does not reach the screen reader.
- Visual / behavior problems (include dark/brands): `side="diagonal"` stays `open=true` with the bubble `display:none` (rect 0x0), without error. Disabled via hover: nothing opens. In dark the bubble is `rgb(69,69,69)` with text `rgb(227,227,227)`: legible, but the shadow is transparent, so the bubble stands out little from the `rgb(15,17,20)` background. `educacao` ok. Touch not tested.
- Gaps in the sheet/documentation: does not warn about `[for]`/`htmlFor` in Angular; does not document what happens with an invalid `side`; `open` without an event ("the tooltip turns it on and off by itself") and without guidance for the consumer that controls `open`.
- Evidence: `tips[27]: for=null attr=null htmlFor="side-top"`; `bind-bad: aria-describedby null` x `bind-good: "nph-tooltip-13"`; `afterFocusBlur: {prop:false, state:"open=true"}`; `diag: {open:true, popover:false, display:"none", rect:0x0}`.

### nph-empty
- Proposed verdict: makes sense — swaps the illustration by scheme on its own (including in a subtree) and the images are served; only deployment under a subpath deserves verification.
- Route: `/empty`   File: `src/app/components/empty.page.ts`
- What worked: `heading` + `description`, only `heading`, long text. `heading=""`, `"   "` and absent: 0x0 (nothing), no error; `description="   "` treated as absent (171 px of height against 207). Illustration: two stacked `<img alt="" aria-hidden="true">`, light with `opacity 1`/dark `0` and the reverse in dark; switches when clicking `Esquema` (Scheme) and also in a `data-nph-color-scheme="dark"` subtree inside a light root (and the opposite). Network: on the dev server the images come from `/@fs/.../node_modules/@iatec/nephos/dist/assets/empty-no-option-found.png` and `-dark.png` => 200; `/assets/empty-no-option-found*.png` (glob from angular.json) => 200 `image/png` (HEAD via fetch). List with `@if`/`@else`: filter `xyz` shows the `nph-empty` with a dynamic `[attr.description]`; `ma` brings back the 3-item list.
- Angular DX problems (typing, binding, form/CVA, events, change detection, SSR): the `assets` glob in `angular.json` is a consumer requirement: in dev the images come from the package's `@fs`, not from `/assets`, so the lack of the glob would probably only show up in the build (the build without the glob was not tested). In the production build the chunk sits at the root of `browser/` and `new URL('../assets/empty-no-option-found.png', import.meta.url)` resolves to `/assets/...` (which the glob covers); by URL arithmetic, with `--base-href /app/` the chunk sits at `/app/chunk-*.js` and the URL resolves to `/assets/...` outside `/app/` (NOT TESTED in a browser). Nothing announces the state ("status") to the screen reader: the sheet delegates this to the consumer; `role="status"` was used on a wrapper.
- Visual / behavior problems (include dark/brands): fixed host width of 280 px. Illustration and texts ok in dark and `educacao`. Observation: in a `scheme="light"` subtree inside a dark root the illustration follows the subtree, but text and background depend on the consumer's tokens (the test showed dark text on a dark background for lack of a `background` on the validation app's container, not because of a lib defect).
- Gaps in the sheet/documentation: the sheet cites the `angular.json` glob only indirectly; does not document the behavior with base-href/subpath nor whether the consumer needs the glob in dev; no example of use as a list's empty state.
- Evidence: network `GET .../dist/assets/empty-no-option-found.png → 200 OK` (and `-dark`); `assets: "200 image/png /assets/empty-no-option-found.png\n200 image/png /assets/empty-no-option-found-dark.png"`; `basico imgs: [light op 1, dark op 0]`, `darkPage: ["light:0","dark:1"]`.


### nph-table
- Proposed verdict: makes sense with adjustments — it covers reading/comparison and treegrid well, but `rows` is internal state mutated by the component, which requires a controlled pattern in Angular, and the "more" action does not open a menu.
- Route: `/table`   File: `src/app/components/table.page.ts`
- What worked:
  - Importable types (`NphTableColumn`, `NphTableRow`, `NphTableFooter`, `NphTableSize`, events) from `@iatec/nephos/nph-table`; typed arrays pass strictTemplates.
  - Basic: `caption`/`description`/`total`/`action` slot, `align: 'end'`, dash with no value using `no-value-label`, footer with total.
  - All 13 cell types (`text`, `person`, `badge`, `icon-text`, `thumbnail`, `link`, `truncated`, `status`, `button`, `actions`, `mixed-actions`, `rating`, `loading`). `nph-row-action` fires with `{row, action}` for `button` (`pay`), `actions` (`edit`/`more`) and `mixed-actions` (`edit`/`more`).
  - 2-level header (`group`), `size`, `framed`, `striped`, `grid`, `sticky-header` (the scroll area becomes 296px and a focusable `tabindex=0` region), horizontal scroll (wide table: region named `Tabela larga` (Wide table), 1390 of 418px), empty state with `empty-heading`.
  - Treegrid: `role=treegrid`, `aria-level/posinset/setsize/expanded`, one row is the Tab stop; tested on the keyboard: Down, Right (opens, fires `nph-row-toggle`), Right (goes to the first cell), Down on the cell keeps the column, Left returns to the row, Left on a leaf goes to the parent, End goes to the last row, Enter opens. All as in the sheet.
  - Controlled expandable detail (key→open map in a signal, `rows` in a `computed`): focus stays on the chevron after the re-render (`aria-expanded=true`, same button).
- DX problems in Angular (typing, binding, form/CVA, events, change detection, SSR):
  - **`rows` is mutated by the table** when a row is opened (`this.rows = replace(...)`: new array with `open`). Measured: after opening, `el.rows !== rowsOriginal`. With `[rows]="naiveRows()"` (stable reference): (a) `signal.set(sameReference)` is a no-op in Angular and the open state is preserved; (b) reassigning the ORIGINAL reference in code closes everything (returns to the initial state); (c) `signal.set(clone)` (new array) makes Angular reassign `rows` and the table's open state is lost (`before [false,true,false]` → `after [false,false,false]`). Angular does not know that the property changed internally.
  - Pattern that works: the consumer stores only `open` in a map and derives `rows` (`computed`) from the data + map, updating the map in `(nph-row-toggle)`; that way Angular's new array and the internal one coincide. The sheet says "rows is always the state" but does not say that the consumer must take over that state.
  - No typing of `[prop]`/`$event` on a custom element (CUSTOM_ELEMENTS_SCHEMA): `$event` is `Event` and `[columns]`/`[rows]` accept anything (only the arrays that were typed in the validation app guarantee shape). From knowledge of Angular; a type error was not tested.
  - `cells` is `Record<string, NphTableCell>`: nothing prevents a `cells` key that does not exist in `columns` (not tested).
  - On-demand loading: it can be done with `loading: true` per row and then filling in `detail` (the chevron spins and does not open while `loading`), but the consumer has to invent a placeholder `detail` for the chevron to appear.
- Visual / behavior problems (include dark/brands):
  - Lit dev warning in the console when loading the route: `Element nph-table scheduled an update … after an update completed` (comes from the component's `measure()` calling `requestUpdate()` after updating). Dev only, does not break anything.
  - With `sticky-header` a 1px vertical seam appears between the two `th` (the second `th` has `box-shadow: rgb(250,250,250) -1px 0 0`); with `grid=false` no vertical line would be expected. Minor visual detail.
  - "more" (`ellipsis-vertical`) only fires `nph-row-action` with `action:'more'`; it does not open a menu. The sheet says that opening the `nph-dropdown-menu` is a follow-up. Since the button is inside the table's shadow root, there is no `id` in the same root for the dropdown's `for` (inference, not tested).
  - Dark/brands were not verified on the standalone `nph-table` (only on the data-table, which inherits the same styles).
- Gaps in the sheet/documentation:
  - The recipe for a controlled `rows` in Angular is missing (above).
  - `no-value-label`, `label` and `width` of `truncated` only warn in dev (no warning in the tested build): a table without a name or `truncated` without `width` render with no signal.
  - Invalid inputs (column without `header`, repeated key, `size="gigante"`) do not render and there is no message; an invalid "blank" cell was not tested.
  - Category (grouping) is still a pending decision (D1).
- Evidence: `naiveClone {before:[false,true,false], after:[false,false,false]}`; `naive1 {sameRefAsOriginal:false}`; log `nph-row-action p1/pay`, `p2/edit`, `p3/more`, `p1/edit`, `p1/more`.

### nph-data-table
- Proposed verdict: makes sense with adjustments — the controlled model works end to end in Angular (computed handles search/sort/page), with few frictions in focus and selection state.
- Route: `/data-table`   File: `src/app/components/data-table.page.ts`
- What worked:
  - Sorting: `sort-key`/`sort-direction` (`[sortKey]`, `[sortDirection]`) + `(nph-sort-change)`: 1st click `ascending`, 2nd `descending`, `aria-sort` on the header; sorted in Angular's `computed`.
  - Selection: `selectable`, `[selected]`, `(nph-selection-change)` with `detail.selected` (array of keys); the `bulk` bar replaces the `toolbar`, with `selected-text="{count} de {total} selecionadas"` (saw `2 de 60 selecionadas`: the total is `total-items`, not the rows on the page). `nph-toolbar` in the `toolbar` and `bulk` slots as direct children; search in `nph-input` with `(input)` keeps focus and cursor while typing (re-render on every keystroke with `[value]="search()"`).
  - `[actions]` (built-in ⋮ menu, with icons and a destructive item) → `nph-row-action` with `{row, action}` (`download`); deleting from the row and from the bulk bar worked.
  - Switch column: `switch-header`/`switch-label`/`switched` → `nph-row-switch` with `{row, checked}`.
  - `loading` (15 `nph-skeleton`, header visible) with simulated server pagination and `total-items` larger than `rows`.
  - Empty state from search: dynamic `empty-heading` + `clear-label` → button `Limpar filtro` (Clear filter) → `nph-filter-clear`; cleared the filter in Angular and the input went back to empty.
  - Built-in pagination: `page`, `page-size`, `page-sizes`, `total-items`, `(nph-page-change)` in `wide` (type `table`, with items per page), `middle` (label + select + range) and `narrow` (range only); switched the layout at runtime.
  - Rows with `detail` expand; a row with `children` is accepted without error but renders only the row, with no chevron and no children (minor: the sheet says it is invalid).
  - `hasToolbar`/`hasBulk` are not meant to be set: they are internal state via `slotchange` (they are `true` on instances with slots; they do not appear as an attribute).
  - Dark + `educacao`: brown bulk bar in the brand color, rows and headers legible.
- DX problems in Angular (typing, binding, form/CVA, events, change detection, SSR):
  - Types `NphDataTableColumn`/`NphDataTableRow` etc. importable; `sortDirection` accepts `''`.
  - The event list is not typed in the template (`$event` as `Event`).
  - The component does not validate `selected` against `rows`: `selected=['p12']` was set in code (the key of a person that had already been deleted) and the bulk bar showed `1 de 58 selecionadas` with no row checked. This came from the validation run's test shortcut, not from the Angular page (which prunes the selection on delete); but it is the consumer who prunes, and by design the sheet keeps selection from other pages.
  - Attributes `selected-text`, `page-label` etc.: dozens of texts (pagination-label, page-label, first-label, previous-label, next-label, last-label, position-text, page-size-label, select-all-label, select-label, actions-label, switch-label, selected-text, clear-label) have to be passed on each use; there is no default value and no way to configure them in one place.
  - Misclick/state: the click right after closing the ⋮ menu was "swallowed" (the menu layer still covered the row).
- Visual / behavior problems (include dark/brands):
  - Focus is lost when clearing the filter: after clicking `Limpar filtro`, the `activeElement` became `BODY` (the button disappeared). The sheet only covers focus when the bulk bar/footer goes away.
  - `pagination-layout` does not adapt by itself at 850/420px (the sheet says it is a pending D-1): the app has to measure and choose.
  - The Lit dev warning from `nph-table` also appears here (inherited).
- Gaps in the sheet/documentation:
  - It does not explain that the `total` in `selected-text` is `total-items`.
  - It does not explain how the consumer should handle selection when the filter changes (prune, keep).
  - No Angular integration example (computed/trackBy) nor one for server pagination.
- Evidence: log `nph-sort-change {"key":"person","direction":"descending"}`; `nph-selection-change {"selected":["p12","p48"]}`; `nph-row-action {"row":"p48","action":"download"}`; `nph-row-switch {"row":"p60","checked":false}`; layouts: `wide` type `table` 803px, `middle`/`narrow` type `range` 177px.

### nph-pagination
- Proposed verdict: makes sense — clear contract, 6 types, `[page]` + `(nph-page-change)` work without friction; the problems are `$event` typing and `page` outside the range.
- Route: `/pagination`   File: `src/app/components/pagination.page.ts`
- What worked:
  - The 6 types (`numbered`, `simple`, `edges`, `range`, `compact`, `table`) render with pt-BR texts passed by attribute (`page-label="Página {page}"`, `position-text="{start}–{end} de {total}"` etc.).
  - `[page]="signal()"` + `(nph-page-change)` updates the signal and the manual 2-way closes without a loop. Click on a number, arrows, go-to-page (typed 99 out of 42 pages: it went to 42 and the field emptied) and `page-size` in the `table` type's select (event with `pageSize: 25`).
  - Setting `page` in code does not fire an event (confirmed: 0 new log lines with `+1 (código)` and `Ir para 1 (código)`).
  - Derived count: `page-count=3` together with `total-items=250`/`page-size=25` drew 10 pages (the derived one wins, as the sheet says).
  - `lang`: under `lang="ar-EG"` the digits come out in Arabic-Indic, under `en` `12,500`, under `pt-BR` `12.500`. It works across shadow roots.
  - Invalid input (`type="infinito"`, `range` without total-items, `page-count="0"`) draws nothing, with no console error.
  - Dark + brand `educacao`: current page in the brand color, contrast ok.
- DX problems in Angular (typing, binding, form/CVA, events, change detection, SSR):
  - Under `CUSTOM_ELEMENTS_SCHEMA`, `$event` in the template is `Event`, not `CustomEvent<NphPaginationChangeDetail>`, even though the d.ts declares `HTMLElementEventMap['nph-page-change']`. Every handler needs a cast (`$any($event).detail.page` or a helper). This holds for every `nph-*` with its own event. *(Editorial note, after review: this is not universal. The report itself records, in the `nph-togglebutton`, `nph-toggle-group`, `nph-chip` and `nph-dropdown-menu` sections of §4 and in the CUSTOM_ELEMENTS_SCHEMA finding of §2, that under `strictTemplates` Angular infers `CustomEvent` for events such as `nph-change`, `nph-value-change`, `nph-remove` and `nph-item-select` without a cast. Treat the lost typing as a finding about specific events, to be confirmed one by one.)*
  - Numeric properties and arrays require `[prop]` (`[totalItems]="250"`, `[pageSizes]="[10,25,50]"`); `total-items="250"` as an attribute also works through the converter, but mixing styles is confusing. Nothing warns if you get it wrong (no binding typing on a custom element).
  - `{page}` etc. inside Angular template text breaks the parser (NG5002, "ICU message"); in an attribute it passes. A pitfall for whoever writes examples/documentation.
  - SSR not tested.
- Visual / behavior problems (include dark/brands):
  - `page` above the count draws the last page (as the sheet promises), but the component does not warn the consumer: the signal stays at 99 while the bar shows page 10 (confirmed: `elPage:99`, button `10` with `aria-current`). There is no correction event.
  - RTL not tested (only `lang="ar-EG"` was used, which changes number formatting and not direction; the sheet already declares RTL and forced-colors as not handled).
- Gaps in the sheet/documentation:
  - The sheet does not say how the consumer should react when `page` is out of range (reset the signal?).
  - There is no ready-made pt-BR guide (the `position-text` strings per type only appear in the Storybook stories/dictionary, not in the sheet).
  - When changing items per page away from page 1, the sheet says it "keeps the first item on screen"; that calculation was not tested.
- Evidence: log `nph-page-change[edges] detail={"page":42,"pageSize":null}`; `manual() = 99` with buttons `Página 1, 6, 7, 8, 9, 10*`; `type="infinito"` → `shadowRoot.childElementCount` 0 and height 0.

### nph-dialog
- Proposed verdict: makes sense with adjustments — focus, Esc, scrim, sizes and separators behave as in the sheet, but the Angular-controlled `open` goes out of sync silently and with no clean way out.
- Route: `/dialog`   File: `src/app/components/dialog.page.ts`
- What worked:
  - `[open]` via signal + `(nph-close)="open.set(false)"`: opens/closes; `detail.source` = `escape` / `close-button`. Clicking the scrim does not close.
  - Focus on open: in the form it went to the first `nph-input` (text selected); in the dialog with only buttons, to the first footer button; `autofocus` on field 2 (`<nph-input autofocus>`) was honored. On close, it returns to the button that opened it (`#btn-basic`, `#btn-form`, `#btn-a`).
  - Tab does not escape the dialog; long content (lg with 40 items) scrolls only the body with header and footer separators; `content` becomes a region with `tabindex=0` when it scrolls.
  - `preventDefault` in the template: `(nph-close)="$event.preventDefault()"` keeps it open with Esc and with the X. With a method and `form.dirty`: inline `nph-notification` warning inside the dialog, `nph-field` with error, `Descartar` (Discard) resets and closes, focus returns to the button.
  - Reactive Forms inside the dialog work (`formControlName` with the consumer's CVA). Enter in the field submits the `<form>` (`ngSubmit`) without a submit button.
  - Dialog over dialog: opens, A stays, Esc closes only B and returns focus to `#btn-b`; Esc again closes A and returns to `#btn-a`. No `console.warn` was seen (the sheet says it exists in dev).
  - `actions="stacked"`: with a narrow viewport, primary on top and full width (seen, but the viewport emulation was inconsistent, so the 768 breakpoint is not validated).
  - `size` is a ceiling: `lg` with a list hugged the content (434px of 720); the sheet warns about this.
  - `hide-close` (preset `nox`): no X button (`shadowRoot` without `nph-button.close`), exit only through the footer.
  - Dark + brand `educacao` (preset `nox` open): dark surface, page behind darkened by the scrim (`rgba(0,0,0,.45)` in light), visible focus ring on `Cancelar`, primary in the brand color; no visible problems. The light-mode scrim screenshots looked only slightly darkened, but reading the style and zooming indicate the scrim is active.
- DX problems in Angular (typing, binding, form/CVA, events, change detection, SSR):
  - **`open` goes out of sync.** The component sets `open=false` by itself when closing via Esc/X. If the consumer only did `[open]="aberto()"` and never listened to `nph-close`, the signal stays `true` with the dialog closed: clicking `Abrir` (Open) again does `set(true)` with no change, Angular does not reassign the property and the dialog does not reopen (confirmed: `open:false`, `naive() = true`, nothing happens on click). Each use needs `(nph-close)="x.set(false)"`. There is no `[(open)]`/`openChange`.
  - **A 2nd Esc in a row closes even with `preventDefault` (limit documented in the sheet, confirmed).** Measured with capture listeners and a real click to open: 1st Esc → `nph-close` with `cancelable=true` (blocked, `open` stays `true`); 2nd Esc → `nph-close` with `cancelable=false` + `cancel`/`close` of the inner `<dialog>`, and the dialog closes. Angular's handler received both events, but the 2nd `preventDefault()` is ignored; if the handler only blocks (as was done at first), the signal stays `true` with the dialog closed and the `Abrir` button does not reopen it. The handler has to check `e.cancelable` and, if false, do `lock.set(false)` (the page now does this). Note: in an earlier run, opening via `.click()` through JS (without real user activation), the dialog was seen closing with no new log line; it was not reproduced with a real open, so it is treated as an artifact of the test.
  - `$event` is `Event` (no `CustomEvent` typing), manual cast to read `detail.source`.
  - `nph-button` has no `type="submit"` nor association with a `<form>` (props: severity, emphasis, size, text, icon, label, disabled, loading, shape). The footer's `Salvar` (Save) button needs `(click)` and the `<form>` is left without a native submit; it helps that Enter in the field already submits.
  - The consumer's CVA listens to `change`, which `nph-input` only fires on blur/Enter: typed `Z` and pressed Esc, the dialog received `nph-close` with `form.dirty === false`, closed, and only afterwards did the control become `dirty` with the value `Z` (blur on close). The "unsaved changes" guard does not catch the last edited field. In real applications the CVA also needs to listen to `input`.
- Visual / behavior problems (include dark/brands):
  - Just once, when opening the `lg` preset for the first time on the page, focus went to the content's scroll region (`content`), not to the first footer button as the sheet describes; on the following openings it went to the button. It could not be reproduced reliably.
  - The test screen is not responsive (fixed 260px sidebar), so the dialog at a 375px viewport was not validated.
- Gaps in the sheet/documentation:
  - The sheet says to confirm a destructive action with `nph-alert-dialog`, which is not in the package (`dist/` has no `nph-alert-dialog`). The only option is a workaround with `nph-dialog` + danger button (which the sheet itself discourages).
  - There is no recipe for resynchronizing `open` with Angular (nor a warning about the trap above); the sheet says "`open` is the only way to open/close" but does not say that the component also writes to it.
  - The `console.warn` for dialog over dialog promised for dev did not appear (the library build seems to have removed the warnings).
- Evidence: `ev: ["click:SPAN","keydown:BUTTON:Escape","nph-close:NPH-DIALOG"]` with `open:false` and `naive() = true`; lock capture: `nph-close:cancelable=true`, `INNER cancel cancelable=true`, then `nph-close:cancelable=false`, `INNER cancel cancelable=false`, `INNER close`; `form.dirty` false on `nph-close` with `Z` typed.

### nph-notification
- Proposed verdict: makes sense — behavior faithful to the sheet (severities, duration, pause, preventDefault, loading→result in the same element); the toast region is good to document but is 100% the app's work.
- Route: `/notification`   File: `src/app/components/notification.page.ts`
- What worked:
  - Inline: 6 severities (subtle and solid), stacked/single-line layouts, reflow (`data-nph-reflowed` present), no title, `hide-close`; `role="alert"` on error/warning and `role="status"` on the others (read from the DOM).
  - Actions: `(nph-action)` with `detail.action` `primary`/`secondary`; the notification does not close by itself afterwards.
  - Toast: app region (`position: fixed`, bottom-right corner, `gap: var(--nph-notification-stack-gap)`) as the sheet describes; maximum 3 visible with a queue (`visíveis: 3 · na fila: 3`), the newest next to the corner (append last).
  - Success closes in ~6s and leaves the DOM with `@for … track`; error, toast with action and `duration=0` stay; hover pauses (stayed 8s+); `(nph-close)` with `source` `timeout` and `close-button`; `preventDefault()` on the timeout keeps the toast and the time does not restart (13.8s later it is still there).
  - Loading → success/error in the same element: changed `severity`/`heading`/`description` on the same item (`track t.id`), same DOM node, role `status`, close button comes back (loading had none).
  - Closing inline without removing from the array leaves the element in the DOM with `hidden` (display none), as the sheet warns; removing from the array makes it go away.
  - Invalid input (inline loading, `duration=3000`, action+time-bar, empty `description`) renders nothing.
  - Dark + `educacao`: good contrast and icons; solid legible.
- DX problems in Angular (typing, binding, form/CVA, events, change detection, SSR):
  - `$event` as `Event` (cast to `detail`).
  - Empty attributes: with `[action]="t.action ?? ''"` it is fine; passing `undefined` was not tested (risk of an invalid value).
  - All the toast logic (queue, limit of 3, removal, timers, switching severity) becomes an app service; nothing in the package helps.
- Visual / behavior problems (include dark/brands):
  - Stuck queue: with 3 toasts that do not close by themselves (error, with action, `duration=0`) the 4th never appears until someone closes one. The sheet says "maximum of 3, the rest waits" and also "error/action never close by themselves", with no guidance on what to do in this combination.
  - `time-bar`: the element exists (`nph-skeleton.time-bar`, 358x16, `animation: none`) but could not be seen in the screenshot and it is static (the sheet warns it is a skeleton until `nph-progress`); it does not show the remaining time.
  - Warning and error have almost equal surfaces in light (`rgb(253,238,231)` × `rgb(252,233,233)`); only the icon/title tell them apart.
  - The toast covers the page content with no scrim (expected; no pause was tested for screen readers).
- Gaps in the sheet/documentation:
  - The sheet documents the region (position, gap, max 3, newest appended last), but says that turning it into its own piece is a pending decision (D-1). Distance from the corner "is the app's": `--nph-layout-margin-compact` was used.
  - No guide for the stuck-queue case, nor for repeating/grouping identical toasts.
  - It is missing the effect of `time-bar` without a visible countdown (today only decorative).
- Evidence: `invalid ... h=0`; `after7s: [error, warning, info]` still present; `afterTask {sev:"success", sameElement:true, role:"status", closeBtn:true}`; `stay {hidden:true, inDom:true, display:"none"}`.

### nph-breadcrumb
- Proposed verdict: makes sense with adjustments — the visual and the semantics are correct, but `href` does not talk to the Angular Router without consumer code and the documentation suggests that it does.
- Route: `/breadcrumb`   File: `src/app/components/breadcrumb.page.ts`
- What worked:
  - `[levels]` as an object property (type `NphBreadcrumbLevel` exported, `import type { NphBreadcrumbLevel } from '@iatec/nephos/nph-breadcrumb'`): 2, 3 and 4 levels, with and without icons (light on the link, solid on the current page), rendered as in the sheet.
  - `collapsed` with 4, 5 and 6 levels (6 with one very long level name): draws the 1st level, `…`, the last two; the middle levels go in the button's menu. Keyboard: Tab reaches the `…` (visible focus ring), Enter opens (`aria-expanded=true`, `nph-dropdown-menu[open]`), ArrowDown navigates, Esc closes and returns focus to `button#ellipsis` (`aria-expanded=false`).
  - `label` → `nav[aria-label]`; `aria-label` on the host also becomes the name (the `nav` gets the same text). `label` and `aria-label` at the same time were not tested.
  - Invalid inputs (5 levels without collapsed; icons on only some; collapsed with 3; collapsed without `ellipsis-label`; `href="javascript:..."`; 1 level): in all of them the host ends up with height 0, no `nav` in the shadow and nothing in the console.
  - A native click crosses the shadow root (`composedPath()` contains the `<a>`); with a consumer listener, the hidden level in the collapsed menu also navigates as an SPA.
- DX problems in Angular:
  - `href` causes a full reload (see Cross-cutting finding 1). Cost to the consumer: `click` listener + `composedPath()` + `Router.navigateByUrl`.
  - `[levels]` is a property only (`attribute: false`): it needs `[levels]="..."`; JSON in an attribute does not work (consistent with the sheet).
  - Typing: under `CUSTOM_ELEMENTS_SCHEMA` nothing is checked in the template (`[levels]` accepts anything); the only check is the one made by declaring the array as `NphBreadcrumbLevel[]`.
  - `$event` of `(click)` handlers is a generic `Event`; it needs a cast to `MouseEvent`.
- Visual / behavior problems:
  - The hidden-levels menu opens as a popover over the content right below (expected); in the capture during the animation the page text shows underneath (animation transparency). No problem was seen after it settled.
  - Dark verified (legible). Brand `educacao` was not photographed on the breadcrumb (only on the rail-button).
- Gaps in the sheet/documentation:
  - The sheet says that a level without an accessible name "draws and warns" in dev; in the rc.1 build there is no warn (without `label` or `aria-label`: `nav` without `aria-label`, nothing in the console). Consistent with the removal of the dev console.error calls, but the sheet still promises it.
  - It does not say what happens with more than 4 levels when `collapsed` (accepts 5 and 6: the contract says "4 levels or more", ok).
  - The router sentence in the document does not mention frameworks that only intercept `routerLink` (Angular) nor how the consumer integrates.
  - It does not say how the consumer knows that "the trail does not fit": the decision to collapse is the consumer's (ResizeObserver/breakpoint on their own).
- Evidence: `nav-a` (no listener): click on `Entrada de dados` (`a[href="/input"]`) → `location.href=/input`, `window.__marker` undefined. `nav-b` (with listener): click on `Formulários` → URL `/field`, `__marker === 1`, same `timeOrigin`. Hidden-level: `button#ellipsis[aria-haspopup=menu][aria-expanded]`, `nph-dropdown-menu[for=ellipsis][open]`; `<a hidden href=null>` in the `nav` (synthetic anchor).

### nph-sidebar-item
- Proposed verdict: makes sense with adjustments — the row itself (link, group, counter, tooltip, actions) is solid and accessible, but without `nph-sidebar` the consumer builds the panel, subitems, active state and navigation.
- Route: `/sidebar-item`   File: `src/app/components/sidebar-item.page.ts`
- What worked:
  - Link: `<a id=control href>`; `[active]="true"` → `aria-current="page"` + icon `variant=solid`. Group: `<button aria-expanded>`. Disabled: `<a role=link aria-disabled>` without `href` (even if href was passed) and without tabindex, that is, out of the Tab order.
  - `counter` 0, 12, 128: pill at the end; `0` shows as `0` (the sheet allows "from zero up").
  - Group: click, Enter and Space toggle (`aria-expanded`) and fire `(nph-toggle)` with `detail={"expanded":true|false}`. Changing `[expanded]` in code fires nothing (empty log after the `Alternar por código` (Toggle in code) button).
  - `[actions]` + `actions-label`: button `nph-button#actions[icon-start=ellipsis-vertical][aria-haspopup=menu]` appears on hover and on focus, opens the `nph-dropdown-menu` with the entries (item, separator, destructive). `(nph-item-select)` → `detail={"value":"pin","checked":null}`. The click on the button/menu did not generate a row `click` (the log did not register the host's `(click)`), as the sheet says.
  - Tab: item → actions button (if any) → next item → group → first subitem. Visible focus with a rounded border. Disabled skipped.
  - Tooltip (`aria-describedby=nph-tooltip-N`) present when `tooltip` is given; absent on the disabled one.
  - `[active]` driven by the route: SPA navigation via listener (`?area=caixa`, `?area=rel-vendas`), the right item/subitem became `active` (`aria-current`).
  - Invalid input (9 cases: group+href; group active; link without href; counter -1; counter 1.5; actions without actions-label; icon `search`; no label; type `button`): all render height 0, no console.error.
  - Composition: 280px panel with `--nph-sidebar-panel-background`, `nph-togglebutton` switches item ⇄ rail-button; rail with counter, balloon on hover (opens above, overlaps the neighboring button).
- DX problems in Angular:
  - Without `nph-sidebar`, the consumer writes: panel, `@if` for the subitems, indentation, item→rail map, `isActive(href)` from `router.url`, `expanded` mirrored in a signal per group and the navigation listener. That is a lot of code for a "side menu".
  - `$event.detail` is not typed: `$any($event).detail.expanded`. The types exist (`NphSidebarItemToggleDetail`) but the template does not use them under CUSTOM_ELEMENTS_SCHEMA.
  - `(nph-item-select)` does not say which item emitted it (only `value`/`checked`): the consumer closes over the item in the template.
  - `[counter]="null"` accepted (used `it.counter ?? null`); `[href]=""` on a disabled item too (accepted).
  - href → full reload (Cross-cutting finding 1).
- Visual / behavior problems:
  - Long labels are cut with ellipses at 280px (expected); `tooltip` covers it. The item with a short `label` + a different `tooltip` shows the tooltip text, not the label (per the sheet: it does not follow the label).
  - An open group gets the same color as the active item (`sidebar-item-foreground-open` = `-active`): on a screen with an open group and an active item, two items look "active" (the color is the same; only the icon/chevron changes). By design, but confusing.
  - Dark verified on the expanded items (no breakage; see the open group × active point above, which in dark is even harder to tell apart). `educacao` was only photographed on the rail-button, not on the expanded items.
  - After an SPA navigation, there was an impression that the page scroll went back to the top; not confirmed (it may have been a reload from HMR).
- Gaps in the sheet/documentation:
  - Width/background/indentation/rail switch: the sheet delegates to `nph-sidebar` ("not built yet") — see Cross-cutting finding 2.
  - It does not say how the consumer should wire `href` to the Router.
  - "More actions ... on touch it does not appear" but it does not say how the consumer gets the same shortcut on touch (only: "always with the same actions on the destination page").
  - `counter` 0 shows `0` — the sheet says "from zero up" but does not say whether zero should hide the pill (common in apps: hide it).
- Evidence: `nph-toggle detail={"expanded":true}`; `nph-item-select detail={"value":"pin","checked":null}`; disabled: `<a class=control role=link aria-disabled=true>` without href; focus: `nph-sidebar-item(Caixa de entrada) > nph-button#actions > button#control`.

### nph-sidebar-rail-button
- Proposed verdict: makes sense with adjustments — the button works (balloon, aria, disabled), but the `counter` at the corner covers a large part of the icon in the 40px and the item→rail switch is the consumer's.
- Route: `/sidebar-rail-button`   File: `src/app/components/sidebar-rail-button.page.ts`
- What worked:
  - `<a id=control href aria-label=label aria-labelledby=name>`; active: `aria-current=page` + solid icon + `rail-background-active` background; hover shows the balloon with the label (waited ~1s; opens above the button).
  - Tab through rail-buttons with visible focus; disabled ones skipped (`<a role=link aria-disabled>`, no tabindex). Tab: `Início` (Home) → `Página atual` (Current page) → `Caixa de entrada` (Inbox) → (…) → next, without passing through the disabled ones.
  - `counter`: `<span class=counter id=counter>12</span>` and `aria-labelledby="name counter"` (name + number, as in the sheet, WCAG 2.5.3).
  - Invalid inputs (no href not disabled; no label; no icon; icon `search`; counter -1; counter 2.5): nothing rendered, no console.error.
  - Dark and `educacao`: seen in the collapsed composition at a normal viewport; colors legible in both; active in `educacao` is dark brown with a light icon.
  - Composition toggle (nph-togglebutton) switched rail ⇄ expanded without error; click on the rail navigates via listener (SPA).
- DX problems in Angular:
  - Same `href` situation as the item. The item ↔ rail-button switch is a consumer `@if`, with two parallel templates for the same data (the consumer duplicates the label/icon/href/counter/disabled mapping).
  - With `counter` and `disabled`, the `aria-label` comes with the number (`Desabilitado com href e counter 2`) while the enabled one uses `aria-labelledby="name counter"` with `aria-label` only for the label: different ways of composing the name. Not a visible problem, but an inconsistency.
- Visual / behavior problems:
  - **Counter at the corner covers the icon**: the button is 40×40 and the pill (12, 128, 0, 2) sits over the top-right corner, hiding about half of the icon; with 3 digits (`128`) it covers almost the whole icon. The light and dark captures show the `inbox`/`calendar-days` icon almost illegible with a counter. For the sheet it is "top end corner (D-1)", but the pill does not "leave" the corner.
  - The rail balloon opens over the neighboring button above (covers the neighbor's counter).
  - `nph-togglebutton` `Menu recolhido` (Collapsed menu) (pressed) in dark has low contrast (gray text on grayish blue). Not part of the batch, but it showed up in the composition.
- Gaps in the sheet/documentation:
  - It does not say how to represent a group in the collapsed menu (flyout tokens `--nph-sidebar-flyout-*` exist; no component).
  - `counter` 0: shows `0` (does not hide).
  - Width of the collapsed panel vs padding (`panel-spacing` 24px does not fit in 64px − 40px).
  - It does not say how the balloon behaves on touch (no hover).
- Evidence: `<a class=control href=/x aria-label="Caixa de entrada" aria-labelledby="name counter"><nph-icon .../><span class=counter id=counter>12</span></a>`; host 40×40 (`getBoundingClientRect`); disabled `<a role=link aria-disabled=true aria-label="Desabilitado com href e counter 2">`.

---

### nph-sidebar-subitem
- Proposed verdict: makes sense with adjustments — a simple and correct component, but it only serves inside a group assembled by the consumer and has no indentation of its own.
- Route: `/sidebar-subitem`   File: `src/app/components/sidebar-subitem.page.ts`
- What worked:
  - `<a id=control href>` with `aria-current="page"` when `[active]`; `[options]="true"` draws `nph-icon chevron-right size=sm` and remains a link; `[disabled]` → `<a role=link aria-disabled>` without href and out of the Tab order (with or without `href`).
  - `tooltip`: `aria-describedby=nph-tooltip-N`; opens via Tab (balloon `Anual com nome muito comprido que corta` appeared above when focusing by keyboard); on the disabled one with a tooltip there is no `aria-describedby` (no balloon).
  - In an open group (composition): `active` from `router.url`; Enter on the focused subitem navigated via listener (SPA), `active` changed to `Anual…`, focus remained.
  - Without `href` (not disabled) and without `label`: height 0, no console.error. A subitem outside a group (loose) renders normally, even though the sheet says "outside a group, use nph-sidebar-item".
- DX problems in Angular:
  - No event of its own: native click; the one who navigates is the consumer's listener (Finding 1). A subitem without a listener does a full reload (not tested on its own; it is the same `<a>`).
  - The group's indentation and vertical line are the consumer's (`padding-left`, `border-left` with `--nph-sidebar-group-line`); the sheet says this is `nph-sidebar`'s job.
- Visual / behavior problems:
  - Long labels are cut early with `options` (the chevron reduces the space): `Com options (chevron-ri…`.
  - The subitem's `active` only changes color/weight (no background): at a 28px indentation with the vertical line, it is discreet, but legible in light and dark (seen). Brand `educacao` not photographed for the subitem.
- Gaps in the sheet/documentation:
  - It does not define the group's indentation or line (they depend on `nph-sidebar`, which does not exist).
  - It does not say what happens with `options` (no associated list: visual only; ok) nor how the consumer opens that list.
  - It does not say that the subitem outside a group renders (it only recommends not using it).
- Evidence: `<a class=control href=/x aria-current=page>`; disabled: `<a class=control role=link aria-disabled=true>`; focus: `nph-sidebar-subitem(Anual com nome ...) > a#control`.

### nph-navigation-menu  (new in rc.2)
- Proposed verdict: makes sense with adjustments — the bar with triggers/panels, the keyboard and `narrow` work as in the sheet (disclosure navigation), but `href` × Angular Router, `open` without an event and silent invalid input apply here too.
- Route: `/navigation-menu`   File: `src/app/components/navigation-menu.page.ts`   Screen: `/tela/navegacao-superior`
- What worked:
  - `[items]` (typed union `NphNavigationMenuItem` with `NphNavigationMenuTopLink`/`Trigger`/`Group`/`Link`, exported in the `.d.ts`): links, 2 triggers with groups (label, title, description, icon), `current` on a top link and a panel link, `disabled` (item and link; out of the Tab order). The trigger of the panel that contains the current link gets `aria-current=true` (seen: `Comercial:true` when on `Faturas`).
  - Keyboard (real): Tab `Início` → `Produtos` → `Recursos`; Enter opens the panel (`aria-expanded=true`); Tab enters the panel links; Esc closes and returns focus to the trigger; the `disabled` item was skipped. No arrow keys, as the sheet says.
  - Hover: `open` is `false` at 150 ms and `true` at ~1 s (`motion/hover-delay` delay); closes ~1.2 s after leaving. Panel in the top layer (`:popover-open`), not clipped by `overflow`.
  - `narrow` (a boolean that the consumer decides; used with `matchMedia(max-width:700px)` and with a togglebutton): becomes the `Menu` button (`aria-label=menu-label`, `aria-expanded`) and opens the vertical list with all the items; at a 600px viewport it worked on the screen.
  - With Angular Router: real links `/button`, `/input`… + `appNephosLinks` directive (click → `navigateByUrl`) = SPA navigation (the `window.__m` marker survived); `current` derived from `router.url` with `toSignal(router.events)` updates the bar.
  - Dark and brand `financeiro` (`shots/navsup-4-dark-financeiro.png`) without visible defects.
- DX problems in Angular:
  - **Without the consumer's directive, `href` causes a full reload** (same finding as breadcrumb/sidebar); `RouterLinkActive` does not reach the `<a>` elements, `current` has to be computed.
  - **`open` has no event**: with `[open]="sig()"` + Esc, the element closes and the signal stays `true` (measured: `elOpen=false`, `signal=true`); rebinding does not reopen. Same pattern as dialog/dropdown/tooltip.
  - `items` is a JS-only property (`attribute:false`) — ok in Angular via `[items]`, but reassigning the list in a `computed()` is mandatory (mutating does not update); `custom-elements.json` does not list `items`.
  - No events of its own: to know which link was activated the consumer listens to `click` and reads the `<a>` via `composedPath()`.
- Visual / behavior problems:
  - Invalid inputs (link without `href`, trigger without `groups`, `narrow` without `menu-label`, two `current`) → bar 0×0, empty shadow, **no message in the console** (the sheet promises `console.error` in dev; E5).
  - The wide panel renders all the panels in the DOM (links of all the triggers present in the shadow), only one visible: relevant for DOM readers/tests.
- Gaps in the sheet/documentation:
  - It does not say how to compose with the Angular Router (nor with any SPA router) beyond "the click is the native `click`".
  - It does not say whether `active` accepts a nonexistent `value` (not tested) nor what happens with `current` on `disabled` links.
- Evidence: `Tab -> BUTTON:Recursos; Enter -> open=true; Tab -> A:Documentação; Escape -> BUTTON:Recursos open=false`; `routed -> /button {m:1,url:/button}`; `apos Esc {elOpen:false, sig:true}`; `inv-*: 0x0 sr=7`.

## 5. How to reproduce

```bash
export FONTAWESOME_NPM_AUTH_TOKEN=...   # Font Awesome Pro peers; the @iatec feed credentials stay in the user's ~/.npmrc
npm install                              # the project's .npmrc only registers the @iatec scope (no credentials)
npx ng serve                             # http://localhost:4200 → navigable index with the 48 routes
npx ng build                             # production, strict + strictTemplates
```
Consumer workarounds, in `src/app/shared/`: `nephos-value-accessor.ts` (generic CVA + radio) and `nephos-router-links.ts` (`href` interception → Router).

## 6. What was NOT tested
SSR (`--ssr=false` by scope; analysis: `nph-label` adopts a stylesheet on the `document` at import, and `popover`/`ElementInternals`/`ShadowRoot` require polyfills/guards on the server — **not verified**); screen reader; touch/real mobile viewport; RTL; `prefers-reduced-motion`; brands beyond `sistemas` and `educacao` (some batches saw `igrejas`/`financeiro`); `ShadowDom` as the encapsulation of the consuming Angular component; deployment under a subpath (`--base-href`); `nph-sidebar-*` without a listener on subitem/rail-button; ctrl/cmd+click on the links. Interaction tests were done with headless Chrome (puppeteer-core) and the app's browser panel, which was shared and hidden for a good part of the run; captures in an animation state are a background-tab artifact, not the component's.

## 7. Phase B — installation from the feed (`5.0.0-rc.2`): result
- **Installation:** the project's `.npmrc` with only `@iatec:registry=https://sda-iatec.pkgs.visualstudio.com/_packaging/IATec.Community/npm/registry/` (no credentials; the feed's come from the user's `~/.npmrc`); `npm uninstall` of the tarball, `npm install @iatec/nephos@5.0.0-rc.2`, `vendor/` removed. `package.json`: `"@iatec/nephos": "^5.0.0-rc.2"`; `package-lock.json`: `resolved` = `https://sda-iatec.pkgs.visualstudio.com/_packaging/IATec.Community/npm/registry/@iatec/nephos/-/nephos-5.0.0-rc.2.tgz`, integrity `sha512-WFBsUJTvc7Lmw4SOv7r7urmU4x3Eyf06NqsfNqJ715KsG/NqIYj4H40CISF8Z78eDQjH0gigkcsB7I5PrRqC6w==` (**matches** the one reported). Peers resolve without conflict (lit 3.3.3, FA 6.7.2).
- **Build:** production `ng build` against the feed: exit 0, initial ≈ 334 kB (79 kB gz), 202 CommonJS warnings (E3). No other configuration changes relative to Phase A.
- **Browser:** the 48 routes (41 components + 4 screens + 3 findings) against `ng serve` (headless Chrome, error/warn console): 0 errors besides the 404s of deliberately broken images (`/avatar`, `/image`). Composed screens re-recorded (`cadastro` (sign-up), `listagem` (listing), `painel` (dashboard), `navegação superior` (top navigation)).
- **Differences between the Phase A tarball and the feed's rc.2** (measured): `exports` identical; +1 folder `dist/nph-navigation-menu`; `tokens.css` and `scrollbar.css` byte-for-byte identical; manifest with +1 component and nothing else; `consuming.md` adjusted (E1) and `latest` dist-tag still on rc.1 (E11); none of the P0/E2–E5 defects was fixed.
- **Status of the packaging findings in rc.2:** E1 partially resolved; E2, E3, E4, E5 still open; E6–E10 unchanged; E11 new; E12 resolved.
