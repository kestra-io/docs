<template>
    <div class="cards">
        <a :href="blog.path" :target="target">
            <div class="img-container">
                <img :src="blog.image" :alt="blog.title" />
            </div>
            <div class="content">
                <small class="meta">
                    {{ blog.category }} • {{ formatDate(blog.date) }} • {{ authorName }}
                </small>
                <h6 class="title">{{ blog.title }}</h6>
            </div>
        </a>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue'

    const props = defineProps<{
        blog: any
        target?: string
    }>()

    const authorName = computed(() => {
        const authors = props.blog.authors || (props.blog.author ? [props.blog.author] : [])
        return authors.map((author: any) => author.name).join(", ")
    })

    const formatDate = (date: string) => {
        return new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        }).format(new Date(date)).replace(",", "")
    }
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .cards {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        cursor: pointer;
        border: none;

        a {
            text-decoration: none;
            display: block;
        }

        .img-container {
            width: 100%;
            aspect-ratio: 16/9;
            border: $block-border;
            border-radius: 8px;
            overflow: hidden;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.3s ease;
            }
        }

        &:hover .img-container img {
            transform: scale(1.05);
        }

        .content {
            min-height: 52px;
            display: flex;
            flex-direction: column;
            justify-content: center;

            .meta {
                color: var(--ks-content-tertiary);
                font-size: $font-size-xs;
                margin: 0.25rem 0;
            }

            .title {
                color: var(--ks-content-primary);
                margin: 0;
                transition: color 0.3s ease;
            }
        }

        &:hover .title {
            color: var(--ks-content-link);
        }
    }
</style>
