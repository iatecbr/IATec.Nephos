/**
 * Tests of `nph-toast-region` (DSA-100), in a real browser (P21, item 5): the corner, the gap, the
 * end edge, the top layer, the focus ring and the scroll only exist where there is layout.
 *
 * They prove the contract accepted in Figma (documentation frame `7819:4737`, set `7689:288`),
 * recorded in the evidence of the `figma-docs-accepted` gate of DSA-100: the five tokens and where
 * the CSS reads them, the column and its order, the two screens, the limit of three and the queue,
 * the role and the two live regions, the toast without its own role, the pause of every toast and
 * under a modal dialog, F6 and Esc and where the focus goes, the motion, the window lower than the
 * stack and the focus ring that comes out whole.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import '../../tokens/generated/tokens.css';
import '../nph-dialog/nph-dialog';
import type { NphDialog } from '../nph-dialog/nph-dialog';
import type { NphNotification, NphNotificationCloseDetail } from '../nph-notification/nph-notification';
import notificationCss from '../nph-notification/nph-notification.css?raw';
import componentCss from './nph-toast-region.css?raw';
import { NPH_TOAST_REGION_MAX_VISIBLE, NphToastRegion } from './nph-toast-region';

const LABEL = 'Notifications';
const CLOSE = 'Close';
const FAKE: { toFake: ('setTimeout' | 'clearTimeout' | 'Date')[] } = { toFake: ['setTimeout', 'clearTimeout', 'Date'] };

beforeAll(async () => {
  await page.viewport(1024, 768);
  await document.fonts.ready;
});

afterEach(async () => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  document.body.replaceChildren();
  await page.viewport(1024, 768);
});

interface ToastOptions {
  severity?: string;
  heading?: string;
  description?: string;
  action?: string;
  duration?: number;
  layout?: string;
  hideClose?: boolean;
}

function makeToast(options: ToastOptions = {}): NphNotification {
  const toast = document.createElement('nph-notification');
  toast.setAttribute('placement', 'toast');
  toast.setAttribute('close-label', CLOSE);
  toast.setAttribute('severity', options.severity ?? 'info');
  toast.setAttribute('description', options.description ?? 'The file is ready to download.');
  if (options.heading !== undefined) toast.setAttribute('heading', options.heading);
  if (options.action !== undefined) toast.setAttribute('action', options.action);
  if (options.duration !== undefined) toast.setAttribute('duration', String(options.duration));
  if (options.layout !== undefined) toast.setAttribute('layout', options.layout);
  if (options.hideClose) toast.setAttribute('hide-close', '');
  return toast;
}

async function settle(region: NphToastRegion): Promise<void> {
  await region.updateComplete;
  for (const toast of region.querySelectorAll('nph-notification')) await toast.updateComplete;
  await region.updateComplete;
}

/** Mounts a region with the given toasts, in the order given: the first is the oldest. */
async function mount(toasts: ToastOptions[] = [], label: string | null = LABEL): Promise<{ region: NphToastRegion; toasts: NphNotification[] }> {
  const region = document.createElement('nph-toast-region');
  if (label !== null) region.setAttribute('label', label);
  const made = toasts.map(makeToast);
  region.append(...made);
  document.body.append(region);
  await settle(region);
  return { region, toasts: made };
}

async function add(region: NphToastRegion, options: ToastOptions): Promise<NphNotification> {
  const toast = makeToast(options);
  region.append(toast);
  await settle(region);
  return toast;
}

const root = (region: NphToastRegion): ShadowRoot => region.shadowRoot as ShadowRoot;
const list = (region: NphToastRegion): HTMLElement => root(region).querySelector<HTMLElement>('.region') as HTMLElement;
const live = (region: NphToastRegion, kind: 'polite' | 'assertive'): HTMLElement =>
  root(region).querySelector<HTMLElement>(`[data-live="${kind}"]`) as HTMLElement;
const px = (value: string): number => Number.parseFloat(value);
const rect = (element: Element): DOMRect => element.getBoundingClientRect();

/** A token as the browser resolves it, in pixels, through a probe. */
function resolvedPx(token: string): number {
  const probe = document.createElement('div');
  probe.style.inlineSize = `var(${token})`;
  document.body.append(probe);
  const value = px(getComputedStyle(probe).width);
  probe.remove();
  return value;
}

function resolvedTime(token: string): string {
  const probe = document.createElement('div');
  probe.style.transitionDuration = `var(${token})`;
  document.body.append(probe);
  const value = getComputedStyle(probe).transitionDuration;
  probe.remove();
  return value;
}

const controls = (toast: NphNotification): HTMLElement[] => [...(toast.shadowRoot?.querySelectorAll<HTMLElement>('nph-button') ?? [])];

function deepActive(): Element | null {
  let active: Element | null = document.activeElement;
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
  return active;
}

const inside = (toast: NphNotification): boolean => {
  let node: Node | null = deepActive();
  while (node !== null) {
    if (node === toast) return true;
    node = node.parentNode ?? (node instanceof ShadowRoot ? node.host : null);
  }
  return false;
};

