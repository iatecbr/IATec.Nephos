```json
{
  "tarefa": "PE-01",
  "gate": "convencao-no-repositorio",
  "data": "2026-09-09",
  "responsavel": "claude-codigo",
  "comando": "test -f contributing.md",
  "codigo_de_saida": 0,
  "sha": "ed7c009adf09599104bc9868fee79b1092ad63cb",
  "origem_externa": null
}
```

# PE-01 — `convencao-no-repositorio`

`contributing.md` exists on the default branch. It came in through PR #25, in the
content commit `5fa4821`, and `v/3.0.0` is at merge `ed7c009`. The file writes the
branch name convention — `feat/`, `fix/`, `docs/` and `chore/` with a description in
kebab-case —, the format `tipo(escopo): resumo curto` (`type(scope): short summary`) for commits and pull request
titles, and the five items that the PR description must state.

## Command

```
test -f contributing.md
```

## Output

No output. This command prints nothing when the file exists, so the exit code
is the proof. Captured immediately after it:

```
$ test -f contributing.md
$ echo $?
0
```

## Verifiable context

```
$ git rev-parse origin/v/3.0.0
ed7c009adf09599104bc9868fee79b1092ad63cb

$ git log -1 --format='%h %an %ad %s' ed7c009
ed7c009 Mauro Jr. Wed Sep 9 11:28:45 2026 -0300 Merge pull request #25 from iatecbr/docs/pe01-pe03-contrib-p625

$ git log --oneline --merges origin/v/3.0.0 | head -3
ed7c009 Merge pull request #25 from iatecbr/docs/pe01-pe03-contrib-p625
bf6c360 Merge pull request #24 from iatecbr/docs/m5-encerramento-f5-t01
b166b23 Merge pull request #23 from iatecbr/docs/m5-f5-t01-blocos

$ git show --stat --oneline ed7c009
ed7c009 Merge pull request #25 from iatecbr/docs/pe01-pe03-contrib-p625

 AGENTS.md                 |  6 +++---
 GOVERNANCA.md             |  2 +-
 contributing.md           | 37 +++++++++++++++++++++++++++++++++++++
 docs/decisoes-tecnicas.md |  7 +++++--
 4 files changed, 46 insertions(+), 6 deletions(-)
```

PR #25 was approved by `maurocsjr` and merged by him on 09/09/2026, checked on the
pull request page: `maurocsjr approved these changes` and `maurocsjr merged commit
ed7c009 into v/3.0.0`.
