<template>
    <div class="wrapper">
        <VueLottie
            ref="lottie"
            class="animation"
            v-if="animationData"
            :animation-data="animationData"
            :assets-path="assetsPath"
            :loop="false"
            :auto-play="false"
            @complete="complete"
            @domLoaded="play"
        />
        <a href="#" data-aos="zoom-in" data-bs-toggle="modal" data-bs-target="#home-intro"/>
    </div>
</template>

<script>
    import VueLottie from '~/components/layout/VueLottie';
    import * as animationData from '~/components/home/animation.json';

    export default {
        components: {VueLottie},
        data() {
            return {
                assetsPath: undefined,
                animationData: undefined
            }
        },
        mounted() {
            this.transform();
        },
        methods: {
            complete() {
                this.transform();
                this.$refs.lottie.init();

            },
            play() {
                this.$refs.lottie.play();
            },
            transform() {
                this.animationData = {...animationData.default};
            }
        }
    }
</script>
<style scoped lang="scss">
    .wrapper {
        position: relative;

        a {
            position: absolute;
            left: 16%;
            top: 38%;
            width: 36%;
            height: 28%;
        }
    }
</style>