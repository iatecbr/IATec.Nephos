```json
{
  "task": "DSA-79",
  "gate": "figma-docs-accepted",
  "date": "2026-11-12",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=6047-3760",
    "date": "2026-11-12",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The design owner accepted the visual of the free text root of the nph-combobox (6040:2120) and its documentation frame (6047:3760, page 4128:28570), with COMPONENT_SET nph-combobox free text (6040:3286), and answered the two open points of the appendix: while typing, no suggestion is active, Down activates the first one and Enter with no active suggestion keeps the text and closes the list; with no suggestion, the list closes, without the nph-empty, and the screen reader hears \"no suggestions\". The new token, combobox/free-text-padding-end, aliases space/control-padding. The specification, converted to text, is in this evidence."
  }
}
```

# DSA-79 — `figma-docs-accepted`

The documentation of the free text variant of the nph-combobox (frame `6047:3760`, `4. DOCUMENTAÇÃO`, page `4128:28570`) was accepted in Figma in the file `DS-IA-NEPHOS 5.0`, with the visual acceptance of the root `6040:2120`. It is a field that accepts any text and suggests values from a list. The typed text is the value; the list only helps to fill in faster. It is a variant of the nph-combobox (`1359:115`, DSA-46), without the arrow. Its token came with this task and is on `v/5.0.0`.

What changed in the tokens with this task:

- New component group `combobox/*`, in the semantic collection: `combobox/free-text-padding-end`, an alias of `space/control-padding` (12 px), the same in light and dark (rule T9, rule 2: the end of the field without the arrow zone is the inner horizontal padding of a field). No token points straight to core and no new value entered the core.
- Extended `use` of `space/control-padding` in `design.md`.
- Left without a component token: the field is an instance of the nph-combobox and the list is an instance of the nph-combobox list (`nph-combobox / lista`), each with its own tokens; the icons are `nph-icon` instances; the typography comes from the text style `text/body-md` of the nph-combobox.

There is no command output. The acceptance is a human observation, recorded in the json block above with the frame URL and the component set.

The rest of this file is the contract converted to text, so that whoever codes does not need to open Figma. Figma property and value names stay as they are in Figma, between backticks. Names of the pieces in Portuguese are between backticks only here; in the prose they are in English.

## Purpose

A text field with suggestions. The person writes any value or picks a suggestion from the list to fill in faster; what stays in the field is the value. Use it when the value may not be in the list: job title, place, city, subject. The list suggests what already exists or was already used; the person accepts a suggestion or keeps their own text.

It does not replace the nph-combobox with the arrow (the value must come from the list), the nph-input (a field without suggestions) or the nph-multi-combobox (several values picked from the list).

The property selection is `size` (`default`, `large`), `state`, start (`início`: `lupa`, `ícone`) and content (`conteúdo`: `placeholder`, `valor`, `digitando`). Clear (`limpar`), value (`valor`) and start icon (`⮑ ícone início`) come from the exposed instance of the nph-combobox.

## Component set

| Set | Figma id | What it is |
|---|---|---|
| nph-combobox free text (`nph-combobox · texto livre`) | `6040:3286` | `size` (`default`, `large`) × `state` (`default`, `hover`, `foco`, `erro`, `erro-foco`, `disabled`, `foco-limpar`, `aberto`) × `início` (`lupa`, `ícone`) × `conteúdo` (`placeholder`, `valor`, `digitando`); typing exists only in the focus states (`foco`, `erro-foco`, `foco-limpar`, `aberto`). The exposed nph-combobox instance carries `limpar`, `valor` and `⮑ ícone início`. |

The root is `6040:2120`. The matrix of the variants is the `Matriz — nph-combobox · texto livre` section of the documentation frame.

## Tokens

| Token | Points to | Where it is used, and why |
|---|---|---|
| `combobox/free-text-padding-end` | `space/control-padding` (12) | End padding of the field, where the nph-combobox has the divider and the arrow. The same in every state, with and without the clear button: without the button, the text and the placeholder stop 12 px from the border, mirroring the start; with the button, its 24 × 24 target ends 12 px from the border, so the X icon sits 16 px from the border, in the same column as the X of the nph-input. |

