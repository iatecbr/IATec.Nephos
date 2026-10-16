```json
{
  "id": "DSA-41",
  "goal": "Implement the nph-input-otp, the short code field with one cell per digit, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 420,
  "owner": "elvys",
  "state": "ready",
  "piece": "nph-input-otp",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-input-otp documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-41/documentacao-figma-aceita-2026-10-16.md",
      "result": "passed",
      "verified_at": "2026-10-16",
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
    "docs/operacao/evidencias/DSA-41/documentacao-figma-aceita-2026-10-16.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-16.md, nph-input-otp visual acceptance, Figma UX QA approved, documentation accepted, textual audit approved and the token color/link"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1633-122",
    "date": "2026-10-16",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-input-otp board (1633:122), with its `Documentação` frame, was accepted as the API and behavior specification of the nph-input-otp. COMPONENT_SET 1633:120; cell set nph-input-otp / casa 1633:29. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-10-16"
}
```

# DSA-41 — nph-input-otp, the short code field with one cell per digit

## Goal
The `nph-input-otp` exists in `src/components/nph-input-otp/`, with a spec,
tests and stories, in the contract accepted in Figma.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate:
`docs/operacao/evidencias/DSA-41/documentacao-figma-aceita-2026-10-16.md`. It
carries the Figma documentation converted to text, with the tokens of each part.
There is no need to open Figma.

## Why it is ready
It depends on no other task to be built. Every token it uses is on `v/5.0.0`,
`color/link` included: the new token was taken to `semantic.tokens.json` and to
`design.md` together with this task.

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS,
tests, stories and spec pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## Relations with other tasks
- The `nph-field` (DSA-28) carries the label, the help text and the error of the
  field; the `nph-input-otp` enters it through the control swap.
- The resend button is a ghost `nph-button` (DSA-13, done) used in composition
  below the field; it is not part of this piece.

## What this task does not do
It does not create a token or change a token value. It does not build the resend
button as part of the set. `ocultar dígito` exists on the cell only, not on the
set: the evidence says so.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, board `1633:122`, set `1633:120` and cell set `1633:29`
- `design.md` — the tokens named in the evidence, `color/link` included
- `fichas/_modelo.md`
