/**
 * Tests of `nph-collapsible` (P121), in a real browser (P21, item 5): hover, keyboard focus, the growth
 * of the content, the cut of the preview and the search of the page only exist where there is layout.
 *
 * They prove the contract accepted in Figma (documentation frame `6014:1688`, set `6006:2250`),
 * recorded in the evidence of the `figma-docs-accepted` gate of DSA-78: the API, the invalid input, the
 * roles and names the browser computes, the Tab order, the three types, the appearances, the sizes, the
 * indicator at the end and at the start, the event, the disabled state and the combined states, the
 * growth and the turn of the chevron, the focus, the right-to-left writing and the token contract.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cdp, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-collapsible.css?raw';
import {
  NPH_COLLAPSIBLE_APPEARANCES,
  NPH_COLLAPSIBLE_INDICATORS,
  NPH_COLLAPSIBLE_SIZES,
  NPH_COLLAPSIBLE_TOGGLE_EVENT,
  NPH_COLLAPSIBLE_TYPES,
  NphCollapsible,
  longestDuration,
} from './nph-collapsible';
import type { NphCollapsibleToggleDetail } from './nph-collapsible';
import type { NphButton } from '../nph-button/nph-button';

beforeAll(async () => {
  await document.fonts.load('400 14px "Noto Sans"');
  await document.fonts.load('500 14px "Noto Sans"');
  await document.fonts.ready;
});

/** The listeners a test puts on the page; aborted at the end of each test, so none leaks into the next. */
let listeners = new AbortController();

afterEach(async () => {
  await userEvent.unhover(document.body).catch(() => {});
  listeners.abort();
  listeners = new AbortController();
  document.body.replaceChildren();
  /* A click leaves the starting point of the next Tab where the clicked element was: start from the top. */
  document.body.setAttribute('tabindex', '-1');
  document.body.focus();
  document.body.removeAttribute('tabindex');
  document.documentElement.removeAttribute('dir');
  window.location.hash = '';
  vi.restoreAllMocks();
});

const frame = (): Promise<void> => new Promise((resolve) => requestAnimationFrame(() => resolve()));
const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/** The text a test puts in the content. A paragraph, as a page does. */
const BODY = '<p id="line" style="margin: 0">Billing address, tax number and the order of the invoices.</p>';

/** A collapsible with a title and a paragraph, in a block of its own width. */
async function mount(props: Partial<NphCollapsible> = {}, content: string = BODY, width = '30rem'): Promise<NphCollapsible> {
  const holder = document.createElement('div');
  holder.style.inlineSize = width;
  const piece = document.createElement('nph-collapsible');
  Object.assign(piece, { label: 'Advanced settings', ...props });
  piece.innerHTML = content;
  holder.append(piece);
  document.body.append(holder);
  await settle(piece);
  return piece;
}

/** Lets the piece and what it holds render, and the growth of the content end. */
async function settle(piece: NphCollapsible): Promise<void> {
  await piece.updateComplete;
  for (const inner of piece.shadowRoot?.querySelectorAll('nph-icon, nph-button') ?? []) {
    await (inner as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
  }
  await vi.waitFor(() => {
    const state = piece.shadowRoot?.querySelector('.panel')?.getAttribute('data-state') ?? 'open';
    expect(['open', 'closed']).toContain(state);
  });
  await piece.updateComplete;
  await frame();
}

const root = (piece: NphCollapsible): ShadowRoot => piece.shadowRoot as ShadowRoot;
const trigger = (piece: NphCollapsible): HTMLElement => root(piece).querySelector('#trigger') as HTMLElement;
const content = (piece: NphCollapsible): HTMLElement => root(piece).querySelector('#content') as HTMLElement;
const panel = (piece: NphCollapsible): HTMLElement => root(piece).querySelector('.panel') as HTMLElement;
const nativeOf = (piece: NphCollapsible): HTMLButtonElement =>
  (trigger(piece) as NphButton).shadowRoot?.querySelector('button') as HTMLButtonElement;
const state = (piece: NphCollapsible): string => panel(piece).getAttribute('data-state') ?? '';

/** The events the piece fires, collected until the end of the test. */
function collect(piece: NphCollapsible): NphCollapsibleToggleDetail[] {
  const seen: NphCollapsibleToggleDetail[] = [];
  piece.addEventListener(NPH_COLLAPSIBLE_TOGGLE_EVENT, (event) => seen.push((event as CustomEvent<NphCollapsibleToggleDetail>).detail), {
    signal: listeners.signal,
  });
  return seen;
}

/** A probe in the page that resolves a token the way the browser does, in the scope of the element. */
function resolved(scope: Element, property: string, token: string): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  scope.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

/** The node the browser itself builds for an element in its accessibility tree (as in `nph-stepper`). */
async function axNode(element: Element): Promise<{ role: string; name: string; description: string }> {
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
    const node = nodes[0];
    return {
      role: String(node?.role?.value ?? ''),
      name: String(node?.name?.value ?? ''),
      description: String(node?.description?.value ?? ''),
    };
  } finally {
    element.removeAttribute('data-ax-probe');
  }
}

