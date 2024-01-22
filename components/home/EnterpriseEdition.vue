<template>
    <div class="container-fluid bg-dark-1">
        <div class="container">
            <div class="row">
                <div class="p-5 d-flex flex-column align-items-center gap-3">
                    <img class="levels" src="/landing/ee/levels.svg" alt="levels" />
                    <h2>Take Kestra to the next level with the <span>Enterprise Edition</span></h2>
                    <p class="description">Ensure scalability and high availability with managed Kafka and Elasticsearch integrated into the Enterprise Edition to eliminate single point of failure.</p>
                    <div class="d-flex align-items-center justify-content-center">
                        <NuxtLink href="/enterprise" class="btn btn-dark me-2" data-aos="zoom-in">Learn more</NuxtLink>
                        <NuxtLink href="/contact-us" class="btn btn-primary" data-aos="zoom-in">Book a demo</NuxtLink>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import Section from '../layout/Section.vue';

    export default {
        components: {Section}
    }
</script>


<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
        color: var(--bs-white);

        .container {
            background: url("/landing/ee/background.svg") no-repeat center;
            background-size: 50%;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding: 5rem 0;
        }

        .row {
            h2 {
                color: var(--bs-white);
                text-align: center;
                font-family: $font-family-sans-serif;
                font-size: 50px;
                font-style: normal;
                font-weight: 300;
                line-height: 50px;
                padding: 0 21%;

                span {
                    background: linear-gradient(90deg, #E151F7 38.91%, #5C47F5 91.17%);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            }

            .description {
                padding: 0 21%;
                color: var(--bs-white);
                text-align: center;
                font-family: $font-family-sans-serif;
                font-size: 18px;
                font-style: normal;
                font-weight: 400;
                line-height: 26px;
            }

            @include media-breakpoint-down(lg) {
                h2, .description {
                    padding: 0;
                }
            }

            .btn-dark {
                border: 1px solid rgba(255, 255, 255, 0.12);
                background: $black-4;
            }
        }
    }
</style>