/** Closes a toast the way a person does: the click on its close button. The toast then hides itself. */
function closeToast(toast: NphNotification): void {
  (toast.shadowRoot?.querySelector('.close nph-button') as HTMLElement).click();
}

async function press(key: string): Promise<void> {
  await userEvent.keyboard(`{${key}}`);
}

/** Lets the live regions' wait go by: the announcement is written a moment after the toast arrives. */
async function announced(region: NphToastRegion, kind: 'polite' | 'assertive', text: string): Promise<void> {
  await vi.waitFor(() => expect(live(region, kind).textContent).toContain(text));
}

describe('registration and API', () => {
  it('defines nph-toast-region exactly once', () => {
    expect(customElements.get('nph-toast-region')).toBe(NphToastRegion);
  });

  it('the public API is exactly the label and the default slot', () => {
    const declared = [...(NphToastRegion as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared.filter((name) => name !== 'scrolls')).toEqual(['label']);
  });

  it('shows at most three toasts', () => {
    expect(NPH_TOAST_REGION_MAX_VISIBLE).toBe(3);
  });

  it('warns once, in development, when the name is missing', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    await mount([], null);
    const messages = error.mock.calls.map((call) => String(call[0]));
    expect(messages.filter((message) => message.includes('label is required'))).toHaveLength(1);
  });

  it('warns about a child that is not a toast, and about an inline notification', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { region } = await mount([]);
    region.append(document.createElement('div'));
    const inline = makeToast();
    inline.setAttribute('placement', 'inline');
    region.append(inline);
    await settle(region);
    const messages = error.mock.calls.map((call) => String(call[0]));
    expect(messages.some((message) => message.includes('<div> does not belong'))).toBe(true);
    expect(messages.some((message) => message.includes('placement="toast"'))).toBe(true);
  });

  it('warns that there is one region per page', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    await mount([]);
    await mount([]);
    expect(error.mock.calls.some((call) => String(call[0]).includes('one region per page'))).toBe(true);
  });
});

describe('role, name and live regions (item 5)', () => {
  it('is a region with the name the application gave, and no state of its own', async () => {
    const { region } = await mount([{}]);
    expect(list(region).getAttribute('role')).toBe('region');
    expect(list(region).getAttribute('aria-label')).toBe(LABEL);
  });

  it('mounts the two hidden live regions even when it is empty', async () => {
    const { region } = await mount([]);
    expect(live(region, 'polite').getAttribute('aria-live')).toBe('polite');
    expect(live(region, 'polite').getAttribute('role')).toBe('status');
    expect(live(region, 'assertive').getAttribute('aria-live')).toBe('assertive');
    expect(live(region, 'assertive').getAttribute('role')).toBe('alert');
    for (const kind of ['polite', 'assertive'] as const) {
      const box = rect(live(region, kind));
      expect(box.width).toBe(0);
      expect(box.height).toBe(0);
      expect(getComputedStyle(live(region, kind)).display).not.toBe('none');
    }
  });

  it('announces info, success and help in the polite one, with the heading and the description', async () => {
    const { region } = await mount([{ severity: 'success', heading: 'Invitation sent', description: 'The team can already access the project.' }]);
    await announced(region, 'polite', 'Invitation sent. The team can already access the project.');
    expect(live(region, 'assertive').textContent).toBe('');
  });

  it('announces error and warning in the assertive one', async () => {
    const { region } = await mount([]);
    await add(region, { severity: 'error', heading: 'Upload failed', description: 'The file is over the allowed size.' });
    await announced(region, 'assertive', 'Upload failed. The file is over the allowed size.');
    await add(region, { severity: 'warning', description: 'The session ends in five minutes.' });
    await announced(region, 'assertive', 'The session ends in five minutes.');
    expect(live(region, 'polite').textContent).toBe('');
  });

  it('writes what arrived together in the same live region', async () => {
    const { region } = await mount([{ description: 'First notice.' }, { severity: 'success', description: 'Second notice.' }]);
    await announced(region, 'polite', 'Second notice.');
    expect(live(region, 'polite').textContent).toContain('First notice.');
  });

  it('announces a toast that changes in place: a loading toast that turns into success', async () => {
    const { region, toasts } = await mount([{ severity: 'loading', description: 'Saving changes…' }]);
    await announced(region, 'polite', 'Saving changes…');
    toasts[0]?.setAttribute('severity', 'success');
    toasts[0]?.setAttribute('description', 'Changes saved.');
    await announced(region, 'polite', 'Changes saved.');
    expect(live(region, 'polite').textContent).not.toContain('Saving');
  });

  it('announces a change of the text alone, and once for the same words', async () => {
    const { region, toasts } = await mount([{ description: 'One.' }]);
    await announced(region, 'polite', 'One.');
    (toasts[0] as NphNotification).description = 'Two.';
    await announced(region, 'polite', 'Two.');
    const written = live(region, 'polite').firstElementChild;
    (toasts[0] as NphNotification).description = 'Two.';
    await settle(region);
    await new Promise((resolve) => setTimeout(resolve, 250));
    expect(live(region, 'polite').firstElementChild).toBe(written);
  });

  it('says nothing for a toast that draws nothing', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { region } = await mount([{ description: '' }]);
    await new Promise((resolve) => setTimeout(resolve, 250));
    expect(live(region, 'polite').textContent).toBe('');
  });

  it('the toast inside the region has no role of its own, and the inline one keeps it', async () => {
    const { region, toasts } = await mount([{ severity: 'error' }, { severity: 'info' }]);
    for (const toast of toasts) expect(toast.hasAttribute('role')).toBe(false);
    const inline = document.createElement('nph-notification');
    inline.setAttribute('description', 'Inline.');
    inline.setAttribute('close-label', CLOSE);
    inline.setAttribute('severity', 'error');
    document.body.append(inline);
    await inline.updateComplete;
    expect(inline.getAttribute('role')).toBe('alert');
    /* Moved out of the region, the toast takes its role back. */
    document.body.append(toasts[0] as NphNotification);
    await (toasts[0] as NphNotification).updateComplete;
    expect(toasts[0]?.getAttribute('role')).toBe('alert');
    expect(region.contains(toasts[0] as NphNotification)).toBe(false);
  });
});

