---
name: front
description: Frontend developer guide for the Kestra docs site. Covers all Astro/Vue/SCSS component patterns, styling conventions, content authoring, and best practices derived from the codebase.
---

# Frontend Developer Guide — Kestra Docs

You are working on the Kestra documentation site. Follow these patterns exactly — they are derived from the existing codebase.

## Component Patterns

### Astro Components (`.astro`)

Structure every component like this:

```astro
---
import type { HTMLAttributes } from "astro/types"

interface Props extends HTMLAttributes<"div"> {
    title?: string
    variant?: "primary" | "secondary"
}

const { title, variant = "primary", class: className, ...rest } = Astro.props
---

<div class:list={["my-component", variant, className]} {...rest}>
    {title && <h2>{title}</h2>}
    <slot />
</div>

<style lang="scss">
    .my-component {
        padding: calc($spacer * 2) 0;

        h2 {
            color: var(--ks-content-primary);
            font-weight: 600;
        }

        @include media-breakpoint-down(md) {
            padding: $spacer 0;
        }
    }
</style>
```

Key rules:
- Always define `interface Props` with TypeScript types
- Spread `...rest` onto the root element for HTML attribute forwarding
- Destructure `class` as `className` to avoid reserved word conflict
- Use `class:list` for conditional classes
- Use scoped `<style lang="scss">` — never inline styles
- Use `<slot />` for composable content, named slots for multi-slot components

### Vue Components (`.vue`)

Use Vue 3 Composition API (`<script setup>`):

```vue
<template>
    <div class="my-component">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"

interface Props {
    title: string
    count?: number
}

const props = withDefaults(defineProps<Props>(), {
    count: 0,
})

const isActive = ref(false)
</script>

<style lang="scss" scoped>
.my-component {
    color: var(--ks-content-primary);
}
</style>
```

Key rules:
- Always use `<script setup lang="ts">`
- Never use Options API or class components
- Use `withDefaults` + `defineProps<Props>()` for typed props
- Scoped styles with `lang="scss"`

### When to use Astro vs Vue

| Use Astro when... | Use Vue when... |
|---|---|
| Static/server-rendered content | Client-side interactivity needed |
| No JS needed in browser | Event handlers, reactive state |
| Layout wrappers, sections | Modals, carousels, search, forms |
| Content pages, cards | Navigation with toggle states |

### Vue in Astro — Client Directives

```astro
<!-- Loads JS immediately — use for above-fold interactive elements -->
<MyVueComponent client:load />

<!-- Loads when browser is idle — use for below-fold interactive elements -->
<MyVueComponent client:idle />

<!-- Loads when scrolled into view — use for far-down-page elements -->
<MyVueComponent client:visible />

<!-- Persists state across page navigations -->
<MyVueComponent client:load transition:persist />
```

## Styling System

### CSS Custom Properties (`--ks-*`)

```scss
// Colors
var(--ks-background-body)        // Page background
var(--ks-content-primary)        // Main text
var(--ks-content-secondary)      // Secondary text
var(--ks-content-link)           // Links
var(--ks-content-color-highlight) // Accent/highlight

// Fonts
var(--font-family-mona-sans)     // Body text
var(--font-family-jetbrains-mono) // Code blocks

// Layout
var(--top-bar-height)            // 67px header
var(--announce-height)           // 40px announcement bar
```

### SCSS Conventions

```scss
// Use $spacer for all spacing (1rem base)
padding: calc($spacer * 2) 0;
margin-bottom: calc($spacer / 2);
gap: $spacer;

// Use Bootstrap breakpoint mixins for responsive
@include media-breakpoint-down(lg) { ... }
@include media-breakpoint-down(md) { ... }
@include media-breakpoint-down(sm) { ... }

// Use $font-size-* variables
font-size: $font-size-4xl;  // Headings
font-size: $font-size-2xl;  // Subheadings
font-size: $font-size-md;   // Body
font-size: $font-size-sm;   // Small text

// Dark mode — handled automatically via CSS vars
// No need for manual dark mode conditionals in components
```

### Layout Utilities

