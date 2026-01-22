<template>
    <section class="home-enterprise">
        <HomeEnterpriseHeaderBox />
        <HomeEnterpriseStories :stories />
    </section>
</template>

<script setup lang="ts">
    import HomeEnterpriseHeaderBox from "~/components/home/EnterpriseHeaderBox.vue"
    import HomeEnterpriseStories, { type Story } from "~/components/home/EnterpriseStories.vue"

    defineProps<{
        stories: Story[]
    }>()
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";
    .home-enterprise {
        background-color: white;
        padding: 2rem 1rem;
        @include media-breakpoint-up(lg) {
            padding: 6rem;
        }
        text-align: center;
    }
</style>