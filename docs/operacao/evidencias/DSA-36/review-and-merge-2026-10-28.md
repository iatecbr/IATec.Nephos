```json
{
  "task": "DSA-36",
  "gate": "review-and-merge",
  "date": "2026-10-28",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 211c3dc5e08b25c2a714c48e4a5062ed1c42a7d3 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "7cd215f3e7624c2c1651097e55d77955384a6e20",
  "external_origin": null
}
```

# DSA-36 — `review-and-merge`

PR #141 (`claude/dsa-36-brand-validation-337397`) closed what D1 asked for: a `Validation` story
with the seven brands of P20, in light and dark, for every component where the brand matters,
with no brand global in the toolbar.

**The test finds the list.** `src/shared/tokens/brand-validation.test.ts` runs in Chromium:
- It puts `data-nph-brand` and `data-nph-color-scheme` on the same element (P67) and reads the
  value each `--nph-*` of the generated CSS resolves to there.
- The names whose value changes with the brand, in some scheme, are the brand-dependent tokens.
  A resolved value already follows every `var()` of the chain, so a token that points to a
  brand token counts too.
- It reads the CSS and the TypeScript of each piece (not stories, tests or the `*.demo.ts`
  scenery) and lists the pieces that consume one of those tokens.
- For each piece on the list, it renders the `Brands` story of its `Validation` file and
  requires fourteen frames, one per brand and scheme, each with the piece inside.
- A piece with no `Validation` file of its own is proved in the file of the piece that owns it.
- The test also fails when `.storybook/preview.js` or `.storybook/manager.js` writes
  `data-nph-brand` or declares a brand global.

`brandFrames`, in `src/shared/docs/brands.ts`, draws the frames: the brands in rows and the
schemes in columns, read from the generated CSS. `docs/stories.md` §4.6 and §6.4 record the
practice.

**The list on the merged head has 24 pieces:**
- **Primary color, and focus:** `nph-button`, `nph-badge`, `nph-checkbox`, `nph-radio`,
  `nph-switch`, `nph-slider`, `nph-togglebutton`, `nph-chip`, `nph-option`,
  `nph-multi-combobox`, `nph-dropdown-menu`, `nph-pagination`, `nph-table`,
  `nph-sidebar-item`, `nph-sidebar-subitem` and `nph-sidebar-rail-button`.
- **Focus only:** `nph-label`, `nph-input`, `nph-input-otp`, `nph-textarea`, `nph-select`,
  `nph-combobox`, `nph-image` and `nph-dialog`.

The three D1 named (`nph-button`, `nph-badge` and `nph-label`) are on it; the other 21 joined
by the same rule.

Three pieces are proved in the file of the piece that owns them:
- `nph-option`, in `nph-select`;
- `nph-sidebar-subitem` and `nph-sidebar-rail-button`, in `nph-sidebar-item`.

Hover and focus are not forced: they show by moving the mouse and pressing Tab through the
frames. `nph-dialog` opens from the button of its own frame. The top layer keeps the
inheritance of custom properties, so the open dialog resolves the brand of its frame.

The `*.docs.test.ts` of 18 pieces count `Brands` among their pages. Their old assertion, "there
is no story per brand: the page follows the global brand", became "only the Brands story
carries data-nph-brand". That is the current rule: there is no brand global, and the page
resolves `:root`.

**Induced violations failed the test.** Each was applied, run and reverted:
- the `Brands` export of `nph-badge` renamed;
- `var(--nph-color-primary)` added to `nph-kbd.css`. `nph-kbd` joined the list on its own and
  failed.

The PR creates no token, technical decision or brand global. It was merged on
2026-10-28T22:26:28Z, at commit `7cd215f`. The PR head, `211c3dc`, is an ancestor of the
integration branch tip.

How the review went: Copilot reviewed; no human code review; merged by Elvys's authorization.

No person was requested as reviewer. Copilot was requested twice, at 2026-10-28T22:07:52Z and
22:17:11Z, and reviewed twice as `copilot-pull-request-reviewer`. The thread answer posted under
`elvysmarcos` was written by the agent; it is not a code review.

