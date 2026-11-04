```json
{
  "task": "DSA-64",
  "gate": "figma-docs-accepted",
  "date": "2026-11-04",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=4178-15028",
    "date": "2026-11-04",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "Indiane accepted the new documentation frames of nph-button (4178:15028, page 312:98) and nph-icon-button (4178:24324, page 2109:51809), with the Figma UX QA and the textual audit approved. On 2026-11-03 she removed the secondary light emphasis from both sets; on 2026-11-04 she fixed the secondary outline and secondary solid colors (decisions 2 and 3) and made secondary solid, state default, the default of the secondary type. COMPONENT_SET nph-button (461:13009), 225 variants, and nph-icon-button (498:15671), 450 variants."
  }
}
```

# DSA-64 — `figma-docs-accepted`

The documentation of `nph-button` (frame `4178:15028`) and of `nph-icon-button` (frame `4178:24324`) was accepted in Figma on 2026-11-04, in the file `DS-IA-NEPHOS 5.0`, with the Figma UX QA and the textual audit approved. It replaces the boards `1197:5449` and `2122:1591` named in DSA-13, DSA-43 and DSA-60.

Three changes reach the code:

1. **The secondary light emphasis no longer exists**, with text and in the icon only (decision of 2026-11-03). `light` stays only in primary and danger. In Figma, every secondary light instance became secondary solid, including the action cell of the table (`2425:1032`).
2. **Secondary solid and secondary outline have new colors**, through ten new component tokens (decisions 2 and 3 of 2026-11-04). They came with this task and are on `v/5.0.0`.
3. **The default of the secondary type is solid, in state default.** The usage rules of the type and emphasis changed (see When to use).

There is no command output. The acceptance is a human observation, recorded in the json block above with the frame URL and the component sets.

The rest of this file is the contract converted to text, so that whoever codes does not need to open Figma. Figma property names stay as they are in Figma (`tipo`, `enfase`, `size`, `state`, `forma`); the code API is in English (`severity`, `emphasis`, `size`, `shape`). In code, the nph-icon-button of Figma is the `nph-button` without text (B5).

## Sets and variants

| Set | Properties | Variants |
|---|---|---|
| `nph-button` `461:13009` | `tipo` × `enfase` × `size` × `state` | 225: 15 type and emphasis pairs × 3 sizes × 5 states |
| `nph-icon-button` `498:15671` | the same, plus `forma` (`quadrado`, `circular`) | 450 |

The 15 pairs, in both sets: `solid` in all seven types; `outline` and `ghost` in primary, secondary and danger; `light` only in primary and danger. Info, warn, help and success exist only in solid.

## Tokens

Ten new tokens, all in the semantic layer. `core/surface/*` goes from `50` `#edeeef` to `500` `#4b5563`.

| Token | Light | Dark | Where it goes |
|---|---|---|---|
| `button/secondary-solid-background` | `core/surface/50` | `color/secondary` (`core/surface/600`) | secondary solid, rest and every state that is not hover |
| `button/secondary-solid-background-hover` | `core/surface/100` | `core/surface/500` | secondary solid, `hover-active` |
| `button/secondary-outline-border` | `core/surface/200` | `core/surface/400` | secondary outline, 1 px border at rest |
| `button/secondary-outline-border-hover` | `core/surface/400` | `core/surface/300` | secondary outline, border in `hover-active` |
| `button/secondary-outline-background-hover` | `color/secondary-light-hover` | `color/secondary-light-hover` | secondary outline, background in `hover-active` |
| `icon-button/secondary-solid-background` | `core/surface/50` | `color/secondary` | the same, icon only |
| `icon-button/secondary-solid-background-hover` | `core/surface/100` | `core/surface/500` | the same, icon only |
| `icon-button/secondary-outline-border` | `core/surface/200` | `core/surface/400` | the same, icon only |
| `icon-button/secondary-outline-border-hover` | `core/surface/300` | `core/surface/300` | the same, icon only; in light it differs from the button with text |
| `icon-button/secondary-outline-background-hover` | `color/secondary-light-hover` | `color/secondary-light-hover` | the same, icon only |

What does not change:

- The secondary text and icon color: `color/secondary-foreground` in solid, outline and ghost.
- The secondary outline background at rest: `color/muted`, with no component token (appendix point 6).
- The secondary ghost: `button/secondary-ghost-background-hover` and `icon-button/secondary-ghost-background-hover` (DSA-60).
- Primary, danger, info, warn, help and success, in every emphasis.
- `color/secondary-light` and `color/secondary-light-hover` stay: nph-badge and other pieces use them.

## Anatomy

**Button with text**

