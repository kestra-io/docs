<template>
    <details>
        <summary v-if="title">{{ title }}</summary>
        <slot />
    </details>
</template>

<script>
    export default {
        components: {},
        props: {
            title: {
                type: String,
                required: true
            },
        },
    }
</script>

