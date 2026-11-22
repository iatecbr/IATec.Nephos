```json
{
  "task": "DSA-104",
  "gate": "foundation-decision",
  "date": "2026-11-22",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0",
    "date": "2026-11-22",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "Item 6 of the nph-chart approval of 2026-11-22: chart/label-foreground points to color/muted-foreground and chart/foreground to color/foreground; the foundation sentence 'There is no chart-specific text token' changes in a foundation task. The design owner released this task in the chat on 2026-11-22."
  }
}
```

# DSA-104 — `foundation-decision`

## The decision
On 2026-11-22 the design owner approved item 6 of the `nph-chart` approval: **the chart text uses `chart/label-foreground` and `chart/foreground`**, and the foundation sentence "There is no chart-specific text token" changes in a foundation task. The same day she released this task in the chat.

## Why
The token rule of the design system says a component reads only its own tokens, which point to a semantic, which points to a primitive. The chart text read the semantics directly, so the approval gave it two tokens of its own, with the same colors: the precedents are `progress/value-foreground` and `card/description-foreground`. With the tokens on `v/5.0.0` (DSA-101), the old sentence is no longer true.

## Values
- `chart/label-foreground` → `color/muted-foreground` (axis labels and legend).
- `chart/foreground` → `color/foreground` (title and the error sentence).

The colors on screen do not change.
