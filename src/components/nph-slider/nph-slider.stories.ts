/**
 * VALIDATION stories of `nph-slider`.
 *
 * They prove the contract accepted in Figma (board `1636:46`, frame `1925:642`, set `1636:44`)
 * and P94: the `orientacao` × `tipo` × `state` matrix of the set; the optional parts; the
 * keyboard, the pointer and the events; the form association (name, the two entries of a
 * range, reset and a disabled fieldset); the slider inside `nph-field`, with help and with
 * error; the invalid input; and the three required examples of the board — "Brightness",
 * "Price range" and "Volume". Every story shows the same pieces in light and in dark mode, in
 * the same story, through `data-nph-color-scheme` on the frame (P20, P67).
 *
 * Hover, `foco` and `erro-foco` are interaction states: they show up by moving the mouse over
 * a thumb and pressing Tab to it, as in `nph-input`; the component test measures them. Each
 * page opens with what it proves, from the dictionary (`validationPages.claims`). The example
 * text and the captions come from the language dictionary, under the key `sliderValidation`
 * (`docs/i18n.md`, "Storybook"); the row and column names of the matrices are the technical
 * attributes, the same in any language.
 *
 * The `Brands` page proves the seven brands of P20 in light and dark, each frame carrying
 * `data-nph-brand` and `data-nph-color-scheme` on the same element (DSA-36).
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { format, translations } from '../../../.storybook/i18n/index.js';
import { brandFrames } from '../../shared/docs/brands';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import '../nph-button/nph-button';
import './nph-slider';
import type { NphSlider } from './nph-slider';
import { brightness, inField, inScheme, priceRange, volume } from './nph-slider.demo';
import type { Scheme } from './nph-slider.demo';

const meta: Meta = {
  title: 'Components/nph-slider/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).sliderValidation;
}

/* Demonstration frame. Not a precedent for component CSS. */
const stack = 'display: flex; flex-direction: column; gap: var(--nph-space-stack);';
const tight = 'display: flex; flex-direction: column; align-items: flex-start; gap: var(--nph-space-stack-tight);';
const row = 'display: flex; flex-wrap: wrap; align-items: center; gap: var(--nph-space-inline);';
const modesFrame = 'display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);';
const statusStyle = 'color: var(--nph-color-muted-foreground);';

const page = (storyId: string) => ({
  piece: 'nph-slider',
  storyId: `components-nph-slider-validation--${storyId}`,
});

/** What a story draws in one mode; the caption names the mode and, when given, the example. */
type ModeContent = (title: string) => TemplateResult;

/** The same demonstration in both modes, each with its caption. */
function inBothModes(context: GlobalsContext | undefined, storyId: string, content: ModeContent, name?: string): TemplateResult {
  const v = t(context);
  const modes: Array<[Scheme, string]> = [
    ['light', v.lightCaption],
    ['dark', v.darkCaption],
  ];
  const title = validationTitle(context, 'nph-slider', page(storyId).storyId);
  return html`<div style=${modesFrame}>
    ${modes.map(([scheme, caption]) => {
      const label = name === undefined ? caption : `${name} · ${caption}`;
      return inScheme(scheme, label, content(`${title} · ${label}`));
    })}
  </div>`;
}

type State = { invalid?: boolean; disabled?: boolean };

const STATE_COLUMNS = ['default', 'invalid', 'disabled'];
const STATES: State[] = [{}, { invalid: true }, { disabled: true }];

/** `orientation` × `mode` × `state`: default, error and disabled. Move the mouse for hover, press Tab for focus. */
export const Matrix: Story = {
  name: 'Matrix',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const cell = (orientation: string, mode: string, state: State): TemplateResult =>
      html`<nph-slider
        orientation=${orientation}
        mode=${mode}
        label=${mode === 'range' ? v.priceLabel : v.volumeLabel}
        start-label=${mode === 'range' ? v.startLabel : ''}
        end-label=${mode === 'range' ? v.endLabel : ''}
        value="40"
        start="20"
        end="70"
        ?invalid=${state.invalid ?? false}
        ?disabled=${state.disabled ?? false}
      ></nph-slider>`;
    const rows: Array<[string, string]> = [
      ['horizontal', 'single'],
      ['horizontal', 'range'],
      ['vertical', 'single'],
      ['vertical', 'range'],
    ];
    return validationPage(
      context,
      page('matrix'),
      inBothModes(context, 'matrix', (label) =>
        matrix(
          label,
          STATE_COLUMNS,
          rows.map(([orientation, mode]) => ({
            label: `${orientation} · ${mode}`,
            cells: STATES.map((state) => cell(orientation, mode, state)),
          })),
        ),
      ),
    );
  },
};

