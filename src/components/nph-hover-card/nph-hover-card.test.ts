/**
 * Tests of `nph-hover-card` (P112), in a real browser (P21, item 5): hover, keyboard focus, the
 * top layer, placement, the arrow and the transitions only exist where there is layout, a pointer
 * and a loaded font.
 *
 * They prove the contract accepted in Figma (documentation frame `4422:2418`, component set
 * `4406:1105`): the API, the three parts of the card and the optional meta line, opening on hover
 * after `hover-card/open-delay` and on keyboard focus at once, never on touch, closing after
 * `hover-card/close-delay`, on blur and with Esc, staying open over the card (WCAG 1.4.13), the
 * four sides with flip, the arrow and its distances, the read-only semantics and the token
 * contract. Accessibility assertions are written by hand (P72 moves the addon to DSA-32).
 */
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-hover-card.css?raw';
import { NPH_HOVER_CARD_SIDES, NphHoverCard, isSafeHref } from './nph-hover-card';
import componentSource from './nph-hover-card.ts?raw';
import type { NphHoverCardSide } from './nph-hover-card';

const SCHEMES = ['light', 'dark'] as const;

beforeAll(async () => {
  /* Without the token font, the measure would come out in the browser fallback font. */
  await document.fonts.load('400 14px "Noto Sans"');
  await document.fonts.ready;
});

afterEach(async () => {
  await userEvent.unhover(document.body).catch(() => {});
  document.body.replaceChildren();
  document.documentElement.removeAttribute('data-nph-color-scheme');
  vi.restoreAllMocks();
});

interface Options {
  heading?: string;
  description?: string;
  meta?: string;
  metaIcon?: string;
  metaTitle?: string;
  side?: NphHoverCardSide;
  arrow?: boolean;
  open?: boolean;
  href?: string | null;
  label?: string;
  style?: string;
  /** Short waits keep the tests quick; the waits are set on the host, where the card reads them. */
  openDelay?: string;
  closeDelay?: string;
  parent?: HTMLElement;
}

const HOST_STYLE = 'position:fixed;left:300px;top:300px';

/** A hover card with its link, placed in the page. */
async function mount(options: Options = {}): Promise<NphHoverCard> {
  const {
    heading = 'Nephos',
    description = 'The design system of IATec, in Web Components.',
    meta = 'Updated today',
    metaIcon,
    metaTitle,
    side,
    arrow = false,
    open = false,
    href = '/nephos',
    label = 'Nephos',
    style = HOST_STYLE,
    openDelay = '60ms',
    closeDelay = '60ms',
    parent = document.body,
  } = options;
  const card = document.createElement('nph-hover-card');
  card.style.cssText = `${style};--nph-hover-card-open-delay:${openDelay};--nph-hover-card-close-delay:${closeDelay}`;
  if (href !== null) card.href = href;
  card.heading = heading;
  card.description = description;
  card.meta = meta;
  if (metaIcon !== undefined) card.metaIcon = metaIcon;
  if (metaTitle !== undefined) card.metaTitle = metaTitle;
  if (side) card.side = side;
  card.arrow = arrow;
  card.open = open;
  card.textContent = label;
  parent.append(card);
  await card.updateComplete;
  return card;
}

function linkOf(card: NphHoverCard): HTMLAnchorElement {
  const link = card.shadowRoot?.querySelector<HTMLAnchorElement>('.link');
  if (!link) throw new Error('the hover card rendered no link');
  return link;
}

function surfaceOf(card: NphHoverCard): HTMLElement {
  const surface = card.shadowRoot?.querySelector<HTMLElement>('.card');
  if (!surface) throw new Error('the hover card rendered no card');
  return surface;
}

const isShown = (card: NphHoverCard): boolean => surfaceOf(card).matches(':popover-open');

const pause = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/** The card turned itself on and is in the top layer. */
async function opened(card: NphHoverCard): Promise<void> {
  await vi.waitFor(() => expect(card.open).toBe(true), { timeout: 2000 });
  await card.updateComplete;
  expect(isShown(card)).toBe(true);
}

/** The card has left the top layer: the exit ended. */
async function gone(card: NphHoverCard): Promise<void> {
  await vi.waitFor(() => expect(isShown(card)).toBe(false), { timeout: 2000 });
}

/**
 * Tab until the link has the focus, as a person does: the first Tab of a test may land outside
 * the page, where the previous test left the focus.
 */
async function tabTo(card: NphHoverCard): Promise<void> {
  for (let attempt = 0; attempt < 4 && card.shadowRoot?.activeElement !== linkOf(card); attempt += 1) {
    await userEvent.tab();
  }
  expect(card.shadowRoot?.activeElement).toBe(linkOf(card));
}

/** Opens from code and then lets the pointer take the holds: the open wait of the test is long. */
async function hoverOpenFast(card: NphHoverCard): Promise<void> {
  card.open = true;
  await opened(card);
  await userEvent.hover(linkOf(card));
}

async function hoverOpen(card: NphHoverCard): Promise<void> {
  await userEvent.hover(linkOf(card));
  await opened(card);
}

/** The value the browser gives a token, in the same property. */
function resolved(property: string, token: string): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  document.body.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

/** A token resolved to pixels, through a box of that width. */
function px(token: string): number {
  const probe = document.createElement('div');
  probe.style.cssText = `position:absolute;visibility:hidden;inline-size:var(${token})`;
  document.body.append(probe);
  const value = probe.getBoundingClientRect().width;
  probe.remove();
  return value;
}

/** A color token as the browser paints it (`rgb(...)`), through a box of that color. */
function paint(token: string, scheme?: (typeof SCHEMES)[number]): string {
  const probe = document.createElement('div');
  if (scheme) probe.setAttribute('data-nph-color-scheme', scheme);
  probe.style.color = `var(${token})`;
  document.body.append(probe);
  const value = getComputedStyle(probe).color;
  probe.remove();
  return value;
}

function touch(type: string, target: HTMLElement): void {
  target.dispatchEvent(new PointerEvent(type, { pointerType: 'touch', bubbles: type !== 'pointerenter' && type !== 'pointerleave' }));
}

interface AxNode {
  name?: { value?: unknown };
  role?: { value?: unknown };
}

