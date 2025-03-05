<template>
    <div class="docs-button-row">
        <Button v-for="(button, index) in buttons" :key="button.label" :href="button.href" :type="index===0?'primary':''">
            {{ button.label }}
        </Button>
    </div>
</template>

<script setup>
    import Button from "../common/Button.vue";
    const props = defineProps({
        buttons: {
            type: Array,
            default: []
        }
    })
</script>

<style lang="scss" scoped>
.docs-button-row {
    display: flex;
    justify-content: flex-start;
    gap:.5rem;
    margin-bottom: 3rem;
    flex-wrap: wrap;
}
</style>