| Round | Reviewed head | Findings | Answer |
|---|---|---|---|
| 1 | `5d45817` | 1 defect: the group of the `nph-sidebar-item` `Brands` story did not follow `nph-toggle`, so a closed group left its subitem visible and in the Tab order | Fixed in `211c3dc` with the `followGroup` of the scenery, and a regression test that closes and reopens the group of the fourteen frames; the thread was answered and resolved |
| 2 | `211c3dc` | No thread; the summary pointed out that the standalone `nph-option` of the `nph-select` `Brands` story sits outside a listbox | Answered in the PR body and the ready-for-merge comment; follow-up below |

Before the PR opened, the branch merged `v/5.0.0` once (`5d45817`, with the DSA-35 closing),
with no conflict. Round 2 reviewed the final head, `211c3dc`.

Elvys decided the contrast exception on 2026-10-28, answering (a) to the question the session
raised before the PR opened (D2, below).

## Command

```text
git merge-base --is-ancestor 211c3dc5e08b25c2a714c48e4a5062ed1c42a7d3 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `211c3dc` is an ancestor of `v/5.0.0`, checked against
`origin/v/5.0.0` at `7cd215f3e7624c2c1651097e55d77955384a6e20`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#141](https://github.com/iatecbr/IATec.Nephos/pull/141) | `7cd215f` (2026-10-28T22:26:28Z) | `211c3dc` | `elvysmarcos` |

The merge `7cd215f` has two parents, `b6d1291` and `211c3dc`.

## Proof commands

Run in sequence on the final head `211c3dc`. These exited with `0`:

| Command | Detail |
|---|---|
| `npm run build:tokens` | |
| `npm run test:tokens` | |
| `npm test` | 135 files, 5266 tests, with the accessibility gate of the stories |
| `npm run typecheck` | |
| `npm run test:i18n` | |
| `npm run test:naming` | |
| `npm run test:spelling` | |
| `npm run test:operacao` | |
| `npm run build-storybook` | |
| `npm run build:lib` | |
| `npm run test:package` | 36 imports through the package in Chromium |
| `git diff --check` | |

The Azure check (Build and Test Stage) passed on build 611634, for the head `211c3dc`.

On the earlier head `5d45817`, build 611621, the Test Stage failed twice, the run and its
retry, with "Failed to fetch dynamically imported module":
- the run, on two files; the retry, on five other files;
- no assertion failed (5251 and 5105 tests passed);
- builds 610794 and 611183 of earlier pull requests show the same failure.

## Known limits

- The focus of the focus-only pieces shows only by pressing Tab through the frames; at rest,
  their fourteen frames look alike.
- The unit project now imports every `Validation` file, through `brand-validation.test.ts`.

## Still open

- **D2, for Indiane.** In the dark scheme, `color/primary-hover` resolves to
  `theme/brand-400-hover`, a darker shade in `gerencial`, `educacao`, `igrejas` and `rh`.
  Painted as text, it fails 4.5:1:

  | Brand (dark) | `nph-sidebar-item` on `sidebar/panel-background` | `nph-dropdown-menu` checked item on the popover |
  |---|---|---|
  | `gerencial` | 1.47 | 1.01 |
  | `educacao` | 1.00 | 1.46 |
  | `igrejas` | 1.86 | 1.38 |
  | `rh` | 1.56 | 1.10 |

  `sistemas`, `comercial` and `financeiro` pass above 5:1. Until the token is fixed in Figma,
  the `Brands` stories of the two pieces carry `BRAND_CONTRAST_EXCEPTION`
  (`src/shared/docs/brands.ts`), which leaves the axe rule `color-contrast` out of those two
  stories only. It was decided by Elvys on 2026-10-28, and it leaves when the token is fixed.
- **Follow-up: `nph-option` outside a listbox.** In the `Option` and `Brands` stories of
  `nph-select`, the standalone options sit on a stand-in surface with no `role="listbox"`. The
  piece takes `role="option"` through `ElementInternals`, which axe does not read, so the gate
  passes. Fix: give the stand-in surface `role="listbox"` and an accessible name.
