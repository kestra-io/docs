<template>
    <ul class="nav nav-tabs"
        role="tablist">
        <li
            v-for="[slug, category] in categories"
            :key="slug"
            class="nav-item"
            role="presentation"
        >
            <a class="nav-link" :class="{ active: currentCategory === category }" type="button"
                :href="`/tutorial-videos/${slug}`">
                {{ category }}
            </a>
        </li>
    </ul>
</template>

<script setup lang="ts">
    const props = withDefaults(
        defineProps<{
            categories: Map<string, string>
            currentCategory?: string
        }>(),
        {
            currentCategory: "All videos",
        },
    )
</script>

<style lang="scss" scoped>


    section {
        padding: $rem-4 $rem-1;
        position: relative;
        &::after {
            content: "";
            position: absolute;
            height: 12.5rem;
            width: 20%;
            top: 3%;
            left: 10%;
            z-index: 1;
            filter: blur(110px);
            background: linear-gradient(180deg, rgba(98, 24, 255, 0) 0%, #6117ff 100%);
            pointer-events: none;
        }
    }

    :deep(.modal-content) {
        background-color: var(--ks-background-secondary);
    }

    .modal-header {
        background-color: var(--ks-background-secondary);
        border-bottom-color: var(--ks-border-secondary);
        padding: 1rem 1rem 0;
        display: flex;
        justify-content: flex-end;
        button {
            background: transparent;
            border: none;
            color: var(--ks-content-primary);
            outline: var(--ks-border-secondary) dotted 1px;
        }
    }

    .modal-body {
        background-color: var(--ks-background-secondary);
        padding: 1rem;
    }

    .nav-tabs {
        margin-top: 1.5rem;
        flex-wrap: nowrap;
        overflow-x: auto;
        overflow-y: hidden;
        border-bottom: 1px solid var(--ks-border-secondary);
    }

    .nav-item {
        white-space: nowrap;
        .nav-link {
            color: var(--ks-content-primary);
            font-size: $font-size-md;
            font-weight: 400;
            border: none;
            &:focus-visible {
                box-shadow: none;
            }
            &.active {
                color: var(--ks-content-link);
                font-weight: 700;
                background-color: transparent;
                border-bottom: 2px solid var(--ks-content-link);
            }
        }
    }

    .nav::-webkit-scrollbar {
        display: none;
    }

    .nav {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    .content {
        @include media-breakpoint-up(md) {
            margin-right: $rem-1;
        }
        h1 {
            color: var(--ks-content-primary);
            margin-bottom: $rem-1;
        }
        h4 {
            color: var(--ks-content-secondary);
            margin-bottom: 2rem;
        }
    }

    .tutorials-container {
        padding: 2rem 0 1rem;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        iframe {
            border: 1px solid var(--ks-border-secondary);
            border-radius: calc($spacer * 0.5);
            width: 100%;
        }
        .info-block {
            display: flex;
            align-items: center;
            height: 100%;
            max-width: calc($spacer * 23.25);
            .content {
                display: flex;
                flex-direction: column;
                margin: 0 !important;
                p {
                    margin: 0;
                    font-size: $font-size-sm;
                    line-height: calc($spacer * 1.375);
                    font-weight: 400;
                    &.category {
                        color: var(--ks-content-link);
                    }
                    &.video-info,
                    &.canal-name {
                        color: var(--ks-content-tertiary);
                    }
                }
                h3.title {
                    font-size: $h3-font-size;
                    font-weight: 400;
                    line-height: calc($spacer * 2.375);
                    color: var(--ks-content-primary);
                    margin: 0;
                }
            }
            @include media-breakpoint-down(lg) {
                max-width: unset;
                .content h3.title {
                    line-height: unset;
                }
            }
        }

        .tutorials-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
        }
    }
</style>