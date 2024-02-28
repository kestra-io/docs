<template>
    <div id="fixed-container">
        <div class="text-end">
            <Transition>
                <a href="#" class="btn btn-sm btn-primary mb-2" @click="backToTop" v-if="yScroll > 200">
                    <ChevronUp />
                </a>
            </Transition>
            <Slack v-if="displaySlack" :widget="true"/>
        </div>
    </div>
</template>

<script>
import ChevronUp from 'vue-material-design-icons/ChevronUp.vue'
import Slack from '../community/Slack.vue'

export default {
    components: {Slack, ChevronUp},
    data() {
        return {
            yScroll: 0
        };
    },
    methods: {
        handleScroll() {
            this.yScroll = window.scrollY;
        },
        backToTop() {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    },
    computed: {
        displaySlack() {
            return this.$route.name !== "enterprise";
        }
    },
    created() {
        if (process.client) {
            window.addEventListener('scroll', this.handleScroll);
        }
    },
    unmounted() {
        if (process.client) {
            window.removeEventListener('scroll', this.handleScroll);
        }
    }
}
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    #fixed-container {
        position: fixed;
        z-index: 9999;
        bottom: 10px;
        right: 10px;
        transform: translateX(0);
        transition: all ease 0.2s;

        .text-end {
            a {
                background-color: $primary-1;
                border-color: $primary-1;
            }
        }

        @include media-breakpoint-down("md") {
            display: none;
        }

        .v-enter-active,
        .v-leave-active {
            transition: opacity 0.8s ease;
        }

        .v-enter-from,
        .v-leave-to {
            opacity: 0;
        }
    }
</style>