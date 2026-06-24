<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"
import TaskIcon from "~/components/common/TaskIcon.vue"
import KpiRotator from "~/components/stories/KpiRotator.vue"

interface Kpi {
    value: string
    label: string
}

interface StorySlide {
    slug: string
    heroImage: string
    logo?: string
    logoDark?: string
    logoIcon?: string
    companyName: string
    tagline?: string
    industry: string
    useCase?: string
    quote: string
    quotePerson: string
    quotePersonTitle?: string
    kpis: Kpi[]
    tasks: string[]
}

const props = defineProps<{ stories: StorySlide[] }>()

const trackRef = ref<HTMLElement | null>(null)
const currentIdx = ref(0)
const maxIdx = ref(props.stories.length - 1)

const GAP = 16

function cardWidth(): number {
    const el = trackRef.value?.querySelector(".fc-card") as HTMLElement | null
    return el?.offsetWidth ?? 0
}

// Last index where the final card sits flush at the right edge — stops the
// nav from scrolling into empty space past the end (and "phantom" presses).
function computeMaxIdx() {
    const track = trackRef.value
    const w = cardWidth()
    if (!track || w === 0) { maxIdx.value = Math.max(0, props.stories.length - 1); return }
    // Derive the last index from the real scroll range so it lands exactly at
    // the end — avoids two indices mapping to the same (clamped) max scroll.
    const maxScroll = track.scrollWidth - track.clientWidth
    maxIdx.value = Math.max(0, Math.round(maxScroll / (w + GAP)))
}

function goTo(i: number) {
    if (!trackRef.value) return
    const clamped = Math.min(Math.max(0, i), maxIdx.value)
    trackRef.value.scrollTo({ left: clamped * (cardWidth() + GAP), behavior: "smooth" })
    currentIdx.value = clamped
}

function prev() { goTo(currentIdx.value - 1) }
function next() { goTo(currentIdx.value + 1) }

function onScroll() {
    const w = cardWidth()
    if (!trackRef.value || w === 0) return
    currentIdx.value = Math.min(maxIdx.value, Math.round(trackRef.value.scrollLeft / (w + GAP)))
}

let autoTimer: ReturnType<typeof setInterval> | null = null

function startAuto() {
    if (autoTimer) return
    autoTimer = setInterval(() => {
        goTo(currentIdx.value >= maxIdx.value ? 0 : currentIdx.value + 1)
    }, 12000)
}

function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null }
}

let ro: ResizeObserver
onMounted(() => {
    trackRef.value?.addEventListener("scroll", onScroll, { passive: true })
    computeMaxIdx()
    ro = new ResizeObserver(() => {
        computeMaxIdx()
        if (trackRef.value) trackRef.value.scrollLeft = 0
        currentIdx.value = 0
    })
    if (trackRef.value) ro.observe(trackRef.value)
})
onUnmounted(() => {
    trackRef.value?.removeEventListener("scroll", onScroll)
    ro?.disconnect()
})
</script>

