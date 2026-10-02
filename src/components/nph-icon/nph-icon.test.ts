/**
 * Prova do contrato do `nph-icon`.
 *
 * Roda em Chromium de verdade (P21, item 5). Os grupos abaixo cobrem o que a
 * ficha promete: nucleo fechado, variante, tamanho por token, entrada
 * invalida, acessibilidade, ausencia de interacao, heranca de cor e transbordo
 * dos icones largos.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MockInstance } from 'vitest';

import designMd from '../../../design.md?raw';
import '../../tokens/generated/tokens.css';
import { NphIcon } from './nph-icon';
import { NPH_ICON_NAMES } from './nph-icon.icons';

/* `NphIcon` e importado como valor para registrar o elemento e para tipar. */
const REGISTERED = customElements.get('nph-icon');

let errors: MockInstance<typeof console.error>;

beforeEach(() => {
  errors = vi.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
  errors.mockRestore();
  document.body.replaceChildren();
});

async function mount(attributes: Record<string, string>): Promise<NphIcon> {
  const element = document.createElement('nph-icon');
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }
  document.body.append(element);
  await element.updateComplete;
  return element;
}

function svgOf(element: NphIcon): SVGSVGElement | null {
  return element.shadowRoot?.querySelector('svg') ?? null;
}

function pathOf(element: NphIcon): string {
  return element.shadowRoot?.querySelector('path')?.getAttribute('d') ?? '';
}

/**
 * Extrai os nomes de `icones_nucleo` direto do `design.md`. O mapa do
 * componente nao pode divergir da fonte: se a lista mudar la, este teste
 * reprova aqui.
 */
function namesFromDesignMd(): string[] {
  const start = designMd.indexOf('icones_nucleo:');
  const end = designMd.indexOf('icones_segunda_leva:');
  expect(start).toBeGreaterThan(-1);
  expect(end).toBeGreaterThan(start);

  const block = designMd.slice(start, end);
  const lists = [...block.matchAll(/icones:\s*\[([^\]]+)\]/g)];
  expect(lists.length).toBe(5);

  return lists.flatMap((list) =>
    (list[1] ?? '').split(',').map((name) => name.trim()),
  );
}

describe('registro do elemento', () => {
  it('define nph-icon uma unica vez', () => {
    expect(REGISTERED).toBe(NphIcon);
  });
});

describe('nucleo fechado de icones_nucleo do design.md', () => {
  it('o mapa do componente e identico a icones_nucleo do design.md', () => {
    const fromDocument = namesFromDesignMd();
    expect(fromDocument.length).toBeGreaterThan(0);
    expect(new Set(fromDocument).size).toBe(fromDocument.length);
    expect([...NPH_ICON_NAMES].sort()).toEqual([...fromDocument].sort());
  });

  it('cada nome do nucleo desenha um caminho', async () => {
    for (const name of NPH_ICON_NAMES) {
      const icon = await mount({ name: name, size: 'sm' });
      expect(svgOf(icon), name).not.toBeNull();
      expect(pathOf(icon).length, name).toBeGreaterThan(0);
      icon.remove();
    }
    expect(errors).not.toHaveBeenCalled();
  });
});

describe('variant', () => {
  it('regular e o padrao quando o atributo esta ausente', async () => {
    const withoutAttribute = await mount({ name: 'star', size: 'sm' });
    const explicit = await mount({ name: 'star', variant: 'regular', size: 'sm' });
    expect(pathOf(withoutAttribute)).toBe(pathOf(explicit));
    expect(errors).not.toHaveBeenCalled();
  });

  it('star aceita solid, com arte diferente da regular', async () => {
    const regular = await mount({ name: 'star', variant: 'regular', size: 'sm' });
    const solid = await mount({ name: 'star', variant: 'solid', size: 'sm' });
    expect(svgOf(solid)).not.toBeNull();
    expect(pathOf(solid)).not.toBe(pathOf(regular));
    expect(errors).not.toHaveBeenCalled();
  });

  it('circle-info aceita solid, com arte diferente da regular', async () => {
    const regular = await mount({ name: 'circle-info', variant: 'regular', size: 'sm' });
    const solid = await mount({ name: 'circle-info', variant: 'solid', size: 'sm' });
    expect(svgOf(solid)).not.toBeNull();
    expect(pathOf(solid)).not.toBe(pathOf(regular));
    expect(errors).not.toHaveBeenCalled();
  });

  it('cada nome aceita solid', async () => {
    for (const name of NPH_ICON_NAMES) {
      const icon = await mount({ name: name, variant: 'solid', size: 'sm' });
      expect(svgOf(icon), name).not.toBeNull();
      icon.remove();
    }
    expect(errors).not.toHaveBeenCalled();
  });

  it('familia proibida nao renderiza', async () => {
    for (const family of ['light', 'thin', 'sharp', 'duotone']) {
      const icon = await mount({ name: 'check', variant: family, size: 'sm' });
      expect(svgOf(icon), family).toBeNull();
    }
    expect(errors).toHaveBeenCalledTimes(4);
  });
});

