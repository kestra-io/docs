<template>
    <div class="container-fluid bg-body-tertiary">
        <div class="container">
            <div class="row">
                <div class="col-md-5 elevating text-center text-md-end">
                    <img data-aos="fade-left" class="img-fluid mb-3" src="/landing/company/elevating.svg" alt="Square build of arrows creating a loop" />
                    <h3 data-aos="fade-right">Elevating Data Orchestration and Automation</h3>
                </div>
                <div class="col-md-5 mt-3 mt-md-0" data-aos="zoom-in">
                    <p>
                        Our ambition is to provide a tool that enables all kinds of users to orchestrate and automate their data, workflows, and batches with unparalleled simplicity, autonomy, and high performance. From the first day of our journey, we have been driven by this goal, and we continue to challenge ourselves.
                    </p>
                    <p>
                        We have dedicated ourselves to the meticulous development of our open-source platform, ensuring that it meets the highest standards of performance and reliability but also empowers users to unlock new possibilities in data management and processing.
                    </p>
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
        background: $purple-7;
        color: var(--bs-white);

        .row {
            padding: 5rem 0;

            .elevating {
                @include media-breakpoint-up(md) {
                    border-right: 1px solid var(--bs-white);
                }

                padding-right: 3rem;
                margin-right: 3rem;
            }

            @include media-breakpoint-up(sm) {
                .elevating {
                    padding-left: calc($spacer * 6);
                }
            }
       }
    }
</style>