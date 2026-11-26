---
piece: nph-accordion
level: component
status: active
solves: >-
  A list of sections with a title that the person opens and closes in place to see the content of
  each one, without leaving the screen. Open, the content pushes down what comes below and covers
  nothing. It holds the items, the rule between them and the opening rule: several at once, or one
  at a time.
use_when:
  - "The screen has several supporting sections and the person reads one or a few at a time: the details of a record, frequently asked questions, filters in a side panel, the steps of a setup."
  - "Grouped, in the page body, for the details of a record or frequently asked questions."
  - "Separated, when each section is an independent block, such as the steps of a setup; with the single expansion when one step leads to the next."
  - "Flush, in a side panel or inside another container such as a card or a dialog, so two outlines do not add up."
  - "Multiple expansion when the person compares sections; single when the sections are a step-by-step."
  - "A start (icon, tile, avatar or image) to recognize the section at a glance, a tag for a short highlight and an end status for the progress."
do_not_use_when:
  - "For a single section: use nph-collapsible."
  - "For sections of the same weight seen one at a time: use nph-tabs."
  - "For content everybody needs to read: keep the essential open on the page."
  - "To hide an error, a warning or a pending required field in a closed item: show the pending item in text, in the description or in the end status."
  - "Inside another accordion: use sections with a title on the page."
  - "For an action in the trigger: the trigger is the only child of the heading, so the action goes inside the content, with nph-button."
