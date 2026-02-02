<template>
    <div ref="container" class="companies-container container">
        <div class="row">
            <div class="col-12 p-0">
                <div class="companies-list-container">
                    <div ref="companies" class="companies companies-list scrolling">
                        <NuxtImg
                            v-for="(img, index) in shuffledCompanies"
                            :key="index"
                            :data-usal="`fade-u delay-${index * 50}`"
                            :class="{ inverted: inverted }"
                            v-bind="logos[img]"
                            :alt="img"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue"
    const companiesLogos = import.meta.glob<{ src: string }>("~/assets/companies/*.svg", {
        eager: true,
        import: "default",
    })

    defineProps<{
        inverted?: boolean
    }>()

    const logos = Object.entries(companiesLogos).reduce(
        (acc, [key, value]) => {
            const logoName = key.split("/").pop()?.replace(".svg", "") || ""
            acc[logoName] = value
            return acc
        },
        {} as Record<string, { src: string }>,
    )

    const companies = [
        "acxiom",
        "bouygues-immobilier",
        "leroymerlin",
        "experian",
        "sophia-genetics",
        "cleverconnect",
        "tencent",
        "gorgias",
        "jcdecaux",
        "aimtec",
        "hcl",
        "clever-cloud",
        "quadis",
        "huawei",
        "ca",
        "accredible",
        "merkle",
        "renault",
        "dentsu",
        "fila",
        "intersport",
    ]

    const shuffledCompanies = computed(() => {
        return companies.toSorted(() => 0.5 - Math.random())
    })
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";
    @keyframes auto-scroll {
        from {
            transform: translateX(0);
        }

        to {
            transform: translateX(calc(-100% - 2rem));
        }
    }
    .companies-container {
        .companies-list-container {
            width: 100%;
            grid-column-gap: 2rem;
            grid-row-gap: 2rem;
            flex: 0 auto;
            align-content: flex-start;
            display: flex;
            position: relative;
            overflow: hidden;

            &:before,
            &:after {
                content: "";
                position: absolute;
                width: 7rem;
                z-index: 999;
                border-radius: inherit;
                background-color: #111113;
                filter: blur(13px);
                height: 10rem;
            }

            &:after {
                top: calc($spacer * 1.1);
                right: calc($spacer * -3.4);
            }

            &:before {
                top: calc($spacer * -1.9);
                left: calc($spacer * -3.4);
            }

            .companies-list {
                min-width: 100%;
                grid-column-gap: 2rem;
                grid-row-gap: 2rem;
                @include media-breakpoint-down(md) {
                    grid-column-gap: 1rem;
                    grid-row-gap: 1rem;
                }
                flex: none;
                justify-content: space-between;
                align-items: center;
                display: flex;
                &.scrolling {
                    animation: auto-scroll 60s linear infinite;
                }
            }
        }

        .companies {
            img {
                margin-right: calc($spacer * 2.649);
                margin-top: calc($spacer * 2);
                @include media-breakpoint-down(md) {
                    margin-right: calc($spacer * 0.649);
                }
                &.inverted {
                    filter: invert(100%);
                }
            }
        }
    }
</style>