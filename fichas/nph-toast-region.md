---
piece: nph-toast-region
level: component
status: active
solves: >-
  Places and stacks the toasts of the nph-notification in a fixed region of the screen, at the
  bottom-right corner, with up to three in view and a queue for the rest, and announces them to a
  screen reader through its own live regions, so the person is told of a result without leaving what
  they are doing.
use_when:
  - "A short notice after an action of the person that does not lock the screen: an export in the queue, an invitation sent, a failure that can be fixed."
  - "A failure that can be fixed, or a warning with a short action, as a toast with an action: it does not close by itself and the person has time to act."
  - "A task in progress, as a loading toast that stays until the task ends and then turns into success or error."
  - "Once per page, at the start of the page, with every toast of the application going into it."
do_not_use_when:
  - "For a message tied to an area, a field or a form: use the inline nph-notification in the area itself."
  - "For the validation error of a field: use the error message of nph-field."
  - "For a decision that needs an answer before going on: use nph-dialog. The toast does not ask and does not lock the screen."
  - "To draw one toast: use nph-notification with placement toast inside the region."
  - "To put anything but a toast in it: the region receives only nph-notification with placement toast."
  - "For more than one region in the page, or another corner: the region has a single position."
api:
  label:
    type: string
    required: true
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name of the region, already localized by the consuming application, such
      as Notifications. It names the landmark (P109, item 5). Empty emits console.error in
      development, one per cause, and the region still works.
  slots:
    default: "the toasts: nph-notification with placement toast, appended in order of arrival and removed by the application on nph-close"
  events: none
variants:
  quantity:
    axis: density
    choose_when: "Not a property: one, two or three toasts in view, by what the application appended; the fourth and the next ones wait in the queue."
    do_not_combine_with:
      - "More than three toasts in view: the region never shows them together."
  screen:
    axis: size
    choose_when: "Not a property: from 768 px the default screen, at the bottom-right corner; below 768 px the compact screen, at the base from side to side. The window decides, not the application."
    do_not_combine_with: []
states:
  empty:
    token: not_applicable
    changes_for_user: "Nothing is drawn: the region has no background, border or shadow. It stays in the top layer and keeps its two live regions mounted."
  stacked:
    token: "toast-region/gap, toast-region/inset, toast-region/inset-compact"
    changes_for_user: "The toasts stack from the oldest at the top to the newest at the bottom, next to the corner, with space only between them."
  queued:
    token: not_applicable
    changes_for_user: "The fourth and the next toasts wait out of view, in order of arrival, and are not announced; nothing is drawn for the queue. They come into view when a toast leaves."
  entering-leaving:
    token: "toast-region/enter-duration, toast-region/exit-duration, motion/enter-easing, motion/exit-easing, motion/hover-duration"
    changes_for_user: "A toast fades in sliding up and fades out sliding down; with reduced motion it only fades, in motion/hover-duration."
  paused:
    token: not_applicable
    changes_for_user: "With the pointer on the region, the focus inside it or a modal dialog open, every toast holds its time and goes on with what was left."
  below-a-modal-dialog:
    token: overlay/scrim
    changes_for_user: "With a modal dialog open, the region stays in view below the scrim, inert, until the dialog closes; a toast that arrives is announced inside the dialog."
  scrolling:
    token: "color/foreground, focus/ring-width"
    changes_for_user: "When the window is lower than the stack, the list gets a height limit, scrolls kept at the bottom and takes the focus; a ring shows while it has it."
business_rules:
  - "The region receives only nph-notification with placement toast; the toast keeps its severity, text, actions and close."
  - "At most three toasts in view. The fourth and the next ones wait in a queue, in order of arrival, mounted but hidden and inert, with no countdown and no announcement, and come into view when a toast leaves."
  - "A toast that leaves keeps its place for the length of the exit, so there are never four in view."
  - "There is no priority in the queue in v1: with three toasts that do not close by themselves, a new one waits for the person to close one."
  - "The newest toast is at the bottom, next to the corner; toasts are aligned by the end edge."
  - "The region is role region with the name the application gave, and mounts a polite and an assertive live region even when empty. Error and warning go to the assertive one, the others to the polite one, with the heading and the description."
  - "A toast is announced when it comes into view and again when its severity, heading or description change in place."
  - "The toast inside the region has no role of its own, so it is not announced twice. The inline notification keeps its role."
  - "The toast never takes or moves the focus by itself."
  - "Every toast pauses together with the pointer on the region or the focus inside it, and under a modal dialog; each toast also keeps its own pause."
  - "Error, loading and a toast with an action never close by themselves, whatever the region does."
  - "One region per page, mounted once at the start of the page and kept there."
