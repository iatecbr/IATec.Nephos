```json
{
  "task": "DSA-82",
  "gate": "review-and-merge",
  "date": "2026-11-17",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 4b8ce27d47d9eb38202a5513a7d0560f3fe91ab6 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "c823a83",
  "external_origin": null
}
```

# DSA-82 — `review-and-merge`

PR 180 (`feat/dsa-82-respostas`) applied in the code the answers Indiane gave on 2026-11-16, in the chat, to the pending
decisions of DSA-71 to DSA-80 that change the code, and recorded the answered points in P115 to P124:

- **`nph-tooltip` and `nph-tabs` (DSA-71 D-1).** The balloon opens on the hover of an element that is not a Tab stop (an
  explicit integer `tabindex`, `-1` included) and on the focus the arrow keys give. `nph-tabs` no longer lends
  `tabindex="0"` to the cut tab under the pointer: one Tab stop at all times.
- **`nph-stepper` (DSA-73 D-4).** The cut label of a pending step of the linear stepper is a focusable element with a role
  and `aria-disabled`; the hover background stays only on the steps that can be activated.
- **`nph-tabs` scroll labels (DSA-71 D-2).** The arrows draw with a default name that follows the nearest `lang`;
  `scroll-previous-label` and `scroll-next-label` stay and override it.
- **`nph-button` and `nph-file-upload` (DSA-74 D-2).** `nph-button` gains an additive `description` property; the zone of
  `nph-file-upload` passes its rule, limit and reason to the Choose files button through it.
- **`nph-file-upload` and `nph-field` (DSA-74 D-4).** The reason of the error shows once, in the zone; `nph-field` does
  not draw its own error line under a control that shows the reason itself.
- **`nph-sidebar` (DSA-76 D-3).** A new current page opens its parent groups; a group the person closed stays closed only
  while the current page is the same.
- **Docs (DSA-79 D-1 and the answers of 2026-11-16).** P122 cites GOV.UK accessible-autocomplete; P115 to P124 are
  updated only on the answered points; P127 records the technical choices the answers left to the code owner.
- **Not changed:** the tokens, `design.md` and `src/components/nph-resizable/`. No token was created or changed.

It was merged by Elvys on 2026-11-18T00:58:10Z (2026-11-17 in Brazil), at commit `c823a83`. The PR head, `4b8ce27`, is an
ancestor of the tip of the integration branch.

## How the review went

**Elvys reviewed and merged PR 180; Copilot did not review (out of quota).**

The request for the Copilot review did not register on the pull request, so the change was not reviewed by Copilot at
any point and there is no round of fixes from it. Auto-fix was not turned on: the app denied it, and the Azure build was
followed by hand. The review by Elvys was not written on the pull request.

Before the pull request, the advisor of the session reviewed the plan. Its review changed the plan in seven points: the
stories of the new states (default names of the tab arrows, an invalid field with the zone, a `tabindex="-1"` target in
the tooltip), P127 in the "how to change" list, `nph-tree` and `nph-table` listed as readers of the tooltip rule, the
`lang` rule aligned with the one the other pieces use, the disabled zone keeping the field line, the cspell probes, and
`git diff --check` against `origin/v/5.0.0`.

**Azure on the final head, `4b8ce27`.** The Build Stage and the Storybook build passed. The first run of the Test Stage
(build 631416) failed only with `ERR_NETWORK_CHANGED`, in the automatic attempts of the pipeline;
it was rerun once, as an infrastructure failure, and passed. No test failed for a reason of the code.

The proofs were run in sequence on `4b8ce27`, with every exit code read: `build:tokens`, `test:tokens`, `test`,
`typecheck`, `test:i18n`, `test:naming`, `test:spelling` (cspell only on the changed files, never on `design.md`, whose
full cspell does not end), `test:operacao`, `build-storybook`, `build:lib`, `test:package` and `git diff --check` all
exit 0. `design.md` is unchanged in this pull request. No accessibility exception was opened in any story.

## Command

```text
git merge-base --is-ancestor 4b8ce27d47d9eb38202a5513a7d0560f3fe91ab6 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `4b8ce27` is an ancestor of `v/5.0.0`. Checked against `origin/v/5.0.0` at `c823a83`.

## Still open

- **D-1 of DSA-82** waits for Indiane: the cut label of a pending step is `button`, or `link` when the step has `href`,
  because the answer asks for a role and names none. It does not block anything.
- **Follow-up, not part of this task:** `nph-tree` lends a Tab stop on hover to show the balloon of a cut label, a
  workaround that the new tooltip rule makes redundant. `nph-tree` and `nph-table` also read the rule: a cut label on an
  element that is not a Tab stop now opens its balloon on hover.
- **Known limits, recorded in P127:** `nph-field` reads the `disabled` of its control only when it renders, and the `lang`
  of the tab arrows is read at render, with no observer.
- **Other tasks, untouched:** the dashed-border token of DSA-74 D-1 and the motion-rule exception of DSA-78 D-3 in
  `design.md` stay open for Indiane.

The change has not had a Copilot review.