api:
  appearance:
    type: enum
    values: [grouped, separated, flush]
    required: false
    default: grouped
    reflects: true
    constraint: >-
      The Figma property `aparencia`. grouped is one container with the soft
      outline, the corner, the shadow and a divider between items. separated is a block per item
      with space between the blocks and no divider. flush has no container, no outline, no padding and
      no shadow, with the divider between items. A value outside the list draws nothing and emits
      console.error in development.
  expansion:
    type: enum
    values: [multiple, single]
    required: false
    default: multiple
    reflects: true
    constraint: >-
      The Figma property `expansao`. multiple lets each item open and close alone.
      single closes the open item when another opens; the open item can also close, and all closed is
      allowed. The special cases of single are in the business rules. A value outside the list draws
      nothing and emits console.error in development.
  size:
    type: enum
    values: [compact, default, large]
    required: false
    default: default
    reflects: true
    constraint: >-
      The Figma property `tamanho`. It is the size of every item and never changes item by item: the
      accordion hands it to them. It changes the minimum height of the trigger and the size of the
      start media; in large the title takes text/label-lg. A value outside the list draws nothing and
      emits console.error in development.
  heading-level:
    type: number
    required: false
    default: "3"
    reflects: false
    constraint: >-
      The level of the heading that holds each trigger, a whole number from 1 to 6. The level comes
      from the page, so the default is 3. A value outside the range draws nothing and emits
      console.error in development.
  slot:
    type: slot
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The default slot holds the nph-accordion-item elements, one per section. Anything else is
      ignored and warned once in development. The minimum is one item.
  item.label:
    type: string
    required: true
    default: "empty"
    reflects: false
    constraint: >-
      The title of the section, already localized, and the first part of the accessible name of the
      trigger. It wraps. An item with no label is a mount: it draws nothing and says nothing, because
      the text may arrive after the first render.
  item.description:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      A short line under the title, a few words, already localized. It is read inside the name of the
      button, after the tag and before the status. A long description goes in the content, which is the
      default slot of the item. There is no property to say that a description is long: a description
      that does not fit in a few words belongs in the content.
  item.start:
    type: enum
    values: [icon, tile, avatar, image, status-success, status-warning, status-error, status-pending]
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The Figma start set, one type per list. icon is a light nph-icon, tile is a light nph-icon on a
      tonal box, avatar is an nph-avatar and image is an nph-image 1:1. The four status values draw
      circle-check, triangle-exclamation, circle-xmark and clock. Empty draws none. The start media is
      decorative. A value outside the list draws nothing and emits console.error in development.
  item.icon:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The core name of the nph-icon of the icon and tile starts, in the light weight; gear and folder
      when empty. Ignored with another start, and warned once in development. A name outside the core
      draws nothing and emits console.error in development.
  item.media-src:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The address of the photo of the avatar start, or of the picture of the image start. Ignored with
      another start, and warned once in development. The avatar with no photo shows the person icon;
      the picture is cropped 1:1 and should be exported at 2x.
  item.start-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The hidden text of a status start, already localized, such as Complete or Needs attention. It
      is read only when the item has no end status: with the end status the start icon is decoration.
      A status start with neither says nothing to a screen reader, and is warned once in development.
  item.tag:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      A short highlight next to the title, such as New or PRO, already localized. It is an nph-badge
      primary light, and part of the accessible name.
  item.status:
    type: enum
    values: [success, warning, error, pending]
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The end status, an nph-badge light of the tone of the status; pending is secondary. Always with
      text: it needs status-label. A value outside the list draws nothing and emits console.error in
      development.
  item.status-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The text of the end status, already localized. A status without it is not drawn, and is warned
      once in development.
  item.indicator:
    type: enum
    values: [end, start]
    required: false
    default: end
    reflects: true
    constraint: >-
      The Figma property `indicador`. end puts chevron-down after the status and it turns 180
      degrees on open. start puts chevron-right before everything, it turns 90 degrees to point
      down, and the open content lines up with the part after it. A value outside the list draws
      nothing and emits console.error in development.
  item.open:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The Figma property `aberto`, and the current state, as in the native details element. The item
      starts closed. The person changes it and nph-toggle says so; setting it from code changes the
      content and fires nothing. An item that is open from the first render does not animate.
  item.disabled:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The whole item is faded and the button is disabled: it leaves the Tab order and does not open.
      With open it is a whole locked section: the content stays in view under the same opacity. A
      disabled closed content is plain hidden, so the search of the page does not open what the
      person cannot.
  item.persistent:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      An open item the person cannot close, the APG case: the trigger takes aria-disabled="true" and
      stays in the Tab order, and the item keeps the plain open look with no opacity. It opens a
      closed item. It is not the locked section, which uses disabled.
  item.slot:
    type: slot
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The default slot of the item is the content, free: any piece goes inside it. It starts
      collapsible/content-padding-top below the trigger, with no indent for the start media. Actions
      such as Save stay inside it, with nph-button, never in the trigger.
  item.size:
    type: enum
    values: [compact, default, large]
    required: false
    default: default
    reflects: true
    constraint: "Set by the accordion on every item. Do not set it on an item."
  item.heading-level:
    type: number
    required: false
    default: "3"
    reflects: false
    constraint: "Set by the accordion on every item. Do not set it on an item."
  item.region:
    type: boolean
    required: false
    default: true
    reflects: false
    constraint: >-
      Set by the accordion on every item, as a property only. False drops role="region" from the
      content, when the multiple expansion holds more than six items. Do not set it on an item.
  nph-toggle:
    type: event
    required: false
    default: "not_applicable"
    reflects: false
    constraint: >-
      Fired by an item when the person opens or closes it, by click, Enter, Space, the search of the
      page or a link to an id inside it, with detail { open }, the state the item is in now. It
      bubbles and is composed, so the accordion and the page hear it. Setting open from code, and
      the items the single expansion closes, fire nothing.
variants:
  appearance:
    axis: appearance
    choose_when: "grouped in the page body; separated when each section is an independent block; flush in a side panel or inside another container."
    do_not_combine_with: ["grouped inside a card or a dialog, because two outlines add up"]
  expansion:
    axis: appearance
    choose_when: "multiple when the person compares sections; single in a step-by-step."
    do_not_combine_with: ["single with more than one item meant to stay open"]
  size:
    axis: size
    choose_when: "compact in a dense panel with a pointer; default when in doubt; large on a touch screen."
    do_not_combine_with: ["compact on a touch screen"]
