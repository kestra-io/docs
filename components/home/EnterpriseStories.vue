<template>
    <pre v-if="error">{{ error }}</pre>
    <div class="enterprise-stories" @scroll="scrollHandler" ref="scroller">
        <div v-for="story of stories" class="story" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
            <h2><span>{{ story.companyName }}</span> & Kestra: {{ story.title }}</h2>
            <div class="use-case">
                <NuxtImg width="538" :src="story.heroImage" alt="Hero Image"/>
                <div class="quote-box">
                    <img :src="story.logoDark" alt="Logo"/>
                    <q>{{ story.quote.replace(/[“”"]/g, "").trim() }}</q>
                    <p class="author">{{ story.quotePerson }}</p>
                    <p class="title">{{ story.quotePersonTitle }}</p>
                    <NuxtLink :href="`/use-cases/stories/${story.id}-${slugify(story.title)}`" class="btn btn-lg btn-secondary">Read the Story</NuxtLink>
                </div>
            </div>
        </div>
    </div>

    <div class="dots">
        <button v-for="storyIndex of (stories?.length ?? 0)" :key="storyIndex" :class="{active: storyIndex - 1 === activeStory}" @click="manualScrollTo(storyIndex - 1)" />
    </div>

</template>

<script lang="ts" setup>
    import {slugify} from "@kestra-io/ui-libs";
    const config = useRuntimeConfig();

    const AUTO_SCROLL = 2000;
    const SCROLL_TRANSITION = 1000;

    interface Story {
        id: string;
        title: string;
        description: string;
        quote: string;
        quotePerson: string;
        quotePersonTitle: string;
        companyName: string;
        featuredImage: string;
        heroImage: string;
        logoDark: string;
    }

    const activeStory = ref<number>(0);
    const scroller = ref<HTMLDivElement | null>(null);
    const timers = ref<{ auto: NodeJS.Timeout | null; user: NodeJS.Timeout | null }>({ auto: null, user: null });
    const isScrolling = ref(false);
    const isHovering = ref(false);
    const isManualChange = ref(false);

    const {data, error} = await useFetch<{results: Story[]}>(`${config.public.apiUrl}/customer-stories-v2?featured=true`);
    const stories = computed(() => data.value?.results);

    const clearTimers = () => {
        if (timers.value.auto) clearInterval(timers.value.auto);
        if (timers.value.user) clearTimeout(timers.value.user as NodeJS.Timeout);
        timers.value = { auto: null, user: null };
    };

    const startAutoScroll = (delay: number = AUTO_SCROLL) => {
        if (isScrolling.value || !stories.value?.length || isHovering.value || isManualChange.value) return;
        clearTimers();

        timers.value.auto = setInterval(() => {
            if (!stories.value?.length || isHovering.value) {
                clearTimers();
                return;
            }
            scrollTo((activeStory.value + 1) % stories.value.length);
        }, delay);
    };

    const handleScrollReset = () => {
        if (timers.value.user) clearTimeout(timers.value.user as NodeJS.Timeout);
        timers.value.user = setTimeout(() => {
            isManualChange.value = false;
            startAutoScroll();
        }, AUTO_SCROLL);
    };

    const scrollHandler = (e: Event) => {
        if (isScrolling.value || !stories.value?.length || isManualChange.value) return;
        clearTimers();

        const target = e.target as HTMLElement;
        if (target.scrollWidth === 0) return;

        const storyWidth = target.scrollWidth / stories.value.length;
        const newActiveStory = Math.max(0, Math.min(
            Math.round(target.scrollLeft / storyWidth),
            stories.value.length - 1
        ));

        if (newActiveStory !== activeStory.value) {
            activeStory.value = newActiveStory;
        }

        handleScrollReset();
    };

    const scrollTo = (index: number) => {
        if (!scroller.value || !stories.value?.length || 
            index < 0 || index >= stories.value.length || 
            isScrolling.value) return;

        clearTimers();
        isScrolling.value = true;
        activeStory.value = index;

        scroller.value.scrollTo({
            left: (scroller.value.scrollWidth / stories.value.length) * index,
            behavior: 'smooth'
        });

        setTimeout(() => {
            isScrolling.value = false;
            handleScrollReset();
        }, SCROLL_TRANSITION);
    };

    const manualScrollTo = (index: number) => {
        isManualChange.value = true;
        clearTimers();
        scrollTo(index);
    };

    watch(isHovering, (newValue) => {
        if (newValue) {
            clearTimers();
        } else if (!isManualChange.value) {
            startAutoScroll(AUTO_SCROLL);
        }
    });

    onMounted(() => {
        startAutoScroll();
    });

    onUnmounted(clearTimers);
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";
    .enterprise-stories {
        background-color: white;
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
        @include media-breakpoint-up(lg){
            width: 80vw;
            margin: 0 auto;
            gap: 3rem;
            padding: 6rem;
            padding-bottom: 1rem;
        }
        pre{
            text-align: left;
        }
        .story {
            width: 90vw;
            max-width: 1140px;
            @include media-breakpoint-up(lg){
                width: 80vw;
            }
            flex-shrink: 0;
            scroll-snap-align: end;
            h2{
                font-weight: 600;
                font-size: 2rem;
                text-wrap: balance;
                width: 90%;
                span {
                    background: linear-gradient(90deg, #7C2EEA 0%, #658AF9 100%) no-repeat center;
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
                @include media-breakpoint-up(lg){
                    flex-direction: row;
                }
                gap: 2rem;
                img {
                    width: 100%;
                    max-width: 538px;
                    border-radius: 1rem;
                }
                q {
                    color: #1d1d1e;
                }
                .quote-box{
                    text-align: left;
                    position: relative;
                    img{
                        object-fit: contain;
                        object-position: left;
                        max-height: 50px;
                        max-width: 100px;
                        @include media-breakpoint-up(lg){
                            max-height: 65px;
                            max-width: 150px;
                        }
                        margin: 0;
                        display: block;
                        border-radius: 0;
                        margin-bottom: .5rem;
                    }

                    .author{
                        font-weight: 600;
                        margin: 0;
                        margin-top: 1rem;
                        line-height: 1.2rem;
                    }

                    .title{
                        font-size: 12px;
                        margin-top: 0;
                    }

                    a{
                        position: absolute;
                        bottom: 0;
                        right: 0;
                        @include media-breakpoint-up(lg){
                            position: static;
                        }
                    }
                }
            }
        }
    }

    .dots{
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: 1rem;
        > button{
            width: 10px;
            height: 10px;
            background-color: #E3E3E3;
            border-radius: 50%;
            border: none;
            padding: 0;
        }
        > button.active{
            background-color: #969393;
        }
    }
</style>