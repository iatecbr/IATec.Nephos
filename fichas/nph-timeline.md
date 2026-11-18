---
piece: nph-timeline
level: component
status: active
solves: >-
  Shows a list of events in order, linked by a connector line, to follow the steps of a process
  and the state of each one, or the activity history of a record, with who did it and when. It
  records what happened and does not navigate.
use_when:
  - "The steps of a process in order, such as a request and its approval, with the state of each step: use the process type."
  - "The activity history of a record, from the most recent to the oldest, with who did it and when: use the history type, with the dot."
  - "Who did it matters: use the avatar marker. The type of the event matters: use the circle with an icon."
  - "A long history: show the most recent events and end the list with the Show more button."
  - "An event that asks for a next step: turn on the action below its text, such as See details."
  - "While the events load, show the loading state; with no events, show the empty state."
do_not_use_when:
  - "To lead the person through steps they click: use nph-stepper."
  - "For a history read in columns (date, who, what): use nph-table."
  - "For the tabs of a view or the place in a hierarchy: use nph-tabs or nph-breadcrumb."
  - "To show how much of a task is done with no named events: use nph-progress."
  - "For a feed that loads on scroll: the timeline loads by the Show more button and takes no role of feed."
  - "For rich content as the whole event: put an nph-card, base or section, in the slot below the text; never a clickable card in an item that has an action."
api:
  items:
    type: array
    required: true
    default: "empty list"
    reflects: false
    constraint: >-
      Property only. The events, in order, as a list of { id, title, description, who, when,
      datetime, status, marker, icon, avatar, typeLabel, action, actionDisabled }. title is
      required, already localized. id names the slot of the item and the item in the events; an
      item without id has no slot, and two items with the same id warn once. description is the
      line under the title. who and when make the meta line, who first and when after it, and when
      is the visible text, the date already formatted by the product, with the relative one if the
      product wants it. datetime is the machine value of when, the datetime of its time element; a
      when without datetime is plain text and warns once. status is neutral, completed, current,
      pending, error or warning, neutral by default; only the circle marker has a status, and on a
      dot or an avatar it is ignored and warned once. marker is dot, circle or avatar; without it
      the marker follows the type, circle on the process and dot on the history. icon is a core
      name of nph-icon, read on the neutral circle only: the icon of every other status is fixed,
      a check for completed, circle-xmark for error and triangle-exclamation for warning, current
      has a center dot and pending has no glyph. avatar is the photo address of the avatar marker;
      without it the avatar draws the person icon. typeLabel is hidden text that says the type of
      the event when the title does not. action is the label of a secondary ghost nph-button below
      the text; actionDisabled puts only that button under the disabled opacity and fires nothing.
      An empty list is a mount. A value that is not a list, an item that is not an object or has no
      title, or a status or marker outside the list draws nothing and emits console.error in
      development, one per cause.
  type:
    type: enum
    values: [process, history]
    required: false
    default: process
    reflects: true
    constraint: >-
      The Figma property `tipo`. process is the steps of a flow with the state of each one; history
      is the events of a record. It sets the marker an item takes when it names none, circle on the
      process and dot on the history, and the aria-current rule, and nothing else: the process and
      the history share one layout. Reflects so the consumer can style and check it. A value
      outside the list draws nothing and emits console.error in development.
  label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name of the list, already localized, such as Request history. It wins over the
      aria-label of the host. A list with no label, no aria-label and no labelledBy draws and warns
      once in development.
  aria-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name of the list when label is not given; label wins over it. It is read by a
      property whose attribute is aria-label, since a property called ariaLabel is the native ARIA
      reflection of the element.
  labelledBy:
    type: element
    required: false
    default: "none"
    reflects: false
    constraint: >-
      Property only. A visible title that names the list, given as an element: an id does not cross
      the shadow root, so the element becomes the ariaLabelledByElements of the list. It counts as
      an accessible name, so a list with only a labelledBy does not warn. Given with a label, the
      labelledBy wins, as the native aria-labelledby does over aria-label. It also names the list
      while it loads.
  has-more:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      Shows the ghost Show more button outside the list, after it, aligned to the marker column. The
      timeline loads nothing: the button fires nph-timeline-more, the product appends the earlier
      events at the end of items and sets has-more off on the last batch. On with no more-label
      draws the button with no text and warns once in development. Reflects so the consumer can
      style and check it.
  loading:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      Draws skeleton rows in place of the items, even when there are items, with aria-busy true on
      the list and the hidden word of loading-label written outside the hidden node. The rows are
      an avatar skeleton and two lines, repeated; the contract gives no number of rows and the code
      draws three (D-1). On with no loading-label draws and warns once in development. Reflects so
      the consumer can style and check it.
  live:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      Says the list gets events without the person acting, such as new events that come in at the
      start. On, a growth of the list is announced by new-label. Off, nothing is announced but the
      batch of Show more. On with no new-label warns once in development, since the new events are
      not announced. Reflects so the consumer can style and check it.
  completed-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The hidden text that opens a completed item, already localized, such as Completed. It is read
      by the screen reader and never drawn. A completed item without it draws and warns once in
      development.
  current-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The hidden text that opens the current item, already localized, such as Current step. Without
      it a current item draws and warns once in development.
  pending-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The visible word that says the item is waiting, already localized, such as Waiting. It opens
      the meta line of a pending item, before who. Without it a pending item draws and warns once
      in development.
  error-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The hidden text that opens an item with an error, already localized, such as Error. Without it
      an item with an error draws and warns once in development.
  warning-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The hidden text that opens an item with a warning, already localized, such as Warning. Without
      it an item with a warning draws and warns once in development.
  loading-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The word the screen reader hears while the list loads, already localized, such as Loading.
      The piece writes no word of its own.
  more-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The text of the Show more button, already localized, such as Show more events.
  new-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The announcement of new events, already localized, with the marker {count}, such as {count}
      new events. It is read when the list grows with live on and the person did not ask for it.
  loaded-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The announcement of the batch that came in after Show more, already localized, with the marker
      {count}, such as {count} earlier events loaded. It is read whether or not live is on.
  empty-heading:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The title of the empty state, already localized, drawn by nph-empty when there are no items
      and the list is not loading. Without it a list with no items draws nothing and warns once in
      development.
  empty-description:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The description of the empty state, already localized, optional.
  nph-timeline-action:
    type: event
    required: false
    default: "not_applicable"
    reflects: false
    constraint: >-
      The event the action of an item fires when the person activates it, with detail { index, id }:
      the position of the item from zero and its id, or null when it has none. It bubbles and is
      composed. The click is also the native click. A disabled action fires nothing.
  nph-timeline-more:
    type: event
    required: false
    default: "not_applicable"
    reflects: false
    constraint: >-
      The event Show more fires when the person activates it, with no detail. It bubbles and is
      composed. The product answers by appending the earlier events at the end of items.
  slot-by-id:
    type: "named slot"
    required: false
    default: "none"
    reflects: false
    constraint: >-
      A slot named as the id of an item, drawn below its text and its action, for rich content such
      as an nph-card. The timeline does not style what goes in it, and an empty slot adds no space.
      An item without id has no slot.
