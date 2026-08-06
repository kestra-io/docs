<template>
    <div
        ref="multiSelectRef"
        :class="`multi-select   ${showDropdown ? 'focused' : ''}`"
        @click="toggleDropdown"
    >
        <div class="selected-items">
            <span v-if="selectedValue?.length === 0">Filter by {{ name }}</span>
            <div
                v-for="(item, index) in selectedValue"
                :key="index"
                class="selected-item"
            >
                <p>{{ item }}</p>
                <Close @click.stop="removeItem(index)" />
            </div>
            <ChevronDown />
        </div>
    </div>

    <div class="custom-select" ref="dropdownRef">
        <ul v-if="showDropdown" class="dropdown-options">
            <li
                v-for="option in options"
                :key="option"
                @click="selectItem(option)"
            >
                {{ option }}
            </li>
        </ul>
    </div>
</template>

<script setup>
    import { ref, watch, onMounted, onUnmounted } from "vue"
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue"
    import Close from "vue-material-design-icons/Close.vue"

    const props = defineProps({
        name: {
            type: String,
            default: "",
        },
        selectedValue: {
            type: Array,
            default: [],
        },
        options: {
            type: Array,
            default: [],
        },
        removeItem: {
            type: Function,
        },
        selectItem: {
            type: Function,
        },
        toggleDropdown: {
            type: Function,
        },
        showDropdown: {
            type: Boolean,
            default: false,
        },
    })

    const multiSelectRef = ref(null)
    const dropdownRef = ref(null)

    const handleClickOutside = (event) => {
        if (
            dropdownRef.value &&
            !multiSelectRef.value.contains(event.target) &&
            !dropdownRef.value.contains(event.target)
        ) {
            props.toggleDropdown(false)
        }
    }

    onMounted(() => {
        document.addEventListener("mousedown", handleClickOutside)
    })

    onUnmounted(() => {
        document.removeEventListener("mousedown", handleClickOutside)
    })

    watch(
        () => props.showDropdown,
        (newVal) => {
            if (newVal) {
                document.addEventListener("mousedown", handleClickOutside)
            } else {
                document.removeEventListener("mousedown", handleClickOutside)
            }
        },
    )
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

        // The chevron is the only icon rendered directly under `.selected-items`;
        // it sits on the trailing edge of the field, outside the content flow.
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
            padding: 2px 8px;
            border-radius: 40px;
            background-color: var(--ks-background-tertiary);
            cursor: pointer;
            p {
                margin: 0;
                font-size: $font-size-xs;
                line-height: 16px;
                font-weight: 600;
                white-space: nowrap;
                color: var(--ks-content-secondary);
            }
            :deep(.material-design-icon) {
                position: unset;
                transform: none;
                width: 14px;
                height: 14px;
                .material-design-icon__svg {
                    position: unset;
                    width: 14px;
                    height: 14px;
                    fill: var(--ks-content-secondary);
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
            overflow: hidden;
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
            }
        }
    }
</style>
