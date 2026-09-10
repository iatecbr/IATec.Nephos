```json
{
  "id": "DSA-58",
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
      "evidencia": "scripts/fixtures/operacao/invalidos/evidencia-figma-fora-do-diretorio/prova-fora/DSA-58/documentacao-figma-aceita-2026-09-10.md",
      "resultado": "passou",
      "verificado_em": "2026-09-10",
      "verificado_por": "indiane"
    }
  ],
  "bloqueios": [],
  "decisoes_pendentes": [],
  "evidencias": [
    "scripts/fixtures/operacao/invalidos/evidencia-figma-fora-do-diretorio/prova-fora/DSA-58/documentacao-figma-aceita-2026-09-10.md"
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

# DSA-58 — evidencia documental fora de evidencias/DSA-58/

## Objetivo
Exemplo de validacao do verificador operacional.

## Como se prova
Rodando `node scripts/verificar-operacao.mjs --exemplos`, que valida esta arvore.
A evidencia existe, casa a tarefa e declara a procedencia inteira — classificacao,
URL do Figma, data, autoria e a decisao convertida com frame e COMPONENT_SET. O
unico defeito e o lugar: ela esta em `prova-fora/DSA-58/`, e nao em
`evidencias/DSA-58/`. Prova que muda de endereco deixa de ser encontravel pela
convencao, e a V31 cobra o endereco junto com o conteudo.

## O que esta tarefa nao faz
Nada alem de servir de entrada para o verificador.

## Fontes
- `docs/operacao/README.md`
