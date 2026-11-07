/**
 * Tests of `nph-popover` (P111), in a real browser (P21, item 5): the top layer, the placement,
 * keyboard focus, real clicks and measures only exist where there is layout.
 *
 * They prove the contract accepted in Figma (documentation frame `4749:5857`, set `4727:1544`),
 * recorded in the evidence of the `figma-docs-accepted` gate of DSA-67: the API and the invalid
 * input, the trigger and the attributes the popover writes on it, opening and closing, the focus
 * rule, the placement on the four sides and three alignments, the arrow, the three widths, the
 * parts and their measures, the colors in both schemes, the roles and names the browser computes,
 * and the token contract.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cdp, page, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-popover.css?raw';
import componentSource from './nph-popover.ts?raw';
import {
  NPH_POPOVER_ALIGNMENTS,
  NPH_POPOVER_SIDES,
  NPH_POPOVER_SIZES,
  NphPopover,
} from './nph-popover';
import type { NphPopoverAlignment, NphPopoverCloseSource, NphPopoverSide, NphPopoverSize } from './nph-popover';
import type { NphButton } from '../nph-button/nph-button';
import '../nph-button/nph-button';
import '../nph-field/nph-field';

beforeAll(async () => {
  await document.fonts.load('400 14px "Noto Sans"');
  await document.fonts.load('500 14px "Noto Sans"');
  await document.fonts.ready;
  /* Room for every side of a popover around a trigger in the middle. */
  await page.viewport(1024, 768);
});

afterEach(async () => {
  await userEvent.unhover(document.body).catch(() => {});
  document.body.replaceChildren();
  document.documentElement.removeAttribute('data-nph-color-scheme');
  window.scrollTo(0, 0);
  vi.restoreAllMocks();
});

interface Setup {
  popover: NphPopover;
  trigger: NphButton;
}

interface Options {
  /** Markup of the body (the default slot). */
  body?: string;
  /** Markup of the footer (the `footer` slot). */
  footer?: string;
  /** Where the trigger sits. */
  at?: { left: number; top: number };
}

const FOOTER = `<nph-button slot="footer" size="compact" severity="secondary" text="Clear"></nph-button>
<nph-button slot="footer" size="compact" text="Apply"></nph-button>`;

async function mount(props: Partial<NphPopover> = {}, { body, footer, at = { left: 400, top: 300 } }: Options = {}): Promise<Setup> {
  const trigger = document.createElement('nph-button');
  trigger.id = 'trigger';
  trigger.severity = 'secondary';
  trigger.text = 'Filters';
  trigger.style.cssText = `position: fixed; left: ${at.left}px; top: ${at.top}px;`;
  const popover = document.createElement('nph-popover');
  popover.setAttribute('for', 'trigger');
  popover.heading = 'Filters';
  Object.assign(popover, props);
  popover.innerHTML = `${body ?? ''}${footer ?? ''}`;
  document.body.append(trigger, popover);
  await trigger.updateComplete;
  await settle(popover);
  return { popover, trigger };
}

async function settle(popover: NphPopover): Promise<void> {
  await popover.updateComplete;
  await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
  await popover.updateComplete;
}

/** Opens the popover the way the person does and waits for it to be placed. */
async function open(setup: Setup): Promise<void> {
  await userEvent.click(setup.trigger);
  await settle(setup.popover);
  await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
}

const surface = (popover: NphPopover): HTMLElement => popover.shadowRoot?.querySelector('.surface') as HTMLElement;
const part = (popover: NphPopover, selector: string): HTMLElement | null => popover.shadowRoot?.querySelector<HTMLElement>(selector) ?? null;
const shown = (popover: NphPopover): boolean => surface(popover)?.matches(':popover-open') ?? false;
const control = (button: NphButton): HTMLButtonElement => button.shadowRoot?.querySelector('button') as HTMLButtonElement;

