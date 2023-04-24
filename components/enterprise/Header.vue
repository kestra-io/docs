<template>
    <div class="container-fluid">
        <div class="hero container">
            <div class="row">
                <div class="col-md-6">
                    <p data-aos="fade-left" class="overline">Enterprise Edition</p>
                    <h1 data-aos="fade-right">Kestra Enterprise Edition for Scaling companies<span class="dot">.</span></h1>
                    <p data-aos="fade-left" class="baseline">Get full access of all the Open source features and unlock the full potential with Enterprise only features</p>
                    <a href="https://meetings-eu1.hubspot.com/quentin-sinig/meeting-link-demo" target="_blank" class="btn btn-lg btn-primary me-2 mb-2" data-aos="zoom-in">
                        Book a demo
                    </a>
                    <NuxtLink href="/contact-us" class="btn btn-lg btn-dark mb-2" data-aos="zoom-in">
                        Contact us
                    </NuxtLink>
                </div>
                <div class="col-md-6 " data-aos="zoom-in">
                    <img class="img-fluid" src="/landing/ee/background.svg" alt="Illustration of Kestra's logo with a dark background"/>
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

        .hero {
            padding-top: 5rem;
            padding-bottom: 3rem;
        }

        .baseline {
            font-size: 1.15rem;
        }

        @include media-breakpoint-down(md) {
            .row {
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