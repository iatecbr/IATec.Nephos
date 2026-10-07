```json
{
  "id": "DSA-11",
  "goal": "Implement the nph-kbd, the static key of a keyboard shortcut, with the contract accepted in Figma.",
  "phase": "F4",
  "approved_order": 125,
  "owner": "claude-code",
  "state": "done",
  "piece": "nph-kbd",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-kbd documentation in Figma was accepted by Indiane and recorded as evidence.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-11/documentacao-figma-aceita-2026-10-01.md",
      "result": "passed",
      "verified_at": "2026-10-01",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, CSS, tests, stories, spec and technical decision reviewed by maurocsjr and merged into v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-11/revisao-e-merge-2026-10-06.md",
      "result": "passed",
      "verified_at": "2026-10-06",
      "verified_by": "claude-code"
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "docs/operacao/evidencias/DSA-11/documentacao-figma-aceita-2026-10-01.md",
    "docs/operacao/evidencias/DSA-11/storybook-validacao-2026-10-05.md",
    "docs/operacao/evidencias/DSA-11/revisao-e-merge-2026-10-06.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-02.md, a combination is one piece per key",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-05.md, first-delivery cut (Batch A)"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1193-20",
    "date": "2026-10-01",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-kbd frame (1193:20) was accepted as the API and behavior specification of the nph-kbd. COMPONENT_SET: none; single COMPONENT 772:3, with the text property `tecla`. On 05-10-2026 Indiane approved the cut of the first delivery, with Batch A in one plan and one PR."
  },
  "git_review": { "branch": "feat/lote-a-icon-spinner-separator-kbd", "commit": "6f82829af3439adf650c54bd5002d85bb3198534", "pr": "54" },
  "context": null,
  "updated_at": "2026-10-06"
}
```

# DSA-11 — nph-kbd, the key

## Goal
The `nph-kbd` exists in `src/components/nph-kbd/`, with a spec, tests and stories,
in the contract accepted in Figma: a static key, written as text, in `color/muted`
with a `color/border` border. A combination joins one piece per key.

## How it is proved
**`figma-docs-accepted`** — the `nph-kbd` frame (`1193:20`) of the Figma file
`DS-IA-NEPHOS 5.0` was accepted by Indiane on 01-10-2026, with the Figma UX QA and
the text audit approved. The evidence names the frame and declares that there is no
COMPONENT_SET: the component is single (`772:3`).

**`review-and-merge`** — component, CSS, tests, stories, spec and the technical
decision pass the proof commands, are reviewed by `maurocsjr` and
merged into `v/5.0.0`.

## What this task does not do
It does not create interaction, focus, a style variant or a combination in a single
piece.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, frame `1193:20` and component `772:3`
- `design.md` — `text/label-sm`, `color/muted`, `color/muted-foreground`,
  `color/border`, `border/width`, `radius/inner`, `space/inline-tight`
- `fichas/_modelo.md`
