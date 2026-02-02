<template>
    <section class="logos-bg">
        <div class="logo-wrapper">
            <h2 class="center-text">Trusted by Industry Leaders</h2>
            <div
                v-for="(img, index) in logos?.slice(0, 20)"
                :key="img.name"
                class="logo-box"
                :class="{ 'hide-small': index > 17 }"
            >
                <img :src="img.url" :alt="img.name" />
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
    defineProps<{
        // list of companies with name and logo url
        logos: Array<{
            name: string
            url: string
        }>
    }>()
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";
    .logos-bg {
        background-color: #fcfcfd;
        @include media-breakpoint-up(md) {
            padding: 2rem;
        }
    }

    .logo-wrapper {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        @include media-breakpoint-up(xl) {
            grid-template-columns: repeat(6, 1fr);
            width: 1146px;
        }
        gap: 1px;
        background: radial-gradient(#e1e1e1 0%, #e1e1e1 30%, #e1e1e101 80%, #e1e1e100 100%)
            no-repeat center;
        margin: 0 auto;
    }

    .logo-box {
        background-color: #fcfcfd;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 90px;
        &.hide-small {
            display: none;
            @include media-breakpoint-up(xl) {
                display: flex;
            }
        }
        img {
            max-width: 70%;
            max-height: 50%;
        }
    }

    .center-text {
        grid-column: 1 / 4;
        grid-row: 4 / 6;
        @include media-breakpoint-up(xl) {
            grid-column: 3 / 5;
            grid-row: 2 / 4;
        }
        text-align: center;
        padding: 1rem;
        background-color: #fcfcfd;
        font-weight: 700;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.5rem;
        margin: 0;
        @include media-breakpoint-up(md) {
            font-size: 2rem;
            padding: 2rem 3rem;
            line-height: 2.5rem;
        }
        padding: 2rem 1rem;
        color: black;
    }
</style>