/** Waits until a condition holds: the exit animation ends and takes the surface out of the top layer. */
async function until(condition: () => boolean, ms = 1500): Promise<void> {
  const start = performance.now();
  while (!condition()) {
    if (performance.now() - start > ms) throw new Error('condition not met in time');
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
}

function deepActive(): Element | null {
  let active = document.activeElement;
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
  return active;
}

function resolved(property: string, token: string): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  document.body.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

const px = (token: string): number => Number.parseFloat(resolved('width', token));

function colorOf(token: string): string {
  const probe = document.createElement('div');
  probe.style.setProperty('color', `var(${token})`);
  document.body.append(probe);
  const value = getComputedStyle(probe).color;
  probe.remove();
  return value;
}

function typographyFrom(element: HTMLElement): Record<string, string> {
  const style = getComputedStyle(element);
  return {
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    lineHeight: style.lineHeight,
    letterSpacing: style.letterSpacing,
  };
}

function typographyOf(role: string): Record<string, string> {
  const probe = document.createElement('div');
  probe.style.setProperty('font-family', `var(--nph-text-${role}-font-family)`);
  probe.style.setProperty('font-size', `var(--nph-text-${role}-font-size)`);
  probe.style.setProperty('font-weight', `var(--nph-text-${role}-font-weight)`);
  probe.style.setProperty('line-height', `var(--nph-text-${role}-line-height)`);
  probe.style.setProperty('letter-spacing', `var(--nph-text-${role}-letter-spacing)`);
  document.body.append(probe);
  const value = typographyFrom(probe);
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

function closes(popover: NphPopover): NphPopoverCloseSource[] {
  const seen: NphPopoverCloseSource[] = [];
  popover.addEventListener('nph-close', (event) => seen.push((event as CustomEvent<{ source: NphPopoverCloseSource }>).detail.source));
  return seen;
}

describe('registration and API', () => {
  it('registers the tag once and exposes the class', () => {
    expect(customElements.get('nph-popover')).toBe(NphPopover);
    expect(document.createElement('nph-popover')).toBeInstanceOf(NphPopover);
  });

  it('has the defaults of the evidence: closed, bottom, center, no arrow, md, no close button', () => {
    const popover = document.createElement('nph-popover');
    expect(popover.open).toBe(false);
    expect(popover.side).toBe('bottom');
    expect(popover.align).toBe('center');
    expect(popover.arrow).toBe(false);
    expect(popover.size).toBe('md');
    expect(popover.closable).toBe(false);
    expect(popover.heading).toBe('');
    expect(popover.description).toBe('');
  });

  it('the public API is exactly the one of P111', () => {
    const declared = [...(NphPopover as unknown as { elementProperties: Map<string, { state?: boolean }> }).elementProperties]
      .filter(([, options]) => options.state !== true)
      .map(([name]) => name);
    expect(declared).toEqual(['for', 'open', 'heading', 'description', 'side', 'align', 'arrow', 'size', 'closable', 'closeLabel']);
    expect(NPH_POPOVER_SIDES).toEqual(['bottom', 'top', 'right', 'left']);
    expect(NPH_POPOVER_ALIGNMENTS).toEqual(['start', 'center', 'end']);
    expect(NPH_POPOVER_SIZES).toEqual(['sm', 'md', 'lg']);
  });

  it('reflects open, side, align, arrow, size and closable to the attributes', async () => {
    const { popover } = await mount({ side: 'top', align: 'end', arrow: true, size: 'lg', closable: true, closeLabel: 'Close' });
    expect(popover.getAttribute('side')).toBe('top');
    expect(popover.getAttribute('align')).toBe('end');
    expect(popover.hasAttribute('arrow')).toBe(true);
    expect(popover.getAttribute('size')).toBe('lg');
    expect(popover.hasAttribute('closable')).toBe(true);
    popover.open = true;
    await settle(popover);
    expect(popover.hasAttribute('open')).toBe(true);
  });

  it('has no part and no color property', async () => {
    const { popover } = await mount({ closable: true, closeLabel: 'Close' }, { footer: FOOTER });
    expect(popover.shadowRoot?.querySelector('[part]')).toBeNull();
  });
});

describe('invalid input: nothing is drawn and development says why, once per cause', () => {
  it('an empty for', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const popover = document.createElement('nph-popover');
    popover.heading = 'Filters';
    document.body.append(popover);
    await settle(popover);
    await settle(popover);
    expect(surface(popover)).toBeNull();
    const messages = error.mock.calls.map((call) => String(call[0]));
    expect(messages.filter((message) => message.includes('for is empty'))).toHaveLength(1);
  });

  it('a for that matches no element in the same root', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const popover = document.createElement('nph-popover');
    popover.heading = 'Filters';
    popover.setAttribute('for', 'nobody');
    document.body.append(popover);
    await settle(popover);
    await settle(popover);
    expect(surface(popover)).toBeNull();
    expect(error.mock.calls.some((call) => String(call[0]).includes('matches no element'))).toBe(true);
  });

  it('an empty heading', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { popover } = await mount({ heading: '  ' });
    expect(surface(popover)).toBeNull();
    expect(error.mock.calls.some((call) => String(call[0]).includes('heading is required'))).toBe(true);
  });

  for (const [name, bad] of [
    ['side', 'diagonal'],
    ['align', 'middle'],
    ['size', 'xl'],
  ] as const) {
    it(`a ${name} outside the list`, async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const { popover } = await mount({ [name]: bad } as Partial<NphPopover>);
      expect(surface(popover)).toBeNull();
      expect(error.mock.calls.some((call) => String(call[0]).includes(`${name} "${bad}" does not exist`))).toBe(true);
    });
  }

  it('the same cause is not reported twice while it lasts', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { popover } = await mount({ heading: '' });
    popover.description = 'a';
    await settle(popover);
    popover.description = 'b';
    await settle(popover);
    expect(error.mock.calls.filter((call) => String(call[0]).includes('heading is required'))).toHaveLength(1);
  });

  it('a close button with no close-label is not drawn, and development says why', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { popover } = await mount({ closable: true });
    expect(surface(popover)).not.toBeNull();
    expect(part(popover, '.close')).toBeNull();
    expect(error.mock.calls.some((call) => String(call[0]).includes('close-label is required'))).toBe(true);
  });
});

describe('the trigger', () => {
  it('writes aria-haspopup dialog, aria-expanded false and aria-controls on it', async () => {
    const { popover, trigger } = await mount();
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(popover.id).not.toBe('');
    expect(trigger.getAttribute('aria-controls')).toBe(popover.id);
  });

  it('keeps the id the consumer gave the popover and an aria-haspopup it already had', async () => {
    const trigger = document.createElement('button');
    trigger.id = 'own';
    trigger.setAttribute('aria-haspopup', 'true');
    const popover = document.createElement('nph-popover');
    popover.id = 'mine';
    popover.setAttribute('for', 'own');
    popover.heading = 'Filters';
    document.body.append(trigger, popover);
    await settle(popover);
    expect(trigger.getAttribute('aria-haspopup')).toBe('true');
    expect(trigger.getAttribute('aria-controls')).toBe('mine');
  });

  it('the click opens it and sets aria-expanded true; a second click closes it', async () => {
    const { popover, trigger } = await mount();
    await open({ popover, trigger });
    expect(popover.open).toBe(true);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(shown(popover)).toBe(true);
    await userEvent.click(trigger);
    await settle(popover);
    expect(popover.open).toBe(false);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    await until(() => !shown(popover));
  });

  it('Enter and Space on the trigger open it, as the click', async () => {
    const { popover, trigger } = await mount();
    control(trigger).focus();
    await userEvent.keyboard('{Enter}');
    await settle(popover);
    expect(popover.open).toBe(true);
    await userEvent.keyboard('{Escape}');
    await settle(popover);
    expect(popover.open).toBe(false);
    await until(() => !shown(popover));
    await userEvent.keyboard(' ');
    await settle(popover);
    expect(popover.open).toBe(true);
  });

  it('a disabled, aria-disabled or loading trigger opens nothing', async () => {
    for (const apply of [
      (trigger: NphButton) => trigger.setAttribute('disabled', ''),
      (trigger: NphButton) => trigger.setAttribute('aria-disabled', 'true'),
      (trigger: NphButton) => trigger.setAttribute('loading', ''),
    ]) {
      const { popover, trigger } = await mount();
      apply(trigger);
      await trigger.updateComplete;
      control(trigger).dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
      await settle(popover);
      expect(popover.open).toBe(false);
      document.body.replaceChildren();
    }
  });

  it('finds a trigger rendered right after the popover, one frame later', async () => {
    const popover = document.createElement('nph-popover');
    popover.setAttribute('for', 'late');
    popover.heading = 'Filters';
    document.body.append(popover);
    await popover.updateComplete;
    const trigger = document.createElement('button');
    trigger.id = 'late';
    document.body.append(trigger);
    await settle(popover);
    await settle(popover);
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(surface(popover)).not.toBeNull();
  });

  it('follows a changed for: the old trigger is cleaned, the new one is wired', async () => {
    const { popover, trigger } = await mount();
    const other = document.createElement('button');
    other.id = 'other';
    document.body.append(other);
    popover.setAttribute('for', 'other');
    await settle(popover);
    expect(trigger.hasAttribute('aria-expanded')).toBe(false);
    expect(trigger.hasAttribute('aria-haspopup')).toBe(false);
    expect(trigger.hasAttribute('aria-controls')).toBe(false);
    expect(other.getAttribute('aria-haspopup')).toBe('dialog');
    other.click();
    await settle(popover);
    expect(popover.open).toBe(true);
  });

  it('leaving the page cleans the trigger and the id it wrote', async () => {
    const { popover, trigger } = await mount();
    popover.remove();
    expect(trigger.hasAttribute('aria-expanded')).toBe(false);
    expect(trigger.hasAttribute('aria-controls')).toBe(false);
    expect(trigger.hasAttribute('aria-haspopup')).toBe(false);
    expect(popover.hasAttribute('id')).toBe(false);
  });

  it('an nph-button trigger draws hover-active while open and the native button carries the ARIA (P111)', async () => {
    const setup = await mount();
    const rest = getComputedStyle(control(setup.trigger)).backgroundColor;
    await open(setup);
    expect(setup.trigger.hasAttribute('data-nph-open')).toBe(true);
    expect(getComputedStyle(control(setup.trigger)).backgroundColor).toBe(
      colorOf('--nph-button-secondary-solid-background-hover'),
    );
    expect(getComputedStyle(control(setup.trigger)).backgroundColor).not.toBe(rest);
    expect(control(setup.trigger).getAttribute('aria-expanded')).toBe('true');
    expect(control(setup.trigger).getAttribute('aria-haspopup')).toBe('dialog');
  });
});

