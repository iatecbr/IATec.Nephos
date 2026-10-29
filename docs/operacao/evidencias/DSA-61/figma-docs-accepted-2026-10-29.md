```json
{
  "task": "DSA-61",
  "gate": "figma-docs-accepted",
  "date": "2026-10-29",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1512-27498",
    "date": "2026-10-29",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "Indiane accepted the nph-togglebutton board frame (1512:27498, page 1503:2) and the nph-toggle-group board frame (1580:61, page 1580:4), with the Figma UX QA and the textual audit approved. COMPONENT_SET nph-togglebutton (1512:719), 108 variants; nph-toggle-group (1580:60), 6 variants."
  }
}
```

# DSA-61 — `figma-docs-accepted`

The documentation of `nph-togglebutton` (board `1512:27498`) and of `nph-toggle-group` (board `1580:61`) was accepted in Figma on 2026-10-29, in the file `DS-IA-NEPHOS 5.0`, with the Figma UX QA and the textual audit approved. The new states needed 3 `togglebutton/*` tokens, put on `v/5.0.0` together with this task:

- `togglebutton/background-hover` → `{color.accent}`.
- `togglebutton/background-checked` → `{color.primary-surface-hover}`.
- `togglebutton/background-checked-hover` → `{theme.brand-200}` in light and `{theme.brand-700}` in dark.

Every other token both pieces use was already there. No core primitive was added.

There is no command output. The acceptance is a human observation, recorded in the json block above with the board URL and the component sets.

The rest of this file is the contract converted to text, so that whoever codes does not need to open Figma. Figma property names stay as they are in Figma; the code API is in English (`pressed`, `invalid`, `disabled`, `text`, `label`, `icon-start`, `icon-end`, `value`, `selection`).

## nph-togglebutton

### Purpose

A button that keeps a boolean value: checked or unchecked. It keeps a state; nph-button fires an action. In a toolbar, with an immediate effect and among other buttons, use nph-togglebutton. Outside a toolbar, for a setting that turns on or off with an immediate effect, use nph-switch. In a form, when the choice goes with the submit, use nph-checkbox.

### Properties

| Figma property | Rule |
|---|---|
| `marcado` | `não` / `sim`. Code: `pressed`. |
| `state` | `default`, `hover`, `foco`, `hover-foco`. Focus is keyboard only. |
| `desabilitado` | `não` / `sim`. Only in `state=default` and without invalid. |
| `texto` | `não` / `sim`. Without text, the piece shows one icon only and needs an accessible name. |
| `invalido` | `não` / `sim`. |
| `tamanho` | `compacto`, `padrão`, `grande`. Code: `compact`, `default`, `large`. New. |
| `ícone início`, `ícone fim` | Turn each icon of the piece with text on or off. Only one is on; `ícone início` is the default. |
| Not a property | The label text and the icon change on the instance. |

### Measures

| Part | Rule |
|---|---|
| Height | `control/height-compact` (28 px), `control/height-default` (36 px), `control/height-large` (44 px), with or without text. |
| Box padding | `space/inline-tight` (4 px) on the four sides. |
| Box radius | `radius/control`. |
| Inner area | Padding `space/control-padding` (12 px) at start and end, radius `radius/inner`, gap `space/inline-tight` (4 px) between icon and label. No background of its own. |
| Label | Text role `text/label-md`, on one line. |
| Icon with text | nph-icon at `icon/size-sm` (16 px) in the three sizes. |
| Icon only | nph-icon at `icon/size-sm` (16 px) in compact, `icon/size-md` (20 px) in default, `icon/size-lg` (24 px) in large. |
| Width | The piece hugs its content; there is no width token. |

### States

| State | Box | Label and icon |
|---|---|---|
| Unchecked, rest (`default`, `foco`) | No background, no border. | `color/muted-foreground`; icon `light`. |
| Unchecked, hover (`hover`, `hover-foco`) | Background `togglebutton/background-hover`. | `color/foreground`; icon `solid`. |
| Checked, rest (`default`, `foco`) | Background `togglebutton/background-checked`. | `color/foreground`; icon `solid`. |
| Checked, hover (`hover`, `hover-foco`) | Background `togglebutton/background-checked-hover`. | `color/foreground`; icon `solid`. |
| Invalid | Border `border/width` in `status/error`, over the background of the state. | As the state. |
| Disabled | The whole piece takes `state/disabled-opacity`, in the rest colors of its checked value; a checked disabled piece keeps `togglebutton/background-checked`. No hover, no focus. | Icon `light`. |

