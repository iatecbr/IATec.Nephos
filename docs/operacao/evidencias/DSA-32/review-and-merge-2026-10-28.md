```json
{
  "task": "DSA-32",
  "gate": "review-and-merge",
  "date": "2026-10-28",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor d9276985553c34e225a3a923cfaeafa0b7c5d9bc origin/v/5.0.0",
  "exit_code": 0,
  "sha": "a9812ac63f27ba54315974db07fff434d564a0a9",
  "external_origin": null
}
```

# DSA-32 — `review-and-merge`

PR #130 (`claude/dsa-32-a11y-gate-7539cc`) put the accessibility gate in `npm test`
(P72): `@storybook/addon-a11y` and `@storybook/addon-vitest` at 10.6.2, a second Vitest
project that renders every story, `Validation` and `Docs`, and runs axe with the WCAG 2.2
AA tags, and `test: 'error'`, so a violation fails the run. `.storybook/settle.js` lets the
transitions inside the shadow roots end before axe reads the page.

The PR also brought:

- the versions table of `AGENTS.md`, with `storybook ^10.6.2` and the two addons;
- the annotation of P72, `docs/stories.md` §5.6, and the amendments of P87, P92, P95, P97
  and P98;
- the fixes of the 23 violations the first run found, in stories and in components:
  - `nph-dialog`, `nph-label`, `nph-multi-combobox` and `nph-textarea`: contrast;
  - `nph-select`, `nph-combobox` and `nph-multi-combobox`: the listbox on the box that
    scrolls;
  - `nph-sidebar-rail-button`: the counter in the name;
- the two exceptions Elvys decided on 27-10-2026, recorded in the files as
  `docs/stories.md` §2.3 asks:
  - `aria-conditional-attr` in the tree of `nph-table`, with DSA-56 for the treegrid;
  - `label-content-name-mismatch` in three stories of `nph-dropdown-menu`;
- 24 hidden fixture stories of `nph-dialog`, so the gate reads the dialogs the pages show
  in frames;
- the content of `nph-dialog` that scrolls with nothing focusable inside, now a region in
  the Tab order (P87, amended on 28-10-2026).

The PR changes no token. No contrast failure came from a token, so Indiane has no D-item
from it.

A temporary story with `<button type="button"></button>` failed the run on `button-name`,
exit code 1. The PR shows the output; the story did not stay in the base.

Elvys merged it on 28-10-2026, at commit `a9812ac`. The merge is his because
`component-handoff.md` gives Elvys the merge of the pull requests Claude opens. The PR
head, `d927698`, is an ancestor of the tip of the integration branch.

## How the review went

Copilot reviewed; no human code review; merged by Elvys.

No review was requested from a person. Copilot was requested four times, at
2026-10-28T11:31:02Z, 11:40:09Z, 11:58:11Z and 12:06:18Z, and it reviewed four heads, as
`copilot-pull-request-reviewer`. The other reviews on the PR, from the `elvysmarcos`
account, are the session's replies to the threads, not a code review.

| Reviewed head | Findings | Fixed in |
|---|---|---|
| `4bd07a7` | The status of the combobox list, now beside the listbox, had lost the `layout/max-list-height` bound | `2c6ad5f`, with a regression test in `nph-combobox` and in `nph-multi-combobox` |
| `2681734` | The gate did not read the `nph-dialog` examples the pages load through `iframe.html` | `a84bb4c`: 24 hidden fixture stories; they found `scrollable-region-focusable` in `import-contacts`, fixed in the component by Elvys's decision of 28-10-2026, with four regression tests |
| `a84bb4c` | The Tab stop of the content did not follow a control disabled or removed with no change of size, and counted hidden controls | `5fc7e10`, with two regression tests |
| `5fc7e10` | No open finding; its summary pointed to changes made only inside a composed shadow root, recorded on the PR as a known limit | — |

Every thread was answered and resolved. After `5fc7e10` only sync merges with `v/5.0.0`
entered: PR #132, PR #131 and the closing of DSA-54. They had no change of the PR's own.
The proofs ran in sequence on the final head `d927698`, all with exit code 0:
`build:tokens`, `test:tokens`, `test` (128 files, 4396 tests), `typecheck`, `test:i18n`,
`test:naming`, `test:operacao`, `build-storybook`, `build:lib`, `test:package` and
`git diff --check`. The Azure build 610844 passed its Build and Test stages on that head.

## Command

```text
git merge-base --is-ancestor d9276985553c34e225a3a923cfaeafa0b7c5d9bc origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `d927698` is an ancestor of `v/5.0.0`. Checked against
`origin/v/5.0.0` at `a9812ac63f27ba54315974db07fff434d564a0a9`.

## Still open

- The content watch of `nph-dialog` does not see a change of focusability made only inside
  the shadow root of a composed piece, with no attribute on its host and no change of size.
  It is recorded on PR #130; Elvys decides whether it becomes a follow-up.
- DSA-56 moves the tree of `nph-table` to a treegrid and removes its exception.