states:
  rest:
    token: "collapsible/title-foreground, collapsible/description-foreground, collapsible/indicator-foreground, collapsible/icon-foreground"
    changes_for_user: "Open and closed are told apart by the direction of the indicator and by the content in view, not by color. The open item does not change its background."
  hover:
    token: "collapsible/trigger-background-hover"
    changes_for_user: "The trigger takes a pill with collapsible/trigger-radius, inset by the container padding in grouped and separated and full width in flush. Hover does not move the focus. An item that cannot change takes no hover."
  focus:
    token: "collapsible/focus-border, collapsible/focus-border-width, collapsible/focus-border-radius, collapsible/focus-halo, collapsible/focus-halo-width, collapsible/focus-halo-radius"
    changes_for_user: "For keyboard users, a border and a halo on the trigger, never on the container. The halo may cover the neighbor divider by 1 px; the border stays whole."
  disabled:
    token: "collapsible/disabled-opacity"
    changes_for_user: "The whole item is faded, does not open and leaves the Tab order. With open it is a locked section: the content and the status stay in view, faded. The divider and the block outline are the accordion and stay at full."
  open_that_does_not_close:
    token: "collapsible/title-foreground"
    changes_for_user: "The plain open look with no opacity. The trigger stays in the Tab order and says aria-disabled, and Enter, Space and click do nothing."
business_rules:
  - "The accordion keeps what few people read together. Each item starts closed; the page sets open on the ones that are the point of the screen."
  - "Open, the content pushes down what comes below and covers nothing. It closes on no outside click and on no Escape, and the focus stays on the trigger."
  - "The divider is between two items, never before the first or after the last, in grouped and flush. In separated there is no divider and the blocks are accordion/item-gap apart."
  - "Single expansion, more than one item open when it starts, or when it changes from multiple to single: the first item that cannot be closed by the person stays open, else the first in the document, and the others close, with a development warning."
  - "Single expansion, an item marked persistent when another opens: it closes and the mark moves to the item that opened, because the APG keeps one panel open and puts aria-disabled on its button. This follows from the APG, it is not its text."
  - "Single expansion, a locked section (open and disabled): the person did not open it and cannot close it, so the rule leaves it as it is and it does not count as the open item."
  - "With the multiple expansion and more than six items, the content of every item drops role=region, because that many landmarks crowd the page."
  - "One start type per list: the icon (16) and the tile, avatar or image (24 to 48) break the alignment of the titles. The four status icons count as one type."
  - "Show a pending item in text, in the description or in the end status. Never hide an error, a warning or a pending required field in a closed item."
  - "The accordion has no width of its own: it takes the width of its container. 560 is only the reading width of the Figma examples."
  - "Every text comes from the consumer, already localized: the piece writes no word of its own."
domain_errors:
  - "An appearance, expansion, size, heading-level, start, status or indicator outside its list, or an icon that is not a core name of nph-icon: the piece draws nothing and emits console.error in development, one per cause."
  - "An icon with a start that is not icon or tile, a media-src with a start that is not avatar or image, a status with no status-label, a status start with no end status and no start-label, more than one item open in the single expansion, and anything but an nph-accordion-item inside the accordion: the piece emits console.warn in development, one per cause."
tokens:
  container: "accordion/background, accordion/border, accordion/border-width, accordion/radius, accordion/padding, elevation/raised"
  divider: "accordion/divider, accordion/divider-spacing, border/width"
  separated: "accordion/item-gap"
  text: "accordion/title-gap, accordion/tag-gap, accordion/end-gap, collapsible/title-foreground, collapsible/description-foreground"
  start: "accordion/media-gap, accordion/tile-background, accordion/tile-foreground, accordion/tile-radius, accordion/tile-padding, accordion/tile-padding-compact, accordion/tile-icon-size, accordion/tile-icon-size-large, accordion/status-success-icon, accordion/status-warning-icon, accordion/status-error-icon, accordion/status-pending-icon, collapsible/icon-size, collapsible/icon-foreground"
  trigger: "collapsible/trigger-height, collapsible/trigger-height-compact, collapsible/trigger-height-large, collapsible/trigger-padding-x, collapsible/trigger-padding-y, collapsible/trigger-padding-y-compact, collapsible/trigger-gap, collapsible/trigger-radius, collapsible/trigger-background-hover"
  indicator: "collapsible/indicator-size, collapsible/indicator-foreground"
  content: "collapsible/content-padding-x, collapsible/content-padding-top, collapsible/content-padding-bottom, collapsible/content-gap"
  focus: "collapsible/focus-border, collapsible/focus-border-width, collapsible/focus-border-radius, collapsible/focus-halo, collapsible/focus-halo-width, collapsible/focus-halo-radius"
  state: "collapsible/disabled-opacity"
  motion: "collapsible/expand-duration, collapsible/expand-easing"
  typography: "text/label-md, text/label-lg, text/body-sm, text/body-md"
