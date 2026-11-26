/**
 * Tests of `nph-card` (P130), in a real browser (P21, item 5): the box, the gaps, the resolved colors, the stretched
 * link, the focus and the frame of the media only exist where there is layout.
 *
 * They prove the contract accepted in Figma (documentation frame `6516:13647`, root `6478:6670`, sets `6478:6673` and
 * `6478:7282`), recorded in the evidence of the `figma-docs-accepted` gate of DSA-88: the API and the invalid input,
 * the anatomy and its tokens, the parts that turn on and off, the three types, the two surfaces, the two densities,
 * the four media options, the start, the title and the status, the clickable card (link, stretch, hover, focus and
 * disabled), the section region and its list, loading, what the card does to the pieces by instance, the absence of
 * what it does not have, and the token contract.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '@fontsource/noto-sans/latin-600.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-card.css?raw';
import componentSource from './nph-card.ts?raw';
import {
  NPH_CARD_DENSITIES,
  NPH_CARD_HEADING_LEVELS,
  NPH_CARD_MEDIA,
  NPH_CARD_SURFACES,
  NPH_CARD_TYPES,
  NphCard,
  isSafeHref,
} from './nph-card';
import '../nph-avatar/nph-avatar';
import '../nph-badge/nph-badge';
import '../nph-button/nph-button';
import '../nph-image/nph-image';

beforeAll(async () => {
  await document.fonts.load('400 14px "Noto Sans"');
  await document.fonts.load('500 14px "Noto Sans"');
  await document.fonts.load('600 14px "Noto Sans"');
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

/** A tiny transparent image, so `nph-image` has a `src` that loads without the network. */
const PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

interface MountOptions {
  props?: Partial<NphCard>;
  attrs?: Record<string, string>;
  /** The light DOM of the card: slotted pieces. */
  children?: string;
  width?: string;
}

/** A card with a title, in a block of its own width. */
async function mount(options: MountOptions = {}): Promise<NphCard> {
  const holder = document.createElement('div');
  holder.style.inlineSize = options.width ?? '30rem';
  const card = document.createElement('nph-card');
  card.setAttribute('heading', 'Order 1042');
  for (const [name, value] of Object.entries(options.attrs ?? {})) card.setAttribute(name, value);
  Object.assign(card, options.props ?? {});
  card.innerHTML = options.children ?? '';
  holder.append(card);
  document.body.append(holder);
  await settle(card);
  return card;
}

/** Lets the card, the pieces it draws and the ones slotted into it render. */
async function settle(card: NphCard): Promise<void> {
  await card.updateComplete;
  await frame();
  const inner = [...(card.shadowRoot?.querySelectorAll('nph-icon, nph-separator, nph-skeleton') ?? []), ...card.querySelectorAll('*')];
  for (const piece of inner) {
    const updating = (piece as HTMLElement & { updateComplete?: Promise<unknown> }).updateComplete;
    if (updating !== undefined) await updating;
  }
  await card.updateComplete;
  await frame();
}

const root = (card: NphCard): ShadowRoot => card.shadowRoot as ShadowRoot;
const part = <T extends HTMLElement = HTMLElement>(card: NphCard, selector: string): T => {
  const found = root(card).querySelector<T>(selector);
  if (found === null) throw new Error(`no ${selector} in the shadow root`);
  return found;
};
const has = (card: NphCard, selector: string): boolean => root(card).querySelector(selector) !== null;
const style = (element: Element, pseudo?: string): CSSStyleDeclaration => getComputedStyle(element, pseudo);

/** A probe in the page that resolves a token the way the browser does, in the scope of the element. */
function resolved(scope: Element, property: string, token: string): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  /* Beside the card, not inside it: while it loads, the card has no slot to show a child of its own. */
  (scope.parentElement ?? scope).append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

/** The comments of the CSS taken away, so a rule is read and not the prose about it. */
const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');

const rect = (element: Element): DOMRect => element.getBoundingClientRect();
const px = (value: string): number => Number.parseFloat(value);

const ACTION = '<nph-button slot="action" severity="secondary" emphasis="ghost" size="compact" icon-start="ellipsis-vertical" label="More options for Order 1042"></nph-button>';
const FOOTER = '<nph-button slot="footer" severity="secondary" text="Cancel"></nph-button><nph-button slot="footer" text="Approve"></nph-button>';

/* ----- registration and API -------------------------------------------------------------------------------- */

