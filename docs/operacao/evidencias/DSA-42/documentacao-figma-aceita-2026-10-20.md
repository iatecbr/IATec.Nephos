```json
{
  "task": "DSA-42",
  "gate": "figma-docs-accepted",
  "date": "2026-10-20",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1237-5",
    "date": "2026-10-20",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-tooltip documentation board (1241:3), inside the frame 1237:5 on the page `NPH — Tooltip`, was accepted as the new API and behavior specification of the nph-tooltip. No COMPONENT_SET: single COMPONENT 1237:3, with the text property `texto`."
  }
}
```

# DSA-42 — `figma-docs-accepted`

Indiane redefined the `nph-tooltip` on 19-10-2026 and accepted the updated
documentation board (`1241:3`) in the file `DS-IA-NEPHOS 5.0`, page
`NPH — Tooltip`. The textual audit was approved on 20-10-2026. The component
needs no new token: every token it uses is on `v/5.0.0` with the same value as
Figma.

There is no command output. The acceptance is a human observation, recorded with
the date, the authorship, the board URL and the component.

The rest of this file is the Figma documentation converted to text, so that
whoever codes does not need to open Figma. Figma property names stay as they are
in Figma (Portuguese); the code API is in English (P64).

## Purpose
A floating text balloon attached to any element of the interface. It shows
complementary information, an explanation or context data when the pointer
rests on the element and when the element receives keyboard focus.

Selection: `nph-tooltip` — property `texto`.

## Description
Use `nph-tooltip` to give complementary information, an explanation or context
data to any element, such as the icon-only button and the `info` icon of the
`nph-label`. The balloon opens on hover and on focus, with no delay, and closes
when the pointer leaves the element and the balloon, on blur or with Esc. It
enters on `motion/enter-duration` and leaves on `motion/exit-duration`. It does
not replace the help text or the error message, which belong to `nph-field`, nor
the accessible name of the element.

## Anatomy

| Part | Rule |
|---|---|
| 1. Balloon | Background `color/tooltip`, corners `radius/inner`, shadow `elevation/dropdown`, padding `space/inline` (left and right) and `space/inline-tight` (top and bottom); at most `layout/max-tooltip-width` wide and `layout/max-tooltip-height` tall. |
| 2. Text | `text/body-sm` in `color/tooltip-foreground`. |
| 3. Distance to the element | `space/inline`, so the balloon does not cover the element's focus. Top by default; flips when it does not fit; may also sit bottom, left or right. |

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | The text uses `color/tooltip-foreground` on `color/tooltip`: 6.69:1 in light and 7.47:1 in dark, above 4.5:1 (WCAG 1.4.3). |
| Visible focus | The balloon never takes focus: focus stays on the element that opened it, with that element's focus drawing. The balloon stays open while the pointer is over it (WCAG 1.4.13). |
| Keyboard | Keyboard focus on the element opens the balloon; Esc closes it. Hover also opens it. |
| Touch target | The balloon is not a touch target and does not open on touch: without hover, essential information never lives only in the balloon. The touch target is the element, at its own size (WCAG 2.5.8). |
| Accessible name | The balloon complements the element's accessible name and does not replace it: on the icon-only button, the action name stays on the button itself. |

Demonstrations: text in `color/tooltip-foreground`; label `info` icon in focus
with the balloon above ("Focus stays on the element"); "Focus opens; Esc
closes", with the element in focus.

## Properties, variants and states

| Field | Rule |
|---|---|
| `texto` | Property, required. The balloon content, already localized by the application, with no action and no link. The balloon follows the text up to `layout/max-tooltip-width` and wraps; it fits at most two lines (`layout/max-tooltip-height`). The text must fit whole: no ellipsis and no broken word. |

No variants. Demonstrations: a short text, one sentence, and two lines (the
maximum).

## Usage
Any element can open the tooltip. The icon-only button carries the action name;
the `nph-label` uses it through its `info` icon, and for that importing
`nph-label` is enough. How other elements attach the balloon in code is defined
in the spec.

The Figma board shows this example for the `nph-label`:

```html
<nph-label for="cpf" text="CPF" info="Número do Cadastro de Pessoa Física." info-label="Sobre o CPF"></nph-label>
```

```js
import 'nephos/nph-label';
```

## Relations and context
- The balloon opens from any element: the icon-only button carries the action
  name; the `info` icon of the `nph-label` carries the explanation.
- The balloon text comes from the element that opens it; on the `nph-label`,
  from the `info` property.
- Help text and error message stay in `nph-field`, not in the balloon.
- The balloon sits next to the element, at `space/inline`, without covering its
  focus.

Demonstrations: opened from the `info` icon; with a required field, the asterisk
stays in the label; next to the element without covering its focus.

## When to use
- To give the action name to every icon-only button.
- For complementary information or context data of any element.
- For one sentence the person reads at once, before filling in.

Demonstrations: explanation of the `info` icon; complementary explanation of the
label; one sentence, read at once.

## Required examples
In light and dark:

1. Label with `info`, balloon open, above the label.
2. Required field with `info`, balloon open, above the label.
3. Element in focus, balloon open.
4. Icon-only button (ghost, hover) with the balloon "Excluir" on each side:
   top (the default), bottom (when it does not fit above), left and right.

## Do
- Open the balloon on hover and on focus, on any element.
- Give complementary context about what the field asks.
- Keep the help text below the field.

Demonstrations: opened on hover; complements what the field asks; the balloon
explains while the help text stays in the field (`nph-field` with help text
visible).

## Do not
- Put an action, a link or a field inside the balloon.
- Repeat in the balloon the help text of the field.
- Put in the balloon information without which the element cannot be used.
- Truncate the text with an ellipsis or let it pass two lines: rewrite until it
  fits.

Demonstrations: action inside the balloon; repeating the field help text;
essential information only in the balloon (a password rule).

## Tokens of the component
`color/tooltip`, `color/tooltip-foreground`, `radius/inner`, `space/inline`,
`space/inline-tight`, `layout/max-tooltip-width`, `layout/max-tooltip-height`,
`motion/enter-duration`, `motion/exit-duration`, text style `text/body-sm`,
effect `elevation/dropdown`. The Figma component also binds `border/width` to the
stroke weight, but it has no stroke: no border is drawn.
