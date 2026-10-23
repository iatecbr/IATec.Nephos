/**
 * Tests of `nph-select` (P91), in a real browser (P21, item 5): the top layer, the
 * keyboard, the form and the accessibility tree only exist where there is layout.
 *
 * They prove the contract accepted in Figma (frame `1357:160`, set `1357:115`, option
 * `1357:136`, list `1357:137`) and D1 to D9: the API, the value and the form
 * association (P80), the field contract (P83), the accessible name, the pointer and
 * the keyboard of the select-only combobox, the events, the start of the trigger, the
 * list in the top layer and its measures, the states and their precedence, the
 * invalid input and the token contract.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cdp, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-select.css?raw';
import '../nph-field/nph-field';
import '../nph-label/nph-label';
import { NphOption } from '../nph-option/nph-option';
import { NPH_SELECT_SIZES, NPH_SELECT_STARTS, NphSelect } from './nph-select';

beforeAll(async () => {
  await document.fonts.load('400 14px "Noto Sans"');
  await document.fonts.load('500 14px "Noto Sans"');
  await document.fonts.ready;
});

afterEach(async () => {
  await userEvent.unhover(document.body).catch(() => {});
  document.body.replaceChildren();
  document.documentElement.removeAttribute('data-nph-color-scheme');
  vi.restoreAllMocks();
});

const DEPARTMENTS = ['Finance', 'Legal', 'Marketing', 'Operations', 'People', 'Product', 'Sales', 'Support'];

function options(labels: readonly string[] = DEPARTMENTS): string {
  return labels.map((label) => `<nph-option value="${label.toLowerCase()}">${label}</nph-option>`).join('');
}

/** Mounts from markup, so the attributes arrive as a parser would give them. */
async function markup(source: string, parent: HTMLElement = document.body): Promise<HTMLElement> {
  const holder = document.createElement('div');
  holder.innerHTML = source;
  parent.append(holder);
  await settle(holder);
  return holder;
}

async function settle(root: ParentNode = document.body): Promise<void> {
  const elements = [...root.querySelectorAll<HTMLElement & { updateComplete?: Promise<unknown> }>('nph-select, nph-option, nph-field, nph-label')];
  await Promise.all(elements.map((element) => element.updateComplete));
  await Promise.all(elements.map((element) => element.updateComplete));
}

async function mount(attributes = 'label="Department"', children = options()): Promise<NphSelect> {
  const holder = await markup(`<nph-select ${attributes}>${children}</nph-select>`);
  return holder.querySelector('nph-select') as NphSelect;
}

function trigger(element: NphSelect): HTMLElement {
  const box = element.shadowRoot?.querySelector<HTMLElement>('.trigger');
  if (!box) throw new Error('no trigger');
  return box;
}

function list(element: NphSelect): HTMLElement {
  const box = element.shadowRoot?.querySelector<HTMLElement>('.list');
  if (!box) throw new Error('no list');
  return box;
}

function scroller(element: NphSelect): HTMLElement {
  return element.shadowRoot?.querySelector<HTMLElement>('.scroller') as HTMLElement;
}

function optionsOf(element: NphSelect): NphOption[] {
  return [...element.querySelectorAll('nph-option')];
}

function option(element: NphSelect, label: string): NphOption {
  const found = optionsOf(element).find((item) => item.textContent?.trim() === label);
  if (!found) throw new Error(`no option ${label}`);
  return found;
}

function shownText(element: NphSelect): string {
  return element.shadowRoot?.querySelector('.value')?.textContent?.trim() ?? '';
}

