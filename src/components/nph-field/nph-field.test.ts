/**
 * Tests of `nph-field` (P83), in a real browser (P21, item 5): measures, computed
 * typography, focus and real clicks only exist where there is layout.
 *
 * They prove the contract accepted in Figma (frame `1194:21863`, set `657:50`), the
 * decisions D1 to D8 of DSA-28 and the field–control contract of P83: the API, what
 * reaches the `nph-label`, the message line and the counter, the spaces and the width,
 * what the field writes on a control and on the options of a group, the semantics of
 * the group, the click on the label, the composition warnings, the invalid input and the
 * token contract.
 *
 * The contract is proved with test stubs that take it, defined in this file, so every
 * rule is checked on a control the field does not know; the last block proves the same
 * contract on the real `nph-input` (P80). The `nph-label` and `nph-tooltip` are
 * the real ones; the opening of the balloon is theirs and is not tested here.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import designMd from '../../../design.md?raw';
import componentCss from './nph-field.css?raw';
import '../nph-input/nph-input';
import type { NphInput } from '../nph-input/nph-input';
import { NPH_FIELD_ROLES, NphField } from './nph-field';
import type { NphFieldRole } from './nph-field';
import type { NphLabel } from '../nph-label/nph-label';

/** A control that takes the contract of P83: the focus lives in its shadow root. */
class StubControl extends HTMLElement {
  label = '';
  description = '';
  invalid = false;
  required = false;
  disabled = false;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open', delegatesFocus: true });
    /* The control gives its own host a width, as nph-input does; the field overrides it. */
    root.innerHTML = '<style>:host { display: inline-block; inline-size: 3rem; }</style><input>';
  }
}

class StubOption extends StubControl {
  static nphFieldRole: NphFieldRole = 'option';
}

class StubRadio extends StubControl {
  static nphFieldRole: NphFieldRole = 'radio';
}

/** A custom element with no contract at all. */
class StubOther extends HTMLElement {}

customElements.define('test-field-control', StubControl);
customElements.define('test-field-option', StubOption);
customElements.define('test-field-radio', StubRadio);
customElements.define('test-field-other', StubOther);

interface FieldSpec {
  label?: string;
  required?: boolean;
  info?: string;
  infoLabel?: string;
  help?: string;
  error?: string;
  counter?: string;
  disabled?: boolean;
  children?: string[];
}

beforeAll(async () => {
  await document.fonts.load('400 14px "Noto Sans"');
  await document.fonts.load('500 14px "Noto Sans"');
  await document.fonts.ready;
});

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

async function settle(field: NphField): Promise<void> {
  await field.updateComplete;
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await field.updateComplete;
}

async function mount(spec: FieldSpec = {}, parent: HTMLElement = document.body): Promise<NphField> {
  const field = document.createElement('nph-field');
  field.label = spec.label ?? 'Email';
  if (spec.required !== undefined) field.required = spec.required;
  if (spec.info !== undefined) field.info = spec.info;
  if (spec.infoLabel !== undefined) field.infoLabel = spec.infoLabel;
  if (spec.help !== undefined) field.help = spec.help;
  if (spec.error !== undefined) field.error = spec.error;
  if (spec.counter !== undefined) field.counter = spec.counter;
  if (spec.disabled !== undefined) field.disabled = spec.disabled;
  for (const tag of spec.children ?? ['test-field-control']) {
    field.append(document.createElement(tag));
  }
  parent.append(field);
  await settle(field);
  return field;
}

function root(field: NphField): ShadowRoot {
  return field.shadowRoot as ShadowRoot;
}

function labelOf(field: NphField): NphLabel {
  return root(field).querySelector('nph-label') as NphLabel;
}

function wrapperOf(field: NphField): HTMLElement {
  return root(field).querySelector('.control') as HTMLElement;
}

function messageOf(field: NphField): HTMLElement | null {
  return root(field).querySelector('.message');
}

function textOf(field: NphField): HTMLElement | null {
  return root(field).querySelector('.message__text');
}

function counterOf(field: NphField): HTMLElement | null {
  return root(field).querySelector('.message__counter');
}

function first<T extends Element = StubControl>(field: NphField): T {
  return field.firstElementChild as T;
}

function token(name: string): string {
  const probe = document.createElement('div');
  probe.style.setProperty('inline-size', `var(${name})`);
  probe.style.setProperty('position', 'absolute');
  document.body.append(probe);
  const value = getComputedStyle(probe).inlineSize;
  probe.remove();
  return value;
}

