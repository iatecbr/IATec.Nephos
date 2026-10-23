---
piece: nph-tooltip
level: component
status: active
solves: >-
  Shows a short balloon of complementary information, an explanation or context data
  attached to an element that receives focus, opened at once on keyboard focus and after a
  short wait on hover, without moving focus to the balloon. On an icon-only button the
  balloon text is the accessible name of the action.
use_when:
  - "To give the action name to every icon-only button."
  - "For complementary information or context data of any element."
  - "For one sentence the person reads at once, before filling in."
do_not_use_when:
  - "To put an action, a link or a field inside the balloon: use nph-popover."
  - "To repeat in the balloon the help text of the field: that belongs to nph-field."
  - "To put in the balloon information without which the element cannot be used."
  - "To cut the text with an ellipsis or let it pass two lines: rewrite until it fits."
  - "On a disabled element or on text that does not receive focus: it gets no balloon."
  - "To name an ambiguous action with an icon-only button: on touch the balloon does not open; use a button with text."
api:
  text:
    type: string
    required: true
    default: "empty"
    reflects: false
    constraint: >-
      The balloon content, already localized by the consuming application, with no action
      and no link. Empty or whitespace-only shows nothing. The balloon follows the text up
      to layout/max-tooltip-width and wraps; it fits at most two lines and the text must
      fit whole, with no ellipsis and no broken word.
  for:
    type: string
    required: true
    default: "unset"
    reflects: true
    constraint: >-
      The id of the element that opens the balloon, looked up in the same root as the
      tooltip, like the native label. The element must receive focus: a disabled element
      gets no balloon, and an element that does not receive focus gets none and emits
      console.error in development. The tooltip listens on that element and adds its own
      id to the aria-describedby of the element, or to its aria-labelledby with
      relation name, keeping what is there and following a change of its own id. Without
      it, or with an id that matches no element, the balloon is not drawn and
      console.error is emitted in development.
  side:
    type: string
    required: false
    default: top
    reflects: false
    constraint: >-
      The preferred side: top, bottom, left or right. The balloon flips to the opposite side
      when it does not fit, and never leaves the window. It is behavior, not appearance: the
      Figma component has no side property. Any other value draws nothing and emits
      console.error in development.
  open:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The state of the balloon. The tooltip turns it on and off by itself, on hover, on
      keyboard focus, on leave, on blur and on Esc. The consumer may turn it on to show the
      balloon open, and the same closing rules apply; on an element without focus nothing
      is drawn.
  relation:
    type: string
    required: false
    default: description
    reflects: false
    constraint: >-
      What the balloon is to the element: description, the default, added to its
      aria-describedby, or name, added to its aria-labelledby, for the icon-only button,
      whose action name is the balloon text, announced once. name needs text. Any other
      value draws nothing, writes no reference and emits console.error in development.
  slots: none
  events: none
variants: not_applicable
states:
  closed:
    token: not_applicable
    changes_for_user: "The balloon is not shown. The element is still described, or named, by its text."
  open:
    token: color/tooltip
    changes_for_user: "The balloon is shown next to the element, at space/inline, entering on motion/enter-duration."
business_rules:
  - "Keyboard focus on the element opens the balloon at once. A mouse or a pen opens it after resting motion/hover-delay on the element; leaving before the wait ends opens nothing. It never opens on touch."
  - "Click, Enter and Space run the action of the element: they neither open nor close the balloon. A click during the wait cancels it."
  - "The balloon goes only on an element that receives focus. A disabled element and loose text get no balloon: without focus, a keyboard user never sees it."
  - "On an icon-only button the balloon text is the accessible name of the action, announced once (relation name). On any other element it complements the accessible name and does not replace it."
  - "It closes when the pointer leaves the element and the balloon, on blur and with Esc. While the pointer is over the balloon it stays open."
  - "It sits on top by default, flips to the opposite side when it does not fit, and may also sit bottom, left or right. While the element is outside the window the balloon is not drawn; it returns with the element."
  - "It leaves on motion/exit-duration; coming back into the element or the balloon during the exit cancels the closing."
  - "The balloon never takes focus: focus stays on the element that opened it."
  - "The text fits entirely in up to two lines, without ellipsis, automatic hyphenation or broken words."
