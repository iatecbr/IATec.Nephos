```json
{
  "id": "DSA-17",
  "goal": "Implement the nph-checkbox, the checkbox with its own text, with the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 270,
  "owner": "elvys",
  "state": "ready",
  "piece": "nph-checkbox",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-checkbox documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-17/documentacao-figma-aceita-2026-10-01.md",
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
    "docs/operacao/evidencias/DSA-17/documentacao-figma-aceita-2026-10-01.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-19.md, D1 to D4 read from the accepted Figma set; D5 and D6 answered by Indiane"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1194-1033",
    "date": "2026-10-01",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-checkbox frame (1194:1033) was accepted as the API and behavior specification of the nph-checkbox. COMPONENT_SET 740:18776. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": {
    "branch": null,
    "commit": null,
    "pr": null
  },
  "context": null,
  "updated_at": "2026-10-19"
}
```

# DSA-17 — nph-checkbox, the checkbox

## Goal
The `nph-checkbox` exists in `src/components/nph-checkbox/`, with a spec,
tests and stories, in the contract accepted in Figma.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate:
`docs/operacao/evidencias/DSA-17/documentacao-figma-aceita-2026-10-01.md`. It
carries the Figma documentation converted to text. There is no need to open Figma.

## Decisions answered
D1 to D6 are answered; the answers are in the evidence of the
`figma-docs-accepted` gate, section "Decisions answered". D1 to D4 and the
first half of D5 come from the accepted Figma set, read variant by variant;
the second half of D5 and D6 were answered by the design decision of the piece.

| ID | Answer | What the code does |
|---|---|---|
| D1 | The `check` or `minus` icon, light style, at `icon/size-sm` (16), the size of the box. | Sets size and variant of the inner `nph-icon`. |
| D2 | Box fill `color/background`; checked and indeterminate fill `color/primary`. Border `color/input`, `color/input-hover` on hover, `status/error` on error, checked or not. Checked or indeterminate on hover also takes `state/hover-opacity`. Disabled takes `state/disabled-opacity` on the whole piece. Text `color/foreground`. | Writes the color table per state. |
| D3 | Border plus halo: the box border turns `focus/border` and a 24 × 24 halo in `focus/halo` covers the touch area, with `focus/radius-inner` and `focus/ring-width`. With error and focus, the border stays `status/error` and the halo is `focus/halo-error`. | Picks the focus tokens and radii. |
| D4 | Box `icon/size-sm`; the 24 × 24 touch area is the box plus `space/inline-tight` padding on each side. | Sets the box and target sizes from tokens. |
| D5 | `space/inline` is measured from the 24 × 24 area. With text that wraps, the box sits at the top, aligned with the first line. | Sets gap and top alignment. |
| D6 | The text is plain; a link, such as the terms of use, stays outside the piece. | Keeps a plain text property. |

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS,
tests, stories and spec pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
It does not create a token or change a token value. It does not take rich
content in the text.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, frame `1194:1033` and set `740:18776`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
