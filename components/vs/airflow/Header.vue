<template>
    <div class="container-fluid">
        <div class="hero container">
            <div class="row">
                <div class="col-md-6 order-1 order-md-0 align-items-center d-flex">
                    <div>
                        <h1 data-aos="fade-right">The differences between Kestra and Airflow</h1>
                        <p class="baseline" data-aos="fade-left">How to Choose the Right Orchestration Platform</p>
                        <div class="cta">
                            <NuxtLink href="/demo" class="btn btn-animated btn-purple-animated mx-2 mt-2" data-aos="zoom-in">
                                Talk to us
                            </NuxtLink>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 order-0 order-md-1 d-flex justify-content-center" data-aos="zoom-in">
                    <img class="zoom img-fluid" src="/landing/vs/airflow/header.svg" alt="A screenshot of the user interface of Kestra's application"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
    }
</script>

<style lang="scss" scoped>
    @import "../../../assets/styles/variable";

    .container-fluid {
        background: url("/landing/vs/header-bg.svg") no-repeat center;
        background-size: cover;
        color: var(--bs-white);
        padding-top: 80px;
        margin-top: -80px;

        .container {
            border-bottom: $block-border;

            h1, .baseline {
                color: $white;
                font-weight: 400;
                padding: 0;
                margin-bottom: 1rem;
            }

            .baseline {
                font-size: $font-size-xl;
            }
        }
    }
</style>