<template>
    <div class="fc-root">
        <div class="fc-carousel-row">
        <button
            class="fc-arrow"
            @click="prev"
            :disabled="currentIdx === 0"
            aria-label="Previous story"
        >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6" />
            </svg>
        </button>

        <div class="fc-track" ref="trackRef">
            <a
                v-for="story in stories"
                :key="story.slug"
                :href="`/customers/${story.slug}`"
                class="fc-card"
            >
                <div class="fc-card-image">
                    <img :src="story.heroImage" :alt="story.companyName" loading="eager" />
                    <span class="fc-industry">{{ story.industry }}</span>
                    <div class="fc-header">
                        <div class="fc-logo">
                            <img
                                v-if="story.logoIcon || story.logo"
                                :src="story.logoIcon ?? story.logo"
                                :alt="story.companyName"
                                loading="eager"
                            />
                            <span v-else class="fc-initial">
                                {{ story.companyName.charAt(0).toUpperCase() }}
                            </span>
                        </div>
                        <div class="fc-info">
                            <span class="fc-company">{{ story.companyName }}</span>
                            <p v-if="story.tagline" class="fc-tagline">{{ story.tagline }}</p>
                        </div>
                    </div>
                </div>

                <div class="fc-card-body">
                    <blockquote class="fc-quote">
                        <p>{{ story.quote }}</p>
                        <cite>{{ story.quotePerson }}<span v-if="story.quotePersonTitle">, {{ story.quotePersonTitle }}</span></cite>
                    </blockquote>

                    <p v-if="story.useCase" class="fc-use-case">
                        <span class="fc-use-case-label">→</span> {{ story.useCase }}
                    </p>

                    <KpiRotator :kpis="story.kpis" />

                    <div v-if="story.tasks && story.tasks.length" class="fc-footer">
                        <span class="fc-plugins-label">Plugins Used :</span>
                        <div class="fc-tasks">
                            <div
                                v-for="task in story.tasks.slice(0, 4)"
                                :key="task"
                                class="fc-task-icon-wrap"
                            >
                                <TaskIcon :cls="task" />
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </div>

        <button
            class="fc-arrow"
            @click="next"
            :disabled="currentIdx >= maxIdx"
            aria-label="Next story"
        >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6" />
            </svg>
        </button>
        </div>

        <div class="fc-nav">
            <div class="fc-dots">
                <button
                    v-for="(_, i) in stories"
                    :key="i"
                    class="fc-dot"
                    :class="{ active: i === currentIdx }"
                    @click="goTo(i)"
                    :aria-label="`Go to story ${i + 1}`"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
/* ── track ── */
/* desktop: arrows flank the track, dots centered below.
   mobile: track full-width, arrows drop to the bottom row flanking the dots. */
.fc-root {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    grid-template-areas:
        "prev track next"
        "nav  nav   nav";
    align-items: center;
    column-gap: 0.75rem;
    row-gap: 1.25rem;
}

/* promote the row's children (arrows + track) into the .fc-root grid */
.fc-carousel-row {
    display: contents;
}

.fc-carousel-row > .fc-arrow:first-child { grid-area: prev; }
.fc-carousel-row > .fc-arrow:last-child  { grid-area: next; }

@media (max-width: 767px) {
    .fc-root {
        grid-template-areas:
            "track track track"
            "prev  nav   next";
        column-gap: 0.5rem;
        padding-left: 0.75rem;
        padding-right: 0.75rem;
    }
}

.fc-track {
    grid-area: track;
    min-width: 0;
}

.fc-track {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
    gap: 1rem;
}

.fc-track::-webkit-scrollbar {
    display: none;
}

/* desktop: 3 cards visible */
.fc-card {
    flex: 0 0 calc((100% - 2rem) / 3);
    scroll-snap-align: start;
}

/* tablet: 2 cards visible */
@media (max-width: 991px) {
    .fc-card {
        flex: 0 0 calc(50% - 0.5rem);
    }
}

/* mobile: 1 card visible */
@media (max-width: 767px) {
    .fc-card {
        flex: 0 0 100%;
    }
}

/* ── card shell ── */
.fc-card {
    display: flex;
    flex-direction: column;
    border-radius: 1rem;
    border: 1px solid var(--ks-border-secondary);
    overflow: hidden;
    background: var(--ks-background-secondary);
    text-decoration: none;
    color: inherit;
    transition: border-color 0.2s;
}

.fc-card:hover {
    border-color: #a78bfa;
}

/* ── image ── */
.fc-card-image {
    aspect-ratio: 16 / 10;
    overflow: hidden;
    position: relative;
}

.fc-card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

/* ── industry badge ── */
.fc-industry {
    position: absolute;
    top: 0.625rem;
    right: 0.625rem;
    font-size: 0.625rem;
    font-weight: 600;
    color: #8405ff;
    background: #ece7f8;
    border: 1px solid rgba(99, 27, 255, 0.15);
    border-radius: 999px;
    padding: 0.2rem 0.625rem;
    white-space: nowrap;
    line-height: 1.5;
}

