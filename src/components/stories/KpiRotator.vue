<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue"

interface Kpi {
    value: string
    label: string
}

const props = defineProps<{ kpis: Kpi[] }>()

const currentIdx = ref(0)

// sliding window of 2
const visible = computed(() => [
    props.kpis[currentIdx.value],
    props.kpis[(currentIdx.value + 1) % props.kpis.length],
])

const shouldRotate = computed(() => props.kpis.length > 2)

function rotate() {
    currentIdx.value = (currentIdx.value + 1) % props.kpis.length
}

let timer: ReturnType<typeof setInterval>
let startTimer: ReturnType<typeof setTimeout>

onMounted(() => {
    if (!shouldRotate.value) return
    const delay = Math.random() * 4000
    startTimer = setTimeout(() => {
        timer = setInterval(rotate, 10000)
    }, delay)
})

onUnmounted(() => {
    clearTimeout(startTimer)
    clearInterval(timer)
})
</script>

<template>
    <div v-if="kpis.length > 0" class="kpi-rotator">
        <div class="kpi-row-outer">
            <transition name="kpi-fade" mode="out-in">
                <div :key="currentIdx" class="kpi-row">
                    <div v-for="kpi in visible" :key="kpi.value" class="kpi-item">
                        <span class="kpi-value" v-html="kpi.value"></span>
                        <span class="kpi-label">{{ kpi.label }}</span>
                    </div>
                </div>
            </transition>
        </div>
        <div v-if="shouldRotate" class="kpi-pips">
            <span
                v-for="(_, i) in kpis"
                :key="i"
                class="kpi-pip"
                :class="{ active: i === currentIdx }"
            />
        </div>
    </div>
</template>

<style scoped>
.kpi-rotator {
    border-top: 1px solid var(--ks-border-secondary);
    border-bottom: 1px solid var(--ks-border-secondary);
}

/* fixed height wrapper prevents card height jumps during transition */
.kpi-row-outer {
    position: relative;
    height: calc(2rem + 1.3rem + 0.15rem + 0.8125rem * 1.4 * 2 + 0.625rem);
    overflow: hidden;
}

.kpi-row {
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}

.kpi-item {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    padding: 1rem 0;
}

.kpi-item:nth-child(odd) {
    padding-right: 1.5rem;
}

.kpi-value {
    font-size: 1rem;
    font-weight: 800;
    color: var(--ks-content-primary);
    line-height: 1.3;
}

.kpi-label {
    font-size: 0.8125rem;
    color: var(--ks-content-secondary);
    line-height: 1.4;
    height: calc(0.8125rem * 1.4 * 2);
    overflow: hidden;
}

.kpi-pips {
    display: flex;
    gap: 0.3rem;
    padding: 0 0 0.5rem;
}

.kpi-pip {
    width: 0.3rem;
    height: 0.3rem;
    border-radius: 999px;
    background: var(--ks-border-secondary);
    transition: background 0.2s, width 0.2s;
}

.kpi-pip.active {
    width: 0.75rem;
    background: var(--ks-content-link);
}

.kpi-fade-enter-active {
    transition: opacity 0.6s ease;
}

.kpi-fade-leave-active {
    transition: opacity 0.4s ease;
}

.kpi-fade-enter-from,
.kpi-fade-leave-to {
    opacity: 0;
}
</style>
