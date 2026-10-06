```json
{
  "id": "DSA-10",
  "objetivo": "Implement the nph-separator, the one-line decorative divider, with the contract accepted in Figma.",
  "fase": "F4",
  "ordem_aprovada": 120,
  "responsavel": "claude-codigo",
  "estado": "pronta",
  "peca": "nph-separator",
  "dependencias": [],
  "gates": [
    {
      "id": "documentacao-figma-aceita",
      "descricao": "The nph-separator documentation in Figma was accepted by Indiane and recorded as evidence.",
      "comando": null,
      "evidencia": "docs/operacao/evidencias/DSA-10/documentacao-figma-aceita-2026-10-01.md",
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
    "docs/operacao/evidencias/DSA-10/documentacao-figma-aceita-2026-10-01.md"
  ],
  "referencias_de_decisao": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-05.md, first-delivery cut (Batch A)"
  ],
  "origem_externa": {
    "classificacao": "interna-permitida",
    "url_ou_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1196-674",
    "data": "2026-10-01",
    "autoria": "indiane",
    "trecho": null,
    "decisao_convertida": "The nph-separator frame (1196:674) was accepted as the API and behavior specification of the nph-separator. COMPONENT_SET 762:6, `orientacao` variant horizontal|vertical, default horizontal. On 05-10-2026 Indiane approved the cut of the first delivery, with Batch A in one plan and one PR."
  },
  "revisao_git": { "branch": null, "commit": null, "pr": null },
  "contexto": null,
  "atualizado_em": "2026-10-05"
}
```

# DSA-10 — nph-separator, the divider

## Goal
The `nph-separator` exists in `src/components/nph-separator/`, with a spec, tests
and stories, in the contract accepted in Figma: a `border/width` line in
`color/border`, horizontal or vertical, that fills the container and is hidden from
the screen reader.

## How it is proved
**`documentacao-figma-aceita`** — the `nph-separator` frame (`1196:674`) of the
Figma file `DS-IA-NEPHOS 5.0` was accepted by Indiane on 01-10-2026, with the Figma
UX QA and the text audit approved. The evidence names the frame and the
COMPONENT_SET (`762:6`).

**`revisao-e-merge`** — component, CSS, tests, stories, spec and the technical
decision pass the proof commands, are reviewed by `maurocsjr` and
merged into `v/5.0.0`.

## What this task does not do
It does not create a variant with text, thickness or a new color. It does not serve
as a spacer or as a field border.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, frame `1196:674` and set `762:6`
- `design.md` — `border/width`, `color/border`, `layout/separator-*`
- `fichas/_modelo.md`