domain_errors: []
tokens:
  gap: toast-region/gap
  inset: [toast-region/inset, toast-region/inset-compact]
  motion: [toast-region/enter-duration, toast-region/exit-duration, motion/enter-easing, motion/exit-easing, motion/hover-duration]
  scrim: overlay/scrim
  focus: [color/foreground, focus/ring-width]
  toast: "every token inside the toast belongs to the nph-notification, by composition, with no change"
ai_hints:
  - "Mount one nph-toast-region at the start of the page, with label already localized, and append every toast of the application to it as nph-notification placement toast."
  - "Remove the toast on nph-close; the region lets the next one in. Listen to nph-close on the region or on the toast."
  - "Give error and warning toasts an action when the person can fix them: they never close by themselves."
  - "Do not build your own container, position or gap for toasts: the region does it, in the top layer, with the tokens."
  - "Use the inline nph-notification for a message tied to an area and nph-dialog for what needs an answer; the toast is only a notice."
  - "Do not put more than three toasts of the same moment on purpose: from the fourth they wait, with no priority."
accessibility:
  semantics: "The region is role region with a name given by the application. It mounts two hidden live regions, one polite and one assertive, even when empty. The toast inside it has no role. The list takes tabindex 0 only while it scrolls."
  accessible_name: "The region takes the name from label, already localized. What a screen reader reads for a toast is its heading and its description; the severity icon is decorative."
  keyboard:
    - "F6 takes the focus to the first control, the action or else the close, of the newest toast that has one. F6 again returns the focus to where it came from."
    - "Tab and Shift+Tab go through the controls of the toasts, in the order of the page."
    - "Esc with the focus inside a toast closes that toast, with the source escape. With the focus on the icon-only close, the first Esc closes its tooltip and the second closes the toast."
    - "Esc outside the region does nothing to it. F6 is left alone while a modal dialog is open."
    - "When the toast that had the focus leaves, the focus goes to the next toast that has a control or, with none, back to where it came from."
    - "With no toast that has a control, F6 takes the focus to the list while it scrolls and is left alone otherwise."
  focus: "The toast never takes the focus by itself. The region takes no focus and has no ring of its own: the rings are those of nph-button. Only the list that scrolls takes the focus, with a ring in color/foreground and focus/ring-width. Nothing in the region or the toast clips the ring of the action or of the close."
  contrast: "The region has no color of its own. The text and the icon of the toast pass 4.5:1 and 3:1 in both themes, as in nph-notification."
  color_alternative: "The severity also comes by the icon and by the heading of the toast. The region uses no color for order or priority."
invalid_combinations:
  - "A child that is not an nph-notification: it is drawn but outside the contract, and console.error is emitted in development."
  - "An nph-notification with placement inline inside the region: console.error is emitted in development; use the toast placement."
  - "A second region in the page: console.error is emitted in development; there is one per page."
  - "An empty label: console.error is emitted in development; the region has no name."
relations:
  combines_with: [nph-notification, nph-dialog]
  parents: ["the page root, once, at the start of the page"]
  children: [nph-notification]
  complements_block: []
  appears_in: []
anti_patterns:
  - "A validation error of a field in a toast."
  - "A question that needs a decision in a toast."
  - "More than three toasts in view at the same time."
  - "A toast that covers the whole stack with no way to reach it by keyboard."
  - "A region built by the application with its own container, position and gap."
  - "More than one region in the page."
sources:
  design_md: "design.md, the toast-region/* tokens, space/stack, motion/enter-duration, motion/exit-duration, motion/enter-easing, motion/exit-easing, motion/hover-duration and overlay/scrim"
  decision: "P140 — nph-toast-region: API, announcement, keyboard and queue (DSA-100)"
  tests: "src/components/nph-toast-region/nph-toast-region.test.ts"
  usage_evidence: "the three required examples of the nph-toast-region Examples story and the real region of the Live story"
  storybook: "src/components/nph-toast-region/nph-toast-region.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, page 5415:32, documentation 7819:4737, root 7689:2, set 7689:288"
---

# nph-toast-region

## Function

