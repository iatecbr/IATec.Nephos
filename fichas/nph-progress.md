---
piece: nph-progress
level: component
status: active
solves: >-
  Shows how much of a long process is done, such as an upload or a sign-up in steps, or
  that it is under way while there is still no value.
use_when:
  - "When the process takes more than a few seconds and the system knows how much is done, or into how many fixed steps it splits."
  - "determinate whenever there is a percentage."
  - "indeterminate only until the first real value arrives, and switch to determinate as soon as it does."
  - "steps when the process has a few fixed, known steps, such as a sign-up: show the N of M and say the current step in the help text."
  - "At the end, show success or error with the icon and the help text, because the bar must not stay stopped at a partial value."
  - "md in the body of the screen and sm in dense places, such as the header of a flow or a card."
  - "Show the value as text next to the bar, because the track is subtle and the text gives the exact value."
do_not_use_when:
  - "For a short wait with no value: use nph-spinner."
  - "As a fixed level meter, such as used space or a grade: progress changes over time; for a fixed level, show only the value as text."
  - "Without a label or an aria-label: the screen reader does not know what it measures."
  - "As navigation between the steps of a flow: the steps type only shows progress; to mark each step, use nph-stepper."
  - "As an adjustment control: the person does not drag or choose the value; use nph-slider."