variants:
  type:
    axis: appearance
    choose_when: "process for the steps of a flow with the state of each one; history for the events of a record, from the most recent to the oldest."
    do_not_combine_with: ["a history read in columns"]
  marker:
    axis: appearance
    choose_when: "dot for the dense history; circle when the state or the type of the event matters, with the status or an icon; avatar when who did it matters."
    do_not_combine_with: ["a status other than neutral on a dot or an avatar", "an icon on a circle that is not neutral"]
  status:
    axis: state
    choose_when: "completed for what is done, current for where the process is, pending for what waits, error for what failed, warning for what needs attention, neutral for an event with no state."
    do_not_combine_with: ["status on a dot or an avatar", "more than one current item on the process type"]
states:
  neutral:
    token: "timeline/marker-background, timeline/marker-foreground, timeline/marker-radius, timeline/marker-icon-size, timeline/dot-background, timeline/dot-size, timeline/title-foreground"
    changes_for_user: "The circle is a tonal fill with the icon of the event in the strong tone; the dot is a small filled circle inside a marker box with no fill."
  completed:
    token: "timeline/marker-background-primary, timeline/marker-foreground-primary"
    changes_for_user: "A tonal circle with a check."
  current:
    token: "timeline/marker-background-primary, timeline/marker-foreground-primary, timeline/dot-size, text/label-md-strong"
    changes_for_user: "A tonal circle with a center dot and a stronger title. It has no glyph."
  pending:
    token: "timeline/marker-border-pending, timeline/marker-border-width, timeline/title-foreground-pending, timeline/description-foreground"
    changes_for_user: "A hollow circle with a thin outline, a muted title and the waiting word at the start of the meta line. The connector line below it keeps the neutral line color."
  error:
    token: "timeline/marker-background-error, timeline/marker-foreground-error, timeline/marker-border-error, timeline/marker-border-width"
    changes_for_user: "A circle in the error tones with a circle-xmark icon and a discreet outline."
  warning:
    token: "timeline/marker-background-warning, timeline/marker-foreground-warning, timeline/marker-border-warning, timeline/marker-border-width"
    changes_for_user: "A circle in the warning tones with a triangle-exclamation icon and a discreet outline."
  loading:
    token: "timeline/marker-size, timeline/content-gap, timeline/item-gap, timeline/text-gap, the tokens of nph-skeleton"
    changes_for_user: "Skeleton rows take the place of the items, hidden from assistive technology; aria-busy is true and the screen reader hears the loading word."
  empty:
    token: "the tokens of nph-empty"
    changes_for_user: "nph-empty takes the place of the list, with the title and the description from the context."
