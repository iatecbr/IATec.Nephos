/**
 * Tests of `nph-accordion` (P136), in a real browser (P21, item 5): the container, the divider, the blocks and the
 * rules between items only exist where there is layout.
 *
 * They prove the contract accepted in Figma (documentation frame `7428:43770`, set `7227:26169`), recorded in the
 * evidence of the `figma-docs-accepted` gate of DSA-97: the API, the invalid input, the three appearances, the
 * expansion multiple and single with the cases the accepted documentation leaves to the code, what the accordion
 * hands to its items, the Tab order and the keys that do nothing, and the token contract.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import componentCss from './nph-accordion.css?raw';
import {
  NPH_ACCORDION_APPEARANCES,
  NPH_ACCORDION_EXPANSIONS,
  NPH_ACCORDION_REGION_LIMIT,
  NPH_ACCORDION_SIZES,
  NphAccordion,
} from './nph-accordion';
import type { NphAccordionItem } from '../nph-accordion-item/nph-accordion-item';

beforeAll(async () => {
  await document.fonts.load('400 14px "Noto Sans"');
  await document.fonts.load('500 14px "Noto Sans"');
  await document.fonts.ready;
});

afterEach(async () => {
  await userEvent.unhover(document.body).catch(() => {});
  document.body.replaceChildren();
  document.body.setAttribute('tabindex', '-1');
  document.body.focus();
  document.body.removeAttribute('tabindex');
  vi.restoreAllMocks();
});

const frame = (): Promise<void> => new Promise((resolve) => requestAnimationFrame(() => resolve()));

type ItemProps = Partial<Pick<NphAccordionItem, 'open' | 'disabled' | 'persistent' | 'label' | 'indicator'>>;

/** An accordion with one item per entry, each with a title and a paragraph. */
async function mount(
  props: Partial<NphAccordion> = {},
  items: ItemProps[] = [{}, {}, {}],
  width = '36rem',
): Promise<{ accordion: NphAccordion; items: NphAccordionItem[] }> {
  const holder = document.createElement('div');
  holder.style.inlineSize = width;
  const accordion = document.createElement('nph-accordion');
  Object.assign(accordion, props);
  const made = items.map((item, index) => {
    const element = document.createElement('nph-accordion-item');
    Object.assign(element, { label: `Section ${index + 1}`, ...item });
    element.innerHTML = `<p style="margin: 0">Content ${index + 1}</p>`;
    return element;
  });
  accordion.append(...made);
  holder.append(accordion);
  document.body.append(holder);
  await settle(accordion);
  return { accordion, items: made };
}

async function settle(accordion: NphAccordion): Promise<void> {
  await accordion.updateComplete;
  for (const item of accordion.querySelectorAll<NphAccordionItem>('nph-accordion-item')) {
    await item.updateComplete;
    await vi.waitFor(() => {
      const state = item.shadowRoot?.querySelector('.panel')?.getAttribute('data-state') ?? 'open';
      expect(['open', 'closed']).toContain(state);
    });
  }
  await frame();
}

const trigger = (item: NphAccordionItem): HTMLButtonElement => item.shadowRoot?.querySelector('#trigger') as HTMLButtonElement;
const openOf = (items: NphAccordionItem[]): boolean[] => items.map((item) => item.open);

/** A probe in the page that resolves a token the way the browser does, in the scope of the element. */
function resolved(scope: Element, property: string, token: string): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  scope.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

const px = (value: string): number => Number.parseFloat(value);

