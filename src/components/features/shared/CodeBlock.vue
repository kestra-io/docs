<template>
    <div class="code" v-html="code"></div>
</template>

<script setup lang="ts">
    defineProps({
        code: {
            type: String,
            required: true,
        },
    });
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .code {
        position: relative;
        overflow: hidden;
        border-radius: 0.5rem;
        :deep(.code-content) {
            padding: 3rem 2rem 2rem 2rem;
            font-family: var(--bs-font-monospace);
            color: #e8a979;
            white-space: pre;
            span {
                color: #7fbc85;
            }
            @include media-breakpoint-down(xl) {
                font-size: $font-size-sm;
            }
            @include media-breakpoint-down(lg) {
                font-size: calc($font-size-base * 0.625);
            }
            @include media-breakpoint-down(md) {
                font-size: $font-size-sm;
            }
            @include media-breakpoint-down(sm) {
                font-size: calc($font-size-base * 0.563);
                padding: 2rem 1rem;
            }
            div {
                color: #e8a979;
            }
        }
        :deep(.code-content),
        :deep(.code-header) {
            --border-size: 1px;
            position: relative;
            z-index: 0;
            overflow: hidden;
            border: 0;
            &::before {
                content: "";
                position: absolute;
                z-index: -2;
                left: -50%;
                top: -300%;
                width: 200%;
                height: 700%;
                animation: rotate 6s linear infinite;
            }
            &::after {
                content: "";
                position: absolute;
                z-index: -1;
                left: 1px;
                top: 1px;
                width: calc(100% - 2px);
                height: calc(100% - 2px);
                background: var(--ks-background-secondary);
                border-radius: 0 0 0.5rem 0.5rem;
                transition: background-color 0.2s ease;
            }
            &::before {
                background: conic-gradient(#a704f3, #d183f6 10%, #a227db, transparent 50%, #a60aef);
            }
        }
        :deep(.code-header) {
            padding: 0.75rem 1rem;
            background-color: var(--ks-background-secondary);
            &::after {
                content: "";
                position: absolute;
                z-index: -1;
                left: 1px;
                top: 1px;
                width: calc(100% - 2px);
                height: calc(100% - 2px);
                background: var(--ks-background-secondary);
                border-radius: 0.5rem 0.5rem 0 0;
                transition: background-color 0.2s ease;
            }
        }
        :deep(.text-success) {
            color: #2c3f3a !important;
        }
    }
</style>