api:
  type:
    type: enum
    values: [determinate, indeterminate, steps]
    required: false
    default: determinate
    reflects: true
    constraint: >-
      It is the Figma property tipo. determinate draws the proportion of value;
      indeterminate draws a segment one third of the track that runs in a loop, while
      there is no value; steps splits the bar into equal segments, one per fixed step.
      Reflects because the internal CSS selects the parts by it. Any other value draws
      nothing and emits console.error in development.
  size:
    type: enum
    values: [md, sm]
    required: false
    default: md
    reflects: true
    constraint: >-
      It is the Figma property tamanho. md is the 8 px bar for the body of the screen; sm
      is the 4 px bar for dense places. Any other value draws nothing and emits
      console.error in development.
  status:
    type: enum
    values: [active, success, error]
    required: false
    default: active
    reflects: true
    constraint: >-
      It is the Figma property status. On determinate, success and error exist only at
      value 100; on steps, with any number of steps; indeterminate has only active.
      Success and error bring the status icon and, on error, the help text is required.
      Reflects because the colors come from it. Any other value, or a status that does not
      exist on the type, draws nothing and emits console.error in development.
  value:
    type: number
    required: false
    default: "0"
    reflects: false
    constraint: >-
      From 0 to 100, read on determinate. In the Figma set the values are the samples 0, 25,
      50, 75 and 100; on screen the value is continuous. At 0 the indicator disappears and
      only the end stop remains. A value that is not a number from 0 to 100 draws nothing
      and emits console.error in development.
  steps:
    type: number
    required: false
    default: "none"
    reflects: false
    constraint: >-
      The number of steps, read on steps: an integer of 2 or more. Required on steps; a
      count that is not an integer, or is below 2, draws nothing and emits console.error in
      development. There is no enforced maximum: avoid more than 7 steps (the usage
      guidance of Carbon and Ant Design), and the bar still draws any count.
  step:
    type: number
    required: false
    default: "1"
    reflects: false
    constraint: >-
      The current step, an integer from 1 to steps, read on steps. On active, the steps up
      to the current one are done and the rest pending; on error, the current step is the
      one with the error. Outside 1 to steps, the bar draws nothing and emits console.error
      in development.
  label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The visible label above the bar, already localized. It names the bar for the screen
      reader. Empty turns the part off, and then the aria-label of the host is the name.
  value-text:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The text next to the label, already localized: the percentage ("50%"), the "N of M" on
      steps, or a state word on indeterminate and on error ("In progress", "Error on step
      3"). It is also the aria-valuetext. Empty turns the part off.
  help:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The help text below the bar, already localized. It describes the bar for the screen
      reader. On error it is required and says what failed and what to do; without it the
      bar draws and warns in development.
  aria-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name when label is not given. The label wins over it. A bar with
      neither draws and warns once in development.
variants:
  type:
    axis: appearance
    choose_when: "determinate when there is a percentage; indeterminate while there is no value yet; steps when the process has 2 or more fixed steps, preferably no more than 7."
    do_not_combine_with: [value on steps, steps on determinate, status success or error on indeterminate]
  size:
    axis: size
    choose_when: "md in the body of the screen; sm in dense places, such as the header of a flow or a card."
    do_not_combine_with: []
  status:
    axis: state
    choose_when: "active while the process runs; success and error when it ends, with the icon and the help text."
    do_not_combine_with: [success or error on determinate below 100, success or error on indeterminate]
states:
  active:
    token: progress/indicator-background
    changes_for_user: "The indicator, or the done segments, show how much is done."
  success:
    token: progress/indicator-background-success
    changes_for_user: "The bar and the icon circle-check take the success color, and the help text tells it ended."
  error:
    token: progress/indicator-background-error
    changes_for_user: "The bar, the icon circle-xmark and the help text take the error color, and the help text says what failed."
  indeterminate-loop:
    token: progress/loop-duration
    changes_for_user: "A segment one third of the track runs from the left edge to the right edge, in one pass of 1400 ms, linear, in a loop."
business_rules:
  - "The bar is not interactive: it has no hover, pressed or focus state and no focus ring. An action such as Cancel is an nph-button next to it."
  - "The track is decorative: alone it carries no information. The value shows as text and the end shows through the end stop."
  - "Below 100 the end stop, 4 x 4 on both sizes and never taller than the bar, shows at the end of the track, and progress/track-gap separates the indicator from the rest of the track, so the indicator is slightly shorter than the exact proportion. The exact value is the text one."
  - "The width is fluid, 100% of the container, with a minimum of 48 px. There is no width token."
  - "The loop exists only while there is no value: when the first real value arrives, the consumer switches to determinate. With reduced motion, the loop stops and the segment rests at the start."
  - "The color comes from the status: there is no free color."
  - "On steps, the current step has the color of the done ones: the N of M and the help text say which step the person is on."
  - "Success and error show the status icon, and on error the help text is required: color alone does not explain."
domain_errors:
  - "Success or error on determinate below 100, or on indeterminate: the bar draws nothing and emits console.error in development."
  - "Error without help: the bar draws and warns in development."
tokens:
  track: progress/track-background
  indicator: "progress/indicator-background, progress/indicator-background-success, progress/indicator-background-error"
  end_stop: "progress/stop-background, progress/stop-size"
  track_gap: progress/track-gap
  height: "progress/height-md, progress/height-sm"
  radius: progress/radius
  gap: "progress/gap, progress/label-gap"
  label: progress/label-foreground
  value_text: progress/value-foreground
  help: "progress/help-foreground, progress/help-foreground-error"
  status_icon: "progress/icon-size, progress/icon-success, progress/icon-error"
  segment: "progress/segment-background, progress/segment-background-pending, progress/segment-background-success, progress/segment-background-error, progress/segment-gap, progress/segment-radius"
  loop: "progress/loop-duration, progress/loop-easing"
ai_hints:
  - "Use nph-progress for a long process the system can measure or split into fixed steps; for a short wait with no value, use nph-spinner."
  - "Use determinate whenever there is a percentage, and indeterminate only until the first real value arrives; then switch the type."
  - "Always give a label, or an aria-label when the label is off, because the label is the accessible name."
  - "At the end, set success or error with value 100 and the help text; on error, the help text says what failed."
  - "On steps, give steps (2 or more, avoid more than 7) and the current step, and write the N of M in value-text and the current step in help."
  - "Do not use nph-progress as navigation between steps or as a fixed level meter."
accessibility:
  semantics: "The track is a progressbar with aria-valuemin 0 and aria-valuemax 100. Determinate gives aria-valuenow the value; steps gives it the share of steps, counting the current one, with the N of M in aria-valuetext; indeterminate omits it. The status icon is decorative."
  accessible_name: "The label, by aria-labelledby; with no label, the aria-label of the host. The help text is the description."
  keyboard: []
  focus: "The bar does not receive focus and has no focus ring."
  contrast: "Label, value text and help text, including the error one, pass 4.5:1 over the background in both themes. The indicator and the done, success and error segments pass 3:1 against the background and against the track, in both themes. The track and the pending segment are decorative."
  color_alternative: "Success and error also show through the status icon and the help text. The value shows as text. On steps, the N of M and the help text say which step the person is on."
invalid_combinations:
  - "Success or error on determinate below 100 — the contract has them only at value 100."
  - "Success or error on indeterminate — it has only active."
  - "Steps that is not an integer of 2 or more, or a step outside 1 to steps."
  - "A free color, a width token or a focus state — the color comes from the status and the bar is not interactive."
  - "An error without the help text — color alone does not say what failed."
relations:
  combines_with: [nph-icon, nph-button]
  parents: [card, dialog, form, page]
  children: [nph-icon]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Using the bar for a short wait with no value."
  - "Using the bar as a fixed level meter."
  - "Leaving the bar without a label or an aria-label."
  - "Using the steps bar as navigation between steps."
  - "Leaving the bar stopped at a partial value at the end of the process."
sources:
  design_md: "design.md, the progress/* tokens, motion/loop-long-duration and motion/loop-long-easing"
  decision: "P107 — API and semantics of nph-progress, 06-11-2026"
  tests: "src/components/nph-progress/nph-progress.test.ts"
  usage_evidence: "none in code yet; the accepted frame shows an upload in progress, a preparing with no percentage and a sign-up in steps"
  storybook: "src/components/nph-progress/nph-progress.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-progress documentation frame 4385:3186, sets 4368:1532 and 4368:1185"
---

# nph-progress

## Function

**The problem it solves:** shows how much of a long process is done, such as an upload or a
sign-up in steps, or that it is under way while there is still no value. The person sees
progress, and the bar ends with success or error, never stopped at a partial value.

**When to use:**

- When the process takes more than a few seconds and the system knows how much is done, or
  into how many fixed steps it splits.
- `determinate` whenever there is a percentage.
- `indeterminate` only until the first real value arrives, and switch to `determinate` as
  soon as it does.
- `steps` when the process has 2 or more fixed, known steps, such as a sign-up; avoid more than
  7 steps, as Carbon and Ant Design advise (no maximum is enforced): show the "N of M"
  and say the current step in the help text.
- At the end, show success or error with the icon and the help text, because the bar must not
  stay stopped at a partial value.
- `md` in the body of the screen and `sm` in dense places, such as the header of a flow or a
  card.
- Show the value as text next to the bar, because the track is subtle and the text gives the
  exact value.

**When NOT to use:**

- **For a short wait with no value** — use `nph-spinner`.
- **As a fixed level meter**, such as used space or a grade — progress changes over time; for a
  fixed level, show only the value as text.
- **Without a label or an `aria-label`** — the screen reader does not know what it measures.
- **As navigation between the steps of a flow** — the `steps` type only shows progress; to mark
  each step, use `nph-stepper`.
- **As an adjustment control** — the person does not drag or choose the value; use
  `nph-slider`.

## Variants

| Variant | Values | Choose when |
|---|---|---|
| `type` | `determinate` (default), `indeterminate`, `steps` | `determinate` when there is a percentage; `indeterminate` while there is no value yet; `steps` when the process has 2 or more fixed steps; avoid more than 7, because the segments get thin and the "N of M" stops being quick to read (no maximum is enforced) |
| `size` | `md` (default), `sm` | `md` in the body of the screen; `sm` in dense places |
| `status` | `active` (default), `success`, `error` | `active` while the process runs; `success` and `error` when it ends |

`type` is the Figma property `tipo` (`determinado`, `indeterminado` and `etapas`), `size` is
`tamanho` and `status` is `status` (`ativo`, `sucesso` and `erro`). In Figma the values of
`valor` (0, 25, 50, 75 and 100) and the step counts (`etapas`) are samples; on screen the
value is continuous, from 0 to 100, and the step count is any integer of 2 or more.

**By size and density:** `size`. `md` is the 8 px bar and `sm` the 4 px one; the end stop is
4 x 4 on both and the label, value text and help text do not change.

**Do not combine with:** `value` on `steps`; `steps` on `determinate`; `success` or `error` on
`indeterminate`; `success` or `error` on `determinate` below 100.

## States

| State | Token | What changes for the person |
|---|---|---|
| Active | `progress/indicator-background` | The indicator, or the done segments, show how much is done |
| Success | `progress/indicator-background-success` | The bar and the icon `circle-check` take the success color, and the help text tells it ended |
| Error | `progress/indicator-background-error` | The bar, the icon `circle-xmark` and the help text take the error color, and the help text says what failed |
| Indeterminate loop | `progress/loop-duration` | A segment one third of the track runs from the left edge to the right edge, in one pass of 1400 ms, linear, in a loop |

**Feedback and focus:** the bar has no hover, pressed or focus state and no focus ring. If
there is an action next to it, such as Cancel, the ring belongs to the `nph-button`.

**Business rule the piece carries:**

- The track is decorative: alone it carries no information. The value shows as text and the end
  shows through the end stop.
- Below 100, the end stop shows at the end of the track and `progress/track-gap` separates the
  indicator from the rest of the track, so the indicator is slightly shorter than the exact
  proportion. The exact value is the text one. At 0 the indicator disappears and only the end
  stop remains.
- The width is fluid, 100% of the container, with a minimum of 48 px. There is no width token.
- The loop exists only while there is no value. When the first real value arrives, the consumer
  switches `type` to `determinate`. With reduced motion, the loop stops and the segment rests at
  the start of the track, with the state word beside it.
- The color comes from the status: there is no free color.
- On `steps`, the current step has the color of the done ones; the "N of M" and the help text say
  which step the person is on.

**Domain error states:** success or error on `determinate` below 100, or on `indeterminate`,
draws nothing and emits `console.error` in development. An error without the help text draws and
warns in development.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | The track is a `progressbar`, with `aria-valuemin` 0 and `aria-valuemax` 100. `determinate` gives `aria-valuenow` the value; `steps` gives it the share of steps, counting the current one, with the "N of M" in `aria-valuetext`; `indeterminate` omits it. The status icon is decorative |
| Accessible name | The label, by `aria-labelledby`; with no label, the `aria-label` of the host. The help text is the description |
| Keyboard and focus | The bar does not receive focus, as it is not interactive, and has no focus ring |
| Contrast | Label, value text and help text, including the error one, pass 4.5:1 over the background in both themes. The indicator and the done, success and error segments pass 3:1 against the background and against the track, in both themes. The track and the pending segment are decorative |
| Alternative to color | Success and error also show through the status icon and the help text. The value shows as text. On `steps`, the "N of M" and the help text say which step the person is on |
| Touch target | Does not apply: the bar takes no click. Nearby actions use the `nph-button` target |
| Motion | The only motion is the indeterminate loop. It runs only while there is no value; with reduced motion it stops |

## Relations

**Combines with:** `nph-icon`, which draws the status icon, and `nph-button`, for an action such
as Cancel next to the bar. A short wait with no value uses `nph-spinner`; a flow that marks each
step and the current step uses `nph-stepper`.

**What is the parent:** a card, a dialog, a form or a page that holds a long process.

**What is the child:** an `nph-icon`, the status icon on success and on error.

**Which block this piece complements:** none.

**Appears in layouts:** none.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Track | `progress/track-background` |
| Indicator | `progress/indicator-background`, `progress/indicator-background-success`, `progress/indicator-background-error` |
| End stop | `progress/stop-background`, `progress/stop-size` |
| Gap between the indicator and the rest of the track | `progress/track-gap` |
| Height | `progress/height-md`, `progress/height-sm` |
| Radius | `progress/radius` |
| Gaps | `progress/gap`, `progress/label-gap` |
| Label | `progress/label-foreground`, with the text role `text/label-md` |
| Value text | `progress/value-foreground`, with the text role `text/caption` |
| Help text | `progress/help-foreground`, `progress/help-foreground-error`, with the text role `text/caption` |
| Status icon | `progress/icon-size`, `progress/icon-success`, `progress/icon-error` |
| Segment | `progress/segment-background`, `progress/segment-background-pending`, `progress/segment-background-success`, `progress/segment-background-error`, `progress/segment-gap`, `progress/segment-radius` |
| Loop | `progress/loop-duration`, `progress/loop-easing` |

**Usage restrictions:** the width comes from the container, with a minimum of 48 px, and no
token gives it. The color comes from the status and there is no free color.

**AI hints:**

- Use `nph-progress` for a long process the system can measure or split into fixed steps; for a
  short wait with no value, use `nph-spinner`.
- Use `determinate` whenever there is a percentage, and `indeterminate` only until the first
  real value arrives; then switch the `type`.
- Always give a `label`, or an `aria-label` when the label is off, because the label is the
  accessible name.
- At the end, set `success` or `error` with `value` 100 and the help text; on error, the help
  text says what failed.
- On `steps`, give `steps` (2 or more; avoid more than 7, with no maximum enforced) and the current `step`, and write the "N of M" in
  `value-text` and the current step in `help`.
- Do not use `nph-progress` as navigation between steps or as a fixed level meter.

## Examples

**Recommended case:** an upload in progress, `determinate`, with the label "File upload", the
value text "50%" and the help text "Do not close this window.".

**Alternative case:** a preparing with no percentage, `indeterminate`, with the state word "In
progress"; a sign-up in steps, `steps` with 4 steps, "1 of 4" and the current step in the help
text.

## Anti-patterns

- **Do not use the bar for a short wait with no value** — use `nph-spinner`.
- **Do not use the bar as a fixed level meter**, such as used space or a grade — for a fixed
  level, show only the value as text.
- **Do not leave the bar without a label** — show the label or give an `aria-label`.
- **Do not use the steps bar as navigation between steps** — to mark each step of a flow, use
  `nph-stepper`.
- **Do not leave the bar stopped at a partial value** at the end of the process — show success
  or error.

## Sources and decisions

- **The repository `design.md`:** the `progress/*` tokens, `motion/loop-long-duration` and
  `motion/loop-long-easing`.
- **The decision that originated it:** P107, of 06-11-2026.
- **Tests:** `src/components/nph-progress/nph-progress.test.ts`.
- **Usage evidence:** none in code yet. The accepted frame shows an upload in progress, a
  preparing with no percentage and a sign-up in steps.
- **Storybook:** `src/components/nph-progress/nph-progress.stories.ts`.
- **Figma:** the `nph-progress` documentation frame (`4385:3186`) and the sets `4368:1532` and
  `4368:1185` in `DS-IA-NEPHOS 5.0`.
