```json
{
  "id": "DSA-16",
  "goal": "Implement the nph-input, the one-line field to type or edit a value, with the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 260,
  "owner": "elvys",
  "state": "ready",
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
  "pending_decisions": [],
  "evidence": [
    "docs/operacao/evidencias/DSA-16/documentacao-figma-aceita-2026-10-01.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-16.md, Indiane answered D1 to D7 of the nph-input"
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
  "updated_at": "2026-10-16"
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

## Decisions answered
D1 to D7 are answered; the answers and the measures read from Figma are in the
evidence of the `figma-docs-accepted` gate, sections "Measures and tokens" and
"Decisions answered".

| ID | Answer | What the code does |
|---|---|---|
| D1 | v1 accepts `text`, `email`, `tel`, `url` and `search`. Password, number and mask are out of v1. | Accepts only these five types, with no extra parts. |
| D2 | The end icon always clears the value; swapping changes only the art. It shows only with a value. | Renders the end icon as a clear button, hidden when the value is empty. |
| D3 | `icon/size-sm`, `space/inline`, `space/control-padding`, `text/body-md` in both sizes, icons in `color/muted-foreground`. | Sets padding, gap, typography and icon size and color. |
| D4 | `focus/border` + `focus/halo`; in `foco-limpar`, `focus/border-radius-control` and `focus/radius-control-with-border` around the end target; the container keeps `color/input`. | Sets the focus border, halo and radii of the container and of the end target. |
| D5 | Error border `status/error`. `erro` + `hover` keeps `status/error`. `erro` + `foco-limpar`: container `status/error`, end target with the usual focus. `disabled` + `erro`: disabled wins. | Sets the precedence of the states in the CSS. |
| D6 | Default `layout/input-width`; it may stretch to its container; no minimum. | Sets the inline size of the host. |
| D7 | Icons in style `light`. | Uses the `light` variant of the inner icons. |

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
