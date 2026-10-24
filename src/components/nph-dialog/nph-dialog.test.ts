/**
 * Tests of `nph-dialog` (P87), in a real browser (P21, item 5): the top layer, the inert
 * page, the focus, Esc, the measures and the media query only exist where there is layout
 * and a keyboard.
 *
 * They prove the contract accepted in Figma (board `1368:27`, set `2268:52262`), recorded in
 * the evidence of DSA-44: the API, opening and closing, where the focus goes on open and on
 * close, Esc and the close button with the own event, the veil, the scroll of the content
 * and the lock of the page, the width that hugs the content between the minimum and the
 * ceiling of the size, the spaces, the inline and stacked actions, the colors redefined in
 * the window, the semantics, the invalid input and the token contract. The highlight icon
 * is out until D3 is answered. Accessibility assertions are written by hand (P72 moves the
 * addon to DSA-32).
 */
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cdp, page, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-600.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import designMd from '../../../design.md?raw';
import componentCss from './nph-dialog.css?raw';
import '../nph-tooltip/nph-tooltip';
import { NPH_DIALOG_ACTIONS, NPH_DIALOG_CLOSE_EVENT, NPH_DIALOG_SIZES, NphDialog } from './nph-dialog';
import type { NphDialogCloseDetail } from './nph-dialog';
import type { NphButton } from '../nph-button/nph-button';
import type { NphTooltip } from '../nph-tooltip/nph-tooltip';

const WIDE = { width: 1280, height: 800 };
const NARROW = { width: 414, height: 896 };
const SCHEMES = ['light', 'dark'] as const;

beforeAll(async () => {
  await page.viewport(WIDE.width, WIDE.height);
  await document.fonts.load('400 14px "Noto Sans"');
  await document.fonts.load('600 20px "Noto Sans"');
  await document.fonts.ready;
});

afterAll(async () => {
  await page.viewport(NARROW.width, NARROW.height);
});

afterEach(async () => {
  await page.viewport(WIDE.width, WIDE.height);
  document.body.replaceChildren();
  document.documentElement.removeAttribute('data-nph-color-scheme');
  vi.restoreAllMocks();
});

interface Spec {
  heading?: string;
  description?: string;
  size?: string;
  actions?: string;
  hideClose?: boolean;
  closeLabel?: string;
  headerSeparator?: boolean;
  footerSeparator?: boolean;
  open?: boolean;
  /** Markup of the content area and of the footer, as the consumer writes it. */
  content?: string;
  footer?: string;
  parent?: HTMLElement;
}

/** A trigger button and the dialog, both in the page. Returns once the dialog drew. */
async function mount(spec: Spec = {}): Promise<NphDialog> {
  const parent = spec.parent ?? document.body;
  const trigger = document.createElement('button');
  trigger.id = 'trigger';
  trigger.textContent = 'Open';
  const dialog = document.createElement('nph-dialog');
  dialog.heading = spec.heading ?? 'Edit profile';
  dialog.description = spec.description ?? 'Change how your name appears.';
  if (spec.size !== undefined) dialog.size = spec.size as NphDialog['size'];
  if (spec.actions !== undefined) dialog.actions = spec.actions as NphDialog['actions'];
  dialog.hideClose = spec.hideClose ?? false;
  dialog.closeLabel = spec.closeLabel ?? 'Close';
  dialog.headerSeparator = spec.headerSeparator ?? false;
  dialog.footerSeparator = spec.footerSeparator ?? false;
  dialog.innerHTML = `${spec.content ?? ''}${spec.footer ? `<div slot="footer" style="display: contents;"></div>` : ''}`;
  if (spec.footer) {
    dialog.querySelector('[slot="footer"]')?.remove();
    const holder = document.createElement('template');
    holder.innerHTML = spec.footer;
    for (const node of [...holder.content.children]) {
      node.setAttribute('slot', 'footer');
      dialog.append(node);
    }
  }
  parent.append(trigger, dialog);
  trigger.focus();
  if (spec.open) dialog.open = true;
  await settle(dialog);
  return dialog;
}

/** The dialog and every `nph-*` inside it finished drawing. */
async function settle(dialog: NphDialog): Promise<void> {
  await dialog.updateComplete;
  const pieces = [
    ...dialog.querySelectorAll('*'),
    ...(dialog.shadowRoot?.querySelectorAll('*') ?? []),
  ].filter((element): element is Element & { updateComplete: Promise<unknown> } => 'updateComplete' in element);
  await Promise.all(pieces.map((piece) => piece.updateComplete));
  await dialog.updateComplete;
}

async function openIt(dialog: NphDialog): Promise<HTMLDialogElement> {
  dialog.open = true;
  await settle(dialog);
  return panelOf(dialog);
}

function panelOf(dialog: NphDialog): HTMLDialogElement {
  const panel = dialog.shadowRoot?.querySelector('dialog');
  if (!panel) throw new Error('no <dialog>');
  return panel;
}

function part(dialog: NphDialog, selector: string): HTMLElement | null {
  return dialog.shadowRoot?.querySelector<HTMLElement>(selector) ?? null;
}

function closeButton(dialog: NphDialog): NphButton | null {
  return dialog.shadowRoot?.querySelector<NphButton>('nph-button.close') ?? null;
}

/** Waits until the exit ended and the window left the top layer. */
async function closed(dialog: NphDialog): Promise<void> {
  await vi.waitFor(() => expect(dialog.shadowRoot?.querySelector('dialog')?.open ?? false).toBe(false), { timeout: 2000 });
}

/** The element that has the focus, inside shadow roots too. */
function focused(): Element | null {
  let active = document.activeElement;
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
  return active;
}

function inside(node: Node | null, ancestor: Node): boolean {
  let current: Node | null = node;
  while (current) {
    if (current === ancestor) return true;
    current = current.parentNode ?? (current instanceof ShadowRoot ? current.host : null);
  }
  return false;
}

function px(value: string): number {
  return Number.parseFloat(value);
}

/** The value a token resolves to on `element`'s context, read through a probe. */
function resolved(property: string, token: string, parent: Element = document.body): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  parent.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

function tokenPx(token: string): number {
  return px(resolved('inline-size', token));
}

/** The box of the content itself: the scroll area less the focus room around it. */
function contentBox(dialog: NphDialog): DOMRect {
  const area = part(dialog, '.content') as HTMLElement;
  const box = area.getBoundingClientRect();
  const style = getComputedStyle(area);
  const top = px(style.paddingTop);
  const right = px(style.paddingRight);
  const bottom = px(style.paddingBottom);
  const left = px(style.paddingLeft);
  return new DOMRect(box.left + left, box.top + top, box.width - left - right, box.height - top - bottom);
}

/** A form with its fields in an open shadow root that does not delegate the focus. */
class TestShadowForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML =
      '<input id="inner-first" aria-label="First"><input id="inner-auto" aria-label="Second"><slot></slot>';
  }

  connectedCallback(): void {
    if (this.hasAttribute('data-autofocus')) {
      this.shadowRoot?.getElementById('inner-auto')?.setAttribute('autofocus', '');
    }
  }
}
customElements.define('test-shadow-form', TestShadowForm);

