<template>
    <div class="container-fluid container">
        <div class="hero hero-sm mx-2 sm-mx-0">
            <div class="row" data-aos="fade-right">
                <div class="col-12 col-md-8 col-lg-6 order-1 order-md-0">
                    <h1>Kestra Terraform Provider: Deploy All Your Workflows <br /> in a CI/CD Process</h1>
                    <p>Manage and deploy Kestra workflows directly within your existing Terraform environment, eliminating
                        the need for separate configurations.</p>
                    <div class="d-flex flex-wrap gap-2">
                        <NuxtLink href="https://github.com/kestra-io/kestra">
                            <button class="btn btn-primary btn-lg">Get Started</button>
                        </NuxtLink>
                        <NuxtLink href="/docs/terraform">
                            <button class="btn-animated btn-purple-animated btn btn-secondary btn-lg">Read the docs</button>
                        </NuxtLink>
                    </div>
                </div>
                <div class="order-0 order-md-1 d-flex d-md-none img-container">
                    <img class="img-fluid" src='/terraform/header/background.svg'
                        alt="terraform logo with a dark background" data-aos="zoom-in" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import "../../assets/styles/variable";

.container-fluid {
    background: url('/terraform/header/background.svg') no-repeat right !important;

    @include media-breakpoint-down(md) {
        background-image: none !important;
    }

    h1 {
        font-size: $h2-font-size !important;
        font-weight: 900 !important;
    }

    p {
        font-size: $font-size-xl;
    }

    @include media-breakpoint-up(sm) {
        h1 {
            font-size: $h1-font-size !important;
        }
    }

    .img-container {
        position: relative;
        transform: scale(1.6);
        margin-bottom: 50px;
        left: -290px;
        transform-origin: 30% 20%;
    }
}
</style>