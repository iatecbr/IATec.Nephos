```json
{
  "task": "DSA-63",
  "gate": "figma-docs-accepted",
  "date": "2026-11-04",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=3442-10163",
    "date": "2026-11-04",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "Indiane accepted the nph-notification documentation frame (3442:10163, page 1369:2), with the Figma UX QA and the textual audit approved, and answered the appendix points: style proposals 2 (toast radius) and 3 (toast shadow) approved, proposals 1 (darker subtle border in dark mode) and 4 (more toast padding) rejected, every other point as recommended. COMPONENT_SET nph-notification (3434:9035), placement × severity × emphasis × layout, 50 variants; focus of the close button on solid specified in frame 4207:1146."
  }
}
```

# DSA-63 — `figma-docs-accepted`

The documentation of `nph-notification` (frame `3442:10163`) was accepted in Figma on 2026-11-04, in the file `DS-IA-NEPHOS 5.0`, with the Figma UX QA and the textual audit approved. The piece needed 59 `notification/*` tokens, put on `v/5.0.0` together with this task, plus three semantic tokens and three core primitives:

- `color/inverse` and `color/inverse-foreground`, new semantic tokens for a high-contrast inverted surface (light: `core/neutral/600` and `core/base/white`; dark: `core/neutral/700` and `core/neutral/100`). They point to the same primitives as the tooltip, with no new value.
- `color/background-subtle` (light `core/surface/25`, dark `core/surface/900`), which Figma already had and the code did not.
- `core/layout-width/toast` (360 px), `core/layout-width/toast-max` (440 px) and `core/opacity/16` (16% in Figma, `0.16` in code). No semantic token has these functions, so the component tokens point straight to them.

Every other `notification/*` token is an alias of a semantic token.

There is no command output. The acceptance is a human observation, recorded in the json block above with the frame URL and the component set.

The rest of this file is the contract converted to text, so that whoever codes does not need to open Figma. Figma property and layer names stay as they are in Figma (`título`, `ações`, `ação secundária`, `fechar`, `barra de tempo`); the code API is in English.

## Purpose

A system message that reports a result, a risk or a piece of guidance, inside the page (inline) or floating over it (toast).

Use inline for a message tied to an area of the page, which stays until the problem is solved or the person closes it. Use toast to confirm an action or to report the end of a background task, without taking the person away from what they are doing. It does not replace the alert dialog (`nph-alert-dialog`), for what needs an answer before going on, nor the error message of a field (`nph-field`).

## Anatomy

1. **Container** — subtle emphasis: background `notification/<severity>-surface`, 1 px border `notification/<severity>-border` (`notification/border-width`). Solid emphasis: background `notification/<severity>-solid`, no border. Neutral: `notification/neutral-surface` with `notification/neutral-border` on subtle, `notification/neutral-solid` on solid. Loading: `notification/loading-surface` with `notification/loading-border`. Radius `notification/radius` inline and `notification/toast-radius` on the toast. Padding: `notification/padding-start` at the start, `notification/padding-block` on top and bottom, `notification/padding-end` at the end, next to the close button. Gap between icon, content and close: `notification/gap`.
2. **Severity icon** — nph-icon at `notification/icon-size`, solid style, one drawing per severity: `circle-info` (info), `circle-check` (success), `triangle-exclamation` (warning), `circle-xmark` (error), `circle-question` (help), `bell` (neutral). Loading uses the nph-spinner instead, same size, with its own `color/primary` arc. Color: `notification/<severity>-solid` on subtle, `notification/on-solid` on solid; neutral uses `notification/neutral-icon` on subtle and `notification/neutral-on-solid` on solid.
3. **Title** (optional) — `text/heading-xs`, `notification/text`; `notification/on-solid` on solid (`notification/neutral-on-solid` on neutral solid).
4. **Description** — `text/body-md`, same color as the title; always present; says what happened and what to do. Gap between title and description: `notification/content-gap` (stacked) and `notification/content-gap-single-line` (single-line). Block padding: `notification/content-padding-block`.
5. **Actions** (optional) — up to two nph-button at size default. The main one is the button type of the severity, solid: info, success, warn (for warning), danger (for error) and help; primary for neutral. Loading has no actions (in Figma they are hidden inside the loading variants). The secondary one is ghost, with its label in `notification/<severity>-action-foreground` and its hover background in `notification/<severity>-action-background-hover` (neutral: primary ghost, `notification/neutral-action-foreground` and `notification/neutral-action-background-hover`). Gap between them `notification/actions-gap`; between the text and the actions, `notification/content-actions-gap` plus `notification/actions-padding-top`. No actions on solid; on single-line, only the main one.
6. **Close** (optional) — nph-icon-button secondary ghost with the `xmark` icon, at the end corner. On subtle it keeps its own tokens. On solid the icon is `notification/on-solid` (`notification/neutral-on-solid` on neutral), and its hover and focus change (see States).
7. **Time bar** (optional) — a line at the base of the toast showing the time until it closes; only on a subtle toast that closes by itself. Until nph-progress is approved, Figma shows it with nph-skeleton.
8. **Toast elevation** — the effect style `elevation/modal` in light mode. In dark mode `shadow/color` resolves to `core/alpha/black-0`, so the toast has no shadow and separates from the page by its surface and, when there is one, by its border. There is no `notification/*` token for it: an effect style is not a variable in Figma, and the build does not accept a shadow alias, so the toast uses `elevation/modal` directly.

