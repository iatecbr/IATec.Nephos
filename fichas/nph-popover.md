---
piece: nph-popover
level: component
status: active
solves: >-
  Gathers a title, a description and short controls in a surface anchored to a trigger, so the
  person adjusts or decides something short without leaving the page.
use_when:
  - "When the person needs to adjust or decide something short without losing their place on the page, such as filtering, choosing a due date or renaming something."
  - "Choose no arrow by default; use the arrow when the trigger sits among other elements and the link needs to be clear."
  - "Choose the size by the content: sm for a short title and description, md when the footer or a field comes in, lg when the field needs more width."
  - "Turn the footer on when the action needs confirmation; the divider comes with it."
  - "Turn the close button on when there is no footer and the content asks for a visible way out besides Esc and a press outside, such as information to read calmly."
do_not_use_when:
  - "As a list of commands: use nph-dropdown-menu."
  - "For a decision that blocks the page: use a modal dialog."
  - "For a short notice with no action: use a short text next to the element, with no floating surface."
  - "With two primary actions in the footer: use one primary solid and one secondary solid."
  - "With an outlined trigger: use the secondary solid nph-button."
  - "Inside a dialog: not part of the contract yet."
api:
  for:
    type: string
    required: true
    default: "empty"
    reflects: true
    constraint: >-
      The id of the element that opens the popover, looked up in the same root as the popover,
      like the for of nph-tooltip and nph-dropdown-menu. The trigger stays outside the
      component. The popover writes aria-haspopup dialog, aria-expanded and aria-controls on
      it. A for that is empty or matches no element in that root draws nothing and emits
      console.error in development. A disabled, aria-disabled or loading trigger opens nothing.
  open:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The state. The trigger turns it on and off; the consumer may set it, and setting it to
      false is how a footer action closes the popover. Setting it from code never fires
      nph-close.
  heading:
    type: string
    required: true
    default: "empty"
    reflects: false
    constraint: >-
      The title, already localized. Always visible; it is the h2 of the surface and its
      accessible name. Empty draws nothing and emits console.error in development.
  description:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The support text below the title, in popover/description. It describes the surface for
      the screen reader. Empty draws no description.
  side:
    type: enum
    values: [bottom, top, right, left]
    required: false
    default: bottom
    reflects: true
    constraint: >-
      Where the surface opens relative to the trigger. The popover turns to the
      opposite side when the one asked for does not fit and the opposite has more room, and
      never leaves the window. The side it resolved to is on the surface, not on the host,
      which keeps the value the consumer set. The sides are physical. A value outside the list
      draws nothing and emits console.error in development.
  align:
    type: enum
    values: [start, center, end]
    required: false
    default: center
    reflects: true
    constraint: >-
      How the surface aligns to the trigger on that side. On the top and
      bottom sides, start and end follow the writing direction; on the left and right sides,
      start is the top and end the bottom. A value outside the list draws nothing and emits
      console.error in development.
  arrow:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      An arrow that points to the trigger, decorative. Off by default. With the arrow, the surface sits one arrow height further from the trigger, so
      the tip keeps popover/offset from it.
  size:
    type: enum
    values: [sm, md, lg]
    required: false
    default: md
    reflects: true
    constraint: >-
      240, 320 or 400 wide. It changes only the width: margins, gaps and
      footer buttons stay the same, and the height follows the content. A value outside the
      list draws nothing and emits console.error in development.
  closable:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      Draws the close button, a compact ghost secondary nph-button with the
      xmark icon, 28 by 28. It needs close-label.
  close-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name of the close button, already localized, such as Close. Required while
      the button is shown; without it the popover draws without the button and emits
      console.error in development.
  slot:
    type: slot
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The default slot is the body, an nph-field for instance. The footer slot takes the
      action buttons: a secondary solid and a primary solid compact
      nph-button. The divider comes with the footer; with no footer there is none.
  nph-close:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      Bubbles, composed, cancelable, with detail source escape, outside, close-button or
      focus-out, fired before it closes when the person asks. preventDefault keeps it open.
      Setting open from code, the trigger and a footer action never fire it.