function activeOf(element: NphSelect): Element | null {
  return (trigger(element) as HTMLElement & { ariaActiveDescendantElement: Element | null }).ariaActiveDescendantElement;
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function press(element: NphSelect, key: string): Promise<void> {
  await userEvent.keyboard(key);
  await settle(element.parentElement ?? document.body);
}

async function focusTrigger(element: NphSelect): Promise<void> {
  trigger(element).focus();
  await settle(element.parentElement ?? document.body);
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

interface AXNode {
  role?: { value?: string };
  name?: { value?: string };
  description?: { value?: string };
  properties?: Array<{ name: string; value: { value?: unknown; relatedNodes?: Array<{ backendDOMNodeId?: number }> } }>;
  ignored?: boolean;
  backendDOMNodeId?: number;
}

/** The node of an element in the accessibility tree of Chromium, looked up through the DOM domain. */
async function accessibleNodeOf(target: Element): Promise<AXNode> {
  const session = cdp();
  await session.send('Accessibility.enable');
  target.setAttribute('data-ax-probe', '');
  try {
    await session.send('DOM.getDocument', { depth: -1, pierce: true });
    const { searchId, resultCount } = await session.send('DOM.performSearch', { query: '[data-ax-probe]', includeUserAgentShadowDOM: false });
    expect(resultCount).toBe(1);
    const { nodeIds } = await session.send('DOM.getSearchResults', { searchId, fromIndex: 0, toIndex: 1 });
    await session.send('DOM.discardSearchResults', { searchId });
    const { nodes } = await session.send('Accessibility.getPartialAXTree', { nodeId: nodeIds[0] as number, fetchRelatives: false });
    return (nodes[0] ?? {}) as AXNode;
  } finally {
    target.removeAttribute('data-ax-probe');
  }
}

describe('registration and API', () => {
  it('defines nph-select and nph-option; importing the select registers the option', () => {
    expect(customElements.get('nph-select')).toBe(NphSelect);
    expect(customElements.get('nph-option')).toBe(NphOption);
  });

  it('defaults: size default, start none, icon globe, closed, not required, not disabled, not invalid', async () => {
    const element = await mount();
    expect(element.size).toBe('default');
    expect(element.start).toBe('none');
    expect(element.icon).toBe('globe');
    expect(element.open).toBe(false);
    expect(element.required).toBe(false);
    expect(element.disabled).toBe(false);
    expect(element.invalid).toBe(false);
    expect(element.placeholder).toBe('');
    expect(element.value).toBe('');
    expect(NPH_SELECT_SIZES).toEqual(['default', 'large']);
    expect(NPH_SELECT_STARTS).toEqual(['none', 'icon', 'avatar']);
  });

  it('reflects size, open, name, required, disabled and invalid', async () => {
    const element = await mount();
    Object.assign(element, { size: 'large', name: 'department', required: true, disabled: true, invalid: true });
    await element.updateComplete;
    for (const name of ['size', 'name', 'required', 'disabled', 'invalid']) {
      expect(element.hasAttribute(name), name).toBe(true);
    }
    element.disabled = false;
    element.open = true;
    await element.updateComplete;
    expect(element.hasAttribute('open')).toBe(true);
  });

  it('the trigger is a combobox that controls a listbox, in the same root', async () => {
    const element = await mount();
    expect(trigger(element).getAttribute('role')).toBe('combobox');
    expect(trigger(element).getAttribute('aria-haspopup')).toBe('listbox');
    expect(trigger(element).getAttribute('aria-expanded')).toBe('false');
    expect(trigger(element).getAttribute('aria-controls')).toBe(list(element).id);
    expect(list(element).getAttribute('role')).toBe('listbox');
    expect(list(element).getAttribute('popover')).toBe('manual');
  });

  it('has no part and no slot besides the one of the options', async () => {
    const element = await mount();
    expect(element.shadowRoot?.querySelectorAll('[part]').length).toBe(0);
    const slots = element.shadowRoot?.querySelectorAll('slot') ?? [];
    expect(slots.length).toBe(1);
    expect((slots[0] as HTMLSlotElement).name).toBe('');
  });

  it('has no width, color or search property, and no nphFieldRole (single control, P83)', () => {
    const declared = [...(NphSelect as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    for (const name of ['width', 'color', 'variant', 'search', 'multiple', 'error', 'help']) {
      expect(declared).not.toContain(name);
    }
    expect((NphSelect as unknown as { nphFieldRole?: unknown }).nphFieldRole).toBeUndefined();
  });
});

describe('value: the attribute is the default, the property is the current value', () => {
  it('the value attribute chooses the option of that value', async () => {
    const element = await mount('label="Department" value="legal"');
    expect(element.value).toBe('legal');
    expect(shownText(element)).toBe('Legal');
    expect(option(element, 'Legal').selected).toBe(true);
    expect(optionsOf(element).filter((item) => item.selected)).toHaveLength(1);
  });

  it('without a choice, the trigger shows the placeholder in color/muted-foreground', async () => {
    const element = await mount('label="Department" placeholder="Select an option"');
    const value = element.shadowRoot?.querySelector('.value') as HTMLElement;
    expect(value.textContent?.trim()).toBe('Select an option');
    expect(value.classList.contains('placeholder')).toBe(true);
    expect(getComputedStyle(value).color).toBe(resolved('color', '--nph-color-muted-foreground'));
  });

  it('the property sets the current value and stops the attribute from applying', async () => {
    const element = await mount('label="Department" value="legal"');
    element.value = 'sales';
    await element.updateComplete;
    expect(shownText(element)).toBe('Sales');
    element.setAttribute('value', 'people');
    await element.updateComplete;
    expect(element.value).toBe('sales');
  });

  it('the value is kept until an option of that value arrives', async () => {
    const element = await mount('label="Department" value="legal"', '');
    expect(element.value).toBe('legal');
    expect(shownText(element)).toBe('');
    element.insertAdjacentHTML('beforeend', options());
    await settle(element.parentElement as HTMLElement);
    await element.updateComplete;
    expect(shownText(element)).toBe('Legal');
    expect(option(element, 'Legal').selected).toBe(true);
  });

  it('an option without the value attribute gives its label text, as <option>', async () => {
    const element = await mount('label="Department" value="Customer success"', '<nph-option>  Customer\n  success </nph-option>');
    const item = optionsOf(element)[0] as NphOption;
    expect(item.value).toBe('Customer success');
    expect(item.selected).toBe(true);
  });

  it('a new label text of the chosen option reaches the trigger', async () => {
    const element = await mount('label="Department" value="legal"');
    option(element, 'Legal').textContent = 'Legal affairs';
    await new Promise((resolve) => setTimeout(resolve, 0));
    await element.updateComplete;
    expect(shownText(element)).toBe('Legal affairs');
  });
});

describe('form association', () => {
  async function inForm(attributes: string, children = options()): Promise<{ form: HTMLFormElement; element: NphSelect }> {
    const holder = await markup(`<form><nph-select label="Department" ${attributes}>${children}</nph-select></form>`);
    return { form: holder.querySelector('form') as HTMLFormElement, element: holder.querySelector('nph-select') as NphSelect };
  }

  it('the host knows its form and the form data carries name=value', async () => {
    const { form, element } = await inForm('name="department" value="legal"');
    expect(element.form).toBe(form);
    expect(new FormData(form).get('department')).toBe('legal');
  });

  it('with no choice, the entry is left out of the form data', async () => {
    const { form } = await inForm('name="department"');
    expect(new FormData(form).has('department')).toBe(false);
  });

  it('name set by property reaches the form data, because it reflects', async () => {
    const { form, element } = await inForm('value="legal"');
    element.name = 'department';
    await element.updateComplete;
    expect(new FormData(form).get('department')).toBe('legal');
  });

  it('form.reset() goes back to the value attribute, and fires nothing', async () => {
    const { form, element } = await inForm('name="department" value="legal"');
    await focusTrigger(element);
    await press(element, '{ArrowDown}');
    await press(element, '{ArrowDown}');
    await press(element, '{Enter}');
    expect(element.value).toBe('marketing');
    const events = vi.fn();
    element.addEventListener('input', events);
    element.addEventListener('change', events);
    form.reset();
    await element.updateComplete;
    expect(element.value).toBe('legal');
    expect(new FormData(form).get('department')).toBe('legal');
    expect(shownText(element)).toBe('Legal');
    expect(events).not.toHaveBeenCalled();
  });

  it('required with no choice is valueMissing, with the browser message', async () => {
    const { form, element } = await inForm('name="department" required');
    const native = document.createElement('select');
    native.required = true;
    expect(element.willValidate).toBe(true);
    expect(element.checkValidity()).toBe(false);
    expect(element.validity.valueMissing).toBe(true);
    expect(element.validationMessage).toBe(native.validationMessage);
    expect(element.validationMessage).not.toBe('');
    expect(form.checkValidity()).toBe(false);
    element.value = 'sales';
    expect(element.checkValidity()).toBe(true);
    expect(form.checkValidity()).toBe(true);
  });

  it('required with a chosen option of empty value is still valueMissing, as the native select', async () => {
    const { element } = await inForm('required value=""', '<nph-option value="">None</nph-option><nph-option value="a">A</nph-option>');
    expect(shownText(element)).toBe('None');
    expect(element.validity.valueMissing).toBe(true);
  });

  it('a disabled fieldset disables the piece: out of the form data, no validation, not focusable', async () => {
    const holder = await markup(`<form><fieldset disabled><nph-select label="Department" name="department" value="legal" required>${options()}</nph-select></fieldset></form>`);
    const form = holder.querySelector('form') as HTMLFormElement;
    const element = holder.querySelector('nph-select') as NphSelect;
    expect(element.matches(':disabled')).toBe(true);
    expect(new FormData(form).has('department')).toBe(false);
    expect(element.willValidate).toBe(false);
    expect(trigger(element).hasAttribute('tabindex')).toBe(false);
    expect(trigger(element).getAttribute('aria-disabled')).toBe('true');
    await userEvent.click(trigger(element), { force: true });
    await element.updateComplete;
    expect(element.open).toBe(false);
  });

  it('Enter opens and chooses: it does not submit the form', async () => {
    const { form, element } = await inForm('name="department"');
    const submit = vi.fn((event: Event) => event.preventDefault());
    form.addEventListener('submit', submit);
    form.insertAdjacentHTML('beforeend', '<button type="submit">Send</button>');
    await focusTrigger(element);
    await press(element, '{Enter}');
    expect(element.open).toBe(true);
    await press(element, '{Enter}');
    await wait(10);
    expect(element.value).toBe('finance');
    expect(submit).not.toHaveBeenCalled();
  });

  it('restores the value on history navigation (formStateRestoreCallback)', async () => {
    const { element } = await inForm('name="department"');
    element.formStateRestoreCallback('sales');
    await element.updateComplete;
    expect(element.value).toBe('sales');
    expect(shownText(element)).toBe('Sales');
  });
});

describe('accessible name and description', () => {
  it('label names the combobox and the listbox', async () => {
    const element = await mount('label="Department"');
    const node = await accessibleNodeOf(trigger(element));
    expect(node.role?.value).toBe('combobox');
    expect(node.name?.value).toBe('Department');
    element.open = true;
    await settle();
    const listNode = await accessibleNodeOf(list(element));
    expect(listNode.name?.value).toBe('Department');
  });

  it('a label associated with the host wins over label', async () => {
    const holder = await markup(`<label for="dep">Area</label><nph-select id="dep" label="Department">${options()}</nph-select>`);
    const element = holder.querySelector('nph-select') as NphSelect;
    await nextFrame();
    const node = await accessibleNodeOf(trigger(element));
    expect(node.name?.value).toBe('Area');
  });

  it('description is the accessible description, never visible', async () => {
    const element = await mount('label="Department" description="Where the person works"');
    const node = await accessibleNodeOf(trigger(element));
    expect(node.description?.value).toBe('Where the person works');
    const description = element.shadowRoot?.querySelector('.description') as HTMLElement;
    expect(getComputedStyle(description).clipPath).toBe('inset(50%)');
  });

  it('the options are options of the listbox, with the selected state; start, dot and check are hidden', async () => {
    const element = await mount('label="Department" value="legal"');
    element.open = true;
    await settle();
    const legal = await accessibleNodeOf(option(element, 'Legal'));
    expect(legal.role?.value).toBe('option');
    expect(legal.name?.value).toBe('Legal');
    expect(legal.properties?.find((property) => property.name === 'selected')?.value.value).toBe(true);
    const finance = await accessibleNodeOf(option(element, 'Finance'));
    expect(finance.properties?.find((property) => property.name === 'selected')?.value.value).toBe(false);
  });

  it('open, the combobox is expanded and points to the active option', async () => {
    const element = await mount('label="Department" value="legal"');
    await focusTrigger(element);
    await press(element, '{ArrowDown}');
    expect(trigger(element).getAttribute('aria-expanded')).toBe('true');
    expect(activeOf(element)).toBe(option(element, 'Legal'));
    const node = await accessibleNodeOf(trigger(element));
    const pointer = node.properties?.find((property) => property.name === 'activedescendant');
    expect(pointer).toBeDefined();
    await press(element, '{Escape}');
    expect(activeOf(element)).toBeNull();
  });

  it('a select with no name warns once in development, after the first frame', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const element = await mount('');
    await nextFrame();
    await nextFrame();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0]?.[0])).toContain('[nph-select]');
    element.label = 'Department';
    await element.updateComplete;
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('invalid writes aria-invalid; required writes aria-required', async () => {
    const element = await mount('label="Department" invalid required');
    expect(trigger(element).getAttribute('aria-invalid')).toBe('true');
    expect(trigger(element).getAttribute('aria-required')).toBe('true');
    element.disabled = true;
    await element.updateComplete;
    expect(trigger(element).hasAttribute('aria-invalid')).toBe(false);
  });
});

describe('pointer', () => {
  it('a click on the trigger opens; a click on an option chooses it and closes', async () => {
    const element = await mount();
    await userEvent.click(trigger(element));
    await settle();
    expect(element.open).toBe(true);
    expect(list(element).matches(':popover-open')).toBe(true);
    await userEvent.click(option(element, 'Product'));
    await settle();
    expect(element.value).toBe('product');
    expect(element.open).toBe(false);
    expect(element.shadowRoot?.activeElement).toBe(trigger(element));
  });

  it('a second click on the trigger closes without choosing', async () => {
    const element = await mount();
    await userEvent.click(trigger(element));
    await settle();
    await userEvent.click(trigger(element));
    await settle();
    expect(element.open).toBe(false);
    expect(element.value).toBe('');
  });

  it('a press outside closes without choosing', async () => {
    const element = await mount();
    document.body.insertAdjacentHTML('afterbegin', '<button id="away">Away</button>');
    await userEvent.click(trigger(element));
    await settle();
    await userEvent.click(document.getElementById('away') as HTMLElement);
    await settle();
    expect(element.open).toBe(false);
    expect(element.value).toBe('');
  });

  it('the pointer over an option makes it active (the hover look, D5)', async () => {
    const element = await mount();
    await userEvent.click(trigger(element));
    await settle();
    await userEvent.hover(option(element, 'Sales'));
    await settle();
    expect(option(element, 'Sales').active).toBe(true);
    expect(activeOf(element)).toBe(option(element, 'Sales'));
    expect(getComputedStyle(option(element, 'Sales')).backgroundColor).toBe(resolved('background-color', '--nph-color-accent'));
  });

  it('a disabled option is not chosen and does not become active', async () => {
    const element = await mount('label="Department"', '<nph-option value="a">A</nph-option><nph-option value="b" disabled>B</nph-option>');
    await userEvent.click(trigger(element));
    await settle();
    const disabled = option(element, 'B');
    await userEvent.hover(disabled);
    await userEvent.click(disabled, { force: true });
    await settle();
    expect(disabled.active).toBe(false);
    expect(element.value).toBe('');
    expect(element.open).toBe(true);
  });

  it('the focus stays on the trigger while the list is open', async () => {
    const element = await mount();
    await userEvent.click(trigger(element));
    await settle();
    await userEvent.hover(option(element, 'Sales'));
    expect(element.shadowRoot?.activeElement).toBe(trigger(element));
  });
});

describe('keyboard (APG select-only combobox)', () => {
  for (const key of ['{Enter}', ' ', '{ArrowDown}', '{ArrowUp}', '{Alt>}{ArrowDown}{/Alt}']) {
    it(`${key} opens with the chosen option active`, async () => {
      const element = await mount('label="Department" value="operations"');
      await focusTrigger(element);
      await press(element, key);
      expect(element.open).toBe(true);
      expect(activeOf(element)).toBe(option(element, 'Operations'));
    });
  }

  it('with no choice, it opens on the first option', async () => {
    const element = await mount();
    await focusTrigger(element);
    await press(element, '{ArrowDown}');
    expect(activeOf(element)).toBe(option(element, 'Finance'));
  });

  it('Home and End open on the first and the last option', async () => {
    const element = await mount('label="Department" value="operations"');
    await focusTrigger(element);
    await press(element, '{End}');
    expect(activeOf(element)).toBe(option(element, 'Support'));
    await press(element, '{Home}');
    expect(activeOf(element)).toBe(option(element, 'Finance'));
  });

  it('arrows move without wrapping; Page Up and Page Down jump', async () => {
    const element = await mount();
    await focusTrigger(element);
    await press(element, '{ArrowDown}');
    await press(element, '{ArrowUp}');
    expect(activeOf(element)).toBe(option(element, 'Finance'));
    await press(element, '{ArrowDown}');
    expect(activeOf(element)).toBe(option(element, 'Legal'));
    await press(element, '{PageDown}');
    expect(activeOf(element)).toBe(option(element, 'Support'));
    await press(element, '{ArrowDown}');
    expect(activeOf(element)).toBe(option(element, 'Support'));
    await press(element, '{PageUp}');
    expect(activeOf(element)).toBe(option(element, 'Finance'));
  });

  it('disabled options are skipped', async () => {
    const element = await mount('label="Department"', '<nph-option value="a">A</nph-option><nph-option value="b" disabled>B</nph-option><nph-option value="c">C</nph-option>');
    await focusTrigger(element);
    await press(element, '{ArrowDown}');
    await press(element, '{ArrowDown}');
    expect(activeOf(element)).toBe(option(element, 'C'));
  });

  it('Enter and Space choose the active option and close', async () => {
    const element = await mount();
    await focusTrigger(element);
    await press(element, '{ArrowDown}');
    await press(element, '{ArrowDown}');
    await press(element, '{Enter}');
    expect(element.value).toBe('legal');
    expect(element.open).toBe(false);
    await press(element, ' ');
    await press(element, '{ArrowDown}');
    await press(element, ' ');
    expect(element.value).toBe('marketing');
  });

  it('Alt+ArrowUp chooses and closes', async () => {
    const element = await mount();
    await focusTrigger(element);
    await press(element, '{ArrowDown}');
    await press(element, '{ArrowDown}');
    await press(element, '{Alt>}{ArrowUp}{/Alt}');
    expect(element.value).toBe('legal');
    expect(element.open).toBe(false);
  });

  it('Escape closes without choosing and does not reach a dialog around it', async () => {
    const element = await mount();
    const outer = vi.fn();
    document.body.addEventListener('keydown', outer);
    await focusTrigger(element);
    await press(element, '{ArrowDown}');
    await press(element, '{ArrowDown}');
    await press(element, '{Escape}');
    expect(element.open).toBe(false);
    expect(element.value).toBe('');
    expect(outer.mock.calls.filter(([event]) => (event as KeyboardEvent).key === 'Escape')).toHaveLength(0);
    document.body.removeEventListener('keydown', outer);
  });

  it('Tab closes without choosing and the focus moves on (P91)', async () => {
    const holder = await markup(`<nph-select label="Department">${options()}</nph-select><button id="next">Next</button>`);
    const element = holder.querySelector('nph-select') as NphSelect;
    const change = vi.fn();
    element.addEventListener('change', change);
    await focusTrigger(element);
    await press(element, '{ArrowDown}');
    await press(element, '{ArrowDown}');
    await press(element, '{Tab}');
    expect(element.open).toBe(false);
    expect(element.value).toBe('');
    expect(change).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(document.getElementById('next'));
  });

  it('typeahead opens and moves to the option that starts with the typed text', async () => {
    const element = await mount();
    await focusTrigger(element);
    await press(element, 'o');
    expect(element.open).toBe(true);
    expect(activeOf(element)).toBe(option(element, 'Operations'));
    /* "os" matches nothing: the active option stays. */
    await press(element, 's');
    expect(activeOf(element)).toBe(option(element, 'Operations'));
    await wait(600);
    await press(element, 's');
    expect(activeOf(element)).toBe(option(element, 'Sales'));
    await wait(600);
    await press(element, 'p');
    expect(activeOf(element)).toBe(option(element, 'People'));
    await wait(600);
    await press(element, 'p');
    expect(activeOf(element)).toBe(option(element, 'Product'));
    await press(element, 'r');
    expect(activeOf(element)).toBe(option(element, 'Product'));
  });

  it('the same character typed again cycles through the options that start with it', async () => {
    const element = await mount();
    await focusTrigger(element);
    await press(element, '{ArrowDown}');
    await press(element, 's');
    expect(activeOf(element)).toBe(option(element, 'Sales'));
    await press(element, 's');
    expect(activeOf(element)).toBe(option(element, 'Support'));
    await press(element, 's');
    expect(activeOf(element)).toBe(option(element, 'Sales'));
  });

  it('the active option comes into view of the list, without scrolling the page', async () => {
    const many = Array.from({ length: 15 }, (_, index) => `Option ${String(index + 1).padStart(2, '0')}`);
    const element = await mount('label="Pick"', options(many));
    await focusTrigger(element);
    await press(element, '{End}');
    await nextFrame();
    const box = scroller(element).getBoundingClientRect();
    const last = option(element, 'Option 15').getBoundingClientRect();
    expect(scroller(element).scrollTop).toBeGreaterThan(0);
    expect(last.bottom).toBeLessThanOrEqual(box.bottom + 0.5);
    expect(window.scrollY).toBe(0);
  });

  it('a disabled select does not open from the keyboard and is not in the tab order', async () => {
    const element = await mount('label="Department" disabled');
    expect(trigger(element).hasAttribute('tabindex')).toBe(false);
    element.focus();
    await press(element, '{ArrowDown}');
    expect(element.open).toBe(false);
  });

  it('a select with no option to choose does not open', async () => {
    const element = await mount('label="Department"', '<nph-option disabled>Only</nph-option>');
    await focusTrigger(element);
    await press(element, '{ArrowDown}');
    expect(element.open).toBe(false);
    element.open = true;
    await element.updateComplete;
    expect(element.open).toBe(false);
  });
});

describe('events', () => {
  it('a choice of a different value fires input and then change; input crosses shadow roots', async () => {
    const element = await mount('label="Department" value="legal"');
    const seen: string[] = [];
    const record = (event: Event): void => {
      seen.push(`${event.type}:${event.bubbles}:${event.composed}:${element.value}`);
    };
    element.addEventListener('input', record);
    element.addEventListener('change', record);
    await userEvent.click(trigger(element));
    await settle();
    await userEvent.click(option(element, 'Sales'));
    expect(seen).toEqual(['input:true:true:sales', 'change:true:false:sales']);
  });

  it('choosing the option already chosen fires nothing', async () => {
    const element = await mount('label="Department" value="legal"');
    const events = vi.fn();
    element.addEventListener('input', events);
    element.addEventListener('change', events);
    await focusTrigger(element);
    await press(element, '{ArrowDown}');
    await press(element, '{Enter}');
    expect(events).not.toHaveBeenCalled();
  });

  it('setting value or open from code fires nothing', async () => {
    const element = await mount();
    const events = vi.fn();
    for (const type of ['input', 'change', 'toggle', 'open', 'close']) {
      element.addEventListener(type, events);
    }
    element.value = 'sales';
    element.open = true;
    await element.updateComplete;
    element.open = false;
    await element.updateComplete;
    expect(events).not.toHaveBeenCalled();
  });

  it('the form data is up to date when input and change run', async () => {
    const holder = await markup(`<form><nph-select label="Department" name="department">${options()}</nph-select></form>`);
    const form = holder.querySelector('form') as HTMLFormElement;
    const element = holder.querySelector('nph-select') as NphSelect;
    const seen: Array<FormDataEntryValue | null> = [];
    element.addEventListener('input', () => seen.push(new FormData(form).get('department')));
    element.addEventListener('change', () => seen.push(new FormData(form).get('department')));
    await userEvent.click(trigger(element));
    await settle();
    await userEvent.click(option(element, 'People'));
    expect(seen).toEqual(['people', 'people']);
  });
});

describe('start of the trigger (D4)', () => {
  const people = `
    <nph-option value="ana" start="avatar" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=">Ana Souza</nph-option>
    <nph-option value="bruno" start="avatar">Bruno Lima</nph-option>`;

  it('start none draws no start', async () => {
    const element = await mount('label="Department" value="legal"');
    expect(element.shadowRoot?.querySelector('.start')).toBeNull();
  });

  it('start icon: globe before a choice, the icon of the chosen option after', async () => {
    const element = await mount('label="Language" start="icon"', '<nph-option value="pt" start="icon" icon="house">Portuguese</nph-option><nph-option value="es">Spanish</nph-option>');
    const icon = (): string | null => element.shadowRoot?.querySelector('nph-icon.start')?.getAttribute('name') ?? null;
    expect(icon()).toBe('globe');
    element.value = 'pt';
    await element.updateComplete;
    expect(icon()).toBe('house');
    element.value = 'es';
    await element.updateComplete;
    expect(icon()).toBe('globe');
    element.icon = 'suitcase';
    await element.updateComplete;
    expect(icon()).toBe('suitcase');
  });

  it('start avatar: the empty avatar before a choice, the photo of the chosen option after', async () => {
    const element = await mount('label="Owner" start="avatar"', people);
    const avatar = (): HTMLElement => element.shadowRoot?.querySelector('nph-avatar.start') as HTMLElement;
    expect(avatar().getAttribute('size')).toBe('sm');
    expect(avatar().getAttribute('src')).toBe('');
    element.value = 'ana';
    await element.updateComplete;
    expect(avatar().getAttribute('src')).toContain('data:image/gif');
    element.value = 'bruno';
    await element.updateComplete;
    expect(avatar().getAttribute('src')).toBe('');
  });

  it('the dot of an option never goes to the trigger', async () => {
    const element = await mount('label="Status" start="icon" value="open"', '<nph-option value="open" start="dot" status="success">Open</nph-option>');
    expect(element.shadowRoot?.querySelector('.dot')).toBeNull();
    expect(element.shadowRoot?.querySelector('nph-icon.start')?.getAttribute('name')).toBe('globe');
  });

  it('the start, the arrow and the divider are hidden from the screen reader', async () => {
    const element = await mount('label="Language" start="icon"');
    expect(element.shadowRoot?.querySelector('.start')?.getAttribute('aria-hidden')).toBe('true');
    expect(element.shadowRoot?.querySelector('.arrow')?.getAttribute('aria-hidden')).toBe('true');
  });
});

describe('the list in the top layer', () => {
  it('opens space/inline-tight below the trigger, with its width (D1)', async () => {
    const element = await mount();
    element.open = true;
    await settle();
    await nextFrame();
    const anchor = trigger(element).getBoundingClientRect();
    const box = list(element).getBoundingClientRect();
    expect(list(element).matches(':popover-open')).toBe(true);
    expect(box.width).toBeCloseTo(anchor.width, 1);
    expect(box.left).toBeCloseTo(anchor.left, 1);
    expect(list(element).getAttribute('data-side')).toBe('bottom');
    await wait(400);
    const settled = list(element).getBoundingClientRect();
    expect(settled.top - anchor.bottom).toBeCloseTo(px('--nph-space-inline-tight'), 1);
  });

  it('turns up when it does not fit below and fits above (D-2)', async () => {
    const spacer = document.createElement('div');
    spacer.style.height = `${window.innerHeight - 60}px`;
    document.body.append(spacer);
    const element = await mount();
    element.open = true;
    await settle();
    await nextFrame();
    expect(list(element).getAttribute('data-side')).toBe('top');
    await wait(400);
    const anchor = trigger(element).getBoundingClientRect();
    const box = list(element).getBoundingClientRect();
    expect(anchor.top - box.bottom).toBeCloseTo(px('--nph-space-inline-tight'), 1);
  });

  it('shows 8 whole options of 36 px inside layout/max-list-height, with the border outside (D9)', async () => {
    const many = Array.from({ length: 12 }, (_, index) => `Option ${index + 1}`);
    const element = await mount('label="Pick"', options(many));
    element.open = true;
    await settle();
    const inner = scroller(element).getBoundingClientRect();
    expect(inner.height).toBeCloseTo(px('--nph-layout-max-list-height'), 1);
    expect(option(element, 'Option 1').getBoundingClientRect().height).toBeCloseTo(36, 1);
    const border = px('--nph-border-width');
    expect(list(element).getBoundingClientRect().height).toBeCloseTo(px('--nph-layout-max-list-height') + 2 * border, 1);
    expect(getComputedStyle(scroller(element)).overflowY).toBe('auto');
  });

  it('avatar options measure 40 px: 7 whole options and 8 px of the 8th show (D9)', async () => {
    const many = Array.from({ length: 10 }, (_, index) => `<nph-option value="p${index}" start="avatar">Person ${index}</nph-option>`).join('');
    const element = await mount('label="Owner" start="avatar"', many);
    element.open = true;
    await settle();
    const first = optionsOf(element)[0] as NphOption;
    expect(first.getBoundingClientRect().height).toBeCloseTo(40, 1);
    /* Above the bottom padding of the list, the 8th option shows 8 px. */
    const inner = scroller(element).getBoundingClientRect();
    const seventh = (optionsOf(element)[6] as NphOption).getBoundingClientRect();
    const eighth = (optionsOf(element)[7] as NphOption).getBoundingClientRect();
    expect(seventh.bottom).toBeLessThanOrEqual(inner.bottom);
    expect(inner.bottom - px('--nph-space-inline-tight') - eighth.top).toBeCloseTo(8, 1);
  });

  it('the list: color/popover, border color/input, radius/container, elevation/dropdown', async () => {
    const element = await mount();
    element.open = true;
    await settle();
    const style = getComputedStyle(list(element));
    expect(style.backgroundColor).toBe(resolved('background-color', '--nph-color-popover'));
    expect(style.borderTopColor).toBe(resolved('color', '--nph-color-input'));
    expect(style.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-radius-container'));
    expect(style.boxShadow).toBe(resolved('box-shadow', '--nph-elevation-dropdown'));
    expect(getComputedStyle(scroller(element)).paddingTop).toBe(resolved('padding-top', '--nph-space-inline-tight'));
  });

  it('closing leaves the top layer after the exit transition', async () => {
    const element = await mount();
    element.open = true;
    await settle();
    element.open = false;
    await element.updateComplete;
    expect(list(element).hasAttribute('data-open')).toBe(false);
    await wait(400);
    expect(list(element).matches(':popover-open')).toBe(false);
  });

  it('enters with motion/enter-* and leaves with motion/exit-*, on opacity and translate (D2)', async () => {
    const element = await mount();
    const closed = getComputedStyle(list(element));
    expect(closed.transitionProperty).toBe('opacity, translate');
    expect(closed.transitionDuration).toBe(resolved('transition-duration', '--nph-motion-exit-duration'));
    element.open = true;
    await settle();
    const open = getComputedStyle(list(element));
    expect(open.transitionDuration).toBe(resolved('transition-duration', '--nph-motion-enter-duration'));
    await wait(400);
    expect(getComputedStyle(list(element)).opacity).toBe('1');
    expect(getComputedStyle(list(element)).translate).toBe('none');
  });

  it('the open attribute in the markup opens the list, although the select updates before its options', async () => {
    const element = await mount('label="Department" value="legal" open');
    await settle();
    expect(element.open).toBe(true);
    expect(list(element).matches(':popover-open')).toBe(true);
    expect(activeOf(element)).toBe(option(element, 'Legal'));
  });

  it('removing the select from the page closes the list', async () => {
    const element = await mount();
    element.open = true;
    await settle();
    const layer = list(element);
    element.remove();
    expect(element.open).toBe(false);
    expect(layer.matches(':popover-open')).toBe(false);
  });
});

describe('measures and anatomy', () => {
  it('width layout/input-width; height control/height-default and large', async () => {
    const element = await mount();
    expect(element.getBoundingClientRect().width).toBeCloseTo(px('--nph-layout-input-width'), 1);
    expect(trigger(element).getBoundingClientRect().height).toBeCloseTo(px('--nph-control-height-default'), 1);
    element.size = 'large';
    await element.updateComplete;
    expect(trigger(element).getBoundingClientRect().height).toBeCloseTo(px('--nph-control-height-large'), 1);
  });

  for (const size of ['default', 'large'] as const) {
    it(`${size}: the arrow area is control/height-${size} wide and the trigger height minus the two borders (D7)`, async () => {
      const element = await mount(`label="Department" size="${size}"`);
      const arrow = element.shadowRoot?.querySelector('.arrow') as HTMLElement;
      const style = getComputedStyle(arrow);
      const border = px('--nph-border-width');
      expect(arrow.getBoundingClientRect().width).toBeCloseTo(px(`--nph-control-height-${size}`) + border, 1);
      expect(arrow.getBoundingClientRect().height).toBeCloseTo(px(`--nph-control-height-${size}`) - 2 * border, 1);
      expect(style.backgroundColor).toBe(resolved('background-color', '--nph-color-accent'));
      expect(style.borderLeftColor).toBe(resolved('color', '--nph-color-border'));
      expect(style.borderTopRightRadius).toBe(resolved('border-top-right-radius', '--nph-radius-control-inner'));
      expect(style.borderTopLeftRadius).toBe('0px');
      const right = trigger(element).getBoundingClientRect().right - border;
      expect(arrow.getBoundingClientRect().right).toBeCloseTo(right, 1);
    });
  }

  it('the arrow turns up with the list open', async () => {
    const element = await mount();
    const arrow = (): string | null => element.shadowRoot?.querySelector('.arrow nph-icon')?.getAttribute('name') ?? null;
    expect(arrow()).toBe('chevron-down');
    element.open = true;
    await element.updateComplete;
    expect(arrow()).toBe('chevron-up');
  });

  it('the value stays on one line with an ellipsis (D3)', async () => {
    const element = await mount('label="Department" value="long"', '<nph-option value="long">A department with a very long name that cannot fit in the field</nph-option>');
    const value = element.shadowRoot?.querySelector('.value') as HTMLElement;
    const style = getComputedStyle(value);
    expect(style.whiteSpace).toBe('nowrap');
    expect(style.textOverflow).toBe('ellipsis');
    expect(value.scrollWidth).toBeGreaterThan(value.clientWidth);
    expect(trigger(element).getBoundingClientRect().height).toBeCloseTo(px('--nph-control-height-default'), 1);
  });

  it('left padding space/control-padding, gap space/inline, right padding 0', async () => {
    const element = await mount('label="Language" start="icon"');
    const style = getComputedStyle(trigger(element));
    expect(style.paddingLeft).toBe(resolved('padding-left', '--nph-space-control-padding'));
    expect(style.paddingRight).toBe('0px');
    expect(style.columnGap).toBe(resolved('column-gap', '--nph-space-inline'));
  });
});

describe('states and precedence', () => {
  const border = (element: NphSelect): string => getComputedStyle(trigger(element)).borderTopColor;
  const halo = (element: NphSelect): CSSStyleDeclaration => getComputedStyle(trigger(element), '::after');

  for (const scheme of ['light', 'dark'] as const) {
    it(`${scheme}: rest color/input on color/background; hover color/input-hover`, async () => {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const element = await mount();
      expect(border(element)).toBe(resolved('color', '--nph-color-input'));
      expect(getComputedStyle(trigger(element)).backgroundColor).toBe(resolved('background-color', '--nph-color-background'));
      await userEvent.hover(trigger(element));
      expect(border(element)).toBe(resolved('color', '--nph-color-input-hover'));
    });
  }

  it('keyboard focus: focus/border and the focus/halo outside, focus/radius-control', async () => {
    const element = await mount();
    await userEvent.tab();
    expect(element.shadowRoot?.activeElement).toBe(trigger(element));
    expect(border(element)).toBe(resolved('color', '--nph-focus-border'));
    const ring = halo(element);
    expect(ring.borderTopColor).toBe(resolved('color', '--nph-focus-halo'));
    expect(ring.borderTopWidth).toBe(resolved('width', '--nph-focus-ring-width'));
    expect(ring.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-radius-control'));
  });

  it('open is focus with the list open, even after a mouse click', async () => {
    const element = await mount();
    await userEvent.click(trigger(element));
    await settle();
    expect(border(element)).toBe(resolved('color', '--nph-focus-border'));
    expect(halo(element).content).not.toBe('none');
  });

  it('error: status/error at rest, on hover and on focus; focus/halo-error on focus', async () => {
    const element = await mount('label="Department" invalid');
    expect(border(element)).toBe(resolved('color', '--nph-status-error'));
    await userEvent.hover(trigger(element));
    expect(border(element)).toBe(resolved('color', '--nph-status-error'));
    await userEvent.tab();
    expect(border(element)).toBe(resolved('color', '--nph-status-error'));
    expect(halo(element).borderTopColor).toBe(resolved('color', '--nph-focus-halo-error'));
  });

  it('disabled wins: color/muted, color/input, state/disabled-opacity on the whole piece', async () => {
    const element = await mount('label="Department" disabled invalid');
    expect(border(element)).toBe(resolved('color', '--nph-color-input'));
    expect(getComputedStyle(trigger(element)).backgroundColor).toBe(resolved('background-color', '--nph-color-muted'));
    expect(getComputedStyle(element).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
    await userEvent.hover(trigger(element));
    expect(border(element)).toBe(resolved('color', '--nph-color-input'));
  });

  it('disabling an open select closes it', async () => {
    const element = await mount();
    element.open = true;
    await element.updateComplete;
    element.disabled = true;
    await element.updateComplete;
    expect(element.open).toBe(false);
  });
});

describe('inside nph-field (P83)', () => {
  it('the field names the select, describes it and passes required, invalid and disabled', async () => {
    const holder = await markup(`<nph-field label="Department" help="Where the person works" required><nph-select placeholder="Select an option">${options()}</nph-select></nph-field>`);
    const element = holder.querySelector('nph-select') as NphSelect;
    await settle(holder);
    expect(element.label).toBe('Department');
    expect(element.required).toBe(true);
    expect(element.description).toBe('Where the person works');
    const node = await accessibleNodeOf(trigger(element));
    expect(node.name?.value).toBe('Department');
    expect(node.description?.value).toBe('Where the person works');
    const field = holder.querySelector('nph-field') as HTMLElement & { error: string; updateComplete: Promise<unknown> };
    field.error = 'Choose a department';
    await settle(holder);
    expect(element.invalid).toBe(true);
    expect(element.description).toBe('Choose a department');
  });

  it('a click on the label text moves the focus to the trigger without opening', async () => {
    const holder = await markup(`<nph-field label="Department"><nph-select>${options()}</nph-select></nph-field>`);
    const element = holder.querySelector('nph-select') as NphSelect;
    const label = holder.querySelector('nph-field')?.shadowRoot?.querySelector('nph-label') as HTMLElement;
    await userEvent.click(label);
    await settle(holder);
    expect(element.shadowRoot?.activeElement).toBe(trigger(element));
    expect(element.open).toBe(false);
  });
});

describe('invalid input', () => {
  const cases: ReadonlyArray<readonly [string, string, number]> = [
    ['a size that does not exist', 'size="small"', 1],
    ['a start that does not exist', 'start="dot"', 1],
    ['an icon outside the core', 'start="icon" icon="not-a-core-name"', 1],
    ['accumulates the causes', 'size="small" start="dot" icon="nope"', 3],
  ];
  for (const [name, attributes, count] of cases) {
    it(`${name}: nothing and ${count} error(s) in development`, async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      const element = await mount(`label="Department" ${attributes}`);
      expect(error.mock.calls.filter((call) => String(call[0]).includes('[nph-select]'))).toHaveLength(count);
      expect(element.shadowRoot?.querySelector('.trigger')).toBeNull();
      expect(element.hasAttribute('data-nph-rendered')).toBe(false);
      expect(element.getBoundingClientRect().width).toBe(0);
    });
  }

  it('an invalid piece adds nothing to the form data and blocks nothing', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const holder = await markup(`<form><nph-select label="Department" name="department" value="legal" size="small" required>${options()}</nph-select></form>`);
    const form = holder.querySelector('form') as HTMLFormElement;
    expect(new FormData(form).has('department')).toBe(false);
    expect(form.checkValidity()).toBe(true);
  });

  it('the magnifying glass renders and warns once: search belongs to nph-combobox', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const element = await mount('label="Department" start="icon" icon="magnifying-glass"');
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
    const calls = warn.mock.calls.filter((call) => String(call[0]).includes('magnifying glass'));
    expect(calls).toHaveLength(1);
    element.invalid = true;
    await element.updateComplete;
    expect(warn.mock.calls.filter((call) => String(call[0]).includes('magnifying glass'))).toHaveLength(1);
  });

  it('a valid input set later draws the piece', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount('label="Department" size="small"');
    element.size = 'large';
    await element.updateComplete;
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
  });

  it('an invalid option is not drawn and cannot be reached', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount('label="Department"', '<nph-option value="a">A</nph-option><nph-option value="b" start="bad">B</nph-option><nph-option value="c">C</nph-option>');
    await focusTrigger(element);
    await press(element, '{ArrowDown}');
    await press(element, '{ArrowDown}');
    expect(activeOf(element)).toBe(option(element, 'C'));
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
        '--nph-color-border',
        '--nph-radius-none',
        '--nph-radius-control-inner',
        '--nph-color-accent',
        '--nph-color-input-hover',
        '--nph-focus-border',
        '--nph-focus-ring-width',
        '--nph-focus-halo',
        '--nph-focus-radius-control',
        '--nph-status-error',
        '--nph-focus-halo-error',
        '--nph-color-muted',
        '--nph-radius-container',
        '--nph-color-popover',
        '--nph-elevation-dropdown',
        '--nph-color-popover-foreground',
        '--nph-space-inline-tight',
        '--nph-motion-exit-duration',
        '--nph-motion-exit-easing',
        '--nph-motion-enter-duration',
        '--nph-motion-enter-easing',
        '--nph-layout-max-list-height',
      ]),
    );
    for (const name of used) {
      expect(tokensCss, name).toContain(`${name}:`);
    }
  });

  it('never consumes a core or theme token: components use the semantic layer only', () => {
    expect(componentCss).not.toMatch(/--nph-core-|--nph-theme-/);
  });

  it('the CSS has no literal color, measure or duration', () => {
    expect(cssWithoutComments).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(cssWithoutComments).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/i);
    expect(cssWithoutComments).not.toMatch(/\d+(\.\d+)?(px|rem|em|ms|s)\b/);
  });

  it('reduced motion keeps only the opacity (D2)', () => {
    expect(cssWithoutComments).toMatch(/@media \(prefers-reduced-motion: reduce\)\s*\{[\s\S]*translate: none/);
  });
});
