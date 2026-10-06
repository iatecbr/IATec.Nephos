```json
{
  "task": "DSA-08",
  "gate": "review-and-merge",
  "date": "2026-10-06",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor 06af12539de95416ee816ca65f63298063e1bf6b origin/v/5.0.0",
  "exit_code": 0,
  "sha": "7dd370d403adc49aaad7b391e34cc5aa50730784",
  "external_origin": null
}
```

# DSA-08 — `review-and-merge`

PR #51 (`feat/dsa08-nph-tooltip`) brought the component, the CSS, the tests, the
stories, the canonical spec sheet `fichas/nph-tooltip.md` with the Metadata, the
technical decision P65 and the `design.md` rules that cite the balloon. `maurocsjr`
approved and merged it on 05-10-2026, at commit `d4ff326`. The delivery commit,
`06af125`, is an ancestor of the default branch tip.

## Command

```text
git merge-base --is-ancestor 06af12539de95416ee816ca65f63298063e1bf6b origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `06af125` is an ancestor of the tip
`7dd370d` of `v/5.0.0`.

## Applicable tests

In `C:\dev\nephos-wt-dsa04`, at SHA `7dd370d`:

```text
npm test -- src/components/nph-tooltip
```

```text
 Test Files  1 passed (1)
      Tests  15 passed (15)
```

## Merged PR

| PR | Merge | Delivery commit | Reviewer |
|---|---|---|---|
| [#51](https://github.com/iatecbr/IATec.Nephos/pull/51) | `d4ff326` (2026-10-05T16:58:28Z) | `06af125` | `maurocsjr` APPROVED (2026-10-05T16:58:19Z) |
