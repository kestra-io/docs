<template>
    <div class="content">
        <div class="container base-container position-relative">
            <h1
                data-aos="fade-left"
                class="title-sm title pt-5 fw-light"
                v-html="content.tag"
            ></h1>
            <p class='my-4'>
                {{ content.description }}
            </p>
            <div class="interests mb-4">
                <h5>{{ content.interests.title }}</h5>
                <ul>
                    <li v-for="item in content.interests.items">
                        <span class='item-title'>{{ item.title }}:</span> {{ item.description }}
                    </li>
                </ul>
            </div>
            <div class="cta card">
                <div class='row align-items-center'>
                    <div class='col-lg-9 col-md-12'>
                        <h5>{{content.cta.title}}</h5>
                        <p>{{ content.cta.description}}</p>
                    </div>
                    <div class='w-auto'>
                        <NuxtLink :href="content.cta.action.href">
                            <button class="btn" :class="content.cta.action.style">
                                <span class='mx-4'>{{ content.cta.action.text }}</span>
                            </button>
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
        <Line class='divider'/>
    </div>
</template>

<script>
import Line from "~/components/use-cases/Line.vue";

export default {
    name: "Write",

    components: {
        Line
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
        }
    },
};
</script>

<style scoped lang="scss">
@import "../../assets/styles/variable";

.title-sm {
    font-size: $h2-font-size;
}

.content {
    background: $black-1;
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

.divider {
    margin-top: 4rem;
}
</style>
