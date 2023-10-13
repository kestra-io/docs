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
        background: $purple-8 url("/landing/dot2.svg") no-repeat bottom right;
        color: var(--bs-black);
        padding-left: calc($spacer * 4);
        padding-right: calc($spacer * 4);
        margin-bottom: calc($spacer * 2);
        border-radius: 10px;
        row-gap: $font-size-base;

        :deep(p.baseline) {
            color: var(--bs-black);
        }
    }
    .title{
        font-size: $font-size-2xl;
    }
</style>