describe('registration and API', () => {
  it('registers the tag once and exposes the class', () => {
    expect(customElements.get('nph-accordion')).toBe(NphAccordion);
    expect(document.createElement('nph-accordion')).toBeInstanceOf(NphAccordion);
  });

  it('the public API is exactly P136', () => {
    const declared = [...(NphAccordion as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared.sort()).toEqual(['appearance', 'expansion', 'headingLevel', 'size'].sort());
  });

  it('the lists are the values of the accepted contract', () => {
    expect([...NPH_ACCORDION_APPEARANCES]).toEqual(['grouped', 'separated', 'flush']);
    expect([...NPH_ACCORDION_EXPANSIONS]).toEqual(['multiple', 'single']);
    expect([...NPH_ACCORDION_SIZES]).toEqual(['compact', 'default', 'large']);
    expect(NPH_ACCORDION_REGION_LIMIT).toBe(6);
  });

  it('starts grouped, multiple, of the default size and with heading level 3', async () => {
    const { accordion } = await mount();
    expect([accordion.appearance, accordion.expansion, accordion.size, accordion.headingLevel]).toEqual(['grouped', 'multiple', 'default', 3]);
    expect(accordion.getAttribute('appearance')).toBe('grouped');
    expect(accordion.getAttribute('expansion')).toBe('multiple');
    expect(accordion.getAttribute('size')).toBe('default');
  });

  it('`heading-level` is an attribute and `headingLevel` is the property', () => {
    const accordion = document.createElement('nph-accordion');
    accordion.setAttribute('heading-level', '4');
    expect(accordion.headingLevel).toBe(4);
  });

  it('declares no part and no color property', () => {
    expect(componentCss).not.toMatch(/::part/);
  });
});

describe('invalid input', () => {
  for (const [name, value, message] of [
    ['appearance', 'card', /appearance "card" does not exist/],
    ['expansion', 'both', /expansion "both" does not exist/],
    ['size', 'huge', /size "huge" does not exist/],
    ['headingLevel', 0, /heading-level "0" does not exist/],
  ] as const) {
    it(`${name} "${value}" draws nothing and says so once, in development`, async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const { accordion, items } = await mount({ [name]: value } as Partial<NphAccordion>);
      expect(accordion.hasAttribute('data-nph-rendered')).toBe(false);
      expect(getComputedStyle(accordion).display).toBe('none');
      expect(items.every((item) => item.getBoundingClientRect().height === 0)).toBe(true);
      accordion.requestUpdate();
      await accordion.updateComplete;
      expect(error.mock.calls.filter(([text]) => message.test(String(text)))).toHaveLength(1);
    });
  }

  it('anything that is not an item is ignored, with a warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { accordion } = await mount();
    const stray = document.createElement('p');
    stray.textContent = 'Not a section';
    accordion.append(stray);
    await settle(accordion);
    await vi.waitFor(() => expect(warn.mock.calls.filter(([text]) => /<p> is not a section/.test(String(text)))).toHaveLength(1));
  });

  it('an accordion with no items draws nothing and says nothing', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { accordion } = await mount({}, []);
    expect(getComputedStyle(accordion).display).not.toBe('none');
    expect(error).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
  });
});

