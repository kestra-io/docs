<template>
    <Carousel class="quotes-carousel">
        <template v-for="(quote, i) in quotes" :key="quote.text">
            <div v-if="i > 0" class="separator" />
            <slot :quote="quote" />
        </template>
    </Carousel>
</template>

<script setup lang="ts">
    import Carousel from "~/components/common/Carousel.vue"

    defineProps<{
        quotes: {
            text: string
            author: {
                name: string
                title: string
            }
            logo?: string
        }[]
    }>()
</script>

<style lang="scss" scoped>
    .quotes-carousel {
        padding: 2rem 4rem;
        gap: 2rem;
        background: var(--ks-background-tertiary);
        border-block: 1px solid var(--ks-border-secondary);
        .separator {
            min-width: 1px;
            background: var(--ks-border-primary);
        }
    }

    :deep(.quote) {
        display: flex;
        flex-direction: column;
        .quote-text {
            color: var(--ks-content-primary);
            margin-block-end: 1rem;
        }
        .quote-author {
            color: var(--ks-content-primary);
            span {
                color: var(--ks-content-secondary);
                margin-inline-start: 0.5rem;
            }
        }
    }
</style>