---
piece: nph-card
level: component
status: active
solves: >-
  Groups on one surface the content and the actions of one subject, for the person to read,
  compare or open that subject: the summary of a record, an item of a collection or a block of
  data on a detail page.
use_when:
  - "A subject stands on its own and has its own actions, such as open or approve: the base type, choosing between actions inside the card or the whole card clickable."
  - "An item of a collection leads to another page and holds nothing interactive inside: the clickable type."
  - "A block of data of a detail page, with one action such as edit in the header: the section type."
  - "The card sits on the page background: the elevated surface. The card sits inside another surface or in a dense list: the outlined surface."
  - "A dense list or a narrow panel: the compact density; the default density elsewhere."
  - "The image identifies the item: media at the top. The text is the main thing and the image supports it: media at the side."
  - "The start says what the card is: an icon for the kind of subject, an avatar for a person, an image for an object or a file."
  - "The footer has actions: keep the divider before them. The meta footer of the clickable card has no divider."
do_not_use_when:
  - "For items in sequence with no container of their own: use a list."
  - "For comparing data in columns: use nph-table."
  - "To choose one among several: use nph-rich-option, which is the selectable card."
  - "For content that opens and closes: use nph-collapsible, which is the expandable card."
  - "For a layer that floats over the page: use nph-popover, nph-hover-card or nph-dialog."
  - "For a collection or a gallery: the layout is the product's, a list or a grid of cards."
  - "Inside another card: a card never holds a card."
