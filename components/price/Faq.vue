<template>
      <div class="container">
        <div class="container mb-5">
            <div class="question">
                <span>FAQ</span>
            </div>
            <div class="w-100">
                <CustomDetails class="que text-white" title="Is it easy to upgrade from Open Source edition to Kestra Enterprise?">
                    <p class="ans">As easy as it takes to add the license key to the configuration file and restart your server!</p>
                </CustomDetails>
                <CustomDetails class="que text-white" title="Does the Enterprise Edition comes with Enterprise Support and SLAs?">
                    <p class="ans">Yes! In addition to all the feature sets, we’re providing access to an exclusive customer portal, end-to-end customer onboarding, and guaranteed response time on support requests! Everything operates in a full Customer Success Framework.</p>
                </CustomDetails>

                <CustomDetails class="que text-white" title="Is Kestra Enterprise made for small teams?">
                    <p class="ans">Kestra Enterprise is addressing any organizations & professionals seeking to secure production workloads with high-security standards and enterprise support.</p>
                </CustomDetails>
            </div>
        </div>
    </div>

</template>

<script setup>
import CustomDetails from "../components/layout/CustomDetails.vue";
</script>


<style scoped lang="scss">
@import "../../assets/styles/variable";

.container {
    display: flex;
    max-width: 1140px;
    justify-content: space-between;
    gap: 64px;

    @include media-breakpoint-down(lg) {
        display: block;
    }

    .question {
        @include media-breakpoint-down(lg) {
            margin-bottom: $rem-2 !important;
        }
        span {
            font-size: $rem-4;
            font-weight: 600;
            line-height: 75.2px;
            text-align: left;
            color: #FFFFFF;

            @include media-breakpoint-down(lg) {
                font-size: $rem-2;
                font-weight: 600;
                line-height: 37.6px;
            }
        }
    }
}
.que{
    background-color: $black-2;
    box-shadow: none;
    border: $block-border;
    line-height: 1.625rem !important;
    font-weight: 700;
    font-size: $font-size-lg;
}
.ans{
    font-weight: 300;
    line-height: 1.625rem;
    font-size: $font-size-lg;
}
.title{
    font-size: $font-size-3xl;
    font-weight: 300;
    line-height: 2.7rem;
    padding-bottom: 35px;
}
h2 {
    margin-top: 2rem;
}
</style>
