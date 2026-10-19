```json
{
  "task": "DSA-30",
  "gate": "decisions-recorded",
  "date": "2026-10-19",
  "owner": "claude-code",
  "command": "grep -n '^## P70 ' docs/decisoes-tecnicas.md && grep -n '^## P71 ' docs/decisoes-tecnicas.md && grep -n '^## P72 ' docs/decisoes-tecnicas.md && grep -n '^\\*\\*Amendment of 15/10/2026 .* American English\\.\\*\\*' docs/decisoes-tecnicas.md && grep -n 'The exception is the .use. and .do not use. lists of a' docs/stories.md && grep -nF '3. **Usage**: the markup of the accepted frame' docs/stories.md && grep -nF '| `text` and `list` | `text/body-lg`' docs/stories.md && grep -nF '| `useDontUse` | when to use and when not to use side by side' docs/stories.md && grep -nF '`nph-button` lacks Anatomy, and' docs/stories.md && grep -n 'There is no brand selector' docs/stories.md && grep -nF '| `body-lg` × `body-md` |' design.md && grep -n 'core/layout-width/reading: .*valor: 560' design.md && grep -nE '^    valor: 560$' design.md && grep -n '^## Note of 2026-10-15$' docs/operacao/evidencias/DSA-03/documentacao-figma-aceita-2026-09-14.md docs/operacao/evidencias/DSA-13/documentacao-figma-aceita-2026-10-02.md",
  "exit_code": 0,
  "sha": "22cfd8725f06ae15de7acadb8a4c4d0cfd37b0d8",
  "external_origin": null
}
```

# DSA-30 — `decisions-recorded`

Indiane answered the eight Storybook documentation questions (D1 to D8) on
2026-10-15. Each answer is in its canonical source on `v/5.0.0`. This file holds
one section per answer, with the place of the record found by `grep -n` at
`22cfd87`, the tip of the branch when it was written. PR #86 brought the records
of D1, D2, D3, D4, D6, D7 and D8; commit `c4605e8` brought D5 through Claude in
Figma. This task decides nothing: the work that follows each answer is a task of
its own, DSA-32 to DSA-37.

## Command

```text
grep -n '^## P70 ' docs/decisoes-tecnicas.md && grep -n '^## P71 ' docs/decisoes-tecnicas.md && grep -n '^## P72 ' docs/decisoes-tecnicas.md && grep -n '^\*\*Amendment of 15/10/2026 .* American English\.\*\*' docs/decisoes-tecnicas.md && grep -n 'The exception is the .use. and .do not use. lists of a' docs/stories.md && grep -nF '3. **Usage**: the markup of the accepted frame' docs/stories.md && grep -nF '| `text` and `list` | `text/body-lg`' docs/stories.md && grep -nF '| `useDontUse` | when to use and when not to use side by side' docs/stories.md && grep -nF '`nph-button` lacks Anatomy, and' docs/stories.md && grep -n 'There is no brand selector' docs/stories.md && grep -nF '| `body-lg` × `body-md` |' design.md && grep -n 'core/layout-width/reading: .*valor: 560' design.md && grep -nE '^    valor: 560$' design.md && grep -n '^## Note of 2026-10-15$' docs/operacao/evidencias/DSA-03/documentacao-figma-aceita-2026-09-14.md docs/operacao/evidencias/DSA-13/documentacao-figma-aceita-2026-10-02.md
```

## Output

```text
1164:## P70 — Package entry points and the Usage section
1218:## P71 — `Docs` page lists read from the Metadata
1255:## P72 — Accessibility gate in the tests
798:**Amendment of 15/10/2026 — American English.** No rule named the variant, and
338:**The exception is the "use" and "do not use" lists of a `Docs` page**: they come
402:   3. **Usage**: the markup of the accepted frame and the import line,
381:| `text` and `list` | `text/body-lg`, with a limited reading width (decided by Indiane on 15-10-2026, as [`../design.md`](../design.md), §2b) |
385:| `useDontUse` | when to use and when not to use side by side, in one block, in the `status/success-*` and `status/error-*` colors; the lists are `use_when` and `do_not_use_when` of the Metadata of the sheet, and a test fails the page that differs from it (decided by Indiane on 15-10-2026, **P71**) |
431:and `nph-skeleton` follow the order of the model. `nph-button` lacks Anatomy, and
544:**There is no brand selector** (decided by Indiane on 15-10-2026). The page
2105:| `body-lg` × `body-md` | `body-lg` is for reading; `body-md` is for operating. A documentation paragraph is `lg`. Text in a form, table or panel is `md`. |
1392:  core/layout-width/reading:           { valor: 560,  css: '--nph-core-layout-width-reading',           alias_de: 'layout/max-reading' }
1572:    valor: 560
docs/operacao/evidencias/DSA-03/documentacao-figma-aceita-2026-09-14.md:38:## Note of 2026-10-15
docs/operacao/evidencias/DSA-13/documentacao-figma-aceita-2026-10-02.md:45:## Note of 2026-10-15
```

Exit code `0`.

## Summary

