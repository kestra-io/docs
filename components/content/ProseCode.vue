<script>
    import {defineComponent} from "#imports";
    import { createPopper } from "@popperjs/core";

    import ContentCopy from "vue-material-design-icons/ContentCopy.vue";
    import Check from "vue-material-design-icons/Check.vue";
    import Mermaid from "~/components/content/Mermaid.vue";

    export default defineComponent({
        props: {
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
        },
        data() {
            return {
                icons: shallowRef({
                    ContentCopy: shallowRef(ContentCopy),
                    Check: shallowRef(Check)
                }),
                copyIcon: undefined,
                copyIconResetTimer: undefined,
                isHoveringCode: false
            }
        },
        created() {
            this.copyIcon = this.icons.ContentCopy;
        },
        methods: {
            hoverCode(){
                this.isHoveringCode = true;
                if(this.copyIconResetTimer) {
                    nextTick(() => {
                        createPopper(this.$refs.copyButton, this.$refs.copyTooltip, {
                            placement: 'left',
                        });
                    });
                }
            },
            copyToClipboard() {
                clearTimeout(this.copyIconResetTimer);

                navigator.clipboard.writeText(this.code.trimEnd())

                this.copyIcon = this.icons.Check;

                this.copyIconResetTimer = setTimeout(() => {
                    this.copyIcon = this.icons.ContentCopy;
                    this.copyIconResetTimer = undefined;
                }, 2000)
            }
        }
    });
</script>

<template>
    <template v-if="language === 'mermaid'">
        <Mermaid>
            {{code}}
        </Mermaid>
    </template>
    <div class="code-block mb-3" @mouseover="hoverCode" @mouseleave="isHoveringCode = false" v-else>
        <div class="language" v-if="language">{{ language }}</div>
        <template v-if="isHoveringCode">
            <button ref="copyButton" class="copy">
                <component
                    :is="copyIcon"
                    @click="copyToClipboard"
                />
            </button>
            <div ref="copyTooltip" v-if="!!copyIconResetTimer" id="copied-tooltip" role="tooltip">
                Copied!
                <div id="arrow" data-popper-arrow></div>
            </div>
        </template>
        <slot />
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

        .language {
            position: absolute;
            right: 0.35rem;
            top: 0.25rem;
            color: var(--bs-gray-600);
            font-size: calc($font-size-base * .75);
        }

        :deep(pre) {
            overflow: hidden;
            margin-bottom: 0;

            code {
                padding: 0;
                color: var(--bs-white) !important;
            }
        }

        .copy {
            position: absolute;
            right: 0;
            bottom: 0.1rem;
            color: $gray-600;
            border: none;
            background: none;
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

    :deep(pre code .line) {
        white-space: pre-wrap;
        display: block;
        min-height: 1rem;
    }
</style>