```html
<!-- Bootstrap grid -->
<div class="container-xl bd-gutter">
    <div class="row">
        <div class="col-12 col-lg-6">...</div>
    </div>
</div>

<!-- Flex utilities -->
<div class="d-flex gap-3 align-items-center justify-content-between">
```

### Animation with USAL

```html
<!-- Fade from right -->
<div data-usal="fade-r">content</div>

<!-- Fade from left with delay -->
<h2 data-usal="fade-l delay-200 duration-400 ease-out">title</h2>

<!-- Zoom in -->
<div data-usal="zoomin">content</div>

<!-- Fade up (default) -->
<div data-usal="fade">content</div>
```

Available types: `fade`, `fade-r`, `fade-l`, `zoomin`
Modifiers: `delay-{ms}`, `duration-{ms}`, `ease-out`

## Reusable Layout Components

Always prefer these existing components over creating new wrappers:

| Component | Purpose | Location |
|---|---|---|
| `TopHero.astro` | Hero banner with gradient background | `components/layout/` |
| `CardGrid.astro` | Grid of cards | `components/layout/` |
| `SplitSection.astro` | Two-column layout | `components/layout/` |
| `Link.astro` | Styled link with animation | `components/common/` |
| `CTA.astro` | Call-to-action block | `components/common/` |
| `GetStarted.astro` | Getting started CTA | `components/common/` |

## Content Authoring

### File Structure

```
src/contents/docs/
├── 01.getting-started/
│   ├── index.md          # Section landing page
│   ├── 01.quickstart.md
│   └── 02.installation.md
├── 02.concepts/
│   └── ...
```

- Prefix with `01.`, `02.` for ordering — stripped from URLs by `generateId()`
- Use `index.md` for section landing pages
- All content files need frontmatter with at minimum `title`

### Frontmatter Schema (docs)

```yaml
---
title: Page Title           # Required
sidebarTitle: Short Title   # Optional, shown in sidebar if different
description: SEO desc       # Optional
icon: icon-name             # Optional, for sidebar icon
editions: [OSS, EE, Cloud]  # Optional, which editions support this
release: "0.18.0"           # Optional, when feature was added
---
```

### Custom Markdown Features

- **Directives**: `:::note`, `:::warning` etc. via remark-directive
- **External links**: Automatically get `target="_blank" rel="noopener noreferrer"`
- **Headings**: Auto-get IDs and anchor links
- **Images**: Auto-get `.zoom` class for lightbox on click
- **Code blocks**: Styled by Expressive Code (github-dark/light themes)

## Image Handling

```astro
---
// Static import (preferred for assets in src/)
import heroImage from "~/assets/landing/hero.svg"
import { Image } from "astro:assets"
---

<Image src={heroImage} alt="Hero description" />

<!-- For public/ images, use regular img -->
<img src="/landing/icon.svg" alt="Icon" />
```

- Always provide `alt` text
- Use `astro:assets` Image component for optimization
- Store reusable assets in `src/assets/` by category
- Public static files go in `public/`

## Import Aliases

```typescript
// Always use ~ for src/ imports
import Section from "~/components/layout/Section.astro"
import { $fetchApi } from "~/utils/fetch"
import type { Blueprint } from "~/type"

// UI library imports
import "#mdc-imports"
import "#mdc-configs"
```

## File Naming Conventions

| Type | Convention | Example |
|---|---|---|
| Astro components | PascalCase | `BlogCard.astro` |
| Vue components | PascalCase | `NavSideBar.vue` |
| Utilities | camelCase | `generateId.ts` |
| Composables | camelCase with `use` prefix | `useApi.ts` |
| SCSS partials | kebab-case with `_` prefix | `_variable.scss` |
| Content files | kebab-case with number prefix | `01.quickstart.md` |
| Pages | kebab-case or `[...slug]` | `[...slug].astro` |

## Performance Best Practices

### Client Directive Selection (Critical)

Choose the lightest directive that works. Over-using `client:load` hurts LCP and TBT.

