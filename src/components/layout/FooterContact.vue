<template>
    <section>
        <div class="footer-contact container">
            <div class="cta-card" :data-usal="animationType('fade-up')">
                <h2 v-if="title" class="title">
                    {{ title }}
                </h2>
                <p v-if="subtitle" class="subtitle">
                    {{ subtitle }}
                </p>
                <div class="buttons">
                    <a
                        v-if="dark?.text"
                        :href="dark?.href"
                        class="btn btn-secondary mb-2"
                    >
                        {{ dark?.text }}
                    </a>
                    <a
                        v-if="purple?.text"
                        :href="purple?.href"
                        :class="['btn btn-primary mb-2', { 'ms-sm-3': dark?.text }]"
                    >
                        {{ purple?.text }}
                    </a>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    interface Button {
        text?: string;
        href?: string;
    }

    const {
        title,
        subtitle,
        dark = {
            text: 'Talk to us',
            href: '/demo'
        },
        purple = {
            text: 'Get started!',
            href: '/docs/quickstart#start-kestra'
        },
        animation = true
    } = defineProps<{
        title?: string;
        subtitle?: string;
        dark?: Button | null;
        purple?: Button | null;
        animation?: boolean;
    }>();

    const animationType = (type: string) => (animation ? type : "");
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    section {
        background: var(--ks-background-body);
        padding: 4rem 0;
        .footer-contact {
            .cta-card {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1.5rem;
                padding: 3rem 2rem;
                background: var(--ks-background-secondary);
                border: 1px solid var(--ks-border-secondary);
                color: var(--ks-content-primary);
                border-radius: 1rem;
                text-align: center;
                .title {
                    font-weight: 700;
                    max-width: 50rem;
                    margin: 0;
                }
                .subtitle {
                    max-width: 45rem;
                    margin: 0;
                }
                .buttons {
                    display: flex;
                    gap: 1rem;
                    .btn {
                        border-radius: 8px;
                        padding: 0.625rem 1.5rem;
                        font-weight: 600;
                    }
                }
            }
        }
    }
</style>