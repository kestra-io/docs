<template>
    <div
        ref="multiSelectRef"
        :class="`multi-select  bg-dark-2 ${showDropdown ? 'focused' : ''}`"
        @click="toggleDropdown"
    >
        <div class="selected-items">
            <span v-if="selectedValue?.length === 0">Filter by {{ name }}</span>
            <div v-for="(item, index) in selectedValue" :key="index" class="selected-item">
                <p>{{ item }}</p>
                <Close @click.stop="removeItem(index)" />
            </div>
            <ChevronDown />
        </div>
    </div>

    <div class="custom-select" ref="dropdownRef">
        <ul v-if="showDropdown" class="dropdown-options">
            <li v-for="option in options" :key="option" @click="selectItem(option)">
                {{ option }}
            </li>
        </ul>
    </div>
</template>

<script setup>
  import ChevronDown from "vue-material-design-icons/ChevronDown.vue";
  import Close from "vue-material-design-icons/Close.vue"

  const props = defineProps({
    name: {
      type: String,
      default: '',
    },
    selectedValue: {
      type: Array,
      default: []
    },
    options: {
      type: Array,
      default: []
    },
    removeItem: {
      type: Function
    },
    selectItem: {
      type: Function
    },
    toggleDropdown: {
      type: Function
    },
    showDropdown: {
      type: Boolean,
      default: false,
    }
  });

  const multiSelectRef = ref(null);
  const dropdownRef = ref(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.value && !multiSelectRef.value.contains(event.target) && !dropdownRef.value.contains(event.target)) {
      props.toggleDropdown(false);
    }
  };

  onMounted(() => {
    document.addEventListener('mousedown', handleClickOutside);
  });

  onUnmounted(() => {
    document.removeEventListener('mousedown', handleClickOutside);
  });

  watch(() => props.showDropdown, (newVal) => {
    if (newVal) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  });
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/_variable.scss";

    .multi-select {
        display: flex;
        padding: 4px 40px 4px 6px;
        border-radius: 5px;
        position: relative;
        border: $block-border;
        font-size: $font-size-sm !important;
        color: $white;
        max-width: 221px;
        flex-wrap: wrap;
        cursor: pointer;

        @include media-breakpoint-down(sm) {
            max-width: 100%;
        }

        &.focused {
            box-shadow: 0 0 0 0.25rem rgba(132, 5, 255, 0.25);
        }


        .selected-items {
            display: flex;
            gap: 4px;
            flex-direction: column;
            align-items: start;


            @include media-breakpoint-down(sm) {
                flex-direction: row;
                flex-wrap: wrap;
            }
        }


        :deep(.material-design-icon) {
            position: absolute;
            right: 10px;

            .material-design-icon__svg {
                fill: $white;
            }
        }

        .selected-item {
            background-color: $black-6;
            border-radius: 4px;
            padding: 0 4px;
            display: flex;
            align-items: center;
            gap: 4px;
            max-height: 20px;
            cursor: pointer;

            p {
                margin: 0;
                font-size: 1rem;
                font-weight: 500;
                white-space: nowrap;
                color: $white;
            }

            :deep(.material-design-icon) {
                position: unset;
                right: 0;

                .material-design-icon__svg {
                    position: unset;
                    fill: $white;
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
            padding: 0;
            margin: 0;
            background-color: #444;
            position: absolute;
            width: max-content;
            min-width: 100%;
            top: 100%;
            z-index: 1;
            border-radius: 5px;
            overflow: hidden;

            li {
                padding: 2px 4px;
                color: white;
                cursor: pointer;
                font-size: $font-size-sm !important;
                &:hover {
                    background-color: #666;
                }
            }
        }
    }
</style>