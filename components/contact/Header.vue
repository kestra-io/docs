<template>
    <div class="container-fluid py-5">
        <div class="my-5 d-flex flex-column justify-content-center">
            <div class="text-center text-white mx-auto my-4">
                <h1 class="fw-medium lh-1">
                    Kestra <span class="text-gradient">Cloud</span>
                </h1>
                <h6 class="fw-normal">
                    Sign up to get notified as soon as Kestra Cloud launches
                </h6>
            </div>
            <div class="form-container">
                <form class="col-md-5 py-4 form-horizontal mx-auto px-5">
                    <div class="d-flex flex-column form-group required">
                        <label class="text-white fw-lighter form-label mb-1" for="email">
                            Email
                        </label>
                        <input type="email" id="email" class="input text-white p-2" required/>
                    </div>
                    <div class="d-flex my-2 para">
                        <input type="checkbox" class="form-check-input me-2" />
                        <p class="text-md fw-lighter mb-0">
                            I agree to receive other communications from
                            Kestra
                        </p>
                    </div>
                    <p class="desc fw-lighter my-4">
                        You can unsubscribe from these communications at any
                        time. For more information on how to unsubscribe,
                        our privacy practices, and how we are commited to
                        protecting and respecting your privacy, please
                        review our Privacy Policy. By clicking submit below,
                        you consent to allow kestra to store and process the
                        personal information submitted above to provide you
                        the content requested.
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
</template>

<style lang="scss" scoped>
@import "../assets/styles/variable";
.form-group.required .form-label::after{
    content: "*";
    color: red;
}
.container-fluid {
    background-color: #111113;
    .text-gradient {
        background: linear-gradient(90.03deg, #E151F7 2.16%, #5C47F5 65.09%);
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    .input {
        background-color: $black-4;
        outline: none;
        border: none;
    }
    .para{
        color: $white-3;
    }
    .desc {
        color: $black-8;
    }
    .form-check-input{
        background-color: $black-4;
    }
    .form-container{
        background-image: url('/landing/contact/mask.svg');
        position: relative;
        &::after{
            content: "";
            position: absolute;
            height: 266.49px;
            width: 170.25px;
            rotate: 180deg;
            top: 12%;
            left: 30%;
            // background-image: url('/landing/contact/mask_right.svg');
            background: linear-gradient(180deg, rgba(98, 24, 255, 0.00) 0%, #6117FF 100%);
            filter: blur(100px);
            }
            &::before{
            content: "";
            position: absolute;
            height: 266.49px;
            width: 170.25px;
            top: 50%;
            right: 29%;
            background: linear-gradient(180deg, rgba(98, 24, 255, 0.00) 0%, #6117FF 100%);
            filter: blur(100px);
            }
    }
    .form-horizontal {
        background-color: $black-2;
        border-style: solid;
        border-color: #252526;
        position: relative;
        z-index: 10;
    }
}
</style>