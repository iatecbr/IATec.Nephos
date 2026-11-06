---
piece: nph-notification
level: component
status: active
solves: >-
  Reports a result, a risk or a piece of guidance as a system message, inside the page
  tied to an area (inline) or floating over it (toast), in the severity the consumer
  picks, with an optional title, up to two actions and a close button.
use_when:
  - "Inline: a message tied to an area of the page, which stays until the problem is solved or the person closes it."
  - "Inline at the top of the page, full width: a notice about the whole page."
  - "Toast: to confirm an action or to report the end of a background task, without taking the person away from what they are doing."
  - "Toast with error: only for a failure that does not stop the person, such as a send that can be repeated."
  - "Choose the severity by meaning: success for what worked, error for what failed and needs action, warning for risk, info for useful information, neutral for a notice with no tone, loading for a task in progress."
  - "Help for guidance, such as a tip, a tour or support content; never for the result of an operation."
  - "Subtle emphasis by default, in both placements; solid only when the message needs more weight and has no action."
  - "Single-line for short text; when the text goes beyond one line, it reflows to stacked and the action moves below."
do_not_use_when:
  - "For what needs an answer before going on: use nph-alert-dialog."
  - "For the error of a field: it stays in nph-field."
  - "For an error that stops the person: use an inline notification near the problem."
  - "For the result of an operation with the help severity: use success, error, warning or info."
  - "For an action that navigates: the actions are buttons; a link waits for nph-link."
api:
  placement:
    type: enum
    values: [inline, toast]
    required: false
    default: inline
    reflects: true
    constraint: >-
      The Figma property `placement`. inline: inside the page, tied to an area, with the
      width of its area, persistent. toast: floats over the page, with the elevation/modal
      effect, and may close by itself. Reflects because the internal CSS selects by it.
      Any other value draws nothing and emits console.error in development.
  severity:
    type: enum
    values: [info, success, warning, error, help, neutral, loading]
    required: false
    default: info
    reflects: true
    constraint: >-
      The meaning of the message, the Figma property `severity`; it sets the color and the
      drawing, so the consumer picks the severity and never the color. loading exists only
      on the subtle toast and has no actions, no close button and no time bar. Reflects
      because the internal CSS selects by it. Any other value draws nothing and emits
      console.error in development.
  emphasis:
    type: enum
    values: [subtle, solid]
    required: false
    default: subtle
    reflects: true
    constraint: >-
      The Figma property `emphasis`. subtle: the soft background of the severity, with a
      border. solid: the full background of the severity, with no border, no actions and
      only the close button. Reflects because the internal CSS selects by it. Any other
      value draws nothing and emits console.error in development.
  layout:
    type: enum
    values: [stacked, single-line]
    required: false
    default: stacked
    reflects: true
    constraint: >-
      The Figma property `layout`. stacked: the title on top, the description and the
      actions below. single-line: everything on one line, for short text, with only the
      main action. When the text goes beyond one line, a single-line notification reflows
      to stacked and the action moves below the text; a toast keeps the width of the
      layout it declared. Reflects because the internal CSS selects by it. Any other value
      draws nothing and emits console.error in development.
  heading:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The title, already localized by the consuming application: the result in words, such
      as Payment declined. It is the Figma property `título`, whose boolean is the presence
      of a non-empty heading. The name is not title, a global HTML attribute that the
      browser would show as a native tooltip. Empty or only spaces draws no title.
  description:
    type: string
    required: true
    default: "empty"
    reflects: false
    constraint: >-
      What happened and what to do, already localized. Always present. Empty or only spaces
      draws nothing and emits console.error in development.
  action:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The text of the main action, already localized; it is the Figma boolean `ações`. The
      main action is an nph-button in the type of the severity, solid (primary on neutral),
      at size default. Firing it emits nph-action. Solid and loading take no actions: the
      text is ignored there, with no error. Empty draws no action.
  secondary-action:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The text of the secondary action, already localized; it is the Figma boolean
      `ação secundária`. It is an nph-button ghost, with its label in the color of the
      severity. It needs the main action: alone, it draws nothing and emits console.error in
      development. Single-line, solid and loading do not draw it, with no error. The
      property is secondaryAction.
  hide-close:
    type: boolean
    required: false
    default: false
    reflects: false
    constraint: >-
      Turns off the close button, which is on by default; it is the Figma boolean `fechar`
      turned around. Loading has no close button whatever the property says. The property
      is hideClose.
  close-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name of the close button, already localized, such as Close. Required
      while the close button is shown: without it, the notification draws nothing and emits
      console.error in development. Loading needs none, but give it anyway when the same
      toast will turn into success or error. The property is closeLabel.
  duration:
    type: number
    required: false
    default: 6000
    reflects: false
    constraint: >-
      Milliseconds a toast stays before it closes by itself. 0 keeps it until the person
      acts. A value between 1 and 5999, a negative one or one that is not a number is
      invalid (WCAG 2.2.1): the notification draws nothing and emits console.error in
      development. Only a subtle or solid toast that is not error, not loading and has no
      action reads it; a valid duration on inline, on error, on loading or with an action is
      ignored, with no error. It pauses while the pointer is over the toast and while focus is
      inside it.
  time-bar:
    type: boolean
    required: false
    default: false
    reflects: false
    constraint: >-
      The Figma boolean `barra de tempo`: a line at the base of the toast that stands for
      the time until it closes. Only on a subtle toast that closes by itself: on inline, on
      solid, on error, on loading, with an action or with duration 0 it draws nothing and
      emits console.error in development. Until nph-progress is wired in, it is an
      nph-skeleton line, stopped, as Figma shows it. The property is timeBar.
  nph-action:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      Fired when the person activates an action. detail.action is primary or secondary. It
      bubbles and crosses the shadow root; it is not cancelable. The notification does not
      close on its own after an action: the consumer decides.
  nph-close:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      Fired before the notification closes. detail.source is close-button, when the person
      pressed the close button, or timeout, when the time of a toast ran out. It bubbles,
      crosses the shadow root and is cancelable: preventDefault keeps the notification on
      the page, and after a timeout the time does not restart. Without preventDefault the
      notification hides itself with the hidden attribute; the consumer removes the element.