/** Shows the reduced-motion preference for the length of a function. */
async function withReducedMotion(run: () => Promise<void>): Promise<void> {
  const session = cdp();
  try {
    await session.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    expect(matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(true);
    await run();
  } finally {
    await session.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
  }
  await vi.waitFor(() => expect(matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(false));
}

describe('registration and API', () => {
  it('registers the tag once and exposes the class', () => {
    expect(customElements.get('nph-collapsible')).toBe(NphCollapsible);
    expect(document.createElement('nph-collapsible')).toBeInstanceOf(NphCollapsible);
  });

  it('the public API is exactly P121', () => {
    const declared = [...(NphCollapsible as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()].filter(
      (name) => name !== 'phase',
    );
    expect(declared.sort()).toEqual(
      ['appearance', 'description', 'disabled', 'icon', 'indicator', 'label', 'open', 'openLabel', 'size', 'type'].sort(),
    );
  });

  it('the lists are the values of the accepted contract', () => {
    expect([...NPH_COLLAPSIBLE_TYPES]).toEqual(['line', 'button', 'preview']);
    expect([...NPH_COLLAPSIBLE_APPEARANCES]).toEqual(['flush', 'card']);
    expect([...NPH_COLLAPSIBLE_INDICATORS]).toEqual(['end', 'start']);
    expect([...NPH_COLLAPSIBLE_SIZES]).toEqual(['compact', 'default', 'large']);
  });

  it('starts closed, as a flush line of the default size with the indicator at the end', async () => {
    const piece = await mount();
    expect(piece.open).toBe(false);
    expect([piece.type, piece.appearance, piece.indicator, piece.size, piece.disabled]).toEqual(['line', 'flush', 'end', 'default', false]);
    expect(piece.description).toBe('');
    expect(piece.icon).toBe('');
    expect(piece.hasAttribute('open')).toBe(false);
    expect(trigger(piece).getAttribute('aria-expanded')).toBe('false');
  });

  it('the properties that the internal CSS reads reflect, and the attribute names are the ones of the contract', async () => {
    const piece = await mount({ type: 'button', appearance: 'card', size: 'large', indicator: 'start', open: true, disabled: true });
    for (const name of ['type', 'appearance', 'size', 'indicator']) {
      expect(piece.getAttribute(name), name).toBe(piece[name as 'type']);
    }
    expect(piece.hasAttribute('open')).toBe(true);
    expect(piece.hasAttribute('disabled')).toBe(true);
    piece.open = false;
    await piece.updateComplete;
    expect(piece.hasAttribute('open')).toBe(false);
  });

  it('`open-label` is an attribute and `openLabel` is the property', async () => {
    const piece = document.createElement('nph-collapsible');
    piece.setAttribute('open-label', 'Show less');
    expect(piece.openLabel).toBe('Show less');
  });

  it('declares no part and no color property', () => {
    expect(componentCss).not.toMatch(/::part/);
    expect(Object.keys(NphCollapsible).includes('parts')).toBe(false);
  });

  it('an open attribute before the first render draws the content open at once', async () => {
    const piece = await mount({ open: true });
    expect(state(piece)).toBe('open');
    expect(content(piece).hasAttribute('hidden')).toBe(false);
    expect(piece.getBoundingClientRect().height).toBeGreaterThan(trigger(piece).getBoundingClientRect().height);
  });
});

describe('invalid input', () => {
  const draws = (piece: NphCollapsible): boolean => piece.hasAttribute('data-nph-rendered');

  for (const [name, value, message] of [
    ['type', 'accordion', /type "accordion" does not exist/],
    ['appearance', 'outline', /appearance "outline" does not exist/],
    ['indicator', 'top', /indicator "top" does not exist/],
    ['size', 'huge', /size "huge" does not exist/],
    ['icon', 'not-an-icon', /icon "not-an-icon" is not a core name/],
  ] as const) {
    it(`${name} "${value}" draws nothing and says so once, in development`, async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const piece = await mount({ [name]: value } as Partial<NphCollapsible>);
      expect(draws(piece)).toBe(false);
      expect(root(piece).querySelector('.trigger, nph-button')).toBeNull();
      expect(getComputedStyle(piece).display).toBe('none');
      piece.requestUpdate();
      await piece.updateComplete;
      expect(error).toHaveBeenCalledTimes(1);
      expect(String(error.mock.calls[0]?.[0])).toMatch(message);
      expect(String(error.mock.calls[0]?.[0])).toMatch(/^\[nph-collapsible\]/);
    });
  }

  it('an invalid piece draws again when the input is fixed', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const piece = await mount({ size: 'huge' as 'default' });
    expect(draws(piece)).toBe(false);
    piece.size = 'compact';
    await settle(piece);
    expect(draws(piece)).toBe(true);
    expect(trigger(piece)).not.toBeNull();
  });

  it('no title is a mount: nothing is drawn and nothing is said', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const piece = await mount({ label: '' });
    expect(draws(piece)).toBe(false);
    expect(root(piece).querySelector('.trigger, nph-button')).toBeNull();
    expect(error).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
    piece.label = 'Advanced settings';
    await settle(piece);
    expect(draws(piece)).toBe(true);
  });

  it('a title of blanks is the same as no title', async () => {
    const piece = await mount({ label: '   ' });
    expect(draws(piece)).toBe(false);
  });

  it('in button and preview, the properties of the line type are ignored and warned, once each', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const piece = await mount({ type: 'button', indicator: 'start', size: 'large', description: 'Support', icon: 'gear' });
    expect(draws(piece)).toBe(true);
    expect(trigger(piece).tagName).toBe('NPH-BUTTON');
    expect(trigger(piece).getAttribute('size')).toBe('default');
    expect(root(piece).querySelector('.description, .indent, nph-icon.icon, nph-icon.indicator')).toBeNull();
    piece.requestUpdate();
    await piece.updateComplete;
    const said = warn.mock.calls.map((call) => String(call[0]));
    expect(said).toHaveLength(4);
    for (const name of ['indicator', 'size', 'description', 'icon']) {
      expect(said.filter((message) => message.includes(`${name} is for the line type`))).toHaveLength(1);
    }
  });

  it('in line, `open-label` is ignored and warned: the title does not change', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const piece = await mount({ openLabel: 'Hide', open: true });
    expect(root(piece).querySelector('#title')?.textContent).toBe('Advanced settings');
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0]?.[0])).toMatch(/open-label is for the button and preview types/);
  });

  it('a type change from line to button keeps one message per cause', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const piece = await mount({ size: 'compact' });
    piece.type = 'button';
    await settle(piece);
    piece.type = 'line';
    await settle(piece);
    piece.type = 'button';
    await settle(piece);
    expect(warn).toHaveBeenCalledTimes(1);
  });
});

describe('semantics: the disclosure pattern of the APG', () => {
  it('the trigger is a button with aria-expanded and aria-controls, and its name is the title', async () => {
    const piece = await mount({ description: 'Rarely changed' });
    const button = trigger(piece);
    expect(button.tagName).toBe('BUTTON');
    expect(button.getAttribute('type')).toBe('button');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(root(piece).getElementById(button.getAttribute('aria-controls') as string)).toBe(content(piece));
    const node = await axNode(button);
    expect(node.role).toBe('button');
    expect(node.name).toBe('Advanced settings');
  });

  it('the description is the accessible description and not part of the name', async () => {
    const piece = await mount({ description: 'Rarely changed' });
    const node = await axNode(trigger(piece));
    expect(node.name).toBe('Advanced settings');
    expect(node.description).toBe('Rarely changed');
    expect(trigger(piece).getAttribute('aria-describedby')).toBe('description');
  });

  it('without a description there is no aria-describedby', async () => {
    const piece = await mount();
    expect(trigger(piece).hasAttribute('aria-describedby')).toBe(false);
    expect((await axNode(trigger(piece))).description).toBe('');
  });

  it('the indicator and the start icon are decorative', async () => {
    const piece = await mount({ icon: 'gear', indicator: 'start' });
    for (const icon of root(piece).querySelectorAll('nph-icon')) {
      expect(icon.getAttribute('aria-hidden')).toBe('true');
    }
    expect(root(piece).querySelectorAll('nph-icon')).toHaveLength(2);
  });

  it('aria-expanded follows the state', async () => {
    const piece = await mount();
    piece.open = true;
    await settle(piece);
    expect(trigger(piece).getAttribute('aria-expanded')).toBe('true');
    piece.open = false;
    await settle(piece);
    expect(trigger(piece).getAttribute('aria-expanded')).toBe('false');
  });

  it('the content is not a landmark: no role of its own', async () => {
    const piece = await mount({ open: true });
    expect(content(piece).hasAttribute('role')).toBe(false);
  });
});

