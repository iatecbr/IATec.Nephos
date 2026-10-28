```json
{
  "task": "DSA-57",
  "gate": "figma-docs-accepted",
  "date": "2026-10-28",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=3077-2240",
    "date": "2026-10-28",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-chip board (3077:807), with its Documentação frame (3077:2240), was accepted as the API and behavior specification of nph-chip. COMPONENT_SET: nph-chip (3076:1439), 152 variants (tipo × cor × conteúdo × tamanho × estado). The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  }
}
```

# DSA-57 — `figma-docs-accepted`

The documentation of the `nph-chip` (frame `3077:2240`) was accepted in Figma, in the file `DS-IA-NEPHOS 5.0`, with the Figma UX QA and the textual audit approved. The component needed 62 `chip/*` tokens, all put on `v/5.0.0` together with this task. Each one is an alias: of a semantic token, of a `theme/*` token or, when no semantic token has the same function, of a core primitive. Four core primitives were added for them: `core/size/600` (24 px), `core/layout-width/chip` (224 px), `core/space/50` (2 px) and `core/space/off-scale/6` (6 px). Every other token it uses was already there.

There is no command output. The acceptance is a human observation, recorded in the json block above with the frame URL and the component set.

The rest of this file is the Figma documentation converted to text, so that whoever codes does not need to open Figma. Figma property names stay as they are in Figma (Portuguese); the code API is in English.

## Purpose

A small rounded piece that shows an applied filter, a value chosen in a field, or a quick filter that the person checks and unchecks.

Selection: choose the type by the action. Removível when the X takes the value away; seleção when it is a quick filter that the person checks and unchecks with one click. Then choose the color, the content, the size and the state.

## Description

Use it for applied filters in nph-toolbar, for the values chosen inside a field and for quick filters that the person checks and unchecks. The chip does not replace nph-badge, which shows a system status with no action, nor nph-button, which runs an action.

## Anatomy

Examples in the frame: removível with an icon ("Período: Outubro"), removível with an avatar ("Ana Souza") and seleção selected with a counter ("Pendentes", 12).

| Part | Rule |
|---|---|
| 1. Container | Background chip/background, radius chip/radius, height chip/height-compact or chip/height-default and maximum width chip/max-width. A 1 px border on the inside, in the width chip/border-width: chip/border in the cor padrão and chip/success-border, chip/warning-border, chip/error-border, chip/info-border and chip/help-border in the status colors. No border on the selected and the disabled chip; the invalid chip uses chip/invalid-border. The inner space changes with the content: chip/padding-x, chip/padding-start-icon, chip/padding-start-avatar and chip/padding-end-remove. |
| 2. Icon or avatar | Optional, before the text: nph-icon or nph-avatar. It is decorative; the click belongs to the chip. |
| 3. Label | Text in text/label-md, color chip/foreground. Cut with an ellipsis at the maximum width. |
| 4. Counter | Optional, seleção only: nph-badge with chip/counter-background and chip/counter-foreground; on hover and active of the chip, background chip/counter-background-hover, so the pill does not disappear. Inner space chip/counter-padding-y at top and bottom and chip/counter-padding-x at the sides. |
| 5. Remove | X button with target chip/remove-size and radius chip/remove-radius. Background chip/remove-background-hover on hover, focus and active of the X. |

Measures read from the component set, part by part:

- Space between parts: chip/gap.
- Start padding: chip/padding-x with text or counter; chip/padding-start-icon with an icon; chip/padding-start-avatar with an avatar.
- End padding: chip/padding-end-remove (compacto) or chip/padding-end-remove-default (padrão) when the X shows; chip/padding-end-counter after the counter; chip/padding-x with text only.
- Icon and X icon: nph-icon at icon/size-sm, style light. The X icon is `xmark`.
- Counter: nph-badge, tipo secondary, ênfase light, radius radius/full; 27 × 20 px with "12".
- Label: one line. Its maximum width is what is left of chip/max-width after the padding, the gaps and the neighbor parts.
- Focus ring: a border of border/width (1 px) and, outside it, a halo of focus/ring-width (4 px), both with radius chip/radius. Around the X, the ring is 26 px (border) and 34 px (halo); around the whole chip, it follows the chip size. These two sizes are derived from chip/remove-size and the focus widths; they are not tokens.
- Border: drawn inside the chip and not counted in its size, so it never makes the chip wider or taller.
- Invalid: border chip/invalid-border in chip/border-width.
- Disabled: opacity 0.5 on the whole chip, the value of state/disabled-opacity.

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | Text and X pass 4.5:1 over the chip background in every state, in light and dark. The border marks the edge of the chip against the page, where the background almost disappears, above all in dark. It does not need 3:1: the text already identifies the piece (WCAG 1.4.11). |
| Visible focus | Border focus/border with halo focus/halo around the chip, in seleção, or around the X, in removível (WCAG 2.4.7). In status chips, the X ring follows the status color: chip/success-focus-border and chip/success-focus-halo, and the same pair for warning, error, info and help. |
| Color | Color is never the only signal: the selected chip shows the X and the full background; the status is written in the label; the invalid chip has a red border and a message below the field (WCAG 1.4.1). |
| Touch target | The X has target chip/remove-size in both sizes (WCAG 2.5.8). |
| Accessible name | The X has an aria-label with the action and the label, such as "Remover filtro Situação: Aguardando". Icon and avatar carry aria-hidden. In seleção, the chip is a toggle button with aria-pressed. |
| Disabled | Disabled takes no focus and no click. Somente leitura shows the value without the X. Marcado is the last chip of the field, ready to leave: hover background and focus ring on the whole chip. |

Demonstrations in the frame, in light and dark: focus on the X of a removível chip; focus on a seleção chip; a selected chip with the X; an invalid chip.

## Properties, variants and states

| Field | Rule |
|---|---|
| tipo | removível: the X takes the value away and the body has no action. seleção: quick filter that the person checks and unchecks with one click; the selected chip shows the X. |
| cor | padrão, sucesso, aviso, erro, informação, ajuda. The status colors apply to removível with text. Each color has its own border, in the tone of the color itself. |
| conteúdo | texto, ícone, avatar (removível only), contador (seleção only). |
| tamanho | compacto (chip/height-compact) and padrão (chip/height-default). The X target is the same in both. |
| estado · removível | padrão, marcado, hover no X, foco no X, ativo no X, somente leitura, inválido, desabilitado. |
| estado · seleção | padrão, hover, foco, ativo, desabilitado, selecionado, selecionado + hover, selecionado + foco, selecionado + desabilitado. |
| rótulo | Text property. Short form, such as "Campo: valor". |
| ícone | Instance swap, only with nph-icon icons. |
| long text | Not a property: the label is cut with an ellipsis at the width chip/max-width and shows the whole text in a tooltip on hover and on focus. |

Figma component properties of the set `3076:1439`: text `rótulo` ("Rótulo"), instance swap `ícone`, and the variants `tipo` (removível, seleção), `cor` (padrão, sucesso, aviso, erro, informação, ajuda), `conteúdo` (texto, ícone, avatar, contador), `tamanho` (compacto, padrão) and `estado` (the 15 states above). The set's default variant is tipo=removível, cor=padrão, conteúdo=texto, tamanho=compacto, estado=padrão.

Tokens of each state, read from the variants:

| Type and state | Container | Label | Other parts |
|---|---|---|---|
| removível · padrão, somente leitura | chip/background, border chip/border | chip/foreground | somente leitura has no X |
| removível · marcado | chip/background-hover, border chip/border | chip/foreground | focus ring (focus/border, focus/halo) around the whole chip |
| removível · hover no X, ativo no X | chip/background, border chip/border | chip/foreground | X background chip/remove-background-hover |
| removível · foco no X | chip/background, border chip/border | chip/foreground | X background chip/remove-background-hover; ring focus/border and focus/halo around the X |
| removível · inválido | chip/invalid-background, border chip/invalid-border | chip/invalid-foreground | — |
| removível · desabilitado | chip/background-disabled, opacity 0.5 | chip/foreground | — |
| removível · status color (sucesso, aviso, erro, informação, ajuda) · padrão | chip/<status>-background, border chip/<status>-border | chip/<status>-foreground | <status> is success, warning, error, info or help |
| removível · status color · hover no X, ativo no X | chip/<status>-background, border chip/<status>-border | chip/<status>-foreground | X background chip/<status>-remove-background-hover |
| removível · status color · foco no X | chip/<status>-background, border chip/<status>-border | chip/<status>-foreground | X background chip/<status>-remove-background-hover; ring chip/<status>-focus-border and chip/<status>-focus-halo |
| removível · status color · desabilitado | chip/background-disabled, opacity 0.5 | chip/foreground | — |
| seleção · padrão | chip/background, border chip/border | chip/foreground | counter chip/counter-background |
| seleção · hover, ativo | chip/background-hover, border chip/border | chip/foreground | counter chip/counter-background-hover |
| seleção · foco | chip/background, border chip/border | chip/foreground | counter chip/counter-background; ring focus/border and focus/halo around the whole chip |
| seleção · desabilitado | chip/background-disabled, opacity 0.5 | chip/foreground | counter chip/counter-background-disabled |
| seleção · selecionado | chip/background-selected | chip/foreground-selected | counter chip/counter-background; X shown |
| seleção · selecionado + hover | chip/background-selected-hover | chip/foreground-selected | counter chip/counter-background; X shown |
| seleção · selecionado + foco | chip/background-selected | chip/foreground-selected | counter chip/counter-background; X shown; ring focus/border and focus/halo around the whole chip |
| seleção · selecionado + desabilitado | chip/background-selected, opacity 0.5 | chip/foreground-selected | counter chip/counter-background; X shown |

Status colors exist for removível only, in the states padrão, hover no X, foco no X, ativo no X and desabilitado. Inválido, somente leitura and marcado exist in the cor padrão only. The number of the counter uses chip/counter-foreground in every state. Disabled, selecionado, selecionado + hover, selecionado + foco and selecionado + desabilitado have no border.

Demonstrations in the frame, in light and dark: every state of removível and every state of seleção, one chip each.

## Usage

The component has no code yet; the attributes come with the spec. The frame shows only the tag, `<nph-chip></nph-chip>`, and the import, `import '@iatec/nephos/nph-chip';`.

## Relations and context

- In nph-toolbar, the applied filters sit in a line below the bar, and "Limpar filtros" (nph-button secondary, ghost, compact) comes after the last chip.
- Inside a field, each chosen value becomes a removível chip; the field controls the border, the focus of the group and the error message.
- Pieces inside the chip: nph-icon, nph-avatar and nph-badge.
- nph-badge shows a status with no action; the chip always has an action: remove or toggle.
- Space between chips: space/inline. When there is no room, the chips wrap to the next line.

Demonstrations in the frame, in light and dark: a line of applied filters ("Período: Outubro" with an icon, "Situação: Aguardando" in a status color, "Ana Souza" with an avatar) followed by "Limpar filtros".

## When to use

- Removível: a filter already applied or a chosen value that the person can take away.
- Seleção: quick filter that the person checks and unchecks; several can stay checked.
- Status color: the value of the filter is a status; the label says which.
- An icon helps to recognize the type of the filter; an avatar, when the value is a person; a counter, to show how many items the option has before the click.
- Size: compacto in the toolbar, the table and the field; padrão in seleção inside a form.

Demonstrations in the frame, in light and dark: removível with an icon, with a status color and with an avatar; seleção with a counter, selected and not selected.

## Mandatory examples