variants:
  placement:
    axis: appearance
    choose_when: "inline for a message tied to an area of the page, which stays until it is solved; toast to confirm an action or report the end of a background task."
    do_not_combine_with:
      - "severity loading with inline."
      - "time-bar with inline."
  severity:
    axis: appearance
    choose_when: "success for what worked; error for what failed and needs action; warning for risk; info for useful information; help for guidance; neutral for a notice with no tone; loading for a task in progress, on the subtle toast."
    do_not_combine_with:
      - "help for the result of an operation."
      - "loading with solid or with inline."
  emphasis:
    axis: appearance
    choose_when: "subtle by default; solid only when the message needs more weight and has no action."
    do_not_combine_with:
      - "solid with an action: the actions are not drawn."
      - "solid with time-bar."
  layout:
    axis: density
    choose_when: "stacked by default; single-line for short text, with only the main action."
    do_not_combine_with:
      - "single-line with text longer than one line: use stacked, with the actions below."
      - "single-line with a secondary action: it is not drawn."
states:
  container:
    token: "notification/<severity>-surface, notification/<severity>-border, notification/<severity>-solid"
    changes_for_user: "The notification has no state of its own: it never takes focus and does not react to hover. Hover, focus and pressed belong to the pieces inside."
  secondary-action-hover:
    token: "notification/<severity>-action-background-hover"
    changes_for_user: "The ghost secondary action takes the hover background of its severity; its label rests in notification/<severity>-action-foreground."
  close-on-solid-hover:
    token: "notification/close-background-hover at notification/close-background-hover-opacity"
    changes_for_user: "On solid, the close button takes the text color as a veil at 16 percent; neutral uses notification/neutral-close-background-hover."
  close-on-solid-focus:
    token: "notification/close-focus-border in notification/close-focus-border-width"
    changes_for_user: "On solid, the close button shows a 2 px border in the text color and no halo; neutral uses notification/neutral-close-focus-border."
  closing-paused:
    token: not_applicable
    changes_for_user: "While the pointer is over a toast that closes by itself, or focus is inside it, its time stops and goes on from what was left."
  reflowed:
    token: not_applicable
    changes_for_user: "A single-line notification whose text does not fit on one line takes the stacked layout, with the action below the text."
