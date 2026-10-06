```json
{
  "id": "DSA-09",
  "goal": "Implement the nph-spinner, the waiting spinner with no end time, with the contract accepted in Figma.",
  "phase": "F4",
  "approved_order": 115,
  "owner": "claude-code",
  "state": "done",
  "piece": "nph-spinner",
  "dependencies": ["DSA-03"],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-spinner documentation in Figma was accepted by Indiane and recorded as evidence.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-09/documentacao-figma-aceita-2026-10-01.md",
      "result": "passed",
      "verified_at": "2026-10-01",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, CSS, tests, stories, spec and technical decision reviewed by maurocsjr and merged into v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-09/revisao-e-merge-2026-10-06.md",
      "result": "passed",
      "verified_at": "2026-10-06",
      "verified_by": "claude-code"
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "docs/operacao/evidencias/DSA-09/documentacao-figma-aceita-2026-10-01.md",
    "docs/operacao/evidencias/DSA-09/nph-icon-revalidado-2026-10-05.md",
    "docs/operacao/evidencias/DSA-09/storybook-validacao-2026-10-05.md",
    "docs/operacao/evidencias/DSA-09/revisao-e-merge-2026-10-06.md"
  ],
  "decision_refs": [
    "docs/decisoes-tecnicas.md#p21",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-05.md, first-delivery cut (Batch A)"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1195-22210",
    "date": "2026-10-01",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-spinner frame (1195:22210) was accepted as the API and behavior specification of the nph-spinner. COMPONENT_SET 281:11, size variant sm|md, default sm. On 05-10-2026 Indiane approved the cut of the first delivery, with Batch A (icon, spinner, separator, kbd) in one plan and one PR."
  },
  "git_review": { "branch": "feat/lote-a-icon-spinner-separator-kbd", "commit": "6f82829af3439adf650c54bd5002d85bb3198534", "pr": "54" },
  "context": null,
  "updated_at": "2026-10-06"
}
```

# DSA-09 — nph-spinner, the spinner

## Goal
The `nph-spinner` exists in `src/components/nph-spinner/`, with a spec, tests and
stories, in the contract accepted in Figma: the `circle-notch` of the `nph-icon`
spinning at `motion/loop-*`, in sizes `sm` and `md`, stopped under reduced motion.

## How it is proved
**`figma-docs-accepted`** — the `nph-spinner` frame (`1195:22210`) of the
Figma file `DS-IA-NEPHOS 5.0` was accepted by Indiane on 01-10-2026, with the Figma
UX QA and the text audit approved. The evidence names the frame and the
COMPONENT_SET (`281:11`).

**`review-and-merge`** — component, CSS, tests, stories, spec and the technical
decision pass the proof commands, are reviewed by `maurocsjr` and
merged into `v/5.0.0`.

The evidence `nph-icon-revalidado-2026-10-05.md` records that the `nph-icon`, which
the spinner consumes, matches the accepted Figma.

## What this task does not do
It does not change the `nph-icon`. It does not put the spinner inside the
`nph-button` (Batch B). It does not create an `lg` size, a new token or a
known-progress indicator.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, frame `1195:22210` and set `281:11`
- `design.md` — `motion/loop-duration`, `motion/loop-easing`, `icon/size-*`
- `docs/decisoes-tecnicas.md` — P21
- `fichas/_modelo.md`, `fichas/nph-spinner.md`
