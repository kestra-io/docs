<script>
export default {
    name: "Participation",

    props: {
        cta: {
            type: Object,
            required: true,
            default: () => ({
                title: "",
                description: "",
                action: {},
            }),
        },
    },
};
</script>

<template>
    <div class="cta card" data-aos="fade-right">
        <div class="row align-items-center">
            <div class="col-lg-9 col-md-12">
                <h5>{{ cta.title }}</h5>
                <p>{{ cta.description }}</p>
            </div>
            <div class="w-auto">
                <NuxtLink :href="cta.action.href" :target="cta.action.target">
                    <button class="btn" :class="cta.action.style">
                        <span class="mx-4">
                            {{ cta.action.text }}
                        </span>
                    </button>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
