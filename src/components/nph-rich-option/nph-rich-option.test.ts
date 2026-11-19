/**
 * Tests of `nph-rich-option` (DSA-91, P134), in a real browser (P21, item 5).
 *
 * They prove the contract accepted in Figma for the card (frame `6935:11785`, set `6910:6828`):
 * the API, the role and the state held by the card through `ElementInternals`, the control
 * drawn as a visual indicator, the measures and the parts, the click area, the keyboard of the
 * three controls and of the radio group, the form, the states and their precedence, the invalid
 * input, the contract with `nph-field` and the token contract. The rich option of the list is
 * proved in `nph-option.rich.test.ts` and `nph-rich-option.lists.test.ts`.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cdp, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-rich-option.css?raw';
import { NPH_RICH_OPTION_CONTROLS, NphRichOption } from './nph-rich-option';
import '../nph-field/nph-field';
import type { NphField } from '../nph-field/nph-field';

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

const frame = (): Promise<void> => new Promise((resolve) => requestAnimationFrame(() => resolve()));

/** Moves the pointer to a corner of the page, so a hover of an earlier test does not leak into this one. */
async function pointerAway(): Promise<void> {
  const corner = document.createElement('div');
  corner.style.cssText = 'position: fixed; inset-block-end: 0; inset-inline-end: 0; inline-size: 8px; block-size: 8px;';
  document.body.append(corner);
  await userEvent.hover(corner);
  corner.remove();
}

/** Mounts markup in a wide holder and waits for every card to render. */
async function mount(source: string, width = '480px'): Promise<HTMLElement> {
  await pointerAway();
  const holder = document.createElement('div');
  holder.style.inlineSize = width;
  holder.innerHTML = source;
  document.body.append(holder);
  await settle(holder);
  return holder;
}

async function settle(holder: ParentNode): Promise<void> {
  const cards = [...holder.querySelectorAll<NphRichOption>('nph-rich-option')];
  await Promise.all(cards.map((card) => card.updateComplete));
  await frame();
}

function card(holder: ParentNode, index = 0): NphRichOption {
  return holder.querySelectorAll<NphRichOption>('nph-rich-option')[index] as NphRichOption;
}

async function one(attributes = '', width?: string): Promise<NphRichOption> {
  const holder = await mount(`<nph-rich-option text="Annual plan" description="Billed once a year." ${attributes}></nph-rich-option>`, width);
  return card(holder);
}

function part(element: NphRichOption, selector: string): HTMLElement | null {
  return element.shadowRoot?.querySelector<HTMLElement>(selector) ?? null;
}

function resolved(property: string, token: string): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  document.body.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

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

/** Puts the focus on the first card by the keyboard, so the focus ring counts. */
async function enter(): Promise<void> {
  const before = document.createElement('button');
  before.textContent = 'before';
  document.body.prepend(before);
  before.focus();
  await userEvent.tab();
}

interface AxProbe {
  role: string;
  name: string;
  description: string;
  properties: Record<string, unknown>;
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
      properties: Object.fromEntries((own?.properties ?? []).map((property) => [property.name, property.value.value])),
    };
  } finally {
    element.removeAttribute('data-ax-probe');
  }
}

const PLANS = `
  <nph-rich-option control="radio" name="plan" value="monthly" text="Monthly plan" description="Billed every month."></nph-rich-option>
  <nph-rich-option control="radio" name="plan" value="annual" text="Annual plan" description="Billed once a year."></nph-rich-option>
  <nph-rich-option control="radio" name="plan" value="team" text="Team plan" description="For ten people or more."></nph-rich-option>`;