Inherited tokens, already bound on the approved pieces (they stay with those pieces; listed so the code binds the same ones):

| Token | Where in the variant | Light \| dark |
|---|---|---|
| `space/control-padding` | Start of the field (start padding of the nph-combobox) | 12 |
| `space/inline` | Gap between the start icon, the text and the clear target | 8 |
| `space/inline-tight` | Padding around the clear target (24 × 24) and the gap field → list | 4 |
| `layout/input-width` | Width of the field and of the list | 280 |
| `control/height-default` | Field height, `size=default` | 36 |
| `control/height-large` | Field height, `size=large` | 44 |
| `radius/control` | Field corner | |
| `border/width` | Field outline, caret width and focus border of the X | |
| `color/background` | Field background | #FFFFFF \| #0F1114 |
| `color/muted` | Disabled field background | #EDEEEF \| #2D333B |
| `state/disabled-opacity` | Disabled field opacity | 50% |
| `color/input` | Outline in default, disabled and focus on clear | #8F8F8F \| #9399A1 |
| `color/input-hover` | Outline on hover | #737373 \| #B7BBC1 |
| `focus/border` | Outline in focus and open; focus border of the X in focus on clear | #2F68C5 \| #89B4FA |
| `status/error` | Outline in error and error with focus | #B01E1E \| #E35151 |
| `focus/halo` | Focus halo (field and X) | #D8E6FD \| #234E94 |
| `focus/halo-error` | Halo of error with focus | #F1A8A8 (both) |
| `focus/ring-width` | Halo thickness | |
| `focus/radius-control` | Corner of the field halo | |
| `focus/border-radius-control` | Corner of the focus border of the X | |
| `focus/radius-control-with-border` | Corner of the halo of the X | |
| `icon/size-sm` | Magnifying glass, start icon, X and caret height | 16 |
| `color/muted-foreground` | Placeholder, magnifying glass, start icon and X; in the list, the rest of each suggestion | #5C5C5C \| #B7BBC1 |
| `color/foreground` | Value, typed text and caret | #000000 \| #E3E3E3 |
| `text/highlight-weight` | In the list: weight of the typed part | 600 |
| `layout/max-list-height` | In the list: maximum height before it scrolls | 296 |
| `color/accent` | In the list: background of the active suggestion (Down or pointer) | #EDEEEF \| #3C444F |
| `color/popover` | In the list: list background | #FFFFFF \| #2D333B |
| `color/popover-foreground` | In the list: the typed part in the suggestions and the text of suggestions when nothing was typed (for example, a list with groups) | #0C0C0C \| #E3E3E3 |
| `radius/container` | In the list: list corner | |

## Anatomy

Each variant is a frame with no fill, no stroke and no padding, holding one nph-combobox field instance (`campo (nph-combobox)`) at 280 px. The variant draws nothing of its own: over the nph-combobox instance it only changes the end padding to `combobox/free-text-padding-end`, leaves out the divider and the arrow zone, and sets the placeholder text. Order, from the start to the end of the field: start icon, text, clear. The list sits below the field.

1. **Field** — nph-combobox instance without the divider and the arrow: width `layout/input-width` (280), height `control/height-default` (36) or `control/height-large` (44), corner `radius/control`, outline `border/width` in `color/input`, background `color/background`. The parts are centered vertically.
2. **Start icon** — first part, at the start, centered vertically, `space/control-padding` (12) from the border. Light `nph-icon` at `icon/size-sm`, color `color/muted-foreground`: magnifying glass (`início=lupa`) or another icon (`início=ícone`).
3. **Text** — after the icon, at `space/inline` (8); it takes the remaining space, aligned to the start and centered vertically. In `text/body-md`: placeholder in `color/muted-foreground`; value and typed text in `color/foreground`, with the caret while typing.
4. **Clear** — last part, at the end, centered vertically, `space/inline` (8) from the text. A 24 × 24 target with `space/inline-tight` (4) around the light `nph-icon` xmark (`icon/size-sm`, `color/muted-foreground`). It shows when there is text, except when disabled; after it, the end of the field is `combobox/free-text-padding-end` (12) from the border.
5. **Suggestion list** — nph-combobox list instance, `space/inline-tight` (4) below the field, aligned to the start of the field and with the same width. Near the end of the window, it opens above the field.
6. **Suggestion** — list item, aligned to the start: the typed part is highlighted (`text/highlight-weight`) and the rest is in `color/muted-foreground`; the active suggestion (Down or pointer) gets the `color/accent` background.

