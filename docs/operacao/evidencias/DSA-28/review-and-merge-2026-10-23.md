```json
{
  "task": "DSA-28",
  "gate": "review-and-merge",
  "date": "2026-10-23",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor a73c09935119db19219e5ec142a11d83fd93da46 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "4134cd03a9f4fcb62d443ae5da1819ee47e12804",
  "external_origin": null
}
```

# DSA-28 — `review-and-merge`

PR #105 (`claude/dsa-28-nph-field-66625a`) brought `nph-field`, the form field that
composes the label, the control, the help text, the error message and the counter. It
came with its CSS and tests, seven Validation stories, the Docs page, the dictionary in
en, pt-BR and es, the spec and its generated Metadata, and P83, which records the API of
the field and the field–control contract that the form controls take. The PR changes no
token. Elvys merged it on 23-10-2026, at commit `4134cd0`, as `component-handoff.md`
gives Elvys the review and merge of his own pull requests. The PR head, `a73c099`, is an
ancestor of the integration branch tip.

How the review went: Copilot reviewed; no human code review; merged by Elvys.

A review by `maurocsjr` was requested when the PR opened and removed at
2026-10-23T19:40:57Z, under the wave's rule that Copilot reviews. Copilot was requested
seven times, from 2026-10-23T20:01:26Z to 20:57:08Z, and reviewed seven times as
`copilot-pull-request-reviewer`. The other reviews on the PR, by `elvysmarcos`, carry the
replies to Copilot's threads.

| Reviewed head | Findings | Answer |
|---|---|---|
| `ebe3667` | A control swapped between two fields in the same turn lost what the new field wrote; `slot=""` was left out of the default slot; the contract check ran after the writes, so an element without the contract passed it in a disabled field | Fixed in `d0630c9`, with a regression test for each |
| `d0630c9` | P83 stated the defaults of D-1 to D-4 as contract; the readout of the Control contract story could keep the previous language | `c2fc243`: P83 marks the four defaults as provisional until Indiane answers; the readout uses one callback per render, with a test that switches the language (the defect did not reproduce on the previous code) |
| `c2fc243` | A lazy control defined while the field was out of the page stayed unnamed when the field came back | Fixed in `13338fb`, with two regression tests |
| `13338fb` | No open thread; one issue in the summary: a help or error text with no space overflowed the field | Fixed in `f24220c`, with three regression tests |
| `dea728a` | A disabled `<fieldset>` around the field disabled the `nph-input` but left the error visible | Fixed in `3ecdcc5`, with regression tests on the real `nph-input` |
| `3ecdcc5` | Inserting or removing a `<legend>` before the one that holds the field does not refresh its disabled state | Elvys's decision: a known limit in P83, with a follow-up for a future task (`07d97e3`); no code change |
| `a73c099` | No open issue; approval recommended | — |

Every thread was answered in Portuguese and resolved. Between the reviews, the branch
merged `v/5.0.0` with no conflict in code; the conflicts were in
`docs/decisoes-tecnicas.md` and in the dictionaries, resolved keeping the entries of the
other tasks (P78, P80, P84, P90).

## Command

```text
git merge-base --is-ancestor a73c09935119db19219e5ec142a11d83fd93da46 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `a73c099` is an ancestor of `v/5.0.0`, checked against
`origin/v/5.0.0` at `4134cd03a9f4fcb62d443ae5da1819ee47e12804`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#105](https://github.com/iatecbr/IATec.Nephos/pull/105) | `4134cd0` (2026-10-23T21:05:54Z) | `a73c099` | `elvysmarcos` |

The merge `4134cd0` has two parents, `d3098f8` and `a73c099`.

## Proof commands

Run on the final head `a73c099`. These exited with `0`:

| Command | Detail |
|---|---|
| `npm run build:tokens` | no diff in `src/tokens` |
| `npm run test:tokens` | 25 checks |
| `npm test` | 1748 tests; 131 of `nph-field` |
| `npm run typecheck` | |
| `npm run test:i18n` | |
| `npm run test:operacao` | 48 tasks |
| `npm run build-storybook` | |
| `npm run build:lib` | |
| `npm run test:package` | 855 checks, 17 components |
| `git diff --check origin/v/5.0.0 HEAD` | |

`npm run test:naming` exits with `1` on `scripts/test-package.mjs` and on Portuguese
words in `docs/operacao/` records. The result is the same as on the base, and none of
those files is in the diff of the PR.

## Still open

D-1 to D-5 stay in the task's `pending_decisions`, with Indiane, unchanged. They change
no token and do not block the task; P83 marks D-1 to D-4 as provisional defaults:

- D-1: the alignment of the counter line in error and the space above it.
- D-2: the space between the help text and the counter, and what happens when the help
  does not fit.
- D-3: whether the help comes back when disabled hides the error.
- D-4: long help and error texts wrapping, including a run with no space.
- D-5: `design.md` has no `use:` line for `layout/field-width` and `layout/input-width`.

Follow-ups recorded elsewhere:

- The options of a group in the stories are demonstration elements until `nph-checkbox`
  (DSA-17) and `nph-radio` (DSA-18) are merged; then the stories take the real pieces.
- The dynamic `<legend>` case is a known limit of P83, with its follow-up there.
