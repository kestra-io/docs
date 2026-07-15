<template>
    <div class="token-search">
        <div class="search-bar" :class="{ 'focus-ring': isFocused }">
            <Magnify class="magnify-icon" />

            <div class="chips">
                <span v-if="categoryChip" class="chip chip-category">
                    {{ categoryChip.name }}
                    <button
                        type="button"
                        class="chip-remove"
                        aria-label="Remove category filter"
                        @click="removeCategoryChip"
                    >
                        <Close />
                    </button>
                </span>
                <span
                    v-for="tool in toolChips"
                    :key="tool"
                    class="chip chip-tool"
                >
                    {{ tool }}
                    <button
                        type="button"
                        class="chip-remove"
                        :aria-label="`Remove ${tool} filter`"
                        @click="removeToolChip(tool)"
                    >
                        <Close />
                    </button>
                </span>
            </div>

            <input
                ref="searchInput"
                type="text"
                :placeholder="
                    categoryChip || toolChips.length
                        ? 'Add more apps, roles, usecases...'
                        : 'Search apps, categories, usecases...'
                "
                v-model="inputText"
                @focus="isFocused = true"
                @blur="onBlur"
                @keydown.down.prevent="moveHighlight(1)"
                @keydown.up.prevent="moveHighlight(-1)"
                @keydown.enter.prevent="onEnter"
                @keydown.backspace="onBackspace"
            />

            <Close
                v-if="inputText"
                class="close-icon"
                @click="inputText = ''"
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

        <div v-if="isFocused && suggestions.length > 0" class="suggestions">
            <div class="suggestions-group" v-if="matchingCategories.length">
                <span class="suggestions-label">Categories</span>
                <button
                    v-for="(cat, idx) in matchingCategories"
                    :key="`cat-${cat.name}`"
                    type="button"
                    class="suggestion-item"
                    :class="{ highlighted: highlightIndex === idx }"
                    @mousedown.prevent="selectCategory(cat)"
                >
                    <TagIcon :tag="cat.name" />
                    {{ cat.name }}
                </button>
            </div>
            <div class="suggestions-group" v-if="matchingTools.length">
                <span class="suggestions-label">Apps</span>
                <button
                    v-for="(tool, idx) in matchingTools"
                    :key="`tool-${tool.name}`"
                    type="button"
                    class="suggestion-item"
                    :class="{
                        highlighted:
                            highlightIndex === matchingCategories.length + idx,
                    }"
                    @mousedown.prevent="selectTool(tool)"
                >
                    <TaskIcon :cls="tool.pluginClass" />
                    {{ tool.name }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, watch, nextTick } from "vue"
    import { navigate } from "astro:transitions/client"
    import Magnify from "vue-material-design-icons/Magnify.vue"
    import Close from "vue-material-design-icons/Close.vue"
    import TaskIcon from "~/components/common/TaskIcon.vue"
    import TagIcon from "~/components/blueprints/TagIcon.vue"
    import KSAIImg from "../docs/assets/ks-ai.svg"

    interface CategoryOption {
        name: string
    }
    interface ToolOption {
        name: string
        pluginClass: string
    }

    const props = defineProps<{
        q?: string
        tagsSelected?: string
        tools?: string
        categories: CategoryOption[]
        toolIndex: ToolOption[]
    }>()

    const inputText = ref(props.q ?? "")
    const isFocused = ref(false)
    const highlightIndex = ref(-1)
    const searchInput = ref<HTMLInputElement | null>(null)

    const categoryChip = computed<CategoryOption | undefined>(() =>
        props.tagsSelected
            ? props.categories.find(
                  (c) =>
                      c.name.toLowerCase() ===
                      props.tagsSelected!.toLowerCase(),
              )
            : undefined,
    )

    const toolChips = computed<string[]>(() =>
        props.tools
            ? props.tools
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
            : [],
    )


    const matchingCategories = computed<CategoryOption[]>(() => {
        const q = inputText.value.trim().toLowerCase()
        if (!q) return []
        return props.categories
            .filter(
                (c) =>
                    c.name.toLowerCase().includes(q) &&
                    c.name !== categoryChip.value?.name,
            )
            .slice(0, 4)
    })

    const matchingTools = computed<ToolOption[]>(() => {
        const q = inputText.value.trim().toLowerCase()
        if (!q) return []
        return props.toolIndex
            .filter(
                (t) =>
                    t.name.toLowerCase().includes(q) &&
                    !toolChips.value.includes(t.name),
            )
            .slice(0, 6)
    })

    const suggestions = computed(() => [
        ...matchingCategories.value,
        ...matchingTools.value,
    ])

    watch(inputText, () => {
        highlightIndex.value = -1
    })

    function moveHighlight(delta: number) {
        if (suggestions.value.length === 0) return
        const max = suggestions.value.length - 1
        let next = highlightIndex.value + delta
        if (next < 0) next = max
        if (next > max) next = 0
        highlightIndex.value = next
    }

    function onEnter() {
        if (highlightIndex.value >= 0) {
            const cats = matchingCategories.value.length
            if (highlightIndex.value < cats) {
                selectCategory(matchingCategories.value[highlightIndex.value])
            } else {
                selectTool(matchingTools.value[highlightIndex.value - cats])
            }
            return
        }
        executeChange({ q: inputText.value })
    }

    function onBackspace() {
        if (inputText.value.length > 0) return
        if (toolChips.value.length > 0) {
            removeToolChip(toolChips.value[toolChips.value.length - 1])
        } else if (categoryChip.value) {
            removeCategoryChip()
        }
    }

    function onBlur() {
        window.setTimeout(() => {
            isFocused.value = false
        }, 150)
    }

    // Adding a chip consumes the typed text: the query becomes the chip, so
    // the free-text q is dropped from both the bar and the URL.
    async function selectCategory(cat: CategoryOption) {
        inputText.value = ""
        await nextTick()
        searchInput.value?.focus()
        executeChange({ tagsSelected: cat.name, q: "" })
    }

    async function selectTool(tool: ToolOption) {
        inputText.value = ""
        await nextTick()
        searchInput.value?.focus()
        executeChange({ tools: [...toolChips.value, tool.name], q: "" })
    }

    function removeCategoryChip() {
        executeChange({ tagsSelected: "" })
    }

    function removeToolChip(name: string) {
        executeChange({ tools: toolChips.value.filter((t) => t !== name) })
    }

    function executeChange(
        change: Partial<{
            q: string
            tagsSelected: string
            tools: string[]
        }>,
    ) {
        if (typeof window === "undefined") return

        const url = new URL(window.location.href)
        const nextQ = change.q !== undefined ? change.q : inputText.value
        const nextTags =
            change.tagsSelected !== undefined
                ? change.tagsSelected
                : (categoryChip.value?.name ?? "")
        const nextTools =
            change.tools !== undefined ? change.tools : toolChips.value

        // Chip changes always resolve on the main catalog page, which owns
        // tags/tools filtering (this bar also lives on /blueprints/<category>
        // pages, whose URLs don't take those params). Plain typing stays on
        // the current page so searching within a category keeps its scope.
        const isChipChange =
            change.tagsSelected !== undefined || change.tools !== undefined
        if (isChipChange) {
            url.pathname = "/blueprints"
        }

        if (nextQ) url.searchParams.set("q", nextQ)
        else url.searchParams.delete("q")

        // tags/tools params only exist on the main catalog page; a category
        // page encodes its category in the path instead.
        if (url.pathname === "/blueprints") {
            if (nextTags) url.searchParams.set("tags", nextTags)
            else url.searchParams.delete("tags")

            if (nextTools.length)
                url.searchParams.set("tools", nextTools.join(","))
            else url.searchParams.delete("tools")
        }

        url.searchParams.delete("page")

        navigate(url.pathname + url.search)
    }
