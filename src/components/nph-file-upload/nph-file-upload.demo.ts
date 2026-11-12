/**
 * Demonstration frame shared by the `nph-file-upload` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not index it. The
 * scenery here — the framed figure, the widths that force the compact format and the cut name, the
 * form around the field — is NOT a precedent for component CSS: the piece takes its measures from the
 * `file-upload/*` and `file-upload-item/*` tokens.
 *
 * The examples are the required ones of the accepted documentation (frame `5311:8328`): the empty zone
 * (the rule shows before the choice), the list in use (an upload in progress, an error in the item and
 * a done file) and the limit reached (the button is disabled and the rule says how to free space).
 * Every visible text comes from the dictionary, passed in by the page that calls this file.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import '../nph-field/nph-field';
import './nph-file-upload';
import type { NphFileUploadEntry } from './nph-file-upload';

export type Scheme = 'light' | 'dark';

/** The texts of the examples, from the `fileUploadValidation` dictionary. */
export interface ExampleTexts {
  fieldLabel: string;
  fieldHelp: string;
  prompt: string;
  buttonText: string;
  draggingText: string;
  rule: string;
  limitText: string;
  limitRule: string;
  uploadingText: string;
  sentText: string;
  doneText: string;
  retryText: string;
  removeLabel: string;
  cancelLabel: string;
  addedText: string;
  sentAnnouncement: string;
  errorAnnouncement: string;
  removedAnnouncement: string;
  typeError: string;
  countError: string;
  fileReport: string;
  fileContract: string;
  fileMinutes: string;
  filePhoto: string;
  fileLogo: string;
  fileLong: string;
  networkReason: string;
  sizeReason: string;
  otherLabel: string;
  otherValue: string;
}

/**
 * The same example in a color scheme of its own, on the same element that resolves the tokens
 * (P67). A story is never duplicated per mode.
 */
export function inScheme(scheme: Scheme, caption: string, content: TemplateResult): TemplateResult {
  return html`<figure
    data-nph-color-scheme=${scheme}
    style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-inline); padding: var(--nph-space-section); background: var(--nph-color-background); color: var(--nph-color-foreground); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); inline-size: 100%; min-inline-size: var(--nph-layout-field-width); max-inline-size: 100%; box-sizing: border-box;"
  >
    ${content}
    <figcaption style="color: var(--nph-color-muted-foreground);">${caption}</figcaption>
  </figure>`;
}

