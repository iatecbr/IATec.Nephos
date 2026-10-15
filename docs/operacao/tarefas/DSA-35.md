```json
{
  "id": "DSA-35",
  "goal": "Give package.json an exports field ./nph-* backed by a JavaScript build in dist/, and add the Usage section with the markup and the import line to every Docs page (P70).",
  "phase": "F4",
  "approved_order": 370,
  "owner": "elvys",
  "state": "awaiting-decision",
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
  "blockers": [
    {
      "id": "B1",
      "what_blocks": "PR #84 (audit/storybook-impeccable) changes src/shared/docs/page.ts, .storybook/ and the dictionaries; starting before its merge means conflicts.",
      "owner": "elvys",
      "what_resolves": "PR #84 merged into v/5.0.0.",
      "opened_at": "2026-10-15"
    }
  ],
  "pending_decisions": [
    {
      "id": "D1",
      "question": "Which Usage markup does the nph-skeleton Docs page show? DSA-30, D2, lists the markup of the frames but not that of nph-skeleton.",
      "decider": "indiane",
      "opened_at": "2026-10-15"
    }
  ],
  "evidence": [],
  "decision_refs": [
    "docs/decisoes-tecnicas.md#p70",
    "docs/decisoes-tecnicas.md#p19",
    "docs/operacao/tarefas/DSA-30.md, D2, answered by Indiane on 2026-10-15"
  ],
  "external_origin": null,
  "git_review": {
    "branch": null,
    "commit": null,
    "pr": null
  },
  "context": null,
  "updated_at": "2026-10-15"
}
```

# DSA-35 — Package exports and the Usage section

## Goal
`import 'nephos/nph-<name>';` resolves to a build in `dist/` that registers the component with its CSS, and every `Docs` page has a Usage section right after API.

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