describe('behavior', () => {
  it('a click opens and closes, and each change fires `nph-toggle` once with the new state', async () => {
    const piece = await mount();
    const seen = collect(piece);
    await userEvent.click(trigger(piece));
    await settle(piece);
    expect(piece.open).toBe(true);
    await userEvent.click(trigger(piece));
    await settle(piece);
    expect(piece.open).toBe(false);
    expect(seen).toEqual([{ open: true }, { open: false }]);
  });

  it('the event bubbles and crosses the shadow root', async () => {
    const piece = await mount();
    let heard: Event | undefined;
    document.body.addEventListener(NPH_COLLAPSIBLE_TOGGLE_EVENT, (event) => (heard = event), { signal: listeners.signal });
    await userEvent.click(trigger(piece));
    expect(heard?.bubbles).toBe(true);
    expect(heard?.composed).toBe(true);
    expect(heard?.type).toBe('nph-toggle');
  });

  it('a click on any point of the row opens it: the title, the description, the indicator and the padding', async () => {
    const piece = await mount({ description: 'Rarely changed' });
    for (const target of ['.title', '.description', '.indicator', '.trigger']) {
      const element = root(piece).querySelector(target) as HTMLElement;
      const before = piece.open;
      await userEvent.click(element);
      await settle(piece);
      expect(piece.open, target).toBe(!before);
    }
  });

  it('Enter and Space open and close, and the focus stays on the trigger', async () => {
    const piece = await mount();
    const seen = collect(piece);
    await userEvent.tab();
    expect(root(piece).activeElement).toBe(trigger(piece));
    await userEvent.keyboard('{Enter}');
    await settle(piece);
    expect(piece.open).toBe(true);
    expect(root(piece).activeElement).toBe(trigger(piece));
    await userEvent.keyboard(' ');
    await settle(piece);
    expect(piece.open).toBe(false);
    expect(root(piece).activeElement).toBe(trigger(piece));
    expect(seen).toEqual([{ open: true }, { open: false }]);
  });

  it('arrows, Home, End and Escape do nothing', async () => {
    const piece = await mount({ open: true });
    const seen = collect(piece);
    await userEvent.tab();
    for (const key of ['{ArrowDown}', '{ArrowUp}', '{ArrowLeft}', '{ArrowRight}', '{Home}', '{End}', '{Escape}']) {
      await userEvent.keyboard(key);
      expect(piece.open, key).toBe(true);
      expect(root(piece).activeElement, key).toBe(trigger(piece));
    }
    expect(seen).toEqual([]);
  });

  it('a click outside does not close', async () => {
    const piece = await mount({ open: true });
    const outside = document.createElement('button');
    outside.textContent = 'Outside';
    document.body.append(outside);
    await userEvent.click(outside);
    await settle(piece);
    expect(piece.open).toBe(true);
  });

  it('setting `open` from code changes the content and fires nothing', async () => {
    const piece = await mount();
    const seen = collect(piece);
    piece.open = true;
    await settle(piece);
    piece.open = false;
    await settle(piece);
    expect(seen).toEqual([]);
  });

  it('the focus does not jump to the content when it opens', async () => {
    const piece = await mount({}, '<input id="field" aria-label="Tax number" />');
    await userEvent.click(trigger(piece));
    await settle(piece);
    expect(document.activeElement).toBe(piece);
    expect(root(piece).activeElement).toBe(trigger(piece));
  });

  it('Tab goes from the trigger into open content and skips closed content', async () => {
    const piece = await mount({}, '<input id="field" aria-label="Tax number" />');
    const field = piece.querySelector('#field') as HTMLInputElement;
    const after = document.createElement('button');
    after.textContent = 'After';
    document.body.append(after);
    await userEvent.tab();
    await userEvent.tab();
    expect(document.activeElement).toBe(after);
    piece.open = true;
    await settle(piece);
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
    expect(root(piece).activeElement).toBe(trigger(piece));
    await userEvent.tab();
    expect(document.activeElement).toBe(field);
  });

  it('closing from the page with the focus inside the content gives the focus to the trigger', async () => {
    const piece = await mount({ open: true }, '<input id="field" aria-label="Tax number" />');
    (piece.querySelector('#field') as HTMLInputElement).focus();
    expect(document.activeElement?.id).toBe('field');
    piece.open = false;
    await settle(piece);
    expect(root(piece).activeElement).toBe(trigger(piece));
  });

  it('`focus()` on the host goes to the trigger', async () => {
    const piece = await mount();
    piece.focus();
    expect(root(piece).activeElement).toBe(trigger(piece));
  });

  it('a click on the content does not take the focus to the trigger', async () => {
    const piece = await mount({ open: true });
    await userEvent.click(piece.querySelector('#line') as HTMLElement);
    expect(root(piece).activeElement).toBeNull();
  });

  it('the piece with `hidden` takes up no space', async () => {
    const piece = await mount();
    piece.hidden = true;
    await piece.updateComplete;
    expect(getComputedStyle(piece).display).toBe('none');
  });
});

describe('closed content: out of the Tab order and found by the search of the page', () => {
  it('closed content carries hidden until-found and is not rendered; open content carries nothing', async () => {
    const piece = await mount();
    expect(content(piece).getAttribute('hidden')).toBe('until-found');
    expect(getComputedStyle(content(piece)).contentVisibility).toBe('hidden');
    piece.open = true;
    await settle(piece);
    expect(content(piece).hasAttribute('hidden')).toBe(false);
  });

  it('closed content takes no height and has no focusable element in the Tab order', async () => {
    const piece = await mount({}, '<button id="inside">Inside</button>');
    expect(content(piece).getBoundingClientRect().height).toBe(0);
    const inside = piece.querySelector('#inside') as HTMLElement;
    inside.focus();
    expect(document.activeElement).not.toBe(inside);
  });

  it('the `beforematch` of the page search opens the piece and fires `nph-toggle`', async () => {
    const piece = await mount();
    const seen = collect(piece);
    content(piece).removeAttribute('hidden');
    content(piece).dispatchEvent(new Event('beforematch', { bubbles: true }));
    await settle(piece);
    expect(piece.open).toBe(true);
    expect(trigger(piece).getAttribute('aria-expanded')).toBe('true');
    expect(seen).toEqual([{ open: true }]);
  });

  it('after the page search opened it, closing hides the content again (the browser had taken the attribute off)', async () => {
    const piece = await mount();
    content(piece).removeAttribute('hidden');
    content(piece).dispatchEvent(new Event('beforematch', { bubbles: true }));
    await settle(piece);
    piece.open = false;
    await settle(piece);
    expect(content(piece).getAttribute('hidden')).toBe('until-found');
    expect(getComputedStyle(content(piece)).contentVisibility).toBe('hidden');
  });

  it('a `beforematch` on an open piece changes nothing', async () => {
    const piece = await mount({ open: true });
    const seen = collect(piece);
    content(piece).dispatchEvent(new Event('beforematch', { bubbles: true }));
    expect(piece.open).toBe(true);
    expect(seen).toEqual([]);
  });

  it('navigating to a fragment inside the closed content reveals it: the content is found through the slot', async () => {
    const piece = await mount();
    expect(piece.open).toBe(false);
    window.location.hash = '#line';
    await vi.waitFor(() => expect(piece.open).toBe(true), { timeout: 2000 });
    expect(trigger(piece).getAttribute('aria-expanded')).toBe('true');
  });

  it('a disabled closed content is plain hidden: the page search does not open what the person cannot', async () => {
    const piece = await mount({ disabled: true });
    expect(content(piece).getAttribute('hidden')).toBe('hidden');
    expect(getComputedStyle(content(piece)).display).toBe('none');
  });

  it('enabling a disabled closed piece gives its content back to the page search', async () => {
    const piece = await mount({ disabled: true });
    piece.disabled = false;
    await settle(piece);
    expect(content(piece).getAttribute('hidden')).toBe('until-found');
  });
});

