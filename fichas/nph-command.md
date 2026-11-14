---
piece: nph-command
level: component
status: active
solves: >-
  Gives the person one place to run an action or go to a page by name, from the keyboard, without
  leaving what they are doing: a dialog with a search field, the commands by group and a footer of
  keyboard hints.
use_when:
  - "A global shortcut of the product: actions and pages that the person knows by name, opened by keyboard."
  - "Use groups, such as Recent, Actions and Go to, when the list mixes kinds of command."
  - "Show the shortcut on the command when the action has its own key."
  - "Keep the footer of hints on, because it teaches the keys of the palette."
do_not_use_when:
  - "To pick the value of a form field: use nph-combobox."
  - "For the actions of a button or of a row of the screen: use nph-dropdown-menu."
  - "For the search of page content: it is a search field of its own."
  - "To put a divider between groups: use space and the group label."
api:
  items:
    type: array
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The entries of the list, in order, as the items of nph-dropdown-menu: a command with value and
      text, and optionally description, icon, severity (default or destructive), shortcut, count, tag
      and disabled; and a group label, an object with type label and text. The label opens a group,
      and a group with no command left while filtering disappears with its label. A separator, a
      selection, a switch, a submenu, a loading item and an avatar do not exist in the palette. An
      invalid entry is left out and emits console.error in development, one per cause. Not an
      attribute: it is set as a property.
  open:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The state of the dialog. The palette sets it to false itself when it closes, through Esc, a click
      on the veil, the open key or a command run, and follows the dialog if the dialog closes by another
      way. Each time it opens, the field is empty and the first command is active. Reflects because the
      consumer's selectors read it.
  query:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The typed text. The person types it; setting it from code writes it in the field and filters the
      list, and fires no event. It is emptied when the palette opens. Not an attribute.
  filter:
    type: enum
    values: [contains, none]
    required: false
    default: contains
    reflects: false
    constraint: >-
      Who filters. contains: the list keeps the commands whose text contains the typed text, with no
      difference of case or accent, the search of nph-combobox. none: the consumer filters the items
      itself, as a search that answers from a server, and the typed stretch is not highlighted. Any
      other value draws nothing and emits console.error in development.
  loading:
    type: boolean
    required: false
    default: false
    reflects: false
    constraint: >-
      The search is answering: the list shows the spinner and loading-label, the listbox is aria-busy and
      no command is drawn, active or run. When it goes back to false, the first command is active.
  label:
    type: string
    required: true
    default: "empty"
    reflects: false
    constraint: >-
      The name of the dialog and of the field, already localized, such as Command palette. Empty or only
      spaces draws nothing and emits console.error in development.
  placeholder:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: "The invitation in the empty field, already localized, such as Search a command."
  loading-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The text of the loading row, already localized, such as Searching. Required with loading: without
      it the row has the spinner and no text, and console.error says so in development. The property is
      loadingLabel.
  empty-heading:
    type: string
    required: true
    default: "empty"
    reflects: false
    constraint: >-
      The title of the nph-empty shown when nothing matches, already localized. Without it the empty
      state is not drawn and console.error says so in development. The property is emptyHeading.
  empty-description:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The hint of the nph-empty, already localized, with what to do. Empty draws the title only. The
      property is emptyDescription.
  results-label:
    type: string
    required: true
    default: "empty"
    reflects: false
    constraint: >-
      The sentence the screen reader hears with the number of results, already localized. {count} is
      replaced by the number, as in {count} results. It is announced in a polite region only after the
      person typed. Without it nothing is announced and console.error says so in development. The
      property is resultsLabel.
  hint-navigate:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The word of the first hint of the footer, already localized, next to the keys of the arrows. A hint
      without its word is not drawn, and console.error says so in development while the footer is shown.
      The property is hintNavigate.
  hint-open:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: "The word of the second hint, next to the Enter key, already localized. The property is hintOpen."
  hint-close:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: "The word of the third hint, next to the Esc key, already localized. The property is hintClose."
  hide-footer:
    type: boolean
    required: false
    default: false
    reflects: false
    constraint: >-
      Turns off the second line and the footer of hints, which are on by default; nothing else changes.
      The name is inverted because an HTML boolean attribute cannot turn off a default true. The property
      is hideFooter.
  global-shortcut:
    type: boolean
    required: false
    default: false
    reflects: false
    constraint: >-
      Listens to Ctrl+K and Command+K in the document and opens or closes the palette, keeping the key
      from the browser. Off by default: the shortcut belongs to the application. With the palette open,
      the key closes it whether this is on or not. The property is globalShortcut.
  nph-run:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      Fired when the person runs a command, by Enter or by a click, with detail value, the value of the
      command. It bubbles and crosses the shadow root. A disabled command never fires it. The palette then
      closes.
  nph-search:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      Fired when the person types, with detail query, the typed text. It bubbles and crosses the shadow
      root. Setting query from code never fires it. With filter none, it is how the consumer knows what to
      look for.
  nph-close:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      The event of the dialog the palette mounts, crossing its shadow root: fired before the palette closes,
      cancelable, with detail source escape, backdrop (a click on the veil), open-key or command-run. The
      palette does not fire it for itself.
