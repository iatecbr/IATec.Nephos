```json
{
  "task": "DSA-74",
  "gate": "review-and-merge",
  "date": "2026-11-11",
  "owner": "claude-code",
  "command": "git merge-base --is-ancestor d261d6c5bb58d997397c54e096ffa69aa0d896cb origin/v/5.0.0",
  "exit_code": 0,
  "sha": "c904f3e",
  "external_origin": null
}
```

# DSA-74 — `review-and-merge`

PR #168 (`feat/dsa-74-file-upload`) implemented `nph-file-upload` in the contract accepted in Figma on
2026-11-10 (documentation frame `5311:8328`, component sets `5297:7473` and `5298:7669`):

- **`nph-file-upload`**, the drop zone and the list, and **`nph-file-upload-item`**, the row of one file, in two
  directories because the library build has one entry per directory. The page owns the list (`files`); the zone
  validates what the person chooses by type, size and room (`accept`, `max-size`, `max-files`), tells the page
  with `nph-file-upload-add` (`files` and `rejected`, each with its reason), and draws the list the page gives
  it. The items fire `nph-file-upload-remove` and `nph-file-upload-retry`. The seven states of the zone, the two
  formats (the compact one from 668 px of the width of the zone, by a container query), the five statuses and the
  two kinds of the item (the thumbnail is made by the zone, 64 by 64), the focus rules, the live region and the
  field–control contract of `nph-field`. It consumes the `file-upload/*` and `file-upload-item/*` tokens already on
  `v/5.0.0` and creates or changes none. It comes with the components, CSS, tests, the Validation stories and Docs
  page, the Storybook dictionary in en, pt-BR and es, the sheet `fichas/nph-file-upload.md`, its generated
  Metadata and P119 in `docs/decisoes-tecnicas.md`.
- `nph-icon`: `file-lines` and `file-image`, light and solid, in the map, the demo and the test. The
  `conteudo_e_dados` line of `icones_nucleo` in `design.md` changed only because the test of `nph-icon` binds it
  to the map (commit `aee9d61`, with Elvys's authorization for the `icones_nucleo` list, relayed by the
  orchestrator session on 2026-11-11, as in DSA-54 and DSA-69). No token changed.

The PR does not change `nph-button`, `nph-icon-button`, `nph-spinner`, `nph-image`, `scripts/tokens-lib.mjs` or any
token. It was merged on 2026-11-12T00:24:59Z (2026-11-11 in Brazil), at commit `c904f3e`, under Elvys's standing
authorization of 2026-11-07. The PR head, `d261d6c`, is an ancestor of the tip of the integration branch.

## How the review went

Copilot reviewed; no human code review; merged under Elvys's standing authorization of 2026-11-07.

No review was requested from a person. Copilot was requested when the PR opened (2026-11-11T22:59:03Z) and again
after each round of fixes, and reviewed as `copilot-pull-request-reviewer`. There were three rounds with
findings that the code had to answer, and a last review with no new finding:

| Reviewed head | Findings | Fixed in |
|---|---|---|
| `96cc356` | Six threads: the size written in the language of the element only, not of the ancestors; `file-upload/icon-size` not read by the icon; the disabled `nph-button` dimmed twice inside a dimmed zone and item; thumbnails made again after the zone left the page; the same live region message not announced twice in a row; the address of a replaced thumbnail kept in the cache | `71f6db8`, each with a regression test (the disconnect test fails without the fix) |
| `e4593a7` | Two threads: the `ul` of the list without `role="list"` for Safari and VoiceOver; the usage example did not remove files | `5f989e1`, the first with a test, the second in the example of the three languages |
| `5f989e1` | One thread: the thumbnail did not follow `file-upload-item/thumbnail-size` | `97ed5df`, with a test of the override |
| `97ed5df` | No finding | Not applicable |

Between the first and the second round `e4593a7` came from a review of the whole component for the same kinds of
cases (lifecycle and announcements): two changes of the same frame are announced together, a thumbnail is given
back when its entry stops being an image, and what waited for the page or the pointer is cleared when the zone
leaves, each with a test. Copilot resolved five of the six threads of the first round by itself; the one about the
double opacity was answered and resolved by the orchestrator session with Elvys's authorization, because the
session that fixed the code was denied that write by the permission classifier. The branch took one merge of the
base (`d261d6c`, which brought the closing of DSA-72, only operation records), after the last Copilot review; the
proofs were run again on it. The proofs were run on `d261d6c`, the final head: all twelve exit 0 (`build:tokens`,
`test:tokens`, `test`, `typecheck`, `test:i18n`, `test:naming`, `test:spelling`,
`test:operacao`, `build-storybook`, `build:lib`, `test:package` and `git diff --check`). The first full run on
the PR failed on the Brands test of the wave, because the item is a piece of its own and needed to be inside a
frame of the `Brands` story; it was fixed before the PR opened. The Azure Build failed once, after 40 seconds, on
the head `71f6db8` (build 624651) and passed when run again; the Azure Build and Test were SUCCESS on the final head.

## Command

```text
git merge-base --is-ancestor d261d6c5bb58d997397c54e096ffa69aa0d896cb origin/v/5.0.0
```

## Output

No output. Exit code `0`: commit `d261d6c` is an ancestor of `v/5.0.0`. Checked against `origin/v/5.0.0` at
`c904f3e`.

## Still open

The gate `stroke-style-token` stays **pending** and keeps the task in `in-review`: the `strokeStyle` type in
`scripts/tokens-lib.mjs` and the tokens `core.border-style.dashed` and `file-upload.border-style` are token work,
which belongs to Indiane through Claude in Figma, and an agent of the code owner never creates or changes a token.
The zone writes `border-style: dashed`, as the task says, with a comment that points to the gate. Five decisions
wait for Indiane, recorded in the task and in P119; none blocked the merge:

- **D-1**: the `border-style` tokens and the `strokeStyle` type of the build (the gate above).
- **D-2**: `nph-button` forwards no `aria-describedby`, so the rule and the reason describe the group of the zone
  and not the button itself.
- **D-3**: the items of a disabled zone, which the design does not draw.
- **D-4**: where the reason of the error is shown inside `nph-field`.
- **D-5**: the lines of the item (the format and size line apart from the status line).
