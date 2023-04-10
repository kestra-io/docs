<template>
    <div class="container-fluid bg-body-tertiary">
        <div class="container">
            <Section
                title="Power your data workflows with Kestra"
                subtitle="Solutions"
            >
                <ul class="nav nav-pills">
                    <li class="nav-item">
                        <a class="nav-link" :class="{'active': active === 1}" @click="active = 1">Data platform orchestration</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" :class="{'active': active === 2}" @click="active = 2">Efficient Workflow Automation</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" :class="{'active': active === 3}" @click="active = 3">Decentralized Workflow Automation</a>
                    </li>
                </ul>

                <div class="row mt-5" v-if="active === 1">
                    <div class="col-md-6">
                        <ol>
                            <li>
                                <strong>For Data Engineers:</strong><br />
                                Easily automate complex data pipelines, reduce errors, and improve overall data quality, allowing you to focus on more strategic tasks.
                            </li>

                            <li>
                                <strong>For Data Analysts:</strong><br />
                                Quickly access and integrate data from a variety of sources, enabling faster and more accurate analysis, and unlocking new insights and business opportunities.
                            </li>

                            <li>
                                <strong>For Data Scientists:</strong><br />
                                Efficiently manage and deploy your machine learning models at scale, accelerate your research and experimentation, and deliver more accurate and reliable predictions.
                            </li>
                        </ol>
                    </div>
                    <div class="col-md-6">
                        <h1>TODO</h1>
                    </div>
                </div>

                <div class="row mt-5" v-if="active === 2">
                    <div class="col-md-6">
                        <ol>
                            <li>
                                <strong>TODO2</strong><br />
                                TODO2
                            </li>

                            <li>
                                <strong>TODO2</strong><br />
                                TODO2
                            </li>

                            <li>
                                <strong>TODO2</strong><br />
                                TODO2
                            </li>
                        </ol>
                    </div>
                    <div class="col-md-6">
                        <h1>TODO</h1>
                    </div>
                </div>

                <div class="row mt-5" v-if="active === 3">
                    <div class="col-md-6">
                        <ol>
                            <li>
                                <strong>TODO3</strong><br />
                                TODO3
                            </li>

                            <li>
                                <strong>TODO3</strong><br />
                                TODO3
                            </li>

                            <li>
                                <strong>TODO3</strong><br />
                                TODO3
                            </li>
                        </ol>
                    </div>
                    <div class="col-md-6">
                        <h1>TODO</h1>
                    </div>
                </div>

                <div class="text-center mt-5">
                    <a class="btn btn-lg btn-primary " href="#">See more</a>
                </div>
            </Section>
        </div>
    </div>
</template>

<script>
    import Section from '../layout/Section.vue';

    export default {
        components: {Section},
        data() {
            return {
                active: 1,
            };
        },
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
        color: var(--bs-white);

        ol {
            counter-reset: custom-counter;
            list-style: none;
            margin-left: 5rem;

            li {
                counter-increment: custom-counter;
                margin-bottom: calc($spacer * 3);

                &:last-child {
                    margin-bottom: 0;
                }

                &::before {
                    content: "0" counter(custom-counter) ;
                    color: $purple-2;
                    font-size: $h1-font-size;
                    font-family: var(--bs-font-monospace);
                    position: absolute;
                    margin-left: -5rem;
                    margin-top: -1rem;
                    font-weight: bolder;
                }
            }
        }

        .nav {
            width: 100%;
            justify-content: center;
            font-size: $font-size-sm;

            .nav-link {
                margin-right: calc($spacer * 1);
                border: 1px solid transparent;
                cursor: pointer;
            }

            .nav-link:not(.active) {

                border: 1px solid $purple-3;
                color: var(--bs-white);
            }
        }

        .row {
            background: rgba(#1B1923, 20%);
            padding: calc($spacer * 4);
            border-radius: var(--bs-border-radius-lg);
            position: relative;

            &:before {
                content: "";
                background: url("/landing/dot.svg") no-repeat bottom right;
                width: 329px;
                height: 236px;
                position: absolute;
                right: -2rem;
                bottom: -3rem;
            }
        }
    }
</style>