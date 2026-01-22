<template>
    <div class="row card-group mb-2">
        <a
            :href="item.path"
            class="col-12 col-md-6 mb-lg-4 mb-2"
            v-for="item in props.navigation"
            :key="item.path"
        >
            <div class="card">
                <div class="card-body d-flex">
                    <span v-if="!hideIcons" class="card-icon">
                        <img
                            :src="item.icon ?? currentPageIcon"
                            :alt="item.title"
                            width="50px"
                            height="50px"
                        />
                    </span>
                    <div>
                        <h4 class="card-title">{{ item.title }}</h4>
                        <MDCParserAndRenderer :content="item.description" class="bd-markdown" />
                    </div>
                </div>
            </div>
        </a>
    </div>
</template>

<script setup lang="ts">
    import MDCParserAndRenderer from "~/components/MDCParserAndRenderer.vue"

    const props = defineProps<{
        pageUrl?: string
        hideIcons?: boolean
        navigation?: Array<{
            path: string
            title: string
            description: string
            icon?: string
            release?: string
        }>
        currentPageIcon?: string
    }>()
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .card {
        background: $black-2 !important;

        :deep(.bd-markdown) {
            h4 {
                font-size: 22px !important;
                line-height: 1.375rem !important;
            }

            p {
                font-size: 14px !important;
                line-height: 1rem !important;
                margin-bottom: 0;
            }
        }

        .card-icon {
            img {
                max-width: unset;
                width: 48px !important;
                height: 48px !important;
            }
        }
    }
</style>