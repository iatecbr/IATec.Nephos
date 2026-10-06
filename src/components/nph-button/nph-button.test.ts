/**
 * Testes do `nph-button` (P68), em navegador de verdade (P21, item 5): cor
 * resolvida, hover real, foco por teclado e medida so existem onde ha layout.
 *
 * Os esquemas de cor sao trocados na raiz (`data-nph-color-scheme` no `html`).
 * Numa parte da tela com outra marca e outro esquema, `status/on-solid` e
 * `focus/halo` resolvem o valor local (P67).
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-button.css?raw';
import { NPH_BUTTON_EMPHASES, NPH_BUTTON_SEVERITIES, NPH_BUTTON_SIZES, NphButton } from './nph-button';
import type { NphButtonEmphasis, NphButtonSeverity, NphButtonSize } from './nph-button';

type Props = Partial<
  Pick<NphButton, 'severity' | 'emphasis' | 'size' | 'text' | 'iconStart' | 'iconEnd' | 'label' | 'disabled' | 'loading'>
>;

/** Tokens de cada par, lidos variante a variante em `461:13009`. */
interface Pair {
  bg: string | null;
  bgHover: string;
  fg: string;
  fgHover?: string;
  border?: string;
  borderHover?: string;
}

const SOLID: Readonly<Record<NphButtonSeverity, Pair>> = {
  primary: { bg: '--nph-color-primary', bgHover: '--nph-color-primary-hover', fg: '--nph-color-primary-foreground' },
  secondary: { bg: '--nph-color-secondary', bgHover: '--nph-color-secondary-hover', fg: '--nph-color-secondary-foreground' },
  info: { bg: '--nph-status-info', bgHover: '--nph-status-info-hover', fg: '--nph-status-on-solid' },
  warn: { bg: '--nph-status-warning', bgHover: '--nph-status-warning-hover', fg: '--nph-status-on-solid' },
  help: { bg: '--nph-status-help', bgHover: '--nph-status-help-hover', fg: '--nph-status-on-solid' },
  danger: { bg: '--nph-color-destructive', bgHover: '--nph-color-destructive-hover', fg: '--nph-color-destructive-foreground' },
  success: { bg: '--nph-status-success', bgHover: '--nph-status-success-hover', fg: '--nph-status-on-solid' },
};

const LIGHT_AND_OUTLINE = {
  primary: {
    bg: '--nph-color-primary-surface',
    bgHover: '--nph-color-primary-surface-hover',
    fg: '--nph-color-primary-on-surface',
    fgHover: '--nph-color-primary-on-surface-hover',
  },
  danger: {
    bg: '--nph-color-destructive-surface',
    bgHover: '--nph-color-destructive-surface-hover',
    fg: '--nph-color-destructive-on-surface',
    fgHover: '--nph-color-destructive-on-surface-hover',
  },
} as const;

const PAIRS: ReadonlyArray<readonly [NphButtonSeverity, NphButtonEmphasis, Pair]> = [
  ...NPH_BUTTON_SEVERITIES.map((severity) => [severity, 'solid', SOLID[severity]] as const),
  ['primary', 'outline', { ...LIGHT_AND_OUTLINE.primary, border: LIGHT_AND_OUTLINE.primary.fg, borderHover: LIGHT_AND_OUTLINE.primary.fgHover }],
  ['secondary', 'outline', { bg: '--nph-color-muted', bgHover: '--nph-color-secondary-surface-hover', fg: '--nph-color-secondary-foreground', border: '--nph-color-secondary-foreground', borderHover: '--nph-color-secondary-foreground' }],
  ['danger', 'outline', { ...LIGHT_AND_OUTLINE.danger, border: LIGHT_AND_OUTLINE.danger.fg, borderHover: LIGHT_AND_OUTLINE.danger.fgHover }],
  ['primary', 'light', LIGHT_AND_OUTLINE.primary],
  ['secondary', 'light', { bg: '--nph-color-secondary-light', bgHover: '--nph-color-secondary-light-hover', fg: '--nph-color-secondary-foreground' }],
  ['danger', 'light', LIGHT_AND_OUTLINE.danger],
  ['primary', 'ghost', { bg: null, bgHover: '--nph-color-primary-surface', fg: '--nph-color-primary-on-surface' }],
  ['secondary', 'ghost', { bg: null, bgHover: '--nph-color-muted', fg: '--nph-color-secondary-foreground' }],
  ['danger', 'ghost', { bg: null, bgHover: '--nph-color-destructive-surface', fg: '--nph-color-destructive-on-surface' }],
];

