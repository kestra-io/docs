<script lang="ts" setup>
    import MagnifyIcon from "vue-material-design-icons/Magnify.vue"
    import {
        searchDepartment,
        searchLocation,
        searchString,
    } from "./filterState"
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

        <select v-model="searchDepartment" name="department">
            <option value="">Department</option>
            <option v-for="[id, name] in departments" :key="id" :value="id">
                {{ name }}
            </option>
        </select>
        <select v-model="searchLocation" name="location">
            <option value="">Location</option>
            <option v-for="[id, name] in locations" :key="id" :value="id">
                {{ name }}
            </option>
        </select>
    </form>
</template>

<style lang="scss" scoped>
    form {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin-bottom: 2rem;

        input,
        select {
            padding: 0.75rem 1rem;
            border: 1px solid var(--ks-border-primary);
            border-radius: 4px;
            font-size: 1rem;
            background-color: var(--ks-background-body);
            color: var(--ks-content-primary);
            transition: border-color 0.3s ease;

            &:focus {
                outline: none;
                border-color: var(--ks-content-color-highlight);
            }
        }
        .search {
            flex: 1;
            position: relative;
            min-width: 300px;
            span {
                position: absolute;
                font-size: 24px;
                right: 1rem;
                top: 50%;
                margin: 0;
                padding: 0;
                transform: translateY(-50%);
                color: var(--ks-content-secondary);
                :deep(svg) {
                    bottom: 0;
                }
            }
            input {
                width: 100%;
            }
        }
        select {
            appearance: base-select;
            min-width: 200px;
        }
    }
</style>