describe('disabled', () => {
  it('does not open or close, fires nothing and is not in the Tab order', async () => {
    const piece = await mount({ disabled: true });
    const seen = collect(piece);
    expect((trigger(piece) as HTMLButtonElement).disabled).toBe(true);
    await userEvent.click(trigger(piece), { force: true }).catch(() => {});
    await userEvent.tab();
    expect(root(piece).activeElement).toBeNull();
    expect(piece.open).toBe(false);
    expect(seen).toEqual([]);
  });

  it('fades the whole piece with the disabled opacity, once', async () => {
    const piece = await mount({ disabled: true, appearance: 'card' });
    expect(getComputedStyle(piece).opacity).toBe(resolved(piece, 'opacity', '--nph-collapsible-disabled-opacity'));
    expect(Number(getComputedStyle(piece).opacity)).toBeLessThan(1);
  });

  it('open and disabled keeps the content in view, faded, and the chevron turned', async () => {
    const piece = await mount({ disabled: true, open: true });
    expect(content(piece).hasAttribute('hidden')).toBe(false);
    expect(content(piece).getBoundingClientRect().height).toBeGreaterThan(0);
    expect(trigger(piece).getAttribute('aria-expanded')).toBe('true');
    expect(getComputedStyle(trigger(piece).querySelector('.indicator') as Element).transform).not.toBe('none');
    expect(Number(getComputedStyle(piece).opacity)).toBeLessThan(1);
  });

  it('disabled in the button type: the nph-button does not fade a second time', async () => {
    const piece = await mount({ type: 'button', label: 'Show details', disabled: true });
    const button = trigger(piece) as NphButton;
    expect(button.disabled).toBe(true);
    expect(getComputedStyle(button).opacity).toBe('1');
    expect(Number(getComputedStyle(piece).opacity)).toBeLessThan(1);
  });

  it('a click on a disabled nph-button opens nothing', async () => {
    const piece = await mount({ type: 'button', label: 'Show details', disabled: true });
    const seen = collect(piece);
    nativeOf(piece).click();
    trigger(piece).click();
    await settle(piece);
    expect(piece.open).toBe(false);
    expect(seen).toEqual([]);
  });

  it('disabling the piece while it is open leaves the content open', async () => {
    const piece = await mount({ open: true });
    piece.disabled = true;
    await settle(piece);
    expect(piece.open).toBe(true);
    expect(content(piece).hasAttribute('hidden')).toBe(false);
  });
});

describe('the growth of the content and the turn of the chevron', () => {
  it('opens in the expand duration and curve of the component tokens', async () => {
    const piece = await mount();
    const style = getComputedStyle(panel(piece));
    expect(style.transitionProperty).toBe('grid-template-rows');
    expect(style.transitionDuration).toBe(`${longestDuration(resolved(piece, 'transition-duration', '--nph-collapsible-expand-duration')) / 1000}s`);
    expect(style.transitionTimingFunction).toBe(resolved(piece, 'transition-timing-function', '--nph-collapsible-expand-easing'));
    const icon = getComputedStyle(root(piece).querySelector('.indicator') as Element);
    expect(icon.transitionProperty).toBe('transform');
    expect(icon.transitionDuration).toBe(style.transitionDuration);
  });

  it('animates the height, not the layout position or the opacity: only the rows of the grid and the turn', () => {
    const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
    const properties = [...cssWithoutComments.matchAll(/transition-property:\s*([^;]+);/g)].map((match) => match[1]);
    expect(properties).toEqual(['transform', 'grid-template-rows']);
  });

  it('goes through opening to open, and through closing to closed, and the content is visible while it moves', async () => {
    const piece = await mount();
    piece.open = true;
    await piece.updateComplete;
    expect(state(piece)).toBe('opening');
    expect(content(piece).hasAttribute('hidden')).toBe(false);
    await vi.waitFor(() => expect(state(piece)).toBe('open'), { timeout: 2000 });
    piece.open = false;
    await piece.updateComplete;
    expect(state(piece)).toBe('closing');
    expect(content(piece).hasAttribute('hidden')).toBe(false);
    expect(content(piece).hasAttribute('inert')).toBe(true);
    await vi.waitFor(() => expect(state(piece)).toBe('closed'), { timeout: 2000 });
    expect(content(piece).getAttribute('hidden')).toBe('until-found');
    expect(content(piece).hasAttribute('inert')).toBe(false);
  });

  it('the content grows in height while it opens: it pushes down what comes below and covers nothing', async () => {
    const piece = await mount();
    const below = document.createElement('div');
    below.textContent = 'Below';
    document.body.append(below);
    const top = below.getBoundingClientRect().top;
    piece.open = true;
    await settle(piece);
    expect(below.getBoundingClientRect().top).toBeGreaterThan(top);
    const contentBottom = content(piece).getBoundingClientRect().bottom;
    expect(below.getBoundingClientRect().top).toBeGreaterThanOrEqual(contentBottom);
  });

  it('with reduced motion it opens and closes at once, with no transition', async () => {
    await withReducedMotion(async () => {
      const piece = await mount();
      expect(getComputedStyle(panel(piece)).transitionDuration).toBe('0s');
      piece.open = true;
      await piece.updateComplete;
      expect(state(piece)).toBe('open');
      piece.open = false;
      await piece.updateComplete;
      expect(state(piece)).toBe('closed');
      expect(getComputedStyle(root(piece).querySelector('.indicator') as Element).transitionDuration).toBe('0s');
    });
  });

  it('a piece that is open from the first render does not animate', async () => {
    const piece = await mount({ open: true });
    expect(state(piece)).toBe('open');
    expect(panel(piece).getAnimations()).toHaveLength(0);
  });

  it('changing direction while it moves ends once, in the new direction', async () => {
    const piece = await mount();
    piece.open = true;
    await piece.updateComplete;
    await wait(30);
    piece.open = false;
    await piece.updateComplete;
    expect(state(piece)).toBe('closing');
    await vi.waitFor(() => expect(state(piece)).toBe('closed'), { timeout: 2000 });
    expect(content(piece).getAttribute('hidden')).toBe('until-found');
    piece.open = true;
    await piece.updateComplete;
    piece.open = false;
    await piece.updateComplete;
    piece.open = true;
    await settle(piece);
    expect(state(piece)).toBe('open');
    expect(content(piece).hasAttribute('hidden')).toBe(false);
  });

  it('settles even when the box is not rendered, where no transition ever ends', async () => {
    const piece = await mount();
    (piece.parentElement as HTMLElement).style.display = 'none';
    piece.open = true;
    await piece.updateComplete;
    await vi.waitFor(() => expect(state(piece)).toBe('open'), { timeout: 2000 });
  });

  it('the chevron at the end turns 180 degrees and the one at the start turns 90 degrees, down', async () => {
    const end = await mount();
    const start = await mount({ indicator: 'start' });
    const rotation = (piece: NphCollapsible): number => {
      const matrix = new DOMMatrix(getComputedStyle(root(piece).querySelector('.indicator') as Element).transform);
      return Math.round(Math.atan2(matrix.b, matrix.a) * (180 / Math.PI));
    };
    expect(rotation(end)).toBe(0);
    expect(rotation(start)).toBe(0);
    end.open = true;
    start.open = true;
    await settle(end);
    await settle(start);
    expect(Math.abs(rotation(end))).toBe(180);
    expect(rotation(start)).toBe(90);
    expect(root(end).querySelector('.indicator')?.getAttribute('name')).toBe('chevron-down');
    expect(root(start).querySelector('.indicator')?.getAttribute('name')).toBe('chevron-right');
  });

  it('the open state does not change the background of the trigger', async () => {
    const piece = await mount();
    const closed = getComputedStyle(trigger(piece)).backgroundColor;
    piece.open = true;
    await settle(piece);
    expect(getComputedStyle(trigger(piece)).backgroundColor).toBe(closed);
  });

  it('the preview type does not grow: the cut is lifted and nothing moves', async () => {
    const piece = await mount({ type: 'preview', label: 'Show more', openLabel: 'Show less' });
    expect(root(piece).querySelector('.panel')).toBeNull();
    piece.open = true;
    await piece.updateComplete;
    expect(root(piece).querySelector('.preview-content')?.hasAttribute('data-clamped')).toBe(false);
  });
});

