<template>
    <pre v-if="error">{{ error }}</pre>
    <div class="enterprise-stories" @scroll="scrollHandler" ref="scroller">
        <div v-for="story of stories" class="story">
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
        <button v-for="storyIndex of (stories?.length ?? 0)" :class="{active: storyIndex === activeStory}" @click="scrollTo(storyIndex)"/>
    </div>

</template>

<script lang="ts" setup>
    import {slugify} from "@kestra-io/ui-libs";
    const config = useRuntimeConfig();

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

    const activeStory = ref<number>(1);
    const scroller = ref<HTMLDivElement | null>(null);

    const {data, error} = await useFetch<{results: Story[]}>(`${config.public.apiUrl}/customer-stories-v2?featured=true`)

    const stories = computed(() => data.value?.results);

    function scrollHandler(e: Event) {
        const target = e.target as HTMLElement;
        const scroll = target.scrollLeft;
        const width = target.scrollWidth
        const story = Math.round(scroll / width * (stories.value?.length ?? 0));
        activeStory.value = story + 1;
    }

    function scrollTo(index: number) {
        if (!scroller.value) {
            return;
        }

        // get the scroll
        const story = scroller.value.childNodes[index]
        if (!story || !(story instanceof HTMLElement)) {
            return;
        }

        // get the scroll position of this story element
        const scroll = story.getBoundingClientRect().left - scroller.value.getBoundingClientRect().left + scroller.value.scrollLeft;
        scroller.value.scrollTo({
            left: scroll,
            behavior: 'smooth'
        });
    }
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