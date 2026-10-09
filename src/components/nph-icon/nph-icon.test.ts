/**
 * Proof of the `nph-icon` contract.
 *
 * Runs in real Chromium (P21, item 5). The groups below cover what the
 * spec promises: closed core, variant, size by token, invalid input,
 * accessibility, absence of interaction, color inheritance and overflow of
 * the wide icons.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MockInstance } from 'vitest';

import designMd from '../../../design.md?raw';
import '../../tokens/generated/tokens.css';
import { NphIcon } from './nph-icon';
import { NPH_ICON_NAMES } from './nph-icon.icons';
import { faStar as lightStar } from '@fortawesome/pro-light-svg-icons/faStar';

/* `NphIcon` is imported as a value to register the element and for typing. */
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
 * Extracts the `icones_nucleo` names straight from `design.md`. The
 * component map cannot diverge from the source: if the list changes there,
 * this test fails here.
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

describe('element registration', () => {
  it('defines nph-icon exactly once', () => {
    expect(REGISTERED).toBe(NphIcon);
  });
});

describe('closed core of `icones_nucleo` in design.md', () => {
  it('the component map is identical to `icones_nucleo` in design.md', () => {
    const fromDocument = namesFromDesignMd();
    expect(fromDocument.length).toBeGreaterThan(0);
    expect(new Set(fromDocument).size).toBe(fromDocument.length);
    expect([...NPH_ICON_NAMES].sort()).toEqual([...fromDocument].sort());
  });

  it('every core name draws a path', async () => {
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
  it('light is the default when the attribute is absent', async () => {
    const withoutAttribute = await mount({ name: 'star', size: 'sm' });
    const explicit = await mount({ name: 'star', variant: 'light', size: 'sm' });
    expect(pathOf(withoutAttribute)).toBe(pathOf(explicit));
    expect(pathOf(withoutAttribute)).toBe(lightStar.icon[4]);
    expect(errors).not.toHaveBeenCalled();
  });

  it('star accepts solid, with artwork different from light', async () => {
    const light = await mount({ name: 'star', variant: 'light', size: 'sm' });
    const solid = await mount({ name: 'star', variant: 'solid', size: 'sm' });
    expect(svgOf(solid)).not.toBeNull();
    expect(pathOf(solid)).not.toBe(pathOf(light));
    expect(errors).not.toHaveBeenCalled();
  });

  it('circle-info accepts solid, with artwork different from light', async () => {
    const light = await mount({ name: 'circle-info', variant: 'light', size: 'sm' });
    const solid = await mount({ name: 'circle-info', variant: 'solid', size: 'sm' });
    expect(svgOf(solid)).not.toBeNull();
    expect(pathOf(solid)).not.toBe(pathOf(light));
    expect(errors).not.toHaveBeenCalled();
  });

  it('every name accepts solid', async () => {
    for (const name of NPH_ICON_NAMES) {
      const icon = await mount({ name: name, variant: 'solid', size: 'sm' });
      expect(svgOf(icon), name).not.toBeNull();
      icon.remove();
    }
    expect(errors).not.toHaveBeenCalled();
  });

  it('a forbidden family does not render', async () => {
    for (const family of ['thin', 'sharp', 'duotone']) {
      const icon = await mount({ name: 'check', variant: family, size: 'sm' });
      expect(svgOf(icon), family).toBeNull();
    }
    expect(errors).toHaveBeenCalledTimes(3);
  });

  it('regular is not a valid value and has no alias', async () => {
    const icon = await mount({ name: 'check', variant: 'regular', size: 'sm' });
    expect(svgOf(icon)).toBeNull();
    expect(errors).toHaveBeenCalledTimes(1);
  });
});

describe('size', () => {
  it('each size comes from the corresponding semantic token', async () => {
    const expected: Record<string, string> = { sm: '16px', md: '20px', lg: '24px' };
    for (const [size, measure] of Object.entries(expected)) {
      const icon = await mount({ name: 'gear', size: size });
      const style = getComputedStyle(icon);
      expect(style.inlineSize, size).toBe(measure);
      expect(style.blockSize, size).toBe(measure);
    }
    expect(errors).not.toHaveBeenCalled();
  });

  it('is required: without size there is no icon or box', async () => {
    const icon = await mount({ name: 'gear' });
    expect(svgOf(icon)).toBeNull();
    expect(getComputedStyle(icon).display).toBe('none');
    expect(errors).toHaveBeenCalledTimes(1);
  });

  it('a free value does not render', async () => {
    for (const size of ['xl', '16', '16px', '']) {
      const icon = await mount({ name: 'gear', size: size });
      expect(svgOf(icon), size).toBeNull();
    }
    expect(errors).toHaveBeenCalledTimes(4);
  });
});

describe('invalid input', () => {
  it('a name outside the core does not render and complains', async () => {
    for (const name of ['rocket', 'Star', 'fa-star', 'times', '']) {
      const icon = await mount({ name: name, size: 'sm' });
      expect(svgOf(icon), name).toBeNull();
      expect(getComputedStyle(icon).display, name).toBe('none');
    }
    expect(errors).toHaveBeenCalledTimes(5);
  });

  it('a missing name does not render and complains', async () => {
    const icon = await mount({ size: 'sm' });
    expect(svgOf(icon)).toBeNull();
    expect(errors).toHaveBeenCalledTimes(1);
  });

  it('accumulates one error per invalid property', async () => {
    await mount({ name: 'rocket', variant: 'thin', size: 'xl' });
    expect(errors).toHaveBeenCalledTimes(3);
  });

  it('leaves no visual fallback: nothing inside the shadow root', async () => {
    const icon = await mount({ name: 'rocket', size: 'sm' });
    expect(icon.shadowRoot?.querySelector('*') ?? null).toBeNull();
  });
});

describe('accessibility', () => {
  it('without a label the icon is decorative', async () => {
    const icon = await mount({ name: 'check', size: 'sm' });
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.hasAttribute('role')).toBe(false);
    expect(icon.hasAttribute('aria-label')).toBe(false);
  });

  it('an empty or whitespace-only label is decorative', async () => {
    for (const label of ['', ' ', '   \t ']) {
      const icon = await mount({ name: 'check', size: 'sm', label: label });
      expect(icon.getAttribute('aria-hidden'), JSON.stringify(label)).toBe('true');
      expect(icon.hasAttribute('role'), JSON.stringify(label)).toBe(false);
    }
  });

  it('a label with content names the icon', async () => {
    const icon = await mount({ name: 'magnifying-glass', size: 'sm', label: 'Buscar' });
    expect(icon.getAttribute('role')).toBe('img');
    expect(icon.getAttribute('aria-label')).toBe('Buscar');
    expect(icon.hasAttribute('aria-hidden')).toBe(false);
  });

  it('the label is trimmed before becoming the accessible name', async () => {
    const icon = await mount({ name: 'magnifying-glass', size: 'sm', label: '  Buscar  ' });
    expect(icon.getAttribute('aria-label')).toBe('Buscar');
  });

  it('invalid input stays out of the accessibility tree', async () => {
    const icon = await mount({ name: 'rocket', size: 'sm', label: 'Buscar' });
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.hasAttribute('role')).toBe(false);
  });

  it('the inner svg is never announced or focusable', async () => {
    const icon = await mount({ name: 'check', size: 'sm', label: 'Concluido' });
    const svg = svgOf(icon);
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    expect(svg?.getAttribute('focusable')).toBe('false');
  });

  it('the label switches from decorative to named without recreating the element', async () => {
    const icon = await mount({ name: 'check', size: 'sm' });
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    icon.label = 'Concluido';
    await icon.updateComplete;
    expect(icon.getAttribute('role')).toBe('img');
    expect(icon.hasAttribute('aria-hidden')).toBe(false);
  });
});

