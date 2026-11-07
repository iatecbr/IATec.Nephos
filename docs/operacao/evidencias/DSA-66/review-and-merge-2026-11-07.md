```json
{
  "task": "DSA-66",
  "gate": "review-and-merge",
  "date": "2026-11-07",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 986871acfea034a61427faa1561282404a5f52d6 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "ce666b3f080fb5ea5de129fff26671aad0bc0e58",
  "external_origin": null
}
```

# DSA-66 — `review-and-merge`

PR #151 (`feat/dsa-66-breadcrumb`) implemented `nph-breadcrumb` in the contract accepted in Figma on
2026-11-06 (documentation frame `4512:4741`, sets `4490:2886`, `4490:2678` and `4490:2697`, separator
`1635:16`):

- the trail with 2, 3 or 4 levels or collapsed, each with or without the icon of the level; the item as
  a link or as the current page; the separator between levels, mirrored in right-to-left writing; one
  line, never wrapped;
- the ellipsis button, `breadcrumb/ellipsis-target-size` wide, that opens the hidden levels in an
  `nph-dropdown-menu`, in path order; picking a level leads where its link would;
- the menu width that hugs the widest option between `--nph-breadcrumb-menu-min-width` and
  `--nph-breadcrumb-menu-max-width`, with an ellipsis above the ceiling, only inside the breadcrumb;
  where the browser has no `calc-size()` the menu keeps the ceiling as its fixed width (P109);
- the `nav` with a name, the ordered list, `aria-current="page"` on the last level, and the name and the
  expanded state on the ellipsis button; a `href` is accepted only with the protocols `http:`,
  `https:`, `mailto:` and `tel:`; invalid input draws nothing and reports only in development;
- the component, CSS, tests, the Validation stories and Docs page, the Storybook dictionary in en,
  pt-BR and es, the sheet `fichas/nph-breadcrumb.md`, its generated Metadata and P109 in
  `docs/decisoes-tecnicas.md`.

The PR changes no token and does not edit `design.md`, `nph-dropdown-menu`, `nph-icon` or
`nph-skeleton`. It was merged on 2026-11-07, at commit `ce666b3`, by Elvys's authorization. The PR
head, `986871a`, is an ancestor of the tip of the integration branch.

## How the review went

Copilot reviewed; no human code review; merged by Elvys's authorization.

No review was requested from a person. Copilot was requested when the PR opened (2026-11-06T13:50:27Z)
and again after each round of fixes (13:57:22Z, 14:04:59Z and 14:13:21Z), and reviewed as
`copilot-pull-request-reviewer`. The entries of `elvysmarcos` in the review list are the replies to the
Copilot threads, posted with Elvys's account by the session that fixed them; they are not a code
review. There were two rounds with findings that the code had to answer, one with a single point that
the same fix closed, and a last one with none:

| Reviewed head | Findings | Fixed in |
|---|---|---|
| `597b052` | The hidden levels kept from a rejected input could show stale labels while the navigation used the new destinations; the test listeners on `document` leaked into the next tests | `cdad87d`, each with a regression test |
| `cdad87d` | The width fallback of the menu is invalid where `fit-content(<length>)` and `calc-size()` are missing, so a long label could pass the 280 px ceiling | `647bc80`, the ceiling as a fixed width, with a test |
| `8da6936` | A `href` such as `javascript:alert(1)` or `java\nscript:alert(1)` was accepted and reached the visible link and the anchor the menu clicks; the same width fallback | `647bc80`, `href` only with a safe protocol, with tests |
| `647bc80` | No open issue, no thread: "Approval recommended" | — |

After `647bc80` the branch received only merges of `origin/v/5.0.0`, with no change of the component:
`40d9f29`, `ba4dced`, `d8131a7` and `986871a`. The merge `d8131a7` brought in the PR of DSA-63 (#150,
P108) and had conflicts in `docs/decisoes-tecnicas.md` and in the three Storybook dictionaries, solved
by keeping both sides without changing the text of either. All threads were answered and resolved.

## Command

```text
git merge-base --is-ancestor 986871acfea034a61427faa1561282404a5f52d6 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `986871a` is an ancestor of `v/5.0.0`. Checked against
`origin/v/5.0.0` at `ce666b3f080fb5ea5de129fff26671aad0bc0e58`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#151](https://github.com/iatecbr/IATec.Nephos/pull/151) | `ce666b3` (2026-11-07T22:17:01Z) | `986871a` | `elvysmarcos` |

## Proof commands

Run on `d8131a7`, the last head with a change of content, in sequence. Every one exited with `0`:

| Command | Detail |
|---|---|
| `npm run build:tokens` | |
| `npm run test:tokens` | |
| `npm test` | 155 files, 6229 tests, with the accessibility gate of the stories |
| `npm run typecheck` | |
| `npm run test:i18n` | |
| `npm run test:naming` | |
| `npm run test:spelling` | |
| `npm run test:operacao` | |
| `npm run build-storybook` | |
| `npm run build:lib` | |
| `npm run test:package` | |
| `git diff --check` | |

The final head `986871a` only adds the merge of `origin/v/5.0.0` at `7f102f2`, which changes
`docs/operacao` of DSA-63 and nothing else. On it, `npm run test:operacao`, `npm run test:spelling`,
`npm run test:naming`, `npm run test:i18n` and `git diff --check` were run again and exited with `0`.

On the final head `986871a`, the Azure pipeline passed at the first attempt (build 620285): the Build
stage, the Test stage and the overall check.

Two things happened before, with no change to the component:

- On the earlier head `40d9f29`, the automatic attempts of the Test stage failed with
  `net::ERR_NETWORK_CHANGED` while loading test files (P106) and with timing tests of other pieces
  (`nph-tooltip`, `nph-sidebar-item`), which are unstable under load. The job was run again, with no
  change to the code, and passed.
- The base `e05a7ee` (the tokens of DSA-69) reworded the `radius/inner` line of `design.md` and broke
  one assertion of the `nph-checkbox` token-contract test on the integration branch itself. It was
  not corrected in this PR: it was fixed on the base, in the PR of DSA-63 (`28ffd51`), and this PR
  took it in the merge `d8131a7`.

## Still open

D-1 and D-2 stay in the task's `pending_decisions`, unchanged. Neither blocks the task:

- D-1, with Indiane: the accepted set has trails of 2, 3 and 4 levels and the collapsed one, and says
  nothing about a trail with 5 or more levels that is not collapsed. The code draws only those counts
  and draws nothing for another one, with a `console.error` in development; a longer path uses the
  collapsed trail. Should a trail of 5 or more levels be drawn in full?
- D-2, with Indiane: the evidence says the hidden levels menu is an `nph-dropdown-menu` with the
  hidden levels in path order, and does not say whether each option carries the icon of its level. The
  code draws the options as text only. Should the menu carry the level icons?
- Not opened as a decision, a known limit recorded in the sheet and in P109: the menu hugs its content
  between 128 and 280 px only where the browser has `calc-size()`; elsewhere it is fixed at the
  280 px ceiling and the floor does not hold. Closing it needs a round of `nph-dropdown-menu` itself,
  which this task does not change.
