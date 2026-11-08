```json
{
  "task": "DSA-68",
  "gate": "review-and-merge",
  "date": "2026-11-08",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 08aee1e2bc6446628e350314a075af21ba7b3ff5 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "cfa33cc",
  "external_origin": null
}
```

# DSA-68 — `review-and-merge`

PR #157 (`feat/dsa-68-hover-card`) implemented `nph-hover-card` in the contract accepted in Figma on
2026-11-06 (documentation frame `4422:2418`, component set `4406:1105`):

- a native link drawn by the piece (the Figma trigger text as the default slot, `href` as a property,
  `color/primary`, underlined, with the focus border and halo of the `hover-card/*` tokens) and a
  read-only card with a title, an optional description and an optional meta line (`meta`, `meta-icon`
  and `meta-title`), in a manual popover of the top layer;
- the opening by the pointer resting on the link after `hover-card/open-delay` and by keyboard focus
  with no wait; the close after `hover-card/close-delay`, on blur and with Esc, which does not reach a
  dialog around the card; the pointer may go onto the card (WCAG 1.4.13); on touch nothing opens;
- the four sides with the flip to the opposite one, never outside the window and never over the link,
  the optional arrow at `hover-card/arrow-*` (the card sits 11 from the link with it), the right-to-left
  mirror and the placement that follows the link on scroll, also when an ancestor clips it;
- the optional slot `media` for the avatar, image and badge of the three required examples, the
  invalid input that draws no card and reports only in development, and no event;
- the 23 `hover-card/*` tokens already on the base, the component, CSS, tests, the Validation stories
  and Docs page, the Storybook dictionary in en, pt-BR and es, the sheet `fichas/nph-hover-card.md`, its
  generated Metadata and P112 in `docs/decisoes-tecnicas.md`.

The PR changes no token and does not edit `design.md`; it only extends the comment of the contrast
exception of `src/shared/docs/brands.ts` to the `Brands` story of this piece. It was merged on
2026-11-08, at commit `cfa33cc`, under Elvys's standing authorization of 2026-11-07. The PR head,
`08aee1e`, is an ancestor of the tip of the integration branch.

## How the review went

Copilot reviewed; no human code review; merged under Elvys's standing authorization of 2026-11-07.

No review was requested from a person. Copilot was requested when the PR opened (2026-11-08T00:23:32Z)
and again after each round of fixes (00:34:55Z, 00:50:25Z, 01:05:46Z and 01:15:03Z), and reviewed as
`copilot-pull-request-reviewer`. The entries of `elvysmarcos` in the review list are the replies to the
Copilot threads, posted with Elvys's account by the session that fixed them; they are not a code review.
There were four rounds with findings that the code had to answer and a last one with no open issue
(the limit of five rounds was reached):

| Reviewed head | Findings | Fixed in |
|---|---|---|
| `877859e` | Five threads: a long meta word overflowed the card; the time examples had no `meta-title`; an open card moved to another parent stayed hidden; Tab before the open wait reopened the card after Esc; Esc during the close delay left the next hover suppressed | `369af2b`, each with a regression test |
| `369af2b` | The pointer coming back while the card leaves waited another 600 ms; the sheet promised that any delegated router handles the composed click | `62d7baa`, a regression test for the first and the router wording in the sheet and in P112 |
| `62d7baa` | A pending close timer closed a card turned on again; the card stayed visible when a scrolling ancestor clipped the link; the image of the summary example overflowed a narrow window; `success` used for a permanent state | `8fedd61`, each with a regression test (the example text is checked by the docs test) |
| `8fedd61` | One thread: the clamp could cover the link in a window too short for any side | `1a67d7d`, with a regression test; the card taller than the window became D-4 |
| `1a67d7d` | No open issue, no thread; one unpublished note about text overflowing if it inherits `white-space: nowrap` | Not acted on after the limit of rounds; it is the note in the last section |

After `1a67d7d` the branch took four merges of `origin/v/5.0.0` (the last one, `08aee1e`, brought the
fix of the hover tests of `nph-navigation-menu` from PR #158) and no commit of its own. The proofs were
run again on each merge head and on the final head, `08aee1e`: all twelve exit 0, with 6832 tests in
`npm test`. The Azure Build and Test were SUCCESS on that head; its Test Stage needed one rerun for
`ERR_NETWORK_CHANGED` on the agent, with no test failing, and an earlier head (`c08ba1b`) failed twice on
a hover-timing test of `nph-navigation-menu`, which belongs to the base and was fixed by PR #158.

## Command

```text
git merge-base --is-ancestor 08aee1e2bc6446628e350314a075af21ba7b3ff5 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `08aee1e` is an ancestor of `v/5.0.0`. Checked against
`origin/v/5.0.0` at `cfa33cc`.

## Still open

Four decisions wait for Indiane, recorded in the task and in P112; none blocks the merge:

- **D-1**: the slot `media` (the Figma set has no slot for the avatar, the image and the badge).
- **D-2**: how the card aligns to the link when there is no arrow.
- **D-3**: the contrast of the link in the dark scheme of brands other than Gerencial (2.71:1 to 3.81:1);
  the `Brands` story carries the contrast exception until the token is fixed.
- **D-4**: a window shorter than the card (the card stays beside the link and the window cuts the rest,
  with no scroll, since the contract rules scrolling out).

Not acted on, for Elvys to decide: the unpublished note of the fifth review, that the text of the card
overflows if it inherits `white-space: nowrap` from an ancestor. The fix would be `white-space: normal`
on the card, with a test.
