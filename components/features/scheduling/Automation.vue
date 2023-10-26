<template>
    <section class="automation">
        <h3 class="automation-title">Automation and</h3>
        <h3 class="mb-5 automation-title">Scheduling <span class="automation-title-animated">Features</span></h3>
        <div class="row d-flex justify-content-center">
            <div class="col-12 col-md-6 col-lg-3 mb-4">
                <div class="card h-100" data-aos="fade-right">
                    <div class="card-body mx-2">
                        <img src="/landing/features/scheduling/automation/Icon_auto.svg" alt="BackFill pattern svg" class="icon mb-2">
                        <h6 class="card-heading">Backfill Support</h6>
                        <p class="card-para">Kestra's Backfill feature automatically catches up on missed workflows.</p>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-3 mb-4">
                <div class="card h-100 d-flex" data-aos="fade-right">
                    <div class="card-body mx-2">
                        <img src="/landing/features/scheduling/automation/Icon_auto1.svg" alt="Tune-Based svg" class="icon mb-2">
                        <h6 class="card-heading">Time-Based Scheduling</h6>
                        <p class="card-para">Kestra provides versatile scheduling options for timely and reliable task execution, from regular intervals to condition-based triggers.</p>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-3 mb-4">
                <div class="card h-100 d-flex" data-aos="fade-right">
                    <div class="card-body mx-2">
                        <img src="/landing/features/scheduling/automation/Icon_auto2.svg" alt="Event-Driven svg" class="icon mb-2">
                        <h6 class="card-heading">Event-Driven Triggers</h6>
                        <p class="card-para">Initiate workflows based on real-time events, and schedule them to listen for specific events at designated times.</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="row d-flex justify-content-center">
            <div class="col-12 col-md-6 col-lg-3 mb-4">
                <div class="card h-100 d-flex" data-aos="fade-right">
                    <div class="card-body mx-2 ">
                        <img src="/landing/features/scheduling/automation/Icon_auto3.svg" alt="API-Based svg" class="icon mb-2">
                        <h6 class="card-heading">API-Based Triggers</h6>
                        <p class="card-para"> Leverage API-based triggers for smooth integration with your existing systems, allowing automated workflows to adapt to external conditions.</p>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-3 mb-4">
                <div class="card h-100 d-flex " data-aos="fade-right">
                    <div class="card-body mx-2 ">
                        <img src="/landing/features/scheduling/automation/Icon_auto4.svg" alt="Subflow svg" class="icon mb-2">
                        <h6 class="card-heading">Subflow Triggering</h6>
                        <p class="card-para">Initiate subflows from the primary workflow to manage complex workflows while keeping reusability and structure.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script setup>
import Section from '../../layout/Section.vue';
</script>
<style scoped lang="scss">
@import "../../../assets/styles/variable";

.automation{
        padding: calc($spacer * 4) 0;
        background-color: $black-4;
        &-title{
            font-weight: 300;
            font-size: $font-size-3xl;
            &-animated{
                background: linear-gradient(90deg, #E151F7 57.52%, #5C47F5 92.48%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;

            }
        }
    }
        h3 {
            text-align: center;
            margin-bottom: 0;
        }

.card{
    background-color: $black-2;
    color: $white;
    box-shadow: none !important;
    &-body{
        padding: 64px 32px 32px 32px;
    }
    &-heading{
        font-size: $font-size-xl;
        font-weight:300;
        line-height: 32px;
    }
    &-para{
        font-size: $font-size-sm;
        font-weight: 400;
        line-height: 22px;
        color: $white-1;
    }
}
.icon{
    width: 42px;
}

</style>