function colorOf(name: string): string {
  const probe = document.createElement('div');
  probe.style.setProperty('color', `var(${name})`);
  document.body.append(probe);
  const value = getComputedStyle(probe).color;
  probe.remove();
  return value;
}

function typographyOf(name: string): Record<string, string> {
  const probe = document.createElement('div');
  for (const part of ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing']) {
    probe.style.setProperty(part, `var(--nph-text-${name}-${part})`);
  }
  document.body.append(probe);
  const style = getComputedStyle(probe);
  const value = {
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    lineHeight: style.lineHeight,
    letterSpacing: style.letterSpacing,
  };
  probe.remove();
  return value;
}

function typographyFrom(element: Element): Record<string, string> {
  const style = getComputedStyle(element);
  return {
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    lineHeight: style.lineHeight,
    letterSpacing: style.letterSpacing,
  };
}

describe('registration and API', () => {
  it('registers nph-field once, under a guard', () => {
    expect(customElements.get('nph-field')).toBe(NphField);
  });

  it('starts empty: no text, not required, not disabled', () => {
    const field = document.createElement('nph-field');
    expect([field.label, field.info, field.infoLabel, field.help, field.error, field.counter]).toEqual([
      '',
      '',
      '',
      '',
      '',
      '',
    ]);
    expect(field.required).toBe(false);
    expect(field.disabled).toBe(false);
  });

  it('required and disabled reflect; the texts do not', async () => {
    const field = await mount({ required: true, disabled: true, help: 'Help', error: 'Error', counter: '1/5' });
    expect(field.hasAttribute('required')).toBe(true);
    expect(field.hasAttribute('disabled')).toBe(true);
    for (const name of ['label', 'help', 'error', 'counter', 'info', 'info-label']) {
      expect(field.hasAttribute(name), name).toBe(false);
    }
  });

  it('reads the attributes, info-label included', async () => {
    document.body.innerHTML =
      '<nph-field label="Name" required info="Why" info-label="About name" help="Help" error="Error" counter="2/9" disabled><test-field-control></test-field-control></nph-field>';
    const field = document.querySelector('nph-field') as NphField;
    await settle(field);
    expect(field.label).toBe('Name');
    expect(field.required).toBe(true);
    expect(field.info).toBe('Why');
    expect(field.infoLabel).toBe('About name');
    expect([field.help, field.error, field.counter]).toEqual(['Help', 'Error', '2/9']);
    expect(field.disabled).toBe(true);
  });

  it('exposes the three roles of the contract', () => {
    expect([...NPH_FIELD_ROLES]).toEqual(['control', 'option', 'radio']);
  });

  it('has an open shadow root and no part', async () => {
    const field = await mount();
    expect(field.shadowRoot?.mode).toBe('open');
    expect(root(field).querySelector('[part]')).toBeNull();
  });
});

describe('the label (D1)', () => {
  it('passes label, required, info and infoLabel to the nph-label', async () => {
    const field = await mount({ label: 'Email', required: true, info: 'We never share it.', infoLabel: 'About email' });
    const label = labelOf(field);
    expect(label.text).toBe('Email');
    expect(label.required).toBe(true);
    expect(label.info).toBe('We never share it.');
    expect(label.infoLabel).toBe('About email');
  });

  it('the label has no for: the association is the contract, not an id', async () => {
    const field = await mount();
    expect(labelOf(field).for).toBeNull();
    expect(root(field).querySelector('label')?.hasAttribute('for')).toBe(false);
  });

  it('the information icon is the button of the nph-label, named by infoLabel', async () => {
    const field = await mount({ info: 'We never share it.', infoLabel: 'About email' });
    const button = root(field).querySelector('nph-label button');
    expect(button?.getAttribute('aria-label')).toBe('About email');
  });

  it('without infoLabel the icon does not show, and the nph-label says why', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const field = await mount({ info: 'We never share it.' });
    expect(root(field).querySelector('nph-label button')).toBeNull();
    expect(error.mock.calls.some(([message]) => String(message).startsWith('[nph-label]'))).toBe(true);
  });

  it('the nph-label is styled inside the shadow root: the field adopts its stylesheet', async () => {
    const field = await mount();
    const text = root(field).querySelector('.nph-label__text') as HTMLElement;
    expect(typographyFrom(text)).toEqual(typographyOf('label-md'));
    expect(getComputedStyle(text).color).toBe(colorOf('--nph-color-foreground'));
  });

  it('the asterisk stays status/error and the label never changes color in error', async () => {
    const field = await mount({ required: true, error: 'Fix it.' });
    const text = root(field).querySelector('.nph-label__text') as HTMLElement;
    const asterisk = root(field).querySelector('.nph-label__required') as HTMLElement;
    expect(getComputedStyle(text).color).toBe(colorOf('--nph-color-foreground'));
    expect(getComputedStyle(asterisk).color).toBe(colorOf('--nph-status-error'));
  });
});

