```json
{
  "id": "DSA-67",
  "goal": "Implement the nph-popover, the non-modal floating surface anchored to a trigger, in the contract accepted in Figma, write its spec, and move the nph-field error message to the new error text token.",
  "phase": "F4",
  "approved_order": 660,
  "owner": "elvys",
  "state": "ready",
  "piece": "nph-popover",
  "dependencies": [
    "DSA-03",
    "DSA-10",
    "DSA-13",
    "DSA-28",
    "DSA-43",
    "DSA-64"
  ],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-popover documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-67/figma-docs-accepted-2026-11-06.md",
      "result": "passed",
      "verified_at": "2026-11-06",
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
    "docs/operacao/evidencias/DSA-67/figma-docs-accepted-2026-11-06.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-06.md, nph-popover: visual acceptance, Figma UX QA and textual audit approved, documentation accepted, 12 of the 13 points of the approval page approved (soft border token, error text token, 12 between footer actions, 12 between title and content, widths, radius, offset, arrow, compact footer buttons, open trigger, parts of its own) and the popover enters the first version"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=4749-5857",
    "date": "2026-11-06",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-popover documentation frame (4749:5857, page 1626:23) was accepted as the API and behavior specification of nph-popover. Component set: nph-popover (4727:1544), 15 variants. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-11-06"
}
```

# DSA-67 — nph-popover, floating surface anchored to a trigger

## Goal
The `nph-popover` exists in `src/components/nph-popover/`, with a spec, tests and stories, in the contract accepted in Figma: a non-modal surface anchored to a trigger, on four sides and three alignments, with an optional arrow, in three widths, with optional description, body, close button and footer.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-67/figma-docs-accepted-2026-11-06.md`. It carries the Figma documentation converted to text, with the tokens of each part, and the answers to the appendix points. There is no need to open Figma.

## Specification to follow closely
- **Open trigger**: the trigger is a secondary solid nph-button; open, it takes the `hover-active` look and carries `aria-expanded="true"`, with `aria-haspopup` and `aria-controls`. No new nph-button variant.
- **Close and focus**: it closes with Esc, a click outside, the close button or the footer action, and the focus returns to the trigger.
- **Footer**: one divider in `popover/divider`, from edge to edge, then the actions, compact, at `popover/footer-gap` (12). On a touch screen the footer buttons go back to the default size.
- **Size**: `sm`, `md` and `lg` change only the width (`popover/width-sm`, `-md`, `-lg`).
- **Arrow**: optional and off by default; decorative (`aria-hidden`).
- **Clipping**: the surface does not clip its content, so the focus ring of the inner pieces is not cut.

## Changes outside the new piece
- **nph-field**: the error message moves from `--nph-status-error` to `--nph-status-error-text` (`src/components/nph-field/nph-field.css`). Light is unchanged; dark goes from 3.37:1 to 4.69:1 over the popover. Figma already uses the new token in the nph-field set.
- **nph-dialog**: `space/inline-loose` now resolves to 12, so the footer actions move from 16 to 12 apart with no code change. Its tests read the token and need no new value.
- **nph-checkbox demo**: the indent that uses `--nph-space-inline-loose` moves from 16 to 12. If the demo should keep 16, it needs a token of its own; check it.
- **nph-label**: the required asterisk keeps `--nph-status-error`, as `design.md` says (a notice of requirement, not an error). Over the popover in dark it gives 3.37:1; this task does not change it.
- **nph-pagination** and **nph-navigation-menu**: `pagination/group-gap` and `navigation-menu/panel-offset` now point straight to core with the same values (16 and 4); nothing changes on screen.

## Why it is ready
The 19 `popover/*` tokens came with this task and are on `v/5.0.0`, with two new semantic tokens (`color/border-subtle` and `status/error-text`), three new core primitives (`core/layout-width/popover-sm`, `-md` and `-lg`), `core/alpha/white-10`, which Figma had and the code did not, and the new value of `space/inline-loose`. The pieces inside are done: nph-icon (DSA-03), nph-separator (DSA-10), nph-button (DSA-13 and DSA-64), nph-icon-button (DSA-43) and nph-field (DSA-28).

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
It does not create a token or change a token value. It does not put the popover inside a dialog. It does not change Figma.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, page `NPH — Popover` (`1626:23`), documentation frame `4749:5857`
- Component set: nph-popover `4727:1544`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
