```json
{
  "task": "DSA-109",
  "gate": "figma-docs-accepted",
  "date": "2026-11-23",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=7995-6038",
    "date": "2026-11-23",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The design owner gave the visual acceptance of the nph-split-button (page 6788:43870, root 7735:2) and accepted its documentation frame (7995:6038), with the COMPONENT_SET nph-split-button (7735:338, 96 variants). On the approval of 2026-11-23 she approved items 1 to 13 as recommended and chose option 1 of the Figma preview: (1) root accepted; (2) documentation accepted; (3) the split enters the decision map as a component; (4) split-button/gap straight to core/space/50 by decision; (5) the description of core/space/50 gains the gap between the two parts; (6) the description of radius/inner gains the inner corner of the junction, and the three junction radii alias radius/inner, focus/border-radius-inner and focus/radius-inner-with-border; (7) a foundation task for color/primary-on-surface of the Educacao brand in light; (8) no focus variant per part in Figma, the documentation teaches how to show it; (9) the nph-dropdown-menu gains an end alignment; (10) inside the nph-toolbar each part is an action of the bar; (11) the arrow keys on the main part do nothing; (12) the focus moves to the main part when loading, and a part with focus keeps aria-disabled while the whole group is disabled; (13) a click on the main part with the menu open closes the menu and runs the action; and the tooltip of the arrow centered on the arrow (Figma preview, option 1). The specification, converted to text, is below."
  }
}
```

# DSA-109 — `figma-docs-accepted`

The documentation of the nph-split-button (frame `7995:6038`, page `6788:43870`) was accepted in Figma in the file `DS-IA-NEPHOS 5.0`, with the visual acceptance of the root `7735:2`. The nph-split-button is a group of two parts: the main part runs the most common action with one click, and the arrow opens a menu with variations of that same action.

Its tokens came with this task and are on `v/5.0.0`.

Below, "Pend. N" names a point of the Figma appendix (`7999:7431`; the appendix leaves Figma in the cleanup; this evidence carries it). Every point is decided. Pend. 2 to 9, 12 and 13 were accepted with the proposals, by the design owner's green light on the page of 2026-11-22: they follow the recommendation, approved with the page (option A of each, as the root shows). Pend. 1, 10, 11 and 14 to 19 and 21 are items of the approval of 2026-11-23, and Pend. 20 is the visual decision taken in Figma on the same day (see "Decisions answered"). No appendix point is open.

What changed in the tokens with this task:

