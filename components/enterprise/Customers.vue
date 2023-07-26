<template>
    <div class="container-fluid">
        <div class=" container text-center">
            <p class="companies-title">
                Loved & trusted by leading enterprises worldwide
            </p>
        </div>

        <div class="container-fluid pt-4 pb-4">
            <Companies :inverted="true" />
        </div>
    </div>
</template>

<script>
    import Companies from "../layout/Companies.vue";

    export default {
        components: {Companies},
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container {
        padding-top: 80px;
        margin-top: -70px;

        .companies-title {
            position: relative;

            &:after {
                content: '';
                position: absolute;
                left: 50%;
                bottom: calc(-1 * var(--spacer));
                transform: translateX(-50%);
                top: 2.5rem;
                display: inline-block;
                height: 2px;
                width: 51px;
                background: var(--bs-pink);
            }
        }
    }
</style>