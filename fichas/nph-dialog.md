---
piece: nph-dialog
level: component
status: active
solves: >-
  Blocks the page with a modal window, over the overlay/scrim veil, until the person finishes
  or cancels a short task, such as editing a record, filling in a short form or choosing an
  option.
use_when:
  - "A short task that needs an answer before going on: edit a record, fill in a short form, choose an option."
  - "Choose the size by the content, as the width ceiling: sm for a choice or a short confirmation without a destructive action, md for a short form, lg for a table, a long list or a two-column form."
  - "Turn on the lines with long content, such as a list or a table."
  - "Use stacked actions on a narrow screen."
do_not_use_when:
  - "To confirm a destructive action, such as deleting or discarding: use nph-alert-dialog."
  - "For a long flow: it goes to a page."
  - "For a notice that asks for no answer: use a message on the page itself."
  - "To open a dialog over another: finish or close the first one."
api:
  heading:
    type: string
    required: true
    default: "empty"
    reflects: false
    constraint: >-
      The title, already localized by the consuming application: the task or the question.
      It is the h2 of the header and the accessible name of the dialog. Empty or only spaces
      draws nothing and emits console.error in development. The name heading avoids title,
      a global HTML attribute that would show the browser's own balloon over the dialog.
  description:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The support sentence below the title, already localized, which completes the name: it
      becomes the accessible description of the dialog. Empty draws no description.
  size:
    type: enum
    values: [sm, md, lg]
    required: false
    default: md
    reflects: true
    constraint: >-
      The Figma size P, M and G: the width ceiling. The dialog hugs its content, from
      layout/dialog-min-width up to layout/dialog-sm, -md or -lg. Reflects because the
      internal CSS selects the ceiling by it. Any other value draws nothing and emits
      console.error in development.
  actions:
    type: enum
    values: [inline, stacked]
    required: false
    default: inline
    reflects: true
    constraint: >-
      The Figma actions property. inline: the footer buttons on the right, side by side, the primary
      last. stacked: below the md breakpoint (768), one button per line, the primary on top;
      at or above it, inline. inline never stacks. Reflects because the internal CSS selects
      by it. Any other value draws nothing and emits console.error in development.
  hide-close:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      Turns off the close button, which the Figma set has on by default. Turn it off
      only when the footer already offers the way out. Esc still closes the dialog. The
      property is hideClose.
  close-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name of the close button, already localized, such as Close. Required
      while the close button is shown: without it, the dialog draws without the button and
      emits console.error in development. The property is closeLabel.
  header-separator:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The header line of the Figma set: an nph-separator between the header and the content, at
      space/stack from each. Turn it on with long content. The property is headerSeparator.
  footer-separator:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The footer line of the Figma set: an nph-separator between the content and the footer, drawn
      only when the footer has buttons. Turn it on with long content. The property is
      footerSeparator.
  open:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The state, and the only way to open and close the dialog. The dialog sets it to false
      itself when the person closes it with Esc or with the close button. Setting it from
      code never fires the event.
  slot:
    type: "default slot"
    required: false
    default: "none"
    reflects: false
    constraint: >-
      The content area of the Figma set: fields, text, a list or another composition. Its
      width sets the width of the dialog, up to the ceiling of the size. Empty, the area is
      not drawn, as with the content area turned off in Figma. It is the only part that scrolls.
  footer:
    type: "named slot"
    required: false
    default: "none"
    reflects: false
    constraint: >-
      The footer of the Figma set: the nph-button actions, the solid secondary first and the primary or
      the danger last, as the consumer writes them. Empty, the footer is not drawn.
  nph-close:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      Fired before the dialog closes when the person asks: Esc (detail.source escape) or the
      close button (detail.source close-button). It bubbles, crosses the shadow root and is
      cancelable: preventDefault keeps the dialog open. The browser may refuse to hold a
      repeated Esc with no new activation by the person; then the event is not cancelable
      and the dialog closes.
variants:
  size:
    axis: size
    choose_when: "sm for a choice or a short confirmation without a destructive action; md, the default, for a short form; lg for a table, a long list or a two-column form."
    do_not_combine_with: ["sm with a destructive action: that is nph-alert-dialog."]
  actions:
    axis: density
    choose_when: "inline is the default. stacked on a narrow screen: below the md breakpoint, one button per line at full width, the primary on top."
    do_not_combine_with: []
states:
  closed:
    token: not_applicable
    changes_for_user: "The dialog is not shown and the page answers."
  open:
    token: "color/dialog over overlay/scrim"
    changes_for_user: "The window appears over the veil, entering on motion/enter-duration; the page behind it does not answer and does not scroll."
