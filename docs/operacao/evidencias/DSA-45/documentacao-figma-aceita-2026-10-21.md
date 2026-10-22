```json
{
  "task": "DSA-45",
  "gate": "figma-docs-accepted",
  "date": "2026-10-21",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1365-118",
    "date": "2026-10-21",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-dropdown-menu board (1365:118), with its `Documentação` frame (2365:3685), was accepted as the API and behavior specification of the nph-dropdown-menu. Menu: COMPONENT nph-dropdown-menu (1365:63), boolean `cabeçalho`. Item: COMPONENT_SET nph-dropdown-menu / item (1365:57), variants `tipo` (default, destructive), `seleção` (nenhuma, única, múltipla), `tamanho` (padrão, compacto) and `state` (default, hover, foco, disabled, carregando). Parts: nph-dropdown-menu / rótulo de grupo (1365:58), nph-dropdown-menu / separador (1365:60) and nph-dropdown-menu / cabeçalho de perfil (2359:47364)."
  }
}
```

# DSA-45 — `figma-docs-accepted`

The documentation of the `nph-dropdown-menu` board (`1365:118`) was accepted in
Figma, in the file `DS-IA-NEPHOS 5.0`, with the Figma UX QA and the textual
audit approved. The component needed 4 tokens that were not on `v/5.0.0`; they
were taken to `v/5.0.0` with the same values as in Figma, together with this
task. Every other token it uses was already there.

There is no command output. The acceptance is a human observation, recorded with
the date, the authorship, the board URL and the component.

The rest of this file is the Figma documentation converted to text, so that
whoever codes does not need to open Figma. Figma property names stay as they are
in Figma (Portuguese); the code API is in English (P64).

## Purpose
Floating menu of secondary actions: it opens attached to a button and the person
chooses an action.

Selection: `nph-dropdown-menu` — the item is chosen by `tipo`, `seleção`,
`tamanho` and `state`. Item options: `ícone início`, `atalho`, `submenu`,
`contador`, `descrição`, `avatar`, `etiqueta` and `interruptor`. Menu option:
`cabeçalho`.

## Description
Use it to gather the secondary actions of a screen or of an item, such as
rename, duplicate or sign out, without taking fixed space. The list opens over
the content and closes when an action is chosen; the switch and the multiple
choice keep the menu open. It holds no form value and it is not the main
navigation of the screen.

## Anatomy
Shown with the `nph-dropdown-menu` with `cabeçalho` on.

| Part | Rule |
|---|---|
| 1. Menu | Panel in `color/popover`, border `border/width` in `color/dropdown-border`, radius `radius/container`, shadow `elevation/dropdown`, width `layout/input-width` and padding `space/inline-tight` around the items. It gathers the other parts. |
| 2. Profile header (optional) | Avatar, name and status at the top of the menu, only to inform; the `cabeçalho` property of the menu. `nph-avatar` size md (`avatar/size-md`); name in `text/body-md` and `color/popover-foreground`; status below it in `text/caption` and `color/muted-foreground`. Figma draws 8 px of padding on the four sides and 8 px between the avatar and the texts (the value of `space/inline`). When on, a separator comes below it. |
| 3. Group label | Small text in `text/label-sm` and `color/muted-foreground` that names a group of items. Padding `space/inline` on the sides and `space/inline-tight` on top and bottom. |
| 4. Item | One action: at the start, an icon or an avatar, with the multiple-choice box before them; the label, with an optional description below; at the end, shortcut, counter, tag, switch, submenu arrow or selection check. |
| 5. Separator | Line of the `nph-separator` between groups of items, with `space/inline-tight` above and below. |

Item in detail, by part:

