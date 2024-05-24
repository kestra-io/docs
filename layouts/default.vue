<template>
    <div>
        <NuxtLoadingIndicator />
        <LayoutSearch />
        <LayoutAnnounce v-if="content.data.length > 0" :content="content" :alertHide="alertHide"/>
        <div class="wrapper" :class="{'announce': content.data.length > 0}">
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
        data() {
            return {
              content: {
                background: '#8405FF',
                data: [
                  {
                    id: 1,
                    text: 'Kestra raises $5 million to grow',
                    href: '/blogs/2023-10-05-announcing-kestra-funding-to-build-the-universal-open-source-orchestrator',
                    linkText: 'Learn more',
                  },
                  {
                    id: 2,
                    text: 'Kestra raises $15 million to grow',
                    href: '/blogs/2023-10-05-announcing-kestra-funding-to-build-the-universal-open-source-orchestrator',
                    linkText: 'Learn more',
                  },
                  {
                    id: 3,
                    text: 'Kestra raises $30 million to grow',
                    href: '/blogs/2023-10-05-announcing-kestra-funding-to-build-the-universal-open-source-orchestrator',
                    linkText: 'Learn more',
                  },
                ]
              },
            };
        },
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
        methods: {
            alertHide() {
                this.content.showTopBanner = false;
            },
        }
    })
</script>


<style lang="scss">
    .wrapper.announce {
        margin-top: 30px;
    }
</style>