describe('the message line (D2 to D5)', () => {
  it('is not rendered with no help, no error and no counter, and keeps no height (D5)', async () => {
    const field = await mount();
    expect(messageOf(field)).toBeNull();
    const label = labelOf(field).getBoundingClientRect();
    const control = first(field).getBoundingClientRect();
    expect(field.getBoundingClientRect().bottom).toBeCloseTo(control.bottom, 1);
    expect(control.top - label.bottom).toBeCloseTo(parseFloat(token('--nph-space-stack-tight')), 1);
  });

  it('shows the help in text/caption and color/muted-foreground (D3, D4)', async () => {
    const field = await mount({ help: 'Use your work email.' });
    const text = textOf(field) as HTMLElement;
    expect(text.textContent).toBe('Use your work email.');
    expect(typographyFrom(text)).toEqual(typographyOf('caption'));
    expect(getComputedStyle(text).color).toBe(colorOf('--nph-color-muted-foreground'));
  });

  it('the error replaces the help, in text/body-md and status/error, with no icon (D2 to D4)', async () => {
    const field = await mount({ help: 'Use your work email.', error: 'Enter a valid email.' });
    const text = textOf(field) as HTMLElement;
    expect(text.textContent).toBe('Enter a valid email.');
    expect(root(field).textContent).not.toContain('Use your work email.');
    expect(typographyFrom(text)).toEqual(typographyOf('body-md'));
    expect(getComputedStyle(text).color).toBe(colorOf('--nph-status-error'));
    expect(messageOf(field)?.querySelector('nph-icon, svg')).toBeNull();
  });

  it('the help comes back when the error is emptied', async () => {
    const field = await mount({ help: 'Help', error: 'Error' });
    field.error = '';
    await settle(field);
    expect(textOf(field)?.textContent).toBe('Help');
  });

  it('a text of spaces counts as empty', async () => {
    const field = await mount({ help: '   ', error: '  ' });
    expect(messageOf(field)).toBeNull();
    expect(first(field).invalid).toBe(false);
  });

  it('a long text wraps, with no ellipsis (D-4)', async () => {
    const long = 'This help text is much longer than the width of the field and must wrap to more lines.';
    const field = await mount({ help: long });
    const text = textOf(field) as HTMLElement;
    expect(getComputedStyle(text).textOverflow).not.toBe('ellipsis');
    expect(text.getBoundingClientRect().height).toBeGreaterThan(parseFloat(getComputedStyle(text).lineHeight) * 1.5);
    expect(text.getBoundingClientRect().right).toBeLessThanOrEqual(field.getBoundingClientRect().right + 0.5);
  });
});

describe('the counter', () => {
  it('sits at the end of the help line, in text/caption and color/muted-foreground', async () => {
    const field = await mount({ help: 'Help', counter: '12/500' });
    const text = (textOf(field) as HTMLElement).getBoundingClientRect();
    const counter = counterOf(field) as HTMLElement;
    const box = counter.getBoundingClientRect();
    expect(counter.textContent).toBe('12/500');
    expect(box.top).toBeCloseTo(text.top, 1);
    expect(box.right).toBeCloseTo(field.getBoundingClientRect().right, 1);
    expect(typographyFrom(counter)).toEqual(typographyOf('caption'));
    expect(getComputedStyle(counter).color).toBe(colorOf('--nph-color-muted-foreground'));
  });

  it('keeps space/inline from the help and does not shrink (D-2)', async () => {
    const field = await mount({ help: 'A help text long enough to reach the counter on its line.', counter: '480/500' });
    const text = (textOf(field) as HTMLElement).getBoundingClientRect();
    const counter = (counterOf(field) as HTMLElement).getBoundingClientRect();
    expect(counter.left - text.right).toBeGreaterThanOrEqual(parseFloat(token('--nph-space-inline')) - 0.5);
  });

  it('alone, it sits at the end of the line', async () => {
    const field = await mount({ counter: '0/500' });
    const counter = (counterOf(field) as HTMLElement).getBoundingClientRect();
    expect(textOf(field)).toBeNull();
    expect(counter.right).toBeCloseTo(field.getBoundingClientRect().right, 1);
  });

  it('in error, goes to a line of its own below the message, at the end, never in the error color (D-1)', async () => {
    const field = await mount({ error: 'Too long.', counter: '501/500' });
    const text = (textOf(field) as HTMLElement).getBoundingClientRect();
    const counter = counterOf(field) as HTMLElement;
    const box = counter.getBoundingClientRect();
    expect(box.top - text.bottom).toBeCloseTo(parseFloat(token('--nph-space-stack-tight')), 1);
    expect(box.right).toBeCloseTo(field.getBoundingClientRect().right, 1);
    expect(getComputedStyle(counter).color).toBe(colorOf('--nph-color-muted-foreground'));
  });
});

