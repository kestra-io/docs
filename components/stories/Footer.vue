<template>
    <div class="container py-5 d-flex flex-column">
        <h2 class="title text-center">Getting started with Kestra</h2>
        <p class="sub-title text-center">Start building with Kestra — Automate Everything Everywhere All at Once.</p>
        <div class="text-center cta ">
            <NuxtLink href="/docs" target="_blank" class="btn btn-dark me-2 mb-2" data-aos="zoom-in">
                Read the docs
            </NuxtLink>
            <NuxtLink href="/docs/getting-started" class="btn btn-animated btn-purple-animated mb-2" data-aos="zoom-in">
                Get started
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container {
        background: $black-2 url("/landing/plugins/footer-bg.svg") no-repeat right;
        background-size: 20% 100%;
        margin-bottom: calc($spacer * 2);
        border: $block-border;
        border-radius: 0.5rem;
        row-gap: 1rem;
        color: $white;

        .title{
            color: $white;
            font-size: $h3-font-size;
            font-weight: 100;
            margin-bottom: 0;
        }
        .sub-title {
            color: $white;
            font-size: $h6-font-size;
            font-weight: 300;
            margin-bottom: 0;
        }
    }
</style>