describe('absence of interaction', () => {
  it('does not receive focus', async () => {
    const icon = await mount({ name: 'check', size: 'sm', label: 'Concluido' });
    expect(icon.hasAttribute('tabindex')).toBe(false);
    icon.focus();
    expect(document.activeElement).not.toBe(icon);
  });

  it('exposes no slot', async () => {
    const icon = await mount({ name: 'check', size: 'sm' });
    expect(icon.shadowRoot?.querySelector('slot')).toBeNull();
  });

  it('neither intercepts nor invents events: the click reaches the surrounding control', async () => {
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

describe('color and box', () => {
  it('the drawing inherits currentColor from the context', async () => {
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

  it('the reactive API is exactly name, variant, size and label', () => {
    const properties = [...NphIcon.elementProperties.keys()].map(String).sort();
    expect(properties).toEqual(['label', 'name', 'size', 'variant']);
  });

  it('the color comes from currentColor, not from a property', async () => {
    const icon = await mount({ name: 'check', size: 'sm' });
    expect(svgOf(icon)?.getAttribute('fill')).toBe('currentColor');
  });

  it('eye overflows the square box, centered and without rescaling', async () => {
    const icon = await mount({ name: 'eye', size: 'sm' });
    const box = icon.getBoundingClientRect();
    const drawing = (svgOf(icon) as SVGSVGElement).getBoundingClientRect();

    expect(Math.round(box.width)).toBe(16);
    expect(Math.round(box.height)).toBe(16);
    /* 576x512 scaled by height 16 gives a width of 18. */
    expect(Math.round(drawing.width)).toBe(18);
    expect(Math.round(drawing.height)).toBe(16);
    /* Symmetric overflow: 1px on each side. */
    expect(Math.round(box.left - drawing.left)).toBe(1);
    expect(Math.round(drawing.right - box.right)).toBe(1);
  });

  it('an icon whose natural width equals its height does not overflow', async () => {
    const icon = await mount({ name: 'circle-check', size: 'lg' });
    const box = icon.getBoundingClientRect();
    const drawing = (svgOf(icon) as SVGSVGElement).getBoundingClientRect();
    expect(Math.round(box.width)).toBe(24);
    expect(Math.round(drawing.width)).toBe(24);
  });
});
