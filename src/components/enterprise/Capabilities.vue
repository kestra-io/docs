<template>
    <div class="capabilities">
        <section class="hero content">
            <div class="container">
                <div class="anything-scale">
                    <div class="info" data-usal="fade-r">
                        <h3 class="mb-0">Run Anything at Scale</h3>
                        <span>
                            Kestra offers language-agnostic orchestration, eliminating the need for glue code and allowing
                            you to execute tasks in any language. With built-in high-availability options and full observability,
                            Kestra ensures resilient operations and clear insights, no matter how complex your workflows.
                        </span>
                    </div>
                    <div class="image-wrapper" data-usal="fade-l">
                        <img
                            class="img-fluid"
                            :src="anythingScale.src"
                            alt="Run Anything at Scale"
                        />
                    </div>
                </div>
            </div>
        </section>

        <section class="content two">
            <div class="container">
                <div class="declarative-grid">
                    <div
                        v-for="(block, index) in FeaturedBlocks"
                        :key="index"
                        class="block"
                    >
                        <div class="block-info" data-usal="fade-r">
                            <h3
                                v-if="block.title"
                                class="mb-0"
                            >
                                {{ block.title }}
                            </h3>
                            <span v-if="block.description">{{ block.description }}</span>
                        </div>
                        <div class="img-wrapper" data-usal="fade-l">
                            <img
                                :src="block.img.src"
                                :alt="block.title"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
    import realTime from "~/assets/enterprise/real-time.svg";
    import declarative from "~/assets/enterprise/declarative.svg";
    import anythingScale from "~/assets/enterprise/anything-scale.svg";

    const FeaturedBlocks = [
        {
            title: "Declarative",
            description: 
                "Kestra’s declarative syntax in YAML offers a simple learning curve while enabling powerful orchestration. With both UI-based configuration and the ability to scale to complex use cases, Kestra ensures ease of use without sacrificing flexibility or control.",
            img: declarative,
        },
        {
            title: "Real Time & Event Driven",
            description: 
                "Handle scheduled, real-time event-driven, and API-based workflows effortlessly. Support business-critical operations with real-time automation, ensuring your workflows adapt and scale to your needs.",
            img: realTime,
        },
    ];
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .capabilities {
        .hero {
            background-image: url("~/assets/landing/infrastructure/grid.svg");
            padding-top: $rem-5;
            padding-bottom: $rem-2;

            @include media-breakpoint-down(md) {
                padding-bottom: $rem-1;
            }
        }

        .content {
            padding-inline: 0.5rem;

            &.two {
                padding-bottom: $rem-5;
            }

            .container {
                display: flex;
                flex-direction: column;
                gap: $rem-2;

                span {
                    font-size: $font-size-sm;
                }

                h3, span {
                    color: $white;
                }

                .anything-scale {
                    display: flex;
                    align-items: center;
                    gap: $rem-4;
                    border-radius: 1.25rem;
                    background: var(--grey-Black, #131316);
                    border: $block-border;
                    overflow: hidden;

                    .info {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        gap: 1.25rem;
                        padding-left: $rem-4;
                        max-width: 480px;

                        @include media-breakpoint-down(lg) {
                            padding: $rem-2;
                        }
                    }

                    .image-wrapper {
                        flex: 1;

                        img {
                            width: 100%;
                            height: auto;
                            max-width: 548px;

                            @include media-breakpoint-down(lg) {
                                padding-left: $rem-2;
                            }
                        }
                    }

                    @include media-breakpoint-down(lg) {
                        flex-direction: column;
                        padding: 0;
                        text-align: center;
                        gap: $rem-1;
                        
                        .info {
                            max-width: 100%;
                            padding: $rem-2 $rem-2 0;

                            p, span {
                                text-align: center;
                            }
                        }
                    }
                }

                .declarative-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1.5rem;
                    width: 100%;

                    @include media-breakpoint-down(lg) {
                        gap: $rem-1;
                    }

                    @include media-breakpoint-down(lg) {
                        grid-template-columns: 1fr;
                        justify-items: center;
                    }

                    .block {
                        display: flex;
                        flex-direction: column;
                        background: var(--grey-Black, #131316);
                        border-radius: 1.25rem;
                        border: $block-border;
                        overflow: hidden;

                        .block-info {
                            padding: $rem-2 $rem-2 0;

                            @include media-breakpoint-up(lg) {
                                padding: $rem-4 $rem-4 0;
                            }

                            display: flex;
                            flex-direction: column;
                            gap: 1.25rem;

                            @include media-breakpoint-down(lg) {
                                padding: $rem-2;
                                gap: $rem-1;
                            }
                        }

                        .img-wrapper {
                            margin-top: auto;

                            img {
                                width: 100%;
                                display: block;
                                padding-left: $rem-2;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
