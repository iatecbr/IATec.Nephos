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
      The page it leads to. Required unless disabled: without it, the rail button draws
      nothing and emits console.error in development.
  active:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      The current page: aria-current="page", sidebar/rail-background-active and the solid
      icon in sidebar/rail-foreground-active.
  counter:
    type: number
    required: false
    default: "none"
    reflects: false
    constraint: >-
      A whole number from zero up, in a pill on the top end corner (D-1), read as the
      description of the link. When active, the pill gains an outline in
      sidebar/panel-background (D-2). Anything else draws nothing and emits console.error
      in development.
  disabled:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      The page exists, but the person has no access now: state/disabled-opacity, out of
      the Tab order, with no click and no balloon. A disabled rail button needs no href.
variants:
  counter:
    axis: appearance
    choose_when: "on when the page has something to look at; off in every other case."
    do_not_combine_with: []
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
    token: color/primary
    changes_for_user: "Keyboard focus: border border/width in color/primary and halo focus/ring-width in focus/halo around the button; the balloon opens at once."
  disabled:
    token: state/disabled-opacity
    changes_for_user: "The whole button at state/disabled-opacity, with no hover and no balloon; it cannot be reached by Tab."
business_rules:
  - "The balloon is always on, with the label: without a visible label, it says the name."
  - "nph-sidebar switches nph-sidebar-item for the rail button when it collapses."
  - "A click on the balloon is not a click on the button: it stops at the host."
domain_errors: []
tokens:
  size: sidebar/rail-button-size
  radius: radius/container
  icon: "nph-icon icon/size-md in sidebar/item-foreground, light; solid in sidebar/rail-foreground-active when active"
  hover: sidebar/rail-background-hover
  active: sidebar/rail-background-active
  counter: "text/label-sm in sidebar/item-badge-foreground on sidebar/item-badge-background, icon/size-md high, space/inline on the sides, radius/full, on the top end corner; outline border/width in sidebar/panel-background when active"
  focus: "border border/width in color/primary, focus/border-radius-container; halo focus/ring-width in focus/halo, focus/radius-container"
  disabled: state/disabled-opacity
ai_hints:
  - "Use nph-sidebar-rail-button in the collapsed menu only; in the expanded menu, use nph-sidebar-item."
  - "Give every rail button the label of the page: it is its only name."
  - "Use the same icon as the item it replaces."
accessibility:
  semantics: "A link with aria-current=page on the current page. Disabled, the link has no href, keeps role link and gains aria-disabled."
  accessible_name: "The label, as the aria-label of the link; the balloon repeats it as the name, through aria-labelledby, with the same text. The counter number is the description. The icon is hidden from the screen reader."
  keyboard:
    - "Tab: reaches the button and opens the balloon."
    - "Enter: follows the link."
    - "Esc: closes the balloon."
  focus: "Border color/primary and halo focus/halo around the button, keyboard only."
  contrast: "The icon passes 3:1 against sidebar/panel-background, sidebar/rail-background-hover on hover and sidebar/rail-background-active when active, and the number passes 4.5:1 against sidebar/item-badge-background, in both modes. Disabled is exempt."
  color_alternative: "Active also gains its background and switches the icon to solid; the counter carries the number as text."
invalid_combinations:
  - "A rail button without label — it would have no name."
  - "An icon empty or outside the core — the rail button draws nothing."
  - "A rail button without href, unless disabled — it leads nowhere."
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
  design_md: "design.md, color/primary, focus/halo, focus/ring-width, border/width, space/inline, icon/size-md, radius/container, radius/full, text/label-sm and state/disabled-opacity; the sidebar/* tokens and the focus radii are in src/tokens/source/semantic.tokens.json"
  decision: "P98 — API and semantics of nph-sidebar-item, nph-sidebar-subitem and nph-sidebar-rail-button"
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

**By appearance:** the counter, off or on, in a pill on the top end corner (D-1).

**By size:** `not_applicable`: one square of `sidebar/rail-button-size`.

**By density:** `not_applicable`.

| Figma `counter` | Code | Choose when |
|---|---|---|
| off | no `counter` | General use |
| on | `counter` | The page has something to look at |