api:
  type:
    type: enum
    values: [base, clickable, section]
    required: false
    default: base
    reflects: true
    constraint: >-
      The Figma property `tipo`. base is a card with its own content and actions; it takes no focus
      and has no role. clickable is a card whose whole area leads to a destination through the link
      on its title, with the arrow and a meta footer; it has no header action, no tonal section and
      no divider. section is a block of data of a detail page, a region named by its title, with the
      key-value list of items and, when on, a header action with text. Reflects because the internal
      CSS selects the box by it. A value outside the list draws nothing and emits console.error in
      development.
  surface:
    type: enum
    values: [elevated, outlined]
    required: false
    default: elevated
    reflects: true
    constraint: >-
      The Figma property `superfície`. elevated has the soft outline and the raised shadow; in dark
      the shadow goes away and the background above the page separates it with the outline. outlined
      has the same outline and no shadow. Reflects because the internal CSS selects the shadow by
      it. A value outside the list draws nothing and emits console.error in development.
  media:
    type: enum
    values: [none, top, inset-top, side]
    required: false
    default: none
    reflects: true
    constraint: >-
      The Figma property `mídia`. It needs one piece in the media slot, an nph-image. top is the card
      width in 16:9, clipped by the card corner. inset-top sits inside the body padding with the
      corner of the large image. side sits at the start, the card height and about 40 percent of the
      card width, 33 percent in the compact density, with a cover crop; when the card is narrower than
      30rem it moves to the top. For the base and clickable types only: in the section type it is
      ignored and warned once in development. The media box is drawn whenever the value is not none,
      so a card with no piece in the slot leaves an empty box. A piece in the slot while the value is
      none, or while the type is section, is not drawn and is warned once. Reflects because the
      internal CSS selects the box by it. A value outside the list draws nothing and emits
      console.error in development.
  density:
    type: enum
    values: [default, compact]
    required: false
    default: default
    reflects: true
    constraint: >-
      The Figma property `densidade`. default pads the body by card/padding, with the title in
      text/heading-md. compact pads it by card/padding-compact, with the title in text/heading-xs,
      for a dense list and a narrow panel. The start follows the density: the tonal box and the
      avatar, and the image of the start, take the compact size. Reflects because the internal CSS
      selects the box by it. A value outside the list draws nothing and emits console.error in
      development.
  disabled:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The clickable type only. The title is drawn with no href, with role link and aria-disabled true,
      outside the Tab order, the whole card under card/disabled-opacity and with no hover. A disabled
      card needs no href. In the base and section types it is ignored and warned once in development.
      Reflects because the internal CSS selects the look by it.
  loading:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      Any type. The surface, its outline and its padding stay; the content becomes nph-skeleton
      pieces hidden from assistive technology, aria-busy is true and the hidden word
      of loading-label is written outside the hidden node. The title, the description, the start, the
      media, the status, the action, the content and the footer are not drawn; no heading is
      required. The start skeleton stays when the card has a start, and, on the base and section
      types, the divider (unless hide-divider is set) and one action skeleton stay when the card has
      a footer: the skeleton does not invent a part. The clickable type has no footer and is not a
      link while it loads. Reflects
      because the internal CSS selects the look by it.
  heading:
    type: string
    required: true
    default: "empty"
    reflects: false
    constraint: >-
      The title of the card, already localized, one line with an ellipsis when it does not fit; it
      truncates before the status, which never hides. It is the accessible name of the clickable
      card and of the section region. A card that is not loading and has no heading draws nothing and
      emits console.error in development; while it loads the heading is not required. In the
      clickable type write the destination, not a generic word.
  heading-level:
    type: enum
    values: [2, 3, 4, 5, 6]
    required: false
    default: 3
    reflects: false
    constraint: >-
      The level of the title, which is drawn as role heading with aria-level, so a collection of
      cards keeps the outline of the page. The property is headingLevel. A value outside the list,
      or a text that is not a number, draws nothing and emits console.error in development.
  description:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The short text below the title, already localized, in card/description-foreground. Empty draws
      none; the part is on when there is text.
  icon:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The start icon, a core name of nph-icon in the light weight, drawn in the tonal box and chosen
      by the kind of subject. Empty draws none. The start takes one piece at a time: with content in
      the leading slot the icon is ignored and warned once in development. A name outside the core
      draws nothing and emits console.error in development.
  href:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The destination of the title link, for the clickable type; required there unless the card is
      disabled or loading. It takes http, https, mailto, tel or a relative address; any other
      protocol, javascript among them, in any spelling the browser reads as such, draws nothing and
      emits console.error in development, as does a clickable card with none. In the base and section
      types it is ignored and warned once in development.
  loading-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The word the screen reader hears while the card loads, already localized, such as Loading. The
      piece writes no word of its own. Empty with loading on warns once in development: the screen
      reader hears nothing. The property is loadingLabel.
  hide-divider:
    type: boolean
    required: false
    default: false
    reflects: false
    constraint: >-
      The Figma boolean `divisória` is on by default, so the property turns it off. The divider is the
      nph-separator before the footer actions, edge to edge, in card/divider, and it is drawn when the
      footer has content. It has no effect on the clickable card, which has no divider, and says so
      once in development. The property is hideDivider.
  items:
    type: array
    required: false
    default: "empty list"
    reflects: false
    constraint: >-
      Property only. The key-value list of the section type, as a list of { key, value }, both texts
      already localized. key is required and not empty; value is a text and may be empty. It is drawn
      as a description list after the default slot, rows card/list-gap apart, the key at the start of
      the row and the value at its end; a long key or value wraps inside the row. In the base and
      clickable types a list with rows is ignored and warned once in development. A value that is
      not a list of rows with a key and a text value draws nothing, in any type, and emits
      console.error in development.
  slot-media:
    type: "named slot"
    required: false
    default: "none"
    reflects: false
    constraint: >-
      The media zone: one nph-image with src and alt only. The card gives the frame, the width, the
      proportion and the crop, whatever size the image declares. It is not the start. Drawn only
      while media is top, inset-top or side, and not in the section type.
  slot-leading:
    type: "named slot"
    required: false
    default: "none"
    reflects: false
    constraint: >-
      The start zone, in place of the icon: one nph-avatar or one nph-image. The card writes the size
      of the density on it: the avatar large, or medium when compact, and the image medium, or small
      when compact, and writes it again if the piece changes its own. A piece of another tag is left
      as it is. It is decorative, aria-hidden, in the clickable card.
  slot-status:
    type: "named slot"
    required: false
    default: "none"
    reflects: false
    constraint: >-
      The status zone: one nph-badge, secondary and light, next to the title. The part is on when
      there is something in the slot. The title truncates before it.
  slot-action:
    type: "named slot"
    required: false
    default: "none"
    reflects: false
    constraint: >-
      The header action, the last piece of the header. In the base type, the menu action: an
      icon-only nph-button, ghost and compact, with the ellipsis-vertical icon and a label that carries the
      card, such as More options for Order 1042; on a touch screen it is raised to control/height-default.
      In the section type, an nph-button secondary solid compact with text. Not drawn in the clickable
      card, which shows the arrow in its place: the slot is dropped and warned once in development.
  slot:
    type: "default slot"
    required: false
    default: "none"
    reflects: false
    constraint: >-
      The content zone, free: text, fields, metrics or other Nephos pieces, in text/body-md. Never a
      card inside a card. In the clickable card nothing interactive goes in it, and the card does not
      police that.
  slot-section:
    type: "named slot"
    required: false
    default: "none"
    reflects: false
    constraint: >-
      The tonal section: a band in card/section-background with the label and the text of one
      highlighted passage, no border and no shadow. Not drawn in the clickable card: the slot is
      dropped and warned once in development.
  slot-footer:
    type: "named slot"
    required: false
    default: "none"
    reflects: false
    constraint: >-
      The footer zone. In the base and section types, the nph-button actions aligned to the end,
      secondary solid before primary solid, card/footer-gap apart, after the divider. In the clickable
      card, a meta text in the body, aligned to the start in card/description-foreground, with no
      divider.
variants:
  type:
    axis: appearance
    choose_when: "base for a subject with its own actions; clickable when the whole card leads to another page and nothing interactive sits inside; section for a block of data of a detail page, with a key-value list."
    do_not_combine_with: ["header action, tonal section, divider or buttons with clickable", "href with base or section", "media with section", "items with base or clickable"]
  surface:
    axis: appearance
    choose_when: "elevated on the page background; outlined inside another surface or in a dense list. The cards of a grid share one surface."
    do_not_combine_with: []
  media:
    axis: appearance
    choose_when: "top when the image identifies the item; inset-top when the image sits inside the padding; side when the text is the main thing and the image supports it, in a card wider than 30rem."
    do_not_combine_with: ["the section type", "an empty media slot", "an action over the media"]
  density:
    axis: density
    choose_when: "compact in a dense list or a narrow panel; default elsewhere. The cards of a grid share one density."
    do_not_combine_with: []
