<template>
    <div class="container-fluid bg-dark-1">
        <div class="container">
            <h5>{{ title }}</h5>
            <span>{{ subtitle }}</span>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                required: true,
            },
            subtitle: {
                type: String,
                required: true,
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .container-fluid {
        text-align: center;
        color: $white;
        font-family: $font-family-sans-serif;
        font-weight: 300;

        .container {
            padding-top: calc($spacer * 5.625);
            padding-bottom: calc($spacer * 5.625);
            h5 {
                font-size: 3.125rem;
                margin-bottom: $rem-1;
                font-weight: 300;
            }

            span {
                font-size: $h6-font-size;
            }
        }
    }
</style>