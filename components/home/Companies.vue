<template>
    <div ref="container" class="companies-container container">
        <div class="row">
            <div class="col-12 p-0">
                <div class="companies-list-container">
                    <div ref="companies" class="companies companies-list">
                        <template v-for="(img, index) in companies" :key="index">
                            <NuxtImg
                                data-aos="fade-right"
                                loading="lazy"
                                format="webp"
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
                    { name: "dentsu", width: "83px", height: "24px" },
                    { name: "fila", width: "83px", height: "25px" },
                    { name: "intersport", width: "225px", height: "33px" },
                ]
                    .sort(() => .5 - Math.random())
            },
        }
    });
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .companies-container {
        .companies-list-container {
            width: 100%;
            grid-column-gap: 2rem;
            grid-row-gap: 2rem;
            flex: 0 auto;
            align-content: flex-start;

            .companies-list {
                min-width: 100%;
                grid-column-gap: 2rem;
                grid-row-gap: 2rem;
                flex: none;
                align-items: center;
                display: flex;
                flex-wrap: wrap;
                justify-content: center;

                img {
                    margin: 0;
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