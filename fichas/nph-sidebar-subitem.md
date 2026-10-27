---
piece: nph-sidebar-subitem
level: component
status: active
solves: >-
  Leads the person to a page from the second level of the lateral menu, right below the
  open group that holds it, with the current page marked.
use_when:
  - "As the second level, inside an open group of nph-sidebar-item."
  - "With options, when the subitem leads to a list of other choices."
  - "With tooltip, when the label can be cut, to show the full name."
do_not_use_when:
  - "Outside a group: use nph-sidebar-item."
  - "As an action button: use nph-button."
  - "With an icon or a counter: the subitem has the label only; use nph-sidebar-item."
api:
  label:
    type: string
    required: true
    default: "empty"
    reflects: false
    constraint: >-
      The text of the line, already localized: one line, with an ellipsis when it does not
      fit. It is the accessible name. Empty is a mount: nothing is drawn and no error is
      emitted.
  href:
    type: string
    required: true
    default: "empty"
    reflects: false
    constraint: >-
      The page the subitem leads to. Required unless disabled: without it, the subitem draws
      nothing and emits console.error in development.
  active:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      The current page: aria-current="page", sidebar/item-foreground-active and
      text/label-md. Only one line of the menu is active.
  options:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      The Figma options=yes: the arrow chevron-right at icon/size-sm, which says the
      subitem leads to a list of options. Visual only: the subitem stays a link (D-4).
  disabled:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      The page exists, but the person has no access now: state/disabled-opacity, out of
      the Tab order, with no click and no balloon. A disabled subitem needs no href.
  tooltip:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The text of the nph-tooltip with the full name, on hover and focus, already
      localized. It does not follow label. Empty turns it off.
variants:
  options:
    axis: appearance
    choose_when: "yes when the subitem leads to a list of options; no when it leads straight to a page."
    do_not_combine_with: []
states:
  rest:
    token: sidebar/item-foreground
    changes_for_user: "No background: the label in text/body-md and sidebar/item-foreground."
  hover:
    token: sidebar/item-background-hover
    changes_for_user: "The whole line in sidebar/item-background-hover."
  active:
    token: sidebar/item-foreground-active
    changes_for_user: "The current page: no background, the label in sidebar/item-foreground-active and text/label-md."
  focus:
    token: color/primary
    changes_for_user: "Keyboard focus: border border/width in color/primary and halo focus/ring-width in focus/halo around the whole line."
  disabled:
    token: state/disabled-opacity
    changes_for_user: "The whole line at state/disabled-opacity, with no hover; it cannot be reached by Tab."
business_rules:
  - "The subitem lives right below an open group of nph-sidebar-item."
  - "Only the current page is active."
  - "A click on the balloon is not a click on the line: it stops at the host."
domain_errors: []
tokens:
  height: control/height-default
  padding: "space/inline top and bottom, sidebar/item-padding on the sides"
  gap: space/inline
  radius: sidebar/item-radius
  label: "text/body-md in sidebar/item-foreground; text/label-md in sidebar/item-foreground-active when active"
  arrow: "nph-icon icon/size-sm, chevron-right"
  hover: sidebar/item-background-hover
  focus: "border border/width in color/primary, focus/border-radius-sidebar-item; halo focus/ring-width in focus/halo, focus/radius-sidebar-item"
  disabled: state/disabled-opacity
ai_hints:
  - "Use nph-sidebar-subitem only inside an open group; at the first level, use nph-sidebar-item."
  - "Turn on options only when the subitem leads to a list of options."
  - "Mark the subitem of the current page active, and its group open."
accessibility:
  semantics: "A link with aria-current=page on the current page. Disabled, the link has no href, keeps role link and gains aria-disabled."
  accessible_name: "The label. The arrow is hidden from the screen reader; the balloon is the description of the line."
  keyboard:
    - "Tab: reaches the line."
    - "Enter: follows the link."
  focus: "Border color/primary and halo focus/halo around the whole line, keyboard only."
  contrast: "The label passes 4.5:1 against sidebar/panel-background and sidebar/item-background-hover, in both modes. Disabled is exempt."
  color_alternative: "Active also switches the label to text/label-md."
invalid_combinations:
  - "A subitem without href, unless disabled — it leads nowhere."
  - "A subitem outside a group — use nph-sidebar-item."
relations:
  combines_with: [nph-sidebar-item, nph-icon, nph-tooltip]
  parents: [nph-sidebar]
  children: [nph-icon, nph-tooltip]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Using a subitem outside a group."
  - "Using the subitem as an action button."
  - "Marking two lines as active."
  - "Leaving a long label without tooltip."
sources:
  design_md: "design.md, color/primary, focus/halo, focus/ring-width, border/width, control/height-default, space/inline, icon/size-sm, text/body-md, text/label-md and state/disabled-opacity; the sidebar/* tokens and the focus radii are in src/tokens/source/semantic.tokens.json"
  decision: "P98 — API and semantics of nph-sidebar-item, nph-sidebar-subitem and nph-sidebar-rail-button"
  tests: "src/components/nph-sidebar-subitem/nph-sidebar-subitem.test.ts"
  usage_evidence: "the Subitem section and the required examples of the nph-sidebar-item Docs page"
  storybook: "src/components/nph-sidebar-item/nph-sidebar-item.stories.ts (the Subitem story) and nph-sidebar-item.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, board nph-sidebar-item 1366:2, documentation 2723:460, set 2251:51312"
---

# nph-sidebar-subitem

## Function

**The problem it solves:** leads the person to a page from the second level of the lateral
menu, right below the open group of `nph-sidebar-item` that holds it, with the current page
marked. It has its own package entry, because the build takes one definition per folder;
its reading page is the one of `nph-sidebar-item`.

