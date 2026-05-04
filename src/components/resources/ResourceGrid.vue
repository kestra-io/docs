<template>
    <div class="contain">
        <Tabs
            v-model="activeTag"
            :categories="resourceTabs"
            root-href="/resources"
            class="m-0 mb-4"
        />

        <div v-if="filteredResources.length" class="grid mb-5">
            <ResourceCard
                v-for="(resource, index) in filteredResources"
                :key="resource.path"
                :resource="resource"
                :class="{ hidden: index >= visibleCount }"
            />
        </div>
        <p v-else class="empty">
            No resources match your search.
        </p>

        <div
            v-if="filteredResources.length > visibleCount"
            class="text-center my-5"
        >
            <button @click="showMore" class="btn btn-secondary">
                Show more
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue"
    import Tabs from "~/components/common/Tabs.vue"
    import ResourceCard from "./ResourceCard.vue"
    import {
        ALL_RESOURCES,
        resourceTabs,
        type ResourceTag,
    } from "./tags"

    const props = defineProps<{
        resources: {
            path: string
            title: string
            description?: string
            tag: ResourceTag
            image?: string
            date?: string
        }[]
        slug: string
    }>()

    const activeTag = ref(props.slug || ALL_RESOURCES)
    const visibleCount = ref(9)
    const searchQuery = ref("")

    const matchesSearch = (resource: (typeof props.resources)[number]) => {
        const q = searchQuery.value.trim().toLowerCase()
        if (!q) return true
        return (
            resource.title.toLowerCase().includes(q) ||
            (resource.description?.toLowerCase().includes(q) ?? false) ||
            resource.tag.toLowerCase().includes(q)
        )
    }

    const filteredResources = computed(() => {
        const byTag =
            activeTag.value === ALL_RESOURCES
                ? props.resources
                : props.resources.filter((r) => r.tag === activeTag.value)
        return byTag.filter(matchesSearch)
    })

    watch(
        () => props.slug,
        (newSlug) => {
            activeTag.value = newSlug || ALL_RESOURCES
        },
    )

    watch(activeTag, () => {
        const target =
            activeTag.value === ALL_RESOURCES
                ? "/resources"
                : `/resources/${activeTag.value}`
        window.history.pushState(null, "", target)
    })

    const showMore = () => {
        visibleCount.value += 9
    }

    const handleSearch = (e: Event) => {
        const detail = (e as CustomEvent<string>).detail ?? ""
        searchQuery.value = detail
    }

    onMounted(() => {
        const initial = new URL(window.location.href).searchParams.get("q")
        if (initial) searchQuery.value = initial
        window.addEventListener("resources-search", handleSearch)
    })

    onBeforeUnmount(() => {
        window.removeEventListener("resources-search", handleSearch)
    })
</script>

<style lang="scss" scoped>
    .contain {
        width: 100%;
    }

    .grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;

        @include media-breakpoint-up(md) {
            grid-template-columns: repeat(2, 1fr);
        }

        @include media-breakpoint-up(xl) {
            grid-template-columns: repeat(3, 1fr);
        }

        .hidden {
            display: none;
        }
    }

    .empty {
        color: var(--ks-content-secondary);
        font-size: $font-size-sm;
        text-align: center;
        padding: 3rem 0;
    }
</style>
