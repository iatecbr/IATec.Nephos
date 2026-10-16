```json
{
  "task": "DSA-40",
  "gate": "figma-docs-accepted",
  "date": "2026-10-16",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1463-25260",
    "date": "2026-10-16",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-empty board (1463:25260), on the page `NPH — Empty`, with its `Documentação` frame (2003:688), was accepted as the API and behavior specification of the nph-empty. COMPONENT_SET: none, the piece is a single COMPONENT, nph-empty (1463:25238), with the text properties `título` and `descrição` and the boolean `texto da descrição`. It has no variant."
  }
}
```

# DSA-40 — `figma-docs-accepted`

The documentation of the `nph-empty` board (`1463:25260`) was accepted in Figma,
in the file `DS-IA-NEPHOS 5.0`, with the Figma UX QA and the textual audit
approved. The component needed two new tokens, `scheme/is-light` and
`scheme/is-dark`, which are on `v/5.0.0` with the same values as in Figma.

There is no command output. The acceptance is a human observation, recorded with
the date, the authorship, the board URL and the component.

The rest of this file is the Figma documentation converted to text, so that
whoever codes does not need to open Figma. Figma property names stay as they are
in Figma (Portuguese); the code API is in English (P64).

## Purpose
Empty state of an area with no content: an illustration, a title that says what
is missing and a description that says what to do.

Selection: `nph-empty` — properties `título` and `descrição`, which write the
texts, and `texto da descrição`, which turns the description on or off. The
illustration switches by itself with the color scheme.

## Description
Use it when a list, a search or an area has no content to show, such as the
`nph-combobox` list when the search finds no option. It does not replace
loading, which has its own state, nor the error message, which says what failed.
The piece has no action: it carries no button and no link.

## Anatomy
Shown with `título` "Nenhuma opção encontrada", `descrição` "Confira o que
digitou ou busque outro termo." and `texto da descrição` on.

| Part | Rule |
|---|---|
| 1. Box | Vertical stack that centers everything, padding `space/container-padding` on the four sides and width `layout/input-width`. No background and no border: it uses the background of the piece that receives it. |
| 2. Illustration | Decorative image, centered, drawn at 120 × 87 (the size of the asset, not a token). There is one version per color scheme: the light one shows with `scheme/is-light` and the dark one with `scheme/is-dark`. |
| 3. Title | Says what is missing, in `text/heading-xs` and `color/foreground`. Always present. It sits `space/section` from the illustration. |
| 4. Description (optional) | Says what the person can do, in `text/body-sm` and `color/muted-foreground`. Turned on by `texto da descrição`. It sits `space/inline-tight` from the title. |

The title and the description form one text group, `space/inline-tight` apart;
between the illustration and that group the gap is `space/section`.

### Illustration, by color scheme

| Scheme | `scheme/is-light` | `scheme/is-dark` | Asset shown |
|---|---|---|---|
| light | `1` (true) | `0` (false) | `Ilustracao-empty-nenhuma-opcao-encontrada.png` |
| dark | `0` (false) | `1` (true) | `Ilustracao-empty-nenhuma-opcao-encontrada-dark.png` |

In Figma both are BOOLEAN variables of the semantic collection; in the
repository they are `number` tokens, `1` for true and `0` for false, one value
per scheme (`--nph-scheme-is-light`, `--nph-scheme-is-dark`). The two asset
files come with the message that sends this task.

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | The title and the description pass 4.5:1 on `color/background` and on `color/popover`, in light and dark. |
| Visible focus | Does not apply: the piece takes no focus, because it has no action. |
| Color is not the only signal | The message is in the text of the title. The illustration only reinforces what the text says. |
| Touch target | Does not apply: the piece has no clickable part. |
| Accessible name | The screen reader reads the title and the description. The illustration is decorative and stays out of the reading, with `aria-hidden`. |

Demonstrations in the frame, in light and dark: title and description (both pass
contrast); title only (the message stays in the text).

## Properties, variants and states

| Figma property | Rule |
|---|---|
| `título` | Required text. Says what is missing, such as "Nenhuma opção encontrada". |
| `descrição` | Text that says what to do, such as "Confira o que digitou ou busque outro termo.". |
| `texto da descrição` | Boolean, on by default. Off, only the title remains, when there is nothing to suggest. |
| Illustration (not a property) | It switches by itself with the color scheme, through `scheme/is-light` and `scheme/is-dark`. It is not chosen by hand. |
| Action (not a property) | The piece has no button and no link. |

Demonstrations in the frame, in light and dark: `texto da descrição` on, the
default; `texto da descrição` off, title only.

## Usage
Code: `<nph-empty></nph-empty>`. Import: `import 'nephos/nph-empty';`. The
attributes come with the spec.

## Relations and context
- In `nph-combobox`, the list in `state=vazio` uses the `nph-empty` when the
  search finds no option.
- The piece that receives the `nph-empty` controls the background and the
  position. The `nph-empty` controls only its own inner space.
- While the options load, the `nph-combobox` list uses `state=carregando`, not
  the `nph-empty`.
- Space: `space/section` between the illustration and the texts,
  `space/inline-tight` between the title and the description and
  `space/container-padding` as inner padding.

Demonstration in the frame, in light and dark: the `nph-combobox` list in
`state=vazio`.

## When to use
- List or search with no result: the title says what is missing and the
  description suggests another search.
- Area still without content: the title says what is missing.
- Nothing to suggest: turn off `texto da descrição` and leave only the title.
- Content loading: use the loading state of the piece that receives the
  `nph-empty`, such as `state=carregando` in the `nph-combobox` list.

Demonstrations in the frame, in light and dark: search with no result (title and
suggestion); nothing to suggest (title only).

## Required examples
Each in light and dark mode:

| Example | What it shows |
|---|---|
| Search with no result in the `nph-combobox` list | The list in `state=vazio`, with the `nph-empty` inside. |
| With description | What is missing and what to do. |
| Title only | `texto da descrição` off, when there is nothing to suggest. |

## Do
- Write the title as what is missing, such as "Nenhuma opção encontrada",
  because the person understands at once why the area is empty.
- Use the description to say what to do, such as "Confira o que digitou ou
  busque outro termo.", because the empty state becomes a next step.
- Let the illustration switch with the color scheme, because each version was
  made for its background.
- Keep `space/section` between the illustration and the texts, because the image
  needs room.

## Do not
- Do not write a vague title, such as "Vazio": say what is missing, such as
  "Nenhuma opção encontrada".
- Do not repeat the title in the description: use the description to say what
  to do, or turn off `texto da descrição`.
- Do not use the `nph-empty` while the options load: in the `nph-combobox`
  list, use `state=carregando`.

Each line has a wrong-use demonstration in the frame, in light and dark.

## Source of the acceptance
WORK BRAIN — `03 MEMÓRIA/diario/2026/2026-10-16.md`: visual acceptance, Figma UX
QA approved, documentation board accepted, textual audit approved, and the names
`scheme/is-light` and `scheme/is-dark` for the two color scheme variables.
