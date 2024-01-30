<template>
    <div class="container-fluid">
        <div class="container">
            <div class="row">
                <div class="col-12 col-md-6" data-aos="zoom-in">
                    <h2><span>Elevating</span> Orchestration and Automation</h2>
                    <p>
                        Our ambition is to provide a tool that enables all kinds of users to orchestrate and automate their data, workflows, and batches with unparalleled simplicity, autonomy, and high performance. From the first day of our journey, we have been driven by this goal, and we continue to challenge ourselves.
                    </p>
                    <p>
                        We have dedicated ourselves to the meticulous development of our open-source platform, ensuring that it meets the highest standards of performance and reliability but also empowers users to unlock new possibilities in data management and processing.
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
            left: 16%;
            z-index: 2;
        }
    }
</style>