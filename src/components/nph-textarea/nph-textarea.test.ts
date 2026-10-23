/**
 * Tests of `nph-textarea` (P93), in a real browser (P21, item 5): resolved color, real
 * hover, focus, form submission, the growth of the field and the accessibility tree only
 * exist where there is layout and a form.
 *
 * They prove the contract accepted in Figma (frame `1632:24`, documentation `1922:642`,
 * set `1632:22`) and P93: the API, the form association copied from P80 with its two
 * divergences (Enter writes a line; `readonly`), the accessible name and description,
 * the events, the growth between the two height tokens, the footer with counter and
 * actions, the seven states and their precedence, the field–control contract of P83
 * and the token contract.
 *
 * The accessible name is read from the accessibility tree of Chromium, through the
 * DevTools protocol: the name reaches the inner field by element reference
 * (`ariaLabelledByElements`), which no attribute shows.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cdp, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import designMd from '../../../design.md?raw';
import componentCss from './nph-textarea.css?raw';
import componentTs from './nph-textarea.ts?raw';
import '../nph-button/nph-button';
import '../nph-field/nph-field';
import '../nph-label/nph-label';
import { NphTextarea } from './nph-textarea';

type Props = Partial<
  Pick<
    NphTextarea,
    'value' | 'placeholder' | 'name' | 'required' | 'disabled' | 'readOnly' | 'invalid' | 'label' | 'description' | 'counter'
  >
>;

type Updatable = HTMLElement & { updateComplete: Promise<unknown> };
type Button = Updatable & { disabled: boolean };

beforeAll(async () => {
  await document.fonts.load('400 14px "Noto Sans"');
  await document.fonts.ready;
});

afterEach(async () => {
  await userEvent.unhover(document.body).catch(() => {});
  document.body.replaceChildren();
  document.documentElement.removeAttribute('data-nph-color-scheme');
  vi.restoreAllMocks();
});

async function mount(props: Props = { label: 'Comment' }, parent: HTMLElement = document.body): Promise<NphTextarea> {
  const element = document.createElement('nph-textarea');
  Object.assign(element, props);
  parent.append(element);
  await element.updateComplete;
  return element;
}

/** Mounts from markup, so the attributes arrive as a parser would give them. */
async function markup(source: string, parent: HTMLElement = document.body): Promise<HTMLElement> {
  const holder = document.createElement('div');
  holder.innerHTML = source;
  parent.append(holder);
  const pieces = [...holder.querySelectorAll<Updatable>('nph-textarea, nph-label, nph-button, nph-field')];
  await Promise.all(pieces.map((element) => element.updateComplete));
  await Promise.all(pieces.map((element) => element.updateComplete));
  return holder;
}

function field(element: NphTextarea): HTMLTextAreaElement {
  const textarea = element.shadowRoot?.querySelector<HTMLTextAreaElement>('textarea');
  if (!textarea) throw new Error('no inner <textarea>');
  return textarea;
}

function container(element: NphTextarea): HTMLElement {
  const box = element.shadowRoot?.querySelector<HTMLElement>('.control');
  if (!box) throw new Error('no container');
  return box;
}

function footer(element: NphTextarea): HTMLElement {
  const part = element.shadowRoot?.querySelector<HTMLElement>('.footer');
  if (!part) throw new Error('no footer');
  return part;
}

function counter(element: NphTextarea): HTMLElement | null {
  return element.shadowRoot?.querySelector<HTMLElement>('.counter') ?? null;
}

function shown(part: HTMLElement): boolean {
  return getComputedStyle(part).display !== 'none' && part.getBoundingClientRect().height > 0;
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

function nextTask(): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, 0));
}

function resolved(property: string, token: string, parent: HTMLElement = document.body): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  parent.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

function px(token: string): number {
  return Number.parseFloat(resolved('width', token));
}

/** `count` lines of text, separated by line breaks. */
function lines(count: number): string {
  return Array.from({ length: count }, (_, position) => `Line ${position + 1}`).join('\n');
}

/** Two actions in the footer, as the evidence names them. */
async function withActions(props: Props = { label: 'Comment' }): Promise<{ element: NphTextarea; attach: Button; send: Button }> {
  const holder = await markup(
    '<nph-textarea><nph-button slot="actions" emphasis="ghost" text="Attach"></nph-button><nph-button slot="actions" text="Send"></nph-button></nph-textarea>',
  );
  const element = holder.querySelector('nph-textarea') as NphTextarea;
  Object.assign(element, props);
  await element.updateComplete;
  const [attach, send] = [...element.querySelectorAll<Button>('nph-button')] as [Button, Button];
  await Promise.all([attach.updateComplete, send.updateComplete]);
  return { element, attach, send };
}

/** The node of the inner field in the accessibility tree of Chromium (see `nph-input.test.ts`). */
interface AXNode {
  role?: { value?: string };
  name?: { value?: string };
  description?: { value?: string };
  properties?: Array<{ name: string; value?: { value?: unknown } }>;
}

async function accessibleNodeOf(element: NphTextarea): Promise<AXNode> {
  const textarea = field(element);
  const session = cdp();
  await session.send('Accessibility.enable');
  textarea.setAttribute('data-ax-probe', '');
  try {
    await session.send('DOM.getDocument', { depth: -1, pierce: true });
    const { searchId, resultCount } = await session.send('DOM.performSearch', { query: '[data-ax-probe]', includeUserAgentShadowDOM: false });
    expect(resultCount).toBe(1);
    const { nodeIds } = await session.send('DOM.getSearchResults', { searchId, fromIndex: 0, toIndex: 1 });
    await session.send('DOM.discardSearchResults', { searchId });
    const { nodes } = await session.send('Accessibility.getPartialAXTree', { nodeId: nodeIds[0] as number, fetchRelatives: false });
    return (nodes[0] ?? {}) as AXNode;
  } finally {
    textarea.removeAttribute('data-ax-probe');
  }
}