/** The two footer buttons of `ACTIONS`, Cancel then Save, as the consumer wrote them. */
function actionRects(dialog: NphDialog): [DOMRect, DOMRect] {
  const [cancel, save] = [...dialog.querySelectorAll('nph-button[slot="footer"]')];
  if (!cancel || !save) throw new Error('no footer buttons');
  return [cancel.getBoundingClientRect(), save.getBoundingClientRect()];
}

function listen(dialog: NphDialog): Array<{ source: string; cancelable: boolean }> {
  const seen: Array<{ source: string; cancelable: boolean }> = [];
  dialog.addEventListener(NPH_DIALOG_CLOSE_EVENT, (event) => {
    seen.push({ source: (event as CustomEvent<NphDialogCloseDetail>).detail.source, cancelable: event.cancelable });
  });
  return seen;
}

/** A click of the person, so the browser lets the next Esc be held. */
async function activate(): Promise<void> {
  await userEvent.click(document.getElementById('trigger') as HTMLElement);
}

/**
 * What the browser itself computes for an element in its accessibility tree. The tests run
 * in a frame and the element is in a shadow root: it is looked up through the DOM domain,
 * piercing into both (the method of `nph-tooltip.test.ts`).
 */
async function axNode(element: Element): Promise<{ role: string; name: string; description: string; modal: unknown }> {
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
      modal: node?.properties?.find((property: { name: string }) => property.name === 'modal')?.value?.value,
    };
  } finally {
    element.removeAttribute('data-ax-probe');
  }
}

const FORM = '<label for="name">Name</label><input id="name"><input id="email" aria-label="Email">';
const ACTIONS =
  '<nph-button severity="secondary" text="Cancel"></nph-button><nph-button text="Save"></nph-button>';

