<template>
    <div class="container text-center mb-5">
        <div class="rounded-3">
            <div>
                <h3><span>Get Kestra updates</span> to your inbox</h3>
                <form class="row row-cols-lg-auto g-3 mt-4 mb-4 justify-content-center needs-validation" ref="newsletter" id="newsletter" @submit="checkForm" novalidate>
                    <div class="col-12">
                        <label class="visually-hidden" for="newsletter-email">Email</label>
                        <input type="email" class="form-control form-control-lg" id="newsletter-email" placeholder="Email" required>
                    </div>

                    <div class="col-12">
                        <button type="submit" class="btn btn-lg btn-primary">Subscribe</button>
                    </div>
                </form>

                <p class="mt-3">Stay up to date with the latest features and changes to Kestra</p>
                <Socials class="mt-4 mb-0 socials" />
            </div>
        </div>
    </div>
</template>

<script>
    import Socials from "./Socials.vue";

    export default {
        components: {Socials},
        mounted() {
            if (document.getElementById("hubSpotNewsletterScript") === undefined) {
                const script = document.createElement("script");
                script.id = "hubSpotNewsletterScript";
                script.src = "https://js-eu1.hsforms.net/forms/embed/v2.js";
                document.body.appendChild(script);

                script.addEventListener("load", () => {
                    if (window.hbspt) {
                        window.hbspt.forms.create({
                            region: "eu1",
                            portalId: "27220195",
                            formId: "433b234f-f3c6-431c-898a-ef699e5525fa"
                        })
                    }
                })
            }
        },
        methods:{
            checkForm: function (e) {
                var form = this.$refs.newsletter;
                if (!form.checkValidity()) {
                    e.preventDefault()
                    e.stopPropagation()
                }

                form.classList.add('was-validated')
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
    }

</style>