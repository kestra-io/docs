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
                    <form class="py-4 form-horizontal position-relative mx-auto px-3 px-sm-5">
                        <div class="d-flex flex-column form-group required">
                            <label class="text-white fw-lighter form-label mb-1" for="email">
                                Email
                            </label>
                            <input type="email" id="email" class="input text-white p-2" required />
                        </div>
                        <div class="d-flex my-2 para fw-normal">
                            <label for="checked1" role="button" class="text-md fw-lighter mb-0">
                                <input role="button" type="checkbox" id="checked1" name="condition"
                                    class="custom-control-input me-2 form-check-input lh-base" />
                                I agree to receive other communications from Kestra
                            </label>
                        </div>
                        <p class="desc fw-normal my-4">
                            You can unsubscribe from these communications at any
                            time. For more information on how to unsubscribe, our
                            privacy practices, and how we are commited to protecting
                            and respecting your privacy, please review our Privacy
                            Policy. By clicking submit below, you consent to allow
                            kestra to store and process the personal information
                            submitted above to provide you the content requested.
                        </p>
                        <div class="d-flex justify-content-center">
                            <button type="submit" class="btn btn-primary">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

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
        color: $black-8;
        line-height: 1.375rem;
        font-size: $font-size-sm
    }

    .container {
        background-image: url("/landing/contact/Mask.svg");
        z-index: 20;
    }

    .form-container {
        z-index: 10;
    }

    .form-horizontal {
        background-color: $black-2;
        border-style: solid;
        border-color: #252526;

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