## Properties

| Figma property | Rule |
|---|---|
| `placement` | `inline` (default): inside the page, tied to an area, persistent. `toast`: floats over the page, with elevation, and may close by itself. |
| `severity` | `info` (default), `success`, `warning`, `error`, `help`, `neutral`. `loading` exists only on the subtle toast, with no actions, no close and no time bar. |
| `emphasis` | `subtle` (default): soft background of the severity, with a border. `solid`: full severity background (neutral: `color/inverse`), no actions, only the close button. |
| `layout` | `stacked` (default): title on top, description and actions below. `single-line`: everything in one line, for short text, only with the main action. |
| `título` | Turns the title on or off. On by default. |
| `ações` | Turns the actions area on. On by default; no effect on solid or on loading. On single-line it controls the main action as well. |
| `ação secundária` | Turns the second action on (ghost, label in the severity color). On by default; no effect on single-line, solid or loading. |
| `fechar` | Turns the close button on. On by default; loading has no close button. |
| `barra de tempo` | Turns the time bar on. Off by default; only on a subtle toast that closes by itself, never with an action, on error or on loading. |

The default title of each variant in Figma is a realistic result in Portuguese, not the severity name, such as "Report scheduled", "Order sent", "Deadline is near", "Save failed", "Quick search", "Maintenance today" and "Saving changes…". Code examples follow the same rule.

## Sizes

- Inline: fluid, it takes the width of its area. Figma shows 520 px (stacked) and 760 px (single-line) only as samples.
- Toast stacked: `notification/toast-width` (360 px). Toast single-line: `notification/toast-width-max` (440 px), which is also the maximum width of any toast. Minimum 320 px.

## States

Hover, focus and pressed come from the inner pieces (nph-button and nph-icon-button); the container has no state of its own and never takes focus.

On the solid emphasis, the close button changes, because the gray hover and the focus halo of nph-icon-button disappear over the color. The focus is the specification of frame `4207:1146`, shown in light and dark for the six severities; the hover is the decision P-v2-D of the appendix, with no frame of its own:

- **Hover**: background `notification/close-background-hover` (neutral: `notification/neutral-close-background-hover`) at opacity `notification/close-background-hover-opacity` (16%). In CSS, for example, `color-mix(in srgb, var(--nph-notification-close-background-hover) calc(var(--nph-notification-close-background-hover-opacity) * 100%), transparent)`.
- **Focus**: a border of `notification/close-focus-border-width` (2 px) in `notification/close-focus-border` (neutral: `notification/neutral-close-focus-border`), with the radius `focus/border-radius-control` (the radius of the nph-icon-button focus border, as bound in frame `4207:1146`), and **no halo**. Measured contrast of the border against the solid background: 4.90:1 or more in both modes (it is the text color).

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | Text passes 4.5:1 and icon passes 3:1 in every severity and emphasis, in both modes, including the main button label and the secondary action label in the severity color. Lowest measured: icon 4.40:1 (success subtle, light), text 4.90:1 (success solid, light). Close hover on solid in dark mode: help 3.65:1 and error 3.71:1. |
| Visible focus | Actions and close show the focus ring of nph-button and nph-icon-button. On solid, the close focus is the 2 px border above, without the halo. |
| Color is not the only signal | Each severity has its own icon drawing, and the title says the result in words, such as "Payment declined". |
| Touch target | With a mouse, actions and close use `control/height-default`. On a touch screen, the actions switch to the size large of nph-button; the close button keeps its drawing and its touch area grows to `control/height-large`. |
| Accessible name | Close has an `aria-label` with the translated word for "Close" (i18n). The severity icon is `aria-hidden`, because the text already says the severity. Error and warning toasts are announced as alerts (`role="alert"`); the others as status (`role="status"`). The toast never moves focus. |
| Time | A toast that closes by itself stays at least 6 seconds and pauses while the pointer is over it or focus is inside it. Error toasts and toasts with an action only leave when the person acts or closes them (WCAG 2.2.1). |
| Loading | The nph-spinner sits next to the title, so it is decorative and never the only signal (rule S4 of nph-spinner); its arc still passes 3:1 in both modes (4.59:1 in dark mode, over `color/popover`). |