variants:
  placement:
    axis: position
    choose_when: "bottom, the default, unless the layout asks for another side; top, right or left when there is no room below or the context asks for it. center, the default, unless the surface should start or end where the trigger does. The popover turns to the opposite side by itself when the one asked for does not fit."
    do_not_combine_with: ["a side or an alignment outside the lists"]
  arrow:
    axis: appearance
    choose_when: "Off, the default, because the link to the trigger is already clear by proximity and the drawing is cleaner; on when the trigger sits among other elements and the link needs to be clear."
    do_not_combine_with: []
  size:
    axis: size
    choose_when: "sm (240) for a short title and description; md (320), the default, when the footer or a field comes in; lg (400) when the field needs more width."
    do_not_combine_with: ["a size to change margins, gaps or the footer buttons: the size changes only the width"]
  parts:
    axis: content
    choose_when: "Description on by default; body, close button and footer off by default. Turn the footer on when the action needs confirmation; turn the close button on when there is no footer and the content asks for a visible way out."
    do_not_combine_with: ["two primary actions in the footer"]
states:
  closed:
    token: "none"
    changes_for_user: "Only the trigger shows."
  open:
    token: "popover/background, popover/border, popover/radius, elevation/dropdown"
    changes_for_user: "The surface shows anchored to the trigger, the trigger carries aria-expanded true and draws the hover-active look of its own component, and the focus goes into the surface."
  trigger-open:
    token: "button/secondary-solid-background-hover"
    changes_for_user: "The nph-button trigger keeps the look of hover-active while the popover is open, even with the pointer away. It is an extra signal; aria-expanded is the one that says it is open."
business_rules:
  - "The popover is not modal: the page stays usable, nothing traps the Tab key, and it closes with Esc, a press outside, the close button, the footer action or the focus leaving it."
  - "On close the focus goes back to the trigger when it was inside the popover and the person did not move it: Esc, the close button and the footer action give it back; a press outside and the focus leaving leave it where the person put it."
  - "A footer action closes the popover because the consumer sets open to false in its handler; the popover fires no event for it."
  - "Esc closes only the popover: it does not reach a dialog around it, and it is not taken from a control of the body that used it, such as an open nph-select list. With more than one popover open it belongs to the last one shown."
  - "While the surface leaves it is inert: it takes no focus and no click."
  - "The footer is one divider, from edge to edge, in popover/divider, then the actions, compact, popover/footer-gap apart. On a touch screen the footer buttons go back to the default size."
  - "The surface does not clip its content, so the focus ring of an inner piece is not cut."
  - "The title is always visible and names the surface; the description describes it."
  - "The trigger is an nph-button, secondary solid. Open, it takes the hover-active look and carries aria-expanded true, with aria-haspopup dialog and aria-controls."
  - "Every text comes from the consumer, already localized: the piece writes no word of its own."
domain_errors:
  - "A for that is empty or matches no element in the same root of the popover: it draws nothing and emits console.error in development."
  - "An empty heading, or a side, an align or a size outside the lists: it draws nothing and emits console.error in development, one per cause."
  - "closable with no close-label: it draws without the close button and emits console.error in development."
tokens:
  surface: "popover/background, popover/foreground, popover/border, popover/border-width, popover/radius, elevation/dropdown"
  title_and_description: "popover/foreground, popover/description, text/label-lg, text/body-sm"
  spacing: "popover/padding, popover/header-gap, popover/title-gap, popover/footer-gap, popover/footer-padding"
  divider: "popover/divider, popover/border-width"
  width: "popover/width-sm, popover/width-md, popover/width-lg"
  position: "popover/offset"
  arrow: "popover/arrow-width, popover/arrow-height, popover/arrow-inset, popover/background, popover/border"
  motion: "motion/enter-duration, motion/enter-easing, motion/exit-duration, motion/exit-easing, motion/hover-duration"
  touch: "control/height-compact, control/height-default"
ai_hints:
  - "Use nph-popover to adjust or decide something short without leaving the page; for a list of commands use nph-dropdown-menu, for a decision that blocks the page use a modal dialog."
  - "Give for with the id of the trigger, an nph-button secondary solid, and heading with a short title that states the decision."
  - "Keep a single primary action, at the end of the footer: a secondary solid and a primary solid, compact."
  - "Close it from the footer action by setting open to false in the handler of the button."
  - "Prefer no arrow; use it only when the trigger sits among other elements."
  - "Turn the close button on, with close-label, when there is no footer."
  - "Do not put a popover inside a dialog: it is not part of the contract yet."