describe('registration and API', () => {
  it('defines nph-textarea only once', () => {
    expect(customElements.get('nph-textarea')).toBe(NphTextarea);
  });

  it('the public API is exactly the one in P93', () => {
    const declared = [...(NphTextarea as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared.sort()).toEqual(
      ['counter', 'description', 'disabled', 'invalid', 'label', 'name', 'placeholder', 'readOnly', 'required', 'value'].sort(),
    );
  });

  it('the defaults: empty, editable, valid, enabled, no counter', async () => {
    const element = await mount({ label: 'Comment' });
    expect(element.value).toBe('');
    expect(element.placeholder).toBe('');
    expect(element.name).toBeNull();
    expect(element.required).toBe(false);
    expect(element.disabled).toBe(false);
    expect(element.readOnly).toBe(false);
    expect(element.invalid).toBe(false);
    expect(element.description).toBe('');
    expect(element.counter).toBe('');
  });

  it('name, required, disabled, readonly and invalid reflect to attributes', async () => {
    const element = await mount({ label: 'Comment', name: 'comment', required: true, disabled: true, readOnly: true, invalid: true });
    expect(element.getAttribute('name')).toBe('comment');
    expect(element.hasAttribute('required')).toBe(true);
    expect(element.hasAttribute('disabled')).toBe(true);
    expect(element.hasAttribute('readonly')).toBe(true);
    expect(element.hasAttribute('invalid')).toBe(true);
  });

  it('the readonly attribute is the readOnly property, as in the native field', async () => {
    const holder = await markup('<nph-textarea label="Notes" readonly></nph-textarea>');
    expect((holder.querySelector('nph-textarea') as NphTextarea).readOnly).toBe(true);
  });

  it('value is not reflected: typing never writes the attribute', async () => {
    const element = await mount();
    await userEvent.type(field(element), 'ana');
    expect(element.value).toBe('ana');
    expect(element.hasAttribute('value')).toBe(false);
  });

  it('is form-associated, with an open shadow root and delegated focus', async () => {
    const element = await mount();
    expect((NphTextarea as unknown as { formAssociated: boolean }).formAssociated).toBe(true);
    expect(element.shadowRoot?.mode).toBe('open');
    expect(element.shadowRoot?.delegatesFocus).toBe(true);
  });

  it('host focus goes to the inner native textarea', async () => {
    const element = await mount();
    element.focus();
    expect(element.shadowRoot?.activeElement).toBe(field(element));
  });

  it('passes placeholder, required and readonly to the inner field', async () => {
    const element = await mount({ label: 'Comment', placeholder: 'Write a comment', required: true, readOnly: true });
    const textarea = field(element);
    expect(textarea.placeholder).toBe('Write a comment');
    expect(textarea.required).toBe(true);
    expect(textarea.readOnly).toBe(true);
  });

  it('without placeholder, the inner field carries no placeholder attribute', async () => {
    expect(field(await mount()).hasAttribute('placeholder')).toBe(false);
  });
});

describe('value: the attribute is the default, the property is the current value', () => {
  it('the value attribute gives the initial value', async () => {
    const holder = await markup('<nph-textarea label="Notes" value="First line"></nph-textarea>');
    const element = holder.querySelector('nph-textarea') as NphTextarea;
    expect(element.value).toBe('First line');
    expect(field(element).value).toBe('First line');
  });

  it('keeps the line breaks: the value of a textarea is multi-line', async () => {
    const element = await mount({ label: 'Notes', value: 'a\nb\nc' });
    expect(element.value).toBe('a\nb\nc');
    expect(field(element).value).toBe('a\nb\nc');
  });

  it('changing the attribute before any edit changes the value', async () => {
    const element = await mount();
    element.setAttribute('value', 'Recife');
    await element.updateComplete;
    expect(element.value).toBe('Recife');
  });

  it('after the person edits, changing the attribute does not overwrite what was typed', async () => {
    const holder = await markup('<nph-textarea label="Notes" value="Recife"></nph-textarea>');
    const element = holder.querySelector('nph-textarea') as NphTextarea;
    await userEvent.clear(field(element));
    await userEvent.type(field(element), 'Natal');
    element.setAttribute('value', 'Olinda');
    await element.updateComplete;
    expect(element.value).toBe('Natal');
  });

  it('setting the property makes the field dirty, as in the native textarea', async () => {
    const element = await mount();
    element.value = 'Natal';
    element.setAttribute('value', 'Olinda');
    await element.updateComplete;
    expect(element.value).toBe('Natal');
    expect(field(element).value).toBe('Natal');
  });

  it('setting value from code fires neither input nor change', async () => {
    const element = await mount();
    const events = vi.fn();
    element.addEventListener('input', events);
    element.addEventListener('change', events);
    element.value = 'Natal';
    element.setAttribute('value', 'Olinda');
    await element.updateComplete;
    expect(events).not.toHaveBeenCalled();
  });

  it('null or undefined from code becomes empty', async () => {
    const element = await mount();
    element.value = null as unknown as string;
    await element.updateComplete;
    expect(element.value).toBe('');
  });

  it('accepts the value property and attribute before connecting', async () => {
    const property = document.createElement('nph-textarea') as NphTextarea;
    property.value = 'Recife';
    const attribute = document.createElement('nph-textarea') as NphTextarea;
    attribute.setAttribute('value', 'Natal');
    document.body.append(property, attribute);
    await Promise.all([property.updateComplete, attribute.updateComplete]);
    expect(property.value).toBe('Recife');
    expect(field(property).value).toBe('Recife');
    expect(attribute.value).toBe('Natal');
    expect(field(attribute).value).toBe('Natal');
  });
});

describe('form association', () => {
  async function inForm(source: string): Promise<{ form: HTMLFormElement; element: NphTextarea }> {
    const holder = await markup(`<form>${source}</form>`);
    return { form: holder.querySelector('form') as HTMLFormElement, element: holder.querySelector('nph-textarea') as NphTextarea };
  }

  it('the host knows its form, and the form data carries name=value with its line breaks', async () => {
    const { form, element } = await inForm('<nph-textarea label="Notes" name="notes" value="Recife"></nph-textarea>');
    expect(element.form).toBe(form);
    expect(new FormData(form).get('notes')).toBe('Recife');
    await userEvent.clear(field(element));
    await userEvent.type(field(element), 'a{Enter}b');
    expect(new FormData(form).get('notes')).toBe('a\nb');
  });

  it('name set by property reaches the form data, because it reflects', async () => {
    const { form, element } = await inForm('<nph-textarea label="Notes"></nph-textarea>');
    element.name = 'notes';
    element.value = 'Recife';
    await element.updateComplete;
    expect(new FormData(form).get('notes')).toBe('Recife');
  });

  it('form.reset() goes back to the value attribute, and fires nothing', async () => {
    const { form, element } = await inForm('<nph-textarea label="Notes" name="notes" value="Recife" required></nph-textarea>');
    await userEvent.clear(field(element));
    await userEvent.type(field(element), 'Natal');
    const events = vi.fn();
    element.addEventListener('input', events);
    element.addEventListener('change', events);
    element.value = '';
    expect(element.checkValidity()).toBe(false);
    form.reset();
    expect(element.value).toBe('Recife');
    expect(new FormData(form).get('notes')).toBe('Recife');
    expect(element.checkValidity()).toBe(true);
    await element.updateComplete;
    expect(field(element).value).toBe('Recife');
    expect(events).not.toHaveBeenCalled();
    element.setAttribute('value', 'Olinda');
    await element.updateComplete;
    expect(element.value).toBe('Olinda');
  });

  it('required and empty: the validity is the one of the inner field, with the browser message', async () => {
    const { form, element } = await inForm('<nph-textarea label="Notes" name="notes" required></nph-textarea>');
    expect(element.willValidate).toBe(true);
    expect(element.validity.valueMissing).toBe(true);
    expect(element.validationMessage).toBe(field(element).validationMessage);
    expect(element.validationMessage).not.toBe('');
    expect(form.checkValidity()).toBe(false);
    await userEvent.type(field(element), 'Recife');
    expect(element.checkValidity()).toBe(true);
    expect(form.checkValidity()).toBe(true);
  });

  it('synchronizes form data and validity before input and change listeners run', async () => {
    const { form, element } = await inForm('<nph-textarea label="Notes" name="notes" value="Recife" required></nph-textarea>');
    const seen: Array<{ type: string; value: string; formValue: FormDataEntryValue | null; valid: boolean }> = [];
    const readState = (event: Event) => {
      seen.push({ type: event.type, value: element.value, formValue: new FormData(form).get('notes'), valid: element.checkValidity() });
    };
    element.addEventListener('input', readState, { capture: true });
    element.addEventListener('change', readState);
    field(element).value = '';
    field(element).dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    field(element).dispatchEvent(new Event('change', { bubbles: true }));
    expect(seen).toEqual([
      { type: 'input', value: '', formValue: '', valid: false },
      { type: 'change', value: '', formValue: '', valid: false },
    ]);
  });

  it('readonly: in the form data, out of validation, as the native field (P93)', async () => {
    const { form, element } = await inForm('<nph-textarea label="Notes" name="notes" value="Fixed" readonly required></nph-textarea>');
    expect(new FormData(form).get('notes')).toBe('Fixed');
    expect(element.willValidate).toBe(false);
    element.value = '';
    await element.updateComplete;
    expect(element.checkValidity()).toBe(true);
    expect(form.checkValidity()).toBe(true);
    element.readOnly = false;
    await element.updateComplete;
    expect(element.validity.valueMissing).toBe(true);
  });

  it('readonly: the person cannot edit, but can focus and select', async () => {
    const element = await mount({ label: 'Notes', value: 'Fixed', readOnly: true });
    await userEvent.click(field(element));
    expect(element.shadowRoot?.activeElement).toBe(field(element));
    await userEvent.keyboard('abc');
    expect(element.value).toBe('Fixed');
    field(element).select();
    expect(field(element).selectionEnd - field(element).selectionStart).toBe('Fixed'.length);
  });

  it('invalid is not a constraint: it adds no customError', async () => {
    const element = await mount({ label: 'Notes', invalid: true, value: 'x' });
    expect(element.validity.customError).toBe(false);
    expect(element.checkValidity()).toBe(true);
  });

  it('reportValidity delegates to the internals', async () => {
    expect((await mount({ label: 'Notes', required: true })).reportValidity()).toBe(false);
  });

  it('a disabled fieldset disables the piece: out of the form data, out of validation, at the disabled look', async () => {
    const holder = await markup('<form><fieldset disabled><nph-textarea label="Notes" name="notes" value="Recife" required></nph-textarea></fieldset></form>');
    const form = holder.querySelector('form') as HTMLFormElement;
    const element = holder.querySelector('nph-textarea') as NphTextarea;
    expect(field(element).disabled).toBe(true);
    expect(new FormData(form).has('notes')).toBe(false);
    expect(element.willValidate).toBe(false);
    expect(element.matches(':disabled')).toBe(true);
    expect(getComputedStyle(element).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
    (holder.querySelector('fieldset') as HTMLFieldSetElement).disabled = false;
    await element.updateComplete;
    expect(field(element).disabled).toBe(false);
    expect(new FormData(form).get('notes')).toBe('Recife');
  });

  it('the first legend of a disabled fieldset keeps the piece enabled, as HTML does', async () => {
    const holder = await markup('<form><fieldset disabled><legend><nph-textarea label="Notes" name="notes" value="x"></nph-textarea></legend></fieldset></form>');
    const element = holder.querySelector('nph-textarea') as NphTextarea;
    expect(element.matches(':disabled')).toBe(false);
    expect(field(element).disabled).toBe(false);
  });

  it('disabled leaves the piece out of the form data', async () => {
    const { form, element } = await inForm('<nph-textarea label="Notes" name="notes" value="Recife" disabled></nph-textarea>');
    expect(field(element).disabled).toBe(true);
    expect(new FormData(form).has('notes')).toBe(false);
  });

  it('the history restore puts the value back', async () => {
    const element = await mount();
    element.formStateRestoreCallback('Recife');
    await element.updateComplete;
    expect(element.value).toBe('Recife');
  });

  it('Enter writes a new line and does not submit the form (P93, divergence from P80)', async () => {
    const { form, element } = await inForm('<nph-textarea label="Notes" name="notes"></nph-textarea><button type="submit">Send</button>');
    const submitted = vi.fn((event: Event) => event.preventDefault());
    form.addEventListener('submit', submitted);
    field(element).focus();
    await userEvent.keyboard('a{Enter}b');
    await nextTask();
    expect(submitted).not.toHaveBeenCalled();
    expect(element.value).toBe('a\nb');
  });

  it('has no keydown of its own', () => {
    expect(componentTs).not.toMatch(/keydown/i);
  });
});

describe('accessible name and description', () => {
  it('nph-label for names the field: the click moves the focus, and the tree has the name', async () => {
    const holder = await markup('<nph-label for="notes" text="Notes" required></nph-label><nph-textarea id="notes" required></nph-textarea>');
    const element = holder.querySelector('nph-textarea') as NphTextarea;
    await nextFrame();
    expect(element.labels.length).toBe(1);
    await userEvent.click(holder.querySelector('label') as HTMLLabelElement);
    expect(element.shadowRoot?.activeElement).toBe(field(element));
    const node = await accessibleNodeOf(element);
    expect(node.role?.value).toBe('textbox');
    expect(node.name?.value).toBe('Notes');
    expect(field(element).hasAttribute('aria-label')).toBe(false);
    expect(field(element).ariaLabelledByElements).toEqual([holder.querySelector('label')]);
  });

  it('the tree says the field is multi-line', async () => {
    const node = await accessibleNodeOf(await mount({ label: 'Notes' }));
    expect(node.properties?.find((property) => property.name === 'multiline')?.value?.value).toBe(true);
  });

  it('label is the name when no label is associated, as aria-label of the inner field', async () => {
    const element = await mount({ label: 'Comment' });
    expect(field(element).getAttribute('aria-label')).toBe('Comment');
    expect((await accessibleNodeOf(element)).name?.value).toBe('Comment');
  });

  it('an associated label wins over label', async () => {
    const holder = await markup('<nph-label for="notes" text="Notes"></nph-label><nph-textarea id="notes" label="Other"></nph-textarea>');
    const element = holder.querySelector('nph-textarea') as NphTextarea;
    await nextFrame();
    expect((await accessibleNodeOf(element)).name?.value).toBe('Notes');
  });

  it('description is the accessible description, in a clipped element, never display none', async () => {
    const element = await mount({ label: 'Notes', description: 'Up to 500 characters.' });
    const description = element.shadowRoot?.getElementById(field(element).getAttribute('aria-describedby') ?? '');
    expect(description?.textContent).toBe('Up to 500 characters.');
    expect(getComputedStyle(description as HTMLElement).display).not.toBe('none');
    expect(getComputedStyle(description as HTMLElement).clipPath).toBe('inset(50%)');
    expect((await accessibleNodeOf(element)).description?.value).toBe('Up to 500 characters.');
  });

  it('without description, there is no describedby and no hidden element', async () => {
    const element = await mount({ label: 'Notes' });
    expect(field(element).hasAttribute('aria-describedby')).toBe(false);
    expect(element.shadowRoot?.querySelector('.description')).toBeNull();
  });

  it('the footer counter is not part of the accessible description', async () => {
    const element = await mount({ label: 'Comment', counter: '0/280' });
    expect(field(element).hasAttribute('aria-describedby')).toBe(false);
    expect((await accessibleNodeOf(element)).description?.value ?? '').toBe('');
  });

  it('the placeholder is not a name: with no name at all, one warning after the first frame, and the field renders', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const element = await mount({ placeholder: 'Write a comment' });
    await nextFrame();
    await nextFrame();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0]?.[0])).toContain('[nph-textarea]');
    expect(field(element)).toBeTruthy();
    await userEvent.type(field(element), 'a');
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('a label that arrives after the first render gives the name, with no warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const holder = await markup('<nph-textarea id="late"></nph-textarea>');
    const label = document.createElement('nph-label') as HTMLElement & { text: string; for: string };
    label.text = 'Late';
    label.for = 'late';
    holder.prepend(label);
    await nextFrame();
    await nextFrame();
    expect(warn).not.toHaveBeenCalled();
  });

  it('invalid puts aria-invalid on the inner field; disabled and readonly take it away', async () => {
    const element = await mount({ label: 'Notes', invalid: true });
    expect(field(element).getAttribute('aria-invalid')).toBe('true');
    element.readOnly = true;
    await element.updateComplete;
    expect(field(element).hasAttribute('aria-invalid')).toBe(false);
    element.readOnly = false;
    element.disabled = true;
    await element.updateComplete;
    expect(field(element).hasAttribute('aria-invalid')).toBe(false);
  });
});

