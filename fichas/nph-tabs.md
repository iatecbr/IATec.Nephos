---
piece: nph-tabs
level: component
status: active
solves: >-
  Switches the content of a section of the same page: a list of tabs, each one showing one
  panel, so the person sees one part of the subject at a time without leaving the page.
use_when:
  - "To switch between parts of the same subject, on the same page, when the person sees one part at a time."
  - "Segmented: few tabs with short labels, inside a card or panel."
  - "Underline: the top of a page or section, and when there are many tabs; the tabs scroll when they do not fit."
  - "Tab button: a short bar that needs more weight, on top of a panel."
  - "Turn on the counter when each tab counts items; the icon, when labels look alike; the tag, to mark a new tab."
do_not_use_when:
  - "To go from one page to another: use nph-sidebar or nph-breadcrumb."
  - "For steps in sequence, with next and back: use nph-stepper."
  - "To switch the view of the same list: use nph-toggle-group."
  - "The segmented style with many tabs or long labels: use the underline."
  - "An icon on only some tabs: on every tab or on none."
api:
  tabs:
    type: array
    required: true
    default: "empty list"
    reflects: false
    constraint: >-
      Property only. The tabs, in order, as a list of { value, text, icon, counter,
      counterLabel, tag, disabled }. value is required and unique: it names the tab and the slot
      of its panel, so it is one word with no space. text is required, already localized, the
      label, on one line, one or two words. icon is optional, a core name of nph-icon, on every
      tab or on none. counter is optional, a whole number from zero up, and counterLabel is
      required with it: the hidden context text that goes into the accessible name, such as
      Pending, 12 items. tag is optional, one word, drawn as an nph-badge. disabled is optional
      and applies to the tab alone. The order inside a tab is fixed: icon, label, counter, tag.
      An empty list draws nothing and emits no error. A list that is not a list, or that breaks a
      rule above, draws nothing and emits console.error in development, one per cause.
  value:
    type: string
    required: false
    default: "empty"
    reflects: true
    constraint: >-
      The value of the active tab. There is always one active tab: without a value that names a
      tab, the first enabled tab is active and the piece writes its value, and a value that names
      no tab warns in development. The piece is the source of truth and writes value when the
      person activates a tab. Setting value from code changes the tab and fires nothing. An
      active tab that is disabled keeps the active look. Reflects so the consumer can style and
      check the state.
  variant:
    type: enum
    values: [segmented, underline, solid, light, outline]
    required: false
    default: "segmented"
    reflects: true
    constraint: >-
      The Figma `estilo`. segmented is the rail with a card on the active tab; underline is the
      line under the tabs; solid, light and outline are the tab button. Outside the list, the
      piece draws nothing and emits console.error in development. Reflects because the internal
      CSS selects on it.
  activation:
    type: enum
    values: [automatic, manual]
    required: false
    default: "automatic"
    reflects: true
    constraint: >-
      automatic: a tab becomes active when the arrows put the focus on it. manual: the arrows
      move the focus and only Enter, Space or a click activate, for a panel that is slow to load
      (APG). Outside the list, the piece draws nothing and emits console.error in development.
  label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name of the tab list, already localized. It wins over the aria-label of the
      host. A list with neither draws and warns once in development.
  aria-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name of the tab list when label is not given; label wins over it. It is read
      by a property whose attribute is aria-label, since a property called ariaLabel is the
      native ARIA reflection of the element.
  scroll-previous-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name and the balloon of the scroll arrow that goes toward the start of the
      underline list, already localized, such as Scroll tabs back. The arrow is an icon-only
      nph-button and needs a name. Without this or scroll-next-label, the arrows are not drawn
      and the piece warns in development; the list still scrolls by keyboard and by touch.
  scroll-next-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name and the balloon of the scroll arrow that goes toward the end of the
      underline list, already localized, such as Scroll tabs forward. Same rule as
      scroll-previous-label.
  slots:
    default: "none"
    named: "one per tab, named by the value of the tab: the panel of that tab. The piece draws the tabpanel around the slot."
  nph-tab-change:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      Fired on the host (bubbles, composed) only when the person activates a tab, with detail
      { value }, after value changed. Setting value from code fires nothing. A click on the
      active tab fires nothing. It is not nph-value-change, which nph-toggle-group already
      types with a list.
