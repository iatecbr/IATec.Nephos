---
piece: nph-tooltip
level: component
status: active
solves: >-
  Shows a short balloon of complementary information, an explanation or context data
  attached to any element, opened on hover and on keyboard focus, without moving focus to
  the balloon.
use_when:
  - "To give the action name to every icon-only button."
  - "For complementary information or context data of any element."
  - "For one sentence the person reads at once, before filling in."
do_not_use_when:
  - "To put an action, a link or a field inside the balloon: use nph-popover."
  - "To repeat in the balloon the help text of the field: that belongs to nph-field."
  - "To put in the balloon information without which the element cannot be used."
  - "To cut the text with an ellipsis or let it pass two lines: rewrite until it fits."
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
      tooltip, like the native label. The tooltip listens on that element and adds its own
      id to the aria-describedby of the element. Without it, or with an id that matches no
      element, the balloon is not drawn and console.error is emitted in development.
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
      balloon open, and the same closing rules apply.
  slots: none
  events: none
variants: not_applicable
states:
  closed:
    token: not_applicable
    changes_for_user: "The balloon is not shown. The element is still described by its text."
  open:
    token: color/tooltip
    changes_for_user: "The balloon is shown next to the element, at space/inline, entering on motion/enter-duration."
business_rules:
  - "The balloon opens on hover with a mouse or a pen and on keyboard focus, with no delay, on any element; it never opens on touch."
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
ai_hints:
  - "Use nph-tooltip to name an icon-only button, or to give complementary context to any element."
  - "Point it at the element with for, which is the id of the element in the same root; the tooltip does the rest."
  - "Do not open it from code to explain a field: it opens by itself on hover and on focus, and never on touch."
  - "Do not put the help text, the error message or essential information in the balloon: they belong to nph-field or to the element."
  - "Do not add a title, icon, action, link, arrow or border; for content that asks for focus or action, choose nph-popover."
  - "Choose the side only when the default does not suit; the balloon flips by itself when it does not fit."
accessibility:
  semantics: "The host is a role=tooltip from mount, open or closed, with aria-label mirroring the text so the described element is described before the balloon opens. The element it describes points to it with aria-describedby."
  accessible_name: "The balloon complements the accessible name of the element and does not replace it: on the icon-only button, the action name stays on the button itself."
  keyboard:
    - "Keyboard focus on the element opens the balloon."
    - "Esc closes the balloon and does not reach the page; the focus stays on the element."
  focus: "The balloon never takes focus: focus stays on the element that opened it, with the focus drawing of that element. The balloon stays open while the pointer is over it (WCAG 1.4.13)."
  contrast: "The text uses color/tooltip-foreground on color/tooltip: 6.69 to 1 in light and 7.47 to 1 in dark, above 4.5 to 1."
  color_alternative: "The explanation is conveyed by the text; color is not the only signal."
invalid_combinations:
  - "No for, or a for that matches no element in the same root: the balloon is not drawn."
  - "A side that is not top, bottom, left or right: the balloon is not drawn."
  - "Adding a title, icon, action, link, arrow or border: the scope is text only."
  - "Moving focus to the balloon: focus stays on the element."
  - "Using nph-tooltip for content with action or focus: use nph-popover."
  - "Relying on the balloon on touch: it never opens there."
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
  - "Applying elevation/dropdown in a subtree with a data-nph-color-scheme different from the root: the shadow may use the color of the root scheme."
sources:
  design_md: "design.md, section on color/tooltip, color/tooltip-foreground, layout/max-tooltip-width, layout/max-tooltip-height, radius/inner, elevation/dropdown, space/inline and the motion roles"
  decision: "P77 — nph-tooltip: any element, hover and focus, which amends P65 and P62.6"
  tests: "src/components/nph-tooltip/nph-tooltip.test.ts"
  usage_evidence: "nph-label, through the info trigger"
  storybook: "src/components/nph-tooltip/nph-tooltip.stories.ts and nph-tooltip.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-tooltip board 1241:3, frame 1237:5 and component 1237:3"
---

# nph-tooltip

## Function

**The problem it solves:** shows a short balloon of complementary information, an
explanation or context data attached to any element, opened on hover and on keyboard focus,
without moving focus to the balloon. It does not replace the help text or the error message,
which belong to `nph-field`, nor the accessible name of the element.

**When to use:**

- To give the action name to every icon-only button.
- For complementary information or context data of any element.
- For one sentence the person reads at once, before filling in.

**When NOT to use:**

- **To put an action, a link or a field inside the balloon** — use `nph-popover`.
- **To repeat in the balloon the help text of the field** — that belongs to `nph-field`.
- **To put in the balloon information without which the element cannot be used.**
- **To cut the text with an ellipsis or let it pass two lines** — rewrite until it fits.

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

