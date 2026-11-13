---
piece: nph-collapsible
level: component
status: active
solves: >-
  Opens and closes a block of content in the same place on the page: the detail few people need,
  such as advanced settings, a long note, the log of an import or the steps of a vertical
  step-by-step. Open, the content pushes down what comes below and covers nothing.
use_when:
  - "The detail goes away without changing the rhythm of the page, such as advanced settings in a form: the flush line."
  - "A block needs to stand out from the page, such as a summary section: the card appearance."
  - "Steps or levels, such as the vertical step-by-step: the indicator at the start."
  - "The detail sits below a paragraph or an action: the button type."
  - "A long text whose first part already helps, such as a log, a note or a description: the preview type."
  - "The title alone does not say what is inside: turn on the description."
do_not_use_when:
  - "For a group of sections with a rule between them, one open at a time: use the accordion."
  - "For a layer that floats over the page and closes on an outside click, or for an action menu: use nph-popover or nph-dropdown-menu."
  - "For a switch between panels of the same level: use nph-tabs."
  - "To hide an error, a warning or a pending required field in closed content: keep it in view, and in a closed step show the pending item in the description."
  - "For an outline on every row of a form: use the flush appearance and separate by space."
  - "For a trigger that is only a clickable icon, with no title and no chevron: use the line type."
api:
  type:
    type: enum
    values: [line, button, preview]
    required: false
    default: line
    reflects: true
    constraint: >-
      The Figma property `tipo`. line is the trigger as the whole row, with the title and the
      chevron. button is an nph-button, secondary ghost, in the default size, with the chevron at
      the end, to open details from an action. preview shows the content cut at three lines while
      closed and the nph-button below it opens the rest. A value outside the list draws nothing and
      emits console.error in development.
  appearance:
    type: enum
    values: [flush, card]
    required: false
    default: flush
    reflects: true
    constraint: >-
      The Figma property `aparencia`. flush has no background, no outline and no padding. card has
      the background, the outline, the corner and the padding of the card. A value outside the
      list draws nothing and emits console.error in development.
  indicator:
    type: enum
    values: [end, start]
    required: false
    default: end
    reflects: true
    constraint: >-
      The Figma property `indicador`. end puts chevron-down after the title, and it turns 180
      degrees on open. start puts chevron-right before the title, and it turns 90 degrees on open,
      to point down. Valid for the line type only: in button and preview the chevron is the one of
      the nph-button, so a value other than end is ignored and warned once in development. A value
      outside the list draws nothing and emits console.error in development.
  size:
    type: enum
    values: [compact, default, large]
    required: false
    default: default
    reflects: true
    constraint: >-
      The Figma property `size`. It changes the minimum height of the trigger, and in the large size
      the title takes text/label-lg. Valid for the line type only: button and preview use the
      nph-button in the default size, so a value other than default is ignored and warned once in
      development. A value outside the list draws nothing and emits console.error in development.
  open:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The Figma property `aberto`, and the current state, as in the native details element. The
      piece starts closed. The person changes it and nph-toggle says so; setting it from code
      changes the content and fires nothing. Reflects so the consumer can style and check it. A piece
      that is open from the first render does not animate.
  disabled:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The piece does not open or close, leaves the Tab order and is faded as a whole. Open and
      disabled keeps the content in view, faded. A disabled closed content is plain hidden, so the
      search of the page does not open what the person cannot.
  label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The title of the trigger, already localized, and its accessible name. In the button type it is
      the text of the nph-button; in preview, the text while closed, such as Show more. A piece with
      no label is a mount: it draws nothing and says nothing, because the text may arrive after the
      first render.
  open-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The text of the trigger while open, already localized, such as Show less. For the button and
      preview types; without it the text does not change. In the line type the title never changes
      when the content opens, so it is ignored and warned once in development.
  description:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The support line under the title, already localized. It is the accessible description of the
      trigger and not part of its name. For the line type only: in button and preview it is ignored
      and warned once in development.
  icon:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The start icon, a core name of nph-icon in the light weight, such as gear. Empty draws none.
      For the line type only: in button and preview it is ignored and warned once in development. A
      name outside the core draws nothing and emits console.error in development.
  slot:
    type: slot
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The default slot is the content, free: any piece goes inside it, such as text, fields,
      actions or an nph-skeleton while it loads. It starts at collapsible/content-padding-top below
      the trigger and has no component token for its text.
  nph-toggle:
    type: event
    required: false
    default: "not_applicable"
    reflects: false
    constraint: >-
      Fired when the person opens or closes the content, by click, Enter, Space or the search of the
      page, with detail { open }, the state the content is in now. It bubbles and is composed. Setting
      open from code fires nothing.
