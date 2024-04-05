<template>
    <div ref="container" class="companies-container container">
        <div class="row">
            <div class="col-12 p-0">
                <div class="companies-list-container">
                    <div ref="companies" class="companies companies-list scrolling">
                        <template v-for="(img, index) in companies" :key="index">
                            <NuxtImg
                                data-aos="fade-up"
                                :class="{'inverted': inverted}"
                                :data-aos-delay="index*50"
                                :src="'/landing/companies/' + img  + '.svg'"
                                :alt="img"
                                loading="lazy"
                                format="webp"
                                width="100%"
                            />
                        </template>
                    </div>
                    <div ref="companies" class="companies companies-list scrolling">
                        <template v-for="(img, index) in companies" :key="index">
                            <NuxtImg
                                data-aos="fade-up"
                                :class="{'inverted': inverted}"
                                :data-aos-delay="index*50"
                                :src="'/landing/companies/' + img  + '.svg'"
                                :alt="img"
                                loading="lazy"
                                format="webp"
                                width="100%"
                            />
                        </template>
                    </div>
                    <div ref="companies" class="companies companies-list scrolling">
                        <template v-for="(img, index) in companies" :key="index">
                            <NuxtImg
                                data-aos="fade-up"
                                :class="{'inverted': inverted}"
                                :data-aos-delay="index*50"
                                :src="'/landing/companies/' + img  + '.svg'"
                                :alt="img"
                                loading="lazy"
                                format="webp"
                                width="100%"
                            />
                        </template>
                    </div>
                    <div ref="companies" class="companies companies-list scrolling">
                        <template v-for="(img, index) in companies" :key="index">
                            <NuxtImg
                                data-aos="fade-up"
                                :class="{'inverted': inverted}"
                                :data-aos-delay="index*50"
                                :src="'/landing/companies/' + img  + '.svg'"
                                :alt="img"
                                loading="lazy"
                                format="webp"
                                width="100%"
                            />
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default defineComponent({

        props: {
            inverted: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            companies() {
                return [
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
                    "merkle"
                ]
                    .sort(() => .5 - Math.random())
            },
        }
    });
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";
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
                content: '';
                position: absolute;
                width: 7rem;
                z-index: 999;
                border-radius: inherit;
                background-color: #111113;
                filter: blur(13px);
                height: 10rem;
            }

            &:after {
                top:  calc($spacer * 1.1);
                right: calc($spacer * -3.4);
            }

            &:before {
                top:  calc($spacer * -1.9);
                left: calc($spacer * -3.4);
            }

            .companies-list {
                min-width: 100%;
                grid-column-gap: 2rem;
                grid-row-gap: 2rem;
                flex: none;
                justify-content: space-between;
                align-items: center;
                display: flex;
                &.scrolling {
                    animation: auto-scroll 30s linear infinite;
                }
            }

        }

        .companies {

            img {
                margin-right: calc($spacer * 2.649);
                margin-top: calc($spacer * 2);

                &.inverted {
                    filter: invert(100%);
                }
            }
        }
    }

</style>