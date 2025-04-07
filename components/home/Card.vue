<template>
    <div class="home-card" ref="box">
        <slot/>
    </div>
</template>

<script lang="ts" setup>
import {useMouse} from "@vueuse/core"

const box = ref<HTMLDivElement | null>(null)
const {x:absX, y:absY} = useMouse()

const SIZE_OF_GRADIENT = 500

watch([absX, absY], ([xv, yv]) => {
    if (box.value) {
        const {left, top, width, height} = box.value.getBoundingClientRect()
        const x = xv - left - window.scrollX
        const y = yv - top - window.scrollY
        if(x < -SIZE_OF_GRADIENT || x > width + SIZE_OF_GRADIENT || y < -SIZE_OF_GRADIENT || y > height + SIZE_OF_GRADIENT) {
            return
        }
        box.value.style.setProperty('--x', `${x}px`)
        box.value.style.setProperty('--y', `${y}px`)
    }
})
</script>

<style lang="scss" scoped>
@property --x{
    syntax: '<length>';
    inherits: false;
    initial-value: -250px;
}
@property --y{
    syntax: '<length>';
    inherits: false;
    initial-value: -250px;
}

.home-card {
    background-image:
        radial-gradient(500px at var(--x) var(--y),rgba(153,153,153,0.08),transparent 100%),
        linear-gradient(180deg,#21242e99 0,#1a1c2499),
        linear-gradient(90deg,#1A1C24 0,#373A44,#1A1C24);
    border-radius: 1rem;
    box-shadow: 0px 12px 24px 8px #00000017;
    border: 1px solid #2C2E4B;
}

.home-card :deep(a){
    color: #9C8FFF;
    text-decoration: none;
    font-size: .8rem;
}
</style>