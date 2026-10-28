```json
{
  "id": "DSA-35",
  "goal": "Give package.json an exports field ./nph-* backed by a JavaScript build in dist/, and add the Usage section with the markup and the import line to every Docs page (P70).",
  "phase": "F4",
  "approved_order": 370,
  "owner": "elvys",
  "state": "done",
  "piece": null,
  "dependencies": [
    "DSA-30"
  ],
  "gates": [
    {
      "id": "review-and-merge",
      "description": "The build, its script, the exports field, the Usage sections and their tests pass the proof commands and are merged into v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-35/review-and-merge-2026-10-28.md",
      "result": "passed",
      "verified_at": "2026-10-28",
      "verified_by": "claude-code"
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "docs/operacao/evidencias/DSA-35/review-and-merge-2026-10-28.md"
  ],
  "decision_refs": [
    "docs/decisoes-tecnicas.md#p70",
    "docs/decisoes-tecnicas.md#p19",
    "docs/operacao/tarefas/DSA-30.md, D2, answered by Indiane on 2026-10-15",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-16.md, Indiane answered D1 of DSA-35"
  ],
  "external_origin": null,
  "git_review": {
    "branch": "claude/amazing-euclid-045eac",
    "commit": "d35f59424f780d79894a61f51f216b927e8435ce",
    "pr": "140"
  },
  "context": null,
  "updated_at": "2026-10-28"
}
```

# DSA-35 — Package exports and the Usage section

## Goal
`import 'nephos/nph-<name>';` resolves to a build in `dist/` that registers the component with its CSS, and every `Docs` page has a Usage section right after API.

## Decisions answered
Indiane answered D1. B1 is closed: PR #84 is merged.

| ID | Answer | What the code does |
|---|---|---|
| D1 | The `nph-skeleton` Docs page shows `<nph-skeleton shape="line"></nph-skeleton>` and `import 'nephos/nph-skeleton';`. The shape is written out, though `line` is the default, because it is the one property of the piece (P69). Claude updated section "6. Usage" of the Figma frame to the same markup. | Shows this markup in the Usage section of the `nph-skeleton` Docs page. It does not show an `aria-busy` container or an avatar shape there. |

## Questions answered by the recommendation
The plan was approved with every question answered as recommended; none needs Indiane.

| ID | Question | Answer applied on 2026-10-28 |
|---|---|---|
| Q1 | `nph-tooltip`: the markup of D2 of DSA-30 (`nph-label` with `info`, importing only `nph-label`) or the standalone tooltip of its sheet? | The sheet. Since D2, P77 gave `nph-tooltip` its own `for`, and `fichas/nph-tooltip.md` shows it next to a `<button id="save">`; the page imports `nph-tooltip`. |
| Q2 | Show a form control alone, with `label`, or inside `nph-field`? | Alone, with `label`: the minimal markup of the piece. The `nph-field` page shows the field with `nph-input`. |
| Q3 | A component that the markup shows and that the page's component does not register: import line or not? | One import line each (`nph-input` under `nph-field`, `nph-button` for `nph-dropdown-menu`); none for a child the component already imports, bare or for its values (`nph-avatar`, `nph-togglebutton`, the `nph-button` of `nph-dialog`, and `nph-option`, which `nph-select` imports as `NphOption`). |
| Q4 | Data that only a property takes (`options`, `items`, `columns` and `rows`): JSON in an attribute? | No. The markup is the tag with its text attributes, and the text of the row says the data comes by property, from JavaScript. |
| Q5 | `nph-chip` shows `<nph-chip></nph-chip>`, the markup of its Figma documentation (`3077:2240`), though `text` is required and a chip without text draws nothing. Change it? | No. P70 asks for the markup of the accepted frame; the page keeps it, now through the `usage` block. |
| Q6 | Where does the proof that the import line registers the component with its CSS run? | At the end of `npm run test:package`, after `npm run build:lib`, in Chromium, and never in `npm test`, since `dist/` is not versioned. The Build stage installs Chromium before it. |

## How it is proved
**`review-and-merge`** passes when an npm script builds `dist/` with `lit` and `@fortawesome/*` outside the build; a test imports each component through `nephos/nph-<name>` and finds it registered with its CSS, `nph-label` included; each `Docs` page shows Usage after API, with the markup of its frame and the package name read from `package.json`; `npm test`, `npm run typecheck`, `npm run test:i18n`, `npm run test:naming`, `npm run test:operacao`, `npm run build-storybook` and `git diff --check` exit 0; and the pull request is merged into `v/5.0.0`.

## What this task does not do
It does not publish the package, change `private`, define a version policy or create the CI workflow (P19, P70). It does not version `dist/`.

## Sources
- `docs/decisoes-tecnicas.md` P19, P70
- `package.json`, `.gitignore`, `README.md`
- `docs/stories.md` §4.10
- `docs/operacao/tarefas/DSA-30.md`, D2, with the markup of the frames
- `src/components/*/`
