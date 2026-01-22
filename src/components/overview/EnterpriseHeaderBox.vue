<template>
    <section class="overview-box">
        <HomeEnterpriseHeaderBox />
    </section>
</template>

<script lang="ts" setup>
    import HomeEnterpriseHeaderBox from "~/components/home/EnterpriseHeaderBox.vue"
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";
    .overview-box {
        background-color: $white;
        padding: 2rem 1rem;
        @include media-breakpoint-up(lg) {
            padding: 6rem;
        }
        text-align: center;
    }
</style>