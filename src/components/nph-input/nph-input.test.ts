/**
 * Tests of `nph-input` (P80), in a real browser (P21, item 5): resolved color, real
 * hover, keyboard focus, form submission and the accessibility tree only exist where
 * there is layout and a form.
 *
 * They prove the contract accepted in Figma (frame `1195:532`, set `622:18359`) and
 * D1 to D7: the API, the form association (value, reset, validity, disabled
 * fieldset, Enter), the accessible name and description, the clear button and its
 * events, the measures, the seven states and their precedence, the invalid input
 * and the token contract.
 *
 * The accessible name is read from the accessibility tree of Chromium, through
 * the DevTools protocol: the name reaches the inner field by element reference
 * (`ariaLabelledByElements`), which no attribute shows.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cdp, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import designMd from '../../../design.md?raw';
import componentCss from './nph-input.css?raw';
import componentTs from './nph-input.ts?raw';
import '../nph-label/nph-label';
import { NPH_INPUT_NO_ICON, NPH_INPUT_SIZES, NPH_INPUT_TYPES, NphInput } from './nph-input';

type Props = Partial<
  Pick<
    NphInput,
    | 'type'
    | 'size'
    | 'value'
    | 'placeholder'
    | 'name'
    | 'autocomplete'
    | 'required'
    | 'disabled'
    | 'invalid'
    | 'label'
    | 'description'
    | 'iconStart'
    | 'iconEnd'
    | 'clearLabel'
  >
>;

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

async function mount(props: Props = { label: 'Email' }, parent: HTMLElement = document.body): Promise<NphInput> {
  const element = document.createElement('nph-input');
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
  await Promise.all([...holder.querySelectorAll<NphInput>('nph-input')].map((element) => element.updateComplete));
  await Promise.all([...holder.querySelectorAll<HTMLElement & { updateComplete: Promise<unknown> }>('nph-label')].map((element) => element.updateComplete));
  return holder;
}

function field(element: NphInput): HTMLInputElement {
  const input = element.shadowRoot?.querySelector<HTMLInputElement>('input');
  if (!input) throw new Error('no inner <input>');
  return input;
}

function container(element: NphInput): HTMLElement {
  const box = element.shadowRoot?.querySelector<HTMLElement>('.control');
  if (!box) throw new Error('no container');
  return box;
}

function clearButton(element: NphInput): HTMLButtonElement | null {
  return element.shadowRoot?.querySelector<HTMLButtonElement>('button') ?? null;
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

/** The node of the focused element in the accessibility tree of Chromium. */
interface AXNode {
  role?: { value?: string };
  name?: { value?: string };
  description?: { value?: string };
  ignored?: boolean;
}

/**
 * The node of the inner field in the accessibility tree of Chromium. The tests run in
 * a frame: the field is looked up through the DOM domain, piercing into the frame and
 * the shadow root, as the `nph-tooltip` test does.
 */
async function accessibleNodeOf(element: NphInput): Promise<AXNode> {
  const input = field(element);
  const session = cdp();
  await session.send('Accessibility.enable');
  input.setAttribute('data-ax-probe', '');
  try {
    await session.send('DOM.getDocument', { depth: -1, pierce: true });
    const { searchId, resultCount } = await session.send('DOM.performSearch', { query: '[data-ax-probe]', includeUserAgentShadowDOM: false });
    expect(resultCount).toBe(1);
    const { nodeIds } = await session.send('DOM.getSearchResults', { searchId, fromIndex: 0, toIndex: 1 });
    await session.send('DOM.discardSearchResults', { searchId });
    const { nodes } = await session.send('Accessibility.getPartialAXTree', { nodeId: nodeIds[0] as number, fetchRelatives: false });
    return (nodes[0] ?? {}) as AXNode;
  } finally {
    input.removeAttribute('data-ax-probe');
  }
}