business_rules:
  - "The timeline records and does not navigate. The item has no interaction state: no hover, pressed, focus, selected or disabled. Its states are status values, one per item, and they do not combine. A disabled action keeps the item as it is."
  - "One tag, with the events in items, a property, and no child element. The ol, its li and aria-current live in one shadow root. Rich content goes in a slot named as the id of the item, which the timeline does not style."
  - "The marker follows the type: circle on the process, dot on the history, unless the item names one. Only the circle has a status; on a dot or an avatar the status is ignored and warned once in development. The icon is read on the neutral circle only."
  - "The connector line is an nph-separator vertical, whose thickness is border/width. It runs from the marker to the end of the item, a timeline/connector-gap away from each, and sits at half of the marker column, a whole pixel, with no transform. The last item has none. The item paints the separator in timeline/connector-border from its own CSS; the pending item writes nothing, so its line stays in color/border. The separator changes nothing."
  - "The text order is the title row, the description, the meta line, the action and the slot. The title row is as tall as the marker, so the title centers on it, and grows with two lines. Title and description wrap with no cut; the item grows and the line follows."
  - "The meta line is who, then when, with a middle dot between them, written by the piece as punctuation. On a pending item the waiting word comes first, then the middle dot and who. The date is a time element with the datetime the product gives."
  - "The status goes in the item text, since the marker is hidden from the screen reader: a hidden text at the start of the title for completed, current, error and warning; the waiting word is visible on pending; neutral has none. The type of the event, when the title does not tell it, is typeLabel, hidden, after the state."
  - "Show more: has-more shows the button after the list. It fires nph-timeline-more. The product appends the earlier events at the end of items and sets has-more off on the last batch. The button keeps the focus while there are more events; on the last batch it goes away and the focus moves to the first new item, a choice of Nephos, which takes tabindex -1 only while it holds the focus. If the focus was not on the button, nothing moves."
  - "The live region is aria-live polite and aria-atomic, outside the list. loaded-label is announced when the list grows after Show more; new-label when it grows with live on and the person asked for nothing. A non-breaking space alternates so the same text reads again. The first load, a shrink and a growth with live off announce nothing."
  - "aria-current step goes on the current item of the process type only, and on one item: with more than one current item the first takes it and the code warns. On the history, an item drawn as current has the current look and no aria-current."
  - "Loading replaces the items, even when there are some: the list has aria-busy true, one li with the hidden loading word outside the hidden node, and skeleton rows hidden from assistive technology. No items and not loading draws nph-empty in place of the list; with no empty-heading nothing is drawn and the code warns."
  - "A short list is valid: one event is one li in the named list, with no connector line. There is no ceiling on the number of items, since a long list ends in Show more."
  - "Every text comes from the consumer, already localized: the state texts, the waiting word, the loading word, the labels of Show more and of the announcements, and the title and the description of the empty state. The piece writes only the middle dot, which is punctuation."
  - "There is no transition and no animation, so there is nothing to reduce under reduced motion."
domain_errors:
  - "A type outside its list, an items that is not a list, an item that is not an object or has no title, or a status or marker outside its list: the timeline draws nothing and emits console.error in development, one per cause."
  - "A list with no accessible name, an item with a status that has no text for it, a when with no datetime, a status on a dot or an avatar, more than one current item, a repeated id, has-more with no more-label, live with no new-label, loading with no loading-label, or no items with no empty-heading: the timeline draws and warns once in development, since the texts may arrive after the first render."
tokens:
  marker: "timeline/marker-size, timeline/marker-radius, timeline/marker-icon-size, timeline/marker-background, timeline/marker-foreground, timeline/marker-background-primary, timeline/marker-foreground-primary"
  dot: "timeline/dot-size, timeline/dot-background"
  pending: "timeline/marker-border-pending, timeline/marker-border-width"
  error: "timeline/marker-background-error, timeline/marker-foreground-error, timeline/marker-border-error"
  warning: "timeline/marker-background-warning, timeline/marker-foreground-warning, timeline/marker-border-warning"
  connector: "timeline/connector-border, timeline/connector-gap"
  text: "timeline/title-foreground, timeline/title-foreground-pending, timeline/description-foreground, timeline/meta-foreground"
  layout: "timeline/content-gap, timeline/item-gap, timeline/text-gap, timeline/action-gap"
  thickness: "border/width, which the line takes from nph-separator"
  typography: "text/label-md, text/label-md-strong, text/body-md, text/caption"
