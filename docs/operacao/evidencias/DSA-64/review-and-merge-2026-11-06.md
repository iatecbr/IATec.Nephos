```json
{
  "task": "DSA-64",
  "gate": "review-and-merge",
  "date": "2026-11-06",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 6c20ee7d5acfed31a4ef9d71416e5b28766f078c origin/v/5.0.0",
  "exit_code": 0,
  "sha": "af403a78a662af48aa8c9592822f65513e72d843",
  "external_origin": null
}
```

# DSA-64 — `review-and-merge`

PR #148 (`feat/dsa-64-secondary-buttons`) made the secondary solid and secondary outline
`nph-button` use their own component tokens, with text and icon only, and removed the secondary
light emphasis:

- secondary solid reads `button/secondary-solid-background` and its hover, and the
  `icon-button/*` pair in the icon only;
- secondary outline reads `button/secondary-outline-border`, `-border-hover` and
  `-background-hover`, and the `icon-button/*` trio in the icon only; its rest background stays
  `color/muted`, and the border now changes on hover;
- `severity="secondary" emphasis="light"` is invalid input: nothing is drawn and development
  emits `console.error` (B1). `light` stays in primary and danger;
- in `nph-table`, the three secondary light compact buttons (the `button` cell, and the text
  button and the icon-only more of `mixed-actions`) became secondary solid compact;
- in `nph-dialog`, the window redefines the four new solid secondary tokens with
  `color/secondary-on-dialog` and its hover, the value P87 already decides, because the button
  no longer reads `color/secondary`;
- the stories and the Docs page, the token matrix and new tests, the sheets of the button, the
  table and the dialog, the Storybook dictionary in en, pt-BR and es, `docs/decisoes-tecnicas.md`
  and the generated Metadata of `nph-button`.

The PR changes no token and does not edit `design.md`. It was merged on 2026-11-06, at commit
`af403a7`, by Elvys's authorization. The PR head, `6c20ee7`, is an ancestor of the tip of the
integration branch.

## How the review went

Copilot reviewed; no human code review; merged by Elvys's authorization.

No review was requested from a person. Copilot was requested once, at 2026-11-06T12:12:33Z, and
reviewed the head `6c20ee7` at 12:15:31Z as `copilot-pull-request-reviewer`: "Approval
recommended", no open issue and no thread. There was a single round and no fix commit after it.

| Reviewed head | Findings | Fixed in |
|---|---|---|
| `6c20ee7` | No open issue, no thread | — |

## Command

```text
git merge-base --is-ancestor 6c20ee7d5acfed31a4ef9d71416e5b28766f078c origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `6c20ee7` is an ancestor of `v/5.0.0`. Checked against
`origin/v/5.0.0` at `af403a78a662af48aa8c9592822f65513e72d843`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#148](https://github.com/iatecbr/IATec.Nephos/pull/148) | `af403a7` (2026-11-06T12:28:39Z) | `6c20ee7` | `elvysmarcos` |

## Proof commands

Run on the final head `6c20ee7`, in sequence. Every one exited with `0`:

| Command | Detail |
|---|---|
| `npm run build:tokens` | |
| `npm run test:tokens` | |
| `npm test` | 143 files, 5632 tests, with the accessibility gate of the stories |
| `npm run typecheck` | |
| `npm run test:i18n` | |
| `npm run test:naming` | |
| `npm run test:spelling` | |
| `npm run test:operacao` | |
| `npm run build-storybook` | |
| `npm run build:lib` | |
| `npm run test:package` | |
| `git diff --check` | |

On the same head, the Azure pipeline passed: the Build stage, the Test stage and the overall
check.

## Still open

D-1 stays in the task's `pending_decisions`, with Indiane, unchanged. It does not block the task:

- D-1: with the base solid secondary now `surface/50` in light and `surface/600` in dark, should
  `nph-dialog` still keep the overlay of P87 (`color/secondary-on-dialog`)? Until she answers, the
  dialog keeps the value P87 decided.

Out of this task's scope: `design.md` still words `color/secondary-light` and
`color/secondary-light-hover` as the secondary light `nph-button` (appendix point Pend. 2 of the
`figma-docs-accepted` evidence, left for the token sweep).
