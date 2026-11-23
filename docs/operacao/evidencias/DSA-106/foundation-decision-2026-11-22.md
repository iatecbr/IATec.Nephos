```json
{
  "task": "DSA-106",
  "gate": "foundation-decision",
  "date": "2026-11-22",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=7748-1477",
    "date": "2026-11-22",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "Item 3 of the nph-rich-text-editor approval of 2026-11-22, approved as recommended: keep the departure (the block style trigger goes whole to More) and record the exception in the nph-toolbar spec."
  }
}
```

# DSA-106 — `foundation-decision`

## The decision
On 2026-11-22 the design owner approved item 3 of the `nph-rich-text-editor` approval, as recommended: in the narrow editor toolbar, **the block style trigger ("Paragraph") goes whole to the More menu**, without first becoming icon only, and the exception is recorded in the `nph-toolbar` spec. The answer itself releases this task.

## Why
The text of the trigger is the value of the block (the style where the cursor is) and cannot leave. Four of the five editors with a written rule send the whole group to the menu: Spark (https://spark.genesys.com/latest/components/forms-and-inputs/rich-text-editor/usage-XlHQCpoM ), TinyMCE (https://www.tiny.cloud/docs/tinymce/latest/toolbar-configuration-options/ ) and CKEditor 5 (https://ckeditor.com/docs/ckeditor5/latest/getting-started/setup/toolbar.html ) among them. The refused alternative followed the spec, with the trigger becoming an icon before going to More; only Zendesk Garden does something like it.

## What the spec says today
`fichas/nph-toolbar.md`, business rules, read on `v/5.0.0` on 2026-11-22: "The bar does not wrap and does not collapse by itself: on a narrow screen, the consumer drops the text of the buttons first, then sends the actions at the back to More (pending decision D-5)." The same rule is in the metadata and in P104, item 7. DSA-55 D-5 (whether the bar collapses by itself) stays open.

## In Figma
The editor narrow toolbar (`7743:105`) shows history, link and More; the root sample `7748:1477` shows More open.