states:
  default:
    token: "card/background, card/foreground, card/description-foreground, card/border, card/border-width, card/radius, elevation/raised"
    changes_for_user: "The soft outline on both surfaces; the raised shadow on the elevated one only. The clickable card always shows the arrow in card/indicator-foreground and the meta footer."
  hover:
    token: "card/border-hover"
    changes_for_user: "The clickable card only: the outline color rises. The background and the shadow stay, the width does not change, nothing animates, and the hover does not move the focus. The base and section cards have no hover."
  focus:
    token: "focus/border, border/width, focus/border-radius-surface, focus/halo, focus/ring-width, focus/radius-surface-with-border"
    changes_for_user: "The clickable card only, for keyboard users: a border and, beyond it, a halo around the whole card, outside it. A pointer press draws none. The base card takes no focus; the controls inside it keep their own."
  disabled:
    token: "card/disabled-opacity"
    changes_for_user: "The clickable card only: the whole card is faded, is not a link and leaves the Tab order. Disabled wins over hover and focus."
  loading:
    token: "card/header-gap, card/gap, card/footer-padding, card/footer-padding-compact, the tokens of nph-skeleton"
    changes_for_user: "The surface, its outline and its padding stay and skeleton pieces take the place of the content, hidden from assistive technology; aria-busy is true and the screen reader hears the loading word."
business_rules:
  - "The card is a surface for one subject. Besides the container only the title is required; every other zone turns on and off."
  - "The parts that turn on and off come from the content, never from a boolean property: the start is on with an icon or a piece in the leading slot, the description with text, the status, action, section and footer with something in their slot, the content with something in the default slot or rows in items. The divider is on when the footer is, unless hide-divider is set, and the clickable card has none. Only the divider has a property, because it is on by default."
  - "Hover only changes the outline color and the width never changes, so the card does not move between states."
  - "The clickable card is a native link: the title, inside the heading, is the only Tab stop and the link area is stretched over the whole card with CSS only. Enter opens it and Space does nothing."
  - "Nothing interactive goes inside the clickable card: no header action, no tonal section, no divider and no buttons; the start and the arrow are decorative."
  - "The card draws a focus look only on the clickable type. The controls inside a base or section card keep their own focus."
  - "The section type is a region named by its title. The base card has no role and is not a landmark; a collection is the consumer's list, one li per card."
  - "While loading no real content is drawn, the title included, and the card names itself by aria-busy and the hidden word, which the consumer gives already localized."
  - "The side media moves to the top when the card is narrower than 30rem. The card takes the width of its container and needs one: it fills a block, and in a flex row it needs a basis."
  - "Touch: the menu action of the base card is raised from control/height-compact to control/height-default under a coarse pointer, by writing the compact height on the slotted action from outside. The text button of the section type keeps its size."
  - "The card changes none of the pieces it draws or places. What it sets on them it sets from outside: the separator line, the arrow color, the sizes of an icon, the frame of the media, the size of the start avatar and image, and the height of the menu action on touch."
  - "Every text comes from the consumer, already localized: the card writes no word of its own."
  - "There is no transition and no animation, so there is nothing to reduce under reduced motion."
domain_errors:
  - "A type, surface, media, density or heading-level outside its list, or an icon that is not a core name of nph-icon: the card draws nothing and emits console.error in development, once per cause."
  - "A card that is not loading with no heading: it draws nothing and emits console.error in development."
  - "A clickable card, not disabled and not loading, with no href or with an unsafe one: it draws nothing and emits console.error in development."
  - "An items value that is not a list of rows with a non-empty key and a text value: it draws nothing, in any type, and emits console.error in development."
  - "An href or a disabled outside the clickable type, a media in the section type, items outside the section type, an action or a section slot in the clickable card, hide-divider on the clickable card, an icon next to a leading piece, a piece in the media slot with no media: the card ignores it and emits console.warn in development, once per cause."
  - "Loading with no loading-label: the card draws and warns once in development that the screen reader hears nothing."
tokens:
  surface: "card/background, card/foreground, card/border, card/border-width, card/radius, elevation/raised"
  padding: "card/padding, card/padding-compact, card/gap"
  header: "card/header-item-gap, card/header-gap, card/description-foreground"
  start: "card/icon-container-background, card/icon-container-foreground, card/icon-container-radius, card/icon-container-padding, card/icon-size, card/icon-size-dense"
  arrow: "card/indicator-size, card/indicator-foreground"
  list: "card/list-gap"
  section: "card/section-background, card/section-radius, card/section-padding, card/section-gap"
  footer: "card/divider, card/footer-gap, card/footer-padding, card/footer-padding-compact"
  hover: card/border-hover
  disabled: card/disabled-opacity
  focus: "focus/border, border/width, focus/border-radius-surface, focus/halo, focus/ring-width, focus/radius-surface-with-border"
  media: "image/radius-lg"
  touch: "control/height-default"
  typography: "text/heading-md, text/heading-xs, text/body-md, text/body-sm"
