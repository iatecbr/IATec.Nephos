```json
{
  "task": "DSA-23",
  "gate": "review-and-merge",
  "date": "2026-10-21",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor be4f098d5732b2bfbe36f6016cd39cfedebf63a9 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "fceb313820575feaecbaee83e864d4bafe5118fc",
  "external_origin": null
}
```

# DSA-23 — `review-and-merge`

PR #92 (`claude/dsa-23-nph-toggle-group-5f3299`) brought the `nph-toggle-group`,
its CSS, tests, Validation stories, Docs page, spec, generated Metadata and P76,
the six D1 icons in `design.md` and `nph-icon`, and the package check that now
accepts tags with more than one hyphen (`f301e0c`). `elvysmarcos` reviewed and
merged it on 21-10-2026, at commit `fceb313`, as `component-handoff.md` gives
Elvys the review and merge of his own pull requests. The PR head, `be4f098`, is
an ancestor of the default branch tip.

How the review went: a review was requested from `maurocsjr`, and he did not
give it. The first Copilot review, on `daddc11`, found four issues: a click on a
child without `value` broke single selection; duplicate values were checked
together; `selection=" single "` passed after the trim; and `aria-label` and
`aria-labelledby` were not observed. All four were fixed in `be4f098`, a commit
by `copilot-swe-agent` co-authored by Elvys, with four regression tests. Copilot
reviewed as `copilot-pull-request-reviewer` twice (on `daddc11` and on
`be4f098`) and as `copilot-swe-agent` four times, with empty review bodies that
carry the per-comment replies. The last review, on `be4f098`, lists no open
issue and adds two previously missed findings (see "Still open"). Elvys reviewed
and merged.

## Command

```text
git merge-base --is-ancestor be4f098d5732b2bfbe36f6016cd39cfedebf63a9 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `be4f098` is an ancestor of `v/5.0.0`, checked
against `origin/v/5.0.0` at `fceb313820575feaecbaee83e864d4bafe5118fc`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#92](https://github.com/iatecbr/IATec.Nephos/pull/92) | `fceb313` (2026-10-21T22:13:00Z) | `be4f098` | `elvysmarcos` |

## Proof commands recorded in the PR

Exit code `0`: `npm run build:tokens` (547 tokens), `test:tokens` (25 checks),
`test` (23 files, 889 tests), `typecheck`, `test:i18n`, `test:operacao`,
`build-storybook`, `build:lib`, `test:package` (682 checks) and
`git diff --check`.

These were recorded in the PR description, before the Copilot fix in `be4f098`;
that commit added four regression tests, and the merge came after it.

`npm run test:naming` exits with `1` on `scripts/test-package.mjs:180`, which
comes from PR #89 (the only edits this PR makes to that file are lines 255 and
274), and on Portuguese words in the DSA-34, DSA-39, DSA-42 and DSA-43 records,
which the PR does not touch.

## Still open

D4 (what the group does when buttons with text and icon-only buttons are mixed)
and D5 (arrow keys and Tab stops inside the group) stay in the task's
`pending_decisions`, with Indiane. They change no token and do not block the
task.

Two findings from the last Copilot review were missed before the merge and were
not fixed at the merge:

- (a) A child `value` with an inner space (`"bold italic"`) is lost on the
  `join(' ')` round trip of the group's `value` attribute.
- (b) Changing only a child's `value` attribute does not resync the group.

They are being fixed, with regression tests, in a follow-up pull request to
`v/5.0.0`.
