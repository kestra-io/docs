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
            <span class="label">On this page</span>
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
            <div class="toc-collapse-inner" :inert="collapsed">
                <p class="title d-none d-lg-block">On this page</p>
                <nav aria-label="On this page">
                    <ul class="groups">
                        <li
                            v-for="group in tree"
                            :key="group.id"
                            class="group"
                            :class="{ open: openGroup === group.id }"
                        >
                            <a
                                :href="`#${group.id}`"
                                class="level-1"
                                :class="linkClass(group.id)"
                                :aria-current="
                                    activeId === group.id
                                        ? 'location'
                                        : undefined
                                "
                                @click="onNavigate(group.id)"
                            >
                                <span class="text">{{ group.text }}</span>
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
                                        :href="`#${sub.id}`"
                                        class="level-2"
                                        :class="linkClass(sub.id)"
                                        :aria-current="
                                            activeId === sub.id
                                                ? 'location'
                                                : undefined
                                        "
                                        @click="onNavigate(sub.id)"
                                        >{{ sub.text }}</a
                                    >
                                    <ul v-if="sub.children.length" class="kids">
                                        <li
                                            v-for="kid in sub.children"
                                            :key="kid.id"
                                        >
                                            <a
                                                :href="`#${kid.id}`"
                                                class="level-3"
                                                :class="linkClass(kid.id)"
                                                :aria-current="
                                                    activeId === kid.id
                                                        ? 'location'
                                                        : undefined
                                                "
                                                @click="onNavigate(kid.id)"
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
    import { computed, onMounted, onUnmounted, ref } from "vue"
    import { useMediaQuery } from "@vueuse/core"
    import ChevronUp from "vue-material-design-icons/ChevronUp.vue"
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue"
    import ChevronRight from "vue-material-design-icons/ChevronRight.vue"
    import { buildTocTree, type TocLink } from "./toc"

    const props = defineProps<{ links: TocLink[] }>()

    const tree = computed(() => buildTocTree(props.links))
    const expanded = ref(false)
    const belowLg = useMediaQuery("(max-width: 991.98px)")
    const activeId = ref("")

    const collapsed = computed(() => belowLg.value && !expanded.value)

    const parents = computed(() => {
        const map = new Map<string, { group: string; sub?: string }>()
        for (const group of tree.value) {
            map.set(group.id, { group: group.id })
            for (const sub of group.children) {
                map.set(sub.id, { group: group.id, sub: sub.id })
                for (const kid of sub.children) {
                    map.set(kid.id, { group: group.id, sub: sub.id })
                }
            }
        }
        return map
    })
    const openGroup = computed(
        () => parents.value.get(activeId.value)?.group ?? "",
    )
    const openSub = computed(() => parents.value.get(activeId.value)?.sub ?? "")

    function linkClass(id: string) {
        if (id === activeId.value) return "active"
        if (id === openGroup.value || id === openSub.value) return "trail"
        return ""
    }

    const HEADER_OFFSET = 144

    let frame = 0
    function updateActive() {
        frame = 0
        const threshold = window.scrollY + HEADER_OFFSET
        let current = ""
        for (const link of props.links) {
            const el = document.getElementById(link.id)
            if (!el) continue
            if (el.getBoundingClientRect().top + window.scrollY <= threshold)
                current = link.id
            else break
        }
        activeId.value = current
    }
    function onScroll() {
        if (!frame) frame = requestAnimationFrame(updateActive)
    }

    function onNavigate(id: string) {
        activeId.value = id
        if (belowLg.value) expanded.value = false
    }

    onMounted(() => {
        window.addEventListener("scroll", onScroll, { passive: true })
        updateActive()
    })

    onUnmounted(() => {
        window.removeEventListener("scroll", onScroll)
        if (frame) cancelAnimationFrame(frame)
    })
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

        .toc-collapse-inner {
            overflow: hidden;
            min-height: 0;
        }

        &.open {
            grid-template-rows: 1fr;
        }

        @include media-breakpoint-up(lg) {
            display: block;

            .toc-collapse-inner {
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

        &:hover {
            color: var(--ks-content-link);
        }

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

    @include media-breakpoint-up(lg) {
        .subs,
        .kids {
            display: none;
        }

        .group.open > .subs,
        .subs > li.open > .kids {
            display: block;
        }
    }

    .footer {
        margin-top: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;

        // Astro passes the slot as static HTML, so :slotted() does not match.
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