describe('registration and API', () => {
  it('defines nph-dialog only once', () => {
    expect(customElements.get('nph-dialog')).toBe(NphDialog);
  });

  it('the public API is exactly the one in P87', () => {
    const declared = [...(NphDialog as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared).toEqual([
      'heading',
      'description',
      'size',
      'actions',
      'hideClose',
      'closeLabel',
      'headerSeparator',
      'footerSeparator',
      'open',
    ]);
    expect([...NPH_DIALOG_SIZES]).toEqual(['sm', 'md', 'lg']);
    expect([...NPH_DIALOG_ACTIONS]).toEqual(['inline', 'stacked']);
    expect(NPH_DIALOG_CLOSE_EVENT).toBe('nph-close');
  });

  it('the defaults are md, inline actions, the close button on, no lines, closed', async () => {
    const dialog = await mount();
    expect(dialog.size).toBe('md');
    expect(dialog.actions).toBe('inline');
    expect(dialog.hideClose).toBe(false);
    expect(dialog.headerSeparator).toBe(false);
    expect(dialog.footerSeparator).toBe(false);
    expect(dialog.open).toBe(false);
    expect(dialog.getAttribute('size')).toBe('md');
    expect(dialog.getAttribute('actions')).toBe('inline');
  });

  it('has open Shadow DOM, the default slot and the footer slot only, and no part', async () => {
    const dialog = await mount();
    expect(dialog.shadowRoot).not.toBeNull();
    const slots = [...(dialog.shadowRoot?.querySelectorAll('slot') ?? [])].map((slot) => slot.name);
    expect(slots).toEqual(['', 'footer']);
    expect(dialog.shadowRoot?.querySelector('[part]')).toBeNull();
  });

  it('has no status, color, variant or method to open: open is the only way (P87, D3)', () => {
    const declared = [...(NphDialog as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    for (const absent of ['status', 'color', 'variant', 'title', 'modal']) {
      expect(declared).not.toContain(absent);
    }
    const prototype = NphDialog.prototype as unknown as Record<string, unknown>;
    expect(prototype.show).toBeUndefined();
    expect(prototype.showModal).toBeUndefined();
    expect(prototype.close).toBeUndefined();
  });
});

describe('opening and closing', () => {
  it('closed, the window is not drawn and the page is not inert', async () => {
    const dialog = await mount({ content: FORM });
    const panel = panelOf(dialog);
    expect(panel.open).toBe(false);
    expect(getComputedStyle(panel).display).toBe('none');
    expect(document.documentElement.style.overflow).toBe('');
  });

  it('open is a modal dialog in the top layer, over the page', async () => {
    const dialog = await mount({ content: FORM });
    const panel = await openIt(dialog);
    expect(panel.open).toBe(true);
    expect(panel.matches(':modal')).toBe(true);
    expect(dialog.hasAttribute('open')).toBe(true);
    const rect = panel.getBoundingClientRect();
    const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
    expect(inside(hit, dialog)).toBe(true);
  });

  it('opens when connected if open was set before', async () => {
    const dialog = document.createElement('nph-dialog');
    dialog.heading = 'Edit profile';
    dialog.closeLabel = 'Close';
    dialog.open = true;
    document.body.append(dialog);
    await settle(dialog);
    expect(panelOf(dialog).matches(':modal')).toBe(true);
  });

  it('open false from code closes it after the exit, and fires no event', async () => {
    const dialog = await mount({ content: FORM, open: true });
    const seen = listen(dialog);
    dialog.open = false;
    await dialog.updateComplete;
    expect(panelOf(dialog).hasAttribute('data-open')).toBe(false);
    await closed(dialog);
    expect(seen).toEqual([]);
    expect(dialog.hasAttribute('open')).toBe(false);
  });

  it('opened again during the exit, it stays open', async () => {
    const dialog = await mount({ content: FORM, open: true });
    dialog.open = false;
    await dialog.updateComplete;
    dialog.open = true;
    await dialog.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(panelOf(dialog).open).toBe(true);
    expect(panelOf(dialog).hasAttribute('data-open')).toBe(true);
  });

  it('removed while open, it leaves the top layer, releases the page and returns when put back', async () => {
    const dialog = await mount({ content: FORM, open: true });
    dialog.remove();
    expect(document.documentElement.style.overflow).toBe('');
    document.body.append(dialog);
    await settle(dialog);
    /* The `close` of the removal is queued: let it arrive before looking. */
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(panelOf(dialog).matches(':modal')).toBe(true);
    expect(dialog.open).toBe(true);
  });

  it('removed and put back in the same turn, the late close of the removal does not close it', async () => {
    const dialog = await mount({ content: FORM, open: true });
    await settle(dialog);
    dialog.remove();
    document.body.append(dialog);
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(panelOf(dialog).matches(':modal')).toBe(true);
    expect(dialog.open).toBe(true);
    expect(document.documentElement.style.overflowY).toBe('hidden');
  });

  it('a dialog over another opens and warns once (do not open a dialog over another)', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const first = await mount({ content: FORM, open: true });
    const second = await mount({ heading: 'Second', content: FORM });
    await openIt(second);
    expect(panelOf(first).open).toBe(true);
    expect(panelOf(second).matches(':modal')).toBe(true);
    const calls = warn.mock.calls.filter(([message]) => String(message).startsWith('[nph-dialog]'));
    expect(calls).toHaveLength(1);
    expect(String(calls[0]?.[0])).toContain('do not open a dialog over another');
  });
});

describe('focus', () => {
  it('goes to the element with autofocus, in the content or in the footer', async () => {
    const dialog = await mount({ content: FORM, footer: '<nph-button text="Save" autofocus></nph-button>' });
    await openIt(dialog);
    expect(inside(focused(), dialog.querySelector('nph-button[autofocus]') as Element)).toBe(true);
  });

  it('otherwise goes to the first focusable element of the content, not to the close button', async () => {
    const dialog = await mount({ content: FORM, footer: ACTIONS });
    await openIt(dialog);
    expect(focused()?.id).toBe('name');
  });

  it('skips what cannot take focus: disabled, hidden or with a negative tabindex', async () => {
    const dialog = await mount({
      content: '<button disabled>Off</button><input hidden><a tabindex="-1" href="#x">Skip</a><input id="first">',
    });
    await openIt(dialog);
    expect(focused()?.id).toBe('first');
  });

  it('with nothing to focus in the content, goes to the first button of the footer', async () => {
    const dialog = await mount({ content: '<p>Only text.</p>', footer: ACTIONS });
    await openIt(dialog);
    expect(inside(focused(), dialog.querySelector('nph-button') as Element)).toBe(true);
  });

  it('with no content and no footer, goes to the close button', async () => {
    const dialog = await mount();
    await openIt(dialog);
    expect(inside(focused(), closeButton(dialog) as Element)).toBe(true);
  });

  it('connected already open, an autofocus button of the footer that draws late still takes the focus from the field', async () => {
    const dialog = document.createElement('nph-dialog');
    dialog.heading = 'Edit profile';
    dialog.closeLabel = 'Close';
    dialog.innerHTML = '<input id="field" aria-label="Name"><nph-button slot="footer" text="Save" autofocus></nph-button>';
    dialog.open = true;
    document.body.append(dialog);
    await settle(dialog);
    await vi.waitFor(() => expect(inside(focused(), dialog.querySelector('nph-button[autofocus]') as Element)).toBe(true));
  });

  it('a move of the focus by the person before the pieces draw is kept', async () => {
    const dialog = document.createElement('nph-dialog');
    dialog.heading = 'Edit profile';
    dialog.closeLabel = 'Close';
    dialog.innerHTML = '<input id="field" aria-label="Name"><input id="other" aria-label="Other"><nph-button slot="footer" text="Save" autofocus></nph-button>';
    dialog.open = true;
    document.body.append(dialog);
    await dialog.updateComplete;
    expect(focused()?.id).toBe('field');
    (dialog.querySelector('#other') as HTMLInputElement).focus();
    await settle(dialog);
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(focused()?.id).toBe('other');
  });

  it('connected already open, with no content and no footer, the focus waits for the close button to draw', async () => {
    const dialog = document.createElement('nph-dialog');
    dialog.heading = 'Edit profile';
    dialog.closeLabel = 'Close';
    dialog.open = true;
    document.body.append(dialog);
    await settle(dialog);
    await vi.waitFor(() => expect(inside(focused(), closeButton(dialog) as Element)).toBe(true));
  });

  it('a shadow host with a negative tabindex is skipped with everything it draws; an ordinary ancestor keeps its children', async () => {
    const dialog = await mount({ content: `<nph-button tabindex="-1" text="Skip"></nph-button>${FORM}` });
    await openIt(dialog);
    expect(focused()?.id).toBe('name');
    dialog.open = false;
    await closed(dialog);
    const other = await mount({
      heading: 'Second',
      content: '<nph-button tabindex="-1" text="Skip"></nph-button><div tabindex="-1"><input id="kept" aria-label="Kept"></div>',
    });
    await openIt(other);
    expect(focused()?.id).toBe('kept');
  });

  it('finds the fields of a form in an open shadow root that does not delegate the focus', async () => {
    const dialog = await mount({ content: '<test-shadow-form></test-shadow-form>', footer: ACTIONS });
    await openIt(dialog);
    expect(focused()?.id).toBe('inner-first');
  });

  it('finds autofocus inside an open shadow root, and inside what a slot shows', async () => {
    const dialog = await mount({ content: '<test-shadow-form data-autofocus></test-shadow-form>', footer: ACTIONS });
    await openIt(dialog);
    expect(focused()?.id).toBe('inner-auto');
    dialog.open = false;
    await closed(dialog);
    const slotted = await mount({
      heading: 'Second',
      content: '<test-shadow-form><input id="through-slot" aria-label="Slotted" autofocus></test-shadow-form>',
    });
    await openIt(slotted);
    expect(focused()?.id).toBe('through-slot');
  });

  it('with nothing focusable at all, goes to the window itself', async () => {
    const dialog = await mount({ hideClose: true, content: '<p>Only text.</p>' });
    const panel = await openIt(dialog);
    expect(focused()).toBe(panel);
  });

  it('goes back to the element that had it when the dialog closes', async () => {
    const dialog = await mount({ content: FORM });
    const trigger = document.getElementById('trigger') as HTMLButtonElement;
    trigger.focus();
    await openIt(dialog);
    expect(focused()?.id).toBe('name');
    dialog.open = false;
    await closed(dialog);
    expect(document.activeElement).toBe(trigger);
  });

  it('a trigger that left the page is not an error: the focus stays on the page', async () => {
    const error = vi.spyOn(console, 'error');
    const dialog = await mount({ content: FORM });
    await openIt(dialog);
    document.getElementById('trigger')?.remove();
    dialog.open = false;
    await closed(dialog);
    expect(error).not.toHaveBeenCalled();
  });

  it('the page is inert: Tab never reaches an element outside the dialog', async () => {
    const outside = document.createElement('button');
    outside.textContent = 'Outside';
    document.body.append(outside);
    const dialog = await mount({ content: FORM, footer: ACTIONS });
    await openIt(dialog);
    expect(outside.matches(':focus')).toBe(false);
    for (let press = 0; press < 8; press += 1) {
      await userEvent.tab();
      expect(outside.matches(':focus')).toBe(false);
      const active = focused();
      if (active && active !== document.body) {
        expect(inside(active, dialog)).toBe(true);
      }
    }
    outside.focus();
    expect(outside.matches(':focus')).toBe(false);
  });

  it('the content and the footer of the slots stay interactive in the modal window', async () => {
    const dialog = await mount({ content: FORM, footer: ACTIONS });
    await openIt(dialog);
    const input = dialog.querySelector('#email') as HTMLInputElement;
    await userEvent.click(input);
    await userEvent.keyboard('ana@example.com');
    expect(input.value).toBe('ana@example.com');
  });
});

describe('Esc', () => {
  it('closes and says so once, cancelable, with source escape', async () => {
    const dialog = await mount({ content: FORM });
    await activate();
    await openIt(dialog);
    const seen = listen(dialog);
    await userEvent.keyboard('{Escape}');
    await closed(dialog);
    expect(dialog.open).toBe(false);
    expect(seen).toEqual([{ source: 'escape', cancelable: true }]);
  });

  it('preventDefault on nph-close keeps it open', async () => {
    const dialog = await mount({ content: FORM });
    await activate();
    await openIt(dialog);
    dialog.addEventListener(NPH_DIALOG_CLOSE_EVENT, (event) => event.preventDefault());
    await userEvent.keyboard('{Escape}');
    await dialog.updateComplete;
    expect(dialog.open).toBe(true);
    expect(panelOf(dialog).open).toBe(true);
  });

  /*
   * The browser decides whether a close request may be held: with no new activation by the
   * person since the last held one, it fires `cancel` not cancelable and closes the window.
   * When it happens depends on the history of the page, so the test fires that `cancel`.
   */
  it('known limit: a cancel the browser does not let hold closes at once, and the event says it cannot be canceled', async () => {
    const dialog = await mount({ content: FORM });
    const panel = await openIt(dialog);
    const seen = listen(dialog);
    dialog.addEventListener(NPH_DIALOG_CLOSE_EVENT, (event) => event.preventDefault());
    panel.dispatchEvent(new Event('cancel', { cancelable: false }));
    expect(panel.open).toBe(false);
    expect(dialog.open).toBe(false);
    expect(seen).toEqual([{ source: 'escape', cancelable: false }]);
    expect(document.documentElement.style.overflow).toBe('');
    expect(document.activeElement?.id).toBe('trigger');
  });

  it('with a balloon open inside, the first Esc closes only the balloon (P77) and the next one the dialog', async () => {
    const dialog = await mount({
      content: '<button id="remove" type="button">Remove</button><nph-tooltip for="remove" text="Remove the photo"></nph-tooltip>',
    });
    await activate();
    await openIt(dialog);
    const tooltip = dialog.querySelector('nph-tooltip') as NphTooltip;
    /* Opened by keyboard focus, not by hover: hover waits for motion/hover-delay. */
    await userEvent.tab({ shift: true });
    await userEvent.tab();
    await tooltip.updateComplete;
    expect(focused()?.id).toBe('remove');
    expect(tooltip.open).toBe(true);
    await userEvent.keyboard('{Escape}');
    await tooltip.updateComplete;
    expect(tooltip.open).toBe(false);
    expect(dialog.open).toBe(true);
    await userEvent.keyboard('{Escape}');
    await closed(dialog);
    expect(dialog.open).toBe(false);
  });

  it('known limit: with keyboard focus on the close button, its own balloon (P86) takes the first Esc', async () => {
    const dialog = await mount({ content: FORM });
    await activate();
    await openIt(dialog);
    expect(focused()?.id).toBe('name');
    /* Back to the close button by keyboard: the icon-only button opens its balloon on keyboard focus. */
    await userEvent.tab({ shift: true });
    const close = closeButton(dialog) as NphButton;
    const tooltip = close.shadowRoot?.querySelector('nph-tooltip') as NphTooltip;
    expect(tooltip).not.toBeNull();
    await tooltip.updateComplete;
    expect(inside(focused(), close)).toBe(true);
    expect(tooltip.open).toBe(true);
    expect(tooltip.text).toBe('Close');
    await userEvent.keyboard('{Escape}');
    await tooltip.updateComplete;
    expect(tooltip.open).toBe(false);
    expect(dialog.open).toBe(true);
    await userEvent.keyboard('{Escape}');
    await closed(dialog);
    expect(dialog.open).toBe(false);
  });
});

describe('close button', () => {
  it('is the icon-only nph-button: secondary, ghost, compact, xmark, named by close-label', async () => {
    const dialog = await mount({ closeLabel: 'Close dialog' });
    const close = closeButton(dialog) as NphButton;
    expect(close).not.toBeNull();
    expect(close.severity).toBe('secondary');
    expect(close.emphasis).toBe('ghost');
    expect(close.size).toBe('compact');
    expect(close.iconStart).toBe('xmark');
    expect(close.text).toBe('');
    expect(close.label).toBe('Close dialog');
    expect(close.shadowRoot?.querySelector('button')?.getAttribute('aria-label')).toBe('Close dialog');
  });

  it('meets the 24 by 24 target and sits on the line of the title, at the end', async () => {
    const dialog = await mount({ content: FORM });
    const panel = await openIt(dialog);
    const close = (closeButton(dialog) as NphButton).getBoundingClientRect();
    const heading = part(dialog, '.heading')?.getBoundingClientRect() as DOMRect;
    expect(close.width).toBeGreaterThanOrEqual(24);
    expect(close.height).toBeGreaterThanOrEqual(24);
    expect(close.top).toBeCloseTo(heading.top, 0);
    const padding = px(getComputedStyle(panel).paddingRight);
    expect(panel.getBoundingClientRect().right - close.right).toBeCloseTo(padding, 0);
  });

  it('a click says close-button and closes; preventDefault keeps it open', async () => {
    const dialog = await mount({ content: FORM });
    await openIt(dialog);
    const seen = listen(dialog);
    let hold = true;
    dialog.addEventListener(NPH_DIALOG_CLOSE_EVENT, (event) => {
      if (hold) event.preventDefault();
    });
    await userEvent.click(closeButton(dialog) as NphButton);
    await dialog.updateComplete;
    expect(dialog.open).toBe(true);
    hold = false;
    await userEvent.click(closeButton(dialog) as NphButton);
    await closed(dialog);
    expect(seen).toEqual([
      { source: 'close-button', cancelable: true },
      { source: 'close-button', cancelable: true },
    ]);
  });

  it('the event bubbles and crosses the shadow root', async () => {
    const wrapper = document.createElement('div');
    document.body.append(wrapper);
    const heard: string[] = [];
    wrapper.addEventListener(NPH_DIALOG_CLOSE_EVENT, (event) => {
      heard.push((event as CustomEvent<NphDialogCloseDetail>).detail.source);
      expect(event.bubbles).toBe(true);
      expect(event.composed).toBe(true);
    });
    const dialog = await mount({ content: FORM, parent: wrapper });
    await openIt(dialog);
    await userEvent.click(closeButton(dialog) as NphButton);
    expect(heard).toEqual(['close-button']);
  });

  it('hide-close takes it out; Esc still closes', async () => {
    const dialog = await mount({ content: FORM, hideClose: true });
    expect(closeButton(dialog)).toBeNull();
    await activate();
    await openIt(dialog);
    await userEvent.keyboard('{Escape}');
    await closed(dialog);
  });
});

describe('the veil', () => {
  it('is the backdrop of the window, in overlay/scrim, in both schemes', async () => {
    for (const scheme of SCHEMES) {
      const frame = document.createElement('div');
      frame.setAttribute('data-nph-color-scheme', scheme);
      document.body.append(frame);
      const dialog = await mount({ content: FORM, parent: frame });
      const panel = await openIt(dialog);
      await vi.waitFor(() => expect(getComputedStyle(panel, '::backdrop').opacity).toBe('1'));
      expect(getComputedStyle(panel, '::backdrop').backgroundColor).toBe(
        resolved('background-color', '--nph-overlay-scrim', frame),
      );
      dialog.open = false;
      await closed(dialog);
      frame.remove();
    }
  });

  it('a click on the veil does not close the dialog (D5)', async () => {
    const dialog = await mount({ content: FORM });
    const panel = await openIt(dialog);
    const seen = listen(dialog);
    panel.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, clientX: 1, clientY: 1 }));
    await userEvent.click(document.body, { position: { x: 2, y: 2 }, force: true }).catch(() => {});
    await dialog.updateComplete;
    expect(dialog.open).toBe(true);
    expect(panel.open).toBe(true);
    expect(seen).toEqual([]);
  });
});

