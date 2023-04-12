<template>
    <p class="small-text details"><u>{{ name }}</u> {{ timesAgo(date) }}</p>
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

<style scoped lang="scss">
    @import '../../assets/styles/blogs.scss';
</style>