variants:
  segmented:
    axis: appearance
    choose_when: "Few tabs with short labels, inside a card or panel. It is the default."
    do_not_combine_with: ["many tabs or long labels: use underline", "scroll arrows: the piece does not scroll in this style"]
  underline:
    axis: appearance
    choose_when: "The top of a page or section, and when there are many tabs: the tabs scroll when they do not fit."
    do_not_combine_with: []
  solid:
    axis: appearance
    choose_when: "A short bar that needs more weight, on top of a panel, with the strongest mark on the active tab."
    do_not_combine_with: ["many tabs or long labels: use underline"]
  light:
    axis: appearance
    choose_when: "A short bar that needs more weight, on top of a panel, with a softer mark on the active tab."
    do_not_combine_with: ["many tabs or long labels: use underline"]
  outline:
    axis: appearance
    choose_when: "A short bar that needs more weight, on top of a panel, with a soft border on the active tab."
    do_not_combine_with: ["many tabs or long labels: use underline"]
  icon:
    axis: appearance
    choose_when: "When the labels look alike and an icon helps to tell them apart; on every tab or on none."
    do_not_combine_with: ["an icon on only some of the tabs", "an icon outside the core of nph-icon"]
  counter:
    axis: appearance
    choose_when: "When each tab counts items; the counter comes with its hidden context text."
    do_not_combine_with: ["a counter without counterLabel", "a counter that is not a whole number from zero up"]
  tag:
    axis: appearance
    choose_when: "To mark a new tab, with one short word."
    do_not_combine_with: ["a tag with more than one word"]
states:
  inactive:
    token: "tabs/item-foreground"
    changes_for_user: "The label and the icon in the muted color; in the tab button styles, no background and no border."
  hover:
    token: "tabs/item-foreground-hover"
    changes_for_user: "Segmented and underline: the label and the icon take the stronger color, and the underline shows a line in tabs/indicator-hover-color at tabs/indicator-width. Tab button: tabs/button-background-hover and tabs/button-foreground-hover. Hover only paints; it does not move the focus or activate."
  focus:
    token: "tabs/focus-border-color, tabs/focus-ring-color"
    changes_for_user: "For keyboard users, a border and a halo outside the tab, the same focus as nph-button, in every style."
  active:
    token: "tabs/item-foreground-active"
    changes_for_user: "Segmented: a card in tabs/item-background-active with elevation/subtle. Underline: a line in tabs/indicator-color at tabs/indicator-width. Solid: tabs/button-solid-background-active. Light: tabs/button-light-background-active. Outline: tabs/button-outline-background-active with a soft border in tabs/button-outline-border-color-active. The icon turns solid."
  active-focus:
    token: "tabs/focus-border-color, tabs/focus-ring-color"
    changes_for_user: "The active look with the focus border and the halo."
  disabled:
    token: "tabs/item-disabled-opacity"
    changes_for_user: "The whole tab faded; it takes no focus and no click, and it is skipped by the arrows."
  active-disabled:
    token: "tabs/item-disabled-opacity"
    changes_for_user: "The tab keeps the active look under the faded opacity."
  counter-inactive:
    token: "tabs/counter-background, tabs/counter-background-rail, tabs/counter-foreground"
    changes_for_user: "The counter of an inactive tab: tabs/counter-background outside the rail and tabs/counter-background-rail inside the segmented rail."
  counter-active:
    token: "tabs/counter-background-active, tabs/counter-foreground"
    changes_for_user: "The counter of the active tab, in a tone of the brand."
  scroll-arrow-disabled:
    token: "the disabled state of nph-button"
    changes_for_user: "At an end of the underline list, the arrow of that end is disabled, not hidden, so the list does not change width."