describe('events', () => {
  it('typing fires the native input, composed, on the host; change on commit, once', async () => {
    const element = await mount();
    const outside = vi.fn();
    const inputs: Event[] = [];
    const changes: Event[] = [];
    document.body.addEventListener('change', outside);
    element.addEventListener('input', (event) => inputs.push(event));
    element.addEventListener('change', (event) => changes.push(event));
    await userEvent.type(field(element), 'ab');
    expect(inputs.length).toBe(2);
    expect(inputs.every((event) => event.composed && event.target === element)).toBe(true);
    expect(changes.length).toBe(0);
    field(element).blur();
    expect(changes.length).toBe(1);
    expect(changes[0]?.bubbles).toBe(true);
    expect(changes[0]?.target).toBe(element);
    expect(outside).toHaveBeenCalledTimes(1);
    document.body.removeEventListener('change', outside);
  });

  it('a listener reads the new value from the host when input fires', async () => {
    const element = await mount();
    const seen: string[] = [];
    element.addEventListener('input', () => seen.push(element.value));
    await userEvent.type(field(element), 'ab');
    expect(seen).toEqual(['a', 'ab']);
  });

  it('adds no event of its own', () => {
    expect(componentTs).not.toMatch(/new CustomEvent/);
    expect(componentTs).not.toMatch(/HTMLElementEventMap/);
  });
});

