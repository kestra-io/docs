<script setup lang="ts">
    import { ref, onMounted, onUnmounted } from "vue"
    import TaskIcon from "~/components/common/TaskIcon.vue"

    const MAX_TASKS = 5
    /** px per second the rail drifts while nobody interacts with it */
    const DRIFT_SPEED = 30
    /** px per second while the pointer is over the strip */
    const HOVER_SPEED = 8
    /** pointer travel before a press counts as a drag rather than a click */
    const DRAG_THRESHOLD = 6

    const props = defineProps<{ stories: Story[] }>()

    const trackRef = ref<HTMLElement | null>(null)
    const railRef = ref<HTMLElement | null>(null)
    // Repeated sets of cards so the rail can wrap without a visible seam; the
    // extra copies are hidden from assistive tech and the tab order.
    const copies = ref(3)
    const dragging = ref(false)

    let offset = 0 // rail translation, kept within [0, loopWidth)
    let loopWidth = 0 // width of one set of cards including the trailing gap
    let frame = 0
    let lastTime = 0
    let speed = DRIFT_SPEED
    let targetSpeed = DRIFT_SPEED
    let interacting = false
    let inView = true
    let reducedMotion = false

    function setOffset(x: number) {
        if (!railRef.value || !loopWidth) return
        offset = ((x % loopWidth) + loopWidth) % loopWidth
        railRef.value.style.transform = `translate3d(${-offset}px, 0, 0)`
    }

    function measure() {
        const track = trackRef.value
        const rail = railRef.value
        const card = rail?.querySelector<HTMLElement>(".fc-card")
        if (!track || !rail || !card || !props.stories.length) return
        const gap = parseFloat(getComputedStyle(rail).columnGap) || 0
        loopWidth = props.stories.length * (card.offsetWidth + gap)
        copies.value = Math.max(3, Math.ceil(track.clientWidth / loopWidth) + 2)
        // Start with the first card on the hero's content edge so the cards
        // before it fill the bleed on the left.
        const bleed = track.parentElement!.getBoundingClientRect().left - track.getBoundingClientRect().left
        setOffset(loopWidth - bleed)
    }

    function tick(now: number) {
        const dt = Math.min((now - lastTime) / 1000, 0.1)
        lastTime = now
        // glide between speeds instead of snapping
        speed += (targetSpeed - speed) * Math.min(1, dt * 6)
        setOffset(offset + speed * dt)
        frame = requestAnimationFrame(tick)
    }
    function startDrift() {
        if (frame || interacting || dragging.value || !inView || reducedMotion || document.hidden) return
        lastTime = performance.now()
        frame = requestAnimationFrame(tick)
    }
    function stopDrift() {
        if (frame) {
            cancelAnimationFrame(frame)
            frame = 0
        }
    }
    function slow() {
        targetSpeed = HOVER_SPEED
    }
    function restore() {
        targetSpeed = DRIFT_SPEED
    }
    // Keyboard focus and dragging hold the rail still; hovering only slows it.
    function pause() {
        interacting = true
        stopDrift()
    }
    function resume() {
        interacting = false
        startDrift()
    }
    function onVisibility() {
        if (document.hidden) stopDrift()
        else startDrift()
    }

    let pointerId: number | null = null
    let startX = 0
    let startOffset = 0
    let moved = false

    function onPointerDown(e: PointerEvent) {
        if (e.pointerType === "mouse" && e.button !== 0) return
        pointerId = e.pointerId
        startX = e.clientX
        startOffset = offset
        moved = false
        stopDrift()
    }
    function onPointerMove(e: PointerEvent) {
        if (e.pointerId !== pointerId) return
        const dx = e.clientX - startX
        if (!moved && Math.abs(dx) < DRAG_THRESHOLD) return
        if (!moved) {
            moved = true
            dragging.value = true
            trackRef.value?.setPointerCapture(e.pointerId)
        }
        setOffset(startOffset - dx)
    }
    function onPointerUp(e: PointerEvent) {
        if (e.pointerId !== pointerId) return
        pointerId = null
        dragging.value = false
        startDrift()
    }
    // A drag must not also follow the card link it started on.
    function onClickCapture(e: MouseEvent) {
        if (!moved) return
        e.preventDefault()
        e.stopPropagation()
        moved = false
    }

    let ro: ResizeObserver
    let io: IntersectionObserver
    onMounted(() => {
        const track = trackRef.value
        if (!track) return
        reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        measure()
        ro = new ResizeObserver(measure)
        ro.observe(track)
        io = new IntersectionObserver(([entry]) => {
            inView = entry.isIntersecting
            if (inView) startDrift()
            else stopDrift()
        })
        io.observe(track)
        document.addEventListener("visibilitychange", onVisibility)
        startDrift()
    })
    onUnmounted(() => {
        document.removeEventListener("visibilitychange", onVisibility)
        ro?.disconnect()
        io?.disconnect()
        stopDrift()
    })