describe('scroll', () => {
  const LONG = `<div style="block-size: 1600px;">Long content</div>`;

  it('above layout/dialog-max-height, only the content scrolls; header and footer stay', async () => {
    const dialog = await mount({ content: LONG, footer: ACTIONS });
    const panel = await openIt(dialog);
    const content = part(dialog, '.content') as HTMLElement;
    expect(panel.getBoundingClientRect().height).toBeCloseTo(tokenPx('--nph-layout-dialog-max-height'), 0);
    expect(content.scrollHeight).toBeGreaterThan(content.clientHeight);
    expect(getComputedStyle(content).overflowY).toBe('auto');
    expect(panel.scrollHeight).toBe(panel.clientHeight);
    const footer = part(dialog, '.footer')?.getBoundingClientRect() as DOMRect;
    expect(footer.bottom).toBeLessThanOrEqual(panel.getBoundingClientRect().bottom);
    content.scrollTop = 400;
    expect(part(dialog, '.header')?.getBoundingClientRect().top).toBeGreaterThanOrEqual(panel.getBoundingClientRect().top);
  });

  it('in a window too short for the header and the stacked actions, the window scrolls and every action is reachable', async () => {
    await page.viewport(NARROW.width, 220);
    const dialog = await mount({ actions: 'stacked', content: FORM, footer: ACTIONS });
    const panel = await openIt(dialog);
    expect(panel.scrollHeight).toBeGreaterThan(panel.clientHeight);
    /* Scrollable by the person (wheel and touch), not only by code. */
    expect(getComputedStyle(panel).overflowY).toBe('auto');
    panel.scrollTop = panel.scrollHeight;
    const box = panel.getBoundingClientRect();
    const [cancel] = actionRects(dialog);
    expect(cancel.bottom).toBeLessThanOrEqual(box.bottom);
    expect(cancel.top).toBeGreaterThanOrEqual(box.top);
  });

  it('in that short window, the content keeps a usable row (D6) and its fields can be reached and edited', async () => {
    await page.viewport(NARROW.width, 220);
    const dialog = await mount({ actions: 'stacked', content: FORM, footer: ACTIONS });
    const panel = await openIt(dialog);
    expect(contentBox(dialog).height).toBeGreaterThanOrEqual(tokenPx('--nph-control-height-large') - 0.5);
    const email = dialog.querySelector('#email') as HTMLInputElement;
    email.focus();
    await userEvent.keyboard('ana@example.com');
    expect(email.value).toBe('ana@example.com');
    const area = (part(dialog, '.content') as HTMLElement).getBoundingClientRect();
    const field = email.getBoundingClientRect();
    expect(field.top).toBeGreaterThanOrEqual(area.top - 0.5);
    expect(field.bottom).toBeLessThanOrEqual(area.bottom + 0.5);
    expect(field.top).toBeGreaterThanOrEqual(panel.getBoundingClientRect().top - 0.5);
    expect(field.bottom).toBeLessThanOrEqual(panel.getBoundingClientRect().bottom + 0.5);
  });

  it('in a short window, the height also stops at the window, less the edge', async () => {
    await page.viewport(WIDE.width, 400);
    const dialog = await mount({ content: LONG, footer: ACTIONS });
    const panel = await openIt(dialog);
    const edge = tokenPx('--nph-layout-margin-compact');
    expect(panel.getBoundingClientRect().height).toBeCloseTo(400 - 2 * edge, 0);
  });

  it('locks the scroll of the page while open and restores what the root had', async () => {
    document.documentElement.style.overflow = 'clip';
    const dialog = await mount({ content: FORM });
    await openIt(dialog);
    expect(document.documentElement.style.overflow).toBe('hidden');
    dialog.open = false;
    await closed(dialog);
    expect(document.documentElement.style.overflow).toBe('clip');
    document.documentElement.style.overflow = '';
  });

  it('restores each axis the root had, with its priority, when only one was set', async () => {
    const root = document.documentElement;
    root.style.setProperty('overflow-x', 'hidden', 'important');
    const dialog = await mount({ content: FORM });
    await openIt(dialog);
    expect(getComputedStyle(root).overflowY).toBe('hidden');
    dialog.open = false;
    await closed(dialog);
    expect([root.style.getPropertyValue('overflow-x'), root.style.getPropertyPriority('overflow-x')]).toEqual(['hidden', 'important']);
    expect(root.style.getPropertyValue('overflow-y')).toBe('');
    root.style.removeProperty('overflow-x');
  });

  it('two open dialogs share the lock: the page is released only when both closed', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const first = await mount({ content: FORM, open: true });
    const second = await mount({ heading: 'Second', content: FORM, open: true });
    second.open = false;
    await closed(second);
    expect(document.documentElement.style.overflow).toBe('hidden');
    first.open = false;
    await closed(first);
    expect(document.documentElement.style.overflow).toBe('');
  });
});