## Toast region

Toasts live in a region at the bottom-right corner, with up to three visible, `notification/stack-gap` between them, the newest next to the corner and in front of the others. Position and stacking belong to the region, not to the component. A loading toast turns into success or error in the same toast when the task ends.

## Relations

- Icon only from nph-icon, at `notification/icon-size`, in the severity color; on loading, the nph-spinner.
- Actions are nph-button at size default: the main one in the severity type, solid, and the secondary one ghost; on neutral, primary solid and primary ghost.
- Close is the nph-icon-button secondary ghost with the `xmark` icon; on solid, the icon takes the text color. In code, nph-icon-button is the icon-only nph-button (decision B5).
- Color comes from `severity`: the consumer picks the severity, never the color.
- What needs an answer before going on is not a notification: it goes to the alert dialog (`nph-alert-dialog`, `role="alertdialog"`, not built yet); a field error stays in nph-field.
- A text action that navigates would be a link; with no approved nph-link, the actions are nph-button ghost.

## When to use

- Inline for a message tied to an area, which stays until it is solved; at the top of the page, full width, for a notice about the whole page (banner, no variant of its own).
- Toast to confirm an action or report the end of a background task; on error, only for a failure that does not stop the person, such as a send that can be repeated.
- Severity by meaning: success for what worked; error for what failed and needs action; warning for risk; info for useful information; neutral for a notice with no tone; loading for a task in progress.
- Help for guidance, such as a tip, a tour or support content; never for the result of an operation.
- Subtle emphasis by default, in both placements; solid only when the message needs more weight and has no action.
- Single-line for short text; when the text goes beyond one line, the notification reflows to stacked and the actions move below.

## Required examples

- Error in a form area: inline, with an action.
- Action confirmation: success toast.
- Task in progress: loading toast.

## Do

- Write the result in the title, such as "Payment declined", so the severity does not rely only on color and icon.
- Say in the description what happened and what to do.
- Keep error toasts and toasts with an action on screen until the person acts or closes them.
- Use at most two actions, one main and one secondary.
- Change severity, emphasis and layout through the properties, never by detaching the instance.

## Do not

- Use help for the result of an operation, such as "File saved": use success, error, warning or info.
- Put the main action in a neutral button, such as secondary outline on a warning: use the nph-button of the severity type, solid.
- Use single-line with text longer than one line: use stacked, with the actions below.
- Use a toast for an error that stops the person: use inline near the problem or the alert dialog.
- Turn the title off and leave the description without the result.
- Allow an action and the time bar together: the documentation forbids it and the code must block it.

## Answers to the appendix

| Point | Decision |
|---|---|
| P1 elevation | `elevation/modal` in light mode (style proposal 3); no shadow in dark mode. |
| P2 severity names | `error`, `warning`, `success`, `info`, `help`, `neutral`, `loading`, the same as the `status/*` tokens. |
| P3 default toast position | bottom-right. |
| P4 width and stack | 320 px minimum, 440 px maximum (`core/layout-width/toast-max`), 360 px stacked (`core/layout-width/toast`); up to three visible, 8 px between them, newest next to the corner and in front. |
| P5 duration | 6 s by default; error and toasts with an action do not close by themselves; pause on hover and focus. |
| P6 default emphasis | subtle on inline and toast; solid optional. |
| P7 text action | nph-button ghost; a link only when it navigates, and while nph-link is not approved it stays an nph-skeleton placeholder. |
| P8 time bar | nph-skeleton placeholder until nph-progress is approved. |
| P9 error icon | `circle-xmark` on error; `triangle-exclamation` only on warning. |
| P10–P12, P15 | Already settled by the reference board: no actions on solid; main action solid in the severity type, secondary ghost; title and description in `color/foreground`; the Usage section follows the rule for a component without code. |
| P13 action and time bar together | Usage rule in the documentation and a guard in code. |
| P14 single-line with an action that wraps | Reflow: once the text goes beyond one line, it becomes stacked and the actions move below. |
| P16 what needs an answer | nph-alert-dialog, its own component with `role="alertdialog"`; the piece does not exist in Figma yet. |
| P17 default title | Realistic example per severity in the main component (applied in Figma). |
| P18 touch target | On touch screens, actions at size large and the close touch area grown to `control/height-large`, without growing the drawing; the Figma set shows size default only. |
| P-v2-A neutral buttons | primary solid for the main action and primary ghost for the secondary one. |
| P-v2-B secondary action color | Label `status/<severity>-hover` (error `color/destructive-hover`, neutral `color/primary-on-surface`), hover `status/<severity>-surface-hover` (error `color/destructive-surface-hover`, neutral `color/primary-surface`), through `notification/<severity>-action-*`. The `-hover` tone is used at rest because `status/success` is 4.4:1 in light mode. |
| P-v2-D close on solid | Hover at 16% (`core/opacity/16`) and 2 px focus border in the text color, without the halo (focus in frame `4207:1146`; the hover has no frame). |
| P-v2-E actions on single-line | The `ações` property now controls the main action on single-line too (applied in Figma). |
| P-v2-F neutral and loading surfaces | Neutral solid in the new `color/inverse` and `color/inverse-foreground`; loading stays in `color/popover` and `color/dropdown-border`. |
| Style proposal 1 | Rejected: the subtle border in dark mode stays at tone 400 (`status/<severity>-border`). |
| Style proposal 4 | Rejected: the toast padding stays 12 / 8 / 12 / 16, the same as inline. |

