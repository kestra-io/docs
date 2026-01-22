<template>
    <div class="container divider">
        <hr />
    </div>
</template>

<script>
    export default {
        name: "Line",
    }
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    hr {
        margin: 0;
        border: none;
        height: 1px;
        background-color: rgba(255, 255, 255, 0.1);
    }

    .divider {
        margin-top: $rem-5;
        margin-bottom: $rem-5;

        &-md {
            margin-top: $rem-4;
            margin-bottom: $rem-4;
        }
    }
</style>