business_rules:
  - "There is always one active tab: the panel is never empty. Without a value that names a tab, the first enabled tab is active and the piece writes value."
  - "The piece is the source of truth of value: it writes value when the person activates a tab, and fires nph-tab-change only then. A change of value from code fires nothing."
  - "The tab list is a single Tab stop, on the active tab; when the active tab is disabled, on the first enabled tab. The next Tab goes to the panel."
  - "The left and right arrows move the focus to the previous and the next tab, wrapping around and skipping a disabled tab; in right-to-left writing the arrow that points to the end of the line goes to the next tab. Home and End go to the first and the last enabled tab."
  - "With automatic activation, a tab becomes active when the arrows put the focus on it; with manual activation, only Enter, Space or a click activate."
  - "A click or tap activates the tab and puts the focus on it. A click on the active tab does nothing. A disabled tab neither activates nor takes the focus. Hover only paints."
  - "Esc and a click outside do nothing: the list opens no layer, and after a tab change the focus stays on the tab."
  - "The panel of each tab is a slot named by the value of the tab. The piece draws a tabpanel for each tab, named by its tab and hidden while inactive, in the same root as the tab, since an ARIA reference does not cross a root. A panel with no item in the Tab order takes tabindex 0, decided by a selector list filtered by disabled, negative tabindex, hidden and inert, and searched inside the shadow roots of components."
  - "Only the underline style scrolls: when the tabs do not fit, each tab keeps its content width and the list scrolls, with an arrow at each end. The arrows are out of the Tab order and keep their name, because the arrow keys already scroll the list (D-5); the tab that receives the focus scrolls into view."
  - "Segmented and tab button do not scroll and do not wrap: the tabs share the width and a label that does not fit is cut with an ellipsis and a balloon. The usage rule asks for few tabs and short labels there."
  - "A label that does not fit is cut with an ellipsis and shows the whole text in an nph-tooltip, on hover and on keyboard focus. A label that is not cut has no balloon, and a disabled tab has none."
  - "Only color and background change when the active tab changes, and on hover, within tabs/indicator-duration: nothing slides. With reduced motion, nothing moves."
  - "The counter shows the number up to 99 and 99+ above it. The visible number is hidden from assistive technology and the accessible name carries the counterLabel of the consumer in full."
  - "The tag is an nph-badge, primary light; on the active light and outline tab button it turns primary solid, and on the active solid tab button it stays primary light."
  - "There is no disabled for the whole list: disabled belongs to each tab."
  - "Every text comes from the consumer, already localized: the piece writes no word of its own."
domain_errors:
  - "A variant or an activation outside its list: the piece draws nothing and emits console.error in development, one per cause."
  - "A tabs that is not a list; a tab that is not an object; a tab without value or without text; a repeated value: the piece draws nothing and emits console.error in development."
  - "An icon outside the core of nph-icon, or on only some of the tabs: the piece draws nothing and emits console.error in development."
  - "A counter that is not a whole number from zero up, or a counter without counterLabel: the piece draws nothing and emits console.error in development."
  - "A tag with more than one word: the piece draws nothing and emits console.error in development."
  - "Every tab disabled: the piece draws nothing and emits console.error in development."
  - "A value that names no tab: the first enabled tab is active and the piece warns in development."
  - "A list with no accessible name draws and warns once in development, because the name may arrive after the first render."
  - "An underline list that does not fit, without scroll-previous-label and scroll-next-label: the arrows are not drawn and the piece warns once in development."
tokens:
  list: "tabs/list-background, tabs/list-height, tabs/list-padding, tabs/list-gap, tabs/list-radius"
  tab: "tabs/item-height, tabs/underline-item-height, tabs/item-padding-x, tabs/item-padding-y, tabs/item-gap, tabs/item-radius"
  label: "text/label-md in tabs/item-foreground, tabs/item-foreground-hover and tabs/item-foreground-active, with no tabs token of its own"
  icon: "nph-icon at icon/size-sm, in the same color token as the label in every state"
  card: "tabs/item-background-active with elevation/subtle"
  underline: "tabs/underline-border-color, tabs/underline-border-width, tabs/indicator-color, tabs/indicator-width, tabs/indicator-hover-color"
  tab_button: "tabs/button-height, tabs/button-radius, tabs/button-background-hover, tabs/button-foreground-hover, tabs/button-solid-background-active, tabs/button-solid-foreground-active, tabs/button-light-background-active, tabs/button-light-foreground-active, tabs/button-outline-background-active, tabs/button-outline-foreground-active, tabs/button-outline-border-color-active, tabs/button-outline-border-width"
  counter: "tabs/counter-background, tabs/counter-background-rail, tabs/counter-background-active, tabs/counter-foreground in text/label-sm, tabs/counter-padding-x, tabs/counter-padding-y, tabs/counter-radius"
  disabled: "tabs/item-disabled-opacity"
  scroll: "tabs/scroll-gap, with the arrows from nph-button"
  motion: "tabs/indicator-duration"
  focus: "tabs/focus-border-color, tabs/focus-border-width, tabs/focus-ring-color, tabs/focus-ring-width, tabs/focus-radius, tabs/focus-border-radius, tabs/button-focus-radius, tabs/button-focus-border-radius"
