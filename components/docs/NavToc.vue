<template>
    <div id="nav-toc-global" class="bd-toc position-relative d-lg-flex justify-content-end">
        <div>
            <template v-if="generated.length > 0" class="bd-contents-list">
                <button
                    class="btn d-lg-none"
                    :class="tableOfContentsExpanded = !tableOfContentsExpanded ? '' : 'collapsed'"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#tocContents"
                    :aria-expanded="tableOfContentsExpanded"
                    aria-controls="tocContents"
                    @click="tableOfContentsExpanded = !tableOfContentsExpanded"
                >
                    Table of Contents
                    <ChevronUp v-if="tableOfContentsExpanded"/>
                    <ChevronDown v-else/>
                </button>

                <div class="collapse bd-toc-collapse" id="tocContents">
                    <slot name="header"></slot>
                    <strong class="d-none d-lg-block h6 my-2">Table of Contents</strong>
                    <nav id="nav-toc">
                        <ul class="ps-0 pt-2 pt-lg-0">
                            <template v-for="item in generated" >
                                <li v-if="item.depth > 1 && item.depth < 6" @click="closeToc" :class="{'mt-3': item.depth === 2}">
                                    <a :href="'#' + item.id" :class="'depth-' + item.depth">{{ item.text }}</a>
                                </li>
                            </template>
                        </ul>
                    </nav>
                </div>
            </template>

            <div class="d-none d-lg-block pt-4 bd-social-list">
                <CommonSocialsList :page="page" />
            </div>
        </div>
    </div>
</template>

<script setup>
    import ChevronUp from "vue-material-design-icons/ChevronUp.vue";
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue";
</script>

<script>
    export default {
        props: {
            page: {
                type: Object,
                required: true
            },
        },
        data() {
            return {
                tableOfContentsExpanded: false
            }
        },
        computed: {
            generated() {
                const recursive = (links) => {
                    const result = [];

                    for (const item of links) {
                        result.push(item);

                        if (item.children) {
                            result.push(...recursive(item.children));
                        }
                    }

                    return result;
                }

                return recursive(this.page.body.toc.links);
            }
        },
        methods: {
            closeToc() {
                this.tableOfContentsExpanded = false;
                document.getElementById('tocContents').classList.remove("show");
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .bd-toc {
        transition: all ease 0.2s;
        transform: translateX(0);
        > div {

            @include media-breakpoint-up(lg) {
                max-width: 308px;
                width: 100%;
                height: 100%;
                border-left: 1px solid $black-6;

            }
        }
        @include media-breakpoint-up(lg) {
            position: sticky;
            top: 0;
            right: 0;
            z-index: 2;
        }

        > .btn.d-lg-none {
            color: $white;
            font-weight: 900;
            font-size: $font-size-sm;
            background-color: $black-4;
        }

        nav {
            padding-bottom: calc($spacer * 1.165);
            border-bottom: 1px solid $black-6;
            @include font-size(.875rem);
            ul {
                margin-bottom: 0;
                list-style: none;
                li {
                    a {
                        border-left: .125rem solid var(--bs-gray-200);
                        padding-left: 0.75rem;
                        color: $white-1;
                        font-weight: 300;

                        @for $i from 2 through 6 {
                            &.depth-#{$i} {
                                padding-left: calc(0.5rem * ($i - 2) +  2rem);
                            }
                        }

                        &:hover,
                        &.active {
                            color: $purple;
                            font-weight: 500;
                            border-left-color: $purple;
                        }
                    }
                }
            }

            a {
                display: block;
                padding: .125rem .75rem;
                color: inherit;
                text-decoration: none;
                color: var(--bs-gray-700);

                code {
                    font: inherit;
                }
            }
        }

        .h6 {
            color: $white-1;
            font-size: $font-size-sm;
            line-height: 1.875rem;
            font-weight: 600;
        }

        hr {
            border-color: var(--bs-gray-600);
        }
    }

    .btn {
        border: 1px solid $black-6;
        border-radius: 8px;
        text-align: center;
        width: 100%;
        display: inline-block;
        background: $black-4;
        color: var(--bs-gray-500);
        font-size: $font-size-sm;
        &.collapsed {
            border-radius: 8px 8px 0 0;
        }

        &:hover,
        &:focus,
        &:active,
        &[aria-expanded="true"] {
            background: $black-4;
            color: $white;
            font-size: 16px;
        }
    }

    .bd-toc-collapse {
        strong {
            margin-left: calc($spacer * 2);
        }
        @include media-breakpoint-down(lg) {
            nav {
                padding-bottom: $spacer;
                @include border-radius(var(--bs-border-radius));
            }
        }

        @include media-breakpoint-up(lg) {
            display: block !important; // stylelint-disable-line declaration-no-important
        }
    }
    .bd-social-list, .bd-toc-collapse {
        background-color: $black-4;

        @include media-breakpoint-down(lg) {
            border-top-width: 0 !important;
            border: 1px solid $black-6;
            border-radius: 0 0 8px 8px;
        }
        ul, :deep(ul) {
            li {
                a {
                    border-left: 0 !important;

                    &:hover {
                        color: $purple-36 !important;
                        border-left: 1px solid $purple-36 !important;
                    }
                }
            }
        }
    }
</style>