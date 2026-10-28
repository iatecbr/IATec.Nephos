```json
{
  "id": "DSA-37",
  "goal": "Make all English prose of the repository American English, checked by cspell set to en-US (P64, amendment of 15/10/2026).",
  "phase": "F4",
  "approved_order": 340,
  "owner": "elvys",
  "state": "in-review",
  "piece": null,
  "dependencies": [
    "DSA-30"
  ],
  "gates": [
    {
      "id": "review-and-merge",
      "description": "cspell runs from an npm script and exits 0, the British spellings are fixed, the proof commands pass and the pull request is merged into v/5.0.0.",
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
    "docs/decisoes-tecnicas.md#p64",
    "docs/operacao/tarefas/DSA-30.md, D8, answered by Indiane on 2026-10-15"
  ],
  "external_origin": null,
  "git_review": {
    "branch": "claude/dsa-37-en-us",
    "commit": null,
    "pr": "https://github.com/iatecbr/IATec.Nephos/pull/133"
  },
  "context": null,
  "updated_at": "2026-10-28"
}
```

# DSA-37 — American English with cspell

## Goal
An npm script runs cspell in `en-US` over the English text of the repository and exits 0; `colour`, `behaviour`, `centre`, `normalises`, `customisation` and `full stop` are gone from the English prose.

## How it is proved
**`review-and-merge`** passes when cspell and its configuration are in the repository, its npm script exits 0 over the code text, the specs, the documentation and `.storybook/i18n/en.json`; `README.md` and `docs/tokens.md` carry their `pt-BR` and `es` pairs, with `npm run i18n:update`; `npm test`, `npm run typecheck`, `npm run test:i18n`, `npm run test:naming`, `npm run test:operacao`, `npm run build-storybook` and `git diff --check` exit 0; and the pull request is merged into `v/5.0.0`.

## What this task does not do
It does not change story IDs, which come from identifiers that were already American. It does not check the `pt-BR` and `es` translations, nor rewrite the historical record, which keeps the text of its time.

## Sources
- `docs/decisoes-tecnicas.md` P64, amendment of 15/10/2026
- `.storybook/i18n/en.json`
- `README.md`, `docs/tokens.md` and their pairs
- `scripts/test-i18n.mjs`, `scripts/language-lib.mjs`
- `docs/operacao/tarefas/DSA-30.md`, D8
