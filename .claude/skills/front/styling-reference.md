# Styling Reference

## SCSS Variables (from _variable.scss)

### Spacing

- `$spacer`: 1rem (base unit — use `calc($spacer * N)` for all spacing)

### Font Sizes

- `$font-size-sm` — Small text, labels
- `$font-size-md` — Body text
- `$font-size-lg` — Large body, card titles
- `$font-size-xl` — Small headings
- `$font-size-2xl` — Mobile headings
- `$font-size-4xl` — Desktop headings, subtitles

### Border Radius

- `$border-radius` — Default (buttons, inputs)
- `$border-radius-lg` — Cards, panels
- `$border-radius-pill` — Pill shapes (tags, badges)

### Breakpoints (Bootstrap)

- `sm`: 576px
- `md`: 768px
- `lg`: 992px
- `xl`: 1200px
- `xxl`: 1400px

Use via mixins:

```scss
@include media-breakpoint-down(lg) { /* ≤ 991px */ }
@include media-breakpoint-down(md) { /* ≤ 767px */ }
@include media-breakpoint-down(sm) { /* ≤ 575px */ }
@include media-breakpoint-up(lg) { /* ≥ 992px */ }
```

## CSS Custom Properties

### Theme Colors

```scss
--ks-background-body          // Main background
--ks-background-secondary     // Alt background (cards, code blocks)
--ks-content-primary          // Primary text
--ks-content-secondary        // Muted text
--ks-content-link             // Link color
--ks-content-color-highlight  // Accent/brand color
--ks-border-color             // Borders, dividers
```

### Layout

```scss
--top-bar-height: 67px        // Header height
--announce-height: 40px       // Announcement bar
```

### Fonts

```scss
--font-family-mona-sans       // Body font
--font-family-jetbrains-mono  // Code font
--bs-font-monospace           // Bootstrap monospace alias
```

## Common Style Patterns

### Scoped + Global styles

```scss
// Scoped to this component
<style lang="scss">
    .my-component { ... }
</style>

// Target slotted/child content
<style lang="scss">
    :global(.child-class) {
        color: var(--ks-content-primary);
    }
</style>
```

### Responsive Pattern

```scss
.my-component {
    // Desktop first
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: calc($spacer * 2);
    padding: calc($spacer * 4) 0;

    @include media-breakpoint-down(lg) {
        grid-template-columns: repeat(2, 1fr);
        gap: $spacer;
    }

    @include media-breakpoint-down(sm) {
        grid-template-columns: 1fr;
        padding: calc($spacer * 2) 0;
    }
}
```

### Dark Mode

Dark mode is automatic via CSS custom properties. The `.dark` class is set on `<html>`.
Theme files: `ks-theme-dark.scss`, `ks-theme-light.scss`.

**You should NOT need to write dark mode conditionals.** Use `var(--ks-*)` properties and they switch automatically. Only if you have a truly unique case:

```scss
:global(html.dark) & {
    // dark-only override
}
```

### Container Pattern

```html
<!-- Standard content width with gutters -->
<div class="container-xl bd-gutter">
    <div class="row">
        <div class="col-12">...</div>
    </div>
</div>
```

### Hover/Interactive States

```scss
a, button {
    // Be specific — avoid "transition: all" (causes layout thrashing)
    transition: color 0.2s ease, border-color 0.2s ease;

    &:hover {
        color: var(--ks-content-color-highlight);
        border-color: var(--ks-content-color-highlight);
    }

    // Always provide focus styles alongside hover
    &:focus-visible {
        outline: 2px solid var(--ks-content-color-highlight);
        outline-offset: 2px;
    }
}
```

### Accessibility Styles

```scss
// Respect user motion preferences
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}

// Visible focus indicators (never remove without replacement)
:focus-visible {
    outline: 2px solid var(--ks-content-color-highlight);
    outline-offset: 2px;
}

// Screen-reader only utility
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
}
```

### Performance Tips

```scss
// Prefer transform/opacity for animations (GPU-accelerated)
.slide-in {
    transform: translateX(-100%);
    opacity: 0;
    transition: transform 0.3s ease, opacity 0.3s ease;

    &.active {
        transform: translateX(0);
        opacity: 1;
    }
}

// Avoid animating layout properties (causes reflow)
// BAD:  transition: width 0.3s, height 0.3s, top 0.3s;
// GOOD: transition: transform 0.3s, opacity 0.3s;

// Use will-change sparingly — only on frequently animated elements
.carousel-slide {
    will-change: transform;
}
```
