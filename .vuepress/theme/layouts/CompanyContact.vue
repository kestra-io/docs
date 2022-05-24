<template>
    <div id="wrapper">
        <Chat />
        <Header />
        <div id="container">
            <main>
                <Breadcrumb />

                <!-- Hero Start -->
                <section class=" d-flex align-items-center" :style="'background: url('+ require('../assets/company/contact/contact-detail.jpg') + ') center center;'">
                    <div class="container">
                        <div class="row align-items-center">
                            <div class="col-12">
                                <div class="title-heading mt-5 pt-4 mb-5 pb-4">
                                    <h1 class="heading">More informations ?</h1>
                                    <p class="text-dark">Need some information about <span class="text-primary font-weight-bold">Kestra</span>, want to have a better insight or demo of our product? Don't hesitate and contact us!</p>

                                    <div class="media contact-detail align-items-center mt-3">
                                        <div class="icon">
                                            <mail-icon class="fea icon-m-md text-dark mr-3"></mail-icon>
                                        </div>
                                        <div class="media-body content">
                                            <h5 class="title font-weight-bold mb-0">Email</h5>
                                            <a href="mailto:hello@kestra.io" class="text-primary">hello@kestra.io</a>
                                        </div>
                                    </div>

                                    <div class="media contact-detail align-items-center mt-3">
                                        <div class="icon">
                                            <phone-icon class="fea icon-m-md text-dark mr-3"></phone-icon>
                                        </div>
                                        <div class="media-body content">
                                            <h5 class="title font-weight-bold mb-0">Phone</h5>
                                            <a href="tel:+33972178262" class="text-primary">+33 9 72 17 82 62</a>
                                        </div>
                                    </div>

                                    <div class="media contact-detail align-items-center mt-3">
                                        <div class="icon">
                                            <map-pin-icon class="fea icon-m-md text-dark mr-3"></map-pin-icon>
                                        </div>
                                        <div class="media-body content">
                                            <h5 class="title font-weight-bold mb-0">Location</h5>
                                            <a href="javascript: void(0);" class="video-play-icon text-primary" v-b-modal.modal-1>View on Google map</a>
                                        </div>
                                        <b-modal hide-footer header-close-variant="white" header-class="border-0" content-class="border-0" id="modal-1" size="lg" centered body-class="p-0">
                                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2529.4129137503974!2d3.058483751551351!3d50.656593579403726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c32a66e9daefcd%3A0xedea9e4399f53236!2s81%20Rue%20du%20Pr%C3%A9%20Catelan%2C%2059110%20La%20Madeleine!5e0!3m2!1sen!2sfr!4v1637670710837!5m2!1sen!2sfr" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
                                        </b-modal>
                                    </div>
                                    <ul class="list-unstyled social-icon mb-0 mt-4">
                                        <li class="list-inline-item ml-1">
                                            <a href="https://github.com/kestra-io" target="_blank" rel=”noopener” class="rounded">
                                                <github-icon class="fea icon-sm fea-social"></github-icon>
                                            </a>
                                        <li class="list-inline-item ml-1">
                                            <a href="https://twitter.com/kestra_io" target="_blank" rel=”noopener” class="rounded">
                                                <twitter-icon class="fea icon-sm fea-social"></twitter-icon>
                                            </a>
                                        </li>
                                        <li class="list-inline-item ml-1">
                                            <a href="https://www.linkedin.com/company/kestra" target="_blank" rel=”noopener” class="rounded">
                                                <linkedin-icon class="fea icon-sm fea-social"></linkedin-icon>
                                            </a>
                                        </li>
                                        <li class="list-inline-item ml-1">
                                            <a href="https://join.slack.com/t/kestra-io/shared_invite/zt-193shv281-rK9QOEfZC2_vEbDO7Uxtbw" target="_blank" rel=”noopener” class="rounded">
                                                <slack title="" />
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
        <Footer />
    </div>
</template>

<script>
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/layout/Breadcrumb"
import {BModal, VBModal} from 'bootstrap-vue'
import Slack from 'vue-material-design-icons/Slack'
import {ArrowUpIcon, GithubIcon, LinkedinIcon, MailIcon, MapPinIcon, PhoneIcon, TwitterIcon,} from 'vue-feather-icons';
import Chat from "../components/layout/Chat";

export default {
    components: {
        Header,
        Footer,
        Breadcrumb,
        BModal,
        ArrowUpIcon,
        MailIcon,
        PhoneIcon,
        MapPinIcon,
        TwitterIcon,
        LinkedinIcon,
        GithubIcon,
        Slack,
        Chat,
    },
    directives: { 'b-modal': VBModal }
}
</script>
<style lang="scss">
@import '../styles/index';
</style>

<style lang="scss" scoped>
/deep/ .modal-content {
    background-color: transparent;
}
</style>