describe('registration and API', () => {
  it('defines nph-card exactly once', () => {
    expect(customElements.get('nph-card')).toBe(NphCard);
  });

  it('the public API is exactly the one the sheet declares', () => {
    const declared = [...(NphCard as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()].sort();
    expect(declared).toEqual(
      [
        'type',
        'surface',
        'media',
        'density',
        'disabled',
        'loading',
        'heading',
        'headingLevel',
        'description',
        'icon',
        'href',
        'loadingLabel',
        'hideDivider',
        'items',
        'present',
      ].sort(),
    );
  });

  it('the lists are the ones of the accepted contract', () => {
    expect([...NPH_CARD_TYPES]).toEqual(['base', 'clickable', 'section']);
    expect([...NPH_CARD_SURFACES]).toEqual(['elevated', 'outlined']);
    expect([...NPH_CARD_MEDIA]).toEqual(['none', 'top', 'inset-top', 'side']);
    expect([...NPH_CARD_DENSITIES]).toEqual(['default', 'compact']);
    expect([...NPH_CARD_HEADING_LEVELS]).toEqual([2, 3, 4, 5, 6]);
  });

  it('the defaults are base, elevated, no media and the default density, heading level 3', async () => {
    const card = await mount();
    expect(card.type).toBe('base');
    expect(card.surface).toBe('elevated');
    expect(card.media).toBe('none');
    expect(card.density).toBe('default');
    expect(card.headingLevel).toBe(3);
    expect(card.disabled).toBe(false);
    expect(card.loading).toBe(false);
    expect(card.hideDivider).toBe(false);
  });

  it('type, surface, media, density, disabled and loading reflect, because the internal CSS selects by them', async () => {
    const card = await mount({ props: { type: 'section', surface: 'outlined', density: 'compact', loading: true } });
    expect(card.getAttribute('type')).toBe('section');
    expect(card.getAttribute('surface')).toBe('outlined');
    expect(card.getAttribute('density')).toBe('compact');
    expect(card.hasAttribute('loading')).toBe(true);
    card.media = 'top';
    await card.updateComplete;
    expect(card.getAttribute('media')).toBe('top');
  });

  it('the text properties do not reflect', async () => {
    const card = await mount({ props: { heading: 'A', description: 'B', icon: 'folder', loadingLabel: 'Loading' } });
    for (const name of ['description', 'icon', 'loading-label']) expect(card.hasAttribute(name)).toBe(false);
  });

  it('is exported with a safe-link rule: http, https, mailto, tel and relative only', () => {
    expect(isSafeHref('https://example.com/a')).toBe(true);
    expect(isSafeHref('/orders/1042')).toBe(true);
    expect(isSafeHref('mailto:a@b.co')).toBe(true);
    expect(isSafeHref('javascript:alert(1)')).toBe(false);
    expect(isSafeHref('java\nscript:alert(1)')).toBe(false);
    expect(isSafeHref('data:text/html,x')).toBe(false);
  });
});

/* ----- invalid input ------------------------------------------------------------------------------------------ */

describe('invalid input draws nothing and says why, once per cause, in development', () => {
  const cases: Array<[string, Partial<NphCard>, string]> = [
    ['a type outside the list', { type: 'tile' as never }, 'type "tile"'],
    ['a surface outside the list', { surface: 'flat' as never }, 'surface "flat"'],
    ['a media outside the list', { media: 'bottom' as never }, 'media "bottom"'],
    ['a density outside the list', { density: 'dense' as never }, 'density "dense"'],
    ['a heading level outside the list', { headingLevel: 1 as never }, 'heading-level "1"'],
    ['an icon that is not a core name', { icon: 'not-an-icon' }, 'icon "not-an-icon"'],
    ['an empty heading', { heading: '   ' }, '"heading" is required'],
    ['a clickable card with no href', { type: 'clickable' }, 'needs an `href`'],
    ['a clickable card with an unsafe href', { type: 'clickable', href: 'javascript:alert(1)' }, 'unsafe'],
    ['an items value that is not a list of rows', { type: 'section', items: [{ key: '', value: 'x' }] }, '`items`'],
  ];

  for (const [name, props, message] of cases) {
    it(`${name}`, async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      const card = await mount({ props });
      expect(card.hasAttribute('data-nph-rendered')).toBe(false);
      expect(root(card).querySelector('.surface')).toBeNull();
      expect(style(card).display).toBe('none');
      expect(error.mock.calls.some(([text]) => String(text).includes(message))).toBe(true);
      card.requestUpdate();
      await card.updateComplete;
      const same = error.mock.calls.filter(([text]) => String(text).includes(message));
      expect(same).toHaveLength(1);
    });
  }

  it('a card that is loading needs no heading: the title is not drawn while it loads', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const card = await mount({ props: { heading: '', loading: true } });
    expect(card.hasAttribute('data-nph-rendered')).toBe(true);
    expect(error).not.toHaveBeenCalled();
  });

  it('a disabled clickable card needs no href', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const card = await mount({ props: { type: 'clickable', disabled: true } });
    expect(card.hasAttribute('data-nph-rendered')).toBe(true);
    expect(error).not.toHaveBeenCalled();
  });

  it('what a type does not have is ignored with a warning, and the card still draws', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const section = await mount({ props: { type: 'section', media: 'top' } });
    expect(section.hasAttribute('data-nph-rendered')).toBe(true);
    expect(has(section, '.media')).toBe(false);
    const base = await mount({ props: { href: '/x', disabled: true, items: [{ key: 'a', value: 'b' }] } });
    expect(base.hasAttribute('data-nph-rendered')).toBe(true);
    expect(has(base, '.link')).toBe(false);
    const messages = warn.mock.calls.map(([text]) => String(text));
    expect(messages.some((text) => text.includes('media is for the base and clickable'))).toBe(true);
    expect(messages.some((text) => text.includes('href is for the clickable type'))).toBe(true);
    expect(messages.some((text) => text.includes('disabled is for the clickable type'))).toBe(true);
    expect(messages.some((text) => text.includes('`items` is the key-value list of the section type'))).toBe(true);
  });

  it('the clickable card says that a header action and a tonal section are not drawn', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const card = await mount({ props: { type: 'clickable', href: '/x' }, children: `${ACTION}<p slot="section">x</p>` });
    expect(has(card, '.action')).toBe(false);
    expect(has(card, '.section')).toBe(false);
    const messages = warn.mock.calls.map(([text]) => String(text));
    expect(messages.some((text) => text.includes('no `action`'))).toBe(true);
    expect(messages.some((text) => text.includes('no `section`'))).toBe(true);
  });

  it('the start takes one piece at a time: the icon is ignored when the leading slot has content', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const card = await mount({ props: { icon: 'folder' }, children: '<nph-avatar slot="leading" label="Ana"></nph-avatar>' });
    expect(has(card, '.icon-box')).toBe(false);
    expect(warn.mock.calls.some(([text]) => String(text).includes('one piece at a time'))).toBe(true);
  });
});

/* ----- the surface and the anatomy ---------------------------------------------------------------------------------- */

describe('the surface', () => {
  it('has the background, the corner and the 1 px soft outline of its tokens', async () => {
    const card = await mount();
    const surface = style(card);
    expect(surface.backgroundColor).toBe(resolved(card, 'background-color', '--nph-card-background'));
    expect(surface.borderTopLeftRadius).toBe(resolved(card, 'border-top-left-radius', '--nph-card-radius'));
    for (const side of ['Top', 'Right', 'Bottom', 'Left'] as const) {
      expect(surface[`border${side}Width`]).toBe(resolved(card, 'width', '--nph-card-border-width'));
      expect(surface[`border${side}Color`]).toBe(resolved(card, 'color', '--nph-card-border'));
      expect(surface[`border${side}Style`]).toBe('solid');
    }
  });

  it('the elevated surface has the raised shadow and the outlined one has none', async () => {
    const elevated = await mount();
    const outlined = await mount({ props: { surface: 'outlined' } });
    expect(style(elevated).boxShadow).toBe(resolved(elevated, 'box-shadow', '--nph-elevation-raised'));
    expect(style(elevated).boxShadow).not.toBe('none');
    expect(style(outlined).boxShadow).toBe('none');
    expect(style(outlined).borderTopColor).toBe(resolved(outlined, 'color', '--nph-card-border'));
  });

  it('takes the width of its container, whatever the content', async () => {
    const card = await mount({ width: '24rem' });
    expect(rect(card).width).toBe(rect(card.parentElement as HTMLElement).width);
  });

  it('the body pads by the default and the compact tokens, and stacks by card/gap', async () => {
    const regular = await mount({ children: '<p>Text</p>' });
    const compact = await mount({ props: { density: 'compact' }, children: '<p>Text</p>' });
    expect(style(part(regular, '.body')).paddingTop).toBe(resolved(regular, 'padding-top', '--nph-card-padding'));
    expect(style(part(compact, '.body')).paddingTop).toBe(resolved(compact, 'padding-top', '--nph-card-padding-compact'));
    expect(style(part(regular, '.body')).rowGap).toBe(resolved(regular, 'row-gap', '--nph-card-gap'));
  });

  it('the header pieces are apart by card/header-item-gap, the title and the description by card/header-gap', async () => {
    const card = await mount({ props: { icon: 'folder', description: 'Paid on 12 March' }, children: ACTION });
    expect(style(part(card, '.header')).columnGap).toBe(resolved(card, 'column-gap', '--nph-card-header-item-gap'));
    expect(style(part(card, '.titles')).rowGap).toBe(resolved(card, 'row-gap', '--nph-card-header-gap'));
  });

  it('the title is text/heading-md in card/foreground, and text/heading-xs when compact', async () => {
    const regular = await mount();
    const compact = await mount({ props: { density: 'compact' } });
    for (const [card, role] of [
      [regular, 'heading-md'],
      [compact, 'heading-xs'],
    ] as const) {
      const heading = style(part(card, '.heading'));
      expect(heading.color).toBe(resolved(card, 'color', '--nph-card-foreground'));
      expect(heading.fontSize).toBe(resolved(card, 'font-size', `--nph-text-${role}-font-size`));
      expect(heading.fontWeight).toBe(resolved(card, 'font-weight', `--nph-text-${role}-font-weight`));
      expect(heading.lineHeight).toBe(resolved(card, 'line-height', `--nph-text-${role}-line-height`));
    }
  });

  it('the description is text/body-sm in card/description-foreground', async () => {
    const card = await mount({ props: { description: 'Paid on 12 March' } });
    const description = style(part(card, '.description'));
    expect(description.color).toBe(resolved(card, 'color', '--nph-card-description-foreground'));
    expect(description.fontSize).toBe(resolved(card, 'font-size', '--nph-text-body-sm-font-size'));
  });

  it('the content is text/body-md in card/foreground', async () => {
    const card = await mount({ children: '<p>Text</p>' });
    const content = style(part(card, '.content'));
    expect(content.color).toBe(resolved(card, 'color', '--nph-card-foreground'));
    expect(content.fontSize).toBe(resolved(card, 'font-size', '--nph-text-body-md-font-size'));
  });
});

