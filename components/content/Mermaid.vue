<template>
    <div class="mermaid" v-if="show">
        <slot></slot>
    </div>
</template>

<script setup>
  import mermaid from "mermaid/dist/mermaid"

  let show = ref(false);


  onMounted( async() => {
    show.value = true
    mermaid().initialize({startOnLoad: true })
    await nextTick()
    mermaid().init();
  })

</script>