---
piece: nph-hover-card
level: component
status: active
solves: >-
  Previews the destination of a link in a read-only card, with a title, a description and a meta
  line, opened when the pointer rests on the link or when the link takes keyboard focus, so the
  person decides whether to follow the link without leaving the page.
use_when:
  - "Next to a link to a profile, a page or an item, when the link is the main path and a preview helps decide whether to open it."
  - "When everything the card shows also exists at the destination."
  - "With the meta line for a time or a context detail; without it when it does not help the decision."
  - "With the arrow when several links sit close together or the card lands far from the link; without it by default."
  - "Opening below by default; another side only when the space runs out."
do_not_use_when:
  - "To put a button, a link or a field in the card, or anything the person must act on: use nph-popover, which opens on click and accepts actions."
  - "For a short text about an element: use nph-tooltip."
  - "For content the person must answer or finish before going on: use nph-dialog."
  - "To keep in the card information that is not at the destination: the card is a preview of the destination, and on touch it never opens."
  - "For a long description: the card takes a title, one or two short sentences and one meta line; the detail stays at the destination."
  - "For a link whose destination cannot be summed up in a title and a description."
api:
  href:
    type: string
    required: true
    default: "unset"
    reflects: false
    constraint: >-
      The destination of the link, in the shadow root of the piece. It takes http, https or a
      relative address, parsed as the browser would, so javascript and its obfuscated spellings
      are refused; mailto and tel are not accepted. Empty or unsafe draws the link with no
      destination and no card, and emits console.error in development, one per cause. The link
      has no target, rel or download.
  heading:
    type: string
    required: true
    default: "empty"
    reflects: false
    constraint: >-
      The title of the card, the Figma property `título`, already localized: the short name of
      the destination. It is not called title, because that is the native tooltip attribute.
      Empty or whitespace-only draws no card and emits console.error in development.
  description:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The summary of the destination, the Figma property `descrição`, already localized: one or
      two short sentences. It wraps and the card never scrolls or cuts it. Empty leaves the line
      out.
  meta:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The short text of the meta line, the Figma property `meta`, already localized: a phrase, a
      date or a time such as 14:30. Empty or whitespace-only turns the line off, which is the
      Figma boolean `mostrar meta`. The consumer calculates the time: relative up to 30 days,
      then the full date; the piece writes no word and computes nothing.
  meta-icon:
    type: string
    required: false
    default: clock
    reflects: false
    constraint: >-
      The core name of the nph-icon of the meta line, the Figma property `ícone da meta`, in the
      light style. clock for a phrase or a time, calendar for a date. A name outside the core,
      while the meta line shows, draws no card and emits console.error in development; while the
      line is off the name is not read.
  meta-title:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The full date, already localized. It becomes the title of the meta text, so the person
      who sees a relative time or a time can read the full date. The consumer gives it whenever
      the meta is relative or a time; the piece does not require it.
  side:
    type: enum
    values: [bottom, top, left, right]
    required: false
    default: bottom
    reflects: true
    constraint: >-
      The preferred side of the card, the Figma property `lado`, with the values `baixo`,
      `cima`, `esquerda` and `direita`. The card flips to the opposite side when the preferred
      one does not fit, takes the side with the most room when neither fits, and never leaves
      the window. Any other value draws no card and emits console.error in development.
  arrow:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      Draws the arrow whose tip points to the link, the Figma property `seta` with the values
      `sem` and `com`. Reflects so the consumer can style and check the state.
  open:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The state of the card. The piece turns it on and off by itself: pointer, keyboard focus,
      leave, blur and Esc. The consumer may turn it on to show the card open, and the same
      closing rules apply; a card that cannot be drawn never opens. Reflects so the consumer can
      style and check the state.
  slots:
    default: "the text of the link, the Figma property `texto do gatilho`, required"
    media: "optional, at the start of the card: the avatar, image or badge of the required examples; takes no room while empty"
  events: none
