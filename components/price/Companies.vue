<template>
    <div ref="container" class="container pb-5">
        <div ref="companies" class="companies scrolling">
            <template v-for="(img, index) in companies">
                <img data-aos="fade-up" :class="{ 'inverted': inverted }" :data-aos-delay="index * 50"
                    :src="'landing/companies/' + img + '.svg'" :alt="img" />
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
    border-top: $container-border;
    border-bottom: $container-border;
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
        margin-left: 0;
    }

    50% {
        margin-left: -25%;
    }

    100% {
        margin-left: 0;
    }
}
</style>