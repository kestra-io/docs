<template>
    <div class="change-group" :class="{ open: isOpen }">
        <button
            class="change-group-header"
            type="button"
            :aria-expanded="isOpen"
            :aria-controls="panelId"
            @click="isOpen = !isOpen"
        >
            <component :is="icon" class="group-icon" />
            <span class="group-title">{{ group.title }}</span>
            <span class="group-count">
                {{ group.changes.length }}
                {{ group.changes.length === 1 ? "change" : "changes" }}
            </span>
            <ChevronDown class="group-chevron" />
        </button>

        <Transition name="expand" @enter="enter" @after-enter="afterEnter" @leave="leave">
            <div v-show="isOpen" :id="panelId" class="change-group-panel">
                <ul class="change-list">
                    <li v-for="(change, index) in group.changes" :key="index" class="change">
                        <span class="change-scope">{{ change.scope ?? "—" }}</span>

                        <a
                            v-if="change.sha && commitUrl(change)"
                            class="change-sha"
                            :href="commitUrl(change)"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {{ change.sha }}
                        </a>
                        <span v-else-if="change.sha" class="change-sha">{{ change.sha }}</span>
                        <span v-else class="change-sha placeholder" aria-hidden="true" />

                        <span class="change-message">
                            {{ change.message }}
                            <a
                                v-if="change.pr"
                                class="change-pr"
                                :href="`https://github.com/kestra-io/kestra/issues/${change.pr}`"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                (#{{ change.pr }})
                            </a>
                        </span>
                    </li>
                </ul>
            </div>
        </Transition>
    </div>
</template>

<script lang="ts" setup>
    import { ref, useId, watch } from "vue"
    import BullhornOutline from "vue-material-design-icons/BullhornOutline.vue"
    import RocketLaunchOutline from "vue-material-design-icons/RocketLaunchOutline.vue"
    import BugOutline from "vue-material-design-icons/BugOutline.vue"
    import Autorenew from "vue-material-design-icons/Autorenew.vue"
    import FileDocumentOutline from "vue-material-design-icons/FileDocumentOutline.vue"
    import FlaskOutline from "vue-material-design-icons/FlaskOutline.vue"
    import WrenchOutline from "vue-material-design-icons/WrenchOutline.vue"
    import FormatListChecks from "vue-material-design-icons/FormatListChecks.vue"
    import SourceMerge from "vue-material-design-icons/SourceMerge.vue"
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue"
    import { commitUrl, type ChangelogGroup } from "~/utils/changelog/parseRelease"

    const props = withDefaults(
        defineProps<{
            group: ChangelogGroup
            defaultOpen?: boolean
        }>(),
        { defaultOpen: false },
    )

    const GROUP_ICONS: Record<string, typeof BugOutline> = {
        "breaking-changes": BullhornOutline,
        "features": RocketLaunchOutline,
        "bug-fixes": BugOutline,
        "changes": Autorenew,
        "documentation": FileDocumentOutline,
        "tests": FlaskOutline,
        "build": WrenchOutline,
        "subtasks": FormatListChecks,
        "merge": SourceMerge,
    }

    const isOpen = ref(props.defaultOpen)
    const panelId = `changelog-group-${useId()}`

    watch(
        () => props.defaultOpen,
        (open) => (isOpen.value = open),
    )

    const icon = GROUP_ICONS[props.group.id] ?? Autorenew

    const enter = (el: HTMLElement) => {
        el.style.height = "0"
        void el.offsetHeight
        el.style.height = `${el.scrollHeight}px`
    }

    const afterEnter = (el: HTMLElement) => {
        el.style.height = "auto"
    }

    const leave = (el: HTMLElement) => {
        el.style.height = `${el.scrollHeight}px`
        void el.offsetHeight
        el.style.height = "0"
    }
</script>

<style lang="scss" scoped>
    .change-group {
        background: var(--ks-background-secondary);
        border: 1px solid transparent;
        border-radius: $border-radius-lg;
        overflow: hidden;
        transition: border-color 0.2s ease;

        &:hover,
        &.open {
            border-color: var(--ks-border-primary);
        }
    }

    .change-group-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        padding: 0.75rem 1rem;
        border: 0;
        background: transparent;
        color: var(--ks-content-primary);
        text-align: left;
        cursor: pointer;
    }

    .group-title {
        font-size: 0.875rem;
        font-weight: 600;
    }

    .group-count {
        color: var(--ks-content-tertiary);
        font-size: 0.8125rem;
    }

    .group-icon,
    .group-chevron {
        display: flex;
        flex-shrink: 0;
        color: var(--ks-content-secondary);

        :deep(svg) {
            width: 16px;
            height: 16px;
        }
    }

    .group-chevron {
        margin-left: auto;
        transition: transform 0.2s ease-in-out;
    }

    .change-group.open .group-chevron {
        transform: rotate(180deg);
    }

    .change-list {
        margin: 0;
        padding: 0 1rem;
        list-style: none;
    }

    .change {
        display: grid;
        grid-template-columns: 7rem 5rem minmax(0, 1fr);
        align-items: baseline;
        gap: 0.5rem 1rem;
        padding: 0.625rem 0;
        border-top: 1px solid var(--ks-border-primary);
        font-size: 0.875rem;

        @include media-breakpoint-down(md) {
            grid-template-columns: auto 1fr;
            gap: 0.25rem 0.5rem;

            .change-message {
                grid-column: 1 / -1;
            }
        }
    }

    .change-scope {
        color: var(--ks-content-link);
        font-family: var(--bs-font-monospace);
        font-size: 0.8125rem;
        overflow-wrap: anywhere;
    }

    .change-sha {
        justify-self: start;
        padding: 0.125rem 0.375rem;
        border-radius: $border-radius;
        background: var(--ks-background-tag-category);
        color: var(--ks-content-tag-category);
        font-family: var(--bs-font-monospace);
        font-size: 0.75rem;
        text-decoration: none;

        &:hover {
            color: var(--ks-content-link);
        }

        &.placeholder {
            background: transparent;

            @include media-breakpoint-down(md) {
                display: none;
            }
        }
    }

    .change-message {
        color: var(--ks-content-primary);
        overflow-wrap: anywhere;
    }

    .change-pr {
        color: var(--ks-content-tertiary);
        text-decoration: none;

        &:hover {
            color: var(--ks-content-link);
        }
    }

    .expand-enter-active,
    .expand-leave-active {
        transition: height 0.3s ease-in-out;
        overflow: hidden;
    }

    .expand-enter-from,
    .expand-leave-to {
        height: 0;
    }
</style>
