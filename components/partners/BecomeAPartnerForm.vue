<template>
    <div class="card">
        <div class="text-dark p-2">
            <div class="card-body">
                <form>
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
                </form>
                <p class="text-center mandatory-fields mt-2">
                    * Mandatory fields
                </p>
            </div>
        </div>
    </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/variable";
.container-fluid {
    .mandatory-fields {
        color: $purple-15;
        font-size: small;
    }
    .contact-us {
        background-color: $purple-14;
    }
}
</style>
