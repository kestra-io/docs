<template>
    <div v-if="quotes.length > 0" class="wrapper">
        <div v-if="quotes.length > 1" class="tabs-scroll">
            <div class="tabs" role="tablist">
                <button
                    v-for="(quote, index) in quotes"
                    :id="`quote-tab-${index}`"
                    :key="quote.quote"
                    role="tab"
                    class="tab"
                    :aria-selected="activeQuote === index"
                    :aria-controls="`quote-panel-${index}`"
                    @click="activeQuote = index"
                    v-html="quote.smallLogoSvg"
                />
            </div>
        </div>

        <div v-if="quotes.length > 1" class="tab-select">
            <div class="tab-select__inner">
                <button
                    class="tab-select__trigger"
                    :class="{ open: isDropdownOpen }"
                    @click="isDropdownOpen = !isDropdownOpen"
                >
                    <span v-html="activeItem.smallLogoSvg" />
                    <ChevronDown class="chevron" />
                </button>
                <div v-if="isDropdownOpen" class="tab-select__menu">
                    <button
                        v-for="(quote, index) in quotes"
                        :key="quote.quote"
                        class="tab-select__option"
                        :class="{ active: activeQuote === index }"
                        @click="onSelect(index)"
                        v-html="quote.smallLogoSvg"
                    />
                </div>
            </div>
        </div>

        <div class="content">
            <img v-if="activeItem.bigLogoSrc" :src="activeItem.bigLogoSrc" class="big-logo" />
            <figure class="text" :class="{ 'text-center': !activeItem.bigLogoSrc }">
                <blockquote class="quote-content" data-usal="fade-r">{{ activeItem.quote }}</blockquote>
                <figcaption v-html="activeItem.author" data-usal="fade-l" />
                <div
                    v-if="quotes.length === 1 && activeItem.smallLogoSvg"
                    class="small-logo"
                    v-html="activeItem.smallLogoSvg"
                />
            </figure>
        </div>

        <div v-if="activeItem.kpis" class="kpis">
            <div v-for="kpi in activeItem.kpis" :key="kpi.name" class="kpi">
                <span class="kpi-value">{{ kpi.value }}</span>
                <span>{{ kpi.name }}</span>
            </div>
        </div>

        <div class="navigation">
            <a
                v-if="activeItem.storyLink"
                :href="activeItem.storyLink"
                target="_blank"
                rel="noopener noreferrer"
            >
                Read the Story
            </a>
            <button v-if="quotes.length > 1" :disabled="activeQuote === 0" @click="onPrev">
                <ChevronLeft />
            </button>
            <button v-if="quotes.length > 1" :disabled="activeQuote === quotes.length - 1" @click="onNext">
                <ChevronRight />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, ref } from "vue"
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue"
    import ChevronLeft from "vue-material-design-icons/ChevronLeft.vue"
    import ChevronRight from "vue-material-design-icons/ChevronRight.vue"

    const props = defineProps<{
        quotes: {
            quote: string
            author: string
            smallLogoSvg?: string
            bigLogoSrc?: string
            kpis?: { name: string; value: string }[]
            storyLink?: string
        }[]
    }>()

    const activeQuote = ref(0)
    const isDropdownOpen = ref(false)

    const activeItem = computed(() => props.quotes[activeQuote.value])

    function onSelect(index: number) {
        activeQuote.value = index
        isDropdownOpen.value = false
    }

    function onPrev() {
        if (activeQuote.value > 0) activeQuote.value--
    }

    function onNext() {
        if (activeQuote.value < props.quotes.length - 1) activeQuote.value++
    }
</script>

