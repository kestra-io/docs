<script setup>
    import {onMounted} from "#imports";
    import { createPopper } from "@popperjs/core";

    import ContentCopy from "vue-material-design-icons/ContentCopy.vue";
    import Check from "vue-material-design-icons/Check.vue";
    import Mermaid from "~/components/content/Mermaid.vue";
    import useShiki from "~/composables/useShiki";

    const {highlightCodeBlocks} = useShiki();

    const props = defineProps({
            code: {
                type: String,
                default: ""
            },
            language: {
                type: String,
                default: null
            },
            filename: {
                type: String,
                default: null
            },
            highlights: {
                type: Array,
                default: () => []
            },
            meta: {
                type: String,
                default: null
            }
        })

        const copied = ref(false);
        const isHoveringCode = ref(false);
        const copyIconResetTimer = ref(undefined);
        const copyButton = ref(null);
        const copyTooltip = ref(null);

        const codeBlock = ref(null);

        onMounted(() => {
            if(codeBlock.value){
                highlightCodeBlocks(codeBlock.value);
            }
        })


        function hoverCode(){
            isHoveringCode.value = true;
            if(copyIconResetTimer.value) {
                nextTick(() => {
                    createPopper(copyButton.value, copyTooltip.value, {
                        placement: 'left',
                    });
                });
            }
        }

        function copyToClipboard() {
            clearTimeout(copyIconResetTimer.value);
            copied.value = true;

            navigator.clipboard.writeText(props.code.trimEnd())

            copyIconResetTimer.value = setTimeout(() => {
                copied.value = false;
                copyIconResetTimer.value = undefined;
            }, 2000)
        }
</script>

<template>
    <template v-if="language === 'mermaid'">
        <Mermaid>
            {{code}}
        </Mermaid>
    </template>
    <div v-else class="code-block" @mouseover="hoverCode" @mouseleave="isHoveringCode = false" ref="codeBlock">
        <div class="language" v-if="language && !isHoveringCode">
            {{ language }}
        </div>
        <template v-if="isHoveringCode">
            <button ref="copyButton" @click="copyToClipboard" class="copy">
                <Check v-if="copied" />
                <ContentCopy v-else />
            </button>
            <div ref="copyTooltip" v-if="!!copyIconResetTimer" id="copied-tooltip" role="tooltip">
                Copied!
                <div id="arrow" data-popper-arrow />
            </div>
        </template>
        <pre v-bind="$attrs"><slot /></pre>
    </div>
</template>

<style lang="scss" scoped>
    @import "../../assets/styles/_variable.scss";

    .code-block {
        background-color: $black-2;
        border: $block-border;
        padding: 1.25rem 1.5rem;
        border-radius: var(--bs-border-radius-lg);
        color: var(--bs-white);
        position: relative;
        margin-bottom: 1em;

        .language {
            font-size: 0.75rem;
        }

        pre {
            overflow: hidden;
            margin-bottom: 0;
        }

        .language, .copy {
            color: var(--kestra-io-neutral-gray700) !important;
            position: absolute;
            top: 1.25rem;
            right: 1.25rem;
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

        #copied-tooltip {
            border-radius: $border-radius;
            background: $gray-500;
            padding: 4px 8px;
            font-size: $font-size-xs;
            margin-right: $popper-margin !important;

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

    pre :deep(code .line) {
        white-space: pre-wrap;
        display: block;
        min-height: 1rem;
    }

    pre :deep(code) {
        opacity: 0;
    }

    pre.shiki :deep(code){
        opacity: 1;
    }
</style>