Light mode: applied filters in the toolbar ("Período: Outubro", "Situação: Atrasado", "Ana Souza" and the Limpar filtros button); values chosen in a field, one of them invalid ("ana@iatec.com", "bruno@iatec.com", "carla@iatec"); quick filters that the person checks and unchecks ("Pendentes", "Aprovados", "Atrasados").

Dark mode: the same three examples.

## Do

- Use removível for an applied filter — the X shows how to undo it.
- Show the X on the selected seleção chip — the state does not depend on color alone.
- Write a short label, such as "Campo: valor" — the person understands the filter without opening anything.
- Let the chips wrap — all stay visible and in reading order.

Demonstrations in the frame, in light and dark: one chip for each rule.

## Do not

- Do not use a chip for a system status with no action — use nph-badge.
- Do not use a chip to run an action — use nph-button.
- Do not put the line of chips in a horizontal scroll — let it wrap.

Demonstrations in the frame, in light and dark: a status with no action shown as a chip ("Aprovado"); an action inside a chip ("Excluir selecionados"); a line of chips cut, with a scroll.

## Tokens used

- chip/background (color/primary-surface-hover)
- chip/background-hover (theme/brand-200 in light, theme/brand-700 in dark)
- chip/background-selected (color/primary)
- chip/background-selected-hover (color/primary-hover)
- chip/background-disabled (color/secondary-light)
- chip/foreground (color/foreground)
- chip/foreground-selected (color/primary-foreground)
- chip/invalid-background (status/error-surface)
- chip/invalid-foreground (status/error-foreground)
- chip/invalid-border (status/error-border)
- chip/border (theme/brand-200 in light, theme/brand-400 in dark)
- chip/success-border, chip/warning-border, chip/error-border, chip/info-border, chip/help-border (status/<status>-border)
- chip/success-background, chip/warning-background, chip/error-background, chip/info-background, chip/help-background (status/<status>-surface)
- chip/success-foreground, chip/warning-foreground, chip/error-foreground, chip/info-foreground, chip/help-foreground (status/<status>-foreground)
- chip/success-remove-background-hover, chip/warning-remove-background-hover, chip/info-remove-background-hover, chip/help-remove-background-hover (status/<status>-surface-hover)
- chip/error-remove-background-hover (color/destructive-surface-hover)
- chip/success-focus-border, chip/warning-focus-border, chip/error-focus-border, chip/info-focus-border, chip/help-focus-border (status/<status>)
- chip/success-focus-halo (focus/halo-success), chip/warning-focus-halo (focus/halo-warn), chip/error-focus-halo (focus/halo-danger), chip/info-focus-halo (focus/halo-info), chip/help-focus-halo (focus/halo-help)
- chip/remove-background-hover (theme/brand-200 in light, theme/brand-700 in dark)
- chip/remove-size (core/size/600)
- chip/remove-radius (radius/full)
- chip/counter-background (theme/brand-200 in light, theme/brand-700 in dark)
- chip/counter-background-hover (theme/brand-300 in light, theme/brand-900 in dark)
- chip/counter-background-disabled (color/secondary-light)
- chip/counter-foreground (color/secondary-foreground)
- chip/counter-padding-y (core/space/50)
- chip/counter-padding-x (core/space/off-scale/6)
- chip/height-compact (control/height-compact)
- chip/height-default (control/height-default)
- chip/radius (radius/full)
- chip/gap (space/inline-tight)
- chip/padding-x (space/control-padding)
- chip/padding-start-icon (space/inline)
- chip/padding-start-avatar (space/inline-tight)
- chip/padding-end-remove (space/inline-tight)
- chip/padding-end-remove-default (space/inline)
- chip/padding-end-counter (space/inline-tight)
- chip/max-width (core/layout-width/chip)
- chip/border-width (border/width)

Also used, already on `v/5.0.0`: text/label-md (label), focus/border, focus/halo and focus/ring-width (focus ring of the cor padrão), border/width (focus border), icon/size-sm (icon and X icon), radius/full (counter), state/disabled-opacity (disabled), space/inline (space between chips).