describe('registration and API', () => {
  it('defines nph-rich-option once, with the defaults of the contract', async () => {
    const element = await one();
    expect(customElements.get('nph-rich-option')).toBe(NphRichOption);
    expect(NPH_RICH_OPTION_CONTROLS).toEqual(['checkbox', 'radio', 'switch']);
    expect(element.control).toBe('checkbox');
    expect(element.checked).toBe(false);
    expect(element.disabled).toBe(false);
    expect(element.invalid).toBe(false);
    expect(element.name).toBe('');
    expect(element.value).toBe('on');
    expect(element.icon).toBe('');
    expect(element.shortcut).toBe('');
    expect(element.keyShortcuts).toBe('');
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
  });

  it('the reactive API is exactly the one of the contract', () => {
    const declared = [...(NphRichOption as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()].sort();
    expect(declared).toEqual(['checked', 'control', 'description', 'disabled', 'icon', 'invalid', 'keyShortcuts', 'name', 'shortcut', 'text', 'value'].sort());
  });

  it('control, disabled, invalid, name and value reflect; checked, text and the rest do not', async () => {
    const element = await one('control="radio" name="plan" value="annual" disabled invalid');
    for (const name of ['control', 'disabled', 'invalid', 'name', 'value']) {
      expect(element.hasAttribute(name), name).toBe(true);
    }
    element.checked = true;
    element.icon = 'bell';
    await element.updateComplete;
    expect(element.hasAttribute('checked')).toBe(false);
    expect(element.getAttribute('text')).toBe('Annual plan');
    element.name = '';
    await element.updateComplete;
    expect(element.hasAttribute('name')).toBe(false);
  });

  it('is form-associated, and declares itself an option of nph-field', () => {
    expect((NphRichOption as unknown as { formAssociated: boolean }).formAssociated).toBe(true);
    expect((NphRichOption as unknown as { nphFieldRole: string }).nphFieldRole).toBe('option');
  });

  it('has no part, no slot, no color property and no event of its own', async () => {
    const element = await one('icon="bell" shortcut="K"');
    expect(element.shadowRoot?.querySelectorAll('[part]').length).toBe(0);
    expect(element.shadowRoot?.querySelectorAll('slot').length).toBe(0);
    const declared = [...(NphRichOption as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    for (const name of ['color', 'variant', 'size', 'label']) {
      expect(declared).not.toContain(name);
    }
    const heard: string[] = [];
    for (const name of ['nph-change', 'nph-click', 'nph-focus']) {
      element.addEventListener(name, () => heard.push(name));
    }
    element.click();
    expect(heard).toEqual([]);
  });
});

describe('what the card holds: role, state, name and focus', () => {
  const roles: ReadonlyArray<readonly [string, string]> = [
    ['checkbox', 'checkbox'],
    ['radio', 'radio'],
    ['switch', 'switch'],
  ];
  for (const [control, role] of roles) {
    it(`control ${control}: the card is the ${role}, named by the title and described by the second line`, async () => {
      const element = await one(`control="${control}"`);
      const node = await axNode(element);
      expect(node.role).toBe(role);
      expect(node.name).toBe('Annual plan');
      expect(node.description).toBe('Billed once a year.');
      expect(node.properties.checked).toBe('false');
      element.checked = true;
      await element.updateComplete;
      expect((await axNode(element)).properties.checked).toBe('true');
    });
  }

  it('writes no ARIA attribute on its own host: role and states come from ElementInternals', async () => {
    const element = await one('disabled');
    element.checked = true;
    await element.updateComplete;
    expect([...element.attributes].map((attribute) => attribute.name).filter((name) => name === 'role' || name.startsWith('aria-'))).toEqual([]);
  });

  it('the control drawn inside is a visual indicator: inert, hidden from the screen reader, at its default size', async () => {
    for (const [control, tag] of [
      ['checkbox', 'nph-checkbox'],
      ['radio', 'nph-radio'],
      ['switch', 'nph-switch'],
    ] as const) {
      const element = await one(`control="${control}"`);
      const art = part(element, '.control') as HTMLElement & { checked: boolean; size?: string };
      expect(art.localName).toBe(tag);
      expect(art.hasAttribute('inert')).toBe(true);
      expect(art.getAttribute('aria-hidden')).toBe('true');
      expect(art.size === undefined || art.size === 'default').toBe(true);
      element.checked = true;
      await element.updateComplete;
      expect(art.checked).toBe(true);
      document.body.replaceChildren();
    }
  });

  it('the second line, the icon and the shortcut are hidden from the screen reader', async () => {
    const element = await one('icon="bell" shortcut="⌘ K"');
    for (const name of ['.description', '.icon', '.shortcut']) {
      expect(part(element, name)?.getAttribute('aria-hidden'), name).toBe('true');
    }
  });

  it('the card takes the focus itself: a Tab stop, and the focus stays on the host', async () => {
    const element = await one();
    expect(element.getAttribute('tabindex')).toBe('0');
    await enter();
    expect(document.activeElement).toBe(element);
    expect(element.shadowRoot?.activeElement ?? null).toBeNull();
  });

  it('the control inside never takes the focus', async () => {
    const element = await one('control="radio"');
    const art = part(element, '.control') as HTMLElement;
    art.focus();
    expect(document.activeElement).not.toBe(art);
    expect(element.shadowRoot?.activeElement ?? null).toBeNull();
  });

  it('aria-keyshortcuts only when the product says the key is bound, and never on a disabled card', async () => {
    const element = await one('shortcut="⌘ K"');
    expect(element.matches('[aria-keyshortcuts]')).toBe(false);
    element.keyShortcuts = 'Meta+K';
    await element.updateComplete;
    const internals = (element as unknown as { internals: ElementInternals }).internals;
    expect(internals.ariaKeyShortcuts).toBe('Meta+K');
    element.disabled = true;
    await element.updateComplete;
    expect(internals.ariaKeyShortcuts).toBeNull();
  });

  it('the shortcut draws a hint and binds no key', async () => {
    const element = await one('shortcut="⌘ K"');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }));
    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }));
    expect(element.checked).toBe(false);
  });
});

