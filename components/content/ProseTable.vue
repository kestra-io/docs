<template>
    <div class="container table-responsive">
        <table class="table table-dark">
            <slot />
        </table>
    </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    :deep(thead) {
        border-bottom: none !important;
        th {
            font-size: $font-size-md;
            font-weight: 700;
            line-height: 1.5rem;
            padding: 1.375rem 2.9rem;
            background-color: $black-2;
            border: 1px solid $black-3;
            border-bottom: none !important;
            border-top: none;
        }
    }

    :deep(tbody) {
        tr {
            td {
                font-size: $font-size-base;
                padding: 1.3rem 2.5rem;
                border: 1px solid #1d1d1e;
            }
        }
    }

    .table-dark {
        --bs-table-bg: $black-2 !important;
        color: transparent !important;
        outline: none !important;
    }
</style>