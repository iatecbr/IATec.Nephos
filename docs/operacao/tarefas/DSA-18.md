```json
{
  "id": "DSA-18",
  "goal": "Implement the nph-radio, one exclusive choice inside a group, with the contract accepted in Figma.",
  "phase": "F4",
  "approved_order": 170,
  "owner": "claude-code",
  "state": "in-progress",
  "piece": "nph-radio",
  "dependencies": [
    "DSA-03"
  ],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-radio documentation in Figma was accepted by Indiane and recorded as evidence.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-18/figma-docs-accepted-2026-10-02.md",
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
    "docs/operacao/evidencias/DSA-18/figma-docs-accepted-2026-10-02.md",
    "docs/operacao/evidencias/DSA-18/storybook-validation-2026-10-07.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-07.md, Batch C brought forward to code, one plan and one PR",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-02.md, completion of the nph-radio frame",
    "docs/decisoes-tecnicas.md#p69"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1196-311",
    "date": "2026-10-02",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The frame nph-radio (1196:311), on the page `NPH — Radio`, was accepted as the API and behavior specification of nph-radio. COMPONENT_SET: nph-radio (848:66), variants `marcado` (`false`, `true`) and `state` (`default`, `hover`, `foco`, `erro`, `erro-foco`, `disabled`), default `false` and `default`; boolean show label. Accepted on 01-10-2026, completed on 02-10-2026 (nph-select above five options); states renamed on 07-10-2026 without a design change."
  },
  "git_review": {
    "branch": "feat/lote-c-input-checkbox-radio",
    "commit": null,
    "pr": null
  },
  "context": "docs/operacao/contextos/DSA-18.md",
  "updated_at": "2026-10-07"
}
```

# DSA-18 — nph-radio, one exclusive choice inside a group

## Goal
The `nph-radio` exists in `src/components/nph-radio/`, with tests, stories and a
documentation page in Storybook, in the contract accepted in Figma and recorded in
P69: checked, hidden text, error and disabled, with a single Tab stop per group and the arrows that move and check, in a form.

## How it is proved
**`figma-docs-accepted`** — the `nph-radio` frame (`1196:311`) of the Figma file
`DS-IA-NEPHOS 5.0` was accepted by Indiane; the evidence names the frame and the
COMPONENT_SET (`848:66`). The Figma UX QA and the text audit were approved on
02-10-2026.

**`review-and-merge`** — component, CSS, tests, stories, Storybook documentation,
spec and technical decision pass the proof commands, are reviewed by
`maurocsjr` and merged into `v/5.0.0`. The spec comes after Indiane accepts the
pieces in Storybook.

## What this task does not do
It does not create a radio group component, an indeterminate state, unchecking by a second click, the nph-rich-option or an error message inside the piece.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, frame `1196:311` and set `848:66`
- `design.md` — `icon/size-sm`, `radius/full`, `border/width`, `space/inline`, `space/inline-tight`, `text/label-md`, `state/disabled-opacity`, `state/hover-opacity`, `focus/*` and the colors `color/background`, `color/foreground`, `color/primary`, `color/primary-foreground`, `color/input`, `color/input-hover` and `status/error`
- `docs/decisoes-tecnicas.md` — P69
- `fichas/_modelo.md`