**The problem it solves:** the `nph-notification` draws one message. The `nph-toast-region` is the
fixed region of the screen that receives the toasts of that piece (`placement="toast"`) and decides
where they appear, in what order and with what space between them. It places them at the bottom-right
corner, shows up to three at once, holds the rest in a queue, announces them to a screen reader and
keeps the keyboard and the time of all of them. It does not draw the toast: severity, icon, text,
actions and close stay with the `nph-notification`.

**When to use:**

- A short notice after an action of the person that does not lock the screen: an export in the queue,
  an invitation sent, a failure that can be fixed.
- A failure that can be fixed, or a warning with a short action, as a toast with an action: it does
  not close by itself and the person has time to act.
- A task in progress, as a loading toast that stays until the task ends and then turns into success
  or error.
- Once per page, at the start of the page, with every toast of the application going into it.

**When NOT to use:**

- **For a message tied to an area, a field or a form** — use the inline `nph-notification` in the area
  itself.
- **For the validation error of a field** — use the error message of `nph-field`.
- **For a decision that needs an answer before going on** — use `nph-dialog`. The toast does not ask and
  does not lock the screen. The `nph-alert-dialog` is deferred.
- **To draw one toast** — use `nph-notification` with `placement="toast"` inside the region.
- **To put anything but a toast in it** — it receives only `nph-notification` with `placement="toast"`.
- **For more than one region in the page, or another corner** — the region has a single position.

## Variants

The region has no variant property. What changes comes from what the application appends and from the
window:

| What | Values | Rule |
|---|---|---|
| Quantity (Figma `quantidade`) | 1, 2 or 3 toasts in view | By the toasts appended. More than three never show together: the fourth waits in the queue |
| Screen (Figma `tela`) | default (`padrão`) from 768 px, compact (`compacta`) below | The window decides, in CSS. Not a property |

**Default screen, from 768 px:** the region sits at the bottom-right corner, `toast-region/inset` from
the bottom edge and from the end edge, and takes the width of its toasts. Each toast keeps its own
width: `notification/toast-width` stacked, `notification/toast-width-max` single-line, ending on the
same vertical line. In right-to-left writing the end edge is the left one.

**Compact screen, below 768 px:** the region takes the base from side to side, `toast-region/inset-compact`
from the bottom and from each side, and the toast takes the width of the region, even below 320 px.

**Do not combine with:** a toast that is not `placement="toast"`; more than one region in the page.

## States

The region has no hover, focus or disabled of its own. The states belong to the toasts and to the
controls inside them.

| State | Token | What changes for the person |
|---|---|---|
| Empty | `not_applicable` | Nothing is drawn: no background, border or shadow. The region stays in the top layer and keeps its two live regions mounted |
| Stacked | `toast-region/gap`, `toast-region/inset`, `toast-region/inset-compact` | From the oldest at the top to the newest at the bottom, next to the corner, with only space between them |
| Queued | `not_applicable` | The fourth and the next toasts wait out of view, in order of arrival, and are not announced. Nothing is drawn for the queue |
| Entering and leaving | `toast-region/enter-duration`, `toast-region/exit-duration`, `motion/enter-easing`, `motion/exit-easing` | The toast fades in sliding up and fades out sliding down; with reduced motion it only fades, in `motion/hover-duration` |
| Paused | `not_applicable` | With the pointer on the region, the focus inside it or a modal dialog open, every toast holds its time |
| Below a modal dialog | `overlay/scrim` | The region stays in view below the scrim, inert, until the dialog closes |
| Scrolling | `color/foreground`, `focus/ring-width` | In a window lower than the stack, the list scrolls and takes the focus; a ring shows while it has it |

**Feedback and focus:** the toast never takes the focus. A toast that arrives is announced; the
person stays where they were.

**Business rules the piece carries:**

- It receives only `nph-notification` with `placement="toast"`.
- At most three toasts in view. The fourth and the next ones wait in a queue, in order of arrival,
  mounted but `hidden` and `inert` (`data-nph-queued`), with no countdown and no announcement, and come
  into view when a toast leaves. A toast that leaves keeps its place for the length of the exit, so there
  are never four in view.
- There is no priority in the queue in v1: with three toasts that do not close by themselves, a new
  toast waits for the person to close one; with three loading toasts, which have no close button, a new
  error waits too.
- The time of a queued toast starts when it comes into view, and it is announced then.
- Every toast pauses together with the pointer on the region or the focus inside it, and goes on with
  what was left. With a modal dialog open the countdown of every toast is suspended and goes on when the
  dialog closes. Each toast keeps its own pause on top of this (`nph-notification`, P108 item 4).
- Error, loading and a toast with an action never close by themselves.
- One region per page, mounted once at the start of the page.

