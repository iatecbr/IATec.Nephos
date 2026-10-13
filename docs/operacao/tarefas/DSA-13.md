```json
{
  "id": "DSA-13",
  "goal": "Implement the nph-button, the button that triggers an action identified by text, with the icon-only set, in the contract accepted in Figma.",
  "phase": "F4",
  "approved_order": 135,
  "owner": "claude-code",
  "state": "done",
  "piece": "nph-button",
  "dependencies": ["DSA-03", "DSA-09"],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-button documentation in Figma, with the icon-only set, was accepted by Indiane and recorded as evidence.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-13/documentacao-figma-aceita-2026-10-02.md",
      "result": "passed",
      "verified_at": "2026-10-02",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, CSS, tests, stories, Storybook documentation, spec and technical decision reviewed by maurocsjr and merged into v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-13/review-and-merge-2026-10-08.md",
      "result": "passed",
      "verified_at": "2026-10-08",
      "verified_by": "claude-code"
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "docs/operacao/evidencias/DSA-13/documentacao-figma-aceita-2026-10-02.md",
    "docs/operacao/evidencias/DSA-13/storybook-validacao-2026-10-05.md",
    "docs/operacao/evidencias/DSA-13/review-and-merge-2026-10-08.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-05.md, first-delivery cut (Batch B)",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-02.md, solid hover in the hover tokens",
    "WORK BRAIN — 02 PROJETOS/DS-Agentico/Registro de decisões — Nephos.md, B1 a B6"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1197-5449",
    "date": "2026-10-02",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-button frame (1197:5449) was accepted as the API and behavior specification of the nph-button. COMPONENT_SET 461:13009 (with text) and COMPONENT_SET 498:15671 (icon-only), variants `tipo`, `enfase`, `size` and `state`, with a start icon and an end icon. The acceptance of 01-10-2026 was completed on 02-10-2026 by the solid hover in the hover tokens, which supersedes B4."
  },
  "git_review": { "branch": "feat/lote-b-badge-button", "commit": "d02c7ea988223e0a5f5fe73dfeb8acc58d533a4c", "pr": "56" },
  "context": null,
  "updated_at": "2026-10-08"
}
```

# DSA-13 — nph-button, the button

## Goal
The `nph-button` exists in `src/components/nph-button/`, with a spec, tests,
stories and a documentation page in Storybook, in the contract accepted in Figma:
type, emphasis, size and state, an optional icon at the start and at the end, the
icon-only button and the loading state with the spinner of the `nph-spinner`.

## Dependency
The loading state uses the `nph-spinner` (DSA-09). Blocker B1 closed when PR #54
was merged (`d01da7b`, 2026-10-06), before PR #56 brought this task.

## How it is proved
**`figma-docs-accepted`** — the `nph-button` frame (`1197:5449`) of the Figma
file `DS-IA-NEPHOS 5.0` was accepted by Indiane on 01-10-2026 and completed on
02-10-2026 by the solid hover in the hover tokens, with the Figma UX QA and the
text audit approved on 02-10-2026. The evidence names the frame and the
COMPONENT_SETs (`461:13009` and `498:15671`).

**`review-and-merge`** — component, CSS, tests, stories, Storybook documentation,
spec and technical decision pass the proof commands, are reviewed by
`maurocsjr` and merged into `v/5.0.0`.

## What this task does not do
It does not create a link that looks like a button, form submission, a button
group, or a size, type or emphasis outside the accepted matrix.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, frame `1197:5449` and sets `461:13009` and `498:15671`
- `design.md` — `control/height-*`, `space/control-padding`, `space/inline-tight`, `radius/control`, `text/label-md`, `icon/size-*`, `state/disabled-opacity`, `focus/*` and the colors of `color/*` and `status/*`
- `fichas/_modelo.md`