describe('registration and API', () => {
  it('defines nph-input only once', () => {
    expect(customElements.get('nph-input')).toBe(NphInput);
  });

  it('the public API is exactly the one in P80', () => {
    const declared = [...(NphInput as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared.sort()).toEqual(
      [
        'autocomplete',
        'clearLabel',
        'description',
        'disabled',
        'iconEnd',
        'iconStart',
        'invalid',
        'label',
        'name',
        'placeholder',
        'required',
        'size',
        'type',
        'value',
      ].sort(),
    );
  });

  it('the defaults: text, default size, empty, valid, enabled, no icon', async () => {
    const element = await mount({ label: 'Email' });
    expect(element.type).toBe('text');
    expect(element.size).toBe('default');
    expect(element.value).toBe('');
    expect(element.placeholder).toBe('');
    expect(element.name).toBeNull();
    expect(element.required).toBe(false);
    expect(element.disabled).toBe(false);
    expect(element.invalid).toBe(false);
    expect(element.iconStart).toBe('none');
    expect(element.iconEnd).toBe('none');
    expect(element.clearLabel).toBe('');
    expect(element.description).toBe('');
  });

  it('the types and sizes are the ones of D1 and of the set', () => {
    expect([...NPH_INPUT_TYPES]).toEqual(['text', 'email', 'tel', 'url', 'search']);
    expect([...NPH_INPUT_SIZES]).toEqual(['default', 'large']);
    expect(NPH_INPUT_NO_ICON).toBe('none');
  });

  it('size, name, required, disabled and invalid reflect to attributes', async () => {
    const element = await mount({ label: 'Email', size: 'large', name: 'email', required: true, disabled: true, invalid: true });
    expect(element.getAttribute('size')).toBe('large');
    expect(element.getAttribute('name')).toBe('email');
    expect(element.hasAttribute('required')).toBe(true);
    expect(element.hasAttribute('disabled')).toBe(true);
    expect(element.hasAttribute('invalid')).toBe(true);
  });

  it('a field with no name writes no name attribute', async () => {
    const element = await mount({ label: 'Email' });
    expect(element.hasAttribute('name')).toBe(false);
  });

  it('value is not reflected: typing never writes the attribute', async () => {
    const element = await mount({ label: 'Email' });
    await userEvent.type(field(element), 'ana');
    expect(element.value).toBe('ana');
    expect(element.hasAttribute('value')).toBe(false);
  });

  it('is form-associated, with an open shadow root and delegated focus', async () => {
    const element = await mount();
    expect((NphInput as unknown as { formAssociated: boolean }).formAssociated).toBe(true);
    expect(element.shadowRoot?.mode).toBe('open');
    expect(element.shadowRoot?.delegatesFocus).toBe(true);
  });

  it('host focus goes to the inner native field', async () => {
    const element = await mount();
    element.focus();
    expect(element.shadowRoot?.activeElement).toBe(field(element));
  });

  it('passes type, placeholder, autocomplete and required to the inner field', async () => {
    const element = await mount({ label: 'Email', type: 'email', placeholder: 'name@example.com', autocomplete: 'email', required: true });
    const input = field(element);
    expect(input.type).toBe('email');
    expect(input.placeholder).toBe('name@example.com');
    expect(input.getAttribute('autocomplete')).toBe('email');
    expect(input.required).toBe(true);
  });

  it('without placeholder and autocomplete, the inner field carries neither attribute', async () => {
    const input = field(await mount());
    expect(input.hasAttribute('placeholder')).toBe(false);
    expect(input.hasAttribute('autocomplete')).toBe(false);
  });
});

describe('value: the attribute is the default, the property is the current value', () => {
  it('the value attribute gives the initial value', async () => {
    const holder = await markup('<nph-input label="City" value="Recife"></nph-input>');
    const element = holder.querySelector('nph-input') as NphInput;
    expect(element.value).toBe('Recife');
    expect(field(element).value).toBe('Recife');
  });

  it('changing the attribute before any edit changes the value', async () => {
    const element = await mount();
    element.setAttribute('value', 'Recife');
    await element.updateComplete;
    expect(element.value).toBe('Recife');
  });

  it('after the person edits, changing the attribute does not overwrite what was typed', async () => {
    const holder = await markup('<nph-input label="City" value="Recife"></nph-input>');
    const element = holder.querySelector('nph-input') as NphInput;
    await userEvent.clear(field(element));
    await userEvent.type(field(element), 'Natal');
    element.setAttribute('value', 'Olinda');
    await element.updateComplete;
    expect(element.value).toBe('Natal');
  });

  it('setting the property makes the field dirty, as in the native input', async () => {
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
    const property = document.createElement('nph-input') as NphInput;
    property.value = 'Recife';

    const attribute = document.createElement('nph-input') as NphInput;
    attribute.setAttribute('value', 'Natal');

    document.body.append(property, attribute);
    await Promise.all([property.updateComplete, attribute.updateComplete]);

    expect(property.value).toBe('Recife');
    expect(field(property).value).toBe('Recife');
    expect(attribute.value).toBe('Natal');
    expect(field(attribute).value).toBe('Natal');
  });

  it('keeps the host value aligned with native sanitization after assignment, reset and type changes', async () => {
    const holder = await markup('<form><nph-input label="Email" name="email" type="text" value="initial"></nph-input></form>');
    const form = holder.querySelector('form') as HTMLFormElement;
    const element = holder.querySelector('nph-input') as NphInput;

    element.value = 'a\nb';
    expect(element.value).toBe('ab');
    expect(new FormData(form).get('email')).toBe('ab');

    element.type = 'email';
    element.value = '  ana@example.com  ';
    await element.updateComplete;
    await element.updateComplete;
    expect(element.value).toBe('ana@example.com');
    expect(field(element).value).toBe('ana@example.com');
    expect(new FormData(form).get('email')).toBe('ana@example.com');

    element.setAttribute('value', '  reset@example.com  ');
    form.reset();
    expect(element.value).toBe('reset@example.com');
    expect(new FormData(form).get('email')).toBe('reset@example.com');
  });
});

describe('form association', () => {
  async function inForm(source: string): Promise<{ form: HTMLFormElement; element: NphInput }> {
    const holder = await markup(`<form>${source}</form>`);
    const form = holder.querySelector('form') as HTMLFormElement;
    const element = holder.querySelector('nph-input') as NphInput;
    return { form, element };
  }

  it('the host knows its form, and the form data carries name=value', async () => {
    const { form, element } = await inForm('<nph-input label="City" name="city" value="Recife"></nph-input>');
    expect(element.form).toBe(form);
    expect(new FormData(form).get('city')).toBe('Recife');
    await userEvent.clear(field(element));
    await userEvent.type(field(element), 'Natal');
    expect(new FormData(form).get('city')).toBe('Natal');
  });

  it('name set by property reaches the form data, because it reflects', async () => {
    const { form, element } = await inForm('<nph-input label="City"></nph-input>');
    element.name = 'city';
    element.value = 'Recife';
    await element.updateComplete;
    expect(new FormData(form).get('city')).toBe('Recife');
  });

  it('form.reset() goes back to the value attribute, and fires nothing', async () => {
    const { form, element } = await inForm('<nph-input label="City" name="city" value="Recife" required></nph-input>');
    await userEvent.clear(field(element));
    await userEvent.type(field(element), 'Natal');
    const events = vi.fn();
    element.addEventListener('input', events);
    element.addEventListener('change', events);
    element.value = '';
    expect(new FormData(form).get('city')).toBe('');
    expect(element.checkValidity()).toBe(false);
    form.reset();
    expect(element.value).toBe('Recife');
    expect(new FormData(form).get('city')).toBe('Recife');
    expect(element.checkValidity()).toBe(true);
    await element.updateComplete;
    expect(element.value).toBe('Recife');
    expect(field(element).value).toBe('Recife');
    expect(new FormData(form).get('city')).toBe('Recife');
    expect(events).not.toHaveBeenCalled();
    /* After the reset, the attribute applies again. */
    element.setAttribute('value', 'Olinda');
    await element.updateComplete;
    expect(element.value).toBe('Olinda');
  });

  it('required and empty: the validity is the one of the inner field, with the browser message', async () => {
    const { form, element } = await inForm('<nph-input label="City" name="city" required></nph-input>');
    expect(element.willValidate).toBe(true);
    expect(element.checkValidity()).toBe(false);
    expect(element.validity.valueMissing).toBe(true);
    expect(element.validationMessage).toBe(field(element).validationMessage);
    expect(element.validationMessage).not.toBe('');
    expect(form.checkValidity()).toBe(false);
    await userEvent.type(field(element), 'Recife');
    expect(element.checkValidity()).toBe(true);
    expect(form.checkValidity()).toBe(true);
  });

  it('synchronizes form data and validity before input and change listeners run', async () => {
    const { form, element } = await inForm('<nph-input label="City" name="city" value="Recife" required></nph-input>');
    const seen: Array<{ type: string; value: string; formValue: FormDataEntryValue | null; valid: boolean }> = [];
    const readState = (event: Event) => {
      seen.push({
        type: event.type,
        value: element.value,
        formValue: new FormData(form).get('city'),
        valid: element.checkValidity(),
      });
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

  it('a malformed email or url is invalid by type, as in the native field', async () => {
    const email = await mount({ label: 'Email', type: 'email', value: 'not an email' });
    expect(email.validity.typeMismatch).toBe(true);
    const url = await mount({ label: 'Site', type: 'url', value: 'not a url' });
    expect(url.validity.typeMismatch).toBe(true);
    email.value = 'ana@example.com';
    await email.updateComplete;
    expect(email.checkValidity()).toBe(true);
  });

  it('clears and restores malformed-value validity when disabled by property or fieldset', async () => {
    const direct = await mount({ label: 'Email', type: 'email', value: 'not an email' });
    direct.disabled = true;
    await direct.updateComplete;
    expect(direct.willValidate).toBe(false);
    expect(direct.validity.typeMismatch).toBe(false);
    expect(direct.checkValidity()).toBe(true);
    direct.disabled = false;
    await direct.updateComplete;
    expect(direct.validity.typeMismatch).toBe(true);
    expect(direct.checkValidity()).toBe(false);

    const holder = await markup('<form><fieldset><nph-input label="Email" type="email" name="email" value="not an email"></nph-input></fieldset></form>');
    const fieldset = holder.querySelector('fieldset') as HTMLFieldSetElement;
    const inherited = holder.querySelector('nph-input') as NphInput;
    fieldset.disabled = true;
    await inherited.updateComplete;
    expect(inherited.willValidate).toBe(false);
    expect(inherited.validity.typeMismatch).toBe(false);
    expect(inherited.checkValidity()).toBe(true);
    fieldset.disabled = false;
    await inherited.updateComplete;
    expect(inherited.validity.typeMismatch).toBe(true);
    expect(inherited.checkValidity()).toBe(false);
  });

  it('re-enabling disabled by property updates the field, clear button and validity', async () => {
    const element = await mount({
      label: 'Email',
      type: 'email',
      value: 'not an email',
      disabled: true,
      iconEnd: 'xmark',
      clearLabel: 'Clear',
    });

    expect(field(element).disabled).toBe(true);
    expect(clearButton(element)).toBeNull();

    element.disabled = false;
    await element.updateComplete;
    await element.updateComplete;

    expect(field(element).disabled).toBe(false);
    expect(clearButton(element)).not.toBeNull();
    expect(element.validity.typeMismatch).toBe(true);
    expect(element.checkValidity()).toBe(false);

    const holder = await markup('<form><fieldset disabled><nph-input label="Email" type="email" value="not an email" disabled></nph-input></fieldset></form>');
    const inherited = holder.querySelector('nph-input') as NphInput;
    inherited.disabled = false;
    await inherited.updateComplete;
    await inherited.updateComplete;

    expect(inherited.disabled).toBe(false);
    expect(field(inherited).disabled).toBe(true);
    expect(inherited.willValidate).toBe(false);
  });

  it('recomputes disabled fieldset inheritance and respects the first legend', async () => {
    const holder = await markup(
      '<form><fieldset><nph-input label="Email" type="email" name="email" value="not an email" icon-end="xmark" clear-label="Clear"></nph-input></fieldset></form>',
    );
    const fieldset = holder.querySelector('fieldset') as HTMLFieldSetElement;
    const inherited = holder.querySelector('nph-input') as NphInput;
    inherited.disabled = true;
    await inherited.updateComplete;

    fieldset.disabled = true;
    inherited.disabled = false;
    await inherited.updateComplete;

    expect(inherited.matches(':disabled')).toBe(true);
    expect(field(inherited).disabled).toBe(true);
    expect(clearButton(inherited)).toBeNull();
    expect(inherited.willValidate).toBe(false);
    expect(inherited.validity.typeMismatch).toBe(false);
    expect(inherited.checkValidity()).toBe(true);
    expect(new FormData(holder.querySelector('form') as HTMLFormElement).has('email')).toBe(false);
    field(inherited).focus();
    expect(inherited.shadowRoot?.activeElement).not.toBe(field(inherited));

    const legendHolder = await markup(
      '<form><fieldset disabled><legend><nph-input label="Email" type="email" name="email" value="not an email" disabled icon-end="xmark" clear-label="Clear"></nph-input></legend></fieldset></form>',
    );
    const exempt = legendHolder.querySelector('nph-input') as NphInput;
    exempt.disabled = false;
    await exempt.updateComplete;

    expect(exempt.matches(':disabled')).toBe(false);
    expect(field(exempt).disabled).toBe(false);
    expect(clearButton(exempt)).not.toBeNull();
    expect(exempt.willValidate).toBe(true);
    expect(exempt.validity.typeMismatch).toBe(true);
    expect(exempt.checkValidity()).toBe(false);
    expect(new FormData(legendHolder.querySelector('form') as HTMLFormElement).get('email')).toBe('not an email');
    field(exempt).focus();
    expect(exempt.shadowRoot?.activeElement).toBe(field(exempt));
  });

  it('invalid is not a constraint: it adds no customError', async () => {
    const element = await mount({ label: 'Email', invalid: true, value: 'x' });
    expect(element.validity.customError).toBe(false);
    expect(element.checkValidity()).toBe(true);
  });

  it('reportValidity delegates to the internals', async () => {
    const element = await mount({ label: 'Email', required: true });
    expect(element.reportValidity()).toBe(false);
  });

  it('a disabled fieldset disables the piece: out of the form data, out of validation, at the disabled look', async () => {
    const holder = await markup('<form><fieldset disabled><nph-input label="City" name="city" value="Recife" required></nph-input></fieldset></form>');
    const form = holder.querySelector('form') as HTMLFormElement;
    const element = holder.querySelector('nph-input') as NphInput;
    await element.updateComplete;
    expect(field(element).disabled).toBe(true);
    expect(new FormData(form).has('city')).toBe(false);
    expect(element.willValidate).toBe(false);
    expect(element.matches(':disabled')).toBe(true);
    expect(getComputedStyle(element).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
    (holder.querySelector('fieldset') as HTMLFieldSetElement).disabled = false;
    await element.updateComplete;
    expect(field(element).disabled).toBe(false);
    expect(new FormData(form).get('city')).toBe('Recife');
  });

  it('disabled leaves the piece out of the form data', async () => {
    const { form, element } = await inForm('<nph-input label="City" name="city" value="Recife" disabled></nph-input>');
    expect(field(element).disabled).toBe(true);
    expect(new FormData(form).has('city')).toBe(false);
  });

  it('the history restore puts the value back', async () => {
    const element = await mount();
    element.formStateRestoreCallback('Recife');
    await element.updateComplete;
    expect(element.value).toBe('Recife');
  });

  it('Enter submits the form through its default button, as a native field does', async () => {
    const { form, element } = await inForm('<nph-input label="City" name="city" value="Recife"></nph-input><button type="submit">Send</button>');
    const submitted = vi.fn((event: SubmitEvent) => {
      event.preventDefault();
      return event.submitter;
    });
    form.addEventListener('submit', submitted);
    field(element).focus();
    await userEvent.keyboard('{Enter}');
    await nextTask();
    expect(submitted).toHaveBeenCalledTimes(1);
    expect(submitted.mock.results[0]?.value).toBe(form.querySelector('button'));
  });

  it('Enter with no submit button submits the form itself', async () => {
    const { form, element } = await inForm('<nph-input label="City" name="city" value="Recife"></nph-input>');
    const submitted = vi.fn((event: Event) => event.preventDefault());
    form.addEventListener('submit', submitted);
    field(element).focus();
    await userEvent.keyboard('{Enter}');
    await nextTask();
    expect(submitted).toHaveBeenCalledTimes(1);
  });

  it('Enter respects consumer cancellation in capture and bubbling listeners', async () => {
    for (const capture of [true, false]) {
      const { form, element } = await inForm('<nph-input label="City" value="Recife"></nph-input><button type="submit">Send</button>');
      const submitted = vi.fn((event: Event) => event.preventDefault());
      form.addEventListener('submit', submitted);
      form.addEventListener('keydown', (event) => event.preventDefault(), { capture });
      field(element).focus();
      await userEvent.keyboard('{Enter}');
      await nextTask();
      expect(submitted).not.toHaveBeenCalled();
      form.remove();
    }
  });

  it('Enter submits when an ancestor only stops propagation', async () => {
    const holder = await markup(
      '<form><div id="stop"><nph-input label="City" value="Recife"></nph-input></div><button type="submit">Send</button></form>',
    );
    const form = holder.querySelector('form') as HTMLFormElement;
    const boundary = holder.querySelector('#stop') as HTMLElement;
    const element = holder.querySelector('nph-input') as NphInput;
    const submitted = vi.fn((event: Event) => event.preventDefault());
    form.addEventListener('submit', submitted);
    boundary.addEventListener('keydown', (event) => event.stopPropagation());
    field(element).focus();

    await userEvent.keyboard('{Enter}');
    await nextTask();

    expect(submitted).toHaveBeenCalledTimes(1);
  });

  it('Enter uses the first image submitter, including one associated by form', async () => {
    const holder = await markup(
      '<input type="image" form="search-form" alt="Image submit" formaction="/image" formnovalidate><form id="search-form"><nph-input label="Query" value="term"></nph-input><button type="submit">Send</button></form>',
    );
    const form = holder.querySelector('form') as HTMLFormElement;
    const image = holder.querySelector('input[type="image"]') as HTMLInputElement;
    const element = holder.querySelector('nph-input') as NphInput;
    const submitted = vi.fn((event: SubmitEvent) => {
      event.preventDefault();
      return event.submitter;
    });
    form.addEventListener('submit', submitted);
    field(element).focus();

    await userEvent.keyboard('{Enter}');
    await nextTask();

    expect(image.form).toBe(form);
    expect(submitted).toHaveBeenCalledTimes(1);
    expect(submitted.mock.results[0]?.value).toBe(image);
  });

  it('Enter does not submit when the default button is disabled, nor when the field is required and empty', async () => {
    const disabled = await inForm('<nph-input label="City" value="Recife"></nph-input><button type="submit" disabled>Send</button>');
    const first = vi.fn((event: Event) => event.preventDefault());
    disabled.form.addEventListener('submit', first);
    field(disabled.element).focus();
    await userEvent.keyboard('{Enter}');
    await nextTask();
    expect(first).not.toHaveBeenCalled();

    const required = await inForm('<nph-input label="Town" required></nph-input><button type="submit">Send</button>');
    const second = vi.fn((event: Event) => event.preventDefault());
    required.form.addEventListener('submit', second);
    field(required.element).focus();
    await userEvent.keyboard('{Enter}');
    await nextTask();
    expect(second).not.toHaveBeenCalled();
  });

  it('Enter with no form does nothing', async () => {
    const element = await mount({ label: 'City', value: 'Recife' });
    field(element).focus();
    await userEvent.keyboard('{Enter}');
    await nextTask();
    expect(element.value).toBe('Recife');
  });
});

describe('accessible name and description', () => {
  it('nph-label for names the field: the click moves the focus, and the tree has the name without the asterisk', async () => {
    const holder = await markup('<nph-label for="email" text="Email" required></nph-label><nph-input id="email" required></nph-input>');
    const element = holder.querySelector('nph-input') as NphInput;
    await nextFrame();
    expect(element.labels.length).toBe(1);
    await userEvent.click(holder.querySelector('label') as HTMLLabelElement);
    expect(element.shadowRoot?.activeElement).toBe(field(element));
    const node = await accessibleNodeOf(element);
    expect(node.role?.value).toBe('textbox');
    expect(node.name?.value).toBe('Email');
    expect(field(element).hasAttribute('aria-label')).toBe(false);
    expect(field(element).ariaLabelledByElements).toEqual([holder.querySelector('label')]);
  });

  it('a native label wrapping the host names the field too', async () => {
    const holder = await markup('<label>City <nph-input></nph-input></label>');
    const element = holder.querySelector('nph-input') as NphInput;
    await nextFrame();
    const node = await accessibleNodeOf(element);
    expect(node.name?.value?.trim()).toBe('City');
  });

  it('label is the name when no label is associated, as aria-label of the inner field', async () => {
    const element = await mount({ label: 'Search' });
    expect(field(element).getAttribute('aria-label')).toBe('Search');
    const node = await accessibleNodeOf(element);
    expect(node.name?.value).toBe('Search');
  });

  it('an associated label wins over label', async () => {
    const holder = await markup('<nph-label for="city" text="City"></nph-label><nph-input id="city" label="Town"></nph-input>');
    const element = holder.querySelector('nph-input') as NphInput;
    await nextFrame();
    const node = await accessibleNodeOf(element);
    expect(node.name?.value).toBe('City');
  });

  it('the name follows a change of the label text, since it is a reference and not a copy', async () => {
    const holder = await markup('<nph-label for="city" text="City"></nph-label><nph-input id="city"></nph-input>');
    const element = holder.querySelector('nph-input') as NphInput;
    await nextFrame();
    const label = holder.querySelector('nph-label') as HTMLElement & { text: string; updateComplete: Promise<unknown> };
    label.text = 'Town';
    await label.updateComplete;
    const node = await accessibleNodeOf(element);
    expect(node.name?.value).toBe('Town');
  });

  it('updates the name when nph-label recreates its label, without refocusing the field', async () => {
    const holder = await markup(
      '<nph-label for="email" text="Email" info="More about email" info-label="More information"></nph-label><nph-input id="email"></nph-input>',
    );
    const element = holder.querySelector('nph-input') as NphInput;
    const labelHost = holder.querySelector('nph-label') as HTMLElement & { info: string; updateComplete: Promise<unknown> };
    const previousLabel = holder.querySelector('label');
    const focus = vi.fn();

    await nextFrame();
    field(element).focus();
    field(element).addEventListener('focus', focus);
    labelHost.info = '';
    await labelHost.updateComplete;
    await nextFrame();

    expect(holder.querySelector('label')).not.toBe(previousLabel);
    expect(element.shadowRoot?.activeElement).toBe(field(element));
    expect(focus).not.toHaveBeenCalled();
    expect((await accessibleNodeOf(element)).name?.value).toBe('Email');
  });

  it('description is the accessible description, in a clipped element, never display none', async () => {
    const element = await mount({ label: 'Email', description: 'We never share it.' });
    const input = field(element);
    const description = element.shadowRoot?.getElementById(input.getAttribute('aria-describedby') ?? '');
    expect(description?.textContent).toBe('We never share it.');
    expect(getComputedStyle(description as HTMLElement).display).not.toBe('none');
    expect(getComputedStyle(description as HTMLElement).clipPath).toBe('inset(50%)');
    const node = await accessibleNodeOf(element);
    expect(node.description?.value).toBe('We never share it.');
  });

  it('without description, there is no describedby and no hidden element', async () => {
    const element = await mount({ label: 'Email' });
    expect(field(element).hasAttribute('aria-describedby')).toBe(false);
    expect(element.shadowRoot?.querySelector('.description')).toBeNull();
  });

  it('the placeholder is not a name: with no name at all, one warning after the first frame, and the field renders', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const element = await mount({ placeholder: 'Search' });
    await nextFrame();
    await nextFrame();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0]?.[0])).toContain('[nph-input]');
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
    /* Typing does not repeat it. */
    await userEvent.type(field(element), 'a');
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('a label that arrives after the first render gives the name, with no warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const holder = await markup('<nph-input id="late"></nph-input>');
    const label = document.createElement('nph-label') as HTMLElement & { text: string; for: string };
    label.text = 'Late';
    label.for = 'late';
    holder.prepend(label);
    await nextFrame();
    await nextFrame();
    expect(warn).not.toHaveBeenCalled();
  });

  it('invalid puts aria-invalid on the inner field; disabled takes it away', async () => {
    const element = await mount({ label: 'Email', invalid: true });
    expect(field(element).getAttribute('aria-invalid')).toBe('true');
    element.disabled = true;
    await element.updateComplete;
    expect(field(element).hasAttribute('aria-invalid')).toBe(false);
  });

  it('required reaches the tree through the native field', async () => {
    const element = await mount({ label: 'Email', required: true });
    expect(field(element).required).toBe(true);
  });

  it('the icons are decorative', async () => {
    const element = await mount({ label: 'Search', iconStart: 'magnifying-glass', iconEnd: 'xmark', clearLabel: 'Clear', value: 'a' });
    for (const icon of element.shadowRoot?.querySelectorAll('nph-icon') ?? []) {
      expect(icon.getAttribute('aria-hidden')).toBe('true');
    }
  });
});

describe('clear button', () => {
  const clearable: Props = { label: 'Search', iconEnd: 'xmark', clearLabel: 'Clear search' };

  it('shows only with a value, with clear-label as its name', async () => {
    const element = await mount(clearable);
    expect(clearButton(element)).toBeNull();
    await userEvent.type(field(element), 'lamp');
    const button = clearButton(element);
    expect(button).not.toBeNull();
    expect(button?.type).toBe('button');
    expect(button?.getAttribute('aria-label')).toBe('Clear search');
    expect(button?.querySelector('nph-icon')?.getAttribute('name')).toBe('xmark');
  });

  it('a click empties the value, moves the focus back to the field and fires input and change', async () => {
    const element = await mount({ ...clearable, value: 'lamp' });
    const order: string[] = [];
    element.addEventListener('input', (event) => order.push(`input:${event.composed}`));
    element.addEventListener('change', () => order.push('change'));
    await userEvent.click(clearButton(element) as HTMLButtonElement);
    await element.updateComplete;
    expect(element.value).toBe('');
    expect(field(element).value).toBe('');
    expect(element.shadowRoot?.activeElement).toBe(field(element));
    expect(clearButton(element)).toBeNull();
    expect(order).toEqual(['input:true', 'change']);
  });

  it('Enter and Space on the focused button clear too', async () => {
    for (const key of ['{Enter}', ' ']) {
      const element = await mount({ ...clearable, value: 'lamp' });
      field(element).focus();
      await userEvent.tab();
      expect(element.shadowRoot?.activeElement).toBe(clearButton(element));
      await userEvent.keyboard(key);
      await element.updateComplete;
      expect(element.value).toBe('');
      expect(element.shadowRoot?.activeElement).toBe(field(element));
      element.remove();
    }
  });

  it('clearing goes into the form data', async () => {
    const holder = await markup('<form><nph-input label="Search" name="q" value="lamp" icon-end="xmark" clear-label="Clear"></nph-input></form>');
    const element = holder.querySelector('nph-input') as NphInput;
    await userEvent.click(clearButton(element) as HTMLButtonElement);
    await element.updateComplete;
    expect(new FormData(holder.querySelector('form') as HTMLFormElement).get('q')).toBe('');
  });

  it('another core name swaps only the art: the action is still to clear (D2)', async () => {
    const element = await mount({ ...clearable, iconEnd: 'circle-xmark', value: 'lamp' });
    expect(clearButton(element)?.querySelector('nph-icon')?.getAttribute('name')).toBe('circle-xmark');
    await userEvent.click(clearButton(element) as HTMLButtonElement);
    expect(element.value).toBe('');
  });

  it('disabled hides the clear button', async () => {
    const element = await mount({ ...clearable, value: 'lamp', disabled: true });
    expect(clearButton(element)).toBeNull();
  });

  it('icon-end without clear-label: the field renders without the button, with one error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount({ label: 'Search', iconEnd: 'xmark', value: 'lamp' });
    expect(error).toHaveBeenCalledTimes(1);
    expect(String(error.mock.calls[0]?.[0])).toContain('clear-label');
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
    expect(clearButton(element)).toBeNull();
    element.clearLabel = 'Clear';
    await element.updateComplete;
    expect(clearButton(element)).not.toBeNull();
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

describe('measures and anatomy', () => {
  it('the container: height, radius, border, side padding and gap come from tokens', async () => {
    const element = await mount({ label: 'Search', iconStart: 'magnifying-glass' });
    const style = getComputedStyle(container(element));
    expect(container(element).getBoundingClientRect().height).toBeCloseTo(px('--nph-control-height-default'), 2);
    expect(style.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-radius-control'));
    expect(style.borderTopWidth).toBe(resolved('width', '--nph-border-width'));
    expect(style.paddingInlineStart).toBe(resolved('padding-left', '--nph-space-control-padding'));
    expect(style.paddingInlineEnd).toBe(resolved('padding-left', '--nph-space-control-padding'));
    expect(style.columnGap).toBe(resolved('column-gap', '--nph-space-inline'));
    expect(style.backgroundColor).toBe(resolved('color', '--nph-color-background'));
  });

  it('large changes only the height', async () => {
    const regular = await mount({ label: 'Search', iconStart: 'magnifying-glass' });
    const large = await mount({ label: 'Search', iconStart: 'magnifying-glass', size: 'large' });
    expect(container(large).getBoundingClientRect().height).toBeCloseTo(px('--nph-control-height-large'), 2);
    const a = getComputedStyle(container(regular));
    const b = getComputedStyle(container(large));
    for (const property of ['paddingInlineStart', 'columnGap', 'borderTopLeftRadius', 'borderTopWidth'] as const) {
      expect(b[property]).toBe(a[property]);
    }
    expect(getComputedStyle(field(large)).fontSize).toBe(getComputedStyle(field(regular)).fontSize);
  });

  it('the value is text/body-md in color/foreground; the placeholder is color/muted-foreground', async () => {
    const element = await mount({ label: 'Search', placeholder: 'Search' });
    const style = getComputedStyle(field(element));
    expect(style.fontSize).toBe(resolved('font-size', '--nph-text-body-md-font-size'));
    expect(style.lineHeight).toBe(resolved('line-height', '--nph-text-body-md-line-height'));
    expect(style.fontWeight).toBe(resolved('font-weight', '--nph-text-body-md-font-weight'));
    expect(style.color).toBe(resolved('color', '--nph-color-foreground'));
    expect(getComputedStyle(field(element), '::placeholder').color).toBe(resolved('color', '--nph-color-muted-foreground'));
  });

  it('the icons are nph-icon in icon/size-sm, light, in color/muted-foreground', async () => {
    const element = await mount({ label: 'Search', iconStart: 'magnifying-glass', iconEnd: 'xmark', clearLabel: 'Clear', value: 'a' });
    const icons = [...(element.shadowRoot?.querySelectorAll<HTMLElement>('nph-icon') ?? [])];
    expect(icons.map((icon) => icon.getAttribute('name'))).toEqual(['magnifying-glass', 'xmark']);
    for (const icon of icons) {
      expect(icon.getAttribute('size')).toBe('sm');
      expect(icon.hasAttribute('variant')).toBe(false);
      expect(icon.getBoundingClientRect().width).toBeCloseTo(px('--nph-icon-size-sm'), 2);
      expect(getComputedStyle(icon).color).toBe(resolved('color', '--nph-color-muted-foreground'));
    }
  });

  it('the order is start icon, value, clear button', async () => {
    const element = await mount({ label: 'Search', iconStart: 'magnifying-glass', iconEnd: 'xmark', clearLabel: 'Clear', value: 'a' });
    const parts = [...container(element).children].map((child) => child.className || child.tagName.toLowerCase());
    expect(parts).toEqual(['icon-start', 'field', 'clear']);
  });

  it('the clear target is 24 x 24: icon/size-sm with space/inline-tight around it, no radius', async () => {
    const element = await mount({ label: 'Search', iconEnd: 'xmark', clearLabel: 'Clear', value: 'a' });
    const button = clearButton(element) as HTMLButtonElement;
    const side = px('--nph-icon-size-sm') + 2 * px('--nph-space-inline-tight');
    expect(button.getBoundingClientRect().width).toBeCloseTo(side, 2);
    expect(button.getBoundingClientRect().height).toBeCloseTo(side, 2);
    expect(side).toBe(24);
    expect(getComputedStyle(button).borderTopLeftRadius).toBe('0px');
    expect(getComputedStyle(button).backgroundColor).toBe('rgba(0, 0, 0, 0)');
  });

  it('the default width is layout/input-width; the parent may stretch it, with no minimum (D6)', async () => {
    const element = await mount();
    expect(element.getBoundingClientRect().width).toBeCloseTo(px('--nph-layout-input-width'), 2);
    element.style.inlineSize = '100%';
    const wide = document.createElement('div');
    wide.style.inlineSize = '600px';
    document.body.append(wide);
    wide.append(element);
    expect(element.getBoundingClientRect().width).toBeCloseTo(600, 2);
    expect(container(element).getBoundingClientRect().width).toBeCloseTo(600, 2);
    wide.style.inlineSize = '40px';
    expect(element.getBoundingClientRect().width).toBeCloseTo(40, 2);
  });

  it('a search field shows no cancel button of the browser: the clear button of the piece is the only one', async () => {
    const element = await mount({ label: 'Search', type: 'search', value: 'lamp' });
    field(element).focus();
    const session = cdp();
    await session.send('DOM.enable');
    await session.send('CSS.enable');
    await session.send('DOM.getDocument', { depth: -1, pierce: true });
    const { searchId, resultCount } = await session.send('DOM.performSearch', { query: '[pseudo="-webkit-search-cancel-button"]', includeUserAgentShadowDOM: true });
    expect(resultCount).toBeGreaterThan(0);
    const { nodeIds } = await session.send('DOM.getSearchResults', { searchId, fromIndex: 0, toIndex: resultCount });
    await session.send('DOM.discardSearchResults', { searchId });
    for (const nodeId of nodeIds) {
      const { computedStyle } = await session.send('CSS.getComputedStyleForNode', { nodeId });
      expect(computedStyle.find((property) => property.name === 'display')?.value).toBe('none');
    }
  });

  it('a click on the frame or the start icon puts the focus in the field', async () => {
    const element = await mount({ label: 'Search', iconStart: 'magnifying-glass' });
    await userEvent.click(element.shadowRoot?.querySelector('nph-icon') as HTMLElement);
    expect(element.shadowRoot?.activeElement).toBe(field(element));
  });
});

describe('states and precedence (D4, D5)', () => {
  const border = (element: NphInput): string => getComputedStyle(container(element)).borderTopColor;
  const halo = (element: NphInput): CSSStyleDeclaration => getComputedStyle(container(element), '::after');

  for (const scheme of ['light', 'dark'] as const) {
    it(`${scheme}: default border color/input; hover color/input-hover`, async () => {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const element = await mount();
      expect(border(element)).toBe(resolved('color', '--nph-color-input'));
      await userEvent.hover(container(element));
      expect(border(element)).toBe(resolved('color', '--nph-color-input-hover'));
    });
  }

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
    expect(Number.parseFloat(ring.height)).toBeCloseTo(box.height + 2 * px('--nph-focus-ring-width'), 2);
  });

  it('focus wins over hover', async () => {
    const element = await mount();
    field(element).focus();
    await userEvent.hover(container(element));
    expect(border(element)).toBe(resolved('color', '--nph-focus-border'));
  });

  it('a mouse click in the field also shows the focus: a text field always shows where the caret is', async () => {
    const element = await mount();
    await userEvent.click(field(element));
    expect(border(element)).toBe(resolved('color', '--nph-focus-border'));
  });

  it('focus on the clear button under hover: the container keeps color/input; border and halo sit around the 24 x 24 target', async () => {
    const element = await mount({ label: 'Search', iconEnd: 'xmark', clearLabel: 'Clear', value: 'lamp' });
    await userEvent.hover(container(element));
    field(element).focus();
    await userEvent.tab();
    const button = clearButton(element) as HTMLButtonElement;
    expect(element.shadowRoot?.activeElement).toBe(button);
    expect(border(element)).toBe(resolved('color', '--nph-color-input'));
    expect(halo(element).content).toBe('none');
    const before = getComputedStyle(button, '::before');
    const after = getComputedStyle(button, '::after');
    expect(before.borderTopColor).toBe(resolved('color', '--nph-focus-border'));
    expect(before.borderTopWidth).toBe(resolved('width', '--nph-border-width'));
    expect(before.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-border-radius-control'));
    expect(after.borderTopColor).toBe(resolved('color', '--nph-focus-halo'));
    expect(after.borderTopWidth).toBe(resolved('width', '--nph-focus-ring-width'));
    expect(after.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-radius-control-with-border'));
    const box = button.getBoundingClientRect();
    expect(Number.parseFloat(before.width)).toBeCloseTo(box.width + 2 * px('--nph-border-width'), 2);
    expect(Number.parseFloat(after.width)).toBeCloseTo(box.width + 2 * (px('--nph-border-width') + px('--nph-focus-ring-width')), 2);
  });

  it('a mouse click on the clear button draws no focus ring around it', async () => {
    const element = await mount({ label: 'Search', iconEnd: 'xmark', clearLabel: 'Clear', value: 'lamp' });
    const button = clearButton(element) as HTMLButtonElement;
    await userEvent.hover(button);
    button.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    expect(getComputedStyle(button, '::before').content).toBe('none');
  });

  it('error: border status/error, also on hover', async () => {
    const element = await mount({ label: 'Email', invalid: true });
    expect(border(element)).toBe(resolved('color', '--nph-status-error'));
    await userEvent.hover(container(element));
    expect(border(element)).toBe(resolved('color', '--nph-status-error'));
  });

  it('error with focus: border status/error, halo focus/halo-error at focus/radius-control', async () => {
    const element = await mount({ label: 'Email', invalid: true });
    field(element).focus();
    expect(border(element)).toBe(resolved('color', '--nph-status-error'));
    expect(halo(element).borderTopColor).toBe(resolved('color', '--nph-focus-halo-error'));
    expect(halo(element).borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-radius-control'));
  });

  it('error with focus on the clear button: the container is status/error, the target takes the usual focus', async () => {
    const element = await mount({ label: 'Search', invalid: true, iconEnd: 'xmark', clearLabel: 'Clear', value: 'lamp' });
    field(element).focus();
    await userEvent.tab();
    const button = clearButton(element) as HTMLButtonElement;
    expect(border(element)).toBe(resolved('color', '--nph-status-error'));
    expect(getComputedStyle(button, '::before').borderTopColor).toBe(resolved('color', '--nph-focus-border'));
    expect(getComputedStyle(button, '::after').borderTopColor).toBe(resolved('color', '--nph-focus-halo'));
  });

  it('disabled: border color/input, background color/muted, the whole piece at state/disabled-opacity, out of Tab', async () => {
    const before = document.createElement('input');
    document.body.append(before);
    const element = await mount({ label: 'Email', disabled: true, value: 'a' });
    expect(border(element)).toBe(resolved('color', '--nph-color-input'));
    expect(getComputedStyle(container(element)).backgroundColor).toBe(resolved('color', '--nph-color-muted'));
    expect(getComputedStyle(element).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
    expect(field(element).disabled).toBe(true);
    before.focus();
    await userEvent.tab();
    expect(element.shadowRoot?.activeElement ?? null).toBeNull();
  });

  it('disabled with error: disabled wins, no error look (D5)', async () => {
    const element = await mount({ label: 'Email', disabled: true, invalid: true });
    expect(border(element)).toBe(resolved('color', '--nph-color-input'));
    await userEvent.hover(container(element));
    expect(border(element)).toBe(resolved('color', '--nph-color-input'));
  });

  it('an enabled piece is at full opacity, with no transition (D4)', async () => {
    const element = await mount();
    expect(getComputedStyle(element).opacity).toBe('1');
    for (const part of [container(element), field(element)]) {
      expect(getComputedStyle(part).transitionDuration).toBe('0s');
    }
  });
});

describe('invalid input', () => {
  const cases: ReadonlyArray<readonly [string, Props, number]> = [
    ['a type out of v1', { label: 'Pin', type: 'password' }, 1],
    ['the number type', { label: 'Age', type: 'number' }, 1],
    ['a size that does not exist', { label: 'Email', size: 'small' }, 1],
    ['icon-start outside none and the core', { label: 'Email', iconStart: 'not-a-core-name' }, 1],
    ['icon-end outside none and the core', { label: 'Email', iconEnd: 'not-a-core-name', clearLabel: 'Clear' }, 1],
    ['an empty icon value', { label: 'Email', iconStart: '' }, 1],
    ['accumulates the causes', { label: 'Email', type: 'password', size: 'small', iconStart: 'nope' }, 3],
  ];
  for (const [name, props, count] of cases) {
    it(`${name}: nothing and ${count} error(s) in development`, async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      const element = await mount(props);
      expect(error).toHaveBeenCalledTimes(count);
      for (const call of error.mock.calls) {
        expect(String(call[0])).toContain('[nph-input]');
      }
      expect(element.shadowRoot?.querySelector('input')).toBeNull();
      expect(element.hasAttribute('data-nph-rendered')).toBe(false);
      expect(element.getBoundingClientRect().width).toBe(0);
      expect(element.getBoundingClientRect().height).toBe(0);
    });
  }

  it('an invalid piece adds nothing to the form data and blocks nothing', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const holder = await markup('<form><nph-input label="Pin" name="pin" type="password" value="1234" required></nph-input></form>');
    const form = holder.querySelector('form') as HTMLFormElement;
    expect(new FormData(form).has('pin')).toBe(false);
    expect(form.checkValidity()).toBe(true);
  });

  for (const type of NPH_INPUT_TYPES) {
    it(`type ${type}: draws and emits no error`, async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      const element = await mount({ label: 'Value', type });
      expect(error).not.toHaveBeenCalled();
      expect(field(element).type).toBe(type);
    });
  }

  it('typing and changing the state do not repeat the errors', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount({ label: 'Email', iconEnd: 'xmark' });
    await userEvent.type(field(element), 'ab');
    element.invalid = true;
    element.disabled = true;
    await element.updateComplete;
    expect(error).toHaveBeenCalledTimes(1);
  });

  it('a valid input set later draws the piece', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount({ label: 'Pin', type: 'password' });
    element.type = 'text';
    await element.updateComplete;
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
    expect(field(element).type).toBe('text');
  });
});

describe('what the piece does not have', () => {
  it('has no slot and no part', async () => {
    const element = await mount({ label: 'Search', iconStart: 'magnifying-glass', iconEnd: 'xmark', clearLabel: 'Clear', value: 'a' });
    expect(element.shadowRoot?.querySelector('slot, [part]')).toBeNull();
  });

  it('has no color, variant or read-only property, and no own error message (it belongs to nph-field)', () => {
    const declared = [...(NphInput as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    for (const name of ['variant', 'severity', 'color', 'readonly', 'readOnly', 'error', 'errorMessage', 'help', 'maxlength', 'pattern', 'inputmode']) {
      expect(declared).not.toContain(name);
    }
  });

  it('the host has no tabindex: the only focusable elements are the native field and the clear button', async () => {
    const element = await mount({ label: 'Search', iconEnd: 'xmark', clearLabel: 'Clear', value: 'a' });
    expect(element.hasAttribute('tabindex')).toBe(false);
    expect(element.shadowRoot?.querySelectorAll('input').length).toBe(1);
    expect(element.shadowRoot?.querySelectorAll('button').length).toBe(1);
    expect(element.shadowRoot?.querySelectorAll('a, select, textarea, [tabindex]').length).toBe(0);
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
        '--nph-space-inline',
        '--nph-control-height-default',
        '--nph-control-height-large',
        '--nph-space-control-padding',
        '--nph-border-width',
        '--nph-radius-control',
        '--nph-color-background',
        '--nph-color-muted-foreground',
        '--nph-color-foreground',
        '--nph-text-body-md-font-family',
        '--nph-text-body-md-font-size',
        '--nph-text-body-md-font-weight',
        '--nph-text-body-md-line-height',
        '--nph-text-body-md-letter-spacing',
        '--nph-space-inline-tight',
        '--nph-color-input-hover',
        '--nph-focus-border',
        '--nph-focus-ring-width',
        '--nph-focus-halo',
        '--nph-focus-radius-control',
        '--nph-focus-border-radius-control',
        '--nph-focus-radius-control-with-border',
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

  it('design.md says what the tokens of the piece are for', () => {
    expect(designMd).toMatch(/color\/input:[\s\S]{0,200}use: "Field border: input/);
    expect(designMd).toMatch(/color\/input-hover:[\s\S]{0,200}Border of the form field when the pointer is over it/);
    expect(designMd).toMatch(/focus\/halo-error:[\s\S]{0,200}Focus HALO when the field is invalid/);
    expect(designMd).toMatch(/focus\/radius-control:[\s\S]{0,200}Radius of the focus halo around a control with radius\/control/);
    expect(designMd).toMatch(/state\/disabled-opacity:[\s\S]{0,200}applied to the WHOLE control/);
    expect(designMd).toMatch(/control\/height-large:[\s\S]{0,200}Guarantees the 44px minimum target/);
    expect(designMd).toContain('  layout/input-width:');
  });
});
