<template>
    <a v-if="href" :href="href" :class="['btn', `btn-${type}`]" @click="onClick">
        <slot></slot>
    </a>
    <button v-else :class="['btn', `btn-${type}`]" @click="onClick">
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
    withDefaults(defineProps<{
        type?: string
        href?: string
        onClick?: (event: MouseEvent) => void
    }>(), {
        type: "secondary",
        href: undefined,
        onClick: () => {}
    })
</script>
