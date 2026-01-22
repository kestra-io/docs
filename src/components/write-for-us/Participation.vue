<template>
    <div class="cta card" data-usal="fade-r">
        <div class="row align-items-center">
            <div class="col-lg-9 col-md-12">
                <h5>{{ cta.title }}</h5>
                <p>{{ cta.description }}</p>
            </div>
            <div class="w-auto">
                <a :href="cta.action.href" :target="cta.action.target">
                    <button class="btn" :class="cta.action.style">
                        <span class="mx-4">
                            {{ cta.action.text }}
                        </span>
                    </button>
                </a>
            </div>
        </div>
    </div>
</template>

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
    }
</script>

<style scoped lang="scss"></style>