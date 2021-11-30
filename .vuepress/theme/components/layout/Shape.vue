<template>
    <div class="position-relative shape-wrapper">
        <div class="shape overflow-hidden" :class="classes">
            <svg viewBox="0 0 2880 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 720,50 2160,0 h 720 V 100 H 0 V 50 Z" fill="currentColor" />
            </svg>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        classes: {
            type: Array,
            default: () => []
        }
    },
}
</script>

<style lang="scss" scoped>


</style>
