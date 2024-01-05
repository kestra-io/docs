<template>
    <div ref="container" class="container">
        <div ref="companies" class="companies">
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
</template>

<script>
    export default defineComponent({
        mounted() {
            window.addEventListener("resize", this.autoScrollIfNeeded);
            this.autoScrollIfNeeded();
        },
        unmounted() {
            window.removeEventListener("resize", this.autoScrollIfNeeded)
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
                    "bouygues-immobilier",
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

    @keyframes auto-scroll {
        0% {
            -webkit-transform: translateX(0);
            transform: translateX(0);
        }
        50% {
            -webkit-transform: translateX(calc(-250px * 7));
            transform: translateX(calc(-250px * 7));
        }
        100% {
            -webkit-transform: translateX(0);
            transform: translateX(0);
        }
    }

    @include media-breakpoint-down(lg) {
        .container {
            width: fit-content;
            max-width: unset;
            
            .companies {
                width: calc(250px * 14);
                position: relative;
                display: flex;
                flex-wrap: nowrap;
                overflow-x: auto;
                overflow-y: hidden;
                width: fit-content;
                margin: auto;

                &.scrolling {
                    animation: auto-scroll 15s infinite linear;
                }
            }
        }
    }

</style>