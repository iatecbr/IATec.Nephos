```json
{
  "id": "DSA-85",
  "goal": "Apply in the code the answers Indiane gave on 2026-11-16 on the Figma previews to the pending decisions of DSA-72, DSA-73, DSA-76, DSA-77, DSA-78 and DSA-80 that change the code, so the shipped components match the decided contract.",
  "phase": "F4",
  "approved_order": 840,
  "owner": "elvys",
  "state": "ready",
  "piece": null,
  "dependencies": [
    "DSA-03",
    "DSA-65",
    "DSA-72",
    "DSA-73",
    "DSA-76",
    "DSA-77",
    "DSA-78",
    "DSA-80",
    "DSA-84"
  ],
  "gates": [
    {
      "id": "review-and-merge",
      "description": "Each change in the table of this task is in the code, with tests, stories and specs updated, passes the proof commands and is merged into v/5.0.0.",
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
    "docs/operacao/evidencias/DSA-85/review-and-merge-partial-2026-11-17.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-09.md, Indiane asked for one new task with the code changes instead of reopening the done ones (DSA-70)",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-16.md, Indiane chose the recommended option 1 on the 15 Figma previews (frame 6753:17854, page 988:6952, light and dark) and released recording the answers and opening DSA-84 and DSA-85",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-23.md (15:1x), lot B of the pending decisions of the v1 closing: Indiane answered D-2 in the chat, as recommended, after market research with sources",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-26.md, approval round 3 of the pending items (2026-11-26 08:18): the design owner accepted the recommended option of D-1, after market research with sources",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-26.md, lot N1: with the two offset tokens in the source, the percentage check of test-invariance.mjs fails, and the test script is code, so the fixture comes first from the code owner and the two tokens from Claude after it (T-2 closed)"
  ],
  "external_origin": null,
  "git_review": { "branch": "feat/dsa-85-respostas", "commit": "fbe57196cdaa9835820fa70dabf3224820abf7bf", "pr": "179" },
  "context": "docs/operacao/contextos/DSA-85.md",
  "updated_at": "2026-11-26"
}
```

# DSA-85 — Apply the decisions answered on 2026-11-16 on the Figma previews

## Goal
Each change in the table below is in the code of its piece, with its tests, stories and spec. The answers live in the original tasks, section "Decisions answered on 2026-11-16 on the Figma previews", which stay as they are; this task carries the code work, so no done task is reopened. The previews are in Figma, parent frame `6753:17854` on page `988:6952`, light and dark.

## What changes
| Piece | Source | What the code does |
|---|---|---|
| nph-icon, nph-sidebar, nph-scheduler | DSA-72 D-1, DSA-77 D-2 | nph-icon gains `sidebar` and `repeat`, Font Awesome Light, from the same licensed source as the other Light icons. In Figma both are in nph-icon (`sidebar` `5876:219326`, `repeat` `6791:116`). The collapse button of nph-sidebar and of nph-scheduler draws `sidebar` instead of the skeleton; the recurring event draws `repeat` instead of `rotate-right`. |
| nph-sidebar | DSA-72 D-3 | In the collapsed menu, the rail button of the group that holds the current page shows the active state. |
| nph-stepper, nph-progress | DSA-73 D-3 | On the narrow width, the nph-progress that replaces the stepper shows the error status when a step has an error. |
| nph-stepper | DSA-73 D-5 | The connector follows the status of the steps, not the position: only the line after a completed step takes the brand color; a pending step before the current one keeps a neutral line. |
| nph-sidebar (panel menu) | DSA-76 D-2 | The first-level item chevron turns 180°, like the subgroup, instead of swapping `chevron-down` for `chevron-up`. |
| nph-scheduler | DSA-77 D-3 | The code reads the new tokens instead of deriving the measures: `scheduler/hour-height`, `scheduler/mini-month-cell-size`, `scheduler/list-time-width`, `scheduler/list-time-width-compact` and `scheduler/month-row-min-height` (on `v/5.0.0` with DSA-84). The mini-month cell goes from 28 (`control/height-compact`) to 36 (`control/height-default`), as in Figma. |
| nph-collapsible | DSA-78 D-2 | The preview type hides "Show more" when the text fits in the three lines and nothing is cut. |
| nph-command, token build | DSA-80 D-1 | The panel stays centered until the token exists. The token is in Figma: `command/offset-top` → `core/layout-offset/top`, 16% of the window height. The build has no percentage dimension: make it take one, or say in this task which unit it takes. The build script is code, so this change is the code owner's; the two tokens stay with Claude. Then Claude brings the two tokens to the sources, and the panel opens at that distance from the top instead of centered. |
| docs | All the answers of the previews | In `docs/decisoes-tecnicas.md`, the lines of P115 to P124 that still say a point waits for Indiane are updated for the points answered on the previews, including the ones where the code does not change (DSA-71 D-4, DSA-74 D-3 and D-5, DSA-75 D-2, DSA-77 D-4, DSA-80 D-3). DSA-74 D-1 keeps its wording. |

