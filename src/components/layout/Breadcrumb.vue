<template>
    <nav aria-label="breadcrumb" class="slug">
        <ol class="breadcrumb">
            <li
                v-for="(item, index) in crumbs"
                :key="index" class="breadcrumb-item"
                :class="{ active: index === crumbs.length - 1 && crumbs.length > 1 }"
            >
                <a
                    v-if="item.href"
                    :href="item.href"
                    class="link"
                >
                    {{ item.label }}
                </a>
                <span v-else aria-current="page">{{ item.label }}</span>
            </li>
        </ol>
    </nav>
</template>

<script setup lang="ts">
    import { computed } from "vue"

    interface BreadcrumbItem {
        label: string
        href: string
    }

    const props = defineProps<{
        items?: BreadcrumbItem[]
        slug?: string
        pageList?: string[]
        pageNames?: Record<string, string>
        pageTitle?: string
    }>()

    const crumbs = computed<BreadcrumbItem[]>(() => {
        if (props.items) return props.items

        const segments = props.slug
            ? [...new Set(props.slug.split("/").filter(Boolean))]
            : ["docs"]

        return (segments.length > 0 ? segments : ["docs"]).map((item, index, arr) => {
            const href = "/" + arr.slice(0, index + 1).join("/")
            const isLast = index === arr.length - 1
            const label = isLast && props.pageTitle
                ? props.pageTitle
                : item !== "docs" && props.pageNames?.[href]
                    ? props.pageNames[href]
                    : formatDirectoryName(item)
            return {
                label,
                href: index === 0 || props.pageList?.includes(href) ? href : "",
            }
        })
    })

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
</script>

<style lang="scss" scoped>
    nav.slug {
        white-space: pre-wrap;
        width: 100%;
        font-size: $font-size-sm;
        font-weight: 400;
        margin-inline: auto;
        @include media-breakpoint-up(xxl) {
            max-width: 71.25rem;
        }
        .breadcrumb {
            --bs-breadcrumb-divider: ">";
            --bs-breadcrumb-margin-bottom: 0.5rem;
        }
        .breadcrumb-item {
            a,
            &::before {
                font-size: $font-size-sm;
                color: var(--ks-content-tertiary);
                cursor: pointer;
                &:hover {
                    color: var(--ks-content-secondary) !important;
                }
            }
            &.active,
            &.active a {
                font-size: $font-size-sm;
                font-weight: 700;
                color: var(--ks-content-primary) !important;
            }
        }
        .link {
            text-transform: capitalize;
        }
    }
</style>