describe('the column, its order and its corner (default screen)', () => {
  it('is in the top layer from the moment it is connected, and takes no room in the page', async () => {
    const { region } = await mount([]);
    expect(list(region).matches(':popover-open')).toBe(true);
    expect(getComputedStyle(list(region)).position).toBe('fixed');
    expect(rect(region).width).toBe(0);
    expect(document.documentElement.scrollHeight).toBeLessThanOrEqual(document.documentElement.clientHeight);
  });

  it('sits at the bottom-right corner, toast-region/inset from the bottom and from the end edge', async () => {
    const { region } = await mount([{}]);
    const inset = resolvedPx('--nph-toast-region-inset');
    expect(inset).toBe(24);
    const box = rect(list(region));
    expect(box.right).toBeCloseTo(document.documentElement.clientWidth - inset, 1);
    expect(box.bottom).toBeCloseTo(document.documentElement.clientHeight - inset, 1);
  });

  it('the region takes the width of its toasts: 360 stacked', async () => {
    const { region, toasts } = await mount([{}]);
    expect(rect(toasts[0] as NphNotification).width).toBeCloseTo(resolvedPx('--nph-notification-toast-width'), 1);
    expect(rect(list(region)).width).toBeCloseTo(rect(toasts[0] as NphNotification).width, 1);
  });

  it('stacks the toasts from the oldest at the top to the newest at the bottom, toast-region/gap apart', async () => {
    const { toasts } = await mount([{ description: 'Oldest.' }, { description: 'Middle.' }, { description: 'Newest.' }]);
    const boxes = toasts.map(rect);
    const gap = resolvedPx('--nph-toast-region-gap');
    expect(gap).toBe(16);
    expect(boxes[0]?.bottom).toBeLessThan(boxes[1]?.top as number);
    expect((boxes[1]?.top as number) - (boxes[0]?.bottom as number)).toBeCloseTo(gap, 1);
    expect((boxes[2]?.top as number) - (boxes[1]?.bottom as number)).toBeCloseTo(gap, 1);
  });

  it('the newest sits next to the corner, and a new toast enters at the bottom while the others move up', async () => {
    const { region, toasts } = await mount([{ description: 'Old.' }]);
    const before = rect(toasts[0] as NphNotification).top;
    const entering = await add(region, { description: 'New.' });
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(rect(entering).bottom).toBeCloseTo(document.documentElement.clientHeight - resolvedPx('--nph-toast-region-inset'), 0);
    expect(rect(toasts[0] as NphNotification).top).toBeLessThan(before);
  });

  it('aligns toasts of different widths by the end edge', async () => {
    const { toasts } = await mount([{ description: 'Stacked.' }, { description: 'One line.', layout: 'single-line' }]);
    const [stacked, single] = toasts as [NphNotification, NphNotification];
    expect(rect(single).width).toBeCloseTo(resolvedPx('--nph-notification-toast-width-max'), 1);
    expect(rect(stacked).width).toBeLessThan(rect(single).width);
    expect(rect(stacked).right).toBeCloseTo(rect(single).right, 1);
  });

  it('only space between toasts: the region has no divider, background, border, shadow or radius', async () => {
    const { region } = await mount([{}, {}]);
    const style = getComputedStyle(list(region));
    expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(style.borderTopWidth).toBe('0px');
    expect(style.boxShadow).toBe('none');
    expect(style.borderTopLeftRadius).toBe('0px');
    expect(style.overflow).toBe('visible');
    expect(style.paddingTop).toBe('0px');
  });

  it('in right-to-left writing the end edge is the left one', async () => {
    document.documentElement.dir = 'rtl';
    try {
      const { region } = await mount([{}]);
      expect(rect(list(region)).left).toBeCloseTo(resolvedPx('--nph-toast-region-inset'), 1);
    } finally {
      document.documentElement.dir = '';
    }
  });
});

