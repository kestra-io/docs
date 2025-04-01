<template>
    <div class="container mt-5 pt-5">
        <div class="row mt-5">
            <div class="col-md-12 col-lg-7">
                <h2>
                    Kestra Cloud
                    <span class="highlight">Early Adopter Program</span>
                </h2>
                <h5 class="mt-3">
                    Be among the first to experience Kestra Cloud with exclusive
                    access before general availability.
                </h5>
                <div class="row mt-5">
                    <div class="col-6">
                        <h6>
                            <img src="./images/calendar_month.png" />
                            Get Exclusive 30-Day Access
                        </h6>
                        <p>
                            Explore Kestra Cloud with full, exclusive access for
                            30 days prior to general availability.
                        </p>
                    </div>
                    <div class="col-6">
                        <h6>
                            <img src="./images/small_cloud.png" />
                            Fully Managed Infrastructure
                        </h6>
                        <p>
                            No infrastructure setup, deployment worries, or
                            ongoing maintenance. We handle the heavy lifting
                            while you focus on your workflows.
                        </p>
                    </div>
                    <div class="col-6 mt-3">
                        <h6>
                            <img src="./images/support_agent.png" />
                            Dedicated Experts Exchange
                        </h6>
                        <p>
                            Receive personalized support and expert guidance
                            throughout your access period.
                        </p>
                    </div>
                    <div class="col-6 mt-3">
                        <h6>
                            <img src="./images/check_circle.png" />
                            Enterprise Feature Set
                        </h6>
                        <p>
                            Access enterprise features including enhanced
                            security, RBAC, observability, and governance during
                            your exclusive access.
                        </p>
                    </div>
                    <div class="col-12 mt-5">
                        <p class="mb-2">
                            “Kestra Cloud has been a pivotal part of giving us
                            flexibility and scalability we need to pull off
                            complex processes we do at Foundation Direct.”
                        </p>
                        <p class="mb-0">
                            <strong>
                                Michael Heidner - CEO & Kestra Cloud Early
                                Adopter
                            </strong>
                        </p>
                        <img src="./images/foundation.png" />
                    </div>
                </div>
            </div>
            <div id="cloudForm" class="col-md-12 col-lg-5 form" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { hubspotFormCreate } from "~/utils/hubspot.js";

hubspotFormCreate("cloud_form", {
    portalId: "27220195",
    formId: "ceb64a26-1d2a-4335-b1bf-d856d1854ba8",
    region: "eu1",
    target: "#cloudForm",
});
</script>

<style scoped lang="scss">
.cloud {
    & img {
        width: 180px;
        height: auto;
    }

    h6 > img {
        width: 30px;
        height: auto;
        margin-right: 10px;
    }

    & .form {
        position: relative;
        padding: 60px 40px 0 40px;
        border-radius: 16px;
        background-color: white;

        &::after {
            @media (min-width: 992px) {
                content: "";
                position: absolute;
                top: -20%;
                right: -50%;
                width: 400px;
                height: 400px;
                background-image: url("./images/cloud_visual.png");
                background-size: contain;
                background-repeat: no-repeat;
            }
        }
    }
}
</style>