</script>

<style lang="scss" scoped>
    .token-search {
        position: relative;
        width: 100%;

        @include media-breakpoint-up(lg) {
            max-width: 640px;
        }
    }

    .search-bar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        padding: 0.625rem 0.75rem 0.625rem 1.25rem;
        background: var(--ks-background-input);
        border: 1px solid var(--ks-border-secondary);
        border-radius: $border-radius-lg;
        transition: border-color 0.2s ease;

        &.focus-ring {
            border-color: var(--ks-border-active);
        }

        .magnify-icon {
            color: var(--ks-content-tertiary);
            font-size: 1.375rem;
            flex-shrink: 0;
        }

        .chips {
            display: flex;
            flex-wrap: wrap;
            gap: 0.375rem;
        }

        .chip {
            display: inline-flex;
            align-items: center;
            gap: 0.375rem;
            padding: 0.25rem 0.5rem 0.25rem 0.75rem;
            border-radius: 2rem;
            font-size: $font-size-sm;
            font-weight: 500;
            white-space: nowrap;
            line-height: 1;
            border: 1px solid var(--ks-border-secondary);
            background: transparent;
            color: var(--ks-content-primary);
        }

        .chip-remove {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            border: none;
            background: transparent;
            color: inherit;
            opacity: 0.7;
            cursor: pointer;

            &:hover {
                opacity: 1;
            }
        }

        input {
            flex: 1;
            min-width: 120px;
            height: 100%;
            background: transparent;
            border: none;
            outline: none;
            color: var(--ks-content-primary);
            font-size: $font-size-md;
            padding: 0 0.25rem;

            &::placeholder {
                color: var(--ks-content-tertiary);
            }
        }

        .close-icon {
            color: var(--ks-content-tertiary);
            font-size: $font-size-md;
            cursor: pointer;
            flex-shrink: 0;

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
                }
            }

            .or-text {
                font-size: $font-size-sm;
                color: var(--ks-content-tertiary);
            }
        }
    }

    .suggestions {
        position: absolute;
        top: calc(100% + 0.5rem);
        left: 0;
        right: 0;
        z-index: 20;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding: 0.75rem;
        background: var(--ks-background-primary);
        border: 1px solid var(--ks-border-secondary);
        border-radius: $border-radius-lg;
        box-shadow: 2px 6px 20px 0 var(--ks-shadows-light);
    }

    .suggestions-group {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .suggestions-label {
        font-size: $font-size-xs;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        color: var(--ks-content-tertiary);
        padding: 0 0.5rem;
    }

    .suggestion-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        border: none;
        border-radius: 8px;
        background: transparent;
        color: var(--ks-content-primary);
        font-size: $font-size-sm;
        text-align: left;
        cursor: pointer;

        :deep(.icon-wrapper) {
            width: 1.25rem;
            height: 1.25rem;
        }

        &:hover,
        &.highlighted {
            background: var(--ks-background-secondary);
        }
    }
</style>
