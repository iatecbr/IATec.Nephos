```json
{
  "task": "DSA-91",
  "gate": "figma-docs-accepted",
  "date": "2026-11-18",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=6935-11785",
    "date": "2026-11-18",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The design owner gave the visual acceptance of the nph-rich-option (green page 4128:26259, root 6910:6824), and its documentation frame (6935:11785) was accepted, with COMPONENT_SET nph-rich-option (6910:6828, the card) and the COMPONENT_SET of the rich option (6910:7093). On the approval page of 2026-11-18, the design owner answered in three rounds the 17 items, all as recommended: (1) documentation 6935:11785 accepted; (2) new primitive core/opacity/50 for the hover layer opacity of the card and of the rich option; (3) rich-option/border on color/border-subtle and its description cites the card; (4) the description of color/primary-border drops the option card and gains a DO NOT USE for the checked card; (5) select/option-padding straight to core/space/200 by decision; (6) descriptions of layout/rich-option-width and layout/input-width; (7) the rich option is an extension of the nph-select option, tokens select/option-*, and the card stays its own component; (8) the rich option description in text/caption (12 Regular) and color/muted-foreground; (9) a 2 px ring inside the option active by the keyboard, in focus/border; (10) the plain nph-select option gets the selected look with no background and the ring in a task of its own; (11) the option radius stays 4, as the nph-select option; (12) the list skips the disabled option, as DSA-29; (13) focus/halo-error stays now and a foundation task gives it a dark value; (14) the old set 5982:11688 leaves in the Figma cleanup; (15) the control inside the card takes its hover in Figma, and in code the known limit of DSA-45 D-3; (16) the old grid and text 4974:19709 and 4974:19707 stay; (17) the old set 774:154 stays."
  }
}
```

# DSA-91 — `figma-docs-accepted`

The documentation of the nph-rich-option (frame `6935:11785`, page `4128:26259`) was accepted in Figma in the file `DS-IA-NEPHOS 5.0`, with the visual acceptance of the root `6910:6824`. The nph-rich-option is a choice with a title and a description. It has two pieces:

- **The card** (`nph-rich-option`): a form choice where the whole card checks the option. A checkbox, radio or switch sits at its start, then an optional icon, a title, an optional second line and an optional shortcut.
- **The rich option**: the option of the `nph-select` and `nph-combobox` list with a description below the label. It has no tag of its own: it is the existing `nph-option` with a description (item 7).

Its tokens came with this task and are on `v/5.0.0`.

What changed in the tokens with this task:

- New primitive `core/opacity/50` (0.5), a new value first in the core (rule 4 of T9, item 2). No semantic has the function: `state/disabled-opacity` (0.5) is the disabled control, and `state/hover-opacity` (0.95) was the old solid button hover. The same path as `notification/close-background-hover-opacity` → `core/opacity/16`.
- New group `rich-option/*`, 19 tokens of the card. 18 alias semantics (rule 2 of T9); `rich-option/background-hover-opacity` points to `core/opacity/50`.
- New group `select/option-*`, 19 tokens of the rich option (item 7). 15 alias semantics; `select/option-background-hover-opacity` points to `core/opacity/50`; three point straight to the core by decision (rule 3 of T9), each with the semantics of the same value that do not serve:
  - `select/option-padding` → `core/space/200` (8), item 5: no semantic of 8 has the function of inner padding; `space/inline` and `space/stack-snug` are gaps; `radius/container`, `radius/inset` and `focus/radius-inner` are radii.
  - `select/option-dot-size` → `core/space/200` (8): the same semantics of 8 are gaps or radii, none is a dot size. The same primitive as `timeline/dot-size` and `carousel/indicator-size`.
  - `select/option-focus-border-width` → `core/focus-width/sm` (2): `focus/ring-width` (4) is the thickness of the halo, and `radius/subtle` (2) is a radius. The same primitive as `tree/focus-border-width`.
- No semantic changed value. Four semantics gained a new description, mirrored in the `use` of `design.md`: `color/border-subtle` (item 3: it now cites the outline of the card), `color/primary-border` (item 4: "option card" left; it cites the outline of the nph-switch when on and says DO NOT USE on the outline of the checked option card), `layout/rich-option-width` and `layout/input-width` (item 6).
- `design.md`: the `use` of every semantic these tokens alias now names the card or the rich option; `color/primary-surface` says the rich option does not take the selected background; new `tokens_core_opacidade` block and `core/focus-width/sm` line.

## Purpose

Choice with a title and a description. In a form, it is the card where the whole area checks the option. In the list of the `nph-select` and the `nph-combobox`, it is the rich option, with the description below the label.

Use the card when each choice of a form needs a sentence that explains the consequence, and the whole card serves as the click area. Use the rich option when an option of the `nph-select` or `nph-combobox` needs a description to be chosen. The card does not replace the `nph-radio` or the `nph-checkbox` in a simple list. The rich option does not replace the plain option of the list when the label is enough.

