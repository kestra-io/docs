<template>
    <p>{{ name }} - {{ timesAgo(date) }}</p>
</template>

<script>
    import {timesAgo} from "~/utils/times.js";
    export default {
        name: "BlogCardDetails",
        props: {
            name: {
                type: String,
                required: true,
            },
            date: {
                type: String,
                required: true,
            },
        },
        methods: {
            timesAgo,
        },
    }
</script>


<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    p {
        color: var(--bs-gray-600);
        font-size: $font-size-sm;
    }
</style>