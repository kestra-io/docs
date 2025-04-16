<template>
    <canvas ref="canvas" height="1520" width="2000" :class="{
        loading: !riveLoaded,
    }"/>
</template>

<script setup lang="ts">
import { Rive } from "@rive-app/canvas";
import { onMounted, ref } from "vue";

definePageMeta({
    layout: false
})

const canvas = ref<HTMLCanvasElement | null>(null);
const riveLoaded = ref(false);
onMounted(() => {
    if(!canvas.value) {
        throw new Error("Canvas element is not available");
    }

    const anim = new Rive({
        src: "/landing/home/homepage.riv",
        canvas: canvas.value,
        autoplay: true,
        stateMachines: "kestra",
        isTouchScrollEnabled: true,
        onLoad: () => {
            riveLoaded.value = true
            anim.resizeDrawingSurfaceToCanvas();
        },
    });
})
</script>

<style scoped>
canvas {
    border: 1px solid black;
    background-color: #f0f0f0;
    width: 2000px;
}
.loading {
    background-color: #e0e0e0;
    animation: loading 1s infinite;
}
</style>