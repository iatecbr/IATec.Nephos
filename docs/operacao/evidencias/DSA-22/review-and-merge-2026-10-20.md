```json
{
  "task": "DSA-22",
  "gate": "review-and-merge",
  "date": "2026-10-20",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 5dad80e718ce9440eeaee41a93fe0abc5883859e origin/v/5.0.0",
  "exit_code": 0,
  "sha": "6f476e42cf125062263f4c6510eb8a9f9e1f2506",
  "external_origin": null
}
```

# DSA-22 — `review-and-merge`

PR #87 (`claude/dsa-22-nph-togglebutton-60e852`) brought the `nph-togglebutton`,
its CSS, tests, Validation stories, Storybook documentation, spec, generated
Metadata and P73. `elvysmarcos` reviewed and merged it on 19-10-2026, at commit
`6f476e4`, as `component-handoff.md` gives Elvys the review and merge of his own
pull requests. The PR head, `5dad80e`, is an ancestor of the default branch tip.

How the review went: a review was requested from `maurocsjr`, and he did not
give it. The PR has no review and no comment from anyone else. Elvys reviewed
and merged.

## Command

```text
git merge-base --is-ancestor 5dad80e718ce9440eeaee41a93fe0abc5883859e origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `5dad80e` is an ancestor of `v/5.0.0`, checked
against `origin/v/5.0.0` at `f3b28d1a50c5e452f6740c99f78a95711735c32a`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#87](https://github.com/iatecbr/IATec.Nephos/pull/87) | `6f476e4` (2026-10-19T20:56:36Z) | `5dad80e` | `elvysmarcos` |

## Proof commands recorded in the PR

Exit code `0`: `npm run build:tokens` (547 tokens), `test:tokens` (25 checks),
`test` (19 files, 644 tests), `typecheck`, `test:i18n`, `test:operacao`,
`build-storybook` and `git diff --check`.

`npm run test:naming` exits with `1` only on `docs/operacao/tarefas/DSA-34.md`
and `DSA-39.md`, files the PR does not touch.

## Still open

D7 (reduced motion uses `--nph-motion-hover-duration`, the semantic alias with
the same 100 ms value, instead of `core/duration/100`) stays in the task's
`pending_decisions`, with Indiane. P73 records that the D7 answer changes one
declaration in the CSS.
