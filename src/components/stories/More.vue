<template>
    <section class="more">
        <div class="container">
            <h2>Similar Kestra Stories</h2>
            <div class="row g-3 my-2">
                <div
                    v-for="(story, index) in related?.results"
                    :key="index"
                    class="col-lg-4 col-md-6"
                >
                    <Card :story />
                </div>
            </div>
            <div class="bottom">
                <Link href="/use-cases/stories" text="See all stories" class="read-link" />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import Card from "./Card.vue"
    import Link from "~/components/common/Link.vue"
    import type { Story } from "~/components/home/EnterpriseStories.vue"

    const props = defineProps<{
        related: {
            results: Story[]
        }
    }>()
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .more {
        padding: 2.5rem 1rem;
        @include media-breakpoint-up(lg) {
            padding-top: 4rem;
            padding-bottom: 5rem;
        }
        background: #f4f4f4 url("/stories/grid.png") no-repeat center;
        background-size: cover;
        border: 1px solid $white-1;

        h2 {
            font-weight: 700;
            font-size: 2rem;
            text-align: center;
            width: 100%;
            margin: 0 auto;
            margin-bottom: 2rem;
        }
    }

    .bottom {
        width: 100%;
        gap: 0.3125rem;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-top: 2rem;

        .read-link {
            display: flex;
            align-items: center;
            gap: 0.3125rem;
            color: $black-1;
            font-weight: 700;
            font-size: 1rem;

            .arrow-icon {
                transition: transform 0.3s ease;
            }

            &:hover .arrow-icon {
                transform: translateX(2px);
            }
        }
    }
</style>