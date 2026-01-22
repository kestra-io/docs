<template>
    <div class="home-card" ref="box">
        <slot />
    </div>
</template>

<script lang="ts" setup>
    import { useMouse } from "@vueuse/core"
    import { ref, watch } from "vue"

    const box = ref<HTMLDivElement | null>(null)
    const { x: absX, y: absY } = useMouse()

    const SIZE_OF_GRADIENT = 500

    watch([absX, absY], ([xv, yv]) => {
        if (box.value) {
            const { left, top, width, height } = box.value.getBoundingClientRect()
            const x = xv - left - window.scrollX
            const y = yv - top - window.scrollY
            if (
                x < -SIZE_OF_GRADIENT ||
                x > width + SIZE_OF_GRADIENT ||
                y < -SIZE_OF_GRADIENT ||
                y > height + SIZE_OF_GRADIENT
            ) {
                return
            }
            box.value.style.setProperty("--x", `${x}px`)
            box.value.style.setProperty("--y", `${y}px`)
        }
    })
</script>

<style lang="scss" scoped>
    @property --x {
        syntax: "<length>";
        inherits: false;
        initial-value: -250px;
    }
    @property --y {
        syntax: "<length>";
        inherits: false;
        initial-value: -250px;
    }

    .home-card {
        background-image: radial-gradient(
            500px at var(--x) var(--y),
            oklch(0.3 0.0193 271.93) 0,
            oklch(0.26 0.0193 271.93) 100%
        );
        border-radius: 1rem;
        box-shadow: 0px 12px 24px 8px #00000017;
        border: 1px solid #2c2e4b;
    }

    .home-card :deep(a) {
        color: #9c8fff;
        text-decoration: none;
        font-size: 0.8rem;
    }
</style>