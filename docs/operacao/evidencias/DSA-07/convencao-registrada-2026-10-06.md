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

P64 is in `docs/decisoes-tecnicas.md`, with the scope decided by Indiane on
28-09-2026 and the technical review recorded: Mauro approved the decision on
30-09-2026, in the team chat, and the amendment of 02-10-2026 in PR #49, merged on
05-10-2026 (`183ff01`). `AGENTS.md`, under `Regras obrigatórias` (mandatory rules), carries the rule.

There is no gate command: the proof is reading the three excerpts below, at the
tip `7dd370d` of `v/5.0.0`.

## Reading

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
