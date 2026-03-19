<script lang="ts" setup>
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
        <input
            type="search"
            placeholder="Search roles"
            name="search"
            v-model="searchString"
        />
        <select v-model="searchDepartment" name="department">
            <option value="">Department</option>
            <option v-for="(name, id) in departments" :key="id" :value="id">
                {{ name }}
            </option>
        </select>
        <select v-model="searchLocation" name="location">
            <option value="">Location</option>
            <option v-for="(name, id) in locations" :key="id" :value="id">
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
        input {
            flex: 1;
        }
        select {
            appearance: base-select;
        }
    }
</style>
