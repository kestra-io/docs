<template>
    <div class="dashboard">
        <div class="dashboard-row">
            <div v-for="column in COLUMNS" :key="column.title" class="dashboard-col">
                <h5 data-usal="fade-r">{{ column.title }}</h5>
                <hr class="my-0">
                <ul class="features-list">
                    <li v-for="feature in column.features" :key="feature" data-usal="fade-l">
                        <CheckBold class="icon" /> {{ feature }}
                    </li>
                </ul>
            </div>
        </div>
        <div class="dashboard-row">
            <div class="dashboard-col col-50">
                <h6 data-usal="fade-r">
                    <Plus class="icon me-2" />Customer Success Program<br>
                    & Enterprise Support with SLA
                </h6>
            </div>
            <div class="dashboard-col col-50">
                <h6 data-usal="fade-l">
                    <Plus class="icon me-2" />Enterprise-Ready Deployment:<br>
                    <span class="fw-normal">
                        Cloud, On-Prem, Air-Gapped
                        <span class="deployments">
                            <span v-html="awsSVG"></span>
                            <span v-html="vectorSVG"></span>
                            <span v-html="googleSVG"></span>
                            <span v-html="homeRoofSVG"></span>
                        </span>
                    </span>
                </h6>
            </div>
        </div>
    </div>
    <div class="hero-bottom">
        <div class="bottom-title">
            <h6 data-usal="fade-r">
                <Plus class="blue me-2" /> Kestra Core
            </h6>
        </div>
        <div class="bottom-content">
            <ul class="bottom-features">
                <li v-for="feature in BOTTOM_FEATURES" :key="feature" data-usal="fade-l">
                    {{ feature }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';

    import awsSVG from '~/assets/enterprise/aws.svg?raw';
    import vectorSVG from '~/assets/enterprise/azure.svg?raw';
    import googleSVG from '~/assets/enterprise/google.svg?raw';
    import homeRoofSVG from '~/assets/enterprise/home-roof.svg?raw';

    import Plus from 'vue-material-design-icons/PlusThick.vue';
    import CheckBold from 'vue-material-design-icons/CheckBold.vue';

    import { usePluginsCount } from '~/composables/usePluginsCount';
    const { totalPlugins } = usePluginsCount();

    const COLUMNS = [
        {
            title: "Security & Compliance",
            features: [
                "SSO (Single-Sign On)",
                "Audit Log & Revision History",
                "Secret Manager Integration",
                "Service Account & API Tokens",
                "End-to-End Encryption",
                "SCIM Directory Sync",
            ],
        },
        {
            title: "Governance & Productivity",
            features: [
                "Multi Tenancy",
                "Role Based Access Control (RBAC)",
                "Namespaces Management",
                "Assets Lineage",
                "Enterprise Plugins, Versioning & Hot Reload",
                "Kestra Apps (custom UIs for workflows)",
            ],
        },
        {
            title: "Scalability",
            features: [
                "Worker Groups",
                "Task Runners",
                "High Availability & Throughput",
                "Fault Tolerant",
                "Log Shipper, Cluster Monitoring",
                "Dedicated storage & Tenant Isolation",
            ],
        },
    ];

    const BOTTOM_FEATURES = computed(() => [
        "Declarative Workflow",
        `${totalPlugins.value} Plugins`,
        "Event Driven & Scheduling",
        "Everything From the UI",
        "Business Logic In Any Language",
    ]);
</script>

<style lang="scss" scoped>


    .dashboard {
        margin-top: 4rem;
        min-height: 464px;
        border: 1px solid var(--ks-border-active);
        box-shadow: 0px 0px 20px 0px hsla(264, 76%, 67%, 1);
        background: var(--ks-background-primary);
        border-radius: 8px;
        overflow: hidden;

        @include media-breakpoint-down(lg) {
            border: none;
            box-shadow: none;
            background: transparent;
            overflow: visible;
        }

        .dashboard-row {
            display: flex;
            width: 100%;
            border-bottom: 1px solid var(--ks-border-secondary);

            @include media-breakpoint-down(lg) {
                flex-direction: column;
                gap: 1rem;
                border-bottom: none;
                margin-bottom: 2rem;
            }

            &:first-child {
                min-height: 352px;
            }

            &:last-child {
                min-height: 112px;
                border-bottom: none;

                .dashboard-col {
                    &.col-50 {
                        width: 50%;
                        @include media-breakpoint-down(lg) {
                            width: 100%;
                        }
                    }
                }
            }

            .dashboard-col {
                flex: 1;
                border-left: 1px solid var(--ks-border-secondary);
                padding: 2rem;
                display: flex;
                flex-direction: column;
                gap: 1.25rem;

                @include media-breakpoint-down(lg) {
                    border: 1px solid var(--ks-border-active);
                    border-radius: 8px;
                    background: var(--ks-background-primary);
                    padding: 1rem;
                    box-shadow: 0px 0px 20px 0px hsla(264, 76%, 67%, 1);
                }

                &:first-child {
                    border-left: none;
                    @include media-breakpoint-down(lg) {
                        border-left: 1px solid var(--ks-border-secondary);
                    }
                }

                h5, h6 {
                    text-align: center;
                    margin-bottom: 0;
                }

                h6 {
                    line-height: 1.5;

                    .deployments {
                        display: inline-flex;
                        align-items: center;
                        margin-left: 0.25rem;
                        gap: 0.5rem;
                        vertical-align: middle;

                        :deep(svg) {
                            display: block;
                            width: 22px;
                            height: 22px;
                        }
                    }
                }

                .features-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;

                    li {
                        display: flex;
                        align-items: center;
                        gap: 0.75rem;
                        font-size: $font-size-sm;
                        color: var(--ks-content-primary);
                    }
                }
            }
        }
    }

    .hero-bottom {
        margin-top: 2rem;
        min-height: 5.5rem;
        border-radius: 8px;
        background: var(--ks-background-secondary);
        border: 1px solid var(--ks-border-secondary);
        display: flex;
        align-items: center;
        padding: 0 2rem;

        @include media-breakpoint-down(xl) {
            flex-direction: column;
            padding: 0;
            text-align: center;
            gap: 0;
        }

        .bottom-title {
            flex: 0 0 288px;

            @include media-breakpoint-down(xl) {
                flex: none;
                width: 100%;
                padding: 1.5rem;
                border-bottom: 1px solid var(--ks-border-primary);
            }

            h6 {
                margin: 0;
            }
        }

        .bottom-content {
            flex: 1;
            width: 100%;

            .bottom-features {
                list-style: none;
                padding: 0;
                margin: 0;
                display: flex;
                align-items: center;
                font-size: $font-size-xs;
                color: var(--ks-content-primary);

                @include media-breakpoint-down(xl) {
                    flex-direction: column;
                }

                li {
                    flex: 1;
                    text-align: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    white-space: nowrap;
                    padding: 0 12px;

                    @include media-breakpoint-down(xl) {
                        width: 100%;
                        padding: 1rem;
                        border-right: none !important;

                        &:not(:last-child) {
                            border-bottom: 1px solid var(--ks-border-primary);
                        }
                    }

                    &:not(:last-child) {
                        border-right: 1px solid var(--ks-border-primary);
                    }
                }
            }
        }
    }

    .icon {
        color: var(--ks-icon-color);
    }

    .blue {
        color: #718BFE;
    }
</style>
