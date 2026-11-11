---
piece: nph-stepper
level: component
status: active
solves: >-
  Shows the steps of a process in order, such as a sign-up, a hiring or a setup wizard, and where
  the person is: the completed steps, the current one, the ones still to do and the ones with an
  error.
use_when:
  - "A process with steps in order and a fixed number, where the person needs to know how much is left: sign-up, hiring, setup. End it with a review step before sending."
  - "The order is required: the linear stepper, where only the completed steps and the steps with an error are clickable."
  - "The order is suggested: the non-linear stepper, where the pending steps are clickable too."
  - "The label alone does not say what the step asks for, and always on an active error, to say the reason: turn on the description."
  - "The step can be skipped: mark it optional instead of leaving it out."
  - "At the top of a form, card or dialog, with the content of the current step right below it."
do_not_use_when:
  - "For views with no order, such as the tabs of a profile: use nph-tabs."
  - "To show how much of a task is done with no named steps: use nph-progress."
  - "For the place in a hierarchy: use nph-breadcrumb."
  - "For a process of more than 7 steps: split the process."
  - "For two steppers on the same page, or one inside the other: use one stepper at the top of the process; sub-steps stay inside the step."
  - "For a whole sentence in the label: write one or two words, with the detail in the description."
  - "For a vertical process: the vertical stepper waits for nph-collapsible and does not exist yet."
api:
  steps:
    type: array
    required: true
    default: "empty list"
    reflects: false
    constraint: >-
      Property only. The steps, in order, as a list of { label, description, optional, status,
      disabled, href }. From 2 to 7: two are allowed, the documentation asks for 3 to 7, and 7 is
      the maximum. label is required, already localized, one or two words. description is the
      support line below the label, up to two lines, and on a step with an error it says the
      reason. optional turns on the word Optional. status is pending, completed or error; without
      it the status comes from the position, completed before current and pending after it. The
      step at current takes no status and no disabled. disabled makes the step impossible to
      activate. href makes a clickable step a link; without it, a clickable step is a button. href
      takes http, https, mailto, tel or a relative address; any other protocol, javascript among
      them, in any spelling the browser reads as such, is refused. An empty list is a mount and
      draws nothing and says nothing. A list that is not a list, has fewer than 2 or more than 7
      steps, or breaks a rule above draws nothing and emits console.error in development, one per
      cause.
  current:
    type: number
    required: false
    default: "1"
    reflects: false
    constraint: >-
      The position of the current step, an integer from 1 to the number of steps, the Figma
      property `atual`. The page sets it: the stepper keeps no state, and a click does not move it.
      A value outside 1 to the number of steps draws nothing and emits console.error in
      development.
  non-linear:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      Off, the stepper is linear: only the completed steps and the steps with an error are
      clickable, to go back and review. On, the pending steps are clickable too. A disabled step
      and the current step are never clickable. Reflects so the consumer can style and check it.
  label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name of the navigation landmark, already localized, such as Sign-up steps. It
      wins over the aria-label of the host. A stepper with neither draws and warns once in
      development.
  aria-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name of the landmark when label is not given; label wins over it. It is read
      by a property whose attribute is aria-label, since a property called ariaLabel is the native
      ARIA reflection of the element.
  completed-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The hidden text that opens a completed step, already localized, such as Completed. It is read
      by the screen reader and never drawn. A completed step without it draws and warns once in
      development.
  pending-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The hidden text that opens a pending step, already localized, such as Pending. It is also the
      text of a disabled step with an error, which looks pending. Without it a pending step draws
      and warns once in development.
  error-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The hidden text that opens a step with an error, already localized, such as With error.
      Without it a step with an error draws and warns once in development.
  optional-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The word Optional, already localized, drawn on a step with optional on. Without it an optional
      step draws without the word and warns once in development.
  step-text:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The text of the narrow width, already localized, with the markers {current} and {count}, such
      as Step {current} of {count}. The markers may come in any order the language needs. Without
      it the narrow width draws without the text and warns once in development.
  nph-step-select:
    type: event
    required: false
    default: "not_applicable"
    reflects: false
    constraint: >-
      The event a button step fires when the person activates it, with detail { step }, the 1-based
      position of the step. It bubbles and is composed. A step with href fires only the native
      click, which a router handles as it handles any link. Setting current from code fires
      nothing. The page changes current, moves the focus to the heading of the new step and updates
      the page title: the stepper moves nothing by itself.
