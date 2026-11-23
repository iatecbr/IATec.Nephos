```json
{
  "task": "DSA-105",
  "gate": "figma-docs-accepted",
  "date": "2026-11-22",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=7926-14926",
    "date": "2026-11-22",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The design owner gave the visual acceptance of the nph-rich-text-editor (page 1626:45, root 7742:1107) and accepted its documentation frame (7926:14926), with the COMPONENT_SET nph-rich-text-editor (7744:282) and the toolbar set (7743:137). On the approval page of 2026-11-22 she approved items 1 to 15 as recommended: (1) root accepted; (2) documentation accepted; (3) in the narrow toolbar the block style trigger goes whole to More, an exception to the nph-toolbar spec; (4) clear formatting is the last item of More, after a divider; (5) the link popover has the visible title Link; (6) 12 px between the footer actions (space/inline-loose); (7) quote text indent 16 px, straight to core/space/400 by decision; (8) the divider stays in color/border-subtle and its description gains the editor; (9) new semantics layout/multiline-min-height and layout/multiline-max-height; (10) the nph-toolbar gains a slot property in Figma in a task of its own, and until then the Figma toolbar is a composition; (11) a foundation task for the nine missing icons; (12) the focus goes back to the text area when the link popover was opened by the shortcut; (13) with the focus in the editor, Ctrl or Cmd + K opens the link and does not reach the nph-command; (14) top and bottom padding of the area 8 px, straight to core/space/200 by decision; (15) list indent 24 px, straight to core/space/600 by decision. The specification, converted to text, is below."
  }
}
```

# DSA-105 — `figma-docs-accepted`

The documentation of the nph-rich-text-editor (frame `7926:14926`, page `1626:45`) was accepted in Figma in the file `DS-IA-NEPHOS 5.0`, with the visual acceptance of the root `7742:1107`. The nph-rich-text-editor is a multi-line form field for text with simple formatting: bold, italic, underline, strike-through, lists, quote, heading and link. It sits inside the `nph-field`, as the `nph-textarea` does, with the formatting toolbar at the top of the box.

Its tokens came with this task and are on `v/5.0.0`.

