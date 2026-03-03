<template>
    <div class="details">
        <h6>Authors</h6>
        <div class="authors">
            <div
                v-for="author in authorsList"
                :key="author.name"
                class="author d-flex align-items-center gap-3"
            >
                <NuxtImg
                    loading="lazy"
                    v-bind="avatars[`${author.image}-sm.png`]"
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
    <div>
        <h6>Category</h6>
        <small class="metadata">
            <span>{{ blog.data.category }}</span>
        </small>
    </div>
    <div>
        <h6>Last Updated</h6>
        <small class="metadata">
            {{ date }}
        </small>
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
        avatars: Record<string, any>
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

    .details {
        margin: 0 !important;

        h6 {
            margin-bottom: 0.5rem;
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
            color: var(--ks-content-primary);
            line-height: 1.8em;
            font-size: $font-size-md;
            font-weight: 600;
            margin: 0 !important;
        }

        .role {
            color: var(--ks-content-secondary);
            line-height: 1.8em;
            font-size: $font-size-xs;
            margin-bottom: 0 !important;
        }
    }

    .metadata {
        color: var(--ks-content-primary);
        font-size: $font-size-xs;

        span {
            background: var(--ks-backgroung-tag-category);
            color: var(--ks-content-tag-category);
            padding: 0.125rem 0.5rem;
            border-radius: 40px;
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
</style>