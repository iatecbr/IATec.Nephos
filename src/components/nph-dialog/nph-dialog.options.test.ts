/**
 * Tests of the three options `nph-dialog` gained for a piece that mounts it as its own surface
 * (P123, from DSA-80): `hide-heading`, `no-padding` and `close-on-backdrop`, and the two new
 * origins of `nph-close`, asked for through `requestClose`. They prove that each option is off
 * by default and leaves the dialog of P87 as it was, and what each one does when it is on. The
 * tests of P87 live in `nph-dialog.test.ts` and stay untouched, but for the list of properties.
 */
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cdp, page, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-600.css';
import '../../tokens/generated/tokens.css';
import { NPH_DIALOG_CLOSE_EVENT, NPH_DIALOG_CLOSE_SOURCES, NphDialog } from './nph-dialog';
import type { NphDialogCloseDetail } from './nph-dialog';

const WIDE = { width: 1280, height: 800 };
const NARROW = { width: 414, height: 896 };

beforeAll(async () => {
  await page.viewport(WIDE.width, WIDE.height);
  await document.fonts.load('400 14px "Noto Sans"');
  await document.fonts.ready;
});

afterAll(async () => {
  await page.viewport(NARROW.width, NARROW.height);
});

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

interface Spec {
  hideHeading?: boolean;
  noPadding?: boolean;
  closeOnBackdrop?: boolean;
  hideClose?: boolean;
  open?: boolean;
  description?: string;
}

const CONTENT = '<input id="field" aria-label="Field" style="display: block; inline-size: 20rem;">';

async function mount(spec: Spec = {}): Promise<NphDialog> {
  const dialog = document.createElement('nph-dialog');
  dialog.heading = 'Command palette';
  dialog.description = spec.description ?? '';
  dialog.closeLabel = 'Close';
  dialog.hideHeading = spec.hideHeading ?? false;
  dialog.noPadding = spec.noPadding ?? false;
  dialog.closeOnBackdrop = spec.closeOnBackdrop ?? false;
  dialog.hideClose = spec.hideClose ?? false;
  dialog.innerHTML = CONTENT;
  document.body.append(dialog);
  dialog.open = spec.open ?? true;
  await dialog.updateComplete;
  const pieces = [...(dialog.shadowRoot?.querySelectorAll('*') ?? [])].filter(
    (element): element is Element & { updateComplete: Promise<unknown> } => 'updateComplete' in element,
  );
  await Promise.all(pieces.map((piece) => piece.updateComplete));
  return dialog;
}

function panelOf(dialog: NphDialog): HTMLDialogElement {
  const panel = dialog.shadowRoot?.querySelector('dialog');
  if (!panel) throw new Error('no <dialog>');
  return panel;
}

function part(dialog: NphDialog, selector: string): HTMLElement {
  const found = dialog.shadowRoot?.querySelector<HTMLElement>(selector);
  if (!found) throw new Error(`no ${selector}`);
  return found;
}

function listen(dialog: NphDialog): Array<{ source: string; cancelable: boolean }> {
  const seen: Array<{ source: string; cancelable: boolean }> = [];
  dialog.addEventListener(NPH_DIALOG_CLOSE_EVENT, (event) => {
    seen.push({ source: (event as CustomEvent<NphDialogCloseDetail>).detail.source, cancelable: event.cancelable });
  });
  return seen;
}

async function closed(dialog: NphDialog): Promise<void> {
  await vi.waitFor(() => expect(panelOf(dialog).open).toBe(false), { timeout: 2000 });
}

function px(value: string): number {
  return Number.parseFloat(value);
}

/** The accessible name and description the browser computes for the window. */
async function axOfWindow(dialog: NphDialog): Promise<{ name: string; description: string }> {
  const panel = panelOf(dialog);
  const session = cdp();
  await session.send('Accessibility.enable');
  panel.setAttribute('data-ax-probe', '');
  try {
    await session.send('DOM.getDocument', { depth: -1, pierce: true });
    const { searchId } = await session.send('DOM.performSearch', { query: '[data-ax-probe]', includeUserAgentShadowDOM: false });
    const { nodeIds } = await session.send('DOM.getSearchResults', { searchId, fromIndex: 0, toIndex: 1 });
    await session.send('DOM.discardSearchResults', { searchId });
    const { nodes } = await session.send('Accessibility.getPartialAXTree', { nodeId: nodeIds[0] as number, fetchRelatives: false });
    return { name: String(nodes[0]?.name?.value ?? ''), description: String(nodes[0]?.description?.value ?? '') };
  } finally {
    panel.removeAttribute('data-ax-probe');
  }
}