/* ----- the parts that turn on and off --------------------------------------------------------------------------- */

describe('the parts that turn on and off', () => {
  it('start, description, status, action, tonal section and footer are off until there is something to show', async () => {
    const card = await mount();
    for (const selector of ['.leading', '.description']) expect(has(card, selector)).toBe(false);
    for (const selector of ['.status', '.action', '.section', '.footer', '.content']) {
      expect(style(part(card, selector)).display, selector).toBe('none');
    }
    expect(has(card, '.divider')).toBe(false);
  });

  it('turn on with their content, and the zones keep the names of the assembly model', async () => {
    const card = await mount({
      props: { icon: 'folder', description: 'Paid on 12 March' },
      children: `<nph-badge slot="status" text="Paid" severity="secondary" emphasis="light"></nph-badge>${ACTION}<p>Content</p><p slot="section">Band</p>${FOOTER}`,
    });
    for (const selector of ['.leading', '.status', '.action', '.content', '.section', '.footer']) {
      expect(style(part(card, selector)).display, selector).not.toBe('none');
    }
    expect(has(card, '.description')).toBe(true);
    expect(has(card, '.divider')).toBe(true);
    const slots = ['root', 'leading', 'title', 'status', 'action', 'description', 'content', 'section', 'divider', 'footer', 'media'];
    card.media = 'top';
    await settle(card);
    for (const name of slots) expect(has(card, `[data-slot="${name}"]`), name).toBe(true);
  });

  it('a part comes and goes with its content at run time', async () => {
    const card = await mount();
    const footer = document.createElement('nph-button');
    footer.setAttribute('slot', 'footer');
    footer.setAttribute('text', 'Approve');
    card.append(footer);
    await vi.waitFor(() => expect(has(card, '.divider')).toBe(true));
    footer.remove();
    await vi.waitFor(() => expect(has(card, '.divider')).toBe(false));
  });

  it('whitespace is not content', async () => {
    const card = await mount({ children: '\n   \n<span slot="status"></span>' });
    expect(style(part(card, '.content')).display).toBe('none');
  });

  it('the divider is on with the footer and hide-divider turns it off, keeping the footer', async () => {
    const card = await mount({ children: FOOTER });
    expect(has(card, '.divider')).toBe(true);
    card.hideDivider = true;
    await settle(card);
    expect(has(card, '.divider')).toBe(false);
    expect(style(part(card, '.footer')).display).not.toBe('none');
  });

  it('the footer actions sit at the end, apart by card/footer-gap and padded by card/footer-padding', async () => {
    const regular = await mount({ children: FOOTER });
    const compact = await mount({ props: { density: 'compact' }, children: FOOTER });
    const footer = style(part(regular, '.footer'));
    expect(footer.justifyContent).toBe('flex-end');
    expect(footer.columnGap).toBe(resolved(regular, 'column-gap', '--nph-card-footer-gap'));
    expect(footer.paddingTop).toBe(resolved(regular, 'padding-top', '--nph-card-footer-padding'));
    expect(style(part(compact, '.footer')).paddingTop).toBe(resolved(compact, 'padding-top', '--nph-card-footer-padding-compact'));
    const [first, second] = [...regular.querySelectorAll('nph-button')] as unknown as [HTMLElement, HTMLElement];
    expect(rect(first).left).toBeLessThan(rect(second).left);
    expect(rect(second).right).toBeLessThanOrEqual(rect(part(regular, '.footer')).right);
  });

  it('the tonal section is card/section-background with its radius, padding and gap, no border and no shadow', async () => {
    const card = await mount({ children: '<p slot="section">Label</p><p slot="section">Text</p>' });
    const section = style(part(card, '.section'));
    expect(section.backgroundColor).toBe(resolved(card, 'background-color', '--nph-card-section-background'));
    expect(section.borderTopLeftRadius).toBe(resolved(card, 'border-top-left-radius', '--nph-card-section-radius'));
    expect(section.paddingTop).toBe(resolved(card, 'padding-top', '--nph-card-section-padding'));
    expect(section.rowGap).toBe(resolved(card, 'row-gap', '--nph-card-section-gap'));
    expect(section.borderTopWidth).toBe('0px');
    expect(section.boxShadow).toBe('none');
  });

  it('the status sits next to the title, and the title truncates with an ellipsis before it', async () => {
    const long = 'A very long order title that does not fit in the width of this narrow card at all, never';
    const card = await mount({
      props: { heading: long },
      width: '16rem',
      children: '<nph-badge slot="status" text="Paid" severity="secondary" emphasis="light"></nph-badge>',
    });
    const heading = part(card, '.heading');
    expect(style(heading).textOverflow).toBe('ellipsis');
    expect(heading.scrollWidth).toBeGreaterThan(heading.clientWidth);
    const badge = card.querySelector('nph-badge') as HTMLElement;
    expect(rect(badge).left).toBeGreaterThanOrEqual(rect(heading).right);
    expect(rect(badge).right).toBeLessThanOrEqual(rect(card).right);
    expect(rect(badge).width).toBeGreaterThan(0);
  });

  it('centers the start, the title and the action on the header height', async () => {
    const card = await mount({ props: { icon: 'folder', description: 'Paid on 12 March' }, children: ACTION });
    const header = rect(part(card, '.header'));
    const center = header.top + header.height / 2;
    for (const selector of ['.leading', '.action']) {
      const box = rect(part(card, selector));
      expect(Math.abs(box.top + box.height / 2 - center), selector).toBeLessThanOrEqual(1);
    }
  });
});

