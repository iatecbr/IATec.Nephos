/**
 * Demonstration frame shared by the `nph-popover` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not index it.
 * The scenery here — the framed figure, the room kept around each trigger for its open surface,
 * the way the open examples are opened one after the other — is NOT a precedent for component
 * CSS: the piece takes its measures from the `popover/*` tokens, and its place from the trigger,
 * in the top layer.
 *
 * WHY ONE AFTER THE OTHER (P111). On open, a popover takes the focus into itself, and the focus
 * leaving a popover closes it. A page that shows many popovers open at once, to prove each
 * variant, therefore opens them in turn: each one is opened and then the focus is released, so
 * the next one does not take it away from a popover that stays open. A person opens one at a time.
 *
 * Every visible text comes from the dictionary, passed in by the page that calls this file.
 */
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import { ref } from 'lit/directives/ref.js';

import '../nph-button/nph-button';
import '../nph-field/nph-field';
import '../nph-input/nph-input';
import './nph-popover';
import type { NphPopover, NphPopoverAlignment, NphPopoverSide, NphPopoverSize } from './nph-popover';

export type Scheme = 'light' | 'dark';

/** The texts of the examples, from the `popoverValidation` dictionary. */
export interface ExampleTexts {
  closeLabel: string;
  trigger: string;
  title: string;
  description: string;
  clear: string;
  cancel: string;
  apply: string;
  save: string;
  filtersTrigger: string;
  filtersTitle: string;
  filtersDescription: string;
  renameTrigger: string;
  renameTitle: string;
  renameDescription: string;
  fieldLabel: string;
  fieldValue: string;
  infoTrigger: string;
  infoTitle: string;
  infoDescription: string;
}

/**
 * The same example in a color scheme of its own, on the same element that resolves the tokens
 * (P67). A story is never duplicated per mode. The open surface is a descendant of the figure,
 * so it takes the scheme too.
 */
export function inScheme(scheme: Scheme, caption: string, content: TemplateResult): TemplateResult {
  return html`<figure
    data-nph-color-scheme=${scheme}
    style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-inline); padding: var(--nph-space-section); background: var(--nph-color-background); color: var(--nph-color-foreground); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); inline-size: fit-content; min-inline-size: calc(var(--nph-popover-width-lg) + var(--nph-popover-width-sm)); max-inline-size: 100%; box-sizing: border-box;"
  >
    ${content}
    <figcaption style="color: var(--nph-color-muted-foreground);">${caption}</figcaption>
  </figure>`;
}

/** The same example in light and in dark mode, side by side. */
export function bothModes(captions: { light: string; dark: string }, content: () => TemplateResult): TemplateResult {
  return html`<div style="display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);">
    ${inScheme('light', captions.light, content())} ${inScheme('dark', captions.dark, content())}
  </div>`;
}

/* ----- opening in turn ---------------------------------------------------------- */

let nextId = 0;
let queue: Promise<void> = Promise.resolve();

/**
 * Counts the turns the person took on the page. A press or a key means they are in charge of the
 * focus: the openings still waiting in the queue are dropped, so none takes it away from them.
 */
let turn = 0;
if (typeof document !== 'undefined') {
  for (const type of ['pointerdown', 'keydown']) {
    document.addEventListener(type, () => (turn += 1), true);
  }
}

const frame = (): Promise<void> => new Promise((resolve) => requestAnimationFrame(() => resolve()));

function deepActive(): Element | null {
  let active = document.activeElement;
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
  return active;
}

/** `node` is `ancestor` or sits inside it, going up across shadow roots. */
function within(node: Node | null, ancestor: Node): boolean {
  let current: Node | null = node;
  while (current !== null) {
    if (current === ancestor) return true;
    current = current.parentNode ?? (current instanceof ShadowRoot ? current.host : null);
  }
  return false;
}

/**
 * Opens a popover once it has rendered and found its trigger, then releases the focus it took.
 * The popover stays open: a focus that goes to nothing does not close it.
 */
async function openOne(popover: NphPopover): Promise<void> {
  /* A popover whose page was left while it waited in the queue costs nothing: the line moves on. */
  if (!popover.isConnected) return;
  await popover.updateComplete;
  /* The popover looks its trigger up one frame after it connects. */
  await frame();
  /* The page may have been left in the meantime: a popover no longer in the page stays closed. */
  if (!popover.isConnected) return;
  popover.open = true;
  await popover.updateComplete;
  await frame();
  await frame();
  /* Only the focus the popover took: if the page was left, or the person moved the focus, it is not ours to release. */
  const active = deepActive();
  if (popover.isConnected && active !== null && within(active, popover)) (active as HTMLElement).blur();
}

