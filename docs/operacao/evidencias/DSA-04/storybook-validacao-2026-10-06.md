```json
{
  "task": "DSA-04",
  "gate": null,
  "date": "2026-10-06",
  "owner": "claude-code",
  "command": "npx storybook dev -p 6013 --no-open; reading through getComputedStyle and getBoundingClientRect in the integrated browser",
  "exit_code": null,
  "sha": "151b317",
  "external_origin": null
}
```

# DSA-04 — `nph-label` in Storybook

Proof of the `Validação` stories and of the `Docs` page opened in the integrated
browser (Chromium, `devicePixelRatio` 1.25), on the branch
`feat/dsa04-nph-label-info`, in the default brand. The Figma values were read
through `use_figma` on the same day, in component set `374:6`, in the `aberto` row of frame
`1194:1482` and in the variables, modes `claro` and `escuro` with the `Sistemas` theme.

This evidence is not a gate evidence. Its name does not follow `<gate>-<date>`.

| Story | What was measured | Storybook | Figma |
|---|---|---|---|
| `Foco do gatilho`, light frame (focus by Tab) | trigger; root; text up to the trigger; icon | 24 × 24; 24; 4; 16, `#5c5c5c` | 24 × 24; 24; `space/inline-tight` 4; `icon/size-sm` 16, `color/muted-foreground` `#5c5c5c` |
| `Foco do gatilho`, light frame | focus border and halo | border 26, `#3b82f6`, radius 7; halo 34, `#b1cdfb`, stroke 4, radius 11 | border 26 × 26, `focus/border` `#3b82f6`, radius 7; halo 34 × 34, `focus/halo` `#b1cdfb`, stroke 4, radius 11 |
| `Foco do gatilho`, dark frame | icon; border; halo | `#b7bbc1`; `#89b4fa`, 26; `#b1cdfb`, 34 | `#b7bbc1`; `#89b4fa`; `#b1cdfb` |
| `Aberto`, light scheme | open balloon; distance; background and text | `open`, `aria-expanded="true"`; x 0 and y 8 from the label; `#5c5c5c` and `#ffffff` | below the label, same x, `space/inline` 8; `color/tooltip` `#5c5c5c` and `color/tooltip-foreground` `#ffffff` |
| `Aberto`, dark scheme | background and text | `#454545` and `#e3e3e3` | `#454545` and `#e3e3e3` |
| `Docs › Documentação` | sections in pt-BR, en and es | 1 to 10 of the frame and References, 13 labels and 4 triggers in each language | sections 1 to 10 of frame `1194:1482` |

The focus border is computed as `0.8px` with `devicePixelRatio` 1.25: the
browser snaps the `border/width` border (1 px) to a device pixel. The
border box stays at 26, as in Figma. In the Chromium tests, with
`devicePixelRatio` 1, the width is 1 px.

No horizontal scrolling at 375 px in the stories and in the Docs, checked in the code
inspection.
