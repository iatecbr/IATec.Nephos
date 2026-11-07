---
piece: nph-breadcrumb
level: component
status: active
solves: >-
  Shows the path to the current page and leads back to each level above, so the person can go up
  a level in a hierarchy.
use_when:
  - "On a page that sits inside a hierarchy, when the person needs to go up a level."
  - "Choose the trail by the real path of the page: 2, 3 or 4 levels drawn, or collapsed when the path does not fit the width."
  - "collapsed on a narrow screen: the trail keeps one line, with the first level and the last two in view."
  - "Icons when the trail needs them, on every level; without icons, on none."
  - "At the top of the page content, above the title."
do_not_use_when:
  - "As the navigation menu of the product: the trail shows where the page is, not where the person can go; use the navigation menu."
  - "As tabs that switch the content of one page: use tabs."
  - "As a back button: the trail leads to the levels of the path, and does not show the history of visited pages."
  - "For a path with a single level: the trail has at least the first level and the current page."
  - "As a loading state: while the page loads, a line of nph-skeleton takes the place of the trail."
api:
  levels:
    type: array
    required: true
    default: "empty list"
    reflects: false
    constraint: >-
      Property only. The path, in order, from the first level to the current page, as a list
      of { label, href, icon }. label is required, already localized, on one line. href is
      required on every level above the current page and forbidden on the last one, which is
      the current page. href takes http, https, mailto, tel or a relative address; any other
      protocol, javascript among them, in any spelling the browser reads as such, is refused. icon is optional, a core name of nph-icon, all the levels or none. The
      first level reads Home. A list that is not a list, has fewer than 2 levels, or breaks a
      rule above draws nothing and emits console.error in development, one per cause.
  collapsed:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      It is the Figma value `recolhido` of the property `niveis`. Off, the trail draws all its
      levels, 2, 3 or 4, the counts of the accepted Figma set; more than 4 levels draws
      nothing and emits console.error in development. On, it draws the first level, the
      ellipsis button and the last two levels, and the levels in between sit in the menu the
      button opens; it needs 4 levels or more, and fewer draws nothing and emits console.error
      in development. The consumer chooses it, since the width is the page to know. Reflects
      so the consumer can style and check the state.
  label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name of the navigation landmark, already localized. It wins over the
      aria-label of the host. A trail with neither draws and warns once in development.
  ellipsis-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name of the ellipsis button, already localized, such as Show hidden
      levels. Required on the collapsed trail, because the icon has no text; without it the
      collapsed trail draws nothing and emits console.error in development. Not read when the
      trail is not collapsed.
  aria-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name of the landmark when label is not given; label wins over it. It is
      read by a property whose attribute is aria-label, since a property called ariaLabel is
      the native ARIA reflection of the element. A trail with neither draws and warns once in
      development.
variants:
  trail:
    axis: appearance
    choose_when: "2, 3 or 4 levels drawn when the path fits the width, the Figma values 2, 3 and 4 of `niveis`; collapsed (`recolhido`) when the path has 4 levels or more and does not fit, or on a narrow screen."
    do_not_combine_with: ["collapsed with fewer than 4 levels", "more than 4 levels without collapsed", "collapsed without ellipsis-label"]
  icons:
    axis: appearance
    choose_when: "Without icons (sem) when the text is enough; with icons (com) when each level has a figure that helps to recognize it. Every level has an icon, or none does."
    do_not_combine_with: ["an icon on only some of the levels", "an icon that does not belong to the core of nph-icon"]
