<template>
    <div class="slug">
        <span :class="{first: index === 0}" v-for="(item, index) in breadcrumb()"
              :key="item">
            <NuxtLink :href="breadcrumbLinkExist(item, index) ? breadcrumbLink(item, index) : ''" class="link">
                {{ item }}
            </NuxtLink>
        </span>
    </div>
</template>

<script>
    export default {
        name: "breadcrumb",
        props: {
            slug: {
                type: String,
                required: true
            },
            pageList: {
                type: Array,
                required: true
            }
        },
        methods: {
            breadcrumb() {
                return [...new Set(this.slug.split("/")
                    .filter(r => r !== ""))
                ]
            },
            breadcrumbLink(item, index) {
                return "/" + this.breadcrumb().slice(0, index + 1).join("/")
            },
            breadcrumbLinkExist(item, index) {
                return this.pageList.includes(this.breadcrumbLink(item, index))
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .slug {
        white-space: pre-wrap;
        width: 100%;
        font-size: $font-size-sm;
        color: $primary;
        font-family: var(--bs-font-monospace);
        font-weight: 600;
        margin: 0 auto;
        max-width: 700px;
        @include media-breakpoint-down(lg) {
            a {
                font-size: 0.813rem
            }
        }

        @include media-breakpoint-up(xxl) {
            margin-left: 7.2rem;
        }

        @include media-breakpoint-down(sm) {
            font-size: 0.55rem;
        }

        span {
            &:before {
                content: '>';
                margin-right: 0.25rem;
                margin-left: 0.25rem;
            }

            &:first-child {
                &:before {
                    display: none;
                }
            }
        }

        .breadcrumb-item + .breadcrumb-item::before {
            color: $primary;
        }
    }
</style>