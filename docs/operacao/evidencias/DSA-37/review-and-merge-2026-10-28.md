```json
{
  "task": "DSA-37",
  "gate": "review-and-merge",
  "date": "2026-10-28",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor ffcb30cffe4575af8f071ba39ec5c614452d745a origin/v/5.0.0",
  "exit_code": 0,
  "sha": "600d0f5aad97743137c7b47682cc30a90126178e",
  "external_origin": null
}
```

# DSA-37 — `review-and-merge`

PR #133 (`claude/dsa-37-en-us`) made the English text of the repository American English,
checked by cspell set to `en-US` (P64, amendment of 15/10/2026). It brought cspell `^10.4.0`
as a devDependency, with its row in the versions table of `AGENTS.md`;
`cspell.config.yaml`, where every exclusion carries its reason; `npm run test:spelling`
(`scripts/test-spelling.mjs`), which first feeds the configuration 22 probes on stdin and
then runs cspell over the repository; the British spellings flagged with their American form
(`flagWords`), because the `en-US` dictionary alone accepts `centre`, `catalogue`, `artefact`
and `grey`; three named dictionaries (names, technical words, and the Portuguese names of
Figma, the contract and the domain); and the fixes of `colour`, `behaviour`, `centre`,
`normalises`, `customisation`, `catalogue`, `artefact`, `licence`, `judgement`, `honouring`,
`synchronised`, `serialises` and `full stop` (now `period`) in `.storybook/i18n/en.json`,
`README.md`, `docs/tokens.md`, `docs/consuming.md`, the sheet of `nph-label` (Metadata
regenerated) and three code files. The `pt-BR` and `es` pairs got only the new hash; keys of
`en.json` and story IDs did not change. P64 got the note "Implemented in DSA-37". The PR
changes no token. It was merged on 2026-10-28T19:14:28Z, at commit `600d0f5`. The PR head,
`ffcb30c`, is an ancestor of the integration branch tip.

How the review went: Copilot reviewed; no human code review; merged by Elvys's authorization.

No person was requested as reviewer. Copilot was requested eleven times, from
2026-10-28T14:06:53Z to 19:06:21Z, and reviewed eleven times as
`copilot-pull-request-reviewer`; the first review, at 14:07:51Z, was an error of Copilot,
with no review, and was requested again. The answers to its threads posted under
`elvysmarcos` were written by the agent; they are not a code review.

| Round | Reviewed head | Findings | Answer |
|---|---|---|---|
| 1 | `0c51eed` | 3 (template literal, json/yaml block, design.md list item) | Fixed in `1bf34ba`; `scripts/test-spelling.mjs` and its probes were born here |
| 2 | `1bf34ba` | 1 (closing fence of a json block read as an opening) | Fixed in `987d107`, with a probe |
| 3 | `987d107` | 2 (global snake_case, four-backtick fence) | Fixed in `035f941`, with probes, together with the gaps of the same kind (member access, longer closing fence, `reason` of the exceptions) |
| 4 | `035f941` | 1 (comma inside a quoted value read as an item separator in design.md) | Fixed in `a642f7c`: the three regexes of the override respect quotes, with probes |
| 5 | `a642f7c` | 1 (backtick span in a comment ran past a `*/` on the same line) | Five-round cap reached; Elvys chose a sixth round; fixed in `0c3c3f0`, with a probe |
| 6 | `a99c9f5` | 2 (closing line of a multiline comment; `: [` inside a quoted value) | Elvys chose a seventh round; fixed in `8793ab7`, with probes |
| 7 | `8793ab7` | No open issue | — |
| 8 | `c53cf9b` | No open issue; approval recommended | — |
| 9 | `8c52a59` | 1 (`{…}` inside a quoted value read as a map) | Elvys chose to fix it and to record any further regex edge case as a known limit; fixed in `ffcb30c`, with a probe |
| 10 | `ffcb30c` | No open issue; the summary cites prose in a YAML block scalar | Recorded as a known limit (below) |

All 11 threads were answered and resolved. Each fix was checked by undoing it: its probe
failed with the configuration before it. Between rounds the branch merged `v/5.0.0` at
`0754e28`, `e1e2a63`, `c53cf9b`, `e36fff6` and `8c52a59`, keeping the entries of the other
tasks (DSA-55, DSA-56 and its P101, DSA-57 and #136) in `docs/decisoes-tecnicas.md` and in
`.storybook/i18n/*.json`. Those syncs brought new text that cspell flagged: the Figma names of
DSA-55 and DSA-57 (`a99c9f5`) and the ARIA roles `treegrid` and `gridcell` of DSA-56
(`bc7b4f1`) went into the dictionaries, with no rewrite. Round 10 reviewed the final head,
`ffcb30c`.

## Command

```text
git merge-base --is-ancestor ffcb30cffe4575af8f071ba39ec5c614452d745a origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `ffcb30c` is an ancestor of `v/5.0.0`, checked against
`origin/v/5.0.0` at `600d0f5aad97743137c7b47682cc30a90126178e`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#133](https://github.com/iatecbr/IATec.Nephos/pull/133) | `600d0f5` (2026-10-28T19:14:28Z) | `ffcb30c` | `elvysmarcos` |

The merge `600d0f5` has two parents, `91a0181` and `ffcb30c`.

## Proof commands

Run in sequence on the final head `ffcb30c`. These exited with `0`:

| Command | Detail |
|---|---|
| `npm run test:spelling` | 22 probes; 353 files, 0 issues |
| `npm run build:tokens` | |
| `npm run test:tokens` | |
| `npm test` | 4418 tests |
| `npm run typecheck` | |
| `npm run test:i18n` | |
| `npm run test:naming` | |
| `npm run test:operacao` | |
| `npm run build-storybook` | |
| `npm run build:lib` | |
| `npm run test:package` | 1547 checks, 34 components |
| `git diff --check` | |

The Azure check (Build and Test Stage) passed on build 611363, for the head `ffcb30c`.
Earlier builds failed only on the timing test of `nph-tooltip` ("a mouse click on an input
during the wait does not open it through focus-visible": builds 610971, 611151 and 611231),
on one run that hung until the 30-minute limit of the agent, and on one run whose browser
session did not connect (611292). The PR does not touch `nph-tooltip`; #136 stabilized that
test.

## Known limits

- `labelled` and `cancelled` pass: the `en-US` dictionary accepts both as American variants.
  They were not changed, so as not to edit some 25 docs.stories headings, decisions and done
  tasks.
- `full stop` is two valid words, which no spell checker catches; it was fixed once, by hand.
- A path or a token name with a slash (`color/foreground`) stays out as a name: a word joined
  to another by a slash is not checked. Token names are already American (P20).
- In the override of `design.md` and `GOVERNANCA.md`, accepted by Elvys: a line of prose
  inside a YAML block scalar (`|` or `>`) shaped as `word:` or `word: word` is read as a key
  and its value and stays out (`Colour: centre`); and a flow list or map nested in another
  flow collection is checked. Neither case is in the repository today.

## Still open

The task has no pending decision. Follow-ups, outside this task:

- `npm run test:spelling` is not in the Azure Pipeline; P64 asks for an npm script.
- `tsconfig.json` and `vitest.config.ts` have comments in Portuguese. They are outside the
  scope P64 gives to code and are not British spelling.
