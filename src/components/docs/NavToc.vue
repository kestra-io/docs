<template>
    <div
        id="nav-toc-global"
        class="bd-toc d-lg-flex justify-content-end"
    >
        <div>
            <MarkdownActionsMenu
                v-if="markdownBody && pagePath"
                :markdown-body="markdownBody"
                :page-path="pagePath"
                :page-title="pageTitle"
                :page-url="pageUrl"
                :edit-url="editUrl"
                :stem="stem"
                :extension="extension"
                :exclude-actions="excludeActions"
            />

            <template v-if="links?.length" class="bd-contents-list">
                <button
                    class="btn toc-toggle d-lg-none"
                    :class="{ collapsed: !tableOfContentsExpanded }"
                    type="button"
                    :aria-expanded="tableOfContentsExpanded"
                    aria-controls="tocContents"
                    @click="tableOfContentsExpanded = !tableOfContentsExpanded"
                >
                    <span class="toc-label">Table of Contents</span>
                    <span class="toc-chevron" aria-hidden>
                        <ChevronUp class="chev-icon" v-if="tableOfContentsExpanded" />
                        <ChevronDown class="chev-icon" v-else />
                    </span>
                </button>

                <div
                    class="bd-toc-collapse"
                    :class="{ open: tableOfContentsExpanded }"
                    id="tocContents"
                >
                    <div class="bd-toc-collapse-inner" :inert="collapsed">
                    <slot name="header"></slot>
                    <strong class="d-none d-lg-block h6 mb-2">Table of Contents</strong>
                    <nav id="nav-toc">
                        <ul v-for="tableOfContent in links">
                            <li
                                v-if="
                                    (tableOfContent.depth ?? 0) > 1 &&
                                    (tableOfContent.depth ?? 0) < 6 &&
                                    tableOfContent.text
                                "
                                @click="closeToc"
                                class="table-content"
                            >
                                <a
                                    @click.prevent="menuNavigate"
                                    :href="`#${tableOfContent.id}`"
                                    :class="{
                                        [`depth-${tableOfContent.depth}`]: true,
                                        active: tableOfContent.id === activeLinkId
                                    }"
                                    >{{ tableOfContent.text }}</a
                                >
                            </li>
                            <ul v-if="tableOfContent?.children?.length">
                                <template v-for="item in tableOfContent?.children">
                                    <li
                                        v-if="(item.depth ?? 0) > 1 && (item.depth ?? 0) < 6"
                                        @click="closeToc"
                                    >
                                        <a
                                            @click.prevent="menuNavigate"
                                            :href="`#${item.id}`"
                                            :class="{
                                                [`depth-${item.depth}`]: true,
                                                active: item.id === activeLinkId
                                            }"
                                            >{{ item.text }}</a
                                        >
                                    </li>
                                </template>
                            </ul>
                        </ul>
                    </nav>
                    </div>
                </div>
            </template>

            <div class="d-none d-lg-block pt-2 bd-social-list">
                <SocialsList />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useTocCollapse } from "~/composables/useTocCollapse"
    import { useTocScrollSpy } from "~/composables/useTocScrollSpy"
    import type { TocLink } from "~/utils/plugins/types"
    import ChevronUp from "vue-material-design-icons/ChevronUp.vue"
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue"
    import SocialsList from "~/components/common/SocialsList.vue"
    import MarkdownActionsMenu from "~/components/docs/MarkdownActionsMenu.vue"
    import type { MarkdownActionId } from "~/utils/markdown-actions"

    const props = withDefaults(
        defineProps<{
            links?: TocLink[],
            extension?: string,
            stem?: string,
            editUrl?: string,
            capitalize?: boolean,
            class?: string,
            markdownBody?: string,
            pagePath?: string,
            pageTitle?: string,
            pageUrl?: string,
            excludeActions?: MarkdownActionId[],
        }>(),
        {
            links: () => [],
        }
    )

    const {
        expanded: tableOfContentsExpanded,
        collapsed,
        close: closeToc,
    } = useTocCollapse()

    const { activeId: activeLinkId, navigateTo } = useTocScrollSpy(
        () =>
            (props.links ?? []).flatMap((l) => [
                l.id,
                ...(l.children ?? []).map((c) => c.id),
            ]),
        { container: "#nav-toc" },
    )

    const menuNavigate = (e: Event) => {
        const id = (e.currentTarget as HTMLAnchorElement)
            .getAttribute("href")
            ?.substring(1)
        if (id) navigateTo(id)
    }
</script>

