<template>
    <div class="container-fluid">
        <div class="container">
            <div class="row">
                <div class="col-12 col-md-6" data-aos="zoom-in">
                    <h2><span>Elevating</span> Orchestration and Automation</h2>
                    <p>
                        We aim to offer a product that empowers everyone to manage and automate their data, workflows, and tasks in a simple and efficient way. Our focus has always been to provide a tool that is easy to use, scalable and high-performing.
                    </p>
                    <p>
                        By bringing Infrastructure as Code best practices to data, process, and microservice orchestration, Kestra makes both scheduled and event-driven workflows easy.
                    </p>
                </div>
                <div class="col-12 col-md-6 img-block d-flex align-items-center justify-content-center">
                    <img data-aos="fade-left" class="w-100" src="/landing/company/elevating.svg" alt="Square build of arrows creating a loop" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Section from '../../components/layout/Section.vue';

    export default {
        components: {Section},
    }
</script>


<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
        color: var(--bs-white);
        position: relative;
        overflow: hidden;
        .row {
            border-top: $block-border;
            border-bottom: $block-border;
            padding: 5rem 0;

            h2 {
                font-size: $h2-font-size;
                font-weight: 300;

                span {
                    background: linear-gradient(90deg, #E151F7 -3.38%, #5C47F5 34.75%);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            }

            .img-block {
                margin: auto;

                img {
                    max-width: 22rem;
                }
            }
        }

        &:after {
            content: "";
            position: absolute;
            height: 100%;
            width: 100%;
            background: url('/landing/company/img-mask.svg') no-repeat right;
            background-size: cover;
            top: 0;
            right: 12%;
            z-index: 1;
        }

        &:before {
            content: "";
            position: absolute;
            height: 100%;
            width: 100%;
            background: url('/landing/company/text-mask.svg') no-repeat center left;
            background-size: cover;
            left: 16%;
            z-index: 2;
        }
    }
</style>