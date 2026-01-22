<template>
    <div class="content position-relative">
        <div class="container base-container">
            <h1 data-usal="fade-l" class="title-sm title fw-light" v-html="content.tag"></h1>
            <p class="my-4">
                {{ content.description }}
            </p>
            <div class="interests mb-4">
                <h5>{{ content.interests.title }}</h5>
                <ul>
                    <li v-for="item in content.interests.items">
                        <span class="item-title">{{ item.title }}:</span>
                        {{ item.description }}
                    </li>
                </ul>
            </div>
            <Participation :cta="content.cta" />
        </div>
    </div>
</template>

<script>
    import Line from "~/components/use-cases/Line.vue"

    import Participation from "~/components/write-for-us/Participation.vue"

    export default {
        name: "Write",

        components: {
            Line,
            Participation,
        },

        props: {
            content: {
                type: Object,
                required: true,
                default: () => ({
                    tag: "",
                    description: "",
                    interests: {},
                }),
            },
        },
    }
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .title-sm {
        font-size: $h2-font-size;
        padding-top: $rem-4;
    }

    .content {
        background: $black-1;
        padding-bottom: $rem-5;
    }

    .base-container {
        max-width: $width-800;
        line-height: 1.75rem;
    }

    .item-title {
        font-weight: 400;
    }

    .cta {
        background-color: $black-2;
        color: white;
        padding: $rem-2 0 $rem-2 $rem-2;
        box-shadow: none;
    }
</style>