ai_hints:
  - "Use nph-card for one subject that stands on its own; for items in sequence use a list, for comparing columns use nph-table, to choose one use nph-rich-option, and for content that opens and closes use nph-collapsible."
  - "Always give heading, already localized; it is the only required zone. In the clickable type write the destination in it, because the name read is the title."
  - "Choose the type by what the card does: base for its own actions, clickable when the whole card leads to a page, section for a block of data with a key-value list."
  - "For the clickable type give href and nothing interactive: no action, no section, no buttons, no divider. Put the meta text in the footer slot."
  - "Fill a zone by its slot name and leave the others empty: media, leading, status, action, section and footer, with the content in the default slot. Do not look for a boolean property per part."
  - "Give the key-value list of the section type through items as a property, a list of key and value, never as slotted markup."
  - "Slot one nph-image with src and alt only in the media slot; the card gives the frame. Slot an nph-avatar or an nph-image in leading, or set icon, never both."
  - "Put the menu action in the action slot of the base card as an icon-only nph-button, ghost and compact, with a label such as More options for plus the title; use an nph-button secondary solid compact with text in the section type."
  - "Put at most one primary action in the footer, after the secondary one; never a destructive action in the header action."
  - "Set heading-level so the title fits the outline of the page, 3 by default, and wrap a collection in a ul with one li per card and a name on the list."
  - "Set loading with loading-label, already localized; give no heading and no content while it loads."
  - "Use one surface and one density across the cards of a grid; use outlined inside another surface or in a dense list, compact in a narrow panel."
  - "Give the card a container width: it fills a block, and in a flex row it needs a basis."
accessibility:
  semantics: "There is no card pattern in the WAI-ARIA APG. The title is a div with role heading and aria-level, set by heading-level. The clickable card is the link pattern: the title text is an a inside the heading, stretched over the card with CSS only; the disabled one is an a with role link and aria-disabled true and no href, and the inner surface box of a disabled clickable card carries aria-disabled true too. The base card has no role and takes no focus. The section card is a region named by the title through aria-labelledby, or by aria-label from the heading while loading, and has no role while loading with no heading. The key-value list is a description list. The start and the arrow of the clickable card are aria-hidden. Loading sets aria-busy true on the surface and the skeleton is aria-hidden, with the hidden word outside the hidden node."
  accessible_name: "The clickable card is named by its title, the text of the link. The section card is named by its title. The base card has no name of its own; the icon-only menu action carries a label with the verb and the card title, such as More options for Order 1042. A collection is a ul with a name on the list."
  keyboard:
    - "Tab on the base card stops only on the controls inside it, the menu action and the footer buttons; the card itself takes no focus."
    - "Tab on the clickable card has one stop, the title link; it has no control inside."
    - "Enter on the clickable card opens the link. Space does nothing: it is a link, not a button."
    - "Tab on the section card stops only on the controls inside it, the header action and the footer buttons."
    - "A disabled clickable card leaves the Tab order."
    - "The menu action follows the APG menu button: Enter, Space or Down Arrow open the menu and focus the first item, Up Arrow focuses the last, and Escape closes it and returns the focus to the action."
  focus: "The clickable card only, for keyboard users only: on the link focus-visible, a border in focus/border and, beyond it, a halo in focus/halo, around the whole card, outside it, with their own corners. The card never clips, so the look is not cut. A pointer press draws none. The hover does not move the focus. With forced colors the outline is a system color and the focus is another."
  contrast: "The title in card/foreground and the description in card/description-foreground pass 4.5:1 over the card in both themes, also over the tonal section. The start icon in card/icon-container-foreground passes 3:1 over its box in every brand and both themes, 4.78:1 or more. The focus border is measured over color/background: 5.37:1 in light in the default brand, 4.32:1 or more in every brand, and 11.7:1 in dark in the default brand; its measure against the halo, the neighbor outside the border, is 3.03:1 or more in light (4.26:1 in the default brand) and 5.02:1 or more in dark, in every brand (DSA-92). The halo is a reinforcement. The soft outline over the card is about 1.1:1 in light and 1.35:1 in dark and is decorative: the background and the shadow separate the card from the page. The hover outline is 1.69:1 to 3.53:1 and needs no 3:1, because the pointer is the cue. The start box over the card is 1.04:1 to 1.25:1 in dark, decorative, and the icon carries the cue. A disabled card is outside the contrast requirement."
  color_alternative: "The clickable card shows the arrow and the meta text, not only the hover outline. The status carries text in the badge, not only color. Loading is told by the skeleton and the hidden word, and disabled by the opacity and by leaving the Tab order."
