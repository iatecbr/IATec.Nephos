/**
 * Blocks of the Nephos Storybook content page.
 *
 * Every component reading page builds its text with these blocks, so that the
 * pages read the same way, in the order of the Figma documentation frame: the
 * component with its labelled matrix right after the header, then section
 * title with a rule, text at reading width,
 * demo in its own area, table with a header, exception as a note and source
 * in the footer. See `docs/stories.md`, §4.10.
 *
 * Only `--nph-*`: no hex, no literal color value. The page h1 uses
 * `text/heading-lg` and the section title `text/heading-md` (design.md: the
 * screen title is heading-lg; a section inside it is heading-md).
 *
 * The demo has NO background of its own: only the border separates the
 * example from the text.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import '../../components/nph-icon/nph-icon';

type TextRole =
  | 'heading-lg'
  | 'heading-md'
  | 'body-md'
  | 'body-sm'
  | 'label-md'
  | 'label-sm'
  | 'caption'
  | 'code';

/** The five properties of a text role, always together. */
export function textRole(name: TextRole): string {
  return `
    font-family: var(--nph-text-${name}-font-family);
    font-size: var(--nph-text-${name}-font-size);
    line-height: var(--nph-text-${name}-line-height);
    font-weight: var(--nph-text-${name}-font-weight);
    letter-spacing: var(--nph-text-${name}-letter-spacing);
  `;
}

/** Reading width: `layout/max-reading`, for what is read end to end. */
const READING = 'max-width: var(--nph-layout-max-reading);';
const BORDER = 'var(--nph-border-width) solid var(--nph-color-border)';

/** Body of the content page: background, color and spacing, by token. */
export const body = `
  color: var(--nph-color-foreground);
  background: var(--nph-color-background);
  padding: var(--nph-space-section) var(--nph-space-container-padding);
  display: flex;
  flex-direction: column;
  gap: var(--nph-space-stack);
`;

/** Index item: the section id and the displayed title. */
export interface IndexItem {
  id: string;
  title: string;
}

/** Table row: the term (code) and the description. */
export type TableRow = readonly [string, TemplateResult | string];

export function header(title: string, summary: string): TemplateResult {
  return html`
    <header style="display: flex; flex-direction: column; gap: var(--nph-space-stack-tight);">
      <h1 style="margin: 0; ${textRole('heading-lg')}">${title}</h1>
      <p style="margin: 0; ${textRole('body-md')} ${READING}">${summary}</p>
    </header>
  `;
}

/** Matrix row: the row label and one cell per column. */
export interface MatrixRow {
  label: string;
  cells: readonly TemplateResult[];
}

const MATRIX_LABEL = `${textRole('caption')} color: var(--nph-color-muted-foreground); white-space: nowrap;`;

/**
 * Top block of the page: the component with its labelled matrix, as the
 * first part of the Figma frame. Columns and rows are named by property and
 * value (`severity: primary`); with no columns, each row names its
 * combination and holds the instances beside it. Only instances, in an area
 * with border and no background. When it does not fit, the area scrolls on
 * its own and takes focus, so the keyboard can scroll it too.
 */
export function matrix(
  label: string,
  columns: readonly string[],
  rows: readonly MatrixRow[],
): TemplateResult {
  const cell = 'padding: var(--nph-space-inline-tight) var(--nph-space-inline); vertical-align: middle;';
  return html`
    <figure data-nph-matrix style="margin: 0;">
      <div
        role="region"
        aria-label=${label}
        tabindex="0"
        style="overflow-x: auto; border: ${BORDER}; border-radius: var(--nph-radius-control); padding: var(--nph-space-section) var(--nph-space-container-padding);"
      >
        <table style="border-collapse: collapse; ${columns.length > 0 ? '' : 'width: 100%;'}">
          ${columns.length > 0
            ? html`<thead>
                <tr>
                  <td></td>
                  ${columns.map(
                    (column) => html`<th scope="col" style="${cell} ${MATRIX_LABEL} text-align: center; font-weight: inherit;">${column}</th>`,
                  )}
                </tr>
              </thead>`
            : ''}
          <tbody>
            ${rows.map(
              (row) => html`
                <tr>
                  <th scope="row" style="${cell} ${MATRIX_LABEL} font-weight: inherit; ${columns.length > 0 ? 'text-align: right;' : 'text-align: left; width: 1%; vertical-align: top;'}">${row.label}</th>
                  ${row.cells.map(
                    (content) => html`<td style="${cell} ${columns.length > 0 ? 'text-align: center;' : 'text-align: left;'}">${content}</td>`,
                  )}
                </tr>
              `,
            )}
          </tbody>
        </table>
      </div>
    </figure>
  `;
}

