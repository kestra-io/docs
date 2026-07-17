<template>
    <a :href="href" class="blueprint">
        <h6 class="title">
            {{ capitalizedTitle }}
        </h6>
        <p v-if="blueprint.shortDescription" class="description">
            {{ blueprint.shortDescription }}
        </p>
        <div class="task-icons">
            <div class="icon" v-for="n in visibleTasks" :key="n">
                <TaskIcon :cls="n" />
            </div>
            <span v-if="extraCount > 0" class="extra-count">+{{ extraCount }}</span>
        </div>
        <div class="footer">
            <hr />
            <div class="bottom-row">
                <div class="tag-list" v-if="tagsList.length">
                    <span
                        v-for="(tag, idx) in tagsList"
                        :key="idx"
                        class="category-tag"
                    >
                        <TagIcon :tag="tag" />
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
    import TagIcon from "~/components/blueprints/TagIcon.vue"
    import type { BlueprintPreview } from "~/utils/plugins/types"
    import { capitalize } from "~/utils/plugins/pluginUtils"
    import { visibleTags } from "~/utils/blueprints/visibleTags"

    const props = withDefaults(
        defineProps<{
            blueprint: BlueprintPreview
            tags?: Array<any>
            href: string
        }>(),
        {
            tags: () => [],
        },
    )

    const capitalizedTitle = computed(() => capitalize(props.blueprint?.title ?? ""))

    const MAX_ICONS = 6
    const visibleTasks = computed(() =>
        (props.blueprint.includedTasks ?? []).slice(0, MAX_ICONS)
    )
    const extraCount = computed(() =>
        Math.max(0, (props.blueprint.includedTasks ?? []).length - MAX_ICONS)
    )

    const tagsList = computed(() => {
        if (props.tags?.length) {
            return visibleTags(props.tags)
                .filter((t: any) => props.blueprint.tags?.includes(t.id))
                .map((t: any) => t.name)
        }
        return props.blueprint.tags ?? []
    })
</script>

<style scoped lang="scss">
    @use "/src/components/blueprints/_blueprintCard.scss" as blueprintCard;

    .blueprint {
        @include blueprintCard.blueprint-card-base;

        transition: transform 0.4s ease-out, border-color 0.4s ease-out;

        .task-icons {
            .icon {
                display: grid;
                place-items: center;

                :deep(.icon-wrapper) {
                    width: 24px;
                    height: 24px;
                }
            }

            .extra-count {
                flex-shrink: 0;
                font-size: $font-size-xs;
                font-weight: 600;
                color: var(--ks-content-secondary);
            }
        }

        .title {
            font-size: $font-size-md;
            font-weight: 700;
        }
    }
</style>

