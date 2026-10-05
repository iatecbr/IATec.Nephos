```json
{
  "id": "DSA-13",
  "objetivo": "Implementar o nph-button, o botao que dispara uma acao identificada por texto, com o conjunto so icone, no contrato aceito no Figma.",
  "fase": "F4",
  "ordem_aprovada": 135,
  "responsavel": "claude-codigo",
  "estado": "bloqueada",
  "peca": "nph-button",
  "dependencias": ["DSA-03", "DSA-09"],
  "gates": [
    {
      "id": "documentacao-figma-aceita",
      "descricao": "A documentacao de nph-button no Figma, com o conjunto so icone, foi aceita por Indiane e registrada como evidencia.",
      "comando": null,
      "evidencia": "docs/operacao/evidencias/DSA-13/documentacao-figma-aceita-2026-10-02.md",
      "resultado": "passou",
      "verificado_em": "2026-10-02",
      "verificado_por": "indiane"
    },
    {
      "id": "revisao-e-merge",
      "descricao": "Componente, CSS, testes, stories, documentacao do Storybook, ficha e decisao tecnica revisados por maurocsjr e mergeados na v/5.0.0.",
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
      "o_que_trava": "DSA-09 sem merge: o nph-spinner, que o estado carregando do botao usa, so existe no PR #54.",
      "dono": "maurocsjr",
      "o_que_resolve": "Revisao e merge do PR #54 na v/5.0.0.",
      "aberto_em": "2026-10-05"
    }
  ],
  "decisoes_pendentes": [],
  "evidencias": [
    "docs/operacao/evidencias/DSA-13/documentacao-figma-aceita-2026-10-02.md",
    "docs/operacao/evidencias/DSA-13/storybook-validacao-2026-10-05.md"
  ],
  "referencias_de_decisao": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-05.md, recorte da primeira entrega (Lote B)",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-02.md, hover solido nos tokens de hover",
    "WORK BRAIN — 02 PROJETOS/DS-Agentico/Registro de decisões — Nephos.md, B1 a B6"
  ],
  "origem_externa": {
    "classificacao": "interna-permitida",
    "url_ou_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1197-5449",
    "data": "2026-10-02",
    "autoria": "indiane",
    "trecho": null,
    "decisao_convertida": "O frame nph-button (1197:5449) foi aceito como especificacao de API e comportamento do nph-button. COMPONENT_SET 461:13009 (com texto) e COMPONENT_SET 498:15671 (so icone), variantes tipo, enfase, size e state, com icone de inicio e de fim. O aceite de 01-10-2026 foi completado em 02-10-2026 pelo hover solido nos tokens de hover, que supera a B4."
  },
  "revisao_git": { "branch": "feat/lote-b-badge-button", "commit": null, "pr": "56" },
  "contexto": null,
  "atualizado_em": "2026-10-05"
}
```

# DSA-13 — nph-button, o botao

## Objetivo
Existe o `nph-button` em `src/components/nph-button/`, com ficha, testes,
stories e pagina de documentacao no Storybook, no contrato aceito no Figma:
tipo, enfase, tamanho e estado, icone opcional no inicio e no fim, o botao so
com icone e o estado de carregamento com o girador do `nph-spinner`.

## Por que esta bloqueada
O estado de carregamento usa o `nph-spinner` (DSA-09), que so existe no PR #54.
O gate documental passou: o bloqueio e so de dependencia. Por isso o codigo do
botao e escrito numa branch empilhada sobre o PR #54, e nao e excecao a regra
que cobra o gate documental antes do codigo. A tarefa sai de `bloqueada` depois
do merge do PR #54, e so vai a `em-revisao` dentro do PR do Lote B, com a ficha.

## Como se prova
**`documentacao-figma-aceita`** — o quadro `nph-button` (`1197:5449`) do Figma
`DS-IA-NEPHOS 5.0` foi aceito por Indiane em 01-10-2026 e completado em
02-10-2026 pelo hover solido nos tokens de hover, com QA UX de Figma e
auditoria textual aprovados em 02-10-2026. A evidencia nomeia o frame e os
COMPONENT_SET (`461:13009` e `498:15671`).

**`revisao-e-merge`** — componente, CSS, testes, stories, documentacao do
Storybook, ficha e decisao tecnica passam pelos comandos de prova, sao
revisados por `maurocsjr` e mergeados na `v/5.0.0`.

## O que esta tarefa não faz
Nao cria link com cara de botao, envio de formulario, grupo de botoes, tamanho,
tipo ou enfase fora da matriz aceita.

## Fontes
- Figma `DS-IA-NEPHOS 5.0`, quadro `1197:5449` e conjuntos `461:13009` e `498:15671`
- `design.md` — `control/height-*`, `space/control-padding`, `space/inline-tight`, `radius/control`, `text/label-md`, `icon/size-*`, `state/disabled-opacity`, `focus/*` e as cores de `color/*` e `status/*`
- `fichas/_modelo.md`
