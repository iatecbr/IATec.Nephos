```json
{
  "task": "DSA-73",
  "gate": "figma-docs-accepted",
  "date": "2026-11-10",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=5569-6530",
    "date": "2026-11-10",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "Indiane accepted the nph-stepper documentation frame (5569:6530, page 1626:36), COMPONENT_SET nph-stepper (5541:1622) and the step set (5540:581), with the Figma UX QA and the textual audit approved, and approved the points of the approval page: stepper/marker-size straight to core/icon-size/300; stepper/marker-border-width-current straight to core/focus-width/sm; stepper/connector-background-complete on color/primary-border; the text column width (stepper/text-max-width on the new core/layout-width/stepper-text, 160) and the minimum connector width (stepper/connector-min-width straight to core/space/600); the current step label wraps to two lines and is never cut; below 600 px the stepper becomes nph-progress of the steps type; the vertical stepper waits for nph-collapsible; two steps are allowed, the documentation asks for three to seven; the other stepper/* tokens only alias an existing semantic token."
  }
}
```

# DSA-73 — `figma-docs-accepted`

The documentation of `nph-stepper` (frame `5569:6530`) was accepted in Figma on 2026-11-10, in the file `DS-IA-NEPHOS 5.0`, with the Figma UX QA and the textual audit approved. The stepper enters the first version of Nephos. Its tokens came with this task and are on `v/5.0.0`.

What changed in the tokens with this task:

- New: the 40 `stepper/*` tokens. Every layer of the two Figma sets is bound to them; the visual did not change.
- New in core: `core/layout-width/stepper-text` (160), the maximum width of the text column of a step. A new value goes first to core (rule T9). The market sits between 128 and 140 in English (Carbon: minimum step width 128 and labels of up to 16 characters; Ant Design v4: description up to 140); 160 leaves room for Portuguese, which grows in translation.
- Four tokens go straight to core by decision, because no semantic token has their function: `stepper/marker-size` on `core/icon-size/300` (24; the semantic tokens of 24 are spacing, `layout/gutter` and `space/overlay-padding`, and `icon/size-lg` is documented as not to be used in a list; `layout/margin-default` is also 24 and is a page margin); `stepper/marker-border-width-current` on `core/focus-width/sm` (2, as `tabs/indicator-width`: no semantic token marks the current item); `stepper/connector-min-width` on `core/space/600` (24; the semantic tokens of 24, `layout/gutter` and `space/overlay-padding`, are spacing between elements, not the minimum length of a line; declared deviation: the description of `core/space/600` speaks of a function and does not change); `stepper/text-max-width` on `core/layout-width/stepper-text`.
- `stepper/connector-background-complete` points to `color/primary-border` with a declared deviation: the description of `color/primary-border` says not to use it as a fill, but the connector is a 1 px line that reads as a border, like the nph-progress bar (`progress/segment-background`) and the active line of the Carbon progress indicator. `color/primary` would measure 2.71:1 in dark.
- No new semantic token.

The `use` of thirteen semantic tokens in `design.md` now names nph-stepper where the accepted Figma uses them: `color/accent`, `color/muted`, `color/muted-foreground`, `color/border`, `color/primary-surface`, `color/primary-on-surface`, `color/primary-border`, `color/primary-text`, `focus/border`, `status/error`, `status/error-text`, `status/on-solid` and `motion/state-duration`.

There is no command output. The acceptance is a human observation, recorded in the json block above with the frame URL and the component sets.

The rest of this file is the contract converted to text, so that whoever codes does not need to open Figma. Figma property and value names stay as they are in Figma, between backticks (`etapas`, `atual`, `status`, `pendente`, `concluída`, `erro`, `estado`, `padrão`, `hover`, `foco`, `desabilitado`, `descrição`, `texto da descrição`, `opcional`, `rótulo`, `número`).

## Purpose

Marks the steps of a process in order, such as sign-up, hiring or a setup wizard, and shows where the person is: the completed steps, the current one, the ones still to do and the ones with an error.

It does not replace nph-tabs (views with no order), nph-progress (how much of a task is done, with no named steps), nph-breadcrumb (the place in a hierarchy) or a task list that the person does in any order.

## Component sets

