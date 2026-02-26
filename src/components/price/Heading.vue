<template>
    <section>
        <div class="container">
            <div class="header">
                <span>Kestra Editions</span>
                <h3 class="title">
                    Explore with Open Source Scale with Enterprise Edition
                </h3>
            </div>
            <div class="card-group">
                <div class="card-wrapper oss">
                    <div class="card">
                        <div class="card-body">
                            <div class="card-header-content">
                                <h4 class="card-title" data-usal="fade-r">Open-Source Edition</h4>
                                <p class="pricing" data-usal="fade-l">Best for Development</p>
                                <p class="pricing-type" data-usal="fade-l">Free</p>
                                <p class="pricing-desc" data-usal="fade-l">
                                    The core features of Kestra, maintained by the Kestra team and community.
                                </p>
                            </div>
                            <a href="https://github.com/kestra-io/kestra" class="btn btn-secondary w-100"
                                data-usal="zoomin">
                                Get started
                            </a>
                            <ul class="features-list">
                                <li data-usal="fade-r delay-100">
                                    <CheckBold class="icon" />
                                    <span>Core Features</span>
                                </li>
                                <li data-usal="fade-r delay-150">
                                    <CheckBold class="icon" />
                                    <span>Open Source Under Apache 2.0 Licence</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="card-wrapper enterprise">
                    <div class="bordered-block">
                        <div class="card card-enterprise">
                            <div class="top-block">
                                <small>Recommended for Enterprises & SMBs</small>
                            </div>
                            <div class="card-body">
                                <div class="card-header-content">
                                    <h4 class="card-title" data-usal="fade-r">Enterprise Edition</h4>
                                    <p class="pricing" data-usal="fade-l">Built For Production</p>
                                    <p class="pricing-type" data-usal="fade-l">On-Demand</p>
                                    <p class="pricing-desc" data-usal="fade-l">
                                        Predictable instance based model with: no limits on users, workflows, or tasks.
                                    </p>
                                </div>
                                <a href="/demo" class="btn btn-primary w-100" data-usal="zoomin">Talk to us</a>
                                <ul class="features-list">
                                    <li data-usal="fade-r delay-100">
                                        <CheckBold class="icon" />
                                        <span>Everything in Open-source</span>
                                    </li>
                                    <li v-for="feature in ENTERPRISE_FEATURES" :key="feature"
                                        data-usal="fade-r delay-150">
                                        <Plus class="icon" />
                                        <span>{{ feature }}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Logos />
        </div>
    </section>
</template>

<script setup>
    import Logos from "~/components/layout/Logos.vue"
    import Plus from "vue-material-design-icons/Plus.vue"
    import CheckBold from "vue-material-design-icons/CheckBold.vue"

    const ENTERPRISE_FEATURES = [
        'Governance',
        'Security',
        'Productivity',
        'Scalability',
        'Customer Success Program',
        'Enterprise Support with SLA'
    ]
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    section {
        background-color: var(--ks-background-body);
        padding: $rem-3 $rem-1;
        .container {
            background: url(/landing/pricing/visual-bg_pricing.png) center top / 90% auto no-repeat;
            @include media-breakpoint-down(md) {
                background-image: unset;
            }
            .header {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 30px;
                @include media-breakpoint-down(lg) {
                    gap: 10px;
                }
                span {
                    font-size: 18px;
                    line-height: 28px;
                    color: var(--ks-content-color-highlight);
                    @include media-breakpoint-down(md) {
                        width: 100%;
                        text-align: start;
                    }
                }
                .title {
                    font-size: 40px;
                    line-height: 48px;
                    max-width: 543px;
                    text-align: center;
                    color: var(--ks-content-primary);
                    @include media-breakpoint-down(lg) {
                        font-size: 35px;
                        line-height: 43px;
                    }
                    @include media-breakpoint-down(md) {
                        text-align: start;
                    }
                }
            }
            .card-group {
                display: flex;
                justify-content: center;
                gap: $rem-2;
                position: relative;
                z-index: 10;
                margin-bottom: $spacer;
                overflow: clip;
                @include media-breakpoint-down(md) {
                    flex-direction: column;
                    padding: 0;
                }
                .card-wrapper {
                    display: flex;
                    &.oss {
                        justify-content: flex-end;
                        padding-top: 37px;
                        @include media-breakpoint-down(md) {
                            padding-top: 0;
                        }
                    }
                    @include media-breakpoint-down(md) {
                        width: 100%;
                        max-width: unset;
                    }
                }
                .bordered-block {
                    padding: 3px;
                    border-radius: 10px;
                    border: 1px solid var(--ks-border-active);
                }
                .card {
                    max-width: 328px;
                    background: var(--ks-background-primary);
                    border: $block-border;
                    border-radius: 8px;
                    overflow: clip;
                    @include media-breakpoint-down(md) {
                        max-width: unset;
                        width: 100%;
                    }
                    &.card-enterprise {
                        .top-block {
                            display: flex;
                            justify-content: center;
                            background: var(--ks-button-background-primary);
                            padding: 8px 0;
                            border-radius: 8px 8px 0 0;
                            small {
                                color: $white;
                            }
                        }
                    }
                    .card-body {
                        padding: calc($spacer * 2);
                        .card-header-content {
                            padding-bottom: $rem-2;
                        }
                        .card-title {
                            font-size: $font-size-xl;
                            font-weight: 600;
                            padding-bottom: 11px;
                            border-bottom: $block-border;
                            color: var(--ks-content-primary);
                        }
                        .pricing {
                            margin: $rem-1 0 0;
                            color: var(--ks-content-primary);
                            font-weight: 700;
                            font-size: $font-size-md;
                        }
                        .pricing-type {
                            margin: 0;
                            color: var(--ks-content-secondary);
                        }
                        .pricing-desc {
                            margin-top: 16px;
                            color: var(--ks-content-tertiary);
                            font-size: $font-size-xs;
                        }
                        .features-list {
                            padding: $spacer 0 0;
                            list-style: none;
                            li {
                                display: flex;
                                align-items: flex-start;
                                gap: 8px;
                                min-height: 24px;
                                .icon {
                                    flex-shrink: 0;
                                    font-size: 16px;
                                }
                                span {
                                    color: var(--ks-content-primary);
                                    font-size: 14px;
                                    line-height: 22px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>