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
    <div class="quote-wrapper">
        <div class="quote-tabs" role="tablist">
            <button
                v-for="(quote, index) in quotes"
                :key="quote.quote"
                class="quote-tab"
                @click="activeQuote = index"
                v-html="quote.smallLogoSvg"
                role="tab"
                :aria-selected="activeQuote === index"
                :aria-controls="'quote-panel-' + index"
                :id="'quote-tab-' + index"
            />
        </div>
        <div class="quote-content">
            <div class="quote-text">
                <blockquote>{{ quotes[activeQuote].quote }}</blockquote>
                <span v-html="quotes[activeQuote].author" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.quote-wrapper {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: var(--ks-background-purple-light);
    color: var(--ks-content-primary);
    .quote-tabs {
        display: flex;
        justify-content: center;
        border-bottom: 1px solid var(--ks-border-secondary);
        .quote-tab{
            background: none;
            border: none;
            cursor: pointer;
            padding: 0.5rem;
            display: flex;
            max-width: 300px;
            align-items: center;
            justify-content: center;
            flex: 1;
            svg {
                width: 2rem;
                height: 2rem;
                fill: var(--ks-content-primary);
                transition: fill 0.3s ease;
            }
            &[aria-selected='true'] {
                background-color: var(--ks-background-purple-hover);
            }
        }
    }
    .quote-content{
        text-align: center;
        margin: 4rem;
        blockquote{
            &::after, &::before {
                color: var(--ks-content-color-highlight);
                content: '”';
                font-size: 1.5rem;
                line-height: 1rem;
                margin: .5rem;
                vertical-align: middle;
                margin-left: 0.5rem;
            }
        }
    }
}
</style>