ai_hints:
  - "Use nph-tabs to switch the content of one section of the same page; to go to another page use nph-sidebar or nph-breadcrumb, for steps in sequence use nph-stepper, and to switch the view of the same list use nph-toggle-group."
  - "Give tabs as a property, with a value and a text on each tab, and put each panel in a child with slot set to the value of its tab."
  - "Choose segmented for few tabs with short labels inside a card or panel, underline for the top of a page or section and for many tabs, and solid, light or outline for a short bar that needs more weight."
  - "Put an icon on every tab or on none; turn on the counter only when each tab counts items, and give counterLabel with it."
  - "Keep the labels to one or two words and the tag to one word, already localized."
  - "Listen to nph-tab-change to react to the choice; do not listen to click, and do not wait for an event when you set value from code."
  - "Give the list a label, or an aria-label, because it is the accessible name of the tab list."
  - "Choose manual activation only when a panel is slow to load."
  - "On an underline list that can scroll, give scroll-previous-label and scroll-next-label."
accessibility:
  semantics: "A tablist of native buttons with role tab, aria-selected and aria-controls, and a tabpanel for each tab, named by its tab with aria-labelledby, hidden while inactive. The icon is decorative and hidden from assistive technology. The scroll arrows are out of the Tab order and keep their name (D-5)."
  accessible_name: "The tab list: label, else the aria-label of the host. A tab: its label, followed by the counterLabel when there is a counter, and by the tag; the visible number is hidden from assistive technology. A cut label keeps the same name; the balloon is its description. The scroll arrows are named by scroll-previous-label and scroll-next-label."
  keyboard:
    - "Tab: enters the list on the active tab, the list being a single Tab stop; the next Tab goes to the panel. A panel with no focusable item takes the focus."
    - "Left and right arrows: move the focus to the previous and the next tab, wrapping around and skipping a disabled tab."
    - "Home and End: focus the first and the last enabled tab."
    - "Enter or Space: with manual activation, activate the focused tab."
    - "Esc: no action."
  focus: "Keyboard only: a border in tabs/focus-border-color of tabs/focus-border-width and a halo in tabs/focus-ring-color outside the tab, the same focus as nph-button, in every style. After a tab change, the focus stays on the tab."
  contrast: "The inactive label meets 4.5:1 over the rail and over the background, in light and dark. The label and the line of the active tab use the primary text color, which meets it in every brand, in light and dark. In the tab button, the label of the active tab meets it over its background. The counter number meets it at rest, in the rail and when active."
  color_alternative: "The active tab has a card (segmented), a line (underline) or a background (tab button), and the icon turns solid, besides the text color."
invalid_combinations:
  - "A variant or an activation outside its list — the piece draws nothing."
  - "A tabs that is not a list, a tab without value or without text, or a repeated value — a tab is named by its value and its panel by the same value."
  - "An icon on only some of the tabs, or outside the core of nph-icon — with icons every tab has its own, without icons none does."
  - "A counter that is not a whole number from zero up, or a counter without counterLabel — the number alone does not say what it counts."
  - "A tag with more than one word."
  - "Every tab disabled — the list needs one tab the person can activate."
  - "Scroll arrows in segmented, solid, light or outline — only the underline scrolls."
  - "A disabled for the whole list — disabled belongs to each tab."
relations:
  combines_with: [nph-badge, nph-icon, nph-button, nph-tooltip]
  parents: ["a card or panel, with the panel of the active tab right below the list", "the top of a page or section"]
  children: [nph-badge, nph-icon, nph-button, nph-tooltip]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Using tabs to go from one page to another: use nph-sidebar or nph-breadcrumb."
  - "Using tabs for steps in sequence, with next and back: use nph-stepper."
  - "Using tabs to switch the view of the same list: use nph-toggle-group."
  - "Using the segmented style, or the tab button, with many tabs or long labels: use the underline."
  - "Putting an icon on only some of the tabs."
  - "Leaving the list without a label or an aria-label."
  - "Leaving no tab active, or letting the panel be empty."
  - "Disabling every tab."
