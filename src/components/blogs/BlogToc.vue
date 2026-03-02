<template>
    <div class="toc">
        <button
            class="btn toggle d-lg-none"
            :class="{ collapsed: !tableOfContentsExpanded }"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#tocContents"
            :aria-expanded="tableOfContentsExpanded"
            aria-controls="tocContents"
            @click="tableOfContentsExpanded = !tableOfContentsExpanded"
        >
            <span class="label">Table of contents</span>
            <span class="chevron" aria-hidden>
                <ChevronUp v-if="tableOfContentsExpanded" />
                <ChevronDown v-else />
            </span>
        </button>

        <div class="collapse bd-toc-collapse" id="tocContents">
            <h6 class="title d-none d-lg-block">Table of contents</h6>
            <nav id="nav-toc">
                <ul class="list">
                    <li
                        v-for="link in links"
                        :key="link.id"
                        class="item"
                        :class="{ active: activeLinkId === link.id }"
                    >
                        <a
                            :href="`#${link.id}`"
                            @click.prevent="scrollTo(link.id)"
                            :class="`depth-${link.depth}`"
                        >
                            {{ link.text }}
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted, onUnmounted } from "vue"
    import ChevronUp from "vue-material-design-icons/ChevronUp.vue"
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue"

    const tableOfContentsExpanded = ref(false)

    interface Heading {
        text: string
        id: string
        depth: number
    }

    const props = defineProps<{
        links: Heading[]
    }>()

    const activeLinkId = ref<string>("")

    const scrollTo = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            const offset = 100 // Adjust based on sticky header height
            const bodyRect = document.body.getBoundingClientRect().top
            const elementRect = element.getBoundingClientRect().top
            const elementPosition = elementRect - bodyRect
            const offsetPosition = elementPosition - offset

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            })
            
            history.pushState(null, "", `#${id}`)
            activeLinkId.value = id
        }
    }

    const updateActiveLink = () => {
        const headings = props.links.map(link => document.getElementById(link.id)).filter(el => el !== null) as HTMLElement[]
        
        const scrollPosition = window.scrollY + 120 // offset

        for (let i = headings.length - 1; i >= 0; i--) {
            if (scrollPosition >= headings[i].offsetTop) {
                activeLinkId.value = props.links[i].id
                return
            }
        }
        
        if (headings.length > 0 && scrollPosition < headings[0].offsetTop) {
            activeLinkId.value = ""
        }
    }

    onMounted(() => {
        window.addEventListener("scroll", updateActiveLink)
        updateActiveLink()
    })

    onUnmounted(() => {
        window.removeEventListener("scroll", updateActiveLink)
    })
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .title {
        color: var(--ks-content-primary);
        margin-bottom: 1rem;
        font-weight: 700;
        font-size: 1rem;
    }

    .toggle {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid var(--ks-border-secondary);
        border-radius: 8px;
        background: var(--ks-background-body);
        color: var(--ks-content-primary);
        font-size: $font-size-sm;
        font-weight: 600;
        margin-bottom: 1rem;

        &.collapsed {
            margin-bottom: 0;
        }

        .chevron {
            display: flex;
            align-items: center;
            font-size: 1.25rem;
            color: var(--ks-content-secondary);
        }
    }

    .bd-toc-collapse {
        @include media-breakpoint-up(lg) {
            display: block !important;
        }
    }

    .list {
        list-style: none;
        padding-left: 0;
        margin-bottom: 0;
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
    }

    .item {
        border-left: 1px solid transparent;

        a {
            display: block;
            color: var(--ks-content-secondary);
            text-decoration: none;
            font-size: $font-size-sm;
            line-height: 1.4;
            transition: color 0.2s ease;
            
            &:hover {
                color: var(--ks-content-link);
            }

            @for $i from 1 through 6 {
                &.depth-#{$i} {
                    padding-left: ($i - 2) * 1rem + 1rem;
                }
            }
        }

        &.active {
            border-left: 2px solid var(--ks-content-link);
            a {
                color: var(--ks-content-link);
                font-weight: 500;
            }
        }
    }
</style>
