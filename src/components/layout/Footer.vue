<template>
    <footer>
        <div class="container py-4 py-md-5 px-4 px-md-3">
            <div class="row">
                <div class="col-lg-3 mb-3">
                    <a href="/">
                        <img src="/logo-white.svg" height="60" alt="Kestra's logo" />
                    </a>
                    <p class="mt-2">Open Source Declarative Orchestration</p>
                    <Socials class="mt-4 socials" />
                    <LayoutNewsletter />
                    <div class="mt-3">
                        <slot name="theme-switcher" />
                    </div>
                </div>
                <div class="col-lg-9 mb-3">
                    <div class="row">
                        <div class="col-6 col-lg-2 offset-lg-1 mb-3">
                            <h5>Product</h5>
                            <ul class="list-unstyled">
                                <li v-for="link in PRODUCT_LINKS" :key="link.href" class="mb-2">
                                    <a :href="link.href">{{ link.text }}</a>
                                </li>
                            </ul>
                        </div>
                        <div class="col-6 col-lg-2 mb-3">
                            <h5>Solutions</h5>
                            <ul class="list-unstyled">
                                <li v-for="link in SOLUTIONS_LINKS" :key="link.href" class="mb-2">
                                    <a :href="link.href">{{ link.text }}</a>
                                </li>
                            </ul>
                        </div>
                        <div class="col-6 col-lg-2 mb-3">
                            <h5>Community</h5>
                            <ul class="list-unstyled">
                                <li v-for="link in COMMUNITY_LINKS" :key="link.href" class="mb-2">
                                    <a v-if="!link.external" :href="link.href">{{ link.text }}</a>
                                    <template v-else>
                                        <a
                                            v-if="link.text !== 'Slack' || mounted"
                                            :href="link.href"
                                            target="_blank"
                                            >{{ link.text }}</a
                                        >
                                    </template>
                                </li>
                            </ul>
                        </div>
                        <div class="col-6 col-lg-2 mb-3">
                            <h5>Docs</h5>
                            <ul class="list-unstyled">
                                <li v-for="link in DOCS_LINKS" :key="link.href" class="mb-2">
                                    <a :href="link.href">{{ link.text }}</a>
                                </li>
                            </ul>
                        </div>
                        <div class="col-6 col-lg-2 mb-3">
                            <h5>Company</h5>
                            <ul class="list-unstyled">
                                <li v-for="link in COMPANY_LINKS" :key="link.href" class="mb-2">
                                    <a :href="link.href">
                                        {{ link.text }}
                                        <span v-if="link.badge" class="badge text-bg-danger">{{
                                            link.badge
                                        }}</span>
                                    </a>
                                </li>
                            </ul>

                            <div>
                                <Certifications class="mt-4 mb-4" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container bottom py-3">
            <div class="d-flex d-100">
                <div class="flex-grow-1">
                    <p class="mb-0 d-none d-md-inline">
                        © {{ new Date().getFullYear() }} <a href="/">Kestra Technologies</a>.
                        Developed with <Heart class="text-danger" /> on 🌎.
                    </p>
                </div>
                <div class="text-end">
                    <p class="mb-0">
                        <a href="/privacy-policy">Privacy Policy</a>
                        /
                        <a href="/cookie-policy">Cookie Policy</a>
                    </p>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
    import Socials from "~/components/layout/Socials.vue"
    import Certifications from "~/components/layout/Certifications.vue"
    import Heart from "vue-material-design-icons/Heart.vue"
    import LayoutNewsletter from "~/components/layout/Newsletter.vue"
    import { ref, onMounted } from "vue"

    const mounted = ref(false)

    onMounted(() => {
        mounted.value = true
    })

    const PRODUCT_LINKS = [
        { text: "Platform Overview", href: "/overview" },
        { text: "Open Source", href: "/features" },
        { text: "Enterprise Edition", href: "/enterprise" },
        { text: "Kestra Cloud", href: "/cloud" },
        { text: "Pricing", href: "/pricing" },
    ]

    const SOLUTIONS_LINKS = [
        { text: "Use Cases", href: "/use-cases" },
        {
            text: "Declarative Orchestration",
            href: "/features/declarative-data-orchestration",
        },
        {
            text: "Automation Platform",
            href: "/features/scheduling-and-automation",
        },
        { text: "API First", href: "/features/api-first" },
        {
            text: "Code in Any Language",
            href: "/features/code-in-any-language",
        },
        { text: "Terraform Provider", href: "/use-cases/terraform-provider" },
        { text: "Airflow vs Kestra", href: "/vs/airflow" },
        { text: "Prefect vs Kestra", href: "/vs/prefect" },
        { text: "Dagster vs Kestra", href: "/vs/dagster" },
        {
            text: "AWS Step Functions vs Kestra",
            href: "/vs/aws-step-functions",
        },
    ]

    const COMMUNITY_LINKS = [
        { text: "Community Overview", href: "/community" },
        { text: "Blog", href: "/blogs" },
        { text: "Write for Us", href: "/write-for-us" },
        { text: "Slack", href: "https://kestra.io/slack", external: true },
        {
            text: "GitHub",
            href: "https://github.com/kestra-io",
            external: true,
        },
    ]

    const DOCS_LINKS = [
        { text: "Documentation", href: "/docs" },
        { text: "Plugins", href: "/plugins" },
        { text: "Blueprints", href: "/blueprints" },
        { text: "Getting Started", href: "/docs/quickstart#start-kestra" },
        { text: "Administrator Guide", href: "/docs/administrator-guide" },
        { text: "FAQ", href: "/faq" },
    ]

    const COMPANY_LINKS = [
        { text: "About Us", href: "/about-us" },
        { text: "Careers", href: "/careers", badge: "Hiring!" },
        { text: "Contact Us", href: "/contact-us" },
        { text: "Customer Stories", href: "/use-cases/stories" },
        { text: "Partners Ecosystem", href: "/partners" },
    ]
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    footer {
        position: relative;
        z-index: 20;
        font-size: var(--bs-font-size-sm);
        background-color: #0a0b0d;
        border-top: 1px solid var(--kestra-io-token-color-border-secondary);

        h5,
        a,
        p {
            color: var(--bs-white);
            font-size: var(--bs-badge-font-size);
        }

        h5 {
            text-transform: uppercase;
            font-weight: bold;
            font-family: var(--bs-font-monospace);
        }

        .container {
            position: relative;
            z-index: 2;
        }

        .bottom {
            border-top: 1px solid rgba(#fff, 0.1);
        }

        .socials {
            font-size: calc($font-size-base * 1.4);
        }

        :deep(.socials) a {
            color: var(--bs-white);
        }

        li:hover {
            a {
                color: var(--ks-content-link-hover);
            }
        }
    }
</style>