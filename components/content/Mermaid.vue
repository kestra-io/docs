<template>
    <div class="mermaid" v-if="show">
        <slot></slot>
    </div>
</template>

<script setup>

  let show = ref(false);

  const { $mermaid } = useNuxtApp()

  onMounted( async() => {
    show.value = true
    $mermaid().initialize({startOnLoad: true })
    await nextTick()
    $mermaid().init();
  })

</script>