variants:
  arrow:
    axis: appearance
    choose_when: "Without the arrow (`sem`) by default; with the arrow (`com`) when several links sit close together or the card lands far from the link."
    do_not_combine_with: []
  side:
    axis: appearance
    choose_when: "Bottom (`baixo`) by default; top (`cima`), left (`esquerda`) or right (`direita`) only when the space below runs out or the layout asks for it."
    do_not_combine_with: ["a side outside the list"]
states:
  link-rest:
    token: "color/primary"
    changes_for_user: "The link shows in the primary color, underlined, in the label-md text role."
  link-focus:
    token: "hover-card/focus-border, hover-card/focus-halo"
    changes_for_user: "For keyboard users, a border and a halo outside the link mark the focus, and the card opens with no wait."
  card-closed:
    token: not_applicable
    changes_for_user: "The card is not shown. The link is all there is on the page."
  card-open:
    token: "hover-card/background"
    changes_for_user: "The card is shown next to the link, at hover-card/offset, entering on hover-card/enter-duration and leaving on hover-card/exit-duration."
business_rules:
  - "The pointer resting on the link opens the card after hover-card/open-delay. Leaving before the wait ends opens nothing, and a press on the link during the wait cancels it."
  - "Keyboard focus on the link opens the card with no wait. A mouse click that focuses the link does not match keyboard focus and opens nothing."
  - "The card closes hover-card/close-delay after the pointer leaves the link and the card. The pointer may go onto the card and it stays open while the pointer is there (WCAG 1.4.13). Coming back to the link or to the card during the wait keeps it open, with no new wait."
  - "Losing focus closes the card with no wait: there is no card to cross by keyboard. While the focus is on the link, the card stays open even when the pointer leaves."
  - "Esc closes the card with no wait, only while it is open, and does not reach a dialog around it. The card stays closed until the pointer and the focus are both gone."
  - "Touch opens nothing: there is no hover, and the tap follows the link to the destination. A touch event never closes a card that the keyboard opened."
  - "The card is read only: no button, link or field inside, no focus, no role and no aria-describedby on the link. Everything the card shows also exists at the destination."
  - "The card is a manual popover in the top layer: no z-index and no clipping by an ancestor with overflow. Light dismiss does not close it."
  - "The card is 4 from the link, or from the tip of the arrow, with and without the arrow. With the arrow the card sits at the offset plus the arrow height minus the border width, because the arrow overlaps the card by the width of its border."
  - "The card is hover-card/width wide and the width never changes."
  - "The card aligns to the link by the start edge, mirrored in right-to-left writing: the center of the link sits at the arrow inset plus half the arrow base from the start corner of the card, with and without the arrow, so the card does not move when the arrow is turned on (D-2)."
  - "The card flips to the opposite side when the preferred one does not fit. It is kept inside the window; the arrow keeps pointing to the center of the link, inside the rounded corners."
  - "While the link is outside the window, the card is not drawn at the edge; it follows the link on scroll and resize."
  - "The meta is the consumer's text. Time is relative up to 30 days, as in Updated today or 3 days ago, then the full date; a time reads 14:30; the full date always goes in meta-title. The piece writes no word and computes no time."
  - "The meta line turns off with an empty meta: the card keeps only the title and the description."
  - "The slot media sits first in the card, only to compose the avatar, image or badge of the required examples (D-1). It is not a place for actions."
  - "Every text comes from the consumer, already localized: the piece writes no word of its own."
domain_errors:
  - "An empty or unsafe href: the link draws with no destination, no card is drawn and console.error is emitted in development, one per cause."
  - "An empty heading: no card is drawn and console.error is emitted in development, one per cause."
  - "A side outside bottom, top, left and right: no card is drawn and console.error is emitted in development."
  - "A meta-icon outside the core while the meta line shows: no card is drawn and console.error is emitted in development."
  - "A delay token that is not defined, because the tokens are not loaded: the card opens and closes with no wait and console.error is emitted in development, once."
