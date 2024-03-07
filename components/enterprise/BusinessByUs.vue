<template>
    <div class="container">
        <div class="business-container">
            <div class="business-by-us">
                <div class="title-block">
                    <p>
                        Worldwide Companies Orchestrate their Business-Critical Application with
                        <a href="#">Kestra</a>
                    </p>
                </div>
                <div class="info-content">
                    <div class="info-item">
                        <h3>5 Million</h3>
                        <p>Tasks executed each month</p>
                        <img src="/landing/enterprise/Leroy_Merlin 1.svg" alt="Leroy Merlin">
                    </div>
                    <div class="vertical-line"></div>
                    <div class="info-item">
                        <h3>+300,000</h3>
                        <p>executions per day</p>
                        <img src="/landing/enterprise/Mattilda.svg" alt="Mattilda">
                    </div>
                    <div class="vertical-line"></div>
                    <div class="info-item">
                        <h3>X10</h3>
                        <p>Tasks executed each month</p>
                        <img src="/landing/enterprise/CleverConnect.svg" alt="Clever Connect">
                    </div>
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
    @import "../../assets/styles/variable";

    .business-container {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: calc($spacer * 1.625);
        background-color: $black-2;
        border-radius: calc($spacer * 0.5);
        border: 1px solid #404559;
        background: url("/landing/enterprise/business-us-bg.svg") no-repeat 213% 34%;
        background-size: 104% 226%;

        .business-by-us {
            display: flex;
            flex-direction: column;
            gap: calc($spacer * 0.758);

            .title-block {
                color: $white;
                font-size: calc($font-size-base * 1.063);
            }

            .info-content {
                display: flex;
                gap: 2rem;
                justify-content: center;
                align-items: center;

                @include media-breakpoint-down(lg) {
                    flex-direction: column;
                }

                .vertical-line {
                    background-color: #FFFFFF30;
                    min-height: calc($spacer * 6.875);
                    width: 1px;
                    @include media-breakpoint-down(lg) {
                        height: 1px;
                        min-height: 1px;
                        width: 100%;
                    }
                }

                .info-item {
                    display: flex;
                    flex-direction: column;
                    gap: calc($spacer * 0.5);
                    align-items: center;

                    h3, p {
                        margin: 0;
                        color: $white;
                    }

                    h3 {
                        font-size: $font-size-3xl;
                        font-weight: 100;
                    }

                    p {
                        font-size: calc($font-size-base * 0.726);
                        font-weight: 400;
                        text-transform: uppercase;
                    }
                }
            }
        }
    }
</style>