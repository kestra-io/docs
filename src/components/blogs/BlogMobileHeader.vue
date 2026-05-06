<template>
    <div class="blog-mobile-header">
        <div
            v-for="author in authorsList"
            :key="author.name"
            class="author d-flex align-items-center gap-2"
        >
            <NuxtImg
                loading="lazy"
                v-bind="avatars[`${author.image}-sm.png`]"
                class="rounded-circle author-avatar"
                width="40"
                height="40"
                :alt="author.name"
            />
            <div class="author-info">
                <p class="author-name">{{ author.name }}</p>
                <p v-if="author.role" class="author-role">{{ author.role }}</p>
            </div>
        </div>
        <div class="meta">
            <span class="meta-date">{{ date }}</span>
            <span class="meta-category">{{ blog.data.category }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { CollectionEntry } from "astro:content";
    import { computed } from "vue";
    import dayjs from "dayjs";
    import customParseFormat from "dayjs/plugin/customParseFormat";
    import { useBlogAuthors } from "~/composables/useBlogAuthors";

    const props = defineProps<{
        blog: CollectionEntry<"blogs">;
        avatars: Record<string, any>;
    }>();

    const date = computed(() => {
        dayjs.extend(customParseFormat);
        return dayjs(props.blog.data.date).format("MMMM D YYYY");
    });

    const authorsList = computed(() => {
        const { getAuthors } = useBlogAuthors(props.blog);
        return getAuthors();
    });
</script>

<style lang="scss" scoped>
    .blog-mobile-header {
        display: none;

        @include media-breakpoint-down(md) {
            display: flex;
            align-items: center;
            flex-wrap: nowrap;
            gap: 0.75rem;
            justify-content: space-between;
            padding-inline: 1rem;
            width: 100%;
        }

        .author {
            flex-shrink: 0;

            &-avatar {
                width: 40px;
                height: 40px;
                flex-shrink: 0;
            }

            &-info {
                display: flex;
                flex-direction: column;
            }

            &-name {
                color: var(--ks-content-primary);
                font-size: $font-size-sm;
                font-weight: 600;
                margin: 0;
                line-height: 1.4;
            }

            &-role {
                color: var(--ks-content-secondary);
                font-size: $font-size-xs;
                margin: 0;
                line-height: 1.4;
            }
        }

        .meta {
            display: flex;
            align-items: flex-end;
            flex-direction: column;
            gap: 0.25rem;
            flex-shrink: 0;

            &-date {
                color: var(--ks-content-primary);
                font-size: $font-size-xs;
                white-space: nowrap;
            }

            &-category {
                background: var(--ks-background-tag-category);
                color: var(--ks-content-tag-category);
                padding: 0.125rem 0.5rem;
                border-radius: 40px;
                font-size: $font-size-xs;
                font-weight: 600;
                white-space: nowrap;
            }
        }
    }
</style>