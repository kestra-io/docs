<template>
    <div align="center">
        <figure>
        <img :src="src" :width="width" :alt="caption"/>
        <figcaption><small>{{ caption }}</small></figcaption>
        </figure>
    </div>
</template>
<script>
  export default {
    props: ['src', 'width', 'caption'],
    // computed: {
    //   imagesrc () {
    //     return this.src
    //   }
    // }
  }
</script>
  