Below, "Pend. N" names a point of the Figma appendix (the appendix leaves Figma in the cleanup; this evidence carries it). Every one of them is decided: Pend. 1 to 8 by the proposals accepted with the root (the design owner's green light on the page), Pend. 9 to 18 by an item of the approval page (see "Decisions answered"). No appendix point is open. One case the code cannot build as drawn today, the More menu with submenus, is the pending decision D-1 of the task (see "What the editor asks of other pieces").

What changed in the tokens with this task:

- New group `rich-text-editor/*`, 31 tokens. 28 alias a semantic of the same function (rule 2 of T9), two of them the new `layout/multiline-*`. 3 point straight to the core by decision (rule 3 of T9), with no new value in the core:
  - `rich-text-editor/content-padding-y` → `core/space/200` (8), item 14: the top and bottom padding of the text area, and the bottom padding of the footer. No semantic of 8 has the function of the vertical breathing room of a field: `space/inline` is the gap between side-by-side elements and `space/stack-snug` the gap between a title and its description; `radius/container`, `radius/inset` and `focus/radius-inner` are radii. All refused by function. The `nph-textarea` binds `space/inline` with the same value (DSA-38 D-1); here the core wins because the description of `space/inline` has another function (T9: the function rules, a sibling is not a source). The market research of 2026-11-22 recommended the same semantic as the `nph-textarea` and puts 8 px at the low end of the market (Quill 12 px, CKEditor 0); the design owner chose the core.
  - `rich-text-editor/quote-padding-start` → `core/space/400` (16), item 7: the indent of the quote text after its bar. `space/stack` (stacked siblings), `space/container-padding` (padding of panel, popover and dialog), `layout/margin-compact` (page margin) and `icon/size-sm` (icon box), all 16, refused by function. GitHub and Quill put 16 px between the bar and the text, Tailwind 20 px.
  - `rich-text-editor/list-indent` → `core/space/600` (24), item 15: the list indent. No semantic is a list indent: `layout/gutter` (gutter between columns), `layout/margin-default` (page margin), `icon/size-lg` (icon box), `space/overlay-padding` (the layer that blocks the page) and `space/surface-padding` (card), all 24, refused by function. Quill 24 px; GitHub and Tailwind 32 px.
- Two new semantics, with no new value (item 9): `layout/multiline-min-height` → `core/layout-height/textarea-min` (76) and `layout/multiline-max-height` → `core/layout-height/textarea-max` (216). `layout/textarea-min-height` and `layout/textarea-max-height` say "DO NOT USE outside nph-textarea" and their names cite the textarea; the general name serves any multi-line text area (T9: from the general to the specific). The `nph-textarea` keeps `layout/textarea-*` and moves to the new ones in DSA-107.
- Descriptions changed in Figma and in `design.md`: `color/border-subtle` gains the editor divider, and its "do not use" reads "the border of a field (color/input)" (item 8); `space/inline-loose` gains the editor footer (item 6); the two core heights cite both semantics (item 9); the core space note gains the three cases by decision. `design.md` also gains the editor in the `use` of every semantic it binds.

## Purpose

A multi-line field for text with simple formatting, with the formatting toolbar at the top of the box. For a comment, a task description, a note and a message.

Selection of properties: nph-rich-text-editor — `state` (default, hover, `foco` focus, `erro` error, `erro-foco` error focus, disabled, `leitura` read only), `placeholder`, `valor` value, `exemplo formatado` formatted example, `rodapé` footer, `ações` actions, `texto do contador` counter text and `barra` toolbar. The toolbar changes width with the box: wide or narrow.

## Component description (as in Figma)

Use it when the person needs to highlight parts of the text with bold, a list, a quote, a heading or a link. The editor sits inside the `nph-field`, which gives the label, the help and the error message.

It does not replace the `nph-textarea`: text with no formatting goes there. It is not a document editor either: image, table, slash command and full page stay out of it.

The toolbar follows the toolbar pattern: one Tab stop, with the arrow keys between the buttons.

## Description of the sets (as in Figma)

- `nph-rich-text-editor` (`7744:282`): a multi-line field for text with simple formatting, with the formatting toolbar at the top of the box, inside the `nph-field`. Do: put it inside the `nph-field` with a visible label; keep the link in view in the narrow toolbar; disable undo and redo with no history; keep clear formatting alone at the end of the wide toolbar; show in the trigger the style where the cursor is. Do not: short text with no formatting (use the `nph-input`; for long text with no formatting, the `nph-textarea`); the toolbar turned off to edit formatted text; the placeholder in place of the label. Documentation: https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/?node-id=7926-14926
- `nph-rich-text-editor / barra` (`7743:137`): the formatting toolbar of the `nph-rich-text-editor`, a composition with the `nph-toolbar` tokens (`toolbar/background`, `toolbar/padding` and `toolbar/gap`), until the `nph-toolbar` gains a slot property, in a task of its own. Wide: every group in view; narrow: history and link in view and the rest in More.

## Component sets

| Set | Figma id | What it is |
|---|---|---|
| `nph-rich-text-editor` | `7744:282` | The field, 7 variants of `state`: default `7744:51`, hover `7744:106`, `foco` `7744:131`, `erro` `7744:157`, `erro-foco` `7744:182`, disabled `7744:208`, `leitura` `7744:233`. Default: default. Booleans `placeholder` (off), `valor` (on), `exemplo formatado` (off), `rodapé` (off), `ações` (on), `barra` (on); text `texto do contador` ("0/1000"). |
| `nph-rich-text-editor / barra` (toolbar) | `7743:137` | The toolbar, property `largura` (width): `larga` wide `7743:2`, `estreita` narrow `7743:105`. In the 7 field variants the toolbar is the narrow instance. |

Root `7742:1107` (light `7748:200`, dark `7748:7832`), documentation `7926:14926`, appendix `7930:2` (it leaves Figma in the cleanup; this evidence carries it). Pieces by instance: `nph-field`, `nph-button` (icon only, ghost, compact, square; and with text), `nph-togglebutton`, `nph-separator`, `nph-dropdown-menu`, `nph-popover`, `nph-input`, `nph-tooltip`, `nph-icon`, `nph-skeleton` (in place of the nine missing icons in Figma, until the design side adds them to the Figma `nph-icon`). In Figma, undo, redo, link, clear formatting and More are instances of the `nph-icon-button`, the Figma form of the `nph-button` icon only in code.

## Tokens

Light and dark values are read in the `Sistemas` brand; the focus follows the active brand. Every alias is the same in light and dark; the value changes with the semantic.

### `rich-text-editor/*`

| Token | Points to | Value light · dark | Layer |
|---|---|---|---|
| `rich-text-editor/background` | `color/background` | `#FFFFFF` · `#0F1114` | box background |
| `rich-text-editor/background-disabled` | `color/muted` | `#EDEEEF` · `#2D333B` | box background, disabled |
| `rich-text-editor/border` | `color/input` | `#8F8F8F` · `#9399A1` | box border at rest, disabled and read only |
| `rich-text-editor/border-hover` | `color/input-hover` | `#737373` · `#B7BBC1` | box border in hover |
| `rich-text-editor/border-error` | `status/error` | `#B01E1E` · `#EA7D7D` | box border in error and error focus |
| `rich-text-editor/border-width` | `border/width` | 1 | box border, 4 sides |
| `rich-text-editor/radius` | `radius/control` | 6 | box corners; top corners of the toolbar |
| `rich-text-editor/width` | `layout/input-width` | 280 | default width; it stretches inside the `nph-field` |
| `rich-text-editor/focus-border` | `focus/border` | brand focus · `theme/brand-200` | box border in focus |
| `rich-text-editor/focus-halo` | `focus/halo` | brand halo · dark halo | focus halo |
| `rich-text-editor/focus-halo-error` | `focus/halo-error` | `#F1A8A8` · `#F1A8A8` | focus halo in error focus |
| `rich-text-editor/focus-halo-width` | `focus/ring-width` | 4 | focus halo, outside the box |
| `rich-text-editor/focus-halo-radius` | `focus/radius-control` | 10 | focus halo corners |
| `rich-text-editor/disabled-opacity` | `state/disabled-opacity` | 50% | the whole box, disabled |
| `rich-text-editor/divider` | `color/border-subtle` | `#F1F1F1` · white at 10% | line between the toolbar and the text area |
| `rich-text-editor/divider-width` | `border/width` | 1 | that line |
| `rich-text-editor/content-padding-x` | `space/control-padding` | 12 | sides of the body (text area and footer) |
| `rich-text-editor/content-padding-y` | `core/space/200` (by decision) | 8 | top and bottom of the text area; bottom of the footer |
| `rich-text-editor/content-min-height` | `layout/multiline-min-height` (new) | 76 | minimum height of the text area |
| `rich-text-editor/content-max-height` | `layout/multiline-max-height` (new) | 216 | maximum height of the text area; above it, it scrolls inside |
| `rich-text-editor/foreground` | `color/foreground` | `#000000` · `#E3E3E3` | value, paragraph, headings, list and quote text |
| `rich-text-editor/placeholder-foreground` | `color/muted-foreground` | `#5C5C5C` · `#B7BBC1` | placeholder |
| `rich-text-editor/counter-foreground` | `color/muted-foreground` | `#5C5C5C` · `#B7BBC1` | counter |
| `rich-text-editor/link-foreground` | `color/link` | `#2F68C5` · `#89B4FA` | link in the content, always underlined |
| `rich-text-editor/block-gap` | `space/stack-snug` | 8 | between the blocks of the content |
| `rich-text-editor/list-indent` | `core/space/600` (by decision) | 24 | list indent, before the text |
| `rich-text-editor/quote-border` | `color/border` | `#C7C7C7` · `#6F7782` | quote bar |
| `rich-text-editor/quote-border-width` | `border/width` | 1 | quote bar, start side only |
| `rich-text-editor/quote-padding-start` | `core/space/400` (by decision) | 16 | quote text indent, after the bar |
| `rich-text-editor/footer-gap` | `space/stack` | 16 | between the text area and the footer |
| `rich-text-editor/footer-actions-gap` | `space/inline-loose` | 12 | between the footer actions |

### Used directly or by instance, with no `rich-text-editor/*` token

- **Toolbar** (item 10): in Figma a composition that binds the `nph-toolbar` tokens straight: `toolbar/background` (background), `toolbar/padding` (8 on the 4 sides) and `toolbar/gap` (8 between groups and dividers, and between the buttons of a group); its top corners take `rich-text-editor/radius` by override. In code it is the `nph-toolbar` with its slots (P104, item 2), size compact; the editor host points the CSS variables of the toolbar, as P104, item 4, does in the bulk bar.
- **Group dividers in the toolbar**: the vertical `nph-separator`, 1 × 28 (`border/width`, `control/height-compact`), with its own color (`color/border`).
- **Buttons**: their own tokens, by instance. Undo, redo, link, clear formatting and More: `nph-button` icon only, secondary, ghost, compact, square, 28 × 28 (`control/height-compact`, `radius/control`). Bold, italic, underline, strike-through, the two lists and quote: `nph-togglebutton`, compact, no text, 28 × 28 (see "What the editor asks of other pieces"). Block style trigger: `nph-button` secondary ghost compact with text, `chevron-down` at the end, 28 high, `space/control-padding` on the sides and `space/inline-tight` between text and icon. Footer actions: `nph-button` default size, Cancel secondary ghost and Send primary solid.
- **Typography**, by text style, with no token (as the `nph-textarea`): paragraph, value and placeholder `text/body-md`; counter `text/caption`; Heading 1 `text/heading-md`, Heading 2 `text/heading-sm`, Heading 3 `text/heading-xs` (Pend. 4).
- **Gap between the list marker and its text**: in Figma 8 (`space/inline`), a drawing of the marker. In code the marker sits outside the text and the indent is `rich-text-editor/list-indent`.
- **Menu, popover and tooltip**: their own tokens, by instance.

## Anatomy, read part by part in Figma

Read by script in the default variant `7744:51` and in the toolbar `7743:2` and `7743:105`, after the `rich-text-editor/*` binding. "Horizontal" and "vertical" are the auto layout direction. Padding in the order top, right, bottom, left. Measures in px.

### Box and layers

| Layer | Direction and gap (between which pieces) | Padding | Measures | Token |
|---|---|---|---|---|
| box (the variant) | vertical, gap 0, between toolbar, divider and body | 0 | 280 wide, height from the content | `rich-text-editor/width`, `radius` (4 corners), `border-width` (4 sides), `background`, `border` |
| toolbar (instance, narrow in the set) | horizontal, gap 8 between groups and dividers | 8 on the 4 sides | 44 high, full width | `toolbar/gap`, `toolbar/padding`, `toolbar/background`; top corners `rich-text-editor/radius` (override) |
| divider (horizontal `nph-separator`) | — | — | 1 high, full width | `rich-text-editor/divider-width`; line color overridden to `rich-text-editor/divider` |
| body | vertical, gap 16 between the scroll area and the footer | 0 / 12 / 0 / 12 | full width | `rich-text-editor/footer-gap`, `rich-text-editor/content-padding-x` |
| scroll area | vertical, gap 8 between blocks (placeholder, value, formatted example) | 8 / 0 / 8 / 0 | min 76, max 216 | `rich-text-editor/block-gap`, `content-padding-y`, `content-min-height`, `content-max-height` |
| formatted example | vertical, gap 8 between heading, paragraph, list, quote and link | 0 | — | `rich-text-editor/block-gap` |
| bulleted list | vertical, gap 0 between items | 0 / 0 / 0 / 24 | — | `rich-text-editor/list-indent` |
| list item | horizontal, gap 8 between the marker "•" and the text | 0 | — | `space/inline` (Figma drawing; see above) |
| quote | vertical, gap 0 | 0 / 0 / 0 / 16 (after the bar) | bar: start-side stroke only, 1 | `rich-text-editor/quote-padding-start`, `quote-border-width`, `quote-border` |
| footer (off by default) | horizontal, space between: counter at the start, actions at the end, centered in height | 0 / 0 / 8 / 0 | — | `rich-text-editor/content-padding-y` |
| actions | horizontal, gap 12 between Cancel and Send | 0 | — | `rich-text-editor/footer-actions-gap` |
| focus halo (focus and error focus only) | — | — | outside the box | `rich-text-editor/focus-halo-radius` (4 corners), `focus-halo-width` (4 sides), `focus-halo` / `focus-halo-error` |

### Texts (style, color, Figma text translated)

| Layer | Style | Color | Text in Figma |
|---|---|---|---|
| placeholder (off by default) | `text/body-md` | `rich-text-editor/placeholder-foreground` | "Write here. Use the bar to format." |
| value | `text/body-md` | `rich-text-editor/foreground` | "Text typed by the person. The area grows up to the maximum height and then scrolls inside." |
| heading ("Meeting summary") | `text/heading-md` | `rich-text-editor/foreground` | Heading 1 (Heading 2 `text/heading-sm`; Heading 3 `text/heading-xs`) |
| paragraph | `text/body-md` | `rich-text-editor/foreground` | "The team approved the new delivery date." |
| marker and item text | `text/body-md` | `rich-text-editor/foreground` | "•", "Review the budget", "Send the minutes" |
| quote text | `text/body-md` | `rich-text-editor/foreground` | "The date holds for every unit." |
| link | `text/body-md`, underlined | `rich-text-editor/link-foreground` | "Open the meeting agenda" |
| counter | `text/caption` | `rich-text-editor/counter-foreground` | "0/1000" |

### What changes by variant

| Variant | Background | Border | Halo | Other |
|---|---|---|---|---|
| default `7744:51` | `background` | `border` | — | — |
| hover `7744:106` | `background` | `border-hover` | — | — |
| `foco` focus `7744:131` | `background` | `focus-border` | `focus-halo` | — |
| `erro` error `7744:157` | `background` | `border-error` | — | — |
| `erro-foco` error focus `7744:182` | `background` | `border-error` | `focus-halo-error` | — |
| disabled `7744:208` | `background-disabled` | `border` | — | opacity `disabled-opacity` on the whole box; footer buttons in their disabled state |
| `leitura` read only `7744:233` | `background` | `border` | — | toolbar and divider hidden |

All tokens in this table are `rich-text-editor/*`.

### Toolbar, part by part, and icons by variant

- **Wide toolbar** `7743:2`, 577 × 44, horizontal, gap 8, padding 8, items centered in height. Groups in order, a vertical divider between each two: history (undo, redo), block style (the trigger "Paragraph"), formatting (bold, italic, underline, strike-through), lists (bulleted, numbered), quote, link, clear formatting. Each group is horizontal with gap 8 (`toolbar/gap`).
- **Narrow toolbar** `7743:105`, 170 × 44: history (undo, redo), divider, link, divider, More.
- **Icons** (Font Awesome, `light`, 16, `icon/size-sm`): redo `rotate-right`, block style trigger `chevron-down`, link `link`, More `ellipsis`. Undo (`rotate-left`), bold (`bold`), italic (`italic`), underline (`underline`), strike-through (`strikethrough`), bulleted list (`list-ul`), numbered list (`list-ol`), quote (`block-quote`) and clear formatting (`text-slash`) are an `nph-skeleton` block of 16 × 16 in Figma, in place of the icon, until the design side adds them to the Figma `nph-icon` (item 11). The code uses the named icon; six of them enter the code core with DSA-108.
- **Toggle buttons**: `nph-togglebutton` unchecked, compact, no text, 28 × 28, padding 4 (`space/inline-tight`), 1 px border (`border/width`), `radius/control`.
- In the 7 field variants the toolbar is the narrow one; in the root samples with text, redo is disabled (nothing undone).

### Link popover and menus

- **Link popover**: `nph-popover` side bottom, align center, no arrow, size md, 320 × 189, centered under the link button. Visible title "Link" (item 5; `text/heading-sm` by the instance, DSA-67 D-4); body with the `nph-field` "Link address" around the `nph-input`; footer with "Remove link" (`nph-button` secondary ghost compact; only when there is a link already) and "Apply". Root `7748:1235` and `7748:7877`, documentation `7927:41` and `7927:53`.
- **Block style menu**: `nph-dropdown-menu` with Paragraph, Heading 1, Heading 2 and Heading 3, single choice, the current one checked.
- **More menu**: in Figma an instance of the `nph-dropdown-menu` with 4 items: Block style, Formatting and Lists, each with a submenu, and Quote. The master has no fifth item; clear formatting comes last, after a divider (item 4), as the documentation text says (the example shows the first four).

## Anatomy (as in Figma)

Order, from top to bottom: toolbar, divider, text area and footer. In the toolbar, from the start: history, block style, formatting, lists, quote, link and clear formatting; in the narrow toolbar, history, link and More.

1. Box — 1 px outline with a 6 px radius on the 4 corners; default width 280 px, which stretches inside the `nph-field`. The parts stack from the top and take the full width.
2. Toolbar — 44 px high, 8 px padding, icon-only buttons of 28 × 28 px and the style trigger 28 px high, 8 px apart, groups separated by a vertical divider. At the top of the box; the buttons are centered in height, from the start.
3. History — undo and redo, icon-only buttons. At the start of the toolbar, centered in height.
4. Block style — a button with the name of the style where the cursor is ("Paragraph") and the down arrow; it opens the menu with Paragraph, Heading 1, Heading 2 and Heading 3. Centered in the toolbar height.
5. Formatting — bold, italic, underline and strike-through, icon-only toggle buttons, square. Centered in the toolbar height.
6. Lists — bulleted list and numbered list, icon-only toggle buttons. Centered in the toolbar height.
7. Quote — icon-only toggle button. Centered in the toolbar height.
8. Link — icon-only button that opens the link editing. Centered in the toolbar height.
9. Clear formatting — icon-only button, alone at the end of the wide toolbar, centered in height; in the narrow one, it is the last item of More.
10. More — icon-only button, at the end of the narrow toolbar, centered in height; it opens the menu with the block style, the formatting, the lists, the quote and, last, after a divider, clear formatting (the example shows the first four).
11. Divider — a 1 px line between the toolbar and the area, in the weakest tone. It takes the full width, below the toolbar.
12. Text area — 12 px padding on the sides and 8 px at the top and bottom; minimum height 76 px and maximum 216 px, then the text scrolls inside. The text starts at the top and at the start.
13. Content — paragraph in body text; heading; lists with a 24 px indent; quote with a 1 px side bar and a 16 px indent; link underlined, in the link color; 8 px between blocks. All aligned to the start.
14. Footer (optional) — 16 px from the area, with the counter at the start and the actions at the end, centered in height; 8 px to the bottom border.

## Accessibility (as in Figma)

| Criterion | Rule |
|---|---|
| Contrast | The text passes 4.5:1 in both themes, the placeholder included (6.69:1 light and 9.81:1 dark) and the link (in the worst brand, 4.96:1 light and 8.87:1 dark): `rich-text-editor/placeholder-foreground` and `rich-text-editor/link-foreground` (`color/muted-foreground`, `color/link`). The box border `rich-text-editor/border` (`color/input`) passes 3:1 against the background: 3.23:1 light and 6.58:1 dark. |
| Visible focus | With the focus in the text area, the box shows the 1 px focus border `rich-text-editor/focus-border` (`focus/border`) and the 4 px halo `rich-text-editor/focus-halo` (`focus/halo`) outside; the border passes 3:1 against the background in every brand (in the worst, 4.32:1 light and 8.20:1 dark). With the focus on a toolbar button, the ring is the button's own. |
| Color is not the only sign | A checked button changes its background and its icon and announces `aria-pressed`. The error adds the error border `rich-text-editor/border-error` (`status/error`) to the error message of the `nph-field`. The link is underlined, besides the color. |
| Touch target | Each icon-only toolbar button is 28 × 28 px and the block style trigger is 28 px high, with 8 px between them: it passes the 24 × 24 px minimum. |
| Accessible name | The text area (role `textbox`, `aria-multiline`) is named by the label of the `nph-field`, with the help and the error in `aria-describedby`. The toolbar (role `toolbar`) has its own name and points to the area with `aria-controls`. Each icon-only button has its accessible name; the tooltip shows the name and, when there is a shortcut, the shortcut written: "Bold · Ctrl+B". A disabled button has no tooltip. |
| Keyboard | The toolbar is one Tab stop, with the arrow keys between the buttons. Tab leaves the text area; the text does not trap the focus. |
| Disabled and read only | Disabled fades the whole box and takes no focus. In read only, the toolbar leaves and the text stays readable. |

Usage demo (light and dark): focus in the text area; error with focus; bold checked and keyboard focus on italic; tooltip with the name and the shortcut.

## Properties, variants and states (as in Figma)

| Property | Rule |
|---|---|
| `state` | default, hover, focus, error, error focus, disabled and read only; default: default. Disabled wins over read only, and read only wins over error. |
| placeholder | Boolean, default off. Shows the helper text when the area is empty; it goes away when the person types. |
| value | Boolean, default on. Shows the typed text. |
| formatted example | Boolean, default off. Shows heading, paragraph, list, quote and link in the content. |
| footer | Boolean, default off. Turns on the footer inside the box, below the text area. |
| actions | Boolean, default on. Actions at the end of the footer; they show only with the footer on. |
| counter text | Text, default "0/1000". The consumer writes the numbers; the counter counts the text, not the markup. |
| toolbar | Boolean, default on. Turns on the toolbar in the editing states; the read only variant has no toolbar. |
| What is not a property | The toolbar width, wide or narrow, follows the box width. The block style menu, the More menu and the link editing are compositions. The state of each button (checked, focus, disabled) comes from the button piece. |

Examples: empty area with placeholder, formatted content, footer with counter and actions, footer with the counter only, disabled and read only.

## Relations and context (as in Figma)

| Piece | Relation |
|---|---|
| `nph-field` | Around the editor, with the label, the help and the error message. The editor takes the width of the field and receives the disabled state from it. |
| Toolbar buttons | Undo, redo, link, clear formatting and More are the `nph-button` icon only; bold, italic, underline, strike-through, lists and quote are the `nph-togglebutton` icon only; the block style is the `nph-button` with text. Color, state and focus of each button come from the piece. |
| `nph-separator` | The vertical divider between the toolbar groups and the horizontal divider between the toolbar and the text area. |
| `nph-dropdown-menu` | Opens from the block style and from More. While the menu is open, the trigger keeps the open look; the block style menu checks the current style, single choice. |
| `nph-popover` | The link editing, opened below the link button, with no arrow, with the title Link: the field "Link address", Remove link, when there is a link already, and Apply. |
| `nph-tooltip` | The tooltip of the icon-only buttons, with the name and, when there is one, the shortcut; a disabled button has no tooltip. |
| Spaces | 8 px between the buttons and between the toolbar groups; 16 px between the text area and the footer; 12 px between the footer actions. |

Examples: the block style menu open, with the current one checked, and the link editing in the popover.

## When to use (as in Figma)

| Situation | Choice |
|---|---|
| Text with emphasis | A comment, task description, note or message that asks for bold, list, quote, heading or link: the editor, inside the `nph-field`. |
| Text with no formatting | Use the `nph-textarea`. |
| Wide box | With room for the wide toolbar, which measures 577 px inside the box with the trigger on Paragraph: the wide toolbar, with every group in view. |
| Narrow box | Without that room: the narrow toolbar, with history and link in view and the block style, the formatting, the lists, the quote and clear formatting in the More menu. |
| Character limit | Turn on the footer with the counter. |
| Sending from the field itself | Turn on the footer with the actions, as in a comment with Cancel and Send. |
| Read only | Use the read only state: the toolbar leaves and the text stays readable. |

Examples: a wide box with the wide toolbar, the formatted content and the footer; a narrow box with the More menu open.

## Required examples (in Figma, light and dark)

- a. The task description in the `nph-field`, still empty: label with required, placeholder and help; undo and redo disabled, with no history.
- b. Meeting notes in the `nph-field`, in a wide box: wide toolbar, heading, paragraph, list, quote and link, with the counter footer and the actions Cancel and Send.
- c. The task description with an error: the required field was left empty, the box shows the error border and the `nph-field` shows the message.

## Do (as in Figma)

| Do | Why |
|---|---|
| Put the editor inside the `nph-field`, with a visible label. | The name of the area comes from the label, and the placeholder goes away when the person types. |
| Keep the link in view in the narrow toolbar too. | It opens a field to type the address; the formatting groups can go to More. |
| Disable undo and redo when there is no history. | The toolbar shows there is nothing to undo, and the arrow keys skip the disabled button. |
| Keep clear formatting alone, at the end of the wide toolbar. | It separates the action that removes all formatting from the ones that format. |
| Show in the trigger the style where the cursor is. | The person sees whether the passage is a paragraph or a heading without opening the menu. |
| Turn on the counter when there is a character limit. | It shows how much text still fits; the counter counts the text, not the markup. |

Examples: the editor in the `nph-field`, with undo and redo disabled with no history; a cut of the narrow toolbar, with the link in view and the More menu open.

## Do not (as in Figma)

| Do not | Use instead |
|---|---|
| Do not use the editor for short text with no formatting, such as a name. | Use the `nph-input`; for long text with no formatting, the `nph-textarea`. |
| Do not turn off the toolbar to edit formatted text. | Keep the toolbar: without it, part of the formatting only comes through the shortcuts, and what has no shortcut has no way. |
| Do not use the placeholder in place of the label. | Put the editor in the `nph-field`, with a visible label; the placeholder goes away when the person types. |

Errors, on purpose: each instance shows the error of the row with the same number (1. short text with no formatting; 2. toolbar off; 3. placeholder in place of the label).

## Default behavior (appendix, accepted with the documentation)

Base: the W3C ARIA Authoring Practices toolbar pattern for the toolbar and the multi-line text box for the area; menu, popover and tooltip follow the spec of their own piece, read on `v/5.0.0`. The departures went to the approval page of 2026-11-22 and followed the recommendation.

| Moment | What happens | Source |
|---|---|---|
| Tab in the form | The toolbar is one Tab stop and the text area is another. The order follows the drawing: the toolbar first, then the area (by analogy; the APG does not fix the order). | https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/ ; `fichas/nph-toolbar.md` (DSA-55 D-2) |
| Arrow keys in the toolbar | Right and Left go to the next and the previous button, wrapping at the ends; Home and End go to the first and the last. | `fichas/nph-toolbar.md`, keyboard; P104, item 5 |
| Disabled button in the toolbar | The arrow keys skip undo and redo when disabled (Pend. 8). | `fichas/nph-toolbar.md`, keyboard; P104, item 5; https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/examples/toolbar/ |
| Tab inside the area | Tab leaves the editor: the text does not trap the focus. Alt+F10 goes from the area to the toolbar. | https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html ; https://ckeditor.com/docs/ckeditor5/latest/features/accessibility.html |
| Shortcuts | Ctrl or Cmd + B, I and U format; Ctrl or Cmd + Z undoes; Ctrl or Cmd + Shift + Z redoes; Ctrl or Cmd + K opens the link editing (Pend. 7). The tooltip of each button writes its shortcut, when it has one; a disabled button has no tooltip. With the focus in the editor, Ctrl or Cmd + K opens the link and does not reach the `nph-command`, even with its `global-shortcut` on: the shortcut of who holds the focus wins (item 13). | https://ckeditor.com/docs/ckeditor5/latest/features/accessibility.html ; P116, item 2 |
| Toggle buttons | Bold, italic, underline, strike-through, lists and quote announce `aria-pressed`; undo, redo, link, clear formatting and More are actions, with no `aria-pressed`. | https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/examples/toolbar/ |
| Opening the style menu or More | Enter, Space and Down open the menu on the first item, and Up on the last. In the menu, Up and Down wrap, Home, End and type-ahead; Enter and Space choose. The trigger keeps the open look and `aria-expanded`. | `fichas/nph-dropdown-menu.md`; DSA-67 D-2 |
| Focus when the link opens and closes | Opened by the link button (Enter, Space or click), the popover takes the focus; Esc, Remove link and Apply close it and give the focus back to the link button; a click outside and the focus leaving leave the focus where the person put it. Opened by Ctrl or Cmd + K in the text area, Esc, Remove link and Apply give the focus back to the text area, at the cursor or the selection (item 12). | `fichas/nph-popover.md`, business rules and keyboard; item 12 |
| Esc | Closes only the open layer: the menu (the focus goes back to the trigger), the link popover (the focus goes back to the link button when it opened from it, and to the text area when it opened by Ctrl or Cmd + K) or the tooltip. It does not reach a dialog around it. | `fichas/nph-dropdown-menu.md`; `fichas/nph-popover.md`; `fichas/nph-tooltip.md`; item 12 |
| Click outside | Closes the link popover without applying; the focus stays where the person clicked. | `fichas/nph-popover.md`, business rules |
| Pointer and focus | On the toolbar buttons, hover paints the piece and does not move the focus (by analogy: the state belongs to the piece). In the menu, the pointer moves the focus to the item (DSA-45 D-6). | `fichas/nph-toolbar.md`, states; `fichas/nph-dropdown-menu.md` |
| Near the window edge | The menu opens below the trigger, aligned to the start, and turns up when it does not fit below and fits above. The popover turns to the opposite side when it does not fit and the opposite has more room. Neither leaves the window; the tooltip turns sides when it does not fit. | `fichas/nph-dropdown-menu.md`; `fichas/nph-popover.md`; `fichas/nph-tooltip.md` |
| Tooltip | Keyboard focus opens the tooltip at once; the pointer opens it after `motion/hover-delay`; it never opens on touch. A disabled button has no tooltip. | `fichas/nph-tooltip.md`; DSA-48 D1; DSA-42 D7 |
| Narrow toolbar | Two states only, wide and narrow, by the box width (see "When to use"); no toolbar in between is drawn. In the narrow one, history and link stay in view and the other groups go to More, in the order of the wide toolbar. A departure from `fichas/nph-toolbar.md` (narrow screen rule, DSA-55 D-5) and P104, item 7: the text of the style trigger is the value of the block and does not leave; the trigger goes whole to More, drawn as an item with a submenu (how the code builds More today is D-1 of the task) (Pend. 3; departure accepted in item 3; the exception goes into the `nph-toolbar` spec in DSA-106). Clear formatting is the last item of More, after a divider (item 4). | https://spark.genesys.com/latest/components/forms-and-inputs/rich-text-editor/usage-XlHQCpoM ; `fichas/nph-toolbar.md` (DSA-55 D-5); P104, item 7 |
| Text area | Grows with the text up to the maximum height and then scrolls inside; the toolbar stays in view. | P93, item 5 |
| Read only | The toolbar leaves (Pend. 5); the text stays readable and selectable, with no hover. The focus of the area follows the `nph-textarea` in read only. | https://ckeditor.com/docs/ckeditor5/latest/features/read-only.html ; `fichas/nph-textarea.md`, focus (DSA-38 D-2) |
| Disabled | Takes no focus. The toolbar and the footer actions fade with the box: their opacity adds to the box's. | T11; DSA-38 D-5 |
| Code | Event, aria, slot, property and console warning stay with the code, following the APG and the Custom Elements Manifest. | — |

## Combined states (T11)

1. Checked + disabled: the checked toolbar button keeps its background and its checked mark, under `rich-text-editor/disabled-opacity` (`state/disabled-opacity`).
2. Error + disabled: disabled wins; the error border goes away and only the opacity stays.
3. In the editor, disabled wins over read only, and read only wins over error (P93, item 2).
4. Inside the disabled box, the actions and the buttons keep their own opacity: 50% over 50%, about 25% on screen (DSA-38 D-5; it follows the `nph-textarea` until that answer).

The matrix in Figma draws: error + disabled → disabled; bold checked + editor disabled; error + read only → read only.

## Order and alignment of the parts (appendix)

| Part (master id) | Order and alignment |
|---|---|
| box (`7744:51`) | Vertical auto layout, from the top and the start: toolbar, divider and body, all at full width. |
| toolbar (instance `7744:52`) | 1st, at the top. Horizontal, from the start, centered in height; 8 px padding on the 4 sides and 8 px between the pieces. |
| toolbar groups (`7743:3` to `7743:98`) | History, block style, formatting, lists, quote, link and clear formatting, each centered in height, with a vertical divider between them; in the narrow one (`7743:105`): history, link and More. |
| divider (instance `7744:76`) | 2nd, right below the toolbar, at full width. |
| body (`7744:78`) | 3rd. Vertical, from the top and the start, 12 px on the sides and 16 px between the area and the footer. |
| scroll area (`7744:79`) | Vertical, from the top and the start, 8 px at the top and the bottom and 8 px between blocks. |
| placeholder, value and content (`7744:80`, `7744:81`, `7744:82`) | Text aligned to the start; each block takes the width of the area. |
| list (`7744:85`) and quote (`7744:92`) | List with a 24 px indent at the start; quote with a bar at the start and a 16 px indent. |
| footer (`7744:95`) | 4th, optional. Horizontal, counter at the start and actions at the end, centered in height; 8 px to the bottom border. |
| actions (`7744:97`) | At the end of the footer, horizontal, 12 px between the buttons. |

## Icon and image

| Icon (Font Awesome, by `nph-icon`) | Weight and size | Where |
|---|---|---|
| `rotate-left` | `light` at rest and `solid` in hover-active (DSA-47 D1); `icon/size-sm`, 16 | undo; a 16 × 16 skeleton in Figma until the design side adds them to the Figma `nph-icon` |
| `rotate-right` | `light` at rest and `solid` in hover-active (DSA-47 D1); 16 | redo |
| `bold`, `italic`, `underline`, `strikethrough` | unchecked `light` in `color/muted-foreground`; checked `solid` in `color/foreground`; 16 (the `nph-togglebutton` icon rule) | formatting; skeleton in Figma until the design side adds them to the Figma `nph-icon` |
| `list-ul`, `list-ol`, `block-quote` | as the formatting; 16 | lists and quote; skeleton in Figma until the design side adds them to the Figma `nph-icon` |
| `link` | `light` at rest and `solid` in hover-active; 16 | link button |
| `text-slash` | `light` at rest and `solid` in hover-active; 16 | clear formatting; skeleton in Figma until the design side adds them to the Figma `nph-icon` |
| `ellipsis` | `light` at rest and `solid` in hover-active; 16 | More, in the narrow toolbar |
| `chevron-down` | `light`; 16 | end of the block style trigger |
| menu and popover icons | those of the piece, by instance | `nph-dropdown-menu` (the single choice check) and `nph-popover` |
| image | the editor has no image; inserting an image is out of the v1 | — |

`bold`, `italic`, `underline`, `rotate-right`, `link`, `ellipsis` and `chevron-down` are in the core icon set today (`design.md`, `icones_nucleo`); `rotate-left`, `strikethrough`, `list-ul`, `list-ol`, `block-quote` and `text-slash` enter it with DSA-108.

## Limits (the limits row of the Figma matrix)

The six cases of the limits row, all drawn:

- **Minimum**: the default field width, `rich-text-editor/width` (`layout/input-width`), with the narrow toolbar and More.
- **Maximum**: the container width; the area stretches and the wide toolbar shows every group.
- **Long text**: the area stops at the maximum height and scrolls inside; the last line shows cut by the scroll; the toolbar stays in view.
- **Empty**: placeholder in `rich-text-editor/placeholder-foreground` (`color/muted-foreground`); the counter, if any, shows 0.
- **Many items**: every group in the wide toolbar; with less room, the narrow toolbar, with the other groups in More. The Figma text says "from right to left": the groups after the history leave and the link stays; no state in between is drawn.
- **Short window**: toolbar with history, link and More.

Out of the v1 (the list of the matrix, with its reason): sticky toolbar on scroll (the area scrolls inside, so the toolbar does not leave the view); toolbar below the area; bubble on selection; menu on an empty line or a side block bar; the "/" command; markdown shortcuts (code behavior with no drawing); markdown with edit and preview; no toolbar; a toolbar that wraps to several lines; a toolbar with horizontal scroll; a permanent "more styles" dropdown; default and subtle densities (one density in the v1, the compact toolbar); button sizes (one size, compact); full container height; resizable by the person; loading; collapsed that expands on focus; ready-made contexts; source code mode; highlighted toolbar. Button groups out of the toolbar in the v1: alignment; media and table; font, font size and color; inline code and code block. A button in a mixed state (`aria-pressed="mixed"`, for a selection that is part bold): no system read shows a look of its own; the look stays the unchecked one, and the code names whether it announces mixed.

## What the editor asks of other pieces

Read on `v/5.0.0` (sheet and code of each piece):

- **`nph-togglebutton`, square icon only** (Pend. 2): the editor needs the compact icon-only toggle 28 × 28, the same square as the `nph-button` with no text. Today the sheet says the icon-only piece "hugs it, never square: 50 by 28" (`fichas/nph-togglebutton.md`, business rules). In Figma the master `2962:71772` (compact, no text) measures 48 × 28; the editor resizes its toggle instances to 28 × 28, padding 4, by override. Pend. 2 asks for the square; making it an opt-in is how this task keeps the other consumers as they are: it asks the `nph-togglebutton` for an opt-in square form of the compact icon only, used by the editor; the default icon only keeps its width for every other consumer, such as the `nph-toggle-group`, and the sheet gains the opt-in.
- **`nph-separator`, line color**: the sheet fixes the separator color at `color/border` (`fichas/nph-separator.md`, business rules and tokens) and its CSS has no color hook. The divider between the toolbar and the area is `rich-text-editor/divider` (`color/border-subtle`). The `nph-dialog` and the `nph-command` already take this path: they override `--nph-color-border` only on their own separator (DSA-80). The editor does the same on its divider; the group dividers in the toolbar keep `color/border`.
- **`nph-dropdown-menu`, nested menu**: the More menu draws Block style, Formatting and Lists as items with a submenu. The `nph-dropdown-menu` today has groups with a label, separators, single and multiple choice, but "the nested menu is out of scope" (`fichas/nph-dropdown-menu.md`, business rules). This is D-1 of the task, for the design owner; it blocks the pull request (blocker B2) until she answers.
- **`nph-popover`, focus return**: the popover gives the focus back to its trigger on Esc, the close button and the footer action (`fichas/nph-popover.md`, business rules). When the popover opened by Ctrl or Cmd + K, the editor brings the focus back to the text area at the cursor or the selection (item 12); the popover does not change. The title Link is the popover title, always visible, naming the surface by `aria-labelledby` (item 5).
- **`nph-command`, Ctrl or Cmd + K**: the palette ignores a key event that is already `defaultPrevented` (`nph-command.ts`, the global shortcut handler). With the focus in the editor, the editor handles Ctrl or Cmd + K and calls `preventDefault`, so the palette does not open (item 13). The `nph-command` does not change.
- **`nph-toolbar`, narrow toolbar**: the exception of item 3 goes into the `nph-toolbar` spec in DSA-106. In code the editor toolbar is the `nph-toolbar` with its slots (P104, item 2), size compact; the Figma slot property (item 10) is design work, apart from this task, and the code does not wait for it.
- **`nph-icon`**: six of the nine icons enter the core set in DSA-108.
- **`nph-textarea`**: unchanged by this task; it moves to `layout/multiline-*` in DSA-107, where its footer gap is also an open decision.

## Inherited decisions

Family: `nph-textarea` → `nph-rich-text-editor`, with the measures of the toolbar and the buttons of the `nph-togglebutton` and the `nph-button`. Read on `v/5.0.0`: "inherits" means it comes by instance, with no change; "open" means it is in `pending_decisions` of that task, and the code follows that task's default until the answer.

| Decision | How it applies |
|---|---|
| DSA-16 D1 to D7 (D1 to D5 open) | In the `nph-input` of the link (Pend. 7): accepted types, clear, measures, focus, precedence, width and light icons. Inherits. D5 also holds on the box: error + hover stays `rich-text-editor/border-error` (`status/error`); disabled + error, disabled wins. |
| DSA-22 D1 to D6; D7 open | In the `nph-togglebutton`: radii, padding, gaps, focus radii and icon swap; checked ↔ unchecked in `motion/state`; reduced motion (D7). It follows D1 to D5 in part: in the editor only, the compact icon only takes an opt-in 28 × 28 square form instead of hugging its icon (50 × 28 in the sheet today); every other consumer keeps the default (Pend. 2; see "What the editor asks of other pieces"). |
| DSA-23 D1 | The `bold`, `italic` and `underline` icons are in the code core. D2 and D3 do not apply (single choice group); D4 and D5, open, do not apply: the arrow keys come from the toolbar (P104, item 5). |
| DSA-61 | The checked `nph-togglebutton` stays as drawn: background and color, no semibold and no outline. Inherits; the contrast is in "Foundation findings". |
| DSA-28 D1 to D6 and D8; D-3 to D-5 open | In the `nph-field`: label, error with no icon, help in `text/caption`, error in `text/body-md`, colors, gaps, the field takes the container and passes disabled to the control. D7, D-1 and D-2 do not apply (the counter sits in the box footer, DSA-38 D-3). |
| DSA-29 (all) | Does not apply: the block style is an `nph-dropdown-menu` opened by a button, not the `nph-select`. |
| DSA-38 D-1 to D-5, open | Sides in `rich-text-editor/content-padding-x` (`space/control-padding`), as D-1, and 8 px at the top and bottom by `rich-text-editor/content-padding-y` (`core/space/200`, item 14); in read only, border and focus stay (D-2); footer inside the box, counter at the start and actions at the end (D-3); width `layout/input-width`, stretching in the `nph-field` (D-4); disabled, the toolbar and the actions fade with the box (D-5). |
| DSA-42 D1 to D5 and D7; DSA-48 D1; D2 open | In the `nph-tooltip` of the icon-only buttons: side as behavior, distance `space/inline`, centered, follows the element, opacity only, no tooltip on a disabled button; waits `motion/hover-delay`; a click during the wait (D2). Inherits. |
| DSA-43 D2, open | In a dialog, the first Esc with the focus on the icon-only button closes the tooltip. Inherits. D1 does not apply. |
| DSA-47 D1 | The icon-only button turns its icon `solid` in hover-active; at rest, in focus with no hover and disabled, it stays `light`. Inherits on undo, redo, link, clear formatting and More. |
| DSA-45 D-1, D-2, D-5, D-6; D-3 open | In the `nph-dropdown-menu`: distance `space/inline-tight`; enter and exit with motion; only the checked item of a single choice takes the brand color (the current block style); the pointer over an item takes the focus. Inherits. D-3 and D-4 do not apply. |
| DSA-55 D-2 and D-5, open | Arrow keys wrap at the ends; the toolbar does not collapse by itself (More is composition). Inherits. D-1, D-3 and D-4 do not apply. The narrow toolbar departs from D-5 by item 3. |
| DSA-64 D-1; DSA-67 D-1, D-2, D-4; D-3 open | D-2: the open trigger of the menu has the open look of the popover trigger (`button/secondary-solid-background-hover`) and `aria-expanded`; it holds on the block style, on More and on the link button. D-3: `aria-controls` points to the popover host. DSA-64 D-1 and DSA-67 D-1 do not apply (ghost toolbar; popover with no arrow). DSA-67 D-4 now applies: the visible title Link (item 5) uses `text/heading-sm`, by the `nph-popover` instance. |
| DSA-59 D1, open | Does not apply: the link uses the default size `nph-input`. |
| DSA-60, DSA-92 | Hover of the secondary ghost in `color/accent`; the light focus border of the `Sistemas` brand on tone 600 in `focus/border`. Inherits. |
| P93, P104, P83, P86, P77, P76 | P93, items 2 to 6 (the family sibling); P104, items 3, 5 and 7 (size on the children, toolbar keyboard, narrow toolbar by composition); P83 (field and control); P86 (embedded tooltip of the icon-only button); P77, amendment of 2026-10-22, item 4 (tooltip in a root `contenteditable`) and rule 5; P76, item 7 (arrow keys only in the toolbar). |

## Decisions answered (approval page of 2026-11-22, items 1 to 15, all approved as recommended)

| Item | Pend. | Answer |
|---|---|---|
| 1 | — | Root accepted (proposals 1 to 8 accepted on 2026-11-22). |
| 2 | — | Documentation accepted (matrix and the 10 sections). |
| 3 | 3 | Narrow toolbar: the block style trigger goes whole to More, not icon only; the exception is recorded in the `nph-toolbar` spec (DSA-106). |
| 4 | 12 | Clear formatting is the last item of More, after a divider. |
| 5 | 13 | The link popover has the visible title "Link", which names the surface by `aria-labelledby`. |
| 6 | 16 | 12 px between the footer actions (`space/inline-loose`); the `nph-textarea` footer stays at 8 px in an open decision of its own (DSA-107). |
| 7 | 18 | Quote text indent 16 px, `rich-text-editor/quote-padding-start` straight to `core/space/400`, by decision. |
| 8 | 17 | The divider stays in `color/border-subtle`; its description gains the editor divider and its "do not use" becomes "the border of a field (color/input)". Cost: 1.13:1 in light, the line almost fades; the toolbar above helps to separate. |
| 9 | 11 | New semantics `layout/multiline-min-height` and `layout/multiline-max-height`; the core heights cite both; the `nph-textarea` moves in a task of its own (DSA-107). |
| 10 | 10 | The `nph-toolbar` gains a slot property in Figma, in a task of its own on the design side; until then the Figma toolbar is the composition `7743:137` with the toolbar tokens. |
| 11 | 9 | A foundation task for the nine icons in the `nph-icon` (Classic Light): DSA-108 in code; skeletons in Figma until the design side adds them to the Figma `nph-icon`. |
| 12 | 14 | Opened by Ctrl or Cmd + K in the text area, Esc, Remove link and Apply give the focus back to the text area; opened by the button, to the button. |
| 13 | 15 | With the focus in the editor, Ctrl or Cmd + K opens the link and does not reach the `nph-command`. |
| 14 | — | `rich-text-editor/content-padding-y` 8 px, straight to `core/space/200`, by decision. |
| 15 | — | `rich-text-editor/list-indent` 24 px, straight to `core/space/600`, by decision. |

Where the points come from: Pend. 1 to 8 (how the toolbar sits in the box, the square toggle, the trigger text, the heading sizes, read only, the quote bar thickness, the link editing in a popover, the disabled history buttons) were not items of the approval page: they follow the recommendation of the proposals, approved with the page. The other appendix points are the items above. The 24 tokens that only alias an existing semantic, with no new value, followed the recommendation with the page.

## Foundation findings, out of this task

- **Focus of the `nph-togglebutton`**: its focus border is `color/primary`, not `focus/border`. In the worst case, 2.71:1 over `color/background` (Gerencial, dark), 1.76:1 over the checked background (the education brand, dark) and 1.41:1 over the hover background (Gerencial, dark): below 3:1. The fix belongs to the `nph-togglebutton`, in a task of its own; the editor inherits it by instance. https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- **Checked `nph-togglebutton`**: the checked background measures 1.26:1 against the toolbar in light and 1.54:1 in dark (worst 1.02:1, Gerencial dark). The state also comes from the icon and `aria-pressed`; it is the decision of DSA-61 (option A). Recorded for the family.
- **Error focus of the fields in dark**: `status/error` measures 1.41:1 against `focus/halo-error`; it holds for the `nph-input`, the `nph-textarea` and the editor, in a foundation task of the fields. The border passes against the inner background (6.96:1).
- **`ellipsis` for More**: `design.md`, `icones_nucleo`, says the horizontal `ellipsis` means omitted items and that more actions is `ellipsis-vertical`; the `nph-toolbar` demo already uses `ellipsis` for More, the precedent the editor follows. A foundation point for the icon notes.
- **Width of the `nph-togglebutton` icon only**: the sheet says 50 × 28 and the Figma master `2962:71772` measures 48 × 28. A foundation point of the `nph-togglebutton`; the editor uses its square opt-in.
- **Third-party library**: the decision map asks for the technical validation of the editing library by the code owner. It goes to this task, with no choice made here (see "Open points" in the task).

## Hidden on purpose in Figma

- `placeholder`, `exemplo formatado` and `rodapé` are off by default (booleans); the documentation turns them on in its examples.
- The focus halo layer is shown only in focus and error focus.
- In read only, the toolbar and the divider are hidden.
- In the link popover, the header close button and the description are off; the title "Link" is on (item 5).
