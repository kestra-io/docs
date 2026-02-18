<template>
    <a :href="href">
        <div class="plugin">
            <div class="top-row">
                <div class="icon-content">
                    <img :src="iconSrc" :alt="props.plugin.title" loading="lazy" />
                </div>
                <div class="content">
                    <div class="title-row">
                        <h6>
                            {{ props.plugin.title?.replace(/\s*\(EE\)\s*$/i, "") }}
                        </h6>
                        <span
                            v-if="props.plugin.className?.includes('.ee.')"
                            class="enterprise-badge"
                            >Enterprise</span
                        >
                    </div>
                    <p v-if="props.plugin.description" class="description">
                        {{ props.plugin.description }}
                    </p>
                </div>
            </div>
            <div v-if="props.plugin.categories?.length" class="categories">
                <span
                    v-for="category in props.plugin.categories"
                    :key="category"
                    class="category-tag"
                >
                    {{ formatCategoryName(category) }}
                </span>
            </div>
            <div class="footer">
                <hr />
                <div class="bottom-row">
                    <div class="left">
                        <p v-if="props.plugin.elementCounts">
                            {{ props.plugin.elementCounts }} <span>Tasks</span>
                        </p>
                        <p v-if="props.plugin.blueprints">
                            {{ props.plugin.blueprints }}
                            <span>Blueprints</span>
                        </p>
                    </div>
                    <ChevronRight />
                </div>
            </div>
        </div>
    </a>
</template>

<script setup lang="ts">
    import { computed } from "vue"
    import { formatCategoryName } from "~/utils/pluginUtils"
    import { slugify } from "@kestra-io/ui-libs"
    import ChevronRight from "vue-material-design-icons/ChevronRight.vue"

    const props = defineProps<{
        plugin: PluginInformation
    }>()

    const iconSrc = computed(() => {
        if (props.plugin.className) {
            return `/icons/${props.plugin.className}.svg`
        }
        return "/icon.svg"
    })

    const href = computed(() => {
        const base = `/plugins/${props.plugin.name}`
        if (props.plugin.subGroup === undefined || !props.plugin.subGroupTitle) {
            return base
        }
        return `${base}/${slugify(props.plugin.subGroupTitle)}`
    })
</script>

<style scoped lang="scss">
    @use "@kestra-io/ui-libs/src/scss/_color-palette.scss" as color-palette;
    @import "~/assets/styles/variable";

    .plugin {
        height: 188px;
        border-radius: 12px;
        border: 1px solid var(--kestra-io-token-color-border-secondary);
        padding: $rem-1;
        padding-bottom: 2px;
        background: var(--kestra-io-token-color-background-secondary);
        display: flex;
        flex-direction: column;
        gap: 0;
        box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
        transition: 0.4s ease-out;

        &:hover {
            border-color: var(--kestra-io-token-color-border-active);
            box-shadow: 0 4px 18px 0 rgba(0, 0, 0, 0.25);
            transform: scale(1.025);
        }

        .top-row {
            display: flex;
            flex-direction: row;
            gap: $rem-1;
            margin-bottom: 1rem;
        }

        .icon-content {
            width: 60px;
            height: 60px;
            background: color-palette.$base-gray-50;
            border-radius: 8px;
            border: 1px solid color-palette.$base-gray-100;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;

            img {
                width: 45px;
                height: 45px;
            }
        }

        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            min-width: 0;
        }

        h6 {
            color: $white;
            font-size: $font-size-md;
            font-weight: 700;
            margin: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .categories {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
            margin-bottom: 0.5rem;

            .category-tag {
                display: inline-block;
                margin-right: 0.25rem;
                background: color-palette.$base-purple-800;
                color: $white;
                padding: 0.125rem 0.5rem;
                border-radius: 40px;
                border: 1px solid color-palette.$base-purple-600;
                font-size: 0.625rem;
                font-weight: 500;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }

        .description {
            color: var(--ks-content-secondary);
            font-size: $font-size-xs !important;
            line-height: $rem-1;
            margin: 0;
            overflow: hidden;
            display: -webkit-box;
            line-clamp: 2;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }

        hr {
            border: 1px solid $black-3;
            margin: 0;
        }

        .footer {
            margin-top: auto;
            display: flex;
            flex-direction: column;
            gap: 0;
        }

        .bottom-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: $gray-100;
            height: 45px;

            .left {
                display: flex;
                gap: $rem-1;
                align-items: center;

                p {
                    margin: 0;
                    font-weight: 700;
                    font-size: $font-size-xs !important;
                }

                span {
                    color: color-palette.$base-gray-300;
                    font-weight: normal;
                    margin-left: 2px;
                }
            }

            :deep(svg) {
                font-size: $rem-1;
                color: var(--kestra-io-token-text-link-default);
            }
        }
    }

    .title-row {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .enterprise-badge {
            background: #130025;
            border: 1px solid color-palette.$base-yellow-700;
            gap: 4px;
            min-height: 20px;
            border-radius: 40px;
            border-width: 1px;
            font-size: 12px;
            color: color-palette.$base-yellow-100;
            cursor: default;
            padding: 0.15rem 0.5rem;
        }
    }
</style>
