```json
{
  "task": "DSA-24",
  "gate": "review-and-merge",
  "date": "2026-10-20",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor d4bbf089bcb081eb452485c66fbd4c515727c47c origin/v/5.0.0",
  "exit_code": 0,
  "sha": "23a6d87b98c2ae83ea8692abd74102baeb013cbe",
  "external_origin": null
}
```

# DSA-24 — `review-and-merge`

PR #90 (`claude/dsa-24-nph-avatar-9feadc`) brought the `nph-avatar`, its CSS,
tests, Validation stories, Storybook documentation, spec, generated Metadata and
P74. `elvysmarcos` reviewed and merged it on 20-10-2026, at commit `23a6d87`, as
`component-handoff.md` gives Elvys the review and merge of his own pull
requests. The PR head, `d4bbf08`, is an ancestor of the default branch tip.

How the review went: a review was requested from `maurocsjr`, and he did not
give it. Copilot reviewed three times: `copilot-pull-request-reviewer` twice and
`copilot-swe-agent` once, the latter with an empty review body. The first
review, on `7d5bf98`, found that trimming `src` could leave the photo stuck in
the loading state; this was fixed in `cbacfc5`. The last review, on `cbacfc5`,
lists no open issue and adds one previously missed finding: late events from
removed images could hide the current photo. This was fixed in `d4bbf08`, the PR
head; no review came after it. Elvys reviewed and merged.

## Command

```text
git merge-base --is-ancestor d4bbf089bcb081eb452485c66fbd4c515727c47c origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `d4bbf08` is an ancestor of `v/5.0.0`, checked
against `origin/v/5.0.0` at `f3b28d1a50c5e452f6740c99f78a95711735c32a`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#90](https://github.com/iatecbr/IATec.Nephos/pull/90) | `23a6d87` (2026-10-20T19:47:42Z) | `d4bbf08` | `elvysmarcos` |

## Proof commands recorded in the PR

Exit code `0`: `npm run build:tokens`, `test:tokens` (25 checks), `test` (765
tests), `typecheck`, `test:i18n`, `test:operacao`, `build-storybook` and
`git diff --check`.

These were recorded in the PR description, before the Copilot fixes in `cbacfc5` and `d4bbf08`; those commits added regression tests, and the merge came after them.

`npm run test:naming` exits with `1` only on `docs/operacao/tarefas/DSA-34.md`
and `DSA-39.md`, files the PR does not touch.

## Still open

D5 (whether the `use` text in `design.md` is widened for the tokens the avatar
consumes) stays in the task's `pending_decisions`, with Indiane. It changes no
code: the component keeps consuming the same tokens.
