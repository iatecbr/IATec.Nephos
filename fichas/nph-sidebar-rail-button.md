---
piece: nph-sidebar-rail-button
level: component
status: active
solves: >-
  Leads the person to a page from the collapsed lateral menu, where only the icon fits,
  with the name in a balloon, the current page marked and, when needed, a counter.
use_when:
  - "In the collapsed menu, where only the icon fits."
  - "With counter, when the page has something to look at."
do_not_use_when:
  - "In the expanded menu: use nph-sidebar-item, with the visible label."
  - "With text in the counter: use nph-badge."
  - "As an action button: use nph-button."
api:
  type:
    type: enum
    values: [link, group]
    required: false
    default: link
    reflects: true
    constraint: >-
      link leads to a page through href; group is the rail button of an item with children: a
      disclosure button that opens the flyout panel of nph-sidebar (P116). A group has no
      href, no counter and is never active. Reflects because the CSS reads it. Any other
      value draws nothing and emits console.error in development.
  label:
    type: string
    required: true
    default: "empty"
    reflects: false
    constraint: >-
      The name of the page, already localized. Required: it is the aria-label of the link
      and the text of the balloon, which is always on. Without it, the rail button draws
      nothing and emits console.error in development; with no label and no icon, it is a
      mount and emits nothing.
  icon:
    type: string
    required: true
    default: "empty"
    reflects: false
    constraint: >-
      A core name of nph-icon, drawn at icon/size-md: light at rest, solid when active.
      Empty or outside the core draws nothing and emits console.error in development.
  href:
    type: string
    required: true
    default: "empty"
    reflects: false
    constraint: >-
      The page it leads to. Required in a link unless disabled: without it, the rail button
      draws nothing and emits console.error in development. A group has none.
  active:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      The current page: aria-current="page", sidebar/rail-background-active and the solid
      icon in sidebar/rail-foreground-active. It does not exist in a group.
  counter:
    type: number
    required: false
    default: "none"
    reflects: false
    constraint: >-
      A whole number from zero up, in a pill above the top end corner (D-1), read in the
      name of the link, after the label (WCAG 2.5.3; Elvys, 27-10-2026). When active, the
      pill gains a 4 px outline in sidebar/panel-background, decorative (D-2). Only on a
      link. Anything else draws nothing and emits console.error in development.
  disabled:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      The page exists, but the person has no access now: state/disabled-opacity, out of
      the Tab order, with no click and no balloon. A disabled rail button needs no href.
  expanded:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      The flyout panel of the group is open: aria-expanded, the solid icon and the hover
      background. Only in a group. The person toggles it with a click, Enter or Space.
  controls:
    type: object
    required: false
    default: "none"
    reflects: false
    constraint: >-
      The element a group opens, set by nph-sidebar (property only). An id cannot cross the
      shadow root, so the button takes it as ariaControlsElements.
  nph-toggle:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      Fired when the person opens or closes a group, with detail.expanded, the new state. It
      bubbles, crosses shadow roots and is not cancelable. Setting expanded from code fires
      nothing.
variants:
  counter:
    axis: appearance
    choose_when: "on when the page has something to look at; off in every other case."
    do_not_combine_with:
      - "group: a group has no counter."
  type:
    axis: appearance
    choose_when: "link to lead to a page; group for an item with children, which opens the flyout panel."
    do_not_combine_with:
      - "group with href, counter or active."
states:
  rest:
    token: sidebar/item-foreground
    changes_for_user: "No background: the light icon in sidebar/item-foreground."
  hover:
    token: sidebar/rail-background-hover
    changes_for_user: "The button in sidebar/rail-background-hover; the balloon opens after the wait."
  active:
    token: sidebar/rail-background-active
    changes_for_user: "The current page: sidebar/rail-background-active and the solid icon in sidebar/rail-foreground-active; the counter gains its outline."
  focus:
    token: focus/border
    changes_for_user: "Keyboard focus: border border/width in focus/border and halo focus/ring-width in focus/halo around the button; the balloon opens at once."
  disabled:
    token: state/disabled-opacity
    changes_for_user: "The whole button at state/disabled-opacity, with no hover and no balloon; it cannot be reached by Tab."