sources:
  design_md: "design.md, the tabs/* tokens, text/label-md, text/label-sm, icon/size-sm, elevation/subtle, state/disabled-opacity and the global focus/* tokens"
  decision: "P115 — nph-tabs: API and semantics"
  tests: "src/components/nph-tabs/nph-tabs.test.ts"
  usage_evidence: "no screen consumes it yet"
  storybook: "src/components/nph-tabs/nph-tabs.stories.ts and nph-tabs.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-tabs documentation frame 3483:11200, sets 3472:9192, 3472:8748 and 3472:8747"
---

# nph-tabs

## Function

**The problem it solves:** switches the content of a section of the same page. A list of tabs,
each one showing one panel, so the person sees one part of the subject at a time without
leaving the page. It does not replace page navigation (`nph-sidebar`, `nph-breadcrumb`), steps
in sequence (`nph-stepper`) or the switch of the view of the same list (`nph-toggle-group`).

**When to use:**

- To switch between parts of the same subject, on the same page, when the person sees one part
  at a time.
- Segmented: few tabs with short labels, inside a card or panel.
- Underline: the top of a page or section, and when there are many tabs; the tabs scroll when
  they do not fit.
- Tab button: a short bar that needs more weight, on top of a panel.
- Turn on the counter when each tab counts items; the icon, when labels look alike; the tag, to
  mark a new tab.

**When NOT to use:**

- **To go from one page to another** — use `nph-sidebar` or `nph-breadcrumb`.
- **For steps in sequence, with next and back** — use `nph-stepper`.
- **To switch the view of the same list** — use `nph-toggle-group`.
- **The segmented style with many tabs or long labels** — use the underline.
- **An icon on only some tabs** — on every tab or on none.

## Variants

| Variant | Values | Choose when |
|---|---|---|
| Style | `segmented`, `underline`, `solid`, `light`, `outline` | `segmented` for few tabs with short labels inside a card or panel, the default; `underline` for the top of a page or section and for many tabs; `solid`, `light` or `outline`, the tab button, for a short bar that needs more weight on top of a panel |
| Activation | `automatic`, `manual` | `automatic` by default; `manual` when the panel is slow to load |
| Icon | On every tab, or none | When the labels look alike |
| Counter | On any tab, with its context text | When each tab counts items |
| Tag | One word, on any tab | To mark a new tab |

The style is the Figma property `estilo`, with the values `segmentado`, `sublinhado`,
`botão solid`, `botão light` and `botão outline`. The icon is the Figma boolean `ícone início`,
the counter is `contador` and the tag is `tag`; in code, each one is read from the tab that has
it. The Figma property `abas` only says how many tabs the example shows: in use, the list takes
the tabs it needs. The Figma property `rolagem` is not a property in code: the underline list
shows the arrows by itself when the tabs do not fit.

**By size and density:** `not_applicable`. The piece has a single size, with the label in
`text/label-md`. It is horizontal only; there is no vertical list. The list fills its container
and the tabs share the width; in the underline style, when the tabs do not fit, each tab keeps
its content width and the list scrolls.

**Do not combine with:** an icon on only some of the tabs; a counter without its context text;
the segmented or tab button style with many tabs or long labels; scroll arrows outside the
underline style.

## States

| Part · state | Token | What changes for the person |
|---|---|---|
| Tab · inactive | `tabs/item-foreground` | The label and the icon in the muted color; in the tab button styles, no background and no border |
| Tab · hover | `tabs/item-foreground-hover`; underline `tabs/indicator-hover-color`; tab button `tabs/button-background-hover`, `tabs/button-foreground-hover` | The label and the icon take the stronger color; the underline shows a line at `tabs/indicator-width`; the tab button takes a background. Hover only paints |
| Tab · focus | `tabs/focus-border-color`, `tabs/focus-ring-color` | For keyboard users, a border and a halo outside the tab, in every style |
| Tab · active | `tabs/item-foreground-active` | Segmented: a card in `tabs/item-background-active` with `elevation/subtle`. Underline: a line in `tabs/indicator-color`. Solid, light and outline: the `tabs/button-*-background-active` and `tabs/button-*-foreground-active` of the style, and in outline a soft border in `tabs/button-outline-border-color-active`. The icon turns solid |
| Tab · active and focus | `tabs/focus-border-color`, `tabs/focus-ring-color` | The active look with the focus border and the halo |
| Tab · disabled | `tabs/item-disabled-opacity` | The whole tab faded; it takes no focus and no click, and the arrows skip it |
| Tab · active and disabled | `tabs/item-disabled-opacity` | The active look under the faded opacity |
| Counter · inactive | `tabs/counter-background`, `tabs/counter-background-rail`, `tabs/counter-foreground` | A pill after the label: `tabs/counter-background-rail` inside the segmented rail and `tabs/counter-background` outside it |
| Counter · active | `tabs/counter-background-active`, `tabs/counter-foreground` | The pill in a tone of the brand |
| Scroll arrow · at an end | The disabled state of `nph-button` | The arrow of that end is disabled, not hidden: the list keeps its width |