states:
  link-rest:
    token: "breadcrumb/link-foreground"
    changes_for_user: "The level shows in the muted color, in regular weight, with no underline."
  link-hover:
    token: "breadcrumb/link-foreground-hover"
    changes_for_user: "The text and the icon take the stronger color and the text is underlined, so color is not the only signal."
  link-focus:
    token: "breadcrumb/link-foreground-focus"
    changes_for_user: "For keyboard users, the text and the icon take the stronger color and a border and a halo outside the link mark the focus."
  current:
    token: "breadcrumb/current-foreground"
    changes_for_user: "The last level shows in the strongest color and in medium weight, with the solid icon when there are icons. It is text, not a link: it has no hover and takes no focus."
  ellipsis-rest:
    token: "breadcrumb/ellipsis-foreground"
    changes_for_user: "The ellipsis icon shows in the muted color, with no background."
  ellipsis-hover:
    token: "breadcrumb/ellipsis-foreground-hover, breadcrumb/ellipsis-background-hover"
    changes_for_user: "The icon takes the stronger color and the button takes a background."
  ellipsis-focus:
    token: "breadcrumb/ellipsis-foreground, focus/border, focus/halo"
    changes_for_user: "For keyboard users, a border and a halo outside the button mark the focus; the icon keeps the color of rest."
  ellipsis-open:
    token: "breadcrumb/ellipsis-foreground-hover, breadcrumb/ellipsis-background-hover"
    changes_for_user: "While the menu of hidden levels is open, the button keeps the look of hover, even with the pointer away."
business_rules:
  - "The last level of levels is the current page: it is text, it carries aria-current page, and it has no href. Every level above it is a link and has an href."
  - "The first level reads Home. With icons, the house goes next to the text, never alone: the icon alone does not say where the link leads."
  - "The collapsed trail draws the first level, the ellipsis and the last two levels. The levels in between sit in the menu of the ellipsis, in path order, as text only, with no header and no group label."
  - "With icons, every level has its own: light on a link and solid on the current page, in the same color as its label. The two never mix in one trail."
  - "The consumer chooses collapsed. The piece does not collapse by itself when the width runs short."
  - "The trail is on one line: it never wraps and never shrinks."
  - "Activating a hidden level in the menu leads where its visible link would: the piece clicks a hidden anchor of its own shadow root with the same href, so the native click bubbles, is composed and cancelable. The piece fires no event of its own."
  - "The hidden levels menu hugs its widest option between the floor and the ceiling of breadcrumb/menu-min-width and breadcrumb/menu-max-width, with the text cut by an ellipsis past the ceiling. It holds only in the breadcrumb; nph-dropdown-menu keeps its own fixed width."
  - "Every text comes from the consumer, already localized: the piece writes no word of its own."
  - "There is no loading state. While the page loads, a line of nph-skeleton takes the place of the trail."
domain_errors:
  - "A levels that is not a list, with fewer than 2 levels, or with more than 4 levels on a trail that is not collapsed: the trail draws nothing and emits console.error in development, one per cause."
  - "A collapsed trail with fewer than 4 levels, or without ellipsis-label: the trail draws nothing and emits console.error in development."
  - "A level without label; a level above the current page without href; the current page with an href; an icon outside the core of nph-icon or on only some of the levels: the trail draws nothing and emits console.error in development."
  - "A trail with no accessible name draws and warns once in development, because the name may arrive after the first render."
tokens:
  link: "breadcrumb/link-foreground, breadcrumb/link-foreground-hover, breadcrumb/link-foreground-focus, breadcrumb/link-font-weight"
  current: "breadcrumb/current-foreground, breadcrumb/current-font-weight"
  separator: "breadcrumb/separator-foreground, breadcrumb/icon-size"
  level_icon: "breadcrumb/item-icon-size, breadcrumb/item-icon-gap"
  ellipsis: "breadcrumb/ellipsis-foreground, breadcrumb/ellipsis-foreground-hover, breadcrumb/ellipsis-background-hover, breadcrumb/ellipsis-target-size, breadcrumb/icon-size"
  radius: breadcrumb/item-radius
  gap: breadcrumb/gap
  label: "breadcrumb/font-family, breadcrumb/font-size, breadcrumb/line-height, breadcrumb/letter-spacing"
  menu_width: "breadcrumb/menu-min-width, breadcrumb/menu-max-width"
  focus: "focus/border, border/width, focus/border-radius-control, focus/halo, focus/ring-width, focus/radius-control-with-border"