## Decision answered on 2026-11-23
Indiane answered D-2 in the chat on 2026-11-23, in lot B of the pending decisions of the v1 closing, as recommended, after market research with sources.

| ID | Answer | What the code does |
|---|---|---|
| D-2 | Confirmed: the rail button of a group that holds the current page shows the active look and carries no `aria-current`; the current page inside its flyout panel carries `aria-current="page"`. The group is a button that opens a list, and two current items would confuse a screen reader (https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-current ). | Nothing changes. |

## Decision answered on 2026-11-26
Indiane answered D-1 on 2026-11-26, in the approval round of the pending items, as recommended, after market research with sources.

| ID | Answer | What the code does |
|---|---|---|
| D-1 | Option 3: the narrow stepper bar shows both: the current segment in `progress/segment-background` and the error segment in `progress/segment-background-error`. Carbon gives the error step its own help text (https://carbondesignsystem.com/components/progress-indicator/usage/ ). No market source for current and error together in one bar. | A new property on `nph-progress`; the code owner adds it, with no new token. Figma composes it by overriding the segment colors of the nph-progress instance; no new variant (node 4368:1532). |

## What is left (2026-11-26)
T-2 is closed. On 2026-11-26 Claude read both tokens in Figma (`core/layout-offset/top`, 16, VariableID `6791:109`; `command/offset-top` pointing to it in light and dark, VariableID `6791:115`) and put them in the source of a work copy: the build passes and writes `--nph-core-layout-offset-top: 16%;` and `--nph-command-offset-top: var(--nph-core-layout-offset-top);`. But `npm run test:tokens` fails three checks: "the build accepts a percentage", "a percentage comes out as 16%, with no conversion" and "a px dimension still comes out in rem next to it". The fixture `addDimension` in `scripts/test-invariance.mjs` adds `core.layout-offset.top` itself and adds 1 to `expectedCount`; with the real token in the source, the token is counted once but the count goes up by one, so the copy build stops. The test script is code, so the order is:

1. **Code owner:** the fixture uses a name that does not exist in the source (for example `core.layout-offset.fixture`), in the percentage check and in the `vh` check (including the name that check looks for in the log), with no other change. Create no token. Then move this task to `blocked`, with a blocker owned by `claude`: "bring the two offset tokens".
2. **Claude:** brings `core.layout-offset.top` (`{ "$type": "dimension", "$value": { "value": 16, "unit": "%" } }`) and `command.offset-top` (`{ "$type": "dimension", "$value": "{core.layout-offset.top}" }`), with the counts per layer, and moves this task back to `ready`.
3. **Code owner:** the nph-command panel reads `var(--nph-command-offset-top)` and opens at that distance from the top instead of centered.

## How it is proved
**`review-and-merge`** passes when each row of the table is in the code, with the tests and stories of each piece updated and its spec in `fichas/` saying the same; the proof commands in `docs/operacao/component-handoff.md` exit 0; and the work is merged into `v/5.0.0`.

## What this task does not do
It does not create or change a token: the tokens of DSA-73 D-1 and DSA-77 D-3 are on `v/5.0.0` with DSA-84, and `command/offset-top` comes from Claude after the fixture change (see "What is left"). The dark contrast fix of DSA-84 needs no code: the components read the semantics. It does not change the gate `stroke-style-token` of DSA-74 (D-1 stays open).

## Sources
- `docs/operacao/tarefas/DSA-72.md`, `DSA-73.md`, `DSA-76.md`, `DSA-77.md`, `DSA-78.md` and `DSA-80.md`, sections "Decisions answered on 2026-11-16 on the Figma previews"
- `docs/operacao/tarefas/DSA-84.md`
- `docs/operacao/component-handoff.md`
- `docs/decisoes-tecnicas.md` (P115 to P124)
