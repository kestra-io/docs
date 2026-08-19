<template>
    <div class="quote-carousel">
        <button
            type="button"
            class="arrow"
            aria-label="Previous quote"
            @click="step(-1)"
        >
            <ChevronLeft />
        </button>

        <figure class="quote">
            <span class="quote-mark" aria-hidden="true">&ldquo;</span>
            <blockquote>{{ active.quote }}</blockquote>
            <figcaption>
                <span class="logo" v-html="active.logoSvg" />
                <strong>{{ active.company }}</strong>
                <span class="sep" aria-hidden="true">|</span>
                <span>{{ active.author }}</span>
            </figcaption>
        </figure>

        <button
            type="button"
            class="arrow"
            aria-label="Next quote"
            @click="step(1)"
        >
            <ChevronRight />
        </button>
    </div>
</template>

<script setup lang="ts">
    import { computed, ref } from "vue"
    import ChevronLeft from "vue-material-design-icons/ChevronLeft.vue"
    import ChevronRight from "vue-material-design-icons/ChevronRight.vue"

    const props = defineProps<{
        quotes: {
            quote: string
            author: string
            company: string
            logoSvg: string
        }[]
    }>()

    const index = ref(0)
    const active = computed(() => props.quotes[index.value])

    /** Wraps around, so both arrows stay usable at either end. */
    function step(delta: number) {
        const total = props.quotes.length
        index.value = (index.value + delta + total) % total
    }
</script>

<style scoped lang="scss">
    /* Not `.carousel` — vue3-carousel ships global styles under that class. */
    .quote-carousel {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        max-width: 1020px;
        margin-inline: auto;
        /* 40px section gap + the block's own 32px inset, per the design. */
        padding-top: 4.5rem;
        @include media-breakpoint-up(lg) {
            gap: 2.5rem;
        }
    }

    .arrow {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        padding: 0;
        border: none;
        border-radius: 8px;
        background: #ffffff;
        color: var(--lp-content-primary);
        cursor: pointer;
        &:hover {
            background: var(--lp-purple-light);
        }
        :deep(.material-design-icon) {
            font-size: 1.75rem;
        }
    }

    .quote {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        /* Matches the design's quote column, and keeps the arrows tucked in
         * beside the text rather than out at the section edges. */
        max-width: 646px;
        margin: 0;
    }

    .quote-mark {
        color: var(--lp-purple);
        font-size: 3.5rem;
        font-weight: 700;
        line-height: 1;
        /* The glyph carries a lot of leading; pull the quote back up under it. */
        margin-bottom: -1.5rem;
    }

    blockquote {
        max-width: 646px;
        margin: 0;
        color: var(--lp-content-primary);
        font-size: 1.25rem;
        font-weight: 700;
        line-height: 1.167;
        letter-spacing: -0.0075rem;
        text-align: center;
        text-wrap: balance;
        @include media-breakpoint-up(lg) {
            font-size: 1.5rem;
        }
    }

    figcaption {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        padding-top: 1rem;
        color: var(--lp-content-secondary);
        font-size: $font-size-md;
        font-weight: 600;
        text-align: center;
    }

    .logo :deep(svg) {
        width: auto;
        height: 24px;
        max-width: 120px;
    }

    .sep {
        color: var(--lp-border);
        font-weight: 300;
    }
</style>
