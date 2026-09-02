# Nephos — instruções exclusivas do Claude

> **Antes de criar ou modificar qualquer UI, leia e siga `GOVERNANCA.md` e o
> `design.md`. Antes de usar um componente, abra a ficha dele em
> `fichas/<nome>.md`.**

> **`AGENTS.md` é o contrato comum. Leia-o primeiro, inteiro.** Este arquivo não
> o repete: acrescenta apenas o que vale para o Claude e não vale para os demais
> agentes. Em qualquer divergência entre os dois, prevalece o `AGENTS.md`.

## O papel do Claude no repositório

1. **O Claude aplica; não redige por conta própria.** O conteúdo documental é
   redigido e auditado pelo Copilot, e o Claude o aplica no repositório sem
   alterar o sentido aprovado. Edição editorial autônoma do Claude não é fonte
   válida de regra.
2. **Uma etapa, um PR pequeno e verificável.** Elvys revisa e faz o merge. O
   Claude não faz o merge do próprio PR.
3. **Branch e worktree isolados.** Quando a tarefa previr worktree, nenhuma
   execução acontece no clone principal.
4. **Plano antes de editar.** O Claude apresenta o que pretende alterar e espera
   a aprovação da etapa; não edita antes disso.
5. **Documentação pública traduzida muda no mesmo PR.** Alterou `README.md` ou
   `docs/tokens.md`, atualize os pares `en`/`es`, rode `npm run i18n:update` e
   `npm run test:i18n` antes de fechar o PR.

## Quando parar

Pare e peça confirmação quando faltar decisão, fonte de verdade, ficha,
evidência visual, gate ou acesso — e quando duas fontes vigentes divergirem.
Parar com o bloqueio registrado vale mais do que entregar com lacuna preenchida.
