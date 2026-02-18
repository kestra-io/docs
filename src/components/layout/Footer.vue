<template>
    <footer>
        <div class="container-xl py-4 py-md-5 px-4 px-md-3">
            <div class="d-flex flex-wrap justify-content-between align-items-center gap-4 newsletter-section">
                <div class="d-flex align-items-center gap-4 gap-md-5 flex-wrap">
                    <h3 class="mb-0 text-nowrap">Get Kestra Updates</h3>
                    <form
                        ref="newsletter"
                        class="subscription-box"
                        @submit.prevent="checkForm"
                        novalidate
                    >
                        <input name="email" type="email" placeholder="Enter your email" required />
                        <button type="submit" class="btn btn-primary">Subscribe</button>
                    </form>
                    <div v-if="message" class="alert mb-0 padding-0" :class="valid ? 'text-success' : 'text-danger'">
                        <p class="mb-0" v-html="message"></p>
                    </div>
                </div>
                <div class="text-end mt-4 mt-md-0">
                    <Certifications />
                </div>
            </div>
            <div class="row mt-4">
                <div class="col-lg-3 mb-3">
                    <a href="/">
                        <img  height="60" alt="Kestra's logo" class="logo" />
                    </a>
                    <p class="mt-4">Open Source Declarative Data Orchestration</p>
                    <Socials class="mt-4 socials" />
                    <div class="mt-3">
                        <slot name="theme-switcher" />
                    </div>
                </div>
                <div class="col-lg-9 mb-3">
                    <div class="row justify-content-between">
                        <div v-for="section in FOOTER_SECTIONS" :key="section.title" class="col-6 col-lg-2 mb-3">
                            <h5>{{ section.title }}</h5>
                            <ul class="list-unstyled">
                                <li v-for="link in section.links" :key="link.href" class="mb-2">
                                    <a :href="link.href" :target="link.external ? '_blank' : undefined">
                                        {{ link.text }}
                                        <span v-if="link.badge" class="badge text-bg-danger">{{
                                            link.badge
                                            }}</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-xl bottom py-3">
            <div class="d-flex d-100">
                <div class="flex-grow-1">
                    <p class="mb-0 d-none d-md-inline">
                        © {{ new Date().getFullYear() }} <a href="/">Kestra Technologies</a>.
                        Developed with
                        <Heart class="text-danger" /> on 🌎.
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
import { ref } from "vue"
import newsletterSubmit from "~/utils/newsletterSubmit.js"

const valid = ref(false)
const message = ref(null)
const newsletter = ref(null)

function checkForm(e: any) {
    newsletterSubmit({ newsletter, valid, message }, e)
}

interface Link {
    text: string;
    href: string;
    external?: boolean;
    badge?: string;
}

interface Section {
    title: string;
    links: Link[];
}