describe('spaces and width (D5 to D7)', () => {
  it('stacks label, control and message line at space/stack-tight (D5)', async () => {
    const field = await mount({ help: 'Help' });
    const gap = parseFloat(token('--nph-space-stack-tight'));
    const label = labelOf(field).getBoundingClientRect();
    const control = first(field).getBoundingClientRect();
    const message = (messageOf(field) as HTMLElement).getBoundingClientRect();
    expect(control.top - label.bottom).toBeCloseTo(gap, 1);
    expect(message.top - control.bottom).toBeCloseTo(gap, 1);
  });

  it('takes layout/field-width by default (D6)', async () => {
    const field = await mount();
    expect(field.getBoundingClientRect().width).toBeCloseTo(parseFloat(token('--nph-layout-field-width')), 1);
  });

  it('stretches when the consumer gives it a width, and the control fills it (D6)', async () => {
    const box = document.createElement('div');
    box.style.inlineSize = '600px';
    document.body.append(box);
    const field = await mount({}, box);
    field.style.inlineSize = '100%';
    await settle(field);
    expect(field.getBoundingClientRect().width).toBeCloseTo(600, 1);
    expect(first(field).getBoundingClientRect().width).toBeCloseTo(600, 1);
  });

  it('the control fills the default width too, over the width it gives its own host', async () => {
    const field = await mount();
    expect(first(field).getBoundingClientRect().width).toBeCloseTo(field.getBoundingClientRect().width, 1);
  });

  it('does not overflow a narrower container', async () => {
    const box = document.createElement('div');
    box.style.inlineSize = '200px';
    document.body.append(box);
    const field = await mount({}, box);
    expect(field.getBoundingClientRect().width).toBeCloseTo(200, 1);
  });

  it('stacks the options of a group at space/stack-tight, each as wide as the field (D7)', async () => {
    const field = await mount({ children: ['test-field-option', 'test-field-option', 'test-field-option'] });
    const options = [...field.children].map((child) => child.getBoundingClientRect());
    const gap = parseFloat(token('--nph-space-stack-tight'));
    expect((options[1]?.top ?? 0) - (options[0]?.bottom ?? 0)).toBeCloseTo(gap, 1);
    expect((options[2]?.top ?? 0) - (options[1]?.bottom ?? 0)).toBeCloseTo(gap, 1);
    for (const option of options) {
      expect(option.left).toBeCloseTo(options[0]?.left ?? 0, 1);
      expect(option.width).toBeCloseTo(field.getBoundingClientRect().width, 1);
    }
  });
});

