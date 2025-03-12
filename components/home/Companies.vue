<template>
    <div ref="container" class="companies-container container">
        <div class="row">
            <div class="col-12 p-0">
                <div class="companies-list-container">
                    <div ref="companies" class="companies companies-list">
                        <template v-for="(img, index) in shuffledCompanies" :key="index">
                            <ClientOnly :fallback="companies[index].name">
                                <NuxtImg
                                    data-aos="fade-right"
                                    loading="lazy"
                                    format="webp"
                                    :src="'/landing/companies/' + img.name  + '.svg'"
                                    :alt="img.name"
                                    :width="img.width"
                                    :height="img.height"
                                    class="inverted"
                                />
                            </ClientOnly>
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
        data() {
            return {
                companies:
            }
        },
        computed: {
            shuffledCompanies() {
                return this.companies
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