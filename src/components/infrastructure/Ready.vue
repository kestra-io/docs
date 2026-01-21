<template>
    <section class="ready">
        <div class="container">
            <div class="logo-bg" data-usal="fade-u">
                <NuxtImg src="/landing/infrastructure/tilt-logo.png" width="182" />
            </div>
            <h3 data-usal="fade-u delay-100">
                Ready to modernize provisioning and Day-2 operations?
            </h3>
            <p data-usal="fade-u delay-200">Teams replace vRO, AutoSys, Cron, Jenkins, and manual scripts
                with Kestra, without changing their tools.
            </p>
            <div class="d-flex" data-usal="fade-u delay-300">
                <NuxtLink href="/demo" class="btn btn-primary btn-gradient">Book a demo</NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    //  NOOP
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .ready {
        background: url('/landing/infrastructure/bg-foot.png') no-repeat center center;
        background-size: cover;
        text-align: center;
        color: $white;
        padding-bottom: 4rem;

        .container {
            @include media-breakpoint-up(md) {
                max-width: 543px;
            }

            margin: 0 auto;

            .logo-bg {
                background: url('/landing/infrastructure/logo-bg.png') no-repeat center center;
                background-size: contain;
                display: flex;
                justify-content: center;
                align-items: center;
                padding-top: 4rem;
            }

            h3 {
                margin-top: -2rem;
                font-weight: 600;
                font-size: 38px;
                line-height: 100%;
                margin-bottom: 20px;
            }

            p {
                margin-bottom: 20px;
            }

            .d-flex {
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }
</style>