business_rules:
  - "The balloon is always on, with the label: without a visible label, it says the name."
  - "nph-sidebar switches nph-sidebar-item for the rail button when it collapses; an item with children becomes a group rail button that opens a flyout panel."
  - "A group toggles expanded by itself on a click, Enter or Space and fires nph-toggle; opening it closes its balloon."
  - "A click on the balloon is not a click on the button: it stops at the host."
domain_errors: []
tokens:
  size: sidebar/rail-button-size
  radius: radius/container
  icon: "nph-icon icon/size-md in sidebar/item-foreground, light; solid in sidebar/rail-foreground-active when active"
  hover: sidebar/rail-background-hover
  active: sidebar/rail-background-active
  counter: "text/label-sm in sidebar/item-badge-foreground on sidebar/item-badge-background, icon/size-md high, space/inline on the sides, radius/full, space/inline-tight above the top end corner and border/width inside the end edge; outline space/inline-tight in sidebar/panel-background when active"
  focus: "border border/width in focus/border, focus/border-radius-container; halo focus/ring-width in focus/halo, focus/radius-container"
  disabled: state/disabled-opacity
ai_hints:
  - "Use nph-sidebar-rail-button in the collapsed menu only; in the expanded menu, use nph-sidebar-item."
  - "Give every rail button the label of the page: it is its only name."
  - "Use the same icon as the item it replaces."
accessibility:
  semantics: "A link with aria-current=page on the current page. Disabled, the link has no href, keeps role link and gains aria-disabled. A group is a button with aria-expanded and aria-controls."
  accessible_name: "The label and then the counter number: aria-labelledby reads the balloon, whose text is the label, and the counter, so the name holds the number one sees (WCAG 2.5.3; Elvys, 27-10-2026). The aria-label is the label, the fallback; disabled, with no balloon, it holds the label and the counter. The icon is hidden from the screen reader."
  keyboard:
    - "Tab: reaches the button and opens the balloon."
    - "Enter: follows the link."
    - "Enter and Space: open and close the flyout panel of a group."
    - "Esc: closes the balloon."
  focus: "Border focus/border and halo focus/halo around the button, keyboard only."
  contrast: "The icon passes 3:1 against sidebar/panel-background, sidebar/rail-background-hover on hover and sidebar/rail-background-active when active, and the number passes 4.5:1 against sidebar/item-badge-background, in both modes. Disabled is exempt."
  color_alternative: "Active also gains its background and switches the icon to solid; the counter carries the number as text."
invalid_combinations:
  - "A rail button without label — it would have no name."
  - "An icon empty or outside the core — the rail button draws nothing."
  - "A rail button without href, unless disabled or a group — it leads nowhere."
  - "A group with href, counter or active — a group opens a flyout panel and is never the current page."
  - "A type outside link and group — the rail button draws nothing."
  - "A counter that is not a whole number from zero up — the counter shows a number only."
relations:
  combines_with: [nph-sidebar-item, nph-icon, nph-tooltip]
  parents: [nph-sidebar]
  children: [nph-icon, nph-tooltip]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Leaving the rail button without its name."
  - "Using the rail button in the expanded menu."
  - "Writing text in the counter."
  - "Using the rail button as an action button."
sources:
  design_md: "design.md, focus/border, focus/halo, focus/ring-width, border/width, space/inline, icon/size-md, radius/container, radius/full, text/label-sm and state/disabled-opacity; the sidebar/* tokens and the focus radii are in src/tokens/source/semantic.tokens.json"
  decision: "P98 — API and semantics of nph-sidebar-item, nph-sidebar-subitem and nph-sidebar-rail-button; P116 for the group, the counter position, its outline and the focus border"
  tests: "src/components/nph-sidebar-rail-button/nph-sidebar-rail-button.test.ts"
  usage_evidence: "the Rail button section and the required examples of the nph-sidebar-item Docs page"
  storybook: "src/components/nph-sidebar-item/nph-sidebar-item.stories.ts (the Rail button story) and nph-sidebar-item.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, board nph-sidebar-item 1366:2, documentation 2723:460, set 2251:51328"
