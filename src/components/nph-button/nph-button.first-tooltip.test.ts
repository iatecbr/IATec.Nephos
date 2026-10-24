/**
 * The first balloon of a page (P86): a test file of its own, because each file runs in a
 * fresh page and module graph. No `nph-tooltip` exists before the keyboard focus arrives on
 * a button with text; when the button becomes icon-only, the tooltip it renders is the first
 * of the page and must still know that the focus came from the keyboard. The pointer case is
 * the same page and the same rule, so the suppression by click and by tap stays proved here.
 */
import { afterEach, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

import '../../tokens/generated/tokens.css';
import type { NphButton } from './nph-button';
import './nph-button';

afterEach(() => {
  document.body.replaceChildren();
});

async function mount(): Promise<NphButton> {
  const element = document.createElement('nph-button');
  Object.assign(element, { text: 'Add', iconStart: 'plus', label: 'Add' });
  document.body.append(element);
  await element.updateComplete;
  return element;
}

const control = (element: NphButton): HTMLButtonElement => element.shadowRoot?.querySelector('button') as HTMLButtonElement;

it('the first tooltip of the page opens when the button turns icon-only under keyboard focus', async () => {
  expect(document.querySelector('nph-tooltip')).toBeNull();
  const element = await mount();
  expect(element.shadowRoot?.querySelector('nph-tooltip')).toBeNull();
  /* A real Tab key: `userEvent.tab()` moves the focus without a key event in the page. */
  await userEvent.keyboard('{Tab}');
  expect(element.shadowRoot?.activeElement).toBe(control(element));
  element.text = '';
  await element.updateComplete;
  const tooltip = element.shadowRoot?.querySelector('nph-tooltip');
  expect(tooltip).not.toBeNull();
  await vi.waitFor(() => expect(tooltip?.open).toBe(true));
});

it('after a click, the same change does not open it', async () => {
  const element = await mount();
  await userEvent.click(control(element));
  expect(element.shadowRoot?.activeElement).toBe(control(element));
  element.text = '';
  await element.updateComplete;
  const tooltip = element.shadowRoot?.querySelector('nph-tooltip');
  await tooltip?.updateComplete;
  await new Promise((resolve) => setTimeout(resolve, 50));
  expect(tooltip?.open).toBe(false);
});
