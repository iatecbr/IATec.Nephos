```json
{
  "task": "DSA-15",
  "gate": "keys-in-english",
  "date": "2026-10-06",
  "owner": "claude-code",
  "command": "node scripts/verificar-operacao.mjs",
  "exit_code": 0,
  "sha": "827858fbf2d7f2d281350dcb5dd744afa2f398b4",
  "external_origin": null
}
```

# DSA-15 — `keys-in-english`

At `827858f` the contract keys covered by the decision recorded in
`docs/operacao/tarefas/DSA-15.md` are in English in three stacked pull requests:
#64 (token JSON), #65 (specs and Metadata) and #66 (operation schema). Each step
passes the proofs below on its own.

## Reading

```text
$ node scripts/verificar-operacao.mjs
17 task(s) checked.
OK: schema, states, dependencies, gates, evidence, context and spec check out.
$ node scripts/verificar-operacao.mjs --exemplos
RESULT: 1 valid tree + 28 of 28 invalid cases, each with the expected code.
$ npm run test:naming
RESULT: no technical name in Portuguese outside scripts/naming-exceptions.json.
$ npm run test:tokens
RESULT: 25 checks, all passed.
$ npm test
      Tests  369 passed (369)
```

`npm run build:tokens` regenerates `src/tokens/generated/tokens.css` with the same
content as before the change, `npx tsc --noEmit -p .` exits 0, `npm run test:i18n`
passes and the Storybook build completes.
