```json
{
  "task": "DSA-40",
  "gate": "review-and-merge",
  "date": "2026-10-23",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor fc054802dff078c1351ac0b055e398fe6d527003 origin/v/5.0.0",
  "exit_code": 0,
  "sha": "c55c2f0300fdf87a4002462f2c0795535f0f2fbf",
  "external_origin": null
}
```

# DSA-40 — `review-and-merge`

PR #100 (`claude/dsa-40-nph-empty-6944c2`) brought `nph-empty`: the component, its CSS
and tests, five Validation stories, the Docs page, the dictionary in en, pt-BR and es, the
spec and its generated Metadata, P84, the two lines of `vite.config.lib.ts` that ship the
two illustrations as files of the package (`dist/assets/`), and the delivery of those
illustrations in the Angular and Blazor flows of `docs/consuming.md` and its two
translations. Elvys merged it on 23-10-2026, at commit `c55c2f0`. The PR head, `fc05480`,
is an ancestor of the integration branch tip.

How the review went: Copilot reviewed; no human code review; merged by Elvys.

Copilot rounds, as `copilot-pull-request-reviewer`:

| Reviewed head | Findings | Fixed in |
|---|---|---|
| `7a68f45` | The Blazor flow did not deliver the two PNG files | `e21406e` (guides in three languages) |
| `e21406e` | `hidden` overridden by the host `display`; Angular delivery not documented | `eb4c326` (`:not([hidden])` and a regression test; Angular guides), `c0090ab` (checks in the guides) |
| `eb4c326`, `c0090ab`, `4f87e61` | No new finding; validation with the installed package still asked | `b83079d` |
| `b83079d` | Angular in a subdirectory still open | `fc05480` |
| `fc05480` | No open issue | — |

`e21406e`, `eb4c326` and `c0090ab` are by `copilot-swe-agent`. `b83079d` validated the
delivery with the tarball of `npm pack`: Blazor with esbuild and `dotnet publish` (.NET 10,
`MapStaticAssets`) serves the bundle and both images with status 200; Angular 22 with the
application builder keeps `new URL("../assets/…", import.meta.url)` and works at the root
of the site with the asset glob. It also removed the `deployUrl` instruction, which only
rewrites `index.html` and broke a static deployment. `fc05480` records, by decision of
Elvys of 23-10-2026, the Angular application in a subdirectory as a known limit of P84 and
of the guide, and opens D4. The branch was synced with `v/5.0.0` four times (`41644b6`,
`6e112be`, `d6ccb99`, `d54a664`), preserving the entries of the other tasks.

## Command

```text
git merge-base --is-ancestor fc054802dff078c1351ac0b055e398fe6d527003 origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `fc05480` is an ancestor of `v/5.0.0`, checked against
`origin/v/5.0.0` at `c55c2f0300fdf87a4002462f2c0795535f0f2fbf`.

## Merged PR

| PR | Merge | PR head | Merged by |
|---|---|---|---|
| [#100](https://github.com/iatecbr/IATec.Nephos/pull/100) | `c55c2f0` (2026-10-23T20:03:22Z) | `fc05480` | `elvysmarcos` |

## Proof commands

Run on the final PR head `fc05480`, and again on the merge `c55c2f0`, with the same
result. Exit code `0`: `npm run build:tokens` (608 tokens), `test:tokens` (25 checks),
`typecheck`, `test:i18n`, `test:operacao` (48 tasks), `build-storybook`, `build:lib` (the
two illustrations in `dist/assets/`), `test:package` (785 checks, 15 components) and
`git diff --check`.

`npm test` exits with `1` on one test of the base, not of this PR:
`src/components/nph-tooltip/nph-tooltip.test.ts:1074` ("an inert ancestor prevents a
consumer-opened balloon and keeps its ARIA reference"); 1453 of 1454 tests pass. PR #104,
still open, fixes it. `nph-tooltip` is not in the diff of PR #100.

`npm run test:naming` exits with `1` on `scripts/test-package.mjs:180` and on Portuguese
words in the DSA-34, DSA-39, DSA-42, DSA-43, DSA-45 and DSA-47 records, none of which is in
the diff of the PR.

## Still open

D1 to D4 stay in the task's `pending_decisions`, with Indiane, unchanged. They change no
token and do not block the task:

- D1: lighter illustration files (the current ones are 2048 px wide for a drawing of 120).
- D2: whether the dark illustration, of another proportion, is fitted or cut in the
  120 × 87 box.
- D3: whether the box shrinks in a narrower container.
- D4: after D1, a new task for (b) the consumer gives the base of the assets, or (c) the
  illustrations are embedded in the package; meanwhile an Angular application in a
  subdirectory copies the two PNG files to `/assets/` at the root of the site (known limit
  of P84).
