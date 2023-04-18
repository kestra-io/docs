<template>
    <div class="container">
        <div class=" container text-center">
            <p class="companies-title">
                Loved & trusted by leading enterprises worldwide
            </p>

        </div>

        <div class="container-fluid pt-4 pb-4">
            <div class="companies">
                <template v-for="img in companies">
                    <img
                        :src="'/landing/enterprise/companies/' + img  + '.svg'"
                        :alt="'Logo ' + img"
                    />
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
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
                    //"ntico",
                    "tencent",
                    "twosix",
                    "facily",
                ]
                    .sort(() => .5 - Math.random())
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container {
        padding-top: 80px;
        margin-top: -70px;

        .companies-title {
            position: relative;

            &:after {
                content: '';
                position: absolute;
                left: 50%;
                top: 2.5rem;
                display: inline-block;
                height: 2px;
                width: 51px;
                background: var(--bs-pink);
            }
        }

        .companies {
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            justify-content: center;

            img {
                margin-right: calc($spacer * 2);
            }
        }
    }
</style>