tokens:
  surface: "hover-card/background, hover-card/border, hover-card/border-width, hover-card/radius, hover-card/width, elevation/dropdown"
  spacing: "hover-card/padding, hover-card/gap, hover-card/meta-gap"
  title: "hover-card/foreground, text/label-lg"
  description: "hover-card/description-foreground, text/body-sm"
  meta: "hover-card/meta-foreground, hover-card/meta-icon-foreground, hover-card/icon-size, text/caption"
  link: "color/primary, text/label-md, radius/inner"
  arrow: "hover-card/arrow-width, hover-card/arrow-height, hover-card/arrow-inset, hover-card/background, hover-card/border"
  distance: hover-card/offset
  delay: "hover-card/open-delay, hover-card/close-delay"
  motion: "hover-card/enter-duration, hover-card/exit-duration, motion/enter-easing, motion/exit-easing, motion/hover-duration"
  focus: "hover-card/focus-border, hover-card/focus-halo, focus/ring-width, focus/border-radius-inner, focus/radius-inner-with-border"
ai_hints:
  - "Use nph-hover-card next to a link whose destination can be summed up in a title and a short description; for a short text about an element use nph-tooltip, and for content with an action use nph-popover."
  - "Give href, the text of the link in the default slot and heading; description and meta are optional."
  - "Never put an action, a link or a field in the card, and never keep in it what the destination does not show: the card is a preview."
  - "Write the meta as the consumer: relative up to 30 days, then the full date, and put the full date in meta-title; choose calendar for a date and keep clock for a phrase or a time."
  - "Leave the arrow off by default; turn it on when several links sit close together or the card lands far from the link."
  - "Leave the side at bottom; choose another only when the space below runs out, since the card flips by itself when it does not fit."
  - "Use the slot media only for an avatar, an image or a badge, as in the required examples."
  - "Do not rely on the card on touch: it never opens there, and the tap follows the link."
accessibility:
  semantics: "A native link, in the shadow root, named by its text. The card is a plain container in the top layer, with no role, never focusable and with no aria-describedby on the link. The arrow and the meta icon are decorative and hidden from assistive technology. A closed card is not displayed, so assistive technology does not reach it: the content is reached through the link."
  accessible_name: "The link: the text of the default slot. The card has no name of its own and takes none from the link."
  keyboard:
    - "Tab moves focus to the link and opens the card with no wait."
    - "Enter on the link follows it, as on any link."
    - "Esc closes the card and does not reach a dialog around it; the focus stays on the link."
    - "Tab away from the link closes the card with no wait."
  focus: "Keyboard only, on the link: a border of hover-card/border-width in hover-card/focus-border and a halo of focus/ring-width in hover-card/focus-halo outside the box, as nph-button. The card takes no focus and has no focus state."
  contrast: "The title, the description and the meta pass 4.5 to 1 over the card in both themes, and the meta is never below that floor. The link in color/primary passes in the default brand in both themes; in the dark scheme of the Gerencial brand it measures 2.71 to 1, and in other brands up to 3.81 to 1, a limit inherited from color/primary of each brand (point 9 of the accepted contract), which is not fixed here. The card border is decorative and the shadow separates the card from the page in light."
  color_alternative: "The link is underlined, not told only by color. The meta stands apart by its icon and its place at the end of the card, not only by its shade."
invalid_combinations:
  - "An action, a link or a field inside the card: the card is read only; use nph-popover."
  - "A heading left out or empty: no card is drawn."
  - "An href that is empty or takes a protocol other than http and https: no card is drawn."
  - "A side outside bottom, top, left and right: no card is drawn."
  - "A meta-icon outside the core while the meta line shows: no card is drawn."
  - "A card that is the only place for information the destination does not have: on touch it never opens."
  - "Anything but an avatar, an image or a badge in the slot media."