/* ── header overlay ── */
.fc-header {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    backdrop-filter: blur(1px);
    background: rgba(0, 0, 0, 0.8);
    padding: 0.75rem 1rem;
}

.fc-logo {
    width: 5rem;
    height: 5rem;
    border-radius: 0.875rem;
    background: #0d0d0d;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.fc-logo img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 8px;
}

.fc-initial {
    font-size: 1.75rem;
    font-weight: 700;
    color: #8b5cf6;
    line-height: 1;
}

.fc-info {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    justify-content: center;
    min-width: 0;
    margin-top: 0.25rem;
}

.fc-company {
    font-size: 1.125rem;
    font-weight: 700;
    color: #fff;
    line-height: 1.25;
}

.fc-tagline {
    font-size: 0.8125rem;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.5;
    margin: 0;
}

/* ── body ── */
.fc-card-body {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0;
    flex: 1;
}

/* ── use-case ── */
.fc-use-case {
    font-size: 0.8125rem;
    line-height: 1.5;
    color: var(--ks-content-secondary);
    border-top: 1px solid var(--ks-border-secondary);
    margin: 0;
    padding: 1rem 0;
    min-height: calc(0.8125rem * 1.5 * 3 + 2rem);
}

.fc-use-case-label {
    font-size: 0.6875rem;
    font-weight: 600;
    color: var(--ks-content-tertiary);
    white-space: nowrap;
}

/* ── quote ── */
.fc-quote {
    margin: 0 0 1.25rem;
    padding: 0;
    flex: 1;
    position: relative;
}

.fc-quote p {
    font-size: 1rem;
    font-weight: 500;
    font-style: italic;
    color: var(--ks-content-primary);
    line-height: 1.6;
    margin: 0 0 0.625rem;
}

.fc-quote p::before {
    content: "\201C";
    display: inline;
    font-size: 3rem;
    line-height: 0;
    vertical-align: -0.6rem;
    color: #a78bfa;
    margin-right: 0.1rem;
    font-style: normal;
}

.fc-quote cite {
    display: block;
    text-align: right;
    font-size: 0.8125rem;
    color: var(--ks-content-tertiary);
    font-style: normal;
}

/* ── plugins footer ── */
.fc-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 0.75rem;
    gap: 0.5rem;
}

.fc-plugins-label {
    font-size: 0.6875rem;
    font-weight: 600;
    color: var(--ks-content-tertiary);
    white-space: nowrap;
}

.fc-tasks {
    display: flex;
    gap: 0.3rem;
    align-items: center;
}

.fc-task-icon-wrap {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 0.25rem;
    border: 1px solid var(--ks-border-secondary);
    background: var(--ks-background-body);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.2rem;
}

.fc-task-icon-wrap :deep(.icon-wrapper),
.fc-task-icon-wrap :deep(.icon) {
    width: 100%;
    height: 100%;
    background-size: contain !important;
    background-repeat: no-repeat !important;
    background-position: center !important;
}

.fc-task-icon-wrap :deep(img) {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

/* ── nav ── */
.fc-nav {
    grid-area: nav;
    display: flex;
    justify-content: center;
}

.fc-arrow {
    width: 2rem;
    height: 2rem;
    border-radius: 0.375rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
    flex-shrink: 0;
}

.fc-arrow:hover:not(:disabled) {
    color: #fff;
    border-color: #a78bfa;
    background: rgba(167, 139, 250, 0.1);
}

.fc-arrow:disabled {
    opacity: 0.4;
    cursor: default;
}

.fc-dots {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.fc-dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 999px;
    background: var(--ks-border-secondary);
    border: none;
    cursor: pointer;
    padding: 0;
    transition: background 0.2s, width 0.2s;
}

.fc-dot.active {
    width: 1.5rem;
    background: var(--ks-content-link);
}
</style>
