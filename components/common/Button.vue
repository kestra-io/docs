<template>
    <NuxtLink v-if="href" :href="href" :class="`btn btn-${type}`" @click="onClick">
        <slot></slot>
    </NuxtLink>
    <button v-else :class="`btn btn-${type}`" @click="onClick">
        <slot></slot>
    </button>
</template>

<script setup>
    const props = defineProps({
        type: {
            type: String,
            default: ''
        },
        href: {
            type: String,
            default: undefined
        },
        onClick: {
            type: Function,
            default: () => () => {}
        }
    })
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/_variable.scss";

    .btn {
        border-radius: 0.25rem;
        padding: 0.5rem 1rem;
        text-decoration: none;
        font-size: $font-size-sm;
        color: $white;
        background-color: $black-9;
        border: 1px solid $black-3;
    }

    .btn-primary {
        background-color: $primary;
    }
</style>