```json
{
  "task": "DSA-60",
  "gate": "review-and-merge",
  "date": "2026-10-29",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 4bef03b0e5a2a4208a3716edfd84ee072381a257 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "588b0b06de2541abbf826f375eaf5848c1f1cb99",
  "external_origin": null
}
```

# DSA-60 — `review-and-merge`

PR #143 (`feat/dsa-60-button-ghost-hover`) moved the hover of the secondary ghost `nph-button`
from `color/muted` to its component tokens: `button/secondary-ghost-background-hover` for the
button with text and `icon-button/secondary-ghost-background-hover` for the icon-only button,
the `nph-icon-button` of Figma, in both shapes. Both tokens are aliases of `color/accent`.

The PR also brought:

- the tests of the hover in light and dark mode. Since both tokens resolve to the same color, a
  wrapper points each one at a different color and proves that the button with text reads the
  button token, that the icon-only button reads the icon-button token, and that primary and
  danger ghost read neither. Five of these tests fail on the previous CSS;
- the spec and its generated Metadata;
- the `hover-active` state of the Docs page in en, pt-BR and es.

The stories did not change: the Validation matrix already shows the secondary ghost with text,
and the `xmark` example shows the icon-only one. The PR changes no token: it consumes the two
tokens that came with the task on `v/5.0.0`.

It was merged on 29-10-2026, at commit `588b0b0`, by Elvys's authorization. The PR head,
`4bef03b`, is an ancestor of the tip of the integration branch.

## How the review went

Copilot reviewed; no human code review; merged by Elvys's authorization.

No review was requested from a person. Copilot was requested once, at 2026-10-29T14:01:59Z,
and reviewed the head `3c9d51f` as `copilot-pull-request-reviewer`, at 14:04:25Z.

| Reviewed head | Findings | Fixed in |
|---|---|---|
| `3c9d51f` | No finding | — |

There were no threads. After the review, only one sync merge entered, with no change of the
PR's own: `4bef03b`, which brought the tokens and the task of DSA-61 and the update of DSA-58.
The merge had no conflict, and the proof commands ran again on that head.

## Command

```text
git merge-base --is-ancestor 4bef03b0e5a2a4208a3716edfd84ee072381a257 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `4bef03b` is an ancestor of `v/5.0.0`. Checked against
`origin/v/5.0.0` at `588b0b06de2541abbf826f375eaf5848c1f1cb99`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#143](https://github.com/iatecbr/IATec.Nephos/pull/143) | `588b0b0` (2026-10-29T16:39:05Z) | `4bef03b` | `elvysmarcos` |

## Proof commands

Run on the final head `4bef03b`, in sequence. Every one exited with `0`:

| Command | Detail |
|---|---|
| `npm run build:tokens` | |
| `npm run test:tokens` | |
| `npm test` | 135 files, 5273 tests |
| `npm run typecheck` | |
| `npm run test:i18n` | |
| `npm run test:naming` | |
| `npm run test:spelling` | |
| `npm run test:operacao` | |
| `npm run build-storybook` | |
| `npm run build:lib` | |
| `npm run test:package` | |
| `git diff --check` | |

On the same head, the Azure pipeline (build 612140) passed: the Build stage, the Test stage on
its second attempt, and the overall check. The earlier attempts, on that build and on build
612025 (head `3c9d51f`), failed only on the known Chromium defect of the browser mode: "Failed
to fetch dynamically imported module" and the Test job hanging until the 30-minute limit. No
failure was an assertion.

## Still open

Outside this task, for Indiane: in `design.md`, the `use` and the `nao_use` of `color/muted`
still cite the hover of the ghost secondary `nph-button`, which now reads its component
tokens on `color/accent`. `design.md` was not edited.
