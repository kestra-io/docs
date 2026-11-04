<template>
    <div class="fixed-top">
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
            </div>
        </div>
    </div>
</template>

<script>
    import ArrowRight from "vue-material-design-icons/ArrowRight.vue"

    export default {
        components: {
            ArrowRight,
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
        }),
        mounted() {
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
</style>
