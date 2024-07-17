<template>
    <div ref="container" class="companies-container container">
        <div class="row">
            <div class="col-12 p-0">
                <div class="companies-list-container">
                    <div ref="companies" class="companies companies-list scrolling">
                        <template v-for="(img, index) in companies" :key="index">
                            <NuxtImg
                                loading="lazy"
                                format="webp"
                                data-aos="fade-up"
                                :class="{'inverted': inverted}"
                                :data-aos-delay="index*50"
                                :src="'/landing/companies/' + img.name  + '.svg'"
                                :alt="img.name"
                                :width="img.width"
                                :heigth="img.heigth"
                            />
                        </template>
                    </div>
                    <div ref="companies" class="companies companies-list scrolling">
                        <template v-for="(img, index) in companies" :key="index">
                            <NuxtImg
                                data-aos="fade-up"
                                :class="{'inverted': inverted}"
                                :data-aos-delay="index*50"
                                :src="'/landing/companies/' + img.name  + '.svg'"
                                :alt="img.name"
                                :width="img.width"
                                :heigth="img.heigth"
                            />
                        </template>
                    </div>
                    <div ref="companies" class="companies companies-list scrolling">
                        <template v-for="(img, index) in companies" :key="index">
                            <NuxtImg
                                data-aos="fade-up"
                                :class="{'inverted': inverted}"
                                :data-aos-delay="index*50"
                                :src="'/landing/companies/' + img.name  + '.svg'"
                                :alt="img.name"
                                :width="img.width"
                                :heigth="img.heigth"
                            />
                        </template>
                    </div>
                    <div ref="companies" class="companies companies-list scrolling">
                        <template v-for="(img, index) in companies" :key="index">
                            <NuxtImg
                                data-aos="fade-up"
                                :class="{'inverted': inverted}"
                                :data-aos-delay="index*50"
                                :src="'/landing/companies/' + img.name  + '.svg'"
                                :alt="img.name"
                                :width="img.width"
                                :heigth="img.heigth"
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
                    { name: "acxiom", width: "130px", height: "29px" },
                    { name: "bouygues-immobilier", width: "132px", height: "53px" },
                    { name: "leroymerlin", width: "63px", height: "39px" },
                    { name: "experian", width: "116px", height: "37px" },
                    { name: "sophia-genetics", width: "119px", height: "37px" },
                    { name: "cleverconnect", width: "136px", height: "29px" },
                    { name: "tencent", width: "189px", height: "25px" },
                    { name: "gorgias", width: "118px", height: "29px" },
                    { name: "jcdecaux", width: "140px", height: "53px" },
                    { name: "aimtec", width: "134px", height: "35px" },
                    { name: "hcl", width: "77px", height: "11px" },
                    { name: "clever-cloud", width: "117px", height: "29px" },
                    { name: "quadis", width: "117px", height: "23px" },
                    { name: "huawei", width: "54px", height: "53px" },
                    { name: "ca", width: "63px", height: "45px" },
                    { name: "accredible", width: "167px", height: "27px" },
                    { name: "merkle", width: "140px", height: "19px" },
                    { name: "renault", width: "135px", height: "33px" },
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
                    animation: auto-scroll 60s linear infinite;
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