/** The optional parts, each on its own and all together: text, limits, marks, inputs and steppers. */
export const OptionalParts: Story = {
  name: 'Optional parts',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const names = { 'decrease-label': v.decreaseLabel, 'increase-label': v.increaseLabel };
    return validationPage(
      context,
      page('optional-parts'),
      inBothModes(context, 'optional-parts', (label) =>
        matrix(label, [], [
          { label: 'text', cells: [html`<nph-slider text=${v.brightnessLabel} value="70"></nph-slider>`] },
          { label: 'limits', cells: [html`<nph-slider limits label=${v.volumeLabel} value="40"></nph-slider>`] },
          {
            label: 'marks',
            cells: [html`<nph-slider marks min="1" max="5" value="3" label=${v.ratingLabel}></nph-slider>`],
          },
          { label: 'inputs', cells: [html`<nph-slider inputs label=${v.volumeLabel} value="40"></nph-slider>`] },
          {
            label: 'steppers',
            cells: [
              html`<nph-slider
                steppers
                label=${v.volumeLabel}
                decrease-label=${names['decrease-label']}
                increase-label=${names['increase-label']}
                value="40"
              ></nph-slider>`,
            ],
          },
          {
            label: 'range · limits · inputs · steppers',
            cells: [
              html`<nph-slider
                mode="range"
                limits
                inputs
                steppers
                label=${v.priceLabel}
                start-label=${v.startLabel}
                end-label=${v.endLabel}
                decrease-label=${names['decrease-label']}
                increase-label=${names['increase-label']}
                start="20"
                end="70"
                style="inline-size: var(--nph-layout-field-width);"
              ></nph-slider>`,
            ],
          },
          {
            label: 'vertical · text · limits',
            cells: [html`<nph-slider orientation="vertical" text=${v.volumeLabel} limits value="40"></nph-slider>`],
          },
        ]),
      ),
    );
  },
};

/** The status under a slider: it is replaced by the listeners, and re-rendered only when the language changes. */
function interactive(context: GlobalsContext | undefined): TemplateResult {
  const v = t(context);
  const report = (event: Event): void => {
    const host = event.currentTarget as HTMLElement;
    const slider = host.querySelector('nph-slider') as NphSlider;
    const status = host.querySelector('output');
    if (status) {
      const value = slider.mode === 'range' ? `${slider.start} – ${slider.end}` : String(slider.value);
      status.textContent = format(v.statusEvent, { event: event.type, value });
    }
  };
  return html`<div style=${tight}>
    <div style=${tight} @input=${report} @change=${report}>
      <nph-slider
        steppers
        label=${v.volumeLabel}
        decrease-label=${v.decreaseLabel}
        increase-label=${v.increaseLabel}
        value="40"
      ></nph-slider>
      <output aria-live="polite" style=${statusStyle} .textContent=${v.statusIdle}></output>
    </div>
    <div style=${tight} @input=${report} @change=${report}>
      <nph-slider mode="range" label=${v.priceLabel} start-label=${v.startLabel} end-label=${v.endLabel} start="20" end="70"></nph-slider>
      <output aria-live="polite" style=${statusStyle} .textContent=${v.statusIdle}></output>
    </div>
  </div>`;
}

/** Keyboard, pointer and events: arrows, Page Up and Down, Home and End, drag; input while it moves, change when it settles. */
export const KeyboardAndEvents: Story = {
  name: 'Keyboard and events',
  render: (_args, context: GlobalsContext) =>
    validationPage(context, page('keyboard-and-events'), inBothModes(context, 'keyboard-and-events', () => interactive(context))),
};

