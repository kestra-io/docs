<template>
    <nav aria-label="breadcrumb" class="slug">
        <ol class="breadcrumb">
            <li
                v-for="(item, index) in breadcrumb"
                :key="`${item}-${index}`"
                class="breadcrumb-item"
                :class="{ active: index === breadcrumb.length - 1 }"
            >
                <a
                    v-if="index !== breadcrumb.length - 1"
                    :href="breadcrumbLinkExist(index) ? breadcrumbLink(index) : ''"
                    class="link"
                >
                    {{ getDisplayName(item, index) }}
                </a>

                <span v-else aria-current="page">{{ getDisplayName(item, index) }}</span>
            </li>
        </ol>
    </nav>
</template>

<script setup lang="ts">
    import { computed } from "vue"

    const props = defineProps<{
        slug: string
        pageList?: string[]
        pageNames?: Record<string, string>
        pageTitle?: string
    }>()

    const breadcrumb = computed(() => {
        const crumbs = [...new Set(props.slug.split("/").filter(Boolean))]
        return crumbs.length > 0 ? crumbs : ["docs"]
    })

    const breadcrumbLink = (index: number) => "/" + breadcrumb.value.slice(0, index + 1).join("/")

    const breadcrumbLinkExist = (index: number) => index === 0 || props.pageList?.includes(breadcrumbLink(index))

    const formatDirectoryName = (item: string) => {
        const specialCases: Record<string, string> = {
            ui: "UI",
            "ai-tools": "AI Tools",
        }
        return (
            specialCases[item] ||
            item
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
        )
    }

    const getDisplayName = (item: string, index: number) => {
        const key = breadcrumbLink(index)
        if (index === breadcrumb.value.length - 1 && props.pageTitle) {
            return props.pageTitle
        }
        return item !== "docs" && props.pageNames?.[key]
            ? props.pageNames[key]
            : formatDirectoryName(item)
    }
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    nav {
        white-space: pre-wrap;
        width: 100%;
        max-width: 45.8rem;
        font-size: $font-size-sm;
        font-family: $font-family-sans-serif;
        font-weight: 400;
        margin: 0 auto;

        @media only screen and (min-width: 1920px) {
            max-width: 71.25rem;
        }

        .breadcrumb {
            --bs-breadcrumb-divider: ">";
        }

        .breadcrumb-item {
            a,
            &.active,
            &::before {
                color: $black-8;
                cursor: pointer;

                &:hover {
                    color: var(--ks-content-secondary) !important;
                }
            }

            &.active {
                font-weight: 700;
                color: var(--ks-content-primary) !important;
            }
        }

        .link {
            text-transform: capitalize;
        }
    }
</style>