<template>
    <div>
        <div class="info-ctn" v-if="story">
            <div class="info-itm w-100">
                <h3>
                    <span class="quote-mk">“</span>{{ story.quote }}<span class="quote-mk">”</span>
                </h3>
                <p class="mb-0">{{ story.quotePerson }}</p>
                <small>{{ story.quotePersonTitle }}</small>
            </div>
        </div>
        <MDCParserAndRenderer v-if="content" :content="content" class="bd-markdown" />
        <slot />
        <div v-if="story?.whatNext" class="info-ctn mt-6">
            <div class="info-itm next w-100">
                <h3 class="fst-italic fs-3">What's next</h3>
                <p class="my-0">{{ story.whatNext }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import MDCParserAndRenderer from "~/components/MDCParserAndRenderer.vue"

    const props = defineProps<{
        story?: Story
        content?: any
    }>()
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .info-ctn {
        gap: 0.625rem;
        border-radius: 0.8125rem;
        border: $block-border;
        padding: 0.375rem;
        margin-bottom: 2rem;
        .next {
            padding: 1rem;
        }
    }
        .info-itm {
            @include media-breakpoint-up(lg) {
                padding: 2.5rem 4rem;
            }
            padding: 2.5rem;
            border-radius: 0.5625rem;
            background: var(--ks-background-secondary);
            h3 {
                font-weight: 600;
                font-size: 1.875rem;
                line-height: 2rem;
                @include media-breakpoint-up(lg) {
                    line-height: 2.5rem;
                }
            }
            .quote-mk {
                color: var(--ks-content-link);
            }
            p {
                margin-top: 1.5rem;
                line-height: 2.5rem;
            }
        }
</style>