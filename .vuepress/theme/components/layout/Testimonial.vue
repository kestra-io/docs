<script>

export default {
    props: {
        testimonialData: {
            type: Array,
            default: [],
        },
    },
    data() {
        return {
            carousel: undefined,
            slide: undefined,
        };
    },
    mounted () {
        import('vue-carousel').then(module => {
            this.carousel = module.Carousel;
            this.slide = module.Slide;
        })
    },
    components: {

    },
};
</script>

<template>
    <component
        v-if="carousel"
        :is="carousel"
        id="customer-testi"
        :perPageCustom="[[320, 1], [768, 2]]"
        :autoplayTimeout="10000"
        :autoplayHoverPause="true"
        dir="ltr"
        :autoplay="true"
        :loop="true"
    >
        <component
            v-if="slide"
            :is="slide"
            v-for="item in testimonialData"
            :key="item.id"
        >
            <div class="media customer-testi m-2">
                <img
                    :src="`${item.profile}`"
                    class="avatar avatar-small mr-3 rounded shadow"
                    alt=""
                />
                <div
                    class="media-body content p-3 shadow rounded bg-white position-relative"
                >
                    <p class="text-muted mt-2">" {{ item.message }} "</p>
                    <h6 class="text-primary">
                        <a :href="item.link">{{ item.name }}</a>
                        <small class="text-muted">{{ item.designation }}</small>
                    </h6>
                </div>
            </div>
        </component>
    </component>
</template>

<style lang="scss" scoped>
@import ".vuepress/theme/styles/variables";

.customer-testi {
    .content:before {
        content: "";
        position: absolute;
        top: 30px;
        left: 0;
        margin-left: 13px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        border: 8px solid #3c4858;
        border-color: transparent #ffffff #ffffff transparent;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: rotate(135deg);
        transform: rotate(135deg);
        -webkit-box-shadow: 2px 2px 2px -1px rgba(60, 72, 88, 0.15);
        box-shadow: 2px 2px 2px -1px rgba(60, 72, 88, 0.15);
    }
}


/deep/ .VueCarousel-dot-container {
    margin-top: 0px !important;
}

/deep/ .VueCarousel-dot {
    width: 10px !important;
    height: 10px !important;
    border-radius: 9px !important;
    padding: 7px !important;
    background-color: $tertiary !important;
    transition: all 300ms;
}

/deep/ .VueCarousel-dot:focus {
    outline: none !important;
}

/deep/ .VueCarousel-dot--active {
    background-color: $secondary !important;
    transform: rotate(45deg);
}

</style>