<template>
    <div>
        <NuxtLoadingIndicator />
        <LayoutSearch />
        <LayoutAnnounce v-show="showAnnounce" :content="content" :scrolled="isScrolled" />
        <div class="wrapper" :class="{'announce': showAnnounce}">
            <LayoutHeader :scrolled="isScrolled" />
            <main>
                <slot />
            </main>
            <LayoutFooter />
            <LayoutFixed />
        </div>
    </div>
</template>

<script lang="ts" setup>
    import {useNuxtApp} from "#app/nuxt.js";
    const config = useRuntimeConfig();
    const route = useRoute();
    const isScrolled = ref(false)

    const {data: bannerMessages} = await useCachedAsyncData<{results: Record<string, any>}>(
        `header-annonces`,
        () => {
            return $fetch(`${config.public.apiUrl}/banner-messages`);
        },
        {
            serverMaxAge: 60 * 10,
        }
    );

    const content = computed(() => {
        return bannerMessages.value?.results ?? {};
    })

    const handleScroll = () => {
      isScrolled.value = window.scrollY > 20
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