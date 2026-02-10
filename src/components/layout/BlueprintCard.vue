<template>
    <a :href="href" class="blueprint" :class="{ light: scheme === 'light' }">
        <h6 class="title">
            {{ capitalizedTitle }}
        </h6>
        <div class="task-icons">
            <div class="icon bg-dark-4" v-for="n in blueprint.includedTasks" :key="n">
                <TaskIcon :cls="n" />
            </div>
        </div>
        <div class="footer">
            <hr />
            <div class="bottom-row">
                <div class="tag-list" v-if="tagsList.length">
                    <span v-for="(tag, idx) in tagsList" :key="idx" class="category-tag">
                        {{ tag }}
                    </span>
                </div>
            </div>
        </div>
    </a>
</template>

<script setup lang="ts">
    import { computed } from "vue"
    import TaskIcon from "~/components/common/TaskIcon.vue"

    const props = withDefaults(
        defineProps<{
            blueprint: Blueprint
            tags?: Array<any>
            href: string
            /**
             * The color scheme for the blueprint card.
             * @description
             * - "dark" (default): Dark background with white text, purple category tags.
             * - "light": White background with black text, light purple category tags.
             */
            scheme?: string
        }>(),
        {
            tags: () => [],
            scheme: "dark",
        },
    )

    const capitalizedTitle = computed(() =>
        props.blueprint?.title
            ? props.blueprint.title.charAt(0).toUpperCase() + props.blueprint.title.slice(1)
            : "",
    )

    const tagsList = computed(() => {
        if (props.tags?.length) {
            return props.tags
                .filter((t: any) => props.blueprint.tags?.includes(t.id))
                .map((t: any) => t.name)
        }
        return props.blueprint.tags ?? []
    })
</script>

<style scoped lang="scss">
    @use "@kestra-io/ui-libs/src/scss/_color-palette.scss" as color-palette;
    @import "~/assets/styles/variable";

    .blueprint {
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

        .task-icons {
            display: flex;
            gap: 0.5rem;
            align-items: center;
            flex-wrap: nowrap;
            overflow: hidden;
            margin-bottom: 1rem;

            .icon {
                border-radius: 4px;
                border: 1px solid var(--ks-border-primary);
                width: 34px;
                height: 34px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                background-color: $white;

                :deep(.icon-wrapper) {
                    width: 24px;
                    height: 24px;
                }
            }
        }

        .title {
            color: $white;
            font-size: $font-size-md;
            font-weight: 700;
            margin: 0 0 1rem 0;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            line-clamp: 2;
            overflow: hidden;
            line-height: normal;
        }

        hr {
            border: 1px solid $black-3;
            margin: 0;
        }

        .footer {
            margin-top: auto;
            display: flex;
            flex-direction: column;
        }

        .bottom-row {
            display: flex;
            align-items: center;
            gap: $rem-1;
            color: $gray-100;
            height: 45px;
        }

        .tag-list {
            display: flex;
            gap: 0.25rem;
            align-items: center;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .category-tag {
            display: inline-block;
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

    //FIXME: after variables update

    .blueprint.light {
        background-color: $white;
        border-color: #e1e3e5;
        box-shadow: 2px 3px 16px 0px #2720560D;

        hr {
            border-color: #e1e3e5;
        }

        .title {
            color: $black-1;
            font-weight: 600;
        }

        .icon {
            border-color: #F1F1F1;
            background: $white;
        }

        .category-tag {
            background: #F1EFFF;
            color: #631BFF;
            padding: 0 0.5rem;
        }
    }
</style>