describe('registration and API', () => {
  it('defines nph-hover-card only once', () => {
    expect(customElements.get('nph-hover-card')).toBe(NphHoverCard);
  });

  it('the public API is exactly href, heading, description, meta, meta-icon, meta-title, side, arrow and open', () => {
    const declared = Object.keys(
      Object.fromEntries((NphHoverCard as unknown as { elementProperties: Map<string, unknown> }).elementProperties),
    );
    expect(new Set(declared)).toEqual(
      new Set(['href', 'heading', 'description', 'meta', 'metaIcon', 'metaTitle', 'side', 'arrow', 'open']),
    );
  });

  it('defaults: no href, empty texts, the clock icon, bottom, no arrow, closed', () => {
    const card = document.createElement('nph-hover-card');
    expect([card.href, card.heading, card.description, card.meta, card.metaIcon, card.metaTitle, card.side, card.arrow, card.open]).toEqual([
      null,
      '',
      '',
      '',
      'clock',
      '',
      'bottom',
      false,
      false,
    ]);
  });

  it('side, arrow and open reflect to attributes; the texts do not', async () => {
    const card = await mount({ open: true, side: 'top', arrow: true });
    expect(card.getAttribute('side')).toBe('top');
    expect(card.hasAttribute('arrow')).toBe(true);
    expect(card.hasAttribute('open')).toBe(true);
    for (const name of ['heading', 'description', 'meta', 'href']) {
      expect(card.hasAttribute(name), name).toBe(false);
    }
    card.open = false;
    card.arrow = false;
    await card.updateComplete;
    expect(card.hasAttribute('open')).toBe(false);
    expect(card.hasAttribute('arrow')).toBe(false);
  });

  it('the attributes heading, description, meta, meta-icon, meta-title and href set the properties', async () => {
    const card = document.createElement('nph-hover-card');
    card.setAttribute('href', '/x');
    card.setAttribute('heading', 'H');
    card.setAttribute('description', 'D');
    card.setAttribute('meta', 'M');
    card.setAttribute('meta-icon', 'calendar');
    card.setAttribute('meta-title', 'T');
    expect([card.href, card.heading, card.description, card.meta, card.metaIcon, card.metaTitle]).toEqual(['/x', 'H', 'D', 'M', 'calendar', 'T']);
  });

  it('the sides are bottom, top, left and right, bottom first', () => {
    expect([...NPH_HOVER_CARD_SIDES]).toEqual(['bottom', 'top', 'left', 'right']);
  });

  it('has no events: the source dispatches none', () => {
    expect(componentSource).not.toMatch(/dispatchEvent|new CustomEvent/);
  });
});

describe('the link', () => {
  it('draws a native link with the destination and the text of the slot', async () => {
    const card = await mount({ href: '/nephos', label: 'See Nephos' });
    const link = linkOf(card);
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('/nephos');
    expect(link.querySelector('slot')?.assignedNodes()[0]?.textContent).toBe('See Nephos');
  });

  it('is named by the link text (the card does not name it)', async () => {
    const card = await mount({ label: 'See Nephos', heading: 'Something else' });
    const ax = (await axNode(linkOf(card)))?.name?.value;
    expect(ax).toBe('See Nephos');
  });

  it('is in color/link, underlined, text/label-md and 20 tall', async () => {
    const card = await mount();
    const link = linkOf(card);
    const style = getComputedStyle(link);
    expect(style.color).toBe(paint('--nph-color-link'));
    expect(style.textDecorationLine).toBe('underline');
    expect(style.fontSize).toBe(`${px('--nph-text-label-md-font-size')}px`);
    expect(style.fontWeight).toBe(resolved('font-weight', '--nph-text-label-md-font-weight'));
    expect(link.getBoundingClientRect().height).toBeCloseTo(px('--nph-text-label-md-line-height'), 0);
  });

  it('follows color/link in both schemes, not color/primary (D-3)', async () => {
    const card = await mount();
    for (const scheme of SCHEMES) {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      expect(getComputedStyle(linkOf(card)).color, scheme).toBe(paint('--nph-color-link', scheme));
    }
    expect(componentCss).toContain('color: var(--nph-color-link)');
    expect(componentCss).not.toContain('--nph-color-primary');
  });

  it('keeps the link when the card is invalid', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const card = await mount({ heading: '' });
    expect(linkOf(card).getAttribute('href')).toBe('/nephos');
  });

  it('flows in a sentence: the host is inline', async () => {
    const card = await mount({ style: '' });
    expect(getComputedStyle(card).display).toBe('inline');
  });
});

describe('href safety', () => {
  it('accepts http, https and a relative address; refuses anything else', () => {
    expect(isSafeHref('https://iatec.com.br')).toBe(true);
    expect(isSafeHref('http://iatec.com.br/x')).toBe(true);
    expect(isSafeHref('/nephos')).toBe(true);
    expect(isSafeHref('../nephos?x=1#y')).toBe(true);
    expect(isSafeHref('javascript:alert(1)')).toBe(false);
    expect(isSafeHref('JaVaScRiPt:alert(1)')).toBe(false);
    expect(isSafeHref('java\tscript:alert(1)')).toBe(false);
    expect(isSafeHref('data:text/html,<p>x</p>')).toBe(false);
    expect(isSafeHref('mailto:a@b.c')).toBe(false);
    expect(isSafeHref('tel:123')).toBe(false);
  });

  it('an unsafe href draws a link with no destination, no card, and one error in development', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const card = await mount({ href: 'javascript:alert(1)' });
    expect(linkOf(card).hasAttribute('href')).toBe(false);
    expect(card.hasAttribute('data-nph-rendered')).toBe(false);
    expect(surfaceOf(card).childElementCount).toBe(0);
    card.requestUpdate();
    await card.updateComplete;
    expect(error).toHaveBeenCalledTimes(1);
    expect(String(error.mock.calls[0]?.[0])).toContain('unsafe');
  });
});

describe('invalid input: no card, one development error per cause', () => {
  async function invalid(options: Options, expected: RegExp): Promise<NphHoverCard> {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const card = await mount(options);
    expect(card.hasAttribute('data-nph-rendered')).toBe(false);
    expect(surfaceOf(card).childElementCount).toBe(0);
    expect(error).toHaveBeenCalledTimes(1);
    expect(String(error.mock.calls[0]?.[0])).toMatch(expected);
    /* The same input again stays silent. */
    card.requestUpdate();
    await card.updateComplete;
    expect(error).toHaveBeenCalledTimes(1);
    return card;
  }

  it('an empty heading', async () => {
    await invalid({ heading: '   ' }, /heading is required/);
  });

  it('no href', async () => {
    await invalid({ href: null }, /href is required/);
  });

  it('a side outside the list', async () => {
    await invalid({ side: 'middle' as NphHoverCardSide }, /side must be/);
  });

  it('a meta icon outside the Nephos core, when the meta line is on', async () => {
    await invalid({ metaIcon: 'not-an-icon' }, /meta-icon "not-an-icon"/);
  });

  it('a meta icon outside the core is ignored while the meta line is off', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const card = await mount({ meta: '', metaIcon: 'not-an-icon' });
    expect(card.hasAttribute('data-nph-rendered')).toBe(true);
    expect(error).not.toHaveBeenCalled();
  });

  it('never opens while invalid', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const card = await mount({ heading: '', open: true });
    expect(isShown(card)).toBe(false);
    await userEvent.hover(linkOf(card));
    await pause(200);
    expect(isShown(card)).toBe(false);
  });

  it('a fixed input draws again with no leftover and reports again if it breaks again', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const card = await mount({ heading: '' });
    card.heading = 'Nephos';
    await card.updateComplete;
    expect(card.hasAttribute('data-nph-rendered')).toBe(true);
    expect(surfaceOf(card).querySelector('.heading')?.textContent).toBe('Nephos');
    card.heading = '';
    await card.updateComplete;
    expect(error).toHaveBeenCalledTimes(2);
  });
});

