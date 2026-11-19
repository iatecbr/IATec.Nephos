/**
 * Tests of the rich look of `nph-option` (DSA-91, P134), in a real browser (P21, item 5).
 *
 * They prove the contract accepted in Figma for the rich option (`nph-select / opção rica`,
 * `6910:7093`): the `rich` and `description` API, the measures, the hover layer at 50 percent,
 * the focus border and the halo only for the option active by the keyboard, the selected option
 * with no background, the disabled option, the description for the screen reader and the token
 * contract of `nph-option.rich.css`. They also prove what the rich look does not change: the plain
 * option keeps the look it had, even when the list writes the keyboard state on it.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cdp } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import richCss from './nph-option.rich.css?raw';
import { NphOption, pointerMoved } from './nph-option';

beforeAll(async () => {
  await document.fonts.load('500 14px "Noto Sans"');
  await document.fonts.load('400 12px "Noto Sans"');
  await document.fonts.ready;
});

afterEach(() => {
  document.body.replaceChildren();
  document.documentElement.removeAttribute('data-nph-color-scheme');
  vi.restoreAllMocks();
});

async function mount(source: string): Promise<NphOption> {
  const holder = document.createElement('div');
  holder.style.inlineSize = 'var(--nph-layout-input-width)';
  holder.innerHTML = source;
  document.body.append(holder);
  const element = holder.querySelector('nph-option') as NphOption;
  await element.updateComplete;
  return element;
}

function resolved(property: string, token: string): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  document.body.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

/** The color a token resolves to, as the browser writes a computed color. */
function colorOf(token: string): string {
  const probe = document.createElement('div');
  probe.style.backgroundColor = `var(${token})`;
  document.body.append(probe);
  const value = getComputedStyle(probe).backgroundColor;
  probe.remove();
  return value;
}

function px(token: string): number {
  return Number.parseFloat(resolved('width', token));
}

function part(element: NphOption, selector: string): HTMLElement | null {
  return element.shadowRoot?.querySelector<HTMLElement>(selector) ?? null;
}

/** The browser keeps the role `option` only inside a listbox, as the lists give it. */
async function mountInListbox(source: string): Promise<NphOption> {
  const holder = document.createElement('div');
  holder.setAttribute('role', 'listbox');
  holder.setAttribute('aria-label', 'Departments');
  holder.style.inlineSize = 'var(--nph-layout-input-width)';
  holder.innerHTML = source;
  document.body.append(holder);
  const element = holder.querySelector('nph-option') as NphOption;
  await element.updateComplete;
  return element;
}

const RICH = 'rich description="Short explanation of the option."';

interface AxProbe {
  role: string;
  name: string;
  description: string;
}

/** The node the browser itself builds for an element in its accessibility tree. */
async function axNode(element: Element): Promise<AxProbe> {
  const session = cdp();
  await session.send('Accessibility.enable');
  element.setAttribute('data-ax-probe', '');
  try {
    await session.send('DOM.getDocument', { depth: -1, pierce: true });
    const { searchId, resultCount } = await session.send('DOM.performSearch', { query: '[data-ax-probe]', includeUserAgentShadowDOM: false });
    expect(resultCount).toBe(1);
    const { nodeIds } = await session.send('DOM.getSearchResults', { searchId, fromIndex: 0, toIndex: 1 });
    await session.send('DOM.discardSearchResults', { searchId });
    const { nodes } = await session.send('Accessibility.getPartialAXTree', { nodeId: nodeIds[0] as number, fetchRelatives: false });
    const own = nodes[0];
    return {
      role: String(own?.role?.value ?? ''),
      name: String(own?.name?.value ?? ''),
      description: String(own?.description?.value ?? ''),
    };
  } finally {
    element.removeAttribute('data-ax-probe');
  }
}

