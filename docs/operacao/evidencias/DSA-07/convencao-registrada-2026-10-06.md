```json
{
  "tarefa": "DSA-07",
  "gate": "convencao-registrada",
  "data": "2026-10-06",
  "responsavel": "claude-codigo",
  "comando": null,
  "codigo_de_saida": null,
  "sha": "7dd370d403adc49aaad7b391e34cc5aa50730784",
  "origem_externa": null
}
```

# DSA-07 — `convencao-registrada`

A P64 está em `docs/decisoes-tecnicas.md`, com o escopo decidido por Indiane em
28-09-2026 e a revisão técnica registrada: Mauro aprovou a decisão em
30-09-2026, no chat da equipe, e a emenda de 02-10-2026 no PR #49, com merge em
05-10-2026 (`183ff01`). O `AGENTS.md`, em "Regras obrigatórias", traz a regra.

Não há comando de gate: a prova é a leitura dos três trechos abaixo, na ponta
`7dd370d` da `v/5.0.0`.

## Leitura

```text
$ grep -n "^## P64" docs/decisoes-tecnicas.md
580:## P64 — Idioma do código
$ grep -n "| \*\*P64\*\*" docs/decisoes-tecnicas.md
33:| **P64** | Idioma do código | 28/09/2026 | Médio. Vale para todo código novo; a migração do que existe só troca nomes | Adotada por Indiane em 28/09/2026. **Revisada e aprovada por Mauro em 30/09/2026, no chat da equipe.** Emenda de 02/10/2026 aprovada por Mauro no PR #49, com merge em 05/10/2026. |
$ sed -n 111,115p AGENTS.md
- Escreva os nomes do código e os nomes de arquivo técnico em inglês; comentário
  e mensagem para quem mantém o repositório ficam em PT-BR. Chave de dados,
  bandeira da linha de comando, nome de script, arquivo citado em comando gravado
  em `docs/operacao/` e nome público não mudam (P64, revisada por Mauro em
  30/09/2026; emenda de 02/10/2026 aprovada por Mauro no PR #49). A prova é
```
