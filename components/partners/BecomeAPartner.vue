<template>
    <div class="container-fluid">
        <div class="hero hero-sm container">
            <div class="row justify-content-center mb-4">
                <div class="col-md-10 col-lg-7 text-center">
                    <h3 data-aos="fade-left">Become a Partner</h3>
                    <p>If you are interested in becoming a Kestra partner, please  contact us with any questions.</p>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-md-6 col-lg-4">
                    <div class="card">
                        <div class="card-body">
                            <div class="card-text">
                                <form ref="becomeAPartner" @submit="checkForm" class="needs-validation" novalidate data-aos="fade-left">
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
                                        <label class="mb-1">Job Title</label>
                                        <select
                                            class="form-select"
                                            aria-label="Default select example"
                                            id="jobTitle"
                                        >
                                            <!-- <option value="1"></option>
                                            <option value="2"></option>
                                            <option value="3"></option> -->
                                        </select>
                                    </div>
                                    <div class="form-group mb-4">
                                        <label class="mb-1"
                                            >How would you integrate Kestra partnership
                                            program?</label
                                        >
                                        <select
                                            class="form-select"
                                            aria-label="Default select example"
                                            id="howToIntegrateKestraPartnerShip"
                                        >
                                            <!-- <option value="1"></option>
                                            <option value="2"></option> 
                                            <option value="3"></option> -->
                                        </select>
                                    </div>
                                    <div class="d-flex justify-content-center mb-4">
                                        <button
                                            type="submit"
                                            class="btn btn-primary contact-us py-3 px-4"
                                            data-aos="zoom-in"
                                        >
                                            Contact Us
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
    </div>
</template>

<script setup>
const hubSpotUrl = "https://api.hsforms.com/submissions/v3/integration/submit/27220195/77f32ae3-0f49-404a-a28d-6dfe92c8bc78";
const checkForm = function (){
    e.preventDefault()
    e.stopPropagation()

    const form = this.$refs.becomeAPartner;
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
                name: "jobTitle",
                value: form.jobTitle.value
            },
            {
                objectTypeId: "0-1",
                name: "howToIntegrateKestraPartnerShip",
                value: form.howToIntegrateKestraPartnerShip.value
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

<style lang="scss" scoped>
@import "../../assets/styles/variable";
// .container-fluid {
//     .mandatory-fields {
//         color: $purple-15;
//         font-size: small;
//     }
//     .contact-us {
//         background-color: $purple-14;
//     }
// }
.container-fluid {
    background: $purple-13;

    .form-group {
        margin-bottom: 10px;
    }

    .mandatory-fields {
        color: $purple-15;
        font-size: small;
    }
}
</style>