```
client:load    → ONLY for above-fold interactive elements (Header, Search, Announce)
client:idle    → Below-fold interactive elements (carousels, grids, filters)
client:visible → Far-down-page elements (footer CTAs, comment sections)
client:only    → Components that must never SSR (canvas, WebGL, browser-only APIs)
```

**Audit rule**: If a `client:load` component is not visible in the initial viewport, change it to `client:idle`.

### Islands Architecture

- Keep Vue islands small and focused — each `client:` directive creates a separate JS bundle
- Prefer Astro for anything that doesn't need interactivity — zero JS shipped
- Never wrap an entire page in a Vue component — use targeted islands
- Pass data as serialized props (JSON strings) from Astro to Vue, not complex objects

### Image Performance

```astro
<!-- Always set explicit width/height to prevent CLS -->
<Image src={img} alt="desc" width={800} height={450} />

<!-- Use unitless values for width/height — never "800px" -->
<img src="/img.png" alt="desc" width="800" height="450" loading="lazy" />

<!-- Above-fold images: eager loading, fetchpriority -->
<img src="/hero.png" alt="hero" loading="eager" fetchpriority="high" />

<!-- Below-fold images: lazy loading (default for astro:assets Image) -->
<Image src={img} alt="desc" loading="lazy" />
```

### Font Loading

Fonts are loaded via Astro's font system with CSS variables. Never import fonts manually or use `@font-face` — the config handles this.

### Prefetching

Astro's View Transitions handle prefetching. For manual control:
```astro
<!-- Prefetch on hover (default with View Transitions) -->
<a href="/docs">Docs</a>

<!-- Disable prefetch for external or heavy pages -->
<a href="/large-page" data-astro-prefetch="false">Heavy</a>
```

## Accessibility Requirements

### Semantic HTML

```astro
<!-- DO: Use semantic elements -->
<nav aria-label="Main navigation">...</nav>
<main>...</main>
<article>...</article>
<section aria-labelledby="section-title">
    <h2 id="section-title">Title</h2>
</section>
<button type="button" @click="toggle">Toggle</button>

<!-- DON'T: Use divs for everything -->
<div class="nav">...</div>
<div onclick="toggle()">Toggle</div>
```

### ARIA Patterns

```html
<!-- Modals -->
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <h2 id="modal-title">Title</h2>
</div>

<!-- Tabs -->
<div role="tablist">
    <button role="tab" aria-selected="true" aria-controls="panel-1">Tab 1</button>
</div>
<div role="tabpanel" id="panel-1">Content</div>

<!-- Loading states -->
<div aria-busy="true" aria-live="polite">Loading...</div>

<!-- Icon-only buttons -->
<button aria-label="Close menu"><Icon name="mdi:close" /></button>
```

### Keyboard Navigation

- All interactive elements must be focusable and operable with keyboard
- Visible focus indicators — never `outline: none` without a replacement
- Tab order must follow visual order — avoid `tabindex` > 0
- Trap focus inside modals when open

### Reduced Motion

```scss
// Wrap all animations and transitions
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}

// Or per-component
.animated-element {
    transition: transform 0.3s ease;

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
}
```

USAL animations should respect this automatically, but verify custom CSS animations do too.

## Security Rules

### v-html and set:html

```vue
<!-- NEVER use v-html with user-generated or external content -->
<div v-html="userComment" />  <!-- XSS VULNERABILITY -->

<!-- OK: Trusted static content (SVGs, pre-built HTML from config) -->
<div v-html="trustedSvgIcon" />

<!-- For dynamic content, use text interpolation -->
<p>{{ userComment }}</p>
```

Same rules apply to Astro's `set:html`:
```astro
<!-- OK: Trusted content from frontmatter or config -->
<div set:html={entry.data.description} />

<!-- NEVER: User input or external API data without sanitization -->
```

### Content Security

- Never construct HTML strings from user input
- Use Vue's built-in text interpolation `{{ }}` which auto-escapes
- External links get `rel="noopener noreferrer"` automatically via rehype plugin
- CSP headers are configured in middleware — don't weaken them

## Vue 3 Best Practices

### Reactivity