## Component sets

| Set | Figma id | What it is |
|---|---|---|
| `nph-rich-option` | `6910:6828` | The card, 36 variants: control (checkbox, radio, switch) × checked (false, true) × state (default, hover, focus, error, error-focus, disabled) |
| `nph-select / opção rica` (rich option set) | `6910:7093` | The rich option, 40 variants: state (default, hover, active, selected, disabled) × start (none, icon, avatar, dot) × marker (check, checkbox). `state=ativa` (active) is new (item 9) |

Root `6910:6824`, documentation `6935:11785`, appendix `6935:12295`.

## Tokens

Light and dark values are read in the `Sistemas` brand. `color/primary`, `focus/border` and `focus/halo` follow the active brand. One existing difference, outside this task: in the code `focus/border` light is `theme/brand-focus`, tone 500 in `Sistemas` (`#3B82F6`, as `design.md` records); Figma resolves the same token to tone 600 (`#2F68C5`). The tables give the code value; the contrasts below give both.

### Card: `rich-option/*`

| Token | Points to | Light | Dark | Where |
|---|---|---|---|---|
| `rich-option/background` | `color/card` | `#FFFFFF` | `#1E2228` | Card background |
| `rich-option/background-hover` | `color/accent-subtle` | `#F1F1F1` | `#2D333B` | Hover layer color, over the background |
| `rich-option/background-hover-opacity` | `core/opacity/50` | 0.5 | 0.5 | Opacity of the hover layer only, never of the whole card. On screen: `#F8F8F8` light and `#262B32` dark |
| `rich-option/border` | `color/border-subtle` | `#F1F1F1` | white 10% | Outline at rest, checked and in hover; decorative |
| `rich-option/border-error` | `status/error` | `#B01E1E` | `#EA7D7D` | Outline in error and in error with focus |
| `rich-option/border-width` | `border/width` | 1 | 1 | Outline thickness, every state |
| `rich-option/padding` | `space/container-padding` | 16 | 16 | Inner padding |
| `rich-option/gap` | `space/inline` | 8 | 8 | Gap between control, icon, texts and shortcut |
| `rich-option/text-gap` | `space/stack-tight` | 4 | 4 | Gap between title and second line |
| `rich-option/radius` | `radius/surface` | 14 | 14 | Corner of the card and of the hover layer |
| `rich-option/foreground` | `color/card-foreground` | `#0C0C0C` | `#E3E3E3` | Title and icon |
| `rich-option/description-foreground` | `color/muted-foreground` | `#5C5C5C` | `#B7BBC1` | Second line |
| `rich-option/icon-size` | `icon/size-md` | 20 | 20 | Box of the optional icon |
| `rich-option/disabled-opacity` | `state/disabled-opacity` | 0.5 | 0.5 | The whole disabled card |
| `rich-option/focus-border` | `focus/border` | `#3B82F6` (Figma reads `#2F68C5`) | `#B1CDFB` | Outline with keyboard focus; it meets 3:1, except the known `Sistemas` light limit against the halo (see Accessibility) |
| `rich-option/focus-halo` | `focus/halo` | `#D8E6FD` | `#234E94` | Focus halo around the card; decorative |
| `rich-option/focus-halo-error` | `focus/halo-error` | `#F1A8A8` | `#F1A8A8` | Focus halo around the card in error; decorative |
| `rich-option/focus-radius` | `focus/radius-surface` | 18 | 18 | Corner of the focus halo |
| `rich-option/focus-ring-width` | `focus/ring-width` | 4 | 4 | Thickness of the focus halo |

Width: `layout/rich-option-width` (320), an existing token.

### Rich option: `select/option-*`

