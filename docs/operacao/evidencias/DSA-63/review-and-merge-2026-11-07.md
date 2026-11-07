```json
{
  "task": "DSA-63",
  "gate": "review-and-merge",
  "date": "2026-11-07",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 28ffd51fc91a445ffa0532ceda8bd70eefd47b19 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "0b3df5e5d6f483ab51ebc5218005fa4276e20142",
  "external_origin": null
}
```

# DSA-63 — `review-and-merge`

PR #150 (`feat/dsa-63-notification`) implemented `nph-notification` in the contract accepted in Figma on
2026-11-04 (documentation frame `3442:10163`, set `3434:9035`, focus of the close on solid `4207:1146`):

- the placements `inline` and `toast`, the severities `info`, `success`, `warning`, `error`, `help`,
  `neutral` and `loading`, the emphases `subtle` and `solid`, the layouts `stacked` and `single-line`
  with the reflow to stacked, the optional `heading`, the `action` and `secondary-action`, the close
  button, the `duration` and the time bar;
- the `alert` role on error and warning and the `status` role on the others, on the host, with no
  focus move; the events `nph-action` and `nph-close`; the timer that pauses on hover and focus and
  resumes with the time left; no auto-close on error, on loading or on a toast with an action;
- the action and the time bar never together, and the invalid input that draws nothing and reports
  only in development;
- the 59 `notification/*` tokens already on the base, the component, CSS, tests, the Validation
  stories and Docs page, the Storybook dictionary in en, pt-BR and es, the sheet
  `fichas/nph-notification.md`, its generated Metadata and P108 in `docs/decisoes-tecnicas.md`.

The PR changes no token and does not edit `design.md`. It was merged on 2026-11-07, at commit
`0b3df5e`, by Elvys's authorization. The PR head, `28ffd51`, is an ancestor of the tip of the
integration branch.

## How the review went

Copilot reviewed; no human code review; merged by Elvys's authorization.

No review was requested from a person. Copilot was requested at 2026-11-06T12:53:52Z, and again after
each round of fixes (13:51:50Z, 14:01:44Z, 14:09:31Z and, after the last merge of the base,
2026-11-06T19:28:48Z), and reviewed as `copilot-pull-request-reviewer`. The entries of
`elvysmarcos` in the review list are the replies to the Copilot threads, posted with Elvys's account
by the session that fixed them; they are not a code review. There were three rounds with findings
that the code had to answer, a fourth with one point that the PR does not act on, and a last one with
none:

| Reviewed head | Findings | Fixed in |
|---|---|---|
| `cdacd75` | The timer did not follow the `hidden` attribute; the reflow was measured before the inner buttons had updated | `daf0efb`, each with a regression test |
| `daf0efb` | A single-line notification with a secondary action and no main action was drawn; the reflow measure broke under a scaled ancestor; the timer was armed while the element was disconnected | `09003df`, each with a regression test |
| `c57768a` | The close button margins on a coarse pointer; a stale focus state after the focused button was removed; a `duration` above the 32-bit timer limit; a pause after the deadline | `4bd7ad8`, each with a regression test (two of them also pass in Chromium without the fix, and the thread replies say so) |
| `4bd7ad8` | One point about the width of the icon cell and the icon size token; changing it needs a change in `nph-icon`, which the task forbids | Not acted on; it is the note in the last section, below |
| `28ffd51` | No open issue, no thread: "Approval recommended" | — |

The commit `28ffd51` is the merge of `origin/v/5.0.0` (`e05a7ee`) into the branch plus a one-line
change of the `nph-checkbox` token-contract test, whose regex still expected the old wording of the
`radius/inner` line of `design.md`; the base had reworded it. All threads were answered and resolved.

## Command

```text
git merge-base --is-ancestor 28ffd51fc91a445ffa0532ceda8bd70eefd47b19 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `28ffd51` is an ancestor of `v/5.0.0`. Checked against
`origin/v/5.0.0` at `0b3df5e5d6f483ab51ebc5218005fa4276e20142`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#150](https://github.com/iatecbr/IATec.Nephos/pull/150) | `0b3df5e` (2026-11-07T21:59:03Z) | `28ffd51` | `elvysmarcos` |

## Proof commands

Run on the final head `28ffd51`, in sequence. Every one exited with `0`:

| Command | Detail |
|---|---|
| `npm run build:tokens` | |
| `npm run test:tokens` | |
| `npm test` | 151 files, 6068 tests, with the accessibility gate of the stories |
| `npm run typecheck` | |
| `npm run test:i18n` | |
| `npm run test:naming` | |
| `npm run test:spelling` | |
| `npm run test:operacao` | |
| `npm run build-storybook` | |
| `npm run build:lib` | |
| `npm run test:package` | |
| `git diff --check` | |

On the same head, the Azure pipeline passed: the Build stage, the Test stage and the overall check.
The Test stage of the first attempt failed. Shard 1 failed to load six test files with
`Failed to fetch dynamically imported module` and `net::ERR_NETWORK_CHANGED`, and passed on its
automatic rerun (P106). Shard 2 failed to load one story file for the same network reason and also
failed the `nph-tooltip` test "Esc during the wait ends it" (`motion/hover-delay`), a timing test that
is unstable under load; the mix of causes left no automatic rerun. The Test stage was run again, with
no change to the code, and passed.

## Still open

D-1 stays in the task's `pending_decisions`, unchanged. It does not block the task:

- D-1, with Indiane: the accepted documentation describes a toast region at the bottom-right corner
  with up to three toasts, but it is not a component set in Figma. The code leaves the region to the
  consuming application: the sheet teaches how to build it and the Storybook shows it as a frame.
  Should the region become a piece of its own?
- Not opened as a decision: the icon cell of the notification takes its width from
  `notification/icon-size` while the inner `nph-icon` and `nph-spinner` take theirs from their own
  size tokens. The two agree today; if they ever differ, the fix belongs to `nph-icon`, which this
  task does not change.