business_rules:
  - "The dialog is modal: the rest of the page is inert while it is open, and the page does not scroll."
  - "On open, the focus goes to the first element with autofocus in the content or the footer; otherwise to the first focusable element of the content, then of the footer, then to the close button, then to the window itself. On close, it goes back to the element that had it."
  - "Esc and the close button ask to close: the dialog fires nph-close and closes unless the event is canceled. A click on the veil does not close it."
  - "Above layout/dialog-max-height only the content scrolls; the header and the footer stay."
  - "The width hugs the content between layout/dialog-min-width and the ceiling of the size; without the content area, the header text sets the width up to the ceiling."
domain_errors: []
tokens:
  background: color/dialog
  foreground: color/dialog-foreground
  radius: radius/overlay
  elevation: elevation/modal
  padding: space/overlay-padding
  min_width: layout/dialog-min-width
  ceiling: [layout/dialog-sm, layout/dialog-md, layout/dialog-lg]
  max_height: layout/dialog-max-height
  edge: layout/margin-compact
  veil: overlay/scrim
  title: [text/heading-md, color/dialog-foreground]
  description: [text/body-md, color/muted-foreground]
  title_to_description: space/stack-snug
  between_blocks: space/stack
  before_actions: [space/stack, space/stack-snug]
  between_actions: space/inline-loose
  title_to_close: space/inline
  lines: color/dialog-separator
  secondary_action: [color/secondary-on-dialog, color/secondary-on-dialog-hover]
  enter: [motion/enter-duration, motion/enter-easing]
  exit: [motion/exit-duration, motion/exit-easing]
  reduced_motion: motion/hover-duration
ai_hints:
  - "Use nph-dialog for a short task that needs an answer before going on; a long flow goes to a page and a notice with no answer stays on the page."
  - "Write the task or the question in heading: it is the name the screen reader reads."
  - "Put the fields in the default slot and the nph-button actions in the footer slot, the solid secondary first and the primary last."
  - "Use the solid secondary for Cancel, never outline: inside the dialog it paints color/secondary-on-dialog by itself."
  - "Use the primary in loading while the action finishes, instead of closing or disabling it."
  - "To confirm a destructive action, choose nph-alert-dialog."
  - "Open and close it only through open, and listen to nph-close to know when the person closed it."
accessibility:
  semantics: "A native dialog element opened as modal (role dialog, aria-modal), in the top layer; the rest of the page is inert. The title is an h2."
  accessible_name: "The heading names the dialog through aria-labelledby and the description completes it through aria-describedby. The close button is named by close-label."
  keyboard:
    - "Tab and Shift+Tab move between the elements of the dialog and never reach the page."
    - "Esc asks to close the dialog; a tooltip open inside it takes the first Esc."
    - "Enter and Space activate the buttons, as in nph-button."
  focus: "On open, the focus moves into the dialog by the rule of the business rules; on close, it goes back to the element that had it. The visible focus is the one of nph-button and of each element of the content."
  contrast: "Title and description pass 4.5:1 on color/dialog in both modes; the text of the footer buttons passes on their own background, the secondary on color/secondary-on-dialog."
  color_alternative: "The title says the subject and the buttons say the actions; color only reinforces."
invalid_combinations:
  - "An empty heading: the dialog has no name, so nothing is drawn."
  - "A size other than sm, md or lg, or actions other than inline or stacked: nothing is drawn."
  - "The close button on without close-label: the button would have no name, so it is not drawn."
  - "A dialog opened over another: it opens and warns in development; finish or close the first one."
  - "An outline secondary in the footer: the system default is the solid secondary."
relations:
  combines_with: [nph-button, nph-separator, nph-icon]
  parents: []
  children: [nph-button, nph-separator]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Using the dialog for a long flow, which belongs to a page."
  - "Using the dialog for a notice that asks for no answer."
  - "Opening a dialog over another."
  - "Using the outline secondary in the footer."
  - "Confirming a destructive action with nph-dialog instead of nph-alert-dialog."
  - "Turning off the close button when the footer offers no way out."
sources:
  design_md: "design.md, color/dialog, color/dialog-foreground, color/dialog-separator, color/secondary-on-dialog, color/secondary-on-dialog-hover, overlay/scrim, elevation/modal, radius/overlay, space/overlay-padding, space/stack, space/stack-snug, space/inline-loose, layout/dialog-*, the motion roles and the md breakpoint of tokens_breakpoint"
  decision: "P87 — nph-dialog: API and semantics, 22-10-2026; D1 to D5 of DSA-44 pending with Indiane"
  tests: "src/components/nph-dialog/nph-dialog.test.ts and nph-dialog.docs.test.ts"
  usage_evidence: "pending — no approved screen consumes the dialog yet"
  storybook: "src/components/nph-dialog/nph-dialog.stories.ts and nph-dialog.docs.stories.ts, with the examples in nph-dialog.fixtures.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-dialog board 1368:27, frame 2277:2, set 2268:52262 and parts 2268:52091 and 2311:5339"
