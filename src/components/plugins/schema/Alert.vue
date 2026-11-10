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

<script setup lang="ts">
    import {computed} from "vue";
    import FileDocument from "vue-material-design-icons/FileDocument.vue";
    import Information from "vue-material-design-icons/AlertCircle.vue";
    import Warning from "vue-material-design-icons/Alert.vue";
    import Close from "vue-material-design-icons/CloseCircle.vue";

    const props = defineProps<{
        type: "info" | "warning" | "danger" | "success"
    }>();

    defineOptions({
        name: "Alert",
    });

    const Icon = computed(() => {
        switch (props.type) {
        case "success":
            return FileDocument;
        case "info":
            return Information;
        case "warning":
            return Warning;
        case "danger":
            return Close;
        default:
            return Information;
        }
    });
</script>

<style lang="scss" scoped>
    .doc-alert .alert-icon {
        font-size: 22px;
    }
</style>
