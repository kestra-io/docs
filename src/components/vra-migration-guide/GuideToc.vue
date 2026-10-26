<template>
    <div class="guide-toc">
        <button
            class="btn toggle d-lg-none"
            :class="{ collapsed: !expanded }"
            type="button"
            :aria-expanded="expanded"
            aria-controls="guideTocContents"
            @click="expanded = !expanded"
        >
            <span>On this page</span>
            <span class="chevron" aria-hidden="true">
                <ChevronUp v-if="expanded" />
                <ChevronDown v-else />
            </span>
        </button>

        <div
            id="guideTocContents"
            class="toc-collapse"
            :class="{ open: expanded }"
        >
            <div class="inner" :inert="collapsed">
                <p class="title d-none d-lg-block">On this page</p>
                <nav aria-label="On this page">
                    <ul class="groups">
                        <li
                            v-for="group in toc.tree"
                            :key="group.id"
                            :class="{ open: openGroup === group.id }"
                        >
                            <a
                                v-bind="link(group.id)"
                                class="level-1"
                                @click.prevent="onNavigate(group.id)"
                            >
                                <span>{{ group.text }}</span>
                                <span class="chevron" aria-hidden="true">
                                    <ChevronDown
                                        v-if="openGroup === group.id"
                                    />
                                    <ChevronRight v-else />
                                </span>
                            </a>
                            <ul v-if="group.children.length" class="subs">
                                <li
                                    v-for="sub in group.children"
                                    :key="sub.id"
                                    :class="{ open: openSub === sub.id }"
                                >
                                    <a
                                        v-bind="link(sub.id)"
                                        class="level-2"
                                        @click.prevent="onNavigate(sub.id)"
                                        >{{ sub.text }}</a
                                    >
                                    <ul v-if="sub.children.length" class="kids">
                                        <li
                                            v-for="kid in sub.children"
                                            :key="kid.id"
                                        >
                                            <a
                                                v-bind="link(kid.id)"
                                                class="level-3"
                                                @click.prevent="
                                                    onNavigate(kid.id)
                                                "
                                                >{{ kid.text }}</a
                                            >
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>
                <div v-if="$slots.footer" class="footer">
                    <slot name="footer" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from "vue"
    import ChevronUp from "vue-material-design-icons/ChevronUp.vue"
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue"
    import ChevronRight from "vue-material-design-icons/ChevronRight.vue"
    import { useTocCollapse } from "~/composables/useTocCollapse"
    import { useTocScrollSpy } from "~/composables/useTocScrollSpy"
    import type { TocLink } from "~/utils/plugins/types"

    type TocNode = TocLink & { children: TocNode[] }

    const props = defineProps<{ links: TocLink[] }>()

    /** h2 > h3 > h4 tree, and the group and sub each link opens, in one pass. */
    const toc = computed(() => {
        const tree: TocNode[] = []
        const parents = new Map<string, { group: string; sub?: string }>()
        let group: TocNode | undefined
        let sub: TocNode | undefined
        for (const link of props.links) {
            const node = { ...link, children: [] }
            if (link.depth <= 2 || !group) {
                tree.push((group = node))
                sub = undefined
            } else if (link.depth === 3 || !sub) {
                group.children.push((sub = node))
            } else {
                sub.children.push(node)
            }
            parents.set(link.id, { group: group.id, sub: sub?.id })
        }
        return { tree, parents }
    })
    const { expanded, collapsed, close } = useTocCollapse()
    const { activeId, navigateTo } = useTocScrollSpy(
        () => props.links.map((link) => link.id),
        { container: ".guide-toc .inner" },
    )

    const openGroup = computed(
        () => toc.value.parents.get(activeId.value)?.group ?? "",
    )
    const openSub = computed(
        () => toc.value.parents.get(activeId.value)?.sub ?? "",
    )

    function link(id: string) {
        const active = id === activeId.value
        const trail = id === openGroup.value || id === openSub.value
        return {
            href: `#${id}`,
            class: active ? "active" : trail ? "trail" : "",
            "aria-current": active ? ("location" as const) : undefined,
        }
    }

    function onNavigate(id: string) {
        navigateTo(id)
        close()
    }
</script>

<style lang="scss" scoped>
    .title {
        margin-bottom: 0.5rem;
        font-weight: 600;
        font-size: $font-size-lg;
        line-height: 1.75rem;
        color: var(--ks-content-primary);
    }

    .toggle {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid var(--ks-border-secondary);
        border-radius: 8px;
        background: var(--ks-background-body);
        color: var(--ks-content-primary);
        font-size: $font-size-sm;
        font-weight: 600;
        margin-bottom: 1rem;

        &.collapsed {
            margin-bottom: 0;
        }

        .chevron {
            display: flex;
            align-items: center;
            font-size: 1.25rem;
            color: var(--ks-content-secondary);
        }
    }

    .toc-collapse {
        display: grid;
        grid-template-rows: 0fr;
        transition: grid-template-rows 0.25s ease;

        .inner {
            overflow: hidden;
            min-height: 0;
        }

        &.open {
            grid-template-rows: 1fr;
        }

        @include media-breakpoint-up(lg) {
            display: block;

            .inner {
                max-height: calc(100vh - 140px - var(--announce-height, 0px));
                overflow-y: auto;
                padding-right: 0.25rem;
            }
        }
    }

    ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .groups {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    a {
        display: block;
        color: var(--ks-content-secondary);
        text-decoration: none;
        font-size: $font-size-sm;
        line-height: 1.25rem;

        &:hover,
        &.trail,
        &.active {
            color: var(--ks-content-link);
        }
    }

    .level-1 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.25rem;
        font-size: $font-size-md;
        line-height: 1.5rem;
        color: var(--ks-content-primary);

        .chevron {
            display: flex;
            flex-shrink: 0;
            align-items: center;
            font-size: 1rem;
            color: var(--ks-content-secondary);
        }
    }

    .subs,
    .kids {
        margin: 0 0.6875rem;
        border-left: 1px solid var(--ks-border-secondary);

        @include media-breakpoint-up(lg) {
            display: none;

            .open > & {
                display: block;
            }
        }
    }

    .kids {
        margin: 0 0 0 0.9375rem;
    }

    .level-2,
    .level-3 {
        padding: 0.25rem 0.75rem 0.25rem 0.9375rem;
    }

    .level-3 {
        font-size: $font-size-xs;
    }

    .footer {
        margin-top: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;

        :deep(.btn) {
            width: 100%;
            padding: 0.5rem 1.25rem;
            font-size: $font-size-lg;
            line-height: 1.75rem;
        }

        :deep(a:not(.btn)) {
            color: var(--ks-content-link);
            font-size: $font-size-sm;
            line-height: 1.25rem;
            text-align: center;
            text-decoration: underline;
        }
    }
</style>
