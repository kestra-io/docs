<script lang="ts" setup>
import { ref } from 'vue';
import ChevronLeft from "vue-material-design-icons/ChevronLeft.vue";
import ChevronRight from "vue-material-design-icons/ChevronRight.vue";

defineProps<{
    quotes: {
        quote: string
        author: string
        smallLogoSvg?: string
        bigLogoSrc?: string
        kpis?: {
            name: string
            value: string
        }[]
        storyLink?: string
    }[]
}>()

const activeQuote = ref(0)
</script>

<template>
    <div v-if="quotes.length > 0" class="wrapper">
        <div v-if="quotes.length > 1" class="tabs" role="tablist">
            <button
                v-for="(quote, index) in quotes"
                :key="quote.quote"
                class="tab"
                @click="activeQuote = index"
                v-html="quote.smallLogoSvg"
                role="tab"
                :aria-selected="activeQuote === index"
                :aria-controls="'quote-panel-' + index"
                :id="'quote-tab-' + index"
            />
        </div>
        <div class="content">
            <img v-if="quotes[activeQuote].bigLogoSrc" :src="quotes[activeQuote].bigLogoSrc" class="big-logo" />
            <figure class="text" :class="{'text-center': !quotes[activeQuote].bigLogoSrc}">
                <blockquote class="quote-content" data-usal="fade-r">{{ quotes[activeQuote].quote }}</blockquote>
                <figcaption v-html="quotes[activeQuote].author" data-usal="fade-l"/>
                <div class="small-logo" v-if="quotes.length === 1 && quotes[activeQuote].smallLogoSvg" v-html="quotes[activeQuote].smallLogoSvg" />
            </figure>
        </div>
        <div v-if="quotes[activeQuote].kpis" class="kpis">
            <div v-for="kpi in quotes[activeQuote].kpis" :key="kpi.name" class="kpi">
                <h1>{{ kpi.value }}</h1>
                <span>{{ kpi.name }}</span>
            </div>
        </div>
        <div class="navigation">
            <a v-if="quotes[activeQuote].storyLink" :href="quotes[activeQuote].storyLink" target="_blank" rel="noopener noreferrer">
                Read the Story
            </a>
            <button v-if="quotes.length > 1" @click="() => { if(activeQuote > 0) {activeQuote--} }">
                <ChevronLeft />
            </button>
            <button v-if="quotes.length > 1" @click="() => { if(activeQuote < quotes.length - 1) {activeQuote++} }">
                <ChevronRight />
            </button>
        </div>
    </div>
</template>

<style lang="scss" scoped>

.wrapper {
    background: linear-gradient(
        var(--ks-background-purple-light),
        var(--ks-background-purple-light)),
        var(--ks-background-primary);
    color: var(--ks-content-primary);

    .tabs {
        display: flex;
        justify-content: center;
        border-bottom: 1px solid var(--ks-border-secondary);
        margin: 0 auto;

        @include media-breakpoint-down(sm) {
            gap: 1rem;
        }

        .tab {
            background: none;
            border: none;
            cursor: pointer;
            padding: .8rem 0.5rem;
            display: flex;
            max-width: 20%;
            align-items: center;
            justify-content: center;
            color: var(--ks-content-primary);
            flex: 1;

            :deep(svg) {
                height: 1.5rem;
                transition: color 0.3s ease;

                * {
                    fill: currentColor;
                }
            }

            &[aria-selected='true'],
            &:hover {
                background-color: var(--ks-background-purple-hover);
                border-bottom: 1px solid var(--ks-border-active);
                margin-bottom: -1px;
            }
        }
    }

    .content {
        padding: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
        max-width: 1200px;
        margin-inline: auto;
        .big-logo {
            // guarantee square proportions
            aspect-ratio: 1 / 1;
            object-fit: contain;
            max-width: 80%;
        }

        @include media-breakpoint-up(lg) {
            padding: 4rem;
            flex-direction: row;

            .big-logo {
                max-width: 35%;
            }
        }

        .text {
            display: flex;
            flex-direction: column;
            gap: 2rem;
            align-items: center;


            .quote-content {
                margin: 0;
                color: var(--ks-content-primary);
                font-weight: normal;
                font-size: $h1-font-size;
                line-height: 1.3;
                display: inline;
                padding: 0;
                margin: 0;

                @include media-breakpoint-down(md) {
                    font-size: 1.5rem;
                }

                &::before,
                &::after {
                    color: var(--ks-content-color-highlight);
                }

                &::before {
                    content: "“";
                    margin-right: 0.25rem;
                }

                &::after {
                    content: "”";
                    margin-left: 0.25rem;
                }
            }

            figcaption {
                margin: 0;

                @include media-breakpoint-up(lg) {
                    font-size: 1.125rem;
                }

                font-family: $font-family-monospace;
                color: var(--ks-content-secondary);
            }

            .small-logo {
                :deep(svg) {
                    height: 2rem;
                    color: var(--ks-content-primary);

                    * {
                        fill: currentColor !important;
                    }
                }
            }
        }
    }

    .kpis {
        display: flex;
        justify-content: stretch;
        gap: 2rem;
        border-top: 1px solid var(--ks-border-secondary);
        width: 70%;
        margin: 0 auto;
        padding: 1rem 0;

        @include media-breakpoint-down(sm) {
            flex-direction: column;
            gap: 1rem;
        }

        .kpi {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;

            span {
                font-size: $font-size-md;
                color: var(--ks-content-secondary);
            }
        }
    }

    .navigation {
        display: flex;
        justify-content: end;
        gap: .5rem;
        align-items: center;
        padding: 1rem;

        a,
        button {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            height: 32px;
            border-radius: 4px;
            border: 1px solid var(--ks-border-primary-inverse);
            padding: 8px 16px;
            color: var(--ks-content-primary);
            text-decoration: none;
            background: none;

            &:hover {
                background: var(--ks-background-purple-hover);
            }
        }

        a {
            width: fit-content;
            font-weight: bold;
            font-size: $font-size-xs;
        }

        button {
            width: 44px;
            cursor: pointer;

            :deep(svg) {
                bottom: 0;
                font-size: 1rem;
                left: -2px;
            }

            &:disabled {
                color: var(--ks-content-secondary);
                cursor: not-allowed;
            }
        }
    }
}
</style>