describe('the compact screen, below 768 px', () => {
  it('takes the base from side to side, toast-region/inset-compact from the bottom and from each side', async () => {
    await page.viewport(375, 667);
    const { region, toasts } = await mount([{}, { severity: 'success' }, { severity: 'error', action: 'Choose another' }]);
    const inset = resolvedPx('--nph-toast-region-inset-compact');
    expect(inset).toBe(16);
    const box = rect(list(region));
    expect(box.left).toBeCloseTo(inset, 1);
    expect(box.right).toBeCloseTo(375 - inset, 1);
    expect(box.bottom).toBeCloseTo(667 - inset, 1);
    for (const toast of toasts) expect(rect(toast).width).toBeCloseTo(375 - 2 * inset, 1);
  });

  it('the toast takes the width of the region even below 320 px, and does not stretch past 392 px', async () => {
    await page.viewport(300, 600);
    const narrow = await mount([{}]);
    expect(rect(narrow.toasts[0] as NphNotification).width).toBeCloseTo(300 - 2 * resolvedPx('--nph-toast-region-inset-compact'), 1);
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(300);
    document.body.replaceChildren();
    await page.viewport(700, 600);
    const wide = await mount([{}]);
    expect(rect(wide.toasts[0] as NphNotification).width).toBeCloseTo(700 - 2 * resolvedPx('--nph-toast-region-inset-compact'), 1);
  });

  it('from 768 px it is the default screen again', async () => {
    await page.viewport(768, 600);
    const { region } = await mount([{}]);
    expect(rect(list(region)).right).toBeCloseTo(768 - resolvedPx('--nph-toast-region-inset'), 1);
  });
});

describe('the limit of three and the queue (item 4)', () => {
  it('shows three toasts and holds the fourth hidden, inert, in order of arrival', async () => {
    const { toasts } = await mount([{ description: 'A.' }, { description: 'B.' }, { description: 'C.' }, { description: 'D.' }, { description: 'E.' }]);
    for (const toast of toasts.slice(0, 3)) {
      expect(toast.hidden).toBe(false);
      expect(toast.inert).toBe(false);
      expect(toast.hasAttribute('data-nph-queued')).toBe(false);
    }
    for (const toast of toasts.slice(3)) {
      expect(toast.hidden).toBe(true);
      expect(toast.inert).toBe(true);
      expect(toast.hasAttribute('data-nph-queued')).toBe(true);
      expect(rect(toast).height).toBe(0);
    }
  });

  it('does not announce a queued toast until it comes into view', async () => {
    const { region, toasts } = await mount([{ description: 'A.' }, { description: 'B.' }, { description: 'C.' }, { description: 'D.' }]);
    await announced(region, 'polite', 'C.');
    expect(live(region, 'polite').textContent).not.toContain('D.');
    closeToast(toasts[0] as NphNotification);
    await vi.waitFor(() => expect(toasts[3]?.hidden).toBe(false));
    await announced(region, 'polite', 'D.');
  });

  it('a toast that leaves lets the next one in, once the exit is over', async () => {
    const { toasts } = await mount([{}, {}, {}, { description: 'Fourth.' }]);
    closeToast(toasts[1] as NphNotification);
    /* While the toast leaves it keeps its place: never four in view. */
    await Promise.resolve();
    expect(toasts[3]?.hidden).toBe(true);
    await vi.waitFor(() => expect(toasts[3]?.hidden).toBe(false));
    expect(toasts[1]?.hasAttribute('data-nph-leaving')).toBe(false);
    expect(toasts.filter((toast) => rect(toast).height > 0)).toHaveLength(2 + 1);
  });

  it('a toast removed by the application lets the next one in at once', async () => {
    const { region, toasts } = await mount([{}, {}, {}, { description: 'Fourth.' }]);
    toasts[0]?.remove();
    await settle(region);
    expect(toasts[3]?.hidden).toBe(false);
    expect(toasts[3]?.inert).toBe(false);
  });

  it('the countdown of a queued toast starts when it comes into view', async () => {
    vi.useFakeTimers(FAKE);
    const { region, toasts } = await mount([{ duration: 0 }, { duration: 0 }, { duration: 0 }, { description: 'Fourth.' }]);
    const closed: string[] = [];
    region.addEventListener('nph-close', () => closed.push('close'));
    await vi.advanceTimersByTimeAsync(20000);
    expect(closed).toEqual([]);
    toasts[0]?.remove();
    await settle(region);
    await vi.advanceTimersByTimeAsync(5900);
    expect(closed).toEqual([]);
    await vi.advanceTimersByTimeAsync(200);
    expect(closed).toEqual(['close']);
  });

  it('with three toasts that do not close by themselves, the fourth waits for the person to close one', async () => {
    vi.useFakeTimers(FAKE);
    const { toasts } = await mount([{ severity: 'error' }, { severity: 'error' }, { severity: 'error' }, { severity: 'error' }]);
    await vi.advanceTimersByTimeAsync(60000);
    expect(toasts[3]?.hidden).toBe(true);
  });

  it('a toast shown again after it closed takes its place back', async () => {
    const { region, toasts } = await mount([{}]);
    const toast = toasts[0] as NphNotification;
    closeToast(toast);
    await vi.waitFor(() => expect(toast.hasAttribute('data-nph-leaving')).toBe(true));
    await vi.waitFor(() => expect(toast.hasAttribute('data-nph-leaving')).toBe(false));
    expect(toast.hidden).toBe(true);
    /* The application shows it again; the region looks at it again on the next arrival. */
    toast.hidden = false;
    await add(region, { description: 'Next.' });
    expect(toast.inert).toBe(false);
    expect(rect(toast).height).toBeGreaterThan(0);
  });
});

