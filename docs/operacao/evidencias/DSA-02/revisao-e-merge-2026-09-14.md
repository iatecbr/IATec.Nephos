```json
{
  "tarefa": "DSA-02",
  "gate": "revisao-e-merge",
  "data": "2026-09-14",
  "responsavel": "copilot",
  "comando": "git merge-base --is-ancestor 89038735f968a1abbcc629cdde02097d3041454a origin/v/5.0.0",
  "codigo_de_saida": 0,
  "sha": "8e11751e0e3fcf57f32eee4a044e8a000ba7fa15",
  "origem_externa": null
}
```

# DSA-02 — `revisao-e-merge`

PR #33 was reviewed by Mauro (`maurocsjr`) and merged into `v/5.0.0` on
14-09-2026. Merge commit `8e11751` contains commit `8903873`, which recorded
the uses of `status/error` and `space/inline-tight`.

## Command

```text
git merge-base --is-ancestor 89038735f968a1abbcc629cdde02097d3041454a origin/v/5.0.0
```

## Output

No output. Exit code `0`, which confirms that the DSA-02 commit is an
ancestor of the default branch tip `8e11751`.

## Verifiable context

```text
PS> git fetch origin --prune

PS> git rev-parse origin/v/5.0.0
8e11751e0e3fcf57f32eee4a044e8a000ba7fa15

PS> git log -1 --format='%h %s' origin/v/5.0.0
8e11751 Merge pull request #33 from iatecbr/docs/dsa02-status-error-inline-tight

PS> git merge-base --is-ancestor 89038735f968a1abbcc629cdde02097d3041454a origin/v/5.0.0

PS> $LASTEXITCODE
0
```