/*
 * The Storybook preview opens links in the top window (`base target=_parent`):
 * a bare `href="#id"` would take the person out of Storybook. The click
 * scrolls to the section in the document itself and moves focus to it; the
 * `href` stays for semantics and for opening in a new tab.
 */
/*
 * The section that receives focus from the index shows the Nephos focus ring
 * (`focus/ring`, `focus/ring-width`), which switches with the color mode. It
 * lives in a rule because inline style cannot reach `:focus`.
 */
const SECTION_FOCUS = html`
  <style>
    [data-nph-section]:focus {
      outline: var(--nph-focus-ring-width) solid var(--nph-focus-ring);
      outline-offset: var(--nph-space-inline-tight);
    }
  </style>
`;

function goTo(event: Event, id: string): void {
  event.preventDefault();
  const link = event.currentTarget as HTMLElement;
  const destination = link.ownerDocument.getElementById(id);
  if (!destination) return;
  destination.scrollIntoView({ block: 'start' });
  destination.focus({ preventScroll: true });
}

export function index(label: string, items: readonly IndexItem[]): TemplateResult {
  return html`
    ${SECTION_FOCUS}
    <nav
      aria-label=${label}
      style="display: flex; flex-direction: column; gap: var(--nph-space-stack-tight); padding-top: var(--nph-space-stack);"
    >
      <span style="${textRole('label-sm')} color: var(--nph-color-muted-foreground); text-transform: uppercase;">
        ${label}
      </span>
      <ul style="margin: 0; padding: 0; list-style: none; display: flex; flex-wrap: wrap; gap: var(--nph-space-inline-tight);">
        ${items.map(
          ({ id, title }) => html`
            <li>
              <a
                href="#${id}"
                @click=${(event: Event) => goTo(event, id)}
                style="display: inline-block; ${textRole('label-sm')} color: var(--nph-color-foreground); text-decoration: none; border: ${BORDER}; border-radius: var(--nph-radius-full); padding: var(--nph-space-inline-tight) var(--nph-space-inline);"
              >
                ${title}
              </a>
            </li>
          `,
        )}
      </ul>
    </nav>
  `;
}

export function section(id: string, title: string, content: TemplateResult): TemplateResult {
  return html`
    <section
      id=${id}
      tabindex="-1"
      data-nph-section
      style="display: flex; flex-direction: column; gap: var(--nph-space-stack); padding-top: var(--nph-space-section); scroll-margin-top: var(--nph-space-stack); border-radius: var(--nph-radius-control);"
    >
      <h2
        style="margin: 0; ${textRole('heading-md')} padding-bottom: var(--nph-space-stack-tight); border-bottom: ${BORDER};"
      >
        ${title}
      </h2>
      ${content}
    </section>
  `;
}

export function text(content: TemplateResult | string): TemplateResult {
  return html`<p style="margin: 0; ${textRole('body-md')} ${READING}">${content}</p>`;
}

export function list(items: readonly string[]): TemplateResult {
  return html`
    <ul style="margin: 0; padding-left: var(--nph-space-container-padding); ${textRole('body-md')} ${READING} display: flex; flex-direction: column; gap: var(--nph-space-stack-tight);">
      ${items.map((item) => html`<li>${item}</li>`)}
    </ul>
  `;
}

export function demo(content: TemplateResult, caption: string): TemplateResult {
  return html`
    <figure data-nph-demo style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-stack-tight);">
      <div
        style="border: ${BORDER}; border-radius: var(--nph-radius-control); padding: var(--nph-space-section) var(--nph-space-container-padding); display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: center; gap: var(--nph-space-section);"
      >
        ${content}
      </div>
      <figcaption style="${textRole('caption')} color: var(--nph-color-muted-foreground);">${caption}</figcaption>
    </figure>
  `;
}

/**
 * How the first column appears: `code` always in text/code; `text` always
 * in text/body-sm; `auto` uses text/code only when the term is an identifier
 * (lowercase, no accent or space: `name`, `icon/size-sm`) and text in the
 * rest (`Slots e eventos`, `Interação`).
 */
export type TermColumn = 'code' | 'text' | 'auto';

function isIdentifier(term: string): boolean {
  return /^[a-z0-9][a-z0-9/_.:-]*$/.test(term.trim());
}

