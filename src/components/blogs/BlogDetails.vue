<template>
    <div class="blog-details">
        <div class="meta mb-4">
            <span class="date">{{ date }}</span>
            <span class="category ms-3">{{ blog.data.category }}</span>
        </div>
        <div class="authors">
            <div
                v-for="author in authorsList"
                :key="author.name"
                class="author d-flex align-items-center gap-3"
            >
                <NuxtImg
                    loading="lazy"
                    v-bind="authorsAvatars[`${author.image}-sm.png`]"
                    class="rounded-circle"
                    width="48"
                    height="48"
                    :alt="author.name"
                />
                <div>
                    <p class="name">{{ author.name }}</p>
                    <p v-if="author.role" class="role">{{ author.role }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { CollectionEntry } from "astro:content";
    import { computed } from "vue";
    import dayjs from "dayjs"
    import customParseFormat from "dayjs/plugin/customParseFormat"
    import { useBlogAuthors } from "~/composables/useBlogAuthors"

    const props = defineProps<{
        blog: CollectionEntry<"blogs">
        authorsAvatars: Record<string, any>
    }>()

    const date = computed(() => {
        dayjs.extend(customParseFormat)
        return dayjs(props.blog.data.date).format("MMMM D YYYY")
    })

    const authorsList = computed(() => {
        const { getAuthors } = useBlogAuthors(props.blog)
        return getAuthors()
    })
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .blog-details {
        margin: 0 !important;
        padding: 1rem 0;
    }

    .meta {
        font-size: $font-size-sm;
        .category,
        .date {
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

    .authors {
        margin-top: 1rem;
        display: flex;
        flex-wrap: wrap;
        gap: 2rem;
    }

    .author {
        img {
            max-width: 48px;
        }

        .name {
            color: $white;
            line-height: 1.8em;
            font-size: $font-size-md;
            font-weight: 600;
            margin: 0;
        }

        .role {
            color: $white-3;
            line-height: 1.8em;
            font-size: $font-size-xs;
            margin-bottom: 0;
        }
    }
</style>