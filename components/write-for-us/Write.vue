<template>
    <div class="content">
        <div class="container base-container position-relative">
            <h1
                data-aos="fade-left"
                class="title-sm title fw-light"
                v-html="content.tag"
            ></h1>
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
import Line from "~/components/use-cases/Line.vue";

import Participation from "~/components/write-for-us/Participation.vue";

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
};
</script>

<style scoped lang="scss">
@import "../../assets/styles/variable";

.title-sm {
    font-size: $h2-font-size;
    padding-top: 4rem;
}

.content {
    background: $black-1;
    padding-bottom: 5rem;
}

.base-container {
    width: $width-800;
    line-height: 1.75rem;
}

.item-title {
    font-weight: 400;
}

.cta {
    background-color: $black-2;
    color: white;
    padding: 2rem 0 2rem 2rem;
    box-shadow: none;
}
</style>