business_rules:
  - "The consumer picks the severity, never the color: there is no color property."
  - "The description is always present and says what happened and what to do; the heading, when there is one, says the result in words."
  - "At most two actions, one main and one secondary; the secondary needs the main one."
  - "Solid has no actions and loading has no actions and no close button; the parts the Figma set says have no effect are not drawn and raise no error."
  - "An action and the time bar never go together: a toast with an action does not close by itself, and the code blocks the pair."
  - "A toast that closes by itself stays at least 6 seconds and pauses while the pointer is over it or focus is inside it; error, loading and a toast with an action never close by themselves."
  - "The notification never takes or moves focus."
  - "The notification does not remove itself: on nph-close it hides with hidden unless the event is canceled, and the consumer removes the element."
  - "A loading toast turns into success or error in the same toast when the task ends: the consumer changes severity, heading and description."
  - "The toast region is the container of the consuming application, not a piece."
domain_errors: []
tokens:
  container: [notification/radius, notification/toast-radius, notification/border-width]
  padding: [notification/padding-start, notification/padding-block, notification/padding-end]
  gap: [notification/gap, notification/content-gap, notification/content-gap-single-line, notification/content-padding-block, notification/content-actions-gap, notification/actions-gap, notification/actions-padding-top]
  subtle: "notification/<severity>-surface and notification/<severity>-border"
  solid: "notification/<severity>-solid, with notification/on-solid"
  neutral: "notification/neutral-surface, notification/neutral-border, notification/neutral-icon, notification/neutral-solid and notification/neutral-on-solid"
  loading: "notification/loading-surface and notification/loading-border"
  text: [notification/text, text/heading-xs, text/body-md]
  icon: [notification/icon-size, notification/<severity>-solid, notification/neutral-icon]
  secondary_action: [notification/<severity>-action-foreground, notification/<severity>-action-background-hover, notification/neutral-action-foreground, notification/neutral-action-background-hover]
  close_on_solid: [notification/close-background-hover, notification/close-background-hover-opacity, notification/close-focus-border, notification/close-focus-border-width, notification/neutral-close-background-hover, notification/neutral-close-focus-border]
  width: [notification/toast-width, notification/toast-width-max]
  elevation: elevation/modal
  touch: control/height-large
  focus: [focus/border, focus/halo]
  region: notification/stack-gap
ai_hints:
  - "Use nph-notification to report a result, a risk or a piece of guidance; what needs an answer before going on is nph-alert-dialog and the error of a field stays in nph-field."
  - "Use inline for a message tied to an area of the page and toast to confirm an action or report the end of a task."
  - "Pick severity by meaning and never set a color; help is for guidance, never for the result of an operation."
  - "Write the result in heading, such as Payment declined, and what happened and what to do in description, which is required."
  - "Give action and secondary-action as text, listen to nph-action, and use at most two; solid and loading take none."
  - "Give close-label, already localized, while the close button is shown; listen to nph-close and remove the element, because the notification only hides itself."
  - "Keep error toasts and toasts with an action on the screen until the person acts or closes them; they never close by themselves."
  - "Never turn on time-bar together with an action, on error, on loading or with duration 0."
  - "Build the toast region in your own container, at the bottom-right corner, with at most three toasts and notification/stack-gap between them."
