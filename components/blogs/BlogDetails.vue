<template>
    <div class="blog-details">
        <p>
            <span class="category">
                {{ blog.category }}
            </span>
            <br />
            <span class="date">
                {{ date }}
            </span>
        </p>
        <div class="py-3 author d-flex align-items-center gap-3">
            <NuxtImg loading="lazy" width="48" class="rounded-circle"
                :src="'/landing/company/teams/' + blog.author.image + '-sm.png'" :alt="blog.author.name" /><br />
            <div>
                <p>{{ blog.author.name }}</p>
                <span>{{ blog.author.role }}</span>
            </div>
        </div>

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
        margin-left: 2rem !important;
        margin-right: 2rem !important;
    }

    p {
        font-size: $font-size-sm;

        .category, .date {
            color: $purple;
            font-size: $font-size-sm;
            font-weight: 100;
        }

        .date {
            color: $white;
        }
    }

    img {
        max-width: 68px;
    }

    .author {
        border-top: $block-border;
        border-bottom: $block-border;

        p {
            color: $white;
            font-size: $font-size-md;
            font-weight: 600;
            margin: 0;
        }
        span {
            color: $white-1;
            font-size: $font-size-sm;
        }
    }
</style>