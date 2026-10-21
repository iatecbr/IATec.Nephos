```json
{
  "task": "DSA-44",
  "gate": "figma-docs-accepted",
  "date": "2026-10-21",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1368-27",
    "date": "2026-10-21",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-dialog board (1368:27), with its `Documentação` frame (2277:2), was accepted as the API and behavior specification of the nph-dialog. COMPONENT_SET: nph-dialog (2268:52262), variants `tamanho` (P, M, G) and `ações` (`em linha`, `empilhadas`); parts `.nph-dialog/destaque` (2268:52091) and `.nph-dialog/conteúdo` (2311:5339)."
  }
}
```

# DSA-44 — `figma-docs-accepted`

The documentation of the `nph-dialog` board (`1368:27`) was accepted in Figma,
in the file `DS-IA-NEPHOS 5.0`, with the Figma UX QA and the textual audit
approved. The component needed 20 tokens
that were not on `v/5.0.0`; they were taken to `v/5.0.0` with the same values
as in Figma, together with this task. Every other token it uses was already
there.

There is no command output. The acceptance is a human observation, recorded with
the date, the authorship, the board URL and the component.

The rest of this file is the Figma documentation converted to text, so that
whoever codes does not need to open Figma. Figma property names stay as they are
in Figma (Portuguese); the code API is in English (P64).

## Purpose
Modal window that blocks the page until the person finishes or cancels a short
task, always over the `overlay/scrim` veil.

Selection: `título` · `tamanho` (P, M, G) · `ações` (`em linha`, `empilhadas`) ·
`mostrar conteúdo` · `conteúdo` · `ícone de destaque` · header and footer lines
· `rodapé` · `botão fechar` · `descrição`.

## Description
Use `nph-dialog` for a short task that needs the full attention of the person
before going on: edit a record, fill a short form, choose an option. To confirm
a destructive action, such as deleting or discarding, use the
`nph-alert-dialog`. A long flow goes to a page, and a notice that asks for no
answer does not use a dialog.

## Anatomy

| Part | Rule |
|---|---|
| 1. Window | Background `color/dialog`, radius `radius/overlay`, shadow `elevation/modal` and padding `space/overlay-padding`. The height goes up to `layout/dialog-max-height`. The width hugs the content, from `layout/dialog-min-width` up to the ceiling of the size: `layout/dialog-sm`, `-md` or `-lg`. |
| 2. Highlight icon (optional) | Part `.nph-dialog/destaque`: a solid icon in the status color over the status background: warning, info, success or error. |
| 3. Title | `text/heading-md` in `color/dialog-foreground`. It is the name of the dialog on screen. |
| 4. Description (optional) | `text/body-md` in `color/muted-foreground`, at `space/stack-snug` from the title. |
| 5. Close button (optional) | `nph-icon-button` secondary, ghost, compact. |
| 6. Header and footer lines (optional) | `nph-separator` in `color/dialog-separator`, softer than `color/border`, which separates long content from the header and the footer. |
| 7. Content | Swappable through the `conteúdo` property. Its width sets the width of the dialog, up to the ceiling of the size. The default part, `.nph-dialog/conteúdo`, only marks the area for fields, text or another composition. It is the only part that scrolls. |
| 8. Footer (optional) | Solid secondary `nph-button` in `color/secondary-on-dialog` and the primary or the danger, at `space/inline-loose` from each other. |

Demonstration in the frame: `tamanho=P` with the highlight icon and both lines,
`Escolher pasta`.

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | Title, description and button text pass 4.5:1 on the background in both modes. The highlight icon passes 3:1 on the background of its status. |
| Visible focus | The visible focus is that of the close button and of the footer buttons, which come from the `nph-icon-button` and the `nph-button`. Where focus goes on open and on close is a code rule. |
| Color is not the only signal | The highlight icon has its own shape in each status, and the title says the subject: color only reinforces. |
| Touch target | The close button in compact meets the minimum of 24 by 24; the footer buttons stay in default. |
| Accessible name | The title gives the name of the dialog and the description completes it. The close button carries `aria-label="Fechar"`. The highlight icon is decorative, with `aria-hidden`. |

Demonstrations in the frame, in light and dark: an icon with its own shape in
each status (`Não foi possível salvar`, error); close with `aria-label` and the
title naming the dialog (`Publicar agora?`).

## Properties, variants and states

| Figma property | Rule |
|---|---|
| `tamanho` | Sets the width ceiling; the dialog hugs its content up to it, starting from `layout/dialog-min-width`. P (`layout/dialog-sm`, 400) for a choice or a short confirmation, without a destructive action; M (`layout/dialog-md`, 560), the default, for a short form; G (`layout/dialog-lg`, 720) for a table, a long list or a two-column form. |
| `ações` | `em linha`: buttons on the right, side by side, the primary last. `empilhadas`: below `core/breakpoint/md`, buttons at full width, the primary on top. |
| `título` | Title text. Always present. |
| `descrição` and `texto da descrição` | Turns on the support sentence below the title and sets its text. |
| `botão fechar` | Turns on the close button. Turn it off only when the footer already offers the way out, as in the `nph-alert-dialog`. |
| `rodapé` | Turns on the actions. Turn it off when the dialog only shows content and the close button is enough. |
| `ícone de destaque` | Turns on the icon before the title. The status is swapped on the `.nph-dialog/destaque` instance: warning, info, success or error. |
| `linha do cabeçalho` and `linha do rodapé` | Turn them on with long content, such as a list or a table, to separate it from the header and the footer. The line sits at `space/stack` from the content; the actions always sit at `space/stack` plus `space/stack-snug` from what comes before, with or without the line. |
| `mostrar conteúdo` | Turns on the area between the header and the footer. Turn it off in a short confirmation, which has only title, description and actions. Without the area, the header text sets the width, up to the ceiling of the size. |
| `conteúdo` | Swaps the area between the header and the footer. The default, `.nph-dialog/conteúdo`, only marks the space; swap it for the part the case needs, such as the confirmation field of the `nph-alert-dialog`. |
| Scroll (not a property) | Above `layout/dialog-max-height`, only the content scrolls; header and footer stay fixed. Code solves it. |
| Loading (not a property) | Comes from the `carregando` state of the `nph-button` in the footer. |
| Veil (not a property) | The `overlay/scrim` veil stays outside the piece. Code solves it. |

