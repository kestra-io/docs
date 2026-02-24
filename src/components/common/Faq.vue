<template>
    <section>
        <div class="container content">
            <div class="header">
                <h2>{{ title }}</h2>
                <slot name="description">
                    <p>
                        Find answers to your questions right here, and don't hesitate to
                        <a href="/demo">Contact us</a> if you couldn't find what you're looking for.
                    </p>
                </slot>
            </div>

            <div class="items">
                <CustomDetails v-for="(item, index) in items" :key="index" class="que" :title="item.question">
                    <div class="ans" v-html="item.answer"></div>
                </CustomDetails>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import CustomDetails from "~/components/layout/CustomDetails.vue"

    interface FaqItem {
        question: string;
        answer: string;
    }

    withDefaults(defineProps<{
        title?: string;
        items?: FaqItem[];
    }>(), {
        title: "Frequently asked questions",
        items: () => [],
    });
</script>

<style scoped lang="scss">
@import "~/assets/styles/variable";

section {
    padding: $rem-4 $rem-1;
    background: var(--ks-background-body);

    .content {
        display: flex;
        flex-direction: column;
        gap: $rem-3;
    }

    .header {
        text-align: center;
        margin-bottom: $rem-3;
        max-width: 513px;
        margin: 0 auto;

        h2 {
            color: var(--ks-content-primary);
            margin-bottom: $rem-1;
        }

        p {
            color: var(--ks-content-secondary);
            max-width: 100%;
            margin: 0 auto;
        }

        a {
            color: var(--ks-content-link);
        }
    }

    .items {
        width: 100%;
    }
}
</style>
