```json
{
  "task": "DSA-100",
  "gate": "figma-docs-accepted",
  "date": "2026-11-22",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=7819-4737",
    "date": "2026-11-22",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The design owner gave the visual acceptance of the nph-toast-region (page 5415:32, root 7689:2), and its documentation frame (7819:4737) was accepted, with COMPONENT_SET nph-toast-region (7689:288). On the approval page of 2026-11-22 the design owner approved items 1 to 11, all as recommended, and the points that followed with no decision: (1) root accepted; (2) documentation 7819:4737 accepted; (3) the piece is named nph-toast-region, apart from the toast (the nph-notification with placement toast), which answers D-1 of DSA-63; (4) more than three toasts wait in a queue, in order of arrival; (5) the region is role region with a translated name and mounts two hidden live regions, polite and assertive, and the toast inside it drops its own role; (6) the pointer on the region or the focus inside it pauses every toast; (7) with a modal dialog open, the countdown is suspended and the announcement goes out at once through a hidden live region inside the dialog; (8) four deviations from the APG Alert pattern confirmed (F6, Esc, focus destination, closing by itself in 6 s); (9) what needs an answer goes to nph-dialog while nph-alert-dialog is deferred; (10) the frames actions and content of the approved nph-notification no longer clip, so the focus ring of the action comes out whole; (11) notification/stack-gap leaves in a foundation task. The five toast-region tokens, two of them straight to the core by decision, followed with no decision."
  }
}
```

# DSA-100 — `figma-docs-accepted`

The documentation of the nph-toast-region (frame `7819:4737`, page `5415:32`) was accepted in Figma in the file `DS-IA-NEPHOS 5.0`, with the visual acceptance of the root `7689:2`. The nph-toast-region is the fixed region of the screen that receives the toasts of the `nph-notification` (`placement="toast"`): it decides where they appear, in what order and with what space between them. It does not draw the toast: severity, icon, text, actions and close belong to the `nph-notification`.

Its tokens came with this task and are on `v/5.0.0`.

A label "Pend. N" names a pending point of the Figma appendix (section G), all closed now: accepted with the root or answered on the approval page (see "Decisions answered" and "Points that followed the recommendation").

What changed in the tokens with this task:

- New group `toast-region/*`, 5 tokens. 3 alias semantics (rule 2 of T9). 2 point straight to the core by decision (rule 3 of T9, Pend. 3 accepted with the root), with no new value in the core:
  - `toast-region/inset` → `core/space/600` (24): the distance from the region to the bottom edge and to the end edge of the screen on the default screen, from 768 px. No semantic has the function "distance from a floating layer to the edge of the screen". The semantics of 24 have another function: `layout/margin-default` is the side margin of the page from 768 to 1279 px, `layout/gutter` the gutter between columns, `space/overlay-padding` the inner padding of the layer that blocks the page, `space/surface-padding` the inner padding of the card, `icon/size-lg` an icon size, and the `text/*` sizes are type and line height.
  - `toast-region/inset-compact` → `core/space/400` (16): the distance to the bottom edge and to both sides on the compact screen, below 768 px. The semantics of 16 have another function: `layout/margin-compact` is the side margin of the page below 768 px (content margin, not the distance of a layer to the bottom edge), `space/stack` the gap between stacked items, `space/container-padding` the inner padding of a panel, `icon/size-sm` an icon size, and the `text/*` sizes are type and line height.
- No semantic changed its value or its description. The `design.md` gains the region in the use of `space/stack`, `motion/enter-duration` and `motion/exit-duration`, and in the `direto_por_decisao` line of the core space, with the semantics refused above. In Figma, the descriptions of `core/space/600` and `core/space/400` name the region.
- `notification/stack-gap` (8, "space between toasts stacked in the region") stays for now; it leaves in a foundation task (item 11). See the task.

## Purpose

The region that places and stacks the toasts of the `nph-notification` at the bottom-right corner of the screen (on the compact screen, at the base from side to side), with up to 3 in view, the newest at the bottom, next to the corner.

Use it for the short notice that comes after an action of the person and does not lock the screen: an export in the queue, an invitation sent, a failure that can be fixed. It does not replace the inline `nph-notification`, for the message tied to an area of the page, nor the `nph-dialog`, for what needs an answer before going on.

## Component set

| Set | Figma id | What it is |
|---|---|---|
| `nph-toast-region` | `7689:288` | The region, 6 variants: quantity (`quantidade` 1, 2, 3) × screen (`tela` `padrão` default, `compacta` compact). Defaults: quantity 1, screen default. No boolean or text property: whatever changes in the toast is chosen on the `nph-notification` instance. |

Root `7689:2`, documentation `7819:4737`, appendix `7823:6502`. The toasts are instances of the `nph-notification` (`3434:9035`) with `placement=toast`; inside them, the `nph-button`, the `nph-icon-button` and the `nph-icon`. The description of the set holds the summary of the documentation.