describe('the rich API', () => {
  it('rich and description exist, rich reflects and the plain option is the default', async () => {
    const element = await mount('<nph-option>Finance</nph-option>');
    expect(element.rich).toBe(false);
    expect(element.description).toBe('');
    expect(element.hasAttribute('rich')).toBe(false);
    element.rich = true;
    await element.updateComplete;
    expect(element.hasAttribute('rich')).toBe(true);
  });

  it('keyboard is written by the list and never reflected', async () => {
    const element = await mount(`<nph-option ${RICH}>Finance</nph-option>`);
    expect(element.keyboard).toBe(false);
    element.keyboard = true;
    await element.updateComplete;
    expect(element.matches(':state(keyboard)')).toBe(true);
    expect(element.hasAttribute('keyboard')).toBe(false);
    element.keyboard = false;
    expect(element.matches(':state(keyboard)')).toBe(false);
  });

  it('draws the description only with rich', async () => {
    const plain = await mount('<nph-option description="Short explanation.">Finance</nph-option>');
    expect(part(plain, '.description')).toBeNull();
    document.body.replaceChildren();
    const rich = await mount(`<nph-option ${RICH}>Finance</nph-option>`);
    expect(part(rich, '.description')?.textContent).toBe('Short explanation of the option.');
  });

  it('rich with no description is valid: the description line is off', async () => {
    const element = await mount('<nph-option rich>Finance</nph-option>');
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
    expect(part(element, '.description')).toBeNull();
  });

  it('pointerMoved tells a real move from the position the browser repeats', () => {
    const at = (x: number, y: number): PointerEvent => new PointerEvent('pointermove', { clientX: x, clientY: y });
    expect(pointerMoved(null, at(1, 1))).toBe(true);
    expect(pointerMoved([1, 1], at(1, 1))).toBe(false);
    expect(pointerMoved([1, 1], at(2, 1))).toBe(true);
    expect(pointerMoved([1, 1], at(1, 2))).toBe(true);
  });
});

describe('measures and parts', () => {
  it('the option with a description is the padding, the label line, the gap and the caption line', async () => {
    const element = await mount(`<nph-option ${RICH}>Finance</nph-option>`);
    const expected =
      2 * px('--nph-select-option-padding') + px('--nph-text-label-md-line-height') + px('--nph-select-option-text-gap') + px('--nph-text-caption-line-height');
    expect(element.getBoundingClientRect().height).toBeCloseTo(expected, 1);
  });

  it('the rich option with no description measures what the plain option measures', async () => {
    const plain = await mount('<nph-option>Finance</nph-option>');
    const plainHeight = plain.getBoundingClientRect().height;
    document.body.replaceChildren();
    const rich = await mount('<nph-option rich>Finance</nph-option>');
    expect(rich.getBoundingClientRect().height).toBeCloseTo(plainHeight, 1);
  });

  it('the description is caption text in the description color, and it wraps', async () => {
    const element = await mount(
      '<nph-option rich description="A much longer explanation that does not fit on one line of the list, so the description wraps into more lines.">Finance</nph-option>',
    );
    const description = part(element, '.description') as HTMLElement;
    const style = getComputedStyle(description);
    expect(Number.parseFloat(style.fontSize)).toBe(px('--nph-text-caption-font-size'));
    expect(style.fontWeight).toBe(resolved('font-weight', '--nph-text-caption-font-weight'));
    expect(style.color).toBe(colorOf('--nph-select-option-description-foreground'));
    expect(style.whiteSpace).not.toBe('nowrap');
    expect(description.getBoundingClientRect().height).toBeGreaterThan(px('--nph-text-caption-line-height') * 1.5);
  });

  it('the label is cut with an ellipsis on its own line, and the description stays below', async () => {
    const element = await mount(
      `<nph-option rich secondary="@team" description="Short.">A label that is far too long to fit in the width of the list at all, however wide it is</nph-option>`,
    );
    const label = part(element, '.label') as HTMLElement;
    expect(getComputedStyle(label).textOverflow).toBe('ellipsis');
    expect(label.scrollWidth).toBeGreaterThan(label.clientWidth);
    const description = part(element, '.description') as HTMLElement;
    expect(description.getBoundingClientRect().top).toBeGreaterThanOrEqual(label.getBoundingClientRect().bottom);
    expect(getComputedStyle(part(element, '.secondary') as HTMLElement).color).toBe(colorOf('--nph-select-option-secondary-foreground'));
  });

  it('the parts are centered on the vertical axis: start, texts and check', async () => {
    const element = await mount(`<nph-option ${RICH} start="icon">Finance</nph-option>`);
    element.selected = true;
    await element.updateComplete;
    expect(getComputedStyle(element).alignItems).toBe('center');
    expect(getComputedStyle(element).columnGap).toBe(`${px('--nph-select-option-gap')}px`);
    expect(part(element, '.start')?.getBoundingClientRect().width).toBe(px('--nph-select-option-icon-size'));
    expect(part(element, '.check')?.getBoundingClientRect().width).toBe(px('--nph-select-option-marker-size'));
  });

  it('the dot is the option dot size, in a box of the icon size', async () => {
    const element = await mount(`<nph-option ${RICH} start="dot">Finance</nph-option>`);
    expect(part(element, '.dot-box')?.getBoundingClientRect().width).toBe(px('--nph-select-option-icon-size'));
    expect(part(element, '.dot')?.getBoundingClientRect().width).toBe(px('--nph-select-option-dot-size'));
    expect(getComputedStyle(part(element, '.dot') as HTMLElement).backgroundColor).toBe(getComputedStyle(element).color);
  });

  it('the avatar start and the checkbox marker stay as the option has them', async () => {
    const element = await mount(`<nph-option ${RICH} start="avatar" marker="checkbox">Finance</nph-option>`);
    expect(part(element, 'nph-avatar')).not.toBeNull();
    expect(part(element, 'nph-checkbox')?.hasAttribute('inert')).toBe(true);
  });
});

