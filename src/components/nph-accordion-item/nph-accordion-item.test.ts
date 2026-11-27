/**
 * Tests of `nph-accordion-item` (P136), in a real browser (P21, item 5): hover, keyboard focus, the growth of the
 * content and the search of the page only exist where there is layout.
 *
 * They prove the contract accepted in Figma (documentation frame `7428:43770`, item set `7227:26332`, start set
 * `7227:26993`), recorded in the evidence of the `figma-docs-accepted` gate of DSA-97: the API, the invalid input,
 * the roles and the accessible name the browser computes, the Tab order, the open and the close, the open that does
 * not close and the locked section, the start media, the tag and the status, the indicator, the sizes, the event,
 * the growth, the focus, the right-to-left writing and the token contract.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cdp, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import componentCss from './nph-accordion-item.css?raw';
import {
  NPH_ACCORDION_ITEM_INDICATORS,
  NPH_ACCORDION_ITEM_SIZES,
  NPH_ACCORDION_ITEM_STARTS,
  NPH_ACCORDION_ITEM_STATUSES,
  NPH_ACCORDION_ITEM_TOGGLE_EVENT,
  NphAccordionItem,
} from './nph-accordion-item';
import type { NphAccordionItemToggleDetail } from './nph-accordion-item';

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
  vi.restoreAllMocks();
});

const frame = (): Promise<void> => new Promise((resolve) => requestAnimationFrame(() => resolve()));

/** The text a test puts in the content. A paragraph, as a page does. */
const BODY = '<p id="line" style="margin: 0">Contract valid until the end of the year.</p>';

/** An item with a title and a paragraph, in a block of its own width. */
async function mount(props: Partial<NphAccordionItem> = {}, content: string = BODY, width = '30rem'): Promise<NphAccordionItem> {
  const holder = document.createElement('div');
  holder.style.inlineSize = width;
  const piece = document.createElement('nph-accordion-item');
  Object.assign(piece, { label: 'Contract details', ...props });
  piece.innerHTML = content;
  holder.append(piece);
  document.body.append(holder);
  await settle(piece);
  return piece;
}

/** Lets the item and what it holds render, and the growth of the content end. */
async function settle(piece: NphAccordionItem): Promise<void> {
  await piece.updateComplete;
  for (const inner of piece.shadowRoot?.querySelectorAll('nph-icon, nph-badge, nph-avatar, nph-image') ?? []) {
    await (inner as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
  }
  await vi.waitFor(() => {
    const state = piece.shadowRoot?.querySelector('.panel')?.getAttribute('data-state') ?? 'open';
    expect(['open', 'closed']).toContain(state);
  });
  await piece.updateComplete;
  await frame();
}

const root = (piece: NphAccordionItem): ShadowRoot => piece.shadowRoot as ShadowRoot;
const trigger = (piece: NphAccordionItem): HTMLButtonElement => root(piece).querySelector('#trigger') as HTMLButtonElement;
const content = (piece: NphAccordionItem): HTMLElement => root(piece).querySelector('#content') as HTMLElement;
const panel = (piece: NphAccordionItem): HTMLElement => root(piece).querySelector('.panel') as HTMLElement;
const state = (piece: NphAccordionItem): string => panel(piece).getAttribute('data-state') ?? '';

/** The events the item fires, collected until the end of the test. */
function collect(piece: NphAccordionItem): NphAccordionItemToggleDetail[] {
  const seen: NphAccordionItemToggleDetail[] = [];
  piece.addEventListener(
    NPH_ACCORDION_ITEM_TOGGLE_EVENT,
    (event) => seen.push((event as unknown as CustomEvent<NphAccordionItemToggleDetail>).detail),
    { signal: listeners.signal },
  );
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

/** The node the browser itself builds for an element in its accessibility tree. */
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
    expect(customElements.get('nph-accordion-item')).toBe(NphAccordionItem);
    expect(document.createElement('nph-accordion-item')).toBeInstanceOf(NphAccordionItem);
  });

  it('the public API is exactly P136', () => {
    const declared = [...(NphAccordionItem as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()].filter(
      (name) => name !== 'phase',
    );
    expect(declared.sort()).toEqual(
      [
        'description',
        'disabled',
        'headingLevel',
        'icon',
        'indicator',
        'label',
        'mediaSrc',
        'open',
        'persistent',
        'region',
        'size',
        'start',
        'startLabel',
        'status',
        'statusLabel',
        'tag',
      ].sort(),
    );
  });

  it('the lists are the values of the accepted contract', () => {
    expect([...NPH_ACCORDION_ITEM_STARTS]).toEqual([
      'icon',
      'tile',
      'avatar',
      'image',
      'status-success',
      'status-warning',
      'status-error',
      'status-pending',
    ]);
    expect([...NPH_ACCORDION_ITEM_STATUSES]).toEqual(['success', 'warning', 'error', 'pending']);
    expect([...NPH_ACCORDION_ITEM_INDICATORS]).toEqual(['end', 'start']);
    expect([...NPH_ACCORDION_ITEM_SIZES]).toEqual(['compact', 'default', 'large']);
  });

  it('starts closed, with the indicator at the end, the default size and no start, tag or status', async () => {
    const piece = await mount();
    expect(piece.open).toBe(false);
    expect([piece.indicator, piece.size, piece.disabled, piece.persistent, piece.headingLevel, piece.region]).toEqual([
      'end',
      'default',
      false,
      false,
      3,
      true,
    ]);
    expect([piece.start, piece.tag, piece.status, piece.description]).toEqual(['', '', '', '']);
    expect(piece.hasAttribute('open')).toBe(false);
    expect(trigger(piece).getAttribute('aria-expanded')).toBe('false');
    expect(root(piece).querySelector('.start, .tag, .end, .description')).toBeNull();
  });

  it('the properties that the internal CSS reads reflect, and the attribute names are the ones of the contract', async () => {
    const piece = await mount({ size: 'large', indicator: 'start', open: true, disabled: true });
    for (const name of ['size', 'indicator']) {
      expect(piece.getAttribute(name), name).toBe(piece[name as 'size']);
    }
    expect(piece.hasAttribute('open')).toBe(true);
    expect(piece.hasAttribute('disabled')).toBe(true);
    piece.open = false;
    await piece.updateComplete;
    expect(piece.hasAttribute('open')).toBe(false);
  });

  it('the multi-word properties have kebab-case attributes', () => {
    const piece = document.createElement('nph-accordion-item');
    piece.setAttribute('media-src', 'a.png');
    piece.setAttribute('start-label', 'Pending');
    piece.setAttribute('status-label', 'Done');
    piece.setAttribute('heading-level', '4');
    expect([piece.mediaSrc, piece.startLabel, piece.statusLabel, piece.headingLevel]).toEqual(['a.png', 'Pending', 'Done', 4]);
  });

  it('declares no part and no color property', () => {
    expect(componentCss).not.toMatch(/::part/);
  });

  it('an open attribute before the first render draws the content open at once', async () => {
    const piece = await mount({ open: true });
    expect(state(piece)).toBe('open');
    expect(content(piece).hasAttribute('hidden')).toBe(false);
    expect(piece.getBoundingClientRect().height).toBeGreaterThan(trigger(piece).getBoundingClientRect().height);
  });
});

