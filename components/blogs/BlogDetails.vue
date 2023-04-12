<template>
    <div class="blog-details ms-3">
        <p>
            <span class="category">
                {{ blog.category }}
            </span>
            <br/>
            <span class="date">
                {{ date }}
            </span>
        </p>
    </div>
</template>

<script>
    import dayjs from "dayjs";
    import customParseFormat from "dayjs/plugin/customParseFormat"

    export default {
        name: "BlogDetails",
        props: {
            blog: {
                type: Object,
                required: true,
            },
        },
        computed: {
            date() {
                dayjs.extend(customParseFormat)
                return dayjs(this.blog.date).format("MMMM D YYYY");
            },
        },
    }
</script>

<style lang="scss">
    .blog-details {
        margin-bottom: 8rem;
    }

    .category {
        font-size: 0.8rem;
    }

    .date {
        font-size: 0.9rem;
        color: var(--bs-gray-500)
    }
</style>