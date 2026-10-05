/**
 * Testes do `nph-badge` (P68), em navegador de verdade (P21, item 5): a cor
 * resolvida, a altura e a fonte so existem onde ha layout.
 *
 * Os esquemas de cor sao trocados na raiz (`data-nph-color-scheme` no `html`):
 * `status/on-solid` e o halo saem em `:root` ate o gerador redeclarar os
 * invariantes por esquema (P68, limite L-a).
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-badge.css?raw';
import { NPH_BADGE_EMPHASES, NPH_BADGE_SEVERITIES, NphBadge } from './nph-badge';
import type { NphBadgeEmphasis, NphBadgeSeverity } from './nph-badge';

/** Pares de fundo e texto do conjunto `878:30`, lidos no Figma. */
const PAIRS: Readonly<Record<NphBadgeEmphasis, Readonly<Record<NphBadgeSeverity, readonly [string, string]>>>> = {
  solid: {
    primary: ['--nph-color-primary', '--nph-color-primary-foreground'],
    secondary: ['--nph-color-secondary', '--nph-color-secondary-foreground'],
    info: ['--nph-status-info', '--nph-status-on-solid'],
    warn: ['--nph-status-warning', '--nph-status-on-solid'],
    help: ['--nph-status-help', '--nph-status-on-solid'],
    danger: ['--nph-color-destructive', '--nph-color-destructive-foreground'],
    success: ['--nph-status-success', '--nph-status-on-solid'],
  },
  light: {
    primary: ['--nph-color-primary-surface', '--nph-color-primary-on-surface'],
    secondary: ['--nph-color-secondary-light', '--nph-color-secondary-foreground'],
    info: ['--nph-status-info-surface', '--nph-status-info-foreground'],
    warn: ['--nph-status-warning-surface', '--nph-status-warning-foreground'],
    help: ['--nph-status-help-surface', '--nph-status-help-foreground'],
    danger: ['--nph-color-destructive-surface', '--nph-color-destructive-on-surface'],
    success: ['--nph-status-success-surface', '--nph-status-success-foreground'],
  },
};

beforeAll(async () => {
  await document.fonts.load('500 12px "Noto Sans"');
  await document.fonts.ready;
});

afterEach(() => {
  document.body.replaceChildren();
  document.documentElement.removeAttribute('data-nph-color-scheme');
  vi.restoreAllMocks();
});

async function mount(props: Partial<Pick<NphBadge, 'severity' | 'emphasis' | 'text' | 'icon'>> = { text: 'Label' }): Promise<NphBadge> {
  const element = document.createElement('nph-badge');
  Object.assign(element, props);
  document.body.append(element);
  await element.updateComplete;
  return element;
}

/** O valor que o navegador da a um token, na mesma propriedade. */
function resolved(property: string, token: string): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  document.body.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