| ID | Topic | Answer | Where it is recorded |
|---|---|---|---|
| D1 | Docs page lists | A + D: lists read from the Metadata, plus an equality test | `docs/decisoes-tecnicas.md:1218` (P71); `docs/stories.md:338`, `:385` |
| D2 | Usage section | C: markup and `import 'nephos/nph-<name>';`, `exports` `./nph-*` | `docs/decisoes-tecnicas.md:1164` (P70); `docs/stories.md:402` |
| D3 | Accessibility gate | C: Storybook a11y addon in the tests, WCAG 2.2 AA, fails the run | `docs/decisoes-tecnicas.md:1255` (P72) |
| D4 | Brand global | B: no global; a Validation story with seven brands, light and dark | `docs/stories.md:544` |
| D5 | `layout/max-reading` | B: 720 to 560 | `design.md:1392`, `:1572`; commit `c4605e8` |
| D6 | `body-md` or `body-lg` | A: `body-lg` in Docs paragraphs and lists | `design.md:2105`; `docs/stories.md:381` |
| D7 | Anatomy and Examples | A: the accepted frames have both | `docs/stories.md:431`; DSA-03 evidence `:38`; DSA-13 evidence `:45` |
| D8 | British or American English | A: American English, checked by cspell en-US | `docs/decisoes-tecnicas.md:798` (amendment of P64) |

## D1 — Docs page lists

**Indiane's answer (2026-10-15): A + D.** The Docs page reads `use_when` and
`do_not_use_when` from the Metadata of the sheet, and a test checks that the page
and the sheet are the same. Figma is the source only at the start; once the tests
pass and the sheet exists, the repository sheet is the source.

**Recorded in:**
- `docs/decisoes-tecnicas.md:1218`, P71.
- `docs/stories.md:338`, the exception paragraph of §4.8: the lists come from the
  Metadata, not from the dictionary.
- `docs/stories.md:385`, the `useDontUse` row of §4.10.

**Follow-up task:** DSA-34.

## D2 — Usage section with markup and an import line

**Indiane's answer (2026-10-15): C.** A Usage section with the markup and the
import line, the package being `nephos` and each component imported with
`import 'nephos/nph-<name>';`. The section comes right after API, and
`package.json` gets `exports` with `./nph-*`.

**Recorded in:**
- `docs/decisoes-tecnicas.md:1164`, P70.
- `docs/stories.md:402`, item 3 of the model order in §4.10, right after API.

**Follow-up task:** DSA-35.

## D3 — Accessibility gate

**Indiane's answer (2026-10-15): C.** The Storybook accessibility addon is tied
to the tests and set to fail the run, with the WCAG 2.2 AA rules.

**Recorded in:**
- `docs/decisoes-tecnicas.md:1255`, P72.

**Follow-up task:** DSA-32.

## D4 — Brand global in Storybook

**Indiane's answer (2026-10-15): B.** No brand global. A Validation story per
component where the brand matters, with the seven brands in light and dark. No
technical decision changes, so the only record is the rule in the stories guide.

**Recorded in:**
- `docs/stories.md:544`, §6.4: "There is no brand selector".

**Follow-up task:** DSA-36.

## D5 — `layout/max-reading` and the line length

**Indiane's answer (2026-10-15): B.** The value of `layout/max-reading` changes
from 720 to 560 px, about 74 characters per line in `body-lg`. Indiane made the
change through Claude in Figma, as tokens come from Figma.

**Recorded in:**
- commit `c4605e8` (`tokens(layout): layout/max-reading de 720 para 560`), which
  carries it to `src/tokens/source/core.tokens.json` and `design.md`.
- `design.md:1392`, `core/layout-width/reading` with `valor: 560`.
- `design.md:1572`, `layout/max-reading` with `valor: 560`.

**Follow-up task:** none.

## D6 — `body-md` or `body-lg` in Docs prose

**Indiane's answer (2026-10-15): A.** Docs page paragraphs and lists use
`body-lg`.

**Recorded in:**
- `design.md:2105`, the `body-lg` × `body-md` row of §2b: "A documentation
  paragraph is `lg`". The row already said so; it needed no change.
- `docs/stories.md:381`, the `text` and `list` row of §4.10.

**Follow-up task:** DSA-33.

## D7 — Anatomy and Examples in `nph-button` and `nph-icon`

**Indiane's answer (2026-10-15): A.** The accepted frames have Anatomy and
Examples (`nph-button` `1197:5449`, `nph-icon` `1130:956`), and the Docs pages
get the sections from them.

**Recorded in:**
- `docs/stories.md:431`, the Limit of §4.10.
- `docs/operacao/evidencias/DSA-03/documentacao-figma-aceita-2026-09-14.md:38`,
  "Note of 2026-10-15".
- `docs/operacao/evidencias/DSA-13/documentacao-figma-aceita-2026-10-02.md:45`,
  "Note of 2026-10-15".

**Corrected fact.** `nph-button` lacks only Anatomy on its Docs page, which
already has Examples. `nph-icon` lacks Anatomy and Examples. The Limit of §4.10
and the two notes say so.

**Follow-up task:** DSA-33.

## D8 — British or American English

**Indiane's answer (2026-10-15): A.** American English in all prose, checked by
the cspell spell checker set to American English.

**Recorded in:**
- `docs/decisoes-tecnicas.md:798`, "Amendment of 15/10/2026 — American English"
  of P64.

**Follow-up task:** DSA-37.

## Still open

Recorded only, not fixed here, and `design.md` was not edited. After D5 the two
`use` texts in `design.md` give different line-length ranges for the same
`body-lg` reading text:
- `design.md:930`, `text/body-lg`: "line of 60 to 80 characters";
- `design.md:1573`, `layout/max-reading`: "inside the 50 to 75 range".

Both are token `use` texts, so any change goes through Figma and Claude in Figma,
never through an agent in the repository.
