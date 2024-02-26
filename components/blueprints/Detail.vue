<template>
<div class="mt-5">
    <h3>About this blueprint</h3>
    <div class="title">
        <p>{{ page.title }}</p>
    </div>

    <ContentRendererMarkdown
        class="bd-markdown"
        :value="description"
    />
</div>
</template>

<script>
export default {
    props: {
        page: {
            type: Object,
            required: true
        },
        description: {
            type: Object,
            required: true
        }
    }
}
</script>
<style scoped lang="scss">
    @import "../../assets/styles/variable";

    h3 {
        color: $white;
        font-size: $h2-font-size;
        font-weight: 300;
    }
    div.title {
        margin: 0 auto calc($spacer / 2);

        p {
            color: $purple-36;
            font-family: $font-family-monospace;
            font-size: $font-size-xl;
            font-weight: 700;
            text-transform: uppercase;
            display: inline;
        }
    }

  :deep(.bd-markdown) {
      color: $white;

      a {
        color: $purple-36;
      }
  }

</style>