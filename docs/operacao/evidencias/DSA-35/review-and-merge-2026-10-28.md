```json
{
  "task": "DSA-35",
  "gate": "review-and-merge",
  "date": "2026-10-28",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor d35f59424f780d79894a61f51f216b927e8435ce origin/v/5.0.0",
  "exit_code": 0,
  "sha": "7ccd1031b89a28b35417e7d5daf0976fee77c9cc",
  "external_origin": null
}
```

# DSA-35 — `review-and-merge`

PR #140 (`claude/amazing-euclid-045eac`) closed what P70 promised, as P75 amended it.

**The import line, proved in a browser.** The library build and the `exports` field already
existed (P75). `npm run test:package` now ends by importing every component folder in
Chromium through `@iatec/nephos/nph-<name>`. The `exports` field resolves each specifier into
`dist/` (`vitest.package.config.ts` and `scripts/test-package.browser.test.mjs`). For each
component, the test checks that:
- the tag is defined with the class its entry exports;
- the element carries its own CSS, `src/components/<name>/<name>.css`, rule by rule. The
  rules are in the shadow root, or on the document for `nph-label`, which has no Shadow DOM.

`nph-label` goes first, so the test sees that the document had none of its rules until its
own import line ran. The proof never runs from `npm test`, since `dist/` is not versioned.
The Build stage of `azure-pipelines.yml` installs Chromium before `test:package`.

**The Usage section.** Every one of the 29 `Docs` pages shows Usage right after API, built
with the `usage` block of `src/shared/docs/page.ts`. The first row is the markup, kept in
`usageMarkup` of the three dictionaries. The next rows are the import lines, which
`importLine` writes with the package name read from `package.json`. `nph-skeleton` shows
the markup of D1: `<nph-skeleton shape="line"></nph-skeleton>` and
`import '@iatec/nephos/nph-skeleton';`.

`src/shared/docs/usage.test.ts` finds the pages by file name and fails a page when:
- Usage is not the section right after API, or its index link is not right after the API link;
- the markup differs from the dictionary, changes tags or attributes between languages, or
  makes a component report an error while it renders;
- the text of the markup row denies a slot that the component renders;
- an import line is missing or redundant.

Induced violations of each kind failed it. Each was applied, run and reverted:
- `exports` without `./nph-*`;
- `dist/` without the stylesheet of `nph-label`;
- a CSS rule added to `nph-field.css` without rebuilding `dist/`;
- the Usage section removed from `nph-badge`;
- an attribute renamed in the markup of one language;
- the `nph-option` line dropped from `nph-select`, under the first version of the test. Round 1
  showed that the line was redundant, and the test changed with it (Q3).

A lone radio is part of the test itself: the render check must report it.

P70 gained a dated annotation; it creates no technical decision. `docs/stories.md` §4.10
gained the `usage` block, and the task file records Q1 to Q6. The PR creates no token and
does not change the protected list of components in `docs/stories.md`. It was merged on
2026-10-28T21:41:20Z, at commit `7ccd103`. The PR head, `d35f594`, is an ancestor of the
integration branch tip.

How the review went: Copilot reviewed; no human code review; merged by Elvys's authorization.

No person was requested as reviewer. Copilot was requested three times, at
2026-10-28T21:14:20Z, 21:24:55Z and 21:30:28Z, and reviewed three times as
`copilot-pull-request-reviewer`. The answers to its threads posted under `elvysmarcos` were
written by the agent; they are not a code review.

| Round | Reviewed head | Findings | Answer |
|---|---|---|---|
| 1 | `154f62c` | 4 defects: `page-label` of the `nph-pagination` markup without `{page}`; the CSS check accepted any sheet, so `nph-field` would pass on the CSS of `nph-label`; the import graph ignored imports of values, so the `nph-option` line under `nph-select` was redundant; the render check stopped before the checks a component defers to the next frame | Fixed in `4a409c2`, each with a regression test; the four threads were answered and resolved |
| 2 | `4a409c2` | No thread; the summary pointed out that the text of the `nph-textarea` markup row denied its `actions` slot | Fixed in `d35f594` in the three dictionaries, with a test that fails a text denying a slot the component renders; answered in a PR comment |
| 3 | `d35f594` | No open issue; approval recommended | — |

Before the PR opened, the branch merged `v/5.0.0` once (`8e16bed`, with PR #139), with no
conflict. Round 3 reviewed the final head, `d35f594`.

## Questions that followed the recommendation

- **Q1, `nph-tooltip`.** The page shows the standalone tooltip of its sheet, next to a
  `<button id="save">`, and imports `nph-tooltip`. It does not show the D2 markup of DSA-30,
  `nph-label` with `info`, because P77 gave the tooltip its own `for` after D2.
- **Q2, form controls.** A control is shown alone, with `label`; the `nph-field` page shows
  the field with `nph-input`.
- **Q3, import lines of children.** A component that the markup shows and no other line
  registers gets a line of its own: `nph-input` under `nph-field`, and the `nph-button` that
  opens `nph-dropdown-menu`. A child the page's component already imports gets no line,
  whether the import is bare or for its values: `nph-avatar`, `nph-togglebutton`, the
  `nph-button` of `nph-dialog`, and `nph-option`, which `nph-select` imports as `NphOption`.
- **Q4, data by property.** `options`, `items`, `columns` and `rows` are not written as JSON
  in an attribute; the text of the row says the data comes from JavaScript.
- **Q5, `nph-chip`.** The page keeps `<nph-chip></nph-chip>`, the markup of its Figma
  documentation (`3077:2240`), though `text` is required.
- **Q6, where the browser proof runs.** At the end of `npm run test:package`, after
  `npm run build:lib`.

## Command

```text
git merge-base --is-ancestor d35f59424f780d79894a61f51f216b927e8435ce origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `d35f594` is an ancestor of `v/5.0.0`, checked against
`origin/v/5.0.0` at `7ccd1031b89a28b35417e7d5daf0976fee77c9cc`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#140](https://github.com/iatecbr/IATec.Nephos/pull/140) | `7ccd103` (2026-10-28T21:41:20Z) | `d35f594` | `elvysmarcos` |

The merge `7ccd103` has two parents, `4b40e91` and `d35f594`.

## Proof commands

Run in sequence on the final head `d35f594`. These exited with `0`:

| Command | Detail |
|---|---|
| `npm run build:tokens` | |
| `npm run test:tokens` | |
| `npm test` | 134 files, 5161 tests, with the accessibility gate of the stories |
| `npm run typecheck` | |
| `npm run test:i18n` | |
| `npm run test:naming` | |
| `npm run test:spelling` | |
| `npm run test:operacao` | |
| `npm run build-storybook` | |
| `npm run build:lib` | |
| `npm run test:package` | 36 imports through the package in Chromium |
| `git diff --check` | |

The first `npm test` run on `d35f594` failed one test of `nph-tooltip`, a piece this PR does
not touch: `a mouse click on an input during the wait does not open it through focus-visible`,
which depends on the timing of the hover wait. The whole `npm test` passed again on the same
head.

`npm run pack:check` exited with `0` on `75b14ef`, before the review; the commits after it
change no file of the package. The Azure check (Build and Test Stage), whose Build runs
`pack:check`, passed on build 611574, for the head `d35f594`.

## Known limits

- `vitest.package.config.ts` is not type-checked, like `vite.config.lib.ts`: the repository
  has no Node types.
- The page whose data only comes by a property shows an empty piece. `nph-dropdown-menu`
  without `items` and `nph-table` without `columns` report it when the markup renders, and
  the test expects exactly that report.

## Still open

No D-item.