describe('content of the card', () => {
  it('draws the title, the description and the meta line, in this order', async () => {
    const card = await mount({ open: true });
    const parts = [...surfaceOf(card).children].map((part) => part.className).filter((name) => name !== 'media' && name !== 'probe');
    expect(parts).toEqual(['heading', 'description', 'meta']);
  });

  it('the meta line is off when the meta is empty or only spaces', async () => {
    for (const meta of ['', '   ']) {
      const card = await mount({ meta });
      expect(card.shadowRoot?.querySelector('.meta'), JSON.stringify(meta)).toBeNull();
      card.remove();
    }
  });

  it('the description is left out when it is empty', async () => {
    const card = await mount({ description: '' });
    expect(card.shadowRoot?.querySelector('.description')).toBeNull();
  });

  it('the meta icon is clock by default, in the light style, and decorative', async () => {
    const card = await mount({ open: true });
    const icon = card.shadowRoot?.querySelector('.meta-icon') as HTMLElement;
    expect(icon.getAttribute('name')).toBe('clock');
    expect(icon.getAttribute('size')).toBe('sm');
    expect(icon.hasAttribute('variant')).toBe(false);
    expect(icon.getAttribute('aria-hidden')).toBe('true');
  });

  it('the meta icon can be swapped for calendar', async () => {
    const card = await mount({ metaIcon: 'calendar', meta: 'November 4, 2026' });
    expect(card.shadowRoot?.querySelector('.meta-icon')?.getAttribute('name')).toBe('calendar');
  });

  it('the full date goes in the title of the meta text, and only there', async () => {
    const card = await mount({ meta: '3 days ago', metaTitle: 'November 4, 2026' });
    const metaText = card.shadowRoot?.querySelector('.meta-text') as HTMLElement;
    expect(metaText.getAttribute('title')).toBe('November 4, 2026');
    const without = await mount({ meta: '3 days ago' });
    expect(without.shadowRoot?.querySelector('.meta-text')?.hasAttribute('title')).toBe(false);
  });

  it('the texts are plain text: markup in them is not parsed', async () => {
    const card = await mount({ heading: '<b>Nephos</b>', description: '<img src=x onerror=alert(1)>' });
    expect(card.shadowRoot?.querySelector('.heading b')).toBeNull();
    expect(card.shadowRoot?.querySelector('.description img')).toBeNull();
    expect(card.shadowRoot?.querySelector('.heading')?.textContent).toBe('<b>Nephos</b>');
  });

  it('the slot media sits first in the card and takes no room while empty', async () => {
    const empty = await mount({ open: true });
    const media = empty.shadowRoot?.querySelector('.media') as HTMLElement;
    expect(media.hidden).toBe(true);
    expect(getComputedStyle(media).display).toBe('none');
    empty.remove();

    const card = document.createElement('nph-hover-card');
    card.style.cssText = `${HOST_STYLE};--nph-hover-card-open-delay:60ms`;
    card.href = '/nephos';
    card.heading = 'Nephos';
    card.open = true;
    const avatar = document.createElement('span');
    avatar.slot = 'media';
    avatar.textContent = 'N';
    card.append('Nephos', avatar);
    document.body.append(card);
    await card.updateComplete;
    await vi.waitFor(() => expect(card.shadowRoot?.querySelector<HTMLElement>('.media')?.hidden).toBe(false));
    const children = [...surfaceOf(card).children].filter((part) => part.className !== 'probe').map((part) => part.className);
    expect(children[0]).toBe('media');
  });

  it('measures: 8 between title, description and meta, 16 of padding, 320 wide', async () => {
    const card = await mount({ open: true });
    await opened(card);
    const surface = surfaceOf(card);
    const style = getComputedStyle(surface);
    expect(style.paddingTop).toBe(`${px('--nph-hover-card-padding')}px`);
    expect(style.rowGap).toBe(`${px('--nph-hover-card-gap')}px`);
    expect(style.rowGap).toBe('8px');
    expect(surface.getBoundingClientRect().width).toBe(320);
    expect(px('--nph-hover-card-width')).toBe(320);
    const heading = surface.querySelector('.heading') as HTMLElement;
    const description = surface.querySelector('.description') as HTMLElement;
    const meta = surface.querySelector('.meta') as HTMLElement;
    expect(description.getBoundingClientRect().top - heading.getBoundingClientRect().bottom).toBe(8);
    expect(meta.getBoundingClientRect().top - description.getBoundingClientRect().bottom).toBe(8);
  });

  it('the title, the description and the meta take their roles and colors', async () => {
    const card = await mount({ open: true });
    await opened(card);
    const surface = surfaceOf(card);
    const read = (selector: string) => getComputedStyle(surface.querySelector(selector) as HTMLElement);
    expect(read('.heading').fontSize).toBe(`${px('--nph-text-label-lg-font-size')}px`);
    expect(read('.heading').color).toBe(paint('--nph-color-popover-foreground'));
    expect(read('.description').fontSize).toBe(`${px('--nph-text-body-sm-font-size')}px`);
    expect(read('.description').color).toBe(paint('--nph-color-muted-foreground'));
    expect(read('.meta').fontSize).toBe(`${px('--nph-text-caption-font-size')}px`);
    expect(read('.meta').color).toBe(paint('--nph-color-subtle-foreground'));
    expect(read('.meta-icon').color).toBe(paint('--nph-color-subtle-foreground'));
    expect(px('--nph-hover-card-icon-size')).toBe(16);
    expect((surface.querySelector('.meta-icon') as HTMLElement).getBoundingClientRect().width).toBe(16);
  });

  it('the meta icon is 4 from the meta text', async () => {
    const card = await mount({ open: true });
    await opened(card);
    const icon = card.shadowRoot?.querySelector('.meta-icon') as HTMLElement;
    const text = card.shadowRoot?.querySelector('.meta-text') as HTMLElement;
    expect(text.getBoundingClientRect().left - icon.getBoundingClientRect().right).toBe(4);
  });

  it('the description wraps and the card never scrolls or cuts it', async () => {
    const long = 'A long summary of the destination. '.repeat(12);
    const card = await mount({ description: long, open: true });
    await opened(card);
    const surface = surfaceOf(card);
    expect(getComputedStyle(surface).overflow).toBe('visible');
    const description = surface.querySelector('.description') as HTMLElement;
    expect(description.getBoundingClientRect().height).toBeGreaterThan(px('--nph-text-body-sm-line-height') * 2);
    expect(surface.scrollHeight).toBeLessThanOrEqual(surface.clientHeight + 1);
  });
});

describe('opening on hover (hover-card/open-delay)', () => {
  it('the pointer resting on the link opens it after the wait', async () => {
    const card = await mount({ openDelay: '400ms' });
    const started = performance.now();
    await userEvent.hover(linkOf(card));
    expect(card.open).toBe(false);
    await opened(card);
    expect(performance.now() - started).toBeGreaterThanOrEqual(350);
  });

  it('leaving the link before the wait ends opens nothing', async () => {
    const card = await mount({ openDelay: '600ms' });
    await userEvent.hover(linkOf(card));
    await pause(100);
    await userEvent.unhover(linkOf(card));
    await pause(700);
    expect(card.open).toBe(false);
    expect(isShown(card)).toBe(false);
  });

  it('the wait is the token: 600 ms', () => {
    expect(resolved('--x', '--nph-hover-card-open-delay')).toBe('600ms');
    expect(resolved('--x', '--nph-hover-card-close-delay')).toBe('300ms');
  });

  it('a click during the wait ends it: the link is followed and nothing opens', async () => {
    const card = await mount({ openDelay: '500ms' });
    const link = linkOf(card);
    link.addEventListener('click', (event) => event.preventDefault());
    await userEvent.hover(link);
    await pause(50);
    link.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }));
    await pause(600);
    expect(card.open).toBe(false);
  });

  it('touch opens nothing: there is no hover, the tap follows the link', async () => {
    const card = await mount({ openDelay: '30ms' });
    const link = linkOf(card);
    touch('pointerenter', link);
    await pause(150);
    expect(card.open).toBe(false);
    touch('pointerleave', link);
    expect(isShown(card)).toBe(false);
  });

  it('touch does not close a card the keyboard opened', async () => {
    const card = await mount();
    await tabTo(card);
    await opened(card);
    touch('pointerleave', linkOf(card));
    touch('pointerleave', surfaceOf(card));
    await pause(200);
    expect(card.open).toBe(true);
  });

  it('opening twice in a row keeps one card on screen', async () => {
    const card = await mount();
    await hoverOpen(card);
    await userEvent.unhover(linkOf(card));
    await userEvent.hover(linkOf(card));
    await pause(150);
    expect(card.open).toBe(true);
    expect(card.shadowRoot?.querySelectorAll('.card').length).toBe(1);
  });
});

