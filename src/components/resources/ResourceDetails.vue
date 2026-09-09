<template>
    <div class="wrap">
        <div>
            <h6>Topic</h6>
            <small class="metadata">
                <a :href="`/resources/${resource.data.tag}`">
                    <span class="tag" :style="tagStyleVars">{{ tagName }}</span>
                </a>
            </small>
        </div>
        <div v-if="date">
            <h6>Last Updated</h6>
            <small class="metadata">{{ date }}</small>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from "vue"
    import dayjs from "dayjs"
    import { tagLabel, tagStyle, type ResourceTag } from "./tags"

    const props = defineProps<{
        resource: {
            data: {
                tag: ResourceTag
                date?: string | Date
            }
        }
    }>()

    const tagName = computed(() => tagLabel[props.resource.data.tag])
    const tagStyleVars = computed(() => tagStyle(props.resource.data.tag))

    const date = computed(() => {
        if (!props.resource.data.date) return ""
        return dayjs(props.resource.data.date).format("MMMM D YYYY")
    })
</script>

<style lang="scss" scoped>
    .wrap {
        display: contents;

        @include media-breakpoint-down(md) {
            display: none;
        }
    }

    h6 {
        margin-bottom: 0.5rem;
    }

    .metadata {
        color: var(--ks-content-primary);
        font-size: $font-size-xs;

        a {
            text-decoration: none;
        }

        .tag {
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: fit-content;
            padding: 4px 0.75rem;
            border-radius: 2.5rem;
            background: transparent;
            color: var(--tag-text, var(--ks-content-tag-category));
            font-weight: 600;
            font-size: $font-size-xs;
            white-space: nowrap;
            z-index: 1;

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
    }
</style>
