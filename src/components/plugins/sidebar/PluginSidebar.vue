<template>
    <nav v-if="pluginWrapper || pluginsWithoutDeprecated.length > 0" class="plugin-sidebar">
        <div
            class="search"
            data-bs-toggle="modal"
            data-bs-target="#search-modal"
            title="Search"
        >
            <div class="input-group">
                <div class="input-icon">
                    <span class="input-group-text"><Magnify /></span>
                    <input type="text" placeholder="Search plugins" readonly />
                </div>
            </div>
        </div>

        <div class="sidebar-content">
            <h3 v-if="pluginWrapper" class="plugin-title">{{ title }}</h3>

            <div v-if="subGroupWrappers.length > 0" class="subgroups-list">
                <details
                    v-for="sub in subGroupWrappers"
                    :key="sub.subGroup"
                    class="subgroup-item"
                    :open="isSubGroupOpen(sub)"
                >
                    <summary class="subgroup-title">
                        <a :href="subGroupHref(sub)" class="subgroup-link">
                            {{ subGroupName(sub) }}
                        </a>
                        <ChevronRight class="chevron-icon chevron-closed" />
                        <ChevronDown class="chevron-icon chevron-open" />
                    </summary>

                    <PluginElements
                        :grouped-elements="groupPluginElements(sub)"
                        :plugin-name="pluginName"
                        :sub-group="sub"
                        :show-line="true"
                        :route-parts="routeParts"
                    />
                </details>
            </div>

            <PluginElements
                v-else-if="pluginWrapper && Object.keys(groupedDirectElements).length > 0"
                :grouped-elements="groupedDirectElements"
                :plugin-name="pluginName"
                :show-line="true"
                :route-parts="routeParts"
            />
        </div>

        <div class="plugin-links">
            <div class="link-section">
                <h4>Request a plugin</h4>
                <a href="https://kestra.io/slack" target="_blank" class="link">
                    Ask on Slack <OpenInNew />
                </a>
            </div>

            <div class="link-section">
                <h4>Create a plugin</h4>
                <a href="/docs/plugin-developer-guide" target="_blank" class="link">
                    Go to the developer platform <OpenInNew />
                </a>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
    import { computed } from "vue"
    import {
        subGroupName,
        slugify,
        isEntryAPluginElementPredicate,
        type PluginElement,
        type Plugin,
    } from "@kestra-io/ui-libs"
    import Magnify from "vue-material-design-icons/Magnify.vue"
    import ChevronRight from "vue-material-design-icons/ChevronRight.vue"
    import OpenInNew from "vue-material-design-icons/OpenInNew.vue"
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue"
    import PluginElements from "~/components/plugins/PluginElements.vue"

    const {
        pluginWrapper,
        pluginsWithoutDeprecated,
        pluginName,
        title,
        routeParts,
    } = defineProps<{
        pluginWrapper: Plugin | undefined
        pluginsWithoutDeprecated: Plugin[]
        pluginName: string
        title: string
        routeParts: string[]
    }>()

    const subGroupWrappers = computed(() =>
        pluginsWithoutDeprecated.filter((p) => p.subGroup !== undefined),
    )

    const groupedDirectElements = computed(() =>
        pluginWrapper ? groupPluginElements(pluginWrapper) : {},
    )

    const groupPluginElements = (plugin: Plugin): Record<string, PluginElement[]> =>
        Object.fromEntries(
            Object.entries(plugin)
                .filter(([key, value]) => isEntryAPluginElementPredicate(key, value))
                .map(([key, value]) => [
                    key,
                    (value as PluginElement[]).filter(({ deprecated }) => !deprecated),
                ]),
        )

    const isSubGroupOpen = (sub: Plugin) =>
        routeParts.length >= 2 &&
        slugify(subGroupName(sub)) === routeParts[1]

    const subGroupHref = (sub: Plugin) =>
        `/plugins/${pluginName}/${slugify(subGroupName(sub))}`
</script>

<style scoped lang="scss">
    .plugin-sidebar {
        @include media-breakpoint-up(xl) {
            position: sticky;
            display: block !important;
            max-height: 100%;
            overflow-y: auto;
            overflow-x: hidden;
            min-width: 209px;
            z-index: 10;
        }

        @include media-breakpoint-down(xl) {
            display: none;
        }

        .sidebar-content {
            display: flex;
            flex-direction: column;
            gap: $spacer;
        }

        .plugin-title {
            margin: 0;
            padding: calc($spacer / 2) 0;
            font-size: $font-size-sm;
            font-weight: 600;
            color: var(--ks-content-primary);
            text-transform: uppercase;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .subgroups-list {
            display: flex;
            flex-direction: column;
            gap: calc($spacer / 2);
        }

        .subgroup-item {
            border: none;
            border-radius: 0;
            overflow: visible;
            position: relative;

            :deep(svg) {
                position: relative;
                top: 4px;
            }

            .chevron-open {
                display: none;
            }

            &[open] {
                .chevron-closed {
                    display: none;
                }

                .chevron-open {
                    display: inline-flex;
                }

                .subgroup-title {
                    color: var(--ks-content-color-highlight);

                    .subgroup-link {
                        color: var(--ks-content-link);
                    }
                }
            }
        }

        .subgroup-title {
            background: transparent;
            color: var(--ks-content-primary);
            font-weight: normal;
            font-size: $font-size-sm;
            cursor: pointer;
            user-select: none;
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 0;
            margin: 0;
            border: none;
            transition: color 0.2s ease;

            .subgroup-link {
                display: flex;
                align-items: center;
                gap: calc($spacer / 4);
                text-decoration: none;
                color: var(--ks-content-primary);

                &:hover {
                    color: var(--ks-content-link);
                }
            }

            .chevron-icon {
                font-size: $font-size-lg;
                color: var(--ks-content-primary);
                flex-shrink: 0;
                top: -0.18rem;
                transition: transform 0.1s ease;
            }
        }

        .search {
            width: 100%;
            height: 32px;
            padding: calc($spacer * 0.3) calc($spacer * 0.8);
            border-radius: calc($spacer * 0.25);
            background-color: var(--ks-background-secondary);
            border: $block-border;
            margin: 0 auto $spacer;
            cursor: pointer;

            @include media-breakpoint-down(xl) {
                margin-top: $spacer;
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

                .input-icon {
                    max-height: 100%;
                    display: flex;
                    gap: calc($spacer * 0.5);
                    align-items: center;

                    input {
                        background: transparent;
                        border: none;
                        outline: none;
                        color: var(--ks-content-primary);
                        font-weight: 400;
                        font-size: $font-size-sm;
                        width: 100%;

                        &::placeholder {
                            color: var(--ks-content-inactive);
                        }
                    }
                }

                .input-group-text {
                    max-height: 100%;
                    background-color: transparent;
                    border: none;
                    padding: 0;
                    color: var(--ks-content-primary);
                }
            }
        }

        .plugin-links {
            display: flex;
            flex-direction: column;
            gap: $spacer;
            margin-top: calc($spacer * 2);

            .link-section {
                h4 {
                    font-size: $font-size-sm;
                    color: var(--ks-content-primary);
                    margin: 0;
                }

                .link {
                    color: var(--ks-content-link);
                    text-decoration: none;
                    font-size: $font-size-xs;

                    &:hover {
                        text-decoration: underline;
                        text-decoration-skip-ink: none;
                        text-underline-position: under;
                    }
                }
            }
        }
    }
</style>