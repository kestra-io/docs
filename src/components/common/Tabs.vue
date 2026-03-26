<template>
    <div class="container">
        <ul class="tabs">
            <li v-for="[slug, category] in categories" :key="slug">
                <a
                    class="tab"
                    :class="{ active: modelValue === slug }"
                    @click.prevent="$emit('update:modelValue', slug)"
                    :href="`${rootHref}${joiner}${slug}`"
                    role="presentation"
                >
                    {{ category }}
                </a>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
    withDefaults(
        defineProps<{
            modelValue: string
            categories: Map<string, string>
            rootHref: string
            joiner?: string
        }>(),
        {
            joiner: "/",
        },
    )

    defineEmits<{
        (e: "update:modelValue", value: string): void
    }>()
</script>

<style lang="scss" scoped>
    .container {
        display: flex;
        justify-content: flex-start;
        margin-bottom: 1rem;
    }

    .tabs {
        display: flex;
        gap: 0.25rem;
        flex-wrap: wrap;
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .tab {
        background: transparent;
        padding: 0.5rem 1.25rem;
        border-radius: 0.5rem;
        font-size: $font-size-sm;
        color: var(--ks-content-secondary);
        white-space: nowrap;
        transition: all 0.2s ease;
        border: 1px solid transparent;

        &:hover {
            color: var(--ks-content-primary);
        }

        &.active {
            background: var(--ks-background-body);
            color: var(--ks-content-primary);
            border: $block-border;
            box-shadow: 0 4px 10px #5e6ed429;
        }
    }
</style>
