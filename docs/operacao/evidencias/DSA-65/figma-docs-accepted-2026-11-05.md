```json
{
  "task": "DSA-65",
  "gate": "figma-docs-accepted",
  "date": "2026-11-05",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=4385-3186",
    "date": "2026-11-05",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "Indiane accepted the nph-progress documentation frame (4385:3186, page 1626:26), with the Figma UX QA and the textual audit approved, and approved the 11 points of the approval page: 1400 ms linear loop for the indeterminate type, 4 x 4 end stop on both sizes, fluid width with a 48 px minimum and no width token, gaps in space/inline-tight and space/stack-tight, radius straight to core/radius/full, stepper, task list and summary card kept out of this piece. COMPONENT_SET nph-progress (4368:1532), type × size × status × value × motion × steps, 36 variants; COMPONENT_SET nph-progress / segmento (4368:1185), state × size, 8 variants."
  }
}
```

# DSA-65 — `figma-docs-accepted`

The documentation of `nph-progress` (frame `4385:3186`) was accepted in Figma on 2026-11-05, in the file `DS-IA-NEPHOS 5.0`, with the Figma UX QA and the textual audit approved. The piece needed 27 `progress/*` tokens, put on `v/5.0.0` together with this task, plus two semantic tokens and one core primitive:

- `core/duration/loop-long` (1400 ms), a new primitive outside the transition scale, like `core/duration/loop` (800 ms) of the spinner.
- `motion/loop-long-duration` (alias of `core/duration/loop-long`) and `motion/loop-long-easing` (alias of `core/easing/linear`), the long loop. `motion/loop-duration` (800 ms) stays for the spinner.

`progress/height-md`, `progress/height-sm` and `progress/stop-size` point straight to core, because no semantic token has these functions. `progress/radius` and `progress/segment-radius` also point straight to `core/radius/full`, by decision: `radius/full` resolves to the same value, but its function is small markers, such as a badge or a counter, and `radius/subtle` (2) would remove the pill. Every other `progress/*` token is an alias of a semantic token.

There is no command output. The acceptance is a human observation, recorded in the json block above with the frame URL and the component sets.

The rest of this file is the contract converted to text, so that whoever codes does not need to open Figma. Figma property and value names stay as they are in Figma (`tipo`, `tamanho`, `status`, `valor`, `movimento`, `etapas`, `rótulo`, `valor em texto`, `ajuda`); the code API is in English.

## Purpose

Shows how much of a long process is done, such as a file upload or a sign-up in steps, or that it is under way while there is still no value.

Use it when the process takes more than a few seconds and the system knows how much is done, or into how many fixed steps it splits. It does not replace nph-spinner, for a short wait with no value, nor nph-stepper, which marks each step of a flow and the current step. It is not an adjustment control either: the person does not drag or choose the value.

## Tokens

| Token | Points to | Part |
|---|---|---|
| `progress/track-background` | `color/muted` | Track; decorative |
| `progress/indicator-background` | `color/primary-border` | Indicator, active |
| `progress/indicator-background-success` | `status/success` | Indicator, success |
| `progress/indicator-background-error` | `status/error` | Indicator, error |
| `progress/stop-background` | `color/primary-border` | End stop |
| `progress/stop-size` | `core/space/100` (4) | End stop, width and height, both sizes |
| `progress/track-gap` | `space/inline-tight` (4) | Gap between the indicator and the rest of the track |
| `progress/height-md` | `core/space/200` (8) | Bar and segment height, md |
| `progress/height-sm` | `core/space/100` (4) | Bar and segment height, sm |
| `progress/radius` | `core/radius/full` | Track, indicator and end stop: pill |
| `progress/gap` | `space/stack-tight` (4) | Label to bar and bar to help text |
| `progress/label-gap` | `space/inline` (8) | Label, value text and status icon on one line |
| `progress/label-foreground` | `color/foreground` | Label |
| `progress/value-foreground` | `color/muted-foreground` | Value text |
| `progress/help-foreground` | `color/muted-foreground` | Help text |
| `progress/help-foreground-error` | `status/error` | Help text, error |
| `progress/icon-size` | `icon/size-sm` | Status icon |
| `progress/icon-success` | `status/success` | Status icon, success |
| `progress/icon-error` | `status/error` | Status icon, error |
| `progress/segment-gap` | `space/inline-tight` (4) | Gap between segments |
| `progress/segment-radius` | `core/radius/full` | Segment: pill |
| `progress/segment-background` | `color/primary-border` | Segment, done |
| `progress/segment-background-pending` | `color/muted` | Segment, pending; decorative |
| `progress/segment-background-success` | `status/success` | Segment, success |
| `progress/segment-background-error` | `status/error` | Segment, error |
| `progress/loop-duration` | `motion/loop-long-duration` (1400 ms) | Indeterminate loop |
| `progress/loop-easing` | `motion/loop-long-easing` (linear) | Indeterminate loop |

