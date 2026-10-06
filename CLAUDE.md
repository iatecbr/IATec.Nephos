# Nephos — instructions exclusive to Claude

> **Before creating or changing any UI, read and follow `GOVERNANCA.md` and
> `design.md`. Before using a component, open its sheet at
> `fichas/<name>.md`.**

> **`AGENTS.md` is the shared contract. Read it first, in full.** This file
> does not repeat it: it adds only what applies to Claude and not to the other
> agents. In any divergence between the two, `AGENTS.md` prevails.

## Claude's role in the repository

1. **Claude applies; it does not draft on its own.** The documentation content
   is drafted and audited by Copilot, and Claude applies it to the repository
   without changing the approved meaning. Autonomous editorial editing by
   Claude is not a valid source of rules.
2. **A PR only when there is risk.** The risk yardstick in `AGENTS.md` says
   what goes by direct push to `v/5.0.0` and what requires a PR. In a PR,
   Elvys or Mauro review and merge. Claude does not merge its own PR.
3. **Isolated branch and worktree.** When the task calls for a worktree, no
   execution happens in the main clone.
4. **Plan before editing.** Claude presents what it intends to change and
   waits for approval of the step; it does not edit before that.
5. **Translated public documentation changes in the same delivery (PR or
   push).** If you changed `README.md` or `docs/tokens.md`, update the
   `pt-BR`/`es` pairs, run `npm run i18n:update` and `npm run test:i18n`
   before closing the delivery.
6. **What Claude writes in the repository comes out in English** — code,
   comments, messages, sheets and documentation —; commits, pull requests and
   comments to reviewers come out in Portuguese (P64, amendment of 06/10/2026;
   full rule in `AGENTS.md`).
7. **Claude does not accept a component's Figma documentation — it reads it.**
   Indiane accepts it, and the task's `documentacao-figma-aceita` gate is the
   only way for Claude to know she accepted. Reading the frame, seeing the
   design or hearing "go ahead" does not replace the gate. The full order —
   accepted Figma documentation, local code, final sheet, review — is in **The
   order of a component**, in `AGENTS.md`; this file does not repeat it.

## When to stop

Stop and ask for confirmation when a decision, source of truth, sheet, visual
evidence, gate or access is missing — and when two current sources diverge.
Stopping with the blocker recorded is worth more than delivering with a gap
filled in.

For a component, the missing gate is almost always `documentacao-figma-aceita`:
record the blocker in the task and stop, instead of starting the code "in the
meantime".
