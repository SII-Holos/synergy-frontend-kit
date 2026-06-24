# Design

## Visual Direction

Official product UI: restrained, dense, and legible. The surface should feel like a trusted control panel for a design-capability plugin, with status and provenance more important than decoration.

## Color

Use OKLCH tokens in plugin UI source.

```css
:root {
  --sfk-bg: oklch(1 0 0);
  --sfk-surface: oklch(0.972 0.004 180);
  --sfk-surface-strong: oklch(0.936 0.01 180);
  --sfk-ink: oklch(0.18 0.018 230);
  --sfk-muted: oklch(0.46 0.026 225);
  --sfk-border: oklch(0.86 0.012 220);
  --sfk-primary: oklch(0.48 0.095 180);
  --sfk-primary-soft: oklch(0.92 0.04 180);
  --sfk-success: oklch(0.50 0.11 155);
  --sfk-warning: oklch(0.64 0.12 75);
  --sfk-danger: oklch(0.56 0.16 30);
}
```

## Typography

Use the host application's system UI stack. Keep headings modest, labels clear, and line length capped for explanatory copy. Product surfaces should use fixed sizes rather than fluid display type.

## Components

- Settings rows use native checkboxes, selects, and number inputs with visible labels.
- Status summaries use compact rows with text labels plus color indicators.
- Repeated items may use cards, but avoid nested cards and decorative shadows.
- Empty or unknown states should explain the next command to run.

## Motion

Use only subtle state transitions under 200ms. Respect `prefers-reduced-motion` by removing transitions.
