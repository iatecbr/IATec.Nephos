```json
{
  "id": "DSA-09",
  "objetivo": "Implement the nph-spinner, the waiting spinner with no end time, with the contract accepted in Figma.",
  "fase": "F4",
  "ordem_aprovada": 115,
  "responsavel": "claude-codigo",
  "estado": "pronta",
  "peca": "nph-spinner",
  "dependencias": ["DSA-03"],
  "gates": [
    {
      "id": "documentacao-figma-aceita",
      "descricao": "The nph-spinner documentation in Figma was accepted by Indiane and recorded as evidence.",
      "comando": null,
      "evidencia": "docs/operacao/evidencias/DSA-09/documentacao-figma-aceita-2026-10-01.md",
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
    "docs/operacao/evidencias/DSA-09/documentacao-figma-aceita-2026-10-01.md",
    "docs/operacao/evidencias/DSA-09/nph-icon-revalidado-2026-10-05.md"
  ],
  "referencias_de_decisao": [
    "docs/decisoes-tecnicas.md#p21",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-05.md, first-delivery cut (Batch A)"
  ],
  "origem_externa": {
    "classificacao": "interna-permitida",
    "url_ou_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1195-22210",
    "data": "2026-10-01",
    "autoria": "indiane",
    "trecho": null,
    "decisao_convertida": "The nph-spinner frame (1195:22210) was accepted as the API and behavior specification of the nph-spinner. COMPONENT_SET 281:11, size variant sm|md, default sm. On 05-10-2026 Indiane approved the cut of the first delivery, with Batch A (icon, spinner, separator, kbd) in one plan and one PR."
  },
  "revisao_git": { "branch": null, "commit": null, "pr": null },
  "contexto": null,
  "atualizado_em": "2026-10-05"
}
```

# DSA-09 — nph-spinner, the spinner

## Goal
The `nph-spinner` exists in `src/components/nph-spinner/`, with a spec, tests and
stories, in the contract accepted in Figma: the `circle-notch` of the `nph-icon`
spinning at `motion/loop-*`, in sizes `sm` and `md`, stopped under reduced motion.

## How it is proved
**`documentacao-figma-aceita`** — the `nph-spinner` frame (`1195:22210`) of the
Figma file `DS-IA-NEPHOS 5.0` was accepted by Indiane on 01-10-2026, with the Figma
UX QA and the text audit approved. The evidence names the frame and the
COMPONENT_SET (`281:11`).

**`revisao-e-merge`** — component, CSS, tests, stories, spec and the technical
decision pass the proof commands, are reviewed by `maurocsjr` and
merged into `v/5.0.0`.

The evidence `nph-icon-revalidado-2026-10-05.md` records that the `nph-icon`, which
the spinner consumes, matches the accepted Figma.

## What this task does not do
It does not change the `nph-icon`. It does not put the spinner inside the
`nph-button` (Batch B). It does not create an `lg` size, a new token or a
known-progress indicator.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, frame `1195:22210` and set `281:11`
- `design.md` — `motion/loop-duration`, `motion/loop-easing`, `icon/size-*`
- `docs/decisoes-tecnicas.md` — P21
- `fichas/_modelo.md`, `fichas/nph-spinner.md`
