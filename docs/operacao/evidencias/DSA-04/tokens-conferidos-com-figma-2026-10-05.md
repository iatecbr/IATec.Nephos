```json
{
  "tarefa": "DSA-04",
  "gate": "tokens-conferidos-com-figma",
  "data": "2026-10-05",
  "responsavel": "claude-codigo",
  "comando": "node docs/operacao/evidencias/DSA-04/conferir-tokens-figma.cjs",
  "codigo_de_saida": 0,
  "sha": "e03e4926aff69af39f9563ad58df36768431835e",
  "origem_externa": {
    "classificacao": "interna-permitida",
    "url_ou_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0",
    "data": "2026-10-05",
    "autoria": "claude-codigo",
    "trecho": null,
    "decisao_convertida": "Reading of the Figma local variables (core 322, semantic 195, theme 14) against src/tokens/source: 50 theme and semantic tokens that Figma had and the code did not, 5 tokens with an old value in the code and the 47 primitives that resolve them."
  }
}
```

# DSA-04 — `tokens-conferidos-com-figma`

The tokens that `nph-label` and `nph-tooltip` consume, and the others that the
Figma `DS-IA-NEPHOS 5.0` had and the code did not, were brought into
`src/tokens/source/*.tokens.json` in commit `e03e492`. This gate proves that the
`src/tokens/generated/tokens.css` generated at that commit matches the reading of
Figma.

## Files

- `docs/operacao/evidencias/DSA-04/tokens-figma-2026-10-05.json` — the Figma
  reading of 05-10-2026: name, type and alias per mode of the 50 new tokens and of
  the 5 repointed ones, and the value of the 47 primitives.
- `docs/operacao/evidencias/DSA-04/conferir-tokens-figma.cjs` — the check
  script. Read-only, no dependencies.

## How to run it again

From the repository root, at commit `e03e492` or later:

    node docs/operacao/evidencias/DSA-04/conferir-tokens-figma.cjs

## Output, unedited

    conferidos: 102 tokens (47 primitivos, 50 novos, 5 repontados); divergencias: 0

Exit code: 0.

## Limit

The reading comes from the Figma variable queries made on 05-10-2026. No usage
text of the variables enters here. The draft texts and the variables without a
description are left for Indiane's approval.