describe('the contract with a control (P83)', () => {
  it('writes label, description, invalid and required on the control', async () => {
    const field = await mount({ label: 'Email', help: 'Use your work email.', required: true });
    const control = first(field);
    expect(control.label).toBe('Email');
    expect(control.description).toBe('Use your work email.');
    expect(control.invalid).toBe(false);
    expect(control.required).toBe(true);
    expect(control.disabled).toBe(false);
  });

  it('the description follows the visible line: help, then error, then help again', async () => {
    const field = await mount({ help: 'Help' });
    const control = first(field);
    field.error = 'Error';
    await settle(field);
    expect(control.description).toBe('Error');
    expect(control.invalid).toBe(true);
    field.error = '';
    await settle(field);
    expect(control.description).toBe('Help');
    expect(control.invalid).toBe(false);
  });

  it('the counter is not part of the description', async () => {
    const field = await mount({ help: 'Help', counter: '3/10' });
    expect(first(field).description).toBe('Help');
  });

  it('is the source of label, description, invalid and required: a value set on the control is overwritten', async () => {
    const field = await mount({ label: 'Email' });
    const control = first(field);
    control.invalid = true;
    control.label = 'Other';
    field.help = 'Help';
    await settle(field);
    expect(control.invalid).toBe(false);
    expect(control.label).toBe('Email');
  });

  it('follows a change of label and required', async () => {
    const field = await mount({ label: 'Email' });
    field.label = 'Work email';
    field.required = true;
    await settle(field);
    expect(first(field).label).toBe('Work email');
    expect(first(field).required).toBe(true);
  });

  it('disabled passes to the control and hides the error; the help comes back (D8, D-3)', async () => {
    const field = await mount({ help: 'Help', error: 'Error', disabled: true });
    const control = first(field);
    expect(control.disabled).toBe(true);
    expect(control.invalid).toBe(false);
    expect(control.description).toBe('Help');
    expect(textOf(field)?.textContent).toBe('Help');
    expect(root(field).textContent).not.toContain('Error');
  });

  it('draws no opacity: the label, the message line and the field stay as they are (D8)', async () => {
    const field = await mount({ help: 'Help', disabled: true });
    for (const element of [field, labelOf(field), messageOf(field) as HTMLElement, wrapperOf(field)]) {
      expect(getComputedStyle(element).opacity).toBe('1');
    }
  });

  it('disabled adds up: it gives back only what the field turned on', async () => {
    const field = await mount();
    const control = first(field);
    field.disabled = true;
    await settle(field);
    expect(control.disabled).toBe(true);
    field.disabled = false;
    await settle(field);
    expect(control.disabled).toBe(false);

    control.disabled = true;
    field.disabled = true;
    await settle(field);
    field.disabled = false;
    await settle(field);
    expect(control.disabled).toBe(true);
  });

  it('the information icon stays focusable when the field is disabled (D8)', async () => {
    const field = await mount({ info: 'Why', infoLabel: 'About email', disabled: true });
    const button = root(field).querySelector('nph-label button') as HTMLButtonElement;
    expect(button.disabled).toBe(false);
    button.focus();
    expect(root(field).activeElement).toBe(button);
  });

  it('cleans up a control that leaves the field', async () => {
    const field = await mount({ label: 'Email', help: 'Help', error: 'Error', required: true, disabled: true });
    const control = first(field);
    control.remove();
    await settle(field);
    expect([control.label, control.description]).toEqual(['', '']);
    expect([control.invalid, control.required, control.disabled]).toEqual([false, false, false]);
  });

  it('a control added later is written on', async () => {
    const field = await mount({ label: 'Email', error: 'Error', children: [] });
    const control = document.createElement('test-field-control') as StubControl;
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    field.append(control);
    await settle(field);
    expect(control.label).toBe('Email');
    expect(control.invalid).toBe(true);
  });

  it('writes nothing on a custom element before it is defined, then writes when it is', async () => {
    const field = await mount({ label: 'Email', error: 'Error', children: ['test-field-late'] });
    const late = first<HTMLElement & Record<string, unknown>>(field);
    expect(late.label).toBeUndefined();
    customElements.define('test-field-late', class extends StubControl {});
    await customElements.whenDefined('test-field-late');
    await settle(field);
    expect(late.label).toBe('Email');
    expect(late.invalid).toBe(true);
  });

  it('a click on the label text moves the focus to the control', async () => {
    const field = await mount();
    await userEvent.click(root(field).querySelector('.nph-label__text') as HTMLElement);
    expect(document.activeElement).toBe(first(field));
    expect(first(field).shadowRoot?.activeElement?.localName).toBe('input');
  });

  it('a click on the information icon does not move the focus to the control', async () => {
    const field = await mount({ info: 'Why', infoLabel: 'About email' });
    await userEvent.click(root(field).querySelector('nph-label button') as HTMLElement);
    expect(document.activeElement).not.toBe(first(field));
  });

  it('in single mode the wrapper has no role and no name of its own', async () => {
    const field = await mount({ help: 'Help', error: 'Error' });
    const wrapper = wrapperOf(field);
    for (const name of ['role', 'aria-label', 'aria-describedby', 'aria-invalid', 'aria-required']) {
      expect(wrapper.hasAttribute(name), name).toBe(false);
    }
  });
});

