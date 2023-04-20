<template>
    <div class="container-fluid">
        <div class="container">
            <div class="row">
                <div class="col-md-6 p-5">
                    <h2>Take Kestra to the next level with the Enterprise Edition</h2>
                    <ul class="mb-5">
                        <li>SSO/OIDC Authentication</li>
                        <li>Role-Based Access Control</li>
                        <li>Secret Manager Integration</li>
                        <li>High Availability</li>
                        <li>Best in Class Support</li>
                        <li>And More...</li>
                    </ul>

                    <NuxtLink href="/enterprise" class="btn btn-lg btn-primary me-2">Learn more</NuxtLink>
                    <NuxtLink href="/contact-us" class="btn btn-lg btn-dark">Contact us</NuxtLink>
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
        padding: 5rem 0;

        .row {
            background: url("/landing/ee/background.svg") no-repeat right center;

            @include media-breakpoint-down(md) {
                background: url("/landing/ee/background.svg") no-repeat left center;
            }

            div:first-child {
                padding: calc($spacer * 9);

                h2 {
                    margin-bottom: calc($spacer * 2);
                }
            }

            .col-md-6 {
                @include media-breakpoint-down(md) {
                    padding: 0;
                }
            }

            .btn-dark {
                background-color: rgba($white, 10%);
            }
        }
    }
</style>