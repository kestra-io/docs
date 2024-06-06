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

    .table-responsive {
        padding: 0;
        margin: calc($spacer * 2) 0 calc($spacer * 4);
    }

    :deep(thead) {
        border-bottom: none !important;
        th {
            font-size: $font-size-md;
            font-weight: 600;
            line-height: 1.25rem;
            padding: calc($spacer * 0.5) $spacer $spacer;
            background-color: transparent;
            border-bottom: 4px solid #8B8B8D !important;
            border-top: none;
            color: $white;
        }
    }

    :deep(tbody) {
        tr {
            td {
                font-size: $font-size-sm;
                padding: calc($spacer * 1.5) $spacer $spacer !important;
                font-weight: 400;
                color: $white;
            }
        }
    }

    .table-dark {
        --bs-table-bg: $black-2 !important;
        color: transparent !important;
        outline: none !important;
    }
</style>