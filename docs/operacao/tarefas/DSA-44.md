```json
{
  "id": "DSA-44",
  "goal": "Implement the nph-dialog, the modal window that blocks the page for a short task, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 450,
  "owner": "elvys",
  "state": "ready",
  "piece": "nph-dialog",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-dialog documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-44/documentacao-figma-aceita-2026-10-21.md",
      "result": "passed",
      "verified_at": "2026-10-21",
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
    "docs/operacao/evidencias/DSA-44/documentacao-figma-aceita-2026-10-21.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-21.md, nph-dialog visual acceptance, width that hugs the content, Figma UX QA approved, documentation accepted, textual audit approved and the 20 tokens; the hover token color/secondary-on-dialog-hover was added afterwards"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1368-27",
    "date": "2026-10-21",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-dialog board (1368:27), with its `Documentação` frame (2277:2), was accepted as the API and behavior specification of the nph-dialog. COMPONENT_SET 2268:52262; parts .nph-dialog/destaque 2268:52091 and .nph-dialog/conteúdo 2311:5339. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-10-21"
}
```

# DSA-44 — nph-dialog, the modal window for a short task

## Goal
The `nph-dialog` exists in `src/components/nph-dialog/`, with a spec, tests and
stories, in the contract accepted in Figma.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate:
`docs/operacao/evidencias/DSA-44/documentacao-figma-aceita-2026-10-21.md`. It
carries the Figma documentation converted to text, with the tokens of each part.
There is no need to open Figma.

## Why it is ready
It depends on no other task to be built. Every token it uses is on `v/5.0.0`:
the 21 new tokens (14 semantic and 7 primitives) were taken to the token sources,
to `tokens.css` and to `design.md` together with this task. The footer uses the
`nph-button` (DSA-13, done) and the lines use the `nph-separator` (DSA-10, done).

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS,
tests, stories and spec pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## Relations with other tasks
- The close button is the icon-only `nph-button` in the `nph-icon-button`
  contract (DSA-43, ready). The dialog uses the icon-only button as it is on
  `v/5.0.0`; the circular shape and the tooltip of DSA-43 do not block it.
- The `nph-alert-dialog` builds on the `nph-dialog` without the close button.
  It has no task yet: its Figma acceptance is still open.

## What this task does not do
It does not create a token or change a token value. It does not build the
`nph-alert-dialog`. It does not change Figma.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, board `1368:27`, set `2268:52262` and parts
  `2268:52091` and `2311:5339`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