variants: not_applicable
states:
  results:
    token: "command/background, color/primary-surface"
    changes_for_user: "The commands, with the first one active and filled; the default content."
  groups:
    token: "command/list-max-height, command/list-padding"
    changes_for_user: "Group labels open each group; with more than the ceiling, the list scrolls and the active command scrolls into view."
  search:
    token: "command/highlight-weight, color/muted-foreground"
    changes_for_user: "Only the commands that match, the typed stretch in a heavier weight, the rest muted, and the first one active."
  empty:
    token: "command/state-padding, space/container-padding"
    changes_for_user: "The nph-empty with a title and a hint, no active command; the footer stays."
  loading:
    token: "command/state-padding, command/status-gap, command/status-foreground"
    changes_for_user: "The spinner and the loading text; the list is busy and nothing runs."
  active:
    token: "color/primary-surface, color/accent-foreground"
    changes_for_user: "The command the keyboard or the pointer is on: filled, its icon solid, its label and shortcut in the accent color."
  disabled:
    token: "state/disabled-opacity"
    changes_for_user: "The command is dimmed, is skipped by the keys and the pointer and does not run."
  footer-off:
    token: "not_applicable"
    changes_for_user: "The second line and the hints are hidden; nothing else changes."
business_rules:
  - "The palette is a nph-dialog it draws itself, with the title for the screen reader only, no padding, no close button and a click on the veil that closes it. The consumer does not mount a dialog."
  - "On open, the focus goes to the field, the field is empty and the first command is active. On close it goes back to the element that had it."
  - "The keyboard focus never leaves the field. The active command is pointed to by aria-activedescendant."
  - "While typing, the first command that is not disabled is active, so Enter runs it without another key."
  - "Up and Down move the active command, skip a disabled command and stop at the ends, with no wrap. Home and End go to the first and the last. Enter runs the active command; with none active, it does nothing."
  - "Esc, a click on the veil, Ctrl+K or Command+K close the palette; a command run closes it too. Each reports its own source in nph-close."
  - "Tab and Shift+Tab stay on the field: it is the only stop of the dialog."
  - "The pointer over a command makes it active and the keyboard goes on from there. A touch does not move the active command."
  - "A group label never takes the focus nor becomes active. A group with no command left after the filter disappears with its label. There is no divider between groups."
  - "The width stays at command/max-width, down to the window less the distance the dialog keeps from each edge, so it does not jump while the list filters. In a short window the list shrinks and scrolls while the field and the footer stay."
  - "The palette writes no text of its own: every word comes from the consuming application, already localized. The keys of the footer, the arrows, Enter and Esc, are legends of keys."
domain_errors: []
tokens:
  panel: [command/background, command/radius, command/max-width, elevation/modal]
  lines: command/divider
  search_row: command/search-padding
  field: [control/height-large, radius/control, focus/border, focus/halo, color/background]
  list: [command/list-padding, command/list-max-height]
  highlight: [command/highlight-weight, color/muted-foreground]
  item: [color/popover-foreground, color/muted-foreground, color/primary-surface, color/accent-foreground, dropdown/item-hover-icon-foreground, state/disabled-opacity]
  item_destructive: [dropdown/item-destructive-foreground, dropdown/item-destructive-hover-background, dropdown/item-destructive-hover-foreground]
  group_label: [text/label-sm, color/muted-foreground]
  loading: [command/state-padding, command/status-gap, command/status-foreground]
  footer: [command/footer-padding, command/footer-gap, command/hint-gap, command/footer-foreground]
  enter_exit: "from nph-dialog"