relations:
  combines_with: [nph-icon, nph-avatar, nph-image, nph-badge]
  parents: ["a sentence or a line of text that holds the link"]
  children: [nph-icon, nph-avatar, nph-image, nph-badge]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Putting a button, a link or a field in the card."
  - "Using the card for a short text about an element, which is nph-tooltip."
  - "Leaving in the card information that is not at the destination."
  - "Writing a long description in the card."
  - "Computing the time inside the card instead of giving the meta already written, with the full date in meta-title."
  - "Choosing the meta icon against the kind of text."
  - "Relying on the card on touch."
  - "Asking the card to be a dialog, a menu or a form."
sources:
  design_md: "design.md, the hover-card/* tokens, color/subtle-foreground, color/popover, color/border-subtle, color/primary, elevation/dropdown, the text roles and the global focus/* tokens"
  decision: "P112 — nph-hover-card: API and semantics"
  tests: "src/components/nph-hover-card/nph-hover-card.test.ts"
  usage_evidence: "no screen consumes it yet"
  storybook: "src/components/nph-hover-card/nph-hover-card.stories.ts and nph-hover-card.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-hover-card documentation frame 4422:2418 on page 4128:31754, component set 4406:1105, examples 4406:1107, 4406:1130 and 4406:1151"
---

# nph-hover-card

## Function

**The problem it solves:** previews the destination of a link in a read-only card. The card opens when
the pointer rests on the link or when the link takes keyboard focus, and sums up the destination with a
title, a description and a meta line, so the person decides whether to follow the link without leaving
the page. Everything the card shows also exists at the destination.

**When to use:**

- Next to a link to a profile, a page or an item, when the link is the main path and a preview helps
  decide whether to open it.
- When everything the card shows also exists at the destination.
- With the meta line for a time or a context detail; without it when it does not help the decision.
- With the arrow when several links sit close together or the card lands far from the link; without
  it by default.
- Opening below by default; another side only when the space runs out.

**When NOT to use:**

- **To put a button, a link or a field in the card, or anything the person must act on** — use
  `nph-popover`, which opens on click and accepts actions.
- **For a short text about an element** — use `nph-tooltip`.
- **For content the person must answer or finish before going on** — use `nph-dialog`.
- **To keep in the card information that is not at the destination** — the card is a preview of the
  destination, and on touch it never opens.
- **For a long description** — the card takes a title, one or two short sentences and one meta line;
  the detail stays at the destination.
- **For a link whose destination cannot be summed up in a title and a description.**

## Variants

| Variant | Values | Choose when |
|---|---|---|
| Arrow | Without the arrow, or with the arrow | Without by default; with when several links sit close together or the card lands far from the link |
| Side | Bottom, top, left or right | Bottom by default; another side only when the space below runs out or the layout asks for it |

The arrow is the Figma property `seta`, with the values `sem` (without) and `com` (with). The side is the
Figma property `lado`, with the values `baixo` (bottom), `cima` (top), `esquerda` (left) and `direita`
(right); in the Figma set the side varies only with the arrow, and without it the card opens below.
The opening is the Figma property `abertura`, with the values `ponteiro` (pointer) and `foco` (focus): in
code it is not a property, since the pointer and the focus open the same card by themselves. The
content properties are `texto do gatilho`, `título`, `descrição`, `meta`, `mostrar meta` and
`ícone da meta`; the code reads them from the default slot, `heading`, `description`, `meta` (empty
turns the line off) and `meta-icon`.

**By size and density:** `not_applicable`. The card has a single width, `hover-card/width`, in every
variant.

**Do not combine with:** a side outside the list; an action, a link or a field in the card.

## States

| Part | State | Token | What changes for the person |
|---|---|---|---|
| Link | Rest | `color/primary` | The link shows in the primary color, underlined, in the label-md text role |
| Link | Focus | `hover-card/focus-border`, `hover-card/focus-halo` | For keyboard users, a border and a halo outside the link, and the card opens with no wait |
| Card | Closed | `not_applicable` | The card is not shown |
| Card | Open | `hover-card/background` | The card is shown next to the link, at `hover-card/offset` |

