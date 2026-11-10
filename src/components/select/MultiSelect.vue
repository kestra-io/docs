<template>
    <div
        ref="multiSelectRef"
        class="multi-select"
        :class="{ focused: showDropdown }"
        @click="showDropdown = !showDropdown"
    >
        <div class="selected-items">
            <span v-if="!selected.length">Filter by {{ name }}</span>
            <div v-for="item in selected" :key="item" class="selected-item">
                <p>{{ item }}</p>
                <Close @click.stop="toggleItem(item)" />
            </div>
            <ChevronDown />
        </div>
    </div>

    <div class="custom-select" ref="dropdownRef">
        <ul v-if="showDropdown" class="dropdown-options">
            <li
                v-for="option in options"
                :key="option"
                :class="{ selected: selected.includes(option) }"
                @click="toggleItem(option)"
            >
                {{ option }}
            </li>
        </ul>
    </div>
</template>

<script setup>
    import { ref, onMounted, onUnmounted } from "vue"
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue"
    import Close from "vue-material-design-icons/Close.vue"

    defineProps({
        name: {
            type: String,
            default: "",
        },
        options: {
            type: Array,
            default: () => [],
        },
    })

    const selected = defineModel({ type: Array, default: () => [] })

    const showDropdown = ref(false)
    const multiSelectRef = ref(null)
    const dropdownRef = ref(null)

    const toggleItem = (option) => {
        selected.value = selected.value.includes(option)
            ? selected.value.filter((item) => item !== option)
            : [...selected.value, option]
    }

    const handleClickOutside = (event) => {
        if (
            !multiSelectRef.value?.contains(event.target) &&
            !dropdownRef.value?.contains(event.target)
        ) {
            showDropdown.value = false
        }
    }

    onMounted(() => {
        document.addEventListener("mousedown", handleClickOutside)
    })

    onUnmounted(() => {
        document.removeEventListener("mousedown", handleClickOutside)
    })
</script>

<style lang="scss" scoped>
    .multi-select {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        min-height: 50px;
        padding: 4px 48px 4px 16px;
        border-radius: 4px;
        border: 1px solid var(--ks-border-secondary);
        background-color: var(--ks-background-input);
        font-size: $font-size-sm;
        line-height: 20px;
        color: var(--ks-content-primary);
        cursor: pointer;

        &.focused {
            border-color: var(--ks-border-active);
        }

        .selected-items {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 4px;
            min-width: 0;
        }

        :deep(.material-design-icon) {
            position: absolute;
            top: 50%;
            right: 16px;
            transform: translateY(-50%);
            .material-design-icon__svg {
                bottom: 0;
                fill: var(--ks-content-primary);
            }
        }

        .selected-item {
            display: flex;
            align-items: center;
            gap: 4px;
            max-width: 100%;
            padding: 2px 8px;
            border-radius: 40px;
            background-color: var(--ks-background-tertiary);
            p {
                margin: 0;
                font-size: $font-size-xs;
                line-height: 16px;
                font-weight: 600;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                color: var(--ks-content-secondary);
            }
            :deep(.material-design-icon) {
                position: unset;
                flex-shrink: 0;
                transform: none;
                color: var(--ks-content-secondary);
                .material-design-icon__svg {
                    position: unset;
                }
            }
        }
    }

    .custom-select {
        position: relative;
        width: 100%;
        top: 2px;
        .dropdown-options {
            list-style-type: none;
            padding: 4px;
            margin: 0;
            background-color: var(--ks-background-input);
            border: 1px solid var(--ks-border-secondary);
            position: absolute;
            width: max-content;
            min-width: 100%;
            top: 100%;
            z-index: 2;
            border-radius: 4px;
            box-shadow: 2px 3px 16px 0px var(--ks-shadows-light);
            li {
                padding: 6px 8px;
                border-radius: 4px;
                color: var(--ks-content-primary);
                cursor: pointer;
                font-size: $font-size-sm;
                line-height: 20px;
                &:hover {
                    background-color: var(--ks-background-tertiary);
                }
                &.selected {
                    background-color: var(--ks-background-button-primary);
                    color: $white;
                }
            }
        }
    }
</style>