describe('what the accordion hands to its items', () => {
  it('the size reaches every item, and an item never keeps another one', async () => {
    const { accordion, items } = await mount({ size: 'compact' });
    expect(items.map((item) => item.size)).toEqual(['compact', 'compact', 'compact']);
    items[1]!.size = 'large';
    accordion.size = 'large';
    await settle(accordion);
    expect(items.map((item) => item.size)).toEqual(['large', 'large', 'large']);
    expect(items.map((item) => item.getAttribute('size'))).toEqual(['large', 'large', 'large']);
  });

  it('the heading level reaches every item', async () => {
    const { accordion, items } = await mount({ headingLevel: 2 });
    for (const item of items) {
      expect(item.shadowRoot?.querySelector('.heading')?.getAttribute('aria-level')).toBe('2');
    }
    accordion.headingLevel = 4;
    await settle(accordion);
    for (const item of items) {
      expect(item.shadowRoot?.querySelector('.heading')?.getAttribute('aria-level')).toBe('4');
    }
  });

  it('an item added later receives them too', async () => {
    const { accordion } = await mount({ size: 'large', headingLevel: 5 });
    const late = document.createElement('nph-accordion-item');
    late.label = 'Late';
    accordion.append(late);
    await settle(accordion);
    await vi.waitFor(() => expect(late.size).toBe('large'));
    expect(late.headingLevel).toBe(5);
  });

  it('with the multiple expansion and up to six items, every content is a region', async () => {
    const { accordion, items } = await mount({}, Array.from({ length: 6 }, () => ({ open: true })));
    await settle(accordion);
    expect(items.every((item) => item.region)).toBe(true);
    expect(items.every((item) => item.shadowRoot?.querySelector('#content')?.getAttribute('role') === 'region')).toBe(true);
  });

  it('with the multiple expansion and more than six items, no content is a region', async () => {
    const { accordion, items } = await mount({}, Array.from({ length: 7 }, () => ({ open: true })));
    await settle(accordion);
    expect(items.every((item) => !item.region)).toBe(true);
    expect(items.every((item) => !item.shadowRoot?.querySelector('#content')?.hasAttribute('role'))).toBe(true);
  });

  it('with the single expansion, only one panel is open at a time, so every content stays a region', async () => {
    const { accordion, items } = await mount({ expansion: 'single' }, Array.from({ length: 8 }, () => ({})));
    await settle(accordion);
    expect(items.every((item) => item.region)).toBe(true);
  });
});

