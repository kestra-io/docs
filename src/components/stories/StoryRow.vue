<template>
    <div class="sr" @click="navigate">
        <div class="sr-img">
            <img :src="story.featuredImage" :alt="`${story.title} image`" />
            <div class="sr-tasks" v-if="story.tasks?.length">
                <span class="sr-task" v-for="task in story.tasks.slice(0, 4)" :key="task">
                    <TaskIcon :cls="task" />
                </span>
                <span class="sr-task">
                    <img src="/landing/usecases/stories/monograme-kestra.svg" alt="Kestra" />
                </span>
            </div>
        </div>
        <div class="sr-content">
            <h3>{{ story.title }}</h3>
            <blockquote class="sr-quote">{{ story.quote }}</blockquote>
            <small>{{ story.quotePerson }}</small>
            <div class="sr-kpis" v-if="kpis.length">
                <div class="sr-kpi" v-for="(kpi, i) in kpis" :key="i">
                    <CheckboxMultipleMarkedCircleOutlineIcon />
                    <MDCParserAndRenderer :content="kpi" class="sr-kpi-body" />
                </div>
            </div>
            <Link :href="storyUrl" text="Read the Story" class="sr-link" />
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue"
    import { slugify } from "@kestra-io/ui-libs"
    import MDCParserAndRenderer from "../MDCParserAndRenderer.vue"
    import CheckboxMultipleMarkedCircleOutlineIcon from "vue-material-design-icons/CheckboxMultipleMarkedCircleOutline.vue"
    import TaskIcon from "../common/TaskIcon.vue"
    import Link from "../common/Link.vue"

    const props = defineProps<{ story: Story }>()

    const storyUrl = computed(() => `/use-cases/stories/${props.story.id}-${slugify(props.story.title ?? "--")}`)
    const kpis = computed(() => [props.story.kpi1, props.story.kpi2, props.story.kpi3].filter(Boolean) as string[])

    function navigate() {
        window.location.href = storyUrl.value
    }
</script>

<style lang="scss" scoped>
    .sr {
        display: flex;
        align-items: center;
        width: 100%;
        gap: 2rem;
        padding-right: 2rem;
        text-decoration: none;
        color: inherit;
        cursor: pointer;

        @include media-breakpoint-down(lg) {
            flex-direction: column;
            padding-right: 0;
        }
    }

    .sr-img {
        width: 558px;
        border-radius: 0.5rem;
        overflow: hidden;
        flex-shrink: 0;
        position: relative;

        @include media-breakpoint-down(lg) {
            width: 100%;
        }

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 0.5rem;
        }
    }

    .sr-tasks {
        position: absolute;
        bottom: 0.75rem;
        right: 0.75rem;
        display: flex;
        align-items: center;
        gap: 0.375rem;
    }

    .sr-task {
        display: flex;
        align-items: center;
        justify-content: center;
        background: $white;
        padding: 0.25rem;
        border-radius: 0.25rem;
        width: 2rem;
        height: 2rem;

        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        :deep(.icon-wrapper) {
            width: 1.75rem;
            height: 1.75rem;

            .icon {
                width: 100%;
                height: 100%;
                background-size: contain !important;
                background-repeat: no-repeat !important;
                background-position: center !important;
            }
        }
    }

    .sr-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 558px;
        min-height: 312px;
        gap: 0.5rem;
        flex-shrink: 1;

        @include media-breakpoint-down(lg) {
            width: 100%;
            padding: 0 1rem 1rem;
        }

        h3,
        p,
        small {
            margin-bottom: 0;
        }

        h3,
        p {
            color: var(--ks-content-primary);
        }

        small {
            color: var(--ks-content-tertiary);
        }

        p {
            font-size: $font-size-md;
        }

        .sr-quote {
            display: inline;
            padding: 0;
            margin: 0;

            &::before,
            &::after {
                color: var(--ks-content-color-highlight);
            }

            &::before {
                content: "“";
                margin-right: 0.25rem;
            }

            &::after {
                content: "”";
                margin-left: 0.25rem;
            }
        }

        .sr-link {
            margin-top: auto;
            align-self: flex-end;
            color: var(--ks-content-link);
        }
    }

    .sr-kpis {
        display: flex;
        flex-direction: column;
        margin-top: 0.5rem;
    }

    .sr-kpi {
        display: flex;
        gap: 1rem;
        align-items: center;
        padding: 0.25rem 0;

        :deep(svg) {
            font-size: 1.5rem;
            bottom: -0.375rem;
            color: #02BE8A;
        }

        .sr-kpi-body {

            :deep(h5),
            :deep(p) {
                display: inline;
                padding: 0;
                margin: 0;
                font-size: $font-size-sm;
                color: var(--ks-content-primary);
            }

            :deep(h5) {
                margin-right: 0.3rem;
                font-weight: 500;
            }
        }
    }
</style>