describe('measures and parts', () => {
  it('has the width of the layout token, the padding, the gap and the corner of the card', async () => {
    const element = await one();
    const style = getComputedStyle(element);
    expect(element.getBoundingClientRect().width).toBe(px('--nph-layout-rich-option-width'));
    expect(style.paddingTop).toBe(`${px('--nph-rich-option-padding')}px`);
    expect(style.paddingLeft).toBe(`${px('--nph-rich-option-padding')}px`);
    expect(style.columnGap).toBe(`${px('--nph-rich-option-gap')}px`);
    expect(style.borderTopLeftRadius).toBe(`${px('--nph-rich-option-radius')}px`);
    expect(style.backgroundColor).toBe(colorOf('--nph-rich-option-background'));
    expect(style.alignItems).toBe('flex-start');
  });

  it('shrinks with its container: on a narrow screen it takes the whole line', async () => {
    const element = await one('', '260px');
    expect(element.getBoundingClientRect().width).toBe(260);
  });

  it('the outline sits inside the card and adds nothing to its box', async () => {
    const element = await one();
    const style = getComputedStyle(element);
    expect(Number.parseFloat(style.outlineWidth)).toBe(px('--nph-rich-option-border-width'));
    expect(style.outlineColor).toBe(colorOf('--nph-rich-option-border'));
    expect(Number.parseFloat(style.outlineOffset)).toBe(-px('--nph-rich-option-border-width'));
    const lines = 2 * px('--nph-rich-option-padding') + px('--nph-text-label-md-line-height');
    expect(element.getBoundingClientRect().height).toBeGreaterThan(lines);
  });

  it('with the second line, the height is the padding, the title, the gap and the caption line, around the 24 touch area', async () => {
    const element = await one();
    const touch = px('--nph-icon-size-sm') + 2 * px('--nph-space-inline-tight');
    const lowered = (touch - px('--nph-text-label-md-line-height')) / 2;
    const texts = lowered + px('--nph-text-label-md-line-height') + px('--nph-rich-option-text-gap') + px('--nph-text-caption-line-height');
    expect(element.getBoundingClientRect().height).toBeCloseTo(2 * px('--nph-rich-option-padding') + Math.max(touch, texts), 1);
  });

  it('with only the title, the card is as tall as the control touch area', async () => {
    const holder = await mount('<nph-rich-option text="Annual plan"></nph-rich-option>');
    const element = card(holder);
    expect(part(element, '.description')).toBeNull();
    const touch = px('--nph-icon-size-sm') + 2 * px('--nph-space-inline-tight');
    expect(element.getBoundingClientRect().height).toBe(2 * px('--nph-rich-option-padding') + touch);
  });

  it('the title is label-md in the foreground color and the second line is caption in the description color', async () => {
    const element = await one();
    const title = part(element, '.title') as HTMLElement;
    const description = part(element, '.description') as HTMLElement;
    expect(Number.parseFloat(getComputedStyle(title).fontSize)).toBe(px('--nph-text-label-md-font-size'));
    expect(getComputedStyle(title).fontWeight).toBe(resolved('font-weight', '--nph-text-label-md-font-weight'));
    expect(getComputedStyle(title).color).toBe(colorOf('--nph-rich-option-foreground'));
    expect(Number.parseFloat(getComputedStyle(description).fontSize)).toBe(px('--nph-text-caption-font-size'));
    expect(getComputedStyle(description).color).toBe(colorOf('--nph-rich-option-description-foreground'));
    expect(description.getBoundingClientRect().top - title.getBoundingClientRect().bottom).toBe(px('--nph-rich-option-text-gap'));
  });

  it('a long title and a long second line wrap and the height grows, with no cut', async () => {
    const holder = await mount(
      '<nph-rich-option text="A very long title for the choice that cannot fit in one line of the card at all" description="A very long second line that explains the consequence of the choice in more words than one line can hold."></nph-rich-option>',
      '320px',
    );
    const element = card(holder);
    const title = part(element, '.title') as HTMLElement;
    const description = part(element, '.description') as HTMLElement;
    expect(title.getBoundingClientRect().height).toBeGreaterThan(px('--nph-text-label-md-line-height') * 1.5);
    expect(description.getBoundingClientRect().height).toBeGreaterThan(px('--nph-text-caption-line-height') * 1.5);
    expect(getComputedStyle(title).textOverflow).not.toBe('ellipsis');
    expect(title.scrollWidth).toBeLessThanOrEqual(title.clientWidth);
  });

  it('the parts run control, icon, texts, shortcut, all at the top', async () => {
    const element = await one('icon="bell" shortcut="⌘ K"');
    const control = part(element, '.control') as HTMLElement;
    const icon = part(element, '.icon') as HTMLElement;
    const texts = part(element, '.texts') as HTMLElement;
    const shortcut = part(element, '.shortcut') as HTMLElement;
    const boxes = [control, icon, texts, shortcut].map((item) => item.getBoundingClientRect());
    for (let index = 1; index < boxes.length; index += 1) {
      expect((boxes[index] as DOMRect).left).toBeGreaterThanOrEqual((boxes[index - 1] as DOMRect).right);
    }
    expect(control.getBoundingClientRect().left - element.getBoundingClientRect().left).toBe(px('--nph-rich-option-padding'));
    expect(icon.getBoundingClientRect().left - control.getBoundingClientRect().right).toBe(px('--nph-rich-option-gap'));
    expect(element.getBoundingClientRect().right - shortcut.getBoundingClientRect().right).toBe(px('--nph-rich-option-padding'));
    expect(control.getBoundingClientRect().top - element.getBoundingClientRect().top).toBe(px('--nph-rich-option-padding'));
    expect(shortcut.getBoundingClientRect().top - element.getBoundingClientRect().top).toBe(px('--nph-rich-option-padding'));
  });

  it('the icon is the box of the icon size in the color of the title, off by default', async () => {
    const plain = await one();
    expect(part(plain, '.icon')).toBeNull();
    document.body.replaceChildren();
    const element = await one('icon="bell"');
    const icon = part(element, '.icon') as HTMLElement;
    expect(icon.getBoundingClientRect().width).toBe(px('--nph-rich-option-icon-size'));
    expect(getComputedStyle(icon).color).toBe(colorOf('--nph-rich-option-foreground'));
    expect(icon.getAttribute('name')).toBe('bell');
  });

  it('the shortcut is one nph-kbd per key, side by side, off by default', async () => {
    const plain = await one();
    expect(part(plain, '.shortcut')).toBeNull();
    document.body.replaceChildren();
    const element = await one('shortcut="⌘ K"');
    const keys = [...(part(element, '.shortcut') as HTMLElement).querySelectorAll('nph-kbd')];
    expect(keys.map((key) => key.getAttribute('text'))).toEqual(['⌘', 'K']);
    const [first, second] = keys.map((key) => key.getBoundingClientRect());
    expect((second as DOMRect).left).toBeGreaterThan((first as DOMRect).right);
    expect((second as DOMRect).top).toBe((first as DOMRect).top);
  });

  it('the first line of the title is centered on the touch area of the control', async () => {
    const element = await one();
    const control = (part(element, '.control') as HTMLElement).getBoundingClientRect();
    const title = (part(element, '.title') as HTMLElement).getBoundingClientRect();
    const touch = px('--nph-icon-size-sm') + 2 * px('--nph-space-inline-tight');
    expect(control.height).toBeGreaterThanOrEqual(touch - 1);
    const lineCenter = title.top + px('--nph-text-label-md-line-height') / 2;
    expect(Math.abs(lineCenter - (control.top + touch / 2))).toBeLessThanOrEqual(1);
  });
});

