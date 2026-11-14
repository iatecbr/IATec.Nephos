```json
{
  "task": "DSA-79",
  "gate": "review-and-merge",
  "date": "2026-11-14",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor bb1e0a27aee86e47f828cafd8396d385b6cf2a90 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "e8ea112",
  "external_origin": null
}
```

# DSA-79 — `review-and-merge`

PR #172 (`feat/dsa-79-combobox-free-text`) added the free text variant to `nph-combobox` in the contract accepted in
Figma on 2026-11-12 (documentation frame `6047:3760`, component set `6040:3286`, root `6040:2120`):

- **The variant**, a field with no divider and no arrow whose typed text is the value and whose list only suggests.
  It is chosen by the boolean attribute `free-text`, and `no-suggestions-label` is the sentence the screen reader
  hears when the text has no suggestion. The typed text is the value (`value` and `query`); a pick writes the text
  of the suggestion and the `value` of an option is not used. The native `input` crosses the shadow root, `change`
  fires when the text settles, and `nph-search` says the text. No suggestion is active while typing: ArrowDown
  activates the first, ArrowUp with the list closed the last, Alt+ArrowDown opens without activating, Enter with
  none active keeps the text, Escape with the list closed clears it, and Tab, leaving the field and an outside
  click keep the text. With no suggestion the list closes with no `nph-empty` and a status region outside the list
  speaks. The end of the field takes `combobox/free-text-padding-end`, with and without the clear button. It comes
  with the CSS, the tests (`nph-combobox.free-text.test.ts`), three Validation pages and the Docs section "Free
  text", the Storybook dictionary in en, pt-BR and es, the sheet and its Metadata, and P122 in
  `docs/decisoes-tecnicas.md`.
- **The nph-combobox with the arrow did not change**: its create row (D-1), its first suggestion active while
  typing (D-5 of DSA-46) and its empty list stay as they are. `nph-combobox.test.ts` and the list module are
  byte-identical to the base, and the tests of `nph-multi-combobox` stayed green. `nph-combobox.docs.test.ts` only
  grew (the page list and the free text pages).

The PR created or changed no token and did not edit `design.md`. It was merged on 2026-11-14T14:07:01Z, at commit
`e8ea112`, under Elvys's standing authorization of 2026-11-07. The PR head, `bb1e0a2`, is an ancestor of the tip
of the integration branch.

## How the review went

**Copilot did not review the code; no human code review; merged under Elvys's standing authorization of
2026-11-07.**

No review was requested from a person. Copilot was requested when the PR opened and again on the final head, and
`copilot-pull-request-reviewer` answered both times, on `9bde215` and on `bb1e0a2`, with a comment that it "was
unable to review this pull request because the user who requested the review has insufficient remaining quota"
(the billing source of Copilot code review). So the pull request has no review thread, and no code review of the
change was done by anyone before the merge. The session before the merge relayed that Copilot had reviewed the head;
the reviews on the pull request say otherwise, and this record follows the pull request.

Before the pull request, the work was reviewed twice by the advisor of the session, once on the plan and once on
the finished change. The second review found a wrong decision reference in the sheet (DSA-79 D-5 for DSA-46 D-5), a
context file that listed sources not yet opened, and proofs that had run before the last edit; all three were fixed
in `9bde215` and the proofs were run again. The same review added, in the same commit, the token and API contract
tests, the accessible name of the spinner under `aria-busy`, and the known limits of P122.

The proofs were run in sequence, with every exit code read, on `bb1e0a2`, the final head: `build:tokens`,
`test:tokens`, `test`, `typecheck`, `test:i18n`, `test:naming`, `test:spelling`, `test:operacao`,
`build-storybook`, `build:lib`, `test:package` and `git diff --check` all exit 0. **`test:spelling`: cspell on every
file except `design.md` = 0; `design.md` is unchanged in this PR; the full cspell of `design.md` does not end (more
than 60 minutes).** The Azure Build and Test were SUCCESS on the final head, after the Test stage ran again for the
`ERR_NETWORK_CHANGED` flake (P106), as the orchestrator session reported, and the merge state was CLEAN. No
accessibility exception was needed in any story.

## Command

```text
git merge-base --is-ancestor bb1e0a27aee86e47f828cafd8396d385b6cf2a90 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `bb1e0a2` is an ancestor of `v/5.0.0`. Checked against `origin/v/5.0.0` at
`e8ea112`.

## Still open

Two decisions wait for Indiane, recorded in the task and in P122; neither blocked the merge:

- **D-1**: a click on the free text field takes the focus and does not open the list.
- **D-2**: with text in the field, the arrows show only the suggestions that contain it.

A finding of the evidence also stays recorded in P122, with no change to the arrow variant: the accepted
documentation of the free text variant says the nph-combobox with the arrow has `aria-busy` on its loading list, and
its code does not. The `clearable` property is off by default and needs `clear-label`, while Figma has the clear
button on by default. The change has not had a Copilot review.