ai_hints:
  - "Use nph-timeline for events in order that record what happened or where a process is; to lead the person through steps they click use nph-stepper, for a history in columns use nph-table, and for how much is done use nph-progress."
  - "Give items in order, each with a title; add who and when for the meta line, and give datetime with every when so the date is a time element."
  - "Choose the type by the content: process for the steps of a flow with the status of each step, history for the events of a record from the most recent to the oldest."
  - "Choose the marker by what matters: the dot for a dense history, the circle with a status or an icon for the state or the type of the event, the avatar for who did it. Only the circle takes a status."
  - "Give the list a label, an aria-label or a labelledBy, and the texts it owes: completed-label, current-label, pending-label, error-label and warning-label for the statuses that appear."
  - "For a long history set has-more with more-label, listen to nph-timeline-more, append the earlier events at the end of items and set has-more off on the last batch; give loaded-label."
  - "For events that arrive without the person acting set live with new-label, with {count}."
  - "Put an action on an item with action, and listen to nph-timeline-action, which carries the index and the id of the item."
  - "Put rich content in the slot named as the id of the item, and use an nph-card, base or section, never a clickable card in an item that has an action."
  - "Set loading with loading-label while the events load, and give empty-heading and empty-description for the list with no events."
accessibility:
  semantics: "An ordered list, ol and li, with a name and no role of its own: the APG has no timeline pattern and the Feed pattern does not apply, since the list loads by Show more and not on scroll. The marker and the connector line are aria-hidden. The status goes in the item text, as a hidden text at the start of the title. The date is a time with datetime. The current item of the process type carries aria-current step. Show more is outside the list, after it. A short aria-live polite region with aria-atomic, outside the list, announces the arrival of events. Loading sets aria-busy true on the list and the skeleton is aria-hidden, with the hidden word outside the hidden node. The empty state is nph-empty in place of the list, with no empty ol left."
  accessible_name: "The list: label, else the aria-label of the host; labelledBy, an element, names it by a visible title. An item: the hidden state text, the hidden type text, the title, the description and the meta line, in that order. The pending item says it is waiting by the visible waiting word. The action is named by its label. Show more is named by more-label."
  keyboard:
    - "Tab and Shift+Tab move through the actions in list order and then to Show more. The item, the marker, the line, the text and the date take no focus."
    - "The arrow keys do nothing: the list is not a composite widget."
    - "Enter and Space are those of the nph-button of the action and of Show more. The item answers no key."
    - "Esc does not apply: nothing opens."
  focus: "The timeline takes no focus of its own. The focus is that of the nph-button, by instance: its border and halo. Show more keeps the focus while there are more events. On the last batch the focus moves to the first new item, which takes tabindex -1 only while it holds it and draws no ring (D-2)."
  contrast: "The title, the description and the meta line meet 4.5:1 in both themes and every brand. The glyph of the marker meets 3:1 over its surface. The outline of the pending circle is the sign of the state and meets 3:1 over the background. The marker fill and the connector line are decorative. The outline of the error and warning circles is discreet and stays below 3:1 in light: the icon carries the meaning, and aligning that outline is a foundation question, not a decision of the piece."
  color_alternative: "Each status has its own sign besides color: a check on completed, a center dot and a stronger title on current, a hollow circle and the waiting word on pending, circle-xmark on error and triangle-exclamation on warning. The state is also written in the item text."
invalid_combinations:
  - "A type, status or marker outside its list — the timeline draws nothing."
  - "An items that is not a list, or an item that is not an object or has no title — the timeline draws nothing."
  - "A status other than neutral on a dot or an avatar — the status is ignored and warned once."
  - "An icon on a circle that is not neutral — the icon is ignored: the icon of every other status is fixed."
  - "More than one current item on the process type — the first takes aria-current, with a warning."
  - "A clickable nph-card in the slot of an item that has an action"
  - "A repeated id — the slot of the second item gets no content, with a warning."
  - "has-more with no more-label, live with no new-label, loading with no loading-label — drawn and warned once."
relations:
  combines_with: [nph-separator, nph-icon, nph-avatar, nph-button, nph-skeleton, nph-empty, nph-card]
  parents: ["a page, a panel or a card: the container gives the width", "a section with a visible title, which names the list through labelledBy"]
  children: ["nph-separator, nph-icon, nph-avatar, nph-button, nph-skeleton and nph-empty, drawn by the timeline", "nph-card, base or section, slotted by the consumer below the text of an item"]
  complements_block: []
  appears_in: ["the progress of a request and its approval", "the activity history of a record", "the history of a record by person or by type of event"]