## Properties

| Property | Values and rule |
|---|---|
| `size` | `default` (default), height `control/height-default` (36); `large`, height `control/height-large` (44). The rest of the field is the same in both sizes. |
| `state` | `default` (default); `hover`, outline `color/input-hover`; `foco`, outline `focus/border` with the halo `focus/halo`; `erro`, outline `status/error`; `erro-foco`, `status/error` with the halo `focus/halo-error`; `disabled`, background `color/muted` under `state/disabled-opacity`, without the X; `foco-limpar`, focus on the X; `aberto`, focus on the field with the suggestion list below. |
| `início` | `lupa` (default) or `ícone`. The icon is swapped in `⮑ ícone início` for another light `nph-icon` (default globe). |
| `conteúdo` | `placeholder` (default), `valor` or `digitando`. Typing exists in the focus states (`foco`, `erro-foco`, `foco-limpar`, `aberto`) and shows the caret. |
| `limpar` | Boolean of the exposed instance, on by default. The X shows when there is text (value or typing), except when disabled. |
| `valor` | Text of the exposed instance (default "Selected option", in Portuguese in Figma). Replace with the real value. |
| What is not a property | The suggestion list is an nph-combobox list instance placed below the field (search, groups, loading or results); the code opens, filters and closes it. With no suggestion, the list closes, without the nph-empty, and the screen reader hears "no suggestions". A start avatar and read only are not part of the variant. |

## Combined states (rule T11)

- **Error + disabled** (rule 2): disabled wins; the `status/error` outline goes away and the `color/muted` background under `state/disabled-opacity` stays. The combination is not a variant; the code applies the rule.
- **Selected + disabled** (rule 1), in the list: a suggestion equal to the text and disabled keeps `color/primary-surface` and the check, under `state/disabled-opacity` (DSA-29 D-3).
- The rule needs no new token.

## Relations

Combine it with the label and the help or error message of the form, above and below the field, as in the nph-input. The list is the one of the nph-combobox: the theme sets the colors, and the code opens, filters and closes the list.

| Relation | Value |
|---|---|
| field → list | `space/inline-tight` (4) below the field. Near the end of the window, the list opens above, with the same gap. |
| start icon → text | `space/inline` (8) |
| text → clear | `space/inline` (8) |
| clear → end border | `combobox/free-text-padding-end` (12, → `space/control-padding`), the same indent as the start |
| field and list | Same width, `layout/input-width` (280). The list grows up to `layout/max-list-height` (296) and then scrolls. |
| free text × nph-combobox | In a form with both, the free text has no arrow and the closed list one has it; height and start indent are the same. |

## When to use

- Use the free text when the value may be new: job title, place, city, subject.
- Use the nph-combobox with the arrow when the value must come from the list: status, state, registered unit.
- Use `size` large when the whole form uses large; in the same form, the fields have the same size.
- Use `início=ícone` when an icon tells the type of the value (for example, a globe for a place); use the magnifying glass when the field searches.
- Use groups in the list (for example, Recent and All) when the product keeps what the person already used.

## Required examples

1. Event location: the person types "Uni" and sees places already used, with the typed part highlighted; none is active until Down. A new place is also valid.
2. Event location with history: when opened with Alt+Down, Recent comes before All, with no active suggestion.
3. New job title: "UX Coordination" is not in the list and stays as the value on leaving the field.

## Do

- Write the placeholder as an invitation ("Type or pick a suggestion"), because it says both ways are valid.
- Keep the typed text on leaving the field, because it is the value.
- Highlight the typed part in the suggestions, because the person sees why each one showed up.
- Show the X when there is text, because it clears the field in one touch.
- Use the same width for the field and the list, because the list reads as a continuation of the field.

