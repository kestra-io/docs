<template>
    <aside class="bd-sidebar scroller">
        <div>
            <button
                class="btn d-lg-none mt-2"
                type="button"
                :aria-expanded="menuExpanded"
                aria-controls="docs-menu"
                @click="menuExpanded = !menuExpanded"
            >
                <Menu /> Documentation Menu
            </button>
            <div v-if="versionOptions.length > 1" class="version-switcher">
                <span class="docs-label">Docs</span>
                <span class="separator" aria-hidden="true">·</span>
                <span class="current-version">{{ displayedVersion }}</span>
                <ChevronDown class="caret" aria-hidden="true" />
                <!-- The native select is laid over the label, invisible: it
                     keeps the keyboard and the system menu on every platform. -->
                <select
                    id="docs-version"
                    aria-label="Documentation version"
                    @change="onVersionChange"
                >
                    <option
                        v-for="option in versionOptions"
                        :key="option.label"
                        :value="option.version"
                        :selected="option.selected"
                    >
                        {{ option.label }}
                    </option>
                </select>
            </div>
            <div
                class="search"
                data-modal-target="#search-modal"
                title="Search"
            >
                <div class="input-group">
                    <div class="input-icon">
                        <span class="input-group-text">
                            <Magnify />
                        </span>
                        <p>{{ currentVersion ? `Search (${currentVersion})` : "Search" }}</p>
                    </div>
                    <div class="align-items-center d-flex input-group-append">
                        <Keyboard />
                        <span class="command">Ctrl + K</span>
                    </div>
                </div>
            </div>
            <div
                class="bd-menu-collapse"
                :class="{ open: menuExpanded }"
                id="docs-menu"
            >
                <div class="bd-menu-collapse-inner" :inert="collapsed">
                <nav class="bd-links w-100" id="bd-docs-nav" aria-label="Docs navigation">
                    <ul class="list-unstyled mb-0">
                        <RecursiveNavSidebar
                            v-for="item in items"
                            :key="item.path"
                            :parent-slug="'/' + type"
                            :type="type"
                            :item="item"
                            :depth-level="0"
                            :disabled-pages="disabledPages"
                        />
                    </ul>
                </nav>
                </div>
            </div>
        </div>
    </aside>
</template>

<script lang="ts" setup>
    import { computed, provide, ref, watch, type PropType } from "vue"
    import { useMediaQuery } from "@vueuse/core"
    import Magnify from "vue-material-design-icons/Magnify.vue"
    import Keyboard from "vue-material-design-icons/Keyboard.vue"
    import Menu from "vue-material-design-icons/Menu.vue"
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue"
    import RecursiveNavSidebar, {
        closeSidebarInjectionKey,
        type NavigationItem,
    } from "~/components/docs/RecursiveNavSidebar.vue"
    import { activeSlug } from "~/utils/store"
    import { versionSelectOptions, resolveVersionSwitchHref } from "~/utils/versionedDocs"

    const props = defineProps({
        type: {
            type: String,
            required: true,
        },
        navigation: {
            type: Object as PropType<{ children: NavigationItem[] }[]>,
        },
        slug: {
            type: String,
        },
        /** MAJOR.MINOR of the current GA release (e.g. "1.3"), unset if unavailable. */
        latestVersion: {
            type: String,
            default: undefined,
        },
        // No `default: () => []` here: combining a factory default with an
        // array PropType breaks this component's inferred type for TS
        // consumers (astro check reports the whole module as having "no
        // default export"). Default to [] at the read site instead.
        knownVersions: {
            type: Array as PropType<string[]>,
        },
        /** Version label of the page being viewed (e.g. "1.2"), unset on the latest docs. */
        currentVersion: {
            type: String,
            default: undefined,
        },
    })

    const versionOptions = computed(() =>
        versionSelectOptions(props.latestVersion, props.knownVersions ?? [], props.currentVersion ?? null),
    )

    const displayedVersion = computed(() => props.currentVersion ?? props.latestVersion)

    // Though `transition:persist`ed, this island's props DO refresh on
    // client-side navigations (persist-props defaults to false; verified on a
    // prod build). The URL read is simply the same value without depending on
    // prop-update timing mid-transition. Full navigation on purpose: versioned
    // targets are served by the middleware, outside the prerendered routes.
    // The probe makes this async: only the most recent selection may navigate,
    // or a slower earlier probe would win the location assignment.
    let switchSeq = 0
    const onVersionChange = async (event: Event) => {
        const version = (event.target as HTMLSelectElement).value
        const seq = ++switchSeq
        const href = await resolveVersionSwitchHref(version, window.location.pathname)
        if (seq === switchSeq) {
            window.location.href = href
        }
    }

    watch(
        () => props.slug,
        (slug) => {
            activeSlug.value = slug || ""
        },
        { immediate: true },
    )

    const disabledPages = [
        "/docs/terraform/data-sources",
        "/docs/terraform/guides",
        "/docs/terraform/resources",
    ]

    const menuExpanded = ref(false)

    // `overflow: hidden` on the 0fr grid clips the panel but leaves its links
    // focusable, where bootstrap's `.collapse` was `display: none`. Above lg
    // the panel is always shown and `menuExpanded` stays false, so the
    // viewport has to be part of the condition or the desktop sidebar goes
    // inert.
    const belowLg = useMediaQuery("(max-width: 991.98px)")
    const collapsed = computed(() => belowLg.value && !menuExpanded.value)

    const closeSidebar = () => {
        if (window.innerWidth < 992) menuExpanded.value = false
    }

    provide(closeSidebarInjectionKey, closeSidebar)

    const items = computed(() => props.navigation?.[0]?.children ?? [])
