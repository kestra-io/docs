<script setup lang="ts">
    import { ref, onMounted, onUnmounted } from "vue"
    import TaskIcon from "~/components/common/TaskIcon.vue"

    const MAX_TASKS = 5

    const props = defineProps<{ stories: Story[] }>()

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
        if (!track || w === 0) {
            maxIdx.value = Math.max(0, props.stories.length - 1)
            return
        }
        const maxScroll = track.scrollWidth - track.clientWidth
        maxIdx.value = Math.max(0, Math.round(maxScroll / (w + GAP)))
    }

    function goTo(i: number) {
        if (!trackRef.value) return
        const clamped = Math.min(Math.max(0, i), maxIdx.value)
        trackRef.value.scrollTo({ left: clamped * (cardWidth() + GAP), behavior: "smooth" })
        currentIdx.value = clamped
    }

    function prev() {
        goTo(currentIdx.value - 1)
    }
    function next() {
        goTo(currentIdx.value >= maxIdx.value ? 0 : currentIdx.value + 1)
    }

    function onScroll() {
        const w = cardWidth()
        if (!trackRef.value || w === 0) return
        currentIdx.value = Math.min(maxIdx.value, Math.round(trackRef.value.scrollLeft / (w + GAP)))
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
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
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
                    <img
                        class="fc-bg"
                        :src="story.heroImage"
                        alt=""
                        loading="eager"
                        decoding="async"
                    />

                    <div class="fc-body">
                        <div class="fc-top">
                            <div class="fc-wordmark">
                                <img
                                    v-if="story.logo || story.logoIcon"
                                    :src="story.logo ?? story.logoIcon"
                                    :alt="story.companyName"
                                    loading="eager"
                                />
                                <span v-else class="fc-initial">
                                    {{ story.companyName.charAt(0).toUpperCase() }}
                                </span>
                            </div>
                            <span class="fc-industry">{{ story.industry }}</span>
                        </div>

                        <div class="fc-bottom">
                            <div class="fc-quote-block">
                                <p class="fc-quote">
                                    <span class="fc-quote-mark">“</span>{{ story.quote
                                    }}<span class="fc-quote-mark">”</span>
                                </p>
                                <p class="fc-cite">
                                    <strong>{{ story.quotePerson }}</strong>
                                    <span v-if="story.quotePersonTitle"
                                        >, {{ story.quotePersonTitle }}</span
                                    >
                                </p>
                            </div>

                            <div v-if="story.tasks && story.tasks.length" class="fc-tasks">
                                <div
                                    v-for="task in story.tasks.slice(0, MAX_TASKS)"
                                    :key="task"
                                    class="fc-task"
                                >
                                    <TaskIcon :cls="task" theme="dark" />
                                </div>
                                <div
                                    v-if="story.tasks.length > MAX_TASKS"
                                    class="fc-task fc-task-more"
                                >
                                    +{{ story.tasks.length - MAX_TASKS }}
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>

            <button class="fc-arrow" @click="next" aria-label="Next story">
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
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

<style scoped lang="scss">
    .fc-root {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        grid-template-areas:
            "prev track next"
            "nav  nav   nav";
        align-items: center;
        column-gap: 0.75rem;
        row-gap: 1.5rem;
    }

    .fc-carousel-row {
        display: contents;
    }

    .fc-carousel-row > .fc-arrow:first-child {
        grid-area: prev;
    }
    .fc-carousel-row > .fc-arrow:last-child {
        grid-area: next;
    }

    @include media-breakpoint-down(md) {
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
        display: flex;
        align-items: stretch;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;
        gap: 1rem;
    }

    .fc-track::-webkit-scrollbar {
        display: none;
    }

    .fc-card {
        flex: 0 0 420px;
        scroll-snap-align: start;
    }

    @include media-breakpoint-down(lg) {
        .fc-card {
            flex: 0 0 calc(50% - 0.5rem);
        }
    }

    @include media-breakpoint-down(md) {
        .fc-card {
            flex: 0 0 100%;
        }
    }

    .fc-card {
        position: relative;
        display: flex;
        flex-direction: column;
        min-height: 29rem;
        border-radius: 0.5rem;
        overflow: hidden;
        background: #0e0e10;
        text-decoration: none;
        color: #fff;
        transition: transform 0.25s;
    }

    .fc-card:hover {
        transform: translateY(-2px);
    }

    .fc-bg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
    }

    .fc-card:hover .fc-bg {
        transform: scale(1.03);
    }

    .fc-body {
        position: relative;
        z-index: 1;
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: space-between;
        gap: 2rem;
        padding: 1rem 1.5rem 1.5rem;
        background: linear-gradient(to top, #0e0e10 17.6%, rgba(14, 14, 16, 0.2) 100%);
    }

    .fc-top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem;
    }

    .fc-wordmark {
        display: flex;
        align-items: center;
        min-width: 0;
        width: 13.125rem;
        height: 6.25rem;
    }

    .fc-wordmark img {
        display: block;
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        object-position: left center;
    }

    .fc-initial {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 3rem;
        height: 3rem;
        border-radius: 0.5rem;
        background: rgba(255, 255, 255, 0.12);
        font-size: 1.375rem;
        font-weight: 700;
        color: #fff;
    }

    .fc-industry {
        flex-shrink: 0;
        font-size: 0.75rem;
        font-weight: 600;
        line-height: 1rem;
        color: #08090a;
        background: #fff;
        border-radius: 2.5rem;
        padding: 0.125rem 0.5rem 0.1875rem;
        white-space: nowrap;
    }

    .fc-bottom {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .fc-quote-block {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .fc-quote {
        font-size: 1.125rem;
        line-height: 1.75rem;
        color: #fff;
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 5;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .fc-quote-mark {
        color: #a796ff;
    }

    .fc-cite {
        margin: 0;
        font-size: 0.875rem;
        line-height: 1.25rem;
        color: #adadbf;
    }

    .fc-cite strong {
        font-weight: 700;
    }

    .fc-tasks {
        display: flex;
        gap: 0.8125rem;
        align-items: center;
        flex-wrap: wrap;
    }

    .fc-task {
        width: 2.125rem;
        height: 2.125rem;
        border-radius: 0.25rem;
        border: 1px solid #2e2e3c;
        background: #111115;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.3125rem;
    }

    .fc-task-more {
        font-size: 0.75rem;
        line-height: 1rem;
        color: #7f7f86;
        padding: 0;
    }

    .fc-task :deep(.icon-wrapper),
    .fc-task :deep(.icon) {
        width: 100%;
        height: 100%;
    }

    .fc-task :deep(img) {
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
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.18);
        background: rgba(255, 255, 255, 0.06);
        color: rgba(255, 255, 255, 0.75);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition:
            color 0.15s,
            border-color 0.15s,
            background 0.15s;
        flex-shrink: 0;
    }

    .fc-arrow:hover:not(:disabled) {
        color: #fff;
        border-color: #a78bfa;
        background: rgba(167, 139, 250, 0.15);
    }

    .fc-arrow:disabled {
        opacity: 0.35;
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
        background: rgba(255, 255, 255, 0.25);
        border: none;
        cursor: pointer;
        padding: 0;
        transition:
            background 0.2s,
            width 0.2s;
    }

    .fc-dot.active {
        width: 2.5rem;
        background: #8c4bff;
    }
</style>
