<template>
    <div class="container py-5 d-flex flex-column">
        <h2 class="title text-center">Getting started with Kestra</h2>
        <div class="text-center cta ">
            <NuxtLink href="/docs" target="_blank" class="btn btn-dark me-2 mb-2" data-aos="zoom-in">
                Read the Documentation
            </NuxtLink>
            <NuxtLink href="/docs/getting-started" class="btn btn-primary mb-2" data-aos="zoom-in">
                Try Kestra Now
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container {
        background: $purple-8;
        background-image:  url("/landing/dot2.svg");
        background-repeat: no-repeat;
        background-position: 70% 80%;
        color: var(--bs-black);
        margin-bottom: calc($spacer * 2);
        border-radius: 0.625rem;
        row-gap: 1rem;

        :deep(p.baseline) {
            color: var(--bs-black);
        }
    }
    .title{
        font-size: $font-size-2xl;
    }
</style>