## Do not

- Do not use it when the value must come from the list (status, state, registered unit): free text accepts typos. Instead: the nph-combobox with the arrow.
- Do not show "No option found" when there is no suggestion: the typed text is already valid. Instead: close the list and keep the text.
- Do not let the first suggestion become active by itself while typing: Enter would replace the text with the suggestion. Instead: none active until Down or the pointer.
- Do not put the arrow on a free text field: the arrow says that what is in the list is what counts. Instead: the clear X at the end of the field.

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | Value and typed text (`color/foreground`) and placeholder (`color/muted-foreground`) pass 4.5:1 on `color/background` in both themes (placeholder: 6.69:1 light, 9.81:1 dark). The `color/input` outline passes 3:1 (3.23:1 light, 6.58:1 dark), as WCAG 1.4.11 asks for a field outline. |
| Visible focus | In focus, the outline becomes `focus/border` (5.37:1 light, 8.98:1 dark), with the `focus/halo` outside. In focus on clear, the ring sits on the X: border `focus/border` and halo `focus/halo`. In error with focus, the outline stays `status/error` and the halo is `focus/halo-error`. |
| Color is not the only signal | The error comes with the field message, in text, besides the `status/error` outline. In the highlighted part, besides the color, the weight (`text/highlight-weight`) marks it. Hover changes the outline tone (`color/input` → `color/input-hover`) as pointer feedback; it is not a state signal. |
| Touch target | The field is 36 (default) or 44 (large) high. The X has a 24 × 24 target, the WCAG 2.5.8 minimum. |
| Accessible name | The field is `role="combobox"` and takes the name of the form label. The X is a button with a name (for example "Clear"). The magnifying glass and the start icon are decorative (`aria-hidden`). The list is `role="listbox"` and each suggestion `role="option"`. |
| Keyboard | Down activates the first suggestion and, with the list closed, also opens it; Up, with the list closed, opens it and activates the last one; Alt+Down opens without activating; Enter picks the active suggestion and, with no active suggestion, keeps the text and closes the list; Esc closes the list and, with it closed, clears the text. It follows the WAI-ARIA APG combobox with list pattern. |
| Disabled | Background `color/muted` under `state/disabled-opacity` (50%), without the X. Disabled text is exempt from the contrast requirement (WCAG 1.4.3). |

## Behavior

Base: the WAI-ARIA APG combobox with list pattern (`aria-autocomplete="list"`). The field is `role="combobox"`, with `aria-expanded`, `aria-controls` and `aria-activedescendant`; the list is `role="listbox"`. No deviation from the APG; the difference from the nph-combobox (DSA-46 D-5) is in the decisions answered below.

| Situation | Behavior |
|---|---|
| Initial state | List closed; the field shows the placeholder or the value. |
| Typing | Opens the list with the suggestions that contain the text, with the typed part highlighted. No suggestion is active. |
| Down and Up | Down activates the first suggestion and, with the list closed, also opens it; Up, with the list closed, opens it and activates the last one; Alt+Down opens without activating any. With the list open, Up and Down move the active suggestion; at the ends of the list they behave as in the nph-combobox (`fichas/nph-combobox.md`). The field text does not change while navigating. |
| Enter | With an active suggestion: puts the suggestion in the field and closes the list. With no active suggestion: keeps the text and closes the list. List already closed: passes on (for example, the form submit), as in the APG. |
| Esc | List open: closes the list. List closed: clears the text (DSA-46 D-4). No text: passes on. |
| Tab and leaving the field | Closes the list; the typed text stays as the value and is not replaced by a suggestion. |
| Focus on open and on close | The focus stays on the field the whole time; `aria-activedescendant` points to the active suggestion. On close, the focus stays on the field. |
| Click on a suggestion | Puts the suggestion in the field, closes the list and the focus stays on the field. |
| Outside click | Closes the list; the text stays. |
| Pointer × focus | The pointer over a suggestion makes it the active one, and the keyboard continues from there (DSA-45 D-6); the DOM focus stays on the field. |
| Clear X | Clears the text, closes the list and returns the focus to the field. |
| No suggestion | The list closes, without the nph-empty; the screen reader hears "no suggestions" through an `aria-live` region. |
| Loading | The list shows the loading state, with `aria-busy`. |
| Near the window edge | With no room below, the list opens above the field, at `space/inline-tight` (DSA-29 D-2); it shrinks to fit and scrolls. |
| Movement | The list enters and leaves with a fade and a slide of `space/inline-tight` in `motion/enter-*` and `motion/exit-*` (DSA-45 D-2); with reduced motion, no slide. |
| Minimum characters and number of suggestions | Stay with the code (about 10 suggestions in view). |

