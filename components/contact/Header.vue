<template>
    <div class="container-fluid">
        <div class="hero container">
            <div class="row">
                <div class="col-md-6 get-in-touch">
                    <p class="overline">Get in touch</p>
                    <h1>Contact Us</h1>
                    <p class="baseline">If you have questions, inquiries, or feedback about Kestra, we're looking to hearing from you.</p>
                </div>
                <div class="col-md-6">
                    <h3>Reach Out to Us</h3>
                    <form>
                        <div class="row">
                            <div class="form-group col-md-6">
                                <label for="firstName">First Name *</label>
                                <input type="text" class="form-control" id="firstName">
                            </div>
                            <div class="form-group col-md-6">
                                <label for="lastName">Last Name *</label>
                                <input type="text" class="form-control" id="lastName">
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group col-md-6">
                                <label for="company">Company</label>
                                <input type="text" class="form-control" id="company">
                            </div>
                            <div class="form-group col-md-6">
                                <label for="email">Email *</label>
                                <input type="email" class="form-control" id="email">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="message">Message *</label>
                            <textarea class="form-control" rows="3"></textarea>
                        </div>
                        <div class="checkbox consent">
                            <label for="newsletterConsent">
                                <input type="checkbox" id="newsletterConsent">&nbsp;&nbsp;I agree to receive Kestra's newsletter with updates, news, and insights. I can unsubscribe at any time.
                            </label>
                        </div>
                        <div class="checkbox consent">
                            <label for="personalDataConsent">
                                <input type="checkbox" id="personalDataConsent">&nbsp;&nbsp;I consent to the processing of my personal data in accordance with Kestra's Privacy Policy and GDPR requirements. *
                            </label>
                        </div>
                        <button type="submit" class="btn btn-primary me-2">Submit</button>
                    </form>
                    <p class="mandatory-fields">* Mandatory fields</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Console from "vue-material-design-icons/Console.vue"
    import Email from "vue-material-design-icons/Email.vue"

    export default {
        components: {Console, Email}
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
        background: $purple-8;

        .form-group {
            margin-bottom: 10px;
        }

        .checkbox {
            margin-bottom: 10px;
        }

        .consent {
            font-size: small;
        }

        .mandatory-fields {
            color: $purple-17;
            font-size: small;
        }

        .get-in-touch {
            background: url("/landing/company/frame-645.png") no-repeat top right;
            padding-left: calc($spacer * 4);
            padding-right: calc($spacer * 4);
        }
    }
</style>