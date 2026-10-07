```json
{
  "id": "DSA-16",
  "goal": "Implement the nph-input, the one-line field to type or edit a value, with the contract accepted in Figma.",
  "phase": "F4",
  "approved_order": 160,
  "owner": "claude-code",
  "state": "in-progress",
  "piece": "nph-input",
  "dependencies": [
    "DSA-03"
  ],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-input documentation in Figma was accepted by Indiane and recorded as evidence.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-16/figma-docs-accepted-2026-10-02.md",
      "result": "passed",
      "verified_at": "2026-10-02",
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
    "docs/operacao/evidencias/DSA-16/figma-docs-accepted-2026-10-02.md",
    "docs/operacao/evidencias/DSA-16/storybook-validation-2026-10-07.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-07.md, Batch C brought forward to code, one plan and one PR",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-02.md, completion of the nph-input frame (clear focus and default size)",
    "docs/decisoes-tecnicas.md#p69"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1195-532",
    "date": "2026-10-02",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The frame nph-input (1195:532), on the page `NPH — Input`, was accepted as the API and behavior specification of nph-input. COMPONENT_SET: nph-input (622:18359), variants `size` (`default`, `large`) and `state` (`default`, `hover`, `foco`, `erro`, `erro-foco`, `disabled`, `foco-limpar`), default `default` and `default`; booleans start icon, end icon, value text and placeholder text, with icon swaps. Accepted on 01-10-2026, completed on 02-10-2026 (clear focus, 24 × 24 clear target, default as the default size); states renamed on 07-10-2026 without a design change."
  },
  "git_review": {
    "branch": "feat/lote-c-input-checkbox-radio",
    "commit": null,
    "pr": null
  },
  "context": "docs/operacao/contextos/DSA-16.md",
  "updated_at": "2026-10-07"
}
```

# DSA-16 — nph-input, the one-line field to type or edit a value

## Goal
The `nph-input` exists in `src/components/nph-input/`, with tests, stories and a
documentation page in Storybook, in the contract accepted in Figma and recorded in
P69: size, value, placeholder, start icon, the clear button with its own focus, error, disabled and required, in a form.

## How it is proved
**`figma-docs-accepted`** — the `nph-input` frame (`1195:532`) of the Figma file
`DS-IA-NEPHOS 5.0` was accepted by Indiane; the evidence names the frame and the
COMPONENT_SET (`622:18359`). The Figma UX QA and the text audit were approved on
02-10-2026.

**`review-and-merge`** — component, CSS, tests, stories, Storybook documentation,
spec and technical decision pass the proof commands, are reviewed by
`maurocsjr` and merged into `v/5.0.0`. The spec comes after Indiane accepts the
pieces in Storybook.

## What this task does not do
It does not create mask, number or password, a type other than text, a multi-line field, an error message inside the field or the nph-field.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, frame `1195:532` and set `622:18359`
- `design.md` — `control/height-*`, `layout/input-width`, `space/control-padding`, `space/inline`, `space/inline-tight`, `radius/control`, `border/width`, `text/body-md`, `icon/size-sm`, `state/disabled-opacity`, `focus/*` and the colors `color/background`, `color/foreground`, `color/muted`, `color/muted-foreground`, `color/input`, `color/input-hover` and `status/error`
- `docs/decisoes-tecnicas.md` — P69
- `fichas/_modelo.md`
