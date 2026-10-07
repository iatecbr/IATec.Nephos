```json
{
  "task": "F5-T01",
  "gate": "review-and-merge",
  "date": "2026-09-08",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 7c11fc3 origin/v/3.0.0",
  "exit_code": 0,
  "sha": "b166b238f93d7b239513f9411af37af91475b538",
  "external_origin": null
}
```

# F5-T01 — `review-and-merge`

PR #23 was merged into `v/3.0.0`. The merge commit is `b166b23`, the default branch tip
at this verification, and commit `7c11fc3`, which closed the F5-T01 execution session, is an
ancestor of it.

## Command

```
git merge-base --is-ancestor 7c11fc3 origin/v/3.0.0
```

## Output

No output. Exit code `0`, which is what this command returns when the first
commit is an ancestor of the second.

## Verifiable context

```
$ git fetch --prune
$ git rev-parse origin/v/3.0.0
b166b238f93d7b239513f9411af37af91475b538

$ git log -1 --format='%h %an %ad %s' b166b23
b166b23 Mauro Jr. Tue Sep 8 16:48:58 2026 -0300 Merge pull request #23 from iatecbr/docs/m5-f5-t01-blocos

$ git log --oneline --merges origin/v/3.0.0 | head -3
b166b23 Merge pull request #23 from iatecbr/docs/m5-f5-t01-blocos
03884da Merge pull request #22 from iatecbr/docs/lote-manutencao-operacional
2b992fc Merge pull request #21 from iatecbr/docs/m5-ativacao-f5-t01
```

The two previous gates, repeated over `b166b23`:

```
$ test -d fichas; echo $?
0
$ test -d fichas/blocos; echo $?
0
```
