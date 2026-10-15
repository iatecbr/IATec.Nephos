```json
{
  "id": "DSA-16",
  "goal": "Implement the nph-input, the one-line field to type or edit a value, with the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 260,
  "owner": "elvys",
  "state": "awaiting-decision",
  "piece": "nph-input",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-input documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-16/documentacao-figma-aceita-2026-10-01.md",
      "result": "passed",
      "verified_at": "2026-10-02",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, CSS, tests, stories and spec pass the proof commands and are merged into v/5.0.0.",
      "command": null,
      "evidence": null,
      "result": "pending",
      "verified_at": null,
      "verified_by": null
    }
  ],
  "blockers": [],
  "pending_decisions": [
    {
      "id": "D1",
      "question": "Which input types does nph-input accept in v1 (text, email, tel, url, search, password, number)? For password, number and mask, what is the anatomy (eye toggle, stepper) and the mask syntax, or are they out of v1?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D2",
      "question": "Is the end icon only the clear action, or swappable, and if swapped what does it do? Does it show always or only with a value? Which tokens size the 24x24 target, its radius and the icon inside it?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D3",
      "question": "Which tokens set the start icon size per size, the icon-to-value gap, the side padding, the value text role (default and large) and the icon color?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D4",
      "question": "Is the focus border and halo focus/border + focus/halo or color/primary + focus/halo? In foco-limpar, which radius does the border and halo around the end target use, and does the container keep its own focus border?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D5",
      "question": "What do erro + hover, erro + foco-limpar and disabled + erro look like, and is the erro border status/error?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D6",
      "question": "Is the default width fluid or layout/input-width? Is there a minimum width?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D7",
      "question": "The evidence sets the start and end icons in style regular, but nph-icon has only light and solid. Which style do the input icons use?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-16/documentacao-figma-aceita-2026-10-01.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1195-532",
    "date": "2026-10-01",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-input frame (1195:532) was accepted as the API and behavior specification of the nph-input. COMPONENT_SET 622:18359. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": {
    "branch": null,
    "commit": null,
    "pr": null
  },
  "context": null,
  "updated_at": "2026-10-14"
}
```

# DSA-16 — nph-input, the one-line text field

## Goal
The `nph-input` exists in `src/components/nph-input/`, with a spec,
tests and stories, in the contract accepted in Figma.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate:
`docs/operacao/evidencias/DSA-16/documentacao-figma-aceita-2026-10-01.md`. It
carries the Figma documentation converted to text. There is no need to open Figma.

## Pending decisions
The evidence gives the container, heights, colors, the disabled state and the purpose of each icon, but not the input types, the end icon rules, the inner measures, the focus tokens, several state combinations, the width or an icon style that exists. Code does not fill these gaps; each answer goes into the evidence of the `figma-docs-accepted` gate, and the task goes back to `ready` when all seven are answered.

| ID | What the evidence gives | What is missing | What the code does with the answer |
|---|---|---|---|
| D1 | Mask, number and password are attributes of `nph-input`, not separate components. | Which types enter v1, and the anatomy and syntax of password, number and mask. | Fixes the list of accepted types and any extra parts. |
| D2 | The end icon clears the value, inside a 24×24 target; default `xmark`, swappable. | Whether it is only the clear action, when it shows, and the tokens of the target and of the icon in it. | Decides whether the end icon is a clear button or a free icon, and its CSS. |
| D3 | Container background, border, heights `default` and `large`. | Start icon size, icon-to-value gap, side padding, value text role and icon color. | Sets padding, gap, typography and icon size and color. |
| D4 | On focus, the border takes the brand color with the halo; in `foco-limpar`, border and halo go around the end icon. | Which tokens are the brand focus color, and the radius around the end target. | Sets the focus border, halo and radii of the container and of the end target. |
| D5 | States `default`, `hover`, `foco`, `foco-limpar`, `erro`, `erro-foco`, `disabled`. | The combinations not drawn, and the error border token. | Sets the precedence of the states in the CSS. |
| D6 | The target is the field itself. | The default and minimum width. | Sets the inline size of the host. |
| D7 | Start and end icons in style `regular`. | `nph-icon` has only `light` and `solid`; `regular` is not installed. | Fixes the variant of the inner icons. |

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS,
tests, stories and spec pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
It does not create a token or change a token value.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, frame `1195:532` and set `622:18359`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