| Token | Points to | Light | Dark | Where |
|---|---|---|---|---|
| `select/option-padding` | `core/space/200` (by decision) | 8 | 8 | Inner padding |
| `select/option-gap` | `space/inline` | 8 | 8 | Gap between box, start, texts and check |
| `select/option-label-gap` | `space/inline-tight` | 4 | 4 | Gap between label and secondary text, on one line |
| `select/option-text-gap` | `space/stack-tight` | 4 | 4 | Gap between label and description |
| `select/option-radius` | `radius/inner` | 4 | 4 | Corner of the option and of the hover layer |
| `select/option-background-hover` | `color/accent` | `#EDEEEF` | `#3C444F` | Hover layer color, in hover and on the option active by the keyboard |
| `select/option-background-hover-opacity` | `core/opacity/50` | 0.5 | 0.5 | Opacity of the hover layer only. On screen: `#F6F7F7` light and `#353C45` dark |
| `select/option-disabled-opacity` | `state/disabled-opacity` | 0.5 | 0.5 | The whole disabled option |
| `select/option-foreground` | `color/popover-foreground` | `#0C0C0C` | `#E3E3E3` | Label, start icon and start dot; on the disabled option also secondary text and description |
| `select/option-foreground-hover` | `color/accent-foreground` | `#0C0C0C` | `#E3E3E3` | Label, start icon and start dot in hover and when active |
| `select/option-description-foreground` | `color/muted-foreground` | `#5C5C5C` | `#B7BBC1` | Description |
| `select/option-secondary-foreground` | `color/muted-foreground` | `#5C5C5C` | `#B7BBC1` | Secondary text on the label line |
| `select/option-marker` | `color/primary` | `#2F68C5` | `#629BF8` | Check of the selected option |
| `select/option-icon-size` | `icon/size-md` | 20 | 20 | Box of the start icon and of the start dot |
| `select/option-marker-size` | `icon/size-sm` | 16 | 16 | Box of the check |
| `select/option-dot-size` | `core/space/200` (by decision) | 8 | 8 | Side of the start dot |
| `select/option-focus-border` | `focus/border` | `#3B82F6` (Figma reads `#2F68C5`) | `#B1CDFB` | 2 px ring inside the option active by the keyboard; it meets 3:1 |
| `select/option-focus-border-width` | `core/focus-width/sm` (by decision) | 2 | 2 | Thickness of that ring |
| `select/option-focus-border-radius` | `radius/inner` | 4 | 4 | Corner of that ring, the same as the option |

Width: none of its own. In Figma the set is drawn at `layout/input-width` (280); in the list, the option takes the list width.

Tokens left out on purpose: `rich-option/border-checked` (the checked card keeps `rich-option/border`; the control shows the choice) and a selected background for the rich option (the selected rich option has no background).

### Used directly or by instance

The card and the rich option use these pieces by instance; their tokens stay with each piece:

- `nph-checkbox`, `nph-radio`, `nph-switch` (default size): the control of the card, with no label of its own; and the `nph-checkbox` box of the rich option with `marker=checkbox`.
- `nph-icon`: the optional card icon (`bell` in the example), the start icon of the rich option (`globe` in the example) and the check (`check`). All `light`.
- `nph-avatar` `sm` (`avatar/size-sm`, 24): the avatar start of the rich option.
- `nph-kbd`: the optional card shortcut.
- Text styles: `text/label-md` (14 Medium) on the card title, the option label and the secondary text; `text/caption` (12 Regular) on the card second line and the option description.

## Anatomy, read part by part in Figma

Read by script, variant by variant, with the token and the text style of each layer.

### Card (`6910:6828`)

Common to every state:

- **Root**: gap `rich-option/gap`, padding `rich-option/padding`, width `layout/rich-option-width`, corner `rich-option/radius`, outline thickness `rich-option/border-width`, background `rich-option/background`. Parts left to right, all aligned to the top, because the title may wrap (DSA-17 D5).
- **Control** (1st part): an `nph-checkbox`, `nph-radio` or `nph-switch` instance (default size), with no label; aligned to the first line of the title. In the hover variant the control takes its own `state=hover`; in the other states it stays at default, and the card draws the outline, the halo and the opacity.
- **Icon** (2nd part, optional, off by default with "show icon"): an `nph-icon` `bell` `light` in a `rich-option/icon-size` box, vector in `rich-option/foreground` (the color of the title).
- **Texts** (3rd part, takes the remaining space, aligned to the start), gap `rich-option/text-gap`:
  - **title**: `rich-option/foreground`, `text/label-md` (14 Medium); it wraps, no cut.
  - **second line** (optional, on by default with "show second line"): `rich-option/description-foreground`, `text/caption` (12 Regular).
- **Shortcut** (last part, optional, off by default with "show shortcut"): an `nph-kbd` instance. Never with the switch.

By state:

| State | Root outline (inside) | Extra layer | Root opacity |
|---|---|---|---|
| default | `rich-option/border` | — | — |
| hover | `rich-option/border` | "hover layer": absolute, 1st child, corner `rich-option/radius`, fill `rich-option/background-hover`, layer opacity `rich-option/background-hover-opacity` | — |
| focus | `rich-option/focus-border` | "focus halo": absolute, last child, outside the card, corner `rich-option/focus-radius`, stroke `rich-option/focus-ring-width` in `rich-option/focus-halo` | — |
| error | `rich-option/border-error` | — | — |
| error-focus | `rich-option/border-error` | "focus halo" as in focus, stroke in `rich-option/focus-halo-error` | — |
| disabled | `rich-option/border` | — | `rich-option/disabled-opacity` |

The outline does not change when checked: the choice reads by the control (items 3 and 4). The hover layer takes the opacity; the card background stays `rich-option/background`.

### Rich option (`6910:7093`)

Common to every state:

- **Root**: gap `select/option-gap`, padding `select/option-padding`, corner `select/option-radius`. In the list, the width of the list. Parts left to right, all centered on the vertical axis.
- **Box** (only with `marker=checkbox`, 1st part): an `nph-checkbox` instance, checked on the selected option, `state=hover` on hover and active, `state=default` on disabled (D-3: only the option opacity applies).
- **Start** (optional, after the box): `nph-icon` (`globe` in the example, `light`) in a `select/option-icon-size` box; or `nph-avatar` `sm` (photo); or a dot of `select/option-dot-size` centered in a `select/option-icon-size` box.
- **Texts** (take the remaining space, aligned to the start), gap `select/option-text-gap`:
  - **label line**, gap `select/option-label-gap`: the **label**, `text/label-md` (14 Medium), cut with an ellipsis (DSA-29 D3); the **secondary text** (optional, off by default), `text/label-md`, on the same line.
  - **description** (optional, on by default with "show description"): `text/caption` (12 Regular, item 8); it wraps.
- **Check** (last part, only with `marker=check`): an `nph-icon` `check` `light` in a `select/option-marker-size` box, visible only on the selected option.

Colors by state:

| State | Label, start icon, dot | Secondary text | Description | Check | Hover layer | Keyboard ring | Root opacity |
|---|---|---|---|---|---|---|---|
| default | `select/option-foreground` | `select/option-secondary-foreground` | `select/option-description-foreground` | hidden | — | — | — |
| hover | `select/option-foreground-hover` | `select/option-secondary-foreground` | `select/option-description-foreground` | hidden | visible | — | — |
| active (keyboard) | `select/option-foreground-hover` | `select/option-secondary-foreground` | `select/option-description-foreground` | hidden | visible | visible | — |
| selected | `select/option-foreground` | `select/option-secondary-foreground` | `select/option-description-foreground` | `select/option-marker` (with `marker=check`) | at opacity 0 | at opacity 0 | — |
| disabled | `select/option-foreground` | `select/option-foreground` | `select/option-foreground` | hidden | — | — | `select/option-disabled-opacity` |

Absolute layers:

- **Hover layer**: 1st child, corner `select/option-radius`, fill `select/option-background-hover`, layer opacity `select/option-background-hover-opacity`.
- **Keyboard ring** (the focus border layer in Figma): last child, no fill, stroke `select/option-focus-border` inside, thickness `select/option-focus-border-width` (2), corner `select/option-focus-border-radius` (4).

Notes:

- The selected option has no background of its own. In the composition the label of the selected option in hover or active stays `select/option-foreground`, the same value as `select/option-foreground-hover` in both themes. Selected with hover and selected with the keyboard have no variant: the selected variant carries the hover layer and the ring at opacity 0, and the composition raises the layer to 0.5 and the ring to 1 (Figma example "selected and active by the keyboard": instances `7265:7807` light and `7265:7827` dark). In code: the selected option in hover or active takes the same layer, and the ring when active by the keyboard, and keeps its check or checked box.
- On the disabled option the secondary text and the description take `select/option-foreground`, the label color, under the opacity of the whole option (T11, rule 1, approved drawing). With `marker=checkbox`, the box is the `nph-checkbox` at its default state, so only the opacity of the whole option applies, as on the disabled card (D-3, answered on 2026-11-18; Figma variants `6910:7210`, `6910:7272`, `6910:7281`, `6910:7356`).
- The start dot follows the label color. Its size goes straight to `core/space/200` by decision.
- With `marker=checkbox`, the choice is the checked box and no check shows.

### Example texts in Figma (translated in the prose)