invalid_combinations:
  - "A type, surface, media, density or heading-level outside its list, or an icon that is not a core name — the card draws nothing."
  - "A card that is not loading with no heading — the card draws nothing."
  - "A clickable card with no href or an unsafe one, when it is not disabled and not loading — the card draws nothing."
  - "A malformed items, in any type — the card draws nothing."
  - "A header action, a tonal section, a divider or hide-divider with the clickable type — the slots are dropped and hide-divider has no effect, with a warning."
  - "Interactive content in the default, status or footer slot of the clickable card — a link inside a link; the card does not police it."
  - "An href or a disabled with the base or section type — ignored with a warning."
  - "A media in the section type, or a piece in the media slot with media none — not drawn, with a warning."
  - "Items with the base or clickable type — ignored with a warning."
  - "An icon with a piece in the leading slot — the icon is ignored with a warning; the start takes one piece at a time."
  - "A card inside a card, two primary actions in the footer, or a destructive action in the header action."
relations:
  combines_with:
    - nph-button
    - "nph-icon-button, an nph-button with no text"
    - nph-badge
    - nph-image
    - nph-avatar
    - nph-separator
    - nph-skeleton
    - nph-icon
    - nph-dropdown-menu
  parents:
    - "a page, a panel, a grid or a list: the container gives the width"
    - "an li of a ul, for a collection of cards"
  children:
    - "nph-icon, nph-separator and nph-skeleton, drawn by the card"
    - "nph-image, nph-avatar, nph-badge, nph-button, slotted by the consumer, the icon-only one included"
    - "free content in the default slot"
  complements_block: []
  appears_in:
    - "a summary of a record with actions, in the base type"
    - "a navigable collection, in the clickable type with media at the top"
    - "a detail block in a panel, in the section type, outlined"
    - "a profile, with an avatar at the start"
    - "a file, with a thumbnail at the start and the menu action"
anti_patterns:
  - "Putting two primary actions in the footer: use one primary solid and the others secondary solid."
  - "Putting a destructive action in the header action: use a button with text in the footer."
  - "Using a generic title on the clickable card: write the destination, because the name read is the title."
  - "Putting a button, a link or a menu inside the clickable card, or a header action, a tonal section or a divider."
  - "Putting a divider between the parts of the body: the card separates by space and the only divider is the one before the footer actions."
  - "Putting a card inside another card."
  - "Mixing surfaces or densities among the cards of a grid: a difference looks like hierarchy."
  - "Using the card for selection, which is nph-rich-option, or for content that opens and closes, which is nph-collapsible."
  - "Setting a size on the slotted nph-image to frame the media, or writing the size of the start avatar or image: the card does that."
  - "Slotting an icon next to a leading piece, or an empty piece in the media slot."
  - "Putting the loading word, the title or the list as slotted markup instead of loading-label, heading and items."
  - "Relying on the card for the collection list: the ul and the li are the consumer's."
sources:
  design_md: "design.md, the card/* tokens, the colors they point to, space/surface-padding, radius/inset and the global focus/* tokens"
  decision: "P130 — nph-card: API and semantics"
  tests: "src/components/nph-card/nph-card.test.ts, src/components/nph-card/nph-card.docs.test.ts"
  usage_evidence: "no screen consumes it yet; the accepted frame shows a summary with actions, a navigable collection, a detail block, a profile and a file"
  storybook: "src/components/nph-card/nph-card.stories.ts, Components/nph-card/Validation (Types, Densities, Media, Start, States, Section, Parts, Collection, Examples, Brands), and src/components/nph-card/nph-card.docs.stories.ts, Components/nph-card/Docs (Documentation)"
  figma: "DS-IA-NEPHOS 5.0, nph-card documentation frame 6516:13647, root 6478:6670, set 6478:6673 and start set 6478:7282"
---

# nph-card

## Function

**The problem it solves:** groups on one surface the content and the actions of one subject, for the
person to read, compare or open that subject. It is the summary of a record, an item of a collection
or a block of data on a detail page. It follows the link pattern of the WAI-ARIA APG for the
clickable type, the stretched link, and the menu button pattern for the menu action; there is no
card pattern in the APG.

**When to use:**

- A subject that stands on its own with its own actions, such as open or approve: the base type.
  On one card, choose between actions inside it or the whole card clickable.
- An item of a collection that leads to another page, with nothing interactive inside: the
  clickable type.
- A block of data of a detail page, with one action such as edit in the header: the section type.
- The elevated surface over the page background; the outlined one inside another surface or in a
  dense list.
- The compact density in a dense list or a narrow panel; the default density elsewhere.
- Media at the top when the image identifies the item; at the side when the text is the main thing
  and the image supports it.
- The start with an icon for the kind of subject, an avatar for a person, an image for an object or
  a file.
- The divider when the footer has actions; the meta footer of the clickable card has none.

**When NOT to use:**

- **For items in sequence with no container of their own** — use a list.
- **For comparing data in columns** — use `nph-table`.
- **To choose one among several** — use `nph-rich-option`: the selectable card is that piece.
- **For content that opens and closes** — use `nph-collapsible`: the expandable card is that piece.
- **For a layer that floats over the page** — use `nph-popover`, `nph-hover-card` or `nph-dialog`.
- **For a collection or a gallery** — the layout is the product's: a `ul` of cards in a list or a
  grid.
- **Inside another card.**

**Limits (the cases the layout meets):**

- Minimum: the compact density with the title only.
- Maximum: every zone on.
- Long text: the title truncates with an ellipsis before the status, which never hides; the
  description, the content and the key-value list wrap.