variants:
  status:
    axis: state
    choose_when: "completed for the steps before the current one, current for where the person is, pending for the steps after it, and error for a step that failed validation, with its reason in the description."
    do_not_combine_with: ["a status or disabled on the current step", "error with no reason in the description when the error is active"]
  navigation:
    axis: behavior
    choose_when: "linear (the default) when the order is required; non-linear when the order is only suggested."
    do_not_combine_with: ["non-linear with a disabled step that the person is expected to open"]
states:
  rest:
    token: "stepper/marker-background, stepper/marker-border, stepper/marker-foreground, stepper/label-foreground, stepper/marker-background-complete, stepper/marker-foreground-complete, stepper/marker-background-error, stepper/marker-foreground-error"
    changes_for_user: "Each status has its own shape: a number in a thin outline (pending), a ring and a stronger label (current), a check (completed), a triangle and the reason (error)."
  current:
    token: "stepper/marker-border-current, stepper/marker-border-width-current, stepper/marker-foreground-current, stepper/label-foreground-current"
    changes_for_user: "A 2 px ring and a stronger label mark where the person is. It has rest only: no hover, no focus."
  hover:
    token: "stepper/item-background-hover, stepper/label-foreground-hover"
    changes_for_user: "The pending and completed steps that can be activated take a background; the step with an error takes none and only underlines its label. Hover never changes the look of the status."
  focus:
    token: "stepper/focus-border, stepper/focus-border-width, stepper/focus-border-radius, stepper/focus-ring, stepper/focus-ring-width, stepper/focus-radius"
    changes_for_user: "For keyboard users, a border and a halo outside the step area. A focused step has no hover background."
  disabled:
    token: "stepper/item-disabled-opacity"
    changes_for_user: "The whole step is dimmed and cannot be activated. A completed step keeps its background and check; a step with an error goes back to the pending look."
business_rules:
  - "The stepper is linear by default: only the completed steps and the steps with an error are clickable. Non-linear makes the pending steps clickable too."
  - "The page sets the current step, the status of each step and which steps are disabled. The stepper keeps no state: a click fires an event or follows a link and leaves current alone."
  - "From 2 to 7 steps. Two are allowed; the documentation asks for 3 to 7; above 7, split the process. The stepper never collapses steps."
  - "The text column stops at stepper/text-max-width. The label of a pending, completed or error step stays on one line and is cut with an ellipsis, and the whole text opens in nph-tooltip; the label of the current step wraps to up to two lines and is never cut. The description goes up to two lines."
  - "The connector fills the space between the steps and never gets narrower than stepper/connector-min-width."
  - "A clickable step is a link when it has href and a button when it has none. A button step fires nph-step-select; a link step fires only the native click."
  - "Below 600 px of its own width the stepper becomes nph-progress of the steps type, with the text Step N of M and the label of the current step. The width counts the stepper, not the window."
  - "Combined states: completed + disabled keeps the background and the check under the disabled opacity. Error + disabled: disabled wins, the marker goes back to the pending one and the reason shows only when the description is on. Current + disabled does not apply. Status + hover keeps the look of the status."
  - "Every text comes from the consumer, already localized: the piece writes no word of its own."
  - "The vertical stepper is not part of this piece yet: it waits for nph-collapsible."