describe('growth and scroll', () => {
  it('empty, the field has layout/textarea-min-height: three lines of text/body-md plus the padding (D-1)', async () => {
    const element = await mount();
    const min = px('--nph-layout-textarea-min-height');
    expect(field(element).getBoundingClientRect().height).toBeCloseTo(min, 1);
    expect(min).toBe(3 * Number.parseFloat(resolved('line-height', '--nph-text-body-md-line-height')) + 2 * px('--nph-space-inline'));
  });

  it('grows with the text, line by line, above the minimum', async () => {
    const element = await mount({ label: 'Notes', value: lines(5) });
    const line = Number.parseFloat(resolved('line-height', '--nph-text-body-md-line-height'));
    expect(field(element).getBoundingClientRect().height).toBeCloseTo(5 * line + 2 * px('--nph-space-inline'), 1);
  });

  it('grows while the person types', async () => {
    const element = await mount();
    const before = field(element).getBoundingClientRect().height;
    await userEvent.type(field(element), 'a{Enter}b{Enter}c{Enter}d{Enter}e');
    expect(field(element).getBoundingClientRect().height).toBeGreaterThan(before);
  });

  it('stops at layout/textarea-max-height, and the text scrolls inside', async () => {
    const element = await mount({ label: 'Notes', value: lines(40) });
    const textarea = field(element);
    expect(textarea.getBoundingClientRect().height).toBeCloseTo(px('--nph-layout-textarea-max-height'), 1);
    expect(textarea.scrollHeight).toBeGreaterThan(textarea.clientHeight);
    expect(getComputedStyle(textarea).overflowY).toBe('auto');
  });

  it('a long line wraps: the field never scrolls sideways', async () => {
    const element = await mount({ label: 'Notes', value: 'word '.repeat(200) });
    const textarea = field(element);
    expect(textarea.scrollWidth).toBeLessThanOrEqual(textarea.clientWidth);
  });

  it('has no resize handle', async () => {
    expect(getComputedStyle(field(await mount())).resize).toBe('none');
  });

  it('the scroll area is the native field; the container does not clip, so the halo stays outside', async () => {
    const element = await mount({ label: 'Notes', value: lines(40) });
    expect(getComputedStyle(container(element)).overflow).toBe('visible');
    field(element).focus();
    const ring = getComputedStyle(container(element), '::after');
    const box = container(element).getBoundingClientRect();
    expect(Number.parseFloat(ring.height)).toBeCloseTo(box.height + 2 * px('--nph-focus-ring-width'), 1);
  });
});

