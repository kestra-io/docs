<template>
    <div ref="animation"></div>
</template>
<script>
    import lottie from 'lottie-web/build/player/lottie_light.min'

    export default {
        props: {
            animationData: {type: [Object, String], required: true},
            loop: {type: [Boolean, Number], default: true},
            autoPlay: {type: Boolean, default: true},
            renderer: {type: String, default: 'svg'},
            speed: {type: Number, default: 1},
            assetsPath: {type: String, required: false},
        },
        data() {
            return {
                anim: null
            }
        },
        // watch: {
        //     animationData: function() {
        //         this.anim.destroy()
        //         this.init()
        //     }
        // },
        mounted() {
            this.init()
        },
        beforeDestroy() {
            if (this.anim) {
                this.anim.destroy()
            }
        },
        methods: {
            init() {
                if (this.anim) {
                    this.anim.destroy()
                    this.anim = undefined;
                }

                let settings = {
                    container: this.$refs.animation,
                    renderer: this.renderer,
                    loop: this.loop,
                    autoplay: this.autoPlay,
                    animationData: this.animationData,
                    assetsPath: this.assetsPath
                }
                this.anim = lottie.loadAnimation(settings)

                if (this.speed !== 1) {
                    this.anim.setSpeed(this.speed);
                }

                this.$emit('animCreated', this.anim);

                this.anim.addEventListener('loopComplete', () => {
                    this.$emit('loopComplete', this.anim);
                })
                this.anim.addEventListener('complete', () => {
                    this.$emit('complete', this.anim);
                })
                this.anim.addEventListener('enterFrame', () => {
                    this.$emit('enterFrame', this.anim);
                })
                this.anim.addEventListener('DOMLoaded', () => {
                    this.$emit('domLoaded', this.anim);
                })
            },
            play() {
                if (this.anim) {
                    this.anim.play()
                }
            },
            stop() {
                if (this.anim) {
                    this.anim.stop()
                }
            },
            pause() {
                if (this.anim) {
                    this.anim.pause()
                }
            }
        }
    }
</script>