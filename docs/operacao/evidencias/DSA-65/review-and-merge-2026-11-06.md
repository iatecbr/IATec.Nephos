```json
{
  "task": "DSA-65",
  "gate": "review-and-merge",
  "date": "2026-11-06",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 0c86aa01a68c9e9d5ee5c3689b4f9b962f4844a6 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "9534c553d2dc03b9cd58c322363c9721e9fc7c1c",
  "external_origin": null
}
```

# DSA-65 — `review-and-merge`

PR #149 (`feat/dsa-65-progress`) implemented `nph-progress` in the contract accepted in Figma on
2026-11-05 (documentation frame `4385:3186`, sets `4368:1532` and `4368:1185`):

- the types `determinate`, `indeterminate` and `steps`, the sizes `md` and `sm`, the status
  `active`, `success` and `error`, the optional `label`, `value-text` and `help`, and the status
  icon on success and error;
- the `progressbar` role on the track, inside the shadow root, named by the label or by the host
  `aria-label` and described by the help text; no `aria-valuenow` on indeterminate; the "N of M" in
  `aria-valuetext` on steps;
- the indeterminate loop in `progress/loop-duration` (1400 ms) with `progress/loop-easing`, from
  outside the left edge to outside the right edge in any direction, and at rest at the start with
  reduced motion;
- the 4 x 4 end stop below 100 on both sizes, the `progress/track-gap` left empty between the
  indicator and the rest of the track, and the fluid width with a 48 px minimum, the one literal
  measure, since no width token exists;
- the 27 `progress/*` tokens already on the base, the component, CSS, tests, the Validation stories
  and Docs page, the Storybook dictionary in en, pt-BR and es, the sheet `fichas/nph-progress.md`,
  its generated Metadata, P107 in `docs/decisoes-tecnicas.md` and the paragraph of the indeterminate
  bar in `docs/tokens.md` with its es and pt-BR pairs.

The PR changes no token and does not edit `design.md`. It was merged on 2026-11-06, at commit
`9534c55`, by Elvys's authorization. The PR head, `0c86aa0`, is an ancestor of the tip of the
integration branch.

## How the review went

Copilot reviewed; no human code review; merged by Elvys's authorization.

No review was requested from a person. Copilot was requested at 2026-11-06T12:19:02Z, and again
after each round of fixes (12:26:32Z, 12:39:16Z and 12:45:47Z), and reviewed as
`copilot-pull-request-reviewer`. There were three rounds with findings and a last one with none:

| Reviewed head | Findings | Fixed in |
|---|---|---|
| `9424ce7` | The track background filled the gap after the indicator; the loop segment was anchored at the inline start, so it left the track in a right-to-left container; the labels of the Width story were not in the dictionary | `f084257`, each with a regression test |
| `4e75739` | The missing-help warning repeated on every update | `7fa9457`, with a regression test that counts the warning |
| `f084257` | The component CSS overrode the `hidden` attribute of the consumer; `design.md` still words the indeterminate bar as deferred | `4e75739` fixed the first, with a regression test; the second is D-2, below |
| `7fa9457` | No open issue, no thread: "Approval recommended" | — |

The commit `0c86aa0` is a merge of `origin/v/5.0.0` (`b6d2c69`) into the branch, with no commit of
the PR's own after the last review, as the wave rule allows. All three threads were answered and
resolved.

## Command

```text
git merge-base --is-ancestor 0c86aa01a68c9e9d5ee5c3689b4f9b962f4844a6 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `0c86aa0` is an ancestor of `v/5.0.0`. Checked against
`origin/v/5.0.0` at `9534c553d2dc03b9cd58c322363c9721e9fc7c1c`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#149](https://github.com/iatecbr/IATec.Nephos/pull/149) | `9534c55` (2026-11-06T13:20:35Z) | `0c86aa0` | `elvysmarcos` |

## Proof commands

Run on the final head `0c86aa0`, in sequence. Every one exited with `0`:

| Command | Detail |
|---|---|
| `npm run build:tokens` | |
| `npm run test:tokens` | |
| `npm test` | 147 files, 5761 tests, with the accessibility gate of the stories |
| `npm run typecheck` | |
| `npm run test:i18n` | |
| `npm run test:naming` | |
| `npm run test:spelling` | |
| `npm run test:operacao` | |
| `npm run build-storybook` | |
| `npm run build:lib` | |
| `npm run test:package` | |
| `git diff --check` | |

On the same head, the Azure pipeline passed: the Build stage, the Test stage and the overall
check. The Test stage of the first attempt failed only with `Failed to fetch dynamically imported
module` and `net::ERR_NETWORK_CHANGED` after the three attempts of P106, and passed when the stage
was run again, with no change to the code. The Build stage of the previous head failed the same
way in `test:package` and passed on a rerun.

## Still open

Both stay in the task's `pending_decisions`, unchanged. Neither blocks the task:

- D-1, with Indiane: the evidence names the step counts 3, 4 and 5 only as the Figma samples of
  `etapas`; the code accepts only those three and draws nothing for another count.
- D-2, with Elvys: `design.md` still says the indeterminate bar has no value and was deferred (open
  point 3n, `tokens_motion`) and does not list `motion/loop-long-duration` and
  `motion/loop-long-easing`. This task does not edit `design.md`; the file needs a change of its own.