domain_errors:
  - "A steps that is not a list, or with fewer than 2 or more than 7 steps: the stepper draws nothing and emits console.error in development, one per cause."
  - "A current that is not an integer from 1 to the number of steps: the stepper draws nothing and emits console.error in development."
  - "A step without label, with a status outside the list, with a status or disabled on the current step, or with an unsafe href: the stepper draws nothing and emits console.error in development."
  - "A stepper with no accessible name, a status with no hidden text, an optional step with no optional-label or no step-text for the narrow width draws and warns once in development, because the texts may arrive after the first render."
tokens:
  marker: "stepper/marker-size, stepper/marker-radius, stepper/marker-border-width, stepper/marker-border-width-current, stepper/marker-icon-size, stepper/marker-background, stepper/marker-border, stepper/marker-foreground, stepper/marker-border-current, stepper/marker-foreground-current, stepper/marker-background-complete, stepper/marker-foreground-complete, stepper/marker-background-error, stepper/marker-foreground-error"
  label: "stepper/label-foreground, stepper/label-foreground-hover, stepper/label-foreground-current, stepper/label-foreground-complete, stepper/label-foreground-error"
  description: "stepper/description-foreground, stepper/description-foreground-error"
  connector: "stepper/connector-background, stepper/connector-background-complete, stepper/connector-thickness, stepper/connector-gap, stepper/connector-min-width"
  step_area: "stepper/item-gap, stepper/item-padding-x, stepper/item-padding-y, stepper/item-radius, stepper/item-background-hover, stepper/item-disabled-opacity, stepper/text-max-width"
  focus: "stepper/focus-border, stepper/focus-border-width, stepper/focus-border-radius, stepper/focus-ring, stepper/focus-ring-width, stepper/focus-radius"
  motion: "stepper/state-duration"
  typography: "text/label-sm, text/label-md, text/label-md-strong, text/body-sm"
ai_hints:
  - "Use nph-stepper at the top of a form, card or dialog for a process with a fixed number of ordered steps; for views with no order use tabs, for how much is done use progress."
  - "Give steps in order, with a short label of one or two words; put the detail in description and the reason of an error in the description of the step with an error."
  - "Set current from the page, and change it when the person moves on; the stepper keeps no state."
  - "Keep it linear when the order is required, and turn non-linear on only when the order is suggested."
  - "Give each clickable step an href when the step is a page, or listen to nph-step-select when it is not; move the focus to the heading of the new step."
  - "Give the stepper a label, or an aria-label, and the texts it owes: completed-label, pending-label, error-label, optional-label and step-text."
  - "Do not put more than 7 steps, and do not put two steppers on the same page."
accessibility:
  semantics: "A nav, named, holding an ordered list. Each step is a list item: a link or a button when it can be activated, and text otherwise. The current step carries aria-current step. A disabled step carries aria-disabled true. The stepper is navigation, not a tablist: it has no arrow keys. The marker is hidden from assistive technology and the position comes from the list. The connector is decorative, hidden, and has no list item of its own."
  accessible_name: "The landmark: label, else the aria-label of the host. A step: the hidden status text at its start, then its label; the current step has no hidden text, since aria-current says it. The description and Optional are part of the step, so the reason of an error is read. A disabled step with an error is named as pending."
  keyboard:
    - "Tab and Shift+Tab move through the clickable steps, in list order. The current step and the disabled steps take no Tab."
    - "Enter activates a step. Space activates it too when it is a button; on a link, Space scrolls the page as the browser does."
    - "The arrow keys do nothing in the stepper: each step is a Tab stop."
    - "A pending step of the linear stepper whose label is cut takes Tab only to open the balloon with the whole label: it is not a link and Enter does nothing."
    - "Esc closes the balloon of a cut label without moving the focus."
  focus: "Keyboard only, on a step that takes Tab: a border of stepper/focus-border-width in stepper/focus-border and a halo in stepper/focus-ring outside the step area, which the connector keeps from clipping. A focused step has no hover background."
  contrast: "The label, the number and the description meet 4.5:1 over the background and the card, in light and dark, in every brand; the ring of the current step, the error background and the focus border meet 3:1. Inside a dialog, in dark, some brand and error colors fall below this: it is a foundation question, not a decision of the piece."
  color_alternative: "Each status has its own shape and is never told by color alone: a number in a thin outline (pending), a ring and a stronger label (current), a check (completed), a triangle and the reason (error). On hover, the step with an error gets an underline."
