<template>
    <div ref="container" class="container mb-4">
        <div class="row">
            <div class="col-12">
                <div class="companies-container">
                    <div ref="companies" class="companies companies-list scrolling">
                        <template v-for="(img, index) in companies" :key="index">
                            <img
                                data-aos="fade-up"
                                :class="{'inverted': inverted}"
                                :data-aos-delay="index*50"
                                :src="'/landing/companies/' + img  + '.svg'"
                                :alt="img"
                            />
                        </template>
                    </div>
                    <div ref="companies" class="companies companies-list scrolling">
                        <template v-for="(img, index) in companies" :key="index">
                            <img
                                data-aos="fade-up"
                                :class="{'inverted': inverted}"
                                :data-aos-delay="index*50"
                                :src="'/landing/companies/' + img  + '.svg'"
                                :alt="img"
                            />
                        </template>
                    </div>
                    <div ref="companies" class="companies companies-list scrolling">
                        <template v-for="(img, index) in companies" :key="index">
                            <img
                                data-aos="fade-up"
                                :class="{'inverted': inverted}"
                                :data-aos-delay="index*50"
                                :src="'/landing/companies/' + img  + '.svg'"
                                :alt="img"
                            />
                        </template>
                    </div>
                    <div ref="companies" class="companies companies-list scrolling">
                        <template v-for="(img, index) in companies" :key="index">
                            <img
                                data-aos="fade-up"
                                :class="{'inverted': inverted}"
                                :data-aos-delay="index*50"
                                :src="'/landing/companies/' + img  + '.svg'"
                                :alt="img"
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
                    "fortinet",
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
    .container {
        .companies-container {
            width: 100%;
            grid-column-gap: 2rem;
            grid-row-gap: 2rem;
            flex: 0 auto;
            align-content: flex-start;
            display: flex;
            position: relative;
            overflow: hidden;
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