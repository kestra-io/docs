<template>
    <div v-if="prev || next" class="docs-prev-next">
        <a v-if="prev" :href="prev.path" class="prev" @click="activeSlug = prev.path">
            <ArrowLeft />
            <div class="wrapper">
                <span v-if="directory(prev.path)" class="directory">{{ directory(prev.path) }}</span>
                <span class="title">{{ prev.title }}</span>
            </div>
        </a>
        <span v-else />
        <a v-if="next" :href="next.path" class="next" @click="activeSlug = next.path">
            <div class="wrapper">
                <span v-if="directory(next.path)" class="directory">{{ directory(next.path) }}</span>
                <span class="title">{{ next.title }}</span>
            </div>
            <ArrowRight />
        </a>
    </div>
</template>

<script lang="ts" setup>
    import { upperFirst } from "scule"
    import ArrowLeft from "vue-material-design-icons/ArrowLeft.vue"
    import ArrowRight from "vue-material-design-icons/ArrowRight.vue"
    import { prevNext, type NavItem } from "~/utils/navigation"
    import { activeSlug } from "~/utils/store"

    const props = defineProps<{
        navigation: NavItem[]
        currentPath: string
    }>()

    const { prev, next } = prevNext(props.navigation, props.currentPath)

    function directory(link?: string) {
        if (!link) return ""

        const dirs = link.split("/")
        const dir = dirs[Math.max(1, dirs.length - 2)]
        if (!dir) return ""

        const specialCases: Record<string, string> = { ui: "UI", "ai-tools": "AI Tools" }
        return specialCases[dir] || dir.split("-").map(upperFirst).join(" ")
    }
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .docs-prev-next {
        display: flex;
        width: 100%;
        margin-top: 3rem;
        .wrapper {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        a {
            border: $block-border;
            background-color: var(--ks-background-secondary);
            padding: calc($spacer / 2) $spacer;
            display: flex;
            gap: $spacer;
            border-radius: var(--bs-border-radius);
            width: 50%;
            align-items: center;
            .material-design-icon {
                color: var(--ks-content-color-highlight);
            }
            &.prev {
                margin-right: calc($spacer / 2);
            }
            &.next {
                margin-left: calc($spacer / 2);
                justify-content: flex-end;
                text-align: right;
            }
            .title {
                display: block;
                font-weight: bold;
                color: var(--ks-content-primary);
                font-size: $font-size-sm;
            }
            .directory {
                display: block;
                color: var(--ks-content-secondary);
                font-size: $font-size-sm;
            }
        }
    }
</style>