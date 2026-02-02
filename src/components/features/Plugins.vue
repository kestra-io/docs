<template>
    <section class="features-plugins">
        <div class="container">
            <HomePlugins />
        </div>
    </section>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .features-plugins {
        background: linear-gradient(180deg, #e8eaf2 74.52%, #ffffff 74.52%);
        padding: 2rem 1rem;
        margin-top: -2rem;

        @include media-breakpoint-up(lg) {
            padding: 6rem;
        }
        text-align: center;

        .container {
            margin-bottom: 3rem;
        }
    }
</style>