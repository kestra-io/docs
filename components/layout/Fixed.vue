<template>
    <div class="fixed-container text-right">
        <div class="text-right">
            <Transition>
            <div @click="backToTop" v-if="yScroll > 200" class="top-arrow inline-block">
                <PanUp/>
            </div>
            </Transition>
            <Slack :widget="true"/>
        </div>
    </div>
</template>

<script>
import PanUp from 'vue-material-design-icons/PanUp.vue'
import Slack from '../community/Slack.vue'

export default {
    components: {Slack, PanUp},
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
    created() {
        window.addEventListener('scroll', this.handleScroll);
    }
}
</script>

<style lang="scss" scoped>
@import "../../assets/styles/variable";

.fixed-container {
    position: fixed;
    z-index: 9999;
    bottom: 10px;
    right: 10px;

    .v-enter-active,
    .v-leave-active {
        transition: opacity 0.8s ease;
    }

    .v-enter-from,
    .v-leave-to {
        opacity: 0;
    }

    .top-arrow {
        &:hover{
            cursor: pointer;

            .material-design-icon {
                color: shade-color($primary, $btn-hover-bg-shade-amount);
            }
        }

        .material-design-icon {
            font-size: 500%;
            color: $primary;
        }
    }
}

.text-right {
    text-align: right;
}

.inline-block {
    display: inline-block;
}
</style>