Card: title `Título da opção` ("Option title"), second line `Explicação curta do que essa opção faz.` ("Short explanation of what this option does."). Rich option: label `Opção` ("Option"), secondary text `@usuario` ("@user", hidden by default), description `Explicação curta da opção.` ("Short explanation of the option.").

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | Card: title `rich-option/foreground` over `rich-option/background` measures 19.56:1 light and 12.45:1 dark; second line `rich-option/description-foreground` 6.69:1 and 8.28:1. Over the hover layer (`#F8F8F8` and `#262B32`) the title measures 18.42:1 and 11.10:1, and the second line 6.30:1 and 7.39:1. The resting outline `rich-option/border` is decorative (1.13:1 and 1.35:1): the boundary that meets 3:1 is the control inside the card, box and radio border and off switch track, all in `color/input`, 3.23:1 and 5.56:1. Checked, the control in `color/primary` shows the choice: 5.37:1 and 5.75:1 over `rich-option/background`. Rich option: label 19.56:1 light and 9.93:1 dark over `color/popover`; description (12 Regular) 6.69:1 and 6.61:1; over the hover layer (`#F6F7F7` and `#353C45`) label 18.17:1 and 8.75:1, description 6.21:1 and 5.82:1. The check measures 5.37:1 and 4.59:1 over `color/popover`, 4.99:1 and 4.04:1 over the hover layer. Origin: the card values are in the documentation and in the appendix notes (H, `6935:12627`); the rich option values that the documentation does not carry (label in dark, description, check) were measured in Figma by script and are in the appendix, table B (`6935:12409`). |
| Visible focus | Card: the outline turns `rich-option/focus-border` with the halo `rich-option/focus-halo` in `rich-option/focus-radius` around the whole card; the inner control takes no ring of its own. The border carries the contrast, measured against the halo, the neighbor outside the border (rule of `focus/border` in `design.md`): 2.92:1 light in `Sistemas` with the code value `#3B82F6`, the known limit of `focus/border` (4.26:1 with the `#2F68C5` that Figma reads), and 5.02:1 dark; against `rich-option/background` it measures 3.68:1 light and 9.88:1 dark. The halo is decoration. Rich option: it takes no focus. Focus stays on the field, and the active option (`aria-activedescendant`) takes the hover layer at 50% and the 2 px ring inside, `select/option-focus-border`. The layer alone stays below 3:1 (1.08:1 light, 1.13:1 dark); the ring meets it: over `color/popover` 3.68:1 light with the code value (5.37:1 with the value Figma reads) and 7.88:1 dark; over the hover layer under it, 3.43:1 light with the code value (5.01:1 with the value Figma reads) and 6.90:1 dark. The ring has no halo. |
| Color is not the only cue | Checked reads by the control (check, dot or knob position); the card outline does not change. In the list, the selected option shows the check or the checked box, with no background. Error: the outline turns `rich-option/border-error` and the control stays at default; the written sign is the message of the `nph-field` of the group. |
| Target size | The whole card is the click area. The whole option is the click area, with the list width. |
| Accessible name | Card: the title is the name of the control (`aria-labelledby`) and the second line is its description (`aria-describedby`). Rich option: role `option`, with the label as the name and the description in `aria-describedby`. Icon, avatar and dot are decorative (`aria-hidden`) when the label already says the same. |
| Disabled | Opacity `rich-option/disabled-opacity` on the card and `select/option-disabled-opacity` on the option, and `aria-disabled`. The disabled piece takes no click. In the list, the keyboard skips the disabled option, as in the `nph-select` (DSA-29, item 12). |
| Error border | Over `rich-option/background`, `rich-option/border-error` measures 6.88:1 light and 5.88:1 dark, as a border; the written error message belongs to the `nph-field`. |
| Error halo | `rich-option/focus-halo-error` is `#F1A8A8` in both themes: 1.93:1 over the card in light and 8.30:1 in dark, against 1.26:1 and 1.97:1 of `focus/halo`. It stays now; a foundation task gives it a dark value (item 13). |

## Properties, variants and states (as in Figma)

| Field | Rule |
|---|---|
| `controle` (control) | Card. `checkbox` for several choices, `radio` for one choice, `switch` to turn something on or off with immediate effect. |
| `marcado` (checked) | Card. `false` or `true`. Checked changes only the control; in every state the outline is the same as unchecked. |
| `state` (card) | `default`, `hover` (hover layer `rich-option/background-hover` at 50% over the background, control in hover and outline as at rest), `foco` (focus), `erro` (error), `erro-foco` (error-focus) and `disabled`. Checked + disabled and error + disabled follow T11 (see "Combined states"). |
| `título` (title) | Card. The choice in a few words; if long, it wraps. |
| `mostrar segunda linha` (show second line) | Card. On by default: a short sentence with the consequence of the choice. |
| `mostrar ícone` (show icon) | Card. Off by default. Turns on the `nph-icon` after the control. |
| `mostrar atalho` (show shortcut) | Card. Off by default. Turns on the `nph-kbd` at the end; never with the switch. |
| `início` (start) | Rich option. `nenhum` (none), `ícone` (icon), `avatar` or `ponto` (dot). |
| `marcador` (marker) | Rich option. `marca` (check) for a single choice; `checkbox` for a multiple choice. |
| `state` (rich option) | `default`, `hover` (hover layer `select/option-background-hover` at 50%), `ativa` (active: the same layer and the 2 px ring inside, `select/option-focus-border`: the option active by the keyboard), `selecionada` (selected: the check or the checked box, no background) and `disabled`. Selected + hover and selected + active: the selected variant carries the layer and the ring at opacity 0, and the composition shows them. |
| `rótulo`, `descrição` (label, description) | Rich option. Texts of the option. "Show description" turns on the line below. |
| `texto secundário` (secondary text) | Rich option. Off by default. Shows the secondary text on the label line, such as the @user. |
| `ícone` (icon) | Rich option. Swaps the start `nph-icon`, with `início=ícone`. |
| Not a property | Width: the card uses `layout/rich-option-width`; the option takes the list width. Height: follows the content. Error message and group label: `nph-field`. Stacking: `space/stack`. |

