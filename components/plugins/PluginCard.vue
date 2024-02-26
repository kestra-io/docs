<template>
    <NuxtLink :href="`/plugins/${plugin.name}`">
        <div class="plugin d-flex align-items-center gap-2 bg-dark-2">
            <div class="icon-content">
                <img :src="`/icons/${plugin.group}.svg`" :alt="plugin.title">
            </div>
            <h6>
                {{ plugin.title.length > 150 ? plugin.title.substring(0, 150) + '...' : plugin.title }}
            </h6>
        </div>
    </NuxtLink>
</template>
<script setup>
    const props = defineProps({
        plugin: {
            type: Object,
            required: true
        },
        icons: {
            type: Object,
            default: undefined
        },
    });
</script>


<style scoped lang="scss">
    @import "../../assets/styles/variable";

    .plugin {
        border-radius: 4px;
        border: $block-border;
        padding: calc($rem-1 / 2) $rem-2;

        .icon-content img {
            width: 32px;
            height: 32px;
        }

        h6 {
            color: $white;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: $font-size-xs;
            font-weight: 700;
            margin-bottom: 0;
        }
    }
</style>