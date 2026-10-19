<!-- i18n: lang=pt-BR | source=docs/consuming.md | source-sha256=672267b2149e9680e36fcd031d571c6dc961a1d6d3ff6e758cc26eb7db11b6a8 | status=rascunho -->

# Consumindo o Nephos

[English](consuming.md) · **Português (BR)** · [Español](consuming.es.md)

> **Rascunho.** Tradução escrita por IA e ainda sem revisão humana. Se divergir da
> fonte em inglês, [`consuming.md`](consuming.md), prevalece o inglês.

Como uma aplicação instala e usa o `@iatec/nephos`, o pacote dos Web Components do
Nephos. A decisão por trás dele é a **P74**, em
[`decisoes-tecnicas.md`](decisoes-tecnicas.md), que existe apenas em inglês.

> **Release candidate.** O pacote é publicado como `5.0.0-rc.N` sob a tag npm `rc`,
> nunca sob `latest`, em um feed privado. Serve para produtos que vão experimentar o
> Nephos antes de uma versão estável; a API ainda pode mudar entre release candidates.

## O que o pacote é

Custom elements, escritos em Lit, com o prefixo `nph-`. **Não há wrapper de React,
Vue, Angular ou Blazor**: todo framework usa o elemento diretamente. O pacote traz o
JavaScript de cada componente, as declarações TypeScript, um Custom Elements Manifest
(`custom-elements.json`), a folha de estilo dos tokens e a da barra de rolagem nativa.

| Importação | O que entrega |
|---|---|
| `@iatec/nephos/nph-<name>` | O componente, registrado. Uma linha basta: o componente traz o próprio CSS e os componentes que ele renderiza. |
| `@iatec/nephos/tokens.css` | Os tokens de design, como propriedades personalizadas de CSS. |
| `@iatec/nephos/scrollbar.css` | A cor da barra de rolagem nativa. Carregue logo depois de `tokens.css`. |
| `@iatec/nephos/custom-elements.json` | O manifesto que editores e ferramentas de documentação leem. |

Disponíveis na `5.0.0-rc.1`: `nph-badge`, `nph-button`, `nph-icon`, `nph-kbd`,
`nph-label`, `nph-separator`, `nph-skeleton`, `nph-spinner`, `nph-togglebutton` e
`nph-tooltip`. As propriedades, variantes e estados de cada um estão no Storybook
(`npm run storybook`) e na sua ficha, `fichas/<name>.md`.

## Instalação

O pacote e seus peers vêm de dois registries, e cada um exige um token:

- `@iatec/nephos` está no feed `IATec.Community` do Azure DevOps Artifacts. Peça
  acesso ao feed ao time.
- `@fortawesome/pro-*` é o **Font Awesome Pro**. **Todo consumidor, e toda CI que
  instala o pacote, precisa de um token npm do Font Awesome Pro.** A licença fica com
  quem instala.

Coloque as linhas de registry no `.npmrc` do seu **usuário** (`~/.npmrc`) ou no cofre
de segredos da CI. Nunca versione um token, e nunca versione um `.npmrc` que tenha um.

```ini
@iatec:registry=https://sda-iatec.pkgs.visualstudio.com/_packaging/IATec.Community/npm/registry/
//sda-iatec.pkgs.visualstudio.com/_packaging/IATec.Community/npm/registry/:_authToken=<AZURE_ARTIFACTS_TOKEN>

@fortawesome:registry=https://npm.fontawesome.com/
//npm.fontawesome.com/:_authToken=<FONT_AWESOME_PRO_TOKEN>
```

Depois instale a release candidate, com os peers:

```bash
npm install @iatec/nephos@rc lit @fortawesome/pro-light-svg-icons @fortawesome/pro-solid-svg-icons
```

`lit` e os dois pacotes do Font Awesome são **peer dependencies**: a sua aplicação é
dona das versões deles. Os intervalos são `lit ^3.3.3` e
`@fortawesome/pro-light-svg-icons` e `pro-solid-svg-icons` `^6.7.2`. Cada release
candidate tem a própria versão (`rc.1`, `rc.2`, ...): uma versão publicada nunca é
substituída, então fixe a que você testou.

## Tokens, marca e esquema de cor

Os componentes leem as propriedades `--nph-*` de fora do Shadow DOM, então os tokens
precisam ser carregados uma vez, para a página inteira:

```js
import '@iatec/nephos/tokens.css';
import '@iatec/nephos/scrollbar.css';
```

Marca e esquema de cor são dois atributos independentes no elemento raiz:

```html
<html data-nph-brand="educacao" data-nph-color-scheme="dark">
```

`data-nph-brand` aceita `sistemas`, `gerencial`, `educacao`, `comercial`,
`financeiro`, `igrejas` ou `rh` (padrão `sistemas`). `data-nph-color-scheme` aceita
`light` ou `dark` (padrão `light`). Omitir os dois dá Sistemas no modo claro. Os
tokens declaram apenas as famílias de fonte: carregue Noto Sans (400, 500, 600) e IBM
Plex Mono (400) na sua aplicação.

## Usando um componente

```ts
import '@iatec/nephos/nph-button';
```

```html
<nph-button text="Save" severity="primary"></nph-button>
```

O texto visível é um atributo, não conteúdo: os componentes não têm slot.
`import '@iatec/nephos/nph-label'` também não pede uma segunda linha: a folha de
estilo dele, que não pode viver em um Shadow DOM (P62.1), é adotada no documento pelo
próprio módulo.

Para usar um componente como tipo:

```ts
import { NphButton } from '@iatec/nephos/nph-button';

const button: NphButton = document.createElement('nph-button');
button.text = 'Save';
```

Toda tag está declarada em `HTMLElementTagNameMap`, então `createElement` e
`querySelector` são tipados. Um componente com evento, como o `nph-togglebutton`
(`nph-change`, `detail: { pressed }`), declara-o em `HTMLElementEventMap`.

## Angular

Angular 17 ou superior, com o application builder (esbuild). O Angular não conhece as
tags `nph-*`, então o componente que as usa opta por custom elements.

```ts
// src/main.ts: registre os componentes uma vez
import '@iatec/nephos/nph-button';
import '@iatec/nephos/nph-togglebutton';
```

```ts
// qualquer componente standalone, ou o NgModule que o declara
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';

@Component({
  selector: 'app-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <nph-button text="Save" severity="primary"></nph-button>
    <nph-togglebutton text="Bold" (nph-change)="onChange($event)"></nph-togglebutton>
  `,
})
export class ExampleComponent {
  onChange(event: Event): void {
    console.log((event as CustomEvent<{ pressed: boolean }>).detail.pressed);
  }
}
```

Carregue os tokens no `angular.json`, em `projects.<app>.architect.build.options`:

```json
"styles": [
  "node_modules/@iatec/nephos/dist/tokens.css",
  "node_modules/@iatec/nephos/dist/scrollbar.css",
  "src/styles.css"
]
```

Defina uma propriedade no template com `[prop]`: `<nph-button [text]="label">`
define a propriedade, `text="..."` define o atributo. Os dois funcionam.

## Vue 3

Avise o compilador de template que `nph-*` são custom elements, no `vite.config.ts`:

```ts
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    vue({
      template: { compilerOptions: { isCustomElement: (tag) => tag.startsWith('nph-') } },
    }),
  ],
});
```

```ts
// src/main.ts
import '@iatec/nephos/tokens.css';
import '@iatec/nephos/nph-button';
import '@iatec/nephos/nph-togglebutton';
```

```vue
<template>
  <nph-button text="Save" severity="primary" />
  <nph-togglebutton text="Bold" :pressed="bold" @nph-change="bold = $event.detail.pressed" />
</template>
```

## React

O React 19 suporta custom elements: use a tag diretamente, e uma propriedade que seja
string, número ou booleano é passada ao elemento. Importar o componente uma vez, por
exemplo em `src/main.tsx`, registra-o.

```tsx
import '@iatec/nephos/tokens.css';
import '@iatec/nephos/nph-button';
import '@iatec/nephos/nph-togglebutton';