/* ----- the start ------------------------------------------------------------------------------------------------ */

describe('the start', () => {
  it('the icon box is 40 px in the default density and 32 px in the compact one, in its tokens', async () => {
    const regular = await mount({ props: { icon: 'folder' } });
    const compact = await mount({ props: { icon: 'folder', density: 'compact' } });
    for (const [card, size, token] of [
      [regular, 40, '--nph-card-icon-size'],
      [compact, 32, '--nph-card-icon-size-dense'],
    ] as const) {
      const box = part(card, '.icon-box');
      const icon = part(card, '.icon-box nph-icon');
      expect(rect(box).width).toBe(size);
      expect(rect(box).height).toBe(size);
      expect(rect(icon).width).toBe(px(resolved(card, 'width', token)));
      expect(style(box).backgroundColor).toBe(resolved(card, 'background-color', '--nph-card-icon-container-background'));
      expect(style(box).color).toBe(resolved(card, 'color', '--nph-card-icon-container-foreground'));
      expect(style(box).borderTopLeftRadius).toBe(resolved(card, 'border-top-left-radius', '--nph-card-icon-container-radius'));
      expect(style(box).paddingTop).toBe(resolved(card, 'padding-top', '--nph-card-icon-container-padding'));
    }
  });

  it('the avatar and the image of the leading slot take the size of the density, and follow a change of it', async () => {
    const card = await mount({
      children: '<nph-avatar slot="leading" label="Ana"></nph-avatar>',
    });
    const avatar = card.querySelector('nph-avatar') as HTMLElement;
    expect(avatar.getAttribute('size')).toBe('lg');
    card.density = 'compact';
    await settle(card);
    expect(avatar.getAttribute('size')).toBe('md');
    const imageCard = await mount({ children: `<nph-image slot="leading" src="${PIXEL}" alt="Invoice"></nph-image>` });
    const image = imageCard.querySelector('nph-image') as HTMLElement;
    expect(image.getAttribute('size')).toBe('md');
    imageCard.density = 'compact';
    await settle(imageCard);
    expect(image.getAttribute('size')).toBe('sm');
    expect(rect(image).width).toBe(px(resolved(imageCard, 'width', '--nph-image-size-sm')));
  });

  it('writes the size back when the piece changes its own', async () => {
    const card = await mount({ children: '<nph-avatar slot="leading" label="Ana"></nph-avatar>' });
    const avatar = card.querySelector('nph-avatar') as HTMLElement;
    avatar.setAttribute('size', 'sm');
    await vi.waitFor(() => expect(avatar.getAttribute('size')).toBe('lg'));
  });

  it('a piece that is not an avatar or an image is left as it is', async () => {
    const card = await mount({ children: '<span slot="leading" id="mine">M</span>' });
    expect(card.querySelector('#mine')?.hasAttribute('size')).toBe(false);
  });
});

/* ----- the media ------------------------------------------------------------------------------------------------- */

describe('the media', () => {
  const MEDIA = `<nph-image slot="media" src="${PIXEL}" alt="Invoice preview"></nph-image>`;

  it('top: the card width in 16:9, clipped by the card corner at the top', async () => {
    const card = await mount({ props: { media: 'top' }, children: MEDIA, width: '24rem' });
    const image = card.querySelector('nph-image') as HTMLElement;
    const surface = part(card, '.surface');
    expect(rect(image).width).toBeCloseTo(rect(surface).width, 0);
    expect(rect(surface).width).toBe(rect(card).width - 2 * px(resolved(card, 'width', '--nph-card-border-width')));
    expect(rect(image).width / rect(image).height).toBeCloseTo(16 / 9, 1);
    expect(rect(image).top).toBeLessThan(rect(part(card, '.body')).top);
    const media = style(part(card, '.media'));
    expect(px(media.borderTopLeftRadius)).toBe(px(resolved(card, 'border-top-left-radius', '--nph-card-radius')) - 1);
    expect(media.borderBottomLeftRadius).toBe('0px');
    expect(media.overflow).toBe('hidden');
    expect(style(image).borderTopLeftRadius).toBe(media.borderTopLeftRadius);
    expect(style(card).overflow).toBe('visible');
    expect(style(part(card, '.surface')).overflow).toBe('visible');
  });

  it('inset top: inside the body padding, 16:9 and the corner image/radius-lg', async () => {
    const card = await mount({ props: { media: 'inset-top' }, children: MEDIA, width: '24rem' });
    const image = card.querySelector('nph-image') as HTMLElement;
    const body = part(card, '.body');
    const padding = px(style(body).paddingLeft);
    expect(rect(image).left).toBeCloseTo(rect(body).left + padding, 0);
    expect(rect(image).width).toBeCloseTo(rect(body).width - 2 * padding, 0);
    expect(rect(image).width / rect(image).height).toBeCloseTo(16 / 9, 1);
    expect(style(image).borderTopLeftRadius).toBe(resolved(card, 'border-top-left-radius', '--nph-image-radius-lg'));
    expect(rect(image).top).toBeGreaterThan(rect(body).top);
  });

  it('side: at the start, the card height and about 40% of the width, 33% when compact', async () => {
    const regular = await mount({ props: { media: 'side', description: 'Paid on 12 March' }, children: `${MEDIA}<p>Content</p>${FOOTER}`, width: '40rem' });
    const compact = await mount({ props: { media: 'side', density: 'compact' }, children: `${MEDIA}<p>Content</p>`, width: '40rem' });
    for (const [card, share] of [
      [regular, 0.4],
      [compact, 0.33],
    ] as const) {
      const image = card.querySelector('nph-image') as HTMLElement;
      const surface = rect(part(card, '.surface'));
      expect(rect(image).width / surface.width).toBeCloseTo(share, 1);
      expect(rect(image).left).toBeLessThan(rect(part(card, '.main')).left);
      expect(rect(image).height).toBeCloseTo(rect(part(card, '.main')).height, 0);
    }
    const media = style(part(regular, '.media'));
    expect(media.borderTopRightRadius).toBe('0px');
    expect(media.borderTopLeftRadius).not.toBe('0px');
  });

  it('the side media moves to the top on a narrow container', async () => {
    const wide = await mount({ props: { media: 'side' }, children: MEDIA, width: '32rem' });
    const narrow = await mount({ props: { media: 'side' }, children: MEDIA, width: '20rem' });
    const wideImage = wide.querySelector('nph-image') as HTMLElement;
    const narrowImage = narrow.querySelector('nph-image') as HTMLElement;
    expect(rect(wideImage).left).toBeLessThan(rect(part(wide, '.main')).left);
    expect(rect(narrowImage).bottom).toBeLessThanOrEqual(rect(part(narrow, '.main')).top + 1);
    expect(rect(narrowImage).width / rect(narrowImage).height).toBeCloseTo(16 / 9, 1);
    expect(rect(narrowImage).width).toBeCloseTo(rect(part(narrow, '.surface')).width, 0);
  });

  it('the media slot is not drawn while media is none, or on the section type', async () => {
    const none = await mount({ children: MEDIA });
    expect(has(none, '.media')).toBe(false);
    expect(rect(none.querySelector('nph-image') as HTMLElement).width).toBe(0);
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const section = await mount({ props: { type: 'section', media: 'top' }, children: MEDIA });
    expect(has(section, '.media')).toBe(false);
  });

  it('an image that is loading, has no src or fails keeps its own placeholder inside the frame', async () => {
    for (const src of ['', 'data:image/png;base64,this-is-not-an-image']) {
      const card = await mount({
        props: { media: 'top' },
        children: `<nph-image slot="media" src="${src}" alt="Invoice preview"></nph-image>`,
        width: '20rem',
      });
      const image = card.querySelector('nph-image') as HTMLElement;
      expect(rect(image).width, src).toBeCloseTo(rect(part(card, '.media')).width, 0);
      expect(rect(image).width / rect(image).height, src).toBeCloseTo(16 / 9, 1);
      expect(style(image).display, src).toBe('flex');
      expect(style(image).alignItems, src).toBe('center');
      expect(style(image).justifyContent, src).toBe('center');
    }
  });

  it('the card gives the frame: whatever size the image has, it fills the media box', async () => {
    const card = await mount({
      props: { media: 'top' },
      children: `<nph-image slot="media" size="2xl" src="${PIXEL}" alt="Invoice preview"></nph-image>`,
      width: '20rem',
    });
    const image = card.querySelector('nph-image') as HTMLElement;
    expect(rect(image).width).toBeCloseTo(rect(part(card, '.media')).width, 0);
    expect(rect(image).width / rect(image).height).toBeCloseTo(16 / 9, 1);
  });
});