ai_hints:
  - "Use nph-breadcrumb at the top of a page that sits inside a hierarchy, above the title; for the navigation of the product use the navigation menu, for tabs use tabs."
  - "Give levels from the first level to the current page: every level above has label and href, and the last one has only label."
  - "Write the first level as Home, and keep the labels short and equal to the title of the target page."
  - "Choose collapsed when the trail does not fit the width, and then give ellipsis-label; the piece does not collapse by itself."
  - "Give the trail a label, or an aria-label, because it is the accessible name of the navigation landmark."
  - "Put an icon on every level or on none, and never on the first level alone."
  - "While the page loads, show a line of nph-skeleton in place of the trail."
accessibility:
  semantics: "A nav, named, holding an ordered list. Each level is a list item: a link above the current page, and the current page as text with aria-current page. The separators and the level icons are decorative and hidden from assistive technology: the name of a level is its label. The ellipsis is a native button of the shadow root, which the menu beside it finds by for and on which it writes aria-haspopup and aria-expanded."
  accessible_name: "The landmark: label, else the aria-label of the host. A level: its label. The ellipsis: ellipsis-label, because its icon has no text."
  keyboard:
    - "Tab moves through the links in path order, and through the ellipsis between the first level and the last two. The current page and the separators take no Tab."
    - "Enter activates a link."
    - "On the ellipsis, Enter, Space and the down arrow open the menu of hidden levels."
    - "In the menu, the arrows move, Enter and Space activate the level, and Esc closes the menu and gives the focus back to the ellipsis."
  focus: "Keyboard only, on the link and on the ellipsis: a border of border/width in focus/border and a halo in focus/halo outside the box, without changing its size. The border carries the focus; the halo is reinforcement. The current page takes no focus."
  contrast: "The links, the separator, the link icons and the ellipsis at rest, in the muted color, and the current page, in the strongest color, pass the required WCAG level over the background in both themes. The current page has the highest contrast of the trail, never lower than the links."
  color_alternative: "The current page is told apart without color: it is not a link, it has medium weight and, with icons, the solid icon. The hover of a link adds the underline to the change of color."
invalid_combinations:
  - "collapsed with fewer than 4 levels — there is no level to hide."
  - "More than 4 levels without collapsed — the contract draws 2, 3 or 4 levels."
  - "A collapsed trail without ellipsis-label — the ellipsis has an icon and no text."
  - "An href on the current page, or a level above it without href — the current page is text, and every level above is a link."
  - "An icon on only some of the levels — with icons every level has one, without icons none does."
  - "A trail with fewer than 2 levels — it has at least the first level and the current page."
relations:
  combines_with: [nph-icon, nph-dropdown-menu]
  parents: ["the top of the page content, above the title"]
  children: [nph-icon, nph-dropdown-menu]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Using the trail as the navigation menu, as tabs or as a back button."
  - "Making the current page a link."
  - "Letting the trail wrap or overflow the width instead of collapsing it."
  - "Putting an icon on only some of the levels."
  - "Leaving the house alone on the first level, with no Home text."
  - "Leaving the trail without a label or an aria-label."
sources:
  design_md: "design.md, the breadcrumb/* tokens, color/muted-foreground, color/foreground, color/accent and the global focus/* tokens"
  decision: "P109 — nph-breadcrumb: API and semantics"
  tests: "src/components/nph-breadcrumb/nph-breadcrumb.test.ts"
  usage_evidence: "no screen consumes it yet"
  storybook: "src/components/nph-breadcrumb/nph-breadcrumb.stories.ts and nph-breadcrumb.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-breadcrumb documentation 4512:4741, sets 4490:2886, 4490:2678, 4490:2697, separator 1635:16"
---

# nph-breadcrumb

## Function

**The problem it solves:** shows the path to the current page and leads back to each level
above. The person sees where the page sits in the hierarchy and goes up a level with one click.

**When to use:**

- On a page that sits inside a hierarchy, when the person needs to go up a level.
- Choose the trail by the real path of the page: 2, 3 or 4 levels drawn, or `collapsed` when the
  path does not fit the width.
- `collapsed` on a narrow screen: the trail keeps one line, with the first level and the last two
  in view.
