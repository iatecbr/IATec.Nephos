```json
{
  "task": "DSA-34",
  "gate": "review-and-merge",
  "date": "2026-10-28",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 8bd5b70a933cb7c6eb4ac1893ef595e1f3966586 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "a2f01724635181de592823419d7dd9d4819c2cb1",
  "external_origin": null
}
```

# DSA-34 — `review-and-merge`

PR #138 (`claude/dsa-34-docs-metadata-96729a`) made every component `Docs` page read `use_when`
and `do_not_use_when` from `src/shared/metadata/<piece>.json` (P71). The block is
`sheetUseDontUse`, in `src/shared/docs/sheet-lists.ts`: in English it shows the Metadata as it
is, and in `pt-BR` and `es` the translation of each item, which the dictionary keeps in
`whenToUse` and `whenNotToUse` at the position of the item (D1). The 29 `Docs` pages use it,
`nph-chip` included, which came in with PR #134 while this one was open.
`src/shared/docs/sheet-lists.test.ts` finds the pages by file name and fails a page whose lists
differ from the Metadata in any of the three languages, an item without a translation, a list
whose number of items differs, and a page that does not build the block from the Metadata of
its own sheet. Four induced violations, one per case, each failed it.

The sheets of `nph-badge`, `nph-button`, `nph-icon` and `nph-label` took the lists Indiane
approved on 2026-10-16, and the Metadata was generated again in the same commit (D2, `V32`).
The other 25 pages already showed the lists of their sheets, item by item; none of their lists
changed. P71 gained a dated annotation with the answer to its open question;
`docs/stories.md` §4.8 and §4.10, `docs/i18n.md` and the rules in `.storybook/i18n/index.js`
say where the lists come from. The protected list of components in `docs/stories.md` did not
change. The PR creates no token and no technical decision. It was merged on
2026-10-28T20:48:35Z, at commit `a2f0172`. The PR head, `8bd5b70`, is an ancestor of the
integration branch tip.

How the review went: Copilot reviewed; no human code review; merged by Elvys's authorization.

No person was requested as reviewer. Copilot was requested three times, at
2026-10-28T20:06:53Z, 20:27:37Z and 20:33:09Z, and reviewed three times as
`copilot-pull-request-reviewer`. The answer to its thread posted under `elvysmarcos` was written
by the agent; it is not a code review.

| Round | Reviewed head | Findings | Answer |
|---|---|---|---|
| 1 | `da95812` | No open issue; approval recommended | — |
| 2 | `a731cc4` | 1 (item 3 of the `nph-label` `use_when` says `info=true`, while in code `info` is the text of the help and the icon also needs `info-label`) | The item is the text Indiane approved on 2026-10-16, and this task does not reword an item (D2): recorded as D-2 for her in `8bd5b70`; the thread was answered and resolved |
| 3 | `8bd5b70` | No open issue; approval recommended | — |

Between rounds 1 and 2, the branch merged `v/5.0.0` three times (`21c81b0`, `5b9b094` with
PR #134, and `e594c6c`) and moved the `nph-chip` page to the Metadata (`140a94b`). Round 3
reviewed the final head, `8bd5b70`.

## Questions that followed the recommendation

- **Q1, the `nph-button` list.** The list approved on 2026-10-16 predates P86 (2026-10-23)
  and DSA-52 (2026-10-27), which rewrote two of its items in the frame and the sheet and added
  the item of the actions column of a table. The sheet took the approved list with the later
  frame text in `use_when` item 7 and `do_not_use_when` item 2, and the actions column item as
  `use_when` item 8, all already translated. Indiane confirms it in D-1.
- **Q2, the per-piece tests.** The 24 Docs tests that compared the English dictionary with
  the Metadata while P71 waited stay; their headers now point to the shared test.

## Command

```text
git merge-base --is-ancestor 8bd5b70a933cb7c6eb4ac1893ef595e1f3966586 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `8bd5b70` is an ancestor of `v/5.0.0`, checked against
`origin/v/5.0.0` at `a2f01724635181de592823419d7dd9d4819c2cb1`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#138](https://github.com/iatecbr/IATec.Nephos/pull/138) | `a2f0172` (2026-10-28T20:48:35Z) | `8bd5b70` | `elvysmarcos` |

The merge `a2f0172` has two parents, `e594c6c` and `8bd5b70`.

## Proof commands

Run in sequence on the final head `8bd5b70`. These exited with `0`:

| Command | Detail |
|---|---|
| `npm run build:tokens` | |
| `npm run test:tokens` | |
| `npm test` | 133 files, 4827 tests, with the accessibility gate of the stories |
| `npm run typecheck` | |
| `npm run test:i18n` | |
| `npm run test:naming` | |
| `npm run test:spelling` | |
| `npm run test:operacao` | |
| `npm run build-storybook` | |
| `npm run build:lib` | |
| `npm run test:package` | |
| `git diff --check` | |

The first `npm test` run on `8bd5b70` failed one test of `nph-tooltip`, a piece this PR does
not touch: `a mouse click on an input during the wait does not open it through focus-visible`,
which depends on the timing of the hover wait. The file then passed three times on its own,
and the whole `npm test` passed again on the same head.

The Azure check (Build and Test Stage) passed on build 611519, for the head `8bd5b70`.

## Known limits

- Only the `useDontUse` block of the "When to use" section reads the Metadata. A second
  "do / do not" block that a page has in another section, as `nph-pagination` and `nph-chip`
  have, still comes from the dictionary (P71, Out of scope).
- The test finds the dictionary key of a page by the `<piece>Docs` convention; `nph-icon`,
  whose key is `docs`, is the one exception, listed in the test.

## Still open

- **D-1 (Indiane):** confirm the `nph-button` list of Q1, or give the one to keep.
- **D-2 (Indiane):** item 3 of the `nph-label` `use_when` reads `info=true`; in code the icon
  needs `info` and `info-label`. The sheet keeps the approved text until she gives the one to
  keep.