## Tokens

### `toast-region/*`

| Token | Alias | Light · dark | Where the piece uses it |
|---|---|---|---|
| `toast-region/gap` | `space/stack` → `core/space/400` | 16 · 16 | Space between one toast and the next, vertical, only space, no divider. Bound on the gap of the 6 variants. |
| `toast-region/inset` | `core/space/600` (by decision) | 24 · 24 | Distance from the region to the bottom edge and to the end edge of the screen, default screen (from 768 px). Bound on the padding of the default example screens. |
| `toast-region/inset-compact` | `core/space/400` (by decision) | 16 · 16 | Distance from the region to the bottom edge and to both sides, compact screen (below 768 px). Bound on the padding of the compact example screens. |
| `toast-region/enter-duration` | `motion/enter-duration` → `core/duration/300` | 250 ms | Entrance of the toast in the region. Figma does not animate. |
| `toast-region/exit-duration` | `motion/exit-duration` → `core/duration/200` | 150 ms | Exit of the toast from the region. Figma does not animate. |

### Used directly, with no `toast-region/*` token

- **Curves:** `motion/enter-easing` with the entrance and `motion/exit-easing` with the exit, straight, as `nph-hover-card` (P112).
- **Reduced motion:** the slide of the toast becomes only opacity, in `motion/hover-duration` (100 ms), straight, as the foundation rule `movimento_reduzido` of `design.md`.
- **Toast:** every token inside the toast belongs to the approved `nph-notification`, by instance, with no change: width `notification/toast-width` (360, stacked) and `notification/toast-width-max` (440, single-line), radius `notification/toast-radius`, border `notification/border-width`, the severity colors (`notification/<severity>-surface`, `-border`, `-solid`), text `notification/text`, icon `notification/icon-size`, the inner gaps and the shadow `elevation/modal` (transparent in dark).
- **The region has no color, radius, border, shadow or layer of its own.** No layer token: the region lives in the top layer of the browser, as the balloon of the `nph-tooltip` (P77).
- **The scrim** of the example screen with an open dialog is `overlay/scrim`, the dialog's, not the region's.

## Anatomy, read part by part in Figma

### The region (root of each variant)

- A frame with a **vertical** auto layout (a column). The gap acts **between one toast and the one below it**, on the vertical axis: 16 in `toast-region/gap`, in the 6 variants.
- Alignment: main axis (vertical) at the start, so the toasts stack from top to bottom; cross axis (horizontal) at the end, so each toast meets the **end edge** (right). Toasts of different widths end on the same vertical line.
- Padding 0 on the four sides; height by the content. No fill, no stroke, no effect and **no clipping** (`clipsContent` false).
- Order of the children (read): from the oldest, at the top, to the newest, at the bottom, next to the corner. In quantity 3: info, success, error.

| Variant | Figma id | Size (read) | Region width |
|---|---|---|---|
| quantity 1, default screen | `7689:80` | 360 × 106 | by the content (the toast width) |
| quantity 2, default screen | `7689:97` | 360 × 208 | by the content |
| quantity 3, default screen | `7689:130` | 360 × 390 | by the content |
| quantity 1, compact screen | `7689:184` | 343 × 106 | fixed 343 (a 375 screen less 16 on each side) |
| quantity 2, compact screen | `7689:201` | 343 × 208 | fixed 343 |
| quantity 3, compact screen | `7689:234` | 343 × 390 | fixed 343 |

The frame that groups the variants in Figma (padding and gap in `space/overlay-padding`, radius `radius/surface`) is not part of the piece.

### The toasts (children, all `nph-notification` instances)

Properties read on every instance: `placement=toast`, `emphasis=subtle`, `layout=stacked`, heading on, close on, time bar off.

| Position | Master | Severity | Action | Height |
|---|---|---|---|---|
| 1st (the oldest; in quantity 1, the only one) | `3434:9073` | info | no | 106 |
| 2nd | `3434:9258` | success | no | 86 |
| 3rd (the newest, next to the corner) | `3434:9590` | error | yes | 166 |

Toast width: on the default screen, 360 in `notification/toast-width` (the single-line of 440 shows only on the example screen with toasts of different widths, root `7690:570`); on the compact screen, the width of the region (343 at 375), with no width variable.

Nested instances, the same in the 6 variants:

- Severity icon: `nph-icon` 20 × 20, solid: `circle-info` (info), `circle-check` (success), `circle-xmark` (error).
- Close: `nph-icon-button` secondary, ghost, size default, square, 36 × 36, with `nph-icon` `xmark` light 20 × 20.
- Action (only on the error toast): `nph-button` danger, solid, size default, 122 × 36.

### Example texts in Figma (translated in the prose)

