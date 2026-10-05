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
    "decisao_convertida": "Leitura das variaveis locais do Figma (core 322, semantic 195, theme 14) contra src/tokens/source: 50 tokens de theme e semantic que o Figma tinha e o codigo nao, 5 tokens com valor antigo no codigo e os 47 primitivos que os resolvem."
  }
}
```

# DSA-04 — `tokens-conferidos-com-figma`

Os tokens que o `nph-label` e o `nph-tooltip` consomem, e os demais que o Figma
`DS-IA-NEPHOS 5.0` tinha e o codigo nao, foram trazidos para
`src/tokens/source/*.tokens.json` no commit `e03e492`. Este gate prova que o
`src/tokens/generated/tokens.css` gerado nesse commit bate com a leitura do
Figma.

## Arquivos

- `docs/operacao/evidencias/DSA-04/tokens-figma-2026-10-05.json` — a leitura do
  Figma de 05-10-2026: nome, tipo e alias por modo dos 50 tokens novos e dos 5
  repontados, e o valor dos 47 primitivos.
- `docs/operacao/evidencias/DSA-04/conferir-tokens-figma.cjs` — o script de
  conferencia. So leitura, sem dependencia.

## Como rodar de novo

Da raiz do repositorio, no commit `e03e492` ou depois dele:

    node docs/operacao/evidencias/DSA-04/conferir-tokens-figma.cjs

## Saida, sem edicao

    conferidos: 102 tokens (47 primitivos, 50 novos, 5 repontados); divergencias: 0

Codigo de saida: 0.

## Limite

A leitura vem das consultas as variaveis do Figma feitas em 05-10-2026. Nenhum
texto de uso das variaveis entra aqui. Os textos em rascunho e as variaveis sem
descricao ficam para aprovacao de Indiane.
