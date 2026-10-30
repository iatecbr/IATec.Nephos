```json
{
  "task": "DSA-61",
  "gate": "review-and-merge",
  "date": "2026-10-29",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 4c7697c488ab92aded2389e0cded062553fbba55 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "f98b91268ef8dfcd1c063c824518a7883f7d15cf",
  "external_origin": null
}
```

# DSA-61 — `review-and-merge`

PR #145 (`feat/dsa-61-togglebutton-size-states`) took `nph-togglebutton` and
`nph-toggle-group` to the contract accepted in Figma on 2026-10-29:

- `nph-togglebutton`: the `size` property, `compact`, `default` and `large`, 28, 36 and 44 px
  high, with the icon-only icon at `icon/size-sm`, `icon/size-md` or `icon/size-lg`; the box
  with no background at rest and the `togglebutton/background-hover`,
  `togglebutton/background-checked` and `togglebutton/background-checked-hover` backgrounds,
  replacing the `color/muted` track and the raised inner area; the icon drawn `light` and
  `solid`, solid when checked and on hover; and one icon at most, with `icon-end` now `none`
  by default and both icons on with text as invalid input;
- `nph-toggle-group`: the `size` property, written by the group on every button, including a
  size set on a button after mount;
- the tests, the Sizes story of both Validation pages, the Sizes section of both Docs pages,
  the dictionaries in en, pt-BR and es, both specs and their generated Metadata, the
  amendments of 29/10/2026 to P73 and P76, and the language exception for the Figma property
  `tamanho` in both specs.

The PR changes no token: it consumes the three `togglebutton/*` tokens that came with the task
on `v/5.0.0`. The contrast test measures the label and the icon at 6:1 or more on the
background of each state, in every brand and in both schemes, and pins the known limit of the
checked background on the page, 1.26:1 in light and 1.54:1 in dark.

It was merged on 29-10-2026, at commit `f98b912`, by Elvys's authorization. The PR head,
`4c7697c`, is an ancestor of the tip of the integration branch.

## How the review went

Copilot reviewed; no human code review; merged by Elvys's authorization.

No review was requested from a person. Copilot was requested twice and reviewed as
`copilot-pull-request-reviewer`:

| Requested | Reviewed head | Reviewed | Findings | Fixed in |
|---|---|---|---|---|
| 2026-10-29T17:03:15Z | `7194768` | 17:07:45Z | 1: a `size` set on a button after mount did not go back to the size of the group, because the group observed only `value` | `4c7697c`, with a regression test that fails without the fix |
| 2026-10-29T17:09:32Z | `4c7697c` | 17:12:21Z | No finding ("Approval recommended") | — |

The only thread was answered and resolved with the fix in the PR. No commit entered after the
last review.

## Command

```text
git merge-base --is-ancestor 4c7697c488ab92aded2389e0cded062553fbba55 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `4c7697c` is an ancestor of `v/5.0.0`. Checked against
`origin/v/5.0.0` at `f98b91268ef8dfcd1c063c824518a7883f7d15cf`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#145](https://github.com/iatecbr/IATec.Nephos/pull/145) | `f98b912` (2026-10-29T20:18:25Z) | `4c7697c` | `elvysmarcos` |

## Proof commands

Run on the final head `4c7697c`, in sequence. Every one exited with `0`:

| Command | Detail |
|---|---|
| `npm run build:tokens` | |
| `npm run test:tokens` | |
| `npm test` | 135 files, 5308 tests |
| `npm run typecheck` | |
| `npm run test:i18n` | |
| `npm run test:naming` | |
| `npm run test:spelling` | |
| `npm run test:operacao` | |
| `npm run build-storybook` | |
| `npm run build:lib` | |
| `npm run test:package` | |
| `git diff --check` | |

On the same head, the Azure pipeline (build 612285) passed: the Build stage on its first
attempt, the Test stage on its second attempt, and the overall check. The first Test attempt
failed only on the known Chromium defect of the browser mode: 42 "Failed to fetch dynamically
imported module" errors and one click timeout in the `nph-sidebar-item` docs test, a piece the
PR does not touch. No failure was an assertion. The stage was retried with no code change.

## Still open

Nothing for this task. With DSA-61 `done`, every dependency of DSA-55 is `done`, so its
blocker B4 is closed in the same push.