/** Foco por tipo, igual em todas as enfases. */
const FOCUS: Readonly<Record<NphButtonSeverity, readonly [string, string]>> = {
  primary: ['--nph-color-primary', '--nph-focus-halo'],
  secondary: ['--nph-focus-border', '--nph-focus-halo'],
  info: ['--nph-status-info', '--nph-focus-halo-info'],
  warn: ['--nph-status-warning', '--nph-focus-halo-warn'],
  help: ['--nph-status-help', '--nph-focus-halo-help'],
  danger: ['--nph-color-destructive', '--nph-focus-halo-danger'],
  success: ['--nph-status-success', '--nph-focus-halo-success'],
};

const HEIGHT: Readonly<Record<NphButtonSize, string>> = {
  compact: '--nph-control-height-compact',
  default: '--nph-control-height-default',
  large: '--nph-control-height-large',
};

beforeAll(async () => {
  await document.fonts.load('500 14px "Noto Sans"');
  await document.fonts.ready;
});

afterEach(async () => {
  await userEvent.unhover(document.body).catch(() => {});
  document.body.replaceChildren();
  document.documentElement.removeAttribute('data-nph-color-scheme');
  vi.restoreAllMocks();
});

async function mount(props: Props = { text: 'Save' }): Promise<NphButton> {
  const element = document.createElement('nph-button');
  Object.assign(element, props);
  document.body.append(element);
  await element.updateComplete;
  return element;
}

function control(element: NphButton): HTMLButtonElement {
  const button = element.shadowRoot?.querySelector<HTMLButtonElement>('button');
  if (!button) throw new Error('sem <button> interno');
  return button;
}

function resolved(property: string, token: string): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  document.body.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

/** Uma marca que nao e a padrao, lida do CSS gerado. */
const DEFAULT_BRAND = /:root,\s*\[data-nph-brand="([\w-]+)"\]/.exec(tokensCss)?.[1] ?? '';
const OTHER_BRAND =
  [...tokensCss.matchAll(/\[data-nph-brand="([\w-]+)"\]/g)].map((m) => m[1] ?? '').find((brand) => brand !== DEFAULT_BRAND) ?? '';

/** Uma parte da tela com outra marca e outro esquema, no mesmo elemento (P67). */
function scope(): HTMLElement {
  const part = document.createElement('div');
  part.setAttribute('data-nph-brand', OTHER_BRAND);
  part.setAttribute('data-nph-color-scheme', 'dark');
  document.body.append(part);
  return part;
}

/** O valor de um token dentro de um elemento. */
function resolvedIn(parent: HTMLElement, property: string, token: string): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  parent.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

/** Cor do traco do outline, tirada do `box-shadow` `inset`. */
function insetColor(button: HTMLButtonElement): string {
  const shadow = getComputedStyle(button).boxShadow;
  return shadow === 'none' ? 'none' : (shadow.match(/rgba?\([^)]*\)/)?.[0] ?? shadow);
}

