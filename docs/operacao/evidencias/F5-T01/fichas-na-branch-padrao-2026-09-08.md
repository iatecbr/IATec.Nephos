```json
{
  "task": "F5-T01",
  "gate": "specs-on-default-branch",
  "date": "2026-09-08",
  "owner": "claude-code",
  "command": "test -d fichas",
  "exit_code": 0,
  "sha": "8b09118a662a00ee974abf982172896612d4c1b7",
  "external_origin": null
}
```

# `specs-on-default-branch` — F5-T01

Output pasted, unedited:

```text
$ test -d fichas
$ echo $?
0
```

`fichas/` is in the baseline: PR #13 was merged by Elvys on 01-09-2026, merge commit
`348e68e`, an ancestor of `2b992fc`, which is the `origin/v/3.0.0` of this run. The directory
contains `_modelo.md`, `nph-icon.md`, `nph-label.md` and `nph-spinner.md`.

This gate was the only one that could already have passed before this session. It was `pending`
because exactly this file was missing: the command and the exit code, pasted.