<style scoped lang="scss">
    @mixin logo-svg($height: 1.5rem) {
        :deep(svg) {
            height: $height;
            max-width: 100%;

            * {
                fill: currentColor;
            }
        }
    }

    .wrapper {
        max-width: 100%;
        color: var(--ks-content-primary);
        background: linear-gradient(var(--ks-background-purple-light), var(--ks-background-purple-light)),
            var(--ks-background-primary);
    }

    .tabs-scroll {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        padding: 2rem 2rem 0;

        &::-webkit-scrollbar {
            display: none;
        }

        @include media-breakpoint-down(md) {
            display: none;
        }

        .tabs {
            display: flex;
            justify-content: center;
            min-width: max-content;
            gap: 0.25rem;
            margin: 0 auto;

            .tab {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 214px;
                padding: 0.8rem 0.5rem;
                color: var(--ks-content-primary);
                background: none;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                flex: none;

                @include logo-svg;

                :deep(svg) {
                    transition: color 0.3s ease;
                }

                &[aria-selected="true"],
                &:hover {
                    background-color: var(--ks-background-purple-hover);
                }
            }
        }
    }

    .tab-select {
        display: none;
        padding: 1.5rem 1rem 0;

        @include media-breakpoint-down(md) {
            display: block;
        }

        &__inner {
            position: relative;
        }

        &__trigger {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            height: 55px;
            padding: 0.75rem 1rem;
            color: var(--ks-content-primary);
            background: none;
            border: 0.72px solid var(--ks-border-secondary);
            border-radius: 8px;
            cursor: pointer;

            @include logo-svg;

            .chevron {
                flex-shrink: 0;
                transition: transform 0.2s ease;

                :deep(svg) {
                    width: 1.25rem;
                    height: 1.25rem;
                }
            }

            &.open {
                border-radius: 8px 8px 0 0;
                border-bottom-color: transparent;

                .chevron {
                    transform: rotate(180deg);
                }
            }

            &:hover {
                background-color: var(--ks-background-purple-hover);
            }
        }

        &__menu {
            position: absolute;
            top: calc(100% - 8px);
            right: 0;
            left: 0;
            z-index: 10;
            overflow: hidden;
            background: var(--ks-background-primary);
            border: 0.72px solid var(--ks-border-secondary);
            border-top: none;
            border-radius: 0 0 8px 8px;
        }

        &__option {
            display: flex;
            align-items: center;
            width: 100%;
            height: 55px;
            padding: 0.75rem 1rem;
            color: var(--ks-content-primary);
            background: none;
            border: none;
            border-bottom: 0.72px solid var(--ks-border-secondary);
            cursor: pointer;

            @include logo-svg;

            &:last-child {
                border-bottom: none;
            }

            &.active,
            &:hover {
                background-color: var(--ks-background-purple-hover);
            }
        }
    }

    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
        max-width: 1200px;
        padding: 2rem;
        margin-inline: auto;

        @include media-breakpoint-up(lg) {
            flex-direction: row;
            padding: 4rem;

            .big-logo {
                max-width: 35%;
            }
        }

        .big-logo {
            aspect-ratio: 1;
            object-fit: contain;
            max-width: 80%;
        }

        .text {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2rem;

            .quote-content {
                display: inline;
                margin: 0;
                padding: 0;
                color: var(--ks-content-primary);
                font-size: $h1-font-size;
                font-weight: normal;
                line-height: 1.3;

                @include media-breakpoint-down(md) {
                    font-size: 1.5rem;
                }

                &::before,
                &::after {
                    color: var(--ks-content-color-highlight);
                }

                &::before {
                    content: "\201C";
                    margin-right: 0.25rem;
                }

                &::after {
                    content: "\201D";
                    margin-left: 0.25rem;
                }
            }

            figcaption {
                font-family: $font-family-monospace;
                color: var(--ks-content-secondary);

                @include media-breakpoint-up(lg) {
                    font-size: 1.125rem;
                }
            }

            .small-logo {
                @include logo-svg(2rem);
            }
        }
    }

    .kpis {
        display: flex;
        gap: 2rem;
        width: 70%;
        padding: 1rem 0;
        margin: 0 auto;
        border-top: 1px solid var(--ks-border-secondary);

        @include media-breakpoint-down(sm) {
            flex-direction: column;
            gap: 1rem;
        }

        .kpi {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;

            .kpi-value {
                font-size: 2.5rem;
                font-weight: 700;
                line-height: 1.2;
            }

            span {
                font-size: $font-size-md;
                color: var(--ks-content-secondary);
            }
        }
    }

    .navigation {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.5rem;
        padding: 1rem;

        a,
        button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 32px;
            padding: 8px 16px;
            color: var(--ks-content-primary);
            text-decoration: none;
            background: none;
            border: 1px solid var(--ks-border-primary-inverse);
            border-radius: 4px;

            &:hover {
                background: var(--ks-background-purple-hover);
            }
        }

        :deep(svg) {
            font-size: 1rem;
            position: relative;
            bottom: 0;
            font-weight: 600;
        }

        a {
            width: fit-content;
            font-size: $font-size-xs;
            font-weight: bold;
        }

        button {
            width: 44px;
            cursor: pointer;

            &:disabled {
                color: var(--ks-content-secondary);
                cursor: not-allowed;
            }
        }
    }
</style>