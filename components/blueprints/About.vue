<template>
<div class="mt-5">
    <h3>About this blueprint</h3>
    <div class="title">
        <p>{{ title }}</p>
    </div>
    <div class="description">{{ description }}</div>
</div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    }
}
</script>

<style scoped lang="scss">
@import "../../assets/styles/variable";
div.title {
    margin: 0 auto calc($spacer / 2);

    p {
        font-size: $font-size-xl;
        color: var(--bs-pink);
        font-weight: 700;
        text-transform: uppercase;
        font-family: var(--bs-font-monospace);
        display: inline;
    }
}
div.description {
  white-space: pre;
  font-size: $font-size-sm;
  line-height: 1.375rem;
  color: black;
}
</style>