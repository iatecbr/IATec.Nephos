```json
{
  "task": "DSA-49",
  "gate": "review-and-merge",
  "date": "2026-10-26",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 72fb0c28c7b37c70ef3bdfcdc9a31817a5c22f27 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "3418c5235c196bd3129d4dc27e4e86701d5b1c07",
  "external_origin": null
}
```

# DSA-49 — `review-and-merge`

PR #119 (`claude/dsa-49-nph-table-8d2ed2`) brought `nph-table`, the table to read
and compare data in rows and columns, with caption, header, cells, footer,
expanding row, tree and two-level header. It came with its CSS and tests, ten
Validation stories, the Docs page, the dictionary in en, pt-BR and es, the spec
and its generated Metadata, and P97. The PR changes no token. Elvys merged it on
26-10-2026, at commit `3418c52`, as `component-handoff.md` gives Elvys the merge
of the pull requests Claude opens. The PR head, `72fb0c2`, is an ancestor of the
integration branch tip.

How the review went: Copilot reviewed; no human code review; merged by Elvys.

No review was requested from a person. Copilot was requested seven times, from
2026-10-26T19:54:23Z to 20:35:26Z, and reviewed seven heads as
`copilot-pull-request-reviewer`. The other reviews on the PR, by `elvysmarcos`,
carry the replies to Copilot's threads.

| Reviewed head | Findings | Fixed in |
|---|---|---|
| `dc7a255` | None: Copilot reported an error and did not review | — |
| `23316b0` | The body rows were reused by position, so a focused chevron could pass to another row; a table moved in the DOM did not measure its scroll area again; a `size` that became valid again left the body empty; an entry that is not a row broke the chevron of the others | `c7c325b`, with a regression test for each |
| `b36da11` | The `href` of a link cell took any protocol, `javascript:` included; the skeleton in the first cell of a tree had no width; a loading cell did not carry `aria-busy` | `91c8b27`, with regression tests |
| `91c8b27` | The cells were reused by position, so a focused button could take the action of another column | `110eead`, with a regression test |
| `110eead` | No open thread; one previously missed issue: a rejected row still added the chevron column and the tree indent | `5420fd5`, with regression tests |
| `5420fd5` | No open thread; two previously missed issues: the values of a number first column of a tree did not go to the end; a detail with a null badge broke the update | `15f2219`, with regression tests |
| `15f2219` | A truncated cell in the first column of a number tree keeps its text next to the chevron | Recorded as a known limit in P97, with a follow-up, at `72fb0c2` |

Every thread was answered and resolved. The sixth review came after the five
rounds of the wave's rule; Elvys decided to run it and to record a new finding as
a known limit with a follow-up, which `72fb0c2` does, changing only P97. Between
the reviews, `a8abdee` merged `v/5.0.0` with PR #118 (`nph-dropdown-menu`),
resolving the conflicts in `docs/decisoes-tecnicas.md` and in the three
dictionaries, and `b36da11` merged the closing of DSA-45 with no conflict.

## Command

```text
git merge-base --is-ancestor 72fb0c28c7b37c70ef3bdfcdc9a31817a5c22f27 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `72fb0c2` is an ancestor of `v/5.0.0`, checked
against `origin/v/5.0.0` at `3418c5235c196bd3129d4dc27e4e86701d5b1c07`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#119](https://github.com/iatecbr/IATec.Nephos/pull/119) | `3418c52` (2026-10-26T21:03:39Z) | `72fb0c2` | `elvysmarcos` |

The merge `3418c52` has two parents, `d8dfe20` and `72fb0c2`. Its tree is the
tree of the head.

## Proof commands

Run on the final head `72fb0c2`, in sequence. These exited with `0`:

| Command | Detail |
|---|---|
| `npm run build:tokens` | |
| `npm run test:tokens` | 25 checks |
| `npm test` | 3535 tests |
| `npm run typecheck` | |
| `npm run test:i18n` | |
| `npm run test:operacao` | |
| `npm run build-storybook` | |
| `npm run build:lib` | |
| `npm run test:package` | 1299 checks, 28 components |
| `git diff --check origin/v/5.0.0...HEAD` | |

`npm run test:naming` exits with `1` on the findings that already exist on the
base, recorded before the first commit of the branch; the PR adds none.

## Still open

D1 to D8 stay in the task's `pending_decisions`, with Indiane, unchanged. They
change no token and do not block the task: the category content (D1), the
typography the evidence does not name (D2), the thumbnail without a photo (D3),
the Edit icon (D4), the status icons (D5), the rating star (D6), the emphasis of
the total (D7) and the `design.md` entry of the `table/*` tokens (D8).

Follow-ups recorded in P97: the truncated cell in the first column of a number
tree; wiring the `nph-dropdown-menu` to the more; `nph-button` passing
`aria-expanded` and `aria-controls` to its inner button, the same follow-up as
the trigger of `nph-dropdown-menu` (P92).
