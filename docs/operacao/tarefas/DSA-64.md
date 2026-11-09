```json
{
  "id": "DSA-64",
  "goal": "Make the secondary solid and secondary outline nph-button, with text and icon-only (the nph-icon-button of Figma), use the new component tokens, remove the secondary light emphasis, and update the spec, as accepted in Figma.",
  "phase": "F4",
  "approved_order": 630,
  "owner": "elvys",
  "state": "done",
  "piece": "nph-button",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-button and nph-icon-button documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its ten tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-64/figma-docs-accepted-2026-11-04.md",
      "result": "passed",
      "verified_at": "2026-11-04",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "CSS, tests, stories, metadata and spec of nph-button, and the secondary light buttons of nph-table, pass the proof commands and are merged into v/5.0.0.",
      "command": "git merge-base --is-ancestor 6c20ee7d5acfed31a4ef9d71416e5b28766f078c origin/v/5.0.0",
      "evidence": "docs/operacao/evidencias/DSA-64/review-and-merge-2026-11-06.md",
      "result": "passed",
      "verified_at": "2026-11-06",
      "verified_by": "claude-code"
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "docs/operacao/evidencias/DSA-64/figma-docs-accepted-2026-11-04.md",
    "docs/operacao/evidencias/DSA-64/review-and-merge-2026-11-06.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-03.md, secondary light removed from nph-button and nph-icon-button; every secondary light instance becomes secondary solid, the table action cell included",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-04.md, secondary outline and solid colors (decisions 2 and 3), secondary solid as the default of the secondary type, documentation accepted, appendix points answered as recommended",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-09.md, Indiane answered the lot 2 of the pending decisions (approval page of 2026-11-09, Figma frame 5404:10452); code changes in DSA-70"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=4178-15028",
    "date": "2026-11-04",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-button documentation frame (4178:15028, page 312:98) and the nph-icon-button documentation frame (4178:24324, page 2109:51809) were accepted as the specification of nph-button. They replace the boards 1197:5449 and 2122:1591. Component sets: nph-button (461:13009), 225 variants, and nph-icon-button (498:15671), 450 variants, with no secondary light. Converted to text in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": "feat/dsa-64-secondary-buttons", "commit": "6c20ee7", "pr": 148 },
  "context": null,
  "updated_at": "2026-11-09"
}
```

# DSA-64 — nph-button and nph-icon-button, secondary solid and outline tokens, no secondary light

## Goal
In `src/components/nph-button/`:

- **Secondary solid** reads `--nph-button-secondary-solid-background` and `--nph-button-secondary-solid-background-hover` with text, and the `--nph-icon-button-*` pair in the icon only. Today it reads `--nph-color-secondary` and `--nph-color-secondary-hover`.
- **Secondary outline** reads `--nph-button-secondary-outline-border`, `--nph-button-secondary-outline-border-hover` and `--nph-button-secondary-outline-background-hover` with text, and the `--nph-icon-button-*` trio in the icon only. Today the border is `--nph-color-secondary-foreground` with no hover change, and the hover background is `--nph-color-secondary-surface-hover`. The rest background stays `--nph-color-muted`.
- **Secondary light is removed**, with text and in the icon only. `light` stays in primary and danger. `severity="secondary" emphasis="light"` becomes invalid input, handled like the other pairs that do not exist (B1).
- Tests, stories and the spec (`fichas/nph-button.md`) are updated, with the new usage rules: the default of secondary is solid, in state default; Save with Cancel is primary solid with secondary solid; outline is not the default Cancel.

In `src/components/nph-table/`, every secondary light compact button goes to **secondary solid compact**, as Figma did with every secondary light instance, the action cell `2425:1032` included. In `nph-table.ts` there are three: the `button` cell, and in the `mixed-actions` cell both the text button and the icon-only "more" button. Without this change they would get an emphasis that no longer exists. The tests that expect `light` change with them: in `nph-table.test.ts`, the `button` case and the `mixed actions` case.

Other places that still say secondary has `light`, to update in the same change:
- `nph-button.ts`: the header comment on `emphasis` and the valid-pair check, which today knows only the solid-only severities;
- `nph-button.stories.ts` (`exists`) and `nph-button.docs.stories.ts` (`WITH_LIGHT_EMPHASES`);
- `nph-button.test.ts`: the secondary light row of the token matrix;
- `src/shared/metadata/nph-button.json`: the `emphasis` constraint and the `light_secondary` token block;
- `fichas/nph-table.md`: the rows that say "secondary light compact" for the `button` and `mixed-actions` cells, and the "Combines with" paragraph;
- `docs/decisoes-tecnicas.md`: the same two table rows, the B1 rule that lists `secondary` among the severities with `light`, and the line on the ghost and light buttons of the table actions.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-64/figma-docs-accepted-2026-11-04.md`. It carries both documentation frames converted to text, the ten tokens with their light and dark values, and the answers to the appendix points. There is no need to open Figma.

## Why it is ready
The ten tokens came with this task and are on `v/5.0.0`: five `button/secondary-*` and five `icon-button/secondary-*`. No core primitive was added. In each piece, the outline border, the outline border hover and the solid hover point straight to `core/surface/*`, and so does the solid background in light, because the decided values differ from the semantic tokens of the same function (appendix points Pend. 1 and Reg. 3). The solid background in dark is an alias of `color/secondary`, and the outline hover background is an alias of `color/secondary-light-hover`.

## Decisions answered on 2026-11-09 (lot 2)
Indiane answered D-1 on the approval page of 2026-11-09 (Figma frame `5404:10452`, lot 2 of the pending decisions).

| ID | Answer | What the code does |
|---|---|---|
| D-1 | Option 2: no overlay. Inside nph-dialog, the solid secondary uses the same background as outside (`button/secondary-solid-background`, `icon-button/secondary-solid-background` and their hovers); nph-dialog stops redefining them. The label identifies the button. | Changes in DSA-70. |

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
It does not create a token or change a token value. It does not remove `color/secondary-light` or `color/secondary-light-hover`: nph-badge and other pieces use them. It does not change the secondary ghost (DSA-60), the text and icon colors, the focus ring, disabled, loading, or any primary, danger, info, warn, help or success pair. It does not change nph-badge, nph-togglebutton, nph-toggle-group or nph-toolbar. It does not change Figma.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, page `NPH — Button` (`312:98`), documentation frame `4178:15028`, component set nph-button `461:13009`
- Page `NPH — Icon Button` (`2109:51809`), documentation frame `4178:24324`, component set nph-icon-button `498:15671`
- Table action cell `2425:1032`
- `fichas/nph-button.md`
