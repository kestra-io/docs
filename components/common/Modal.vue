<script lang="ts" setup>
const show = defineModel<boolean>("show")
const modalRef = useTemplateRef<HTMLDialogElement>("modalRef")

function popModal() {
  if (!modalRef.value) return;
  modalRef.value.showModal();
}

function closeModal() {
  if (!modalRef.value) return;
  modalRef.value.close();
}

watch(
  show,
  (newVal) => {
    if (newVal) {
      popModal();
    } else {
      closeModal();
    }
  },
  { immediate: true }
);

</script>

<template>
    <teleport to="body">
        <dialog ref="modalRef" v-bind="$attrs">
            <slot/>
        </dialog>
    </teleport>
</template>

<style scoped>
dialog {
    border: none;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 0;
    width: 60%;
    max-width: 90%;
    max-height: 90%;
    overflow: auto;
    animation: fadeOut 1s forwards;

    &::backdrop {
        background-color: #26282d;
        opacity: .5;
    }
    &::backdrop {
        animation: fadeOutHalf 1s forwards;
    }

    &[open] {
        animation: fadeIn 1s forwards;
        &::backdrop {
            animation: fadeInHalf 1s forwards;
        }
    }
}

/* Keyframes for dialog and popover elements */
@keyframes fadeIn {
  from { opacity: 0 }
  to { opacity: 1 }
}
@keyframes fadeOut {
  from { opacity: 1 }
  to { opacity: 0 }
}
@keyframes fadeInHalf {
  from { opacity: 0 }
  to { opacity: .5 }
}
@keyframes fadeOutHalf {
  from { opacity: .5 }
  to { opacity: 0 }
}
</style>