/** A form with a single and a range slider, `name`, submit and reset; the form data shows below. */
function form(context: GlobalsContext | undefined, disabled: boolean): TemplateResult {
  const v = t(context);
  const show = (target: HTMLFormElement, text: string): void => {
    const status = target.querySelector('output');
    if (status) {
      status.textContent = text;
    }
  };
  const onSubmit = (event: SubmitEvent): void => {
    event.preventDefault();
    const target = event.currentTarget as HTMLFormElement;
    const data = new FormData(target);
    const entries = [...new Set(data.keys())].map((key) => [key, data.getAll(key)]);
    show(target, format(v.statusSubmitted, { data: JSON.stringify(Object.fromEntries(entries)) }));
  };
  const submit = (event: Event): void => {
    (event.currentTarget as HTMLElement).closest('form')?.requestSubmit();
  };
  const reset = (event: Event): void => {
    const target = (event.currentTarget as HTMLElement).closest('form');
    target?.reset();
    if (target) {
      show(target, v.statusReset);
    }
  };
  return html`<form style=${tight} @submit=${onSubmit}>
    <fieldset ?disabled=${disabled} style="margin: 0; padding: 0; border: 0; ${tight}">
      <nph-slider name="volume" text=${v.volumeLabel} value="40"></nph-slider>
      ${priceRange({ label: v.priceLabel, startLabel: v.startLabel, endLabel: v.endLabel, name: 'price' })}
    </fieldset>
    <div style=${row}>
      <nph-button text=${v.submitText} @click=${submit}></nph-button>
      <nph-button text=${v.resetText} emphasis="outline" severity="secondary" @click=${reset}></nph-button>
    </div>
    <output aria-live="polite" style=${statusStyle} .textContent=${v.statusIdle}></output>
  </form>`;
}

/** The host takes part in the form: single submits name=value, range two entries under the same name, reset restores the attributes. */
export const FormAssociation: Story = {
  name: 'Form association',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('form-association'),
      html`<div style=${stack}>
        ${inBothModes(context, 'form-association', () => form(context, false))}
        ${inBothModes(context, 'form-association', () => form(context, true), v.fieldsetDisabled)}
      </div>`,
    );
  },
};

/** Inside `nph-field`: the field gives the label, the help and the error; the slider shows `erro` and reads the sentence. */
export const InsideField: Story = {
  name: 'Inside nph-field',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('inside-field'),
      inBothModes(context, 'inside-field', (label) =>
        matrix(label, [], [
          { label: 'help', cells: [inField({ label: v.volumeLabel, help: v.volumeHelp })] },
          { label: 'error', cells: [inField({ label: v.volumeLabel, help: v.volumeHelp, error: v.volumeError })] },
        ]),
      ),
    );
  },
};

/** Invalid input draws nothing: an orientation or a mode that does not exist, min not below max, a step of zero. */
export const InvalidInput: Story = {
  name: 'Invalid input',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('invalid-input'),
      inBothModes(context, 'invalid-input', (label) =>
        matrix(label, [], [
          { label: 'orientation: diagonal', cells: [html`<nph-slider orientation="diagonal" label=${v.volumeLabel}></nph-slider>`] },
          { label: 'mode: multiple', cells: [html`<nph-slider mode="multiple" label=${v.volumeLabel}></nph-slider>`] },
          { label: 'min: 10 · max: 10', cells: [html`<nph-slider min="10" max="10" label=${v.volumeLabel}></nph-slider>`] },
          { label: 'step: 0', cells: [html`<nph-slider step="0" label=${v.volumeLabel}></nph-slider>`] },
          {
            label: 'vertical · marks',
            cells: [html`<nph-slider orientation="vertical" marks label=${v.volumeLabel} value="40"></nph-slider>`],
          },
        ]),
      ),
    );
  },
};

/** The three required examples of the accepted board, each in light and dark mode. */
export const Examples: Story = {
  name: 'Examples',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('examples'),
      html`<div style=${stack}>
        ${inBothModes(context, 'examples', () => brightness({ label: v.brightnessLabel }), v.exampleBrightness)}
        ${inBothModes(
          context,
          'examples',
          () => priceRange({ label: v.priceLabel, startLabel: v.startLabel, endLabel: v.endLabel }),
          v.examplePrice,
        )}
        ${inBothModes(context, 'examples', () => volume({ label: v.volumeLabel }), v.exampleVolume)}
      </div>`,
    );
  },
};

/** The seven brands in light and dark (DSA-36): the filled track and the thumbs take the primary of the frame. */
export const Brands: Story = {
  name: 'Brands',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('brands'),
      brandFrames(
        validationTitle(context, 'nph-slider', page('brands').storyId),
        () => html`<nph-slider label=${v.volumeLabel} value="40"></nph-slider>
          <nph-slider
            mode="range"
            label=${v.priceLabel}
            start-label=${v.startLabel}
            end-label=${v.endLabel}
            start="20"
            end="70"
          ></nph-slider>`,
      ),
    );
  },
};