In the Figma set the property `abertura` has the values `ponteiro` and `foco`: with `foco` the link shows
the focus border and halo; the card is the same. The link has no hover state of its own in the contract.

**Feedback and focus:** the link shows focus only for keyboard users and **it is not removed**. The focus
is two layers outside the box, a border and a halo, drawn as the focus of `nph-button`, without changing
the size of the link. The card takes no focus and has no focus state.

**Opening and closing:** the pointer opens the card after resting `hover-card/open-delay` on the link;
leaving before the wait ends opens nothing, and a press on the link during the wait cancels it. Keyboard
focus opens it with no wait. The card closes `hover-card/close-delay` after the pointer leaves the link
and the card, and the pointer may go onto the card without closing it. Losing focus closes it with no
wait. Esc closes it with no wait and does not reach a dialog around it. Touch opens nothing: the tap
follows the link.

**Motion:** the card enters on `hover-card/enter-duration` and leaves on `hover-card/exit-duration`, each
with the easing of its role, animating only opacity. With reduced motion, the duration is the one of
`motion/hover-duration`; the card still appears and still leaves.

**Business rule the piece carries:**

- The card is read only: no button, link or field, no focus, no role and no `aria-describedby` on the
  link. Everything it shows also exists at the destination.
- The card is `hover-card/offset` from the link, or from the tip of the arrow, with and without the arrow;
  with the arrow the card sits at the offset plus the arrow height minus the border width, because the
  arrow overlaps the card by the width of its border.
- The card is `hover-card/width` wide.
- The card aligns to the link by the start edge, mirrored in right-to-left writing, with the same rule
  with and without the arrow, so it does not move when the arrow is turned on (D-2).
- The card flips to the opposite side when the preferred one does not fit and is kept inside the window;
  the arrow keeps pointing to the center of the link.
- Time in the meta is relative up to 30 days, then the full date; a time reads `14:30`; the full date
  always goes in `meta-title`. The consumer calculates it: the piece writes no word and computes no time.
- Every text comes from the consumer, already localized.

**Domain error states:** an empty or unsafe `href`, an empty `heading`, a `side` outside the list or a
`meta-icon` outside the core while the meta line shows draws no card, keeps the link and emits
`console.error` in development, one per cause. A delay token that is not defined (the tokens are not
loaded) makes the card open and close with no wait and reports it once.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | A native link, in the shadow root, named by its text. The card is a plain container in the top layer, with no role, never focusable and with no `aria-describedby` on the link. The arrow and the meta icon are decorative and hidden from assistive technology. A closed card is not displayed, so assistive technology does not reach it: the content is reached through the link |
| Accessible name | The link: the text of the default slot. The card has no name of its own and takes none from the link |
| Keyboard | Tab moves focus to the link and opens the card with no wait. Enter follows the link. Esc closes the card and does not reach a dialog around it; the focus stays on the link. Tab away closes it with no wait |
| Visible focus | Keyboard only, on the link: a border of `hover-card/border-width` in `hover-card/focus-border` and a halo of `focus/ring-width` in `hover-card/focus-halo` outside the box. The border carries the focus; the halo is reinforcement. The card takes no focus |
| Pointer (WCAG 1.4.13) | The pointer may go from the link to the card without closing it, the card stays open while the pointer is over it, and Esc dismisses it |
| Contrast | The title, the description and the meta pass 4.5:1 over the card in both themes; the meta is one step softer than the description, never below the floor. The link in `color/primary` passes in the default brand in both themes |
| Alternative to color | The link is underlined, not told only by color. The meta stands apart by its icon and its place at the end of the card |
| Touch target | The link is a text link as tall as its line. It meets the target size rule by the spacing exception, when no other target sits closer than the minimum, or, inside a sentence, by the inline link exception. The card has no target. On touch there is no hover: the content of the card must exist at the destination |
| Known limits | (a) The link is an `a` of the shadow root of the piece, not the link of the consumer: it has no `target`, `rel` or `download`, and a click on it reaches the document as a composed event whose `target` is the host, not the anchor: a router that listens to the click on the document must find the anchor in `event.composedPath()`, and one that looks for it with `event.target.closest('a[href]')` does not see it and may leave a full page navigation to happen. (b) The width is `hover-card/width` in every variant; only a window narrower than the card makes it shrink, to the width of the window. (c) The focus of the link is drawn by two pseudo-element layers, and the link is inline-block, so a link that breaks across lines draws the ring around the whole box instead of around each line. (d) The contrast of the link in the dark scheme is 2.71:1 in the Gerencial brand and up to 3.81:1 in others, a limit inherited from `color/primary` of each brand (point 9 of the accepted contract); the underline stays, and this piece does not change it. (e) In a window too short for the card and its link, the card stays beside the link, never over it, and the window cuts what does not fit: the card does not scroll. (f) The card is a preview with no action: on touch it never opens, so it is never the only way to the content |

