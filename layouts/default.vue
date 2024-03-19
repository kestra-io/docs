<template>
    <div>
        <NuxtLoadingIndicator />
        <LayoutSearch />
        <LayoutAnnounce v-if="topBanner !== 'ok' && false" />
        <div class="wrapper" :class="{'announce': topBanner !== 'ok' && false}">
            <LayoutHeader />
            <main >
                <slot />
            </main>
            <LayoutFooter />
            <LayoutFixed />
        </div>
    </div>
</template>

<script>
    import {useNuxtApp} from "#app/nuxt.js";

    export default defineComponent({
        setup() {
            const nuxtApp = useNuxtApp();

            const topBanner = useCookie('top-banner', {watch: true});

            nuxtApp.hook("page:start", () => {
                document.querySelector('body').classList.add("loading");
                window.scrollTo(0, 0);
            });

            nuxtApp.hook("page:finish", () => {
                document.querySelector('body').classList.remove("loading");
            });

            return {topBanner}
        },
    })
</script>


<style lang="scss">
    .wrapper.announce {
        margin-top: 30px;
    }
</style>