**Domain error states:** none.

## Using it

```html
<nph-toast-region label="Notifications">
  <nph-notification
    placement="toast"
    severity="success"
    heading="Invitation sent"
    description="The team can already access the project."
    close-label="Close"
  ></nph-notification>
</nph-toast-region>
```

- `label` is already localized by the consuming application; the piece writes no word of its own.
- Append every toast as a child, in order of arrival, and remove it on `nph-close`. The region watches
  its children, applies the limit of three and the queue, and lets the next toast in when one leaves.
  The event bubbles, so the application may listen on the region instead of on each toast.
- `nph-close` says why the toast closes in `detail.source`: `close-button`, `timeout` or `escape`.
- To change a toast in place, such as a loading toast that turns into success or error, change
  `severity`, `heading` and `description` on the same element; the region announces it again.
- The region shows the exit while the element stays in the page. A toast removed at once leaves with
  no exit; remove it after the exit duration to see it. The toasts above move up with no animation.
- Mount the region at the start of the page and keep it there. It stays in the top layer while it is
  connected, so a modal dialog opened afterwards goes above it and its scrim covers it. A region mounted
  while a dialog is already open goes above the scrim, and is still held inert by the browser.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | `role="region"` with the name given by `label`, and two hidden live regions, one polite and one assertive, mounted even when empty. The toast inside the region has no role of its own, so it is not announced twice |
| Announcement | Error and warning go to the assertive live region, the others to the polite one, with the heading and the description. A toast is announced when it comes into view and again when its severity, heading or description change in place. What arrives in the same moment is written together |
| Modal dialog | The live regions of the region are inert under a modal dialog, so two hidden live regions are appended to the open `nph-dialog` (or `dialog`) and removed when it closes. A dialog inside the shadow root of another component is not seen |
| Keyboard | F6 takes the focus to the first control of the newest toast that has one, and F6 again returns it. Tab and Shift+Tab go through the controls. Esc with the focus in a toast closes that toast; with the focus on the icon-only close, the first Esc closes its tooltip and the second closes the toast. With no toast that has a control, F6 goes to the list while it scrolls and is left alone otherwise |
| Focus | The toast never takes the focus. When the toast that had it leaves, it goes to the next toast with a control or back to where it came from. The region takes no focus and has no ring; only the list that scrolls takes it, with a ring |
| Time | 6 seconds by default, with every toast paused together by the pointer on the region, the focus inside it or a modal dialog. Error, loading and a toast with an action never close by themselves (WCAG 2.2.1) |
| Reduced motion | The slide becomes only opacity, in `motion/hover-duration` |
| Contrast | The region has no color: the text and the icon of the toast pass 4.5:1 and 3:1 in both themes |
| Touch target | The action and the close are 36 px high, above the 24 px of WCAG 2.5.8. The region has no target of its own |

F6 in the region is a decision of the design owner. It is not part of the APG Alert pattern: it is the
landmark shortcut of React Aria, React Spectrum and Base UI. The "F6 is not used in v1" of
`fichas/nph-resizable.md` is about its handle and does not hold here. The four deviations from the
APG Alert pattern (F6, Esc, the destination of the focus, closing by itself in 6 seconds) were confirmed.

## Relations

**Combines with:** `nph-notification`, the only piece it receives, and `nph-dialog`, above which the
region never goes.

**What is the parent:** the root of the page, once.

**What is the child:** `nph-notification` with `placement="toast"`; inside each one, `nph-button`,
`nph-icon` and `nph-spinner` by composition.

**Which block this piece complements:** none.

**Appears in layouts:** none.

**What the region asks of the `nph-notification`:**

- No role of its own inside the region: the notification drops it when it sits inside an
  `nph-toast-region`, and takes it back outside.
- `paused`, a reflected boolean the region sets, holds the countdown and lets it go on with what was
  left. A consumer may use it too.
- Esc: with the focus inside a toast of the region, the notification closes itself with `detail.source`
  `escape`. Outside the region it does nothing.
- The `.content` and `.actions` of the notification have no `overflow`, so the focus ring of the action
  and of the close comes out whole. A test proves it inside the region.

**Left for later:** a "close all", a priority in the queue, a collapsed stack, a region in another
corner, an animation of the toasts that move up and an imperative shortcut on top of the declarative
API. The `nph-alert-dialog` is deferred; what needs an answer goes to `nph-dialog`.

