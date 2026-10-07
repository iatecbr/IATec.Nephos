```json
{
  "id": "DSA-04",
  "goal": "Exercitar componente com documentacao Figma aceita e ainda sem ficha canonica.",
  "phase": "F4",
  "approved_order": 60,
  "owner": "claude-code",
  "state": "ready",
  "piece": "nph-inexistente",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "A documentacao do componente no Figma foi aceita por Indiane.",
      "command": null,
      "evidence": "scripts/fixtures/operations/valid/evidencias/DSA-04/documentacao-figma-aceita-2026-09-10.md",
      "result": "passed",
      "verified_at": "2026-09-10",
      "verified_by": "indiane"
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "scripts/fixtures/operations/valid/evidencias/DSA-04/documentacao-figma-aceita-2026-09-10.md"
  ],
  "decision_refs": [],
  "external_origin": null,
  "git_review": {
    "branch": null,
    "commit": null,
    "pr": null
  },
  "context": null,
  "updated_at": "2026-09-10"
}
```

# DSA-04 — componente liberado para codigo, sem ficha ainda

## Objetivo
Exercitar a trava documental no caso que ela existe para permitir: a
documentacao Figma ja foi aceita, o codigo local pode comecar, e a ficha
canonica so sera cobrada em `in-review`.

## Como se prova
Rodando `node scripts/verificar-operacao.mjs --exemplos`, que valida esta arvore.
A V28 nao dispara porque o estado e `ready`; a V30 nao dispara porque o gate
`figma-docs-accepted` passou; a V31 nao dispara porque a evidencia declara
a procedencia inteira.

## O que esta tarefa nao faz
Nao entrega nada real: e fixture da trava documental. A peca `nph-inexistente`
nao tem ficha de proposito.

## Fontes
- `docs/operacao/README.md`