/* ----- the base type ----------------------------------------------------------------------------------------------- */

describe('the base type', () => {
  it('the card takes no focus: Tab goes through the controls inside it', async () => {
    const card = await mount({ children: `${ACTION}${FOOTER}` });
    expect(card.tabIndex).toBe(-1);
    expect(root(card).querySelectorAll('a, button, [tabindex]')).toHaveLength(0);
    await userEvent.tab();
    expect(card.querySelector('[slot="action"]')).toBe(document.activeElement);
    await userEvent.tab();
    expect(card.querySelectorAll('[slot="footer"]')[0]).toBe(document.activeElement);
    await userEvent.tab();
    expect(card.querySelectorAll('[slot="footer"]')[1]).toBe(document.activeElement);
  });

  it('has no role of its own, and the title is a level 3 heading by default', async () => {
    const card = await mount();
    expect(part(card, '.surface').getAttribute('role')).toBeNull();
    const heading = part(card, '.heading');
    expect(heading.getAttribute('role')).toBe('heading');
    expect(heading.getAttribute('aria-level')).toBe('3');
    expect(heading.textContent?.trim()).toBe('Order 1042');
  });

  it('the level of the heading is configurable, 2 to 6', async () => {
    for (const level of NPH_CARD_HEADING_LEVELS) {
      const card = await mount({ attrs: { 'heading-level': String(level) } });
      expect(part(card, '.heading').getAttribute('aria-level')).toBe(String(level));
    }
  });

  it('the menu action is a slotted piece the card only places, at the end of the header', async () => {
    const card = await mount({ children: ACTION });
    const action = card.querySelector('[slot="action"]') as HTMLElement;
    expect(rect(action).right).toBeLessThanOrEqual(rect(part(card, '.header')).right);
    expect(rect(action).left).toBeGreaterThan(rect(part(card, '.titles')).left);
    expect(rect(action).height).toBe(px(resolved(card, 'height', '--nph-control-height-compact')));
  });
});

/* ----- the clickable type --------------------------------------------------------------------------------------- */

