<script setup lang="ts">
    import { ref, onMounted, onUnmounted } from "vue"
    import TaskIcon from "~/components/common/TaskIcon.vue"

    const MAX_TASKS = 5
    const DRIFT_SPEED = 300
    const HOVER_SPEED = 8
    const DRAG_THRESHOLD = 6
    const STEP_DURATION = 450

    const props = defineProps<{ stories: Story[] }>()

    const trackRef = ref<HTMLElement | null>(null)
    const railRef = ref<HTMLElement | null>(null)
    // Repeated sets of cards so the rail wraps without a seam. Only the
    // EXPOSED copy is in the tab order and the accessibility tree; it is the
    // one the rail rests on, so Tab lands on a visible card.
    const copies = ref(3)
    const EXPOSED = 2
    const dragging = ref(false)
    /** Index of the story resting at the content edge; drives the stepper. */
    const current = ref(0)

    let offset = 0
    let base = 0
    let loopWidth = 0
    let stepWidth = 0
    let bleed = 0
    let frame = 0
    let stepFrame = 0
    let lastTime = 0
    let speed = DRIFT_SPEED
    let targetSpeed = DRIFT_SPEED
    let interacting = false
    let inView = true
    let reducedMotion = false

    function setOffset(x: number) {
        if (!railRef.value || !loopWidth) return
        offset = base + ((((x - base) % loopWidth) + loopWidth) % loopWidth)
        railRef.value.style.transform = `translate3d(${-offset}px, 0, 0)`
        if (stepWidth) {
            current.value = Math.round((offset - base) / stepWidth) % props.stories.length
        }
    }

    function measure() {
        const track = trackRef.value
        const rail = railRef.value
        const card = rail?.querySelector<HTMLElement>(".fc-card")
        if (!track || !rail || !card || !props.stories.length) return
        const gap = parseFloat(getComputedStyle(rail).columnGap) || 0
        const previousLoop = loopWidth
        const previousBase = base
        stepWidth = card.offsetWidth + gap
        loopWidth = props.stories.length * stepWidth
        copies.value = Math.max(3, Math.ceil(track.clientWidth / loopWidth) + 2)
        bleed = track.parentElement!.getBoundingClientRect().left - track.getBoundingClientRect().left
        base = (EXPOSED - 1) * loopWidth - bleed
        // Later measures (resize, orientation change) keep the reader's place.
        const progress = previousLoop ? (offset - previousBase) / previousLoop : 0
        setOffset(base + progress * loopWidth)
    }

    function tick(now: number) {
        const dt = Math.min((now - lastTime) / 1000, 0.1)
        lastTime = now
        speed += (targetSpeed - speed) * Math.min(1, dt * 6)
        setOffset(offset + speed * dt)
        frame = requestAnimationFrame(tick)
    }
    function startDrift() {
        if (frame || stepFrame || interacting || dragging.value || !inView) return
        if (reducedMotion || document.hidden) return
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

    function cancelStep() {
        if (stepFrame) {
            cancelAnimationFrame(stepFrame)
            stepFrame = 0
        }
    }
    /** Glide the rail by `delta` px, then let it drift again. */
    function glide(delta: number) {
        cancelStep()
        stopDrift()
        const from = offset
        if (reducedMotion) {
            setOffset(from + delta)
            startDrift()
            return
        }
        const start = performance.now()
        const run = (now: number) => {
            const t = Math.min(1, (now - start) / STEP_DURATION)
            const eased = 1 - Math.pow(1 - t, 3)
            setOffset(from + delta * eased)
            if (t < 1) {
                stepFrame = requestAnimationFrame(run)
            } else {
                stepFrame = 0
                startDrift()
            }
        }
        stepFrame = requestAnimationFrame(run)
    }
    /** One card forward (1) or back (-1). */
    function step(direction: 1 | -1) {
        if (stepWidth) glide(direction * stepWidth)
    }
    /** Bring story `index` to the content edge, the short way round the loop. */
    function goTo(index: number) {
        if (!stepWidth || !loopWidth) return
        let delta = base + index * stepWidth - offset
        delta = ((delta % loopWidth) + loopWidth) % loopWidth
        if (delta > loopWidth / 2) delta -= loopWidth
        glide(delta)
    }
    function onKeydown(e: KeyboardEvent) {
        if (e.key === "ArrowRight") {
            e.preventDefault()
            step(1)
        } else if (e.key === "ArrowLeft") {
            e.preventDefault()
            step(-1)
        }
    }
    // Focus holds the rail still and, for a keyboard user, brings a card the
    // loop has carried out of view back to the content edge.
    function onFocusIn(e: FocusEvent) {
        pause()
        cancelStep()
        const card = (e.target as HTMLElement).closest<HTMLElement>(".fc-card")
        if (!card || !trackRef.value || !loopWidth || !card.matches(":focus-visible")) return
        const r = card.getBoundingClientRect()
        const t = trackRef.value.getBoundingClientRect()
        const visible = r.left >= t.left + bleed - 1 && r.right <= t.right - bleed + 1
        if (!visible) setOffset(card.offsetLeft - bleed)
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
        cancelStep()
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
        cancelStep()
        stopDrift()
    })
