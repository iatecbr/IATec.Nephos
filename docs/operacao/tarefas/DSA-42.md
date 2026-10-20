```json
{
  "id": "DSA-42",
  "goal": "Update the nph-tooltip and the balloon of the nph-label to the new contract accepted in Figma: a balloon for any element, opened on hover and on keyboard focus, and update both specs.",
  "phase": "F4",
  "approved_order": 430,
  "owner": "elvys",
  "state": "ready",
  "piece": "nph-tooltip",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The new nph-tooltip documentation in Figma was accepted by Indiane, with the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-42/documentacao-figma-aceita-2026-10-20.md",
      "result": "passed",
      "verified_at": "2026-10-20",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, CSS, tests, stories, specs and the amended technical decisions P62.6 and P65 pass the proof commands and are merged into v/5.0.0.",
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
    "docs/operacao/evidencias/DSA-42/documentacao-figma-aceita-2026-10-20.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-19.md, Indiane redefined the nph-tooltip: any element, opened on hover and on focus, Esc closes, no touch opening, no hover delay, enter 250 ms and exit 150 ms, four sides with top by default",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-20.md, textual audit approved; the balloon stays open while the pointer is over it; help text never moves into the balloon",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-20.md, Indiane answered D1: the Figma component gets no side property"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1237-5",
    "date": "2026-10-20",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-tooltip documentation board (1241:3), inside the frame 1237:5, was accepted as the new API and behavior specification of the nph-tooltip. No COMPONENT_SET: single COMPONENT 1237:3, with the text property `texto`. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-10-20"
}
```

# DSA-42 — nph-tooltip, the balloon for any element

## Goal
The `nph-tooltip` in `src/components/nph-tooltip/`, and the balloon the
`nph-label` opens, follow the new contract
accepted in Figma: it serves any element, opens on hover and on keyboard focus,
stays open while the pointer is over it and closes with Esc. Its spec, tests and
stories follow the same contract.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate:
`docs/operacao/evidencias/DSA-42/documentacao-figma-aceita-2026-10-20.md`. It
carries the Figma documentation converted to text, with the tokens of each part.
There is no need to open Figma.

## What changes from DSA-08
DSA-08 delivered a balloon that served only the `info` trigger of the
`nph-label` and opened only by click, Enter or Space. The new contract replaces
that rule:

| Before (DSA-08) | Now (this task) |
|---|---|
| Only the `info` icon of the `nph-label` opens it | Any element opens it; every icon-only button carries one with the action name |
| Opens only on trigger activation; never on hover | Opens on hover and on keyboard focus, with no delay |
| The consumer opens, closes and positions it | Closes when the pointer leaves the element and the balloon, on blur or with Esc; stays open while the pointer is over the balloon |
| No position rule | Top by default, flips when it does not fit; may also sit bottom, left or right |
| No motion named | Enters on `motion/enter-duration`, leaves on `motion/exit-duration` |
| The `nph-label` opens it by click, Enter or Space, below the label; hover does not open it | The `nph-label` opens it on hover and on focus of its `info` icon, above the label by default |

The technical decisions P62.6 (the `nph-label` balloon: click, Enter or Space,
no hover, below the label) and P65 (the `role=status` region and the `open`
attribute controlled by the consumer) are amended in `docs/decisoes-tecnicas.md`,
through its change rite, in the pull request of this task.

## Why it is ready
It depends on no other task to be built. Every token it uses is on `v/5.0.0`
with the same value as Figma; no token is created or changed.

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS,
tests, stories, both specs and the amended P62.6 and P65 pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## Decisions answered

| ID | Answer | What the code does |
|---|---|---|
| D1 | The Figma component gets no side property: the balloon has no arrow, so it looks the same on any side, and the side is behavior. | Implements the placement as behavior: top by default, flipping when it does not fit; may also sit bottom, left or right. |

## Relations with other tasks
- DSA-08 (done) holds the current component; this task updates it.
- The `nph-label` keeps opening the balloon from its `info` icon, with its
  `info` and `info-label` attributes; its code and its spec `fichas/nph-label.md`
  change to the new opening and position, in this task.
- The icon-only `nph-button` gets a tooltip with the action name; how other
  elements attach the balloon in code is defined in the spec.

## What this task does not do
It does not create a token or change a token value. It does not change Figma.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, frame `1237:5`, board `1241:3` and component `1237:3`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`, `fichas/nph-tooltip.md` and `fichas/nph-label.md`
- `docs/decisoes-tecnicas.md`, P62.6 and P65