Typography has no component token: the label uses the text role `text/label-md`; the value text and the help text use `text/caption`.

## Anatomy

1. **Label** — text above the bar, in `progress/label-foreground`. Says which process is under way. Optional.
2. **Value text** — next to the label, in `progress/value-foreground`: the percentage ("50%") on determinate, "N of M" on steps, and a state word on indeterminate and on error ("In progress", "Error", "Error on step 3"). Optional.
3. **Status icon** — only on success and error: an nph-icon instance (`circle-check` or `circle-xmark`, solid), at `progress/icon-size`, in `progress/icon-success` or `progress/icon-error`.
4. **Track** — band of the whole process, in `progress/track-background`, with pill corners (`progress/radius`). It is decorative: alone, it carries no information.
5. **Indicator** — the done part, proportional to the value, in `progress/indicator-background`; on success `progress/indicator-background-success`; on error `progress/indicator-background-error`. On indeterminate, it is a segment one third of the track that runs in a loop.
6. **End stop** — a dot at the end of the track, in `progress/stop-background`, at `progress/stop-size`, on every determinate value below 100. It shows where the track ends.
7. **Help text** — text below the bar, in `progress/help-foreground`; on error, in `progress/help-foreground-error`, saying what failed. Optional; required on error.
8. **Segment** — on the steps type, the bar splits into equal segments, one per step, separated by `progress/segment-gap`: done in `progress/segment-background`, pending in `progress/segment-background-pending`, success and error in `progress/segment-background-success` and `progress/segment-background-error`. Each segment has `progress/segment-radius` and the bar height of its size.

Gaps: `progress/gap` between label, bar and help text; `progress/label-gap` between label, value text and status icon; `progress/track-gap` between the indicator and the rest of the track; `progress/segment-gap` between segments.

## Properties

| Figma property | Rule |
|---|---|
| `tipo` | `determinado` (determinate, default) shows the proportion of the value. `indeterminado` (indeterminate) shows a segment in a loop, with no proportion, while there is no value yet. `etapas` (steps) splits the bar into equal segments, one per fixed step. |
| `tamanho` | `md` (default) is the 8 px bar (`progress/height-md`), for the body of the screen. `sm` is the 4 px bar (`progress/height-sm`), for dense spaces, such as the header of a flow or a card. |
| `status` | `ativo` (active, default), `sucesso` (success) or `erro` (error). On determinate, success and error exist only at value 100; on steps, with any number of steps; indeterminate has only active. Success and error bring the status icon; on error, the help text is required. The color comes from the status. |
| `valor` | `0` (default), `25`, `50`, `75` and `100` on determinate; `sem valor` (no value) on indeterminate and steps. In Figma these are samples; on screen the value is continuous, from 0 to 100. At 0 the indicator disappears and only the end stop remains. |
| `movimento` | `nenhum` (none, default) on determinate and steps. On indeterminate, `entrada` (enter) shows the segment entering from the left edge, never stopped in the middle, and `saída` (exit) shows it already past the right edge. In the prototype, enter moves to exit at a constant pace (`progress/loop-duration`, 1400 ms, with `progress/loop-easing`, linear) and goes back with no transition: the segment runs in a loop. |
| `etapas` | `nenhuma` (none, default) on determinate and indeterminate; `3`, `4` or `5` on steps. On active, the first step shows as done and the rest as pending; on success, all in success; on error, the done ones, the step with the error and the rest pending. |
| `rótulo` | Boolean. Turns the label on or off. Off, the accessible name comes from `aria-label`. |
| `valor em texto` | Boolean. Turns the percentage, the "N of M" or the state word next to the label on or off. |
| `ajuda` | Boolean. Turns the help text below the bar on or off. Keep it on for error. |