describe('the three appearances', () => {
  it('grouped: one container with the background, the soft outline, the corner, the padding and the raised shadow', async () => {
    const { accordion } = await mount();
    const style = getComputedStyle(accordion);
    expect(style.backgroundColor).toBe(resolved(accordion, 'background-color', '--nph-accordion-background'));
    expect(style.borderTopColor).toBe(resolved(accordion, 'color', '--nph-accordion-border'));
    expect(style.borderTopWidth).toBe(resolved(accordion, 'width', '--nph-accordion-border-width'));
    expect(style.borderTopLeftRadius).toBe(resolved(accordion, 'border-radius', '--nph-accordion-radius'));
    for (const side of ['Top', 'Right', 'Bottom', 'Left'] as const) {
      expect(style[`padding${side}`], side).toBe(resolved(accordion, 'padding', '--nph-accordion-padding'));
    }
    expect(style.boxShadow).toBe(resolved(accordion, 'box-shadow', '--nph-elevation-raised'));
    expect(style.boxShadow).not.toBe('none');
  });

  it('grouped: the divider is between two items, never before the first or after the last', async () => {
    const { items } = await mount();
    const border = (item: NphAccordionItem): string => getComputedStyle(item).borderTopWidth;
    const width = resolved(items[0]!, 'width', '--nph-border-width');
    expect(border(items[0]!)).toBe('0px');
    expect(border(items[1]!)).toBe(width);
    expect(border(items[2]!)).toBe(width);
    expect(getComputedStyle(items[2]!).borderBottomWidth).toBe('0px');
    expect(getComputedStyle(items[1]!).borderTopColor).toBe(resolved(items[1]!, 'color', '--nph-accordion-divider'));
    expect(getComputedStyle(items[1]!).borderTopStyle).toBe('solid');
  });

  it('grouped: the divider has the divider spacing above and below it, and the width of the item', async () => {
    const { accordion, items } = await mount();
    const spacing = px(resolved(accordion, 'margin', '--nph-accordion-divider-spacing'));
    const second = items[1]!;
    const style = getComputedStyle(second);
    expect(px(style.marginTop)).toBe(spacing);
    expect(px(style.paddingTop)).toBe(spacing);
    const first = items[0]!.getBoundingClientRect();
    const box = second.getBoundingClientRect();
    expect(box.top - first.bottom).toBe(spacing);
    expect(box.width).toBe(first.width);
  });

  it('grouped: the items touch the container only through its padding', async () => {
    const { accordion, items } = await mount();
    const padding = px(resolved(accordion, 'padding', '--nph-accordion-padding'));
    const container = accordion.getBoundingClientRect();
    const border = px(resolved(accordion, 'width', '--nph-accordion-border-width'));
    expect(items[0]!.getBoundingClientRect().top - container.top).toBe(padding + border);
    expect(container.bottom - items[2]!.getBoundingClientRect().bottom).toBe(padding + border);
  });

  it('separated: no container, a block per item with the same background, outline, corner and padding, and no shadow', async () => {
    const { accordion, items } = await mount({ appearance: 'separated' });
    const style = getComputedStyle(accordion);
    expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(style.borderTopWidth).toBe('0px');
    expect(style.boxShadow).toBe('none');
    expect(style.paddingTop).toBe('0px');
    for (const item of items) {
      const block = getComputedStyle(item);
      expect(block.backgroundColor).toBe(resolved(item, 'background-color', '--nph-accordion-background'));
      expect(block.borderTopColor).toBe(resolved(item, 'color', '--nph-accordion-border'));
      expect(block.borderTopWidth).toBe(resolved(item, 'width', '--nph-accordion-border-width'));
      expect(block.borderTopLeftRadius).toBe(resolved(item, 'border-radius', '--nph-accordion-radius'));
      expect(block.paddingTop).toBe(resolved(item, 'padding', '--nph-accordion-padding'));
      expect(block.boxShadow).toBe('none');
    }
  });

  it('separated: the blocks are the item gap apart and no block has a divider', async () => {
    const { accordion, items } = await mount({ appearance: 'separated' });
    const gap = px(resolved(accordion, 'margin', '--nph-accordion-item-gap'));
    expect(items[1]!.getBoundingClientRect().top - items[0]!.getBoundingClientRect().bottom).toBe(gap);
    expect(items[2]!.getBoundingClientRect().top - items[1]!.getBoundingClientRect().bottom).toBe(gap);
    expect(getComputedStyle(items[1]!).marginTop).toBe('0px');
  });

  it('flush: no background, outline, padding or shadow, and the divider between items', async () => {
    const { accordion, items } = await mount({ appearance: 'flush' });
    const style = getComputedStyle(accordion);
    expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(style.borderTopWidth).toBe('0px');
    expect(style.paddingTop).toBe('0px');
    expect(style.boxShadow).toBe('none');
    expect(getComputedStyle(items[0]!).borderTopWidth).toBe('0px');
    expect(getComputedStyle(items[1]!).borderTopWidth).toBe(resolved(items[1]!, 'width', '--nph-border-width'));
    expect(getComputedStyle(items[1]!).borderTopColor).toBe(resolved(items[1]!, 'color', '--nph-accordion-divider'));
  });

  it('flush: the trigger takes the full width of the container', async () => {
    const { accordion, items } = await mount({ appearance: 'flush' });
    expect(trigger(items[0]!).getBoundingClientRect().width).toBe(accordion.getBoundingClientRect().width);
  });

  it('grouped and separated: the hover pill is inset by the container padding', async () => {
    const { accordion, items } = await mount();
    const padding = px(resolved(accordion, 'padding', '--nph-accordion-padding'));
    const border = px(resolved(accordion, 'width', '--nph-accordion-border-width'));
    expect(trigger(items[0]!).getBoundingClientRect().left - accordion.getBoundingClientRect().left).toBe(padding + border);
  });

  it('the width is the width of the container: the accordion has no width of its own', async () => {
    const { accordion } = await mount({}, [{}], '20rem');
    expect(accordion.getBoundingClientRect().width).toBe(320);
  });

  it('a disabled item keeps the divider at full: only the item inside fades', async () => {
    const { items } = await mount({}, [{}, { disabled: true }, {}]);
    expect(getComputedStyle(items[1]!).opacity).toBe('1');
    expect(getComputedStyle(items[1]!).borderTopColor).toBe(resolved(items[1]!, 'color', '--nph-accordion-divider'));
  });
});

