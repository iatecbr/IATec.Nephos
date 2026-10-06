```json
{
  "task": "DSA-03",
  "gate": "review-and-merge",
  "date": "2026-09-14",
  "owner": "copilot",
  "command": "git merge-base --is-ancestor fff0624e44d7679877f36a28bb03225226f4eaec origin/v/5.0.0",
  "exit_code": 0,
  "sha": "4c33737cedda4171d2f3596f6c58c2d8e00d4a77",
  "external_origin": null
}
```

# DSA-03 — `review-and-merge`

Decision I7 (`circle-info` in `solid`, `regular` as the default) is already on
`v/5.0.0`. Nothing was reimplemented in this pass: the code, the tests and
Storybook came in PR #34; the spec sheet and the contracts came in PR #35. Both
were reviewed by Mauro (`maurocsjr`, `APPROVED`) and merged on 14-09-2026.

PR #37 only recorded the gate `figma-docs-accepted`. This evidence closes
the gate `review-and-merge` over what is already an ancestor of the default branch.

## Command

```text
git merge-base --is-ancestor fff0624e44d7679877f36a28bb03225226f4eaec origin/v/5.0.0
```

## Output

No output. Exit code `0`, which confirms that commit `fff0624` of I7 in the
code is an ancestor of the default branch tip `4c33737`.

The same holds for the contracts commit `05fd0fa78bb85f84f86c90a76eb747d94aad1875`
(`exit_code` 0).

## Applicable tests

In `C:\dev\nephos-v5` at SHA `4c33737`:

```text
npm test -- src/components/nph-icon/nph-icon.test.ts src/components/nph-icon/nph-icon.demo.test.ts
```

```text
Test Files  2 passed (2)
     Tests  38 passed (38)
```

The tests cover the core of 93 names, `regular` as the default, `solid` on every
name (including `circle-info`) and the `Variantes` story with `circle-info` regular
versus solid.

## Verifiable context

```text
PS> git fetch origin --prune

PS> git rev-parse origin/v/5.0.0
4c33737cedda4171d2f3596f6c58c2d8e00d4a77

PS> git log -1 --format='%h %s' origin/v/5.0.0
4c33737 Merge pull request #37 from iatecbr/docs/dsa03-documentacao-figma-aceita

PS> git merge-base --is-ancestor fff0624e44d7679877f36a28bb03225226f4eaec origin/v/5.0.0

PS> $LASTEXITCODE
0

PS> git merge-base --is-ancestor 05fd0fa78bb85f84f86c90a76eb747d94aad1875 origin/v/5.0.0

PS> $LASTEXITCODE
0
```

## Merged PRs

| PR | Merge | Delivery commit | Reviewer |
|---|---|---|---|
| [#34](https://github.com/iatecbr/IATec.Nephos/pull/34) | `0e93f0a` (2026-09-14T14:33:01Z) | `fff0624` | `maurocsjr` APPROVED |
| [#35](https://github.com/iatecbr/IATec.Nephos/pull/35) | `9ed82e5` (2026-09-14T14:33:35Z) | `05fd0fa` | `maurocsjr` APPROVED |