anti_patterns:
  - "Using the timeline to lead the person through steps they click: use nph-stepper."
  - "Building a history in columns of date, who and what inside the timeline: use nph-table."
  - "Marking the state by color alone, without the circle, its icon or the center dot."
  - "Leaving the state out of the text: the marker is hidden from the screen reader."
  - "Using the timeline for a feed that loads on scroll, or giving it role feed."
  - "Putting a clickable nph-card in the slot of an item that has an action."
  - "Putting a status on a dot or an avatar."
  - "Leaving the list without a name."
  - "Writing the middle dot into who or when: the piece writes it between them."
sources:
  design_md: "design.md, the timeline/* tokens, the colors they point to, border/width and the straight aliases to the core"
  decision: "P132 — nph-timeline: API and semantics"
  tests: "src/components/nph-timeline/nph-timeline.test.ts, src/components/nph-timeline/nph-timeline.docs.test.ts"
  usage_evidence: "no screen consumes it yet; the accepted frame shows a declined approval process, a history by person with an action and a history by type of event"
  storybook: "src/components/nph-timeline/nph-timeline.stories.ts and src/components/nph-timeline/nph-timeline.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-timeline documentation frame 5237:3423, root 5226:2261, item set 5216:304 and list set 5216:701"
---

# nph-timeline

## Function

**The problem it solves:** shows events in order, linked by a connector line. The person sees where a
process is, or what happened to a record, who did it and when. It records and does not navigate. There is
no timeline pattern in the WAI-ARIA APG: the native ordered list applies, and the Feed pattern does not,
because the timeline loads by a button and not on scroll.

**When to use:**

- The steps of a process in order, such as a request and its approval, with the state of each step: use the
  process type.
- The activity history of a record, from the most recent to the oldest, with who did it and when: use the
  history type, with the dot.
- Who did it matters: use the avatar marker. The type of the event matters: use the circle with an icon.
- A long history: show the most recent events and end the list with the Show more button.
- An event that asks for a next step: turn on the action below its text, such as See details.
- While the events load, show the loading state; with no events, show the empty state.

**When NOT to use:**

- **To lead the person through steps they click** — use `nph-stepper`.
- **For a history read in columns (date, who, what)** — use `nph-table`.
- **For the tabs of a view or the place in a hierarchy** — use `nph-tabs` or `nph-breadcrumb`.
- **To show how much of a task is done with no named events** — use `nph-progress`.
- **For a feed that loads on scroll** — the timeline loads by the Show more button and takes no role of
  feed.
- **For rich content as the whole event** — put an `nph-card`, base or section, in the slot below the text;
  never a clickable card in an item that has an action.

**Limits (the cases the layout meets):**

- Minimum: one event, which is one item in the named list, with no connector line.
- Maximum and many items: the list has no ceiling and ends in Show more; the product appends the earlier
  events.
- Long text: the title and the description wrap and the item grows, with no cut and no ellipsis; the
  connector line follows the height of the item.
- Empty: `nph-empty` with the title and the description of the context. Loading: skeleton rows.
- Short window: the list has no scroll of its own; its height comes from its content, and it scrolls with
  the page or the container.

## Variants

| Variant | Values | Choose when |
|---|---|---|
| Type (`type`) | `process` (default), `history` | `process` for the steps of a flow with the state of each one; `history` for the events of a record, from the most recent to the oldest |
| Marker (`marker`, on the item) | `dot`, `circle`, `avatar` | `dot` for the dense history; `circle` when the state or the type of the event matters; `avatar` when who did it matters. Without it the marker is the circle on the process and the dot on the history |
| Status (`status`, on the item) | `neutral` (default), `completed`, `current`, `pending`, `error`, `warning` | `completed` for what is done, `current` for where the process is, `pending` for what waits, `error` for what failed, `warning` for what needs attention, `neutral` for an event with no state. Only the circle has a status |
| Content of an item | description, who and when, action, rich content | The description when the title is not enough; who and when on the meta line; the action when the event asks for a next step; the slot for an `nph-card` |

The type, the marker and the status are the Figma properties `tipo`, `marcador` and `estado`, with the
values `processo` (process) and `historico` (history); `ponto` (dot), `circulo` (circle) and `avatar`; and
`neutro` (neutral), `concluido` (completed), `atual` (current), `pendente` (pending), `erro` (error) and
`atencao` (warning). The connector line, the description and the action are the Figma booleans `trilho`,
`descrição` and `ação`: in code the line is drawn on every item but the last, the description comes from
`description` and the action from `action`. The icon of the event is not a property in Figma and is `icon`
in code.