---

# nph-sidebar-rail-button

## Function

**The problem it solves:** leads the person to a page from the collapsed lateral menu,
where only the icon fits. The name is in a balloon, the current page is marked and, when
needed, a counter shows. `nph-sidebar` switches `nph-sidebar-item` for it when it collapses.
It has its own package entry, because the build takes one definition per folder; its
reading page is the one of `nph-sidebar-item`.

**When to use:**

- In the collapsed menu, where only the icon fits.
- With `counter`, when the page has something to look at.

**When NOT to use:**

- **In the expanded menu** — use `nph-sidebar-item`, with the visible label.
- **With text in the counter** — use `nph-badge`.
- **As an action button** — use `nph-button`.

## Variants

**By appearance:** the type, a link or a group (the rail button of an item with children,
which opens the flyout panel), and the counter, off or on, in a pill above the top end
corner (D-1).

**By size:** `not_applicable`: one square of `sidebar/rail-button-size`.

**By density:** `not_applicable`.

| Figma `counter` | Code | Choose when |
|---|---|---|
| off | no `counter` | General use |
| on | `counter` | The page has something to look at |
| group | `type="group"` | The item has children: the button opens the flyout panel |

**Do not combine with:** a way to turn the balloon off — it is always on; a group with
`href`, `counter` or `active`.

## States

| State | Token | What changes for the person |
|---|---|---|
| `rest` | `sidebar/item-foreground` | No background; the light icon |
| `hover` | `sidebar/rail-background-hover` | The button background; the balloon opens after the wait |
| `active` | `sidebar/rail-background-active`, `sidebar/rail-foreground-active` | The background and the solid icon; the counter gains a 4 px outline in `sidebar/panel-background` (D-2) |
| open group | `sidebar/rail-background-hover` | The hover background and the solid icon while its flyout panel is open |
| `focus` | `focus/border`, `focus/halo` | Border `border/width` and halo `focus/ring-width` around the button; the balloon opens at once |
| `disabled` | `state/disabled-opacity` | The whole button fades, with no hover and no balloon, out of the Tab order |

**Feedback and focus:** keyboard focus draws the border and the halo outside the button, in
`focus/border-radius-container` and `focus/radius-container`, and opens the balloon.

**Business rule the piece carries:**

- The balloon is always on, with the label: without a visible label, it says the name.
- `nph-sidebar` switches `nph-sidebar-item` for the rail button when it collapses; an item
  with children becomes a group rail button.
- A group is a `button` with `aria-expanded`: a click, Enter or Space toggles `expanded` and
  fires `nph-toggle` with `detail.expanded`; opening it closes its balloon. Setting `expanded`
  from code fires nothing.
- A click on the balloon is not a click on the button: it stops at the host.

**Domain error states:** `not_applicable`.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | A link with `aria-current="page"` on the current page. Disabled, the link has no `href`, keeps `role="link"` and gains `aria-disabled`. A group is a `button` with `aria-expanded` and `aria-controls` |
| Accessible name | The label and then the counter number: `aria-labelledby` reads the balloon, whose text is the label (as the icon-only `nph-button`), and the counter, so the name holds the number one sees (WCAG 2.5.3; Elvys, 27-10-2026, DSA-32). The `aria-label` is the label, the fallback; disabled, with no balloon, it holds the label and the counter. The icon is hidden |
| Keyboard | Tab reaches the button and opens the balloon; Enter follows the link; Enter and Space open and close a group; Esc closes the balloon |
| Focus | Border `focus/border` and halo `focus/halo` around the button, keyboard only |
| Contrast | The icon passes 3:1 against `sidebar/panel-background`, `sidebar/rail-background-hover` and `sidebar/rail-background-active`, and the number 4.5:1 against `sidebar/item-badge-background`, in both modes. Disabled is exempt |
| Alternative to color | Active also gains its background and switches the icon to solid |
| Touch target | The whole button, `sidebar/rail-button-size`. On touch the balloon does not open: the name is read by the screen reader, an accepted exception (P77) |
| Known limits | Forced colors and right-to-left are not treated yet |

