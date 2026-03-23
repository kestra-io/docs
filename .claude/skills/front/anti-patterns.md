# Anti-Patterns — What NOT to Do

Real issues found in this codebase. Avoid repeating them.

## 1. Memory Leaks: Global Event Listeners Without Cleanup

```typescript
// WRONG — overwrites global handler, never cleaned up
window.onscroll = () => {
    // scroll logic
}

// WRONG — addEventListener without cleanup
onMounted(() => {
    window.addEventListener("scroll", handleScroll)
    // no corresponding onUnmounted
})

// CORRECT — always pair with cleanup
const handleScroll = () => { /* ... */ }

onMounted(() => {
    window.addEventListener("scroll", handleScroll)
})

onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll)
})
```

**Found in**: UnlockLine.vue (window.onscroll), BlogToc.vue, Header.vue
**Good example**: Fixed.vue — correctly pairs addEventListener/removeEventListener

## 2. Options API in Vue Components

```vue
// WRONG — Options API
<script>
export default {
    props: {
        title: String,
        items: Array
    },
    data() {
        return { active: false }
    },
    methods: {
        toggle() { this.active = !this.active }
    }
}
</script>

// CORRECT — Composition API
<script setup lang="ts">
interface Props {
    title: string
    items: Item[]
}

const props = defineProps<Props>()
const active = ref(false)
const toggle = () => { active.value = !active.value }
</script>
```

**Found in**: RetailOps.vue, DetailsHero.vue, UnlockLine.vue, CustomerStory.vue, Section.vue

## 3. DOM Queries Instead of Template Refs

```typescript
// WRONG — direct DOM queries
onMounted(() => {
    const input = document.querySelector("#search-input") as HTMLInputElement
    input?.focus()

    const btn = document.getElementById("header-search-button")
    btn?.addEventListener("click", open)
})

// CORRECT — template refs
const inputRef = ref<HTMLInputElement | null>(null)
const btnRef = ref<HTMLButtonElement | null>(null)

onMounted(() => {
    inputRef.value?.focus()
})
```

```vue
<template>
    <input ref="inputRef" />
    <button ref="btnRef">Search</button>
</template>
```

**Found in**: Search.vue (querySelector, getElementById)

## 4. Overusing client:load

```astro
<!-- WRONG — carousel is below the fold, doesn't need immediate load -->
<Carousel client:load :items={items} />
<Quotes client:load :quotes={quotes} />
<BlogGrid client:load :posts={posts} />

<!-- CORRECT — use client:idle or client:visible for below-fold -->
<Carousel client:idle :items={items} />
<Quotes client:idle :quotes={quotes} />
<BlogGrid client:idle :posts={posts} />

<!-- CORRECT — client:load only for above-fold interactive elements -->
<Header client:load transition:persist />
<Search client:load transition:persist />
```

**Found in**: BlogList.astro, CustomerQuotes.astro, BlueprintsCarousel.astro, BlueprintsGrid.astro, DataTestimonial.astro

## 5. Hardcoded Pixel Values

```scss
// WRONG — arbitrary px values
.hero {
    padding: 140px 1rem;
    width: 352.83px;
    height: 343.43px;
    gap: 10px;
    margin-right: 1rem;
}

// CORRECT — use $spacer scale and CSS variables
.hero {
    padding: calc($spacer * 8) $spacer;
    width: 100%;
    max-width: calc($spacer * 22);
    gap: calc($spacer * 0.625);
    margin-right: $spacer;
}
```

**Found in**: AIFeat.astro, Any.astro, TopHero.astro, BlogSocials.vue, RetailOps.vue

## 6. Image Dimensions with Units

```html
<!-- WRONG — px units in width/height attributes -->
<img src="/icon.svg" width="69px" height="69px" />
<img src="/logo.svg" width="24px" height="24px" />

<!-- CORRECT — unitless values (pixels are implied) -->
<img src="/icon.svg" width="69" height="69" alt="Icon" />
<img src="/logo.svg" width="24" height="24" alt="Logo" />
```

**Found in**: RetailOps.vue, Header.vue

## 7. Hybrid Script Setup

```vue
<!-- WRONG — mixing both script blocks with conflicting patterns -->
<script>
export default {
    name: "MyComponent"
}
</script>

<script setup lang="ts">
// setup logic here
</script>

<!-- CORRECT — single script setup, use defineOptions for name -->
<script setup lang="ts">
defineOptions({ name: "MyComponent" })
// all logic here
</script>
```

**Found in**: Search.vue (has both `<script setup>` and `<script>` blocks)

## 8. Untyped Props

```typescript
// WRONG — loose types
defineProps({
    onSelect: Function,        // What signature?
    items: Array,              // Array of what?
    config: Object,            // What shape?
})

// CORRECT — explicit TypeScript interfaces
interface Props {
    onSelect: (item: Item) => void
    items: Item[]
    config: { theme: string; debug: boolean }
}

defineProps<Props>()
```

## 9. v-html Without Trust Assessment

```vue
<!-- CAUTION — assess trust before using v-html -->

<!-- OK: Static SVG from build-time config -->
<span v-html="iconSvg" />

<!-- OK: Markdown-rendered content from content collection -->
<div v-html="renderedHtml" />

<!-- DANGER: API response content — could contain injected scripts -->
<div v-html="apiResponse.description" />

<!-- SAFE ALTERNATIVE: Use text interpolation -->
<p>{{ apiResponse.description }}</p>
```

## 10. Missing Error Handling in Composables

```typescript
// WRONG — no error handling, failures silently break UI
export function useData(url: string) {
    const data = ref(null)
    onMounted(async () => {
        data.value = await $fetchApi(url)
    })
    return { data }
}

// CORRECT — handle errors, expose loading state
export function useData<T>(url: string) {
    const data = ref<T | null>(null)
    const error = ref<string | null>(null)
    const loading = ref(true)

    onMounted(async () => {
        try {
            data.value = await $fetchApi(url)
        } catch (e) {
            error.value = e instanceof Error ? e.message : "Failed to load"
        } finally {
            loading.value = false
        }
    })

    return { data, error, loading }
}
```