- Empty: with the title, which is the only required zone.
- Many items: the card has no list of its own; a long list goes in the free content, with the list
  piece, and the page scrolls.
- Short window: the card does not float; its height grows with the content and its width comes from
  its container.

## Variants

| Variant | Values | Choose when |
|---|---|---|
| `type` | `base` (default), `clickable`, `section` | `base` for a subject with its own actions; `clickable` when the whole card leads to a page and nothing interactive sits inside; `section` for a block of data of a detail page |
| `surface` | `elevated` (default), `outlined` | `elevated` on the page background; `outlined` inside another surface or in a dense list |
| `media` | `none` (default), `top`, `inset-top`, `side` | `top` when the image identifies the item; `inset-top` inside the body padding; `side` in a card wider than `30rem`, where the text is the main thing |
| `density` | `default` (default), `compact` | `compact` for a dense list or a narrow panel; the start follows it |

The type, the surface and the media are the Figma properties `tipo`, `superfície` and `mídia`;
the density is the Figma density property. The parts that turn on and off are the
Figma booleans of the same set: the start, the description, the status, the header action, the
tonal section, the footer and the divider; in code they come from the content, and only the divider
has a property, `hide-divider`. The start swaps its piece in the `nph-card start` set: icon, avatar
or image, one at a time.

**By size and density:** the density is the size. `default` pads the body by `card/padding`, sets the
title in `text/heading-md`, the start at 40 px (the image at 48 px) and the icon at `card/icon-size`.
`compact` pads it by `card/padding-compact`, sets the title in `text/heading-xs`, the start at 32 px
and the icon at `card/icon-size-dense`. The width is not a variant: the card takes the width of its
container.

**Do not combine with:** a header action, a tonal section, a divider or a button with `clickable`;
`href` with `base` or `section`; `media` with `section`; `items` with `base` or `clickable`.

## States

| State | Token | What changes for the person |
|---|---|---|
| Default | `card/background`, `card/foreground`, `card/border`, `card/border-width`, `card/radius`, `elevation/raised` | The soft outline on both surfaces, the shadow on the elevated one only |
| Hover, clickable | `card/border-hover` | The outline color rises; background and shadow stay, nothing animates, the width does not change |
| Focus, clickable | `focus/border`, `border/width`, `focus/border-radius-surface`, `focus/halo`, `focus/ring-width`, `focus/radius-surface-with-border` | For keyboard users, a border and a halo around the whole card, outside it |
| Disabled, clickable | `card/disabled-opacity` | The whole card is faded, is not a link and leaves the Tab order |
| Loading | `card/header-gap`, `card/gap`, `card/footer-padding`, the tokens of `nph-skeleton` | Skeleton pieces in place of the content; the surface, the outline and the padding stay |

The base and section types have the default and loading states only; hover, focus and disabled are
of the clickable type.

**Feedback and focus:** hover only paints the outline and does not move focus. The look of focus is
drawn by two pseudo-elements, outside the card, and the card never clips: `overflow` belongs to the
media box alone. A pointer press focuses the link without drawing the look. There is
no transition, because the accepted frame draws none: the hover is a change of color, so there is
nothing to reduce under reduced motion.

**Combined states:** the card has no selected, checked or error state (selection is
`nph-rich-option`), so the rule of combined states does not apply. The only combination is hover or
focus with disabled on the clickable card: disabled wins and the card leaves the Tab order.

**Business rule the piece carries:**

- Besides the container only the title is required; every other zone turns on and off, by its
  content and never by a boolean property. The divider is on when the footer is, unless
  `hide-divider` is set.
- The clickable card is a native link: the title is the only Tab stop and the link area is stretched
  over the card with CSS only. Enter opens it and Space does nothing.
- Nothing interactive goes inside the clickable card: no header action, no tonal section, no divider
  and no buttons.
- While loading no real content is drawn, the title included, and `aria-busy` with the hidden word
  name the state.
- The side media moves to the top when the card is narrower than `30rem`.
- On a touch screen the menu action of the base card is raised to `control/height-default`.
- Every text comes from the consumer, already localized: the card writes no word of its own.