invalid_combinations:
  - "A status or disabled on the current step — the current step is where the person is, and a blocked step cannot be it."
  - "A steps with fewer than 2 or more than 7 steps — the stepper draws nothing."
  - "A current outside 1 to the number of steps — the stepper draws nothing."
  - "An href with a protocol other than http, https, mailto or tel — the stepper draws nothing."
  - "Two steppers on the same page, or one inside the other."
  - "A vertical stepper — it waits for nph-collapsible."
relations:
  combines_with: [nph-icon, nph-tooltip, nph-progress, nph-button]
  parents: ["the top of a form, card or dialog"]
  children: [nph-icon, nph-tooltip, nph-progress]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Using the stepper for views with no order, such as the tabs of a profile."
  - "Putting a whole sentence in the label instead of one or two words."
  - "Putting two steppers on the same page, or one inside the other."
  - "Changing the number of steps in the middle of the process."
  - "Leaving the reason of an active error out of the description."
  - "Putting Back and Continue inside the stepper: they belong to the footer of the form."
  - "Leaving the stepper without a label or an aria-label."
sources:
  design_md: "design.md, the stepper/* tokens, the colors they point to and the global focus/* tokens"
  decision: "P117 — nph-stepper: API and semantics"
  tests: "src/components/nph-stepper/nph-stepper.test.ts"
  usage_evidence: "no screen consumes it yet"
  storybook: "src/components/nph-stepper/nph-stepper.stories.ts and nph-stepper.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-stepper documentation 5569:6530, sets 5541:1622 and 5540:581"
---

# nph-stepper

## Function

**The problem it solves:** shows the steps of a process in order and where the person is. The
person sees what is done, what comes next and what failed, and goes back to review a step with
one click.

**When to use:**

- A process with steps in order and a fixed number, where the person needs to know how much is
  left: sign-up, hiring, setup. End it with a review step before sending.
- The order is required: the linear stepper, where only the completed steps and the steps with an
  error are clickable.
- The order is suggested: the non-linear stepper, where the pending steps are clickable too.
- The label alone does not say what the step asks for, and always on an active error, to say the
  reason: turn on the description.
- The step can be skipped: mark it optional instead of leaving it out.
- At the top of a form, card or dialog, with the content of the current step right below it.

**When NOT to use:**

- **For views with no order**, such as the tabs of a profile — use `nph-tabs`.
- **To show how much of a task is done with no named steps** — use `nph-progress`.
- **For the place in a hierarchy** — use `nph-breadcrumb`.
- **For a process of more than 7 steps** — split the process.
- **For two steppers on the same page, or one inside the other** — use one stepper at the top of
  the process; sub-steps stay inside the step.
- **For a whole sentence in the label** — write one or two words, with the detail in the
  description.
- **For a vertical process** — the vertical stepper waits for `nph-collapsible` and does not exist
  yet.

## Variants

| Variant | Values | Choose when |
|---|---|---|
| Status | `completed`, current, `pending`, `error` | `completed` before the current step, the current step where the person is, `pending` after it, `error` for a step that failed validation, with its reason in the description |
| Navigation | linear (default), `non-linear` | Linear when the order is required; non-linear when the order is only suggested |
| Count | 2 to 7 steps | 3 to 7 by the documentation; two are allowed; above 7, split the process |
| Content of a step | description, optional | The description when the label does not say what the step asks for, and on every active error; optional on a step that can be skipped |

The status is the Figma property `status`, with the values `pendente` (pending), `atual`
(current), `concluída` (completed) and `erro` (error). The count and the current position are the
Figma properties `etapas` and `atual` of the stepper. The description and the optional mark are
the Figma booleans `descrição` and `opcional` of the step. In code, the current step is the one at
`current`, and the other statuses come from the position or from `status` on the step.