domain_errors: []
tokens:
  background: color/tooltip
  text: [text/body-sm, color/tooltip-foreground]
  radius: radius/inner
  padding_vertical: space/inline-tight
  padding_horizontal: space/inline
  elevation: elevation/dropdown
  max_width: layout/max-tooltip-width
  max_height: layout/max-tooltip-height
  distance_to_element: space/inline
  enter: [motion/enter-duration, motion/enter-easing]
  exit: [motion/exit-duration, motion/exit-easing]
  reduced_motion: motion/hover-duration
  hover_delay: motion/hover-delay
ai_hints:
  - "Use nph-tooltip with relation name to name an icon-only button, or with the default description to give complementary context to an element that receives focus."
  - "Point it at the element with for, which is the id of the element in the same root; the tooltip does the rest."
  - "Do not attach it to a disabled element or to loose text: without focus it gets no balloon."
  - "Do not open it from code to explain a field: it opens by itself on hover after a short wait and on focus at once, and never on touch."
  - "Do not put the help text, the error message or essential information in the balloon: they belong to nph-field or to the element."
  - "Do not add a title, icon, action, link, arrow or border; for content that asks for focus or action, choose nph-popover."
  - "Choose the side only when the default does not suit; the balloon flips by itself when it does not fit."
accessibility:
  semantics: "The host is a role=tooltip from mount, open or closed, with aria-label mirroring the text so the element is described, or named, before the balloon opens. The element points to it with aria-describedby, or with aria-labelledby under relation name."
  accessible_name: "On an icon-only button the balloon text is the accessible name of the action, announced once, through aria-labelledby (relation name). On any other element the balloon complements the accessible name and does not replace it. On touch the icon-only button has no visible name, an accepted exception: the name lives in the accessible name, the icon must be easy to recognize, and an ambiguous action uses a button with text."
  keyboard:
    - "Keyboard focus on the element opens the balloon at once."
    - "Enter and Space run the action of the element and neither open nor close the balloon."
    - "Esc closes the balloon and does not reach the page; the focus stays on the element. With the balloon closed, Esc is not intercepted."
  focus: "The balloon never takes focus: focus stays on the element that opened it, with the focus drawing of that element. The balloon stays open while the pointer is over it (WCAG 1.4.13)."
  contrast: "The text uses color/tooltip-foreground on color/tooltip: 6.69 to 1 in light and 7.47 to 1 in dark, above 4.5 to 1."
  color_alternative: "The explanation is conveyed by the text; color is not the only signal."
invalid_combinations:
  - "No for, or a for that matches no element in the same root: the balloon is not drawn."
  - "A side that is not top, bottom, left or right: the balloon is not drawn."
  - "A for that points at a disabled element or at an element that does not receive focus: the balloon is not drawn."
  - "A relation that is not description or name: the balloon is not drawn and no reference is written."
  - "relation name with empty text: the element is left without a name."
  - "Adding a title, icon, action, link, arrow or border: the scope is text only."
  - "Moving focus to the balloon: focus stays on the element."
  - "Using nph-tooltip for content with action or focus: use nph-popover."
  - "Relying on the balloon on touch: it never opens there."
  - "An icon-only button with aria-label equal to the balloon text and the default relation: the text is read twice; use relation name."
relations:
  combines_with: [nph-label, nph-button]
  parents: [nph-label]
  children: []
  complements_block: []
  appears_in: []
anti_patterns:
  - "Using the balloon as helper text or a field error message."
  - "Putting in the balloon information without which the element cannot be used."
  - "Cutting, truncating or breaking a word to fit in the balloon."
  - "Opening the balloon from code on a timer or on a click."
  - "An ambiguous action as an icon-only button: on touch it has no visible name."
  - "Applying elevation/dropdown in a subtree with a data-nph-color-scheme different from the root: the shadow may use the color of the root scheme."
sources:
  design_md: "design.md, section on color/tooltip, color/tooltip-foreground, layout/max-tooltip-width, layout/max-tooltip-height, radius/inner, elevation/dropdown, space/inline and the motion roles"
  decision: "P77 — nph-tooltip: any element, hover and focus, which amends P65 and P62.6, with its amendment of 22/10/2026 (DSA-48)"
  tests: "src/components/nph-tooltip/nph-tooltip.test.ts"
  usage_evidence: "nph-label, through the info trigger"
  storybook: "src/components/nph-tooltip/nph-tooltip.stories.ts and nph-tooltip.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-tooltip board 1241:3, frame 1237:5 and component 1237:3"
---

# nph-tooltip

## Function