- Icons when the trail needs them, on every level; without icons, on none.
- At the top of the page content, above the title.

**When NOT to use:**

- **As the navigation menu of the product** — the trail shows where the page is, not where the
  person can go; use the navigation menu.
- **As tabs that switch the content of one page** — use tabs.
- **As a back button** — the trail leads to the levels of the path and does not show the history
  of visited pages.
- **For a path with a single level** — the trail has at least the first level and the current
  page.
- **As a loading state** — while the page loads, a line of `nph-skeleton` takes the place of the
  trail.

## Variants

| Variant | Values | Choose when |
|---|---|---|
| Trail | 2, 3 or 4 levels drawn; `collapsed` | 2, 3 or 4 levels when the path fits the width; `collapsed` when the path has 4 levels or more and does not fit, or on a narrow screen |
| Icons | Without icons, or with icons on every level | Without icons when the text is enough; with icons when each level has a figure that helps to recognize it |

The trail is the Figma property `niveis`, with the values `2`, `3`, `4` and `recolhido`
(collapsed): the numbers say how many levels show, the current page included. The icons are the
Figma property `ícones`, with the values `sem` (without) and `com` (with); the item has the
Figma boolean `ícone`, which the code reads from the `icon` of each level. The item is a link or
the current page: the Figma property `tipo`, with the values `link` and `atual` (current); in
code, the current page is the last level, the one with no `href`.

**By size and density:** `not_applicable`. The trail has a single size, with the label in Noto
Sans, regular on a link and medium on the current page.

**Do not combine with:** `collapsed` with fewer than 4 levels; more than 4 levels without
`collapsed`; `collapsed` without `ellipsis-label`; an icon on only some of the levels; an `href`
on the current page.

## States

| Part | State | Token | What changes for the person |
|---|---|---|---|
| Link | Rest | `breadcrumb/link-foreground` | The level shows in the muted color, in regular weight, with no underline |
| Link | Hover | `breadcrumb/link-foreground-hover` | The text and the icon take the stronger color and the text is underlined |
| Link | Focus | `breadcrumb/link-foreground-focus`, `focus/border`, `focus/halo` | For keyboard users, the stronger color and a border and a halo outside the link |
| Current page | Rest | `breadcrumb/current-foreground` | The strongest color, in medium weight, with the solid icon when there are icons. It has no hover and takes no focus |
| Ellipsis | Rest | `breadcrumb/ellipsis-foreground` | The icon in the muted color, with no background |
| Ellipsis | Hover | `breadcrumb/ellipsis-foreground-hover`, `breadcrumb/ellipsis-background-hover` | The icon takes the stronger color and the button takes a background |
| Ellipsis | Focus | `breadcrumb/ellipsis-foreground`, `focus/border`, `focus/halo` | For keyboard users, a border and a halo outside the button; the icon keeps the color of rest |
| Ellipsis | Open | `breadcrumb/ellipsis-foreground-hover`, `breadcrumb/ellipsis-background-hover` | While the menu of hidden levels is open, the button keeps the look of hover, even with the pointer away |

In the Figma set of the item, the property `state` has the values `default`, `hover` and `foco`
(focus), and only the link changes state. In the Figma set of the ellipsis, `state` has the
values `default`, `hover`, `foco` and `aberto` (open).

**Feedback and focus:** focus shows only for keyboard users and **is not removed**. The link and
the ellipsis show the same two layers outside the box, a border and a halo, without changing its
size. The current page takes no focus.

**Business rule the piece carries:**

- The last level is the current page: text, with `aria-current` page and no `href`. Every level
  above it is a link and has an `href`.
- The first level reads "Home". With icons, the house goes next to the text, never alone.
- The collapsed trail draws the first level, the ellipsis and the last two levels. The levels in
  between sit in the menu of the ellipsis, in path order, as text only, with no header and no
  group label.
- With icons, every level has its own: light on a link and solid on the current page, in the same
  color as its label.
- The consumer chooses `collapsed`. The piece does not collapse by itself when the width runs
  short.
