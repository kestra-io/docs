<template>
    <a id="form" />
    <div class="container-fluid">
        <div class="hero hero-sm container">
            <div class="row justify-content-center mb-4">
                <div class="col-md-10 col-lg-7 text-center">
                    <h3 data-usal="fade-l">Become a <span>Partner</span></h3>
                    <p>
                        If you are interested in becoming a Kestra partner, please contact us with
                        any questions.
                    </p>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-12 col-md-12 col-lg-12 col-xl-8">
                    <div class="card">
                        <div class="card-body">
                            <div class="card-text">
                                <div id="hubspotForm" data-usal="fade-l" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { onMounted } from "vue"
    import { hubspotFormCreate } from "~/utils/hubspot.js"

    onMounted(() => {
        hubspotFormCreate("partner_form", {
            formId: "e044de55-bda2-4bb8-9e50-ed8c78b94922",
            target: "#hubspotForm",
        })
    })
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .container-fluid {
        h3 {
            color: $white;
            font-size: $font-size-4xl;
            font-weight: 400;

            span {
                background: linear-gradient(90deg, #e151f7 54.91%, #5c47f5 66.79%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }

        p {
            color: $white;
            font-size: $font-size-xl;
            font-weight: 300;
        }
    }
</style>