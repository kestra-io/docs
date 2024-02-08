<template>
    <h1 :id="id">
        <a
            v-if="generate"
            :href="`#${id}`"
        >
            <slot />
        </a>
        <slot v-else />
    </h1>
</template>

<script setup lang="ts">
    import { computed, useRuntimeConfig } from '#imports'

    const props = defineProps<{ id?: string }>()

    const { headings } = useRuntimeConfig().public.mdc
    const generate = computed(() => props.id && headings?.anchorLinks?.h1)
</script>
<style lang="scss" scoped>
    @import "../../assets/styles/_variable.scss";

    h1, h1 a {
        color: $white;
        font-weight: 300;
    }

</style>