export function table(
  headers: readonly [string, string],
  rows: readonly TableRow[],
  term: TermColumn = 'code',
): TemplateResult {
  const termRole = (text: string): string =>
    term === 'code' || (term === 'auto' && isIdentifier(text))
      ? `${textRole('code')} white-space: nowrap;`
      : `${textRole('body-sm')} font-weight: var(--nph-text-label-md-font-weight);`;
  const cell = `padding: var(--nph-space-stack) var(--nph-space-inline); border-bottom: ${BORDER}; vertical-align: top; text-align: left;`;
  return html`
    <table style="border-collapse: collapse; width: 100%;">
      <thead>
        <tr>
          ${headers.map(
            (title) => html`
              <th
                scope="col"
                style="${cell} padding-top: var(--nph-space-inline-tight); padding-bottom: var(--nph-space-inline-tight); ${textRole('label-sm')} color: var(--nph-color-muted-foreground); text-transform: uppercase;"
              >
                ${title}
              </th>
            `,
          )}
        </tr>
      </thead>
      <tbody>
        ${rows.map(
          ([name, description]) => html`
            <tr>
              <th scope="row" style="${cell} ${termRole(name)}">${name}</th>
              <td style="${cell} ${textRole('body-sm')}">${description}</td>
            </tr>
          `,
        )}
      </tbody>
    </table>
  `;
}

type NoteKind = 'info' | 'warning';

const NOTE_ICON: Record<NoteKind, 'circle-info' | 'triangle-exclamation'> = {
  info: 'circle-info',
  warning: 'triangle-exclamation',
};

export function note(kind: NoteKind, title: string, content: string): TemplateResult {
  return html`
    <div
      role="note"
      data-nph-note=${kind}
      style="display: flex; gap: var(--nph-space-inline); padding: var(--nph-space-stack) var(--nph-space-container-padding); border-radius: var(--nph-radius-control); background: var(--nph-status-${kind}-surface); border: var(--nph-border-width) solid var(--nph-status-${kind}-border); color: var(--nph-status-${kind}-foreground);"
    >
      <span style="color: var(--nph-status-${kind}); display: inline-flex;">
        <nph-icon name=${NOTE_ICON[kind]} size="md"></nph-icon>
      </span>
      <div style="display: flex; flex-direction: column; gap: var(--nph-space-inline-tight);">
        <strong style="${textRole('label-md')}">${title}</strong>
        <span style="${textRole('body-sm')}">${content}</span>
      </div>
    </div>
  `;
}

type CardKind = 'success' | 'error';

function card(
  kind: CardKind,
  title: string,
  items: readonly string[],
): TemplateResult {
  const icon = kind === 'success' ? 'circle-check' : 'circle-xmark';
  return html`
    <div
      data-nph-card=${kind}
      style="flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; gap: var(--nph-space-stack-tight); padding: var(--nph-space-stack) var(--nph-space-container-padding); border-radius: var(--nph-radius-control); background: var(--nph-status-${kind}-surface); border: var(--nph-border-width) solid var(--nph-status-${kind}-border); color: var(--nph-status-${kind}-foreground);"
    >
      <strong style="${textRole('label-md')}">${title}</strong>
      <ul style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: var(--nph-space-stack-tight);">
        ${items.map(
          (item) => html`
            <li style="display: flex; gap: var(--nph-space-inline-tight); ${textRole('body-sm')}">
              <span
                style="color: var(--nph-status-${kind}); display: inline-flex; align-items: center; height: var(--nph-text-body-sm-line-height);"
              >
                <nph-icon name=${icon} size="sm"></nph-icon>
              </span>
              <span>${item}</span>
            </li>
          `,
        )}
      </ul>
    </div>
  `;
}

/** When to use and when not to use, side by side. */
export function useDontUse(
  use: { title: string; items: readonly string[] },
  dontUse: { title: string; items: readonly string[] },
): TemplateResult {
  return html`
    <div style="display: flex; flex-wrap: wrap; gap: var(--nph-space-stack);">
      ${card('success', use.title, use.items)} ${card('error', dontUse.title, dontUse.items)}
    </div>
  `;
}

/** Only the error card. Kept for the nph-button page until it migrates to `useDontUse`. */
export function dontDo(title: string, items: readonly string[]): TemplateResult {
  return html`<div style="display: flex;">${card('error', title, items)}</div>`;
}

/** Origin footer. Every displayed rule points to where it came from. */
export function source(label: string, origin: string): TemplateResult {
  return html`
    <p
      style="margin: 0; padding-top: var(--nph-space-stack-tight); border-top: ${BORDER}; ${textRole('caption')} color: var(--nph-color-muted-foreground);"
    >
      ${label} ${origin}
    </p>
  `;
}
