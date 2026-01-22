<template>
    <a :href="href">
        <div class="card bg-dark-2">
            <div class="card-body d-flex flex-column justify-content-between gap-3">
                <div>
                    <div class="card-text">
                        <span class="tag-box" v-for="tag in tagsList">{{ tag }}</span>
                    </div>
                    <h6 class="description" v-if="blueprint.title">
                        {{
                            blueprint.title.length > 150
                                ? blueprint.title.substring(0, 150) + "..."
                                : blueprint.title
                        }}
                    </h6>
                </div>
                <div class="d-flex flex-wrap gap-3">
                    <div class="icon bg-dark-4" v-for="n in blueprint.includedTasks" :key="n">
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
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .card {
        border-radius: 8px;
        border: $block-border;
        height: 100%;
        background-image: linear-gradient(180deg, $black-9 0%, rgba($black-9, 0.27) 100%);

        .card-body {
            padding: 2rem !important;

            .icon {
                border: 1px solid $white-2;
                padding: 0.313rem 0.625rem;
                width: 44px;
            }
        }

        .title {
            color: $white-1;
            font-family: $font-family-monospace;
            font-size: $font-size-xs;
            font-weight: 400;
            text-transform: uppercase;
        }

        .description {
            color: $white;
            font-size: $h6-font-size;
            font-weight: 400;
        }

        .icon {
            border-radius: 4px;
            border: 1px solid $black-6 !important;
        }

        .card-text {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1rem;
            flex-wrap: wrap;
        }

        .tag-box {
            background-color: $black-6;
            color: $white;
            padding: 0.3rem 0.7rem;
            border-radius: 4px;
            font-size: $font-size-sm;
        }
    }
</style>