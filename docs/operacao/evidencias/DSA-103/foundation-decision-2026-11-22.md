```json
{
  "task": "DSA-103",
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
    "converted_decision": "Item 11 of the nph-toast-region approval of 2026-11-22: the gap between toasts is toast-region/gap (alias of space/stack); notification/stack-gap (VariableID:4243:228, alias of space/stack-snug) leaves in a foundation task after the region is merged. The design owner released this task in the chat on 2026-11-22."
  }
}
```

# DSA-103 — `foundation-decision`

## The decision
On 2026-11-22 the design owner approved item 11 of the `nph-toast-region` approval: **`notification/stack-gap` leaves**, in a foundation task, once the region reads `toast-region/gap`. The same day she released this task in the chat.

## Why
Before the region was a piece, the consumer's container read `notification/stack-gap` as the gap between toasts (`fichas/nph-notification.md`, "The toast region"). With DSA-100 the region is the `nph-toast-region`, and its gap is `toast-region/gap`, an alias of `space/stack`. No CSS of a piece reads `notification/stack-gap`: only the region frame of the `nph-notification` demo does, and DSA-100 moves that frame to the region; the contract test of the `nph-notification` keeps it only in its list of tokens the piece does not read. A token with no reader is removed, so the tokens and the texts do not point to a gap nobody uses.

## What Figma has today
- `notification/stack-gap` (`VariableID:4243:228`), alias of `space/stack-snug`. It stays until this task is merged; the design side removes it then.
- `toast-region/gap`, alias of `space/stack`, bound in the region set `7689:288`.

## Order
This task waits for DSA-100: the region stories and the sheet move there first. Then the token and the texts leave together here.
