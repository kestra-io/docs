// TODO: Reuse the new Quote component once created
<template>
    <section class="quote-section">
        <div class="container">
            <div data-host="self-hosted">
                <h1 class="quote-title" data-usal="fade-r">
                    <blockquote class="quote-content">
                        We switched from Airflow because we want engineers solving problems,
                        not coding orchestration. Kestra delivers end-to-end automation with the
                        robustness we need at our scale. Few companies operate at this level,
                        especially in AI/ML.
                    </blockquote>
                </h1>
                <p data-usal="fade-l delay-10">Senior Engineering Manager (ML Team)</p>
                <img :src="AppleLogo" alt="Apple Logo" class="company-logo"/>
            </div>

            <div data-host="cloud-hosted" class="d-none">
                <h1 class="quote-title" data-usal="fade-r">
                    <blockquote class="quote-content">
                        Kestra Cloud has been a pivotal part of giving us flexibility and
                        scalability we need to pull off complex processes we do at Foundation
                        Direct.
                    </blockquote>
                </h1>
                <p data-usal="fade-l delay-10">Michael Heidner - SVP of Analytics and Business Intelligence</p>
                <img :src="FoundationLogo" alt="Foundation Logo" class="company-logo"/>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import AppleLogo from "~/assets/teams/apple.svg?url"
    import FoundationLogo from "~/assets/pricing/foundation-direct.svg?url"
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .quote-section {
        position: relative;
        z-index: 10;
        width: 100%;
        padding: 4rem 1rem;
        @include media-breakpoint-up(lg) {
            padding: 120px 1rem;
        }
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

        div[data-host] {
            display: flex;
            flex-direction: column;
            gap: 2.5rem;
            text-align: center;
            align-items: center;
        }

        .quote-title {
            margin: 0;
            color: var(--ks-content-primary);
            font-weight: normal;
            line-height: 1.3;

            .quote-content {
                display: inline;
                padding: 0;
                margin: 0;

                &::before, &::after {
                    color: var(--ks-content-color-highlight);
                }
                &::before { content: "“"; margin-right: 0.15rem; }
                &::after { content: "”"; margin-left: 0.15rem; }
            }
        }

        p {
            margin: 0;
            @include media-breakpoint-up(lg) {
                font-size: 1.125rem;
            }
            font-family: var(--font-family-jetbrains-mono);
            color: var(--ks-content-secondary);
        }

        .company-logo {
            display: block;
            margin-inline: auto;

            html.dark & {
                filter: brightness(0) invert(1);
            }
        }
    }
</style>