describe('the options are off by default', () => {
  it('declares the three options, reflected, false at rest', async () => {
    const dialog = await mount({ open: false });
    expect(dialog.hideHeading).toBe(false);
    expect(dialog.noPadding).toBe(false);
    expect(dialog.closeOnBackdrop).toBe(false);
    dialog.hideHeading = true;
    dialog.noPadding = true;
    dialog.closeOnBackdrop = true;
    await dialog.updateComplete;
    expect(dialog.hasAttribute('hide-heading')).toBe(true);
    expect(dialog.hasAttribute('no-padding')).toBe(true);
    expect(dialog.hasAttribute('close-on-backdrop')).toBe(true);
  });

  it('with the options off, the title is drawn, the window has its padding and a click on the veil does nothing', async () => {
    const dialog = await mount();
    const panel = panelOf(dialog);
    const heading = part(dialog, '.heading');
    expect(getComputedStyle(part(dialog, '.titles')).position).not.toBe('absolute');
    expect(heading.getBoundingClientRect().height).toBeGreaterThan(0);
    expect(px(getComputedStyle(panel).paddingTop)).toBeGreaterThan(0);
    const seen = listen(dialog);
    await userEvent.click(document.body, { position: { x: 2, y: 2 }, force: true }).catch(() => {});
    await dialog.updateComplete;
    expect(dialog.open).toBe(true);
    expect(seen).toEqual([]);
  });
});

describe('hide-heading', () => {
  it('takes the title out of the drawing and leaves it as the name of the window', async () => {
    const dialog = await mount({ hideHeading: true, hideClose: true, description: 'Search and run a command.' });
    const panel = panelOf(dialog);
    const titles = part(dialog, '.titles');
    expect(getComputedStyle(titles).position).toBe('absolute');
    expect(getComputedStyle(titles).clipPath).toContain('inset');
    expect(part(dialog, '.heading').textContent).toBe('Command palette');
    const ax = await axOfWindow(dialog);
    expect(ax.name).toBe('Command palette');
    expect(ax.description).toBe('Search and run a command.');
    expect(panel.getAttribute('aria-labelledby')).toBe('heading');
  });

  it('with no close button the header takes no room: the content starts at the window edge', async () => {
    const dialog = await mount({ hideHeading: true, hideClose: true, noPadding: true });
    const panel = panelOf(dialog);
    const header = part(dialog, '.header').getBoundingClientRect();
    expect(header.height).toBe(0);
    const content = part(dialog, '.content').getBoundingClientRect();
    expect(content.top).toBeCloseTo(panel.getBoundingClientRect().top, 0);
  });

  it('with the padding on and no close button, the content keeps only the window padding', async () => {
    const dialog = await mount({ hideHeading: true, hideClose: true });
    const panel = panelOf(dialog);
    const content = part(dialog, '.content');
    const style = getComputedStyle(content);
    const room = px(style.paddingTop);
    const field = dialog.querySelector('#field') as HTMLElement;
    const distance = field.getBoundingClientRect().top - panel.getBoundingClientRect().top;
    expect(distance).toBeCloseTo(px(getComputedStyle(panel).paddingTop) + 0, 0);
    expect(room).toBeGreaterThan(0);
  });

  it('with the close button on, the header stays for the button', async () => {
    const dialog = await mount({ hideHeading: true });
    expect(part(dialog, '.close').getBoundingClientRect().height).toBeGreaterThan(0);
    expect(part(dialog, '.header').getBoundingClientRect().height).toBeGreaterThan(0);
  });
});

describe('no-padding', () => {
  it('takes the window padding and the room of the focus off, so the content goes edge to edge', async () => {
    const dialog = await mount({ noPadding: true, hideHeading: true, hideClose: true });
    const panel = panelOf(dialog);
    const style = getComputedStyle(panel);
    expect([style.paddingTop, style.paddingRight, style.paddingBottom, style.paddingLeft]).toEqual(['0px', '0px', '0px', '0px']);
    const content = part(dialog, '.content');
    const contentStyle = getComputedStyle(content);
    expect([contentStyle.marginTop, contentStyle.marginLeft, contentStyle.paddingTop, contentStyle.paddingLeft]).toEqual(['0px', '0px', '0px', '0px']);
    const box = panel.getBoundingClientRect();
    const inner = content.getBoundingClientRect();
    expect(inner.left).toBeCloseTo(box.left, 0);
    expect(inner.right).toBeCloseTo(box.right, 0);
  });

  it('still rounds the window corners and clips the content to them', async () => {
    const dialog = await mount({ noPadding: true });
    const style = getComputedStyle(panelOf(dialog));
    expect(px(style.borderTopLeftRadius)).toBeGreaterThan(0);
    expect(style.overflowX).toBe('hidden');
  });
});

