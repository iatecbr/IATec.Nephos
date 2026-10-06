/**
 * Prova da cascata dos tokens numa subarvore (P67), em navegador de verdade:
 * so onde ha cascata e heranca se ve o valor que uma `var()` resolve.
 *
 * Contrato de consumo (decisao de Indiane em 05-10-2026): numa parte da tela
 * com outra marca, `data-nph-brand` e `data-nph-color-scheme` vao no MESMO
 * elemento. Nessa subarvore, todo token de marca e semantico tem de resolver
 * igual ao que resolveria com os mesmos dois atributos na raiz.
 */
import { afterEach, describe, expect, it } from 'vitest';

import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';

/** As marcas e os esquemas saem dos seletores do proprio CSS gerado. */
const BRANDS = [...new Set([...tokensCss.matchAll(/\[data-nph-brand="([\w-]+)"\]/g)].map((m) => m[1] ?? ''))];
const SCHEMES = [...new Set([...tokensCss.matchAll(/\[data-nph-color-scheme="([\w-]+)"\]/g)].map((m) => m[1] ?? ''))];
/** A marca padrao e a que tambem sai em `:root`. */
const DEFAULT_BRAND = /:root,\s*\[data-nph-brand="([\w-]+)"\]/.exec(tokensCss)?.[1] ?? '';
/** `--nph-theme-brand-200` da marca padrao: o valor errado que a subarvore herdava. */
const DEFAULT_BRAND_HALO = '#b1cdfb';

/** Todo nome declarado, menos os primitivos: os de marca e os semanticos. */
const NAMES = [...new Set([...tokensCss.matchAll(/(--nph-[\w-]+)\s*:/g)].map((m) => m[1] ?? ''))].filter(
  (name) => name !== '' && !name.startsWith('--nph-core-'),
);

const root = document.documentElement;

afterEach(() => {
  document.body.replaceChildren();
  root.removeAttribute('style');
  root.removeAttribute('data-nph-brand');
  root.removeAttribute('data-nph-color-scheme');
});

function read(element: Element, names: string[]): Record<string, string> {
  const style = getComputedStyle(element);
  return Object.fromEntries(names.map((name) => [name, style.getPropertyValue(name).trim()]));
}

/** Valores num filho sem atributo de uma raiz que carrega os atributos. */
function atRoot(attributes: Record<string, string>): Record<string, string> {
  for (const [key, value] of Object.entries(attributes)) root.setAttribute(key, value);
  const child = document.createElement('div');
  document.body.append(child);
  const values = read(child, NAMES);
  child.remove();
  for (const key of Object.keys(attributes)) root.removeAttribute(key);
  return values;
}

/** Valores num elemento que carrega os atributos, sob a raiz sem atributo. */
function inSubtree(attributes: Record<string, string>): { element: HTMLElement; values: Record<string, string> } {
  const element = document.createElement('div');
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
  document.body.append(element);
  return { element, values: read(element, NAMES) };
}

function differences(expected: Record<string, string>, actual: Record<string, string>): string[] {
  return NAMES.filter((name) => expected[name] !== actual[name]).map(
    (name) => `${name}: raiz ${expected[name]} | subarvore ${actual[name]}`,
  );
}

describe('subarvore de esquema', () => {
  it('data-nph-color-scheme="dark" numa subarvore resolve igual ao escuro na raiz', () => {
    const expected = atRoot({ 'data-nph-color-scheme': 'dark' });
    const { values } = inSubtree({ 'data-nph-color-scheme': 'dark' });
    expect(differences(expected, values)).toEqual([]);
  });
});

describe('subarvore de marca com o esquema no mesmo elemento', () => {
  for (const brand of BRANDS) {
    for (const scheme of SCHEMES) {
      it(`${brand} + ${scheme} resolve igual a raiz`, () => {
        const attributes = { 'data-nph-brand': brand, 'data-nph-color-scheme': scheme };
        const expected = atRoot(attributes);
        const { values } = inSubtree(attributes);
        expect(differences(expected, values)).toEqual([]);
      });
    }
  }

  it('o CSS declara as sete marcas e os dois esquemas', () => {
    expect(BRANDS).toHaveLength(7);
    expect(SCHEMES).toEqual(['light', 'dark']);
    expect(BRANDS).toContain(DEFAULT_BRAND);
  });

  it('focus/halo de outra marca deixa de sair o halo da marca padrao', () => {
    for (const brand of BRANDS.filter((b) => b !== DEFAULT_BRAND)) {
      const { element } = inSubtree({ 'data-nph-brand': brand, 'data-nph-color-scheme': 'light' });
      const style = getComputedStyle(element);
      const halo = style.getPropertyValue('--nph-focus-halo').trim();
      expect(halo, brand).not.toBe(DEFAULT_BRAND_HALO);
      expect(halo, brand).toBe(style.getPropertyValue('--nph-theme-brand-200').trim());
      element.remove();
    }
  });
});

describe('personalizacao do consumidor (P02)', () => {
  it('invariante independente personalizado na raiz chega a subarvore de esquema', () => {
    root.style.setProperty('--nph-radius-control', '0px');
    const { values } = inSubtree({ 'data-nph-color-scheme': 'dark' });
    expect(values['--nph-radius-control']).toBe('0px');
  });
});