| Item part | Rule |
|---|---|
| Row | Height 36 in `padrão`, 28 in `compacto`, 40 with `seleção=múltipla`. Padding and gap `space/inline`; in `compacto`, `space/inline-tight` on top and bottom. Radius `radius/inner`. No background at rest. |
| Start icon | `nph-icon` light at `icon/size-md`, in the color of the label. Swappable; on by default. |
| Multiple-choice box | `nph-checkbox`, before the icon or the avatar, only with `seleção=múltipla`. |
| Avatar | `nph-avatar` size sm (`avatar/size-sm`). |
| Label | `text/body-md` in `color/popover-foreground`, on one line, cut with an ellipsis. With `seleção=única`, `text/label-md` in `color/primary-hover`. Destructive: `color/destructive-on-surface`. |
| Description | `text/caption` in `color/muted-foreground`, below the label. |
| Shortcut | Plain text in `text/caption` and `color/muted-foreground` (destructive: `color/destructive-on-surface`). |
| Counter | Pill in `color/primary-hover`, radius `radius/full`, height `icon/size-md`, side padding `space/inline`; number in `text/label-sm` and `color/primary-foreground`. |
| Tag | `nph-badge` with one word, such as `Novo`, in a 20 px high slot so the row keeps its height. Type and emphasis belong to the `nph-badge`. |
| Switch | `nph-switch` without a label, in a 20 px high slot so the row keeps its height. Disabled when the item is disabled. |
| Submenu arrow | `nph-icon` `chevron-right` light at `icon/size-sm`. |
| Check | `nph-icon` `check` solid at `icon/size-sm`, only with `seleção=única`. |
| Spinner | `nph-spinner` sm (`icon/size-sm`), only in `state=carregando`. |

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | The item text passes AA (WCAG 1.4.3) on `color/popover` and on the hover `color/primary-surface`, in light and dark. The destructive item uses `color/destructive-on-surface`, which in dark is almost white: the icon of the action carries the meaning. The menu border, the separator and the focus halo are decorative; the item is read by its text. |
| Visible focus | Focus is read by the `color/primary` border of the item, with 5.37:1 in light and 4.59:1 in dark (WCAG 1.4.11). The halo around it is decorative. On hover, the `nph-checkbox` box and the `nph-switch` track take their own hover (unchecked: `color/input-hover`) to keep 3:1 on `color/primary-surface`. |
| Color is not the only signal | The destructive item is recognized by the icon of the action, such as the trash in Excluir or the arrow in Sair, and by the text. Single choice shows the check at the end; multiple choice shows the checked box. The tag carries text. The switch shows the knob position beyond the color. |
| Touch target | The whole row of the item is the target, above 24 by 24 (WCAG 2.5.8) in every size. Tag, switch and icons sit inside the row and do not change its height. |
| Accessible name | The name read comes from the item label. Support icons do not repeat the name and are not read. The profile header is informative text, with no action. |

Demonstrations in the frame, in light and dark: hover, where the box takes the
hover of the `nph-checkbox`; focus, carried by the `color/primary` border;
destructive, where the icon of the action carries the meaning.

## Properties, variants and states

| Figma property | Rule |
|---|---|
| `tipo` | `default` or `destructive`. Destructive is for the action that deletes or ends, such as Excluir or Sair. |
| `seleção` | `nenhuma`, `única` or `múltipla`. Single shows the check at the end and highlights text and icon in `color/primary-hover`. Multiple shows the `nph-checkbox` box at the start. |
| `tamanho` | `padrão` or `compacto`. Compact serves dense lists. |
| `state` | `default`, `hover`, `foco`, `disabled` and `carregando`. Hover uses `color/primary-surface` (destructive: `color/destructive-surface`), with the label color unchanged. Focus uses the `color/primary` border and the halo. Disabled uses `state/disabled-opacity` on the whole item. Loading shows the `nph-spinner`. |
| `rótulo` | Text of the action, short, starting with the verb or the name of the action. |
| Item options | `ícone início`, `atalho`, `submenu`, `contador`, `descrição` and `avatar` turn on and off. The start icon is swappable; shortcut, counter and description have their own editable text (`texto do atalho`, `número`, `texto da descrição`). Shortcut is plain text in `text/caption`; submenu is the arrow at the end. |
| `etiqueta` | On or off. Uses the `nph-badge` with one word, such as Novo; type and emphasis belong to the `nph-badge`. It sits at the end of the item. |
| `interruptor` | On or off. Uses the `nph-switch` without a label, at the end of the item. On item hover, the switch takes the hover of the `nph-switch`. |
| `cabeçalho` (menu) | On or off on the menu. Shows the profile header and a separator below it. Name and status are text of the part. |
| What is not a property | Menu border: `color/dropdown-border`, an exception only for the dropdown. Menu width: `layout/input-width`. The button that opens the menu is an `nph-button` outside the component. Opening, closing and keyboard belong to code. |

Defaults of the item: `tipo=default`, `seleção=nenhuma`, `tamanho=padrão`,
`state=default`, `ícone início` on, every other option off. Default of the menu:
`cabeçalho` off.

Focus in detail: two layers around the item, outside its box. Focus border:
`border/width` in `color/primary`, radius `focus/border-radius-inner`. Halo:
`focus/ring-width` in `focus/halo`, radius `focus/radius-inner-with-border`.

Demonstrations in the frame, in light and dark: `tipo=destructive`,
`seleção=única`, `seleção=múltipla`, `tamanho=compacto`, `etiqueta` and
`interruptor`.

## Usage
The component has no code yet; the attributes come with the spec. The frame
shows only the tag, `<nph-dropdown-menu></nph-dropdown-menu>`, and the import,
`import 'nephos/nph-dropdown-menu';`.

## Relations and context
- The menu opens from an `nph-button`, which stays outside the component and
  controls the opening.
- The item is an inner part of the menu: it comes with the group label, the
  separator and, when needed, the profile header. It is not used outside the
  menu.
- In multiple choice, the box is the `nph-checkbox`; the item sets its state
  and, on hover, the box takes the hover of the `nph-checkbox`. The `nph-switch`
  track follows the same rule.