</script>

<template>
    <div
        class="fc-root"
        @mouseenter="slow"
        @mouseleave="restore"
        @focusin="pause"
        @focusout="resume"
    >
        <div
            class="fc-track"
            ref="trackRef"
            :class="{ 'is-dragging': dragging }"
            @pointerdown="onPointerDown"
            @pointermove="onPointerMove"
            @pointerup="onPointerUp"
            @pointercancel="onPointerUp"
            @click.capture="onClickCapture"
            @dragstart.prevent
        >
            <div class="fc-rail" ref="railRef">
                <template v-for="copy in copies" :key="copy">
                    <a
                        v-for="story in stories"
                        :key="`${copy}-${story.slug}`"
                        :href="`/customers/${story.slug}`"
                        class="fc-card"
                        :aria-hidden="copy > 1 || undefined"
                        :tabindex="copy > 1 ? -1 : undefined"
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
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    $ease-out-bounce: linear(
        0,
        0.004,
        0.016,
        0.035,
        0.063,
        0.098,
        0.141,
        0.191,
        0.25,
        0.316,
        0.391,
        0.563,
        0.766,
        1,
        0.891,
        0.813,
        0.785,
        0.813,
        0.891,
        1,
        0.973,
        0.953,
        0.941,
        0.938,
        0.941,
        0.953,
        0.973,
        1
    );

    .fc-root {
        container-type: inline-size;
    }

    /* Full-viewport strip; the hero's overflow clip trims it. 100cqw is
       .fc-root's width, so the bleed is the container's side margin. */
    .fc-track {
        --fc-bleed: calc((100vw - 100cqw) / 2);
        margin-inline: calc(-1 * var(--fc-bleed));
        /* Breathing room for the hover lift and shadow; the negative block
           margins keep the strip's footprint unchanged. */
        padding-block: 1.5rem 3rem;
        margin-block: -1.5rem -3rem;
        overflow: hidden;
        cursor: grab;
        touch-action: pan-y;
        user-select: none;
        -webkit-user-select: none;
    }

    .fc-track.is-dragging {
        cursor: grabbing;
    }

    .fc-rail {
        display: flex;
        align-items: stretch;
        gap: 1rem;
        will-change: transform;
    }

    .fc-card {
        flex: 0 0 min(420px, calc(100vw - 3rem));
        position: relative;
        display: flex;
        flex-direction: column;
        min-height: 29rem;
        border-radius: 0.5rem;
        overflow: hidden;
        background: #0e0e10;
        text-decoration: none;
        color: #fff;
        transition:
            transform 300ms $ease-out-bounce,
            box-shadow 300ms ease-out;
    }

    .fc-card:hover {
        transform: translateY(-16px);
        box-shadow: 0 24px 40px -12px rgba(0, 0, 0, 0.65);
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
        background: linear-gradient(
            to top,
            #0e0e10 22%,
            rgba(14, 14, 16, 0.9) 48%,
            rgba(14, 14, 16, 0.35) 100%
        );
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
</style>
