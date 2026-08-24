# Nephos 5.0

O Nephos é o Design System da IATec. Ele conecta fundações definidas no
Figma, Web Components em Lit, documentação consultável e validação visual e
de comportamento.

> **Estado atual: shell inicial.** Nenhum componente foi implementado e nenhum
> token do Figma foi convertido para código. O que existe aqui é o Storybook
> rodando com uma única página, "Nephos — Em construção", para confirmar que o
> ambiente funciona.

## O que o Nephos entrega

- Web Components com prefixo `nph-`, escritos em Lit.
- Tokens e regras de uso definidos no contrato `design.md`.
- Documentação de componentes, blocos, layouts e templates.
- Stories e validação no Storybook.
- Exemplos de consumo para Vue, Angular e Blazor.

O Nephos não depende de PrimeNG, shadcn/ui, Radix, Tailwind ou outro
framework de componentes. O UI kit Obra é uma referência visual e estrutural,
não uma dependência de código.

## Como rodar o Storybook

Requer Node.js e npm. Validado com Node 24.18.0 e npm 11.16.0.

```bash
npm install
```

```bash
npm run storybook
```

O Storybook sobe em `http://localhost:6006`.

Para gerar a versão estática em `storybook-static/`:

```bash
npm run build-storybook
```

Não há outros scripts. Testes, pipeline e publicação ainda não foram
definidos — veja as pendências abaixo.

## Decisões técnicas a confirmar

Estas duas escolhas foram feitas apenas para conseguir criar e executar a
página "Nephos — Em construção". São **provisórias** e não constituem
arquitetura definitiva.

| Item | Escolha provisória | Responsável pela confirmação |
|---|---|---|
| Package manager | npm | Elvys |
| Framework do Storybook | `@storybook/web-components-vite` | Elvys |

Motivo: o repositório estava vazio, sem package manager, lockfile, scripts ou
framework preexistentes para seguir, e o projeto usa Web Components — não
React.

Não derive dessas escolhas estrutura de diretórios, formato de distribuição de
tokens, estratégia de teste ou fluxo de publicação.

## Pendências antes do primeiro componente

| Pendência | Assunto | Estado |
|---|---|---|
| **P01** | Shadow DOM: aberto, fechado ou sem shadow | **pendente** |
| **P02** | Como o CSS fica exposto: `::part`, custom properties ou classe global | **pendente** |
| **P03** | Diretórios de trabalho na branch `v/3.0.0` | **pendente** |
| **P17** | Formato de saída dos tokens: CSS custom properties, JSON ou os dois | **pendente** |
| **P19** | Detalhes técnicos de Storybook, testes e publicação | **pendente** |

Todas dependem de confirmação de Elvys. Enquanto não forem confirmadas, **não**
faça nada disto:

- implementar tokens no código;
- criar componentes;
- decidir a estrutura definitiva de diretórios;
- configurar testes, publicação ou pipeline como solução final;
- publicar o Storybook.

Uma decisão delegada não é uma decisão fechada. Só encerre uma pendência com
decisão ou evidência verificável, data, responsável e localização.

## Fontes de verdade

| Assunto | Fonte |
|---|---|
| Valores de token e decisões visuais | Figma `DS-IA-NEPHOS 5.0` |
| Contrato técnico | `design.md`, na raiz deste repositório |
| Governança, precedência e preflight | `GOVERNANCA.md` |
| Instruções para agentes | `AGENTS.md` e `CLAUDE.md` |
| Implementação entregue | Branch, commit, PR e Storybook deste repositório |
| Ficha e regra de escolha de uma peça | `fichas/<nome>.md`, ainda não criadas |

Em caso de lacuna ou conflito, não invente uma decisão: pare e solicite
confirmação.

## Fluxo por componente

1. Clonar no Figma `DS-IA-NEPHOS 5.0` o componente estruturalmente equivalente
   do UI kit Obra.
2. Configurar a peça somente com tokens Nephos e aprová-la visualmente no
   Figma.
3. Criar ou completar sua ficha, incluindo variantes, estados, acessibilidade,
   relações e anti-padrões.
4. Implementar o Web Component em Lit no repositório.
5. Criar stories para variantes e estados e validar comportamento, teclado,
   foco e acessibilidade.

Nenhum componente pode ser implementado no repositório antes de sua aprovação
no Figma.

## Primeiro recorte P0

1. `nph-button`
2. `nph-label`
3. `nph-input`
4. `nph-field`
5. `nph-checkbox`

Os demais componentes não entram no P0 por padrão. A lista completa da v1 ainda
não está fechada.

## Taxonomia

| Nível | Descrição |
|---|---|
| Componente | Peça reutilizável, pública e isolada. |
| Bloco | Composição reutilizável de componentes para uma função de interface. |
| Layout | Estrutura espacial recorrente de uma tela. |
| Template | Estrutura de um fluxo ou tipo de tela que combina layouts e blocos. |

Blocos, layouts e templates só podem ser documentados depois de extraídos de
uma tela real ou mock aprovado.

## Licença

Unlicense. Veja `LICENSE`.
