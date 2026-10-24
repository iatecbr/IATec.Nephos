```json
{
  "task": "DSA-47",
  "gate": "review-and-merge",
  "date": "2026-10-24",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor bb47fea7a0dc968f0931330f4ececbad90869393 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "153af0f56d63e35383e5075f72b53bfd1a890f15",
  "external_origin": null
}
```

# DSA-47 — `review-and-merge`

PR #113 (`claude/dsa-47-nph-button-icone-solido-b4494c`) made the `nph-button` with text
draw its start and end icons in the `solid` variant of `nph-icon` in `hover-active`, the
rule Indiane decided on 21-10-2026. With text, each icon renders as a `light` and `solid`
pair, and the internal CSS shows one of them with the same condition that changes the
background; the icon-only button keeps its single `light` icon (D1). It came with the
tests, the JSDoc of the `Icons` story, the dictionary in en, pt-BR and es, the spec and its
generated Metadata, and P88, which amends P68. The PR changes no token and no public API.
Elvys merged it on 24-10-2026, at commit `153af0f`. The PR head, `bb47fea`, is an ancestor
of the integration branch tip.

How the review went: Copilot reviewed; no human code review; merged by Elvys.

No person was requested as reviewer. Copilot was requested once, at
2026-10-23T21:49:36Z, and reviewed once as `copilot-pull-request-reviewer`, at
2026-10-23T21:51:53Z.

| Reviewed head | Findings | Answer |
|---|---|---|
| `bb47fea` | No open issue and no thread; approval recommended | — |

No fix commit was needed. Before the review, the branch merged `v/5.0.0` twice: at
`3cc4581` (DSA-27), with one conflict in the list of decisions at the top of
`docs/decisoes-tecnicas.md`, resolved keeping P79 and P88; and at `db77503`, with no
conflict.

## Command

```text
git merge-base --is-ancestor bb47fea7a0dc968f0931330f4ececbad90869393 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `bb47fea` is an ancestor of `v/5.0.0`, checked against
`origin/v/5.0.0` at `153af0f56d63e35383e5075f72b53bfd1a890f15`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#113](https://github.com/iatecbr/IATec.Nephos/pull/113) | `153af0f` (2026-10-24T22:14:58Z) | `bb47fea` | `elvysmarcos` |

The merge `153af0f` has two parents, `db77503` and `bb47fea`.

## Proof commands

Run on the final head `bb47fea`. These exited with `0`:

| Command | Detail |
|---|---|
| `npm run build:tokens` | no diff in `src/tokens` |
| `npm run test:tokens` | 25 checks |
| `npm test` | 1952 tests |
| `npm run typecheck` | |
| `npm run test:i18n` | |
| `npm run test:operacao` | 48 tasks |
| `npm run build-storybook` | |
| `npm run build:lib` | |
| `npm run test:package` | 880 checks, 18 components |
| `git diff --check origin/v/5.0.0...HEAD` | |

`npm run test:naming` exits with `1` on `scripts/test-package.mjs` and on Portuguese
words in `docs/operacao/` records. None of those files is in the diff of the PR.

Without the new CSS rule, 12 tests of `nph-button.test.ts` fail. The swap was also
checked by hand in Storybook, in `Validation › Icons`: at rest the icons are `light`,
and on hover the funnel of "Filter" and the chevrons turn `solid`.

## Still open

D1 stays in the task's `pending_decisions`, with Indiane, unchanged. It changes no token
and does not block the task:

- D1: whether the icon-only button (`498:15671`) also swaps its icon to `solid` in
  `hover-active`. Until the answer, only the button with text swaps.
