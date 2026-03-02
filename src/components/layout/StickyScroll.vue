<template>
    <div class="content">
        <div class="sticky-features-wrapper">
            <div class="scroll-block">
                <div class="sticky-features-item" v-for="(item, index) in items" :key="index"
                    :class="{ 'mb__5': index === items.length - 1 }">
                    <div class="features-item-content" data-usal="fade-up">
                        <h2>{{ item.title }}</h2>
                        <p class="mt-3" v-html="item.description"></p>
                        <a v-if="item.cta" :href="item.cta.href" class="demo-btn btn btn-animated btn-purple-animated">
                            <span>{{ item.cta.text }}</span>
                        </a>
                    </div>
                </div>
            </div>
            <div class="sticky-features-visuals">
                <div class="sticky-features-sticky">
                    <div class="sticky-features-box">
                        <img class="u-img-cover" v-bind="items[getCurrentImageIndex()].img"
                            :alt="items[getCurrentImageIndex()].title" />
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="security-item mb-5-rem" v-for="(item, index) in items" :key="index">
                <div class="col-md-6 order-0 order-md-1 rounded-2" data-usal="fade-left">
                    <img class="img-fluid" v-bind="item.img" :alt="item.title" />
                </div>
                <div class="item-info" data-usal="fade-right">
                    <div>
                        <h2>{{ item.title }}</h2>
                        <p class="mt-3" v-html="item.description"></p>
                        <a v-if="item.cta" :href="item.cta.href" class="demo-btn btn btn-animated btn-purple-animated">
                            <span>{{ item.cta.text }}</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted, onBeforeUnmount } from 'vue';

    const props = defineProps<{
        items: Array<{
            title: string
            description: string
            img: any
            cta?: {
                text: string
                href: string
            }
        }>
    }>();

    const itemPositions = ref<Array<{ rect: DOMRect, isCentered: boolean }>>([]);
    const prevImageIndex = ref(0);
    const contentRef = ref<HTMLElement | null>(null);

    const updateItemPositions = () => {
        itemPositions.value = [];
        if (!contentRef.value) return;
        const items = contentRef.value.querySelectorAll(".sticky-features-item");
        items.forEach((item) => {
            const rect = item.getBoundingClientRect();
            itemPositions.value.push({ rect, isCentered: false });
        });
    };

    const handleScroll = () => {
        updateItemPositions();
        itemPositions.value.forEach((item, index) => {
            const centerOfViewport = window.innerHeight / 2;
            const itemCenter = item.rect.top + item.rect.height / 2;
            const isCentered = Math.abs(itemCenter - centerOfViewport) <= 150;
            itemPositions.value[index] = { ...item, isCentered };
        });
    };

    const isItemInView = (index: number) => {
        return itemPositions.value[index] && itemPositions.value[index].isCentered;
    };

    const getCurrentImageIndex = () => {
        for (let i = 0; i < itemPositions.value.length; i++) {
            if (isItemInView(i)) {
                prevImageIndex.value = i;
                return i;
            }
        }
        return prevImageIndex.value;
    };

    onMounted(() => {
        contentRef.value = document.querySelector('.content') as HTMLElement; // Simplification for layout
        updateItemPositions();
        window.addEventListener("scroll", handleScroll);
    });

    onBeforeUnmount(() => {
        window.removeEventListener("scroll", handleScroll);
    });
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .content {
        padding: $rem-5 0 0;
        display: flex;
        position: relative;
        justify-content: center;
        width: 100%;
        @include media-breakpoint-down(xl) {
            padding: $rem-4 $rem-1;
        }
        @include media-breakpoint-down(md) {
            padding: $rem-2 $rem-1;
        }
        .sticky-features-wrapper {
            display: grid;
            grid-template-columns: 42% 54%;
            position: relative;
            max-width: 1120px;
            justify-content: space-between;
            @media only screen and (max-width: 767px) {
                display: none;
            }
            .sticky-features-visuals {
                align-self: stretch;
                position: relative;
                .sticky-features-sticky {
                    border-radius: 4px;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: center;
                    padding-top: 74vh;
                    display: flex;
                    position: sticky;
                    top: 16vh;
                    .sticky-features-box {
                        border: 1px solid var(--color--grey-border);
                        border-radius: 4px;
                        height: 100%;
                        position: absolute;
                        inset: 0%;
                        max-height: 750px;
                        .u-img-cover {
                            object-fit: cover;
                            object-position: 50% 50%;
                            width: 100%;
                            max-width: 600px;
                            height: 100%;
                            inset: 0%;
                            border-radius: 20px;
                        }
                    }
                }
            }
            .scroll-block {
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: 500px;
                padding: 200px 0;
                .mb__5 {
                    padding-bottom: 50px !important;
                }
                .sticky-features-item {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: flex-start;
                    padding-bottom: 0;
                    gap: 64px;
                    height: 50%;
                    .features-item-content {
                        transition: opacity 0.3s;
                        cursor: default;
                        padding: 0;
                        text-decoration: none;
                        position: relative;
                        @media only screen and (max-width: 768px) {
                            flex-wrap: wrap;
                            justify-content: center;
                        }
                    }
                }
            }
        }
        .demo-btn {
            margin-top: 26px;
            cursor: pointer;
            padding: 10px 16px;
            max-width: fit-content
        }
        .container {
            padding: 120px 0;
            max-width: 1120px;
            border-top: none;
            display: none;
            @media only screen and (max-width: 767px) {
                display: block;
            }
            @include media-breakpoint-down(md) {
                padding-bottom: 40px;
                padding-top: 65px;
            }
            .img-fluid {
                border-radius: 10px;
            }
            .mb-5-rem {
                margin-bottom: $rem-5;
            }
            .security-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 64px;
                @include media-breakpoint-down(md) {
                    flex-wrap: wrap;
                    justify-content: center;
                }
                .item-info {
                    height: 100%;
                    text-align: start;
                    max-width: 476px;
                    h3 {
                        font-weight: 400;
                        font-size: 41px;
                        color: var(--ks-content-primary);
                        line-height: $rem-3;
                    }
                    @include media-breakpoint-down(md) {
                        order: 1;
                    }
                }
            }
            h3 {
                color: var(--ks-content-primary);
                font-size: 41px;
                font-weight: 600;
                line-height: 48.18px;
                text-align: left;
                margin: 0;
            }
            p {
                color: var(--ks-content-primary);
                font-size: 18px;
                line-height: 28px;
                text-align: left;
                font-weight: 400;
                max-width: calc($spacer * 28);
                @media only screen and (max-width: 420px) {
                    font-size: 18px;
                }
            }
        }
    }
</style>