describe('a group of options (D7, P83)', () => {
  it('checkboxes and switches: a group named by label and described by the message line', async () => {
    const field = await mount({
      label: 'Notifications',
      help: 'Pick at least one.',
      children: ['test-field-option', 'test-field-option'],
    });
    const wrapper = wrapperOf(field);
    expect(wrapper.getAttribute('role')).toBe('group');
    expect(wrapper.getAttribute('aria-label')).toBe('Notifications');
    const id = wrapper.getAttribute('aria-describedby') ?? '';
    expect(root(field).getElementById(id)?.textContent).toBe('Pick at least one.');
    expect(wrapper.hasAttribute('aria-required')).toBe(false);
  });

  it('radios: a radiogroup, with aria-required when required', async () => {
    const field = await mount({ label: 'Payment method', required: true, children: ['test-field-radio', 'test-field-radio'] });
    const wrapper = wrapperOf(field);
    expect(wrapper.getAttribute('role')).toBe('radiogroup');
    expect(wrapper.getAttribute('aria-required')).toBe('true');
    expect(wrapper.hasAttribute('aria-describedby')).toBe(false);
  });

  it('error: aria-invalid on the group, invalid on every option, the message describes the group', async () => {
    const field = await mount({ label: 'Payment method', error: 'Choose one.', children: ['test-field-radio', 'test-field-radio'] });
    const wrapper = wrapperOf(field);
    expect(wrapper.getAttribute('aria-invalid')).toBe('true');
    expect(root(field).getElementById(wrapper.getAttribute('aria-describedby') ?? '')?.textContent).toBe('Choose one.');
    for (const option of field.children) {
      expect((option as StubRadio).invalid).toBe(true);
    }
  });

  it('never writes label, description or required on an option', async () => {
    const field = await mount({ label: 'Notifications', help: 'Help', required: true, children: ['test-field-option'] });
    const option = first(field);
    expect([option.label, option.description, option.required]).toEqual(['', '', false]);
  });

  it('disabled passes to every option and keeps the one the consumer disabled', async () => {
    const field = await mount({ children: ['test-field-option', 'test-field-option'] });
    const [one, two] = [...field.children] as StubOption[];
    (two as StubOption).disabled = true;
    field.disabled = true;
    await settle(field);
    expect([one?.disabled, two?.disabled]).toEqual([true, true]);
    field.disabled = false;
    await settle(field);
    expect([one?.disabled, two?.disabled]).toEqual([false, true]);
  });

  it('a click on the label of a group moves no focus', async () => {
    const field = await mount({ children: ['test-field-option', 'test-field-option'] });
    await userEvent.click(root(field).querySelector('.nph-label__text') as HTMLElement);
    expect(field.contains(document.activeElement)).toBe(false);
  });
});

describe('invalid input and composition: it renders anyway and says why, once per cause', () => {
  it('no label: one console.error, and the field still renders the control', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const field = await mount({ label: '' });
    field.help = 'Help';
    await settle(field);
    const own = error.mock.calls.filter(([message]) => String(message).startsWith('[nph-field]'));
    expect(own).toHaveLength(1);
    expect(String(own[0]?.[0])).toMatch(/label is required/);
    expect(first(field).getBoundingClientRect().height).toBeGreaterThan(0);
  });

  it('a label set later clears the cause, and no new error appears', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const field = await mount({ label: '' });
    field.label = 'Email';
    await settle(field);
    expect(error.mock.calls.filter(([message]) => String(message).startsWith('[nph-field]'))).toHaveLength(1);
    expect(first(field).label).toBe('Email');
  });

  const cases: [string, string[], RegExp][] = [
    ['no control', [], /has no control/],
    ['two controls', ['test-field-control', 'test-field-control'], /more than one control/],
    ['a control mixed with options', ['test-field-control', 'test-field-option'], /mixed with options/],
    ['radios mixed with other options', ['test-field-radio', 'test-field-option'], /radios are mixed/],
    ['a native element', ['input'], /does not take the field contract/],
    ['a custom element without the contract', ['test-field-other'], /does not take the field contract/],
  ];

  for (const [name, children, pattern] of cases) {
    it(`${name}: one console.warn, and it renders`, async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      const field = await mount({ children, help: 'Help' });
      field.counter = '1/5';
      await settle(field);
      const own = warn.mock.calls.filter(([message]) => String(message).startsWith('[nph-field]'));
      expect(own.filter(([message]) => pattern.test(String(message)))).toHaveLength(1);
      expect(messageOf(field)).not.toBeNull();
    });
  }

  it('two controls: only the first one is named', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const field = await mount({ children: ['test-field-control', 'test-field-control'] });
    const [one, two] = [...field.children] as StubControl[];
    expect(one?.label).toBe('Email');
    expect(two?.label).toBe('');
  });

  it('a valid field logs nothing', async () => {
    const error = vi.spyOn(console, 'error');
    const warn = vi.spyOn(console, 'warn');
    await mount({ help: 'Help', error: 'Error', counter: '1/5', required: true });
    await mount({ label: 'Plan', children: ['test-field-radio', 'test-field-radio'] });
    expect(error).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const used = new Set([...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1] ?? ''));
  const typography = (role: string) =>
    ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing'].map((part) => `--nph-text-${role}-${part}`);

  it('the CSS consumes only the tokens of the evidence, and each exists in tokens.css', () => {
    expect(used).toEqual(
      new Set([
        '--nph-space-stack-tight',
        '--nph-space-inline',
        '--nph-layout-field-width',
        ...typography('caption'),
        ...typography('body-md'),
        '--nph-color-muted-foreground',
        '--nph-status-error',
      ]),
    );
    for (const name of used) {
      expect(tokensCss, name).toContain(`${name}:`);
    }
  });

  it('design.md names space/stack-tight for a label and what it describes, and status/error for an invalid field', () => {
    const stack = /space\/stack-tight:\s*\n\s*css: '--nph-space-stack-tight'[\s\S]*?use: "([^"]*)"/.exec(designMd);
    expect(stack?.[1]).toMatch(/label and field/);
    const error = /status\/error:\s*\n\s*css: '--nph-status-error'[\s\S]*?use: "([^"]*)"/.exec(designMd);
    expect(error?.[1]).toMatch(/border of an invalid field/);
    expect(designMd).toMatch(/layout\/field-width:\s*\n\s*css: '--nph-layout-field-width'/);
  });

  it('never consumes a core or theme token and writes no literal design value', () => {
    expect(cssWithoutComments).not.toMatch(/--nph-core-|--nph-theme-/);
    expect(cssWithoutComments).not.toMatch(/#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|\b\d+(\.\d+)?(px|rem|em|ms|s)\b/);
    expect(cssWithoutComments).not.toMatch(/background|border|outline|transition|animation|opacity|padding/);
  });
});