Info: "Export queued", "We will let you know when the file is ready." Success: "Invitation sent", "The team can already access the project." Error: "Upload failed", "The file is over the allowed size.", action "Choose another". Loading (example c): "Saving changes…", "This takes a few seconds." Success (row of the do table): "Report generated", "The file is in your downloads folder." Wrong examples of "Do not": a field error ("ID number incomplete", "Type the 11 digits of the ID number."); a question that needs a decision ("Delete the project?", "The files and the history will be deleted.", actions "Delete" and "Cancel").

### Clipping and focus (item 10, applied in Figma on 2026-11-22)

In the `nph-notification` set `3434:9035`, the frames "content" (50) and "actions" (13) no longer clip; the focus ring of the action and of the close comes out whole, outside. The frames "line" and "icon" and the variants still clip. Action focus (danger solid): border `608:5427` in `color/destructive`, `border/width`, at −1 px; halo `608:5428` in `focus/halo-danger`, `focus/ring-width`, at −5 px. Close focus (secondary ghost): border `608:5585` in `focus/border`, halo `608:5586` in `focus/halo`. The region has no focus layer.

### Example screens (outside the set, only to show the position)

Frames "example screen" in skeleton, with the region instance at the corner: default 1024 and with an open dialog 1024 (padding `toast-region/inset`), compact 375 (padding `toast-region/inset-compact`). On the screen with a dialog, the scrim `overlay/scrim` and the dialog in skeleton are above the region.

## Accessibility (as in Figma)

| Criterion | Rule |
|---|---|
| Contrast | The text of the `nph-notification` passes 4.5:1 in both themes; the info, success and error icons pass 3:1 against the toast background (criterion 1.4.11); the other severities and the spinner follow the contract of the approved `nph-notification`. The region has no color of its own: no background, no border, no shadow. |
| Visible focus | The region takes no focus and has no ring of its own. Focus goes to the controls of the toast: the action (`nph-button`) shows the focus border in the color of the button (on danger solid, `color/destructive`) and the halo; the close (`nph-icon-button` ghost) shows the border in `focus/border` and the halo in `focus/halo`. The border meets the 3:1. Nothing in the region cuts the ring. |
| Color is not the only sign | The severity also comes by the icon and by the heading of the toast. The region does not use color for order or priority. |
| Touch target | The action and the close are 36 px high, above the 24 px of criterion 2.5.8. The region has no target of its own. |
| Accessible name | What the screen reader reads comes from each toast: heading and description; the icon is decorative. The region has `role="region"` and a translated name, "Notifications" (the Figma sample is the Portuguese word), and mounts, even empty, two hidden live regions, one polite and one assertive, that announce the toasts; error and warning go to the assertive one. The toast inside the region has no role of its own, so it is not announced twice. |
| Keyboard | F6 takes the focus to the first control (action or close) of the newest toast that has a control; Tab and Shift+Tab go through the controls of the toasts; F6 again returns the focus to where it came from. With the focus in a toast, Esc closes that toast. The toast never takes the focus by itself. |
| Time | A toast that closes by itself pauses with the pointer or the focus on it; with the pointer on the region or the focus inside it, all the toasts pause together and go on when they leave. With a modal dialog open, the countdown is suspended and goes on when it closes. Error, loading and a toast with an action do not close by themselves (criterion 2.2.1). |
| Reduced motion | With reduced motion, the slide of the toast becomes only opacity, in 100 ms (`motion/hover-duration`). |

Demonstration in Figma: after F6, the focus on the action of the newest toast, with the border and the halo whole, with no clipping, in light and dark.

## Properties, variants and states (as in Figma)

| Field | Rule |
|---|---|
| quantity (`quantidade`) | 1, 2 or 3 toasts in view; default 1. More than 3 never show together: the 4th waits in a queue, in order of arrival, and enters when a toast leaves. |
| screen (`tela`) | default (`padrão`), from 768 px, and compact (`compacta`), below 768 px; default: default. On the default screen, each toast keeps its own width (stacked 360 px, single-line 440 px). On the compact one, the region takes the width of the screen less 16 px on each side, and the toast takes the width of the region. |
| distance from the edge (not a property) | On the default screen, 24 px from the bottom edge and from the end edge, in `toast-region/inset` (`core/space/600`). On the compact one, 16 px from each side and from the bottom, in `toast-region/inset-compact` (`core/space/400`). The code places the region, not the variant. |
| space between toasts (not a property) | 16 px, in `toast-region/gap` (`space/stack`), only space, no divider. |
| order (not a property) | From the oldest, at the top, to the newest, at the bottom, next to the corner. |
| alignment (not a property) | By the end edge: toasts of different widths end on the same vertical line. |
| toasts (not a property) | Each toast is an `nph-notification` instance with `placement=toast`. Severity, layout, heading, actions, close and time bar are chosen on the toast instance. |
| entrance and exit (not a property) | The toast enters in 250 ms, in `toast-region/enter-duration` (`motion/enter-duration`), with the curve `motion/enter-easing`, and leaves in 150 ms, in `toast-region/exit-duration` (`motion/exit-duration`), with the curve `motion/exit-easing`. Figma does not animate: it stays with the code. |
| states | The region has no hover, focus or disabled of its own. The states belong to the toasts and to the controls inside them. |