describe('opening', () => {
  it('shows the surface in the top layer, closed it is not', async () => {
    const setup = await mount();
    expect(shown(setup.popover)).toBe(false);
    await open(setup);
    expect(shown(setup.popover)).toBe(true);
    expect(surface(setup.popover).hasAttribute('data-open')).toBe(true);
  });

  it('is not modal: the page stays interactive and the trigger stays focusable', async () => {
    const setup = await mount();
    await open(setup);
    expect(surface(setup.popover).getAttribute('aria-modal')).toBeNull();
    expect(setup.trigger.matches(':popover-open, :modal')).toBe(false);
    expect(document.documentElement.inert).toBe(false);
    expect(document.body.inert).toBe(false);
  });

  it('opens when the open attribute is set before it is connected', async () => {
    const trigger = document.createElement('button');
    trigger.id = 'trigger';
    trigger.style.cssText = 'position: fixed; left: 400px; top: 300px;';
    trigger.textContent = 'Filters';
    const popover = document.createElement('nph-popover');
    popover.setAttribute('for', 'trigger');
    popover.setAttribute('open', '');
    popover.heading = 'Filters';
    document.body.append(trigger, popover);
    await settle(popover);
    await settle(popover);
    expect(shown(popover)).toBe(true);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('open set from code shows it, and closed hides it', async () => {
    const { popover } = await mount();
    popover.open = true;
    await settle(popover);
    expect(shown(popover)).toBe(true);
    popover.open = false;
    await settle(popover);
    await until(() => !shown(popover));
  });
});

describe('closing, and where the focus goes', () => {
  it('Esc closes it, fires nph-close with source escape and gives the focus back to the trigger', async () => {
    const setup = await mount({}, { body: '<input id="field" />' });
    const seen = closes(setup.popover);
    await open(setup);
    expect(deepActive()?.id).toBe('field');
    await userEvent.keyboard('{Escape}');
    await settle(setup.popover);
    expect(setup.popover.open).toBe(false);
    expect(seen).toEqual(['escape']);
    expect(deepActive()).toBe(control(setup.trigger));
    await until(() => !shown(setup.popover));
  });

  it('Esc closes the popover only: it does not reach a listener of the page', async () => {
    const setup = await mount();
    const page_ = vi.fn();
    document.addEventListener('keydown', page_);
    try {
      await open(setup);
      await userEvent.keyboard('{Escape}');
      expect(page_).not.toHaveBeenCalled();
    } finally {
      document.removeEventListener('keydown', page_);
    }
  });

  it('a second Esc, with the popover closed, reaches the page', async () => {
    const setup = await mount();
    await open(setup);
    await userEvent.keyboard('{Escape}');
    await settle(setup.popover);
    const page_ = vi.fn();
    document.addEventListener('keydown', page_);
    try {
      await userEvent.keyboard('{Escape}');
      expect(page_).toHaveBeenCalledTimes(1);
    } finally {
      document.removeEventListener('keydown', page_);
    }
  });

  it('preventDefault on nph-close keeps it open', async () => {
    const setup = await mount();
    setup.popover.addEventListener('nph-close', (event) => event.preventDefault());
    await open(setup);
    await userEvent.keyboard('{Escape}');
    await settle(setup.popover);
    expect(setup.popover.open).toBe(true);
    expect(shown(setup.popover)).toBe(true);
  });

  it('a press outside closes it with source outside and leaves the focus where the person put it', async () => {
    const setup = await mount({}, { body: '<input id="field" />' });
    const outside = document.createElement('input');
    outside.id = 'outside';
    outside.style.cssText = 'position: fixed; left: 40px; top: 40px;';
    document.body.append(outside);
    const seen = closes(setup.popover);
    await open(setup);
    await userEvent.click(outside);
    await settle(setup.popover);
    expect(setup.popover.open).toBe(false);
    expect(seen).toEqual(['outside']);
    expect(deepActive()).toBe(outside);
  });

  it('a press inside the surface keeps it open', async () => {
    const setup = await mount({}, { body: '<input id="field" />' });
    await open(setup);
    await userEvent.click(surface(setup.popover));
    await settle(setup.popover);
    expect(setup.popover.open).toBe(true);
  });

  it('the close button closes it with source close-button and gives the focus back to the trigger', async () => {
    const setup = await mount({ closable: true, closeLabel: 'Close' });
    const seen = closes(setup.popover);
    await open(setup);
    const close = part(setup.popover, '.close') as NphButton;
    await userEvent.click(close);
    await settle(setup.popover);
    expect(setup.popover.open).toBe(false);
    expect(seen).toEqual(['close-button']);
    expect(deepActive()).toBe(control(setup.trigger));
  });

  it('a footer action closes it by setting open to false, and the focus goes back to the trigger', async () => {
    const setup = await mount({}, { footer: FOOTER });
    const seen = closes(setup.popover);
    const apply = setup.popover.querySelector('nph-button[text="Apply"]') as NphButton;
    apply.addEventListener('click', () => {
      setup.popover.open = false;
    });
    await open(setup);
    await userEvent.click(apply);
    await settle(setup.popover);
    expect(setup.popover.open).toBe(false);
    expect(seen).toEqual([]);
    expect(deepActive()).toBe(control(setup.trigger));
  });

  it('the focus leaving the surface for the page closes it with source focus-out, without moving it', async () => {
    const setup = await mount({}, { body: '<input id="field" />' });
    const after = document.createElement('input');
    after.id = 'after';
    after.style.cssText = 'position: fixed; left: 40px; top: 40px;';
    document.body.append(after);
    const seen = closes(setup.popover);
    await open(setup);
    after.focus();
    await settle(setup.popover);
    expect(setup.popover.open).toBe(false);
    expect(seen).toEqual(['focus-out']);
    expect(deepActive()).toBe(after);
  });

  it('the focus moving from the surface to the trigger does not close it by itself', async () => {
    const setup = await mount({}, { body: '<input id="field" />' });
    await open(setup);
    control(setup.trigger).focus();
    await settle(setup.popover);
    expect(setup.popover.open).toBe(true);
  });

  it('setting open to false from code with the focus on the page gives nothing back', async () => {
    const setup = await mount({}, { body: '<input id="field" />' });
    const outside = document.createElement('input');
    outside.style.cssText = 'position: fixed; left: 40px; top: 40px;';
    document.body.append(outside);
    await open(setup);
    setup.popover.open = false;
    outside.focus();
    await settle(setup.popover);
    expect(deepActive()).toBe(outside);
  });

  it('setting open from code never fires nph-close', async () => {
    const setup = await mount();
    const seen = closes(setup.popover);
    setup.popover.open = true;
    await settle(setup.popover);
    setup.popover.open = false;
    await settle(setup.popover);
    expect(seen).toEqual([]);
  });
});

describe('the focus rule on open (P87)', () => {
  it('goes to the first focusable element of the body', async () => {
    const setup = await mount({ closable: true, closeLabel: 'Close' }, { body: '<input id="a" /><input id="b" />', footer: FOOTER });
    await open(setup);
    expect(deepActive()?.id).toBe('a');
  });

  it('an element with autofocus goes first, even in the footer', async () => {
    const setup = await mount(
      {},
      { body: '<input id="a" />', footer: '<nph-button slot="footer" id="go" autofocus text="Apply"></nph-button>' },
    );
    await open(setup);
    expect(deepActive()).toBe(control(document.getElementById('go') as NphButton));
  });

  it('with no body control, it goes to the footer', async () => {
    const setup = await mount({ closable: true, closeLabel: 'Close' }, { footer: FOOTER });
    await open(setup);
    const clear = setup.popover.querySelector('nph-button[text="Clear"]') as NphButton;
    expect(deepActive()).toBe(control(clear));
  });

  it('with only the close button, it goes to the close button', async () => {
    const setup = await mount({ closable: true, closeLabel: 'Close' }, { body: '<p>Read me.</p>' });
    await open(setup);
    const close = part(setup.popover, '.close') as NphButton;
    expect(deepActive()).toBe(control(close));
  });

  it('with nothing to focus, it goes to the surface itself', async () => {
    const setup = await mount({}, { body: '<p>Read me.</p>' });
    await open(setup);
    expect(setup.popover.shadowRoot?.activeElement).toBe(surface(setup.popover));
  });

  it('a field of the body takes the focus once it has drawn', async () => {
    const setup = await mount({}, { body: '<nph-field label="Name"><nph-input name="n"></nph-input></nph-field>' });
    await import('../nph-input/nph-input');
    await open(setup);
    await new Promise((resolve) => setTimeout(resolve, 100));
    const active = deepActive();
    expect(active?.tagName).toBe('INPUT');
  });

  it('there is no Tab trap: Tab moves on from the footer to the page', async () => {
    const setup = await mount({}, { footer: FOOTER });
    const after = document.createElement('input');
    after.id = 'after';
    document.body.append(after);
    await open(setup);
    /* The focus starts on Clear: Tab goes to Apply and then on to the page. */
    await userEvent.tab();
    await userEvent.tab();
    await settle(setup.popover);
    expect(deepActive()).toBe(after);
    expect(setup.popover.open).toBe(false);
  });
});

describe('roles and names the browser computes', () => {
  it('the surface is a non-modal dialog named by the title and described by the description', async () => {
    const setup = await mount({ description: 'Narrow the list.' });
    await open(setup);
    const node = await axNode(surface(setup.popover));
    expect(node.role).toBe('dialog');
    expect(node.name).toBe('Filters');
    expect(node.description).toBe('Narrow the list.');
    expect(surface(setup.popover).hasAttribute('aria-modal')).toBe(false);
  });

  it('without a description there is no aria-describedby', async () => {
    const setup = await mount();
    await open(setup);
    expect(surface(setup.popover).hasAttribute('aria-describedby')).toBe(false);
  });

  it('the title is an h2', async () => {
    const setup = await mount();
    expect(part(setup.popover, 'h2')?.textContent?.trim()).toBe('Filters');
  });

  it('the close button is named by close-label', async () => {
    const setup = await mount({ closable: true, closeLabel: 'Close' });
    await open(setup);
    const close = part(setup.popover, '.close') as NphButton;
    const node = await axNode(control(close));
    expect(node.name).toBe('Close');
    expect(node.role).toBe('button');
  });

  it('the arrow is decorative: aria-hidden, no role, no focus', async () => {
    const setup = await mount({ arrow: true });
    const arrow = part(setup.popover, '.arrow') as HTMLElement;
    expect(arrow.getAttribute('aria-hidden')).toBe('true');
    expect(arrow.getAttribute('focusable')).toBe('false');
  });

  it('the trigger carries aria-haspopup, aria-expanded and aria-controls', async () => {
    const setup = await mount();
    await open(setup);
    expect(setup.trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(setup.trigger.getAttribute('aria-expanded')).toBe('true');
    expect(setup.trigger.getAttribute('aria-controls')).toBe(setup.popover.id);
  });
});

describe('placement: the four sides and three alignments', () => {
  const OFFSET = (): number => px('--nph-popover-offset');
  const near = (a: number, b: number): void => expect(Math.abs(a - b)).toBeLessThan(1.5);

  for (const side of NPH_POPOVER_SIDES) {
    for (const align of NPH_POPOVER_ALIGNMENTS) {
      it(`${side} ${align}: at popover/offset from the trigger and aligned to it`, async () => {
        const setup = await mount({ side, align });
        await open(setup);
        const box = surface(setup.popover).getBoundingClientRect();
        const anchor = setup.trigger.getBoundingClientRect();
        if (side === 'bottom') near(box.top, anchor.bottom + OFFSET());
        if (side === 'top') near(box.bottom, anchor.top - OFFSET());
        if (side === 'right') near(box.left, anchor.right + OFFSET());
        if (side === 'left') near(box.right, anchor.left - OFFSET());
        if (side === 'bottom' || side === 'top') {
          if (align === 'start') near(box.left, anchor.left);
          if (align === 'end') near(box.right, anchor.right);
          if (align === 'center') near(box.left + box.width / 2, anchor.left + anchor.width / 2);
        } else {
          if (align === 'start') near(box.top, anchor.top);
          if (align === 'end') near(box.bottom, anchor.bottom);
          if (align === 'center') near(box.top + box.height / 2, anchor.top + anchor.height / 2);
        }
        expect(surface(setup.popover).getAttribute('data-side')).toBe(side);
      });
    }
  }

  it('in right-to-left writing, start and end follow the direction on the top and bottom sides', async () => {
    const setup = await mount({ side: 'bottom', align: 'start' });
    document.body.dir = 'rtl';
    try {
      await open(setup);
      let box = surface(setup.popover).getBoundingClientRect();
      const anchor = setup.trigger.getBoundingClientRect();
      near(box.right, anchor.right);
      setup.popover.align = 'end';
      await settle(setup.popover);
      await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
      box = surface(setup.popover).getBoundingClientRect();
      near(box.left, anchor.left);
    } finally {
      document.body.dir = '';
    }
  });

  it('turns to the opposite side when the one asked for does not fit and the other does', async () => {
    const setup = await mount({ side: 'bottom' }, { at: { left: 400, top: 700 } });
    await open(setup);
    const box = surface(setup.popover).getBoundingClientRect();
    const anchor = setup.trigger.getBoundingClientRect();
    expect(surface(setup.popover).getAttribute('data-side')).toBe('top');
    near(box.bottom, anchor.top - OFFSET());
    /* The attribute the consumer set is not rewritten. */
    expect(setup.popover.getAttribute('side')).toBe('bottom');
  });

  it('turns from top to bottom near the top edge, and from left to right near the left edge', async () => {
    const top = await mount({ side: 'top' }, { at: { left: 400, top: 20 } });
    await open(top);
    expect(surface(top.popover).getAttribute('data-side')).toBe('bottom');
    document.body.replaceChildren();
    const left = await mount({ side: 'left' }, { at: { left: 20, top: 300 } });
    await open(left);
    expect(surface(left.popover).getAttribute('data-side')).toBe('right');
  });

  it('keeps the side asked for when it fits, even if the other has more room', async () => {
    const setup = await mount({ side: 'top' }, { at: { left: 400, top: 400 } });
    await open(setup);
    expect(surface(setup.popover).getAttribute('data-side')).toBe('top');
  });

  it('never leaves the window', async () => {
    const setup = await mount({ side: 'bottom', align: 'center' }, { at: { left: 940, top: 300 } });
    await open(setup);
    const box = surface(setup.popover).getBoundingClientRect();
    expect(box.right).toBeLessThanOrEqual(document.documentElement.clientWidth + 0.5);
    expect(box.left).toBeGreaterThanOrEqual(-0.5);
    const edge = await mount({ side: 'bottom', align: 'center' }, { at: { left: 2, top: 300 } });
    await open(edge);
    expect(surface(edge.popover).getBoundingClientRect().left).toBeGreaterThanOrEqual(-0.5);
  });

  it('follows the trigger when the page scrolls', async () => {
    const spacer = document.createElement('div');
    spacer.style.cssText = 'block-size: 3000px;';
    document.body.append(spacer);
    const setup = await mount();
    setup.trigger.style.position = 'absolute';
    await open(setup);
    const before = surface(setup.popover).getBoundingClientRect().top;
    window.scrollTo(0, 80);
    await new Promise((resolve) => setTimeout(resolve, 150));
    const after = surface(setup.popover).getBoundingClientRect().top;
    near(before - after, 80);
  });

  it('follows the trigger when it moves with the window resize', async () => {
    const setup = await mount();
    await open(setup);
    setup.trigger.style.left = '300px';
    window.dispatchEvent(new Event('resize'));
    await new Promise((resolve) => setTimeout(resolve, 100));
    const box = surface(setup.popover).getBoundingClientRect();
    const anchor = setup.trigger.getBoundingClientRect();
    near(box.left + box.width / 2, anchor.left + anchor.width / 2);
  });

  it('a trigger scrolled out of the window takes the surface with it', async () => {
    const setup = await mount();
    await open(setup);
    setup.trigger.style.top = '-400px';
    window.dispatchEvent(new Event('resize'));
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(surface(setup.popover).style.visibility).toBe('hidden');
  });

  it('a change of side while open moves the surface', async () => {
    const setup = await mount({ side: 'bottom' });
    await open(setup);
    setup.popover.side = 'right';
    await settle(setup.popover);
    await new Promise((resolve) => setTimeout(resolve, 100));
    const box = surface(setup.popover).getBoundingClientRect();
    const anchor = setup.trigger.getBoundingClientRect();
    near(box.left, anchor.right + OFFSET());
  });
});

describe('the arrow (P111)', () => {
  const near = (a: number, b: number): void => expect(Math.abs(a - b)).toBeLessThan(1.5);

  it('is off by default and draws nothing', async () => {
    const setup = await mount();
    expect(part(setup.popover, '.arrow')).toBeNull();
  });

  it('is 16 wide and 8 tall past the border, and its base overlaps the border by one border width', async () => {
    const setup = await mount({ arrow: true });
    await open(setup);
    const arrow = (part(setup.popover, '.arrow') as unknown as SVGElement).getBoundingClientRect();
    near(arrow.width, px('--nph-popover-arrow-width'));
    near(arrow.height, px('--nph-popover-arrow-height') + px('--nph-popover-border-width'));
  });

  for (const side of NPH_POPOVER_SIDES) {
    it(`${side}: the surface sits one arrow height further and the tip keeps popover/offset from the trigger`, async () => {
      const setup = await mount({ side, arrow: true });
      await open(setup);
      const box = surface(setup.popover).getBoundingClientRect();
      const anchor = setup.trigger.getBoundingClientRect();
      const arrow = (part(setup.popover, '.arrow') as unknown as SVGElement).getBoundingClientRect();
      const offset = px('--nph-popover-offset');
      const height = px('--nph-popover-arrow-height');
      if (side === 'bottom') {
        near(box.top - anchor.bottom, offset + height);
        near(arrow.top - anchor.bottom, offset);
      }
      if (side === 'top') {
        near(anchor.top - box.bottom, offset + height);
        near(anchor.top - arrow.bottom, offset);
      }
      if (side === 'right') {
        near(box.left - anchor.right, offset + height);
        near(arrow.left - anchor.right, offset);
      }
      if (side === 'left') {
        near(anchor.left - box.right, offset + height);
        near(anchor.left - arrow.right, offset);
      }
    });
  }

  it('center: the arrow sits in the middle of the edge, pointing to the middle of the trigger', async () => {
    const setup = await mount({ arrow: true, align: 'center' });
    await open(setup);
    const arrow = (part(setup.popover, '.arrow') as unknown as SVGElement).getBoundingClientRect();
    const anchor = setup.trigger.getBoundingClientRect();
    near(arrow.left + arrow.width / 2, anchor.left + anchor.width / 2);
  });

  it('start and end: the arrow keeps popover/arrow-inset from the corner', async () => {
    const start = await mount({ arrow: true, align: 'start' });
    await open(start);
    const box = surface(start.popover).getBoundingClientRect();
    let arrow = (part(start.popover, '.arrow') as unknown as SVGElement).getBoundingClientRect();
    near(arrow.left - box.left, px('--nph-popover-arrow-inset'));
    document.body.replaceChildren();
    const end = await mount({ arrow: true, align: 'end' });
    await open(end);
    const endBox = surface(end.popover).getBoundingClientRect();
    arrow = (part(end.popover, '.arrow') as unknown as SVGElement).getBoundingClientRect();
    near(endBox.right - arrow.right, px('--nph-popover-arrow-inset'));
  });

  it('on the right and left sides the arrow runs down the edge and keeps the inset from the top', async () => {
    const setup = await mount({ arrow: true, side: 'right', align: 'start' });
    await open(setup);
    const box = surface(setup.popover).getBoundingClientRect();
    const arrow = (part(setup.popover, '.arrow') as unknown as SVGElement).getBoundingClientRect();
    near(arrow.top - box.top, px('--nph-popover-arrow-inset'));
    near(arrow.width, px('--nph-popover-arrow-height') + px('--nph-popover-border-width'));
    near(arrow.height, px('--nph-popover-arrow-width'));
  });

  it('when the window pushes the surface sideways, the tip still points to the trigger', async () => {
    const setup = await mount({ arrow: true, align: 'center' }, { at: { left: 930, top: 300 } });
    await open(setup);
    const arrow = (part(setup.popover, '.arrow') as unknown as SVGElement).getBoundingClientRect();
    const anchor = setup.trigger.getBoundingClientRect();
    near(arrow.left + arrow.width / 2, anchor.left + anchor.width / 2);
  });

  it('the arrow never gets closer to a corner than the inset', async () => {
    const setup = await mount({ arrow: true, align: 'center' }, { at: { left: 1000, top: 300 } });
    await open(setup);
    const box = surface(setup.popover).getBoundingClientRect();
    const arrow = (part(setup.popover, '.arrow') as unknown as SVGElement).getBoundingClientRect();
    expect(box.right - arrow.right).toBeGreaterThanOrEqual(px('--nph-popover-arrow-inset') - 1.5);
  });

  it('is filled with popover/background and outlined with popover/border on the two slanted edges', async () => {
    const setup = await mount({ arrow: true });
    const fill = part(setup.popover, '.arrow-fill') as unknown as SVGElement;
    const line = part(setup.popover, '.arrow-line') as unknown as SVGElement;
    expect(getComputedStyle(fill).fill).toBe(colorOf('--nph-popover-background'));
    expect(getComputedStyle(line).stroke).toBe(colorOf('--nph-popover-border'));
    expect(getComputedStyle(line).strokeWidth).toBe(`${px('--nph-popover-border-width')}px`);
    expect(getComputedStyle(line).fill).toBe('none');
  });

  it('follows the resolved side when the surface turns', async () => {
    const setup = await mount({ arrow: true, side: 'bottom' }, { at: { left: 400, top: 700 } });
    await open(setup);
    const box = surface(setup.popover).getBoundingClientRect();
    const arrow = (part(setup.popover, '.arrow') as unknown as SVGElement).getBoundingClientRect();
    expect(surface(setup.popover).getAttribute('data-side')).toBe('top');
    near(arrow.top, box.bottom - px('--nph-popover-border-width'));
  });
});

describe('the three widths', () => {
  for (const [size, token] of [
    ['sm', '--nph-popover-width-sm'],
    ['md', '--nph-popover-width-md'],
    ['lg', '--nph-popover-width-lg'],
  ] as const) {
    it(`${size}: ${token} wide, and only the width changes`, async () => {
      const setup = await mount({ size: size as NphPopoverSize, description: 'Narrow the list.' }, { footer: FOOTER });
      await open(setup);
      expect(surface(setup.popover).getBoundingClientRect().width).toBeCloseTo(px(token), 0);
      const content = part(setup.popover, '.content') as HTMLElement;
      expect(getComputedStyle(content).paddingLeft).toBe(`${px('--nph-popover-padding')}px`);
      const footer = part(setup.popover, '.footer') as HTMLElement;
      expect(getComputedStyle(footer).columnGap).toBe(`${px('--nph-popover-footer-gap')}px`);
    });
  }

  it('md is the default and the widths are 240, 320 and 400', async () => {
    expect(px('--nph-popover-width-sm')).toBe(240);
    expect(px('--nph-popover-width-md')).toBe(320);
    expect(px('--nph-popover-width-lg')).toBe(400);
    const setup = await mount();
    await open(setup);
    expect(surface(setup.popover).getBoundingClientRect().width).toBeCloseTo(320, 0);
  });

  it('a window narrower than the width holds the surface inside it', async () => {
    await page.viewport(280, 700);
    try {
      const setup = await mount({ size: 'lg' }, { at: { left: 100, top: 300 } });
      await open(setup);
      const box = surface(setup.popover).getBoundingClientRect();
      expect(box.width).toBeLessThanOrEqual(document.documentElement.clientWidth + 0.5);
      expect(box.left).toBeGreaterThanOrEqual(-0.5);
    } finally {
      await page.viewport(1024, 768);
    }
  });
});

describe('the parts and their measures', () => {
  it('the title is always there, and the description, close and footer are optional', async () => {
    const bare = await mount();
    expect(part(bare.popover, '.heading')?.textContent?.trim()).toBe('Filters');
    expect(part(bare.popover, '.description')).toBeNull();
    expect(part(bare.popover, '.close')).toBeNull();
    expect((part(bare.popover, '.footer') as HTMLElement).hidden).toBe(true);
    expect((part(bare.popover, '.divider') as HTMLElement).hidden).toBe(true);
    expect((part(bare.popover, '.body') as HTMLElement).hidden).toBe(true);
  });

  it('the divider comes with the footer: with no footer there is none', async () => {
    const withFooter = await mount({}, { footer: FOOTER });
    await open(withFooter);
    const divider = part(withFooter.popover, '.divider') as HTMLElement;
    expect(divider.hidden).toBe(false);
    expect(divider.getBoundingClientRect().height).toBeGreaterThan(0);
    document.body.replaceChildren();
    const without = await mount({}, { body: '<p>Body</p>' });
    await open(without);
    expect((part(without.popover, '.divider') as HTMLElement).hidden).toBe(true);
    expect(part(without.popover, '.divider')?.getBoundingClientRect().height).toBe(0);
  });

  it('a footer added later brings the divider, and removed, takes it away', async () => {
    const setup = await mount();
    await open(setup);
    const button = document.createElement('nph-button');
    button.slot = 'footer';
    button.text = 'Apply';
    setup.popover.append(button);
    await settle(setup.popover);
    expect((part(setup.popover, '.divider') as HTMLElement).hidden).toBe(false);
    button.remove();
    await settle(setup.popover);
    expect((part(setup.popover, '.divider') as HTMLElement).hidden).toBe(true);
  });

  it('the divider runs from edge to edge in popover/divider, with popover/border-width', async () => {
    const setup = await mount({}, { footer: FOOTER });
    await open(setup);
    const divider = part(setup.popover, '.divider') as HTMLElement;
    const box = surface(setup.popover).getBoundingClientRect();
    const line = divider.getBoundingClientRect();
    const border = px('--nph-popover-border-width');
    expect(line.left).toBeCloseTo(box.left + border, 0);
    expect(line.right).toBeCloseTo(box.right - border, 0);
    expect(line.height).toBeCloseTo(border, 0);
    expect(getComputedStyle(divider).backgroundColor).toBe(colorOf('--nph-popover-divider'));
  });

  it('the footer actions sit at the end, popover/footer-gap apart, with popover/footer-padding around', async () => {
    const setup = await mount({}, { footer: FOOTER });
    await open(setup);
    const clear = setup.popover.querySelector('nph-button[text="Clear"]') as NphButton;
    const apply = setup.popover.querySelector('nph-button[text="Apply"]') as NphButton;
    const footer = part(setup.popover, '.footer') as HTMLElement;
    const a = clear.getBoundingClientRect();
    const b = apply.getBoundingClientRect();
    const f = footer.getBoundingClientRect();
    const gap = px('--nph-popover-footer-gap');
    const pad = px('--nph-popover-footer-padding');
    expect(b.left - a.right).toBeCloseTo(gap, 0);
    expect(f.right - b.right).toBeCloseTo(pad, 0);
    expect(a.top - f.top).toBeCloseTo(pad, 0);
    expect(f.bottom - a.bottom).toBeCloseTo(pad, 0);
    expect(gap).toBe(12);
  });

  it('the footer buttons are compact: 28 tall', async () => {
    const setup = await mount({}, { footer: FOOTER });
    await open(setup);
    const clear = setup.popover.querySelector('nph-button[text="Clear"]') as NphButton;
    expect(clear.getBoundingClientRect().height).toBeCloseTo(px('--nph-control-height-compact'), 0);
  });

  it('on a touch screen the footer buttons go back to the default size: the token is redefined in scope with no new value', async () => {
    const rule = /@media \(pointer: coarse\)\s*\{\s*\.footer\s*\{\s*--nph-control-height-compact:\s*var\(--nph-control-height-default\);\s*\}\s*\}/;
    expect(componentCss).toMatch(rule);
    const setup = await mount({}, { footer: FOOTER });
    await open(setup);
    const footer = part(setup.popover, '.footer') as HTMLElement;
    footer.style.setProperty('--nph-control-height-compact', 'var(--nph-control-height-default)');
    const clear = setup.popover.querySelector('nph-button[text="Clear"]') as NphButton;
    await clear.updateComplete;
    expect(clear.getBoundingClientRect().height).toBeCloseTo(px('--nph-control-height-default'), 0);
    expect(px('--nph-control-height-default')).toBe(36);
  });

  it('the title and the close button are popover/title-gap apart; the close button is compact ghost, 28 by 28', async () => {
    const setup = await mount({ closable: true, closeLabel: 'Close' });
    await open(setup);
    const close = part(setup.popover, '.close') as NphButton;
    const heading = part(setup.popover, '.heading') as HTMLElement;
    const box = close.getBoundingClientRect();
    expect(box.width).toBeCloseTo(px('--nph-control-height-compact'), 0);
    expect(box.height).toBeCloseTo(px('--nph-control-height-compact'), 0);
    expect(close.getAttribute('severity')).toBe('secondary');
    expect(close.getAttribute('emphasis')).toBe('ghost');
    expect(close.getAttribute('size')).toBe('compact');
    expect(close.getAttribute('icon-start')).toBe('xmark');
    expect(getComputedStyle(part(setup.popover, '.header') as HTMLElement).columnGap).toBe(`${px('--nph-popover-title-gap')}px`);
    expect(box.left).toBeGreaterThan(heading.getBoundingClientRect().left);
  });

  it('title, description and body are popover/header-gap apart, inside popover/padding', async () => {
    const setup = await mount({ description: 'Narrow the list.' }, { body: '<p id="body">Body</p>' });
    await open(setup);
    const heading = (part(setup.popover, '.header') as HTMLElement).getBoundingClientRect();
    const description = (part(setup.popover, '.description') as HTMLElement).getBoundingClientRect();
    const body = (part(setup.popover, '.body') as HTMLElement).getBoundingClientRect();
    const box = surface(setup.popover).getBoundingClientRect();
    const border = px('--nph-popover-border-width');
    const gap = px('--nph-popover-header-gap');
    expect(description.top - heading.bottom).toBeCloseTo(gap, 0);
    expect(body.top - description.bottom).toBeCloseTo(gap, 0);
    expect(heading.top - box.top).toBeCloseTo(px('--nph-popover-padding') + border, 0);
    expect(gap).toBe(12);
  });

  it('the title is text/label-lg in popover/foreground and the description text/body-sm in popover/description', async () => {
    const setup = await mount({ description: 'Narrow the list.' });
    await open(setup);
    const heading = part(setup.popover, '.heading') as HTMLElement;
    const description = part(setup.popover, '.description') as HTMLElement;
    expect(typographyFrom(heading)).toEqual(typographyOf('label-lg'));
    expect(typographyFrom(description)).toEqual(typographyOf('body-sm'));
    expect(getComputedStyle(heading).color).toBe(colorOf('--nph-popover-foreground'));
    expect(getComputedStyle(description).color).toBe(colorOf('--nph-popover-description'));
  });

  it('a long title with no space breaks instead of being cut', async () => {
    const setup = await mount({ heading: 'x'.repeat(70) });
    await open(setup);
    const heading = part(setup.popover, '.heading') as HTMLElement;
    expect(heading.scrollWidth).toBeLessThanOrEqual(heading.clientWidth + 1);
  });

  it('the surface does not clip what is inside, so the focus ring of an inner piece is not cut', async () => {
    const setup = await mount({}, { footer: FOOTER });
    await open(setup);
    expect(getComputedStyle(surface(setup.popover)).overflow).toBe('visible');
    expect(getComputedStyle(part(setup.popover, '.content') as HTMLElement).overflow).toBe('visible');
    expect(getComputedStyle(part(setup.popover, '.footer') as HTMLElement).overflow).toBe('visible');
  });

  it('the body hosts an nph-field and keeps its focus ring inside the painted surface', async () => {
    const setup = await mount({}, { body: '<nph-field label="Name" help="Help"><nph-input name="n"></nph-input></nph-field>' });
    await import('../nph-input/nph-input');
    await open(setup);
    const field = setup.popover.querySelector('nph-field') as HTMLElement;
    expect(field.getBoundingClientRect().width).toBeGreaterThan(0);
    expect(field.getBoundingClientRect().right).toBeLessThanOrEqual(surface(setup.popover).getBoundingClientRect().right);
  });
});

describe('colors and surface, in both schemes', () => {
  for (const scheme of ['light', 'dark'] as const) {
    it(`${scheme}: popover/background, popover/border and popover/border-width, popover/radius and the dropdown shadow`, async () => {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const setup = await mount({ description: 'x' });
      await open(setup);
      const style = getComputedStyle(surface(setup.popover));
      expect(style.backgroundColor).toBe(colorOf('--nph-popover-background'));
      expect(style.borderTopColor).toBe(colorOf('--nph-popover-border'));
      expect(style.borderTopWidth).toBe(`${px('--nph-popover-border-width')}px`);
      expect(style.borderTopLeftRadius).toBe(`${px('--nph-popover-radius')}px`);
      expect(px('--nph-popover-radius')).toBe(14);
      expect(style.boxShadow).toBe(resolved('box-shadow', '--nph-elevation-dropdown'));
      expect(style.color).toBe(colorOf('--nph-popover-foreground'));
    });
  }

  it('dark: the surface has no shadow, the lighter surface is the elevation; light has a diffuse one', async () => {
    document.documentElement.setAttribute('data-nph-color-scheme', 'dark');
    const dark = await mount();
    await open(dark);
    const darkShadow = getComputedStyle(surface(dark.popover)).boxShadow;
    document.body.replaceChildren();
    document.documentElement.setAttribute('data-nph-color-scheme', 'light');
    const light = await mount();
    await open(light);
    const lightShadow = getComputedStyle(surface(light.popover)).boxShadow;
    expect(lightShadow).not.toBe('none');
    expect(darkShadow === 'none' || /rgba\(0, 0, 0, 0\)/.test(darkShadow)).toBe(true);
  });

  it('the border and the divider use the same color/border-subtle token in both schemes', async () => {
    expect(tokensCss).toMatch(/--nph-popover-border: var\(--nph-color-border-subtle\)/);
    expect(tokensCss).toMatch(/--nph-popover-divider: var\(--nph-color-border-subtle\)/);
  });

  it('the surface is placed in a scope with another brand and scheme and takes its tokens (P67)', async () => {
    const scope = document.createElement('div');
    scope.setAttribute('data-nph-color-scheme', 'dark');
    document.body.append(scope);
    const trigger = document.createElement('button');
    trigger.id = 'scoped';
    trigger.style.cssText = 'position: fixed; left: 400px; top: 300px;';
    const popover = document.createElement('nph-popover');
    popover.setAttribute('for', 'scoped');
    popover.heading = 'Filters';
    scope.append(trigger, popover);
    await settle(popover);
    trigger.click();
    await settle(popover);
    const probe = document.createElement('div');
    probe.style.setProperty('background-color', 'var(--nph-popover-background)');
    scope.append(probe);
    expect(getComputedStyle(surface(popover)).backgroundColor).toBe(getComputedStyle(probe).backgroundColor);
    expect(getComputedStyle(surface(popover)).backgroundColor).not.toBe(colorOf('--nph-popover-background'));
  });
});

describe('the exit and the motion', () => {
  it('the surface leaves the top layer when the exit ends, not before', async () => {
    const setup = await mount();
    await open(setup);
    setup.popover.open = false;
    await settle(setup.popover);
    expect(surface(setup.popover).hasAttribute('data-open')).toBe(false);
    await until(() => !shown(setup.popover));
    expect(shown(setup.popover)).toBe(false);
  });

  it('opening again during the exit cancels it', async () => {
    const setup = await mount();
    await open(setup);
    setup.popover.open = false;
    await settle(setup.popover);
    setup.popover.open = true;
    await settle(setup.popover);
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(shown(setup.popover)).toBe(true);
    expect(surface(setup.popover).hasAttribute('data-open')).toBe(true);
  });

  it('reduced motion: only the duration of motion/hover-duration, the curve stays', () => {
    expect(componentCss).toMatch(
      /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.surface,\s*\.surface\[data-open\]\s*\{\s*transition-duration: var\(--nph-motion-hover-duration\);/,
    );
  });
});

describe('token contract', () => {
  const css = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const used = new Set([...css.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1] ?? ''));

  it('every consumed token exists in the generated CSS', () => {
    for (const name of new Set(componentCss.match(/--nph-[a-z0-9-]+/g) ?? [])) {
      expect(tokensCss, name).toContain(`${name}:`);
    }
  });

  it('the 19 popover/* tokens are all consumed, by the CSS or by the placement', () => {
    const declared = [...tokensCss.matchAll(/^\s*(--nph-popover-[a-z-]+):/gm)].map((match) => match[1] ?? '');
    expect(new Set(declared).size).toBe(19);
    for (const name of new Set(declared)) {
      expect(used.has(name) || componentSource.includes(name), name).toBe(true);
    }
  });

  it('consumes only semantic tokens of the evidence, never core or theme', () => {
    expect(css).not.toMatch(/--nph-core-|--nph-theme-/);
    expect(componentSource).not.toMatch(/--nph-core-|--nph-theme-/);
  });

  it('writes no literal design value in the CSS', () => {
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|\b\d+(\.\d+)?(px|rem|em|ms|s)\b/);
  });

  it('the elevation is the dropdown style, with no component token', () => {
    expect(used.has('--nph-elevation-dropdown')).toBe(true);
    expect(tokensCss).not.toMatch(/--nph-popover-(shadow|elevation)/);
  });
});
