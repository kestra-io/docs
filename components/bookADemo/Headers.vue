<template>
  <div class="container-fluid">
        <div class="hero container">
            <div class="row">
                <div class="col-12 col-md-6 position-relative">
                    <img class="img-fluid" src="/landing/ee/background.svg" alt="Illustration of Kestra's logo with a dark background" data-aos="zoom-in"/>
                    <div class="schedule-demo position-absolute">
                        <div class="subtitle">SCHEDULE A DEMO</div>
                        <h1>Ready to See Kestra in Action?</h1>
                        <p class="description">Connect with of our Product Specalist to get of our product and its value proposition</p>
                    </div>
                </div>
                <div class="col-12 col-md-6 align-items-center d-flex">
                    <div class="card">
                        <div class="card-body">
                            <div class="card-text">
                                <div class="text-center mb-4">
                                    <h2 data-aos="fade-left">Book a demo</h2>
                                </div>
                                <form ref="bookdemo" @submit="checkForm" class="needs-validation" novalidate data-aos="fade-left">
                                    <div class="row mb-3">
                                        <div class="form-group col-md-6 has-error">
                                            <label for="firstName" class="mb-1"
                                                >First Name *</label
                                            >
                                            <input
                                                type="text"
                                                class="form-control"
                                                id="firstName"
                                                required
                                            />
                                        </div>
                                        <div class="form-group col-md-6">
                                            <label for="lastName" class="mb-1"
                                                >Last Name *</label
                                            >
                                            <input
                                                type="text"
                                                class="form-control"
                                                id="lastName"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div class="form-group mb-3">
                                        <label for="companyMail" class="mb-1"
                                            >Company Mail *</label
                                        >
                                        <input
                                            type="email"
                                            class="form-control"
                                            id="companyMail"
                                            required
                                        />
                                    </div>
                                    <div class="form-group mb-3">
                                        <label for="alreadyUsing" class="mb-1">Are you already using Kestra?</label>
                                        <input
                                            type="email"
                                            class="form-control"
                                            id="alreadyUsing"
                                        />
                                    </div>
                                    <div class="form-group mb-4">
                                        <label class="mb-1" for="useCase">
                                            What is your use case about?
                                        </label>
                                        <input
                                            type="email"
                                            class="form-control"
                                            id="useCase"
                                        />
                                    </div>
                                    <div class="d-flex justify-content-center mb-4">
                                        <button
                                            type="submit"
                                            class="btn btn-primary contact-us py-3 px-4"
                                            data-aos="zoom-in"
                                        >
                                            Schedule a Demo
                                        </button>
                                    </div>
                                    <div class="text-center">
                                        <p class="mandatory-fields mt-2">* Mandatory fields</p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container text-center">
            <p class="companies-title" data-aos="zoom-in">
                Loved & trusted by leading enterprises worldwide
            </p>
        </div>
        <div class="container-fluid pt-4 pb-4">
            <Companies />
        </div>
    </div>
</template>

<script setup>
import Companies from "../layout/Companies.vue";
const hubSpotUrl = "https://api.hsforms.com/submissions/v3/integration/submit/27220195/77f32ae3-0f49-404a-a28d-6dfe92c8bc78";
const checkForm = function (){
    e.preventDefault()
    e.stopPropagation()
    const form = this.$refs.bookdemo;
    const route = useRoute();
    if (form.checkValidity()) {
        form.classList.add('was-validated')
        const formData = {
            fields: [{
                objectTypeId: "0-1",
                name: "firstname",
                value: form.firstName.value
            },
            {
                objectTypeId: "0-1",
                name: "lastname",
                value: form.lastName.value
            },
            {
                objectTypeId: "0-1",
                name: "companyMail",
                value: form.companyMail.value
            },
            {
                objectTypeId: "0-1",
                name: "alreadyUsing",
                value: form.alreadyUsing.value
            },
            {
                objectTypeId: "0-1",
                name: "useCase",
                value: form.useCase.value
            }],
            context: {
                pageUri: route.path,
                pageName: route.path
            }
        }
        fetch(hubSpotUrl, {method: "POST", body: JSON.stringify(formData), headers: {"Content-Type": "application/json"}})
            .then((_) => {
                form.reset()
                form.classList.remove('was-validated')
            })
    }
}
</script>

<style scoped lang="scss">
@import "../../assets/styles/variable";
.container-fluid {
    background: $purple-7;
    color: var(--bs-white);
    overflow: hidden;

    .hero {
        padding-top: 4rem !important;
        .card {
            box-shadow: none !important;
        }
        .schedule-demo {
            top: 50%;
            left: 20%;
            right: 10%;

            h1 {
                padding-bottom: 0 !important;
            }
            div.subtitle {
                font-size: $font-size-xl;
                color: var(--bs-pink);
                font-weight: 700;
                text-transform: uppercase;
                font-family: var(--bs-font-monospace);
                display: inline;
            }
            p.description {
                line-height: 2rem;
                font-size: $font-size-xl;
                width: 85%;
            }
        }

        .form-control {
            height: 50px;
        }

        .img-fluid {
            max-height: 100%;
        }
        .mandatory-fields {
            color: $purple-25;
            font-size: small;
        }
    }

    .companies-title {
        position: relative;

        &:after {
            content: '';
            position: absolute;
            left: 50%;
            bottom: calc(-1 * var(--spacer));
            transform: translateX(-50%);
            display: inline-block;
            height: 2px;
            width: 51px;
            background: var(--bs-pink);
        }
    }
    
    @include media-breakpoint-down(lg) {
        .schedule-demo {
           position: relative !important;
           inset: 0 !important;
        }
    }
}
</style>