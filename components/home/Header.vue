<template>
    <section class="main-header">
        <div class="hero">
            <div class="text-block">
                <h1>
                    Declarative. Agentic. AI-Native.
                </h1>
                <p>A new era for orchestration.</p>
                <div class="row buttons px-3 px-md-0">
                    <div class="col-12 col-md-6">
                        <NuxtLink
                            href="/1-0"
                            class="btn btn-lg btn-primary me-md-3 mb-3 d-block d-md-inline"
                        >
                            Discover kestra 1.0
                        </NuxtLink>
                    </div>

                    <div class="col-12 col-md-6">
                        <NuxtLink
                            href="/demo"
                            class="btn btn-lg btn-secondary mb-3 d-block d-md-inline"
                            target="_blank"
                        >
                            Book a Strategy Call
                        </NuxtLink>
                    </div>

                </div>
            </div>

        </div>
    </section>

</template>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .main-header {
        position: relative;
        &::before {
            position: absolute;
            content: "";
            z-index: 0;
            width: 100vw;
            height: 91.6%;
            right: 0;
            top: 0;
        }
        .text-block {
            position: relative;
            z-index: 10;
            margin: 4rem 0 1rem;
            display: flex;
            flex-direction: column;
            width: 100%;
            align-items: center;
        }

        .hero {
            background: #08090d url("/landing/home/bg-1.0.jpg") no-repeat center top;
            height: 887px;
            padding-bottom: 2rem;

            padding-top: 5rem;
            position: relative;
            @include media-breakpoint-down(sm) {
                margin-top: 48px;
                background: #08090d url("/landing/home/bg-1.0-mobile.png") no-repeat center 70px;
                background-size: contain;
                height: 687px;
            }
        }

        h1 {
            color: white;
            text-align: center;
            max-width: 100%;
            font-weight: 600;
            font-size: 2.25rem;
            padding: 0;
            margin-top: 28rem;
            margin-bottom: 0;
            text-transform: uppercase;
            @include media-breakpoint-down(sm) {
                margin-top: 55%;
                font-size: 1.5rem;
            }
        }

        p {
            max-width: fit-content;
            text-align: center;
            font-weight: 300;
            font-style: italic;
            text-transform: uppercase;
            color: white;
            text-wrap: balance;
            font-size: 1.5rem;

            @include media-breakpoint-down(sm) {
                font-size: 0.85rem;
            }
        }

        .buttons {
            text-align: center;
            margin-top: 1.5rem;
            white-space: nowrap;
        }

        @include media-breakpoint-down(lg) {
            .hero {
                padding-top: 6rem;
                padding-bottom: 0;
                .text-block {
                    margin-bottom: 0;
                }
            }
        }
    }
</style>