describe('the clickable type', () => {
  const props = { type: 'clickable', href: '/orders/1042', description: 'Paid on 12 March' } as const;

  it('the title is the link, inside the heading, and the name read is the title', async () => {
    const card = await mount({ props });
    const link = part<HTMLAnchorElement>(card, '.heading a');
    expect(link.getAttribute('href')).toBe('/orders/1042');
    expect(link.textContent?.trim()).toBe('Order 1042');
    expect(part(card, '.heading').getAttribute('role')).toBe('heading');
  });

  it('is one Tab stop, on the title link; Enter opens it and Space does nothing', async () => {
    const card = await mount({ props, children: '<p>Summary</p>' });
    const link = part<HTMLAnchorElement>(card, '.link');
    expect(root(card).querySelectorAll('a, button, input, [tabindex]')).toHaveLength(1);
    await userEvent.tab();
    expect(root(card).activeElement).toBe(link);
    await userEvent.tab();
    expect(root(card).activeElement).toBeNull();
    link.addEventListener('click', (event) => event.preventDefault());
    const clicks = vi.fn();
    link.addEventListener('click', clicks);
    link.focus();
    await userEvent.keyboard(' ');
    expect(clicks).not.toHaveBeenCalled();
    await userEvent.keyboard('{Enter}');
    expect(clicks).toHaveBeenCalledTimes(1);
  });

  it('the link is stretched over the whole card by CSS only: a click anywhere reaches it', async () => {
    const card = await mount({ props, children: '<p>Summary</p>', width: '20rem' });
    const link = part<HTMLAnchorElement>(card, '.link');
    const after = style(link, '::after');
    expect(after.position).toBe('absolute');
    const surface = rect(card);
    const stretch = {
      top: px(after.top),
      width: px(after.width),
      height: px(after.height),
    };
    expect(stretch.width).toBeCloseTo(surface.width, 0);
    expect(stretch.height).toBeCloseTo(surface.height, 0);
    expect(stretch.top).toBeCloseTo(-px(resolved(card, 'width', '--nph-card-border-width')), 0);
    const points: Array<[number, number]> = [
      [surface.left + surface.width / 2, surface.top + surface.height / 2],
      [surface.right - 8, surface.bottom - 8],
      [surface.left + 8, surface.bottom - 8],
    ];
    for (const [x, y] of points) {
      expect(root(card).elementFromPoint(x, y)).toBe(link);
    }
    expect(componentSource).not.toMatch(/addEventListener\(\s*['"](click|mouse|pointer)/);
  });

  it('the arrow and the start are decorative, and the arrow has its own size and color', async () => {
    const card = await mount({ props: { ...props, icon: 'folder' } });
    const indicator = part(card, '.indicator');
    expect(indicator.getAttribute('aria-hidden')).toBe('true');
    expect(part(card, '.leading').getAttribute('aria-hidden')).toBe('true');
    expect(style(indicator).color).toBe(resolved(card, 'color', '--nph-card-indicator-foreground'));
    const icon = part(card, '.indicator nph-icon');
    expect(icon.getAttribute('name')).toBe('chevron-right');
    expect(rect(icon).width).toBe(px(resolved(card, 'width', '--nph-card-indicator-size')));
    expect(style(icon).color).toBe(resolved(card, 'color', '--nph-card-indicator-foreground'));
    const svg = icon.shadowRoot?.querySelector('svg');
    expect(svg === null || svg === undefined ? 'none' : style(svg as Element).fill).not.toBe('none');
  });

  it('the meta text sits in the body, in card/description-foreground, with no divider and no buttons', async () => {
    const card = await mount({ props, children: '<span slot="footer">Updated 2 days ago</span>' });
    const footer = part(card, '.footer.meta');
    expect(part(card, '.body').contains(footer)).toBe(true);
    expect(style(footer).color).toBe(resolved(card, 'color', '--nph-card-description-foreground'));
    expect(style(footer).fontSize).toBe(resolved(card, 'font-size', '--nph-text-body-sm-font-size'));
    expect(has(card, '.divider')).toBe(false);
    expect(has(card, '.action')).toBe(false);
    expect(has(card, '.section')).toBe(false);
  });

  it('hover only raises the outline: color changes, width, size, background and shadow stay', async () => {
    const card = await mount({ props });
    const surface = card;
    const before = { box: rect(surface), border: style(surface).borderTopColor, background: style(surface).backgroundColor, shadow: style(surface).boxShadow };
    await userEvent.hover(surface);
    await frame();
    expect(style(surface).borderTopColor).toBe(resolved(card, 'color', '--nph-card-border-hover'));
    expect(style(surface).borderTopColor).not.toBe(before.border);
    expect(style(surface).borderTopWidth).toBe(resolved(card, 'width', '--nph-card-border-width'));
    expect(style(surface).backgroundColor).toBe(before.background);
    expect(style(surface).boxShadow).toBe(before.shadow);
    expect(rect(surface)).toEqual(before.box);
    expect(style(part(card, '.indicator')).display).not.toBe('none');
  });

  it('the base card has no hover: the outline stays', async () => {
    const card = await mount();
    const surface = card;
    const before = style(surface).borderTopColor;
    await userEvent.hover(surface);
    await frame();
    expect(style(surface).borderTopColor).toBe(before);
  });

  it('keyboard focus draws the border and the halo outside the card, with their own corners', async () => {
    const card = await mount({ props });
    await userEvent.tab();
    await frame();
    const surface = part(card, '.surface');
    const border = style(surface, '::before');
    const halo = style(surface, '::after');
    const edge = px(resolved(card, 'width', '--nph-card-border-width'));
    expect(border.borderTopColor).toBe(resolved(card, 'color', '--nph-focus-border'));
    expect(border.borderTopWidth).toBe(resolved(card, 'width', '--nph-border-width'));
    expect(border.borderTopLeftRadius).toBe(resolved(card, 'border-top-left-radius', '--nph-focus-border-radius-surface'));
    expect(halo.borderTopColor).toBe(resolved(card, 'color', '--nph-focus-halo'));
    expect(halo.borderTopWidth).toBe(resolved(card, 'width', '--nph-focus-ring-width'));
    expect(halo.borderTopLeftRadius).toBe(resolved(card, 'border-top-left-radius', '--nph-focus-radius-surface-with-border'));
    const box = rect(surface);
    expect(px(border.width)).toBeCloseTo(box.width + 2 * edge, 0);
    expect(px(halo.width)).toBeGreaterThan(px(border.width));
    expect(surface.getBoundingClientRect()).toEqual(box);
  });

  it('a click does not draw the keyboard focus', async () => {
    const card = await mount({ props });
    const link = part<HTMLAnchorElement>(card, '.link');
    link.addEventListener('click', (event) => event.preventDefault());
    await userEvent.click(part(card, '.surface'));
    await frame();
    expect(style(part(card, '.surface'), '::before').content).not.toBe('""');
  });

  it('disabled: no href, role link, aria-disabled, out of the focus order, card/disabled-opacity', async () => {
    const card = await mount({ props: { ...props, disabled: true } });
    const link = part(card, '.link');
    expect(link.hasAttribute('href')).toBe(false);
    expect(link.getAttribute('role')).toBe('link');
    expect(link.getAttribute('aria-disabled')).toBe('true');
    link.focus();
    expect(root(card).activeElement).toBeNull();
    expect(style(card).opacity).toBe(resolved(card, 'opacity', '--nph-card-disabled-opacity'));
    expect(part(card, '.surface').getAttribute('aria-disabled')).toBe('true');
    await userEvent.tab();
    expect(root(card).activeElement).toBeNull();
    const surface = card;
    const before = style(surface).borderTopColor;
    await userEvent.hover(surface);
    await frame();
    expect(style(surface).borderTopColor).toBe(before);
    expect(style(link, '::after').content).toBe('none');
  });
});

/* ----- the section type ---------------------------------------------------------------------------------------------- */

describe('the section type', () => {
  const items = [
    { key: 'Customer', value: 'Ana Souza' },
    { key: 'Total', value: 'R$ 1,200.00' },
  ];

  it('is a region named by its title', async () => {
    const card = await mount({ props: { type: 'section', items } });
    const surface = part(card, '.surface');
    expect(surface.getAttribute('role')).toBe('region');
    expect(surface.getAttribute('aria-labelledby')).toBe('heading');
    expect(root(card).getElementById('heading')?.textContent?.trim()).toBe('Order 1042');
  });

  it('draws the key-value list: key at the start and value at the end of each row, rows apart by card/list-gap', async () => {
    const card = await mount({ props: { type: 'section', items } });
    const list = part(card, '.list');
    expect(list.tagName).toBe('DL');
    expect(style(list).rowGap).toBe(resolved(card, 'row-gap', '--nph-card-list-gap'));
    const rows = [...list.querySelectorAll('.row')];
    expect(rows).toHaveLength(2);
    for (const row of rows) {
      const key = row.querySelector('dt') as HTMLElement;
      const value = row.querySelector('dd') as HTMLElement;
      expect(style(key).color).toBe(resolved(card, 'color', '--nph-card-description-foreground'));
      expect(style(value).color).toBe(resolved(card, 'color', '--nph-card-foreground'));
      expect(style(key).fontSize).toBe(resolved(card, 'font-size', '--nph-text-body-sm-font-size'));
      expect(rect(key).left).toBeLessThan(rect(value).left);
      expect(rect(value).right).toBeCloseTo(rect(row).right, 0);
    }
  });

  it('a long key or a long value wraps and keeps the row inside the card', async () => {
    const card = await mount({
      props: { type: 'section', items: [{ key: 'A key that is long enough to wrap onto more lines than one in the card', value: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' }] },
      width: '18rem',
    });
    const row = part(card, '.row');
    expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth);
    expect(rect(part(card, '.list')).right).toBeLessThanOrEqual(rect(card).right);
  });

  it('a header action with text is placed at the end of the header, with no change of size by the touch rule', async () => {
    const card = await mount({
      props: { type: 'section', items },
      children: '<nph-button slot="action" severity="secondary" size="compact" text="Edit"></nph-button>',
    });
    expect(rect(card.querySelector('[slot="action"]') as HTMLElement).right).toBeLessThanOrEqual(rect(part(card, '.header')).right);
    expect(cssWithoutComments).toMatch(/:host\(\[type='base'\]\) ::slotted\(\[slot='action'\]\)/);
  });

  it('the list is the section type only', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const card = await mount({ props: { type: 'base', items } });
    expect(has(card, '.list')).toBe(false);
  });
});

/* ----- loading ----------------------------------------------------------------------------------------------------- */

describe('loading', () => {
  it('aria-busy, the skeleton hidden from assistive technology and a hidden word outside the hidden node', async () => {
    const card = await mount({ props: { loading: true, loadingLabel: 'Loading', description: 'Paid' }, children: `<p>Content</p>${FOOTER}` });
    const surface = part(card, '.surface');
    expect(surface.getAttribute('aria-busy')).toBe('true');
    expect(part(card, '.body').getAttribute('aria-hidden')).toBe('true');
    const word = part(card, '.loading-text');
    expect(word.textContent).toBe('Loading');
    expect(word.closest('[aria-hidden="true"]')).toBeNull();
    expect(style(word).clipPath).toBe('inset(50%)');
    expect(style(word).display).not.toBe('none');
    for (const skeleton of root(card).querySelectorAll('nph-skeleton')) {
      expect(skeleton.closest('[aria-hidden="true"]') !== null || skeleton.getAttribute('aria-hidden') === 'true').toBe(true);
    }
  });

  it('draws skeletons in place of the title, the description, the content and the action, and no real content', async () => {
    const card = await mount({ props: { loading: true, loadingLabel: 'Loading', description: 'Paid', icon: 'folder' }, children: `<p>Content</p>${ACTION}${FOOTER}` });
    expect(has(card, '.heading')).toBe(false);
    expect(has(card, '.description')).toBe(false);
    expect(has(card, '.icon-box')).toBe(false);
    expect(has(card, 'slot')).toBe(false);
    expect(root(card).querySelectorAll('nph-skeleton').length).toBe(6);
    const shapes = [...root(card).querySelectorAll('nph-skeleton')].map((skeleton) => skeleton.getAttribute('shape'));
    expect(shapes).toEqual(['avatar-lg', 'line', 'line', 'line', 'line', 'block']);
    expect(has(card, '.divider')).toBe(true);
    expect(has(card, '.sk-action')).toBe(true);
  });

  it('keeps the surface, its outline and its padding, and the compact density takes the compact avatar', async () => {
    const card = await mount({ props: { loading: true, loadingLabel: 'Loading', density: 'compact', icon: 'folder' } });
    expect(style(card).borderTopColor).toBe(resolved(card, 'color', '--nph-card-border'));
    expect(style(part(card, '.body')).paddingTop).toBe(resolved(card, 'padding-top', '--nph-card-padding-compact'));
    expect(root(card).querySelector('nph-skeleton')?.getAttribute('shape')).toBe('avatar-md');
  });

  it('the skeleton pieces take their size from the card: the lines follow its width, the action is a control high', async () => {
    const card = await mount({ props: { loading: true, loadingLabel: 'Loading', icon: 'folder' }, children: FOOTER, width: '24rem' });
    const content = rect(part(card, '.body'));
    const room = content.width - 2 * px(style(part(card, '.body')).paddingLeft);
    expect(rect(part(card, '.sk-line')).width).toBeCloseTo(room, 0);
    expect(rect(part(card, '.sk-line-short')).width).toBeLessThan(room);
    expect(rect(part(card, '.sk-title')).width).toBeLessThan(rect(part(card, '.titles')).width);
    expect(rect(part(card, '.sk-description')).width).toBeLessThan(rect(part(card, '.sk-title')).width);
    expect(rect(part(card, '.sk-action')).height).toBe(px(resolved(card, 'height', '--nph-control-height-default')));
    // The line is a box of skeleton/line-box-height with the bar of skeleton/line-height centered in it (DSA-127).
    expect(rect(part(card, '.sk-title')).height).toBe(px(resolved(card, 'height', '--nph-skeleton-line-box-height')));
    const bar = part(card, '.sk-title').shadowRoot?.querySelector('.bar') as Element;
    expect(rect(bar).height).toBe(px(resolved(card, 'height', '--nph-skeleton-line-height')));
    expect(rect(root(card).querySelector('nph-skeleton') as Element).width).toBe(px(resolved(card, 'width', '--nph-avatar-size-lg')));
  });

  it('the start, the divider and the action skeleton stay only when the card has a start and a footer', async () => {
    const bare = await mount({ props: { loading: true, loadingLabel: 'Loading' } });
    expect(root(bare).querySelectorAll('nph-skeleton')).toHaveLength(4);
    expect(has(bare, '.divider')).toBe(false);
    expect(has(bare, '.sk-action')).toBe(false);
    const withAvatar = await mount({
      props: { loading: true, loadingLabel: 'Loading' },
      children: '<nph-avatar slot="leading" label="Ana"></nph-avatar>',
    });
    expect(root(withAvatar).querySelector('nph-skeleton')?.getAttribute('shape')).toBe('avatar-lg');
  });

  it('the clickable card has no footer while it loads and is not a link', async () => {
    const card = await mount({ props: { type: 'clickable', href: '/x', loading: true, loadingLabel: 'Loading' } });
    expect(has(card, '.footer')).toBe(false);
    expect(has(card, '.divider')).toBe(false);
    expect(has(card, 'a')).toBe(false);
    const surface = card;
    const before = style(surface).borderTopColor;
    await userEvent.hover(surface);
    await frame();
    expect(style(surface).borderTopColor).toBe(before);
  });

  it('loading draws no media: Figma draws it without', async () => {
    const card = await mount({
      props: { loading: true, media: 'top', loadingLabel: 'Loading' },
      children: `<nph-image slot="media" src="${PIXEL}" alt="x"></nph-image>`,
    });
    expect(has(card, '.media')).toBe(false);
  });

  it('a loading section card keeps its region name from the title when there is one', async () => {
    const named = await mount({ props: { type: 'section', loading: true, loadingLabel: 'Loading' } });
    expect(part(named, '.surface').getAttribute('role')).toBe('region');
    expect(part(named, '.surface').getAttribute('aria-label')).toBe('Order 1042');
    const unnamed = await mount({ props: { type: 'section', loading: true, heading: '', loadingLabel: 'Loading' } });
    expect(part(unnamed, '.surface').getAttribute('role')).toBeNull();
  });

  it('back to loaded, aria-busy goes away', async () => {
    const card = await mount({ props: { loading: true, loadingLabel: 'Loading' } });
    card.loading = false;
    await settle(card);
    expect(part(card, '.surface').hasAttribute('aria-busy')).toBe(false);
    expect(has(card, '.loading-text')).toBe(false);
    expect(has(card, '.heading')).toBe(true);
  });

  it('warns when the loading word is missing', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    await mount({ props: { loading: true } });
    expect(warn.mock.calls.some(([text]) => String(text).includes('loading-label is empty'))).toBe(true);
  });
});

/* ----- by instance ---------------------------------------------------------------------------------------------------- */

describe('what the card does to the pieces it draws, from outside', () => {
  it('the divider line is card/divider, in the separator that draws it', async () => {
    const card = await mount({ children: FOOTER });
    const separator = part(card, '.divider');
    expect(style(separator).backgroundColor).toBe(resolved(card, 'background-color', '--nph-card-divider'));
    expect(rect(separator).height).toBe(px(resolved(card, 'width', '--nph-card-border-width')));
    const main = rect(part(card, '.main'));
    expect(rect(separator).left).toBeCloseTo(main.left, 0);
    expect(rect(separator).width).toBeCloseTo(main.width, 0);
    expect(rect(separator).bottom).toBeLessThanOrEqual(rect(part(card, '.footer')).top + 1);
  });

  it('does not change the pieces: the source of the card writes no style or class on them', () => {
    expect(componentSource).not.toMatch(/\.style\.|style\.setProperty|classList|\.className/);
    expect(cssWithoutComments).not.toMatch(/::part\(/);
  });

  it('the height the button reads is raised on a coarse pointer: 36 px instead of 28 px, once the rule applies', async () => {
    const card = await mount({ children: ACTION });
    const action = card.querySelector('[slot="action"]') as HTMLElement;
    expect(action.getBoundingClientRect().height).toBe(px(resolved(card, 'height', '--nph-control-height-compact')));
    /* The rule of the card writes this property on the slotted button; the button reads it on its own host. */
    action.style.setProperty('--nph-control-height-compact', 'var(--nph-control-height-default)');
    expect(action.getBoundingClientRect().height).toBe(px(resolved(card, 'height', '--nph-control-height-default')));
  });

  it('the touch rule raises the menu action to control/height-default, only on the base type', () => {
    expect(cssWithoutComments).toMatch(/@media \(pointer: coarse\)/);
    expect(cssWithoutComments).toMatch(/--nph-control-height-compact: var\(--nph-control-height-default\)/);
  });
});

/* ----- absence -------------------------------------------------------------------------------------------------------- */

describe('what the card does not have', () => {
  it('no event of its own, no ::part, no color property, no form association', async () => {
    const card = await mount({ props: { type: 'clickable', href: '/x' } });
    expect(componentSource).not.toMatch(/dispatchEvent|new CustomEvent|formAssociated|attachInternals/);
    expect(root(card).querySelectorAll('[part]')).toHaveLength(0);
    for (const name of ['color', 'background', 'variant', 'size', 'selected', 'checked', 'expanded', 'open', 'selectable']) {
      expect((NphCard as unknown as { elementProperties: Map<string, unknown> }).elementProperties.has(name), name).toBe(false);
    }
  });

  it('has no transition and no animation, so there is nothing to reduce under reduced motion', () => {
    expect(cssWithoutComments).not.toMatch(/transition|animation|@keyframes/);
  });

  it('is not a list item and not a landmark by itself: the collection is the consumer\'s ul and li', async () => {
    const card = await mount();
    expect(card.getAttribute('role')).toBeNull();
    expect(root(card).querySelector('li, ul')).toBeNull();
  });
});

/* ----- the token contract --------------------------------------------------------------------------------------------- */

describe('the token contract', () => {
  const CARD_TOKENS = [
    'background',
    'foreground',
    'description-foreground',
    'border',
    'divider',
    'border-hover',
    'border-width',
    'radius',
    'padding',
    'padding-compact',
    'gap',
    'header-gap',
    'header-item-gap',
    'section-background',
    'section-radius',
    'section-padding',
    'section-gap',
    'list-gap',
    'footer-gap',
    'footer-padding',
    'footer-padding-compact',
    'disabled-opacity',
    'icon-container-background',
    'icon-container-foreground',
    'icon-container-radius',
    'icon-container-padding',
    'icon-size',
    'icon-size-dense',
    'indicator-size',
    'indicator-foreground',
  ];

  it('the 30 card tokens exist in the generated CSS and every one is read by the component CSS', () => {
    expect(CARD_TOKENS).toHaveLength(30);
    for (const token of CARD_TOKENS) {
      expect(tokensCss, token).toContain(`--nph-card-${token}:`);
      expect(cssWithoutComments, token).toContain(`var(--nph-card-${token})`);
    }
  });

  it('every other token the CSS reads exists in the generated CSS', () => {
    const used = new Set([...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1]));
    expect(used.size).toBeGreaterThan(30);
    for (const token of used) expect(tokensCss, token).toContain(`${token}:`);
  });

  it('there is no literal color or measurement value in the component CSS', () => {
    expect(cssWithoutComments).not.toMatch(/#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|\b\d+(\.\d+)?(px|em|ms|s)\b/);
    const rem = [...cssWithoutComments.matchAll(/\b\d+(\.\d+)?rem\b/g)].map((match) => match[0]);
    expect(rem).toEqual(['30rem']);
  });

  it('the surface does not clip: the focus border and halo sit outside it', () => {
    const rule = /\.surface\s*\{[^}]*\}/.exec(cssWithoutComments)?.[0] ?? '';
    expect(rule).not.toBe('');
    expect(rule).not.toMatch(/overflow/);
  });

  it('the card draws no shadow on the outlined surface and no color of its own for the outline in hover', () => {
    expect(cssWithoutComments).toMatch(/:host\(\[data-nph-rendered\]\[surface='elevated'\]\) \{\s*box-shadow: var\(--nph-elevation-raised\)/);
    expect(cssWithoutComments).toMatch(/border-color: var\(--nph-card-border-hover\)/);
  });
});