ai_hints:
  - "Use nph-command as the global shortcut of the product, for actions and pages that the person knows by name."
  - "Give every text already localized: label, placeholder, empty-heading, empty-description, results-label, loading-label and the three hint words."
  - "Name each command with a verb and an object, such as Open settings, because the person searches by the action."
  - "Listen to nph-run to know which command ran. Do not close the palette yourself: it closes after nph-run."
  - "Open it with open, from your own button or shortcut, or turn on global-shortcut for Ctrl+K and Command+K."
  - "Write the shortcut of a command already for the platform, such as Command+N on a Mac: the palette writes no text."
  - "Use filter none and loading when the commands come from a server, and answer nph-search with new items."
  - "To pick the value of a field, choose nph-combobox; for the actions of a button, nph-dropdown-menu."
accessibility:
  semantics: "A modal dialog named by label. The field is a combobox, the list a listbox, each group a group named by its label and each command an option, selected while active. The shortcut is hidden from the screen reader."
  accessible_name: "label names the dialog and the field. A command is named by its content, which is what the person sees (the text, the description, the counter and the tag); the shortcut is hidden from the screen reader."
  keyboard:
    - "Ctrl+K or Command+K opens it, with global-shortcut, and closes it."
    - "Up and Down move the active command, Home and End go to the ends, Enter runs, Esc closes and gives the focus back, Tab stays on the field."
  focus: "The visible focus is the border and halo of the field, which keeps the focus all the time. The active command is marked by its fill, with no ring."
  contrast: "The label, the shortcut, the group label, the hints and the destructive command pass 4.5:1 on color/dialog in both modes, and the focus border of the field passes 3:1 in every brand; the semantic colors carry it, and the piece writes no override."
  color_alternative: "The active command changes its fill and its icon goes from light to solid. The searched stretch gains weight. The destructive command says the action in its label."
  announcements: "The number of results and the empty state are announced in a polite region after the person types; while loading, the listbox is busy."
invalid_combinations:
  - "An empty label: the palette has no name, so nothing is drawn."
  - "A filter other than contains or none: nothing is drawn."
  - "A separator, a selection, a switch, a submenu, a loading item or an avatar in items: the entry is left out."
  - "loading without loading-label: the row has the spinner and no text."
  - "A hint without its word: the hint is not drawn."
  - "A destructive command that is disabled: disabled wins and it does not run."
relations:
  combines_with: [nph-dialog, nph-input, nph-separator, nph-kbd, nph-empty, nph-spinner, nph-icon, nph-badge]
  parents: []
  children: [nph-dialog, nph-separator, nph-kbd, nph-empty, nph-spinner, nph-icon, nph-badge]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Using the palette to pick the value of a form field."
  - "Putting a divider between groups."
  - "Leaving the search without an active command: Enter would do nothing."
  - "Showing the empty state without the hint."
  - "Mounting your own nph-dialog around it."
sources:
  design_md: "design.md, the command group of tokens, color/dialog, color/dialog-separator, text/highlight-weight, radius/overlay, layout/max-list-height, layout/dialog-md, space/inline-tight, space/inline, space/container-padding, elevation/modal"
  decision: "P123 — nph-command: API and semantics, with the three options and the close origins it brings to nph-dialog; DSA-45, DSA-46, DSA-29 and DSA-44 for what it inherits"
  tests: "src/components/nph-command/nph-command.test.ts and nph-command.docs.test.ts; the options of the dialog in src/components/nph-dialog/nph-dialog.options.test.ts"
  usage_evidence: "pending — no approved screen consumes the palette yet; the first consumer is the search of the side menu"
  storybook: "src/components/nph-command/nph-command.stories.ts and nph-command.docs.stories.ts, with the examples in nph-command.fixtures.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-command documentation frame 6076:4910, root 6067:3610 and set 6068:3936"
---

# nph-command

## Function

**The problem it solves:** gives the person one place to run an action or go to a page by name, from
the keyboard, without leaving what they are doing. It is a dialog with a search field, the commands by
group and a footer of keyboard hints. The person opens it, types, sees only the commands that match and
runs one with Enter.

**When to use:**

- A global shortcut of the product: actions and pages that the person knows by name, opened by keyboard.
- Use groups, such as Recent, Actions and Go to, when the list mixes kinds of command.
- Show the shortcut on the command when the action has its own key.
- Keep the footer of hints on, because it teaches the keys of the palette.

**When NOT to use:**

- **To pick the value of a form field** — use `nph-combobox`.
- **For the actions of a button or of a row of the screen** — use `nph-dropdown-menu`.
- **For the search of page content** — it is a search field of its own.
- **To put a divider between groups** — use space and the group label.

## Variants

