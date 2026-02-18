<template>
    <a :href="href" class="card-link">
        <div class="card">
            <div class="card-body d-flex flex-column justify-content-between gap-3">
                <div>
                    <div class="card-text">
                        <span v-for="tag in tagsList" :key="tag" class="tag-box">{{ tag }}</span>
                    </div>
                    <h6 v-if="blueprint.title" class="description">
                        {{ truncatedTitle }}
                    </h6>
                </div>
                <div class="d-flex flex-wrap gap-3">
                    <div v-for="n in blueprint.includedTasks" :key="n" class="icon">
                        <CommonTaskIcon :cls="n" />
                    </div>
                </div>
            </div>
        </div>
    </a>
</template>

<script setup lang="ts">
    import { computed } from "vue"
    import CommonTaskIcon from "~/components/common/TaskIcon.vue"


    const props = withDefaults(
        defineProps<{
            blueprint: Record<string, any>
            tags?: Array<BlueprintTag>
            href: string
        }>(),
        {
            tags: () => [],
        },
    )

    const tagsList = computed(() => {
        if (props.tags?.length) {
            return props.tags
                .filter((t: any) => props.blueprint.tags?.includes(t.id))
                .map((t) => t.name)
        }
        return props.blueprint.tags ?? []
    })

    const truncatedTitle = computed(() => {
        const title = props.blueprint.title || ""
        return title.length > 150 ? title.substring(0, 150) + "..." : title
    })
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .card-link {
        text-decoration: none;
        display: block;
        height: 100%;
    }

    .card {
        border-radius: 8px;
        border: $block-border;
        height: 100%;
        overflow: clip;
        @include media-breakpoint-up(lg) {
            min-height: 350px;
        }
        min-height: 300px;
        background-image: linear-gradient(180deg, var(--ks-border-primary) 0%, rgba(var(--ks-border-primary), 0.27) 100%);
        transition: border-color 0.2s ease;
        &:hover {
            border: 1px solid var(--ks-border-active);
        }
        .card-body {
            padding: 2rem !important;
            background-color: var(--ks-background-primary);
            .card-text {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 1rem;
                flex-wrap: wrap;
                .tag-box {
                    padding: 0.3rem 0.7rem;
                    border-radius: 4px;
                    font-size: $font-size-xs;
                    background-color: var(--ks-background-tertiary);
                    color: var(--ks-content-primary);
                    border: 1px solid var(--ks-border-primary);
                }
            }
            .description {
                font-weight: 400;
                color: var(--ks-content-primary);
                margin-bottom: 0;
            }
            .icon {
                border: 1px solid var(--ks-border-primary);
                padding: 0.313rem 0.625rem;
                width: 44px;
                border-radius: 4px;
            }
        }
    }
</style>