```json
{
  "id": "DSA-11",
  "objetivo": "Implement the nph-kbd, the static key of a keyboard shortcut, with the contract accepted in Figma.",
  "fase": "F4",
  "ordem_aprovada": 125,
  "responsavel": "claude-codigo",
  "estado": "em-revisao",
  "peca": "nph-kbd",
  "dependencias": [],
  "gates": [
    {
      "id": "documentacao-figma-aceita",
      "descricao": "The nph-kbd documentation in Figma was accepted by Indiane and recorded as evidence.",
      "comando": null,
      "evidencia": "docs/operacao/evidencias/DSA-11/documentacao-figma-aceita-2026-10-01.md",
      "resultado": "passou",
      "verificado_em": "2026-10-01",
      "verificado_por": "indiane"
    },
    {
      "id": "revisao-e-merge",
      "descricao": "Component, CSS, tests, stories, spec and technical decision reviewed by maurocsjr and merged into v/5.0.0.",
      "comando": null,
      "evidencia": null,
      "resultado": "pendente",
      "verificado_em": null,
      "verificado_por": null
    }
  ],
  "bloqueios": [],
  "decisoes_pendentes": [],
  "evidencias": [
    "docs/operacao/evidencias/DSA-11/documentacao-figma-aceita-2026-10-01.md",
    "docs/operacao/evidencias/DSA-11/storybook-validacao-2026-10-05.md"
  ],
  "referencias_de_decisao": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-02.md, a combination is one piece per key",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-05.md, first-delivery cut (Batch A)"
  ],
  "origem_externa": {
    "classificacao": "interna-permitida",
    "url_ou_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1193-20",
    "data": "2026-10-01",
    "autoria": "indiane",
    "trecho": null,
    "decisao_convertida": "The nph-kbd frame (1193:20) was accepted as the API and behavior specification of the nph-kbd. COMPONENT_SET: none; single COMPONENT 772:3, with the text property `tecla`. On 05-10-2026 Indiane approved the cut of the first delivery, with Batch A in one plan and one PR."
  },
  "revisao_git": { "branch": "feat/lote-a-icon-spinner-separator-kbd", "commit": null, "pr": "54" },
  "contexto": null,
  "atualizado_em": "2026-10-05"
}
```

# DSA-11 — nph-kbd, the key

## Goal
The `nph-kbd` exists in `src/components/nph-kbd/`, with a spec, tests and stories,
in the contract accepted in Figma: a static key, written as text, in `color/muted`
with a `color/border` border. A combination joins one piece per key.

## How it is proved
**`documentacao-figma-aceita`** — the `nph-kbd` frame (`1193:20`) of the Figma file
`DS-IA-NEPHOS 5.0` was accepted by Indiane on 01-10-2026, with the Figma UX QA and
the text audit approved. The evidence names the frame and declares that there is no
COMPONENT_SET: the component is single (`772:3`).

**`revisao-e-merge`** — component, CSS, tests, stories, spec and the technical
decision pass the proof commands, are reviewed by `maurocsjr` and
merged into `v/5.0.0`.

## What this task does not do
It does not create interaction, focus, a style variant or a combination in a single
piece.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, frame `1193:20` and component `772:3`
- `design.md` — `text/label-sm`, `color/muted`, `color/muted-foreground`,
  `color/border`, `border/width`, `radius/inner`, `space/inline-tight`
- `fichas/_modelo.md`
