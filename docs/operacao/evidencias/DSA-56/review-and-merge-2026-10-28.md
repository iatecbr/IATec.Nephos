```json
{
  "task": "DSA-56",
  "gate": "review-and-merge",
  "date": "2026-10-28",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor bffd7d64e270a10862682bc7ba05ab5c44e8d1e3 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "c2e008e1f360b8af6e3b51c149b5e9393127d7a7",
  "external_origin": null
}
```

# DSA-56 — `review-and-merge`

PR #135 (`claude/dsa-56-nph-table-treegrid-acc4d6`) made the tree of `nph-table` a
`treegrid` with the keyboard of the APG treegrid pattern:

- the table that draws a tree takes `role="treegrid"`. Its rows carry `aria-level`,
  `aria-posinset`, `aria-setsize` and, when they open, `aria-expanded`;
- one row is the Tab stop, and Tab goes on to the widgets of that row only;
- the arrows, Home, End and Enter move between rows and cells and open and close a row;
- the footer is the last row the arrows reach;
- the flat table does not change.

The PR also brought:

- `TREE_LEVEL_EXCEPTION` removed from `nph-table.demo.ts`, `nph-table.stories.ts` and
  `nph-table.docs.stories.ts`: the Tree and Documentation stories pass the accessibility
  gate (P72) with no exception;
- the tests of the roles, the focus and the keys;
- P101, with dated annotations on P97;
- the spec and its generated Metadata;
- the dictionary in en, pt-BR and es.

The PR changes no token and opens no accessibility exception.

Elvys authorized the merge, which landed on 28-10-2026 at commit `c2e008e`, merged as
`elvysmarcos`. The PR head, `bffd7d6`, is an ancestor of the tip of the integration
branch.

## How the review went

Copilot reviewed; no human code review; merged by Elvys's authorization.

No review was requested from a person. Copilot was requested three times, at
2026-10-28T17:25:21Z, 17:40:39Z and 17:48:06Z. It reviewed three heads, as
`copilot-pull-request-reviewer`.

| Reviewed head | Findings | Fixed in |
|---|---|---|
| `7a7ab6b` | The footer of a tree was out of the arrow path; two row templates made a focused button lose focus when the table became a tree; the tooltip of a truncated cell did not open when the arrows reached it, nor on hover in a row that is not the Tab stop | `6556dd9`, with three regression tests; the hover part is a known limit (below) |
| `6556dd9` | When the table became a tree, the Tab stop did not stay on the row the focus was in | `0587c33`, with the transition test extended |
| `0587c33` | No open finding | — |

The four threads were answered and resolved. The regression test of the tooltip opened
by the arrows was seen failing without its fix.

After `0587c33` only the sync merge `bffd7d6` entered. It brought `v/5.0.0` at
`13b17ea`, with PR #136, which only touched a test of `nph-tooltip`. It had no change of
the PR's own.

## Command

```text
git merge-base --is-ancestor bffd7d64e270a10862682bc7ba05ab5c44e8d1e3 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `bffd7d6` is an ancestor of `v/5.0.0`. Checked
against `origin/v/5.0.0` at `c2e008e1f360b8af6e3b51c149b5e9393127d7a7`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#135](https://github.com/iatecbr/IATec.Nephos/pull/135) | `c2e008e` (2026-10-28T18:34:07Z) | `bffd7d6` | `elvysmarcos` |

## Proof commands

Run on the final head `bffd7d6`, in sequence. Every one exited with `0`:

| Command | Detail |
|---|---|
| `npm run build:tokens` | |
| `npm run test:tokens` | |
| `npm test` | 128 files, 4418 tests, with the accessibility gate on every story |
| `npm run typecheck` | |
| `npm run test:i18n` | |
| `npm run test:naming` | green |
| `npm run test:operacao` | |
| `npm run build-storybook` | |
| `npm run build:lib` | |
| `npm run test:package` | 1547 checks |
| `git diff --check` | |

On the same head, the Azure pipeline (build 611294) passed: the Build stage, the Test
stage and the overall check. Without `role="treegrid"`, the gate failed the Tree and
Documentation stories with `aria-conditional-attr`, which shows that it reads them.

## Still open

- **The tooltip of a truncated cell opens on hover only in the row that is the Tab stop**
  (known limit of P101). It is a regression of this task: before it, every truncated cell
  of a tree had `tabindex="0"` and its tooltip opened on hover in any row. The rule is
  that of `nph-tooltip` (P77): it opens only on an element in the Tab order. The arrows
  open the tooltip in any row, and the whole text stays in the name of the cell. The
  follow-up is in `nph-tooltip`: take a cell with `tabindex="-1"` inside a `grid` or a
  `treegrid` as an element that receives focus. Whether it enters this wave is Elvys's
  call.
- No pending decision with Indiane.
