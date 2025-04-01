<template>
    <div class="home-card">
        <slot/>
    </div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>
.home-card {
    background:
            linear-gradient(180deg, #21242E99 0%, #1A1C2499 100%),
            linear-gradient(90deg,#1A1C24 0%, #373a44 50%, #1A1C24 100%);
    border-radius: 1rem;
    box-shadow: 0px 12px 24px 8px #00000017;
    border: 1px solid #2C2E4B;
    &:hover{
        background:
            linear-gradient(90deg, rgba(255, 255, 255, .05) 0%, rgba(255, 255, 255, .05) 100%),
            linear-gradient(180deg, #21242E99 0%, #1A1C2499 100%),
            linear-gradient(90deg,#1A1C24 0%, #373a44 50%, #1A1C24 100%);
    }
}

.home-card :deep(a){
    color: #9C8FFF;
    text-decoration: none;
    font-size: .8rem;
}
</style>