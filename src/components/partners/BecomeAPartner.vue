<template>
    <section id="form">
        <div class="container">
            <div class="header text-center mb-4">
                <div class="col-md-10 col-lg-7 mx-auto">
                    <h2 data-usal="fade-l">Become a <span class="highlight">Partner</span></h2>
                    <p>
                        If you are interested in becoming a Kestra partner, please contact us with
                        any questions.
                    </p>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-12 col-xl-8">
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
    </section>
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

    section {
        background: var(--ks-background-body);
        padding: $spacer * 3 $spacer;
        color: var(--ks-content-primary);
        h3 {
            font-size: $font-size-4xl;
        }
        .card {
            background: var(--ks-background-secondary);
        }
    }
</style>