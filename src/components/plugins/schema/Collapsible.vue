<template>
    <details :id="href" :open="open">
        <summary
            class="d-flex align-items-center justify-content-between fw-bold gap-2 collapse-button"
            :class="{collapsed}"
            @click="handleToggle"
        >
            <span>{{ title }}
                <slot name="additional" />
            </span>
            <slot name="right" />
            <span v-if="arrow" class="chevron">
                <component :is="collapsed ? ChevronRight : ChevronDown" />
            </span>
        </summary>
        <div v-if="$slots.content" :id="href + '-body'">
            <div>
                <slot name="content" />
            </div>
        </div>
    </details>
</template>

<script setup lang="ts">
    import {ref, watch, computed} from "vue";
    import ChevronRight from "vue-material-design-icons/ChevronRight.vue";
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue";
    import {useBrowserLocation} from "@vueuse/core";

    const props = withDefaults(defineProps<{
        href?: string,
        title: string,
        arrow?: boolean,
        initiallyExpanded?: boolean
        noUrlChange?: boolean
    }>(), {
        href: Math.random().toString(36).substring(2, 5),
        arrow: true,
        initiallyExpanded: false,
        noUrlChange: false
    });

    const collapsed = ref(true);

    const location = useBrowserLocation();

    const emit = defineEmits(["expand"]);

    const getHash = computed(() => `#${props.href}-body`);

    const handleToggle = (event: Event) => {
        event.preventDefault();
        collapsed.value = !collapsed.value;
        open.value = !collapsed.value;
        if (!collapsed.value) {
            emit("expand");
        }
        if (props.noUrlChange) return;

        const newUrl = window.location.pathname + window.location.search + (!collapsed.value ? getHash.value : "");

        try {
            window.history.pushState(null, "", newUrl);
        } catch {
            try {
                if (!collapsed.value) window.location.hash = getHash.value;
                else window.history.replaceState(null, "", window.location.pathname + window.location.search);
            } catch {
                void 0;
            }
        }
    };

    const open = ref(false);

    watch(
        () => props.initiallyExpanded,
        (initiallyExpanded) => {
            if (initiallyExpanded !== undefined) {
                open.value = initiallyExpanded;
                collapsed.value = !initiallyExpanded;
            }
        }
        , {immediate: true});

    watch(
        () => location.value.hash,
        (hash) => {
            if (hash === getHash.value && collapsed.value) {
                open.value = true;
                collapsed.value = false;
            }
        }
        , {immediate: true});
</script>

<style scoped lang="scss">
    details {
        overflow: hidden;
    }

    .chevron {
        position: relative;
        top: 5px;
    }

    .collapse-button {
        padding: 0;
        border: none;
        background: none;

        &:focus {
            outline: none;
            box-shadow: none;
        }
    }
</style>