In code the rich option is the existing `nph-option`, which already has `secondary`, `start`, `icon`, `src`, `status` and `marker`; what is new is the description and the rich look (see the task).

## Usage (as in Figma)

- Code: `<nph-rich-option></nph-rich-option>`; import, as Figma writes it: `import 'nephos/nph-rich-option';`. The package path is `@iatec/nephos/nph-rich-option`, as `docs/consuming` and the README say.
- The rich option has no tag of its own: it is the option of the `nph-select` and `nph-combobox` list.

## Relations and context

- The control is an instance of `nph-checkbox`, `nph-radio` or `nph-switch`, with no label. The card passes its state to the control: hover on hover; in the other states the control stays at default, and the card draws the halo, the outline and the opacity.
- The icon is the `nph-icon`, the shortcut is the `nph-kbd`, and the avatar of the rich option is the `nph-avatar` in size `sm`.
- The cards of a group stack with `space/stack`. The group label, the help and the error message come from the `nph-field`.
- The rich option lives in the list of the `nph-select` and in the list of the `nph-combobox`. The list gives the `space/inline-tight` padding and the maximum height `layout/max-list-height`, and scrolls above it.
- The highlight of the option follows the list: focus stays on the field, and the active option gets the hover layer at 50% and the 2 px ring inside. The list skips the disabled option, as in the `nph-select` (DSA-29). In the combobox, the shortcut sits in the list footer, never in the option.

## When to use

- Card with a radio: one choice among a few options that need an explanation, such as a plan or a delivery method.
- Card with a checkbox: several independent choices, each with its explanation.
- Card with a switch: turning on or off a feature that takes effect at once, with no save button.
- Rich option in the `nph-select`: when the label alone is not enough to choose. In the `nph-combobox`: people, with an avatar and a support line, or items with a description.
- Options with no explanation: `nph-radio`, `nph-checkbox` or the plain option of the list. From 2 to 5 options, radio or card; from 6 to 15, `nph-select`; above 15, `nph-combobox` (T7).

## Required examples (in Figma, light and dark)

- Choosing the plan: radio, with the Annual Plan checked.
- Turning on notices: switch with no shortcut; the first one on, with an icon.
- Assigning people in the combobox: avatar and box; two selected, the last one with no description.

## Do

- Write the title as the choice and the second line as the consequence: the person decides without opening a help.
- Use one control type per group, stacked with `space/stack`: the group answers one question.
- Show the error message in the `nph-field` of the group: the card in error only marks the outline.
- In the list, use the description only when it changes the choice, in one short line: the list scrolls less.

## Do not

- Do not turn on the shortcut on the card with a switch: use the card with no shortcut; the switch already acts on click.
- Do not mix controls in the same group: use only radios, only boxes or only switches in the group.
- Do not write a long description on the rich option: use a short sentence; the detail stays outside the list.

## Default behavior (appendix, accepted with the documentation)

Base: the WAI-ARIA APG pattern of each piece. The card follows the control it holds; the rich option follows the listbox of the `nph-select` and of the `nph-combobox`. One deviation from the APG: the disabled option is skipped (item 12).

| Subject | Card (group of radios, boxes or switches) | Rich option (select and combobox list) |
|---|---|---|
| Tab and Shift+Tab | Radio: enters the group on the checked card (or the first, if none) and leaves the group. Box and switch: each card is one Tab stop. | The option takes no Tab. Focus stays on the field; the active option is pointed to by `aria-activedescendant`. With the list open, Tab picks the active option, closes the list and moves to the next field (choice-only select). |
| Arrows | Radio: up/left and down/right move the focus to the previous or next card and check it; at the ends they wrap. Box and switch: no effect. | Up and Down move the active option; Home and End go to the first and the last. The disabled option is skipped (item 12). |
| Space | Radio: checks the card with focus. Box: checks or unchecks. Switch: turns on or off. | Box (`marker=checkbox`): checks or unchecks the active option. With no box: follows the field of the select or the combobox. |
| Enter | Does not check the card (APG radio and checkbox); submits the form, if there is one. Switch: Enter is optional in the APG and stays with the code. | Picks the active option; with a single choice, the list closes. |
| Typing letters | No effect. | Select: goes to the option that starts with the letter. Combobox: filters the list. |
| Click or touch | The whole card checks or turns on, as the control itself. | The whole option picks. |
| Focus on open and close | Does not apply: the card opens nothing. | It belongs to the list: on open, the active option is the selected one (or the first); on close, focus stays on the field. |
| Esc | Does not apply. | It belongs to the list: closes without changing the choice; focus stays on the field. |
| Click outside | Does not apply. | It belongs to the list: closes. |
| Pointer and focus | The hover only paints (hover layer `rich-option/background-hover` at `rich-option/background-hover-opacity`); it does not move the focus. | The hover paints the option with the same layer as the active one (`select/option-background-hover` at `select/option-background-hover-opacity`), without moving the focus off the field (DSA-29 D5). The 2 px ring is only for the option active by the keyboard (item 9). |
| Window edge | Does not apply: the card stays in the page flow. | It belongs to the list: it flips or shrinks and scrolls (`layout/max-list-height`, DSA-29 D9). |
| Code | Event, aria, slot, property and console warning stay with the code owner, following the APG and the Custom Elements Manifest. | The same. |