describe('width', () => {
  it('a long title or description with no space breaks inside the titles, clear of the close button', async () => {
    await page.viewport(NARROW.width, NARROW.height);
    const id = 'REC-8F3A9C2E7B1D4F6A0C5E9B2D7F1A3C8E6B4D0F2A';
    const dialog = await mount({ heading: id, description: id, content: FORM });
    await openIt(dialog);
    const titles = part(dialog, '.titles') as HTMLElement;
    const close = (closeButton(dialog) as Element).getBoundingClientRect();
    for (const selector of ['.heading', '.description']) {
      const text = part(dialog, selector) as HTMLElement;
      expect(text.scrollWidth, selector).toBeLessThanOrEqual(text.clientWidth);
      expect(text.getBoundingClientRect().right, selector).toBeLessThanOrEqual(close.left);
    }
    expect(titles.getBoundingClientRect().right).toBeLessThanOrEqual(close.left);
  });

  it('hugs the content: a small content keeps layout/dialog-min-width', async () => {
    const dialog = await mount({ heading: 'Hi', description: '', hideClose: true, content: '<span>Ok</span>' });
    const panel = await openIt(dialog);
    expect(panel.getBoundingClientRect().width).toBeCloseTo(tokenPx('--nph-layout-dialog-min-width'), 0);
  });

  it('grows with the content up to the ceiling of each size and no further', async () => {
    const ceilings = { sm: '--nph-layout-dialog-sm', md: '--nph-layout-dialog-md', lg: '--nph-layout-dialog-lg' };
    for (const size of NPH_DIALOG_SIZES) {
      const dialog = await mount({ size, content: '<div style="inline-size: 2000px;">Wide</div>' });
      const panel = await openIt(dialog);
      expect(panel.getBoundingClientRect().width, size).toBeCloseTo(tokenPx(ceilings[size]), 0);
      dialog.open = false;
      await closed(dialog);
    }
  });

  it('a content between the minimum and the ceiling sets the width', async () => {
    const dialog = await mount({ hideClose: true, heading: 'Hi', description: '', content: '<div style="inline-size: 420px;">Mid</div>' });
    const panel = await openIt(dialog);
    const padding = px(getComputedStyle(panel).paddingLeft) + px(getComputedStyle(panel).paddingRight);
    expect(panel.getBoundingClientRect().width).toBeCloseTo(420 + padding, 0);
  });

  it('without the content area, a long title widens the dialog up to the ceiling and breaks into lines', async () => {
    const heading = 'Send the quarterly report to the approval of the finance board before the end of the week';
    const dialog = await mount({ size: 'sm', heading, description: '' });
    const panel = await openIt(dialog);
    expect(part(dialog, '.content')?.hidden).toBe(true);
    expect(panel.getBoundingClientRect().width).toBeCloseTo(tokenPx('--nph-layout-dialog-sm'), 0);
    const title = part(dialog, '.heading') as HTMLElement;
    expect(title.getBoundingClientRect().height).toBeGreaterThan(px(getComputedStyle(title).lineHeight));
  });

  it('in a small window, the width stops at the window, less layout/margin-compact on each side (D2)', async () => {
    await page.viewport(360, 700);
    const dialog = await mount({ size: 'lg', content: '<div style="inline-size: 2000px;">Wide</div>' });
    const panel = await openIt(dialog);
    const edge = tokenPx('--nph-layout-margin-compact');
    expect(panel.getBoundingClientRect().width).toBeCloseTo(360 - 2 * edge, 0);
    expect(panel.getBoundingClientRect().left).toBeCloseTo(edge, 0);
  });
});

