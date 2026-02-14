<template>
    <section class="detail-content">
        <div class="container">
            <h1>{{ title }}</h1>
            <p class="mb-0">{{ description }}</p>
        </div>
    </section>
</template>

<script setup lang="ts">
    defineProps<{
        title: string
        description: string
    }>()
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .detail-content {
        text-align: center;
        background-color: var(--ks-background-secondary);
        padding: calc($spacer *3) $spacer;
        .container {
            max-width: $container-max-width;
        }
        h1 {
            font-weight: 600;
            margin-bottom: $rem-1;
            color: var(--ks-content-primary);
        }
        p {
            color: var(--ks-content-secondary);
        }
    }
</style>