<template>
    <div class="container-fluid bg-body-tertiary">
        <div class="container">
            <div class="row">
                <div class="col-md-5 text-right elevating">
                    <img src="/landing/company/group_48095708.png"/>
                    <h3>Elevating Data Orchestration and Automation</h3>
                </div>
                <div class="col-md-2 vr"></div>
                <div class="col-md-5">
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
            .text-right {
                text-align: right;
            }

            div {
                padding: calc($spacer * 2);
                padding-top: calc($spacer * 4);
            }

            .elevating {
                padding-left: calc($spacer * 6);
            }

            .vr {
                padding: 0px;
                margin-top: calc($spacer * 4);
                margin-bottom: calc($spacer * 4);
            }
       }
    }
</style>