---

# nph-dialog

## Function

**The problem it solves:** blocks the page with a modal window, over the `overlay/scrim` veil,
until the person finishes or cancels a short task, such as editing a record, filling in a short
form or choosing an option.

**When to use:**

- A short task that needs an answer before going on: edit a record, fill in a short form, choose an option.
- Choose the size by the content, as the width ceiling: `sm` for a choice or a short confirmation
  without a destructive action, `md` for a short form, `lg` for a table, a long list or a
  two-column form.
- Turn on the lines with long content, such as a list or a table.
- Use stacked actions on a narrow screen.

**When NOT to use:**

- **To confirm a destructive action**, such as deleting or discarding — use `nph-alert-dialog`.
- **For a long flow** — it goes to a page.
- **For a notice that asks for no answer** — use a message on the page itself.
- **To open a dialog over another** — finish or close the first one.

## Variants

**By size:** `size` is **strictly** the width ceiling, never a fixed width. The dialog hugs its
content from `layout/dialog-min-width` (320) up to the ceiling.

| `size` | Ceiling | When to use |
|---|---|---|
| `sm` | `layout/dialog-sm` (400) | A choice or a short confirmation, without a destructive action |
| `md` | `layout/dialog-md` (560), the default | A short form |
| `lg` | `layout/dialog-lg` (720) | A table, a long list or a two-column form |

**By density:** `actions`. `inline`, the default, puts the buttons on the right, side by side, the
primary last. `stacked` puts them one per line below the `md` breakpoint (768), the primary on
top; at or above the breakpoint, it is inline. `inline` never stacks.

**Do not combine with:** a destructive action in `sm` — that is `nph-alert-dialog`.

## States

| State | Token | What changes for the person |
|---|---|---|
| Closed | `not_applicable` | The dialog is not shown and the page answers |
| Open | `color/dialog` over `overlay/scrim` | The window appears over the veil; the page behind it does not answer and does not scroll |

**Feedback and focus:** see Accessibility. The loading of an action is the `loading` state of the
`nph-button` in the footer, not a state of the dialog.

**Motion:** it enters on `motion/enter-duration` and leaves on `motion/exit-duration`, each with
its own curve, animating only the opacity of the window and of the veil. With reduced motion, the
duration is the one of `motion/hover-duration`.

**Business rule the piece carries:**

- Above `layout/dialog-max-height`, only the content scrolls; the header and the footer stay.
- The width hugs the content. Without the content area, the header text sets the width, up to the
  ceiling. In a window smaller than the dialog, it keeps `layout/margin-compact` from each edge.
- Esc and the close button ask to close: the dialog fires `nph-close` and closes unless the event
  is canceled. A click on the veil does not close it.

**Domain error states:** none.

## Opening and closing it

```html
<nph-dialog heading="Edit profile" description="Change how your name appears." close-label="Close">
  <!-- fields -->
  <nph-button slot="footer" severity="secondary" text="Cancel"></nph-button>
  <nph-button slot="footer" text="Save"></nph-button>
</nph-dialog>
```

- `open` is the only way to open and close it. The footer buttons belong to the consumer: Save
  and Cancel set `open` to `false` when the task ends.
- `nph-close` says that the person asked to close it, with Esc or with the close button. Cancel it
  with `preventDefault()` to keep the dialog open, for example while a form has unsaved changes.
- **Known limits.** The browser may refuse to hold a repeated Esc with no new activation by the
  person: the event then comes not cancelable and the dialog closes. The width hugs the content,
  so content whose width is a percentage (a field at `100%`) shrinks to its own size: give the
  content a width. A tooltip open inside the dialog, such as the one of an icon-only button with
  keyboard focus, takes the first Esc; the second one closes the dialog. The veil reads
  `overlay/scrim` from the scheme around the dialog, in browsers where the backdrop inherits from
  its element.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | A native `dialog` opened as modal (`role="dialog"`, `aria-modal`), in the top layer; the page is inert |
| Accessible name | The `heading` names it (`aria-labelledby`) and the `description` completes it (`aria-describedby`). The close button is named by `close-label` |
| Keyboard | Tab and Shift+Tab stay in the dialog. Esc asks to close it |
| Visible focus | On open, the focus goes to the first element with `autofocus`; otherwise to the first focusable element of the content, then of the footer, then to the close button, then to the window. On close, it goes back to the element that had it. The focus drawing is the one of `nph-button` and of each element |
| Contrast | Title and description pass 4.5:1 on `color/dialog` in both modes |
| Touch target | The close button, in `compact`, meets the minimum of 24 by 24; the footer buttons stay in `default` |
| Color is not the only signal | The title says the subject and the buttons say the actions |

