<template>
    <NuxtLink :href="href">
        <div class="card bg-dark-2">
            <div class="card-body d-flex flex-column justify-content-between gap-3">
                <div>
                    <div class="card-text">
                        <p class="title">{{ tagsList }}</p>
                    </div>
                    <h6 class="description" v-if="blueprint.title">
                        {{ blueprint.title.length > 150 ? blueprint.title.substring(0, 150) + '...' : blueprint.title }}
                    </h6>
                </div>
                <div class="d-flex flex-wrap gap-3">
                    <div class="icon bg-dark-4" v-for="n in blueprint.includedTasks" :key="n">
                        <CommonTaskIcon :cls="n" />
                    </div>
                </div>
            </div>
        </div>
    </NuxtLink>
</template>

<script setup>
    import {slugify} from "~/utils/url";
</script>

<script>
    export default {
        props: {
            blueprint: {
                type: Object,
                required: true
            },
            tags: {
                type: Array,
                default: []
            },
            href: {
              type: String,
              required: true
            }
        },
        computed: {
            tagsList() {
                if(this.tags && this.blueprint.tags) {
                    return this.tags.filter(t => this.blueprint.tags.includes(t.id)).map(t => t.name).join(' ')
                }
                return ""
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/styles/variable";

    .card {
        border-radius: 8px;
        border: $block-border;
        height: 100%;

        .card-body {
            padding: 2rem !important;

            .icon {
                border: 1px solid #E5E4F7;
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
    }
</style>