describe('footer: counter and actions', () => {
  it('is not drawn with no counter and no action', async () => {
    const element = await mount();
    expect(shown(footer(element))).toBe(false);
    expect(container(element).getBoundingClientRect().height).toBeCloseTo(px('--nph-layout-textarea-min-height') + 2 * px('--nph-border-width'), 1);
  });

  it('the counter turns it on and shows its text as it comes', async () => {
    const element = await mount({ label: 'Comment', counter: '0/280' });
    expect(shown(footer(element))).toBe(true);
    expect(counter(element)?.textContent).toBe('0/280');
  });

  it('a counter of spaces counts as empty', async () => {
    const element = await mount({ label: 'Comment', counter: '   ' });
    expect(shown(footer(element))).toBe(false);
    expect(counter(element)).toBeNull();
  });

  it('the counter follows the consumer: the piece counts nothing', async () => {
    const element = await mount({ label: 'Comment', counter: '0/280' });
    await userEvent.type(field(element), 'abc');
    expect(counter(element)?.textContent).toBe('0/280');
    element.counter = '3/280';
    await element.updateComplete;
    expect(counter(element)?.textContent).toBe('3/280');
  });

  it('the counter is text/caption in color/muted-foreground, never the error color', async () => {
    const element = await mount({ label: 'Comment', counter: '300/280', invalid: true });
    const style = getComputedStyle(counter(element) as HTMLElement);
    expect(style.fontSize).toBe(resolved('font-size', '--nph-text-caption-font-size'));
    expect(style.lineHeight).toBe(resolved('line-height', '--nph-text-caption-line-height'));
    expect(style.color).toBe(resolved('color', '--nph-color-muted-foreground'));
  });

  it('an action in the actions slot turns it on', async () => {
    const { element } = await withActions();
    expect(shown(footer(element))).toBe(true);
    const slot = element.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="actions"]');
    expect(slot?.assignedElements().length).toBe(2);
  });

  it('an action added later turns it on; removing every action turns it off', async () => {
    const element = await mount();
    const button = document.createElement('nph-button') as Button;
    button.setAttribute('slot', 'actions');
    button.setAttribute('text', 'Send');
    element.append(button);
    await nextFrame();
    await element.updateComplete;
    expect(shown(footer(element))).toBe(true);
    button.remove();
    await nextFrame();
    await element.updateComplete;
    expect(shown(footer(element))).toBe(false);
  });

  it('sits inside the box, space/stack below the text: the padding of the field is part of it (D-3)', async () => {
    const { element } = await withActions({ label: 'Comment', counter: '0/280' });
    const box = container(element).getBoundingClientRect();
    const part = footer(element).getBoundingClientRect();
    const textarea = field(element);
    const textBottom = textarea.getBoundingClientRect().bottom - Number.parseFloat(getComputedStyle(textarea).paddingBottom);
    expect(part.top - textBottom).toBeCloseTo(px('--nph-space-stack'), 1);
    expect(part.bottom).toBeCloseTo(box.bottom - px('--nph-border-width'), 1);
    const contentBottom = part.bottom - Number.parseFloat(getComputedStyle(footer(element)).paddingBottom);
    expect(box.bottom - px('--nph-border-width') - contentBottom).toBeCloseTo(px('--nph-space-inline'), 1);
    expect(part.left).toBeCloseTo(box.left + px('--nph-border-width'), 1);
    expect(part.right).toBeCloseTo(box.right - px('--nph-border-width'), 1);
    expect(getComputedStyle(footer(element)).paddingInlineStart).toBe(resolved('padding-left', '--nph-space-control-padding'));
    expect(getComputedStyle(footer(element)).paddingInlineEnd).toBe(resolved('padding-left', '--nph-space-control-padding'));
  });

  it('counter at the start, actions at the end, space/inline between the actions (D-3)', async () => {
    const { element, attach, send } = await withActions({ label: 'Comment', counter: '0/280' });
    const part = footer(element).getBoundingClientRect();
    const count = (counter(element) as HTMLElement).getBoundingClientRect();
    const a = attach.getBoundingClientRect();
    const b = send.getBoundingClientRect();
    expect(count.left).toBeCloseTo(part.left + px('--nph-space-control-padding'), 1);
    expect(b.right).toBeCloseTo(part.right - px('--nph-space-control-padding'), 1);
    expect(b.left - a.right).toBeCloseTo(px('--nph-space-inline'), 1);
    expect(a.left).toBeGreaterThan(count.right);
  });

  it('a counter alone stays at the start (D-3)', async () => {
    const element = await mount({ label: 'Comment', counter: '0/280' });
    const box = container(element).getBoundingClientRect();
    const count = (counter(element) as HTMLElement).getBoundingClientRect();
    expect(count.left - box.left - px('--nph-border-width')).toBeCloseTo(px('--nph-space-control-padding'), 1);
  });

  it('readonly: no footer, even with content, and one warning in development', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { element } = await withActions({ label: 'Comment', counter: '0/280', readOnly: true });
    expect(shown(footer(element))).toBe(false);
    expect(warn.mock.calls.filter(([message]) => String(message).includes('readonly'))).toHaveLength(1);
    element.counter = '1/280';
    await element.updateComplete;
    expect(warn.mock.calls.filter(([message]) => String(message).includes('readonly'))).toHaveLength(1);
    element.readOnly = false;
    await element.updateComplete;
    expect(shown(footer(element))).toBe(true);
  });

  it('readonly with no footer content warns nothing', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    await mount({ label: 'Notes', readOnly: true });
    await nextFrame();
    expect(warn).not.toHaveBeenCalled();
  });

  it('disabled: the actions are disabled too, and come back when the piece does', async () => {
    const { element, attach, send } = await withActions();
    element.disabled = true;
    await element.updateComplete;
    expect([attach.disabled, send.disabled]).toEqual([true, true]);
    element.disabled = false;
    await element.updateComplete;
    expect([attach.disabled, send.disabled]).toEqual([false, false]);
  });

  it('disabled adds up: an action the consumer disabled stays disabled', async () => {
    const { element, attach, send } = await withActions();
    send.disabled = true;
    element.disabled = true;
    await element.updateComplete;
    element.disabled = false;
    await element.updateComplete;
    expect([attach.disabled, send.disabled]).toEqual([false, true]);
  });

  it('a disabled fieldset disables the actions too', async () => {
    const holder = await markup(
      '<fieldset disabled><nph-textarea label="Comment"><nph-button slot="actions" text="Send"></nph-button></nph-textarea></fieldset>',
    );
    const element = holder.querySelector('nph-textarea') as NphTextarea;
    const send = holder.querySelector('nph-button') as Button;
    expect(send.disabled).toBe(true);
    (holder.querySelector('fieldset') as HTMLFieldSetElement).disabled = false;
    await element.updateComplete;
    expect(send.disabled).toBe(false);
  });

  it('an action that leaves a disabled piece gets back what the piece forced', async () => {
    const { element, send } = await withActions({ label: 'Comment', disabled: true });
    expect(send.disabled).toBe(true);
    document.body.append(send);
    await nextFrame();
    await element.updateComplete;
    expect(send.disabled).toBe(false);
  });

  it('an action added to a disabled piece is disabled', async () => {
    const element = await mount({ label: 'Comment', disabled: true });
    const button = document.createElement('nph-button') as Button;
    button.setAttribute('slot', 'actions');
    button.setAttribute('text', 'Send');
    element.append(button);
    await nextFrame();
    await element.updateComplete;
    expect(button.disabled).toBe(true);
  });

  it('an element of the default slot is not drawn: only the actions slot exists', async () => {
    const holder = await markup('<nph-textarea label="Comment"><span>Loose</span></nph-textarea>');
    const element = holder.querySelector('nph-textarea') as NphTextarea;
    const slots = [...(element.shadowRoot?.querySelectorAll('slot') ?? [])];
    expect(slots.map((slot) => slot.getAttribute('name'))).toEqual(['actions']);
    expect(shown(footer(element))).toBe(false);
  });
});

