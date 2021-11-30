
<template>
    <div>
        <Shape class="text-footer" />

        <!-- Footer Start -->
        <footer class="footer">
            <div class="container">
                <div class="row">
                    <div class="col-lg-3 col-12 mb-0 mb-md-3 pb-0 pb-md-2">
                        <router-link to="/" class="logo-footer">
                            <img src="../../public/logo-white.svg" height="60" alt="">
                        </router-link>
                        <p class="mt-2">The modern, scalable orchestrator & scheduler open source platform.</p>
                        <ul class="list-unstyled social-icon social mb-0 mt-4">
                            <li class="list-inline-item">
                                <a href="https://github.com/kestra-io" class="rounded">
                                    <github-icon class="fea icon-sm fea-social"></github-icon>
                                </a>
                            </li>
                            <li class="list-inline-item ml-1">
                                <a href="https://twitter.com/kestra_io" class="rounded">
                                    <twitter-icon class="fea icon-sm fea-social"></twitter-icon>
                                </a>
                            </li>
                            <li class="list-inline-item ml-1">
                                <a href="https://www.linkedin.com/company/kestra" class="rounded">
                                    <linkedin-icon class="fea icon-sm fea-social"></linkedin-icon>
                                </a>
                            </li>
                        </ul>
                        <!--end icon-->
                    </div>
                    <!--end col-->

                    <div class="col-lg-3 col-12 mb-0 mb-md-3 pb-0 pb-md-2">
                        <h4 class="text-light footer-head">Discover</h4>
                        <ul class="list-unstyled footer-list">
                            <li>
                                <router-link to="/docs/getting-started/" class="text-foot">
                                    <ChevronRight title="" /> Getting Started
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/docs/concepts/" class="text-foot">
                                    <ChevronRight title="" /> Concepts
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/docs/architecture/" class="text-foot">
                                    <ChevronRight title="" /> Architecture
                                </router-link>
                            </li>

                        </ul>
                    </div>
                    <!--end col-->

                    <div class="col-lg-3 col-12 mb-0 mb-md-3 pb-0 pb-md-2">
                        <h4 class="text-light footer-head">Learn</h4>
                        <ul class="list-unstyled footer-list">
                            <li>
                                <router-link to="/docs/developer-guide/" class="text-foot">
                                    <ChevronRight title="" /> Developer Guide
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/docs/administrator-guide/" class="text-foot">
                                    <ChevronRight title="" />  Administrator Guide
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/docs/plugin-developer-guide/" class="text-foot">
                                    <ChevronRight title="" />  Plugin Developer Guide
                                </router-link>
                            </li>
                        </ul>
                    </div>
                    <!--end col-->

                    <div class="col-lg-3 col-12 mb-0 mb-md-3 pb-0 pb-md-2">
                        <h4 class="text-light footer-head">Follow</h4>
                        <ul class="list-unstyled footer-list">
                            <li>
                                <a href="https://github.com/kestra-io" class="text-foot">
                                    <ChevronRight title="" /> GitHub
                                </a>
                            </li>
                            <li>
                                <a href="https://www.linkedin.com/company/kestra" class="text-foot">
                                    <ChevronRight title="" />  LinkedIn
                                </a>
                            </li>
                            <li>
                                <a href="https://twitter.com/kestra_io" class="text-foot">
                                    <ChevronRight title="" />  Twitter
                                </a>
                            </li>
                        </ul>

                        <!--
                        <h4 class="text-light footer-head">Newsletter</h4>
                        <p>Sign up and receive the latest tips via email.</p>
                        <form>
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="foot-subscribe form-group position-relative">
                                        <label>Write your email <span class="text-danger">*</span></label>
                                        <mail-icon class="fea icon-sm icons"></mail-icon>
                                        <input type="email" name="email" id="emailsubscribe"
                                               class="form-control pl-5 rounded" placeholder="Your email : " required>
                                    </div>
                                </div>
                                <div class="col-lg-12">
                                    <input type="submit" id="submitsubscribe" name="send"
                                           class="btn btn-soft-primary btn-block" value="Subscribe">
                                </div>
                            </div>
                        </form>
                        -->
                    </div>
                    <!--end col-->
                </div>
                <!--end row-->
            </div>
            <!--end container-->
        </footer>
        <!--end footer-->
        <footer class="footer footer-bar">
            <div class="container text-center">
                <div class="row align-items-center">
                    <div class="col-sm-6">
                        <div class="text-sm-left">
                          <p class="mb-0">
                              © {{  new Date().getFullYear() }} <a href="https://nigh.tech">NighTech</a>.
                              Developed with <Heart class="text-danger" /> in 🇫🇷 .
                            </p>
                        </div>
                    </div>
                    <!--end col-->

                </div>
                <!--end row-->
            </div>
            <!--end container-->
        </footer>
        <!--end footer-->
    </div>
</template>

<script>
import ChevronRight from 'vue-material-design-icons/ChevronRight'
import Heart from 'vue-material-design-icons/Heart'
import {
    GithubIcon,
    TwitterIcon,
    LinkedinIcon,
    MailIcon,
} from 'vue-feather-icons';
import Shape from "./layout/Shape";

export default {
    data() {
        return {}
    },
    components: {
        Shape,
        GithubIcon,
        TwitterIcon,
        LinkedinIcon,
        MailIcon,
        ChevronRight,
        Heart
    }
}
</script>

<style lang="scss" scoped>
    @import ".vuepress/theme/styles/variables";

    footer.footer {
        border-top: 0;
        text-align: left;
        color: $gray-500;
        padding: 2.5rem 0;

        a {
            color: $gray-500;
            &:hover {
                color: $blue;
            }
        }
    }

    .footer-top {
        color: $footer;
    }

    .footer {
        background: $footer;
        position: relative;
        color: $gray-500;

        .logo-footer {
            font-size: 22px;
        }
        .footer-head {
            font-size: 20px;
            letter-spacing: 1px;
            font-weight: 500;
        }
        .foot-subscribe {
            .form-control {
                background-color: lighten($black, 10%);
                border: 1px solid lighten($black, 10%);
                color: $light;
                &:focus {
                    box-shadow: none;
                }
            }
            &.foot-white {
                .form-control {
                    color: $gray-500;
                }
            }
            input{
                &::placeholder{
                    color: $gray-500;
                }
            }
        }
        .text-foot {
            color: $gray-500;
        }
        .footer-list {
            margin-bottom: 0;
            li {
                a{
                    transition: all 0.5s ease;
                    &:hover {
                        color: lighten($gray-500, 20%);
                    }
                }
                &:last-child{
                    margin-bottom: 0;
                }
            }
        }
        &.footer-bar {
            padding: 15px 0 !important;
            border-top: 1px solid darken($footer, 25%);
            background: darken($footer, 5%);
        }
    }
</style>