| Set | Figma id | What it is |
|---|---|---|
| `nph-stepper / etapa` (the step set) | `5540:581` | One step. `status` (`pendente`, `atual`, `concluída`, `erro`) × `estado` (`padrão`, `hover`, `foco`, `desabilitado`); 13 variants, because the current step has only `padrão`. Booleans `descrição` and `opcional`, both off by default. Text properties `rótulo`, `número` and `texto da descrição`. |
| `nph-stepper` | `5541:1622` | The stepper. `etapas` (2 to 7) × `atual` (1 to the number of steps); 27 variants. Steps before the current one are completed, steps after it are pending, and a connector sits between two steps. |

The icons inside the marker are nph-icon. The cut label shows nph-tooltip. Below 600 px the stepper is replaced by nph-progress of the steps type.

## Tokens

| Token | Points to | Part |
|---|---|---|
| `stepper/marker-size` | `core/icon-size/300` (24) | Width and height of the marker |
| `stepper/marker-radius` | `radius/full` | Marker corner: a circle |
| `stepper/marker-border-width` | `border/width` | Outline of the pending marker |
| `stepper/marker-border-width-current` | `core/focus-width/sm` (2) | Ring of the current marker |
| `stepper/marker-icon-size` | `icon/size-sm` (16) | Check and triangle inside the marker |
| `stepper/marker-background` | `color/muted` | Background of the pending marker, decorative |
| `stepper/marker-border` | `color/border` | Outline of the pending marker, decorative |
| `stepper/marker-foreground` | `color/muted-foreground` | Number of the pending marker |
| `stepper/marker-border-current` | `color/primary-border` | Ring of the current marker |
| `stepper/marker-foreground-current` | `color/primary-text` | Number of the current marker |
| `stepper/marker-background-complete` | `color/primary-surface` | Background of the completed marker |
| `stepper/marker-foreground-complete` | `color/primary-on-surface` | Check of the completed marker |
| `stepper/marker-background-error` | `status/error` | Background of the marker with an error |
| `stepper/marker-foreground-error` | `status/on-solid` | Triangle of the marker with an error |
| `stepper/label-foreground` | `color/muted-foreground` | Label of the pending step |
| `stepper/label-foreground-hover` | `color/foreground` | Label of a clickable pending step on hover |
| `stepper/label-foreground-current` | `color/foreground` | Label of the current step, on `text/label-md-strong` |
| `stepper/label-foreground-complete` | `color/foreground` | Label of the completed step |
| `stepper/label-foreground-error` | `status/error-text` | Label of the step with an error |
| `stepper/description-foreground` | `color/muted-foreground` | Description and the word "Optional" |
| `stepper/description-foreground-error` | `status/error-text` | Description of the step with an error: the reason |
| `stepper/connector-background` | `color/border` | Connector after the current step, decorative |
| `stepper/connector-background-complete` | `color/primary-border` | Connector before the current step |
| `stepper/connector-thickness` | `border/width` | Thickness of the connector (1) |
| `stepper/connector-gap` | `space/inline` | Gap between a step and the connector (8) |
| `stepper/connector-min-width` | `core/space/600` (24) | Minimum width of the connector |
| `stepper/text-max-width` | `core/layout-width/stepper-text` (160) | Maximum width of the text column of a step |
| `stepper/item-gap` | `space/inline` | Gap between the marker and the texts (8) |
| `stepper/item-padding-x` | `space/inline` | Side padding of the step area (8) |
| `stepper/item-padding-y` | `space/inline-tight` | Top and bottom padding of the step area (4); it also places the connector on the marker center |
| `stepper/item-radius` | `radius/control` | Corners of the step area (hover and focus) |
| `stepper/item-background-hover` | `color/accent` | Hover background of the pending and completed steps; never on the step with an error or with focus |
| `stepper/item-disabled-opacity` | `state/disabled-opacity` | The whole disabled step |
| `stepper/focus-border` | `focus/border` | 1 px focus border |
| `stepper/focus-border-width` | `border/width` | Width of the focus border |
| `stepper/focus-border-radius` | `focus/border-radius-control` | Corners of the focus border around `stepper/item-radius` |
| `stepper/focus-ring` | `focus/halo` | Focus halo, decorative |
| `stepper/focus-ring-width` | `focus/ring-width` | Width of the halo |
| `stepper/focus-radius` | `focus/radius-control-with-border` | Corners of the halo |
| `stepper/state-duration` | `motion/state-duration` | Status change and hover of a step; with reduced motion, the color changes at once |