export function Example() {
  return <nph-button text="Save" severity="primary" />;
}
```

O TypeScript não conhece a tag. Declare-a uma vez, com a classe do componente como
tipo das props:

```ts
// src/nephos.d.ts
import type { DetailedHTMLProps, HTMLAttributes } from 'react';
import type { NphButton } from '@iatec/nephos/nph-button';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'nph-button': DetailedHTMLProps<HTMLAttributes<NphButton>, NphButton> & Partial<Pick<NphButton, 'text' | 'severity' | 'emphasis' | 'size'>>;
    }
  }
}
```

Para um evento, adicione um listener a partir de um `ref`, o que funciona em toda
versão do React:

```tsx
const ref = useRef<HTMLElement>(null);
useEffect(() => {
  const element = ref.current;
  const onChange = (event: Event) => console.log((event as CustomEvent<{ pressed: boolean }>).detail.pressed);
  element?.addEventListener('nph-change', onChange);
  return () => element?.removeEventListener('nph-change', onChange);
}, []);
```

**React 18 e anteriores** passam toda propriedade a um custom element como string de
atributo e nunca como propriedade, e não escutam eventos personalizados pelo JSX. Um
booleano como `disabled` ou `pressed` precisa de um `ref` e de uma atribuição
(`element.pressed = true`), e um evento precisa do listener acima. Prefira o React 19.

## Blazor

O Blazor serve arquivos estáticos e não tem resolvedor de módulos, então os componentes
são empacotados em um único arquivo antes. Um navegador não consegue carregar o
`@iatec/nephos` direto de `node_modules` por um import map: o `nph-icon` importa os
ícones do Font Awesome um a um, e o Font Awesome publica cada um deles como arquivo
CommonJS. Uma etapa de bundler os transforma em um único módulo ES, uma vez, na
compilação.

1. Em uma pasta ao lado do projeto (por exemplo `Frontend/`), instale o pacote e os
   peers como acima, mais o `esbuild`, e escreva a entrada com os componentes que a
   aplicação usa:

   ```js
   // Frontend/nephos-entry.js
   import '@iatec/nephos/nph-button';
   import '@iatec/nephos/nph-label';
   import '@iatec/nephos/nph-togglebutton';
   ```

2. Empacote em `wwwroot` e copie os tokens ao lado:

   ```bash
   npx esbuild Frontend/nephos-entry.js --bundle --format=esm --minify --outfile=wwwroot/js/nephos.js
   cp Frontend/node_modules/@iatec/nephos/dist/tokens.css wwwroot/css/nephos-tokens.css
   cp Frontend/node_modules/@iatec/nephos/dist/scrollbar.css wwwroot/css/nephos-scrollbar.css
   ```

   Rode os dois a partir de um target do MSBuild, ou da sua CI, antes do `dotnet
   publish`. O bundle carrega o `lit` e os ícones: não precisa de import map.

3. Carregue-os uma vez, em `App.razor` (ou `wwwroot/index.html` no WebAssembly):

   ```html
   <html lang="en" data-nph-brand="sistemas" data-nph-color-scheme="light">
   <head>
     <link rel="stylesheet" href="css/nephos-tokens.css" />
     <link rel="stylesheet" href="css/nephos-scrollbar.css" />
   </head>
   <body>
     ...
     <script type="module" src="js/nephos.js"></script>
     <script src="js/nephos-interop.js"></script>
   </body>
   ```

4. Use as tags em um arquivo `.razor`. Um atributo de texto funciona como está:

   ```razor
   <nph-button text="Save" severity="primary"></nph-button>
   ```

   O Blazor não faz binding de propriedade ou evento de um custom element sozinho.
   Para uma propriedade, ou para um evento como o `nph-change`, use JavaScript interop
   com um `ElementReference`:

   ```razor
   @inject IJSRuntime Js

   <nph-togglebutton @ref="toggle" text="Bold"></nph-togglebutton>

   @code {
       private ElementReference toggle;

       protected override async Task OnAfterRenderAsync(bool firstRender)
       {
           if (firstRender)
           {
               await Js.InvokeVoidAsync("nephos.listen", toggle, "nph-change",
                   DotNetObjectReference.Create(this));
           }
       }

       [JSInvokable]
       public void OnPressedChanged(bool pressed) { /* ... */ }
   }
   ```

   ```js
   // wwwroot/js/nephos-interop.js (um script clássico, carregado antes do script do Blazor)
   window.nephos = {
     listen: (element, type, handler) =>
       element.addEventListener(type, (e) => handler.invokeMethodAsync('OnPressedChanged', e.detail.pressed)),
   };
   ```

## Verificando o pacote

A partir de um clone do repositório, `npm run build:lib` escreve o `dist/`,
`npm run test:package` confere que cada linha de importação acima resolve, e
`npm run pack:check` faz o lint do tarball empacotado. Eles são a prova de que os
caminhos de importação deste guia são reais.
