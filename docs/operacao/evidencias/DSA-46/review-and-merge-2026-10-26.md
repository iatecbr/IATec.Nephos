```json
{
  "task": "DSA-46",
  "gate": "review-and-merge",
  "date": "2026-10-26",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 9638f0d39b2cc4af3d0ae0ea1df02424f80f360b origin/v/5.0.0",
  "exit_code": 0,
  "sha": "926cda9527a74b092d9cd7f17d96f4c11322fc75",
  "external_origin": null
}
```

# DSA-46 — `review-and-merge`

PR #120 (`claude/dsa-46-nph-combobox-43fc0a`) brought `nph-combobox`, the field
where the person types to filter a list of options and picks one, with its list as
a module that `nph-multi-combobox` (DSA-31) takes. It came with its CSS and tests,
six Validation stories, the Docs page, the dictionary in en, pt-BR and es, the spec
and its generated Metadata, and P95. The PR changes no token. Elvys merged it on
26-10-2026, at commit `926cda9`, as `component-handoff.md` gives Elvys the merge
of the pull requests Claude opens. The PR head, `9638f0d`, is an ancestor of the
integration branch tip.

How the review went: Copilot reviewed; no human code review; merged by Elvys.

No review was requested from a person. Copilot was requested six times, from
2026-10-26T20:31:26Z to 21:30:07Z, and reviewed six heads as
`copilot-pull-request-reviewer`. The other reviews on the PR, by `elvysmarcos`,
carry the replies to Copilot's threads.

| Reviewed head | Findings | Fixed in |
|---|---|---|
| `87e7c4e` | An option added inside `nph-create` was missing from the form data and the validity when `input` and `change` ran; the highlight shifted after an emoji; a row reused by Lit lost the default icon; clearing a search with no choice, setting the same value and a reset to the same default did not redraw | `04e58d0`, with a regression test for each |
| `04e58d0` | No open thread; two previously missed issues: a match ending inside a decomposed Hangul syllable; options given at once inside `nph-search` with `filter="none"` did not open the list | `31b068a`, with regression tests |
| `31b068a` | No open thread; two previously missed issues: the final sigma and the sigma did not match; a chosen icon option with no `icon` showed the field icon instead of `globe` | `463e605`, with regression tests |
| `463e605` | No open thread; two previously missed issues: a remote search that left out the chosen option lost the choice; clearing with an option of empty value chose that option | `9d149fa`, with regression tests; P95 and the spec record the two rules |
| `249212f` | The saved form state after clearing, with an option of empty value, restored that option | `99cc1f4`, with a regression test |
| `99cc1f4` | No open thread; one previously missed issue: in a label written decomposed, the combining mark can stay outside the highlight | Recorded as a known limit in P95 and in the spec, with a follow-up, at `779471b` |

Every thread was answered and resolved. The sixth review came after the five
rounds of the wave's rule; Elvys decided to send `99cc1f4`, run it and record a
new finding as a known limit with a follow-up, which `779471b` does, changing only
P95 and the spec. Between the reviews, `e5a2ccb` merged `v/5.0.0` with PR #119
(`nph-table`), resolving the conflicts in `docs/decisoes-tecnicas.md` and in the
three dictionaries; `249212f` merged the closing of DSA-49 and `9638f0d` merged
PR #121 (the Azure pipeline), both with no conflict.

## Command

```text
git merge-base --is-ancestor 9638f0d39b2cc4af3d0ae0ea1df02424f80f360b origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `9638f0d` is an ancestor of `v/5.0.0`, checked
against `origin/v/5.0.0` at `926cda9527a74b092d9cd7f17d96f4c11322fc75`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#120](https://github.com/iatecbr/IATec.Nephos/pull/120) | `926cda9` (2026-10-26T22:12:19Z) | `9638f0d` | `elvysmarcos` |

The merge `926cda9` has two parents, `697ce76` and `9638f0d`. Its tree is the
tree of the head.

## Proof commands

Run on the final head `9638f0d`, in sequence. These exited with `0`:

| Command | Detail |
|---|---|
| `npm run build:tokens` | |
| `npm run test:tokens` | 25 checks |
| `npm test` | 3691 tests |
| `npm run typecheck` | |
| `npm run test:i18n` | |
| `npm run test:operacao` | |
| `npm run build-storybook` | |
| `npm run build:lib` | |
| `npm run test:package` | 1344 checks, 29 components |
| `git diff --check` | |

`npm run test:naming` exits with `1` on the findings that already exist on the
base; the PR adds none. On the heads `249212f`, `99cc1f4` and `779471b` the first
`npm test` failed on timing tests of `nph-tooltip`, which the PR does not touch,
with the machine loaded; the repeated run passed in full on the same head.

## Still open

D-1 to D-5 stay in the task's `pending_decisions`, with Indiane, unchanged. They
change no token and do not block the task: the drawing of the create row (D-1),
the content of the shortcuts footer (D-2), the color of the rest of the text on
the active option (D-3), Escape with the list closed (D-4) and the first match
active while the person types (D-5).

Follow-up recorded in P95: extend the end of a match over the combining marks that
follow it, so a label written decomposed keeps its accent inside the highlight.
