<template>
    <div class="search-bar">
        <Magnify />
        <input
            type="text"
            placeholder="Search"
            v-model="searchQueryModel"
        >

        <Close
            v-if="searchQueryModel"
            @click="clearSearch"
        />

        <div class="ai-wrapper">
            <span class="or-text">or</span>
            <div class="ai-button-inside">
                <button
                    class="btn btn-sm btn-primary"
                    title="Ask Kestra AI"
                    data-bs-toggle="modal"
                    data-bs-target="#search-ai-modal"
                >
                    <img
                        :src="KSAIImg.src"
                        alt="Kestra AI"
                        width="30"
                        height="30"
                    />
                    <span>Ask AI</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, watch } from "vue"
    import { navigate } from "astro:transitions/client"
    import Magnify from "vue-material-design-icons/Magnify.vue"
    import Close from "vue-material-design-icons/Close.vue"
    import KSAIImg from "../docs/assets/ks-ai.svg"

    const props = defineProps<{
        q?: string
    }>()

    const searchQueryModel = ref(props.q ?? "")

    watch(
        () => props.q,
        (newVal) => {
            searchQueryModel.value = newVal ?? ""
        },
    )

    const clearSearch = () => {
        searchQueryModel.value = ""
    }

    const executeSearch = (query: string) => {
        if (typeof window === "undefined") {
            return
        }

        const url = new URL(window.location.href)

        if (query) {
            url.searchParams.set("q", query)
        } else {
            url.searchParams.delete("q")
        }

        url.searchParams.set("page", "1")

        const target = `${url.pathname}${url.search}`
        const current = `${window.location.pathname}${window.location.search}`

        if (target !== current) {
            navigate(target)
        }
    }

    let timeout: ReturnType<typeof setTimeout>
    watch(searchQueryModel, (value) => {
        if (timeout) {
            clearTimeout(timeout)
        }

        timeout = setTimeout(() => {
            executeSearch(value)
        }, 500)
    })
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .search-bar {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 0.25rem 0.35rem 0.25rem 1rem;
        background: var(--ks-background-input);
        border: 1px solid var(--ks-border-secondary);
        border-radius: $border-radius-lg;

        @include media-breakpoint-up(lg) {
            max-width: 612px;
        }

        .magnify-icon {
            color: var(--ks-content-tertiary);
            font-size: $font-size-lg;
            flex-shrink: 0;
            margin-top: -0.25rem;
        }

        input {
            flex: 1;
            height: 100%;
            background: transparent;
            border: none;
            outline: none;
            color: var(--ks-content-primary);
            font-size: $font-size-md;
            padding: 0 0.5rem;
            min-width: 0;

            &::placeholder {
                color: var(--ks-content-tertiary);
            }
        }

        .close-icon {
            color: var(--ks-content-tertiary);
            font-size: $font-size-md;
            cursor: pointer;
            flex-shrink: 0;
            margin: 0 0.25rem;

            &:hover {
                color: var(--ks-content-primary);
            }
        }

        .ai-wrapper {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            flex-shrink: 0;

            @include media-breakpoint-down(md) {
                gap: 0.25rem;

                .btn {
                    padding: 0.25rem 0.5rem;
                    font-size: 0.75rem;

                    span {
                        display: inline;
                    }
                }
            }

            .or-text {
                font-size: $font-size-sm;
                color: var(--ks-content-tertiary);
            }
        }
    }
</style>