**By size and density:** `not_applicable`. The timeline has a single size, a 24 px marker column, an 8 px
dot and a 16 px icon.

**Do not combine with:** a status other than `neutral` on a dot or an avatar; an `icon` on a circle that is
not neutral; more than one `current` item on the process type.

## States

| Part | State | Token | What changes for the person |
|---|---|---|---|
| Circle | Neutral | `timeline/marker-background`, `timeline/marker-foreground`, `timeline/marker-radius`, `timeline/marker-icon-size` | A tonal fill with the icon of the event in the strong tone |
| Dot | Neutral | `timeline/dot-background`, `timeline/dot-size` | A small filled circle inside a marker box with no fill |
| Circle | Completed | `timeline/marker-background-primary`, `timeline/marker-foreground-primary` | A tonal circle with a check |
| Circle | Current | `timeline/marker-background-primary`, `timeline/marker-foreground-primary`, `timeline/dot-size`, `text/label-md-strong` | A tonal circle with a center dot and a stronger title |
| Circle | Pending | `timeline/marker-border-pending`, `timeline/marker-border-width`, `timeline/title-foreground-pending` | A hollow circle with a thin outline, a muted title and the waiting word |
| Circle | Error | `timeline/marker-background-error`, `timeline/marker-foreground-error`, `timeline/marker-border-error` | The error tones, a circle-xmark icon and a discreet outline |
| Circle | Warning | `timeline/marker-background-warning`, `timeline/marker-foreground-warning`, `timeline/marker-border-warning` | The warning tones, a triangle-exclamation icon and a discreet outline |
| List | Loading | `timeline/content-gap`, `timeline/item-gap`, `timeline/text-gap`, the tokens of `nph-skeleton` | Skeleton rows in place of the items; `aria-busy` and the hidden word name the state |
| List | Empty | the tokens of `nph-empty` | `nph-empty` in place of the list |

In Figma the status is `estado` of the item set. The dot and the avatar have only the neutral one. The item
has no hover, pressed, focus, selected or disabled state: its states are status values.

**Combined states (rule T11):** the item has no interaction state, so statuses do not combine with each
other. The only piece with an interaction state is the action, the `nph-button`, which follows its own
rules inside it. A disabled action on an item of any status keeps the marker, the glyph, the connector line
and the colors of the item; only the button goes under the disabled opacity. Selected with disabled and
error with disabled do not apply to the item.

**Feedback and focus:** the timeline takes no focus. The focus is the one of the `nph-button` of the action
and of Show more, by instance. On the last batch of Show more, the focus moves to the first new item, which
takes `tabindex="-1"` only while it holds the focus and draws no ring. There is no transition and no
animation, because the accepted frame draws none, so there is nothing to reduce under reduced motion.

**Business rule the piece carries:**

- The timeline records and does not navigate; the item is not interactive and its text stays selectable.
- One tag, with the events in `items`. Rich content goes in the slot named as the `id` of the item.
- The marker follows the type unless the item names one, and only the circle has a status.
- The connector line is an `nph-separator` vertical, painted in `timeline/connector-border` by the item;
  the pending item leaves it in `color/border`; the last item has none.
- The meta line is who, then when, with a middle dot the piece writes; the pending item starts with the
  waiting word.
- Show more fires `nph-timeline-more` and loads nothing. On the last batch the button goes away and the
  focus moves to the first new item.
- `aria-current="step"` on the current item of the process type, on one item; never on the history.
- Every text comes from the consumer, already localized. The piece writes only the middle dot.

**Domain error states:** an invalid `type`, `items`, item, `status` or `marker` draws nothing and emits
`console.error` in development, one per cause. A missing accessible name or a missing text draws and warns
once in development.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | An ordered list, `ol` and `li`, with a name and no role of its own. The marker and the connector line are `aria-hidden`. The status goes in the item text, in a hidden text at the start of the title. The date is a `time` with `datetime`. The current item of the process type has `aria-current="step"`. Show more sits outside the list, after it. A short `aria-live="polite"` region with `aria-atomic`, outside the list, announces the arrival of events. Loading sets `aria-busy="true"` on the list, hides the skeleton and writes the word outside the hidden node. The empty state is `nph-empty` in place of the list |
| Accessible name | The list: `label`, else the `aria-label` of the host; `labelledBy`, an element, names it by a visible title. An item: the hidden state text, the hidden type text, the title, the description and the meta line, in that order. The pending item says it is waiting by the visible waiting word. The action is named by its label |
| Keyboard | Tab goes through the actions in list order and then to Show more. The item, the marker, the line, the text and the date take no focus. The arrow keys do nothing. Enter and Space are those of the `nph-button`. Esc does not apply |
| Focus | None of its own: the focus is that of the `nph-button`. Show more keeps the focus while there are more events; on the last batch the focus moves to the first new item, with `tabindex="-1"` while it holds it and no ring |
| Contrast | The title, the description and the meta line meet 4.5:1 in both themes and every brand. The glyph meets 3:1 over its surface. The outline of the pending circle meets 3:1 over the background. The marker fill and the connector line are decorative. The outline of the error and warning circles is discreet and stays below 3:1 in light: the icon carries the meaning, and aligning that outline is a foundation question |
| Alternative to color | A check on completed, a center dot and a stronger title on current, a hollow circle and the waiting word on pending, `circle-xmark` on error, `triangle-exclamation` on warning, and the state in the text |
| Touch target | The item is not clickable. The target is the action, an `nph-button` at `control/height-default` |
| Movement | There is no transition and no animation |

