<template>
    <NuxtLink :href="plugin.plugin ? `https://kestra.io/plugins/${plugin.plugin}` : ''">
        <div class="card">
            <div class="card-body d-flex flex-column justify-content-between gap-3">
                <div>
                    <div class="d-flex flex-wrap gap-3" v-if="icon.name">
                        <BlueprintsTaskIcon :cls="icon" />
                    </div>
                    <div class="card-text">
                        <p class="title" v-if="plugin.categories">{{ plugin.categories.join() }}</p>
                    </div>
                    <h6 v-if="plugin.plugin">
                        {{ plugin.plugin.replace('plugin-', '').split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') }}
                    </h6>
                </div>
            </div>
        </div>
    </NuxtLink>
</template>

<script setup>
defineProps({
    plugin: {
        type: Object,
        required: true
    },
    icon: {
        type: Object,
        default: () => ({})
    }
})
</script>

<style scoped lang="scss">
@import "../../assets/styles/variable";
.card {
    height: 100%;
    .card-body {
        padding: 2rem !important;
        .icon {
            border: 1px solid #E5E4F7;
            padding: 0.313rem 0.625rem;
            width: 44px;
        }
    }
    .title {
        font-size: $font-size-xs;
        color: var(--bs-pink);
        font-weight: 700;
        text-transform: uppercase;
        font-family: var(--bs-font-monospace);
        line-height: 1.375rem;
    }
    .description {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .description::-webkit-scrollbar {
        display: none;
    }
}
</style>