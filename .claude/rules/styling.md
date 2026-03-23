---
paths:
  - "src/**/*.scss"
  - "src/**/*.astro"
  - "src/**/*.vue"
---

# Styling Rules

## Spacing & Sizing
- Always use `calc($spacer * N)` — never raw rem/px for spacing
- Use `$font-size-*` variables for typography — no arbitrary font sizes
- Use `$border-radius`, `$border-radius-lg`, `$border-radius-pill` — no arbitrary border radius

## Colors & Theming
- Always use `var(--ks-*)` custom properties for colors — no hardcoded hex
- Dark mode is automatic via CSS vars — do not add manual dark mode conditionals
- If you must target dark mode specifically: `:global(html.dark) &`

## Responsive Design
- Always use `@include media-breakpoint-down()` for responsive — no raw `@media`
- Exception: `@media (prefers-reduced-motion: reduce)` and `@media (prefers-color-scheme: dark)` are allowed
- Desktop-first approach: write base styles for large screens, use `breakpoint-down` for smaller

## Layout
- Use Bootstrap grid (`container-xl`, `row`, `col-*`) for page layouts
- Use `bd-gutter` class for standard page gutters
- Use CSS Grid or Flexbox for component-internal layouts

## Scoping
- Component styles must be scoped (`<style lang="scss">` in Astro, `scoped` in Vue)
- Use `:global()` only when targeting slotted/child component content
- Never use `!important` unless overriding a third-party library

## Animations
- Use `data-usal` attribute for scroll animations — not CSS @keyframes or JS libraries
- All custom transitions/animations must respect `prefers-reduced-motion`:
  ```scss
  @media (prefers-reduced-motion: reduce) {
      transition: none;
  }
  ```
- Use `transition` for state changes (hover, active), not `animation`
- Keep transition durations short: 0.15s-0.3s for UI feedback

## Performance
- Avoid `transition: all` — be specific: `transition: color 0.2s ease, border-color 0.2s ease`
- Avoid layout-triggering properties in transitions (width, height, top, left) — prefer `transform` and `opacity`
- Use `will-change` sparingly and only on elements that actually animate frequently

## Accessibility
- Never remove focus outlines (`outline: none`) without providing a visible replacement
- Ensure color contrast ratio of at least 4.5:1 for text (WCAG AA)
- Interactive elements need visible hover AND focus states
- Touch targets: minimum 44x44px for buttons and links on mobile
