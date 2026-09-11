<template>
    <section v-if="related?.results?.length" class="more">
        <div class="more-inner">
            <h2>Similar Kestra Stories</h2>
            <div class="more-grid">
                <Card v-for="story in related.results" :key="story.id" :story />
            </div>
            <div class="bottom">
                <Link href="/customers" text="See all stories" class="read-link" />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import Card from "./Card.vue"
    import Link from "~/components/common/Link.vue"

    defineProps<{
        related: {
            results: Story[]
        }
    }>()
</script>

<style scoped lang="scss">
    .more {
        padding: 3rem 1rem 4rem;
        background: var(--ks-background-body);
        border-top: 1px solid var(--ks-border-secondary);

        @include media-breakpoint-up(lg) {
            padding: 4.5rem 1rem 5rem;
        }
    }

    .more-inner {
        max-width: 1180px;
        margin: 0 auto;
    }

    h2 {
        font-size: clamp(1.5rem, 2.5vw, 1.875rem);
        font-weight: 600;
        letter-spacing: -0.02em;
        color: var(--ks-content-primary);
        margin: 0 0 1.75rem;
    }

    .more-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1.25rem;

        @include media-breakpoint-down(lg) {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        @include media-breakpoint-down(md) {
            grid-template-columns: minmax(0, 1fr);
        }
    }

    .bottom {
        display: flex;
        justify-content: flex-end;
        margin-top: 1.75rem;

        .read-link {
            display: flex;
            align-items: center;
            gap: 0.3125rem;
            color: var(--ks-content-link);
            font-weight: 700;
            font-size: 0.9375rem;

            :deep(.arrow-icon) {
                transition: transform 0.3s ease;
            }

            &:hover :deep(.arrow-icon) {
                transform: translateX(2px);
            }
        }
    }
</style>