ai_hints:
  - "Use nph-accordion for several supporting sections the person reads one or a few at a time; for a single section use nph-collapsible, and for sections of the same weight seen one at a time use nph-tabs."
  - "Pick the appearance by the place on the screen: grouped in the page body, separated for independent blocks, flush in a side panel or inside another container."
  - "Pick the expansion by the task: multiple to compare, single for a step-by-step."
  - "Match the size to the other controls of the screen: large on a touch screen, compact in a dense panel with a pointer. Set it on the accordion, never on an item."
  - "Write short titles that differ from each other, because people find the section without opening all of them."
  - "Show a pending item in text: in the description, such as 2 fields left, or in the end status, such as Pending. Do not rely on color."
  - "Use one start type in a list: the icon or tile for a topic, the avatar for a person, the image for a product, the status icons for progress."
  - "Put the action, such as Save, inside the content with nph-button, never in the trigger."
  - "Set the heading-level from the page: the accordion is inside a section whose heading is the level above."
  - "Listen to nph-toggle to know what the person did; setting open from code fires nothing."
  - "Do not nest an accordion inside another one."
accessibility:
  semantics: "The accordion pattern of the WAI-ARIA APG, revised without arrows, Home or End. Each trigger is a button with aria-expanded and aria-controls, the only child of a heading whose level comes from the page. The content is a region labelled by the trigger, except in the multiple expansion with more than six items. The indicator and the start media are hidden from assistive technology."
  accessible_name: "The text inside the button, in the order of the parts: title, tag, short description, status. There is no aria-label on the button, which would hide that text. The long description goes in the content. A status start with no end status carries a hidden text, last in the name."
  keyboard:
    - "Tab and Shift+Tab go through the triggers in page order and through the focusable elements of the open content."
    - "Enter and Space open a closed item and close an open one; the focus stays on the trigger."
    - "Arrows, Home, End and Escape do nothing, and a click outside does not close anything: the content is part of the page."
    - "A disabled item leaves the Tab order. An open item that does not close stays in it."
  focus: "Keyboard only, on the trigger: a border of collapsible/focus-border-width in collapsible/focus-border and a halo outside it. The focus is on the trigger, not on the container. Closing from the page with the focus inside the content moves it to the trigger."
  contrast: "The title meets 4.5:1 on accordion/background and on the hover, in both themes. The description, the indicator and the start icon meet 4.5:1 and 3:1. The status icons meet 3:1. The tile icon meets 4.5:1 in light and the box is decoration in dark. The focus border meets 3:1 on the background and on the hover, in both themes; the known limit against the halo is the one of focus/border. The outline and the divider are decoration."
  color_alternative: "Open and closed are told apart by the direction of the indicator and by the content in view. A status is always text, in the end status or in the description; the start status icon only reinforces it."
invalid_combinations:
  - "An appearance, expansion, size, heading-level, start, status or indicator outside its list — the piece draws nothing."
  - "A status with no status-label — the status is not drawn."
  - "An icon that is not a core name of nph-icon — the item draws nothing."
  - "A size set on an item — the accordion overwrites it."
  - "More than one start type in the same list."
  - "An action, a link or a menu inside the trigger."
  - "An accordion inside another accordion."
  - "An error, a warning or a pending required field hidden in a closed item."
