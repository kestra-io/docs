<template>
    <div v-if="prev || next" class="docs-prev-next mt-5">
        <a v-if="prev" :href="prev.path" class="prev" @click="navigateTo(prev.path)">
            <ArrowLeft />
            <div class="wrapper">
                <span v-if="directory(prev.path)" class="directory">
                    {{ directory(prev.path) }}
                </span>
                <span class="title">{{ prev.title }}</span>
            </div>
        </a>

        <span v-else />

        <a v-if="next" :href="next.path" class="next" @click="navigateTo(next.path)">
            <div class="wrapper">
                <span v-if="directory(next.path)" class="directory">
                    {{ directory(next.path) }}
                </span>
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
        const directory = dirs[Math.max(1, dirs.length - 2)]
        if (!directory) return ""

        const specialCases: Record<string, string> = { ui: "UI", "ai-tools": "AI Tools" }
        return specialCases[directory] || directory.split("-").map(upperFirst).join(" ")
    }

    function navigateTo(path?: string) {
        if (!path) return
        activeSlug.value = path
    }
</script>

<style lang="scss">
    @import "~/assets/styles/variable";

    .docs-prev-next {
        display: flex;
        width: 100%;

        .wrapper {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .title {
            font-size: $font-size-sm;
        }

        a {
            border: $block-border;
            background-color: $black-2;
            padding: calc($spacer/2) calc($spacer);
            display: flex;
            gap: $spacer;
            border-radius: var(--bs-border-radius);
            width: 50%;

            &.prev {
                margin-right: calc($spacer / 2);
                .material-design-icon {
                    color: $purple-36;
                }
            }

            &.next {
                margin-left: calc($spacer / 2);
                .material-design-icon {
                    color: $purple-36;
                }
            }

            div {
                flex-grow: 2;
                span {
                    display: block;

                    &.title {
                        font-weight: bold;
                        color: $purple-36;
                    }

                    &.directory {
                        color: $white-1;
                        font-size: $font-size-sm;
                    }
                }
            }
        }
    }
</style>