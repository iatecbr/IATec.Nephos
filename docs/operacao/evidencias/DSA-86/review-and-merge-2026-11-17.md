```json
{
  "task": "DSA-86",
  "gate": "review-and-merge",
  "date": "2026-11-17",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor d94bd7717b6ceaeb93d7277b455e4fa79f3a1115 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "96791ea",
  "external_origin": null
}
```

# DSA-86 — `review-and-merge`

PR 181 (`feat/dsa-86-resizable`) brought the `nph-resizable`, a group of two or three panels, side by side or stacked,
separated by a handle that is dragged, or moved by keyboard, to give one of them more room. It follows the WAI-ARIA APG
Window Splitter pattern, in the contract accepted in Figma (frame `5123:2641`). Desktop only in v1.

- **Component.** `src/components/nph-resizable/`: the element, its CSS, the browser tests, the Validation stories
  (including `Brands`), the Docs page and its test, and the demonstration scenes. The panels are the direct children of
  the group; each declares `default-size`, `min-size`, `max-size` and `collapsed-size` (percent or `px`). The group has
  `direction`, `disabled`, `hide-collapse-button`, `collapse-label`, `expand-label` and `sizes`, and fires `nph-resize`
  with `detail.sizes`. Persistence is the product's.
- **Keyboard and ARIA.** The handle is a focusable `separator` with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`
  in percent of the main panel; arrows move 1 %, Shift + arrow 10 %, Home, End, Enter collapses and restores, a double
  click restores the default size. F6 is not used (the browser takes it).
- **Spec and decision.** `fichas/nph-resizable.md`, the generated Metadata, and P128 in `docs/decisoes-tecnicas.md`.
  The Storybook dictionary has the three languages.
- **Not changed:** the tokens, `design.md`, `nph-button`, `nph-icon` and the folders of DSA-82. No token was created or
  changed. No collapsed variant, no mobile layout, no second handle size.

It was merged by Elvys on 2026-11-18T01:36Z (2026-11-17 in Brazil), at commit `96791ea`. The PR head, `d94bd77`, is an
ancestor of the tip of the integration branch.

## How the review went

**Elvys reviewed and merged PR 181; Copilot did not review (out of quota).**

The request for the Copilot review (`gh pr edit 181 --add-reviewer @copilot`) did not register on the pull request, so
the change was not reviewed by Copilot at any point and there is no round of fixes from it. The review by Elvys was not
written on the pull request. Auto-fix was on and sent no review comment.

Before the pull request, the advisor of the session reviewed the work. Its findings changed the code in these points,
each with a regression test: a collapse undone by the `max-size` of the neighbor panel (the collapse now wins and the
event says what the group keeps); the mutation observer reacted to changes inside the panels (it now watches only the
panels); a `default-size` in `px` that was wrong at the first measure (the defaults are recomputed while the group is
pristine). The accessibility check on every story caught `aria-label` on a plain `div`; the demonstration panels take
`role="group"`, and the spec says a panel needs a role that takes a name.

**Proofs and Azure.** The 12 proofs were run in sequence on `4b35975` (the merge of `origin/v/5.0.0` with PR 180), every
exit code read: `build:tokens`, `test:tokens`, `test` (216 files, 9595 tests), `typecheck`, `test:i18n`, `test:naming`,
`test:spelling` (cspell only on the changed files, never on `design.md`), `test:operacao`, `build-storybook`,
`build:lib`, `test:package` and `git diff --check` all exit 0. The final head, `d94bd77`, differs from it only by
`docs/operacao` (the closing of DSA-82); on it `test:operacao`, `test:naming` and `git diff --check` were run again, all
exit 0. The first `npm test` on an earlier head had two timeouts in `nph-sidebar-item` stories, files this PR does not
touch; it passed on the rerun.

Azure on `d94bd77`: the Storybook build passed. The first run of the Build and the Test stages (build 631518) failed
only for infrastructure: the browser iframe did not become ready in `test:package` after 60 seconds, and the component
tests had `ERR_NETWORK_CHANGED`, in the automatic attempts of the pipeline. The stages were rerun once and passed. No
test failed for a reason of the code. `design.md` is unchanged. No accessibility exception was opened in any story.

## Command

```text
git merge-base --is-ancestor d94bd7717b6ceaeb93d7277b455e4fa79f3a1115 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `d94bd77` is an ancestor of `v/5.0.0`. Checked against `origin/v/5.0.0` at `96791ea`.

## Still open

- **D-1** waits for Indiane: the collapse button on a touch screen stays compact (28 px) by the T4 exception; she
  decides whether it grows to default. It does not block anything.
- **D-2** waits for Indiane: the evidence gives no width for the handle with the collapse button off; the code keeps the
  column at 28 px so the panels do not move when the button is turned off. It does not block anything.
- **Known limits, recorded in P128.** Nothing else is pending for this task.

The change has not had a Copilot review.