</script>

<template>
    <section
        class="fc-root"
        aria-roledescription="carousel"
        aria-label="Featured customer stories"
        @mouseenter="slow"
        @mouseleave="restore"
        @focusin="onFocusIn"
        @focusout="resume"
        @keydown="onKeydown"
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
                        :aria-hidden="copy !== EXPOSED || undefined"
                        :tabindex="copy !== EXPOSED ? -1 : undefined"
                    >
                        <img
                            class="fc-bg"
                            :src="story.heroImage"
                            alt=""
                            :loading="copy === EXPOSED ? 'eager' : 'lazy'"
                            decoding="async"
                        />

                        <div class="fc-body">
                            <div class="fc-top">
                                <div class="fc-wordmark">
                                    <img
                                        v-if="story.logo || story.logoIcon"
                                        :src="story.logo ?? story.logoIcon"
                                        :alt="story.companyName"
                                        :loading="copy === EXPOSED ? 'eager' : 'lazy'"
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

        <div class="fc-stepper" role="group" aria-label="Choose a featured story">
            <button
                v-for="(story, i) in stories"
                :key="story.slug"
                type="button"
                class="fc-dot"
                :class="{ 'is-active': i === current }"
                :aria-label="`Go to story ${i + 1}: ${story.companyName}`"
                :aria-current="i === current || undefined"
                @click="goTo(i)"
            />
        </div>
    </section>
</template>

<style scoped lang="scss">
    @use "/src/assets/styles/color-palette" as *;

    .fc-root {
        container-type: inline-size;
    }

    /* Full-viewport strip; 100cqw is .fc-root's width, so the bleed is the
       container's side margin. `clip` trims the overflow without making the
       track scrollable, so focusing an off-screen card cannot scroll it out
       of sync with the transform. */
    .fc-track {
        --fc-bleed: calc((100vw - 100cqw) / 2);
        margin-inline: calc(-1 * var(--fc-bleed));
        padding-block: 1.5rem 3rem;
        margin-block: -1.5rem -3rem;
        overflow: clip;
        cursor: grab;
        touch-action: pan-y;
        user-select: none;
        -webkit-user-select: none;
    }

    .fc-track.is-dragging {
        cursor: grabbing;
    }

    .fc-rail {
        position: relative;
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
        background: $base-grey-800;
        text-decoration: none;
        color: $base-grey-white;
        transition:
            transform 300ms ease-out,
            box-shadow 300ms ease-out;
    }

    .fc-card:hover {
        transform: translateY(-16px);
        box-shadow: 0 24px 40px -12px rgba($black, 0.65);
    }

    .fc-card:focus-visible {
        outline: 2px solid $base-primary-300;
        outline-offset: 4px;
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
            $base-grey-800 22%,
            rgba($base-grey-800, 0.9) 48%,
            rgba($base-grey-800, 0.35) 100%
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
        background: rgba($base-grey-white, 0.12);
        font-size: 1.375rem;
        font-weight: 700;
        color: $base-grey-white;
    }

    .fc-industry {
        flex-shrink: 0;
        font-size: 0.75rem;
        font-weight: 600;
        line-height: 1rem;
        color: $base-grey-800;
        background: $base-grey-white;
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
        color: $base-grey-white;
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 5;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .fc-quote-mark {
        color: $base-primary-300;
    }

    .fc-cite {
        margin: 0;
        font-size: 0.875rem;
        line-height: 1.25rem;
        color: $base-grey-300;
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
        border: 1px solid $base-grey-600;
        background: $base-grey-Black;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.3125rem;
    }

    .fc-task-more {
        font-size: 0.75rem;
        line-height: 1rem;
        color: $base-grey-400;
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

    /* Figma "Stepper": 10px dots, the active one stretches into a 64px
       primary gradient pill, 8px apart, centred 32px under the cards. */
    .fc-stepper {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        margin-top: 2rem;
    }

    .fc-dot {
        width: 0.625rem;
        height: 0.625rem;
        padding: 0;
        border: 0;
        border-radius: 0.625rem;
        // Figma's #444459 is off-palette; this is the same tint built from it.
        background: rgba($base-primary-200, 0.28);
        cursor: pointer;
        transition:
            width 0.3s ease,
            background-color 0.3s ease;

        &:hover {
            background: rgba($base-primary-200, 0.5);
        }

        &.is-active {
            width: 4rem;
            background: linear-gradient(90deg, $base-primary-500, $base-primary-200);
        }

        &:focus-visible {
            outline: 2px solid $base-primary-300;
            outline-offset: 3px;
        }

        @media (prefers-reduced-motion: reduce) {
            transition: none;
        }
    }
</style>
