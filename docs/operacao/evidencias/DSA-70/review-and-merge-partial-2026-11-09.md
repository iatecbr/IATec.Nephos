```json
{
  "task": "DSA-70",
  "gate": "review-and-merge",
  "date": "2026-11-09",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 2984ec2ecaad43884a882d45b8ef8fa791bdb248 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "dc857e7",
  "external_origin": null
}
```

# DSA-70 — `review-and-merge`, partial

PR #163 (`feat/dsa-70-d-itens`) applied in the code the answers Indiane gave on 2026-11-09 to the pending
decisions of lots 1 and 2, in every row of the table of the task except the one of `nph-table`:

- **`nph-switch`** has the small size (`size="small"`), and the switch slot of the `nph-dropdown-menu` item uses
  it; **`nph-dropdown-menu`** reads `color/primary-text` on the checked item of single choice, moves the
  keyboard focus to the item under the pointer, and its open trigger takes the open look and `aria-expanded`
  (for that, `nph-button` paints the open look also for `aria-haspopup="menu"`).
- **`nph-navigation-menu`** closes on `navigation-menu/close-delay`, draws each trigger of the narrow list as a
  collapsed row with its arrow, turns the arrow and fades the panel on the motion roles, and shrinks a long
  row label with an ellipsis.
- **`nph-hover-card`** reads `color/link` on the link and centers on it when it has no arrow;
  **`nph-context-menu`** reads the two long-press tokens; **`nph-select`** drops the accent background of the
  arrow area when disabled; **`nph-dialog`** stops redefining the solid secondary; **`nph-progress`** accepts 2
  steps or more; **`nph-popover`** reads `text/heading-sm` on the title.
- The `Brands` stories of `nph-dropdown-menu`, `nph-sidebar-item`, `nph-navigation-menu` and `nph-hover-card`
  no longer carry `BRAND_CONTRAST_EXCEPTION`; the axe gate passes without it. The one of `nph-context-menu`
  keeps it.
- Tests, stories, sheets, generated Metadata and the Storybook dictionary in en, pt-BR and es follow each
  piece, and the technical choices are P114 in `docs/decisoes-tecnicas.md`.

The PR changes no token. It was merged on 2026-11-09, at commit `dc857e7`, under Elvys's standing
authorization of 2026-11-07. The PR head, `2984ec2`, is an ancestor of the tip of the integration branch.

**The gate stays `pending`.** The row of `nph-table` (`table/link-foreground` in dark, from `theme/brand-200` to
`color/link`) changes the value of a token in the token source, and the code agent never creates or changes
a token. It waits for Indiane, in Figma (pending decision `T-1`). When it is in, the source and the test
`link in dark mode` of `nph-table.test.ts` change together, and this gate can pass.

## How the review went

Copilot reviewed; no human code review; merged under Elvys's standing authorization of 2026-11-07.

No review was requested from a person. Copilot was requested when the PR opened and again after the round of
fixes, and reviewed as `copilot-pull-request-reviewer`. The entries of `elvysmarcos` in the review list are the
replies to the Copilot threads, posted with Elvys's account by the session that fixed them; they are not a
code review.

| Reviewed head | Findings | Fixed in |
|---|---|---|
| `25286a4` | Two threads: in the narrow list a label wider than the line pushed the arrow out of the row; the Storybook scene clicked an open row again when it was prepared twice | `2984ec2`: the label shrinks with an ellipsis and the arrow does not shrink, with a regression test; the scene clicks only a collapsed row |
| `2984ec2` | No new finding | Not applicable |

The proofs were run on the final head, `2984ec2`: build:tokens, test:tokens, test (171 files, 7118 tests),
typecheck, test:i18n, test:naming, test:spelling, test:operacao, build-storybook, build:lib, test:package and
`git diff --check` all exit 0. The Azure Build and Test were SUCCESS on that head. On `25286a4` the Azure Test
failed with `Failed to fetch dynamically imported module` and a real failure, a position test of
`nph-context-menu` that measured the panel before its enter animation ended (fixed in `2984ec2`); on
`2984ec2` the stage failed once with `ERR_NETWORK_CHANGED` and a click timeout in `nph-sidebar-item`, and was
run again.

## Command

```text
git merge-base --is-ancestor 2984ec2ecaad43884a882d45b8ef8fa791bdb248 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `2984ec2` is an ancestor of `v/5.0.0`. Checked against `origin/v/5.0.0`
at `dc857e7`.

## Still open

- **T-1**: the `nph-table` row, for Indiane (see above).
- DSA-45 D-3, DSA-62 D-2, DSA-67 D-3, DSA-69 D-1 and D-2 stay open, in their own tasks.
