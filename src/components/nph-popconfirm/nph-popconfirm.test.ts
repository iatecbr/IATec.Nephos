/**
 * Tests of `nph-popconfirm`, in a real browser (P21, item 5): the top layer, the placement, keyboard
 * focus, real clicks and measures only exist where there is layout.
 *
 * They prove the contract accepted in Figma (documentation frame `7389:104`, set `7222:3568`),
 * recorded in the evidence of the `figma-docs-accepted` gate of DSA-99: the API and the invalid
 * input, the trigger and the attributes the popconfirm writes on it, opening and closing, the
 * events and their sources, the focus rule by type, the Tab kept between the two buttons, the slow
 * Confirm, the actions that stack, the placement and the arrow, the widths, the roles and names the
 * browser computes, and the token contract.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cdp, page, userEvent } from 'vitest/browser';
import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import componentCss from './nph-popconfirm.css?raw';
import componentSource from './nph-popconfirm.ts?raw';
import {
  NPH_POPCONFIRM_ALIGNMENTS,
  NPH_POPCONFIRM_SIDES,
  NPH_POPCONFIRM_SIZES,
  NPH_POPCONFIRM_TYPES,
  NphPopconfirm,
} from './nph-popconfirm';
import type { NphPopconfirmCancelSource } from './nph-popconfirm';
import type { NphButton } from '../nph-button/nph-button';
import '../nph-button/nph-button';

beforeAll(async () => {
  await document.fonts.load('400 14px "Noto Sans"');
  await document.fonts.load('500 14px "Noto Sans"');
  await document.fonts.ready;
  /* Room for every side of a popconfirm around a trigger in the middle. */
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
  popconfirm: NphPopconfirm;
  trigger: NphButton;
}

async function mount(props: Partial<NphPopconfirm> = {}, at = { left: 400, top: 300 }): Promise<Setup> {
  const trigger = document.createElement('nph-button');
  trigger.id = 'trigger';
  trigger.severity = 'secondary';
  trigger.text = 'Delete';
  trigger.style.cssText = `position: fixed; left: ${at.left}px; top: ${at.top}px;`;
  const popconfirm = document.createElement('nph-popconfirm');
  popconfirm.setAttribute('for', 'trigger');
  popconfirm.heading = 'Delete this file?';
  popconfirm.description = 'The file goes to the trash and leaves the folder.';
  popconfirm.confirmLabel = 'Delete';
  popconfirm.cancelLabel = 'Cancel';
  Object.assign(popconfirm, props);
  document.body.append(trigger, popconfirm);
  await trigger.updateComplete;
  await settle(popconfirm);
  return { popconfirm, trigger };
}

async function frame(): Promise<void> {
  await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
}

async function settle(popconfirm: NphPopconfirm): Promise<void> {
  await popconfirm.updateComplete;
  await frame();
  await popconfirm.updateComplete;
}

/** Opens the popconfirm the way the person does and waits for it to be placed and focused. */
async function open(setup: Setup): Promise<void> {
  await userEvent.click(setup.trigger);
  await settle(setup.popconfirm);
  await frame();
  await frame();
}

const surface = (popconfirm: NphPopconfirm): HTMLElement => popconfirm.shadowRoot?.querySelector('.surface') as HTMLElement;
const part = (popconfirm: NphPopconfirm, selector: string): HTMLElement | null =>
  popconfirm.shadowRoot?.querySelector<HTMLElement>(selector) ?? null;
const cancelOf = (popconfirm: NphPopconfirm): NphButton => part(popconfirm, '.cancel') as NphButton;
const confirmOf = (popconfirm: NphPopconfirm): NphButton => part(popconfirm, '.confirm') as NphButton;
const shown = (popconfirm: NphPopconfirm): boolean => surface(popconfirm)?.matches(':popover-open') ?? false;
const control = (button: NphButton): HTMLButtonElement => button.shadowRoot?.querySelector('button') as HTMLButtonElement;