describe('states and precedence', () => {
  const border = (element: NphTextarea): string => getComputedStyle(container(element)).borderTopColor;
  const halo = (element: NphTextarea): CSSStyleDeclaration => getComputedStyle(container(element), '::after');

  for (const scheme of ['light', 'dark'] as const) {
    it(`${scheme}: default border color/input on color/background; hover color/input-hover`, async () => {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const element = await mount();
      expect(border(element)).toBe(resolved('color', '--nph-color-input'));
      expect(getComputedStyle(container(element)).backgroundColor).toBe(resolved('color', '--nph-color-background'));
      await userEvent.hover(container(element));
      expect(border(element)).toBe(resolved('color', '--nph-color-input-hover'));
    });
  }

  it('the box: radius/control, border/width; the value text/body-md in color/foreground, the placeholder muted', async () => {
    const element = await mount({ label: 'Notes', placeholder: 'Write' });
    const box = getComputedStyle(container(element));
    expect(box.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-radius-control'));
    expect(box.borderTopWidth).toBe(resolved('width', '--nph-border-width'));
    const text = getComputedStyle(field(element));
    expect(text.fontSize).toBe(resolved('font-size', '--nph-text-body-md-font-size'));
    expect(text.lineHeight).toBe(resolved('line-height', '--nph-text-body-md-line-height'));
    expect(text.color).toBe(resolved('color', '--nph-color-foreground'));
    expect(text.paddingInlineStart).toBe(resolved('padding-left', '--nph-space-control-padding'));
    expect(text.paddingTop).toBe(resolved('padding-top', '--nph-space-inline'));
    expect(getComputedStyle(field(element), '::placeholder').color).toBe(resolved('color', '--nph-color-muted-foreground'));
  });

  it('focus: border focus/border and the halo attached outside, focus/halo, focus/radius-control', async () => {
    const element = await mount();
    field(element).focus();
    expect(border(element)).toBe(resolved('color', '--nph-focus-border'));
    const ring = halo(element);
    expect(ring.content).not.toBe('none');
    expect(ring.borderTopColor).toBe(resolved('color', '--nph-focus-halo'));
    expect(ring.borderTopWidth).toBe(resolved('width', '--nph-focus-ring-width'));
    expect(ring.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-radius-control'));
    const box = container(element).getBoundingClientRect();
    expect(Number.parseFloat(ring.width)).toBeCloseTo(box.width + 2 * px('--nph-focus-ring-width'), 2);
  });

  it('focus wins over hover, and a mouse click shows it too', async () => {
    const element = await mount();
    await userEvent.click(field(element));
    await userEvent.hover(container(element));
    expect(border(element)).toBe(resolved('color', '--nph-focus-border'));
  });

  it('focus on an action: the box keeps its border and draws no halo', async () => {
    const { element, attach } = await withActions();
    attach.focus();
    expect(border(element)).toBe(resolved('color', '--nph-color-input'));
    expect(halo(element).content).toBe('none');
  });

  it('error: border status/error, also on hover; with focus, the halo focus/halo-error', async () => {
    const element = await mount({ label: 'Notes', invalid: true });
    expect(border(element)).toBe(resolved('color', '--nph-status-error'));
    await userEvent.hover(container(element));
    expect(border(element)).toBe(resolved('color', '--nph-status-error'));
    field(element).focus();
    expect(border(element)).toBe(resolved('color', '--nph-status-error'));
    expect(halo(element).borderTopColor).toBe(resolved('color', '--nph-focus-halo-error'));
  });

  it('readonly: the resting border, also on hover, and no error look', async () => {
    const element = await mount({ label: 'Notes', readOnly: true, invalid: true, value: 'x' });
    expect(border(element)).toBe(resolved('color', '--nph-color-input'));
    await userEvent.hover(container(element));
    expect(border(element)).toBe(resolved('color', '--nph-color-input'));
    expect(getComputedStyle(element).opacity).toBe('1');
  });

  it('readonly with focus: the focus border and the usual halo stay visible (D-2)', async () => {
    const element = await mount({ label: 'Notes', readOnly: true, invalid: true, value: 'x' });
    field(element).focus();
    expect(border(element)).toBe(resolved('color', '--nph-focus-border'));
    expect(halo(element).borderTopColor).toBe(resolved('color', '--nph-focus-halo'));
  });

  it('disabled: border color/input, background color/muted, the whole piece at state/disabled-opacity, out of Tab', async () => {
    const before = document.createElement('input');
    document.body.append(before);
    const element = await mount({ label: 'Notes', disabled: true, value: 'a' });
    expect(border(element)).toBe(resolved('color', '--nph-color-input'));
    expect(getComputedStyle(container(element)).backgroundColor).toBe(resolved('color', '--nph-color-muted'));
    expect(getComputedStyle(element).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
    expect(field(element).disabled).toBe(true);
    before.focus();
    await userEvent.tab();
    expect(element.shadowRoot?.activeElement ?? null).toBeNull();
  });

  it('disabled wins over readonly and invalid', async () => {
    const element = await mount({ label: 'Notes', disabled: true, readOnly: true, invalid: true });
    expect(border(element)).toBe(resolved('color', '--nph-color-input'));
    expect(getComputedStyle(container(element)).backgroundColor).toBe(resolved('color', '--nph-color-muted'));
    expect(field(element).disabled).toBe(true);
    expect(field(element).readOnly).toBe(false);
    await userEvent.hover(container(element));
    expect(border(element)).toBe(resolved('color', '--nph-color-input'));
  });

  it('an enabled piece is at full opacity, with no transition', async () => {
    const element = await mount();
    expect(getComputedStyle(element).opacity).toBe('1');
    for (const part of [container(element), field(element)]) {
      expect(getComputedStyle(part).transitionDuration).toBe('0s');
    }
  });

  it('the default width is layout/input-width; the parent may stretch it, with no minimum (D-4)', async () => {
    const element = await mount();
    expect(element.getBoundingClientRect().width).toBeCloseTo(px('--nph-layout-input-width'), 2);
    element.style.inlineSize = '100%';
    const wide = document.createElement('div');
    wide.style.inlineSize = '600px';
    document.body.append(wide);
    wide.append(element);
    expect(container(element).getBoundingClientRect().width).toBeCloseTo(600, 2);
    wide.style.inlineSize = '40px';
    expect(element.getBoundingClientRect().width).toBeCloseTo(40, 2);
  });
});

describe('inside nph-field (P83)', () => {
  type Field = Updatable & { label: string; help: string; error: string; counter: string; required: boolean; disabled: boolean };

  async function inField(attributes: string): Promise<{ owner: Field; element: NphTextarea }> {
    const holder = await markup(`<nph-field ${attributes}><nph-textarea></nph-textarea></nph-field>`);
    const owner = holder.querySelector('nph-field') as Field;
    const element = holder.querySelector('nph-textarea') as NphTextarea;
    await owner.updateComplete;
    await element.updateComplete;
    await nextFrame();
    return { owner, element };
  }

  it('the field writes label, description and required; the tree has the name and the help', async () => {
    const { element } = await inField('label="Description" help="Up to 500 characters." required');
    expect(element.label).toBe('Description');
    expect(element.description).toBe('Up to 500 characters.');
    expect(field(element).required).toBe(true);
    const node = await accessibleNodeOf(element);
    expect(node.name?.value).toBe('Description');
    expect(node.description?.value).toBe('Up to 500 characters.');
  });

  it('the error of the field makes the piece invalid; the sentence is the description', async () => {
    const { owner, element } = await inField('label="Description" help="Help" error="Use up to 500 characters."');
    expect(element.invalid).toBe(true);
    expect(field(element).getAttribute('aria-invalid')).toBe('true');
    expect(element.description).toBe('Use up to 500 characters.');
    owner.error = '';
    await owner.updateComplete;
    await element.updateComplete;
    expect(element.invalid).toBe(false);
  });

  it('the support-line counter belongs to the field, and the footer stays off', async () => {
    const { owner, element } = await inField('label="Description" counter="12/500"');
    expect(owner.shadowRoot?.textContent).toContain('12/500');
    expect(element.counter).toBe('');
    expect(shown(footer(element))).toBe(false);
  });

  it('disabled of the field reaches the inner field', async () => {
    const { element } = await inField('label="Description" disabled');
    expect(element.disabled).toBe(true);
    expect(field(element).disabled).toBe(true);
  });

  it('fills the width of the field', async () => {
    const { owner, element } = await inField('label="Description"');
    expect(element.getBoundingClientRect().width).toBeCloseTo(owner.getBoundingClientRect().width, 1);
  });

  it('logs nothing: the field names the textarea before it complains', async () => {
    const error = vi.spyOn(console, 'error');
    const warn = vi.spyOn(console, 'warn');
    await inField('label="Description" help="Help" counter="1/5" required');
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(error).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
  });
});

describe('what the piece does not have', () => {
  it('has no part, no maxlength and no rows', async () => {
    const element = await mount({ label: 'Notes', counter: '0/280' });
    expect(element.shadowRoot?.querySelector('[part]')).toBeNull();
    expect(field(element).hasAttribute('maxlength')).toBe(false);
    expect(field(element).hasAttribute('minlength')).toBe(false);
    expect(field(element).hasAttribute('rows')).toBe(false);
  });

  it('has no color, variant, size or limit property, and no own error message (it belongs to nph-field)', () => {
    const declared = [...(NphTextarea as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    for (const name of ['variant', 'severity', 'color', 'size', 'rows', 'maxlength', 'maxLength', 'minlength', 'error', 'help', 'footer', 'autocomplete', 'resize']) {
      expect(declared).not.toContain(name);
    }
  });

  it('the host has no tabindex: the only focusable element of the shadow root is the native field', async () => {
    const element = await mount({ label: 'Notes' });
    expect(element.hasAttribute('tabindex')).toBe(false);
    expect(element.shadowRoot?.querySelectorAll('textarea').length).toBe(1);
    expect(element.shadowRoot?.querySelectorAll('a, button, input, select, [tabindex]').length).toBe(0);
  });

  it('does not mark itself rendered: there is no invalid input that draws nothing', async () => {
    const element = await mount({ label: 'Notes' });
    expect(element.hasAttribute('data-nph-rendered')).toBe(false);
    expect(element.getBoundingClientRect().height).toBeGreaterThan(0);
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const used = new Set([...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1] ?? ''));

  it('every custom property in the CSS exists in tokens.css, and these are the ones the evidence names', () => {
    expect(used).toEqual(
      new Set([
        '--nph-layout-input-width',
        '--nph-state-disabled-opacity',
        '--nph-color-input',
        '--nph-border-width',
        '--nph-radius-control',
        '--nph-color-background',
        '--nph-color-muted-foreground',
        '--nph-layout-textarea-min-height',
        '--nph-layout-textarea-max-height',
        '--nph-space-inline',
        '--nph-space-control-padding',
        '--nph-space-stack',
        '--nph-color-foreground',
        '--nph-text-body-md-font-family',
        '--nph-text-body-md-font-size',
        '--nph-text-body-md-font-weight',
        '--nph-text-body-md-line-height',
        '--nph-text-body-md-letter-spacing',
        '--nph-text-caption-font-family',
        '--nph-text-caption-font-size',
        '--nph-text-caption-font-weight',
        '--nph-text-caption-line-height',
        '--nph-text-caption-letter-spacing',
        '--nph-color-input-hover',
        '--nph-focus-border',
        '--nph-focus-ring-width',
        '--nph-focus-halo',
        '--nph-focus-radius-control',
        '--nph-status-error',
        '--nph-focus-halo-error',
        '--nph-color-muted',
      ]),
    );
    for (const name of used) {
      expect(tokensCss, name).toContain(`${name}:`);
    }
  });

  it('never consumes a core or theme token: components use the semantic layer only', () => {
    expect(componentCss).not.toMatch(/--nph-core-|--nph-theme-/);
  });

  it('the CSS has no literal color, measure or duration, and no transition', () => {
    expect(cssWithoutComments).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(cssWithoutComments).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/i);
    expect(cssWithoutComments).not.toMatch(/\d+(\.\d+)?(px|rem|em|ms|s)\b/);
    expect(cssWithoutComments).not.toMatch(/\btransition/);
  });

  it('design.md says what the two height tokens are for, and only for nph-textarea', () => {
    expect(designMd).toMatch(/layout\/textarea-min-height:[\s\S]{0,400}DO NOT USE outside nph-textarea/);
    expect(designMd).toMatch(/layout\/textarea-max-height:[\s\S]{0,400}DO NOT USE outside nph-textarea/);
  });
});

describe('review regressions (PR #111, Copilot round 1)', () => {
  it('an action defined after a disabled textarea rendered is disabled when it upgrades', async () => {
    const name = `demo-late-action-${Date.now()}`;
    const holder = await markup(`<nph-textarea label="Comment" disabled><${name} slot="actions"></${name}></nph-textarea>`);
    const element = holder.querySelector('nph-textarea') as NphTextarea;
    const action = holder.querySelector(name) as HTMLElement & { disabled?: boolean };
    expect('disabled' in action).toBe(false);
    customElements.define(
      name,
      class extends HTMLElement {
        disabled = false;
      },
    );
    await customElements.whenDefined(name);
    await element.updateComplete;
    await element.updateComplete;
    expect(action.disabled).toBe(true);
    element.disabled = false;
    await element.updateComplete;
    expect(action.disabled).toBe(false);
  });

  it('an action moved between two disabled textareas stays disabled when the new one updates first', async () => {
    const { element: from, send } = await withActions({ label: 'From', disabled: true });
    const to = await mount({ label: 'To', disabled: true });
    expect(send.disabled).toBe(true);
    to.append(send);
    to.requestUpdate();
    await to.updateComplete;
    from.requestUpdate();
    await from.updateComplete;
    await nextFrame();
    await Promise.all([from.updateComplete, to.updateComplete]);
    expect(send.disabled).toBe(true);
    to.disabled = false;
    await to.updateComplete;
    expect(send.disabled).toBe(false);
  });

  it('an action moved from a disabled textarea to an enabled one gets its disabled back', async () => {
    const { element: from, send } = await withActions({ label: 'From', disabled: true });
    const to = await mount({ label: 'To' });
    to.append(send);
    await nextFrame();
    await Promise.all([from.updateComplete, to.updateComplete]);
    expect(send.disabled).toBe(false);
  });
});

describe('review regressions (PR #111, Copilot round 2)', () => {
  it('an action defined while a disabled textarea is out of the page is disabled when it upgrades', async () => {
    const name = `demo-detached-action-${Date.now()}`;
    const holder = await markup(`<nph-textarea label="Comment" disabled><${name} slot="actions"></${name}></nph-textarea>`);
    const element = holder.querySelector('nph-textarea') as NphTextarea;
    const action = element.querySelector(name) as HTMLElement & { disabled?: boolean };
    element.remove();
    customElements.define(
      name,
      class extends HTMLElement {
        disabled = false;
      },
    );
    await customElements.whenDefined(name);
    await element.updateComplete;
    await element.updateComplete;
    expect(action.disabled).toBe(true);
    document.body.append(element);
    await element.updateComplete;
    expect(action.disabled).toBe(true);
  });

  it('an action defined while the textarea is out of the page is synchronized when the textarea comes back', async () => {
    const name = `demo-returning-action-${Date.now()}`;
    customElements.define(
      name,
      class extends HTMLElement {
        disabled = false;
      },
    );
    const element = await mount({ label: 'Comment', disabled: true });
    element.remove();
    const action = document.createElement('div');
    action.innerHTML = `<${name} slot="actions"></${name}>`;
    const child = action.firstElementChild as HTMLElement & { disabled?: boolean };
    element.append(child);
    await element.updateComplete;
    document.body.append(element);
    await element.updateComplete;
    await element.updateComplete;
    expect(child.disabled).toBe(true);
  });
});