describe('opening on keyboard focus', () => {
  it('Tab to the link opens the card with no wait', async () => {
    const card = await mount({ openDelay: '5000ms' });
    await tabTo(card);
    expect(card.shadowRoot?.activeElement).toBe(linkOf(card));
    await vi.waitFor(() => expect(card.open).toBe(true), { timeout: 500 });
    await card.updateComplete;
    expect(isShown(card)).toBe(true);
  });

  it('a mouse click that focuses the link does not open the card', async () => {
    const card = await mount();
    const link = linkOf(card);
    link.addEventListener('click', (event) => event.preventDefault());
    await userEvent.click(link);
    await pause(200);
    /* A pointer focus does not match :focus-visible: the hover wait is the only way open. */
    expect(link.matches(':focus-visible')).toBe(false);
    await userEvent.unhover(link);
    await pause(200);
    expect(card.open).toBe(false);
  });

  it('losing the focus closes it at once, with no close delay', async () => {
    const card = await mount({ closeDelay: '5000ms' });
    await tabTo(card);
    await opened(card);
    await userEvent.tab();
    await vi.waitFor(() => expect(card.open).toBe(false), { timeout: 500 });
  });

  it('the focus keeps it open while the pointer leaves the link', async () => {
    const card = await mount();
    await tabTo(card);
    await opened(card);
    await userEvent.hover(linkOf(card));
    await userEvent.unhover(linkOf(card));
    await pause(300);
    expect(card.open).toBe(true);
  });

  it('the pointer keeps it open while the focus leaves', async () => {
    const card = await mount();
    await tabTo(card);
    await opened(card);
    await userEvent.hover(surfaceOf(card));
    (document.activeElement as HTMLElement | null)?.blur();
    linkOf(card).blur();
    await pause(300);
    expect(card.open).toBe(true);
  });

  it('the card takes no focus: the focus stays on the link', async () => {
    const card = await mount();
    await tabTo(card);
    await opened(card);
    expect(card.shadowRoot?.activeElement).toBe(linkOf(card));
    expect(document.activeElement).toBe(card);
  });
});

describe('closing', () => {
  it('leaving the link and the card closes it after the close delay', async () => {
    const card = await mount({ closeDelay: '1200ms' });
    await hoverOpen(card);
    const started = performance.now();
    await userEvent.unhover(linkOf(card));
    expect(card.open).toBe(true);
    await vi.waitFor(() => expect(card.open).toBe(false), { timeout: 4000 });
    expect(performance.now() - started).toBeGreaterThanOrEqual(1100);
    await gone(card);
  });

  it('the pointer can move onto the card without closing it, and it stays while there', async () => {
    const card = await mount({ closeDelay: '300ms' });
    await hoverOpen(card);
    await userEvent.hover(surfaceOf(card));
    await pause(500);
    expect(card.open).toBe(true);
    expect(isShown(card)).toBe(true);
  });

  it('leaving the card closes it after the close delay', async () => {
    const card = await mount({ closeDelay: '120ms' });
    await hoverOpen(card);
    await userEvent.hover(surfaceOf(card));
    await userEvent.unhover(surfaceOf(card));
    await vi.waitFor(() => expect(card.open).toBe(false), { timeout: 2000 });
    await gone(card);
  });

  it('coming back to the link during the close delay keeps it open, with no new wait', async () => {
    /* Waits wide enough for a few round trips to the browser on a slow runner. */
    const card = await mount({ openDelay: '5000ms', closeDelay: '2500ms' });
    card.open = true;
    await card.updateComplete;
    await userEvent.hover(linkOf(card));
    await userEvent.unhover(linkOf(card));
    await pause(100);
    await userEvent.hover(linkOf(card));
    await pause(3000);
    expect(card.open).toBe(true);
  });

  it('Esc closes it at once and the card does not come back while the pointer rests', async () => {
    const card = await mount();
    await hoverOpen(card);
    await userEvent.keyboard('{Escape}');
    await vi.waitFor(() => expect(card.open).toBe(false));
    await gone(card);
    await pause(300);
    expect(card.open).toBe(false);
  });

  it('Esc does not reach a dialog around the card, and only while the card is open', async () => {
    const outer = vi.fn();
    document.addEventListener('keydown', outer);
    const card = await mount();
    await userEvent.keyboard('{Escape}');
    expect(outer).toHaveBeenCalledTimes(1);
    await hoverOpen(card);
    outer.mockClear();
    await userEvent.keyboard('{Escape}');
    expect(outer).not.toHaveBeenCalled();
    document.removeEventListener('keydown', outer);
  });

  it('after Esc, leaving and coming back opens it again', async () => {
    const card = await mount();
    await hoverOpen(card);
    await userEvent.keyboard('{Escape}');
    await vi.waitFor(() => expect(card.open).toBe(false));
    await userEvent.unhover(linkOf(card));
    await pause(150);
    await hoverOpen(card);
  });

  it('turning open off from code closes it', async () => {
    const card = await mount({ open: true });
    await opened(card);
    card.open = false;
    await card.updateComplete;
    await gone(card);
  });

  it('removing the element from the page closes it and leaves nothing behind', async () => {
    const card = await mount();
    await hoverOpen(card);
    card.remove();
    await pause(200);
    expect(document.querySelector('nph-hover-card')).toBeNull();
    expect(isShown(card)).toBe(false);
  });

  it('it leaves on exit-duration: the opacity goes down before the card leaves the top layer', async () => {
    const card = await mount({ open: true });
    card.style.setProperty('--nph-hover-card-exit-duration', '600ms');
    await opened(card);
    card.open = false;
    await card.updateComplete;
    await pause(60);
    expect(isShown(card)).toBe(true);
    expect(surfaceOf(card).hasAttribute('data-open')).toBe(false);
    await gone(card);
  });
});