describe('size', () => {
  it('cada tamanho vem do token semantico correspondente', async () => {
    const expected: Record<string, string> = { sm: '16px', md: '20px', lg: '24px' };
    for (const [size, measure] of Object.entries(expected)) {
      const icon = await mount({ name: 'gear', size: size });
      const style = getComputedStyle(icon);
      expect(style.inlineSize, size).toBe(measure);
      expect(style.blockSize, size).toBe(measure);
    }
    expect(errors).not.toHaveBeenCalled();
  });

  it('e obrigatorio: sem size nao ha icone nem caixa', async () => {
    const icon = await mount({ name: 'gear' });
    expect(svgOf(icon)).toBeNull();
    expect(getComputedStyle(icon).display).toBe('none');
    expect(errors).toHaveBeenCalledTimes(1);
  });

  it('valor livre nao renderiza', async () => {
    for (const size of ['xl', '16', '16px', '']) {
      const icon = await mount({ name: 'gear', size: size });
      expect(svgOf(icon), size).toBeNull();
    }
    expect(errors).toHaveBeenCalledTimes(4);
  });
});

describe('entrada invalida', () => {
  it('name fora do nucleo nao renderiza e reclama', async () => {
    for (const name of ['rocket', 'Star', 'fa-star', 'times', '']) {
      const icon = await mount({ name: name, size: 'sm' });
      expect(svgOf(icon), name).toBeNull();
      expect(getComputedStyle(icon).display, name).toBe('none');
    }
    expect(errors).toHaveBeenCalledTimes(5);
  });

  it('name ausente nao renderiza e reclama', async () => {
    const icon = await mount({ size: 'sm' });
    expect(svgOf(icon)).toBeNull();
    expect(errors).toHaveBeenCalledTimes(1);
  });

  it('acumula um erro por propriedade invalida', async () => {
    await mount({ name: 'rocket', variant: 'thin', size: 'xl' });
    expect(errors).toHaveBeenCalledTimes(3);
  });

  it('nao deixa fallback visual: nada dentro do shadow root', async () => {
    const icon = await mount({ name: 'rocket', size: 'sm' });
    expect(icon.shadowRoot?.querySelector('*') ?? null).toBeNull();
  });
});

describe('acessibilidade', () => {
  it('sem label o icone e decorativo', async () => {
    const icon = await mount({ name: 'check', size: 'sm' });
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.hasAttribute('role')).toBe(false);
    expect(icon.hasAttribute('aria-label')).toBe(false);
  });

  it('label vazio ou so com espacos e decorativo', async () => {
    for (const label of ['', ' ', '   \t ']) {
      const icon = await mount({ name: 'check', size: 'sm', label: label });
      expect(icon.getAttribute('aria-hidden'), JSON.stringify(label)).toBe('true');
      expect(icon.hasAttribute('role'), JSON.stringify(label)).toBe(false);
    }
  });

  it('label com conteudo nomeia o icone', async () => {
    const icon = await mount({ name: 'magnifying-glass', size: 'sm', label: 'Buscar' });
    expect(icon.getAttribute('role')).toBe('img');
    expect(icon.getAttribute('aria-label')).toBe('Buscar');
    expect(icon.hasAttribute('aria-hidden')).toBe(false);
  });

  it('label e aparado antes de virar nome acessivel', async () => {
    const icon = await mount({ name: 'magnifying-glass', size: 'sm', label: '  Buscar  ' });
    expect(icon.getAttribute('aria-label')).toBe('Buscar');
  });

  it('entrada invalida fica fora da arvore de acessibilidade', async () => {
    const icon = await mount({ name: 'rocket', size: 'sm', label: 'Buscar' });
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.hasAttribute('role')).toBe(false);
  });

  it('o svg interno nunca e anunciado nem focalizavel', async () => {
    const icon = await mount({ name: 'check', size: 'sm', label: 'Concluido' });
    const svg = svgOf(icon);
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    expect(svg?.getAttribute('focusable')).toBe('false');
  });

  it('o label troca de decorativo para nomeado sem recriar o elemento', async () => {
    const icon = await mount({ name: 'check', size: 'sm' });
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    icon.label = 'Concluido';
    await icon.updateComplete;
    expect(icon.getAttribute('role')).toBe('img');
    expect(icon.hasAttribute('aria-hidden')).toBe(false);
  });
});

