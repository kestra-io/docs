<template>
    <section :class="[layout]">
        <div class="container content">
            <div v-if="layout === 'side-by-side'" class="question">
                <span>{{ title }}</span>
            </div>
            
            <div class="items">
                <h3 v-if="layout === 'full-width'" class="mb-4">{{ title }}</h3>
                <CustomDetails
                    v-for="(item, index) in items"
                    :key="index"
                    class="que"
                    :title="item.question"
                >
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
        layout?: 'side-by-side' | 'full-width';
    }>(), {
        title: "FAQs",
        items: () => [],
        layout: 'side-by-side'
    });
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    section {
        padding: $rem-3 $rem-1;
        background: var(--ks-background-body);
        .content {
            display: flex;
            justify-content: space-between;
            gap: 64px;
            @include media-breakpoint-down(lg) {
                display: block;
            }
        }
        .question {
            @include media-breakpoint-down(lg) {
                margin-bottom: $rem-2;
            }
            span {
                font-size: $rem-3;
                font-weight: 600;
                line-height: 1.2;
                text-align: left;
                color: var(--ks-content-primary);
                @include media-breakpoint-down(lg) {
                    font-size: $rem-2;
                    line-height: 1.2;
                }
            }
        }
        .items {
            width: 100%;
            h3 {
                color: var(--ks-content-primary);
                margin: 0;
                padding: 0 $rem-1;
            }
        }
        &.full-width {
            padding: $rem-2 0;
            .content {
                display: block;
            }
        }
    }
</style>