relations:
  combines_with: [nph-badge, nph-avatar, nph-image, nph-icon, nph-button]
  parents: ["a page section, a side panel, a card, a dialog or a step-by-step"]
  children: [nph-accordion-item, nph-badge, nph-avatar, nph-image, nph-icon, "any piece in the content slot of an item"]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Repeating the same title in several sections."
  - "Hiding an error, a warning or a pending required field in a closed item."
  - "Putting a strong outline on each item: use the grouped appearance, with a soft outline on one container, or the separated one."
  - "Using the compact size on a touch screen."
  - "Mixing start types in one list."
  - "Putting an action or a link in the trigger."
  - "Nesting an accordion."
  - "Using the grouped appearance inside a card or a dialog."
sources:
  design_md: "design.md, the accordion/* tokens, the collapsible/* tokens the item uses and the global focus/* tokens"
  decision: "P136 — nph-accordion and nph-accordion-item: API and semantics"
  tests: "src/components/nph-accordion/nph-accordion.test.ts and src/components/nph-accordion-item/nph-accordion-item.test.ts"
  usage_evidence: "no screen consumes it yet"
  storybook: "src/components/nph-accordion/nph-accordion.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-accordion documentation 7428:43770, set 7227:26169, item set 7227:26332, start set 7227:26993, root 7227:25867"
---

# nph-accordion

## Function

**The problem it solves:** keeps several supporting sections on one screen without making the person
read them all. The person opens the section that matters and the content pushes down what comes
below and covers nothing. The accordion holds the items, the rule between them and the opening rule.
It is made of two elements: `nph-accordion`, the container, and `nph-accordion-item`, one section.

**When to use:**

- The screen has several supporting sections and the person reads one or a few at a time: the
  details of a record, frequently asked questions, filters in a side panel, the steps of a setup.
- Grouped, in the page body. Separated, when each section is an independent block, with the single
  expansion when one step leads to the next. Flush, in a side panel or inside another container.
- Multiple expansion when the person compares sections; single in a step-by-step.
- A start (icon, tile, avatar or image) to recognize the section at a glance; a tag for a short
  highlight; an end status for the progress.

**When NOT to use:**

- **For a single section** — use `nph-collapsible`.
- **For sections of the same weight seen one at a time** — use `nph-tabs`.
- **For content everybody needs to read** — keep the essential open on the page.
- **To hide an error, a warning or a pending required field** in a closed item — show the pending
  item in text, in the description or in the end status.
- **Inside another accordion** — use sections with a title on the page.
- **For an action in the trigger** — the trigger is the only child of the heading; the action goes
  inside the content, with `nph-button`.

## Variants

| Variant | Values | Choose when |
|---|---|---|
| Appearance | `grouped` (default), `separated`, `flush` | `grouped` in the page body; `separated` for independent blocks; `flush` in a side panel or inside another container |
| Expansion | `multiple` (default), `single` | `multiple` to compare sections; `single` in a step-by-step |
| Size | `compact`, `default` (default), `large` | `compact` in a dense panel with a pointer; `default` when in doubt; `large` on a touch screen |
| Start of an item | `icon`, `tile`, `avatar`, `image`, `status-success`, `status-warning`, `status-error`, `status-pending` | One type per list: the icon or tile for a topic, the avatar for a person, the image for a product, the status icons for progress |
| Indicator of an item | `end` (default), `start` | `end` for the rest; `start` for filters and a tree-like reading |
| Parts of an item | description, tag, end status | The description for a few words that help to decide; the tag for a highlight; the status for the progress |

The appearance, the expansion and the size are the Figma properties `aparencia`, `expansao` and
`tamanho`. The start is the Figma start set `nph-accordion / início`.

**By density:** the size is the density: the minimum height of the trigger is 28 in `compact`, 36
in `default` and 44 in `large`, all above the 24 px of WCAG 2.5.8; the start media is 24, 32 and 40
(the image 24, 32 and 48). On a touch screen use `large`.

**Do not combine with:** the grouped appearance inside a card or a dialog; the compact size on a
touch screen; more than one start type in a list.

## States

