```json
{
  "id": "DSA-17",
  "goal": "Implement the nph-checkbox, the check box with its own text beside it, with the contract accepted in Figma.",
  "phase": "F4",
  "approved_order": 165,
  "owner": "claude-code",
  "state": "in-progress",
  "piece": "nph-checkbox",
  "dependencies": [
    "DSA-03"
  ],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-checkbox documentation in Figma was accepted by Indiane and recorded as evidence.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-17/figma-docs-accepted-2026-10-01.md",
      "result": "passed",
      "verified_at": "2026-10-01",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, CSS, tests, stories, Storybook documentation, spec and technical decision reviewed by maurocsjr and merged into v/5.0.0.",
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
    "docs/operacao/evidencias/DSA-17/figma-docs-accepted-2026-10-01.md",
    "docs/operacao/evidencias/DSA-17/storybook-validation-2026-10-07.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-07.md, Batch C brought forward to code, one plan and one PR",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-01.md, acceptance of the documentation of the 11 components",
    "docs/decisoes-tecnicas.md#p69"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1194-1033",
    "date": "2026-10-01",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The frame nph-checkbox (1194:1033), on the page `NPH — Checkbox`, was accepted as the API and behavior specification of nph-checkbox. COMPONENT_SET: nph-checkbox (740:18776), variants `marcado` (`false`, `true`, `indeterminado`) and `state` (`default`, `hover`, `foco`, `erro`, `erro-foco`, `disabled`), default `false` and `default`; boolean show label. Accepted on 01-10-2026; states renamed on 07-10-2026 without a design change."
  },
  "git_review": {
    "branch": "feat/lote-c-input-checkbox-radio",
    "commit": null,
    "pr": null
  },
  "context": "docs/operacao/contextos/DSA-17.md",
  "updated_at": "2026-10-07"
}
```

# DSA-17 — nph-checkbox, the check box with its own text beside it

## Goal
The `nph-checkbox` exists in `src/components/nph-checkbox/`, with tests, stories and a
documentation page in Storybook, in the contract accepted in Figma and recorded in
P69: checked, indeterminate, hidden text, error and disabled, in a form.

## How it is proved
**`figma-docs-accepted`** — the `nph-checkbox` frame (`1194:1033`) of the Figma file
`DS-IA-NEPHOS 5.0` was accepted by Indiane; the evidence names the frame and the
COMPONENT_SET (`740:18776`). The Figma UX QA and the text audit were approved on
02-10-2026.

**`review-and-merge`** — component, CSS, tests, stories, Storybook documentation,
spec and technical decision pass the proof commands, are reviewed by
`maurocsjr` and merged into `v/5.0.0`. The spec comes after Indiane accepts the
pieces in Storybook.

## What this task does not do
It does not create a check box group component, a switch, the nph-rich-option, a size or an error message inside the piece.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, frame `1194:1033` and set `740:18776`
- `design.md` — `icon/size-sm`, `radius/inner`, `border/width`, `space/inline`, `space/inline-tight`, `text/label-md`, `state/disabled-opacity`, `state/hover-opacity`, `focus/*` and the colors `color/background`, `color/foreground`, `color/primary`, `color/primary-foreground`, `color/input`, `color/input-hover` and `status/error`
- `docs/decisoes-tecnicas.md` — P69
- `fichas/_modelo.md`
