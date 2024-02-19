<template>
    <div class="section">
        <img class="img-fluid" src="/landing/usecases/cicd/monograme.svg" alt="Monograme" />
        <h2 data-aos="fade-left">{{ title }}</h2>
        <p class="text-center" data-aos="fade-right">{{ subtitle }}</p>
        <div class="text-center cta">
            <NuxtLink href="/docs/getting-started" class="btn btn-animated btn-purple-animated" data-aos="zoom-in">
                Get started
            </NuxtLink>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                required: false,
            },
            subtitle: {
                type: String,
                required: false,
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .section {
        color: $white;
        padding-top: $rem-2;
        padding-bottom: $rem-2;
        padding-left: calc($rem-6 * 5);
        padding-right: calc($rem-6 * 5);
        text-align: center;
        border-radius: 8px;
        background: $black-2 url("/landing/usecases/cicd/empower-bg.svg") no-repeat;

        @include media-breakpoint-down(md) {
            padding-left: $rem-1;
            padding-right: $rem-1;
        }

        .main {
            padding-top: 0;
        }

        h2 {
            font-size: $h3-font-size;
            font-weight: 600;
            margin-bottom: 16px;
        }
    }
</style>