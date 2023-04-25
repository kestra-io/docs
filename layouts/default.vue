<template>
    <div>
        <NuxtLoadingIndicator />
        <LayoutHeader />
        <main>
            <slot />
        </main>
        <LayoutFooter />
        <LayoutFixed />
    </div>
</template>

<script>
    import {useNuxtApp} from "#app/nuxt.js";

    export default defineComponent({
        setup() {
            const nuxtApp = useNuxtApp();

            nuxtApp.hook("page:start", () => {
                document.querySelector('body').classList.add("loading");
            });

            nuxtApp.hook("page:finish", () => {
                document.querySelector('body').classList.remove("loading");
            });

            return {}
        },
    })
</script>
