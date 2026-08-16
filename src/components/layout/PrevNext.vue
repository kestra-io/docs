<template>
    <div v-if="prev || next" class="docs-prev-next">
        <a v-if="prev" :href="prev.path" class="prev" @click="activeSlug = prev.path">
            <div class="prev-side">
                <ChevronLeft class="chevron" />
                <span class="prev-button-label">
                    Previous
                </span>
            </div>
            <div class="wrapper">
                <span v-if="prev.sidebarTitle" class="title">{{ prev.sidebarTitle }}</span>
                <span class="description">{{ prev.title }}</span>
            </div>
        </a>
        <span v-else />
        <a v-if="next" :href="next.path" class="next" @click="activeSlug = next.path">
            <div class="wrapper">
                <span v-if="next.sidebarTitle" class="title">{{ next.sidebarTitle }}</span>
                <span class="description">{{ next.title }}</span>
            </div>
            <div class="next-side">
                <span class="next-button-label">
                    Next
                </span>
                <ChevronRight class="chevron" />
            </div>
        </a>
    </div>
</template>

<script lang="ts" setup>
    import { upperFirst } from "scule"
    import ChevronLeft from "vue-material-design-icons/ChevronLeft.vue"
    import ChevronRight from "vue-material-design-icons/ChevronRight.vue"
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


    .docs-prev-next {
        display: flex;
        width: 100%;
        margin-top: 3rem;
        background-color: var(--ks-background-secondary);
        border: none;
        border-radius: 12px;
        padding: 4px;
        gap: 1rem;
        justify-content: stretch;
        .wrapper {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        a {
            padding: calc($spacer / 2) $spacer;
            display: flex;
            gap: $spacer;
            align-items: center;
            color: var(--ks-content-secondary);
            font-size: $font-size-sm;
            min-height: 60px;
            .chevron {
                font-size: 16px;
                :deep(svg){
                    bottom:0;
                }
            }
            &.prev {
                border-radius: 8px;
                border: $block-border;
                justify-content: flex-start;
                text-align: left;
                background-color: var(--ks-background-primary);
                flex: 1;
                gap: 1.5rem;
                .wrapper{
                    color: var(--ks-content-primary);
                }

                .prev-side{
                    border-right: $block-border;
                    white-space: nowrap;
                    padding-right: 1.5rem;
                    padding-block: 0.5rem;
                    align-items: center;
                    gap: 1rem;
                    display: flex;
                    .prev-button-label{
                        display: none;
                        @include media-breakpoint-up(md) {
                            display: block;
                        }
                    }
                }
            }
            &.next {
                border-radius: 8px;
                border: $block-border;
                justify-content: flex-end;
                text-align: right;
                background-color: var(--ks-background-primary);
                flex: 1;
                gap: 1.5rem;
                .wrapper{
                    color: var(--ks-content-primary);
                }

                .next-side{
                    border-left: $block-border;
                    white-space: nowrap;
                    padding-left: 1.5rem;
                    padding-block: 0.5rem;
                    align-items: center;
                    gap: 1rem;
                    display: flex;
                    .next-button-label{
                        display: none;
                        @include media-breakpoint-up(md) {
                            display: block;
                        }
                    }
                }
            }
            .title {
                display: block;
                font-weight: bold;
                color: var(--ks-content-primary);
            }
            .directory {
                display: block;
                color: var(--ks-content-secondary);
            }
            &:hover{
                border-color: var(--ks-border-active);
                color: var(--ks-content-color-highlight);
            }
        }
    }
</style>