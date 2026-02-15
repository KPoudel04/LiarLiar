# Liar Liar Design Style Guide

## 1. Brand Direction And Tone
Notebook Puzzle Lab.

The interface should feel like a daily puzzle page inside a physical notebook: warm, tactile, and focused. Visual noise stays low, but game affordances are clear and immediate.

## 2. Color System
### Token map
| Token | Value | Usage |
| --- | --- | --- |
| `--desk` | `#d2c3a8` | Outer background, desktop surface |
| `--paper` | `#f8f2e3` | Notebook sheet base |
| `--paper-2` | `#fffaf0` | Paper highlights and gradients |
| `--ink` | `#212018` | Primary text |
| `--ink-soft` | `#686251` | Secondary labels and helper text |
| `--rule-line` | `#ddd4c3` | Notebook ruled lines |
| `--binding` | `#b18b63` | Left margin/binding accent |
| `--moss` | `#2f6c45` | Correct states |
| `--rust` | `#8c3f32` | Wrong states |
| `--accent` | `#3f5f84` | Primary action/focus accent |

### Color usage rules
- `--moss` and `--rust` are status colors only, not decorative colors.
- `--accent` is reserved for current state emphasis and controls.
- Body text should remain in `--ink` to keep contrast stable on textured paper backgrounds.

## 3. Typography
- Primary UI stack: `'Trebuchet MS', 'Avenir Next', 'Segoe UI', sans-serif`
- Display/headline stack: `'Palatino Linotype', 'Book Antiqua', Palatino, serif`

### Scale
- Brand label: ~`0.76rem`, uppercase, wide letter spacing
- Metadata and helper copy: `0.9rem` - `0.95rem`
- Section title (`h2`): `1.4rem` - `1.7rem`
- Main title (`h1`): `1.7rem` - `2.45rem` responsive clamp

## 4. Spacing And Layout Grid
### Spacing tokens
`--space-1` through `--space-8` define spacing rhythm.

### Layout rules
- Desktop (`>= 900px`): 2-column fact-slip grid.
- Tablet (`600px-899px`): 1-column slips, compact horizontal padding.
- Mobile (`< 600px`): 1-column slips, full-width CTA, vertical feedback stack.

### Notebook margin
- Left notebook margin remains visible at all sizes.
- Interactive content offsets to the right of binding line and punch holes.

## 5. Component Patterns
### `board`
- `notebook-board` is the top-level container.
- Must include ruled-paper lines and binding margin treatments.

### `header`
- Includes brand line, puzzle title, daily metadata, and score badge.
- Keep score visible in every round state.

### `tracker`
- Five-slot progress strip.
- State classes: `is-pending`, `is-current`, `is-correct`, `is-wrong`.

### `fact-slip`
- Paper card with subtle texture, border, and soft shadow.
- Contains index chip, fact text, and hidden “false” stamp that appears on reveal.

### `feedback`
- Bottom bar with instructional or result message and next action.
- Must use `aria-live="polite"` for state changes.

### `cta`
- Primary button style for “Next round/See results.”
- Keep button treatment game-like but restrained.

### `results-chip`
- Compact paper tags summarizing each round with color-coded correctness.

## 6. Interaction Rules
- Hover: slight lift and border emphasis on enabled slips.
- Focus-visible: use focus ring (`--shadow-focus`) on controls.
- Selected: picked slip keeps accent border.
- Correct: green/moss reveal and stamp visible.
- Wrong: rust-tinted reveal with brief shake.
- Disabled: slips become non-interactive after round resolution.

## 7. Motion Guidelines
### Allowed motion
- Hover lift: subtle vertical translation.
- Wrong answer: short shake (`<= 220ms`).
- Correct reveal: brief pop (`<= 220ms`).
- Tracker transitions: color/border fill transition.

### Reduced motion
- Respect `prefers-reduced-motion: reduce`.
- Clamp animation and transitions to near-instant values.

## 8. Accessibility Checklist
- Maintain readable contrast between text and paper surfaces.
- Keep minimum tap targets around `44px` height on mobile slips/buttons.
- Keyboard path: all fact slips and the next button must be reachable and visibly focused.
- Feedback text uses `aria-live="polite"`.
- Use `aria-pressed` on selected fact slip for state clarity.

## 9. Do And Don't
### Do
- Keep tactile notebook identity consistent across components.
- Reuse tokens before introducing raw hex values.
- Reserve strong status colors for correctness feedback.

### Don't
- Do not introduce neon or high-saturation accents that break paper tone.
- Do not remove the round tracker or score badge from active rounds.
- Do not add long or dramatic animations that slow gameplay.