- Tag is the `nph-badge`, avatar is the `nph-avatar` and separator is the
  `nph-separator`: the color of each comes from the piece itself.
- The menu padding around the items is `space/inline-tight`; the item uses
  `space/inline` inside, and in compact it uses `space/inline-tight` on top and
  bottom.

Demonstration in the frame, in light and dark: the menu opening from an
`nph-button`, outside the component.

## When to use
- For secondary actions of a screen or of an item, such as rename, duplicate,
  move or sign out.
- Single choice when only one option holds at a time, such as the view mode;
  multiple when several hold together, such as filters.
- Tag to flag something new or a plan; switch to turn something on or off
  without closing the menu; profile header in the account menu.
- Compact for a long, dense list; `padrão` in the other cases.

Demonstrations in the frame, in light and dark: single choice, multiple choice,
tag, switch and compact.

## Required examples
Each in light and dark mode:

| Example | What it shows |
|---|---|
| Account menu, with the profile header | `cabeçalho` on, groups and the destructive Sair. |
| Single choice with counter | The check at the end and the counter. |
| Tag, switch and destructive | `etiqueta`, `interruptor` and a destructive item. |

## Do
- Use the destructive item only for the action that deletes or ends, because
  the icon and the text signal the risk.
- Group similar items with a group label and separate the groups with a
  separator, because the list becomes easy to scan.
- Write the label short, starting with the verb or the name of the action,
  because the person decides by the text.
- Use the tag with one word, such as Novo, because long text squeezes the label.
- Use the profile header in the account menu, because it shows whose menu it is
  and it is not an action.

Demonstrations in the frame, in light and dark: group label and separator
organizing the list; destructive only to delete or end; tag with one word.

## Do not
- Do not use the switch in an action that navigates or closes the menu; use the
  common item, because the switch only changes a state.
- Do not put a long sentence in the tag; use one word, or the item description,
  because the tag does not wrap and squeezes the label.
- Do not use destructive on a common action; use the `default` type, because the
  risk warning loses its meaning.

Each line has a wrong-use demonstration in the frame, in light and dark.

## Icons
The account menu uses `right-from-bracket` for Sair (sign out). This icon is new
in the Figma `nph-icon` catalog, in light and solid, and it is **not** yet in
code. Add it to `src/components/nph-icon/nph-icon.icons.ts` in the same pattern
as `right-to-bracket`: `faRightFromBracket` from
`@fortawesome/pro-light-svg-icons` and from `@fortawesome/pro-solid-svg-icons`,
the name in the list of names and `glyph(light, solid)` in the map, plus the
demo list and the action icon list of `design.md`, in alphabetical order. The
error demonstration Renomear uses `pen-to-square`, already in code.

## Tokens taken with this task
Read variable by variable in Figma on 2026-10-21 and on `v/5.0.0` with the same
values:

| Token | Light | Dark |
|---|---|---|
| `color/dropdown-border` | `color/border` | `color/border` |
| `focus/border-radius-inner` | `core/radius/off-scale/5` (5) | same |
| `focus/radius-inner-with-border` | `core/radius/off-scale/9` (9) | same |
| `dropdown/item-hover-icon-foreground` | `color/primary` | `color/primary` |

The primitive `core/radius/off-scale/9` is new as well.

The hover rule changed with this task: the hover of the `nph-dropdown-menu`
item is `color/primary-surface`, no longer `color/accent`; `design.md` says so
in `color/primary-surface` and `color/accent-subtle`.

## Solid icon in hover
Decided by Indiane on 2026-10-21. In Figma, the icons of the item set `1365:57`,
`state` hover, use the token; token read on 2026-10-21 (`VariableID:2515:3974`,
semantic collection, alias of `color/primary` in light and dark). The token
follows the chain component → semantic → core. Known Figma limit: the icon
swap property applies to the whole set, so the Figma component keeps the light
icon in every state; the solid icon in hover is a rule for code and spec.

| Part | Rest | Hover, `tipo` default | Hover, `tipo` destructive |
|---|---|---|---|
| Start icon | light, color of the label | **solid**, `dropdown/item-hover-icon-foreground` | `color/destructive-on-surface` |
| Submenu arrow | light | **solid**, `dropdown/item-hover-icon-foreground` | `color/destructive-on-surface` |
| Label | `color/popover-foreground` | unchanged | `color/destructive-on-surface` |

Contrast of `color/primary` on `color/primary-surface`: 4.78:1 in light and
6.26:1 in dark, above the 3:1 of WCAG 1.4.11 for icons. Light and solid are the
`variant` property of `nph-icon`; there is no token for the icon style.

WORK BRAIN — `03 MEMÓRIA/diario/2026/2026-10-21.md`: visual acceptance, Figma UX
QA approved, documentation accepted and textual audit approved.
