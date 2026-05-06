<template>
    <div class="cards">
        <a :href="resource.path">
            <div class="cover" :style="coverStyle">
                <span class="tag" :style="tagStyleVars">{{ tagName }}</span>
                <h3 class="title">{{ resource.title }}</h3>
            </div>
            <div class="content">
                <small v-if="formattedDate" class="meta">{{ formattedDate }}</small>
                <p v-if="resource.description" class="description">
                    {{ resource.description }}
                </p>
            </div>
        </a>
    </div>
</template>

<script setup lang="ts">
    import { computed } from "vue"
    import { tagLabel, tagStyle, tagTheme, type ResourceTag } from "./tags"
    import dataBg from "~/assets/landing/data/desk-bkg-Data.webp?url"
    import aiBg from "~/assets/landing/ai/desk-bkg-AI.webp?url"
    import infraBg from "~/assets/landing/infrastructure/desk-bkg-infra.webp?url"

    const props = defineProps<{
        resource: {
            path: string
            title: string
            description?: string
            tag: ResourceTag
            image?: string
            date?: string | Date
        }
    }>()

    const bgByTag: Partial<Record<ResourceTag, string>> = {
        data: dataBg,
        ai: aiBg,
        infrastructure: infraBg,
    }

    const tagName = computed(() => tagLabel[props.resource.tag])
    const tagStyleVars = computed(() => tagStyle(props.resource.tag))

    const coverStyle = computed(() => {
        if (props.resource.image) {
            return `background-image: url(${props.resource.image});`
        }
        const bg = bgByTag[props.resource.tag]
        if (bg) return `background-image: url(${bg});`
        const t = tagTheme[props.resource.tag]
        return `background: radial-gradient(circle at 30% 20%, ${t.borderFrom}33 0%, transparent 55%), linear-gradient(135deg, #0e0e11 0%, ${t.text}22 100%);`
    })

    const formattedDate = computed(() => {
        if (!props.resource.date) return ""
        return new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        }).format(new Date(props.resource.date)).replace(",", "")
    })
</script>

<style lang="scss" scoped>
    .cards {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        cursor: pointer;

        a {
            text-decoration: none;
            display: block;
        }

        .cover {
            position: relative;
            width: 100%;
            aspect-ratio: 16 / 9;
            border-radius: 12px;
            overflow: hidden;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            padding: 1.25rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-start;
            transition: transform 0.3s ease;

            &::after {
                content: "";
                position: absolute;
                inset: 0;
                background: linear-gradient(
                    180deg,
                    rgba(0, 0, 0, 0) 40%,
                    rgba(0, 0, 0, 0.55) 100%
                );
                pointer-events: none;
            }

            .tag,
            .title {
                position: relative;
                z-index: 1;
            }

            .title {
                font-family: var(--font-family-mona-sans, inherit);
                color: #ffffff;
                font-weight: 600;
                font-size: clamp(1.125rem, 1.75vw, 1.375rem);
                line-height: 1.2;
                margin: 0;
                text-shadow:
                    0 2px 12px rgba(0, 0, 0, 0.45),
                    0 1px 2px rgba(0, 0, 0, 0.35);
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
        }

        &:hover .cover {
            transform: translateY(-2px);
        }

        .tag {
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 4px 0.75rem;
            border-radius: 2.5rem;
            background: #0e0e11;
            color: var(--tag-text, #fdffce);
            font-weight: 600;
            font-size: $font-size-xs;
            white-space: nowrap;

            &::before {
                content: "";
                position: absolute;
                inset: 0;
                border-radius: 2.5rem;
                padding: 1px;
                background: linear-gradient(
                    90deg,
                    var(--tag-border-from, #e6c359) 0%,
                    var(--tag-border-to, #fffee9) 100%
                );
                -webkit-mask:
                    linear-gradient(#fff 0 0) content-box,
                    linear-gradient(#fff 0 0);
                -webkit-mask-composite: xor;
                mask-composite: exclude;
                z-index: -1;
            }
        }

        .content {
            display: flex;
            flex-direction: column;
            gap: 0.35rem;

            .meta {
                color: var(--ks-content-tertiary);
                font-size: $font-size-xs;
                margin: 0;
            }

            .description {
                color: var(--ks-content-secondary);
                font-size: $font-size-sm;
                margin: 0;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
        }
    }
</style>
