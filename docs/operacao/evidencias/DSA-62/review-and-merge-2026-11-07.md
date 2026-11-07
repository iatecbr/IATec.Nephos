```json
{
  "task": "DSA-62",
  "gate": "review-and-merge",
  "date": "2026-11-07",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 6082af72ae2cc64ec0dca22970e8a906c314038c origin/v/5.0.0",
  "exit_code": 0,
  "sha": "3157ccd2e11cc58046ace8bc0bf153be6533fc00",
  "external_origin": null
}
```

# DSA-62 — `review-and-merge`

PR #154 (`feat/dsa-62-navigation-menu`) implemented `nph-navigation-menu` in the contract accepted in
Figma on 2026-11-03 (documentation frame `3977:7913`, sets `3969:7897`, `3957:6662` and `3957:6722`):

- the bar of top items, each a link or a trigger with an arrow; a trigger opens a panel of grouped links
  in the top layer, `navigation-menu/panel-offset` below it, aligned to its start edge; two groups sit
  side by side with a vertical `nph-separator`; the wide panel hugs its content and the panel link is
  `navigation-menu/panel-width` wide;
- the current state marked by more than color: the indicator under the top item and at the start of the
  panel link, with the current text color; a trigger shows as current when its panel holds the current
  link (derived, D-2);
- disclosure navigation, not a menubar: a `nav` with a name, triggers as buttons with `aria-expanded` and
  `aria-controls`, `aria-current` on the current link, Esc that closes and gives the focus back, a click
  outside and the focus leaving that close; the pointer opens and closes with `motion/hover-delay`;
- the narrow width with the Menu button (a native `button` with the tokens of the secondary ghost
  `nph-icon-button`, a name and `aria-expanded`), which opens the same items as a vertical list, with the
  height limited to the window and an inner scroll;
- a `href` accepted only with the protocols `http:`, `https:`, `mailto:` and `tel:`; invalid input draws
  nothing and reports only in development;
- the component, CSS, tests, the Validation stories and Docs page, the Storybook dictionary in en, pt-BR
  and es, the sheet `fichas/nph-navigation-menu.md`, its generated Metadata and P110 in
  `docs/decisoes-tecnicas.md`.

The PR changes no token and does not edit `design.md`, `nph-dropdown-menu`, `nph-icon-button`,
`nph-separator` or `nph-icon`. Besides the piece, it adds `items` to `DATA_BY_PROPERTY` of
`src/shared/docs/usage.test.ts` and updates the comment of `BRAND_CONTRAST_EXCEPTION` in
`src/shared/docs/brands.ts`. It was merged on 2026-11-07, at commit `3157ccd`, by `elvysmarcos`. The PR
head, `6082af7`, is an ancestor of the tip of the integration branch.

## How the review went

Copilot reviewed; no human code review; merged under Elvys's standing authorization of 2026-11-07.

No review was requested from a person. Copilot was requested when the PR opened and again after each
round of fixes (2026-11-07T22:50:48Z, 23:01:21Z, 23:14:46Z, 23:25:55Z and 23:34:02Z), and reviewed as
`copilot-pull-request-reviewer`. The entries of `elvysmarcos` in the review list are the replies to the
Copilot threads, posted with Elvys's account by the session that fixed them; they are not a code review.
Four rounds had findings that the code had to answer, and the fifth had none. Some findings came in the
review body, under "previously missed issues", with no inline thread; those were answered in a comment
of the PR:

