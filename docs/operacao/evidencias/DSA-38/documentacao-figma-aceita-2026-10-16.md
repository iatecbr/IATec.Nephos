```json
{
  "task": "DSA-38",
  "gate": "figma-docs-accepted",
  "date": "2026-10-16",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1632-24",
    "date": "2026-10-16",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-textarea frame (1632:24), documentation 1922:642, on the page `NPH — Textarea`, was accepted as the API and behavior specification of the nph-textarea. COMPONENT_SET: nph-textarea (1632:22), variant `state` and the properties `texto do valor`, `texto do placeholder`, `rodapé` and `texto do contador`."
  }
}
```

# DSA-38 — `figma-docs-accepted`

Indiane accepted the documentation of the `nph-textarea` board (`1632:24`,
documentation `1922:642`) on 15-10-2026, in the file `DS-IA-NEPHOS 5.0`. The
Figma UX QA was approved on 15-10-2026 and the textual audit on 16-10-2026
(round 4). The component needed two new tokens, taken to `v/5.0.0` with this
task: `layout/textarea-min-height` and `layout/textarea-max-height`. Every other
token it uses was already there.

There is no command output. The acceptance is a human observation, recorded with
the date, the authorship, the board URL and the set.

The rest of this file is the Figma documentation converted to text, so that
whoever codes does not need to open Figma. Figma property names stay as they are
in Figma (Portuguese); the code API is in English (P64).

## Purpose
A multi-line text field, for the person to write a long text, such as a comment
or a message.

Selection: `nph-textarea` — property `state` (`default`, `hover`, `foco`,
`erro`, `erro-foco`, `disabled` and `leitura`). Optional: `texto do valor`,
`texto do placeholder`, `rodapé` and `texto do contador`.

## Description
Use it when the person writes more than one line: a comment, a message, a
description. It does not replace `nph-input`, which is a single line, nor
`nph-select` and `nph-combobox`, which pick among ready options. The label, the
help text and the error message come from `nph-field`.

## Anatomy

| Part | Rule |
|---|---|
| 1. Field | The text box: background `color/background`, border `color/input`, radius `radius/control`. |
| 2. Scroll area | Inner frame with clipping. It grows with the text from `layout/textarea-min-height` and stops at `layout/textarea-max-height`; above that, the text scrolls inside. |
| 3. Text | The typed value in `color/foreground`, or the placeholder in `color/muted-foreground`. Never both at the same time. |
| 4. Footer (optional) | Strip below the text, turned on by the property `rodapé`. It sits `space/stack` below the text and holds the counter and the actions. |
| 5. Counter (optional, in the footer) | Text in `text/caption` and `color/muted-foreground`. It serves only for a comment and a message. |
| 6. Actions (optional, in the footer) | `nph-button` instances: `ghost`, such as “Attach”, and `solid`, such as “Send”, in `size=default`. |
| 7. Focus halo | A ring outside the field, only in the states `foco` and `erro-foco`. It stays outside the clipping of the scroll area and takes no space. |

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | The typed text, the placeholder and the counter pass 4.5:1, and the border `color/input` passes 3:1, in light and dark. The `disabled` state takes no interaction and is out of this criterion. Exception in `erro-foco`: the border `status/error` against the halo `focus/halo-error` measures 3.58 in light and 1.96 in dark. The focus stays visible because the halo against the background measures 9.82. |
| Visible focus | Focus changes the border to `focus/border` and adds the halo `focus/halo`. In `erro-foco` the border stays `status/error` and the halo becomes `focus/halo-error`. The halo is absolute, stays outside the clipping of the scroll area and does not change the size of the field. |
| Color is not the only signal | The error paints the border and the message comes as text, in `nph-field`. `disabled` combines opacity and the background `color/muted`. `leitura` does not change on hover and has no error. |
| Touch target | The whole field takes the focus, with a minimum height of `layout/textarea-min-height`. In the footer, each action is an `nph-button` in `size=default`, with height `control/height-default`. |
| Accessible name | The field name comes from the `nph-field` label; the placeholder does not play that role. Each footer action has its name from its own text. |

## Properties, variants and states