describe('the contract with the real nph-input (P80, P83)', () => {
  async function inputField(spec: FieldSpec = {}): Promise<{ field: NphField; input: NphInput; inner: HTMLInputElement }> {
    const field = await mount({ ...spec, children: ['nph-input'] });
    const input = first<NphInput>(field);
    await input.updateComplete;
    await settle(field);
    return { field, input, inner: input.shadowRoot?.querySelector('input') as HTMLInputElement };
  }

  it('names the inner field with the label and describes it with the visible line', async () => {
    const { inner, input } = await inputField({ label: 'Email', help: 'Use your work email.', required: true });
    expect(inner.getAttribute('aria-label')).toBe('Email');
    const id = inner.getAttribute('aria-describedby') ?? '';
    expect(input.shadowRoot?.getElementById(id)?.textContent?.trim()).toBe('Use your work email.');
    expect(inner.required).toBe(true);
  });

  it('error: invalid and aria-invalid on the inner field, the description is the error', async () => {
    const { field, input, inner } = await inputField({ help: 'Help', error: 'Enter a valid email.' });
    expect(input.invalid).toBe(true);
    expect(inner.getAttribute('aria-invalid')).toBe('true');
    expect(input.description).toBe('Enter a valid email.');
    field.error = '';
    await settle(field);
    expect(input.invalid).toBe(false);
    expect(input.description).toBe('Help');
  });

  it('disabled reaches the inner field and hides the error; the field draws no opacity', async () => {
    const { field, input, inner } = await inputField({ error: 'Error', disabled: true });
    expect(input.disabled).toBe(true);
    expect(inner.disabled).toBe(true);
    expect(input.invalid).toBe(false);
    expect(getComputedStyle(field).opacity).toBe('1');
    expect(getComputedStyle(labelOf(field)).opacity).toBe('1');
  });

  it('fills the width of the field over layout/input-width', async () => {
    const { field, input } = await inputField();
    expect(input.getBoundingClientRect().width).toBeCloseTo(field.getBoundingClientRect().width, 1);
  });

  it('a click on the label text moves the focus to the inner field', async () => {
    const { field, input, inner } = await inputField();
    await userEvent.click(root(field).querySelector('.nph-label__text') as HTMLElement);
    expect(document.activeElement).toBe(input);
    expect(input.shadowRoot?.activeElement).toBe(inner);
  });

  it('logs nothing: the field names the input before it complains about a missing name', async () => {
    const error = vi.spyOn(console, 'error');
    const warn = vi.spyOn(console, 'warn');
    await inputField({ help: 'Help', error: 'Error', counter: '1/5', required: true });
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(error).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
  });
});

