<template>
    <div :class="'d-flex align-items-baseline doc-alert alert alert-' + type" role="alert">
        <div class="me-3">
            <component :is="Icon" class="icon" />
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
.doc-alert {
    --bs-alert-padding-x: var(--spacer);
    --bs-alert-margin-bottom: var(--spacer);

    border-left-width: 5px !important;
    border-style: solid;
    padding: 0 var(--bs-alert-padding-x);
    margin-bottom: var(--bs-alert-margin-bottom);
    
    :deep(.material-design-icon__svg) {
    width: 22px;
    height: 22px;
    bottom: -0.45em !important;
}
    > * {
        margin: 0;
    }
}
</style>