**Domain error states:** a `type`, `surface`, `media`, `density` or `heading-level` outside its list,
an `icon` that is not a core name, a card that is not loading with no `heading`, a clickable card
with no safe `href` and a malformed `items` draw nothing and emit `console.error` in development,
once per cause. What a type does not have is ignored and emits `console.warn` in development.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | The title is a `div` with `role="heading"` and `aria-level`. The clickable card is the link pattern, the stretched link: an `a` inside the heading, covered over the card by CSS only; disabled, an `a` with `role="link"` and `aria-disabled="true"` and no `href`, and the inner surface box of the card carries `aria-disabled="true"` too. The base card has no role and takes no focus. The section card is a `region` named by `aria-labelledby` to the title. The list is a `dl`. The start and the arrow of the clickable card are `aria-hidden`. Loading sets `aria-busy="true"`, hides the skeleton and writes the word outside the hidden node |
| Accessible name | The clickable card and the section region take the title. The icon-only menu action carries a `label` with the verb and the card title, such as "More options for Order 1042". A collection is a `ul` with a name on the list |
| Keyboard | Base and section: Tab goes through the controls inside the card, which takes no focus. Clickable: one stop, the title link; Enter opens it, Space does nothing. Disabled: out of the Tab order. The menu action follows the menu button pattern: Enter, Space or Down Arrow open and focus the first item, Up Arrow the last, Escape closes and returns the focus |
| Focus | Clickable, keyboard only: a border in `focus/border` and a halo in `focus/halo` around the whole card, outside it; none on a pointer press. With forced colors the outline and the focus take system colors |
| Contrast | Title and description pass 4.5:1 over the card in both themes, also over the tonal section. The start icon passes 3:1 over its box, 4.78:1 or more. The focus border over `color/background` measures 5.37:1 in light in the default brand, 4.32:1 or more in every brand and 11.7:1 in dark in the default brand; its measure against the halo is 3.03:1 or more in light (4.26:1 in the default brand) and 5.02:1 or more in dark, in every brand (DSA-92). The soft outline, about 1.1:1 in light and 1.35:1 in dark, is decorative; the hover outline needs no 3:1; the start box over the card in dark, 1.04:1 to 1.25:1, is decorative. A disabled card is exempt |
| Alternative to color | The arrow and the meta text show the clickable card, not only the hover outline; the badge carries text; loading is told by the skeleton and the hidden word |
| Touch target | The whole clickable card is the link area. The menu action is 28 px (`control/height-compact`), above the 24 px of WCAG 2.5.8, and 36 px (`control/height-default`) under a coarse pointer |
| Movement | There is no transition and no animation |

**Known limits:**

- The stretched link does not keep text selection: with the link covering the card, the text under it
  cannot be selected by dragging. v1 has no selection script.
- The card measures its own width (`container-type: inline-size` on the host), so it needs a container
  width: it fills a block, and in a flex row it needs a basis, or it collapses.
- The media box is drawn whenever `media` is not `none`: a card with no piece in the slot leaves an
  empty box, and on `side` an empty column.
- The clickable card drops the `action` and `section` slots with a warning, but does not police a link
  or a button in the default, `status` or `footer` slot: that is a link inside a link.
- The 30rem width of the narrow rule is the code's; the accepted frame shows the wide case only.

## Relations

**Combines with:** `nph-button` in the footer and in the section header, the icon-only `nph-button`, the Figma `nph-icon-button`, as the menu action, `nph-badge` as the status, `nph-image` as the media
or the start thumbnail, `nph-avatar` at the start, `nph-separator` as the divider, `nph-skeleton`
while loading, `nph-icon` at the start and as the arrow, and `nph-dropdown-menu`, which the product
places on the menu action: the card only places the trigger. Each piece by instance keeps its own
color, focus and state; the card sets only what the table below lists.

| Between | Space |
|---|---|
| header, content and tonal section | `card/gap` |
| the pieces of the header, and title and status | `card/header-item-gap` |
| title and description | `card/header-gap` |
| the rows of the key-value list | `card/list-gap` |
| the footer actions | `card/footer-gap` |

**What is the parent:** a page, a panel, a grid or a list; the container gives the width. For a
collection the parent is a `ul` with one `li` per card, the consumer's.

**What is the child:** `nph-icon`, `nph-separator` and `nph-skeleton`, drawn by the card; `nph-image`,
`nph-avatar`, `nph-badge` and `nph-button`, the icon-only one included, slotted by the consumer; and free
content in the default slot, never a card.

**Which block this piece complements:** none.

**Appears in the layouts:** a summary of a record with actions, a navigable collection, a detail
block in a panel, a profile and a file. None in a layout yet.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Surface | `card/background`, `card/foreground`, `card/border`, `card/border-width`, `card/radius`, `elevation/raised` |
| Padding and gap | `card/padding`, `card/padding-compact`, `card/gap` |
| Header | `card/header-item-gap`, `card/header-gap`, `card/description-foreground` |
| Start | `card/icon-container-background`, `card/icon-container-foreground`, `card/icon-container-radius`, `card/icon-container-padding`, `card/icon-size`, `card/icon-size-dense` |
| Arrow | `card/indicator-size`, `card/indicator-foreground` |
| List | `card/list-gap` |
| Tonal section | `card/section-background`, `card/section-radius`, `card/section-padding`, `card/section-gap` |
| Divider and footer | `card/divider`, `card/footer-gap`, `card/footer-padding`, `card/footer-padding-compact` |
| Hover | `card/border-hover` |
| Disabled | `card/disabled-opacity` |
| Focus | `focus/border`, `border/width`, `focus/border-radius-surface`, `focus/halo`, `focus/ring-width`, `focus/radius-surface-with-border` |
| Inset media | `image/radius-lg` |
| Touch | `control/height-default` |
| Typography | `text/heading-md`, `text/heading-xs` (title), `text/body-md` (content), `text/body-sm` (description, list, meta footer) |