describe('the whole card is the click area', () => {
  async function clickOn(element: NphRichOption, selector: string): Promise<void> {
    const target = part(element, selector) ?? element;
    await userEvent.click(target);
    await element.updateComplete;
  }

  it('a click on the title, on the second line or on the padding toggles a checkbox card', async () => {
    const element = await one();
    await clickOn(element, '.title');
    expect(element.checked).toBe(true);
    await clickOn(element, '.description');
    expect(element.checked).toBe(false);
    /* The left padding, between the corner and the control. */
    await userEvent.click(element, { position: { x: px('--nph-rich-option-padding') / 2, y: element.getBoundingClientRect().height / 2 } });
    expect(element.checked).toBe(true);
  });

  it('a click where the control is drawn also toggles the card: the control is inert and never takes the click', async () => {
    const element = await one();
    const control = (part(element, '.control') as HTMLElement).getBoundingClientRect();
    const box = element.getBoundingClientRect();
    await userEvent.click(element, { position: { x: control.left - box.left + control.width / 2, y: control.top - box.top + control.height / 2 } });
    expect(element.checked).toBe(true);
    expect(document.elementFromPoint(control.left + control.width / 2, control.top + control.height / 2)).toBe(element);
  });

  it('a switch card turns on and off', async () => {
    const element = await one('control="switch"');
    await clickOn(element, '.title');
    expect(element.checked).toBe(true);
    await clickOn(element, '.title');
    expect(element.checked).toBe(false);
  });

  it('a radio card checks, and a click on the checked card changes nothing and fires nothing', async () => {
    const holder = await mount(PLANS);
    const [monthly, annual] = [card(holder, 0), card(holder, 1)];
    const heard = vi.fn();
    holder.addEventListener('change', heard);
    await clickOn(annual, '.title');
    expect(annual.checked).toBe(true);
    expect(monthly.checked).toBe(false);
    expect(heard).toHaveBeenCalledTimes(1);
    await clickOn(annual, '.title');
    expect(annual.checked).toBe(true);
    expect(heard).toHaveBeenCalledTimes(1);
  });

  it('click() and a label for the card also toggle it', async () => {
    const holder = await mount('<label for="plan-card">Plan</label><nph-rich-option id="plan-card" text="Annual plan"></nph-rich-option>');
    const element = card(holder);
    element.click();
    expect(element.checked).toBe(true);
    (holder.querySelector('label') as HTMLLabelElement).click();
    expect(element.checked).toBe(false);
  });

  it('a click reaches the page once, and the card toggles', async () => {
    const element = await one();
    const seen = vi.fn();
    element.addEventListener('click', seen);
    await userEvent.click(element);
    expect(seen).toHaveBeenCalledTimes(1);
    expect(element.checked).toBe(true);
  });

  it('a disabled card takes no click: nothing changes and the consumer hears nothing', async () => {
    const element = await one('disabled');
    const seen = vi.fn();
    element.addEventListener('click', seen);
    element.addEventListener('change', seen);
    element.click();
    await userEvent.click(element, { force: true });
    expect(element.checked).toBe(false);
    expect(seen).not.toHaveBeenCalled();
  });
});

describe('events', () => {
  it('fires input (bubbles, composed) and then change (bubbles) when the person toggles it', async () => {
    const element = await one();
    const order: string[] = [];
    let input: Event | undefined;
    let change: Event | undefined;
    element.addEventListener('input', (event) => {
      order.push('input');
      input = event;
    });
    element.addEventListener('change', (event) => {
      order.push('change');
      change = event;
    });
    await userEvent.click(element);
    expect(order).toEqual(['input', 'change']);
    expect(input?.bubbles).toBe(true);
    expect(input?.composed).toBe(true);
    expect(change?.bubbles).toBe(true);
    expect(change?.composed).toBe(false);
    expect((input?.target as NphRichOption).checked).toBe(true);
  });

  it('setting checked from code fires nothing', async () => {
    const element = await one();
    const heard = vi.fn();
    element.addEventListener('input', heard);
    element.addEventListener('change', heard);
    element.checked = true;
    await element.updateComplete;
    expect(heard).not.toHaveBeenCalled();
  });
});