describe('registro e API', () => {
  it('define nph-badge uma unica vez', () => {
    expect(customElements.get('nph-badge')).toBe(NphBadge);
  });

  it('a API publica e exatamente severity, emphasis, text e icon', () => {
    const declared = [...(NphBadge as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared).toEqual(['severity', 'emphasis', 'text', 'icon']);
  });

  it('os padroes sao primary e solid, como no conjunto 878:30', async () => {
    const element = await mount();
    expect(element.severity).toBe('primary');
    expect(element.emphasis).toBe('solid');
    expect(element.getAttribute('severity')).toBe('primary');
    expect(element.getAttribute('emphasis')).toBe('solid');
  });

  it('os valores sao os do Figma, nada alem', () => {
    expect([...NPH_BADGE_SEVERITIES]).toEqual(['primary', 'secondary', 'info', 'warn', 'help', 'danger', 'success']);
    expect([...NPH_BADGE_EMPHASES]).toEqual(['solid', 'light']);
  });
});

describe('cores por tipo e enfase, nos dois esquemas', () => {
  for (const scheme of ['light', 'dark'] as const) {
    for (const emphasis of NPH_BADGE_EMPHASES) {
      for (const severity of NPH_BADGE_SEVERITIES) {
        it(`${scheme} · ${severity} ${emphasis}: fundo e texto nos tokens`, async () => {
          document.documentElement.setAttribute('data-nph-color-scheme', scheme);
          const element = await mount({ severity, emphasis, text: 'Label', icon: 'circle-info' });
          const [bg, fg] = PAIRS[emphasis][severity];
          const style = getComputedStyle(element);
          expect(style.backgroundColor).toBe(resolved('background-color', bg));
          expect(style.color).toBe(resolved('color', fg));
          const icon = element.shadowRoot?.querySelector('nph-icon');
          expect(icon && getComputedStyle(icon).color).toBe(resolved('color', fg));
        });
      }
    }
  }
});

describe('anatomia', () => {
  it('mede 24 de altura, com respiro, espaco e raio pelos tokens', async () => {
    const element = await mount({ text: 'Label', icon: 'circle-info' });
    const style = getComputedStyle(element);
    expect(element.getBoundingClientRect().height).toBe(24);
    expect(style.paddingTop).toBe(resolved('padding-top', '--nph-space-inline-tight'));
    expect(style.paddingLeft).toBe(resolved('padding-left', '--nph-space-control-padding'));
    expect(style.columnGap).toBe(resolved('column-gap', '--nph-space-inline-tight'));
    expect(style.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-radius-full'));
    expect(style.fontSize).toBe(resolved('font-size', '--nph-text-label-sm-font-size'));
    expect(style.fontWeight).toBe(resolved('font-weight', '--nph-text-label-sm-font-weight'));
  });

  it('o icone vem antes do texto, em sm', async () => {
    const element = await mount({ text: 'Label', icon: 'circle-info' });
    const children = [...(element.shadowRoot?.children ?? [])].filter((node) => node.tagName !== 'STYLE');
    expect(children.map((node) => node.tagName.toLowerCase())).toEqual(['nph-icon', 'span']);
    expect(children[0]?.getAttribute('size')).toBe('sm');
  });

  it('o texto fica numa linha so', async () => {
    const element = await mount({ text: 'Under review' });
    expect(getComputedStyle(element).whiteSpace).toBe('nowrap');
  });
});

describe('o que o selo nao tem', () => {
  it('nao recebe foco nem tem role', async () => {
    const element = await mount();
    element.focus();
    expect(document.activeElement).not.toBe(element);
    expect(element.shadowRoot?.activeElement ?? null).toBeNull();
    expect(element.hasAttribute('role')).toBe(false);
    expect(element.shadowRoot?.querySelector('button, a, [tabindex]')).toBeNull();
  });

  it('nao tem slot', async () => {
    const element = await mount();
    expect(element.shadowRoot?.querySelector('slot')).toBeNull();
  });

  it('o CSS nao muda nada no hover nem no foco', () => {
    expect(componentCss).not.toMatch(/:hover|:focus|:active/);
  });

  it('o texto e o nome acessivel; o icone e decorativo', async () => {
    const element = await mount({ text: 'Approved', icon: 'circle-check' });
    expect(element.shadowRoot?.querySelector('.text')?.textContent).toBe('Approved');
    expect(element.shadowRoot?.querySelector('nph-icon')?.getAttribute('aria-hidden')).toBe('true');
  });
});

describe('montagem e entrada invalida', () => {
  it('texto nulo ou undefined nao quebra: nao ha selo', async () => {
    const element = await mount({ text: 'Label' });
    element.text = null as unknown as string;
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector('.text')).toBeNull();
    element.text = undefined as unknown as string;
    await element.updateComplete;
    expect(element.getBoundingClientRect().width).toBe(0);
  });

  it('sem texto nao ha selo: 0 x 0 e sem erro', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const element = await mount({ text: '   ' });
    const box = element.getBoundingClientRect();
    expect([box.width, box.height]).toEqual([0, 0]);
    expect(error).not.toHaveBeenCalled();
  });

  it('acumula um erro por causa e nao desenha nada', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const element = await mount({
      severity: 'neutral' as NphBadgeSeverity,
      emphasis: 'outline' as NphBadgeEmphasis,
      icon: 'not-a-core-name',
      text: 'Label',
    });
    expect(error).toHaveBeenCalledTimes(3);
    expect(element.shadowRoot?.querySelector('.text')).toBeNull();
    expect(element.getBoundingClientRect().width).toBe(0);
  });
});

describe('contrato de token', () => {
  it('todo token consumido existe no CSS gerado', () => {
    const consumed = new Set(componentCss.match(/--nph-[a-z0-9-]+/g) ?? []);
    for (const token of consumed) {
      expect(tokensCss, token).toContain(`${token}:`);
    }
  });

  it('nao ha valor literal de cor nem de medida no CSS do componente', () => {
    const rules = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
    expect(rules).not.toMatch(/#[0-9a-fA-F]{3,8}\b|\d+px|rgba?\(/);
  });
});