**Responsibility boundary:** the region places, stacks, limits, queues, announces, pauses and takes the
keyboard of the toasts. The `nph-notification` draws one toast. The application appends the toasts,
decides what each one says and removes it after `nph-close`.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Space between toasts | `toast-region/gap` (`space/stack`), only space, no divider |
| Distance from the edge, default screen | `toast-region/inset`, from the bottom edge and the end edge |
| Distance from the edge, compact screen | `toast-region/inset-compact`, from the bottom and from each side |
| Entrance | `toast-region/enter-duration` with `motion/enter-easing` |
| Exit | `toast-region/exit-duration` with `motion/exit-easing` |
| Reduced motion | `motion/hover-duration`, used straight |
| Scrim | `overlay/scrim`, the dialog's, not the region's |
| Ring of the scrolling list | `color/foreground` and `focus/ring-width`; not in Figma, and not brand-dependent on purpose |
| Toast | every token of the `nph-notification`, by composition |

**Usage restrictions:** the region has no color, radius, border, shadow or layer token of its own. It
lives in the top layer of the browser, as the balloon of `nph-tooltip` (P77), with no `z-index`, and
reserves no space in the page. It uses no token of the `nph-notification`. The curves and the reduced motion duration are
used straight, as in `nph-hover-card` (P112). The slide is half the height of the toast, a percentage and
not a token. The only literal breakpoint is `md`, 768 px, written in `rem` in a media query, as in
`nph-dialog` (P87).

**AI hints:**

- Mount one `nph-toast-region` at the start of the page, with `label` already localized, and append
  every toast of the application to it as `nph-notification` with `placement="toast"`.
- Remove the toast on `nph-close`; the region lets the next one in.
- Give error and warning toasts an action when the person can fix them: they never close by themselves.
- Do not build your own container, position or gap for toasts: the region does it, in the top layer,
  with its tokens.
- Use the inline `nph-notification` for a message tied to an area and `nph-dialog` for what needs an
  answer; the toast is only a notice.
- Do not put more than three toasts of the same moment on purpose: from the fourth they wait, with no
  priority.

## Examples

**Recommended cases** (the three the contract requires):

- **An export entered the queue:** one info toast, which closes by itself.
- **Three notices in a row:** the newest, a failure that can be fixed, stays at the bottom, next to the
  corner, with an action, and does not close by itself.
- **A save in progress:** a loading toast at the top, not closing until it ends, with an invitation sent
  and a failure with an action below it.

**Alternative cases:** the same stack on the compact screen, taking the base from side to side; a
toast that turns from loading into success in place; the stack in right-to-left writing.

## Anti-patterns

- **Do not put the validation error of a field in a toast** — use the error message of `nph-field` or
  the inline `nph-notification` at the top of the form.
- **Do not ask a question in a toast** — use `nph-dialog`.
- **Do not show more than three toasts at the same time** — the fourth waits in the queue.
- **Do not build your own container for toasts** — use the region.
- **Do not clip the focus ring of the action or of the close** — nothing in the region or in the toast
  has `overflow`; long text is cut only on the text layer.
- **Do not put two regions in the page.**
- **Invalid combinations:** a child that is not a toast; a notification with `placement="inline"`; a
  second region; an empty `label`. The region emits `console.error` in development.
- **Do not create or adapt without a decision:** a "close all", a priority in the queue, a collapsed
  stack, a region in another corner, a token for the slide or a color for the region.

## Sources and decisions

- **The repository `design.md`:** the `toast-region/*` tokens, `space/stack`, `motion/enter-duration`,
  `motion/exit-duration`, `motion/enter-easing`, `motion/exit-easing`, `motion/hover-duration` and
  `overlay/scrim`. The tokens are in `src/tokens/source/semantic.tokens.json`.
- **The decision that originated it:** P140, and the answer to D-1 of DSA-63.
- **Pending decisions:** none. The ring of the scrolling list is not drawn in Figma: the code uses `color/foreground`, which does not follow the brand, and the design owner can ask for another through Figma. The slide has no token: a fixed distance would need one, and the design
  owner can ask for it through Figma.
- **Tests:** `src/components/nph-toast-region/nph-toast-region.test.ts`.
- **Usage evidence:** the three required examples of the `nph-toast-region` Examples story and the real
  region of the Live story.
- **Storybook:** `src/components/nph-toast-region/nph-toast-region.stories.ts`.
- **Figma:** `DS-IA-NEPHOS 5.0`, page `5415:32`, documentation `7819:4737`, root `7689:2`, set
  `7689:288`.