Typography uses text styles, with no token: `text/label-sm` (number), `text/label-md` (label), `text/label-md-strong` (label of the current step), `text/body-sm` (description and "Optional"). No effect style.

In Figma the description text carries its 160 maximum as a number, because Figma does not bind a variable to the maximum width of a text layer; the text column and the label row carry `stepper/text-max-width`. In the code the whole text column uses `stepper/text-max-width`.

## Anatomy

In the step, from start to end: the marker and the text column, both aligned to the top. In the column, from top to bottom: label, description and "Optional". In the stepper: step, connector, step, all aligned to the top.

1. **Marker** — a 24 circle at the start of the step, aligned to the top; the number, the check or the triangle sits in its center. Pending: background `stepper/marker-background`, 1 px outline `stepper/marker-border` and the number in `stepper/marker-foreground`. Current: no background, 2 px ring `stepper/marker-border-current` and the number in `stepper/marker-foreground-current`. Completed: background `stepper/marker-background-complete` with the check in `stepper/marker-foreground-complete`. Error: background `stepper/marker-background-error` with the triangle in `stepper/marker-foreground-error`.
2. **Label** — `text/label-md` at the top of the text column, aligned to the start and vertically centered with the marker. The text column stops at `stepper/text-max-width` (160): on the pending, completed and error steps the label stays on one line and is cut with an ellipsis, with the whole text in nph-tooltip; on the current step it wraps to up to two lines and is never cut. Current: `text/label-md-strong`. Colors by status in the token table.
3. **Description** — `text/body-sm` below the label, aligned to the start, up to two lines inside the column; on the error step it says the reason (for example "Fix 2 fields"). Turned on by the `descrição` boolean; its text comes from `texto da descrição`, the reason included.
4. **Optional** — the word "Optional" in `text/body-sm`, at the end of the text column, aligned to the start. Turned on by the `opcional` boolean.
5. **Step area** — the frame that hugs the marker and the texts, with `stepper/item-padding-y` at top and bottom, `stepper/item-padding-x` on the sides and `stepper/item-gap` between the marker and the texts, corners `stepper/item-radius`, at least 32 high. It is the click target. It takes the hover background on the pending and completed steps, never with focus; on the error step, hover only underlines the label.
6. **Connector** — a 1 px line that stretches between two steps, `stepper/connector-gap` away from each, aligned to the top and passing through the marker center; `stepper/connector-background-complete` before the current step and `stepper/connector-background` after it. It never gets narrower than `stepper/connector-min-width`.
7. **Focus** — 1 px border `stepper/focus-border` and halo `stepper/focus-ring`, outside the step area and centered on it, with the corners following the area. It is not clipped, because the connector keeps the steps apart.

The stepper has no background, border or margin of its own: it lives at the top of the form, card or dialog, and the content of the current step comes right below it. The instance stretches to the width of where it lives (960 in the Figma preview), and the connector fills the rest.

## Properties

| Field | Rule |
|---|---|
| `etapas` | On nph-stepper: 2 to 7. The component accepts 2, but use 3 to 7; with more than 7, split the process. |
| `atual` | On nph-stepper: the position of the current step. Steps before it are completed and steps after it are pending. |
| `status` | On the step: `pendente`, `atual`, `concluída` or `erro`. Default: `pendente`. |
| `estado` | On the step: `padrão`, `hover`, `foco` or `desabilitado`. Default: `padrão`. Hover and focus exist on the pending, completed and error steps; the current step has only `padrão`. |
| `descrição` | Boolean; turns on the support line below the label. Default: off. Its text comes from `texto da descrição`; on the error step the description says the reason, through the same property. On the error hover variant, the underlined label is overridden on the layer (in Figma, linking it to `rótulo` would spread the underline to every variant). |
| `opcional` | Boolean; shows "Optional" below the label. Default: off. |
| `rótulo` and `número` | Texts of the step. A short label, one or two words. |
| Not a property | Error, disabled, description and optional of a step in the stepper are set on the step instance. The narrow width and the vertical stepper are not properties: below 600 px the stepper becomes nph-progress of the steps type, with "Step 2 of 4" and the current label; the vertical stepper is a skeleton until nph-collapsible exists, and then it uses the same step with a vertical connector. |

