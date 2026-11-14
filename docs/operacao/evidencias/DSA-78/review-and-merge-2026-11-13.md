```json
{
  "task": "DSA-78",
  "gate": "review-and-merge",
  "date": "2026-11-13",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor ca1914ac5c7620b8da13dbef66589911360562ff origin/v/5.0.0",
  "exit_code": 0,
  "sha": "6c6875f",
  "external_origin": null
}
```

# DSA-78 — `review-and-merge`

PR #170 (`feat/dsa-78-collapsible`) implemented `nph-collapsible` in the contract accepted in Figma on
2026-11-12 (documentation frame `6014:1688`, component set `6006:2250`, root `6005:482`):

- **`nph-collapsible`**, a trigger that opens and closes a block of content in the same place on the page. Three
  types (`line`, `button`, `preview`), two appearances (`flush`, `card`), the indicator at the end or at the
  start, three sizes of the line type, the start icon, the description and the free content slot. It follows the
  disclosure pattern of the APG: `aria-expanded` and `aria-controls`, closed content with `hidden="until-found"`
  (found by the page search, which opens it with no growth), the focus that stays on the trigger. The content
  grows and the chevron turns in `collapsible/expand-*`, and nothing moves with reduced motion. `nph-toggle`
  fires only when the person opens or closes it. It consumes the `collapsible/*` tokens already on `v/5.0.0` and
  creates or changes none. It comes with the component, the CSS, the tests, the Validation stories and the Docs
  page, the Storybook dictionary in en, pt-BR and es, the sheet `fichas/nph-collapsible.md`, its generated
  Metadata and P121 in `docs/decisoes-tecnicas.md`.
- **`nph-button`**, an amendment strictly additive to P68, after P111 and P116, in its own commit (`79fae03`),
  asked for by the orchestrator session in place of writing into the shadow root of the button: a host that
  carries `aria-expanded` `true` or `false` and no `aria-haspopup` hands the value to its native button and draws
  nothing new, and the new `controls` property (an element, property only) is given to the native button as
  `ariaControlsElements`. A host without `aria-expanded`, `aria-haspopup` `dialog` and `menu`, and any other
  `aria-haspopup` behave as before; the tests of the button prove it. The sheet, the Metadata and the API table of
  the Docs page of the button follow.
- **Two fixes of the base**, each in its own commit, asked for by the orchestrator session: `fix(naming)`
  (`b145da0`), three entries in `scripts/language-exceptions.json` for the Figma texts and the brand names quoted
  in DSA-80 and DSA-81, and `fix(spelling)` (`a5ef5ec`), two per-file overrides in `cspell.config.yaml` and
  `grey` to `gray` on one line of the DSA-80 task. The text of the evidence of Indiane was not edited.

The PR does not change the accordion, the vertical stepper, `nph-icon`, `design.md` or any token. It was merged
on 2026-11-14T01:55:32Z (2026-11-13 in Brazil), at commit `6c6875f`, under Elvys's standing authorization of
2026-11-07. The PR head, `ca1914a`, is an ancestor of the tip of the integration branch.

## How the review went

Copilot reviewed; no human code review; merged under Elvys's standing authorization of 2026-11-07.

No review was requested from a person. Copilot was requested when the PR opened and again after each round of
fixes, and reviewed as `copilot-pull-request-reviewer`. There were four reviews, one round with findings that the
code had to answer:

| Reviewed head | Findings | Fixed in |
|---|---|---|
| `5d3b0dc` | No open issue. It noted that the growth of the height against the motion rules of `design.md` and the accessibility exceptions of the stories wait for a person | Not applicable |
| `a5ef5ec` | Three threads, all in `docs/decisoes-tecnicas.md`: the index row of P121 still listed four pending items with the `aria-expanded` as D-1, and two Status lines of other decisions (hover card, sidebar) had been changed from D-1 to D-4 into D-1 to D-3. The summary also noted that the chevron at the start went flat in right-to-left writing during its transition | `e480f6d` (the row follows the three canonical items and the two Status lines are back as in the base, so only P121 and its row differ from the base) and `ca1914a` (closed and open use the same list of transformations, with a regression test that measures the matrix during the transition) |
| `e480f6d` | Replies and resolutions of the three threads, no new finding | Not applicable |
| `ca1914a` | No open issue; three resolved since the last review. It repeated that the motion rule and the accessibility exceptions wait for a person | Not applicable |

Before the PR, the first full run of `npm test` failed in the accessibility gate of nine stories: the
`label-content-name-mismatch` of the trigger with a description (the name is the title and the description is its
accessible description), the `color-contrast` of the faded content of a disabled piece that is open, and the
text of the light DOM slotted into the pieces of the `Brands` matrix, where the gate cannot read the background.
The first two became the story-level exceptions `DESCRIPTION_EXCEPTION` and `DISABLED_CONTENT_EXCEPTION`, written
with their reasons in `nph-collapsible.demo.ts`, and the `Brands` story holds a button as its content. **Elvys
accepted the two accessibility exceptions on 2026-11-13**, as the orchestrator session relayed. A review of the
whole component before the first Copilot request (lifecycle, focus, keyboard, right-to-left, reduced motion,
invalid input) added the opening with no growth on a page search, the literal name of the event for the manifest
of the package and the fragment navigation test, each with a test.

The proofs were run on `ca1914a`, the final head: `build:tokens`, `test:tokens`, `test`, `typecheck`,
`test:i18n`, `test:naming`, `test:operacao`, `build-storybook`, `build:lib`, `test:package` and
`git diff --check` all exit 0. **`test:spelling`: cspell on every file except `design.md` = 0; `design.md` is
unchanged in this PR; the full cspell of `design.md` does not end (more than 60 minutes) on the base `fb5178f`, a
problem of the base under investigation by the orchestrator session.** The orchestrator session accepted that
reading for this gate. The Azure Build and Test failed twice on the net::ERR_NETWORK_CHANGED import flake (P106),
on `a5ef5ec` (build 627485) and on `ca1914a` (build 627519), with no test failure in the log, and passed when run
again; they were SUCCESS on the final head, and the merge state was CLEAN.

## Command

```text
git merge-base --is-ancestor ca1914ac5c7620b8da13dbef66589911360562ff origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `ca1914a` is an ancestor of `v/5.0.0`. Checked against `origin/v/5.0.0` at
`6c6875f`.

## Still open

Three decisions wait for Indiane, recorded in the task and in P121; none blocked the merge:

- **D-1**: the preview type lifts the cut at three lines with no movement, because a cut of lines is not a size
  that can grow.
- **D-2**: the preview type draws its button even when the text has fewer than three lines.
- **D-3**: the content grows in `motion/expand-*`, as the accepted documentation asks, and `design.md` says to
  animate only opacity and transform, and not height. She confirms the reading or an exception for the expansion
  of a disclosure.

The full cspell of `design.md` stays a problem of the base, outside this task. The accordion item becomes an
instance of the collapsible later, after both are accepted, and the vertical stepper is built on it in its own
task (DSA-73).
