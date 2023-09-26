<template>
    <NuxtLink :href="plugin.plugin ? `/plugins/plugin-${plugin.plugin}` : ''">
        <div class="card">
            <div class="card-body d-flex flex-column justify-content-between gap-3">
                <div>
                    <div class="d-flex flex-wrap gap-3" v-if="icon.name">
                        {{ plugin.icon }}
                    </div>
                    <div class="card-text">
                        <p class="title" v-if="plugin.title">{{ plugin.title }}</p>
                    </div>
                    <h6 v-if="plugin.description">
                        {{ plugin.description }}
                    </h6>
                </div>
            </div>
        </div>
    </NuxtLink>
</template>

<script setup>
const props = defineProps({
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