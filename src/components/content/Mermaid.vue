<template>
    <div class="mermaid bg-white p-4" v-if="show" >
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

<style lang="scss">
.mermaid {
    border-radius: 10px;
      
    span p {
      color: black;
      font-size: 22px;
    }
}
</style>