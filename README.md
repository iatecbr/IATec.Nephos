# Nephos 5.0

**Português (BR)** · [English](README.en.md) · [Español](README.es.md)

O Nephos é o Design System da IATec. Ele conecta fundações definidas no
Figma, Web Components em Lit, documentação consultável e validação visual e
de comportamento.

> **Em construção.** O que já está disponível para uso — componentes, variantes,
> estados e regras — está no Storybook, gerado a partir do próprio código. Rode
> `npm run storybook` para consultar. Este README não mantém contagem de
> progresso: o avanço por fase é registro interno, não documentação de uso.

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

## Tokens

Os valores auditados no Figma vivem em `src/tokens/source/*.tokens.json`. O CSS
é **gerado** a partir deles e **nunca deve ser editado à mão**.

```bash
npm run build:tokens
```

```bash
npm run test:tokens
```

Detalhes de formato, modos, validações e escopo estão em
[`docs/tokens.md`](docs/tokens.md).

### Consumir os temas

Marca e esquema de cor são **dimensões independentes**. Ponha os dois atributos
no elemento raiz e importe o CSS gerado:

```html
<html data-nph-brand="educacao" data-nph-color-scheme="dark">
```

| Atributo | Valores | Padrão |
|---|---|---|
| `data-nph-brand` | `sistemas`, `gerencial`, `educacao`, `comercial`, `financeiro`, `igrejas`, `rh` | `sistemas` |
| `data-nph-color-scheme` | `light`, `dark` | `light` |

Omitir os dois entrega Sistemas no claro.

O workflow de CI e a publicação ainda não existem — a direção deles está no P19,
em
[`docs/decisoes-tecnicas.md`](docs/decisoes-tecnicas.md).

## Decisões técnicas vigentes

As decisões P01, P02, P03, P17, P19, P20 e P21 estão registradas em
[`docs/decisoes-tecnicas.md`](docs/decisoes-tecnicas.md).

**Status: decisão adotada pela Indiane em 24/08/2026 (P21 em 26/08/2026) —
revisada e aprovada por Elvys em 28/08/2026.** As regras devem ser seguidas no
trabalho atual, salvo orientação posterior de Elvys que as substitua.

| | Assunto | Decisão |
|---|---|---|
| **P01** | Encapsulamento dos componentes | Shadow DOM aberto |
| **P02** | Personalização e exposição de CSS | CSS custom properties como API pública; `::part` para partes internas; classes internas não são API |
| **P03** | Organização do projeto | `src/components/<nome>/` com implementação, CSS, story e teste juntos; `src/tokens/` com `source` e `generated`; `src/styles/`; `src/shared/`; `docs/` |
| **P17** | Formato e consumo de tokens | JSON como formato-fonte versionado; CSS custom properties como formato gerado |
| **P19** | Storybook, testes e publicação | Manter `@storybook/web-components-vite`; build no CI em pull requests, como artefato privado |
| **P20** | Ferramenta de geração e contrato de temas | Style Dictionary v5; `data-nph-brand` e `data-nph-color-scheme` (`light`/`dark`); namespace `com.iatec.nephos` |
| **P21** | Plano técnico do primeiro componente | Contrato do `nph-icon`; TypeScript estrito; stories junto do componente; Vitest em modo browser |

A nota traz o motivo, o escopo, o impacto e o que ficou fora de escopo de cada
uma. Ela é a fonte da regra: em caso de divergência com este README, prevalece
a nota.

O package manager é **npm** e o framework do Storybook é
**`@storybook/web-components-vite`**. Os dois entraram como escolha de
bootstrap e foram consolidados pelo P19.

### O que continua fora de escopo

Continuam fora do repositório: o workflow de CI, a publicação pública e o
deploy. Também ficam fora os 20 primitivos da P46 e, adiados para rodada
futura, os demais primitivos, os estilos de efeito e os estilos de texto —
adiado não significa sem consumidor.

## Fontes de verdade

| Assunto | Fonte |
|---|---|
| Valores de token e decisões visuais | Figma `DS-IA-NEPHOS 5.0` |
| Contrato técnico e regras de uso | `design.md`, na raiz deste repositório |
| Valores de token versionados | `src/tokens/source/*.tokens.json`; ver [`docs/tokens.md`](docs/tokens.md) |
| Decisões técnicas P01, P02, P03, P17, P19, P20 e P21 | [`docs/decisoes-tecnicas.md`](docs/decisoes-tecnicas.md) |
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

## Versões de idioma

Este repositório publica sua documentação de uso em português (BR), inglês e
espanhol. O português é a fonte; veja [`docs/i18n.md`](docs/i18n.md) para a
convenção.

## Licença

Unlicense. Veja `LICENSE`.
