<template>
    <div class="mermaid" v-if="show">
        <slot></slot>
    </div>
</template>

<script setup>
  import mermaid from 'mermaid/dist/mermaid.esm.mjs';

  let show = ref(false);

  onMounted( async() => {
    show.value = true
    await mermaid.initialize({startOnLoad: true })
    await nextTick()
    await mermaid.init();
  })

</script>