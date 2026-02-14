<template>
    <section class="container-fluid">
        <div class="container">
            <div class="get-in-touch">
                <h1 data-usal="fade-r">Contact <span class="highlight">Us</span></h1>
                <p class="baseline" data-usal="fade-l">
                    If you have questions, inquiries, or feedback about Kestra, we're looking to
                    hearing from you.
                </p>
            </div>
            <div class="row justify-content-center">
                <div class="col-md-6 form-container ">
                    <div id="hubspotForm" data-usal="fade-l" />
                </div>
            </div>
        </div>
    </section>
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
        padding: $rem-3 $rem-1;
        .get-in-touch {
            text-align: center;
            color: #fff;
        }
        .form-container {
            margin-top: $rem-2;
            border: 1px solid #212529;
            padding: $rem-2 $rem-4;
            border-radius: $border-radius-lg;
            @include media-breakpoint-down(sm) {
                padding: $rem-1 $rem-2;
            }
        }
    }

    .container {
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