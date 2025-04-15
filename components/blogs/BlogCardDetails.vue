<template>
    <p>
        <template v-if="Array.isArray(authors)">
            <span v-for="(author, index) in authors" :key="author.name">
                {{ author.name }}<span v-if="index < authors.length - 1">, </span>
            </span>
            - {{ timesAgo(date) }}
        </template>
        <template v-else>
            {{ name }} - {{ timesAgo(date) }}
        </template>
    </p>
</template>

<script>
    import {timesAgo} from "~/utils/times.js";
    export default {
        name: "BlogCardDetails",
        props: {
            name: {
                type: String,
                required: false,
                default: '',
            },
            authors: {
                type: Array,
                required: false,
                default: null,
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