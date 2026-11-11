```json
{
  "task": "DSA-75",
  "gate": "review-and-merge",
  "date": "2026-11-11",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor b0b20eb58b15910568143067ac34dfa21cf5b5be origin/v/5.0.0",
  "exit_code": 0,
  "sha": "e0162ed",
  "external_origin": null
}
```

# DSA-75 — `review-and-merge`

PR #167 (`feat/dsa-75-tree`) implemented `nph-tree` in the contract accepted in Figma on 2026-11-11
(documentation frame `5876:216753`, component sets `5485:350`, `5485:421` and `5485:766`):

- **`nph-tree`**, one tag that draws the three parts of the Figma sets (the item, the group of children and
  the tree): a list of nodes in levels, in three selections (none, single and multiple). `items` (property
  only, replaced and never changed in place), `selection`, `selected`, `checked`, `expanded`, `icons`,
  `check-strictly`, `loading`, `label` and the host `aria-label` and `aria-labelledby`, and the texts of the
  consumer `empty-heading`, `empty-description`, `error-text` and `retry-text`. The events `nph-tree-toggle`,
  `nph-tree-select`, `nph-tree-check` and `nph-tree-load` fire only when the person acts. The cascade of the
  multiple selection leaves a disabled item out of the count and out of the cascade; load on demand with the
  spinner in place of the chevron, the error row with "Try again" and the first load with three skeleton rows;
  the empty tree; a cut label with the whole text in `nph-tooltip`; the keyboard of the APG tree view with one
  Tab stop; `itemIdOf(element)` and `focus()` for a menu opened on the tree. It consumes the `tree/*` tokens
  already on `v/5.0.0` and creates or changes none. It comes with the component, CSS, tests, the Validation
  stories and Docs page, the Storybook dictionary in en, pt-BR and es, the sheet `fichas/nph-tree.md`, its
  generated Metadata and P118 in `docs/decisoes-tecnicas.md`. The word `multiselectable` entered the spelling
  dictionary.

The PR does not change `nph-checkbox`, `nph-icon`, `nph-spinner`, `nph-skeleton`, `nph-empty`,
`nph-tooltip`, `nph-context-menu`, `design.md`, the tree of `nph-table` or any token. It was merged on
2026-11-11T20:34:53Z, at commit `e0162ed`, under Elvys's standing authorization of 2026-11-07. The PR head,
`b0b20eb`, is an ancestor of the tip of the integration branch.

## How the review went

Copilot reviewed; no human code review; merged under Elvys's standing authorization of 2026-11-07.

No review was requested from a person. Copilot was requested when the PR opened and again after each round of
fixes, and reviewed as `copilot-pull-request-reviewer`. The entries of `elvysmarcos` in the review list are the
replies to the Copilot threads, posted with Elvys's account by the session that fixed them; they are not a code
review. There were five rounds, the last one with no new finding:

| Reviewed head | Findings | Fixed in |
|---|---|---|
| `464a2b4` | Four threads: a Tab from outside the tree entered on the item under the pointer; `itemIdOf` returned `null` for the drawing inside an icon; a new `items` with the answer of one branch cleared the pending retry of another; unchecking a child under a disabled branch removed the branch from `checked` | `870500e`, each with a regression test (Tab released on the document, the search up through the shadow roots, the retry kept per branch with the node it was pressed on, the disabled branch kept out of the cascade) |
| `870500e` | One thread: a `null` in `items` during a pending retry threw before the validation | `ed544c5`: validate first, then prune; a regression test with a pending retry |
| `c0348a9` | Three threads: opening, closing and opening a branch before the answer asked twice; a menu opened on another item by the pointer gave the focus back to the last focused one; the climb of the cascade skipped a disabled ancestor instead of stopping at it | `bb86f30`, each with a regression test (the first load asked once per branch until the answer, the item the menu was opened on, a three-level case) |
| `bb86f30` | No new thread (the summary repeated the resolved ones) | Not applicable |
| `b0b20eb` | No open issue | Not applicable |

Before the first round, an internal review of the work found that the Tab stop had to go back to the chosen
item when the focus leaves the tree, that a balloon held by a hover stop closed when the pointer moved onto it,
and that a menu closing on the host had nowhere to give the focus back; they were fixed in `f02549f` with
tests, and the event names were made literal in `b0b20eb` so the manifest of the package lists the four events.
The proofs were run on `b0b20eb`, the final head: all twelve exit 0, with 7714 tests in 183 files in
`npm test`. The branch took one merge of the base, `c0348a9`, after the token commits of DSA-76. The Azure Build
and Test were SUCCESS on the final head; the Test Stage had failed twice for infrastructure only
(`net::ERR_NETWORK_CHANGED` and "Failed to fetch dynamically imported module" in files of other pieces, builds
624396 and 624437) and was run again by the orchestrator session.

## Command

```text
git merge-base --is-ancestor b0b20eb58b15910568143067ac34dfa21cf5b5be origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `b0b20eb` is an ancestor of `v/5.0.0`. Checked against `origin/v/5.0.0` at
`e0162ed`.

## Still open

Two decisions wait for Indiane, recorded in the task and in P118; none blocks the merge:

- **D-1**: whether the Tree Table reuses the cell of the tree of `nph-table` and stays apart from `nph-tree`,
  or the two are unified. Recommended: keep both. It is decided in the plan of the Tree Table.
- **D-2**: whether the focus border of a disabled item fades with the item or stays on top at full opacity.
  Recommended, and built: on top, at full opacity.
