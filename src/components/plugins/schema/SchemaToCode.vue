<template>
    <div class="code-block" @mouseover="hoverCode" @mouseleave="isHoveringCode = false">
        <div class="language" v-if="language && !isHoveringCode">
            {{ language }}
        </div>
        <template v-if="isHoveringCode">
            <button ref="copyButton" class="copy">
                <component
                    :is="copyIcon"
                    @click="copyToClipboard"
                />
            </button>
            <div ref="copyTooltip" v-if="!!copyIconResetTimer" id="copied-tooltip" role="tooltip">
                Copied!
                <div id="arrow" data-popper-arrow />
            </div>
        </template>
        <div v-html="codeData" />
    </div>
</template>

<script setup lang="ts">
    import {computed, nextTick, ref, shallowRef} from "vue";
    import {createPopper} from "@popperjs/core";
    import ContentCopy from "vue-material-design-icons/ContentCopy.vue";
    import Check from "vue-material-design-icons/Check.vue";

    const icons = {
        ContentCopy: shallowRef(ContentCopy),
        Check: shallowRef(Check)
    } as const

    const props = withDefaults(
        defineProps<{
            highlighter: any;
            code?: string;
            language?: string | null
            filename?: string | null
            highlights?: string[]
            meta?: string | null,
            theme?: string
        }>(), {
            code: "",
            language: null,
            filename: null,
            highlights: () => [],
            meta: null,
            theme: "github-dark"
        })

    const isHoveringCode = ref(false)
    const copyIconResetTimer = ref()
    const copyIcon = shallowRef(icons.ContentCopy.value)
    const copyButton = ref<HTMLButtonElement>()
    const copyTooltip = ref<HTMLDivElement>()

    const codeData = computed(() => props.highlighter.codeToHtml(props.code, {
        lang: props.language,
        theme: props.theme,
    }))

    function hoverCode(){
        isHoveringCode.value = true;
        if(copyIconResetTimer.value) {
            nextTick(() => {
                if(copyButton.value && copyTooltip.value){
                    createPopper(copyButton.value, copyTooltip.value, {
                        placement: "left",
                    });
                }
            });
        }
    }

    function copyToClipboard() {
        clearTimeout(copyIconResetTimer.value);

        navigator.clipboard.writeText(props.code.trimEnd())

        copyIcon.value = icons.Check.value;

        copyIconResetTimer.value = setTimeout(() => {
            copyIcon.value = icons.ContentCopy.value;
            copyIconResetTimer.value = undefined;
        }, 2000)
    }
</script>

<style lang="scss" scoped>
    .code-block {
        padding: 1.25rem;
        border-radius: var(--bs-border-radius-lg);
        position: relative;

        .language {
            font-size: 0.75rem;
        }

        :deep(pre) {
            margin-bottom: 0;
            padding: 0;
            border: 0 !important;
        }

        :deep(.shiki) {
            background-color: transparent !important;
            code {
                display: flex;
                flex-direction: column;
            }
        }

        .copy {
            border: none;
            background: none;

            & .material-design-icon{
                &, & * {
                    height: 1.125rem !important;
                    width: 1.125rem !important;
                }
            }
        }

        .copy, .language {
            position: absolute;
            top: 1.25rem;
            right: 1.25rem;
        }

        #copied-tooltip {
            border-radius: .25rem;
            background: #8997bd;
            padding: 4px 8px;
            font-size: 0.75rem;
            margin-right: 0.2rem !important;

            #arrow,
            #arrow::before {
                position: absolute;
                width: 8px;
                height: 8px;
                background: inherit;
            }

            #arrow {
                visibility: hidden;
                right: -4px;
            }

            #arrow::before {
                visibility: visible;
                content: '';
                transform: rotate(45deg);
            }
        }
    }

    :deep(pre code .line) {
        display: block;
        min-height: 1rem;
        white-space: pre-wrap;
    }
</style>
