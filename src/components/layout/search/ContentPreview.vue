<template>
    <div class="content-preview">
        <template v-if="page">
            <h1 v-if="showTitle" class="content-preview-title">
                {{ page.title }}
            </h1>
            <div ref="clip" class="content-preview-clip" :class="{ truncated }">
                <div ref="content" class="bd-content" v-html="page.html" />
            </div>
            <a
                v-if="truncated"
                class="content-preview-more"
                :href="`/${section}/${id}`"
                >Continue reading →</a
            >
        </template>
        <p v-else-if="failed" class="content-preview-failed">
            This page could not be loaded.
        </p>
        <div v-else class="content-preview-loading">
            <span v-for="n in 6" :key="n" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useResizeObserver } from "@vueuse/core"
    import { ref, useTemplateRef } from "vue"
    import { useDeferredLoad } from "~/composables/useDeferredLoad"
    import {
        isContentPreviewLoaded,
        loadContentPreview,
        type PreviewSection,
    } from "~/utils/search/contentPreview"

    const props = withDefaults(
        defineProps<{
            section: PreviewSection
            id: string
            showTitle?: boolean
        }>(),
        { showTitle: true },
    )

    const { value: page, failed } = useDeferredLoad(
        () => loadContentPreview(props.section, props.id),
        () => isContentPreviewLoaded(props.section, props.id),
    )

    // The preview fills what is left of the pane and stops there.
    const clip = useTemplateRef<HTMLElement>("clip")
    const content = useTemplateRef<HTMLElement>("content")
    const truncated = ref(false)
    useResizeObserver([clip, content], () => {
        truncated.value = Boolean(
            clip.value &&
            content.value &&
            content.value.offsetHeight > clip.value.clientHeight,
        )
    })
</script>

<style scoped lang="scss">
    .content-preview {
        display: flex;
        flex-direction: column;
        flex: 1 1 0;
        min-height: 10rem;
        color: var(--ks-content-primary);

        .content-preview-title {
            font-size: 26px;
            line-height: 32px;
            letter-spacing: -0.01em;
            margin: 4px 0 20px;
            text-wrap: balance;
            text-box: trim-both cap alphabetic;
        }

        .content-preview-clip {
            flex: 1 1 0;
            min-height: 0;
            overflow: hidden;

            &.truncated {
                mask-image: linear-gradient(
                    to bottom,
                    #000 calc(100% - 96px),
                    transparent
                );
            }
        }

        .content-preview-more {
            align-self: flex-start;
            margin-top: 4px;
            font-weight: 600;
            color: var(--ks-content-link);
        }

        :deep(.doc-video) {
            position: relative;
            display: block;
            margin: 1rem 0;
            border-radius: 10px;
            overflow: hidden;
            border: 1px solid var(--ks-border-primary);

            img {
                display: block;
                width: 100%;
                aspect-ratio: 16 / 9;
                object-fit: cover;
            }

            &:hover .doc-video-play {
                transform: translate(-50%, -50%) scale(1.06);
            }
        }

        :deep(.doc-video-play) {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 60px;
            height: 42px;
            border-radius: 12px;
            background: rgba(20, 20, 30, 0.82);
            transform: translate(-50%, -50%);
            transition: transform 0.15s ease;

            &::after {
                content: "";
                position: absolute;
                top: 50%;
                left: 54%;
                transform: translate(-50%, -50%);
                border-style: solid;
                border-width: 9px 0 9px 15px;
                border-color: transparent transparent transparent $white;
            }
        }

        :deep(.doc-embed) {
            display: block;
            margin: 1rem 0;
            padding: 0.75rem 1rem;
            border: 1px solid var(--ks-border-primary);
            border-radius: 10px;
            color: var(--ks-content-link);
        }
    }

    .content-preview-loading {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;

        span {
            height: 0.8rem;
            border-radius: 4px;
            background: var(--ks-background-secondary);

            &:first-child {
                height: 1.4rem;
                width: 70%;
            }

            &:nth-child(3n) {
                width: 85%;
            }
        }
    }

    .content-preview-failed {
        color: var(--ks-content-secondary);
    }
</style>

<style lang="scss">
    // #search-modal outranks the global docs styles from markdown.scss.
    #search-modal .content-preview .bd-content {
        line-height: 24px;

        p {
            margin-bottom: 12px;
        }

        :is(p, li) {
            text-wrap: pretty;
        }

        ul,
        ol {
            margin-bottom: 12px;
            padding-left: 24px;
        }

        li + li {
            margin-top: 4px;
        }

        li > :is(ul, ol) {
            margin: 4px 0 0;
        }

        > h2,
        h2.ks-title {
            font-size: 22px;
            line-height: 28px;
            margin-block: 32px 12px;
        }

        > h3 {
            font-size: 18px;
            line-height: 24px;
            margin-block: 24px 8px;
        }

        > :is(h4, h5, h6) {
            font-size: 16px;
            line-height: 24px;
            margin-block: 24px 8px;
        }

        :is(h2, h3, h4) {
            text-wrap: balance;
        }

        > :is(h2, h3, h4, h5, h6) + *,
        > :first-child,
        > .doc-collapse + * {
            margin-top: 0;
        }

        .expressive-code {
            margin-bottom: 16px;
            --ec-codeFontSize: 13px;
            --ec-codeLineHt: 20px;
            --ec-codePadBlk: 12px;
            --ec-codePadInl: 16px;

            pre {
                font-size: 13px;
            }
        }

        code:not(pre code) {
            font-size: 13px;
            line-height: 1;
        }

        > :where(
            .expressive-code,
            .doc-alert,
            .doc-video,
            .doc-embed,
            .ks-card-grid,
            table,
            blockquote
        ) {
            margin-block: 16px;
        }

        .doc-alert {
            padding: 12px 16px 12px 48px;

            &::before {
                left: 12px;
                top: 10px;
            }

            p {
                line-height: 20px;
            }

            p:first-child {
                margin-bottom: 4px;
            }

            .expressive-code {
                margin: 8px 0 0;
            }
        }

        .doc-collapse {
            margin-bottom: 12px;

            summary {
                margin-bottom: 0;
            }

            &[open] summary {
                margin-bottom: 8px;
            }
        }

        .ks-card-grid {
            grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
            gap: 8px;

            .ks-card {
                padding: 16px 8px 12px 16px;
                gap: 4px 8px;
                box-shadow: none;
            }

            .ks-card .ks-card-title {
                margin: 0;
                font-size: 15px;
                line-height: 20px;
            }

            .ks-card .ks-card-text,
            .ks-card .ks-card-text p {
                font-size: 13.5px;
                line-height: 20px;
                margin-bottom: 0;
            }
        }

        .docs-button-row,
        .support-links-row {
            margin-bottom: 16px;
        }

        .resource-cta {
            margin: 24px 0;
            padding: 16px;
        }
    }
</style>
