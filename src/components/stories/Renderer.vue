<template>
    <div class="right">
        <div class="info-ctn">
            <div class="info-itm w-100">
                <h3>
                    <span class="quote-mk">“</span>{{ story.quote }}<span class="quote-mk">”</span>
                </h3>
                <p class="mb-0">{{ story.quotePerson }}</p>
                <small>{{ story.quotePersonTitle }}</small>
            </div>
        </div>
        <MDCParserAndRenderer :content="content" class="bd-markdown" />
        <div v-if="story.whatNext" class="info-ctn mt-6">
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
        story: Story
        content: any
    }>()
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .right {
        max-width: 801px;
        height: fit-content;

        .info-ctn {
            gap: 0.625rem;
            border-radius: 0.8125rem;
            border: 1px solid #d4d4d4;
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
            background: #f4f4f4;

            h3 {
                font-weight: 600;
                font-size: 1.875rem;
                line-height: 2rem;
                @include media-breakpoint-up(lg) {
                    line-height: 2.5rem;
                }
            }

            .quote-mk {
                color: $primary;
            }

            p {
                font-size: 1rem;
                margin-top: 1.5rem;
            }

            small {
                font-size: 0.75rem;
                color: var(--ks-content-tertiary);
            }
        }

        :deep(.bd-markdown) {
            p {
                font-size: 1rem;
                color: $black-1;
                font-weight: 400;
            }

            a {
                color: $primary !important;
                text-decoration: underline !important;
            }

            h2 {
                font-size: 1.6875rem;
                font-weight: 700;
                color: $black-1 !important;
                margin: 0.5rem 0;
                border: none !important;
                padding: 0;

                &::before {
                    background: transparent;
                }
            }

            h3 {
                font-size: 1.5rem;
                font-weight: 600;
                color: $black-1 !important;
            }

            h2 > a,
            h3 > a {
                color: $black-1 !important;
                text-decoration: none !important;
                font-weight: 700;
                font-size: 1.6875rem;
            }

            strong {
                font-weight: 700;
                color: $black-1;
                font-size: 1rem;
            }

            ul > li {
                color: $black-1;
                line-height: 1.6;
                font-size: 1rem;
            }

            ul > li::marker {
                color: $primary;
                font-size: 1rem;
            }

            blockquote {
                border-left: 0.25rem solid $primary;
                padding: 0.5rem 2rem;
                font-size: 1rem;

                p {
                    margin: 0;
                    color: $black-1;
                }
            }
        }
    }
</style>