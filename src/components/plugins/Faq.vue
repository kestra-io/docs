<template>
    <Faq :items="faqItems" />
</template>

<script setup lang="ts">
    import Faq from "~/components/price/Faq.vue"

    const faqItems = [
        {
            question: "Is it easy to upgrade from Open Source edition to Kestra Enterprise?",
            answer: "Yes. Kestra 1.0 is our first Long-Term Support (LTS) release, tested and hardened for production use. Many features that were previously in Beta are now generally available incl. Unit Tests, SLAs, Plugin Versioning, and new Helm charts for stable deployments.",
        },
        {
            question: "Does the Enterprise Edition comes with Enterprise Support and SLAs?",
            answer: "No. Kestra is fully open-source under the Apache 2.0 license. You can always export and run your flows, plugins, and configurations independently. For enterprise deployments, we also offer Kestra Enterprise and Kestra Cloud.",
        },
        {
            question: "Is Kestra Enterprise made for small teams?",
            answer: "Yes, Kestra Enterprise is designed to scale with your team. Whether you're a small team or a large organization, Kestra provides the tools and features you need to manage your workflows effectively.",
        },
    ]
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    :deep(.container) {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 0;
    }

    :deep(.question) {
        margin: 6rem 0 0 0 !important;

        span {
            font-size: 2rem !important;
            font-weight: 600;
            color: $white;
        }
    }

    :deep(.que) {
        background-color: #0a0b0d !important;
    }

    :deep(.ans) {
        background-color: #0a0b0d !important;
    }

    :deep(.accordion-button) {
        padding: 1.5rem 0 !important;
    }

    :deep(.accordion-body) {
        margin-left: 0 !important;
        background-color: #0a0b0d !important;
    }

    :deep(.accordion-item),
    :deep(.accordion-header),
    :deep(.custom-details) {
        background-color: #0a0b0d !important;
    }
</style>