variants:
  type:
    axis: appearance
    choose_when: "line for a form or a settings list, where the trigger is the title of what opens; button when the detail sits below a paragraph or an action; preview for a long text whose beginning already informs."
    do_not_combine_with: ["indicator, size, description or icon with button or preview"]
  appearance:
    axis: appearance
    choose_when: "flush by default, separated by space; card when the block must stand out from the page."
    do_not_combine_with: ["an outline on every row of a form"]
  indicator:
    axis: appearance
    choose_when: "end for the rest; start for steps and levels, such as the vertical step-by-step."
    do_not_combine_with: ["button or preview"]
  size:
    axis: size
    choose_when: "compact on a dense screen, never for touch; default when in doubt; large for a touch target."
    do_not_combine_with: ["button or preview"]
states:
  rest:
    token: "collapsible/title-foreground, collapsible/description-foreground, collapsible/indicator-foreground, collapsible/icon-foreground"
    changes_for_user: "Open and closed are told apart by the direction of the chevron and by the content in view, not by color. Open does not change the background."
  hover:
    token: "collapsible/trigger-background-hover"
    changes_for_user: "The background of the trigger: the whole row in flush, a pill inside the card padding in the card. Hover does not move the focus and does not open."
  focus:
    token: "collapsible/focus-border, collapsible/focus-border-width, collapsible/focus-border-radius, collapsible/focus-halo, collapsible/focus-halo-width, collapsible/focus-halo-radius"
    changes_for_user: "For keyboard users, a border and a halo on the trigger, never on the whole card. In the button and preview types the focus is the one of the nph-button."
  disabled:
    token: "collapsible/disabled-opacity"
    changes_for_user: "The whole piece is faded and cannot be opened or closed. Open and disabled keeps the content in view, faded."
business_rules:
  - "The piece starts closed. It exists to keep what few people use."
  - "Open, the content pushes down what comes below and covers nothing. It does not flip, shrink or cut near the edge of the window."
  - "The whole trigger is clickable. The content starts collapsible/content-padding-top below it, so the focus halo does not touch the content."
  - "With the indicator at the start, or the start icon on, the open content indents to the title by the size of each part plus the gap."
  - "The preview type cuts the text at three lines while closed and shows it whole when open; it does not grow, and the button swaps its text and its chevron."
  - "The piece keeps its state: the person changes open, the event says so, and the page may set it. It closes on no outside click and on no Escape."
  - "A pending item in a closed step goes in the description, in text, such as 2 fields missing. Error, warning and a pending required field are not hidden in closed content."
  - "Several one under the other are separated by space/stack, in the same column and the same width, with no divider."
  - "Every text comes from the consumer, already localized: the piece writes no word of its own."
domain_errors:
  - "A type, appearance, indicator or size outside its list, or an icon that is not a core name of nph-icon: the piece draws nothing and emits console.error in development, one per cause."
  - "An indicator, size, description or icon in the button or preview type, or an open-label in the line type: the piece ignores it and emits console.warn in development, one per cause."
tokens:
  trigger: "collapsible/trigger-height, collapsible/trigger-height-compact, collapsible/trigger-height-large, collapsible/trigger-padding-x, collapsible/trigger-padding-y, collapsible/trigger-padding-y-compact, collapsible/trigger-gap, collapsible/trigger-radius, collapsible/trigger-background-hover"
  text: "collapsible/title-foreground, collapsible/title-gap, collapsible/description-foreground"
  icons: "collapsible/indicator-foreground, collapsible/indicator-size, collapsible/icon-foreground, collapsible/icon-size"
  content: "collapsible/content-padding-x, collapsible/content-padding-top, collapsible/content-padding-bottom, collapsible/content-gap, collapsible/preview-gap"
  card: "collapsible/card-background, collapsible/card-border, collapsible/card-border-width, collapsible/card-radius, collapsible/card-padding"
  focus: "collapsible/focus-border, collapsible/focus-border-width, collapsible/focus-border-radius, collapsible/focus-halo, collapsible/focus-halo-width, collapsible/focus-halo-radius"
  state: "collapsible/disabled-opacity"
  motion: "collapsible/expand-duration, collapsible/expand-easing"
  typography: "text/label-md, text/label-lg, text/body-sm, text/body-md"