describe('the multiple expansion', () => {
  it('each item opens and closes alone, and several stay open at once', async () => {
    const { accordion, items } = await mount();
    await userEvent.click(trigger(items[0]!));
    await userEvent.click(trigger(items[2]!));
    await settle(accordion);
    expect(openOf(items)).toEqual([true, false, true]);
    await userEvent.click(trigger(items[0]!));
    await settle(accordion);
    expect(openOf(items)).toEqual([false, false, true]);
  });

  it('every item may start open', async () => {
    const { items } = await mount({}, [{ open: true }, { open: true }, { open: true }]);
    expect(openOf(items)).toEqual([true, true, true]);
  });
});

describe('the single expansion', () => {
  it('opening an item closes the other, the open one can close, and all closed is allowed', async () => {
    const { accordion, items } = await mount({ expansion: 'single' }, [{ open: true }, {}, {}]);
    await userEvent.click(trigger(items[1]!));
    await settle(accordion);
    expect(openOf(items)).toEqual([false, true, false]);
    await userEvent.click(trigger(items[2]!));
    await settle(accordion);
    expect(openOf(items)).toEqual([false, false, true]);
    await userEvent.click(trigger(items[2]!));
    await settle(accordion);
    expect(openOf(items)).toEqual([false, false, false]);
  });

  it('the item the person opened says so, and the one that closed because of it fires no event', async () => {
    const { accordion, items } = await mount({ expansion: 'single' }, [{ open: true }, {}, {}]);
    const heard: Array<[string, boolean]> = [];
    accordion.addEventListener('nph-toggle', (event) => {
      heard.push([(event.target as NphAccordionItem).label, (event as unknown as CustomEvent<{ open: boolean }>).detail.open]);
    });
    await userEvent.click(trigger(items[1]!));
    await settle(accordion);
    expect(heard).toEqual([['Section 2', true]]);
  });

  it('more than one item open at the start: the first stays open and the others close, with a warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { items } = await mount({ expansion: 'single' }, [{}, { open: true }, { open: true }]);
    await vi.waitFor(() => expect(openOf(items)).toEqual([false, true, false]));
    expect(warn.mock.calls.filter(([text]) => /more than one item is open/.test(String(text)))).toHaveLength(1);
  });

  it('more than one item open when the expansion changes from multiple to single: the same rule', async () => {
    const { accordion, items } = await mount({}, [{ open: true }, { open: true }, { open: true }]);
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    accordion.expansion = 'single';
    await settle(accordion);
    expect(openOf(items)).toEqual([true, false, false]);
  });

  it('and the other way round nothing changes: back to multiple keeps what is open', async () => {
    const { accordion, items } = await mount({ expansion: 'single' }, [{}, { open: true }, {}]);
    accordion.expansion = 'multiple';
    await settle(accordion);
    expect(openOf(items)).toEqual([false, true, false]);
  });

  it('an item that cannot close wins the start over an earlier open item', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { items } = await mount({ expansion: 'single' }, [{ open: true }, { persistent: true }, {}]);
    await vi.waitFor(() => expect(openOf(items)).toEqual([false, true, false]));
    expect(items[1]!.persistent).toBe(true);
  });

  it('an item that cannot close, when another opens: it closes and the mark moves to the item that opened', async () => {
    const { accordion, items } = await mount({ expansion: 'single' }, [{ persistent: true }, {}, {}]);
    expect(openOf(items)).toEqual([true, false, false]);
    expect(trigger(items[0]!).getAttribute('aria-disabled')).toBe('true');
    await userEvent.click(trigger(items[1]!));
    await settle(accordion);
    expect(openOf(items)).toEqual([false, true, false]);
    expect([items[0]!.persistent, items[1]!.persistent]).toEqual([false, true]);
    expect(trigger(items[0]!).hasAttribute('aria-disabled')).toBe(false);
    expect(trigger(items[1]!).getAttribute('aria-disabled')).toBe('true');
    await userEvent.click(trigger(items[0]!));
    await settle(accordion);
    expect(openOf(items)).toEqual([true, false, false]);
  });

  it('a locked section is left as it is: it does not count as the open item and it does not close', async () => {
    const { accordion, items } = await mount({ expansion: 'single' }, [{ open: true, disabled: true }, { open: true }, {}]);
    expect(openOf(items)).toEqual([true, true, false]);
    await userEvent.click(trigger(items[2]!));
    await settle(accordion);
    expect(openOf(items)).toEqual([true, false, true]);
  });

  it('with the multiple expansion the rule does not apply', async () => {
    const { accordion, items } = await mount({}, [{ open: true }, {}, {}]);
    await userEvent.click(trigger(items[1]!));
    await settle(accordion);
    expect(openOf(items)).toEqual([true, true, false]);
  });
});

