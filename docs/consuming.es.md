<!-- i18n: lang=es | source=docs/consuming.md | source-sha256=672267b2149e9680e36fcd031d571c6dc961a1d6d3ff6e758cc26eb7db11b6a8 | status=rascunho -->

# Consumir Nephos

[English](consuming.md) · [Português (BR)](consuming.pt-BR.md) · **Español**

> **Borrador.** Traducción escrita por IA y aún sin revisión humana. Si difiere de la
> fuente en inglés, [`consuming.md`](consuming.md), prevalece el inglés.

Cómo una aplicación instala y usa `@iatec/nephos`, el paquete de los Web Components de
Nephos. La decisión detrás de él es la **P74**, en
[`decisoes-tecnicas.md`](decisoes-tecnicas.md), que existe solo en inglés.

> **Release candidate.** El paquete se publica como `5.0.0-rc.N` bajo la etiqueta npm
> `rc`, nunca bajo `latest`, en un feed privado. Sirve para productos que probarán
> Nephos antes de una versión estable; la API todavía puede cambiar entre release
> candidates.

## Qué es el paquete

Custom elements, escritos en Lit, con el prefijo `nph-`. **No hay wrapper de React,
Vue, Angular ni Blazor**: cada framework usa el elemento directamente. El paquete trae
el JavaScript de cada componente, las declaraciones de TypeScript, un Custom Elements
Manifest (`custom-elements.json`), la hoja de estilos de los tokens y la de la barra de
desplazamiento nativa.

| Importación | Qué entrega |
|---|---|
| `@iatec/nephos/nph-<name>` | El componente, registrado. Una línea basta: el componente trae su propio CSS y los componentes que renderiza. |
| `@iatec/nephos/tokens.css` | Los tokens de diseño, como propiedades personalizadas de CSS. |
| `@iatec/nephos/scrollbar.css` | El color de la barra de desplazamiento nativa. Cárguelo justo después de `tokens.css`. |
| `@iatec/nephos/custom-elements.json` | El manifiesto que leen los editores y las herramientas de documentación. |

Disponibles en `5.0.0-rc.1`: `nph-badge`, `nph-button`, `nph-icon`, `nph-kbd`,
`nph-label`, `nph-separator`, `nph-skeleton`, `nph-spinner`, `nph-togglebutton` y
`nph-tooltip`. Las propiedades, variantes y estados de cada uno están en Storybook
(`npm run storybook`) y en su ficha, `fichas/<name>.md`.

## Instalación

El paquete y sus peers vienen de dos registries, y cada uno exige un token:

- `@iatec/nephos` está en el feed `IATec.Community` de Azure DevOps Artifacts. Pida
  acceso al feed al equipo.
- `@fortawesome/pro-*` es **Font Awesome Pro**. **Todo consumidor, y toda CI que
  instala el paquete, necesita un token npm de Font Awesome Pro.** La licencia queda
  con quien instala.

Ponga las líneas de registry en el `.npmrc` de su **usuario** (`~/.npmrc`) o en el
almacén de secretos de la CI. Nunca versione un token, y nunca versione un `.npmrc` que
tenga uno.

```ini
@iatec:registry=https://sda-iatec.pkgs.visualstudio.com/_packaging/IATec.Community/npm/registry/
//sda-iatec.pkgs.visualstudio.com/_packaging/IATec.Community/npm/registry/:_authToken=<AZURE_ARTIFACTS_TOKEN>

@fortawesome:registry=https://npm.fontawesome.com/
//npm.fontawesome.com/:_authToken=<FONT_AWESOME_PRO_TOKEN>
```

Luego instale la release candidate, con los peers:

```bash
npm install @iatec/nephos@rc lit @fortawesome/pro-light-svg-icons @fortawesome/pro-solid-svg-icons
```

`lit` y los dos paquetes de Font Awesome son **peer dependencies**: su aplicación es
dueña de sus versiones. Los rangos son `lit ^3.3.3` y `@fortawesome/pro-light-svg-icons`
y `pro-solid-svg-icons` `^6.7.2`. Cada release candidate tiene su propia versión
(`rc.1`, `rc.2`, ...): una versión publicada nunca se reemplaza, así que fije la que
probó.

## Tokens, marca y esquema de color

Los componentes leen las propiedades `--nph-*` desde fuera de su Shadow DOM, así que los
tokens deben cargarse una vez, para toda la página:

```js
import '@iatec/nephos/tokens.css';
import '@iatec/nephos/scrollbar.css';
```

Marca y esquema de color son dos atributos independientes en el elemento raíz:

```html
<html data-nph-brand="educacao" data-nph-color-scheme="dark">
```

`data-nph-brand` acepta `sistemas`, `gerencial`, `educacao`, `comercial`, `financeiro`,
`igrejas` o `rh` (por defecto `sistemas`). `data-nph-color-scheme` acepta `light` o
`dark` (por defecto `light`). Omitir ambos da Sistemas en modo claro. Los tokens solo
declaran las familias de fuente: cargue Noto Sans (400, 500, 600) e IBM Plex Mono (400)
en su aplicación.

## Usar un componente

```ts
import '@iatec/nephos/nph-button';
```

```html
<nph-button text="Save" severity="primary"></nph-button>
```

El texto visible es un atributo, no contenido: los componentes no tienen slot.
`import '@iatec/nephos/nph-label'` tampoco pide una segunda línea: su hoja de estilos,
que no puede vivir en un Shadow DOM (P62.1), la adopta en el documento el propio
módulo.