/** The `ref` that opens the popover it is on, after the ones that were asked for before it. */
const openInTurn = (element: Element | undefined): void => {
  if (element === undefined) return;
  const asked = turn;
  queue = queue.then(() => (turn === asked ? openOne(element as NphPopover) : undefined)).catch(() => undefined);
};

/* ----- the cells ---------------------------------------------------------------- */

export interface CellOptions {
  side?: NphPopoverSide;
  align?: NphPopoverAlignment;
  arrow?: boolean;
  size?: NphPopoverSize;
  closable?: boolean;
  description?: boolean;
  body?: boolean;
  footer?: boolean;
  /** The popover is drawn open. Closed, the cell keeps no room. */
  open?: boolean;
  /** The text of the trigger and the title: the ones of the page. */
  trigger: string;
  title: string;
  descriptionText: string;
  closeLabel: string;
  clear: string;
  apply: string;
  fieldLabel: string;
  fieldValue: string;
}

/** The footer of the filter example: Clear, secondary solid, and Apply, primary solid, both compact. */
export function filterFooter(clear: string, apply: string): TemplateResult {
  return html`<nph-button slot="footer" size="compact" severity="secondary" text=${clear} @click=${closeFooter}></nph-button
    ><nph-button slot="footer" size="compact" text=${apply} @click=${closeFooter}></nph-button>`;
}

/** A footer action closes the popover the way the contract says: the consumer sets `open` to `false`. */
function closeFooter(event: Event): void {
  const popover = (event.currentTarget as Element).closest('nph-popover');
  if (popover !== null) popover.open = false;
}

/** The body of the short form: an `nph-field` with an `nph-input`. */
export function renameBody(label: string, value: string): TemplateResult {
  return html`<nph-field label=${label}><nph-input .value=${value}></nph-input></nph-field>`;
}

/**
 * One trigger with its popover, in a frame that keeps the room around the trigger for the open
 * surface, so an open popover never covers the next example. The popover is the real component.
 */
export function cell(options: CellOptions): TemplateResult {
  const id = `nph-popover-demo-${++nextId}`;
  const open = options.open ?? true;
  const room = open ? 'min-block-size: var(--nph-popover-width-md);' : '';
  return html`<div
    style="display: flex; align-items: center; justify-content: center; box-sizing: border-box; inline-size: 100%; ${room}"
  >
    <nph-button id=${id} severity="secondary" text=${options.trigger}></nph-button>
    <nph-popover
      for=${id}
      heading=${options.title}
      description=${options.description === false ? nothing : options.descriptionText}
      side=${options.side ?? 'bottom'}
      align=${options.align ?? 'center'}
      size=${options.size ?? 'md'}
      ?arrow=${options.arrow ?? false}
      ?closable=${options.closable ?? false}
      close-label=${options.closable === true ? options.closeLabel : nothing}
      ${ref(open ? openInTurn : undefined)}
    >
      ${options.body === true ? renameBody(options.fieldLabel, options.fieldValue) : nothing}
      ${options.footer === true ? filterFooter(options.clear, options.apply) : nothing}
    </nph-popover>
  </div>`;
}

/** The common options a page takes from its dictionary. */
export function texts(t: ExampleTexts): Pick<CellOptions, 'trigger' | 'title' | 'descriptionText' | 'closeLabel' | 'clear' | 'apply' | 'fieldLabel' | 'fieldValue'> {
  return {
    trigger: t.trigger,
    title: t.title,
    descriptionText: t.description,
    closeLabel: t.closeLabel,
    clear: t.clear,
    apply: t.apply,
    fieldLabel: t.fieldLabel,
    fieldValue: t.fieldValue,
  };
}

/** One of the placement cells: the arrow on, a short surface, md. */
export function placement(t: ExampleTexts, side: NphPopoverSide, align: NphPopoverAlignment): TemplateResult {
  return cell({ ...texts(t), side, align, arrow: true });
}

/** One of the sizes, without the arrow: title, description, field and footer, as the Figma set. */
export function sized(t: ExampleTexts, size: NphPopoverSize): TemplateResult {
  return cell({ ...texts(t), size, body: true, footer: true });
}

/** The three required examples of the accepted documentation, one under the other. */
export function examples(t: ExampleTexts): TemplateResult {
  const filter = cell({
    ...texts(t),
    trigger: t.filtersTrigger,
    title: t.filtersTitle,
    descriptionText: t.filtersDescription,
    footer: true,
  });
  const form = cell({
    ...texts(t),
    trigger: t.renameTrigger,
    title: t.renameTitle,
    descriptionText: t.renameDescription,
    clear: t.cancel,
    apply: t.save,
    body: true,
    footer: true,
  });
  const info = cell({
    ...texts(t),
    trigger: t.infoTrigger,
    title: t.infoTitle,
    descriptionText: t.infoDescription,
    closable: true,
    arrow: true,
  });
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-stack);">${filter} ${form} ${info}</div>`;
}
