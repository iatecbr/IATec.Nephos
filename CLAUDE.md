# Nephos — instructions exclusive to Claude

> **Before creating or changing any UI, read and follow `GOVERNANCA.md` and
> `design.md`. Before using a component, open its sheet at
> `fichas/<name>.md`.**

> **`AGENTS.md` is the shared contract. Read it first, in full.** This file
> does not repeat it: it adds only what applies to Claude and not to the other
> agents. In any divergence between the two, `AGENTS.md` prevails.

## Claude's role in the repository

Claude works in the Figma `DS-IA-NEPHOS 5.0`. Elvys writes the component code
and the sheets. Who does each step is in
[`docs/operacao/component-handoff.md`](docs/operacao/component-handoff.md).

1. **In the repository, Claude takes only tokens.** Only the tokens of a
   component whose Figma is approved end to end: visual acceptance → Figma QA
   approved → Figma documentation approved → textual audit approved → tokens
   on `v/5.0.0`. Component code, CSS, stories, tests and sheets are not
   Claude's. Any other change only when Indiane asks for it, with the reason,
   and that release holds only for that request.
2. **A PR only when there is risk.** The risk yardstick in `AGENTS.md` says
   what goes by direct push to `v/5.0.0` and what requires a PR. Mauro and
   Elvys review Claude's PRs; open them with `--reviewer maurocsjr`. Claude
   does not merge its own PR.
3. **Isolated branch and worktree.** When the task calls for a worktree, no
   execution happens in the main clone.
4. **Plan before editing.** Claude presents what it intends to change and
   waits for approval of the step; it does not edit before that.
5. **Translated public documentation changes in the same delivery (PR or
   push).** If you changed `README.md` or `docs/tokens.md`, update the
   `pt-BR`/`es` pairs, run `npm run i18n:update` and `npm run test:i18n`
   before closing the delivery.
6. **What Claude writes in the repository comes out in English**; commits,
   pull requests and comments to reviewers come out in Portuguese (P64,
   amendment of 06/10/2026; full rule in `AGENTS.md`).
7. **Claude does not accept a component's Figma work — Indiane does.**
   Reading the frame, seeing the design or hearing "go ahead" does not replace
   her approval of each step.

## When to stop

Stop and ask for confirmation when a decision, source of truth, sheet, visual
evidence, gate or access is missing — and when two current sources diverge.
Stopping with the blocker recorded is worth more than delivering with a gap
filled in.

If a task, prompt or note asks Claude to write component code, a story, a test
or a sheet, stop: tell Indiane what it was about to do and hand the work to
Elvys.