accessibility:
  semantics: "The surface is a non-modal dialog, named by the title through aria-labelledby and described by the description through aria-describedby. The trigger carries aria-haspopup dialog, aria-expanded and aria-controls, the last one pointing to the popover host, because an id reference does not cross a shadow root. When the trigger is an nph-button, the native button inside it carries aria-haspopup and aria-expanded. The arrow is decorative (aria-hidden)."
  accessible_name: "The surface: heading. The description: description. The close button: close-label. The trigger: its own text or aria-label."
  keyboard:
    - "Enter and Space on the trigger open the popover; the focus goes into it by the focus rule."
    - "Esc closes it and gives the focus back to the trigger, and does not reach a dialog around it."
    - "Tab moves through the body and the footer in order and then on to the page; the focus leaving the popover closes it."
  focus: "Each inner piece shows the focus ring of its own component; the surface takes no ring. On open, the focus goes to the first element with autofocus, otherwise to the first focusable element of the body, then of the footer, then to the close button, then to the surface itself."
  contrast: "Title and description pass 4.5:1 over the surface in both themes. The border and the divider are decorative: in light the surface stands apart by the shadow, in dark by the lighter background."
  color_alternative: "Open, the surface shows anchored to the trigger and the trigger carries aria-expanded true; the hover-active look of the trigger is an extra signal, not the only one."
invalid_combinations:
  - "closable without close-label — the close button has an icon and no text."
  - "A side, an align or a size outside the lists."
  - "A for that matches no element in the same root as the popover."
  - "Two primary actions in the footer — use one primary solid and one secondary solid."
relations:
  combines_with: [nph-button, nph-field, nph-separator, nph-icon]
  parents: ["a page, a toolbar, a table row or a card, next to its trigger"]
  children: [nph-button, nph-field, nph-separator]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Using the popover as a list of commands, as a modal dialog or as a short notice."
  - "Using an outlined trigger, or a trigger that is not an nph-button."
  - "Putting two primary actions in the footer."
  - "Putting an nph-card inside the popover: its parts are its own."
  - "Leaving the trigger without an accessible name."
  - "Drawing a divider with no footer."
sources:
  design_md: "design.md, the popover/* tokens, color/popover, color/popover-foreground, color/muted-foreground, color/border-subtle, elevation/dropdown, text/label-lg, text/body-sm and the motion roles"
  decision: "P111 — nph-popover: API and semantics"
  tests: "src/components/nph-popover/nph-popover.test.ts"
  usage_evidence: "no screen consumes it yet"
  storybook: "src/components/nph-popover/nph-popover.stories.ts and nph-popover.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-popover documentation 4749:5857, set 4727:1544"
---

# nph-popover

## Function

**The problem it solves:** gathers a title, a description and short controls in a surface
anchored to a trigger. The person adjusts or decides something short without leaving the page.

**When to use:**

- When the person needs to adjust or decide something short without losing their place on the page,
  such as filtering, choosing a due date or renaming something.
- Choose no arrow by default; use the arrow when the trigger sits among other elements and the link
  needs to be clear.
- Choose the size by the content: `sm` for a short title and description, `md` when the footer or a
  field comes in, `lg` when the field needs more width.
- Turn the footer on when the action needs confirmation; the divider comes with it.
- Turn the close button on when there is no footer and the content asks for a visible way out
  besides Esc and a press outside, such as information to read calmly.

**When NOT to use:**

- **As a list of commands** — use `nph-dropdown-menu`.
- **For a decision that blocks the page** — use a modal dialog.
- **For a short notice with no action** — use a short text next to the element, with no floating
  surface.
- **With two primary actions in the footer** — use one primary solid and one secondary solid.
- **With an outlined trigger** — use the secondary solid `nph-button`.
- **Inside a dialog** — not part of the contract yet.

## Variants

| Variant | Values | Choose when |
|---|---|---|
| Side | `bottom`, `top`, `right`, `left` | `bottom` unless the layout asks for another; the popover turns to the opposite side by itself when the one asked for does not fit |
| Alignment | `start`, `center`, `end` | `center` unless the surface should start or end where the trigger does |
| Arrow | off, on | Off by default; on when the trigger sits among other elements |
| Size | `sm`, `md`, `lg` | `sm` for a short title and description; `md` when the footer or a field comes in; `lg` when the field needs more width |
| Parts | description, body, close button, footer | Description on by default; the others off, turned on by the content |

