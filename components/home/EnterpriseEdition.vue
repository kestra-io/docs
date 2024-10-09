<template>
    <div class="container-fluid bg-dark-1">
        <div class="container">
            <div class="row">
                <div class="p-1 p-sm-5 d-flex flex-column align-items-center gap-3">
                    <img class="levels" src="/landing/ee/level.svg" alt="levels" />
                    <h2>Take Kestra to the next level with the <span>Enterprise Edition</span></h2>
                    <p class="description">Ensure scalability and high availability with managed Kafka and Elasticsearch integrated into the Enterprise Edition to eliminate single point of failure.</p>
                    <div class="d-flex align-items-center justify-content-center">
                        <NuxtLink href="/enterprise" class="btn btn-animated btn-dark-animated me-2 z-10" data-aos="zoom-in">Learn more</NuxtLink>
                        <NuxtLink href="/contact-us" class="btn btn-animated btn-purple-animated z-10" data-aos="zoom-in">get a demo</NuxtLink>
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
            background: url("/landing/ee/ee-background.svg") no-repeat center;
            background-size: 100%;
            padding: 5rem 0;
        }

        .row {
            h2 {
                color: var(--bs-white);
                text-align: center;
                font-family: $font-family-sans-serif;
                font-size: calc($font-size-base * 3.125);
                font-style: normal;
                font-weight: 300;
                line-height: calc($spacer * 3.125);
                padding: 0 21%;

                @include media-breakpoint-down(md) {
                    line-height: calc($spacer * 1.625);
                }

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
                font-size: $h6-font-size;
                font-style: normal;
                font-weight: 400;
                line-height: calc($spacer * 1.625);
            }

            @include media-breakpoint-down(lg) {
                h2, .description {
                    padding: 0;
                }
            }
        }
    }
</style>