**Feedback and focus:** the balloon opens when the pointer rests on the element and when the
element receives keyboard focus, with no delay. It closes when the pointer leaves the element and
the balloon, on blur and with Esc. It stays open while the pointer is over the balloon. It never
opens on touch: without hover, essential information never lives only in the balloon.

**Motion:** it enters on `motion/enter-duration` (250 ms) and leaves on `motion/exit-duration`
(150 ms), each with its own curve, animating only opacity. With reduced motion, the duration is
the one of `motion/hover-duration` (100 ms); the balloon still appears and still leaves.

**Business rule the piece carries:** the text follows the width up to `layout/max-tooltip-width`
and then breaks only between words. It fits entirely in up to two lines, without ellipsis,
automatic hyphenation or broken words. Longer text is a content error.

**Domain error states:** none.

## Attaching it to an element

The tooltip is a sibling of the element, in the same root, and `for` is the `id` of the element:

```html
<button id="delete" aria-label="Delete">...</button>
<nph-tooltip for="delete" text="Delete"></nph-tooltip>
```

- The lookup uses the root of the tooltip, never the document: inside the shadow root of another
  component, the element is looked up there. A component that needs the balloon on an element
  inside its own shadow root renders its own `nph-tooltip` next to that element.
- The tooltip listens on the element and adds its own `id` to the `aria-describedby` of the
  element, keeping what is already there.
- **Known limits.** An element whose focus lives inside a shadow root (a custom element that
  delegates focus) opens the balloon on hover and on focus, but the `aria-describedby` on the host
  does not reach the focusable element inside; the component that owns the shadow root renders the
  tooltip itself. A disabled element may not receive pointer events, so the balloon may not open over
  it. An icon-only button whose accessible name equals the balloon text may be read twice.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | The host is a `role="tooltip"` from mount, open or closed; the element it describes points to it with `aria-describedby` |
| Contrast | The text uses `color/tooltip-foreground` on `color/tooltip`: 6.69:1 in light and 7.47:1 in dark, above 4.5:1 (WCAG 1.4.3) |
| Visible focus | The balloon never takes focus: focus stays on the element that opened it. The balloon stays open while the pointer is over it (WCAG 1.4.13) |
| Keyboard | Keyboard focus on the element opens the balloon; Esc closes it. Hover also opens it |
| Touch target | The balloon is not a touch target and does not open on touch. The touch target is the element, at its own size (WCAG 2.5.8) |
| Accessible name | The balloon complements the accessible name of the element and does not replace it |

## Relations

**Combines with:** `nph-label` and `nph-button`.

**What is the parent:** `nph-label`, which renders it next to its information icon. The icon-only
`nph-button` will render it with the action name.

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

**Usage restrictions:** do not use a border or an arrow. The accepted padding is
`space/inline-tight` vertically and `space/inline` horizontally. The Figma component binds
`border/width` to the stroke weight, but it has no stroke: no border is drawn.

**AI hints:**

- Use `nph-tooltip` to name an icon-only button, or to give complementary context to any element.
- Point it at the element with `for`, the `id` of the element in the same root.
- Do not open it from code to explain a field: it opens by itself and never on touch.
- Do not put the help text, the error message or essential information in the balloon.
- Do not add a title, icon, action, link, arrow or border; for content that asks for focus or
  action, choose `nph-popover`.
- Choose the side only when the default does not suit.

## Examples

**Recommended case:** the information icon of an `nph-label` opens a short explanation about
filling in the field, above the label.

**Alternative case:** an icon-only button shows its action name in a balloon on each side, and a
two-line explanation is shown in full, without truncation and without breaking words.

## Anti-patterns

- **Do not use for helper text or a field error message** — use `nph-field`.
- **Do not put essential information only in the balloon** — it never opens on touch.
- **Do not cut, truncate or break a word to fit in the balloon** — fix the content that exceeds the
  limit.
- **Do not open it from code on a timer or on a click** — it opens by itself.
- **Do not apply `elevation/dropdown` in a subtree with a `data-nph-color-scheme` different from the
  root** — the shadow may use the color of the root scheme; this is a known limitation of the token
  generator.

## Sources and decisions

- **The repository `design.md`:** semantic tokens, intent and usage limits of the tooltip and the
  motion roles.
- **The decision that originated it:** P65, of 05-10-2026, amended by P77.
- **Tests:** `src/components/nph-tooltip/nph-tooltip.test.ts`.
- **Usage evidence:** `nph-label`, through the `info` trigger.
- **Storybook:** `src/components/nph-tooltip/nph-tooltip.stories.ts` and
  `nph-tooltip.docs.stories.ts`.
- **Figma:** `nph-tooltip` board (`1241:3`), frame (`1237:5`) and component `1237:3` in
  `DS-IA-NEPHOS 5.0`.
