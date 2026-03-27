<script lang="ts" setup>
    import MagnifyIcon from "vue-material-design-icons/Magnify.vue"

    import {
        searchDepartment,
        searchLocation,
        searchString,
    } from "./filterState"
    import CustomSelect from "../common/CustomSelect.vue"
    defineProps<{
        departments: Map<string, string>
        locations: Map<string, string>
    }>()
</script>

<template>
    <form>
        <div class="search">
            <input
                type="search"
                placeholder="Search roles"
                name="search"
                v-model="searchString"
            />
            <MagnifyIcon />
        </div>

        <CustomSelect
            v-model="searchDepartment"
            :options="
                Array.from(
                    departments
                        .entries()
                        .map(([id, name]) => ({ value: id, label: name })),
                )
            "
            placeholder="Department"
            id="departmentSelect"
            size="lg"
            class="custom-select"
        />
        <CustomSelect
            v-model="searchLocation"
            :options="
                Array.from(
                    locations
                        .entries()
                        .map(([id, name]) => ({ value: id, label: name })),
                )
            "
            placeholder="Location"
            id="locationSelect"
            size="lg"
            class="custom-select"
        />
    </form>
</template>

<style lang="scss" scoped>
    form {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 2rem;

        input {
            padding: 0.75rem 1rem;
            border: 1px solid var(--ks-border-secondary);
            border-radius: 4px;
            font-size: 12px;
            background-color: var(--ks-background-input);
            color: var(--ks-content-primary);
            transition: border-color 0.3s ease;

            &:focus {
                outline: none;
                border-color: var(--ks-content-color-highlight);
            }
        }
        .search {
            position: relative;
            width: 350px;
            span {
                position: absolute;
                font-size: 24px;
                right: 0.8rem;
                top: 50%;
                margin: 0;
                padding: 0;
                transform: translateY(-50%);
                color: var(--ks-content-tertiary);
                :deep(svg) {
                    bottom: 0;
                }
            }
            input {
                width: 100%;
            }
        }
        .custom-select {
            --ks-custom-select-border: var(--ks-border-secondary);
        }
    }
</style>
