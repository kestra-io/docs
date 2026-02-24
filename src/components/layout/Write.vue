<template>
    <section class="content position-relative">
        <div class="container base-container">
            <h2 data-usal="fade-l" class="title-sm title" v-html="content.tag"></h2>
            <p class="my-4">
                {{ content.description }}
            </p>
            <div class="interests mb-4">
                <h5>{{ content.interests.title }}</h5>
                <ul>
                    <li v-for="item in content.interests.items">
                        <span class="item-title fw-bold">{{ item.title }}:</span>
                        {{ item.description }}
                    </li>
                </ul>
            </div>
            <div class="cta card" data-usal="fade-r">
                <div class="row align-items-center">
                    <div class="col-lg-9 col-md-12">
                        <h5>{{ content.cta.title }}</h5>
                        <p>{{ content.cta.description }}</p>
                    </div>
                    <div class="w-auto">
                        <a :href="content.cta.action.href" :target="content.cta.action.target">
                            <button class="btn btn-primary">
                                <span class="mx-4">
                                    {{ content.cta.action.text }}
                                </span>
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
defineProps<{
    content: {
        tag: string;
        description: string;
        interests: {
            title: string;
            items: { title: string; description: string }[];
        };
        cta: {
            title: string;
            description: string;
            action: {
                href: string;
                target: string;
                text: string;
            };
        };
    }
}>();
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .title-sm {
        padding-top: $rem-4;
    }

    .content {
        background: var(--ks-background-tertiary);
        padding-bottom: $rem-4;
    }

    .base-container {
        max-width: $container-max-width;
    }

    .cta {
        margin-top: $rem-2;
        background-color: var(--ks-background-secondary);
        color: var(--ks-content-primary);
        padding: $rem-2;
        border: $block-border;
        border-color: var(--ks-border-secondary);
    }
</style>