In the Figma set of the tab, the property `state` has the values `inativa`, `hover`, `foco`,
`ativa`, `ativa-foco` and `disabled`. In the Figma set of the counter, `tom` has the values
`repouso` (inactive, outside the rail), `repouso-trilho` (inactive, inside the rail) and `ativo`
(active).

**Combined states:** active and disabled keeps the active look under `tabs/item-disabled-opacity`;
active and hover keeps the active look; active and focus is the `ativa-foco` variant.

**Feedback and focus:** focus shows only for keyboard users and **is not removed**. The tab shows
a border and a halo outside it, the same two layers as `nph-button`. Hover and the change of the
active tab run on `tabs/indicator-duration` and change only color and background: nothing slides,
and with reduced motion nothing moves.

**Business rule the piece carries:**

- There is always one active tab, so the panel is never empty. Without a `value` that names a
  tab, the first enabled tab is active and the piece writes `value`.
- The piece is the source of truth of `value`. It writes `value` and fires `nph-tab-change` only
  when the person activates a tab; a change of `value` from code fires nothing, and a click on
  the active tab does nothing.
- The tab list is a single Tab stop, on the active tab, or on the first enabled tab when the
  active tab is disabled. The left and right arrows wrap around and skip a disabled tab; Home and
  End go to the ends.
- With `automatic` activation, a tab becomes active when the arrows put the focus on it. With
  `manual`, the arrows move the focus and only Enter, Space or a click activate.
- A disabled tab neither activates nor takes the focus. There is no disabled for the whole list.
- The panel of each tab is a slot named by the `value` of the tab. The piece draws the
  `tabpanel`, named by its tab and hidden while inactive, in the same root as the tab. A panel
  with no item in the Tab order takes `tabindex` 0, decided by a selector list of the elements that
  already take the Tab key, filtered by disabled, negative `tabindex`, hidden and inert, and searched inside the shadow roots of components.
- Only the underline style scrolls. Segmented and tab button do not scroll and do not wrap: the
  tabs share the width and a label that does not fit is cut with an ellipsis and a balloon.
- A label that does not fit is cut with an ellipsis and shows the whole text in an `nph-tooltip`.
  A label that is not cut has no balloon, and a disabled tab has none.
- The counter shows the number up to 99 and `99+` above it; the accessible name keeps the whole
  `counterLabel` of the consumer.
- Every text comes from the consumer, already localized: the piece writes no word of its own.

