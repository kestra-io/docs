<template>
    <div ref="container" class="container-fluid bg-dark-4">
        <div class="container">
            <div class="mb-5">
                <h2 class="title">Integrate with over 400 plugins you already <span>know</span> and <span>love</span></h2>
                <LayoutPlugins />
            </div>
        </div>
    </div>
</template>

<script>
    import Section from '../layout/Section.vue';

    export default {
        components: {Section},
        data() {
            return {
                active: 1,
            };
        },
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
        background: url("/landing/home/plugins/background.webp") no-repeat center;
        background-size: 100% 100%;

        overflow-x: hidden;
        color: var(--bs-white);
        padding: 0;

        .container {
            padding: 4rem 0;
            border-bottom: $block-border;
            border-top: $block-border;
        }

        .title {
            margin: 0;
            color: var(--bs-white);
            text-align: center;
            font-family: $font-family-sans-serif;
            font-size: calc($font-size-base * 3.125);
            font-style: normal;
            font-weight: 400;
            line-height: 4rem;
            padding: 0 20%;
            @include media-breakpoint-down(sm) {
                font-size: 1.875rem;
                line-height: 2.563rem;
            }

            @include media-breakpoint-down(lg) {
                padding: 0;
            }

            span {
                background: linear-gradient(91deg, #E151F7 43.87%, #5C47F5 55.51%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }

        .row {
            div:nth-child(2) {
                @include media-breakpoint-up(lg) {
                    padding: calc($spacer * 4) calc($spacer * 4) 0;
                }

                h2 {
                    margin-bottom: calc($spacer * 2);
                    background: linear-gradient(90.03deg, #E151F7 2.16%, #5C47F5 65.09%);
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    text-fill-color: transparent;
                }

                p {
                    font-size: $font-size-lg;
                }
            }
        }
    }


</style>