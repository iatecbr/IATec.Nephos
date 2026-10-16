```json
{
  "task": "DSA-41",
  "gate": "figma-docs-accepted",
  "date": "2026-10-16",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1633-122",
    "date": "2026-10-16",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-input-otp board (1633:122), on the page `NPH — Input OTP`, with its `Documentação` frame, was accepted as the API and behavior specification of the nph-input-otp. COMPONENT_SET: nph-input-otp (1633:120), variants `digitos`, `state` and `size`; cell set nph-input-otp / casa (1633:29), variants `state` and `size` and the properties `dígito`, `mostrar dígito` and `ocultar dígito`."
  }
}
```

# DSA-41 — `figma-docs-accepted`

The documentation of the `nph-input-otp` board (`1633:122`) was accepted in
Figma, in the file `DS-IA-NEPHOS 5.0`, with the Figma UX QA and the textual
audit approved. The component needed one new token, `color/link`, which is on
`v/5.0.0` with the same values as in Figma. Every other token it uses was already
on `v/5.0.0`.

There is no command output. The acceptance is a human observation, recorded with
the date, the authorship, the board URL and the component.

The rest of this file is the Figma documentation converted to text, so that
whoever codes does not need to open Figma. Figma property names stay as they are
in Figma (Portuguese); the code API is in English (P64).

## Purpose
Short code field, one cell per digit, to confirm access with a code sent by SMS
or e-mail.

Selection: `nph-input-otp` — properties `digitos` (6 or 4), `state` (`default`,
`erro` and `disabled`) and `size` (`default` and `large`). The cell,
`nph-input-otp / casa`, has `state` (`default`, `hover`, `foco`, `erro`,
`erro-foco` and `disabled`), `size`, `dígito`, `mostrar dígito` and
`ocultar dígito`.

## Description
Use it when the person types a short code of known length that was sent to them
by SMS or e-mail. It does not replace the `nph-input`, which takes free
one-line text. The label, the help text and the error message come from the
`nph-field`. The resend button is a composition below the field and is not part
of the set.

## Anatomy

| Part | Rule |
|---|---|
| 1. Set | The row of cells, one per digit, with `space/inline` between them. `digitos` defines 6 or 4 cells. |
| 2. Cell | The square of each digit: background `color/background`, border `color/input` at `border/width`, radius `radius/control`. It measures `control/height-default` in `size=default` and `control/height-large` in `size=large`. |
| 3. Digit | The character of the cell, in `text/code` and `color/foreground`. It accepts a number or a letter. It disappears when `mostrar dígito` is off. |
| 4. Dot (optional) | The `•` that takes the place of the digit when `ocultar dígito` is on, in `text/code` and `color/foreground`. |
| 5. Focus halo | A ring outside the cell, only in `foco` and `erro-foco`. It stays out of the layout and takes no space. |

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | The digit and the dot pass 4.5:1 and the border `color/input` passes 3:1, in light and dark. `state=disabled` gets no minimum contrast. |
| Visible focus | The focused cell changes its border to `focus/border` and adds the halo `focus/halo`. In `erro-foco` the border stays `status/error` and the halo becomes `focus/halo-error`. |
| Color is not the only signal | The error paints the border and the message comes as text, in the `nph-field`. The disabled state combines opacity and the background `color/muted`. |
| Touch target | The cell is the target and has no inner padding: it measures 36 in `size=default` and 44 in `size=large`. On a touch screen, use `size=large`. |
| Accessible name | The name of the field comes from the label of the `nph-field`. The digit is only the value. |

Demonstrations in the frame, in light and dark: focus; error with the message;
disabled; `size=large`.

## Properties, variants and states

| Figma property | Rule |
|---|---|
| `digitos` | 6 is the default. 4 serves a four-digit code. |
| `state` | `default` is the default. `erro` paints the borders in `status/error`. `disabled` applies opacity and the background `color/muted`. The cell also has `hover`, `foco` and `erro-foco`. |
| `size` | `default` measures 36, in `control/height-default`. `large` measures 44, in `control/height-large`, for touch screens. All cells of a field use the same `size`. |
| `dígito` | The character of the cell, number or letter. |
| `mostrar dígito` | On shows the digit. Off leaves the cell empty. |
| `ocultar dígito` | Off is the default. On shows the dot `•` in place of the digit; turn `mostrar dígito` off with it. |
| Letters and numbers (not a property) | The field accepts an alphanumeric code, such as `A7K2Q9`. It is behavior: the cell does not change. |
| Label, help, error and resend (not properties) | The label, the help and the error belong to the `nph-field`. The resend is a `nph-button` below the field. |

`ocultar dígito` exists on the cell only, not on the set.

Demonstrations in the frame, in light and dark: `size=default`; `size=large`;
`digitos=4`; `ocultar dígito` on; `state=erro`; `state=disabled`.

## Usage
No code example in the documentation. The attributes come with the spec.

## Relations and context
- `nph-field`: carries the label, the help text and the error message. The
  `nph-input-otp` enters the field through the swap `⮑ controle` and keeps only
  the cells.
- `nph-button`: the resend of the code is a ghost `nph-button` below the field,
  with the label in `color/link` and underlined. It is disabled during the
  countdown and active when the countdown ends.
- The `state` of the set applies to all cells.
- The space between the cells comes from `space/inline`.

Demonstrations in the frame, in light and dark: inside the `nph-field`; resend
during the countdown; resend after the countdown.

## When to use
- Confirmation code sent by SMS or e-mail: `digitos` 6 or 4, by the length of the code.
- Touch screen, where the code is usually typed on the phone: `size=large`.
  On other screens, `size=default`.
- Code typed in a public place: `ocultar dígito`.
- Code with letters and numbers, such as `A7K2Q9`: the field accepts it and the
  cell does not change.
- Free one-line text: use the `nph-input`.

Demonstrations in the frame, in light and dark: numeric code; code with letters
and numbers; hidden digits.

## Required examples
Each in light and dark mode:

| Example | What it shows |
|---|---|
| Code sent by e-mail, in the `nph-field` | Label, set and help text. |
| Wrong code, with the error message | `state=erro` with the message in the `nph-field`. |
| Touch screen | `size=large`. |

## Do
- Use the `nph-field` for the label, the help and the error, because the field
  gets a name and the error shows as text.
- Use the same `size` in all cells of the field, because the cells stay aligned
  and the touch target is the same.
- Use `size=large` on a touch screen, because the 44 cell is easier to hit on a phone.
- Show the countdown in the resend button while it is disabled, because the
  person knows when another code can be requested.
- Turn on `ocultar dígito` only when the code is typed in a public place; in
  other cases seeing the digit helps the person check it.

## Do not
- Do not leave the `nph-input-otp` without the `nph-field`: use the `nph-field`
  for the label, the help and the error.
- Do not mix cells of different sizes: use the same `size` in the whole field.
- Do not turn on `ocultar dígito` together with `mostrar dígito`: turn
  `mostrar dígito` off, or the digit and the dot appear together.
- Do not paint the resend text with a loose color: use `color/link`.

Each line has a wrong-use demonstration in the frame, in light and dark.

## Source of the acceptance
WORK BRAIN — `03 MEMÓRIA/diario/2026/2026-10-16.md`: visual acceptance, Figma UX
QA approved, documentation board accepted and textual audit approved.
