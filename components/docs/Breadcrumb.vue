<template>
    <div class="slug">
        <span :class="{first: index === 0}" v-for="(item, index) in breadcrumb()"
              :key="item">
            <NuxtLink :href="breadcrumbLink(item, index)">
                {{ item.toUpperCase() }}
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
        margin-bottom: calc($spacer / 3);
        font-weight: bold;

        @include media-breakpoint-up(xxl) {
            margin-left: 3.5rem;
        }

        @include media-breakpoint-down(sm) {
            font-size: 0.55rem;
        }

        span {
            margin-left: 0.25rem;

            &:before {
                content: '>';
                margin-right: 0.25rem;

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