describe('review regressions (PR #105, Copilot round 1)', () => {
  it('two fields swap their controls in the same turn: each control keeps what its new field wrote', async () => {
    const one = await mount({ label: 'Email', help: 'Email help', required: true });
    const two = await mount({ label: 'Phone', error: 'Phone error' });
    const a = first(one);
    const b = first(two);
    one.append(b);
    two.append(a);
    await Promise.all([settle(one), settle(two)]);
    await Promise.all([settle(one), settle(two)]);
    expect([b.label, b.description, b.required, b.invalid]).toEqual(['Email', 'Email help', true, false]);
    expect([a.label, a.description, a.required, a.invalid]).toEqual(['Phone', 'Phone error', false, true]);
  });

  it('a control moved from a disabled field to an enabled one gets its disabled back', async () => {
    const off = await mount({ label: 'Off', disabled: true });
    const on = await mount({ label: 'On', children: [] });
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const control = first(off);
    expect(control.disabled).toBe(true);
    on.append(control);
    await Promise.all([settle(off), settle(on)]);
    expect(control.disabled).toBe(false);
    expect(control.label).toBe('On');
  });

  it('a control moved out of a field and into no field is cleaned up by the old field', async () => {
    const field = await mount({ label: 'Email', error: 'Error' });
    const control = first(field);
    document.body.append(control);
    await settle(field);
    expect([control.label, control.invalid]).toEqual(['', false]);
  });

  it('slot="" is the default slot: the control is named, described and focused by the label', async () => {
    document.body.innerHTML =
      '<nph-field label="Email" help="Help" required><test-field-control slot=""></test-field-control></nph-field>';
    const field = document.querySelector('nph-field') as NphField;
    await settle(field);
    const control = first(field);
    expect([control.label, control.description, control.required]).toEqual(['Email', 'Help', true]);
    await userEvent.click(root(field).querySelector('.nph-label__text') as HTMLElement);
    expect(document.activeElement).toBe(control);
  });

  it('slot="" options keep the group semantics', async () => {
    document.body.innerHTML =
      '<nph-field label="Plan"><test-field-radio slot=""></test-field-radio><test-field-radio slot=""></test-field-radio></nph-field>';
    const field = document.querySelector('nph-field') as NphField;
    await settle(field);
    expect(wrapperOf(field).getAttribute('role')).toBe('radiogroup');
  });

  it('a custom element without the contract in a disabled field: it warns, and the field writes nothing on it', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const field = await mount({ disabled: true, error: 'Error', children: ['test-field-other'] });
    const other = first<HTMLElement & Record<string, unknown>>(field);
    for (const key of ['label', 'description', 'invalid', 'required', 'disabled']) {
      expect(Object.prototype.hasOwnProperty.call(other, key), key).toBe(false);
    }
    field.help = 'Help';
    await settle(field);
    const own = warn.mock.calls.filter(([message]) => /does not take the field contract/.test(String(message)));
    expect(own).toHaveLength(1);
  });

  it('a native input receives nothing from the field and warns', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const field = await mount({ required: true, disabled: true, children: ['input'] });
    const input = first<HTMLInputElement>(field);
    expect([input.required, input.disabled]).toEqual([false, false]);
    expect(warn.mock.calls.some(([message]) => /does not take the field contract/.test(String(message)))).toBe(true);
  });
});

describe('review regressions (PR #105, Copilot round 3)', () => {
  it('a lazy control defined while the field is out of the page is written on when the field comes back', async () => {
    const field = await mount({ label: 'Email', error: 'Error', children: ['test-field-lazy'] });
    const lazy = first<HTMLElement & Record<string, unknown>>(field);
    field.remove();
    customElements.define('test-field-lazy', class extends StubControl {});
    await customElements.whenDefined('test-field-lazy');
    await field.updateComplete;
    document.body.append(field);
    await settle(field);
    expect(lazy.label).toBe('Email');
    expect(lazy.invalid).toBe(true);
  });

  it('a field moved back into the page syncs its control again', async () => {
    const field = await mount({ label: 'Email' });
    const control = first(field);
    field.remove();
    control.label = 'Other';
    document.body.append(field);
    await settle(field);
    expect(control.label).toBe('Email');
  });
});

describe('review regressions (PR #105, Copilot round 4)', () => {
  /* No space, hyphen or slash: nothing where the browser would break the line on its own. */
  const unbroken = 'Identifier'.repeat(12);

  for (const [name, spec] of [
    ['help', { help: unbroken }],
    ['help with counter', { help: unbroken, counter: '12/500' }],
    ['error with counter', { error: unbroken, counter: '512/500' }],
  ] as const) {
    it(`an unbroken ${name} stays inside the width of the field`, async () => {
      const field = await mount(spec);
      const edge = field.getBoundingClientRect().right + 0.5;
      const text = textOf(field) as HTMLElement;
      expect(text.getBoundingClientRect().right).toBeLessThanOrEqual(edge);
      expect(text.scrollWidth).toBeLessThanOrEqual(text.clientWidth + 1);
      const counter = counterOf(field);
      if (counter) {
        expect(counter.getBoundingClientRect().right).toBeLessThanOrEqual(edge);
      }
    });
  }
});