describe('the keyboard', () => {
  it('Space toggles a checkbox card and a switch card; Enter checks nothing on the checkbox, as nph-checkbox', async () => {
    const element = await one('control="checkbox"');
    await enter();
    await userEvent.keyboard(' ');
    expect(element.checked).toBe(true);
    await userEvent.keyboard('{Enter}');
    expect(element.checked).toBe(true);
    await userEvent.keyboard(' ');
    expect(element.checked).toBe(false);
  });

  it('Enter toggles a switch card, as nph-switch does, and fires input and change once', async () => {
    const element = await one('control="switch"');
    const heard = vi.fn();
    element.addEventListener('change', heard);
    await enter();
    await userEvent.keyboard('{Enter}');
    expect(element.checked).toBe(true);
    await userEvent.keyboard('{Enter}');
    expect(element.checked).toBe(false);
    expect(heard).toHaveBeenCalledTimes(2);
  });

  it('Enter does not submit the form around a checkbox or radio card: the controls they follow do not either', async () => {
    const holder = await mount(`<form><nph-rich-option name="a" text="A"></nph-rich-option></form>`);
    const submitted = vi.fn((event: Event) => event.preventDefault());
    holder.querySelector('form')?.addEventListener('submit', submitted);
    await enter();
    await userEvent.keyboard('{Enter}');
    expect(submitted).not.toHaveBeenCalled();
    expect(card(holder).checked).toBe(false);
  });

  it('checkbox and switch cards are one Tab stop each, and the arrows do nothing', async () => {
    const holder = await mount(
      '<nph-rich-option text="One"></nph-rich-option><nph-rich-option control="switch" text="Two"></nph-rich-option><nph-rich-option text="Three"></nph-rich-option>',
    );
    const cards = [card(holder, 0), card(holder, 1), card(holder, 2)];
    expect(cards.map((item) => item.getAttribute('tabindex'))).toEqual(['0', '0', '0']);
    await enter();
    expect(document.activeElement).toBe(cards[0]);
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(cards[0]);
    expect(cards.map((item) => item.checked)).toEqual([false, false, false]);
    await userEvent.tab();
    expect(document.activeElement).toBe(cards[1]);
  });

  it('a radio group is one Tab stop, on the first card when none is checked', async () => {
    const holder = await mount(PLANS);
    const cards = [0, 1, 2].map((index) => card(holder, index));
    expect(cards.map((item) => item.getAttribute('tabindex'))).toEqual(['0', '-1', '-1']);
    await enter();
    expect(document.activeElement).toBe(cards[0]);
    await userEvent.tab();
    expect(document.activeElement).not.toBe(cards[1]);
    expect(document.activeElement).not.toBe(cards[2]);
  });

  it('the Tab stop is the checked card, and the arrows move the focus, check, and wrap at the ends', async () => {
    const holder = await mount(PLANS);
    const cards = [0, 1, 2].map((index) => card(holder, index));
    cards[1]!.checked = true;
    await settle(holder);
    expect(cards.map((item) => item.getAttribute('tabindex'))).toEqual(['-1', '0', '-1']);
    await enter();
    expect(document.activeElement).toBe(cards[1]);
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(cards[2]);
    expect(cards.map((item) => item.checked)).toEqual([false, false, true]);
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(cards[0]);
    expect(cards.map((item) => item.checked)).toEqual([true, false, false]);
    await userEvent.keyboard('{ArrowUp}');
    expect(document.activeElement).toBe(cards[2]);
    await userEvent.keyboard('{ArrowLeft}');
    expect(document.activeElement).toBe(cards[1]);
    expect(cards.map((item) => item.checked)).toEqual([false, true, false]);
  });

  it('Space checks the focused radio card and Enter does not', async () => {
    const holder = await mount(PLANS);
    const cards = [0, 1, 2].map((index) => card(holder, index));
    await enter();
    await userEvent.keyboard('{Enter}');
    expect(cards.map((item) => item.checked)).toEqual([false, false, false]);
    await userEvent.keyboard(' ');
    expect(cards.map((item) => item.checked)).toEqual([true, false, false]);
  });

  it('the arrows skip a disabled card, and a disabled card is out of the Tab order', async () => {
    const holder = await mount(PLANS);
    const cards = [0, 1, 2].map((index) => card(holder, index));
    cards[1]!.disabled = true;
    await settle(holder);
    expect(cards[1]!.hasAttribute('tabindex')).toBe(false);
    await enter();
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(cards[2]);
    expect(cards.map((item) => item.checked)).toEqual([false, false, true]);
  });

  it('a disabled card takes no Space', async () => {
    const element = await one('disabled');
    element.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(element.checked).toBe(false);
    expect(element.hasAttribute('tabindex')).toBe(false);
  });
});

describe('the radio group', () => {
  it('cards with the same name and control radio are one group: checking one unchecks the others, from code too', async () => {
    const holder = await mount(PLANS);
    const cards = [0, 1, 2].map((index) => card(holder, index));
    cards[0]!.checked = true;
    cards[2]!.checked = true;
    await settle(holder);
    expect(cards.map((item) => item.checked)).toEqual([false, false, true]);
    expect(cards.map((item) => item.getAttribute('tabindex'))).toEqual(['-1', '-1', '0']);
  });

  it('the cards of another group, or of another control, are not in it', async () => {
    const holder = await mount(
      `${PLANS}<nph-rich-option control="radio" name="other" text="Other"></nph-rich-option><nph-rich-option control="checkbox" name="plan" text="Box"></nph-rich-option>`,
    );
    const cards = [0, 1, 2, 3, 4].map((index) => card(holder, index));
    cards[0]!.checked = true;
    cards[3]!.checked = true;
    cards[4]!.checked = true;
    await settle(holder);
    expect(cards.map((item) => item.checked)).toEqual([true, false, false, true, true]);
  });

  it('a radio card with no name is a group of one', async () => {
    const holder = await mount(
      '<nph-rich-option control="radio" text="One"></nph-rich-option><nph-rich-option control="radio" text="Two"></nph-rich-option>',
    );
    card(holder, 0).checked = true;
    card(holder, 1).checked = true;
    await settle(holder);
    expect([card(holder, 0).checked, card(holder, 1).checked]).toEqual([true, true]);
  });

  it('a card of another root, or of another form, is not in the group', async () => {
    const holder = await mount(`<form>${PLANS}</form>${PLANS}`);
    const cards = [...holder.querySelectorAll<NphRichOption>('nph-rich-option')];
    cards[0]!.checked = true;
    cards[3]!.checked = true;
    await settle(holder);
    expect(cards.map((item) => item.checked)).toEqual([true, false, false, true, false, false]);
  });

  it('a change of name moves the card to the other group, and the group it left finds its Tab stop', async () => {
    const holder = await mount(PLANS);
    const cards = [0, 1, 2].map((index) => card(holder, index));
    cards[0]!.checked = true;
    await settle(holder);
    cards[1]!.checked = true;
    await settle(holder);
    cards[1]!.name = 'other';
    await settle(holder);
    expect(cards[1]!.checked).toBe(true);
    expect(cards.map((item) => item.getAttribute('tabindex'))).toEqual(['0', '0', '-1']);
  });

  it('a card that leaves the page hands the Tab stop to the group', async () => {
    const holder = await mount(PLANS);
    const cards = [0, 1, 2].map((index) => card(holder, index));
    cards[0]!.remove();
    await settle(holder);
    expect(cards[1]!.getAttribute('tabindex')).toBe('0');
    expect(cards[2]!.getAttribute('tabindex')).toBe('-1');
  });

  it('turning the control of a checked card into a radio unchecks the group', async () => {
    const holder = await mount(PLANS);
    const cards = [0, 1, 2].map((index) => card(holder, index));
    cards[0]!.checked = true;
    await settle(holder);
    expect(cards[0]!.checked).toBe(true);
    const box = document.createElement('nph-rich-option') as NphRichOption;
    box.text = 'Box';
    box.name = 'plan';
    box.checked = true;
    holder.append(box);
    await box.updateComplete;
    box.control = 'radio';
    await box.updateComplete;
    expect(cards[0]!.checked).toBe(false);
    expect(box.checked).toBe(true);
  });
});

