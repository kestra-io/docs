<template>
    <Teleport to="body" v-if="isMounted">
        <dialog
            ref="modalRef"
            class="custom-modal"
            v-bind="$attrs"
            @close="onClose"
            @click="onClickOutside"
        >
            <div class="modal-content" @click.stop>
                <slot />
            </div>
        </dialog>
    </Teleport>
</template>

<script setup lang="ts">
    import { ref, onMounted, watch, useTemplateRef } from "vue"

    const show = defineModel<boolean>("show")
    const modalRef = useTemplateRef<HTMLDialogElement>("modalRef")
    const isMounted = ref(false)

    onMounted(() => {
        isMounted.value = true
    })

    const popModal = () => {
        if (!modalRef.value) return
        if (!modalRef.value.open) {
            modalRef.value.showModal()
        }
        document.body.style.overflow = "hidden"
    }

    const closeModal = () => {
        if (!modalRef.value) return
        if (modalRef.value.open) {
            modalRef.value.close()
        }
        document.body.style.overflow = ""
    }

    const onClose = () => {
        show.value = false
        document.body.style.overflow = ""
    }

    const onClickOutside = (event: MouseEvent) => {
        if (event.target === modalRef.value) {
            closeModal()
        }
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
        { immediate: true }
    )
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .custom-modal {
        border: none;
        border-radius: $border-radius-lg;
        padding: 0;
        overflow: visible;
        width: 95vw;
        max-width: 100vw;
        max-height: 90vh;
        background: transparent;
        &::backdrop {
            background-color: rgba(var(--ks-background-tertiary), 0.7);
            backdrop-filter: blur(4px);
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        &[open] {
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease forwards;
            &::backdrop {
                opacity: 1;
            }
        }
        .modal-content {
            background: var(--ks-background-body);
            border-radius: $border-radius-lg;
            box-shadow: $box-shadow-lg;
            width: 100%;
            overflow: auto;
            @include media-breakpoint-up(md) {
                width: 800px;
            }
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
</style>