accessibility:
  semantics: "The host has role alert on error and warning and role status on the others, and takes no focus. The contract specifies the announcement only for the toast; using the same rule for inline is an extension of this piece. The severity icon is decorative (aria-hidden): the title and the description say the severity in words. The close button is an icon-only nph-button."
  accessible_name: "The close button is named by close-label, already localized; the nph-button shows its own tooltip with that name. The actions are named by their text. The notification has no name of its own: its role announces its content."
  keyboard:
    - "Tab reaches the actions and the close button, in reading order; the notification takes no focus itself."
    - "Enter and Space activate an action or the close button, as in nph-button."
    - "A toast that closes by itself pauses while focus is inside it and goes on when focus leaves."
  focus: "The notification never moves focus when it appears or closes. Actions and close show the focus ring of nph-button. On solid, the close shows a 2 px border in the text color and no halo."
  contrast: "Text passes 4.5:1 and icon passes 3:1 in every severity and emphasis, in light and dark, including the label of the main action and of the secondary action in the severity color."
  color_alternative: "Each severity has its own icon drawing, and the title says the result in words; the loading toast shows a spinner next to the text."
invalid_combinations:
  - "A placement, severity, emphasis or layout outside its list — nothing is drawn and console.error is emitted in development."
  - "An empty description — nothing is drawn."
  - "severity loading outside the subtle toast — nothing is drawn."
  - "A duration between 1 and 5999, or one that is negative or not a number — nothing is drawn; use 0 or 6000 and up."
  - "secondary-action without action, where the secondary action is drawn (not on single-line, solid or loading) — nothing is drawn."
  - "time-bar outside a subtle toast, on error, on loading, with an action or with duration 0 — nothing is drawn."
  - "The close button shown with no close-label — nothing is drawn."
relations:
  combines_with: [nph-button, nph-icon, nph-spinner, nph-skeleton]
  parents: ["a form area or any area of the page, for inline", "the toast region of the consuming application, for toast"]
  children: [nph-icon, nph-spinner, nph-button, nph-skeleton]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Using help for the result of an operation."
  - "A neutral button as the main action, such as secondary outline on a warning."
  - "Single-line with text longer than one line."
  - "A toast for an error that stops the person."
  - "Turning the title off and leaving the description without the result."
  - "An action and the time bar together."
  - "Detaching the instance to change severity, emphasis or layout."
sources:
  design_md: "design.md, the notification/* tokens, color/inverse, color/inverse-foreground, color/background-subtle, elevation/modal, text/heading-xs, text/body-md, control/height-large and the focus tokens"
  decision: "P108 — nph-notification: API and semantics"
  tests: "src/components/nph-notification/nph-notification.test.ts and nph-notification.docs.test.ts"
  usage_evidence: "the mandatory examples of the nph-notification Examples story and Docs page: an error in a form area, an action confirmation and a task in progress"
  storybook: "src/components/nph-notification/nph-notification.stories.ts and nph-notification.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, page NPH — Notification 1369:2, documentation 3442:10163, set 3434:9035, close focus on solid 4207:1146"
---

# nph-notification

## Function

**The problem it solves:** reports a result, a risk or a piece of guidance as a system
message, inside the page tied to an area (`inline`) or floating over it (`toast`). It has a
severity picked by the consumer, an optional title, a description that says what happened and
what to do, up to two actions, a close button and, on a toast that closes by itself, a time
bar. It does not replace `nph-alert-dialog`, for what needs an answer before going on, nor the
error message of a field, which stays in `nph-field`.

**When to use:**

- Inline: a message tied to an area of the page, which stays until the problem is solved or
  the person closes it.
- Inline at the top of the page, full width: a notice about the whole page.
- Toast: to confirm an action or to report the end of a background task, without taking the
  person away from what they are doing.
- Toast with error: only for a failure that does not stop the person, such as a send that can
  be repeated.
- Choose the severity by meaning: success for what worked, error for what failed and needs
  action, warning for risk, info for useful information, neutral for a notice with no tone,
  loading for a task in progress.
