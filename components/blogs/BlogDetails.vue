<template>
    <div class="blog-details">
        <div class="meta mb-4">
            <span class="date">{{ date }}</span>
            <span class="category ms-3">{{ blog.category }}</span>
        </div>
        <div class="authors d-flex flex-wrap gap-4">
            <div v-for="author in authorsList" :key="author.name" 
                 class="author d-flex align-items-center gap-3">
                <NuxtImg loading="lazy" width="48" class="rounded-circle"
                    :src="'/landing/company/teams/' + author.image + '-sm.png'" :alt="author.name" />
                <div>
                    <p class="name">{{ author.name }}</p>
                    <p v-if="author.role" class="role">{{ author.role }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat"
import { useBlogAuthors } from "~/composables/useBlogAuthors";

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
        authorsList() {
            const { getAuthors } = useBlogAuthors(this.blog);
            return getAuthors();
        }
    },
}
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .blog-details {
        margin: 0 !important;
        padding: 1rem 0;
    }

    .meta {
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
        max-width: 48px;
        border: 1px solid $black-3;
    }

    .authors {
        margin-top: 1rem;
    }

    .author {
        min-width: 250px;

        .name {
            color: $white;
            font-size: $font-size-md;
            font-weight: 600;
            margin: 0;
        }
        
        .role {
            color: $white-1;
            font-size: $font-size-sm;
            font-weight: 400;
        }
    }
</style>