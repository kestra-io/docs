<template>
    <section class="orchestration">
        <div class="container">
            <div class="row">
                <div class="col-lg-6" data-usal="fade-r">
                    <div class="text-block">
                        <p class="description" data-usal="fade-u delay-50">
                            Orchestration has been a patchwork: fragile schedulers, vendor lock-in,
                            hand-rolled scripts, and black-box platforms that slow delivery and
                            break governance.
                        </p>
                        <p class="highlight" data-usal="fade-u delay-100">
                            <strong>Kestra 1.0 (LTS)</strong>
                            unifies data, AI, infrastructure, and business operations under one
                            declarative control plane. Tell the system what you want; Kestra figures
                            out the how, with full auditability and human-in-the-loop approvals.
                        </p>
                        <div data-usal="fade-u">
                            <a href="/demo" class="btn btn-lg btn-primary">
                                Book a Strategy Session
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6" data-usal="fade-l delay-50">
                    <div class="video-container">
                        <iframe
                            src="https://www.youtube.com/embed/b5TkMRlrUxw"
                            title="Kestra 1.0: Introducing Declarative Agentic Orchestration"
                            frameborder="0"
                            allow="
                                accelerometer;
                                autoplay;
                                clipboard-write;
                                encrypted-media;
                                gyroscope;
                                picture-in-picture;
                                web-share;
                            "
                            referrerpolicy="strict-origin-when-cross-origin"
                            allowfullscreen
                        />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .orchestration {
        padding: 4rem 0;
        background-color: $white;

        @include media-breakpoint-down(lg) {
            padding: 3rem 0;
        }

        @include media-breakpoint-down(md) {
            padding: 2rem 0.5rem;
        }

        .text-block {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            text-align: center;
            margin-bottom: 2rem;

            @include media-breakpoint-up(lg) {
                max-width: 400px;
                text-align: left;
            }

            .description {
                margin: 0;
                font-size: 18px;
                line-height: 1.6;
                font-weight: 600;
            }

            .highlight {
                margin: 0;
                font-weight: 400;
                font-size: 1rem;
                line-height: 1.5rem;

                strong {
                    font-weight: 700;
                }
            }
        }

        .video-container {
            padding-bottom: 56.5%;
            @include media-breakpoint-down(sm) {
                padding-bottom: 61%;
            }
            border-radius: 15px;
        }

        @media (max-width: 768px) {
            [data-usal] {
                transform: none !important;
                transition: none !important;
                opacity: 1 !important;
            }
        }
    }
</style>