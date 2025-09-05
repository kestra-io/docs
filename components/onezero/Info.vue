<template>
    <section class="orchestration">
        <div class="container">
            <div class="row">
                <div class="col-lg-6" data-aos="fade-right">
                    <div class="text-block">
                        <p class="description" data-aos="fade-up" data-aos-delay="50">
                            Orchestration has been a patchwork: fragile schedulers, 
                            vendor lock-in, hand-rolled scripts, and black-box 
                            platforms that slow delivery and break governance.
                        </p>
                        <p class="highlight" data-aos="fade-up" data-aos-delay="100">
                            <strong>Kestra 1.0 (LTS)</strong>
                            unifies data, AI, infrastructure, and business operations 
                            under one declarative control plane. Tell the system what 
                            you want; Kestra figures out the how, with full auditability 
                            and human-in-the-loop approvals.
                        </p>
                        <div data-aos="fade-up">
                            <NuxtLink href="/demo" class="btn btn-lg btn-primary">
                                Book a Strategy Session
                            </NuxtLink>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6" data-aos="fade-left" data-aos-delay="50">
                    <div class="video-container">
                        <div class="video-wrapper">
                            <iframe 
                                src="https://demo.arcade.software/kvO69FrLnnXVsMkrLi7T"
                                referrerpolicy="strict-origin-when-cross-origin" 
                                allowfullscreen 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
@import "../../assets/styles/variable";

.orchestration {
    padding: 4rem 0;
    background-color: $white;

    @include media-breakpoint-down(lg) {
        padding: 3rem 0;
    }

    @include media-breakpoint-down(md) {
        padding: 2rem .5rem;
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
        .video-wrapper {
            width: 100%;
            position: relative;
            overflow: hidden;
            border-radius: 15px;

            @media screen and (min-width: 992px) {
                aspect-ratio: 1.575;
            }

            @media screen and (max-width: 991px) {
                aspect-ratio: 16 / 9;
            }

            iframe {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: none;
                object-fit: cover;
            }
        }
    }

    @media (max-width: 768px) {
        [data-aos] {
            transform: none !important;
            transition: none !important;
            opacity: 1 !important;
        }
    }
}
</style>
