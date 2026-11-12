/**
 * Tests of `nph-file-upload-item` (P119), in a real browser (P21, item 5): hover, keyboard focus, the
 * stretched click area and the measures of each state only exist where there is layout.
 *
 * They prove the contract accepted in Figma (documentation frame `5311:8328`, set `5298:7669`),
 * recorded in the evidence of the `figma-docs-accepted` gate of DSA-74: the API, the invalid input, the
 * lines of each status, the colors and measures of each state, the link of a saved file and its ring,
 * the names of the buttons, the events and the disabled item.
 */
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MockInstance } from 'vitest';
import { userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import componentCss from './nph-file-upload-item.css?raw';
import {
  NPH_FILE_UPLOAD_ITEM_KINDS,
  NPH_FILE_UPLOAD_ITEM_SIZES,
  NPH_FILE_UPLOAD_ITEM_STATUSES,
  NphFileUploadItem,
  fill,
  formatBytes,
  formatOf,
  isSafeFileHref,
} from './nph-file-upload-item';
import type { NphFileUploadRemoveDetail, NphFileUploadRetryDetail } from './nph-file-upload-item';

beforeAll(async () => {
  await document.fonts.load('400 12px "Noto Sans"');
  await document.fonts.load('500 14px "Noto Sans"');
  await document.fonts.ready;
});

/** The listeners a test puts on the page; aborted at the end of each test, so none leaks into the next. */
let listeners = new AbortController();

let errors: MockInstance<typeof console.error>;
let warnings: MockInstance<typeof console.warn>;

beforeEach(() => {
  errors = vi.spyOn(console, 'error').mockImplementation(() => {});
  warnings = vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(async () => {
  await userEvent.unhover(document.body).catch(() => {});
  listeners.abort();
  listeners = new AbortController();
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

const TEXTS = {
  uploadingText: 'Uploading · {progress}%',
  sentText: 'Sent',
  doneText: 'Saved',
  retryText: 'Try again',
  removeLabel: 'Remove {name}',
  cancelLabel: 'Cancel upload of {name}',
};

const NAME = 'annual-report-2026.pdf';

async function mount(props: Partial<NphFileUploadItem> = {}, width = '30rem'): Promise<NphFileUploadItem> {
  const holder = document.createElement('div');
  holder.style.inlineSize = width;
  const item = document.createElement('nph-file-upload-item');
  Object.assign(item, { name: NAME, bytes: 2_400_000, fileId: 'one', lang: 'en', ...TEXTS, ...props });
  holder.append(item);
  document.body.append(holder);
  await settle(item);
  return item;
}

async function settle(item: NphFileUploadItem): Promise<void> {
  await item.updateComplete;
  for (const inner of item.shadowRoot?.querySelectorAll('nph-icon, nph-button, nph-spinner, nph-image') ?? []) {
    await (inner as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
  }
  await frame();
  await item.updateComplete;
}

const root = (item: NphFileUploadItem): ShadowRoot => item.shadowRoot as ShadowRoot;
const row = (item: NphFileUploadItem): HTMLElement => root(item).querySelector('.item') as HTMLElement;
const part = (item: NphFileUploadItem, selector: string): HTMLElement | null => root(item).querySelector<HTMLElement>(selector);
const frame = (): Promise<void> => new Promise((resolve) => requestAnimationFrame(() => resolve()));

function resolved(property: string, token: string): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  document.body.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

const px = (token: string): number => Number.parseFloat(resolved('width', token));
const color = (token: string): string => resolved('color', token);
const background = (token: string): string => resolved('background-color', token);
const borderColor = (token: string): string => resolved('border-top-color', token);

/** The events the item fires, collected until the end of the test. */
function collect<T>(item: NphFileUploadItem, type: string): T[] {
  const seen: T[] = [];
  item.addEventListener(type, (event) => seen.push((event as CustomEvent<T>).detail), { signal: listeners.signal });
  return seen;
}

/** The text of a part, with the whitespace of the template taken out. */
const textOf = (element: Element | null): string => (element?.textContent ?? '').replace(/\s+/g, ' ').trim();

describe('registration and defaults', () => {
  it('defines nph-file-upload-item exactly once', () => {
    expect(customElements.get('nph-file-upload-item')).toBe(NphFileUploadItem);
  });

  it('is ready with the file kind and the default size when nothing else is given', async () => {
    const item = await mount();
    expect(item.status).toBe('ready');
    expect(item.kind).toBe('file');
    expect(item.size).toBe('default');
    expect(item.hasAttribute('data-nph-rendered')).toBe(true);
    expect(row(item).dataset.status).toBe('ready');
  });

  it('lists the statuses, the kinds and the sizes of the contract', () => {
    expect(NPH_FILE_UPLOAD_ITEM_STATUSES).toEqual(['ready', 'uploading', 'sent', 'error', 'done']);
    expect(NPH_FILE_UPLOAD_ITEM_KINDS).toEqual(['file', 'image']);
    expect(NPH_FILE_UPLOAD_ITEM_SIZES).toEqual(['default', 'large']);
  });

  it('reflects disabled, because the consumer styles and checks it', async () => {
    const item = await mount({ disabled: true });
    expect(item.hasAttribute('disabled')).toBe(true);
  });
});

describe('the lines of the item', () => {
  it('writes the name on one line and the format and the size on the next, as "PDF · 2.4 MB"', async () => {
    const item = await mount();
    expect(textOf(part(item, '.name'))).toBe(NAME);
    expect(textOf(part(item, '.meta'))).toBe('PDF · 2.4 MB');
    expect(part(item, '.status')).toBeNull();
  });

  it('takes the format from the extension in capitals, and an explicit format wins', async () => {
    expect(textOf(part(await mount({ name: 'photo.JPG', bytes: null }), '.meta'))).toBe('JPG');
    expect(textOf(part(await mount({ format: 'Document' }), '.meta'))).toBe('Document · 2.4 MB');
  });

  it('writes the size in the language of the element', async () => {
    const item = await mount({ lang: 'pt-BR' });
    expect(textOf(part(item, '.meta'))).toBe('PDF · 2,4 MB');
  });

  it('draws no second line when neither the format nor the size is known', async () => {
    const item = await mount({ name: 'README', bytes: null });
    expect(part(item, '.meta')).toBeNull();
  });

  it('cuts the name on one line with an ellipsis and keeps the whole name in the title', async () => {
    const long = `${'annual-report-'.repeat(8)}2026.pdf`;
    const item = await mount({ name: long }, '24rem');
    const name = part(item, '.name') as HTMLElement;
    const style = getComputedStyle(name);
    expect(style.whiteSpace).toBe('nowrap');
    expect(style.textOverflow).toBe('ellipsis');
    expect(name.scrollWidth).toBeGreaterThan(name.clientWidth);
    expect(name.getAttribute('title')).toBe(long);
    expect(item.getBoundingClientRect().height).toBe(row(item).getBoundingClientRect().height);
  });

  it('uploads with the spinner and "Uploading · 64%", with the progress in a progressbar', async () => {
    const item = await mount({ status: 'uploading', progress: 64 });
    const status = part(item, '.status') as HTMLElement;
    expect(textOf(status)).toBe('Uploading · 64%');
    expect(status.querySelector('nph-spinner')?.getAttribute('size')).toBe('sm');
    expect(status.getAttribute('role')).toBe('progressbar');
    expect(status.getAttribute('aria-valuenow')).toBe('64');
    expect(status.getAttribute('aria-valuemin')).toBe('0');
    expect(status.getAttribute('aria-valuemax')).toBe('100');
    expect(status.getAttribute('aria-valuetext')).toBe('Uploading · 64%');
    expect(status.getAttribute('aria-label')).toBe(NAME);
  });

  it('shows the progress as a whole number', async () => {
    const item = await mount({ status: 'uploading', progress: 63.6 });
    expect(textOf(part(item, '.status'))).toBe('Uploading · 64%');
  });

  it('says sent with the circle-check, and done with the circle-check and its word', async () => {
    const sent = await mount({ status: 'sent' });
    expect(textOf(part(sent, '.status'))).toBe('Sent');
    expect(part(sent, '.status nph-icon')?.getAttribute('name')).toBe('circle-check');
    const done = await mount({ status: 'done', href: '/files/one.pdf' });
    expect(textOf(part(done, '.status'))).toBe('Saved');
    expect(part(done, '.status nph-icon')?.getAttribute('name')).toBe('circle-check');
  });

  it('says the reason of the error with the circle-xmark and offers "Try again"', async () => {
    const item = await mount({ status: 'error', reason: 'Network failure while uploading.' });
    expect(textOf(part(item, '.status'))).toBe('Network failure while uploading.');
    expect(part(item, '.status nph-icon')?.getAttribute('name')).toBe('circle-xmark');
    const retry = part(item, '.retry') as HTMLElement;
    expect(retry.getAttribute('text')).toBe('Try again');
    expect(retry.getAttribute('icon-start')).toBe('rotate-right');
    expect(retry.getAttribute('severity')).toBe('secondary');
    expect(retry.getAttribute('emphasis')).toBe('ghost');
  });

  it('has "Try again" only on error', async () => {
    for (const status of ['ready', 'sent', 'done'] as const) {
      expect(part(await mount({ status, href: '/f.pdf' }), '.retry'), status).toBeNull();
    }
    expect(part(await mount({ status: 'uploading', progress: 10 }), '.retry')).toBeNull();
  });

  it('keeps the decorative icons out of the screen reader', async () => {
    const item = await mount({ status: 'error', reason: 'Too big.' });
    expect(part(item, '.box')?.getAttribute('aria-hidden')).toBe('true');
    for (const icon of root(item).querySelectorAll('.status nph-icon')) {
      expect(icon.getAttribute('label') ?? '').toBe('');
    }
  });
});

describe('the box: the icon of the kind or the thumbnail', () => {
  it('draws file-lines light at 16 in the file kind', async () => {
    const item = await mount();
    const icon = part(item, '.box nph-icon') as HTMLElement;
    expect(icon.getAttribute('name')).toBe('file-lines');
    expect(icon.getAttribute('variant')).toBe('light');
    expect(icon.getAttribute('size')).toBe('sm');
  });

  it('draws the thumbnail in nph-image sm, with no alt, in the image kind', async () => {
    const item = await mount({ kind: 'image', thumbnail: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=' });
    const image = part(item, '.box nph-image') as HTMLElement;
    expect(image.getAttribute('size')).toBe('sm');
    expect(image.getAttribute('src')).toContain('data:image/gif');
    expect(image.getAttribute('alt')).toBeNull();
    expect(part(item, '.box nph-icon')).toBeNull();
    expect(getComputedStyle(part(item, '.box') as HTMLElement).backgroundColor).toBe('rgba(0, 0, 0, 0)');
  });

  it('follows an override of file-upload-item/thumbnail-size: the box and the thumbnail change together, with the corner of the image', async () => {
    const item = await mount({ kind: 'image', thumbnail: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=' });
    item.style.setProperty('--nph-file-upload-item-thumbnail-size', '48px');
    await settle(item);
    const box = (part(item, '.box') as HTMLElement).getBoundingClientRect();
    const image = (part(item, '.box nph-image') as HTMLElement).getBoundingClientRect();
    expect([box.width, box.height]).toEqual([48, 48]);
    expect([image.width, image.height]).toEqual([48, 48]);
    const host = part(item, '.box nph-image') as HTMLElement;
    expect(getComputedStyle(host).borderTopLeftRadius).toBe(resolved('width', '--nph-image-radius-sm'));
  });

  it('draws file-image while an image has no thumbnail yet', async () => {
    const item = await mount({ kind: 'image' });
    expect(part(item, '.box nph-icon')?.getAttribute('name')).toBe('file-image');
    expect(part(item, '.box nph-image')).toBeNull();
  });

  it('measures the box at image/size-sm with the corner of file-upload-item/thumbnail-radius', async () => {
    const item = await mount();
    const box = part(item, '.box') as HTMLElement;
    const rect = box.getBoundingClientRect();
    expect(rect.width).toBe(px('--nph-file-upload-item-thumbnail-size'));
    expect(rect.height).toBe(px('--nph-file-upload-item-thumbnail-size'));
    expect(getComputedStyle(box).borderTopLeftRadius).toBe(resolved('width', '--nph-file-upload-item-thumbnail-radius'));
  });
});

describe('the surfaces of each status', () => {
  const CASES = [
    ['ready', {}, '--nph-file-upload-item-background', '--nph-file-upload-item-border'],
    ['uploading', { progress: 64 }, '--nph-file-upload-item-background-uploading', '--nph-file-upload-item-border-uploading'],
    ['sent', {}, '--nph-file-upload-item-background-success', '--nph-file-upload-item-border-success'],
    ['error', { reason: 'No.' }, '--nph-file-upload-item-background-error', '--nph-file-upload-item-border-error'],
    ['done', { href: '/f.pdf' }, '--nph-file-upload-item-background-done', '--nph-file-upload-item-border-done'],
  ] as const;

  for (const [status, extra, back, border] of CASES) {
    it(`${status}: the row takes its own background and border`, async () => {
      const item = await mount({ status, ...extra });
      const style = getComputedStyle(row(item));
      expect(style.backgroundColor).toBe(background(back));
      expect(style.borderTopColor).toBe(borderColor(border));
      expect(style.borderTopWidth).toBe(resolved('width', '--nph-file-upload-item-border-width'));
    });
  }

  it('paints the box and its icon in the color of the state', async () => {
    const pairs = [
      ['uploading', { progress: 5 }, '--nph-file-upload-item-thumbnail-background-uploading', '--nph-file-upload-item-icon-foreground-uploading'],
      ['sent', {}, '--nph-file-upload-item-thumbnail-background-success', '--nph-file-upload-item-icon-foreground-success'],
      ['error', { reason: 'No.' }, '--nph-file-upload-item-thumbnail-background-error', '--nph-file-upload-item-icon-foreground-error'],
      ['ready', {}, '--nph-file-upload-item-thumbnail-background', '--nph-file-upload-item-icon-foreground'],
    ] as const;
    for (const [status, extra, back, icon] of pairs) {
      const item = await mount({ status, ...extra });
      const box = getComputedStyle(part(item, '.box') as HTMLElement);
      expect(box.backgroundColor, status).toBe(background(back));
      expect(box.color, status).toBe(color(icon));
    }
  });

  it('draws the box of a saved file with no background, in the neutral icon color', async () => {
    const item = await mount({ status: 'done', href: '/f.pdf' });
    const box = getComputedStyle(part(item, '.box') as HTMLElement);
    expect(box.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(box.color).toBe(color('--nph-file-upload-item-icon-foreground'));
  });

  it('writes the reason in the error color and the other statuses in the muted one', async () => {
    const error = await mount({ status: 'error', reason: 'No.' });
    expect(getComputedStyle(part(error, '.status-text') as HTMLElement).color).toBe(color('--nph-file-upload-item-error-foreground'));
    const sent = await mount({ status: 'sent' });
    expect(getComputedStyle(part(sent, '.status-text') as HTMLElement).color).toBe(color('--nph-file-upload-item-muted-foreground'));
    expect(getComputedStyle(part(sent, '.name') as HTMLElement).color).toBe(color('--nph-file-upload-item-foreground'));
  });

  it('has the heights of the contract: 66 while ready and 86 on an error of one line', async () => {
    const ready = await mount();
    expect(row(ready).getBoundingClientRect().height).toBe(66);
    const error = await mount({ status: 'error', reason: 'Network failure while uploading.' });
    expect(row(error).getBoundingClientRect().height).toBe(86);
  });

  it('lets the reason wrap and the item grow', async () => {
    const reason = 'The file is larger than the five megabytes this field accepts, choose a smaller one or compress it before sending.';
    const item = await mount({ status: 'error', reason }, '20rem');
    expect(row(item).getBoundingClientRect().height).toBeGreaterThan(86);
  });

  it('keeps the actions at the end, centered vertically, with "Try again" before the ×', async () => {
    const item = await mount({ status: 'error', reason: 'No.' });
    const retry = (part(item, '.retry') as HTMLElement).getBoundingClientRect();
    const remove = (part(item, '.remove') as HTMLElement).getBoundingClientRect();
    const box = row(item).getBoundingClientRect();
    expect(retry.right).toBeLessThanOrEqual(remove.left);
    expect(remove.right).toBeLessThan(box.right);
    expect(remove.left - retry.right).toBe(px('--nph-file-upload-item-actions-gap'));
    expect(Math.abs(remove.top + remove.height / 2 - (box.top + box.height / 2))).toBeLessThanOrEqual(1);
  });
});

describe('the remove button and its name', () => {
  it('is a real nph-button, icon only, secondary ghost, named "Remove X"', async () => {
    const item = await mount({ status: 'sent' });
    const remove = part(item, '.remove') as HTMLElement;
    expect(remove.getAttribute('icon-start')).toBe('xmark');
    expect(remove.getAttribute('severity')).toBe('secondary');
    expect(remove.getAttribute('emphasis')).toBe('ghost');
    expect(remove.getAttribute('label')).toBe(`Remove ${NAME}`);
    expect(remove.getAttribute('text')).toBeNull();
  });

  it('is named "Cancel upload of X" while uploading', async () => {
    const item = await mount({ status: 'uploading', progress: 10 });
    expect(part(item, '.remove')?.getAttribute('label')).toBe(`Cancel upload of ${NAME}`);
  });

  it('is in every status, and follows the size of the form', async () => {
    for (const status of ['ready', 'sent', 'error', 'done'] as const) {
      const item = await mount({ status, href: '/f.pdf', reason: 'No.' });
      expect(part(item, '.remove'), status).not.toBeNull();
    }
    const large = await mount({ size: 'large' });
    expect(part(large, '.remove')?.getAttribute('size')).toBe('large');
    expect((part(large, '.remove') as HTMLElement).getBoundingClientRect().height).toBe(px('--nph-control-height-large'));
  });

  it('is the accessible name the browser computes: the file name reaches the screen reader whole', async () => {
    const item = await mount({ status: 'sent' });
    const native = (part(item, '.remove') as HTMLElement).shadowRoot?.querySelector('button') as HTMLButtonElement;
    expect(native.getAttribute('aria-label')).toBe(`Remove ${NAME}`);
  });
});

describe('events', () => {
  it('fires nph-file-upload-remove with the id when the person clicks the ×, and nothing else', async () => {
    const item = await mount({ status: 'sent' });
    const seen = collect<NphFileUploadRemoveDetail>(item, 'nph-file-upload-remove');
    (part(item, '.remove') as HTMLElement).click();
    expect(seen).toEqual([{ id: 'one', cancel: false }]);
    expect(item.status).toBe('sent');
  });

  it('says it is a cancel while uploading', async () => {
    const item = await mount({ status: 'uploading', progress: 10 });
    const seen = collect<NphFileUploadRemoveDetail>(item, 'nph-file-upload-remove');
    (part(item, '.remove') as HTMLElement).click();
    expect(seen).toEqual([{ id: 'one', cancel: true }]);
  });

  it('fires nph-file-upload-retry with the id from "Try again"', async () => {
    const item = await mount({ status: 'error', reason: 'No.' });
    const seen = collect<NphFileUploadRetryDetail>(item, 'nph-file-upload-retry');
    (part(item, '.retry') as HTMLElement).click();
    expect(seen).toEqual([{ id: 'one' }]);
  });

  it('bubbles and crosses the shadow roots, so the page hears it from anywhere above', async () => {
    const item = await mount({ status: 'sent' });
    const heard: Event[] = [];
    document.body.addEventListener('nph-file-upload-remove', (event) => heard.push(event), { signal: listeners.signal });
    (part(item, '.remove') as HTMLElement).click();
    expect(heard).toHaveLength(1);
    expect(heard[0]?.bubbles).toBe(true);
    expect(heard[0]?.composed).toBe(true);
  });

  it('fires nothing when code sets the properties', async () => {
    const item = await mount({ status: 'sent' });
    const seen = collect(item, 'nph-file-upload-remove');
    const retried = collect(item, 'nph-file-upload-retry');
    item.status = 'error';
    item.reason = 'No.';
    await settle(item);
    expect(seen).toEqual([]);
    expect(retried).toEqual([]);
  });

  it('activates from the keyboard: Enter and Space on the ×', async () => {
    const item = await mount({ status: 'sent' });
    const seen = collect<NphFileUploadRemoveDetail>(item, 'nph-file-upload-remove');
    item.focusRemove();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(seen).toHaveLength(2);
  });
});

describe('a saved file: the name is a link with a click area across the row', () => {
  it('draws the name as a link to the address, and as text when there is none', async () => {
    const done = await mount({ status: 'done', href: '/files/report.pdf' });
    const link = part(done, 'a.name') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('/files/report.pdf');
    expect(link.textContent?.trim()).toBe(NAME);
    const noHref = await mount({ status: 'done' });
    expect(part(noHref, 'a')).toBeNull();
    expect(warnings).toHaveBeenCalledTimes(1);
  });

  it('is a link only while done: the other statuses draw the name as text', async () => {
    for (const status of ['ready', 'sent', 'error'] as const) {
      const item = await mount({ status, href: '/f.pdf', reason: 'No.' });
      expect(part(item, 'a'), status).toBeNull();
    }
  });

  it('refuses an unsafe address and draws nothing', async () => {
    const item = await mount({ status: 'done', href: 'javascript:alert(1)' });
    expect(item.hasAttribute('data-nph-rendered')).toBe(false);
    expect(root(item).querySelector('.item')).toBeNull();
    expect(errors).toHaveBeenCalledTimes(1);
  });

  it('knows the safe addresses: http, https, blob and a relative path', () => {
    expect(isSafeFileHref('https://example.com/a.pdf')).toBe(true);
    expect(isSafeFileHref('http://example.com/a.pdf')).toBe(true);
    expect(isSafeFileHref('blob:https://example.com/1234')).toBe(true);
    expect(isSafeFileHref('/files/a.pdf')).toBe(true);
    expect(isSafeFileHref('files/a.pdf')).toBe(true);
    expect(isSafeFileHref('javascript:alert(1)')).toBe(false);
    expect(isSafeFileHref('java\nscript:alert(1)')).toBe(false);
    expect(isSafeFileHref('data:text/html,hi')).toBe(false);
    expect(isSafeFileHref('mailto:someone@example.com')).toBe(false);
  });

  it('stretches the click area across the row, with the × above it as a sibling', async () => {
    const item = await mount({ status: 'done', href: '/f.pdf' });
    const link = part(item, 'a.name') as HTMLAnchorElement;
    const box = row(item).getBoundingClientRect();
    /* The middle of the row, away from the text and from the actions. */
    const hit = root(item).elementFromPoint(box.left + box.width * 0.6, box.top + box.height / 2);
    expect(hit).toBe(link);
    const remove = (part(item, '.remove') as HTMLElement).getBoundingClientRect();
    const onRemove = root(item).elementFromPoint(remove.left + remove.width / 2, remove.top + remove.height / 2);
    expect(onRemove?.closest('.remove')).not.toBeNull();
    expect(link.contains(part(item, '.remove'))).toBe(false);
  });

  it('underlines the name and takes the done-hover border on hover', async () => {
    const item = await mount({ status: 'done', href: '/f.pdf' });
    const link = part(item, 'a.name') as HTMLElement;
    expect(getComputedStyle(link).textDecorationLine).toBe('none');
    const box = row(item).getBoundingClientRect();
    await userEvent.hover(row(item), { position: { x: box.width * 0.6, y: box.height / 2 } });
    expect(getComputedStyle(row(item)).borderTopColor).toBe(borderColor('--nph-file-upload-item-border-done-hover'));
    expect(getComputedStyle(link).textDecorationLine).toBe('underline');
  });

  it('draws the ring of the whole row on the keyboard focus of the link', async () => {
    const item = await mount({ status: 'done', href: '/f.pdf' });
    expect(getComputedStyle(row(item), '::before').content).toBe('none');
    await userEvent.tab();
    expect(root(item).activeElement).toBe(part(item, 'a.name'));
    const border = getComputedStyle(row(item), '::before');
    const halo = getComputedStyle(row(item), '::after');
    expect(border.borderTopColor).toBe(borderColor('--nph-file-upload-item-focus-border'));
    expect(border.borderTopWidth).toBe(resolved('width', '--nph-file-upload-item-border-width'));
    expect(halo.borderTopColor).toBe(borderColor('--nph-file-upload-item-focus-halo'));
    expect(halo.borderTopWidth).toBe(resolved('width', '--nph-focus-ring-width'));
    const rect = row(item).getBoundingClientRect();
    /* The border sits on the edge of the row: its content plus its own border is the width of the row. */
    expect(Number.parseFloat(border.width) + 2 * Number.parseFloat(border.borderTopWidth)).toBeCloseTo(rect.width, 0);
  });

  it('keeps the mouse click from drawing the ring', async () => {
    const item = await mount({ status: 'done', href: '#kept' });
    const link = part(item, 'a.name') as HTMLElement;
    link.addEventListener('click', (event) => event.preventDefault(), { signal: listeners.signal });
    const box = row(item).getBoundingClientRect();
    await userEvent.click(row(item), { position: { x: box.width * 0.6, y: box.height / 2 } });
    expect(getComputedStyle(row(item), '::before').content).toBe('none');
  });

  it('takes Tab in order: the name link, then the ×', async () => {
    const item = await mount({ status: 'done', href: '/f.pdf' });
    await userEvent.tab();
    expect(root(item).activeElement).toBe(part(item, 'a.name'));
    await userEvent.tab();
    expect(root(item).activeElement).toBe(part(item, '.remove'));
  });

  it('takes Tab in order on an error: "Try again", then the ×', async () => {
    const item = await mount({ status: 'error', reason: 'No.' });
    await userEvent.tab();
    expect(root(item).activeElement).toBe(part(item, '.retry'));
    await userEvent.tab();
    expect(root(item).activeElement).toBe(part(item, '.remove'));
  });
});

describe('the disabled item: disabled wins (rule T11)', () => {
  it('goes back to the ready look, under file-upload/disabled-opacity', async () => {
    const item = await mount({ status: 'error', reason: 'No.', disabled: true });
    expect(row(item).dataset.status).toBe('ready');
    const style = getComputedStyle(row(item));
    expect(style.backgroundColor).toBe(background('--nph-file-upload-item-background'));
    expect(style.borderTopColor).toBe(borderColor('--nph-file-upload-item-border'));
    expect(style.opacity).toBe(resolved('opacity', '--nph-file-upload-disabled-opacity'));
    expect(part(item, '.status')).toBeNull();
    expect(part(item, '.retry')).toBeNull();
  });

  it('says it to assistive technology, and only when disabled', async () => {
    expect(row(await mount({ disabled: true })).getAttribute('aria-disabled')).toBe('true');
    expect(row(await mount()).hasAttribute('aria-disabled')).toBe(false);
  });

  it('disables the × for real and takes the name out of the links', async () => {
    const item = await mount({ status: 'done', href: '/f.pdf', disabled: true });
    expect(part(item, 'a')).toBeNull();
    const native = (part(item, '.remove') as HTMLElement).shadowRoot?.querySelector('button') as HTMLButtonElement;
    expect(native.disabled).toBe(true);
    const seen = collect(item, 'nph-file-upload-remove');
    (part(item, '.remove') as HTMLElement).click();
    expect(seen).toEqual([]);
  });
});

describe('invalid input draws nothing and says it once per cause, only in development', () => {
  it('an empty name', async () => {
    const item = await mount({ name: '  ' });
    expect(root(item).querySelector('.item')).toBeNull();
    expect(item.hasAttribute('data-nph-rendered')).toBe(false);
    expect(errors).toHaveBeenCalledTimes(1);
    item.requestUpdate();
    await item.updateComplete;
    expect(errors).toHaveBeenCalledTimes(1);
  });

  it('a status, a kind or a size outside the list', async () => {
    for (const props of [{ status: 'nope' }, { kind: 'video' }, { size: 'compact' }]) {
      errors.mockClear();
      const item = await mount(props as Partial<NphFileUploadItem>);
      expect(root(item).querySelector('.item'), JSON.stringify(props)).toBeNull();
      expect(errors, JSON.stringify(props)).toHaveBeenCalledTimes(1);
    }
  });

  it('an upload with no progress, or with a progress outside 0 to 100', async () => {
    for (const progress of [null, -1, 101, Number.NaN]) {
      errors.mockClear();
      const item = await mount({ status: 'uploading', progress });
      expect(root(item).querySelector('.item'), String(progress)).toBeNull();
      expect(errors, String(progress)).toHaveBeenCalledTimes(1);
    }
  });

  it('draws again when the input is fixed, with nothing left over', async () => {
    const item = await mount({ status: 'uploading', progress: null });
    expect(root(item).querySelector('.item')).toBeNull();
    item.progress = 40;
    await settle(item);
    expect(textOf(part(item, '.status'))).toBe('Uploading · 40%');
    expect(item.hasAttribute('data-nph-rendered')).toBe(true);
  });

  it('takes up no space while invalid', async () => {
    const item = await mount({ name: '' });
    expect(item.getBoundingClientRect().height).toBe(0);
    expect(getComputedStyle(item).display).toBe('none');
  });
});

describe('the texts the consumer owes', () => {
  it('draws without a missing text and warns once, naming the property', async () => {
    const item = await mount({ status: 'sent', sentText: '' });
    expect(textOf(part(item, '.status-text'))).toBe('');
    item.requestUpdate();
    await item.updateComplete;
    expect(warnings).toHaveBeenCalledTimes(1);
    expect(String(warnings.mock.calls[0]?.[0])).toContain('sent-text');
  });

  it('warns about a missing reason on an error', async () => {
    await mount({ status: 'error', reason: null });
    expect(warnings.mock.calls.map((call) => String(call[0])).join(' ')).toContain('reason');
  });

  it('warns about a text that is not set, and says nothing when every text is', async () => {
    await mount();
    expect(warnings).not.toHaveBeenCalled();
    const bare = document.createElement('nph-file-upload-item');
    Object.assign(bare, { name: NAME, fileId: 'x' });
    document.body.append(bare);
    await bare.updateComplete;
    expect(String(warnings.mock.calls[0]?.[0])).toContain('remove-label');
  });

  it('falls back to the file name for the × when the label template is missing', async () => {
    const item = await mount({ removeLabel: '' });
    expect(part(item, '.remove')?.getAttribute('label')).toBe(NAME);
  });
});

describe('helpers', () => {
  it('formatOf gives the extension in capitals, and nothing without one', () => {
    expect(formatOf('a.pdf')).toBe('PDF');
    expect(formatOf('archive.tar.gz')).toBe('GZ');
    expect(formatOf('README')).toBe('');
    expect(formatOf('.gitignore')).toBe('');
    expect(formatOf('trailing.')).toBe('');
  });

  it('formatBytes writes the size with one decimal and the unit symbol', () => {
    expect(formatBytes(0, 'en')).toBe('0 B');
    expect(formatBytes(999, 'en')).toBe('999 B');
    expect(formatBytes(1500, 'en')).toBe('1.5 KB');
    expect(formatBytes(2_400_000, 'en')).toBe('2.4 MB');
    expect(formatBytes(5_000_000, 'pt-BR')).toBe('5 MB');
    expect(formatBytes(2_400_000, 'pt-BR')).toBe('2,4 MB');
    expect(formatBytes(3_200_000_000, 'en')).toBe('3.2 GB');
  });

  it('fill replaces the markers and leaves an unknown one', () => {
    expect(fill('Remove {name}', { name: 'a.pdf' })).toBe('Remove a.pdf');
    expect(fill('{a} {b}', { a: '1' })).toBe('1 {b}');
  });
});

describe('the token contract: no literal design value in the CSS', () => {
  const css = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');

  it('uses only file-upload-item tokens, the disabled opacity and the global focus width', () => {
    const used = [...css.matchAll(/var\((--nph-[\w-]+)/g)].map((match) => match[1] as string);
    expect(used.length).toBeGreaterThan(20);
    for (const name of used) {
      const allowed = name.startsWith('--nph-file-upload-item-') || name === '--nph-file-upload-disabled-opacity' || name === '--nph-focus-ring-width' || name.startsWith('--nph-text-');
      expect(allowed, name).toBe(true);
    }
  });

  it('writes no color, length or time literal', () => {
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(css).not.toMatch(/\brgba?\(/);
    expect(css).not.toMatch(/\b\d+(\.\d+)?(px|rem|em|ms|s)\b/);
  });

  it('never reads a core or theme token', () => {
    expect(css).not.toMatch(/var\(--nph-(core|theme)-/);
  });
});
