# How to contribute

## Branch

During v5, create each task branch from `origin/v/5.0.0`, using one of the
prefixes below followed by a short description in kebab-case:

- `feat/` for a feature or component;
- `fix/` for a fix;
- `docs/` for documentation;
- `chore/` for maintenance with no product change.

Example: `docs/pe01-pe03-contrib-p625`.

## Commit and pull request

Use `type(scope): short summary` when there is a scope; omit the parentheses
when they do not help to understand the change. The types follow the branch
prefixes: `feat`, `fix`, `docs` and `chore`.

Every v5 pull request has `v/5.0.0` as its target branch. What goes by direct
push to that branch and what requires a pull request follows the risk
yardstick in `AGENTS.md`, under "Branch and pull request flow — v5": task
record, token, text fix and record of an already approved decision go
directly, with the proof passing; code, scripts, Storybook, dependency, rule,
sheet and new technical decision go through a pull request.

The pull request title repeats the title of the main commit. The description
states:

1. the goal and the limit of the batch;
2. the files changed;
3. the commands executed and the result;
4. the evidence needed for review;
5. the remaining blocker, if any.

## Ritual

When the change requires a pull request, put the independent and
already-validated items in the same PR, with one commit per item. Commit when
you reach a state that works, not at the end of the day. A visual change
includes a verifiable comparison; a code change includes the applicable tests.

Whoever executes prepares the branch, the commits and the pull request. Elvys
or Mauro review and merge; the review does not transfer to them the drafting
of the content or product decisions.
