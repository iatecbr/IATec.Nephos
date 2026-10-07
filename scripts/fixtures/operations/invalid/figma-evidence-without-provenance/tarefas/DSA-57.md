```json
{
  "id": "DSA-57",
  "goal": "Exemplo de validacao do verificador operacional.",
  "phase": "F4",
  "approved_order": 10,
  "owner": "claude-code",
  "state": "ready",
  "piece": "nph-icon",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "A documentacao do componente no Figma foi aceita por Indiane.",
      "command": null,
      "evidence": "scripts/fixtures/operations/invalid/figma-evidence-without-provenance/evidencias/DSA-57/documentacao-figma-aceita-2026-09-10.md",
      "result": "passed",
      "verified_at": "2026-09-10",
      "verified_by": "indiane"
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "scripts/fixtures/operations/invalid/figma-evidence-without-provenance/evidencias/DSA-57/documentacao-figma-aceita-2026-09-10.md"
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

# DSA-57 — gate documental aprovado sem procedencia

## Objetivo
Exemplo de validacao do verificador operacional.

## Como se prova
Rodando `node scripts/verificar-operacao.mjs --exemplos`, que valida esta arvore.
O gate `figma-docs-accepted` passou e aponta para uma evidencia que existe
e casa a tarefa, mas a `external_origin` dela nao declara `author` — nao da para
saber quem registrou a aceitacao.

## O que esta tarefa nao faz
Nada alem de servir de entrada para o verificador.

## Fontes
- `docs/operacao/README.md`