| Part | State | Token | What changes for the person |
|---|---|---|---|
| Item | Rest | `collapsible/title-foreground`, `collapsible/description-foreground`, `collapsible/indicator-foreground` | Open and closed are told apart by the indicator and the content, not by color |
| Trigger | Hover | `collapsible/trigger-background-hover` | A pill on the trigger, inset by the container padding in grouped and separated, full width in flush |
| Trigger | Focus | `collapsible/focus-border`, `collapsible/focus-halo` | For keyboard users, a border and a halo on the trigger |
| Item | Disabled | `collapsible/disabled-opacity` | The whole item is faded, does not open and leaves the Tab order |
| Item | Open and disabled | `collapsible/disabled-opacity` | A whole locked section: the content, the indicator and the status stay in view, faded |
| Item | Open that does not close | `collapsible/title-foreground` | The plain open look; the trigger takes `aria-disabled` and stays in the Tab order |
| Indicator | Open | `collapsible/expand-duration`, `collapsible/expand-easing` | It turns 180 degrees at the end and 90 degrees at the start; it never swaps its weight |

In the Figma item set, `state` has the values `default`, `hover`, `foco` (focus) and `disabled`, and
`aberto` (open) is its own property. The states are exclusive there: a disabled item takes no hover
and no focus.

**Combined states (rule T11):** the accordion has no selected, checked or error state, so only rule
1 applies, by analogy.

- **Open + disabled:** the state stays under the opacity: the content stays in view, the indicator
  stays turned and the status stays in view, faded. It is only for a whole locked section.
- **Open that does not close:** it is not the open and disabled look. It has no opacity, and the trigger
  says `aria-disabled="true"`.
- **Error + disabled:** does not apply. The accordion has no error state; "error" is a status, in text.

**Feedback and focus:** focus shows only for keyboard users and is not removed. The focus stays on the
trigger on open and on close. When the lock does not explain itself, a text of the page, outside
the accordion and near the group, says why the section is locked.

**Movement:** the content grows and the indicator turns in `collapsible/expand-duration` with
`collapsible/expand-easing`, as the `nph-collapsible`. With reduced motion nothing moves.

**Business rule the piece carries:**

- Each item starts closed and keeps its state: the person changes `open`, `nph-toggle` says so, and
  the page may set it. Setting `open` from code fires nothing.
- It closes on no outside click and on no Escape: the content is part of the page.
- The divider is between two items, never before the first or after the last, in grouped and flush.
  In separated there is no divider, and the blocks are `accordion/item-gap` apart.
- **Single expansion, the cases the APG and Figma leave to the code:**
  1. More than one item open when it starts, or when it changes from multiple to single: the first
     item that the person cannot close stays open, else the first in the document, and the others
     close, with a development warning.
  2. An item marked `persistent` when another opens: it closes and the mark moves to the item that
     opened. It follows from the APG, which keeps one panel open and puts `aria-disabled` on its button; it is
     a deduction, not the text of the APG.
  3. A locked section (open and disabled): the rule leaves it as it is, and it does not count as the
     open item.
- With the multiple expansion and more than six items, every content drops `role="region"`.
- Closed content is `hidden="until-found"`, so the page search and a link to an id inside it find the
  text and open the item; in a browser with no support for it, the item that holds the `#id` of the
  address opens on load. A disabled closed content is plain `hidden`.
- Every text comes from the consumer, already localized: the piece writes no word of its own.

