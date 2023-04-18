<template>
    <div class="companies">
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
                    "dnb",
                    "fortinet",
                    "hcl",
                    "huawei",
                    "iqtig",
                    "leroymerlin",
                    "ntico",
                    "tencent",
                    "twosix",
                    "facily",
                ]
                    .sort(() => .5 - Math.random())
            },
        }
    });
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .companies {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: center;

        img {
            margin-right: calc($spacer * 2);


            &.inverted {
                filter: invert(100%);
            }
        }
    }
</style>