**The problem it solves:** shows a short balloon of complementary information, an
explanation or context data attached to an element that receives focus, opened at once on
keyboard focus and after a short wait on hover, without moving focus to the balloon. On an
icon-only button the balloon text is the accessible name of the action. Elsewhere it does not
replace the help text or the error message, which belong to `nph-field`, nor the accessible
name of the element.

**When to use:**

- To give the action name to every icon-only button.
- For complementary information or context data of any element.
- For one sentence the person reads at once, before filling in.

**When NOT to use:**

- **To put an action, a link or a field inside the balloon** — use `nph-popover`.
- **To repeat in the balloon the help text of the field** — that belongs to `nph-field`.
- **To put in the balloon information without which the element cannot be used.**
- **To cut the text with an ellipsis or let it pass two lines** — rewrite until it fits.
- **On a disabled element or on text that does not receive focus** — it gets no balloon.
- **To name an ambiguous action with an icon-only button** — on touch the balloon does not open;
  use a button with text.

## Variants

**By appearance, size and density:** `not_applicable`. The component has no visual variant; the
content arrives through the `text` property.

**The side is behavior, not a variant.** The balloon has no arrow, so it looks the same on any
side. `side` asks for a preferred side and the balloon flips by itself when it does not fit.

**Do not combine with:** title, icon, action, link, arrow or border. The component is only the
text balloon.

## States

| State | Token | What changes for the person |
|---|---|---|
| Closed | `not_applicable` | The balloon is not shown |
| Open | `color/tooltip` | The balloon is shown next to the element, at `space/inline` |

**Feedback and focus:** keyboard focus on the element opens the balloon at once. The pointer
opens it after resting `motion/hover-delay` (300 ms) on the element; leaving before the wait ends
opens nothing, and a click during the wait cancels it. Click, Enter and Space run the action of the
element and neither open nor close the balloon. It closes when the pointer leaves the element and
the balloon, on blur and with Esc. It stays open while the pointer is over the balloon, and coming
back into the element or the balloon while it leaves keeps it, with no new wait. It never opens on
touch: without hover, essential information never lives only in the balloon.

**Only on an element that receives focus:** a disabled element and loose text get no balloon:
without focus, a keyboard user never sees it. An element that becomes disabled loses its open
balloon.

**Motion:** it enters on `motion/enter-duration` (250 ms) and leaves on `motion/exit-duration`
(150 ms), each with its own curve, animating only opacity. With reduced motion, the duration is
the one of `motion/hover-duration` (100 ms); the balloon still appears and still leaves.

**Business rule the piece carries:** the text follows the width up to `layout/max-tooltip-width`
and then breaks only between words. It fits entirely in up to two lines, without ellipsis,
automatic hyphenation or broken words. Longer text is a content error.

**Domain error states:** none.

## Attaching it to an element

The tooltip is a sibling of the element, in the same root, and `for` is the `id` of the element.
On an icon-only button the balloon is the name of the action, with `relation="name"`:

```html
<button id="delete"><nph-icon name="trash-can"></nph-icon></button>
<nph-tooltip for="delete" text="Delete" relation="name"></nph-tooltip>
```

On any other element it is a description, the default:

```html
<button id="save">Save</button>
<nph-tooltip for="save" text="Saves a draft you can finish later."></nph-tooltip>
```

- The lookup uses the root of the tooltip, never the document: inside the shadow root of another
  component, the element is looked up there. A component that needs the balloon on an element
  inside its own shadow root renders its own `nph-tooltip` next to that element.
- The tooltip listens on the element and adds its own `id` to the `aria-describedby` of the
  element, or to its `aria-labelledby` with `relation="name"`, keeping what is already there. If the
  `id` of the tooltip changes, the reference follows it.
- **Known limits.** An element whose focus lives inside a shadow root (a custom element that
  delegates focus) opens the balloon on hover and on focus, but the `aria-describedby` or
  `aria-labelledby` on the host does not reach the focusable element inside; the component that owns
  the shadow root renders the tooltip itself. A host with a closed shadow root is not seen as
  focusable from outside and gets no balloon, for the same reason.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | The host is a `role="tooltip"` from mount, open or closed; the element points to it with `aria-describedby`, or with `aria-labelledby` under `relation="name"` |
