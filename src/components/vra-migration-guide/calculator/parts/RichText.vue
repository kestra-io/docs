<template>
    <template v-for="(part, index) in parts" :key="index">
        <template v-if="typeof part === 'string'">{{ part }}</template>
        <strong v-else :class="part.tone && `tone-${part.tone}`">{{
            part.strong
        }}</strong>
    </template>
</template>

<script setup lang="ts">
    import type { Rich } from "../presentation"

    defineProps<{ parts: Rich }>()
</script>

<style scoped lang="scss">
    .tone-pos {
        color: var(--ks-content-alert-success);
    }

    .tone-neg {
        color: var(--ks-content-alert-danger);
    }
</style>
