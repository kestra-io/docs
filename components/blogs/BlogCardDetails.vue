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
        color: $black-8;
        font-size: $font-size-sm;
        font-weight: 400;
    }
</style>