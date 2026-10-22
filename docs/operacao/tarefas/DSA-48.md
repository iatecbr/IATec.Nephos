```json
{
  "id": "DSA-48",
  "goal": "Adjust the nph-tooltip, its spec and the nph-label balloon to the six rules Indiane approved on 22-10-2026: 300 ms on hover (`motion/hover-delay`), none on focus, Enter and Space leave the balloon alone, only on focusable elements, the balloon as the accessible name of an icon-only button, and, on touch, no visible name on an icon-only button, as an accepted exception.",
  "phase": "F4",
  "approved_order": 480,
  "owner": "elvys",
  "state": "ready",
  "piece": "nph-tooltip",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "Indiane approved the six rules on 22-10-2026 and the nph-tooltip documentation in Figma shows them; recorded as evidence.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-48/figma-docs-accepted-2026-10-22.md",
      "result": "passed",
      "verified_at": "2026-10-22",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, CSS, tests, stories, specs and the affected technical decisions pass the proof commands and are merged into v/5.0.0.",
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
    "docs/operacao/evidencias/DSA-48/figma-docs-accepted-2026-10-22.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-22.md, Indiane approved: keyboard focus opens, Enter runs the action; 300 ms on hover, none on focus; only on focusable elements; on an icon-only button the balloon is the accessible name of the action",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-22.md, Indiane accepted: Enter and Space neither open nor close the balloon; on touch the icon-only button has no visible name, as an exception",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-22.md, Indiane answered D1: create the token; the 300 ms became motion/hover-delay",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1237-5",
    "date": "2026-10-22",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-tooltip documentation in frame 1237:5 and the description of component 1237:3 (no COMPONENT_SET: single COMPONENT 1237:3) were updated with six rules on 22-10-2026. The rules, converted to text, are in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-10-22"
}
```

# DSA-48 — nph-tooltip: hover delay, keyboard and accessible name

## Goal
The `nph-tooltip` delivered by DSA-42 follows the six rules Indiane approved on
22-10-2026. You can tell it exists in Storybook: hovering an icon-only button
opens its balloon after a short wait, tabbing to it opens the balloon at once,
and a screen reader announces the action name once.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate:
`docs/operacao/evidencias/DSA-48/figma-docs-accepted-2026-10-22.md`. It carries
the six rules converted to text, with the Figma node of each. There is no need to
open Figma.

## What changes from DSA-42

| DSA-42 (on v/5.0.0) | Now (this task) |
|---|---|
| Opens on hover with no delay | Opens on hover after `motion/hover-delay` (300 ms); keyboard focus still opens at once |
| The spec names no rule for Enter and Space; in the code, any key press with visible focus restores the focus hold, and, among keys, only Esc closes | Enter and Space run the action and neither open nor close the balloon; it closes when focus leaves, when the pointer leaves the element and the balloon, or with Esc |
| Any element opens it | Only an element that receives focus; a disabled button and loose text get no balloon |
| The balloon is always a description (`aria-describedby`) | On an icon-only button the balloon text is the accessible name of the action, announced once; on other elements it stays a description |
| Touch: never opens | Unchanged; on touch the icon-only button has no visible name, accepted as an exception; an ambiguous action uses a button with text |

How the code gives the icon-only button its name (for example
`aria-labelledby` instead of `aria-describedby`) is a code decision; the rule is
that the name is announced once.

## Effect on DSA-42 decisions
DSA-42 left D2 to D7 open for Indiane. This task does not answer them. Rules 4
and 5 remove the cases behind D7:
- **D7**, first limit (a disabled element may not open the balloon): rule 4
  takes the balloon off disabled buttons.
- **D7**, second limit (the icon-only button read twice): rule 5 makes the
  balloon the accessible name, announced once.

Indiane confirms whether D7 is closed. D2 to D6 stay open in DSA-42. Rule 3 does not answer D6: the `info` icon of
the `nph-label` has no action of its own.

## Why it is ready
DSA-42 is merged into `v/5.0.0`. The only new token, `motion/hover-delay`, comes in
the same pull request as this task, with the same value as Figma.

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS,
tests, stories, `fichas/nph-tooltip.md`, `fichas/nph-label.md` when affected,
and the affected technical decisions pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## Decisions answered

| ID | Answer | What the code does |
|---|---|---|
| D1 | Create the token. The 300 ms became `motion/hover-delay` (`--nph-motion-hover-delay`), an alias of `core/duration/delay`; a single token with no curve, because nothing moves during the wait. | Waits `motion/hover-delay` before opening on hover; keyboard focus does not wait. |

## Relations with other tasks
- DSA-42 (merged) holds the current component; this task adjusts it.
- The `nph-label` opens the balloon from its `info` icon, a focusable button;
  rules 1 to 3 apply to it.
- The icon-only `nph-button` is where rule 5 matters most.

## What this task does not do
It does not create a token or change a token value. It does not change Figma.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, frame `1237:5` and component `1237:3`
- `fichas/nph-tooltip.md` and `fichas/nph-label.md`
- `docs/operacao/tarefas/DSA-42.md`