</script>

<style lang="scss" scoped>


    .bd-sidebar {
        &::-webkit-scrollbar-thumb {
            border-radius: 5px;
            background: var(--ks-border-primary);
        }
        @include media-breakpoint-up(lg) {
            margin-top: 4rem;
            position: sticky;
            top: calc(8rem + var(--announce-height));
            display: block !important;
            height: fit-content;
            max-height: calc(100vh - 9rem);
            padding-left: 0.25rem;
            margin-left: -0.25rem;
            overflow-y: auto;
            overflow-x: hidden;
            padding-right: calc($spacer / 4);
            min-width: 250px;
        }
        button.btn {
            border: 1px solid var(--ks-gray-300);
            font-weight: bold;
            width: 100%;
            color: var(--ks-content-primary);
            @include media-breakpoint-down(lg) {
                background-color: var(--ks-background-primary);
                font-size: $font-size-sm;
                border-radius: 0.5rem;
                border: $block-border;
                :deep(.material-design-icon__svg) {
                    path {
                        color: var(--ks-content-primary);
                    }
                }
            }
        }
        // Height transition without JS: 0fr to 1fr on a single-row grid.
        .bd-menu-collapse {
            display: grid;
            grid-template-rows: 0fr;
            transition: grid-template-rows 0.25s ease;

            .bd-menu-collapse-inner {
                overflow: hidden;
                min-height: 0;
            }

            &.open {
                grid-template-rows: 1fr;
            }

            @include media-breakpoint-down(lg) {
                nav {
                    padding: calc($spacer / 2) $spacer;
                    border: $block-border;
                    box-shadow: $box-shadow-sm;
                    border-radius: $border-radius;
                }
            }
            @include media-breakpoint-up(lg) {
                // Above the breakpoint the panel is always open and never
                // animates, so the grid wrapper and its inner div drop out of
                // the box model entirely. Leaving them as boxes shifts the
                // sidebar ~8px (grid suppresses the margin collapse main
                // relied on) and changes where its max-height clips.
                display: contents;

                .bd-menu-collapse-inner {
                    display: contents;
                }
            }
        }
        .search {
            min-width: 209px;
            width: 98%;
            height: 32px;
            @include media-breakpoint-down(lg) {
                width: 100%;
                margin-top: $spacer;
            }
        }
        .version-switcher {
            position: relative;
            display: inline-flex;
            align-items: center;
            gap: calc($spacer * 0.375);
            margin-bottom: calc($spacer * 0.75);
            font-size: $font-size-base;
            color: var(--ks-content-tertiary);
            @include media-breakpoint-down(lg) {
                margin-top: $spacer;
            }
            .current-version {
                color: var(--ks-content-primary);
                font-weight: 600;
            }
            .caret {
                display: inline-flex;
                transition: color 0.2s ease;
            }
            select {
                position: absolute;
                inset: 0;
                width: 100%;
                opacity: 0;
                cursor: pointer;
            }
            &:hover .caret,
            &:focus-within .caret {
                color: var(--ks-content-primary);
            }
            &:has(select:focus-visible) {
                outline: 2px solid var(--ks-border-active);
                outline-offset: 2px;
                border-radius: calc($spacer * 0.25);
            }
        }
        .search {
            padding: calc($spacer * 0.3) calc($spacer * 0.8);
            gap: 8px;
            border-radius: calc($spacer * 0.25);
            background-color: var(--ks-background-secondary);
            border: $block-border;
            margin-bottom: $spacer;
            cursor: pointer;
            &:hover {
                border: $block-border;
            }
            :deep(.material-design-icon__svg) {
                bottom: 0;
                fill: #8b8b8d;
            }
            .input-group {
                width: 100%;
                height: 100%;
                display: flex;
                gap: calc($spacer * 0.5);
                align-items: center;
                justify-content: space-between;
                .input-icon {
                    max-height: 100%;
                    display: flex;
                    gap: calc($spacer * 0.5);
                    align-items: center;
                    color: var(--ks-content-primary);
                }
                @include media-breakpoint-down(lg) {
                    justify-content: space-between;
                    gap: calc($spacer * 2);
                }
                p {
                    color: var(--ks-content-primary);
                    font-size: $font-size-sm;
                    font-weight: 400;
                    margin: 0;
                }
                .input-group-text {
                    max-height: 100%;
                    background-color: transparent;
                    border: none;
                    padding: 0;
                    color: var(--ks-content-primary);
                }
            }
            .input-group-append {
                display: flex;
                align-items: center;
                gap: calc($spacer * 0.25);
                .command {
                    color: var(--ks-content-tertiary);
                    font-size: calc($font-size-base * 0.62);
                }
            }
        }
    }
</style>