Not properties:
- **Texts**: label, value text and help text are sample texts; use the real text of the process. The Figma samples read "File upload", "Do not close this window.", "Sign-up" and "Step 1 of 3: personal data".
- **Color**: it comes from the status; there is no free color.
- **Width**: 280 px in Figma is only a sample. On screen the bar stretches to 100% of its container, with a minimum of 48 px. There is no width token.
- **Track gap**: below 100, `progress/track-gap` separates the indicator from the rest of the track, so the indicator is slightly shorter than the exact proportion. The exact value is the text one.

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | Label, value text and help text, including the error one, pass 4.5:1 over the background in both themes. The indicator and the done, success and error segments pass 3:1 against the background and against the track, in both themes. The track and the pending segment are decorative: the end shows through the end stop and the value through the text. |
| Visible focus | The bar does not take focus, as it is not interactive, and has no focus ring. If there is an action next to it, such as Cancel, the ring belongs to the button. |
| Color is not the only signal | Success and error also show through the status icon and the help text. The value shows as text. On steps, the current step has the color of the done ones; the "N of M" and the help text say which step the person is on. |
| Touch target | Does not apply: the bar takes no click. Nearby actions use the nph-button target. |
| Accessible name | The bar is read as a progress bar. The name comes from the label, or from `aria-label` when the label is off. The value goes from 0 to 100 in `aria-valuenow`; on steps, the "N of M" text goes in `aria-valuetext`. On indeterminate, the value is omitted. The status icon is decorative (`aria-hidden`). |
| Motion | The only motion is the indeterminate loop. It runs only while there is no value and gives way to determinate when the first real value arrives. |

Contrasts measured in the Figma UX QA (light / dark): label 21.00 / 14.73; value and help text 6.69 / 9.81; error help text 6.88 / 5.01; indicator over background 5.37 / 8.98 and over track 4.63 / 6.05; success over background 4.90 / 7.28 and over track 4.22 / 4.91; error over background 6.88 / 5.01 and over track 5.93 / 3.37; track and pending segment over background 1.16 / 1.48 (decorative).

## Relations and context

- It works with nph-icon, which draws the status icon. The status controls the color of the bar, of the icon and of the help text. The bar has no hover, pressed or focus state.
- A short wait with no value uses nph-spinner. A flow that marks each step and the current step uses nph-stepper; the steps bar only shows progress.
- An action such as Cancel stays outside the bar, in an nph-button next to it.

## When to use

- When the process is long and measurable, such as uploading or downloading files, and the person needs to see progress.
- Use determinate whenever there is a percentage. Use indeterminate only until the first real value arrives, and switch as soon as it does.
- Use steps when the process has a few fixed, known steps, such as a sign-up: show the "N of M" and say the current step in the help text.
- At the end, show success or error with the icon and the help text; do not leave the bar stopped at a partial value.
- Choose the size by the space: md in the body of the screen, sm in dense places.

## Required examples

- Upload in progress: label, value text and help text.
- Preparing, with no percentage: indeterminate.
- Sign-up in steps: "1 of 4" and the current step in the help text.

## Do

- Show the value as text next to the bar — the track is subtle and the text gives the exact value.
- Give a label that says which process is under way — it is the name the screen reader reads.
- On error, write in the help text what failed and what to do — color alone does not explain.
- On steps, say the current step in the help text — its color is the same as the done ones.
- Switch from indeterminate to determinate when there is a real value — the person sees progress.

## Do not

- Do not use the bar for a short wait with no value — use nph-spinner.
- Do not use the bar as a fixed level meter, such as used space or a grade — progress changes over time; for a fixed level, show only the value as text.
- Do not leave the bar without a label — the screen reader does not know what it measures; show the label or give an `aria-label`.
- Do not use the steps bar as navigation between steps — it only shows progress; to mark each step of a flow, use nph-stepper.

## Appendix points answered

1. Indeterminate loop: 1400 ms, linear, through the new `motion/loop-long-*`. The spinner keeps `motion/loop-duration` (800 ms).
2. Gap between segments and between indicator and track: `space/inline-tight` (4), described as "things that form a single unit". The visual does not change.
3. End stop: 4 x 4 on both sizes, never taller than the bar. Before, sm had 2 x 2.
4. Width: fluid, 100% of the container, 48 px minimum; no `progress/width` token.
5. Gap label → bar → help text: `space/stack-tight` (4).
6. Radius: `core/radius/full` directly; `radius/subtle` (2) would remove the pill, and `radius/full` is for small markers.
7. Out of this piece: the stepper references go to nph-stepper; a task list with state and a summary card ("10% · Step 1 of 17") are not components in this round. The summary card is a composition of nph-card with the bar.