## Tokens

All tokens below are on `v/5.0.0` (CSS `--nph-notification-*`). They are the same in light and dark mode, except where the semantic token they point to changes.

| Token | Points to | Where |
|---|---|---|
| `notification/radius` | `radius/container` | inline container |
| `notification/toast-radius` | `radius/overlay` | toast container |
| `notification/border-width` | `border/width` | subtle and loading border |
| `notification/padding-start` | `space/container-padding` | start padding |
| `notification/padding-block` | `space/control-padding` | top and bottom padding |
| `notification/padding-end` | `space/inline` | end padding, next to close |
| `notification/gap` | `space/control-padding` | icon, content and close |
| `notification/content-gap` | `space/stack-tight` | title to description, stacked |
| `notification/content-gap-single-line` | `space/inline` | title, description and action, single-line |
| `notification/content-padding-block` | `space/stack-snug` | text block padding |
| `notification/content-actions-gap` | `space/stack` | text to actions |
| `notification/actions-gap` | `space/inline` | between actions |
| `notification/actions-padding-top` | `space/stack-snug` | above the actions |
| `notification/icon-size` | `icon/size-md` | severity icon and spinner |
| `notification/stack-gap` | `space/stack-snug` | between toasts in the region |
| `notification/toast-width` | `core/layout-width/toast` | toast stacked |
| `notification/toast-width-max` | `core/layout-width/toast-max` | toast single-line and maximum |
| `notification/<severity>-surface` | `status/<severity>-surface` | subtle background (info, success, warning, error, help) |
| `notification/<severity>-border` | `status/<severity>-border` | subtle border |
| `notification/<severity>-solid` | `status/<severity>` | solid background and subtle icon |
| `notification/<severity>-action-foreground` | `status/<severity>-hover`; error `color/destructive-hover` | secondary action label |
| `notification/<severity>-action-background-hover` | `status/<severity>-surface-hover`; error `color/destructive-surface-hover` | secondary action hover |
| `notification/on-solid` | `status/on-solid` | text, icon and close on solid |
| `notification/text` | `color/foreground` | title and description on subtle |
| `notification/neutral-surface` | `color/background-subtle` | neutral subtle background |
| `notification/neutral-border` | `color/border` | neutral subtle border |
| `notification/neutral-icon` | `color/foreground` | neutral subtle icon |
| `notification/neutral-solid` | `color/inverse` | neutral solid background |
| `notification/neutral-on-solid` | `color/inverse-foreground` | text, icon and close on neutral solid |
| `notification/neutral-action-foreground` | `color/primary-on-surface` | neutral secondary action label |
| `notification/neutral-action-background-hover` | `color/primary-surface` | neutral secondary action hover |
| `notification/loading-surface` | `color/popover` | loading background |
| `notification/loading-border` | `color/dropdown-border` | loading border |
| `notification/close-background-hover` | `status/on-solid` | close hover on solid |
| `notification/neutral-close-background-hover` | `color/inverse-foreground` | close hover on neutral solid |
| `notification/close-background-hover-opacity` | `core/opacity/16` | opacity of that hover |
| `notification/close-focus-border` | `status/on-solid` | close focus border on solid |
| `notification/neutral-close-focus-border` | `color/inverse-foreground` | close focus border on neutral solid |
| `notification/close-focus-border-width` | `core/focus-width/sm` | close focus border width (2 px) |

The main action button and the close button on subtle keep the tokens of nph-button and nph-icon-button; the spinner and the skeleton keep their own.
