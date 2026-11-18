```json
{
  "task": "DSA-88",
  "gate": "review-and-merge",
  "date": "2026-11-18",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 986bac75dcaa83e1b43354e5dd3fa93a253bc4ce origin/v/5.0.0",
  "exit_code": 0,
  "sha": "d20075f",
  "external_origin": null
}
```

# DSA-88 — `review-and-merge`

PR 183 (`feat/dsa-88-card`) brought the `nph-card`, a surface that groups the content and the actions of one subject,
in the contract accepted in Figma (frame `6516:13647`).

- **Component.** `src/components/nph-card/`: the element, its CSS, the browser tests, the Validation stories (including
  `Brands`), the Docs page and its test, and the demonstration scenes. It has three types (`base`, `clickable`,
  `section`), two surfaces, four media options and two densities. The parts come from slots named by zone (`media`,
  `leading`, `status`, `action`, `section`, `footer`, and the default slot for the content) and from the properties
  `heading`, `description`, `icon`, `href` and `items`. The clickable card stretches its title link with CSS only, and
  the host is the visual surface, so the outline, the focus border and the halo follow the card. The side media moves to
  the top under `30rem`, with a container query.
- **Spec and decision.** `fichas/nph-card.md`, the generated Metadata, and P130 in `docs/decisoes-tecnicas.md`. The
  Storybook dictionary has the three languages.
- **Not changed:** the tokens, `design.md` and the pieces the card uses. No token was created or changed.

It was merged on 2026-11-18T20:23Z at commit `d20075f`, by gh, as Elvys authorized. The PR head, `986bac7`, is an
ancestor of the tip of the integration branch.

## How the review went

**Elvys authorized the merge of PR 183 by gh, with Azure Test red on infrastructure only (ERR_NETWORK_CHANGED; fix in PR 184); Copilot did not review (out of quota).**

The request for the Copilot review (`gh pr edit 183 --add-reviewer @copilot`) did not register on the pull request, so
the change was not reviewed by Copilot at any point and there is no round of fixes from it. The review by Elvys was not
written on the pull request.

Before the pull request, the advisor of the session reviewed the work. Its findings changed the code in these points,
each with a test: the loading skeleton is drawn only for the parts the card has; the slotted media is a flex box so the
media does not leave a gap; the touch height of the action has a test; and the focus contrast reading is recorded as D-4.

**Proofs and Azure.** The 12 proofs were run in sequence, every exit code read. On `d28458d` (the merge of
`origin/v/5.0.0` with DSA-90, DSA-93 and the carousel) `build:tokens`, `test:tokens`, `typecheck`, `test:i18n`,
`test:naming`, `test:operacao`, `test` (9977 tests), `build-storybook`, `build:lib`, `test:package` and
`git diff --check` exit 0, and `test:spelling` ran as cspell only on the changed files, never on `design.md`, with no
finding. The last merge, `986bac7`, only added the docs of the DSA-87 closing, and `test:operacao`, `test:naming` and
`git diff --check` ran again on it with exit 0.

Azure: the Build stage and the Storybook build passed on the heads that finished. The Test stage failed only for
infrastructure and never on an assertion: `ERR_NETWORK_CHANGED`, "Failed to fetch dynamically imported module" and "the
iframe did not become ready within 60000ms", in many files this PR does not touch. In build 632546 (head `ad2b46b`) the
file `nph-card.stories.ts` failed to import, like the others, and passed when the runner retried it; that build failed
that way and so did its two reruns. The Azure build of `986bac7` (633047) had not
finished when the pull request was merged. The fix of the pipeline is in PR 184. `design.md` is unchanged. No
accessibility exception was opened in any story.

## Command

```text
git merge-base --is-ancestor 986bac75dcaa83e1b43354e5dd3fa93a253bc4ce origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `986bac7` is an ancestor of `v/5.0.0`. Checked against `origin/v/5.0.0` at `d20075f`.

## Still open

- **D-1 to D-4** wait for Indiane, as recorded in the task: a long key or value in the section list (the code wraps it),
  the loading state with media (no media is drawn), the width where the side media moves to the top (`30rem`), and the
  focus contrast reading against the halo, with its known limit in the `Sistemas` brand in light. None blocks anything.
- **Known limits, recorded in P130.** Nothing else is pending for this task.

The change has not had a Copilot review.