**By size and density:** `not_applicable`. The stepper has a single size, with a 24 marker and a
step area at least 32 high.

**Do not combine with:** a `status` or `disabled` on the current step; fewer than 2 or more than 7
steps; a `current` outside the list.

## States

| Part | State | Token | What changes for the person |
|---|---|---|---|
| Step | Rest | `stepper/marker-*`, `stepper/label-foreground*` | Each status has its own shape: a number in a thin outline, a ring, a check, a triangle |
| Current step | Rest | `stepper/marker-border-current`, `stepper/marker-foreground-current`, `stepper/label-foreground-current` | A ring and a stronger label. Rest only: no hover, no focus |
| Step | Hover | `stepper/item-background-hover`, `stepper/label-foreground-hover` | The pending and completed steps that can be activated take a background. The step with an error takes none and only underlines its label |
| Step | Focus | `stepper/focus-border`, `stepper/focus-ring` | For keyboard users, a border and a halo outside the step area. No hover background |
| Step | Disabled | `stepper/item-disabled-opacity` | The whole step is dimmed and cannot be activated |

In the Figma set of the step, `estado` has the values `padrão` (default), `hover`, `foco` (focus)
and `desabilitado` (disabled). The current step has only `padrão`.

**Combined states (rule T11):**

- **Completed + disabled:** keeps its background and its check under the disabled opacity.
- **Error + disabled:** disabled wins. The marker goes back to the pending one (background,
  outline, number), the label goes to the pending color, the hidden text is the pending one and
  the reason shows only when the description is on, in the description color, under the opacity.
- **Current + disabled:** does not apply. The current step is where the person is; a blocked step
  cannot be it.
- **Status + hover:** keeps the look of the status. Only the pending and completed steps that can
  be activated get the hover background; the step with an error gets the underline.

**Feedback and focus:** focus shows only for keyboard users and **is not removed**: a border and a
halo outside the step area, centered on it, with the corners following the area. The connector
keeps the steps apart, so nothing clips the focus. A focused step has no hover background, because
the focus border on the hover background falls below 3:1 in dark in some brands. The color of a
status changes in `stepper/state-duration`; with reduced motion, it changes at once. Nothing moves.

**Business rule the piece carries:**

- The stepper is linear by default. Non-linear makes the pending steps clickable too. A disabled
  step and the current step are never clickable.
- The page sets the current step and the status of each step. The stepper keeps no state.
- From 2 to 7 steps; it never collapses steps.
- The text column stops at `stepper/text-max-width`. A pending, completed or error label stays on
  one line and is cut with an ellipsis, with the whole text in `nph-tooltip`; the current label
  wraps to two lines and is never cut. The description goes up to two lines. The connector never
  gets narrower than `stepper/connector-min-width`.
- A clickable step is a link with `href` and a button without it. A button step fires
  `nph-step-select`; a link fires only the native click.
- Below 600 px of its own width, the stepper becomes `nph-progress` of the steps type, with the
  text "Step N of M" and the label of the current step.
- Every text comes from the consumer, already localized: the piece writes no word of its own.