describe('registro e API', () => {
  it('define nph-button uma unica vez', () => {
    expect(customElements.get('nph-button')).toBe(NphButton);
  });

  it('a API publica e exatamente a da P68', () => {
    const declared = [...(NphButton as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared).toEqual(['severity', 'emphasis', 'size', 'text', 'iconStart', 'iconEnd', 'label', 'disabled', 'loading']);
  });

  it('os padroes sao primary, solid e default (size default por decisao de 05-10-2026)', async () => {
    const element = await mount();
    expect([element.severity, element.emphasis, element.size]).toEqual(['primary', 'solid', 'default']);
    expect(getComputedStyle(control(element)).height).toBe(resolved('height', '--nph-control-height-default'));
    expect(element.disabled).toBe(false);
    expect(element.loading).toBe(false);
  });

  it('os valores sao os do Figma, nada alem', () => {
    expect([...NPH_BUTTON_SEVERITIES]).toEqual(['primary', 'secondary', 'info', 'warn', 'help', 'danger', 'success']);
    expect([...NPH_BUTTON_EMPHASES]).toEqual(['solid', 'outline', 'light', 'ghost']);
    expect([...NPH_BUTTON_SIZES]).toEqual(['compact', 'default', 'large']);
  });

  it('os atributos dos icones sao icon-start e icon-end', async () => {
    const element = document.createElement('nph-button');
    element.setAttribute('text', 'New');
    element.setAttribute('icon-start', 'plus');
    element.setAttribute('icon-end', 'chevron-down');
    document.body.append(element);
    await element.updateComplete;
    expect([element.iconStart, element.iconEnd]).toEqual(['plus', 'chevron-down']);
  });
});

describe('cores por tipo e enfase, em repouso e no hover, nos dois esquemas', () => {
  for (const scheme of ['light', 'dark'] as const) {
    for (const [severity, emphasis, pair] of PAIRS) {
      it(`${scheme} · ${severity} ${emphasis}`, async () => {
        document.documentElement.setAttribute('data-nph-color-scheme', scheme);
        const element = await mount({ severity, emphasis, size: 'default', text: 'Save', iconStart: 'plus' });
        const button = control(element);
        const icon = button.querySelector('nph-icon');
        const rest = getComputedStyle(button);
        expect(rest.backgroundColor).toBe(pair.bg ? resolved('background-color', pair.bg) : 'rgba(0, 0, 0, 0)');
        expect(rest.color).toBe(resolved('color', pair.fg));
        expect(icon && getComputedStyle(icon).color).toBe(resolved('color', pair.fg));
        expect(insetColor(button)).toBe(pair.border ? resolved('color', pair.border) : 'none');

        await userEvent.hover(button);
        const hover = getComputedStyle(button);
        expect(hover.backgroundColor).toBe(resolved('background-color', pair.bgHover));
        expect(hover.color).toBe(resolved('color', pair.fgHover ?? pair.fg));
        expect(insetColor(button)).toBe(pair.borderHover ? resolved('color', pair.borderHover) : 'none');
      });
    }
  }
});

describe('tamanhos e anatomia', () => {
  for (const size of NPH_BUTTON_SIZES) {
    it(`${size}: altura do token, respiro, espaco, raio e texto label-md`, async () => {
      const element = await mount({ size, text: 'Save', iconStart: 'plus', iconEnd: 'chevron-down' });
      const button = control(element);
      const style = getComputedStyle(button);
      expect(style.height).toBe(resolved('height', HEIGHT[size]));
      expect(style.paddingLeft).toBe(resolved('padding-left', '--nph-space-control-padding'));
      expect(style.columnGap).toBe(resolved('column-gap', '--nph-space-inline-tight'));
      expect(style.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-radius-control'));
      expect(style.fontSize).toBe(resolved('font-size', '--nph-text-label-md-font-size'));
      expect(style.fontWeight).toBe(resolved('font-weight', '--nph-text-label-md-font-weight'));
      expect(style.whiteSpace).toBe('nowrap');
      const icons = [...button.querySelectorAll('nph-icon')];
      expect(icons.map((icon) => icon.getAttribute('size'))).toEqual(['sm', 'sm']);
      expect([...button.children].map((node) => node.tagName.toLowerCase())).toEqual(['nph-icon', 'span', 'nph-icon']);
    });

    it(`${size}: so icone e quadrado e o icone acompanha a caixa`, async () => {
      const element = await mount({ size, iconStart: 'plus', label: 'Add' });
      const box = control(element).getBoundingClientRect();
      const height = Number.parseFloat(resolved('height', HEIGHT[size]));
      expect([box.width, box.height]).toEqual([height, height]);
      const expected = { compact: 'sm', default: 'md', large: 'lg' }[size];
      expect(control(element).querySelector('nph-icon')?.getAttribute('size')).toBe(expected);
    });
  }
});

describe('foco', () => {
  for (const severity of NPH_BUTTON_SEVERITIES) {
    it(`${severity}: Tab mostra a borda na cor do tipo e o halo por fora`, async () => {
      const before = document.createElement('input');
      document.body.append(before);
      const element = await mount({ severity, size: 'default', text: 'Save' });
      before.focus();
      await userEvent.tab();
      const button = control(element);
      expect(element.shadowRoot?.activeElement).toBe(button);
      const border = getComputedStyle(button, '::before');
      const halo = getComputedStyle(button, '::after');
      const [borderToken, haloToken] = FOCUS[severity];
      expect(border.borderTopColor).toBe(resolved('color', borderToken));
      expect(border.borderTopWidth).toBe(resolved('width', '--nph-border-width'));
      expect(border.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-border-radius-control'));
      expect(halo.borderTopColor).toBe(resolved('color', haloToken));
      expect(halo.borderTopWidth).toBe(resolved('width', '--nph-focus-ring-width'));
      expect(halo.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-radius-control-with-border'));
      /* Por fora, sem mudar o tamanho: 1 px de borda e 4 px de halo. */
      const box = button.getBoundingClientRect();
      const borderWidth = Number.parseFloat(resolved('width', '--nph-border-width'));
      const ringWidth = Number.parseFloat(resolved('width', '--nph-focus-ring-width'));
      expect(Number.parseFloat(border.width)).toBeCloseTo(box.width + 2 * borderWidth, 2);
      expect(Number.parseFloat(halo.height)).toBeCloseTo(box.height + 2 * (borderWidth + ringWidth), 2);
    });
  }

  it('numa parte da tela com outra marca e outro esquema, o texto solido e o halo sao os locais (P67)', async () => {
    const part = scope();
    const before = document.createElement('input');
    const info = document.createElement('nph-button');
    Object.assign(info, { severity: 'info', text: 'Save' });
    const primary = document.createElement('nph-button');
    Object.assign(primary, { severity: 'primary', text: 'Save' });
    part.append(info, before, primary);
    await Promise.all([info.updateComplete, primary.updateComplete]);
    const onSolid = resolvedIn(part, 'color', '--nph-status-on-solid');
    const halo = resolvedIn(part, 'color', '--nph-focus-halo');
    expect(onSolid).not.toBe(resolved('color', '--nph-status-on-solid'));
    expect(halo).not.toBe(resolved('color', '--nph-focus-halo'));
    expect(getComputedStyle(control(info)).color).toBe(onSolid);
    before.focus();
    await userEvent.tab();
    expect(primary.shadowRoot?.activeElement).toBe(control(primary));
    expect(getComputedStyle(control(primary), '::after').borderTopColor).toBe(halo);
  });

  it('o clique de mouse nao desenha o foco', async () => {
    const element = await mount({ text: 'Save' });
    await userEvent.click(control(element));
    expect(getComputedStyle(control(element), '::before').content).toBe('none');
  });

  it('o foco do host vai para o botao nativo', async () => {
    const element = await mount({ text: 'Save' });
    element.focus();
    expect(element.shadowRoot?.activeElement).toBe(control(element));
  });
});

describe('acao e teclado', () => {
  it('clique, Enter e Espaco disparam click no host', async () => {
    const element = await mount({ text: 'Save' });
    const clicks = vi.fn();
    element.addEventListener('click', clicks);
    await userEvent.click(control(element));
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(clicks).toHaveBeenCalledTimes(3);
  });

  it('o botao interno e type=button: nao envia formulario', async () => {
    const element = await mount();
    expect(control(element).type).toBe('button');
  });
});

describe('disabled', () => {
  it('sai do Tab, nao dispara click e fica em state/disabled-opacity', async () => {
    const before = document.createElement('input');
    document.body.append(before);
    const element = await mount({ text: 'Save', disabled: true });
    const clicks = vi.fn();
    element.addEventListener('click', clicks);
    before.focus();
    await userEvent.tab();
    expect(element.shadowRoot?.activeElement ?? null).toBeNull();
    element.click();
    control(element).click();
    expect(clicks).not.toHaveBeenCalled();
    expect(control(element).disabled).toBe(true);
    expect(getComputedStyle(element).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
  });

  it('no hover, as cores ficam as do repouso', async () => {
    const element = await mount({ text: 'Save', disabled: true });
    const rest = getComputedStyle(control(element)).backgroundColor;
    await userEvent.hover(element, { force: true });
    expect(getComputedStyle(control(element)).backgroundColor).toBe(rest);
  });
});

describe('loading', () => {
  it('o girador entra no lugar do icone de inicio, o de fim some e o texto fica', async () => {
    const element = await mount({ text: 'Save', iconStart: 'plus', iconEnd: 'chevron-down', loading: true });
    const button = control(element);
    expect([...button.children].map((node) => node.tagName.toLowerCase())).toEqual(['nph-spinner', 'span']);
    expect(button.querySelector('nph-spinner')?.getAttribute('size')).toBe('sm');
    expect(button.querySelector('nph-spinner')?.getAttribute('aria-hidden')).toBe('true');
    expect(button.querySelector('.text')?.textContent).toBe('Save');
  });

  it('continua focavel, anuncia ocupado e nao dispara click', async () => {
    /* O Tab parte de um campo antes do botao, e nao do foco que o teste anterior deixou. */
    const before = document.createElement('input');
    document.body.append(before);
    const element = await mount({ text: 'Save', loading: true });
    const clicks = vi.fn();
    element.addEventListener('click', clicks);
    before.focus();
    await userEvent.tab();
    expect([document.activeElement?.tagName, element.shadowRoot?.activeElement?.tagName]).toEqual(['NPH-BUTTON', 'BUTTON']);
    await userEvent.keyboard('{Enter}');
    await userEvent.click(control(element), { force: true });
    element.click();
    expect(clicks).not.toHaveBeenCalled();
    expect(control(element).getAttribute('aria-disabled')).toBe('true');
    expect(control(element).getAttribute('aria-busy')).toBe('true');
    expect(getComputedStyle(element).opacity).toBe('1');
  });

  it('no so icone, o girador e sm no compact e md no default e no large', async () => {
    const sizes: Record<NphButtonSize, string> = { compact: 'sm', default: 'md', large: 'md' };
    for (const size of NPH_BUTTON_SIZES) {
      const element = await mount({ size, iconStart: 'plus', label: 'Add', loading: true });
      const children = [...control(element).children];
      expect(children.map((node) => node.tagName.toLowerCase())).toEqual(['nph-spinner']);
      expect(children[0]?.getAttribute('size')).toBe(sizes[size]);
      element.remove();
    }
  });

  it('o girador herda a cor do texto', async () => {
    const element = await mount({ severity: 'danger', emphasis: 'light', text: 'Delete', loading: true });
    const spinner = control(element).querySelector('nph-spinner');
    expect(spinner && getComputedStyle(spinner).color).toBe(resolved('color', '--nph-color-destructive-on-surface'));
  });
});

describe('nome acessivel', () => {
  it('com texto, o nome e o texto e nao ha aria-label', async () => {
    const element = await mount({ text: 'Save', label: 'ignored' });
    expect(control(element).hasAttribute('aria-label')).toBe(false);
    expect(control(element).textContent?.trim()).toBe('Save');
  });

  it('so icone: aria-label vem de label e o icone e decorativo', async () => {
    const element = await mount({ iconEnd: 'xmark', label: 'Close' });
    expect(control(element).getAttribute('aria-label')).toBe('Close');
    expect(control(element).querySelector('nph-icon')?.getAttribute('aria-hidden')).toBe('true');
  });
});

describe('montagem e entrada invalida', () => {
  it('texto removido ou undefined vira so icone, sem quebrar o render', async () => {
    const element = await mount({ text: 'Save', iconStart: 'plus', label: 'Add' });
    element.removeAttribute('text');
    element.text = null as unknown as string;
    await element.updateComplete;
    expect(control(element).querySelector('.text')).toBeNull();
    expect(control(element).getAttribute('aria-label')).toBe('Add');
    element.text = undefined as unknown as string;
    await element.updateComplete;
    expect(control(element).getAttribute('aria-label')).toBe('Add');
  });

  it('sem texto e sem icone e montagem: nada e sem erro', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const element = await mount({});
    expect(element.shadowRoot?.querySelector('button')).toBeNull();
    expect(element.getBoundingClientRect().width).toBe(0);
    expect(error).not.toHaveBeenCalled();
  });

  const cases: ReadonlyArray<readonly [string, Props, number]> = [
    ['severity fora da lista', { severity: 'neutral' as NphButtonSeverity, text: 'Save' }, 1],
    ['emphasis fora da lista', { emphasis: 'link' as NphButtonEmphasis, text: 'Save' }, 1],
    ['outline em info (B1)', { severity: 'info', emphasis: 'outline', text: 'Save' }, 1],
    ['ghost em success (B1)', { severity: 'success', emphasis: 'ghost', text: 'Save' }, 1],
    ['size fora da lista', { size: 'small' as NphButtonSize, text: 'Save' }, 1],
    ['icone fora do nucleo', { text: 'Save', iconStart: 'not-a-core-name' }, 1],
    ['so icone sem label', { iconStart: 'plus' }, 1],
    ['dois icones sem texto', { iconStart: 'plus', iconEnd: 'xmark', label: 'More' }, 1],
    ['acumula as causas', { severity: 'neutral' as NphButtonSeverity, size: 'small' as NphButtonSize, iconStart: 'not-a-core-name', text: 'Save' }, 3],
  ];
  for (const [name, props, count] of cases) {
    it(`${name}: nada e ${count} erro(s)`, async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const element = await mount(props);
      expect(error).toHaveBeenCalledTimes(count);
      expect(element.shadowRoot?.querySelector('button')).toBeNull();
      expect(element.getBoundingClientRect().width).toBe(0);
    });
  }
});

describe('o que o botao nao tem', () => {
  it('nao tem slot nem part', async () => {
    const element = await mount();
    expect(element.shadowRoot?.querySelector('slot, [part]')).toBeNull();
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
