<template>
    <div>
        <NuxtLoadingIndicator />
        <LayoutSearch />
        <LayoutAnnounce v-if="showAnnounce" :content="content" />
        <div class="wrapper" :class="{'announce': showAnnounce}">
            <LayoutHeader />
            <main>
                <slot />
            </main>
            <LayoutFooter />
            <LayoutFixed />
        </div>
    </div>
</template>

<script setup>
    import {ref, watch, onMounted} from 'vue';

    const config = useRuntimeConfig();
    const content = ref(null);
    const showAnnounce = ref(false);
    const route = useRoute();

    const {data: bannerMessages} = await useCachedAsyncData(
        `header-annonces`,
        () => {
            return $fetch(`${config.public.apiUrl}/banner-messages`);
        },
        {
            serverMaxAge: 60 * 10,
        }
    );

    if (bannerMessages.value && bannerMessages.value.results) {
        content.value = bannerMessages.value.results;
    }

    const checkDisplayingAnnounce = (content, path) => {
        if (content && content.length > 0 && path === '/') {
            showAnnounce.value = true;
        } else {
            showAnnounce.value = false;
        }
    }

    checkDisplayingAnnounce(content.value, route.path);

    watch([() => route.path, content], ([newPath, newContent]) => {
        checkDisplayingAnnounce(newContent, newPath)
    });
</script>

<script>
    import {useNuxtApp} from "#app/nuxt.js";

    export default defineComponent({
        setup() {
            const nuxtApp = useNuxtApp();

            nuxtApp.hook("page:start", () => {
                document.querySelector('body').classList.add("loading");
                window.scrollTo(0, 0);
            });

            nuxtApp.hook("page:finish", () => {
                document.querySelector('body').classList.remove("loading");
            });
        },
    })
</script>


<style lang="scss">
    @import "../assets/styles/variable";

    .wrapper.announce {
        margin-top: 30px;

        nav {
            .navbar-collapse {
                @include media-breakpoint-down(lg) {
                    height: calc(100vh - 6.3rem);
                }
            }
        }
    }
</style>