<template>
    <div>
        <h2 :id="headingId">{{ title }}</h2>
        <div class="list-of-posts">
            <template v-for="(post, index) of posts" :key="post.path">
                <hr v-if="index > 0" />
                <a :href="post.path" class="post-card">
                    <img v-bind="post.image" class="card-img-left" :alt="post.title" />
                    <div class="card-body">
                        <div class="card-details">
                            <span class="card-category">{{ post.category }}</span>
                            <span class="card-date">{{
                                dateTimeFormat.format(new Date(post.date))
                            }}</span>
                        </div>
                        <p class="card-title">{{ post.title }}</p>
                    </div>
                </a>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
    export interface BlogPost {
        path: string
        image?: {
            src: string
        }
        title: string
        date: string
        category?: string
        plugins?: string[]
    }

    const props = defineProps<{
        posts: BlogPost[]
        title: string
        headingId?: string
    }>()

    const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
        dateStyle: "long",
    })
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    h2 {
        font-size: 1.25rem;
        padding: 0;
        font-weight: 600;
        margin-bottom: 1.5rem;
    }

    .list-of-posts {
        hr {
            width: 100%;
            border: none;
            border-top: 1px solid var(--kestra-io-token-color-border-secondary);
            margin: 0;
        }

        .post-card {
            display: flex;
            gap: 1rem;
            align-items: start;
            padding: 0.5rem 0;

            &:hover {
                background-image: radial-gradient(circle, rgba($primary, 0.3) 0%, #13172500 30%);
                background-position: -280px center;
                background-repeat: no-repeat;
            }

            .card-img-left {
                width: 125px;
                height: 70px;
                object-fit: cover;
                border-radius: 0.25rem;
                border: 1px solid $black-3;
            }

            .card-body {
                display: flex;
                flex-direction: column;

                .card-details {
                    font-size: $font-size-xs;

                    .card-category {
                        color: $purple-36;
                        margin-right: 1rem;
                    }

                    .card-date {
                        color: $white-3;
                    }
                }

                .card-title {
                    font-size: $font-size-sm;
                    font-weight: normal;
                    margin: 0;
                }
            }
        }
    }
</style>