## Relations

**Combines with:** `nph-icon`, which draws the meta icon; and, in the required examples, `nph-avatar`,
`nph-image` and `nph-badge` through the slot `media`, each controlling its own color.

**What is the parent:** a sentence or a line of text that holds the link. The host sits in the flow of the
text, like the link it holds.

**What is the child:** `nph-icon` in the meta line, drawn by the piece, and, in the slot `media`, an
`nph-avatar`, an `nph-image` or an `nph-badge` of the consumer.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

**Responsibility boundary:** the piece opens, closes and places itself. The consumer says where the link
goes (`href`), what it reads (the default slot), what the card says (`heading`, `description`, `meta`,
`meta-title`) and calculates the time. The card never carries an action: that belongs to `nph-popover`.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Card fill and arrow fill | `hover-card/background` |
| Title | `hover-card/foreground` and `text/label-lg` |
| Description | `hover-card/description-foreground` and `text/body-sm` |
| Meta text | `hover-card/meta-foreground` and `text/caption` |
| Meta icon | `hover-card/meta-icon-foreground` and `hover-card/icon-size` |
| Border and arrow outline | `hover-card/border` and `hover-card/border-width` |
| Radius | `hover-card/radius` |
| Inner margin | `hover-card/padding` |
| Between title, description and meta | `hover-card/gap` |
| Meta icon to meta text | `hover-card/meta-gap` |
| Width | `hover-card/width` |
| Link to card, or to the arrow tip | `hover-card/offset` |
| Arrow | `hover-card/arrow-width`, `hover-card/arrow-height` and `hover-card/arrow-inset` |
| Link | `color/primary`, `text/label-md` and `radius/inner` |
| Link focus | `hover-card/focus-border`, `hover-card/focus-halo`, `focus/ring-width`, `focus/border-radius-inner` and `focus/radius-inner-with-border` |
| Wait before opening | `hover-card/open-delay` |
| Wait before closing | `hover-card/close-delay` |
| Enter | `hover-card/enter-duration` and `motion/enter-easing` |
| Exit | `hover-card/exit-duration` and `motion/exit-easing` |
| Reduced motion | `motion/hover-duration` |
| Shadow | `elevation/dropdown`, with no component token: diffuse in light, none in dark |

**Usage restrictions:** the piece does not choose color, radius, size, distance, wait or typography:
everything comes from a token. The meta is one step softer than the description, through
`hover-card/meta-foreground`; do not swap it for the description color. Some of these tokens point
straight to the base values of the floating layer family, by decision of the accepted contract: radius,
offset, arrow width, height and inset, width and the two waits; the piece reads them only through its own
`hover-card/*` names. The piece has no event, no `::part` and no color property.

**AI hints:**

