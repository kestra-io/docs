<template>
    <div :class="'doc-alert alert alert-' + type" role="alert">
        <slot />
    </div>
</template>

<script>
    export default {
        components: {},
        props: {
            type: {
                type: String,
                required: true
            },
        },
    }
</script>
