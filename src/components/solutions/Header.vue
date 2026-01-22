<template>
    <div class="container-fluid bg-dark-4">
        <div class="hero hero-sm container">
            <div class="row">
                <div
                    class="align-items-center col-md-12 d-flex justify-content-center order-1 order-md-0"
                >
                    <div class="text-center d-flex flex-column gap-3">
                        <p data-usal="fade-l" class="title">Use Cases</p>
                        <p data-usal="fade-l" class="baseline">
                            Harness the value of your data, unlock new insights, and drive informed
                            decision-making using Kestra's automation platform
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Console from "vue-material-design-icons/Console.vue"
    import Email from "vue-material-design-icons/Email.vue"

    export default {
        components: { Console, Email },
    }
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .container-fluid {
        background: url("/landing/usecases/header-bg.svg") no-repeat center;
        background-size: 100% 100%;

        .container {
            border-bottom: $container-border;

            p {
                color: $white;
                font-family: $font-family-sans-serif;
                font-style: normal;
                font-weight: 400;
                margin: 0;

                &.title {
                    font-size: $font-size-4xl;
                    line-height: 3.375rem;
                }

                &.baseline {
                    font-size: $font-size-xl;
                    line-height: 2rem;
                }
            }
        }
    }
</style>