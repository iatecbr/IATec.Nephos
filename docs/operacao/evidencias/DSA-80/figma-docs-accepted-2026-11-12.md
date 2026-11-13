```json
{
  "task": "DSA-80",
  "gate": "figma-docs-accepted",
  "date": "2026-11-12",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=6076-4910",
    "date": "2026-11-12",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The design owner accepted the visual of the nph-command root (6067:3610), with the two changes of the accepted Proposal 1 (the lines in color/dialog-separator instead of color/border, and the radius at 10, radius/overlay, instead of 12 to 16), and its documentation frame (6076:4910, page 1626:18), with COMPONENT_SET nph-command (6068:3936). She answered the open points of the appendix as recommended: the surface is drawn with the dialog semantics and the code mounts it on the nph-dialog with a new option (Pend. 2); the item keeps the nph-dropdown-menu pair on color/dialog (Pend. 3); list and footer padding in space/inline-tight and space/inline (Pend. 5); dark panel without border (Pend. 9); list ceiling in layout/max-list-height (Pend. 10); a disabled item is skipped (Pend. 14); the resting icon stays grey, color/muted-foreground (Pend. 15). The dark contrast of the destructive item and of the field focus border (Pend. 12 and 13) goes to one foundation task, DSA-81. The 15 command/* tokens alias existing semantics. The specification, converted to text, is in this evidence."
  }
}
```

# DSA-80 — `figma-docs-accepted`

The documentation of the nph-command (frame `6076:4910`, `4. DOCUMENTAÇÃO`, page `1626:18`) was accepted in Figma in the file `DS-IA-NEPHOS 5.0`, with the visual acceptance of the root `6067:3610`. It is a command palette in a dialog panel: a search field at the top, a list of commands by group and a footer of keyboard hints. The person types, sees only what matches and runs it with Enter. Its tokens came with this task and are on `v/5.0.0`.

What changed in the tokens with this task:

- New component group `command/*`, 15 tokens in the semantic collection, all aliases of existing semantics; they change between light and dark only where the semantic itself does. No token points straight to core and no new value entered the core (rule T9).
- Extended `use` in `design.md`: `color/dialog`, `color/dialog-separator` (use and do not use), `text/highlight-weight`, `radius/overlay`, `layout/max-list-height`, `layout/dialog-md`, `space/inline-tight` and `space/inline`.
- Not extended, because their current `use` already covers the case: `color/muted-foreground` (helper text and state label), `space/container-padding` (padding of a panel and dialog) and the effect style `elevation/modal`.
- Left without a component token: the field, the lines, the items, the group labels, the keys, the empty state and the spinner are instances of approved pieces and keep their own tokens. The shadow is the effect style `elevation/modal`, used directly.

There is no command output. The acceptance is a human observation, recorded in the json block above with the frame URL and the component set.

The rest of this file is the contract converted to text, so that whoever codes does not need to open Figma. Figma property and value names stay as they are in Figma, between backticks.

## Purpose

A command palette. The person opens it with Ctrl+K (⌘K on Mac), searches by name and runs an action or goes to a page without leaving the keyboard. Use it as the global shortcut of the product: actions ("Novo documento") and pages ("Ir para o início") that the person knows by name. The list shows the commands by group and filters while the person types; Enter runs the active command.

It does not replace the nph-combobox (picking a value for a form field), the nph-dropdown-menu (actions of a button or a row) or the search of page content.

## Component set

| Set | Figma id | What it is |
|---|---|---|
| nph-command | `6068:3936` | `conteudo` (`resultados` default, `grupos`, `busca`, `vazio`, `carregando`) × boolean `rodapé` (default on). 5 variants. |

The root is `6067:3610`. The matrix of the variants is the `Matriz` section of the documentation frame. The old set `nph-command` `1639:574` has no page in the file; it is not this contract.

## Tokens