## Behavior

There is no stepper pattern in the WAI-ARIA APG. The stepper is navigation with an ordered list and links, following the W3C multi-page forms tutorial and the APG Link pattern. It is not a tablist. A rule marked *(appendix D)* is not in the documentation frame; it is the default behavior written in the Figma appendix (5572:7973, section D), with the source named after it.

| Input | What it does |
|---|---|
| Tab and Shift+Tab | Move the focus through the clickable steps, in list order. The current step and the disabled step stay out of Tab: the current step is never cut (the label wraps to two lines). A pending step of the linear stepper with a cut label enters Tab only to open nph-tooltip (as the cut text of nph-table). Inferred from the linear rule and nph-tooltip (DSA-48), not written in the frame: it stays a non-link, Enter does nothing, and the tooltip is tied to it with `aria-describedby`. |
| Enter | Activates the clickable step (a link) and goes to it. If the step is a button, Enter and Space. |
| Space | Only on a step built as a button; on a link, it scrolls the page, as the browser does. *(appendix D)* |
| Arrow keys | Do nothing in the stepper: each step is a Tab stop *(appendix D)*. |
| Focus on step change | The page moves the focus to the heading of the new step (for example an h1 "Step 2 of 4: Data") and updates the page title. The stepper does not move the focus by itself. *(appendix D)* |
| Esc | Closes the nph-tooltip opened by a cut label, without moving the focus (WCAG 1.4.13). Nothing else opens in the stepper. *(appendix D)* |
| Click outside | Does not apply: the stepper opens no layer. nph-tooltip closes when the pointer and the focus leave. *(appendix D)* |
| Pointer and focus | Hover only paints (`stepper/item-background-hover`; on the error step, an underline) and does not move the focus. The nph-tooltip of a cut label opens after `motion/hover-delay` on hover and at once on focus; a click cancels the wait (DSA-48 D1; DSA-71). *(appendix D)* |
| Near the window edge | The stepper does not float: the instance stretches to the width of where it lives and the connector shrinks down to `stepper/connector-min-width`. nph-tooltip flips to the opposite side when it does not fit (Floating UI flip, *appendix D*). Below 600 px the stepper becomes nph-progress of the steps type; the text column stops at `stepper/text-max-width` and a long label is cut with nph-tooltip. |
| Reduced motion | A status change is color and shape only; with `prefers-reduced-motion`, no transition (DSA-62 D-3) *(appendix D)*. |
| Who controls | The page sets the current step, the status of each step and which steps are clickable; the stepper keeps no state. The color changes in `stepper/state-duration`, with no movement. |

Linear (the default): only the completed steps and the steps with an error are clickable, to go back and review. Non-linear: the pending steps are clickable too, when the order is suggested and not required.

Combined states (rule T11 of the design system):

- Selected or checked + disabled: a completed disabled step keeps its background and check under `stepper/item-disabled-opacity`.
- Error + disabled: disabled wins. The error background and the triangle go away; the marker goes back to the pending one (background, outline, number), the label goes to `stepper/label-foreground` and everything sits under the opacity. With no description turned on, a disabled step with an error looks like a disabled pending step; the reason shows only with the description on, in `stepper/description-foreground` under the opacity.
- Current + disabled: does not apply. The current step is where the person is; a blocked step cannot be the current one.
- Status + hover: keeps the look of the status (as DSA-71); only the pending and completed steps get the hover background; the error step gets the underline.

Inherited decisions:

- Follows DSA-65 D-1: two steps or more are allowed; the documentation asks for three to seven; seven is the maximum.
- Follows DSA-62 D-5: the number of the current step uses `color/primary-text`, at least 4.5:1 in the seven brands on background, card and popover.
- Follows DSA-62 D-3 in principle: with reduced motion, nothing moves.
- Follows DSA-48 D1: wait of `motion/hover-delay` before nph-tooltip opens on hover; focus does not wait. Follows the behavior accepted in DSA-71: a cut label shows the whole text in nph-tooltip; a click cancels the wait. DSA-48 D2 and DSA-57 D-3 are still open, with no answer to inherit.
- Follows the rule T11 as the DSA-71 evidence (status + hover keeps the look of the status).
- Does not follow the tab model of DSA-71 (tablist, arrow keys, activation on focus): the stepper is `nav` + `ol`, with `aria-current="step"` and Tab between the clickable steps.
- Follows the DSA-66 evidence for the text of the current position: `color/foreground` with a stronger weight (there `breadcrumb/current-font-weight` medium; here `text/label-md-strong`).
- Does not follow DSA-66 D-1 (a long trail collapses): the stepper never collapses steps; the maximum is seven and, above it, the process is split.
- DSA-66 D-2 (menu of the hidden levels) and DSA-65 D-2 (animation loop) do not apply.

