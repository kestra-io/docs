<script lang="ts" setup>
import { ref } from 'vue';

defineProps<{
    quotes: {
        quote: string
        author: string
        smallLogoSvg: string
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
            <div class="text" :class="{'text-center': !quotes[activeQuote].bigLogoSrc}">
                <h1 class="quote-title" data-usal="fade-r">
                    <blockquote class="quote-content">{{ quotes[activeQuote].quote }}</blockquote>
                </h1>
                <p v-html="quotes[activeQuote].author" data-usal="fade-l"/>
                <div class="small-logo" v-if="quotes.length === 1" v-html="quotes[activeQuote].smallLogoSvg" />
            </div>
        </div>
        <div v-if="quotes[activeQuote].kpis" class="kpis">
            <div v-for="kpi in quotes[activeQuote].kpis" :key="kpi.name" class="kpi">
                <strong>{{ kpi.value }}</strong>
                <span>{{ kpi.name }}</span>
            </div>
        </div>
        <div class="navigation">
            <a v-if="quotes[activeQuote].storyLink" :href="quotes[activeQuote].storyLink" target="_blank" rel="noopener noreferrer">
                Read the Story
            </a>
            <button v-if="quotes.length > 1" @click="() => { if(activeQuote > 0) {activeQuote--} }">&lt;</button>
            <button v-if="quotes.length > 1" @click="() => { if(activeQuote < quotes.length - 1) {activeQuote++} }">&gt;</button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "~/assets/styles/variable";

.wrapper {
    background-color: var(--ks-background-purple-light);
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

            .quote-title {
                margin: 0;
                color: var(--ks-content-primary);
                font-weight: normal;
                line-height: 1.3;

                .quote-content {
                    display: inline;
                    padding: 0;
                    margin: 0;

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
            }

            p {
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

            strong {
                font-size: 1.5rem;
            }

            span {
                font-size: 0.7rem;
                color: var(--ks-content-secondary);
            }
        }
    }

    .navigation {
        display: flex;
        justify-content: end;
        gap: .5rem;
        align-items: center;
        font-size: .8rem;
        padding: 1rem;

        a,
        button {
            color: var(--ks-content-primary);
            border: 1px solid var(--ks-border-primary-inverse);
            border-radius: 2px;
            text-decoration: none;
            font-size: .5rem;
            padding: .15rem .6rem;

            &:hover {
                background: var(--ks-background-purple-hover);
            }
        }

        a {
            font-weight: bold;
        }

        button {
            cursor: pointer;
            background: none;

            &:disabled {
                color: var(--ks-content-secondary);
                cursor: not-allowed;
            }
        }
    }
}
</style>