The side is the Figma property `lado`, with the values `bottom`, `top`, `right` and `left`; the
alignment is `alinhamento`, with `start`, `center` and `end`; the arrow is `seta`, with `sem`
(without) and `com` (with); the size is `tamanho`, with `sm`, `md` and `lg`. The parts are the
Figma booleans `descrição`, `corpo`, `fechar` and `rodapé`; the title and the description texts are
`texto do título` and `texto da descrição`. Without the arrow, the Figma set varies only the size,
and the code resolves the position; with the arrow, it varies side and alignment, at size `md`.

**By size and density:** the size changes only the width: 240, 320 or 400. The margins, the gaps
and the footer buttons stay the same, and the height follows the content.

**Do not combine with:** a side, an alignment or a size outside the lists; `closable` without
`close-label`; two primary actions in the footer.

## States

| Part | State | Token | What changes for the person |
|---|---|---|---|
| Popover | Closed | none | Only the trigger shows |
| Popover | Open | `popover/background`, `popover/border`, `popover/radius`, `elevation/dropdown` | The surface shows anchored to the trigger; the focus goes into it |
| Trigger | Open | `button/secondary-solid-background-hover` | The `nph-button` trigger keeps the look of hover-active while the popover is open, and carries `aria-expanded` true |

Closed, only the trigger shows; open, the trigger and the surface show. In Figma, open and closed are
not properties of the set. Focus has no token of its own: each inner piece shows the focus ring of
its own component, and the surface takes none.

**Feedback and focus:** on open, the focus goes into the surface by the focus rule; on close it goes
back to the trigger when it was inside the popover and the person did not move it. The surface
enters with the enter role of motion and leaves with the exit role; with reduced motion only the
duration shortens.

**Business rule the piece carries:**

- The popover is not modal: the page stays usable and nothing traps the Tab key. It closes with Esc,
  a press outside, the close button, the footer action or the focus leaving it.
- A footer action closes the popover because the consumer sets `open` to `false` in the handler of
  its button; the popover fires no event for it.
- Esc closes only the popover: it does not reach a dialog around it, and it is not taken from a control
  of the body that used it. With more than one popover open it belongs to the last one shown.
- While the surface leaves it is inert: it takes no focus and no click.
- The footer is one divider, from edge to edge, in `popover/divider`, and then the actions, compact,
  `popover/footer-gap` apart and `popover/footer-padding` around them. On a touch screen the footer
  buttons go back to the default size.
- The surface does not clip its content, so the focus ring of an inner piece is not cut.
- The title is always visible and names the surface; the description describes it.
- The trigger is an `nph-button`, secondary solid.
- Every text comes from the consumer, already localized: the piece writes no word of its own.

**Domain error states:** a `for` that is empty or matches no element in the same root, an empty
`heading` or a value outside the lists draws nothing and emits `console.error` in development, one per
cause. A `closable` with no `close-label` draws without the close button and says why.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | The surface is a non-modal dialog, named by the title through `aria-labelledby` and described by the description through `aria-describedby`. The trigger carries `aria-haspopup` dialog, `aria-expanded` and `aria-controls`; the last points to the popover host, because an id reference does not cross a shadow root. The arrow is decorative (`aria-hidden`) |
| Accessible name | The surface: `heading`. The description: `description`. The close button: `close-label`. The trigger: its own text or `aria-label` |
| Keyboard | Enter and Space on the trigger open the popover. Esc closes it and gives the focus back to the trigger. Tab moves through the body and the footer and then on to the page, which closes it |
| Focus | Each inner piece shows the focus ring of its own component; the surface takes no ring. On open, the focus goes to the first element with `autofocus`, then to the first focusable element of the body, then of the footer, then to the close button, then to the surface |
| Contrast | Title and description pass 4.5:1 over the surface in both themes. The border and the divider are decorative: in light, `#f1f1f1` over white is very soft and the surface stands apart by the shadow; in dark, by the lighter background |
| Alternative to color | Open, the surface shows anchored to the trigger and the trigger carries `aria-expanded` true; the hover-active look of the trigger is an extra signal, not the only one |
| Touch target | The trigger is 36 tall. The close button is 28 by 28 and the footer buttons are 28 tall, above the 24 by 24 minimum. On a touch screen the footer buttons go back to 36 |
| Known limits | (a) The look of the open trigger and the ARIA of the native button belong to `nph-button` and apply only to a trigger that carries `aria-haspopup` dialog; the trigger of `nph-dropdown-menu` keeps its look (D-2). (b) With the arrow, the contract gives the offset of 4 and the arrow of 8 by 16 but not where they meet: the code keeps the tip 4 from the trigger, with the surface one arrow height further (D-1). (c) `aria-controls` points to the popover host, not to the surface, because an id reference does not cross a shadow root (D-3). (d) The title is drawn in `text/label-lg`, the role that matches the accepted values, although `design.md` says that role is not for titles (D-4). (e) The popover does not constrain its height: a surface taller than the window is not scrollable. (f) A popover inside a dialog is out of scope |