describe('findings of the Copilot review of the first head', () => {
  it('a long unbroken word in the meta wraps inside the card instead of overflowing it', async () => {
    const card = await mount({ meta: 'x'.repeat(150), open: true });
    await opened(card);
    const surface = surfaceOf(card);
    const text = surface.querySelector('.meta-text') as HTMLElement;
    expect(text.getBoundingClientRect().right).toBeLessThanOrEqual(surface.getBoundingClientRect().right);
    expect(text.scrollWidth).toBeLessThanOrEqual(text.clientWidth + 1);
  });

  it('an open card moved to another parent is shown again', async () => {
    const card = await mount({ open: true });
    await opened(card);
    const box = document.createElement('div');
    document.body.append(box);
    box.append(card);
    await card.updateComplete;
    await vi.waitFor(() => expect(isShown(card)).toBe(true));
    expect(card.hasAttribute('open')).toBe(true);
  });

  it('after Esc, the pointer entering the link and Tab leaving before the wait ends does not reopen it', async () => {
    const card = await mount({ openDelay: '400ms' });
    await tabTo(card);
    await opened(card);
    await userEvent.keyboard('{Escape}');
    await vi.waitFor(() => expect(card.open).toBe(false));
    await userEvent.hover(linkOf(card));
    await userEvent.tab();
    await pause(700);
    expect(card.open).toBe(false);
    expect(isShown(card)).toBe(false);
  });

  it('the pointer coming back while the card leaves keeps it, with no new wait', async () => {
    const card = await mount({ openDelay: '5000ms', closeDelay: '30ms' });
    card.style.setProperty('--nph-hover-card-exit-duration', '1500ms');
    await hoverOpenFast(card);
    await userEvent.unhover(linkOf(card));
    await vi.waitFor(() => expect(card.open).toBe(false), { timeout: 2000 });
    /* Leaving: `open` is off, the card is still in the top layer. */
    expect(isShown(card)).toBe(true);
    await userEvent.hover(linkOf(card));
    await vi.waitFor(() => expect(card.open).toBe(true), { timeout: 500 });
    await pause(1700);
    expect(isShown(card)).toBe(true);
  });

  it('Esc during the close delay does not keep the next hover closed', async () => {
    const card = await mount({ closeDelay: '2500ms' });
    await hoverOpen(card);
    await userEvent.unhover(linkOf(card));
    await pause(100);
    expect(card.open).toBe(true);
    await userEvent.keyboard('{Escape}');
    await vi.waitFor(() => expect(card.open).toBe(false));
    await gone(card);
    await userEvent.hover(linkOf(card));
    await opened(card);
  });
});

describe('findings of the Copilot review of the second head', () => {
  it('a close timer left by an earlier opening does not close a card turned on again', async () => {
    const card = await mount({ closeDelay: '600ms' });
    await hoverOpen(card);
    await userEvent.unhover(linkOf(card));
    /* The close delay is pending. The application turns the card off and on again. */
    card.open = false;
    await card.updateComplete;
    card.open = true;
    await card.updateComplete;
    await pause(1200);
    expect(card.open).toBe(true);
    expect(isShown(card)).toBe(true);
  });

  it('an update of the content alone does not cancel the pending close', async () => {
    const card = await mount({ closeDelay: '300ms' });
    await hoverOpen(card);
    await userEvent.unhover(linkOf(card));
    card.heading = 'Another title';
    await card.updateComplete;
    await vi.waitFor(() => expect(card.open).toBe(false), { timeout: 2000 });
  });

  it('the card goes away with its link when a scrolling ancestor clips the link, and comes back with it', async () => {
    /* The link sits below the box, inside the window: only the box clips it. */
    const box = document.createElement('div');
    box.style.cssText = 'position:fixed;left:200px;top:100px;width:200px;height:80px;overflow:auto';
    const above = document.createElement('div');
    above.style.height = '300px';
    const below = document.createElement('div');
    below.style.height = '600px';
    box.append(above);
    document.body.append(box);
    const card = await mount({ open: true, style: 'display:inline-block', parent: box });
    box.append(below);
    await opened(card);
    const link = linkOf(card).getBoundingClientRect();
    expect(link.top).toBeGreaterThan(180);
    expect(link.bottom).toBeLessThan(window.innerHeight);
    await vi.waitFor(() => expect(surfaceOf(card).style.visibility).toBe('hidden'), { timeout: 2000 });
    box.scrollTop = 250;
    await vi.waitFor(() => expect(surfaceOf(card).style.visibility).toBe(''), { timeout: 2000 });
    box.scrollTop = 0;
    await vi.waitFor(() => expect(surfaceOf(card).style.visibility).toBe('hidden'), { timeout: 2000 });
  });
});

describe('findings of the Copilot review of the third head', () => {
  it('in a window too short for any side the card stays beside the link and never covers it', async () => {
    await page.viewport(414, 200);
    try {
      const long = 'A long summary of the destination, long enough to make the card taller than the window. '.repeat(4);
      const card = await mount({ open: true, description: long, style: 'position:fixed;left:150px;top:90px' });
      await opened(card);
      const link = linkOf(card).getBoundingClientRect();
      const surface = surfaceOf(card).getBoundingClientRect();
      expect(surface.height).toBeGreaterThan(200);
      const overlap = surface.left < link.right && surface.right > link.left && surface.top < link.bottom && surface.bottom > link.top;
      expect(overlap).toBe(false);
      /* The link answers the pointer: the point at its center is the link, not the card. */
      const hit = document.elementFromPoint(link.left + link.width / 2, link.top + link.height / 2);
      expect(hit).toBe(card);
    } finally {
      await page.viewport(414, 896);
    }
  });
});

describe('the closed card takes no room and no pointer', () => {
  it('a card never opened is not in the layout', async () => {
    const card = await mount();
    const surface = surfaceOf(card);
    expect(getComputedStyle(surface).display).toBe('none');
    expect(surface.getBoundingClientRect().width).toBe(0);
  });

  it('after it closes, the card leaves the layout and the pointer on its old place does not reopen it', async () => {
    const card = await mount({ closeDelay: '20ms' });
    await hoverOpen(card);
    const where = surfaceOf(card).getBoundingClientRect();
    await userEvent.unhover(linkOf(card));
    await vi.waitFor(() => expect(card.open).toBe(false), { timeout: 2000 });
    await gone(card);
    expect(getComputedStyle(surfaceOf(card)).display).toBe('none');
    expect(surfaceOf(card).getBoundingClientRect().width).toBe(0);
    await userEvent.hover(document.body, { position: { x: Math.round(where.left + 20), y: Math.round(where.top + 20) } });
    await pause(250);
    expect(card.open).toBe(false);
  });
});

describe('open from code', () => {
  it('open on mount shows the card next to the link', async () => {
    const card = await mount({ open: true });
    await opened(card);
    const link = linkOf(card).getBoundingClientRect();
    const surface = surfaceOf(card).getBoundingClientRect();
    expect(surface.top).toBeGreaterThan(link.bottom);
  });

  it('the card stays on the link when the page scrolls under it', async () => {
    const spacer = document.createElement('div');
    spacer.style.height = '3000px';
    document.body.append(spacer);
    const card = await mount({ open: true, style: 'position:absolute;left:300px;top:300px' });
    await opened(card);
    const before = surfaceOf(card).getBoundingClientRect().top - linkOf(card).getBoundingClientRect().top;
    window.scrollTo(0, 100);
    await pause(100);
    const after = surfaceOf(card).getBoundingClientRect().top - linkOf(card).getBoundingClientRect().top;
    expect(after).toBeCloseTo(before, 0);
    window.scrollTo(0, 0);
  });

  it('while the link is outside the window, the card is not drawn at the edge', async () => {
    const spacer = document.createElement('div');
    spacer.style.height = '4000px';
    document.body.append(spacer);
    const card = await mount({ open: true, style: 'position:absolute;left:300px;top:300px' });
    await opened(card);
    window.scrollTo(0, 2000);
    await pause(100);
    expect(surfaceOf(card).style.visibility).toBe('hidden');
    window.scrollTo(0, 0);
    await pause(100);
    expect(surfaceOf(card).style.visibility).toBe('');
  });
});