**Domain error states:** an invalid `appearance`, `expansion`, `size`, `heading-level`, `start`,
`status`, `indicator` or `icon` draws nothing and emits `console.error` in development, one per
cause. A property that does not apply, a status with no text and anything but an item inside the
accordion are warned once. An item with no `label` is a mount: nothing is drawn and nothing is said.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | The accordion pattern of the WAI-ARIA APG, revised with no arrows, Home or End. Each trigger is a `button` with `aria-expanded` and `aria-controls`, the only child of a heading (`role="heading"` with `aria-level`) whose level comes from the page, `3` by default. The content is a `region` labelled by the trigger, except with the multiple expansion and more than six items. The indicator and the start media are hidden from assistive technology |
| Accessible name | The text inside the button, in the order of the parts: title, tag, short description, status. No `aria-label` on the button, which would hide that text. The long description goes in the content. The start icon, tile, avatar and image are decorative (`aria-hidden`, empty alternative text). A status start is decorative only with the end status; without it, it carries a hidden text, last in the name |
| Keyboard | Tab and Shift+Tab go through the triggers and through the open content. Enter and Space open and close. The arrows, Home, End and Escape do nothing. A disabled item leaves the Tab order; an item that does not close stays in it |
| Focus | Keyboard only, on the trigger: a border and a halo, never on the container. The focus stays on the trigger on open and on close |
| Contrast | The title meets 4.5:1 on `accordion/background` and on the hover, in both themes; the description, the indicator and the start icon meet their ratio; the status icons meet 3:1; the focus border meets 3:1 on the background and on the hover, and the known limit against the halo is the one of `focus/border`. The outline and the divider are decoration: the trigger is recognized by its text and its indicator |
| Alternative to color | Open and closed are told apart by the direction of the indicator and by the content in view. A status is always text |
| Touch target | The trigger takes the whole width, 28, 36 or 44 high, all above 24. On a touch screen use `large` |
| Movement | The content grows and the indicator turns in `collapsible/expand-duration`; with reduced motion nothing moves, and the state, the focus and the content in view stay |
| Page search | Closed content with `hidden="until-found"` is found by the search of the page, which opens the item and fires `nph-toggle` |
| Known limits | (a) `hidden="until-found"` is not in every browser: where it is missing the item that holds the `#id` of the address opens on load and the search of the page does not open closed items. (b) The content grows by the rows of a grid, which animates height, as in `nph-collapsible` (DSA-78 D-3). (c) `aria-controls` is exposed through the id reference inside the shadow root of the item, which a browser without the element reflection of ARIA may not expose |

## Relations

**Combines with:** `nph-badge` for the tag and the end status, `nph-avatar` and `nph-image` for the
start media, `nph-icon` for the indicator, the icon, the tile and the status icons, and `nph-button`
and any other piece inside the content. The accordion controls the container, the divider, the space
between items and the opening rule. The item controls the trigger, the texts, the media, the tag,
the status, the indicator, the hover, the focus, the disabled state and the motion.

| Between | Space |
|---|---|
| container edge and items (grouped) | `accordion/padding` |
| item, divider, item (grouped and flush) | `accordion/divider-spacing` above and below the divider |
| block and block (separated) | `accordion/item-gap`, no divider |
| start and title | `accordion/media-gap` with tile, avatar and image; `collapsible/trigger-gap` with icon and status icon |
| title and tag | `accordion/tag-gap` |
| title and description | `accordion/title-gap` |
| status and indicator | `accordion/end-gap` at the end; `collapsible/trigger-gap` at the start |
| trigger and content | `collapsible/content-padding-top`, no divider |

**What is the parent:** a page section, a side panel, a card, a dialog or a step-by-step. In a card or a
panel use the flush appearance.

**What is the child:** `nph-accordion-item`, and what an item draws: `nph-badge`, `nph-avatar`,
`nph-image` and `nph-icon`, plus whatever the page puts in the content slot of an item.

**Which block this piece complements:** none yet. The accordion item becomes an instance of the
`nph-collapsible` after the adjustment of its own that brings the start media, the tag and the status to
it; until then the item is its own part, with the `collapsible/*` tokens bound directly, a temporary
exception to the token layers.

