<template>
    <div class="container-fluid">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <h4>Take Kestra to the next level with the Enterprise Edition</h4>
                    <ul>
                        <li>Best in Class Support</li>
                        <li>SSO/OIDC Authentication</li>
                        <li>High Availability</li>
                        <li>Role Based Access</li>
                        <li>And More...</li>
                    </ul>

                    <a href="/enterprise" class="btn btn-lg btn-primary">Learn more</a> &nbsp;&nbsp;
                    <a href="/company/contact" class="btn btn-lg btn-dark me-2">Contact us</a>
                </div>
                <div class="col-md-6">
                    <img src="/landing/usages/rectangle.png" alt="" />
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import Section from '../../components/layout/Section.vue';

    export default {
        components: {Section}
    }
</script>


<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
        background: $purple-16;
        color: var(--bs-white);

        .row {
            div:first-child {
                padding: calc($spacer * 7);

                h3 {
                    font-size: $h1-font-size;
                    margin-bottom: calc($spacer * 2);
                    font-weight: 800;
                }
            }
        }
    }
</style>