**Usage restrictions:** the card sets no color, size or radius outside these tokens. The pieces it
draws or places keep their own tokens, and none of them is changed. The widths of the media and of
the skeleton are shares of the card width, not tokens; the `30rem` of the narrow rule is a length
in an at-rule, which a custom property cannot hold. The card has no `::part`, no event, no color
property and no form association.

**AI hints:**

- Use `nph-card` for one subject that stands on its own; for items in sequence use a list, for
  comparing columns use `nph-table`, to choose one use `nph-rich-option`, and for content that opens
  and closes use `nph-collapsible`.
- Always give `heading`, already localized: it is the only required zone. In the clickable type write
  the destination in it, because the name read is the title.
- Choose the type by what the card does: `base` for its own actions, `clickable` when the whole card
  leads to a page, `section` for a block of data with a key-value list.
- For the clickable type give `href` and nothing interactive: no action, no section, no buttons, no
  divider. Put the meta text in the `footer` slot.
- Fill a zone by its slot name and leave the others empty: `media`, `leading`, `status`, `action`,
  `section` and `footer`, with the content in the default slot. Do not look for a boolean property
  per part.
- Give the key-value list of the section type through `items`, a property, never as slotted markup.
- Slot one `nph-image` with `src` and `alt` only in `media`; the card gives the frame. Slot an
  `nph-avatar` or an `nph-image` in `leading`, or set `icon`, never both.
- Put the menu action in the `action` slot of the base card as an icon-only `nph-button`, ghost and
  compact, with a `label` such as "More options for" plus the title; use an `nph-button` secondary
  solid compact with text in the section type.
- Put at most one primary action in the footer, after the secondary one; never a destructive action
  in the header action.
- Set `heading-level` so the title fits the outline of the page, 3 by default, and wrap a collection
  in a `ul` with one `li` per card and a name on the list.
- Set `loading` with `loading-label`, already localized; give no heading and no content while it loads.
- Use one surface and one density across the cards of a grid; the outlined surface inside another
  surface or in a dense list, the compact density in a narrow panel.
- Give the card a container width: it fills a block, and in a flex row it needs a basis.

## Examples

**Recommended case:** a summary with actions: a base elevated card with an icon at the start, a
status badge, a tonal section and a footer with a secondary and a primary `nph-button`, the divider
before them. The same card in the clickable type is an item of a navigable collection: `href` on the
title, media at the top, the arrow and a meta text in the footer.

**Alternative case:** a detail block in a panel: the section type, outlined, with `items` and a
secondary `nph-button` with text in the `action` slot. A profile: a base card with an `nph-avatar`
in `leading`. A file: a base outlined card with an `nph-image` thumbnail in `leading`, the menu
action and no footer. A card while it loads, with `loading` and `loading-label`.

## Anti-patterns

- **Do not put two primary actions in the footer** — use one primary solid and the others secondary
  solid: two main actions compete for the next step.
- **Do not put a destructive action in the header action** — use a button with text in the footer:
  the loose icon in the corner gets tapped by mistake.
- **Do not use a generic title on the clickable card** — write the destination: the name read is the
  title.
- **Do not put a button, a link or a menu inside the clickable card**, nor a header action, a tonal
  section or a divider.
- **Do not put a divider between the parts of the body** — the card separates by space and the only
  divider is the one before the footer actions.
- **Do not put a card inside another card.**
- **Do not mix surfaces or densities among the cards of a grid** — a difference looks like
  hierarchy.
- **Do not use it for selection or for content that opens and closes** — use `nph-rich-option` and
  `nph-collapsible`.
- **Do not set a size on the slotted `nph-image` to frame the media, nor the size of the start avatar
  or image** — the card does both.
- **Do not leave an empty piece in the `media` slot, nor an `icon` beside a `leading` piece.**
- **Do not pass the loading word, the title or the list as slotted markup** — use `loading-label`,
  `heading` and `items`.
- **Invalid combinations:** a value outside a list, an `icon` that is not a core name, a card with no
  `heading`, a clickable card with no safe `href`, a malformed `items`, and what a type does not
  have.
- **Do not create or adapt without a decision:** a boolean property per part, a divider between the
  body parts, a selectable or expandable card, a color property, a transition on the outline, a
  token.

## Sources and decisions

- **The repository `design.md`:** the `card/*` tokens, the colors they point to, `space/surface-padding`,
  `radius/inset` and the global `focus/*` tokens.
- **The decision that originated it:** P130.
- **Tests:** `src/components/nph-card/nph-card.test.ts` and `src/components/nph-card/nph-card.docs.test.ts`.
- **Usage evidence:** no screen consumes it yet. The accepted frame shows a summary with actions, a
  navigable collection, a detail block, a profile and a file.
- **Storybook:** `src/components/nph-card/nph-card.stories.ts`, `Components/nph-card/Validation`
  (Types, Densities, Media, Start, States, Section, Parts, Collection, Examples and Brands), and
  `src/components/nph-card/nph-card.docs.stories.ts`, `Components/nph-card/Docs` (Documentation),
  with `src/components/nph-card/nph-card.docs.test.ts`.
- **Figma:** the documentation frame `6516:13647`, the root `6478:6670`, the set `6478:6673` and the
  start set `6478:7282` in `DS-IA-NEPHOS 5.0`.