**Domain error states:** an invalid `steps`, `current` or step draws nothing and emits
`console.error` in development, one per cause. A missing accessible name or a missing text draws
and warns once in development.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | A `nav`, named, holding an ordered list. Each step is a list item: a link or a button when it can be activated, and text otherwise. The current step carries `aria-current="step"`; a disabled step carries `aria-disabled="true"`. It is navigation, not a tablist: no arrow keys. The marker is hidden from assistive technology and the position comes from the list. The connector is decorative, hidden, and has no list item of its own |
| Accessible name | The landmark: `label`, else the `aria-label` of the host. A step: the hidden status text at its start, then its label; the current step has none, since `aria-current` says it. The description and "Optional" belong to the step, so the reason of an error is read. A disabled step with an error is named as pending |
| Keyboard | Tab moves through the clickable steps, in list order; the current step and the disabled ones take no Tab. Enter activates a step, and Space too on a button. The arrow keys do nothing. A pending step of the linear stepper with a cut label takes Tab only to open the balloon: it is not a link and Enter does nothing. Esc closes the balloon without moving the focus |
| Focus | Keyboard only: a border of `stepper/focus-border-width` in `stepper/focus-border` and a halo in `stepper/focus-ring` outside the step area. A focused step has no hover background |
| Contrast | The label, the number and the description meet 4.5:1 over the background and the card, in light and dark, in every brand; the ring of the current step, the error background and the focus border meet 3:1. Inside a dialog, in dark, some brand and error colors fall below this: it is a foundation question |
| Alternative to color | Each status has its own shape: a number in a thin outline, a ring and a stronger label, a check, a triangle and the reason. The step with an error gets an underline on hover |
| Touch target | The whole step area is the target, at least 32 high, above the minimum of 24 |
| Cut text | A cut label shows the whole text in `nph-tooltip`, on hover after a short wait and on focus at once; the current label is never cut |
| Known limits | (a) The stepper stretches to the width of where it lives and takes inline size containment to measure it: in a shrink-to-fit parent, such as an inline flex item, give it a width, or `flex: 1` in a flex row. (b) The 600 px of the narrow width is written in the CSS, because a query does not accept a custom property, and it is not one of the four breakpoints of the system (D-2). (c) On the narrow width the progress shows the position only: a step with an error does not show as an error there (D-3). (d) A pending step of the linear stepper with a cut label is a focusable span with no role, which is the reading of the accepted rule, open for confirmation (D-4). (e) A description cut at its second line shows no balloon: the reason of an error must fit in two lines. (f) A disabled step gets no balloon, because `nph-tooltip` opens only on an element that takes focus; the screen reader reads the whole label. (g) The hover background paints only the steps that can be activated, which is a reading of the accepted rule (D-4). (h) The vertical stepper does not exist: it waits for `nph-collapsible`. (i) Inside a dialog, in dark, some brand and error colors fall below the contrast minimum, a foundation question (D-1). (j) The current label that needs more than two lines in the text column is cut at the second line, with no balloon: it is a misuse, since a label is one or two words. (k) When the room runs short above 600 px, the text column gives up its room first, down to nothing, and the marker and the connector keep their structural minimum; below the sum of those minimums, such as seven steps with the text at its maximum, the list scrolls sideways and takes the Tab key itself. (l) The color of the connector follows the position, brand before the current step and neutral after it, as the Figma draws it; a status the page sets against the position, such as a pending step before the current one, keeps that connector (D-5) |

## Relations

**Combines with:** `nph-icon`, which draws the check and the triangle of the marker;
`nph-tooltip`, which shows a cut label in full; `nph-progress`, which is the narrow shape of the
stepper; and `nph-button`, which sits in the footer of the form as Back and Continue, not inside
the stepper.

**What is the parent:** the top of a form, card or dialog. The container gives the background and
the margin, and the content of the current step comes right below; the space to it comes from the
form layout, because the stepper has no margin of its own.

**What is the child:** `nph-icon`, `nph-tooltip` and `nph-progress`, drawn by the piece.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