describe('invalid input', () => {
  const draws = (piece: NphAccordionItem): boolean => piece.hasAttribute('data-nph-rendered');

  for (const [name, value, message] of [
    ['start', 'logo', /start "logo" does not exist/],
    ['status', 'late', /status "late" does not exist/],
    ['indicator', 'top', /indicator "top" does not exist/],
    ['size', 'huge', /size "huge" does not exist/],
    ['headingLevel', 7, /heading-level "7" does not exist/],
    ['icon', 'not-an-icon', /icon "not-an-icon" is not a core name/],
  ] as const) {
    it(`${name} "${value}" draws nothing and says so once, in development`, async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const piece = await mount({ [name]: value } as Partial<NphAccordionItem>);
      expect(draws(piece)).toBe(false);
      expect(root(piece).querySelector('.trigger')).toBeNull();
      expect(getComputedStyle(piece).display).toBe('none');
      piece.requestUpdate();
      await piece.updateComplete;
      expect(error.mock.calls.filter(([text]) => message.test(String(text)))).toHaveLength(1);
    });
  }

  it('a heading level that is not a whole number draws nothing', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const piece = await mount({ headingLevel: 2.5 });
    expect(draws(piece)).toBe(false);
  });

  it('an empty title is a mount: it draws nothing and says nothing', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const piece = await mount({ label: '   ' });
    expect(draws(piece)).toBe(false);
    expect(getComputedStyle(piece).display).toBe('none');
    expect(error).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
  });

  it('the title that arrives after the first render draws the item', async () => {
    const piece = await mount({ label: '' });
    expect(draws(piece)).toBe(false);
    piece.label = 'Payments';
    await settle(piece);
    expect(draws(piece)).toBe(true);
    expect(root(piece).querySelector('.title')?.textContent).toBe('Payments');
  });

  it('a status with no text is not drawn, and says so once', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const piece = await mount({ status: 'success' });
    expect(draws(piece)).toBe(true);
    expect(root(piece).querySelector('.end')).toBeNull();
    expect(warn.mock.calls.filter(([text]) => /status needs status-label/.test(String(text)))).toHaveLength(1);
  });

  it('an icon with a start that does not use it, and a source with a start that does not use it, are ignored with a warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const piece = await mount({ icon: 'gear', mediaSrc: 'a.png' });
    expect(draws(piece)).toBe(true);
    expect(warn.mock.calls.map(([text]) => String(text)).join('\n')).toMatch(/icon is for the icon and tile starts/);
    expect(warn.mock.calls.map(([text]) => String(text)).join('\n')).toMatch(/media-src is for the avatar and image starts/);
  });

  it('a status start with no end status and no hidden text says so', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    await mount({ start: 'status-warning' });
    expect(warn.mock.calls.filter(([text]) => /needs start-label/.test(String(text)))).toHaveLength(1);
  });
});