- Help for guidance, such as a tip, a tour or support content; never for the result of an
  operation.
- Subtle emphasis by default, in both placements; solid only when the message needs more
  weight and has no action.
- Single-line for short text; when the text goes beyond one line, it reflows to stacked and
  the action moves below.

**When NOT to use:**

- **For what needs an answer before going on** — use `nph-alert-dialog`.
- **For the error of a field** — it stays in `nph-field`.
- **For an error that stops the person** — use an inline notification near the problem.
- **For the result of an operation with the help severity** — use success, error, warning or
  info.
- **For an action that navigates** — the actions are buttons; a link waits for `nph-link`.

## Variants

**By appearance:**

| Property | Values | Choose when |
|---|---|---|
| `placement` | `inline` (default), `toast` | `inline` for a message tied to an area, which stays until solved; `toast` to confirm an action or report the end of a task |
| `severity` | `info` (default), `success`, `warning`, `error`, `help`, `neutral`, `loading` | By meaning, as in the list above; `loading` only on the subtle toast |
| `emphasis` | `subtle` (default), `solid` | `subtle` by default; `solid` only for more weight, with no action |

**By density:** `layout`. `stacked`, the default, puts the title on top and the description and
the actions below. `single-line` puts everything on one line, for short text, with only the main
action; when the text goes beyond one line, it reflows to `stacked`.

**By size:** `not_applicable`. The inline notification takes the width of its area. The toast is
`notification/toast-width` stacked and `notification/toast-width-max` single-line, which is also
the maximum width of any toast; it never grows past its container.

**Do not combine with:** `loading` outside the subtle toast; `time-bar` outside a subtle toast;
`solid` with an action; `single-line` with a secondary action or with text longer than one line.

The Figma properties `título`, `ações`, `ação secundária`, `fechar` and `barra de tempo` are not
variants: they are `heading`, `action`, `secondary-action`, `hide-close` and `time-bar`.

## States

The notification has no state of its own: it never takes focus and does not react to hover.
Hover, focus and pressed come from the pieces inside, `nph-button` for the actions and the
close.

| State | Token | What changes for the person |
|---|---|---|
| Container | `notification/<severity>-surface`, `-border` and `-solid` | The background and the border of the severity and the emphasis |
| Secondary action, hover | `notification/<severity>-action-background-hover` | The ghost action takes the hover background; its label rests in `notification/<severity>-action-foreground` |
| Close on solid, hover | `notification/close-background-hover` at `notification/close-background-hover-opacity` | The close button takes the text color as a veil at 16 percent |
| Close on solid, focus | `notification/close-focus-border` in `notification/close-focus-border-width` | A 2 px border in the text color, with no halo |
| Closing, paused | `not_applicable` | A toast that closes by itself stops its time while the pointer is over it or focus is inside it |
| Reflowed | `not_applicable` | A single-line notification whose text does not fit takes the stacked layout |

Neutral uses its own tokens: `notification/neutral-action-*`, `notification/neutral-close-*`.

**Feedback and focus:** the notification never takes or moves focus. The loading severity shows
an `nph-spinner` instead of the icon, in `color/primary`, decorative.

**Business rule the piece carries:**

- The consumer picks the severity, never the color: there is no color property.
- The description is always present and says what happened and what to do; the heading, when
  there is one, says the result in words.
- At most two actions, one main and one secondary; the secondary needs the main one. The main
  one is an `nph-button` in the type of the severity (`info`, `success`, `warn`, `danger`,
  `help`; `primary` on neutral), solid; the secondary one is a ghost, in the color of the
  severity (primary on neutral).
- Solid has no actions and loading has no actions and no close button. These parts are not
  drawn and raise no error, because the Figma set says they have no effect; so is the secondary
  action on single-line.
- An action and the time bar never go together: a toast with an action does not close by itself.
- A toast that closes by itself stays at least 6 seconds (WCAG 2.2.1) and pauses while the
  pointer is over it or focus is inside it. Error, loading and a toast with an action never
  close by themselves, whatever `duration` says.