Para usar un componente como tipo:

```ts
import { NphButton } from '@iatec/nephos/nph-button';

const button: NphButton = document.createElement('nph-button');
button.text = 'Save';
```

Toda etiqueta está declarada en `HTMLElementTagNameMap`, así que `createElement` y
`querySelector` quedan tipados. Un componente con evento, como `nph-togglebutton`
(`nph-change`, `detail: { pressed }`), lo declara en `HTMLElementEventMap`.

## Angular

Angular 17 o superior, con el application builder (esbuild). Angular no conoce las
etiquetas `nph-*`, así que el componente que las usa opta por custom elements.

```ts
// src/main.ts: registre los componentes una vez
import '@iatec/nephos/nph-button';
import '@iatec/nephos/nph-togglebutton';
```

```ts
// cualquier componente standalone, o el NgModule que lo declara
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

Cargue los tokens en `angular.json`, en `projects.<app>.architect.build.options`:

```json
"styles": [
  "node_modules/@iatec/nephos/dist/tokens.css",
  "node_modules/@iatec/nephos/dist/scrollbar.css",
  "src/styles.css"
]
```

Defina una propiedad desde la plantilla con `[prop]`: `<nph-button [text]="label">`
define la propiedad, `text="..."` define el atributo. Ambos funcionan.

## Vue 3

Avise al compilador de plantillas que `nph-*` son custom elements, en `vite.config.ts`:

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

React 19 soporta custom elements: use la etiqueta directamente, y una propiedad que sea
string, número o booleano se pasa al elemento. Importar el componente una vez, por
ejemplo en `src/main.tsx`, lo registra.

```tsx
import '@iatec/nephos/tokens.css';
import '@iatec/nephos/nph-button';
import '@iatec/nephos/nph-togglebutton';

export function Example() {
  return <nph-button text="Save" severity="primary" />;
}
```

TypeScript no conoce la etiqueta. Declárela una vez, con la clase del componente como
tipo de sus props:

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

Para un evento, agregue un listener desde un `ref`, que funciona en toda versión de
React:

```tsx
const ref = useRef<HTMLElement>(null);
useEffect(() => {
  const element = ref.current;
  const onChange = (event: Event) => console.log((event as CustomEvent<{ pressed: boolean }>).detail.pressed);
  element?.addEventListener('nph-change', onChange);
  return () => element?.removeEventListener('nph-change', onChange);
}, []);
```

**React 18 y anteriores** pasan toda propiedad a un custom element como string de
atributo y nunca como propiedad, y no escuchan eventos personalizados por JSX. Un
booleano como `disabled` o `pressed` necesita un `ref` y una asignación
(`element.pressed = true`), y un evento necesita el listener de arriba. Prefiera
React 19.

## Blazor

Blazor sirve archivos estáticos y no tiene resolvedor de módulos, así que los
componentes se empaquetan antes en un solo archivo. Un navegador no puede cargar
`@iatec/nephos` directo desde `node_modules` con un import map: `nph-icon` importa los
íconos de Font Awesome uno a uno, y Font Awesome publica cada uno como archivo
CommonJS. Un paso de bundler los convierte en un solo módulo ES, una vez, en la
compilación.

1. En una carpeta junto al proyecto (por ejemplo `Frontend/`), instale el paquete y los
   peers como arriba, más `esbuild`, y escriba la entrada con los componentes que usa
   la aplicación:

   ```js
   // Frontend/nephos-entry.js
   import '@iatec/nephos/nph-button';
   import '@iatec/nephos/nph-label';
   import '@iatec/nephos/nph-togglebutton';
   ```

2. Empaquételo en `wwwroot` y copie los tokens al lado:

   ```bash
   npx esbuild Frontend/nephos-entry.js --bundle --format=esm --minify --outfile=wwwroot/js/nephos.js
   cp Frontend/node_modules/@iatec/nephos/dist/tokens.css wwwroot/css/nephos-tokens.css
   cp Frontend/node_modules/@iatec/nephos/dist/scrollbar.css wwwroot/css/nephos-scrollbar.css
   ```

   Ejecute ambos desde un target de MSBuild, o desde su CI, antes de `dotnet publish`.
   El bundle lleva `lit` y los íconos: no necesita import map.

3. Cárguelos una vez, en `App.razor` (o `wwwroot/index.html` en WebAssembly):

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

4. Use las etiquetas en un archivo `.razor`. Un atributo de texto funciona tal cual:

   ```razor
   <nph-button text="Save" severity="primary"></nph-button>
   ```

   Blazor no hace binding de la propiedad ni del evento de un custom element por sí
   solo. Para una propiedad, o para un evento como `nph-change`, use JavaScript interop
   con un `ElementReference`:

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
   // wwwroot/js/nephos-interop.js (un script clásico, cargado antes del script de Blazor)
   window.nephos = {
     listen: (element, type, handler) =>
       element.addEventListener(type, (e) => handler.invokeMethodAsync('OnPressedChanged', e.detail.pressed)),
   };
   ```

## Verificar el paquete

Desde un clon del repositorio, `npm run build:lib` escribe `dist/`,
`npm run test:package` comprueba que cada línea de importación de arriba resuelve, y
`npm run pack:check` hace el lint del tarball empaquetado. Son la prueba de que las
rutas de importación de esta guía son reales.
