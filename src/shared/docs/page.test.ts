/**
 * Contract of the content page blocks (`page.ts`) and of the text keys
 * they consume in the three Storybook languages.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { html, render } from 'lit';
import type { TemplateResult } from 'lit';

import '../../tokens/generated/tokens.css';
import { DEFAULT_LOCALE, LOCALES, translations } from '../../../.storybook/i18n/index.js';
import { demo, source, index, note, section, table, useDontUse } from './page';

afterEach(() => {
  document.body.replaceChildren();
});

async function mount(content: TemplateResult): Promise<HTMLElement> {
  const target = document.createElement('div');
  document.body.append(target);
  render(content, target);
  const icons = [...target.querySelectorAll('nph-icon')] as unknown as Array<{
    updateComplete: Promise<unknown>;
  }>;
  await Promise.all(icons.map((icon) => icon.updateComplete));
  return target;
}

describe('content page blocks', () => {
  it('section generates <section id> with <h2>', async () => {
    const target = await mount(section('size', 'Tamanho', html`<p>texto</p>`));
    const element = target.querySelector('section');
    expect(element?.id).toBe('size');
    expect(element?.querySelector('h2')?.textContent?.trim()).toBe('Tamanho');
  });

  it('index generates one "#id" link per item, inside a named nav', async () => {
    const items = [
      { id: 'a', title: 'A' },
      { id: 'b', title: 'B' },
    ];
    const target = await mount(index('Nesta página', items));
    const nav = target.querySelector('nav');
    expect(nav?.getAttribute('aria-label')).toBe('Nesta página');
    const links = [...target.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    expect(links).toEqual(['#a', '#b']);
  });

  it('the index link moves focus to the section without navigating the page', async () => {
    const target = await mount(html`
      ${index('Nesta página', [{ id: 'target', title: 'Destino' }])}
      ${section('target', 'Destino', html`<p>texto</p>`)}
    `);
    const href = window.location.href;
    target.querySelector('a')?.click();
    expect(window.location.href).toBe(href);
    expect(document.activeElement?.id).toBe('target');

    const focused = document.getElementById('target') as HTMLElement;
    const style = getComputedStyle(focused);
    expect(style.outlineStyle).toBe('solid');
    expect(parseFloat(style.outlineWidth)).toBeGreaterThan(0);
  });

  it('note has role="note" and the icon is decorative', async () => {
    const target = await mount(note('info', 'Título', 'Texto'));
    const element = target.querySelector('[role="note"]');
    expect(element).not.toBeNull();
    expect(element?.querySelector('nph-icon')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('use and do-not-use cards have decorative icons', async () => {
    const target = await mount(
      useDontUse({ title: 'Usar', items: ['um'] }, { title: 'Não usar', items: ['dois'] }),
    );
    const icons = [...target.querySelectorAll('nph-icon')];
    expect(icons.length).toBeGreaterThan(0);
    for (const icon of icons) {
      expect(icon.getAttribute('aria-hidden')).toBe('true');
    }
  });

  it('demo has no background of its own, only a border', async () => {
    const target = await mount(demo(html`<span>exemplo</span>`, 'Legenda'));
    const area = target.querySelector('[data-nph-demo] > div') as HTMLElement;
    expect(getComputedStyle(area).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(getComputedStyle(area).borderTopStyle).toBe('solid');
  });

  it('table in auto uses the code font only for identifiers', async () => {
    const target = await mount(
      table(['Termo', 'Regra'], [['icon/size-sm', 'um'], ['Slots e eventos', 'dois'], ['Interação', 'três']], 'auto'),
    );
    const cells = [...target.querySelectorAll<HTMLElement>('tbody th')];
    expect(cells).toHaveLength(3);
    const family = (el: HTMLElement): string => getComputedStyle(el).fontFamily;
    expect(family(cells[0] as HTMLElement)).toContain('IBM Plex Mono');
    expect(family(cells[1] as HTMLElement)).not.toContain('IBM Plex Mono');
    expect(family(cells[2] as HTMLElement)).not.toContain('IBM Plex Mono');
  });

  it('source sits in a footer with a rule above', async () => {
    const target = await mount(source('Fonte:', 'design.md'));
    const p = target.querySelector('p') as HTMLElement;
    expect(p.textContent?.trim()).toBe('Fonte: design.md');
    expect(getComputedStyle(p).borderTopStyle).toBe('solid');
  });
});

describe('page texts in the three languages', () => {
  const DICTIONARIES = { 'pt-BR': translations('pt-BR'), en: translations('en'), es: translations('es') } as const;
  const KEYS = [
    'onThisPage',
    'apiHeader',
    'sizeHeader',
    'coreHeader',
    'sizeCaption',
    'overflowNoteTitle',
    'solidNoteTitle',
    'invalidNoteTitle',
  ] as const;

  for (const [locale, dictionary] of Object.entries(DICTIONARIES)) {
    it(`${locale}: the new keys exist and are not empty`, () => {
      const docs = dictionary.docs as Record<string, unknown>;
      for (const key of KEYS) {
        const value = docs[key];
        const texts = Array.isArray(value) ? value : [value];
        expect(texts.length, key).toBeGreaterThan(0);
        for (const text of texts) {
          expect(typeof text, key).toBe('string');
          expect((text as string).trim(), key).not.toBe('');
        }
      }
    });

    it(`${locale}: the process text left the page`, () => {
      expect('derivedText2' in dictionary.docs).toBe(false);
    });
  }
});

/* The Storybook language contract (P64, amendment of 06/10/2026): English is the source and the default. */
/** Every key path of a dictionary, with the length of each list. */
function shape(value: unknown, prefix = ''): string[] {
  if (Array.isArray(value)) return [`${prefix}[${value.length}]`, ...value.flatMap((v, i) => shape(v, `${prefix}[${i}]`))];
  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).flatMap(([k, v]) => [`${prefix}.${k}`, ...shape(v, `${prefix}.${k}`)]);
  }
  return [];
}

describe('Storybook languages', () => {
  it('English is the default language', () => {
    expect(DEFAULT_LOCALE).toBe('en');
  });

  it('the selector lists the source first: en, pt-BR, es', () => {
    expect(LOCALES.map((l) => l.value)).toEqual(['en', 'pt-BR', 'es']);
  });

  it('an unknown language falls back to the English dictionary', () => {
    expect(translations('xx')).toBe(translations('en'));
  });

  it('pt-BR and es have the same keys and list lengths as the English source', () => {
    const source = shape(translations('en')).sort();
    expect(shape(translations('pt-BR')).sort()).toEqual(source);
    expect(shape(translations('es')).sort()).toEqual(source);
  });
});