async function until(condition: () => boolean, ms = 1500): Promise<void> {
  const start = performance.now();
  while (!condition()) {
    if (performance.now() - start > ms) throw new Error('condition not met in time');
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
}

function within(node: Node | null, ancestor: Node): boolean {
  let current: Node | null = node;
  while (current !== null) {
    if (current === ancestor) return true;
    current = current.parentNode ?? (current instanceof ShadowRoot ? current.host : null);
  }
  return false;
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

/** The node the browser itself builds for an element in its accessibility tree. */
async function axNode(element: Element): Promise<{ role: string; name: string; description: string }> {
  const session = cdp();
  await session.send('Accessibility.enable');
  element.setAttribute('data-ax-probe', '');
  try {
    await session.send('DOM.getDocument', { depth: -1, pierce: true });
    const { searchId, resultCount } = await session.send('DOM.performSearch', {
      query: '[data-ax-probe]',
      includeUserAgentShadowDOM: false,
    });
    expect(resultCount).toBe(1);
    const { nodeIds } = await session.send('DOM.getSearchResults', { searchId, fromIndex: 0, toIndex: 1 });
    await session.send('DOM.discardSearchResults', { searchId });
    const { nodes } = await session.send('Accessibility.getPartialAXTree', {
      nodeId: nodeIds[0] as number,
      fetchRelatives: false,
    });
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

function cancels(popconfirm: NphPopconfirm): NphPopconfirmCancelSource[] {
  const seen: NphPopconfirmCancelSource[] = [];
  popconfirm.addEventListener('nph-cancel', (event) =>
    seen.push((event as CustomEvent<{ source: NphPopconfirmCancelSource }>).detail.source),
  );
  return seen;
}

describe('registration and API', () => {
  it('registers the tag once and exposes the class', () => {
    expect(customElements.get('nph-popconfirm')).toBe(NphPopconfirm);
    expect(document.createElement('nph-popconfirm')).toBeInstanceOf(NphPopconfirm);
  });

  it('has the defaults of the contract: default type, sm, bottom, center, no arrow, icon on, closed', () => {
    const popconfirm = document.createElement('nph-popconfirm');
    expect(popconfirm.type).toBe('default');
    expect(popconfirm.size).toBe('sm');
    expect(popconfirm.side).toBe('bottom');
    expect(popconfirm.align).toBe('center');
    expect(popconfirm.arrow).toBe(false);
    expect(popconfirm.hideIcon).toBe(false);
    expect(popconfirm.open).toBe(false);
    expect(popconfirm.loading).toBe(false);
  });

  it('exposes the lists of the contract', () => {
    expect(NPH_POPCONFIRM_TYPES).toEqual(['default', 'warning', 'destructive']);
    expect(NPH_POPCONFIRM_SIZES).toEqual(['sm', 'md']);
    expect(NPH_POPCONFIRM_SIDES).toEqual(['bottom', 'top', 'right', 'left']);
    expect(NPH_POPCONFIRM_ALIGNMENTS).toEqual(['start', 'center', 'end']);
  });

  it('draws nothing and says why, once per cause, when the input is invalid', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { popconfirm } = await mount({ heading: '', confirmLabel: '', cancelLabel: '' });
    await new Promise((resolve) => setTimeout(resolve, 80));
    expect(popconfirm.hasAttribute('data-nph-rendered')).toBe(false);
    expect(surface(popconfirm)).toBeNull();
    const messages = error.mock.calls.map((call) => String(call[0]));
    expect(messages.some((message) => message.includes('heading is required'))).toBe(true);
    expect(messages.some((message) => message.includes('confirm-label is required'))).toBe(true);
    expect(messages.some((message) => message.includes('cancel-label is required'))).toBe(true);
    const count = messages.length;
    popconfirm.requestUpdate();
    await popconfirm.updateComplete;
    expect(error.mock.calls.length).toBe(count);
  });

  it('does not render for a type, size, side or align outside the lists', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    for (const bad of [{ type: 'danger' }, { size: 'lg' }, { side: 'middle' }, { align: 'stretch' }]) {
      const { popconfirm } = await mount(bad as unknown as Partial<NphPopconfirm>);
      await new Promise((resolve) => setTimeout(resolve, 80));
      expect(surface(popconfirm)).toBeNull();
      document.body.replaceChildren();
    }
  });

  it('does not render when `for` matches no element in the same root', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { popconfirm } = await mount();
    popconfirm.setAttribute('for', 'missing');
    await new Promise((resolve) => setTimeout(resolve, 120));
    expect(surface(popconfirm)).toBeNull();
    expect(error.mock.calls.some((call) => String(call[0]).includes('matches no element'))).toBe(true);
  });
});

describe('trigger and opening', () => {
  it('writes aria-haspopup, aria-expanded and aria-controls on the trigger', async () => {
    const { popconfirm, trigger } = await mount();
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-controls')).toBe(popconfirm.id);
    expect(popconfirm.id).not.toBe('');
  });

  it('opens by click and by the keyboard, never by hover or focus', async () => {
    const setup = await mount();
    await userEvent.hover(setup.trigger);
    await userEvent.tab();
    await settle(setup.popconfirm);
    expect(setup.popconfirm.open).toBe(false);
    await userEvent.keyboard('{Enter}');
    await settle(setup.popconfirm);
    expect(setup.popconfirm.open).toBe(true);
    expect(shown(setup.popconfirm)).toBe(true);
    expect(setup.trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('does not open from a disabled trigger', async () => {
    const setup = await mount();
    setup.trigger.disabled = true;
    await setup.trigger.updateComplete;
    setup.trigger.click();
    await settle(setup.popconfirm);
    expect(setup.popconfirm.open).toBe(false);
  });

  it('removes what it wrote on the trigger when it leaves the page', async () => {
    const { popconfirm, trigger } = await mount();
    popconfirm.remove();
    expect(trigger.hasAttribute('aria-haspopup')).toBe(false);
    expect(trigger.hasAttribute('aria-expanded')).toBe(false);
    expect(trigger.hasAttribute('aria-controls')).toBe(false);
  });
});

describe('roles, names and the surface', () => {
  it('is an alertdialog, with no aria-modal, named by the title and described by the description', async () => {
    const setup = await mount();
    await open(setup);
    const el = surface(setup.popconfirm);
    expect(el.getAttribute('role')).toBe('alertdialog');
    expect(el.hasAttribute('aria-modal')).toBe(false);
    const node = await axNode(el);
    expect(node.role).toBe('alertdialog');
    expect(node.name).toBe('Delete this file?');
    expect(node.description).toBe('The file goes to the trash and leaves the folder.');
  });

  it('has no description and no aria-describedby without one', async () => {
    const setup = await mount({ description: '' });
    await open(setup);
    expect(part(setup.popconfirm, '.description')).toBeNull();
    expect(surface(setup.popconfirm).hasAttribute('aria-describedby')).toBe(false);
  });

  it('draws the icon decoratively and turns it off with hide-icon', async () => {
    const setup = await mount();
    await open(setup);
    expect(part(setup.popconfirm, '.icon-box')?.getAttribute('aria-hidden')).toBe('true');
    setup.popconfirm.hideIcon = true;
    await settle(setup.popconfirm);
    expect(part(setup.popconfirm, '.icon-box')).toBeNull();
  });

  it('chooses the glyph by type: a question for default, an alert for warning and destructive', async () => {
    const names: string[] = [];
    for (const type of NPH_POPCONFIRM_TYPES) {
      const setup = await mount({ type });
      await open(setup);
      names.push(part(setup.popconfirm, '.icon-box nph-icon')?.getAttribute('name') ?? '');
      expect(part(setup.popconfirm, '.icon-box nph-icon')?.getAttribute('variant')).toBe('solid');
      document.body.replaceChildren();
    }
    expect(names).toEqual(['circle-question', 'triangle-exclamation', 'triangle-exclamation']);
  });

  it('uses the danger Confirm in destructive and the primary one otherwise; Cancel is secondary', async () => {
    for (const type of NPH_POPCONFIRM_TYPES) {
      const setup = await mount({ type });
      await open(setup);
      expect(confirmOf(setup.popconfirm).severity).toBe(type === 'destructive' ? 'danger' : 'primary');
      expect(cancelOf(setup.popconfirm).severity).toBe('secondary');
      expect(confirmOf(setup.popconfirm).size).toBe('default');
      document.body.replaceChildren();
    }
  });

  it('has the fixed widths of the tokens, 304 in sm and 372 in md', async () => {
    const sm = await mount({ size: 'sm' });
    await open(sm);
    expect(surface(sm.popconfirm).getBoundingClientRect().width).toBeCloseTo(px('--nph-popconfirm-width-sm'), 0);
    document.body.replaceChildren();
    const md = await mount({ size: 'md' });
    await open(md);
    expect(surface(md.popconfirm).getBoundingClientRect().width).toBeCloseTo(px('--nph-popconfirm-width-md'), 0);
  });

  it('never gets wider than the window minus its margin', async () => {
    await page.viewport(320, 640);
    try {
      const setup = await mount({ size: 'md' }, { left: 100, top: 300 });
      await open(setup);
      expect(surface(setup.popconfirm).getBoundingClientRect().width).toBeLessThanOrEqual(
        document.documentElement.clientWidth - 2 * px('--nph-layout-margin-compact') + 0.5,
      );
    } finally {
      await page.viewport(1024, 768);
    }
  });

  it('paints the surface, the border and the icon box with the popconfirm tokens', async () => {
    const setup = await mount({ type: 'warning' });
    await open(setup);
    const style = getComputedStyle(surface(setup.popconfirm));
    expect(style.backgroundColor).toBe(colorOf('--nph-popconfirm-background'));
    expect(style.borderTopColor).toBe(colorOf('--nph-popconfirm-border'));
    expect(Number.parseFloat(style.borderTopWidth)).toBeCloseTo(px('--nph-popconfirm-border-width'), 1);
    expect(Number.parseFloat(style.borderTopLeftRadius)).toBeCloseTo(px('--nph-popconfirm-radius'), 1);
    const box = getComputedStyle(part(setup.popconfirm, '.icon-box') as HTMLElement);
    expect(box.backgroundColor).toBe(colorOf('--nph-popconfirm-icon-box-background-warning'));
    expect(box.color).toBe(colorOf('--nph-popconfirm-icon-foreground-warning'));
  });

  it('measures the icon box 32 px in sm and 40 px in md', async () => {
    const sm = await mount({ size: 'sm' });
    await open(sm);
    expect(part(sm.popconfirm, '.icon-box')?.getBoundingClientRect().width).toBeCloseTo(
      px('--nph-popconfirm-icon-size-sm') + 2 * px('--nph-popconfirm-icon-box-padding'),
      0,
    );
    document.body.replaceChildren();
    const md = await mount({ size: 'md' });
    await open(md);
    expect(part(md.popconfirm, '.icon-box')?.getBoundingClientRect().width).toBeCloseTo(
      px('--nph-popconfirm-icon-size-md') + 2 * px('--nph-popconfirm-icon-box-padding'),
      0,
    );
  });

  it('draws the divider from edge to edge between the content and the actions, in its own color', async () => {
    const setup = await mount();
    await open(setup);
    const divider = part(setup.popconfirm, '.divider') as HTMLElement;
    expect(getComputedStyle(divider).backgroundColor).toBe(colorOf('--nph-popconfirm-divider'));
    const rect = divider.getBoundingClientRect();
    const box = surface(setup.popconfirm).getBoundingClientRect();
    expect(rect.width).toBeCloseTo(box.width - 2 * px('--nph-popconfirm-border-width'), 0);
    expect(rect.height).toBeCloseTo(px('--nph-popconfirm-border-width'), 1);
  });

  it('keeps 36 px buttons in both sizes, Cancel before Confirm, aligned to the end', async () => {
    for (const size of NPH_POPCONFIRM_SIZES) {
      const setup = await mount({ size });
      await open(setup);
      const cancel = cancelOf(setup.popconfirm).getBoundingClientRect();
      const confirm = confirmOf(setup.popconfirm).getBoundingClientRect();
      expect(cancel.height).toBeCloseTo(px('--nph-control-height-default'), 0);
      expect(confirm.height).toBeCloseTo(px('--nph-control-height-default'), 0);
      expect(cancel.right).toBeLessThanOrEqual(confirm.left);
      expect(confirm.left - cancel.right).toBeCloseTo(px('--nph-popconfirm-actions-gap'), 0);
      document.body.replaceChildren();
    }
  });
});

describe('focus', () => {
  it('moves the focus to Confirm in default and to Cancel in warning and destructive', async () => {
    for (const [type, expected] of [
      ['default', 'confirm'],
      ['warning', 'cancel'],
      ['destructive', 'cancel'],
    ] as const) {
      const setup = await mount({ type });
      await open(setup);
      const target = expected === 'confirm' ? confirmOf(setup.popconfirm) : cancelOf(setup.popconfirm);
      await until(() => within(deepActive(), target));
      expect(deepActive()).toBe(control(target));
      document.body.replaceChildren();
    }
  });

  it('keeps the Tab between Cancel and Confirm, in both directions', async () => {
    const setup = await mount({ type: 'destructive' });
    await open(setup);
    await until(() => within(deepActive(), cancelOf(setup.popconfirm)));
    await userEvent.tab();
    expect(deepActive()).toBe(control(confirmOf(setup.popconfirm)));
    await userEvent.tab();
    expect(deepActive()).toBe(control(cancelOf(setup.popconfirm)));
    await userEvent.tab({ shift: true });
    expect(deepActive()).toBe(control(confirmOf(setup.popconfirm)));
    expect(setup.popconfirm.open).toBe(true);
  });

  it('gives the focus back to the trigger on Esc, Cancel and Confirm', async () => {
    for (const how of ['escape', 'cancel', 'confirm'] as const) {
      const setup = await mount({ type: 'warning' });
      await open(setup);
      await until(() => within(deepActive(), cancelOf(setup.popconfirm)));
      if (how === 'escape') await userEvent.keyboard('{Escape}');
      if (how === 'cancel') await userEvent.click(cancelOf(setup.popconfirm));
      if (how === 'confirm') await userEvent.click(confirmOf(setup.popconfirm));
      await until(() => !shown(setup.popconfirm));
      expect(within(deepActive(), setup.trigger)).toBe(true);
      document.body.replaceChildren();
    }
  });

  it('leaves the focus where the person pressed on a press outside', async () => {
    const setup = await mount();
    const other = document.createElement('button');
    other.textContent = 'Other';
    other.style.cssText = 'position: fixed; left: 40px; top: 40px;';
    document.body.append(other);
    await open(setup);
    await userEvent.click(other);
    await until(() => !shown(setup.popconfirm));
    expect(deepActive()).toBe(other);
  });

  it('gives the focus to `return-focus-to` when the trigger is gone', async () => {
    const setup = await mount({ type: 'destructive' });
    const next = document.createElement('button');
    next.textContent = 'Next row';
    document.body.append(next);
    setup.popconfirm.returnFocusTo = next;
    await open(setup);
    await until(() => within(deepActive(), cancelOf(setup.popconfirm)));
    setup.popconfirm.addEventListener('nph-confirm', () => setup.trigger.remove(), { once: true });
    await userEvent.click(confirmOf(setup.popconfirm));
    await until(() => deepActive() === next);
    expect(deepActive()).toBe(next);
  });
});

describe('events', () => {
  it('fires nph-confirm and closes on Confirm', async () => {
    const setup = await mount();
    const confirm = vi.fn();
    setup.popconfirm.addEventListener('nph-confirm', confirm);
    await open(setup);
    await userEvent.click(confirmOf(setup.popconfirm));
    await settle(setup.popconfirm);
    expect(confirm).toHaveBeenCalledTimes(1);
    expect(setup.popconfirm.open).toBe(false);
  });

  it('stays open when the consumer calls preventDefault on nph-confirm, for a slow confirm', async () => {
    const setup = await mount();
    setup.popconfirm.addEventListener('nph-confirm', (event) => {
      event.preventDefault();
      setup.popconfirm.loading = true;
    });
    await open(setup);
    await userEvent.click(confirmOf(setup.popconfirm));
    await settle(setup.popconfirm);
    expect(setup.popconfirm.open).toBe(true);
    expect(confirmOf(setup.popconfirm).hasAttribute('loading')).toBe(true);
    setup.popconfirm.loading = false;
    setup.popconfirm.open = false;
    await settle(setup.popconfirm);
    await until(() => !shown(setup.popconfirm));
  });

  it('ignores a repeated press on a loading Confirm', async () => {
    const setup = await mount({ loading: true });
    const confirm = vi.fn();
    setup.popconfirm.addEventListener('nph-confirm', confirm);
    await open(setup);
    await userEvent.click(confirmOf(setup.popconfirm));
    await userEvent.click(confirmOf(setup.popconfirm));
    expect(confirm).not.toHaveBeenCalled();
    expect(setup.popconfirm.open).toBe(true);
  });

  it('fires nph-cancel with its source: the button, Esc, a press outside and the trigger', async () => {
    const seen: NphPopconfirmCancelSource[] = [];
    const sources: Array<'cancel-button' | 'escape' | 'outside' | 'trigger'> = ['cancel-button', 'escape', 'outside', 'trigger'];
    for (const how of sources) {
      const setup = await mount({ type: 'warning' });
      const heard = cancels(setup.popconfirm);
      await open(setup);
      await until(() => within(deepActive(), cancelOf(setup.popconfirm)));
      if (how === 'cancel-button') await userEvent.click(cancelOf(setup.popconfirm));
      if (how === 'escape') await userEvent.keyboard('{Escape}');
      if (how === 'outside') {
        const blank = document.createElement('div');
        blank.style.cssText = 'position: fixed; left: 20px; top: 20px; width: 80px; height: 40px;';
        document.body.append(blank);
        await userEvent.click(blank);
      }
      if (how === 'trigger') await userEvent.click(setup.trigger);
      await settle(setup.popconfirm);
      seen.push(...heard);
      expect(setup.popconfirm.open).toBe(false);
      document.body.replaceChildren();
    }
    expect(seen).toEqual(sources);
  });

  it('stays open when the consumer cancels nph-cancel', async () => {
    const setup = await mount();
    setup.popconfirm.addEventListener('nph-cancel', (event) => event.preventDefault());
    await open(setup);
    await userEvent.keyboard('{Escape}');
    await settle(setup.popconfirm);
    expect(setup.popconfirm.open).toBe(true);
  });

  it('closes on Cancel, Esc and a press outside while Confirm loads, and the consumer hears each source', async () => {
    const sources = ['cancel-button', 'escape', 'outside'] as const;
    for (const how of sources) {
      const setup = await mount({ loading: true, type: 'destructive' });
      const heard = cancels(setup.popconfirm);
      await open(setup);
      await until(() => within(deepActive(), cancelOf(setup.popconfirm)));
      expect(confirmOf(setup.popconfirm).hasAttribute('loading')).toBe(true);
      if (how === 'cancel-button') await userEvent.click(cancelOf(setup.popconfirm));
      if (how === 'escape') await userEvent.keyboard('{Escape}');
      if (how === 'outside') {
        const blank = document.createElement('div');
        blank.style.cssText = 'position: fixed; left: 20px; top: 20px; width: 80px; height: 40px;';
        document.body.append(blank);
        await userEvent.click(blank);
      }
      await settle(setup.popconfirm);
      expect(setup.popconfirm.open, how).toBe(false);
      expect(heard, how).toEqual([how]);
      document.body.replaceChildren();
    }
  });

  it('fires nothing when `open` is set from code', async () => {
    const setup = await mount();
    const confirm = vi.fn();
    const cancel = vi.fn();
    setup.popconfirm.addEventListener('nph-confirm', confirm);
    setup.popconfirm.addEventListener('nph-cancel', cancel);
    setup.popconfirm.open = true;
    await settle(setup.popconfirm);
    setup.popconfirm.open = false;
    await settle(setup.popconfirm);
    expect(confirm).not.toHaveBeenCalled();
    expect(cancel).not.toHaveBeenCalled();
  });

  it('closes the open one when another popconfirm opens, with the source other-layer', async () => {
    const first = await mount({ type: 'warning' });
    const heard = cancels(first.popconfirm);
    const secondTrigger = document.createElement('nph-button');
    secondTrigger.id = 'second-trigger';
    secondTrigger.text = 'Second';
    secondTrigger.style.cssText = 'position: fixed; left: 40px; top: 600px;';
    const second = document.createElement('nph-popconfirm');
    second.setAttribute('for', 'second-trigger');
    second.heading = 'Second?';
    second.confirmLabel = 'Go';
    second.cancelLabel = 'Cancel';
    document.body.append(secondTrigger, second);
    await secondTrigger.updateComplete;
    await settle(second);
    await open(first);
    second.open = true;
    await settle(second);
    await settle(first.popconfirm);
    expect(first.popconfirm.open).toBe(false);
    expect(second.open).toBe(true);
    expect(heard).toEqual(['other-layer']);
  });

  it('lets Esc close only the last popconfirm shown and does not reach the page', async () => {
    const setup = await mount();
    const page$ = vi.fn();
    window.addEventListener('keydown', page$);
    await open(setup);
    await userEvent.keyboard('{Escape}');
    await settle(setup.popconfirm);
    window.removeEventListener('keydown', page$);
    expect(setup.popconfirm.open).toBe(false);
    expect(page$).not.toHaveBeenCalled();
  });
});

describe('actions that do not fit', () => {
  it('stacks the buttons, Confirm on top and each at the full width of the band, when a label is long', async () => {
    const setup = await mount({
      confirmLabel: 'Delete the whole March spreadsheet',
      cancelLabel: 'Keep it and go back to the list',
      type: 'destructive',
    });
    await open(setup);
    await frame();
    const actions = part(setup.popconfirm, '.actions') as HTMLElement;
    expect(actions.hasAttribute('data-stacked')).toBe(true);
    const cancel = cancelOf(setup.popconfirm).getBoundingClientRect();
    const confirm = confirmOf(setup.popconfirm).getBoundingClientRect();
    expect(confirm.bottom).toBeLessThanOrEqual(cancel.top + 0.5);
    expect(confirm.width).toBeCloseTo(cancel.width, 0);
    const band = actions.getBoundingClientRect();
    const padding = px('--nph-popconfirm-footer-padding-sm');
    expect(confirm.width).toBeCloseTo(band.width - 2 * padding, 0);
    expect(surface(setup.popconfirm).getBoundingClientRect().width).toBeCloseTo(px('--nph-popconfirm-width-sm'), 0);
  });

  it('follows the order on screen with the Tab while stacked, and the initial focus does not change', async () => {
    const setup = await mount({
      confirmLabel: 'Delete the whole March spreadsheet',
      cancelLabel: 'Keep it and go back to the list',
      type: 'destructive',
    });
    await open(setup);
    await until(() => within(deepActive(), cancelOf(setup.popconfirm)));
    expect(deepActive()).toBe(control(cancelOf(setup.popconfirm)));
    await userEvent.tab();
    expect(deepActive()).toBe(control(confirmOf(setup.popconfirm)));
    await userEvent.tab();
    expect(deepActive()).toBe(control(cancelOf(setup.popconfirm)));
  });

  it('keeps them side by side when they fit', async () => {
    const setup = await mount();
    await open(setup);
    expect(part(setup.popconfirm, '.actions')?.hasAttribute('data-stacked')).toBe(false);
  });
});

describe('placement and arrow', () => {
  it('opens on the side asked for, `popconfirm/offset` from the trigger, centered on it with no arrow', async () => {
    for (const side of NPH_POPCONFIRM_SIDES) {
      const setup = await mount({ side });
      await open(setup);
      const trigger = setup.trigger.getBoundingClientRect();
      const box = surface(setup.popconfirm).getBoundingClientRect();
      const offset = px('--nph-popconfirm-offset');
      if (side === 'bottom') {
        expect(box.top - trigger.bottom).toBeCloseTo(offset, 0);
        expect(box.left + box.width / 2).toBeCloseTo(trigger.left + trigger.width / 2, 0);
      }
      if (side === 'top') expect(trigger.top - box.bottom).toBeCloseTo(offset, 0);
      if (side === 'right') expect(box.left - trigger.right).toBeCloseTo(offset, 0);
      if (side === 'left') expect(trigger.left - box.right).toBeCloseTo(offset, 0);
      document.body.replaceChildren();
    }
  });

  it('puts the surface one arrow height further when the arrow is on', async () => {
    const setup = await mount({ arrow: true });
    await open(setup);
    const trigger = setup.trigger.getBoundingClientRect();
    const box = surface(setup.popconfirm).getBoundingClientRect();
    expect(box.top - trigger.bottom).toBeCloseTo(px('--nph-popconfirm-offset') + px('--nph-popconfirm-arrow-height'), 0);
    const arrow = part(setup.popconfirm, '.arrow') as HTMLElement | null;
    expect(arrow).not.toBeNull();
    expect(arrow?.getAttribute('aria-hidden')).toBe('true');
  });

  it('aligns by the start and the end with the arrow at its inset from the corner', async () => {
    for (const align of ['start', 'end'] as const) {
      const setup = await mount({ arrow: true, align });
      await open(setup);
      const trigger = setup.trigger.getBoundingClientRect();
      const box = surface(setup.popconfirm).getBoundingClientRect();
      if (align === 'start') expect(box.left).toBeCloseTo(trigger.left, 0);
      else expect(box.right).toBeCloseTo(trigger.right, 0);
      document.body.replaceChildren();
    }
  });

  it('follows the writing direction: in right-to-left, start aligns to the right edge of the trigger', async () => {
    const setup = await mount({ arrow: true, align: 'start' });
    setup.trigger.style.direction = 'rtl';
    setup.popconfirm.requestUpdate();
    await open(setup);
    await frame();
    const trigger = setup.trigger.getBoundingClientRect();
    const box = surface(setup.popconfirm).getBoundingClientRect();
    expect(box.right).toBeCloseTo(trigger.right, 0);
  });

  it('turns to the opposite side when it does not fit', async () => {
    const setup = await mount({ side: 'bottom' }, { left: 400, top: 700 });
    await open(setup);
    const trigger = setup.trigger.getBoundingClientRect();
    expect(surface(setup.popconfirm).getBoundingClientRect().bottom).toBeLessThanOrEqual(trigger.top);
  });
});

describe('colors in both schemes and tokens', () => {
  it('follows the scheme: the surface background changes between light and dark', async () => {
    const setup = await mount();
    await open(setup);
    const light = getComputedStyle(surface(setup.popconfirm)).backgroundColor;
    document.documentElement.setAttribute('data-nph-color-scheme', 'dark');
    await settle(setup.popconfirm);
    const dark = getComputedStyle(surface(setup.popconfirm)).backgroundColor;
    expect(light).not.toBe(dark);
    expect(dark).toBe(colorOf('--nph-popconfirm-background'));
  });

  it('sets the focus hook of the nph-button to focus/border on the primary Confirm only', async () => {
    const primary = await mount({ type: 'warning' });
    await open(primary);
    expect(getComputedStyle(confirmOf(primary.popconfirm)).getPropertyValue('--nph-button-focus-border').trim()).not.toBe('');
    document.body.replaceChildren();
    const danger = await mount({ type: 'destructive' });
    await open(danger);
    expect(getComputedStyle(confirmOf(danger.popconfirm)).getPropertyValue('--nph-button-focus-border').trim()).toBe('');
    expect(getComputedStyle(cancelOf(danger.popconfirm)).getPropertyValue('--nph-button-focus-border').trim()).toBe('');
  });

  it('consumes only popconfirm and semantic tokens: no literal value and no core or theme token', () => {
    const consumed = [...componentCss.matchAll(/var\((--nph-[a-z0-9-]+)/g)].map((match) => match[1] as string);
    expect(consumed.length).toBeGreaterThan(0);
    for (const token of consumed) {
      expect(token.startsWith('--nph-core-'), token).toBe(false);
      expect(token.startsWith('--nph-theme-'), token).toBe(false);
    }
    const declarations = componentCss
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .split('\n')
      .filter((line) => /:\s/.test(line) && !line.trim().startsWith('--_'));
    for (const line of declarations) {
      expect(line, line).not.toMatch(/#[0-9a-f]{3,8}\b|\b\d+(\.\d+)?(px|rem|em|ms|s)\b/i);
    }
  });

  it('exposes no ::part and no color property', () => {
    expect(componentSource).not.toMatch(/\bpart=/);
    expect(componentCss.replace(/\/\*[\s\S]*?\*\//g, '')).not.toMatch(/::part/);
  });
});
