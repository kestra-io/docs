<template>
    <section class="stories">
        <div class="container">
            <Sidebar :story="story" :content="content" />
            <Renderer :story="story" :content="content" />
        </div>
    </section>
</template>

<script setup lang="ts">
    import Sidebar from "./Sidebar.vue"
    import Renderer from "./Renderer.vue"

    const props = defineProps<{
        story: Story
        content: any
    }>()
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .stories {
        padding-top: 4.375rem;
        padding-bottom: 4rem;
        @include media-breakpoint-down(lg) {
            padding: 2rem 0;
        }

        .container {
            display: flex;
            gap: 4rem;
            padding: 0 1.25rem;

            @include media-breakpoint-between(lg, xl) {
                gap: 2rem;
                padding: 0;

                :deep(.btn-gradient) {
                    padding: 8px 12px;
                    font-size: 15px;
                }
            }

            @include media-breakpoint-down(lg) {
                flex-direction: column;
                gap: 0;
                align-items: center;
            }
        }
    }
</style>