ai_hints:
  - "Use nph-collapsible to keep the detail few people need; for a group of sections with a rule between them, one open at a time, use the accordion."
  - "Write the label with the name of what opens, such as Advanced settings, because people decide to open by the title."
  - "Leave it closed to begin with; set open only when the detail is what the screen is for."
  - "Turn the description on when the title is not enough to decide, and put a pending item of a closed step there, in text."
  - "Use the flush appearance and stack several at space/stack, with no divider; use the card only when the block must stand out."
  - "Use the indicator at the start for steps and levels; leave it at the end for the rest."
  - "For a trigger that is a button, use the button type with the label; for a long text, use preview with label and open-label. Do not set indicator, size, description or icon there."
  - "Listen to nph-toggle to know what the person did; setting open from code fires nothing."
  - "Never put an error, a warning or a pending required field in closed content."
accessibility:
  semantics: "The disclosure pattern of the WAI-ARIA APG. The trigger is a button with aria-expanded and aria-controls pointing to the content. The content has no role of its own. The indicator and the start icon are hidden from assistive technology."
  accessible_name: "The title. The description, when there is one, is the accessible description and not part of the name. In the button and preview types the name is the text of the nph-button."
  keyboard:
    - "Tab reaches the trigger. Closed, the content leaves the Tab order; open, Tab goes from the trigger into the content."
    - "Enter and Space open and close. The focus stays on the trigger, on open and on close."
    - "The arrow keys, Home, End and Escape do nothing, and a click outside does not close: the content is part of the page, not a layer over it."
    - "A disabled piece leaves the Tab order."
  focus: "Keyboard only, on the trigger: a border of collapsible/focus-border-width in collapsible/focus-border and a halo outside it. In the card the focus is on the trigger, not on the whole card. The halo is support; the border meets the contrast."
  contrast: "The title, the description and the content text meet 4.5:1 over the background and the card, in both themes. The indicator and the start icon meet 3:1. The focus border meets 3:1. The outline of the card is an area outline: WCAG 1.4.11 does not ask 3:1 of it."
  color_alternative: "Open and closed are told apart by the direction of the chevron and by the content in view, never by color. The hover background marks neither state."
invalid_combinations:
  - "An indicator, size, description or icon with the button or preview type — ignored with a warning."
  - "An open-label with the line type — ignored with a warning."
  - "A type, appearance, indicator or size outside its list — the piece draws nothing."
  - "An icon that is not a core name of nph-icon — the piece draws nothing."
  - "An error, a warning or a pending required field inside closed content."
  - "A group of sections with an opening rule between them — that is the accordion."
relations:
  combines_with: [nph-button, nph-icon]
  parents: ["a form, a settings list, a card or a step-by-step"]
  children: [nph-button, nph-icon, "any piece in the content slot"]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Hiding an error, a warning or a pending required field in closed content."
  - "Removing the indicator or leaving only a clickable icon."
  - "Using it for an action menu or a detail that floats over the page."
  - "Putting an outline on every row of a form."
  - "Putting a divider between stacked pieces: space already separates them."
  - "Putting interactive content in the preview type: the cut hides lines that a link or a button could sit in, and they stay in the Tab order."
  - "Starting open when the detail is not what the screen is for."
sources:
  design_md: "design.md, the collapsible/* tokens, the colors they point to and the global focus/* tokens"
  decision: "P121 — nph-collapsible: API and semantics"
  tests: "src/components/nph-collapsible/nph-collapsible.test.ts"
  usage_evidence: "no screen consumes it yet"
  storybook: "src/components/nph-collapsible/nph-collapsible.stories.ts and nph-collapsible.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-collapsible documentation 6014:1688, set 6006:2250, root 6005:482"
---

# nph-collapsible

## Function

**The problem it solves:** keeps the detail few people need out of the way, in the same place on
the page. The person opens it when the title says it is worth it, and the content pushes down what
comes below and covers nothing.

**When to use:**

- The detail goes away without changing the rhythm of the page, such as advanced settings in a
  form: the flush line.
- A block needs to stand out from the page, such as a summary section: the card appearance.
- Steps or levels, such as the vertical step-by-step: the indicator at the start.
- The detail sits below a paragraph or an action: the button type.
- A long text whose first part already helps, such as a log, a note or a description: the preview
  type.
