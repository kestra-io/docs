<script setup lang="ts">
    import { h } from "vue"
    import type { NavigationItem } from "~/utils/getNavigationTree"

    const props = defineProps<{
        max?: number | undefined
        navigation?: NavigationItem[] | null
    }>()

    type RecursiveProps = {
        items: NavigationItem[]
        level?: number
        max?: number | undefined
    }

    const RecursiveLinks = (p: RecursiveProps): import("vue").VNodeChild =>
        h(
            "ul",
            p.level ? { "data-level": p.level } : null,
            (p.items ?? []).map((link) => {
                const level = p.level ?? 0
                const hasChildren =
                    link.children &&
                    (p.max === undefined || level < p.max) &&
                    (link.children.length > 1 ||
                        (link.children.length === 1 && link.children[0].path !== link.path))

                if (hasChildren) {
                    return h("li", null, [
                        h("a", { href: link.path }, link.sidebarTitle || link.title),
                        RecursiveLinks({
                            items: link.children!,
                            level: level + 1,
                            max: p.max,
                        }),
                    ])
                }

                return h("li", null, h("a", { href: link.path }, link.sidebarTitle || link.title))
            }),
        )
</script>

<template>
    <slot v-if="$slots.default" :navigation="props.navigation" :max="props.max" />
    <template v-else>
        <RecursiveLinks :items="props.navigation ?? []" :level="0" :max="props.max" />
    </template>
</template>