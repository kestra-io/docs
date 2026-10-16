<template>
    <div class="calculator-messages" aria-live="polite">
        <p
            v-for="message in errors"
            :key="`e-${message}`"
            class="message error"
        >
            {{ message }}
        </p>
        <p
            v-for="message in warnings"
            :key="`w-${message}`"
            class="message warning"
        >
            {{ message }}
        </p>
    </div>
</template>

<script setup lang="ts">
    defineProps<{ errors: string[]; warnings: string[] }>()
</script>

<style scoped lang="scss">
    .calculator-messages:empty {
        display: none;
    }

    .message {
        margin: 0 0 0.5rem;
        padding: 0.5rem 0.75rem;
        border: 1px solid currentColor;
        border-radius: $border-radius;
        font-size: $font-size-sm;
    }

    .error {
        color: var(--ks-content-alert-danger);
        background: var(--ks-background-alert-danger);
    }

    .warning {
        color: var(--ks-content-alert-warning);
        background: var(--ks-background-alert-warning);
    }
</style>