- The title alone does not say what is inside: turn on the description.

**When NOT to use:**

- **For a group of sections with a rule between them**, one open at a time — use the accordion.
- **For a layer that floats over the page** and closes on an outside click, or for an action
  menu — use `nph-popover` or `nph-dropdown-menu`.
- **For a switch between panels of the same level** — use `nph-tabs`.
- **To hide an error, a warning or a pending required field** in closed content — keep it in view,
  and in a closed step show the pending item in the description.
- **For an outline on every row of a form** — use the flush appearance and separate by space.
- **For a trigger that is only a clickable icon** — use the line type, with the title and the
  chevron.

## Variants

| Variant | Values | Choose when |
|---|---|---|
| Type | `line` (default), `button`, `preview` | `line` in a form or a settings list; `button` when the detail sits below a paragraph or an action; `preview` for a long text whose beginning already informs |
| Appearance | `flush` (default), `card` | `flush` by default, separated by space; `card` when the block must stand out from the page |
| Indicator | `end` (default), `start` | `end` for the rest; `start` for steps and levels |
| Size | `compact`, `default` (default), `large` | `compact` on a dense screen, never for touch; `default` when in doubt; `large` for a touch target |
| Content of the trigger | description, start icon | The description when the title does not say enough to decide; the icon to mark a kind of detail |

The type, the appearance, the indicator and the size are the Figma properties `tipo` (`linha`,
`botao`, `previa`), `aparencia` (`flush`, `cartao`), `indicador` (`fim`, `inicio`) and `size`. Open
is `aberto`; the description and the start icon are Figma booleans of the trigger. The indicator
and the size are valid for the line type only: the button and preview types use the nph-button in
the default size, with its own chevron.

**By density:** the size is the density: `compact` is 28 high, `default` 36 and `large` 44, all
above the 24 px of WCAG 2.5.8. On a touch screen, prefer `default` or `large`.

**Do not combine with:** an indicator, size, description or icon with the button or preview type;
an open label with the line type.

## States

| Part | State | Token | What changes for the person |
|---|---|---|---|
| Trigger | Rest | `collapsible/title-foreground`, `collapsible/description-foreground`, `collapsible/indicator-foreground` | Open and closed are told apart by the chevron and the content, not by color |
| Trigger | Hover | `collapsible/trigger-background-hover` | The background of the trigger: the whole row in flush, a pill inside the card padding in the card. Hover does not move the focus and does not open |
| Trigger | Focus | `collapsible/focus-border`, `collapsible/focus-halo` | For keyboard users, a border and a halo on the trigger |
| Piece | Disabled | `collapsible/disabled-opacity` | The whole piece is faded and cannot be opened or closed |
| Chevron | Open | `collapsible/expand-duration`, `collapsible/expand-easing` | It turns 180 degrees at the end and 90 degrees at the start; it does not swap to solid |
| Content | Open | `collapsible/content-padding-*` | It grows in place and pushes down what comes below |

In the Figma set, `state` has the values `default`, `hover`, `foco` (focus) and `disabled`. In the
button and preview types, hover, focus and disabled are those of the `nph-button`.

**Combined states (rule T11):** the collapsible has no selected, checked or error state, so rules 1
and 2 do not apply directly.

- **Open + disabled:** by analogy with rule 1, the state stays under the opacity: the chevron
  stays turned and the content stays in view, faded.
- **A pending item in a closed step:** the trigger shows it in the description, in text, such as
  "2 fields missing"; the content stays closed until the person opens it.
- **Hover + open:** the open state does not change the background; hover paints it the same.
- The rule asks for no new token.

**Feedback and focus:** focus shows only for keyboard users and **is not removed**: a border of
`collapsible/focus-border-width` and a halo outside it, on the trigger. In the card the focus stays on
the trigger, not on the whole card. The focus stays on the trigger on open and on close; it does
not jump to the content. With forced colors, the trigger keeps an outline in the system color.

**Movement:** the content grows and the chevron turns in `collapsible/expand-duration` with
`collapsible/expand-easing`. With reduced motion, nothing moves. The preview type does not grow: a
cut of lines is not a size, so the cut is lifted and the text of the button changes.

**Business rule the piece carries:**

- The piece starts closed and keeps its state: the person changes `open`, `nph-toggle` says so,
  and the page may set it. Setting `open` from code fires nothing.
