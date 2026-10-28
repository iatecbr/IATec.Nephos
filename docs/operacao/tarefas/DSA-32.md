```json
{
  "id": "DSA-32",
  "goal": "Make the Storybook accessibility addon run inside the tests with the WCAG 2.2 AA rules, so that a violation in any story fails the run (P72).",
  "phase": "F4",
  "approved_order": 330,
  "owner": "elvys",
  "state": "in-review",
  "piece": null,
  "dependencies": [
    "DSA-30"
  ],
  "gates": [
    {
      "id": "review-and-merge",
      "description": "The addon and the Storybook Vitest integration are in package.json, every story runs with the WCAG 2.2 AA rules, the violations found are fixed, the proof commands pass and the pull request is merged into v/5.0.0.",
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
    "docs/decisoes-tecnicas.md#p72",
    "docs/decisoes-tecnicas.md#p19",
    "docs/operacao/tarefas/DSA-30.md, D3, answered by Indiane on 2026-10-15"
  ],
  "external_origin": null,
  "git_review": {
    "branch": "claude/dsa-32-a11y-gate-7539cc",
    "commit": null,
    "pr": null
  },
  "context": null,
  "updated_at": "2026-10-28"
}
```

# DSA-32 — Accessibility gate in the tests

## Goal
`npm test` runs every story, `Validation` and `Docs`, with the Storybook accessibility addon and the WCAG 2.2 AA rules, and fails on a violation.

## How it is proved
**`review-and-merge`** passes when `@storybook/addon-a11y` and `@storybook/addon-vitest` are in `package.json`, with the versions table of `AGENTS.md` updated in the same pull request; `npm test` runs the stories and exits 0; the pull request shows that a story with a deliberate violation fails the run; `npm run build:tokens`, `npm run test:tokens`, `npm run typecheck`, `npm run test:i18n`, `npm run test:naming`, `npm run test:operacao`, `npm run build-storybook` and `git diff --check` exit 0; and the pull request is merged into `v/5.0.0`.

## What this task does not do
It does not define interaction tests or create the CI workflow (P19). It does not open an accessibility exception: an exception is a human decision, recorded in the story as `docs/stories.md`, §2.3, says. It does not change a token; a contrast failure that comes from a token goes to Indiane.

## Sources
- `docs/decisoes-tecnicas.md` P19, P72
- `docs/stories.md` §2.3, §4.1
- `package.json`, `vitest.config.ts`
- `.storybook/main.js`, `.storybook/preview.js`
- `AGENTS.md`, "Versions in use"