describe('ausencia de interacao', () => {
  it('nao recebe foco', async () => {
    const icon = await mount({ name: 'check', size: 'sm', label: 'Concluido' });
    expect(icon.hasAttribute('tabindex')).toBe(false);
    icon.focus();
    expect(document.activeElement).not.toBe(icon);
  });

  it('nao expoe slot', async () => {
    const icon = await mount({ name: 'check', size: 'sm' });
    expect(icon.shadowRoot?.querySelector('slot')).toBeNull();
  });

  it('nao intercepta nem inventa evento: o clique chega ao controle em volta', async () => {
    const control = document.createElement('button');
    document.body.append(control);

    const icon = document.createElement('nph-icon');
    icon.setAttribute('name', 'trash-can');
    icon.setAttribute('size', 'sm');
    control.append(icon);
    await icon.updateComplete;

    const onControl: string[] = [];
    control.addEventListener('click', (event) => onControl.push(event.type));

    const onIcon: string[] = [];
    for (const kind of ['change', 'input', 'select', 'toggle', 'nph-icon-click']) {
      icon.addEventListener(kind, () => onIcon.push(kind));
    }

    const svg = icon.shadowRoot?.querySelector('svg');
    svg?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));

    expect(onControl).toEqual(['click']);
    expect(onIcon).toEqual([]);
  });
});

describe('cor e caixa', () => {
  it('o desenho herda currentColor do contexto', async () => {
    const context = document.createElement('div');
    context.style.color = 'rgb(255, 0, 0)';
    document.body.append(context);

    const icon = document.createElement('nph-icon');
    icon.setAttribute('name', 'circle-check');
    icon.setAttribute('size', 'md');
    context.append(icon);
    await icon.updateComplete;

    const path = icon.shadowRoot?.querySelector('path');
    expect(path).not.toBeNull();
    expect(getComputedStyle(path as SVGPathElement).fill).toBe('rgb(255, 0, 0)');
  });

  it('a API reativa e exatamente name, variant, size e label', () => {
    const properties = [...NphIcon.elementProperties.keys()].map(String).sort();
    expect(properties).toEqual(['label', 'name', 'size', 'variant']);
  });

  it('a cor sai de currentColor, nao de propriedade', async () => {
    const icon = await mount({ name: 'check', size: 'sm' });
    expect(svgOf(icon)?.getAttribute('fill')).toBe('currentColor');
  });

  it('eye transborda a caixa quadrada, centralizado e sem reescala', async () => {
    const icon = await mount({ name: 'eye', size: 'sm' });
    const box = icon.getBoundingClientRect();
    const drawing = (svgOf(icon) as SVGSVGElement).getBoundingClientRect();

    expect(Math.round(box.width)).toBe(16);
    expect(Math.round(box.height)).toBe(16);
    /* 576x512 escalado por altura 16 da 18 de largura. */
    expect(Math.round(drawing.width)).toBe(18);
    expect(Math.round(drawing.height)).toBe(16);
    /* Transbordo simetrico: 1px de cada lado. */
    expect(Math.round(box.left - drawing.left)).toBe(1);
    expect(Math.round(drawing.right - box.right)).toBe(1);
  });

  it('icone de largura natural igual a altura nao transborda', async () => {
    const icon = await mount({ name: 'circle-check', size: 'lg' });
    const box = icon.getBoundingClientRect();
    const drawing = (svgOf(icon) as SVGSVGElement).getBoundingClientRect();
    expect(Math.round(box.width)).toBe(24);
    expect(Math.round(drawing.width)).toBe(24);
  });
});
