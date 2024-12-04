<template>
    <div ref="securityBlock" class="content">
        <div class="container">
            <h3 class="title">Customer Success Program & Support with SLA to ensure your success at every step.</h3>
            <div class="blocks">
                <div class="block">
                    <RocketLaunchOutline/>
                    <h4>Onboarding</h4>
                    <span>Training, installation, and expert services.</span>
                </div>
                <div class="block">
                    <HandshakeOutline/>
                    <h4>Partnership</h4>
                    <span>Tailored business cases and clear quotations to drive your growth.</span>
                </div>
                <div class="block">
                    <LaptopAccount/>
                    <h4>Customer success</h4>
                    <span>Support, office hours, and roadmap previews to keep you ahead.</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
  import RocketLaunchOutline from "vue-material-design-icons/RocketLaunchOutline.vue";
  import HandshakeOutline from "vue-material-design-icons/HandshakeOutline.vue";
  import LaptopAccount from "vue-material-design-icons/LaptopAccount.vue";

</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .content {
        width: 100%;
        background-color: $white;

        .container {
            max-width: 1120px;
            padding: 0;
            border-top: none;
            background-color: $white;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: $rem-2;

            @media only screen and (max-width: 991px) {
                padding: 0 $rem-2;
            }

            .title {
                color: $black;
                font-family: $font-family-sans-serif;
                font-size: 40px;
                font-weight: 600;
                line-height: 50px;
                text-align: center;
                max-width: 832px;


                @media only screen and (max-width: 991px) {
                    font-size: 24px;
                    line-height: 30px;
                }
            }

            .blocks {
                display: flex;
                gap: 16px;
                justify-content: space-between;

                @media only screen and (max-width: 905px) {
                    flex-wrap: wrap;
                    width: 100%;
                    justify-content: center;
                }

                .block {
                    background-color: #F5F7F9;
                    max-width: 369px;
                    padding: $rem-2 40px;
                    border-radius: 20px;
                    width: 100%;

                    @media only screen and (max-width: 1200px) {
                        padding: 20px;
                    }

                    h4 {
                        padding-top: 16px;
                        font-family: $font-family-sans-serif;
                        font-size: 20px;
                        font-weight: 700;
                        line-height: 31.23px;
                        text-align: left;
                        color: $black;

                        @media only screen and (max-width: 991px) {
                            padding-top: 8px;
                            font-size: 18px;
                        }
                    }

                    span {
                        font-family: $font-family-sans-serif;
                        font-size: 16px;
                        font-weight: 400;
                        line-height: 25.2px;
                        text-align: left;
                        color: #505050;
                        padding-top: 8px;

                        @media only screen and (max-width: 991px) {
                            font-size: 14px;
                        }
                    }

                    :deep(.material-design-icon) {
                        .material-design-icon__svg {
                            font-size: 32px;
                            color: #6862F6;
                        }
                    }
                }
            }
        }
    }
</style>