- A single-line notification whose text does not fit on one line reflows to stacked, with the
  action below the text. The width of a toast stays the one of the layout it declared.
- On a touch screen (`pointer: coarse`) the actions take the size large of `nph-button` and the
  touch area of the close grows to `control/height-large`, without changing its drawing.

**Domain error states:** none.

## Using it

```html
<nph-notification
  severity="error"
  heading="Payment declined"
  description="Check the card number and try again."
  action="Review card"
  secondary-action="Use another card"
  close-label="Close"
></nph-notification>
```

- `heading`, `description`, `action`, `secondary-action` and `close-label` are already localized
  by the consuming application; the piece writes no word of its own.
- `nph-action` says which action the person pressed, in `detail.action` (`primary` or
  `secondary`). The notification does not close on its own after it.
- `nph-close` says that the notification is closing, in `detail.source`: `close-button` or
  `timeout`. It is cancelable: with `preventDefault()` the notification stays, and after a
  timeout its time does not restart. Without it, the notification hides itself with the
  `hidden` attribute and the consumer removes the element. Removing it is the consumer's job.
- `heading` is not `title`: the name avoids the global HTML attribute, which the browser would
  show as a native tooltip.

## The toast region

The toast region is **not a piece and not a tag**: it is the container of the consuming
application. The piece draws one toast; position and stacking belong to the region.

```html
<div
  role="group"
  aria-label="Notifications"
  style="position: fixed; inset-block-end: var(--nph-layout-margin-compact); inset-inline-end: var(--nph-layout-margin-compact); display: flex; flex-direction: column; align-items: flex-end; gap: var(--nph-notification-stack-gap);"
>
  <!-- up to three nph-notification placement="toast" -->
</div>
```

The distance from the corner is the application's choice: the example uses `layout/margin-compact`, and
the contract names no token for it.

- Anchor the region at the bottom-right corner with `position: fixed`.
- Put `notification/stack-gap` between the toasts. The CSS of the piece does not read it: the
  gap belongs to the region.
- Show at most three toasts at once, the newest next to the corner and in front of the others:
  with the column above, append the newest toast last. The consumer holds the rest back until
  one leaves.
- Each toast has the width of its own tokens, so the minimum of 320 px of the contract holds by
  construction, and no width is set on the region.
- A loading toast turns into success or error in the same toast when the task ends: change
  `severity`, `heading` and `description` on the same element, and give `close-label` from the
  start, because the close button comes back on success and on error.

Whether the region becomes a piece of its own is a pending decision (D-1 of the task DSA-63).

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | The host has `role="alert"` on error and warning and `role="status"` on the others, and takes no focus. The contract specifies this announcement only for the toast; using the same rule on inline is an extension of this piece |
| Accessible name | The close button is an icon-only `nph-button` named by `close-label`, with its own tooltip with that name. The actions are named by their text. The severity icon is `aria-hidden`: the title and the description say the severity in words |
| Keyboard | Tab reaches the actions and the close button, in reading order; Enter and Space activate them, as in `nph-button`. The notification takes no focus itself |
| Focus | The notification never moves focus. Actions and close show the focus ring of `nph-button`; on solid, the close shows a 2 px border in the text color and no halo |
| Time | A toast that closes by itself stays at least 6 seconds and pauses while the pointer is over it or focus is inside it. Error, loading and a toast with an action only leave when the person acts or closes them |
| Contrast | Text passes 4.5:1 and icon passes 3:1 in every severity and emphasis, in light and dark, including the label of the main and of the secondary action |
| Alternative to color | Each severity has its own icon drawing and the title says the result in words. The spinner of loading is decorative, next to the text |
| Touch target | With a mouse, actions and close use `control/height-default`. On a touch screen the actions take the size large and the touch area of the close grows to `control/height-large` |
| Reduced motion | The piece has no motion of its own; the time bar is stopped |

## Relations