- The trail is on one line: it never wraps and never shrinks.
- Activating a hidden level in the menu leads where its visible link would. The piece fires no
  event of its own.
- Every text comes from the consumer, already localized: the piece writes no word of its own.
- There is no loading state. While the page loads, a line of `nph-skeleton` takes the place of the
  trail.

**Domain error states:** an invalid `levels`, a `collapsed` that breaks its rule, a level that
breaks its rule or an icon outside the core draws nothing and emits `console.error` in
development, one per cause. A trail with no accessible name draws and warns once in development.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | A `nav`, named, holding an ordered list. Each level is a list item: a link above the current page, and the current page as text with `aria-current` page. The separators and the level icons are decorative and hidden from assistive technology: the name of a level is its label. The ellipsis is a native `button` of the shadow root, which the menu beside it finds by `for` and on which it writes `aria-haspopup` and `aria-expanded` |
| Accessible name | The landmark: `label`, else the `aria-label` of the host. A level: its label. The ellipsis: `ellipsis-label`, because its icon has no text |
| Keyboard | Tab moves through the links in path order, and through the ellipsis between the first level and the last two; the current page and the separators take no Tab. Enter activates a link. On the ellipsis, Enter, Space and ↓ open the menu of hidden levels; in the menu, the arrows move, Enter and Space activate, and Esc closes and gives the focus back to the ellipsis |
| Focus | Keyboard only, on the link and on the ellipsis: a border of `border/width` in `focus/border` and a halo in `focus/halo` outside the box, without changing its size. The border carries the focus; the halo is reinforcement. The current page takes no focus |
| Contrast | The links, the separator, the link icons and the ellipsis at rest, in the muted color, and the current page, in the strongest color, pass the required WCAG level over the background in both themes. The current page has the highest contrast of the trail, never lower than the links |
| Alternative to color | The current page is told apart without color: it is not a link, it has medium weight and, with icons, the solid icon. The hover of a link adds the underline to the change of color |
| Touch target | The ellipsis is a 24 by 24 area (`breadcrumb/ellipsis-target-size`). The links are as tall as the line, and the separator between two of them keeps them apart, which meets the spacing exception of the target size rule |
| Known limits | (a) The trail never wraps and never shrinks: when the width runs short, the consumer uses `collapsed`; the page chooses, not the piece. (b) The hug of the menu width, between `breadcrumb/menu-min-width` and `breadcrumb/menu-max-width`, depends on `calc-size()`, in Chromium 129 and later and in the other browsers that support it; where it does not exist, the menu keeps `breadcrumb/menu-max-width` as its fixed width, as `nph-dropdown-menu` does by itself, and the text is cut at that ceiling: the hug and the floor do not hold. (c) The menu of the hidden levels carries no icon, because the contract does not say it does (D-2). (d) A trail with 5 or more levels without `collapsed` does not exist in the accepted contract, and the code refuses it (D-1). (e) Activating a hidden level in the menu clicks a hidden anchor of the shadow root with the same `href`: a native click, `composed` and cancelable; `target` and the modifier keys do not apply to it. (f) The radius of the menu and the focus border of its item are reviewed in a round of `nph-dropdown-menu` itself. (g) The piece has no loading state: while the page loads, a line of `nph-skeleton` takes the place of the trail, as the documentation rule says |

## Relations

**Combines with:** `nph-icon`, which draws the level icons, the separator and the ellipsis, and
`nph-dropdown-menu`, which holds the hidden levels of the collapsed trail. A line of
`nph-skeleton` takes the place of the trail while the page loads.

**What is the parent:** the top of the page content, above the title. It does not replace the
navigation menu, the tabs or the back button.