**Family:** position on a path — `nph-breadcrumb` and `nph-tabs` lead to `nph-stepper`, which
becomes `nph-progress` below 600 px.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Marker | `stepper/marker-size`, `stepper/marker-radius`, `stepper/marker-border-width`, `stepper/marker-border-width-current`, `stepper/marker-icon-size`, `stepper/marker-background`, `stepper/marker-border`, `stepper/marker-foreground`, `stepper/marker-border-current`, `stepper/marker-foreground-current`, `stepper/marker-background-complete`, `stepper/marker-foreground-complete`, `stepper/marker-background-error`, `stepper/marker-foreground-error` |
| Label | `stepper/label-foreground`, `stepper/label-foreground-hover`, `stepper/label-foreground-current`, `stepper/label-foreground-complete`, `stepper/label-foreground-error` |
| Description and "Optional" | `stepper/description-foreground`, `stepper/description-foreground-error` |
| Connector | `stepper/connector-background`, `stepper/connector-background-complete`, `stepper/connector-thickness`, `stepper/connector-gap`, `stepper/connector-min-width` |
| Step area | `stepper/item-gap`, `stepper/item-padding-x`, `stepper/item-padding-y`, `stepper/item-radius`, `stepper/item-background-hover`, `stepper/item-disabled-opacity`, `stepper/text-max-width` |
| Focus | `stepper/focus-border`, `stepper/focus-border-width`, `stepper/focus-border-radius`, `stepper/focus-ring`, `stepper/focus-ring-width`, `stepper/focus-radius` |
| Motion | `stepper/state-duration` |
| Typography | `text/label-sm` (number), `text/label-md` (label), `text/label-md-strong` (current label), `text/body-sm` (description and "Optional") |

**Usage restrictions:** the piece does not choose color, radius, size or typography: everything
comes from a token. The narrow width is `nph-progress` and keeps its own tokens. The piece has no
slot, no `::part` and no color property.

**AI hints:**

- Use `nph-stepper` at the top of a form, card or dialog for a process with a fixed number of
  ordered steps; for views with no order use tabs, for how much is done use progress.
- Give `steps` in order, with a short label of one or two words; put the detail in `description`
  and the reason of an error in the `description` of the step with an error.
- Set `current` from the page, and change it when the person moves on; the stepper keeps no state.
- Keep it linear when the order is required, and turn `non-linear` on only when the order is only
  suggested.
- Give each clickable step an `href` when the step is a page, or listen to `nph-step-select` when
  it is not; move the focus to the heading of the new step.
- Give the stepper a `label`, or an `aria-label`, and the texts it owes: `completed-label`,
  `pending-label`, `error-label`, `optional-label` and `step-text`.
- Do not put more than 7 steps, and do not put two steppers on the same page.

## Examples

**Recommended case:** the sign-up in four steps, on step 2: the first step completed, the second
current and the other two pending, linear.

**Alternative case:** the step before the current one with an error and its reason in the
description ("Fix 2 fields"); the non-linear stepper in five steps, with the last one disabled;
the linear stepper in three steps, on step 2; the stepper at the top of a form inside a card.

## Anti-patterns

- **Do not use the stepper for views with no order** — use `nph-tabs`.
- **Do not put a whole sentence in the label** — one or two words, with the detail in the
  description.
- **Do not put two steppers on the same page, or one inside the other** — one stepper at the top of
  the process; sub-steps stay inside the step.
- **Do not change the number of steps in the middle of the process** — it takes away the sense of
  how much is left.
- **Do not leave the reason of an active error out of the description** — the triangle says there
  is an error; the text says what to do.
- **Do not put Back and Continue inside the stepper** — they belong to the footer of the form.
- **Do not leave the stepper without a name** — give `label` or `aria-label`.
- **Invalid combinations:** a `status` or `disabled` on the current step; fewer than 2 or more
  than 7 steps; a `current` outside the list; an unsafe `href`.
- **Do not create without a decision:** a vertical stepper, a collapse of the steps, a free color,
  a step that is a tab.

## Sources and decisions

- **The repository `design.md`:** the `stepper/*` tokens, the colors they point to and the global
  `focus/*` tokens.
- **The decision that originated it:** P117.
- **Tests:** `src/components/nph-stepper/nph-stepper.test.ts`.
- **Usage evidence:** no screen consumes it yet.
- **Storybook:** `src/components/nph-stepper/nph-stepper.stories.ts` and
  `nph-stepper.docs.stories.ts`.
- **Figma:** the `nph-stepper` documentation frame (`5569:6530`), the sets `5541:1622` and
  `5540:581` in `DS-IA-NEPHOS 5.0`.