| Token | Points to (light \| dark) | Where it is used |
|---|---|---|
| `command/background` | `color/dialog` (#FFFFFF \| #3C444F) | Fill of the panel. The command is a dialog, not a popover. |
| `command/radius` | `radius/overlay` (10) | The 4 corners of the panel (decided: 10, not 12 to 16). |
| `command/max-width` | `layout/dialog-md` (560) | Width ceiling of the panel. It hugs the content up to here; never a fixed width. |
| `command/divider` | `color/dialog-separator` (#E3E3E3 \| #4B5563) | Color of the two lines (nph-separator) between field and list and between list and footer, as the lines of the nph-dialog (decided; DSA-46 D-2 asked for color/border). |
| `command/search-padding` | `space/inline-tight` (4) | Padding of the search row around the field on all four sides, the same as the list padding, so the field lines up with the items. |
| `command/list-max-height` | `layout/max-list-height` (296) | Maximum height of the list; above it, the list scrolls (8 items of 36 plus the padding, DSA-29 D9). |
| `command/list-padding` | `space/inline-tight` (4) | Padding of the list on all four sides. |
| `command/highlight-weight` | `text/highlight-weight` (600) | Weight of the stretch of the item label that repeats what the person typed. |
| `command/state-padding` | `space/container-padding` (16) | Padding of the loading row on all four sides. The empty state uses the nph-empty with its own padding. |
| `command/status-gap` | `space/inline-tight` (4) | Gap between the spinner and the text of the loading row. |
| `command/status-foreground` | `color/muted-foreground` (#5C5C5C \| #B7BBC1) | Text "Buscando…" of the loading row. |
| `command/footer-padding` | `space/inline` (8) | Padding of the hint footer on all four sides (DSA-46 D-2). |
| `command/footer-gap` | `space/inline` (8) | Gap between the hints of the footer. |
| `command/hint-gap` | `space/inline-tight` (4) | Gap between the key (nph-kbd) and the word of each hint. |
| `command/footer-foreground` | `color/muted-foreground` | The word of each hint. |

`command/search-padding`, `command/list-padding` and `command/footer-padding` are padding, while `space/inline-tight` and `space/inline` described gaps; the `use` of both semantics in `design.md` was extended with these cases. The values are the ones she already answered in DSA-29 D9 and DSA-46 D-2.

## Anatomy

Order from top to bottom, all parts at the full width of the panel: search row, line, list, line, hint footer. Read layer by layer in the 5 variants of `6068:3936`:

| Part | Kind | Layout | Tokens and text style |
|---|---|---|---|
| Panel (`conteudo=*`) | frame of the variant | vertical, no padding, gap 0, does not clip | fill `command/background`, corners `command/radius`, max width `command/max-width`, effect style `elevation/modal`, no stroke |
| Search row (`busca`) | frame | horizontal, padding 4 on all sides, gap 0 | padding `command/search-padding`; holds the field |
| Search field | instance of `nph-input` `size=large`, `state=foco` (552 × 44) | — | its own tokens (`control/height-large`, `radius/control`, `focus/border`, `focus/halo`, `color/background`); magnifying glass at the start, placeholder "Buscar comando…" |
| Line × 2 | instance of `nph-separator` (1 px) | full width | line color overridden to `command/divider`; thickness `border/width` |
| List (`lista`) | frame | vertical, padding 4, gap 0, clips content | padding `command/list-padding`, max height `command/list-max-height` |
| Item | instance of `nph-dropdown-menu / item` (36 high) | — | its own tokens; icon and label at the start, shortcut as text at the end; the active item is the `hover` state (`color/primary-surface`, solid icon, label and shortcut in `color/accent-foreground`) |
| Typed stretch in the label (`busca`) | text range of the item label | — | weight `command/highlight-weight`, in the label color (`color/popover-foreground` at rest, `color/accent-foreground` on the active item); the rest of the label in `color/muted-foreground` and its regular weight, also on the active item (DSA-46 D-3) |
| Group label | instance of the nph-dropdown-menu group label (24 high) | — | its own tokens; no divider between groups |
| Empty (`vazio`) | instance of `nph-empty` inside the list | — | its own tokens and padding (`space/container-padding`); title "Nenhum comando encontrado" and hint "Confira o que digitou ou busque outro termo." |
| Loading row (`carregando`) | frame inside the list | horizontal, padding 16, gap 4, centered on both axes | padding `command/state-padding`, gap `command/status-gap` |
| Spinner | instance of `nph-spinner` (16) | — | its own tokens (`icon/size-sm`, `color/primary`) |
| "Buscando…" | text | — | text style `text/body-sm`, color `command/status-foreground` |
| Hint footer (`rodapé de dicas`) | frame | horizontal, padding 8, gap 8, start aligned, vertically centered | padding `command/footer-padding`, gap `command/footer-gap` |
| Hint (`dica — navegar`, `— abrir`, `— fechar`) | frame | horizontal, gap 4, vertically centered | gap `command/hint-gap` |
| Key | instance of `nph-kbd` (24 high) | — | its own tokens; keys "↑↓", "↵", "esc" |
| Hint word ("navegar", "abrir", "fechar") | text | — | text style `text/caption`, color `command/footer-foreground` |

With `rodapé` off, the second line and the footer are hidden; the rest does not change. The veil and the position on screen belong to the dialog and appear only in the preview.

## Properties

| Field | Rule |
|---|---|
| `conteudo` | `resultados` (default): commands without groups, the 1st active. `grupos`: group labels (e.g. Recentes, Ações, Navegar) and the list at its ceiling, scrolling; the last label appears at the end with its items below the scroll cut. `busca`: field with the typed text, only the matching commands, the typed stretch highlighted and the 1st active. `vazio`: nph-empty with title and hint. `carregando`: nph-spinner sm and "Buscando…". |
| `rodapé` | Boolean, on by default. Off hides the second line and the hints. |
| item (by instance) | Each item swaps start icon, label, shortcut, description, tag, counter, type (`default` or `destructive`) and state (`default`; `hover` for the active item; `disabled`) on its own nph-dropdown-menu item instance. |
| field (by instance) | The field stays in `state=foco` in every `conteudo`, because the keyboard focus does not leave it. The text swaps on the instance: the placeholder or the typed value. |
| not a property | The veil, the position on screen, opening, closing and filtering belong to the dialog and to the code. No sizes, submenu, multiple selection or nested pages in the first version. |

## Combined states (rule T11)

Destructive + disabled uses the item variant `tipo=destructive`, `state=disabled` (`1365:48`); disabled wins. The command does not mark an item and does not show an error, so rules 1 and 2 of T11 have no case here. No new token.

## Relations

It lives in the nph-dialog: the veil (`overlay/scrim`) comes from it; the changes the command needs in the dialog are in Pend. 2 below. It reuses the nph-input field, the nph-separator lines, the item and the group label of the nph-dropdown-menu, the nph-kbd, the nph-empty and the nph-spinner; the theme controls the colors.

| From → to | Space and rule |
|---|---|
| panel → field | `space/inline-tight` (4) around the field, the same as the list padding, so the field lines up with the items. |
| field → list | One nph-separator line, from start to end of the panel. |
| list → items | `command/list-padding` (4) around; the items are stacked, with no gap between them. |
| group → group | The group label opens each group; the label's own space separates the groups, without a divider. |
| list → footer | Another nph-separator line; the footer has `command/footer-padding` (8) around and `command/footer-gap` (8) between hints. |
| trigger → palette | A button or a short field with Ctrl K opens the palette (e.g. the search of the side menu); on close, focus returns to it. |
| window → palette | Width hugs the content up to `layout/dialog-md` (560); the dialog window goes up to `layout/dialog-max-height` (640), with minimum width `layout/dialog-min-width` (320). In a short window, the list shrinks and scrolls. |

## When to use

- Use the nph-command as a global shortcut: actions and pages of the whole product in one place, opened by keyboard.
- Use the nph-combobox when the person picks a value for a form field.
- Use the nph-dropdown-menu when the actions belong to a button or a row of the screen.
- Use groups (e.g. Recentes, Ações, Navegar) when the list mixes kinds of command.
- Show the shortcut on the item when the action has its own key.

## Required examples

1. Open by key: Ctrl+K opens the palette with the command list; the 1st is already active and Enter runs "Novo documento".
2. Search: the person types "conf" and the list shows only what matches, with the stretch highlighted; "Abrir configurações" is active.
3. Nothing found: with "xyz", the empty state says nothing was found and suggests another term; the footer stays.

## Do

- Name the command with verb and object ("Abrir configurações", "Excluir rascunho"), because the person searches by the action.
- Keep the 1st result active while the person types, because Enter runs it without another key.
- Show the item shortcut when it exists, because the person learns the shortest path.
- Separate groups by space and label, because a divider between groups weighs the panel and disappears when filtering.
- Keep the hint footer on, because it teaches the palette keys.

## Do not

- Do not use the palette to pick the value of a field: it runs actions, it does not fill a form. Instead: nph-combobox.
- Do not put a divider between groups. Instead: space and group label.
- Do not leave the search without an active item: Enter would do nothing. Instead: the 1st result active.
- Do not show the empty state without the hint. Instead: title and description of the nph-empty, with what to do.

## Accessibility

| Criterion | Rule |
|---|---|
| contrast | Item label (`color/popover-foreground`) on `color/dialog`: 19.56:1 light, 7.68:1 dark. Shortcut, group label, hints and helper text (`color/muted-foreground`): 6.69:1 and 5.11:1; the resting item icon, same color, the same, above 3:1. Active item: label and shortcut (`color/accent-foreground`) on `color/primary-surface`: 17.39:1 and 13.55:1; in the search, the rest of the label (`color/muted-foreground`) on `color/primary-surface` measures 5.57:1 to 6.25:1 light and 7.93:1 to 10.34:1 dark across the 7 brands. The destructive item measures 6.88:1 light and 3.62:1 dark, below 4.5:1: fixed at the source by DSA-81, not here. |
| visible focus | Keyboard focus stays on the field: `focus/border` with `focus/halo`, from the nph-input. On `color/dialog` the border measures 4.32:1 to 12.61:1 light in the 7 brands; dark, 4.02:1 to 6.62:1 in 4 brands and below 3:1 in Gerencial (2.56:1), Recursos Humanos (2.64:1) and Igrejas (2.93:1): fixed at the source by DSA-81. The active item is marked by its fill, without a ring. |
| color is not the only signal | The active item changes fill and its icon goes from light to solid. The searched stretch gains weight. The destructive command says the action in its label. |
| dark theme | The panel (`color/dialog`) is lighter than the page, without a border. The field (`color/background`, 1.92:1 against the panel) and the active item (`color/primary-surface`, 1.77:1) are darker than the panel, like a well. Normal text passes 4.5:1 in both themes. |
| target | Each item is 36 high at the list width; the field is 44. Both pass the 24 × 24 minimum of WCAG 2.5.8. |
| accessible name | The panel is `role="dialog"` with `aria-modal="true"` and the name "Paleta de comandos", in a title for screen readers only. The field is `role="combobox"`; the list is `role="listbox"`, each group `role="group"` named by its label, each item `role="option"`. The item shortcut is `aria-hidden`: the label already names the command. |
| keyboard | Ctrl+K or ⌘K opens and closes; Up and Down move the active item; Home and End go to the first and the last; Enter runs; Esc closes and returns focus to the trigger; Tab stays trapped in the dialog. WAI-ARIA APG: combobox with listbox inside a modal dialog. |
| announcements | The number of results and the empty state are announced in `aria-live="polite"`; while loading, the list has `aria-busy="true"`. |
| disabled | An unavailable command uses the item `state=disabled`, dimmed by the piece itself, and does not run. Disabled text is outside the contrast requirement (WCAG 1.4.3). |

## Behavior

Base: WAI-ARIA APG, combobox with listbox inside a modal dialog.

| Event | What happens |
|---|---|
| Open | Ctrl+K (⌘K on Mac) or the trigger opens the dialog with focus on the field and the whole list; the 1st item is active. The same key closes. |
| Type | Filters on each key. Matching items show the highlighted stretch and the 1st is active (DSA-46 D-5). A group without items disappears with its label. |
| Up and Down | Move the active item (`aria-activedescendant`); keyboard focus stays on the field. On the last item, Down stops there, without wrapping to the first (cmdk default; wrapping is the code's call). |
| Home and End | Go to the first and the last item. |
| Enter | Runs the active command and closes the palette. With no active item (empty or loading), does nothing. |
| Esc | Closes the dialog and returns focus to the trigger, with or without text in the field (does not follow DSA-46 D-4: the list is always open inside the dialog). |
| Tab and Shift+Tab | Trapped in the dialog (APG Dialog); the field is the only stop, so focus does not leave it. |
| Focus on open and close | On open, the field. On close (Enter, Esc, outside click or the open key), back to the trigger. |
| Click on an item | Runs the command and closes the palette. |
| Click outside | A click on the veil closes the palette, as Esc. The nph-dialog today does not close on a veil click (spec, line 151): this is one of the dialog options asked in Pend. 2. |
| Pointer × focus | The pointer over an item makes it active, and the keyboard continues from there (DSA-45 D-6). Keyboard focus stays on the field. |
| Disabled item | Shown dimmed and does not run. Up, Down, Home, End and the pointer skip it (decided, Pend. 14), as cmdk, Headless UI, React Aria, Radix and Primer. No "disabled active" variant. |
| No result | `conteudo=vazio`: nph-empty with title and hint, no active item. Zero results goes to `aria-live="polite"`. |
| Loading | `conteudo=carregando`: nph-spinner and "Buscando…"; the list has `aria-busy="true"`. When the items arrive, the 1st is active and the number of results goes to `aria-live`. |
| Long list | Grows up to `command/list-max-height` (296) and scrolls; the active item scrolls into view. |
| Position and short window | Centered horizontally. The appendix recommends it near the top (about 16% of the window height, as Nord), so the panel does not jump while the list filters; the nph-dialog centers vertically today and there is no token for that offset: an open point of the code (Pend. 2). Up to `layout/dialog-max-height` (640), minimum width `layout/dialog-min-width` (320); in a short window the list shrinks and scrolls. |
| Motion | Enters and leaves as the nph-dialog: only the opacity of the window and the veil, on `motion/enter-*` and `motion/exit-*`; with reduced motion, the duration is `motion/hover-duration` (nph-dialog spec; WCAG 2.3.3). |
| Group label | Never takes focus nor becomes active; it names the `role="group"`. |

## Icon and image

| Piece | Weight, size and color |
|---|---|
| item icon | nph-icon light at rest (e.g. plus, gear, circle-question, trash, house, user, folder, arrow-right), `icon/size-md` (20), color `color/muted-foreground` from the instance (decided: grey, Pend. 15). On the active item, the solid version in `dropdown/item-hover-icon-foreground`. The swap is fixed in each item variant. |
| field magnifying glass | nph-icon magnifying-glass light, `icon/size-sm` (16), from the nph-input. |
| spinner | nph-spinner sm, color `color/primary`, from the piece. |
| empty | The nph-empty illustration, which swaps in dark (`scheme/is-light`). The command exports no image. |

## Inherited decisions (family select → dropdown menu → combobox → context menu)

- Follows DSA-29 D3 (label and secondary text on one line, ellipsis at the end) for the item label and description.
- Follows DSA-29 D9: `command/list-max-height` and `command/list-padding`.
- Follows DSA-46 D-2 in part (footer with a line above and `space/inline` around): the line is the nph-separator in `color/dialog-separator`, not `color/border` (decided).
- Follows DSA-46 D-3 (rest of the text in `color/muted-foreground`, searched stretch in `text/highlight-weight`).
- Follows DSA-46 D-5 (while typing, the 1st result is active; Enter runs it).
- Does not follow DSA-46 D-4 (Esc with the list closed clears the text): the list is always open; Esc closes the dialog.
- Follows DSA-45 D-6 (pointer moves the active item, keyboard continues from there).
- Follows DSA-45 D-2 in part: the `motion/enter-*` and `motion/exit-*` pair; the slide next to the trigger does not apply in a dialog, which enters by opacity only.
- DSA-69 D-4 (resting icon in the label color) does not apply here: the command keeps the approved item instance, icon in `color/muted-foreground` (decided, Pend. 15). If D-4 is to hold, the fix is in the nph-dropdown-menu for every consumer, not in the command. Follows the solid icon on highlight (DSA-45, DSA-69).
- Follows DSA-69 D-5 in part: no submenu in v1, one Esc closes.
- Follows DSA-29 D5 in part (keyboard active = hover look): the color comes from the item hover, `color/primary-surface`.
- Do not apply: DSA-29 D1, D-2, D2, D4, D6, D7, D-1, D8, D-3; DSA-36 D2; DSA-45 D-1, D-4, D-5; DSA-46 D-1; DSA-69 D-3 (the command does not open attached to a trigger, has no arrow, does not mark, does not create, opens by shortcut or trigger).
- Open in the family, nothing inherited: DSA-45 D-3; DSA-69 D-1 and D-2; DSA-44 D1 to D6 (nph-dialog).

## Decisions answered

| Point | Decision |
|---|---|
| Pend. 2 — the nph-dialog does not take the command as it is | In Figma the command draws its own surface with the dialog semantics (`color/dialog`, `radius/overlay`, `elevation/modal`, no padding). In code, mount it on the nph-dialog. The command needs from it, as options of the dialog: (1) a title for screen readers only ("Paleta de comandos"); (2) no padding (today fixed `space/overlay-padding`); (3) no close button (`hide-close`; the spec allows it only when the footer offers the way out, and here Esc, Enter, the open key and a veil click close); (4) a veil click closes (today it does not, spec line 151); (5) new close origins in `nph-close` `detail.source` (today only escape and close-button): the open key, a command run and the veil; (6) optionally, the placement near the top instead of the vertical center. This task asks for those options; their names and API are the code's call. The nph-dialog set is not in Figma today. |
| Pend. 3 — item color pair inside the dialog | Keep the nph-dropdown-menu item (`color/popover-foreground`) on `color/dialog`. Both texts are #0C0C0C \| #E3E3E3; only the pair name changes. |
| Pend. 4, 6, 7, 8, 11 (answered by the accepted Proposal 1) | Field: nph-input `size=large` with the magnifying glass, in `state=foco` while open. Shortcut on the item as text, not nph-kbd. Radius `radius/overlay` (10). Lines in `color/dialog-separator`. |
| Pend. 5 — list and footer padding | `space/inline-tight` and `space/inline`, no new semantic. |
| Pend. 9 — dark panel | No border in dark; elevation by fill only. Field and active item darker than the panel. |
| Pend. 10 — list ceiling | `layout/max-list-height` (296), description extended to the nph-command. |
| Pend. 12 and 13 — dark contrast | One foundation task, DSA-81: lighten `color/destructive-text` in dark to 4.5:1 on `color/dialog`, and `focus/border` in dark of Gerencial, Recursos Humanos and Igrejas to 3:1 on `color/dialog` (keeping 3:1 on `color/background`). No local override in the command. |
| Pend. 14 — disabled item | Skipped by keys and pointer. |
| Pend. 15 — resting icon | Grey, `color/muted-foreground`, as the approved item. |
| Pend. 1 — decision map line 156 ("adia") | A finished component enters the first version; the line becomes "entra", first consumer the ⌘K search of the side menu. |

## Outside this task

No submenu, nested pages, multiple selection or sizes in v1. No change to the nph-dropdown-menu, the nph-input or the nph-empty. The dark contrast fixes are DSA-81.
