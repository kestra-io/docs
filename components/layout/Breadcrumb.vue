<template>
    <div class="slug">
        <span :class="{ first: index === 0 }" v-for="(item, index) in breadcrumb()" :key="item">
            <NuxtLink :href="breadcrumbLinkExist(item, index) ? breadcrumbLink(item, index) : ''" class="link">
                {{ pageNames[item] ? pageNames[item] : item }}
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
        },
        pageNames: {
            type: Object,
        },
        pageTitle: {
            type: String,
        }
    },
    methods: {
        breadcrumb() {
            let breadcrumbs = [...new Set(this.slug.split("/")
                .filter(r => r !== ""))].slice(0, -1);
            return breadcrumbs.length > 0 ? breadcrumbs : ['docs']
        },
        breadcrumbLink(item, index) {
            return "/" + this.breadcrumb().slice(0, index + 1).join("/")
        },
        breadcrumbLinkExist(item, index) {
            return this.pageList?.includes(this.breadcrumbLink(item, index))
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../assets/styles/variable";

.slug {
    white-space: pre-wrap;
    width: 100%;
    max-width: calc($spacer * 43.7);
    font-size: $font-size-sm;
    font-family: $font-family-sans-serif;
    font-weight: 400;
    margin: 0 auto;

    @include media-breakpoint-down(lg) {
        a {
            font-size: 0.813rem
        }
    }


    @include media-breakpoint-down(sm) {
        font-size: 0.55rem;
    }

    @media only screen and (min-width: 1920px) {
        max-width: 71.25rem;
    }

    span {
        &:after {
            content: '/';
            margin-right: 0.25rem;
            margin-left: 0.25rem;
            color: #CDD5EF !important;
        }

        a {
            color: #CDD5EF !important;

        }
    }

    .link{
        text-transform: capitalize;
    }
}
</style>