- Use `nph-hover-card` next to a link whose destination can be summed up in a title and a short
  description; for a short text about an element use `nph-tooltip`, and for content with an action use
  `nph-popover`.
- Give `href`, the text of the link in the default slot and `heading`; `description` and `meta` are
  optional.
- Never put an action, a link or a field in the card, and never keep in it what the destination does not
  show: the card is a preview.
- Write the meta as the consumer: relative up to 30 days, then the full date, and put the full date in
  `meta-title`; choose `calendar` for a date and keep `clock` for a phrase or a time.
- Leave the arrow off by default; turn it on when several links sit close together or the card lands far
  from the link.
- Leave the side at `bottom`; choose another only when the space below runs out, since the card flips by
  itself when it does not fit.
- Use the slot `media` only for an avatar, an image or a badge, as in the required examples.
- Do not rely on the card on touch: it never opens there, and the tap follows the link.

## Examples

**Recommended case:** a link to a page inside a sentence, with the card below it: the title of the page,
a description of one or two short sentences and a meta line with a relative time and the `clock` icon,
the full date in `meta-title`.

**The three required examples,** in light and in dark, each composed with the slot `media` or the meta line:

1. **Profile:** an `nph-avatar` in the slot `media`, the name as the `heading`, the role as the
   `description` and the start date as the `meta`, with the `calendar` icon.
2. **Link summary with an image and a date:** an `nph-image` in the slot `media`, the title of the
   destination, a short summary and the date as the `meta`, with the `calendar` icon.
3. **Item with a status and a time:** an `nph-badge` with the status in the slot `media`, the name of the
   item, a short description and a time such as `14:30` as the `meta`, with the `clock` icon.

**Alternative case:** the card with the arrow and with the card opening on each side; the card
without the meta line, with only the title and the description; the card flipped to the opposite side
because the preferred one does not fit.

## Anti-patterns

- **Do not put a button, a link or a field in the card** — the card goes away when the pointer leaves;
  whoever needs to act opens the destination, or the content moves to `nph-popover`.
- **Do not use it for a short text about an element** — use `nph-tooltip`.
- **Do not leave in the card information that is not at the destination** — on touch and with a screen
  reader the way to the content is the link; put it on the destination page too.
- **Do not write a long description** — one or two short sentences; the detail stays at the destination.
- **Do not compute the time inside the card** — give the meta already written, relative up to 30 days and
  then the full date, with the full date in `meta-title`.
- **Do not choose the meta icon against the kind of text** — `clock` for a phrase or a time, `calendar`
  for a date.
- **Do not rely on the card on touch** — it never opens there.
- **Do not ask the card to be a dialog, a menu or a form.**
- **Invalid combinations:** an empty `heading`; an `href` that is empty or takes a protocol other than
  `http` and `https`; a `side` outside the list; a `meta-icon` outside the core while the meta line shows;
  anything but an avatar, an image or a badge in the slot `media`.
- **Do not create without a decision:** an action in the card, a loading state with remote content, a
  width other than `hover-card/width`, an `nph-link` for the trigger, a `target` or `rel` on the link, a
  `for` that attaches the card to a link outside the piece, an event of the piece.

## Sources and decisions

- **The repository `design.md`:** the `hover-card/*` tokens, the colors they point to, `color/subtle-foreground`
  and the global `focus/*` tokens.
- **The decision that originated it:** P112, with D-1 (the slot `media`) and D-2 (the alignment of the card to
  the link) pending.
- **Tests:** `src/components/nph-hover-card/nph-hover-card.test.ts`.
- **Usage evidence:** no screen consumes it yet.
- **Storybook:** `src/components/nph-hover-card/nph-hover-card.stories.ts` and
  `nph-hover-card.docs.stories.ts`.
- **Figma:** the `nph-hover-card` documentation frame (`4422:2418`) on the page `4128:31754`, the component
  set `4406:1105` and the examples `4406:1107`, `4406:1130` and `4406:1151` in `DS-IA-NEPHOS 5.0`.
