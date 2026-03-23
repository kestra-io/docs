# Component Patterns Reference

## Section Component Pattern

The most common pattern — wrapping content in a themed section:

```astro
---
import Section from "~/components/layout/Section.astro"
---

<Section
    subtitle="Our Features"
    title="Build powerful workflows"
    baseline="Everything you need to orchestrate your data pipelines."
    class="features-section"
>
    <!-- Section content here -->
</Section>
```

## Card Pattern

Cards follow a consistent structure:

```astro
---
interface Props {
    title: string
    description?: string
    href?: string
    icon?: string
}

const { title, description, href, icon } = Astro.props
---

<a href={href} class="card">
    {icon && <div class="card-icon"><img src={icon} alt="" /></div>}
    <h3>{title}</h3>
    {description && <p>{description}</p>}
</a>

<style lang="scss">
    .card {
        display: flex;
        flex-direction: column;
        gap: calc($spacer / 2);
        padding: calc($spacer * 1.5);
        border-radius: $border-radius-lg;
        background: var(--ks-background-body);
        border: 1px solid var(--ks-border-color);
        text-decoration: none;
        transition: border-color 0.2s ease;

        &:hover {
            border-color: var(--ks-content-color-highlight);
        }

        h3 {
            color: var(--ks-content-primary);
            font-size: $font-size-lg;
            font-weight: 600;
            margin: 0;
        }

        p {
            color: var(--ks-content-secondary);
            font-size: $font-size-md;
            margin: 0;
        }
    }
</style>
```

## Grid Layout Pattern

```astro
<div class="container-xl bd-gutter">
    <div class="row g-4">
        {items.map(item => (
            <div class="col-12 col-md-6 col-lg-4">
                <Card {...item} />
            </div>
        ))}
    </div>
</div>
```

## Hero Pattern

```astro
---
import TopHero from "~/components/layout/TopHero.astro"
---

<TopHero>
    <Fragment slot="title">
        <h1 data-usal="fade-l">Page Title</h1>
    </Fragment>
    <p data-usal="fade-r">Hero description text.</p>
    <Fragment slot="cta">
        <a href="/docs" class="btn btn-primary">Get Started</a>
    </Fragment>
</TopHero>
```

## Docs Page Pattern

```astro
---
import DocsLayout from "~/components/layouts/DocsLayout.astro"
import { getCollection } from "astro:content"

const docs = await getCollection("docs")
const entry = docs.find(e => e.id === "quickstart")
const { Content, headings } = await entry.render()
---

<DocsLayout activeStem="getting-started" pageTitle={entry.data.title}>
    <Fragment slot="headings">{headings}</Fragment>
    <Content />
</DocsLayout>
```

## Vue Interactive Component Pattern

When you need client-side interactivity:

```astro
---
// In the Astro page/component
import FilterBar from "~/components/features/FilterBar.vue"
---

<!-- client:idle because it's not critical for first paint -->
<FilterBar
    client:idle
    :items={JSON.stringify(items)}
    initial-filter="all"
/>
```

```vue
<!-- FilterBar.vue -->
<template>
    <div class="filter-bar">
        <button
            v-for="filter in filters"
            :key="filter"
            :class="{ active: activeFilter === filter }"
            @click="activeFilter = filter"
        >
            {{ filter }}
        </button>
        <div class="results">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"

interface Props {
    items: string // JSON string from Astro
    initialFilter?: string
}

const props = withDefaults(defineProps<Props>(), {
    initialFilter: "all",
})

const activeFilter = ref(props.initialFilter)
const parsedItems = computed(() => JSON.parse(props.items))
const filters = computed(() => ["all", ...new Set(parsedItems.value.map(i => i.category))])
</script>

<style lang="scss" scoped>
.filter-bar {
    display: flex;
    gap: calc($spacer / 2);

    button {
        padding: calc($spacer / 4) $spacer;
        border-radius: $border-radius;
        border: 1px solid var(--ks-border-color);
        background: transparent;
        color: var(--ks-content-secondary);
        cursor: pointer;

        &.active {
            background: var(--ks-content-color-highlight);
            color: white;
            border-color: var(--ks-content-color-highlight);
        }
    }
}
</style>
```

## Composable Pattern

```typescript
// src/composables/usePluginsCount.ts
import { ref, onMounted } from "vue"
import { $fetchApi } from "~/utils/fetch"

export function usePluginsCount() {
    const count = ref(0)
    const loading = ref(true)

    onMounted(async () => {
        try {
            const data = await $fetchApi("/plugins/count")
            count.value = data.count
        } finally {
            loading.value = false
        }
    })

    return { count, loading }
}
```

## Content Collection Query Pattern

```typescript
import { getCollection } from "astro:content"

// Get all docs
const allDocs = await getCollection("docs")

// Filter by field
const ossDocs = allDocs.filter(doc =>
    doc.data.editions?.includes("OSS")
)

// Sort by date (blogs)
const blogs = await getCollection("blogs")
const sorted = blogs.sort((a, b) =>
    b.data.date.getTime() - a.data.date.getTime()
)

// Render content
const { Content, headings } = await entry.render()
```
