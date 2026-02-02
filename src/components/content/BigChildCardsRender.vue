<template>
    <h2 class="big-title">{{ title }}</h2>
    <div class="big-card-grid">
        <component
            :is="LinkComponent"
            :href="item.path"
            class="big-card"
            v-for="item in navigation"
            :key="item.path"
        >
            <h4 class="card-title">{{ item.title }}</h4>
            <p class="card-text">{{ item.description }}</p>
        </component>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps<{
        title: string
        navigation: Array<{ path: string; title: string; description: string }>
        LinkComponent?: any
    }>()

    const LinkComponent = props.LinkComponent ?? "a"
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";
    .big-card-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }

    h2.big-title {
        padding: 0;
        font-size: $font-size-xl;
        border: none;
        margin-top: 3rem;
        margin-bottom: 1rem;
        font-weight: 600;
    }

    .big-card {
        border-radius: 0.5rem;
        text-decoration: none;
        background: linear-gradient(180deg, #21242e 0%, #1a1c24 100%);
        color: $white;
        border: 1px solid #21242e;
        border-image-source: linear-gradient(180deg, #2b313e 0%, #131725 100%);
        transition: all 0.3s;
        padding: 1rem;
        @include media-breakpoint-up(md) {
            padding: 2rem;
        }
        h4 {
            padding-top: 0;
            font-size: $font-size-xl;
            font-weight: normal;
        }
        p {
            font-size: $font-size-xs;
            @include media-breakpoint-up(md) {
                font-size: $font-size-sm;
            }
            line-height: 1.5em;
        }
        &:hover {
            background:
                linear-gradient(180deg, rgba(#21242e, 0.9) 0%, rgba(#1a1c24, 0.9) 100%), #fff;
        }
    }
</style>