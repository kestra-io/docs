<template>
    <div
        ref="root"
        class="icon-wrapper"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        :title="generateTagName()"
        v-html="icon"
    >
    </div>
</template>

<script lang="ts" setup>
    import { onMounted, ref } from "vue"

    const props = defineProps({
        cls: {
            type: String,
            default: "",
        },
    })

    const root = ref(null)

    const generateTagName = () => {
        const splittedName = props.cls.split(".")

        return splittedName[splittedName.length - 1]
    }
    const icon = ref("")
    onMounted(async () => {
        // load svg icon from api
        const response = await fetch(`/icons/${props.cls}.svg`)
        icon.value = await response.text()
    })
</script>

<style lang="scss" scoped>
    .icon-wrapper {
        display: inline-block;
        width: 100%;
        height: 100%;
        position: relative;

        :deep(> svg) {
            width: 100%;
            height: 100%;
            display: block;
            background-size: contain !important;
            background-repeat: no-repeat !important;
            background-position: center center !important;
        }
    }
</style>