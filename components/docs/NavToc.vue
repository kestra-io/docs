<template>
    <div id="nav-toc-global" class="bd-toc scroller mb-4">

        <template v-if="generated.length > 0">
            <button
                class="btn d-lg-none"
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
                <strong class="d-none d-lg-block h6 my-2 ms-3">Table of Contents</strong>
                <nav id="nav-toc">
                    <ul>
                        <template v-for="item in generated" >
                            <li v-if="item.depth > 1 && item.depth < 6" @click="closeToc">
                                <a :href="'#' + item.id" :class="'depth-' + item.depth">{{ item.text }}</a>
                            </li>
                        </template>
                    </ul>
                </nav>
            </div>
        </template>

        <div class="d-none d-lg-block mt-4">
            <CommonSocialsList :page="page" />
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
        @include media-breakpoint-up(lg) {
            position: sticky;
            top: 5rem;
            left: 100%;
            z-index: 2;
            display: block !important;
            height: calc(100vh - 6rem);
            overflow-y: auto;
            overflow-x: hidden;
        }

        > .btn.d-lg-none {
            color: $black;
            font-weight: 900;
            font-size: $font-size-sm;
            background-color: $white;
            box-shadow: $box-shadow-sm;
        }

        nav {
            @include font-size(.875rem);
            ul {
                padding-left: .75rem;
                margin-bottom: 0;
                list-style: none;
                li {
                    a {
                        border-left: .125rem solid var(--bs-gray-200);
                        padding-left: 0.75rem;

                        @for $i from 2 through 6 {
                            &.depth-#{$i} {
                                padding-left: calc(.75rem * ($i - 2) +  0.75rem);
                            }
                        }

                        &:hover,
                        &.active {
                            color: var(--bs-primary);
                            font-weight: 500;
                            border-left-color: var(--bs-primary);
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
            color: var(--bs-gray-700);
            font-size: $font-size-sm;
            line-height: 1.875rem;
            font-weight: 600;
        }

        hr {
            border-color: var(--bs-gray-600);
        }
    }

    .btn {
        border: 1px solid var(--bs-border-color);
        text-align: center;
        width: 100%;
        display: inline-block;
        background: var(--bs-gray-100);
        color: var(--bs-gray-500);
        font-size: $font-size-sm;

        &:hover,
        &:focus,
        &:active,
        &[aria-expanded="true"] {
            background: var(--bs-gray-100);
            color: var(--bs-gray-500);
        }
    }

    .bd-toc-collapse {
        @include media-breakpoint-down(lg) {
            nav {
                padding: $spacer 0;
                border: 1px solid var(--bs-border-color);
                box-shadow: $box-shadow-sm;
                @include border-radius(var(--bs-border-radius));
            }
        }

        @include media-breakpoint-up(lg) {
            display: block !important; // stylelint-disable-line declaration-no-important
        }
    }
</style>