**What is the child:** `nph-icon` and, on the collapsed trail, `nph-dropdown-menu`, drawn by the
piece. The link is an inner piece of the breadcrumb, not a tag of its own, until an `nph-link`
exists.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Link | `breadcrumb/link-foreground`, `breadcrumb/link-foreground-hover`, `breadcrumb/link-foreground-focus`, `breadcrumb/link-font-weight` |
| Current page | `breadcrumb/current-foreground`, `breadcrumb/current-font-weight` |
| Separator | `breadcrumb/separator-foreground`, `breadcrumb/icon-size` |
| Level icon | `breadcrumb/item-icon-size`, `breadcrumb/item-icon-gap` |
| Ellipsis | `breadcrumb/ellipsis-foreground`, `breadcrumb/ellipsis-foreground-hover`, `breadcrumb/ellipsis-background-hover`, `breadcrumb/ellipsis-target-size`, `breadcrumb/icon-size` |
| Radius | `breadcrumb/item-radius`, on the link, the current page and the ellipsis |
| Gap between the parts | `breadcrumb/gap` |
| Label typography | `breadcrumb/font-family`, `breadcrumb/font-size`, `breadcrumb/line-height`, `breadcrumb/letter-spacing` |
| Hidden levels menu width | `breadcrumb/menu-min-width`, `breadcrumb/menu-max-width` |
| Focus | `focus/border`, `border/width`, `focus/border-radius-control`, `focus/halo`, `focus/ring-width`, `focus/radius-control-with-border` |

**Usage restrictions:** the piece does not choose color, radius, size or typography: everything
comes from a token. The hidden levels menu is an `nph-dropdown-menu` and keeps its own tokens,
except the floor and the ceiling of its width, which the breadcrumb sets for its own menu only.
The piece has no slot, no event, no `::part` and no color property.

**AI hints:**

- Use `nph-breadcrumb` at the top of a page that sits inside a hierarchy, above the title; for the
  navigation of the product use the navigation menu, for tabs use tabs.
- Give `levels` from the first level to the current page: every level above has `label` and
  `href`, and the last one has only `label`.
- Write the first level as "Home", and keep the labels short and equal to the title of the
  target page.
- Choose `collapsed` when the trail does not fit the width, and then give `ellipsis-label`; the
  piece does not collapse by itself.
- Give the trail a `label`, or an `aria-label`, because it is the accessible name of the
  navigation landmark.
- Put an icon on every level or on none, and never on the first level alone.
- While the page loads, show a line of `nph-skeleton` in place of the trail.

## Examples

**Recommended case:** a trail of two levels, text only: "Home" as a link and the current page at
the end.

**Alternative case:** a trail with icons, each level with its own icon and the current page with
the solid one; a long path collapsed, with the first level, the ellipsis and the last two, and
the menu of the middle levels open.

## Anti-patterns

- **Do not use the trail as the navigation menu, as tabs or as a back button.**
- **Do not make the current page a link** — it is the last level, in text; a link would lead to
  the page itself.
- **Do not let the trail wrap or overflow the width** — use `collapsed`, which keeps one line.
- **Do not put an icon on only some of the levels** — with icons, on all; without, on none.
- **Do not leave the house alone on the first level** — put the text "Home" next to it.
- **Do not leave the trail without a name** — give `label` or `aria-label`.
- **Invalid combinations:** `collapsed` with fewer than 4 levels; more than 4 levels without
  `collapsed`; `collapsed` without `ellipsis-label`; an `href` on the current page or a level
  above it without one; an icon on only some of the levels.
- **Do not create without a decision:** an `nph-link`, an icon in the menu of the hidden levels,
  a trail of 5 or more levels without `collapsed`, a collapse by width done by the piece.

## Sources and decisions

- **The repository `design.md`:** the `breadcrumb/*` tokens, the colors they point to and the
  global `focus/*` tokens.
- **The decision that originated it:** P109.
- **Tests:** `src/components/nph-breadcrumb/nph-breadcrumb.test.ts`.
- **Usage evidence:** no screen consumes it yet.
- **Storybook:** `src/components/nph-breadcrumb/nph-breadcrumb.stories.ts` and
  `nph-breadcrumb.docs.stories.ts`.
- **Figma:** the `nph-breadcrumb` documentation frame (`4512:4741`), the sets `4490:2886`,
  `4490:2678` and `4490:2697` and the separator `1635:16` in `DS-IA-NEPHOS 5.0`.