Sources: https://www.w3.org/WAI/ARIA/apg/patterns/radio/ · https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/ · https://www.w3.org/WAI/ARIA/apg/patterns/switch/ · https://www.w3.org/WAI/ARIA/apg/patterns/listbox/ · https://www.w3.org/WAI/ARIA/apg/patterns/combobox/

## Combined states (T11)

- Rule 1, checked or selected + disabled: the piece keeps its chosen mark, under its disabled opacity. Card: resting outline `rich-option/border` and checked control, under `rich-option/disabled-opacity` (0.5). Option with `marker=check`: only the check, no background; option with `marker=checkbox`: the checked box, no background; both under `select/option-disabled-opacity` (0.5). The rich option does not follow DSA-29 D-3, which keeps the selected background; the plain option gets the same rule in a task of its own (item 10).
- Rule 2, error + disabled: disabled wins (DSA-18 D7). The error border goes away and the card looks like the disabled variant: resting outline `rich-option/border`, checked or not, under `rich-option/disabled-opacity`.
- The rules need no new token.

## Icon and image

| Piece | Size | Weight and color | When it changes |
|---|---|---|---|
| Card icon (`nph-icon`) | `rich-option/icon-size` (20) | `light`; `rich-option/foreground`, as the title | It does not change by state: `light` on every variant. On with "show icon" (off by default). |
| Start icon of the option (`nph-icon`) | `select/option-icon-size` (20) | `light`; the label color (`select/option-foreground`, in hover and active `select/option-foreground-hover`) | It does not change by state. The "icon" property swaps only the drawing (examples: `globe`, `bell`). |
| Check of the selected option (`nph-icon check`) | `select/option-marker-size` (16) | `light`; `select/option-marker` | Only on `state=selecionada` with `marker=check`. |
| Image: avatar start of the option | `nph-avatar` `sm` (`avatar/size-sm`, 24) | — | The component has no image of its own. The photo comes only through the `nph-avatar`; export size and crop follow the `nph-avatar` rule (DSA-24). |

## Limits (the "Limites" row of the Figma matrix)

| Case | Rule |
|---|---|
| Minimum | Card with only the title; option with only the label. The height follows the content. |
| Maximum | Card with icon, title, second line and shortcut; option with avatar, secondary text and description. |
| Long text | Card: title and second line wrap and the height grows, no cut. Option: the label is cut with an ellipsis on the line of the secondary text (DSA-29 D3); the description wraps. |
| Empty | Does not apply: the card always has a title and a control, and the option always has a label. A list with no option is a state of the select and the combobox (DSA-29, DSA-46), not of this piece. |
| Many items | A group of 2 to 5 cards, stacked with `space/stack` (T7); from 6 to 15 choices, use the select; above, the combobox. In the list, above `layout/max-list-height` (296) the list scrolls inside (DSA-29 D9). |
| Short window | Does not apply to the piece: the card has the width `layout/rich-option-width` (320) and, on a narrow screen, the group stacks in one column, in the `nph-field`. The height of the select and combobox list is limited by the window, not the option. |

## Inherited decisions

Family: select → dropdown menu → combobox → context menu (the rich option is an option of the select and of the combobox). Other family: the controls (checkbox, radio, switch) inside the card.

