<template>
    <div class="container-fluid">
        <div class="container img-container">
            <div class="get-in-touch">
                <h1 data-usal="fade-r">Contact <span>Us</span></h1>
                <p class="baseline" data-usal="fade-l">
                    If you have questions, inquiries, or feedback about Kestra, we're looking to
                    hearing from you.
                </p>
            </div>
            <div class="row justify-content-center">
                <div class="col-md-6 form-container bg-dark-2">
                    <div id="hubspotForm" data-usal="fade-l" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { onMounted } from "vue"
    import { hubspotFormCreate } from "~/utils/hubspot"

    onMounted(() => {
        hubspotFormCreate("contact_form", {
            formId: "77f32ae3-0f49-404a-a28d-6dfe92c8bc78",
            target: "#hubspotForm",
        })
    })
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .container-fluid {
        padding-top: $rem-8;

        .get-in-touch {
            text-align: center;
            color: $white;
            h1 {
                font-size: $font-size-4xl;
                font-weight: 400;

                span {
                    background: linear-gradient(90deg, #e151f7 56.37%, #5c47f5 64.15%);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            }

            p {
                font-size: $font-size-xl;
                font-weight: 300;
                margin-bottom: 0;
            }
        }

        .form-container {
            margin-top: 2.625rem;
            border: $block-border;
            padding: 2rem 4rem;
            @include media-breakpoint-down(sm) {
                padding: 1rem 2rem;
            }
        }
    }

    .img-container {
        position: relative;
        z-index: 10;

        &::before,
        &::after {
            content: "";
            position: absolute;
            width: calc($spacer * 12.5);
            height: calc($spacer * 12.5);
            background: linear-gradient(140deg, rgba(70, 24, 255, 0) -41.95%, #7e1cfa 77.28%);
            filter: blur(100px);
            z-index: -5;
        }

        &::before {
            left: 21rem;
            top: 10rem;
        }

        &::after {
            right: 21rem;
            bottom: 0;
        }
    }
</style>