Limits:

| Case | Rule |
|---|---|
| Minimum | Two steps. |
| Maximum | Seven steps; above that, split the process. |
| Long label | The text column stops at `stepper/text-max-width`; the label is cut with an ellipsis and shows the whole text in nph-tooltip. The current step wraps to up to two lines instead. |
| Long description | Up to two lines inside the text column. |
| Narrow width | Below 600 px, nph-progress of the steps type with "Step 2 of 4" and the current label. |

Icon and image: the check (completed) and the `triangle-exclamation` (error) are nph-icon, light weight, at `stepper/marker-icon-size`, in `stepper/marker-foreground-complete` and `stepper/marker-foreground-error`. The weight does not change on hover or focus. The number is text (`text/label-sm`), not an icon. The stepper uses no image.

Event, aria, slot, property and console warning stay with the code, following the APG and the Custom Elements Manifest.

## Accessibility

| Criterion | Rule |
|---|---|
| contrast | Label, number and description meet 4.5:1 on `color/background` and `color/card`, as the pending number on `color/muted` and the description on the hover `color/accent`, in light and dark and in every brand; the current ring, the error background and the focus border meet 3:1 (WCAG 1.4.3 and 1.4.11). Lowest values measured in the seven brands, light / dark: pending label 6.69 / 9.81; current number 8.11 / 7.72; completed check 4.64 / 13.43; error label 6.88 / 6.96 (card 6.88 / 5.88); current ring 4.96 / 4.91; error background 6.88 / 5.01; focus border on the background 4.32 / 4.91; pending number on `color/muted` 5.76 / 6.61; description on `color/accent` 5.76 / 5.11. The pending background and outline are decorative: the number carries the status. Inside a dialog, in dark, some brand and error colors fall below this (D-1). |
| visible focus | On a clickable step, 1 px border `stepper/focus-border` and halo `stepper/focus-ring`, outside the area (WCAG 2.4.7). A focused step has no hover background: `focus/border` on `color/accent` measures 2.56 to 2.93:1 in dark in some brands. |
| color is not the only sign | Each enabled status has its own shape: a number with a thin outline (pending), a 2 px ring and a stronger label (current), a check (completed), a triangle and the reason in text (error) (WCAG 1.4.1). On hover, the error step gets no background; its label gets an underline. |
| target size | The whole step area is the target, at least 32 high, above the minimum of 24 (WCAG 2.5.8). |
| accessible name | `nav` with `aria-label` (for example "Sign-up steps") and an ordered list; each step is read by its label, with the status as hidden text at the start ("Completed", "Pending", "With error"). The current step carries `aria-current="step"` with no hidden text, so the reader does not announce it twice. A disabled step carries `aria-disabled="true"` and the hidden text of the status it shows; on a disabled step with an error, the marker and the hidden text are the pending ones, and the reason, when turned on, comes in the description (T11, rule 2). The marker is `aria-hidden`: the position comes from the list. |
| keyboard | Only the clickable steps enter Tab, in list order; Enter activates the step (Space too, if it is a button). The current step and the disabled step do not get Tab; a pending step of the linear stepper with a cut label enters Tab only to open nph-tooltip (inferred from the linear rule and DSA-48, open for confirmation: not a link; Enter does nothing; `aria-describedby` to the tooltip). |
| cut text | A cut label shows the whole text in nph-tooltip, on hover and on focus (WCAG 1.4.13). The cut happens at `stepper/text-max-width`. |

## Relations and context