/** The same example in light and in dark mode, one under the other. */
export function bothModes(captions: { light: string; dark: string }, content: () => TemplateResult): TemplateResult {
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-stack);">
    ${inScheme('light', captions.light, content())} ${inScheme('dark', captions.dark, content())}
  </div>`;
}

/** The width the default format is drawn at, 480 px. */
export const ZONE_WIDTH = '30rem';

/** A width from which the compact format applies, 768 px, above the 668 px of the contract. */
export const COMPACT_WIDTH = '48rem';

/** A tiny picture for the thumbnail of the image kind: the sample files of a page are not real files. */
export const SAMPLE_THUMBNAIL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAB20lEQVR42g3Loa6GIACA0fs4f6fbfQAKSaKjmByNjUKC6CwmZnOzmCA6t28kH+l6+vn7KYSiU/QKqRgURjErvCIqVkVWnIqieBSv4u+nEZpO02ukZtAYzazxmqhZNVlzaorm0bz6CyNipBvpR+TIMGJG5hE/EkfWkTxyjpSRZ+QdvzAhJrqJfkJODBNmYp7wE3FincgT50SZeCbe6QsWYeksvUVaBouxzBZviZbVki2npVgey2u/4BCOztE7pGNwGMfs8I7oWB3ZcTqK43G87gsBEegCfUAGhoAJzAEfiIE1kANnoASewBu+kBCJLtEnZGJImMSc8ImYWBM5cSZK4km86QsLYqFb6BfkwrBgFuYFvxAX1oW8cC6UhWfhXb6wITa6jX5DbgwbZmPe8BtxY93IG+dG2Xg23u0LO2Kn2+l35M6wY3bmHb8Td9advHPulJ1n592/cCAOuoP+QB4MB+ZgPvAH8WA9yAfnQTl4Dt7jCxfiorvoL+TFcGEu5gt/ES/Wi3xxXpSL5+K9vlARla7SV2RlqJjKXPGVWFkruXJWSuWpvPULN+Kmu+lv5M1wY27mG38Tb9abfHPelJvn5r2/0BCNrtE3ZGNomMbc8I3YWBu5cTZK42m8jX9HwtYQl/RqdAAAAABJRU5ErkJggg==';

export interface UploadOptions {
  files?: NphFileUploadEntry[];
  format?: 'default' | 'compact';
  disabled?: boolean;
  error?: string;
  maxFiles?: number;
  size?: 'default' | 'large';
  /** The width of the frame, to force the compact format or the cut name. */
  width?: string;
  /** The label the zone names its group with, when it is not inside `nph-field`. */
  label?: string;
}

/** A zone with every text the page owes it, at the width asked for. */
export function upload(texts: ExampleTexts, options: UploadOptions = {}): TemplateResult {
  const { files = [], format = 'default', disabled = false, error = '', maxFiles, size = 'default', width = ZONE_WIDTH, label = texts.fieldLabel } = options;
  return html`<div style="inline-size: ${width}; max-inline-size: 100%;">
    <nph-file-upload
      .files=${files}
      format=${format}
      ?disabled=${disabled}
      .error=${error}
      .maxFiles=${maxFiles ?? null}
      .maxSize=${5_000_000}
      accept=".pdf,.png,.jpg,.jpeg"
      size=${size}
      label=${label}
      prompt=${texts.prompt}
      button-text=${texts.buttonText}
      dragging-text=${texts.draggingText}
      rule=${texts.rule}
      limit-text=${texts.limitText}
      limit-rule=${texts.limitRule}
      uploading-text=${texts.uploadingText}
      sent-text=${texts.sentText}
      done-text=${texts.doneText}
      retry-text=${texts.retryText}
      remove-label=${texts.removeLabel}
      cancel-label=${texts.cancelLabel}
      added-text=${texts.addedText}
      sent-announcement=${texts.sentAnnouncement}
      error-announcement=${texts.errorAnnouncement}
      removed-announcement=${texts.removedAnnouncement}
    ></nph-file-upload>
  </div>`;
}

/** The list in use: an upload in progress, an error in the item and a done file. */
export function inUseFiles(texts: ExampleTexts): NphFileUploadEntry[] {
  return [
    { id: 'report', name: texts.fileReport, size: 2_400_000, status: 'uploading', progress: 64 },
    { id: 'contract', name: texts.fileContract, size: 800_000, status: 'error', reason: texts.networkReason },
    { id: 'minutes', name: texts.fileMinutes, size: 120_000, status: 'done', href: '#minutes' },
  ];
}

/** Every status of an item, one by one, with the file kind. */
export function statusFiles(texts: ExampleTexts): NphFileUploadEntry[] {
  return [
    { id: 'ready', name: texts.fileContract, size: 800_000, status: 'ready' },
    { id: 'uploading', name: texts.fileReport, size: 2_400_000, status: 'uploading', progress: 64 },
    { id: 'sent', name: texts.fileMinutes, size: 120_000, status: 'sent' },
    { id: 'error', name: texts.fileContract, size: 800_000, status: 'error', reason: texts.networkReason },
    { id: 'done', name: texts.fileMinutes, size: 120_000, status: 'done', href: '#minutes' },
  ];
}

/** The image kind in each status, with a thumbnail. */
export function imageFiles(texts: ExampleTexts): NphFileUploadEntry[] {
  return [
    { id: 'photo-ready', name: texts.filePhoto, size: 1_200_000, kind: 'image', thumbnail: SAMPLE_THUMBNAIL },
    { id: 'photo-uploading', name: texts.filePhoto, size: 1_200_000, kind: 'image', thumbnail: SAMPLE_THUMBNAIL, status: 'uploading', progress: 38 },
    { id: 'photo-sent', name: texts.fileLogo, size: 300_000, kind: 'image', thumbnail: SAMPLE_THUMBNAIL, status: 'sent' },
    { id: 'photo-error', name: texts.fileLogo, size: 300_000, kind: 'image', thumbnail: SAMPLE_THUMBNAIL, status: 'error', reason: texts.networkReason },
    { id: 'photo-done', name: texts.filePhoto, size: 1_200_000, kind: 'image', thumbnail: SAMPLE_THUMBNAIL, status: 'done', href: '#photo' },
    { id: 'photo-waiting', name: texts.fileLogo, size: 300_000, kind: 'image' },
  ];
}

/** Five files, the limit of the rule: the zone is in the limit state. */
export function limitFiles(texts: ExampleTexts): NphFileUploadEntry[] {
  return [
    { id: 'a', name: texts.fileReport, size: 2_400_000, status: 'sent' },
    { id: 'b', name: texts.fileContract, size: 800_000, status: 'sent' },
    { id: 'c', name: texts.fileMinutes, size: 120_000, status: 'done', href: '#minutes' },
    { id: 'd', name: texts.filePhoto, size: 1_200_000, status: 'sent', kind: 'image', thumbnail: SAMPLE_THUMBNAIL },
    { id: 'e', name: texts.fileLogo, size: 300_000, status: 'done', href: '#logo', kind: 'image', thumbnail: SAMPLE_THUMBNAIL },
  ];
}

/** A file above the maximum size comes in as an item in error with its reason. */
export function sizeErrorFiles(texts: ExampleTexts): NphFileUploadEntry[] {
  return [{ id: 'big', name: texts.fileReport, size: 8_900_000, status: 'error', reason: texts.sizeReason }];
}

/** A name that does not fit is cut on one line, and a long reason wraps. */
export function longFiles(texts: ExampleTexts): NphFileUploadEntry[] {
  return [
    { id: 'long', name: texts.fileLong, size: 2_400_000, status: 'sent' },
    { id: 'wrap', name: texts.fileLong, size: 2_400_000, status: 'error', reason: `${texts.sizeReason} ${texts.networkReason} ${texts.sizeReason}` },
  ];
}

/** The zone as the control of `nph-field`: the label, the asterisk and the help text belong to the field. */
export function inField(texts: ExampleTexts, options: UploadOptions & { required?: boolean } = {}): TemplateResult {
  const { files = [], format = 'default', required = true, width = ZONE_WIDTH, error = '' } = options;
  return html`<div style="inline-size: ${width}; max-inline-size: 100%;">
    <nph-field label=${texts.fieldLabel} help=${texts.fieldHelp} ?required=${required}>
      <nph-file-upload
        .files=${files}
        format=${format}
        .error=${error}
        .maxFiles=${5}
        .maxSize=${5_000_000}
        accept=".pdf,.png,.jpg,.jpeg"
        prompt=${texts.prompt}
        button-text=${texts.buttonText}
        dragging-text=${texts.draggingText}
        rule=${texts.rule}
        limit-text=${texts.limitText}
        limit-rule=${texts.limitRule}
        uploading-text=${texts.uploadingText}
        sent-text=${texts.sentText}
        done-text=${texts.doneText}
        retry-text=${texts.retryText}
        remove-label=${texts.removeLabel}
        cancel-label=${texts.cancelLabel}
        added-text=${texts.addedText}
        sent-announcement=${texts.sentAnnouncement}
        error-announcement=${texts.errorAnnouncement}
        removed-announcement=${texts.removedAnnouncement}
      ></nph-file-upload>
    </nph-field>
  </div>`;
}

/** The compact zone in a form with other fields: the other field sits above it. */
export function inForm(texts: ExampleTexts): TemplateResult {
  return html`<div
    style="display: flex; flex-direction: column; gap: var(--nph-space-section); inline-size: ${COMPACT_WIDTH}; max-inline-size: 100%; padding: var(--nph-space-section); background: var(--nph-color-card); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); box-sizing: border-box;"
  >
    <div style="display: flex; flex-direction: column; gap: var(--nph-space-inline);">
      <strong>${texts.otherLabel}</strong>
      <span style="color: var(--nph-color-muted-foreground);">${texts.otherValue}</span>
    </div>
    ${inField(texts, { format: 'compact', files: inUseFiles(texts).slice(2), width: '100%' })}
  </div>`;
}

/** The first required example: the empty zone, with the rule before the choice. */
export function emptyExample(texts: ExampleTexts): TemplateResult {
  return upload(texts);
}

/** The second required example: the list in use, with an upload in progress, an error and a done file. */
export function inUseExample(texts: ExampleTexts): TemplateResult {
  return upload(texts, { files: inUseFiles(texts) });
}

/** The third required example: the limit reached, with the button disabled and the rule that frees space. */
export function limitExample(texts: ExampleTexts): TemplateResult {
  return upload(texts, { files: limitFiles(texts), maxFiles: 5 });
}

/** A row of the item alone, as the row of a list of files that is not the zone's: an upload in progress. */
export function standaloneItem(texts: ExampleTexts): TemplateResult {
  return html`<div style="inline-size: ${ZONE_WIDTH}; max-inline-size: 100%;">
    <nph-file-upload-item
      file-id="alone"
      .name=${texts.fileReport}
      .bytes=${2_400_000}
      status="uploading"
      .progress=${64}
      .uploadingText=${texts.uploadingText}
      .removeLabel=${texts.removeLabel}
      .cancelLabel=${texts.cancelLabel}
    ></nph-file-upload-item>
  </div>`;
}

/** The three required examples, one under the other, in the frame of a scheme. */
export function examples(texts: ExampleTexts): TemplateResult {
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-section);">
    ${emptyExample(texts)} ${inUseExample(texts)} ${limitExample(texts)}
  </div>`;
}