**Known limits:**

- The code draws three skeleton rows in the loading state, an avatar and two lines each; the accepted frame
  shows an avatar and a line with no number of rows (D-1).
- The first new item that takes the focus on the last batch of Show more draws no ring: the item takes no
  focus in the contract and no focus token exists for it (D-2).
- On the history type an item with the current status draws the current look, a center dot and a stronger
  title, with no `aria-current`; the contract denies the attribute and does not say what the look is (D-3).
- Loading replaces the items, even when the list has some.
- The connector line sits on a whole pixel at half of the marker column, so its center falls half a pixel
  off the center of the column; a percentage translate would blur the 1 px line.
- The outline of the error and warning circles stays below 3:1 against the background in light; the icon
  carries the meaning. Aligning the description of those two tokens is a foundation task.
- The first load, a shrink of the list and a growth with `live` off announce nothing; only Show more is
  always announced.
- Two items with the same `id` share one slot name: the slot of the second item gets no content.
- The list is a block that takes the width of where it lives and has no scroll of its own.

## Relations

**Combines with:** `nph-separator`, which draws the connector line; `nph-icon`, which draws the icon of the
circle; `nph-avatar`, which is the avatar marker; `nph-button`, which is the action and Show more;
`nph-skeleton`, which holds the place of the rows while loading; `nph-empty`, which says there are no
events; and `nph-card`, base or section, slotted for rich content. Each piece keeps its own color, focus and
state. The timeline changes none of them: the line color is written from the CSS of the item on the
separator it holds, the way `nph-card` paints its divider, and the separator does not change.

| Between | Space |
|---|---|
| the marker column and the text | `timeline/content-gap` |
| the items, as the bottom of each one | `timeline/item-gap` |
| title, description and meta line | `timeline/text-gap` |
| the text and the action | `timeline/action-gap` |
| the line and each marker, above and below | `timeline/connector-gap` |

**What is the parent:** a page, a panel or a card. The container gives the width and the background. A
section with a visible title names the list through `labelledBy`.

**What is the child:** `nph-separator`, `nph-icon`, `nph-avatar`, `nph-button`, `nph-skeleton` and
`nph-empty`, drawn by the timeline; and `nph-card`, base or section, slotted by the consumer below the text
of an item.

**Which block this piece complements:** none.

**Appears in the layouts:** the progress of a request and its approval, and the history of a record by
person or by type of event. None in a layout yet.

**Family:** a sequence of named steps — `nph-stepper` leads the person through steps they click and numbers
each one; `nph-timeline` records and does not navigate; `nph-progress` shows how much is done with no named
events.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Marker | `timeline/marker-size`, `timeline/marker-radius`, `timeline/marker-icon-size`, `timeline/marker-background`, `timeline/marker-foreground`, `timeline/marker-background-primary`, `timeline/marker-foreground-primary` |
| Dot | `timeline/dot-size`, `timeline/dot-background` |
| Pending circle | `timeline/marker-border-pending`, `timeline/marker-border-width` |
| Error circle | `timeline/marker-background-error`, `timeline/marker-foreground-error`, `timeline/marker-border-error` |
| Warning circle | `timeline/marker-background-warning`, `timeline/marker-foreground-warning`, `timeline/marker-border-warning` |
| Connector line | `timeline/connector-border`, `timeline/connector-gap`; the thickness is `border/width`, from `nph-separator` |
| Text | `timeline/title-foreground`, `timeline/title-foreground-pending`, `timeline/description-foreground`, `timeline/meta-foreground` |
| Layout | `timeline/content-gap`, `timeline/item-gap`, `timeline/text-gap`, `timeline/action-gap` |
| Typography | `text/label-md` (title), `text/label-md-strong` (current title), `text/body-md` (description), `text/caption` (meta line and the waiting word) |

