<template>
    <div class="square">
        <Squared>
            <div class="get-in-touch">
                <h1 data-usal="fade-r">Contact Us</h1>
                <p class="baseline" data-usal="fade-l">
                     If you have questions, inquiries, or feedback about Kestra, we're looking to
                    hearing from you.
                </p>
            </div>
            <div class="row justify-content-center">
                <div class="form-container">
                    <div id="hubspotForm" data-usal="fade-l" />
                </div>
            </div>
        </Squared>
    </div>
</template>
<script lang="ts" setup>
    import { onMounted } from "vue"
    import { hubspotFormCreate } from "~/utils/hubspot"
    import { useHubspotTheme } from "~/composables/useHubspotTheme"
    import Squared from "~/components/layout/Squared.vue"

    const { getStyles, styleId } = useHubspotTheme()

    onMounted(() => {
        hubspotFormCreate("contact_form", {
            formId: "77f32ae3-0f49-404a-a28d-6dfe92c8bc78",
            target: "#hubspotForm",
            styleId,
            css: getStyles()
        })
    })
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .square :deep(section.squared) {
        padding-bottom: 90px !important;
    }

    .get-in-touch {
        text-align: center;
        color: var(--ks-content-primary);
    }

    .form-container {
        margin-top: $rem-2;
        border: 1px solid var(--ks-border-secondary);
        padding: $rem-2;
        border-radius: $border-radius-lg;
        background: var(--ks-background-primary);
        max-width: 633px;
        max-height: fit-content;

        @include media-breakpoint-down(sm) {
            padding: $rem-1;
            width: 100%;
        }
    }
</style>