- New group `split-button/*`, 6 tokens, with no new value in the core. 5 alias a semantic of the same function (rule 2 of T9); 1 points straight to the core by decision (rule 3 of T9):
  - `split-button/gap` → `core/space/50` (2), item 4: the gap between the main part and the arrow. By decision: the only general semantic of 2 is `radius/subtle`, the radius of a small marker, not a gap, refused by function; in the space family, the smallest is `space/inline-tight`, 4. The description of `core/space/50` says to use it only where the space is really tight; the gap between the parts is really tight and stays inside one piece. Precedents on the same primitive: `accordion/title-gap`, `chip/counter-padding-y` and `switch/track-padding-sm`. The value comes from the Material 3 split button spec (https://m3.material.io/components/split-button/specs ).
  - `split-button/inner-radius` → `radius/inner` (4), item 6: the inner corner at the junction, the end corners of the main part and the start corners of the arrow. Nested, the inner radius is always smaller than the outer one (`radius/control`, 6). Precedents: `select/option-radius`, `tabs/item-radius`, `navigation-menu/item-radius`.
  - `split-button/focus-border-inner-radius` → `focus/border-radius-inner` (5), item 6: the 1 px focus border at the junction corners of the part with focus (4 + 1).
  - `split-button/focus-halo-inner-radius` → `focus/radius-inner-with-border` (9), item 6: the focus halo at the junction corners (5 + 4).
  - `split-button/focus-border` → `focus/border`: the 1 px focus border of both parts, in every type, danger included. It is the one that meets 3:1 (Pend. 12).
  - `split-button/focus-halo` → `focus/halo`: the 4 px focus halo of both parts, in every type, danger included; the `nph-button` alone uses `focus/halo-danger` in danger. Decoration (Pend. 12).
- Descriptions changed: in Figma, `core/space/50` gains "and between the two parts of the nph-split-button (split-button/gap)", right after `accordion/title-gap` (item 5; the `nph-chart` note stays); `design.md` has no description for the core space, and the same exception goes to the half-step rule (`meio_passo_use`). In Figma and in `design.md`, `radius/inner` gains "and on the inner corner of the junction of the parts of a control (split-button/inner-radius)" at the end of its first sentence (item 6). `design.md` also gains the split in the `use` of `focus/border`, `focus/halo`, `focus/border-radius-inner` and `focus/radius-inner-with-border`, in the half-step rule, in the core space note by decision and in the anti-pattern A28 (declared exception).
- The colors of the parts get no token: they come from the `nph-button` and the `nph-button` icon only, by instance (see "Tokens inherited by instance").

## Purpose

A split button for a dominant action with variations: the main part runs the most common action with one click, and the arrow opens a menu with its variations.

Selection of properties: `tipo` type (secondary, primary or danger), `enfase` emphasis (solid, outline, ghost or light), `size` (compact, default or large) and `state` (default, `aberto` open, `carregando` loading or disabled). Light exists only in primary, and danger only in outline.

## Component description (as in Figma)

Use it when the screen has a dominant action and a few variations of it, such as Save, with Save as draft and Save and close in the menu. The main part keeps the most used action; the arrow keeps the variations, up to five.

It does not replace the `nph-dropdown-menu` on an `nph-button`, when the actions have the same weight or are more than five; nor separate buttons, when the actions are not related; nor the `nph-button` alone, when there is no variation.

## Description of the set (as in Figma)

- `nph-split-button` (`7735:338`): Split button: the main part runs the most common action with one click, and the arrow opens a menu with variations of that action. Do: put the most used action on the main part; give the arrow the name of the action, such as More options for Save; keep in the menu only variations of the main part; disable only the part that does not apply. Do not: unrelated actions in the menu; the action of the main part repeated in the menu; different types on the parts. Documentation: https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/?node-id=7995-6038

## Component sets

| Set | Figma id | What it is |
|---|---|---|
| `nph-split-button` | `7735:338` | 96 variants: `tipo` × `enfase` (8 pairs) × `size` (3) × `state` (4). Default variant: secondary · solid · default · default (`7735:6`). |

The 8 type and emphasis pairs: secondary solid (default), secondary outline, secondary ghost, primary solid, primary outline, primary light, primary ghost, danger outline.

## Anatomy (read by script in the set, variant by variant)

Order, from start to end: main part and arrow. The tooltip shows above the arrow, and the menu below the group. In a right-to-left language, the code mirrors through the logical corners (start and end).

**1. Shell (the variant).** A horizontal auto layout frame, with no background and no border, that hugs both parts (hug × hug), padding 0 on the four sides. Gap 2 px, `split-button/gap` (`core/space/50`), **horizontal, between the main part and the arrow**. Main axis aligned to the start; cross axis centered: both parts are centered vertically and have the same height. Paint order: in the master, the arrow, second child, is on top; in the copies with focus on the main part, the main part goes on top.

**2. Main part** (instance of the `nph-button`, set `461:13009`). First child, start of the group. Type, emphasis and size equal to those of the group; end icon off; start icon optional (off in the 96 variants; the root `7742:202` and the documentation show it with the icon). State of the main part by state of the group: default → default; open → default; loading → loading (the spinner visible, 85 px wide with the sample label); disabled → disabled. Corners: top-start and bottom-start `radius/control` (6 px); top-end and bottom-end `split-button/inner-radius` (4 px). Height `control/height-compact` 28, `control/height-default` 36, `control/height-large` 44. Width hugs the label: 65 px with the sample label in the three sizes; 85 px when loading. Opacity `state/disabled-opacity` (50%) only in the disabled group. Text style, color and padding (`space/control-padding`, gap `space/inline-tight`) come from the `nph-button`. Sample label: Save (other examples: Export, Delete).

**3. Arrow** (instance of the `nph-button` icon only, the `nph-icon-button` set in Figma, `498:15671`). Second child, end of the group. Shape square in the 96 variants; width and height `control/height-*`: 28, 36 or 44 px. State of the arrow by state of the group: default → default; open → hover-active; loading → disabled (opacity `state/disabled-opacity`); disabled → disabled. Icon by state of the group: default, loading and disabled: `chevron-down`, light; open: `chevron-up`, solid (`nph-icon` `248:10`). Icon size: compact `icon/size-sm` 16; default `icon/size-md` 20; large `icon/size-lg` 24. Corners: top-start and bottom-start `split-button/inner-radius` (4 px); top-end and bottom-end `radius/control` (6 px). Colors from the `nph-button` icon only, by type and emphasis.

**4. Focus ring** (copies with focus in the root and in the documentation; the set has no focus variant per part, Pend. 21). Inside the part with focus, in the `nph-button` focus state: the focus border, 1 px, `split-button/focus-border` (`focus/border`), outer corners `focus/border-radius-control` (7 px), junction corners `split-button/focus-border-inner-radius` (5 px); the focus halo, 4 px (`focus/ring-width`), `split-button/focus-halo` (`focus/halo`, in danger too), outer corners `focus/radius-control-with-border` (11 px), junction corners `split-button/focus-halo-inner-radius` (9 px). The part with focus is on top of its neighbor, and the ring shows whole over the 2 px gap. Samples: documentation section 4, light `7996:6438` and dark `7996:6460`.

**5. Tooltip of the arrow** (outside the set, only in the composition). The `nph-tooltip` (`1237:3`), 8 px above the arrow (`space/inline`), **centered on the arrow** (Pend. 20, option 1): read in the samples, the center of the tooltip at 85.5 and the center of the arrow at 85, relative to the group; a 141 px tooltip goes 53 px past the end edge of the group. Samples `7742:249`, `7742:830`, `7995:6461`, `7997:6755`, `7997:6766`. Sample text: More options for Save.

**6. Menu** (outside the set, only in the composition). The `nph-dropdown-menu` (`1365:63`), 4 px below the group (`space/inline-tight`), aligned to the end edge of the group (280 px wide in the composition, `layout/input-width`). Sample items: Save as draft, Save and close, Save and create another.

## Properties, variants and states

| Field | Rule |
|---|---|
| `tipo` type | secondary (default), primary or danger. It applies to both parts together. |
| `enfase` emphasis | solid (default), outline, ghost or light. Light exists only in primary; danger exists only in outline. |
| `size` | compact (28 px high), default (36 px, default) or large (44 px). Both parts change together. |
| `state` | default (default); `aberto` open, with the arrow in the hover tone and the chevron up while the menu is open; `carregando` loading, with the spinner on the main part and the arrow disabled; disabled, the whole group disabled. |
| main part | Exposed instance of the `nph-button`: label by text and optional start icon. The end icon stays off. The hover and the disabled state of the main part alone come from its own state. |
| arrow | Exposed instance of the `nph-button` icon only (`nph-icon-button` in Figma), shape square: `chevron-down` light at rest and solid on hover; `chevron-up` solid when open. The hover and the disabled state of the arrow alone come from its own state. |
| what is not a property | The actions of the menu are items of the `nph-dropdown-menu`, outside the set. The name of the arrow and the text of the tooltip come from the label of the action, in the code. The tooltip is the `nph-tooltip` of the icon-only button. |

Documentation samples: primary with the start icon; compact and large; loading; disabled only on the main part and only on the arrow.

## Accessibility (as in Figma, section 4)

| Criterion | Rule |
|---|---|
| contrast | Label, icon and background come from the `nph-button` and the `nph-button` icon only. Over the page background (`color/background`), the label passes 4.5:1 in both schemes, in every brand. |
| visible focus | Each part has its own ring: a 1 px border and a 4 px halo, in the same color in every type (`split-button/focus-border` and `split-button/focus-halo`, on `focus/border` and `focus/halo`). At the junction corners, the border has 5 px (`split-button/focus-border-inner-radius`) and the halo 9 px (`split-button/focus-halo-inner-radius`). The part with focus is on top of its neighbor, and the ring shows whole over the 2 px gap. The border passes 3:1 against the background in both schemes. |
| focus in Figma | The focus always exists in the code; the set has no focus variant per part. To show the focus of a part on a screen, copy from the documentation sample the part and the type you need (main part or arrow; secondary, primary or danger; light or dark). In it, the part is in the `nph-button` focus state, on top of its neighbor, with the ring in `split-button/focus-border` and `split-button/focus-halo` and the junction corners in `split-button/focus-border-inner-radius` and `split-button/focus-halo-inner-radius`. Do not change only the state of the part in a new instance: the ring of the `nph-button` alone shows, with another color in primary and danger and corners of 7 and 11 px at the junction. |
| color is not the only sign | Open turns the chevron up and paints the arrow in the hover tone. Disabled lowers the opacity to 50% and takes the part out of the Tab order; with the whole group disabled, the part that had the focus keeps `aria-disabled` while it has the focus and leaves the Tab order when it loses it. Loading shows the spinner on the main part; if the focus was on the arrow, it goes to the main part, which stays focusable. |
| touch target | The arrow is square, 28, 36 or 44 px on a side, above the 24 × 24 px of WCAG 2.5.8 even in compact. The main part has the same height and is wider. |
| accessible name | The main part has the name of its label. The arrow is icon only and carries the name of the action in its label, the same as the tooltip text, such as More options for Save (Figma says `aria-label`; in the code it is the `label` of the icon-only `nph-button`, its accessible name and the tooltip text). The arrow announces that it opens a menu and whether it is open (`aria-haspopup` and `aria-expanded`). |
| keyboard | The group has two Tab stops, the main part and the arrow. The arrow opens the menu with Enter, Space or Down Arrow, and the focus goes to the first item; with Up Arrow, the focus goes to the last. Esc closes the menu and gives the focus back to the arrow. On the main part, Down Arrow and Up Arrow do nothing. |

Documentation samples: focus on each part, in secondary, primary and danger, ready to copy (`7996:6439`, `7996:6442`, `7996:6445`, `8041:364`, `8041:395`, `7996:6448`; dark pairs `7996:6461`, `7996:6464`, `7996:6467`, `8041:424`, `8041:445`, `7996:6470`); open with the menu; whole group disabled.

Known limits (appendix, section H; foundation, outside this task): the halo (`focus/halo`) has low contrast against the dark background; the light focus border (`focus/border`) carries the ring, by the Nephos rule. Against the halo, the focus border has the known limit written in `focus/border` of `design.md`: 2.92:1 in the brand `Sistemas`, light. In the strict reading of WCAG, the primary solid focus border in light has the same tone as `color/primary` in the brand `Sistemas`, as in the `nph-button` alone. The primary ghost label over `color/muted` in the brand `Educacao`, light, measures 4.27:1 (DSA-113).

## Relations and context (as in Figma, section 6)

| Piece or context | Rule |
|---|---|
| `nph-button` | The main part and the arrow are instances of the `nph-button`, the arrow as an icon-only button. Color, size and states come from it; the focus ring follows the accessibility section. The group writes the same type, emphasis and size on both. |
| `nph-dropdown-menu` | It is the menu of the arrow. It opens with the focus on the first item and gives the focus back to the arrow when it closes by keyboard or by choosing an item. It writes `aria-haspopup` and `aria-expanded` on the arrow. With the menu open, a click on the main part closes the menu and runs its action in the same click. |
| `nph-tooltip` | It is the tooltip of the arrow, with its name. It stays hidden while the menu is open and does not reopen when the focus goes back to the arrow; it comes back on a new hover or a new keyboard focus. |
| `nph-dialog` | Inside the dialog, the secondary solid uses the same background as outside, on both parts. |
| who controls | The screen chooses type, emphasis, size, label and actions. The group handles the junction, the inner corners and the part with focus on top. The menu handles opening and turning up when there is no room below. |
| spaces | Between the parts, 2 px (`split-button/gap`, on `core/space/50`). Between the group and the menu, 4 px (`space/inline-tight`). Between the arrow and the tooltip, 8 px (`space/inline`). |

Documentation samples: open, with the menu aligned to the end edge; hover on the arrow, with the tooltip centered on the arrow.

## When to use (as in Figma, section 7)

| Situation | How to choose |
|---|---|
| one action with variations | Use the `nph-split-button`: the most used action on the main part and its variations in the menu. |
| actions of the same weight | Use the `nph-dropdown-menu` on an `nph-button`: no action deserves the direct click. |
| six actions or more | Use the `nph-dropdown-menu` on an `nph-button`. |
| choosing the type | secondary is the default. Use primary when the group is the most important action of the screen, and danger in outline when every action of the menu is destructive. |
| choosing the emphasis | As in the `nph-button`: solid for the action with weight (default); outline for an alternative of the same weight next to another; light when the outline would weigh too much; ghost for a support action or a third-level action. Both parts use the same emphasis. |
| choosing the size | Use the same size as the buttons next to it. |
| disabling | Disable the group when no action applies now; disable only the main part or only the arrow when only one part does not apply. |
| loading | Use while the action of the main part runs: the spinner stays on the main part, and the arrow waits disabled. |

Documentation samples: secondary solid (default), primary solid and danger outline.

## Examples (as in Figma, section 8)

- a. Form: Save on the main part; Save as draft, Save and close and Save and create another in the menu. primary · solid, open.
- b. Header of a list: Export on the main part; Export as PDF and Export as CSV in the menu. secondary · outline · compact.
- c. Deletion: Delete on the main part; Delete permanently and Delete and empty the trash in the menu, all destructive. danger · outline.

## Do (as in Figma, section 9)

| Do | Why |
|---|---|
| Put the most used action on the main part. | The direct click covers most of the cases, without opening the menu. |
| Give the arrow the name of the action: More options for Save. | The screen reader and the tooltip say what the menu holds. |
| Keep in the menu only variations of the main part. | The menu reads as other ways of doing the same action. |
| Disable only the part that does not apply. | The other part stays available, and the person does not lose the action that works. |
| Use loading while the action of the main part runs. | The arrow waits disabled, and nobody fires a second action in the middle. |

## Do not (as in Figma, section 10)

| Do not | Use instead |
|---|---|
| 1. Unrelated actions in the menu, such as Save with Print, Share and Delete. | Separate buttons, or the `nph-dropdown-menu` on an `nph-button` when the actions have the same weight. |
| 2. The action of the main part repeated in the menu. | Take out of the menu the action that is already on the main part; keep only the variations. |
| 3. Different types on the parts, such as primary on the main part and secondary on the arrow. | The same type on both parts: choose the type on the group, which writes it on both. |

The documentation draws the three errors on purpose, as examples of what not to do.

## Default behavior (appendix, section B)

Base: WAI-ARIA APG (menu button, menu and button: https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/ , https://www.w3.org/WAI/ARIA/apg/patterns/menu/ , https://www.w3.org/WAI/ARIA/apg/patterns/button/ , https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/ ) and the specs of this repository, read on `v/5.0.0`. "Accepted with the proposals" marks what the page accepted with the green light.

| Moment | What happens | Source |
|---|---|---|
| Tab reaches the group | The focus enters the main part, with border and halo for the keyboard only. The part with focus is on top of its neighbor (accepted with the proposals). Two Tab stops, one per part. Left and Right Arrow do not move between the parts. | `fichas/nph-button.md` (keyboard); by analogy with P76 in `docs/decisoes-tecnicas.md` (one stop per button, no arrows) |
| Tab from the main part to the arrow | The focus goes to the arrow. The tooltip More options for Save opens at once, with no wait. | `fichas/nph-tooltip.md` (business rules); `fichas/nph-button.md` (tooltip of the icon-only button) |
| Shift+Tab | Back in order: arrow, main part, previous element. The tooltip of the arrow closes when the focus leaves it. | `fichas/nph-button.md`; `fichas/nph-tooltip.md` |
| Enter or Space on the main part | Runs the dominant action and does not open the menu. Home and End on the main part do nothing (the spec lists only Tab, Enter and Space). Down Arrow or Up Arrow on the main part: nothing (Pend. 15, item 11). | `fichas/nph-button.md`; APG button |
| Enter, Space or Down Arrow on the arrow | Opens the menu with the focus on the first item; Up Arrow opens with the focus on the last. The icon turns to `chevron-up` and the arrow takes the open look, the hover-active one (accepted with the proposals). The tooltip closes, because the focus leaves the arrow, and stays hidden while the menu is open (accepted with the proposals). | `fichas/nph-dropdown-menu.md`; P92; `fichas/nph-button.md` (open trigger); `fichas/nph-tooltip.md`; APG menu button |
| Click on the arrow | Opens the menu with the focus on the first item, with no visible ring. A click during the tooltip wait cancels the tooltip. A click on the arrow with the menu open closes the menu and does not reopen it. | `fichas/nph-dropdown-menu.md`; P92; `fichas/nph-tooltip.md`; P77 |
| Arrows, Home and End inside the menu | Down and Up Arrow move between items, wrapping from the last to the first. Home goes to the first, End to the last. A disabled or loading item takes the focus but does not activate. | `fichas/nph-dropdown-menu.md`; P92; APG menu |
| A letter typed inside the menu | The focus goes to the next item that starts with the letter. Space right after a letter activates the item. | `fichas/nph-dropdown-menu.md`; P92; APG menu |
| Pointer over an item | Hover moves the focus, not only paints, and the arrows go on from it. A disabled or loading item, or touch, do not take the focus. A menu opened under a still pointer does not take the focus off the first item. | `fichas/nph-dropdown-menu.md`; P114 (replaces the "hover only paints" of P92) |
| Enter or Space on a common item | Activates the item, closes the menu and gives the focus back to the arrow. The tooltip does not reopen; it comes back only on a new hover or a new keyboard focus (accepted with the proposals). Multiple choice and switch keep the menu open. | `fichas/nph-dropdown-menu.md`; P92; APG menu |
| Esc with the menu open | Closes the menu and gives the focus back to the arrow. The key stops there: a dialog around does not close. The tooltip does not reopen (accepted with the proposals). | `fichas/nph-dropdown-menu.md`; P92; APG menu |
| Esc with the tooltip open and the menu closed | Closes only the tooltip. The focus stays on the arrow and the key does not reach the page. A new Esc, with the tooltip closed, is not intercepted. The tooltip comes back only after pointer and focus leave once. | `fichas/nph-tooltip.md`; P77 |
| Tab or Shift+Tab with the menu open | Closes the menu. The focus goes back to the arrow and goes on from there: Tab goes to the element after the group; Shift+Tab goes to the main part. The tooltip does not reopen (accepted with the proposals). | `fichas/nph-dropdown-menu.md`; P92; APG menu |
| Click outside the menu and the arrow | Closes the menu without moving the focus: it stays where the person clicked. A click on the main part with the menu open: closes the menu and runs the action of the main part in the same click (Pend. 18, item 13). | P92 |
| Position near the edge of the window | Opens 4 px below (`space/inline-tight`). Turns up when it does not fit below and fits above. Never leaves the window: it touches the edge, at 0 px. A narrow window or a larger font shrinks the width; a menu taller than the room scrolls inside; it does not cut. It follows the arrow on scroll. The menu aligns to the end edge of the group (visual accepted, Pend. 9): the `nph-dropdown-menu` gains an end alignment, as the `nph-popover` has (Pend. 17, item 9; DSA-111). | `fichas/nph-dropdown-menu.md`; P92; P126 (records the 0 px touch of `place()` as a limit; the `nph-menubar` contract asks for 4 px) |
| Arrow clipped by a scrolling container | Known limit: with the arrow still inside the window, the menu stays drawn next to it, even clipped. | `fichas/nph-dropdown-menu.md` (limits); P92 |
| Hover on the arrow, menu closed | The tooltip opens after `motion/hover-delay` (300 ms) and never opens on touch. It stays open with the pointer over it. With the menu open, it stays hidden (accepted with the proposals). | `fichas/nph-tooltip.md` |
| Position of the tooltip | Opens above the arrow, 8 px away (`space/inline`); flips to the opposite side when it does not fit and never leaves the window. The `nph-tooltip` centers the tooltip on the element, and the root shows it centered on the arrow (Pend. 20, decided in Figma by option 1). | P77, item 5 |
| Disabled: group, main part only or arrow only | The disabled part leaves the Tab order, does not respond to a click and loses opacity. The disabled arrow has no tooltip and does not open the menu, by click or key; a click on it still closes an open menu. The other part stays normal. Focus that was on the part that became disabled: with the whole group disabled, the part keeps `aria-disabled` while it has the focus and leaves the Tab order when it loses it (Pend. 16, item 12). A part alone disabled with the focus on it is not covered by item 12: an open point of the task (recommended, by analogy, the same `aria-disabled` rule). | `fichas/nph-button.md` (disabled, tooltip); `fichas/nph-tooltip.md`; `fichas/nph-dropdown-menu.md`; P92 |
| Loading | Spinner on the main part (accepted with the proposals). It stays focusable, with `aria-busy`, and the click does not reach the consumer. The arrow is disabled: it leaves the Tab order, loses an open tooltip at once and does not open the menu. With the menu open, Esc, Tab and a click outside still close it. Focus that was on the arrow: it goes to the main part (Pend. 16, item 12). | `fichas/nph-button.md` (loading); P68; `fichas/nph-tooltip.md`; P77; P92 |
| Inside the `nph-toolbar` | The bar has one Tab stop and moves between its actions with Left and Right Arrow. How the split enters it: each part is an action of the bar; the side arrows go from the main part to the arrow, and Down Arrow on the arrow opens the menu (Pend. 19, item 10; DSA-112). | `fichas/nph-toolbar.md` (business rules, keyboard); APG toolbar |

Deviations from the APG: none. The APG has no split button pattern: the split is a common button next to a menu button, and each follows its own pattern. Home and End live with the wrap of the arrows; the APG asks for Home and End when there is no wrap, and giving both does not go against the rule. The hover that moves the focus (P114) and the tooltip hidden with the menu open (accepted with the proposals) are not in the APG; they do not go against it.

Event, aria, slot, property and console warning stay with the code owner, following the APG and the Custom Elements Manifest.

The old matrix of the Figma page (`7736:844`, out of this version) said "disabled with focus: the disabled nph-button takes no focus, and the split follows the piece". Item 12 of the approval replaces it: the part with focus keeps `aria-disabled` while it has the focus.

## Combined states (appendix, section C)

Rule T11 of the decision log: selected or checked + disabled keeps the background and the selected mark under `state/disabled-opacity`; error + disabled: disabled wins, the error border goes and only the opacity stays. In the nph-split-button the parts have no selected, checked or error state, so the rule asks for no new drawing. The disabled part uses `state/disabled-opacity` of the piece; when loading, the disabled arrow follows the same rule.

## Icon and image (appendix, section D)

- Arrow: `chevron-down` of the `nph-icon`, weight light at rest and solid in hover-active (DSA-47 D1; P88, item 1). Open: `chevron-up` solid (accepted with the proposals; read in the set: `906:20067`).
- Arrow icon size, read in the set by the bound variable: compact 16 px (`icon/size-sm`), default 20 px (`icon/size-md`), large 24 px (`icon/size-lg`).
- Start icon of the main part: optional, by the `nph-button` property; weight and size follow the `nph-button`.
- Loading: the spinner is the one of the `nph-button`, on the main part.
- Image: the component uses no image.

## Inherited decisions (appendix, section E)

- Family: `nph-button` (main part and arrow) → `nph-dropdown-menu` (menu). The split is the composition of both.
- DSA-45 D-1: the menu opens `space/inline-tight` (4 px) from the trigger.
- DSA-45 D-2: the menu enters and leaves with `motion/enter-*` and `motion/exit-*`, as the `nph-select` list.
- DSA-45 D-3: open, a technical choice of the code (the box and the rail of the item get no hover of their own). It does not change the split.
- DSA-45 D-4, D-5 and D-6, through the instance of the menu item: switch in the small `nph-switch`; in a single choice, only the checked item takes the brand color; the pointer over an item moves the focus.
- DSA-67 D-2, P111 (item 2) and P114 (item 3): the open trigger paints hover-active, icons included, and carries `aria-expanded` and `aria-haspopup="menu"`. In secondary solid, the open arrow uses `icon-button/secondary-solid-background-hover`.
- DSA-67 D-1, D-3 and D-4: do not apply (they belong to the `nph-popover` or are a technical choice of the code).
- DSA-47 D1 and P88 (item 1): the icon-only button switches its icon to solid in hover-active; it applies to the chevron of the arrow.
- DSA-64 D-1: inside the `nph-dialog`, the secondary solid uses the same background as outside, on both parts.
- DSA-64: the secondary has no light, and the default of the secondary is solid.
- DSA-60: the hover of the secondary ghost uses `color/accent`, through `button/secondary-ghost-background-hover` and `icon-button/secondary-ghost-background-hover`.
- DSA-43 and P86: the arrow is an `nph-button` icon only, shape square, with the mandatory tooltip and the accessible name equal to its text. DSA-43 D1 and D2: open, they do not change the split.
- DSA-13 and DSA-52: no D-N line; read, with no design decision that changes the split.
- Decision map, line 111 (`nph-toggle-group`, 8 px between neighbor buttons): it does not apply to the gap of the split, one piece with two targets of 28 px or more.
- P92: the menu finds the trigger by `for`, in the same root, writes `aria-haspopup="menu"` and `aria-expanded` on it and opens only below or above the trigger.
- P121, item 6: the open and close trigger of the `nph-button` uses `chevron-down` closed and `chevron-up` open; with `aria-haspopup="menu"`, P114 item 3 holds.
- P116, items 7 and 8, and P126, item 7: the focus border of the menu item moved to `focus/border`; the hook `--nph-button-focus-border` changes the color of the `nph-button` focus border; the halo has no hook (DSA-110 adds one).
- P68: a button group is out of the scope of the `nph-button`; the split is a piece of its own.
- P104: the `nph-toolbar` writes the size only on the children it lists (item 3) and puts its actions in one Tab stop (item 5). See DSA-112.
- P77, items 3 and 4, with the DSA-48 amendment: click, Enter or Space do not touch the tooltip; it closes when pointer and focus leave, or with Esc. Base of Pend. 13.

## Order and alignment of the parts (appendix, section F)

1. Shell: variant of the set `7735:338` (default `7735:6`), horizontal auto layout, no background and no border, hugs the content; gap 2 px in `split-button/gap` (`core/space/50`); parts centered vertically.
2. Main part: exposed instance of the `nph-button` (`461:13009`), at the start of the group; height `control/height-*`; outer corners `radius/control` (6 px), inner corners `split-button/inner-radius` (`radius/inner`, 4 px); padding `space/control-padding`.
3. Arrow: exposed instance of the `nph-button` icon only (`498:15671`, shape square), at the end of the group; width and height `control/height-*`; inner corners `split-button/inner-radius`, outer corners `radius/control`; icon `chevron-down` (`248:10`) centered.
4. Tooltip: `nph-tooltip` (`1237:3`), above the arrow, 8 px away (`space/inline`); horizontal alignment: centered on the arrow (Pend. 20, option 1; P77, item 5, centers the tooltip on the element).
5. Menu: `nph-dropdown-menu` (`1365:63`), below the group, 4 px away (`space/inline-tight`), aligned to the end edge (root composition `7742:307`; in the code, DSA-111).

Focus (accepted with the proposals, Pend. 7 and 12): the part with focus is on top of its neighbor, and the ring uses `split-button/focus-border` and `split-button/focus-halo` (`focus/border` and `focus/halo`), with corners of 5 px (`split-button/focus-border-inner-radius`) and 9 px (`split-button/focus-halo-inner-radius`) at the junction. Limit in Figma: the set has no focus variant per part; changing the state of a part to focus shows the ring of the `nph-button` alone (in primary, `color/primary`; in danger, `focus/halo-danger`; corners of 7 and 11 px). The root and the documentation show the right focus by overrides on the copies; documentation section 4 teaches how to show it, with the sample ready to copy (Pend. 21, item 8).

## Limits (read in the Figma matrix `7736:844`)

- Minimum: compact (28 px) with a one-word label, and a menu with one action; each target passes the 24 px of WCAG 2.5.8.
- Maximum: large (44 px) with the start icon on the main part.
- Long text: the `nph-button` does not wrap (P68); the label grows on one line and the group grows with it.
- Empty: does not apply. The main part carries a label (icon only is out, Pend. 4); with no similar actions, use the `nph-button` alone.
- Many items: up to five actions in the menu (Atlassian: fewer than six); from six on, use the `nph-dropdown-menu` on an `nph-button`.
- Short window: with no room below, the menu opens above the group (P92).
- Out of this version, with the reason: elevated with shadow (the `nph-button` has no emphasis with shadow; the visual style keeps shadow for menu and popover); info, warn, help and success, and danger in solid, light and ghost (no use case read; the danger solid focus does not pass at the junction, Pend. 3); main part icon only (Pend. 4); triangle arrow (the `nph-icon` has `caret-up` and no `caret-down`); ellipsis arrow (that is the overflow menu, another pattern); joined with a thin line (asks for a divider color token; the visual style asks to separate by space); joined with no line (in secondary solid both parts become one block); pill or circular shape; vertical orientation and side menu (the Nephos menu opens below or above the trigger, P92).

## Tokens inherited by instance (appendix, section A2)

Read by script in the set, the root and the documentation, before the approval; since 2026-11-23, `core/space/50`, `radius/inner`, `focus/border`, `focus/halo`, `focus/border-radius-inner` and `focus/radius-inner-with-border` reach the split through the `split-button/*` tokens. The rest come from the approved pieces by instance and do not change here: the `button/*` and `icon-button/*` colors of each type and emphasis, `color/primary*`, `color/destructive*`, `color/secondary-foreground`, `color/muted`, `border/width`, `radius/control`, `control/height-*`, `icon/size-*`, `space/control-padding`, `space/inline-tight`, `state/disabled-opacity` and the text tokens of the `nph-button`; `color/tooltip`, `color/tooltip-foreground`, `layout/max-tooltip-*` and `space/inline` of the `nph-tooltip`; `color/popover`, `color/popover-foreground`, `color/dropdown-border`, `dropdown/*`, `layout/input-width`, `radius/surface`, `space/overlay-padding` and the shadow of the `nph-dropdown-menu`; `focus/border-radius-control`, `focus/radius-control-with-border` and `focus/ring-width` on the outer corners of the ring.

## What the split asks of other pieces (read on `v/5.0.0`)

- **`nph-button`** (DSA-110). (a) The corners: today the button draws `radius/control` on the four corners, and its focus border and halo `focus/border-radius-control` and `focus/radius-control-with-border` (`nph-button.css`), with no hook; the split needs the junction corners in `split-button/inner-radius`, `split-button/focus-border-inner-radius` and `split-button/focus-halo-inner-radius` (Pend. 2 and 7, accepted with the proposals). (b) The halo: the one public focus hook is `--nph-button-focus-border` (border only, `fichas/nph-button.md`, focus); the halo has no hook (P116, item 8), and Pend. 12 asks for one, so both parts use `focus/halo` in every type. (c) The tooltip of the icon-only button opens on keyboard focus (`fichas/nph-tooltip.md`, business rules) and has no rule for an open menu; Pend. 13 asks that, on an icon-only button with `aria-haspopup` and `aria-expanded` true, the tooltip stay hidden while the menu is open and not reopen when the focus comes back; it holds for every icon-only button that opens a menu. Unset, every other button stays as it is.
- **`nph-dropdown-menu`** (DSA-111). It opens aligned to the start edge of its trigger (`fichas/nph-dropdown-menu.md`, business rules); the accepted drawing puts the menu on the end edge of the group, which is the end edge of the arrow (Pend. 9). Item 9: it gains an end alignment, as the `align` of the `nph-popover` (`fichas/nph-popover.md`, `align`; P111).
- **`nph-toolbar`** (DSA-112). Its actions are one Tab stop with Left and Right Arrow, and it writes the size on the direct children it lists (`fichas/nph-toolbar.md`, business rules; P104, items 3 and 5); it does not know a piece with two actions. Item 10: each part of the split is an action of the bar.
- **`nph-tooltip`**: unchanged. It already centers the tooltip on the element (P77, item 5), which is option 1 of Pend. 20; the centered alignment is still an open point of DSA-42 (`docs/decisoes-tecnicas.md`, P77).

## Decisions answered on 2026-11-23

| Item | Point | Answer (all as recommended) |
|---|---|---|
| 1 | Root | Accepted (`7735:2`). |
| 2 | Documentation | Accepted (`7995:6038`). |
| 3 | Pend. 1 | The split enters the decision map as a component, citing what it adds to the pieces: the junction, the focus on top, the single focus color, the hidden tooltip and the loading that locks the arrow. Caveat recorded: the rest already comes from the pieces (P92, P111, P114, P68), and the market leans to composition (Spectrum removed `sp-split-button`; Ant Design 6 removed `Dropdown.Button`). |
| 4 | Appendix A | `split-button/gap` straight to `core/space/50`, by decision (refused by function: `radius/subtle`; the smallest space semantic, `space/inline-tight`, is 4). |
| 5 | Pend. 10 | The description of `core/space/50` gains the split gap, right after `accordion/title-gap`. |
| 6 | Pend. 11 | The description of `radius/inner` gains the inner corner of the junction; the three junction radii alias `radius/inner`, `focus/border-radius-inner` and `focus/radius-inner-with-border`. |
| 7 | Pend. 14 | A foundation task for `color/primary-on-surface` of `Educacao` in light, up to 4.5:1 over `color/muted` (DSA-113). |
| 8 | Pend. 21 | No focus variant per part in the Figma set; documentation section 4 teaches how to show the focus, with the sample ready to copy. Caveats recorded: no source read treats focus per part in a composed component; an override in a nested instance is lost more easily; the documentation says the focus always exists in the code. |
| 9 | Pend. 17 | The `nph-dropdown-menu` gains an end alignment, as the `nph-popover` (DSA-111). |
| 10 | Pend. 19 | Inside the `nph-toolbar`, each part is an action of the bar (DSA-112). Caveat recorded: in a vertical bar, Down Arrow on the arrow competes with the navigation; it does not apply in this version, because the `nph-toolbar` has no vertical bar. |
| 11 | Pend. 15 | Down and Up Arrow on the main part do nothing. |
| 12 | Pend. 16 | Loading moves the focus to the main part; with the whole group disabled, the part with focus keeps `aria-disabled` until it loses the focus. Caveat recorded: the `nph-button` alone lets the focus fall today. |
| 13 | Pend. 18 | A click on the main part with the menu open closes the menu and runs the action of the main part in the same click. Caveat recorded: a person who clicks to close the menu may fire the action. |
| — | Pend. 20 (visual, in Figma) | Option 1: the tooltip of the arrow centered on the arrow. |
| — | Pend. 2 to 9, 12, 13 | Accepted with the proposals (green light of 2026-11-22): the 2 px junction with 4 px inner corners (2); types and emphases (3); main part icon only out (4); `chevron-up` when open (5); disabled group, main part or arrow, and loading (6); focus on top over the gap (7); default variant secondary · solid · default · default (8); menu below, aligned to the end edge, turning up (9); single focus color (12); tooltip hidden with the menu open (13). No veto. |

Sources of the decided points, as written in the appendix: https://m3.material.io/components/split-button/specs ; https://m3.material.io/components/split-button/guidelines ; https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/ ; https://www.w3.org/WAI/ARIA/apg/patterns/menu/ ; https://www.w3.org/WAI/ARIA/apg/patterns/button/ ; https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/ ; https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/ ; https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html ; https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html ; https://www.radix-ui.com/primitives/docs/components/tooltip ; https://primer.style/components/tooltip ; https://nathanacurtis.substack.com/p/the-sorry-state-of-states-89dd4668737e ; https://design.gitlab.com/get-started/uik-components ; https://opensource.adobe.com/spectrum-web-components/migrations/2024-10-31%20(1.0.0)/ .

## Findings outside this task (appendix, section H)

- Foundation: the `color/primary-on-surface` label of the primary ghost `nph-button` is 4.27:1 over `color/muted` in the brand `Educacao`, light (DSA-113).
- Foundation: `core/radius/off-scale/5` has no description, and `core/radius/off-scale/9` only the `nph-chart` note; with item 6 accepted, the split does not need them.
- Foundation: the focus of the primary `nph-button` alone uses `color/primary` and measures 2.71:1 against the dark background (`Gerencial`), below 3:1; in the strict reading of WCAG, the primary solid alone fails in both schemes and the danger solid alone fails in light; Fluent, Primer and Carbon solve it with a two-tone inner ring (technique C40: https://www.w3.org/WAI/WCAG22/Techniques/css/C40 ). The change on the button is a decision of the design owner, outside the split.
- Visual style, second decision: the tone of the open trigger of the `nph-dropdown-menu` stays for later, with a preview. The arrow takes today's tone (P111, P114, DSA-67 D-2) until then.
- Group role on the shell: Fluent does not use it; shadcn does (https://ui.shadcn.com/docs/components/button-group ); no source decides; a technical choice of the code.
- Touch screen: Atlassian asks to avoid the split on a phone (https://atlassian.design/components/button/split-button/usage ); in the Nephos the square arrow passes the 24 px of WCAG 2.5.8 even in compact (https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html ).

## Figma ids

Root `7735:2` (card `7742:2`; light `7742:7`, dark `7742:785`); set frame `7735:3`; set `7735:338`, default `7735:6`; documentation `7995:6038` (sheet `7995:6039`). The proposals, the matrix and the appendix leave Figma in the cleanup of this sign-off; this evidence carries the appendix.