describe('the line type', () => {
  it('the trigger takes the whole width and has the minimum height of its size', async () => {
    for (const [size, token] of [
      ['compact', '--nph-collapsible-trigger-height-compact'],
      ['default', '--nph-collapsible-trigger-height'],
      ['large', '--nph-collapsible-trigger-height-large'],
    ] as const) {
      const piece = await mount({ size });
      const box = trigger(piece).getBoundingClientRect();
      expect(box.width, size).toBe(piece.getBoundingClientRect().width);
      expect(box.height, size).toBeGreaterThanOrEqual(Number.parseFloat(resolved(piece, 'height', token)));
      expect(getComputedStyle(trigger(piece)).minHeight, size).toBe(resolved(piece, 'min-height', token));
    }
  });

  it('the trigger paddings follow the size: compact takes the tight one', async () => {
    const regular = await mount();
    const compact = await mount({ size: 'compact' });
    expect(getComputedStyle(trigger(regular)).paddingTop).toBe(resolved(regular, 'padding-top', '--nph-collapsible-trigger-padding-y'));
    expect(getComputedStyle(trigger(compact)).paddingTop).toBe(resolved(compact, 'padding-top', '--nph-collapsible-trigger-padding-y-compact'));
    expect(getComputedStyle(trigger(regular)).paddingLeft).toBe(resolved(regular, 'padding-left', '--nph-collapsible-trigger-padding-x'));
  });

  it('the title is label-md and label-lg in the large size, the description is body-sm in every size', async () => {
    for (const size of NPH_COLLAPSIBLE_SIZES) {
      const piece = await mount({ size, description: 'Rarely changed' });
      const title = getComputedStyle(root(piece).querySelector('.title') as Element);
      const description = getComputedStyle(root(piece).querySelector('.description') as Element);
      const role = size === 'large' ? 'label-lg' : 'label-md';
      expect(title.fontSize, size).toBe(resolved(piece, 'font-size', `--nph-text-${role}-font-size`));
      expect(title.fontWeight, size).toBe(resolved(piece, 'font-weight', `--nph-text-${role}-font-weight`));
      expect(description.fontSize, size).toBe(resolved(piece, 'font-size', '--nph-text-body-sm-font-size'));
      expect(title.color, size).toBe(resolved(piece, 'color', '--nph-collapsible-title-foreground'));
      expect(description.color, size).toBe(resolved(piece, 'color', '--nph-collapsible-description-foreground'));
    }
  });

  it('the indicator at the end comes after the text; at the start, before it, and before the start icon', async () => {
    const end = await mount({ icon: 'gear' });
    const start = await mount({ icon: 'gear', indicator: 'start' });
    const order = (piece: NphCollapsible): string[] =>
      [...trigger(piece).children].map((child) => (child.classList.contains('text') ? 'text' : (child.className as string)));
    expect(order(end)).toEqual(['icon', 'text', 'indicator']);
    expect(order(start)).toEqual(['indicator', 'icon', 'text']);
  });

  it('the icon and the indicator take their sizes and colors from the component tokens', async () => {
    const piece = await mount({ icon: 'gear', description: 'Rarely changed' });
    for (const [selector, size, color] of [
      ['.indicator', '--nph-collapsible-indicator-size', '--nph-collapsible-indicator-foreground'],
      ['.icon', '--nph-collapsible-icon-size', '--nph-collapsible-icon-foreground'],
    ] as const) {
      const icon = root(piece).querySelector(selector) as HTMLElement;
      const box = icon.getBoundingClientRect();
      expect(box.width, selector).toBe(Number.parseFloat(resolved(piece, 'width', size)));
      expect(getComputedStyle(icon).color, selector).toBe(resolved(piece, 'color', color));
    }
  });

  it('the gap between icon, title and indicator is the trigger gap', async () => {
    const piece = await mount({ icon: 'gear' });
    expect(getComputedStyle(trigger(piece)).columnGap).toBe(resolved(piece, 'column-gap', '--nph-collapsible-trigger-gap'));
    expect(getComputedStyle(root(piece).querySelector('.text') as Element).rowGap).toBe(resolved(piece, 'row-gap', '--nph-collapsible-title-gap'));
  });

  it('the content starts 8 pixels below the trigger, so the focus halo does not touch it', async () => {
    const piece = await mount({ open: true });
    const gap = (piece.querySelector('#line') as HTMLElement).getBoundingClientRect().top - trigger(piece).getBoundingClientRect().bottom;
    expect(gap).toBe(Number.parseFloat(resolved(piece, 'padding-top', '--nph-collapsible-content-padding-top')));
    expect(gap).toBe(8);
    const halo = Number.parseFloat(resolved(piece, 'width', '--nph-collapsible-focus-halo-width'));
    const border = Number.parseFloat(resolved(piece, 'width', '--nph-collapsible-focus-border-width'));
    expect(halo + border).toBeLessThanOrEqual(gap + 1);
  });

  it('the content takes the side and the bottom padding of the tokens, and the gap between its blocks', async () => {
    const piece = await mount({ open: true }, '<p style="margin: 0">One</p><p style="margin: 0">Two</p>');
    const body = root(piece).querySelector('.content') as HTMLElement;
    expect(getComputedStyle(body).paddingLeft).toBe(resolved(piece, 'padding-left', '--nph-collapsible-content-padding-x'));
    expect(getComputedStyle(body).paddingBottom).toBe(resolved(piece, 'padding-bottom', '--nph-collapsible-content-padding-bottom'));
    const [one, two] = [...piece.querySelectorAll('p')] as HTMLElement[];
    const between = (two as HTMLElement).getBoundingClientRect().top - (one as HTMLElement).getBoundingClientRect().bottom;
    expect(between).toBe(Number.parseFloat(resolved(piece, 'height', '--nph-collapsible-content-gap')));
  });

  it('the content lines up with the title: with the indicator at the start and with the start icon, it indents', async () => {
    const piece = await mount({ open: true, indicator: 'start', icon: 'gear' });
    const title = root(piece).querySelector('.title') as HTMLElement;
    expect((piece.querySelector('#line') as HTMLElement).getBoundingClientRect().left).toBe(title.getBoundingClientRect().left);
    const plain = await mount({ open: true });
    const plainTitle = root(plain).querySelector('.title') as HTMLElement;
    expect((plain.querySelector('#line') as HTMLElement).getBoundingClientRect().left).toBe(plainTitle.getBoundingClientRect().left);
    const iconOnly = await mount({ open: true, icon: 'gear' });
    const iconTitle = root(iconOnly).querySelector('.title') as HTMLElement;
    expect((iconOnly.querySelector('#line') as HTMLElement).getBoundingClientRect().left).toBe(iconTitle.getBoundingClientRect().left);
  });

  it('the indent is an empty decorative box and adds nothing to the accessibility tree', async () => {
    const piece = await mount({ open: true, indicator: 'start', icon: 'gear' });
    const indents = [...root(piece).querySelectorAll('.indent')];
    expect(indents).toHaveLength(2);
    for (const indent of indents) {
      expect(indent.getAttribute('aria-hidden')).toBe('true');
      expect(indent.textContent).toBe('');
    }
  });

  it('a long title and description wrap and never overflow the row', async () => {
    const piece = await mount({
      label: 'A very long title that has to wrap inside the narrow row of the trigger without any cut',
      description: 'A long description in the same row that also wraps and keeps the chevron on the end',
      icon: 'gear',
    }, BODY, '16rem');
    const row = trigger(piece).getBoundingClientRect();
    const title = (root(piece).querySelector('.title') as HTMLElement).getBoundingClientRect();
    expect(title.height).toBeGreaterThan(20);
    expect(trigger(piece).scrollWidth).toBeLessThanOrEqual(Math.ceil(row.width));
    const chevron = (root(piece).querySelector('.indicator') as HTMLElement).getBoundingClientRect();
    expect(chevron.right).toBeLessThanOrEqual(row.right);
  });

  it('the piece takes the width of its container', async () => {
    const piece = await mount({}, BODY, '22rem');
    expect(piece.getBoundingClientRect().width).toBe((piece.parentElement as HTMLElement).getBoundingClientRect().width);
  });

  it('several one under the other are separated by the content they hold and nothing else: no divider, no outline', async () => {
    const piece = await mount();
    const style = getComputedStyle(piece.shadowRoot?.querySelector('.root') as Element);
    expect(style.borderTopWidth).toBe('0px');
    expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(componentCss).not.toMatch(/border-bottom|border-top/);
  });
});