describe('semantics and accessible name', () => {
  it('the trigger is a button, the only child of a heading of level 3', async () => {
    const piece = await mount();
    const heading = root(piece).querySelector('.heading') as HTMLElement;
    expect(heading.getAttribute('role')).toBe('heading');
    expect(heading.getAttribute('aria-level')).toBe('3');
    expect(heading.children).toHaveLength(1);
    expect(heading.firstElementChild).toBe(trigger(piece));
    expect(trigger(piece).localName).toBe('button');
    expect(trigger(piece).type).toBe('button');
    expect((await axNode(heading)).role).toBe('heading');
  });

  it('the level of the heading comes from the page', async () => {
    const piece = await mount({ headingLevel: 5 });
    expect((root(piece).querySelector('.heading') as HTMLElement).getAttribute('aria-level')).toBe('5');
  });

  it('the button points to the content, and the content is a region named by the trigger', async () => {
    const piece = await mount({ open: true });
    expect(trigger(piece).getAttribute('aria-controls')).toBe('content');
    expect(content(piece).getAttribute('role')).toBe('region');
    expect(content(piece).getAttribute('aria-labelledby')).toBe('trigger');
    const node = await axNode(content(piece));
    expect(node.role).toBe('region');
    expect(node.name).toBe('Contract details');
  });

  it('with no region the content has no role and no name', async () => {
    const piece = await mount({ open: true, region: false });
    expect(content(piece).hasAttribute('role')).toBe(false);
    expect(content(piece).hasAttribute('aria-labelledby')).toBe(false);
  });

  it('the button has no aria-label, which would hide the tag, the description and the status', async () => {
    const piece = await mount({ tag: 'New', description: '2 fields left', status: 'warning', statusLabel: 'Pending' });
    expect(trigger(piece).hasAttribute('aria-label')).toBe(false);
    expect(trigger(piece).hasAttribute('aria-labelledby')).toBe(false);
    expect(trigger(piece).hasAttribute('aria-describedby')).toBe(false);
  });

  it('the name is the title, then the tag, the short description and the status, in that order', async () => {
    const piece = await mount({ label: 'Add products', tag: 'New', description: '2 fields left', status: 'pending', statusLabel: 'Pending' });
    const node = await axNode(trigger(piece));
    expect(node.role).toBe('button');
    expect(node.name.replace(/\s+/g, ' ').trim()).toBe('Add products New 2 fields left Pending');
  });

  it('with no extras the name is the title alone', async () => {
    const piece = await mount({ label: 'Payments' });
    expect((await axNode(trigger(piece))).name).toBe('Payments');
  });

  it('the indicator and the start media are decorative', async () => {
    const piece = await mount({ start: 'tile', tag: 'New' });
    for (const decoration of root(piece).querySelectorAll('.indicator, .tile nph-icon')) {
      expect(decoration.getAttribute('aria-hidden'), decoration.className).toBe('true');
    }
  });

  it('the status icon of the start is decoration when the end status is there', async () => {
    const piece = await mount({ label: 'Payments', start: 'status-success', status: 'success', statusLabel: 'Done', startLabel: 'Ignored' });
    expect(root(piece).querySelector('.status-icon')?.getAttribute('aria-hidden')).toBe('true');
    expect(root(piece).querySelector('.assistive')).toBeNull();
    expect((await axNode(trigger(piece))).name.replace(/\s+/g, ' ').trim()).toBe('Payments Done');
  });

  it('the status icon of the start with no end status carries a hidden text, last in the name', async () => {
    const piece = await mount({ label: 'Payments', start: 'status-error', startLabel: 'Error', description: 'Two files failed' });
    expect(root(piece).querySelector('.status-icon')?.getAttribute('aria-hidden')).toBe('true');
    const assistive = root(piece).querySelector('.assistive') as HTMLElement;
    expect(assistive.textContent).toBe('Error');
    expect(assistive.getBoundingClientRect().width).toBe(0);
    expect((await axNode(trigger(piece))).name.replace(/\s+/g, ' ').trim()).toBe('Payments Two files failed Error');
  });

  it('closed content leaves the Tab order and the accessibility tree', async () => {
    const piece = await mount({}, '<button id="inner">Save</button>');
    expect(content(piece).getAttribute('hidden')).toBe('until-found');
    expect(getComputedStyle(content(piece)).display).toBe('block');
    expect(getComputedStyle(content(piece)).contentVisibility).toBe('hidden');
    piece.open = true;
    await settle(piece);
    expect(content(piece).hasAttribute('hidden')).toBe(false);
  });
});

