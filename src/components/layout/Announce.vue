<template>
    <div v-if="!dismissed" class="fixed-top">
        <div class="announce">
            <div class="alert alert-primary" :class="{ scrolled: scrolled }">
                <ul>
                    <li
                        v-for="(slide, index) in content"
                        :key="index"
                        :class="{
                            active: index === current,
                            leaving: content.length > 1 && index === previous,
                        }"
                        @mouseenter="paused = true"
                        @mouseleave="paused = false"
                    >
                        <a
                            :href="slide.href"
                            :target="
                                slide.href.startsWith('http')
                                    ? '_blank'
                                    : undefined
                            "
                            :rel="
                                slide.href.startsWith('http')
                                    ? 'noopener'
                                    : undefined
                            "
                        >
                            <span class="text-truncate">
                                <strong v-if="slide.tag">{{
                                    slide.tag
                                }}</strong>
                                <span v-if="slide.linkText" class="link-text">{{
                                    slide.linkText
                                }}</span>
                                {{ slide.text }}
                                <em v-if="slide.tail">{{ slide.tail }}</em>
                            </span>
                            <ArrowRight />
                        </a>
                    </li>
                </ul>
                <button
                    type="button"
                    class="dismiss"
                    aria-label="Close the announcement"
                    @click="dismiss"
                >
                    <Close />
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import ArrowRight from "vue-material-design-icons/ArrowRight.vue"
    import Close from "vue-material-design-icons/Close.vue"

    const DISMISSED_KEY = "announce-dismissed"

    export default {
        components: {
            ArrowRight,
            Close,
        },
        props: {
            content: {
                type: Object,
                required: true,
            },
            scrolled: {
                type: Boolean,
                required: false,
            },
        },
        data: () => ({
            current: 0,
            previous: -1,
            paused: false,
            timer: null,
            dismissed: false,
        }),
        computed: {
            // Dismissing hides this set of announcements only; a new one shows.
            contentKey() {
                return this.content.map((slide) => slide.id).join(",")
            },
        },
        mounted() {
            try {
                if (localStorage.getItem(DISMISSED_KEY) === this.contentKey) {
                    this.dismiss()
                    return
                }
            } catch {
                // Storage can be blocked; the bar just shows.
            }
            if (this.content.length < 2) return
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
                return
            this.timer = setInterval(() => {
                if (this.paused) return
                this.previous = this.current
                this.current = (this.current + 1) % this.content.length
            }, 5000)
        },
        beforeUnmount() {
            clearInterval(this.timer)
        },
        methods: {
            dismiss() {
                this.dismissed = true
                clearInterval(this.timer)
                // Drops the space app.scss keeps for the bar.
                document.body.classList.remove("has-annonces")
                try {
                    localStorage.setItem(DISMISSED_KEY, this.contentKey)
                } catch {
                    // Storage can be blocked; the bar comes back next visit.
                }
            },
        },
    }
</script>

<style lang="scss" scoped>
    .fixed-top {
        z-index: 1031;
    }

    .announce {
        .alert {
            border-radius: 0;
            border: 0;
            background: #631bff;
            color: $white;
            margin-bottom: 0;
            position: relative;
            z-index: 1;
            overflow: hidden;
            height: 2.5rem;
            padding: 0;
        }
    }

    ul {
        list-style: none;
        margin: 0;
        padding: 0 $spacer;
        height: 100%;
        display: grid;
        align-items: center;
        justify-items: center;
    }

    li {
        grid-area: 1 / 1;
        max-width: 100%;
        min-width: 0;
        display: flex;
        opacity: 0;
        visibility: hidden;
        transform: translateY(12px);
        transition:
            opacity 0.5s ease,
            transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
            visibility 0.5s;

        &.active {
            opacity: 1;
            visibility: visible;
            transform: none;
            transition-delay: 0.15s;
        }

        &.leaving {
            transform: translateY(-12px);
        }
    }

    a {
        display: flex;
        align-items: center;
        min-width: 0;
        font-size: 0.8125rem;
        line-height: 20px;
        color: rgba($white, 0.85);
        text-decoration: none;
        transition: color 0.2s ease;

        strong {
            font-weight: 600;
            color: $white;
            margin-right: 0.5rem;
        }

        em {
            font-style: italic;
        }

        :deep(.material-design-icon) {
            flex-shrink: 0;
            margin-left: 0.5rem;
            transition: transform 0.2s ease-in-out;

            svg {
                width: 1rem;
                height: 1rem;
            }
        }

        &:hover {
            color: $white;

            :deep(.material-design-icon) {
                transform: translateX(2px);
            }
        }
    }

    .text-truncate {
        min-width: 0;
    }

    .dismiss {
        display: none;
        position: absolute;
        top: 50%;
        right: 1rem;
        padding: 0.25rem;
        border: 0;
        background: none;
        color: rgba($white, 0.8);
        line-height: 0;
        transform: translateY(-50%);
        transition: color 0.2s ease;

        &:hover,
        &:focus-visible {
            color: $white;
        }

        :deep(svg) {
            width: 1.125rem;
            height: 1.125rem;
        }
    }

    // The homepage's quieter menu (body[data-header-clean]) pairs with a
    // plain black bar: one white sentence and an arrow, and a close button.
    // Written as whole global selectors: Vue drops nested :global() blocks.
    :global(body[data-header-clean] .announce .alert) {
        background: #000000;
    }

    :global(body[data-header-clean] .announce .dismiss) {
        display: block;
    }

    :global(body[data-header-clean] .announce ul) {
        padding-inline: 3rem;
    }

    :global(body[data-header-clean] .announce a) {
        color: $white;
    }

    :global(body[data-header-clean] .announce a strong) {
        display: none;
    }

    :global(body[data-header-clean] .announce a em) {
        font-style: normal;
    }
</style>