## Relations and context (as in Figma)

| Piece | Relation |
|---|---|
| `nph-notification` | The only piece the region receives, always with `placement=toast`. The inline toast stays in the page, outside the region. |
| `nph-button` and `nph-icon-button` | They go inside the toast, as the action and the close. The region has no button of its own, and no "close all". |
| `nph-dialog` | With a modal dialog open, the region stays below the scrim (`overlay/scrim`): the toast stays in view, but inert, with no click and no focus, until the dialog closes. The toast that arrives at that moment is announced at once, through a hidden live region inside the dialog. The message the person needs to read during the dialog goes inside it, as an inline `nph-notification`. |
| page | The region sits above the content, in the top layer of the browser, with no layer token, as the balloon of the `nph-tooltip`. It does not reserve space in the page. |

## When to use (as in Figma)

| Situation | Choice |
|---|---|
| A short notice after an action of the person: success, info, loading | A toast in the region. The success and info ones close by themselves; the loading one stays until it ends. |
| A failure that can be fixed, or a warning with a short action (for example "Choose another") | A toast with an action in the region. It does not close by itself: the person has time to act. |
| A message tied to an area, a field or a form | The inline `nph-notification`, in the area itself, outside the region; the error of a field goes in the error message of the `nph-field`. |
| A decision that needs an answer before going on | `nph-dialog`. The toast does not ask and does not lock the screen. |
| A screen below 768 px | screen compact: the region takes the base from side to side. From 768 px, screen default. |

Demonstration: the same stack on the default screen (1024 px), at the bottom-right corner, 24 px from the bottom edge and from the end edge, and on the compact screen (375 px), at the base from side to side, at 16 px. The screens are an example in skeleton.

## Required examples (in Figma, light and dark)

- a — An export entered the queue: an info toast, which closes by itself.
- b — Three notices in a row: the newest, a failure that can be fixed, stays at the bottom, next to the corner, and does not close by itself.
- c — A save in progress, at the top, not closing until it ends; below it, an invitation sent and a failure with an action.

## Do (as in Figma)

| Do | Why |
|---|---|
| Keep the newest at the bottom, next to the corner, and the earlier ones above. | The eye always finds the new notice in the same place. |
| Keep the column open, with 16 px between the toasts. | All the text stays readable with no hover, also for whoever uses only the keyboard or touch. |
| Use screen compact below 768 px. | On a 320 px screen the toast fits with no cut (criterion 1.4.10). |
| Give an action to the error toast that can be fixed. | It does not close by itself, and the person solves it without looking for the way. |

Demonstration: the stack on the default screen, each toast with its own width, the newest at the bottom, next to the corner; and on the compact screen, the toast taking the width of the region.

## Do not (as in Figma)

| Do not | Use instead |
|---|---|
| A validation error of a field in a toast (for example "ID number incomplete"). | The error message of the `nph-field`, next to the field, or the inline `nph-notification` at the top of the form: the toast leaves and is far from the field. |
| A question that needs a decision in a toast (for example "Delete the project?"). | `nph-dialog`: a decision that blocks does not fit in a notice that leaves. |
| More than 3 toasts in view at the same time. | Up to 3 in view. The 4th waits in a queue, in order of arrival, and enters when a toast leaves. |

Each wrong example shows the error on purpose (see "Hidden on purpose in Figma").

## Default behavior (appendix, accepted with the documentation)

