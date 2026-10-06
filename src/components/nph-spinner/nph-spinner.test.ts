/**
 * Tests of `nph-spinner` (P66), in a real browser (P21, item 5): spin, reduced
 * motion and size only exist where there is layout and animation.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cdp } from 'vitest/browser';

import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-spinner.css?raw';
import { NphSpinner } from './nph-spinner';

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

async function mount(properties: Partial<Record<'size' | 'label', string | null>> = {}): Promise<NphSpinner> {
  const element = document.createElement('nph-spinner');
  Object.assign(element, properties);
  document.body.append(element);
  await element.updateComplete;
  return element;
}

function glyphOf(element: NphSpinner): HTMLElement | null {
  return element.shadowRoot?.querySelector<HTMLElement>('nph-icon') ?? null;
}

describe('registration and API', () => {
  it('defines nph-spinner exactly once', () => {
    expect(customElements.get('nph-spinner')).toBe(NphSpinner);
  });

  it('the public API is exactly size and label', () => {
    const declared = [...(NphSpinner as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(new Set(declared)).toEqual(new Set(['size', 'label']));
  });

  it('size is sm by default and reflects to the attribute', async () => {
    const spinner = await mount();
    expect(spinner.size).toBe('sm');
    expect(spinner.getAttribute('size')).toBe('sm');
    spinner.size = 'md';
    await spinner.updateComplete;
    expect(spinner.getAttribute('size')).toBe('md');
  });
});

describe('drawing', () => {
  it('draws the circle-notch of nph-icon, at the same size', async () => {
    for (const size of ['sm', 'md'] as const) {
      const spinner = await mount({ size });
      const glyph = glyphOf(spinner);
      expect(glyph?.getAttribute('name')).toBe('circle-notch');
      expect(glyph?.getAttribute('size')).toBe(size);
      spinner.remove();
    }
  });

  it('size: sm 16 and md 20, square', async () => {
    for (const [size, side] of [['sm', 16], ['md', 20]] as const) {
      const spinner = await mount({ size });
      const box = (glyphOf(spinner) as HTMLElement).getBoundingClientRect();
      expect(box.width, size).toBe(side);
      expect(box.height, size).toBe(side);
      spinner.remove();
    }
  });

  it('the color inherits from the context', async () => {
    const spinner = await mount();
    spinner.style.color = 'rgb(1, 2, 3)';
    const svg = (glyphOf(spinner) as HTMLElement).shadowRoot?.querySelector('svg') as SVGElement;
    expect(getComputedStyle(svg).color).toBe('rgb(1, 2, 3)');
  });
});

describe('motion', () => {
  it('spins by default, with the duration and easing of motion/loop', async () => {
    const spinner = await mount();
    const style = getComputedStyle(glyphOf(spinner) as HTMLElement);
    expect(style.animationName).toBe('nph-spinner-turn');
    expect(style.animationIterationCount).toBe('infinite');
    /* The expected value comes from the token itself: if the loop changes, the test follows. */
    const probe = document.createElement('div');
    probe.style.animationDuration = 'var(--nph-motion-loop-duration)';
    probe.style.animationTimingFunction = 'var(--nph-motion-loop-easing)';
    document.body.append(probe);
    const expected = getComputedStyle(probe);
    expect(expected.animationDuration).not.toBe('0s');
    expect(style.animationDuration).toBe(expected.animationDuration);
    expect(style.animationTimingFunction).toBe(expected.animationTimingFunction);
  });

  it('with reduced motion, the spin stops', async () => {
    const session = cdp();
    try {
      await session.send('Emulation.setEmulatedMedia', {
        features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
      });
      expect(matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(true);
      const spinner = await mount();
      expect(getComputedStyle(glyphOf(spinner) as HTMLElement).animationName).toBe('none');
    } finally {
      /* Back to the test browser's default; `features: []` does not undo it. */
      await session.send('Emulation.setEmulatedMedia', {
        features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }],
      });
    }
    /* The emulation does not leak into the following tests. */
    await vi.waitFor(() => expect(matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(false));
  });
});

describe('semantics and focus', () => {
  it('without label: outside the accessibility tree', async () => {
    for (const label of [null, '', '   ']) {
      const spinner = await mount({ label });
      expect(spinner.getAttribute('aria-hidden'), JSON.stringify(label)).toBe('true');
      expect(spinner.hasAttribute('role')).toBe(false);
      expect(spinner.hasAttribute('aria-label')).toBe(false);
      spinner.remove();
    }
  });

  it('with label: role img and accessible name', async () => {
    const spinner = await mount({ label: '  Salvando o cadastro  ' });
    expect(spinner.getAttribute('role')).toBe('img');
    expect(spinner.getAttribute('aria-label')).toBe('Salvando o cadastro');
    expect(spinner.hasAttribute('aria-hidden')).toBe(false);
  });

  it('does not receive focus and has no focusable element', async () => {
    const spinner = await mount({ label: 'Salvando o cadastro' });
    const before = document.activeElement;
    spinner.focus();
    expect(document.activeElement).toBe(before);
    expect(spinner.hasAttribute('tabindex')).toBe(false);
    expect(spinner.shadowRoot?.querySelectorAll('a, button, input, [tabindex]').length).toBe(0);
  });
});

describe('invalid input', () => {
  it('size outside sm and md: nothing drawn, 0x0, no name, one console.error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const spinner = await mount({ size: 'lg', label: 'Carregando os dados' });
    expect(glyphOf(spinner)).toBeNull();
    const box = spinner.getBoundingClientRect();
    expect(box.width).toBe(0);
    expect(box.height).toBe(0);
    expect(spinner.getAttribute('aria-hidden')).toBe('true');
    expect(spinner.hasAttribute('role')).toBe(false);
    expect(error).toHaveBeenCalledTimes(1);
    expect(String(error.mock.calls[0]?.[0])).toContain('[nph-spinner]');
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');

  it('every custom property in the CSS exists in tokens.css', () => {
    const used = [...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1]);
    expect(used).toEqual(expect.arrayContaining(['--nph-motion-loop-duration', '--nph-motion-loop-easing']));
    for (const name of used) {
      expect(tokensCss, name).toContain(name + ':');
    }
  });

  it('the CSS has no literal design value beyond the 1turn full turn', () => {
    const withoutTurn = cssWithoutComments.replace('rotate(1turn)', '');
    expect(withoutTurn).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(withoutTurn).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/i);
    expect(withoutTurn).not.toMatch(/\d(px|rem|em|ms|s|deg|turn)\b/);
  });
});
