```json
{
  "id": "DSA-35",
  "goal": "Give package.json an exports field ./nph-* backed by a JavaScript build in dist/, and add the Usage section with the markup and the import line to every Docs page (P70).",
  "phase": "F4",
  "approved_order": 370,
  "owner": "elvys",
  "state": "ready",
  "piece": null,
  "dependencies": [
    "DSA-30"
  ],
  "gates": [
    {
      "id": "review-and-merge",
      "description": "The build, its script, the exports field, the Usage sections and their tests pass the proof commands and are merged into v/5.0.0.",
      "command": null,
      "evidence": null,
      "result": "pending",
      "verified_at": null,
      "verified_by": null
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [],
  "decision_refs": [
    "docs/decisoes-tecnicas.md#p70",
    "docs/decisoes-tecnicas.md#p19",
    "docs/operacao/tarefas/DSA-30.md, D2, answered by Indiane on 2026-10-15",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-16.md, Indiane answered D1 of DSA-35"
  ],
  "external_origin": null,
  "git_review": {
    "branch": null,
    "commit": null,
    "pr": null
  },
  "context": null,
  "updated_at": "2026-10-20"
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