describe('the appearance', () => {
  it('flush has no background, no outline and no padding', async () => {
    const piece = await mount({ open: true });
    const style = getComputedStyle(root(piece).querySelector('.root') as Element);
    expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(style.borderTopWidth).toBe('0px');
    expect(style.paddingTop).toBe('0px');
  });

  it('the card has the background, the outline, the corner and the padding of its tokens', async () => {
    const piece = await mount({ appearance: 'card' });
    const style = getComputedStyle(root(piece).querySelector('.root') as Element);
    expect(style.backgroundColor).toBe(resolved(piece, 'background-color', '--nph-collapsible-card-background'));
    expect(style.borderTopColor).toBe(resolved(piece, 'border-top-color', '--nph-collapsible-card-border'));
    expect(style.borderTopWidth).toBe(resolved(piece, 'width', '--nph-collapsible-card-border-width'));
    expect(style.borderTopLeftRadius).toBe(resolved(piece, 'border-top-left-radius', '--nph-collapsible-card-radius'));
    expect(style.paddingTop).toBe(resolved(piece, 'padding-top', '--nph-collapsible-card-padding'));
  });

  it('in the card the hover is a pill inside the card padding, on the trigger only', async () => {
    const piece = await mount({ appearance: 'card' });
    await userEvent.hover(trigger(piece));
    const card = root(piece).querySelector('.root') as HTMLElement;
    const pill = trigger(piece).getBoundingClientRect();
    const outer = card.getBoundingClientRect();
    expect(getComputedStyle(trigger(piece)).backgroundColor).toBe(resolved(piece, 'background-color', '--nph-collapsible-trigger-background-hover'));
    expect(getComputedStyle(card).backgroundColor).toBe(resolved(piece, 'background-color', '--nph-collapsible-card-background'));
    expect(pill.left - outer.left).toBeGreaterThan(Number.parseFloat(getComputedStyle(card).paddingLeft) - 1);
    expect(getComputedStyle(trigger(piece)).borderTopLeftRadius).toBe(resolved(piece, 'border-top-left-radius', '--nph-collapsible-trigger-radius'));
  });

  it('in flush the hover paints the whole row', async () => {
    const piece = await mount();
    expect(getComputedStyle(trigger(piece)).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    await userEvent.hover(trigger(piece));
    expect(getComputedStyle(trigger(piece)).backgroundColor).toBe(resolved(piece, 'background-color', '--nph-collapsible-trigger-background-hover'));
    expect(trigger(piece).getBoundingClientRect().width).toBe(piece.getBoundingClientRect().width);
  });

  it('hover does not move the focus and does not open', async () => {
    const piece = await mount();
    await userEvent.hover(trigger(piece));
    expect(piece.open).toBe(false);
    expect(root(piece).activeElement).toBeNull();
  });

  it('the card in the preview type carries the outline too', async () => {
    const piece = await mount({ type: 'preview', appearance: 'card', label: 'Show more' });
    const style = getComputedStyle(root(piece).querySelector('.preview') as Element);
    expect(style.borderTopWidth).toBe(resolved(piece, 'width', '--nph-collapsible-card-border-width'));
    expect(style.backgroundColor).toBe(resolved(piece, 'background-color', '--nph-collapsible-card-background'));
  });
});

describe('the focus', () => {
  it('by keyboard the border and the halo are on the trigger, in the tokens of the component', async () => {
    const piece = await mount({ appearance: 'card' });
    await userEvent.tab();
    expect(root(piece).activeElement).toBe(trigger(piece));
    const border = getComputedStyle(trigger(piece), '::before');
    const halo = getComputedStyle(trigger(piece), '::after');
    expect(border.borderTopColor).toBe(resolved(piece, 'border-top-color', '--nph-collapsible-focus-border'));
    expect(border.borderTopWidth).toBe(resolved(piece, 'width', '--nph-collapsible-focus-border-width'));
    expect(border.borderTopLeftRadius).toBe(resolved(piece, 'border-top-left-radius', '--nph-collapsible-focus-border-radius'));
    expect(halo.borderTopColor).toBe(resolved(piece, 'border-top-color', '--nph-collapsible-focus-halo'));
    expect(halo.borderTopWidth).toBe(resolved(piece, 'width', '--nph-collapsible-focus-halo-width'));
    expect(halo.borderTopLeftRadius).toBe(resolved(piece, 'border-top-left-radius', '--nph-collapsible-focus-halo-radius'));
  });

  it('the card itself shows no focus: the ring is on the trigger, not on the whole card', async () => {
    const piece = await mount({ appearance: 'card' });
    await userEvent.tab();
    const card = getComputedStyle(root(piece).querySelector('.root') as Element);
    expect(card.outlineStyle).toBe('none');
    expect(card.boxShadow).toBe('none');
  });

  it('a click does not draw the ring: only the keyboard does', async () => {
    const piece = await mount();
    await userEvent.click(trigger(piece));
    expect(getComputedStyle(trigger(piece), '::before').content).toBe('none');
  });

  it('with forced colors the trigger keeps an outline in the system color', async () => {
    const session = cdp();
    const piece = await mount();
    try {
      await session.send('Emulation.setEmulatedMedia', { features: [{ name: 'forced-colors', value: 'active' }] });
      await userEvent.tab();
      expect(getComputedStyle(trigger(piece)).outlineStyle).toBe('solid');
    } finally {
      await session.send('Emulation.setEmulatedMedia', { features: [{ name: 'forced-colors', value: 'none' }] });
    }
  });

  it('the focus ring of a field inside the open content is not clipped by the piece', async () => {
    const piece = await mount({ open: true }, '<input id="field" aria-label="Tax number" style="margin-inline-start: 0" />');
    expect(getComputedStyle(root(piece).querySelector('.clip') as Element).overflow).toBe('visible');
  });
});

describe('the button type', () => {
  it('the trigger is an nph-button, secondary ghost, in the default size, with the chevron at the end', async () => {
    const piece = await mount({ type: 'button', label: 'Show details' });
    const button = trigger(piece) as NphButton;
    expect(button.tagName).toBe('NPH-BUTTON');
    expect([button.severity, button.emphasis, button.size]).toEqual(['secondary', 'ghost', 'default']);
    expect(button.text).toBe('Show details');
    expect(button.iconEnd).toBe('chevron-down');
    expect(button.iconStart).toBe('');
  });

  it('open, the chevron is swapped to chevron-up and the button stays ghost', async () => {
    const piece = await mount({ type: 'button', label: 'Show details' });
    await userEvent.click(trigger(piece));
    await settle(piece);
    const button = trigger(piece) as NphButton;
    expect(button.iconEnd).toBe('chevron-up');
    expect([button.severity, button.emphasis]).toEqual(['secondary', 'ghost']);
    expect(button.hasAttribute('data-nph-open')).toBe(false);
    expect(button.hasAttribute('aria-haspopup')).toBe(false);
  });

  it('the text of the button is the label, and `open-label` swaps it while open', async () => {
    const piece = await mount({ type: 'button', label: 'Show details', openLabel: 'Hide details' });
    expect((trigger(piece) as NphButton).text).toBe('Show details');
    piece.open = true;
    await settle(piece);
    expect((trigger(piece) as NphButton).text).toBe('Hide details');
  });

  it('the native button carries aria-expanded and points to the content by aria-controls', async () => {
    const piece = await mount({ type: 'button', label: 'Show details' });
    const native = nativeOf(piece);
    expect(native.getAttribute('aria-expanded')).toBe('false');
    expect((native as unknown as { ariaControlsElements: Element[] }).ariaControlsElements).toEqual([content(piece)]);
    const node = await axNode(native);
    expect(node.role).toBe('button');
    expect(node.name).toBe('Show details');
    piece.open = true;
    await settle(piece);
    expect(nativeOf(piece).getAttribute('aria-expanded')).toBe('true');
  });

  it('keeps the state on the native button after the nph-button went invalid and came back', async () => {
    const piece = await mount({ type: 'button', label: 'Show details', open: true });
    const button = trigger(piece) as NphButton;
    vi.spyOn(console, 'error').mockImplementation(() => {});
    button.iconEnd = 'not-an-icon';
    await button.updateComplete;
    button.iconEnd = 'chevron-up';
    await button.updateComplete;
    piece.requestUpdate();
    await settle(piece);
    await vi.waitFor(() => expect(nativeOf(piece).getAttribute('aria-expanded')).toBe('true'));
    expect((nativeOf(piece) as unknown as { ariaControlsElements: Element[] }).ariaControlsElements).toEqual([content(piece)]);
  });

  it('Enter and Space on the button open and close and fire the event', async () => {
    const piece = await mount({ type: 'button', label: 'Show details' });
    const seen = collect(piece);
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    await settle(piece);
    await userEvent.keyboard(' ');
    await settle(piece);
    expect(seen).toEqual([{ open: true }, { open: false }]);
  });

  it('the button hugs its width, at the start, and the content opens below it', async () => {
    const piece = await mount({ type: 'button', label: 'Show details', open: true });
    const button = trigger(piece).getBoundingClientRect();
    expect(button.width).toBeLessThan(piece.getBoundingClientRect().width / 2);
    expect(button.left).toBe(piece.getBoundingClientRect().left);
    expect((piece.querySelector('#line') as HTMLElement).getBoundingClientRect().top).toBeGreaterThan(button.bottom);
  });

  it('the content grows and the closed content is out of the Tab order, as in the line type', async () => {
    const piece = await mount({ type: 'button', label: 'Show details' });
    expect(content(piece).getAttribute('hidden')).toBe('until-found');
    piece.open = true;
    await piece.updateComplete;
    expect(state(piece)).toBe('opening');
    await vi.waitFor(() => expect(state(piece)).toBe('open'), { timeout: 2000 });
  });

  it('the button content has no indent', async () => {
    const piece = await mount({ type: 'button', label: 'Show details', open: true });
    expect(root(piece).querySelector('.indent')).toBeNull();
  });
});

describe('the preview type', () => {
  const LONG =
    '<p style="margin: 0">The import started at 09:12 and read 4,812 rows from the file. The first 300 rows were saved with no warning. The next block had 41 rows with a date outside the range.</p><p style="margin: 0">Those rows were skipped and listed below. The last block was saved at 09:14.</p><p style="margin: 0">No row was changed after that and the log stays here for ninety days.</p>';

  it('shows the text cut at three lines while closed, and the whole text open', async () => {
    const piece = await mount({ type: 'preview', label: 'Show more', openLabel: 'Show less' }, LONG, '24rem');
    const text = root(piece).querySelector('.preview-content') as HTMLElement;
    const line = Number.parseFloat(resolved(piece, 'height', '--nph-text-body-md-line-height'));
    expect(text.getBoundingClientRect().height).toBeLessThanOrEqual(line * 3 + 1);
    expect(text.scrollHeight).toBeGreaterThan(text.clientHeight);
    piece.open = true;
    await settle(piece);
    expect(text.getBoundingClientRect().height).toBeGreaterThan(line * 3);
    expect(text.scrollHeight).toBeLessThanOrEqual(text.clientHeight + 1);
  });

  it('cuts plain text too, not only paragraphs', async () => {
    const piece = await mount(
      { type: 'preview', label: 'Show more' },
      'A very long note with no markup at all that goes on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on.',
      '16rem',
    );
    const text = root(piece).querySelector('.preview-content') as HTMLElement;
    const line = Number.parseFloat(resolved(piece, 'height', '--nph-text-body-md-line-height'));
    expect(text.getBoundingClientRect().height).toBeLessThanOrEqual(line * 3 + 1);
  });

  it('a text of fewer than three lines is shown whole, with its button', async () => {
    const piece = await mount({ type: 'preview', label: 'Show more' }, '<p style="margin: 0">Short.</p>', '24rem');
    const text = root(piece).querySelector('.preview-content') as HTMLElement;
    expect(text.scrollHeight).toBeLessThanOrEqual(text.clientHeight + 1);
    expect(trigger(piece).tagName).toBe('NPH-BUTTON');
  });

  it('the button is below the text, at the start, with the gap of the preview', async () => {
    const piece = await mount({ type: 'preview', label: 'Show more' }, LONG, '24rem');
    const text = root(piece).querySelector('.preview-content') as HTMLElement;
    const button = trigger(piece).getBoundingClientRect();
    expect(button.top - text.getBoundingClientRect().bottom).toBe(Number.parseFloat(resolved(piece, 'height', '--nph-collapsible-preview-gap')));
    expect(button.left).toBe(piece.getBoundingClientRect().left);
  });

  it('the text takes only the side padding of the content', async () => {
    const piece = await mount({ type: 'preview', label: 'Show more' }, LONG, '24rem');
    const style = getComputedStyle(root(piece).querySelector('.preview-content') as Element);
    expect(style.paddingLeft).toBe(resolved(piece, 'padding-left', '--nph-collapsible-content-padding-x'));
    expect(style.paddingTop).toBe('0px');
    expect(style.paddingBottom).toBe('0px');
  });

  it('swaps "Show more" for "Show less" and carries aria-expanded and aria-controls to the text', async () => {
    const piece = await mount({ type: 'preview', label: 'Show more', openLabel: 'Show less' }, LONG, '24rem');
    expect((trigger(piece) as NphButton).text).toBe('Show more');
    expect(nativeOf(piece).getAttribute('aria-expanded')).toBe('false');
    expect((nativeOf(piece) as unknown as { ariaControlsElements: Element[] }).ariaControlsElements).toEqual([content(piece)]);
    expect(content(piece).classList.contains('preview-content')).toBe(true);
    await userEvent.click(trigger(piece));
    await settle(piece);
    expect((trigger(piece) as NphButton).text).toBe('Show less');
    expect(nativeOf(piece).getAttribute('aria-expanded')).toBe('true');
    expect((trigger(piece) as NphButton).iconEnd).toBe('chevron-up');
  });

  it('the text of the preview is always in the accessibility tree and never hidden', async () => {
    const piece = await mount({ type: 'preview', label: 'Show more' }, LONG, '24rem');
    expect(content(piece).hasAttribute('hidden')).toBe(false);
    expect(content(piece).hasAttribute('inert')).toBe(false);
  });

  it('without `open-label` the text of the button does not change', async () => {
    const piece = await mount({ type: 'preview', label: 'Show more' }, LONG, '24rem');
    piece.open = true;
    await settle(piece);
    expect((trigger(piece) as NphButton).text).toBe('Show more');
  });

  it('the event is fired once for each change by the person', async () => {
    const piece = await mount({ type: 'preview', label: 'Show more' }, LONG, '24rem');
    const seen = collect(piece);
    await userEvent.click(trigger(piece));
    await userEvent.click(trigger(piece));
    expect(seen).toEqual([{ open: true }, { open: false }]);
  });
});

describe('lifecycle', () => {
  it('leaving the page in the middle of the growth and coming back leaves the content steady', async () => {
    const piece = await mount();
    piece.open = true;
    await piece.updateComplete;
    expect(state(piece)).toBe('opening');
    const holder = piece.parentElement as HTMLElement;
    piece.remove();
    holder.append(piece);
    await settle(piece);
    expect(state(piece)).toBe('open');
    expect(content(piece).hasAttribute('hidden')).toBe(false);
  });

  it('a piece moved while closed stays closed and keeps hiding its content', async () => {
    const piece = await mount();
    const other = document.createElement('div');
    document.body.append(other);
    other.append(piece);
    await settle(piece);
    expect(state(piece)).toBe('closed');
    expect(content(piece).getAttribute('hidden')).toBe('until-found');
  });

  it('removing a piece in the middle of the growth leaves no timer that touches it', async () => {
    const piece = await mount();
    piece.open = true;
    await piece.updateComplete;
    piece.remove();
    await wait(400);
    expect(piece.isConnected).toBe(false);
  });

  it('changing the type with the focus on the trigger keeps the focus on the new trigger', async () => {
    const piece = await mount();
    await userEvent.tab();
    expect(root(piece).activeElement).toBe(trigger(piece));
    piece.type = 'button';
    await settle(piece);
    expect(trigger(piece).tagName).toBe('NPH-BUTTON');
    expect(root(piece).activeElement).toBe(trigger(piece));
    piece.type = 'line';
    await settle(piece);
    expect(root(piece).activeElement).toBe(trigger(piece));
  });

  it('changing the type of an open piece keeps it open and steady', async () => {
    const piece = await mount({ open: true });
    piece.type = 'button';
    await settle(piece);
    expect(state(piece)).toBe('open');
    piece.type = 'preview';
    await settle(piece);
    expect(piece.open).toBe(true);
    expect(root(piece).querySelector('.preview-content')?.hasAttribute('data-clamped')).toBe(false);
  });

  it('changing the title does not close or move the focus', async () => {
    const piece = await mount({ open: true });
    await userEvent.tab();
    piece.label = 'Other title';
    await settle(piece);
    expect(piece.open).toBe(true);
    expect(root(piece).activeElement).toBe(trigger(piece));
    expect(root(piece).querySelector('.title')?.textContent).toBe('Other title');
  });

  it('the content of the slot may change after the first render', async () => {
    const piece = await mount({ open: true });
    piece.innerHTML = '<p id="new">New text</p>';
    await settle(piece);
    expect(piece.querySelector('#new')?.assignedSlot).toBe(root(piece).querySelector('slot'));
  });

  it('a piece created by script and filled before it enters the page draws as one written in the markup', async () => {
    const piece = document.createElement('nph-collapsible');
    piece.label = 'Created by script';
    piece.open = true;
    piece.append(document.createElement('p'));
    document.body.append(piece);
    await settle(piece);
    expect(trigger(piece).getAttribute('aria-expanded')).toBe('true');
    expect(state(piece)).toBe('open');
  });
});

describe('right-to-left writing', () => {
  it('the closed chevron at the start points to the start, and open it points down', async () => {
    document.documentElement.setAttribute('dir', 'rtl');
    const piece = await mount({ indicator: 'start' });
    const closed = new DOMMatrix(getComputedStyle(root(piece).querySelector('.indicator') as Element).transform);
    expect(closed.a).toBe(-1);
    piece.open = true;
    await settle(piece);
    const open = new DOMMatrix(getComputedStyle(root(piece).querySelector('.indicator') as Element).transform);
    expect(Math.round(Math.atan2(open.b, open.a) * (180 / Math.PI))).toBe(90);
  });

  it('the content still lines up with the title and the button hugs the start', async () => {
    document.documentElement.setAttribute('dir', 'rtl');
    const piece = await mount({ open: true, indicator: 'start', icon: 'gear' });
    const title = (root(piece).querySelector('.title') as HTMLElement).getBoundingClientRect();
    expect((piece.querySelector('#line') as HTMLElement).getBoundingClientRect().right).toBe(title.right);
    const buttonPiece = await mount({ type: 'button', label: 'Show details' });
    expect(trigger(buttonPiece).getBoundingClientRect().right).toBe(buttonPiece.getBoundingClientRect().right);
  });
});

describe('duration parsing', () => {
  it('reads seconds and milliseconds, and the longest of a list', () => {
    expect(longestDuration('0.25s')).toBe(250);
    expect(longestDuration('250ms')).toBe(250);
    expect(longestDuration('0s, 0.3s')).toBe(300);
    expect(longestDuration('0s')).toBe(0);
    expect(longestDuration('')).toBe(0);
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const used = new Set([...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1] ?? ''));
  const declared = [...new Set([...tokensCss.matchAll(/(--nph-collapsible-[a-z0-9-]+):/g)].map((match) => match[1] ?? ''))];

  it('every custom property in the CSS exists in tokens.css', () => {
    for (const name of used) {
      expect(tokensCss, name).toContain(`${name}:`);
    }
  });

  it('consumes every one of the collapsible/* tokens', () => {
    expect(declared.length).toBeGreaterThan(0);
    for (const name of declared) {
      expect(used, name).toContain(name);
    }
  });

  it('uses the four text roles', () => {
    for (const name of [
      '--nph-text-label-md-font-size',
      '--nph-text-label-lg-font-size',
      '--nph-text-body-sm-font-size',
      '--nph-text-body-md-font-size',
    ]) {
      expect(used, name).toContain(name);
    }
  });

  it('never consumes a core or theme token', () => {
    expect(componentCss).not.toMatch(/--nph-core-|--nph-theme-/);
  });

  it('the CSS has no literal color, duration or measure', () => {
    expect(cssWithoutComments).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(cssWithoutComments).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/i);
    const measures = [...cssWithoutComments.matchAll(/\d+(\.\d+)?(px|rem|em|ms|s|vh|vw)\b/g)].map((match) => match[0]);
    expect(measures).toEqual([]);
  });
});