const FOOTER_SECTIONS: Section[] = [
    {
        title: "Product",
        links: [
            { text: "Platform Overview", href: "/overview" },
            { text: "Open Source", href: "/features" },
            { text: "Enterprise Edition", href: "/enterprise" },
            { text: "Kestra Cloud", href: "/cloud" },
            { text: "Pricing", href: "/pricing" },
        ]
    },
    {
        title: "Solutions",
        links: [
            { text: "Use Cases", href: "/use-cases" },
            { text: "Declarative Orchestration", href: "/features/declarative-data-orchestration" },
            { text: "Automation Platform", href: "/features/scheduling-and-automation" },
            { text: "API First", href: "/features/api-first" },
            { text: "Code in Any Language", href: "/features/code-in-any-language" },
            { text: "Terraform Provider", href: "/use-cases/terraform-provider" },
            { text: "Airflow vs Kestra", href: "/vs/airflow" },
            { text: "Prefect vs Kestra", href: "/vs/prefect" },
            { text: "Dagster vs Kestra", href: "/vs/dagster" },
            { text: "AWS Step Functions vs Kestra", href: "/vs/aws-step-functions" },
        ]
    },
    {
        title: "Community",
        links: [
            { text: "Community Overview", href: "/community" },
            { text: "Blog", href: "/blogs" },
            { text: "Write for Us", href: "/write-for-us" },
            { text: "Slack", href: "https://kestra.io/slack", external: true },
            { text: "GitHub", href: "https://github.com/kestra-io", external: true },
        ]
    },
    {
        title: "Docs",
        links: [
            { text: "Documentation", href: "/docs" },
            { text: "Plugins", href: "/plugins" },
            { text: "Blueprints", href: "/blueprints" },
            { text: "Getting Started", href: "/docs/quickstart#start-kestra" },
            { text: "Administrator Guide", href: "/docs/administrator-guide" },
            { text: "FAQ", href: "/faq" },
        ]
    },
    {
        title: "Company",
        links: [
            { text: "About Us", href: "/about-us" },
            { text: "Careers", href: "/careers", badge: "Hiring!" },
            { text: "Contact Us", href: "/contact-us" },
            { text: "Customer Stories", href: "/use-cases/stories" },
            { text: "Partners Ecosystem", href: "/partners" },
        ]
    }
]
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    footer {
        position: relative;
        z-index: 20;
        font-size: var(--bs-font-size-sm);
        background-color: var(--ks-background-body);
        border-top: 1px solid var(--ks-border-primary);
        .newsletter-section {
            padding-bottom: 1.25rem;
            border-bottom: 1px solid var(--ks-border-primary);
            .subscription-box {
                display: flex;
                align-items: center;
                @include media-breakpoint-up(lg) {
                    min-width: 498px;
                }
                height: 48px;
                padding: 4px 5px 4px 14px;
                border-radius: 8px;
                background: var(--ks-background-input);
                border: 1px solid var(--ks-border-secondary);
                @include media-breakpoint-down(md) {
                    width: -webkit-fill-available;
                }
                input {
                    flex-grow: 1;
                    border: none;
                    background: transparent;
                    height: 100%;
                    font-size: $font-size-sm;
                    color: var(--ks-content-primary);
                    outline: none;
                    &::placeholder {
                        color: var(--ks-content-tertiary);
                    }
                }
                .btn {
                    height: 100%;
                    border-radius: 6px;
                    padding: 0 1.5rem;
                    display: flex;
                    align-items: center;
                    font-weight: 600;
                }
            }
        }
        .container-xl {
            position: relative;
            z-index: 2;
            &.bottom {
                border-top: 1px solid var(--ks-border-primary);
                p {
                    font-weight: normal;
                    font-size: $font-size-xs;
                    margin-bottom: 0;
                }
                a {
                    color: var(--ks-content-primary);
                    font-size: $font-size-xs;
                    font-weight: normal;
                }
            }
        }
        a {
            color: var(--ks-content-tertiary);
            font-size: $font-size-xs;
            &:hover {
                color: var(--ks-content-link-hover);
            }
        }
        h5 {
            text-transform: uppercase;
            font-weight: bold;
            font-size: $font-size-xs;
        }
        p {
            font-size: $font-size-xs;
            font-weight: 600;
            &.mt-4 {
                max-width: 184px;
                margin-top: 26px;
            }
        }
        
        .logo {
            content: url("~/assets/logo-white.svg");
            display: block;
            html.light & {
                content: url("~/assets/logo-black.svg");
            }
        }

        .socials {
            font-size: calc($font-size-base * 1.4);
            :deep(a) {
                color: var(--ks-content-secondary);
                font-size: 1.25rem;
            }
        }
        li:hover a {
            color: var(--ks-content-link-hover);
        }
        :deep(.text-success) {
            color: var(--ks-content-alert-success);
        }
        :deep(.text-danger) {
            color: var(--ks-content-alert-danger);
        }
    }
</style>