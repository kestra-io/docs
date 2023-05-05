<template>
    <VueLottie
        ref="lottie"
        class="animation"
        v-if="animationData"
        :animation-data="animationData"
        :assets-path="assetsPath"
        :loop="false"
        :auto-play="false"
        :speed="1.2"
        @complete="complete"
        @domLoaded="play"
    />
</template>

<script>
    import VueLottie from '../layout/VueLottie';
    import * as animationData from './animation.json';

    export default {
        components: {VueLottie},
        data() {
            return {
                animationData: undefined,
                assetsPath: undefined,
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
                // let logoCopy = [...logo];
                // const random = Math.floor(Math.random()*logoCopy.length)

                // let logo1 = logoCopy[random];
                // logoCopy = logoCopy.filter((valur, key) => key !== random);
                //
                // let logo2 = logoCopy[Math.floor(Math.random()*logoCopy.length)];

                const data = {... animationData.default};

                // this.assetsPath = logo1.substring(0, logo1.lastIndexOf("/") + 1);
                // data.assets[0].p = logo1.replace(/^.*[\\\/]/, '');
                // data.assets[1].p = logo2.replace(/^.*[\\\/]/, '');

                this.animationData = data;
            }
        }
    }
</script>