**Combines with:** `nph-button` for the actions and the close, `nph-icon` for the severity,
`nph-spinner` for loading and `nph-skeleton` for the time bar.

**What is the parent:** a form area or any area of the page, for `inline`; the toast region of
the consuming application, for `toast`.

**What is the child:** `nph-icon` or `nph-spinner`, `nph-button` and, on the time bar,
`nph-skeleton`. They are internal: the piece has no slot.

**Which block this piece complements:** none.

**Appears in layouts:** none.

**Left for later:**

- The time bar is an `nph-skeleton` line, stopped, until `nph-progress` is approved and wired in.
- An action that navigates would be an `nph-link`; until it exists, the actions are `nph-button`.
- What needs an answer before going on is `nph-alert-dialog`, which the piece does not use.

**Responsibility boundary:** the notification draws one message, announces it, keeps the time of
a toast and fires `nph-action` and `nph-close`. The consumer writes the texts, decides what each
action does, removes the element after `nph-close`, and builds the region of toasts.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Box | `notification/radius` inline and `notification/toast-radius` on the toast; `notification/border-width` |
| Padding | `notification/padding-start`, `notification/padding-block`, `notification/padding-end` |
| Spaces | `notification/gap`, `notification/content-gap`, `notification/content-gap-single-line`, `notification/content-padding-block`, `notification/content-actions-gap`, `notification/actions-gap`, `notification/actions-padding-top` |
| Subtle | `notification/<severity>-surface` and `notification/<severity>-border` |
| Solid | `notification/<severity>-solid`; text, icon and close in `notification/on-solid` |
| Neutral | `notification/neutral-surface`, `-border`, `-icon`, `-solid` and `-on-solid` |
| Loading | `notification/loading-surface` and `notification/loading-border` |
| Text | `text/heading-xs` for the title and `text/body-md` for the description, in `notification/text` |
| Icon | `notification/icon-size`; `notification/<severity>-solid` on subtle |
| Secondary action | `notification/<severity>-action-foreground` and `notification/<severity>-action-background-hover`; neutral in `notification/neutral-action-*` |
| Close on solid | `notification/close-background-hover` and `notification/close-background-hover-opacity`; `notification/close-focus-border` and `notification/close-focus-border-width`; neutral in `notification/neutral-close-*` |
| Toast width | `notification/toast-width` stacked; `notification/toast-width-max` single-line and maximum |
| Elevation | `elevation/modal`, used directly: there is no `notification` token for it. In dark mode `shadow/color` is transparent, so the toast has no shadow and separates from the page by its surface and its border |
| Touch | `control/height-default` and `control/height-large` |
| Focus | `focus/border` and `focus/halo`, which the close on solid points at its own values |
| Region | `notification/stack-gap`, read by the consumer's container, not by the piece |

**Usage restrictions:** `nph-button` has no color property and no `::part`. The colors of the
contract that its own tokens do not give go through the public custom properties it already
reads, set on the element inside the notification and never on the page, as `nph-dialog` and
`nph-toolbar` do (P108):

- the secondary action is a ghost `nph-button` (primary, and danger on error) whose
  `color/primary-on-surface` and `color/primary-surface` (or `color/destructive-on-surface` and
  `color/destructive-surface`) point at `notification/<severity>-action-*`;
- the close on solid points `color/secondary-foreground`,
  `icon-button/secondary-ghost-background-hover` (a `color-mix` at the opacity of the contract),
  `focus/border`, `focus/halo` (transparent) and `border/width`, which only the focus border of the
  button reads.

No token is created or changed. In a part of the screen with another brand, `data-nph-brand` and
`data-nph-color-scheme` go on the same element (P67). The piece exposes no slot, no `::part` and
no color property.

**AI hints:**

- Use `nph-notification` to report a result, a risk or a piece of guidance; what needs an answer
  before going on is `nph-alert-dialog` and the error of a field stays in `nph-field`.
- Use `inline` for a message tied to an area of the page and `toast` to confirm an action or
  report the end of a task.
