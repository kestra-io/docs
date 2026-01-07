<template>
    <nav v-if="pluginWrapper || pluginsWithoutDeprecated.length > 0" class="plugin-sidebar">
        <div class="search" data-bs-toggle="modal" data-bs-target="#search-modal" title="Search">
            <div class="input-group">
                <div class="input-icon">
                    <span class="input-group-text"><Magnify/></span>
                    <input type="text" placeholder="Search plugins" readonly />
                </div>
            </div>
        </div>
        <div class="sidebar-content">
            <h3 v-if="pluginWrapper" class="plugin-title">{{ title }}</h3>
            <div v-if="subGroupWrappers.length > 0" class="subgroups-list">
                <details
                    v-for="subGroup in subGroupWrappers"
                    :key="subGroup.subGroup"
                    class="subgroup-item"
                    :open="isSubGroupOpen(subGroup)"
                >
                    <summary class="subgroup-title" @click.prevent="navigateToSubGroup(subGroup)">
                        <component :is="isSubGroupOpen(subGroup) ? ChevronDown : ChevronRight" class="chevron-icon" />
                        {{ subGroupName(subGroup) }}
                    </summary>
                    <PluginElements
                        :grouped-elements="groupPluginElements(subGroup)"
                        :plugin-name="pluginName"
                        :sub-group="subGroup"
                        :show-line="true"
                    />
                </details>
            </div>
            <PluginElements
                v-else-if="pluginWrapper && Object.keys(groupedDirectElements).length > 0"
                :grouped-elements="groupedDirectElements"
                :plugin-name="pluginName"
                :show-line="true"
            />
        </div>

        <hr class="my-4">

        <div class="plugin-links">
            <div class="link-section">
                <h4>Request a plugin</h4>
                <NuxtLink
                    to="https://kestra.io/slack"
                    external
                    target="_blank"
                    class="link"
                >
                    Ask on slack
                </NuxtLink>
            </div>
            <div class="link-section">
                <h4>Create a plugin</h4>
                <NuxtLink
                    to="/docs/plugin-developer-guide"
                    external
                    target="_blank"
                    class="link"
                >
                    Go to the developer platform
                </NuxtLink>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import {subGroupName, slugify, isEntryAPluginElementPredicate, type PluginElement, type Plugin} from '@kestra-io/ui-libs';

    import Magnify from 'vue-material-design-icons/Magnify.vue';
    import ChevronDown from 'vue-material-design-icons/ChevronDown.vue';
    import ChevronRight from 'vue-material-design-icons/ChevronRight.vue';
    import PluginElements from './PluginElements.vue';

    const props = defineProps<{
        pluginWrapper: Plugin | undefined
        pluginsWithoutDeprecated: Plugin[]
        pluginName: string
        title: string
        routeParts: string[]
    }>();

    const groupPluginElements = (subGroup: Plugin): Record<string, PluginElement[]> =>
        Object.fromEntries(
            Object.entries(subGroup)
                .filter(([key, value]) => isEntryAPluginElementPredicate(key, value))
                .map(([key, value]) => [key, (value as PluginElement[]).filter(({deprecated}) => !deprecated)])
        );

    const subGroupWrappers = computed(() => props.pluginsWithoutDeprecated.filter(p => p.subGroup !== undefined));

    const groupedDirectElements = computed(() =>
        props.pluginWrapper ? groupPluginElements(props.pluginWrapper) : {}
    );

    const emit = defineEmits<{
        (e: 'navigate', path: string): void
    }>();


    const isSubGroupOpen = (subGroup: Plugin) => props.routeParts.length >= 2 && slugify(subGroupName(subGroup)) === props.routeParts[1];

    const navigateToSubGroup = (subGroup: Plugin) =>
        emit('navigate', `/plugins/${props.pluginName}/${slugify(subGroupName(subGroup))}`);
</script>

<style scoped lang="scss">
    @import "../../assets/styles/variable";

    .plugin-sidebar {
        @include media-breakpoint-up(lg) {
            padding: 2rem;
            position: sticky;
            display: block !important;
            max-height: 100%;
            overflow-y: auto;
            overflow-x: hidden;
            min-width: 260px;
            border-right: 1px solid var(--kestra-io-token-color-border-secondary);
            z-index: 10;
            background: #0A0B0D;
        }

        @include media-breakpoint-down(lg) {
            display: none;
        }

        .sidebar-content {
            display: flex;
            flex-direction: column;
            gap: $spacer;
        }

        .plugin-title {
            margin: 0;
            padding: calc($spacer / 2) $spacer;
            font-size: $font-size-md;
            font-weight: 600;
            color: $white;
            text-transform: uppercase;

            @include media-breakpoint-down(lg) {
                font-size: $font-size-sm;
            }
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

            &[open] .subgroup-title {
                color: $purple-36;
            }
        }

        .subgroup-title {
            background: transparent;
            color: $white-1;
            font-weight: 500;
            font-size: $font-size-sm;
            cursor: pointer;
            user-select: none;
            display: flex;
            align-items: center;
            gap: calc($spacer / 4);
            margin: 0;
            border: none;
            padding-left: calc($spacer / 2);
            transition: color 0.2s ease;

            .chevron-icon {
                font-size: $font-size-lg;
                color: $white;
                flex-shrink: 0;
                top: -0.18rem;
            }

            &:hover {
                color: $purple-36;
            }
        }

        .search {
            width: 100%;
            height: 32px;
            padding: calc($spacer * 0.3) calc($spacer * 0.8);
            border-radius: calc($spacer * 0.25);
            background-color: $black-2;
            border: 1px solid $black-3;
            margin: 0 auto $spacer;
            cursor: pointer;

            @include media-breakpoint-down(lg) {
                width: 100%;
                margin-top: $spacer;
            }

            &:hover {
                background-color: $black-4;
                border: 1px solid $black-6;
            }

            :deep(.material-design-icon__svg) {
                bottom: 0;
                fill: #8B8B8D;
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
                        color: $white;
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
                    color: $white;
                }
            }
        }

        .plugin-links {
            display: flex;
            flex-direction: column;
            gap: $spacer;
            margin-top: $spacer;

            .link-section {
                h4 {
                    font-size: 1rem;
                    font-weight: 700;
                    color: $white;
                    margin: 0;
                }

                .link {
                    color: $purple-36;
                    text-decoration: none;
                    font-size: 14px;
                    font-weight: normal;

                    &:hover {
                        text-decoration: underline;
                    }
                }
            }
        }

        hr {
            border-color: var(--kestra-io-token-color-border-secondary);
            opacity: 1;
        }
    }
</style>