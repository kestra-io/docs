<template>
    <div>
        <NuxtLoadingIndicator />
        <LayoutSearch />
        <LayoutAnnounce v-show="showAnnounce" :content="content" :scrolled="scrolled" />
        <div class="wrapper" :class="{'announce': showAnnounce}">
            <LayoutHeader :scrolled :nuxtApp />
            <main>
                <slot />
            </main>
            <LayoutFooter :class="{ 'plugins-page': isPluginsPage }" />
            <LayoutFixed />
        </div>
    </div>
</template>

<script lang="ts" setup>
    import {useNuxtApp} from "#app";
    import { NuxtLink } from "#components";
    import { linkSymbolInjectionKey } from "~/components/layout/Header.vue";
    const config = useRuntimeConfig();
    const route = useRoute();
    const scrolled = ref(false)
    provide(linkSymbolInjectionKey, NuxtLink)

    const {data: bannerMessages} = await useCachedAsyncData<{results: Record<string, any>}>(
        `header-annonces`,
        () => {
            return $fetch(`${config.public.apiUrl}/banner-messages`);
        },
        {
            clientMaxAge: 30, // cache on client for 30 seconds
            serverMaxAge: 60 * 10,
        }
    );

    const content = computed(() => {
        return bannerMessages.value?.results ?? {};
    })

    const handleScroll = () => {
      scrolled.value = window.scrollY > 20
    }

    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    const showAnnounce = computed(() => {
        const innerContent = content.value;
        const path = route.path;
        return innerContent && innerContent.length > 0 && path === '/'
    })

    const isPluginsPage = computed(() => route.path.startsWith('/plugins'))

    const nuxtApp = useNuxtApp();

    nuxtApp.hook("page:start", () => {
        document.documentElement.classList.add("loading");
        window.scrollTo(0, 0);
    });

    nuxtApp.hook("page:finish", () => {
        document.documentElement.classList.remove("loading");
    });
</script>

<style lang="scss">
    @import "../assets/styles/variable";

    .wrapper.announce {

        nav {
            .navbar-collapse {
                @include media-breakpoint-down(lg) {
                    height: calc(100vh - 6.3rem);
                }
            }
        }
    }
</style>