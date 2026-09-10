# Como contribuir

## Branch

Durante a v5, crie cada branch de tarefa a partir de `origin/v/5.0.0`, usando
um dos prefixos abaixo seguido de uma descrição curta em kebab-case:

- `feat/` para funcionalidade ou componente;
- `fix/` para correção;
- `docs/` para documentação;
- `chore/` para manutenção sem mudança de produto.

Exemplo: `docs/pe01-pe03-contrib-p625`.

## Commit e pull request

Use `tipo(escopo): resumo curto` quando houver escopo; omita o parêntese quando ele não
ajudar a entender a mudança. Os tipos seguem os prefixos de branch: `feat`, `fix`,
`docs` e `chore`.

Todo pull request da v5 tem `v/5.0.0` como branch de destino. Nunca faça a
entrega diretamente nessa branch.

O título do pull request repete o título do commit principal. A descrição informa:

1. objetivo e limite do lote;
2. arquivos alterados;
3. comandos executados e resultado;
4. evidência necessária para revisão;
5. bloqueio restante, se houver.

## Rito

Abra PRs pequenos, com uma mudança coerente por vez. Faça commit quando chegar a um
estado que funciona, não no fim do dia. Mudança visual inclui comparação verificável;
mudança de código inclui os testes aplicáveis.

Quem executa prepara a branch, os commits e o pull request. Elvys ou Mauro revisam e
fazem o merge; a revisão não transfere a eles a redação do conteúdo nem decisões de
produto.
