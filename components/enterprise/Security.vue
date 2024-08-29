<template>
    <div class="container">
        <Section
            subtitle="Ready"
            subtitle-before="Enterprise"
        >
            <div class="row mb-5">
                <div class="col-md-6 order-1 order-md-0 d-flex flex-column justify-content-center align-items-center" data-aos="fade-right">
                    <div>
                        <h3>More Security</h3>
                        <p class="mt-3">
                            Monitor unauthorized access, modifications, or executions with precision, manage resource permission,  and unify account access through a single, secure connection. Securely store all secrets in one dedicated and managed environment, ensuring your data's safety and integrity with Kestra Enterprise.
                        </p>
                    </div>
                </div>
                <div class="col-md-6 order-0 order-md-1" data-aos="fade-left">
                    <NuxtImg loading="lazy" format="webp" class="img-fluid" src="/landing/enterprise/security-1.webp" alt="A dashboard with success or fail task events" />
                </div>
            </div>
            <div class="row mb-5">
                <div class="col-md-6 image-container" data-aos="fade-right">
                    <NuxtImg loading="lazy" format="webp"  class="img-fluid" src="/landing/enterprise/security-2.webp" alt="Stylized view of administrator settings with role-based view" />
                </div>
                <div class="col-md-6 d-flex justify-content-center align-items-center">
                    <div>
                        <h3>Complete Governance</h3>
                        <p class="mt-3">
                            Enable your multi-tenant architecture by combining centralized control of user access with namespace management for organized workflow control, and custom blueprints for shared knowledge and efficiency. Simplify collaboration and secure your operations with these powerful features designed for enterprise-level orchestration and automation.
                        </p>
                    </div>
                </div>
            </div>
            <div class="row mb-5">
                <div class="col-md-6 order-1 order-md-0 d-flex justify-content-center align-items-center" data-aos="fade-right">
                    <div>
                        <h3>Scale with no limits</h3>
                        <p class="mt-3">
                            Kestra Enterprise offers dedicated workers to target computing resources accurately for specific tasks, ensuring both adaptability and customization. Guaranteed with no single point of failure, enhancing system reliability. Worker groups add flexibility, enabling specialized task execution and effective resource use across various settings.
                        </p>
                    </div>
                </div>
                <div class="col-md-6 order-0 order-md-1" data-aos="fade-left">
                    <NuxtImg loading="lazy" format="webp" class="img-fluid" src="/landing/enterprise/security-3.webp" alt="A dashboard with success or fail task events" />
                </div>
            </div>

            <div class="row mb-4">
                <div class="security-features">
                    <Card
                        img="/landing/enterprise/security-icon.svg"
                        imgAlt="Security"
                        title="Security"
                        :bottomMenuBar="securityFeatures.security"
                        :isClickable="false"
                    />
                    <Card
                        img="/landing/enterprise/governance-icon.svg"
                        imgAlt="Governance"
                        title="Governance"
                        :bottomMenuBar="securityFeatures.governance"
                        :isClickable="false"
                    />
                    <Card
                        img="/landing/enterprise/scalability-icon.svg"
                        imgAlt="Scalability"
                        title="Scalability"
                        :bottomMenuBar="securityFeatures.scalability"
                        :isClickable="false"
                    />
                </div>
            </div>
            <div class="row mt-1 mb-5">
                <div class="d-flex justify-content-center">
                    <NuxtLink href="/pricing" class="btn btn-animated btn-purple-animated" data-aos="zoom-in">
                        Compare all features
                    </NuxtLink>
                </div>
            </div>
        </Section>
    </div>
</template>


<script>
    import Section from '../layout/Section.vue';
    export default {
      components: {Section},
      data() {
        return {
          securityFeatures: {
            security: [
              { text: "Audit log", active: false },
              { text: "RBAC", active: false },
              { text: "SSO", active: false },
              { text: "Secrets Manager", active: false },
            ],
            governance: [
              { text: "Multi Tenancy", active: false },
              { text: "Namespace Management", active: false },
              { text: "Custom blueprints", active: false },
              { text: "Task Configuration", active: false },
            ],
            scalability: [
              { text: "Dedicated Worker", active: false },
              { text: "High Throughput", active: false },
              { text: "High Availability", active: false },
              { text: "Fault Tolerant", active: false },
            ],
          },
        };
      },
    }
</script>
<style scoped lang="scss">
    @import "../../assets/styles/variable";
    :deep(section) {
        margin-top: calc($spacer * 7.8);
        position: relative;

        &:before {
            content: "";
            position: absolute;
            height: 100%;
            width: 100%;
            background: url("/landing/ee/background-mask.svg") no-repeat center;
            background-size: 156% 100%;
            overflow: hidden;
            top: -33%;
            z-index: -1;
        }
        .subtitle {
            margin: 0 !important;
            p {
                margin: 0 !important;
            }

            div.main {
                padding-top: 0 !important;
            }
        }
    }
    .container {
        border-top: $block-border;

        h3 {
            color: $white;
            font-size: $h2-font-size;
            font-weight: 300;
            margin: 0;
        }

        p {
            color: $white;
            font-size: $font-size-md;
            font-weight: 300;
            max-width: calc($spacer * 28);

            b {
                color: $white;
                font-weight: 600;
            }
        }

        .image-container {
            position: relative;
            z-index: 10;

            &::before,
            &::after
            {
                content: "";
                position: absolute;
                width: calc($spacer * 12);
                height: calc($spacer * 12);
                background: radial-gradient(50% 50% at 50% 50%, #343434 0%, rgba(127, 122, 232, 0) 195% 117%);
                filter: blur(47px);
                z-index: -5;
            }

            &::before {
                left: -1rem;
                top: 11rem;
            }

            &::after {
                left: 27rem;
                top: -2rem;
            }

            @include media-breakpoint-down(lg) {
                &::after {
                    left: 13rem;
                }

                &::before {
                    left: -3rem;
                    top: 5rem;
                }
            }

            @include media-breakpoint-down(md) {
                &::after {
                   left: 23rem;
                }
            }
        }

        .security-features {
            display: flex;
            justify-content: center;
            gap: calc($spacer * 1.8);
            position: relative;

            :deep(.title-block) {
                align-items: center;
            }

            @include media-breakpoint-down(lg) {
                flex-direction: column;
                align-items: center;

                :deep(.card) {
                    width: 60%;
                    justify-content: center;
                    align-items: center;
                }
            }

            @include media-breakpoint-down(md) {
                :deep(.card) {
                    width: auto;
                }
            }
            &::before {
                content: "";
                position: absolute;
                width: calc($spacer * 12);
                height: calc($spacer * 12);
                background: linear-gradient(180deg, rgba(98, 24, 255, 0) 0%, #6117FF 100%);
                filter: blur(100px);
                z-index: -5;
                left: 49rem;
                top: -1rem;

                @include media-breakpoint-down(lg) {
                    left: 35%;
                    top: 50%;
                }
            }
        }
    }
</style>