describe('window, header and spaces', () => {
  it('paints the window with color/dialog, radius/overlay, elevation/modal and space/overlay-padding', async () => {
    for (const scheme of SCHEMES) {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const dialog = await mount({ content: FORM });
      const panel = await openIt(dialog);
      const style = getComputedStyle(panel);
      expect(style.backgroundColor, scheme).toBe(resolved('background-color', '--nph-color-dialog'));
      expect(style.color, scheme).toBe(resolved('color', '--nph-color-dialog-foreground'));
      expect(style.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-radius-overlay'));
      expect(style.boxShadow).toBe(resolved('box-shadow', '--nph-elevation-modal'));
      expect(style.paddingTop).toBe(resolved('padding-top', '--nph-space-overlay-padding'));
      expect(style.borderTopWidth).toBe('0px');
      dialog.open = false;
      await closed(dialog);
      document.body.replaceChildren();
    }
  });

  it('the title is an h2 in text/heading-md and the description is text/body-md in color/muted-foreground', async () => {
    const dialog = await mount({ content: FORM });
    await openIt(dialog);
    const heading = part(dialog, 'h2') as HTMLElement;
    const description = part(dialog, '.description') as HTMLElement;
    expect(heading.textContent).toBe('Edit profile');
    const h = getComputedStyle(heading);
    expect(h.fontSize).toBe(resolved('font-size', '--nph-text-heading-md-font-size'));
    expect(h.fontWeight).toBe(resolved('font-weight', '--nph-text-heading-md-font-weight'));
    expect(h.lineHeight).toBe(resolved('line-height', '--nph-text-heading-md-line-height'));
    expect(h.color).toBe(resolved('color', '--nph-color-dialog-foreground'));
    const d = getComputedStyle(description);
    expect(d.fontSize).toBe(resolved('font-size', '--nph-text-body-md-font-size'));
    expect(d.lineHeight).toBe(resolved('line-height', '--nph-text-body-md-line-height'));
    expect(d.color).toBe(resolved('color', '--nph-color-muted-foreground'));
    const gap = description.getBoundingClientRect().top - heading.getBoundingClientRect().bottom;
    expect(gap).toBeCloseTo(tokenPx('--nph-space-stack-snug'), 0);
  });

  it('without description there is no paragraph and no description reference', async () => {
    const dialog = await mount({ description: '  ' });
    expect(part(dialog, '.description')).toBeNull();
    expect(panelOf(dialog).hasAttribute('aria-describedby')).toBe(false);
  });

  it('space/stack between header and content; space/stack plus space/stack-snug before the actions', async () => {
    const dialog = await mount({ content: FORM, footer: ACTIONS });
    await openIt(dialog);
    const header = part(dialog, '.header')?.getBoundingClientRect() as DOMRect;
    const content = contentBox(dialog);
    const footer = part(dialog, '.footer')?.getBoundingClientRect() as DOMRect;
    const stack = tokenPx('--nph-space-stack');
    const snug = tokenPx('--nph-space-stack-snug');
    expect(content.top - header.bottom).toBeCloseTo(stack, 0);
    expect(footer.top - content.bottom).toBeCloseTo(stack + snug, 0);
  });

  it('the content sits inside the window padding, and the area that scrolls leaves room for the focus around it', async () => {
    const dialog = await mount({ content: '<input id="wide" aria-label="Wide" style="display: block; inline-size: 100%; box-sizing: border-box;">' });
    const panel = await openIt(dialog);
    const padding = px(getComputedStyle(panel).paddingLeft);
    const box = panel.getBoundingClientRect();
    const input = (dialog.querySelector('#wide') as HTMLElement).getBoundingClientRect();
    expect(input.left - box.left).toBeCloseTo(padding, 0);
    expect(box.right - input.right).toBeCloseTo(padding, 0);
    const room = tokenPx('--nph-border-width') + tokenPx('--nph-focus-ring-width');
    const area = part(dialog, '.content') as HTMLElement;
    const clip = area.getBoundingClientRect();
    expect(input.left - clip.left).toBeGreaterThanOrEqual(room - 0.5);
    expect(clip.right - input.right).toBeGreaterThanOrEqual(room - 0.5);
    expect(input.top - clip.top).toBeGreaterThanOrEqual(room - 0.5);
    expect(clip.bottom - input.bottom).toBeGreaterThanOrEqual(room - 0.5);
    expect(area.scrollHeight).toBe(area.clientHeight);
    expect(area.scrollWidth).toBe(area.clientWidth);
  });

  it('with the lines on, each line sits at space/stack from the content and the actions keep their distance', async () => {
    const dialog = await mount({ content: FORM, footer: ACTIONS, headerSeparator: true, footerSeparator: true });
    await openIt(dialog);
    const header = part(dialog, '.header')?.getBoundingClientRect() as DOMRect;
    const top = part(dialog, '.line-header')?.getBoundingClientRect() as DOMRect;
    const content = contentBox(dialog);
    const bottom = part(dialog, '.line-footer')?.getBoundingClientRect() as DOMRect;
    const footer = part(dialog, '.footer')?.getBoundingClientRect() as DOMRect;
    const stack = tokenPx('--nph-space-stack');
    const snug = tokenPx('--nph-space-stack-snug');
    expect(top.top - header.bottom).toBeCloseTo(stack, 0);
    expect(content.top - top.bottom).toBeCloseTo(stack, 0);
    expect(bottom.top - content.bottom).toBeCloseTo(stack, 0);
    expect(footer.top - bottom.bottom).toBeCloseTo(stack + snug, 0);
  });

  it('the lines are nph-separator in color/dialog-separator, inside the padding (D4), in both schemes', async () => {
    for (const scheme of SCHEMES) {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const dialog = await mount({ content: FORM, footer: ACTIONS, headerSeparator: true, footerSeparator: true });
      const panel = await openIt(dialog);
      for (const selector of ['.line-header', '.line-footer']) {
        const line = part(dialog, selector) as HTMLElement;
        expect(line.localName).toBe('nph-separator');
        expect(getComputedStyle(line).backgroundColor, `${scheme} ${selector}`).toBe(
          resolved('background-color', '--nph-color-dialog-separator'),
        );
        const padding = px(getComputedStyle(panel).paddingLeft);
        expect(line.getBoundingClientRect().left - panel.getBoundingClientRect().left).toBeCloseTo(padding, 0);
      }
      dialog.open = false;
      await closed(dialog);
      document.body.replaceChildren();
    }
  });

  it('the footer line waits for a footer; the content area and the footer appear only with something in them', async () => {
    const dialog = await mount({ footerSeparator: true });
    expect(part(dialog, '.content')?.hidden).toBe(true);
    expect(part(dialog, '.footer')?.hidden).toBe(true);
    expect(part(dialog, '.line-footer')?.hidden).toBe(true);
    const save = document.createElement('nph-button');
    save.text = 'Save';
    save.slot = 'footer';
    dialog.append(save);
    const paragraph = document.createElement('p');
    paragraph.textContent = 'Text';
    dialog.append(paragraph);
    await vi.waitFor(() => expect(part(dialog, '.footer')?.hidden).toBe(false));
    expect(part(dialog, '.content')?.hidden).toBe(false);
    expect(part(dialog, '.line-footer')?.hidden).toBe(false);
  });

  it('a content of only spaces is no content', async () => {
    const dialog = await mount({ content: '   ' });
    expect(part(dialog, '.content')?.hidden).toBe(true);
  });

  it('a text of only spaces edited in place into words shows the content area', async () => {
    const dialog = await mount({ content: '   ' });
    expect(part(dialog, '.content')?.hidden).toBe(true);
    const text = [...dialog.childNodes].find((node) => node.nodeType === Node.TEXT_NODE) as Text;
    text.data = 'Are you sure?';
    await vi.waitFor(() => expect(part(dialog, '.content')?.hidden).toBe(false));
    text.data = '  ';
    await vi.waitFor(() => expect(part(dialog, '.content')?.hidden).toBe(true));
  });
});

describe('actions', () => {
  it('inline: on the right, side by side at space/inline-loose, the primary last', async () => {
    const dialog = await mount({ content: FORM, footer: ACTIONS });
    const panel = await openIt(dialog);
    const [cancel, save] = actionRects(dialog);
    expect(save.left - cancel.right).toBeCloseTo(tokenPx('--nph-space-inline-loose'), 0);
    expect(save.top).toBeCloseTo(cancel.top, 0);
    expect(panel.getBoundingClientRect().right - save.right).toBeCloseTo(px(getComputedStyle(panel).paddingRight), 0);
  });

  it('inline never stacks, even below the md breakpoint', async () => {
    await page.viewport(NARROW.width, NARROW.height);
    const dialog = await mount({ content: FORM, footer: ACTIONS });
    await openIt(dialog);
    const [cancel, save] = actionRects(dialog);
    expect(save.top).toBeCloseTo(cancel.top, 0);
  });

  it('stacked, below the md breakpoint: one per line at space/inline-loose, the primary on top, full width of the footer', async () => {
    await page.viewport(NARROW.width, NARROW.height);
    expect(matchMedia('(width < 48rem)').matches).toBe(true);
    const dialog = await mount({ actions: 'stacked', content: FORM, footer: ACTIONS });
    await openIt(dialog);
    const footer = part(dialog, '.footer')?.getBoundingClientRect() as DOMRect;
    const [cancel, save] = actionRects(dialog);
    expect(save.bottom).toBeLessThan(cancel.top);
    expect(cancel.top - save.bottom).toBeCloseTo(tokenPx('--nph-space-inline-loose'), 0);
    expect(save.width).toBeCloseTo(footer.width, 0);
    expect(cancel.width).toBeCloseTo(footer.width, 0);
  });

  /* The inner native button of nph-button fills its host by the rule of Q1 in `nph-button.css` (P87). */
  it('stacked, the button itself fills the line: the inner control has the width of the footer (Q1)', async () => {
    await page.viewport(NARROW.width, NARROW.height);
    const dialog = await mount({ actions: 'stacked', content: FORM, footer: ACTIONS });
    await openIt(dialog);
    const footer = part(dialog, '.footer')?.getBoundingClientRect() as DOMRect;
    for (const button of dialog.querySelectorAll('nph-button')) {
      const control = button.shadowRoot?.querySelector('button')?.getBoundingClientRect() as DOMRect;
      expect(control.width).toBeCloseTo(footer.width, 0);
    }
  });

  it('stacked, at or above the md breakpoint: inline', async () => {
    const dialog = await mount({ actions: 'stacked', content: FORM, footer: ACTIONS });
    await openIt(dialog);
    const [cancel, save] = actionRects(dialog);
    expect(save.top).toBeCloseTo(cancel.top, 0);
    expect(save.left).toBeGreaterThan(cancel.right);
  });
});

describe('colors redefined in the window (P87)', () => {
  it('a solid secondary nph-button paints color/secondary-on-dialog, in the footer and in the content, in both schemes', async () => {
    for (const scheme of SCHEMES) {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const dialog = await mount({
        content: '<nph-button id="inner" severity="secondary" text="Browse"></nph-button>',
        footer: ACTIONS,
      });
      await openIt(dialog);
      const expected = resolved('background-color', '--nph-color-secondary-on-dialog');
      for (const button of [dialog.querySelector('#inner'), dialog.querySelector('nph-button[slot="footer"]')]) {
        const control = button?.shadowRoot?.querySelector('button') as HTMLButtonElement;
        expect(getComputedStyle(control).backgroundColor, scheme).toBe(expected);
      }
      dialog.open = false;
      await closed(dialog);
      document.body.replaceChildren();
    }
  });

  it('on hover, color/secondary-on-dialog-hover', async () => {
    document.documentElement.setAttribute('data-nph-color-scheme', 'dark');
    const dialog = await mount({ content: FORM, footer: ACTIONS });
    await openIt(dialog);
    const cancel = dialog.querySelector('nph-button') as NphButton;
    await userEvent.hover(cancel);
    const control = cancel.shadowRoot?.querySelector('button') as HTMLButtonElement;
    expect(getComputedStyle(control).backgroundColor).toBe(resolved('background-color', '--nph-color-secondary-on-dialog-hover'));
    await userEvent.unhover(cancel);
  });

  it('in dark, the redefined secondary differs from the dialog background, which the regular secondary equals', () => {
    document.documentElement.setAttribute('data-nph-color-scheme', 'dark');
    expect(resolved('background-color', '--nph-color-secondary')).toBe(resolved('background-color', '--nph-color-dialog'));
    expect(resolved('background-color', '--nph-color-secondary-on-dialog')).not.toBe(resolved('background-color', '--nph-color-dialog'));
  });

  it('outside the dialog, the secondary keeps color/secondary', async () => {
    document.documentElement.setAttribute('data-nph-color-scheme', 'dark');
    const outside = document.createElement('nph-button');
    outside.severity = 'secondary';
    outside.text = 'Outside';
    document.body.append(outside);
    await outside.updateComplete;
    const control = outside.shadowRoot?.querySelector('button') as HTMLButtonElement;
    expect(getComputedStyle(control).backgroundColor).toBe(resolved('background-color', '--nph-color-secondary'));
  });
});

describe('semantics', () => {
  it('the window is a modal dialog named by the title and described by the description', async () => {
    const dialog = await mount({ content: FORM });
    const panel = await openIt(dialog);
    expect(panel.localName).toBe('dialog');
    const root = dialog.shadowRoot as ShadowRoot;
    expect(root.getElementById(panel.getAttribute('aria-labelledby') ?? '')?.textContent).toBe('Edit profile');
    expect(root.getElementById(panel.getAttribute('aria-describedby') ?? '')?.textContent).toBe('Change how your name appears.');
  });

  it('the accessibility tree reads a modal dialog with that name and description', async () => {
    const dialog = await mount({ content: FORM });
    const node = await axNode(await openIt(dialog));
    expect(node.role).toBe('dialog');
    expect(node.name).toBe('Edit profile');
    expect(node.description).toBe('Change how your name appears.');
    expect(node.modal).toBe(true);
  });

  it('the title and the description follow their properties', async () => {
    const dialog = await mount();
    dialog.heading = 'Publish now?';
    dialog.description = 'Everyone will see it.';
    await dialog.updateComplete;
    expect(part(dialog, 'h2')?.textContent).toBe('Publish now?');
    expect(part(dialog, '.description')?.textContent).toBe('Everyone will see it.');
  });

  it('the window takes no Tab stop of its own when there is something to focus', async () => {
    const dialog = await mount({ content: FORM });
    const panel = await openIt(dialog);
    expect(panel.getAttribute('tabindex')).toBe('-1');
  });
});

describe('invalid input: it renders nothing and says why, once per cause', () => {
  function errors(spy: { mock: { calls: unknown[][] } }): string[] {
    return spy.mock.calls.map((call) => String(call[0])).filter((message) => message.startsWith('[nph-dialog]'));
  }

  it('an empty heading: nothing is drawn and open does nothing', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const dialog = await mount({ heading: '   ', content: FORM });
    expect(dialog.shadowRoot?.querySelector('dialog')).toBeNull();
    dialog.open = true;
    await dialog.updateComplete;
    expect(document.documentElement.style.overflow).toBe('');
    expect(errors(error)).toHaveLength(1);
    expect(errors(error)[0]).toContain('heading is required');
  });

  it('a size or an actions outside the lists', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const dialog = await mount({ size: 'xl', actions: 'grid' });
    expect(dialog.shadowRoot?.querySelector('dialog')).toBeNull();
    expect(errors(error)).toHaveLength(2);
    expect(errors(error)[0]).toContain('size "xl"');
    expect(errors(error)[1]).toContain('actions "grid"');
    dialog.heading = 'Again';
    await dialog.updateComplete;
    expect(errors(error)).toHaveLength(2);
  });

  it('a valid value set later makes it draw, and no new error appears', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const dialog = await mount({ size: 'xl' });
    dialog.size = 'lg';
    await settle(dialog);
    expect(dialog.shadowRoot?.querySelector('dialog')).not.toBeNull();
    expect(errors(error)).toHaveLength(1);
  });

  it('becoming invalid while open closes it and releases the page', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const dialog = await mount({ content: FORM, open: true });
    dialog.heading = '';
    await dialog.updateComplete;
    expect(dialog.shadowRoot?.querySelector('dialog')).toBeNull();
    expect(document.documentElement.style.overflow).toBe('');
  });

  it('an empty close-label with the close button on: the dialog opens without the button and says why', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const dialog = await mount({ closeLabel: '', content: FORM });
    expect(closeButton(dialog)).toBeNull();
    await openIt(dialog);
    expect(panelOf(dialog).open).toBe(true);
    expect(errors(error)).toHaveLength(1);
    expect(errors(error)[0]).toContain('close-label is required');
  });

  it('an empty close-label with hide-close is not an error', async () => {
    const error = vi.spyOn(console, 'error');
    await mount({ closeLabel: '', hideClose: true, content: FORM });
    expect(errors(error)).toEqual([]);
  });

  it('a valid dialog does not log anything', async () => {
    const error = vi.spyOn(console, 'error');
    const warn = vi.spyOn(console, 'warn');
    const dialog = await mount({ content: FORM, footer: ACTIONS });
    await openIt(dialog);
    dialog.open = false;
    await closed(dialog);
    expect(errors(error)).toEqual([]);
    expect(errors(warn)).toEqual([]);
  });
});

