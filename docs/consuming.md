# Consuming Nephos

**English** · [Português (BR)](consuming.pt-BR.md) · [Español](consuming.es.md)

How an application installs and uses `@iatec/nephos`, the package of the Nephos
Web Components. The decision behind it is **P74** in
[`decisoes-tecnicas.md`](decisoes-tecnicas.md), which exists in English only.

> **Release candidate.** The package is published as `5.0.0-rc.N` under the npm
> tag `rc`, never under `latest`, to a private feed. It is for products that
> will try Nephos before a stable release; the API can still change between
> release candidates.

## What the package is

Custom elements, written in Lit, with the `nph-` prefix. There is **no React,
Vue, Angular or Blazor wrapper**: every framework uses the element directly. The
package ships the JavaScript of each component, TypeScript declarations, a
Custom Elements Manifest (`custom-elements.json`), the token stylesheet and the
native scrollbar stylesheet.

| Import | What it gives |
|---|---|
| `@iatec/nephos/nph-<name>` | The component, registered. One line is enough: the component brings its own CSS, and the components it renders. |
| `@iatec/nephos/tokens.css` | The design tokens, as CSS custom properties. |
| `@iatec/nephos/scrollbar.css` | The colour of the native scrollbar. Load it right after `tokens.css`. |
| `@iatec/nephos/custom-elements.json` | The manifest that editors and documentation tools read. |

Available in `5.0.0-rc.1`: `nph-badge`, `nph-button`, `nph-icon`, `nph-kbd`,
`nph-label`, `nph-separator`, `nph-skeleton`, `nph-spinner`, `nph-togglebutton`
and `nph-tooltip`. The properties, variants and states of each one are in
Storybook (`npm run storybook`) and in its sheet, `fichas/<name>.md`.

## Install

The package and its peers come from two registries, and each needs a token:

- `@iatec/nephos` is in the Azure DevOps Artifacts feed `IATec.Community`.
  Ask the team for access to the feed.
- `@fortawesome/pro-*` is **Font Awesome Pro**. **Every consumer, and every CI
  that installs the package, needs a Font Awesome Pro npm token.** The license
  stays with whoever installs it.

Put the registry lines in the `.npmrc` of your **user** (`~/.npmrc`), or in your
CI secret store. Never commit a token, and never commit an `.npmrc` that has one.

```ini
@iatec:registry=https://sda-iatec.pkgs.visualstudio.com/_packaging/IATec.Community/npm/registry/
//sda-iatec.pkgs.visualstudio.com/_packaging/IATec.Community/npm/registry/:_authToken=<AZURE_ARTIFACTS_TOKEN>

@fortawesome:registry=https://npm.fontawesome.com/
//npm.fontawesome.com/:_authToken=<FONT_AWESOME_PRO_TOKEN>
```

Then install the release candidate, with the peers:

```bash
npm install @iatec/nephos@rc lit @fortawesome/pro-light-svg-icons @fortawesome/pro-solid-svg-icons
```

`lit` and the two Font Awesome packages are **peer dependencies**: your
application owns their versions. The ranges are `lit ^3.3.3` and
`@fortawesome/pro-light-svg-icons` and `pro-solid-svg-icons` `^6.7.2`. Each
release candidate has its own version (`rc.1`, `rc.2`, ...): a published version
is never replaced, so pin the one you tested.

## Tokens, brand and colour scheme

Components read `--nph-*` custom properties from outside their Shadow DOM, so the
tokens have to be loaded once, for the whole page:

```js
import '@iatec/nephos/tokens.css';
import '@iatec/nephos/scrollbar.css';
```

Brand and colour scheme are two independent attributes on the root element:

```html
<html data-nph-brand="educacao" data-nph-color-scheme="dark">
```

`data-nph-brand` takes `sistemas`, `gerencial`, `educacao`, `comercial`,
`financeiro`, `igrejas` or `rh` (default `sistemas`). `data-nph-color-scheme` takes
`light` or `dark` (default `light`). Omitting both gives Sistemas in light mode.
The tokens declare the font families only: load Noto Sans (400, 500, 600) and IBM
Plex Mono (400) in your application.

## Using a component

```ts
import '@iatec/nephos/nph-button';
```

```html
<nph-button text="Save" severity="primary"></nph-button>
```

The visible text is an attribute, not content: the components have no slot.
`import '@iatec/nephos/nph-label'` needs no second line either: its stylesheet,
which cannot live in a Shadow DOM (P62.1), is adopted on the document by the
module itself.

To use a component as a type:

```ts
import { NphButton } from '@iatec/nephos/nph-button';

const button: NphButton = document.createElement('nph-button');
button.text = 'Save';
```

Every tag is declared in `HTMLElementTagNameMap`, so `createElement` and
`querySelector` are typed. A component with an event, such as `nph-togglebutton`
(`nph-change`, `detail: { pressed }`), declares it in `HTMLElementEventMap`.

## Angular

Angular 17 or later, with the application builder (esbuild). Angular does not
know the `nph-*` tags, so the component that uses them opts in to custom elements.

```ts
// src/main.ts: register the components once
import '@iatec/nephos/nph-button';
import '@iatec/nephos/nph-togglebutton';
```

```ts
// any standalone component, or the NgModule that declares it
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

Load the tokens in `angular.json`, under `projects.<app>.architect.build.options`:

```json
"styles": [
  "node_modules/@iatec/nephos/dist/tokens.css",
  "node_modules/@iatec/nephos/dist/scrollbar.css",
  "src/styles.css"
]
```

Set a property from the template with `[prop]`: `<nph-button [text]="label">`
sets the property, `text="..."` sets the attribute. Both work.

## Vue 3

Tell the template compiler that `nph-*` are custom elements, in `vite.config.ts`:

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

React 19 supports custom elements: use the tag directly, and a property that is a
string, number or boolean is passed to the element. Importing the component once,
for example in `src/main.tsx`, registers it.

```tsx
import '@iatec/nephos/tokens.css';
import '@iatec/nephos/nph-button';
import '@iatec/nephos/nph-togglebutton';

export function Example() {
  return <nph-button text="Save" severity="primary" />;
}
```

TypeScript does not know the tag. Declare it once, with the class of the
component as the type of its props:

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

For an event, add a listener from a `ref`, which works in every React version:

```tsx
const ref = useRef<HTMLElement>(null);
useEffect(() => {
  const element = ref.current;
  const onChange = (event: Event) => console.log((event as CustomEvent<{ pressed: boolean }>).detail.pressed);
  element?.addEventListener('nph-change', onChange);
  return () => element?.removeEventListener('nph-change', onChange);
}, []);
```

**React 18 and earlier** pass every property to a custom element as an attribute
string and never as a property, and do not listen to custom events through JSX. A
boolean such as `disabled` or `pressed` needs a `ref` and an assignment
(`element.pressed = true`), and an event needs the listener above. Prefer
React 19.

## Blazor

Blazor serves static files and has no module resolver, so the components are
bundled into one file first. A browser cannot load `@iatec/nephos` straight from
`node_modules` through an import map: `nph-icon` imports the Font Awesome icons
one by one, and Font Awesome publishes each of them as a CommonJS file. A bundler
step turns them into one ES module, once, at build time.

1. In a folder next to the project (for example `Frontend/`), install the package
   and the peers as above, plus `esbuild`, and write the entry with the components
   the application uses:

   ```js
   // Frontend/nephos-entry.js
   import '@iatec/nephos/nph-button';
   import '@iatec/nephos/nph-label';
   import '@iatec/nephos/nph-togglebutton';
   ```

2. Bundle it into `wwwroot`, and copy the tokens beside it:

   ```bash
   npx esbuild Frontend/nephos-entry.js --bundle --format=esm --minify --outfile=wwwroot/js/nephos.js
   cp Frontend/node_modules/@iatec/nephos/dist/tokens.css wwwroot/css/nephos-tokens.css
   cp Frontend/node_modules/@iatec/nephos/dist/scrollbar.css wwwroot/css/nephos-scrollbar.css
   ```

   Run both from an MSBuild target, or from your CI, before `dotnet publish`. The
   bundle carries `lit` and the icons: it does not need an import map.

3. Load them once, in `App.razor` (or `wwwroot/index.html` in WebAssembly):

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

4. Use the tags in a `.razor` file. A string attribute works as is:

   ```razor
   <nph-button text="Save" severity="primary"></nph-button>
   ```

   Blazor does not bind a custom element's property or event by itself. For a
   property, or for an event such as `nph-change`, use JavaScript interop with an
   `ElementReference`:

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
   // wwwroot/js/nephos-interop.js (a classic script, loaded before the Blazor script)
   window.nephos = {
     listen: (element, type, handler) =>
       element.addEventListener(type, (e) => handler.invokeMethodAsync('OnPressedChanged', e.detail.pressed)),
   };
   ```

## Checking the package

From a clone of the repository, `npm run build:lib` writes `dist/`,
`npm run test:package` checks that every import line above resolves, and
`npm run pack:check` lints the packed tarball. They are the proof that the import
paths in this guide are real.