describe('time: the pause of every toast (items 6 and 7)', () => {
  const advance = async (region: NphToastRegion, ms: number): Promise<void> => {
    await vi.advanceTimersByTimeAsync(ms);
    await settle(region);
  };

  it('the pointer on the region pauses every toast together, and they go on with what was left', async () => {
    vi.useFakeTimers(FAKE);
    const { region, toasts } = await mount([{}, {}]);
    const closed: Element[] = [];
    region.addEventListener('nph-close', (event) => closed.push(event.target as Element));
    await advance(region, 4000);
    list(region).dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }));
    await advance(region, 60000);
    expect(closed).toEqual([]);
    expect(toasts.every((toast) => toast.paused)).toBe(true);
    list(region).dispatchEvent(new PointerEvent('pointerleave', { pointerType: 'mouse' }));
    await advance(region, 1900);
    expect(closed).toEqual([]);
    await advance(region, 200);
    expect(closed).toHaveLength(2);
  });

  it('a touch does not pause the region', async () => {
    vi.useFakeTimers(FAKE);
    const { region, toasts } = await mount([{}]);
    list(region).dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'touch' }));
    expect(toasts[0]?.paused).toBe(false);
  });

  it('the focus inside one toast pauses all of them', async () => {
    vi.useFakeTimers(FAKE);
    const { region, toasts } = await mount([{}, {}]);
    controls(toasts[1] as NphNotification)[0]?.focus();
    await advance(region, 1);
    expect(toasts.every((toast) => toast.paused)).toBe(true);
    controls(toasts[1] as NphNotification)[0]?.blur();
    await advance(region, 1);
    expect(toasts.every((toast) => !toast.paused)).toBe(true);
  });

  it('with a modal dialog open the countdown of every toast is suspended, and goes on when it closes', async () => {
    vi.useFakeTimers(FAKE);
    const { region, toasts } = await mount([{}, {}]);
    const closed: Element[] = [];
    region.addEventListener('nph-close', (event) => closed.push(event.target as Element));
    await advance(region, 3000);
    const dialog = document.createElement('nph-dialog') as NphDialog;
    dialog.setAttribute('heading', 'Delete the project?');
    dialog.setAttribute('close-label', CLOSE);
    document.body.append(dialog);
    await dialog.updateComplete;
    dialog.open = true;
    await dialog.updateComplete;
    await advance(region, 60000);
    expect(closed).toEqual([]);
    expect(toasts.every((toast) => toast.paused)).toBe(true);
    dialog.open = false;
    await dialog.updateComplete;
    await advance(region, 2900);
    expect(closed).toEqual([]);
    await advance(region, 200);
    expect(closed).toHaveLength(2);
  });
});