describe('keyboard', () => {
  it('Tab and Shift+Tab go through the triggers, in page order, and through what an open content holds', async () => {
    const { accordion, items } = await mount({}, [{}, { open: true }, {}]);
    const button = document.createElement('button');
    button.id = 'inner';
    button.textContent = 'Save';
    items[1]!.append(button);
    await settle(accordion);
    await userEvent.tab();
    expect(items[0]!.shadowRoot?.activeElement).toBe(trigger(items[0]!));
    await userEvent.tab();
    expect(items[1]!.shadowRoot?.activeElement).toBe(trigger(items[1]!));
    await userEvent.tab();
    expect(document.activeElement?.id).toBe('inner');
    await userEvent.tab();
    expect(items[2]!.shadowRoot?.activeElement).toBe(trigger(items[2]!));
    await userEvent.tab({ shift: true });
    expect(document.activeElement?.id).toBe('inner');
  });

  it('arrows, Home, End and Esc move nothing and close nothing', async () => {
    const { accordion, items } = await mount({}, [{ open: true }, {}, {}]);
    trigger(items[0]!).focus();
    for (const key of ['{ArrowDown}', '{ArrowUp}', '{Home}', '{End}', '{Escape}']) {
      await userEvent.keyboard(key);
    }
    await settle(accordion);
    expect(items[0]!.shadowRoot?.activeElement).toBe(trigger(items[0]!));
    expect(openOf(items)).toEqual([true, false, false]);
  });

  it('Enter and Space open the focused item and the focus stays on it', async () => {
    const { accordion, items } = await mount();
    trigger(items[1]!).focus();
    await userEvent.keyboard('{Enter}');
    await settle(accordion);
    expect(openOf(items)).toEqual([false, true, false]);
    expect(items[1]!.shadowRoot?.activeElement).toBe(trigger(items[1]!));
    await userEvent.keyboard(' ');
    await settle(accordion);
    expect(openOf(items)).toEqual([false, false, false]);
  });

  it('a disabled item leaves the Tab order', async () => {
    const { items } = await mount({}, [{}, { disabled: true }, {}]);
    await userEvent.tab();
    expect(items[0]!.shadowRoot?.activeElement).toBe(trigger(items[0]!));
    await userEvent.tab();
    expect(items[2]!.shadowRoot?.activeElement).toBe(trigger(items[2]!));
  });
});

describe('token contract', () => {
  it('every token the accepted documentation names for the container is read by the CSS', () => {
    for (const token of [
      '--nph-accordion-background',
      '--nph-accordion-border',
      '--nph-accordion-border-width',
      '--nph-accordion-radius',
      '--nph-accordion-padding',
      '--nph-accordion-divider',
      '--nph-accordion-divider-spacing',
      '--nph-accordion-item-gap',
      '--nph-border-width',
      '--nph-elevation-raised',
    ]) {
      expect(componentCss, token).toContain(`var(${token})`);
    }
  });

  it('the CSS writes no literal color, length, time or font value', () => {
    const code = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
    expect(code).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(code).not.toMatch(/\d(px|rem|em|ms|s)\b/);
    expect(code).not.toMatch(/rgba?\(|hsla?\(/);
  });
});