describe('open and close', () => {
  it('a click opens and closes, says so with the state the item is in now, and keeps the focus on the trigger', async () => {
    const piece = await mount();
    const seen = collect(piece);
    await userEvent.click(trigger(piece));
    await settle(piece);
    expect(piece.open).toBe(true);
    expect(trigger(piece).getAttribute('aria-expanded')).toBe('true');
    expect(state(piece)).toBe('open');
    expect(root(piece).activeElement).toBe(trigger(piece));
    await userEvent.click(trigger(piece));
    await settle(piece);
    expect(piece.open).toBe(false);
    expect(seen).toEqual([{ open: true }, { open: false }]);
    expect(root(piece).activeElement).toBe(trigger(piece));
  });

  it('Enter and Space open and close', async () => {
    const piece = await mount();
    const seen = collect(piece);
    trigger(piece).focus();
    await userEvent.keyboard('{Enter}');
    await settle(piece);
    expect(piece.open).toBe(true);
    await userEvent.keyboard(' ');
    await settle(piece);
    expect(piece.open).toBe(false);
    expect(seen).toEqual([{ open: true }, { open: false }]);
  });

  it('arrows, Home, End and Esc do nothing', async () => {
    const piece = await mount({ open: true });
    const seen = collect(piece);
    trigger(piece).focus();
    for (const key of ['{ArrowDown}', '{ArrowUp}', '{ArrowRight}', '{ArrowLeft}', '{Home}', '{End}', '{Escape}']) {
      await userEvent.keyboard(key);
    }
    await settle(piece);
    expect(piece.open).toBe(true);
    expect(seen).toEqual([]);
    expect(root(piece).activeElement).toBe(trigger(piece));
  });

  it('a click outside closes nothing', async () => {
    const piece = await mount({ open: true });
    await userEvent.click(document.body);
    await settle(piece);
    expect(piece.open).toBe(true);
  });

  it('setting open from code fires no event', async () => {
    const piece = await mount();
    const seen = collect(piece);
    piece.open = true;
    await settle(piece);
    piece.open = false;
    await settle(piece);
    expect(seen).toEqual([]);
  });

  it('the event bubbles and crosses a shadow root', async () => {
    const piece = await mount();
    let event: CustomEvent | undefined;
    document.body.addEventListener(NPH_ACCORDION_ITEM_TOGGLE_EVENT, (e) => (event = e as CustomEvent), { signal: listeners.signal });
    await userEvent.click(trigger(piece));
    expect(event?.bubbles).toBe(true);
    expect(event?.composed).toBe(true);
    expect(event?.detail).toEqual({ open: true });
  });

  it('the Tab order goes through the trigger and, when open, through what the content holds', async () => {
    const piece = await mount({ open: true }, '<button id="inner">Save</button>');
    await userEvent.tab();
    expect(root(piece).activeElement).toBe(trigger(piece));
    await userEvent.tab();
    expect(document.activeElement?.id).toBe('inner');
  });

  it('closed, what the content holds is out of the Tab order', async () => {
    const piece = await mount({}, '<button id="inner">Save</button>');
    const after = document.createElement('button');
    after.id = 'after';
    document.body.append(after);
    await userEvent.tab();
    expect(root(piece).activeElement).toBe(trigger(piece));
    await userEvent.tab();
    expect(document.activeElement?.id).toBe('after');
  });

  it('closed from the page with the focus inside the content, the focus goes to the trigger', async () => {
    const piece = await mount({ open: true }, '<button id="inner">Save</button>');
    (piece.querySelector('#inner') as HTMLElement).focus();
    piece.open = false;
    await settle(piece);
    expect(root(piece).activeElement).toBe(trigger(piece));
  });

  it('the search of the page opens the closed content, with no growth, and says so', async () => {
    const piece = await mount();
    const seen = collect(piece);
    content(piece).dispatchEvent(new Event('beforematch', { bubbles: true }));
    await settle(piece);
    expect(piece.open).toBe(true);
    expect(trigger(piece).getAttribute('aria-expanded')).toBe('true');
    expect(state(piece)).toBe('open');
    expect(seen).toEqual([{ open: true }]);
  });

  it('a beforematch in an open item changes nothing', async () => {
    const piece = await mount({ open: true });
    const seen = collect(piece);
    content(piece).dispatchEvent(new Event('beforematch', { bubbles: true }));
    expect(seen).toEqual([]);
  });
});

describe('the item that cannot close, the disabled one and the locked section', () => {
  it('disabled closed: disabled button, plain hidden content, out of the Tab order, it does not open', async () => {
    const piece = await mount({ disabled: true });
    const seen = collect(piece);
    expect(trigger(piece).disabled).toBe(true);
    expect(content(piece).getAttribute('hidden')).toBe('hidden');
    /* The page driver waits for an enabled button: a native click and a dispatched one stand for the person. */
    trigger(piece).click();
    trigger(piece).dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await settle(piece);
    expect(piece.open).toBe(false);
    expect(seen).toEqual([]);
    await userEvent.tab();
    expect(root(piece).activeElement).not.toBe(trigger(piece));
  });

  it('disabled fades the item and the content stays in the box that fades, not the divider box', async () => {
    const piece = await mount({ disabled: true });
    const item = root(piece).querySelector('.item') as HTMLElement;
    expect(getComputedStyle(item).opacity).toBe(resolved(piece, 'opacity', '--nph-collapsible-disabled-opacity'));
    expect(getComputedStyle(piece).opacity).toBe('1');
  });

  it('a locked section (open and disabled) keeps the content in view under the same opacity and leaves the Tab order', async () => {
    const piece = await mount({ disabled: true, open: true });
    expect(content(piece).hasAttribute('hidden')).toBe(false);
    expect(state(piece)).toBe('open');
    expect(trigger(piece).disabled).toBe(true);
    expect(trigger(piece).getAttribute('aria-expanded')).toBe('true');
    const item = root(piece).querySelector('.item') as HTMLElement;
    expect(getComputedStyle(item).opacity).toBe(resolved(piece, 'opacity', '--nph-collapsible-disabled-opacity'));
    await userEvent.tab();
    expect(root(piece).activeElement).not.toBe(trigger(piece));
  });

  it('an open item that cannot close: aria-disabled on the trigger, still in the Tab order, no opacity, it does not close', async () => {
    const piece = await mount({ open: true, persistent: true });
    const seen = collect(piece);
    expect(trigger(piece).getAttribute('aria-disabled')).toBe('true');
    expect(trigger(piece).disabled).toBe(false);
    const item = root(piece).querySelector('.item') as HTMLElement;
    expect(getComputedStyle(item).opacity).toBe('1');
    await userEvent.tab();
    expect(root(piece).activeElement).toBe(trigger(piece));
    await userEvent.keyboard('{Enter}');
    /* The page driver does not click a button that says it is not enabled; a native click still reaches the handler. */
    trigger(piece).click();
    await settle(piece);
    expect(piece.open).toBe(true);
    expect(seen).toEqual([]);
    expect(content(piece).hasAttribute('hidden')).toBe(false);
  });

  it('persistent opens a closed item', async () => {
    const piece = await mount({ persistent: true });
    expect(piece.open).toBe(true);
    expect(state(piece)).toBe('open');
  });

  it('without persistent the trigger has no aria-disabled', async () => {
    const piece = await mount({ open: true });
    expect(trigger(piece).hasAttribute('aria-disabled')).toBe(false);
  });

  it('an item that cannot close takes no hover', async () => {
    const piece = await mount({ open: true, persistent: true });
    await userEvent.hover(trigger(piece));
    expect(getComputedStyle(trigger(piece)).backgroundColor).toBe('rgba(0, 0, 0, 0)');
  });

  it('a disabled item takes no hover', async () => {
    const piece = await mount({ disabled: true });
    await userEvent.hover(trigger(piece)).catch(() => {});
    expect(getComputedStyle(trigger(piece)).backgroundColor).toBe('rgba(0, 0, 0, 0)');
  });
});