describe('the form', () => {
  async function form(source: string): Promise<HTMLFormElement> {
    const holder = await mount(`<form>${source}</form>`);
    return holder.querySelector('form') as HTMLFormElement;
  }

  it('a checked checkbox card submits name=value, an unchecked one nothing', async () => {
    const element = await form('<nph-rich-option name="news" value="yes" text="News"></nph-rich-option>');
    expect(new FormData(element).get('news')).toBeNull();
    card(element).checked = true;
    expect(new FormData(element).get('news')).toBe('yes');
    expect(card(element).form).toBe(element);
  });

  it('the value is on by default, and the radio group submits the checked card only', async () => {
    const element = await form(PLANS);
    card(element, 1).checked = true;
    expect(new FormData(element).getAll('plan')).toEqual(['annual']);
    card(element, 0).checked = true;
    expect(new FormData(element).getAll('plan')).toEqual(['monthly']);
    const box = await form('<nph-rich-option name="a" text="A" checked></nph-rich-option>');
    expect(new FormData(box).get('a')).toBe('on');
  });

  it('a switch card is not a form member: it submits nothing', async () => {
    const element = await form('<nph-rich-option control="switch" name="alerts" text="Alerts" checked></nph-rich-option>');
    expect(card(element).checked).toBe(true);
    expect(new FormData(element).get('alerts')).toBeNull();
  });

  it('the checked attribute is the initial state, and a reset goes back to it', async () => {
    const element = await form('<nph-rich-option name="a" text="A" checked></nph-rich-option><nph-rich-option name="b" text="B"></nph-rich-option>');
    const [a, b] = [card(element, 0), card(element, 1)];
    expect([a.checked, b.checked]).toEqual([true, false]);
    a.checked = false;
    b.checked = true;
    element.reset();
    await settle(element);
    expect([a.checked, b.checked]).toEqual([true, false]);
  });

  it('once the person or code changed checked, the attribute no longer moves it', async () => {
    const element = await one();
    element.checked = true;
    element.removeAttribute('checked');
    element.setAttribute('checked', '');
    element.checked = false;
    element.setAttribute('checked', '');
    expect(element.checked).toBe(false);
    const fresh = await one('checked');
    expect(fresh.checked).toBe(true);
    fresh.removeAttribute('checked');
    expect(fresh.checked).toBe(false);
  });

  it('a disabled fieldset disables the card, and it leaves the form data', async () => {
    const holder = await mount('<form><fieldset><nph-rich-option name="a" text="A" checked></nph-rich-option></fieldset></form>');
    const element = card(holder);
    const fieldset = holder.querySelector('fieldset') as HTMLFieldSetElement;
    expect(new FormData(holder.querySelector('form') as HTMLFormElement).get('a')).toBe('on');
    fieldset.disabled = true;
    await settle(holder);
    expect(element.matches(':disabled')).toBe(true);
    expect(element.hasAttribute('tabindex')).toBe(false);
    expect(Number(getComputedStyle(element).opacity)).toBe(Number(resolved('opacity', '--nph-rich-option-disabled-opacity')));
    element.click();
    expect(element.checked).toBe(true);
    expect((await axNode(element)).properties.disabled).toBe(true);
  });

  it('history restoration brings the state back', async () => {
    const element = await one('name="a"');
    element.formStateRestoreCallback('nph-rich-option:checked');
    expect(element.checked).toBe(true);
    element.formStateRestoreCallback('nph-rich-option:unchecked');
    expect(element.checked).toBe(false);
    element.formStateRestoreCallback('on', 'autocomplete');
    expect(element.checked).toBe(true);
  });

  it('a card that is not drawn submits nothing', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const element = await form('<nph-rich-option name="a" checked></nph-rich-option>');
    expect(new FormData(element).get('a')).toBeNull();
  });
});

