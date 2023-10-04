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
        mounted() {
            window.addEventListener("resize", this.autoScrollIfNeeded);
            this.autoScrollIfNeeded();
        },
        props: {
            inverted: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            autoScrollIfNeeded() {
                if (this.$refs && this.$refs.companies) {
                    const companies = this.$refs.companies;
                    const classes = companies.classList;
                    if (companies.clientWidth >= this.$refs.container.parentElement.offsetWidth) {
                        classes.add("scrolling");
                    } else {
                        classes.remove("scrolling")
                    }
                }
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
        width: fit-content;
        max-width: unset;

        .companies {
            display: flex;
            flex-wrap: nowrap;
            overflow-x: auto;
            overflow-y: hidden;
            width: fit-content;
            margin: auto;

            &.scrolling {
                animation: auto-scroll 30s infinite linear;
            }

            @keyframes auto-scroll {
                0% {
                    margin-left: 0;
                }
                50% {
                    margin-left: -25%;
                }
                100% {
                    margin-left: 0;
                }
            }

            img {
                margin-right: calc($spacer * 2);

                &.inverted {
                    filter: invert(100%);
                }
            }
        }
    }
</style>