describe('placement and distances', () => {
  /* The card is 320 wide: the default test window (414) is too narrow to show its room. */
  beforeAll(() => page.viewport(900, 700));
  afterAll(() => page.viewport(414, 896));

  const sides: NphHoverCardSide[] = ['bottom', 'top', 'left', 'right'];

  it('bottom by default, 4 from the link', async () => {
    const card = await mount({ open: true });
    await opened(card);
    const link = linkOf(card).getBoundingClientRect();
    const surface = surfaceOf(card).getBoundingClientRect();
    expect(surface.top - link.bottom).toBe(4);
    expect(surfaceOf(card).getAttribute('data-side')).toBe('bottom');
  });

  for (const side of sides) {
    it(`${side}: 4 from the link without the arrow, 320 wide, inside the window`, async () => {
      const card = await mount({ open: true, side, style: 'position:fixed;left:500px;top:300px' });
      await opened(card);
      const link = linkOf(card).getBoundingClientRect();
      const surface = surfaceOf(card).getBoundingClientRect();
      const distance = {
        bottom: surface.top - link.bottom,
        top: link.top - surface.bottom,
        right: surface.left - link.right,
        left: link.left - surface.right,
      }[side];
      expect(distance).toBe(4);
      expect(surface.width).toBe(320);
      expect(surfaceOf(card).getAttribute('data-side')).toBe(side);
      expect(surface.left).toBeGreaterThanOrEqual(0);
      expect(surface.right).toBeLessThanOrEqual(document.documentElement.clientWidth);
    });

    it(`${side}: with the arrow the card sits 11 away: offset + arrow height - border width`, async () => {
      const card = await mount({ open: true, side, arrow: true, style: 'position:fixed;left:500px;top:300px' });
      await opened(card);
      const link = linkOf(card).getBoundingClientRect();
      const surface = surfaceOf(card).getBoundingClientRect();
      const distance = {
        bottom: surface.top - link.bottom,
        top: link.top - surface.bottom,
        right: surface.left - link.right,
        left: link.left - surface.right,
      }[side];
      expect(distance).toBe(11);
      expect(px('--nph-hover-card-offset') + px('--nph-hover-card-arrow-height') - px('--nph-hover-card-border-width')).toBe(11);
    });
  }

  /* The center of a box along the cross axis of its side: x for top and bottom, y for left and right. */
  const centerAlong = (box: DOMRect, side: NphHoverCardSide): number =>
    side === 'top' || side === 'bottom' ? box.left + box.width / 2 : box.top + box.height / 2;

  for (const side of sides) {
    it(`${side}: without the arrow the card is centered on the link (D-2)`, async () => {
      const card = await mount({ open: true, side, label: 'See Nephos now', style: 'position:fixed;left:400px;top:300px' });
      await opened(card);
      const link = linkOf(card).getBoundingClientRect();
      const surface = surfaceOf(card).getBoundingClientRect();
      expect(surfaceOf(card).getAttribute('data-side')).toBe(side);
      expect(Math.abs(centerAlong(surface, side) - centerAlong(link, side))).toBeLessThanOrEqual(1);
    });

    it(`${side}: with the arrow the arrow is 16 from the card corner and the tip is on the link center`, async () => {
      const card = await mount({ open: true, side, arrow: true, label: 'See Nephos now', style: 'position:fixed;left:400px;top:300px' });
      await opened(card);
      const link = linkOf(card).getBoundingClientRect();
      const surface = surfaceOf(card).getBoundingClientRect();
      const arrow = (card.shadowRoot?.querySelector('.arrow') as SVGElement).getBoundingClientRect();
      const inset = px('--nph-hover-card-arrow-inset');
      if (side === 'top' || side === 'bottom') {
        expect(arrow.left - surface.left).toBe(inset);
      } else {
        expect(arrow.top - surface.top).toBe(inset);
      }
      expect(Math.abs(centerAlong(arrow, side) - centerAlong(link, side))).toBeLessThanOrEqual(1);
      /* The card is not centered on the link: the arrow rule moves it. */
      expect(Math.abs(centerAlong(surface, side) - centerAlong(link, side))).toBeGreaterThan(1);
    });
  }

  it('turning the arrow on moves the card along the link and turning it off puts it back', async () => {
    const card = await mount({ open: true, style: 'position:fixed;left:500px;top:300px' });
    await opened(card);
    const centered = surfaceOf(card).getBoundingClientRect().left;
    card.arrow = true;
    await card.updateComplete;
    await vi.waitFor(() => expect(surfaceOf(card).getBoundingClientRect().left).not.toBe(centered));
    card.arrow = false;
    await card.updateComplete;
    await vi.waitFor(() => expect(surfaceOf(card).getBoundingClientRect().left).toBe(centered));
  });

  it('without the arrow the card near the window edge is pushed back inside it, not centered', async () => {
    const left = await mount({ open: true, label: 'N', style: 'position:fixed;left:4px;top:300px' });
    await opened(left);
    const leftSurface = surfaceOf(left).getBoundingClientRect();
    expect(leftSurface.left).toBe(0);
    expect(centerAlong(leftSurface, 'bottom')).not.toBeCloseTo(centerAlong(linkOf(left).getBoundingClientRect(), 'bottom'), 0);
    left.remove();
    const right = await mount({ open: true, label: 'N', style: 'position:fixed;right:4px;top:300px' });
    await opened(right);
    expect(surfaceOf(right).getBoundingClientRect().right).toBe(document.documentElement.clientWidth);
    right.remove();
    const top = await mount({ open: true, side: 'right', label: 'N', style: 'position:fixed;left:200px;top:4px' });
    await opened(top);
    const topSurface = surfaceOf(top).getBoundingClientRect();
    expect(surfaceOf(top).getAttribute('data-side')).toBe('right');
    expect(topSurface.top).toBe(0);
  });

  it('flips to the opposite side when the preferred one does not fit', async () => {
    const card = await mount({ open: true, side: 'bottom', style: `position:fixed;left:300px;bottom:10px` });
    await opened(card);
    expect(surfaceOf(card).getAttribute('data-side')).toBe('top');
    const card2 = await mount({ open: true, side: 'top', style: 'position:fixed;left:300px;top:10px' });
    await opened(card2);
    expect(surfaceOf(card2).getAttribute('data-side')).toBe('bottom');
  });

  it('never leaves the window at the edges', async () => {
    const left = await mount({ open: true, style: 'position:fixed;left:2px;top:200px' });
    await opened(left);
    expect(surfaceOf(left).getBoundingClientRect().left).toBeGreaterThanOrEqual(0);
    left.remove();
    const right = await mount({ open: true, style: 'position:fixed;right:2px;top:200px' });
    await opened(right);
    expect(surfaceOf(right).getBoundingClientRect().right).toBeLessThanOrEqual(document.documentElement.clientWidth);
  });

  it('lives in the top layer: no ancestor with overflow cuts it and it has no z-index', async () => {
    const box = document.createElement('div');
    box.style.cssText = 'position:fixed;left:300px;top:300px;width:60px;height:30px;overflow:hidden;transform:translateZ(0)';
    document.body.append(box);
    const card = await mount({ open: true, style: '', parent: box });
    await opened(card);
    const surface = surfaceOf(card).getBoundingClientRect();
    expect(surface.height).toBeGreaterThan(30);
    expect(getComputedStyle(surfaceOf(card)).zIndex).toBe('auto');
  });

  it('in right-to-left writing the card is still centered on the link without the arrow', async () => {
    const wrap = document.createElement('div');
    wrap.dir = 'rtl';
    document.body.append(wrap);
    const rtl = await mount({ open: true, label: 'See Nephos now', style: 'position:fixed;left:600px;top:300px', parent: wrap });
    await opened(rtl);
    const surface = surfaceOf(rtl).getBoundingClientRect();
    const link = linkOf(rtl).getBoundingClientRect();
    expect(Math.abs(surface.left + surface.width / 2 - (link.left + link.width / 2))).toBeLessThanOrEqual(1);
  });

  it('in right-to-left writing the card with the arrow starts at the right of the link', async () => {
    const ltr = await mount({ open: true, arrow: true, style: 'position:fixed;left:600px;top:300px' });
    await opened(ltr);
    const left = surfaceOf(ltr).getBoundingClientRect();
    const link = linkOf(ltr).getBoundingClientRect();
    expect(left.left).toBeLessThan(link.left);
    expect(left.right).toBeGreaterThan(link.right);
    ltr.remove();
    const wrap = document.createElement('div');
    wrap.dir = 'rtl';
    document.body.append(wrap);
    const rtl = await mount({ open: true, arrow: true, style: 'position:fixed;left:600px;top:300px', parent: wrap });
    await opened(rtl);
    const surface = surfaceOf(rtl).getBoundingClientRect();
    const rtlLink = linkOf(rtl).getBoundingClientRect();
    const arrowCenterShift = px('--nph-hover-card-arrow-inset') + px('--nph-hover-card-arrow-width') / 2;
    expect(surface.right).toBeCloseTo(rtlLink.left + rtlLink.width / 2 + arrowCenterShift, 0);
  });
});