| With | Rule |
|---|---|
| Inside | The top of a form, card or dialog. The container gives the background and the margin; the content of the current step comes right below; the space to it comes from the form layout, because the stepper has no margin of its own. |
| nph-button | "Back" and "Continue" sit in the form footer, not in the stepper; the button validates the step before moving on and says the name of the next one ("Continue to Address"). |
| nph-tooltip | Shows a cut label in full. |
| nph-progress | Of the steps type: the shape of the stepper below 600 px. |
| Family | Position on a path: nph-breadcrumb (DSA-66) and nph-tabs (DSA-71) → nph-stepper, which becomes nph-progress (DSA-65) below 600 px. |

## When to use

| Situation | Choice |
|---|---|
| A process with steps in order and a fixed number, where the person needs to know how much is left: sign-up, hiring, setup | nph-stepper; end with a review step before sending |
| The order is required | Linear: only the completed steps and the steps with an error are clickable |
| The order is suggested | Non-linear: the pending steps are clickable too |
| The label alone does not say what the step asks for, and always on an active error, to say the reason | `descrição=true`; on a disabled step with an error the description is optional and, when on, it is the only sign of the error (T11, rule 2) |
| The step can be skipped | `opcional=true` |

## Required examples

Sign-up in four steps, on step 2; step 2 with an error and its reason, on step 3; linear, three steps, on step 2. Each in light and dark. The documentation also shows the stepper on a card at the top of a form, the error hover (no background, underlined label), the focus outside with no hover background, and the non-linear stepper with focus on step 1, hover on step 3 and step 5 disabled.

## Do

| Do | Why |
|---|---|
| Use short labels, one or two words | The stepper splits the width between the steps; a label past `stepper/text-max-width` is cut and shows the whole text in nph-tooltip |
| Say the reason of the error in the step description ("Fix 2 fields") | The icon shows that there is an error; the text says what to do |
| Keep the completed steps clickable | The person goes back to review without losing what they did |
| Keep the same number of steps from start to end | Changing the count in the middle takes away the sense of how much is left |
| Validate the step before moving on and name the next one on the button ("Continue to Address") | The person knows where the button leads |
| Mark as optional a step that can be skipped, instead of leaving it out | The path stays complete |

## Do not

| Do not | Use instead |
|---|---|
| Use it for views with no order, like the tabs of a profile | nph-tabs |
| Put a whole sentence in the label | A short label, with the detail in the description |
| Put two steppers on the same page, or one inside the other | One stepper, at the top of the process; sub-steps stay inside the step |

## Appendix points answered

| Point | Answer |
|---|---|
| Completed marker | Check in `color/primary-on-surface` on `color/primary-surface`. Only the current step has strong emphasis. |
| Current marker | 2 px ring in `color/primary-border`, no background, number in `color/primary-text`. |
| Label beside or below the marker | Beside: less height; below would need a fixed width per step. |
| Connector of the completed steps | `color/primary-border` before the current step; `color/border` after it. |
| Error | Marker `status/error` with `triangle-exclamation` in `status/on-solid`, label in `status/error-text` and the reason in the description. `xmark` reads as "cancelled"; `circle-exclamation` is not in nph-icon. |
| Navigation | Linear by default, completed and error steps clickable; non-linear as an option; focus outside with no hover background. |
| Narrow width | Below 600 px, "Step 2 of 4" + the current label + nph-progress of the steps type. nph-progress draws 3, 4 and 5 steps in Figma; 2, 6 and 7 follow DSA-65 D-1 in the code. |
| Vertical | The same step with a 1 px vertical connector and the content opened by nph-collapsible, after nph-collapsible exists. Until then, a skeleton. |
| Two steps | Allowed (DSA-65 D-1); the documentation asks for three to seven. |
| Current label color | `color/foreground` with `text/label-md-strong`. The brand color is already on the ring. |
| Hover of a step with an error | No background on hover; underlined label. `status/error-text` on `color/accent` measures 3.62:1 in dark. |
| Cut label without focus | The current step is never cut: the label wraps to two lines. A pending step of the linear stepper with a cut label gets focus only to open nph-tooltip, as the cut text of nph-table; a disabled step stays out of focus, with the whole name for the screen reader. |
| Width of the step text | Text column at `stepper/text-max-width` (160); label on one line with an ellipsis and the whole text in nph-tooltip; description up to two lines; connector at least `stepper/connector-min-width` (24). |
