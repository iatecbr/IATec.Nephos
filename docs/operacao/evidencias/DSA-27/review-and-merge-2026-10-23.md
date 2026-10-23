```json
{
  "task": "DSA-27",
  "gate": "review-and-merge",
  "date": "2026-10-23",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor dacd832cfc195ef8166f03d4e433cba244358970 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "3cc458132343570b90de852052abc15822e41e20",
  "external_origin": null
}
```

# DSA-27 — `review-and-merge`

PR #108 (`claude/dsa-27-nph-switch-1ea737`) brought `nph-switch`, the switch that turns a
setting on or off with an immediate effect. It came with its CSS and tests, six Validation
stories, the Docs page, the dictionary in en, pt-BR and es, the spec and its generated
Metadata, and P79, which records the API and the semantics of the piece. The PR changes no
token. Elvys merged it on 23-10-2026, at commit `3cc4581`. The PR head, `dacd832`, is an
ancestor of the integration branch tip.

How the review went: Copilot reviewed; no human code review; merged by Elvys.

No human reviewer was requested, under the wave's rule that Copilot reviews. Copilot was
requested three times, from 2026-10-23T21:11:07Z to 21:24:34Z, and reviewed three times as
`copilot-pull-request-reviewer`. The other reviews on the PR, by `elvysmarcos`, carry the
replies to Copilot's threads.

| Reviewed head | Findings | Answer |
|---|---|---|
| `b3be4d8` | A label with a word longer than the available width overflowed the piece; inside a disabled `<fieldset>` around an `nph-field`, the switch stayed focusable and toggled | Fixed in `4cf7cc9`: the text breaks with `overflow-wrap: anywhere`, and the switch reads a disabled fieldset around it, except inside its first `<legend>`, as `nph-field` and `nph-input` do (P83, item 4). Regression tests for both, also with the real `nph-field` |
| `4cf7cc9` | Approval recommended; one issue in code that had not changed: the "two lines" row caption of the Label story was visible text outside the dictionary | Fixed in `dacd832`: the caption comes from `switchValidation.twoLines` in the three languages, with a regression test |
| `dacd832` | No open issue; approval recommended | — |

Every thread was answered in Portuguese and resolved. Between the reviews, the branch merged
`v/5.0.0` at `0c56f6d` (PR #103); the only conflict was in `docs/decisoes-tecnicas.md`,
resolved keeping the entries of the other tasks (P78, P80, P83, P84, P86, P90). Before the PR,
after the merge of PR #105, P79 was aligned with the item numbers of P83 and tests with the real
`nph-field` were added.

## Command

```text
git merge-base --is-ancestor dacd832cfc195ef8166f03d4e433cba244358970 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `dacd832` is an ancestor of `v/5.0.0`, checked against
`origin/v/5.0.0` at `3cc458132343570b90de852052abc15822e41e20`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#108](https://github.com/iatecbr/IATec.Nephos/pull/108) | `3cc4581` (2026-10-23T21:42:34Z) | `dacd832` | `elvysmarcos` |

The merge `3cc4581` has two parents, `59f1fd5` and `dacd832`. The PR head lacked only
`59f1fd5`, a `chore(operacao)` commit that touches `docs/operacao/` alone and does not
conflict.

## Proof commands

Run on the final head `dacd832`. These exited with `0`:

| Command | Detail |
|---|---|
| `npm run build:tokens` | no diff in `src/tokens` |
| `npm run test:tokens` | 25 checks |
| `npm test` | 1939 tests; 159 of `nph-switch` |
| `npm run typecheck` | |
| `npm run test:i18n` | |
| `npm run test:operacao` | 48 tasks |
| `npm run build-storybook` | |
| `npm run build:lib` | |
| `npm run test:package` | 880 checks, 18 components |
| `git diff --check origin/v/5.0.0...HEAD` | |

`npm run test:naming` exits with `1` on `scripts/test-package.mjs` and on Portuguese words in
`docs/operacao/` records. The result is the same as on the base, and none of those files is in
the diff of the PR.

## Still open

D5 and D6 stay in the task's `pending_decisions`, with Indiane, unchanged. They change no
token and do not block the task:

- D5: how a one-line label aligns with the track (the code aligns the tops).
- D6: whether the fill follows the hover while there is an error (the code follows it, and
  the outline stays `status/error`).

Recorded in P79 as known limits: a forced-colors mode and a right-to-left page are not handled
yet; the error sentence outside the piece cannot be tied to it by `aria-describedby` across the
shadow root; a `<legend>` inserted or removed before the one that holds the piece does not
recompute its state until the next update, as in `nph-field` (P83).
