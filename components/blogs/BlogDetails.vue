<template>
    <div class="blog-details mb-5">
        <p>
            <span class="category">
                {{ blog.category }}
            </span>
            <br/>
            <span class="date">
                {{ date }}
            </span>
        </p>

        <NuxtImg loading="lazy" format="webp" width="68" class="rounded-circle mt-5" :src="'/landing/company/teams/' + blog.author.image + '-sm.png'" :alt="blog.author.name"/><br />
        <strong>{{ blog.author.name }}</strong>

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

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .blog-details {
        margin-left: 1rem !important;
    }

    p {
        font-size: $font-size-sm;

        .category {

            color: var(--bs-primary);
        }
    }


    img {
        max-width: 68px;
    }

    .date {
        color: var(--bs-gray-600)
    }
</style>