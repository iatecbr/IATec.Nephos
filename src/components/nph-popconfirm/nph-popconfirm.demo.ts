/**
 * Demonstration frame of the `nph-popconfirm` Validation stories.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not index it.
 * The scenery here (the framed figure, the room kept around each trigger for its open surface, the
 * way the open examples are opened one after the other) is NOT a precedent for component CSS: the
 * piece takes its measures from the `popconfirm/*` tokens, and its place from the trigger, in the
 * top layer.
 *
 * WHY ONE AFTER THE OTHER. On open, a popconfirm takes the focus into itself, and the focus leaving
 * a popconfirm closes it (one layer at a time). A page that shows many popconfirms open at once, to
 * prove each variant, therefore opens them in turn: each one is opened and then the focus is
 * released, so the next one does not take it away from one that stays open. A person opens one at a
 * time.
 *
 * Every visible text comes from the dictionary, passed in by the page that calls this file.
 */
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import { ref } from 'lit/directives/ref.js';
import '../nph-button/nph-button';
import './nph-popconfirm';
import type {
  NphPopconfirm,
  NphPopconfirmAlignment,
  NphPopconfirmSide,
  NphPopconfirmSize,
  NphPopconfirmType,
} from './nph-popconfirm';

export type Scheme = 'light' | 'dark';

/** The texts of one type: the trigger and Confirm say the verb, the title asks, the description says the consequence. */
export interface TypeTexts {
  verb: string;
  title: string;
  description: string;
}

/** The texts of the examples, from the `popconfirmValidation` dictionary. */
export interface ExampleTexts {
  cancel: string;
  lightCaption: string;
  darkCaption: string;
  longConfirm: string;
  longCancel: string;
  default: TypeTexts;
  warning: TypeTexts;
  destructive: TypeTexts;
  spreadsheet: TypeTexts;
}

/**
 * The same example in a color scheme of its own, on the same element that resolves the tokens
 * (P67). A story is never duplicated per mode. The open surface is a descendant of the figure, so
 * it takes the scheme too.
 */
export function inScheme(scheme: Scheme, caption: string, content: TemplateResult): TemplateResult {
  return html`<figure
    data-nph-color-scheme=${scheme}
    style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-inline); padding: var(--nph-space-section); background: var(--nph-color-background); color: var(--nph-color-foreground); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); inline-size: fit-content; min-inline-size: calc(var(--nph-popconfirm-width-md) + var(--nph-popconfirm-width-sm)); max-inline-size: 100%; box-sizing: border-box;"
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
 * Opens a popconfirm once it has rendered and found its trigger, then releases the focus it took.
 * The popconfirm stays open: a focus that goes to nothing does not close it.
 */
async function openOne(popconfirm: NphPopconfirm): Promise<void> {
  if (!popconfirm.isConnected) return;
  await popconfirm.updateComplete;
  /* The popconfirm looks its trigger up one frame after it connects. */
  await frame();
  if (!popconfirm.isConnected) return;
  popconfirm.open = true;
  await popconfirm.updateComplete;
  /* The initial focus lands once the two buttons have drawn. */
  await frame();
  await frame();
  await frame();
  const active = deepActive();
  if (popconfirm.isConnected && active !== null && within(active, popconfirm)) (active as HTMLElement).blur();
}

/** The `ref` that opens the popconfirm it is on, after the ones that were asked for before it. */
const openInTurn = (element: Element | undefined): void => {
  if (element === undefined) return;
  const asked = turn;
  queue = queue.then(() => (turn === asked ? openOne(element as NphPopconfirm) : undefined)).catch(() => undefined);
};

/* ----- the cells ---------------------------------------------------------------- */

export interface CellOptions {
  type?: NphPopconfirmType;
  size?: NphPopconfirmSize;
  side?: NphPopconfirmSide;
  align?: NphPopconfirmAlignment;
  arrow?: boolean;
  /** The type icon. On by default. */
  icon?: boolean;
  /** The description. On by default. */
  description?: boolean;
  /** Confirm is loading. */
  loading?: boolean;
  /** The popconfirm is drawn open. Closed, the cell keeps no room. */
  open?: boolean;
  /** Confirm waits for a slow answer: it loads for a moment and then closes. */
  slow?: boolean;
  texts: TypeTexts;
  cancel: string;
  /** Replace the verb on Confirm, to show labels that do not fit. */
  confirmLabel?: string;
  cancelLabel?: string;
}

/** A slow confirm, as the contract says: the consumer holds the close, sets `loading`, and closes on success. */
function slowConfirm(event: Event): void {
  const popconfirm = event.currentTarget as NphPopconfirm;
  event.preventDefault();
  popconfirm.loading = true;
  window.setTimeout(() => {
    popconfirm.loading = false;
    popconfirm.open = false;
  }, 1600);
}

/**
 * One trigger with its popconfirm, in a frame that keeps the room around the trigger for the open
 * surface, so an open popconfirm never covers the next example. The popconfirm is the real component.
 */
export function cell(options: CellOptions): TemplateResult {
  const id = `nph-popconfirm-demo-${++nextId}`;
  const open = options.open ?? true;
  const size = options.size ?? 'sm';
  const room = open ? `min-block-size: calc(var(--nph-popconfirm-width-${size}) + var(--nph-popconfirm-width-sm) / 2);` : '';
  return html`<div
    style="display: flex; align-items: center; justify-content: center; box-sizing: border-box; inline-size: 100%; ${room}"
  >
    <nph-button id=${id} severity="secondary" text=${options.texts.verb}></nph-button>
    <nph-popconfirm
      for=${id}
      type=${options.type ?? 'default'}
      size=${size}
      side=${options.side ?? 'bottom'}
      align=${options.align ?? 'center'}
      ?arrow=${options.arrow ?? false}
      ?hide-icon=${options.icon === false}
      ?loading=${options.loading ?? false}
      heading=${options.texts.title}
      description=${options.description === false ? nothing : options.texts.description}
      confirm-label=${options.confirmLabel ?? options.texts.verb}
      cancel-label=${options.cancelLabel ?? options.cancel}
      @nph-confirm=${options.slow === true ? slowConfirm : nothing}
      ${ref(open ? openInTurn : undefined)}
    ></nph-popconfirm>
  </div>`;
}

/** The texts of a type, from the dictionary. */
export function typeTexts(t: ExampleTexts, type: NphPopconfirmType): TypeTexts {
  return t[type];
}

/** One of the types, without the arrow, in a size: the six variants of the Figma set with no arrow. */
export function typed(t: ExampleTexts, type: NphPopconfirmType, size: NphPopconfirmSize): TemplateResult {
  return cell({ texts: typeTexts(t, type), cancel: t.cancel, type, size });
}

/** One of the placement cells: the arrow on, sm. The type rotates with the row, so every type is on every side. */
export function placement(
  t: ExampleTexts,
  type: NphPopconfirmType,
  side: NphPopconfirmSide,
  align: NphPopconfirmAlignment,
): TemplateResult {
  return cell({ texts: typeTexts(t, type), cancel: t.cancel, type, side, align, arrow: true });
}

/** The three required examples of the accepted documentation, one under the other. */
export function examples(t: ExampleTexts): TemplateResult {
  const spreadsheet = cell({ texts: t.spreadsheet, cancel: t.cancel, type: 'destructive', size: 'md' });
  const leave = cell({ texts: t.warning, cancel: t.cancel, type: 'warning' });
  const send = cell({ texts: t.default, cancel: t.cancel, type: 'default' });
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-stack);">${spreadsheet} ${leave} ${send}</div>`;
}