- Follows DSA-29 D3: label, value and secondary text of the option on one line, with an ellipsis.
- Follows DSA-29 D5, adapted by the deviation from D8: the option active by the keyboard has the hover look (hover layer, `select/option-background-hover` at 50%), plus the 2 px ring inside (item 9). D5 lets the selected background win over hover; with no selected background (D8 below), the selected option in hover or active takes the same layer and keeps its check or checked box.
- Does not follow DSA-29 D8 (declared deviation, requested by the design owner): the selected rich option has only the check (`select/option-marker`) or the checked box, with no selected background. The same rule goes to the plain option in a task of its own (item 10).
- Follows DSA-29 D9: `layout/max-list-height` (296) inside the list; above, it scrolls.
- Follows DSA-29 D1: the list opens `space/inline-tight` (4) below the trigger (the list, not the option).
- Follows DSA-29 D2: the list enters and leaves with `motion/enter-*` and `motion/exit-*`; with reduced motion, opacity only.
- Does not follow DSA-29 D-3 on the rich option (declared deviation): selected and disabled keeps only the check or the checked box, no background, under `select/option-disabled-opacity` (T11, rule 1; item 10).
- Follows DSA-46 D-1: the "create" row of the combobox is a plain option, not a rich option.
- Follows DSA-46 D-2: the shortcuts sit in the combobox list footer, as `nph-kbd`.
- Follows DSA-45 D-4: the small `nph-switch` belongs to the 20 px slot of the menu item. Inference, not a D-N: the card has no 20 px slot and uses the default switch.
- Follows DSA-45 D-3 (open, item 15): on card hover, Figma draws the control in hover; in code the box and the track do not take their own hover from outside, a known limit until those pieces get an API.
- Follows DSA-17 D2, D3, D5: box border `color/input`, `color/input-hover` in hover, `status/error` in error; box focus is `focus/border` + `focus/halo`, with an error `focus/halo-error`; with two lines, the box sits at the top, on the first line.
- Follows DSA-18 D1 to D4 and D7: radio border `color/input`, checked fill `color/primary`, hover `color/input-hover`; focus `focus/border` + `focus/halo`, `radius/full`; circle `icon/size-sm` (16), target 24 × 24; with two lines, the circle at the top; error and disabled, disabled wins.
- Follows DSA-27 D1 and D4: with two lines, the track at the top; outline `color/primary-border` when on, none when off, `status/error` in error, `focus/border` in focus. It belongs to the control, not to the card.
- Reference, not a D-N: DSA-69 (lot of 06-11), menu item with radius 8 (`dropdown/item-radius`), used in item 11.
- Register: T6 (list padding 4, inner radius 4), T7 (2 to 5 radio or card, 6 to 15 select, above combobox), T8 (`color/accent` in dark), T11 (combined states).

## Decisions answered (approval page of 2026-11-18, all as recommended)

| Item | Decision |
|---|---|
| 1 | Documentation `6935:11785` accepted. |
| 2 | New primitive `core/opacity/50`; `rich-option/background-hover-opacity` and `select/option-background-hover-opacity` point to it. |
| 3 | `rich-option/border` → `color/border-subtle`; the description of `color/border-subtle` gains the card outline, removing nothing. |
| 4 | The description of `color/primary-border` drops "option card", cites the outline of the `nph-switch` when on and gains "DO NOT USE on the outline of the checked option card". |
| 5 | `select/option-padding` → `core/space/200`, by decision. |
| 6 | Descriptions of `layout/rich-option-width` ("Width of the nph-rich-option card (320). USE only on the card; the rich option takes the list width.") and `layout/input-width` ("Width of a form field (280)."). |
| 7 | The rich option is an extension of the `nph-select` option (tokens `select/option-*`); the card stays its own component. |
| 8 | The rich option description in `text/caption` (12 Regular), `color/muted-foreground`. |
| 9 | A 2 px ring inside, in `focus/border`, only on the option active by the keyboard; thickness `core/focus-width/sm`, as `tree/focus-border-width`. It goes to the select task too, for the whole list. |
| 10 | The plain `nph-select` option (`1357:136`) gets the selected look with no background (and the ring of item 9) in a task of its own. It changes DSA-29 D8 and D-3. |
| 11 | The option radius stays 4 now, as the `nph-select` option; a bigger radius goes to the select task. |
| 12 | The list skips the disabled option, as the `nph-select` (DSA-29); a deviation from the APG. |
| 13 | `focus/halo-error` stays now; a foundation task gives it a dark value, in every field at once. |
| 14 | The old set `5982:11688` (0 instances) leaves in the Figma cleanup. |
| 15 | The control inside the card takes its hover in Figma; in code, the known limit of DSA-45 D-3. |
| 16 | The old grid `4974:19709` and text `4974:19707` stay in Figma. |
| 17 | The old set `774:154` (55 instances outside the section) stays in Figma. |

Points of the appendix that were not approval items follow the recommendation, approved with the approval page of 2026-11-18: list height with the rich option (DSA-29 D9, `layout/max-list-height`, the list scrolls), shortcut per option out of the list (DSA-46 D-2, in the combobox footer), the reference kit read from the decision map. The default behavior, the combined states, the icon and image rules and the inherited decisions above were accepted with the documentation (item 1).

## Hidden on purpose in Figma

- The card icon (`bell`) and the shortcut (`nph-kbd`): hidden by default ("show icon" and "show shortcut" off) on the 36 card variants.
- The secondary text of the rich option (`@usuario`): hidden by default ("secondary text" off) on the 40 option variants.
- The check: hidden except on the selected option with `marker=check` (8 variants).
- On the 8 selected variants, the hover layer and the keyboard ring are at opacity 0, on purpose, so a composition can raise them.
