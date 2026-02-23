<template>
    <a v-if="href" :href="href" :class="`btn btn-${type}`" @click="onClick">
        <slot></slot>
    </a>
    <button v-else :class="`btn btn-${type}`" @click="onClick">
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
    withDefaults(defineProps<{
        type?: string
        href?: string
        onClick?: (event: MouseEvent) => void
    }>(), {
        type: "",
        href: undefined,
        onClick: () => {}
    })
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .btn {
        border-radius: 0.25rem;
        padding: 0.5rem 1rem;
        text-decoration: none;
        font-size: $font-size-sm;
        font-size: $font-size-sm;
        border: 1px solid var(--ks-border-primary);
    }

    .btn-primary {
        background-color: var(--ks-background-button-primary);
        color: var(--ks-content-primary);
    }


</style>