describe('close-on-backdrop', () => {
  it('a click on the veil asks to close with source backdrop and closes the dialog', async () => {
    const dialog = await mount({ closeOnBackdrop: true });
    const seen = listen(dialog);
    await userEvent.click(document.body, { position: { x: 2, y: 2 }, force: true });
    await closed(dialog);
    expect(seen).toEqual([{ source: 'backdrop', cancelable: true }]);
    expect(dialog.open).toBe(false);
  });

  it('preventDefault keeps it open', async () => {
    const dialog = await mount({ closeOnBackdrop: true });
    dialog.addEventListener(NPH_DIALOG_CLOSE_EVENT, (event) => event.preventDefault());
    const seen = listen(dialog);
    await userEvent.click(document.body, { position: { x: 2, y: 2 }, force: true });
    await dialog.updateComplete;
    expect(seen).toHaveLength(1);
    expect(dialog.open).toBe(true);
    expect(panelOf(dialog).open).toBe(true);
  });

  it('a click inside the window, on its padding or on the content, does not close it', async () => {
    const dialog = await mount({ closeOnBackdrop: true });
    const panel = panelOf(dialog);
    const seen = listen(dialog);
    const box = panel.getBoundingClientRect();
    await userEvent.click(panel, { position: { x: 3, y: 3 }, force: true });
    await userEvent.click(dialog.querySelector('#field') as HTMLElement);
    await dialog.updateComplete;
    expect(box.width).toBeGreaterThan(0);
    expect(seen).toEqual([]);
    expect(dialog.open).toBe(true);
  });

  it('a press that starts inside the window and ends over the veil does not close it', async () => {
    const dialog = await mount({ closeOnBackdrop: true });
    const panel = panelOf(dialog);
    const seen = listen(dialog);
    const inside = panel.getBoundingClientRect();
    panel.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true, clientX: inside.left + 4, clientY: inside.top + 4 }));
    panel.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, clientX: 1, clientY: 1 }));
    await dialog.updateComplete;
    expect(seen).toEqual([]);
    expect(dialog.open).toBe(true);
  });

  it('a press that starts on the veil and a click that ends on the veil close it', async () => {
    const dialog = await mount({ closeOnBackdrop: true });
    const panel = panelOf(dialog);
    const seen = listen(dialog);
    panel.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true, clientX: 1, clientY: 1 }));
    panel.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, clientX: 1, clientY: 1 }));
    await closed(dialog);
    expect(seen).toEqual([{ source: 'backdrop', cancelable: true }]);
  });

  it('can be opened again after a veil close', async () => {
    const dialog = await mount({ closeOnBackdrop: true });
    await userEvent.click(document.body, { position: { x: 2, y: 2 }, force: true });
    await closed(dialog);
    dialog.open = true;
    await dialog.updateComplete;
    await vi.waitFor(() => expect(panelOf(dialog).open).toBe(true));
    expect(dialog.open).toBe(true);
  });
});

describe('requestClose and the new origins', () => {
  it('the origins are the three the dialog knows and the two a piece that mounts it gives', () => {
    expect([...NPH_DIALOG_CLOSE_SOURCES]).toEqual(['escape', 'close-button', 'backdrop', 'open-key', 'command-run']);
  });

  it('each origin fires nph-close, cancelable, bubbling and composed, and closes the dialog', async () => {
    for (const source of ['open-key', 'command-run', 'backdrop'] as const) {
      const dialog = await mount();
      const events: CustomEvent<NphDialogCloseDetail>[] = [];
      document.body.addEventListener(NPH_DIALOG_CLOSE_EVENT, (event) => events.push(event as CustomEvent<NphDialogCloseDetail>), { once: true });
      expect(dialog.requestClose(source)).toBe(true);
      await closed(dialog);
      expect(events).toHaveLength(1);
      expect(events[0]?.detail.source).toBe(source);
      expect(events[0]?.cancelable).toBe(true);
      expect(events[0]?.composed).toBe(true);
      expect(dialog.open).toBe(false);
      dialog.remove();
    }
  });

  it('preventDefault keeps it open and requestClose says it did not close', async () => {
    const dialog = await mount();
    dialog.addEventListener(NPH_DIALOG_CLOSE_EVENT, (event) => event.preventDefault());
    expect(dialog.requestClose('command-run')).toBe(false);
    expect(dialog.open).toBe(true);
  });

  it('a closed dialog does nothing and fires nothing', async () => {
    const dialog = await mount({ open: false });
    const seen = listen(dialog);
    expect(dialog.requestClose('open-key')).toBe(false);
    expect(seen).toEqual([]);
  });

  it('an origin outside the list does nothing and says so in development', async () => {
    const dialog = await mount();
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const seen = listen(dialog);
    expect(dialog.requestClose('somewhere' as never)).toBe(false);
    expect(seen).toEqual([]);
    expect(dialog.open).toBe(true);
    expect(error).toHaveBeenCalledTimes(1);
    expect(String(error.mock.calls[0]?.[0])).toContain('requestClose source "somewhere" does not exist');
  });

  it('Esc and the close button still report escape and close-button', async () => {
    const dialog = await mount();
    const seen = listen(dialog);
    await userEvent.click(document.body, { position: { x: 640, y: 400 }, force: true }).catch(() => {});
    await userEvent.keyboard('{Escape}');
    await closed(dialog);
    expect(seen[0]?.source).toBe('escape');
    dialog.open = true;
    await dialog.updateComplete;
    const button = part(dialog, 'nph-button.close');
    await (button as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    button.click();
    await closed(dialog);
    expect(seen[1]?.source).toBe('close-button');
  });
});
