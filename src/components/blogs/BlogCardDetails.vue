<template>
    <p>{{ authorName }} - {{ timesAgo(date) }}</p>
</template>

<script>
    import { timesAgo } from "~/utils/times.js"
    export default {
        name: "BlogCardDetails",
        props: {
            authors: {
                type: Array,
                required: true,
            },
            date: {
                type: String,
                required: true,
            },
        },
        computed: {
            authorName() {
                if (!this.authors.length) return ""
                return this.authors.map((author) => author.name).join(", ")
            },
        },
        methods: {
            timesAgo,
        },
    }
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    p {
        color: $black-8;
        font-size: 1.125rem;
        font-weight: 400;
        line-height: 2rem;
        margin-bottom: 2rem;
    }
</style>