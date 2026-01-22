<template>
    <section class="home-enterprise">
        <HomeEnterpriseHeaderBox />
    </section>
</template>

<script setup lang="ts">
    import HomeEnterpriseHeaderBox from "~/components/home/EnterpriseHeaderBox.vue"
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