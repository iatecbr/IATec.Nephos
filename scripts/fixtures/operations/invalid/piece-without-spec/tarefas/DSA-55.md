```json
{
  "id": "DSA-55",
  "objetivo": "Exemplo de validacao do verificador operacional.",
  "fase": "F4",
  "ordem_aprovada": 10,
  "responsavel": "claude-codigo",
  "estado": "em-revisao",
  "peca": "nph-inexistente",
  "dependencias": [],
  "gates": [
    {
      "id": "documentacao-figma-aceita",
      "descricao": "A documentacao do componente no Figma foi aceita por Indiane.",
      "comando": null,
      "evidencia": "scripts/fixtures/operations/invalid/piece-without-spec/evidencias/DSA-55/documentacao-figma-aceita-2026-09-10.md",
      "resultado": "passou",
      "verificado_em": "2026-09-10",
      "verificado_por": "indiane"
    }
  ],
  "bloqueios": [],
  "decisoes_pendentes": [],
  "evidencias": [
    "scripts/fixtures/operations/invalid/piece-without-spec/evidencias/DSA-55/documentacao-figma-aceita-2026-09-10.md"
  ],
  "referencias_de_decisao": [],
  "origem_externa": null,
  "revisao_git": {
    "branch": "docs/exemplo-peca-sem-ficha",
    "commit": null,
    "pr": "999"
  },
  "contexto": null,
  "atualizado_em": "2026-09-10"
}
```

# DSA-55 — em revisao com peca e sem ficha

## Objetivo
Exemplo de validacao do verificador operacional.

## Como se prova
Rodando `node scripts/verificar-operacao.mjs --exemplos`, que valida esta arvore.
A documentacao Figma esta aceita e a tarefa entrou em revisao, entao a ficha
canonica passa a ser exigida — e `fichas/nph-inexistente.md` nao existe.

## O que esta tarefa nao faz
Nada alem de servir de entrada para o verificador.

## Fontes
- `docs/operacao/README.md`
