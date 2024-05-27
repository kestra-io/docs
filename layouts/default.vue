<template>
    <div>
        <NuxtLoadingIndicator />
        <LayoutSearch />
        <LayoutAnnounce v-if="content &&  content.length > 0" :content="content" />
        <div class="wrapper" :class="{'announce': content && content.length > 0}">
            <LayoutHeader />
            <main >
                <slot />
            </main>
            <LayoutFooter />
            <LayoutFixed />
        </div>
    </div>
</template>

<script setup>
  const config = useRuntimeConfig();
  const content = ref(null);

  const {data: bannerMessages} = await useAsyncData(`banner-messages`, () => {
    return $fetch(`${config.public.apiUrl}/banner-messages`);
  });

  if(bannerMessages.value && bannerMessages.value.results) {
    content.value = bannerMessages.value.results;
  }
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
    .wrapper.announce {
        margin-top: 30px;
    }
</style>