1. **Container** — height `control/height-compact`, `-default` or `-large`; radius `radius/control`; inner padding `space/control-padding`.
2. **Text** — `text/label-md`, the same in every size; says what happens on click.
3. **Start icon** (optional) — `icon/size-sm` when there is text; gap to the text `space/inline-tight`.
4. **End icon** (optional) — same rule as the start icon; never together with it.
5. **Focus ring** — appears in state `foco`, for keyboard users.

**Icon only**

1. **Container** — width and height on the same token, `control/height-compact`, `-default` or `-large`; no inner padding; radius `radius/control` on the square and `radius/full` on the circular.
2. **Icon** — from the nph-icon set, centered; follows the box: `icon/size-sm` in compact, `icon/size-md` in default, `icon/size-lg` in large.
3. **Spinner** — in state `carregando`, the nph-spinner takes the place of the icon.
4. **Focus ring** — as above; on the circular it follows the radius.

## Properties

| Figma property | Rule |
|---|---|
| `tipo` | `primary` (default), `secondary`, `info`, `warn`, `help`, `danger`, `success`. Chosen by the meaning of the action, never by the color. |
| `enfase` | `solid` (default), `outline`, `light`, `ghost`. How much the action stands out. `outline` and `ghost` exist in primary, secondary and danger; `light` only in primary and danger. **The default of secondary is also solid, in state default.** |
| `size` | `compact` (28 px), `default` (36 px, default), `large` (44 px). Large meets the 44 px touch target; compact is never the main touch target. |
| `state` | `default`, `hover-active`, `foco`, `disabled`, `carregando`. A field error is not a state of the button. |
| `ícone início` / `ícone fim` | Text only. Off by default; one icon before or after the text, from nph-icon, at `icon/size-sm`; never both. |
| `forma` | Icon only. `quadrado` (default, `radius/control`) or `circular` (`radius/full`). It does not change the size or the touch target. |
| accessible name | Icon only. Not a property of the Figma set: it comes from the `label` attribute and is required. |
| tooltip | Icon only. The name of the action in a tooltip, required on every icon-only button. |
| text | Icon only. It does not exist in this set: with visible text, use the button with text. |

## Accessibility

**Contrast, with text.** Text and icon pass 4.5:1 in every type and emphasis, in both modes and in every brand; the lowest value is 4.64:1, primary outline and light in light mode, `educacao` brand. Secondary text: 16.28:1 in light, solid and outline; in dark, 7.24:1 on solid and 9.36:1 on outline. The primary and danger outline borders pass 3:1. The secondary outline border is 1.93:1 in light and 4.18:1 in dark; in hover, 4.53:1 and 6.58:1. In light, the text identifies the button: WCAG 1.4.11 does not require the border in that case.

**Contrast, icon only.** Icon against background passes 3:1 (non-text contrast) in every type and emphasis and both modes; in the default brand the lowest value is 4.78:1 in light and 4.91:1 in dark. The secondary outline border is 1.93:1 in light and 4.18:1 in dark; in hover, 2.87:1 and 6.58:1. In light, the icon, the accessible name and the tooltip identify the button.

**Visible focus.** In state `foco`, the 1 px border and the 4 px halo appear for keyboard users; on the circular they follow the radius. In light, the border passes 3:1 against the background (4.90:1 to 7.49:1); the halo is reinforcement. In dark, the border also passes 3:1 (4.91:1 to 8.98:1); in info, warn, help, danger and success, border and halo are close to each other (1.64:1 to 2.04:1), and the halo separates the focus from the background (9.82:1 to 11.93:1). The focus tokens do not change.

**Color is not the only signal.** The text, or the icon with the accessible name, says the action; type, focus and state never depend on color alone, and loading swaps the icon for the spinner.

**Touch target.** The whole box is the target: 28 px in compact, 36 px in default, 44 px in large. Only large meets the 44 px touch target; compact is not a main touch target.

**Accessible name.** With text, the text is the name. Without text, `label` is required; without it, the component fails validation.

## Usage

```html
<nph-button severity="primary" text="Salvar"></nph-button>
<nph-button icon-start="xmark" label="Fechar"></nph-button>
```

Import: `import 'nephos/nph-button';`. Without text, the icon goes in `icon-start` and the name of the action in `label`.

## Relations

- Start or end icon only from nph-icon, at `icon/size-sm` with text, with `space/inline-tight` to the text.
- In state `carregando`, the button shows the nph-spinner.
- Field validation belongs to nph-field, not to the button.
- Without text, the icon follows the box: sm in compact, md in default, lg in large.
- Every icon-only button carries a tooltip with the name of the action.

## When to use

