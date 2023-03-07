<template>
    <p align="center">
        <router-link :to="link">
            <button
                class="btn-info btn-lg">{{ message }}
            </button>
        </router-link>
    </p>
</template>

<script>
export default {
    name: "nextStep.vue",
    props: {
        message: {
            type: String,
            default: 'Next Step',

        },
        link: {
            type: String,
            required: true
        },
    },
}
</script>