Event, aria, slot, property and console warning stay with the code, following the APG and the Custom Elements Manifest.

## Icon and image

- Magnifying glass (`início=lupa`): `nph-icon` magnifying-glass, light weight in every state and size, `icon/size-sm` (16), color `color/muted-foreground`. It does not turn solid.
- Start icon (`início=ícone`): light `nph-icon`, default globe, `icon/size-sm`, `color/muted-foreground`; swapped in `⮑ ícone início` for another light `nph-icon`.
- Clear X: `nph-icon` xmark light, `icon/size-sm`, `color/muted-foreground`, in a 24 × 24 target (`space/inline-tight` around).
- Image: none. A start avatar is outside the variant (the value is text, not a chosen person).

## Inherited decisions (family select → dropdown menu → combobox → context menu)

- Follows DSA-46 D-3: in the active suggestion, the rest of the text stays in `color/muted-foreground` and the typed part keeps the highlight (`text/highlight-weight`); the other suggestions stay the same.
- Follows DSA-46 D-4: Esc with the list closed clears the typed text; with no text, it passes on.
- Follows DSA-46 D-2: if there is a shortcut footer, it is the `shortcuts` slot, with a `color/border` line above and `space/inline` around.
- Does not follow DSA-46 D-1 (the "+ Create …" row): in free text, the typed text is already the value. D-1 still holds in the create mode of the nph-combobox.
- Does not follow DSA-46 D-5 (the first suggestion active while typing): Enter would replace the text with the suggestion. See the decisions answered.
- Follows DSA-31 D2: the list is the one of the nph-combobox, built once; the variant does not draw its own list.
- Follows DSA-29 D-2: near the end of the window, the list opens upward, `space/inline-tight` from the field.
- Follows DSA-29 D-3: a suggestion equal to the text and disabled keeps `color/primary-surface` and the check, under `state/disabled-opacity`.
- DSA-29 D-1 (arrow zone when disabled) does not apply: the variant has no arrow zone.
- Follows DSA-45 D-1: `space/inline-tight` (4) between the field and the open list.
- Follows DSA-45 D-2: the list enters and leaves with a fade and a slide of `space/inline-tight` in `motion/enter-*` and `motion/exit-*`.
- Follows DSA-45 D-6: the pointer over a suggestion makes it the active one, and the keyboard continues from there.
- DSA-67 D-2 does not apply: here the trigger is a field; open is the focus of the field, as `state=aberto` of the nph-combobox.

## Decisions answered

1. **Active suggestion while typing** (replaces DSA-46 D-5 for this variant only): in free text, no suggestion is active while typing; Down activates the first one; Enter with no active suggestion keeps the text and only closes the list. D-5 still holds in the nph-combobox with the arrow. Sources: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/ · https://github.com/alphagov/accessible-autocomplete · https://mui.com/material-ui/react-autocomplete/
2. **List with no suggestion**: the list closes, without the nph-empty, and the screen reader hears "no suggestions". The `state=vazio` list still holds in the nph-combobox. Sources: https://mantine.dev/core/autocomplete/ · https://alphagov.github.io/accessible-autocomplete/examples/ · https://www.nngroup.com/articles/site-search-suggestions/
3. **End padding**: `combobox/free-text-padding-end` on `space/control-padding` (12), without a question to the design owner, because it only aliases an existing semantic with the same function.

## Outside this task

The nph-combobox with the arrow (`1359:115`) does not change: its D-1 (create row), D-5 (first suggestion active) and empty list stay as they are. There is no separate nph-autocomplete: free text is this variant of the nph-combobox.
