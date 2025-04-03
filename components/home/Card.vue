<template>
    <div class="home-card" ref="box" :style="{
        '--x': `${relativeMouse.x}px`,
        '--y': `${relativeMouse.y}px`
    }">
        <slot/>
    </div>
</template>

<script lang="ts" setup>
import {useMouse, type UseMouseEventExtractor} from "@vueuse/core"

const box = ref<HTMLDivElement | null>(null)
const {x:absX, y:absY} = useMouse()

const relativeMouse = computed(() => {
    if (box.value) {
        const rect = box.value.getBoundingClientRect()
        return {
            x: absX.value - (rect.left + window.scrollX),
            y: absY.value - (rect.top + window.scrollY)
        }
    }
    return {x: 0, y: 0}
})
</script>

<style lang="scss" scoped>
@property --x{
    syntax: '<length>';
    inherits: false;
    initial-value: 0;
}
@property --y{
    syntax: '<length>';
    inherits: false;
    initial-value: 0;
}

.home-card {
    position: relative;
    background:
        radial-gradient(circle at var(--x) var(--y), #99999922 0%, #00000000 50%),
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