describe('the modal dialog (item 7)', () => {
  async function openDialog(): Promise<NphDialog> {
    const dialog = document.createElement('nph-dialog') as NphDialog;
    dialog.setAttribute('heading', 'Delete the project?');
    dialog.setAttribute('close-label', CLOSE);
    dialog.append(Object.assign(document.createElement('p'), { textContent: 'The files will be deleted.' }));
    document.body.append(dialog);
    await dialog.updateComplete;
    dialog.open = true;
    await dialog.updateComplete;
    await vi.waitFor(() => expect(dialog.shadowRoot?.querySelector('dialog')?.matches(':modal')).toBe(true));
    return dialog;
  }

  it('stays in view below the scrim, with no click and no focus, until the dialog closes', async () => {
    const { region, toasts } = await mount([{ action: 'Choose another', severity: 'error' }]);
    const dialog = await openDialog();
    const box = rect(toasts[0] as NphNotification);
    expect(box.height).toBeGreaterThan(0);
    const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
    expect(hit === toasts[0] || hit === region || toasts[0]?.contains(hit)).toBe(false);
    controls(toasts[0] as NphNotification)[0]?.focus();
    expect(inside(toasts[0] as NphNotification)).toBe(false);
    dialog.open = false;
    await dialog.updateComplete;
    await vi.waitFor(() => expect(dialog.shadowRoot?.querySelector('dialog')?.open).toBe(false));
    controls(toasts[0] as NphNotification)[0]?.focus();
    expect(inside(toasts[0] as NphNotification)).toBe(true);
  });

  it('a toast that arrives with the dialog open is shown in the region and announced inside the dialog', async () => {
    const { region } = await mount([]);
    const dialog = await openDialog();
    const wrapper = dialog.querySelector('[data-nph-toast-region-live]');
    expect(wrapper).not.toBeNull();
    const toast = await add(region, { severity: 'error', heading: 'Upload failed', description: 'The file is over the allowed size.' });
    expect(rect(toast).height).toBeGreaterThan(0);
    await vi.waitFor(() =>
      expect(wrapper?.querySelector('[data-live="assertive"]')?.textContent).toContain('Upload failed. The file is over the allowed size.'),
    );
    expect(live(region, 'assertive').textContent).toBe('');
    dialog.open = false;
    await dialog.updateComplete;
    await vi.waitFor(() => expect(dialog.querySelector('[data-nph-toast-region-live]')).toBeNull());
  });

  it('is connected before the dialog opens, so the dialog goes above it in the top layer', async () => {
    const { region } = await mount([{}]);
    const dialog = await openDialog();
    expect(list(region).matches(':popover-open')).toBe(true);
    expect(dialog.shadowRoot?.querySelector('dialog')?.matches(':modal')).toBe(true);
  });
});

describe('keyboard and focus (item 8)', () => {
  it('F6 takes the focus to the first control of the newest toast that has one, and F6 again returns it', async () => {
    const { toasts } = await mount([{ action: 'Choose another', severity: 'error' }, { severity: 'loading', description: 'Saving…' }]);
    const origin = document.createElement('button');
    origin.textContent = 'Origin';
    document.body.append(origin);
    origin.focus();
    await press('F6');
    /* The newest toast is loading, with no control: the one before it has the action. */
    expect(inside(toasts[0] as NphNotification)).toBe(true);
    await press('F6');
    expect(deepActive()).toBe(origin);
  });

  it('Tab and Shift+Tab go through the controls of the toasts, in the order of the page', async () => {
    const { toasts } = await mount([{ action: 'Retry', severity: 'error' }, { description: 'Second.' }]);
    await press('F6');
    expect(inside(toasts[1] as NphNotification)).toBe(true);
    await userEvent.tab({ shift: true });
    expect(inside(toasts[0] as NphNotification)).toBe(true);
    await userEvent.tab();
    expect(inside(toasts[1] as NphNotification)).toBe(true);
  });

  it('does not take the focus by itself when a toast arrives', async () => {
    const origin = document.createElement('button');
    document.body.append(origin);
    origin.focus();
    const { region } = await mount([]);
    await add(region, { severity: 'error', action: 'Retry' });
    expect(deepActive()).toBe(origin);
  });

  it('F6 with no toast that has a control does nothing', async () => {
    await mount([{ severity: 'loading', description: 'Saving…' }, { hideClose: true }]);
    const origin = document.createElement('button');
    document.body.append(origin);
    origin.focus();
    const event = new KeyboardEvent('keydown', { key: 'F6', bubbles: true, cancelable: true });
    document.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(deepActive()).toBe(origin);
  });

  it('F6 is left alone while a modal dialog is open', async () => {
    await mount([{}]);
    const dialog = document.createElement('nph-dialog') as NphDialog;
    dialog.setAttribute('heading', 'Title');
    dialog.setAttribute('close-label', CLOSE);
    document.body.append(dialog);
    await dialog.updateComplete;
    dialog.open = true;
    await dialog.updateComplete;
    await vi.waitFor(() => expect(dialog.shadowRoot?.querySelector('dialog')?.matches(':modal')).toBe(true));
    const event = new KeyboardEvent('keydown', { key: 'F6', bubbles: true, cancelable: true });
    document.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });

  it('Esc with the focus in a toast closes that toast, with the source escape', async () => {
    const { region, toasts } = await mount([{ description: 'Old.', hideClose: true, action: 'Undo' }, { description: 'New.', action: 'Undo' }]);
    const sources: string[] = [];
    region.addEventListener('nph-close', (event) => sources.push(`${(event.target as Element).getAttribute('description') ?? ''}:${(event as CustomEvent<NphNotificationCloseDetail>).detail.source}`));
    await press('F6');
    expect(inside(toasts[1] as NphNotification)).toBe(true);
    await press('Escape');
    expect(sources).toEqual(['New.:escape']);
    expect(toasts[1]?.hidden).toBe(true);
    expect(toasts[0]?.hidden).toBe(false);
  });

  it('with the focus on the icon-only close, the first Esc closes the tooltip balloon and the second closes the toast', async () => {
    const { toasts } = await mount([{ description: 'Only.' }]);
    const sources: string[] = [];
    document.addEventListener('nph-close', (event) => sources.push((event as CustomEvent<NphNotificationCloseDetail>).detail.source));
    await press('F6');
    expect(inside(toasts[0] as NphNotification)).toBe(true);
    await press('Escape');
    expect(sources).toEqual([]);
    await press('Escape');
    expect(sources).toEqual(['escape']);
  });

  it('Esc outside the region closes no toast', async () => {
    const { toasts } = await mount([{}]);
    const outside = document.createElement('button');
    document.body.append(outside);
    outside.focus();
    await press('Escape');
    expect(toasts[0]?.hidden).toBe(false);
  });

  it('when the toast that had the focus leaves, the focus goes to the next toast with a control', async () => {
    const { region, toasts } = await mount([{ description: 'Old.' }, { description: 'New.', action: 'Undo' }]);
    await press('F6');
    expect(inside(toasts[1] as NphNotification)).toBe(true);
    await press('Escape');
    await vi.waitFor(() => expect(inside(toasts[0] as NphNotification)).toBe(true));
    expect(region.isConnected).toBe(true);
  });

  it('with no other toast that has a control, the focus goes back to where it came from', async () => {
    const origin = document.createElement('button');
    document.body.append(origin);
    origin.focus();
    const { toasts } = await mount([{ description: 'Only.' }]);
    await press('F6');
    expect(inside(toasts[0] as NphNotification)).toBe(true);
    await press('Escape');
    await press('Escape');
    await vi.waitFor(() => expect(deepActive()).toBe(origin));
  });

  it('a toast removed by the application with the focus in it sends the focus on, too', async () => {
    const origin = document.createElement('button');
    document.body.append(origin);
    origin.focus();
    const { region, toasts } = await mount([{ description: 'Only.' }]);
    await press('F6');
    toasts[0]?.remove();
    await settle(region);
    await vi.waitFor(() => expect(deepActive()).toBe(origin));
  });

  it('the region itself takes no focus and has no ring', async () => {
    const { region } = await mount([{}]);
    expect(list(region).hasAttribute('tabindex')).toBe(false);
    expect(getComputedStyle(list(region)).outlineStyle).toBe('none');
  });
});