describe('motion', () => {
  it('enters on motion/enter-duration and leaves on motion/exit-duration, opacity only', async () => {
    const dialog = await mount({ content: FORM });
    const panel = await openIt(dialog);
    const enter = getComputedStyle(panel);
    expect(enter.transitionProperty).toBe('opacity');
    expect(enter.transitionDuration).toBe(resolved('transition-duration', '--nph-motion-enter-duration'));
    expect(enter.transitionTimingFunction).toBe(resolved('transition-timing-function', '--nph-motion-enter-easing'));
    dialog.open = false;
    await dialog.updateComplete;
    const exit = getComputedStyle(panel);
    expect(exit.transitionDuration).toBe(resolved('transition-duration', '--nph-motion-exit-duration'));
    expect(exit.transitionTimingFunction).toBe(resolved('transition-timing-function', '--nph-motion-exit-easing'));
    await closed(dialog);
  });

  it('with reduced motion, both use motion/hover-duration', async () => {
    const session = cdp();
    try {
      await session.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
      const dialog = await mount({ content: FORM });
      const panel = await openIt(dialog);
      expect(getComputedStyle(panel).transitionDuration).toBe(resolved('transition-duration', '--nph-motion-hover-duration'));
      expect(getComputedStyle(panel, '::backdrop').transitionDuration).toBe(resolved('transition-duration', '--nph-motion-hover-duration'));
    } finally {
      await session.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
    }
  });
});

