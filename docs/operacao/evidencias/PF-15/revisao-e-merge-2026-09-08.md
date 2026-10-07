```json
{
  "task": "PF-15",
  "gate": "review-and-merge",
  "date": "2026-09-08",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor ec09459 origin/v/3.0.0",
  "exit_code": 0,
  "sha": "a850265445bf32d350e93b775d0c44b98a1d196b",
  "external_origin": null
}
```

# PF-15 — `review-and-merge`

PR #19 was merged into `v/3.0.0`. The merge commit is `ec09459`, and it is an ancestor of the
current tip of the default branch.

## Command

```
git merge-base --is-ancestor ec09459 origin/v/3.0.0
```

## Output

No output. Exit code `0`, which is what this command returns when the first
commit is an ancestor of the second.

## Verifiable context

```
git log --oneline --merges origin/v/3.0.0 | head -3
a850265 Merge pull request #20 from iatecbr/docs/m4-migracao-operacao
ec09459 Merge pull request #19 from iatecbr/feat/pf15-pf16-pf05-tokens
f6906d6 Merge pull request #18 from iatecbr/docs/m2-lote-unificado
```