```typescript
// Use ref() for primitives
const count = ref(0)
const name = ref("")

// Use ref() for objects too (simpler, consistent)
const user = ref({ name: "", age: 0 })

// Use shallowRef() for large objects that replace entirely (performance)
const items = shallowRef<Item[]>([])
items.value = [...newItems] // Must replace, not mutate

// Use computed() for derived values — NOT watchers
const fullName = computed(() => `${first.value} ${last.value}`)

// Only use watch() for side effects (API calls, DOM updates)
watch(searchQuery, async (query) => {
    results.value = await fetchResults(query)
})
```

### Event Listener Cleanup (Critical)

Always clean up global event listeners. Memory leaks are a known issue in this codebase.

```typescript
// CORRECT: Clean up in onUnmounted
onMounted(() => {
    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleResize)
})

onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll)
    window.removeEventListener("resize", handleResize)
})

// WRONG: Overwrites global handler, never cleaned up
window.onscroll = () => { ... }

// BEST: Use a composable for reusable listeners
function useWindowEvent(event: string, handler: EventListener) {
    onMounted(() => window.addEventListener(event, handler))
    onUnmounted(() => window.removeEventListener(event, handler))
}
```

### Template Refs (not DOM queries)

```typescript
// CORRECT: Use template refs
const inputRef = ref<HTMLInputElement | null>(null)
// <input ref="inputRef" />
onMounted(() => inputRef.value?.focus())

// WRONG: Direct DOM queries
onMounted(() => document.querySelector("#my-input")?.focus())
```

### Props Typing

```typescript
// CORRECT: Full TypeScript interface
interface Props {
    title: string
    items: Item[]
    onSelect: (item: Item) => void
    variant?: "primary" | "secondary"
}

// WRONG: Untyped or Function type
defineProps({ onSelect: Function, items: Array })
```

### v-memo for Expensive Lists

```vue
<!-- Skip re-rendering list items that haven't changed -->
<div v-for="item in items" :key="item.id" v-memo="[item.id, item.updated]">
    <ExpensiveComponent :data="item" />
</div>
```

### v-once for Static Content

```vue
<!-- Render once, skip all future updates -->
<div v-once>
    <h1>{{ title }}</h1>
    <p>{{ staticDescription }}</p>
</div>
```

## Error Handling

### Composables

```typescript
export function useData<T>(url: string) {
    const data = ref<T | null>(null)
    const error = ref<string | null>(null)
    const loading = ref(true)

    onMounted(async () => {
        try {
            data.value = await $fetchApi(url)
        } catch (e) {
            error.value = e instanceof Error ? e.message : "Failed to load"
            console.error(`[useData] ${url}:`, e)
        } finally {
            loading.value = false
        }
    })

    return { data, error, loading }
}
```

### Vue Error Boundaries

```vue
<template>
    <Suspense>
        <template #default><AsyncComponent /></template>
        <template #fallback><LoadingSkeleton /></template>
    </Suspense>
</template>
```

## Common Gotchas

1. **Don't forget `client:` directive** — Vue components without it won't hydrate
2. **Use `set:html` sparingly** — only for trusted HTML content, never user input
3. **`$spacer` is 1rem** — always use `calc($spacer * N)`, never raw rem/px
4. **Image optimization** — dev mode needs `NO_IMAGE_OPTIM=true` env var
5. **`:global()` in scoped styles** — use when you need to style slotted/child component content
6. **`transition:persist`** — only for elements that should survive page navigation (header, etc.)
7. **Clean up listeners** — every `addEventListener` in `onMounted` needs a matching `removeEventListener` in `onUnmounted`
8. **Use template refs** — never `document.querySelector` in Vue components
9. **Image dimensions** — always unitless (`width="800"` not `width="800px"`)
10. **`client:load` is expensive** — default to `client:idle` unless above-fold and interactive

For detailed patterns, see:
- [component-patterns.md](component-patterns.md) — Full component examples
- [styling-reference.md](styling-reference.md) — Complete SCSS/CSS reference
- [anti-patterns.md](anti-patterns.md) — What NOT to do (with real examples from the codebase)