| Contrast | The text uses `color/tooltip-foreground` on `color/tooltip`: 6.69:1 in light and 7.47:1 in dark, above 4.5:1 (WCAG 1.4.3) |
| Visible focus | The balloon never takes focus: focus stays on the element that opened it. The balloon stays open while the pointer is over it (WCAG 1.4.13) |
| Keyboard | Keyboard focus on the element opens the balloon at once; Enter and Space run the action and neither open nor close it; Esc closes it. Hover opens it after `motion/hover-delay` |
| Touch target | The balloon is not a touch target and does not open on touch. The touch target is the element, at its own size (WCAG 2.5.8). On touch the icon-only button has no visible name, an accepted exception: the name lives in the accessible name, the icon must be easy to recognize, and an ambiguous action uses a button with text |
| Accessible name | On an icon-only button the balloon text is the accessible name of the action, announced once (`relation="name"`). On any other element it complements the accessible name and does not replace it |

## Relations

**Combines with:** `nph-label` and `nph-button`.

**What is the parent:** `nph-label`, which renders it next to its information icon, as a
description. The icon-only `nph-button` will render it with the action name, as the name.

**What is the child:** nothing. `nph-tooltip` contains only text.

**Which block this piece complements:** none.

**Appears in layouts:** none.

**Responsibility boundary:** the tooltip opens, closes and positions itself. The consumer only says
which element it belongs to (`for`) and what it says (`text`). Help text and error message stay in
`nph-field`.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Background | `color/tooltip` |
| Text | `text/body-sm` and `color/tooltip-foreground` |
| Radius | `radius/inner` |
| Vertical padding | `space/inline-tight` |
| Horizontal padding | `space/inline` |
| Elevation | `elevation/dropdown` |
| Maximum width | `layout/max-tooltip-width` |
| Maximum height | `layout/max-tooltip-height` |
| Distance to the element | `space/inline` |
| Enter | `motion/enter-duration` and `motion/enter-easing` |
| Exit | `motion/exit-duration` and `motion/exit-easing` |
| Reduced motion | `motion/hover-duration` |
| Wait before the pointer opens it | `motion/hover-delay` |

**Usage restrictions:** do not use a border or an arrow. The accepted padding is
`space/inline-tight` vertically and `space/inline` horizontally. The Figma component binds
`border/width` to the stroke weight, but it has no stroke: no border is drawn.

**AI hints:**

- Use `nph-tooltip` with `relation="name"` to name an icon-only button, or with the default
  description to give complementary context to an element that receives focus.
- Point it at the element with `for`, the `id` of the element in the same root.
- Do not attach it to a disabled element or to loose text: without focus it gets no balloon.
- Do not open it from code to explain a field: it opens by itself and never on touch.
- Do not put the help text, the error message or essential information in the balloon.
- Do not add a title, icon, action, link, arrow or border; for content that asks for focus or
  action, choose `nph-popover`.
- Choose the side only when the default does not suit.

## Examples

**Recommended case:** the information icon of an `nph-label` opens a short explanation about
filling in the field, above the label.

**Alternative case:** an icon-only button shows its action name in a balloon on each side, and that
text is its accessible name, announced once; a two-line explanation is shown in full, without
truncation and without breaking words.

## Anti-patterns

- **Do not use for helper text or a field error message** — use `nph-field`.
- **Do not put essential information only in the balloon** — it never opens on touch.
- **Do not give an icon-only button an `aria-label` equal to the balloon text and keep the
  description** — it is read twice; use `relation="name"`.
- **Do not use an icon-only button for an ambiguous action** — on touch it has no visible name; use
  a button with text.
- **Do not cut, truncate or break a word to fit in the balloon** — fix the content that exceeds the
  limit.
- **Do not open it from code on a timer or on a click** — it opens by itself.
- **Do not apply `elevation/dropdown` in a subtree with a `data-nph-color-scheme` different from the
  root** — the shadow may use the color of the root scheme; this is a known limitation of the token
  generator.

## Sources and decisions

- **The repository `design.md`:** semantic tokens, intent and usage limits of the tooltip and the
  motion roles.
- **The decision that originated it:** P65, of 05-10-2026, amended by P77 and by its amendment of
  22-10-2026 (DSA-48).
- **Tests:** `src/components/nph-tooltip/nph-tooltip.test.ts`.
- **Usage evidence:** `nph-label`, through the `info` trigger.
- **Storybook:** `src/components/nph-tooltip/nph-tooltip.stories.ts` and
  `nph-tooltip.docs.stories.ts`.
- **Figma:** `nph-tooltip` board (`1241:3`), frame (`1237:5`) and component `1237:3` in
  `DS-IA-NEPHOS 5.0`.
