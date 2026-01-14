<template>
    <div ref="colRef" class="col-md-4 mb-4 story-sidebar-col">
        <div class="sidebar-wrapper">
            <div ref="infoRef" :style="style" class="info">
                <div class="block" v-for="block in infoBlocks" :key="block.title">
                    <p class="title">{{ block.title }}</p>
                    <p class="sub">{{ block.value }}</p>
                </div>

                <div class="block">
                    <p class="title mb-2">Data Stack</p>
                    <div class="d-flex flex-column gap-2 justify-content-start">
                        <div class="card task">
                            <div class="body">
                                <div ref="root" class="icon-wrapper" data-bs-toggle="tooltip" data-bs-placement="top"
                                    title="Kestra">
                                    <img src="/landing/usecases/stories/monograme-kestra.svg" alt="Kestra">
                                </div>
                                <p class="card-title">Kestra</p>
                            </div>
                        </div>
                        <div class="card task" v-for="task in story.tasks" :key="task">
                            <div class="body">
                                <CommonTaskIcon :cls="task" />
                                <p class="card-title">{{ generateTagName(task) }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="block pt-4 w-100 d-flex justify-content-center">
                    <NuxtLink href="/demo" class="btn-grad mx-auto">
                        Book a demo
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, onMounted, reactive, ref } from "vue";
    import { useWindowScroll, useEventListener } from "@vueuse/core";

    const props = defineProps<{
        story: {
            industry: string;
            headquarter: string;
            solution: string;
            tasks: string[];
        };
    }>();

    const root = ref<HTMLElement | null>(null);
    const colRef = ref<HTMLElement | null>(null);
    const infoRef = ref<HTMLElement | null>(null);

    const { y } = useWindowScroll();
    const style = reactive({
        position: "static",
        top: "",
        width: "",
        bottom: ""
    });
    const BOTTOM = 32;
    const infoBlocks = computed(() => [
        {
            title: 'Industry',
            value: props.story.industry
        },
        {
            title: 'Headquarters',
            value: props.story.headquarter
        },
        {
            title: 'Solution',
            value: props.story.solution
        }
    ]);

    function reset() {
        Object.assign(style, {
            position: "static",
            top: "",
            width: "",
            bottom: "",
        });
        if (colRef.value) colRef.value.style.position = "";
    }

    function apply() {
        const col = colRef.value, info = infoRef.value;
        if (!col || !info || window.matchMedia("(max-width: 768px)").matches) return reset();

        const scrollTop = y.value;
        const colRect = col.getBoundingClientRect();
        const container = col.parentElement!;
        const containerRect = container.getBoundingClientRect();
        const containerBottom = containerRect.top + scrollTop + container.offsetHeight;
        const infoH = info.offsetHeight;
        const colTop = colRect.top + scrollTop;

        if (scrollTop > colTop && scrollTop + infoH < containerBottom - BOTTOM) {
            Object.assign(style, {
                position: "fixed",
                top: "90px",
                width: `${Math.round(colRect.width)}px`,
                bottom: "",
            });
            col.style.position = "";
        } else if (scrollTop + infoH >= containerBottom - BOTTOM) {
            Object.assign(style, {
                position: "absolute",
                top: "auto",
                bottom: `${BOTTOM}px`,
                width: "100%",
            });
            col.style.position = "relative";
        } else {
            reset();
        }
    }

    useEventListener(window, "scroll", apply, { passive: true });
    useEventListener(window, "resize", apply, { passive: true });

    onMounted(() => {
        if (root.value) new window.$bootstrap.Tooltip(root.value);
        apply();
    });

    const generateTagName = (task: string) => {
        const name = task.split('.').pop() ?? '';
        return name.length > 13 ? name.slice(0, 13) + '...' : name;
    };
</script>

<style scoped lang="scss">
    @import "~/assets/styles/_variable";

    .info {
        position: sticky;
        top: 2rem;
        z-index: 10;
        max-height: calc(100vh - 4rem);
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;

        @include media-breakpoint-up(xl) {
            max-width: 315px;
        }

        margin-bottom: 1rem;
        padding: 2rem;
        background-color: $white;
        border: 1px solid $white-1;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.05);

        @media (max-width: 768px) {
            position: static;
            top: auto;
            max-height: none;
            overflow: visible;
        }

        .block {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            width: 100%;

            .title {
                font-size: $font-size-sm;
                font-weight: 700;
                color: $black-2;
                text-transform: uppercase;
                margin: 0;
            }

            .sub {
                font-size: $font-size-base;
                font-weight: 400;
                color: $white-5;
                margin: 0;
            }
        }
    }

        .card {
            border: none;
            background-color: transparent;
            box-shadow: none;
            width: 100%;
            padding: 0;

            .body {
                display: flex;
                flex-direction: row;
                align-items: center;
                padding: 0;
                gap: 1rem;
            }

            .card-title {
                font-size: $font-size-sm;
                font-weight: 600;
                margin: 0;
                color: $black-2;
            }
        }

        .task {
            background-color: transparent;

            :deep(.icon-wrapper) {
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            img {
                width: 32px;
                height: 32px;
                object-fit: contain;
            }
        }

        .btn-grad {
            display: flex;
            width: 202px;
            height: 50px;
            padding: 8px 20px;
            justify-content: center;
            align-items: center;
            gap: 10px;
            margin: 0 auto !important;

            border-radius: 8px;
            border: 1px solid $white;
            background: linear-gradient(180deg, #694EFF 0%, #5233FF 104.54%);
            box-shadow: 2px 2px 11px 0 rgba(0, 0, 0, 0.45), 0 0 14px 0 #BE62FF inset;

            color: $white !important;
            font-weight: 600;
            text-decoration: none;

            &:hover {
                opacity: 0.9;
                color: $white !important;
            }
        }
</style>