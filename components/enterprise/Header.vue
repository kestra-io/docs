<template>
    <div class="container-fluid">
        <div class="hero container">
            <div class="row">
                <div class="col-md-6 align-items-center d-flex">
                    <div>
                        <p data-aos="fade-left" class="overline">Enterprise Edition</p>
                        <h1 data-aos="fade-right">Kestra Enterprise to Scale Your Workflows<span class="dot">.</span></h1>
                        <p data-aos="fade-left" class="baseline">Made for organizations & professionals seeking to secure production workloads with high-security standards and enterprise support.</p>
                        <a href="https://kestra.io/demo" target="_blank" class="btn btn-lg btn-primary me-2 mb-2" data-aos="zoom-in">
                            Book a demo
                        </a>
                        <NuxtLink href="/contact-us" class="btn btn-lg btn-dark mb-2" data-aos="zoom-in">
                            Contact us
                        </NuxtLink>
                    </div>
                </div>
                <div class="col-md-6 ">
                    <img class="img-fluid" src="/landing/ee/background.svg" alt="Illustration of Kestra's logo with a dark background" data-aos="zoom-in"/>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
        background: $purple-7;
        color: var(--bs-white);
        overflow: hidden;

        .img-fluid {
            max-height: 100%;
        }
        .baseline {
            font-size: 1.15rem;
        }

        @include media-breakpoint-down(md) {
            .row {
                position: relative;

                & > div:first-child {
                    z-index: 1;
                }

                & > :last-child {
                    position: absolute;
                    z-index: 0;
                    margin: 0 auto;
                    top: 0;
                }
            }
        }
    }
</style>
<script setup lang="ts">
</script>