describe('motion', () => {
  it('the toast enters in toast-region/enter-duration and leaves in toast-region/exit-duration, with opacity and transform only', async () => {
    const { region, toasts } = await mount([{}]);
    const style = getComputedStyle(toasts[0] as NphNotification);
    expect(style.animationDuration).toBe(resolvedTime('--nph-toast-region-enter-duration'));
    expect(style.animationName).toBe('nph-toast-region-enter');
    closeToast(toasts[0] as NphNotification);
    await Promise.resolve();
    await Promise.resolve();
    const leaving = getComputedStyle(toasts[0] as NphNotification);
    expect(toasts[0]?.hasAttribute('data-nph-leaving')).toBe(true);
    expect(leaving.animationDuration).toBe(resolvedTime('--nph-toast-region-exit-duration'));
    expect(leaving.animationName).toBe('nph-toast-region-exit');
    /* Shown again for the exit, though the toast hid itself. */
    expect(leaving.display).toBe('block');
    expect(region.contains(toasts[0] as NphNotification)).toBe(true);
    await vi.waitFor(() => expect(toasts[0]?.hasAttribute('data-nph-leaving')).toBe(false));
    expect(getComputedStyle(toasts[0] as NphNotification).display).toBe('none');
  });

  it('the keyframes animate only opacity and transform', () => {
    const frames = componentCss.match(/@keyframes [\w-]+ \{[\s\S]*?\n\}/g) ?? [];
    expect(frames).toHaveLength(4);
    for (const frame of frames) {
      const properties = [...frame.matchAll(/^\s{4}([a-z-]+):/gm)].map((match) => match[1]);
      expect(properties.every((property) => property === 'opacity' || property === 'transform')).toBe(true);
    }
  });

  it('with reduced motion the slide becomes only opacity, in motion/hover-duration', () => {
    const block = componentCss.slice(componentCss.indexOf('@media (prefers-reduced-motion: reduce)'));
    expect(block).toContain('nph-toast-region-fade-in');
    expect(block).toContain('nph-toast-region-fade-out');
    expect(block).toContain('var(--nph-motion-hover-duration)');
    expect(block).not.toContain('translate');
  });
});