describe('states', () => {
  const layer = (element: NphRichOption): HTMLElement => part(element, '.layer') as HTMLElement;
  const halo = (element: NphRichOption): HTMLElement => part(element, '.halo') as HTMLElement;

  it('at rest: the resting outline, no layer and no halo', async () => {
    const element = await one();
    expect(getComputedStyle(element).outlineColor).toBe(colorOf('--nph-rich-option-border'));
    expect(getComputedStyle(layer(element)).display).toBe('none');
    expect(getComputedStyle(halo(element)).display).toBe('none');
    expect(getComputedStyle(element).opacity).toBe('1');
  });

  it('checked changes only the control: the outline stays the resting one', async () => {
    const element = await one('checked');
    expect(getComputedStyle(element).outlineColor).toBe(colorOf('--nph-rich-option-border'));
    expect(getComputedStyle(element).backgroundColor).toBe(colorOf('--nph-rich-option-background'));
    expect((part(element, '.control') as unknown as { checked: boolean }).checked).toBe(true);
  });

  it('hover adds the layer under the content at the opacity of the layer, and never changes the outline', async () => {
    const element = await one();
    await userEvent.hover(element);
    const style = getComputedStyle(layer(element));
    expect(style.display).toBe('block');
    expect(style.backgroundColor).toBe(colorOf('--nph-rich-option-background-hover'));
    expect(Number(style.opacity)).toBe(Number(resolved('opacity', '--nph-rich-option-background-hover-opacity')));
    expect(style.zIndex).toBe('-1');
    expect(style.borderTopLeftRadius).toBe(`${px('--nph-rich-option-radius')}px`);
    expect(getComputedStyle(element).opacity).toBe('1');
    expect(getComputedStyle(element).backgroundColor).toBe(colorOf('--nph-rich-option-background'));
    expect(getComputedStyle(element).outlineColor).toBe(colorOf('--nph-rich-option-border'));
    const box = element.getBoundingClientRect();
    expect(layer(element).getBoundingClientRect().width).toBe(box.width);
    expect(layer(element).getBoundingClientRect().height).toBe(box.height);
    const title = (part(element, '.title') as HTMLElement).getBoundingClientRect();
    expect(document.elementFromPoint(title.left + 2, title.top + 2)).toBe(element);
  });

  it('keyboard focus turns the outline into the focus border and draws the halo outside the card', async () => {
    const element = await one();
    await enter();
    expect(getComputedStyle(element).outlineColor).toBe(colorOf('--nph-rich-option-focus-border'));
    const style = getComputedStyle(halo(element));
    expect(style.display).toBe('block');
    expect(Number.parseFloat(style.borderTopWidth)).toBe(px('--nph-rich-option-focus-ring-width'));
    expect(style.borderTopColor).toBe(colorOf('--nph-rich-option-focus-halo'));
    expect(style.borderTopLeftRadius).toBe(`${px('--nph-rich-option-focus-radius')}px`);
    const box = element.getBoundingClientRect();
    const outer = halo(element).getBoundingClientRect();
    expect(box.top - outer.top).toBe(px('--nph-rich-option-focus-ring-width'));
    expect(outer.right - box.right).toBe(px('--nph-rich-option-focus-ring-width'));
    expect(getComputedStyle(element).zIndex).toBe('1');
    expect(box.width).toBe(px('--nph-layout-rich-option-width'));
  });

  it('the keyboard focus keeps the outline of the card: the browser ring does not replace it', async () => {
    const element = await one();
    await enter();
    const style = getComputedStyle(element);
    expect(style.outlineStyle).toBe('solid');
    expect(Number.parseFloat(style.outlineWidth)).toBe(px('--nph-rich-option-border-width'));
    expect(Number.parseFloat(style.outlineOffset)).toBe(-px('--nph-rich-option-border-width'));
  });

  it('a pointer click draws no focus: the focus shows only for the keyboard', async () => {
    const element = await one();
    await userEvent.click(element);
    await element.updateComplete;
    expect(document.activeElement).toBe(element);
    expect(getComputedStyle(halo(element)).display).toBe('none');
    expect(getComputedStyle(element).outlineColor).toBe(colorOf('--nph-rich-option-border'));
  });

  it('the control inside takes no ring of its own while the card has the focus', async () => {
    const element = await one();
    await enter();
    const art = part(element, '.control') as HTMLElement;
    expect(art.matches(':focus-within, :focus-visible')).toBe(false);
    expect(art.shadowRoot?.querySelector(':focus-visible') ?? null).toBeNull();
  });

  it('error turns the outline into the error border and leaves the control at default', async () => {
    const element = await one('invalid');
    expect(getComputedStyle(element).outlineColor).toBe(colorOf('--nph-rich-option-border-error'));
    expect(getComputedStyle(halo(element)).display).toBe('none');
    const art = part(element, '.control') as HTMLElement;
    expect(art.hasAttribute('invalid')).toBe(false);
    expect(element.hasAttribute('aria-invalid')).toBe(false);
  });

  it('error with focus keeps the error outline and draws the halo in the error color', async () => {
    const element = await one('invalid');
    await enter();
    expect(getComputedStyle(element).outlineColor).toBe(colorOf('--nph-rich-option-border-error'));
    const style = getComputedStyle(halo(element));
    expect(style.display).toBe('block');
    expect(style.borderTopColor).toBe(colorOf('--nph-rich-option-focus-halo-error'));
  });

  it('error with hover keeps the error outline and adds the layer; focus with hover keeps the focus outline and the halo', async () => {
    const invalid = await one('invalid');
    await userEvent.hover(invalid);
    expect(getComputedStyle(invalid).outlineColor).toBe(colorOf('--nph-rich-option-border-error'));
    expect(getComputedStyle(layer(invalid)).display).toBe('block');
    document.body.replaceChildren();
    const element = await one();
    await enter();
    await userEvent.hover(element);
    expect(getComputedStyle(element).outlineColor).toBe(colorOf('--nph-rich-option-focus-border'));
    expect(getComputedStyle(halo(element)).display).toBe('block');
    expect(getComputedStyle(layer(element)).display).toBe('block');
  });

  it('disabled: the whole card at its opacity with the resting outline, no hover, no error, no focus', async () => {
    const element = await one('disabled invalid');
    expect(Number(getComputedStyle(element).opacity)).toBe(Number(resolved('opacity', '--nph-rich-option-disabled-opacity')));
    expect(getComputedStyle(element).outlineColor).toBe(colorOf('--nph-rich-option-border'));
    expect(getComputedStyle(element).cursor).toBe('default');
    await userEvent.hover(element, { force: true });
    expect(getComputedStyle(layer(element)).display).toBe('none');
    element.focus();
    expect(getComputedStyle(halo(element)).display).toBe('none');
  });

  it('checked and disabled keep the checked control under the opacity; error and disabled show only the disabled look', async () => {
    const element = await one('disabled checked');
    expect((part(element, '.control') as unknown as { checked: boolean }).checked).toBe(true);
    expect(getComputedStyle(element).outlineColor).toBe(colorOf('--nph-rich-option-border'));
    const invalid = await one('disabled invalid');
    expect(getComputedStyle(invalid).outlineColor).toBe(colorOf('--nph-rich-option-border'));
    const art = part(invalid, '.control') as HTMLElement;
    expect(art.hasAttribute('disabled')).toBe(false);
    expect(getComputedStyle(art).opacity).toBe('1');
  });

  it('the dark scheme uses the same tokens', async () => {
    document.documentElement.setAttribute('data-nph-color-scheme', 'dark');
    const element = await one();
    expect(getComputedStyle(element).backgroundColor).toBe(colorOf('--nph-rich-option-background'));
    await userEvent.hover(element);
    expect(getComputedStyle(layer(element)).backgroundColor).toBe(colorOf('--nph-rich-option-background-hover'));
  });
});