Defaults of the set: `tamanho=M`, `ações=em linha`, `descrição` on,
`botão fechar` on, `rodapé` on, `mostrar conteúdo` on, `ícone de destaque` off,
both lines off.

Width without the content area: in code, the header text widens the dialog up
to the ceiling of its size. In Figma the text cannot push the width, so the P
demonstrations without the area are shown at the ceiling, `layout/dialog-sm`.
This is the result the code must give, not a fixed width.

Demonstrations in the frame, in light and dark: the same dialog with
`ações=em linha` and `ações=empilhadas`.

## Usage
The component has no code yet; the attributes come with the spec. The frame
shows only the tag, `<nph-dialog></nph-dialog>`, and the import,
`import 'nephos/nph-dialog';`.

## Relations and context
- It always opens over the `overlay/scrim` veil; the veil is not part of the piece.
- The footer combines the solid secondary `nph-button`, in
  `color/secondary-on-dialog`, with a primary or a danger. Color, state and
  focus of the buttons belong to the `nph-button`.
- The close button is the `nph-icon-button` secondary, ghost, compact.
- The `nph-alert-dialog` builds on the `nph-dialog` without the close button.
- Space: `space/overlay-padding` at the edge; `space/stack` between header,
  content and footer; `space/stack-snug` between title and description and
  before the actions; `space/inline-loose` between the buttons.

Demonstration in the frame, in light and dark: the dialog over the veil.

## When to use
- A short task that needs an answer before going on: edit, fill, choose.
- Choose the size by the content, as the width ceiling: P for a choice or a
  short confirmation without a destructive action, M for a short form, G for a
  table, a long list or a two-column form.
- Turn on the highlight icon when the dialog communicates a status: warning,
  info, success or error.
- Turn on the lines with long content, such as a list or a table.
- Use stacked actions on a narrow screen.

Demonstrations in the frame, in light and dark: P with the highlight icon, a
short confirmation with status (`Publicar agora?`, warning); G with the lines
on and a long text (`Termos de uso`).

## Required examples
Each in light and dark mode:

| Example | What it shows |
|---|---|
| Short form in M, the default size (`Editar perfil`) | Title, description, content area and actions. |
| Short confirmation in P, without a destructive action and with the icon (`Enviar para aprovação?`) | Info icon, no content area. |
| Wide content in G, a list, with the lines on (`Importar contatos`) | Content area with a list and both lines. |

## Do
- Write the task or the question in the title, because it is the name the
  screen reader reads.
- Use the secondary in solid with `color/secondary-on-dialog`, because in dark
  the regular secondary disappears on the dialog background.
- Keep the primary last when inline and on top when stacked, because the main
  action is always in the same place.
- Use the primary in `carregando` while the action finishes, because it avoids
  a repeated click.

Demonstration in the frame, in light and dark: solid secondary and the primary
in `carregando` while it publishes.

## Do not
- Do not use outline on the secondary button: use secondary solid, the system
  default.
- Do not use a dialog for a notice that asks for no answer: use a message on the
  page itself.
- Do not open a dialog over another: finish or close the first one.

Each line has a wrong-use demonstration in the frame, in light and dark.

## Tokens taken with this task
Read variable by variable in Figma on 2026-10-21 and on `v/5.0.0` with the same
values:

| Token | Light | Dark |
|---|---|---|
| `layout/dialog-min-width` | `core/layout-width/dialog-min` (320) | same |
| `layout/dialog-sm` | `core/layout-width/dialog-sm` (400) | same |
| `layout/dialog-md` | `core/layout-width/reading` (560) | same |
| `layout/dialog-lg` | `core/layout-width/dialog-lg` (720) | same |
| `layout/dialog-content-sm` | `core/layout-width/dialog-content-sm` (352) | same |
| `layout/dialog-content-md` | `core/layout-width/dialog-content-md` (512) | same |
| `layout/dialog-content-lg` | `core/layout-width/dialog-content-lg` (672) | same |
| `layout/dialog-max-height` | `core/layout-height/dialog-max` (640) | same |
| `space/stack-snug` | `core/space/200` (8) | same |
| `space/inline-loose` | `core/space/400` (16) | same |
| `space/overlay-padding` | `core/space/600` (24) | same |
| `color/dialog-separator` | `core/neutral/100` | `core/surface/500` |
| `color/secondary-on-dialog` | `color/secondary` | `core/surface/800` |

The seven `core/layout-*` primitives above are new as well.

## Source of the acceptance
WORK BRAIN — `03 MEMÓRIA/diario/2026/2026-10-21.md`: visual acceptance, Figma UX
QA approved, documentation accepted and textual audit approved.