## Relations

**Combines with:** `nph-button`, the trigger, the footer actions and the close button; `nph-field`,
the body; `nph-separator`, the divider; and `nph-icon`, through the close button.

**What is the parent:** a page, a toolbar, a table row or a card, next to its trigger. The popover
sits beside its trigger in the DOM and finds it by `for`.

**What is the child:** the body and the footer actions, which the consumer slots in; `nph-separator`
and the close `nph-button`, drawn by the piece. Its parts are its own: there is no `nph-card` inside.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Surface | `popover/background`, `popover/foreground`, `popover/border`, `popover/border-width`, `popover/radius`, `elevation/dropdown` |
| Title and description | `popover/foreground`, `popover/description`, `text/label-lg`, `text/body-sm` |
| Spacing | `popover/padding`, `popover/header-gap`, `popover/title-gap`, `popover/footer-gap`, `popover/footer-padding` |
| Divider | `popover/divider`, `popover/border-width` |
| Width | `popover/width-sm`, `popover/width-md`, `popover/width-lg` |
| Distance to the trigger | `popover/offset` |
| Arrow | `popover/arrow-width`, `popover/arrow-height`, `popover/arrow-inset` |
| Motion | `motion/enter-duration`, `motion/enter-easing`, `motion/exit-duration`, `motion/exit-easing`, `motion/hover-duration` |
| Touch | `control/height-compact`, `control/height-default` |

**Usage restrictions:** the piece does not choose color, radius, size or typography: everything comes
from a token, and the shadow is the `elevation/dropdown` style, with no token of its own. The border
and the divider use the same token, `color/border-subtle`, in both themes. The piece has no `::part`
and no color property.

**AI hints:**

- Use `nph-popover` to adjust or decide something short without leaving the page; for a list of
  commands use `nph-dropdown-menu`, and for a decision that blocks the page use a modal dialog.
- Give `for` with the id of the trigger, an `nph-button` secondary solid, and `heading` with a short
  title that states the decision.
- Keep a single primary action, at the end of the footer: a secondary solid and a primary solid,
  compact.
- Close it from the footer action by setting `open` to `false` in the handler of the button.
- Prefer no arrow; use it only when the trigger sits among other elements.
- Turn the close button on, with `close-label`, when there is no footer.
- Do not put a popover inside a dialog: it is not part of the contract yet.

## Examples

**Recommended case:** filter with confirmation: a title, a short description and a footer with Clear
and Apply, opened by a secondary solid trigger.

**Alternative case:** a short form, with an `nph-field` in the body and a footer with Cancel and Save;
and an information popover with the arrow and the close button, no footer.

## Anti-patterns

- **Do not use two primary actions in the footer** — use one primary solid and one secondary solid.
- **Do not use an outlined trigger** — use the secondary solid `nph-button`, with a tonal
  background.
- **Do not use it for a short notice with no action** — use a short text next to the element.
- **Do not use it for a decision that blocks the page** — use a modal dialog.
- **Do not put an `nph-card` inside** — the parts of the popover are its own.
- **Do not leave the trigger without a name** — give it text or `aria-label`.
- **Invalid combinations:** `closable` without `close-label`; a side, an alignment or a size outside
  the lists; a `for` that matches no element in the same root.
- **Do not create without a decision:** a popover inside a dialog, a new variant of `nph-button`
  for the open trigger, a color property.

## Sources and decisions

- **The repository `design.md`:** the `popover/*` tokens, the colors they point to, `elevation/dropdown`
  and the motion roles.
- **The decision that originated it:** P111.
- **Tests:** `src/components/nph-popover/nph-popover.test.ts`.
- **Usage evidence:** no screen consumes it yet.
- **Storybook:** `src/components/nph-popover/nph-popover.stories.ts` and
  `nph-popover.docs.stories.ts`.
- **Figma:** the `nph-popover` documentation frame (`4749:5857`) and the set `4727:1544` in
  `DS-IA-NEPHOS 5.0`.
