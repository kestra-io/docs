<template>
    <section class="scroll-spy" ref="root">
        <div class="container">
            <div class="content">
                <div
                    v-for="(item, index) in CONTENT"
                    :key="index"
                    class="content-section"
                    :data-index="index"
                >
                    <div class="mobile-image">
                        <img
                            :src="item.img.src"
                            :alt="item.title"
                            class="img-fluid"
                        />
                    </div>
                    <div class="content-left">
                        <h2 data-usal="fade-r">{{ item.title }}</h2>
                        <p data-usal="fade-l">{{ item.description }}</p>
                        <Link
                            href="/pricing"
                            text="Compare All Plans"
                            class="btn btn-primary"
                            data-usal="zoomin"
                        />
                    </div>
                </div>
            </div>
            <div class="sticky-visual">
                <div class="img-wrapper">
                    <img
                        :src="CONTENT[activeIndex].img.src"
                        :alt="CONTENT[activeIndex].title"
                        class="img-fluid"
                        width="600"
                        height="750"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { ref, onMounted, onBeforeUnmount } from "vue"

    import scaleIcon from "./assets/scale.svg"
    import securityIcon from "./assets/security.svg"
    import governanceIcon from "./assets/governance.svg"

    import Link from "~/components/common/Link.vue"

    const activeIndex = ref(0)
    const root = ref<HTMLElement | null>(null)

    const CONTENT = [
        {
            title: "More Security",
            description: "Ensures enterprise grade security with SSO, audit logs, and revision history for complete transparency. Integration with secrets managers and API tokens enhances secure automation, while end-to-end encryption protects your data at all times.",
            img: securityIcon
        },
        {
            title: "Total Governance",
            description: "Give your team secured, isolated environments and control over workflows. With tailored automation and precise access management, you can ensure compliance and efficiency at scale.",
            img: governanceIcon
        },
        {
            title: "Scale with no limits",
            description: "Kestra Enterprise scales with no downtime. Its reliable architecture and task runners, support both internal and external execution, minimize risk and provide performance insights—allowing you to optimize without worrying about infrastructure limitations.",
            img: scaleIcon
        }
    ]

    let observer: IntersectionObserver | null = null

    onMounted(() => {
        const sections = root.value?.querySelectorAll(".content-section")

        observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const index = parseInt(entry.target.getAttribute("data-index") ?? "0")
                    activeIndex.value = index
                }
            })
        }, {
            rootMargin: "-15% 0px -85% 0px",
            threshold: 0
        })

        sections?.forEach((section) => observer?.observe(section))
    })

    onBeforeUnmount(() => {
        observer?.disconnect()
    })
</script>

<style lang="scss" scoped>


    .scroll-spy {
        position: relative;
        padding: $rem-4 0;

        @include media-breakpoint-down(md) {
            padding-inline: 0.5rem;
        }

        .container {
            display: flex;
            flex-direction: row;
            gap: $rem-4;
            align-items: flex-start;
            position: relative;

            @include media-breakpoint-down(xl) {
                flex-direction: column;
                gap: $rem-2;
            }
        }

        .content {
            @include media-breakpoint-up(xl) {
                max-width: 476px;
                flex-shrink: 0;
            }

            @include media-breakpoint-down(xl) {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: $rem-2;
                p {
                    margin-bottom: 0;
                    display: -webkit-box;
                    -webkit-line-clamp: 4;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            }

            @include media-breakpoint-down(lg) {
                grid-template-columns: 1fr;
            }

            .content-section {
                display: flex;
                flex-direction: column;

                @include media-breakpoint-up(xl) {
                    min-height: 80vh;
                    justify-content: center;
                    padding: 10vh 0;
                }

                @include media-breakpoint-down(xl) {
                    background: var(--ks-background-secondary);
                    border-radius: $rem-1;
                    border: $block-border;

                    &:last-child:nth-child(odd) {
                        grid-column: 1 / span 2;
                        width: calc(50% - $rem-1);
                        justify-self: center;

                        @include media-breakpoint-down(lg) {
                            grid-column: auto;
                            width: 100%;
                        }
                    }
                }
            }
        }

        .mobile-image {
            @include media-breakpoint-up(xl) {
                display: none;
            }

            img {
                width: 100%;
                height: auto;
                border-radius: $border-radius-lg;
            }
        }

        .content-left {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;

            @include media-breakpoint-down(xl) {
                padding: $rem-2 $rem-1;
            }

            .btn {
                width: fit-content;
                white-space: nowrap;
                margin-top: $rem-1;
            }
        }

        .sticky-visual {
            @include media-breakpoint-down(xl) {
                display: none !important;
            }
            flex-grow: 1;
            position: sticky;
            top: calc(8rem + var(--announce-height));
            height: fit-content;
            display: flex;
            justify-content: center;

            .img-wrapper {
                img {
                    border-radius: $rem-1;
                }
            }
        }
    }
</style>