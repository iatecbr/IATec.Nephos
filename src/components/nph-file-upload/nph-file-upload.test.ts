/**
 * Tests of `nph-file-upload` (P119), in a real browser (P21, item 5): hover, keyboard focus, the file
 * picker, drag and drop, the container query of the compact format and the measures of each state only
 * exist where there is layout.
 *
 * They prove the contract accepted in Figma (documentation frame `5311:8328`, sets `5297:7473` and
 * `5298:7669`), recorded in the evidence of the `figma-docs-accepted` gate of DSA-74: the API, the invalid
 * input, the seven states of the zone and their tokens, the two formats and the width that switches them,
 * the choice by the button and by drag and drop, the validation and the event, the list, the live region,
 * the focus after a change, the combined states, the field–control contract of `nph-field` and the token
 * contract.
 */
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MockInstance } from 'vitest';
import { userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import componentCss from './nph-file-upload.css?raw';
import {
  NPH_FILE_UPLOAD_FORMATS,
  NPH_FILE_UPLOAD_REJECTIONS,
  NPH_FILE_UPLOAD_THUMBNAIL_SIDE,
  NphFileUpload,
  classify,
  makeThumbnail,
  matchesAccept,
} from './nph-file-upload';
import type { NphFileUploadAddDetail, NphFileUploadEntry } from './nph-file-upload';
import type { NphFileUploadItem } from '../nph-file-upload-item/nph-file-upload-item';
import '../nph-field/nph-field';
import type { NphField } from '../nph-field/nph-field';

beforeAll(async () => {
  await document.fonts.load('400 14px "Noto Sans"');
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
  label: 'Attachments',
  prompt: 'Drag files here or',
  buttonText: 'Choose files',
  draggingText: 'Drop to add the files',
  rule: 'PDF, PNG or JPG · up to 5 MB · up to 5 files',
  limitText: 'Limit of 5 files reached',
  limitRule: 'Remove a file to add another.',
  uploadingText: 'Uploading · {progress}%',
  sentText: 'Sent',
  doneText: 'Saved',
  retryText: 'Try again',
  removeLabel: 'Remove {name}',
  cancelLabel: 'Cancel upload of {name}',
  addedText: '{count} files added',
  sentAnnouncement: '{name} sent',
  errorAnnouncement: 'Error: {name} not sent. {reason}',
  removedAnnouncement: '{name} removed',
};

const FILES: NphFileUploadEntry[] = [
  { id: 'a', name: 'annual-report-2026.pdf', size: 2_400_000, status: 'uploading', progress: 64 },
  { id: 'b', name: 'contract.pdf', size: 800_000, status: 'error', reason: 'Network failure while uploading.' },
  { id: 'c', name: 'meeting-minutes.pdf', size: 120_000, status: 'done', href: '/files/ata.pdf' },
];

/** A zone in a block of its own width, so the container query has a width to read. */
async function mount(props: Partial<NphFileUpload> = {}, width = '40rem'): Promise<NphFileUpload> {
  const holder = document.createElement('div');
  holder.style.inlineSize = width;
  const zone = document.createElement('nph-file-upload');
  Object.assign(zone, { ...TEXTS, ...props });
  holder.append(zone);
  document.body.append(holder);
  await settle(zone);
  return zone;
}

async function settle(zone: NphFileUpload): Promise<void> {
  await zone.updateComplete;
  for (const inner of zone.shadowRoot?.querySelectorAll('nph-icon, nph-button, nph-file-upload-item') ?? []) {
    await (inner as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
  }
  await frame();
  for (const item of zone.shadowRoot?.querySelectorAll<NphFileUploadItem>('nph-file-upload-item') ?? []) {
    for (const inner of item.shadowRoot?.querySelectorAll('nph-icon, nph-button, nph-image, nph-spinner') ?? []) {
      await (inner as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
    }
  }
  await zone.updateComplete;
}

const root = (zone: NphFileUpload): ShadowRoot => zone.shadowRoot as ShadowRoot;
const part = (zone: NphFileUpload, selector: string): HTMLElement | null => root(zone).querySelector<HTMLElement>(selector);
const area = (zone: NphFileUpload): HTMLElement => part(zone, '.zone') as HTMLElement;
const choose = (zone: NphFileUpload): HTMLElement => part(zone, '.choose') as HTMLElement;
const nativeButton = (zone: NphFileUpload): HTMLButtonElement => choose(zone).shadowRoot?.querySelector('button') as HTMLButtonElement;
const itemsOf = (zone: NphFileUpload): NphFileUploadItem[] => [...root(zone).querySelectorAll<NphFileUploadItem>('nph-file-upload-item')];
const icon = (zone: NphFileUpload): HTMLElement => part(zone, '.zone-icon') as HTMLElement;
const live = (zone: NphFileUpload): HTMLElement => part(zone, '.live') as HTMLElement;
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

const textOf = (element: Element | null): string => (element?.textContent ?? '').replace(/\s+/g, ' ').trim();

/** The events the zone fires, collected until the end of the test. */
function collect<T>(zone: NphFileUpload, type: string): T[] {
  const seen: T[] = [];
  zone.addEventListener(type, (event) => seen.push((event as CustomEvent<T>).detail), { signal: listeners.signal });
  return seen;
}

/** A real `File` of a given size, so the validation reads what the browser would give it. */
const file = (name: string, size = 10, type = ''): File => new File([new Uint8Array(size)], name, { type });

const transferOf = (...files: File[]): DataTransfer => {
  const transfer = new DataTransfer();
  for (const item of files) transfer.items.add(item);
  return transfer;
};

/** The person picks files in the system picker: the hidden input gets them and fires `change`. */
function pick(zone: NphFileUpload, ...files: File[]): void {
  const input = part(zone, '.input') as HTMLInputElement;
  input.files = transferOf(...files).files;
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

function drag(zone: NphFileUpload, type: 'dragenter' | 'dragover' | 'dragleave' | 'drop', transfer: DataTransfer): DragEvent {
  const event = new DragEvent(type, { dataTransfer: transfer, bubbles: true, cancelable: true, composed: true });
  area(zone).dispatchEvent(event);
  return event;
}

describe('registration and defaults', () => {
  it('defines nph-file-upload exactly once', () => {
    expect(customElements.get('nph-file-upload')).toBe(NphFileUpload);
  });

  it('is the default format, the default size and an empty zone with no list', async () => {
    const zone = await mount();
    expect(zone.format).toBe('default');
    expect(zone.size).toBe('default');
    expect(zone.files).toEqual([]);
    expect(zone.disabled).toBe(false);
    expect(zone.hasAttribute('data-nph-rendered')).toBe(true);
    expect(area(zone).dataset.state).toBe('empty');
    expect(part(zone, '.list')).toBeNull();
  });

  it('lists the formats and the rejections of the contract', () => {
    expect(NPH_FILE_UPLOAD_FORMATS).toEqual(['default', 'compact']);
    expect(NPH_FILE_UPLOAD_REJECTIONS).toEqual(['type', 'size', 'count']);
  });

  it('reflects format, disabled, invalid and required, because the CSS and the consumer read them', async () => {
    const zone = await mount({ format: 'compact', disabled: true, invalid: true, required: true });
    for (const name of ['format', 'disabled', 'invalid', 'required']) {
      expect(zone.hasAttribute(name), name).toBe(true);
    }
    expect(zone.getAttribute('format')).toBe('compact');
  });
});

describe('the anatomy of the default format', () => {
  it('stacks the icon, the phrase, the button and the rule, centered', async () => {
    const zone = await mount();
    const rects = ['.zone-icon', '.phrase', '.choose', '.rule'].map((selector) => (part(zone, selector) as HTMLElement).getBoundingClientRect());
    for (let index = 1; index < rects.length; index += 1) {
      expect((rects[index] as DOMRect).top).toBeGreaterThanOrEqual((rects[index - 1] as DOMRect).bottom);
    }
    const middle = area(zone).getBoundingClientRect();
    for (const rect of rects) {
      expect(Math.abs(rect.left + rect.width / 2 - (middle.left + middle.width / 2))).toBeLessThanOrEqual(1);
    }
  });

  it('writes the phrase, the button and the rule the consumer gave', async () => {
    const zone = await mount();
    expect(textOf(part(zone, '.phrase'))).toBe('Drag files here or');
    expect(choose(zone).getAttribute('text')).toBe('Choose files');
    expect(textOf(part(zone, '.rule'))).toBe('PDF, PNG or JPG · up to 5 MB · up to 5 files');
  });

  it('has the height of the contract: 186 in the default format, in every state that keeps the button', async () => {
    for (const props of [{}, { error: 'File type not accepted.' }, { maxFiles: 1, files: [FILES[2] as NphFileUploadEntry] }]) {
      const zone = await mount(props);
      expect(area(zone).getBoundingClientRect().height, JSON.stringify(props)).toBe(186);
    }
  });

  it('takes the icon, the gap and the padding from the tokens', async () => {
    const zone = await mount();
    const style = getComputedStyle(area(zone));
    expect(style.paddingTop).toBe(resolved('width', '--nph-file-upload-padding'));
    expect(style.rowGap).toBe(resolved('width', '--nph-file-upload-gap'));
    expect(style.borderTopWidth).toBe(resolved('width', '--nph-file-upload-border-width'));
    expect(style.borderTopLeftRadius).toBe(resolved('width', '--nph-file-upload-radius'));
    expect(icon(zone).getAttribute('size')).toBe('lg');
    expect(icon(zone).getBoundingClientRect().width).toBe(px('--nph-file-upload-icon-size'));
    expect(icon(zone).getAttribute('name')).toBe('cloud-arrow-up');
  });

  it('draws the dashed border, the same in every state', async () => {
    for (const props of [{}, { error: 'No.' }, { disabled: true }]) {
      const zone = await mount(props);
      expect(getComputedStyle(area(zone)).borderTopStyle, JSON.stringify(props)).toBe('dashed');
    }
  });

  it('writes the phrase with text/body-md and the rule with text/body-sm', async () => {
    const zone = await mount();
    expect(getComputedStyle(part(zone, '.phrase') as HTMLElement).fontSize).toBe(resolved('font-size', '--nph-text-body-md-font-size'));
    expect(getComputedStyle(part(zone, '.rule') as HTMLElement).fontSize).toBe(resolved('font-size', '--nph-text-body-sm-font-size'));
  });
});

describe('the states of the zone', () => {
  it('empty: the background, the border, the icon and the texts of the rest', async () => {
    const zone = await mount();
    const style = getComputedStyle(area(zone));
    expect(style.backgroundColor).toBe(background('--nph-file-upload-background'));
    expect(style.borderTopColor).toBe(borderColor('--nph-file-upload-border'));
    expect(getComputedStyle(icon(zone)).color).toBe(color('--nph-file-upload-icon-foreground'));
    expect(getComputedStyle(part(zone, '.phrase') as HTMLElement).color).toBe(color('--nph-file-upload-foreground'));
    expect(getComputedStyle(part(zone, '.rule') as HTMLElement).color).toBe(color('--nph-file-upload-muted-foreground'));
    expect(icon(zone).getAttribute('variant')).toBe('light');
  });

  it('dragging: the brand colors, the new phrase and the icon turned solid', async () => {
    const zone = await mount();
    drag(zone, 'dragenter', transferOf(file('a.pdf')));
    await settle(zone);
    expect(area(zone).dataset.state).toBe('dragging');
    const style = getComputedStyle(area(zone));
    expect(style.backgroundColor).toBe(background('--nph-file-upload-background-dragging'));
    expect(style.borderTopColor).toBe(borderColor('--nph-file-upload-border-dragging'));
    expect(getComputedStyle(icon(zone)).color).toBe(color('--nph-file-upload-icon-foreground-dragging'));
    expect(getComputedStyle(part(zone, '.phrase') as HTMLElement).color).toBe(color('--nph-file-upload-foreground-dragging'));
    expect(textOf(part(zone, '.phrase'))).toBe('Drop to add the files');
    expect(icon(zone).getAttribute('variant')).toBe('solid');
  });

  it('dragging: the button is out of sight with its place kept, so the height does not change', async () => {
    const zone = await mount();
    const before = area(zone).getBoundingClientRect().height;
    const place = choose(zone).getBoundingClientRect();
    drag(zone, 'dragenter', transferOf(file('a.pdf')));
    await settle(zone);
    expect(getComputedStyle(part(zone, '.action') as HTMLElement).visibility).toBe('hidden');
    expect(part(zone, '.action')?.hasAttribute('inert')).toBe(true);
    expect(area(zone).getBoundingClientRect().height).toBe(before);
    expect(choose(zone).getBoundingClientRect().top).toBe(place.top);
  });

  it('dragging: leaves when the files leave, and not when they pass over a child', async () => {
    const zone = await mount();
    const transfer = transferOf(file('a.pdf'));
    drag(zone, 'dragenter', transfer);
    drag(zone, 'dragenter', transfer);
    drag(zone, 'dragleave', transfer);
    await settle(zone);
    expect(area(zone).dataset.state).toBe('dragging');
    drag(zone, 'dragleave', transfer);
    await settle(zone);
    expect(area(zone).dataset.state).toBe('empty');
  });

  it('dragging: reacts only to files, not to a dragged text', async () => {
    const zone = await mount();
    const text = new DataTransfer();
    text.setData('text/plain', 'hello');
    drag(zone, 'dragenter', text);
    await settle(zone);
    expect(area(zone).dataset.state).toBe('empty');
  });

  it('error: the reason takes the place of the rule, with the circle-xmark, and the zone goes to the error colors', async () => {
    const zone = await mount({ error: 'File type not accepted.' });
    expect(area(zone).dataset.state).toBe('error');
    const style = getComputedStyle(area(zone));
    expect(style.backgroundColor).toBe(background('--nph-file-upload-background-error'));
    expect(style.borderTopColor).toBe(borderColor('--nph-file-upload-border-error'));
    expect(getComputedStyle(icon(zone)).color).toBe(color('--nph-file-upload-icon-foreground-error'));
    const rule = part(zone, '.rule') as HTMLElement;
    expect(textOf(rule)).toBe('File type not accepted.');
    expect(rule.textContent).not.toContain('PDF, PNG');
    expect(rule.querySelector('nph-icon')?.getAttribute('name')).toBe('circle-xmark');
    expect(rule.querySelector('nph-icon')?.getAttribute('size')).toBe('sm');
    expect(rule.querySelector('nph-icon')?.getAttribute('variant')).toBe('light');
    expect(getComputedStyle(rule).color).toBe(color('--nph-file-upload-error-foreground'));
    expect(getComputedStyle(rule).columnGap).toBe(resolved('width', '--nph-file-upload-error-gap'));
    expect(icon(zone).getAttribute('variant')).toBe('solid');
  });

  it('error: keeps the phrase and the button, so the person can try again', async () => {
    const zone = await mount({ error: 'No.' });
    expect(textOf(part(zone, '.phrase'))).toBe('Drag files here or');
    expect(nativeButton(zone).disabled).toBe(false);
    expect(getComputedStyle(part(zone, '.phrase') as HTMLElement).color).toBe(color('--nph-file-upload-foreground'));
  });

  it('limit: the warning colors, the phrase that says the limit, the rule that says how to free space and a disabled button', async () => {
    const zone = await mount({ maxFiles: 3, files: FILES });
    expect(area(zone).dataset.state).toBe('limit');
    const style = getComputedStyle(area(zone));
    expect(style.backgroundColor).toBe(background('--nph-file-upload-background-limit'));
    expect(style.borderTopColor).toBe(borderColor('--nph-file-upload-border-limit'));
    expect(getComputedStyle(icon(zone)).color).toBe(color('--nph-file-upload-icon-foreground-limit'));
    expect(textOf(part(zone, '.phrase'))).toBe('Limit of 5 files reached');
    expect(textOf(part(zone, '.rule'))).toBe('Remove a file to add another.');
    expect(getComputedStyle(part(zone, '.phrase') as HTMLElement).color).toBe(color('--nph-file-upload-muted-foreground'));
    expect(nativeButton(zone).disabled).toBe(true);
    expect(icon(zone).getAttribute('variant')).toBe('solid');
  });

  it('limit: ends when a file leaves the list, and the button is back', async () => {
    const zone = await mount({ maxFiles: 3, files: FILES });
    zone.files = FILES.slice(1);
    await settle(zone);
    expect(area(zone).dataset.state).toBe('empty');
    expect(nativeButton(zone).disabled).toBe(false);
  });

  it('limit: does not exist without max-files', async () => {
    const zone = await mount({ files: FILES });
    expect(area(zone).dataset.state).toBe('empty');
  });

  it('disabled: the whole zone under file-upload/disabled-opacity, with a real disabled on the button', async () => {
    const zone = await mount({ disabled: true });
    expect(area(zone).dataset.state).toBe('disabled');
    expect(getComputedStyle(area(zone)).opacity).toBe(resolved('opacity', '--nph-file-upload-disabled-opacity'));
    expect(nativeButton(zone).disabled).toBe(true);
    expect((part(zone, '.input') as HTMLInputElement).disabled).toBe(true);
  });

  it('disabled: the zone says it to assistive technology, and is not disabled otherwise', async () => {
    expect(area(await mount({ disabled: true })).getAttribute('aria-disabled')).toBe('true');
    expect(area(await mount()).hasAttribute('aria-disabled')).toBe(false);
  });

  it('disabled: the button is not dimmed twice, so the whole zone is at the disabled opacity once', async () => {
    const zone = await mount({ disabled: true, files: FILES });
    const opacity = Number.parseFloat(resolved('opacity', '--nph-file-upload-disabled-opacity'));
    expect(getComputedStyle(choose(zone)).opacity).toBe('1');
    expect(Number.parseFloat(getComputedStyle(area(zone)).opacity)).toBe(opacity);
    const item = itemsOf(zone)[0] as NphFileUploadItem;
    expect(getComputedStyle(item.shadowRoot?.querySelector('.remove') as HTMLElement).opacity).toBe('1');
    expect(Number.parseFloat(getComputedStyle(item.shadowRoot?.querySelector('.item') as HTMLElement).opacity)).toBe(opacity);
  });

  it('limit: the button alone is disabled, at the opacity of its own', async () => {
    const zone = await mount({ maxFiles: 3, files: FILES });
    expect(getComputedStyle(choose(zone)).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
  });

  it('error + disabled and limit + disabled: disabled wins, with no state border and no state background', async () => {
    for (const props of [{ error: 'No.' }, { maxFiles: 3, files: FILES }]) {
      const zone = await mount({ ...props, disabled: true });
      const style = getComputedStyle(area(zone));
      expect(area(zone).dataset.state).toBe('disabled');
      expect(style.backgroundColor).toBe(background('--nph-file-upload-background'));
      expect(style.borderTopColor).toBe(borderColor('--nph-file-upload-border'));
      expect(getComputedStyle(icon(zone)).color).toBe(color('--nph-file-upload-icon-foreground'));
      expect(textOf(part(zone, '.phrase'))).toBe('Drag files here or');
      expect(textOf(part(zone, '.rule'))).toBe('PDF, PNG or JPG · up to 5 MB · up to 5 files');
    }
  });

  it('disabled: a drag over the zone changes nothing and a drop sends nothing', async () => {
    const zone = await mount({ disabled: true });
    const seen = collect<NphFileUploadAddDetail>(zone, 'nph-file-upload-add');
    drag(zone, 'dragenter', transferOf(file('a.pdf')));
    const drop = drag(zone, 'drop', transferOf(file('a.pdf')));
    await settle(zone);
    expect(area(zone).dataset.state).toBe('disabled');
    expect(drop.defaultPrevented).toBe(true);
    expect(seen).toEqual([]);
  });

  it('dragging + limit and dragging + error: dragging shows', async () => {
    const zone = await mount({ maxFiles: 3, files: FILES, error: 'No.' });
    expect(area(zone).dataset.state).toBe('error');
    drag(zone, 'dragenter', transferOf(file('a.pdf')));
    await settle(zone);
    expect(area(zone).dataset.state).toBe('dragging');
  });
});

describe('hover and focus come from the button, and the border does not change', () => {
  it('hover on the button turns the icon solid and leaves the border alone', async () => {
    const zone = await mount();
    const border = getComputedStyle(area(zone)).borderTopColor;
    await userEvent.hover(choose(zone));
    await settle(zone);
    expect(icon(zone).getAttribute('variant')).toBe('solid');
    expect(getComputedStyle(area(zone)).borderTopColor).toBe(border);
    expect(area(zone).dataset.state).toBe('empty');
    await userEvent.unhover(choose(zone));
    await settle(zone);
    expect(icon(zone).getAttribute('variant')).toBe('light');
  });

  it('hover away from the button does nothing: the zone does not react to the pointer', async () => {
    const zone = await mount();
    const rule = (part(zone, '.rule') as HTMLElement).getBoundingClientRect();
    await userEvent.hover(part(zone, '.rule') as HTMLElement, { position: { x: 2, y: rule.height / 2 } });
    await settle(zone);
    expect(icon(zone).getAttribute('variant')).toBe('light');
  });

  it('the keyboard focus on the button turns the icon solid, with the ring on the button', async () => {
    const zone = await mount();
    await userEvent.tab();
    await settle(zone);
    expect(root(zone).activeElement).toBe(choose(zone));
    expect(icon(zone).getAttribute('variant')).toBe('solid');
    await userEvent.tab({ shift: true });
    await settle(zone);
    expect(icon(zone).getAttribute('variant')).toBe('light');
  });

  it('a disabled zone keeps the icon light under the pointer', async () => {
    const zone = await mount({ disabled: true });
    await userEvent.hover(choose(zone), { force: true }).catch(() => {});
    await settle(zone);
    expect(icon(zone).getAttribute('variant')).toBe('light');
  });

  it('the button is a real nph-button, secondary solid, with the size of the form', async () => {
    const zone = await mount();
    expect(choose(zone).tagName).toBe('NPH-BUTTON');
    expect(choose(zone).getAttribute('severity')).toBe('secondary');
    expect(choose(zone).getAttribute('emphasis')).toBe('solid');
    expect(choose(zone).getAttribute('size')).toBe('default');
    const large = await mount({ size: 'large' });
    expect(choose(large).getAttribute('size')).toBe('large');
    expect(choose(large).getBoundingClientRect().height).toBe(px('--nph-control-height-large'));
  });
});

describe('the compact format and the width that switches it', () => {
  it('is one row from 668 px: the icon, the texts and the button at the end, centered vertically', async () => {
    const zone = await mount({ format: 'compact' }, '48rem');
    const box = area(zone).getBoundingClientRect();
    const rects = ['.zone-icon', '.phrase', '.rule', '.choose'].map((selector) => (part(zone, selector) as HTMLElement).getBoundingClientRect());
    const [iconRect, phrase, rule, button] = rects as [DOMRect, DOMRect, DOMRect, DOMRect];
    expect(iconRect.right).toBeLessThanOrEqual(phrase.left);
    expect(phrase.right).toBeLessThanOrEqual(button.left);
    expect(rule.top).toBeGreaterThanOrEqual(phrase.bottom);
    expect(button.right).toBeLessThan(box.right);
    for (const rect of [iconRect, button]) {
      expect(Math.abs(rect.top + rect.height / 2 - (box.top + box.height / 2))).toBeLessThanOrEqual(1);
    }
    expect(phrase.left).toBeLessThan(rule.left + 1);
  });

  it('is 66 high, the minimum form of the zone', async () => {
    const zone = await mount({ format: 'compact' }, '48rem');
    expect(area(zone).getBoundingClientRect().height).toBe(66);
  });

  it('takes the padding and the gaps of the compact tokens', async () => {
    const zone = await mount({ format: 'compact' }, '48rem');
    const style = getComputedStyle(area(zone));
    expect(style.paddingTop).toBe(resolved('width', '--nph-file-upload-padding-compact-block'));
    expect(style.paddingLeft).toBe(resolved('width', '--nph-file-upload-padding-compact-inline'));
    expect(style.columnGap).toBe(resolved('width', '--nph-file-upload-gap-compact'));
    expect(style.rowGap).toBe(resolved('width', '--nph-file-upload-gap-text-compact'));
  });

  it('applies exactly from 668 px of the width of the zone, and the default format below', async () => {
    const narrow = await mount({ format: 'compact' }, '41.6875rem');
    expect(area(narrow).getBoundingClientRect().height).toBe(186);
    const wide = await mount({ format: 'compact' }, '41.75rem');
    expect(area(wide).getBoundingClientRect().height).toBe(66);
  });

  it('reads the width of the zone, not the window: a wide window with a narrow card is the default format', async () => {
    const zone = await mount({ format: 'compact' }, '30rem');
    expect(window.innerWidth).toBeGreaterThan(0);
    expect(area(zone).getBoundingClientRect().height).toBe(186);
  });

  it('never breaks into lines: between 480 and 668 the zone is stacked', async () => {
    const zone = await mount({ format: 'compact' }, '30rem');
    const phrase = (part(zone, '.phrase') as HTMLElement).getBoundingClientRect();
    const button = choose(zone).getBoundingClientRect();
    expect(button.top).toBeGreaterThanOrEqual(phrase.bottom);
  });

  it('the default format is the same at any width', async () => {
    const zone = await mount({}, '60rem');
    expect(area(zone).getBoundingClientRect().height).toBe(186);
  });

  it('error and limit keep the compact row, with the reason under the phrase', async () => {
    const zone = await mount({ format: 'compact', error: 'File type not accepted.' }, '48rem');
    expect(area(zone).getBoundingClientRect().height).toBe(66);
    expect(textOf(part(zone, '.rule'))).toBe('File type not accepted.');
  });

  it('takes the width of where it lives: it has none of its own', async () => {
    const zone = await mount({}, '33rem');
    expect(zone.getBoundingClientRect().width).toBe(528);
    expect(getComputedStyle(zone).containerType).toBe('inline-size');
  });
});

describe('the choice: the button opens the picker', () => {
  it('opens the system picker through the hidden file field when the button is clicked', async () => {
    const zone = await mount();
    const input = part(zone, '.input') as HTMLInputElement;
    const click = vi.spyOn(input, 'click').mockImplementation(() => {});
    choose(zone).click();
    expect(click).toHaveBeenCalledTimes(1);
  });

  it('opens it with Enter and with Space on the focused button', async () => {
    const zone = await mount();
    const input = part(zone, '.input') as HTMLInputElement;
    const click = vi.spyOn(input, 'click').mockImplementation(() => {});
    zone.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(click).toHaveBeenCalledTimes(2);
  });

  it('does not open it from a disabled button', async () => {
    const zone = await mount({ disabled: true });
    const click = vi.spyOn(part(zone, '.input') as HTMLInputElement, 'click').mockImplementation(() => {});
    choose(zone).click();
    expect(click).not.toHaveBeenCalled();
  });

  it('takes the whole zone out of the focus: only the button is a Tab stop', async () => {
    const zone = await mount();
    expect(area(zone).hasAttribute('tabindex')).toBe(false);
    await userEvent.tab();
    expect(root(zone).activeElement).toBe(choose(zone));
    await userEvent.tab();
    expect(root(zone).activeElement).toBeNull();
  });

  it('does not open the picker when the zone itself is clicked: the whole zone is not a button', async () => {
    const zone = await mount();
    const click = vi.spyOn(part(zone, '.input') as HTMLInputElement, 'click').mockImplementation(() => {});
    await userEvent.click(part(zone, '.phrase') as HTMLElement);
    expect(click).not.toHaveBeenCalled();
  });

  it('is a multiple file field with the accepted types', async () => {
    const zone = await mount({ accept: '.pdf,image/png' });
    const input = part(zone, '.input') as HTMLInputElement;
    expect(input.type).toBe('file');
    expect(input.multiple).toBe(true);
    expect(input.accept).toBe('.pdf,image/png');
    expect((await mount()).shadowRoot?.querySelector<HTMLInputElement>('.input')?.hasAttribute('accept')).toBe(false);
  });

  it('fires nph-file-upload-add with the chosen files, and the focus returns to the button', async () => {
    const zone = await mount();
    const seen = collect<NphFileUploadAddDetail>(zone, 'nph-file-upload-add');
    const chosen = [file('a.pdf'), file('b.png')];
    pick(zone, ...chosen);
    expect(seen).toHaveLength(1);
    expect(seen[0]?.files).toEqual(chosen);
    expect(seen[0]?.rejected).toEqual([]);
    expect(root(zone).activeElement).toBe(choose(zone));
  });

  it('returns the focus to the button when the picker is closed with no file', async () => {
    const zone = await mount();
    (part(zone, '.input') as HTMLInputElement).dispatchEvent(new Event('cancel'));
    expect(root(zone).activeElement).toBe(choose(zone));
  });

  it('fires nothing when the picker gives no file', async () => {
    const zone = await mount();
    const seen = collect(zone, 'nph-file-upload-add');
    pick(zone);
    expect(seen).toEqual([]);
  });

  it('lets the same file be chosen twice: the field is cleared after each choice', async () => {
    const zone = await mount();
    const seen = collect(zone, 'nph-file-upload-add');
    pick(zone, file('a.pdf'));
    pick(zone, file('a.pdf'));
    expect(seen).toHaveLength(2);
    expect((part(zone, '.input') as HTMLInputElement).value).toBe('');
  });

  it('bubbles and crosses the shadow root, and fires nothing when code sets the properties', async () => {
    const zone = await mount();
    const heard: Event[] = [];
    document.body.addEventListener('nph-file-upload-add', (event) => heard.push(event), { signal: listeners.signal });
    zone.files = FILES;
    zone.error = 'No.';
    await settle(zone);
    expect(heard).toEqual([]);
    pick(zone, file('a.pdf'));
    expect(heard).toHaveLength(1);
    expect(heard[0]?.bubbles).toBe(true);
    expect(heard[0]?.composed).toBe(true);
  });
});

describe('the choice: drag and drop', () => {
  it('receives the dropped files and fires nph-file-upload-add', async () => {
    const zone = await mount();
    const seen = collect<NphFileUploadAddDetail>(zone, 'nph-file-upload-add');
    const dropped = [file('a.pdf'), file('b.png')];
    const transfer = transferOf(...dropped);
    drag(zone, 'dragenter', transfer);
    const drop = drag(zone, 'drop', transfer);
    await settle(zone);
    expect(drop.defaultPrevented).toBe(true);
    expect(seen[0]?.files).toEqual(dropped);
    expect(area(zone).dataset.state).toBe('empty');
  });

  it('allows the drop: dragover is cancelled, so the browser does not open the file', async () => {
    const zone = await mount();
    const over = drag(zone, 'dragover', transferOf(file('a.pdf')));
    expect(over.defaultPrevented).toBe(true);
  });

  it('leaves a dragged text alone', async () => {
    const zone = await mount();
    const text = new DataTransfer();
    text.setData('text/plain', 'hello');
    const seen = collect(zone, 'nph-file-upload-add');
    expect(drag(zone, 'dragover', text).defaultPrevented).toBe(false);
    expect(drag(zone, 'drop', text).defaultPrevented).toBe(false);
    expect(seen).toEqual([]);
  });

  it('is never the only way: the same files go through the button', async () => {
    const zone = await mount();
    const seen = collect<NphFileUploadAddDetail>(zone, 'nph-file-upload-add');
    pick(zone, file('a.pdf'));
    drag(zone, 'drop', transferOf(file('a.pdf')));
    expect(seen.map((detail) => detail.files.map((item) => item.name))).toEqual([['a.pdf'], ['a.pdf']]);
  });
});

describe('the validation of what the person chose', () => {
  it('matchesAccept reads the same list as the native file field', () => {
    const pdf = { name: 'Report.PDF', type: 'application/pdf' };
    const png = { name: 'photo.png', type: 'image/png' };
    expect(matchesAccept(pdf, '')).toBe(true);
    expect(matchesAccept(pdf, '.pdf')).toBe(true);
    expect(matchesAccept(pdf, '.PDF, .png')).toBe(true);
    expect(matchesAccept(pdf, 'application/pdf')).toBe(true);
    expect(matchesAccept(png, 'image/*')).toBe(true);
    expect(matchesAccept(pdf, 'image/*')).toBe(false);
    expect(matchesAccept(png, 'image/jpeg')).toBe(false);
    expect(matchesAccept({ name: 'a', type: '' }, '.pdf')).toBe(false);
  });

  it('classify checks the type, then the size, then the room', () => {
    const big = file('big.pdf', 100, 'application/pdf');
    const a = file('a.pdf', 10, 'application/pdf');
    const b = file('b.pdf', 10, 'application/pdf');
    const c = file('c.pdf', 10, 'application/pdf');
    const exe = file('x.exe', 10, 'application/x-msdownload');
    const result = classify([a, exe, big, b, c], { accept: '.pdf', maxSize: 50, room: 2 });
    expect(result.files).toEqual([a, b]);
    expect(result.rejected).toEqual([
      { file: exe, reason: 'type' },
      { file: big, reason: 'size' },
      { file: c, reason: 'count' },
    ]);
  });

  it('classify takes every file with no rule', () => {
    const files = [file('a'), file('b')];
    expect(classify(files, { accept: '', maxSize: null, room: Number.POSITIVE_INFINITY })).toEqual({ files, rejected: [] });
  });

  it('puts the wrong type in rejected, with its reason', async () => {
    const zone = await mount({ accept: '.pdf,image/*' });
    const seen = collect<NphFileUploadAddDetail>(zone, 'nph-file-upload-add');
    const good = file('a.pdf', 10, 'application/pdf');
    const bad = file('a.exe', 10);
    pick(zone, good, bad);
    expect(seen[0]?.files).toEqual([good]);
    expect(seen[0]?.rejected).toEqual([{ file: bad, reason: 'type' }]);
  });

  it('puts a file above max-size in rejected, as size', async () => {
    const zone = await mount({ maxSize: 1000 });
    const seen = collect<NphFileUploadAddDetail>(zone, 'nph-file-upload-add');
    const big = file('big.pdf', 2000);
    pick(zone, file('ok.pdf', 1000), big);
    expect(seen[0]?.rejected).toEqual([{ file: big, reason: 'size' }]);
    expect(seen[0]?.files).toHaveLength(1);
  });

  it('counts the files already in the list against max-files', async () => {
    const zone = await mount({ maxFiles: 4, files: FILES });
    const seen = collect<NphFileUploadAddDetail>(zone, 'nph-file-upload-add');
    const [one, two] = [file('one.pdf'), file('two.pdf')];
    pick(zone, one, two);
    expect(seen[0]?.files).toEqual([one]);
    expect(seen[0]?.rejected).toEqual([{ file: two, reason: 'count' }]);
  });

  it('a drop at the limit sends every file as rejected, with the reason count', async () => {
    const zone = await mount({ maxFiles: 3, files: FILES });
    const seen = collect<NphFileUploadAddDetail>(zone, 'nph-file-upload-add');
    const extra = file('extra.pdf');
    drag(zone, 'drop', transferOf(extra));
    expect(seen).toEqual([{ files: [], rejected: [{ file: extra, reason: 'count' }] }]);
  });

  it('changes no list and no state by itself: the page decides what to show', async () => {
    const zone = await mount({ accept: '.pdf' });
    pick(zone, file('a.exe'));
    await settle(zone);
    expect(zone.files).toEqual([]);
    expect(zone.error).toBe('');
    expect(area(zone).dataset.state).toBe('empty');
    expect(part(zone, '.list')).toBeNull();
  });
});

describe('the list', () => {
  it('draws one item per file, in order, right below the zone with the list gap', async () => {
    const zone = await mount({ files: FILES });
    const items = itemsOf(zone);
    expect(items.map((item) => item.name)).toEqual(FILES.map((entry) => entry.name));
    expect(items.map((item) => item.status)).toEqual(['uploading', 'error', 'done']);
    const zoneBox = area(zone).getBoundingClientRect();
    const first = items[0]?.getBoundingClientRect() as DOMRect;
    expect(first.top - zoneBox.bottom).toBe(px('--nph-file-upload-list-gap'));
    const second = items[1]?.getBoundingClientRect() as DOMRect;
    expect(second.top - first.bottom).toBe(px('--nph-file-upload-list-gap'));
  });

  it('has no scroll of its own: it grows with the page up to the last file', async () => {
    const many: NphFileUploadEntry[] = Array.from({ length: 12 }, (_, index) => ({ id: `f${String(index)}`, name: `file-${String(index)}.pdf`, size: 1000 }));
    const zone = await mount({ files: many });
    const list = part(zone, '.list') as HTMLElement;
    const style = getComputedStyle(list);
    expect(style.overflowY).toBe('visible');
    expect(list.scrollHeight).toBe(list.clientHeight);
    expect(zone.getBoundingClientRect().height).toBeGreaterThan(area(zone).getBoundingClientRect().height + 12 * 60);
  });

  it('is a list, with an item in each entry, and says so to Safari, which drops the role of a list with no marker', async () => {
    const zone = await mount({ files: FILES });
    expect(part(zone, 'ul.list')).not.toBeNull();
    expect(part(zone, 'ul.list')?.getAttribute('role')).toBe('list');
    expect(root(zone).querySelectorAll('ul.list > li')).toHaveLength(3);
  });

  it('passes the entry, the texts, the size of the form and the language to each item', async () => {
    const zone = await mount({ files: FILES, size: 'large', lang: 'pt-BR' });
    const [uploading, error, done] = itemsOf(zone) as [NphFileUploadItem, NphFileUploadItem, NphFileUploadItem];
    expect(uploading.progress).toBe(64);
    expect(uploading.fileId).toBe('a');
    expect(uploading.bytes).toBe(2_400_000);
    expect(uploading.size).toBe('large');
    expect(uploading.uploadingText).toBe('Uploading · {progress}%');
    expect(uploading.hasAttribute('lang')).toBe(false);
    expect(textOf(uploading.shadowRoot?.querySelector('.meta') ?? null)).toBe('PDF · 2,4 MB');
    expect(error.reason).toBe('Network failure while uploading.');
    expect(done.href).toBe('/files/ata.pdf');
    expect(done.doneText).toBe('Saved');
  });

  it('is ready by default, an upload together with the form', async () => {
    const zone = await mount({ files: [{ id: 'r', name: 'draft.pdf' }] });
    expect(itemsOf(zone)[0]?.status).toBe('ready');
  });

  it('shows the image kind of an image file, and the file kind of the rest', async () => {
    const zone = await mount({
      files: [
        { id: 'p', name: 'photo.png', file: file('photo.png', 10, 'image/png') },
        { id: 'd', name: 'doc.pdf', file: file('doc.pdf', 10, 'application/pdf') },
        { id: 'k', name: 'forced.bin', kind: 'image' },
      ],
    });
    expect(itemsOf(zone).map((item) => item.kind)).toEqual(['image', 'file', 'image']);
  });

  it('puts the list under the disabled zone too, and the items follow it', async () => {
    const zone = await mount({ files: FILES, disabled: true });
    expect(itemsOf(zone).every((item) => item.disabled)).toBe(true);
    zone.disabled = false;
    await settle(zone);
    expect(itemsOf(zone).every((item) => !item.disabled)).toBe(true);
  });

  it('draws the change at once: a new status, a new progress', async () => {
    const zone = await mount({ files: [FILES[0] as NphFileUploadEntry] });
    zone.files = [{ ...(FILES[0] as NphFileUploadEntry), progress: 90 }];
    await settle(zone);
    expect(textOf(itemsOf(zone)[0]?.shadowRoot?.querySelector('.status') ?? null)).toBe('Uploading · 90%');
    zone.files = [{ ...(FILES[0] as NphFileUploadEntry), status: 'sent' }];
    await settle(zone);
    expect(itemsOf(zone)[0]?.status).toBe('sent');
  });

  it('lets the events of the items cross the zone to the page', async () => {
    const zone = await mount({ files: FILES });
    const removes = collect<{ id: string; cancel: boolean }>(zone, 'nph-file-upload-remove');
    const retries = collect<{ id: string }>(zone, 'nph-file-upload-retry');
    (itemsOf(zone)[0]?.shadowRoot?.querySelector('.remove') as HTMLElement).click();
    (itemsOf(zone)[1]?.shadowRoot?.querySelector('.retry') as HTMLElement).click();
    expect(removes).toEqual([{ id: 'a', cancel: true }]);
    expect(retries).toEqual([{ id: 'b' }]);
  });

  it('removes nothing by itself: the page takes the file out of the list', async () => {
    const zone = await mount({ files: FILES });
    (itemsOf(zone)[2]?.shadowRoot?.querySelector('.remove') as HTMLElement).click();
    await settle(zone);
    expect(itemsOf(zone)).toHaveLength(3);
    expect(zone.files).toHaveLength(3);
  });
});

describe('the language of the sizes: the closest lang, through the ancestors and the shadow roots', () => {
  it('writes the size in the language of an ancestor, not of the document', async () => {
    document.documentElement.lang = 'en';
    const holder = document.createElement('section');
    holder.lang = 'pt-BR';
    const zone = document.createElement('nph-file-upload');
    Object.assign(zone, { ...TEXTS, files: [{ id: 'a', name: 'a.pdf', size: 2_400_000 }] });
    holder.append(zone);
    document.body.append(holder);
    await settle(zone);
    expect(textOf(itemsOf(zone)[0]?.shadowRoot?.querySelector('.meta') ?? null)).toBe('PDF · 2,4 MB');
    holder.lang = 'en';
    zone.requestUpdate();
    for (const item of itemsOf(zone)) item.requestUpdate();
    await settle(zone);
    expect(textOf(itemsOf(zone)[0]?.shadowRoot?.querySelector('.meta') ?? null)).toBe('PDF · 2.4 MB');
    document.documentElement.lang = '';
  });
});

describe('the icon of the zone reads the token of the zone', () => {
  it('an override of file-upload/icon-size changes the icon, and only the icon of the zone', async () => {
    const zone = await mount({ files: FILES });
    expect(icon(zone).getBoundingClientRect().width).toBe(px('--nph-file-upload-icon-size'));
    zone.style.setProperty('--nph-file-upload-icon-size', '40px');
    await settle(zone);
    expect(icon(zone).getBoundingClientRect().width).toBe(40);
    const inner = itemsOf(zone)[0]?.shadowRoot?.querySelector('.type-icon') as HTMLElement;
    expect(inner.getBoundingClientRect().width).toBe(px('--nph-icon-size-sm'));
  });
});

describe('the focus', () => {
  const sent = (...ids: string[]): NphFileUploadEntry[] => ids.map((id) => ({ id, name: `${id}.pdf`, status: 'sent' as const }));

  /** The person clicks the × of an item; the page then sets the list without it. */
  async function removeFrom(zone: NphFileUpload, id: string, next: NphFileUploadEntry[]): Promise<void> {
    const item = itemsOf(zone).find((candidate) => candidate.fileId === id) as NphFileUploadItem;
    item.focusRemove();
    (item.shadowRoot?.querySelector('.remove') as HTMLElement).click();
    zone.files = next;
    await settle(zone);
    await wait(30);
  }

  const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
  const activeRemove = (zone: NphFileUpload): string | undefined => {
    const active = root(zone).activeElement as NphFileUploadItem | null;
    return active?.fileId ?? undefined;
  };

  it('goes to the × of the next item after a removal', async () => {
    const zone = await mount({ files: sent('a', 'b', 'c') });
    await removeFrom(zone, 'b', sent('a', 'c'));
    expect(activeRemove(zone)).toBe('c');
    const item = root(zone).activeElement as NphFileUploadItem;
    expect(item.shadowRoot?.activeElement).toBe(item.shadowRoot?.querySelector('.remove'));
  });

  it('goes to the × of the previous item when the removed one was the last', async () => {
    const zone = await mount({ files: sent('a', 'b', 'c') });
    await removeFrom(zone, 'c', sent('a', 'b'));
    expect(activeRemove(zone)).toBe('b');
  });

  it('goes to the button when the list is empty', async () => {
    const zone = await mount({ files: sent('a') });
    await removeFrom(zone, 'a', []);
    expect(root(zone).activeElement).toBe(choose(zone));
  });

  it('goes to the × of the same item after "Try again", because the button leaves', async () => {
    const zone = await mount({ files: [{ id: 'e', name: 'e.pdf', status: 'error', reason: 'No.' }] });
    const item = itemsOf(zone)[0] as NphFileUploadItem;
    expect(item.focusRetry()).toBe(true);
    (item.shadowRoot?.querySelector('.retry') as HTMLElement).click();
    zone.files = [{ id: 'e', name: 'e.pdf', status: 'uploading', progress: 0 }];
    await settle(zone);
    await wait(30);
    expect(activeRemove(zone)).toBe('e');
    expect(item.shadowRoot?.activeElement).toBe(item.shadowRoot?.querySelector('.remove'));
    expect(item.shadowRoot?.querySelector('.remove')?.getAttribute('label')).toBe('Cancel upload of e.pdf');
  });

  it('does not move while the page has not taken the file out', async () => {
    const zone = await mount({ files: sent('a', 'b') });
    const item = itemsOf(zone)[0] as NphFileUploadItem;
    item.focusRemove();
    (item.shadowRoot?.querySelector('.remove') as HTMLElement).click();
    zone.files = sent('a', 'b').map((entry) => ({ ...entry, reason: 'changed' }));
    await settle(zone);
    await wait(30);
    expect(activeRemove(zone)).toBe('a');
  });

  it('forgets what waited for the page when the zone leaves, and never moves a focus afterwards', async () => {
    const zone = await mount({ files: sent('a', 'b') });
    const item = itemsOf(zone)[0] as NphFileUploadItem;
    (item.shadowRoot?.querySelector('.remove') as HTMLElement).click();
    const holder = zone.parentElement as HTMLElement;
    holder.remove();
    zone.files = sent('b');
    await zone.updateComplete;
    document.body.append(holder);
    await settle(zone);
    await wait(30);
    expect(root(zone).activeElement).toBeNull();
  });

  it('does not take the focus away from where the person went', async () => {
    const outside = document.createElement('button');
    document.body.append(outside);
    const zone = await mount({ files: sent('a', 'b') });
    const item = itemsOf(zone)[0] as NphFileUploadItem;
    (item.shadowRoot?.querySelector('.remove') as HTMLElement).click();
    outside.focus();
    zone.files = sent('b');
    await settle(zone);
    await wait(30);
    expect(document.activeElement).toBe(outside);
  });

  it('Tab goes through the button, then each item in visual order, the name link, "Try again" and the ×', async () => {
    const zone = await mount({ files: FILES });
    const order: string[] = [];
    for (let step = 0; step < 6; step += 1) {
      await userEvent.tab();
      const item = root(zone).activeElement;
      if (item === choose(zone)) order.push('choose');
      else if (item instanceof HTMLElement && item.tagName === 'NPH-FILE-UPLOAD-ITEM') {
        const inner = (item as NphFileUploadItem).shadowRoot?.activeElement;
        order.push(`${(item as NphFileUploadItem).fileId ?? ''}:${inner?.classList[0] ?? ''}`);
      }
    }
    expect(order).toEqual(['choose', 'a:remove', 'b:retry', 'b:remove', 'c:name', 'c:remove']);
  });

  it('focus() on the host goes to the button, as the label of nph-field asks', async () => {
    const zone = await mount();
    zone.focus();
    expect(root(zone).activeElement).toBe(choose(zone));
  });
});

describe('the live region', () => {
  it('is one polite region of the component, and says nothing on the first render', async () => {
    const zone = await mount({ files: FILES });
    expect(live(zone).getAttribute('aria-live')).toBe('polite');
    expect(root(zone).querySelectorAll('[aria-live]')).toHaveLength(1);
    expect(textOf(live(zone))).toBe('');
  });

  it('announces the files added, as a count, and not the ones that arrive done', async () => {
    const zone = await mount({ files: [FILES[2] as NphFileUploadEntry] });
    zone.files = [
      ...(zone.files as NphFileUploadEntry[]),
      { id: 'x', name: 'x.pdf' },
      { id: 'y', name: 'y.pdf' },
      { id: 'z', name: 'z.pdf', status: 'done', href: '/z.pdf' },
    ];
    await settle(zone);
    expect(textOf(live(zone))).toBe('2 files added');
  });

  it('announces a file that was sent, with its name', async () => {
    const zone = await mount({ files: [{ id: 'a', name: 'a.pdf', status: 'uploading', progress: 80 }] });
    zone.files = [{ id: 'a', name: 'a.pdf', status: 'sent' }];
    await settle(zone);
    expect(textOf(live(zone))).toBe('a.pdf sent');
  });

  it('announces an error with the name and the reason, also when the file comes in error', async () => {
    const zone = await mount({ files: [{ id: 'a', name: 'a.pdf', status: 'uploading', progress: 80 }] });
    zone.files = [{ id: 'a', name: 'a.pdf', status: 'error', reason: 'Network failure while uploading.' }];
    await settle(zone);
    expect(textOf(live(zone))).toBe('Error: a.pdf not sent. Network failure while uploading.');
    zone.files = [...(zone.files as NphFileUploadEntry[]), { id: 'big', name: 'big.pdf', status: 'error', reason: 'Larger than 5 MB.' }];
    await settle(zone);
    expect(textOf(live(zone))).toBe('Error: big.pdf not sent. Larger than 5 MB.');
  });

  it('announces the same message twice in a row: the region is cleared and written again', async () => {
    const zone = await mount({ files: [] });
    zone.files = [{ id: 'a', name: 'a.pdf' }];
    await settle(zone);
    expect(textOf(live(zone))).toBe('1 files added');
    zone.files = [...(zone.files as NphFileUploadEntry[]), { id: 'b', name: 'b.pdf' }];
    await zone.updateComplete;
    expect(textOf(live(zone))).toBe('');
    await settle(zone);
    expect(textOf(live(zone))).toBe('1 files added');
  });

  it('says a repeated failure again after Try again', async () => {
    const failed = { id: 'a', name: 'a.pdf', status: 'error' as const, reason: 'Network failure while uploading.' };
    const zone = await mount({ files: [{ id: 'a', name: 'a.pdf', status: 'uploading', progress: 5 }] });
    zone.files = [failed];
    await settle(zone);
    const first = textOf(live(zone));
    expect(first).toContain('Error: a.pdf not sent.');
    zone.files = [{ id: 'a', name: 'a.pdf', status: 'uploading', progress: 0 }];
    await settle(zone);
    zone.files = [failed];
    await zone.updateComplete;
    expect(textOf(live(zone))).toBe('');
    await settle(zone);
    expect(textOf(live(zone))).toBe(first);
  });

  it('says two changes of the same frame together, the second never replacing the first', async () => {
    const zone = await mount({ files: [{ id: 'a', name: 'a.pdf', status: 'uploading', progress: 80 }, { id: 'b', name: 'b.pdf' }] });
    zone.files = [{ id: 'a', name: 'a.pdf', status: 'sent' }, { id: 'b', name: 'b.pdf' }];
    await zone.updateComplete;
    zone.files = [{ id: 'a', name: 'a.pdf', status: 'sent' }];
    await settle(zone);
    expect(textOf(live(zone))).toBe('a.pdf sent b.pdf removed');
  });

  it('announces a removal, with the name', async () => {
    const zone = await mount({ files: [{ id: 'a', name: 'a.pdf' }, { id: 'b', name: 'b.pdf' }] });
    zone.files = [{ id: 'b', name: 'b.pdf' }];
    await settle(zone);
    expect(textOf(live(zone))).toBe('a.pdf removed');
  });

  it('says nothing for a change that is only the progress', async () => {
    const zone = await mount({ files: [{ id: 'a', name: 'a.pdf', status: 'uploading', progress: 10 }] });
    for (const progress of [20, 40, 64, 99]) {
      zone.files = [{ id: 'a', name: 'a.pdf', status: 'uploading', progress }];
      await settle(zone);
    }
    expect(textOf(live(zone))).toBe('');
  });

  it('never moves the focus', async () => {
    const zone = await mount({ files: [{ id: 'a', name: 'a.pdf', status: 'uploading', progress: 80 }] });
    zone.focus();
    zone.files = [{ id: 'a', name: 'a.pdf', status: 'sent' }];
    await settle(zone);
    expect(root(zone).activeElement).toBe(choose(zone));
  });

  it('keeps the progress out of it: the progress is in the text and in the progressbar of the item', async () => {
    const zone = await mount({ files: [{ id: 'a', name: 'a.pdf', status: 'uploading', progress: 64 }] });
    expect(textOf(live(zone))).not.toContain('64');
    const bar = itemsOf(zone)[0]?.shadowRoot?.querySelector('[role="progressbar"]');
    expect(bar?.getAttribute('aria-valuenow')).toBe('64');
  });
});

describe('semantics and the field–control contract', () => {
  it('is a group named by label, and not a button, with the icon out of the screen reader', async () => {
    const zone = await mount();
    expect(area(zone).getAttribute('role')).toBe('group');
    expect(area(zone).getAttribute('aria-label')).toBe('Attachments');
    expect(icon(zone).getAttribute('label') ?? '').toBe('');
    expect(root(zone).querySelectorAll('[role="button"]')).toHaveLength(0);
  });

  it('draws no role without a label: a group with no name says nothing', async () => {
    const zone = await mount({ label: '' });
    expect(area(zone).hasAttribute('role')).toBe(false);
    expect(area(zone).hasAttribute('aria-label')).toBe(false);
  });

  it('describes the group by the rule, and by the description of the field', async () => {
    const zone = await mount({ description: 'Send the signed contract.' });
    expect(area(zone).getAttribute('aria-describedby')).toBe('rule description');
    const ids = area(zone).getAttribute('aria-describedby')?.split(' ') ?? [];
    expect(textOf(root(zone).getElementById(ids[0] as string))).toBe('PDF, PNG or JPG · up to 5 MB · up to 5 files');
    expect(textOf(root(zone).getElementById(ids[1] as string))).toBe('Send the signed contract.');
  });

  it('describes the group by the reason when the zone is in error, in the same root', async () => {
    const zone = await mount({ error: 'File type not accepted.' });
    const target = root(zone).getElementById(area(zone).getAttribute('aria-describedby') as string);
    expect(textOf(target)).toBe('File type not accepted.');
  });

  it('takes the contract of nph-field: label, description, invalid, required and disabled exist', async () => {
    const zone = await mount();
    for (const key of ['label', 'description', 'invalid', 'required', 'disabled']) {
      expect(key in zone, key).toBe(true);
    }
  });

  it('is named and described by nph-field with no warning, and nph-field disables it', async () => {
    const field = document.createElement('nph-field') as NphField;
    field.label = 'Documents';
    field.required = true;
    field.help = 'PDF only.';
    const zone = document.createElement('nph-file-upload') as NphFileUpload;
    Object.assign(zone, { ...TEXTS, label: '' });
    field.append(zone);
    document.body.append(field);
    await field.updateComplete;
    await settle(zone);
    expect(zone.label).toBe('Documents');
    expect(zone.required).toBe(true);
    expect(zone.description).toBe('PDF only.');
    expect(area(zone).getAttribute('aria-label')).toBe('Documents');
    expect(warnings.mock.calls.map((call) => String(call[0])).join(' ')).not.toContain('does not take the field contract');
    field.disabled = true;
    await field.updateComplete;
    await settle(zone);
    expect(zone.disabled).toBe(true);
    expect(area(zone).dataset.state).toBe('disabled');
  });

  it('goes to error with the message of an invalid field as the reason, and never red with no reason', async () => {
    const field = document.createElement('nph-field') as NphField;
    field.label = 'Documents';
    const zone = document.createElement('nph-file-upload') as NphFileUpload;
    Object.assign(zone, { ...TEXTS, label: '' });
    field.append(zone);
    document.body.append(field);
    await field.updateComplete;
    await settle(zone);
    zone.invalid = true;
    await settle(zone);
    expect(area(zone).dataset.state).toBe('empty');
    field.error = 'Attach at least one file.';
    await field.updateComplete;
    await settle(zone);
    expect(zone.invalid).toBe(true);
    expect(area(zone).dataset.state).toBe('error');
    expect(textOf(part(zone, '.rule'))).toBe('Attach at least one file.');
    expect(root(zone).getElementById('description')).toBeNull();
  });

  it('takes the label from a click on the label of nph-field: the focus goes to the button', async () => {
    const field = document.createElement('nph-field') as NphField;
    field.label = 'Documents';
    const zone = document.createElement('nph-file-upload') as NphFileUpload;
    Object.assign(zone, { ...TEXTS, label: '' });
    field.append(zone);
    document.body.append(field);
    await field.updateComplete;
    await settle(zone);
    zone.focus();
    expect(root(zone).activeElement).toBe(choose(zone));
  });

  it('keeps the error of the zone out of the line of the field: the reason is in the zone', async () => {
    const zone = await mount({ error: 'File type not accepted.' });
    expect(textOf(part(zone, '.rule'))).toBe('File type not accepted.');
    expect(zone.invalid).toBe(false);
  });
});

describe('the thumbnail of an image', () => {
  /** A real picture of a given shape, so the crop can be proved. */
  async function picture(width: number, height: number, name = 'photo.png'): Promise<File> {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    context.fillStyle = 'rgb(255, 0, 0)';
    context.fillRect(0, 0, width, height);
    context.fillStyle = 'rgb(0, 0, 255)';
    context.fillRect(width / 3, 0, width / 3, height);
    const blob = await new Promise<Blob>((resolve) => canvas.toBlob((value) => resolve(value as Blob), 'image/png'));
    return new File([blob], name, { type: 'image/png' });
  }

  async function pixels(url: string): Promise<{ width: number; height: number; at: (x: number, y: number) => number[] }> {
    const image = new Image();
    image.src = url;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    context.drawImage(image, 0, 0);
    return { width: image.naturalWidth, height: image.naturalHeight, at: (x, y) => [...context.getImageData(x, y, 1, 1).data] };
  }

  it('makes a square of 64 × 64 from the center of a wide picture', async () => {
    const url = await makeThumbnail(await picture(300, 100));
    expect(url).not.toBeNull();
    const result = await pixels(url as string);
    expect([result.width, result.height]).toEqual([NPH_FILE_UPLOAD_THUMBNAIL_SIDE, NPH_FILE_UPLOAD_THUMBNAIL_SIDE]);
    expect(NPH_FILE_UPLOAD_THUMBNAIL_SIDE).toBe(64);
    /* The cut keeps the middle 100 × 100 of the 300 × 100: it is the blue band, edge to edge. */
    expect(result.at(32, 32)).toEqual([0, 0, 255, 255]);
    expect(result.at(2, 32)).toEqual([0, 0, 255, 255]);
    expect(result.at(61, 32)).toEqual([0, 0, 255, 255]);
    URL.revokeObjectURL(url as string);
  });

  it('makes a square from the center of a tall picture, with the same crop that covers the box', async () => {
    const url = await makeThumbnail(await picture(100, 300, 'tall.png'));
    const result = await pixels(url as string);
    expect([result.width, result.height]).toEqual([64, 64]);
    URL.revokeObjectURL(url as string);
  });

  it('gives null for a file that is no picture', async () => {
    expect(await makeThumbnail(new Blob(['not a picture'], { type: 'image/png' }))).toBeNull();
  });

  it('makes the thumbnail of an image entry and hands it to the item, in nph-image', async () => {
    const photo = await picture(200, 100);
    const zone = await mount({ files: [{ id: 'p', name: 'photo.png', file: photo }] });
    await vi.waitFor(() => expect(itemsOf(zone)[0]?.thumbnail).toMatch(/^blob:/), { timeout: 3000 });
    await settle(zone);
    const item = itemsOf(zone)[0] as NphFileUploadItem;
    expect(item.shadowRoot?.querySelector('.box nph-image')?.getAttribute('src')).toMatch(/^blob:/);
  });

  it('shows the file-image icon while the thumbnail is being made, as the nph-image does not wait', async () => {
    const zone = await mount({ files: [{ id: 'p', name: 'photo.png', kind: 'image' }] });
    expect(itemsOf(zone)[0]?.shadowRoot?.querySelector('.box nph-icon')?.getAttribute('name')).toBe('file-image');
  });

  it('uses the thumbnail the page gives, and makes none', async () => {
    const photo = await picture(200, 100);
    const zone = await mount({ files: [{ id: 'p', name: 'photo.png', file: photo, thumbnail: '/thumbs/p.png' }] });
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(itemsOf(zone)[0]?.thumbnail).toBe('/thumbs/p.png');
  });

  it('gives the address back when the entry leaves and when the zone leaves the page', async () => {
    const revoke = vi.spyOn(URL, 'revokeObjectURL');
    const zone = await mount({ files: [{ id: 'p', name: 'photo.png', file: await picture(100, 100) }] });
    await vi.waitFor(() => expect(itemsOf(zone)[0]?.thumbnail).toMatch(/^blob:/), { timeout: 3000 });
    const url = itemsOf(zone)[0]?.thumbnail as string;
    zone.files = [];
    await settle(zone);
    expect(revoke).toHaveBeenCalledWith(url);
    revoke.mockClear();
    zone.files = [{ id: 'q', name: 'photo.png', file: await picture(100, 100, 'q.png') }];
    await vi.waitFor(() => expect(itemsOf(zone)[0]?.thumbnail).toMatch(/^blob:/), { timeout: 3000 });
    const second = itemsOf(zone)[0]?.thumbnail as string;
    zone.remove();
    expect(revoke).toHaveBeenCalledWith(second);
  });

  it('shows no thumbnail of the old file while the new one is made, and the icon when it cannot be read', async () => {
    const zone = await mount({ files: [{ id: 'p', name: 'photo.png', file: await picture(100, 100) }] });
    await vi.waitFor(() => expect(itemsOf(zone)[0]?.thumbnail).toMatch(/^blob:/), { timeout: 3000 });
    const broken = new File(['not a picture'], 'broken.png', { type: 'image/png' });
    zone.files = [{ id: 'p', name: 'broken.png', file: broken }];
    await settle(zone);
    expect(itemsOf(zone)[0]?.thumbnail).toBeNull();
    await new Promise((resolve) => setTimeout(resolve, 150));
    await settle(zone);
    expect(itemsOf(zone)[0]?.thumbnail).toBeNull();
    expect(itemsOf(zone)[0]?.shadowRoot?.querySelector('.box nph-icon')?.getAttribute('name')).toBe('file-image');
  });

  it('makes no thumbnail again after the zone left the page, and every address is given back', async () => {
    const make = vi.spyOn(URL, 'createObjectURL');
    const revoke = vi.spyOn(URL, 'revokeObjectURL');
    const zone = await mount({ files: [{ id: 'p', name: 'photo.png', file: await picture(100, 100) }] });
    await vi.waitFor(() => expect(itemsOf(zone)[0]?.thumbnail).toMatch(/^blob:/), { timeout: 3000 });
    zone.parentElement?.remove();
    await zone.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 200));
    const made = make.mock.calls.length;
    const given = revoke.mock.calls.length;
    expect(made).toBeGreaterThan(0);
    expect(given).toBe(made);
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(make.mock.calls.length).toBe(made);
  });

  it('gives the address back at once when the entry stops being an image', async () => {
    const revoke = vi.spyOn(URL, 'revokeObjectURL');
    const zone = await mount({ files: [{ id: 'p', name: 'photo.png', file: await picture(100, 100) }] });
    await vi.waitFor(() => expect(itemsOf(zone)[0]?.thumbnail).toMatch(/^blob:/), { timeout: 3000 });
    const url = itemsOf(zone)[0]?.thumbnail as string;
    zone.files = [{ id: 'p', name: 'photo.png', kind: 'file', file: await picture(100, 100) }];
    await settle(zone);
    expect(revoke).toHaveBeenCalledWith(url);
    expect(itemsOf(zone)[0]?.thumbnail).toBeNull();
  });

  it('makes a new thumbnail when the file of the same entry changes, and gives the old one back', async () => {
    const revoke = vi.spyOn(URL, 'revokeObjectURL');
    const zone = await mount({ files: [{ id: 'p', name: 'photo.png', file: await picture(100, 100) }] });
    await vi.waitFor(() => expect(itemsOf(zone)[0]?.thumbnail).toMatch(/^blob:/), { timeout: 3000 });
    const first = itemsOf(zone)[0]?.thumbnail as string;
    zone.files = [{ id: 'p', name: 'photo.png', file: await picture(100, 100, 'other.png') }];
    await vi.waitFor(() => expect(itemsOf(zone)[0]?.thumbnail).not.toBe(first), { timeout: 3000 });
    expect(revoke).toHaveBeenCalledWith(first);
  });
});

describe('invalid input draws nothing and says it once per cause, only in development', () => {
  it('a files that is not a list', async () => {
    const zone = await mount({ files: 'nope' as unknown as NphFileUploadEntry[] });
    expect(root(zone).querySelector('.root')).toBeNull();
    expect(zone.hasAttribute('data-nph-rendered')).toBe(false);
    expect(errors).toHaveBeenCalledTimes(1);
    zone.requestUpdate();
    await zone.updateComplete;
    expect(errors).toHaveBeenCalledTimes(1);
  });

  it('an entry with no id or no name, and a repeated id', async () => {
    const cases: unknown[][] = [[{ name: 'a' }], [{ id: 'a' }], [null], [{ id: 'a', name: 'a' }, { id: 'a', name: 'b' }]];
    for (const files of cases) {
      errors.mockClear();
      const zone = await mount({ files: files as NphFileUploadEntry[] });
      expect(root(zone).querySelector('.root'), JSON.stringify(files)).toBeNull();
      expect(errors, JSON.stringify(files)).toHaveBeenCalledTimes(1);
    }
  });

  it('a status or a kind outside the list, and an upload with no progress', async () => {
    const cases: Partial<NphFileUploadEntry>[] = [
      { status: 'nope' as never },
      { kind: 'video' as never },
      { status: 'uploading' },
      { status: 'uploading', progress: 120 },
      { status: 'done', href: 'javascript:alert(1)' },
    ];
    for (const extra of cases) {
      errors.mockClear();
      const zone = await mount({ files: [{ id: 'a', name: 'a.pdf', ...extra }] });
      expect(root(zone).querySelector('.root'), JSON.stringify(extra)).toBeNull();
      expect(errors, JSON.stringify(extra)).toHaveBeenCalledTimes(1);
    }
  });

  it('a format or a size outside the list, and a max-size or max-files that is not a positive number', async () => {
    for (const props of [{ format: 'wide' }, { size: 'compact' }, { maxSize: 0 }, { maxFiles: -1 }, { maxFiles: Number.NaN }]) {
      errors.mockClear();
      const zone = await mount(props as Partial<NphFileUpload>);
      expect(root(zone).querySelector('.root'), JSON.stringify(props)).toBeNull();
      expect(errors, JSON.stringify(props)).toHaveBeenCalledTimes(1);
    }
  });

  it('draws again when the input is fixed, with nothing left over', async () => {
    const zone = await mount({ files: [{ id: 'a', name: 'a.pdf', status: 'uploading' }] });
    expect(root(zone).querySelector('.root')).toBeNull();
    zone.files = [{ id: 'a', name: 'a.pdf', status: 'uploading', progress: 5 }];
    await settle(zone);
    expect(itemsOf(zone)).toHaveLength(1);
    expect(zone.hasAttribute('data-nph-rendered')).toBe(true);
  });

  it('takes up no space while invalid', async () => {
    const zone = await mount({ format: 'wide' as never });
    expect(zone.getBoundingClientRect().height).toBe(0);
    expect(getComputedStyle(zone).display).toBe('none');
  });

  it('an empty list is a mount: the zone alone, and no error', async () => {
    const zone = await mount({ files: [] });
    expect(errors).not.toHaveBeenCalled();
    expect(area(zone)).not.toBeNull();
  });
});

describe('the texts the consumer owes', () => {
  it('draws without the button text and warns once, naming the property', async () => {
    const zone = await mount({ buttonText: '' });
    zone.requestUpdate();
    await zone.updateComplete;
    expect(warnings).toHaveBeenCalledTimes(1);
    expect(String(warnings.mock.calls[0]?.[0])).toContain('button-text');
  });

  it('warns about the limit phrase when the limit is reached without it', async () => {
    await mount({ maxFiles: 3, files: FILES, limitText: '' });
    expect(warnings.mock.calls.map((call) => String(call[0])).join(' ')).toContain('limit-text');
  });

  it('keeps the prompt when the limit phrase is missing, so the zone never goes blank', async () => {
    const zone = await mount({ maxFiles: 3, files: FILES, limitText: '' });
    expect(textOf(part(zone, '.phrase'))).toBe('Drag files here or');
  });

  it('says nothing when every text is there', async () => {
    await mount({ files: FILES });
    expect(warnings).not.toHaveBeenCalled();
    expect(errors).not.toHaveBeenCalled();
  });
});

describe('the token contract: no literal design value in the CSS', () => {
  const css = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');

  it('uses only file-upload tokens and the text roles', () => {
    const used = [...css.matchAll(/var\((--nph-[\w-]+)/g)].map((match) => match[1] as string);
    expect(used.length).toBeGreaterThan(30);
    for (const name of used) {
      expect(name.startsWith('--nph-file-upload-') || name.startsWith('--nph-text-'), name).toBe(true);
    }
  });

  it('never reads a core or theme token', () => {
    expect(css).not.toMatch(/var\(--nph-(core|theme)-/);
  });

  it('writes no color, no time and no length except the one threshold of the compact format and the hidden box', () => {
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(css).not.toMatch(/\brgba?\(/);
    expect([...css.matchAll(/\b\d+(\.\d+)?(ms|s|px|em)\b/g)].map((match) => match[0])).toEqual(['1px', '1px', '1px']);
    const rems = [...css.matchAll(/\b\d+(\.\d+)?rem\b/g)].map((match) => match[0]);
    expect(rems).toEqual(['41.75rem']);
  });

  it('writes the dashed border as the stroke style the token will give, with the gate recorded', () => {
    expect(css).toContain('border-style: dashed');
    expect(componentCss).toContain('stroke-style-token');
  });
});
