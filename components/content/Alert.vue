<template>
    <div :class="'doc-alert alert alert-' + type" role="alert">
        <div class="me-3">
            <component :is="Icon" class="alert-icon" />
        </div>
        <div class="d-flex flex-column">
            <slot />
        </div>
    </div>
</template>

<script>
import FileDocument from 'vue-material-design-icons/FileDocument.vue';
import Information from 'vue-material-design-icons/AlertCircle.vue';
import Warning from 'vue-material-design-icons/Alert.vue';
import Close from 'vue-material-design-icons/CloseCircle.vue';

export default {
    props: {
        type: {
            type: String,
            required: true
        },
    },
    computed: {
        Icon() {
            switch (this.type) {
                case 'success':
                    return FileDocument;
                case 'info':
                    return Information;
                case 'warning':
                    return Warning;
                case 'danger':
                    return Close;
                default:
                    return Information;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../assets/styles/variable";

.doc-alert {
        display: flex;
        align-items: start;
        border: 1px solid;
        border-left-width: 5px !important;
        padding: var(--spacer);
        padding-bottom: 2px !important;
        margin-bottom: 1rem;
        border-radius: $border-radius;

        :deep(p){
            font-size: $font-size-base;
            color: inherit;
        }

        > * {
            margin: 0;
        }

        .alert-icon {
            font-size: 22px;
        }

        &.alert-danger {
            border-color: $danger-border;
            color: $danger-color;
            background-color: $danger-bg;
        }

        &.alert-warning {
            border-color: $warning-border;
            color: $warning-color;
            background-color: $warning-bg;
        }

        &.alert-info {
            border-color: $info-border;
            color: $info-color;
            background-color: $info-bg;
        }

        &.alert-success {
            border-color: $success-border;
            color: $success-color;
            background-color: $success-bg;
        }
    }
</style>