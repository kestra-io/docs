<template>
    <ul class="ks-nav-tabs"
        role="tablist">
        <li
            v-for="[slug, category] in categories"
            :key="slug"
            class="ks-nav-item"
            role="presentation"
        >
            <a class="ks-nav-link" :class="{ active: currentCategory === category }" type="button"
                :href="`/tutorial-videos/${slug}`">
                {{ category }}
            </a>
        </li>
    </ul>
</template>

<script setup lang="ts">
    const props = withDefaults(
        defineProps<{
            categories: Map<string, string>
            currentCategory?: string
        }>(),
        {
            currentCategory: "All videos",
        },
    )
</script>

<style lang="scss" scoped>
    .ks-nav-tabs {
        list-style-type: none;
        display: flex;
        gap: .5rem;
        padding: 0 .5rem;
        margin-top: 1.5rem;
        margin-inline: -.5rem;
        flex-wrap: nowrap;
        overflow-x: auto;
        overflow-y: hidden;
        -ms-overflow-style: none;
        scrollbar-width: none;
        &::-webkit-scrollbar {
            display: none;
        }
    }

    .ks-nav-item {
        white-space: nowrap;
        padding: .5rem 0;
        .ks-nav-link {
            color: var(--ks-content-secondary);
            font-size: $font-size-md;
            font-weight: 400;
            border: none;
            border-radius: 4px;
            padding: 0 .5rem;
            &:focus-visible {
                box-shadow: none;
            }
            &.active {
                background-color: var(--ks-background-body);
                color: var(--ks-content-primary);
                box-shadow: 0px 0px 3px 3px #5E6ED429;

            }
        }
    }


</style>