describe('invalid input', () => {
  const cases: ReadonlyArray<readonly [string, string, number]> = [
    ['a control that does not exist', 'control="button"', 1],
    ['an icon outside the core', 'icon="not-a-core-name"', 1],
    ['a shortcut with the switch', 'control="switch" shortcut="K"', 1],
    ['accumulates the causes', 'control="x" icon="y"', 2],
  ];
  for (const [name, attributes, count] of cases) {
    it(`${name}: nothing and ${count} error(s) in development`, async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      const holder = await mount(`<nph-rich-option text="Annual plan" ${attributes}></nph-rich-option>`);
      const element = card(holder);
      expect(error).toHaveBeenCalledTimes(count);
      for (const call of error.mock.calls) {
        expect(String(call[0])).toContain('[nph-rich-option]');
      }
      expect(element.hasAttribute('data-nph-rendered')).toBe(false);
      expect(element.getBoundingClientRect().height).toBe(0);
      expect(element.hasAttribute('tabindex')).toBe(false);
    });
  }

  it('without a text there is no title: nothing and one error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const holder = await mount('<nph-rich-option description="Only the second line."></nph-rich-option>');
    expect(error).toHaveBeenCalledTimes(1);
    expect(card(holder).getBoundingClientRect().height).toBe(0);
  });

  it('changing checked or disabled does not repeat the errors', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const holder = await mount('<nph-rich-option text="Plan" control="x"></nph-rich-option>');
    const element = card(holder);
    element.checked = true;
    element.disabled = true;
    await element.updateComplete;
    expect(error).toHaveBeenCalledTimes(1);
  });

  it('a card that is not drawn takes no click', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const holder = await mount('<nph-rich-option text="Plan" control="x"></nph-rich-option>');
    card(holder).click();
    expect(card(holder).checked).toBe(false);
  });
});

describe('a valid card logs nothing', () => {
  it('no error and no warning, with a radio control inside', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    await mount(PLANS);
    await frame();
    await frame();
    expect(error).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
  });
});

describe('inside nph-field', () => {
  async function field(attributes = ''): Promise<{ field: NphField; cards: NphRichOption[] }> {
    const holder = await mount(`<nph-field label="Plan" ${attributes}>${PLANS}</nph-field>`);
    const element = holder.querySelector('nph-field') as NphField;
    await element.updateComplete;
    await settle(holder);
    return { field: element, cards: [...holder.querySelectorAll<NphRichOption>('nph-rich-option')] };
  }

  it('the field wraps the cards in a group and writes only invalid and disabled on them', async () => {
    const { field: element, cards } = await field('error="Choose a plan."');
    expect(cards.every((item) => item.invalid)).toBe(true);
    expect(cards.every((item) => !item.disabled)).toBe(true);
    expect(cards.every((item) => item.text !== 'Plan')).toBe(true);
    expect(element.shadowRoot?.querySelector('[role="group"], [role="radiogroup"]')).not.toBeNull();
    expect(getComputedStyle(cards[0]!).outlineColor).toBe(colorOf('--nph-rich-option-border-error'));
  });

  it('a disabled field disables the cards and hides the error look', async () => {
    const { cards } = await field('disabled error="Choose a plan."');
    expect(cards.every((item) => item.disabled)).toBe(true);
    expect(getComputedStyle(cards[0]!).outlineColor).toBe(colorOf('--nph-rich-option-border'));
  });

  it('the field message is the written error: the card stays with the outline', async () => {
    const { field: element, cards } = await field('error="Choose a plan."');
    expect(element.shadowRoot?.textContent).toContain('Choose a plan.');
    expect(cards[0]!.hasAttribute('aria-invalid')).toBe(false);
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const used = new Set([...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1] ?? ''));

  it('every custom property in the CSS exists in tokens.css, and these are the ones the evidence names', () => {
    expect(used).toEqual(
      new Set([
        '--nph-rich-option-gap',
        '--nph-layout-rich-option-width',
        '--nph-rich-option-padding',
        '--nph-rich-option-radius',
        '--nph-rich-option-background',
        '--nph-rich-option-border-width',
        '--nph-rich-option-border',
        '--nph-rich-option-foreground',
        '--nph-text-label-md-font-family',
        '--nph-text-label-md-font-size',
        '--nph-text-label-md-font-weight',
        '--nph-text-label-md-line-height',
        '--nph-text-label-md-letter-spacing',
        '--nph-rich-option-background-hover',
        '--nph-rich-option-background-hover-opacity',
        '--nph-rich-option-focus-ring-width',
        '--nph-rich-option-focus-halo',
        '--nph-rich-option-focus-radius',
        '--nph-rich-option-icon-size',
        '--nph-icon-size-sm',
        '--nph-space-inline-tight',
        '--nph-rich-option-text-gap',
        '--nph-rich-option-description-foreground',
        '--nph-text-caption-font-family',
        '--nph-text-caption-font-size',
        '--nph-text-caption-font-weight',
        '--nph-text-caption-line-height',
        '--nph-text-caption-letter-spacing',
        '--nph-rich-option-focus-border',
        '--nph-rich-option-border-error',
        '--nph-rich-option-focus-halo-error',
        '--nph-rich-option-disabled-opacity',
      ]),
    );
    for (const name of used) {
      expect(tokensCss, name).toContain(`${name}:`);
    }
  });

  it('never consumes a core or theme token, and has no literal color, measure or duration', () => {
    expect(componentCss).not.toMatch(/--nph-core-|--nph-theme-/);
    expect(cssWithoutComments).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(cssWithoutComments).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/i);
    expect(cssWithoutComments).not.toMatch(/\d+(\.\d+)?(px|rem|em|ms|s)\b/);
  });

  it('there is no checked border token: the outline does not change when checked', () => {
    expect(tokensCss).not.toContain('--nph-rich-option-border-checked');
  });

  it('the hover layer takes the opacity, never the whole card', () => {
    const card = /:host\(\[data-nph-rendered\]\)\s*\{[^}]*\}/.exec(cssWithoutComments)?.[0] ?? '';
    expect(card).not.toContain('opacity');
  });
});