**When to use:**

- As the second level, inside an open group of `nph-sidebar-item`.
- With `options`, when the subitem leads to a list of other choices.
- With `tooltip`, when the label can be cut, to show the full name.

**When NOT to use:**

- **Outside a group** — use `nph-sidebar-item`.
- **As an action button** — use `nph-button`.
- **With an icon or a counter** — the subitem has the label only; use `nph-sidebar-item`.

## Variants

**By appearance:** `options`, no or yes. With yes, the arrow `chevron-right` at
`icon/size-sm` sits at the end of the line.

**By size:** `not_applicable`: the subitem fills the width it receives, at
`control/height-default`.

**By density:** `not_applicable`.

| Figma `options` | Code | Choose when |
|---|---|---|
| `no` | no `options` | The subitem leads straight to a page |
| `yes` | `options` | The subitem leads to a list of options |

**Do not combine with:** an icon or a counter, which the subitem does not have.

## States

| State | Token | What changes for the person |
|---|---|---|
| `rest` | `sidebar/item-foreground` | No background; the label in `text/body-md` |
| `hover` | `sidebar/item-background-hover` | The whole line |
| `active` | `sidebar/item-foreground-active` | No background; the label in its color and `text/label-md` |
| `focus` | `color/primary`, `focus/halo` | Border `border/width` and halo `focus/ring-width` around the whole line, keyboard only |
| `disabled` | `state/disabled-opacity` | The whole line fades, with no hover, out of the Tab order |

**Feedback and focus:** keyboard focus draws the border and the halo outside the line, in
`focus/border-radius-sidebar-item` and `focus/radius-sidebar-item`. A mouse click draws no
ring.

**Business rule the piece carries:**

- The subitem lives right below an open group of `nph-sidebar-item`.
- Only the current page is active.
- A click on the balloon is not a click on the line: it stops at the host.

**Domain error states:** `not_applicable`.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | A link with `aria-current="page"` on the current page. Disabled, the link has no `href`, keeps `role="link"` and gains `aria-disabled` |
| Accessible name | The label. The arrow is hidden; the balloon is the description of the line |
| Keyboard | Tab reaches the line; Enter follows the link |
| Focus | Border `color/primary` and halo `focus/halo` around the whole line, keyboard only |
| Contrast | The label passes 4.5:1 against `sidebar/panel-background` and `sidebar/item-background-hover`, in both modes. Disabled is exempt |
| Alternative to color | Active also switches the label to `text/label-md` |
| Touch target | The whole line, `control/height-default` |
| Known limits | Forced colors and right-to-left are not treated yet |

## Relations

**Combines with:** `nph-sidebar-item`, the open group above it; `nph-icon`, the arrow;
`nph-tooltip`, the balloon.

**What is the parent:** `nph-sidebar`, which shows the subitems of an open group. It is not
built yet.

**What is the child:** `nph-icon` and `nph-tooltip`.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Line | Height `control/height-default`, `space/inline` top and bottom, `sidebar/item-padding` on the sides, radius `sidebar/item-radius` |
| Label | `text/body-md` in `sidebar/item-foreground`; `text/label-md` in `sidebar/item-foreground-active` when active; one line with an ellipsis |
| Arrow | `nph-icon` `icon/size-sm`, `chevron-right`, `space/inline` after the label |
| Hover | `sidebar/item-background-hover` |
| Focus | Border `border/width` in `color/primary`, `focus/border-radius-sidebar-item`; halo `focus/ring-width` in `focus/halo`, `focus/radius-sidebar-item` |
| Disabled | `state/disabled-opacity` |

**Usage restrictions:** the subitem has no background at rest and when active.

**AI hints:**

- Use `nph-sidebar-subitem` only inside an open group; at the first level, use
  `nph-sidebar-item`.
- Turn on `options` only when the subitem leads to a list of options.
- Mark the subitem of the current page active, and its group open.

## Examples

**Recommended case:** the reports of a group, monthly, quarterly and annual, below the open
group, the current one active.

**Alternative case:** the last subitem with `options`, leading to a list of choices.

## Anti-patterns

- **Do not use a subitem outside a group** — use `nph-sidebar-item`.
- **Do not use the subitem as an action button** — use `nph-button`.
- **Do not mark two lines as active.**
- **Do not leave a long label without `tooltip`.**
- **Invalid combinations:** a subitem without `href`, unless disabled.
- **Do not create without a decision:** an icon, a counter, more actions, a slot, a color
  property or an indent of its own, which belongs to `nph-sidebar`.

## Sources and decisions

- **The repository `design.md`:** `color/primary`, `focus/halo`, `focus/ring-width`,
  `border/width`, `control/height-default`, `space/inline`, `icon/size-sm`, `text/body-md`,
  `text/label-md` and `state/disabled-opacity`. The `sidebar/*` tokens and the focus radii
  are in `src/tokens/source/semantic.tokens.json`.
- **The decision that originated it:** P98.
- **Pending decisions:** D-4 of the task DSA-53, what the list of options opens.
- **Tests:** `src/components/nph-sidebar-subitem/nph-sidebar-subitem.test.ts`.
- **Usage evidence:** the Subitem section and the required examples of the
  `nph-sidebar-item` Docs page.
- **Storybook:** the `Subitem` story in
  `src/components/nph-sidebar-item/nph-sidebar-item.stories.ts` and
  `nph-sidebar-item.docs.stories.ts`.
- **Figma:** `DS-IA-NEPHOS 5.0`, board `nph-sidebar-item` (`1366:2`), documentation
  `2723:460`, set `2251:51312`.