- It closes on no outside click and on no Escape: the content is part of the page.
- The content starts `collapsible/content-padding-top` below the trigger (8 px, not 4), so the
  focus halo does not touch it. With the indicator at the start or the start icon on, the content
  indents to the title by the size of each part plus the gap.
- Closed content is `hidden="until-found"`, so the page search finds the text inside it and opens
  the piece. A disabled closed content is plain `hidden`.
- Several one under the other are separated by `space/stack`, in the same column and the same
  width, with no divider.
- Every text comes from the consumer, already localized: the piece writes no word of its own.

**Domain error states:** an invalid `type`, `appearance`, `indicator`, `size` or `icon` draws
nothing and emits `console.error` in development, one per cause. A property that does not apply to
the type is ignored and warned once. No `label` is a mount: nothing is drawn and nothing is said.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | The disclosure pattern of the WAI-ARIA APG. The trigger is a `button` with `aria-expanded` and `aria-controls` pointing to the content, which has no role of its own. The indicator and the start icon are `aria-hidden` |
| Accessible name | The title. The description is the accessible description (`aria-describedby`), not part of the name. In the button and preview types the name is the text of the `nph-button` |
| Keyboard | Tab reaches the trigger. Closed, the content leaves the Tab order; open, Tab goes into it. Enter and Space open and close. The arrow keys, Home, End and Escape do nothing |
| Focus | Keyboard only, on the trigger: a border and a halo, never on the whole card. The focus stays on the trigger on open and on close. Closing from the page with the focus inside the content moves it to the trigger |
| Contrast | The title, the description and the content text meet 4.5:1 on `color/background` and on `color/card`, in both themes. The indicator and the start icon meet 3:1. The focus border meets 3:1 and the halo is support. The outline of the card is an area outline: WCAG 1.4.11 does not ask 3:1 of it |
| Alternative to color | Open and closed are told apart by the direction of the chevron and by the content in view. The hover background marks neither state |
| Touch target | The trigger takes the whole row, 28, 36 or 44 high, all above 24. The button and preview types take the target of the `nph-button` |
| Movement | The content grows and the chevron turns in `collapsible/expand-duration`; with reduced motion nothing moves, and the state color, the focus and the content in view stay |
| Page search | Closed content with `hidden="until-found"` is found by the search of the page, which opens the piece and fires `nph-toggle` |
| Known limits | (a) The `aria-expanded` of the button and preview types is written on the native button inside the shadow root of the `nph-button`, and `aria-controls` is its element reflection, because the `nph-button` hands `aria-expanded` to its native button only with `aria-haspopup`, which would draw the open look the accepted contract forbids here, and an id reference does not cross a shadow root; it depends on the `nph-button` keeping one native button. (b) The preview type holds text: a link or a button inside the cut part stays in the Tab order though its line is hidden. (c) The preview type shows its button even when the text has fewer than three lines. (d) The content grows by the rows of a grid, which animates height; the accepted contract asks for the growth. (e) In a browser without the element reflection of ARIA, the `aria-controls` of the button and preview types is not exposed |

## Relations

**Combines with:** `nph-button`, which is the trigger of the button and preview types, and
`nph-icon`, which draws the indicator and the start icon. Any piece goes inside the content: text,
fields, actions, `nph-skeleton` while it loads. The collapsible controls the chevron, the hover
background, the focus of the trigger and the open state; each piece of the content follows its own
color and focus rules.

| Between | Space |
|---|---|
| trigger and content | `space/stack-snug`, no divider |
| icon or indicator and title | `space/inline-tight` |
| title and description | `space/stack-snug` |
| items inside the content | `space/stack` |
| card border and trigger and content | `space/container-padding` |
| preview: text and button | `space/stack-tight` |
| one collapsible and the next | `space/stack`, same column and same width, no divider |

**What is the parent:** a form, a settings list, a card or a step-by-step. The container gives the
column and the width; the piece takes the width of where it lives.

**What is the child:** `nph-button` and `nph-icon`, drawn by the piece, and whatever the page puts
in the content slot.

**Which block this piece complements:** none yet. The accordion item becomes an instance of the
collapsible later, after both are accepted, and the vertical stepper is built on it in its own task.

