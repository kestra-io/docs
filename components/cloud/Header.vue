<template>
    <div class="container-fluid bg-dark-4">
        <div class="container py-5 my-3">
            <div class="hero-container py-lg-5 d-flex justify-content-center align-items-center">
                <div class="header text-white">
                    <img src="/landing/cloud/cloud-hero.svg" alt="Kestra Cloud Comming Soon">
                    <h1 class="my-3">
                        Kestra <span class="text-gradient">Cloud</span> <br>Coming Soon
                    </h1>
                    <span class="tag">
                        Private Alpha
                    </span>
                    <h6 class="fw-light lh-lg m-0">
                        Register now to be the first to know when we launch!
                    </h6>
                </div>

                <div class="col-12 col-md-8 col-lg-5 form-container mx-auto pt-3">
                    <ClientOnly>
                        <div id="hubspotForm" data-aos="zoom-in" />
                    </ClientOnly>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {hubspotFormCreate} from "~/utils/hubspot.js";

    export default {
        mounted() {
            if (process.client) {
                hubspotFormCreate("cloud_form", {
                    formId: "fbce3efa-1f99-4ab9-928c-26167aa51424",
                    target: "#hubspotForm",
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .form-group.required .form-label::after {
        content: "*";
        color: red;
    }

    .custom-control-input {
        background-color: $black-4;
    }

    .container-fluid {
        position: relative;

        &::after {
            content: "";
            position: absolute;
            width: 262px;
            height: 170px;
            background: linear-gradient(180deg,
                rgba(98, 24, 255, 0) 0%,
                #6117ff 100%);
            filter: blur(100px);
            left: 15%;
            top: 10%;
            z-index: 1;
        }

        .hero-container {
            h1 {
                font-size: $font-size-4xl !important;
                line-height: $font-size-4xl;
                max-width: 80%;
                font-weight: 400;
            }

            h6 {
                font-size: $font-size-xl;
            }

            .text-gradient {
                background: linear-gradient(90.03deg, #e151f7 2.16%, #5c47f5 65.09%);
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            @include media-breakpoint-down(lg) {
                flex-direction: column;
                align-items: flex-start !important;
                gap: calc($spacer * 2);

                h1 {
                    max-width: unset;
                    font-size: calc($font-size-base * 1.625) !important;
                    line-height: calc($spacer * 1.625);
                }

                h6 {
                    line-height: unset !important;
                }
            }

            .tag {
                max-width: fit-content;
                border-radius: calc($spacer * 0.25);
                color: $white;
                background-color: #5A3ABC;
                padding: calc($spacer * 0.3) calc($spacer * 0.25);
                font-size: $font-size-md;
                line-height: 1.5rem;
                font-weight: 600;
            }
        }


        .input {
            background-color: $black-4;
            border: 1px;
            border-style: $black-3;
            border: none;
        }

        .para {
            color: $white-3;
        }

        .desc {
            color: $white-3;
            line-height: 1.375rem;
            font-size: $font-size-sm
        }

        .container {
            background-image: url("/landing/contact/Mask.svg");
            z-index: 20;
        }

        .form-container {
            background-color: $black-2;
            border-style: solid;
            border-color: $black-3;
            padding: 1rem;
            height: fit-content;

            @include media-breakpoint-down(lg) {
                margin: 0 !important;
                width: 100%;
            }
        }


    }
</style>