**Do not combine with:** a way to turn the balloon off — it is always on.

## States

| State | Token | What changes for the person |
|---|---|---|
| `rest` | `sidebar/item-foreground` | No background; the light icon |
| `hover` | `sidebar/rail-background-hover` | The button background; the balloon opens after the wait |
| `active` | `sidebar/rail-background-active`, `sidebar/rail-foreground-active` | The background and the solid icon; the counter gains an outline in `sidebar/panel-background` (D-2) |
| `focus` | `color/primary`, `focus/halo` | Border `border/width` and halo `focus/ring-width` around the button; the balloon opens at once |
| `disabled` | `state/disabled-opacity` | The whole button fades, with no hover and no balloon, out of the Tab order |

**Feedback and focus:** keyboard focus draws the border and the halo outside the button, in
`focus/border-radius-container` and `focus/radius-container`, and opens the balloon.

**Business rule the piece carries:**

- The balloon is always on, with the label: without a visible label, it says the name.
- `nph-sidebar` switches `nph-sidebar-item` for the rail button when it collapses.
- A click on the balloon is not a click on the button: it stops at the host.

**Domain error states:** `not_applicable`.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | A link with `aria-current="page"` on the current page. Disabled, the link has no `href`, keeps `role="link"` and gains `aria-disabled` |
| Accessible name | The label, as the `aria-label`; the balloon repeats it as the name, through `aria-labelledby`, with the same text (as the icon-only `nph-button`). The counter number is the description. The icon is hidden |
| Keyboard | Tab reaches the button and opens the balloon; Enter follows the link; Esc closes the balloon |
| Focus | Border `color/primary` and halo `focus/halo` around the button, keyboard only |
| Contrast | The icon passes 3:1 against `sidebar/panel-background`, `sidebar/rail-background-hover` and `sidebar/rail-background-active`, and the number 4.5:1 against `sidebar/item-badge-background`, in both modes. Disabled is exempt |
| Alternative to color | Active also gains its background and switches the icon to solid |
| Touch target | The whole button, `sidebar/rail-button-size`. On touch the balloon does not open: the name is read by the screen reader, an accepted exception (P77) |
| Known limits | Forced colors and right-to-left are not treated yet |

## Relations

**Combines with:** `nph-sidebar-item`, which it replaces in the collapsed menu; `nph-icon`,
the icon; `nph-tooltip`, the balloon.

**What is the parent:** `nph-sidebar`, in its collapsed mode. It is not built yet.

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
| Counter | `text/label-sm` in `sidebar/item-badge-foreground` on `sidebar/item-badge-background`, `icon/size-md` high, `space/inline` on the sides, `radius/full`, on the top end corner; outline `border/width` in `sidebar/panel-background` when active |
| Focus | Border `border/width` in `color/primary`, `focus/border-radius-container`; halo `focus/ring-width` in `focus/halo`, `focus/radius-container` |
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
  unless disabled; a `counter` that is not a whole number.
- **Do not create without a decision:** a way to turn the balloon off, a group or flyout of
  its own, which belongs to `nph-sidebar`, a slot or a color property.

## Sources and decisions

- **The repository `design.md`:** `color/primary`, `focus/halo`, `focus/ring-width`,
  `border/width`, `space/inline`, `icon/size-md`, `radius/container`, `radius/full`,
  `text/label-sm` and `state/disabled-opacity`. The `sidebar/*` tokens and the focus radii
  are in `src/tokens/source/semantic.tokens.json`.
- **The decision that originated it:** P98.
- **Pending decisions:** D-1 and D-2 of the task DSA-53, the place of the counter and the
  width of its outline.
- **Tests:** `src/components/nph-sidebar-rail-button/nph-sidebar-rail-button.test.ts`.
- **Usage evidence:** the Rail button section and the required examples of the
  `nph-sidebar-item` Docs page.
- **Storybook:** the `Rail button` story in
  `src/components/nph-sidebar-item/nph-sidebar-item.stories.ts` and
  `nph-sidebar-item.docs.stories.ts`.
- **Figma:** `DS-IA-NEPHOS 5.0`, board `nph-sidebar-item` (`1366:2`), documentation
  `2723:460`, set `2251:51328`.
