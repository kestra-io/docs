<template>
    <div class="container-fluid">
        <div class="pt-5 d-flex flex-column justify-content-center">
            <div class="text-center header text-white mx-auto mt-4">
                <h1 class="fw-light">
                    Kestra <span class="text-gradient">Cloud</span>
                </h1>
                <h6 class="pb-4 fw-light lh-lg">
                    Sign up to get notified as soon as Kestra Cloud launches
                </h6>
            </div>

            <div class="container">
                <div class="col-12 col-md-8 col-lg-5 form-container mx-auto pt-3 pb-5">
                    <div id="hubspotForm" data-aos="zoom-in" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        mounted() {
            if (process.client) {
                if (window.hbspt) {
                    window.hbspt.forms.create({
                        region: "eu1",
                        portalId: "27220195",
                        formId: "fbce3efa-1f99-4ab9-928c-26167aa51424",
                        target: "#hubspotForm",
                        onFormSubmit: function($form) {
                            if (window.dataLayer) {
                                window.dataLayer.push({'event': 'cloud_form'});
                            }
                        },
                    })
                }
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

    background-color: #111113;

    h1{
        font-size:$font-size-4xl !important;
        line-height: $font-size-4xl
    }
    h6{
        font-size: $font-size-xl;
    }

    .text-gradient {
        background: linear-gradient(90.03deg, #e151f7 2.16%, #5c47f5 65.09%);
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .input {
        background-color: $black-4;
        border: 1px;
        border-style: #252526;
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
        z-index: 10;
        background-color: $black-2;
        border-style: solid;
        border-color: #252526;
        padding: 1rem;
        padding-bottom: 0rem;
        margin-bottom: 3rem;

        &::after {
            content: "";
            position: absolute;
            width: 262px;
            height: 170px;
            background: linear-gradient(180deg,
                    rgba(98, 24, 255, 0) 0%,
                    #6117ff 100%);
            filter: blur(100px);
            left: 0px;
            top: 0px;
            z-index: -1;
        }

        &::before {
            content: "";
            position: absolute;
            width: 262px;
            height: 170px;
            background: linear-gradient(180deg,
                    rgba(98, 24, 255, 0) 0%,
                    #6117ff 100%);

            filter: blur(100px);
            right: 0px;
            bottom: 0px;
            z-index: -1;
        }
    }
}
</style>