**Appears in layouts:** none yet.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Trigger | `collapsible/trigger-height`, `collapsible/trigger-height-compact`, `collapsible/trigger-height-large`, `collapsible/trigger-padding-x`, `collapsible/trigger-padding-y`, `collapsible/trigger-padding-y-compact`, `collapsible/trigger-gap`, `collapsible/trigger-radius`, `collapsible/trigger-background-hover` |
| Text | `collapsible/title-foreground`, `collapsible/title-gap`, `collapsible/description-foreground` |
| Icons | `collapsible/indicator-foreground`, `collapsible/indicator-size`, `collapsible/icon-foreground`, `collapsible/icon-size` |
| Content | `collapsible/content-padding-x`, `collapsible/content-padding-top`, `collapsible/content-padding-bottom`, `collapsible/content-gap`, `collapsible/preview-gap` |
| Card | `collapsible/card-background`, `collapsible/card-border`, `collapsible/card-border-width`, `collapsible/card-radius`, `collapsible/card-padding` |
| Focus | `collapsible/focus-border`, `collapsible/focus-border-width`, `collapsible/focus-border-radius`, `collapsible/focus-halo`, `collapsible/focus-halo-width`, `collapsible/focus-halo-radius` |
| State | `collapsible/disabled-opacity` |
| Motion | `collapsible/expand-duration`, `collapsible/expand-easing` |
| Typography | `text/label-md` (title), `text/label-lg` (title, large), `text/body-sm` (description), `text/body-md` (content) |

**Usage restrictions:** the piece does not choose color, radius, size or typography: everything
comes from a token. The text of the content slot is the product's and has no component token. The
trigger of the button and preview types is an `nph-button` with its own tokens, focus and disabled
included, and the icons are `nph-icon`. The piece has no `::part` and no color property.

**AI hints:**

- Use `nph-collapsible` to keep the detail few people need; for a group of sections with a rule
  between them, one open at a time, use the accordion.
- Write the `label` with the name of what opens, such as "Advanced settings", because people decide
  to open by the title.
- Leave it closed to begin with; set `open` only when the detail is what the screen is for.
- Turn the `description` on when the title is not enough to decide, and put a pending item of a
  closed step there, in text.
- Use the flush appearance and stack several at `space/stack`, with no divider; use the card only
  when the block must stand out.
- Use the indicator at the start for steps and levels; leave it at the end for the rest.
- For a trigger that is a button, use the button type with the `label`; for a long text, use
  `preview` with `label` and `open-label`. Do not set `indicator`, `size`, `description` or `icon`
  there.
- Listen to `nph-toggle` to know what the person did; setting `open` from code fires nothing.
- Never put an error, a warning or a pending required field in closed content.

## Examples

**Recommended case:** the advanced settings of a form: the flush line, with the title "Advanced
settings", the start icon and the description, open, with the fields inside.

**Alternative case:** the steps of a sign-up form, flush, with the indicator at the start and the
pending item of a closed step in the description; the import log in the preview type, closed, with
"Show more" and "Show less"; the card appearance for a summary section; the button type below a
paragraph, with "Show details".

## Anti-patterns

- **Do not hide an error, a warning or a pending required field in closed content** — keep it in
  view, next to the field or the summary; in a closed step show it in the description, in text.
- **Do not remove the indicator or leave only a clickable icon** — use the line type, with the
  chevron and the whole trigger clickable.
- **Do not use it for an action menu or a detail that floats over the page** — use `nph-popover`
  or `nph-dropdown-menu`.
- **Do not put an outline on every row of a form** — use the flush appearance and separate by
  space.
- **Do not put a divider between stacked pieces** — space already separates them.
- **Do not put interactive content in the preview type** — the cut hides lines that a link or a
  button could sit in, and they stay in the Tab order.
- **Invalid combinations:** an `indicator`, `size`, `description` or `icon` with the button or
  preview type; an `open-label` with the line type; a value outside a list; an `icon` that is not a
  core name.
- **Do not create without a decision:** a trigger without a chevron, a divider, an animation of the
  background, a group with an opening rule (the accordion), a free color.

## Sources and decisions

- **The repository `design.md`:** the `collapsible/*` tokens, the colors they point to and the
  global `focus/*` tokens.
- **The decision that originated it:** P121.
- **Tests:** `src/components/nph-collapsible/nph-collapsible.test.ts`.
- **Usage evidence:** no screen consumes it yet.
- **Storybook:** `src/components/nph-collapsible/nph-collapsible.stories.ts` and
  `nph-collapsible.docs.stories.ts`.
- **Figma:** the `nph-collapsible` documentation frame (`6014:1688`), the set `6006:2250` and the
  root `6005:482` in `DS-IA-NEPHOS 5.0`.
