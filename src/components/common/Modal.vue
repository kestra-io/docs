<script lang="ts" setup>
    import { useTemplateRef, watch, ref, onMounted } from "vue"

    const show = defineModel<boolean>("show")
    const modalRef = useTemplateRef<HTMLDialogElement>("modalRef")
    const isMounted = ref(false)

    onMounted(() => {
        isMounted.value = true
    })

    function popModal() {
        if (!modalRef.value) return
        modalRef.value.showModal()
    }

    function closeModal() {
        if (!modalRef.value) return
        modalRef.value.close()
    }

    watch(
        show,
        (newVal) => {
            if (newVal) {
                popModal()
            } else {
                closeModal()
            }
        },
        { immediate: true },
    )
</script>

<template>
    <Teleport to="body" v-if="isMounted">
        <dialog ref="modalRef" v-bind="$attrs">
            <slot />
        </dialog>
    </Teleport>
</template>

<style scoped>
    dialog {
        border: none;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        padding: 0;
        overflow: auto;
        animation: fadeOut 1s forwards;
        display: inline-block;
        width: 90%;
        z-index: -1;

        @media screen and (min-width: 820px) {
            width: 800px;
        }

        &::backdrop {
            background-color: #26282d;
            backdrop-filter: blur(2px);
            opacity: 0.5;
        }
        &::backdrop {
            animation: fadeOutHalf 1s forwards;
        }

        &[open] {
            z-index: 1050;
            animation: fadeIn 1s forwards;
            &::backdrop {
                animation: fadeInHalf 1s forwards;
            }
        }
    }

    /* Keyframes for dialog and popover elements */
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    @keyframes fadeInHalf {
        from {
            opacity: 0;
        }
        to {
            opacity: 0.5;
        }
    }
    @keyframes fadeOutHalf {
        from {
            opacity: 0.5;
        }
        to {
            opacity: 0;
        }
    }
</style>