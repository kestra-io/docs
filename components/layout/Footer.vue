
<template>
    <footer>
        <div class="container py-4 py-md-5 px-4 px-md-3">
            <div class="row">
                <div class="col-lg-3 mb-3">
                    <a href="/public">
                        <img src="/logo-white.svg" height="60" alt="">
                    </a>
                    <p class="mt-2">Open-source data orchestration and scheduling platform.</p>
                    <Socials class="mt-4" />
                </div>
                <div class="col-lg-9 mb-3">
                    <div class="row">
                        <div class="col-6 col-lg-2 offset-lg-1 mb-3">
                            <h5>Product</h5>
                            <ul class="list-unstyled">
                                <li class="mb-2"><a href="/features/features">Features</a></li>
                                <li class="mb-2"><a href="#">Connectors</a></li>
                                <li class="mb-2"><a href="/enterprise">Enterprise Edition</a></li>
                            </ul>
                        </div>
                        <div class="col-6 col-lg-2 mb-3">
                            <h5>Solutions</h5>
                            <ul class="list-unstyled">
                                <li class="mb-2"><a href="/features/usages">Usages</a></li>
                                <li class="mb-2"><a href="#">For Companies</a></li>
                            </ul>
                        </div>
                        <div class="col-6 col-lg-2 mb-3">
                            <h5>Community</h5>
                            <ul class="list-unstyled">
                                <li class="mb-2"><a href="/blogs">Blogs</a></li>
                                <li class="mb-2"><a href="https://api.kestra.io/v1/communities/slack/redirect" target="_blank">Slack</a></li>
                                <li class="mb-2"><a href="https://github.com/kestra-io" target="_blank">Github</a></li>
                            </ul>
                        </div>
                        <div class="col-6 col-lg-2 mb-3">
                            <h5>Docs</h5>
                            <ul class="list-unstyled">
                                <li class="mb-2"><a href="/docs">Documentation</a></li>
                                <li class="mb-2"><a href="/plugins/">Plugins documentation</a></li>
                                <li class="mb-2"><a href="/docs/terraform">Terraform provider</a></li>
                                <li class="mb-2"><a href="/docs/administrator-guide">Administrator guide</a></li>
                            </ul>
                        </div>
                        <div class="col-6 col-lg-2 mb-3">
                            <h5>Company</h5>
                            <ul class="list-unstyled">
                                <li class="mb-2"><a href="/company/about-us">About us</a></li>
                                <li class="mb-2"><a href="/company/careers">Careers</a></li>
                                <li class="mb-2"><a href="/company/contact">Contact us</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container py-3">
            <div class="row">
                <div class="col-sm-6">
                    <div>
                        <p class="mb-0">
                            © {{  new Date().getFullYear() }} <a href="https://kestra.io">Kestra Technologies</a>.
                            Developed with <Heart class="text-danger" /> in 🇫🇷 .

                        </p>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="text-end">
                        <p class="mb-0">
                            <a href="/company/privacy-policy">Privacy Policy</a>
                            /
                            <a href="/company/cookie-policy">Cookie Policy</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
    import Socials from "./Socials.vue";
    import Heart from "vue-material-design-icons/Heart.vue";

    export default {
        components: {Heart, Socials},
    }
</script>

<style lang="scss">
    footer {
        position: relative;
        background-color: var(--bs-secondary);
        font-size: var(--bs-font-size-sm);

        h5, a, p{
            color: var(--bs-white);
            font-size: var(--bs-badge-font-size);
        }

        h5 {
            text-transform: uppercase;
            font-weight: bold;
            font-family: var(--bs-font-monospace);
        }

        &:before {
            z-index: 1;
            display: block;
            position: absolute;
            width: 100%;
            height: 100%;
            content: '';
            background: url("../../assets/styles/layout/footer-halo.svg") no-repeat bottom left;
        }

        .container {
            position: relative;
            z-index: 2;
        }
    }
</style>