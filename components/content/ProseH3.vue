<template>
    <h3 :id="id">
        <a
            v-if="id && generate"
            :href="`#${id}`"
        >
            <slot />
        </a>
        <slot v-else />
    </h3>
</template>

<script setup lang="ts">
    import { computed, useRuntimeConfig } from '#imports'

    const props = defineProps<{ id?: string }>()

    const { headings } = useRuntimeConfig().public.mdc
    const generate = computed(() => props.id && headings?.anchorLinks?.h3)
</script>
<style lang="scss" scoped>
    @import "../../assets/styles/_variable.scss";

    h3, h3 a {
        color: $white;
        font-weight: 300;
    }

</style>