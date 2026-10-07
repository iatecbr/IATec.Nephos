```json
{
  "id": "DSA-12",
  "goal": "Implement the nph-badge, the badge that labels the state or category of an item, with the contract accepted in Figma.",
  "phase": "F4",
  "approved_order": 130,
  "owner": "claude-code",
  "state": "in-review",
  "piece": "nph-badge",
  "dependencies": ["DSA-03"],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-badge documentation in Figma was accepted by Indiane and recorded as evidence.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-12/documentacao-figma-aceita-2026-10-02.md",
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
    "docs/operacao/evidencias/DSA-12/documentacao-figma-aceita-2026-10-02.md",
    "docs/operacao/evidencias/DSA-12/storybook-validacao-2026-10-05.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-05.md, first-delivery cut (Batch B)",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-02.md, nph-badge without hover"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1196-1100",
    "date": "2026-10-02",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-badge frame (1196:1100) was accepted as the API and behavior specification of the nph-badge. COMPONENT_SET 878:30, variants `tipo` (primary, secondary, info, warn, help, danger, success) and `enfase` (solid, light), default primary and solid; text and optional icon. The acceptance of 01-10-2026 was completed on 02-10-2026 by removing the hover (the badge is not clickable)."
  },
  "git_review": { "branch": "feat/lote-b-badge-button", "commit": null, "pr": "56" },
  "context": null,
  "updated_at": "2026-10-05"
}
```

# DSA-12 — nph-badge, the badge

## Goal
The `nph-badge` exists in `src/components/nph-badge/`, with a spec, tests, stories
and a documentation page in Storybook, in the contract accepted in Figma: a badge
of one or two words that labels the state or category of an item, with type,
emphasis and an optional icon before the text. The badge receives neither click nor
focus.

## How it is proved
**`figma-docs-accepted`** — the `nph-badge` frame (`1196:1100`) of the Figma
file `DS-IA-NEPHOS 5.0` was accepted by Indiane on 01-10-2026 and completed on
02-10-2026 by removing the hover, with the Figma UX QA and the text audit
approved on 02-10-2026. The evidence names the frame and the COMPONENT_SET
(`878:30`).

**`review-and-merge`** — component, CSS, tests, stories, Storybook documentation,
spec and technical decision pass the proof commands, are reviewed by
`maurocsjr` and merged into `v/5.0.0`.

## What this task does not do
It does not create a clickable badge, one with hover, with a count or with only an
icon.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, frame `1196:1100` and set `878:30`
- `design.md` — `text/label-sm`, `radius/full`, `space/control-padding`, `space/inline-tight`, `icon/size-sm` and the colors of `color/*` and `status/*`
- `fichas/_modelo.md`