## Relations

**Combines with:** `nph-button`, `nph-separator` and `nph-icon`.

**What is the parent:** none; the dialog opens over the page, in the top layer.

**What is the child:** the `nph-button` of the close button and of the footer, and the
`nph-separator` of the lines.

**Which block this piece complements:** none.

**Appears in layouts:** none.

**Responsibility boundary:** the dialog draws the window, the header, the lines and the place of
the content and of the footer, moves the focus and locks the page. The consumer writes the content
and the actions and opens and closes it with `open`. The `nph-alert-dialog` builds on the
`nph-dialog` without the close button.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Window | `color/dialog`, `color/dialog-foreground`, `radius/overlay`, `elevation/modal`, `space/overlay-padding` |
| Width | `layout/dialog-min-width`, `layout/dialog-sm`, `layout/dialog-md`, `layout/dialog-lg`; `layout/margin-compact` from the edge of a small window |
| Height | `layout/dialog-max-height` |
| Veil | `overlay/scrim` |
| Title | `text/heading-md` in `color/dialog-foreground` |
| Description | `text/body-md` in `color/muted-foreground`, at `space/stack-snug` from the title |
| Close button | `nph-button` secondary, ghost, compact, at `space/inline` from the title |
| Spaces | `space/stack` between header, line and content; `space/stack` plus `space/stack-snug` before the actions; `space/inline-loose` between the actions |
| Lines | `nph-separator` in `color/dialog-separator` |
| Solid secondary | `color/secondary-on-dialog` and `color/secondary-on-dialog-hover` |
| Motion | `motion/enter-*`, `motion/exit-*`; `motion/hover-duration` with reduced motion |

**Usage restrictions:** the dialog redefines, in the scope of its window, `color/secondary` and its
hover as `color/secondary-on-dialog` and its hover, so the solid secondary `nph-button` does not
disappear on `color/dialog` in dark mode; and `color/border`, on its own lines only, as
`color/dialog-separator`. No token gets a new value. `layout/dialog-content-sm`, `-md` and `-lg` are
the width of the default content part in Figma, not a rule of the code: the dialog hugs its content.
The `md` breakpoint is written as `48rem` in the media query, because a media query does not accept
a custom property (P87).

**AI hints:**

- Use `nph-dialog` for a short task that needs an answer before going on.
- Write the task or the question in `heading`: it is the name the screen reader reads.
- Put the fields in the default slot and the actions in the `footer` slot, the solid secondary
  first and the primary last.
- Use the solid secondary for Cancel, never outline.
- Use the primary in `loading` while the action finishes.
- To confirm a destructive action, choose `nph-alert-dialog`.
- Open and close it only through `open`, and listen to `nph-close`.

## Examples

**Recommended case:** a short form in `md`, the default size, with title, description, two fields
and the actions Cancel and Save.

**Alternative case:** a short confirmation in `sm`, with no content area, where the header text
sets the width; a wide content in `lg`, a list, with both lines on, where only the list scrolls.

## Anti-patterns

- **Do not use for a long flow** — it goes to a page.
- **Do not use for a notice that asks for no answer** — use a message on the page.
- **Do not open a dialog over another** — finish or close the first one.
- **Do not use the outline secondary in the footer** — the solid secondary is the system default.
- **Do not confirm a destructive action with nph-dialog** — use `nph-alert-dialog`.
- **Do not turn off the close button when the footer offers no way out.**

## Sources and decisions

- **The repository `design.md`:** the dialog colors, `overlay/scrim`, `elevation/modal`,
  `radius/overlay`, the spaces, the `layout/dialog-*` widths, the motion roles and the `md`
  breakpoint.
- **The decision that originated it:** P87, of 22-10-2026. D1 to D5 of DSA-44 are pending with
  Indiane; the highlight icon waits for D3.
- **Tests:** `src/components/nph-dialog/nph-dialog.test.ts` and `nph-dialog.docs.test.ts`.
- **Usage evidence:** pending — no approved screen consumes the dialog yet.
- **Storybook:** `src/components/nph-dialog/nph-dialog.stories.ts` and
  `nph-dialog.docs.stories.ts`, with the examples in `nph-dialog.fixtures.stories.ts`.
- **Figma:** `nph-dialog` board (`1368:27`), frame (`2277:2`), set `2268:52262` and parts
  `2268:52091` and `2311:5339` in `DS-IA-NEPHOS 5.0`.
