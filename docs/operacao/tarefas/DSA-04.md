```json
{
  "id": "DSA-04",
  "objetivo": "Add the information trigger (info and infoLabel) to nph-label, with a visible focus and opening of the nph-tooltip, in the contract accepted in Figma.",
  "fase": "F4",
  "ordem_aprovada": 110,
  "responsavel": "claude-codigo",
  "estado": "em-revisao",
  "peca": "nph-label",
  "dependencias": ["DSA-07", "DSA-08"],
  "gates": [
    {
      "id": "documentacao-figma-aceita",
      "descricao": "The nph-label documentation in Figma, with info, focus and the open row, was accepted by Indiane and recorded as evidence.",
      "comando": null,
      "evidencia": "docs/operacao/evidencias/DSA-04/documentacao-figma-aceita-2026-10-01.md",
      "resultado": "passou",
      "verificado_em": "2026-10-01",
      "verificado_por": "indiane"
    },
    {
      "id": "tokens-conferidos-com-figma",
      "descricao": "The theme and semantic tokens from Figma, and the primitives that resolve them, are in the generated tokens.css with the same alias and value.",
      "comando": "node docs/operacao/evidencias/DSA-04/conferir-tokens-figma.cjs",
      "evidencia": "docs/operacao/evidencias/DSA-04/tokens-conferidos-com-figma-2026-10-05.md",
      "resultado": "passou",
      "verificado_em": "2026-10-05",
      "verificado_por": "claude-codigo"
    },
    {
      "id": "revisao-e-merge",
      "descricao": "Component, CSS, tests, stories, spec and P62.6 reviewed by maurocsjr and merged into v/5.0.0; rule 6 of design.md goes in through PR #57.",
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
    "docs/operacao/evidencias/DSA-04/documentacao-figma-aceita-2026-10-01.md",
    "docs/operacao/evidencias/DSA-04/tokens-conferidos-com-figma-2026-10-05.md",
    "docs/operacao/evidencias/DSA-04/storybook-validacao-2026-10-06.md"
  ],
  "referencias_de_decisao": [
    "docs/decisoes-tecnicas.md#p62",
    "WORK BRAIN — 02 PROJETOS/DS-Agentico/Registro de decisões — Nephos.md, L8 a L11"
  ],
  "origem_externa": {
    "classificacao": "interna-permitida",
    "url_ou_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1194-1482",
    "data": "2026-10-01",
    "autoria": "indiane",
    "trecho": null,
    "decisao_convertida": "The nph-label frame (1194:1482) and the COMPONENT_SET 374:6 were accepted with info, infoLabel, the trigger focus and the open row. An empty infoLabel omits the trigger (decision of 01-10-2026). On 05-10-2026 Indiane decided that the nph-tooltip (DSA-08) goes into code before this delivery."
  },
  "revisao_git": { "branch": "feat/dsa04-nph-label-info", "commit": "3417a76", "pr": "58" },
  "contexto": null,
  "atualizado_em": "2026-10-06"
}
```

# DSA-04 — nph-label information trigger

## Goal
The `nph-label` accepts `info` and `infoLabel` (`info-label`). With both filled in,
it shows the information trigger, with a visible focus, which opens the
`nph-tooltip` with the text of `info`. Without `info`, the label is the one it is
today.

## How it is proved
**`documentacao-figma-aceita`** — the `nph-label` frame (`1194:1482`) and the
COMPONENT_SET `374:6` were accepted by Indiane on 01-10-2026, with the Figma UX QA
and the text audit approved.

**`tokens-conferidos-com-figma`** — `node
docs/operacao/evidencias/DSA-04/conferir-tokens-figma.cjs` exits 0: the focus
tokens, the tooltip tokens and the others that Figma had and the code did not are
in the generated `tokens.css` with the same alias and value.

**`revisao-e-merge`** — component, CSS, tests, stories, spec and the technical
decision P62.6 pass the proof commands, are reviewed by `maurocsjr` and
merged into `v/5.0.0`. Rule 6 of `design.md` (focus border and halo) goes in
through PR #57.

## What this task does not do
It does not implement the `nph-tooltip` (DSA-08). It does not rename or deprecate
`focus/ring` and `focus/ring-error`. It does not change `nph-field` or `nph-input`.
It does not change Figma.

## Sources
- `fichas/nph-label.md`
- `src/components/nph-label/`
- `design.md`
- `docs/decisoes-tecnicas.md`
- `docs/operacao/README.md`
- `GOVERNANCA.md`, `AGENTS.md`, `CLAUDE.md`
- Figma `DS-IA-NEPHOS 5.0`, frame `1194:1482` and COMPONENT_SET `374:6`
- WORK BRAIN — `02 PROJETOS/DS-Agentico/Registro de decisões — Nephos.md`, L8 a L11