- Pick `severity` by meaning and never set a color; `help` is for guidance, never for the result
  of an operation.
- Write the result in `heading`, such as "Payment declined", and what happened and what to do in
  `description`, which is required.
- Give `action` and `secondary-action` as text, listen to `nph-action`, and use at most two;
  solid and loading take none.
- Give `close-label`, already localized, while the close button is shown; listen to `nph-close`
  and remove the element, because the notification only hides itself.
- Keep error toasts and toasts with an action on the screen until the person acts or closes
  them; they never close by themselves.
- Never turn on `time-bar` together with an action, on error, on loading or with `duration` 0.
- Build the toast region in your own container, at the bottom-right corner, with at most three
  toasts and `notification/stack-gap` between them.

## Examples

**Recommended cases** (the three the contract requires):

- **An error in a form area:** an `inline` notification, `severity="error"`, above the fields,
  with a heading that says the result, a description that says what to do and one action that
  leads to the fix. It stays until the problem is solved or the person closes it.
- **The confirmation of an action:** a `toast` with `severity="success"`, a short heading and
  description, no action. It closes by itself after 6 seconds, unless the person holds it with
  the pointer or with focus.
- **A task in progress:** a `toast` with `severity="loading"`, which has no actions and no close
  button and does not close by itself. When the task ends, the consumer changes the same toast
  to `success` or `error`.

**Alternative cases:** a `neutral` inline notice about the whole page, full width, at the top;
a `solid` toast for a message that needs more weight, with only the close button; a single-line
`toast` with a short text and its main action.

## Anti-patterns

- **Do not use `help` for the result of an operation** — use success, error, warning or info.
- **Do not put the main action in a neutral button**, such as secondary outline on a warning —
  the main action is the `nph-button` of the severity, solid; the notification draws it.
- **Do not use single-line with text longer than one line** — use stacked, with the actions
  below.
- **Do not use a toast for an error that stops the person** — use an inline notification near
  the problem, or `nph-alert-dialog` when it needs an answer.
- **Do not turn the title off and leave the description without the result.**
- **Do not allow an action and the time bar together** — the code blocks the pair.
- **Do not change severity, emphasis or layout by detaching the instance** — change the
  properties.
- **Do not forget to remove the element after `nph-close`** — the notification only hides.
- **Invalid combinations:** a value outside its list; an empty `description`; `loading` outside
  the subtle toast; a `duration` between 1 and 5999; `secondary-action` without `action` where it would be drawn (not on single-line);
  `time-bar` outside a subtle toast that closes by itself; the close button shown with no
  `close-label`. The notification draws nothing and emits `console.error` in development.
- **Do not create or adapt without a decision:** a toast region tag, a color property, a slot, a
  `::part`, a token of its own for the elevation, or an automatic removal of the element.

## Sources and decisions

- **The repository `design.md`:** the `notification/*` tokens, `color/inverse`,
  `color/inverse-foreground`, `color/background-subtle`, `elevation/modal`, `text/heading-xs`,
  `text/body-md`, `control/height-large` and the focus tokens. The `notification/*` tokens are in
  `src/tokens/source/semantic.tokens.json`.
- **The decision that originated it:** P108.
- **Pending decisions:** D-1 of the task DSA-63: whether the toast region becomes a piece of its
  own. It does not block the piece.
- **Tests:** `src/components/nph-notification/nph-notification.test.ts` and
  `nph-notification.docs.test.ts`.
- **Usage evidence:** the mandatory examples of the `nph-notification` Examples story and Docs
  page: an error in a form area, an action confirmation and a task in progress.
- **Storybook:** `src/components/nph-notification/nph-notification.stories.ts` and
  `nph-notification.docs.stories.ts`.
- **Figma:** `DS-IA-NEPHOS 5.0`, page `NPH — Notification` `1369:2`, documentation `3442:10163`,
  set `3434:9035` and the close focus on solid `4207:1146`.