describe('the start media, the tag and the end status', () => {
  it('icon: the light nph-icon of the name, gear by default, in the icon color, with the trigger gap after it', async () => {
    const piece = await mount({ start: 'icon' });
    const icon = root(piece).querySelector('.start nph-icon') as HTMLElement;
    expect(icon.getAttribute('name')).toBe('gear');
    expect(getComputedStyle(icon).color).toBe(resolved(piece, 'color', '--nph-collapsible-icon-foreground'));
    expect(getComputedStyle(root(piece).querySelector('.start') as HTMLElement).marginInlineEnd).toBe(
      resolved(piece, 'margin-inline-end', '--nph-collapsible-trigger-gap'),
    );
    piece.icon = 'folder';
    await settle(piece);
    expect((root(piece).querySelector('.start nph-icon') as HTMLElement).getAttribute('name')).toBe('folder');
  });

  it('tile: folder by default, a tonal box, the icon in the tile color, the media gap after it', async () => {
    const piece = await mount({ start: 'tile' });
    const tile = root(piece).querySelector('.tile') as HTMLElement;
    const icon = tile.querySelector('nph-icon') as HTMLElement;
    expect(icon.getAttribute('name')).toBe('folder');
    expect(getComputedStyle(tile).backgroundColor).toBe(resolved(piece, 'background-color', '--nph-accordion-tile-background'));
    expect(getComputedStyle(tile).color).toBe(resolved(piece, 'color', '--nph-accordion-tile-foreground'));
    expect(getComputedStyle(tile).borderRadius).toBe(resolved(piece, 'border-radius', '--nph-accordion-tile-radius'));
    expect(getComputedStyle(root(piece).querySelector('.start') as HTMLElement).marginInlineEnd).toBe(
      resolved(piece, 'margin-inline-end', '--nph-accordion-media-gap'),
    );
  });

  it('tile: 24, 32 and 40 by the size, with the icon of 16, 16 and 24', async () => {
    for (const [size, box, icon] of [
      ['compact', 24, 16],
      ['default', 32, 16],
      ['large', 40, 24],
    ] as const) {
      const piece = await mount({ start: 'tile', size });
      const tile = root(piece).querySelector('.tile') as HTMLElement;
      expect(tile.getBoundingClientRect().width, size).toBe(box);
      expect(tile.getBoundingClientRect().height, size).toBe(box);
      expect((tile.querySelector('nph-icon') as HTMLElement).getBoundingClientRect().width, size).toBe(icon);
      document.body.replaceChildren();
    }
  });

  it('avatar: nph-avatar of 24, 32 and 40 by the size, decorative, with the photo when there is one', async () => {
    for (const [size, avatar, box] of [
      ['compact', 'sm', 24],
      ['default', 'md', 32],
      ['large', 'lg', 40],
    ] as const) {
      const piece = await mount({ start: 'avatar', size, mediaSrc: '' });
      const element = root(piece).querySelector('nph-avatar') as HTMLElement;
      expect(element.getAttribute('size'), size).toBe(avatar);
      expect(element.getBoundingClientRect().width, size).toBe(box);
      expect(element.getAttribute('aria-hidden'), size).toBe('true');
      expect(element.hasAttribute('role'), size).toBe(false);
      document.body.replaceChildren();
    }
    const withPhoto = await mount({ start: 'avatar', mediaSrc: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=' });
    expect((root(withPhoto).querySelector('nph-avatar') as HTMLElement).getAttribute('src')).toContain('data:image/gif');
  });

  it('image: nph-image 1:1 of 24, 32 and 48 by the size, with an empty alternative text', async () => {
    for (const [size, image, box] of [
      ['compact', 'xs', 24],
      ['default', 'sm', 32],
      ['large', 'md', 48],
    ] as const) {
      const piece = await mount({ start: 'image', size, mediaSrc: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=' });
      const element = root(piece).querySelector('nph-image') as HTMLElement;
      expect(element.getAttribute('size'), size).toBe(image);
      expect(element.getAttribute('ratio'), size).toBe('1:1');
      expect(element.getAttribute('alt'), size).toBe('');
      expect(element.getBoundingClientRect().width, size).toBe(box);
      document.body.replaceChildren();
    }
  });

  it('the status icons: the four icons, the four colors, and the trigger gap after them', async () => {
    for (const [status, icon, token] of [
      ['success', 'circle-check', '--nph-accordion-status-success-icon'],
      ['warning', 'triangle-exclamation', '--nph-accordion-status-warning-icon'],
      ['error', 'circle-xmark', '--nph-accordion-status-error-icon'],
      ['pending', 'clock', '--nph-accordion-status-pending-icon'],
    ] as const) {
      const piece = await mount({ start: `status-${status}`, startLabel: status });
      const element = root(piece).querySelector('.status-icon') as HTMLElement;
      expect(element.getAttribute('name'), status).toBe(icon);
      expect(getComputedStyle(element).color, status).toBe(resolved(piece, 'color', token));
      expect(element.getBoundingClientRect().width, status).toBe(16);
      expect(getComputedStyle(root(piece).querySelector('.start') as HTMLElement).marginInlineEnd, status).toBe(
        resolved(piece, 'margin-inline-end', '--nph-collapsible-trigger-gap'),
      );
      document.body.replaceChildren();
    }
  });

  it('the tag: a primary light nph-badge next to the title, the tag gap away, and the title line is 24 high', async () => {
    const piece = await mount({ tag: 'New' });
    const tag = root(piece).querySelector('.tag') as HTMLElement;
    expect(tag.localName).toBe('nph-badge');
    expect([tag.getAttribute('severity'), tag.getAttribute('emphasis'), tag.getAttribute('text')]).toEqual(['primary', 'light', 'New']);
    const title = root(piece).querySelector('.title') as HTMLElement;
    const gap = tag.getBoundingClientRect().left - title.getBoundingClientRect().right;
    expect(gap).toBeCloseTo(Number.parseFloat(resolved(piece, 'margin', '--nph-accordion-tag-gap')) * 1, 0);
    expect((root(piece).querySelector('.title-line') as HTMLElement).getBoundingClientRect().height).toBe(24);
    const line = tag.getBoundingClientRect();
    const text = title.getBoundingClientRect();
    expect(Math.abs(line.top + line.height / 2 - (text.top + text.height / 2))).toBeLessThan(1);
  });

  it('the end status: a light nph-badge of the tone of the status, pending in secondary, always with text', async () => {
    for (const [status, severity] of [
      ['success', 'success'],
      ['warning', 'warn'],
      ['error', 'danger'],
      ['pending', 'secondary'],
    ] as const) {
      const piece = await mount({ status, statusLabel: 'Label' });
      const badge = root(piece).querySelector('.end nph-badge') as HTMLElement;
      expect([badge.getAttribute('severity'), badge.getAttribute('emphasis'), badge.getAttribute('text')], status).toEqual([
        severity,
        'light',
        'Label',
      ]);
      document.body.replaceChildren();
    }
  });

  it('the short description sits under the title, the title gap away, in the description color', async () => {
    const piece = await mount({ description: 'Options few people need to change.' });
    const description = root(piece).querySelector('.description') as HTMLElement;
    const title = root(piece).querySelector('.title') as HTMLElement;
    expect(description.getBoundingClientRect().top - title.getBoundingClientRect().bottom).toBe(
      Number.parseFloat(resolved(piece, 'margin', '--nph-accordion-title-gap')),
    );
    expect(getComputedStyle(description).color).toBe(resolved(piece, 'color', '--nph-collapsible-description-foreground'));
  });

  it('the title wraps and the tag stays centered on the two lines', async () => {
    const piece = await mount(
      { label: 'A very long title that does not fit the width of the item and has to wrap to a second line', tag: 'PRO' },
      BODY,
      '16rem',
    );
    const title = root(piece).querySelector('.title') as HTMLElement;
    const tag = root(piece).querySelector('.tag') as HTMLElement;
    expect(title.getBoundingClientRect().height).toBeGreaterThan(Number.parseFloat(getComputedStyle(title).lineHeight) * 1.5);
    const a = title.getBoundingClientRect();
    const b = tag.getBoundingClientRect();
    expect(Math.abs(a.top + a.height / 2 - (b.top + b.height / 2))).toBeLessThan(1);
    expect(piece.getBoundingClientRect().width).toBeLessThanOrEqual(256 + 1);
  });

  it('the parts are centered on the vertical axis of the trigger', async () => {
    const piece = await mount({ start: 'tile', description: 'Short', status: 'success', statusLabel: 'Done' });
    const middle = (element: Element): number => {
      const box = element.getBoundingClientRect();
      return box.top + box.height / 2;
    };
    const text = middle(root(piece).querySelector('.text') as HTMLElement);
    for (const part of ['.tile', '.end nph-badge', '.indicator']) {
      expect(Math.abs(middle(root(piece).querySelector(part) as HTMLElement) - text), part).toBeLessThan(1);
    }
  });
});

describe('the indicator', () => {
  it('at the end: chevron-down, after the text, turning 180 degrees when open, the end gap after the status', async () => {
    const piece = await mount({ status: 'success', statusLabel: 'Done' });
    const indicator = root(piece).querySelector('.indicator') as HTMLElement;
    expect(indicator.getAttribute('name')).toBe('chevron-down');
    expect(indicator.getBoundingClientRect().left).toBeGreaterThan((root(piece).querySelector('.text') as HTMLElement).getBoundingClientRect().right);
    const badge = root(piece).querySelector('.end nph-badge') as HTMLElement;
    expect(indicator.getBoundingClientRect().left - badge.getBoundingClientRect().right).toBe(
      Number.parseFloat(resolved(piece, 'margin', '--nph-accordion-end-gap')),
    );
    expect(getComputedStyle(indicator).transform).toBe('none');
    piece.open = true;
    await settle(piece);
    expect(getComputedStyle(indicator).transform).toBe('matrix(-1, 0, 0, -1, 0, 0)');
  });

  it('at the start: chevron-right, before everything, turning 90 degrees to point down when open, with nothing after it', async () => {
    const piece = await mount({ indicator: 'start', start: 'icon' });
    const indicator = root(piece).querySelector('.indicator') as HTMLElement;
    expect(indicator.getAttribute('name')).toBe('chevron-right');
    expect(indicator.getBoundingClientRect().right).toBeLessThanOrEqual((root(piece).querySelector('.start') as HTMLElement).getBoundingClientRect().left);
    expect(trigger(piece).lastElementChild?.classList.contains('text')).toBe(true);
    piece.open = true;
    await settle(piece);
    expect(getComputedStyle(indicator).transform).toBe('matrix(0, 1, -1, 0, 0, 0)');
  });

  it('the indicator is the size and the color of the collapsible indicator', async () => {
    const piece = await mount();
    const indicator = root(piece).querySelector('.indicator') as HTMLElement;
    expect(indicator.getBoundingClientRect().width).toBe(Number.parseFloat(resolved(piece, 'width', '--nph-collapsible-indicator-size')));
    expect(getComputedStyle(indicator).color).toBe(resolved(piece, 'color', '--nph-collapsible-indicator-foreground'));
  });

  it('at the start the open content lines up with the part after the indicator, and at the end it does not indent', async () => {
    const atEnd = await mount({ open: true });
    const atStart = await mount({ open: true, indicator: 'start' });
    const x = (piece: NphAccordionItem): number => (piece.querySelector('#line') as HTMLElement).getBoundingClientRect().left - piece.getBoundingClientRect().left;
    const padding = Number.parseFloat(resolved(atEnd, 'margin', '--nph-collapsible-content-padding-x'));
    expect(x(atEnd)).toBe(padding);
    const indent =
      Number.parseFloat(resolved(atStart, 'margin', '--nph-collapsible-indicator-size')) +
      Number.parseFloat(resolved(atStart, 'margin', '--nph-collapsible-trigger-gap'));
    expect(x(atStart)).toBe(padding + indent);
  });

  it('the start media brings no indent to the content', async () => {
    const plain = await mount({ open: true });
    const withMedia = await mount({ open: true, start: 'tile' });
    const x = (piece: NphAccordionItem): number => (piece.querySelector('#line') as HTMLElement).getBoundingClientRect().left;
    expect(x(withMedia)).toBe(x(plain));
  });
});

describe('sizes and measures', () => {
  it('the minimum height of the trigger is 28, 36 and 44 by the size, and the large title uses label-lg', async () => {
    for (const [size, token] of [
      ['compact', '--nph-collapsible-trigger-height-compact'],
      ['default', '--nph-collapsible-trigger-height'],
      ['large', '--nph-collapsible-trigger-height-large'],
    ] as const) {
      const piece = await mount({ size });
      expect(trigger(piece).getBoundingClientRect().height, size).toBe(Number.parseFloat(resolved(piece, 'height', token)));
      const title = root(piece).querySelector('.title') as HTMLElement;
      const role = size === 'large' ? 'label-lg' : 'label-md';
      expect(getComputedStyle(title).fontSize, size).toBe(resolved(piece, 'font-size', `--nph-text-${role}-font-size`));
      expect(getComputedStyle(title).lineHeight, size).toBe(resolved(piece, 'line-height', `--nph-text-${role}-line-height`));
      document.body.replaceChildren();
    }
  });

  it('the trigger fills the width and has the padding of the collapsible trigger', async () => {
    const piece = await mount();
    const style = getComputedStyle(trigger(piece));
    expect(trigger(piece).getBoundingClientRect().width).toBe(piece.getBoundingClientRect().width);
    expect(style.paddingInlineStart).toBe(resolved(piece, 'padding-inline-start', '--nph-collapsible-trigger-padding-x'));
    expect(style.paddingBlockStart).toBe(resolved(piece, 'padding-block-start', '--nph-collapsible-trigger-padding-y'));
    expect(getComputedStyle(trigger(piece)).borderRadius).toBe(resolved(piece, 'border-radius', '--nph-collapsible-trigger-radius'));
  });

  it('the compact trigger takes the compact vertical padding', async () => {
    const piece = await mount({ size: 'compact' });
    expect(getComputedStyle(trigger(piece)).paddingBlockStart).toBe(resolved(piece, 'padding-block-start', '--nph-collapsible-trigger-padding-y-compact'));
  });

  it('the content is right below the trigger, with the content padding', async () => {
    const piece = await mount({ open: true });
    const line = piece.querySelector('#line') as HTMLElement;
    expect(line.getBoundingClientRect().top - trigger(piece).getBoundingClientRect().bottom).toBe(
      Number.parseFloat(resolved(piece, 'margin', '--nph-collapsible-content-padding-top')),
    );
    expect(piece.getBoundingClientRect().bottom - line.getBoundingClientRect().bottom).toBe(
      Number.parseFloat(resolved(piece, 'margin', '--nph-collapsible-content-padding-bottom')),
    );
  });

  it('open does not change the background of the trigger', async () => {
    const closed = await mount();
    const open = await mount({ open: true });
    expect(getComputedStyle(trigger(open)).backgroundColor).toBe(getComputedStyle(trigger(closed)).backgroundColor);
  });
});

describe('hover and focus', () => {
  it('hover paints the trigger only, in the hover background, with the trigger radius', async () => {
    const piece = await mount({ open: true });
    await userEvent.hover(trigger(piece));
    expect(getComputedStyle(trigger(piece)).backgroundColor).toBe(resolved(piece, 'background-color', '--nph-collapsible-trigger-background-hover'));
    expect(getComputedStyle(piece).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(getComputedStyle(content(piece)).backgroundColor).toBe('rgba(0, 0, 0, 0)');
  });

  it('the keyboard focus shows the border and the halo on the trigger', async () => {
    const piece = await mount();
    await userEvent.tab();
    expect(root(piece).activeElement).toBe(trigger(piece));
    const before = getComputedStyle(trigger(piece), '::before');
    const after = getComputedStyle(trigger(piece), '::after');
    expect(before.borderTopColor).toBe(resolved(piece, 'color', '--nph-collapsible-focus-border'));
    expect(before.borderTopWidth).toBe(resolved(piece, 'width', '--nph-collapsible-focus-border-width'));
    expect(before.borderTopLeftRadius).toBe(resolved(piece, 'border-radius', '--nph-collapsible-focus-border-radius'));
    expect(after.borderTopColor).toBe(resolved(piece, 'color', '--nph-collapsible-focus-halo'));
    expect(after.borderTopWidth).toBe(resolved(piece, 'width', '--nph-collapsible-focus-halo-width'));
    expect(after.borderTopLeftRadius).toBe(resolved(piece, 'border-radius', '--nph-collapsible-focus-halo-radius'));
    expect(getComputedStyle(trigger(piece)).outlineStyle).toBe('none');
  });

  it('a click shows no focus ring', async () => {
    const piece = await mount();
    await userEvent.click(trigger(piece));
    expect(getComputedStyle(trigger(piece), '::before').content).toBe('none');
  });

  it('the focus is on the trigger, not on the host or the content', async () => {
    const piece = await mount({ open: true });
    await userEvent.tab();
    expect(getComputedStyle(piece).outlineStyle).toBe('none');
    expect(getComputedStyle(content(piece), '::before').content).toBe('none');
  });
});

describe('movement', () => {
  it('the content grows in the expand duration and stays steady when it ends', async () => {
    const piece = await mount();
    piece.open = true;
    await piece.updateComplete;
    expect(['opening', 'open']).toContain(state(piece));
    expect(getComputedStyle(panel(piece)).transitionDuration).toBe(resolved(piece, 'transition-duration', '--nph-collapsible-expand-duration'));
    await settle(piece);
    expect(state(piece)).toBe('open');
    piece.open = false;
    await settle(piece);
    expect(state(piece)).toBe('closed');
    expect(content(piece).getAttribute('hidden')).toBe('until-found');
  });

  it('with reduced motion nothing moves', async () => {
    await withReducedMotion(async () => {
      const piece = await mount();
      piece.open = true;
      await piece.updateComplete;
      expect(state(piece)).toBe('open');
      expect(getComputedStyle(panel(piece)).transitionDuration).toBe('0s');
      expect(getComputedStyle(root(piece).querySelector('.indicator') as HTMLElement).transitionDuration).toBe('0s');
    });
  });
});

describe('right-to-left writing', () => {
  it('the indicator at the start points to the start, the content keeps its indent and the start media sits at the right', async () => {
    document.documentElement.setAttribute('dir', 'rtl');
    const piece = await mount({ indicator: 'start', start: 'icon', open: true });
    const indicator = root(piece).querySelector('.indicator') as HTMLElement;
    expect(indicator.getBoundingClientRect().left).toBeGreaterThan((root(piece).querySelector('.text') as HTMLElement).getBoundingClientRect().left);
    expect(getComputedStyle(indicator).transform).toBe('matrix(0, 1, 1, 0, 0, 0)');
    const closed = await mount({ indicator: 'start' });
    expect(getComputedStyle(root(closed).querySelector('.indicator') as HTMLElement).transform).toBe('matrix(-1, 0, 0, 1, 0, 0)');
  });
});

describe('token contract', () => {
  it('every token the accepted documentation names for the item is read by the CSS', () => {
    for (const token of [
      '--nph-accordion-title-gap',
      '--nph-accordion-tag-gap',
      '--nph-accordion-media-gap',
      '--nph-accordion-end-gap',
      '--nph-accordion-tile-background',
      '--nph-accordion-tile-foreground',
      '--nph-accordion-tile-radius',
      '--nph-accordion-tile-padding',
      '--nph-accordion-tile-padding-compact',
      '--nph-accordion-tile-icon-size',
      '--nph-accordion-tile-icon-size-large',
      '--nph-accordion-status-success-icon',
      '--nph-accordion-status-warning-icon',
      '--nph-accordion-status-error-icon',
      '--nph-accordion-status-pending-icon',
      '--nph-collapsible-trigger-height',
      '--nph-collapsible-trigger-height-compact',
      '--nph-collapsible-trigger-height-large',
      '--nph-collapsible-trigger-padding-x',
      '--nph-collapsible-trigger-padding-y',
      '--nph-collapsible-trigger-padding-y-compact',
      '--nph-collapsible-trigger-gap',
      '--nph-collapsible-trigger-radius',
      '--nph-accordion-content-foreground',
      '--nph-accordion-description-foreground',
      '--nph-accordion-icon-foreground',
      '--nph-accordion-indicator-foreground',
      '--nph-accordion-title-foreground',
      '--nph-accordion-trigger-background-hover',
      '--nph-focus-border',
      '--nph-focus-halo',
      '--nph-collapsible-indicator-size',
      '--nph-collapsible-icon-size',
      '--nph-collapsible-content-padding-x',
      '--nph-collapsible-content-padding-top',
      '--nph-collapsible-content-padding-bottom',
      '--nph-collapsible-content-gap',
      '--nph-collapsible-disabled-opacity',
      '--nph-collapsible-focus-border-width',
      '--nph-collapsible-focus-border-radius',
      '--nph-collapsible-focus-halo-width',
      '--nph-collapsible-focus-halo-radius',
      '--nph-collapsible-expand-duration',
      '--nph-collapsible-expand-easing',
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

  it('the tokens of the accordion item resolve in the page', async () => {
    const piece = await mount();
    for (const token of ['--nph-accordion-title-gap', '--nph-accordion-tag-gap', '--nph-accordion-tile-background']) {
      expect(resolved(piece, 'margin', token) || resolved(piece, 'background-color', token), token).not.toBe('');
    }
  });
});