**Domain error states:** an invalid `variant`, `activation` or `tabs`, a tab that breaks its
rule, an icon outside the core or on only some of the tabs, a counter that breaks its rule, a tag
with more than one word, or every tab disabled draws nothing and emits `console.error` in
development, one per cause. An empty list draws nothing and emits no error. A `value` that names
no tab, a list with no accessible name, and an underline list that does not fit and has no names
for the arrows draw what they can and warn in development.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | A `tablist` of native buttons with `role="tab"`, `aria-selected` and `aria-controls`, and a `tabpanel` for each tab, named by its tab with `aria-labelledby` and hidden while inactive. The icon is decorative and hidden from assistive technology. Base: WAI-ARIA APG, Tabs pattern |
| Accessible name | The list: `label`, else the `aria-label` of the host. A tab: its label, followed by the `counterLabel` when there is a counter, such as "Pending, 12 items", and by the tag; the visible number is hidden from assistive technology. A cut label keeps the same name; the balloon is its description. The scroll arrows: `scroll-previous-label` and `scroll-next-label` |
| Keyboard | Tab enters the list on the active tab, and the next Tab goes to the panel; a panel with no focusable item takes the focus. The left and right arrows move the focus, with wrap, skipping a disabled tab. Home and End go to the first and the last enabled tab. With `manual` activation, Enter and Space activate the focused tab. Esc does nothing: the list opens no layer |
| Focus | Keyboard only: a border in `tabs/focus-border-color` and a halo in `tabs/focus-ring-color` outside the tab, the same focus as `nph-button`, in every style. After a tab change, the focus stays on the tab |
| Contrast | The inactive label meets 4.5:1 over the rail and over the background, in light and dark. The label and the line of the active tab use the primary text color, which meets it in every brand, in light and dark. In the tab button, the label of the active tab meets it over its background. The counter number meets it at rest, in the rail and when active |
| Alternative to color | The active tab has a card (segmented), a line (underline) or a background (tab button), and the icon turns solid, besides the text color |
| Touch target | The whole tab is the target, above the minimum target size, in every style. The scroll arrows are `nph-button` |
| Known limits | (a) `nph-tooltip` opens only on an element with `tabIndex` of 0 or more, and an inactive tab has -1: so the cut tab under the pointer takes `tabindex="0"` while the pointer is on it, and gets it back when the pointer leaves (D-1). (b) A panel with no focusable item takes `tabindex="0"` by a selector list of elements, not by a real test of the content: a panel whose focusable item the list does not know gets one more Tab stop. (c) Segmented and tab button cut the label with a balloon instead of scrolling; the usage rule asks for few tabs and short labels there (D-4). (d) The visible number above 99 becomes `99+` (D-3); the accessible name keeps the text of the consumer. (e) `nph-icon-button` has no sheet of its own: it is `nph-button` with an icon only (DSA-43), and the scroll arrows are `nph-button` with severity `secondary`, emphasis `ghost`, size `compact` and shape `square`; their names are text of the consumer (D-2). (f) In dark, the background of the active solid tab button stays below 3:1 against the page in some brands: an accepted limit, because the label marks the active tab. (g) The counter pill is decorative: over the hover of the tab button it almost disappears, and the number stays readable |

## Relations

**Combines with:** `nph-badge` (the tag), `nph-icon` (the icon of the tab), `nph-button`, in the
icon-only form (the scroll arrows) and `nph-tooltip` (the balloon of a cut label). The counter is
a piece of `nph-tabs` itself, not a tag of its own. The tab controls the color, the state and the
focus of the counter and of the tag.

**What is the parent:** a card or panel, with the list on top and the panel of the active tab
right below; or the top of a page or section. It does not replace the navigation menu, the
breadcrumb, the stepper or the toggle group.

**What is the child:** `nph-badge`, `nph-icon`, `nph-button` and `nph-tooltip`, drawn by the
piece. The panels are the content of the consumer, in the slots.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

**Space:** between tabs, `tabs/list-gap` in the segmented and tab button styles and none in the
underline; between icon, label, counter and tag, `tabs/item-gap`.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| List | `tabs/list-background`, `tabs/list-height`, `tabs/list-padding`, `tabs/list-gap`, `tabs/list-radius` |
| Tab | `tabs/item-height`, `tabs/underline-item-height`, `tabs/item-padding-x`, `tabs/item-padding-y`, `tabs/item-gap`, `tabs/item-radius` |
| Label and icon | `text/label-md`; `tabs/item-foreground`, `tabs/item-foreground-hover`, `tabs/item-foreground-active`; `icon/size-sm` in the same color token as the label |
| Card of the segmented tab | `tabs/item-background-active` with `elevation/subtle` |
| Underline | `tabs/underline-border-color`, `tabs/underline-border-width`, `tabs/indicator-color`, `tabs/indicator-width`, `tabs/indicator-hover-color` |
| Tab button | `tabs/button-height`, `tabs/button-radius`, `tabs/button-background-hover`, `tabs/button-foreground-hover`, `tabs/button-solid-background-active`, `tabs/button-solid-foreground-active`, `tabs/button-light-background-active`, `tabs/button-light-foreground-active`, `tabs/button-outline-background-active`, `tabs/button-outline-foreground-active`, `tabs/button-outline-border-color-active`, `tabs/button-outline-border-width` |
| Counter | `tabs/counter-background`, `tabs/counter-background-rail`, `tabs/counter-background-active`, `tabs/counter-foreground` in `text/label-sm`, `tabs/counter-padding-x`, `tabs/counter-padding-y`, `tabs/counter-radius` |
| Disabled | `tabs/item-disabled-opacity` |
| Scroll arrows | `tabs/scroll-gap`; the arrows keep the tokens of `nph-button` |
| Motion | `tabs/indicator-duration` |
| Focus | `tabs/focus-border-color`, `tabs/focus-border-width`, `tabs/focus-ring-color`, `tabs/focus-ring-width`; corners `tabs/focus-radius` and `tabs/focus-border-radius` in the segmented and underline styles, `tabs/button-focus-radius` and `tabs/button-focus-border-radius` in the tab button styles |

