<template>
    <div class="token-search">
        <div class="search-bar" :class="{ 'focus-ring': isFocused }">
            <Magnify class="magnify-icon" />

            <div class="chips">
                <span
                    v-for="tag in tagChips"
                    :key="`tag-${tag}`"
                    class="chip chip-category"
                >
                    {{ tag }}
                    <button
                        type="button"
                        class="chip-remove"
                        :aria-label="`Remove ${tag} filter`"
                        @click="removeTagChip(tag)"
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
                <span v-if="qChip" class="chip chip-q">
                    “{{ qChip }}”
                    <button
                        type="button"
                        class="chip-remove"
                        :aria-label="`Remove the ${qChip} keyword`"
                        @click="removeQChip"
                    >
                        <Close />
                    </button>
                </span>
            </div>

            <input
                ref="searchInput"
                type="text"
                :placeholder="
                    tagChips.length || toolChips.length || qChip
                        ? ''
                        : 'Search blueprints by keyword, plugin, or category...'
                "
                v-model="inputText"
                @focus="isFocused = true"
                @blur="onBlur"
                @keydown.down.prevent="moveHighlight(1)"
                @keydown.up.prevent="moveHighlight(-1)"
                @keydown.enter.prevent="onEnter"
                @keydown.tab="onTab"
                @keydown.backspace="onBackspace"
            />

            <Close
                v-if="inputText"
                class="close-icon"
                @click="inputText = ''"
            />

        </div>

        <div v-if="isFocused && suggestions.length > 0" class="suggestions">
            <div class="suggestions-group" v-if="matchingCategories.length">
                <span class="suggestions-label">Categories</span>
                <button
                    v-for="(name, idx) in matchingCategories"
                    :key="`cat-${name}`"
                    type="button"
                    class="suggestion-item"
                    :class="{ highlighted: highlightIndex === idx }"
                    @mousedown.prevent="selectTagChip(name)"
                >
                    <TagIcon :tag="name" />
                    {{ name }}
                </button>
            </div>
            <div class="suggestions-group" v-if="matchingCorePlugins.length">
                <span class="suggestions-label">Core plugins</span>
                <button
                    v-for="(tool, idx) in matchingCorePlugins"
                    :key="`core-${tool.name}`"
                    type="button"
                    class="suggestion-item"
                    :class="{
                        highlighted:
                            highlightIndex ===
                            matchingCategories.length + idx,
                    }"
                    @mousedown.prevent="selectTool(tool)"
                >
                    <TaskIcon :cls="tool.pluginClass" />
                    {{ tool.name }}
                </button>
            </div>
            <div class="suggestions-group" v-if="matchingTools.length">
                <span class="suggestions-label">Plugins</span>
                <button
                    v-for="(tool, idx) in matchingTools"
                    :key="`tool-${tool.name}`"
                    type="button"
                    class="suggestion-item"
                    :class="{
                        highlighted:
                            highlightIndex ===
                            matchingCategories.length +
                                matchingCorePlugins.length +
                                idx,
                    }"
                    @mousedown.prevent="selectTool(tool)"
                >
                    <ShieldCheckOutline
                        v-if="tool.pluginClass === 'io.kestra.plugin.ee'"
                        class="ee-suggestion-icon"
                    />
                    <TaskIcon v-else :cls="tool.pluginClass" />
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
    import ShieldCheckOutline from "vue-material-design-icons/ShieldCheckOutline.vue"
    import { CATEGORY_TILE_META } from "~/utils/blueprints/categoryMeta"

    const CATEGORY_SLUG_BY_NAME: Record<string, string> = Object.fromEntries(
        CATEGORY_TILE_META.filter((c) => c.name !== "Getting Started").map(
            (c) => [c.name, c.slug],
        ),
    )
    const CATEGORY_NAMES = Object.keys(CATEGORY_SLUG_BY_NAME)

    interface ToolOption {
        name: string
        pluginClass: string
        keywords?: string[]
    }

    const props = defineProps<{
        q?: string
        tagsSelected?: string
        tools?: string
        toolIndex: ToolOption[]
        coreToolIndex?: ToolOption[]
    }>()

    const inputText = ref("")
    const isFocused = ref(false)
    const highlightIndex = ref(-1)
    const searchInput = ref<HTMLInputElement | null>(null)

    const tagChips = computed<string[]>(() =>
        props.tagsSelected
            ? props.tagsSelected
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
            : [],
    )

    const toolChips = computed<string[]>(() =>
        props.tools
            ? props.tools
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
            : [],
    )

    const qChip = computed<string>(() => props.q?.trim() ?? "")

    const matchingCategories = computed<string[]>(() => {
        const q = inputText.value.trim().toLowerCase()
        if (!q) return []
        return CATEGORY_NAMES.filter(
            (name) =>
                name.toLowerCase().includes(q) &&
                !tagChips.value.includes(name),
        )
    })

    const matchingCorePlugins = computed<ToolOption[]>(() => {
        const q = inputText.value.trim().toLowerCase()
        if (!q || !props.coreToolIndex) return []
        const showAll = "core plugins".startsWith(q)
        return props.coreToolIndex
            .filter(
                (t) =>
                    (showAll || t.name.toLowerCase().includes(q)) &&
                    !toolChips.value.includes(t.name),
            )
            .slice(0, showAll ? props.coreToolIndex.length : 6)
    })

    const matchingTools = computed<ToolOption[]>(() => {
        const q = inputText.value.trim().toLowerCase()
        if (!q) return []
        return props.toolIndex
            .filter(
                (t) =>
                    (t.name.toLowerCase().includes(q) ||
                        t.keywords?.some((k) => k.startsWith(q))) &&
                    !toolChips.value.includes(t.name),
            )
            .slice(0, 6)
    })

    const suggestions = computed(() => [
        ...matchingCategories.value,
        ...matchingCorePlugins.value,
        ...matchingTools.value,
    ])

    async function selectTagChip(name: string) {
        inputText.value = ""
        await nextTick()
        searchInput.value?.focus()
        executeChange({ tagsSelected: name })
    }

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

    function selectByIndex(i: number) {
        const cats = matchingCategories.value.length
        const core = matchingCorePlugins.value.length
        if (i < cats) {
            selectTagChip(matchingCategories.value[i])
        } else if (i < cats + core) {
            selectTool(matchingCorePlugins.value[i - cats])
        } else {
            selectTool(matchingTools.value[i - cats - core])
        }
    }

    function onTab(e: KeyboardEvent) {
        if (!isFocused.value || suggestions.value.length === 0) return
        e.preventDefault()
        moveHighlight(e.shiftKey ? -1 : 1)
    }

    function onEnter() {
        if (highlightIndex.value >= 0) {
            selectByIndex(highlightIndex.value)
            return
        }

        const typed = inputText.value.trim()
        if (!typed) return
        const typedLower = typed.toLowerCase()

        if (
            [...tagChips.value, ...toolChips.value].some(
                (c) => c.toLowerCase() === typedLower,
            )
        ) {
            inputText.value = ""
            return
        }

        const cat = CATEGORY_NAMES.find(
            (name) => name.toLowerCase() === typedLower,
        )
        if (cat) {
            selectTagChip(cat)
            return
        }

        const tool = [
            ...props.toolIndex,
            ...(props.coreToolIndex ?? []),
        ].find((t) => t.name.toLowerCase() === typedLower)
        if (tool) {
            selectTool(tool)
            return
        }

        executeChange({ q: typed })
    }

    function onBackspace() {
        if (inputText.value.length > 0) return
        if (qChip.value) {
            removeQChip()
        } else if (toolChips.value.length > 0) {
            removeToolChip(toolChips.value[toolChips.value.length - 1])
        } else if (tagChips.value.length > 0) {
            removeTagChip(tagChips.value[tagChips.value.length - 1])
        }
    }

    function onBlur() {
        window.setTimeout(() => {
            isFocused.value = false
        }, 150)
    }

    async function selectTool(tool: ToolOption) {
        inputText.value = ""
        await nextTick()
        searchInput.value?.focus()
        const absorbsQ =
            qChip.value.toLowerCase() === tool.name.toLowerCase()
        executeChange({
            tools: [...toolChips.value, tool.name],
            ...(absorbsQ ? { q: "" } : {}),
        })
    }

    function removeTagChip(name: string) {
        inputText.value = ""
        executeChange({
            tagsSelected: tagChips.value.filter((t) => t !== name).join(","),
            q: "",
        })
    }

    function removeToolChip(name: string) {
        inputText.value = ""
        executeChange({
            tools: toolChips.value.filter((t) => t !== name),
            q: "",
        })
    }

    function removeQChip() {
        inputText.value = ""
        executeChange({ q: "" })
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
        const nextQ = change.q !== undefined ? change.q : qChip.value
        const nextTags =
            change.tagsSelected !== undefined
                ? change.tagsSelected
                : tagChips.value.join(",")
        const nextTools =
            change.tools !== undefined ? change.tools : toolChips.value

        const nextTagList = nextTags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        const soloSlug =
            !nextQ && nextTools.length === 0 && nextTagList.length === 1
                ? CATEGORY_SLUG_BY_NAME[nextTagList[0]]
                : undefined
        if (soloSlug) {
            navigate(`/blueprints/${soloSlug}`)
            return
        }

        url.pathname = "/blueprints"

        if (nextQ) url.searchParams.set("q", nextQ)
        else url.searchParams.delete("q")

        if (nextTags) url.searchParams.set("tags", nextTags)
        else url.searchParams.delete("tags")

        if (nextTools.length) url.searchParams.set("tools", nextTools.join(","))
        else url.searchParams.delete("tools")

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

            @include media-breakpoint-down(md) {
                min-width: 60px;
            }
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
        max-height: 26rem;
        overflow-y: auto;
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

        .ee-suggestion-icon {
            display: inline-flex;
            font-size: 1.125rem;
            color: var(--ks-content-link);
            flex-shrink: 0;
        }

        &:hover,
        &.highlighted {
            background: var(--ks-background-secondary);
        }
    }
</style>