**Usage restrictions:** the piece does not choose color, radius, size or typography: everything comes from
a token. Some tokens point straight to the core by recorded decision: the marker size, the dot size, the gap of
the connector line and the gap of the content. The glyph weight is `light` on every status and
never swaps. The pieces it draws keep their own tokens, and none of them is changed. The piece has no
`::part`, no color property and no form association; its one slot is the one named as the `id` of an item,
and it does not style what goes in it.

**AI hints:**

- Use `nph-timeline` for events in order that record what happened or where a process is; to lead the person
  through steps they click use `nph-stepper`, for a history in columns use `nph-table`, and for how much is
  done use `nph-progress`.
- Give `items` in order, each with a `title`; add `who` and `when` for the meta line, and give `datetime`
  with every `when`, so the date is a `time` element.
- Choose the type by the content: `process` for the steps of a flow with the status of each step, `history`
  for the events of a record, from the most recent to the oldest.
- Choose the marker by what matters: the dot for a dense history, the circle with a status or an `icon` for
  the state or the type of the event, the avatar for who did it. Only the circle takes a `status`.
- Give the list a `label`, an `aria-label` or a `labelledBy`, and the texts it owes: `completed-label`,
  `current-label`, `pending-label`, `error-label` and `warning-label`, for the statuses that appear.
- For a long history set `has-more` with `more-label`, listen to `nph-timeline-more`, append the earlier
  events at the end of `items` and set `has-more` off on the last batch; give `loaded-label`.
- For events that arrive without the person acting set `live` with `new-label`, with `{count}`.
- Put an action on an item with `action`, and listen to `nph-timeline-action`, which carries the `index` and
  the `id` of the item.
- Put rich content in the slot named as the `id` of the item, and use an `nph-card`, base or section, never
  a clickable card in an item that has an action.
- Set `loading` with `loading-label` while the events load, and give `empty-heading` and `empty-description`
  for the list with no events.

## Examples

**Recommended case:** the approval of a request, in the process type: a completed step, the current one and a
pending one, each with who and when, the pending one with the waiting word; the same process with a declined
step, in the error status. The history of a record, in the history type, with the dot, who and when on every
event, and Show more at the end.

**Alternative case:** a history by person, with the avatar marker and an action such as See details; a
history by type of event, with the neutral circle and an icon; an `nph-card` in the slot of an item; a list
that gets new events with `live`; a list while it loads, with `loading` and `loading-label`; a list with no
events, with `empty-heading` and `empty-description`.

## Anti-patterns

- **Do not use the timeline to lead the person through steps they click** — use `nph-stepper`.
- **Do not build a history in columns of date, who and what inside the timeline** — a history read in
  columns is a table, `nph-table`.
- **Do not mark the state by color alone** — use the circle with the icon of the state, or the center dot of
  the current item.
- **Do not leave the state out of the text** — the marker is hidden from the screen reader, so the state
  goes in the item text.
- **Do not use the timeline for a feed that loads on scroll, nor give it role feed** — it loads by the Show
  more button.
- **Do not put a clickable `nph-card` in the slot of an item that has an action** — the contract allows only
  a base or section card there.
- **Do not put a status on a dot or an avatar** — only the circle has one.
- **Do not leave the list without a name** — give `label`, `aria-label` or `labelledBy`.
- **Do not write the middle dot into `who` or `when`** — the piece writes it between them.
- **Invalid combinations:** a value outside a list, an `items` that is not a list, an item with no `title`,
  a status on a dot or an avatar, more than one current item, a repeated `id`.
- **Do not create or adapt without a decision:** a child element for the item, a hover or a click on the
  item, a role feed, an animation of the arrival of events, a token, a color property.

## Sources and decisions

- **The repository `design.md`:** the `timeline/*` tokens, the colors they point to, `border/width` and the
  straight aliases to the core.
- **The decision that originated it:** P132.
- **Tests:** `src/components/nph-timeline/nph-timeline.test.ts` and
  `src/components/nph-timeline/nph-timeline.docs.test.ts`.
- **Usage evidence:** no screen consumes it yet. The accepted frame shows a declined approval process, a
  history by person with an action and a history by type of event.
- **Storybook:** `Components/nph-timeline/Validation` (`src/components/nph-timeline/nph-timeline.stories.ts`)
  and `Components/nph-timeline/Docs` (`src/components/nph-timeline/nph-timeline.docs.stories.ts`).
- **Figma:** the documentation frame `5237:3423`, the root `5226:2261`, the item set `5216:304` and the list
  set `5216:701` in `DS-IA-NEPHOS 5.0`.