describe('token contract', () => {
  const consumed = [...new Set(componentCss.match(/--nph-[a-z0-9-]+/g) ?? [])];

  it('every token the CSS consumes exists in tokens.css, and none is core or theme', () => {
    expect(consumed.length).toBeGreaterThan(0);
    for (const token of consumed) {
      expect(tokensCss, token).toContain(`${token}:`);
      expect(token).not.toMatch(/^--nph-(core|theme)-/);
    }
  });

  it('consumes the tokens of the evidence, and not the dialog-content widths (master widths, as P66)', () => {
    for (const token of [
      '--nph-color-dialog',
      '--nph-color-dialog-foreground',
      '--nph-radius-overlay',
      '--nph-elevation-modal',
      '--nph-space-overlay-padding',
      '--nph-layout-dialog-min-width',
      '--nph-layout-dialog-sm',
      '--nph-layout-dialog-md',
      '--nph-layout-dialog-lg',
      '--nph-layout-dialog-max-height',
      '--nph-color-dialog-separator',
      '--nph-color-secondary-on-dialog',
      '--nph-color-secondary-on-dialog-hover',
      '--nph-overlay-scrim',
      '--nph-space-stack',
      '--nph-space-stack-snug',
      '--nph-space-inline-loose',
    ]) {
      expect(consumed, token).toContain(token);
    }
    expect(consumed.some((token) => token.startsWith('--nph-layout-dialog-content'))).toBe(false);
  });

  it('the only literal breakpoint is the md one of design.md, written in rem', () => {
    const queries = componentCss.match(/@media \(width < [^)]+\)/g) ?? [];
    expect(queries).toEqual(['@media (width < 48rem)']);
    expect(designMd).toMatch(/md:\s+\{ valor: 768,/);
  });

  it('design.md reserves the redefined colors for the nph-dialog and requires the veil with elevation/modal', () => {
    expect(designMd).toMatch(/color\/secondary-on-dialog:[\s\S]*?use: "Background of the solid secondary nph-button inside the nph-dialog/);
    expect(designMd).toMatch(/color\/dialog-separator:[\s\S]*?use: "Line of the nph-dialog header and footer/);
    expect(designMd).toMatch(/modal_exige_veu: overlay\/scrim/);
  });
});
