<template>
<div class="container text-center rounded-3 mt-5 mb-5 bg-dark-2 d-flex flex-column gap-2 align-items-center">
    <h3 data-aos="fade-right">New to Kestra?</h3>
    <h6 class="mt-3" data-aos="zoom-in">Use blueprints to kickstart your first workflows.</h6>
    <NuxtLink href="/docs/getting-started" class="btn btn-animated btn-purple-animated">
        Get started with Kestra
    </NuxtLink>
</div>
</template>

<style scoped lang="scss">
@import "../../assets/styles/variable";

.container {
    border: $block-border;
    padding: $rem-2;
    background: $black-2 url("/landing/plugins/footer-bg.svg") no-repeat right;
    background-size: 20% 100%;

    h3, h6 {
        margin: 0 !important;
        color: $white;
        text-align: center;
    }

    h3 {
        font-size: $h3-font-size;
        font-weight: 100;
    }

    h6 {
        font-size: $font-size-xl;
        font-weight: 300;
    }

    @include media-breakpoint-down(sm) {
        max-width: 80%
    }
}

</style>