| Reviewed head | Findings | Fixed in |
|---|---|---|
| `c7bb836` | A disabled trigger could open by `active`, by hover or in the narrow list; a narrow list taller than the window could not scroll; a removed and reinserted open instance lost its panel; a hover wait kept running after the width changed (6) | `f858c06`, each with a regression test |
| `f858c06` | A hover wait followed the trigger by index and could open another after a reorder; the pointer leaving closed a panel that held the keyboard focus; the focus leaving to no target left the panel open; Esc also closed a modal dialog around the bar; a scroller in another shadow root did not move the panel; the contrast limit of D-5 was not in the sheet (6) | `1736d4c` and `de66555`, each with a regression test |
| `de66555` | Invalid items during a hover wait threw a `TypeError`; hovering another trigger took away the panel that held the focus; passing over a disabled trigger cancelled a close that was running; a close that was running followed the trigger by index (4) | `39d5b3e`, each with a regression test |
| `39d5b3e` | A close that was running could close the panel the consumer had selected meanwhile (1) | `6b42363`, with a regression test |
| `6b42363` | No open issue. The summary mentions "unpublished findings" on panel positioning, hover dismissal and repeated layout work during scroll, with no thread and no text to act on | — |

After `6b42363` the branch received only the merge `6082af7` of `origin/v/5.0.0` (the release
`5.0.0-rc.2`), with no conflict and no change of the component, so the last review stands for the final
head. All threads were answered. They were left open on GitHub for Elvys to resolve, and the sessions of
the wave did not resolve them: the permission classifier of the app refused the `resolveReviewThread`
mutation.

## Command

```text
git merge-base --is-ancestor 6082af72ae2cc64ec0dca22970e8a906c314038c origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `6082af7` is an ancestor of `v/5.0.0`. Checked against
`origin/v/5.0.0` at `3157ccd2e11cc58046ace8bc0bf153be6533fc00`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#154](https://github.com/iatecbr/IATec.Nephos/pull/154) | `3157ccd` (2026-11-07T23:43:44Z) | `6082af7` | `elvysmarcos` |

## Proof commands

Run on the final head `6082af7`, in sequence. Every one exited with `0`:

| Command | Detail |
|---|---|
| `npm run build:tokens` | |
| `npm run test:tokens` | |
| `npm test` | 159 files, 6436 tests, with the accessibility gate of the stories |
| `npm run typecheck` | |
| `npm run test:i18n` | |
| `npm run test:naming` | |
| `npm run test:spelling` | |
| `npm run test:operacao` | |
| `npm run build-storybook` | |
| `npm run build:lib` | |
| `npm run test:package` | 2024 checks, 41 components |
| `git diff --check` | |

The proofs were also run on each earlier head that changed content (`6fbf726`, `f858c06`, `de66555`,
`39d5b3e` and `6b42363`), and all exited with `0`; the first run of `typecheck` and `build:lib`, on
`11c44e1`, failed on a parameter that no longer had a use, and the first run of `test:spelling`, on
`1736d4c`, failed on a brand name in English text; both were fixed in the next commit.

On the final head `6082af7`, the Azure pipeline passed at the first attempt (build 620320): the Build
stage, the Test stage and the overall check. No rerun was needed.

## Still open

D-1 to D-5 stay in the task's `pending_decisions` and in P110, unchanged, with Indiane. None blocks the
task:

- D-1: the evidence says the Menu button opens the same items as a vertical list and does not say how a
  trigger and its groups show in it. The code shows each trigger as a group, with its label as the group
  label and its links below. Should the list fold the groups of a trigger?
- D-2: the evidence has the current state for a trigger and does not say who turns it on. The code
  derives it from the current link in its panel. Should a trigger be marked current on its own?
- D-3: the evidence has no motion for the arrow or the panel, and the code has none. Should the arrow
  turn or the panel fade?
- D-4: the evidence closes the panel 0.5 s after the pointer leaves and there is no semantic token for
  500 ms; `motion/hover-delay` is 300 ms and the code uses it to open and to close. Does the closing wait
  need its own token?
- D-5: `navigation-menu/current-foreground` (`color/primary-hover`) gives 1.49:1 to 2.16:1 for the current
  text over the dark bar in four of the seven brands. The story `Brands` carries
  `BRAND_CONTRAST_EXCEPTION`, as `nph-sidebar-item` and `nph-dropdown-menu` do for the same token. The
  extension of the exception to a third piece is for Elvys to confirm, and the token is for Indiane.

Also open, not a decision: the review threads of PR #154, answered and fixed, are still unresolved on
GitHub, and the "unpublished findings" of the last Copilot summary have no text to act on.
