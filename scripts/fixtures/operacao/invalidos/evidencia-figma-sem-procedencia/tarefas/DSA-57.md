```json
{
  "id": "DSA-57",
  "objetivo": "Exemplo de validacao do verificador operacional.",
  "fase": "F4",
  "ordem_aprovada": 10,
  "responsavel": "claude-codigo",
  "estado": "pronta",
  "peca": "nph-icon",
  "dependencias": [],
  "gates": [
    {
      "id": "documentacao-figma-aceita",
      "descricao": "A documentacao do componente no Figma foi aceita por Indiane.",
      "comando": null,
      "evidencia": "scripts/fixtures/operacao/invalidos/evidencia-figma-sem-procedencia/evidencias/DSA-57/documentacao-figma-aceita-2026-09-10.md",
      "resultado": "passou",
      "verificado_em": "2026-09-10",
      "verificado_por": "indiane"
    }
  ],
  "bloqueios": [],
  "decisoes_pendentes": [],
  "evidencias": [
    "scripts/fixtures/operacao/invalidos/evidencia-figma-sem-procedencia/evidencias/DSA-57/documentacao-figma-aceita-2026-09-10.md"
  ],
  "referencias_de_decisao": [],
  "origem_externa": null,
  "revisao_git": {
    "branch": null,
    "commit": null,
    "pr": null
  },
  "contexto": null,
  "atualizado_em": "2026-09-10"
}
```

# DSA-57 — gate documental aprovado sem procedencia

## Objetivo
Exemplo de validacao do verificador operacional.

## Como se prova
Rodando `node scripts/verificar-operacao.mjs --exemplos`, que valida esta arvore.
O gate `documentacao-figma-aceita` passou e aponta para uma evidencia que existe
e casa a tarefa, mas a `origem_externa` dela nao declara `autoria` — nao da para
saber quem registrou a aceitacao.

## O que esta tarefa nao faz
Nada alem de servir de entrada para o verificador.

## Fontes
- `docs/operacao/README.md`