## Relations

**Combines with:** `nph-sidebar-item`, which it replaces in the collapsed menu; `nph-icon`,
the icon; `nph-tooltip`, the balloon.

**What is the parent:** `nph-sidebar`, in its collapsed mode, which draws the flyout panel of a
group.

**What is the child:** `nph-icon` and `nph-tooltip`.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Button | A square of `sidebar/rail-button-size`, radius `radius/container` |
| Icon | `nph-icon` `icon/size-md` in `sidebar/item-foreground`, light; solid in `sidebar/rail-foreground-active` when active |
| Hover | `sidebar/rail-background-hover` |
| Active | `sidebar/rail-background-active` |
| Counter | `text/label-sm` in `sidebar/item-badge-foreground` on `sidebar/item-badge-background`, `icon/size-md` high, `space/inline` on the sides, `radius/full`, `space/inline-tight` above the top end corner and `border/width` inside the end edge; a `space/inline-tight` outline in `sidebar/panel-background` when active |
| Focus | Border `border/width` in `focus/border`, `focus/border-radius-container`; halo `focus/ring-width` in `focus/halo`, `focus/radius-container` |
| Disabled | `state/disabled-opacity` |

**Usage restrictions:** `sidebar/rail-radius` is not used by this piece: the evidence gives
the button `radius/container`.

**AI hints:**

- Use `nph-sidebar-rail-button` in the collapsed menu only; in the expanded menu, use
  `nph-sidebar-item`.
- Give every rail button the label of the page: it is its only name.
- Use the same icon as the item it replaces.

## Examples

**Recommended case:** the collapsed menu, one rail button per page, the current page active
and the inbox with its counter.

**Alternative case:** a rail button disabled, for a page the person has no access to now.

## Anti-patterns

- **Do not leave the rail button without its name** — without a visible label, the balloon
  says what it opens.
- **Do not use the rail button in the expanded menu** — use `nph-sidebar-item`.
- **Do not write text in the counter** — use `nph-badge`.
- **Do not use the rail button as an action button** — use `nph-button`.
- **Invalid combinations:** no `label`; an `icon` empty or outside the core; no `href`,
  unless disabled or a group; a `counter` that is not a whole number; a group with `href`,
  `counter` or `active`; a `type` outside the two.
- **Do not create without a decision:** a way to turn the balloon off, the flyout panel,
  which belongs to `nph-sidebar`, a slot or a color property.

## Sources and decisions

- **The repository `design.md`:** `focus/border`, `focus/halo`, `focus/ring-width`,
  `border/width`, `space/inline`, `icon/size-md`, `radius/container`, `radius/full`,
  `text/label-sm` and `state/disabled-opacity`. The `sidebar/*` tokens and the focus radii
  are in `src/tokens/source/semantic.tokens.json`.
- **The decision that originated it:** P98, amended by P116 for the group, the place of the
  counter, the width of its outline and the focus border in `focus/border`.
- **Pending decisions:** D-3 of the task DSA-72, the current page inside a collapsed group.
- **Tests:** `src/components/nph-sidebar-rail-button/nph-sidebar-rail-button.test.ts`.
- **Usage evidence:** the Rail button section and the required examples of the
  `nph-sidebar-item` Docs page.
- **Storybook:** the `Rail button` story in
  `src/components/nph-sidebar-item/nph-sidebar-item.stories.ts` and
  `nph-sidebar-item.docs.stories.ts`.
- **Figma:** `DS-IA-NEPHOS 5.0`, board `nph-sidebar-item` (`1366:2`), documentation
  `2723:460`, set `2251:51328`.