describe('the arrow', () => {
  /* The card is 320 wide: the default test window (414) is too narrow to show its room. */
  beforeAll(() => page.viewport(900, 700));
  afterAll(() => page.viewport(414, 896));

  it('is drawn only with the arrow property, and is decorative', async () => {
    const without = await mount({ open: true });
    expect(without.shadowRoot?.querySelector('.arrow')).toBeNull();
    without.remove();
    const card = await mount({ open: true, arrow: true });
    const arrow = card.shadowRoot?.querySelector('.arrow') as SVGElement;
    expect(arrow.getAttribute('aria-hidden')).toBe('true');
    expect(arrow.getAttribute('focusable')).toBe('false');
  });

  for (const side of ['bottom', 'top', 'left', 'right'] as const) {
    it(`${side}: 16 x 8 (rotated for the sides), its base on the card edge and its tip 4 from the link`, async () => {
      const card = await mount({ open: true, side, arrow: true, style: 'position:fixed;left:500px;top:300px' });
      await opened(card);
      const arrow = (card.shadowRoot?.querySelector('.arrow') as SVGElement).getBoundingClientRect();
      const surface = surfaceOf(card).getBoundingClientRect();
      const link = linkOf(card).getBoundingClientRect();
      const horizontal = side === 'top' || side === 'bottom';
      expect([arrow.width, arrow.height]).toEqual(horizontal ? [16, 8] : [8, 16]);
      const tipDistance = {
        bottom: arrow.top - link.bottom,
        top: link.top - arrow.bottom,
        right: arrow.left - link.right,
        left: link.left - arrow.right,
      }[side];
      expect(tipDistance).toBe(4);
      /* The base overlaps the card by the width of its border. */
      const overlap = {
        bottom: arrow.bottom - surface.top,
        top: surface.bottom - arrow.top,
        right: arrow.right - surface.left,
        left: surface.right - arrow.left,
      }[side];
      expect(overlap).toBe(1);
    });

    it(`${side}: the tip points to the center of the link`, async () => {
      const card = await mount({ open: true, side, arrow: true, style: 'position:fixed;left:500px;top:300px' });
      await opened(card);
      const arrow = (card.shadowRoot?.querySelector('.arrow') as SVGElement).getBoundingClientRect();
      const link = linkOf(card).getBoundingClientRect();
      if (side === 'top' || side === 'bottom') {
        expect(arrow.left + arrow.width / 2).toBeCloseTo(link.left + link.width / 2, 0);
      } else {
        expect(arrow.top + arrow.height / 2).toBeCloseTo(link.top + link.height / 2, 0);
      }
    });
  }

  it('is 16 from the card corner when the card has room', async () => {
    const card = await mount({ open: true, arrow: true, style: 'position:fixed;left:500px;top:300px' });
    await opened(card);
    const arrow = (card.shadowRoot?.querySelector('.arrow') as SVGElement).getBoundingClientRect();
    const surface = surfaceOf(card).getBoundingClientRect();
    expect(arrow.left - surface.left).toBe(px('--nph-hover-card-arrow-inset'));
  });

  it('keeps pointing to the link when the window pushes the card', async () => {
    await page.viewport(340, 700);
    try {
      const card = await mount({ open: true, arrow: true, style: 'position:fixed;left:200px;top:300px' });
      await opened(card);
      const surface = surfaceOf(card).getBoundingClientRect();
      const link = linkOf(card).getBoundingClientRect();
      const arrow = (card.shadowRoot?.querySelector('.arrow') as SVGElement).getBoundingClientRect();
      /* The card is pushed to fit the window: it ends at the right edge. */
      expect(surface.right).toBe(340);
      expect(surface.left).toBeGreaterThan(0);
      expect(arrow.left + arrow.width / 2).toBeCloseTo(link.left + link.width / 2, 0);
    } finally {
      await page.viewport(900, 700);
    }
  });

  it('stays inside the rounded corners when the link is nearer the edge than the corner', async () => {
    const left = await mount({ open: true, arrow: true, label: 'N', style: 'position:fixed;left:4px;top:300px' });
    await opened(left);
    const leftArrow = (left.shadowRoot?.querySelector('.arrow') as SVGElement).getBoundingClientRect();
    const leftSurface = surfaceOf(left).getBoundingClientRect();
    expect(leftSurface.left).toBe(0);
    expect(leftArrow.left - leftSurface.left).toBeGreaterThanOrEqual(px('--nph-hover-card-radius'));
    left.remove();
    const right = await mount({ open: true, arrow: true, label: 'N', style: 'position:fixed;right:4px;top:300px' });
    await opened(right);
    const rightArrow = (right.shadowRoot?.querySelector('.arrow') as SVGElement).getBoundingClientRect();
    const rightSurface = surfaceOf(right).getBoundingClientRect();
    expect(rightSurface.right - rightArrow.right).toBeGreaterThanOrEqual(px('--nph-hover-card-radius'));
  });

  it('paints the fill of the card and the outline of its border', async () => {
    const card = await mount({ open: true, arrow: true });
    await opened(card);
    const arrow = card.shadowRoot?.querySelector('.arrow') as SVGElement;
    const style = getComputedStyle(arrow);
    expect(style.fill).toBe(paint('--nph-hover-card-background'));
    expect(style.stroke).toBe(paint('--nph-hover-card-border'));
    expect(Number.parseFloat(style.strokeWidth)).toBe(px('--nph-hover-card-border-width'));
  });
});

