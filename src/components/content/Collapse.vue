<template>
    <div class="mb-4">
        <div class="show-button" @click="toggleShow">
            <ChevronDown v-if="show" class="icon-2x" />
            <ChevronRight v-else class="icon-2x" />
            <span v-if="title" class="title">{{ title }}</span>
        </div>
    </div>
    <div v-if="show">
        <slot />
    </div>
</template>

<script>
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue"
    import ChevronRight from "vue-material-design-icons/ChevronRight.vue"

    export default {
        components: {
            ChevronDown,
            ChevronRight,
        },
        props: {
            title: {
                type: String,
                required: true,
                default: "Details",
            },
        },
        data() {
            return {
                show: false,
            }
        },
        methods: {
            toggleShow() {
                this.show = !this.show
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .show-button {
        cursor: pointer;
        font-size: 1.3em;
        color: var(--bs-white);
        display: inline-block;
        padding-right: 0.1em;
    }

    .show-button:hover {
        color: $purple-36;
        background-color: #252526;
        border-radius: 4px;
    }

    .title {
        margin-left: 0.25em;
    }
</style>