describe('hover, active and keyboard focus', () => {
  const layer = (element: NphOption): HTMLElement => part(element, '.layer') as HTMLElement;

  it('at rest there is no layer, no focus border and no halo', async () => {
    const element = await mount(`<nph-option ${RICH}>Finance</nph-option>`);
    for (const name of ['.layer', '.focus-border', '.focus-halo']) {
      expect(getComputedStyle(part(element, name) as HTMLElement).display, name).toBe('none');
    }
    expect(getComputedStyle(element).backgroundColor).toBe('rgba(0, 0, 0, 0)');
  });

  it('active draws the layer under the content, at the opacity of the layer only', async () => {
    const element = await mount(`<nph-option ${RICH}>Finance</nph-option>`);
    element.active = true;
    await element.updateComplete;
    const style = getComputedStyle(layer(element));
    expect(style.display).toBe('block');
    expect(style.backgroundColor).toBe(colorOf('--nph-select-option-background-hover'));
    expect(Number(style.opacity)).toBe(Number(resolved('opacity', '--nph-select-option-background-hover-opacity')));
    expect(style.zIndex).toBe('-1');
    expect(style.borderTopLeftRadius).toBe(`${px('--nph-select-option-radius')}px`);
    /* The option itself keeps full opacity and no background: the layer carries both. */
    expect(getComputedStyle(element).opacity).toBe('1');
    expect(getComputedStyle(element).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(getComputedStyle(element).color).toBe(colorOf('--nph-select-option-foreground-hover'));
  });

  it('the layer lies inside the option box and over nothing but its own background', async () => {
    const element = await mount(`<nph-option ${RICH}>Finance</nph-option>`);
    element.active = true;
    await element.updateComplete;
    const box = element.getBoundingClientRect();
    const inner = layer(element).getBoundingClientRect();
    expect(inner.top).toBe(box.top);
    expect(inner.height).toBe(box.height);
    expect(inner.width).toBe(box.width);
    const label = part(element, '.label') as HTMLElement;
    const at = document.elementFromPoint(label.getBoundingClientRect().left + 2, label.getBoundingClientRect().top + 2);
    expect(at).toBe(element);
  });

  it('active by the pointer draws no focus border and no halo', async () => {
    const element = await mount(`<nph-option ${RICH}>Finance</nph-option>`);
    element.active = true;
    await element.updateComplete;
    expect(getComputedStyle(part(element, '.focus-border') as HTMLElement).display).toBe('none');
    expect(getComputedStyle(part(element, '.focus-halo') as HTMLElement).display).toBe('none');
    expect(getComputedStyle(element).zIndex).toBe('auto');
  });

  it('active by the keyboard draws the 1 px focus border and the 4 px halo outside, over its neighbors', async () => {
    const element = await mount(`<nph-option ${RICH}>Finance</nph-option>`);
    element.active = true;
    element.keyboard = true;
    await element.updateComplete;
    const border = part(element, '.focus-border') as HTMLElement;
    const halo = part(element, '.focus-halo') as HTMLElement;
    const borderStyle = getComputedStyle(border);
    const haloStyle = getComputedStyle(halo);
    expect(borderStyle.display).toBe('block');
    expect(Number.parseFloat(borderStyle.borderTopWidth)).toBe(px('--nph-select-option-focus-border-width'));
    expect(borderStyle.borderTopColor).toBe(colorOf('--nph-select-option-focus-border'));
    expect(borderStyle.borderTopLeftRadius).toBe(`${px('--nph-select-option-focus-border-radius')}px`);
    expect(Number.parseFloat(haloStyle.borderTopWidth)).toBe(px('--nph-select-option-focus-halo-width'));
    expect(haloStyle.borderTopColor).toBe(colorOf('--nph-select-option-focus-halo'));
    expect(haloStyle.borderTopLeftRadius).toBe(`${px('--nph-select-option-focus-halo-radius')}px`);
    const box = element.getBoundingClientRect();
    const borderBox = border.getBoundingClientRect();
    const haloBox = halo.getBoundingClientRect();
    expect(box.top - borderBox.top).toBe(px('--nph-select-option-focus-border-width'));
    expect(box.top - haloBox.top).toBe(px('--nph-select-option-focus-border-width') + px('--nph-select-option-focus-halo-width'));
    expect(haloBox.bottom - box.bottom).toBe(px('--nph-select-option-focus-border-width') + px('--nph-select-option-focus-halo-width'));
    expect(getComputedStyle(element).zIndex).toBe('1');
    expect(getComputedStyle(layer(element)).display).toBe('block');
  });

  it('the keyboard state without active draws nothing', async () => {
    const element = await mount(`<nph-option ${RICH}>Finance</nph-option>`);
    element.keyboard = true;
    await element.updateComplete;
    expect(getComputedStyle(part(element, '.focus-border') as HTMLElement).display).toBe('none');
    expect(getComputedStyle(layer(element)).display).toBe('none');
  });

  it('the halo is not a pixel of layout: the option keeps its box', async () => {
    const element = await mount(`<nph-option ${RICH}>Finance</nph-option>`);
    const before = element.getBoundingClientRect();
    element.active = true;
    element.keyboard = true;
    await element.updateComplete;
    const after = element.getBoundingClientRect();
    expect([after.width, after.height, after.top, after.left]).toEqual([before.width, before.height, before.top, before.left]);
  });
});

describe('selected', () => {
  it('has no background: with marker check, only the check in the marker color', async () => {
    const element = await mount(`<nph-option ${RICH}>Finance</nph-option>`);
    element.selected = true;
    await element.updateComplete;
    expect(getComputedStyle(element).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    const check = part(element, '.check') as HTMLElement;
    expect(getComputedStyle(check).color).toBe(colorOf('--nph-select-option-marker'));
    expect(getComputedStyle(element).color).toBe(colorOf('--nph-select-option-foreground'));
  });

  it('with marker checkbox, the checked box and no check', async () => {
    const element = await mount(`<nph-option ${RICH} marker="checkbox">Finance</nph-option>`);
    element.selected = true;
    await element.updateComplete;
    expect(getComputedStyle(element).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(part(element, '.check')).toBeNull();
    expect((part(element, 'nph-checkbox') as unknown as { checked: boolean }).checked).toBe(true);
  });

  it('selected in hover takes the same layer and keeps its check', async () => {
    const element = await mount(`<nph-option ${RICH}>Finance</nph-option>`);
    element.selected = true;
    element.active = true;
    await element.updateComplete;
    expect(getComputedStyle(part(element, '.layer') as HTMLElement).display).toBe('block');
    expect(part(element, '.check')).not.toBeNull();
    expect(getComputedStyle(element).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(getComputedStyle(element).color).toBe(colorOf('--nph-select-option-foreground'));
  });

  it('selected and active by the keyboard also takes the focus border and the halo', async () => {
    const element = await mount(`<nph-option ${RICH}>Finance</nph-option>`);
    element.selected = true;
    element.active = true;
    element.keyboard = true;
    await element.updateComplete;
    expect(getComputedStyle(part(element, '.focus-border') as HTMLElement).display).toBe('block');
    expect(getComputedStyle(part(element, '.focus-halo') as HTMLElement).display).toBe('block');
    expect(part(element, '.check')).not.toBeNull();
  });
});

describe('disabled', () => {
  it('the whole option fades, and the secondary text and the description take the label color', async () => {
    const element = await mount(`<nph-option ${RICH} secondary="@team" disabled>Finance</nph-option>`);
    const style = getComputedStyle(element);
    expect(Number(style.opacity)).toBe(Number(resolved('opacity', '--nph-select-option-disabled-opacity')));
    expect(style.cursor).toBe('default');
    expect(getComputedStyle(part(element, '.secondary') as HTMLElement).color).toBe(colorOf('--nph-select-option-foreground'));
    expect(getComputedStyle(part(element, '.description') as HTMLElement).color).toBe(colorOf('--nph-select-option-foreground'));
    expect(element.getAttribute('aria-disabled')).toBeNull();
  });

  it('draws no layer and no focus even if the list wrote them', async () => {
    const element = await mount(`<nph-option ${RICH} disabled>Finance</nph-option>`);
    element.active = true;
    element.keyboard = true;
    await element.updateComplete;
    for (const name of ['.layer', '.focus-border', '.focus-halo']) {
      expect(getComputedStyle(part(element, name) as HTMLElement).display, name).toBe('none');
    }
  });

  it('selected and disabled keeps only the check, with no background', async () => {
    const element = await mount(`<nph-option ${RICH} disabled>Finance</nph-option>`);
    element.selected = true;
    await element.updateComplete;
    expect(getComputedStyle(element).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(part(element, '.check')).not.toBeNull();
  });

  it('with marker checkbox the box stays at its default state: only the option opacity applies', async () => {
    const element = await mount(`<nph-option ${RICH} marker="checkbox" disabled>Finance</nph-option>`);
    const box = part(element, 'nph-checkbox') as HTMLElement;
    expect(box.hasAttribute('disabled')).toBe(false);
    expect(getComputedStyle(box).opacity).toBe('1');
  });
});

describe('what the screen reader hears', () => {
  it('the label is the name and the description is the description of the option', async () => {
    const element = await mountInListbox(`<nph-option ${RICH}>Finance</nph-option>`);
    const node = await axNode(element);
    expect(node.role).toBe('option');
    expect(node.name).toBe('Finance');
    expect(node.description).toBe('Short explanation of the option.');
  });

  it('the secondary text stays in the name; the description never joins it', async () => {
    const element = await mountInListbox(`<nph-option ${RICH} secondary="@team">Finance</nph-option>`);
    const node = await axNode(element);
    expect(node.name).toBe('Finance @team');
    expect(node.description).toBe('Short explanation of the option.');
  });

  it('a plain option has no description, even with the attribute', async () => {
    const element = await mountInListbox('<nph-option description="Short explanation.">Finance</nph-option>');
    const node = await axNode(element);
    expect(node.name).toBe('Finance');
    expect(node.description).toBe('');
  });

  it('the description follows a change of the text and of rich', async () => {
    const element = await mountInListbox(`<nph-option ${RICH}>Finance</nph-option>`);
    element.description = 'Another sentence.';
    await element.updateComplete;
    expect((await axNode(element)).description).toBe('Another sentence.');
    element.rich = false;
    await element.updateComplete;
    expect((await axNode(element)).description).toBe('');
  });

  it('the layers and the description line are hidden from it', async () => {
    const element = await mountInListbox(`<nph-option ${RICH}>Finance</nph-option>`);
    for (const name of ['.layer', '.focus-border', '.focus-halo', '.description']) {
      expect(part(element, name)?.getAttribute('aria-hidden'), name).toBe('true');
    }
  });
});

describe('what the rich look does not change', () => {
  it('a plain option keeps the full accent when active, with no layer and no ring, even with the keyboard state', async () => {
    const element = await mount('<nph-option>Finance</nph-option>');
    element.active = true;
    element.keyboard = true;
    await element.updateComplete;
    expect(getComputedStyle(element).backgroundColor).toBe(colorOf('--nph-color-accent'));
    expect(getComputedStyle(element).color).toBe(colorOf('--nph-color-accent-foreground'));
    expect(part(element, '.layer')).toBeNull();
    expect(part(element, '.focus-border')).toBeNull();
    expect(part(element, '.focus-halo')).toBeNull();
    expect(getComputedStyle(element).zIndex).toBe('auto');
    expect(getComputedStyle(element).position).toBe('static');
  });

  it('a plain selected option keeps the primary surface and the check in the primary color', async () => {
    const element = await mount('<nph-option>Finance</nph-option>');
    element.selected = true;
    await element.updateComplete;
    expect(getComputedStyle(element).backgroundColor).toBe(colorOf('--nph-color-primary-surface'));
    expect(getComputedStyle(part(element, '.check') as HTMLElement).color).toBe(colorOf('--nph-color-primary'));
  });

  it('a plain option measures 36 with no description and keeps the padding of the inline space', async () => {
    const element = await mount('<nph-option>Finance</nph-option>');
    expect(element.getBoundingClientRect().height).toBe(2 * px('--nph-space-inline') + px('--nph-text-label-md-line-height'));
    expect(getComputedStyle(element).paddingTop).toBe(`${px('--nph-space-inline')}px`);
  });

  it('turning rich off again gives the plain option back', async () => {
    const element = await mount(`<nph-option ${RICH}>Finance</nph-option>`);
    element.rich = false;
    element.active = true;
    await element.updateComplete;
    expect(getComputedStyle(element).backgroundColor).toBe(colorOf('--nph-color-accent'));
    expect(part(element, '.layer')).toBeNull();
  });
});

describe('token contract of the rich look', () => {
  const cssWithoutComments = richCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const used = new Set([...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1] ?? ''));

  it('every custom property in the CSS exists in tokens.css, and these are the ones the evidence names', () => {
    expect(used).toEqual(
      new Set([
        '--nph-select-option-padding',
        '--nph-select-option-gap',
        '--nph-select-option-radius',
        '--nph-select-option-label-gap',
        '--nph-select-option-text-gap',
        '--nph-select-option-background-hover',
        '--nph-select-option-background-hover-opacity',
        '--nph-select-option-disabled-opacity',
        '--nph-select-option-foreground',
        '--nph-select-option-foreground-hover',
        '--nph-select-option-description-foreground',
        '--nph-select-option-secondary-foreground',
        '--nph-select-option-marker',
        '--nph-select-option-icon-size',
        '--nph-select-option-dot-size',
        '--nph-select-option-focus-border',
        '--nph-select-option-focus-border-width',
        '--nph-select-option-focus-border-radius',
        '--nph-select-option-focus-halo',
        '--nph-select-option-focus-halo-width',
        '--nph-select-option-focus-halo-radius',
        '--nph-text-caption-font-family',
        '--nph-text-caption-font-size',
        '--nph-text-caption-font-weight',
        '--nph-text-caption-line-height',
        '--nph-text-caption-letter-spacing',
      ]),
    );
    for (const name of used) {
      expect(tokensCss, name).toContain(`${name}:`);
    }
  });

  it('never consumes a core or theme token, and has no literal color, measure or duration', () => {
    expect(richCss).not.toMatch(/--nph-core-|--nph-theme-/);
    expect(cssWithoutComments).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(cssWithoutComments).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/i);
    expect(cssWithoutComments).not.toMatch(/\d+(\.\d+)?(px|rem|em|ms|s)\b/);
  });

  it('every rule needs the rich attribute, so a plain option never reads it', () => {
    const selectors = [...cssWithoutComments.matchAll(/(^|\})\s*([^{}]+)\{/g)].map((match) => (match[2] ?? '').trim());
    for (const selector of selectors) {
      expect(selector, selector).toContain('[rich');
    }
  });

  it('works in the dark scheme with the same tokens', async () => {
    document.documentElement.setAttribute('data-nph-color-scheme', 'dark');
    const element = await mount(`<nph-option ${RICH}>Finance</nph-option>`);
    element.active = true;
    await element.updateComplete;
    expect(getComputedStyle(part(element, '.layer') as HTMLElement).backgroundColor).toBe(colorOf('--nph-select-option-background-hover'));
  });
});
