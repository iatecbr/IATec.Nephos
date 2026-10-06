```json
{
  "id": "DSA-58",
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
      "evidence": "scripts/fixtures/operations/invalid/figma-evidence-outside-directory/proof-outside/DSA-58/documentacao-figma-aceita-2026-09-10.md",
      "result": "passed",
      "verified_at": "2026-09-10",
      "verified_by": "indiane"
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "scripts/fixtures/operations/invalid/figma-evidence-outside-directory/proof-outside/DSA-58/documentacao-figma-aceita-2026-09-10.md"
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

# DSA-58 — evidencia documental fora de evidencias/DSA-58/

## Objetivo
Exemplo de validacao do verificador operacional.

## Como se prova
Rodando `node scripts/verificar-operacao.mjs --exemplos`, que valida esta arvore.
A evidencia existe, casa a tarefa e declara a procedencia inteira — classificacao,
URL do Figma, data, autoria e a decisao convertida com frame e COMPONENT_SET. O
unico defeito e o lugar: ela esta em `proof-outside/DSA-58/`, e nao em
`evidencias/DSA-58/`. Prova que muda de endereco deixa de ser encontravel pela
convencao, e a V31 cobra o endereco junto com o conteudo.

## O que esta tarefa nao faz
Nada alem de servir de entrada para o verificador.

## Fontes
- `docs/operacao/README.md`