| Figma property | Rule |
|---|---|
| `state` | `default` is the default. `hover`, `foco`, `erro`, `erro-foco` and `disabled` follow the use of the field. `erro-foco` is focus with the field invalid. `leitura` shows a text the person does not edit and does not change on hover. Borders: `default` and `leitura` `color/input`; `hover` `color/input-hover`; `foco` `focus/border` with the halo `focus/halo`; `erro` `status/error`; `erro-foco` `status/error` with the halo `focus/halo-error`; `disabled` background `color/muted`, border `color/input`, opacity `state/disabled-opacity`. |
| `texto do valor` | On shows the typed text, in `color/foreground`. Off, the field is empty. |
| `texto do placeholder` | On shows the invitation, in `color/muted-foreground`, before the person writes. Do not turn it on together with `texto do valor`. |
| `rodapé` | Off is the default. On adds the footer with counter and actions, only for a comment and a message. It does not apply to `state=leitura`. |
| `texto do contador` | Writes the footer counter, such as “0/280”. It only shows with `rodapé` on. |
| Minimum and maximum height (not a property) | They come from `layout/textarea-min-height` and `layout/textarea-max-height`, applied on the scroll area. Above the maximum, the text scrolls inside instead of the field growing. |
| Label, help, error and support-line counter (not properties of the field) | They belong to `nph-field`. The support-line counter is the `contador` property of `nph-field`. |

## Usage
The component has no code yet; the attributes come with the sheet.

## Relations and context
- `nph-textarea` sits inside `nph-field`, which gives the label, the help text
  and the error message.
- The counter of the support line belongs to `nph-field`: property `contador`,
  to the right of the help text, in `text/caption` and `color/muted-foreground`.
- The footer counter belongs to `nph-textarea` and serves only for a comment and
  a message. In a common form, use the `nph-field` counter.
- The footer actions are `nph-button` instances: `ghost`, such as “Attach”, and
  `solid`, such as “Send”, in `size=default`. In `state=disabled`, they are
  `disabled`.
- Between the text and the footer the space is `space/stack`; between the
  actions, `space/inline`.

## When to use
- Text of several lines: `nph-textarea`. Text of a single line: `nph-input`.
- A comment or message with actions next to the text: footer on, with counter
  and actions.
- A common form with a character limit: counter in the support line of
  `nph-field` and footer off.
- A text the person only reads: `state=leitura`.
- A long text: the area grows up to `layout/textarea-max-height` and then
  scrolls inside.

## Required examples
Each in light and dark mode:

| Example | What it shows |
|---|---|
| Comment | Footer with counter and actions. |
| Description in a form | Counter in the `nph-field` support line. |
| Long text | Scrolls inside, without passing the maximum. |

## Do
- Use `nph-textarea` when the text goes past one line, because `nph-input` has
  a single line.
- Turn the footer on only in a comment and a message, because there the actions
  stay next to the text.
- Put the counter in the support line of `nph-field` in a common form, because
  the help and the limit stay in the same place.
- Warn about an exceeded limit with `state=erro` and the `nph-field` message,
  without blocking the typing, because the person decides what to cut.
- Write the placeholder as a short invitation, such as “Write your message”,
  because it disappears when the person types.
- Let the text scroll inside above `layout/textarea-max-height`, because the
  field does not push the rest of the screen.

## Do not
- Do not turn the footer on in `state=leitura`: the text is not edited, so there
  is nothing to send. Use `state=leitura` without a footer.
- Do not use the footer counter in a common form: use the `nph-field` counter,
  in the support line.
- Do not use `nph-textarea` for a single-line datum, such as a name: use
  `nph-input`.
- Do not use `state=disabled` for a text the person needs to read: use
  `state=leitura`, which does not lose contrast.

## Source of the acceptance
WORK BRAIN — `03 MEMÓRIA/diario/2026/2026-10-15.md`: visual acceptance, Figma UX
QA approved (100/100) and acceptance of the documentation board;
`03 MEMÓRIA/diario/2026/2026-10-16.md`: gap between the footer actions decided
(`space/inline`) and textual audit approved (round 4).