**Appears in layouts:** none yet.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Container | `accordion/background`, `accordion/border`, `accordion/border-width`, `accordion/radius`, `accordion/padding`, `elevation/raised` (grouped only) |
| Divider | `accordion/divider`, `accordion/divider-spacing`, `border/width` |
| Separated | `accordion/item-gap` |
| Text | `accordion/title-gap`, `accordion/tag-gap`, `accordion/end-gap`, `collapsible/title-foreground`, `collapsible/description-foreground` |
| Start | `accordion/media-gap`, `accordion/tile-*`, `accordion/status-*-icon`, `collapsible/icon-size`, `collapsible/icon-foreground` |
| Trigger | `collapsible/trigger-height`, `-height-compact`, `-height-large`, `-padding-x`, `-padding-y`, `-padding-y-compact`, `-gap`, `-radius`, `-background-hover` |
| Indicator | `collapsible/indicator-size`, `collapsible/indicator-foreground` |
| Content | `collapsible/content-padding-x`, `-padding-top`, `-padding-bottom`, `-gap` |
| Focus | `collapsible/focus-border`, `-border-width`, `-border-radius`, `collapsible/focus-halo`, `-halo-width`, `-halo-radius` |
| State | `collapsible/disabled-opacity` |
| Motion | `collapsible/expand-duration`, `collapsible/expand-easing` |
| Typography | `text/label-md` and `text/label-lg` (title), `text/body-sm` (description), `text/body-md` (content) |

**Usage restrictions:** the piece does not choose color, radius, size or typography: everything comes
from a token. The `accordion/title-gap`, `accordion/tile-padding` and `accordion/tile-padding-compact`
point straight to the core by decision. The text of the content slot is the product's and has no
component token. The divider is drawn by the accordion with `border/width` in `accordion/divider`, not
by `nph-separator`, whose line color is fixed at `separator/border`. The piece has no `::part` and no color
property.

**AI hints:**

- Use `nph-accordion` for several supporting sections the person reads one or a few at a time; for a
  single section use `nph-collapsible`, and for sections of the same weight seen one at a time use
  `nph-tabs`.
- Pick the appearance by the place on the screen and the expansion by the task.
- Match the size to the other controls of the screen, and set it on the accordion, never on an item.
- Write short, different titles; show a pending item in text, in the description or the end status.
- Use one start type in a list. Put the action inside the content, never in the trigger.
- Set `heading-level` from the page.
- Listen to `nph-toggle` to know what the person did; setting `open` from code fires nothing.
- Do not nest an accordion inside another one.

## Examples

**Recommended case:** the details of a contract, grouped: several sections open, a status icon at the
start of each and the status in text in the description.

**Alternative case:** the steps of a setup, separated, with the single expansion and the pending item
in text in the description and in the end status; the filters of a side panel, flush and compact,
with the indicator at the start and several sections open.

## Anti-patterns

- **Do not repeat the same title in several sections** — give each section a name that says its content.
- **Do not hide an error, a warning or a pending required field in a closed item** — show the pending
  item in text, in the description or the end status, or keep the field in view on the page.
- **Do not put a strong outline on each item** — use the grouped appearance, with a soft outline on one
  container, or the separated one, with a soft outline and space between the blocks.
- **Do not use the compact size on a touch screen** — use the large size, 44 px high.
- **Do not mix start types in one list** — the icon (16) and the tile, avatar or image (24 to 48)
  break the alignment of the titles.
- **Do not put an action, a link or a menu in the trigger** — the button is the only child of the heading.
- **Do not nest an accordion** — use sections with a title on the page.
- **Invalid combinations:** a value outside a list; a status with no text; a size set on an item; an icon
  that is not a core name.
- **Do not create without a decision:** an arrow-key navigation, a pressed state, an animation of the
  background, a free color, an action in the trigger.

## Sources and decisions

- **The repository `design.md`:** the `accordion/*` tokens, the `collapsible/*` tokens the item uses and
  the global `focus/*` tokens.
- **The decision that originated it:** P136.
- **Tests:** `src/components/nph-accordion/nph-accordion.test.ts` and
  `src/components/nph-accordion-item/nph-accordion-item.test.ts`.
- **Usage evidence:** no screen consumes it yet.
- **Storybook:** `src/components/nph-accordion/nph-accordion.stories.ts`.
- **Figma:** the `nph-accordion` documentation frame (`7428:43770`), the sets `7227:26169`, `7227:26332`
  and `7227:26993` and the root `7227:25867` in `DS-IA-NEPHOS 5.0`.