describe('the card as a surface', () => {
  it('has the fill, border, radius and shadow of the contract, in both themes', async () => {
    for (const scheme of SCHEMES) {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const card = await mount({ open: true });
      await opened(card);
      const style = getComputedStyle(surfaceOf(card));
      expect(style.backgroundColor, scheme).toBe(paint('--nph-color-popover'));
      expect(style.borderTopColor, scheme).toBe(paint('--nph-color-border-subtle'));
      expect(style.borderTopWidth, scheme).toBe('1px');
      expect(style.borderTopLeftRadius, scheme).toBe('14px');
      expect(style.boxShadow, scheme).toBe(resolved('box-shadow', '--nph-elevation-dropdown'));
      card.remove();
    }
  });

  it('the card is read only: no interactive element and no focus', async () => {
    const card = await mount({ open: true, arrow: true });
    await opened(card);
    const surface = surfaceOf(card);
    expect(surface.querySelectorAll('a, button, input, select, textarea, [tabindex], [contenteditable]').length).toBe(0);
    expect(surface.hasAttribute('tabindex')).toBe(false);
    expect(surface.hasAttribute('role')).toBe(false);
  });

  it('the link does not point to the card (no aria-describedby, no aria-labelledby)', async () => {
    const card = await mount({ open: true });
    const link = linkOf(card);
    expect(link.hasAttribute('aria-describedby')).toBe(false);
    expect(link.hasAttribute('aria-labelledby')).toBe(false);
    expect(card.hasAttribute('aria-describedby')).toBe(false);
  });

  it('is a manual popover in the top layer', async () => {
    const card = await mount({ open: true });
    await opened(card);
    expect(surfaceOf(card).getAttribute('popover')).toBe('manual');
    expect(surfaceOf(card).matches(':popover-open')).toBe(true);
  });

  it('light dismiss does not close it: only the holds, Esc and the code do', async () => {
    const card = await mount({ open: true });
    await opened(card);
    document.body.click();
    await pause(100);
    expect(isShown(card)).toBe(true);
  });
});

describe('the focus of the link', () => {
  it('shows a 1 px border in focus/border and, outside it, the 4 px halo in focus/halo', async () => {
    const card = await mount();
    await tabTo(card);
    const link = linkOf(card);
    expect(link.matches(':focus-visible')).toBe(true);
    const before = getComputedStyle(link, '::before');
    const after = getComputedStyle(link, '::after');
    expect(before.borderTopColor).toBe(paint('--nph-focus-border'));
    expect(before.borderTopWidth).toBe('1px');
    expect(after.borderTopColor).toBe(paint('--nph-focus-halo'));
    expect(after.borderTopWidth).toBe(`${px('--nph-focus-ring-width')}px`);
    expect(px('--nph-focus-ring-width')).toBe(4);
  });

  it('the corners follow focus/border-radius-inner and focus/radius-inner-with-border', async () => {
    const card = await mount();
    await tabTo(card);
    const link = linkOf(card);
    expect(getComputedStyle(link, '::before').borderTopLeftRadius).toBe(`${px('--nph-focus-border-radius-inner')}px`);
    expect(getComputedStyle(link, '::after').borderTopLeftRadius).toBe(`${px('--nph-focus-radius-inner-with-border')}px`);
  });

  it('has no focus layers when the link is not focused', async () => {
    const card = await mount();
    expect(getComputedStyle(linkOf(card), '::before').content).toBe('none');
  });

  it('follows the brand in both themes', async () => {
    for (const scheme of SCHEMES) {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const card = await mount();
      await tabTo(card);
      expect(getComputedStyle(linkOf(card), '::before').borderTopColor, scheme).toBe(paint('--nph-focus-border'));
      expect(getComputedStyle(linkOf(card), '::after').borderTopColor, scheme).toBe(paint('--nph-focus-halo'));
      card.remove();
    }
  });
});

describe('motion', () => {
  it('enters on hover-card/enter-duration and leaves on hover-card/exit-duration, by opacity only', async () => {
    const card = await mount();
    const surface = surfaceOf(card);
    expect(getComputedStyle(surface).transitionProperty).toBe('opacity');
    expect(getComputedStyle(surface).transitionDuration).toBe(`${Number.parseFloat(resolved('--x', '--nph-hover-card-exit-duration')) / 1000}s`);
    card.open = true;
    await opened(card);
    expect(getComputedStyle(surface).transitionDuration).toBe(`${Number.parseFloat(resolved('--x', '--nph-hover-card-enter-duration')) / 1000}s`);
  });
});

describe('token contract', () => {
  const css = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');

  it('consumes only --nph-* custom properties, plus its private --_gap', () => {
    const used = [...css.matchAll(/var\((--[\w-]+)/g)].map((match) => match[1] as string);
    expect(used.length).toBeGreaterThan(0);
    for (const name of used) {
      expect(name.startsWith('--nph-') || name === '--_gap', name).toBe(true);
    }
  });

  it('every token it consumes exists in the generated CSS', () => {
    const used = new Set([...css.matchAll(/var\((--nph-[\w-]+)/g)].map((match) => match[1] as string));
    for (const name of used) {
      expect(tokensCss.includes(`${name}:`), name).toBe(true);
    }
  });

  it('never reads a core or theme token', () => {
    expect(css).not.toMatch(/var\(--nph-(core|theme)-/);
  });

  it('writes no literal color, length, time or font value', () => {
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(css).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/);
    expect(css.replace(/var\([^)]*\)/g, '')).not.toMatch(/-?\d*\.?\d+(px|rem|em|ms|s|vh|vw|%)\b/);
  });

  it('declares no custom property of its own beyond the private --_gap', () => {
    const declared = [...css.matchAll(/^\s*(--[\w-]+)\s*:/gm)].map((match) => match[1]);
    expect(new Set(declared)).toEqual(new Set(['--_gap']));
  });

  it('exposes no ::part', () => {
    expect(componentSource).not.toMatch(/part=/);
  });

  it('the hover-card tokens the contract names exist', () => {
    for (const token of [
      'background',
      'foreground',
      'description-foreground',
      'meta-foreground',
      'meta-icon-foreground',
      'border',
      'border-width',
      'radius',
      'padding',
      'gap',
      'meta-gap',
      'icon-size',
      'width',
      'offset',
      'arrow-width',
      'arrow-height',
      'arrow-inset',
      'focus-border',
      'focus-halo',
      'open-delay',
      'close-delay',
      'enter-duration',
      'exit-duration',
    ]) {
      expect(tokensCss.includes(`--nph-hover-card-${token}:`), token).toBe(true);
    }
  });

  it('the radius, the offset and the arrow are the values of the contract', () => {
    expect(px('--nph-hover-card-radius')).toBe(14);
    expect(px('--nph-hover-card-offset')).toBe(4);
    expect(px('--nph-hover-card-arrow-width')).toBe(16);
    expect(px('--nph-hover-card-arrow-height')).toBe(8);
    expect(px('--nph-hover-card-arrow-inset')).toBe(16);
  });

  it('with reduced motion the card still enters and leaves, on motion/hover-duration', () => {
    expect(css).toMatch(/prefers-reduced-motion: reduce[\s\S]*var\(--nph-motion-hover-duration\)/);
  });
});

/** The accessibility node the browser computes for an element. */
async function axNode(element: Element): Promise<AxNode | undefined> {
  const { cdp } = await import('vitest/browser');
  const session = cdp();
  await session.send('Accessibility.enable');
  element.setAttribute('data-ax-probe', '');
  try {
    await session.send('DOM.getDocument', { depth: -1, pierce: true });
    const { searchId, resultCount } = await session.send('DOM.performSearch', { query: '[data-ax-probe]' });
    expect(resultCount).toBe(1);
    const { nodeIds } = await session.send('DOM.getSearchResults', { searchId, fromIndex: 0, toIndex: 1 });
    await session.send('DOM.discardSearchResults', { searchId });
    const { nodes } = await session.send('Accessibility.getPartialAXTree', { nodeId: nodeIds[0] as number, fetchRelatives: false });
    return nodes[0] as AxNode | undefined;
  } finally {
    element.removeAttribute('data-ax-probe');
  }
}