None. The set has no size and no variant property: what changes is the content, which follows what the
person types and what the consumer gives (see States). The one switch is `hide-footer`, which turns the
footer off.

## States

| State | Token | What changes for the person |
|---|---|---|
| Results | `command/background`, `color/primary-surface` | The commands, the first one active and filled. The default content |
| Groups | `command/list-max-height`, `command/list-padding` | Group labels open each group; above the ceiling the list scrolls and the active command scrolls into view |
| Search | `command/highlight-weight`, `color/muted-foreground` | Only what matches, the typed stretch heavier, the rest muted, the first command active |
| Empty | `command/state-padding` | The `nph-empty` with a title and a hint, no active command; the footer stays |
| Loading | `command/state-padding`, `command/status-gap`, `command/status-foreground` | The spinner and the text; the list is busy and nothing runs |
| Active | `color/primary-surface`, `color/accent-foreground` | Filled, the icon solid, the label and the shortcut in the accent color |
| Disabled | `state/disabled-opacity` | Dimmed, skipped by the keys and the pointer, never runs |
| Footer off | `not_applicable` | The second line and the hints are hidden |

**Combined states:** a destructive command that is disabled is disabled: it wins, it is dimmed and it does
not run. The palette marks no command and shows no error, so there is no other combination.

**Business rules the piece carries:**

- It draws its own `nph-dialog` and asks of it three options, each off by default for every other use:
  the title for the screen reader only, no padding and a click on the veil that closes it. It turns the
  close button off: Esc, Enter, the open key and a click on the veil are the ways out.
- The focus never leaves the field. Up and Down stop at the ends, with no wrap, and skip a disabled
  command. The first command is active while typing.
- The width stays at the ceiling while the list filters, so the panel does not jump.

**Domain error states:** none.

## Opening it and reading what happens

```html
<nph-command
  label="Command palette"
  placeholder="Search a command"
  empty-heading="No command found"
  empty-description="Check what you typed or search another term."
  results-label="{count} results"
  hint-navigate="navigate"
  hint-open="open"
  hint-close="close"
></nph-command>
```

```js
const palette = document.querySelector('nph-command');
palette.items = [
  { type: 'label', text: 'Actions' },
  { value: 'new', text: 'New document', icon: 'plus', shortcut: 'Command+N' },
];
palette.addEventListener('nph-run', (event) => run(event.detail.value));
palette.open = true;
```

- `open` is how the consumer opens it. `nph-close` says why it closed, with `detail.source`: `escape`,
  `backdrop`, `open-key` or `command-run`. Cancel it with `preventDefault()` to keep it open.
- `nph-run` says which command ran. The palette closes after it; do not close it yourself.
- Who listens to Ctrl+K and Command+K is the application by default. `global-shortcut` turns the listener
  on, and keeps the key from the browser.
- **Known limits.** The panel is centered in the window: the position near the top that the documentation
  recommends has no token for its offset. The palette has no submenu, nested pages, multiple selection or
  sizes. It has no scrollbar style of its own.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | A modal `dialog` named by `label`. The field is a `combobox`, the list a `listbox`, each group a `group` named by its label, each command an `option`. The shortcut is `aria-hidden` |
| Accessible name | `label` names the dialog and the field. A command is named by its content (the text, the description, the counter and the tag), so the visible words are in the name; the shortcut is hidden |
| Keyboard | Up, Down, Home, End, Enter and Esc as in the business rules; Tab stays on the field; Ctrl+K or Command+K closes it |
| Visible focus | The border and halo of the field, which keeps the focus. The active command is marked by its fill, with no ring |
| Contrast | The label, the shortcut, the group label, the hints and the destructive command pass 4.5:1 on `color/dialog` in both modes; the focus border of the field passes 3:1 in every brand |
| Announcements | The number of results and the empty state, in a polite region, after the person types. While loading, the listbox is `aria-busy` |
| Touch target | A command is 36 high at the width of the list and the field is 44; both pass the minimum of 24 by 24 |
| Color is not the only signal | The active command changes its fill and its icon goes from light to solid; the searched stretch gains weight |

## Relations

**Combines with:** `nph-dialog`, `nph-input`, `nph-separator`, `nph-kbd`, `nph-empty`, `nph-spinner`,
`nph-icon` and `nph-badge`.

**What is the parent:** none; it opens over the page, in the top layer, through the dialog.

**What is the child:** the `nph-dialog` it draws, the `nph-separator` of the two lines, the `nph-kbd` of the
hints, the `nph-empty`, the `nph-spinner`, the `nph-icon` of each command and the `nph-badge` of a tag.

