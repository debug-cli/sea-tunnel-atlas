# Anti-slop UI guidelines: DST tunnel emergency exit map

Brief for restyling a small static Leaflet map site. Follow every rule. Where a rule conflicts with the project constraints, the project constraints win.

## Project constraints (non-negotiable)

- No purple, violet, indigo, or lavender anywhere. No gradients. No glassmorphism or backdrop blur.
- Body and UI font: `"Trebuchet MS", "Lucida Grande", "Lucida Sans Unicode", sans-serif`.
- Accent font: `"DejaVu Sans Mono", ui-monospace, monospace`. Use it only for data: station codes, distances, coordinates, exit IDs, counts. Never for labels, buttons, or headings.
- 1 Line color `#176d4e`. 2 Line color `#007CAD`. Dark-mode tints: `#72c99e` (1 Line), `#5cb8e0` (2 Line).
- Keep every legal and safety warning visible on every screen size. Never hide one behind a toggle, accordion, tooltip, or hover. Never shrink one below body size. Never style one as faint grey fine print.

## Banned tells

- Eyebrow labels: small uppercase, letter-spaced kicker text above a heading ("OVERVIEW", "EXITS"). Delete them. If the label holds real information (a date, a line), put it in the heading.
- Tracked all-caps anywhere. Use sentence case. A real warning loses force when every label shouts.
- Purple or blue-to-purple gradients, gradient text, gradient washes, glow blobs behind content.
- Glass panels, frosted cards, translucent overlays that drop text contrast.
- Emoji as icons, bullets, or decoration. Use one SVG icon set with one stroke width, or no icons.
- Generic hero copy: "Navigate with confidence", "Your seamless guide", "Discover", "Unlock". State what the map shows.
- The SaaS card kit: content chopped into identical rounded cards, one radius on everything, the same soft shadow under each.
- Shadows on everything. Use shadow only on things that float over the map (popups, an open panel).
- Borders around every block and boxes inside boxes. Group with spacing and headings first. Two levels of nesting at most.
- Colored stripe on one edge of a card. Reserve edge color for real status, such as a closed exit.
- Centered everything. Left-align text blocks, lists, and panels.
- Inter, Roboto, Open Sans, or system-ui by default. Use the project fonts.
- Fake stats, round-number counters, invented testimonials or logos. Show only sourced facts.
- Big number with small label and a gradient accent (the hero-metric template).
- Pills and badges that mean nothing ("NEW", "LIVE", a green pulsing dot). A badge must change what the user does.
- Status dots that carry meaning by hue alone. Always add the word.
- Numbered markers (01 / 02 / 03) on content that is not a sequence.
- Middle-dot meta strings ("A · B · C") and "WORD — fragment" labels. Give each fact its own element.
- An arrow glyph appended to links and buttons ("Learn more →").
- One word in a headline set in italic, bold, or a different color.
- Monospace used as "technical" decoration on labels and inputs.
- Tinted near-black (#0B0B0B, #111) on a near-black page with one bright neon accent. In dark mode, use the line tints on a calm dark neutral, not neon on black.
- Fake terminal UI, blinking cursors, shimmer text.
- Placeholder content left in place: grey logo boxes, initials in circles, empty image frames, lorem ipsum.

## Typography

- Use Trebuchet MS for everything except data. Set DejaVu Sans Mono with tabular figures for numbers that line up.
- Base size 16px minimum on mobile. Nothing below 12px, and safety text never below body size.
- Body line-height 1.5 to 1.65. Keep line length under 75 characters on desktop, 35 to 60 on phones.
- Set one type scale (for example 14, 16, 18, 22, 28) and stick to it. Use weight for hierarchy: 700 headings, 400 body.
- Keep default letter-spacing on body text. No wide tracking.
- Headings one level at a time (h1, h2, h3). One h1 per page.
- Let long IDs and URLs wrap with `overflow-wrap: anywhere`. Prefer wrapping to truncation.

## Color

- Define semantic tokens (`--bg`, `--surface`, `--ink`, `--muted`, `--line-1`, `--line-2`, `--warn`, `--focus`). No raw hex inside components.
- Light mode: neutral off-white or white ground, dark ink, line colors for routes and their legend only.
- Contrast check (computed): `#176d4e` on white is 6.3:1, safe for text. `#007CAD` on white is 4.68:1, passes for text only on pure white; on off-white `#f6f5f0` it drops to 4.29:1 and fails. Put 2 Line text on white, darken it for small text, or use it for strokes and large text only.
- White text on `#176d4e` (6.3:1) and on `#007CAD` (4.68:1) passes. Black or dark ink is required on the dark tints `#72c99e` and `#5cb8e0` (white on them fails at about 2:1).
- Dark mode: `#72c99e` on `#1a1d1b` is 8.55:1 and `#5cb8e0` is 7.6:1. Use desaturated, lighter tones, never inverted colors. Test dark mode separately.
- Warnings use one warning color with an icon and a word, never color alone. Keep warning color distinct from both line colors.
- Never encode line, status, or exit type by color alone. Pair color with a label, pattern, or shape on the map.
- Flat fills only. One color carries one meaning across the whole site.

## Layout and spacing

- The map is the hero. Open with it, not a headline banner or stats row.
- Use a 4/8px spacing scale with clear tiers (8, 16, 24, 32, 48).
- Give different things different shapes: buttons, panels, and inputs need not share one radius. Keep radius small and consistent within each type.
- One primary action per screen. Make secondary actions visually quieter.
- Keep the warning block in normal document flow near the map. It must not be covered by the map, a fixed bar, or a popup.
- Define a z-index scale (map 0, controls 10, panels 20, header 40, modal 100) so Leaflet panes and site UI never fight.
- Remove any element the user does nothing with.

## Mobile and responsive

- Add `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`. Never disable zoom.
- Design mobile-first. Test at 320, 375, 390, 768, 1024, and 1440px, plus phone landscape.
- No horizontal scroll at any width. Check 320px.
- Size the map with `100dvh` or `min-height: 100dvh`, with a `100vh` fallback. Do not use bare `100vh` on mobile.
- Respect safe areas: pad fixed headers, footers, and controls with `env(safe-area-inset-*)`.
- Every tap target, including Leaflet zoom buttons, layer toggles, popup close buttons, and legend items, is at least 44 by 44px with 8px between targets. Enlarge the hit area when the glyph is smaller.
- Map controls on small screens: keep zoom, locate, and layer controls in one corner away from the browser's bottom bar and the home indicator. Collapse the legend into a labeled button. Keep popups inside the viewport with Leaflet `autoPanPadding`, and keep their text at body size.
- Keep one-finger page scroll and two-finger map pan from fighting. Do not trap the page scroll inside the map.
- Stack side panels below the map on phones. Show the safety warning before or right beside the map on first load.
- Reserve space for content that loads late so nothing jumps (layout shift under 0.1).
- Add `touch-action: manipulation` on controls to drop tap delay.

## Accessibility

- Text contrast at least 4.5:1, large text and non-text UI (icons, control borders, route lines) at least 3:1.
- Visible focus ring on every control, 2 to 3px, at least 3:1 against its background. Never `outline: none` without a replacement. Sticky UI must not cover the focused control.
- Semantic HTML: `header`, `main`, `nav`, `aside`, `footer`, real `button` and `a` elements. Add a skip link to main content.
- Icon-only buttons need an `aria-label`. Hide decorative icons with `aria-hidden="true"`.
- Give the map an accessible name and provide a plain list or table of exits and stations as a text alternative.
- Make every marker and popup reachable and closable by keyboard. Esc closes popups and panels.
- Announce changed status with a polite live region without moving focus.
- Respect `prefers-reduced-motion`: turn off fly-to animation, transitions, and any looping motion.
- Set `lang` on `html`, a real `title`, and a meta description.

## Motion

- Animate only what changed because the user acted: a panel opening, a popup appearing, a map recentering.
- No fade-in-on-scroll, no staggered section entrances, no parallax, no pulsing markers, no looping decoration.
- Keep transitions short (150 to 250ms). Exits faster than entrances. Animate transform and opacity only.
- Never block input during an animation.
- Anything that moves for more than 5 seconds needs a pause control.

## Copy tone

- Plain, specific, active voice, sentence case. Write what the user can do: "Find the nearest exit", not "Explore exits".
- Buttons name the action and the object: "Show 2 Line exits", "Close details".
- Write numbers as digits. No filler words ("seamless", "robust", "effortless", "powerful").
- Errors say what happened and how to fix it. Empty states say what to do next.
- Keep every legal disclaimer and safety warning word-for-word. Do not shorten, soften, or rephrase them.
- One fact, one wording, everywhere on the site.

## Pre-delivery checklist

- [ ] No eyebrows, all-caps labels, purple, gradients, glass, emoji icons, glow, or fake stats.
- [ ] Only Trebuchet MS and DejaVu Sans Mono load; mono appears only on data.
- [ ] Line colors match the brand hexes in light and dark mode.
- [ ] Every legal and safety warning is visible, full size, and unhidden at 320, 390, 768, and 1440px, in light and dark mode.
- [ ] No horizontal scroll at 320px. Tested in phone landscape.
- [ ] All controls, including Leaflet controls and popup close buttons, are at least 44px with 8px gaps.
- [ ] Safe-area insets applied. Map height uses `dvh`. Nothing hides behind fixed bars.
- [ ] Text contrast 4.5:1 and UI contrast 3:1, checked in both themes. 2 Line text is not on off-white.
- [ ] Color is never the only cue for line, status, or warning.
- [ ] Visible keyboard focus on every control. Tab order matches visual order. Skip link works.
- [ ] Reduced motion turns off all animation. Nothing stays hidden.
- [ ] Text alternative lists every exit and station.
- [ ] Headings in order, `lang` and `title` set, viewport zoom allowed.
- [ ] Viewed the rendered page at phone and desktop width, then removed one decoration.

## Sources

Rules above are paraphrased and adapted, not copied.

1. UI UX Pro Max skill, nextlevelbuilder. SKILL.md, references/quick-reference.md, references/pro-rules.md. https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (MIT License)
2. Taste Skill (design-taste-frontend, tasteskill 2.5.1), Leonxlnx. skills/taste-skill/SKILL.md. https://github.com/Leonxlnx/taste-skill (MIT License)
3. Anthropic frontend-design skill. skills/frontend-design/SKILL.md. https://github.com/anthropics/skills/tree/main/skills/frontend-design (Apache License 2.0, per its LICENSE.txt)
4. Paralect, "Signs of AI slop in design: 21 patterns". https://www.paralect.com/blog/signs-of-ai-slop-in-design (all rights reserved; no open license stated; summarized only)
5. design.how, "AI slop UI: the tells, and the lint rules that ban them", Arlan Marat. https://design.how/ai-slop-ui (all rights reserved; no open license stated; summarized only)
