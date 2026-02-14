<template>
    <a :href="href" class="blueprint">
        <h6 class="title">
            {{ capitalizedTitle }}
        </h6>
        <div class="task-icons">
            <div class="icon " v-for="n in blueprint.includedTasks" :key="n">
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
    }>(),
    {
        tags: () => [],
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
@import "~/assets/styles/variable";

.blueprint {
    height: 188px;
    border-radius: 12px;
    border: $block-border;
    padding: $rem-1 $rem-1 2px;
    background: var(--ks-background-primary);
    display: flex;
    flex-direction: column;
    box-shadow: 2px 3px 16px 0px var(--ks-shadows-light);
    transition: all 0.4s ease-out;
    &:hover {
        border-color: var(--kestra-io-token-color-border-active);
        box-shadow: 0 4px 18px rgba(0, 0, 0, 0.25);
        transform: scale(1.025);
    }
    .task-icons {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        overflow: hidden;
        margin-bottom: 1rem;
        .icon {
            border-radius: 4px;
            border: $block-border;
            width: 34px;
            height: 34px;
            display: grid;
            place-items: center;
            flex-shrink: 0;
            background: var(--ks-background-body);
            :deep(.icon-wrapper) {
                width: 24px;
                height: 24px;
            }
        }
    }
    .title {
        color: var(--ks-content-primary);
        font-size: $font-size-md;
        font-weight: 700;
        margin: 0 0 1rem;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        line-clamp: 2;
        overflow: hidden;
        line-height: normal;
    }
    hr {
        border: $block-border;
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
        color: var(--ks-background-secondary);
        height: 45px;
    }
    .tag-list {
        display: flex;
        gap: 0.25rem;
        align-items: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .category-tag {
        background: var(--ks-backgroung-tag-category);
        color: var(--ks-content-tag-category);
        padding: 0.125rem 0.5rem;
        border-radius: 40px;
        font-size: $font-size-xs;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
</style>