**Usage restrictions:** the piece does not choose color, radius, size or typography: everything
comes from a token. The label uses the `text/label-md` text style directly, with no `tabs/*`
token of its own, and the counter number uses `text/label-sm`. The tag is an `nph-badge` and the
scroll arrows are an `nph-button`: they keep their own tokens. The piece has no `::part`, no
color property, no form association and no vertical list. The event is `nph-tab-change`, not
`nph-value-change`, which `nph-toggle-group` already types with a list.

**AI hints:**

- Use `nph-tabs` to switch the content of one section of the same page; to go to another page
  use `nph-sidebar` or `nph-breadcrumb`, for steps in sequence use `nph-stepper`, and to switch
  the view of the same list use `nph-toggle-group`.
- Give `tabs` as a property, with a `value` and a `text` on each tab, and put each panel in a
  child with `slot` set to the `value` of its tab.
- Choose `segmented` for few tabs with short labels inside a card or panel, `underline` for the
  top of a page or section and for many tabs, and `solid`, `light` or `outline` for a short bar
  that needs more weight.
- Put an icon on every tab or on none; turn on the counter only when each tab counts items, and
  give `counterLabel` with it.
- Keep the labels to one or two words and the tag to one word, already localized.
- Listen to `nph-tab-change` to react to the choice; do not listen to `click`, and do not wait
  for an event when you set `value` from code.
- Give the list a `label`, or an `aria-label`, because it is the accessible name of the tab list.
- Choose `manual` activation only when a panel is slow to load.
- On an underline list that can scroll, give `scroll-previous-label` and `scroll-next-label`.

## Examples

**Recommended case:** the requests of a section, in a card, with the segmented style: "Pending"
with a counter, "Approved" and "Late", and the panel of the active tab right below the list.

**Alternative case:** an underline list at the top of a page, with an icon on every tab, a
counter and a tag on "New", and scroll arrows at both ends when the tabs do not fit; a tab button
bar on top of a panel, in solid, light or outline.

## Anti-patterns

- **Do not use tabs to go from one page to another** — use `nph-sidebar` or `nph-breadcrumb`.
- **Do not use tabs for steps in sequence** — use `nph-stepper`.
- **Do not use tabs to switch the view of the same list** — use `nph-toggle-group`.
- **Do not use the segmented style, or the tab button, with many tabs or long labels** — use the
  underline.
- **Do not put an icon on only some of the tabs** — on every tab or on none.
- **Do not leave the list without a name** — give `label` or `aria-label`.
- **Do not leave no tab active, and do not disable every tab** — the panel is never empty.
- **Invalid combinations:** a variant or an activation outside its list; a `tabs` that is not a
  list, a tab without `value` or `text`, or a repeated `value`; an icon outside the core or on
  only some of the tabs; a counter that is not a whole number from zero up or without
  `counterLabel`; a tag with more than one word; every tab disabled.
- **Do not create without a decision:** a vertical list, a disabled for the whole list, a slot
  for the label, a color property, a `::part`, an `nph-value-change` event, scrolling in a style
  other than the underline, or a token of the label.

## Sources and decisions

- **The repository `design.md`:** the `tabs/*` tokens, `text/label-md`, `text/label-sm`,
  `icon/size-sm`, `elevation/subtle`, `state/disabled-opacity` and the global `focus/*` tokens.
- **The decision that originated it:** P115.
- **Pending decisions:** D-1 to D-5 of the task DSA-71: the balloon of the cut tab through a
  temporary `tabindex` on hover, the text of the names of the scroll arrows, `99+` above 99,
  the cut label instead of the scroll in the segmented and tab button styles, and the scroll
  arrows that keep their name for the screen reader.
- **Tests:** `src/components/nph-tabs/nph-tabs.test.ts`.
- **Usage evidence:** no screen consumes it yet.
- **Storybook:** `src/components/nph-tabs/nph-tabs.stories.ts` and
  `nph-tabs.docs.stories.ts`.
- **Figma:** the `nph-tabs` documentation frame (`3483:11200`) and the sets `3472:9192`,
  `3472:8748` and `3472:8747` in `DS-IA-NEPHOS 5.0`.
