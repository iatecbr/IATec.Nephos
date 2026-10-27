```json
{
  "task": "DSA-31",
  "gate": "review-and-merge",
  "date": "2026-10-26",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 3f633ba3aedce3f8ce9c49bf935a44b38d10f319 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "3f2a5e2b5ac5cf3377d64347310bccbb80a17126",
  "external_origin": null
}
```

# DSA-31 — `review-and-merge`

PR #125 (`claude/dsa-31-nph-multi-combobox-4b7aff`) brought `nph-multi-combobox`.
It is the field where the person searches a closed list and picks several options,
shown as chips inside the field. The chip is internal markup. The list is taken
from the `nph-combobox` list module (P95, D2).

The PR amends P91: `nph-option` gets the `marker` property, `check` by default or
`checkbox`. The option sheet, the option Metadata and the option API row of the
`nph-select` Docs page were updated with it.

The PR also brought:

- the CSS and the tests;
- six Validation stories and the Docs page;
- the dictionary in en, pt-BR and es;
- the spec and its generated Metadata;
- P96.

The PR changes no token.

Elvys merged it on 26-10-2026 (27-10-2026 UTC), at commit `3f2a5e2`. The merge
is his because `component-handoff.md` gives Elvys the merge of the pull requests
Claude opens. The PR head, `3f633ba`, is an ancestor of the tip of the
integration branch.

## How the review went

Copilot reviewed; no human code review; merged by Elvys.

No review was requested from a person. Copilot was requested three times, from
2026-10-26T22:44:04Z to 23:00:06Z. It reviewed three heads, as
`copilot-pull-request-reviewer`.

| Reviewed head | Findings | Fixed in |
|---|---|---|
| `367ea9e` | `query` set before the upgrade was lost (not in `static properties`); a click on a link inside the associated label was cancelled; the click listeners on external labels were never removed | `a387e40`, with a regression test for each |
| `a6450b5` | A pointer click on a remove button that already had the keyboard focus was taken for the keyboard; after a choice cleared a filter, the active option was measured before the rows were drawn and could stay out of view | `f3a83b3`, with a regression test for each |
| `f3a83b3` | No finding ("Approval recommended") | — |

Every thread was answered and resolved. Each regression test was seen failing
without its fix.

After the last review, only merges of `v/5.0.0` entered the branch, with no
commit of the PR itself:

- `a6450b5` brought PR #124;
- `9880451` brought PR #126;
- `3f633ba` brought PR #127.

None of them had a conflict.

## Command

```text
git merge-base --is-ancestor 3f633ba3aedce3f8ce9c49bf935a44b38d10f319 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `3f633ba` is an ancestor of `v/5.0.0`. Checked
against `origin/v/5.0.0` at `3f2a5e2b5ac5cf3377d64347310bccbb80a17126`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#125](https://github.com/iatecbr/IATec.Nephos/pull/125) | `3f2a5e2` (2026-10-27T00:48:11Z) | `3f633ba` | `elvysmarcos` |

The merge `3f2a5e2` has two parents, `960b112` and `3f633ba`. Its tree is the
tree of the head.

## Proof commands

Run on the final head `3f633ba`, in sequence. Every one exited with `0`:

| Command | Detail |
|---|---|
| `npm run build:tokens` | |
| `npm run test:tokens` | 25 checks |
| `npm test` | 3847 tests |
| `npm run typecheck` | |
| `npm run test:i18n` | |
| `npm run test:operacao` | |
| `npm run test:naming` | green, with the base of PR #123 |
| `npm run build-storybook` | |
| `npm run build:lib` | |
| `npm run test:package` | 1399 checks, 30 components |
| `git diff --check` | |

On the same head, the Azure pipeline passed: the Build stage, the Test stage and
the overall check.

## Still open

D-1 to D-4 stay in the task's `pending_decisions`, with Indiane, unchanged. They
change no token and do not block the task:

- D-1: where the checkbox sits in the option;
- D-2: the counter mode with nothing chosen;
- D-3: the chip of an option with no icon;
- D-4: where the typed text sits in the counter mode.
