<template>
    <section class="quote-section">
        <div class="container">
            <div data-host="self-hosted">
                <Quotes :quotes="appleQuotes" />
            </div>

            <div data-host="cloud-hosted" class="d-none">
                <Quotes :quotes="foundationQuotes" />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import Quotes from "~/components/common/Quotes.vue"
    import appleLogo from "~/assets/teams/apple.svg?raw"
    import foundationLogo from "~/assets/pricing/foundation-direct.svg?raw"

    const appleQuotes = [
        {
            quote: "We switched from Airflow because we want engineers solving problems, not coding orchestration. Kestra delivers end-to-end automation with the robustness we need at our scale. Few companies operate at this level, especially in AI/ML.",
            author: "Senior Engineering Manager (ML Team)",
            smallLogoSvg: appleLogo
        }
    ]

    const foundationQuotes = [
        {
            quote: "Kestra Cloud has been a pivotal part of giving us flexibility and scalability we need to pull off complex processes we do at Foundation Direct.",
            author: "Michael Heidner - SVP of Analytics and Business Intelligence",
            smallLogoSvg: foundationLogo
        }
    ]
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .quote-section {
        position: relative;
        z-index: 10;
        width: 100%;
        background: var(--ks-background-primary);
        border-bottom: 1px solid var(--ks-border-primary);

        &::before {
            content: "";
            position: absolute;
            inset: 0;
            background: var(--ks-background-purple-light);
            pointer-events: none;
        }
    }

    .container {
        position: relative;
        z-index: 1;
        max-width: 1200px;
        margin-inline: auto;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .d-none {
            display: none !important;
        }

        :deep(.wrapper) {
            background-color: transparent !important;

            .navigation {
                display: none;
            }
        }

        :deep(.content) {
            padding-top: 4rem;
            padding-bottom: 4rem;

            @include media-breakpoint-up(lg) {
                padding-top: 7.5rem;
                padding-bottom: 7.5rem;
            }
        }
    }
</style>