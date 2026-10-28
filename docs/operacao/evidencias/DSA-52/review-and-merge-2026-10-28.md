```json
{
  "task": "DSA-52",
  "gate": "review-and-merge",
  "date": "2026-10-28",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor ef01a1946506fa91dd3e2028d8884e6658a6a4bb origin/v/5.0.0",
  "exit_code": 0,
  "sha": "d4d398d946b8353a1a9507ab5c07993cddfd77b9",
  "external_origin": null
}
```

# DSA-52 — `review-and-merge`

PR #129 (`claude/dsa-52-nph-button-so-icone-solido`) made the icon-only `nph-button`
swap its icon from the `light` variant of `nph-icon` to `solid` in `hover-active`, the
answer Indiane gave to D1 of DSA-47 on 26-10-2026. The icon-only button now renders its
icon as a `light` and `solid` pair at the size of its box, and the internal CSS that P88
already had shows one of them with the same condition that changes the background. It
came with the tests, the `Icons` story, the dictionary in en, pt-BR and es, the spec and
its generated Metadata, and the amendment of P88 of 27/10/2026. The PR changes no token
and no public API. Elvys merged it on 27-10-2026, at commit `d4d398d`. The PR head,
`ef01a19`, is an ancestor of the integration branch tip.

How the review went: Copilot reviewed; no human code review; merged by Elvys.

No person was requested as reviewer. Copilot was requested once, at
2026-10-27T09:51:26Z, and reviewed once as `copilot-pull-request-reviewer`, at
2026-10-27T09:53:49Z.

| Reviewed head | Findings | Answer |
|---|---|---|
| `ef01a19` | No open issue and no thread; approval recommended | — |

No fix commit was needed, and the branch needed no merge of `v/5.0.0`: it was cut from
`24dd4a8`, which was still the tip of `v/5.0.0` when the PR was ready.

## Command

```text
git merge-base --is-ancestor ef01a1946506fa91dd3e2028d8884e6658a6a4bb origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `ef01a19` is an ancestor of `v/5.0.0`, checked against
`origin/v/5.0.0` at `b76d3d7`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#129](https://github.com/iatecbr/IATec.Nephos/pull/129) | `d4d398d` (2026-10-27T21:08:22Z) | `ef01a19` | `elvysmarcos` |

The merge `d4d398d` has two parents, `a05ae8e` and `ef01a19`.

## Proof commands

Run on the final head `ef01a19`, one after the other. These exited with `0`:

| Command | Detail |
|---|---|
| `npm run build:tokens` | |
| `npm run test:tokens` | |
| `npm test` | 64 files, 4011 tests |
| `npm run typecheck` | |
| `npm run test:i18n` | |
| `npm run test:operacao` | |
| `npm run test:naming` | |
| `npm run build-storybook` | |
| `npm run build:lib` | |
| `npm run test:package` | 1496 checks |
| `git diff --check origin/v/5.0.0...HEAD` | |

## Still open

Nothing. The task opened no pending decision.
