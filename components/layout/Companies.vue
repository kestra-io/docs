<template>
    <div ref="container" class="container">
        <div ref="companies" class="companies">
            <template v-for="(img, index) in companies">
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
                    "aimtec",
                    "cleverconnect",
                    "decathlon",
                    "fortinet",
                    "hcl",
                    "huawei",
                    "leroymerlin",
                    "ntico",
                    "tencent",
                    "facily",
                    "airpazz",
                    "gorgias",
                    "jcdecaux",
                    "orlando-city",
                    "sophia-genetics",
                ]
                    .sort(() => .5 - Math.random())
            },
        }
    });
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container {
        text-align: center;
        .companies {

            img {
                margin-right: calc($spacer * 2);
                margin-top: calc($spacer * 2);

                &.inverted {
                    filter: invert(100%);
                }
            }
        }
    }
</style>