describe('a window lower than the stack (D-1)', () => {
  it('limits the list to the window height less the inset at the bottom and at the top, and scrolls it, kept at the bottom', async () => {
    await page.viewport(1024, 360);
    const { region, toasts } = await mount([
      { heading: 'One', action: 'Open' },
      { heading: 'Two', action: 'Open' },
      { heading: 'Three', action: 'Open' },
    ]);
    await vi.waitFor(() => expect(list(region).hasAttribute('data-scrolls')).toBe(true));
    const inset = resolvedPx('--nph-toast-region-inset');
    const box = rect(list(region));
    expect(box.height).toBeLessThanOrEqual(360 - 2 * inset + 0.5);
    expect(getComputedStyle(list(region)).overflowY).toBe('auto');
    await vi.waitFor(() => {
      const element = list(region);
      expect(element.scrollTop + element.clientHeight).toBeGreaterThanOrEqual(element.scrollHeight - 1);
    });
    expect(rect(toasts[2] as NphNotification).bottom).toBeLessThanOrEqual(360 - inset + 0.5);
  });

  it('the list takes the focus only while it scrolls, and F6 with no control goes to it', async () => {
    await page.viewport(1024, 260);
    const { region } = await mount([
      { severity: 'loading', description: 'Saving…' },
      { severity: 'loading', description: 'Sending…' },
      { severity: 'loading', description: 'Uploading…' },
    ]);
    await vi.waitFor(() => expect(list(region).getAttribute('tabindex')).toBe('0'));
    await press('F6');
    expect(root(region).activeElement).toBe(list(region));
    await press('F6');
    expect(root(region).activeElement).toBeNull();
    await page.viewport(1024, 768);
    await vi.waitFor(() => expect(list(region).hasAttribute('tabindex')).toBe(false));
    expect(list(region).hasAttribute('data-scrolls')).toBe(false);
  });

  it('while the stack fits, nothing scrolls and nothing clips the shadow of the toasts', async () => {
    const { region } = await mount([{}, {}, {}]);
    expect(list(region).hasAttribute('data-scrolls')).toBe(false);
    expect(getComputedStyle(list(region)).overflowY).toBe('visible');
  });
});

describe('the focus ring comes out whole', () => {
  it('nothing in the toast or in the region clips the focus ring of the action and of the close', async () => {
    const { region, toasts } = await mount([{ severity: 'error', action: 'Choose another' }]);
    expect(getComputedStyle(list(region)).overflow).toBe('visible');
    const toast = toasts[0] as NphNotification;
    for (const selector of ['.body', '.text', '.actions', '.close']) {
      const element = toast.shadowRoot?.querySelector(selector);
      if (element !== null && element !== undefined) expect(getComputedStyle(element).overflow, selector).toBe('visible');
    }
    /* The only `overflow` of the toast is the hidden twin that measures the text. */
    expect(notificationCss.match(/overflow\s*:\s*hidden/g) ?? []).toHaveLength(1);
    expect(notificationCss.slice(notificationCss.indexOf('.probe-box'))).toContain('overflow: hidden');
  });

  it('the action takes the focus ring whole inside the region', async () => {
    const { toasts } = await mount([{ severity: 'error', action: 'Choose another' }]);
    await press('F6');
    const action = controls(toasts[0] as NphNotification)[0] as HTMLElement;
    expect(action.shadowRoot?.activeElement).not.toBeNull();
    const toastBox = rect(toasts[0] as NphNotification);
    const buttonBox = rect(action);
    const room = resolvedPx('--nph-focus-ring-width') + resolvedPx('--nph-border-width');
    expect(buttonBox.left - toastBox.left).toBeGreaterThanOrEqual(room);
    expect(toastBox.bottom - buttonBox.bottom).toBeGreaterThanOrEqual(room);
  });
});

describe('the token contract of the CSS', () => {
  const tokens = [
    '--nph-toast-region-gap',
    '--nph-toast-region-inset',
    '--nph-toast-region-inset-compact',
    '--nph-toast-region-enter-duration',
    '--nph-toast-region-exit-duration',
    '--nph-motion-enter-easing',
    '--nph-motion-exit-easing',
    '--nph-motion-hover-duration',
  ];

  it('reads every token of the contract', () => {
    for (const token of tokens) expect(componentCss, token).toContain(`var(${token})`);
  });

  it('reads no core, theme or notification token, and no stack-gap', () => {
    const used = [...componentCss.matchAll(/var\((--nph-[\w-]+)/g)].map((match) => match[1] as string);
    expect(used.filter((token) => /^--nph-(core|theme)-/.test(token))).toEqual([]);
    expect(used.filter((token) => token.startsWith('--nph-notification-'))).toEqual([]);
    expect(used).not.toContain('--nph-notification-stack-gap');
  });

  it('uses no z-index and no layer token: the region is in the top layer', () => {
    expect(componentCss).not.toMatch(/z-index/);
    expect(componentCss).not.toMatch(/--nph-[\w-]*layer/);
  });

  it('writes no literal color, spacing, radius, shadow or duration', () => {
    const code = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
    expect(code).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(code).not.toMatch(/\brgba?\(/);
    const lengths = [...code.matchAll(/(?<![\w-])-?\d*\.?\d+(px|ms|s|em)\b/g)].map((match) => match[0]);
    expect(lengths).toEqual([]);
  });

  it('the only literal breakpoint is the md one, written in rem', () => {
    expect(componentCss.match(/@media \(width < [^)]+\)/g)).toEqual(['@media (width < 48rem)']);
  });
});
