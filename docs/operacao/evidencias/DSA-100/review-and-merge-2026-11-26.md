```json
{
  "task": "DSA-100",
  "gate": "review-and-merge",
  "date": "2026-11-26",
  "owner": "helifiora",
  "command": "git merge-base --is-ancestor a3e3072de39538b232acabbdd22eb3aba9c1f3ef origin/v/5.0.0",
  "exit_code": 0,
  "sha": "5a4ea02670c30140fa5d7396541979dfdb49b7a7",
  "external_origin": null
}
```

# DSA-100 — `review-and-merge`

PR #198 (`feat/dsa-100-nph-toast-region`) implemented `nph-toast-region` in the contract accepted in Figma on
2026-11-22 (documentation frame `7819:4737`, set `7689:288`): the component, CSS, 65 tests, the Validation
stories, the Storybook dictionary in en, pt-BR and es, the sheet `fichas/nph-toast-region.md`, its generated
Metadata and P140 in `docs/decisoes-tecnicas.md`. It also moved the toast region of the `nph-notification`
sheet and stories to the new piece.

It was merged on 2026-11-25 (18:41:02Z), at commit `b95da22d`, by `helifiora`. The PR head, `a3e3072`, is an
ancestor of the tip of the integration branch.

## How the review went

**No review is recorded on the pull request.** The GitHub API lists no review and no review thread on PR #198,
so there is no Copilot review to cite and no thread to answer. The rule of `AGENTS.md` (Copilot reviews every
pull request, and the merge waits for the last review of the current head) is not evidenced for this PR. This
record states that gap and does not fill it.

## The pipeline at the PR head

On `a3e3072` the Azure pipeline had the Build stage and the Storybook pipeline passing and the **Test stage
failing** (build 642071). The context of the task, written before the merge, says the same five tests fail on
`origin/v/5.0.0` without this change (token contracts of `nph-checkbox`, `nph-input` and `nph-timeline`, and the
`Emphasis` and `Actions` stories of `nph-notification`, axe contrast of `help` in dark). The log of that build
was not read for this record, so which tests failed in it is not confirmed here.

## Command

```text
git merge-base --is-ancestor a3e3072de39538b232acabbdd22eb3aba9c1f3ef origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `a3e3072` is an ancestor of `v/5.0.0`. Checked against
`origin/v/5.0.0` at `5a4ea02670c30140fa5d7396541979dfdb49b7a7`.

## Proof commands, run again on 2026-11-26

Run on `5a4ea02` (the tip of `v/5.0.0`, which contains the PR and the later PR #200), not on the PR head:

| Command | Result |
|---|---|
| `npm run build:tokens` | exit 0 |
| `npm run test:tokens` | exit 0 |
| `npm run typecheck` | exit 0 |
| `npm run test:i18n` | exit 0 |
| `npm run test:operacao` | exit 0 (123 tasks checked) |
| `npm run build:lib` | exit 0 |
| `npm run test:package` | exit 0 |
| `npm run build-storybook` | exit 0 |
| `git diff --check` | exit 0 |
| `npm test` | **fails**: 10 tests in 8 files; 247 of 255 files and 11277 of 11287 tests pass |
| `npm run test:naming` | **fails**: 14 words in Portuguese in `design.md` and in the tasks DSA-122 to DSA-125, and one unused exception, for a word in `DSA-58.md` |
| `npm run test:spelling` | the 22 configuration probes pass; the full scan did not finish in 600 s. `cspell` on the files of this task (`src/components/nph-toast-region/`, `fichas/nph-toast-region.md`, `DSA-100.md`) reports no issue |

None of the failures is in `nph-toast-region` or in `nph-notification`. The 10 failing tests are token contracts
of other pieces, which no longer match the base:

| File | Test |
|---|---|
| `nph-collapsible.test.ts` | consumes every one of the `collapsible/*` tokens |
| `nph-context-menu.test.ts` | every custom property in the CSS exists in `tokens.css` |
| `nph-data-table.test.ts` | every `data-table/*` token is consumed |
| `nph-date-picker.test.ts` | the panel draws the surface, 14 px corners |
| `nph-hover-card.test.ts` | the surface in both themes; the radius, the offset and the arrow |
| `nph-popover.test.ts` | the surface in light and in dark (`popover/radius` is 8, the test expects 14) |
| `nph-scheduler.test.ts` | every scheduler token is read by the CSS (`day-focus-border-radius`, `day-focus-halo-radius`) |
| `nph-toolbar.test.ts` | the toolbar has 14 tokens (15 found) |

They follow the foundation changes of 2026-11-26 (radius of the layers anchored to a trigger), which the tasks
DSA-120 to DSA-125 apply to the code. They are not caused by the toast region.

## Still open

- The Copilot review of PR #198 is not on record (above).
- The 10 tests, the naming failures and the full spelling scan are not fixed by this task; each belongs to the
  task that changes the piece or the document.
- D-1 of DSA-63 (the toast region as a piece of its own) is closed by this task, as the task says: the region is
  a piece, accepted by the design owner on 2026-11-22 (`figma-docs-accepted-2026-11-22.md`).