**Which block this piece complements:** none.

**Appears in layouts:** none yet; the first consumer is the search of the side menu.

**Responsibility boundary:** the palette draws the window, the field, the list, the states and the footer,
moves the active command, reports what ran and why it closed. The consumer gives the commands and every
text, opens it, listens to `nph-run` and does what the command says. The field is drawn by the palette in
the look of the `nph-input` `large`, because `aria-activedescendant` does not cross a shadow root; it is not
the `nph-input` element.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Panel | `command/background`, `command/radius`, `command/max-width`, `elevation/modal`, no border |
| Lines | `nph-separator` in `command/divider` |
| Search row | `command/search-padding` around the field |
| Field | `control/height-large`, `radius/control`, `focus/border`, `focus/halo`, `color/background` |
| List | `command/list-padding`, `command/list-max-height` |
| Command | `color/popover-foreground`; the icon at rest in `color/muted-foreground`; active in `color/primary-surface`, the solid icon in `dropdown/item-hover-icon-foreground`, the label and the shortcut in `color/accent-foreground` |
| Destructive command | `dropdown/item-destructive-foreground`, `dropdown/item-destructive-hover-background`, `dropdown/item-destructive-hover-foreground` |
| Searched stretch | `command/highlight-weight`; the rest in `color/muted-foreground` |
| Group label | `text/label-sm` in `color/muted-foreground` |
| Loading row | `command/state-padding`, `command/status-gap`, `command/status-foreground`, `text/body-sm` |
| Footer | `command/footer-padding`, `command/footer-gap`, `command/hint-gap`, `command/footer-foreground`, `text/caption` |
| Motion | the entrance and the exit of `nph-dialog` |

**Usage restrictions:** the palette redefines, in its own scope, only `color/border`, on its two lines, as
`command/divider`, as the dialog does on its own lines. No token gets a new value and no token is created
here. The contrast of the destructive command and of the field focus border in dark is in the semantic
colors themselves, so the palette writes no local override.

**AI hints:**

- Use `nph-command` as the global shortcut of the product.
- Give every text already localized, including the three hint words and `results-label` with `{count}`.
- Name each command with a verb and an object.
- Listen to `nph-run`; do not close the palette yourself.
- Open it with `open`, or turn on `global-shortcut`.
- Write the shortcut of a command already for the platform.
- Use `filter="none"` with `loading` when the commands come from a server, and answer `nph-search`.
- To pick the value of a field, choose `nph-combobox`.

## Examples

**Recommended case:** open by key. Ctrl+K opens the palette with the commands by group, the first already
active, and Enter runs New document.

**Alternative case:** search. The person types `conf` and only what matches stays, the typed stretch in a
heavier weight and Open settings active. Nothing found: with `xyz` the empty state says nothing was found
and suggests another term; the footer stays.

## Anti-patterns

- **Do not use it to pick the value of a field** — it runs actions and does not fill a form. Use `nph-combobox`.
- **Do not put a divider between groups** — use space and the group label.
- **Do not leave the search without an active command** — Enter would do nothing; the first result stays active.
- **Do not show the empty state without the hint** — give the title and the description of the `nph-empty`.
- **Do not mount your own `nph-dialog` around it** — it already draws one.

## Sources and decisions

- **The repository `design.md`:** the command tokens, the dialog colors, `text/highlight-weight`,
  `radius/overlay`, `layout/max-list-height`, `layout/dialog-md`, the spaces and `elevation/modal`.
- **The decision that originated it:** P123. It also records the options and the close origins the dialog
  gained, as an amendment of P87.
- **Inherited:** DSA-29 (one line per label, the ceiling and the padding of the list), DSA-45 (the pointer
  makes the command active, the solid icon on highlight), DSA-46 (the searched stretch, the first result
  active) and DSA-44 (the dialog).
- **Tests:** `src/components/nph-command/nph-command.test.ts` and `nph-command.docs.test.ts`; the options of the
  dialog in `src/components/nph-dialog/nph-dialog.options.test.ts`.
- **Usage evidence:** pending — no approved screen consumes the palette yet.
- **Storybook:** `src/components/nph-command/nph-command.stories.ts` and `nph-command.docs.stories.ts`, with the
  examples in `nph-command.fixtures.stories.ts`.
- **Figma:** the `nph-command` documentation frame (`6076:4910`), root (`6067:3610`) and set (`6068:3936`) in
  `DS-IA-NEPHOS 5.0`.
