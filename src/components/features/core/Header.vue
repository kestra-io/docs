<template>
    <section :class="['main-header', { scrolled: isScrolled }]">
        <div class="background"></div>
        <div class="hero container">
            <div class="text-block">
                <h6 class="highlight" data-usal="fade-down">Core Features</h6>
                <h1 data-usal="zoomin">
                    <span class="d-none d-lg-inline">Fast, Scalable, Declarative Orchestrator</span>
                    <span class="d-lg-none">
                        Fast, Scalable,<br />
                        Declarative<br />
                        Orchestrator
                    </span>
                </h1>
                <div class="buttons" data-usal="fade-up">
                    <a href="/demo" class="btn btn-lg btn-secondary me-3" target="_blank">
                        Talk to us
                    </a>
                    <a href="/docs/quickstart#start-kestra" class="btn btn-lg btn-primary">
                        Get Started!
                    </a>
                </div>
            </div>
            <div class="img-block" data-usal="fade-up">
                <NuxtImg
                    src="/landing/features/application.png"
                    width="100%"
                    height="100%"
                    alt="Kestra"
                    class="img-fluid d-none d-sm-block"
                />
                <NuxtImg
                    src="/landing/features/mobile-app.png"
                    alt="Kestra"
                    class="d-sm-none sm-app-border img-fluid"
                    loading="lazy"
                />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { useWindowScroll } from "@vueuse/core"
    import { computed } from "vue"

    const { y } = useWindowScroll()
    const isScrolled = computed(() => y.value > 50)
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .main-header {
        position: relative;
        width: 100%;
        overflow: hidden;
        .background {
            position: fixed;
            inset: 0;
            z-index: -1;
            background: var(--ks-background-artwork);
            pointer-events: none;
            @media screen and (max-width: 991px) {
                background:
                    url("/landing/features/sm-gradient.png") right/cover no-repeat;
                background-color: var(--ks-background-artwork);
            }
            @include media-breakpoint-up(lg) {
                background:
                    url("/landing/features/feature_gradients.svg") top/cover;
                background-color: var(--ks-background-artwork);
            }
        }
        .hero {
            position: relative;
            padding: 3rem 0 0;
        }
        .text-block {
            position: relative;
            z-index: 10;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            @include media-breakpoint-up(md) {
                margin: 4rem 0;
            }
            gap: 20px;
        }
        h6 {
            font-size: 18.4px !important;
            margin: 0;
        }
        h1 {
            color: $white;
            text-align: center;
            font-weight: 600;
            font-size: 35px;
            max-width: 100%;
            padding: 0;
            margin: 0;
            @include media-breakpoint-up(md) {
                font-size: 4rem;
                line-height: 1.2;
                max-width: 800px;
            }
        }
        .buttons {
            text-align: center;
            margin-top: 3rem;
            @media screen and (min-width: 380px) {
                margin: 1.5rem 0;
            }
            white-space: nowrap;
            .btn {
                border-radius: 8px;
            }
        }
        .img-block {
            position: relative;
            display: flex;
            justify-content: center;
            margin-bottom: -0.25rem;
            @include media-breakpoint-down(sm) {
                justify-content: end;
            }
            border: 1px solid;
            border-image-source: radial-gradient(
                46.16% 31.1% at 73.05% 39.82%,
                #2b313e 0%,
                #6b66d5 44.15%,
                #2d344e 100%
            );
            .sm-app-border {
                border: 0.39px solid;
                border-image-source: radial-gradient(
                    46.16% 31.1% at 73.05% 39.82%,
                    #2b313e 0%,
                    #6b66d5 44.15%,
                    #2d344e 100%
                );
                padding-left: 24px;
                @media screen and (min-width: 301px) {
                    padding-left: 24px;
                }
                @media screen and (max-width: 576px) {
                    margin-top: 1.25rem;
                }
            }
            @include media-breakpoint-up(lg) {
                &::after {
                    content: "";
                    position: absolute;
                    bottom: -12.5rem;
                    left: 0;
                    right: 0;
                    height: 100%;
                    background: url("/landing/features/overlay_ellipse.png") bottom center/cover
                        no-repeat;
                    opacity: 0.85;
                    pointer-events: none;
                }
            }
        }
    }
</style>