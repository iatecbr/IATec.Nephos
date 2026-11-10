```json
{
  "id": "DSA-70",
  "goal": "Apply in the code the answers Indiane gave on 2026-11-09 to the pending decisions of the delivered pieces (lots 1 and 2), so the shipped components match the decided contract.",
  "phase": "F4",
  "approved_order": 690,
  "owner": "elvys",
  "state": "in-review",
  "piece": null,
  "dependencies": [
    "DSA-27",
    "DSA-29",
    "DSA-36",
    "DSA-45",
    "DSA-62",
    "DSA-64",
    "DSA-65",
    "DSA-67",
    "DSA-68",
    "DSA-69"
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
  "pending_decisions": [
    {
      "id": "T-1",
      "question": "The nph-table row of this task changes the value of the token table/link-foreground in dark (theme/brand-200 to color/link, theme/brand-text-dark). The code agent never creates or changes a token (CLAUDE.md, rule 1), so the row is not in the code. Indiane, in Figma, brings the token value to v/5.0.0 (or releases the agent to change it); then the source and the test 'link in dark mode' of nph-table.test.ts change together and the task can close.",
      "decider": "indiane",
      "opened_at": "2026-11-09"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-70/review-and-merge-partial-2026-11-09.md"
  ],
  "decision_refs": [
    "docs/decisoes-tecnicas.md#p114",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-09.md, Indiane answered lot 1 of the pending decisions (Figma frame 5374:10420); tokens on v/5.0.0 (0a27c10)",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-09.md, Indiane answered lot 2 of the pending decisions (approval page of 2026-11-09, Figma frame 5404:10452) and asked for one new task instead of reopening the done ones"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=5404-10452",
    "date": "2026-11-09",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The previews of lot 2 (frame 5404:10452, draft page) and of lot 1 (frame 5374:10420) were answered by Indiane on 2026-11-09. Each answer is written, in text, in the section 'Decisions answered on 2026-11-09' of its own task; the table below lists only the answers that change the code. There is no need to open Figma."
  },
  "git_review": { "branch": "feat/dsa-70-d-itens", "commit": "2984ec2ecaad43884a882d45b8ef8fa791bdb248", "pr": "163" },
  "context": "docs/operacao/contextos/DSA-70.md",
  "updated_at": "2026-11-09"
}
```

# DSA-70 — Apply the answered pending decisions of lots 1 and 2

## Goal
Each change in the table below is in the code of its piece, with its tests, stories and spec. The answers live in the original tasks, which stay `done`; this task carries the code work, so no done task is reopened.

## What changes
| Piece | Source | What the code does |
|---|---|---|
| nph-dropdown-menu | DSA-36 D2 (lot 1) | The checked item of single choice reads `color/primary-text` instead of `color/primary-hover`. The Brands stories of nph-dropdown-menu and nph-sidebar-item drop the contrast exception. |
| nph-navigation-menu | DSA-62 D-4 and D-5 (lot 1) | Closes on `navigation-menu/close-delay` (500 ms); opening keeps `motion/hover-delay`. The Brands story drops the contrast exception. |
| nph-hover-card | DSA-68 D-3 (lot 1) | The trigger link reads `color/link` instead of `color/primary`. The Brands story drops the contrast exception. |
| nph-context-menu | DSA-69 D-3 (lot 1) | Reads `context-menu/long-press-delay` and `context-menu/long-press-tolerance` instead of the literal 700 ms and 10 px. |
| nph-select | DSA-29 D-1 | Disabled: the arrow area drops its `color/accent` background and matches the field; the divider stays. |
| nph-dropdown-menu | DSA-45 D-6 | The pointer over an item moves the keyboard focus to it; the keyboard goes on from there. |
| nph-navigation-menu | DSA-62 D-1 | Narrow width: each trigger is a collapsed row with its arrow; a tap opens its links below it and turns the arrow. |
| nph-navigation-menu | DSA-62 D-3 | The trigger arrow turns 180 degrees when its panel opens; the panel fades in on `motion/enter-*` and out on `motion/exit-*`; with reduced motion nothing moves. |
| nph-button, nph-dialog | DSA-64 D-1 | Inside nph-dialog the solid secondary keeps its own background: the `.panel` rule of `nph-dialog.css` stops redefining `--nph-color-secondary`, `--nph-color-secondary-hover`, `--nph-button-secondary-solid-background`, `--nph-icon-button-secondary-solid-background` and their hovers. `color/secondary-on-dialog` and its hover stay in the tokens. |
| nph-progress | DSA-65 D-1 | The steps type accepts 2 steps or more; the spec says to avoid more than 7. |
| nph-dropdown-menu | DSA-67 D-2 | The open trigger takes the open look of the popover trigger (`button/secondary-solid-background-hover`) and carries `aria-expanded`. |
| nph-popover | DSA-67 D-4 | The title reads `text/heading-sm` instead of `text/label-lg`. |
| nph-hover-card | DSA-68 D-2 | Without the arrow, the card centers on the link; with the arrow, the 16 px rule stays. |
| nph-switch, nph-dropdown-menu | DSA-45 D-4 | nph-switch gains the small size; the item switch slot uses it (spec in DSA-45, section 'D-4: the small nph-switch'). |
| nph-table | Lot 1, item 6 (link of the table) | `table/link-foreground` in dark points to `color/link` (`theme/brand-text-dark`) instead of `theme/brand-200`, as Figma already has it. The token source and the test `link in dark mode` in `nph-table.test.ts` change together, so the suite stays green. |


## Status of the rows
All the rows are in the code, merged into `v/5.0.0` by PR #163 (evidence `review-and-merge-partial-2026-11-09.md`), except the `nph-table` one. That row changes the value of a token in the token source, and the code agent never creates or changes a token, so it waits for Indiane (pending decision `T-1`). The task stays open until the row is in: it does not go to `done` before. The technical choices of the other rows are in P114 (`docs/decisoes-tecnicas.md`). The open items DSA-45 D-3, DSA-62 D-2, DSA-67 D-3 and DSA-69 D-1 and D-2 stay open.

## How it is proved
**`review-and-merge`** passes when each row of the table is in the code, with the tests and stories of each piece updated and its spec in `fichas/` saying the same; the proof commands in `docs/operacao/component-handoff.md` exit 0; and the work is merged into `v/5.0.0`.

## What this task does not do
It does not answer the technical points still open in DSA-45 D-3, DSA-62 D-2, DSA-67 D-3 and DSA-69 D-1 and D-2. It does not create or remove tokens: the tokens of the small nph-switch are already in the token source. It only points `table/link-foreground` in dark to another token.

## Sources
- `docs/operacao/tarefas/DSA-29.md`, `DSA-36.md`, `DSA-45.md`, `DSA-62.md`, `DSA-64.md`, `DSA-65.md`, `DSA-67.md`, `DSA-68.md`, `DSA-69.md`, sections "Decisions answered on 2026-11-09"
- `docs/operacao/tarefas/DSA-27.md`, the nph-switch that gains the small size
- `design.md`
- `docs/operacao/component-handoff.md`