Base: the WAI-ARIA APG Alert pattern (https://www.w3.org/WAI/ARIA/apg/patterns/alert/), for the toast that warns without moving the focus, and the Landmark Regions practice (https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/), for the region. The APG has no toast region pattern: the rows that go beyond it are marked "no" in the APG column and were confirmed on the approval page of 2026-11-22, item 8.

| Row | Rule | In the APG? |
|---|---|---|
| Role and name | `role="region"` with a translated name ("Notifications"), given by the application, as the label that names the landmark in P109, item 5 (item 5). Today the sheet of the `nph-notification` ("The toast region") builds `role="group"` with `aria-label="Notifications"`; that changes. | Partly: the Landmark Regions practice asks for a region with a name; the role was decided in item 5. |
| Screen reader announcement | Two hidden live regions, mounted with the region even when it is empty, one polite and one assertive; error and warning go to the assertive one, the others to the polite one; the toast inside the region drops its `role="alert"` or `role="status"`, so it is not announced twice (item 5). Today, by P108 item 5, each toast has its own role. | Yes for error and warning (`role="alert"`, without moving the focus); the `role="status"` of the others comes from ARIA, outside the Alert pattern. |
| Arrival of a toast | The toast never takes or moves the focus (P108, item 5): the person stays where they were. The new one enters at the bottom, next to the corner, and the earlier ones move up. | Yes: the Alert does not change the keyboard focus. |
| F6 | F6 takes the focus to the first control (action or close) of the newest toast that has a control; F6 again returns the focus to where it came from (Pend. 7, accepted with the root). | No: the APG defines no shortcut for the region; F6 is the landmark shortcut of React Aria, React Spectrum and Base UI. Confirmed in item 8. |
| Tab and Shift+Tab | With the focus in a toast, they go through the controls of the toasts: action, secondary action and close. | Yes: common tab order. |
| Esc | With the focus inside a toast, Esc closes that toast. With the focus on the icon-only close, the first Esc closes the tooltip balloon and the second closes the toast (DSA-43 D2, inherited). Outside the region, Esc does nothing to the region (Pend. 7). | No: the APG defines no Esc on the Alert; Radix, Base UI and Chakra/Ark close the focused toast. Confirmed in item 8. |
| Focus on close | When the toast that had the focus leaves, the focus goes to the next toast that has a control or, with none, back to where it came from, as React Aria (Pend. 7). | No: the APG does not cover it; it follows React Aria. Confirmed in item 8. |
| Outside click | Closes nothing: the region is not modal and has no open state. | Does not apply. |
| Pointer and focus | Hover does not move the focus. The pointer or the focus on a toast pauses its time (P108, item 4). With the pointer on the region or the focus inside it, the 3 toasts pause together and go on when they leave (item 6). | Does not apply: the APG does not cover pausing; WCAG 2.2.1. |
| Time | 6 s by default, with the pause above. Error, loading and a toast with an action do not close by themselves (P108, item 4; DSA-63 evidence, P5). | No: the Alert asks to avoid an alert that disappears by itself (it cites WCAG 2.2.3); the Nephos closes by itself, in 6 s by default and with a pause on pointer and focus, every toast that is not error, loading or with an action. Confirmed in item 8. |
| More than 3 toasts | A queue in order of arrival; the 4th waits and enters when a toast leaves; nothing is drawn for the queue (item 4). Risk: with 3 toasts that do not close by themselves, the queue waits for the person to close one; with 3 loading toasts, which have no close button, a new error waits with no priority. | Does not apply. |
| Position near the window edge | The region stays fixed at the bottom-right corner, 24 px from the bottom edge and from the end edge; below 768 px it takes the base from side to side, at 16 px (Pend. 3 and 6, accepted with the root). It does not flip or clip: the toast is never wider than its container (P108, item 9) and, on the compact screen, takes the width of the region. | Does not apply: a fixed position, with no Floating UI. |
| Open modal dialog | The region stays below the scrim (`overlay/scrim`) and inert: no click, no focus and out of the accessibility tree until the dialog closes (Pend. 10, accepted with the root). The countdown is suspended while the dialog is open and goes on when it closes; the announcement goes out at once, through a hidden live region inside the dialog (item 7). | Yes: the APG Dialog (Modal) makes what is outside the dialog inert. |
| Motion | The toast enters in `toast-region/enter-duration` (250 ms), with the curve `motion/enter-easing`, and leaves in `toast-region/exit-duration` (150 ms), with the curve `motion/exit-easing`. With reduced motion, the slide becomes opacity in `motion/hover-duration` (100 ms), as the foundation (`design.md`, `movimento_reduzido`). | Does not apply. |

Event, aria, slot, property and console warning stay with the code, following the APG and the Custom Elements Manifest.

## Combined states (T11)

The single Nephos rule (Decision log, T11): selected or checked + disabled keeps the background and the mark under `state/disabled-opacity`; error + disabled: disabled wins. In the region no piece has selection, check, field error or disabled: T11 does not apply to the region. The buttons inside the toast follow their own contract (`nph-button` and `nph-icon-button`), with no change here.

## Order and alignment of the parts (appendix)

- Read on the piece: each variant of the set `7689:288` is a column (vertical auto layout), aligned at the start on the column axis and at the end on the cross axis, padding 0, gap 16 px in `toast-region/gap`.
- Order: from top to bottom, from the oldest toast to the newest; the newest stays at the base, next to the corner.
- Alignment: all the toasts by the end edge (right); toasts of different widths (360 px and 440 px) end on the same vertical line.
- On the screen: the region stays at the base and at the end of the screen (bottom-right corner), 24 px from both edges; on the compact one, at the base, from side to side, 16 px from each side and from the bottom.
- Inside the toast, the order and the alignment are those of the `nph-notification`, with no change.

## Icon and image

The region has no icon and no image of its own. The icons belong to the toasts and to the controls, by instance:

| Where | Icon | Weight | Size | Color |
|---|---|---|---|---|
| toast, severity info | `circle-info` | solid | 20 px (`notification/icon-size` → `icon/size-md`) | `notification/info-solid` |
| toast, severity success | `circle-check` | solid | 20 px | `notification/success-solid` |
| toast, severity error | `circle-xmark` | solid | 20 px | `notification/error-solid` |
| toast, severity loading | `nph-spinner` in place of the icon | — | 20 px, `nph-spinner` size md | `color/primary` |
| close (`nph-icon-button` ghost) | `xmark` | light; solid on hover and active (DSA-47 D1) | 20 px (`icon/size-md`), a 36 px button | `color/secondary-foreground` |

The other severities of the `nph-notification` follow its contract, with no change. No image: no export size and no crop.

## Limits (the "Limites" row of the Figma matrix)

- Minimum: 1 toast.
- Maximum: 3 toasts in view.
- Long text: the toast grows in height and the region follows.
- Empty: does not apply to the drawing. With no toast, the region shows nothing: it has no background and no border. The live regions stay mounted even when empty (item 5).
- Many items: from the 4th on, they wait in the queue, in order of arrival, and enter when a toast leaves (item 4). Nothing is drawn for the queue. Priority in the queue: order of arrival in v1.
- Short window: a 320 × 480 px screen. The region takes 288 px (the compact screen, item 1 and Pend. 6). A window lower than the stack has no drawing; it is an open point of the task ("Window lower than the stack").

## What the region asks of other pieces

Read on `v/5.0.0` (`fichas/nph-notification.md`, `src/components/nph-notification/nph-notification.ts` and `.css`, `fichas/nph-dialog.md`, `src/components/nph-tooltip/nph-tooltip.ts`):

| It asks | Does the piece do it today? |
|---|---|
| `nph-notification`: no role of its own inside the region (item 5) | No: the piece always sets `role="alert"` on error and warning and `role="status"` on the others when it is valid (`applySemantics`, `nph-notification.ts`). Open point for the code (task). The inline toast keeps its role. |
| `nph-notification`: pause from outside, for the pointer on the region, the focus inside it and an open modal dialog (items 6 and 7) | No: the timer is private and pauses only with the pointer over the toast itself or the focus inside it (`syncTimer`, `pauseTimer`, `resumeTimer`; P108, item 4). Open point for the code. |
| `nph-notification`: Esc with the focus inside the toast closes it (item 8) | No: the piece has no Esc handling; `nph-close` carries `detail.source` `close-button` or `timeout` (P108, item 3). Open point for the code: who listens to Esc and which source the event carries. |
| `nph-notification`: on the compact screen, the toast takes the width of the region | Partly: the toast is `inline-size: var(--nph-notification-toast-width)` with `max-inline-size: min(100%, …toast-width-max)` (`nph-notification.css`), so it shrinks below 360 when the region is narrower, but it does not stretch on a compact screen wider than 392 px (for example 600 px). Open point for the code. |
| `nph-notification`: the frames content and actions do not cut the focus ring (item 10) | Yes in code today: `.content` and `.actions` have no `overflow`; the only `overflow: hidden` is the hidden twin that measures the text (`nph-notification.css`). The code keeps it so; long text, if it must be cut, is cut only on the text layer. In Figma the clipping was removed on 2026-11-22. |
| `nph-dialog`: a place for a hidden live region inside the open modal dialog (item 7) | No: the sheet has the default and the footer slots and no live region (`fichas/nph-dialog.md`, slots); the dialog is a native `dialog` opened with `showModal()` and the rest of the page is inert (P87). Open point for the code: where the announcement node lives while a dialog is open. |
| Top layer: the region below the scrim of an open modal dialog (Pend. 10) | Partly: the `nph-tooltip` balloon is a `popover="manual"` in the top layer (P77, `nph-tooltip.ts`), the precedent for the region. The order inside the top layer follows the order of opening (no source read for the region): a region shown, or shown again, while a dialog is open would go above it. Open point for the code: the toast stays below the scrim. |
| `nph-icon-button` close with its tooltip: first Esc closes the balloon (DSA-43 D2) | Yes: inherited, no change. |
| `nph-button` and `nph-icon-button`: focus ring outside, whole | Yes: their own contract (`fichas/nph-button.md`). |

## Inherited decisions

Read on `origin/v/5.0.0` (`23bb4ad7`): DSA-63 in full, the P-N that cite the pieces (P107, P108, P113) and the precedents of layer and name (P77, P87, P109).

- Answers DSA-63 D-1 (open since 2026-11-06, `pending_decisions`): the region becomes a piece of its own, the `nph-toast-region` (item 3). DSA-63 is `done`; the code owner closes its D-1 with this answer.
- Follows the DSA-63 evidence, P3: bottom-right corner.
- Follows partly the DSA-63 evidence, P4: up to 3 visible, the newest next to the corner, widths of 360 px (stacked) and 440 px (single-line). Changed by the proposals accepted with the root: the 8 px gap becomes 16 px (Pend. 2); the minimum of 320 px becomes "the width of the region" on the compact screen (Pend. 6). The "in front" of P4 becomes the order of the stack, in an open column (Pend. 4).
- Follows partly the DSA-63 evidence, P5, and P108 item 4: 6 s by default, a pause on hover and focus of each toast; error, loading and a toast with an action do not close by themselves. With item 6, the region pauses them all together; with item 7, the countdown is suspended while a modal dialog is open.
- Follows partly P108 item 5: the toast never takes the focus by itself; error and warning are urgent. With item 5, the announcement moves to the live regions of the region, and the toast inside it drops its own role. The inline toast keeps P108 item 5 as it is.
- Follows partly P108 item 10 and the sheet of the `nph-notification` ("The toast region"): "position and stacking belong to the region" goes on; "the toast region is not a piece" changes with the answer to D-1.
- Follows P108 item 3: the piece does not remove itself; the application removes the toast on `nph-close`. With item 4, the queue moves on when a toast leaves.
- Follows P108 item 11 and the P107 index: the time bar of the toast stays on the `nph-skeleton`, stopped and decorative; the region changes nothing there.
- Follows P113 and DSA-69: the outline of the loading toast is in `color/border-subtle`, by instance.
- Follows DSA-26 D1 and D2 (line height and shape of the `nph-skeleton`): inherited in the time bar, by instance.
- Follows DSA-47 D1: the icon-only close of the toast turns its icon to solid on hover and active, by instance.
- DSA-64 D-1 does not apply (secondary solid inside the dialog): the close of the toast is ghost.
- Follows DSA-43 D1 (wrong examples of the icon-only button on the Docs page): inherited, no change.
- Follows DSA-43 D2: with the focus on the icon-only close, the balloon opens at once (DSA-48, rule 1), and the first Esc closes the balloon, not the layer around it (P77, item 4). On the toast: the first Esc closes the balloon and the second closes the toast.
- Follows partly the DSA-63 evidence ("It does not replace the alert dialog"): what needs an answer before going on would go to the `nph-alert-dialog`, which is deferred and depends on the `nph-dialog`; the `nph-dialog` is in scope. The documentation sends it to the `nph-dialog` until the `nph-alert-dialog` comes in (item 9); in code, the live sheet of the `nph-notification` changes with it (see the task).
- No D-N to follow: DSA-03 (`nph-icon`), DSA-09 (`nph-spinner`), DSA-13, DSA-52 and DSA-60 (`nph-button`).
- Precedents with no inherited decision: P77 (balloon in the top layer, `popover="manual"`, no z-index) and P87 (native dialog with `showModal()`, top layer and an inert page), the base of Pend. 10; P109 item 5 (the label names the landmark), the base of item 5.

## Decisions answered (approval page of 2026-11-22, items 1 to 11, all as recommended)

| Item | Decision |
|---|---|
| 1 | Root `7689:2` accepted (visual acceptance), with the proposals accepted on 2026-11-21. Changes to the DSA-63 evidence, P4: the gap between toasts goes from 8 to 16 px (Pend. 2); below 768 px the minimum of 320 px becomes the width of the region, which takes the base of the screen 16 px from each side (Pend. 6); the stack is an open column, each toast whole in view (Pend. 4). |
| 2 | Documentation `7819:4737` accepted; the description of the set `7689:288` holds its summary. |
| 3 | The piece is named `nph-toast-region`, apart from the toast (the `nph-notification` with `placement=toast`), and answers DSA-63 D-1. Sources: https://react-aria.adobe.com/Toast , https://base-ui.com/react/components/toast |
| 4 | More than 3 toasts: the 4th waits in a queue, in order of arrival, and enters when one leaves. Risk: with 3 toasts that do not close by themselves, the queue waits for the person to close one. Sources: https://mantine.dev/x/notifications/ , https://chakra-ui.com/docs/components/toast , https://ark-ui.com/docs/components/toast , https://raw.githubusercontent.com/microsoft/fluentui/master/packages/react-components/react-toast/library/src/state/vanilla/createToaster.ts , https://ant.design/components/notification , https://base-ui.com/react/components/toast |
| 5 | The region is `role="region"` with a translated name ("Notifications") and mounts two hidden live regions (polite and assertive); the toast inside it drops its own role. It changes P108 item 5 for the toast inside the region and the `role="group"` with `aria-label="Notifications"` of the sheet of the `nph-notification` ("The toast region"). The inline toast stays as it is. Caveat: MDN also says an injected `role="alert"` is announced in most cases; 4 of 8 systems read keep only the role per toast. Sources: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions , https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/alert_role , https://raw.githubusercontent.com/microsoft/fluentui/master/packages/react-components/react-toast/library/src/components/Toaster/renderToaster.tsx , https://raw.githubusercontent.com/mui/base-ui/master/packages/react/src/toast/viewport/ToastViewport.tsx |
| 6 | With the pointer on the region or the focus inside it, the 3 toasts pause together and go on when they leave; it adds to P108 item 4. Sources: https://raw.githubusercontent.com/adobe/react-spectrum/main/packages/react-aria/src/toast/useToastRegion.ts , https://raw.githubusercontent.com/mantinedev/mantine/master/apps/mantine.dev/src/pages/x/notifications.mdx , https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html |
| 7 | A toast that arrives with a modal dialog open: (a) the countdown is suspended while the dialog is open and starts, or goes on with what was left, when it closes; (b) the announcement goes out at once, through a hidden live region inside the open dialog; the visual toast stays in the region, below the scrim. (a) adds a pause condition to P108 item 4; no system read pauses because of a modal, it is an inference from the five that pause when the person cannot see the toast. Sources: https://github.com/radix-ui/primitives/blob/main/packages/react/toast/src/toast.tsx , https://github.com/mui/base-ui/blob/master/packages/react/src/toast/viewport/ToastViewport.tsx , https://github.com/angular/components/blob/main/src/cdk/a11y/live-announcer/live-announcer.ts , https://github.com/Shopify/polaris-react/pull/10406 , https://bugs.webkit.org/show_bug.cgi?id=276553 , https://html.spec.whatwg.org/multipage/interactive-elements.html#dom-dialog-showmodal , https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html |
| 8 | The four deviations from the APG Alert pattern are confirmed: F6 to the first control of the newest toast and back; Esc with the focus in a toast closes that toast; when the focused toast leaves, the focus goes to the next toast with a control or back to the origin; a toast that is not error, loading or with an action closes by itself in 6 s, with a pause. Sources: https://www.w3.org/WAI/ARIA/apg/patterns/alert/ , https://react-aria.adobe.com/Toast , https://raw.githubusercontent.com/mui/base-ui/master/packages/react/src/toast/root/ToastRoot.tsx , https://raw.githubusercontent.com/radix-ui/primitives/main/packages/react/toast/src/toast.tsx |
| 9 | While the `nph-alert-dialog` is deferred, the documentation sends to the `nph-dialog` the message that needs an answer before going on. It changes, until the `nph-alert-dialog` comes in, the bridge of the DSA-63 evidence ("It does not replace the alert dialog") and the live sheet `fichas/nph-notification.md`, which still sends what needs an answer to the `nph-alert-dialog`; the DSA-63 evidence stays as the record of its gate. |
| 10 | The frames "actions" (`3434:9598`) and "content" (`3434:9594`) of the approved `nph-notification` set `3434:9035` no longer clip, so the focus ring of the button comes out whole; applied in Figma on 2026-11-22 in every variant (63 frames). Long text, if it must be cut, is cut only on the text layer. It changes an approved piece of another component: in code, `.content` and `.actions` have no `overflow` today, and the task keeps it so. Sources: https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html , https://github.com/adobe/spectrum-css/blob/main/components/button/index.css , https://ux.redhat.com/foundations/interactions/focus-indicators/ , https://github.com/primer/css/blob/main/src/support/mixins/misc.scss |
| 11 | `notification/stack-gap` (8 px), with no consumer once `toast-region/gap` exists, leaves in a foundation task. P108 item 10 already says the CSS of the toast does not read it. Until then it stays in Figma and in the code. |

**Points that followed the recommendation.** Points of the appendix that were not approval items follow the recommendation, approved with the approval page of 2026-11-22 ("follows with no decision"), because the recommended option was already in the root the design owner accepted: the five `toast-region/*` tokens and the two by decision above; Pend. 2 (16 px gap, `space/stack`), Pend. 3 (24 and 16 px from the edge), Pend. 4 (open column), Pend. 5 (aligned by the end edge, each toast with its own width), Pend. 6 (the base from side to side below 768 px, the toast at the width of the region), Pend. 7 (F6, Esc and the focus destination, with no new ring) and Pend. 10 (the region in the top layer, below the scrim of a modal dialog). Their market sources are in the appendix, section G: https://fluent2.microsoft.design/components/web/react/core/toast/usage , https://ark-ui.com/docs/components/toast , https://sonner.emilkowal.ski/toaster , https://raw.githubusercontent.com/emilkowalski/sonner/main/src/index.tsx , https://raw.githubusercontent.com/emilkowalski/sonner/main/src/styles.css , https://ant.design/components/notification , https://m1.material.io/components/snackbars-toasts.html , https://primeng.dev/toast , https://www.w3.org/WAI/WCAG22/Understanding/reflow.html , https://primer.style/accessibility/toasts/ , https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert , https://atlassian.design/components/flag/usage

## Hidden on purpose in Figma

- In every toast, the time bar is off by property; the actions are off on the info and success toasts. Nothing is hidden in the region.
- The wrong examples of "Do not" (`7820:20873`, `7820:20941`, `7820:20976`) carry "error, on purpose" in their Figma name (in Portuguese).
- The four instances of the "today" column of the appendix preview K (`7844:185`) still clip the focus ring by override, on purpose, to show the old state; they leave with the appendix.
