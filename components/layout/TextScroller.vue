<script>
export default {
    props: {
        texts: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            idx: 0,
            intervalId: null,
        };
    },
    computed: {
        current() {
            return this.texts[this.idx];
        },
    },
    methods: {
        handleTextChange() {
            const oldIdx = this.idx;
            // to delete dom and force trigger the animation from beginning
            this.idx = undefined;
            this.$nextTick(() => {
                this.idx = (oldIdx + 1) % this.texts.length;

                this.$nextTick(() => {
                    this.$refs.words.forEach((word, index) => {
                        word.style.animationDelay = `${index * 50}ms`;

                        const color = this.texts[this.idx].color;
                        if (color) {
                            word.style.color = color;
                        }
                    });
                });
            });
        },
    },
    mounted() {
        this.intervalId = setInterval(this.handleTextChange, 1500);
    },
    beforeDestroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    },
};
</script>

<template>
    <span
        v-if="idx !== undefined"
        class="fade-bottom"
        ref="words"
        v-for="word in current.text.split(' ')"
        >{{ word + " " }}</span
    >
</template>

<style lang="scss" scoped>
@import "../../assets/styles/variable";

.fade-bottom {
    white-space: pre-wrap;
    display: inline-block;
    animation-duration: 500ms;
    animation-fill-mode: both;
    animation-name: fadeInBottom;

    @include media-breakpoint-down(sm) {
        min-width: 100%;
        text-align: center;
    }

    @include media-breakpoint-up(lg) {
        min-width: 280px;
    }

    @keyframes fadeInBottom {
        from {
            opacity: 0;
            transform: translateY(50%);
        }
        to {
            opacity: 1;
        }
    }
}
</style>
