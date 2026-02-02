<template>
    <section class="main">
        <div class="container">
            <div class="d-flex flex-column align-items-center justify-content-center">
                <NuxtImg
                    src="/landing/onezero/one.png"
                    alt="1-0"
                    format="webp"
                    loading="lazy"
                    class="img-fluid"
                    data-usal="zoomin"
                    width="619px"
                    height="326px"
                />
                <div class="text-block" data-usal="fade-u delay-200">
                    <h1>Introducing Kestra 1.0</h1>
                    <h3>The Declarative Agentic Orchestration Platform</h3>
                    <p>
                        Build and scale workflows faster with AI-assisted code, autonomous agents,
                        and production-ready features. Scale AI workflows in days instead of weeks
                        with full governance and no vendor lock-in.
                    </p>
                </div>
                <div data-usal="fade-u delay-400">
                    <a href="/demo" target="_blank" class="btn btn-primary my-4 mb-2">
                        Book a Strategy Session
                    </a>
                </div>
                <div class="highlights" data-usal="fade-u delay-300">
                    <div
                        v-for="({ title }, index) of releaseHighlights"
                        :key="title"
                        class="highlight"
                        :data-usal="`zoomin delay-${500 + index * 100}`"
                    >
                        <p>{{ title }}</p>
                    </div>
                </div>
                <div class="trusted-by" data-usal="fade-u delay-100">
                    <p>Trusted by global Enterprises to run mission-critical workflows</p>
                    <div class="logos">
                        <img
                            v-for="(logo, index) in companyLogos"
                            :key="logo.name"
                            :src="logo.src"
                            :alt="logo.name"
                            :width="logo.width"
                            :height="logo.height"
                            loading="lazy"
                            :data-usal="`fade-u delay-${500 + index * 50}`"
                        />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { computed } from "vue"
    import { usePluginsCount } from "~/composables/usePluginsCount"

    const { totalPlugins } = usePluginsCount()

    const releaseHighlights = computed(() => [
        { title: "LTS Release" },
        { title: "Apache 2.0 License" },
        { title: `${totalPlugins.value} Plugins` },
        { title: "Deploy anywhere" },
    ])

    const companyLogos = [
        {
            name: "Apple",
            src: "/landing/onezero/apple.svg",
            width: 33,
            height: 39,
        },
        {
            name: "Toyota",
            src: "/landing/onezero/toyota.svg",
            width: 152.78,
            height: 25.13,
        },
        {
            name: "Acxiom",
            src: "/landing/onezero/acxiom.svg",
            width: 152,
            height: 38,
        },
        {
            name: "Deutsche",
            src: "/landing/onezero/deutsche.svg",
            width: 104.27,
            height: 40.6,
        },
        {
            name: "Bloomberg",
            src: "/landing/onezero/bloomberg.svg",
            width: 130,
            height: 24,
        },
        {
            name: "Fila",
            src: "/landing/onezero/fila.svg",
            width: 72.06,
            height: 24.37,
        },
        {
            name: "Softbank",
            src: "/landing/onezero/softbank.svg",
            width: 138,
            height: 23,
        },
    ]
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    @mixin center-flex {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .main {
        position: relative;
        width: 100%;
        background: #07070a url("/landing/onezero/hero.webp") center top 40rem / cover no-repeat;
        @include media-breakpoint-up(lg) {
            background-position: center top 30rem;
        }

        .container {
            position: relative;
            width: 100%;
            height: 100%;
            padding: 4rem 1.25rem;

            @include media-breakpoint-up(lg) {
                padding: 6rem 0 4rem;
            }

            .text-block {
                @include center-flex;
                position: relative;
                z-index: 10;
                flex-direction: column;
                width: 100%;
                gap: 20px;
                text-align: center;
                color: $white;

                h1 {
                    font-size: 60px;
                    font-weight: 600;
                    margin: 0;

                    @media screen and (max-width: 500px) {
                        font-size: 48px;
                    }
                }

                h3 {
                    font-size: 29px;
                    line-height: 100%;
                    font-weight: 600;

                    @include media-breakpoint-up(lg) {
                        margin-top: -1rem;
                    }
                }

                p {
                    max-width: 869px;
                    text-align: center;
                    margin: 0 auto;
                    font-weight: 400;
                    font-size: $font-size-base;
                    line-height: 28px;

                    @media screen and (max-width: 500px) {
                        font-size: $font-size-base;
                        line-height: 24px;
                    }
                }
            }

            .highlights {
                @include center-flex;
                flex-wrap: wrap;
                margin-top: 2rem;
                border: 1px solid #7777ffb2;
                background: #14181f33;
                border-radius: 50px;
                gap: 24px;

                @include media-breakpoint-down(lg) {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 12px;
                    border: none;
                    background: none;
                    border-radius: 0;
                    justify-items: center;
                }

                @media screen and (max-width: 380px) {
                    grid-template-columns: 1fr;
                }

                .highlight {
                    @include center-flex;
                    padding: 16px 32px;
                    backdrop-filter: blur(10px);
                    width: fit-content;
                    position: relative;
                    background-color: transparent;

                    @include media-breakpoint-down(lg) {
                        border: 1px solid #7777ffb2;
                        background: #14181f33;
                        border-radius: 50px;
                    }

                    &:first-child {
                        @include media-breakpoint-up(lg) {
                            border-radius: 50px 0 0 50px;
                        }
                    }

                    &:last-child {
                        @include media-breakpoint-up(lg) {
                            border-radius: 0 50px 50px 0;
                        }
                    }

                    p {
                        margin: 0;
                        color: $white;
                        font-size: $font-size-base;
                        font-weight: 500;
                        white-space: nowrap;
                    }

                    &:not(:last-child)::after {
                        content: "";
                        position: absolute;
                        right: -12px;
                        top: 50%;
                        transform: translateY(-50%);
                        width: 1px;
                        height: 26.12px;
                        background: #ffffff33;

                        @include media-breakpoint-down(lg) {
                            display: none;
                        }
                    }
                }
            }

            .trusted-by {
                text-align: center;
                margin-top: 2rem;

                p {
                    margin: 0;
                    color: $white;
                    font-size: 20px;
                    font-weight: 600;
                    line-height: 30px;
                }

                .logos {
                    @include center-flex;
                    flex-wrap: wrap;
                    gap: 1.5rem;
                    margin-top: 2rem;

                    img {
                        max-height: 40px;
                        object-fit: cover;
                    }
                }
            }

            @media (max-width: 768px) {
                [data-usal] {
                    transform: none !important;
                    transition: none !important;
                    opacity: 1 !important;
                }
            }
        }
    }
</style>