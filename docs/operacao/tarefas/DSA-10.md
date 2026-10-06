```json
{
  "id": "DSA-10",
  "goal": "Implement the nph-separator, the one-line decorative divider, with the contract accepted in Figma.",
  "phase": "F4",
  "approved_order": 120,
  "owner": "claude-code",
  "state": "done",
  "piece": "nph-separator",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-separator documentation in Figma was accepted by Indiane and recorded as evidence.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-10/documentacao-figma-aceita-2026-10-01.md",
      "result": "passed",
      "verified_at": "2026-10-01",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, CSS, tests, stories, spec and technical decision reviewed by maurocsjr and merged into v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-10/revisao-e-merge-2026-10-06.md",
      "result": "passed",
      "verified_at": "2026-10-06",
      "verified_by": "claude-code"
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "docs/operacao/evidencias/DSA-10/documentacao-figma-aceita-2026-10-01.md",
    "docs/operacao/evidencias/DSA-10/storybook-validacao-2026-10-05.md",
    "docs/operacao/evidencias/DSA-10/revisao-e-merge-2026-10-06.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-05.md, first-delivery cut (Batch A)"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1196-674",
    "date": "2026-10-01",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-separator frame (1196:674) was accepted as the API and behavior specification of the nph-separator. COMPONENT_SET 762:6, `orientacao` variant horizontal|vertical, default horizontal. On 05-10-2026 Indiane approved the cut of the first delivery, with Batch A in one plan and one PR."
  },
  "git_review": { "branch": "feat/lote-a-icon-spinner-separator-kbd", "commit": "6f82829af3439adf650c54bd5002d85bb3198534", "pr": "54" },
  "context": null,
  "updated_at": "2026-10-06"
}
```

# DSA-10 — nph-separator, the divider

## Goal
The `nph-separator` exists in `src/components/nph-separator/`, with a spec, tests
and stories, in the contract accepted in Figma: a `border/width` line in
`color/border`, horizontal or vertical, that fills the container and is hidden from
the screen reader.

## How it is proved
**`figma-docs-accepted`** — the `nph-separator` frame (`1196:674`) of the
Figma file `DS-IA-NEPHOS 5.0` was accepted by Indiane on 01-10-2026, with the Figma
UX QA and the text audit approved. The evidence names the frame and the
COMPONENT_SET (`762:6`).

**`review-and-merge`** — component, CSS, tests, stories, spec and the technical
decision pass the proof commands, are reviewed by `maurocsjr` and
merged into `v/5.0.0`.

## What this task does not do
It does not create a variant with text, thickness or a new color. It does not serve
as a spacer or as a field border.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, frame `1196:674` and set `762:6`
- `design.md` — `border/width`, `color/border`, `layout/separator-*`
- `fichas/_modelo.md`
