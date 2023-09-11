<template>
    <div class="container text-center mb-5">
        <div class="rounded-3">
            <div>
                <h3 data-aos="fade-right"><span>Get Kestra updates</span> to your inbox</h3>
                <div v-if="valid === true && message" class="alert alert-success" v-html="message" />
                <div v-if="valid === false && message" class="alert alert-danger">{{ message }}</div>
                <form class="row row-cols-lg-auto g-3 mt-4 mb-4 justify-content-center needs-validation" ref="newsletter" id="newsletter" @submit="checkForm" novalidate data-aos="fade-left">
                    <div class="col-12">
                        <label class="visually-hidden" for="newsletter-email">Email</label>
                        <input type="email" class="form-control form-control-lg" id="email" placeholder="Email" required>
                    </div>

                    <div class="col-12">
                        <button type="submit" class="btn btn-primary">Subscribe</button>
                    </div>
                </form>

                <p class="mt-3" data-aos="zoom-in">Stay up to date with the latest features and changes to Kestra</p>
                <Socials class="mt-4 mb-0 socials" data-aos="zoom-in" />
            </div>
        </div>
    </div>
</template>

<script>
    import Socials from "./Socials.vue";
    import axios from "axios";

    const hubSpotUrl = "https://api.hsforms.com/submissions/v3/integration/submit/27220195/433b234f-f3c6-431c-898a-ef699e5525fa";

    export default {
        components: {Socials},
        data() {
            return {
                valid: undefined,
                message: undefined,
            };
        },
        methods:{
            checkForm: function (e) {
                e.preventDefault()
                e.stopPropagation()

                const form = this.$refs.newsletter;
                const route = useRoute()
                if (!form.checkValidity()) {
                    this.valid = false;
                    this.message = "Invalid form, please review the fields."
                } else {
                    this.valid = true;
                    form.classList.add('was-validated')

                    const formData = {
                        fields: [{
                            objectTypeId: "0-1",
                            name: "email",
                            value: form.email.value
                        }],
                        context: {
                            pageUri: route.path,
                            pageName: route.path
                        }
                    }

                    axios.post(hubSpotUrl, formData)
                        .then((response) => {
                            if (response.status !== 200) {
                                console.log(response.data)
                                this.message = response.data.message;
                                this.valid = false;
                            } else {
                                this.valid = true;
                                this.message = response.data.inlineMessage;
                                form.reset()
                                form.classList.remove('was-validated')
                            }
                        })
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container {
        > div {
            position: relative;
            background: $purple-8;
            padding: calc($spacer * 3);
            color: var(--bs-primary);

            &:before {
                content: "";
                background: url("/landing/dot2.svg") no-repeat bottom right;
                width: 329px;
                height: 236px;
                position: absolute;
                right: 1rem;
                bottom: 1rem;
                z-index: 1;
            }

            > div {
                position: relative;
                z-index: 2;
            }
        }

        input {
            border-radius: $border-radius;
        }

        .btn-lg {
            background: $purple-24;
            padding: var(--bs-btn-padding-y) var(--bs-btn-padding-x);
            line-height: 2rem;
        }

        h3 {
            font-size: $h3-font-size;
            font-weight: 800;

            span {
                color: var(--bs-black);
            }
        }

        .socials {
            font-size: calc($font-size-base * 2);
        }

        @include media-breakpoint-down(sm) {
            max-width: 80%
        }
    }

</style>