The checked state shows in the background and in the label color, and the icon swaps. It stays as drawn: no semibold label and no stroke (decision of Indiane on 2026-10-29, option A of the preview).

### Icons

- With `icon-start` or `icon-end` on, the unchecked piece shows `xmark` and the checked piece shows `check`.
- The icon is `solid` when checked and on hover; `light` when unchecked without hover (`default` and `foco`) and when disabled.
- The icon has the color of the label.
- Never `icon-start` and `icon-end` together. Start is the default: the icon shows the state. End only when the icon tells what comes next, such as opening options. Pieces side by side use the icon on the same side.

### Focus

Border `color/primary` (`border/width`, radius `focus/border-radius-control`) and halo `focus/halo` (`focus/ring-width`, radius `focus/radius-control-with-border`) outside the piece, without changing its size. Invalid: border `status/error` and halo `focus/halo-error`. Unchanged from today.

### Accessibility

| Criterion | Rule |
|---|---|
| Contrast | Label and icon pass 6:1 over the background of each state, in both modes, except disabled, which is outside the contrast rule. The focus border in `color/primary` passes 5:1 over the page. |
| Visible focus | In `foco` and `hover-foco`, the focus border and halo above. |
| Color is not the only signal | Checked changes the background, the label color and the icon, and exposes `aria-pressed`. Invalid changes the border; the error message is outside the piece. |
| Target | The whole piece is the target: 28, 36 or 44 px high, by size, with or without text. On touch screens, use large. |
| Accessible name | With text, the name comes from the label. Icon only, the name goes in the `label` attribute, which becomes the `aria-label` of the button, and the icon gets `aria-hidden`. |

Known limit, accepted by Indiane on 2026-10-29: the checked background has 1.26:1 (light) and 1.54:1 (dark) over the page, and in dark without an icon the label barely changes. The checked state is still exposed by `aria-pressed`.

### Usage

```html
<nph-togglebutton text="Mostrar grade"></nph-togglebutton>
```

The label goes in `text`; the checked state in `pressed`.

## nph-toggle-group

### Purpose

A group of nph-togglebutton of the same subject, side by side and separated by space, in the toolbar, such as alignment or formatting. The group gathers, spaces and controls which buttons are checked, through its `value`. Selection can be single (checking one unchecks the other) or multiple; that is behavior, not look.

### Properties

| Figma property | Rule |
|---|---|
| `texto` | `sim`: buttons with label. `não`: icon only. Every button of the group follows the same value. |
| `tamanho` | `compacto`, `padrão`, `grande`. Every button of the group follows the same size: 28, 36 and 44 px. New. |
| `mostrar 3º` | Turns the last button on or off: the group shows two or three buttons. |
| Not properties | `marcado`, `state`, `desabilitado`, `invalido` stay on each nph-togglebutton. Single or multiple selection is behavior, resolved in code. There is no position: the buttons are separated, never joined. |

### Anatomy and measures

| Part | Rule |
|---|---|
| Container | Buttons in a row, `space/inline` (8 px) between them. No background, border or focus of its own. |
| Button | An nph-togglebutton instance. The group controls only the checked state; focus, disabled and invalid stay on each button. |

### Accessibility

| Criterion | Rule |
|---|---|
| Contrast, focus, color | Come from nph-togglebutton. The group adds no color and takes no focus. |
| Target | Each button has the height of the group size: `control/height-compact`, `control/height-default` or `control/height-large`. Neighbors are `space/inline` apart. On touch screens, use large. |
| Accessible name | The group takes a name that says the subject, in the `label` attribute (like "Alignment"). Each icon-only button takes its own `label`, which becomes the `aria-label` of the button. |

### Usage

```html
<nph-toggle-group label="Alinhamento" selection="single">
  <nph-togglebutton value="left" label="Alinhar à esquerda" icon-start="align-left"></nph-togglebutton>
  <nph-togglebutton value="center" label="Centralizar" icon-start="align-center"></nph-togglebutton>
</nph-toggle-group>
```

### When to use

- Two or more options of the same subject together in the toolbar.
- `texto=sim` when the icon alone does not name the option; `texto=não` when the icon is known and each button has a label.
- Single selection when the options exclude each other, like alignment; multiple when they add up, like bold and italic.
- For a single option, use nph-togglebutton without a group.
- Do not mix text and icon-only buttons in the same group. Do not join buttons without space.
