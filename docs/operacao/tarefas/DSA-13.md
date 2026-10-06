```json
{
  "id": "DSA-13",
  "objetivo": "Implement the nph-button, the button that triggers an action identified by text, with the icon-only set, in the contract accepted in Figma.",
  "fase": "F4",
  "ordem_aprovada": 135,
  "responsavel": "claude-codigo",
  "estado": "bloqueada",
  "peca": "nph-button",
  "dependencias": ["DSA-03", "DSA-09"],
  "gates": [
    {
      "id": "documentacao-figma-aceita",
      "descricao": "The nph-button documentation in Figma, with the icon-only set, was accepted by Indiane and recorded as evidence.",
      "comando": null,
      "evidencia": "docs/operacao/evidencias/DSA-13/documentacao-figma-aceita-2026-10-02.md",
      "resultado": "passou",
      "verificado_em": "2026-10-02",
      "verificado_por": "indiane"
    },
    {
      "id": "revisao-e-merge",
      "descricao": "Component, CSS, tests, stories, Storybook documentation, spec and technical decision reviewed by maurocsjr and merged into v/5.0.0.",
      "comando": null,
      "evidencia": null,
      "resultado": "pendente",
      "verificado_em": null,
      "verificado_por": null
    }
  ],
  "bloqueios": [
    {
      "id": "B1",
      "o_que_trava": "DSA-09 not merged: the nph-spinner, which the button's loading state uses, exists only in PR #54.",
      "dono": "maurocsjr",
      "o_que_resolve": "Review and merge of PR #54 into v/5.0.0.",
      "aberto_em": "2026-10-05"
    }
  ],
  "decisoes_pendentes": [],
  "evidencias": [
    "docs/operacao/evidencias/DSA-13/documentacao-figma-aceita-2026-10-02.md"
  ],
  "referencias_de_decisao": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-05.md, first-delivery cut (Batch B)",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-02.md, solid hover in the hover tokens",
    "WORK BRAIN — 02 PROJETOS/DS-Agentico/Registro de decisões — Nephos.md, B1 a B6"
  ],
  "origem_externa": {
    "classificacao": "interna-permitida",
    "url_ou_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1197-5449",
    "data": "2026-10-02",
    "autoria": "indiane",
    "trecho": null,
    "decisao_convertida": "The nph-button frame (1197:5449) was accepted as the API and behavior specification of the nph-button. COMPONENT_SET 461:13009 (with text) and COMPONENT_SET 498:15671 (icon-only), variants `tipo`, `enfase`, `size` and `state`, with a start icon and an end icon. The acceptance of 01-10-2026 was completed on 02-10-2026 by the solid hover in the hover tokens, which supersedes B4."
  },
  "revisao_git": { "branch": "feat/lote-b-badge-button", "commit": null, "pr": null },
  "contexto": null,
  "atualizado_em": "2026-10-05"
}
```

# DSA-13 — nph-button, the button

## Goal
The `nph-button` exists in `src/components/nph-button/`, with a spec, tests,
stories and a documentation page in Storybook, in the contract accepted in Figma:
type, emphasis, size and state, an optional icon at the start and at the end, the
icon-only button and the loading state with the spinner of the `nph-spinner`.

## Why it is blocked
The loading state uses the `nph-spinner` (DSA-09), which exists only in PR #54.
The documentation gate passed: the blocker is only a dependency. That is why the
button code is written on a branch stacked on top of PR #54, and it is not an
exception to the rule that requires the documentation gate before code. The task
leaves `bloqueada` after PR #54 is merged, and only goes to `em-revisao` inside the
Batch B PR, with the spec.

## How it is proved
**`documentacao-figma-aceita`** — the `nph-button` frame (`1197:5449`) of the Figma
file `DS-IA-NEPHOS 5.0` was accepted by Indiane on 01-10-2026 and completed on
02-10-2026 by the solid hover in the hover tokens, with the Figma UX QA and the
text audit approved on 02-10-2026. The evidence names the frame and the
COMPONENT_SETs (`461:13009` and `498:15671`).

**`revisao-e-merge`** — component, CSS, tests, stories, Storybook documentation,
spec and technical decision pass the proof commands, are reviewed by
`maurocsjr` and merged into `v/5.0.0`.

## What this task does not do
It does not create a link that looks like a button, form submission, a button
group, or a size, type or emphasis outside the accepted matrix.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, frame `1197:5449` and sets `461:13009` and `498:15671`
- `design.md` — `control/height-*`, `space/control-padding`, `space/inline-tight`, `radius/control`, `text/label-md`, `icon/size-*`, `state/disabled-opacity`, `focus/*` and the colors of `color/*` and `status/*`
- `fichas/_modelo.md`