- To start an action identified by text, such as save or send. Without text, for a universal and recognizable action, such as close, search or open more options.
- Type by the meaning of the action, never by the color.
- Emphasis by how much the action stands out: solid, outline, light or ghost.
- Secondary is a color type, not a level of hierarchy. The emphasis gives the weight of the action.
- One primary per area: only one primary action in each block, panel or dialog, with text or without.
- Save and Cancel: primary solid with secondary solid. In a dialog, Cancel may be secondary ghost. Save and Cancel need text: use the button with text.
- Outline for an alternative action of the same weight, side by side. It is not the default Cancel.
- Ghost on the icon-only button, on a table row action and on support actions, such as close, copy or scroll.
- Ghost also on a third-level action, less important than the secondary one, such as Show all or Resend code. Outside these cases, the default is solid.
- Danger never becomes the default action: it does not get the initial focus or the Enter key, even when it is the most likely action. It always asks for confirmation before running.
- Large on touch screens; compact never as the main touch target.
- Icon only: also in the actions column of a table, even when the action leads to another screen, such as view details. Square and circular are a choice of context, with no fixed rule.

| Type | When to use | When not to use |
|---|---|---|
| primary | The main action of the block. | Next to another primary action in the same block. |
| secondary | The neutral action, such as Cancel next to Save. **The default of secondary is solid, in state default.** | As the only main action of the block. |
| danger, with text | The action that deletes, revokes or cannot be undone. Always with confirmation before running. | Icon only; write the text. |
| danger, icon only | In the actions column of a table, to delete or revoke, with a tooltip that gives the name of the action. Always with confirmation. | Outside the actions column; use the danger button with text. |
| info | An action tied to neutral information, such as a system notice or a context tip. | In an error, a risk or a confirmation. |
| warn | An action that asks for care before going on. | In an error that already happened; if the action deletes or cannot be undone, use danger. |
| help | An action that opens help or guidance, such as an explanation, a tour or support content. | To report a system state. |
| success | An action that confirms something went well. | To mark a permanent state, such as "active"; use nph-badge. |

| Size | When to use | When not to use |
|---|---|---|
| compact (28 px) | Inside a table, a toolbar or a filter. | As the main touch target; with a size different from the field next to it. |
| default (36 px) | Every other case; it is the default. | With a size different from the field next to it. |
| large (44 px) | On touch screens and in the main form; meets the 44 px touch target. | With a size different from the field next to it. |

## Required examples

- With text: form actions, primary and secondary (Save with Cancel, both solid); an action with consequence, always with text (Delete account); a universal action without text, with an accessible name.
- Icon only: row actions of a table, in compact; closing a panel; the circular shape, with an accessible name.

## Do

- Write in the text what happens on click.
- With text, keep the icon at `icon/size-sm`; one icon only: on the left to reinforce the action, on the right for what comes next, such as opening options.
- Keep the icon in the color of the text.
- Without text, give every button the accessible name and the tooltip; keep the icon at the size of the box.
- Change type, emphasis, state and shape through the properties, never by detaching the instance.
- Use one primary per area and, next to it, the secondary solid, such as Save with Cancel.
- Use ghost on table row actions and on support buttons, such as close, copy or scroll.

## Do not

- Show a field error on the button: validation belongs to the field (nph-field).
- Use the icon only on an action with consequence, such as delete or publish, outside the actions column of a table: use the button with text.
- Leave an icon-only button without accessible name or without tooltip.
- Enlarge the icon to stand out; turn on start and end icon together; give the icon a color different from the text.
- Use color as the only signal of intention, focus or state.
- Navigate to another destination with the button.
- Use outline on the default Cancel: it is for an alternative action of the same weight.
- Put two primary actions in the same area.
- Leave danger with the initial focus or the Enter key, or run it without confirmation.

## Answers to the appendix

Every point was answered as recommended in the appendix (frame `4180:15189`).

| Point | Answer |
|---|---|
| Pend. 1 | The outline border and border hover point straight to `core`, although `color/border` and `color/input-hover` have the function, because the decided values differ. A later batch may create semantic tokens with these values; this task does not. |
| Pend. 2 | The outline hover keeps `color/secondary-light-hover`, whose name still says light. Renaming affects other consumers; it stays for the token sweep. |
| Reg. 3 | Secondary solid: light on `core`, dark on `color/secondary`, hover on `core`. Values of decision 3. |
| Reg. 4 | Outline border hover in light: `core/surface/400` (4.53:1) with text and `core/surface/300` (2.87:1) icon only, as decided. |
| Pend. 5 | No inactive-but-focusable state until a screen asks for it. |
| Pend. 6 | The outline background at rest stays on `color/muted`, with no component token. |
| Pend. 7 | The 1.93:1 outline border in light is accepted: the text or the icon identifies the button. |
| Pend. 8 | Compact stays at 28 px. |
| Reg. 5 | In dark, the outline border is opaque (`core/surface/400`), as decided. |
| Reg. 6 | Focus in dark on status types: the halo carries the 3:1, as described in Accessibility. No token change. |
