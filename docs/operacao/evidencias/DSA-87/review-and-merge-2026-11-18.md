```json
{
  "task": "DSA-87",
  "gate": "review-and-merge",
  "date": "2026-11-18",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 52e9bd660b105baaa3e660abf2f8e47c6f9c10e9 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "7ce24ac",
  "external_origin": null
}
```

# DSA-87 — `review-and-merge`

PR 182 (`feat/dsa-87-carousel`) brought the `nph-carousel`, a strip of slides where one part shows at a time and the
person moves on with arrows, indicators or by dragging, in the contract accepted in Figma (frame `5173:1429`). It follows
the WAI-ARIA APG Carousel pattern, with the indicators as a tab group.

- **Component.** `src/components/nph-carousel/`: the element, its CSS, the browser tests, the Validation stories
  (including `Brands`), the Docs page and its test, and the demonstration scenes. The slides are the direct children of
  the element, given to the shadow root by manual slot assignment, so the consumer's slides get no attribute. It has
  `layout` (`single`, `several`, `peek`), `index` (the first slide in view), `hide-arrows`, `hide-indicators`,
  `counter` and the label properties, and fires `nph-slide-change` with `detail.index`, only for a change made by the
  person.
- **Keyboard and ARIA.** Region with `aria-roledescription="carousel"`, a polite live track, indicators as a tab group
  with a single Tab stop, Left and Right moving focus and showing the slide, Home and End. Slides out of view are
  `inert`. Drag with pointer events, with a threshold and a velocity rule; arrows and indicators remain the way that
  needs no drag (WCAG 2.5.7).
- **Spec and decision.** `fichas/nph-carousel.md`, the generated Metadata, and P129 in `docs/decisoes-tecnicas.md`. The
  Storybook dictionary has the three languages.
- **Not changed:** the tokens, `design.md`, `nph-button`, `nph-icon` and the folders of DSA-88. No token was created or
  changed. No automatic rotation, vertical carousel, thumbnails or wrap-around.

It was merged on 2026-11-18T20:20Z at commit `7ce24ac`, by gh, as Elvys authorized. The PR head, `52e9bd6`, is an
ancestor of the tip of the integration branch.

## How the review went

**Elvys authorized the merge of PR 182 by gh, with Azure Test red on infrastructure only (ERR_NETWORK_CHANGED; fix in
PR 184); Copilot did not review (out of quota).**

The request for the Copilot review (`gh pr edit 182 --add-reviewer @copilot`) did not register on the pull request, so
the change was not reviewed by Copilot at any point and there is no round of fixes from it. The review by Elvys was not
written on the pull request.

Before the pull request, the advisor of the session reviewed the work. Its findings changed the code in these points,
each with a regression test: the page derived from `index` in the several layout and the last page aligned to the end;
the focus handoff when the focused arrow becomes disabled; the flick test, which now uses fixed timestamps, because it
failed under the load of the full suite.

**Proofs and Azure.** The 12 proofs were run in sequence on `52e9bd6` (the merge of `origin/v/5.0.0` with DSA-90 and
DSA-93, which brought tokens), every exit code read: `build:tokens`, `test:tokens`, `test`, `typecheck`, `test:i18n`,
`test:naming`, `test:spelling` (cspell only on the changed files, never on `design.md`), `test:operacao`,
`build-storybook`, `build:lib`, `test:package` and `git diff --check` all exit 0.

Azure on `52e9bd6` (build 632548): the Build stage and the Storybook build (632549) passed. The Test stage failed only
for infrastructure and never on `nph-carousel`: `ERR_NETWORK_CHANGED` and 15 s timeouts in files this PR does not touch
(`nph-data-table`, `nph-multi-combobox`, `nph-scheduler`, `nph-sidebar`) in the automatic attempts, on the agent
`ic-lv-az-ag03-lv`; the one rerun that was authorized failed on `myagent-12` with "the iframe did not become ready
within 60000ms", and the shard was not retried because an error went unhandled. The earlier head, `e82915a`, had the
same infrastructure failure in three runs. The fix of the pipeline is in PR 184. `design.md` is unchanged. No
accessibility exception was opened in any story.

## Command

```text
git merge-base --is-ancestor 52e9bd660b105baaa3e660abf2f8e47c6f9c10e9 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `52e9bd6` is an ancestor of `v/5.0.0`. Checked against `origin/v/5.0.0` at `7ce24ac`.

## Still open

- **D-1** waits for Indiane: the disabled arrow at the ends uses the native `disabled`, out of the Tab order; keeping it
  focusable needs a focusable disabled mode in the `nph-icon-button`, in its own task. It does not block anything.
- **Known limits, recorded in P129.** The arrow takes its icon color through the internal `--_fg` of `nph-button`,
  which exposes no hook for it; a test reads the computed color and breaks if the button renames it. Nothing else is
  pending for this task.

The change has not had a Copilot review.
