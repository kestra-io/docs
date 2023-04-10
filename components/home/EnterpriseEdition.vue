<template>
    <div class="container-fluid">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <h3>Take Kestra to the next level with the Enterprise Edition</h3>
                    <ul class="mb-5">
                        <li>SSO/OIDC Authentification</li>
                        <li>Role Based Access</li>
                        <li>Secret Manager Integration</li>
                        <li>High Availability</li>
                        <li>Best in Class Support</li>
                        <li>And More...</li>
                    </ul>

                    <a href="/enterprise-edition" class="btn btn-lg btn-primary me-2">Learn more</a>
                    <a href="/contact" class="btn btn-lg btn-dark">Contact us</a>
                </div>
                <div class="col-md-6">
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import Section from '../layout/Section.vue';

    export default {
        components: {Section}
    }
</script>


<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
        background: $purple-7;
        color: var(--bs-white);

        .row {
            background: url("/landing/ee/background.svg") no-repeat right center;

            div:first-child {
                padding: calc($spacer * 9);

                h3 {
                    font-size: $h1-font-size;
                    margin-bottom: calc($spacer * 2);
                    font-weight: 800;
                }
            }
        }
    }
</style>