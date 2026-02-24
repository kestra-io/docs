<template>
    <pre v-if="error">{{ error }}</pre>
    <div class="stories" @scroll="scrollHandler" ref="scroller">
        <div
            v-for="story of stories"
            class="story"
            @mouseenter="isHovering = true"
            @mouseleave="isHovering = false"
        >
            <h2>
                <span>{{ story.companyName }}</span> & Kestra: {{ story.title }}
            </h2>
            <div class="use-case">
                <NuxtImg width="538" :src="story.heroImage" alt="Hero Image" />
                <div class="quote-box">
                    <img v-if="story.logo" :src="story.logo" alt="Logo" class="logo-light" />
                    <img v-if="story.logoDark" :src="story.logoDark" alt="Logo" class="logo-dark" />
                    <q>{{ story.quote.replace(/[“”"]/g, "").trim() }}</q>
                    <p class="author">{{ story.quotePerson }}</p>
                    <p class="title">{{ story.quotePersonTitle }}</p>
                    <a
                        :href="`/use-cases/stories/${story.id}-${slugify(story.title)}`"
                        class="btn btn-lg btn-secondary"
                        >Read the Story</a
                    >
                </div>
            </div>
        </div>
    </div>

    <div class="dots">
        <button
            v-for="(story, index) in stories"
            :key="story.id"
            :class="{ active: index === activeStory }"
            @click="manualScrollTo(index)"
        />
    </div>
</template>

<script lang="ts" setup>
    import { slugify } from "@kestra-io/ui-libs"
    import { onMounted, onUnmounted, ref, watch } from "vue"

    const props = defineProps<{
        stories: Story[]
        error?: string
    }>()

    const AUTO_SCROLL = 2000
    const SCROLL_TRANSITION = 1000

    export interface Story {
        id: string
        title: string
        content: string
        description: string
        quote: string
        quotePerson: string
        quotePersonTitle: string
        companyName: string
        featuredImage: string
        heroImage: string
        logo: string
        logoDark: string
        kpi1: string
        kpi2: string
        kpi3: string
        industry: string
        headquarter: string
        solution: string
        tasks: string[]
    }

    const activeStory = ref<number>(0)
    const scroller = ref<HTMLDivElement | null>(null)
    const timers = ref<{
        auto: NodeJS.Timeout | null
        user: NodeJS.Timeout | null
    }>({ auto: null, user: null })
    const isScrolling = ref(false)
    const isHovering = ref(false)
    const isManualChange = ref(false)

    const clearTimers = () => {
        if (timers.value.auto) clearInterval(timers.value.auto)
        if (timers.value.user) clearTimeout(timers.value.user as NodeJS.Timeout)
        timers.value = { auto: null, user: null }
    }

    const startAutoScroll = (delay: number = AUTO_SCROLL) => {
        if (isScrolling.value || !props.stories?.length || isHovering.value || isManualChange.value)
            return
        clearTimers()

        timers.value.auto = setInterval(() => {
            if (!props.stories?.length || isHovering.value) {
                clearTimers()
                return
            }
            scrollTo((activeStory.value + 1) % props.stories.length)
        }, delay)
    }

    const handleScrollReset = () => {
        if (timers.value.user) clearTimeout(timers.value.user as NodeJS.Timeout)
        timers.value.user = setTimeout(() => {
            isManualChange.value = false
            startAutoScroll()
        }, AUTO_SCROLL)
    }

    const scrollHandler = (e: Event) => {
        if (isScrolling.value || !props.stories?.length || isManualChange.value) return
        clearTimers()

        const target = e.target as HTMLElement
        if (target.scrollWidth === 0) return

        const storyWidth = target.scrollWidth / props.stories.length
        const newActiveStory = Math.max(
            0,
            Math.min(Math.round(target.scrollLeft / storyWidth), props.stories.length - 1),
        )

        if (newActiveStory !== activeStory.value) {
            activeStory.value = newActiveStory
        }

        handleScrollReset()
    }

    const scrollTo = (index: number) => {
        if (
            !scroller.value ||
            !props.stories?.length ||
            index < 0 ||
            index >= props.stories.length ||
            isScrolling.value
        )
            return

        clearTimers()
        isScrolling.value = true
        activeStory.value = index

        scroller.value.scrollTo({
            left: (scroller.value.scrollWidth / props.stories.length) * index,
            behavior: "smooth",
        })

        setTimeout(() => {
            isScrolling.value = false
            handleScrollReset()
        }, SCROLL_TRANSITION)
    }

    const manualScrollTo = (index: number) => {
        isManualChange.value = true
        clearTimers()
        scrollTo(index)
    }

    watch(isHovering, (newValue) => {
        if (newValue) {
            clearTimers()
        } else if (!isManualChange.value) {
            startAutoScroll(AUTO_SCROLL)
        }
    })

    onMounted(() => {
        startAutoScroll()
    })

    onUnmounted(clearTimers)
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";
    .stories {
        background-color: var(--ks-background-body);
        padding: 1rem;
        overflow: scroll;
        scrollbar-width: none;
        scroll-snap-type: x mandatory;
        text-align: center;
        display: flex;
        flex-wrap: nowrap;
        width: 90vw;
        max-width: 1140px;
        gap: 1rem;
        @include media-breakpoint-up(lg) {
            width: 80vw;
            margin: 0 auto;
            gap: 3rem;
            padding: 4rem;
            padding-bottom: 1rem;
        }
        pre {
            text-align: left;
        }
        .story {
            width: 90vw;
            max-width: 1140px;
            @include media-breakpoint-up(lg) {
                width: 80vw;
            }
            flex-shrink: 0;
            scroll-snap-align: end;
            h2 {
                font-weight: 600;
                font-size: 2rem;
                text-wrap: balance;
                width: 90%;
                span {
                    background: linear-gradient(90deg, #7c2eea 0%, #658af9 100%) no-repeat center;
                    background-size: cover;
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            }
            .use-case {
                margin-top: 2rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                @include media-breakpoint-up(lg) {
                    flex-direction: row;
                }
                gap: 2rem;
                img {
                    width: 100%;
                    max-width: 538px;
                    border-radius: 1rem;
                }
                q {
                    color: var(--kestra-io-neutral-gray300);
                }
                .quote-box {
                    text-align: left;
                    position: relative;
                    img {
                        object-fit: contain;
                        object-position: left;
                        max-height: 50px;
                        max-width: 100px;
                        @include media-breakpoint-up(lg) {
                            max-height: 65px;
                            max-width: 150px;
                        }
                        margin: 0;
                        display: block;
                        border-radius: 0;
                        margin-bottom: 0.5rem;
                        &.logo-dark {
                            display: none;
                            html.light & {
                                display: block;
                            }
                        }
                        &.logo-light {
                            display: block;
                            html.light & {
                                display: none;
                            }
                        }
                    }
                    .author {
                        font-weight: 600;
                        margin: 0;
                        margin-top: 1rem;
                        line-height: 1.2rem;
                    }
                    .title {
                        font-size: 12px;
                        margin-top: 0;
                    }
                    a {
                        position: absolute;
                        bottom: 0;
                        right: 0;
                        @include media-breakpoint-up(lg) {
                            position: static;
                        }
                    }
                }
            }
        }
    }

    .dots {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: 1rem;
        > button {
            width: 10px;
            height: 10px;
            background-color: #e3e3e3;
            border-radius: 50%;
            border: none;
            padding: 0;
        }
        button.active {
            background-color: #969393;
        }
    }
</style>