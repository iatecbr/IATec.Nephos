```json
{
  "task": "DSA-69",
  "gate": "review-and-merge",
  "date": "2026-11-08",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor f0448f9b3ab1d546c2e3f4cfada868377757e7e1 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "71b7df5",
  "external_origin": null
}
```

# DSA-69 — `review-and-merge`

PR #160 (`feat/dsa-69-context-menu`) implemented `nph-context-menu` in the contract accepted in Figma on
2026-11-06 (documentation frame `4838:27591`, component set `4819:15828`), and applied the accepted
changes to the shared pieces:

- **`nph-context-menu`**, a piece of its own: `for` names the object that takes the right click; it opens on
  the `contextmenu` event, on Shift+F10 and the Menu key, and on a touch held for about 700 ms; the panel
  opens with its start top corner at the point and turns to the other side on collision, never leaves the
  window and is drawn only while its object is inside it; one submenu level, open to the right and to the
  left only when there is no room; single and multiple choice, the destructive item, the two sizes, the
  event `nph-item-select` with `detail.origin`, and the invalid input that draws nothing and reports only in
  development. It has no token of its own and uses the `dropdown/*` ones; the component, CSS, tests, the
  Validation stories and Docs page, the Storybook dictionary in en, pt-BR and es, the sheet
  `fichas/nph-context-menu.md`, its generated Metadata and P113 in `docs/decisoes-tecnicas.md`.
- **`nph-dropdown-menu`**, the look only: `dropdown/panel-radius` and `dropdown/item-radius`, the focus
  ring `dropdown/item-focus-border-radius` and `dropdown/item-focus-halo-radius`, the line
  `dropdown/separator`, the destructive item in `dropdown/item-destructive-*`, the start icon solid on hover
  and on visible focus in every type, selection and size, and the compact destructive item. Its tests,
  sheet and dictionary follow; the consumers (`nph-navigation-menu`, `nph-notification`, `nph-select`,
  `nph-sidebar-item`) stay green.
- **`nph-icon`**: `arrow-pointer`, light and solid, with the one-word change of the `icones_nucleo` list of
  `design.md` that its test requires (commit `5e4cb90`, alone). Elvys authorized that edit on 2026-11-08,
  limited to that list and with no token.

The PR changes no token. It was merged on 2026-11-08, at commit `71b7df5`, under Elvys's standing
authorization of 2026-11-07. The PR head, `f0448f9`, is an ancestor of the tip of the integration branch.

## How the review went

Copilot reviewed; no human code review; merged under Elvys's standing authorization of 2026-11-07.

No review was requested from a person. Copilot was requested when the PR opened (2026-11-08T04:08:27Z)
and again after each round of fixes (04:19:21Z, 04:24:58Z, 04:33:09Z and 04:40:28Z), and reviewed as
`copilot-pull-request-reviewer`. The entries of `elvysmarcos` in the review list are the replies to the
Copilot threads, posted with Elvys's account by the session that fixed them; they are not a code review.
There were four rounds with findings that the code had to answer and a last one with no new finding (the
limit of five rounds was reached):

| Reviewed head | Findings | Fixed in |
|---|---|---|
| `97c3cf0` | Three threads: the left-submenu example was pinned to the end of its frame, not of the window; `aria-keyshortcuts` kept `Alt+←` and the Spanish `Supr` instead of key names; the `Brands` story left out the checked single choice | `6a33fdb`, each with a regression test; `b6f51c9` taught the spell checker the word `Supr` |
| `6a33fdb` | Two threads: the minimum width of the example frames overflowed a narrow window; panels of examples below the window were drawn over the page | `68c42ff`, each with a regression test (the panels now follow the object in and out of the window, with an `IntersectionObserver`) |
| `d1f3f1c` | One thread: disabling the item whose submenu was open left it highlighted with a solid icon | `b148119`, with a regression test (the submenu closes) |
| `b148119` | One thread: a checked single choice that is destructive lost the destructive color at rest and on focus | `ed1dd14`, with a regression test |
| `ed1dd14` | No new finding; it listed two earlier threads, already answered, and the items that wait for people (the icon color, Esc, the exceptions of the gate) | Not applicable |

After `ed1dd14` the branch took one merge of `origin/v/5.0.0` (PR #161, only
`docs/validation/angular-rc2/`) and no commit of its own; before it, the merges brought PR #157
(`nph-hover-card`) and PR #158 (the hover tests of `nph-navigation-menu`). The proofs were run on
`ed1dd14`: all twelve exit 0, with 7048 tests in 171 files in `npm test`. After the last merge, which
brought documentation only, `npm run test:spelling`, `npm run test:naming`, `npm run test:operacao` and
`git diff --check` were run again and exit 0. The Azure Build and Test were SUCCESS on the final head,
`f0448f9`. Three runs needed a rerun on the agent with no test failing in the code: the dynamic import of
the `test:package` step (44 tests, "Failed to fetch dynamically imported module"), a click timeout of 95 ms
in `nph-sidebar-item`, and `ERR_NETWORK_CHANGED` that left 24 story files unloaded.

## Command

```text
git merge-base --is-ancestor f0448f9b3ab1d546c2e3f4cfada868377757e7e1 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `f0448f9` is an ancestor of `v/5.0.0`. Checked against `origin/v/5.0.0`
at `71b7df5`.

## Still open

Five decisions wait for Indiane, recorded in the task and in P113; none blocks the merge:

- **D-1**: how the code knows the row of a table menu (`for` plus `detail.origin`).
- **D-2**: the contract has no event of opening or closing, so the piece fires none.
- **D-3**: the long press uses 700 ms and a movement limit of 10 px, which have no token.
- **D-4**: the icon at rest, in `color/muted-foreground` (DSA-69) or in the color of the label (DSA-45); the
  code keeps the label color in both menus.
- **D-5**: Esc closes the submenu first and the menu on the second press; the evidence says Esc closes the
  menu.

For Elvys to confirm: the extension to this piece of the accessibility exceptions `label-content-name-mismatch`
(stories with a shortcut) and `color-contrast` (the `Brands` story, which keeps the checked single choice),
and two threads already fixed that stay open on the PR, which he resolves.
