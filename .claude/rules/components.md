---
paths:
  - "src/components/**/*.astro"
  - "src/components/**/*.vue"
---

# Component Rules

## Structure
- PascalCase filenames always
- Define `interface Props` with full TypeScript types — no `Function`, `Array`, or `Object` without generics
- Prefer `<slot />` composition over prop-drilling HTML content
- Spread `...rest` on root element for HTML attribute forwarding in Astro
- Always check if a reusable component exists in `components/layout/` or `components/common/` before creating a new one

## Vue Specific
- Must use `<script setup lang="ts">` — no Options API, no `export default`
- Use `withDefaults(defineProps<Props>(), {})` for typed props with defaults
- Use template refs (`ref<HTMLElement>()`) — never `document.querySelector` or `document.getElementById`
- Every `addEventListener` in `onMounted` must have a matching `removeEventListener` in `onUnmounted`
- Never assign `window.onscroll`, `window.onresize` etc. — use `addEventListener`/`removeEventListener`
- Use `computed()` for derived values — only use `watch()` for side effects
- Use `shallowRef()` for large arrays/objects that are replaced entirely

## Astro Specific
- Destructure `class` as `className` to avoid reserved word conflict
- Use `class:list` for conditional classes
- Choose the lightest client directive: `client:idle` by default, `client:load` only for above-fold interactive elements
- Never wrap entire pages in Vue — use targeted islands

## Styling
- Use scoped `<style lang="scss">` — never inline styles, never `<style>` without lang
- Use `$spacer` calculations for all spacing — no raw px or rem values
- Use `var(--ks-*)` CSS properties for colors — never hardcode hex values
- Use Bootstrap breakpoint mixins for responsive — no raw media queries
- Use `:global()` only when targeting slotted/child component content

## Accessibility
- Use semantic HTML: `<button>` not `<div @click>`, `<nav>` not `<div class="nav">`
- All interactive elements must have visible focus styles — never `outline: none` without replacement
- Icon-only buttons must have `aria-label`
- Images must have `alt` text — use `alt=""` for decorative images
- Image dimensions must be unitless: `width="24"` not `width="24px"`

## Security
- Never use `v-html` or `set:html` with user input or external API data
- Only use `v-html`/`set:html` with trusted static content (SVGs, config-based HTML)
- Use Vue text interpolation `{{ }}` which auto-escapes