<style lang="scss" scoped>
    .bd-toc {
        @include media-breakpoint-down(lg) {
            margin: $rem-1 0;
            width: 100%;
            box-sizing: border-box;
        }
        @include media-breakpoint-up(lg) {
            padding: 2rem 0;
            max-height: 100%;
            min-width: 250px;
            z-index: 10;
        }
        &::-webkit-scrollbar {
            display: none;
        }
        > div {
            height: fit-content;
            @include media-breakpoint-up(lg) {
                position: sticky;
                top: calc(80px + var(--announce-height));
                width: 100%;
                overflow-x: hidden;
                overflow-y: auto;
            }
        }
        nav {
            font-size: 0.875rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid var(--ks-border-primary);
            position: relative;
            @include media-breakpoint-up(lg) {
                overflow-y: auto;
                max-height: 600px;
                overflow-x: hidden;
            }
            @include media-breakpoint-down(lg) {
                overflow: visible;
            }
            &::-webkit-scrollbar {
                width: 4px;
                height: 4px;
            }
            &::-webkit-scrollbar-track {
                background: transparent;
            }
            &::-webkit-scrollbar-thumb {
                border-radius: 5px;
                background: var(--ks-border-primary);
            }
            a {
                display: block;
                padding: 0 0.75rem;
                color: inherit;
                text-decoration: none;
                font-size: 12px;
                border-left: 1px solid transparent;
                code {
                    font: inherit;
                }
            }
            ul {
                list-style: none;
                padding-top: 0.5rem;
                padding-left: 0;
                margin-block: 0.3rem;
                @include media-breakpoint-up(lg) {
                    padding-top: 0;
                }
                li {
                    font-size: 0.875rem;
                    line-height: 1.5rem;
                }
                li a {
                    padding-left: 0.75rem;
                    color: var(--ks-content-tertiary);
                    font-weight: 500;
                    cursor: pointer;
                    scroll-margin: 3rem;
                    @for $i from 2 through 6 {
                        &.depth-#{$i} {
                            font-size: if($i == 2, 14px, if($i == 3, 13px, 12px));
                            padding-left: ($i - 2) * 1rem + 1.5rem;
                        }
                    }
                    &:hover,
                    &.active {
                        color: var(--ks-content-link);
                    }
                }
            }
            @for $i from 3 through 6 {
                .depth-#{$i}{
                    position: relative;
                    &:before{
                        display: block;
                        content: "";
                        position: absolute;
                        left: 1.5rem;
                        top: 0;
                        bottom: 0;
                        width: 1px;
                        background-color: var(--ks-border-primary);
                    }
                    &:hover:before{
                        background-color: var(--ks-content-link);
                    }
                }
            }
        }
        .h6 {
            color: var(--ks-content-primary);
            font-size: $font-size-sm;
            line-height: 1.875rem;
            font-weight: 600;
            padding-top: 0;
        }

        hr {
            border-color: var(--ks-gray-600);
        }
    }

    .btn {
        display: inline-block;
        width: 100%;
        padding: 0;
        border: 1px solid var(--ks-border-secondary);
        border-radius: 8px;
        background: var(--ks-background-body);
        color: var(--ks-content-secondary);
        font-size: $font-size-sm;
        text-align: center;
        &.collapsed {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        &:hover,
        &:focus,
        &:active,
        &[aria-expanded="true"] {
            background: var(--ks-background-body);
            color: var(--ks-content-primary);
            font-size: 16px;
        }
    }

    .toc-toggle[aria-expanded="true"] {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: var(--ks-content-primary);
        border-radius: 8px 8px 0 0;
    }

    // Height transition without JS: 0fr to 1fr on a single-row grid. The mobile
    // border hangs off `.open` so a closed panel draws no hairline.
    .bd-toc-collapse {
        display: grid;
        grid-template-rows: 0fr;
        transition: grid-template-rows 0.25s ease;
        border-radius: 8px;
        strong {
            margin-left: 1.5rem;
        }
        .bd-toc-collapse-inner {
            overflow: hidden;
            min-height: 0;
        }
        @include media-breakpoint-down(lg) {
            &.open .bd-toc-collapse-inner {
                border: 1px solid var(--ks-border-secondary);
                border-top-width: 0;
                border-radius: 0 0 8px 8px;
            }
            nav {
                padding-bottom: $spacer;
                border-radius: inherit;
            }
        }
        @include media-breakpoint-up(lg) {
            // Above the breakpoint the panel is always open and never
            // animates, so the grid wrapper and its inner div drop out of
            // the box model entirely. Leaving them as boxes shifts the
            // sidebar ~8px (grid suppresses the margin collapse main relied
            // on) and changes where its max-height clips.
            display: contents;

            .bd-toc-collapse-inner {
                display: contents;
            }
        }
        &.open {
            grid-template-rows: 1fr;
            border-radius: 0 0 8px 8px;
        }
    }

    .bd-social-list {
        @include media-breakpoint-down(lg) {
            border-top-width: 0 !important;
            border: 1px solid var(--ks-border-secondary);
            border-radius: 0 0 8px 8px;
        }
        button:hover {
            color: var(--ks-content-color-highlight) !important;
        }
        ul,
        :deep(ul) {
            li a {
                font-weight: 500;
                &:hover {
                    color: var(--ks-content-color-highlight) !important;
                    border-left: 1px solid var(--ks-content-color-highlight) !important;
                }
            }
        }
    }
</style>