```json
{
  "task": "DSA-51",
  "gate": "review-and-merge",
  "date": "2026-10-23",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor ba4e23dcb2b02fd4bf1996e127c2abc3567ad459 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "a0d5627e5584ed4dd341e3973a6b698d0320843d",
  "external_origin": null
}
```

# DSA-51 — `review-and-merge`

PR #106 (`claude/dsa-51-nph-image-bd4e5f`) brought `nph-image`, the image of a
product, file or content in an area of fixed size, with the loading, empty and
error states. It came with its CSS and tests, five Validation stories, the Docs
page, the dictionary in en, pt-BR and es, the spec and its generated Metadata,
and P90. The PR changes no token. Elvys merged it on 23-10-2026, at commit
`a0d5627`, as `component-handoff.md` gives Elvys the review and merge of his own
pull requests. The PR head, `ba4e23d`, is an ancestor of the integration branch
tip.

How the review went: Copilot reviewed; no human code review; merged by Elvys.

No review was requested from a person. Copilot was requested at
2026-10-23T20:14:17Z and again at 20:24:15Z, and reviewed twice as
`copilot-pull-request-reviewer`. The other reviews on the PR, by
`elvysmarcos`, carry the replies to Copilot's threads.

| Reviewed head | Findings | Fixed in |
|---|---|---|
| `c7c4e45` | The focus ring painted inside the frame, over the photo, so an image of the ring color hid it; `click()` called on the host of a clickable, disabled image still reached the consumer; the eye read `icon/size-*` and ignored a local `image/icon-size-*` | `f3510dd`, with a regression test for each |
| `ba4e23d` | No open issue | — |

The three findings were fixed and their threads answered and resolved. The ring
became an outline just outside the frame, so the frame no longer clips and the
image and the veil take its corner; the host click of a clickable, disabled image
stops in the capture phase, as in `nph-button`, while a plain disabled image lets
it pass to its parent; the veil bridges `image/icon-size-*` to the `icon/size-*`
that `nph-icon` reads. P90, the spec and the dictionary followed. Between the two
reviews, `ba4e23d` merged `v/5.0.0` at `11816f4` with no conflict.

The last review asked for a final human validation of the new public API and of
the semantic choices of P90. That validation is Elvys's review and merge of the
PR, and his review of the components at the end of the wave.

## Command

```text
git merge-base --is-ancestor ba4e23dcb2b02fd4bf1996e127c2abc3567ad459 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `ba4e23d` is an ancestor of `v/5.0.0`, checked
against `origin/v/5.0.0` at `a0d5627e5584ed4dd341e3973a6b698d0320843d`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#106](https://github.com/iatecbr/IATec.Nephos/pull/106) | `a0d5627` (2026-10-23T20:32:08Z) | `ba4e23d` | `elvysmarcos` |

The merge `a0d5627` has two parents, `11816f4` and `ba4e23d`. Its tree is the
tree of the head.

## Proof commands

Run on the final head `ba4e23d`, after a clean `npm ci`. These exited with `0`:

| Command | Detail |
|---|---|
| `npm run build:tokens` | no diff in `src/tokens` |
| `npm run test:tokens` | 25 checks |
| `npm test` | 1617 tests; 161 of `nph-image` |
| `npm run typecheck` | |
| `npm run test:i18n` | |
| `npm run test:operacao` | 48 tasks |
| `npm run build-storybook` | |
| `npm run build:lib` | |
| `npm run test:package` | 823 checks, 16 components |
| `git diff --check origin/v/5.0.0...HEAD` | |

`npm run test:naming` exits with `1` on `scripts/test-package.mjs` and on
Portuguese words in `docs/operacao/` records. The result is the same as on the
base, and none of those files is in the diff of the PR.

## Still open

D1 and D2 stay in the task's `pending_decisions`, with Indiane, unchanged. They
change no token and do not block the task:

- D1: the empty and error illustrations. Until the files arrive, the two states
  draw the frame only and look alike, the known limit recorded in P90.
- D2: `design.md` has no usage entry for the `image/*` tokens, nor for
  `overlay/on-media-strong` and `overlay/on-media-foreground`.
